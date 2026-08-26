import React, { useState } from 'react';
import { Newspaper, Calendar, Sparkles, Zap, Award, Search, BookOpen, Volume2, Share2, ArrowRight, CheckCircle2, Bookmark, Flame, Target } from 'lucide-react';

interface CurrentAffairsHubViewProps {
  onStartQuiz?: (topic: string) => void;
  showToast: (msg: string, type?: 'info' | 'success' | 'warn') => void;
}

interface NewsItem {
  id: string;
  category: 'National' | 'International' | 'Economy & Banking' | 'Science & Tech' | 'Sports' | 'State Affairs';
  titleHi: string;
  titleEn: string;
  summaryHi: string;
  summaryEn: string;
  date: string;
  examRelevance: string; // e.g. "SSC CGL / Railway / BPSC"
  keyFact: string;
  tag: string;
}

const SAMPLE_AFFAIRS: NewsItem[] = [
  {
    id: 'ca-1',
    category: 'National',
    titleHi: 'भारत ने 6G मिशन के तहत स्वदेशी सेमीकंडक्टर फैब्रिकेशन इकोसिस्टम का विस्तार किया',
    titleEn: 'India expands indigenous semiconductor fabrication ecosystem under 6G mission',
    summaryHi: 'केंद्रीय इलेक्ट्रॉनिक्स और आईटी मंत्रालय ने राष्ट्रीय 6G विज़न डॉक्यूमेंट और सेमीकंडक्टर विनिर्माण हब के नए चरण की शुरुआत की, जिससे इलेक्ट्रॉनिक्स निर्माण में 100% आत्मनिर्भरता का लक्ष्य है।',
    summaryEn: 'Ministry of Electronics & IT initiated the new phase of national 6G vision and semiconductor manufacturing hub targeting full self-reliance in core hardware.',
    date: '26 अगस्त 2026',
    examRelevance: 'UPSC CSE, SSC CGL Mains, BPSC, Railway RRB',
    keyFact: 'भारत सेमीकंडक्टर मिशन (ISM) 2.0 का परिव्यय ₹76,000 करोड़ से अधिक का है।',
    tag: 'Technology & Economy'
  },
  {
    id: 'ca-2',
    category: 'Science & Tech',
    titleHi: 'इसरो (ISRO) ने शुक्रयान-1 (Shukrayaan-1) मिशन के उन्नत रडार पेलोड का सफल परीक्षण किया',
    titleEn: 'ISRO successfully tests advanced synthetic aperture radar for Shukrayaan-1 Venus Mission',
    summaryHi: 'भारतीय अंतरिक्ष अनुसंधान संगठन (ISRO) ने वीनस ऑर्बिटर मिशन (शुक्रयान-1) के लिए सिंथेटिक एपर्चर रडार और वायुमंडलीय स्पेक्ट्रोमीटर का परीक्षण पूरा किया।',
    summaryEn: 'ISRO completed payload testing for Venus Orbiter Mission to analyze Venus atmospheric chemistry and volcanic topography.',
    date: '25 अगस्त 2026',
    examRelevance: 'UPSC, SSC CGL GS, CDS, NDA, State PSCs',
    keyFact: 'शुक्र को "पृथ्वी का जुड़वां ग्रह" (Earth’s Twin) कहा जाता है।',
    tag: 'Space Exploration'
  },
  {
    id: 'ca-3',
    category: 'Economy & Banking',
    titleHi: 'RBI ने डिजिटल रुपया (CBDC) में ऑफलाइन पीयर-टू-पीयर लेनदेन प्रणाली को मंजूरी दी',
    titleEn: 'RBI approves offline P2P transaction framework for Central Bank Digital Currency (CBDC)',
    summaryHi: 'भारतीय रिजर्व बैंक ने बिना इंटरनेट कनेक्टिविटी वाले ग्रामीण व दूरदराज के क्षेत्रों में डिजिटल रुपया के सुरक्षित ऑफलाइन लेनदेन को सक्षम किया।',
    summaryEn: 'RBI enabled near-field communication (NFC) & soundwave based offline digital rupee settlements for low connectivity areas.',
    date: '25 अगस्त 2026',
    examRelevance: 'RBI Grade B, IBPS PO, SBI PO, SSC CGL',
    keyFact: 'CBDC एक सॉवरेन डिजिटल मुद्रा है जो लीगल टेंडर के रूप में मान्य है।',
    tag: 'Banking & Finance'
  },
  {
    id: 'ca-4',
    category: 'Sports',
    titleHi: 'विश्व एथलेटिक्स चैंपियनशिप 2026 में भारत ने भाला फेंक में ऐतिहासिक स्वर्ण पदक जीता',
    titleEn: 'India clinches historic Gold Medal in Javelin Throw at World Athletics Championships 2026',
    summaryHi: 'भारतीय एथलीट ने 90.15 मीटर के अभूतपूर्व थ्रो के साथ शीर्ष स्थान हासिल कर नया राष्ट्रीय कीर्तिमान स्थापित किया।',
    summaryEn: 'Indian javelin star threw a national record 90.15m to secure World Athletics gold.',
    date: '24 अगस्त 2026',
    examRelevance: 'SSC GD, UP Police, Railway NTPC, State SI',
    keyFact: 'राष्ट्रीय खेल दिवस हर वर्ष 29 अगस्त को मेजर ध्यानचंद की जयंती पर मनाया जाता है।',
    tag: 'Sports & Awards'
  },
  {
    id: 'ca-5',
    category: 'International',
    titleHi: 'अंतर्राष्ट्रीय सौर गठबंधन (ISA) में 120वां देश शामिल, ग्लोबल क्लीन एनर्जी ग्रिड पर समझौता',
    titleEn: '120th nation joins International Solar Alliance (ISA); pact on Global Clean Energy Grid',
    summaryHi: 'भारत और फ्रांस द्वारा 2015 में स्थापित अंतर्राष्ट्रीय सौर गठबंधन (ISA) का मुख्यालय गुरुग्राम, हरियाणा में स्थित है। नए सदस्य के साथ सौर ऊर्जा विस्तार में तेजी आएगी।',
    summaryEn: 'ISA expanded to 120 member countries to accelerate solar grid integration across tropical zones.',
    date: '24 अगस्त 2026',
    examRelevance: 'UPSC, State PSC, SSC CHSL, CDS',
    keyFact: 'ISA का मुख्यालय गुरुग्राम (हरियाणा, भारत) में स्थित है।',
    tag: 'International Treaties'
  }
];

