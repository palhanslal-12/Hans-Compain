import React, { useState } from 'react';
import { Sparkles, X, Volume2, VolumeX, CheckCircle, AlertCircle, BookOpen, Brain, RotateCcw } from 'lucide-react';
import { QuizQuestion, MistakeNotebookItem } from '../types';
import { speakText, stopAllSpeech } from '../utils/speechUtils';

interface QuizMistakeRemediationModalProps {
  isOpen: boolean;
  onClose: () => void;
  mistake: {
    question: QuizQuestion;
    selectedOptionIdx: number;
  } | null;
  onSaveToNotebook?: (item: MistakeNotebookItem) => void;
  onRetry?: () => void;
}

export const QuizMistakeRemediationModal: React.FC<QuizMistakeRemediationModalProps> = ({
  isOpen,
  onClose,
  mistake,
  onSaveToNotebook,
  onRetry,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  if (!isOpen || !mistake) return null;

  const { question, selectedOptionIdx } = mistake;
  const userOptionText = selectedOptionIdx >= 0 && selectedOptionIdx < question.options.length
    ? question.options[selectedOptionIdx]
    : 'No option selected / Time out';
  const correctOptionText = question.options[question.answerIndex] || 'Correct answer';

  const handleToggleSpeech = () => {
    if (isPlayingAudio) {
      stopAllSpeech();
      setIsPlayingAudio(false);
    } else {
      const speechText = `प्रश्न: ${question.question}. आपका उत्तर था: ${userOptionText}. सही उत्तर है: ${correctOptionText}. व्याख्या: ${question.explanation}`;
      speakText(speechText, {
        lang: 'hi-IN',
        onStart: () => setIsPlayingAudio(true),
        onEnd: () => setIsPlayingAudio(false),
        onError: () => setIsPlayingAudio(false),
      });
    }
  };

  const handleSave = () => {
    if (onSaveToNotebook) {
      const item: MistakeNotebookItem = {
        id: `mistake-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        subject: 'Quiz Assessment',
        difficulty: question.difficulty || 'standard',
        timestamp: new Date().toLocaleDateString('hi-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        question: question.question,
        options: question.options,
        correctAnswerIndex: question.answerIndex,
        userAnswerIndex: selectedOptionIdx >= 0 ? selectedOptionIdx : 0,
        explanation: question.explanation,
        hint: question.hint,
        remedialExplanation: question.explanation,
        attemptsCount: 1,
        mastered: false,
      };
      onSaveToNotebook(item);
      setHasSaved(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#0B0F19] border border-indigo-500/40 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 text-left shadow-2xl shadow-indigo-500/10 relative">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-xl shadow-lg shadow-indigo-500/20">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <span>AI Mistake Remediation & Concept Root</span>
                <span className="text-[10px] bg-rose-500/20 text-rose-300 font-bold px-2 py-0.5 rounded-full border border-rose-500/30">
                  त्रुटि विश्लेषण
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                समझें कि आपसे क्या गलती हुई और सही वैचारिक तर्क क्या है
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSpeech}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isPlayingAudio 
                  ? 'bg-amber-500 text-black border-amber-400 shadow-md animate-pulse' 
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
              title="Listen explanation in Hindi"
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                stopAllSpeech();
                onClose();
              }}
              className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Question Box */}
        <div className="p-4 bg-[#090D16] border border-slate-800 rounded-2xl space-y-2">
          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block">
            मूल प्रश्न (Target Question):
          </span>
          <p className="text-sm font-bold text-slate-100 leading-relaxed">
            {question.question}
          </p>
        </div>

        {/* Comparison: Selected vs Correct */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 bg-rose-950/30 border border-rose-500/30 rounded-2xl space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>आपका चयन (Your Answer):</span>
            </div>
            <p className="text-xs text-rose-200 font-semibold line-through">
              {userOptionText}
            </p>
            <span className="text-[10px] text-rose-300/80 block pt-1">
              ❌ भ्रामक विकल्प या जल्दबाजी में हुआ चयन
            </span>
          </div>

          <div className="p-3.5 bg-emerald-950/30 border border-emerald-500/30 rounded-2xl space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>सही उत्तर (Correct Option):</span>
            </div>
            <p className="text-xs text-emerald-200 font-bold">
              {correctOptionText}
            </p>
            <span className="text-[10px] text-emerald-300/80 block pt-1">
              ✅ 100% सटीक व प्रामाणिक विकल्प
            </span>
          </div>
        </div>

        {/* AI Remedial Explanation */}
        <div className="p-4 bg-gradient-to-br from-indigo-950/50 via-slate-900 to-purple-950/40 border border-indigo-500/30 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-black text-amber-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>AI संकल्पना निदान (Concept Remediation):</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {question.explanation}
          </p>
          {question.hint && (
            <div className="pt-2 border-t border-indigo-500/20 text-[11px] text-amber-300/90 font-medium">
              <strong>💡 याद रखने का सूत्र:</strong> {question.hint}
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <div className="flex items-center gap-2">
            {onRetry && (
              <button
                onClick={() => {
                  stopAllSpeech();
                  onClose();
                  onRetry();
                }}
                className="px-4 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>पुनः प्रयास करें (Try Again)</span>
              </button>
            )}
            {onSaveToNotebook && (
              <button
                onClick={handleSave}
                disabled={hasSaved}
                className="px-4 py-2.5 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{hasSaved ? "सुरक्षित है! 📓" : "गलती रजिस्टर में जोड़ें (Save)"}</span>
              </button>
            )}
          </div>

          <button
            onClick={() => {
              stopAllSpeech();
              onClose();
            }}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
          >
            समझ आ गया (Got it)
          </button>
        </div>

      </div>
    </div>
  );
};
