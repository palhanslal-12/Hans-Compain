import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Sparkles, Send, Globe, MessageSquare, Bot, 
  RotateCcw, Volume2, VolumeX, CheckCircle2, ChevronRight,
  ArrowRight, ShieldCheck, Zap, HelpCircle, FileText,
  BookOpen, Mic, Cpu, Download
} from 'lucide-react';

interface HansAiHelpGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: 'english' | 'hindi' | string;
  onNavigateToFeature?: (viewName: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  options?: Array<{ label: string; action: string; category?: string }>;
  suggestedAction?: { label: string; viewName: string };
  timestamp: string;
}

// Supported 8+ Languages for A8 System
export const A8_LANGUAGES = [
  { id: 'hindi', label: 'हिंदी (Hindi)', flag: '🇮🇳' },
  { id: 'english', label: 'English', flag: '🇬🇧' },
  { id: 'hinglish', label: 'Hinglish (मिक्स)', flag: '🇮🇳' },
  { id: 'bengali', label: 'বাংলা (Bengali)', flag: '🇮🇳' },
  { id: 'tamil', label: 'தமிழ் (Tamil)', flag: '🇮🇳' },
  { id: 'telugu', label: 'తెలుగు (Telugu)', flag: '🇮🇳' },
  { id: 'marathi', label: 'मराठी (Marathi)', flag: '🇮🇳' },
  { id: 'gujarati', label: 'ગુજરાતી (Gujarati)', flag: '🇮🇳' },
  { id: 'bhojpuri', label: 'भोजपुरी (Bhojpuri)', flag: '🇮🇳' },
];

