import React, { useState } from 'react';
import { Target, CheckCircle2, Circle, Plus, Flame, Sparkles, Trophy, Award } from 'lucide-react';
import { recordStudyActivity } from '../firebase';

interface GoalItem {
  id: number;
  title: string;
  category: 'GK & CA' | 'English' | 'Math & Reasoning' | 'Shorthand';
  xp: number;
  completed: boolean;
}

export const DailyGoalsView: React.FC = () => {
  const [goals, setGoals] = useState<GoalItem[]>([
    { id: 1, title: '10 दैनिक करेंट अफेयर्स फैक्ट्स पढ़ें व क्विज़ हल करें', category: 'GK & CA', xp: 50, completed: true },
    { id: 2, title: '50 नए English Vocabulary, Idioms व One-Word Substitution याद करें', category: 'English', xp: 50, completed: true },
    { id: 3, title: 'गणित व रीजनिंग के 25 पिछले वर्षों के प्रश्न (PYQ) हल करें', category: 'Math & Reasoning', xp: 60, completed: false },
    { id: 4, title: '80-100 WPM पर 10 मिनट आशुलिपि (Steno) डिक्टेशन व ट्रांसक्रिप्शन', category: 'Shorthand', xp: 70, completed: false },
    { id: 5, title: 'संविधान एवं आधुनिक इतिहास के 20 महत्वपूर्ण अनुच्छेद दोहराएं', category: 'GK & CA', xp: 40, completed: false },
    { id: 6, title: 'English Active-Passive Voice एवं Direct-Indirect के 30 प्रश्न', category: 'English', xp: 50, completed: false }
  ]);
  const [newGoalText, setNewGoalText] = useState('');
  const [newCategory, setNewCategory] = useState<GoalItem['category']>('GK & CA');

  const toggleGoal = (id: number) => {
    setGoals(prev =>
      prev.map(g => {
        if (g.id === id) {
          const nextState = !g.completed;
          if (nextState) {
            recordStudyActivity('Daily Goals', g.title, `दैनिक लक्ष्य पूर्ण: ${g.title} (${g.category}) +${g.xp} XP`, 100);
          }
          return { ...g, completed: nextState };
        }
        return g;
      })
    );
  };

  const addGoal = () => {
    if (!newGoalText.trim()) return;
    setGoals(prev => [
      ...prev,
      { id: Date.now(), title: newGoalText.trim(), category: newCategory, xp: 50, completed: false }
    ]);
    setNewGoalText('');
  };

  const completedCount = goals.filter(g => g.completed).length;
  const totalXp = goals.filter(g => g.completed).reduce((acc, g) => acc + g.xp, 150);
  const progressPercent = goals.length > 0 ? Math.round((completedCount / goals.length) * 100) : 0;

  const colorBadges = [
    { name: 'Bronze Learner', minPct: 20, color: 'from-amber-700 to-orange-900 border-amber-500/40 text-amber-300', icon: '🥉' },
    { name: 'Silver Scholar', minPct: 40, color: 'from-slate-600 to-slate-800 border-slate-400/50 text-slate-200', icon: '🥈' },
    { name: 'Gold Master', minPct: 65, color: 'from-yellow-500/30 to-amber-900 border-yellow-400 text-yellow-300', icon: '🥇' },
    { name: 'Diamond Topper', minPct: 85, color: 'from-cyan-500/30 to-blue-900 border-cyan-400 text-cyan-300', icon: '💎' },
    { name: 'Hans Legend', minPct: 100, color: 'from-purple-600/30 to-rose-900 border-purple-400 text-purple-200', icon: '👑' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fade-in text-white">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 p-6 sm:p-8 rounded-3xl border border-blue-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 text-xs font-bold uppercase mb-2 border border-blue-500/20">
            <Target className="w-4 h-4" /> Daily Study Targets &amp; Color Badges
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-hindi-title text-white">
            दैनिक लक्ष्य (GK, English, Math &amp; Color Badges)
          </h1>
          <p className="text-slate-300 text-sm mt-1">
            प्रतिदिन के अध्ययन लक्ष्यों को पूरा कर कलर बैज (Color Badges) और XP रिवॉर्ड्स अनलॉक करें।
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-950/80 p-3.5 rounded-2xl border border-amber-500/30 shrink-0">
          <Flame className="w-8 h-8 text-amber-400 animate-bounce" />
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">4 दिन का स्ट्रीक • XP Coins</div>
            <div className="text-lg font-black text-amber-400">🔥 {totalXp} XP</div>
          </div>
        </div>
      </div>

      {/* Color Badges Unlock Showcase */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4" />
            <span>दैनिक कलर बैज रैंक (Daily Color Badges):</span>
          </span>
          <span className="text-xs font-mono font-bold text-emerald-400">{progressPercent}% पूर्ण</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {colorBadges.map(b => {
            const unlocked = progressPercent >= b.minPct;
            return (
              <div
                key={b.name}
                className={`p-3 rounded-2xl border bg-gradient-to-br text-center transition-all ${
                  unlocked ? `${b.color} shadow-lg scale-102` : 'from-slate-950 to-slate-950 border-slate-850 opacity-40'
                }`}
              >
                <div className="text-2xl mb-1">{b.icon}</div>
                <div className="text-xs font-black">{b.name}</div>
                <div className="text-[10px] opacity-80">{unlocked ? '✓ अनलॉक (Unlocked)' : `${b.minPct}% पर अनलॉक`}</div>
              </div>
            );
          })}
        </div>

        <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 mt-2">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Task Checklist */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
          आज के विषय-वार लक्ष्य (GK, English, Math &amp; Steno Checklist)
        </h3>

        <div className="space-y-3">
          {goals.map(g => (
            <div
              key={g.id}
              onClick={() => toggleGoal(g.id)}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                g.completed
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-400'
                  : 'bg-slate-950 border-slate-800 text-white hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                {g.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-600 shrink-0" />
                )}
                <div>
                  <div className={`text-sm font-semibold ${g.completed ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                    {g.title}
                  </div>
                  <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">{g.category}</span>
                </div>
              </div>
              <span className="text-xs font-mono font-black text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20 shrink-0">
                +{g.xp} XP
              </span>
            </div>
          ))}
        </div>

        {/* Add Custom Goal */}
        <div className="flex flex-col sm:flex-row gap-2 pt-3">
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value as any)}
            className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-cyan-300 font-bold focus:outline-none"
          >
            <option value="GK & CA">GK &amp; CA</option>
            <option value="English">English</option>
            <option value="Math & Reasoning">Math &amp; Reasoning</option>
            <option value="Shorthand">Shorthand</option>
          </select>
          <input
            type="text"
            value={newGoalText}
            onChange={(e) => setNewGoalText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addGoal()}
            placeholder="नया दैनिक लक्ष्य यहाँ लिखें..."
            className="flex-1 p-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={addGoal}
            className="px-5 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>लक्ष्य जोड़ें</span>
          </button>
        </div>
      </div>
    </div>
  );
};
