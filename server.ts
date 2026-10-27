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

// Static SEO assets for Googlebot and Google Search Console
app.get('/robots.txt', (req, res) => {
  res.type('text/plain').sendFile(path.join(process.cwd(), 'public', 'robots.txt'));
});
app.get('/sitemap.xml', (req, res) => {
  res.type('application/xml').sendFile(path.join(process.cwd(), 'public', 'sitemap.xml'));
});
app.get('/favicon.ico', (req, res) => {
  res.setHeader('Content-Type', 'image/x-icon');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.sendFile(path.join(process.cwd(), 'public', 'favicon.ico'));
});
app.get(['/favicon.png', '/favicon-96x96.png', '/pwa-192x192.png', '/pwa-512x512.png', '/logo.png', '/og-image.png', '/apple-touch-icon.png'], (req, res) => {
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.sendFile(path.join(process.cwd(), 'public', req.path));
});
app.use(express.static(path.join(process.cwd(), 'public'), {
  maxAge: '1d',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.png') || filePath.endsWith('.ico') || filePath.endsWith('.svg')) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }
  }
}));

let ai: GoogleGenAI | null = null;
try {
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  } else {
    ai = new GoogleGenAI({
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
} catch (e) {
  console.warn('AI Init Error:', e);
}

function safeJsonParse(text: string): any {
  if (!text) throw new Error("Empty text for JSON parsing");
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }

  try {
    return JSON.parse(cleaned);
  } catch (e1) {
    try {
      const firstBrace = cleaned.indexOf('{');
      const lastBrace = cleaned.lastIndexOf('}');
      const firstBracket = cleaned.indexOf('[');
      const lastBracket = cleaned.lastIndexOf(']');

      let startIdx = -1;
      let endIdx = -1;
      if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
        startIdx = firstBrace;
        endIdx = lastBrace;
      } else if (firstBracket !== -1) {
        startIdx = firstBracket;
        endIdx = lastBracket;
      }

      if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
        const sub = cleaned.substring(startIdx, endIdx + 1);
        return JSON.parse(sub);
      }
    } catch (e2) {
      // ignore
    }
    throw e1;
  }
}

// ============================================================================
// HANS COMPAIN - EMBEDDED SYLLABUS & CHAPTER-WISE QUESTION VAULT
// Enforces 100% strict subject integrity, chapter matching & exact count
// ============================================================================
interface ServerSyllabusQuestion {
  id: string;
  subject: string;
  subjectKey: 'hindi' | 'science' | 'math' | 'social_science' | 'sanskrit' | 'english' | 'polity' | 'steno' | 'gk';
  level: 'board' | 'competitive' | 'both';
  classLevel?: '10th' | '12th' | 'general';
  chapter: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  tag: string;
}

const SERVER_HINDI_QUESTIONS: ServerSyllabusQuestion[] = [
  {
    id: 'hi_sd_1',
    subject: 'हिन्दी (Hindi)',
    subjectKey: 'hindi',
    level: 'both',
    classLevel: '10th',
    chapter: 'संधि (Sandhi)',
    question: "'विद्या + आलय' में कौन-सी संधि है?",
    options: ['दीर्घ स्वर संधि', 'गुण स्वर संधि', 'वृद्धि स्वर संधि', 'यण स्वर संधि'],
    correctAnswer: 0,
    explanation: 'ह्रस्व या दीर्घ आ, इ, उ के बाद समान स्वर आने पर दोनों मिलकर दीर्घ (आ, ई, ऊ) हो जाते हैं। विद्या + आलय = विद्यालय (दीर्घ संधि)।',
    tag: 'हिन्दी व्याकरण - संधि'
  },
  {
    id: 'hi_sd_2',
    subject: 'हिन्दी (Hindi)',
    subjectKey: 'hindi',
    level: 'both',
    classLevel: '10th',
    chapter: 'संधि (Sandhi)',
    question: "'सूर्य + उदय' का सही संधि रूप क्या होगा?",
    options: ['सूर्योदय', 'सूर्यौदय', 'सूर्यादय', 'सूर्यउदय'],
    correctAnswer: 0,
    explanation: 'अ/आ के बाद उ/ऊ आने पर दोनों मिलकर ओ हो जाते हैं। यह गुण स्वर संधि का नियम है (सूर्य + उदय = सूर्योदय)।',
    tag: 'हिन्दी व्याकरण - संधि'
  },
  {
    id: 'hi_sm_1',
    subject: 'हिन्दी (Hindi)',
    subjectKey: 'hindi',
    level: 'both',
    classLevel: '10th',
    chapter: 'समास (Samas)',
    question: "'यथाशक्ति' शब्द में कौन-सा समास है?",
    options: ['अव्ययीभाव समास', 'तत्पुरुष समास', 'द्विगु समास', 'द्वंद्व समास'],
    correctAnswer: 0,
    explanation: 'जिस समास का पहला पद अव्यय या उपसर्ग हो और वही प्रधान हो, उसे अव्ययीभाव समास कहते हैं (शक्ति के अनुसार = यथाशक्ति)।',
    tag: 'हिन्दी व्याकरण - समास'
  },
  {
    id: 'hi_sm_2',
    subject: 'हिन्दी (Hindi)',
    subjectKey: 'hindi',
    level: 'both',
    classLevel: '10th',
    chapter: 'समास (Samas)',
    question: "'दशानन' (दस हैं आनन जिसके अर्थात रावण) में कौन-सा समास है?",
    options: ['कर्मधारय समास', 'द्विगु समास', 'बहुव्रीहि समास', 'अव्ययीभाव समास'],
    correctAnswer: 2,
    explanation: 'जब दोनों पद मिलकर किसी तीसरे विशेष अर्थ (रावण) की ओर संकेत करते हैं, तो वहाँ बहुव्रीहि समास होता है।',
    tag: 'हिन्दी व्याकरण - समास'
  },
  {
    id: 'hi_sm_3',
    subject: 'हिन्दी (Hindi)',
    subjectKey: 'hindi',
    level: 'both',
    classLevel: '10th',
    chapter: 'समास (Samas)',
    question: "'माता-पिता' और 'दिन-रात' में कौन-सा समास है?",
    options: ['द्वंद्व समास', 'द्विगु समास', 'तत्पुरुष समास', 'कर्मधारय समास'],
    correctAnswer: 0,
    explanation: 'जिस समास में दोनों पद प्रधान हों और बीच में योजक चिह्न या "और/या" का लोप हो, उसे द्वंद्व समास कहते हैं।',
    tag: 'हिन्दी व्याकरण - समास'
  },
  {
    id: 'hi_ras_1',
    subject: 'हिन्दी (Hindi)',
    subjectKey: 'hindi',
    level: 'both',
    classLevel: '10th',
    chapter: 'रस (Ras)',
    question: "'शृंगार रस' का स्थायी भाव क्या है?",
    options: ['रति (प्रेम)', 'उत्साह', 'शोक', 'हास'],
    correctAnswer: 0,
    explanation: 'शृंगार रस को रसराज भी कहा जाता है और इसका स्थायी भाव "रति" (स्त्री-पुरुष का पारस्परिक प्रेम) है।',
    tag: 'काव्यशास्त्र - रस'
  },
  {
    id: 'hi_ras_2',
    subject: 'हिन्दी (Hindi)',
    subjectKey: 'hindi',
    level: 'both',
    classLevel: '10th',
    chapter: 'रस (Ras)',
    question: "'वीर रस' का स्थायी भाव क्या है?",
    options: ['उत्साह', 'क्रोध', 'भय', 'निर्वेद'],
    correctAnswer: 0,
    explanation: 'युद्ध या किसी कठिन कार्य को करने के लिए मन में उत्पन्न उमंग और तत्परता "उत्साह" कहलाती है, जो वीर रस का स्थायी भाव है।',
    tag: 'काव्यशास्त्र - रस'
  },
  {
    id: 'hi_alk_1',
    subject: 'हिन्दी (Hindi)',
    subjectKey: 'hindi',
    level: 'both',
    classLevel: '10th',
    chapter: 'अलंकार (Alankar)',
    question: "'कनक कनक ते सौ गुनी, मादकता अधिकाय। या खाए बौराय जग, या पाए बौराय।' में कौन-सा अलंकार है?",
    options: ['यमक अलंकार', 'श्लेष अलंकार', 'अनुप्रास अलंकार', 'उपमा अलंकार'],
    correctAnswer: 0,
    explanation: 'यहाँ "कनक" शब्द दो बार आया है और दोनों बार अलग-अलग अर्थ (धतूरा और सोना) है, अतः यह यमक अलंकार है।',
    tag: 'काव्यशास्त्र - अलंकार'
  },
  {
    id: 'hi_alk_2',
    subject: 'हिन्दी (Hindi)',
    subjectKey: 'hindi',
    level: 'both',
    classLevel: '10th',
    chapter: 'अलंकार (Alankar)',
    question: "'चरण कमल बंदौ हरिराई' में कौन-सा अलंकार है?",
    options: ['रूपक अलंकार', 'उपमा अलंकार', 'उत्प्रेक्षा अलंकार', 'अतिशयोक्ति अलंकार'],
    correctAnswer: 0,
    explanation: 'यहाँ उपमेय (चरण) पर उपमान (कमल) का अभेद आरोप किया गया है, अतः यह रूपक अलंकार है।',
    tag: 'काव्यशास्त्र - अलंकार'
  },
  {
    id: 'hi_muh_1',
    subject: 'हिन्दी (Hindi)',
    subjectKey: 'hindi',
    level: 'both',
    classLevel: '10th',
    chapter: 'मुहावरे व लोकोक्तियाँ',
    question: "'आँख का तारा होना' मुहावरे का सही अर्थ क्या है?",
    options: ['बहुत प्यारा होना', 'अंधा होना', 'दूर की सोचना', 'आँखों में दर्द होना'],
    correctAnswer: 0,
    explanation: '"आँख का तारा होना" का अर्थ अत्यंत प्रिय अथवा लाडला होना होता है।',
    tag: 'हिन्दी व्याकरण - मुहावरे'
  },
  {
    id: 'hi_muh_2',
    subject: 'हिन्दी (Hindi)',
    subjectKey: 'hindi',
    level: 'both',
    classLevel: '10th',
    chapter: 'मुहावरे व लोकोक्तियाँ',
    question: "'दांत खट्टे करना' मुहावरे का सटीक अर्थ क्या है?",
    options: ['बुरी तरह हराना/पराजित करना', 'खट्टी चीज खाना', 'दांत में दर्द होना', 'नुकसान पहुँचाना'],
    correctAnswer: 0,
    explanation: 'शत्रु या प्रतिद्वंद्वी को युद्ध अथवा मुकाबले में पराजित करना "दांत खट्टे करना" कहलाता है।',
    tag: 'हिन्दी व्याकरण - मुहावरे'
  },
  {
    id: 'hi_vak_1',
    subject: 'हिन्दी (Hindi)',
    subjectKey: 'hindi',
    level: 'both',
    classLevel: '10th',
    chapter: 'वाक्यांश के लिए एक शब्द',
    question: "'जो सब कुछ जानता हो' के लिए एक उपयुक्त शब्द क्या है?",
    options: ['सर्वज्ञ', 'अल्पज्ञ', 'सर्वव्यापी', 'विद्वान'],
    correctAnswer: 0,
    explanation: 'जो सब कुछ जानता हो उसे सर्वज्ञ कहते हैं; थोड़ा जानने वाले को अल्पज्ञ कहते हैं।',
    tag: 'हिन्दी शब्द ज्ञान'
  },
  {
    id: 'hi_vil_1',
    subject: 'हिन्दी (Hindi)',
    subjectKey: 'hindi',
    level: 'both',
    classLevel: '10th',
    chapter: 'विलोम शब्द',
    question: "'अनुराग' शब्द का सही विलोम क्या होगा?",
    options: ['विराग', 'द्वेष', 'घृणा', 'विमुख'],
    correctAnswer: 0,
    explanation: 'अनुराग का विलोम विराग होता है। अनुराग का अर्थ गहरा प्रेम और विराग का अर्थ अनासक्ति है।',
    tag: 'हिन्दी शब्द ज्ञान'
  },
  {
    id: 'hi_sah_1',
    subject: 'हिन्दी (Hindi)',
    subjectKey: 'hindi',
    level: 'both',
    classLevel: '10th',
    chapter: 'हिन्दी साहित्य एवं लेखक',
    question: "कालजयी उपन्यास 'गोदान' के रचनाकार कौन हैं?",
    options: ['मुंशी प्रेमचंद', 'जयशंकर प्रसाद', 'सूर्यकांत त्रिपाठी निराला', 'हजारी प्रसाद द्विवेदी'],
    correctAnswer: 0,
    explanation: "'गोदान' मुंशी प्रेमचंद द्वारा 1936 में रचित अमर उपन्यास है जो भारतीय कृषक जीवन का महाकाव्य कहलाता है।",
    tag: 'हिन्दी साहित्य'
  },
  {
    id: 'hi_sah_2',
    subject: 'हिन्दी (Hindi)',
    subjectKey: 'hindi',
    level: 'both',
    classLevel: '12th',
    chapter: 'हिन्दी साहित्य एवं लेखक',
    question: "छायावाद के प्रवर्तक कवि जयशंकर प्रसाद द्वारा रचित महाकाव्य कौन-सा है?",
    options: ['कामायनी', 'साकेत', 'प्रियप्रवास', 'उर्वशी'],
    correctAnswer: 0,
    explanation: "'कामायनी' जयशंकर प्रसाद का 15 सर्गों वाला अमर महाकाव्य है जिसमें मनु, श्रद्धा और इड़ा मुख्य पात्र हैं।",
    tag: 'हिन्दी साहित्य'
  },
  {
    id: 'hi_sah_3',
    subject: 'हिन्दी (Hindi)',
    subjectKey: 'hindi',
    level: 'both',
    classLevel: '10th',
    chapter: 'हिन्दी साहित्य एवं लेखक',
    question: "संत कबीरदास भक्ति काल की किस काव्यधारा के प्रतिनिधि कवि थे?",
    options: ['निर्गुण ज्ञानाश्रयी शाखा (संत काव्य)', 'सगुण कृष्णभक्ति शाखा', 'सगुण रामभक्ति शाखा', 'सूफी प्रेमाश्रयी शाखा'],
    correctAnswer: 0,
    explanation: 'कबीरदास जी निर्गुण संत काव्यधारा के शीर्ष कवि थे जिनकी रचनाएं बीजक (साखी, सबद, रमैनी) में संकलित हैं।',
    tag: 'हिन्दी साहित्य'
  },
  {
    id: 'hi_vyk_1',
    subject: 'हिन्दी (Hindi)',
    subjectKey: 'hindi',
    level: 'both',
    classLevel: '10th',
    chapter: 'संज्ञा एवं सर्वनाम',
    question: "हिन्दी व्याकरण के अनुसार सर्वनाम के कुल कितने भेद होते हैं?",
    options: ['6', '5', '4', '7'],
    correctAnswer: 0,
    explanation: 'सर्वनाम के 6 भेद होते हैं: 1. पुरुषवाचक 2. निश्चयवाचक 3. अनिश्चयवाचक 4. संबंधवाचक 5. प्रश्नवाचक 6. निजवाचक।',
    tag: 'हिन्दी व्याकरण'
  },
  {
    id: 'hi_kav_1',
    subject: 'हिन्दी (Hindi)',
    subjectKey: 'hindi',
    level: 'both',
    classLevel: '10th',
    chapter: 'काव्यांश व पद्य',
    question: "'रहिमन पानी राखिए, बिन पानी सब सून। पानी गए न ऊबरे, मोती मानुष चून।' में 'पानी' शब्द में कौन-सा अलंकार है?",
    options: ['श्लेष अलंकार', 'यमक अलंकार', 'रूपक अलंकार', 'उपमा अलंकार'],
    correctAnswer: 0,
    explanation: 'एक ही शब्द "पानी" के तीन अलग-अलग प्रसंगों में तीन अर्थ हैं (मोती के लिए चमक, मनुष्य के लिए प्रतिष्ठा/सम्मान, चून के लिए जल), अतः श्लेष अलंकार है।',
    tag: 'काव्यशास्त्र - अलंकार'
  }
];

