import React, { useState, useEffect } from 'react';
import { Zap, RotateCw, ChevronLeft, ChevronRight, Volume2, Sparkles, CheckCircle2, Plus, Target, AlertTriangle } from 'lucide-react';
import { recordStudyActivity } from '../firebase';
import { playNaturalSpeech, stopNaturalSpeech } from '../utils/naturalSpeech';

interface FlashcardItem {
  id: string;
  category: string;
  frontQuestion: string;
  backAnswer: string;
  memoryTip: string;
  isWeakTopicTarget?: boolean;
}

const defaultCards: FlashcardItem[] = [
  {
    id: 'fc1',
    category: 'भारतीय संविधान (Polity)',
    frontQuestion: 'राष्ट्रपति पर महाभियोग (Impeachment of President) किस अनुच्छेद के अंतर्गत लगाया जाता है?',
    backAnswer: 'अनुच्छेद 61 (Article 61) — संविधान के अतिक्रमण के आधार पर संसद के किसी भी सदन द्वारा 14 दिन की पूर्व सूचना पर।',
    memoryTip: 'याद रखें: अनुच्छेद 52 (राष्ट्रपति पद), 60 (शपथ), और 61 (महाभियोग)।'
  },
  {
    id: 'fc2',
    category: 'सामान्य विज्ञान (Science)',
    frontQuestion: 'मानव शरीर की सबसे बड़ी ग्रंथि (Largest Gland) और सबसे बड़ी अंतःस्रावी ग्रंथि कौन-सी है?',
    backAnswer: 'सबसे बड़ी ग्रंथि: यकृत (Liver) | सबसे बड़ी अंतःस्रावी (Endocrine) ग्रंथि: थायरॉइड (अवटु ग्रंथि)।',
    memoryTip: 'पित्त (Bile) का निर्माण यकृत में होता है, परंतु संचय पित्ताशय (Gall Bladder) में होता है।'
  },
  {
    id: 'fc3',
    category: 'आशुलिपि नियम (Steno Rules)',
    frontQuestion: 'ऋषि प्रणाली में किसी सरल रेखाक्षर को सामान्य से आधा (Half Length) करने पर उसमें क्या जुड़ता है?',
    backAnswer: 'अर्द्धीकरण सिद्धांत (Halving Principle) के अनुसार रेखाक्षर को आधा करने पर "त", "ट" या "द" जुड़ जाता है।',
    memoryTip: 'दोगुना (Doubling) करने पर "तर / दर / टर" जुड़ता है।'
  },
  {
    id: 'fc4',
    category: 'आधुनिक इतिहास (History)',
    frontQuestion: 'भारतीय राष्ट्रीय कांग्रेस की प्रथम महिला अध्यक्ष और प्रथम भारतीय महिला अध्यक्ष कौन थीं?',
    backAnswer: 'प्रथम महिला अध्यक्ष: एनी बेसेंट (1917 कलकत्ता) | प्रथम भारतीय महिला अध्यक्ष: सरोजिनी नायडू (1925 कानपुर)।',
    memoryTip: '1917 (कलकत्ता - एनी) → ठीक 8 साल बाद 1925 (कानपुर - सरोजिनी नायडू)।'
  },
  {
    id: 'fc5',
    category: 'अंग्रेजी व्याकरण (SSC English)',
    frontQuestion: '"No sooner" के साथ किस Conjunction और Verb Structure का प्रयोग होता है?',
    backAnswer: '"No sooner + had/did + Subject + V3/V1 ... than" (ध्यान दें: when या then का प्रयोग गलत होता है, केवल "than" आता है)।',
    memoryTip: 'Hardly / Scarcely के साथ "when" आता है, जबकि No sooner के साथ "than" आता है।'
  }
];