// Pre-defined problem categories & instant intelligent multi-lingual solutions
export const A8_PROBLEM_CATEGORIES = [
  {
    id: 'steno_dictation',
    icon: '✍️',
    title: {
      hindi: 'स्टेनो, पैड व वॉइस डिक्टेशन',
      english: 'Steno Studio & Voice Dictation',
      hinglish: 'Steno Writing Pad & Voice Dictation',
      bengali: 'স্টেনো ও ভয়েস ডিকটেশন',
      tamil: 'ஸ்டெனோ மற்றும் குரல் ஆணையிடல்',
      telugu: 'స్టెనో & వాయిస్ డిక్టేషన్',
      marathi: 'स्टेनो व व्हॉइस डिक्टेशन',
      gujarati: 'સ્ટેનો અને વૉઇસ ડિક્ટેશન',
      bhojpuri: 'स्टेनो आ आवाज डिक्टेशन'
    },
    actionView: 'steno',
    solution: {
      hindi: `✍️ **स्टेनो व वॉइस डिक्टेशन सहायता:**
1. **बड़ा डिजिटल पैड:** स्टेनो मेनू में '1. स्टेनो वर्णमाला' या '2. डिक्टेशन प्लेयर' खोलें। वहां फुल-स्क्रीन डिजिटल नोटबुक पैड उपलब्ध है।
2. **सटीक लिखाई:** उंगली या स्टाइलस पेन से पैड पर पूरे पेज पर बिना किसी रुकावट के लिखें।
3. **वॉइस डिक्टेशन व ऑडियो अपलोड:** डिक्टेशन टैब में 'प्ले' बटन दबाकर 60 से 120 WPM में ऑडियो सुनकर लिख सकते हैं। आप अपनी कोई भी ऑडियो फाइल (.mp3) या कस्टम टेक्स्ट भी अपलोड करके लाइव अभ्यास कर सकते हैं।`,
      english: `✍️ **Steno & Voice Dictation Guide:**
1. **Expanded Digital Pad:** Open Steno Studio to access the full-width high-precision writing canvas.
2. **Voice Audio Dictation:** Play built-in SSC/High Court passages at 60-120 WPM or upload your own audio file / text.
3. **Accuracy Check:** Transcribe and get instant speed (WPM) and accuracy score reports.`
    }
  },
  {
    id: 'pdf_download',
    icon: '📥',
    title: {
      hindi: 'PDF डाउनलोड व नोट्स सेविंग',
      english: 'PDF Download & Notes Export',
      hinglish: 'PDF Download & Notes Save Kaise Karein',
      bengali: 'PDF ডাউনলোড ও নোটস',
      tamil: 'PDF பதிவிறக்கம் & குறிப்புகள்',
      telugu: 'PDF డౌన్‌లోడ్ & నోట్స్',
      marathi: 'PDF डाउनलोड व नोट्स',
      gujarati: 'PDF ડાઉનલોડ અને નોટ્સ',
      bhojpuri: 'PDF डाउनलोड आ नोट्स सेव'
    },
    actionView: 'chat',
    solution: {
      hindi: `📥 **PDF डाउनलोड करने का तरीका:**
1. चैट में AI द्वारा दिए गए किसी भी उत्तर के नीचे **'📥 PDF डाउनलोड'** बटन पर क्लिक करें।
2. अथवा चैट इनपुट में लिखें **"इस जवाब का PDF बनाओ"** या **"SSC GS Notes PDF"**।
3. Hans Compain तुरंत रंगीन, प्रिंट-रेडी A4 PDF फाइल तैयार करके डाउनलोड कर देगा।`,
      english: `📥 **How to Download PDF Notes:**
1. Click the **'📥 Download PDF'** button located directly beneath any AI response in Chat.
2. Or simply type **"Create PDF for this"** in the chat prompt.
3. Hans Compain formats and downloads a clean, printable study document instantly.`
    }
  },
  {
    id: 'quiz_mistakes',
    icon: '🎯',
    title: {
      hindi: 'क्विज, टेस्ट व मिस्टेक नोटबुक',
      english: 'Quiz, Exams & Mistake Notebook',
      hinglish: 'Daily Quiz & Mistake Notebook',
      bengali: 'কুইজ ও ভুল নোটবুক',
      tamil: 'வினாடிவினா மற்றும் தவறுகள் நோட்புக்',
      telugu: 'క్విజ్ & తప్పుల నోట్‌బుక్',
      marathi: 'क्विझ व मिस्टेक वही',
      gujarati: 'ક્વિઝ અને ભૂલ નોટબુક',
      bhojpuri: 'क्विज टेस्ट आ गलती नोटबुक'
    },
    actionView: 'quiz',
    solution: {
      hindi: `🎯 **क्विज व मिस्टेक नोटबुक सुविधा:**
1. साइडबार से **'क्विज (MCQ Test)'** चुनें और किसी भी विषय का टेस्ट दें।
2. जो सवाल गलत होंगे, वे अपने आप **'Mistake Notebook'** में सेव हो जाते हैं।
3. परीक्षा से पहले आप केवल अपनी गलतियों का दोबारा टेस्ट (Retest) देकर 100% स्कोर हासिल कर सकते हैं।`,
      english: `🎯 **Live Quiz & Mistake Remediation:**
1. Navigate to **'Quiz'** from sidebar and start practicing mock tests by topic or exam.
2. Incorrect answers are automatically cataloged into your **Mistake Notebook**.
3. Use the one-click **Retest Mistakes** button to master weak areas.`
    }
  },
  {
    id: 'voice_reader',
    icon: '🎙️',
    title: {
      hindi: 'वॉइस रीडर व बोलकर याद करना',
      english: 'Audio Book Reader & TTS',
      hinglish: 'Voice Reader & Audio Book',
      bengali: 'ভয়েস রিডার ও অডিও বই',
      tamil: 'குரல் ரீடர் & ஆடியோ புத்தகம்',
      telugu: 'వాయిస్ రీడర్ & ఆడియో బుక్',
      marathi: 'व्हॉइस रीडर व ऑडिओ',
      gujarati: 'વૉઇસ રીડર અને ઑડિયો',
      bhojpuri: 'आवाज से पढ़ल आ सुनल'
    },
    actionView: 'book-reader',
    solution: {
      hindi: `🎙️ **वॉइस रीडर (सुनकर याद करें):**
1. **'ऑडियो बुक्स / वॉइस रीडर'** मेनू खोलें।
2. अपना कोई भी लंबा चैप्टर या पैराग्राफ पेस्ट करें।
3. **'प्ले ऑडियो'** दबाएं। AI स्पष्ट भारतीय आवाज में एक-एक लाइन हाइलाइट करके पढ़कर सुनाएगा।`,
      english: `🎙️ **Voice Reader & Audiobooks:**
1. Open **'Audio Books / Voice Reader'** from the navigation menu.
2. Paste any text, PDF excerpt, or chapter notes.
3. Hit Play to listen in high-definition natural voice with synchronized reading lines.`
    }
  },
  {
    id: 'offline_sync',
    icon: '📶',
    title: {
      hindi: 'ऑफ़लाइन मोड व डेटा बैकअप',
      english: 'Offline Mode & Local Storage',
      hinglish: 'Offline Mode & Data Save',
      bengali: 'অফলাইন মোড',
      tamil: 'ஆஃப்லைன் பயன்முறை',
      telugu: 'ఆఫ్‌లైన్ మోడ్',
      marathi: 'ऑफलाइन मोड',
      gujarati: 'ઑફલાઇન મોડ',
      bhojpuri: 'बिना इंटरनेट ऑफलाइन मोड'
    },
    actionView: 'notes',
    solution: {
      hindi: `📶 **ऑफलाइन इस्तेमाल:**
1. Hans Compain PWA तकनीक से लैस है, इसलिए इंटरनेट न होने पर भी आपके सहेजे गए नोट्स, मिस्टेक डायरी और लोकल फॉर्मूला इंजन चलते रहते हैं।
2. इंटरनेट जुड़ते ही आपका डेटा क्लाउड में सुरक्षित सिंक हो जाता है।`,
      english: `📶 **Offline Capability:**
1. Hans Compain functions as an offline-first PWA. Your saved study records, flash notes, and mistake entries are always accessible without network.
2. Data automatically syncs when connectivity resumes.`
    }
  },
  {
    id: 'science_lab',
    icon: '🔬',
    title: {
      hindi: 'साइंस लैब व 3D फॉर्मूला सिमुलेटर',
      english: 'Science Lab & Formula Calculator',
      hinglish: 'Science Lab & 3D Simulations',
      bengali: 'বিজ্ঞান ল্যাব',
      tamil: 'அறிவியல் ஆய்வகம்',
      telugu: 'సైన్స్ ల్యాబ్',
      marathi: 'सायन्स लॅब सिमुलेटर',
      gujarati: 'સાયન્સ લેબ સિમ્યુલેટર',
      bhojpuri: 'साइंस लैब आ फॉर्मूला'
    },
    actionView: 'science-lab',
    solution: {
      hindi: `🔬 **साइंस लैब सिमुलेटर:**
1. मेनू से **'साइंस लैब'** पर जाएं।
2. ओहम का नियम (Ohm's Law), प्रकाश किरणें (Optics), और सिंपल पेंडुलम को स्लाइडर्स हिलाकर लाइव चलाएं।
3. फॉर्मूलों का लाइव मान तुरंत स्क्रीन पर परिकलित होकर दिखता है।`,
      english: `🔬 **Science & Formula Lab:**
1. Navigate to **'Science Lab'** to access interactive physics & chemistry modules.
2. Experiment with Ohm's law circuits, pendulum physics, and optical lenses with real-time graphs.`
    }
  },
  {
    id: 'time_travel',
    icon: '⏳',
    title: {
      hindi: 'काल-यात्रा AI सिमुलेटर (Time Travel)',
      english: 'Historical AI Time-Travel',
      hinglish: 'Time Travel AI Historical Figures',
      bengali: 'টাইম ট্রাভেল সিমুলেটর',
      tamil: 'நேரப் பயணம் சிமுலேட்டர்',
      telugu: 'టైమ్ ట్రావెల్ సిమ్యులేటర్',
      marathi: 'टाइम ट्रॅव्हल सिमुलेटर',
      gujarati: 'ટાઈમ ટ્રાવેલ સિમ્યુલેટર',
      bhojpuri: 'काल-यात्रा ऐतिहासिक AI'
    },
    actionView: 'time-travel',
    solution: {
      hindi: `⏳ **काल-यात्रा (Time Travel) सिमुलेटर:**
1. **'काल-यात्रा सिमुलेटर'** खोलें।
2. महात्मा गांधी, भगत सिंह, डॉ. बी. आर. आंबेडकर या चाणक्य को चुनें।
3. उनसे सीधे ऐतिहासिक प्रश्न पूछें और उस कालखंड की भाषा व दृष्टिकोण में उत्तर प्राप्त करें।`,
      english: `⏳ **Historical Dialogue Simulator:**
1. Open **'Time Travel'** to interact with iconic historical figures.
2. Ask questions about history, freedom struggles, and philosophical decisions in real-time persona.`
    }
  },
  {
    id: 'general_help',
    icon: '💡',
    title: {
      hindi: 'अन्य कोई सवाल या सुझाव',
      english: 'Other Queries / Direct Ask',
      hinglish: 'Kuchh Aur Poochhein (Ask Anything)',
      bengali: 'অন্যান্য প্রশ্ন',
      tamil: 'பிற கேள்விகள்',
      telugu: 'ఇతర ప్రశ్నలు',
      marathi: 'इतर प्रश्न',
      gujarati: 'અન્ય પ્રશ્નો',
      bhojpuri: 'अउर कवनो सवाल पूछीं'
    },
    solution: {
      hindi: `💡 आप नीचे दिए गए चैट बॉक्स में अपना कोई भी प्रश्न हिंदी, English या अपनी भाषा में लिख सकते हैं। Hans Compain तुरंत समाधान प्रदान करेगा!`,
      english: `💡 Feel free to type any question or issue in the chat box below in your chosen language. Hans Compain will assist you immediately!`
    }
  }
];

