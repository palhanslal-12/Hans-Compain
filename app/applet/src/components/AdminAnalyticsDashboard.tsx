import React, { useEffect, useState } from 'react';
import { fetchAdminRealtimeMetrics, AdminMetricsData, trackFeatureUsage } from '../lib/analytics';
import { Users, Target, UserPlus, Flame, Activity, Award, Star, RefreshCw, BarChart3, Clock, Zap, MessageSquare } from 'lucide-react';

export const AdminAnalyticsDashboard: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [metrics, setMetrics] = useState<AdminMetricsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastRefreshed, setLastRefreshed] = useState<string>('');

  const loadMetrics = async () => {
    setLoading(true);
    const data = await fetchAdminRealtimeMetrics();
    setMetrics(data);
    setLastRefreshed(new Date().toLocaleTimeString());
    setLoading(false);
  };

  useEffect(() => {
    loadMetrics();
    trackFeatureUsage('admin_analytics_viewed');
  }, []);

  return (
    <div className="bg-slate-950 text-white rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-2xl max-w-6xl mx-auto space-y-6">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-400" />
            <h2 className="text-xl font-black text-white tracking-tight">HANS COMPAIN — Real-Time Admin Analytics</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Powered by Cloud Firestore Aggregates & Firebase Analytics SDK • Refreshed at: <span className="text-indigo-300 font-mono">{lastRefreshed || 'Loading...'}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadMetrics}
            disabled={loading}
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Metrics</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {loading && !metrics ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-3">
          <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
          <p className="text-xs text-slate-400 font-semibold">Fetching Real-Time Firebase Student Data...</p>
        </div>
      ) : metrics ? (
        <div className="space-y-6">
          {/* Top 3 High Level KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Metric 1: Total Registered Students */}
            <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-4 flex items-center gap-4 shadow-lg relative overflow-hidden group">
              <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">1. Registered Students</p>
                <h3 className="text-2xl font-black text-white font-mono mt-0.5">{metrics.totalRegisteredStudents.toLocaleString()}</h3>
                <span className="text-[10px] text-emerald-400 font-medium">Synced from Firestore 'users'</span>
              </div>
            </div>

            {/* Metric 3: New Users Today */}
            <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-4 shadow-lg relative overflow-hidden group">
              <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
                <UserPlus className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">3. New Users Today (24h)</p>
                <h3 className="text-2xl font-black text-emerald-300 font-mono mt-0.5">+{metrics.newUsersToday}</h3>
                <span className="text-[10px] text-emerald-400 font-medium">24-Hour Signups</span>
              </div>
            </div>

            {/* Metric 5: DAU & Session Duration */}
            <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4 flex items-center gap-4 shadow-lg relative overflow-hidden group">
              <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">5. Daily Active Users (DAU)</p>
                <h3 className="text-2xl font-black text-amber-300 font-mono mt-0.5">{metrics.dailyActiveUsers}</h3>
                <span className="text-[10px] text-amber-300 font-medium flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3" /> Avg Session: {metrics.avgSessionDurationMinutes} min
                </span>
              </div>
            </div>
          </div>

          {/* Middle Section: Metric 2 Target Exam Breakdown & Metric 4 Feature Usage Leaderboard */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Metric 2: Target Exam Breakdown */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Target className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-extrabold text-white">2. Target Exam Breakdown</h3>
              </div>

              <div className="space-y-3">
                {/* Steno Aspirants */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-cyan-300 flex items-center gap-1">✍️ SSC Stenographer</span>
                    <span className="font-mono text-cyan-400">{metrics.targetExamBreakdown.steno.count} ({metrics.targetExamBreakdown.steno.percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-cyan-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.max(metrics.targetExamBreakdown.steno.percentage, 4)}%` }}></div>
                  </div>
                </div>

                {/* Class 10th Board */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-blue-300 flex items-center gap-1">📚 Class 10th Board</span>
                    <span className="font-mono text-blue-400">{metrics.targetExamBreakdown.board_10th.count} ({metrics.targetExamBreakdown.board_10th.percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.max(metrics.targetExamBreakdown.board_10th.percentage, 4)}%` }}></div>
                  </div>
                </div>

                {/* Class 12th Board */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-indigo-300 flex items-center gap-1">🎓 Class 12th Board</span>
                    <span className="font-mono text-indigo-400">{metrics.targetExamBreakdown.board_12th.count} ({metrics.targetExamBreakdown.board_12th.percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.max(metrics.targetExamBreakdown.board_12th.percentage, 4)}%` }}></div>
                  </div>
                </div>

                {/* General / Competitive */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-400 flex items-center gap-1">🎯 General / Competitive</span>
                    <span className="font-mono text-slate-400">{metrics.targetExamBreakdown.general.count} ({metrics.targetExamBreakdown.general.percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-slate-600 h-full rounded-full transition-all duration-500" style={{ width: `${Math.max(metrics.targetExamBreakdown.general.percentage, 4)}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Metric 4: Feature Usage Leaderboard */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Flame className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-extrabold text-white">4. Feature Usage Leaderboard (Firebase Analytics)</h3>
              </div>

              <div className="space-y-2.5">
                {metrics.featureUsageLeaderboard.map((item, index) => (
                  <div key={item.key} className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-xl border border-slate-800 text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-5 h-5 rounded-full font-black text-[10px] flex items-center justify-center ${index === 0 ? 'bg-amber-500 text-black' : 'bg-slate-800 text-slate-300'}`}>
                        #{index + 1}
                      </span>
                      <span className="font-semibold text-slate-200">{item.name}</span>
                    </div>
                    <span className="font-mono font-extrabold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                      {item.clicks.toLocaleString()} events
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Section: Metric 6 Quizzes & Battles + Metric 7 Ratings & Feedback */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Metric 6: Total Quizzes Completed & Live Battles */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Award className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-extrabold text-white">6. Quizzes & Live Battles Engagement</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-purple-950/30 border border-purple-500/30 rounded-xl text-center">
                  <p className="text-[10px] font-bold text-purple-300 uppercase">Quizzes Completed</p>
                  <h4 className="text-2xl font-black text-purple-200 font-mono mt-1">{metrics.totalQuizzesCompleted}</h4>
                  <span className="text-[9px] text-purple-400">NCERT & PYQ Tests</span>
                </div>

                <div className="p-4 bg-rose-950/30 border border-rose-500/30 rounded-xl text-center">
                  <p className="text-[10px] font-bold text-rose-300 uppercase">Live Battles Played</p>
                  <h4 className="text-2xl font-black text-rose-200 font-mono mt-1">{metrics.totalLiveBattlesPlayed}</h4>
                  <span className="text-[9px] text-rose-400">Multiplayer Rooms</span>
                </div>
              </div>
            </div>

            {/* Metric 7: Average Rating & Feedback Insights */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <h3 className="text-sm font-extrabold text-white">7. Rating & Feedback Insights</h3>
                </div>
                <div className="flex items-center gap-1.5 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30">
                  <span className="text-amber-400 font-black text-sm">{metrics.avgStudentRating} / 5</span>
                  <span className="text-[10px] text-amber-300 font-medium">({metrics.totalReviewsCount} reviews)</span>
                </div>
              </div>

              <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                {metrics.recentFeedbackList.map((fb, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">{fb.name}</span>
                      <div className="flex text-amber-400 text-[10px]">
                        {'★'.repeat(fb.stars)}
                      </div>
                    </div>
                    <p className="text-slate-400 text-[11px] italic">"{fb.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