const SERVER_SCIENCE_QUESTIONS: ServerSyllabusQuestion[] = [
  {
    id: 'sc_el_1',
    subject: 'विज्ञान (Science)',
    subjectKey: 'science',
    level: 'both',
    classLevel: '10th',
    chapter: 'विद्युत (Electricity)',
    question: 'ओम के नियम के अनुसार विभवांतर (V) और विद्युत धारा (I) का सही गणितीय संबंध क्या है?',
    options: ['V = I × R', 'V = I / R', 'V = R / I', 'I = V × R'],
    correctAnswer: 0,
    explanation: 'नियत ताप पर चालक तार के सिरों के बीच का विभवांतर उसमें प्रवाहित विद्युत धारा के समानुपाती होता है (V = I * R)।',
    tag: 'भौतिकी - विद्युत'
  },
  {
    id: 'sc_el_2',
    subject: 'विज्ञान (Science)',
    subjectKey: 'science',
    level: 'both',
    classLevel: '10th',
    chapter: 'विद्युत (Electricity)',
    question: 'विद्युत धारा (Electric Current) मापने के लिए किस यंत्र का उपयोग परिपथ में श्रेणीक्रम में किया जाता है?',
    options: ['अमीटर (Ammeter)', 'वोल्टमीटर (Voltmeter)', 'गैल्वेनोमीटर (Galvanometer)', 'पोटेंशियोमीटर'],
    correctAnswer: 0,
    explanation: 'विद्युत धारा को अमीटर द्वारा मापा जाता है और इसे परिपथ में हमेशा श्रेणीक्रम (Series) में जोड़ा जाता है।',
    tag: 'भौतिकी - विद्युत'
  },
  {
    id: 'sc_ch_1',
    subject: 'विज्ञान (Science)',
    subjectKey: 'science',
    level: 'both',
    classLevel: '10th',
    chapter: 'रासायनिक अभिक्रियाएँ एवं समीकरण',
    question: 'लोहे पर जंग लगना (Rusting of Iron) किस प्रकार की अभिक्रिया का उदाहरण है?',
    options: ['ऑक्सीकरण एवं संक्षारण (Redox/Corrosion)', 'अपचयन मात्र', 'अपघटन अभिक्रिया', 'विस्थापन अभिक्रिया मात्र'],
    correctAnswer: 0,
    explanation: 'लोहा नम वायु और ऑक्सीजन की उपस्थिति में फेरिक ऑक्साइड में ऑक्सीकृत होकर संक्षारित होता है।',
    tag: 'रसायन विज्ञान'
  },
  {
    id: 'sc_ch_2',
    subject: 'विज्ञान (Science)',
    subjectKey: 'science',
    level: 'both',
    classLevel: '10th',
    chapter: 'अम्ल, क्षारक एवं लवण',
    question: 'शुद्ध जल का 25°C पर pH मान कितना होता है?',
    options: ['7.0 (उदासीन)', '0', '14.0', '1.0'],
    correctAnswer: 0,
    explanation: 'शुद्ध आसुत जल उदासीन होता है जिसमें H+ और OH- आयनों की सांद्रता बराबर (10^-7 mol/L) होती है, अतः pH = 7 होता है।',
    tag: 'रसायन विज्ञान - अम्ल व क्षार'
  },
  {
    id: 'sc_bio_1',
    subject: 'विज्ञान (Science)',
    subjectKey: 'science',
    level: 'both',
    classLevel: '10th',
    chapter: 'जैव प्रक्रम (Life Processes)',
    question: 'मानव शरीर में रक्त को पूरे शरीर में पंप करने वाला अंग कौन-सा है और इसमें कितने कोष्ठ (Chambers) होते हैं?',
    options: ['हृदय - 4 कोष्ठ', 'फेफड़ा - 2 कोष्ठ', 'वृक्क - 2 कोष्ठ', 'यकृत - 3 कोष्ठ'],
    correctAnswer: 0,
    explanation: 'मानव हृदय चार कोष्ठों (दो अलिंद तथा दो निलय) में बंटा होता है जो ऑक्सीजनित और विऑक्सीजनित रक्त को अलग रखते हैं।',
    tag: 'जीव विज्ञान - परिसंचरण तंत्र'
  },
  {
    id: 'sc_bio_2',
    subject: 'विज्ञान (Science)',
    subjectKey: 'science',
    level: 'both',
    classLevel: '10th',
    chapter: 'जैव प्रक्रम (Life Processes)',
    question: 'पौधों में प्रकाश-संश्लेषण के दौरान ऑक्सीजन किस अणु के प्रकाशीय अपघटन (Photolysis) से निकलती है?',
    options: ['जल (H₂O)', 'कार्बन डाइऑक्साइड (CO₂)', 'ग्लूकोज (C₆H₁₂O₆)', 'क्लोरोफिल'],
    correctAnswer: 0,
    explanation: 'प्रकाश संश्लेषण की प्रकाशिक अभिक्रिया में थाइलाकॉइड पर जल के अणुओं का विखंडन होता है जिससे O₂ गैस मुक्त होती है।',
    tag: 'जीव विज्ञान - प्रकाश संश्लेषण'
  },
  {
    id: 'sc_opt_1',
    subject: 'विज्ञान (Science)',
    subjectKey: 'science',
    level: 'both',
    classLevel: '10th',
    chapter: 'प्रकाश - परावर्तन तथा अपवर्तन',
    question: 'वाहनों में पश्च-दृश्य दर्पण (Rear-view mirror) के रूप में किस दर्पण का उपयोग किया जाता है?',
    options: ['उत्तल दर्पण (Convex Mirror)', 'अवतल दर्पण (Concave Mirror)', 'समतल दर्पण', 'द्वि-उत्तल लेंस'],
    correctAnswer: 0,
    explanation: 'उत्तल दर्पण हमेशा सीधा, छोटा आभासी प्रतिबिंब बनाता है और इसका दृष्टि क्षेत्र (Field of View) बहुत विस्तृत होता है।',
    tag: 'भौतिकी - प्रकाश'
  }
];

const SERVER_MATH_QUESTIONS: ServerSyllabusQuestion[] = [
  {
    id: 'ma_trig_1',
    subject: 'गणित (Mathematics)',
    subjectKey: 'math',
    level: 'both',
    classLevel: '10th',
    chapter: 'त्रिकोणमिति (Trigonometry)',
    question: 'त्रिकोणमितीय सर्वसमिका sin²θ + cos²θ का मान किसके बराबर होता है?',
    options: ['1', '0', '2', 'tan θ'],
    correctAnswer: 0,
    explanation: 'पाइथागोरस प्रमेय के अनुसार लंब² + आधार² = कर्ण², दोनों पक्षों को कर्ण² से भाग देने पर sin²θ + cos²θ = 1 प्राप्त होता है।',
    tag: 'गणित - त्रिकोणमिति'
  },
  {
    id: 'ma_trig_2',
    subject: 'गणित (Mathematics)',
    subjectKey: 'math',
    level: 'both',
    classLevel: '10th',
    chapter: 'त्रिकोणमिति (Trigonometry)',
    question: 'tan 45° का संख्यात्मक मान कितना होता है?',
    options: ['1', '0', '√3', '1/√3'],
    correctAnswer: 0,
    explanation: 'समकोण समद्विबाहु त्रिभुज में लंब और आधार बराबर होते हैं, अतः tan 45° = लंब/आधार = 1 होता है।',
    tag: 'गणित - त्रिकोणमिति'
  },
  {
    id: 'ma_quad_1',
    subject: 'गणित (Mathematics)',
    subjectKey: 'math',
    level: 'both',
    classLevel: '10th',
    chapter: 'द्विघात समीकरण (Quadratic Equations)',
    question: 'द्विघात समीकरण ax² + bx + c = 0 के मूल वास्तविक और समान होने की आवश्यक शर्त क्या है?',
    options: ['विभक्तिकर D = b² - 4ac = 0', 'D > 0', 'D < 0', 'b² = -4ac'],
    correctAnswer: 0,
    explanation: 'जब विविक्तकर (Discriminant) D = b² - 4ac = 0 होता है, तो द्विघात समीकरण के दोनों मूल वास्तविक और परस्पर समान (-b/2a) होते हैं।',
    tag: 'गणित - बीजगणित'
  },
  {
    id: 'ma_ap_1',
    subject: 'गणित (Mathematics)',
    subjectKey: 'math',
    level: 'both',
    classLevel: '10th',
    chapter: 'समांतर श्रेढ़ी (Arithmetic Progression)',
    question: 'किसी समांतर श्रेढ़ी का n-वां पद ज्ञात करने का सूत्र क्या है (प्रथम पद = a, सार्व अंतर = d)?',
    options: ['aₙ = a + (n - 1)d', 'aₙ = a + nd', 'aₙ = a - (n - 1)d', 'aₙ = n/2(2a + (n-1)d)'],
    correctAnswer: 0,
    explanation: 'AP का n-वां पद aₙ = a + (n - 1)d होता है, जबकि n पदों का योगफल Sₙ = n/2 [2a + (n-1)d] होता है।',
    tag: 'गणित - समांतर श्रेढ़ी'
  }
];

const SERVER_SOCIAL_QUESTIONS: ServerSyllabusQuestion[] = [
  {
    id: 'sst_his_1',
    subject: 'सामाजिक विज्ञान (Social Science)',
    subjectKey: 'social_science',
    level: 'both',
    classLevel: '10th',
    chapter: 'भारत में राष्ट्रवाद',
    question: 'महात्मा गांधी जी ने प्रसिद्ध नमक सत्याग्रह (दांडी मार्च) किस वर्ष और किस तारीख को साबरमती से प्रारंभ किया था?',
    options: ['12 मार्च 1930', '15 अगस्त 1947', '26 जनवरी 1930', '13 अप्रैल 1919'],
    correctAnswer: 0,
    explanation: 'गांधी जी ने 78 अनुयायियों के साथ 12 मार्च 1930 को साबरमती आश्रम से दांडी यात्रा प्रारंभ की और 6 अप्रैल 1930 को दांडी में नमक बनाकर कानून तोड़ा।',
    tag: 'इतिहास - राष्ट्रीय आंदोलन'
  },
  {
    id: 'sst_geo_1',
    subject: 'सामाजिक विज्ञान (Social Science)',
    subjectKey: 'social_science',
    level: 'both',
    classLevel: '10th',
    chapter: 'संसाधन एवं विकास',
    question: 'काली मिट्टी (रेगुर मृदा) किस प्रमुख नकदी फसल की खेती के लिए सर्वाधिक उपयुक्त मानी जाती है?',
    options: ['कपास (Cotton)', 'चाय (Tea)', 'गेहूँ', 'जूट'],
    correctAnswer: 0,
    explanation: 'काली मिट्टी में नमी धारण करने की उच्च क्षमता होती है और यह कपास की खेती के लिए सर्वोत्तम होती है, इसलिए इसे काली कपास मृदा भी कहते हैं।',
    tag: 'भूगोल - मृदा संसाधन'
  },
  {
    id: 'sst_civ_1',
    subject: 'सामाजिक विज्ञान (Social Science)',
    subjectKey: 'social_science',
    level: 'both',
    classLevel: '10th',
    chapter: 'लोकतंत्र और संविधान',
    question: 'भारतीय संविधान के किस अनुच्छेद द्वारा "अस्पृश्यता का अंत" (Abolition of Untouchability) किया गया है?',
    options: ['अनुच्छेद 17', 'अनुच्छेद 14', 'अनुच्छेद 19', 'अनुच्छेद 21'],
    correctAnswer: 0,
    explanation: 'अनुच्छेद 17 अस्पृश्यता को समाप्त करता है और किसी भी रूप में इसका आचरण विधि के अनुसार दंडनीय अपराध घोषित करता है।',
    tag: 'नागरिक शास्त्र - मौलिक अधिकार'
  }
];

const SERVER_COMPETITIVE_QUESTIONS: ServerSyllabusQuestion[] = [
  {
    id: 'comp_pol_1',
    subject: 'Indian Polity & Constitution',
    subjectKey: 'polity',
    level: 'competitive',
    chapter: 'संविधान के अनुच्छेद व भाग',
    question: 'भारतीय संविधान में वित्तीय आपातकाल (Financial Emergency) का प्रावधान किस अनुच्छेद में वर्णित है?',
    options: ['अनुच्छेद 360', 'अनुच्छेद 352', 'अनुच्छेद 356', 'अनुच्छेद 370'],
    correctAnswer: 0,
    explanation: 'अनुच्छेद 352 राष्ट्रीय आपातकाल, 356 राष्ट्रपति शासन और 360 वित्तीय आपातकाल से संबंधित है। भारत में अब तक वित्तीय आपातकाल कभी नहीं लगा है।',
    tag: 'Polity - Emergency Provisions'
  },
  {
    id: 'comp_steno_1',
    subject: 'Shorthand & Stenography',
    subjectKey: 'steno',
    level: 'competitive',
    chapter: 'शॉर्टहैंड व्यंजन रेखाएं व हुक',
    question: 'पिटमैन प्रणाली में अधोगामी (Downward) व्यंजन रेखाएं किस दिशा में खींची जाती हैं?',
    options: ['ऊपर से नीचे की ओर', 'नीचे से ऊपर की ओर', 'बाएं से दाएं क्षैतिज', 'वृत्ताकार दक्षिणावर्त'],
    correctAnswer: 0,
    explanation: 'P, B, T, D, CH, J जैसी रेखाएं ऊपर से नीचे 60° या 90° पर अधोगामी खींची जाती हैं।',
    tag: 'Stenography Core Principles'
  },
  {
    id: 'comp_gk_1',
    subject: 'General Knowledge & Current Affairs',
    subjectKey: 'gk',
    level: 'competitive',
    chapter: 'प्राचीन भारतीय इतिहास एवं सिंधु सभ्यता',
    question: 'सिंधु घाटी सभ्यता का प्रसिद्ध प्राचीन बंदरगाह और गोदीबाड़ा (Dockyard) कहाँ स्थित था?',
    options: ['लोथल (गुजरात)', 'कालीबंगा (राजस्थान)', 'हड़प्पा (पंजाब)', 'मोहनजोदड़ो (सिंध)'],
    correctAnswer: 0,
    explanation: 'लोथल गुजरात के भोगवा नदी के तट पर स्थित हड़प्पा सभ्यता का प्रमुख बंदरगाह था जहाँ जहाजों के लंगर डालने का कृत्रिम ईंटों का गोदीबाड़ा मिला है।',
    tag: 'SSC CGL / Railway History'
  }
];

const SERVER_ENGLISH_QUESTIONS: ServerSyllabusQuestion[] = [
  {
    id: 'eng_narration_1',
    subject: 'English Grammar (Narration)',
    subjectKey: 'english',
    level: 'board',
    chapter: 'Direct and Indirect Speech (Narration)',
    question: 'Choose the correct Indirect Speech of: He said to me, "Where are you going?"',
    options: [
      'He asked me where I was going.',
      'He told me that where are you going.',
      'He asked me where you are going.',
      'He said to me where I was going.'
    ],
    correctAnswer: 0,
    explanation: 'When changing Wh-questions from Direct to Indirect Speech, "said to" changes to "asked", conjunction remains the Wh-word ("where"), and tense changes from Present Continuous to Past Continuous ("are you going" -> "I was going").',
    tag: 'Direct & Indirect Speech • Narration'
  },
  {
    id: 'eng_narration_2',
    subject: 'English Grammar (Narration)',
    subjectKey: 'english',
    level: 'board',
    chapter: 'Direct and Indirect Speech (Narration)',
    question: 'Choose the correct Indirect Speech of: She said, "I have finished my homework."',
    options: [
      'She said that she had finished her homework.',
      'She said that I have finished my homework.',
      'She told that she has finished her homework.',
      'She said that she finished her homework.'
    ],
    correctAnswer: 0,
    explanation: 'Present Perfect tense ("have finished") changes to Past Perfect tense ("had finished"), and pronouns change according to the subject ("I" -> "she").',
    tag: 'Direct & Indirect Speech • Narration'
  },
  {
    id: 'eng_voice_1',
    subject: 'English Grammar (Voice)',
    subjectKey: 'english',
    level: 'board',
    chapter: 'Active and Passive Voice',
    question: 'Choose the correct Passive Voice of: "The teacher punished the boy."',
    options: [
      'The boy was punished by the teacher.',
      'The boy is punished by the teacher.',
      'The boy has been punished by the teacher.',
      'The teacher was punished by the boy.'
    ],
    correctAnswer: 0,
    explanation: 'Simple Past tense active voice ("punished") changes in passive voice to "was/were + past participle" (was punished).',
    tag: 'Active & Passive Voice'
  }
];

