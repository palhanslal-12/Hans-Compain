import React, { useState, useEffect } from 'react';
import { 
  Layers, Sparkles, RefreshCw, ChevronLeft, ChevronRight, RotateCw, 
  CheckCircle, Download, BookOpen, Maximize2, Minimize2, Plus, 
  Trash2, Star, Check, Volume2, HelpCircle, ArrowLeft
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
  showToast: (msg: string, type?: 'info' | 'success' | 'warn') => void;
  language?: 'english' | 'hindi' | string;
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

  const [cards, setCards] = useState<Flashcard[]>([
    { id: "fc-1", front: "भारत छोड़ो आंदोलन (Quit India Movement) कब शुरू हुआ?", back: "8 अगस्त 1942 को महात्मा गांधी के नेतृत्व में 'करो या मरो' नारे के साथ शुरू हुआ।", category: "History", mastered: false },
    { id: "fc-2", front: "भारतीय संविधान का कौन सा अनुच्छेद समान नागरिक संहिता (UCC) से संबंधित है?", back: "अनुच्छेद 44 (Article 44) - राज्य के नीति निर्देशक तत्व (DPSP) के अंतर्गत।", category: "Polity", mastered: false },
    { id: "fc-3", front: "पिटमैन शॉर्टहैंड में 'Grammalogue' क्या होता है?", back: "बार-बार आने वाले शब्दों को एक ही विशिष्ट स्ट्रोक या चिन्ह से दर्शाना ताकि गति 100+ WPM पहुंच सके।", category: "Stenography", mastered: false },
    { id: "fc-4", front: "English Preposition: 'He is proficient ____ mathematics and coding.'", back: "'in' - किसी विषय या कौशल में निपुणता दर्शाने के लिए 'proficient in' का प्रयोग होता है।", category: "English", mastered: false },
    { id: "fc-5", front: "कंप्यूटर में Cache Memory का क्या कार्य है?", back: "यह CPU और मुख्य RAM के बीच सबसे तेज़ अस्थायी मेमोरी है जो बार-बार इस्तेमाल होने वाले डेटा को तुरंत लोड करती है।", category: "Computer", mastered: false },
    { id: "fc-6", front: "विटामिन C का रासायनिक नाम क्या है?", back: "एस्कॉर्बिक एसिड (Ascorbic Acid) - यह खट्टे फलों में पाया जाता है और स्कर्वी रोग से बचाता है।", category: "General Science", mastered: false }
  ]);

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
  }, [cards.length]);

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

  const masteredCount = cards.filter(c => c.mastered).length;

  return (
    <div className={`w-full bg-[#03060E] text-slate-100 flex flex-col justify-between transition-all ${
      isFullscreen ? 'fixed inset-0 z-50 p-6 overflow-y-auto' : 'min-h-full p-4 sm:p-6'
    }`}>
      <div className="max-w-4xl mx-auto w-full space-y-6">
        
        {/* Full-Page Clean Header */}
        <div className="bg-gradient-to-r from-purple-950/70 via-indigo-950/60 to-slate-900 border border-purple-500/30 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-purple-400 font-extrabold text-xs uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4" />
              <span>{isHindi ? "त्वरित रिवीज़न स्टूडियो" : "Active Recall & Revision Studio"}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {isHindi ? "अकादमिक फ़्लैशकार्ड्स (Flashcards Hub)" : "Academic Flashcards Hub"}
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              {isHindi 
                ? "अवधारणाओं, तारीखों, सूत्रों और स्टेनो नियमों को तेजी से दोहराएं और याददाश्त मजबूत करें।" 
                : "Master key concepts, formulas, and rules through active recall and spaced repetition."}
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

        {/* Preset Chips */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            {isHindi ? "लोकप्रिय रिवीज़न विषय (Quick Topics):" : "Popular Revision Topics:"}
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
            className="px-4 py-3 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer border-none disabled:opacity-50 whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{isGenerating ? "कार्ड्स बन रहे हैं..." : "Generate AI Deck"}</span>
          </button>
        </form>

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
          <div className="space-y-4">
            
            {/* Interactive Clean Flip Card */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className={`min-h-[260px] sm:min-h-[300px] border-2 rounded-3xl p-6 sm:p-10 flex flex-col justify-between items-center text-center cursor-pointer transition-all duration-300 shadow-2xl relative select-none ${
                isFlipped 
                  ? 'bg-gradient-to-b from-[#091512] to-[#040E0A] border-emerald-500/50 shadow-emerald-950/40' 
                  : 'bg-gradient-to-b from-[#0B0F1E] to-[#060914] border-purple-500/40 hover:border-purple-500/70 shadow-purple-950/40'
              }`}
            >
              {/* Card Top Meta */}
              <div className="w-full flex items-center justify-between text-xs">
                <span className="bg-slate-900/90 text-slate-300 border border-slate-700 px-3 py-1 rounded-full text-[11px] font-bold">
                  {currentCard.category || 'General'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      speakText(isFlipped ? currentCard.back : currentCard.front, isHindi ? 'hi-IN' : 'en-US');
                    }}
                    className="p-1.5 bg-slate-800/80 hover:bg-slate-700 text-cyan-300 rounded-lg cursor-pointer"
                    title="Speak text / आवाज़ सुनें"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMastered();
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                      currentCard.mastered 
                        ? 'bg-emerald-500 text-slate-950' 
                        : 'bg-slate-800 text-slate-400 hover:text-amber-300'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${currentCard.mastered ? 'fill-slate-950' : ''}`} />
                    <span>{currentCard.mastered ? 'Mastered' : 'Mark Known'}</span>
                  </button>
                </div>
              </div>

              {/* Card Central Question / Answer */}
              <div className="my-auto py-6 max-w-2xl">
                <span className="text-[10px] uppercase font-bold tracking-widest block mb-2 text-slate-500">
                  {isFlipped ? "✓ उत्तर / स्पष्टीकरण (Answer / Solution)" : "? प्रश्न / अवधारणा (Question / Concept)"}
                </span>
                <p className={`transition-all duration-300 leading-relaxed ${
                  isFlipped 
                    ? "text-emerald-200 text-base sm:text-lg font-medium" 
                    : "text-white text-lg sm:text-xl font-black"
                }`}>
                  {isFlipped ? currentCard.back : currentCard.front}
                </p>
              </div>

              {/* Card Bottom Hint Indicator */}
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-purple-400 bg-purple-500/10 px-3.5 py-1.5 rounded-full border border-purple-500/20">
                <RotateCw className="w-3.5 h-3.5" />
                <span>{isFlipped ? "क्लिक करें प्रश्न देखने के लिए (Click to show Question)" : "क्लिक करें उत्तर देखने के लिए (Click to reveal Solution)"}</span>
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
