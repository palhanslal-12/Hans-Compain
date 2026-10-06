import React, { useState, useEffect, useRef } from 'react';
import {
  Mic2,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Volume2,
  Award,
  BookOpen,
  Keyboard,
  Sparkles,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  FileText,
  Download,
  Bookmark,
  Undo2,
  Upload,
  Search
} from 'lucide-react';
import { recordStudyActivity } from '../firebase';

interface DictationPassage {
  id: string;
  badge: string;
  wpmBadge: string;
  title: string;
  speed: number;
  category: string;
  text: string;
  outlines: { word: string; strokeHint: string; rule: string }[];
}

const passages: DictationPassage[] = [
  {
    id: 'p-beg',
    badge: 'BEGINNER DRILLS',
    wpmBadge: '4800 WPM',
    title: 'Beginner Basics: Vowels & Simple Consonants',
    speed: 60,
    category: 'Rishi & Pitman Basics',
    text: 'अध्यक्ष महोदय, मैं आपका ध्यान इस महत्वपूर्ण विषय की ओर आकर्षित करना चाहता हूँ। हमारे देश में शिक्षा और रोजगार का विकास सबसे पहली प्राथमिकता होनी चाहिए। यदि युवा वर्ग को सही समय पर कौशल प्रशिक्षण मिलेगा तो राष्ट्र तेजी से प्रगति करेगा।',
    outlines: [
      { word: 'अध्यक्ष महोदय', strokeHint: 'अ-ध-य-क्ष + म-ह (संयुक्त चिह्न)', rule: 'संसदीय वाक्यांश (लाइन के ऊपर)' },
      { word: 'महत्वपूर्ण', strokeHint: 'म-ह-त-व (अर्द्धीकरण)', rule: 'विशेषण संक्षिप्त चिह्न' },
      { word: 'प्राथमिकता', strokeHint: 'प्र-थ-म-क-त', rule: 'प्र प्रारंभिक हुक + म + क + ता' },
      { word: 'प्रशिक्षण', strokeHint: 'प्र-श-क्ष-ण', rule: 'श वृत्त + क्ष + ण हुक' }
    ]
  },
  {
    id: 'p-grade-d',
    badge: 'SSC GRADE D',
    wpmBadge: '6400 WPM',
    title: 'SSC Stenographer Grade D Mock Dictation (80 WPM)',
    speed: 80,
    category: 'SSC Grade D (80 WPM)',
    text: 'माननीय सभापति महोदय, आज सदन में जिस आर्थिक विधेयक पर चर्चा हो रही है, वह देश के करोड़ों किसानों और श्रमिकों के हित से जुड़ा हुआ है। सरकार का यह प्रयास रहा है कि ग्रामीण क्षेत्रों में सड़क, बिजली, स्वच्छ जल और डिजिटल बैंकिंग की सुविधा प्रत्येक नागरिक तक बिना किसी भेदभाव के पहुँचे।',
    outlines: [
      { word: 'सभापति महोदय', strokeHint: 'स-भ-प-त + म-ह', rule: 'स वृत्त + भ + प अर्द्धीकरण' },
      { word: 'आर्थिक विधेयक', strokeHint: 'आ-र-थ-क + व-ध-य-क', rule: 'द्विगुणन व संकुचन नियम' },
      { word: 'ग्रामीण क्षेत्रों', strokeHint: 'ग्र-म-ण + क्ष-त्र (बहुवचन बिंदु)', rule: 'ग्र हुक + म + ण' },
      { word: 'डिजिटल बैंकिंग', strokeHint: 'ड-ज-ट-ल + ब-क-ग', rule: 'आधुनिक तकनीकी शब्द-चिह्न' }
    ]
  },
  {
    id: 'p-grade-c',
    badge: 'SSC GRADE C',
    wpmBadge: '8000 WPM',
    title: 'SSC Stenographer Grade C Speed Passage (100 WPM)',
    speed: 100,
    category: 'SSC Grade C (100 WPM)',
    text: 'उपाध्यक्ष महोदय, भारतीय संविधान में नागरिकों को जो मौलिक अधिकार प्रदान किए गए हैं, उनकी रक्षा करना न्यायपालिका का सर्वोच्च कर्तव्य है। आधुनिक युग में सूचना प्रौद्योगिकी और कृत्रिम बुद्धिमत्ता के माध्यम से प्रशासनिक कार्यों में पारदर्शिता तथा समयबद्धता सुनिश्चित की जा रही है।',
    outlines: [
      { word: 'मौलिक अधिकार', strokeHint: 'म-ल-क + अ-ध-क-र', rule: 'संवैधानिक संयुक्त वाक्यांश' },
      { word: 'न्यायपालिका', strokeHint: 'न-य-प-ल-क', rule: 'न + य + प-ल हुक' },
      { word: 'सूचना प्रौद्योगिकी', strokeHint: 'स-च-न + प्र-द-य-ग-क', rule: 'स वृत्त + प्र हुक संकुचन' },
      { word: 'पारदर्शिता', strokeHint: 'प-र-द-र-श-त', rule: 'प-र हुक + द-र द्विगुणन + श वृत्त' }
    ]
  },
  {
    id: 'p-court',
    badge: 'HIGH COURT',
    wpmBadge: '8800 WPM',
    title: 'High Court & District Court Legal Judgment Dictation',
    speed: 100,
    category: 'Legal & Court Steno',
    text: 'विद्वान अधिवक्ता के तर्कों को सुनने तथा पत्रावली पर उपलब्ध साक्ष्यों का सूक्ष्म अवलोकन करने के पश्चात न्यायालय इस निष्कर्ष पर पहुँचता है कि अभियोजन पक्ष द्वारा प्रस्तुत साक्ष्य संदेह से परे सिद्ध होते हैं। अतः अपीलार्थी की याचिका निस्तारित की जाती है।',
    outlines: [
      { word: 'विद्वान अधिवक्ता', strokeHint: 'व-द-व-न + अ-ध-व-क-त', rule: 'न्यायालयीन मानक वाक्यांश' },
      { word: 'पत्रावली', strokeHint: 'प-त्र-व-ल-ई', rule: 'त्र चाप + व + ल' },
      { word: 'अभियोजन पक्ष', strokeHint: 'अ-भ-य-ज-न + प-क्ष', rule: 'न हुक + प-क्ष संकुचन' },
      { word: 'निस्तारित', strokeHint: 'न-स-त-र-त', rule: 'स्त लूप + र अर्द्धीकरण' }
    ]
  },
  {
    id: 'p-parl',
    badge: 'PARLIAMENTARY / विधानसभा',
    wpmBadge: '9600 WPM',
    title: 'Parliamentary Debate Speed Dictation (120 WPM)',
    speed: 120,
    category: 'Lok Sabha & Vidhan Sabha',
    text: 'महोदय, अंतर्राष्ट्रीय स्तर पर बदलती हुई परिस्थितियों में भारत ने अपनी स्वतंत्र विदेश नीति और आत्मनिर्भर रक्षा उत्पादन के बल पर विश्व पटल पर एक सशक्त पहचान स्थापित की है। अंतरिक्ष अनुसंधान और हरित ऊर्जा के क्षेत्र में हमारे वैज्ञानिकों की उपलब्धि सराहनीय है।',
    outlines: [
      { word: 'अंतर्राष्ट्रीय स्तर', strokeHint: 'अं-त-र (द्विगुणन) + स्त-र लूप', rule: 'द्विगुणन सिद्धांत' },
      { word: 'आत्मनिर्भर', strokeHint: 'आ-त-म + न-र-भ-र', rule: 'संयुक्त शब्द-चिह्न' }
    ]
  }
];