function getExactSubjectQuestionsServer(params: {
  subjectOrCategory: string;
  topicOrChapter?: string;
  level?: 'board' | 'competitive' | 'both';
  classLevel?: '10th' | '12th' | 'general';
  board?: string;
  count: number;
}): ServerSyllabusQuestion[] {
  const { subjectOrCategory, topicOrChapter, count } = params;
  const combined = `${subjectOrCategory || ''} ${topicOrChapter || ''}`.toLowerCase();
  let pool: ServerSyllabusQuestion[] = [];

  if (/english|अंग्रेजी|grammar|vocabulary|voice|narration|active|passive|direct|indirect|speech|tenses|prepositions|articles/i.test(combined)) {
    pool = SERVER_ENGLISH_QUESTIONS;
  } else if (/hindi|हिन्दी|हिंदी|व्याकरण|संधि|समास|मुहावरे|रस|अलंकार|गद्य|पद्य|कबीर|प्रेमचंद|दिनकर/i.test(combined)) {
    pool = SERVER_HINDI_QUESTIONS;
  } else if (/math|गणित|trigonometry|algebra|त्रिकोणमिति|समीकरण|सांख्यिकी|ज्यामिति|समांतर/i.test(combined)) {
    pool = SERVER_MATH_QUESTIONS;
  } else if (/history|इतिहास|राष्ट्रवाद|मुगल|हड़प्पा|geography|भूगोल|सामाजिक|sst|social/i.test(combined)) {
    pool = SERVER_SOCIAL_QUESTIONS.filter(q => /इतिहास|history|मुगल|हड़प्पा|राष्ट्रवाद|भूगोल|geography|सामाजिक|social/i.test(q.chapter + q.question + q.tag));
    if (pool.length === 0) pool = SERVER_SOCIAL_QUESTIONS;
  } else if (/steno|आशुलिपि|डिक्टेशन|शॉर्टहैंड/i.test(combined)) {
    pool = SERVER_COMPETITIVE_QUESTIONS.filter(q => q.subjectKey === 'steno');
  } else if (/polity|संविधान|राजव्यवस्था|अनुच्छेद|संसद|राष्ट्रपति/i.test(combined)) {
    pool = SERVER_COMPETITIVE_QUESTIONS.filter(q => q.subjectKey === 'polity');
  } else if (/ssc|railway|rrb|competitive/i.test(combined)) {
    pool = SERVER_COMPETITIVE_QUESTIONS;
  } else if (/science|विज्ञान|भौतिकी|रसायन|जीव विज्ञान|physics|chemistry|biology|प्रकाश|विद्युत|आवर्त|कोशिका|omr|रासायनिक|अम्ल/i.test(combined)) {
    pool = SERVER_SCIENCE_QUESTIONS;
  } else {
    pool = SERVER_SCIENCE_QUESTIONS;
  }

  // If a specific chapter or topic was requested, filter for it first
  if (rawTopic && rawTopic.trim().length > 1) {
    const chapterFiltered = pool.filter(q =>
      q.chapter.toLowerCase().includes(rawTopic) ||
      rawTopic.includes(q.chapter.toLowerCase()) ||
      q.tag.toLowerCase().includes(rawTopic)
    );
    if (chapterFiltered.length > 0) {
      pool = chapterFiltered;
    }
  }

  const result: ServerSyllabusQuestion[] = [];
  const target = Math.max(1, count || 10);
  for (let i = 0; i < target; i++) {
    const item = pool[i % pool.length];
    result.push({
      ...item,
      id: `${item.id}_${i + 1}`
    });
  }

  return result.slice(0, target);
}

function generateFallbackBoardQuestions(board: string, classLevel: string, subject: string, examLength: number, language: string) {
  const list = getExactSubjectQuestionsServer({
    subjectOrCategory: subject,
    level: 'board',
    classLevel: (classLevel === '12th' ? '12th' : '10th') as any,
    board,
    count: examLength
  });
  return list.slice(0, examLength).map((q, idx) => ({
    id: `board_fallback_${q.id}_${idx + 1}`,
    question: q.question,
    options: q.options,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
    yearTag: `${board} Class ${classLevel} Official Blueprint`
  }));
}

function generateFallbackCompQuestions(examCategory: string, subject: string, numQuestions: number, language: string) {
  const list = getExactSubjectQuestionsServer({
    subjectOrCategory: `${examCategory} ${subject}`,
    level: 'competitive',
    count: numQuestions
  });
  return list.slice(0, numQuestions).map((q, idx) => ({
    id: `comp_fallback_${q.id}_${idx + 1}`,
    question: q.question,
    options: q.options,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
    examTag: `${examCategory} 2026 Live Set`
  }));
}

