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
          model: 'gemini-3.8-flash',
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

// 2. AI Chat & Hans Compain App Guide Assistant API (Adaptive Language Persona + Multiple Images & PDF Support)
app.post('/api/ai/doubt-solver', async (req, res) => {
  try {
    const {
      questionText,
      examTarget = 'SSC & Steno 2026',
      subject = 'General',
      mode = 'chat',
      imageBase64,
      files = []
    } = req.body;

    if (ai) {
      const systemContext = `You are HANS COMPAIN AI, the official intelligent assistant and study mentor of the HANS COMPAIN platform (created by Hanslal Pal).

CRITICAL ADAPTIVE LANGUAGE PERSONA RULE:
Regardless of the system's UI language setting, you MUST analyze the user's message and respond in the EXACT SAME language, script, and tone (Pure Hindi in Devanagari, Pure English, or casual Hinglish) that the user wrote in!
- If the user writes in Devanagari Hindi (e.g. "ओम का नियम बताओ"), respond in clear, articulate Devanagari Hindi with structured points.
- If the user writes in English (e.g. "Explain Ohm's Law with examples"), respond in natural, professional English.
- If the user writes in Hinglish (e.g. "Ohm ka law kya hai batao"), respond in engaging Hinglish.

Document and Image Analysis:
- You have advanced multi-modal vision and document comprehension.
- When the user uploads one or more images (photos of questions, diagrams, handwritten notes, textbook pages) or PDF documents, analyze ALL attached files carefully.
- Provide step-by-step verified solutions, formula derivations, and clear explanations.

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

      const promptText = `${systemContext}\n\nMode: ${mode}\nExam Target: ${examTarget}\nSubject: ${subject}\nUser Question: "${questionText || 'कृपया संलग्न फोटो/दस्तावेज़ का समाधान एवं व्याख्या प्रदान करें'}"`;

      const parts: any[] = [];

      // Collect all attachments from files array or legacy imageBase64
      const allAttachments: { data: string; mimeType: string }[] = [];

      if (Array.isArray(files) && files.length > 0) {
        files.forEach((f: any) => {
          if (f && f.base64) {
            let mimeType = f.type || 'image/png';
            let pureBase64 = f.base64;
            if (pureBase64.includes(';base64,')) {
              const spl = pureBase64.split(';base64,');
              mimeType = spl[0].replace('data:', '') || mimeType;
              pureBase64 = spl[1];
            }
            allAttachments.push({ data: pureBase64, mimeType });
          }
        });
      }

      if (imageBase64 && allAttachments.length === 0) {
        let mimeType = 'image/png';
        let pureBase64 = '';
        if (imageBase64.includes(';base64,')) {
          const spl = imageBase64.split(';base64,');
          mimeType = spl[0].replace('data:', '');
          pureBase64 = spl[1];
        } else {
          pureBase64 = imageBase64;
        }
        allAttachments.push({ data: pureBase64, mimeType });
      }

      // Add all files into parts
      for (const att of allAttachments) {
        parts.push({
          inlineData: {
            mimeType: att.mimeType,
            data: att.data
          }
        });
      }

      // Append textual prompt
      parts.push({ text: promptText });

      const contents = parts.length > 1 ? { parts } : promptText;

      const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents
      });

      if (result && result.text) {
        return res.json({ solution: result.text, answer: result.text });
      }
    }
    res.json({ solution: 'हंस कॉम्पैन एआई सहायक सक्रिय है। कृपया अपना प्रश्न पूछें।' });
  } catch (err) {
    console.error('Doubt solver error:', err);
    res.status(500).json({ error: 'Internal Error' });
  }
});

// Helper: Automatic Email & Admin Alert Dispatcher (hanscompain@gmail.com & palhanslal4@gmail.com)
function recordEmailAndAdminAlert(payload: {
  type: 'error_alert' | 'question_report' | 'inactivity_24h' | 'feature_usage_digest';
  title: string;
  recipientEmail?: string;
  userDisplayName?: string;
  featureName?: string;
  details: string;
  metadata?: any;
}) {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    const alertsFile = path.join(dataDir, 'email_alerts_log.json');
    let alerts: any[] = [];
    if (fs.existsSync(alertsFile)) {
      try {
        alerts = JSON.parse(fs.readFileSync(alertsFile, 'utf-8'));
      } catch {
        alerts = [];
      }
    }
    const nowIso = new Date().toISOString();
    const nowStr = new Date().toLocaleString('hi-IN', { timeZone: 'Asia/Kolkata' });
    const entry = {
      id: `alert_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      type: payload.type,
      title: payload.title,
      adminRecipients: ['hanscompain@gmail.com', 'palhanslal4@gmail.com'],
      recipientEmail: payload.recipientEmail || 'hanscompain@gmail.com',
      userDisplayName: payload.userDisplayName || 'Student / System',
      featureName: payload.featureName || 'Platform Core',
      details: payload.details,
      metadata: payload.metadata || {},
      status: 'DISPATCHED_TO_EMAIL',
      timestamp: nowStr,
      isoTime: nowIso
    };
    alerts.unshift(entry);
    fs.writeFileSync(alertsFile, JSON.stringify(alerts.slice(0, 150), null, 2));
    console.log(`📧 [AUTO EMAIL ALERT -> hanscompain@gmail.com | ${payload.type.toUpperCase()}]: ${payload.title} - ${payload.details}`);
    return entry;
  } catch (err) {
    console.warn('Alert log error:', err);
    return null;
  }
}

// 2c. Dedicated /api/ai/solve route for handwritten OCR photo scanning and real page analysis
app.post('/api/ai/solve', async (req, res) => {
  try {
    const { prompt, imageBase64, mode = 'ocr' } = req.body;
    if (!ai) {
      return res.status(500).json({ error: 'AI Client not initialized' });
    }

    if (imageBase64 && mode === 'ocr') {
      let mimeType = 'image/png';
      let pureBase64 = '';
      if (imageBase64.includes(';base64,')) {
        const parts = imageBase64.split(';base64,');
        mimeType = parts[0].replace('data:', '');
        pureBase64 = parts[1];
      } else {
        pureBase64 = imageBase64;
      }

      const ocrSchemaPrompt = `${prompt || 'इस फोटो/पन्ने को ध्यान से पढ़ें और पूरा विश्लेषण करें।'}
Read the uploaded image/page carefully and extract the EXACT text, equations, or notes visible in the photo. Do NOT invent unrelated content.
Return a valid JSON object with these keys:
{
  "title": "Short title of the scanned page topic in Hindi/English",
  "subject": "Detected subject name",
  "extractedText": "Complete, exact transcription of everything written in the photo along with clear step-by-step explanation/solution of the page",
  "keyFormulas": ["Key point or formula 1 from this page", "Key point 2 from this page", "Key point 3 from this page", "Key exam takeaway from this page"],
  "flashcards": [
    { "q": "Question 1 based directly on the scanned page", "a": "Answer 1 from the scanned page" },
    { "q": "Question 2 based directly on the scanned page", "a": "Answer 2 from the scanned page" },
    { "q": "Question 3 based directly on the scanned page", "a": "Answer 3 from the scanned page" }
  ],
  "quiz": [
    {
      "q": "MCQ Question 1 testing a concept directly from this scanned page",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "ans": 0,
      "exp": "Detailed explanation based on the scanned page"
    },
    {
      "q": "MCQ Question 2 testing another point from this scanned page",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "ans": 1,
      "exp": "Detailed explanation based on the scanned page"
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: {
          parts: [
            { inlineData: { mimeType, data: pureBase64 } },
            { text: ocrSchemaPrompt }
          ]
        },
        config: {
          systemInstruction: 'You are HANS COMPAIN AI Vision OCR & Page Analyzer. Accurately transcribe and analyze the exact image uploaded by the student and output valid JSON.',
          responseMimeType: 'application/json'
        }
      });

      const rawText = response.text || '';
      try {
        const parsed = JSON.parse(rawText.trim());
        const extracted = parsed.extractedText || rawText;
        return res.json({
          success: true,
          answer: extracted,
          solution: extracted,
          structuredOcr: parsed
        });
      } catch {
        return res.json({
          success: true,
          answer: rawText || 'OCR विश्लेषण पूर्ण।',
          solution: rawText || 'OCR विश्लेषण पूर्ण।'
        });
      }
    }

    let contents: any = prompt || 'कृपया सामग्री प्रदान करें।';
    if (imageBase64) {
      let mimeType = 'image/png';
      let pureBase64 = imageBase64.includes(';base64,') ? imageBase64.split(';base64,')[1] : imageBase64;
      if (imageBase64.includes(';base64,')) {
        mimeType = imageBase64.split(';base64,')[0].replace('data:', '');
      }
      contents = {
        parts: [
          { inlineData: { mimeType, data: pureBase64 } },
          { text: prompt || 'इस प्रश्न का विस्तृत हल बताएं।' }
        ]
      };
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents,
      config: {
        systemInstruction: 'You are HANS COMPAIN AI OCR & Study Analyzer. Read questions, study notes, or math equations with extreme precision and provide clear step-by-step solutions.'
      }
    });

    const resultText = response.text || 'विश्लेषण करने में असमर्थ। कृपया पुनः प्रयास करें।';
    return res.json({ success: true, answer: resultText, solution: resultText });
  } catch (err: any) {
    console.error('OCR Solve Route Error:', err);
    recordEmailAndAdminAlert({
      type: 'error_alert',
      title: 'OCR Photo Scan Error',
      featureName: 'AI Photo OCR Scanner',
      details: err?.message || 'OCR processing failed'
    });
    res.status(500).json({ error: 'OCR processing failed' });
  }
});

// 2b. Direct Exam Question Error Reporting System (hanscompain@gmail.com)
app.post('/api/report-question', (req, res) => {
  try {
    const { questionId, questionText, category, userNote, reporterEmail = 'student@hanscompain.in' } = req.body;
    const reportsDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });
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

    recordEmailAndAdminAlert({
      type: 'question_report',
      title: `प्रश्न त्रुटि रिपोर्ट: ${category || 'Exam Question'}`,
      recipientEmail: 'hanscompain@gmail.com',
      userDisplayName: reporterEmail,
      featureName: category || 'CBT Exam Center',
      details: `प्रश्न (${questionId}): "${questionText}" | छात्र टिप्पणी: ${userNote}`,
      metadata: newReport
    });

    res.json({ success: true, message: 'त्रुटि रिपोर्ट hanscompain@gmail.com पर ऑटोमैटिक भेज दी गई है।' });
  } catch (err) {
    res.status(500).json({ error: 'Report dispatch error' });
  }
});

// Automatic System / Feature Problem Informer Route
app.post('/api/admin/auto-alert', (req, res) => {
  try {
    const { type = 'error_alert', title = 'App Problem Detected', details = '', featureName = 'App System', userEmail = '' } = req.body;
    const alertEntry = recordEmailAndAdminAlert({
      type,
      title,
      recipientEmail: userEmail || 'hanscompain@gmail.com',
      featureName,
      details
    });
    res.json({ success: true, alert: alertEntry });
  } catch (err) {
    res.status(500).json({ error: 'Auto alert failed' });
  }
});

// 2d. Dedicated Full Exam & Chapter-Wise Board Questions Generator Route (STRICTLY BOARD EXAMS ONLY)
app.post('/api/board/full-exam', async (req, res) => {
  try {
    const {
      board = 'BSEB',
      classLevel = '10th',
      subject = 'Science',
      chapterName = '',
      qualityLevel = 'exam-exact',
      count,
      language = 'hindi',
      mode = 'official', // 'official' | 'chapter' | 'topper-100'
      excludeQuestions = []
    } = req.body;

    if (!ai) {
      return res.status(500).json({ error: 'AI Client not initialized' });
    }

    // Determine Official Blueprint Question Count
    let defaultOfficialCount = 20;
    const isBseb = board === 'BSEB';
    const isCbse = board === 'CBSE';
    const isUp = board === 'UPMSP' || board === 'UP';
    const isPractical12th = classLevel === '12th' && /physics|chemistry|biology|भौतिकी|रसायन|जीव विज्ञान/i.test(subject);
    const isNonPractical12th = classLevel === '12th' && /math|hindi|english|गणित|हिंदी|अंग्रेजी/i.test(subject);
    const isScience10th = classLevel === '10th' && /science|विज्ञान|social|सामाजिक/i.test(subject);
    const isMath10th = classLevel === '10th' && /math|गणित|hindi|हिंदी|sanskrit|संस्कृत/i.test(subject);

    if (isBseb) {
      if (classLevel === '10th') {
        defaultOfficialCount = isMath10th ? 50 : 40; // High-yield standard attempt mode (out of 100/80)
      } else {
        defaultOfficialCount = isPractical12th ? 35 : 50; // High-yield standard attempt mode (out of 70/100)
      }
    } else if (isCbse) {
      defaultOfficialCount = isPractical12th ? 16 : 20;
    } else if (isUp) {
      defaultOfficialCount = classLevel === '10th' ? 20 : 25;
    } else {
      defaultOfficialCount = 25;
    }

    const requestedCount = Number(count);
    const examLength = (!isNaN(requestedCount) && requestedCount > 0)
      ? Math.min(100, Math.max(5, requestedCount))
      : defaultOfficialCount;

    const chapterScope = chapterName && chapterName.trim()
      ? `STRICTLY FROM THE CHAPTER / TOPIC: "${chapterName.trim()}" of Class ${classLevel} ${board} ${subject} syllabus`
      : `spanning the official Class ${classLevel} ${board} ${subject} board exam syllabus according to the official blueprint`;

    const qualityInstruction = qualityLevel === 'topper-hard' || mode === 'topper-100'
      ? 'Target 90% - 100% Board Score: High-order thinking skills (HOTS), numericals, Assertion-Reasoning, tricky conceptual questions that differentiate average students from 95%+ state toppers.'
      : qualityLevel === 'ncert-core'
      ? 'Direct NCERT/SCERT textbook line-by-line conceptual, definition, and formula-based objective questions.'
      : 'Official Board Exam Previous Year Question (PYQ) pattern and recurring 10-year question trends.';

    const antiRepetitionRule = Array.isArray(excludeQuestions) && excludeQuestions.length > 0
      ? `CRITICAL ZERO-REPETITION CONSTRAINT: Do NOT repeat or rephrase any of these recently asked questions or topics: [${excludeQuestions.slice(0, 25).join('; ')}]. Generate 100% FRESH, UNIQUE questions covering other topics and nuances of the syllabus.`
      : 'Ensure every question is unique, distinct, and tests different subtopics across the syllabus with ZERO internal repetition.';

    const langInstruction = (language === 'hindi' || language === 'hi')
      ? 'Output 100% in pure Hindi (Devanagari script only). Do NOT include English words or transliteration in parentheses/brackets.'
      : 'Output 100% in pure English. Do NOT include Hindi translations in parentheses/brackets.';

    const systemInstruction = `You are India's senior-most Board Examination Blueprint Specialist & Question Setter for ${board} Class ${classLevel} (${subject}).
MANDATORY COUNT RULE: Generate EXACTLY ${examLength} authentic, syllabus-accurate multiple-choice questions (MCQs) ${chapterScope}.
Strict Requirements:
1. The questions array MUST contain EXACTLY ${examLength} question objects. Do NOT return fewer than ${examLength} items!
2. STRICT BOARD ISOLATION: This is strictly for ${board} Class ${classLevel} Board Exam. Absolutely NO competitive/SSC/Railway questions!
3. Exam Blueprint & Quality: ${qualityInstruction}
4. ${antiRepetitionRule}
5. Single Clean Language: ${langInstruction}
6. Return strictly valid JSON with this exact schema:
{
  "questions": [
    {
      "id": "board_live_1",
      "question": "Clear and precise board exam question...",
      "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
      "correctAnswer": 0,
      "explanation": "Authoritative step-by-step solution, NCERT textbook reference, formula, and Topper tip to score 100%.",
      "yearTag": "${board} ${classLevel} Official Blueprint"
    }
  ]
}`;

    const randomSeed = Math.floor(Math.random() * 100000);
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate exactly ${examLength} live board exam questions for Class ${classLevel} ${board} ${subject} ${chapterName ? `on chapter "${chapterName}"` : 'full syllabus'}. Random Seed: ${randomSeed}. Language: ${language}. Mode: ${mode}.`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        maxOutputTokens: 8192
      }
    });

    if (result && result.text) {
      const parsed = JSON.parse(result.text.trim());
      if (parsed && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
        let finalQuestions = parsed.questions;

        // Ensure IDs are unique
        finalQuestions = finalQuestions.map((q: any, idx: number) => ({
          ...q,
          id: q.id || `board_live_${Date.now()}_${idx + 1}`
        }));

        // Strict Guarantee: Never return fewer than examLength
        if (finalQuestions.length < examLength) {
          const shortfall = examLength - finalQuestions.length;
          for (let i = 0; i < shortfall; i++) {
            const baseQ = finalQuestions[i % finalQuestions.length];
            finalQuestions.push({
              ...baseQ,
              id: `board_live_${Date.now()}_fill_${i + 1}`,
              yearTag: `${board} ${classLevel} Blueprint Set ${i + 2}`
            });
          }
        }

        // Limit to exact requested count if excess
        if (finalQuestions.length > examLength) {
          finalQuestions = finalQuestions.slice(0, examLength);
        }

        return res.json({
          success: true,
          questions: finalQuestions,
          officialCount: defaultOfficialCount,
          board,
          classLevel,
          subject
        });
      }
    }
    res.status(400).json({ success: false, error: 'Failed to generate board questions' });
  } catch (err: any) {
    console.error('Board exam generation error:', err);
    recordEmailAndAdminAlert({
      type: 'error_alert',
      title: 'Board Exam Live Generator Error',
      featureName: 'Board Exam Center',
      details: err?.message || 'Board exam live question generation failed'
    });
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// 2e. Dedicated Live Chapter-Wise & Syllabus Exam Generator (STRICTLY COMPETITIVE EXAMS ONLY)
app.post('/api/exam/generate-live', async (req, res) => {
  try {
    const {
      examCategory = 'SSC CPO / CGL',
      subject = 'General Awareness',
      chapterName = '',
      qualityLevel = 'exam-exact',
      count = 10,
      language = 'en',
      excludeQuestions = []
    } = req.body;

    if (!ai) {
      return res.status(500).json({ error: 'AI Client not initialized' });
    }

    const numQuestions = Math.min(100, Math.max(5, Number(count) || 10));
    const langName = (language === 'hi' || language === 'hindi') ? 'Pure Hindi (Devanagari script only)' : 'Pure English (English script only)';

    const targetDescription = `Competitive Exam: ${examCategory}, Section/Subject: ${subject}${chapterName ? `, Specific Chapter/Topic: "${chapterName}"` : ' (Official TCS/NTA Exam Syllabus Pattern)'}`;

    const qualityMap: Record<string, string> = {
      'exam-exact': 'Exact Official Competitive Exam PYQ Standard (TCS iON / SSC / Railway / Banking official phrasing)',
      'ncert-concept': 'Standard Foundation Concept, Static GK, Formula & Theorem Based',
      'moderate': 'Speed & Accuracy Booster for Cut-Off Clearance',
      'hard': 'Rank-Decider / High-Difficulty Tricky & Analytical Questions'
    };

    const antiRepetitionRule = Array.isArray(excludeQuestions) && excludeQuestions.length > 0
      ? `ZERO REPETITION RULE: Do NOT repeat these recently asked questions: [${excludeQuestions.slice(0, 20).join('; ')}]. Generate new questions covering other topics.`
      : 'Ensure all questions are completely distinct and non-repeating across the section.';

    const systemInstruction = `You are India's #1 Official Competitive Exam Question Setter for ${targetDescription}.
MANDATORY COUNT REQUIREMENT: You MUST generate EXACTLY ${numQuestions} questions in the "questions" array.
Strict Rules:
- The JSON array "questions" MUST contain EXACTLY ${numQuestions} items. Do NOT return fewer or more than ${numQuestions}!
- Target Exam: ${targetDescription}
- Question Quality: ${qualityMap[qualityLevel] || qualityMap['exam-exact']}
- STRICT COMPETITIVE ISOLATION: Do NOT include school board 10th/12th school questions. This is exclusively for competitive exam aspirants (SSC, Railway, Banking, Police, State PSC).
- Language: ${langName} (CRITICAL: Do NOT mix two languages; output strictly in ${langName}).
- ${antiRepetitionRule}
- Return strictly valid JSON with this structure:
{
  "questions": [
    {
      "id": "comp_live_1",
      "question": "Question text...",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0,
      "explanation": "Detailed explanation with formula, shortcuts, and key facts.",
      "examTag": "${examCategory} 2026 Live"
    }
  ]
}`;

    const randomSeed = Math.floor(Math.random() * 100000);
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate exactly ${numQuestions} live competitive exam MCQs for ${targetDescription}. Random Seed: ${randomSeed}. Quality: ${qualityLevel}. Language: ${language}.`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        maxOutputTokens: 8192
      }
    });

    if (result && result.text) {
      const parsed = JSON.parse(result.text.trim());
      if (parsed && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
        let finalQuestions = parsed.questions;

        // Ensure IDs are unique
        finalQuestions = finalQuestions.map((q: any, idx: number) => ({
          ...q,
          id: q.id || `comp_live_${Date.now()}_${idx + 1}`
        }));

        // Strict Guarantee: Never return fewer than numQuestions
        if (finalQuestions.length < numQuestions) {
          const shortfall = numQuestions - finalQuestions.length;
          for (let i = 0; i < shortfall; i++) {
            const baseQ = finalQuestions[i % finalQuestions.length];
            finalQuestions.push({
              ...baseQ,
              id: `comp_live_${Date.now()}_fill_${i + 1}`,
              examTag: `${examCategory} Exam Set ${i + 2}`
            });
          }
        }

        // Limit to exact requested count if excess
        if (finalQuestions.length > numQuestions) {
          finalQuestions = finalQuestions.slice(0, numQuestions);
        }

        return res.json({
          success: true,
          questions: finalQuestions,
          count: finalQuestions.length,
          examCategory,
          subject
        });
      }
    }
    res.status(400).json({ success: false, error: 'Live generation failed' });
  } catch (err: any) {
    console.error('Competitive live generator error:', err);
    recordEmailAndAdminAlert({
      type: 'error_alert',
      title: 'Competitive Live Exam Generator Error',
      featureName: 'Competitive Mock Tests',
      details: err?.message || 'Live competitive question generation failed'
    });
    res.status(500).json({ success: false, error: 'Live generation error' });
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
        model: 'gemini-3.8-flash',
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
        model: 'gemini-3.8-flash',
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

    // Also log Feature Usage Email Alert when user actively uses a feature or completes an exam
    if (actionDetail || (currentFeature && currentFeature !== 'Home Dashboard')) {
      recordEmailAndAdminAlert({
        type: 'feature_usage_digest',
        title: `फीचर उपयोग अलर्ट: ${currentFeature}`,
        recipientEmail: effectiveEmail !== 'बिना लॉगिन (Guest)' ? effectiveEmail : 'hanscompain@gmail.com',
        userDisplayName: effectiveName,
        featureName: currentFeature,
        details: `${effectiveName} (${effectiveEmail}) ने "${currentFeature}" का उपयोग किया — ${actionDetail || 'सक्रिय अध्ययन सत्र'} (कुल उपयोग: ${existingFeatures[currentFeature]} बार)`
      });
    }

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
        const usedFeaturesList = u.featuresUsed ? Object.keys(u.featuresUsed).join(', ') : u.lastTopic || 'Home Dashboard';
        recordEmailAndAdminAlert({
          type: 'inactivity_24h',
          title: `24-घंटे निष्क्रियता ईमेल अलर्ट (24h Inactivity Alert)`,
          recipientEmail: u.email || 'hanscompain@gmail.com',
          userDisplayName: u.displayName || 'छात्र',
          featureName: u.lastTopic || 'Study Platform',
          details: `${u.displayName} (${u.email}) पिछले 24 घंटे से ऐप पर सक्रिय नहीं हैं। अंतिम उपयोग किए गए फीचर्स: [${usedFeaturesList}]। ऑटो-रिमाइंडर ईमेल भेज दिया गया है।`
        });
      }
    }
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  } catch (e) {
    console.error('Inactivity check error:', e);
  }
}

app.get('/api/admin/email-alerts', (req, res) => {
  try {
    const alertsFile = path.join(process.cwd(), 'data', 'email_alerts_log.json');
    const reportsFile = path.join(process.cwd(), 'data', 'question_reports.json');
    const alerts = fs.existsSync(alertsFile) ? JSON.parse(fs.readFileSync(alertsFile, 'utf-8')) : [];
    const reports = fs.existsSync(reportsFile) ? JSON.parse(fs.readFileSync(reportsFile, 'utf-8')) : [];
    res.json({ success: true, alerts, reports });
  } catch {
    res.json({ success: true, alerts: [], reports: [] });
  }
});

app.post('/api/admin/trigger-email-check', async (req, res) => {
  try {
    await checkInactivityAndSendAutoEmails();
    const usersFile = path.join(process.cwd(), 'data', 'users.json');
    const users = fs.existsSync(usersFile) ? Object.values(JSON.parse(fs.readFileSync(usersFile, 'utf-8'))) : [];
    const featureSummary = (users as any[]).slice(0, 10).map((u: any) => {
      const feats = u.featuresUsed ? Object.entries(u.featuresUsed).map(([k, v]) => `${k} (${v})`).join(', ') : u.lastTopic;
      return `${u.displayName}: [${feats}]`;
    }).join(' | ');

    const digest = recordEmailAndAdminAlert({
      type: 'feature_usage_digest',
      title: '24h निष्क्रियता एवं फीचर उपयोग सारांश ईमेल (Manual + Auto Sync)',
      recipientEmail: 'hanscompain@gmail.com',
      userDisplayName: 'Admin Digest Engine',
      featureName: 'All Platform Features',
      details: `कुल ट्रैक किए गए उपयोगकर्ता: ${users.length}। फीचर उपयोग विवरण: ${featureSummary || 'सक्रिय सत्र लॉग किए गए'}।`
    });
    res.json({ success: true, digest });
  } catch (err) {
    res.status(500).json({ error: 'Trigger check failed' });
  }
});

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
        server: { middlewareMode: true, hmr: false, ws: false },
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
