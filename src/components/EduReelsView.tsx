import React, { useState, useEffect, useRef } from 'react';
import { Share2, Heart, Volume2, VolumeX, ChevronDown, ChevronUp, Bookmark, Sparkles, Filter, Maximize2, Minimize2, CheckCircle2 } from 'lucide-react';
import { speakText, stopAllSpeech } from '../utils/speechUtils';

export interface Reel {
  id: string;
  category: 'board' | 'science' | 'history' | 'polity' | 'geography' | 'ca' | 'steno';
  categoryLabel: string;
  question: string;
  answer: string;
  fact: string;
  boardSource?: string;
  bgColor: string;
  likes: number;
}

const EXTENDED_REELS: Reel[] = [
  {
    id: 'r1',
    category: 'board',
    categoryLabel: 'Bihar Board 10th 🌾',
    question: 'प्रकाश संश्लेषण (Photosynthesis) की प्रक्रिया के लिए आवश्यक चार घटक कौन से हैं?',
    answer: 'सूर्य का प्रकाश, क्लोरोफिल, कार्बन डाइऑक्साइड (CO2) तथा जल (H2O)',
    fact: 'प्रो. दास गुप्ता भारती भवन अनुसार: क्लोरोफिल सूर्य के प्रकाश की ऊर्जा को अवशोषित कर रासायनिक ऊर्जा में बदलता है।',
    boardSource: 'BSEB 2024 Annual Exam Top Question',
    bgColor: 'from-amber-900 via-stone-900 to-emerald-950',
    likes: 1420
  },
  {
    id: 'r2',
    category: 'science',
    categoryLabel: 'Science Formula 🔬',
    question: 'ओम का नियम (Ohm\'s Law) क्या है और इसका सूत्र क्या होता है?',
    answer: 'V = I × R (विभवांतर = धारा × प्रतिरोध)',
    fact: 'यदि चालक की भौतिक अवस्था (जैसे ताप) स्थिर रहे, तो सिरों का विभवांतर उसमें प्रवाहित धारा के समानुपाती होता है।',
    boardSource: 'CBSE Class 10 Physics / Board Hotspot',
    bgColor: 'from-blue-900 via-slate-900 to-indigo-950',
    likes: 2180
  },
  {
    id: 'r3',
    category: 'board',
    categoryLabel: 'UP Board 12th 🏛️',
    question: 'विद्युत क्षेत्र की तीव्रता (Electric Field Intensity) का S.I. मात्रक क्या होता है?',
    answer: 'न्यूटन/कूलॉम (N/C) या वोल्ट/मीटर (V/m)',
    fact: 'यह एक सदिश राशि (Vector Quantity) है जिसकी दिशा धन आवेश पर लगने वाले बल की दिशा में होती है।',
    boardSource: 'UP Board Physics 2023 Code 822-AZ',
    bgColor: 'from-purple-900 via-slate-900 to-fuchsia-950',
    likes: 980
  },
  {
    id: 'r4',
    category: 'history',
    categoryLabel: 'History PYQ 📜',
    question: 'दिल्ली सल्तनत की पहली और एकमात्र महिला शासिका कौन थीं?',
    answer: 'रज़िया सुल्तान (Razia Sultana)',
    fact: 'इन्होंने 1236 से 1240 ई. तक शासन किया। वे इल्तुतमिश की पुत्री थीं।',
    boardSource: 'SSC CGL / Railway NTPC Hotspot',
    bgColor: 'from-orange-950 via-red-950 to-stone-900',
    likes: 3100
  },
  {
    id: 'r5',
    category: 'polity',
    categoryLabel: 'Indian Polity ⚖️',
    question: 'भारतीय संविधान की प्रारूप समिति (Drafting Committee) के अध्यक्ष कौन थे?',
    answer: 'डॉ. बी. आर. अम्बेडकर (Dr. B. R. Ambedkar)',
    fact: 'इस समिति का गठन 29 अगस्त 1947 को हुआ था और इसमें कुल 7 सदस्य थे।',
    boardSource: 'Competitive Exams & Class 10 Civics',
    bgColor: 'from-indigo-900 via-slate-900 to-cyan-950',
    likes: 4250
  },
  {
    id: 'r6',
    category: 'geography',
    categoryLabel: 'Geography 🌍',
    question: 'विश्व की सबसे लंबी नदी कौन सी है और इसकी लंबाई कितनी है?',
    answer: 'नील नदी (Nile River) — लगभग 6,650 किमी',
    fact: 'यह अफ़्रीका महाद्वीप के विक्टोरिया झील से निकलकर भूमध्य सागर में गिरती है।',
    boardSource: 'Class 9/10 Social Science & GK',
    bgColor: 'from-teal-950 via-emerald-900 to-slate-900',
    likes: 1890
  },
  {
    id: 'r7',
    category: 'ca',
    categoryLabel: 'Current Affairs 📰',
    question: 'UPI का फुल फॉर्म क्या है और इसे किसने विकसित किया है?',
    answer: 'Unified Payments Interface (NPCI द्वारा निर्मित)',
    fact: 'NPCI (National Payments Corporation of India) ने इसे 2016 में लॉन्च किया था।',
    boardSource: 'Current Affairs 2026 Special',
    bgColor: 'from-pink-950 via-rose-900 to-purple-950',
    likes: 2760
  },
  {
    id: 'r8',
    category: 'steno',
    categoryLabel: 'Steno & Pitman ✍️',
    question: 'पिटमैन आशुलिपि (Shorthand) में P और B स्ट्रोक में क्या अंतर होता है?',
    answer: 'P हल्का (Light Stroke) और B गहरा/डार्क (Heavy Dark Stroke) होता है।',
    fact: 'दोनों 60 डिग्री के कोण पर ऊपर से नीचे (Light/Heavy Downward) लिखे जाते हैं।',
    boardSource: 'Hans Compain Steno Lab Special',
    bgColor: 'from-amber-950 via-stone-900 to-yellow-950',
    likes: 3890
  }
];