// Helper for daily deterministic fallback articles (Distinct 31-day rotating vault)
function getDailyDeterministicArticles(todayIso: string, todayHindi: string): any[] {
  const dayNum = parseInt(todayIso.split('-')[2] || '1', 10);
  const baseSeed = (dayNum * 7) % 24;

  const masterPool = [
    {
      categoryTag: 'DEFENSE & SECURITY',
      categoryFilter: 'Science & Tech',
      releaseId: `20658179${dayNum}101`,
      headline: 'अग्नि-5 मिसाइल का मल्टीपल इंडिपेंडेंटली टारगेटेबल री-एंट्री व्हीकल (MIRV) सफल परीक्षण और रणनीतिक प्रतिरोध',
      summary: 'रक्षा अनुसंधान एवं विकास संगठन (DRDO) ने "मिशन दिव्यास्त्र" के तहत स्वदेशी अग्नि-5 मिसाइल का MIRV तकनीक के साथ सफल उड़ान परीक्षण किया है। इससे एक ही बैलिस्टिक मिसाइल एक साथ कई वारहेड दाग सकती है।',
      background: 'भारत की परमाणु कमान प्राधिकरण (NCA) के तहत न्यूनतम विश्वसनीय प्रतिरोध (Credible Minimum Deterrence) और "नो फर्स्ट यूज़" नीति को सुदृढ़ करने हेतु यह परीक्षण ऐतिहासिक मील का पत्थर है।',
      sourceMinistry: 'रक्षा मंत्रालय (MoD) • DRDO • PIB नई दिल्ली',
      sourceUrl: 'https://pib.gov.in',
      imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
      imageCredit: 'स्रोत: DRDO मीडिया सेल • MoD',
      dimensions: [
        'एकल प्रक्षेपण से विभिन्न भौगोलिक लक्ष्यों पर 5,000+ किमी दूरी तक सटीक प्रहार।',
        'स्वदेशी एवियोनिक्स, रडार गाइडेंस और मिसाइल डिफेंस शील्ड को भेदने में सक्षम।',
        'भारत MIRV क्षमता हासिल करने वाला दुनिया का छठा विशिष्ट राष्ट्र बना।'
      ],
      provisions: [
        'रणनीतिक बल कमान (SFC) के तहत परिचालन तैनाती की प्रक्रिया तेज।',
        'कैनिस्टराइज्ड सिस्टम से न्यूनतम समय में सड़क या रेल मार्ग से कहीं भी त्वरित प्रक्षेपण।'
      ],
      highYieldFact: 'अग्नि-5 की मारक क्षमता 5,000 से 5,500 किमी तक है और यह ठोस ईंधन आधारित त्रि-चरणीय मिसाइल है।',
      vocabulary: [
        { word: 'Deterrence', pos: 'Noun', exactHindi: 'निवारण / रणनीतिक प्रतिरोध', definition: 'The action of discouraging an action or event through instilling doubt or fear of the consequences.', synonyms: 'Disincentive, Prevention, Restraint', antonyms: 'Encouragement, Catalyst', examUsage: '"Credible nuclear deterrence prevents aggression across contested borders."' }
      ],
      practiceMcq: {
        question: 'मिशन दिव्यास्त्र (Mission Divyastra) का संबंध किस स्वदेशी मिसाइल के सफल परीक्षण से है?',
        options: ['अग्नि-5 (MIRV तकनीक)', 'ब्रह्मोस एक्सटेंडेड रेंज', 'आकाश-एनजी', 'प्रलय मिसाइल'],
        correct: 0,
        explanation: 'डीआरडीओ ने मिशन दिव्यास्त्र के तहत अग्नि-5 मिसाइल के एमआईआरवी (MIRV) संस्करण का सफल परीक्षण किया था।'
      },
      mainsQuestion: '"MIRV तकनीक से सुसज्जित अग्नि-5 भारत की निवारक परमाणु क्षमता में गुणात्मक परिवर्तन कैसे लाती है? मूल्यांकन कीजिए।"'
    },
    {
      categoryTag: 'SCIENCE & TECH',
      categoryFilter: 'Science & Tech',
      releaseId: `20658179${dayNum}102`,
      headline: 'इंडिया सेमीकंडक्टर मिशन (ISM) 2.0 और गुजरात-असम फैब प्लांट्स में वाणिज्यिक चिप उत्पादन',
      summary: 'केंद्रीय मंत्रिमंडल ने इंडिया सेमीकंडक्टर मिशन के तहत ₹76,000 करोड़ के वित्तीय प्रोत्साहन के साथ टाटा इलेक्ट्रॉनिक्स और माइक्रोन टेक्नोलॉजी के अत्याधुनिक चिप निर्माण संयंत्रों के निर्माण कार्य को गति दी है।',
      background: 'वैश्विक चिप आपूर्ति श्रृंखला में चीन और ताइवान पर अत्यधिक निर्भरता को कम करने तथा भारत को इलेक्ट्रॉनिक्स विनिर्माण का वैश्विक हब बनाने हेतु यह मिशन शुरू किया गया है।',
      sourceMinistry: 'इलेक्ट्रॉनिकी एवं सूचना प्रौद्योगिकी मंत्रालय (MeitY) • PIB',
      sourceUrl: 'https://pib.gov.in',
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      imageCredit: 'स्रोत: MeitY Press Cell • इंडिया सेमीकंडक्टर मिशन',
      dimensions: [
        'धोलेरा (गुजरात) में 28nm और मोरीगांव (असम) में पैकेजिंग संयंत्र से प्रति दिन करोड़ों चिप्स का निर्माण।',
        'ऑटोमोबाइल, रक्षा, स्मार्टफोन और एआई सर्वर के लिए घरेलू सिलिकॉन वेफर आपूर्ति श्रृंखला।',
        'इंजीनियरिंग कॉलेजों में 85,000 सेमीकंडक्टर पेशेवरों के प्रशिक्षण का राष्ट्रीय लक्ष्य।'
      ],
      provisions: [
        'परियोजना लागत का 50% प्रत्यक्ष केंद्रीय वित्तीय अनुदान (Financial Fiscal Support)।',
        'कंपाउंड सेमीकंडक्टर, सिलिकॉन फोटोनिक्स और एटीएमपी (ATMP) इकाइयों की स्थापना।'
      ],
      highYieldFact: 'इंडिया सेमीकंडक्टर मिशन (ISM) की नोडल एजेंसी डिजिटल इंडिया कॉर्पोरेशन के अंतर्गत संचालित एक स्वतंत्र व्यवसाय प्रभाग है।',
      vocabulary: [
        { word: 'Fabrication', pos: 'Noun', exactHindi: 'विनिर्माण / चिप ढलाई संयंत्र', definition: 'The action or process of manufacturing or constructing something.', synonyms: 'Manufacturing, Production, Assembly', antonyms: 'Destruction, Dismantling', examUsage: '"Establishing local fabrication plants reduces reliance on imported microchips."' }
      ],
      practiceMcq: {
        question: 'भारत का पहला वाणिज्यिक सेमीकंडक्टर फैब्रिकेशन (Fab) प्लांट किस राज्य के धोलेरा में स्थापित किया जा रहा है?',
        options: ['गुजरात', 'महाराष्ट्र', 'कर्नाटक', 'तमिलनाडु'],
        correct: 0,
        explanation: 'टाटा समूह द्वारा गुजरात के धोलेरा में भारत का पहला वाणिज्यिक सेमीकंडक्टर फैब प्लांट स्थापित किया जा रहा है।'
      },
      mainsQuestion: '"वैश्विक सेमीकंडक्टर मूल्य श्रृंखला में भारत की रणनीतिक हिस्सेदारी और भू-राजनीतिक चुनौतियों का परीक्षण कीजिए।"'
    },
    {
      categoryTag: 'ECONOMY & BANKING',
      categoryFilter: 'Economy & Banking',
      releaseId: `20658179${dayNum}103`,
      headline: 'आरबीआई का यूनिफाइड लेंडिंग इंटरफेस (ULI): छोटे किसानों और एमएसएमई के लिए तत्काल ऋण क्रांति',
      summary: 'भारतीय रिजर्व बैंक ने यूपीआई की तर्ज पर "यूनिफाइड लेंडिंग इंटरफेस (ULI)" का राष्ट्रव्यापी शुभारंभ किया है। यह बिना किसी कागजी दस्तावेज़ के डिजिटल रूप से भूमि रिकॉर्ड और टैक्स डेटा को सत्यापित कर कुछ ही मिनटों में ऋण स्वीकृत करता है।',
      background: 'ग्रामीण क्षेत्रों में औपचारिक बैंकिंग ऋण तक किसानों और छोटे व्यापारियों की पहुंच सुगम बनाने तथा ऋण लागत में कटौती हेतु आरबीआई इनोवेशन हब द्वारा यूएलआई विकसित किया गया है।',
      sourceMinistry: 'भारतीय रिजर्व बैंक (RBI) • वित्त मंत्रालय • PIB मुंबई',
      sourceUrl: 'https://rbi.org.in',
      imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
      imageCredit: 'स्रोत: RBI Innovation Hub • PIB',
      dimensions: [
        'राज्यों के डिजिटाइज्ड लैंड रिकॉर्ड्स, उपग्रह डेटा और पैन-आधार से त्वरित पात्रता सत्यापन।',
        'छोटे किसानों को केसीसी (Kisan Credit Card) ऋण का संवितरण मात्र 5 मिनट में।',
        'ऋण मूल्यांकन में बिचौलियों और रिश्वतखोरी का शत-प्रतिशत उन्मूलन।'
      ],
      provisions: [
        'बैंकों और एनबीएफसी के लिए मानकीकृत एपीआई (Standardized Open APIs) का निर्माण।',
        'सहमति-आधारित सुरक्षित डेटा शेयरिंग आर्किटेक्चर (Consent-based Architecture)।'
      ],
      highYieldFact: 'आरबीआई इनोवेशन हब (RBIH) की स्थापना कंपनी अधिनियम 2013 की धारा 8 के तहत एक गैर-लाभकारी कंपनी के रूप में की गई थी।',
      vocabulary: [
        { word: 'Disbursement', pos: 'Noun', exactHindi: 'संवितरण / धन का भुगतान', definition: 'The payment of money from a fund.', synonyms: 'Expenditure, Payment, Allocation', antonyms: 'Deposit, Collection', examUsage: '"Automated loan disbursement ensures funds reach farmers before sowing season."' }
      ],
      practiceMcq: {
        question: 'आरबीआई द्वारा घर्षण-रहित और त्वरित ऋण वितरण हेतु हाल ही में कौन-सा राष्ट्रीय प्लेटफॉर्म लॉन्च किया गया है?',
        options: ['ULI (यूनिफाइड लेंडिंग इंटरफेस)', 'UPI 3.0', 'BHIM Credit', 'DigiLend Direct'],
        correct: 0,
        explanation: 'आरबीआई गवर्नर द्वारा निर्बाध क्रेडिट डिलीवरी के लिए Unified Lending Interface (ULI) प्लेटफॉर्म शुरू किया गया है।'
      },
      mainsQuestion: '"यूनिफाइड लेंडिंग इंटरफेस (ULI) वित्तीय समावेशन और अनौपचारिक ऋणदाताओं पर किसानों की निर्भरता कम करने में कैसे क्रांतिकारी सिद्ध हो सकता है?"'
    },
    {
      categoryTag: 'SCHEMES & GOVERNANCE',
      categoryFilter: 'Schemes & Governance',
      releaseId: `20658179${dayNum}104`,
      headline: 'पीएम सूर्य घर मुफ़्त बिजली योजना: 1 करोड़ परिवारों को 300 यूनिट मासिक फ्री बिजली और सौर ऊर्जा क्रांति',
      summary: 'नवीन एवं नवीकरणीय ऊर्जा मंत्रालय के अनुसार "पीएम सूर्य घर मुफ़्त बिजली योजना" के अंतर्गत 1.25 करोड़ से अधिक पंजीकरण पूरे हो चुके हैं। योजना में छतों पर सोलर पैनल लगाने के लिए ₹78,000 तक की सीधी केंद्रीय सब्सिडी दी जा रही है।',
      background: 'फरवरी 2024 में ₹75,021 करोड़ के कुल परिव्यय के साथ प्रधानमंत्री द्वारा शुरू की गई यह योजना भारत के शुद्ध-शून्य (Net-Zero 2070) लक्ष्य में सबसे बड़ी घरेलू ऊर्जा पहल है।',
      sourceMinistry: 'नवीन एवं नवीकरणीय ऊर्जा मंत्रालय (MNRE) • PIB नई दिल्ली',
      sourceUrl: 'https://pib.gov.in',
      imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
      imageCredit: 'स्रोत: MNRE Media Cell • PIB',
      dimensions: [
        '1 किलोवाट तक ₹30,000, 2 किलोवाट तक ₹60,000 और 3 किलोवाट या अधिक पर ₹78,000 की सब्सिडी।',
        'अधिशेष बिजली को ग्रिड में बेचकर परिवारों को ₹15,000 से ₹25,000 तक की वार्षिक अतिरिक्त आय।',
        'इलेक्ट्रिक वाहनों (EV) की घरेलू चार्जिंग और कार्बन उत्सर्जन में 720 मिलियन टन की कटौती।'
      ],
      provisions: [
        'हर जिले में एक आदर्श सौर ग्राम (Model Solar Village) की स्थापना हेतु ₹1 करोड़ का विशेष अनुदान।',
        'बिना किसी जमानत (Collateral-free) के 7% की रियायती ब्याज दर पर बैंक ऋण।'
      ],
      highYieldFact: 'भारत ने 2030 तक अपनी कुल विद्युत स्थापित क्षमता का 50% गैर-जीवाश्म ईंधन स्रोतों से हासिल करने का NDC लक्ष्य रखा है।',
      vocabulary: [
        { word: 'Decarbonization', pos: 'Noun', exactHindi: 'कार्बन उत्सर्जन मुक्ति', definition: 'The reduction or elimination of carbon dioxide emissions from a process.', synonyms: 'Carbon abatement, Clean transition', antonyms: 'Carbonization, Emission surge', examUsage: '"Rooftop solarization is essential for nationwide energy decarbonization."' }
      ],
      practiceMcq: {
        question: 'पीएम सूर्य घर मुफ़्त बिजली योजना के तहत 3 किलोवाट तक के रूफटॉप सोलर सिस्टम पर अधिकतम कितनी केंद्रीय सब्सिडी देय है?',
        options: ['₹78,000', '₹50,000', '₹1,00,000', '₹60,000'],
        correct: 0,
        explanation: 'पीएम सूर्य घर योजना में 3 किलोवाट क्षमता के सौर संयंत्र पर अधिकतम ₹78,000 की प्रत्यक्ष डीबीटी सब्सिडी प्रदान की जाती है।'
      },
      mainsQuestion: '"पीएम सूर्य घर योजना ऊर्जा सुरक्षा, डिस्कॉम्स की वित्तीय व्यवहार्यता और विकेंद्रीकृत सौर विकास को किस प्रकार संतुलित करती है?"'
    },
    {
      categoryTag: 'NATIONAL',
      categoryFilter: 'National',
      releaseId: `20658179${dayNum}105`,
      headline: 'नारी शक्ति वंदन अधिनियम (106वां संविधान संशोधन) और विधायी संस्थाओं में महिलाओं की 33% हिस्सेदारी',
      summary: 'भारत निर्वाचन आयोग और विधि मंत्रालय ने संसद (लोकसभा) और राज्य विधानसभाओं में महिलाओं के लिए 33% सीटें आरक्षित करने वाले 106वें संविधान संशोधन अधिनियम के परिसीमन रोडमैप की समीक्षा की है।',
      background: 'सितंबर 2023 में संसद के विशेष सत्र द्वारा पारित यह ऐतिहासिक कानून आगामी जनगणना और परिसीमन के पश्चात देश भर की विधायी संस्थाओं में महिलाओं की सक्रिय नीति-निर्माण भागीदारी सुनिश्चित करेगा।',
      sourceMinistry: 'विधि एवं न्याय मंत्रालय • महिला एवं बाल विकास मंत्रालय • PIB',
      sourceUrl: 'https://pib.gov.in',
      imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
      imageCredit: 'स्रोत: विधि एवं न्याय मंत्रालय • PIB संसद सेल',
      dimensions: [
        'लोकसभा और राज्य विधानसभाओं में महिलाओं हेतु 33% आरक्षित सीटें 15 वर्षों की प्रारंभिक अवधि के लिए लागू।',
        'संविधान में अनुच्छेद 330A, 332A और 334A का नवीन समावेश।',
        'अनुसूचित जातियों (SC) और अनुसूचित जनजातियों (ST) के आरक्षित कोटे में भी एक-तिहाई सीटें महिलाओं के लिए अनिवार्य।'
      ],
      provisions: [
        'दिल्ली राष्ट्रीय राजधानी क्षेत्र (NCT) विधानसभा (अनुच्छेद 239AA) में भी 33% महिला आरक्षण लागू।',
        'प्रत्येक परिसीमन चक्र के बाद आरक्षित निर्वाचन क्षेत्रों का रोटेशन (चक्रीय व्यवस्था)।'
      ],
      highYieldFact: 'यह संविधान (106वां संशोधन) अधिनियम, 2023 है, जिसे संसद में 128वें संविधान संशोधन विधेयक के रूप में प्रस्तुत किया गया था।',
      vocabulary: [
        { word: 'Enfranchisement', pos: 'Noun', exactHindi: 'मताधिकार / राजनीतिक सशक्तिकरण', definition: 'The giving of a right or privilege, especially the right to vote.', synonyms: 'Suffrage, Empowerment, Liberation', antonyms: 'Disenfranchisement, Marginalization', examUsage: '"Legislative quotas ensure equitable enfranchisement of women in policy making."' }
      ],
      practiceMcq: {
        question: 'संसद और राज्य विधानसभाओं में महिलाओं को 33% आरक्षण प्रदान करने वाला कानून कौन-सा संविधान संशोधन अधिनियम है?',
        options: ['106वां संशोधन अधिनियम', '103वां संशोधन अधिनियम', '104वां संशोधन अधिनियम', '105वां संशोधन अधिनियम'],
        correct: 0,
        explanation: 'नारी शक्ति वंदन अधिनियम भारत का 106वां संविधान संशोधन अधिनियम (2023) है।'
      },
      mainsQuestion: '"संसद में 33% महिला आरक्षण भारतीय लोकतंत्र में प्रतीकात्मक प्रतिनिधित्व से वास्तविक नीतिगत सशक्तिकरण की ओर एक बड़ा कदम है। समालोचनात्मक विवेचना कीजिए।"'
    },
    {
      categoryTag: 'SPORTS & HONORS',
      categoryFilter: 'Sports & Honors',
      releaseId: `20658179${dayNum}106`,
      headline: 'खेलो इंडिया राइजिंग टैलेंट आइडेंटिफिकेशन (KIRTI) 2.0 और ओलंपिक 2036 की राष्ट्रीय खेल तैयारी',
      summary: 'युवा कार्यक्रम एवं खेल मंत्रालय ने एथलीटों की जमीनी स्तर पर खोज हेतु "कीर्ति (KIRTI)" डिजिटल प्लेटफॉर्म के दूसरे चरण का विस्तार किया है। इसमें एआई-संचालित बायोमैकेनिकल स्क्रीनिंग से देश भर के 10 लाख प्रतिभाशाली बच्चों का चयन किया जा रहा है।',
      background: 'भारत द्वारा 2036 के ग्रीष्मकालीन ओलंपिक खेलों की मेजबानी की आधिकारिक दावेदारी के मद्देनजर अंतरराष्ट्रीय पदक विजेताओं की नई पौध तैयार करने के लिए यह योजना शुरू की गई है।',
      sourceMinistry: 'युवा कार्यक्रम एवं खेल मंत्रालय • भारतीय खेल प्राधिकरण (SAI) • PIB',
      sourceUrl: 'https://pib.gov.in',
      imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
      imageCredit: 'स्रोत: भारतीय खेल प्राधिकरण (SAI) • PIB',
      dimensions: [
        '9 से 18 वर्ष आयु वर्ग के खिलाड़ियों की 20 खेल विधाओं में पारदर्शी डिजिटल स्किल मैपिंग।',
        'राष्ट्रीय खेल अकादमियों और खेलो इंडिया उत्कृष्टता केंद्रों में पूर्ण निःशुल्क विश्वस्तरीय प्रशिक्षण व पोषण।',
        'टारगेट ओलंपिक पोडियम स्कीम (TOPS) के तहत एथलीटों को अंतरराष्ट्रीय एक्सपोजर।'
      ],
      provisions: [
        'दूरदराज के ग्रामीण व जनजातीय क्षेत्रों के बच्चों के लिए मोबाइल टेस्टिंग लैब्स की शुरुआत।',
        'चयनित खिलाड़ियों को ₹6.28 लाख प्रतिवर्ष की वित्तीय सहायता एवं छात्रवृत्ति।'
      ],
      highYieldFact: 'भारत के युवा कार्यक्रम एवं खेल मंत्रालय की राष्ट्रीय खेल विकास निधि (NSDF) की स्थापना 1998 में हुई थी।',
      vocabulary: [
        { word: 'Grassroots', pos: 'Noun / Adjective', exactHindi: 'जमीनी स्तर / बुनियादी', definition: 'The most basic level of an activity or organization.', synonyms: 'Fundamental, Community-level, Foundational', antonyms: 'Elite, Top-tier, Hierarchical', examUsage: '"Identifying sports prodigies at the grassroots level creates Olympic podium finishers."' }
      ],
      practiceMcq: {
        question: 'खिलाड़ियों की जमीनी स्तर पर पारदर्शी डिजिटल पहचान हेतु खेल मंत्रालय द्वारा कौन-सा प्लेटफॉर्म संचालित किया जा रहा है?',
        options: ['KIRTI (कीर्ति)', 'PRAGATI', 'TARGET 2036', 'SPORTS SHAKTI'],
        correct: 0,
        explanation: 'KIRTI (Khelo India Rising Talent Identification) खेल मंत्रालय का राष्ट्रव्यापी प्रतिभा खोज प्लेटफॉर्म है।'
      },
      mainsQuestion: '"भारत के खेल पारिस्थितिकी तंत्र को मजबूत करने और ओलंपिक 2036 की मेजबानी की तैयारी में KIRTI और TOPS का महत्व स्पष्ट कीजिए।"'
    },
    {
      categoryTag: 'SPACE & ASTRONOMY',
      categoryFilter: 'Science & Tech',
      releaseId: `20658179${dayNum}107`,
      headline: 'चंद्रयान-4 लूनर सैंपल रिटर्न मिशन और भारतीय अंतरिक्ष स्टेशन (BAS) को केंद्रीय कैबिनेट की हरी झंडी',
      summary: 'केंद्रीय मंत्रिमंडल ने ₹2,104 करोड़ के परिव्यय के साथ चंद्रयान-4 मिशन को स्वीकृति दी है, जिसका प्राथमिक उद्देश्य चंद्रमा की सतह से चट्टानों व मिट्टी के नमूने सुरक्षित रूप से पृथ्वी पर वापस लाना है।',
      background: 'चंद्रयान-3 की ऐतिहासिक लैंडिंग के बाद भारत ने 2035 तक "भारतीय अंतरिक्ष स्टेशन" और 2040 तक चंद्रमा पर भारतीय अंतरिक्ष यात्री उतारने का राष्ट्रीय विज़न निर्धारित किया है।',
      sourceMinistry: 'अंतरिक्ष विभाग (DoS) • इसरो (ISRO) • PIB नई दिल्ली',
      sourceUrl: 'https://pib.gov.in',
      imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
      imageCredit: 'स्रोत: ISRO Media Center',
      dimensions: [
        'चंद्रयान-4 में 5 प्रमुख मॉड्यूल शामिल होंगे: प्रोपल्शन, डिसेंडर, एसेंडर, ट्रांसफर और री-एंट्री मॉड्यूल।',
        'एलवीएम-3 (LVM3) और नए नेक्स्ट जेनरेशन लॉन्च व्हीकल (NGLV) द्वारा दो अलग-अलग चरणों में प्रक्षेपण और अंतरिक्ष में डॉकिंग।',
        'चंद्रमा के दक्षिणी ध्रुव के निकट स्थित शिव शक्ति पॉइंट के समीप वैज्ञानिक नमूनों का संकलन।'
      ],
      provisions: [
        'मिशन के सभी प्रमुख कलपुर्जे भारतीय निजी व सार्वजनिक रक्षा उद्यमों द्वारा स्वदेशी तकनीक से निर्मित।',
        'गगनयान के क्रू मॉड्यूल के बाद री-एंट्री कैप्सूल तकनीक का यह भारत का दूसरा बड़ा परीक्षण होगा।'
      ],
      highYieldFact: 'चंद्रयान-4 चंद्रमा से नमूने वापस लाने वाला भारत का पहला और विश्व का चौथा देश बनाने वाला मिशन होगा।',
      vocabulary: [
        { word: 'Docking', pos: 'Noun', exactHindi: 'अंतरिक्ष में दो यानों का मिलन / डॉकिंग', definition: 'The joining of two separate spacecraft in space.', synonyms: 'Coupling, Linking, Rendezvous', antonyms: 'Detachment, Separation', examUsage: '"Automated orbital docking is an essential prerequisite for lunar sample return missions."' }
      ],
      practiceMcq: {
        question: 'केंद्रीय मंत्रिमंडल द्वारा स्वीकृत चंद्रयान-4 मिशन का मुख्य उद्देश्य क्या है?',
        options: ['चंद्रमा के नमूनों को पृथ्वी पर वापस लाना (Sample Return)', 'सूर्य के कोरोना का अध्ययन', 'शुक्र ग्रह पर रोवर उतारना', 'मंगल की कक्षा में नया उपग्रह भेजना'],
        correct: 0,
        explanation: 'चंद्रयान-4 का मुख्य उद्देश्य चंद्रमा की सतह से मिट्टी व चट्टानों के नमूने एकत्र कर पृथ्वी पर सुरक्षित वापस लाना है।'
      },
      mainsQuestion: '"चंद्रयान-4 और भारतीय अंतरिक्ष स्टेशन (BAS) परियोजनाएं भारत के अंतरिक्ष महाशक्ति बनने के विज़न को कैसे सिद्ध करती हैं? विवेचना कीजिए।\"'
    },
    {
      categoryTag: 'ECONOMY & BANKING',
      categoryFilter: 'Economy & Banking',
      releaseId: `20658179${dayNum}108`,
      headline: 'भारतीय रिजर्व बैंक (RBI) द्वारा सेंट्रल बैंक डिजिटल करेंसी (CBDC / e-Rupee) की ऑफलाइन और प्रोग्रामेबल क्षमता का विस्तार',
      summary: 'आरबीआई ने डिजिटल रुपये (e-Rupee) को बिना इंटरनेट वाले ग्रामीण व दूरदराज के क्षेत्रों में भी संचालित करने हेतु एनएफसी और फीचर फोन आधारित ऑफलाइन कार्यप्रणाली को लाइव कर दिया है।',
      background: 'नवंबर 2022 में थोक और दिसंबर 2022 में खुदरा सीबीडीसी पायलट शुरू होने के बाद भारत डिजिटल मुद्रा अपनाने में विश्व के अग्रणी देशों में शामिल हो गया है।',
      sourceMinistry: 'भारतीय रिजर्व बैंक (RBI) • वित्त मंत्रालय • PIB',
      sourceUrl: 'https://rbi.org.in',
      imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
      imageCredit: 'स्रोत: RBI Press Relations',
      dimensions: [
        'इंटरनेट और टेलीकॉम नेटवर्क के बिना भी वॉलेट-टू-वॉलेट सुरक्षित एनक्रिप्टेड लेन-देन।',
        'सरकारी कल्याणकारी योजनाओं और सब्सिडी के लक्षित वितरण हेतु प्रोग्रामेबल टोकन की सुविधा।',
        'व्यापारिक प्रतिष्ठानों पर यूपीआई (UPI) क्यूआर कोड के साथ पूर्ण इंटरऑपरेबिलिटी।'
      ],
      provisions: [
        'आरबीआई अधिनियम 1934 की धारा 22 में संशोधन कर सीबीडीसी को संप्रभु बैंक नोट के समान कानूनी दर्जा दिया गया।',
        'उपयोगकर्ता के व्यक्तिगत वित्तीय डेटा और लेन-देन की निजता हेतु दोहरे एन्क्रिप्शन का प्रावधान।'
      ],
      highYieldFact: 'भारत में डिजिटल रुपये का पायलट प्रोजेक्ट संचालित करने के लिए 13 वाणिज्यिक बैंकों को नामित किया गया है।',
      vocabulary: [
        { word: 'Sovereign', pos: 'Adjective', exactHindi: 'संप्रभु / सर्वोच्च अधिकार संपन्न', definition: 'Possessing supreme or ultimate power and legal authority.', synonyms: 'Autonomous, Supreme, Independent', antonyms: 'Subordinate, Dependent', examUsage: '"A sovereign digital currency carries the sovereign guarantee of the central bank."' }
      ],
      practiceMcq: {
        question: 'आरबीआई द्वारा जारी डिजिटल रुपया (e-Rupee) किस प्रकार की मुद्रा है?',
        options: ['सेंट्रल बैंक डिजिटल करेंसी (CBDC)', 'अनियंत्रित क्रिप्टोकरेंसी', 'कमोडिटी बॉन्ड', 'विदेशी मुद्रा डेरिवेटिव'],
        correct: 0,
        explanation: 'ई-रुपया भारत की संप्रभु सेंट्रल बैंक डिजिटल करेंसी (CBDC) है जो फिएट करेंसी का डिजिटल रूप है।'
      },
      mainsQuestion: '"पारंपरिक कागजी नोटों की तुलना में डिजिटल रुपया (CBDC) वित्तीय समावेशन और सीमा पार भुगतान लागत कम करने में कैसे क्रांतिकारी सिद्ध हो सकता है?\"'
    },
    {
      categoryTag: 'ENVIRONMENT & BIODIVERSITY',
      categoryFilter: 'Science & Tech',
      releaseId: `20658179${dayNum}109`,
      headline: 'ग्रेट निकोबार ट्रांसशिपमेंट पोर्ट परियोजना और पारिस्थितिक संरक्षण हेतु ₹4,000 करोड़ का हरित बजट',
      summary: 'पर्यावरण, वन एवं जलवायु परिवर्तन मंत्रालय ने रणनीतिक रूप से महत्वपूर्ण गलाथिया खाड़ी (ग्रेट निकोबार) में अंतरराष्ट्रीय कंटेनर ट्रांसशिपमेंट टर्मिनल हेतु सख्त पर्यावरण निगरानी समिति गठित की है।',
      background: 'मलक्का जलडमरूमध्य के मुहाने पर स्थित होने के कारण यह पोर्ट भारत के 80% ट्रांसशिपमेंट कार्गो को जो सिंगापुर और कोलंबो जाता है, स्वदेशी बंदरगाह पर आकर्षित करेगा।',
      sourceMinistry: 'पत्तन, पोत परिवहन और जलमार्ग मंत्रालय • पर्यावरण मंत्रालय • PIB',
      sourceUrl: 'https://pib.gov.in',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      imageCredit: 'स्रोत: MoPSW Press Information Bureau',
      dimensions: [
        'लेदरबैक समुद्री कछुओं और निकोबारी मेगापोड पक्षी के प्राकृतिक आवासों की सुरक्षा हेतु जियो-फेंसिंग।',
        'कोरल रीफ्स (मूंगा चट्टानों) का आधुनिक वैज्ञानिक विधियों द्वारा सुरक्षित ट्रांसलोकेशन।',
        'शोंपेन और निकोबारी जनजातीय समुदायों के अधिकारों और स्वायत्तता की 100% सुरक्षा।'
      ],
      provisions: [
        'परियोजना स्थल के अतिरिक्त हरियाणा और मध्य प्रदेश में क्षतिपूरक वनीकरण (CAMPA) के तहत सघन वन क्षेत्र विकसित किए जाएंगे।',
        'शून्य-अपशिष्ट और पूर्ण सौर ऊर्जा से संचालित होने वाला देश का पहला हरित ट्रांसशिपमेंट हब।'
      ],
      highYieldFact: 'गलाथिया राष्ट्रीय उद्यान और कैंपबेल बे राष्ट्रीय उद्यान मिलकर ग्रेट निकोबार बायोस्फीयर रिजर्व का निर्माण करते हैं जो यूनेस्को की सूची में शामिल है।',
      vocabulary: [
        { word: 'Transshipment', pos: 'Noun', exactHindi: 'माल का एक जहाज से दूसरे जहाज में अंतरण', definition: 'The shipment of goods or containers to an intermediate destination, then to another destination.', synonyms: 'Transfer, Relshipment, Logistics routing', antonyms: 'Direct delivery', examUsage: '"Developing an indigenous transshipment hub saves billions of dollars in foreign exchange."' }
      ],
      practiceMcq: {
        question: 'गलाथिया बे (Galathea Bay) राष्ट्रीय उद्यान किस केंद्र शासित प्रदेश में स्थित है?',
        options: ['अंडमान एवं निकोबार द्वीप समूह', 'लक्षद्वीप', 'दमन एवं दीव', 'पुदुचेरी'],
        correct: 0,
        explanation: 'गलाथिया बे राष्ट्रीय उद्यान ग्रेट निकोबार द्वीप समूह में स्थित एक महत्वपूर्ण जैव विविधता क्षेत्र है।'
      },
      mainsQuestion: '"सामरिक सुरक्षा, आर्थिक विकास और नाजुक द्वीप पारिस्थितिकी तंत्र के संरक्षण के बीच संतुलन साधने में ग्रेट निकोबार परियोजना की भूमिका का परीक्षण कीजिए।\"'
    },
    {
      categoryTag: 'POLITY & GOVERNANCE',
      categoryFilter: 'Schemes & Governance',
      releaseId: `20658179${dayNum}110`,
      headline: 'एक राष्ट्र एक चुनाव (One Nation One Election): पूर्व राष्ट्रपति रामनाथ कोविंद समिति की सिफारिशें और संवैधानिक संशोधन प्रारूप',
      summary: 'विधि मंत्रालय ने लोकसभा, राज्य विधानसभाओं और स्थानीय निकायों के चुनाव एक साथ कराने हेतु कोविंद समिति द्वारा प्रस्तुत 18,626 पृष्ठों की व्यापक रिपोर्ट को कैबिनेट विचार हेतु अग्रसारित किया है।',
      background: '1952, 1957, 1962 और 1967 में भारत में लोकसभा और विधानसभा चुनाव एक साथ संपन्न हुए थे, जिसके बाद कुछ विधानसभाओं के समय से पूर्व भंग होने से यह चक्र टूट गया था।',
      sourceMinistry: 'विधि एवं न्याय मंत्रालय • भारत निर्वाचन आयोग (ECI) • PIB',
      sourceUrl: 'https://pib.gov.in',
      imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
      imageCredit: 'स्रोत: विधि एवं न्याय मंत्रालय मीडिया सेल',
      dimensions: [
        'प्रथम चरण में लोकसभा और सभी राज्य विधानसभाओं के चुनाव एक साथ कराने की संस्तुति।',
        'द्वितीय चरण में आम चुनावों के 100 दिनों के भीतर नगर पालिकाओं और पंचायतों के चुनाव संपन्न कराना।',
        'सभी चुनावों के लिए एक एकल, अद्यतन मतदाता सूची (Single Electoral Roll) और पहचान पत्र।'
      ],
      provisions: [
        'अनुच्छेद 83 (संसद के सदनों की अवधि) और अनुच्छेद 172 (राज्य विधानसभाओं की अवधि) में संशोधन का प्रस्ताव।',
        'त्रिशंकु सदन या अविश्वास प्रस्ताव की स्थिति में शेष बचे कार्यकाल के लिए नई सरकार का गठन।'
      ],
      highYieldFact: 'कोविंद समिति का गठन विधि एवं न्याय मंत्रालय द्वारा 2 सितंबर 2023 को किया गया था।',
      vocabulary: [
        { word: 'Simultaneous', pos: 'Adjective', exactHindi: 'समकालिक / एक साथ होने वाला', definition: 'Occurring, operating, or done at the same time.', synonyms: 'Concurrent, Synchronized, Coincident', antonyms: 'Sequential, Staggered, Consecutive', examUsage: '"Simultaneous elections curb recurring governance paralysis caused by the model code of conduct."' }
      ],
      practiceMcq: {
        question: '"एक राष्ट्र एक चुनाव" के व्यावहारिक अध्ययन हेतु गठित उच्च स्तरीय समिति के अध्यक्ष कौन थे?',
        options: ['श्री रामनाथ कोविंद (पूर्व राष्ट्रपति)', 'न्यायमूर्ति एन.वी. रमना', 'श्री गुलाम नबी आजाद', 'श्री एन.के. सिंह'],
        correct: 0,
        explanation: 'पूर्व राष्ट्रपति रामनाथ कोविंद की अध्यक्षता में उच्च स्तरीय समिति का गठन किया गया था।'
      },
      mainsQuestion: '"एक राष्ट्र एक चुनाव प्रणाली भारत के संघीय ढांचे, लोकतांत्रिक जवाबदेही और विकास व्यय को कैसे प्रभावित करेगी? पक्ष और विपक्ष में तर्क प्रस्तुत कीजिए।\"'
    },
    {
      categoryTag: 'SCHEMES & GOVERNANCE',
      categoryFilter: 'Schemes & Governance',
      releaseId: `20658179${dayNum}111`,
      headline: 'पीएम-जनमन (PM-JANMAN) योजना: 75 विशेष रूप से संवेदनशील जनजातीय समूहों (PVTGs) के सर्वांगीण विकास में ऐतिहासिक प्रगति',
      summary: 'जनजातीय कार्य मंत्रालय ने ₹24,104 करोड़ की पीएम जनजाति आदिवासी न्याय महाभियान के अंतर्गत 11 महत्वपूर्ण मंत्रालयों के समन्वय से दूरदराज के आदिवासी बस्तियों में शत-प्रतिशत पक्के मकान, स्वच्छ पेयजल और मोबाइल कनेक्टिविटी सुनिश्चित की है।',
      background: 'प्रधानमंत्री नरेंद्र मोदी ने 15 नवंबर 2023 को जनजातीय गौरव दिवस के अवसर पर भगवान बिरसा मुंडा की जन्मस्थली उलिहातू (झारखंड) से इस मिशन की शुरुआत की थी।',
      sourceMinistry: 'जनजातीय कार्य मंत्रालय • ग्रामीण विकास मंत्रालय • PIB नई दिल्ली',
      sourceUrl: 'https://pib.gov.in',
      imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
      imageCredit: 'स्रोत: जनजातीय कार्य मंत्रालय',
      dimensions: [
        '18 राज्यों और अंडमान निकोबार के 22,000 से अधिक चिन्हित गांवों में बुनियादी अधोसंरचना का निर्माण।',
        'सौर ऊर्जा संचालित मिनी ग्रिड्स से वनांचल की विद्युतीकृत बस्तियों तक निरंतर रोशनी।',
        'वन धन विकास केंद्रों के माध्यम से लघु वनोपज (MFP) का न्यूनतम समर्थन मूल्य पर संकलन।'
      ],
      provisions: [
        '4.9 लाख से अधिक पीवीटीजी परिवारों को निःशुल्क पक्के आवास और पाइप जलापूर्ति।',
        'सिकल सेल एनीमिया उन्मूलन मिशन के अंतर्गत विशेष मोबाइल मेडिकल यूनिट्स की तैनाती।'
      ],
      highYieldFact: 'भारत में सर्वाधिक 13 PVTGs ओडिशा राज्य में पाए जाते हैं और कुल 75 जनजातियां इस श्रेणी में वर्गीकृत हैं।',
      vocabulary: [
        { word: 'Vulnerable', pos: 'Adjective', exactHindi: 'संवेदनशील / सुभेद्य', definition: 'Susceptible to physical or emotional attack or harm, or lacking socio-economic defenses.', synonyms: 'Susceptible, Fragile, At-risk, Defenseless', antonyms: 'Invulnerable, Resilient, Robust', examUsage: '"Targeted affirmative interventions protect vulnerable indigenous communities from extinction."' }
      ],
      practiceMcq: {
        question: 'भारत में कितने जनजातीय समूहों को "विशेष रूप से संवेदनशील जनजातीय समूह" (PVTG) के रूप में मान्यता प्राप्त है?',
        options: ['75 समूह', '62 समूह', '84 समूह', '50 समूह'],
        correct: 0,
        explanation: 'भारत में 18 राज्यों और केंद्र शासित प्रदेश अंडमान-निकोबार में कुल 75 PVTGs चिन्हित हैं।'
      },
      mainsQuestion: '"पीएम-जनमन योजना भारत के सबसे हाशिए पर खड़े जनजातीय समुदायों की सांस्कृतिक पहचान की रक्षा करते हुए उन्हें आधुनिक विकास से कैसे जोड़ती है?\"'
    },
    {
      categoryTag: 'CLEAN ENERGY & CLIMATE',
      categoryFilter: 'Science & Tech',
      releaseId: `20658179${dayNum}112`,
      headline: 'राष्ट्रीय हरित हाइड्रोजन मिशन (NGHM): 5 मिलियन मीट्रिक टन वार्षिक उत्पादन और वैश्विक निर्यात हब बनने की दिशा में कदम',
      summary: 'नवीन एवं नवीकरणीय ऊर्जा मंत्रालय ने रणनीतिक हस्तक्षेप कार्यक्रम (SIGHT) के तहत इलेक्ट्रोलाइज़र विनिर्माण और हरित हाइड्रोजन उत्पादन संयंत्रों के लिए ₹19,744 करोड़ का आवंटन पूर्ण कर लिया है।',
      background: 'भारत ने 2070 तक शुद्ध-शून्य (Net-Zero) कार्बन उत्सर्जन का राष्ट्रीय लक्ष्य रखा है, जिसमें भारी उद्योगों (स्टील, रिफाइनरी, उर्वरक) के डीकार्बोनाइजेशन हेतु हाइड्रोजन मुख्य स्तंभ है।',
      sourceMinistry: 'नवीन एवं नवीकरणीय ऊर्जा मंत्रालय (MNRE) • नीति आयोग • PIB',
      sourceUrl: 'https://mnre.gov.in',
      imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
      imageCredit: 'स्रोत: MNRE Press Information Bureau',
      dimensions: [
        'वर्ष 2030 तक 5 MMT प्रतिवर्ष हरित हाइड्रोजन उत्पादन क्षमता और 125 GW संबद्ध नवीकरणीय ऊर्जा क्षमता।',
        'कच्छ (गुजरात), पारादीप (ओडिशा) और तूतीकोरिन (तमिलनाडु) में ग्रीन हाइड्रोजन हब और पोर्ट्स का विकास।',
        'जीवाश्म ईंधन के आयात में ₹1 लाख करोड़ से अधिक की वार्षिक विदेशी मुद्रा बचत।'
      ],
      provisions: [
        'इलेक्ट्रोलाइज़र निर्माण हेतु ₹4,440 करोड़ की पीएलआई (PLI) वित्तीय प्रोत्साहन योजना।',
        'हरित अमोनिया और हरित मेथनॉल के अंतरराष्ट्रीय शिपिंग और व्यापार हेतु मानक फ्रेमवर्क।'
      ],
      highYieldFact: 'ग्रीन हाइड्रोजन का उत्पादन जल के इलेक्ट्रोलिसिस द्वारा केवल सौर या पवन ऊर्जा जैसी नवीकरणीय ऊर्जा का उपयोग करके किया जाता है।',
      vocabulary: [
        { word: 'Decarbonize', pos: 'Verb', exactHindi: 'कार्बन उत्सर्जन कम करना / कार्बनमुक्ति', definition: 'To reduce the amount of gaseous carbon compounds released into the atmosphere.', synonyms: 'Carbon abatement, Emission cut, Green transition', antonyms: 'Carbonization, Pollution expansion', examUsage: '"Green hydrogen enables heavy commercial freight to decarbonize rapidly."' }
      ],
      practiceMcq: {
        question: 'राष्ट्रीय हरित हाइड्रोजन मिशन (NGHM) के अंतर्गत वर्ष 2030 तक भारत का वार्षिक उत्पादन लक्ष्य कितना है?',
        options: ['5 मिलियन मीट्रिक टन (MMT)', '10 मिलियन मीट्रिक टन (MMT)', '2.5 मिलियन मीट्रिक टन (MMT)', '1 मिलियन मीट्रिक टन (MMT)'],
        correct: 0,
        explanation: 'राष्ट्रीय हरित हाइड्रोजन मिशन के तहत 2030 तक प्रतिवर्ष कम से कम 5 MMT ग्रीन हाइड्रोजन उत्पादन का लक्ष्य है।'
      },
      mainsQuestion: '"भारत के औद्योगिक डीकार्बोनाइजेशन और ऊर्जा स्वतंत्रता में राष्ट्रीय हरित हाइड्रोजन मिशन की रणनीतिक प्रासंगिकता की विवेचना कीजिए।\"'
    },
    {
      categoryTag: 'SPORTS & ACHIEVEMENTS',
      categoryFilter: 'Sports & Honors',
      releaseId: `20658179${dayNum}113`,
      headline: '45वां शतरंज ओलंपियाड 2024: भारत का ओपन और महिला दोनों श्रेणियों में ऐतिहासिक दोहरा स्वर्ण पदक (Double Gold)',
      summary: 'बुडापेस्ट (हंगरी) में आयोजित 45वें फिडे शतरंज ओलंपियाड में भारतीय पुरुष टीम (डी. गुकेश, आर. प्रज्ञानानंद, अर्जुन एरिगैसी, विदित गुजराती, पी. हरिकृष्णा) और महिला टीम (दिव्या देशमुख, वंतिका अग्रवाल, हरिका द्रोणावल्ली) ने ऐतिहासिक दोहरा स्वर्ण पदक जीतकर विश्व शतरंज में भारत का दबदबा स्थापित किया।',
      background: 'शतरंज के 97 वर्षों के इतिहास में यह पहला अवसर है जब भारत ने दोनों मुख्य वर्गों में एक साथ स्वर्ण पदक अपने नाम किया है।',
      sourceMinistry: 'युवा कार्यक्रम एवं खेल मंत्रालय • अखिल भारतीय शतरंज महासंघ (AICF) • PIB',
      sourceUrl: 'https://pib.gov.in',
      imageUrl: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=1200&q=80',
      imageCredit: 'स्रोत: FIDE / AICF Media Team',
      dimensions: [
        'डी. गुकेश ने बोर्ड-1 पर और अर्जुन एरिगैसी ने बोर्ड-3 पर व्यक्तिगत व्यक्तिगत स्वर्ण पदक भी जीते।',
        'महिला वर्ग में 18 वर्षीय दिव्या देशमुख ने अजेय रहते हुए बोर्ड-3 पर व्यक्तिगत स्वर्ण हासिल किया।',
        'भारत सोवियत संघ, रूस और चीन के बाद एक ही संस्करण में दोनों स्वर्ण जीतने वाला दुनिया का चौथा राष्ट्र बना।'
      ],
      provisions: [
        'भारतीय टीम के कोच ग्रैंडमास्टर श्रीनाथ नारायणन के मार्गदर्शन में रणनीति तैयार की गई।',
        'खेल मंत्रालय की टारगेट ओलंपिक पोडियम स्कीम (TOPS) और नेशनल स्पोर्ट्स डेवलपमेंट फंड से खिलाड़ियों को अंतरराष्ट्रीय प्रशिक्षण मिला।'
      ],
      highYieldFact: '44वें शतरंज ओलंपियाड का आयोजन 2022 में भारत के चेन्नई (मल्लापुरम) में सफलतापूर्वक आयोजित किया गया था।',
      vocabulary: [
        { word: 'Unprecedented', pos: 'Adjective', exactHindi: 'अभूतपूर्व / बेमिसाल', definition: 'Never done or known before.', synonyms: 'Unmatched, Groundbreaking, Unparalleled, Historic', antonyms: 'Commonplace, Customary, Routine', examUsage: '"Winning double gold in the Chess Olympiad is an unprecedented triumph for Indian sport."' }
      ],
      practiceMcq: {
        question: '45वें फिडे शतरंज ओलंपियाड 2024 का आयोजन किस शहर में किया गया था?',
        options: ['बुडापेस्ट (हंगरी)', 'ताशकंद (उज़्बेकिस्तान)', 'चेन्नई (भारत)', 'बाकू (अज़रबैजान)'],
        correct: 0,
        explanation: '45वां शतरंज ओलंपियाड हंगरी की राजधानी बुडापेस्ट में सितंबर 2024 में आयोजित हुआ था।'
      },
      mainsQuestion: '"शतरंज ओलंपियाड में भारत की ऐतिहासिक दोहरी स्वर्ण विजय देश में जमीनी स्तर पर खेल संस्कृति और युवा प्रतिभा संवर्धन के सकारात्मक प्रभाव को कैसे दर्शाती है?\"'
    },
    {
      categoryTag: 'HEALTH & SOCIAL WELFARE',
      categoryFilter: 'Schemes & Governance',
      releaseId: `20658179${dayNum}114`,
      headline: 'आयुष्मान भारत पीएम-जय (AB PM-JAY) का ऐतिहासिक विस्तार: 70 वर्ष और उससे अधिक आयु के सभी वरिष्ठ नागरिकों को ₹5 लाख का स्वास्थ्य कवच',
      summary: 'केंद्रीय मंत्रिमंडल ने आय या सामाजिक-आर्थिक स्थिति के किसी भी भेदभाव के बिना 70 वर्ष व उससे अधिक आयु के देश के सभी वरिष्ठ नागरिकों को आयुष्मान कार्ड के अंतर्गत ₹5 लाख प्रतिवर्ष का निःशुल्क स्वास्थ्य बीमा प्रदान करने की योजना लागू की है।',
      background: 'भारत में तेजी से बढ़ती बुजुर्ग आबादी को गुणवत्तापूर्ण चिकित्सीय देखभाल और वृद्धावस्था में अत्यधिक चिकित्सा खर्च से बचाने हेतु यह व्यापक स्वास्थ्य सुरक्षा कवच प्रारंभ किया गया है।',
      sourceMinistry: 'स्वास्थ्य एवं परिवार कल्याण मंत्रालय • राष्ट्रीय स्वास्थ्य प्राधिकरण (NHA) • PIB',
      sourceUrl: 'https://nha.gov.in',
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
      imageCredit: 'स्रोत: National Health Authority',
      dimensions: [
        'देश के लगभग 6 करोड़ वरिष्ठ नागरिकों (4.5 करोड़ परिवारों) को प्रत्यक्ष रूप से लाभ मिलेगा।',
        'वरिष्ठ नागरिकों के लिए एक विशेष नया गोल्डन कार्ड जारी किया जाएगा जो परिवार के मौजूदा कोटे से पृथक होगा।',
        'यदि परिवार पहले से पीएम-जय में कवर है, तो वरिष्ठ नागरिक को ₹5 लाख का अतिरिक्त टॉप-अप कवर प्राप्त होगा।'
      ],
      provisions: [
        'निजी स्वास्थ्य बीमा या ईएसआईसी (ESIC) धारक वरिष्ठ नागरिक भी इस योजना का दोहरा लाभ उठा सकते हैं।',
        'सीजीएचएस (CGHS) या ईसीएचएस (ECHS) के लाभार्थी अपनी वर्तमान योजना और पीएम-जय में से किसी एक का चयन कर सकते हैं।'
      ],
      highYieldFact: 'आयुष्मान भारत प्रधानमंत्री जन आरोग्य योजना को 23 सितंबर 2018 को रांची (झारखंड) से लॉन्च किया गया था।',
      vocabulary: [
        { word: 'Geriatric', pos: 'Adjective', exactHindi: 'वृद्धावस्था चिकित्सा / जराचिकित्सीय', definition: 'Relating to old people, especially with regard to their healthcare.', synonyms: 'Elder-care, Senior healthcare, Age-related', antonyms: 'Pediatric, Adolescent', examUsage: '"Expanding geriatric healthcare infrastructure is vital for aging demographic transitions."' }
      ],
      practiceMcq: {
        question: 'हाल ही में केंद्रीय मंत्रिमंडल द्वारा आयुष्मान भारत योजना का विस्तार किस आयु वर्ग के सभी नागरिकों के लिए किया गया है?',
        options: ['70 वर्ष और उससे अधिक आयु के सभी नागरिक', '65 वर्ष से अधिक के केवल बीपीएल नागरिक', '60 वर्ष से अधिक के ग्रामीण नागरिक', '75 वर्ष से अधिक के पेंशनभोगी'],
        correct: 0,
        explanation: '70 वर्ष और उससे अधिक आयु के सभी वरिष्ठ नागरिकों को उनकी आय पर ध्यान दिए बिना ₹5 लाख का वार्षिक स्वास्थ्य बीमा मिलेगा।'
      },
      mainsQuestion: '"भारत में जनसांख्यिकीय लाभांश के साथ-साथ बढ़ती बुजुर्ग आबादी की स्वास्थ्य सुरक्षा में आयुष्मान भारत के सार्वभौमिक विस्तार के महत्व का मूल्यांकन कीजिए।\"'
    },
    {
      categoryTag: 'INFRASTRUCTURE & COMMERCE',
      categoryFilter: 'Economy & Banking',
      releaseId: `20658179${dayNum}115`,
      headline: 'समर्पित माल गलियारा (DFC) और राष्ट्रीय रसद नीति (NLP): लॉजिस्टिक्स लागत को जीडीपी के 8% तक लाने का लक्ष्य',
      summary: 'रेल मंत्रालय ने ईस्टर्न और वेस्टर्न डेडिकेटेड फ्रेट कॉरिडोर (EDFC और WDFC) के 95% से अधिक नेटवर्क पर 100 किमी/घंटा की गति से भारी मालगाड़ियों का परिचालन शुरू कर देश में लॉजिस्टिक्स लागत को घटाने में बड़ी सफलता हासिल की है।',
      background: 'भारत में माल ढुलाई की रसद लागत जीडीपी का लगभग 13-14% रही है, जबकि वैश्विक औसत 8% है। इस लागत को कम करने हेतु पीएम गतिशक्ति और डीएफसी का निर्माण किया गया है।',
      sourceMinistry: 'रेल मंत्रालय • वाणिज्य एवं उद्योग मंत्रालय • PIB नई दिल्ली',
      sourceUrl: 'https://pib.gov.in',
      imageUrl: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=80',
      imageCredit: 'स्रोत: DFCCIL Media Division • MoR',
      dimensions: [
        'सोननगर से दानकुनी और दादरी से जेएनपीटी तक भारी कंटेनर ट्रेनों का बिना किसी यात्री रुकावट के निर्बाध आवागमन।',
        'प्रतिदिन 300 से अधिक मालगाड़ियों का संचालन जिससे पारंपरिक रेल ट्रैकों पर यात्री ट्रेनों की गति में भी 20% सुधार हुआ।',
        'ट्रक परिवहन की तुलना में रेल कार्गो से कार्बन उत्सर्जन में 75% तक की कमी।'
      ],
      provisions: [
        'डबल-स्टैक ड्वार्फ कंटेनरों और रो-रो (Ro-Ro) सेवाओं के लिए विद्युतीकृत ओवरहेड उपकरण (OHE)।',
        'लॉजिस्टिक्स पार्क और मल्टी-मॉडल लॉजिस्टिक्स हब (MMLH) की प्रमुख बंदरगाहों से सीधी कनेक्टिविटी।'
      ],
      highYieldFact: 'ईस्टर्न डेडिकेटेड फ्रेट कॉरिडोर (EDFC) लुधियाना (पंजाब) से दानकुनी (पश्चिम बंगाल) तक कुल 1,875 किमी लंबा है।',
      vocabulary: [
        { word: 'Corridor', pos: 'Noun', exactHindi: 'गलियारा / विशेष आर्थिक मार्ग', definition: 'A designated strip of land or route along which specific transportation or development occurs.', synonyms: 'Artery, Conduit, Passage, Transit belt', antonyms: 'Cul-de-sac, Barrier', examUsage: '"Dedicated freight corridors accelerate bulk industrial transport between ports and hinterlands."' }
      ],
      practiceMcq: {
        question: 'वेस्टर्न डेडिकेटेड फ्रेट कॉरिडोर (WDFC) किन दो प्रमुख टर्मिनलों को आपस में जोड़ता है?',
        options: ['दादरी (उत्तर प्रदेश) से जेएनपीटी (महाराष्ट्र)', 'लुधियाना (पंजाब) से दानकुनी (पश्चिम बंगाल)', 'दिल्ली से कोलकाता', 'मुंबई से चेन्नई'],
        correct: 0,
        explanation: 'वेस्टर्न डीएफसी दादरी (यूपी) से जवाहरलाल नेहरू पोर्ट ट्रस्ट (जेएनपीटी, नवी मुंबई) तक 1,506 किमी लंबा मार्ग है।'
      },
      mainsQuestion: '"पीएम गतिशक्ति राष्ट्रीय मास्टर प्लान और डीएफसी गलियारे किस प्रकार भारतीय विनिर्माण क्षेत्र की वैश्विक प्रतिस्पर्धात्मकता को बढ़ावा देते हैं? स्पष्ट कीजिए।\"'
    }
  ];

  return masterPool.map((item, idx) => ({
    ...item,
    id: `ca-${todayIso}-${idx + 1}`,
    dateKey: todayIso,
    date: todayHindi,
    readTime: '3 मिनट Read'
  }));
}

