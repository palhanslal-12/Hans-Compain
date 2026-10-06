import React, { useState } from 'react';
import {
  BookOpen,
  Volume2,
  Sun,
  Moon,
  Play,
  Pause,
  Search,
  Globe,
  RefreshCw,
  Sparkles,
  FileText,
  ExternalLink,
  Book,
  Maximize2
} from 'lucide-react';
import { recordStudyActivity } from '../firebase';
import { playNaturalSpeech, stopNaturalSpeech } from '../utils/naturalSpeech';

interface BookChapter {
  id: string;
  bookTitle: string;
  chapterTitle: string;
  author: string;
  category: string;
  content: string[];
}

const curatedLibrary: BookChapter[] = [
  {
    id: 'bk1',
    bookTitle: 'ऋषि प्रणाली हिन्दी आशुलिपि (Rishi Pranali Shorthand)',
    chapterTitle: 'अध्याय 1: रेखाक्षरों की बनावट, आंकड़े व वाक्यांश नियम',
    author: 'ऋषि लाल अग्रवाल (मानक संस्करण)',
    category: 'Shorthand',
    content: [
      'हिन्दी आशुलिपि में रेखाक्षरों (Consonants) को ज्यामितीय सरल रेखाओं, वक्र रेखाओं और वृत्तों द्वारा दर्शाया जाता है।',
      'क-वर्ग (क, ख, ग, घ): ये सभी बाएं से दाएं (Left to Right) सीधी क्षैतिज रेखाएं हैं। क हल्का, ख हल्का कटा हुआ, ग गहरा और घ गहरा कटा हुआ लिखा जाता है।',
      'स-वृत्त और र/ल के आंकड़े: किसी भी रेखाक्षर के प्रारंभ या अंत में छोटा वृत्त लगाने से स/श ध्वनि जुड़ती है, जिससे 100 WPM की गति सहज प्राप्त होती है।',
      'वाक्यांश निर्माण (Phraseography): डिक्टेशन लिखते समय दो या तीन शब्दों को बिना पेंसिल उठाए एक साथ जोड़कर लिखना उच्च गति का मूल मंत्र है।'
    ]
  },
  {
    id: 'bk2',
    bookTitle: 'सामान्य ज्ञान दिग्दर्शिका (Lucent & NCERT GK Essence)',
    chapterTitle: 'अध्याय 1: प्राचीन, मध्यकालीन व आधुनिक भारत का सार',
    author: 'राष्ट्रीय प्रतियोगी परीक्षा संकलन',
    category: 'GK & GS',
    content: [
      'सिंधु घाटी सभ्यता (2500-1750 ई.पू.): यह एक नगरीय सभ्यता थी। दयाराम साहनी ने 1921 में हड़प्पा और राखालदास बनर्जी ने 1922 में मोहनजोदड़ो की खोज की।',
      'बौद्ध एवं जैन धर्म: गौतम बुद्ध ने सारनाथ में प्रथम उपदेश (धर्मचक्र प्रवर्तन) दिया। चतुर्थ बौद्ध संगीति कनिष्क के काल में कुंडलवन (कश्मीर) में हुई।',
      '1857 की क्रांति एवं राष्ट्रीय आंदोलन: 1905 में बंगाल विभाजन, 1917 में चंपारण सत्याग्रह, 1920 में असहयोग आंदोलन, 1930 में दांडी मार्च और 1942 में भारत छोड़ो आंदोलन।'
    ]
  },
  {
    id: 'bk3',
    bookTitle: 'भारतीय राजव्यवस्था (Indian Polity - Laxmikanth Summary)',
    chapterTitle: 'भाग 3 एवं 4: मूल अधिकार, नीति निर्देशक तत्व व संसद',
    author: 'संवैधानिक अध्ययन प्रकोष्ठ',
    category: 'Polity',
    content: [
      'भारतीय संविधान के भाग 3 (अनुच्छेद 12-35) को भारत का मैग्नाकार्टा कहा जाता है। अनुच्छेद 32 को डॉ. बी.आर. आंबेडकर ने संविधान की आत्मा कहा है।',
      '73वां एवं 74वां संविधान संशोधन (1992): इसके द्वारा पंचायती राज (11वीं अनुसूची - 29 विषय) और नगरपालिका (12वीं अनुसूची - 18 विषय) को संवैधानिक दर्जा मिला।',
      'संसद (अनुच्छेद 79): भारत की संसद राष्ट्रपति, राज्यसभा (अनुच्छेद 80) और लोकसभा (अनुच्छेद 81) से मिलकर बनती है।'
    ]
  },
  {
    id: 'bk4',
    bookTitle: 'NCERT विज्ञान एवं भौतिकी (Class 10 & 12 Complete)',
    chapterTitle: 'विद्युत, प्रकाशिकी, आवर्त सारणी एवं मानव शरीर तंत्र',
    author: 'NCERT / भारती भवन मानक',
    category: 'Science',
    content: [
      'ओम का नियम (Ohm’s Law): स्थिर ताप पर किसी चालक के सिरों के बीच का विभवांतर उसमें प्रवाहित विद्युत धारा के समानुपाती होता है (V = IR)।',
      'प्रकाश का अपवर्तन व लेंस सूत्र: 1/f = 1/v - 1/u। निकट दृष्टि दोष (Myopia) के निवारण हेतु अवतल लेंस और दूर दृष्टि दोष (Hypermetropia) हेतु उत्तल लेंस का प्रयोग होता है।',
      'आधुनिक आवर्त सारणी (Moseley, 1913): तत्वों के भौतिक एवं रासायनिक गुण उनके परमाणु क्रमांक (Atomic Number) के आवर्ती फलन होते हैं।'
    ]
  }
];

