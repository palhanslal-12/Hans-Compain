import React, { useState, useEffect } from 'react';
import { 
  Layers, Sparkles, RefreshCw, ChevronLeft, ChevronRight, RotateCw, 
  Download, BookOpen, Maximize2, Minimize2, Plus, 
  Star, Check, Volume2, HelpCircle, ArrowRight,
  Bookmark, GraduationCap, Flame, Award, History, LayoutGrid
} from 'lucide-react';
import { speakText, stopAllSpeech } from '../utils/speechUtils';

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  mastered?: boolean;
}

interface FlashcardsViewProps {
  onExportPdf: (title: string, elementId?: string, rawText?: string) => void;
  showToast: (msg: string, type?: 'info' | 'success' | 'warn' | 'error') => void;
  language?: 'english' | 'hindi' | string;
}

interface StudyBookHistory {
  id: string;
  title: string;
  author: string;
  highlightsCount: number;
  notesCount: number;
  rawHighlights: string[];
  rawNotes: string[];
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({ 
  onExportPdf, 
  showToast, 
  language = 'hindi' 
}) => {
  const isHindi = language === 'hindi';
  const [topic, setTopic] = useState("SSC Indian Polity & History");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');
  const [newCategory, setNewCategory] = useState('General');

  // Study history from book reader
  const [studyBooks, setStudyBooks] = useState<StudyBookHistory[]>([]);
  const [selectedBookSourceId, setSelectedBookSourceId] = useState<string>('');
  
  // 3D tilt tracking state
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [lightSpot, setLightSpot] = useState({ x: 50, y: 50 });

  const [cards, setCards] = useState<Flashcard[]>(() => {
    const raw = localStorage.getItem('hansai-user-flashcards');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [
      { id: "fc-1", front: "भारत छोड़ो आंदोलन (Quit India Movement) कब शुरू हुआ?", back: "8 अगस्त 1942 को महात्मा गांधी के नेतृत्व में 'करो या मरो' नारे के साथ शुरू हुआ।", category: "History", mastered: false },
      { id: "fc-2", front: "भारतीय संविधान का कौन सा अनुच्छेद समान नागरिक संहिता (UCC) से संबंधित है?", back: "अनुच्छेद 44 (Article 44) - राज्य के नीति निर्देशक तत्व (DPSP) के अंतर्गत।", category: "Polity", mastered: false },
      { id: "fc-3", front: "पिटमैन शॉर्टहैंड में 'Grammalogue' क्या होता है?", back: "बार-बार आने वाले शब्दों को एक ही विशिष्ट स्ट्रोक या चिन्ह से दर्शाना ताकि गति 100+ WPM पहुंच सके।", category: "Stenography", mastered: false },
      { id: "fc-4", front: "English Preposition: 'He is proficient ____ mathematics and coding.'", back: "'in' - किसी विषय या कौशल में निपुणता दर्शाने के लिए 'proficient in' का प्रयोग होता है।", category: "English", mastered: false },
      { id: "fc-5", front: "कंप्यूटर में Cache Memory का क्या कार्य है?", back: "यह CPU और मुख्य RAM के बीच सबसे तेज़ अस्थायी मेमोरी है जो बार-बार इस्तेमाल होने वाले डेटा को तुरंत लोड करती है।", category: "Computer", mastered: false },
      { id: "fc-6", front: "विटामिन C का रासायनिक नाम क्या है?", back: "एस्कॉर्बिक एसिड (Ascorbic Acid) - यह खट्टे फलों में पाया जाता है और स्कर्वी रोग से बचाता है।", category: "General Science", mastered: false }
    ];
  });

  // Whenever cards change, persist them so any newly added card is saved
  useEffect(() => {
    try {
      localStorage.setItem('hansai-user-flashcards', JSON.stringify(cards));
    } catch (e) {
      console.error("Failed to save flashcards", e);
    }
  }, [cards]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const currentCard = cards[currentIndex] || cards[0];

  const presets = [
    { title: "🏛️ Indian Polity Articles", query: "Indian Constitution Important Articles and Amendments" },
    { title: "📜 Freedom Movement 1857-1947", query: "Modern Indian History and Freedom Movement" },
    { title: "✍️ Shorthand Grammalogues", query: "Pitman Shorthand Outlines & Grammalogues" },
    { title: "🧪 General Science Formulas", query: "SSC General Science Physics Chemistry Formulas" },
    { title: "📖 English Idioms & Vocab", query: "SSC CGL High Frequency English Idioms and Phrases" },
    { title: "💻 Computer Awareness", query: "Computer Awareness & MS Office Shortcuts" }
  ];

  // Load study library records from Local Storage on mount
  useEffect(() => {
    loadStudyHistoryFromStorage();
  }, []);

  const loadStudyHistoryFromStorage = () => {
    try {
      const savedLibrary = localStorage.getItem('hansai-my-books-library');
      if (savedLibrary) {
        const parsedBooks = JSON.parse(savedLibrary);
        if (Array.isArray(parsedBooks)) {
          const booksWithStudyHistory: StudyBookHistory[] = parsedBooks
            .map((b: any) => {
              const highlights = Array.isArray(b.highlights) ? b.highlights.map((h: any) => h.text || h) : [];
              const notes = Array.isArray(b.notes) ? b.notes.map((n: any) => `${n.title || 'Note'}: ${n.content || n}`) : [];
              return {
                id: b.id,
                title: b.title,
                author: b.author || "Unknown",
                highlightsCount: highlights.length,
                notesCount: notes.length,
                rawHighlights: highlights,
                rawNotes: notes
              };
            })
            .filter(b => b.highlightsCount > 0 || b.notesCount > 0);

          setStudyBooks(booksWithStudyHistory);
        }
      }
    } catch (e) {
      console.error("Failed to read study history for flashcards", e);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cards.length, currentIndex]);

  // Handle standard or preset AI deck generation
  const handleGenerateCards = async (topicQuery?: string) => {
    const q = topicQuery || topic;
    if (!q.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch("/api/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: q.trim(),
          count: 8
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Flashcard generation failed");
      if (data.flashcards && data.flashcards.length > 0) {
        setCards(data.flashcards);
        setCurrentIndex(0);
        setIsFlipped(false);
        showToast(isHindi ? "नया AI फ़्लैशकार्ड डेक तैयार है! 🃏" : "New AI Flashcard Deck ready!", "success");
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Failed to generate flashcards.", "warn");
    } finally {
      setIsGenerating(false);
    }
  };

  // Connect Flashcards to what the user read - Generate dynamic AI Flashcards from highlights & notes of a book
  const handleGenerateFromStudyBook = async (book: StudyBookHistory) => {
    if (book.rawHighlights.length === 0 && book.rawNotes.length === 0) {
      showToast(isHindi ? "इस बुक में कोई हाइलाइट या नोट्स नहीं मिले।" : "No study records found for this book.", "warn");
      return;
    }

    setIsGenerating(true);
    showToast(isHindi ? `आपके अध्ययन इतिहास (${book.title}) को सिंक कर रहे हैं...` : `Syncing your study history from "${book.title}"...`, "info");

    try {
      const compiledSource = [
        ...book.rawHighlights.map(h => `[Highlighted Concept]: ${h}`),
        ...book.rawNotes.map(n => `[Personal Study Note]: ${n}`)
      ].join("\n\n");

      const res = await fetch("/api/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: `Revision of ${book.title}`,
          sourceText: compiledSource,
          count: 8
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Recall deck generation failed");
      if (data.flashcards && data.flashcards.length > 0) {
        setCards(data.flashcards);
        setCurrentIndex(0);
        setIsFlipped(false);
        setTopic(`Revision: ${book.title}`);
        showToast(isHindi ? "आपके अध्ययन इतिहास से कस्टमाइज्ड AI डेक तैयार है! 🎓" : "Custom AI recall deck ready from your studies!", "success");
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Failed to sync study records.", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  // Convert highlights locally into flashcards instantly (offline fallback/instant browse)
  const handleBrowseHighlightsLocally = (book: StudyBookHistory) => {
    if (book.rawHighlights.length === 0) {
      showToast(isHindi ? "कोई हाइलाइट्स नहीं मिले।" : "No highlights available.", "warn");
      return;
    }

    const localCards: Flashcard[] = book.rawHighlights.map((hl, idx) => ({
      id: `local-hl-${Date.now()}-${idx}`,
      front: isHindi 
        ? `[अध्ययन री-कॉल: ${book.title}] इस हाइलाइट किए गए महत्वपूर्ण बिंदु को याद करें:`
        : `[Active Recall: ${book.title}] Complete or explain this highlighted concept:`,
      back: hl,
      category: "My Highlight",
      mastered: false
    }));

    setCards(localCards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setTopic(`Browse Highlights: ${book.title}`);
    showToast(isHindi ? "हाइलाइट्स कार्ड्स लोड हो गए हैं! ✓" : "Highlights cards loaded!", "success");
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const toggleMastered = () => {
    const updated = cards.map((c, i) => i === currentIndex ? { ...c, mastered: !c.mastered } : c);
    setCards(updated);
    showToast(updated[currentIndex].mastered ? "कार्ड को 'तैयार (Mastered)' चिह्नित किया गया! ⭐" : "कार्ड को रिवीज़न सूची में रखा गया।", "info");
  };

  const handleAddCustomCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFront.trim() || !newBack.trim()) return;
    const newCard: Flashcard = {
      id: `custom-fc-${Date.now()}`,
      front: newFront.trim(),
      back: newBack.trim(),
      category: newCategory.trim() || 'Custom',
      mastered: false
    };
    setCards([...cards, newCard]);
    setNewFront('');
    setNewBack('');
    setIsAddingCard(false);
    showToast("कस्टम फ़्लैशकार्ड जोड़ा गया! ✓", "success");
  };

  // Mouse Move Interaction for 3D Tilt & Holographic Lighting effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; 
    const y = e.clientY - rect.top;  
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation angles (max 15 degrees)
    const rotateX = ((centerY - y) / centerY) * 12; 
    const rotateY = ((x - centerX) / centerX) * 12; 

    // Percentage coordinates for spotlight tracking
    const lightX = (x / rect.width) * 100;
    const lightY = (y / rect.height) * 100;

    setTilt({ x: rotateX, y: rotateY });
    setLightSpot({ x: lightX, y: lightY });
  };

  const handleMouseLeave = () => {
    // Smooth reset when cursor leaves the card
    setTilt({ x: 0, y: 0 });
    setLightSpot({ x: 50, y: 50 });
  };

  const masteredCount = cards.filter(c => c.mastered).length;

  const matchingBooks = topic.trim().length >= 2
    ? studyBooks.filter(b => b.title.toLowerCase().includes(topic.toLowerCase()) || b.author.toLowerCase().includes(topic.toLowerCase()))
    : [];

  return (
    <div className={`w-full bg-[#03060E] text-slate-100 flex flex-col justify-between transition-all ${
      isFullscreen ? 'fixed inset-0 z-50 p-6 overflow-y-auto' : 'min-h-full p-4 sm:p-6'
    }`}>
      <div className="max-w-4xl mx-auto w-full space-y-6 pb-12">
        
        {/* Full-Page Clean Header */}
        <div className="bg-gradient-to-r from-purple-950/70 via-indigo-950/60 to-slate-900 border border-purple-500/30 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-purple-400 font-extrabold text-xs uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4 animate-pulse" />
              <span>{isHindi ? "त्वरित रिवीज़न स्टूडियो" : "Active Recall & Revision Studio"}</span>
              <span className="bg-purple-600/30 text-purple-200 text-[10px] px-2 py-0.5 rounded-full font-black border border-purple-500/20">3D PRO</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              {isHindi ? "अकादमिक फ़्लैशकार्ड्स (Flashcards Hub)" : "Academic Flashcards Hub"}
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              {isHindi 
                ? "3D फ्लिप डेक: अपने पढ़े हुए अध्यायों, मुख्य नोट्स और AI टॉपिक्स को तेजी से दोहराएं।" 
                : "3D Flip Deck: Master key concepts and read highlights through interactive spaced repetition."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="px-3 py-1.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Focus Mode"}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span>{isFullscreen ? "Exit Focus" : "Focus Mode"}</span>
            </button>

            <button
              onClick={() => {
                const deckRaw = `HansAI Flashcards Deck: ${topic}\nTotal Cards: ${cards.length}\nMastered: ${masteredCount}/${cards.length}\n\n` + 
                  cards.map((c, i) => `[Card ${i+1}] Category: ${c.category}\nQ: ${c.front}\nA: ${c.back}`).join('\n\n---\n\n');
                onExportPdf(`Flashcards - ${topic}`, undefined, deckRaw);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Premium Flashcards Walkthrough Steps Guide */}
        <div className="bg-purple-500/5 border border-purple-500/20 rounded-2xl p-4 sm:p-5 space-y-3">
          <h2 className="text-xs font-black text-purple-300 uppercase tracking-widest flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            <span>{isHindi ? "📚 फ़्लैशकार्ड्स गाइड: तेज़ी से याद करने के 3 आसान कदम (3 Easy Steps)" : "📚 Flashcards Guide: 3 Steps to Master Recall"}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/50 p-3.5 border border-slate-800/80 rounded-xl space-y-1.5">
              <div className="text-xs font-black text-purple-300 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-purple-500/10 text-purple-300 flex items-center justify-center font-mono font-bold text-[10px]">1</span>
                <span>{isHindi ? "विषय डेक चुनें या बनाएं (Choose Deck)" : "Select or Generate Deck"}</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {isHindi 
                  ? "नीचे दिए गए क्विक-लिंक्स से किसी विषय (Polity, History, Science) का चयन करें या ऊपर सर्च बॉक्स में अपना टॉपिक लिखकर AI से कार्ड्स जेनरेट करें।"
                  : "Pick any of the preloaded decks (Polity, History, English) below or enter any custom topic to generate a fresh deck of flashcards."}
              </p>
            </div>
            <div className="bg-slate-900/50 p-3.5 border border-slate-800/80 rounded-xl space-y-1.5">
              <div className="text-xs font-black text-sky-400 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-sky-500/10 text-sky-400 flex items-center justify-center font-mono font-bold text-[10px]">2</span>
                <span>{isHindi ? "फ्लिप करें और विचार करें (Flip & Recall)" : "Flip Card & Speak"}</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {isHindi 
                  ? "कार्ड पर लिखे प्रश्न को पढ़ें और मन में उत्तर सोचें। उत्तर देखने के लिए कार्ड पर कहीं भी क्लिक करें, वह 3D फ्लिप होकर उत्तर दिखाएगा।"
                  : "Read the prompt on the card, recall the answer in your mind, then tap the card to trigger the elegant 3D flip animation and see the solution."}
              </p>
            </div>
            <div className="bg-slate-900/50 p-3.5 border border-slate-800/80 rounded-xl space-y-1.5">
              <div className="text-xs font-black text-emerald-400 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-mono font-bold text-[10px]">3</span>
                <span>{isHindi ? "मास्टरी मार्क करें (Mark as Mastered)" : "Mark Mastered"}</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {isHindi 
                  ? "यदि उत्तर सही निकला, तो 'Mark as Mastered ✔️' बटन दबाएं। यह कार्ड आपके बचे हुए रिवीज़न पूल से बाहर हो जाएगा, जिससे केवल कठिन प्रश्न बचेंगे।"
                  : "If you recalled correctly, tap 'Mark as Mastered ✔️' to filter it out. This allows you to focus exclusively on the remaining hard cards."}
              </p>
            </div>
          </div>
        </div>

        {/* CONNECTED STUDY HISTORIES - "जो हमने पढ़ा है उसका फ्लैशकार्ड" */}
        <div className="bg-gradient-to-b from-[#0B0F1E] to-[#050814] border border-indigo-500/20 rounded-2xl p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-indigo-500/10 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-500/20 rounded-lg text-indigo-400">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                  {isHindi ? "विशेष एकीकृत रिवीज़न (जो आपने पढ़ा है)" : "Integrated Study Revision (What You Have Read)"}
                </h2>
                <p className="text-[10px] text-slate-400">
                  {isHindi 
                    ? "बुक रीडर की हाइलाइट्स और व्यक्तिगत नोट्स को सीधे फ़्लैशकार्ड में बदलें।" 
                    : "Directly convert book highlights and personal notes into active recall flashcards."}
                </p>
              </div>
            </div>
            <button 
              onClick={loadStudyHistoryFromStorage}
              className="text-[10px] text-indigo-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{isHindi ? "सिंक अपडेट" : "Sync Records"}</span>
            </button>
          </div>

          {studyBooks.length > 0 ? (
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block">
                {isHindi ? "आपके पढ़े हुए बुक्स की सूची (Choose Book to Study):" : "Your Active Study Books:"}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {studyBooks.map((book) => (
                  <div 
                    key={book.id} 
                    className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl hover:border-indigo-500/40 transition-all flex flex-col justify-between gap-3 shadow-inner"
                  >
                    <div>
                      <h3 className="text-xs font-black text-slate-100 line-clamp-1">{book.title}</h3>
                      <p className="text-[9px] text-slate-400 mt-0.5">{book.author}</p>
                      
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[10px] text-indigo-300 font-mono flex items-center gap-1">
                          <Bookmark className="w-3 h-3 text-indigo-400" />
                          {book.highlightsCount} {isHindi ? 'हाइलाइट्स' : 'Highlights'}
                        </span>
                        <span className="text-[10px] text-purple-300 font-mono flex items-center gap-1">
                          <Plus className="w-3 h-3 text-purple-400" />
                          {book.notesCount} {isHindi ? 'नोट्स' : 'Notes'}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 border-t border-slate-900 pt-2.5">
                      <button
                        onClick={() => handleGenerateFromStudyBook(book)}
                        disabled={isGenerating}
                        className="flex-1 py-1.5 px-2 bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white font-extrabold text-[10px] rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 border border-indigo-500/30 disabled:opacity-50"
                      >
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        <span>{isHindi ? "AI कार्ड्स" : "AI Recall"}</span>
                      </button>

                      <button
                        onClick={() => handleBrowseHighlightsLocally(book)}
                        className="py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-extrabold text-[10px] rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 border border-slate-800"
                      >
                        <BookOpen className="w-3 h-3" />
                        <span>{isHindi ? "हाइलाइट्स देखें" : "View Raw"}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl text-center space-y-2">
              <BookOpen className="w-8 h-8 text-slate-600 mx-auto animate-bounce" />
              <p className="text-xs text-slate-300 max-w-lg mx-auto">
                {isHindi 
                  ? "अभी आपके अध्ययन इतिहास में कोई हाइलाइट या नोट्स नहीं मिले हैं। Book Reader (📚 पढ़ने का स्टोर) में कोई भी बुक पढ़ते समय महत्वपूर्ण लाइनों को हाइलाइट करें, वो अपने आप यहाँ फ्लैशकार्ड्स बनाने के लिए उपलब्ध हो जाएँगी!"
                  : "No study records or highlights found yet. Simply highlight key text while reading in the Book Reader to generate customized flashcards!"}
              </p>
              <p className="text-[10px] text-indigo-400 font-bold">
                {isHindi 
                  ? "टिप: तब तक आप नीचे दिए गए 'Popular Revision Topics' या 'Generate AI Deck' का उपयोग कर सकते हैं।" 
                  : "Tip: Meanwhile, utilize the AI generators or presets below."}
              </p>
            </div>
          )}
        </div>

        {/* Preset Chips */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
            <LayoutGrid className="w-3.5 h-3.5 text-purple-400" />
            <span>{isHindi ? "लोकप्रिय रिवीज़न विषय (Quick Topics):" : "Popular Revision Topics:"}</span>
          </span>
          <div className="flex flex-wrap gap-2">
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTopic(p.query);
                  handleGenerateCards(p.query);
                }}
                className="px-3 py-1.5 bg-slate-900/80 hover:bg-purple-950/60 border border-slate-800 hover:border-purple-500/40 text-slate-300 hover:text-purple-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>

        {/* Generate AI Deck Search Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleGenerateCards(); }} className="flex gap-2">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="कस्टम टॉपिक लिखें (e.g. NCERT Science Class 10, Shorthand Vowels, Reasoning Blood Relations)"
            className="flex-1 text-xs p-3 bg-[#0A0E1A] border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 shadow-inner"
            required
          />
          <button
            type="submit"
            disabled={isGenerating}
            className="px-4 py-3 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer border-none disabled:opacity-50 whitespace-nowrap animate-pulse"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{isGenerating ? "कार्ड्स बन रहे हैं..." : "Generate AI Deck"}</span>
          </button>
        </form>

        {matchingBooks.length > 0 && (
          <div className="bg-indigo-950/80 border border-indigo-500/40 p-4 rounded-2xl space-y-2 animate-fade-in">
            <p className="text-[11px] uppercase tracking-wider font-extrabold text-amber-400 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>
                {isHindi 
                  ? "पढ़े हुए इतिहास से बुक मिली! (Revise with Flashcards):" 
                  : "Matching read history book found!"}
              </span>
            </p>
            <div className="space-y-2">
              {matchingBooks.map(b => (
                <div key={b.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-slate-950/90 border border-slate-850 rounded-xl">
                  <div>
                    <h4 className="text-xs font-black text-slate-100">{b.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{b.author} • {b.highlightsCount} {isHindi ? 'हाइलाइट्स' : 'Highlights'} • {b.notesCount} {isHindi ? 'नोट्स' : 'Notes'}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleGenerateFromStudyBook(b)}
                    disabled={isGenerating}
                    className="w-full sm:w-auto px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow border-none"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>{isHindi ? "फ्लैशकार्ड्स से रिवीज़न शुरू करें" : "Revise with Flashcards"}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Progress & Deck Status */}
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono bg-slate-900/60 px-4 py-2.5 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2">
            <span>Card <strong>{currentIndex + 1}</strong> of <strong>{cards.length}</strong></span>
            <span>•</span>
            <span className="text-emerald-400">Mastered: {masteredCount}/{cards.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 hidden sm:inline">Space = Flip | Arrows = Prev/Next</span>
            <button
              onClick={() => setIsAddingCard(prev => !prev)}
              className="text-xs text-indigo-300 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Card</span>
            </button>
          </div>
        </div>

        {/* Add Custom Card Form Drawer */}
        {isAddingCard && (
          <form onSubmit={handleAddCustomCard} className="p-4 bg-[#0A0E1A] border border-indigo-500/40 rounded-2xl space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white">नया फ़्लैशकार्ड जोड़ें (Add Custom Card)</span>
              <button type="button" onClick={() => setIsAddingCard(false)} className="text-slate-400 hover:text-white text-xs">✕</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="विषय / श्रेणी (e.g. History)"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="text-xs p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              />
              <input
                type="text"
                placeholder="प्रश्न / मुख्य शब्द (Front text)"
                value={newFront}
                onChange={(e) => setNewFront(e.target.value)}
                className="sm:col-span-2 text-xs p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <textarea
              placeholder="उत्तर / व्याख्या (Back text - solution/formula)"
              value={newBack}
              onChange={(e) => setNewBack(e.target.value)}
              rows={2}
              className="w-full text-xs p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 resize-none"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              कार्ड सेव करें (Save Card)
            </button>
          </form>
        )}

        {/* Active Flashcard Viewer Box */}
        {cards.length > 0 && currentCard && (
          <div className="space-y-6">
            
            {/* 3D INTERACTIVE TILT FLIP CARD */}
            <div 
              className="w-full flex justify-center py-4"
              style={{ perspective: '1500px' }}
            >
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="w-full max-w-xl h-72 sm:h-80 relative cursor-pointer select-none group transition-transform duration-200"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isFlipped 
                    ? 'rotateY(180deg)' 
                    : `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                }}
              >
                {/* 3D FRONT FACE (Question / Concept) */}
                <div 
                  className="absolute inset-0 w-full h-full rounded-3xl p-6 sm:p-10 flex flex-col justify-between items-center text-center border-2 border-purple-500/30 bg-gradient-to-br from-[#0B0F1E] via-[#0D152D] to-[#060914] shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    background: `radial-gradient(circle at ${lightSpot.x}% ${lightSpot.y}%, rgba(139, 92, 246, 0.15) 0%, rgba(11, 15, 30, 0.95) 70%)`
                  }}
                >
                  {/* Card Top Details */}
                  <div className="w-full flex items-center justify-between text-xs z-10">
                    <span className="bg-purple-950/80 text-purple-200 border border-purple-500/40 px-3.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase">
                      {currentCard.category || 'General'}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          speakText(currentCard.front, isHindi ? 'hi-IN' : 'en-US');
                        }}
                        className="p-1.5 bg-slate-900/90 hover:bg-slate-800 text-purple-300 hover:text-white rounded-lg border border-slate-800 transition-colors cursor-pointer"
                        title="Listen Question"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMastered();
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase flex items-center gap-1 transition-colors border ${
                          currentCard.mastered 
                            ? 'bg-emerald-500 border-emerald-400 text-slate-950' 
                            : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-amber-300'
                        }`}
                      >
                        <Star className={`w-3 h-3 ${currentCard.mastered ? 'fill-slate-950 text-slate-950' : ''}`} />
                        <span>{currentCard.mastered ? 'Mastered' : 'Mark Known'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Central Text */}
                  <div className="my-auto py-2 max-w-md z-10">
                    <span className="text-[9px] uppercase font-bold tracking-widest block mb-2.5 text-slate-500 flex items-center justify-center gap-1">
                      <HelpCircle className="w-3 h-3 text-purple-400" />
                      <span>{isHindi ? "? प्रश्न / अवधारणा (Question)" : "? Question / Concept"}</span>
                    </span>
                    <p className="text-white text-base sm:text-lg font-black leading-relaxed drop-shadow-md">
                      {currentCard.front}
                    </p>
                  </div>

                  {/* Card Bottom Flip Guide */}
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-purple-300 bg-purple-500/10 px-3.5 py-1.5 rounded-full border border-purple-500/20 z-10">
                    <RotateCw className="w-3 h-3 text-purple-400 animate-spin" />
                    <span>{isHindi ? "क्लिक करें उत्तर देखने के लिए (Click to Reveal Answer)" : "Click to Reveal Solution"}</span>
                  </div>
                </div>

                {/* 3D BACK FACE (Answer / Solution) */}
                <div 
                  className="absolute inset-0 w-full h-full rounded-3xl p-6 sm:p-10 flex flex-col justify-between items-center text-center border-2 border-emerald-500/40 bg-gradient-to-br from-[#091512] via-[#041E15] to-[#040E0A] shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    background: `radial-gradient(circle at ${100 - lightSpot.x}% ${lightSpot.y}%, rgba(16, 185, 129, 0.15) 0%, rgba(9, 21, 18, 0.95) 70%)`
                  }}
                >
                  {/* Card Top Details */}
                  <div className="w-full flex items-center justify-between text-xs z-10">
                    <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 px-3.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase">
                      {currentCard.category || 'General'}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          speakText(currentCard.back, isHindi ? 'hi-IN' : 'en-US');
                        }}
                        className="p-1.5 bg-slate-900/90 hover:bg-slate-800 text-emerald-300 hover:text-white rounded-lg border border-slate-800 transition-colors cursor-pointer"
                        title="Listen Answer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMastered();
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase flex items-center gap-1 transition-colors border ${
                          currentCard.mastered 
                            ? 'bg-emerald-500 border-emerald-400 text-slate-950' 
                            : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-amber-300'
                        }`}
                      >
                        <Star className={`w-3 h-3 ${currentCard.mastered ? 'fill-slate-950 text-slate-950' : ''}`} />
                        <span>{currentCard.mastered ? 'Mastered' : 'Mark Known'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Central Text */}
                  <div className="my-auto py-2 max-w-md z-10">
                    <span className="text-[9px] uppercase font-bold tracking-widest block mb-2.5 text-slate-500 flex items-center justify-center gap-1">
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>{isHindi ? "✓ उत्तर व व्याख्या (Answer & Solution)" : "✓ Answer & Explanation"}</span>
                    </span>
                    <p className="text-emerald-100 text-sm sm:text-base font-bold leading-relaxed drop-shadow-md">
                      {currentCard.back}
                    </p>
                  </div>

                  {/* Card Bottom Flip Guide */}
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-300 bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20 z-10">
                    <RotateCw className="w-3 h-3 text-emerald-400" />
                    <span>{isHindi ? "क्लिक करें प्रश्न देखने के लिए (Click to show Question)" : "Click to show Question"}</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={handlePrev}
                className="flex-1 py-3 bg-[#0A0E1A] hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>पिछला कार्ड (Previous)</span>
              </button>

              <button
                onClick={() => setIsFlipped(!isFlipped)}
                className="py-3 px-6 bg-purple-900/40 hover:bg-purple-900/60 border border-purple-500/40 text-purple-200 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <RotateCw className="w-4 h-4 text-purple-300" />
                <span>कार्ड पलटें (Flip)</span>
              </button>

              <button
                onClick={handleNext}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer border-none"
              >
                <span>अगला कार्ड (Next)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