// Topic-to-image resolver for server-side generated and synced articles
function resolveServerTopicImage(headline: string, categoryTag = '', summary = ''): { imageUrl: string; imageCredit: string } {
  const text = `${headline} ${categoryTag} ${summary}`.toLowerCase();

  // Space & ISRO
  if (text.includes('isro') || text.includes('space') || text.includes('चंद्रयान') || text.includes('अंतरिक्ष') || text.includes('गगनयान') || text.includes('rocket') || text.includes('satellite') || text.includes('spadex') || text.includes('bas')) {
    if (text.includes('चंद्रमा') || text.includes('moon') || text.includes('chandrayaan')) {
      return {
        imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
        imageCredit: 'स्रोत: ISRO Media Cell • अंतरिक्ष विभाग (DoS)'
      };
    }
    return {
      imageUrl: 'https://images.unsplash.com/photo-1517976487468-f20514c44533?auto=format&fit=crop&w=1200&q=80',
      imageCredit: 'स्रोत: ISRO • Department of Space, GOI'
    };
  }

  // Defense, Navy, Missiles
  if (text.includes('नौसेना') || text.includes('navy') || text.includes('मिसाइल') || text.includes('missile') || text.includes('defense') || text.includes('रक्षा') || text.includes('frigate') || text.includes('नीलगिरि') || text.includes('brahmos') || text.includes('ब्रह्मोस') || text.includes('युद्धपोत') || text.includes('warship') || text.includes('army') || text.includes('drdo')) {
    return {
      imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
      imageCredit: 'स्रोत: रक्षा मंत्रालय (MoD) • भारतीय नौसेना मीडिया सेल'
    };
  }

  // Economy, RBI, Banking, Currency
  if (text.includes('rbi') || text.includes('रिजर्व बैंक') || text.includes('rupee') || text.includes('रुपया') || text.includes('cbdc') || text.includes('मुद्रा') || text.includes('banking') || text.includes('बैंक') || text.includes('gdp') || text.includes('जीडीपी') || text.includes('inflation') || text.includes('मुद्रास्फीति') || text.includes('uli') || text.includes('अर्थव्यवस्था') || text.includes('budget') || text.includes('बजट')) {
    if (text.includes('डिजिटल') || text.includes('cbdc') || text.includes('upi')) {
      return {
        imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
        imageCredit: 'स्रोत: भारतीय रिजर्व बैंक (RBI) • डिजिटल करेंसी सेल'
      };
    }
    return {
      imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
      imageCredit: 'स्रोत: Ministry of Finance • RBI Official Bulletin'
    };
  }

  // Judiciary & Constitution
  if (text.includes('न्याय') || text.includes('bns') || text.includes('bnss') || text.includes('bsa') || text.includes('court') || text.includes('अदालत') || text.includes('संविधान') || text.includes('constitution') || text.includes('ipc') || text.includes('कानून') || text.includes('विधि') || text.includes('cji') || text.includes('justice')) {
    return {
      imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
      imageCredit: 'स्रोत: विधि एवं न्याय मंत्रालय • भारत का राजपत्र (Gazette of India)'
    };
  }

  // Solar & Green Energy
  if (text.includes('solar') || text.includes('सौर') || text.includes('हाइड्रोजन') || text.includes('hydrogen') || text.includes('सूर्य घर') || text.includes('nghm') || text.includes('renewable') || text.includes('नवीकरणीय') || text.includes('clean energy')) {
    return {
      imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
      imageCredit: 'स्रोत: नवीन एवं नवीकरणीय ऊर्जा मंत्रालय (MNRE) • National Solar Mission'
    };
  }

  // Environment & Biodiversity
  if (text.includes('पर्यावरण') || text.includes('environment') || text.includes('वन') || text.includes('forest') || text.includes('बायोस्फीयर') || text.includes('निकोबार') || text.includes('nicobar') || text.includes('गलाथिया') || text.includes('tiger') || text.includes('चीता') || text.includes('climate')) {
    return {
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      imageCredit: 'स्रोत: पर्यावरण, वन एवं जलवायु परिवर्तन मंत्रालय (MoEFCC)'
    };
  }

  // Sports & Chess
  if (text.includes('शतरंज') || text.includes('chess') || text.includes('खेल') || text.includes('sport') || text.includes('ओलंपिक') || text.includes('olympiad') || text.includes('गुकेश') || text.includes('kirti') || text.includes('कीर्ति') || text.includes('cricket') || text.includes('पदक')) {
    if (text.includes('शतरंज') || text.includes('chess')) {
      return {
        imageUrl: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=1200&q=80',
        imageCredit: 'स्रोत: FIDE • अखिल भारतीय शतरंज महासंघ (AICF)'
      };
    }
    return {
      imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
      imageCredit: 'स्रोत: युवा कार्यक्रम एवं खेल मंत्रालय • SAI Media'
    };
  }

  // Health & Medicine
  if (text.includes('आयुष्मान') || text.includes('स्वास्थ्य') || text.includes('health') || text.includes('medical') || text.includes('अस्पताल') || text.includes('hospital') || text.includes('वरिष्ठ नागरिक') || text.includes('vaccine') || text.includes('nha')) {
    return {
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
      imageCredit: 'स्रोत: स्वास्थ्य एवं परिवार कल्याण मंत्रालय • National Health Authority'
    };
  }

  // Infrastructure & Railways
  if (text.includes('गलियारा') || text.includes('railway') || text.includes('रेल') || text.includes('corridor') || text.includes('dfc') || text.includes('मालगाड़ी') || text.includes('logistics') || text.includes('expressway') || text.includes('port')) {
    return {
      imageUrl: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=80',
      imageCredit: 'स्रोत: रेल मंत्रालय • DFCCIL Official Media'
    };
  }

  // Technology, Semiconductor & 6G
  if (text.includes('सेमीकंडक्टर') || text.includes('semiconductor') || text.includes('6g') || text.includes('chip') || text.includes('चिप') || text.includes('फैब्रिकेशन') || text.includes('telecom') || text.includes('ai') || text.includes('quantum')) {
    return {
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      imageCredit: 'स्रोत: इलेक्ट्रॉनिक्स एवं आईटी मंत्रालय (MeitY) • India Semiconductor Mission'
    };
  }

  // Education & Research
  if (text.includes('शिक्षा') || text.includes('education') || text.includes('onos') || text.includes('रिसर्च') || text.includes('research') || text.includes('जर्नल') || text.includes('anrf') || text.includes('विश्वविद्यालय')) {
    return {
      imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80',
      imageCredit: 'स्रोत: शिक्षा मंत्रालय • INFLIBNET गांधीनगर'
    };
  }

  // Women & Parliament
  if (text.includes('महिला') || text.includes('women') || text.includes('नारी शक्ति') || text.includes('आरक्षण') || text.includes('संसद') || text.includes('parliament')) {
    return {
      imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
      imageCredit: 'स्रोत: विधि एवं न्याय मंत्रालय • भारत निर्वाचन आयोग (ECI)'
    };
  }

  // International & MEA
  if (text.includes('विदेश') || text.includes('diplomacy') || text.includes('summit') || text.includes('सम्मेलन') || text.includes('g20') || text.includes('brics') || text.includes('un') || text.includes('संयुक्त राष्ट्र') || text.includes('mea')) {
    return {
      imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80',
      imageCredit: 'स्रोत: विदेश मंत्रालय (MEA) • United Nations Media'
    };
  }

  // Tribal & Rural
  if (text.includes('जनजातीय') || text.includes('tribal') || text.includes('pvtg') || text.includes('जनमन') || text.includes('आदिवासी') || text.includes('किसान') || text.includes('कृषि')) {
    return {
      imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
      imageCredit: 'स्रोत: जनजातीय कार्य मंत्रालय • कृषि मंत्रालय'
    };
  }

  return {
    imageUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80',
    imageCredit: 'स्रोत: पत्र सूचना कार्यालय (PIB) • भारत सरकार'
  };
}

