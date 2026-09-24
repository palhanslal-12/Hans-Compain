import React, { useState, useEffect, useRef } from 'react';
import {
  Share2, Heart, Volume2, VolumeX, ChevronDown, ChevronUp,
  Bookmark, Sparkles, Maximize2, Minimize2, AlertCircle,
  Search, RefreshCw, Zap, ArrowRight, BookOpen, CheckCircle2
} from 'lucide-react';
import { speakText, stopAllSpeech } from '../utils/speechUtils';
import { MistakeNotebookItem, QuizQuestion } from '../types';

export interface Reel {
  id: string;
  category: 'mistake' | 'search' | 'board' | 'science' | 'history' | 'polity' | 'geography' | 'ca' | 'steno';
  categoryLabel: string;
  question: string;
  answer: string;
  fact: string;
  userWrongPick?: string;
  boardSource?: string;
  bgColor: string;
  likes: number;
  rawQuestionObj?: QuizQuestion;
}

const STATIC_FOUNDATION_REELS: Reel[] = [
  {
    id: 'r1',
    category: 'board',
    categoryLabel: 'Bihar Board 10th 🌾',
    question: 'प्रकाश संश्लेषण (Photosynthesis) की प्रक्रिया के लिए आवश्यक चार मुख्य घटक कौन से हैं?',
    answer: 'सूर्य का प्रकाश, क्लोरोफिल, कार्बन डाइऑक्साइड (CO₂) तथा जल (H₂O)',
    fact: 'प्रो. दास गुप्ता भारती भवन अनुसार: क्लोरोफिल सूर्य के प्रकाश की सौर ऊर्जा को अवशोषित कर रासायनिक ऊर्जा (ATP/NADPH) में रूपांतरित करता है।',
    boardSource: 'BSEB 2024 Annual Exam Top Question',
    bgColor: 'from-amber-900 via-stone-900 to-emerald-950',
    likes: 1420
  },
  {
    id: 'r2',
    category: 'science',
    categoryLabel: 'Science Formula 🔬',
    question: 'ओम का नियम (Ohm\'s Law) क्या है और इसका गणितीय सूत्र क्या होता है?',
    answer: 'V = I × R (विभवांतर = विद्युत धारा × प्रतिरोध)',
    fact: 'यदि चालक की भौतिक अवस्थाएं (जैसे तापमान, लंबाई) स्थिर रहें, तो उसके सिरों पर आरोपित विभवांतर उसमें प्रवाहित धारा के समानुपाती होता है।',
    boardSource: 'CBSE Class 10 Physics Hotspot',
    bgColor: 'from-blue-900 via-slate-900 to-indigo-950',
    likes: 2180
  },
  {
    id: 'r3',
    category: 'board',
    categoryLabel: 'UP Board 12th 🏛️',
    question: 'विद्युत क्षेत्र की तीव्रता (Electric Field Intensity) का S.I. मात्रक क्या होता है?',
    answer: 'न्यूटन/कूलॉम (N/C) अथवा वोल्ट/मीटर (V/m)',
    fact: 'यह एक सदिश राशि (Vector Quantity) है जिसकी दिशा परीक्षण धन आवेश पर लगने वाले स्थिरवैद्युत बल की दिशा में होती है।',
    boardSource: 'UP Board Physics 2023 Code 822-AZ',
    bgColor: 'from-purple-900 via-slate-900 to-fuchsia-950',
    likes: 980
  },
  {
    id: 'r4',
    category: 'history',
    categoryLabel: 'History PYQ 📜',
    question: 'दिल्ली सल्तनत की पहली और एकमात्र महिला मुस्लिम शासिका कौन थीं?',
    answer: 'रज़िया सुल्तान (Razia Sultana)',
    fact: 'इन्होंने 1236 से 1240 ई. तक शासन किया। वे सुल्तान इल्तुतमिश की योग्य पुत्री थीं जिन्होंने लाल वस्त्र पहनकर न्याय मांगा था।',
    boardSource: 'SSC CGL / Railway NTPC Hotspot',
    bgColor: 'from-orange-950 via-red-950 to-stone-900',
    likes: 3100
  },
  {
    id: 'r5',
    category: 'polity',
    categoryLabel: 'Indian Polity ⚖️',
    question: 'भारतीय संविधान की प्रारूप समिति (Drafting Committee) के अध्यक्ष कौन थे?',
    answer: 'डॉ. भीमराव अम्बेडकर (Dr. B. R. Ambedkar)',
    fact: 'इस समिति का गठन 29 अगस्त 1947 को हुआ था और इसमें कुल 7 सदस्य थे। 26 नवंबर 1949 को संविधान अंगीकृत किया गया।',
    boardSource: 'Competitive Exams & Civics Core',
    bgColor: 'from-indigo-900 via-slate-900 to-cyan-950',
    likes: 4250
  },
  {
    id: 'r6',
    category: 'geography',
    categoryLabel: 'Geography 🌍',
    question: 'विश्व की सबसे लंबी नदी कौन सी है और इसकी कुल लंबाई कितनी है?',
    answer: 'नील नदी (Nile River) — लगभग 6,650 किमी',
    fact: 'यह अफ़्रीका महाद्वीप के विक्टोरिया झील से निकलकर भूमध्य सागर में गिरती है और 11 देशों से होकर बहती है।',
    boardSource: 'Class 9/10 Social Science & GK',
    bgColor: 'from-teal-950 via-emerald-900 to-slate-900',
    likes: 1890
  },
  {
    id: 'r7',
    category: 'ca',
    categoryLabel: 'Current Affairs 📰',
    question: 'UPI का पूर्ण रूप (Full Form) क्या है और इसे किस संस्था ने विकसित किया है?',
    answer: 'Unified Payments Interface (NPCI द्वारा विकसित)',
    fact: 'NPCI (National Payments Corporation of India) ने इसे वर्ष 2016 में भारतीय रिजर्व बैंक (RBI) के मार्गदर्शन में लॉन्च किया था।',
    boardSource: 'Current Affairs 2026 Special',
    bgColor: 'from-pink-950 via-rose-900 to-purple-950',
    likes: 2760
  },
  {
    id: 'r8',
    category: 'steno',
    categoryLabel: 'Steno & Pitman ✍️',
    question: 'पिटमैन आशुलिपि (Pitman Shorthand) में P और B स्ट्रोक में क्या मुख्य अंतर होता है?',
    answer: 'P हल्का स्ट्रोक (Light Stroke) और B गहरा स्ट्रोक (Heavy Dark Stroke) होता है।',
    fact: 'दोनों 60 डिग्री के कोण पर ऊपर से नीचे (Downward) लिखे जाते हैं। P अघोष और B सघोष ध्वनि को प्रदर्शित करता है।',
    boardSource: 'Hans Compain Steno Lab Special',
    bgColor: 'from-amber-950 via-stone-900 to-yellow-950',
    likes: 3890
  }
];

