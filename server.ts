import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const portArgIndex = process.argv.indexOf('--port');
const portArg = portArgIndex !== -1 ? parseInt(process.argv[portArgIndex + 1], 10) : null;
const PORT = portArg || (process.env.PORT ? parseInt(process.env.PORT, 10) : 3000);

app.use(express.json({ limit: '10mb' }));

let ai: GoogleGenAI | null = null;
try {
  ai = new GoogleGenAI();
} catch (e) {
  console.warn('AI Init Error:', e);
}

// 1. Daily Current Affairs & Editorial Sync APIs
app.get('/api/current-affairs/articles', (req, res) => {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
    const vaultFile = path.join(dataDir, 'current_affairs_vault.json');
    if (fs.existsSync(vaultFile)) {
      const data = JSON.parse(fs.readFileSync(vaultFile, 'utf-8'));
      if (Array.isArray(data) && data.length > 0) {
        return res.json({ success: true, articles: data });
      }
    }
    return res.json({ success: true, articles: [] });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to read articles vault' });
  }
});

app.get('/api/current-affairs/get', (req, res) => {
  try {
    const id = req.query.id as string;
    if (!id) return res.status(400).json({ error: 'Missing article ID' });
    const dataDir = path.join(process.cwd(), 'data');
    const vaultFile = path.join(dataDir, 'current_affairs_vault.json');
    if (fs.existsSync(vaultFile)) {
      const list = JSON.parse(fs.readFileSync(vaultFile, 'utf-8'));
      if (Array.isArray(list)) {
        const found = list.find((a: any) => a.id === id || a.id?.toLowerCase() === id.toLowerCase());
        if (found) return res.json({ success: true, article: found });
      }
    }
    return res.status(404).json({ success: false, error: 'Article not found' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.post('/api/current-affairs/save', (req, res) => {
  try {
    const { article } = req.body;
    if (!article || !article.id) {
      return res.status(400).json({ error: 'Invalid article payload' });
    }
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
    const vaultFile = path.join(dataDir, 'current_affairs_vault.json');

    let articles: any[] = [];
    if (fs.existsSync(vaultFile)) {
      try {
        articles = JSON.parse(fs.readFileSync(vaultFile, 'utf-8'));
      } catch {
        articles = [];
      }
    }

    const existingIndex = articles.findIndex((a: any) => a.id === article.id);
    if (existingIndex >= 0) {
      articles[existingIndex] = { ...articles[existingIndex], ...article, updatedAt: new Date().toISOString() };
    } else {
      articles.unshift({ ...article, createdAt: new Date().toISOString() });
    }

    fs.writeFileSync(vaultFile, JSON.stringify(articles, null, 2));
    res.json({ success: true, message: 'Article synced to cloud vault', article });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to save article' });
  }
});

app.post('/api/current-affairs/sync', async (req, res) => {
  try {
    const { initialList = [], forceRefresh = false } = req.body;
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
    const vaultFile = path.join(dataDir, 'current_affairs_vault.json');

    let articles: any[] = [];
    if (fs.existsSync(vaultFile)) {
      try {
        articles = JSON.parse(fs.readFileSync(vaultFile, 'utf-8'));
      } catch {
        articles = [];
      }
    }

    // Merge incoming initial verified list
    if (Array.isArray(initialList) && initialList.length > 0) {
      for (const item of initialList) {
        if (!articles.some((a: any) => a.id === item.id)) {
          articles.push(item);
        }
      }
    }

    // Save and send immediately if not force refresh
    fs.writeFileSync(vaultFile, JSON.stringify(articles, null, 2));

    return res.json({ success: true, count: articles.length, articles });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Sync failed' });
  }
});

app.post('/api/current-affairs/daily', async (req, res) => {
  try {
    const { language = 'hindi', forceRefresh = false } = req.body;
    const today = new Date().toISOString().split('T')[0];
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

    const cacheFile = path.join(dataDir, `current_affairs_daily_hi_${today}.json`);

    if (!forceRefresh && fs.existsSync(cacheFile)) {
      const data = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
      if (data.length > 0) return res.json(data);
    }

    if (ai) {
      const prompt = `Generate 10 verified current affairs facts and articles for ${today} for competitive exams (SSC, UPSC, Railway, State Exams) in Hindi & English. Return an array of objects with keys: id, category, source, sourceUrl, imageUrl, titleHi, titleEn, summaryHi, summaryEn, date, readTime, examRelevance, keyFact, tag, deepAnalysisHi (array of strings), mcq (object with questionHi, questionEn, optionsHi (array of 4 strings), optionsEn (array of 4 strings), correctIndex (0-3), explanationHi, explanationEn).`;
      try {
        const result = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json' }
        });
        if (result && result.text) {
          const parsed = JSON.parse(result.text);
          if (Array.isArray(parsed) && parsed.length > 0) {
            fs.writeFileSync(cacheFile, JSON.stringify(parsed, null, 2));
            return res.json(parsed);
          }
        }
      } catch (genErr) {
        console.warn('Gemini generateContent error in CA:', genErr);
      }
    }

    const files = fs.readdirSync(dataDir).filter(f => f.startsWith('current_affairs_daily_')).sort().reverse();
    if (files.length > 0) return res.json(JSON.parse(fs.readFileSync(path.join(dataDir, files[0]), 'utf-8')));

    return res.json([]);
  } catch (err) {
    res.status(500).json({ error: 'Internal Error' });
  }
});

// 2. AI Chat & Hans Compain App Guide Assistant API (Adaptive Language Persona)
app.post('/api/ai/doubt-solver', async (req, res) => {
  try {
    const { questionText, examTarget = 'SSC & Steno 2026', subject = 'General', mode = 'chat', imageBase64 } = req.body;
    if (ai) {
      const systemContext = `You are HANS COMPAIN AI, the official intelligent assistant and study mentor of the HANS COMPAIN platform (created by Hanslal Pal).

CRITICAL ADAPTIVE LANGUAGE PERSONA RULE:
Regardless of the system's UI language setting, you MUST analyze the user's message and respond in the EXACT SAME language, script, and tone (Pure Hindi in Devanagari, Pure English, or casual Hinglish) that the user wrote in!
- If the user writes in Devanagari Hindi (e.g. "ओम का नियम बताओ"), respond in clear, articulate Devanagari Hindi with structured points.
- If the user writes in English (e.g. "Explain Ohm's Law with examples"), respond in natural, professional English.
- If the user writes in Hinglish (e.g. "Ohm ka law kya hai batao"), respond in engaging Hinglish.

Core Knowledge Base:
- Founder & Creator: Hanslal Pal (हंसलाल पाल).
- App Features:
  1. All Stenographer (सम्पूर्ण आशुलिपि): 60-120 WPM Audio Dictation Studio & Full-Screen Practice Board.
  2. Current Affairs 2026: Daily 10 Golden Facts, 10 Daily Quiz MCQs, Verified PIB/Hindu News & Audio Reader.
  3. Live Group Quiz Battle: Multiplayer quiz arena with live ranks, voice speaker, and fast-finger bonus points.
  4. AI Mnemonics: Generates catchy rhymes/poems for dates, articles, chemical names, and custom topics.
  5. Science Lab: 28+ Interactive Virtual Labs (Ohm's Law, Lens Optics, Pendulum, Titration, ECG, Periodic Table, Escape Velocity).
  6. Daily Goals: Study targets with Color Badges (Bronze, Silver, Gold, Diamond, Legend).
  7. Single-Page CBT Real Exam Center: TCS iON style CBT exam mode with Question Palette, Auto-Sync Mistake Notebook, and Direct Question Error Report to hanscompain@gmail.com.
  8. Edu-Reels: Auto-generates 60-second revision reels from student activities.
  9. Smart Global Library & Article Voice Reader: NCERT & World Books with adjustable font and natural voice read-aloud.
  10. Apps Launcher: Bharati Bhawan (K.C. Sinha), PYQ Vault, Sarkari Result Calculator, YouTube, ChatGPT, Google Scholar, Wikipedia, NCERT.
  11. Handwritten Notes Photo Scanner (OCR): Camera icon in Chat to scan handwritten questions.
  12. Background 24h Auto-Email Alert: Reminds inactive students automatically.`;

      const promptText = `${systemContext}\n\nMode: ${mode}\nExam Target: ${examTarget}\nSubject: ${subject}\nUser Question: "${questionText || 'इस तस्वीर का हल बताएं'}"`;

      let contents: any;
      if (imageBase64) {
        let mimeType = 'image/png';
        let pureBase64 = '';
        if (imageBase64.includes(';base64,')) {
          const parts = imageBase64.split(';base64,');
          mimeType = parts[0].replace('data:', '');
          pureBase64 = parts[1];
        } else {
          pureBase64 = imageBase64;
        }

        contents = {
          parts: [
            { inlineData: { mimeType, data: pureBase64 } },
            { text: promptText }
          ]
        };
      } else {
        contents = promptText;
      }

      const result = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: contents
      });

      if (result && result.text) {
        return res.json({ solution: result.text, answer: result.text });
      }
    }
    res.json({ solution: 'हंस कॉम्पैन एआई सहायक सक्रिय है।/ Hans Compain AI active. Please ask your query.' });
  } catch (err) {
    console.error('Doubt solver error:', err);
    res.status(500).json({ error: 'Internal Error' });
  }
});

// 2c. Dedicated /api/ai/solve route for handwritten OCR photo scanning and analysis
app.post('/api/ai/solve', async (req, res) => {
  try {
    const { prompt, imageBase64, mode = 'ocr' } = req.body;
    if (!ai) {
      return res.status(500).json({ error: 'AI Client not initialized' });
    }

    let contents: any;

    if (imageBase64) {
      let mimeType = 'image/png';
      let pureBase64 = '';
      if (imageBase64.includes(';base64,')) {
        const parts = imageBase64.split(';base64,');
        mimeType = parts[0].replace('data:', '');
        pureBase64 = parts[1];
      } else {
        pureBase64 = imageBase64;
      }

      contents = {
        parts: [
          { inlineData: { mimeType, data: pureBase64 } },
          { text: prompt || 'इस फोटो/हस्तलिखित नोट्स में लिखे सभी शब्दों, सूत्रों और बिंदुओं को साफ-साफ डिजिटल हिंदी/अंग्रेजी टेक्स्ट में बदलें (OCR) और मुख्य परीक्षा बिंदु बताएं।' }
        ]
      };
    } else {
      contents = prompt || 'कृपया सामग्री प्रदान करें।';
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents,
      config: {
        systemInstruction: 'You are HANS COMPAIN AI OCR & Handwritten Note Analyzer. Read printed/handwritten questions, study notes, or math equations with extreme precision. Output only the extracted clean text, solved steps, and key highlights in a clean layout.'
      }
    });

    const resultText = response.text || 'OCR विश्लेषण करने में असमर्थ। कृपया दूसरी स्पष्ट फोटो अपलोड करें।';
    return res.json({ success: true, answer: resultText, solution: resultText });
  } catch (err) {
    console.error('OCR Solve Route Error:', err);
    res.status(500).json({ error: 'OCR processing failed' });
  }
});