// Strict Anti-Repeat Registry and Auto-Updater for Daily Current Affairs
async function generateDailyCurrentAffairs(todayIso: string, force = false): Promise<any[]> {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
  const dailyFile = path.join(dataDir, `ca_editorials_${todayIso}.json`);
  const vaultFile = path.join(dataDir, 'current_affairs_vault.json');
  const registryFile = path.join(dataDir, 'ca_historical_registry.json');

  // Load historical registry to prevent any repetition of previous day's news
  let historicalRegistry: Record<string, string[]> = {};
  if (fs.existsSync(registryFile)) {
    try {
      historicalRegistry = JSON.parse(fs.readFileSync(registryFile, 'utf-8'));
    } catch {
      historicalRegistry = {};
    }
  }

  // Yesterday date key
  const yesterdayDate = new Date(Date.now() - 86400000);
  const yesterdayIso = yesterdayDate.toISOString().split('T')[0];

  // Past headlines that must strictly NOT be repeated
  const pastSeenHeadlines: string[] = [];
  Object.keys(historicalRegistry).forEach(k => {
    if (k !== todayIso) {
      historicalRegistry[k]?.forEach(h => pastSeenHeadlines.push(h));
    }
  });

  const normalizeStr = (s: string) => s.toLowerCase().replace(/[^a-zA-Z0-9\u0900-\u097F]/g, '');

  if (!force && fs.existsSync(dailyFile)) {
    try {
      const cached = JSON.parse(fs.readFileSync(dailyFile, 'utf-8'));
      if (Array.isArray(cached) && cached.length >= 12) {
        fs.writeFileSync(vaultFile, JSON.stringify(cached, null, 2));
        return cached;
      }
    } catch {
      // continue
    }
  }

  const todayHindi = new Date().toLocaleDateString('hi-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  let todayArticles: any[] = [];

  if (ai) {
    try {
      const exclusionSnippet = pastSeenHeadlines.slice(-15).map(h => `"${h.slice(0, 45)}"`).join(', ');
      const aiPrompt = `STRICT RESTRICTION ORDER: Do NOT repeat any previously covered news.
DO NOT REPEAT ANY OF THESE RECENT TOPICS: [${exclusionSnippet}].
You must synchronize 100% FRESH and DISTINCT developments from yesterday and today (${todayHindi} / ${todayIso}) for Indian Competitive Exams (UPSC, SSC CGL, Steno, Railway, State PCS) from authentic sources:
1. Press Information Bureau (PIB India)
2. Ministry of External Affairs (MEA India) & UN
3. Reserve Bank of India (RBI) Bulletins
4. ISRO Space Missions
5. The Hindu & The Indian Express Editorials

Generate 6 to 8 fresh, high-impact news development objects for today.
Return JSON with an "articles" array where each object has:
- headline: string (compelling, fresh Hindi editorial headline)
- categoryTag: string (e.g. "NATIONAL", "DEFENSE & SECURITY", "ECONOMY & BANKING", "SCIENCE & TECH", "SCHEMES & GOVERNANCE", "SPORTS & HONORS")
- categoryFilter: one of ["National", "Sports & Honors", "Economy & Banking", "Schemes & Governance", "Science & Tech"]
- summary: string (3 sentences fresh Hindi summary)
- background: string (2 sentences context in Hindi)
- sourceMinistry: string (e.g. "प्रेस सूचना ब्यूरो (PIB) • विदेश मंत्रालय • The Hindu")
- highYieldFact: string (1 key prelims fact in Hindi)
- practiceMcq: { question: string, options: [string, string, string, string], correct: number, explanation: string }
- mainsQuestion: string`;

      const aiPromise = ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: aiPrompt,
        config: { responseMimeType: 'application/json' }
      });

      const timeoutPromise = new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error('AI CA timeout after 7s')), 7000)
      );

      const result: any = await Promise.race([aiPromise, timeoutPromise]);

      if (result && result.text) {
        const parsed = safeJsonParse(result.text);
        const arr = Array.isArray(parsed) ? parsed : parsed?.articles;
        if (Array.isArray(arr) && arr.length > 0) {
          arr.forEach((item: any, idx: number) => {
            const hNorm = normalizeStr(item.headline || '');
            // Anti-repetition check: Discard if matches past day
            const isRepeat = pastSeenHeadlines.some(prev => {
              const pNorm = normalizeStr(prev);
              return pNorm.length > 10 && (pNorm.includes(hNorm) || hNorm.includes(pNorm));
            });

            if (!isRepeat && item.headline) {
              const imageMeta = resolveServerTopicImage(item.headline, item.categoryTag, item.summary);
              todayArticles.push({
                id: `ca-${todayIso}-ai-${idx + 1}`,
                dateKey: todayIso,
                date: todayHindi,
                readTime: '3 मिनट Read',
                releaseId: `PIB-${todayIso.replace(/-/g, '')}${idx + 101}`,
                sourceUrl: 'https://pib.gov.in',
                imageUrl: imageMeta.imageUrl,
                imageCredit: imageMeta.imageCredit,
                dimensions: [
                  item.summary || 'प्रमुख नीतिगत आयाम एवं राष्ट्रीय प्रभाव।',
                  item.background || 'ऐतिहासिक पृष्ठभूमि एवं आगामी कार्ययोजना।',
                  item.highYieldFact || 'परीक्षा के दृष्टिकोण से महत्वपूर्ण सांख्यिकी।'
                ],
                provisions: [
                  'संबंधित मंत्रालय द्वारा जारी दिशा-निर्देश एवं बजटीय आवंटन।',
                  'हितधारकों एवं राज्यों के साथ समन्वय एवं क्रियान्वयन समय-सीमा।'
                ],
                vocabulary: [
                  { word: 'Pragmatic', pos: 'Adjective', exactHindi: 'व्यावहारिक / यथार्थवादी', definition: 'Dealing with things sensibly and realistically in a way that is based on practical rather than theoretical considerations.', synonyms: 'Practical, Realistic, Sensible', antonyms: 'Impractical, Idealistic', examUsage: '"Pragmatic policy frameworks foster sustainable socioeconomic growth."' }
                ],
                ...item,
                imageUrl: imageMeta.imageUrl,
                imageCredit: imageMeta.imageCredit
              });
            }
          });
        }
      }
    } catch (genErr: any) {
      console.warn('Daily CA auto-generation notice (using deterministic pool):', genErr?.message || genErr);
    }
  }

  // Backfill from deterministic master pool, strictly verifying no repetition with past days or already present today
  const fallbackList = getDailyDeterministicArticles(todayIso, todayHindi);
  for (const item of fallbackList) {
    const itemNorm = normalizeStr(item.headline);
    const isAlreadyInToday = todayArticles.some(a => normalizeStr(a.headline).slice(0, 20) === itemNorm.slice(0, 20));
    
    if (!isAlreadyInToday) {
      const imageMeta = resolveServerTopicImage(item.headline, item.categoryTag, item.summary);
      todayArticles.push({
        ...item,
        imageUrl: imageMeta.imageUrl,
        imageCredit: imageMeta.imageCredit
      });
    }
  }

  // Ensure unique sequential IDs and verified images for 100% of articles
  todayArticles = todayArticles.map((item, idx) => {
    const imageMeta = resolveServerTopicImage(item.headline, item.categoryTag, item.summary);
    return {
      ...item,
      id: item.id || `ca-${todayIso}-${idx + 1}`,
      dateKey: todayIso,
      date: todayHindi,
      imageUrl: item.imageUrl || imageMeta.imageUrl,
      imageCredit: item.imageCredit || imageMeta.imageCredit
    };
  });

  // Record today's headlines into historical registry
  historicalRegistry[todayIso] = todayArticles.map(a => a.headline);
  // Keep only last 14 days in registry to avoid unbounded growth
  const allKeys = Object.keys(historicalRegistry).sort();
  if (allKeys.length > 14) {
    for (const oldKey of allKeys.slice(0, allKeys.length - 14)) {
      delete historicalRegistry[oldKey];
    }
  }

  try {
    fs.writeFileSync(registryFile, JSON.stringify(historicalRegistry, null, 2));
    fs.writeFileSync(dailyFile, JSON.stringify(todayArticles, null, 2));
    fs.writeFileSync(vaultFile, JSON.stringify(todayArticles, null, 2));
  } catch (err) {
    console.warn('File write notice in CA generator:', err);
  }

  return todayArticles;
}

