import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Trophy, 
  Award, 
  Calendar, 
  CheckCircle2, 
  Zap, 
  Sparkles, 
  Share2, 
  ChevronRight, 
  X, 
  Target, 
  BookOpen, 
  HelpCircle, 
  TrendingUp,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

export interface DailyStreakData {
  currentStreak: number;
  bestStreak: number;
  lastActiveDate: string; // 'YYYY-MM-DD'
  activeDates: string[]; // List of YYYY-MM-DD dates
  totalDays: number;
}

const STORAGE_KEY = 'hansai_daily_streak_v1';

// Helper to get formatted local date string YYYY-MM-DD
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helper to get yesterday date string
export function getYesterdayDateString(): string {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Read current streak data from localStorage
export function getStreakData(): DailyStreakData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const today = getTodayDateString();
    const yesterday = getYesterdayDateString();

    if (!raw) {
      // Initialize with 1 day streak for new users active today
      const initial: DailyStreakData = {
        currentStreak: 1,
        bestStreak: 1,
        lastActiveDate: today,
        activeDates: [today],
        totalDays: 1
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }

    const data: DailyStreakData = JSON.parse(raw);
    
    // Validate streak continuity
    if (data.lastActiveDate === today) {
      // Already active today, streak is valid
      return data;
    } else if (data.lastActiveDate === yesterday) {
      // Last active was yesterday, streak is currently maintained pending today's action
      return data;
    } else {
      // Streak broken (missed more than 1 day)
      // Note: We maintain history and best streak, but current streak resets to 0 until practice today
      return {
        ...data,
        currentStreak: 0
      };
    }
  } catch (e) {
    const today = getTodayDateString();
    return {
      currentStreak: 1,
      bestStreak: 1,
      lastActiveDate: today,
      activeDates: [today],
      totalDays: 1
    };
  }
}

// Record study / practice activity to advance streak
export function recordDailyPracticeActivity(): DailyStreakData {
  try {
    const today = getTodayDateString();
    const yesterday = getYesterdayDateString();
    const raw = localStorage.getItem(STORAGE_KEY);
    
    let currentData: DailyStreakData;
    if (raw) {
      currentData = JSON.parse(raw);
    } else {
      currentData = {
        currentStreak: 0,
        bestStreak: 0,
        lastActiveDate: '',
        activeDates: [],
        totalDays: 0
      };
    }

    if (currentData.lastActiveDate === today) {
      // Already recorded today, ensure today is in activeDates
      if (!currentData.activeDates.includes(today)) {
        currentData.activeDates.push(today);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));
      }
      return currentData;
    }

    let newStreak = 1;
    if (currentData.lastActiveDate === yesterday) {
      newStreak = (currentData.currentStreak || 0) + 1;
    } else {
      newStreak = 1;
    }

    const updatedActiveDates = Array.isArray(currentData.activeDates) 
      ? [...new Set([...currentData.activeDates, today])] 
      : [today];

    const newBestStreak = Math.max(currentData.bestStreak || 0, newStreak);
    const newTotalDays = updatedActiveDates.length;

    const updatedData: DailyStreakData = {
      currentStreak: newStreak,
      bestStreak: newBestStreak,
      lastActiveDate: today,
      activeDates: updatedActiveDates,
      totalDays: newTotalDays
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    return updatedData;
  } catch (e) {
    console.error('Error updating streak:', e);
    return getStreakData();
  }
}

interface DailyStreakIndicatorProps {
  language?: 'english' | 'hindi';
  onNavigateToView?: (view: any) => void;
  className?: string;
  variant?: 'compact' | 'card' | 'badge';
}

