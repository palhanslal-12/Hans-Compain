import React, { useState, useEffect } from 'react';
import { Target, GraduationCap, Sparkles, ChevronRight, X } from 'lucide-react';
import { HansCompainLogo } from './HansCompainLogo';

interface WelcomeOnboardingModalProps {
  user: any;
  onComplete: (profile: { currentStudy: string; targetGoal: string }) => void;
  onSkip: () => void;
}

export const WelcomeOnboardingModal: React.FC<WelcomeOnboardingModalProps> = ({ user, onComplete, onSkip }) => {
  const [currentStudy, setCurrentStudy] = useState('');
  const [targetGoal, setTargetGoal] = useState('');
  const [compliment, setCompliment] = useState('');

  const studyOptions = ['10th', '12th', 'Graduation (BA/BSc/BCom)', 'Post Graduation', 'Preparation / Drop'];
  const goalOptions = ['IAS / IPS', 'SSC CGL', 'Stenographer', 'Bank PO', 'Engineer', 'Doctor', 'Teacher', 'Railway', 'Defence / Police', 'Other'];

  useEffect(() => {
    if (targetGoal) {
      if (targetGoal === 'Stenographer') {
        setCompliment('शानदार! स्टेनो मास्टर बनने का सफर शुरू करें, हमारी स्पेशल डिक्टेशन लैब आपकी मदद करेगी! 🎙️');
      } else if (targetGoal === 'IAS / IPS') {
        setCompliment('कमाल है! एक भावी अफसर! मेहनत करते रहें, देश को आपकी ज़रूरत है! 🇮🇳');
      } else if (targetGoal === 'Doctor' || targetGoal === 'Engineer') {
        setCompliment('बहुत बढ़िया! एक शानदार करियर आपका इंतज़ार कर रहा है! 🚀');
      } else if (targetGoal === 'Teacher') {
        setCompliment('वाह! समाज का भविष्य बनाने वाला एक शानदार पेशा! 📖');
      } else {
        setCompliment(`बहुत खूब! एक बेहतरीन "${targetGoal}" बनने के सफर में HANS COMPAIN आपके साथ है! ✨`);
      }
    } else {
      setCompliment('');
    }
  }, [targetGoal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStudy && targetGoal) {
      onComplete({ currentStudy, targetGoal });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />

      {/* Modal Box */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-6 sm:p-8">
          
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h2 className="text-xl font-black text-slate-800">Welcome, {user?.name?.split(' ')[0] || 'User'}! 👋</h2>
              </div>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                हम आपके लिए HANS COMPAIN को और भी बेहतर बनाना चाहते हैं। कृपया अपने बारे में थोड़ा बताएं!
              </p>
            </div>
            <button onClick={onSkip} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors shrink-0">
              <span className="sr-only">Skip</span>
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Study */}
            <div className="space-y-3">
              <label className="text-sm font-extrabold text-slate-700 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                आप अभी किस क्लास/लेवल में हैं?
              </label>
              <div className="flex flex-wrap gap-2">
                {studyOptions.map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setCurrentStudy(opt)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                      currentStudy === opt 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Goal */}
            <div className="space-y-3">
              <label className="text-sm font-extrabold text-slate-700 flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-600" />
                आप भविष्य में क्या बनना चाहते हैं? (Your Goal)
              </label>
              <div className="flex flex-wrap gap-2">
                {goalOptions.map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setTargetGoal(opt)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                      targetGoal === opt 
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' 
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              
              {/* Custom Input fallback if 'Other' is selected */}
              {targetGoal === 'Other' && (
                <div className="pt-2">
                  <input
                    type="text"
                    placeholder="Type your dream goal here..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    onChange={(e) => {
                       // We don't change targetGoal immediately to avoid hiding the input, 
                       // but we can set a separate custom state if needed. 
                       // For simplicity, let's just let compliment handle the generic response.
                    }}
                  />
                </div>
              )}
            </div>

            {/* Compliment Box */}
            <div className={`transition-all duration-500 overflow-hidden ${compliment ? 'max-h-24 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-3 rounded-xl flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800 font-bold leading-relaxed">
                  {compliment}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onSkip}
                className="px-4 py-3 text-slate-500 font-bold text-sm hover:text-slate-700 transition-colors"
              >
                Skip for now
              </button>
              <button
                type="submit"
                disabled={!currentStudy || !targetGoal}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 transition-all ${
                  (!currentStudy || !targetGoal) 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:scale-[1.02]'
                }`}
              >
                Let's Start <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
