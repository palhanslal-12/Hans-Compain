import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Activity,
  Users,
  Database,
  RefreshCw,
  Trash2,
  CheckCircle2,
  Mail,
  MessageSquare,
  Bell,
  Send,
  ExternalLink,
  ShieldAlert,
  Coins,
  Lock,
  Cpu,
  UserCheck,
  UserX,
  Clock,
  Smartphone,
  Laptop,
  Flame,
  Search,
  Zap,
  Eye,
  Check
} from 'lucide-react';
import { auth, signInWithGoogle, getLocalActivities } from '../firebase';
import { getSecurityAuditLogs, getClientIp } from '../utils/securityShield';
import { AppHealthScannerModal } from './AppHealthScannerModal';

interface VisitorRecord {
  userId: string;
  userType: 'registered' | 'guest';
  isLoggedIn: boolean;
  email: string;
  displayName: string;
  targetExam?: string;
  firstSeen?: string;
  lastActive: string;
  lastActiveStr?: string;
  lastTopic?: string;
  visitCount?: number;
  device?: string;
  featuresUsed?: Record<string, number>;
  sessionHistory?: {
    feature: string;
    action: string;
    timestamp: string;
    isoTime?: string;
  }[];
  notificationCount?: number;
  autoEmailSentAt?: string | null;
}

interface ActivityItem {
  id: string;
  userId: string;
  userType: 'registered' | 'guest';
  displayName: string;
  email: string;
  feature: string;
  action: string;
  timestamp: string;
  isoTime: string;
}

