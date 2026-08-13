import React, { useState } from 'react';
import { Layers, Sparkles, RefreshCw, ChevronLeft, ChevronRight, RotateCw, CheckCircle, Download, BookOpen } from 'lucide-react';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
}

interface FlashcardsViewProps {
  onExportPdf: (title: string, elementId: string) => void;
  showToast: (msg: string, type?: 'info' | 'success' | 'warn') => void;
  language?: 'english' | 'hindi';
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({ onExportPdf, showToast, language = 'hindi' }) => {
  const isHindi = language === 'hindi';
  const [topic, setTopic] = useState("SSC Indian Polity & History");
  const [cards, setCards] = useState<Flashcard[]>([
    { id: "fc-1", front: "When was the Quit India Movement launched?", back: "August 8, 1942 under Mahatma Gandhi's leadership with the slogan 'Do or Die'.", category: "History" },
    { id: "fc-2", front: "Which Article of the Indian Constitution relates to Uniform Civil Code (UCC)?", back: "Article 44 under Part IV (Directive Principles of State Policy).", category: "Polity" },
    { id: "fc-3", front: "What is a Grammalogue in Pitman Shorthand?", back: "A frequently occurring word represented by a single stroke or sign to maximize writing speed.", category: "Stenography" },
    { id: "fc-4", front: "Fill in preposition: 'He was extremely kind ____ all colleagues.'", back: "'to' - The adjective 'kind' pairs with the preposition 'to' when expressing kind behavior toward people.", category: "English" },
    { id: "fc-5", front: "What is Cache Memory in computers?", back: "High-speed temporary RAM memory located between CPU and main memory to accelerate data fetching.", category: "Computer" }
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const currentCard = cards[currentIndex] || cards[0];

  const handleGenerateCards = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch("/api/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          count: 6
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Flashcard generation failed");
      if (data.flashcards && data.flashcards.length > 0) {
        setCards(data.flashcards);
        setCurrentIndex(0);
        setIsFlipped(false);
        showToast("New AI Flashcards ready! 🃏", "success");
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

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#03060E] text-slate-100 min-h-full flex flex-col justify-between">
      <div className="max-w-3xl mx-auto w-full space-y-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900/50 via-indigo-900/50 to-slate-900 border border-purple-500/30 rounded-2xl p-5 shadow-xl flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-purple-400 font-extrabold text-xs uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4" />
              <span>Active Memory Booster</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {isHindi ? "AI अकादमिक फ़्लैशकार्ड्स" : "AI Academic Flashcards"}
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Master core concepts, dates, formulas and shorthand rules through spaced repetition.
            </p>
          </div>
          <button
            onClick={() => onExportPdf("Academic Flashcards Deck", "flashcards-deck-export")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-300 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Deck PDF</span>
          </button>
        </div>

        {/* Generate Form */}
        <form onSubmit={handleGenerateCards} className="flex gap-2">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter subject/topic (e.g., Ancient History, Prepositions, SSC CGL Science)"
            className="flex-1 text-xs p-3 bg-[#0A0E1A] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
            required
          />
          <button
            type="submit"
            disabled={isGenerating}
            className="px-4 py-3 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer border-none disabled:opacity-50 whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{isGenerating ? "Generating..." : "Generate AI Deck"}</span>
          </button>
        </form>

        {/* Active Flashcard Viewer */}
        {cards.length > 0 && currentCard && (
          <div className="space-y-4">
            
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Card {currentIndex + 1} of {cards.length}</span>
              <span className="bg-purple-950 text-purple-300 border border-purple-800/40 px-2.5 py-0.5 rounded-full font-bold">
                {currentCard.category || 'General'}
              </span>
            </div>

            {/* Interactive Flip Box */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="min-h-[220px] sm:min-h-[260px] bg-gradient-to-b from-[#0A0E1A] to-[#060913] border-2 border-purple-500/30 hover:border-purple-500/60 rounded-2xl p-6 sm:p-8 flex flex-col justify-between items-center text-center cursor-pointer transition-all shadow-2xl relative group select-none"
            >
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                {isFlipped ? (isHindi ? "स्पष्टीकरण" : "Answer") : (isHindi ? "प्रश्न" : "Question")}
              </div>

              <div className="my-auto py-4">
                <p className={`font-semibold tracking-wide transition-all ${
                  isFlipped 
                    ? "text-emerald-300 text-sm sm:text-base leading-relaxed" 
                    : "text-white text-base sm:text-lg font-bold"
                }`}>
                  {isFlipped ? currentCard.back : currentCard.front}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-purple-400 group-hover:text-purple-300 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                <RotateCw className="w-3.5 h-3.5" />
                <span>Click card to {isFlipped ? "see Question" : "reveal Answer"}</span>
              </div>
            </div>

            {/* Nav Controls */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={handlePrev}
                className="flex-1 py-3 bg-[#0A0E1A] hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Card</span>
              </button>

              <button
                onClick={() => setIsFlipped(!isFlipped)}
                className="py-3 px-5 bg-purple-900/40 hover:bg-purple-900/60 border border-purple-500/40 text-purple-200 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <RotateCw className="w-4 h-4 text-purple-300" />
                <span>Flip Card</span>
              </button>

              <button
                onClick={handleNext}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer border-none"
              >
                <span>Next Card</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* Hidden full printable element for PDF export */}
        <div id="flashcards-deck-export" className="hidden">
          <h2>HansAI Flashcards Deck: {topic}</h2>
          <div style={{ marginTop: '20px' }}>
            {cards.map((c, i) => (
              <div key={i} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
                <p><strong>Card {i + 1} ({c.category}):</strong> {c.front}</p>
                <p style={{ color: '#059669' }}><strong>Answer:</strong> {c.back}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