export const CurrentAffairsHubView: React.FC<CurrentAffairsHubViewProps> = ({ onStartQuiz, showToast }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [lang, setLang] = useState<'hi' | 'en'>('hi');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);

  const categories = ['All', 'National', 'International', 'Economy & Banking', 'Science & Tech', 'Sports', 'State Affairs'];

  const filteredNews = SAMPLE_AFFAIRS.filter(item => {
    const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchSearch = item.titleHi.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.keyFact.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const toggleBookmark = (id: string) => {
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(bookmarkedIds.filter(b => b !== id));
      showToast("बुकमार्क से हटाया गया", "info");
    } else {
      setBookmarkedIds([...bookmarkedIds, id]);
      showToast("करंट अफेयर्स सेव किया गया! 📌", "success");
    }
  };

  const handleSpeak = (text: string, id: string) => {
    if ('speechSynthesis' in window) {
      if (isPlayingAudio === id) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(null);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
      utterance.rate = 1.0;
      utterance.onend = () => setIsPlayingAudio(null);
      utterance.onerror = () => setIsPlayingAudio(null);
      setIsPlayingAudio(id);
      window.speechSynthesis.speak(utterance);
    } else {
      showToast("वॉइस फीचर आपके ब्राउज़र में समर्थित नहीं है।", "warn");
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-[#0a0f1d] text-slate-100 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-cyan-950 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                DAILY CURRENT AFFAIRS 2026
              </span>
              <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-semibold">
                Updated Today
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              दैनिक समसामयिकी व परीक्षा बुलेटिन
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              SSC CGL, Railway, UPSC, BPSC, State Police & Banking परीक्षाओं के लिए सटीक 1-लाइनर फैक्ट्स और व्याख्या।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                if (onStartQuiz) onStartQuiz("Current Affairs 2026 Daily Master Quiz");
                else showToast("क्विज़ लोड किया जा रहा है...", "info");
              }}
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 cursor-pointer transition-all border-none"
            >
              <Flame className="w-4 h-4 text-amber-300" />
              <span>आज का करंट अफेयर्स क्विज़ दें (10 Qs)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs rounded-2xl cursor-pointer transition-all"
            >
              Language: <span className="text-cyan-400 uppercase font-black">{lang === 'hi' ? 'हिंदी' : 'English'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border-none ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search fact, news, exam..."
            className="bg-transparent border-none outline-none text-xs text-slate-200 placeholder:text-slate-500 w-full"
          />
        </div>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {filteredNews.map(item => {
          const isSaved = bookmarkedIds.includes(item.id);
          const isPlaying = isPlayingAudio === item.id;

          return (
            <div
              key={item.id}
              className="bg-slate-900/90 border border-slate-800/90 hover:border-cyan-500/40 rounded-3xl p-5 sm:p-6 space-y-4 transition-all hover:shadow-xl hover:shadow-cyan-950/20 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Meta Header */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-lg text-[11px] font-bold">
                      {item.category}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.date}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleSpeak(lang === 'hi' ? `${item.titleHi}. ${item.summaryHi}. परीक्षा तथ्य: ${item.keyFact}` : `${item.titleEn}. ${item.summaryEn}. Key fact: ${item.keyFact}`, item.id)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        isPlaying
                          ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                      }`}
                      title="Listen Audio"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => toggleBookmark(item.id)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        isSaved
                          ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border-slate-700'
                      }`}
                      title="Save Bookmark"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-bold text-white text-base leading-snug">
                  {lang === 'hi' ? item.titleHi : item.titleEn}
                </h3>

                {/* Summary */}
                <p className="text-xs text-slate-300 leading-relaxed">
                  {lang === 'hi' ? item.summaryHi : item.summaryEn}
                </p>
              </div>

              {/* Key Exam Fact Box */}
              <div className="pt-2 space-y-2">
                <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-2xl p-3 text-xs space-y-1">
                  <div className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                    <Target className="w-3.5 h-3.5 text-amber-400" />
                    <span>महत्वपूर्ण परीक्षा तथ्य (High-Yield Fact):</span>
                  </div>
                  <div className="text-slate-200 font-medium">{item.keyFact}</div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span className="font-mono text-cyan-400/90">🎯 {item.examRelevance}</span>
                  <span className="text-slate-500 font-semibold">#{item.tag}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
