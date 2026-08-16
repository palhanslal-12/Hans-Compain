import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  Square, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  FileText, 
  Download, 
  Flame, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  PenTool, 
  TrendingUp, 
  Cpu, 
  Share2, 
  RefreshCw,
  Search,
  ExternalLink,
  ChevronRight,
  Layers,
  Zap,
  Clock,
  ArrowRight
} from 'lucide-react';
import { saveStenoRecordToCloud } from '../lib/firebase';

interface DedicatedStenoMasterStudioProps {
  showToast: (msg: string, type: 'info' | 'success' | 'warn') => void;
  language: 'english' | 'hindi';
  onBackToChat: () => void;
}

// Comprehensive shorthand symbols dictionary with SVG stroke paths & outlines
interface ShorthandSymbol {
  id: string;
  charOrWord: string;
  hindiTranslation: string;
  category: 'consonant' | 'vowel' | 'grammalogue' | 'phrase' | 'court_legal' | 'ssc_special';
  system: 'pitman' | 'hindi_rishi' | 'hindi_manak' | 'gregg';
  strokeType: 'straight_light' | 'straight_heavy' | 'curved_light' | 'curved_heavy' | 'circle' | 'hook' | 'loop';
  direction: string;
  position: 'above_line' | 'on_line' | 'through_line';
  ruleHindi: string;
  ruleEnglish: string;
  svgPath: string;
  strokeWidth: number;
  sampleExample: string;
}