export const DailyStreakIndicator: React.FC<DailyStreakIndicatorProps> = ({
  language = 'hindi',
  onNavigateToView,
  className = '',
  variant = 'card'
}) => {
  const [streakData, setStreakData] = useState<DailyStreakData>(getStreakData());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  useEffect(() => {
    // Refresh streak and record session visit on mount
    const updated = recordDailyPracticeActivity();
    setStreakData(updated);

    const handleStorageChange = () => {
      setStreakData(getStreakData());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const today = getTodayDateString();
  const isPracticedToday = streakData.lastActiveDate === today && streakData.currentStreak > 0;

  // Calculate past 7 days for the weekly dot calendar
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const yr = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    const dy = String(d.getDate()).padStart(2, '0');
    const dateStr = `${yr}-${mo}-${dy}`;
    
    // Day short name (Mon, Tue, etc.)
    const dayNamesEn = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const dayNamesHi = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];
    const dayName = language === 'hindi' ? dayNamesHi[d.getDay()] : dayNamesEn[d.getDay()];

    const isActive = streakData.activeDates?.includes(dateStr);
    const isCurrentDay = dateStr === today;

    return {
      dateStr,
      dayName,
      isActive,
      isCurrentDay
    };
  });

  // Milestones
  const milestones = [
    { days: 1, title: language === 'hindi' ? 'शुरुआती चिंगारी' : 'Spark Starter', icon: '🌱', desc: language === 'hindi' ? 'पहला कदम पूरा' : 'Day 1 completed' },
    { days: 3, title: language === 'hindi' ? 'प्रज्वलित अग्नि' : 'Ignited Flame', icon: '🔥', desc: language === 'hindi' ? '3 दिन निरंतरता' : '3 days streak' },
    { days: 7, title: language === 'hindi' ? 'साप्ताहिक योद्धा' : 'Weekly Scholar', icon: '⚡', desc: language === 'hindi' ? '7 दिन अध्ययन' : '1 week master' },
    { days: 14, title: language === 'hindi' ? 'अटूट फोकस' : 'Laser Focus', icon: '🛡️', desc: language === 'hindi' ? '14 दिन संकल्प' : '2 weeks focus' },
    { days: 30, title: language === 'hindi' ? 'गोल्डन स्कॉलर' : 'Golden Champion', icon: '👑', desc: language === 'hindi' ? '1 माह महारत' : '1 month champion' },
    { days: 100, title: language === 'hindi' ? 'स्टडी लीजेंड' : 'Study Legend', icon: '🌟', desc: language === 'hindi' ? '100 दिन शिखर' : '100 days legend' },
  ];

  const handleShareStreak = () => {
    const text = language === 'hindi'
      ? `🔥 मैं HansAI पर ${streakData.currentStreak} दिनों से लगातार अभ्यास कर रहा हूँ! मेरा बेस्ट रिकॉर्ड ${streakData.bestStreak} दिन है। आप भी अपनी पढ़ाई शुरू करें: https://hans-compain.onrender.com/`
      : `🔥 I'm on a ${streakData.currentStreak}-Day study streak on HansAI! My best record is ${streakData.bestStreak} days. Practice daily and boost your learning: https://hans-compain.onrender.com/`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2500);
    }
  };

  // Badge Variant (Very compact for headers/pills)
  if (variant === 'badge') {
    return (
      <button
        onClick={() => setIsModalOpen(true)}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black transition-all cursor-pointer shadow-sm border ${
          isPracticedToday 
            ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-300 hover:from-amber-500/30 hover:to-orange-500/30' 
            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
        } ${className}`}
        title={language === 'hindi' ? `दैनिक स्ट्रीक: ${streakData.currentStreak} दिन` : `Daily Streak: ${streakData.currentStreak} Days`}
      >
        <Flame className={`w-3.5 h-3.5 ${isPracticedToday ? 'text-amber-400 fill-amber-400 animate-pulse' : 'text-slate-500'}`} />
        <span>{streakData.currentStreak}</span>
        <span className="text-[10px] text-amber-400 font-bold uppercase">{language === 'hindi' ? 'दिन' : 'D'}</span>
      </button>
    );
  }

  return (
    <>
      {/* SIDEBAR CARD INDICATOR */}
      <div 
        onClick={() => setIsModalOpen(true)}
        className={`group relative p-3 rounded-2xl bg-gradient-to-br from-[#120B02] via-[#0F1424] to-[#0A0E1A] border border-amber-500/30 hover:border-amber-400/60 shadow-lg shadow-amber-950/20 hover:shadow-amber-500/10 transition-all duration-300 cursor-pointer overflow-hidden text-left ${className}`}
      >
        {/* Subtle fiery background aura */}
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/20 transition-all" />

        {/* Top Streak Header */}
        <div className="flex items-center justify-between relative z-10 mb-2">
          <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 text-white shadow-md shadow-orange-600/30 group-hover:scale-105 transition-transform">
              <Flame className="w-5 h-5 fill-white text-amber-200 animate-pulse" />
              {streakData.currentStreak > 0 && (
                <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 text-[8px] font-black text-white ring-1 ring-black">
                  ✓
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-orange-300 to-yellow-200">
                  {streakData.currentStreak} {language === 'hindi' ? 'दिन का स्ट्रीक' : 'Day Streak'}
                </span>
                <Sparkles className="w-3 h-3 text-amber-400 animate-bounce" />
              </div>
              <span className="text-[10px] text-slate-400 font-semibold block leading-tight">
                {isPracticedToday 
                  ? (language === 'hindi' ? '🔥 आज का अभ्यास सक्रिय!' : '🔥 Practiced Today!')
                  : (language === 'hindi' ? '⚡ आज अभ्यास जारी रखें' : '⚡ Keep streak alive today!')}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[9px] font-mono font-bold text-amber-400/90 bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
              <Trophy className="w-2.5 h-2.5 text-amber-400" />
              <span>{streakData.bestStreak}d</span>
            </span>
          </div>
        </div>

        {/* 7-Day Mini Dots Tracker */}
        <div className="pt-2 border-t border-slate-800/80 relative z-10">
          <div className="flex items-center justify-between gap-1">
            {last7Days.map((day, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1 flex-1">
                <div 
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-black transition-all ${
                    day.isActive 
                      ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-sm shadow-orange-500/40 scale-105' 
                      : day.isCurrentDay 
                        ? 'bg-slate-800/90 border border-dashed border-amber-500/50 text-amber-400 animate-pulse'
                        : 'bg-slate-900/80 border border-slate-800 text-slate-600'
                  }`}
                  title={`${day.dateStr}: ${day.isActive ? 'Active' : 'No activity'}`}
                >
                  {day.isActive ? (
                    <Flame className="w-3.5 h-3.5 fill-white text-yellow-200" />
                  ) : day.isCurrentDay ? (
                    <span className="text-[10px]">•</span>
                  ) : (
                    <span className="text-[8px] opacity-40">○</span>
                  )}
                </div>
                <span className={`text-[8px] font-bold ${day.isCurrentDay ? 'text-amber-300 font-extrabold' : 'text-slate-500'}`}>
                  {day.dayName}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Motivational Footer Bar */}
        <div className="mt-2.5 pt-1.5 flex items-center justify-between text-[10px] text-amber-300/80 font-bold group-hover:text-amber-200 transition-colors">
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>{language === 'hindi' ? 'रिवॉर्ड्स व लक्ष्य देखें' : 'View Rewards & Stats'}</span>
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* DETAILED DAILY STREAK MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in text-left">
          <div className="relative w-full max-w-lg bg-gradient-to-b from-[#0F1424] to-[#080B14] border-2 border-amber-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto custom-scrollbar space-y-5">
            
            {/* Close Button */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Hero Flame Header */}
            <div className="text-center pt-2 space-y-2">
              <div className="inline-flex relative items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-600 via-orange-500 to-yellow-400 shadow-xl shadow-orange-500/30 p-1 mx-auto">
                <Flame className="w-12 h-12 text-white fill-white animate-bounce" />
                <div className="absolute -bottom-2 bg-black/80 border border-amber-400 px-2 py-0.5 rounded-full text-[10px] font-black text-amber-300 uppercase tracking-wider">
                  🔥 {streakData.currentStreak} {language === 'hindi' ? 'दिन' : 'Days'}
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide pt-2">
                {language === 'hindi' ? 'दैनिक अध्ययन स्ट्रीक (Daily Streak)' : 'Daily Study Streak & Rewards'}
              </h2>
              <p className="text-xs text-amber-200/90 max-w-sm mx-auto leading-relaxed">
                {language === 'hindi'
                  ? 'रोज़ाना कम से कम 1 सवाल पूछें या 1 क्विज़ हल करें और अपनी निरंतरता की आग जलाए रखें!'
                  : 'Practice at least once daily to maintain your learning momentum and unlock study achievements!'}
              </p>
            </div>

            {/* 3 Core Stats Grid */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 rounded-2xl bg-slate-900/90 border border-amber-500/30 text-center space-y-0.5">
                <Flame className="w-4 h-4 text-amber-400 mx-auto" />
                <span className="text-lg font-black text-white">{streakData.currentStreak}</span>
                <span className="text-[10px] text-slate-400 block font-bold uppercase">{language === 'hindi' ? 'वर्तमान स्ट्रीक' : 'Current'}</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/90 border border-orange-500/30 text-center space-y-0.5">
                <Trophy className="w-4 h-4 text-orange-400 mx-auto" />
                <span className="text-lg font-black text-white">{streakData.bestStreak}</span>
                <span className="text-[10px] text-slate-400 block font-bold uppercase">{language === 'hindi' ? 'सर्वश्रेष्ठ रिकॉर्ड' : 'Best Streak'}</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/90 border border-indigo-500/30 text-center space-y-0.5">
                <Award className="w-4 h-4 text-indigo-400 mx-auto" />
                <span className="text-lg font-black text-white">{streakData.totalDays || streakData.activeDates?.length || 1}</span>
                <span className="text-[10px] text-slate-400 block font-bold uppercase">{language === 'hindi' ? 'कुल सक्रिय दिन' : 'Total Days'}</span>
              </div>
            </div>

            {/* 7-Day Week Progress Calendar */}
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>{language === 'hindi' ? 'पिछले 7 दिनों का ट्रैक रिकॉर्ड' : 'Past 7 Days Practice Track'}</span>
                </span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                  {isPracticedToday ? (language === 'hindi' ? '✓ आज सक्रिय' : '✓ Active Today') : (language === 'hindi' ? '⏳ आज बाकी है' : '⏳ Pending Today')}
                </span>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {last7Days.map((day, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1.5">
                    <div 
                      className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center font-black transition-all ${
                        day.isActive 
                          ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/40 scale-105' 
                          : day.isCurrentDay 
                            ? 'bg-slate-800 border-2 border-dashed border-amber-400 text-amber-300 animate-pulse'
                            : 'bg-slate-950 border border-slate-800 text-slate-600'
                      }`}
                    >
                      {day.isActive ? (
                        <Flame className="w-5 h-5 fill-white text-yellow-200" />
                      ) : day.isCurrentDay ? (
                        <span className="text-xs font-bold text-amber-400">TODAY</span>
                      ) : (
                        <span className="text-xs opacity-30">✕</span>
                      )}
                    </div>
                    <span className={`text-[10px] font-bold ${day.isCurrentDay ? 'text-amber-400 font-black' : 'text-slate-400'}`}>
                      {day.dayName}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Streak Milestones Badges */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-yellow-400" />
                  <span>{language === 'hindi' ? 'स्ट्रीक बैज एवं उपलब्धियां (Milestones)' : 'Streak Badges & Milestones'}</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {milestones.filter(m => streakData.bestStreak >= m.days).length}/{milestones.length} Unlocked
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {milestones.map((milestone) => {
                  const isUnlocked = streakData.bestStreak >= milestone.days;
                  const isCurrent = streakData.currentStreak >= milestone.days;
                  return (
                    <div 
                      key={milestone.days}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isUnlocked 
                          ? 'bg-gradient-to-br from-amber-950/40 to-slate-900 border-amber-500/40 shadow-sm' 
                          : 'bg-slate-950/60 border-slate-850 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xl">{milestone.icon}</span>
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                          isUnlocked ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-500'
                        }`}>
                          {milestone.days} {language === 'hindi' ? 'दिन' : 'Days'}
                        </span>
                      </div>
                      <h4 className={`text-xs font-bold ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                        {milestone.title}
                      </h4>
                      <p className="text-[9px] text-slate-500 mt-0.5">
                        {milestone.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Practice Shortcuts to Boost Streak */}
            <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-indigo-300">
                <span className="flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-indigo-400" />
                  <span>{language === 'hindi' ? 'आज का स्ट्रीक बढ़ाने के लिए अभ्यास करें:' : 'Practice now to extend streak:'}</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    if (onNavigateToView) onNavigateToView('quiz');
                  }}
                  className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-left flex items-center gap-2 cursor-pointer transition-all hover:border-amber-500/50"
                >
                  <span className="text-base">📝</span>
                  <div>
                    <div className="text-xs font-bold text-white">{language === 'hindi' ? 'स्मार्ट क्विज़ दें' : 'Take Smart Quiz'}</div>
                    <div className="text-[9px] text-slate-400">{language === 'hindi' ? 'PYQ व अभ्यास' : 'Practice MCQs'}</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    if (onNavigateToView) onNavigateToView('mock-interview');
                  }}
                  className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-left flex items-center gap-2 cursor-pointer transition-all hover:border-amber-500/50"
                >
                  <span className="text-base">🎙️</span>
                  <div>
                    <div className="text-xs font-bold text-white">{language === 'hindi' ? 'मॉक इंटरव्यू' : 'Mock Interview'}</div>
                    <div className="text-[9px] text-slate-400">{language === 'hindi' ? 'लाइव AI वॉयस' : 'Live Voice AI'}</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Share Streak & Action Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleShareStreak}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-600/20 cursor-pointer active:scale-98"
              >
                <Share2 className="w-4 h-4" />
                <span>
                  {copiedNotification 
                    ? (language === 'hindi' ? '✓ स्ट्रीक लिंक कॉपी हुआ!' : '✓ Streak Copied!') 
                    : (language === 'hindi' ? 'स्ट्रीक उपलब्धि शेयर करें ↗' : 'Share Streak ↗')}
                </span>
              </button>

              <button
                onClick={() => setIsModalOpen(false)}
                className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                {language === 'hindi' ? 'बंद करें' : 'Close'}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
