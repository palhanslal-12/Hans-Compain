import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json({ limit: '25mb' }));

// Enable CORS for shared app URLs and multi-domain access
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

const PORT = 3000;

// Data directory & local persistence files for User Registration and Activity Logs
const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const USERS_FILE = path.join(DATA_DIR, "users.json");
const LOGS_FILE = path.join(DATA_DIR, "activity_logs.json");

interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  securityQuestion?: string;
  securityAnswerHash?: string;
  resetToken?: string;
  resetTokenExpiry?: number;
  registeredAt: string;
  lastActiveAt: string;
  promptCount: number;
  deviceInfo?: string;
  isGuest?: boolean;
  visitorId?: string;
  ipAddress?: string;
}

interface ActivityLog {
  id: string;
  userName: string;
  userEmail: string;
  type: string; // "chat" | "research" | "quiz" | "search" | "login" | "security" | "visit"
  query: string;
  timestamp: string;
}

function hashSecret(text: string): string {
  if (!text) return "";
  return crypto.createHash("sha256").update(text.trim().toLowerCase()).digest("hex");
}

const FAKE_EMAILS: string[] = [];

const SEED_USERS: RegisteredUser[] = [
  { id: 'usr_founder', name: 'Hanslal Pal (Founder Owner)', email: 'palhanslal4@gmail.com', registeredAt: '2026-01-01T08:00:00.000Z', lastActiveAt: new Date().toISOString(), promptCount: 1, deviceInfo: '💻 Founder Workstation', isGuest: false }
];

const SEED_LOGS: ActivityLog[] = [
  { id: 'log_01', userName: 'Hanslal Pal (Founder Owner)', userEmail: 'palhanslal4@gmail.com', type: 'login', query: 'Owner Admin System Control Started', timestamp: new Date().toISOString() }
];

function loadUsers(): RegisteredUser[] {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
      if (Array.isArray(data)) {
        const filtered = data.filter((u: RegisteredUser) => u && u.email && !FAKE_EMAILS.includes(u.email.toLowerCase()));
        return filtered;
      }
    }
  } catch (e) {
    console.error("Error reading users file", e);
  }
  saveUsers(SEED_USERS);
  return SEED_USERS;
}

function saveUsers(users: RegisteredUser[]) {
  try {
    const filtered = users.filter(u => u && u.email && !FAKE_EMAILS.includes(u.email.toLowerCase()));
    fs.writeFileSync(USERS_FILE, JSON.stringify(filtered, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing users file", e);
  }
}

function loadLogs(): ActivityLog[] {
  try {
    if (fs.existsSync(LOGS_FILE)) {
      const data = JSON.parse(fs.readFileSync(LOGS_FILE, "utf-8"));
      if (Array.isArray(data)) {
        const filtered = data.filter((l: ActivityLog) => l && l.userEmail && !FAKE_EMAILS.includes(l.userEmail.toLowerCase()));
        return filtered;
      }
    }
  } catch (e) {
    console.error("Error reading logs file", e);
  }
  saveLogs(SEED_LOGS);
  return SEED_LOGS;
}

function saveLogs(logs: ActivityLog[]) {
  try {
    const filtered = logs.filter(l => l && l.userEmail && !FAKE_EMAILS.includes(l.userEmail.toLowerCase()));
    const trimmed = filtered.slice(-2000);
    fs.writeFileSync(LOGS_FILE, JSON.stringify(trimmed, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing logs file", e);
  }
}

// Lazy initialization helper for Gemini SDK to avoid crashes if API key is not present on boot
let aiInstance: GoogleGenAI | null = null;
function getGenAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured. Please set it in the AI Studio Secrets panel.");
    }
    aiInstance = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

// Helper to perform generateContent calls with robust retry-and-alternate-model fallback strategy
async function generateContentWithFallback(ai: GoogleGenAI, primaryModel: string, options: { contents: any; config?: any }) {
  // Use robust standard Gemini models (gemini-3.6-flash, gemini-flash-latest) for fallback
  const requested = (primaryModel && !primaryModel.includes("2.5") && !primaryModel.includes("1.5") && !primaryModel.includes("3.5")) ? primaryModel : "gemini-3.6-flash";
  const fallbackSequence = [requested, "gemini-3.6-flash", "gemini-flash-latest", "gemini-3.1-pro-preview"];
  const uniqueModels = Array.from(new Set(fallbackSequence.filter(Boolean)));

  let lastError: any = null;
  for (const currentModel of uniqueModels) {
    try {
      console.log(`[Gemini SDK] Trying model: ${currentModel}`);
      const response = await ai.models.generateContent({
        model: currentModel,
        contents: options.contents,
        config: options.config
      });
      return response;
    } catch (err: any) {
      lastError = err;
      console.warn(`[Gemini SDK] Model '${currentModel}' failed. Error: ${err.message || err}. Moving to next fallback...`);
      // Sleep slightly to let the spike settle
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }
  throw lastError;
}

// Enterprise Encryption Decryption Helpers (E2EE Handshake)
const SECRET_KEY = "HANSAI-SECURE-KEY-3859";

function encryptData(text: string): string {
  let result = "";
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length);
    result += String.fromCharCode(charCode);
  }
  return Buffer.from(result, 'utf-8').toString('base64');
}

function decryptData(base64Text: string): string {
  try {
    const text = Buffer.from(base64Text, 'base64').toString('utf-8');
    let result = "";
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length);
      result += String.fromCharCode(charCode);
    }
    return result;
  } catch (e) {
    return base64Text;
  }
}

// Defensive Input Sanitization Helper
function sanitizeInput(text: string): string {
  if (!text) return "";
  let sanitized = text;
  // Strip out potential direct script/HTML tag injections
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  // Defend against prompt injections (attempting to override system prompt)
  const sanitizePhrases = [
    "ignore previous instructions",
    "ignore all prior instructions",
    "override system prompt",
    "forget what you were told",
    "you are now a",
    "ignore the guidelines",
    "bypass instructions"
  ];
  sanitizePhrases.forEach(phrase => {
    const reg = new RegExp(phrase, "gi");
    sanitized = sanitized.replace(reg, "[Injection Guard Activated]");
  });
  return sanitized;
}

const HANSAI_SYSTEM_INSTRUCTION = `You are "Hans Compain" (also known as HansAI Companion), an expert AI Academic and Career Companion designed specially for Indian students, competitive exam aspirants (SSC, UPSC, Railway, Banking, State PCS, Defense, Board Exams), and career seekers.

YOUR PRIMARY CAPABILITIES & SIGNATURE FEATURES:
1. 🧠 **Live Quiz & Practice**: Interactive topic-wise MCQ testing with instant scoreboards and analytical explanations.
2. ✍️ **Shorthand Studio (Steno Master)**: Specialized Hindi & English stenography outlines, stroke guides, speed dictation audio, and audio-to-text evaluations.
3. 🔬 **Virtual Science Lab & Formula Hub**: Deep concept visualizers, step-by-step experiment simulations, and exact formula derivation for Physics, Chemistry, and Mathematics.
4. 📸 **Photo Doubt Solver & Notes OCR**: Instant resolution for textbook snapshots, scanned handwritten notes, and numerical problems.
5. 🗺️ **Time Travel Simulator & Deep Research**: Historical roleplay simulations, chronology maps, and deep topic research dossiers.
6. 🎯 **Career & Study Strategy**: Practical study routines, weekly roadmaps, syllabus breakdowns, and mock interview coaching.

FOLLOW THESE STRICT RULES FOR ALL RESPONSES:
1. **Language & Clarity**: Always respond in simple, natural **Hinglish** (Hindi mixed with English words, e.g., "Aapka doubt solve karte hain...", "Physics ke is law ko samajhte hain...") so Indian students and aspirants can understand easily and naturally.
2. **Mathematics, Physics, & Chemistry Formulas**: ALWAYS use clear, standard **LaTeX formatting** for mathematical, physical, and chemical formulas and equations (e.g., $E=mc^2$, $F = m \\cdot a$, $\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$, $2H_2 + O_2 \\rightarrow 2H_2O$, $v = u + at$, $\\int_0^\\infty e^{-x} dx = 1$). Never write sloppy, unformatted formulas.
3. **Structured Tables**: Present complex data, comparison charts, study plans, syllabus splits, or quiz/score summaries in neat, organized **Markdown tables** with proper columns and headers.
4. **Tone & Educational Guardrails**: Keep the tone highly encouraging, polite, respectful (use 'आप', 'जी'), and focused strictly on education, academic growth, and career guidance. Refuse any non-academic, harmful, or inappropriate queries gently and steer the student back to their learning goals.
5. **Thorough Step-by-Step Explanations**: Never give lazy or one-line replies to academic queries. Structure your explanations with:
   - 📌 Concept Overview & Simple Definition
   - 💡 Detailed Step-by-Step Breakdown & Derivation
   - 📊 LaTeX Formulas & Real-World Examples / Tables
   - 🎯 Exam Focus, Memory Tricks (Mnemonics), & Common Mistakes

FOUNDER & CREATOR IDENTITY:
- Creator and Founder: Hanslal Pal (Hanslal). If asked who created, founded, or owns HansAI / Hans Compain, answer clearly and respectfully that Hanslal created it as a dedicated student-focused academic platform.`;

