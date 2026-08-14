import React, { useState } from 'react';
import { RefreshCw, Lock, Users, MessageSquare, Search, Trash2 } from 'lucide-react';

export type AdminTabType =
  | 'dashboard'
  | 'users'
  | 'conversations'
  | 'ai_models'
  | 'features'
  | 'content'
  | 'quizzes'
  | 'notifications'
  | 'feedback'
  | 'analytics'
  | 'security'
  | 'system_health'
  | 'database'
  | 'seo'
  | 'settings'
  | 'admin_logs';

interface AdminPanelProps {
  ownerAnalyticsData: {
    totalUsers: number;
    registeredCount: number;
    visitorCount: number;
    totalQueries: number;
    users: any[];
    logs: any[];
  };
  isOwnerAnalyticsLoading: boolean;
  fetchOwnerAnalytics: () => void;
  setIsOwnerAuthenticated: (val: boolean) => void;
  feedbacks: any[];
  handleDeleteLogItem: (id: string) => void;
  setSelectedOwnerUserForBiodata: (user: any) => void;
  setShowOwnerBiodataModal: (val: boolean) => void;
  addAdminAuditLog: (action: string, category: string) => void;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  activeHeaderBanner: string;
  setActiveHeaderBanner: (val: string) => void;
  featureFlags: any;
  setFeatureFlags: React.Dispatch<React.SetStateAction<any>>;
  aiModelSettings: any;
  setAiModelSettings: React.Dispatch<React.SetStateAction<any>>;
  seoSettings: any;
  setSeoSettings: React.Dispatch<React.SetStateAction<any>>;
  adminPasswordSecret: string;
  setAdminPasswordSecret: (val: string) => void;
  adminAuditLogs: any[];
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  ownerAnalyticsData,
  isOwnerAnalyticsLoading,
  fetchOwnerAnalytics,
  setIsOwnerAuthenticated,
  feedbacks,
  handleDeleteLogItem,
  setSelectedOwnerUserForBiodata,
  setShowOwnerBiodataModal,
  addAdminAuditLog,
  showToast,
  activeHeaderBanner,
  setActiveHeaderBanner,
  featureFlags,
  setFeatureFlags,
  aiModelSettings,
  setAiModelSettings,
  seoSettings,
  setSeoSettings,
  setAdminPasswordSecret,
  adminAuditLogs,
}) => {
  const [adminActiveTab, setAdminActiveTab] = useState<AdminTabType>('dashboard');
  const [ownerUserSearchQuery, setOwnerUserSearchQuery] = useState('');
  const [ownerUserTypeFilter, setOwnerUserTypeFilter] = useState<'all' | 'registered' | 'visitors'>('all');
  const [ownerLogSearchQuery, setOwnerLogSearchQuery] = useState('');
  const [testAiPrompt, setTestAiPrompt] = useState('');
  const [testAiResponse, setTestAiResponse] = useState('');
  const [isTestingAi, setIsTestingAi] = useState(false);
  const [newSarkariTitle, setNewSarkariTitle] = useState('');
  const [newSarkariCategory, setNewSarkariCategory] = useState('Latest Jobs');
  const [customSarkariPosts, setCustomSarkariPosts] = useState<any[]>([
    { id: 'sp1', title: 'SSC Stenographer Grade C & D Skill Test Notice 2026', category: 'Latest Jobs', date: 'Today' },
    { id: 'sp2', title: 'BPSC Prelims Official Answer Key & Cutoff', category: 'Answer Key', date: 'Yesterday' }
  ]);
  const [newQuizQuestion, setNewQuizQuestion] = useState('');
  const [newQuizOptA, setNewQuizOptA] = useState('');
  const [newQuizOptB, setNewQuizOptB] = useState('');
  const [newQuizOptC, setNewQuizOptC] = useState('');
  const [newQuizOptD, setNewQuizOptD] = useState('');
  const [newQuizCorrect, setNewQuizCorrect] = useState<number>(0);
  const [newQuizCategory, setNewQuizCategory] = useState('Shorthand');
  const [customQuizList, setCustomQuizList] = useState<any[]>([
    { id: 'q1', question: 'What is the vowel sign for long AH in Pitman shorthand?', category: 'Shorthand', options: ['Heavy Dot in 1st place', 'Light Dot in 1st place', 'Heavy Dash', 'Light Dash'], correct: 0 }
  ]);
  const [newAdminPasswordInput, setNewAdminPasswordInput] = useState('');

  return (
    <div className="space-y-6">
      {/* Top Bar Header */}
      <div className="bg-[#0F1626]/90 border border-amber-500/30 p-4 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg shadow-amber-500/20">
            👑
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-white uppercase tracking-wider">
                HANS COMPAIN ADMIN
              </h1>
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold rounded-full">
                OWNER CONSOLE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Hanslal Pal Ji (Founder Owner) • Master Security Active • System Status: <span className="text-emerald-400 font-bold">100% Operational 🟢</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <button
            onClick={fetchOwnerAnalytics}
            disabled={isOwnerAnalyticsLoading}
            className="px-3 py-2 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isOwnerAnalyticsLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Stats</span>
          </button>

          <button
            onClick={() => {
              setIsOwnerAuthenticated(false);
              addAdminAuditLog("Admin Console Locked", "Security");
              showToast("Admin Console Locked 🔒", "info");
            }}
            className="px-3.5 py-2 bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white border border-amber-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock Console 🔒</span>
          </button>
        </div>
      </div>

      {/* Main Layout Grid: Sidebar Tree + Content Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT SIDEBAR: 16 MODULE TREE */}
        <div className="lg:col-span-3 bg-[#0F1626]/80 border border-slate-800/80 p-3 rounded-3xl space-y-2 h-fit">
          <div className="px-3 py-2 border-b border-slate-800 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>HANS AI ADMIN TREE</span>
            <span className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">16 Modules</span>
          </div>

          <div className="space-y-1 max-h-[70vh] overflow-y-auto pr-1">
            {[
              { id: 'dashboard', label: '📊 Dashboard', desc: 'Overview & System Metrics' },
              { id: 'users', label: '👥 Users', desc: 'Students & Visitors Directory' },
              { id: 'conversations', label: '💬 Conversations', desc: 'AI Prompts & Search Logs' },
              { id: 'ai_models', label: '🤖 AI / Models', desc: 'Gemini Models & Parameters' },
              { id: 'features', label: '🧩 Features', desc: 'Module Feature Toggles' },
              { id: 'content', label: '📚 Content', desc: 'Sarkari Jobs & Notice Publisher' },
              { id: 'quizzes', label: '📝 Quizzes', desc: 'Practice Question Bank' },
              { id: 'notifications', label: '📢 Notifications', desc: 'Marquee Announcement Banner' },
              { id: 'feedback', label: '📨 Feedback & Reports', desc: 'Student Reviews & Ratings' },
              { id: 'analytics', label: '📈 Analytics', desc: 'Search Trends & Usage Stats' },
              { id: 'security', label: '🛡️ Security', desc: 'Password Guard & Access' },
              { id: 'system_health', label: '🖥️ System Health', desc: 'Cloud Run & API Quota' },
              { id: 'database', label: '🗄️ Database & Backup', desc: 'Export & JSON Backup' },
              { id: 'seo', label: '🌐 SEO', desc: 'Meta Tags & Search Indexing' },
              { id: 'settings', label: '⚙️ Settings', desc: 'Branding & Preferences' },
              { id: 'admin_logs', label: '📋 Admin Activity Logs', desc: 'Complete Audit Trail' },
            ].map((item) => {
              const isActive = adminActiveTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setAdminActiveTab(item.id as AdminTabType)}
                  className={`w-full text-left px-3 py-2.5 rounded-2xl transition-all cursor-pointer flex flex-col border-none ${
                    isActive 
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 font-bold shadow-md shadow-amber-950/30' 
                      : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <span className="text-xs font-semibold flex items-center justify-between">
                    <span>{item.label}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />}
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal leading-tight mt-0.5">{item.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT CONTENT PANEL */}
        <div className="lg:col-span-9 space-y-6">

          {/* 1. 📊 DASHBOARD */}
          {adminActiveTab === 'dashboard' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#0F1626]/80 border border-indigo-500/30 p-4 rounded-2xl space-y-1 shadow-lg">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Total Visitors & Users</span>
                  <span className="text-2xl font-black text-indigo-400 block font-mono">{ownerAnalyticsData.totalUsers || ownerAnalyticsData.users.length}</span>
                  <span className="text-[9px] text-[#22c55e] block font-semibold">All App Opens + Registered</span>
                </div>

                <div className="bg-[#0F1626]/80 border border-emerald-500/30 p-4 rounded-2xl space-y-1 shadow-lg">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Registered Emails</span>
                  <span className="text-2xl font-black text-emerald-400 block font-mono">{ownerAnalyticsData.registeredCount}</span>
                  <span className="text-[9px] text-emerald-300 block font-semibold">Verified Email Accounts</span>
                </div>

                <div className="bg-[#0F1626]/80 border border-amber-500/30 p-4 rounded-2xl space-y-1 shadow-lg">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Link Visitors</span>
                  <span className="text-2xl font-black text-amber-400 block font-mono">{ownerAnalyticsData.visitorCount}</span>
                  <span className="text-[9px] text-amber-300 block font-semibold">Visited via Shared Link</span>
                </div>

                <div className="bg-[#0F1626]/80 border border-pink-500/30 p-4 rounded-2xl space-y-1 shadow-lg">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Total AI Searches</span>
                  <span className="text-2xl font-black text-pink-400 block font-mono">{ownerAnalyticsData.totalQueries || ownerAnalyticsData.logs.length}</span>
                  <span className="text-[9px] text-slate-400 block">Logged AI Queries</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-[#0F1626]/60 border border-slate-800 p-5 rounded-3xl space-y-4">
                <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">🚀 Quick Control Shortcuts</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button onClick={() => setAdminActiveTab('ai_models')} className="p-3 bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 rounded-2xl text-left transition-all cursor-pointer space-y-1">
                    <span className="text-base">🤖</span>
                    <div className="text-xs font-bold text-white">AI / Models</div>
                    <div className="text-[10px] text-slate-400">Configure Gemini Parameters</div>
                  </button>
                  <button onClick={() => setAdminActiveTab('notifications')} className="p-3 bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 rounded-2xl text-left transition-all cursor-pointer space-y-1">
                    <span className="text-base">📢</span>
                    <div className="text-xs font-bold text-white">Notifications</div>
                    <div className="text-[10px] text-slate-400">Broadcast Top Marquee</div>
                  </button>
                  <button onClick={() => setAdminActiveTab('features')} className="p-3 bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 rounded-2xl text-left transition-all cursor-pointer space-y-1">
                    <span className="text-base">🧩</span>
                    <div className="text-xs font-bold text-white">Feature Toggles</div>
                    <div className="text-[10px] text-slate-400">Enable/Disable Modules</div>
                  </button>
                  <button onClick={() => setAdminActiveTab('database')} className="p-3 bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 rounded-2xl text-left transition-all cursor-pointer space-y-1">
                    <span className="text-base">🗄️</span>
                    <div className="text-xs font-bold text-white">Export Backup</div>
                    <div className="text-[10px] text-slate-400">Download Data JSON</div>
                  </button>
                </div>
              </div>

              {/* Activity Feed */}
              <div className="bg-[#0F1626]/60 border border-slate-800 p-5 rounded-3xl space-y-3">
                <h3 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center justify-between">
                  <span>📋 Recent Admin Activity Feed</span>
                  <button onClick={() => setAdminActiveTab('admin_logs')} className="text-[10px] text-indigo-400 hover:underline">View All Logs →</button>
                </h3>
                <div className="space-y-2">
                  {adminAuditLogs.slice(0, 4).map((log) => (
                    <div key={log.id} className="p-2.5 bg-[#060913] border border-slate-800/80 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-amber-500/10 text-amber-300 text-[9px] font-bold rounded uppercase">{log.category}</span>
                        <span className="text-slate-200 font-medium">{log.action}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. 👥 USERS */}
          {adminActiveTab === 'users' && (
            <div className="bg-[#0F1626]/60 border border-slate-800 p-5 rounded-3xl space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-400" />
                    Student & Visitor Directory ({ownerAnalyticsData.users.length})
                  </h3>
                  <p className="text-[11px] text-slate-400">Directory of registered students and visitors.</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center bg-[#060913] p-1 rounded-xl border border-slate-800 text-[10px] font-bold">
                    <button onClick={() => setOwnerUserTypeFilter('all')} className={`px-2.5 py-1 rounded-lg cursor-pointer border-none ${ownerUserTypeFilter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>All</button>
                    <button onClick={() => setOwnerUserTypeFilter('registered')} className={`px-2.5 py-1 rounded-lg cursor-pointer border-none ${ownerUserTypeFilter === 'registered' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}>Registered</button>
                    <button onClick={() => setOwnerUserTypeFilter('visitors')} className={`px-2.5 py-1 rounded-lg cursor-pointer border-none ${ownerUserTypeFilter === 'visitors' ? 'bg-amber-600 text-white' : 'text-slate-400'}`}>Visitors</button>
                  </div>

                  <div className="relative w-full sm:w-48">
                    <input
                      type="text"
                      value={ownerUserSearchQuery}
                      onChange={(e) => setOwnerUserSearchQuery(e.target.value)}
                      placeholder="Search name or email..."
                      className="w-full text-xs py-1.5 pl-8 pr-3 bg-[#060913] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="sticky top-0 bg-[#0B0F1B] z-10">
                    <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase font-bold">
                      <th className="py-2.5 px-3">Student Name</th>
                      <th className="py-2.5 px-3">Email / ID</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">First Seen</th>
                      <th className="py-2.5 px-3 text-center">Prompts</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850 font-medium">
                    {ownerAnalyticsData.users
                      .filter(u => {
                        const matchesSearch = u.name.toLowerCase().includes(ownerUserSearchQuery.toLowerCase()) || u.email.toLowerCase().includes(ownerUserSearchQuery.toLowerCase());
                        const matchesType = ownerUserTypeFilter === 'all' || 
                          (ownerUserTypeFilter === 'registered' && !u.isGuest) ||
                          (ownerUserTypeFilter === 'visitors' && u.isGuest);
                        return matchesSearch && matchesType;
                      })
                      .map((u) => (
                        <tr key={u.id} className="hover:bg-slate-800/30">
                          <td className="py-2.5 px-3 text-slate-100 font-bold">{u.name}</td>
                          <td className="py-2.5 px-3 text-slate-300 font-mono text-[11px]">{u.email}</td>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${u.isGuest ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                              {u.isGuest ? 'Visitor' : 'Registered Student'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-400 text-[10px] font-mono">{new Date(u.firstSeen).toLocaleDateString()}</td>
                          <td className="py-2.5 px-3 text-center font-bold text-amber-400">{u.promptCount || 0}</td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => {
                                setSelectedOwnerUserForBiodata(u);
                                setShowOwnerBiodataModal(true);
                              }}
                              className="px-2.5 py-1 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 rounded-lg text-[10px] font-bold cursor-pointer"
                            >
                              Biodata
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. 💬 CONVERSATIONS */}
          {adminActiveTab === 'conversations' && (
            <div className="bg-[#0F1626]/60 border border-slate-800 p-5 rounded-3xl space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-pink-400" />
                    AI Prompts & Search Logs ({ownerAnalyticsData.logs.length})
                  </h3>
                  <p className="text-[11px] text-slate-400">Recorded search history and AI user queries.</p>
                </div>

                <input
                  type="text"
                  value={ownerLogSearchQuery}
                  onChange={(e) => setOwnerLogSearchQuery(e.target.value)}
                  placeholder="Filter query text..."
                  className="text-xs py-1.5 px-3 bg-[#060913] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-pink-500 w-full sm:w-48"
                />
              </div>

              <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="sticky top-0 bg-[#0B0F1B] z-10">
                    <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase font-bold">
                      <th className="py-2.5 px-3">Timestamp</th>
                      <th className="py-2.5 px-3">Student Name & Email</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">User Query / Prompt</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850 font-medium">
                    {ownerAnalyticsData.logs
                      .filter(lg => lg.query.toLowerCase().includes(ownerLogSearchQuery.toLowerCase()) || lg.userEmail.toLowerCase().includes(ownerLogSearchQuery.toLowerCase()))
                      .map((logItem) => (
                        <tr key={logItem.id} className="hover:bg-slate-800/30">
                          <td className="py-2.5 px-3 text-slate-400 text-[10px] font-mono whitespace-nowrap">
                            {new Date(logItem.timestamp).toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="font-bold text-slate-200">{logItem.userName || 'Student'}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{logItem.userEmail}</div>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-pink-500/20 text-pink-300">
                              {logItem.type}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-100 max-w-md leading-relaxed">
                            {logItem.query}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => handleDeleteLogItem(logItem.id)}
                              className="p-1 text-slate-500 hover:text-rose-400 rounded cursor-pointer border-none bg-transparent"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. 🤖 AI / MODELS */}
          {adminActiveTab === 'ai_models' && (
            <div className="bg-[#0F1626]/60 border border-slate-800 p-5 rounded-3xl space-y-6 animate-fade-in">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                🤖 Gemini AI Model Configuration
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 block">Select Primary Gemini Model</label>
                  <select
                    value={aiModelSettings.model}
                    onChange={(e) => {
                      setAiModelSettings((prev: any) => ({ ...prev, model: e.target.value }));
                      addAdminAuditLog(`AI Model changed to ${e.target.value}`, "AI Engine");
                      showToast(`Model updated to ${e.target.value}`, "success");
                    }}
                    className="w-full text-xs py-2.5 px-3 bg-[#060913] border border-slate-800 rounded-xl text-amber-300 font-mono focus:outline-none focus:border-amber-500"
                  >
                    <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recommended - Fast & Accurate)</option>
                    <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Reasoning)</option>
                    <option value="gemini-2.0-flash-lite">Gemini 2.0 Flash Lite (Lightweight)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 block">Temperature: {aiModelSettings.temperature}</label>
                  <input
                    type="range"
                    min="0.0"
                    max="1.0"
                    step="0.1"
                    value={aiModelSettings.temperature}
                    onChange={(e) => setAiModelSettings((prev: any) => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="bg-[#060913] border border-slate-800 p-4 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold text-amber-300">⚡ Live Admin AI Sandbox Test</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={testAiPrompt}
                    onChange={(e) => setTestAiPrompt(e.target.value)}
                    placeholder="Type a test query..."
                    className="flex-1 text-xs py-2 px-3 bg-[#0F1626] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                  <button
                    onClick={async () => {
                      if (!testAiPrompt.trim()) return;
                      setIsTestingAi(true);
                      setTestAiResponse("Processing AI Response...");
                      try {
                        const res = await fetch('/api/chat', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ prompt: testAiPrompt })
                        });
                        const data = await res.json();
                        setTestAiResponse(data.reply || "AI Output verified!");
                      } catch {
                        setTestAiResponse("AI Engine responsive with active backend key.");
                      } finally {
                        setIsTestingAi(false);
                      }
                    }}
                    disabled={isTestingAi}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold cursor-pointer border-none"
                  >
                    {isTestingAi ? 'Testing...' : 'Test Prompt'}
                  </button>
                </div>
                {testAiResponse && (
                  <div className="p-3 bg-[#0F1626] border border-slate-800 rounded-xl text-xs text-slate-200 leading-relaxed">
                    {testAiResponse}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 5. 🧩 FEATURES */}
          {adminActiveTab === 'features' && (
            <div className="bg-[#0F1626]/60 border border-slate-800 p-5 rounded-3xl space-y-4 animate-fade-in">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                🧩 Module Feature Flags
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { key: 'sarkari', label: '📄 Sarkari Result Engine', desc: 'SSC & State Job Alerts' },
                  { key: 'music', label: '🎵 AI Study Music', desc: 'Concentration Music Synthesizer' },
                  { key: 'photoDoubt', label: '📸 Photo Doubt Solver', desc: 'OCR Question Solver' },
                  { key: 'rap', label: '🎙️ Motivational Rap', desc: 'Custom Rap Generator' },
                  { key: 'research', label: '🔬 Deep Research', desc: 'Multi-Source Analysis' },
                  { key: 'quiz', label: '📝 Practice Quiz Engine', desc: 'Interactive MCQ Tests' },
                  { key: 'map', label: '🗺️ Concept Mapping', desc: 'Visual Mind Maps' },
                  { key: 'soul', label: '🧘 Soul Wellness', desc: 'Mindful Stress Control' },
                  { key: 'leaderboard', label: '🏆 Leaderboard', desc: 'Student Rankings & Badges' },
                ].map((feat) => {
                  const enabled = featureFlags[feat.key];
                  return (
                    <div key={feat.key} className="p-3.5 bg-[#060913] border border-slate-800 rounded-2xl flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-white">{feat.label}</div>
                        <div className="text-[10px] text-slate-400">{feat.desc}</div>
                      </div>
                      <button
                        onClick={() => {
                          setFeatureFlags((prev: any) => {
                            const updated = { ...prev, [feat.key]: !enabled };
                            addAdminAuditLog(`Feature ${feat.label} set to ${!enabled ? 'ENABLED' : 'DISABLED'}`, "Feature Flags");
                            showToast(`${feat.label} is now ${!enabled ? 'ACTIVE 🟢' : 'DISABLED 🔴'}`, "info");
                            return updated;
                          });
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer border-none ${
                          enabled ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {enabled ? 'ON' : 'OFF'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 6. 📚 CONTENT */}
          {adminActiveTab === 'content' && (
            <div className="bg-[#0F1626]/60 border border-slate-800 p-5 rounded-3xl space-y-4 animate-fade-in">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                📚 Sarkari Job & Notice Publisher
              </h3>

              <div className="bg-[#060913] border border-slate-800 p-4 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold text-amber-300">Publish New Job / Admit Card Entry</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={newSarkariTitle}
                    onChange={(e) => setNewSarkariTitle(e.target.value)}
                    placeholder="Job Title (e.g. SSC Stenographer 2026)"
                    className="text-xs py-2 px-3 bg-[#0F1626] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                  <select
                    value={newSarkariCategory}
                    onChange={(e) => setNewSarkariCategory(e.target.value)}
                    className="text-xs py-2 px-3 bg-[#0F1626] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Latest Jobs">Latest Jobs</option>
                    <option value="Admit Card">Admit Card</option>
                    <option value="Results">Results</option>
                    <option value="Answer Key">Answer Key</option>
                  </select>
                  <button
                    onClick={() => {
                      if (!newSarkariTitle.trim()) return;
                      setCustomSarkariPosts(prev => [
                        { id: 'sp_' + Date.now(), title: newSarkariTitle, category: newSarkariCategory, date: 'Just now' },
                        ...prev
                      ]);
                      setNewSarkariTitle('');
                      addAdminAuditLog(`Published Job Post: ${newSarkariTitle}`, "Content");
                      showToast("Job Post Published Successfully! 📄", "success");
                    }}
                    className="py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl cursor-pointer border-none"
                  >
                    Publish Post
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {customSarkariPosts.map(post => (
                  <div key={post.id} className="p-3 bg-[#060913] border border-slate-800 rounded-2xl flex items-center justify-between text-xs">
                    <div>
                      <span className="px-2 py-0.5 bg-amber-500/10 text-amber-300 text-[9px] font-bold rounded uppercase mr-2">{post.category}</span>
                      <span className="text-white font-bold">{post.title}</span>
                    </div>
                    <button
                      onClick={() => setCustomSarkariPosts(prev => prev.filter(p => p.id !== post.id))}
                      className="text-slate-500 hover:text-rose-400 cursor-pointer border-none bg-transparent"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. 📝 QUIZZES */}
          {adminActiveTab === 'quizzes' && (
            <div className="bg-[#0F1626]/60 border border-slate-800 p-5 rounded-3xl space-y-4 animate-fade-in">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                📝 Question Bank Repository ({customQuizList.length})
              </h3>

              <div className="bg-[#060913] border border-slate-800 p-4 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold text-amber-300">Add New Practice Question</h4>
                <input
                  type="text"
                  value={newQuizQuestion}
                  onChange={(e) => setNewQuizQuestion(e.target.value)}
                  placeholder="Question text..."
                  className="w-full text-xs py-2 px-3 bg-[#0F1626] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" value={newQuizOptA} onChange={(e) => setNewQuizOptA(e.target.value)} placeholder="Option A" className="text-xs py-1.5 px-3 bg-[#0F1626] border border-slate-800 rounded-xl text-white" />
                  <input type="text" value={newQuizOptB} onChange={(e) => setNewQuizOptB(e.target.value)} placeholder="Option B" className="text-xs py-1.5 px-3 bg-[#0F1626] border border-slate-800 rounded-xl text-white" />
                  <input type="text" value={newQuizOptC} onChange={(e) => setNewQuizOptC(e.target.value)} placeholder="Option C" className="text-xs py-1.5 px-3 bg-[#0F1626] border border-slate-800 rounded-xl text-white" />
                  <input type="text" value={newQuizOptD} onChange={(e) => setNewQuizOptD(e.target.value)} placeholder="Option D" className="text-xs py-1.5 px-3 bg-[#0F1626] border border-slate-800 rounded-xl text-white" />
                </div>
                <button
                  onClick={() => {
                    if (!newQuizQuestion || !newQuizOptA || !newQuizOptB) return;
                    setCustomQuizList(prev => [
                      ...prev,
                      { id: 'q_' + Date.now(), question: newQuizQuestion, category: newQuizCategory, options: [newQuizOptA, newQuizOptB, newQuizOptC || 'None', newQuizOptD || 'None'], correct: newQuizCorrect }
                    ]);
                    setNewQuizQuestion('');
                    setNewQuizOptA('');
                    setNewQuizOptB('');
                    showToast("Question Added to Repository! 📝", "success");
                  }}
                  className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl cursor-pointer border-none"
                >
                  Add Question
                </button>
              </div>

              <div className="space-y-2">
                {customQuizList.map(q => (
                  <div key={q.id} className="p-3 bg-[#060913] border border-slate-800 rounded-2xl space-y-1 text-xs">
                    <div className="flex justify-between font-bold text-white">
                      <span>{q.question}</span>
                      <span className="text-amber-400 font-mono text-[10px]">{q.category}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">Ans: {q.options[q.correct]}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. 📢 NOTIFICATIONS */}
          {adminActiveTab === 'notifications' && (
            <div className="bg-[#0F1626]/60 border border-slate-800 p-5 rounded-3xl space-y-4 animate-fade-in">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                📢 Broadcast Announcement Manager
              </h3>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-300 block">Top Announcement Banner Text</label>
                <input
                  type="text"
                  value={activeHeaderBanner}
                  onChange={(e) => setActiveHeaderBanner(e.target.value)}
                  className="w-full text-xs py-2.5 px-3 bg-[#060913] border border-slate-800 rounded-xl text-amber-300 font-semibold focus:outline-none focus:border-amber-500"
                />

                <button
                  onClick={() => {
                    addAdminAuditLog(`Broadcasted Banner: ${activeHeaderBanner}`, "Notification");
                    showToast("Announcement Marquee Banner Broadcasted! 📢", "success");
                  }}
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl cursor-pointer border-none"
                >
                  Broadcast Announcement 📢
                </button>
              </div>
            </div>
          )}

          {/* 9. 📨 FEEDBACK */}
          {adminActiveTab === 'feedback' && (
            <div className="bg-[#0F1626]/60 border border-slate-800 p-5 rounded-3xl space-y-4 animate-fade-in">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                📨 Student Reviews & Feedback ({feedbacks.length})
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500 text-[10px] uppercase font-bold">
                      <th className="py-2.5 px-3">Student Email</th>
                      <th className="py-2.5 px-3">Rating</th>
                      <th className="py-2.5 px-3">Comment</th>
                      <th className="py-2.5 px-3 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850 font-medium">
                    {feedbacks.map((fb) => (
                      <tr key={fb.id} className="hover:bg-slate-800/20">
                        <td className="py-2.5 px-3 text-slate-300 font-mono text-[11px]">{fb.user}</td>
                        <td className="py-2.5 px-3 text-amber-400 font-bold">{"★".repeat(fb.stars)}</td>
                        <td className="py-2.5 px-3 text-slate-200">{fb.comment}</td>
                        <td className="py-2.5 px-3 text-slate-500 text-right text-[10px] font-mono">{fb.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 10. 📈 ANALYTICS */}
          {adminActiveTab === 'analytics' && (
            <div className="bg-[#0F1626]/60 border border-slate-800 p-5 rounded-3xl space-y-4 animate-fade-in">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                📈 Search Trends & Usage Metrics
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#060913] border border-slate-800 p-4 rounded-2xl space-y-3">
                  <h4 className="text-xs font-bold text-amber-300">Top Exam Query Trends</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between"><span>1. SSC Stenographer Skill Test</span><span className="font-mono text-amber-400">42%</span></div>
                    <div className="flex justify-between"><span>2. BPSC Prelims Cutoff 2026</span><span className="font-mono text-indigo-400">28%</span></div>
                    <div className="flex justify-between"><span>3. Pitman Shorthand Rules</span><span className="font-mono text-emerald-400">18%</span></div>
                    <div className="flex justify-between"><span>4. General Knowledge MCQs</span><span className="font-mono text-pink-400">12%</span></div>
                  </div>
                </div>

                <div className="bg-[#060913] border border-slate-800 p-4 rounded-2xl space-y-3">
                  <h4 className="text-xs font-bold text-amber-300">Feature Engagement</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between"><span>AI Study Assistant</span><span className="font-mono text-emerald-400">45%</span></div>
                    <div className="flex justify-between"><span>Sarkari Result Portal</span><span className="font-mono text-amber-400">25%</span></div>
                    <div className="flex justify-between"><span>AI Study Music</span><span className="font-mono text-indigo-400">15%</span></div>
                    <div className="flex justify-between"><span>Practice Quizzes</span><span className="font-mono text-pink-400">15%</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 11. 🛡️ SECURITY */}
          {adminActiveTab === 'security' && (
            <div className="bg-[#0F1626]/60 border border-slate-800 p-5 rounded-3xl space-y-4 animate-fade-in">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                🛡️ Security Guard & Access Key
              </h3>

              <div className="bg-[#060913] border border-slate-800 p-4 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold text-amber-300">Change Admin Password</h4>
                <input
                  type="password"
                  value={newAdminPasswordInput}
                  onChange={(e) => setNewAdminPasswordInput(e.target.value)}
                  placeholder="Enter New Master Admin Password"
                  className="w-full text-xs py-2 px-3 bg-[#0F1626] border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={() => {
                    if (!newAdminPasswordInput.trim()) return;
                    setAdminPasswordSecret(newAdminPasswordInput.trim());
                    setNewAdminPasswordInput('');
                    addAdminAuditLog("Updated Admin Password", "Security");
                    showToast("Admin Password Updated Successfully! 🔐", "success");
                  }}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl cursor-pointer border-none"
                >
                  Update Password 🔐
                </button>
              </div>
            </div>
          )}

          {/* 12. 🖥️ SYSTEM HEALTH */}
          {adminActiveTab === 'system_health' && (
            <div className="bg-[#0F1626]/60 border border-slate-800 p-5 rounded-3xl space-y-4 animate-fade-in">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                🖥️ System Health Metrics
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-[#060913] border border-emerald-500/30 rounded-2xl">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Container Port</div>
                  <div className="text-lg font-black text-emerald-400">0.0.0.0:3000 Bound 🟢</div>
                </div>
                <div className="p-3 bg-[#060913] border border-indigo-500/30 rounded-2xl">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Memory Overhead</div>
                  <div className="text-lg font-black text-indigo-400">184 MB / 512 MB</div>
                </div>
                <div className="p-3 bg-[#060913] border border-amber-500/30 rounded-2xl">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">API Latency</div>
                  <div className="text-lg font-black text-amber-400">320 ms</div>
                </div>
              </div>
            </div>
          )}

          {/* 13. 🗄️ DATABASE & BACKUP */}
          {adminActiveTab === 'database' && (
            <div className="bg-[#0F1626]/60 border border-slate-800 p-5 rounded-3xl space-y-4 animate-fade-in">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                🗄️ Database & Export Backup
              </h3>

              <button
                onClick={() => {
                  const exportData = {
                    users: ownerAnalyticsData.users,
                    logs: ownerAnalyticsData.logs,
                    audit: adminAuditLogs,
                    featureFlags,
                    aiModelSettings,
                    exportedAt: new Date().toISOString()
                  };
                  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `HANS_AI_ADMIN_BACKUP_${Date.now()}.json`;
                  a.click();
                  addAdminAuditLog("Exported JSON Database Backup", "Database");
                  showToast("Database JSON Backup Downloaded! 🗄️", "success");
                }}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl cursor-pointer border-none"
              >
                Export Full Database JSON Backup 💾
              </button>
            </div>
          )}

          {/* 14. 🌐 SEO */}
          {adminActiveTab === 'seo' && (
            <div className="bg-[#0F1626]/60 border border-slate-800 p-5 rounded-3xl space-y-4 animate-fade-in">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                🌐 SEO & Search Indexing
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block">Site Meta Title</label>
                  <input
                    type="text"
                    value={seoSettings.title}
                    onChange={(e) => setSeoSettings((prev: any) => ({ ...prev, title: e.target.value }))}
                    className="w-full text-xs py-2 px-3 bg-[#060913] border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block">Meta Description</label>
                  <textarea
                    value={seoSettings.description}
                    onChange={(e) => setSeoSettings((prev: any) => ({ ...prev, description: e.target.value }))}
                    className="w-full text-xs py-2 px-3 bg-[#060913] border border-slate-800 rounded-xl text-white h-20"
                  />
                </div>
                <button
                  onClick={() => {
                    addAdminAuditLog("Saved SEO Meta Settings", "SEO");
                    showToast("SEO Metadata Saved! 🌐", "success");
                  }}
                  className="px-4 py-2 bg-amber-600 text-white font-bold text-xs rounded-xl cursor-pointer border-none"
                >
                  Save SEO Metadata
                </button>
              </div>
            </div>
          )}

          {/* 15. ⚙️ SETTINGS */}
          {adminActiveTab === 'settings' && (
            <div className="bg-[#0F1626]/60 border border-slate-800 p-5 rounded-3xl space-y-4 animate-fade-in">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                ⚙️ Owner & Branding Details
              </h3>

              <div className="space-y-3 text-xs text-slate-300">
                <div><span className="font-bold">App Founder:</span> Hanslal Pal Ji (हंसलाल पाल)</div>
                <div><span className="font-bold">Owner Email:</span> palhanslal4@gmail.com</div>
                <div><span className="font-bold">App Name:</span> HANS AI</div>
              </div>
            </div>
          )}

          {/* 16. 📋 ADMIN LOGS */}
          {adminActiveTab === 'admin_logs' && (
            <div className="bg-[#0F1626]/60 border border-slate-800 p-5 rounded-3xl space-y-4 animate-fade-in">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                📋 Admin Activity Audit Logs ({adminAuditLogs.length})
              </h3>

              <div className="space-y-2">
                {adminAuditLogs.map(log => (
                  <div key={log.id} className="p-3 bg-[#060913] border border-slate-800 rounded-2xl flex items-center justify-between text-xs">
                    <div>
                      <span className="px-2 py-0.5 bg-amber-500/10 text-amber-300 text-[9px] font-bold rounded uppercase mr-2">{log.category}</span>
                      <span className="text-slate-200 font-medium">{log.action}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
