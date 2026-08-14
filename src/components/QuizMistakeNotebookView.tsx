import React, { useState } from 'react';
import { 
  BookOpen, 
  Trash2, 
  CheckCircle, 
  RotateCcw, 
  Play, 
  Volume2, 
  VolumeX, 
  Search, 
  Brain, 
  Sparkles, 
  Filter, 
  Award,
  ChevronDown,
  ChevronUp,
  AlertTriangle
} from 'lucide-react';
import { MistakeNotebookItem, QuizQuestion } from '../types';
import { speakText, stopAllSpeech } from '../utils/speechUtils';

interface QuizMistakeNotebookViewProps {
  mistakes: MistakeNotebookItem[];
  onDeleteMistake: (id: string) => void;
  onClearAllMistakes: () => void;
  onToggleMastered: (id: string) => void;
  onStartRetest: (questions: QuizQuestion[], testSubject: string) => void;
  language?: 'hindi' | 'english';
}

export const QuizMistakeNotebookView: React.FC<QuizMistakeNotebookViewProps> = ({
  mistakes,
  onDeleteMistake,
  onClearAllMistakes,
  onToggleMastered,
  onStartRetest,
  language = 'hindi'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('all');
  const [filterMastered, setFilterMastered] = useState<'all' | 'unmastered' | 'mastered'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeSpeechId, setActiveSpeechId] = useState<string | null>(null);

  // Extract unique subjects
  const subjects = Array.from(new Set(mistakes.map(m => m.subject).filter(Boolean)));

  const filteredMistakes = mistakes.filter(item => {
    const matchSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.explanation.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchSubject = selectedSubjectFilter === 'all' || item.subject === selectedSubjectFilter;
    const matchMastered = filterMastered === 'all' 
      ? true 
      : filterMastered === 'mastered' 
        ? item.mastered 
        : !item.mastered;

    return matchSearch && matchSubject && matchMastered;
  });

  const unmasteredCount = mistakes.filter(m => !m.mastered).length;
  const masteredCount = mistakes.filter(m => m.mastered).length;

  const handleLaunchRetest = () => {
    const targetItems = filteredMistakes.length > 0 ? filteredMistakes : mistakes;
    if (targetItems.length === 0) return;

    const quizQuestions: QuizQuestion[] = targetItems.map(item => ({
      question: item.question,
      options: item.options,
      answerIndex: item.correctAnswerIndex,
      explanation: item.explanation,
      hint: item.hint
    }));

    const title = selectedSubjectFilter !== 'all' 
      ? `Mistake Retest: ${selectedSubjectFilter}`
      : 'Targeted Mistake Revision Test';

    onStartRetest(quizQuestions, title);
  };

  const handleSpeech = (id: string, text: string) => {
    if (activeSpeechId === id) {
      stopAllSpeech();
      setActiveSpeechId(null);
    } else {
      speakText(text, language === 'hindi' ? 'hi-IN' : 'en-US');
      setActiveSpeechId(id);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in text-left">
      
      {/* Top Banner with Stats & Retest Action */}
      <div className="bg-gradient-to-r from-[#1B112C] via-[#120F24] to-[#0A1329] border border-purple-500/30 rounded-3xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>{language === 'hindi' ? 'गलती रजिस्टर (Mistake Revision Notebook)' : 'Mistake Revision Notebook'}</span>
                <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full font-mono font-bold">
                  {mistakes.length} {language === 'hindi' ? 'गलत प्रश्न' : 'Mistakes'}
                </span>
              </h3>
            </div>
            <p className="text-xs text-slate-300 max-w-xl">
              {language === 'hindi' 
                ? 'जिन प्रश्नों में परीक्षा या क्विज के दौरान आपसे गलतियां हुईं, वे यहाँ सुरक्षित हैं ताकि आप बार-बार दोहराकर 100% सही कर सकें।'
                : 'All questions you got wrong during quizzes are saved here for deliberate practice, AI analysis, and retesting.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleLaunchRetest}
              disabled={filteredMistakes.length === 0}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 transition-all shadow-lg cursor-pointer ${
                filteredMistakes.length > 0
                  ? 'bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-500 hover:to-amber-500 text-white shadow-purple-900/30 hover:scale-[1.02]'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              }`}
            >
              <RotateCcw className="w-4 h-4 text-amber-300" />
              <span>
                {language === 'hindi' 
                  ? `🔄 सिर्फ गलत प्रश्नों का री-टेस्ट दें (${filteredMistakes.length})` 
                  : `🔄 Retest Mistakes (${filteredMistakes.length})`}
              </span>
            </button>

            {mistakes.length > 0 && (
              <button
                onClick={onClearAllMistakes}
                className="p-2.5 rounded-2xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                title={language === 'hindi' ? 'सभी गलतियाँ हटाएं' : 'Clear all'}
              >
                <Trash2 className="w-4 h-4 text-rose-400" />
              </button>
            )}
          </div>
        </div>

        {/* Stats Pill Row */}
        <div className="mt-4 pt-4 border-t border-purple-500/20 flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-rose-300 bg-rose-950/40 px-3 py-1 rounded-xl border border-rose-500/30">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{language === 'hindi' ? 'अभ्यास बाकी (Pending):' : 'Pending Revision:'} <strong>{unmasteredCount}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-300 bg-emerald-950/40 px-3 py-1 rounded-xl border border-emerald-500/30">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{language === 'hindi' ? 'मास्टर्ड (Mastered):' : 'Mastered:'} <strong>{masteredCount}</strong></span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-[#0B0F19] border border-slate-800 p-3 rounded-2xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={language === 'hindi' ? 'गलत प्रश्न या विषय खोजें...' : 'Search question or subject...'}
            className="w-full pl-9 pr-3 py-2 bg-slate-900/90 border border-slate-700/70 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
          />
        </div>

        {subjects.length > 0 && (
          <select
            value={selectedSubjectFilter}
            onChange={(e) => setSelectedSubjectFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            <option value="all">{language === 'hindi' ? 'सभी विषय (All Subjects)' : 'All Subjects'}</option>
            {subjects.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        )}

        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-[11px]">
          <button
            onClick={() => setFilterMastered('all')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              filterMastered === 'all' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'hindi' ? 'सभी' : 'All'}
          </button>
          <button
            onClick={() => setFilterMastered('unmastered')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              filterMastered === 'unmastered' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'hindi' ? 'बाकी' : 'Pending'}
          </button>
          <button
            onClick={() => setFilterMastered('mastered')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              filterMastered === 'mastered' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'hindi' ? 'मास्टर' : 'Mastered'}
          </button>
        </div>
      </div>

      {/* Mistake Cards List */}
      {filteredMistakes.length === 0 ? (
        <div className="p-8 sm:p-12 text-center bg-[#0B0F19] border border-slate-800 rounded-3xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 flex items-center justify-center mx-auto">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-white">
            {mistakes.length === 0 
              ? (language === 'hindi' ? 'शाबाश! अभी कोई गलत प्रश्न दर्ज नहीं है।' : 'No mistakes logged yet!')
              : (language === 'hindi' ? 'इस फिल्टर के तहत कोई प्रश्न नहीं मिला।' : 'No matching questions found in filter.')}
          </h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {language === 'hindi'
              ? 'जब आप क्विज़ में किसी प्रश्न का गलत उत्तर देंगे तो आप उसे सीधे इस रजिस्टर में जोड़ सकते हैं ताकि परीक्षा से पहले रिवीजन कर सकें।'
              : 'When you take a quiz and make an error, you can add it to this revision notebook to reinforce weak spots.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMistakes.map((item, idx) => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className={`bg-[#0D121F] border rounded-2xl p-4 transition-all ${
                  item.mastered
                    ? 'border-emerald-500/30 bg-[#0A1616]'
                    : 'border-slate-800 hover:border-purple-500/40'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/30">
                        #{idx + 1} {item.subject}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {item.date}
                      </span>
                      {item.mastered && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>{language === 'hindi' ? 'सीख लिया / Mastered' : 'Mastered'}</span>
                        </span>
                      )}
                    </div>
                    
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-100 leading-snug">
                      {item.question}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleSpeech(item.id, `${item.question}. Correct answer: ${item.options[item.correctAnswerIndex]}. ${item.explanation}`)}
                      className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                      title={language === 'hindi' ? 'ऑडियो सुनें' : 'Listen audio'}
                    >
                      {activeSpeechId === item.id ? (
                        <VolumeX className="w-4 h-4 text-rose-400" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-cyan-400" />
                      )}
                    </button>

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Question Options Quick Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-xs">
                  {item.options.map((opt, oIdx) => {
                    const isSelected = oIdx === item.userAnswerIndex;
                    const isCorrect = oIdx === item.correctAnswerIndex;
                    return (
                      <div
                        key={oIdx}
                        className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                          isCorrect
                            ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200 font-bold'
                            : isSelected
                              ? 'bg-rose-950/40 border-rose-500/50 text-rose-200 line-through'
                              : 'bg-slate-900/60 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                        {isCorrect && <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
                        {isSelected && !isCorrect && <span className="text-[10px] text-rose-400 font-bold uppercase">Wrong Pick</span>}
                      </div>
                    );
                  })}
                </div>

                {/* Expanded Details & AI Remediation */}
                {isExpanded && (
                  <div className="mt-3.5 pt-3.5 border-t border-slate-800/80 space-y-3 animate-fade-in text-xs">
                    
                    {/* Explanation */}
                    <div className="p-3 bg-purple-950/20 border border-purple-500/30 rounded-xl space-y-1.5">
                      <span className="font-bold text-purple-300 flex items-center gap-1.5 text-[11px]">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>{language === 'hindi' ? 'विस्तृत व्याख्या & सही तर्क:' : 'Full Explanation & Proof:'}</span>
                      </span>
                      <p className="text-slate-200 leading-relaxed">
                        {item.explanation}
                      </p>
                    </div>

                    {/* AI Remediation if cached */}
                    {item.aiRemediation && (
                      <div className="p-3 bg-indigo-950/20 border border-indigo-500/30 rounded-xl space-y-1">
                        <span className="font-bold text-indigo-300 text-[11px] block">
                          🤖 {language === 'hindi' ? 'AI कम्पेनियन गलती विश्लेषण:' : 'AI Mistake Analysis:'}
                        </span>
                        <div className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                          {item.aiRemediation}
                        </div>
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                      <button
                        onClick={() => onToggleMastered(item.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          item.mastered
                            ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-500/40'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                        }`}
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>
                          {item.mastered
                            ? (language === 'hindi' ? 'मास्टर्ड (पुनः खोलें)' : 'Mastered (Re-open)')
                            : (language === 'hindi' ? 'सीख लिया? (Mark as Mastered)' : 'Mark as Mastered')}
                        </span>
                      </button>

                      <button
                        onClick={() => onDeleteMistake(item.id)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                        <span>{language === 'hindi' ? 'हटाएं' : 'Delete'}</span>
                      </button>
                    </div>

                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