interface SavedStenoPage {
  id: string;
  title: string;
  timestamp: string;
  dataUrl: string;
}

export const DedicatedStenoMasterStudio: React.FC<{ onBackHome?: () => void }> = ({ onBackHome }) => {
  const [activeTab, setActiveTab] = useState<'pad' | 'dictionary' | 'syllabus' | 'player' | 'typing'>('pad');
  const [dictationSourceTab, setDictationSourceTab] = useState<'preset' | 'custom' | 'upload'>('preset');
  const [selectedPassageId, setSelectedPassageId] = useState<string>('p-grade-d');
  const [selectedWpm, setSelectedWpm] = useState<number>(80);
  const [customPassageText, setCustomPassageText] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [showReferenceText, setShowReferenceText] = useState<boolean>(false);

  // Canvas Steno Pad state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [strokeWidth, setStrokeWidth] = useState<number>(3.5);
  const [strokeColor, setStrokeColor] = useState<string>('#FACC15');
  const [isEraser, setIsEraser] = useState<boolean>(false);
  const [historyDataUrls, setHistoryDataUrls] = useState<string[]>([]);
  const [savedPages, setSavedPages] = useState<SavedStenoPage[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('hans_steno_saved_pages') || '[]');
    } catch {
      return [];
    }
  });

  // Typing & Accuracy Test state
  const [typedText, setTypedText] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [dictSearch, setDictSearch] = useState<string>('');

  const currentPassage = passages.find(p => p.id === selectedPassageId) || passages[1];
  const activeDictationText =
    dictationSourceTab === 'custom' && customPassageText.trim()
      ? customPassageText.trim()
      : currentPassage.text;

  // Initialize Canvas with Steno Notebook ruling lines
  const drawNotebookLines = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = '#050914';
    ctx.fillRect(0, 0, width, height);

    // Horizontal ruled steno lines
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 1;
    for (let y = 45; y < height; y += 42) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Left vertical red margin line
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(48, 0);
    ctx.lineTo(48, height);
    ctx.stroke();

    // Center vertical steno column divider
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawNotebookLines(ctx, canvas.width, canvas.height);
    setHistoryDataUrls([canvas.toDataURL()]);
  }, [activeTab]);

  // Timer for dictation & typing
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const getPointerPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      const touch = e.touches[0] || e.changedTouches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getPointerPos(e);
    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const drawStroke = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getPointerPos(e);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = isEraser ? 18 : strokeWidth;
    ctx.strokeStyle = isEraser ? '#050914' : strokeColor;

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    setHistoryDataUrls(prev => [...prev.slice(-15), canvas.toDataURL()]);
  };

  const handleUndo = () => {
    if (historyDataUrls.length <= 1) return;
    const nextHistory = historyDataUrls.slice(0, -1);
    const lastUrl = nextHistory[nextHistory.length - 1];
    setHistoryDataUrls(nextHistory);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = lastUrl;
  };

  const handleClearPad = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawNotebookLines(ctx, canvas.width, canvas.height);
    setHistoryDataUrls([canvas.toDataURL()]);
  };

  const handleSavePadPage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const newPage: SavedStenoPage = {
      id: `page-${Date.now()}`,
      title: `${currentPassage.badge} (${selectedWpm} WPM) - पेज #${savedPages.length + 1}`,
      timestamp: new Date().toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' }),
      dataUrl: canvas.toDataURL('image/png')
    };
    const updated = [newPage, ...savedPages];
    setSavedPages(updated);
    try {
      localStorage.setItem('hans_steno_saved_pages', JSON.stringify(updated.slice(0, 10)));
    } catch {
      // ignore quota
    }
    recordStudyActivity('steno', newPage.title, 'शॉर्टहैंड प्रैक्टिस पैड पेज सुरक्षित किया गया।', 100);
  };

  const handleLoadSavedPage = (page: SavedStenoPage) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = page.dataUrl;
  };

  const handleDownloadPad = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `HansCompain_StenoPad_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const toggleDictationAudio = () => {
    if (!('speechSynthesis' in window)) return;
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(activeDictationText);
      utter.lang = 'hi-IN';
      utter.rate = selectedWpm === 60 ? 0.78 : selectedWpm === 80 ? 0.92 : selectedWpm === 100 ? 1.08 : 1.22;
      utter.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utter);
      setIsPlaying(true);
    }
  };

  // Typing evaluation
  const targetWords = activeDictationText.trim().split(/\s+/);
  const typedWords = typedText.trim() ? typedText.trim().split(/\s+/) : [];
  let correctCount = 0;
  typedWords.forEach((w, i) => {
    if (targetWords[i] && w.replace(/[।,]/g, '') === targetWords[i].replace(/[।,]/g, '')) {
      correctCount++;
    }
  });
  const accuracy = typedWords.length > 0 ? Math.round((correctCount / typedWords.length) * 100) : 100;
  const wpm = elapsedSeconds > 0 ? Math.round((typedWords.length / elapsedSeconds) * 60) : 0;

  return (
    <div className="w-full space-y-4 animate-fade-in pb-12">
      {/* 1. TOP BANNER MATCHING SCREENSHOT 18 */}
      <div className="bg-gradient-to-r from-[#071A3E] via-[#0A224E] to-[#071633] border border-cyan-500/30 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-2xl shadow-lg shrink-0">
            ✍️
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg sm:text-2xl font-black text-white tracking-wide uppercase">
                ALL STENOGRAPHER
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[10px] sm:text-xs font-bold">
                सम्पूर्ण आशुलिपि, डिक्टेशन व एग्जाम हब
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              सभी स्ट्रोक व वर्णमाला (ऋषि, मानक, पिटमैन), डिजिटल पैड, लाइव ऑडियो डिक्टेशन, एग्जाम सिलेबस व AI स्पीड टेस्ट
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('syllabus')}
            className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <BookOpen className="w-4 h-4" />
            <span>एग्जाम सिलेबस बॉक्स</span>
          </button>
          {onBackHome && (
            <button
              onClick={onBackHome}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs cursor-pointer"
            >
              ← मुख्य चैट पर लौटें
            </button>
          )}
        </div>
      </div>

      {/* 2. 3 EASY STEPS GUIDE BOX MATCHING SCREENSHOT 18 */}
      <div className="bg-[#061126] border border-cyan-500/25 rounded-3xl p-4 sm:p-5 space-y-3">
        <div className="text-xs font-black text-cyan-300 flex items-center gap-2">
          <span>📚 स्टेनो गाइड: सीखने के 3 आसान कदम (3 EASY STEPS)</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div
            onClick={() => setActiveTab('dictionary')}
            className="p-3.5 rounded-2xl bg-[#040B1A] border border-cyan-900/60 hover:border-cyan-500/50 cursor-pointer transition-all space-y-1"
          >
            <div className="text-xs font-black text-cyan-400">1. वर्णमाला व स्ट्रोक सीखें (Learn Strokes)</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              टैब 2 &apos;स्ट्रोक विजुअलाइज़र व डिक्शनरी&apos; पर जाएं। यहाँ हिन्दी ऋषि/मानक व पिटमैन प्रणाली के अक्षरों के सटीक आरेख और नियम खोजें व अभ्यास करें।
            </p>
          </div>
          <div
            onClick={() => setActiveTab('pad')}
            className="p-3.5 rounded-2xl bg-[#040B1A] border border-blue-900/60 hover:border-blue-500/50 cursor-pointer transition-all space-y-1"
          >
            <div className="text-xs font-black text-blue-400">2. डिक्टेशन सुनें व लिखें (Listen &amp; Dictate)</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              टैब 1 &apos;डिजिटल पैड&apos; या टैब 4 पर जाएं। अपनी मनपसंद स्पीड (60, 80 या 100 WPM) का ऑडियो चलाएं और लाइव राइटिंग पैड पर त्वरित स्ट्रोक लिखें।
            </p>
          </div>
          <div
            onClick={() => setActiveTab('typing')}
            className="p-3.5 rounded-2xl bg-[#040B1A] border border-emerald-900/60 hover:border-emerald-500/50 cursor-pointer transition-all space-y-1"
          >
            <div className="text-xs font-black text-emerald-400">3. टाइपिंग व त्रुटि जांच (Transcribe &amp; Score)</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              टैब 5 &apos;टाइपिंग व एक्यूरेसी टेस्ट&apos; में अपनी लिखी शॉर्टहैंड को सामान्य हिंदी/अंग्रेजी में टाइप करें। AI आपकी सटीकता व गलतियों का विश्लेषण करेगा।
            </p>
          </div>
        </div>
      </div>

      {/* 3. 5 MODULE TABS RIBBON MATCHING SCREENSHOT 18 */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {[
          { id: 'pad' as const, label: '✍️ 1. डिजिटल पैड व डिक्टेशन' },
          { id: 'dictionary' as const, label: '🔍 2. स्ट्रोक विजुअलाइज़र व डिक्शनरी' },
          { id: 'syllabus' as const, label: '📋 3. एग्जाम सिलेबस बॉक्स' },
          { id: 'player' as const, label: '🔊 4. डिक्टेशन स्पीड प्लेयर' },
          { id: 'typing' as const, label: '⚡ 5. टाइपिंग व एक्यूरेसी टेस्ट' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap cursor-pointer transition-all border ${
              activeTab === t.id
                ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-lg'
                : 'bg-[#091122] text-slate-300 border-slate-800 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Pro Tip Bar */}
      <div className="px-4 py-2.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200 flex items-center gap-2">
        <span>💡 <strong>प्रो टिप (Pro Tip):</strong> बेहतरीन शॉर्टहैंड स्पीड और एक्यूरेसी के लिए उंगली (Finger) के बजाय <strong>Touch Stylus (Pen)</strong> का इस्तेमाल करें! लैपटॉप या टैबलेट पर यह एकदम असली स्टेनो डायरी जैसा अनुभव देगा।</span>
      </div>

      {/* =====================================================================
          TAB 1 & TAB 4: DIGITAL STENO PAD & AUDIO DICTATION STUDIO
      ===================================================================== */}
      {(activeTab === 'pad' || activeTab === 'player') && (
        <div className="space-y-5">
          {/* Dictation Passage & Speed Selector Card */}
          <div className="bg-[#091122] border border-amber-500/30 rounded-3xl p-4 sm:p-6 space-y-4 shadow-xl">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setDictationSourceTab('preset')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-all ${
                  dictationSourceTab === 'preset'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'bg-slate-950 text-slate-300 border border-slate-800'
                }`}
              >
                🎖️ SSC/कोर्ट डिक्टेशन पैसेज
              </button>
              <button
                onClick={() => setDictationSourceTab('custom')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  dictationSourceTab === 'custom'
                    ? 'bg-amber-500 text-slate-950 font-black shadow'
                    : 'bg-slate-950 text-slate-300 border border-slate-800'
                }`}
              >
                📄 कस्टम टेक्स्ट पेस्ट करें
              </button>
              <label className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-950/60 border border-indigo-500/40 text-indigo-200 cursor-pointer flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                <span>📁 डिवाइस से ऑडियो (.MP3/.WAV) चुनें</span>
                <input type="file" accept="audio/*" className="hidden" />
              </label>
            </div>

            {/* WPM Speed Selector */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-400 font-bold">गति:</span>
              {[60, 80, 100, 120].map(spd => (
                <button
                  key={spd}
                  onClick={() => setSelectedWpm(spd)}
                  className={`px-3 py-1 rounded-lg text-xs font-black cursor-pointer transition-all ${
                    selectedWpm === spd
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-950 border border-slate-800 text-slate-300'
                  }`}
                >
                  {spd} WPM
                </button>
              ))}
            </div>

            {dictationSourceTab === 'custom' ? (
              <textarea
                value={customPassageText}
                onChange={e => setCustomPassageText(e.target.value)}
                rows={3}
                placeholder="अपना खुद का डिक्टेशन गद्यांश यहाँ पेस्ट करें..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs sm:text-sm text-white outline-none focus:border-amber-400"
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {passages.map(p => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedPassageId(p.id);
                      setSelectedWpm(p.speed);
                    }}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      selectedPassageId === p.id
                        ? 'bg-amber-950/30 border-amber-500 text-white shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-black mb-1">
                      <span className="text-amber-400">{p.badge}</span>
                      <span className="text-slate-300">{p.wpmBadge}</span>
                    </div>
                    <div className="text-xs font-bold truncate">{p.title}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Play Dictation Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleDictationAudio}
                  className={`px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-lg transition-all ${
                    isPlaying
                      ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950'
                  }`}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isPlaying ? 'डिक्टेशन रोकें (Pause)' : 'डिक्टेशन सुनें व पैड पर लिखें (Play) 🎙️'}</span>
                </button>
                <span className="text-xs font-mono text-slate-300">
                  ⏱️ समय: <strong className="text-emerald-400">{elapsedSeconds}s</strong> • गति: <strong className="text-amber-400">{selectedWpm} WPM</strong>
                </span>
              </div>

              <button
                onClick={() => setShowReferenceText(!showReferenceText)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
              >
                {showReferenceText ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showReferenceText ? 'टेक्स्ट छुपाएं' : 'टेक्स्ट देखें'}</span>
              </button>
            </div>

            {showReferenceText && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed animate-fade-in">
                {activeDictationText}
              </div>
            )}
          </div>

          {/* 1:1 ACCURATE SHORTHAND DRAWING PAD MATCHING SCREENSHOT 18 */}
          <div className="bg-[#091122] border-2 border-amber-500/30 rounded-3xl p-4 sm:p-6 space-y-4 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs sm:text-sm font-black text-amber-300 flex items-center gap-2">
                <span>✍️ पूर्ण डिजिटल स्टेनो कॉपी (1:1 ACCURATE SHORTHAND PAD)</span>
              </div>

              {/* Pen Weight & Color Controls */}
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { label: 'हल्का (Light 2px)', width: 2 },
                  { label: 'सामान्य (3.5px)', width: 3.5 },
                  { label: 'गहरा (Heavy 6px)', width: 6 }
                ].map(pw => (
                  <button
                    key={pw.label}
                    onClick={() => {
                      setIsEraser(false);
                      setStrokeWidth(pw.width);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer border ${
                      !isEraser && strokeWidth === pw.width
                        ? 'bg-amber-500 text-slate-950 border-amber-300 font-black'
                        : 'bg-slate-950 border-slate-800 text-slate-300'
                    }`}
                  >
                    {pw.label}
                  </button>
                ))}

                <button
                  onClick={() => setIsEraser(true)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer border ${
                    isEraser
                      ? 'bg-rose-600 text-white border-rose-400 font-black'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  रबर (Eraser)
                </button>

                {/* 5 Ink Colors */}
                <div className="flex items-center gap-1.5 px-2">
                  {['#FACC15', '#22D3EE', '#F8FAFC', '#60A5FA', '#F472B6'].map(col => (
                    <button
                      key={col}
                      onClick={() => {
                        setIsEraser(false);
                        setStrokeColor(col);
                      }}
                      className={`w-5 h-5 rounded-full cursor-pointer border-2 ${
                        !isEraser && strokeColor === col ? 'border-white scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: col }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleUndo}
                className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
                title="Undo Last Stroke"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleClearPad}
                className="px-3.5 py-1.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 hover:text-white text-xs font-bold cursor-pointer"
              >
                ↻ नया पेज
              </button>
              <button
                onClick={handleSavePadPage}
                className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>पैड में सुरक्षित करें</span>
              </button>
              <button
                onClick={handleDownloadPad}
                className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
                title="Download Shorthand Sheet"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

            {/* Interactive Canvas */}
            <div className="rounded-2xl overflow-hidden border-2 border-slate-800 bg-[#050914] shadow-inner">
              <canvas
                ref={canvasRef}
                width={1000}
                height={460}
                onMouseDown={startDrawing}
                onMouseMove={drawStroke}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={drawStroke}
                onTouchEnd={stopDrawing}
                className="w-full h-[360px] sm:h-[440px] cursor-crosshair touch-none"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>✍️ पूरे पेज पर कहीं भी लिखें (बाएं से दाएं बिना किसी ऑफसेट के)। उंगली या स्टाइलस पेन समर्थित है।</span>
              <span className="text-amber-400 font-mono">1:1 High-Precision Vector Mapping</span>
            </div>
          </div>

          {/* Saved Steno Pages Notebook */}
          <div className="bg-[#091122] border border-slate-800 rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-white">📓 मेरे सुरक्षित स्टेनो पेज (पैड नोटबुक)</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-black">
                  {savedPages.length} Pages Saved
                </span>
              </div>
            </div>

            {savedPages.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-950 border border-slate-850 text-center space-y-2">
                <div className="text-2xl">✍️</div>
                <div className="text-xs font-bold text-white">अभी कोई पेज सुरक्षित नहीं है</div>
                <p className="text-[11px] text-slate-400">
                  पैड पर शॉर्टहैंड लिखने के बाद ऊपर &quot;पैड में सुरक्षित करें&quot; बटन दबाएं। आपका काम सीधे इसी पैड में सेव रहेगा।
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {savedPages.map(page => (
                  <div
                    key={page.id}
                    onClick={() => handleLoadSavedPage(page)}
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-400 cursor-pointer space-y-2 transition-all"
                  >
                    <img src={page.dataUrl} alt={page.title} className="w-full h-28 object-cover rounded-xl border border-slate-800" />
                    <div className="text-xs font-bold text-white truncate">{page.title}</div>
                    <div className="text-[10px] text-slate-400">{page.timestamp} • क्लिक करके पैड पर खोलें</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: STROKE VISUALIZER & SHORTHAND DICTIONARY
      ===================================================================== */}
      {activeTab === 'dictionary' && (
        <div className="bg-[#091122] border border-cyan-500/30 rounded-3xl p-5 sm:p-6 space-y-5 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                🔍 ऋषि एवं पिटमैन प्रणाली स्ट्रोक विजुअलाइज़र व शब्द-चिह्न डिक्शनरी
              </h2>
              <p className="text-xs text-slate-400">कठिन संसदीय और न्यायालयीन शब्दों के संक्षिप्त रेखाक्षर (Outlines) व नियम</p>
            </div>
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
              <Search className="w-4 h-4 text-cyan-400" />
              <input
                type="text"
                value={dictSearch}
                onChange={e => setDictSearch(e.target.value)}
                placeholder="शब्द-चिह्न खोजें..."
                className="bg-transparent border-none outline-none text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {passages
              .flatMap(p => p.outlines)
              .filter(o => !dictSearch || o.word.includes(dictSearch) || o.rule.includes(dictSearch))
              .map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-amber-300">{item.word}</span>
                    <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/60 px-2.5 py-0.5 rounded-lg border border-cyan-500/30">
                      {item.strokeHint}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">नियम: {item.rule}</p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: STENOGRAPHER EXAM SYLLABUS BOX
      ===================================================================== */}
      {activeTab === 'syllabus' && (
        <div className="bg-[#091122] border border-cyan-500/30 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
          <h2 className="text-base sm:text-lg font-black text-white">
            📋 SSC Stenographer Grade C &amp; D, High Court एवं बिहार बेल्ट्रॉन सिलेबस
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-black text-cyan-400">1. English Language (100 Marks)</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Voice (10 Qs), Narration (10 Qs), Cloze Test (20 Qs), Reading Comprehension (15 Qs), Error Spotting &amp; Vocab.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-black text-amber-400">2. Reasoning &amp; GA (50 + 50 Marks)</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Coding-Decoding, Analogy, Syllogism, Current Affairs, Polity, History &amp; General Science.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-black text-emerald-400">3. Skill Test (80 / 100 WPM)</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                10 मिनट ऑडियो डिक्टेशन (800 / 1000 शब्द) + कंप्यूटर पर हिंदी (मंगल/कृतिदेव) या अंग्रेजी ट्रांसक्रिप्शन।
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 5: TRANSCRIPTION TYPING & ACCURACY TEST
      ===================================================================== */}
      {activeTab === 'typing' && (
        <div className="bg-[#091122] border border-emerald-500/30 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                ⚡ लाइव ट्रांसक्रिप्शन टाइपिंग एवं सटीकता जांच (WPM &amp; Error Evaluator)
              </h2>
              <p className="text-xs text-slate-400">अपनी शॉर्टहैंड कॉपी से पढ़कर नीचे बॉक्स में टाइप करें</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 font-bold">
                गति: {wpm} WPM
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-300 font-bold">
                सटीकता: {accuracy}%
              </span>
            </div>
          </div>

          <textarea
            value={typedText}
            onChange={e => setTypedText(e.target.value)}
            rows={7}
            placeholder="अपनी लिखी गई शॉर्टहैंड का अनुवाद यहाँ टाइप करें..."
            className="w-full bg-slate-950 border-2 border-slate-800 focus:border-emerald-400 rounded-2xl p-4 text-sm text-white outline-none leading-relaxed"
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setTypedText('');
                setIsSubmitted(false);
              }}
              className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 cursor-pointer"
            >
              रीसेट करें
            </button>
            <button
              onClick={() => {
                setIsSubmitted(true);
                recordStudyActivity('steno', currentPassage.title, `WPM: ${wpm}, Accuracy: ${accuracy}%`, accuracy);
              }}
              className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs cursor-pointer shadow"
            >
              रिजल्ट व त्रुटि जांचें
            </button>
          </div>

          {isSubmitted && (
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-xs sm:text-sm text-slate-200 space-y-1">
              <div className="font-black text-emerald-300">
                ✓ ट्रांसक्रिप्शन परिणाम: {correctCount} सही शब्द / {typedWords.length} कुल टाइप किए गए शब्द ({accuracy}% सटीकता)
              </div>
              <p className="text-xs text-slate-400">मानक गद्यांश: {activeDictationText}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
