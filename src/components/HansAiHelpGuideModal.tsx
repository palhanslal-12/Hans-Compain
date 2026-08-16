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
3. HansAI तुरंत रंगीन, प्रिंट-रेडी A4 PDF फाइल तैयार करके डाउनलोड कर देगा।`,
      english: `📥 **How to Download PDF Notes:**
1. Click the **'📥 Download PDF'** button located directly beneath any AI response in Chat.
2. Or simply type **"Create PDF for this"** in the chat prompt.
3. HansAI formats and downloads a clean, printable study document instantly.`
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
1. HansAI PWA तकनीक से लैस है, इसलिए इंटरनेट न होने पर भी आपके सहेजे गए नोट्स, मिस्टेक डायरी और लोकल फॉर्मूला इंजन चलते रहते हैं।
2. इंटरनेट जुड़ते ही आपका डेटा क्लाउड में सुरक्षित सिंक हो जाता है।`,
      english: `📶 **Offline Capability:**
1. HansAI functions as an offline-first PWA. Your saved study records, flash notes, and mistake entries are always accessible without network.
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
      hindi: `💡 आप नीचे दिए गए चैट बॉक्स में अपना कोई भी प्रश्न हिंदी, English या अपनी भाषा में लिख सकते हैं। HansAI तुरंत समाधान प्रदान करेगा!`,
      english: `💡 Feel free to type any question or issue in the chat box below in your chosen language. HansAI will assist you immediately!`
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
        text: '🙏 **नमस्ते! मैं HansAI स्मार्ट हेल्प व समाधान सहायक (A8 Multi-Lingual Assistant) हूँ।**\n\nकृपया नीचे अपनी पसंद की भाषा चुनें और जिस विषय में सहायता चाहिए उस विकल्प पर क्लिक करें, या सीधे नीचे अपना सवाल लिखें:',
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

    // Intelligent local matching & response generator
    let replyText = '';
    let targetView: string | undefined = undefined;
    const lower = query.toLowerCase();

    if (lower.includes('steno') || lower.includes('स्टेनो') || lower.includes('डिक्टेशन') || lower.includes('dictat') || lower.includes('shorthand') || lower.includes('pad')) {
      replyText = `✍️ **स्टेनो व डिक्टेशन समाधान:**\n\n1. स्टेनो स्टूडियो में आपके लिए **फुल-साइज डिजिटल पैड** दिया गया है जहां आप बिना रुकावट पूरा पेज लिख सकते हैं।\n2. 'लाइव ऑडियो डिक्टेशन' में 60, 80, 100, 120 WPM पर आवाज में डिक्टेशन सुनकर साथ-साथ लिख सकते हैं।\n3. आप अपना कोई भी ऑडियो फाइल (.mp3) या कस्टम टेक्स्ट भी अपलोड करके अभ्यास कर सकते हैं।`;
      targetView = 'steno';
    } else if (lower.includes('pdf') || lower.includes('पीडीएफ') || lower.includes('download') || lower.includes('डाउनलोड')) {
      replyText = `📥 **PDF डाउनलोड करने का तरीका:**\n\nचैट में किसी भी AI जवाब के नीचे **'📥 PDF डाउनलोड'** बटन दिया गया है। उसपर क्लिक करते ही रंगीन अध्ययन नोट्स तुरंत आपके मोबाइल या कंप्यूटर में डाउनलोड हो जाएंगे।`;
      targetView = 'chat';
    } else if (lower.includes('quiz') || lower.includes('क्विज') || lower.includes('test') || lower.includes('mistake') || lower.includes('गलती')) {
      replyText = `🎯 **क्विज व मिस्टेक नोटबुक:**\n\nक्विज मेनू में हर विषय के लाइव MCQ टेस्ट उपलब्ध हैं। जो सवाल गलत होते हैं वे अपने आप 'Mistake Notebook' में सेव हो जाते हैं जिनका आप कभी भी दोबारा टेस्ट दे सकते हैं।`;
      targetView = 'quiz';
    } else if (lower.includes('voice') || lower.includes('आवाज') || lower.includes('audio') || lower.includes('sound') || lower.includes('बोल')) {
      replyText = `🎙️ **वॉइस व ऑडियो फीचर्स:**\n\n1. चैट में माइक बटन दबाकर बोलकर सवाल पूछ सकते हैं।\n2. हर जवाब के ऊपर '🔊' बटन दबाकर पूरा उत्तर सुन सकते हैं।\n3. 'ऑडियो बुक्स / वॉइस रीडर' में कोई भी लेख पेस्ट करके स्पष्ट आवाज में सुनकर याद कर सकते हैं।`;
      targetView = 'book-reader';
    } else if (lower.includes('science') || lower.includes('विज्ञान') || lower.includes('formula') || lower.includes('लैब')) {
      replyText = `🔬 **साइंस लैब:**\n\nसाइंस लैब में ओहम का नियम, दर्पण/लेंस, पेंडुलम, और फॉर्मूला कैलकुलेटर इंटरएक्टिव 3D सिमुलेशन के साथ उपलब्ध हैं।`;
      targetView = 'science-lab';
    } else {
      replyText = `🤖 **HansAI समाधान:**\n\nआपके प्रश्न **"${query}"** के लिए:\nHansAI के सभी फीचर्स (चैट, स्टेनो, क्विज, नोट्स, पीडीएफ, साइंस लैब, टाइम-ट्रैवल) पूरी तरह सक्रिय हैं। आप साइडबार मेनू से कभी भी किसी भी फीचर पर जा सकते हैं।\n\nक्या आप चाहते हैं कि मैं आपको मुख्य चैट या स्टेनो स्टूडियो पर ले चलूँ?`;
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
                  <span>HansAI A8 स्मार्ट समस्या समाधान असिस्टेंट</span>
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
