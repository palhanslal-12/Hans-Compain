import React, { useState } from 'react';
import { 
  ArrowLeft, Share2, RotateCcw, Clock, Award, Target, Percent, 
  ChevronDown, ChevronUp, Check, X, Bookmark, BookmarkCheck, 
  Download, BookOpen, Star, Trophy, Sparkles, Zap, ShieldAlert
} from 'lucide-react';
import { QuizQuestion, MistakeNotebookItem } from '../types';

export interface TestScorecardData {
  testTitle: string;
  category?: 'competitive' | 'board' | 'practice';
  boardName?: string;
  classGrade?: string;
  subject?: string;
  score: number;
  totalMarks: number;
  totalQuestions: number;
  correct: number;
  wrong: number;
  unattempted: number;
  accuracy: number;
  timeSpentSeconds: number;
  totalTimeMinutes: number;
  negativeMarksPerWrong?: number;
  netNegativeMarks?: number;
  questions: QuizQuestion[];
  userAnswers: Record<number, number>;
  dateStr?: string;
  userName?: string;
}

interface TestPerformanceScorecardProps {
  data: TestScorecardData;
  onExit: () => void;
  onReattempt: () => void;
  onExportPdf?: (title: string, elementId?: string, rawText?: string) => void;
  showToast: (msg: string, type?: 'info' | 'success' | 'warn' | 'error') => void;
  isQuestionBookmarked?: (qText: string) => boolean;
  onToggleBookmark?: (q: QuizQuestion) => void;
  onAddToMistakeNotebook?: (q: QuizQuestion, userPick?: number) => void;
}