export function HansAiHelpGuideModal({
  isOpen,
  onClose,
  language = 'hindi',
  onNavigateToFeature
}: HansAiHelpGuideModalProps) {
  const [selectedLang, setSelectedLang] = useState<string>('hindi');
  const [inputQuery, setInputQuery] = useState('');
  const [isTtsActive, setIsTtsActive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Initialize interactive chat messages
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'msg-init-1',
        sender: 'bot',
        text: '🙏 **नमस्ते! मैं HANS COMPAIN स्मार्ट सहायता केंद्र (A8 Multi-Lingual Assistant) हूँ।**\n\nकृपया नीचे अपनी पसंद की भाषा चुनें और जिस विषय में सहायता चाहिए उस विकल्प पर क्लिक करें, या सीधे नीचे अपना सवाल लिखें:',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  useEffect(() => {
    if (language === 'english') {
      setSelectedLang('english');
    }
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSelectProblem = (category: typeof A8_PROBLEM_CATEGORIES[0]) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: (category.title as any)[selectedLang] || category.title.hindi || category.title.english,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const solutionText = (category.solution as any)[selectedLang] || (selectedLang === 'english' ? category.solution.english : category.solution.hindi);

    const botMsg: ChatMessage = {
      id: `bot-${Date.now() + 1}`,
      sender: 'bot',
      text: solutionText,
      suggestedAction: category.actionView ? {
        label: selectedLang === 'english' ? `Open ${category.title.english}` : `👉 यह फीचर खोलें (${category.title.hindi})`,
        viewName: category.actionView
      } : undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg, botMsg]);
  };

  const handleSendCustomQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const query = inputQuery.trim();
    setInputQuery('');

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    let replyText = '';
    let targetView: string | undefined = undefined;
    const lower = query.toLowerCase();

    // 🛡️ STRICT SECURITY GUARD - Block requests for admin passwords, owner PINs or internal secrets
    if (lower.includes("admin") || lower.includes("एडमिन") || lower.includes("password") || lower.includes("पासवर्ड") || lower.includes("pin") || lower.includes("पिन") || lower.includes("secret") || lower.includes("सीक्रेट") || lower.includes("owner pin")) {
      replyText = `🛡️ **गोपनीयता एवं सुरक्षा नीति (Security Policy):**\n\nयह एआई केवल **HANS COMPAIN** ऐप के उपयोग, फ़ीचर्स (अध्ययन टूल्स, स्टेनो, क्विज़, कॉइन्स व सेटिंग्स) को समझाने के लिए है।\n\n⚠️ **प्रशासकीय (Admin) पासवर्ड, ओनर पिन अथवा सर्वर क्रेडेंशियल्स गोपनीय हैं और शेयर नहीं किए जा सकते।**`;
    } 
    // 📚 REDIRECT GENERAL ACADEMIC STUDY QUESTIONS TO HOME PAGE CHAT
    else if (
      lower.includes("what is") || lower.includes("क्या है") || lower.includes("solve") || lower.includes("हल") || 
      lower.includes("question") || lower.includes("math") || lower.includes("science") || lower.includes("history") || 
      lower.includes("formula") && !lower.includes("lab") || lower.includes("gk") || lower.includes("homework")
    ) {
      replyText = `ℹ️ **ऐप सहायता निर्देशिका:**\n\nयह एआई असिस्टेंट **केवल HANS COMPAIN ऐप के फ़ीचर्स व इस्तेमाल** को समझाने के लिए है।\n\n📚 **पढ़ाई, होमवर्क या किसी प्रश्न का उत्तर पाने के लिए:**\nकृपया होम स्क्रीन पर जाएं और **Main AI Chat (Home Page)** में अपना सवाल पूछें! वहां एआई आपके हर सवाल का हल प्रदान करेगा।`;
      targetView = 'chat';
    }
    // ✍️ STENO STUDIO HELP
    else if (lower.includes("steno") || lower.includes("स्टेनो") || lower.includes("डिक्टेशन") || lower.includes("dictat") || lower.includes("shorthand") || lower.includes("pad")) {
      replyText = `✍️ **स्टेनो व डिक्टेशन स्टूडियो गाइड:**\n\n1. **फुल-साइज डिजिटल पैड:** स्टेनो मेनू में डिजिटल पैड दिया गया है जहां आप उंगली/स्टाइलस से अभ्यास कर सकते हैं।\n2. **वॉइस डिक्टेशन:** 60, 80, 100, 120 WPM पर ऑडियो सुनकर लिख सकते हैं।\n3. **ऑडियो अपलोड:** अपनी ऑडियो (.mp3) या टेक्स्ट अपलोड करके भी डिक्टेशन चला सकते हैं।`;
      targetView = 'steno';
    } 
    // 🪙 COINS & REWARDS HELP
    else if (lower.includes("coin") || lower.includes("कॉइन") || lower.includes("reward") || lower.includes("रिवॉर्ड") || lower.includes("share") || lower.includes("शेयर")) {
      replyText = `🪙 **हंस कॉइन्स व रिवॉर्ड्स गाइड:**\n\n1. **कॉइन्स कैसे कमाएं:** लाइव क्विज़ जीतने, डेली स्टडी स्ट्राइक बनाए रखने और दोस्तों को ऐप शेयर करने पर **+50 कॉइन्स** मिलते हैं।\n2. **बैलेंस देखें:** अपनी प्रोफ़ाइल (Avatar) पर क्लिक करके अपना कॉइन बैलेंस व बैडजेस देख सकते हैं।`;
      targetView = 'profile';
    } 
    // ⚙️ THEME & SETTINGS HELP
    else if (lower.includes("theme") || lower.includes("थीम") || lower.includes("color") || lower.includes("रंग") || lower.includes("font") || lower.includes("फॉन्ट") || lower.includes("lang") || lower.includes("भाषा")) {
      replyText = `⚙️ **थीम, फॉन्ट व भाषा बदलने का तरीका:**\n\n1. टॉप-राइट कॉर्नर में **⚙️ सेटिंग्स** बटन पर क्लिक करें।\n2. **स्क्रीन थीम:** Blue-Green Light Mode, Midnight Dark, Warm Yellow चुन सकते हैं।\n3. **सिस्टम भाषा:** हिंदी या English चुन सकते हैं।\n4. **फॉन्ट साइज़:** चैट का टेक्स्ट साइज़ Normal से Huge तक कर सकते हैं।`;
    } 
    // 🎯 CLASS & EXAM TARGET HELP
    else if (lower.includes("class") || lower.includes("कक्षा") || lower.includes("board") || lower.includes("बोर्ड") || lower.includes("exam") || lower.includes("परीक्षा") || lower.includes("target")) {
      replyText = `🎯 **कक्षा व परीक्षा टारगेट बदलने का तरीका:**\n\n1. **⚙️ सेटिंग्स** खोलें।\n2. सबसे ऊपर **'कक्षा, सेक्शन व परीक्षा चुनें'** बटन पर क्लिक करें।\n3. अपनी बोर्ड कक्षा (10th/12th) या प्रतियोगी परीक्षा (SSC Steno, Railway, CGL) चुनें।`;
    } 
    // 📥 PDF DOWNLOAD HELP
    else if (lower.includes("pdf") || lower.includes("पीडीएफ") || lower.includes("download") || lower.includes("डाउनलोड")) {
      replyText = `📥 **PDF नोट्स डाउनलोड गाइड:**\n\nचैट में किसी भी AI जवाब के नीचे **'📥 PDF डाउनलोड'** बटन पर क्लिक करें। रंगीन व प्रिंट-रेडी PDF फाइल तुरंत डाउनलोड हो जाएगी।`;
      targetView = 'chat';
    } 
    // 🎯 QUIZ & MISTAKE NOTEBOOK HELP
    else if (lower.includes("quiz") || lower.includes("क्विज") || lower.includes("test") || lower.includes("मिस्टेक") || lower.includes("mistake")) {
      replyText = `🎯 **क्विज व मिस्टेक नोटबुक गाइड:**\n\n1. साइडबार मेनू से **'क्विज (MCQ Test)'** खोलें।\n2. गलत हुए सवाल अपने आप **Mistake Notebook** में सेव हो जाते हैं जिनका आप कभी भी रिटेस्ट दे सकते हैं।`;
      targetView = 'quiz';
    } 
    // 🔬 SCIENCE LAB HELP
    else if (lower.includes("lab") || lower.includes("लैब") || lower.includes("science") || lower.includes("विज्ञान") || lower.includes("gis") || lower.includes("earth")) {
      replyText = `🔬 **3D साइंस लैब व GIS अर्थ गाइड:**\n\nसाइडबार मेनू से **3D Science Lab** या **GIS Interactive Earth** खोलकर फिजिक्स, केमिस्ट्री सिमुलेशन और 3D मैप्स देख सकते हैं।`;
      targetView = 'science-lab';
    } 
    // 📱 GENERAL APP HOW-TO
    else {
      replyText = `📱 **HANS COMPAIN ऐप सहायता गाइड:**\n\nयह एआई असिस्टेंट केवल **HANS COMPAIN ऐप के फ़ीचर्स व उपयोग** (जैसे: स्टेनो पैड, ऑनलाइन टेस्ट, कॉइन्स, सेटिंग्स, पीडीएफ) को समझाने के लिए है।\n\n👉 यदि आपको ऐप चलाने में कोई समस्या आ रही है तो नीचे लिखे विकल्प चुनें या सवाल टाइप करें! (पढ़ाई/होमवर्क के लिए Home Page Chat का उपयोग करें)`;
    }

    const botMsg: ChatMessage = {
      id: `bot-${Date.now() + 1}`,
      sender: 'bot',
      text: replyText,
      suggestedAction: targetView ? {
        label: `👉 ${targetView.toUpperCase()} फीचर खोलें`,
        viewName: targetView
      } : undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg, botMsg]);
  };

  const handleSpeakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isTtsActive) {
      window.speechSynthesis.cancel();
      setIsTtsActive(false);
      return;
    }

    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = selectedLang === 'hindi' ? 'hi-IN' : 'en-US';
    utterance.rate = 1.0;
    utterance.onend = () => setIsTtsActive(false);
    utterance.onerror = () => setIsTtsActive(false);

    setIsTtsActive(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-[#080d1a] border-2 border-indigo-500/50 rounded-2xl sm:rounded-3xl w-full max-w-3xl h-[90vh] max-h-[850px] flex flex-col shadow-2xl overflow-hidden text-slate-200">
        
        {/* Header with Language Switcher */}
        <div className="p-3.5 sm:p-4 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-xl shadow-md shrink-0">
              🤖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-1.5">
                  <span>HANS COMPAIN स्मार्ट सहायता एवं निर्देशिका</span>
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-500/30 to-purple-500/30 text-indigo-300 text-[10px] font-black border border-indigo-500/40">
                  A8 Multi-Lang
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                8+ भाषाओं में तुरंत समस्या निवारण व फीचर मार्गदर्शन
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all border-none bg-transparent cursor-pointer shrink-0"
            title="Close Assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-Language Bar */}
        <div className="px-3 py-2 border-b border-slate-800 bg-[#050812] flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400 mr-1 shrink-0">
            <Globe className="w-3.5 h-3.5" />
            <span>भाषा:</span>
          </div>
          {A8_LANGUAGES.map(lang => (
            <button
              key={lang.id}
              onClick={() => setSelectedLang(lang.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all border cursor-pointer flex items-center gap-1 ${
                selectedLang === lang.id
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-sm scale-102'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed shadow-md ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-[#0f172a] border border-slate-800 text-slate-200 rounded-tl-none space-y-3'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Audio Speak button for bot responses */}
                {msg.sender === 'bot' && (
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
                    <button
                      onClick={() => handleSpeakText(msg.text)}
                      className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-bold cursor-pointer bg-transparent border-none p-0"
                    >
                      {isTtsActive ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                      <span>{isTtsActive ? 'आवाज रोकें (Stop)' : 'बोलकर सुनें (Listen)'}</span>
                    </button>
                    <span className="font-mono text-[9px]">{msg.timestamp}</span>
                  </div>
                )}

                {/* Direct Action Button if attached */}
                {msg.suggestedAction && onNavigateToFeature && (
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToFeature(msg.suggestedAction!.viewName);
                    }}
                    className="w-full py-2 px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md mt-2"
                  >
                    <span>{msg.suggestedAction.label}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Quick Problem Category Selection Grid */}
          <div className="bg-[#0b1020] border border-indigo-500/30 rounded-2xl p-3.5 space-y-2.5">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>तुरंत समाधान के लिए समस्या चुनें (Quick Problem Solutions):</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {A8_PROBLEM_CATEGORIES.map(cat => {
                const titleText = (cat.title as any)[selectedLang] || cat.title.hindi || cat.title.english;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectProblem(cat)}
                    className="p-2.5 bg-slate-900/90 hover:bg-indigo-950/70 border border-slate-800 hover:border-indigo-500/50 rounded-xl text-left text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-2.5 transition-all cursor-pointer group shadow-sm active:scale-98"
                  >
                    <span className="text-base shrink-0 group-hover:scale-110 transition-transform">{cat.icon}</span>
                    <span className="line-clamp-1">{titleText}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar for Typing Custom Query */}
        <form
          onSubmit={handleSendCustomQuery}
          className="p-3 border-t border-slate-800 bg-[#060914] flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={
              selectedLang === 'english'
                ? "Type any question or problem in English or Hindi..."
                : "अपनी समस्या या सवाल यहाँ लिखें (जैसे: स्टेनो पैड, PDF, क्विज)..."
            }
            className="flex-1 py-2.5 px-3.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim()}
            className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md disabled:cursor-not-allowed shrink-0"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">पूछें</span>
          </button>
        </form>

      </div>
    </div>
  );
}