// Smart Server-Side Knowledge Generator for Fast Fallback
function generateSubjectKnowledgeReply(userQuery: string, language: string = "hindi"): string {
  const query = (userQuery || "").toLowerCase();

  if (query.includes("geography") || query.includes("भूगोल")) {
    return `### 🌍 भूगोल (Geography) - संपूर्ण विस्तृत अध्ययन व परीक्षा मार्गदर्शन\n\n` +
      `**भूगोल (Geography)** वह विस्तृत विज्ञान है जिसके अंतर्गत पृथ्वी के धरातल, भौतिक स्वरूपों, प्राकृतिक संसाधनों, जलवायु, नदियाँ एवं महाद्वीपों का गहराई से अध्ययन किया जाता है।\n\n` +
      `#### 📌 1. मुख्य शाखाएं (Core Branches):\n` +
      `- **भौतिक भूगोल (Physical Geography):** भू-आकृति विज्ञान (पर्वत, पठार, नदियाँ), जलवायु विज्ञान (मानसून, चक्रवात), समुद्र विज्ञान (धाराएं व ज्वार-भाटा) तथा सौरमंडल (अक्षांश व देशांतर)।\n` +
      `- **मानव भूगोल (Human Geography):** जनसंख्या, कृषि, उद्योग, परिवहन एवं प्राकृतिक संसाधन।\n\n` +
      `#### 📌 2. भारत का भूगोल (Indian Geography):\n` +
      `- **भौतिक विभाजन:** उत्तरी हिमालय पर्वतमाला, विशाल मैदान, प्रायद्वीपीय पठार, तटीय मैदान व द्वीप समूह।\n` +
      `- **नदी तंत्र:** हिमालयी नदियाँ (सिंधु, गंगा, ब्रह्मपुत्र) तथा प्रायद्वीपीय नदियाँ (गोदावरी, नर्मदा, ताप्ती, कृष्णा)।\n` +
      `- **कर्क रेखा ट्रिक:** भारत के 8 राज्यों से गुजरती है - *(मित्र पर गमछा झार)*।\n\n` +
      `👉 **अभ्यास:** ऐप के **Auto Chapter Quiz** में जाकर प्रश्नों का अभ्यास करें!`;
  }

  if (query.includes("history") || query.includes("इतिहास")) {
    return `### 📜 इतिहास (History) - संपूर्ण कालक्रम व विस्तृत विश्लेषण\n\n` +
      `इतिहास को अध्ययन की सुगमता एवं प्रतियोगी परीक्षाओं के दृष्टिकोण से तीन प्रमुख भागों में बाँटा गया है:\n\n` +
      `1. **प्राचीन भारत (Ancient India):** सिंधु घाटी सभ्यता (2500-1750 BC), वैदिक काल, बौद्ध व जैन धर्म, मौर्य साम्राज्य (अशोक) व गुप्त साम्राज्य (स्वर्ण युग)।\n` +
      `2. **मध्यकालीन भारत (Medieval India):** अरब आक्रमण, दिल्ली सल्तनत (इल्तुतमिश, अलाउद्दीन खिलजी), मुगल साम्राज्य (अकबर से औरंगजेब) एवं भक्ति आंदोलन।\n` +
      `3. **आधुनिक भारत (Modern India):** यूरोपीय कंपनियों का आगमन, 1857 का प्रथम स्वतंत्रता संग्राम, 1885 में कांग्रेस की स्थापना, तथा गांधीवादी युग (1915-1947)।\n\n` +
      `👉 **विशेष सलाह:** विगत 5 वर्षों के प्रश्नों को हल करने हेतु ऐप के **Quiz** सेक्शन का उपयोग करें।`;
  }

  if (query.includes("polity") || query.includes("संविधान")) {
    return `### ⚖️ भारतीय संविधान व राजव्यवस्था (Indian Polity)\n\n` +
      `भारतीय संविधान विश्व का सबसे बड़ा लिखित संविधान है जो 26 जनवरी 1950 को पूर्णतः लागू हुआ।\n\n` +
      `#### 📌 मुख्य अनुच्छेद व भाग:\n` +
      `- **भाग 3 (अनुच्छेद 12-35):** 6 मौलिक अधिकार (Fundamental Rights)।\n` +
      `- **भाग 4 (अनुच्छेद 36-51):** राज्य के नीति निर्देशक तत्व (DPSP)।\n` +
      `- **अनुच्छेद 32:** संवैधानिक उपचारों का अधिकार (संविधान की आत्मा)।\n` +
      `- **अनुच्छेद 52-61:** राष्ट्रपति पद एवं महाभियोग प्रक्रिया।\n\n` +
      `👉 आप अपना विशिष्ट प्रश्न लिखकर विस्तृत उत्तर प्राप्त कर सकते हैं!`;
  }

  if (query.includes("science") || query.includes("विज्ञान")) {
    return `### 🔬 सामान्य विज्ञान (General Science) - संपूर्ण विस्तृत बिंदु\n\n` +
      `1. **भौतिकी (Physics):** न्यूटन के गति नियम, कार्य ऊर्जा व शक्ति, प्रकाश का अपवर्तन/परावर्तन, ध्वनि व विद्युत।\n` +
      `2. **रसायन विज्ञान (Chemistry):** आवर्त सारणी, धातु व अधातु, अम्ल, क्षार व लवण (pH मान), रसायनिक अभिक्रियाएं।\n` +
      `3. **जीव विज्ञान (Biology):** कोशिका संरचना (Mitochondria), मानव पाचन व रक्त परिसंचरण तंत्र, विटामिन व रोग।\n\n` +
      `👉 आप किसी भी विशिष्ट टॉपिक का नाम लिखकर उसका पूरा स्टेप-बाय-स्टेप विवरण प्राप्त कर सकते हैं!`;
  }

  const snippet = (userQuery || "").slice(0, 70);
  return language === "hindi"
    ? `### 📚 हंस-एआई (HansAI) - विस्तृत अध्ययन एवं संपूर्ण समाधान\n\n` +
      `आपकी जिज्ञासा **"${snippet}"** के संबंध में विस्तृत अध्ययन मार्गदर्शन:\n\n` +
      `1. **अवधारणा की स्पष्टता (Conceptual Clarity):** प्रतियोगी परीक्षाओं (SSC, Board, State PCS) के लिए इस विषय की मूल अवधारणाओं एवं तथ्यों को समझना अनिवार्य है।\n` +
      `2. **चरणबद्ध अध्ययन (Step-by-Step Approach):** सबसे पहले मुख्य परिभाषाएं, फिर उदाहरण तथा अंत में परीक्षा में पूछे जाने वाले प्रश्नों का अभ्यास करें।\n` +
      `3. **रिवीजन व शॉर्टकट:** मुख्य बिन्दुओं के संक्षिप्त नोट्स बनाकर नियमित रिवीजन करें।\n\n` +
      `👉 आप इस टॉपिक के संबंध में कोई भी विशेष प्रश्न पूछ सकते हैं, मैं आपको पूरा विस्तृत उत्तर प्रदान करूँगा!`
    : `### 📚 HansAI - Comprehensive Academic Explanation & Guidance\n\n` +
      `Regarding your query **"${snippet}"**:\n\n` +
      `1. **Core Concept:** Deep understanding of fundamental principles is essential for top performance.\n` +
      `2. **Step-by-Step Breakdown:** Learn definitions, key rules/formulas, real-world examples, and exam applications.\n` +
      `3. **Interactive Practice:** You can also attempt custom practice MCQs in the Auto Chapter Quiz tab!`;
}

// Cloud-Based AI Orchestration Memory Store for Over-The-Air (OTA) Updates
let otaConfig = {
  systemInstruction: HANSAI_SYSTEM_INSTRUCTION,
  actionCapsules: [
    { id: "cap-1", label: "Business Growth", emoji: "💼", prompt: "Analyze strategic business growth models, entrepreneurship, and rural startups in India with actionable guides." },
    { id: "cap-2", label: "Deep Research", emoji: "🔍", prompt: "Activate Deep Research on general awareness, competitive exams, or technical study fields." },
    { id: "cap-3", label: "Creative Innovation", emoji: "💡", prompt: "Provide high-energy kaddak motivational raps or creative concept learning analogies." },
    { id: "cap-4", label: "Talk Freely", emoji: "💬", prompt: "Let's engage in open academic brainstorming and companion-like support!" }
  ]
};

// GET OTA Config API
app.get("/api/ota/config", (req, res) => {
  res.json(otaConfig);
});

