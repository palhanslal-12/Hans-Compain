import React from 'react';
import { X, Trophy, Clock, BookOpen, Swords, ArrowRight } from 'lucide-react';

interface CompetitiveExamsHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOption: (viewId: string) => void;
}

export const CompetitiveExamsHubModal: React.FC<CompetitiveExamsHubModalProps> = ({
  isOpen,
  onClose,
  onSelectOption
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#091122] border-2 border-slate-800 rounded-3xl p-6 sm:p-7 max-w-lg w-full space-y-5 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xl shrink-0">
              🏆
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                प्रतियोगी परीक्षा हब (Competitive Exams)
              </h3>
              <p className="text-[11px] text-slate-400">
                SSC, Railway, BPSC, Police व State Exams
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-950 border border-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Main Action Cards matching Screenshot 11 */}
        <div className="space-y-3">
          {/* Card 1: Single Mock Test */}
          <div
            onClick={() => {
              onSelectOption('mock');
              onClose();
            }}
            className="p-4 rounded-2xl bg-[#03060E] border border-indigo-900/60 hover:border-indigo-500 cursor-pointer transition-all hover:bg-[#0D1830] flex items-center justify-between gap-3 group shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-950/60 border border-indigo-500/40 flex items-center justify-center text-xl shrink-0">
                ⏱️
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-black text-white group-hover:text-indigo-300 transition-colors">
                  सिंगल मॉक टेस्ट
                </h4>
                <p className="text-[10px] text-slate-400">
                  TCS टाइमर, नेगेटिव मार्किंग व लाइव रिजल्ट
                </p>
              </div>
            </div>
            <button className="text-[11px] text-indigo-400 font-bold flex items-center gap-1 group-hover:text-white transition-colors shrink-0 pointer-events-none">
              <span>मॉक टेस्ट शुरू करें</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Unlimited PYQ Vault */}
          <div
            onClick={() => {
              onSelectOption('pyq');
              onClose();
            }}
            className="p-4 rounded-2xl bg-[#03060E] border border-emerald-900/60 hover:border-emerald-500 cursor-pointer transition-all hover:bg-[#0D1830] flex items-center justify-between gap-3 group shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-xl shrink-0">
                📚
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-black text-emerald-300 group-hover:text-white transition-colors">
                  अनलिमिटेड PYQ वॉल्ट
                </h4>
                <p className="text-[10px] text-slate-400">
                  2019-2025 टॉपिक-वार प्रश्न बैंक
                </p>
              </div>
            </div>
            <button className="text-[11px] text-emerald-400 font-bold flex items-center gap-1 group-hover:text-white transition-colors shrink-0 pointer-events-none">
              <span>PYQ बैंक खोलें</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: Live Group Quiz Battle */}
          <div
            onClick={() => {
              onSelectOption('group-quiz');
              onClose();
            }}
            className="p-4 rounded-2xl bg-[#03060E] border border-teal-900/60 hover:border-teal-400 cursor-pointer transition-all hover:bg-[#0D1830] flex items-center justify-between gap-3 group shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-950/60 border border-teal-500/40 flex items-center justify-center text-xl shrink-0">
                ⚔️
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs sm:text-sm font-black text-teal-300 group-hover:text-white transition-colors">
                    लाइव ग्रुप क्विज़ बैटल
                  </h4>
                  <span className="text-[8px] bg-emerald-400 text-slate-950 px-1 py-0.2 rounded font-black">
                    VOICE & RANKS
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">
                  लाइव वॉइस स्पीकर व ऑल-इंडिया लीडरबोर्ड
                </p>
              </div>
            </div>
            <button className="text-[11px] text-teal-400 font-bold flex items-center gap-1 group-hover:text-white transition-colors shrink-0 pointer-events-none">
              <span>जवाइन करें</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