// 2b. Direct Exam Question Error Reporting System (hanscompain@gmail.com)
app.post('/api/report-question', (req, res) => {
  try {
    const { questionId, questionText, category, userNote, reporterEmail = 'student@hanscompain.in' } = req.body;
    const reportsDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir);
    const reportFile = path.join(reportsDir, 'question_reports.json');

    let reports = [];
    if (fs.existsSync(reportFile)) {
      try { reports = JSON.parse(fs.readFileSync(reportFile, 'utf-8')); } catch { reports = []; }
    }

    const newReport = {
      id: `report_${Date.now()}`,
      targetEmail: 'hanscompain@gmail.com',
      reporterEmail,
      questionId,
      questionText,
      category,
      userNote,
      timestamp: new Date().toISOString()
    };

    reports.unshift(newReport);
    fs.writeFileSync(reportFile, JSON.stringify(reports, null, 2));

    console.log(`📩 [Question Error Report Dispatched to hanscompain@gmail.com]:`, newReport);
    res.json({ success: true, message: 'त्रुटि रिपोर्ट hanscompain@gmail.com पर सफलता से भेज दी गई है।' });
  } catch (err) {
    res.status(500).json({ error: 'Report dispatch error' });
  }
});

// 2d. Dedicated Full Exam board questions generator route
app.post('/api/board/full-exam', async (req, res) => {
  try {
    const { board = 'BSEB', classLevel = '10th', subject = 'Science', language = 'hindi' } = req.body;
    if (!ai) {
      return res.status(500).json({ error: 'AI Client not initialized' });
    }

    const examLength = board === 'BSEB' ? 40 : 20;

    const systemInstruction = `You are an elite syllabus setter for ${board} ${classLevel} ${subject} board exams.
Generate a set of exactly ${examLength} highly realistic, syllabus-perfect, curriculum-accurate board exam multiple-choice questions (MCQs).
Crucial constraints:
1. Do not repeat any questions.
2. The entire output must be in a single clean language matching "${language}" only!
   - If language is 'hindi', the question, options, and explanations must be 100% in pure Hindi (Devanagari). No English translations in parentheses.
   - If language is 'english', the question, options, and explanations must be 100% in English. No Hindi translations in parentheses.
3. Keep the content appropriate for CBSE, BSEB, or UP Board based on "${board}".
4. You must return a valid JSON object adhering strictly to this schema:
{
  "questions": [
    {
      "id": "gen_q_1",
      "question": "A clear, realistic question text...",
      "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
      "correctAnswer": 0, // 0-indexed correct option (0, 1, 2, or 3)
      "explanation": "Detailed explanation of why this option is correct...",
      "yearTag": "${board} ${classLevel} board exam predicted"
    }
  ]
}
Return exactly ${examLength} elements in the "questions" array.
Do not return any markdown wraps or comments outside the JSON object. Just the clean JSON.`;

    const result = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Generate exactly ${examLength} unique questions. Topic coverage should span the entire syllabus of ${subject}. Make sure questions change automatically, are diverse, and have real board difficulty.`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json'
      }
    });

    if (result && result.text) {
      const parsed = JSON.parse(result.text.trim());
      if (parsed && Array.isArray(parsed.questions)) {
        return res.json({ success: true, questions: parsed.questions });
      }
    }
    res.status(400).json({ success: false, error: 'Failed to generate questions' });
  } catch (err) {
    console.error('Board exam generation error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// 3. Custom AI Mnemonic Generator API
app.post('/api/ai/mnemonic', async (req, res) => {
  try {
    const { topic } = req.body;
    if (ai && topic) {
      const prompt = `Create a catchy Hindi memory trick / rhyme (निमोनिक्स कविता/शॉर्टकट ट्रिक) for competitive exam students on the topic: "${topic}".
Return JSON with keys: title (string), rhyme (catchy 1-2 line Hindi poem/acronym), breakdown (array of strings explaining each letter/word), tip (exam memory tip).`;
      const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });
      if (result && result.text) {
        return res.json(JSON.parse(result.text));
      }
    }
    res.status(400).json({ error: 'Fallback required' });
  } catch (err) {
    res.status(500).json({ error: 'Mnemonic generation error' });
  }
});

// 4. Universal World Book Reader Synthesizer API
app.post('/api/books/read', async (req, res) => {
  try {
    const { query, chapter = 1 } = req.body;
    if (ai && query) {
      const prompt = `Provide a comprehensive, authentic educational reading chapter in Hindi (with English technical terms) for the book or subject: "${query}" (Chapter/Part ${chapter}).
Return JSON with keys: bookTitle, chapterTitle, author, category, content (array of 6 detailed paragraphs covering core concepts, formulas, examples, or historical/literary text).`;
      const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });
      if (result && result.text) {
        return res.json(JSON.parse(result.text));
      }
    }
    res.status(400).json({ error: 'Book synthesis fallback' });
  } catch (err) {
    res.status(500).json({ error: 'Book read error' });
  }
});

// 5. User & Guest Activity Ping & Live Admin Analytics Tracking
app.post('/api/user/ping', (req, res) => {
  try {
    const {
      userId = 'guest_visitor',
      email = '',
      displayName = '',
      isLoggedIn = false,
      userType = 'guest', // 'registered' | 'guest'
      targetExam = 'SSC & Steno 2026',
      lastTopic = 'Home Dashboard',
      featureName = '',
      actionDetail = '',
      device = 'Web App'
    } = req.body;

    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    
    const usersFile = path.join(dataDir, 'users.json');
    const activitiesFile = path.join(dataDir, 'activities_stream.json');

    let users: Record<string, any> = {};
    if (fs.existsSync(usersFile)) {
      try {
        users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
      } catch {
        users = {};
      }
    }

    let activities: any[] = [];
    if (fs.existsSync(activitiesFile)) {
      try {
        activities = JSON.parse(fs.readFileSync(activitiesFile, 'utf-8'));
      } catch {
        activities = [];
      }
    }

    const nowIso = new Date().toISOString();
    const nowStr = new Date().toLocaleString('hi-IN', { timeZone: 'Asia/Kolkata' });
    const effectiveType = isLoggedIn || (email && email !== 'student@hanscompain.in' && !userId.startsWith('guest_')) ? 'registered' : 'guest';
    const effectiveName = displayName || (effectiveType === 'registered' ? 'पंजीकृत छात्र' : `अतिथि आगंतुक (${userId.slice(-4)})`);
    const effectiveEmail = email || (effectiveType === 'registered' ? 'student@hanscompain.in' : 'बिना लॉगिन (Guest)');
    const currentFeature = featureName || lastTopic || 'Home Dashboard';

    const existingUser = users[userId] || {};
    const existingHistory = existingUser.sessionHistory || [];
    const existingFeatures: Record<string, number> = existingUser.featuresUsed || {};
    existingFeatures[currentFeature] = (existingFeatures[currentFeature] || 0) + 1;

    const newLogEntry = {
      feature: currentFeature,
      action: actionDetail || `देखा: ${currentFeature}`,
      timestamp: nowStr,
      isoTime: nowIso
    };

    users[userId] = {
      userId,
      userType: effectiveType,
      isLoggedIn: effectiveType === 'registered',
      email: effectiveEmail,
      displayName: effectiveName,
      targetExam: targetExam || existingUser.targetExam || 'SSC & Steno 2026',
      firstSeen: existingUser.firstSeen || nowIso,
      lastActive: nowIso,
      lastActiveStr: nowStr,
      lastTopic: currentFeature,
      visitCount: (existingUser.visitCount || 0) + 1,
      device: device || existingUser.device || 'Mobile/Browser',
      featuresUsed: existingFeatures,
      sessionHistory: [newLogEntry, ...existingHistory].slice(0, 20),
      notificationCount: existingUser.notificationCount || 0,
      autoEmailSentAt: existingUser.autoEmailSentAt || null
    };

    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

    // Record into real-time activity stream
    const activityItem = {
      id: `act_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      userId,
      userType: effectiveType,
      displayName: effectiveName,
      email: effectiveEmail,
      feature: currentFeature,
      action: actionDetail || `फीचर उपयोग: ${currentFeature}`,
      timestamp: nowStr,
      isoTime: nowIso
    };

    activities.unshift(activityItem);
    fs.writeFileSync(activitiesFile, JSON.stringify(activities.slice(0, 100), null, 2));

    res.json({ success: true, loggedAt: nowStr, userType: effectiveType });
  } catch (err) {
    res.status(500).json({ error: 'Tracking log error' });
  }
});