export const FlashcardsView: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);
  const [customTopic, setCustomTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [cards, setCards] = useState<FlashcardItem[]>(defaultCards);
  const [weakTopicsList, setWeakTopicsList] = useState<string[]>([]);

  const syncWeakTopicFlashcards = () => {
    try {
      const mistakes = JSON.parse(localStorage.getItem('hans_compain_mistake_notebook') || '[]');
      if (Array.isArray(mistakes) && mistakes.length > 0) {
        const topics = Array.from(new Set(mistakes.map((m: any) => m.subject || m.questionText.slice(0, 20))));
        setWeakTopicsList(topics as string[]);

        const weakCards: FlashcardItem[] = mistakes.slice(0, 4).map((m: any, idx: number) => ({
          id: `weak_fc_${m.id || idx}`,
          category: `🎯 कमज़ोर विषय रीकैप: ${m.subject || 'अध्ययन टॉस्क'}`,
          frontQuestion: m.questionText || 'कमज़ोर विषय का परीक्षा प्रश्न',
          backAnswer: `सही उत्तर: ${m.options?.[m.correctOptionIdx] || 'सटीक उत्तर'}। व्याख्या: ${m.explanation || 'उत्तर याद रखें।'}`,
          memoryTip: 'यह प्रश्न आपके हालिया टेस्ट में गलत हुआ था, इसे 2 बार बोलकर याद करें!',
          isWeakTopicTarget: true
        }));

        setCards([...weakCards, ...defaultCards]);
        return;
      }
    } catch {
      // ignore
    }
    setCards(defaultCards);
  };

  useEffect(() => {
    syncWeakTopicFlashcards();
    const handler = () => syncWeakTopicFlashcards();
    window.addEventListener('hans_mistake_notebook_updated', handler);
    return () => window.removeEventListener('hans_mistake_notebook_updated', handler);
  }, []);

  const currentCard = cards[currentIndex] || cards[0];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev - 1 + cards.length) % cards.length);
  };

  const toggleMastered = (id: string) => {
    setMasteredIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  const handleGenerateFlashcard = async () => {
    if (!customTopic.trim()) return;
    const topic = customTopic.trim();
    setCustomTopic('');
    setIsGenerating(true);

    try {
      const res = await fetch('/api/ai/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `विषय "${topic}" पर प्रतियोगी और बोर्ड परीक्षा के लिए सबसे महत्वपूर्ण 1 प्रश्न और उसका संक्षिप्त उत्तर व मेमोरी ट्रिक हिंदी में बताएं।`,
          mode: 'chat'
        })
      });
      const data = await res.json();
      const answer = data.answer || `${topic} से संबंधित महत्वपूर्ण परीक्षा तथ्य।`;
      const newCard: FlashcardItem = {
        id: `fc-${Date.now()}`,
        category: `AI कार्ड: ${topic}`,
        frontQuestion: `${topic} से संबंधित सबसे महत्वपूर्ण परीक्षा प्रश्न एवं मुख्य सिद्धांत क्या है?`,
        backAnswer: answer.slice(0, 260),
        memoryTip: 'परीक्षा से पहले इस AI फ्लैशकार्ड का 2 बार उच्चारण करें।'
      };
      setCards(prev => [newCard, ...prev]);
      setCurrentIndex(0);
      setIsFlipped(false);
      recordStudyActivity('flashcard', topic, answer.slice(0, 200), 100);
    } catch {
      // ignore
    } finally {
      setIsGenerating(false);
    }
  };

  const speakCard = (text: string) => {
    playNaturalSpeech(text, undefined, undefined, 0.95);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5 animate-fade-in pb-12 text-white">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-indigo-950/50 p-5 sm:p-6 rounded-3xl border border-amber-500/30 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase border border-amber-500/30 mb-2">
              <Zap className="w-3.5 h-3.5" />
              <span>1-मिनट सुपरफास्ट एक्टिव रिकॉल &amp; कमज़ोर विषय टारगेट</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white font-hindi-title">
              1-मिनट रीकैप &amp; स्मार्ट फ्लैशकार्ड्स
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              कार्ड पर क्लिक करके उत्तर पलटें। आपके कमज़ोर विषयों (Weak Topics) के कार्ड यहाँ ऑटो-जनरेट होकर दिखते हैं।
            </p>
          </div>
          <div className="bg-slate-950 px-4 py-2.5 rounded-2xl border border-slate-800 text-center shrink-0">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">याद किए गए कार्ड</span>
            <span className="text-lg font-black text-emerald-400 font-mono">
              {masteredIds.length} / {cards.length}
            </span>
          </div>
        </div>

        {weakTopicsList.length > 0 && (
          <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-200 flex items-center gap-2 font-bold">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>कमज़ोर विषय फ्लैशकार्ड्स सक्रिय: {weakTopicsList.slice(0, 3).join(', ')}</span>
          </div>
        )}

        {/* Custom AI Flashcard Generator Bar */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-800">
          <input
            type="text"
            value={customTopic}
            onChange={e => setCustomTopic(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleGenerateFlashcard()}
            placeholder="किसी भी कमज़ोर विषय का नाम लिखें (जैसे: विटामिन, अनुच्छेद 32, त्रिकोणमिति)..."
            className="flex-1 bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-2xl px-4 py-2 text-xs sm:text-sm text-white outline-none"
          />
          <button
            onClick={handleGenerateFlashcard}
            disabled={isGenerating}
            className="px-4 py-2 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow"
          >
            <Plus className="w-4 h-4" />
            <span>{isGenerating ? 'बन रहा है...' : 'AI फ्लैशकार्ड जोड़ें'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Flip Card */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className={`min-h-[280px] rounded-3xl p-6 sm:p-8 border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-2xl select-none ${
          isFlipped
            ? 'bg-gradient-to-br from-emerald-950/70 via-[#091122] to-slate-950 border-emerald-500/50'
            : 'bg-gradient-to-br from-[#091122] via-slate-900 to-indigo-950/40 border-amber-500/40 hover:border-amber-400'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs font-bold text-cyan-300 flex items-center gap-1.5">
            {currentCard.isWeakTopicTarget && <Target className="w-3.5 h-3.5 text-rose-400" />}
            <span>{currentCard.category} • कार्ड {currentIndex + 1}/{cards.length}</span>
          </span>
          <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => speakCard(isFlipped ? currentCard.backAnswer : currentCard.frontQuestion)}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 hover:text-white cursor-pointer"
              title="सुनें"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleMastered(currentCard.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1 cursor-pointer ${
                masteredIds.includes(currentCard.id)
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{masteredIds.includes(currentCard.id) ? 'याद हो गया!' : 'मार्क करें'}</span>
            </button>
          </div>
        </div>

        <div className="my-6 text-center space-y-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block">
            {isFlipped ? '✅ सटीक उत्तर एवं मेमोरी ट्रिक (ANSWER)' : '❓ प्रश्न (उत्तर देखने के लिए कार्ड पर टैप करें)'}
          </span>
          <h2 className="text-base sm:text-xl font-black text-white leading-relaxed">
            {isFlipped ? currentCard.backAnswer : currentCard.frontQuestion}
          </h2>
          {isFlipped && (
            <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-emerald-500/30 text-xs text-emerald-300 max-w-xl mx-auto">
              💡 <strong>मेमोरी टिप:</strong> {currentCard.memoryTip}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
            <RotateCw className="w-3.5 h-3.5" />
            <span>{isFlipped ? 'वापस प्रश्न देखने के लिए टैप करें' : 'उत्तर पलटने के लिए टैप करें'}</span>
          </span>
          <span>Active Recall Engine</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={handlePrev}
          className="px-5 py-3 rounded-2xl bg-[#091122] hover:bg-slate-900 border border-slate-800 text-white font-bold text-xs flex items-center gap-2 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>पिछला कार्ड</span>
        </button>

        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs cursor-pointer shadow-lg"
        >
          {isFlipped ? 'प्रश्न दिखाएं' : 'उत्तर पलटें (Flip)'}
        </button>

        <button
          onClick={handleNext}
          className="px-5 py-3 rounded-2xl bg-[#091122] hover:bg-slate-900 border border-slate-800 text-white font-bold text-xs flex items-center gap-2 cursor-pointer"
        >
          <span>अगला कार्ड</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default FlashcardsView;