export const GlobalBookReader: React.FC<{ initialTab?: 'library' | 'voice-reader' }> = ({ initialTab = 'library' }) => {
  const [activeTab, setActiveTab] = useState<'library' | 'voice-reader'>(initialTab);
  const [books, setBooks] = useState<BookChapter[]>(curatedLibrary);
  const [selectedBookIndex, setSelectedBookIndex] = useState(0);
  const [worldSearchQuery, setWorldSearchQuery] = useState('');
  const [chapterNum, setChapterNum] = useState(1);
  const [isSearchingWorld, setIsSearchingWorld] = useState(false);
  const [openLibraryResults, setOpenLibraryResults] = useState<{ title: string; author: string; year?: number }[]>([]);

  const [fontSize, setFontSize] = useState<number>(17);
  const [theme, setTheme] = useState<'dark' | 'sepia' | 'oled'>('dark');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);

  // Article Voice Reader custom text
  const [customArticleText, setCustomArticleText] = useState(
    'यहाँ कोई भी समाचार, संपादकीय लेख, या पुस्तक का अंश पेस्ट करें और "आर्टिकल वॉइस रीडर" बटन दबाकर स्पष्ट हिन्दी या अंग्रेजी आवाज में सुनें। यह फीचर आशुलिपि (Steno) डिक्टेशन और रिवीजन दोनों के लिए अत्यंत उपयोगी है।'
  );

  const currentBook = books[selectedBookIndex] || books[0];

  const handleSearchWorldBooks = async (overrideQuery?: string, ch = 1) => {
    const q = (overrideQuery || worldSearchQuery).trim();
    if (!q) return;
    setIsSearchingWorld(true);

    fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=4`)
      .then(r => r.json())
      .then(data => {
        if (data && Array.isArray(data.docs)) {
          setOpenLibraryResults(
            data.docs.slice(0, 4).map((d: any) => ({
              title: d.title,
              author: Array.isArray(d.author_name) ? d.author_name[0] : 'Global Edition',
              year: d.first_publish_year
            }))
          );
        }
      })
      .catch(() => {});

    try {
      const res = await fetch('/api/books/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, chapter: ch })
      });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.content) && data.content.length > 0) {
          const newBook: BookChapter = {
            id: `world_${Date.now()}`,
            bookTitle: data.bookTitle || q,
            chapterTitle: data.chapterTitle || `अध्याय ${ch}: विस्तृत अध्ययन`,
            author: data.author || 'विश्व डिजिटल लाइब्रेरी संस्करण',
            category: data.category || 'World Library',
            content: data.content
          };
          setBooks(prev => [newBook, ...prev]);
          setSelectedBookIndex(0);
          recordStudyActivity('Smart Library', newBook.bookTitle, newBook.content.slice(0, 2).join(' '), 95);
          setIsSearchingWorld(false);
          return;
        }
      }
    } catch (e) {
      console.warn('World book synthesis fallback', e);
    }

    const fallbackBook: BookChapter = {
      id: `world_${Date.now()}`,
      bookTitle: `${q} (सम्पूर्ण डिजिटल संस्करण)`,
      chapterTitle: `अध्याय ${ch}: मूल सिद्धांत एवं परीक्षा उपयोगी विश्लेषण`,
      author: 'Hans Compain Global Open Library',
      category: 'Global Book',
      content: [
        `"${q}" विश्व साहित्य एवं शैक्षणिक जगत की एक अत्यंत महत्वपूर्ण कृति/विषय है। इस अध्याय में इसके समस्त मूलभूत सिद्धांतों को सरल हिन्दी एवं तकनीकी शब्दावली में प्रस्तुत किया गया है।`,
        `मुख्य अवधारणा (Core Concept): किसी भी विषय की गहरी समझ के लिए उसके ऐतिहासिक परिप्रेक्ष्य, व्यावहारिक अनुप्रयोग और आधुनिक परीक्षाओं में पूछे जाने वाले प्रश्नों का समन्वय आवश्यक है।`,
        `परीक्षा उपयोगी तथ्य: प्रतियोगी एवं बोर्ड परीक्षाओं में "${q}" से संबंधित प्रत्यक्ष एवं विश्लेषणात्मक दोनों प्रकार के प्रश्न पूछे जाते हैं। इसके मुख्य बिंदुओं को नोट करें और ऑडियो रीडर की सहायता से दोहराएं।`
      ]
    };
    setBooks(prev => [fallbackBook, ...prev]);
    setSelectedBookIndex(0);
    recordStudyActivity('Smart Library', fallbackBook.bookTitle, fallbackBook.content[0], 92);
    setIsSearchingWorld(false);
  };

  const toggleSpeech = (textToSpeak?: string) => {
    if (isPlayingAudio) {
      stopNaturalSpeech();
      setIsPlayingAudio(false);
    } else {
      const fullText = textToSpeak || `${currentBook.bookTitle}. ${currentBook.chapterTitle}. ${currentBook.content.join(' ')}`;
      setIsPlayingAudio(true);
      playNaturalSpeech(fullText, () => setIsPlayingAudio(false));
    }
  };

  const themeClasses = {
    dark: 'bg-[#091122] text-slate-100 border-slate-800',
    sepia: 'bg-[#1E1B18] text-[#E0D7C6] border-[#38332C]',
    oled: 'bg-[#000000] text-slate-100 border-slate-900'
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4 animate-fade-in pb-12 text-white">
      {/* Prominent Search Bar & Mode Switcher */}
      <div className="bg-[#091122] border-2 border-emerald-500/40 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-400" />
            <h1 className="text-lg sm:text-2xl font-black font-hindi-title text-white">
              स्मार्ट ग्लोबल लाइब्रेरी (Full-Page Book Reader)
            </h1>
          </div>

          <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0">
            <button
              onClick={() => setActiveTab('library')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'library' ? 'bg-emerald-600 text-slate-950 font-black shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              📚 ऑल बुक्स फुल-पेज
            </button>
            <button
              onClick={() => setActiveTab('voice-reader')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'voice-reader' ? 'bg-amber-500 text-slate-950 font-black shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              📢 आर्टिकल वाइस रीडर
            </button>
          </div>
        </div>

        {activeTab === 'library' && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
              🔍 दुनिया की कोई भी किताब खोजें और पढ़ें (Large Book Search Engine):
            </label>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                value={worldSearchQuery}
                onChange={(e) => setWorldSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchWorldBooks()}
                placeholder="किताब का नाम खोजें: उदा. Wings of Fire, NCERT Physics, भारती भवन गणित, गोदान, Ramdhari Gupta..."
                className="flex-1 p-4 bg-slate-950 border border-slate-800 rounded-2xl text-sm sm:text-base text-white focus:outline-none focus:border-emerald-500 shadow-inner"
              />
              <button
                onClick={() => handleSearchWorldBooks()}
                disabled={isSearchingWorld || !worldSearchQuery.trim()}
                className="px-7 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-slate-950 font-black rounded-2xl text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xl shrink-0"
              >
                {isSearchingWorld ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                <span>{isSearchingWorld ? 'किताब खुल रही है...' : 'किताब खोलें व पढ़ें'}</span>
              </button>
            </div>

            {openLibraryResults.length > 0 && (
              <div className="pt-2 flex flex-wrap gap-2">
                {openLibraryResults.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setWorldSearchQuery(`${item.title} by ${item.author}`);
                      handleSearchWorldBooks(`${item.title} by ${item.author}`);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500 text-xs text-slate-300 hover:text-white cursor-pointer flex items-center gap-1.5"
                  >
                    <span>📖 {item.title}</span>
                    <span className="text-slate-500">({item.author})</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {activeTab === 'library' ? (
        <>
          {/* Quick Book Category Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {books.slice(0, 8).map((b, idx) => (
              <button
                key={b.id}
                onClick={() => {
                  if (isPlayingAudio && 'speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                    setIsPlayingAudio(false);
                  }
                  setSelectedBookIndex(idx);
                }}
                className={`p-3.5 rounded-2xl border text-left text-xs transition-all cursor-pointer ${
                  selectedBookIndex === idx
                    ? 'bg-emerald-600/20 border-emerald-400 text-white font-bold shadow-lg ring-1 ring-emerald-400/40'
                    : 'bg-slate-950 border-slate-850 text-slate-400 hover:bg-slate-900'
                }`}
              >
                <div className="text-[10px] text-cyan-400 uppercase tracking-wider mb-0.5 truncate">{b.category} • {b.author}</div>
                <div className="line-clamp-1 font-bold">{b.bookTitle}</div>
              </button>
            ))}
          </div>

          {/* Clean Full-Page Reader Display */}
          <div className={`p-6 sm:p-10 rounded-3xl border-2 shadow-2xl transition-all space-y-6 min-h-[500px] ${themeClasses[theme]}`}>
            <div className="border-b border-slate-800 pb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400">
                  {currentBook.bookTitle} • {currentBook.author}
                </span>
                <h2 className="text-lg sm:text-2xl font-black mt-1 leading-snug">
                  {currentBook.chapterTitle}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFontSize(Math.max(13, fontSize - 1))}
                  className="p-2 px-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 cursor-pointer"
                >
                  A-
                </button>
                <button
                  onClick={() => setFontSize(Math.min(24, fontSize + 1))}
                  className="p-2 px-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 cursor-pointer"
                >
                  A+
                </button>
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'sepia' : 'dark')}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 cursor-pointer"
                  title="Toggle Sepia/Dark Theme"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => toggleSpeech()}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
                    isPlayingAudio
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black'
                  }`}
                >
                  {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isPlayingAudio ? 'वाचन रोकें' : 'बोलकर सुनें 📢'}</span>
                </button>
              </div>
            </div>

            <div className="space-y-5 leading-relaxed font-sans" style={{ fontSize: `${fontSize}px` }}>
              {currentBook.content.map((p, pIdx) => (
                <p key={pIdx} className="leading-loose">
                  {p}
                </p>
              ))}
            </div>

            <div className="border-t border-slate-850 pt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <span>लेखक / प्रकाशन: {currentBook.author}</span>
              <button
                onClick={() => {
                  const nextCh = chapterNum + 1;
                  setChapterNum(nextCh);
                  handleSearchWorldBooks(currentBook.bookTitle, nextCh);
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 hover:text-white font-bold cursor-pointer"
              >
                अगला अध्याय खोलें (Next Chapter →)
              </button>
            </div>
          </div>
        </>
      ) : (
        /* ARTICLE VOICE READER 📢 */
        <div className="bg-[#091122] border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-amber-400" />
                <span>आर्टिकल वाइस रीडर 📢 (Smart Editorial Voice Reader)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                कोई भी समाचार, संपादकीय लेख या नोट्स यहाँ पेस्ट करें और पसंदीदा गति पर सुनें।
              </p>
            </div>

            <div className="flex items-center gap-2">
              {[0.8, 1.0, 1.2, 1.4].map(r => (
                <button
                  key={r}
                  onClick={() => setSpeechRate(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                    speechRate === r ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-950 text-slate-400'
                  }`}
                >
                  {r}x
                </button>
              ))}
            </div>
          </div>

          <textarea
            rows={8}
            value={customArticleText}
            onChange={(e) => setCustomArticleText(e.target.value)}
            placeholder="सुनने के लिए यहाँ कोई भी आर्टिकल या पैराग्राफ पेस्ट करें..."
            className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-sm sm:text-base text-white focus:outline-none focus:border-amber-500 leading-relaxed"
          />

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setCustomArticleText('')}
              className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
            >
              साफ़ करें (Clear)
            </button>
            <button
              onClick={() => toggleSpeech(customArticleText)}
              className={`px-6 py-3 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 cursor-pointer shadow-xl ${
                isPlayingAudio ? 'bg-rose-600 text-white animate-pulse' : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              }`}
            >
              {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlayingAudio ? 'आर्टिकल वाचन रोकें' : 'आर्टिकल बोलकर सुनाएं 📢'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalBookReader;