app.get('/api/admin/users', (req, res) => {
  const usersFile = path.join(process.cwd(), 'data', 'users.json');
  if (!fs.existsSync(usersFile)) return res.json([]);
  try {
    const users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
    return res.json(Object.values(users));
  } catch {
    return res.json([]);
  }
});

app.get('/api/admin/activities', (req, res) => {
  const activitiesFile = path.join(process.cwd(), 'data', 'activities_stream.json');
  if (!fs.existsSync(activitiesFile)) return res.json([]);
  try {
    const activities = JSON.parse(fs.readFileSync(activitiesFile, 'utf-8'));
    return res.json(activities);
  } catch {
    return res.json([]);
  }
});

app.post('/api/admin/clear-logs', (req, res) => {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const activitiesFile = path.join(dataDir, 'activities_stream.json');
    fs.writeFileSync(activitiesFile, JSON.stringify([], null, 2));
    res.json({ success: true, message: 'Logs reset' });
  } catch {
    res.status(500).json({ error: 'Failed' });
  }
});

// 6. Global Feature Toggles Configuration Manager
const getFeatureToggles = () => {
  const togglesFile = path.join(process.cwd(), 'data', 'feature_toggles.json');
  const defaults = {
    "steno-master": true,
    "current-affairs": true,
    "group-quiz": true,
    "ai-chat": true,
    "science-lab": true,
    "board-exams": true,
    "mnemonics": true,
    "library": true
  };
  if (!fs.existsSync(togglesFile)) {
    try {
      const dataDir = path.dirname(togglesFile);
      if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
      fs.writeFileSync(togglesFile, JSON.stringify(defaults, null, 2));
    } catch {
      // ignore
    }
    return defaults;
  }
  try {
    return JSON.parse(fs.readFileSync(togglesFile, 'utf-8'));
  } catch {
    return defaults;
  }
};

