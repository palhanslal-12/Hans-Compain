import React from 'react';
import { X, Target, CheckCircle2 } from 'lucide-react';

export const StudentGoalOnboardingModal = ({
  isOpen,
  onClose,
  selectedGoal = 'SSC & Steno 2026',
  onSelectGoal
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedGoal?: string;
  onSelectGoal?: (goal: string) => void;
}) => {
  if (!isOpen) return null;

  const goals = [
    { id: 'SSC & Steno 2026', label: '🎯 SSC CGL / CHSL / Steno 2026', sub: '80/100 WPM Shorthand + TCS iON CBT' },
    { id: 'Railway RRB 2026', label: '🚂 Railway RRB NTPC & Group D', sub: 'NCERT Science, Maths & Reasoning' },
    { id: 'Banking & State PCS', label: '🏦 BPSC / UPPSC & Banking PO', sub: 'Current Affairs, GK & Quantitative Aptitude' },
    { id: '10th & 12th Board 2026', label: '📚 10th & 12th Board Academic Exams', sub: 'BSEB Bihar, UP Board, CBSE & Bharati Bhawan' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
            <Target className="w-5 h-5" />
            <span>अपना मुख्य परीक्षा लक्ष्य चुनें (Select Target Exam Goal)</span>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-3">
          {goals.map(g => {
            const active = selectedGoal === g.id;
            return (
              <button
                key={g.id}
                onClick={() => {
                  if (onSelectGoal) onSelectGoal(g.id);
                  onClose();
                }}
                className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  active
                    ? 'bg-indigo-600/20 border-indigo-400 text-white'
                    : 'bg-slate-950 border-slate-800 hover:border-indigo-500 text-slate-200'
                }`}
              >
                <div>
                  <div className="text-sm font-black">{g.label}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{g.sub}</div>
                </div>
                {active && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
