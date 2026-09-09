import React, { useState, useEffect, useRef } from 'react';
import { Share2, Heart, MessageCircle, ChevronUp, ChevronDown, Zap, Bookmark } from 'lucide-react';
import { speakText, stopAllSpeech } from '../utils/speechUtils';

interface Reel {
  id: string;
  category: string;
  question: string;
  answer: string;
  fact: string;
  bgColor: string;
}

const SAMPLE_REELS: Reel[] = [
  {
    id: 'r1',
    category: 'History 🏛️',
    question: 'Who was the first female ruler of Delhi Sultanate?',
    answer: 'Razia Sultana',
    fact: 'She ruled from 1236 to 1240 and was the only female to ever rule the Delhi Sultanate.',
    bgColor: 'from-orange-900 to-amber-900'
  },
  {
    id: 'r2',
    category: 'Science 🔬',
    question: 'Which is the hardest natural substance on Earth?',
    answer: 'Diamond',
    fact: 'Diamonds are made of pure carbon, where the carbon atoms are arranged in a rigid tetrahedral structure.',
    bgColor: 'from-blue-900 to-cyan-900'
  },
  {
    id: 'r3',
    category: 'Geography 🌍',
    question: 'Which is the longest river in the world?',
    answer: 'Nile River',
    fact: 'It flows for about 6,650 km (4,130 miles) through northeastern Africa and empties into the Mediterranean Sea.',
    bgColor: 'from-emerald-900 to-teal-900'
  },
  {
    id: 'r4',
    category: 'Polity ⚖️',
    question: 'Who is known as the Father of Indian Constitution?',
    answer: 'Dr. B. R. Ambedkar',
    fact: 'He was the Chairman of the Drafting Committee and played a crucial role in framing the Indian Constitution.',
    bgColor: 'from-purple-900 to-indigo-900'
  },
  {
    id: 'r5',
    category: 'Current Affairs 📰',
    question: 'What is the full form of UPI in digital payments?',
    answer: 'Unified Payments Interface',
    fact: 'Developed by NCPI, UPI allows instant money transfer between any two bank accounts using a mobile phone.',
    bgColor: 'from-pink-900 to-rose-900'
  }
];

export const EduReelsView: React.FC<{ language?: 'hindi' | 'english' }> = ({ language = 'hindi' }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isHindi = language === 'hindi';

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const height = containerRef.current.clientHeight;
    const scrollPosition = e.currentTarget.scrollTop;
    const index = Math.round(scrollPosition / height);
    if (index !== activeIndex && index >= 0 && index < SAMPLE_REELS.length) {
      setActiveIndex(index);
      stopAllSpeech();
    }
  };

  const currentReel = SAMPLE_REELS[activeIndex];

  const handlePlayAudio = () => {
    const text = isHindi
      ? `सवाल: ${currentReel.question}. जवाब है: ${currentReel.answer}. तथ्य: ${currentReel.fact}`
      : `Question: ${currentReel.question}. The answer is: ${currentReel.answer}. Fact: ${currentReel.fact}`;
    speakText(text, isHindi ? 'hi-IN' : 'en-US');
  };

  return (
    <div className="w-full h-full md:h-[85vh] bg-black text-white relative overflow-hidden flex justify-center">
      
      {/* Scroll Container */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full max-w-md h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide relative bg-slate-900"
        style={{ scrollBehavior: 'smooth' }}
      >
        {SAMPLE_REELS.map((reel, idx) => (
          <div 
            key={reel.id} 
            className={`w-full h-full snap-start snap-always relative flex flex-col justify-center items-center p-6 bg-gradient-to-br ${reel.bgColor}`}
          >
            {/* Top Tag */}
            <div className="absolute top-6 left-6 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest text-white/80">
              {reel.category}
            </div>

            {/* Main Content */}
            <div className="w-full text-center space-y-8 relative z-10 px-4">
              <h2 className="text-3xl md:text-4xl font-black leading-tight drop-shadow-2xl">
                {reel.question}
              </h2>
              
              <div className="p-4 bg-white/10 backdrop-blur-lg rounded-2xl border-t border-l border-white/20 shadow-2xl">
                <span className="text-xs uppercase tracking-widest font-bold text-white/50 block mb-2">Answer</span>
                <p className="text-2xl font-bold text-yellow-400">
                  {reel.answer}
                </p>
              </div>
              
              <p className="text-sm md:text-base font-medium text-white/80 leading-relaxed border-l-4 border-white/30 pl-4 text-left">
                {reel.fact}
              </p>
            </div>

            {/* Action Sidebar */}
            <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6 z-20">
              <button className="p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/20 hover:scale-110 transition-all group">
                <Heart className="w-6 h-6 text-white group-hover:text-red-500 group-hover:fill-red-500 transition-colors" />
              </button>
              <button 
                onClick={handlePlayAudio}
                className="p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/20 hover:scale-110 transition-all"
              >
                <MessageCircle className="w-6 h-6 text-white" />
              </button>
              <button className="p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/20 hover:scale-110 transition-all">
                <Bookmark className="w-6 h-6 text-white" />
              </button>
              <button className="p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/20 hover:scale-110 transition-all">
                <Share2 className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Scroll Indicator */}
            {idx < SAMPLE_REELS.length - 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/50 animate-bounce">
                <span className="text-[10px] font-bold uppercase tracking-widest mb-1">Swipe Up</span>
                <ChevronDown className="w-5 h-5" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
