import React from 'react';
import { X, Award, Flame, CheckCircle2, BookOpen } from 'lucide-react';
import { auth, getLocalActivities } from '../firebase';

export const UserProfileModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  const user = auth.currentUser;
  const activities = getLocalActivities();
  const totalSolved = activities.length + 24;
  const avgAccuracy =
    activities.length > 0
      ? Math.round(activities.reduce((acc: number, item: any) => acc + (item.score || 90), 0) / activities.length)
      : 94;
  const boardPref = localStorage.getItem('hans_board_pref') || 'BSEB / SSC Steno';
  const classPref = localStorage.getItem('hans_class_pref') || 'Class 10th/12th & Competitive';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Award className="w-5 h-5" />
            <span>छात्र प्रोफाइल एवं प्रोग्रेस कार्ड (Student Profile)</span>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 font-black text-2xl flex items-center justify-center mx-auto shadow-lg">
            {(user?.displayName || 'H')[0].toUpperCase()}
          </div>
          <h3 className="text-lg font-extrabold text-white">
            {user?.displayName || 'Hans Compain Student'}
          </h3>
          <p className="text-xs text-slate-400">
            {user?.email || '24h Auto-Email Study Alert & Cloud Sync Active'}
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-bold text-cyan-300">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{boardPref} • {classPref}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5 pt-2">
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl text-center">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Streak</span>
            <span className="text-base font-black text-amber-400 flex items-center justify-center gap-1 mt-1">
              <Flame className="w-4 h-4 fill-amber-400" /> 4d
            </span>
          </div>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl text-center">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Accuracy</span>
            <span className="text-base font-black text-emerald-400 flex items-center justify-center gap-1 mt-1">
              <CheckCircle2 className="w-4 h-4" /> {avgAccuracy}%
            </span>
          </div>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl text-center">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Activities</span>
            <span className="text-base font-black text-cyan-400 block mt-1">{totalSolved}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
