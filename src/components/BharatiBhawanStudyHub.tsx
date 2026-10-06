import React, { useState } from 'react';
import { BookOpen, Sparkles, CheckCircle2, FileText, ArrowRight, Download, HelpCircle, ChevronRight, Award } from 'lucide-react';

interface Chapter {
  id: string;
  name: string;
  book: string;
  pages: number;
  topics: string[];
  keyFormula: string;
  sampleQuestion: string;
  solution: string;
}

export const BharatiBhawanStudyHub: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<'10' | '12'>('10');
  const [selectedSubject, setSelectedSubject] = useState<'math' | 'physics' | 'chemistry' | 'biology'>('math');
  const [activeChapterId, setActiveChapterId] = useState<string>('c1');
  const [showSolution, setShowSolution] = useState(false);
  const [testScore, setTestScore] = useState<number | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const chaptersBySubject: Record<string, Chapter[]> = {
    math: [
      {
        id: 'c1',
        name: 'अध्याय 1: वास्तविक संख्याएं (Real Numbers)',
        book: 'भारती भवन (डॉ. के. सी. सिन्हा / दास गुप्ता)',
        pages: 34,
        topics: ['यूक्लिड विभाजन प्रमेयिका', 'अंकगणित की आधारभूत प्रमेय', 'अपरिमेय संख्याओं का सत्यापन (√2, √3)', 'दशमलव प्रसार (शांत व अशांत)'],
        keyFormula: 'भाज्य = भाजक × भागफल + शेषफल (a = bq + r, जहाँ 0 ≤ r < b)',
        sampleQuestion: 'सिद्ध कीजिए कि √5 एक अपरिमेय संख्या (Irrational Number) है।',
        solution: 'माना कि √5 एक परिमेय संख्या है = a/b (जहाँ a और b सह-अभाज्य पूर्णांक हैं, b ≠ 0)। दोनों पक्षों का वर्ग करने पर: 5 = a²/b² ⇒ 5b² = a²। अतः 5, a² को विभाजित करता है, इसलिए 5, a को भी विभाजित करेगा। माना a = 5k, तब 5b² = 25k² ⇒ b² = 5k²। इसका अर्थ है कि 5, b को भी विभाजित करता है। अतः a और b में कम से कम एक उभयनिष्ठ गुणनखंड 5 है, जो हमारी इस मान्यता का विरोध करता है कि a और b सह-अभाज्य हैं। अतः √5 एक अपरिमेय संख्या है।'
      },
      {
        id: 'c2',
        name: 'अध्याय 2: बहुपद (Polynomials)',
        book: 'भारती भवन (डॉ. के. सी. सिन्हा)',
        pages: 28,
        topics: ['बहुपद के शून्यक का ज्यामितीय अर्थ', 'शून्यकों और गुणांकों में संबंध', 'द्विघात व त्रिघात बहुपद'],
        keyFormula: 'α + β = -b/a, αβ = c/a | P(x) = k[x² - (α+β)x + αβ]',
        sampleQuestion: 'यदि द्विघात बहुपद x² - 5x + 6 के शून्यक α और β हों, तो α² + β² का मान ज्ञात करें।',
        solution: 'यहाँ a = 1, b = -5, c = 6। शून्यकों का योग (α + β) = -(-5)/1 = 5, और शून्यकों का गुणनफल (αβ) = 6/1 = 6। हम जानते हैं कि α² + β² = (α + β)² - 2αβ = (5)² - 2(6) = 25 - 12 = 13 उत्तर।'
      },
      {
        id: 'c3',
        name: 'अध्याय 3: दो चर वाले रैखिक समीकरण युग्म',
        book: 'भारती भवन उच्च प्राथमिक एवं माध्यमिक',
        pages: 42,
        topics: ['ग्राफ़ीय विधि', 'प्रतिस्थापन विधि', 'विलोपन विधि', 'वज्र-गुणन विधि'],
        keyFormula: 'a₁/a₂ ≠ b₁/b₂ (अद्वितीय हल) | a₁/a₂ = b₁/b₂ = c₁/c₂ (अनंत हल) | a₁/a₂ = b₁/b₂ ≠ c₁/c₂ (कोई हल नहीं)',
        sampleQuestion: 'समीकरण 2x + 3y = 11 और 2x - 4y = -24 को हल करें।',
        solution: 'समीकरण (1) में से (2) को घटाने पर: (2x + 3y) - (2x - 4y) = 11 - (-24) ⇒ 7y = 35 ⇒ y = 5। y का मान समी. (1) में रखने पर: 2x + 3(5) = 11 ⇒ 2x = 11 - 15 = -4 ⇒ x = -2। अतः x = -2, y = 5 उत्तर।'
      }
    ],
    physics: [
      {
        id: 'p1',
        name: 'अध्याय 1: प्रकाश का परावर्तन व अपवर्तन',
        book: 'भारती भवन भौतिकी दर्शन',
        pages: 38,
        topics: ['गोलीय दर्पण सूत्र', 'आवर्धन', 'स्नेल का नियम', 'लेंस की क्षमता (Dioptre)'],
        keyFormula: 'दर्पण सूत्र: 1/f = 1/v + 1/u | लेंस सूत्र: 1/f = 1/v - 1/u | P = 1/f(m)',
        sampleQuestion: '2D क्षमता वाले उत्तल लेंस की फोकस दूरी (Focus Distance) क्या होगी?',
        solution: 'क्षमता P = 1/f(m) ⇒ f = 1/P = 1/2 = 0.5 मीटर = 50 सेमी। चूंकि क्षमता धनात्मक है, इसलिए यह उत्तल लेंस (Convex Lens) है जिसकी फोकस दूरी 50 cm होगी।'
      },
      {
        id: 'p2',
        name: 'अध्याय 2: विद्युत धारा (Electricity)',
        book: 'भारती भवन भौतिकी',
        pages: 45,
        topics: ['ओम का नियम (Ohm\'s Law)', 'प्रतिरोधों का श्रेणी व समांतर क्रम', 'जूल का तापीय नियम', 'विद्युत शक्ति'],
        keyFormula: 'V = IR | R_eq (श्रेणी) = R₁ + R₂ | 1/R_eq (समांतर) = 1/R₁ + 1/R₂ | P = VI = I²R = V²/R',
        sampleQuestion: 'यदि 4Ω और 6Ω के दो प्रतिरोधों को समांतर क्रम में जोड़ा जाए तो समतुल्य प्रतिरोध क्या होगा?',
        solution: '1/R = 1/4 + 1/6 = (3 + 2)/12 = 5/12 ⇒ R = 12/5 = 2.4 Ω उत्तर।'
      }
    ],
    chemistry: [
      {
        id: 'ch1',
        name: 'अध्याय 1: रासायनिक अभिक्रियाएं एवं समीकरण',
        book: 'भारती भवन रसायन शास्त्र',
        pages: 32,
        topics: ['संयोजन व वियोजन अभिक्रिया', 'विस्थापन व द्वि-विस्थापन', 'उपचयन एवं अपचयन (Redox)', 'संक्षारण व विकृतगंधिता'],
        keyFormula: '2Mg + O₂ → 2MgO | CuO + H₂ → Cu + H₂O (Redox)',
        sampleQuestion: 'सफ़ेद रंग की कलाई (Calcium Oxide) में जल मिलाने पर क्या होता है? संतुलित समीकरण लिखें।',
        solution: 'जब बिना बुझे चूने (CaO) में जल मिलाया जाता है, तो तीव्र ऊष्माक्षेपी अभिक्रिया होती है और बुझा हुआ चूना Ca(OH)₂ बनता है: CaO(s) + H₂O(l) → Ca(OH)₂(aq) + ऊष्मा।'
      }
    ],
    biology: [
      {
        id: 'b1',
        name: 'अध्याय 1: जैव प्रक्रम (Life Processes)',
        book: 'भारती भवन जीव विज्ञान',
        pages: 48,
        topics: ['प्रकाश संश्लेषण', 'मानव पाचन तंत्र', 'श्वसन तंत्र', 'परिसंचरण तंत्र (हृदय चक्र)', 'उत्सर्जन तंत्र (नेफ्रॉन)'],
        keyFormula: '6CO₂ + 12H₂O + सूर्य प्रकाश + क्लोरोफिल → C₆H₁₂O₆ + 6O₂ + 6H₂O',
        sampleQuestion: 'मानव हृदय में चार कोष्ठ (Four Chambers) होने का क्या महत्व है?',
        solution: 'चार कोष्ठ (दो आलिंद और दो निलय) होने से ऑक्सीजन युक्त शुद्ध रक्त और कार्बन डाइऑक्साइड युक्त अशुद्ध रक्त आपस में नहीं मिलते। इससे शरीर को उच्च ऊर्जा और निरंतर ऑक्सीजन की आपूर्ति मिलती है।'
      }
    ]
  };

  const activeChapters = chaptersBySubject[selectedSubject] || chaptersBySubject.math;
  const currentChapter = activeChapters.find(c => c.id === activeChapterId) || activeChapters[0];

  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900/60 via-indigo-900/40 to-slate-900 p-5 sm:p-6 rounded-3xl border border-indigo-500/30 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase border border-blue-500/30 mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>भारती भवन व एनसीईआरटी स्पेशल स्टडी हब</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              भारतीय भवन अध्ययन केंद्र (Bharati Bhawan Study Hub)
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              कक्षा 10वीं व 12वीं बोर्ड परीक्षाओं के लिए डॉ. के.सी. सिन्हा, दासगुप्ता एवं NCERT आधारित अध्यायवार हस्तलिखित नोट्स, फॉर्मूला शीट व मॉडल हल।
            </p>
          </div>

          {/* Class Switcher */}
          <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setSelectedClass('10')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                selectedClass === '10' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              कक्षा 10वीं (Board)
            </button>
            <button
              onClick={() => setSelectedClass('12')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                selectedClass === '12' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              कक्षा 12वीं (Inter)
            </button>
          </div>
        </div>

        {/* Subject Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-indigo-500/20">
          {[
            { id: 'math', label: 'गणित (K.C. Sinha)', icon: '📐', count: '15 अध्याय' },
            { id: 'physics', label: 'भौतिक विज्ञान', icon: '⚡', count: '6 अध्याय' },
            { id: 'chemistry', label: 'रसायन विज्ञान', icon: '🧪', count: '5 अध्याय' },
            { id: 'biology', label: 'जीव विज्ञान', icon: '🌿', count: '6 अध्याय' }
          ].map(sub => (
            <button
              key={sub.id}
              onClick={() => {
                setSelectedSubject(sub.id as any);
                setActiveChapterId((chaptersBySubject[sub.id]?.[0]?.id) || 'c1');
                setShowSolution(false);
              }}
              className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                selectedSubject === sub.id
                  ? 'bg-blue-600/30 border-blue-400 text-white font-bold shadow-md'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/80'
              }`}
            >
              <span className="text-xl">{sub.icon}</span>
              <div className="min-w-0">
                <div className="text-xs truncate">{sub.label}</div>
                <div className="text-[10px] text-slate-400">{sub.count}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Study Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left: Chapter Selector */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            अध्याय सूची (Chapters)
          </div>
          <div className="space-y-2">
            {activeChapters.map(chap => {
              const isActive = chap.id === currentChapter.id;
              return (
                <button
                  key={chap.id}
                  onClick={() => {
                    setActiveChapterId(chap.id);
                    setShowSolution(false);
                  }}
                  className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600/30 to-indigo-600/20 border-blue-400 text-white font-bold shadow'
                      : 'bg-[#091122] border-slate-850 text-slate-300 hover:bg-[#0D1830]'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="text-xs line-clamp-1">{chap.name}</div>
                    <div className="text-[10px] text-cyan-400 font-normal mt-0.5">{chap.book}</div>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-600'}`} />
                </button>
              );
            })}
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-2">
            <div className="font-bold flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              <span>बिहार व यूपी बोर्ड 2026 टॉपर टिप:</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              भारती भवन पुस्तक के प्रत्येक प्रमेय (Theorem) और उदाहरण के प्रश्नों का अभ्यास अवश्य करें। बोर्ड परीक्षा में 70% प्रश्न सीधे उदाहरण से पूछे जाते हैं।
            </p>
          </div>
        </div>

        {/* Right: Chapter Detail & Learning Studio */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-[#091122] border border-slate-800 rounded-3xl p-5 space-y-4 shadow-lg">
            
            {/* Chapter Title & Meta */}
            <div className="border-b border-slate-800 pb-3 flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                  {currentChapter.book}
                </span>
                <h2 className="text-base sm:text-lg font-black text-white mt-1">
                  {currentChapter.name}
                </h2>
              </div>
              <button 
                onClick={() => alert('PDF नोट्स आपके डिवाइस पर डाउनलोड होना शुरू हो गए हैं!')}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow cursor-pointer shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF नोट्स</span>
              </button>
            </div>

            {/* Topics Included */}
            <div>
              <span className="text-xs font-bold text-slate-300 mb-2 block">मुख्य विषय व टॉपिक (Syllabus):</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentChapter.topics.map((t, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/60 border border-slate-850 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Formula / Theory Capsule */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/40 to-cyan-950/30 border border-cyan-500/30 space-y-1.5">
              <div className="text-[11px] font-black text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>महत्वपूर्ण सूत्र व नियम (Key Formula Vault):</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/90 font-mono text-xs text-emerald-300 border border-slate-800 overflow-x-auto">
                {currentChapter.keyFormula}
              </div>
            </div>

            {/* Board Examination Question & Verified Solution */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-indigo-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>बोर्ड परीक्षा में पूछा गया 5 अंक का प्रश्न:</span>
                </span>
                <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded font-black">
                  VVI Question
                </span>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-slate-200">
                {currentChapter.sampleQuestion}
              </p>

              <button
                onClick={() => setShowSolution(!showSolution)}
                className="w-full py-2 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{showSolution ? 'समाधान छुपाएं (Hide Solution)' : 'विस्तृत समाधान देखें (Show Step-by-Step Solution)'}</span>
              </button>

              {showSolution && (
                <div className="p-3.5 rounded-xl bg-[#03060E] border border-emerald-500/30 text-xs text-slate-200 space-y-2 animate-fade-in leading-relaxed">
                  <div className="font-bold text-emerald-400 text-[11px] uppercase tracking-wide">
                    ✓ प्रमाणित हल (Step-by-Step Mathematical Proof):
                  </div>
                  <p className="text-xs font-sans whitespace-pre-line text-slate-300">
                    {currentChapter.solution}
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