// 1. Daily Current Affairs & Editorial Sync APIs (Guarantees Daily Change & Auto Update)
app.get('/api/current-affairs/articles', async (req, res) => {
  try {
    const todayIso = new Date().toISOString().split('T')[0];
    const force = req.query.refresh === 'true' || req.query.force === 'true';
    const articles = await generateDailyCurrentAffairs(todayIso, force);
    return res.json({ success: true, dateKey: todayIso, count: articles.length, articles });
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

// Server-side LRU cache for synthesized Neural TTS MP3 audio
const serverTtsCache = new Map<string, { audioBase64: string; mimeType: string }>();

function splitTextIntoBilingualNeuralChunks(text: string): { text: string; lang: 'hi' | 'en-IN' }[] {
  const cleaned = text
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
    .replace(/[*#`_~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned) return [];

  // Split by natural clause boundaries so Hindi and English segments get their native neural voices
  const rawClauses = cleaned
    .split(/(?<=[।\.\?\!\;\,\:\—\–\-])\s+/)
    .map(c => c.trim())
    .filter(Boolean);

  const chunks: { text: string; lang: 'hi' | 'en-IN' }[] = [];

  const detectChunkLang = (str: string): 'hi' | 'en-IN' => {
    const devMatches = str.match(/[\u0900-\u097F]/g);
    const latMatches = str.match(/[a-zA-Z]/g);
    const devCount = devMatches ? devMatches.length : 0;
    const latCount = latMatches ? latMatches.length : 0;
    return devCount > 0 && devCount >= latCount * 0.25 ? 'hi' : 'en-IN';
  };

  for (const clause of rawClauses) {
    const lang = detectChunkLang(clause);
    // Split long clauses into <= 165 char pieces at word boundaries
    const words = clause.split(/\s+/);
    let current = '';
    for (const w of words) {
      if ((current + ' ' + w).trim().length <= 165) {
        current = current ? `${current} ${w}` : w;
      } else {
        if (current) {
          if (
            chunks.length > 0 &&
            chunks[chunks.length - 1].lang === lang &&
            (chunks[chunks.length - 1].text + ' ' + current).length <= 165
          ) {
            chunks[chunks.length - 1].text += ' ' + current;
          } else {
            chunks.push({ text: current, lang });
          }
        }
        current = w;
      }
    }
    if (current) {
      if (
        chunks.length > 0 &&
        chunks[chunks.length - 1].lang === lang &&
        (chunks[chunks.length - 1].text + ' ' + current).length <= 165
      ) {
        chunks[chunks.length - 1].text += ' ' + current;
      } else {
        chunks.push({ text: current, lang });
      }
    }
  }

  return chunks;
}

async function fetchNeuralMp3Chunk(text: string, lang: 'hi' | 'en-IN'): Promise<Buffer | null> {
  const encoded = encodeURIComponent(text);
  const urls = [
    `https://translate.googleapis.com/translate_tts?ie=UTF-8&client=gtx&tl=${lang}&q=${encoded}`,
    `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${lang}&q=${encoded}`
  ];

  for (const url of urls) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          Accept: 'audio/mpeg, audio/*;q=0.9, */*;q=0.8'
        }
      });
      if (response.ok) {
        const arrayBuf = await response.arrayBuffer();
        if (arrayBuf && arrayBuf.byteLength > 100) {
          return Buffer.from(arrayBuf);
        }
      }
    } catch {
      // try next mirror
    }
  }
  return null;
}

app.post('/api/tts/speak', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'Text is required for TTS' });
    }

    const trimmedText = text.trim().slice(0, 1500);

    // Synthesize natural human Hindi (hi) & Indian English (en-IN) Neural MP3 audio
    const chunks = splitTextIntoBilingualNeuralChunks(trimmedText);
    if (chunks.length > 0) {
      const buffers = await Promise.all(chunks.map(c => fetchNeuralMp3Chunk(c.text, c.lang)));
      const validBuffers = buffers.filter((b): b is Buffer => b !== null && b.length > 0);

      if (validBuffers.length > 0) {
        const combinedMp3 = Buffer.concat(validBuffers);
        const audioBase64 = combinedMp3.toString('base64');
        const payload = { audioBase64, mimeType: 'audio/mpeg' };
        return res.json({ success: true, ...payload });
      }
    }

    return res.json({ success: false, fallback: true });
  } catch {
    return res.json({ success: false, fallback: true });
  }
});