export const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'activities' | 'security' | 'whatsapp' | 'broadcast'>('users');
  const [userFilter, setUserFilter] = useState<'all' | 'registered' | 'guest'>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [usersList, setUsersList] = useState<VisitorRecord[]>([]);
  const [activitiesStream, setActivitiesStream] = useState<ActivityItem[]>([]);
  const [securityLogs, setSecurityLogs] = useState(getSecurityAuditLogs());
  const [localActivities, setLocalActivities] = useState(getLocalActivities());
  const [isHealthScannerOpen, setIsHealthScannerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [whatsappGroupLink, setWhatsappGroupLink] = useState(
    localStorage.getItem('hans_whatsapp_group_url') || 'https://chat.whatsapp.com/HansCompainOfficial'
  );
  const [whatsappBroadcastText, setWhatsappBroadcastText] = useState(
    '🔥 *HANS COMPAIN DAILY STUDY ALERT* 🔥\nआज के 10 करेंट अफेयर्स फैक्ट्स, 80/100 WPM आशुलिपि डिक्टेशन और लाइव ग्रुप क्विज़ बैटल ऐप पर अपलोड हो चुके हैं! अभी अभ्यास करें।'
  );
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [statusBanner, setStatusBanner] = useState<string | null>(null);

  const fetchAllAnalyticsData = () => {
    setIsLoading(true);
    // 1. Fetch Users & Guests
    fetch('/api/admin/users')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setUsersList(data.sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime()));
        }
      })
      .catch(() => {});

    // 2. Fetch Real-time Feature Action Stream
    fetch('/api/admin/activities')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setActivitiesStream(data);
        }
      })
      .catch(() => {});

    setSecurityLogs(getSecurityAuditLogs());
    setLocalActivities(getLocalActivities());
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAllAnalyticsData();
    const timer = setInterval(fetchAllAnalyticsData, 15000); // live polling every 15s
    return () => clearInterval(timer);
  }, []);

  const handleSaveWhatsAppConfig = () => {
    localStorage.setItem('hans_whatsapp_group_url', whatsappGroupLink.trim());
    setStatusBanner('✅ आधिकारिक व्हाट्सएप ग्रुप लिंक सफलतापूर्वक अपडेट हो गया!');
    setTimeout(() => setStatusBanner(null), 3000);
  };

  const handleShareToWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(whatsappBroadcastText)}`;
    window.open(url, '_blank');
  };

  const handlePublishNotice = () => {
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;
    const existing = JSON.parse(localStorage.getItem('hans_custom_notifications') || '[]');
    existing.unshift({
      id: Date.now(),
      title: broadcastTitle.trim(),
      message: broadcastMessage.trim(),
      time: 'अभी (Admin Live)'
    });
    localStorage.setItem('hans_custom_notifications', JSON.stringify(existing.slice(0, 10)));
    setBroadcastTitle('');
    setBroadcastMessage('');
    setStatusBanner('🔔 नया नोटिफिकेशन सभी छात्रों के बेल आइकॉन में पब्लिश कर दिया गया!');
    setTimeout(() => setStatusBanner(null), 3000);
  };

  // Filtered Users List
  const filteredUsers = usersList.filter(u => {
    const matchesType =
      userFilter === 'all' ||
      (userFilter === 'registered' && (u.userType === 'registered' || u.isLoggedIn)) ||
      (userFilter === 'guest' && u.userType === 'guest' && !u.isLoggedIn);

    const q = searchFilter.toLowerCase();
    const matchesSearch =
      !q ||
      u.displayName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.lastTopic && u.lastTopic.toLowerCase().includes(q)) ||
      (u.userId && u.userId.toLowerCase().includes(q));

    return matchesType && matchesSearch;
  });

  const registeredCount = usersList.filter(u => u.userType === 'registered' || u.isLoggedIn).length;
  const guestCount = usersList.filter(u => u.userType === 'guest' && !u.isLoggedIn).length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fade-in text-white font-sans">
      {/* 1. TOP ADMIN HEADER */}
      <div className="bg-gradient-to-r from-rose-950/80 via-slate-900 to-amber-950/60 p-6 sm:p-8 rounded-3xl border border-amber-500/30 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-bold uppercase mb-2 border border-amber-500/20">
            <ShieldCheck className="w-4 h-4" /> Owner Admin Console • Live Analytics
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            ओनर एडमिन कंसोल व यूजर ट्रैकिंग हब
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            देखें कौन-सा छात्र लॉगिन करके आया, किसने बिना लॉगिन के ऐप देखा, और किस-किस फीचर का उपयोग किया।
          </p>
          <div className="pt-2 flex flex-wrap gap-2">
            <button
              onClick={() => setIsHealthScannerOpen(true)}
              className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>🔬 संपूर्ण ऐप डायग्नोस्टिक स्कैनर</span>
            </button>
            <button
              onClick={fetchAllAnalyticsData}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>डेटा रीफ्रेश करें</span>
            </button>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'users', label: '👥 विजिटर व छात्र ट्रैकिंग' },
            { id: 'activities', label: '⚡ लाइव फीचर एक्टिविटी' },
            { id: 'security', label: '🛡️ सिक्योरिटी व टोकन' },
            { id: 'whatsapp', label: '💬 व्हाट्सएप कंसोल' },
            { id: 'broadcast', label: '🔔 लाइव नोटिस पुश' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === t.id
                  ? 'bg-amber-500 text-slate-950 font-black shadow-lg scale-105'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {statusBanner && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
          {statusBanner}
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB 1: VISITORS & REGISTERED STUDENTS TRACKING
          ------------------------------------------------------------- */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Top 4 KPI Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-3xl space-y-1">
              <div className="text-xs text-slate-400 font-bold uppercase flex items-center gap-1.5">
                <Users className="w-4 h-4 text-cyan-400" /> कुल विजिटर्स (Total)
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">{Math.max(1, usersList.length)}</div>
              <div className="text-[10px] text-cyan-400 font-medium">रजिस्टर्ड + बिना लॉगिन</div>
            </div>

            <div className="bg-slate-900 border border-emerald-500/30 p-4 sm:p-5 rounded-3xl space-y-1">
              <div className="text-xs text-emerald-400 font-bold uppercase flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-400" /> पंजीकृत / लॉगिन छात्र
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">{registeredCount}</div>
              <div className="text-[10px] text-emerald-300 font-medium">Google लॉगिन व प्रोफाइल एक्टिव</div>
            </div>

            <div className="bg-slate-900 border border-amber-500/30 p-4 sm:p-5 rounded-3xl space-y-1">
              <div className="text-xs text-amber-400 font-bold uppercase flex items-center gap-1.5">
                <UserX className="w-4 h-4 text-amber-400" /> बिना लॉगिन आगंतुक
              </div>
              <div className="text-2xl sm:text-3xl font-black text-amber-400">{guestCount}</div>
              <div className="text-[10px] text-amber-300 font-medium">Guest Visitors ट्रैकिंग</div>
            </div>

            <div className="bg-slate-900 border border-purple-500/30 p-4 sm:p-5 rounded-3xl space-y-1">
              <div className="text-xs text-purple-400 font-bold uppercase flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-purple-400" /> लाइव फीचर एक्टिविटीज
              </div>
              <div className="text-2xl sm:text-3xl font-black text-purple-300">{activitiesStream.length}</div>
              <div className="text-[10px] text-purple-400 font-medium">हालिया रिकॉर्डेड एक्शन</div>
            </div>
          </div>

          {/* User Filter Toolbar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              <button
                onClick={() => setUserFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  userFilter === 'all' ? 'bg-cyan-600 text-white font-black shadow' : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                सभी विजिटर्स ({usersList.length})
              </button>
              <button
                onClick={() => setUserFilter('registered')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1 ${
                  userFilter === 'registered' ? 'bg-emerald-600 text-white font-black shadow' : 'bg-slate-950 text-emerald-400 border border-slate-800'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>पंजीकृत छात्र ({registeredCount})</span>
              </button>
              <button
                onClick={() => setUserFilter('guest')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1 ${
                  userFilter === 'guest' ? 'bg-amber-600 text-white font-black shadow' : 'bg-slate-950 text-amber-400 border border-slate-800'
                }`}
              >
                <UserX className="w-3.5 h-3.5" />
                <span>बिना लॉगिन आगंतुक ({guestCount})</span>
              </button>
            </div>

            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 min-w-[240px]">
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                placeholder="नाम, ईमेल या फीचर से खोजें..."
                className="bg-transparent border-none outline-none text-xs text-white w-full placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Visitor Records List */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">
                  आगंतुक विवरण एवं उनके द्वारा उपयोग किए गए फीचर्स (Visitor Activity Log)
                </h3>
                <p className="text-xs text-slate-400">
                  प्रत्येक विजिटर का स्टेटस (लॉगिन vs बिना लॉगिन), कुल विजिट्स, और उन्होंने कौन-कौन से फीचर्स देखे।
                </p>
              </div>
              <span className="text-xs font-mono text-cyan-400">{filteredUsers.length} रिकॉर्ड</span>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u, i) => {
                  const isReg = u.userType === 'registered' || u.isLoggedIn;
                  return (
                    <div
                      key={i}
                      className={`p-4 rounded-2xl border transition-all text-xs space-y-3 ${
                        isReg
                          ? 'bg-[#0B1528] border-emerald-500/40 hover:border-emerald-400'
                          : 'bg-slate-950 border-slate-850 hover:border-slate-750'
                      }`}
                    >
                      {/* Top Bar: Name, Badge, Email, Last Active */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 shadow ${
                              isReg ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-amber-300'
                            }`}
                          >
                            {isReg ? (u.displayName[0] || 'U').toUpperCase() : '👤'}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-sm">{u.displayName}</span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                  isReg
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                }`}
                              >
                                {isReg ? '✅ Registered / Logged In' : '👤 Guest (बिना लॉगिन)'}
                              </span>
                            </div>

                            <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                              <span>📧 {u.email}</span>
                              <span>•</span>
                              <span>📱 {u.device || 'Mobile/Web'}</span>
                              <span>•</span>
                              <span>कुल विजिट: <strong className="text-cyan-300">{u.visitCount || 1} बार</strong></span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right text-[11px] text-slate-400">
                          <div className="flex items-center gap-1 sm:justify-end text-cyan-300 font-mono">
                            <Clock className="w-3 h-3" />
                            <span>{u.lastActiveStr || new Date(u.lastActive).toLocaleString('hi-IN')}</span>
                          </div>
                          <div className="text-slate-400 text-[10px] mt-0.5">
                            हालिया टॉपिक: <strong className="text-white">{u.lastTopic || 'Home Dashboard'}</strong>
                          </div>
                        </div>
                      </div>

                      {/* Features Breakdown */}
                      {u.featuresUsed && Object.keys(u.featuresUsed).length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            🎯 उपयोग किए गए फीचर्स (Features Explored):
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {Object.entries(u.featuresUsed).map(([feat, count], fIdx) => (
                              <span
                                key={fIdx}
                                className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-bold text-slate-200 flex items-center gap-1.5"
                              >
                                <Zap className="w-3 h-3 text-amber-400" />
                                <span>{feat}</span>
                                <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 text-[9px] font-mono">
                                  {count}x
                                </span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Session Visit Trail */}
                      {Array.isArray(u.sessionHistory) && u.sessionHistory.length > 0 && (
                        <div className="space-y-1 pt-1 border-t border-slate-900">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                            समय अनुसार हालिया गतिविधि (Recent Trail):
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {u.sessionHistory.slice(0, 5).map((s, sIdx) => (
                              <span
                                key={sIdx}
                                className="px-2 py-0.5 rounded-lg bg-slate-900/60 border border-slate-850 text-[10px] text-slate-400 flex items-center gap-1"
                              >
                                <Eye className="w-2.5 h-2.5 text-cyan-400" />
                                <span>{s.feature}</span>
                                <span className="text-slate-500">({s.timestamp?.split(',')[1] || s.timestamp})</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10 text-slate-500 text-xs">
                  कोई विजिटर रिकॉर्ड नहीं मिला।
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB 2: REAL-TIME FEATURE USAGE STREAM
          ------------------------------------------------------------- */}
      {activeTab === 'activities' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>लाइव फीचर एक्शन स्ट्रीम (Real-time Feature Usage Audit)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  देखें कब किस छात्र या बिना लॉगिन आगंतुक ने कौन-सा फीचर (स्टैनो, क्विज़, करंट अफेयर्स, मॉक टेस्ट) इस्तेमाल किया।
                </p>
              </div>
              <button
                onClick={fetchAllAnalyticsData}
                className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 hover:text-white cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {activitiesStream.length > 0 ? (
                activitiesStream.map((act, idx) => {
                  const isReg = act.userType === 'registered';
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-950 border border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex items-start sm:items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                            isReg ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-amber-300'
                          }`}
                        >
                          {isReg ? 'REG' : 'GUEST'}
                        </div>

                        <div>
                          <div className="font-bold text-white flex items-center gap-2">
                            <span>{act.displayName}</span>
                            <span
                              className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                isReg ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'
                              }`}
                            >
                              {isReg ? act.email : 'बिना लॉगिन'}
                            </span>
                          </div>
                          <div className="text-cyan-300 font-bold mt-0.5 flex items-center gap-1.5">
                            <span>📌 {act.feature}</span>
                            <span className="text-slate-400 font-normal">• {act.action}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-slate-400 text-[11px] font-mono shrink-0 sm:text-right">
                        {act.timestamp}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10 text-slate-500 text-xs">
                  अभी कोई हालिया गतिविधि दर्ज नहीं हुई है।
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB 3: SECURITY & TOKEN AUDIT
          ------------------------------------------------------------- */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-1">
              <div className="text-xs text-slate-400 font-bold uppercase flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" /> IP Rate Limit Shield
              </div>
              <div className="text-2xl font-black text-emerald-400">30 Req/Min Active</div>
              <div className="text-[11px] text-slate-400">Current IP: {getClientIp()}</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-1">
              <div className="text-xs text-slate-400 font-bold uppercase flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" /> यूजर गतिविधि स्ट्रीम
              </div>
              <div className="text-2xl font-black text-cyan-300">{localActivities.length} हालिया एक्शन</div>
              <div className="text-[11px] text-slate-400">100% Secure Logging</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-1">
              <div className="text-xs text-slate-400 font-bold uppercase flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-400" /> टोकन्स व कॉइन्स प्रोग्रेस
              </div>
              <div className="text-2xl font-black text-amber-300">250+ XP Coins/User</div>
              <div className="text-[11px] text-slate-400">Gamified Study Reward Engine</div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB 4: WHATSAPP INTEGRATION CONSOLE
          ------------------------------------------------------------- */}
      {activeTab === 'whatsapp' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-400" />
              <span>व्हाट्सएप कम्युनिटी व ऑफिशियल ग्रुप सेटिंग्स</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              यहां अपना आधिकारिक व्हाट्सएप ग्रुप लिंक सेट करें जो पूरे ऐप में छात्रों को कनेक्ट करने के लिए उपयोग किया जाता है।
            </p>
          </div>

          <div className="space-y-4 max-w-xl">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">आधिकारिक व्हाट्सएप ग्रुप इनवाइट लिंक:</label>
              <input
                type="text"
                value={whatsappGroupLink}
                onChange={e => setWhatsappGroupLink(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 outline-none focus:border-emerald-500"
              />
            </div>

            <button
              onClick={handleSaveWhatsAppConfig}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs cursor-pointer shadow flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>व्हाट्सएप लिंक सेव करें</span>
            </button>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB 5: LIVE NOTICE PUSH
          ------------------------------------------------------------- */}
      {activeTab === 'broadcast' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-400" />
              <span>लाइव नोटिफिकेशन व अलर्ट ब्रॉडकास्टर (Push Notification)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              सभी छात्रों के नोटिफिकेशन बेल आइकॉन में तुरंत नया नोटिस / अलर्ट पब्लिश करें।
            </p>
          </div>

          <div className="space-y-4 max-w-xl">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">नोटिस का शीर्षक (Heading):</label>
              <input
                type="text"
                value={broadcastTitle}
                onChange={e => setBroadcastTitle(e.target.value)}
                placeholder="उदा. आज का स्पेशल स्टेनो टेस्ट 8:00 PM पर..."
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">नोटिस का पूरा संदेश (Message):</label>
              <textarea
                rows={4}
                value={broadcastMessage}
                onChange={e => setBroadcastMessage(e.target.value)}
                placeholder="छात्रों के लिए आवश्यक सूचना यहाँ लिखें..."
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <button
              onClick={handlePublishNotice}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black text-xs cursor-pointer shadow flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>सभी छात्रों को नोटिफिकेशन भेजें</span>
            </button>
          </div>
        </div>
      )}

      {/* Diagnostic Scanner Modal */}
      <AppHealthScannerModal isOpen={isHealthScannerOpen} onClose={() => setIsHealthScannerOpen(false)} />
    </div>
  );
};

export default AdminPanel;