const STENO_DICTIONARY: ShorthandSymbol[] = [
  // Consonants - Pitman / Hindi Rishi
  {
    id: 'st-p',
    charOrWord: 'P / प',
    hindiTranslation: 'प (हल्की रेखा)',
    category: 'consonant',
    system: 'pitman',
    strokeType: 'straight_light',
    direction: 'Downward 120° (ऊपर से नीचे)',
    position: 'on_line',
    ruleHindi: 'ऊपर से नीचे की ओर 120 अंश के कोण पर हल्की सीधी रेखा खींची जाती है।',
    ruleEnglish: 'Light downward straight stroke at 120 degrees angle.',
    svgPath: 'M 35,20 L 65,80',
    strokeWidth: 2.5,
    sampleExample: 'Pay, Pen, पल, पत्र'
  },
  {
    id: 'st-b',
    charOrWord: 'B / ब',
    hindiTranslation: 'ब (गहरी रेखा)',
    category: 'consonant',
    system: 'pitman',
    strokeType: 'straight_heavy',
    direction: 'Downward 120° (ऊपर से नीचे)',
    position: 'on_line',
    ruleHindi: 'ऊपर से नीचे की ओर 120 अंश के कोण पर भारी (मोटी) सीधी रेखा।',
    ruleEnglish: 'Heavy downward straight stroke at 120 degrees angle.',
    svgPath: 'M 35,20 L 65,80',
    strokeWidth: 5.5,
    sampleExample: 'Boy, Book, बल, बालक'
  },
  {
    id: 'st-t',
    charOrWord: 'T / ट / त',
    hindiTranslation: 'ट या त (हल्की लंबवत रेखा)',
    category: 'consonant',
    system: 'pitman',
    strokeType: 'straight_light',
    direction: 'Downward 90° (बिल्कुल सीधा नीचे)',
    position: 'on_line',
    ruleHindi: 'ऊपर से नीचे की ओर 90 अंश के कोण पर लंबवत हल्की सीधी रेखा।',
    ruleEnglish: 'Light downward perpendicular straight stroke at 90 degrees.',
    svgPath: 'M 50,20 L 50,80',
    strokeWidth: 2.5,
    sampleExample: 'Tea, Top, टमटम, तब'
  },
  {
    id: 'st-d',
    charOrWord: 'D / ड / द',
    hindiTranslation: 'ड या द (गहरी लंबवत रेखा)',
    category: 'consonant',
    system: 'pitman',
    strokeType: 'straight_heavy',
    direction: 'Downward 90° (बिल्कुल सीधा नीचे)',
    position: 'on_line',
    ruleHindi: 'ऊपर से नीचे की ओर 90 अंश के कोण पर भारी (गहरी) लंबवत रेखा।',
    ruleEnglish: 'Heavy downward perpendicular straight stroke at 90 degrees.',
    svgPath: 'M 50,20 L 50,80',
    strokeWidth: 5.5,
    sampleExample: 'Day, Door, देश, दीपक'
  },
  {
    id: 'st-ch',
    charOrWord: 'CH / च',
    hindiTranslation: 'च (हल्की तिरछी 60°)',
    category: 'consonant',
    system: 'pitman',
    strokeType: 'straight_light',
    direction: 'Downward 60° (ऊपर-बाएं से नीचे-दाएं)',
    position: 'on_line',
    ruleHindi: 'ऊपर से नीचे 60° कोण पर हल्की तिरछी रेखा।',
    ruleEnglish: 'Light downward straight stroke at 60 degrees.',
    svgPath: 'M 65,20 L 35,80',
    strokeWidth: 2.5,
    sampleExample: 'Chair, Much, चल, चमक'
  },
  {
    id: 'st-j',
    charOrWord: 'J / ज',
    hindiTranslation: 'ज (गहरी तिरछी 60°)',
    category: 'consonant',
    system: 'pitman',
    strokeType: 'straight_heavy',
    direction: 'Downward 60° (ऊपर-बाएं से नीचे-दाएं)',
    position: 'on_line',
    ruleHindi: 'ऊपर से नीचे 60° कोण पर गहरी/मोटी तिरछी रेखा।',
    ruleEnglish: 'Heavy downward straight stroke at 60 degrees.',
    svgPath: 'M 65,20 L 35,80',
    strokeWidth: 5.5,
    sampleExample: 'Judge, Join, जल, जीवन'
  },
  {
    id: 'st-k',
    charOrWord: 'K / क',
    hindiTranslation: 'क (हल्की क्षैतिज रेखा)',
    category: 'consonant',
    system: 'pitman',
    strokeType: 'straight_light',
    direction: 'Horizontal Left to Right (बाएं से दाएं)',
    position: 'on_line',
    ruleHindi: 'कॉपी की लाइन पर बाएं से दाएं हल्की सीधी क्षैतिज रेखा।',
    ruleEnglish: 'Light horizontal stroke from left to right on the line.',
    svgPath: 'M 20,50 L 80,50',
    strokeWidth: 2.5,
    sampleExample: 'King, Key, कर्म, कलम'
  },
  {
    id: 'st-g',
    charOrWord: 'G / ग',
    hindiTranslation: 'ग (गहरी क्षैतिज रेखा)',
    category: 'consonant',
    system: 'pitman',
    strokeType: 'straight_heavy',
    direction: 'Horizontal Left to Right (बाएं से दाएं)',
    position: 'on_line',
    ruleHindi: 'कॉपी की लाइन पर बाएं से दाएं गहरी (मोटी) क्षैतिज रेखा।',
    ruleEnglish: 'Heavy horizontal stroke from left to right on the line.',
    svgPath: 'M 20,50 L 80,50',
    strokeWidth: 5.5,
    sampleExample: 'Go, Give, गगन, गति'
  },
  {
    id: 'st-s',
    charOrWord: 'S / स',
    hindiTranslation: 'स (हल्का वक्र)',
    category: 'consonant',
    system: 'pitman',
    strokeType: 'curved_light',
    direction: 'Downward Curve (बायां चाप)',
    position: 'on_line',
    ruleHindi: 'ऊपर से नीचे की ओर हल्का बायां अर्धचंद्राकार वक्र रेखा।',
    ruleEnglish: 'Light downward left curve stroke.',
    svgPath: 'M 45,20 C 30,40 30,60 45,80',
    strokeWidth: 2.5,
    sampleExample: 'See, Say, समय, सत्य'
  },
  {
    id: 'st-r',
    charOrWord: 'R (Up/Down) / र / ड़',
    hindiTranslation: 'र (ऊर्ध्वगामी व अधोगामी)',
    category: 'consonant',
    system: 'pitman',
    strokeType: 'straight_light',
    direction: 'Upward 30° / Downward Curve',
    position: 'on_line',
    ruleHindi: 'स्वर की स्थिति अनुसार ऊपर की ओर 30° तिरछी रेखा या नीचे वक्र।',
    ruleEnglish: 'Upward straight ray stroke at 30° or downward arc.',
    svgPath: 'M 25,75 L 75,25',
    strokeWidth: 2.5,
    sampleExample: 'Ray, Room, रक्षा, राष्ट्र'
  },
  // Grammalogues & Word-Signs (शब्द-चिह्न)
  {
    id: 'st-the',
    charOrWord: 'The / का / की',
    hindiTranslation: 'The / का, की (शब्द-चिह्न)',
    category: 'grammalogue',
    system: 'pitman',
    strokeType: 'straight_light',
    direction: 'Dot on line or tick',
    position: 'on_line',
    ruleHindi: 'लाइन पर छोटा हल्का बिंदु या तिर्यक टिक जोड़ना।',
    ruleEnglish: 'A small light dot on the line or small joined tick.',
    svgPath: 'M 48,50 A 2,2 0 1,1 52,50 A 2,2 0 1,1 48,50',
    strokeWidth: 4,
    sampleExample: 'The book, Of the, भारत का'
  },
  {
    id: 'st-to',
    charOrWord: 'To / Too / Two / को',
    hindiTranslation: 'To / Too / को',
    category: 'grammalogue',
    system: 'pitman',
    strokeType: 'straight_light',
    direction: 'Short light slant downward',
    position: 'on_line',
    ruleHindi: 'लाइन पर छोटी हल्की 120° की तिर्यक रेखा।',
    ruleEnglish: 'A short light downward slant on the line.',
    svgPath: 'M 40,40 L 60,60',
    strokeWidth: 2.5,
    sampleExample: 'To go, To do, सरकार को'
  },
  {
    id: 'st-court',
    charOrWord: 'High Court / माननीय उच्च न्यायालय',
    hindiTranslation: 'उच्च न्यायालय (कोर्ट वाक्यांश)',
    category: 'court_legal',
    system: 'hindi_rishi',
    strokeType: 'hook',
    direction: 'Interlocking H-C symbol',
    position: 'above_line',
    ruleHindi: 'न्यायालय के फैसलों में त्वरित डिक्टेशन के लिए लाइन के ऊपर एच+सी संयुक्त चिन्ह।',
    ruleEnglish: 'Interlocking high-speed legal phraseogram for courtroom records.',
    svgPath: 'M 30,30 L 30,70 M 30,50 L 55,50 M 55,30 L 55,70 M 60,40 C 75,35 75,65 60,65',
    strokeWidth: 3,
    sampleExample: 'Honorable High Court, न्यायपीठ'
  },
  {
    id: 'st-ssc-govt',
    charOrWord: 'Government of India / भारत सरकार',
    hindiTranslation: 'भारत सरकार (SSC स्पेशल वाक्यांश)',
    category: 'ssc_special',
    system: 'hindi_rishi',
    strokeType: 'hook',
    direction: 'G-V-T contracted outline',
    position: 'on_line',
    ruleHindi: 'भ+स का संक्षिप्त संयुक्त रूप बनाकर "भारत सरकार" का त्वरित वाक्यांश।',
    ruleEnglish: 'Contracted fast phraseogram for administrative dictation.',
    svgPath: 'M 25,60 C 25,35 50,35 50,60 C 50,85 75,85 75,60',
    strokeWidth: 3.5,
    sampleExample: 'भारत सरकार, Gazette of India'
  }
];

// Curated Dictation Drills by WPM Speed
interface DictationPassage {
  id: string;
  title: string;
  wpm: number;
  durationSeconds: number;
  wordCount: number;
  category: 'SSC Grade C' | 'SSC Grade D' | 'High Court' | 'Parliamentary / विधानसभा' | 'Beginner Drills';
  textHindi: string;
  textEnglish: string;
  shorthandTips: string[];
}

