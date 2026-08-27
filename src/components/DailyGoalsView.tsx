import React, { useState } from 'react';
import { 
  Target, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Plus, 
  Sparkles, 
  Bell, 
  Share2, 
  Filter, 
  ArrowLeft,
  Calendar,
  CheckCheck,
  Flame,
  Award,
  Zap,
  Tag
} from 'lucide-react';

export interface DailyGoalItem {
  id: string;
  text: string;
  done: boolean;
  category: string;
}

interface DailyGoalsViewProps {
  goals: DailyGoalItem[];
  onToggleGoal: (id: string) => void;
  onAddGoal: (text: string, category: string) => void;
  onDeleteGoal: (id: string) => void;
  onClearCompleted?: () => void;
  language?: string;
  showToast: (msg: string, type?: 'info' | 'success' | 'warn' | 'error') => void;
  reminderEnabled?: boolean;
  setReminderEnabled?: (enabled: boolean) => void;
  reminderTime?: string;
  setReminderTime?: (time: string) => void;
  onBackToChat: () => void;
}

// Category Color Badge Mapping Engine
export interface CategoryStyle {
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  accentBorder: string;
  icon: string;
  glow: string;
  description: string;
}

export const CATEGORY_DEFINITIONS: Record<string, CategoryStyle> = {
  'GK & Civil': {
    label: 'GK & Civil',
    badgeBg: 'bg-blue-500/20',
    badgeText: 'text-blue-300',
    badgeBorder: 'border-blue-500/40',
    accentBorder: 'border-l-blue-500',
    icon: '🏛️',
    glow: 'shadow-blue-500/10',
    description: 'History, Polity, Geography, GS'
  },
  'English Rules': {
    label: 'English Rules',
    badgeBg: 'bg-emerald-500/20',
    badgeText: 'text-emerald-300',
    badgeBorder: 'border-emerald-500/40',
    accentBorder: 'border-l-emerald-500',
    icon: '📖',
    glow: 'shadow-emerald-500/10',
    description: 'Grammar, Vocab, Comprehension'
  },
  'Quantitative': {
    label: 'Quantitative',
    badgeBg: 'bg-amber-500/20',
    badgeText: 'text-amber-300',
    badgeBorder: 'border-amber-500/40',
    accentBorder: 'border-l-amber-500',
    icon: '📐',
    glow: 'shadow-amber-500/10',
    description: 'Maths, Arithmetic, Advanced Math'
  },
  'Reasoning': {
    label: 'Reasoning',
    badgeBg: 'bg-purple-500/20',
    badgeText: 'text-purple-300',
    badgeBorder: 'border-purple-500/40',
    accentBorder: 'border-l-purple-500',
    icon: '🧩',
    glow: 'shadow-purple-500/10',
    description: 'Logical, Verbal, Puzzles, Coding-Decoding'
  },
  'Shorthand / Steno': {
    label: 'Shorthand / Steno',
    badgeBg: 'bg-cyan-500/20',
    badgeText: 'text-cyan-300',
    badgeBorder: 'border-cyan-500/40',
    accentBorder: 'border-l-cyan-500',
    icon: '✍️',
    glow: 'shadow-cyan-500/10',
    description: '60/80/100 WPM Dictation & Transcription'
  },
  'Current Affairs': {
    label: 'Current Affairs',
    badgeBg: 'bg-rose-500/20',
    badgeText: 'text-rose-300',
    badgeBorder: 'border-rose-500/40',
    accentBorder: 'border-l-rose-500',
    icon: '📰',
    glow: 'shadow-rose-500/10',
    description: 'Daily News, National & International Events'
  },
  'Healthy Life': {
    label: 'Healthy Life',
    badgeBg: 'bg-teal-500/20',
    badgeText: 'text-teal-300',
    badgeBorder: 'border-teal-500/40',
    accentBorder: 'border-l-teal-500',
    icon: '🧘',
    glow: 'shadow-teal-500/10',
    description: 'Yoga, Eye Exercises, Sleep & Wellness'
  },
  'Science & Tech': {
    label: 'Science & Tech',
    badgeBg: 'bg-indigo-500/20',
    badgeText: 'text-indigo-300',
    badgeBorder: 'border-indigo-500/40',
    accentBorder: 'border-l-indigo-500',
    icon: '🔬',
    glow: 'shadow-indigo-500/10',
    description: 'Physics, Chemistry, Bio & Tech'
  }
};