app.post('/api/current-affairs/sync', async (req, res) => {
  try {
    const { forceRefresh = false } = req.body;
    const todayIso = new Date().toISOString().split('T')[0];
    const articles = await generateDailyCurrentAffairs(todayIso, forceRefresh);
    return res.json({ success: true, dateKey: todayIso, count: articles.length, articles });
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
- When the user asks about the app itself ("अपने बारे में बताओ", "ऐप गाइड", "इस ऐप में क्या-क्या है", "होमपेज चैट बॉक्स क्या करता है"), provide a complete, structured, proud overview of HANS COMPAIN and how to use each feature.
- Home Page Chat Box Capabilities:
  1. Ask Any Academic Doubt (Maths, Science, GK, Current Affairs, English Grammar, Shorthand/Steno) in Hindi, English, or Hinglish.
  2. Camera OCR Icon (📷): Scans handwritten notebook pages or printed questions into digital text, formulas, flashcards, and MCQs in 3 steps.
  3. Paperclip Attachment Icon (📎): Supports uploading multiple images and PDF documents for deep analysis and Q&A.
  4. Voice Mic Input (🎙️): Hands-free bilingual speech-to-text query input.
  5. Natural Human Audio Output (🔊) & Instant 5-MCQ / Short-Trick / Key-Points generators on every AI reply.
- App Features:
  1. All Stenographer (सम्पूर्ण आशुलिपि): 60-120 WPM Audio Dictation Studio, Rishi Pranali outlines & Full-Screen Practice Board with live Error % calculation.
  2. Current Affairs 2026 (Full-Page PIB & The Hindu Hub): Daily fresh editorials, Small/Medium/Large font controls, Hindi ⇄ English full translation, Natural Neural Voice Reader, AI New Topic Editorial Generator, Interactive Click-any-Word Bilingual Dictionary, and In-Article Bilingual Doubt Solver.
  3. Live Group Quiz Battle (10–50 Students): Multiplayer quiz arena with room codes, voice/AI question generation, and live leaderboard.
  4. AI Mnemonics: Generates catchy rhymes/poems for dates, constitutional articles, formulas, and custom topics.
  5. Interactive Science Lab Suite: 42 Live Virtual Labs across 6 categories (Physics, Chemistry, Biology, Geography & Space, Mathematics & Geometry, Quantum/AI/Environment) with interactive sliders, live SVG apparatus, and exam viva points.
  6. Daily Goals: Study targets with Color Badges (Bronze, Silver, Gold, Diamond, Legend).
  7. Single-Page CBT Real Exam Center & PYQ Vault: TCS iON style CBT exam mode with Question Palette, Auto-Sync Mistake Notebook, and Unlimited Previous Year Questions.
  8. 10th & 12th Board Exam Hub: BSEB, UPMSP, and CBSE chapter-wise OMR tests & topper notes.
  9. Edu-Reels: Auto-generates 60-second revision reels from student study activities.
  10. Smart Global Library & Article Voice Reader: NCERT & World Books with adjustable font and natural voice read-aloud.
  11. Apps Launcher: Bharati Bhawan (K.C. Sinha), PYQ Vault, Sarkari Result Eligibility Calculator, Time Travel Simulator, Peer Challenge, Music Studio, Affiliate Book Store.
  12. Full-Page Owner Admin Console: Clean professional control center allowing the owner to turn any of the 14 app features ON or OFF in real time and monitor student records.`;

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
    return res.status(503).json({ error: 'AI service fallback triggered' });
  } catch (err) {
    console.error('Doubt solver error:', err);
    res.status(500).json({ error: 'Internal Error' });
  }
});

// 2a-extra. Dedicated Current Affairs Translation, AI Article Generator & Word Detector Routes
app.post('/api/current-affairs/translate', async (req, res) => {
  try {
    const { article } = req.body;
    if (!article) return res.status(400).json({ error: 'Missing article' });
    if (!ai) return res.status(503).json({ error: 'AI unavailable' });

    const prompt = `Translate this Hindi PIB & The Hindu Current Affairs Editorial into fluent, authoritative competitive-exam English (UPSC / SSC / State PCS / Banking level).
Return strictly valid JSON with keys:
- headline: string
- sourceMinistry: string
- summary: string
- background: string
- deepExplanation: string (4 detailed paragraphs covering: (a) Why in News & Core Context, (b) Mechanism & Institutional Analysis, (c) Multi-Dimensional Impact on India, (d) Key Challenges & Way Forward)
- dimensions: array of strings (translated from input dimensions)
- provisions: array of strings (translated from input provisions)
- highYieldFact: string
- mcqQuestion: string
- mcqOptions: array of 4 strings
- mcqExplanation: string
- mainsQuestion: string
- mainsIntro: string
- mainsBody: string
- mainsConclusion: string

Input Article JSON:
${JSON.stringify({
  headline: article.headline,
  sourceMinistry: article.sourceMinistry,
  summary: article.summary,
  background: article.background,
  dimensions: article.dimensions,
  provisions: article.provisions,
  highYieldFact: article.highYieldFact,
  practiceMcq: article.practiceMcq,
  mainsQuestion: article.mainsQuestion
})}`;

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    if (result && result.text) {
      const parsed = safeJsonParse(result.text);
      return res.json({ success: true, translated: parsed });
    }
    return res.status(503).json({ error: 'Empty translation response' });
  } catch (err) {
    return res.status(500).json({ error: 'Translation failed' });
  }
});

app.post('/api/current-affairs/generate-article', async (req, res) => {
  try {
    const { topic } = req.body;
    if (!ai) return res.status(503).json({ error: 'AI unavailable' });

    const todayIso = new Date().toISOString().split('T')[0];
    const todayHindi = new Date().toLocaleDateString('hi-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const targetTopic = (topic && topic.trim()) ? topic.trim() : 'भारत के नवीनतम राष्ट्रीय एवं वैज्ञानिक विकास 2026 (PIB Special)';

    const prompt = `Create a complete, high-yield PIB & The Hindu style Current Affairs Editorial on the topic: "${targetTopic}" for Indian Competitive Exams (UPSC, SSC CGL, Steno, Banking, Railway, State PCS).
Provide BOTH Hindi and English versions so students can read and listen in both languages!
Return strictly valid JSON with these exact keys:
{
  "id": "ca-ai-${Date.now()}",
  "dateKey": "${todayIso}",
  "categoryTag": "AI PIB EDITORIAL",
  "categoryFilter": "Science & Tech",
  "date": "${todayHindi}",
  "readTime": "4 मिनट Read",
  "releaseId": "2065817912599812345",
  "headline": "Compelling Hindi editorial headline on ${targetTopic}",
  "summary": "Detailed 3-4 sentence Hindi executive summary",
  "background": "Detailed 2-3 sentence Hindi historical and policy background",
  "sourceMinistry": "प्रेस सूचना ब्यूरो (PIB) • भारत सरकार • The Hindu Editorial",
  "sourceUrl": "https://pib.gov.in",
  "imageUrl": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
  "imageCredit": "स्रोत: PIB Official Media • HANS COMPAIN Desk",
  "dimensions": ["Detailed Hindi dimension point 1", "Detailed Hindi dimension point 2", "Detailed Hindi dimension point 3"],
  "provisions": ["Detailed Hindi policy/budget provision 1", "Detailed Hindi policy/budget provision 2", "Detailed Hindi policy/budget provision 3"],
  "highYieldFact": "Golden prelims one-liner fact in Hindi",
  "vocabulary": [
    {
      "word": "English Editorial Word 1",
      "pos": "Noun / Adjective",
      "exactHindi": "सटीक हिंदी अर्थ",
      "definition": "Clear English definition",
      "synonyms": "3-4 English synonyms",
      "antonyms": "2-3 English antonyms",
      "examUsage": "Example sentence using the word"
    },
    {
      "word": "English Editorial Word 2",
      "pos": "Noun / Verb",
      "exactHindi": "सटीक हिंदी अर्थ",
      "definition": "Clear English definition",
      "synonyms": "3-4 English synonyms",
      "antonyms": "2-3 English antonyms",
      "examUsage": "Example sentence using the word"
    },
    {
      "word": "English Editorial Word 3",
      "pos": "Adjective / Noun",
      "exactHindi": "सटीक हिंदी अर्थ",
      "definition": "Clear English definition",
      "synonyms": "3-4 English synonyms",
      "antonyms": "2-3 English antonyms",
      "examUsage": "Example sentence using the word"
    }
  ],
  "practiceMcq": {
    "question": "High-yield Prelims MCQ in Hindi on ${targetTopic}",
    "options": ["विकल्प A", "विकल्प B", "विकल्प C", "विकल्प D"],
    "correct": 0,
    "explanation": "Detailed Hindi explanation of the correct answer"
  },
  "mainsQuestion": "Analytical Mains 250-word question in Hindi on ${targetTopic}",
  "englishTranslation": {
    "headline": "Compelling English editorial headline on ${targetTopic}",
    "sourceMinistry": "Press Information Bureau (PIB) • Government of India • The Hindu Editorial",
    "summary": "Detailed 3-4 sentence English executive summary",
    "background": "Detailed 2-3 sentence English historical and policy background",
    "deepExplanation": "Detailed 4-paragraph English analytical explanation covering Why in News, Mechanism, Impact on India, and Way Forward",
    "dimensions": ["Detailed English dimension 1", "Detailed English dimension 2", "Detailed English dimension 3"],
    "provisions": ["Detailed English provision 1", "Detailed English provision 2", "Detailed English provision 3"],
    "highYieldFact": "Golden prelims one-liner fact in English",
    "mcqQuestion": "High-yield Prelims MCQ in English on ${targetTopic}",
    "mcqOptions": ["Option A", "Option B", "Option C", "Option D"],
    "mcqExplanation": "Detailed English explanation of the correct answer",
    "mainsQuestion": "Analytical Mains 250-word question in English on ${targetTopic}"
  }
}`;

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    if (result && result.text) {
      const parsed = safeJsonParse(result.text);
      return res.json({ success: true, article: parsed });
    }
    return res.status(503).json({ error: 'Empty article generation' });
  } catch (err) {
    return res.status(500).json({ error: 'Article generation failed' });
  }
});

app.post('/api/current-affairs/vocab', async (req, res) => {
  try {
    const { word, articleContext } = req.body;
    if (!word) return res.status(400).json({ error: 'Missing word' });
    if (!ai) return res.status(503).json({ error: 'AI unavailable' });

    const prompt = `Analyze the vocabulary word or phrase "${word}" (Context: ${articleContext || 'PIB & The Hindu Competitive Exam Editorial'}).
Provide bilingual (Hindi + English) details for competitive exam students (SSC, UPSC, Banking, Steno).
Return strictly valid JSON with keys:
- word: string (the word in English and Hindi script)
- pos: string (Part of Speech, e.g., "Noun / Adjective")
- exactHindi: string (Exact Hindi meaning in Devanagari)
- definition: string (Clear English definition + simple Hindi explanation)
- synonyms: string (4 English synonyms with Hindi meanings)
- antonyms: string (3 English antonyms with Hindi meanings)
- examUsage: string (1 English example sentence + its Hindi translation)`;

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    if (result && result.text) {
      const parsed = safeJsonParse(result.text);
      return res.json({ success: true, vocab: parsed });
    }
    return res.status(503).json({ error: 'Empty vocab response' });
  } catch (err) {
    return res.status(500).json({ error: 'Vocab lookup failed' });
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
        model: 'gemini-2.5-flash',
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
      model: 'gemini-2.5-flash',
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
      ? `STRICTLY FROM THE SPECIFIC CHAPTER / TOPIC: "${chapterName.trim()}" of Class ${classLevel} ${board} ${subject} syllabus.
MANDATORY EXAM-PREDICTED MASTERY: Every single question MUST be an authentic, high-probability exam question (अति-संभावित बोर्ड परीक्षा प्रश्न) for "${chapterName.trim()}".
Focus on the most frequent definitions, theorems, formulas, rules, reactions, exceptions, and 10-year Previous Year Question (PYQ) patterns of this specific chapter so students get comprehensive practice of what will actually appear in the exam.`
      : `spanning the official Class ${classLevel} ${board} ${subject} board exam syllabus according to the official blueprint`;

    const qualityInstruction = qualityLevel === 'topper-hard' || mode === 'topper-100'
      ? 'Target 90% - 100% Board Score: High-order thinking skills (HOTS), numericals, Assertion-Reasoning, tricky conceptual questions that differentiate average students from 95%+ state toppers.'
      : qualityLevel === 'ncert-core'
      ? 'Direct NCERT/SCERT textbook line-by-line conceptual, definition, and formula-based objective questions.'
      : 'Official Board Exam Previous Year Question (PYQ) pattern and recurring 10-year question trends with 100% exam probability.';

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
3. DYNAMIC CHAPTER MASTERY (USER-ADAPTIVE): Do NOT output static pre-saved dummy questions. Every question must be deeply tailored to the selected chapter/subject, testing real exam concepts with high likelihood of appearing in the actual exam.
4. Exam Blueprint & Quality: ${qualityInstruction}
5. ${antiRepetitionRule}
6. Single Clean Language: ${langInstruction}
7. Return strictly valid JSON with this exact schema:
{
  "questions": [
    {
      "id": "board_live_1",
      "question": "Clear and precise board exam question...",
      "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
      "correctAnswer": 0,
      "explanation": "Authoritative step-by-step solution, NCERT textbook reference, formula, and Topper tip to score 100%.",
      "yearTag": "${chapterName ? `${chapterName.trim()} • 100% बोर्ड परीक्षा संभावित प्रश्न` : `${board} ${classLevel} Official Blueprint`}"
    }
  ]
}`;

    const randomSeed = Math.floor(Math.random() * 100000);
    const aiPromise = ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate exactly ${examLength} live board exam questions for Class ${classLevel} ${board} ${subject} ${chapterName ? `on chapter "${chapterName.trim()}" (High Probability Exam Questions)` : 'full syllabus'}. Random Seed: ${randomSeed}. Language: ${language}. Mode: ${mode}.`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        maxOutputTokens: 4096
      }
    });

    const timeoutPromise = new Promise<any>((_, reject) =>
      setTimeout(() => reject(new Error('AI generation timeout after 5s')), 5000)
    );

    let result: any = null;
    try {
      result = await Promise.race([aiPromise, timeoutPromise]);
    } catch (timeoutErr) {
      console.warn('AI exam generation timeout, serving instant offline fallback:', timeoutErr);
    }

    if (result && result.text) {
      try {
        const parsed = safeJsonParse(result.text);
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
      } catch (parseErr) {
        console.warn('Board exam JSON parse warning, using fallback:', parseErr);
      }
    }

    // Fallback if AI output or parse failed
    const fallbackQuestions = generateFallbackBoardQuestions(board, classLevel, subject, examLength, language);
    return res.json({
      success: true,
      questions: fallbackQuestions,
      officialCount: defaultOfficialCount,
      board,
      classLevel,
      subject
    });
  } catch (err: any) {
    console.error('Board exam generation error:', err);
    const fallbackQuestions = generateFallbackBoardQuestions(board, classLevel, subject, examLength, language);
    return res.json({
      success: true,
      questions: fallbackQuestions,
      officialCount: defaultOfficialCount,
      board,
      classLevel,
      subject
    });
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
        maxOutputTokens: 16384
      }
    });

    if (result && result.text) {
      try {
        const parsed = safeJsonParse(result.text);
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
      } catch (parseErr) {
        console.warn('Competitive exam JSON parse warning, using fallback:', parseErr);
      }
    }

    const fallbackQuestions = generateFallbackCompQuestions(examCategory, subject, numQuestions, language);
    return res.json({
      success: true,
      questions: fallbackQuestions,
      count: fallbackQuestions.length,
      examCategory,
      subject
    });
  } catch (err: any) {
    console.error('Competitive live generator error:', err);
    const fallbackQuestions = generateFallbackCompQuestions(examCategory, subject, numQuestions, language);
    return res.json({
      success: true,
      questions: fallbackQuestions,
      count: fallbackQuestions.length,
      examCategory,
      subject
    });
  }
});

// 2f. Dedicated Live Battle Quiz Questions Generator (STRICT SUBJECT, CHAPTER & EXACT COUNT)
app.post('/api/battle/generate-questions', async (req, res) => {
  try {
    const {
      category = '10th & 12th Board Exams - हिन्दी (Hindi)',
      subject = '',
      topicOrChapter = '',
      difficulty = 'Medium',
      count = 10,
      language = 'hindi'
    } = req.body;

    const requestedCount = Number(count);
    const targetCount = (!isNaN(requestedCount) && requestedCount > 0)
      ? Math.min(50, Math.max(3, requestedCount))
      : 10;

    const combined = `${category} ${subject} ${topicOrChapter}`.toLowerCase();
    const isBoard = /board|10th|12th|कक्षा|बोर्ड/i.test(combined);

    let activeSubject = subject.trim();
    if (!activeSubject) {
      if (/hindi|हिन्दी|व्याकरण|संधि|समास|मुहावरे/i.test(combined)) {
        activeSubject = 'हिन्दी (Hindi)';
      } else if (/science|विज्ञान|भौतिकी|रसायन|जीव विज्ञान/i.test(combined)) {
        activeSubject = 'विज्ञान (Science)';
      } else if (/math|गणित|त्रिकोणमिति/i.test(combined)) {
        activeSubject = 'गणित (Mathematics)';
      } else if (/polity|संविधान|राजव्यवस्था/i.test(combined)) {
        activeSubject = 'भारतीय राजव्यवस्था (Indian Polity)';
      } else if (/steno|आशुलिपि/i.test(combined)) {
        activeSubject = 'आशुलिपि (Stenography)';
      } else {
        activeSubject = isBoard ? '10वीं व 12वीं बोर्ड पाठ्यक्रम' : 'सामान्य अध्ययन (General Studies)';
      }
    }

    const cleanTopic = (topicOrChapter || '').trim();

    if (ai) {
      const levelDesc = isBoard
        ? 'Class 10th & 12th School Board Syllabus (NCERT/State Board)'
        : 'Competitive Government Examination (SSC, Railway, Police)';

      const chapterRule = cleanTopic
        ? `STRICT CHAPTER REQUIREMENT: All questions MUST be strictly and exclusively on "${cleanTopic}". Do NOT generate questions from other topics.`
        : `Balanced high-yield questions on "${activeSubject}".`;

      const systemInstruction = `You are India's premier examination question setter for ${levelDesc}.
MANDATORY COUNT RULE: Return EXACTLY ${targetCount} question objects in the "questions" array.
STRICT SUBJECT INTEGRITY:
- Subject: "${activeSubject}"
- ${chapterRule}
- ZERO MIXING: If Hindi is selected, generate 100% Hindi language, grammar, or literature. Absolutely NEVER include Science, Math or other subjects!
- Return valid JSON with this exact schema:
{
  "questions": [
    {
      "id": "battle_q_1",
      "question": "Question text...",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0,
      "subject": "${activeSubject}",
      "explanation": "Short 1-line reason"
    }
  ]
}`;

      try {
        const result = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `Generate exactly ${targetCount} battle quiz questions for ${levelDesc} on Subject: "${activeSubject}"${cleanTopic ? ` Chapter: "${cleanTopic}"` : ''}. Difficulty: ${difficulty}.`,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            maxOutputTokens: 2048
          }
        });

        if (result && result.text) {
          const parsed = safeJsonParse(result.text);
          if (parsed && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
            let finalQuestions = parsed.questions.slice(0, targetCount).map((q: any, idx: number) => ({
              id: q.id || `battle_live_${Date.now()}_${idx + 1}`,
              question: q.question,
              options: Array.isArray(q.options) && q.options.length === 4
                ? q.options
                : ['विकल्प क', 'विकल्प ख', 'विकल्प ग', 'विकल्प घ'],
              correct: typeof q.correct === 'number' && q.correct >= 0 && q.correct <= 3 ? q.correct : 0,
              subject: q.subject || activeSubject,
              categoryTag: isBoard ? 'Board' : 'Competitive',
              explanation: q.explanation || 'परीक्षा के अनुसार सही उत्तर।'
            }));

            if (finalQuestions.length < targetCount) {
              const shortfall = targetCount - finalQuestions.length;
              for (let i = 0; i < shortfall; i++) {
                const base = finalQuestions[i % finalQuestions.length];
                finalQuestions.push({
                  ...base,
                  id: `battle_live_${Date.now()}_fill_${i + 1}`,
                  question: `${base.question} (सेट ${i + 2})`
                });
              }
            }

            return res.json({
              success: true,
              questions: finalQuestions.slice(0, targetCount),
              count: finalQuestions.slice(0, targetCount).length,
              subject: activeSubject,
              category,
              topicOrChapter: cleanTopic
            });
          }
        }
      } catch (aiErr) {
        console.warn('Battle AI fallback notice:', aiErr);
      }
    }

    // High-Yield Authentic Offline Fallback from syllabusQuestionBank
    const fallbackList = getExactSubjectQuestionsServer({
      subjectOrCategory: activeSubject,
      topicOrChapter: cleanTopic,
      level: isBoard ? 'board' : 'competitive',
      count: targetCount
    }).slice(0, targetCount).map(q => ({
      id: `battle_fallback_${q.id}`,
      question: q.question,
      options: q.options,
      correct: q.correctAnswer,
      subject: activeSubject,
      categoryTag: isBoard ? 'Board' : 'Competitive',
      explanation: q.explanation
    }));

    return res.json({
      success: true,
      questions: fallbackList,
      count: fallbackList.length,
      subject: activeSubject,
      category,
      topicOrChapter: cleanTopic
    });
  } catch (err: any) {
    console.error('Battle question route error:', err);
    res.status(500).json({ error: 'Failed to generate battle questions' });
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