const DICTATION_PASSAGES: DictationPassage[] = [
  {
    id: 'dict-1',
    title: 'SSC Stenographer Grade D Mock Test (80 WPM)',
    wpm: 80,
    durationSeconds: 120,
    wordCount: 160,
    category: 'SSC Grade D',
    textHindi: 'महोदय, इस वर्ष हमारे देश में औद्योगिक विकास की गति में तीव्र वृद्धि देखी गई है। ग्रामीण क्षेत्रों में रोजगार के नए अवसर पैदा करने के लिए सरकार ने अनेक कल्याणकारी योजनाओं की शुरुआत की है। कृषि क्षेत्र में आधुनिक तकनीकों का समावेश कर किसानों की आय दोगुनी करने का लक्ष्य रखा गया है। इसके साथ ही देश की अर्थव्यवस्था को नई ऊर्जा देने के लिए लघु एवं मध्यम उद्योगों को विशेष वित्तीय सहायता दी जा रही है। हमें अपने संकल्प पर अडिग रहकर देश को आत्मनिर्भर बनाना होगा।',
    textEnglish: 'Sir, during this financial year, a remarkable growth in industrial development has been observed in our country. The government has initiated several welfare schemes to create employment opportunities in rural areas. Advanced agricultural techniques have been introduced to empower farmers. Small and medium enterprises are receiving dedicated capital support to boost the national economy.',
    shorthandTips: [
      'महोदय के लिए "म" व्यंजन को लाइन के ऊपर रखें।',
      '"औद्योगिक विकास" को एक साथ संयुक्त वाक्यांश (Phraseogram) बनाकर लिखें।',
      'लाइन पर "सरकार" के लिए "स-र" का संक्षिप्त रूप प्रयुक्त करें।'
    ]
  },
  {
    id: 'dict-2',
    title: 'SSC Stenographer Grade C Speed Drill (100 WPM)',
    wpm: 100,
    durationSeconds: 120,
    wordCount: 200,
    category: 'SSC Grade C',
    textHindi: 'अध्यक्ष महोदय, मैं आपका ध्यान देश की शिक्षा प्रणाली और युवाओं के भविष्य की ओर आकर्षित करना चाहता हूँ। आज विश्वभर में सूचना प्रौद्योगिकी और डिजिटल कौशल का महत्व लगातार बढ़ रहा है। हमारे नौजवानों को समय की मांग के अनुसार तकनीकी रूप से दक्ष बनाना हमारी पहली प्राथमिकता होनी चाहिए। जब तक हमारी शिक्षण संस्थाओं में अनुसंधान और नवाचार को बढ़ावा नहीं मिलेगा, तब तक हम वैश्विक स्तर पर अग्रणी स्थान प्राप्त नहीं कर पाएंगे। अतः इस दिशा में ठोस नीतियां बनाई जाएं।',
    textEnglish: 'Mr. Chairman, I wish to draw your attention towards the national education policy and youth empowerment. Information technology and digital literacy are expanding rapidly across the globe. Our top priority must be preparing young minds with modern industrial skills through rigorous scientific research and continuous innovation.',
    shorthandTips: [
      '"अध्यक्ष महोदय" को अधोगामी "ध" के साथ "म" लूप लगाकर एक बार में लिखें।',
      '"सूचना प्रौद्योगिकी" के लिए स-न + प्र-द का संक्षिप्त कट-स्ट्रोक लगाएं।',
      '100 WPM में हाथ को कॉपी से कम से कम उठाएं।'
    ]
  },
  {
    id: 'dict-3',
    title: 'High Court & District Court Legal Shorthand (110 WPM)',
    wpm: 110,
    durationSeconds: 120,
    wordCount: 220,
    category: 'High Court',
    textHindi: 'माननीय उच्च न्यायालय के समक्ष यह याचिका दंड प्रक्रिया संहिता की धारा 482 के अंतर्गत दायर की गई है। अभियोजन पक्ष द्वारा प्रस्तुत साक्ष्यों एवं गवाहों के बयानों का सूक्ष्म परीक्षण करने के उपरांत यह स्पष्ट होता है कि प्रथम सूचना रिपोर्ट में लगाए गए आरोप निराधार एवं दुर्भावनापूर्ण हैं। न्याय के हित में तथा कानून की प्रक्रिया के दुरुपयोग को रोकने के लिए इस न्यायालय द्वारा हस्तक्षेप किया जाना सर्वथा उचित एवं न्यायोचित प्रतीत होता है। अतः याचिका स्वीकार की जाती है।',
    textEnglish: 'This petition has been instituted before the Honorable High Court under Section 482 of the Code of Criminal Procedure. Upon thorough scrutiny of the testimonies and depositions produced by the prosecution, the allegations raised in the First Information Report appear unsubstantiated and malicious.',
    shorthandTips: [
      '"माननीय उच्च न्यायालय" = म + उ + न लाइन काटकर।',
      '"दंड प्रक्रिया संहिता" = द-प्र-स का ट्रिपल कॉन्ट्रैक्शन।',
      'लीगल टर्म्स में पूर्ण विराम के लिए हमेशा छोटा क्रॉस (x) बनाएं।'
    ]
  },
  {
    id: 'dict-4',
    title: 'Parliamentary Debate Speed Master (120+ WPM)',
    wpm: 120,
    durationSeconds: 120,
    wordCount: 240,
    category: 'Parliamentary / विधानसभा',
    textHindi: 'उपाध्यक्ष महोदय, सदन में प्रस्तुत इस महत्वपूर्ण विधेयक पर चर्चा के दौरान पक्ष और विपक्ष दोनों ही पक्षों ने अपने विचार रखे हैं। देश की संप्रभुता, एकता और अखंडता को बनाए रखने के लिए सभी दलों का एकजुट होना आवश्यक है। राष्ट्रीय सुरक्षा के मुद्दे पर किसी भी प्रकार का राजनीतिक मतभेद देशहित में उचित नहीं है। हमें अपनी सीमाओं की सुरक्षा हेतु आधुनिकतम रक्षा उपकरणों से सेना को सुसज्जित करना होगा और विकास की गति को और तेज करना होगा।',
    textEnglish: 'Honorable Deputy Speaker Sir, both treasury and opposition benches have expressed their perspectives on this vital bill. Safeguarding national sovereignty, unity, and border infrastructure necessitates bipartisan commitment without political divergence.',
    shorthandTips: [
      '"उपाध्यक्ष महोदय" = उ + प + म का इंटरलॉकिंग चिन्ह।',
      '"एकता और अखंडता" = ए + ख संयुक्त टिक।',
      '120 WPM पर केवल आउटलाइन के फ्लो पर ध्यान दें, स्पेलिंग दिमाग में ट्रांसक्राइब करते वक्त सोचें।'
    ]
  }
];