export const getCategoryStyle = (category: string): CategoryStyle => {
  if (CATEGORY_DEFINITIONS[category]) {
    return CATEGORY_DEFINITIONS[category];
  }
  const norm = (category || '').toLowerCase().trim();
  if (norm.includes('gk') || norm.includes('civil') || norm.includes('polity') || norm.includes('history') || norm.includes('gs') || norm.includes('geo')) {
    return CATEGORY_DEFINITIONS['GK & Civil'];
  }
  if (norm.includes('english') || norm.includes('grammar') || norm.includes('vocab') || norm.includes('rule')) {
    return CATEGORY_DEFINITIONS['English Rules'];
  }
  if (norm.includes('quant') || norm.includes('math') || norm.includes('aptitude') || norm.includes('calc')) {
    return CATEGORY_DEFINITIONS['Quantitative'];
  }
  if (norm.includes('reason') || norm.includes('logic') || norm.includes('puzzle')) {
    return CATEGORY_DEFINITIONS['Reasoning'];
  }
  if (norm.includes('steno') || norm.includes('shorthand') || norm.includes('dictation') || norm.includes('typing')) {
    return CATEGORY_DEFINITIONS['Shorthand / Steno'];
  }
  if (norm.includes('current') || norm.includes('affair') || norm.includes('news') || norm.includes('ca')) {
    return CATEGORY_DEFINITIONS['Current Affairs'];
  }
  if (norm.includes('health') || norm.includes('life') || norm.includes('yoga') || norm.includes('stretch') || norm.includes('fitness')) {
    return CATEGORY_DEFINITIONS['Healthy Life'];
  }
  if (norm.includes('science') || norm.includes('tech') || norm.includes('physics') || norm.includes('chem') || norm.includes('bio')) {
    return CATEGORY_DEFINITIONS['Science & Tech'];
  }

  // Fallback neutral
  return {
    label: category || 'General Target',
    badgeBg: 'bg-slate-700/30',
    badgeText: 'text-slate-300',
    badgeBorder: 'border-slate-600/40',
    accentBorder: 'border-l-slate-500',
    icon: '🎯',
    glow: 'shadow-slate-700/10',
    description: 'Academic Target'
  };
};

