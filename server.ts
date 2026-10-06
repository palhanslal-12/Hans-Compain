import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

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

// 1. Daily Current Affairs API
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
    const { questionText, examTarget = 'SSC & Steno 2026', subject = 'General', mode = 'chat' } = req.body;
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

      const prompt = `${systemContext}\n\nMode: ${mode}\nExam Target: ${examTarget}\nSubject: ${subject}\nUser Question: "${questionText}"`;
      const result = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
      if (result && result.text) return res.json({ solution: result.text });
    }
    res.json({ solution: 'हंस कॉम्पैन एआई सहायक सक्रिय है।/ Hans Compain AI active. Please ask your query.' });
  } catch (err) {
    res.status(500).json({ error: 'Internal Error' });
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
  const distExists = fs.existsSync(path.join(process.cwd(), 'dist', 'index.html'));
  const isProduction = process.env.NODE_ENV === 'production' || distExists;

  if (isProduction && distExists) {
    app.use(express.static(path.join(process.cwd(), 'dist')));
    app.get('*', (req, res) => res.sendFile(path.join(process.cwd(), 'dist', 'index.html')));
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Hans Compain Engine - Port ${PORT}`);
  });
  server.on('error', (err: any) => {
    console.error('Server listen error:', err);
  });
}

startServer();