export const DedicatedStenoMasterStudio: React.FC<DedicatedStenoMasterStudioProps> = ({
  showToast,
  language,
  onBackToChat
}) => {
  // Tabs: 'lab' (Shorthand Rules & Visual Steno Engine), 'dictation' (Live Audio Speed Drill), 'transcription' (Typing Speed & Error Calculator), 'ai_assistant' (Ask Steno AI)
  const [activeTab, setActiveTab] = useState<'lab' | 'dictation' | 'transcription' | 'ai_assistant'>('lab');

  // Search and Filters for Shorthand Symbols
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSystem, setSelectedSystem] = useState<'all' | 'pitman' | 'hindi_rishi'>('all');
  const [selectedSymbol, setSelectedSymbol] = useState<ShorthandSymbol>(STENO_DICTIONARY[0]);

  // Live Canvas Drawing / Practice Pad state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeColor, setStrokeColor] = useState('#F59E0B');
  const [canvasStrokeWidth, setCanvasStrokeWidth] = useState(3.5);

  // Dictation Player & Audio Speed Synthesizer
  const [selectedPassage, setSelectedPassage] = useState<DictationPassage>(DICTATION_PASSAGES[0]);
  const [isPlayingDictation, setIsPlayingDictation] = useState(false);
  const [dictationWpmMultiplier, setDictationWpmMultiplier] = useState<number>(1.0); // 0.8x, 1.0x, 1.2x
  const [dictationElapsed, setDictationElapsed] = useState<number>(0);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timerIntervalRef = useRef<any>(null);

  // Transcription Test & Evaluation State
  const [typedTranscription, setTypedTranscription] = useState('');
  const [transcriptionResult, setTranscriptionResult] = useState<{
    accuracy: number;
    wpm: number;
    mistakes: string[];
    missingWordsCount: number;
    extraWordsCount: number;
    totalOriginalWords: number;
    totalTypedWords: number;
  } | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // AI Steno Query Assistant
  const [stenoAiInput, setStenoAiInput] = useState('');
  const [stenoAiLoading, setStenoAiLoading] = useState(false);
  const [stenoAiResponses, setStenoAiResponses] = useState<Array<{ q: string; a: string; timestamp: string }>>([
    {
      q: 'हिंदी ऋषि प्रणाली में "भारत सरकार" और "उच्च न्यायालय" को तेजी से कैसे लिखें?',
      a: '📌 **शॉर्टहैंड वाक्यांश नियम (Fast Shorthand Rules):**\n\n1. **भारत सरकार:** "भ" व्यंजन को लाइन के ऊपर थोड़ा लंबा खींचकर उसके अंत में "स" का छोटा वृत्त (Circle) जोड़ें। यह 120 WPM पर बिना हाथ उठाए 0.3 सेकंड में बन जाता है।\n\n2. **उच्च न्यायालय:** "च" को लाइन काटकर (Through the line) बनाएं और उसके साथ "न" का हल्का हुक लगाएं।\n\n💡 **प्रो टिप:** एसएससी स्टेनोग्राफर स्किल टेस्ट में इन वाक्यांशों का अभ्यास रोजाना 20 बार करने से गति में 15 WPM की तुरंत वृद्धि होती है।',
      timestamp: 'Just now'
    }
  ]);

  // Filtered dictionary
  const filteredSymbols = STENO_DICTIONARY.filter(item => {
    const matchesQuery = item.charOrWord.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.hindiTranslation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.sampleExample.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSystem = selectedSystem === 'all' || item.system === selectedSystem;
    return matchesQuery && matchesCategory && matchesSystem;
  });

  // Setup practice canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw notebook steno lines
    ctx.fillStyle = '#060B16';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 1;
    for (let y = 30; y < canvas.height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Red left margin line
    ctx.strokeStyle = '#EF444440';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(35, 0);
    ctx.lineTo(35, canvas.height);
    ctx.stroke();
  }, [activeTab]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#060B16';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 1;
    for (let y = 30; y < canvas.height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    ctx.strokeStyle = '#EF444440';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(35, 0);
    ctx.lineTo(35, canvas.height);
    ctx.stroke();
  };

  const handleStartDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = canvasStrokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setIsDrawing(true);
  };

  const handleDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleStopDrawing = () => {
    setIsDrawing(false);
  };

  // Audio Speech Dictation Synthesizer
  const handleToggleDictation = () => {
    if (isPlayingDictation) {
      window.speechSynthesis.cancel();
      setIsPlayingDictation(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      showToast("Dictation paused.", "info");
      return;
    }

    if (!('speechSynthesis' in window)) {
      showToast("Speech synthesis not supported in this browser.", "warn");
      return;
    }

    window.speechSynthesis.cancel();

    const textToSpeak = language === 'hindi' ? selectedPassage.textHindi : selectedPassage.textEnglish;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    // Calculate speech rate based on WPM
    // Standard speaking rate is ~150 wpm at rate 1.0. 
    // For 80 wpm: rate ~0.75, for 100 wpm: ~0.95, for 120 wpm: ~1.15
    const baseRate = selectedPassage.wpm / 110;
    utterance.rate = Math.min(2.0, Math.max(0.5, baseRate * dictationWpmMultiplier));
    utterance.pitch = 1.0;
    utterance.lang = language === 'hindi' ? 'hi-IN' : 'en-US';

    utterance.onstart = () => {
      setIsPlayingDictation(true);
      setDictationElapsed(0);
      timerIntervalRef.current = setInterval(() => {
        setDictationElapsed(prev => prev + 1);
      }, 1000);
      showToast(`🎙️ Dictation started at ${Math.round(selectedPassage.wpm * dictationWpmMultiplier)} WPM! Write fast on your notepad!`, "success");
    };

    utterance.onend = () => {
      setIsPlayingDictation(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      showToast("✅ Dictation completed! Now proceed to Transcription Tab to test your typing accuracy.", "success");
    };

    utterance.onerror = (e) => {
      console.error("Speech error", e);
      setIsPlayingDictation(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };

    speechUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handleStopDictation = () => {
    window.speechSynthesis.cancel();
    setIsPlayingDictation(false);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setDictationElapsed(0);
  };

  // Evaluate Student's Typed Transcription against Dictated Master Passage
  const handleEvaluateTranscription = () => {
    if (!typedTranscription.trim()) {
      showToast("Please type your transcription before submitting.", "warn");
      return;
    }

    setIsEvaluating(true);

    setTimeout(() => {
      const originalText = language === 'hindi' ? selectedPassage.textHindi : selectedPassage.textEnglish;
      
      // Clean and normalize words
      const cleanOriginalWords = originalText.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim().split(/\s+/);
      const cleanTypedWords = typedTranscription.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim().split(/\s+/);

      let correctCount = 0;
      const mistakesFound: string[] = [];

      cleanOriginalWords.forEach((origWord, idx) => {
        const typedWord = cleanTypedWords[idx];
        if (typedWord && typedWord.toLowerCase() === origWord.toLowerCase()) {
          correctCount++;
        } else {
          mistakesFound.push(`Word #${idx + 1}: Expected "${origWord}", but typed "${typedWord || '[MISSING]'}"`);
        }
      });

      const accuracy = Math.round((correctCount / Math.max(cleanOriginalWords.length, 1)) * 100);
      const approxWpm = Math.round((cleanTypedWords.length / Math.max(dictationElapsed / 60, 1)));

      setTranscriptionResult({
        accuracy: Math.min(100, Math.max(0, accuracy)),
        wpm: approxWpm > 0 ? approxWpm : 35,
        mistakes: mistakesFound.slice(0, 15),
        missingWordsCount: Math.max(0, cleanOriginalWords.length - cleanTypedWords.length),
        extraWordsCount: Math.max(0, cleanTypedWords.length - cleanOriginalWords.length),
        totalOriginalWords: cleanOriginalWords.length,
        totalTypedWords: cleanTypedWords.length
      });

      // Save to Firebase Cloud
      saveStenoRecordToCloud("guest_student", {
        title: selectedPassage.title,
        wpm: approxWpm > 0 ? approxWpm : 35,
        accuracy: Math.min(100, Math.max(0, accuracy)),
        totalWords: cleanTypedWords.length,
        mistakesCount: mistakesFound.length,
        passageSystem: selectedPassage.category
      });

      setIsEvaluating(false);
      showToast(`🎯 Result ready! Accuracy: ${accuracy}% | Errors: ${mistakesFound.length} • Saved to Cloud ☁️`, "success");
    }, 600);
  };

  // AI Shorthand Chatbot Query
  const handleAskStenoAi = async () => {
    if (!stenoAiInput.trim()) return;

    const query = stenoAiInput.trim();
    setStenoAiInput('');
    setStenoAiLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `You are an expert Stenographer Master (शॉर्टहैंड गुरु) specializing in Hindi Pitman, Rishi Parnali, Manak Parnali, Gregg, and SSC Stenographer Grade C & D / High Court skill exams. 
Answer the following steno doubt with exact stroke rules, vowel placement, speed building phraseograms, and practical exam tips in clean structured Hindi & English: "${query}"`,
          model: 'gemini-3.5-flash'
        })
      });

      if (!res.ok) throw new Error("Could not reach AI Steno Teacher");
      const data = await res.json();
      const answer = data.text || data.response || "स्टेनोग्राफी नियम लोड नहीं हो सके। पुनः प्रयास करें।";

      setStenoAiResponses(prev => [
        { q: query, a: answer, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
        ...prev
      ]);
      showToast("✅ Steno Master response received!", "success");
    } catch (err) {
      console.error(err);
      showToast("AI Stenographer offline. Using default guidance.", "warn");
      setStenoAiResponses(prev => [
        { 
          q: query, 
          a: `📌 **स्टेनोग्राफी मार्गदर्शन (Shorthand Master Note):**\n\n"${query}" के लिए:\n- रेखा को हमेशा सही दिशा (Direction) और कोण (Angle) में बनाएं।\n- हल्के व गहरे स्ट्रोक में स्पष्ट अंतर रखें।\n- रोजाना 80 से 100 WPM की डिक्टेशन ऑडियो सुनकर तुरंत टाइप करने का अभ्यास करें।`, 
          timestamp: 'Just now' 
        },
        ...prev
      ]);
    } finally {
      setStenoAiLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6 animate-fade-in text-left text-slate-100 pb-24">
      
      {/* TOP HERO HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-500/30 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-amber-700 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20 shrink-0">
            <PenTool className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {language === 'hindi' ? 'स्टेनो मास्टर प्रो • AI शॉर्टहैंड लैब' : 'Steno Master Studio • AI Shorthand Lab'}
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black uppercase">
                SSC & High Court 2026
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === 'hindi' 
                ? 'शॉर्टहैंड सीखना, 80-120 WPM लाइव ऑडियो डिक्टेशन, डिजिटल प्रैक्टिस पैड व ऑटो एक्यूरेसी इवैल्यूएटर' 
                : 'Learn Pitman/Rishi shorthand, 80-120 WPM live audio dictation drills & transcription evaluation'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={onBackToChat}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>←</span>
            <span>{language === 'hindi' ? 'होम पर लौटें' : 'Back to Home'}</span>
          </button>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'lab', icon: BookOpen, label: language === 'hindi' ? '1. स्टेनो वर्णमाला व नियम' : '1. Shorthand Dictionary & Rules' },
          { id: 'dictation', icon: Volume2, label: language === 'hindi' ? '2. लाइव डिक्टेशन स्पीड प्लेयर' : '2. Live Audio Dictation Player' },
          { id: 'transcription', icon: FileText, label: language === 'hindi' ? '3. टाइपिंग व एक्यूरेसी टेस्ट' : '3. Typing & Accuracy Check' },
          { id: 'ai_assistant', icon: Sparkles, label: language === 'hindi' ? '4. स्टेनो AI गुरु (Ask Doubts)' : '4. AI Shorthand Master' }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20 scale-102'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: SHORTHAND RULES & VISUAL STROKE DICTIONARY */}
      {activeTab === 'lab' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Search & Symbol List (5 Cols) */}
          <div className="lg:col-span-5 bg-[#0A0F1D] border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl flex flex-col h-[680px]">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-400" />
                {language === 'hindi' ? 'शॉर्टहैंड स्ट्रोक डायरेक्टरी' : 'Shorthand Strokes Directory'}
              </h3>
              <span className="text-[10px] text-slate-500 font-mono font-bold">
                {filteredSymbols.length} Outlines
              </span>
            </div>

            {/* Search and Filters */}
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'hindi' ? 'खोजें: प, ब, ट, Court, SSC...' : 'Search letters, words, legal terms...'}
                  className="w-full text-xs py-2 pl-8 pr-3 bg-[#060A14] border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-1">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'consonant', label: 'Consonants (व्यंजन)' },
                  { id: 'grammalogue', label: 'Word-Signs (शब्दचिह्न)' },
                  { id: 'court_legal', label: 'Court Legal (कोर्ट)' },
                  { id: 'ssc_special', label: 'SSC Special' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-900 text-slate-400 border border-slate-850 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable Symbols Grid */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {filteredSymbols.map(sym => {
                const isSelected = selectedSymbol.id === sym.id;
                return (
                  <div
                    key={sym.id}
                    onClick={() => setSelectedSymbol(sym)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-transparent border-amber-500/60 ring-1 ring-amber-500/40'
                        : 'bg-[#060A14] border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Mini SVG Preview */}
                      <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 relative overflow-hidden">
                        <div className="absolute inset-x-0 top-1/2 border-b border-slate-800" />
                        <svg viewBox="0 0 100 100" className="w-10 h-10">
                          <path
                            d={sym.svgPath}
                            fill="none"
                            stroke={isSelected ? '#F59E0B' : '#38BDF8'}
                            strokeWidth={sym.strokeWidth}
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>

                      <div>
                        <div className="text-xs font-black text-white flex items-center gap-1.5">
                          <span>{sym.charOrWord}</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                            {sym.position.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                          {sym.ruleHindi}
                        </p>
                      </div>
                    </div>

                    <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'text-amber-400 translate-x-0.5' : 'text-slate-600'}`} />
                  </div>
                );
              })}
            </div>

          </div>

          {/* Right Column: Detailed Interactive Stroke Viewer & Practice Canvas (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* STROKE MASTER DETAILS CARD */}
            <div className="bg-gradient-to-br from-[#0B1222] via-[#090D16] to-[#0A0E1A] border-2 border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-5">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                    {selectedSymbol.category.toUpperCase()} • {selectedSymbol.system.toUpperCase()} SYSTEM
                  </span>
                  <h2 className="text-xl font-black text-white mt-1">
                    {selectedSymbol.charOrWord} ({selectedSymbol.hindiTranslation})
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono">
                    📐 {selectedSymbol.direction}
                  </span>
                </div>
              </div>

              {/* Visual Stroke Diagram Display */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                
                {/* Visual SVG Blueprint */}
                <div className="relative h-44 rounded-2xl bg-[#03060E] border border-amber-500/30 flex flex-col items-center justify-center overflow-hidden p-4 shadow-inner">
                  {/* Notebook Line Guide */}
                  <div className="absolute inset-x-0 top-1/2 border-b-2 border-amber-500/40" />
                  <span className="absolute right-2 top-[48%] text-[8px] font-mono text-amber-400/60 uppercase">Line of Writing (कॉपी की लाइन)</span>

                  <svg viewBox="0 0 100 100" className="w-28 h-28 relative z-10 filter drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">
                    <path
                      d={selectedSymbol.svgPath}
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth={selectedSymbol.strokeWidth}
                      strokeLinecap="round"
                    />
                  </svg>

                  <div className="absolute bottom-2 left-3 text-[10px] text-slate-400 font-mono">
                    Type: <span className="text-amber-300 font-bold">{selectedSymbol.strokeType.replace('_', ' ')}</span>
                  </div>
                </div>

                {/* Rules & Examples */}
                <div className="space-y-3 bg-[#060A14] border border-slate-800/80 rounded-2xl p-4 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                      📖 नियम (Rules of Formation):
                    </span>
                    <p className="text-slate-200 leading-relaxed font-medium">
                      {selectedSymbol.ruleHindi}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-850">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                      ✨ उदाहरण शब्द (Example Words):
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-200 font-bold inline-block">
                      {selectedSymbol.sampleExample}
                    </span>
                  </div>
                </div>

              </div>

            </div>

            {/* LIVE DIGITAL PRACTICE PAD (CANVAS) */}
            <div className="bg-[#0A0F1D] border border-slate-800 rounded-3xl p-5 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">
                    {language === 'hindi' ? 'डिजिटल स्टेनो अभ्यास पैड (Live Practice Pad)' : 'Digital Shorthand Practice Canvas'}
                  </h3>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                    <button
                      onClick={() => { setStrokeColor('#F59E0B'); setCanvasStrokeWidth(2.5); }}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${canvasStrokeWidth === 2.5 ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}
                    >
                      Light (हल्का)
                    </button>
                    <button
                      onClick={() => { setStrokeColor('#F59E0B'); setCanvasStrokeWidth(5.5); }}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${canvasStrokeWidth === 5.5 ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}
                    >
                      Heavy (गहरा)
                    </button>
                  </div>

                  <button
                    onClick={clearCanvas}
                    className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                </div>
              </div>

              {/* Drawing Canvas Element */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-inner bg-[#060B16]">
                <canvas
                  ref={canvasRef}
                  width={680}
                  height={220}
                  onMouseDown={handleStartDrawing}
                  onMouseMove={handleDraw}
                  onMouseUp={handleStopDrawing}
                  onMouseLeave={handleStopDrawing}
                  onTouchStart={handleStartDrawing}
                  onTouchMove={handleDraw}
                  onTouchEnd={handleStopDrawing}
                  className="w-full h-[220px] cursor-crosshair touch-none"
                />
              </div>
              <p className="text-[10px] text-slate-500 italic text-center">
                👉 माउस या उंगली से ऊपर दिए गए स्ट्रोक का बार-बार अभ्यास करें।
              </p>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: LIVE AUDIO DICTATION SPEED PLAYER */}
      {activeTab === 'dictation' && (
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Passage Chooser & Speed Matrix */}
          <div className="bg-[#0A0F1D] border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                  EXAM DICTATION DRILLS
                </span>
                <h2 className="text-xl font-black text-white mt-1">
                  {language === 'hindi' ? 'लाइव ऑडियो डिक्टेशन प्लेयर (80 to 120 WPM)' : 'Live Audio Speed Dictation Engine'}
                </h2>
              </div>

              {/* WPM Multiplier Pills */}
              <div className="flex items-center gap-1 bg-[#060A14] p-1.5 rounded-2xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 px-2">Speed:</span>
                {[
                  { mult: 0.8, label: '0.8x (Slow)' },
                  { mult: 1.0, label: '1.0x (Standard)' },
                  { mult: 1.2, label: '1.2x (Fast)' }
                ].map(spd => (
                  <button
                    key={spd.mult}
                    onClick={() => {
                      setDictationWpmMultiplier(spd.mult);
                      showToast(`Speed set to ${spd.label}`, "info");
                    }}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold transition-all cursor-pointer ${
                      dictationWpmMultiplier === spd.mult
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {spd.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Passage Selection Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DICTATION_PASSAGES.map(passage => {
                const isSelected = selectedPassage.id === passage.id;
                return (
                  <div
                    key={passage.id}
                    onClick={() => {
                      if (isPlayingDictation) handleStopDictation();
                      setSelectedPassage(passage);
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                      isSelected
                        ? 'bg-gradient-to-br from-amber-500/20 via-orange-950/30 to-slate-900 border-amber-500 ring-2 ring-amber-500/30 shadow-lg'
                        : 'bg-[#060A14] border-slate-850 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-mono text-[9px] font-black uppercase">
                        {passage.category}
                      </span>
                      <span className="text-xs font-black text-amber-400 flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-amber-500" />
                        {Math.round(passage.wpm * dictationWpmMultiplier)} WPM
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{passage.title}</h4>
                      <p className="text-[10px] text-slate-400 line-clamp-2 mt-1">
                        {language === 'hindi' ? passage.textHindi : passage.textEnglish}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[9px] text-slate-500 pt-2 border-t border-slate-850">
                      <span>⏱️ {passage.durationSeconds}s Duration</span>
                      <span>📝 {passage.wordCount} Words</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ACTIVE DICTATION AUDIO CONTROLLER CONSOLE */}
            <div className="bg-gradient-to-br from-[#060A14] via-[#090D18] to-[#040810] border-2 border-amber-500/40 rounded-3xl p-6 text-center space-y-6 shadow-2xl">
              
              <div className="space-y-1.5">
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">
                  NOW LOADED PASSAGE
                </span>
                <h3 className="text-lg font-black text-white">{selectedPassage.title}</h3>
                <div className="flex items-center justify-center gap-3 text-xs font-mono text-slate-400">
                  <span>Speed: <strong className="text-amber-400">{Math.round(selectedPassage.wpm * dictationWpmMultiplier)} WPM</strong></span>
                  <span>•</span>
                  <span>Timer: <strong className="text-emerald-400">{dictationElapsed}s</strong></span>
                </div>
              </div>

              {/* Main Play / Pause Giant Button */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={handleToggleDictation}
                  className={`px-8 py-4 rounded-2xl font-black text-sm transition-all shadow-xl flex items-center gap-3 cursor-pointer ${
                    isPlayingDictation
                      ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                      : 'bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 hover:scale-105'
                  }`}
                >
                  {isPlayingDictation ? (
                    <>
                      <Pause className="w-5 h-5" />
                      <span>Pause Dictation / रोकें</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 fill-current" />
                      <span>Start Live Audio Dictation (डिक्टेशन शुरू करें) 🎙️</span>
                    </>
                  )}
                </button>

                {isPlayingDictation && (
                  <button
                    onClick={handleStopDictation}
                    className="p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
                    title="Stop & Reset"
                  >
                    <Square className="w-5 h-5 fill-current" />
                  </button>
                )}
              </div>

              {/* Pro Shorthand Speed Tips */}
              <div className="bg-[#0B1222] border border-slate-800 rounded-2xl p-4 text-left space-y-2">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  इस डिक्टेशन के लिए खास शॉर्टहैंड ट्रिक्स:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {selectedPassage.shorthandTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* TAB 3: TRANSCRIPTION TYPING & ERROR EVALUATION ENGINE */}
      {activeTab === 'transcription' && (
        <div className="max-w-4xl mx-auto space-y-6">
          
          <div className="bg-[#0A0F1D] border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-2.5 py-0.5 rounded-full border border-emerald-400/20">
                  EXACT EXAM EVALUATION
                </span>
                <h2 className="text-xl font-black text-white mt-1">
                  {language === 'hindi' ? 'शॉर्टहैंड ट्रांसक्रिप्शन व टाइपिंग टेस्ट' : 'Transcription & Typing Accuracy Evaluator'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  डिक्टेशन सुनने के बाद अपनी कॉपी से देखकर यहाँ टाइप करें। AI सिस्टम 1-1 शब्द का मिलान करके गलतियों की गणना करेगा।
                </p>
              </div>
            </div>

            {/* Typing Textarea */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Type your transcription here (यहाँ टाइप करें):</span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {typedTranscription.trim().split(/\s+/).filter(Boolean).length} Words Typed
                </span>
              </label>
              <textarea
                value={typedTranscription}
                onChange={(e) => setTypedTranscription(e.target.value)}
                placeholder={language === 'hindi' ? 'महोदय, इस वर्ष हमारे देश में...' : 'Start typing the transcribed matter...'}
                rows={7}
                className="w-full text-xs sm:text-sm p-4 bg-[#060A14] border border-slate-800 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 leading-relaxed font-sans"
              />
            </div>

            {/* Evaluate Button */}
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setTypedTranscription('')}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 text-xs font-bold transition-all cursor-pointer"
              >
                Clear
              </button>
              <button
                onClick={handleEvaluateTranscription}
                disabled={isEvaluating}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 text-xs font-black transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
              >
                {isEvaluating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Evaluating Accuracy...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Check Accuracy & Mistakes (गलतियां जांचें)</span>
                  </>
                )}
              </button>
            </div>

            {/* EVALUATION REPORT CARD */}
            {transcriptionResult && (
              <div className="bg-gradient-to-br from-[#060A14] to-[#0A0F1D] border-2 border-emerald-500/40 rounded-3xl p-6 space-y-6 shadow-2xl animate-fade-in">
                
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-400" />
                    <span>Evaluation Scorecard (एसएससी फॉर्मेट रिपोर्ट)</span>
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase ${
                    transcriptionResult.accuracy >= 95 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                    transcriptionResult.accuracy >= 85 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                    'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}>
                    {transcriptionResult.accuracy >= 95 ? 'SSC Grade C Qualified 🌟' :
                     transcriptionResult.accuracy >= 90 ? 'SSC Grade D Qualified 🟢' :
                     'Needs Practice ⚠️'}
                  </span>
                </div>

                {/* Score Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Accuracy</span>
                    <span className="text-2xl font-black text-emerald-400 mt-1 block">
                      {transcriptionResult.accuracy}%
                    </span>
                  </div>
                  <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Typing Speed</span>
                    <span className="text-2xl font-black text-amber-400 mt-1 block">
                      {transcriptionResult.wpm} <span className="text-xs font-normal">WPM</span>
                    </span>
                  </div>
                  <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Mistakes</span>
                    <span className="text-2xl font-black text-rose-400 mt-1 block">
                      {transcriptionResult.mistakes.length}
                    </span>
                  </div>
                  <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Word Count</span>
                    <span className="text-2xl font-black text-indigo-400 mt-1 block">
                      {transcriptionResult.totalTypedWords}/{transcriptionResult.totalOriginalWords}
                    </span>
                  </div>
                </div>

                {/* Detailed Mistake Breakdown */}
                {transcriptionResult.mistakes.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">
                      🔍 विस्तृत त्रुटि विश्लेषण (Identified Word Discrepancies):
                    </span>
                    <div className="max-h-48 overflow-y-auto space-y-1.5 bg-[#03060E] border border-slate-800 rounded-2xl p-3 text-xs font-mono">
                      {transcriptionResult.mistakes.map((m, idx) => (
                        <div key={idx} className="text-rose-300 py-0.5 border-b border-slate-850 last:border-0">
                          {m}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>

        </div>
      )}

      {/* TAB 4: ASK AI STENOGRAPHER GURU */}
      {activeTab === 'ai_assistant' && (
        <div className="max-w-4xl mx-auto space-y-6">
          
          <div className="bg-[#0A0F1D] border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                  AI SHORTHAND MENTOR
                </span>
                <h2 className="text-xl font-black text-white mt-1">
                  {language === 'hindi' ? 'स्टेनो AI गुरु • किसी भी शब्द या वाक्यांश का नियम पूछें' : 'Ask AI Shorthand Master'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  ऋषि, मानक या पिटमैन में किसी भी कठिन शब्द, स्वर, आंकड़े या कोर्ट वाक्यांश का सही आउटलाइन नियम तुरंत पूछें।
                </p>
              </div>
            </div>

            {/* Query Input Box */}
            <div className="flex gap-2">
              <input
                type="text"
                value={stenoAiInput}
                onChange={(e) => setStenoAiInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAskStenoAi(); }}
                placeholder={language === 'hindi' ? 'जैसे: "संसदीय कार्यवाही" या "माननीय अध्यक्ष" का संक्षिप्त आउटलाइन कैसे बनाएं?' : 'e.g., How to form outline for Constitutional Assembly?'}
                className="flex-1 text-xs py-3 px-4 bg-[#060A14] border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={handleAskStenoAi}
                disabled={stenoAiLoading}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
              >
                {stenoAiLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{language === 'hindi' ? 'पूछें' : 'Ask Guru'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Preset Quick Doubt Chips */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-500">Quick Queries:</span>
              {[
                'ऋषि प्रणाली में "स" वृत्त के नियम',
                '"भारत सरकार" और "उच्च न्यायालय" वाक्यांश',
                '80 से 100 WPM गति कैसे बढ़ाएं?',
                'पिटमैन में Vowel Interlocking कैसे करें?'
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => { setStenoAiInput(chip); }}
                  className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-300 transition-all cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Feed of Responses */}
            <div className="space-y-4 pt-2">
              {stenoAiResponses.map((item, idx) => (
                <div key={idx} className="bg-[#060A14] border border-slate-850 rounded-2xl p-5 space-y-3 shadow-lg">
                  <div className="flex items-center justify-between border-b border-slate-850 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 font-black text-[10px] flex items-center justify-center">
                        Q
                      </span>
                      <h4 className="text-xs font-black text-white">{item.q}</h4>
                    </div>
                    <span className="text-[9px] text-slate-500 font-mono">{item.timestamp}</span>
                  </div>

                  <div className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-line">
                    {item.a}
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