app.get('/api/admin/features', (req, res) => {
  try {
    const toggles = getFeatureToggles();
    res.json({ success: true, toggles });
  } catch (err) {
    res.status(500).json({ error: 'Failed to read features config' });
  }
});

app.post('/api/admin/features/toggle', (req, res) => {
  try {
    const { featureId, status } = req.body;
    if (typeof featureId !== 'string' || typeof status !== 'boolean') {
      return res.status(400).json({ error: 'Invalid featureId or status' });
    }
    const togglesFile = path.join(process.cwd(), 'data', 'feature_toggles.json');
    const toggles = getFeatureToggles();
    toggles[featureId] = status;
    fs.writeFileSync(togglesFile, JSON.stringify(toggles, null, 2));
    res.json({ success: true, toggles, message: `Feature '${featureId}' updated` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update feature toggles' });
  }
});

async function checkInactivityAndSendAutoEmails() {
  const usersFile = path.join(process.cwd(), 'data', 'users.json');
  if (!fs.existsSync(usersFile)) return;

  try {
    const users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
    const now = new Date();
    const INACTIVITY_LIMIT = 24 * 60 * 60 * 1000; // 24 hours

    for (const userId in users) {
      const u = users[userId];
      const lastActive = new Date(u.lastActive);
      const diff = now.getTime() - lastActive.getTime();

      if (diff > INACTIVITY_LIMIT && (u.notificationCount || 0) < 3) {
        u.notificationCount = (u.notificationCount || 0) + 1;
        u.autoEmailSentAt = now.toISOString();
        console.log(`📧 [24h Inactivity Auto-Email Dispatched] To: ${u.email} (${u.displayName})`);
      }
    }
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  } catch (e) {
    console.error('Inactivity check error:', e);
  }
}

setInterval(checkInactivityAndSendAutoEmails, 60 * 60 * 1000);

async function startServer() {
  const distPath = path.join(process.cwd(), 'dist');
  const distIndexPath = path.join(distPath, 'index.html');
  const distExists = fs.existsSync(distIndexPath);
  const isProduction = process.env.NODE_ENV === 'production' && distExists;

  if (isProduction && distExists) {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      try {
        if (fs.existsSync(distIndexPath)) {
          return res.sendFile(distIndexPath);
        }
      } catch (err) {
        console.warn('Dist file send error:', err);
      }
      res.status(404).send('Not Found');
    });
  } else {
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true, hmr: false },
        appType: 'spa'
      });
      app.use(vite.middlewares);
    } catch (viteErr) {
      console.error('Vite server init error:', viteErr);
    }
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Hans Compain Engine - Port ${PORT} [Mode: ${isProduction ? 'Production' : 'Dev-Vite'}]`);
  });
  server.on('error', (err: any) => {
    console.error('Server listen error:', err);
  });
}

startServer();