export const EduReelsView: React.FC<{ 
  language?: 'hindi' | 'english';
  studentGoalProfile?: any | null;
  mistakeNotebook?: MistakeNotebookItem[];
  onStartRetestFromMistake?: (questions: QuizQuestion[], title: string) => void;
  onAskAiDoubt?: (topic: string) => void;
}> = ({
  language = 'hindi',
  studentGoalProfile,
  mistakeNotebook = [],
  onStartRetestFromMistake,
  onAskAiDoubt
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [bookmarkedMap, setBookmarkedMap] = useState<Record<string, boolean>>({});
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [dynamicReels, setDynamicReels] = useState<Reel[]>([]);
  const [quickSearchInput, setQuickSearchInput] = useState('');
  const [isGeneratingInstantReel, setIsGeneratingInstantReel] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isHindi = language === 'hindi';

  // 1. EXTRACT REAL MISTAKES FROM LOCAL STORAGE & PROPS
  const loadStudentMistakesAndSearches = () => {
    let localMistakes: MistakeNotebookItem[] = [];
    try {
      const saved = localStorage.getItem('hans-compain-mistake-notebook');
      if (saved) {
        localMistakes = JSON.parse(saved);
      }
    } catch {}

    const allMistakes = [...(mistakeNotebook || []), ...localMistakes].reduce((acc, curr) => {
      if (!acc.some(m => m.question === curr.question)) acc.push(curr);
      return acc;
    }, [] as MistakeNotebookItem[]);

    // Convert Mistakes into interactive 1-minute flash reels
    const mistakeReels: Reel[] = allMistakes.slice(0, 15).map((m, idx) => {
      const userWrong = m.userAnswerText || (m.options && m.userAnswerIndex !== undefined && m.options[m.userAnswerIndex]) || 'गलत उत्तर';
      const rightAns = m.correctAnswerText || (m.options && m.correctAnswerIndex !== undefined && m.options[m.correctAnswerIndex]) || 'सही उत्तर';

      const quizQObj: QuizQuestion = {
        question: m.question,
        options: m.options && m.options.length >= 2 ? m.options : [rightAns, userWrong, 'इनमें से कोई नहीं', 'उपरोक्त दोनों'],
        answerIndex: m.correctAnswerIndex ?? 0,
        explanation: m.explanation || 'परीक्षा में यह प्रश्न बार-बार दोहराया जाता है।',
        hint: m.hint || 'उत्तर पर विचार करें'
      };

      return {
        id: `reel-mistake-${idx}-${Date.now()}`,
        category: 'mistake' as const,
        categoryLabel: `⚠️ आपकी टेस्ट की गलती • ${m.subject || 'Test Review'}`,
        question: m.question,
        answer: rightAns,
        userWrongPick: userWrong,
        fact: m.explanation || m.hint || 'इस प्रश्न पर आपकी टेस्ट में गलती हुई थी। मुख्य अवधारणा को पुनः याद करें!',
        boardSource: `आपके पिछले टेस्ट से री-विजिट (${m.subject || 'गलत प्रश्न'})`,
        bgColor: 'from-rose-950 via-slate-950 to-amber-950',
        likes: 850 + idx * 45,
        rawQuestionObj: quizQObj
      };
    });

    // 2. EXTRACT RECENT SEARCHES & NOTES
    const searchReels: Reel[] = [];
    try {
      const savedChats = localStorage.getItem('hans-compain-saved-chats');
      if (savedChats) {
        const chats = JSON.parse(savedChats);
        if (Array.isArray(chats)) {
          chats.slice(0, 5).forEach((c, cIdx) => {
            const topic = c.title || 'सर्च किया गया विषय';
            if (topic.length > 5) {
              searchReels.push({
                id: `reel-search-${cIdx}-${Date.now()}`,
                category: 'search' as const,
                categoryLabel: `🔍 आपके सर्च से • ${topic.slice(0, 24)}...`,
                question: `${topic} के प्रमुख परीक्षा बिंदु व सारांश:`,
                answer: `इस विषय के मुख्य तथ्य आपके चैट सत्र में सहेजे गए हैं।`,
                fact: `हंस-एआई द्वारा विश्लेषण: परीक्षा दृष्टिकोण से इस टॉपिक से बहुविकल्पीय एवं लघु उत्तरीय प्रश्न पूछे जाते हैं।`,
                boardSource: `हालिया सर्च हिस्ट्री (${new Date(c.timestamp || Date.now()).toLocaleDateString('hi-IN')})`,
                bgColor: 'from-cyan-950 via-slate-900 to-indigo-950',
                likes: 1200 + cIdx * 30
              });
            }
          });
        }
      }

      const savedNotes = localStorage.getItem('hans-compain-notes');
      if (savedNotes) {
        const notes = JSON.parse(savedNotes);
        if (Array.isArray(notes)) {
          notes.slice(0, 4).forEach((n, nIdx) => {
            if (n.title && n.content) {
              searchReels.push({
                id: `reel-note-${nIdx}-${Date.now()}`,
                category: 'search' as const,
                categoryLabel: `📚 आपके स्टडी नोट्स • ${n.title.slice(0, 20)}`,
                question: `${n.title}: मुख्य रिवीजन कैप्सूल`,
                answer: n.content.slice(0, 95) + (n.content.length > 95 ? '...' : ''),
                fact: `यह बिंदु आपने अपनी स्टडी डायरी में नोट किया था। त्वरित 1-मिनट दोहराव के लिए तैयार।`,
                boardSource: `आपकी स्टडी नोटबुक (${n.folderId || 'Notes'})`,
                bgColor: 'from-emerald-950 via-slate-900 to-blue-950',
                likes: 950 + nIdx * 60
              });
            }
          });
        }
      }
    } catch {}

    // Combine Mistake Reels at the VERY TOP + Search Reels + Base Curriculum Reels
    const combined = [...mistakeReels, ...searchReels, ...STATIC_FOUNDATION_REELS];
    setDynamicReels(combined);
  };

  useEffect(() => {
    loadStudentMistakesAndSearches();
  }, [mistakeNotebook]);

  // AI CONTEXT-AWARE SMART FILTERING
  const goalStream = studentGoalProfile?.stream; // 'board' or 'competitive'
  const targetExam = studentGoalProfile?.competitiveDetails?.targetExam || '';

  const contextFilteredReels = dynamicReels.filter((r) => {
    // Always show personal mistakes and searches
    if (r.category === 'mistake' || r.category === 'search') return true;

    if (goalStream === 'board') {
      if (r.category === 'steno') return false;
      return true;
    }
    if (goalStream === 'competitive' && targetExam.toLowerCase().includes('steno')) {
      if (r.category === 'steno' || r.category === 'ca' || r.category === 'history' || r.category === 'polity') return true;
      return false;
    }
    return true;
  });

  const filteredReels = contextFilteredReels.filter(
    (r) => activeCategory === 'all' || r.category === activeCategory
  );

  useEffect(() => {
    setActiveIndex(0);
    stopAllSpeech();
    setIsPlayingAudio(false);
  }, [activeCategory]);

  const currentReel = filteredReels[activeIndex] || filteredReels[0];

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const height = containerRef.current.clientHeight;
    const scrollPosition = e.currentTarget.scrollTop;
    const index = Math.round(scrollPosition / height);
    if (index !== activeIndex && index >= 0 && index < filteredReels.length) {
      setActiveIndex(index);
      stopAllSpeech();
      setIsPlayingAudio(false);
    }
  };

  const toggleAudio = () => {
    if (isPlayingAudio) {
      stopAllSpeech();
      setIsPlayingAudio(false);
    } else {
      if (!currentReel) return;
      const text = isHindi
        ? `विषय: ${currentReel.categoryLabel}. प्रश्न: ${currentReel.question}. सही उत्तर: ${currentReel.answer}. मुख्य तथ्य: ${currentReel.fact}`
        : `Category: ${currentReel.categoryLabel}. Question: ${currentReel.question}. Correct Answer: ${currentReel.answer}. Key Note: ${currentReel.fact}`;
      
      speakText(text, isHindi ? 'hi-IN' : 'en-US');
      setIsPlayingAudio(true);
    }
  };

  const handleLike = (id: string) => {
    setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleBookmark = (reel: Reel) => {
    setBookmarkedMap((prev) => ({ ...prev, [reel.id]: !prev[reel.id] }));
    try {
      const saved = localStorage.getItem('hans-compain-mistake-notebook');
      const curList: MistakeNotebookItem[] = saved ? JSON.parse(saved) : [];
      if (!curList.some(m => m.question === reel.question)) {
        curList.push({
          id: `bookmarked-reel-${Date.now()}`,
          question: reel.question,
          options: [reel.answer, 'अन्य विकल्प A', 'अन्य विकल्प B', 'अन्य विकल्प C'],
          correctAnswerIndex: 0,
          userAnswerIndex: -1,
          explanation: reel.fact,
          subject: reel.categoryLabel,
          timestamp: new Date().toLocaleDateString('hi-IN'),
          attemptCount: 1,
          mastered: false
        });
        localStorage.setItem('hans-compain-mistake-notebook', JSON.stringify(curList));
      }
    } catch {}
  };

  const scrollToNext = () => {
    if (!containerRef.current) return;
    const height = containerRef.current.clientHeight;
    containerRef.current.scrollBy({ top: height, behavior: 'smooth' });
  };

  const scrollToPrev = () => {
    if (!containerRef.current) return;
    const height = containerRef.current.clientHeight;
    containerRef.current.scrollBy({ top: -height, behavior: 'smooth' });
  };

  // Instant Reel Generator from custom search query
  const handleGenerateInstantReel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickSearchInput.trim()) return;

    setIsGeneratingInstantReel(true);
    const topic = quickSearchInput.trim();

    setTimeout(() => {
      const newCustomReel: Reel = {
        id: `reel-instant-${Date.now()}`,
        category: 'search',
        categoryLabel: `✨ आपके द्वारा खोजा गया: ${topic.slice(0, 18)}`,
        question: `${topic} से संबंधित सबसे महत्वपूर्ण बोर्ड व परीक्षा प्रश्न क्या है?`,
        answer: `${topic} का मूल सिद्धांत एवं मुख्य परिभाषा।`,
        fact: `हंस-एआई कैप्सूल: ${topic} पर गहन अभ्यास के लिए चैट या PYQ वॉल्ट में 100 प्रश्नों का टेस्ट दें!`,
        boardSource: 'Hans Compain Instant Knowledge Short',
        bgColor: 'from-amber-950 via-indigo-950 to-slate-900',
        likes: 1540
      };

      setDynamicReels(prev => [newCustomReel, ...prev]);
      setActiveCategory('all');
      setActiveIndex(0);
      setQuickSearchInput('');
      setIsGeneratingInstantReel(false);
    }, 600);
  };

  const mistakeCount = dynamicReels.filter(r => r.category === 'mistake').length;
  const searchCount = dynamicReels.filter(r => r.category === 'search').length;

  return (
    <div className={`w-full ${isFullScreen ? 'fixed inset-0 z-50 bg-black' : 'h-[calc(100vh-5rem)] md:h-[88vh]'} bg-slate-950 text-white relative overflow-hidden flex flex-col items-center justify-between`}>
      
      {/* TOP HEADER & SEARCH / FILTER BAR */}
      <div className="w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800 p-2 sm:p-3 z-30 flex flex-col gap-2 shadow-lg">
        
        {/* Row 1: Title, Mistake Count Badge, Full Screen */}
        <div className="flex items-center justify-between px-2 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="p-1.5 rounded-lg bg-gradient-to-r from-red-500 to-amber-500 text-white font-black text-xs shrink-0 shadow-md">
              ⚡ SHORT REELS
            </span>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-extrabold text-white truncate flex items-center gap-1.5">
                <span>{isHindi ? 'एजु-रील्स (Edu Shorts)' : 'Edu Reels - Exam Shorts'}</span>
              </h3>
              <p className="text-[10px] text-slate-400 hidden xs:block truncate">
                {isHindi ? 'आपकी गलतियों, हालिया सर्च व पढ़े गए विषयों पर आधारित' : 'Personalized from your quiz mistakes, searches & notes'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                loadStudentMistakesAndSearches();
              }}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs flex items-center gap-1 border border-slate-700 cursor-pointer"
              title="रील्स रीफ्रेश करें"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline text-[11px] font-bold">रीफ्रेश</span>
            </button>

            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs flex items-center gap-1 border border-slate-700 cursor-pointer"
              title="Full Screen Toggle"
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              <span className="hidden sm:inline text-[11px] font-bold">{isFullScreen ? 'Exit' : 'Full Screen'}</span>
            </button>
          </div>
        </div>

        {/* Row 2: Quick Search / Convert Query into Reel Input Bar */}
        <form onSubmit={handleGenerateInstantReel} className="flex items-center gap-1.5 px-1">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={quickSearchInput}
              onChange={(e) => setQuickSearchInput(e.target.value)}
              placeholder={isHindi ? "कोई भी टॉपिक सर्च करें या रील बनाएं (जैसे: 1857 की क्रांति, Ohm's law, विद्युत)..." : "Search any topic to generate instant short reel..."}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all font-medium"
            />
          </div>
          <button
            type="submit"
            disabled={isGeneratingInstantReel || !quickSearchInput.trim()}
            className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-40 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center gap-1 shrink-0 cursor-pointer transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
            <span>{isGeneratingInstantReel ? 'बन रहा है...' : (isHindi ? 'रील बनाएं' : 'Make Reel')}</span>
          </button>
        </form>

        {/* Row 3: Category Pills (Mistakes, Searches, Board, Science, etc.) */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide text-xs pb-0.5 px-1">
          {[
            { id: 'all', label: `🔥 सभी रील्स (${filteredReels.length})` },
            { id: 'mistake', label: `⚠️ मेरी गलतियां (${mistakeCount})`, highlight: mistakeCount > 0 },
            { id: 'search', label: `🔍 मेरे सर्च व नोट्स (${searchCount})` },
            { id: 'board', label: '🎓 बोर्ड परीक्षा (10th/12th)' },
            { id: 'science', label: '🔬 विज्ञान व सूत्र' },
            { id: 'history', label: '🏛️ इतिहास व PYQ' },
            { id: 'polity', label: '⚖️ संविधान' },
            { id: 'ca', label: '📰 करेंट अफेयर्स' },
            { id: 'steno', label: '✍️ स्टेनो लैब' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1 rounded-full whitespace-nowrap font-bold transition-all text-[11px] cursor-pointer flex items-center gap-1 ${
                activeCategory === cat.id
                  ? 'bg-amber-400 text-slate-950 shadow-md scale-105 font-black'
                  : cat.highlight
                  ? 'bg-rose-950/80 text-rose-300 border border-rose-500/50 hover:bg-rose-900'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* REELS VIEWPORT CAROUSEL */}
      <div className="w-full flex-1 relative flex justify-center items-center overflow-hidden">
        {filteredReels.length === 0 ? (
          <div className="p-8 text-center space-y-4 max-w-md my-auto">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-3xl">
              🎯
            </div>
            <h4 className="text-base font-black text-white">
              {activeCategory === 'mistake' 
                ? (isHindi ? 'अभी कोई गलत प्रश्न दर्ज नहीं है!' : 'No mistake questions logged yet!')
                : (isHindi ? 'इस श्रेणी में कोई रील नहीं मिली।' : 'No reels found in this category.')}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {activeCategory === 'mistake'
                ? (isHindi ? 'जैसे ही आप किसी टेस्ट या क्विज़ में किसी प्रश्न का गलत उत्तर देंगे, वह स्वतः यहाँ 1-मिनट की रील बनकर रिवीजन के लिए आ जाएगा।' : 'As soon as you attempt any quiz and mark a question wrong, it automatically generates a 1-minute reel here.')
                : (isHindi ? 'ऊपर सर्च बार में कोई भी टॉपिक लिखकर "रील बनाएं" बटन दबाएं।' : 'Type any topic in the search bar above to generate a reel.')}
            </p>
            <button
              onClick={() => setActiveCategory('all')}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs cursor-pointer shadow-lg"
            >
              🔥 सभी रील्स देखें
            </button>
          </div>
        ) : (
          <div 
            ref={containerRef}
            onScroll={handleScroll}
            className="w-full max-w-2xl h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide relative bg-slate-900 shadow-2xl"
            style={{ scrollBehavior: 'smooth' }}
          >
            {filteredReels.map((reel, idx) => {
              const isLiked = !!likedMap[reel.id];
              const isBookmarked = !!bookmarkedMap[reel.id];
              const isMistakeReel = reel.category === 'mistake';

              return (
                <div 
                  key={reel.id} 
                  className={`w-full h-full snap-start snap-always relative flex flex-col justify-between items-center p-4 sm:p-8 bg-gradient-to-br ${reel.bgColor}`}
                >
                  {/* TOP TAG & SOURCE */}
                  <div className="w-full flex items-center justify-between z-20 pt-2 gap-2 flex-wrap">
                    <span className={`px-3 py-1 rounded-full backdrop-blur-md border text-xs font-black tracking-wide shadow-lg flex items-center gap-1.5 ${
                      isMistakeReel 
                        ? 'bg-rose-950/80 border-rose-500/60 text-rose-200 animate-pulse'
                        : 'bg-black/60 border-white/20 text-amber-300'
                    }`}>
                      {isMistakeReel && <AlertCircle className="w-3.5 h-3.5 text-rose-400" />}
                      <span>{reel.categoryLabel}</span>
                    </span>

                    {reel.boardSource && (
                      <span className="px-2.5 py-0.5 bg-white/10 backdrop-blur-md rounded-md text-[10px] font-bold text-emerald-300 border border-emerald-400/30 truncate max-w-[200px]">
                        {reel.boardSource}
                      </span>
                    )}
                  </div>

                  {/* MAIN CONTENT CARD */}
                  <div className="w-full text-center space-y-4 my-auto relative z-10 px-2 sm:px-6">
                    
                    {/* IF MISTAKE REEL: SHOW YOUR PREVIOUS WRONG PICK */}
                    {reel.userWrongPick && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-950/70 border border-rose-500/40 rounded-full text-[11px] font-bold text-rose-300 shadow-md">
                        <span>❌ आपके टेस्ट में चयन:</span>
                        <span className="line-through text-rose-200">{reel.userWrongPick}</span>
                      </div>
                    )}

                    {/* QUESTION */}
                    <h2 className="text-lg sm:text-2xl md:text-3xl font-black leading-snug drop-shadow-2xl text-white tracking-wide">
                      {reel.question}
                    </h2>
                    
                    {/* CORRECT ANSWER BOX */}
                    <div className="p-3.5 sm:p-5 bg-black/50 backdrop-blur-xl rounded-2xl border border-amber-400/40 shadow-2xl space-y-1">
                      <span className="text-[10px] sm:text-xs uppercase tracking-widest font-extrabold text-amber-400 block flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>✓ Correct Answer / सही उत्तर</span>
                      </span>
                      <p className="text-base sm:text-2xl font-black text-yellow-300 leading-tight">
                        {reel.answer}
                      </p>
                    </div>
                    
                    {/* FACT / EXAMINER NOTE */}
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 border-l-4 border-amber-400 text-left text-xs sm:text-sm font-medium text-slate-100 leading-relaxed shadow-lg space-y-1">
                      <span className="font-extrabold text-amber-300 text-xs block">
                        📌 {isMistakeReel ? 'सुधार विश्लेषण (Concept Correction):' : 'Exam Key Note:'}
                      </span>
                      <p>{reel.fact}</p>
                    </div>

                    {/* RE-TEST THIS SPECIFIC QUESTION BUTTON */}
                    {reel.rawQuestionObj && onStartRetestFromMistake && (
                      <button
                        onClick={() => {
                          onStartRetestFromMistake([reel.rawQuestionObj!], `Mistake Retest: ${reel.question.slice(0, 30)}`);
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-1.5 mx-auto cursor-pointer active:scale-95 transition-all"
                      >
                        <Zap className="w-3.5 h-3.5 fill-slate-950" />
                        <span>🎯 इस प्रश्न का पुनः टेस्ट दें (Re-test This Question)</span>
                      </button>
                    )}

                    {onAskAiDoubt && (
                      <button
                        onClick={() => onAskAiDoubt(reel.question)}
                        className="text-[11px] text-cyan-300 hover:text-cyan-200 underline font-semibold cursor-pointer block mx-auto"
                      >
                        💬 इस विषय पर हंस-एआई से और विस्तार से पूछें
                      </button>
                    )}
                  </div>

                  {/* ACTION SIDEBAR */}
                  <div className="absolute right-3 sm:right-6 bottom-20 flex flex-col items-center gap-4 z-20">
                    {/* LIKE BUTTON */}
                    <button 
                      onClick={() => handleLike(reel.id)}
                      className="p-3 bg-black/60 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 hover:scale-110 transition-all group flex flex-col items-center gap-1 shadow-xl cursor-pointer"
                    >
                      <Heart className={`w-5 h-5 sm:w-6 sm:h-6 ${isLiked ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                      <span className="text-[10px] font-bold text-white/80">
                        {reel.likes + (isLiked ? 1 : 0)}
                      </span>
                    </button>

                    {/* VOICE AUDIO READER BUTTON */}
                    <button 
                      onClick={toggleAudio}
                      className={`p-3 backdrop-blur-md rounded-full border hover:scale-110 transition-all flex flex-col items-center gap-1 shadow-xl cursor-pointer ${
                        isPlayingAudio && idx === activeIndex
                          ? 'bg-amber-500 border-amber-300 text-slate-950 animate-pulse'
                          : 'bg-black/60 border-white/20 text-white hover:bg-white/20'
                      }`}
                      title="Audio Voice Reader"
                    >
                      {isPlayingAudio && idx === activeIndex ? <VolumeX className="w-5 h-5 sm:w-6 sm:h-6" /> : <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />}
                      <span className="text-[10px] font-bold text-white/80">Voice</span>
                    </button>

                    {/* BOOKMARK TO MISTAKE NOTEBOOK */}
                    <button 
                      onClick={() => handleBookmark(reel)}
                      className="p-3 bg-black/60 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 hover:scale-110 transition-all flex flex-col items-center gap-1 shadow-xl cursor-pointer"
                      title="Save to Mistake Diary"
                    >
                      <Bookmark className={`w-5 h-5 sm:w-6 sm:h-6 ${isBookmarked ? 'text-amber-400 fill-amber-400' : 'text-white'}`} />
                      <span className="text-[10px] font-bold text-white/80">Save</span>
                    </button>

                    {/* SHARE */}
                    <button 
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: 'Hans Compain Edu Reel',
                            text: `${reel.question}\nAnswer: ${reel.answer}`,
                            url: window.location.href,
                          }).catch(() => {});
                        } else {
                          navigator.clipboard.writeText(`${reel.question}\nAnswer: ${reel.answer}`);
                          alert('Reel text copied to clipboard!');
                        }
                      }}
                      className="p-3 bg-black/60 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 hover:scale-110 transition-all shadow-xl text-white cursor-pointer"
                    >
                      <Share2 className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                  </div>

                  {/* NAVIGATION CONTROLS */}
                  <div className="w-full flex items-center justify-between z-20 pb-2 border-t border-white/10 pt-2 text-xs">
                    <button
                      onClick={scrollToPrev}
                      disabled={idx === 0}
                      className="px-3 py-1.5 rounded-lg bg-black/50 hover:bg-black/70 text-white disabled:opacity-30 text-[11px] font-bold flex items-center gap-1 border border-white/10 cursor-pointer"
                    >
                      <ChevronUp className="w-4 h-4" /> Prev
                    </button>
                    <span className="text-[11px] font-mono font-extrabold text-amber-300">
                      {idx + 1} / {filteredReels.length}
                    </span>
                    <button
                      onClick={scrollToNext}
                      disabled={idx === filteredReels.length - 1}
                      className="px-3 py-1.5 rounded-lg bg-black/50 hover:bg-black/70 text-white disabled:opacity-30 text-[11px] font-bold flex items-center gap-1 border border-white/10 cursor-pointer"
                    >
                      Next <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