export const TestPerformanceScorecard: React.FC<TestPerformanceScorecardProps> = ({
  data,
  onExit,
  onReattempt,
  onExportPdf,
  showToast,
  isQuestionBookmarked,
  onToggleBookmark,
  onAddToMistakeNotebook
}) => {
  const [showSolutions, setShowSolutions] = useState(false);
  const [comparisonTab, setComparisonTab] = useState<'score' | 'correct' | 'wrong' | 'accuracy'>('score');
  const [userRating, setUserRating] = useState<number>(0);
  const [hasRated, setHasRated] = useState(false);

  // Format Time Spent
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const timeSpentFormatted = formatDuration(data.timeSpentSeconds || 280);
  const totalTimeFormatted = `${data.totalTimeMinutes.toString().padStart(2, '0')}:00`;

  // Dynamic Percentile & Rank Simulation
  const totalStudents = 608;
  const calculatedPercentile = Math.min(99.9, Math.max(5.0, Number(((data.score / Math.max(1, data.totalMarks)) * 95 + Math.random() * 4).toFixed(1))));
  const calculatedRank = Math.max(1, Math.round(totalStudents - (calculatedPercentile / 100) * (totalStudents - 10)));

  // Benchmark stats for Comparison Chart
  const isBoard = data.category === 'board';
  const topperScore = Number((data.totalMarks * 0.975).toFixed(1));
  const avgScore = Number((data.totalMarks * 0.575).toFixed(1));

  // Benchmark values based on comparisonTab
  const getBenchmarkValues = () => {
    switch (comparisonTab) {
      case 'correct':
        return {
          you: data.correct,
          avg: Math.round(data.totalQuestions * 0.6),
          topper: Math.round(data.totalQuestions * 0.98),
          max: data.totalQuestions,
          unit: 'Qs'
        };
      case 'wrong':
        return {
          you: data.wrong,
          avg: Math.round(data.totalQuestions * 0.25),
          topper: Math.max(0, Math.round(data.totalQuestions * 0.02)),
          max: data.totalQuestions,
          unit: 'Qs'
        };
      case 'accuracy':
        return {
          you: data.accuracy,
          avg: 68.5,
          topper: 98.2,
          max: 100,
          unit: '%'
        };
      case 'score':
      default:
        return {
          you: data.score,
          avg: avgScore,
          topper: topperScore,
          max: data.totalMarks,
          unit: 'Pts'
        };
    }
  };

  const benchmark = getBenchmarkValues();

  // Curated Leaderboard for Authentic Exam Atmosphere (Matches Image 4)
  const curatedLeaderboard = [
    { rank: 1, name: 'Monika Karosia', score: `${data.totalMarks}.00`, total: data.totalMarks },
    { rank: 2, name: 'Sulekha Boipai', score: `${(data.totalMarks * 0.95).toFixed(2)}`, total: data.totalMarks },
    { rank: 3, name: 'Riya', score: `${(data.totalMarks * 0.95).toFixed(2)}`, total: data.totalMarks },
    { rank: 4, name: 'SURAJ KUMAR', score: `${(data.totalMarks * 0.9375).toFixed(2)}`, total: data.totalMarks },
    { rank: 5, name: 'badal kushwaha', score: `${(data.totalMarks * 0.9375).toFixed(2)}`, total: data.totalMarks },
    { rank: 6, name: 'nil', score: `${(data.totalMarks * 0.9375).toFixed(2)}`, total: data.totalMarks },
    { rank: 7, name: 'Mrinalinee Roy', score: `${(data.totalMarks * 0.9375).toFixed(2)}`, total: data.totalMarks },
    { rank: 8, name: 'Manish', score: `${(data.totalMarks * 0.9375).toFixed(2)}`, total: data.totalMarks },
    { rank: 9, name: 'Shilpa Mandal', score: `${(data.totalMarks * 0.9375).toFixed(2)}`, total: data.totalMarks },
    { rank: 10, name: 'Jyoti Pandey', score: `${(data.totalMarks * 0.9375).toFixed(2)}`, total: data.totalMarks }
  ];

  const handleRating = (stars: number) => {
    setUserRating(stars);
    setHasRated(true);
    showToast(`⭐⭐⭐⭐⭐ रेटिंग दर्ज कर ली गई (${stars} स्टार)! धन्यवाद।`, 'success');
  };

  const handleShare = () => {
    const summary = `📊 HANS COMPAIN TEST SCORECARD 📊\nExam: ${data.testTitle}\nScore: ${data.score}/${data.totalMarks}\nAccuracy: ${data.accuracy}%\nRank: ${calculatedRank}/${totalStudents}\nPercentile: ${calculatedPercentile}%\nCorrect: ${data.correct} | Wrong: ${data.wrong}\nPractice on Hans Compain App!`;
    navigator.clipboard.writeText(summary);
    showToast("📋 स्कोरकार्ड कॉपी कर लिया गया! दोस्तों के साथ साझा करें。", "success");
  };

  return (
    <div className="max-w-3xl mx-auto text-slate-100 animate-fadeIn p-2 sm:p-4 space-y-4 font-sans pb-28">
      
      {/* 1. TOP BAR (Back Arrow + Title + Timestamp) */}
      <div className="bg-[#0B1220] border border-slate-800 rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3 overflow-hidden">
          <button
            onClick={onExit}
            className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer shrink-0"
            title="Back to Test Hub"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="overflow-hidden">
            <h1 className="text-sm sm:text-base font-extrabold text-white truncate">
              {data.testTitle}
            </h1>
            <p className="text-[11px] text-slate-400 font-mono">
              Attempted on : {data.dateStr || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} | {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase()}
            </p>
          </div>
        </div>

        {isBoard ? (
          <span className="shrink-0 px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-[10px] font-black uppercase tracking-wider">
            {data.classGrade || 'Class 10th'} Board
          </span>
        ) : (
          <span className="shrink-0 px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-[10px] font-black uppercase tracking-wider">
            TCS iON Test
          </span>
        )}
      </div>

      {/* 2. CARD 1: OVERALL PERFORMANCE SUMMARY (Matches Image 1) */}
      <div className="bg-[#0C1222] border border-slate-800/90 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-5">
        <div className="border-b border-slate-800/80 pb-3 flex items-center justify-between">
          <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-300">
            Overall Performance Summary
          </h2>
          {isBoard ? (
            <span className="text-[10px] text-amber-400 font-bold bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-500/30">
              बोर्ड परीक्षा नियम (No Negative Mark)
            </span>
          ) : (
            <span className="text-[10px] text-slate-400 font-mono">
              All India Benchmark
            </span>
          )}
        </div>

        {/* Row: Score + Neg. Marks Badge */}
        <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800/80 p-3.5 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/15 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 font-black text-sm shrink-0">
              ✓
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white font-mono leading-none">
                {data.score} <span className="text-xs text-slate-400 font-normal">| {data.totalMarks}</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Your Score</span>
            </div>
          </div>

          <div>
            {!isBoard && (data.netNegativeMarks !== undefined || data.wrong > 0) ? (
              <span className="px-3 py-1 bg-rose-500/15 border border-rose-500/30 rounded-full text-xs font-black text-rose-400 font-mono">
                Neg. Marks : - {data.netNegativeMarks ?? (data.wrong * (data.negativeMarksPerWrong || 0.5)).toFixed(1)}
              </span>
            ) : (
              <span className="px-3 py-1 bg-emerald-500/15 border border-emerald-500/30 rounded-full text-xs font-black text-emerald-400 font-mono">
                Neg. Marks : 0.0
              </span>
            )}
          </div>
        </div>

        {/* Row: Time Spent */}
        <div className="flex items-center gap-3 bg-slate-900/40 border border-slate-800/80 p-3.5 rounded-2xl">
          <div className="w-10 h-10 rounded-full bg-purple-500/15 border-2 border-purple-500 flex items-center justify-center text-purple-400 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-black text-white font-mono leading-none">
              {timeSpentFormatted} <span className="text-xs text-slate-400 font-normal">| {totalTimeFormatted}</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Time Spent</span>
          </div>
        </div>

        {/* 3 Metric Cards Grid (Rank, Percentile, Accuracy) */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
          {/* Card A: Your Rank */}
          <div className="p-3 sm:p-4 bg-slate-900/70 border border-slate-800 rounded-2xl flex flex-col items-center text-center space-y-1">
            <div className="w-8 h-8 rounded-full bg-amber-500/15 border border-amber-500/50 flex items-center justify-center text-amber-400">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
            <div className="text-sm sm:text-base font-black text-white font-mono pt-1">
              {calculatedRank} <span className="text-[10px] text-slate-400 font-normal">| {totalStudents}</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Your Rank</span>
          </div>

          {/* Card B: Percentile */}
          <div className="p-3 sm:p-4 bg-slate-900/70 border border-slate-800 rounded-2xl flex flex-col items-center text-center space-y-1">
            <div className="w-8 h-8 rounded-full bg-rose-500/15 border border-rose-500/50 flex items-center justify-center text-rose-400">
              <Percent className="w-4 h-4" />
            </div>
            <div className="text-sm sm:text-base font-black text-white font-mono pt-1">
              {calculatedPercentile} <span className="text-[10px] text-slate-400 font-normal">| 100</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Percentile</span>
          </div>

          {/* Card C: Accuracy */}
          <div className="p-3 sm:p-4 bg-slate-900/70 border border-slate-800 rounded-2xl flex flex-col items-center text-center space-y-1">
            <div className="w-8 h-8 rounded-full bg-cyan-500/15 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
              <Target className="w-4 h-4" />
            </div>
            <div className="text-sm sm:text-base font-black text-white font-mono pt-1">
              {data.accuracy}% <span className="text-[10px] text-slate-400 font-normal">| 100</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Accuracy</span>
          </div>
        </div>

        {/* Action Buttons: Share & Re-Attempt */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={handleShare}
            className="py-3 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-black text-xs rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
          >
            <Share2 className="w-4 h-4 text-indigo-400" />
            <span>&lt; Share</span>
          </button>

          <button
            onClick={onReattempt}
            className="py-3 px-4 bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white font-black text-xs rounded-2xl shadow-lg shadow-rose-950/40 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Re-Attempt</span>
          </button>
        </div>
      </div>

      {/* 3. CARD 2: SECTIONAL SUMMARY */}
      <div className="bg-[#0C1222] border border-slate-800/90 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4">
        <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-300">
          Sectional Summary
        </h2>

        {/* Pill tab */}
        <div className="border-b border-slate-800 flex items-center gap-4">
          <button className="pb-2 text-xs font-black text-white border-b-2 border-indigo-500 cursor-pointer">
            {data.subject || 'All Sections'}
          </button>
        </div>

        <div className="flex items-center justify-between p-3 bg-slate-900/60 border border-slate-800/80 rounded-2xl text-xs font-mono">
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Score</span>
            <span className="text-base font-black text-white">{data.score} / {data.totalMarks}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Accuracy</span>
            <span className="text-base font-black text-cyan-400">{data.accuracy}%</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Correct/Wrong</span>
            <span className="text-base font-black text-emerald-400">{data.correct}</span>
            <span className="text-slate-500 mx-1">/</span>
            <span className="text-base font-black text-rose-400">{data.wrong}</span>
          </div>
        </div>
      </div>

      {/* 4. CARD 3: RATE THIS TEST (Matches Image 2) */}
      <div className="bg-[#0C1222] border border-slate-800/90 rounded-3xl p-4 sm:p-5 shadow-2xl text-center space-y-3">
        <h3 className="text-xs sm:text-sm font-black text-slate-200">
          Rate this test
        </h3>
        <p className="text-xs text-slate-400">
          We would love to know how was your experience with this test?
        </p>

        {/* 5 Stars */}
        <div className="flex items-center justify-center gap-2 pt-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRating(star)}
              className="text-2xl sm:text-3xl transition-transform hover:scale-125 cursor-pointer"
              title={`Rate ${star} Star`}
            >
              {star <= userRating ? '⭐' : '☆'}
            </button>
          ))}
        </div>
        {hasRated && (
          <p className="text-[11px] text-emerald-400 font-bold animate-fade-in">
            Thank you for helping us make tests better! 🌟
          </p>
        )}
      </div>

      {/* 5. CARD 4: COMPARISON CHART (Matches Image 3) */}
      <div className="bg-[#0C1222] border border-slate-800/90 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4">
        <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-300">
          Comparison Chart
        </h2>

        {/* Tab Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {(['score', 'correct', 'wrong', 'accuracy'] as const).map((tab) => {
            const labels = {
              score: 'Your Score',
              correct: 'Correct',
              wrong: 'Incorrect',
              accuracy: 'Accuracy'
            };
            return (
              <button
                key={tab}
                onClick={() => setComparisonTab(tab)}
                className={`px-3 py-1.5 rounded-full font-black text-xs transition-all cursor-pointer whitespace-nowrap ${
                  comparisonTab === tab
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>

        {/* Visual 3-Bar Comparison (You vs Average vs Topper) */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 sm:p-6 space-y-4">
          <div className="flex items-end justify-around gap-4 h-48 sm:h-52 pt-6 pb-2 border-b border-slate-800">
            {/* 1. YOU */}
            <div className="flex flex-col items-center gap-2 h-full justify-end flex-1 max-w-[80px]">
              <span className="text-xs font-mono font-black text-rose-400">
                {benchmark.you} {benchmark.unit}
              </span>
              <div 
                style={{ height: `${Math.max(12, Math.min(100, (Number(benchmark.you) / Math.max(1, benchmark.max)) * 100))}%` }}
                className="w-full bg-gradient-to-t from-rose-600 to-red-400 rounded-t-xl transition-all duration-700 shadow-lg shadow-rose-950/40"
              />
              <span className="text-xs font-extrabold text-white">You</span>
            </div>

            {/* 2. AVERAGE */}
            <div className="flex flex-col items-center gap-2 h-full justify-end flex-1 max-w-[80px]">
              <span className="text-xs font-mono font-black text-indigo-400">
                {benchmark.avg} {benchmark.unit}
              </span>
              <div 
                style={{ height: `${Math.max(12, Math.min(100, (Number(benchmark.avg) / Math.max(1, benchmark.max)) * 100))}%` }}
                className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-xl transition-all duration-700 shadow-lg shadow-indigo-950/40"
              />
              <span className="text-xs font-extrabold text-white">Average</span>
            </div>

            {/* 3. TOPPER */}
            <div className="flex flex-col items-center gap-2 h-full justify-end flex-1 max-w-[80px]">
              <span className="text-xs font-mono font-black text-amber-400">
                {benchmark.topper} {benchmark.unit}
              </span>
              <div 
                style={{ height: `${Math.max(12, Math.min(100, (Number(benchmark.topper) / Math.max(1, benchmark.max)) * 100))}%` }}
                className="w-full bg-gradient-to-t from-amber-600 to-yellow-400 rounded-t-xl transition-all duration-700 shadow-lg shadow-amber-950/40"
              />
              <span className="text-xs font-extrabold text-white">Topper</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 text-center">
            {comparisonTab === 'score' && `शीर्ष टॉपर का स्कोर ${topperScore}/${data.totalMarks} है। अपनी गलतियों का विश्लेषण करने के लिए 'View Solutions' देखें।`}
            {comparisonTab === 'accuracy' && `टॉपर की सटीकता 98%+ रही है। जल्दबाजी में गलत उत्तर देने से बचें।`}
            {comparisonTab === 'correct' && `आपने ${data.correct} सही उत्तर दिए। लगातार अभ्यास से यह संख्या 90% तक पहुंच सकती है।`}
            {comparisonTab === 'wrong' && `गलत प्रश्नों को Mistake Notebook में सहेजें ताकि अगली बार यह गलती न हो।`}
          </p>
        </div>
      </div>

      {/* 6. CARD 5: QUESTION DISTRIBUTION (Matches Image 3) */}
      <div className="bg-[#0C1222] border border-slate-800/90 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4">
        <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-300">
          Question Distribution
        </h2>

        {/* Segmented Horizontal Bar */}
        <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
          {data.correct > 0 && (
            <div 
              style={{ width: `${(data.correct / data.totalQuestions) * 100}%` }}
              className="bg-cyan-500 h-full transition-all"
              title={`${data.correct} Correct`}
            />
          )}
          {data.wrong > 0 && (
            <div 
              style={{ width: `${(data.wrong / data.totalQuestions) * 100}%` }}
              className="bg-rose-500 h-full transition-all"
              title={`${data.wrong} Wrong`}
            />
          )}
          {data.unattempted > 0 && (
            <div 
              style={{ width: `${(data.unattempted / data.totalQuestions) * 100}%` }}
              className="bg-slate-600 h-full transition-all"
              title={`${data.unattempted} Unattempted`}
            />
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-xs pt-1 px-1">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-cyan-500 inline-block shrink-0" />
            <span className="font-bold text-slate-200">{data.correct} Correct</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block shrink-0" />
            <span className="font-bold text-slate-200">{data.wrong} Wrong</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-600 inline-block shrink-0" />
            <span className="font-bold text-slate-300">{data.unattempted} Unattempted</span>
          </div>
        </div>
      </div>

      {/* 7. CARD 6: LEADERBOARD (Matches Image 4) */}
      <div className="bg-[#0C1222] border border-slate-800/90 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
              Leaderboard
            </h2>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            Top 10 Rankers
          </span>
        </div>

        {/* Rankers List */}
        <div className="space-y-2">
          {curatedLeaderboard.map((item) => (
            <div
              key={item.rank}
              className="flex items-center justify-between p-2.5 bg-slate-900/50 hover:bg-slate-900 border border-slate-800/80 rounded-xl text-xs transition-all"
            >
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 ${
                  item.rank === 1 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50' :
                  item.rank === 2 ? 'bg-slate-300/20 text-slate-200 border border-slate-400/50' :
                  item.rank === 3 ? 'bg-orange-500/20 text-orange-300 border border-orange-500/50' :
                  'bg-slate-800 text-slate-400'
                }`}>
                  {item.rank}
                </span>
                <span className="font-bold text-slate-200">{item.name}</span>
              </div>

              <span className="font-mono font-black text-amber-300">
                {item.score} / {item.total}
              </span>
            </div>
          ))}
        </div>

        {/* Pinned Bottom Student Card (Matches Image 4 Bottom) */}
        <div className="p-3.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-2 border-indigo-500/50 rounded-2xl flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md">
              {(data.userName || 'Hanslal Pal').charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-extrabold text-xs sm:text-sm text-white">
                {data.userName || 'Hanslal pal'}
              </div>
              <p className="text-[11px] text-emerald-400 font-medium">
                Way to go! Keep Practicing.
              </p>
            </div>
          </div>

          <div className="text-right shrink-0 font-mono">
            <div className="text-xs sm:text-sm font-black text-white">
              {data.score}.00 <span className="text-[10px] text-slate-400 font-normal">/ {data.totalMarks}</span>
            </div>
            <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-tight block">
              Rank: {calculatedRank}
            </span>
          </div>
        </div>
      </div>

      {/* 8. EXPANDABLE DETAILED SOLUTIONS SECTION */}
      {showSolutions && (
        <div className="bg-[#0C1222] border border-slate-800/90 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-extrabold text-white">
                विस्तृत प्रश्नवार समाधान (Detailed Step-by-Step Solutions)
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {data.questions.length} Questions
            </span>
          </div>

          <div className="space-y-4 pt-1">
            {data.questions.map((q, idx) => {
              const userPick = data.userAnswers[idx];
              const isCorrect = userPick === q.answerIndex;
              const isAttempted = userPick !== undefined;

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all space-y-3 bg-[#080D18] ${
                    !isAttempted
                      ? 'border-slate-800'
                      : isCorrect
                      ? 'border-emerald-500/40 bg-emerald-950/10'
                      : 'border-rose-500/40 bg-rose-950/10'
                  }`}
                >
                  {/* Question Header */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-300">
                      प्रश्न #{idx + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      {isCorrect ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-[11px] flex items-center gap-1">
                          <Check className="w-3 h-3" /> Correct
                        </span>
                      ) : isAttempted ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold text-[11px] flex items-center gap-1">
                          <X className="w-3 h-3" /> Incorrect
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-semibold text-[11px]">
                          Unattempted
                        </span>
                      )}

                      {onToggleBookmark && isQuestionBookmarked && (
                        <button
                          onClick={() => onToggleBookmark(q)}
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                            isQuestionBookmarked(q.question)
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border-slate-700'
                          }`}
                          title="Bookmark Question"
                        >
                          {isQuestionBookmarked(q.question) ? (
                            <BookmarkCheck className="w-3.5 h-3.5 fill-amber-400" />
                          ) : (
                            <Bookmark className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}

                      {!isCorrect && onAddToMistakeNotebook && (
                        <button
                          onClick={() => onAddToMistakeNotebook(q, userPick)}
                          className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-[10px] font-bold rounded-lg cursor-pointer transition-colors"
                        >
                          + मिस्टेक नोटबुक
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Question Text */}
                  <p className="text-xs sm:text-sm font-semibold text-slate-100 whitespace-pre-line leading-relaxed">
                    {q.question}
                  </p>

                  {/* Options List */}
                  <div className="space-y-1.5 pt-1">
                    {q.options.map((opt, oIdx) => {
                      const isOptionCorrect = oIdx === q.answerIndex;
                      const isOptionPicked = userPick === oIdx;

                      let optClasses = "p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all ";
                      if (isOptionCorrect) {
                        optClasses += "bg-emerald-950/40 border-emerald-500/60 text-emerald-200 font-bold";
                      } else if (isOptionPicked) {
                        optClasses += "bg-rose-950/40 border-rose-500/60 text-rose-200 font-medium";
                      } else {
                        optClasses += "bg-slate-900/60 border-slate-800/80 text-slate-400";
                      }

                      return (
                        <div key={oIdx} className={optClasses}>
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-800/80 border border-slate-700 text-[10px] font-mono flex items-center justify-center shrink-0">
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            {isOptionPicked && (
                              <span className="text-[10px] text-slate-400 font-bold px-1.5 py-0.5 rounded bg-slate-800">
                                Your Pick
                              </span>
                            )}
                            {isOptionCorrect && (
                              <span className="text-[10px] text-emerald-300 font-bold px-1.5 py-0.5 rounded bg-emerald-500/20">
                                Correct Answer ✓
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation Box */}
                  {q.explanation && (
                    <div className="p-3 bg-indigo-950/30 border border-indigo-500/30 rounded-xl space-y-1 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-indigo-300">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>व्याख्या व कॉन्सेप्ट (Concept & Explanation):</span>
                      </div>
                      <p className="text-slate-300 whitespace-pre-line leading-relaxed">
                        {q.explanation}
                      </p>
                      {q.hint && (
                        <p className="text-[11px] text-amber-300/80 pt-1">
                          💡 <strong>याद रखने की ट्रिक:</strong> {q.hint}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 9. BOTTOM FIXED BAR: VIEW SOLUTIONS (Matches Image 4) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-3 bg-[#080C16]/95 backdrop-blur-md border-t border-slate-800/90 flex items-center justify-center">
        <div className="max-w-3xl w-full flex items-center gap-3">
          <button
            onClick={() => setShowSolutions(!showSolutions)}
            className="flex-1 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl shadow-blue-950/50 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
          >
            <BookOpen className="w-4 h-4" />
            <span>{showSolutions ? 'Hide Solutions ▲' : 'View Solutions ▼'}</span>
          </button>

          {onExportPdf && (
            <button
              onClick={() => {
                const solutionRaw = `TEST: ${data.testTitle}\nSCORE: ${data.score}/${data.totalMarks} (${data.accuracy}%)\n` +
                  data.questions.map((q, i) => {
                    const pick = data.userAnswers[i] !== undefined ? q.options[data.userAnswers[i]] : 'Not Attempted';
                    return `Q${i+1}: ${q.question}\nYour Pick: ${pick}\nCorrect: ${q.options[q.answerIndex]}\nExplanation: ${q.explanation || 'N/A'}`;
                  }).join('\n\n---\n\n');
                onExportPdf(`Result-${data.testTitle}`, 'test-result-export', solutionRaw);
              }}
              className="px-4 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-2xl border border-slate-700 flex items-center gap-1.5 cursor-pointer transition-all shrink-0"
              title="Download Solutions PDF"
            >
              <Download className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">PDF</span>
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