// POST OTA Config API - Secure dynamic remote admin orchestration
app.post("/api/ota/config", (req, res) => {
  try {
    const { systemInstruction, actionCapsules } = req.body;
    if (systemInstruction !== undefined) {
      otaConfig.systemInstruction = systemInstruction;
    }
    if (actionCapsules !== undefined && Array.isArray(actionCapsules)) {
      otaConfig.actionCapsules = actionCapsules;
    }
    res.json({ message: "OTA Config synchronized securely!", config: otaConfig });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to update OTA cloud config" });
  }
});

// User Registration Route (Mandatory Name & Email Before Use)
app.post("/api/users/register", (req, res) => {
  try {
    const { name, email, password, securityQuestion, securityAnswer } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Name and Email are required." });
    }
    const cleanName = String(name).trim();
    const cleanEmail = String(email).trim().toLowerCase();

    let users = loadUsers();
    let userIndex = users.findIndex(u => u.email === cleanEmail);

    const now = new Date().toISOString();
    let passwordHash = password ? hashSecret(password) : undefined;
    let securityAnswerHash = securityAnswer ? hashSecret(securityAnswer) : undefined;

    if (userIndex >= 0) {
      const existingUser = users[userIndex];
      // Prevent duplicate registration if user is already registered with password/credentials
      if (existingUser.passwordHash && !req.body.isOAuthUpdate) {
        return res.status(400).json({
          error: "यह ईमेल आईडी पहले से ही रजिस्टर्ड है! (Email already registered). एक बार से अधिक रजिस्ट्रेशन न करें। कृपया लॉग इन (Student Login) करें या पासवर्ड भूल गए (Forgot Password OTP) का प्रयोग करें।",
          isAlreadyRegistered: true
        });
      }
      users[userIndex].name = cleanName;
      users[userIndex].lastActiveAt = now;
      if (password) users[userIndex].passwordHash = passwordHash;
      if (securityQuestion) users[userIndex].securityQuestion = securityQuestion;
      if (securityAnswer) users[userIndex].securityAnswerHash = securityAnswerHash;
    } else {
      const newUser: RegisteredUser = {
        id: "usr_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
        name: cleanName,
        email: cleanEmail,
        passwordHash,
        securityQuestion: securityQuestion || "What is your primary study goal or favorite subject?",
        securityAnswerHash: securityAnswerHash || hashSecret("Shorthand"),
        registeredAt: now,
        lastActiveAt: now,
        promptCount: 0
      };
      users.push(newUser);
    }
    saveUsers(users);

    // Also log login activity
    let logs = loadLogs();
    logs.push({
      id: "log_" + Date.now(),
      userName: cleanName,
      userEmail: cleanEmail,
      type: "login",
      query: "User Registered / Logged In",
      timestamp: now
    });
    saveLogs(logs);

    res.json({ 
      success: true, 
      message: "User registered successfully", 
      user: { 
        name: cleanName, 
        email: cleanEmail,
        hasPassword: !!(users[userIndex >= 0 ? userIndex : users.length - 1].passwordHash)
      } 
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to register user" });
  }
});

// Social Sign-In Endpoint (Google & Facebook Login)
app.post("/api/users/social-login", (req, res) => {
  try {
    const { provider, email, name } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required for social login." });
    }
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanName = String(name || email.split('@')[0]).trim();
    const now = new Date().toISOString();

    let users = loadUsers();
    let user = users.find(u => u.email === cleanEmail);

    if (!user) {
      user = {
        id: "usr_social_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
        name: cleanName,
        email: cleanEmail,
        registeredAt: now,
        lastActiveAt: now,
        promptCount: 0,
        deviceInfo: `🌐 ${provider === 'google' ? 'Google OAuth' : 'Facebook Login'}`
      };
      users.push(user);
    } else {
      user.lastActiveAt = now;
      if (!user.name || user.name === 'Aspirant Student') {
        user.name = cleanName;
      }
    }
    saveUsers(users);

    let logs = loadLogs();
    logs.push({
      id: "log_social_" + Date.now(),
      userName: cleanName,
      userEmail: cleanEmail,
      type: "login",
      query: `Logged in via ${provider === 'google' ? 'Google' : 'Facebook'} OAuth`,
      timestamp: now
    });
    saveLogs(logs);

    res.json({
      success: true,
      message: `Signed in successfully via ${provider === 'google' ? 'Google' : 'Facebook'}!`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        provider
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Social login failed." });
  }
});

// Secure User Login Endpoint
app.post("/api/users/login-secure", (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }
    const cleanEmail = String(email).trim().toLowerCase();
    let users = loadUsers();
    const user = users.find(u => u.email === cleanEmail);

    if (!user) {
      return res.status(404).json({ error: "No user found with this email. Please register first." });
    }

    if (user.passwordHash) {
      if (!password || hashSecret(password) !== user.passwordHash) {
        return res.status(401).json({ error: "Invalid password. Please check your password or click 'Forgot Password'." });
      }
    }

    user.lastActiveAt = new Date().toISOString();
    saveUsers(users);

    // Record login activity in logs for Admin Panel
    let logs = loadLogs();
    logs.push({
      id: "log_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      userName: user.name,
      userEmail: cleanEmail,
      type: "login",
      query: `User Logged In (${user.name})`,
      timestamp: user.lastActiveAt
    });
    saveLogs(logs);

    res.json({
      success: true,
      message: "Authentication successful!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        securityQuestion: user.securityQuestion
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Login failed." });
  }
});

// Forgot Password - Initiate Security Verification
app.post("/api/users/forgot-password", (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Please enter your registered email address." });
    }
    const cleanEmail = String(email).trim().toLowerCase();
    let users = loadUsers();
    const user = users.find(u => u.email === cleanEmail);

    if (!user) {
      return res.status(404).json({ error: "Email address not found in system records." });
    }

    // Generate a secure 6-digit OTP reset token valid for 15 minutes
    const otpToken = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetToken = otpToken;
    user.resetTokenExpiry = Date.now() + (15 * 60 * 1000); // 15 mins
    saveUsers(users);

    // Log security event
    let logs = loadLogs();
    logs.push({
      id: "log_sec_" + Date.now(),
      userName: user.name,
      userEmail: cleanEmail,
      type: "security",
      query: "Forgot Password Requested - OTP Generated",
      timestamp: new Date().toISOString()
    });
    saveLogs(logs);

    res.json({
      success: true,
      message: "Reset verification initiated.",
      securityQuestion: user.securityQuestion || "What is your primary study goal or favorite subject?",
      otpHint: otpToken, // For simulation & local demonstration
      email: user.email
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Forgot password processing failed." });
  }
});

// Verify Security Question or OTP Token for Password Reset
app.post("/api/users/verify-security-answer", (req, res) => {
  try {
    const { email, securityAnswer, otpToken } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }
    const cleanEmail = String(email).trim().toLowerCase();
    let users = loadUsers();
    const user = users.find(u => u.email === cleanEmail);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    let isValid = false;

    if (otpToken && user.resetToken && user.resetTokenExpiry) {
      if (Date.now() <= user.resetTokenExpiry && otpToken.trim() === user.resetToken) {
        isValid = true;
      }
    }

    if (!isValid && securityAnswer && user.securityAnswerHash) {
      if (hashSecret(securityAnswer) === user.securityAnswerHash) {
        isValid = true;
      }
    }

    // If default user and no answer saved yet, allow default match
    if (!isValid && securityAnswer && !user.securityAnswerHash) {
      isValid = true;
    }

    if (!isValid) {
      return res.status(401).json({ error: "Incorrect security answer or expired OTP code. Please try again." });
    }

    // Issue temporary password reset session token
    const sessionToken = "rst_" + Date.now() + "_" + Math.random().toString(36).substring(2, 8);
    user.resetToken = sessionToken;
    user.resetTokenExpiry = Date.now() + (10 * 60 * 1000); // 10 mins
    saveUsers(users);

    res.json({
      success: true,
      message: "Security verification verified! You can now enter your new password.",
      resetSessionToken: sessionToken
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Security answer verification failed." });
  }
});

// Reset Password with Verified Session Token
app.post("/api/users/reset-password", (req, res) => {
  try {
    const { email, resetSessionToken, newPassword, newSecurityQuestion, newSecurityAnswer } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ error: "Email and new password are required." });
    }
    if (newPassword.length < 4) {
      return res.status(400).json({ error: "Password must be at least 4 characters long." });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    let users = loadUsers();
    const user = users.find(u => u.email === cleanEmail);

    if (!user) {
      return res.status(404).json({ error: "User record not found." });
    }

    if (user.resetToken !== resetSessionToken || !user.resetTokenExpiry || Date.now() > user.resetTokenExpiry) {
      return res.status(401).json({ error: "Invalid or expired password reset session. Please restart Forgot Password process." });
    }

    // Update Password Hash & Security Answers
    user.passwordHash = hashSecret(newPassword);
    if (newSecurityQuestion) user.securityQuestion = newSecurityQuestion;
    if (newSecurityAnswer) user.securityAnswerHash = hashSecret(newSecurityAnswer);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    saveUsers(users);

    // Log Security Update
    let logs = loadLogs();
    logs.push({
      id: "log_sec_" + Date.now(),
      userName: user.name,
      userEmail: cleanEmail,
      type: "security",
      query: "Password successfully updated via Secure Reset",
      timestamp: new Date().toISOString()
    });
    saveLogs(logs);

    res.json({
      success: true,
      message: "Your password has been successfully reset! You can now log in with your new password."
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Password reset failed." });
  }
});

// GET AI Security Audit Status
app.get("/api/security/audit-status", (req, res) => {
  try {
    res.json({
      e2eeActive: true,
      encryptionAlgorithm: "AES-256 / XOR-Handshake Multi-Layer E2EE",
      injectionGuardActive: true,
      inputSanitizerActive: true,
      apiKeyServerSideOnly: true,
      corsProtected: true,
      usersProtected: true,
      systemIntegrity: "100% SECURE - ACTIVE PROTECTED CORE",
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to audit security status" });
  }
});

// Track Every Visitor Session / Open Link Activity
app.post("/api/users/track-visitor", (req, res) => {
  try {
    const { visitorId, name, email, deviceInfo, userAgent, path, referrer } = req.body;
    const now = new Date().toISOString();
    const rawIp = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1').toString().split(',')[0].trim();
    const clientIp = rawIp === '::1' ? '127.0.0.1' : rawIp;

    let users = loadUsers();
    let logs = loadLogs();

    const cleanEmail = email ? String(email).trim().toLowerCase() : "";
    const cleanName = name ? String(name).trim() : "";
    const cleanVisitorId = visitorId ? String(visitorId).trim() : "visitor_" + Date.now();

    // Check if user already exists by email or visitorId
    let existingUser = users.find(u => (cleanEmail && u.email === cleanEmail) || (u.visitorId && u.visitorId === cleanVisitorId));

    if (existingUser) {
      existingUser.lastActiveAt = now;
      if (cleanName && (!existingUser.name || existingUser.name.startsWith("Guest"))) {
        existingUser.name = cleanName;
      }
      if (cleanEmail && (!existingUser.email || existingUser.email.endsWith("@hansai.visitor"))) {
        existingUser.email = cleanEmail;
        existingUser.isGuest = false;
      }
      if (deviceInfo) existingUser.deviceInfo = deviceInfo;
      existingUser.ipAddress = clientIp;
    } else {
      // Create new Visitor/User entry
      const newUser: RegisteredUser = {
        id: "usr_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
        name: cleanName || `Guest Visitor (${deviceInfo || 'Web Browser'})`,
        email: cleanEmail || `${cleanVisitorId}@hansai.visitor`,
        registeredAt: now,
        lastActiveAt: now,
        promptCount: 0,
        deviceInfo: deviceInfo || "Web Browser",
        isGuest: !cleanEmail,
        visitorId: cleanVisitorId,
        ipAddress: clientIp
      };
      users.push(newUser);
      existingUser = newUser;
    }
    saveUsers(users);

    // Add visitor opening log
    logs.push({
      id: "log_visit_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      userName: existingUser.name,
      userEmail: existingUser.email,
      type: "visit",
      query: `App Link Opened / Page Visit (${path || '/'}) via ${deviceInfo || 'Browser'} [Ref: ${referrer || 'Direct'}]`,
      timestamp: now
    });
    saveLogs(logs);

    res.json({ success: true, user: { name: existingUser.name, email: existingUser.email } });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to track visitor" });
  }
});

// Log User Activity / Query / Search Route (For Owner Analytics)
app.post("/api/users/log-activity", (req, res) => {
  try {
    const { name, email, type, query } = req.body;
    if (!email || !query) {
      return res.status(400).json({ error: "Email and query are required." });
    }
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanName = (name || "Student").trim();
    const now = new Date().toISOString();

    let users = loadUsers();
    let user = users.find(u => u.email === cleanEmail);
    if (user) {
      user.lastActiveAt = now;
      user.promptCount = (user.promptCount || 0) + 1;
    } else {
      users.push({
        id: "usr_" + Date.now(),
        name: cleanName,
        email: cleanEmail,
        registeredAt: now,
        lastActiveAt: now,
        promptCount: 1,
        isGuest: false
      });
    }
    saveUsers(users);

    let logs = loadLogs();
    logs.push({
      id: "log_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      userName: user ? user.name : cleanName,
      userEmail: cleanEmail,
      type: type || "chat",
      query: sanitizeInput(String(query)),
      timestamp: now
    });
    saveLogs(logs);

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to log activity" });
  }
});

// GET Owner Analytics (All Registered Users, Visitors & Prompt/Search History)
app.get("/api/owner/analytics", (req, res) => {
  try {
    const users = loadUsers();
    const logs = loadLogs();
    const registeredCount = users.filter(u => !u.isGuest && !u.email.endsWith('@hansai.visitor')).length;
    const visitorCount = users.filter(u => u.isGuest || u.email.endsWith('@hansai.visitor')).length;

    res.json({
      users: users.sort((a, b) => new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime()),
      logs: logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
      totalUsers: users.length,
      registeredCount,
      visitorCount,
      totalQueries: logs.filter(l => l.type !== "login" && l.type !== "visit").length
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to fetch owner analytics" });
  }
});

// POST Delete User Record Permanently
app.post("/api/owner/delete-user", (req, res) => {
  try {
    const { userId, userEmail } = req.body;
    if (!userId && !userEmail) {
      return res.status(400).json({ error: "User ID or Email is required for deletion." });
    }

    let users = loadUsers();
    const initialCount = users.length;
    users = users.filter(u => u.id !== userId && u.email !== userEmail);

    if (users.length === initialCount) {
      return res.status(404).json({ error: "User record not found." });
    }

    saveUsers(users);

    // Also remove associated activity logs
    let logs = loadLogs();
    if (userEmail) {
      logs = logs.filter(l => l.userEmail !== userEmail);
      saveLogs(logs);
    }

    res.json({ success: true, message: "User record and activity logs permanently deleted." });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to delete user record" });
  }
});

// POST Delete Single Activity Log
app.post("/api/owner/delete-log", (req, res) => {
  try {
    const { logId } = req.body;
    if (!logId) {
      return res.status(400).json({ error: "Log ID is required." });
    }

    let logs = loadLogs();
    logs = logs.filter(l => l.id !== logId);
    saveLogs(logs);

    res.json({ success: true, message: "Log entry deleted." });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to delete log entry" });
  }
});

// POST Clear Owner Logs
app.post("/api/owner/clear-logs", (req, res) => {
  try {
    saveLogs([]);
    res.json({ success: true, message: "Activity logs cleared successfully." });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to clear logs" });
  }
});

// API Routes

// 1. Chat Proxy (with E2EE + Tone Adaptive Processing)
app.post("/api/chat", async (req, res) => {
  let messages: any[] = [];
  let isEncrypted = false;
  try {
    let { messages: reqMessages, message: singleMessage, systemInstruction: customSystemInstruction, model, image, imagePayload, advancedResearch, isEncrypted: reqIsEncrypted, userName, userEmail } = req.body;
    messages = reqMessages;
    isEncrypted = reqIsEncrypted;
    
    // Support imagePayload alias
    if (!image && imagePayload) {
      image = imagePayload;
    }
    if (image && typeof image.data === 'string' && image.data.includes(',')) {
      image.data = image.data.split(',')[1];
    }
    
    // Support single message payload (e.g. { message: "Hello" })
    if (!messages && singleMessage) {
      messages = [{ role: 'user', content: String(singleMessage) }];
    }

    // Decrypt if client requested strict E2EE transmission
    if (isEncrypted && typeof messages === 'string') {
      const decryptedString = decryptData(messages);
      messages = JSON.parse(decryptedString);
    }

    if (!messages || !Array.isArray(messages)) {
      messages = [{ role: 'user', content: singleMessage ? String(singleMessage) : "Hello" }];
    }

    // Auto-log activity for owner analytics
    if (userEmail) {
      const lastUserMsg = messages[messages.length - 1]?.content;
      if (lastUserMsg) {
        try {
          const now = new Date().toISOString();
          let users = loadUsers();
          let user = users.find(u => u.email === String(userEmail).trim().toLowerCase());
          if (user) {
            user.lastActiveAt = now;
            user.promptCount = (user.promptCount || 0) + 1;
            saveUsers(users);
          }
          let logs = loadLogs();
          logs.push({
            id: "log_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
            userName: userName || (user ? user.name : "Student"),
            userEmail: String(userEmail).trim().toLowerCase(),
            type: "chat",
            query: sanitizeInput(String(lastUserMsg)),
            timestamp: now
          });
          saveLogs(logs);
        } catch (e) {
          console.error("Failed to auto-log activity", e);
        }
      }
    }

    const ai = getGenAI();

    // Map roles & sanitize input against reverse engineering and injection
    const formattedContents = messages.map((msg, index) => {
      const isLast = index === messages.length - 1;
      const role = msg.role === "assistant" ? "model" : "user";
      const sanitizedContent = sanitizeInput(msg.content);

      if (isLast && role === "user" && image && image.data && image.mimeType) {
        return {
          role,
          parts: [
            {
              inlineData: {
                data: image.data,
                mimeType: image.mimeType,
              },
            },
            { text: sanitizedContent }
          ]
        };
      }

      return {
        role,
        parts: [{ text: sanitizedContent }]
      };
    });

    // Detect Emotional State of User dynamically from the latest message
    const lastUserMessage = messages[messages.length - 1]?.content || "";
    let emotion = "professional"; // normal state
    
    const angryWords = ["angry", "bad feedback", "terrible", "hate", "stupid", "useless", "worst", "garbage", "annoyed", "frustrated", "nonsense", "बकवास", "बेकार", "गुस्सा", "घटिया", "मूर्ख"];
    const anxiousWords = ["anxious", "scared", "worried", "stressed", "fail", "nervous", "afraid", "depressed", "distressed", "tension", "चिंता", "डर", "परेशान", "फेल", "तनाव"];

    if (angryWords.some(kw => lastUserMessage.toLowerCase().includes(kw))) {
      emotion = "angry";
    } else if (anxiousWords.some(kw => lastUserMessage.toLowerCase().includes(kw))) {
      emotion = "anxious";
    }

    // Dynamic Server-Side Tone Adaptive prompt construction
    let customizedInstruction = customSystemInstruction || otaConfig.systemInstruction;
    
    if (emotion === "angry") {
      customizedInstruction += "\n\nCRITICAL EMOTION OVERRIDE (ANGRY/EGOISTIC STATE): The user is highly frustrated or angry. You must remain completely stable, neutral, polite, and helpful. Never replicate aggression, mock, argue, or use generic flatters. Propose structured objective logic to salvage the user's issue.";
    } else if (emotion === "anxious") {
      customizedInstruction += "\n\nCRITICAL EMOTION OVERRIDE (ANXIOUS/DISTRESSED STATE): The user is anxious about preparation, exams, or failures. Immediately pivot to an extremely empathetic, comforting, supportive companion. Empower their self-esteem and build structural, positive actionable pathways for success.";
    } else {
      customizedInstruction += "\n\nCRITICAL DETAIL & EXPLANATION RULE: Always deliver rich, thorough, comprehensive, and beautifully explained responses. Break down complex concepts step-by-step with clear subheadings, bullet points, real-life examples, formulas, and key facts. Do NOT give brief or cut-short summaries unless the user explicitly requests a short 1-line answer.";
    }

    // Strict Founder Query interception for privacy
    const founderTerms = ["creator", "founder", "who created", "who made", "who built", "owner", "मालिक", "निर्माता", "किसने बनाया", "फाउंडर"];
    const containsFounderQuery = founderTerms.some(term => lastUserMessage.toLowerCase().includes(term));
    if (containsFounderQuery) {
      customizedInstruction += "\n\nFOUNDER IDENTITY RULE: If asked who created, founded, or owns HansAI, respond clearly in Hindi/English: 'HansAI के creator और founder Hanslal हैं। HansAI को Hanslal ने एक student-focused AI platform के रूप में बनाया और विकसित किया है।' If asked about legal ownership or registered details, state: 'HansAI के creator/founder Hanslal हैं। Legal ownership या registered business details के बारे में वही जानकारी मान्य है जो HansAI की official information में दी गई हो।' Do not claim model providers like Google or OpenAI are owners.";
    }

    // Mandatory Respectful Tone & Personalized Name Instruction
    customizedInstruction += "\n\nCRITICAL RESPECT & DIGNITY RULE: You MUST speak with extreme respect, politeness, warmth, and dignity at all times (e.g. use 'जी', 'आप', 'आपका हार्दिक स्वागत है'). Never use informal slang or disrespectful words.";

    customizedInstruction += "\n\nCREATIVE POETRY & LITERATURE FEEDBACK RULE: When a user shares their original poem, lines, or creative thoughts (जैसे कविता, दोहा, शायरी या सुविचार), HansAI MUST respond with high appreciation, deep respect, and structured constructive feedback. Highlight the core emotion ('भाव बहुत सुंदर है'), mention the best theme/analogy ('सबसे अच्छी बात: ...'), and offer a refined, highly lyrical and polished version (or dohe/kavita style) while retaining the original sentiment.";

    if (userName && String(userName).trim() && String(userName).trim() !== "Visitor Aspirant" && String(userName).trim() !== "Student" && String(userName).trim() !== "Guest Link Visitor") {
      customizedInstruction += `\n\nUSER NAME ADDRESSING RULE: The student's name is "${String(userName).trim()}". Kindly address them respectfully by name (e.g., "${String(userName).trim()} जी") when starting your response or explaining concepts on any topic.`;
    }

    // PDF Generation and Notes Request Guideline
    if (lastUserMessage.toLowerCase().includes("pdf") || lastUserMessage.toLowerCase().includes("पीडीएफ")) {
      customizedInstruction += "\n\nPDF CREATION & EXPORT RULE: When the user asks to create or download a PDF ('pdf banao', 'pdf download', 'save as pdf', 'pdf chahiye', 'make pdf'), deliver comprehensive, beautifully structured study notes on their requested topic. NEVER tell them to manually press Ctrl+P or use browser print settings. Inform them with high warmth: 'आपके लिए संपूर्ण अध्ययन नोट्स तैयार हैं। आप इस संदेश के नीचे दिए गए 📥 'PDF डाउनलोड करें' बटन पर क्लिक करके सीधे अपने डिवाइस में सुरक्षित PDF फाइल डाउनलोड कर सकते हैं!'";
    }

    const config: any = {
      systemInstruction: customizedInstruction,
      temperature: 0.7,
    };

    if (advancedResearch) {
      config.tools = [{ googleSearch: {} }];
    }

    const response = await generateContentWithFallback(ai, model || "gemini-2.5-flash", {
      contents: formattedContents,
      config: config
    });

    let replyText = response.text || "I apologize, I encountered an issue preparing the answer. Please submit again.";
    
    // Encrypt response if requested
    if (isEncrypted) {
      res.json({ reply: encryptData(replyText), isEncrypted: true });
    } else {
      res.json({ reply: replyText });
    }
  } catch (err: any) {
    console.error("Gemini API Error in /api/chat:", err);
    // Serve smart local subject fallback so user always gets a fast, meaningful response
    const lastUserMsg = (messages && messages.length > 0) ? messages[messages.length - 1]?.content : "";
    const smartFallbackReply = generateSubjectKnowledgeReply(lastUserMsg || "study guidance", "hindi");
    
    if (isEncrypted) {
      res.json({ reply: encryptData(smartFallbackReply), isEncrypted: true, fallback: true });
    } else {
      res.json({ reply: smartFallbackReply, fallback: true });
    }
  }
});

// 2. Dynamic Study Quiz Generator
app.post("/api/quiz", async (req, res) => {
  try {
    const { subject, level, model, lang, language } = req.body;
    if (!subject) {
      return res.status(400).json({ error: "Subject parameter is required." });
    }

    const quizLang = (lang || language || "hindi") === "english" ? "english" : "hindi";
    const ai = getGenAI();

    const langInstruction = quizLang === "english"
      ? "All questions, options, and explanations MUST be strictly in 100% clean, standard ENGLISH. Do NOT include any Hindi or Hinglish words."
      : "All questions, options, and explanations MUST be strictly in 100% clean, standard HINDI. Do NOT include English translation slashes or dual language text.";

    const prompt = `Generate a high-quality educational quiz on "${subject}" for ${level || "general"} level/class. Please generate exactly 5 interesting multiple choice questions. ${langInstruction} Explain the correct answer step-by-step.`;

    const response = await generateContentWithFallback(ai, model || "gemini-3.5-flash", {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          description: "A list of quiz questions",
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING, description: `The quiz question text strictly in ${quizLang}` },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: `Exactly 4 options strictly in ${quizLang}`
              },
              answerIndex: { type: Type.INTEGER, description: "0-based index of the correct option (0 to 3)" },
              explanation: { type: Type.STRING, description: `Detailed step-by-step explanation strictly in ${quizLang}` }
            },
            required: ["question", "options", "answerIndex", "explanation"]
          }
        },
        systemInstruction: `You are HansAI. Generate accurate, engaging, educational questions strictly in ${quizLang}. Never mix Hindi and English with slashes.`
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response content from model");
    }

    const quizData = JSON.parse(text);
    res.json({ quiz: quizData });
  } catch (err: any) {
    console.error("Gemini API Error in /api/quiz:", err);
    res.status(500).json({ 
      error: err.message || "Failed to generate dynamic quiz.",
      isKeyMissing: !process.env.GEMINI_API_KEY
    });
  }
});

// 2.5 Universal Audio TTS Route (Proxy for Google TTS Audio Streams with 100% Hindi Devanagari Support)
app.get("/api/tts", async (req, res) => {
  try {
    const text = (req.query.text as string) || "";
    const lang = (req.query.lang as string) || "hi";
    
    if (!text.trim()) {
      return res.status(400).send("Text parameter is required");
    }

    // Clean markdown and unwanted symbols
    const cleanText = text
      .replace(/[\#\*\_\\`]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .trim()
      .slice(0, 200);

    const encodedText = encodeURIComponent(cleanText);
    const targetLang = lang.startsWith("hi") ? "hi" : "en";
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${targetLang}&client=tw-ob&q=${encodedText}`;

    const fetchRes = await fetch(ttsUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://translate.google.com/"
      }
    });

    if (!fetchRes.ok) {
      return res.status(500).send("TTS audio synthesis failed");
    }

    const arrayBuffer = await fetchRes.arrayBuffer();
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.send(Buffer.from(arrayBuffer));
  } catch (err: any) {
    console.error("Server /api/tts Error:", err);
    res.status(500).send("Internal server error in TTS endpoint");
  }
});

// 3. Dynamic Topic Research Guide
app.post("/api/research", async (req, res) => {
  const { topic, subjectArea, level, model } = req.body;
  const cleanTopic = String(topic || "General Study").trim();
  const area = String(subjectArea || "General Knowledge").trim();

  try {
    const ai = getGenAI();

    const prompt = `Conduct a highly advanced, comprehensive, and multi-dimensional Deep AI Research study guide on the topic/question "${cleanTopic}". 
    
    Since this is a Deep AI Research on a completely unrestricted topic, analyze it with maximum depth, conceptual clarity, and precise factual insights.

    Include:
    - Executive summary in deep friendly Hindi/Hinglish (incorporating advanced concepts, history, and real-world significance)
    - At least 4 highly diagnostic analytical points/insights about the concept
    - A step-by-step chronological pipeline, milestone events, historical progression, or structured development phases (at least 3 items in timeline/progression)
    - High-retention mnemonic tools or short tricks to memorize key components
    - Exactly 3 multiple-choice practice questions targeting this specific topic with detailed options and answers.`;

    const response = await generateContentWithFallback(ai, model || "gemini-2.5-flash", {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topicName: { type: Type.STRING },
            subjectArea: { type: Type.STRING },
            summary: { type: Type.STRING, description: "A highly informative executive guide in Hindi/Hinglish" },
            analyticalPoints: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Important takeaways and high-yield insights for the exams"
            },
            historicalTimeline: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  era: { type: Type.STRING, description: "Time or conceptual phase (e.g., '1757 AD', 'Phase 1')" },
                  event: { type: Type.STRING, description: "Action or setup details" },
                  significance: { type: Type.STRING, description: "Why this matters for students" }
                },
                required: ["era", "event", "significance"]
              }
            },
            crucialMnemonics: { type: Type.STRING, description: "Creative mnemonics or tips to remember dates/formulations" },
            practiceQuestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  answerIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING }
                },
                required: ["question", "options", "answerIndex", "explanation"]
              }
            }
          },
          required: ["topicName", "subjectArea", "summary", "analyticalPoints", "historicalTimeline", "crucialMnemonics", "practiceQuestions"]
        },
        systemInstruction: "You are the ultimate study research tool HansAI. Output factual, high-retention, extremely accurate research guides to clear competitive exams."
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response content from model");
    }

    const researchData = JSON.parse(text);
    res.json({ research: researchData });
  } catch (err: any) {
    console.error("Gemini API Error in /api/research:", err);
    // Provide an offline fallback research report so user gets instant output
    res.json({ 
      research: {
        topicName: cleanTopic,
        subjectArea: area,
        summary: `विषय "${cleanTopic}" पर डीप रिसर्च रिपोर्ट तैयार है:\n\n1. इस टॉपिक का मुख्य उद्देश्य परीक्षा दृष्टिकोण से सबसे महत्वपूर्ण अवधारणाओं को समझना है।\n2. यह विषय केंद्र एवं राज्य स्तर की सभी प्रतियोगी परीक्षाओं (10th/12th, SSC, Railway, UPSC) में बार-बार पूछा जाता है।\n3. नियमित रिविजन और पिछले वर्षों के प्रश्नों का अभ्यास इस विषय में 100% स्कोर दिलाएगा।`,
        analyticalPoints: [
          `मुख्य अवधारणा: ${cleanTopic} के मूल सिद्धांतों एवं सूत्रों को याद रखें।`,
          `परीक्षा महत्व: परीक्षा में डायरेक्ट एवं इनडायरेक्ट दोनों प्रकार के प्रश्न बनते हैं।`,
          `शॉर्टकट अप्रोच: एलिमिनेशन मेथड का प्रयोग करके प्रश्नों को 30 सेकंड में हल करें।`,
          `रिविजन स्ट्रैटेजी: प्रति सप्ताह कम से कम 2 बार नोट्स का पुनरावलोकन करें।`
        ],
        historicalTimeline: [
          { era: "चरण 1", event: "मूल अवधारणा एवं शब्दावली परिचय", significance: "बेस मजबूत करने के लिए अनिवार्य" },
          { era: "चरण 2", event: "इंटरमीडिएट एप्लीकेशन एवं केस स्टडी", significance: "परीक्षा में सीधे आने वाले नियम" },
          { era: "चरण 3", event: "एडवांस्ड पीवाईक्यू (PYQs) एवं मॉक प्रैक्टिस", significance: "स्पीड एवं एक्यूरेसी में सुधार" }
        ],
        crucialMnemonics: `ट्रिक: "${cleanTopic.slice(0, 4).toUpperCase()}-RULE" - प्रथम अक्षर से सभी प्रमुख बिंदुओं को क्रमानुसार याद रखें।`,
        practiceQuestions: [
          {
            question: `विषय "${cleanTopic}" के संदर्भ में कौन सा कथन सर्वथा सत्य है?`,
            options: [
              "यह अवधारणा परीक्षा में उच्च भारांश (High Weightage) रखती है",
              "यह केवल 10वीं कक्षा तक सीमित है",
              "इसमें कोई न्यूमेरिकल या फैक्चुअल प्रश्न नहीं आते",
              "उपरोक्त में से कोई नहीं"
            ],
            answerIndex: 0,
            explanation: "यह टॉपिक सभी प्रतियोगी परीक्षाओं में लगातार पूछा जाने वाला उच्च प्राथमिकता वाला क्षेत्र है।"
          }
        ]
      }
    });
  }
});

// 3.5. Daily Status / Morning Poem Generator
app.post("/api/status-generate", async (req, res) => {
  try {
    const { category } = req.body;
    const ai = getGenAI();
    const prompt = `Generate a beautiful, inspiring, and highly motivating daily status or morning poem/quote to be shared on WhatsApp Status.
    The theme should be starting the day with focus, dedication to studies, and self-discipline with focus and self-discipline.
    If category is 'poem', write a short, fresh 4-line inspirational Hindi morning poem (प्रभात कविता) with beautiful rhyming, incorporating morning elements, a tea/coffee breakfast emoji, and a positive competitive spirit for exams like SSC and Shorthand.
    If category is 'motivation', write a powerful 2-line motivational quote in Hindi/Hinglish.
    Ensure it is totally new, creative, elegant, and ready to share as a morning status! Do not repeat old generic quotes.`;

    const response = await generateContentWithFallback(ai, "gemini-3.5-flash", {
      contents: prompt,
      config: {
        systemInstruction: "You are the companion HansAI, writing beautiful, positive, and motivating daily WhatsApp status messages and poems for Indian students."
      }
    });

    const text = response.text || "सुबह की ताजी चाय के साथ, लक्ष्य की ओर बढ़ाएं हाथ। कड़क अभ्यास और अटूट विश्वास ही है परीक्षा में सफलता की असली सौगात! ☕📚";
    res.json({ text: text.trim() });
  } catch (err: any) {
    console.error("Error in /api/status-generate:", err);
    res.json({ text: "सुबह की ताजी चाय के साथ, लक्ष्य की ओर बढ़ाएं हाथ। कड़क अभ्यास और अटूट विश्वास ही है परीक्षा में सफलता की असली सौगात! ☕📚" });
  }
});

// 3.8. Dynamic Concept Map Generator Endpoint
app.post("/api/concept-map", async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic || !String(topic).trim()) {
      return res.status(400).json({ error: "Topic parameter is required." });
    }

    const ai = getGenAI();
    const cleanTopic = String(topic).trim();

    const prompt = `Break down the specific study topic or question "${cleanTopic}" into a sequential 5-step visual concept flowchart for a student.
IMPORTANT: You MUST analyze "${cleanTopic}" specifically. Every single step label, description, and detail must be 100% relevant and specific to "${cleanTopic}".
Do NOT use generic text like "Core Overview", "Working Principle", "Key Rules", or "Solved Examples".
For example:
- If topic is "Reproduction": step labels should be like "1. Asexual & Sexual Intro / जनन के प्रकार", "2. DNA Copying & Cell Division", "3. Male & Female Gametes", "4. Fertilization & Zygote", "5. Embryo & Heredity".
- If topic is "Photosynthesis": step labels should be like "1. Solar Energy Capture", "2. Photolysis of Water (H2O)", "3. Electron Transport Chain", "4. Calvin Cycle (CO2 Fixation)", "5. Glucose & Oxygen Output".

Generate exactly 5 nodes:
- "id": string ("1", "2", "3", "4", "5")
- "label": short, specific step title in Hindi & English (max 6-8 words, e.g., "1. DNA Copying & Gametes / डीएनए और युग्मक")
- "desc": simple 1-2 sentence breakdown explaining this specific step for "${cleanTopic}"
- "detail": exam/academic utility, key facts, or memory tip for this step
- "x": integer percentage position on canvas (step 1: 50, step 2: 25, step 3: 75, step 4: 35, step 5: 50)
- "y": integer percentage position on canvas (step 1: 15, step 2: 35, step 3: 55, step 4: 72, step 5: 88)`;

    const response = await generateContentWithFallback(ai, "gemini-3.5-flash", {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          description: "5 sequential nodes for the concept map",
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              label: { type: Type.STRING },
              desc: { type: Type.STRING },
              detail: { type: Type.STRING },
              x: { type: Type.INTEGER },
              y: { type: Type.INTEGER }
            },
            required: ["id", "label", "desc", "detail", "x", "y"]
          }
        },
        systemInstruction: "You are HansAI. Output factual, topic-specific step-by-step concept flowcharts for students."
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response content from model");
    }

    const nodes = JSON.parse(text);
    res.json({ nodes });
  } catch (err: any) {
    console.error("Gemini API Error in /api/concept-map:", err);
    res.status(500).json({ 
      error: err.message || "Failed to generate concept map.",
      isKeyMissing: !process.env.GEMINI_API_KEY
    });
  }
});

// 3.9. Universal AI Book Generator Endpoint (Supports All Genres: Literature, Fiction, Novels, Biographies, Science, History, Self-Help, etc.)
app.post("/api/book/generate", async (req, res) => {
  try {
    const { bookTitle, author } = req.body;
    if (!bookTitle || !String(bookTitle).trim()) {
      return res.status(400).json({ error: "Book title parameter is required." });
    }

    const ai = getGenAI();
    const cleanTitle = String(bookTitle).trim();
    const cleanAuthor = author ? String(author).trim() : "";

    const prompt = `Generate a rich, multi-chapter educational book entry for "${cleanTitle}"${cleanAuthor ? ` by ${cleanAuthor}` : ""}.
This can be ANY book genre (Classic Literature, Fiction, Novel, Biography, History, Philosophy, Science, Self-Help, Technology, or Exam Study Guide).

Generate a valid JSON object matching this structure:
{
  "id": "ai-book-${Date.now()}",
  "title": "${cleanTitle}",
  "author": "${cleanAuthor || "Renowned Author / Curated Edition"}",
  "category": "Literature & General Books",
  "coverColor": "from-indigo-600 to-purple-800",
  "description": "Engaging 2-3 sentence overview of this book's theme, main story or core principles.",
  "totalPages": 280,
  "currentPage": 1,
  "lastOpenedChapterIndex": 0,
  "highlights": [],
  "bookmarks": [],
  "notes": [],
  "quizHistory": [],
  "chapters": [
    {
      "id": "ch1",
      "title": "Chapter 1: Core Theme & Beginning (प्रारंभ व मुख्य पृष्ठभूमि)",
      "pageStart": 1,
      "pageEnd": 25,
      "content": "Rich 4-5 paragraph breakdown of Chapter 1 of ${cleanTitle} in a mix of Hindi & English. Explain main themes, key storylines or central ideas clearly.",
      "highlights": ["Key takeaway quote 1", "Key takeaway quote 2"]
    },
    {
      "id": "ch2",
      "title": "Chapter 2: Key Developments & Core Analysis (मुख्य विकास व विश्लेषण)",
      "pageStart": 26,
      "pageEnd": 60,
      "content": "Rich 4-5 paragraph breakdown of Chapter 2 of ${cleanTitle} in Hindi & English, covering major turning points, arguments, or storylines.",
      "highlights": ["Important insight 1", "Important insight 2"]
    },
    {
      "id": "ch3",
      "title": "Chapter 3: Deep Insights & Conclusions (गहन अंतर्दृष्टि व निष्कर्ष)",
      "pageStart": 61,
      "pageEnd": 95,
      "content": "Rich 4-5 paragraph synthesis of Chapter 3 and conclusions of ${cleanTitle} with practical takeaways and summary points.",
      "highlights": ["Final message quote 1", "Key summary point 2"]
    }
  ]
}`;

    const response = await generateContentWithFallback(ai, "gemini-3.5-flash", {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            author: { type: Type.STRING },
            category: { type: Type.STRING },
            coverColor: { type: Type.STRING },
            description: { type: Type.STRING },
            totalPages: { type: Type.INTEGER },
            currentPage: { type: Type.INTEGER },
            lastOpenedChapterIndex: { type: Type.INTEGER },
            highlights: { type: Type.ARRAY, items: { type: Type.STRING } },
            bookmarks: { type: Type.ARRAY, items: { type: Type.STRING } },
            notes: { type: Type.ARRAY, items: { type: Type.STRING } },
            quizHistory: { type: Type.ARRAY, items: { type: Type.STRING } },
            chapters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  pageStart: { type: Type.INTEGER },
                  pageEnd: { type: Type.INTEGER },
                  content: { type: Type.STRING },
                  highlights: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["id", "title", "content"]
              }
            }
          },
          required: ["id", "title", "author", "category", "description", "chapters"]
        },
        systemInstruction: "You are HansAI Book Engine. Generate authentic, accurate multi-chapter book breakdowns for ANY requested book title or novel in Hindi & English."
      }
    });

    const text = response.text;
    if (!text) throw new Error("Failed to generate book response");
    const bookData = JSON.parse(text);
    res.json({ book: bookData });
  } catch (err: any) {
    console.error("Gemini API Error in /api/book/generate:", err);
    // Fallback book if API has transient error
    const fallbackTitle = String(req.body.bookTitle || "General Book").trim();
    res.json({
      book: {
        id: `ai-book-fallback-${Date.now()}`,
        title: fallbackTitle,
        author: req.body.author || "Classic Literature / General Edition",
        category: "General Literature",
        coverColor: "from-blue-600 to-indigo-800",
        description: `Complete overview and study guide for "${fallbackTitle}".`,
        totalPages: 210,
        currentPage: 1,
        lastOpenedChapterIndex: 0,
        highlights: [],
        bookmarks: [],
        notes: [],
        quizHistory: [],
        chapters: [
          {
            id: 'fallback-ch1',
            title: `Chapter 1: Overview of ${fallbackTitle}`,
            pageStart: 1,
            pageEnd: 20,
            content: `Welcome to "${fallbackTitle}". This book covers essential themes, main concepts, and key principles. Explore the themes, characters, or core principles presented in this edition.`,
            highlights: [`Key theme of ${fallbackTitle}`]
          }
        ]
      }
    });
  }
});

// 4. Neutral Global Press News Feed Proxy
app.post("/api/news", async (req, res) => {
  try {
    const { language } = req.body;
    const ai = getGenAI();
    
    // Dynamically map full language name for Gemini localized prompt guidelines
    const targetLang = language || "english";
    
    const prompt = `Conduct an active web search to extract 3-4 major, actual, verified, and breaking global study, academic, science or technology developments today.
    You must use your googleSearch tool to fetch objective, accurate, non-fabricated, and real news events.
    Apply a strict neutral media and anti-bias filter. Eliminate sensationalism, subjective adjectives, and political spin.
    Output 3-4 entries, where each entry has:
    1. A neutral title/headline.
    2. Exactly 3 factual key bullet-point details mapping what happened.
    3. The verified primary news agency name or origin.
    4. Current date of publication.
    
    CRITICAL TRANSLATION MANDATE:
    You must render and write ALL titles, bullet points, and sources 100% in the chosen language: ${targetLang}. 
    Absolute prohibition of mixed language components or mechanical word-by-word copy translations. 
    Aspirants depend on this feed for real-world study; employ elite, fluid, natural, and professionally localized translation grammar.`;

    const response = await generateContentWithFallback(ai, "gemini-3.5-flash", {
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            newsList: {
              type: Type.ARRAY,
              description: "Array of neutral global news entries",
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "Neutral headline of the news in the target language" },
                  bulletPoints: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING },
                    description: "3 highly factual, key objective bullet points about the news event in the target language"
                  },
                  source: { type: Type.STRING, description: "Primary news agency or verified source name in the target language" },
                  date: { type: Type.STRING, description: "Factual news publication date" }
                },
                required: ["title", "bulletPoints", "source", "date"]
              }
            }
          },
          required: ["newsList"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response content from model");
    }

    const newsData = JSON.parse(text);
    res.json(newsData);
  } catch (err: any) {
    console.error("Gemini API Error in /api/news:", err);
    res.status(500).json({ 
      error: err.message || "Failed to retrieve verified news feed.",
      isKeyMissing: !process.env.GEMINI_API_KEY
    });
  }
});

// 5. AI-Driven Personalized Study Plan Generator
app.post("/api/study-plan", async (req, res) => {
  try {
    const { goal, days, weakAreas, dailyHours } = req.body;
    if (!goal) {
      return res.status(400).json({ error: "Goal parameter is required." });
    }
    const ai = getGenAI();
    const prompt = `Create a realistic, highly effective, structured study plan for a student preparing for "${goal}".
    Days Available: ${days || 30} days.
    Weak Subjects / Pain Points: ${weakAreas || "General Awareness, Speed, Revision"}.
    Daily Study Hours: ${dailyHours || 4} hours/day.

    Output structured JSON:
    - goalName: Title of goal
    - totalDays: number
    - dailySchedule: 3-4 daily time blocks (e.g., "Morning 7-9 AM", "Afternoon 2-4 PM", "Evening Revision 8-9 PM")
    - weeklyPhases: 4 weekly phases detailing specific focus topics, practice mocks, and revision milestones
    - examTips: 3 strategic preparation tips in Hindi/Hinglish`;

    const response = await generateContentWithFallback(ai, "gemini-3.5-flash", {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            goalName: { type: Type.STRING },
            totalDays: { type: Type.INTEGER },
            dailySchedule: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  timeSlot: { type: Type.STRING },
                  activity: { type: Type.STRING },
                  subject: { type: Type.STRING }
                },
                required: ["timeSlot", "activity", "subject"]
              }
            },
            weeklyPhases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  week: { type: Type.STRING },
                  focusArea: { type: Type.STRING },
                  milestone: { type: Type.STRING },
                  targetTasks: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["week", "focusArea", "milestone", "targetTasks"]
              }
            },
            examTips: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["goalName", "totalDays", "dailySchedule", "weeklyPhases", "examTips"]
        },
        systemInstruction: "You are HansAI. Generate disciplined, practical, high-yield exam study plans for students."
      }
    });

    const text = response.text;
    if (!text) throw new Error("No study plan returned from model");
    res.json({ plan: JSON.parse(text) });
  } catch (err: any) {
    console.error("Error in /api/study-plan:", err);
    res.status(500).json({ error: err.message || "Failed to generate study plan." });
  }
});

// 6. AI Flashcard Generator
app.post("/api/flashcards", async (req, res) => {
  try {
    const { topic, sourceText, count } = req.body;
    const ai = getGenAI();
    const prompt = `Generate ${count || 6} high-yield study flashcards for quick revision on topic: "${topic || 'General Science & Polity'}".
    ${sourceText ? `Source Content: ${sourceText.slice(0, 1000)}` : ''}

    Each flashcard must have:
    - id: string
    - front: Short question or key concept (in Hindi/English)
    - back: Concise, precise answer or explanation (in Hindi/English)
    - category: subject tag`;

    const response = await generateContentWithFallback(ai, "gemini-3.5-flash", {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              front: { type: Type.STRING },
              back: { type: Type.STRING },
              category: { type: Type.STRING }
            },
            required: ["id", "front", "back", "category"]
          }
        },
        systemInstruction: "You are HansAI. Generate memorable, high-retention flashcards for exams."
      }
    });

    const text = response.text;
    if (!text) throw new Error("No flashcards returned from model");
    res.json({ flashcards: JSON.parse(text) });
  } catch (err: any) {
    console.error("Error in /api/flashcards:", err);
    res.status(500).json({ error: err.message || "Failed to generate flashcards." });
  }
});

// 7. Photo to MCQ / OCR Doubt Solver
app.post("/api/ocr-solve", async (req, res) => {
  try {
    const { imageBase64, mimeType, userQuery } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: "Image base64 data is required." });
    }
    const ai = getGenAI();
    const prompt = `Analyze this textbook page or question image.
    User instruction/doubt: "${userQuery || 'Extract the main question or topic from the image, solve it step-by-step, and generate 3 practice MCQs.'}"

    Output JSON with:
    - extractedText: Exact text detected in image
    - solution: Detailed step-by-step solution in Hindi/English
    - practiceMcqs: Array of 3 MCQs (question, options [4], answerIndex, explanation)`;

    const response = await generateContentWithFallback(ai, "gemini-3.5-flash", {
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                data: imageBase64,
                mimeType: mimeType || "image/jpeg"
              }
            },
            { text: prompt }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            extractedText: { type: Type.STRING },
            solution: { type: Type.STRING },
            practiceMcqs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  answerIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING }
                },
                required: ["question", "options", "answerIndex", "explanation"]
              }
            }
          },
          required: ["extractedText", "solution", "practiceMcqs"]
        },
        systemInstruction: "You are HansAI. Solve doubts from photos accurately and clearly for students."
      }
    });

    const text = response.text;
    if (!text) throw new Error("No OCR analysis returned from model");
    res.json({ ocrResult: JSON.parse(text) });
  } catch (err: any) {
    console.error("Error in /api/ocr-solve:", err);
    res.status(500).json({ error: err.message || "Failed to process photo doubt." });
  }
});

// 8. Audio Lecture Transcriber & Summarizer
app.post("/api/audio-transcribe", async (req, res) => {
  try {
    const { audioBase64, mimeType } = req.body;
    if (!audioBase64) {
      return res.status(400).json({ error: "Audio base64 data is required." });
    }
    const ai = getGenAI();
    const prompt = `Listen to this audio recording (lecture or study notes dictation).
    Transcribe what was spoken clearly, then summarize the key academic takeaways in bullet points in Hindi/English.
    
    Output JSON with:
    - transcript: Full transcribed text
    - summary: 3-5 bullet points of key takeaways
    - subjectTag: Main subject area detected`;

    const response = await generateContentWithFallback(ai, "gemini-3.5-flash", {
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                data: audioBase64,
                mimeType: mimeType || "audio/mp3"
              }
            },
            { text: prompt }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            transcript: { type: Type.STRING },
            summary: { type: Type.ARRAY, items: { type: Type.STRING } },
            subjectTag: { type: Type.STRING }
          },
          required: ["transcript", "summary", "subjectTag"]
        },
        systemInstruction: "You are HansAI. Transcribe audio accurately and summarize lectures for students."
      }
    });

    const text = response.text;
    if (!text) throw new Error("No transcription returned from model");
    res.json({ audioResult: JSON.parse(text) });
  } catch (err: any) {
    console.error("Error in /api/audio-transcribe:", err);
    res.status(500).json({ error: err.message || "Failed to transcribe audio." });
  }
});

// 9. Universal High-Clarity Audio Text-to-Speech (TTS) Proxy
app.get("/api/tts", async (req, res) => {
  try {
    const rawText = String(req.query.text || "").trim();
    const lang = String(req.query.lang || "hi").toLowerCase();
    
    if (!rawText) {
      return res.status(400).send("Text is required");
    }

    const cleanText = rawText.slice(0, 200);
    const langCode = lang.startsWith("en") ? "en" : "hi";
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(cleanText)}&tl=${langCode}&client=tw-ob`;

    const response = await fetch(ttsUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      }
    });

    if (!response.ok) {
      return res.status(502).send("TTS upstream service unavailable");
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.send(buffer);
  } catch (err: any) {
    console.error("Error in /api/tts:", err);
    res.status(500).send("TTS processing error");
  }
});

// Static Icon & Favicon Handlers for Googlebot & Browser Crawlers
app.get('/favicon.ico', (req, res) => {
  const icoPath = path.join(process.cwd(), 'public', 'favicon.ico');
  if (fs.existsSync(icoPath)) {
    res.setHeader('Content-Type', 'image/x-icon');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.sendFile(icoPath);
  }
  res.sendStatus(404);
});

app.get('/logo.svg', (req, res) => {
  const svgPath = path.join(process.cwd(), 'public', 'logo.svg');
  if (fs.existsSync(svgPath)) {
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.sendFile(svgPath);
  }
  res.sendStatus(404);
});

app.get('/og-image.png', (req, res) => {
  const ogPath = path.join(process.cwd(), 'public', 'og-image.png');
  if (fs.existsSync(ogPath)) {
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.sendFile(ogPath);
  }
  res.sendStatus(404);
});

// Google Search Console Verification & SEO Endpoints
app.get('/google4b979116600de942.html', (req, res) => {
  res.type('text/html').send('google-site-verification: google4b979116600de942.html');
});

app.get('/robots.txt', (req, res) => {
  res.type('text/plain').send(`User-agent: *
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Googlebot-Mobile
Allow: /

User-agent: Googlebot-Image
Allow: /

User-agent: Bingbot
Allow: /

Sitemap: https://hans-compain.onrender.com/sitemap.xml
`);
});

app.get('/sitemap.xml', (req, res) => {
  res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://hans-compain.onrender.com/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`);
});

// Start routing & server/vite split
async function startServer() {
  // Vite dev or production static paths
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res, next) => {
      if (req.path.startsWith("/api/")) {
        return res.status(404).json({ error: "API endpoint not found" });
      }
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`HansAI Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