export const EduReelsView: React.FC<{ 
  language?: 'hindi' | 'english';
  studentGoalProfile?: any | null;
}> = ({ language = 'hindi', studentGoalProfile }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [bookmarkedMap, setBookmarkedMap] = useState<Record<string, boolean>>({});
  const [isFullScreen, setIsFullScreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isHindi = language === 'hindi';

  // AI CONTEXT-AWARE SMART FILTERING ALGORITHM
  const goalStream = studentGoalProfile?.stream; // 'board' or 'competitive'
  const targetExam = studentGoalProfile?.competitiveDetails?.targetExam || '';

  const contextFilteredReels = EXTENDED_REELS.filter((r) => {
    // If student selected Board Stream, exclude Steno shorthand or pure CGL content
    if (goalStream === 'board') {
      if (r.category === 'steno') return false;
      return true;
    }
    // If student selected Competitive Stream with Stenographer goal, exclude non-steno irrelevant board subjects
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
        ? `विषय: ${currentReel.categoryLabel}. प्रश्न: ${currentReel.question}. उत्तर: ${currentReel.answer}. मुख्य तथ्य: ${currentReel.fact}`
        : `Category: ${currentReel.categoryLabel}. Question: ${currentReel.question}. Answer: ${currentReel.answer}. Fact: ${currentReel.fact}`;
      
      speakText(text, isHindi ? 'hi-IN' : 'en-US');
      setIsPlayingAudio(true);
    }
  };

  const handleLike = (id: string) => {
    setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleBookmark = (id: string) => {
    setBookmarkedMap((prev) => ({ ...prev, [id]: !prev[id] }));
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

  return (
    <div className={`w-full ${isFullScreen ? 'fixed inset-0 z-50 bg-black' : 'h-[calc(100vh-5rem)] md:h-[88vh]'} bg-slate-950 text-white relative overflow-hidden flex flex-col items-center justify-between`}>
      
      {/* TOP HEADER & CATEGORY BAR */}
      <div className="w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 p-2 sm:p-3 z-30 flex flex-col gap-2">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-gradient-to-r from-red-500 to-amber-500 text-white font-black text-xs">
              ⚡ SHORT REELS
            </span>
            <h3 className="text-xs sm:text-sm font-bold text-slate-100 flex items-center gap-1">
              <span>{isHindi ? 'एजु-रील्स - 1 मिनट बोर्ड व PYQ नोट्स' : 'Edu Reels - 1 Min Exam Shorts'}</span>
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs flex items-center gap-1 border border-slate-700"
              title="Full Screen Toggle"
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{isFullScreen ? 'Exit' : 'Full Screen'}</span>
            </button>
          </div>
        </div>

        {/* CATEGORY PILLS */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide text-xs pb-1 px-1">
          {[
            { id: 'all', label: '🔥 All Reels' },
            { id: 'board', label: '🎓 Bihar/UP Board' },
            { id: 'science', label: '🔬 Science Formulas' },
            { id: 'history', label: '🏛️ History PYQ' },
            { id: 'polity', label: '⚖️ Polity' },
            { id: 'geography', label: '🌍 Geography' },
            { id: 'ca', label: '📰 Current Affairs' },
            { id: 'steno', label: '✍️ Steno Lab' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1 rounded-full whitespace-nowrap font-bold transition-all text-[11px] ${
                activeCategory === cat.id
                  ? 'bg-amber-400 text-slate-950 shadow-md scale-105'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* REELS VIEWPORT CAROUSEL */}
      <div className="w-full flex-1 relative flex justify-center items-center overflow-hidden">
        <div 
          ref={containerRef}
          onScroll={handleScroll}
          className="w-full max-w-2xl h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide relative bg-slate-900 shadow-2xl"
          style={{ scrollBehavior: 'smooth' }}
        >
          {filteredReels.map((reel, idx) => {
            const isLiked = !!likedMap[reel.id];
            const isBookmarked = !!bookmarkedMap[reel.id];

            return (
              <div 
                key={reel.id} 
                className={`w-full h-full snap-start snap-always relative flex flex-col justify-between items-center p-4 sm:p-8 bg-gradient-to-br ${reel.bgColor}`}
              >
                {/* TOP TAG & SOURCE */}
                <div className="w-full flex items-center justify-between z-20 pt-2">
                  <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/20 text-xs font-black tracking-wide text-amber-300 shadow-lg">
                    {reel.categoryLabel}
                  </span>
                  {reel.boardSource && (
                    <span className="px-2.5 py-0.5 bg-white/10 backdrop-blur-md rounded-md text-[10px] font-bold text-emerald-300 border border-emerald-400/30">
                      {reel.boardSource}
                    </span>
                  )}
                </div>

                {/* MAIN CONTENT CARD */}
                <div className="w-full text-center space-y-5 my-auto relative z-10 px-2 sm:px-6">
                  {/* QUESTION */}
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black leading-snug drop-shadow-2xl text-white tracking-wide">
                    {reel.question}
                  </h2>
                  
                  {/* ANSWER BOX */}
                  <div className="p-3 sm:p-5 bg-black/40 backdrop-blur-xl rounded-2xl border border-amber-400/30 shadow-2xl space-y-1">
                    <span className="text-[10px] sm:text-xs uppercase tracking-widest font-extrabold text-amber-400 block">
                      ✓ Correct Answer / सही उत्तर
                    </span>
                    <p className="text-lg sm:text-2xl font-black text-yellow-300 leading-tight">
                      {reel.answer}
                    </p>
                  </div>
                  
                  {/* FACT / EXAMINER NOTE */}
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 border-l-4 border-amber-400 text-left text-xs sm:text-sm font-medium text-slate-100 leading-relaxed shadow-lg">
                    <span className="font-extrabold text-amber-300 text-xs block mb-0.5">📌 Exam Key Note:</span>
                    {reel.fact}
                  </div>
                </div>

                {/* ACTION SIDEBAR */}
                <div className="absolute right-3 sm:right-6 bottom-20 flex flex-col items-center gap-4 z-20">
                  {/* LIKE BUTTON */}
                  <button 
                    onClick={() => handleLike(reel.id)}
                    className="p-3 bg-black/50 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 hover:scale-110 transition-all group flex flex-col items-center gap-1 shadow-xl"
                  >
                    <Heart className={`w-5 h-5 sm:w-6 sm:h-6 ${isLiked ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                    <span className="text-[10px] font-bold text-white/80">
                      {reel.likes + (isLiked ? 1 : 0)}
                    </span>
                  </button>

                  {/* VOICE AUDIO READER BUTTON */}
                  <button 
                    onClick={toggleAudio}
                    className={`p-3 backdrop-blur-md rounded-full border hover:scale-110 transition-all flex flex-col items-center gap-1 shadow-xl ${
                      isPlayingAudio && idx === activeIndex
                        ? 'bg-amber-500 border-amber-300 text-slate-950 animate-pulse'
                        : 'bg-black/50 border-white/20 text-white hover:bg-white/20'
                    }`}
                    title="Audio Voice Reader"
                  >
                    {isPlayingAudio && idx === activeIndex ? <VolumeX className="w-5 h-5 sm:w-6 sm:h-6" /> : <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />}
                    <span className="text-[10px] font-bold text-white/80">Voice</span>
                  </button>

                  {/* BOOKMARK TO MISTAKE NOTEBOOK */}
                  <button 
                    onClick={() => handleBookmark(reel.id)}
                    className="p-3 bg-black/50 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 hover:scale-110 transition-all flex flex-col items-center gap-1 shadow-xl"
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
                    className="p-3 bg-black/50 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 hover:scale-110 transition-all shadow-xl text-white"
                  >
                    <Share2 className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>

                {/* NAVIGATION CONTROLS */}
                <div className="w-full flex items-center justify-between z-20 pb-2 border-t border-white/10 pt-2 text-xs">
                  <button
                    onClick={scrollToPrev}
                    disabled={idx === 0}
                    className="px-3 py-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-white disabled:opacity-30 text-[11px] font-bold flex items-center gap-1 border border-white/10"
                  >
                    <ChevronUp className="w-4 h-4" /> Prev
                  </button>
                  <span className="text-[11px] font-mono font-extrabold text-amber-300">
                    {idx + 1} / {filteredReels.length}
                  </span>
                  <button
                    onClick={scrollToNext}
                    disabled={idx === filteredReels.length - 1}
                    className="px-3 py-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-white disabled:opacity-30 text-[11px] font-bold flex items-center gap-1 border border-white/10"
                  >
                    Next <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
