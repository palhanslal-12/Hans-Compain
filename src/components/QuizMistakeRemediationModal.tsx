import React, { useState } from 'react';
import { Sparkles, Brain, CheckCircle, AlertCircle, Volume2, VolumeX, BookOpen, BookmarkCheck, ArrowRight, X, Loader } from 'lucide-react';
import { QuizQuestion, MistakeNotebookItem } from '../types';
import { speakText, stopAllSpeech } from '../utils/speechUtils';

interface QuizMistakeRemediationModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: QuizQuestion;
  selectedOptionIndex: number;
  subject: string;
  level: string;
  language?: 'hindi' | 'english';
  onSaveToNotebook?: (item: MistakeNotebookItem) => void;
  isSavedInNotebook?: boolean;
}

export const QuizMistakeRemediationModal: React.FC<QuizMistakeRemediationModalProps> = ({
  isOpen,
  onClose,
  question,
  selectedOptionIndex,
  subject,
  level,
  language = 'hindi',
  onSaveToNotebook,
  isSavedInNotebook = false
}) => {
  const [remediation, setRemediation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(isSavedInNotebook);

  React.useEffect(() => {
    if (isOpen && !remediation) {
      fetchRemediation();
    }
  }, [isOpen]);

  const fetchRemediation = async () => {
    setIsLoading(true);
    try {
      const selectedText = question.options[selectedOptionIndex] || 'Selected Option';
      const correctText = question.options[question.answerIndex] || 'Correct Option';

      const res = await fetch('/api/quiz/explain-mistake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.question,
          options: question.options,
          selectedOption: selectedText,
          correctOption: correctText,
          subject,
          lang: language
        })
      });

      if (!res.ok) throw new Error('Could not generate explanation');
      const data = await res.json();
      setRemediation(data.remediation || question.explanation);
    } catch (err) {
      console.error(err);
      // Fallback
      setRemediation(
        language === 'hindi'
          ? `💡 **गलती का कारण**: आपने विकल्प "${question.options[selectedOptionIndex]}" चुना, जो भ्रामक विकल्प (Distractor) था।\n\n🎯 **सही उत्तर का तर्क**: सही विकल्प "${question.options[question.answerIndex]}" है क्योंकि ${question.explanation}\n\n🧠 **याद रखने की ट्रिक**: मुख्य नियम और परीक्षा सिद्धांतों को नोट करें और दोहराएं!`
          : `💡 **Why this was wrong**: You selected "${question.options[selectedOptionIndex]}", which is a common distractor trap.\n\n🎯 **Why correct answer is right**: "${question.options[question.answerIndex]}" is correct because ${question.explanation}\n\n🧠 **Exam Memory Hack**: Review key formulas and eliminate traps before finalizing.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleVoice = () => {
    if (isSpeaking) {
      stopAllSpeech();
      setIsSpeaking(false);
    } else {
      const textToRead = remediation || question.explanation;
      speakText(textToRead, language === 'hindi' ? 'hi-IN' : 'en-US');
      setIsSpeaking(true);
    }
  };

  const handleSaveToNotebook = () => {
    if (!saved && onSaveToNotebook) {
      const notebookItem: MistakeNotebookItem = {
        id: `mistake-${Date.now()}`,
        question: question.question,
        options: question.options,
        userAnswerIndex: selectedOptionIndex,
        correctAnswerIndex: question.answerIndex,
        explanation: question.explanation,
        hint: question.hint,
        subject,
        level,
        date: new Date().toLocaleDateString('hi-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        aiRemediation: remediation || undefined,
        mastered: false
      };
      onSaveToNotebook(notebookItem);
      setSaved(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-purple-500/40 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-fade-in">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-purple-950/80 via-indigo-950/80 to-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-300">
              <Brain className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                <span>{language === 'hindi' ? 'AI डाउट क्लेरिफायर & गलती विश्लेषण' : 'AI Mistake Deep Remediation'}</span>
                <span className="text-[9px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full uppercase font-mono">
                  Smart Companion
                </span>
              </h3>
              <p className="text-[11px] text-purple-200/80">
                {language === 'hindi' ? 'जानिए आपने क्या गलती की और परीक्षा में इसे कैसे सही करें' : 'Understand why this option was incorrect & how to master this concept'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopAllSpeech();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-800/80 hover:bg-slate-700 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 text-left">
          
          {/* Question Summary */}
          <div className="p-3.5 bg-[#090D16] border border-slate-800 rounded-2xl space-y-2">
            <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">
              {language === 'hindi' ? 'प्रश्न विवरण (Question)' : 'Target Question'}
            </span>
            <p className="text-xs sm:text-sm font-semibold text-slate-100 leading-relaxed">
              {question.question}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-850 text-xs">
              <div className="p-2 rounded-xl bg-rose-950/30 border border-rose-500/40 text-rose-300 flex items-start gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[9px] uppercase font-bold block text-rose-400">
                    {language === 'hindi' ? 'आपका चुना हुआ उत्तर (गलत)' : 'Your Selected Answer (Wrong)'}
                  </span>
                  <span className="font-semibold">{question.options[selectedOptionIndex]}</span>
                </div>
              </div>

              <div className="p-2 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 flex items-start gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[9px] uppercase font-bold block text-emerald-400">
                    {language === 'hindi' ? 'सही उत्तर (Correct Answer)' : 'Correct Option'}
                  </span>
                  <span className="font-semibold">{question.options[question.answerIndex]}</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Remediation Breakdown */}
          <div className="p-4 bg-purple-950/20 border border-purple-500/30 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{language === 'hindi' ? 'AI कम्पेनियन का स्पष्टीकरण व मेमोरी ट्रिक:' : 'Companion Analysis & Shortcut Hack:'}</span>
              </h4>
              <button
                onClick={handleToggleVoice}
                className="text-[11px] px-2.5 py-1 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer font-semibold"
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                    <span>{language === 'hindi' ? 'रोकें' : 'Stop'}</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{language === 'hindi' ? 'सुनें (Listen)' : 'Listen'}</span>
                  </>
                )}
              </button>
            </div>

            {isLoading ? (
              <div className="py-8 flex flex-col items-center justify-center gap-2 text-purple-300 text-xs">
                <Loader className="w-6 h-6 animate-spin text-purple-400" />
                <span>{language === 'hindi' ? 'AI उत्तर की गहराई से व्याख्या तैयार कर रहा है...' : 'Generating pedagogical error breakdown...'}</span>
              </div>
            ) : (
              <div className="text-xs sm:text-sm text-slate-200 leading-relaxed space-y-2 whitespace-pre-wrap">
                {remediation || question.explanation}
              </div>
            )}
          </div>

          {/* Hint Card if Available */}
          {question.hint && (
            <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl flex items-start gap-2 text-xs text-amber-200">
              <span className="text-base">💡</span>
              <div>
                <span className="font-bold text-amber-300 block text-[10px] uppercase">
                  {language === 'hindi' ? 'अवधारणा संकेत (Conceptual Hint):' : 'Key Hint:'}
                </span>
                <span>{question.hint}</span>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-3.5 sm:p-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-2.5">
          <button
            onClick={handleSaveToNotebook}
            disabled={saved}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              saved 
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 cursor-default'
                : 'bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40'
            }`}
          >
            {saved ? (
              <>
                <BookmarkCheck className="w-4 h-4 text-emerald-400" />
                <span>{language === 'hindi' ? 'गलती रजिस्टर में सेव्ड' : 'Saved in Mistake Book'}</span>
              </>
            ) : (
              <>
                <BookOpen className="w-4 h-4 text-amber-300" />
                <span>{language === 'hindi' ? '📓 गलती रजिस्टर (Mistake Book) में जोड़ें' : 'Save to Mistake Notebook'}</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              stopAllSpeech();
              onClose();
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md cursor-pointer border-none"
          >
            <span>{language === 'hindi' ? 'समझ आ गया / आगे बढ़ें' : 'Got it / Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