export const DailyGoalsView: React.FC<DailyGoalsViewProps> = ({
  goals,
  onToggleGoal,
  onAddGoal,
  onDeleteGoal,
  onClearCompleted,
  language = 'hindi',
  showToast,
  reminderEnabled = true,
  setReminderEnabled,
  reminderTime = '21:00',
  setReminderTime,
  onBackToChat
}) => {
  const [newGoalText, setNewGoalText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('GK & Civil');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const completedCount = goals.filter(g => g.done).length;
  const totalCount = goals.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Filtered goals list
  const filteredGoals = goals.filter(goal => {
    // Status filter
    if (statusFilter === 'active' && goal.done) return false;
    if (statusFilter === 'completed' && !goal.done) return false;

    // Category filter
    if (filterCategory !== 'all') {
      const targetStyle = getCategoryStyle(goal.category);
      if (targetStyle.label !== filterCategory) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return goal.text.toLowerCase().includes(q) || goal.category.toLowerCase().includes(q);
    }

    return true;
  });

  const handleCreateGoal = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newGoalText.trim()) {
      showToast(language === 'hindi' ? '⚠️ कृपया लक्ष्य का विवरण लिखें।' : '⚠️ Please enter a goal description.', 'warn');
      return;
    }
    onAddGoal(newGoalText.trim(), selectedCategory);
    setNewGoalText('');
    showToast(language === 'hindi' ? `🎯 नया लक्ष्य जोड़ा गया: [${selectedCategory}]` : `🎯 Added new goal: [${selectedCategory}]`, 'success');
  };

  const handleQuickAdd = (presetText: string, presetCategory: string) => {
    onAddGoal(presetText, presetCategory);
    showToast(language === 'hindi' ? `⚡ त्वरित लक्ष्य जोड़ा गया: [${presetCategory}]` : `⚡ Quick goal added: [${presetCategory}]`, 'success');
  };

  const handleShareGoals = () => {
    const activeGoals = goals.filter(g => !g.done).map(g => `• [${g.category}] ${g.text}`).join('\n');
    const doneGoals = goals.filter(g => g.done).map(g => `✓ [${g.category}] ${g.text}`).join('\n');
    
    const text = `🎯 *HansAI Daily Study Goals Checklist* 🎯\n📊 Progress: ${completedCount}/${totalCount} (${progressPercent}% Completed)\n\n*Pending Goals:*\n${activeGoals || 'All goals completed! 🎉'}\n\n*Completed:* \n${doneGoals || 'None yet'}\n\n🕊️ _Powered by HansAI Academic Ecosystem_`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast(language === 'hindi' ? '📋 दैनिक लक्ष्य क्लिपबोर्ड पर कॉपी हो गए!' : '📋 Goals copied to clipboard!', 'success');
    }
  };

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto pb-12 font-sans" id="daily-goals-main-container">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-[#0E1528] via-[#101935] to-[#0A0F1D] border border-indigo-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
        {/* Glow blur backgrounds */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <button
                onClick={onBackToChat}
                className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1 text-xs font-semibold"
                title="Back to Chat"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">{language === 'hindi' ? 'वापस' : 'Back'}</span>
              </button>

              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                <Target className="w-3 h-3 text-indigo-400" />
                <span>Smart Target Manager</span>
              </span>

              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400 fill-amber-400 animate-pulse" />
                <span>Daily Discipline 2026</span>
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>🎯</span>
              <span>{language === 'hindi' ? 'दैनिक अध्ययन लक्ष्य व श्रेणी-वार चेकलिस्ट' : 'Daily Academic Goals & Color-Coded Targets'}</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              {language === 'hindi' 
                ? 'प्रत्येक विषय और श्रेणी को अलग रंग बैज (Color-Coded Badge) दिया गया है ताकि आप एक नज़र में अपनी तैयारी को स्कैन और ट्रैक कर सकें।' 
                : 'Each subject category is automatically assigned a distinct high-contrast color badge for effortless scanning and focused revision.'}
            </p>
          </div>

          {/* Share & Clear buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleShareGoals}
              className="px-3.5 py-2 rounded-xl bg-[#141E38] hover:bg-indigo-900/60 border border-indigo-500/30 text-indigo-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
              title="Copy / Share Goals"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{language === 'hindi' ? 'शेयर / कॉपी' : 'Share Goals'}</span>
            </button>

            {completedCount > 0 && onClearCompleted && (
              <button
                onClick={onClearCompleted}
                className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-rose-950/60 hover:border-rose-500/40 border border-slate-700 text-slate-400 hover:text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                title="Clear completed goals"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>{language === 'hindi' ? 'पूर्ण हटाएँ' : 'Clear Done'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Progress bar banner */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="md:col-span-2 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>{language === 'hindi' ? 'आज की प्रगति:' : 'Today’s Progress:'}</span>
                <span className="text-white font-mono">{completedCount} / {totalCount} {language === 'hindi' ? 'लक्ष्य पूर्ण' : 'Goals Finished'}</span>
              </span>
              <span className={`font-mono px-2 py-0.5 rounded-full text-xs font-extrabold ${
                progressPercent === 100 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                  : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
              }`}>
                {progressPercent}%
              </span>
            </div>

            {/* Visual Progress Track */}
            <div className="w-full h-3 bg-[#080C16] border border-slate-800 rounded-full overflow-hidden p-0.5">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  progressPercent === 100 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-lg shadow-emerald-500/30' 
                    : progressPercent > 50 
                    ? 'bg-gradient-to-r from-indigo-500 to-emerald-400' 
                    : 'bg-gradient-to-r from-indigo-600 to-indigo-400'
                }`}
                style={{ width: `${Math.max(4, progressPercent)}%` }}
              />
            </div>
          </div>

          {/* Motivational Badge */}
          <div className="bg-[#090D18]/90 border border-slate-800/90 rounded-2xl p-3 flex items-center gap-3">
            <span className="text-2xl">
              {progressPercent === 100 ? '🏆' : progressPercent >= 50 ? '🔥' : '⏳'}
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white leading-tight">
                {progressPercent === 100 
                  ? (language === 'hindi' ? 'अद्भुत! सभी लक्ष्य पूर्ण हुए' : 'Outstanding! All Targets Crushed!')
                  : progressPercent >= 50 
                  ? (language === 'hindi' ? 'शानदार गति! आधा सफर तय' : 'Great Momentum! Halfway there')
                  : (language === 'hindi' ? 'लक्ष्य पर ध्यान दें और आगे बढ़ें' : 'Stay Focused & Start Ticking')}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                {totalCount - completedCount} {language === 'hindi' ? 'लक्ष्य शेष हैं' : 'targets remaining'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 🏷️ CATEGORY FILTER DROPDOWN */}
      <div className="bg-[#0A0E1A] border border-slate-800/90 rounded-2xl p-4 sm:px-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 shrink-0">
            <Filter className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex-1 sm:flex-none relative">
            <label className="text-[10px] uppercase font-black text-slate-500 block mb-1.5 tracking-wider">
              {language === 'hindi' ? 'श्रेणी द्वारा फ़िल्टर करें' : 'Filter by Category'}
            </label>
            <div className="relative">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full sm:w-56 text-sm py-2 pl-3 pr-8 bg-[#070A12] border border-slate-800 rounded-xl text-slate-200 font-bold focus:outline-none focus:border-indigo-500 cursor-pointer appearance-none transition-colors hover:border-slate-700 shadow-sm"
              >
                <option value="all">🌍 {language === 'hindi' ? 'सभी लक्ष्य (All Goals)' : 'All Goals'}</option>
                <option value="GK & Civil">🏛️ GK & Civil</option>
                <option value="English Rules">📖 English Rules</option>
                <option value="Quantitative">📐 Quantitative</option>
                <option value="Reasoning">🧩 Reasoning</option>
                <option value="Shorthand / Steno">✍️ Shorthand / Steno</option>
                <option value="Current Affairs">📰 Current Affairs</option>
                <option value="Healthy Life">🧘 Healthy Life</option>
                <option value="Science & Tech">🔬 Science & Tech</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start sm:items-end w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-slate-800/80 sm:border-t-0">
          <span className="text-[10px] text-slate-500 block mb-1 uppercase font-bold tracking-wider">
            {language === 'hindi' ? 'परिणाम' : 'Matched Targets'}
          </span>
          <span className="text-sm font-black text-indigo-300">
            {filteredGoals.length} {language === 'hindi' ? 'दिखाए जा रहे हैं' : 'Showing'}
          </span>
        </div>
      </div>

      {/* Add New Goal Card Form */}
      <div className="bg-[#0B101E] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-white flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>{language === 'hindi' ? '+ नया दैनिक लक्ष्य जोड़ें' : '+ Add Custom Daily Target'}</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">Real-time Auto-Sync</span>
        </div>

        <form onSubmit={handleCreateGoal} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5">
            {/* Input field */}
            <input
              type="text"
              value={newGoalText}
              onChange={(e) => setNewGoalText(e.target.value)}
              placeholder={language === 'hindi' ? "जैसे: 20 महत्वपूर्ण आधुनिक इतिहास के प्रश्न हल करें..." : "e.g., Solve 20 Modern History Questions, Revise 5 Prepositions..."}
              className="flex-1 text-xs sm:text-sm py-2.5 px-3.5 bg-[#070A12] border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors font-medium"
              id="new-goal-text-input"
            />

            {/* Category selector */}
            <div className="flex items-center gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-xs py-2.5 px-3 bg-[#070A12] border border-slate-800 rounded-xl text-slate-200 font-bold focus:outline-none focus:border-indigo-500 cursor-pointer"
                id="new-goal-category-select"
              >
                {Object.keys(CATEGORY_DEFINITIONS).map((catName) => (
                  <option key={catName} value={catName}>
                    {CATEGORY_DEFINITIONS[catName].icon} {catName}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-650 text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20 cursor-pointer shrink-0 active:scale-95"
                id="add-goal-submit-btn"
              >
                <Plus className="w-4 h-4" />
                <span>{language === 'hindi' ? 'जोड़ें' : 'Add Goal'}</span>
              </button>
            </div>
          </div>

          {/* Quick Presets row */}
          <div className="pt-2 border-t border-slate-850/80 flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="text-slate-500 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 mr-1">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>{language === 'hindi' ? 'त्वरित प्रीसेट:' : 'Quick Presets:'}</span>
            </span>

            <button
              type="button"
              onClick={() => handleQuickAdd("Solve 15 Polity / Historical Milestone GK questions", "GK & Civil")}
              className="px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 transition-all font-semibold cursor-pointer"
            >
              🏛️ +15 Polity Qs
            </button>

            <button
              type="button"
              onClick={() => handleQuickAdd("Revise 5 important English preposition structures", "English Rules")}
              className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-all font-semibold cursor-pointer"
            >
              📖 +English Prepositions
            </button>

            <button
              type="button"
              onClick={() => handleQuickAdd("15 mins focused pomodoro quantitative math review", "Quantitative")}
              className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all font-semibold cursor-pointer"
            >
              📐 +Math Speed Drill
            </button>

            <button
              type="button"
              onClick={() => handleQuickAdd("Practice 100 WPM Hindi/English Shorthand dictation", "Shorthand / Steno")}
              className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all font-semibold cursor-pointer"
            >
              ✍️ +100 WPM Steno
            </button>

            <button
              type="button"
              onClick={() => handleQuickAdd("Read today's top 10 Current Affairs capsules", "Current Affairs")}
              className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-all font-semibold cursor-pointer"
            >
              📰 +Daily Current Affairs
            </button>
          </div>
        </form>
      </div>

      {/* Filter and Goals List Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
        {/* Status filters */}
        <div className="flex items-center gap-1 bg-[#090D18] p-1 rounded-xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              statusFilter === 'all' 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'hindi' ? 'सभी' : 'All'} ({goals.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              statusFilter === 'active' 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'hindi' ? 'अपूर्ण' : 'Pending'} ({totalCount - completedCount})
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              statusFilter === 'completed' 
                ? 'bg-emerald-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'hindi' ? 'पूर्ण' : 'Completed'} ({completedCount})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'hindi' ? "लक्ष्य खोजें..." : "Search targets..."}
            className="w-full sm:w-56 text-xs py-1.5 pl-7 pr-3 bg-[#080C16] border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <Filter className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1.5 text-slate-500 hover:text-white text-xs"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* 📋 THE MAIN GOALS LIST WITH CATEGORY COLOR BADGES */}
      <div className="space-y-2.5" id="daily-goals-items-list">
        {filteredGoals.length === 0 ? (
          <div className="bg-[#090D18] border border-dashed border-slate-800 rounded-2xl p-8 text-center space-y-3">
            <span className="text-3xl block">🎯</span>
            <p className="text-sm font-bold text-slate-300">
              {goals.length === 0 
                ? (language === 'hindi' ? 'कोई दैनिक लक्ष्य नहीं मिला। ऊपर नया लक्ष्य जोड़ें!' : 'No goals found. Add your first goal above!') 
                : (language === 'hindi' ? 'इस फ़िल्टर के अनुसार कोई लक्ष्य नहीं है।' : 'No goals match the selected filter.')}
            </p>
            {filterCategory !== 'all' && (
              <button
                onClick={() => setFilterCategory('all')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-bold underline cursor-pointer"
              >
                {language === 'hindi' ? 'सभी श्रेणियां देखें' : 'View all categories'}
              </button>
            )}
          </div>
        ) : (
          filteredGoals.map((goal) => {
            const catStyle = getCategoryStyle(goal.category);

            return (
              <div
                key={goal.id}
                className={`group relative flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 text-left ${
                  catStyle.accentBorder
                } border-l-4 ${
                  goal.done
                    ? 'bg-[#080B14]/70 border-slate-850/80 opacity-65'
                    : `bg-[#0C1222] hover:bg-[#10182E] border-slate-800 hover:border-slate-700 shadow-md ${catStyle.glow}`
                }`}
                id={`goal-item-${goal.id}`}
              >
                {/* Left check and text */}
                <div 
                  className="flex items-start sm:items-center gap-3 flex-1 min-w-0 cursor-pointer pr-3"
                  onClick={() => onToggleGoal(goal.id)}
                >
                  <button
                    type="button"
                    className="mt-0.5 sm:mt-0 p-0.5 text-slate-400 hover:text-indigo-400 transition-colors bg-transparent border-none cursor-pointer shrink-0"
                    aria-label={goal.done ? "Mark Incomplete" : "Mark Complete"}
                  >
                    {goal.done ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                    )}
                  </button>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 flex-1 min-w-0">
                    {/* Category Unique Color Badge */}
                    <span 
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border shrink-0 ${
                        catStyle.badgeBg
                      } ${catStyle.badgeText} ${catStyle.badgeBorder}`}
                      title={catStyle.description}
                    >
                      <span>{catStyle.icon}</span>
                      <span>{catStyle.label}</span>
                    </span>

                    {/* Goal Text */}
                    <span className={`text-xs sm:text-sm font-semibold transition-all break-words ${
                      goal.done 
                        ? 'line-through text-slate-500 font-normal' 
                        : 'text-slate-100 group-hover:text-white'
                    }`}>
                      {goal.text}
                    </span>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteGoal(goal.id);
                      showToast(language === 'hindi' ? '🗑️ लक्ष्य हटा दिया गया।' : '🗑️ Goal deleted.', 'info');
                    }}
                    className="p-1.5 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all bg-transparent border-none cursor-pointer"
                    title="Delete Goal"
                    id={`delete-goal-${goal.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Daily Reminder Time Settings Strip */}
      {setReminderEnabled && setReminderTime && (
        <div className="bg-[#090D18] border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white block">
                {language === 'hindi' ? 'दैनिक लक्ष्य स्मरण अलार्म (Daily Target Reminder)' : 'Daily Target Reminder Alarm'}
              </span>
              <span className="text-[10px] text-slate-400">
                {language === 'hindi' 
                  ? 'अपूर्ण लक्ष्यों को पूरा करने के लिए निर्धारित समय पर नोटिफिकेशन प्राप्त करें।' 
                  : 'Get browser alerts for pending targets at your preferred time.'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="px-2.5 py-1.5 bg-[#050810] border border-slate-700 rounded-xl text-white font-mono font-bold text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
              id="reminder-time-picker"
            />

            <button
              type="button"
              onClick={() => {
                const nextState = !reminderEnabled;
                setReminderEnabled(nextState);
                showToast(
                  nextState 
                    ? (language === 'hindi' ? `🔔 स्मरण अलार्म ${reminderTime} बजे के लिए सक्रिय!` : `🔔 Reminder set for ${reminderTime}`)
                    : (language === 'hindi' ? '🔕 स्मरण अलार्म बंद कर दिया गया।' : '🔕 Reminder disabled.'),
                  nextState ? 'success' : 'info'
                );
              }}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                reminderEnabled 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
              id="toggle-reminder-btn"
            >
              {reminderEnabled ? '● ON (सक्रिय)' : '○ OFF (बंद)'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
