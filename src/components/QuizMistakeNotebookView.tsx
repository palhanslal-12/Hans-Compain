import React, { useState } from 'react';
import { 
  BookOpen, 
  Trash2, 
  Play, 
  CheckCircle, 
  Search, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Award,
  Filter
} from 'lucide-react';
import { MistakeNotebookItem, QuizQuestion } from '../types';
import { speakText, stopAllSpeech } from '../utils/speechUtils';

interface QuizMistakeNotebookViewProps {
  mistakes: MistakeNotebookItem[];
  onRetest: (questions: QuizQuestion[], title: string) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onToggleMastered: (id: string) => void;
  language?: string;
}

export const QuizMistakeNotebookView: React.FC<QuizMistakeNotebookViewProps> = ({
  mistakes,
  onRetest,
  onDelete,
  onClearAll,
  onToggleMastered,
  language = 'hindi',
}) => {
  const isHindi = language === 'hindi';
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'unmastered' | 'mastered'>('all');
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const filteredMistakes = mistakes.filter((item) => {
    const matchesSearch = 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.subject && item.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.explanation && item.explanation.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (filterMode === 'unmastered') return !item.mastered;
    if (filterMode === 'mastered') return item.mastered;
    return true;
  });

  const handleRetestAll = () => {
    const questionsToTest: QuizQuestion[] = filteredMistakes.map(m => ({
      question: m.question,
      options: m.options,
      answerIndex: m.correctAnswerIndex,
      explanation: m.explanation || m.remedialExplanation || '',
      hint: m.hint,
      difficulty: (['standard', 'moderate', 'hard', 'extreme'].includes(m.difficulty as any) ? m.difficulty : 'standard') as 'standard' | 'moderate' | 'hard' | 'extreme',
    }));

    if (questionsToTest.length === 0) return;
    onRetest(questionsToTest, `Mistake Notebook Remediation (${filteredMistakes.length} Qs)`);
  };

  const handlePlayAudio = (item: MistakeNotebookItem) => {
    if (playingAudioId === item.id) {
      stopAllSpeech();
      setPlayingAudioId(null);
    } else {
      stopAllSpeech();
      const speechText = `प्रश्न: ${item.question}. सही उत्तर: ${item.options[item.correctAnswerIndex]}. व्याख्या: ${item.explanation || item.remedialExplanation}`;
      speakText(speechText, {
        lang: 'hi-IN',
        onStart: () => setPlayingAudioId(item.id),
        onEnd: () => setPlayingAudioId(null),
        onError: () => setPlayingAudioId(null),
      });
    }
  };

  const masteredCount = mistakes.filter(m => m.mastered).length;
  const unmasteredCount = mistakes.length - masteredCount;

  return (
    <div className="space-y-6 text-left animate-fade-in">
      
      {/* Header Banner */}
      <div className="p-5 bg-gradient-to-r from-rose-950/40 via-[#0B0F19] to-indigo-950/40 border border-rose-500/30 rounded-3xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-purple-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>स्मार्ट गलती रजिस्टर (Mistake Notebook)</span>
                <span className="text-xs bg-rose-500/20 text-rose-300 font-extrabold px-2.5 py-0.5 rounded-full border border-rose-500/30">
                  {mistakes.length} प्रश्न
                </span>
              </h3>
              <p className="text-xs text-slate-300 font-medium">
                क्विज़ में गलत हुए प्रश्नों की स्वतः सूची, वैचारिक व्याख्या और लक्षित री-टेस्ट
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {filteredMistakes.length > 0 && (
              <button
                onClick={handleRetestAll}
                className="px-4 py-2.5 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-rose-600/20 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>री-टेस्ट शुरू करें ({filteredMistakes.length})</span>
              </button>
            )}
            {mistakes.length > 0 && (
              <button
                onClick={onClearAll}
                className="px-3 py-2.5 bg-slate-900 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 font-semibold rounded-xl text-xs transition-all cursor-pointer"
                title="Clear all recorded mistakes"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Stats Pill Row */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-850">
          <div className="p-2.5 bg-[#090D16] border border-slate-800 rounded-xl text-center">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">कुल गलतियाँ</span>
            <span className="text-base font-black text-white">{mistakes.length}</span>
          </div>
          <div className="p-2.5 bg-[#090D16] border border-rose-500/20 rounded-xl text-center">
            <span className="text-[10px] text-rose-400 font-bold block uppercase">अभ्यास बाकी</span>
            <span className="text-base font-black text-rose-300">{unmasteredCount}</span>
          </div>
          <div className="p-2.5 bg-[#090D16] border border-emerald-500/20 rounded-xl text-center">
            <span className="text-[10px] text-emerald-400 font-bold block uppercase">Mastered (सुधर गया)</span>
            <span className="text-base font-black text-emerald-300">{masteredCount}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="गलती रजिस्टर में प्रश्न या विषय खोजें..."
            className="w-full text-xs py-2.5 pl-10 pr-4 bg-[#090D16] border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>

        <div className="flex items-center gap-1 bg-[#090D16] border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterMode === 'all'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            सभी ({mistakes.length})
          </button>
          <button
            onClick={() => setFilterMode('unmastered')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterMode === 'unmastered'
                ? 'bg-rose-600/30 text-rose-300 border border-rose-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            बाकी ({unmasteredCount})
          </button>
          <button
            onClick={() => setFilterMode('mastered')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterMode === 'mastered'
                ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Mastered ({masteredCount})
          </button>
        </div>
      </div>

      {/* Mistakes List */}
      {filteredMistakes.length === 0 ? (
        <div className="p-12 text-center bg-[#090D16] border border-slate-850 rounded-3xl space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-2xl">
            🏆
          </div>
          <h4 className="text-base font-bold text-white">
            {mistakes.length === 0 ? "गलती रजिस्टर बिल्कुल खाली है!" : "कोई मेल खाता प्रश्न नहीं मिला"}
          </h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {mistakes.length === 0 
              ? "जब आप किसी क्विज़ में गलत उत्तर देंगे, तो वह प्रश्न यहाँ स्वतः जुड़ जाएगा ताकि आप दोबारा अभ्यास कर सकें।"
              : "कृपया अपना खोज शब्द या फ़िल्टर बदलकर दोबारा प्रयास करें।"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMistakes.map((item, idx) => {
            const userChoiceText = item.options[item.userAnswerIndex] || 'Selected option';
            const correctChoiceText = item.options[item.correctAnswerIndex] || 'Correct answer';
            const isPlaying = playingAudioId === item.id;

            return (
              <div
                key={item.id}
                className={`p-5 rounded-3xl border transition-all space-y-4 ${
                  item.mastered
                    ? 'bg-[#090D16] border-emerald-500/30'
                    : 'bg-[#0B0F19] border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Card Top Meta */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-850 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20">
                      #{idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-200">
                      {item.subject || 'General Assessment'}
                    </span>
                    {item.difficulty && (
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-slate-800 text-slate-400 rounded-md">
                        {item.difficulty}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePlayAudio(item)}
                      className={`p-1.5 rounded-lg border text-xs transition-all cursor-pointer ${
                        isPlaying
                          ? 'bg-amber-500 text-black border-amber-400'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                      title="Audio explanation in Hindi"
                    >
                      {isPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => onToggleMastered(item.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        item.mastered
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-emerald-500/30'
                      }`}
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{item.mastered ? 'Mastered' : 'Mark Mastered'}</span>
                    </button>

                    <button
                      onClick={() => onDelete(item.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-all cursor-pointer"
                      title="Delete this mistake"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Question */}
                <p className="text-sm font-bold text-white leading-relaxed">
                  {item.question}
                </p>

                {/* Answers Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-3 bg-rose-950/20 border border-rose-500/20 rounded-xl space-y-0.5">
                    <span className="text-[10px] font-bold text-rose-400 uppercase">आपकी गलती (Your Selection):</span>
                    <p className="text-rose-200 font-semibold line-through">{userChoiceText}</p>
                  </div>
                  <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-xl space-y-0.5">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase">सही उत्तर (Correct Answer):</span>
                    <p className="text-emerald-200 font-bold">{correctChoiceText}</p>
                  </div>
                </div>

                {/* Remedial Explanation */}
                {(item.explanation || item.remedialExplanation) && (
                  <div className="p-3 bg-indigo-950/20 border border-indigo-500/20 rounded-xl text-xs text-slate-300 space-y-1">
                    <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[10px] uppercase">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>संकल्पना व्याख्या (Remediation Concept):</span>
                    </div>
                    <p className="leading-relaxed text-slate-300">
                      {item.explanation || item.remedialExplanation}
                    </p>
                  </div>
                )}

                {/* Single Retest Action */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      const singleQ: QuizQuestion = {
                        question: item.question,
                        options: item.options,
                        answerIndex: item.correctAnswerIndex,
                        explanation: item.explanation || item.remedialExplanation || '',
                        hint: item.hint,
                        difficulty: (['standard', 'moderate', 'hard', 'extreme'].includes(item.difficulty as any) ? item.difficulty : 'standard') as 'standard' | 'moderate' | 'hard' | 'extreme',
                      };
                      onRetest([singleQ], `Single Remediation: ${item.subject || 'Mistake Q'}`);
                    }}
                    className="px-3.5 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-indigo-400" />
                    <span>सिर्फ यह प्रश्न हल करें (Re-test This)</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
