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
  Check,
  X,
  Unlock,
  Settings,
  AlertTriangle
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

interface FeatureToggle {
  id: string;
  name: string;
  hindiName: string;
  icon: string;
  status: boolean;
  desc: string;
}

export const AdminPanel: React.FC = () => {
  // Password protection state
  const [isAuthorized, setIsAuthorized] = useState<boolean>(() => {
    return sessionStorage.getItem('hans_admin_authorized') === 'true';
  });
  const [adminPassword, setAdminPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Core navigation tabs
  const [activeTab, setActiveTab] = useState<'users' | 'activities' | 'features' | 'security' | 'whatsapp' | 'broadcast'>('users');
  const [userFilter, setUserFilter] = useState<'all' | 'registered' | 'guest'>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [usersList, setUsersList] = useState<VisitorRecord[]>([]);
  const [activitiesStream, setActivitiesStream] = useState<ActivityItem[]>([]);
  const [securityLogs, setSecurityLogs] = useState(getSecurityAuditLogs());
  const [localActivities, setLocalActivities] = useState(getLocalActivities());
  const [isHealthScannerOpen, setIsHealthScannerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Feature Toggles state
  const [featureToggles, setFeatureToggles] = useState<Record<string, boolean>>({
    "steno-master": true,
    "current-affairs": true,
    "group-quiz": true,
    "ai-chat": true,
    "science-lab": true,
    "board-exams": true,
    "mnemonics": true,
    "library": true
  });

  const [whatsappGroupLink, setWhatsappGroupLink] = useState(
    localStorage.getItem('hans_whatsapp_group_url') || 'https://chat.whatsapp.com/HansCompainOfficial'
  );
  const [whatsappBroadcastText, setWhatsappBroadcastText] = useState(
    '🔥 *HANS COMPAIN DAILY STUDY ALERT* 🔥\nआज के 10 करेंट अफेयर्स फैक्ट्स, 80/100 WPM आशुलिपि डिक्टेशन और लाइव ग्रुप क्विज़ बैटल ऐप पर अपलोड हो चुके हैं! अभी अभ्यास करें।'
  );
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [statusBanner, setStatusBanner] = useState<string | null>(null);

  // Expands row for visitor trail details
  const [expandedUserIds, setExpandedUserIds] = useState<Record<string, boolean>>({});

  const toggleUserExpand = (userId: string) => {
    setExpandedUserIds(prev => ({ ...prev, [userId]: !prev[userId] }));
  };

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

    // 3. Fetch Global Feature Toggles
    fetch('/api/admin/features')
      .then(r => r.json())
      .then(data => {
        if (data.success && data.toggles) {
          setFeatureToggles(data.toggles);
          // Sync with local storage so client views pick it up instantly
          localStorage.setItem('hans_global_feature_toggles', JSON.stringify(data.toggles));
        }
      })
      .catch(() => {});

    setSecurityLogs(getSecurityAuditLogs());
    setLocalActivities(getLocalActivities());
    setIsLoading(false);
  };

  useEffect(() => {
    if (isAuthorized) {
      fetchAllAnalyticsData();
      const timer = setInterval(fetchAllAnalyticsData, 15000); // live polling every 15s
      return () => clearInterval(timer);
    }
  }, [isAuthorized]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'hans@admin2026') {
      setIsAuthorized(true);
      sessionStorage.setItem('hans_admin_authorized', 'true');
      setPasswordError(null);
    } else {
      setPasswordError('❌ अमान्य पासवर्ड! कृपया सही एडमिन पासवर्ड दर्ज करें।');
    }
  };

  const handleFeatureToggle = async (featureId: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    try {
      const res = await fetch('/api/admin/features/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featureId, status: nextStatus })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setFeatureToggles(data.toggles);
          localStorage.setItem('hans_global_feature_toggles', JSON.stringify(data.toggles));
          // Dispatch a custom storage event to alert other tabs/views in real-time
          window.dispatchEvent(new Event('storage'));
          setStatusBanner(`✅ फीचर '${featureId}' को सफलतापूर्वक ${nextStatus ? 'चालू' : 'बंद'} कर दिया गया है!`);
          setTimeout(() => setStatusBanner(null), 3500);
        }
      }
    } catch {
      setStatusBanner('❌ फीचर टॉगल करने में विफलता आई।');
      setTimeout(() => setStatusBanner(null), 3000);
    }
  };

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

  const handleExportCSV = () => {
    if (usersList.length === 0) {
      setStatusBanner('⚠️ एक्सपोर्ट के लिए कोई डेटा उपलब्ध नहीं है।');
      setTimeout(() => setStatusBanner(null), 3000);
      return;
    }

    const headers = ['User ID', 'Name', 'Email', 'Type (Registered/Guest)', 'Target Exam', 'Visit Count', 'Device', 'Last Active Time', 'Last Topic', 'Features Used'];
    const rows = usersList.map(u => {
      const featStr = u.featuresUsed ? Object.entries(u.featuresUsed).map(([k, v]) => `${k}: ${v}x`).join('; ') : '';
      return [
        `"${u.userId}"`,
        `"${u.displayName.replace(/"/g, '""')}"`,
        `"${u.email}"`,
        `"${u.userType === 'registered' || u.isLoggedIn ? 'Registered Student' : 'Guest Visitor'}"`,
        `"${u.targetExam || 'SSC & Steno'}"`,
        u.visitCount || 1,
        `"${u.device || 'Web'}"`,
        `"${u.lastActiveStr || u.lastActive}"`,
        `"${(u.lastTopic || '').replace(/"/g, '""')}"`,
        `"${featStr.replace(/"/g, '""')}"`
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `hans_compain_students_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setStatusBanner('📥 छात्रों व विज़िटर्स की एक्सेल/CSV रिपोर्ट डाउनलोड हो गई है!');
    setTimeout(() => setStatusBanner(null), 3000);
  };

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

  const featuresList: FeatureToggle[] = [
    { id: 'steno-master', name: 'All Stenographer', hindiName: 'सम्पूर्ण आशुलिपि (Steno Studio)', icon: '✍️', desc: '80/100 WPM ऑडियो डिक्टेशन व ट्रांसक्रिप्शन बोर्ड', status: featureToggles['steno-master'] ?? true },
    { id: 'current-affairs', name: 'Current Affairs', hindiName: 'डेली करंट अफेयर्स हब', icon: '📰', desc: 'PIB समाचार गोल्डन वन-लाइनर्स, रीडर व डेली MCQ क्विज़', status: featureToggles['current-affairs'] ?? true },
    { id: 'group-quiz', name: 'Group Quiz Battle', hindiName: 'लाइव ग्रुप क्विज़ बैटल', icon: '🔥', desc: 'मल्टीप्लेयर लाइव रैंकिंग क्विज़ और वाइस स्पीकर', status: featureToggles['group-quiz'] ?? true },
    { id: 'ai-chat', name: 'AI Doubt Solver', hindiName: 'HANS COMPAIN AI डाउट सॉल्वर', icon: '💬', desc: 'कस्टम गणित/विज्ञान संदेह समाधान और फोटो स्कैनर (OCR)', status: featureToggles['ai-chat'] ?? true },
    { id: 'science-lab', name: 'Interactive Science Lab', hindiName: 'इंटरैक्टिव साइंस लैब सिमुलेटर', icon: '🔬', desc: 'ओम का नियम, लेंस रे-डायग्राम, pH मीटर व 3D आवर्त सारणी', status: featureToggles['science-lab'] ?? true },
    { id: 'board-exams', name: 'Board Exams Hub', hindiName: '10th & 12th बोर्ड परीक्षा केंद्र', icon: '🎓', desc: 'OMR टेस्ट सीरीज़, टॉपर नोट्स व चैप्टर प्रैक्टिस बॉक्स', status: featureToggles['board-exams'] ?? true },
    { id: 'mnemonics', name: 'AI Mnemonics', hindiName: 'AI निमोनिक्स ट्रिक जनरेटर', icon: '⚡', desc: 'कठिन ऐतिहासिक तिथियों व सूत्रों को याद रखने की मजेदार कविताएँ', status: featureToggles['mnemonics'] ?? true },
    { id: 'library', name: 'Global Library', hindiName: 'स्मार्ट लाइब्रेरी व वॉयस रीडर', icon: '📖', desc: 'एनसीईआरटी व विश्व की चुनिंदा किताबों का डिजिटल अध्याय रीडर', status: featureToggles['library'] ?? true }
  ];

  // ============================================================================
  // SECURE PASSWORD PROTECTION SCREEN
  // ============================================================================
  if (!isAuthorized) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 text-white font-sans">
        <form
          onSubmit={handleAdminLogin}
          className="w-full max-w-md bg-[#091122] border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in"
        >
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-300">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-lg sm:text-xl font-black uppercase tracking-wider text-white">
              एडमिन पैनल सुरक्षा द्वार
            </h1>
            <p className="text-xs text-slate-400">
              यह विभाग केवल स्वामी (Owner) हंसलाल पाल के लिए सुरक्षित है। एक्सेस करने के लिए पासवर्ड दर्ज करें।
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5 relative">
              <label className="text-xs font-black text-slate-300">एडमिन पासवर्ड (Security Code):</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                  placeholder="एडमिन सुरक्षा पासवर्ड डालें..."
                  className="w-full p-3 pr-10 rounded-xl bg-slate-950 border border-slate-800 text-sm outline-none focus:border-amber-500 text-white placeholder:text-slate-600 font-mono"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-white"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>

            {passwordError && (
              <div className="text-[11px] font-bold text-rose-400 bg-rose-950/20 border border-rose-500/30 p-2.5 rounded-xl">
                {passwordError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all active:scale-98"
            >
              <Unlock className="w-4 h-4" />
              <span>कंसोल अनलॉक करें (Unlock Console)</span>
            </button>
          </div>

          <div className="text-[10px] text-center text-slate-500 border-t border-slate-900 pt-3">
            HANS COMPAIN Academic Platform © 2026 • Secure System
          </div>
        </form>
      </div>
    );
  }

  // ============================================================================
  // UNLOCKED AUTHORIZED ADMIN PANEL CONSOLE
  // ============================================================================
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fade-in text-white font-sans">
      
      {/* 1. TOP MAIN HEADER */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-6 sm:p-7 rounded-3xl border border-slate-800 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-bold uppercase mb-2 border border-amber-500/20">
            <ShieldCheck className="w-4 h-4 text-amber-400" /> Owner Admin Panel • Direct Page Access
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            हंस कैंपेन एडमिनिस्ट्रेटर डैशबोर्ड
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            छात्र लॉगिन ट्रैकिंग, लाइव फीचर ऑन-ऑफ़ स्विच, रियल-टाइम सुरक्षा ऑडिट एवं लाइव ब्रॉडकास्ट नोटिस हब।
          </p>
          <div className="pt-2.5 flex flex-wrap gap-2">
            <button
              onClick={() => setIsHealthScannerOpen(true)}
              className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-black text-[11px] rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-200" />
              <span>🔬 संपूर्ण ऐप डायग्नोस्टिक स्कैनर</span>
            </button>
            <button
              onClick={fetchAllAnalyticsData}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-400 font-bold text-[11px] rounded-xl flex items-center gap-1.5 cursor-pointer shadow"
            >
              <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
              <span>डेटा रीफ्रेश</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs - Compact, elegant pill bar */}
        <div className="flex flex-wrap gap-1">
          {[
            { id: 'users', label: '👥 स्टूडेंट ट्रैकिंग' },
            { id: 'activities', label: '⚡ लाइव एक्टिविटी' },
            { id: 'features', label: '⚙️ फीचर ऑन-ऑफ़' },
            { id: 'security', label: '🛡️ सुरक्षा हब' },
            { id: 'whatsapp', label: '💬 व्हाट्सएप ग्रुप' },
            { id: 'broadcast', label: '🔔 नोटिस ब्रॉडकास्ट' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === t.id
                  ? 'bg-amber-500 text-slate-950 font-black shadow-lg'
                  : 'bg-slate-900 border border-slate-850 text-slate-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {statusBanner && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{statusBanner}</span>
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB 1: INTEGRATED VISITOR & STUDENT TRACKING (DIRECT PAGE LIST VIEW)
          ------------------------------------------------------------- */}
      {activeTab === 'users' && (
        <div className="space-y-5">
          {/* Direct Non-Box Linear Page Metric Summary */}
          <div className="py-4 border-y border-slate-900 grid grid-cols-2 md:grid-cols-4 gap-4 text-slate-300">
            <div className="border-r border-slate-900 pr-2">
              <span className="text-[11px] text-slate-400 block font-bold">कुल विज़िटर्स:</span>
              <strong className="text-xl font-black text-white">{Math.max(1, usersList.length)} विज़िट</strong>
            </div>
            <div className="border-r border-slate-900 pr-2">
              <span className="text-[11px] text-slate-400 block font-bold">रजिस्टर्ड स्टूडेंट्स:</span>
              <strong className="text-xl font-black text-emerald-400">{registeredCount} छात्र</strong>
            </div>
            <div className="border-r border-slate-900 pr-2">
              <span className="text-[11px] text-slate-400 block font-bold">अतिथि (बिना लॉगिन):</span>
              <strong className="text-xl font-black text-amber-400">{guestCount} आगंतुक</strong>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-bold">लाइव लॉग्स:</span>
              <strong className="text-xl font-black text-cyan-400">{activitiesStream.length} एक्शन</strong>
            </div>
          </div>

          {/* Table Filters Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1">
              {['all', 'registered', 'guest'].map(filt => (
                <button
                  key={filt}
                  onClick={() => setUserFilter(filt as any)}
                  className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-all ${
                    userFilter === filt
                      ? 'bg-amber-500 text-slate-950 font-black shadow'
                      : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  {filt === 'all' ? `सभी (${usersList.length})` : filt === 'registered' ? `रजिस्टर्ड (${registeredCount})` : `बिना लॉगिन (${guestCount})`}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl font-bold text-slate-300 flex items-center gap-1.5 cursor-pointer"
              >
                <span>📥 CSV/Excel रिपोर्ट</span>
              </button>

              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-850 rounded-xl px-3 py-1 text-xs">
                <Search className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={e => setSearchFilter(e.target.value)}
                  placeholder="छात्र नाम या ईमेल खोजें..."
                  className="bg-transparent border-none outline-none text-xs text-white placeholder:text-slate-600 w-44"
                />
              </div>
            </div>
          </div>

          {/* PAGE LIST LAYOUT: TABLE VIEW (Completely cardless, flat list directly on page) */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-900 text-slate-400 font-extrabold uppercase">
                  <th className="py-3 px-2">छात्र / विजिटर विवरण</th>
                  <th className="py-3 px-2">लॉगिन स्टेटस</th>
                  <th className="py-3 px-2">सक्रियता टॉपिक</th>
                  <th className="py-3 px-2">अंतिम सक्रिय समय</th>
                  <th className="py-3 px-2">कुल फीचर्स</th>
                  <th className="py-3 px-2 text-right">कार्रवाई</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u, i) => {
                    const isReg = u.userType === 'registered' || u.isLoggedIn;
                    const isExpanded = !!expandedUserIds[u.userId];
                    const totalFeatures = u.featuresUsed ? Object.values(u.featuresUsed).reduce((a, b) => a + b, 0) : 1;

                      return (
                        <React.Fragment key={u.userId || i}>
                          <tr className="hover:bg-slate-950/30 transition-colors">
                            <td className="py-3.5 px-2">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black ${isReg ? 'bg-emerald-600/20 text-emerald-400' : 'bg-amber-600/20 text-amber-400'}`}>
                                  {isReg ? (u.displayName[0] || 'U').toUpperCase() : '👤'}
                                </div>
                                <div>
                                  <span className="font-bold text-white block text-sm">{u.displayName}</span>
                                  <span className="text-[10px] text-slate-500 font-mono block">{u.email}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black ${isReg ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/20' : 'bg-amber-950/60 text-amber-300 border border-amber-500/20'}`}>
                                {isReg ? 'REGISTERED' : 'GUEST VISITOR'}
                              </span>
                            </td>
                            <td className="py-3.5 px-2 font-medium text-slate-200">
                              {u.lastTopic || 'Home Dashboard'}
                            </td>
                            <td className="py-3.5 px-2 font-mono text-cyan-400 text-[11px]">
                              {u.lastActiveStr || new Date(u.lastActive).toLocaleString('hi-IN')}
                            </td>
                            <td className="py-3.5 px-2">
                              <span className="font-bold text-amber-400">{totalFeatures} बार</span>
                            </td>
                            <td className="py-3.5 px-2 text-right">
                              <button
                                onClick={() => toggleUserExpand(u.userId)}
                                className="px-2.5 py-1 bg-slate-950 border border-slate-900 rounded-lg hover:bg-slate-900 text-[10px] font-bold text-slate-300 hover:text-white cursor-pointer"
                              >
                                {isExpanded ? '⌃ बंद करें' : '⌄ ट्रेल देखें'}
                              </button>
                            </td>
                          </tr>

                          {/* Expanded Trail Detail Row - Pure Line Layout, No Cards */}
                          {isExpanded && (
                            <tr className="bg-transparent">
                              <td colSpan={6} className="py-4 px-2 border-t border-slate-900">
                                <div className="space-y-3 pl-11 text-xs">
                                  <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">
                                    📊 फीचर उपयोग आवृत्ति (Feature Statistics):
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {u.featuresUsed && Object.keys(u.featuresUsed).length > 0 ? (
                                      Object.entries(u.featuresUsed).map(([feat, count], fIdx) => (
                                        <span key={fIdx} className="px-2.5 py-1 rounded bg-slate-950 border border-slate-900 text-[11px] text-slate-300">
                                          🚀 {feat}: <strong>{count} बार</strong>
                                        </span>
                                      ))
                                    ) : (
                                      <span className="text-slate-500">कोई डेटा उपलब्ध नहीं</span>
                                    )}
                                  </div>

                                  <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wider pt-2 border-t border-slate-900">
                                    🕒 हालिया गतिविधि टाइमलाइन (Recent Navigation Trail):
                                  </div>
                                  <div className="space-y-1.5">
                                    {Array.isArray(u.sessionHistory) && u.sessionHistory.length > 0 ? (
                                      u.sessionHistory.slice(0, 8).map((hist, hIdx) => (
                                        <div key={hIdx} className="flex items-center gap-2 text-slate-400 text-[11px] py-0.5">
                                          <span className="text-cyan-400">•</span>
                                          <span className="font-mono text-slate-500">[{hist.timestamp}]</span>
                                          <strong className="text-slate-300">{hist.feature}</strong>
                                          <span className="text-slate-500">- {hist.action}</span>
                                        </div>
                                      ))
                                    ) : (
                                      <span className="text-slate-500">टाइमलाइन रिक्त है।</span>
                                    )}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      कोई रिकॉर्ड नहीं मिला।
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB 2: REAL-TIME ACTIVITY STREAM
          ------------------------------------------------------------- */}
      {activeTab === 'activities' && (
        <div className="overflow-x-auto space-y-4">
          <div className="py-2.5 border-b border-slate-900 flex items-center justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>लाइव फीचर उपयोग टाइमलाइन (Action Stream)</span>
              </h3>
            </div>
            <span className="text-xs font-mono text-cyan-300 bg-cyan-950/40 px-2.5 py-1 rounded border border-cyan-500/20">{activitiesStream.length} लॉग्स</span>
          </div>

          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-900 text-slate-400 uppercase font-black">
                <th className="py-2 px-1">छात्र का नाम</th>
                <th className="py-2 px-1">उपयोग किया गया फीचर</th>
                <th className="py-2 px-1">सक्रिय एक्शन</th>
                <th className="py-2 px-1 text-right">सक्रियता का समय</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              {activitiesStream.length > 0 ? (
                activitiesStream.map((act, idx) => (
                  <tr key={idx} className="hover:bg-slate-950/20">
                    <td className="py-3 px-1">
                      <div className="font-bold text-white">{act.displayName}</div>
                      <div className="text-[10px] text-slate-500">{act.email}</div>
                    </td>
                    <td className="py-3 px-1">
                      <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/20">
                        {act.feature}
                      </span>
                    </td>
                    <td className="py-3 px-1 text-slate-300">
                      {act.action}
                    </td>
                    <td className="py-3 px-1 text-right font-mono text-slate-500">
                      {act.timestamp}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-slate-500">
                    कोई लाइव एक्टिविटी दर्ज नहीं हुई है।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB 3: FEATURE MANAGEMENT (ON/OFF TOGGLES CONTROL CENTER)
          ------------------------------------------------------------- */}
      {activeTab === 'features' && (
        <div className="bg-[#03060E] border border-slate-850 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="border-b border-slate-850 pb-3.5">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-amber-400" />
              <span>ग्लोबल फीचर स्विच और एक्सेस कंट्रोल पैनल (Global Feature Manager)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              हंस कैंपेन ऐप के प्रमुख 8 फीचर्स को एक क्लिक में चालू या बंद करें। बंद किए गए फीचर छात्रों के लिए अस्थायी रूप से लॉक हो जाएंगे।
            </p>
          </div>

          <div className="divide-y divide-slate-850">
            {featuresList.map(feat => (
              <div key={feat.id} className="py-4 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl shrink-0">{feat.icon}</span>
                    <strong className="text-white text-sm block">{feat.hindiName}</strong>
                    <span className="text-[10px] text-slate-500 bg-slate-900 px-2 py-0.2 rounded font-mono">{feat.name}</span>
                  </div>
                  <p className="text-xs text-slate-400 pl-7">{feat.desc}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${feat.status ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'}`}>
                    {feat.status ? 'सक्रिय (ACTIVE)' : 'बंद (DISABLED)'}
                  </span>
                  
                  {/* Custom Toggle Switch */}
                  <button
                    onClick={() => handleFeatureToggle(feat.id, feat.status)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                      feat.status ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        feat.status ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB 4: SECURITY & RATE SHIELD
          ------------------------------------------------------------- */}
      {activeTab === 'security' && (
        <div className="bg-[#03060E] border border-slate-850 rounded-2xl p-5 sm:p-6 space-y-4 text-xs">
          <div className="border-b border-slate-850 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <span>सुरक्षा गार्ड एवं दर सीमा रक्षक (Rate Limit Shield)</span>
            </h3>
            <p className="text-slate-400">
              ऐप को बॉट्स, डीडीओएस और अनावश्यक रिक्वेस्ट से बचाने के लिए स्वचालित रेट-लिमिटर 30 Req/Min सक्रिय है।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-400 font-bold block">एडमिन कनेक्शन विवरण:</span>
              <div className="p-3 bg-slate-950 rounded-xl font-mono text-cyan-300 border border-slate-850">
                आईपी एड्रेस: {getClientIp()}<br />
                रेट लिमिट लिमिटेशन: 30 रिक्वेस्ट प्रति मिनट अधिकतम<br />
                ऑथेंटिकेशन: सत्र सुरक्षित sessionStorage सक्रिय
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-400 font-bold block">सुरक्षा ऑडिट लॉग्स:</span>
              <div className="p-3 bg-slate-950 rounded-xl max-h-[120px] overflow-y-auto text-slate-400 font-mono">
                {securityLogs.map((log, lIdx) => (
                  <div key={lIdx} className="text-[11px] leading-relaxed">
                    • <span className={log.severity === 'BLOCKED' ? 'text-rose-400 font-bold' : 'text-amber-400'}>[{log.severity}]</span> {log.reason}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB 5: WHATSAPP CONFIG
          ------------------------------------------------------------- */}
      {activeTab === 'whatsapp' && (
        <div className="bg-[#03060E] border border-slate-850 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="border-b border-slate-850 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-400" />
              <span>व्हाट्सएप ग्रुप लिंक सेटअप</span>
            </h3>
            <p className="text-xs text-slate-400">
              आधिकारिक व्हाट्सएप कम्युनिटी ग्रुप लिंक सेट करें जिसे छात्र साइडबार मेनू से सीधा जॉइन कर सकते हैं।
            </p>
          </div>

          <div className="space-y-3.5 max-w-lg">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">व्हाट्सएप ग्रुप इनवाइट लिंक:</label>
              <input
                type="text"
                value={whatsappGroupLink}
                onChange={e => setWhatsappGroupLink(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-850 text-xs font-mono text-cyan-300 outline-none focus:border-emerald-500"
              />
            </div>

            <button
              onClick={handleSaveWhatsAppConfig}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs cursor-pointer shadow flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>लिंक अपडेट करें</span>
            </button>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB 6: NOTICE BROADCASTER
          ------------------------------------------------------------- */}
      {activeTab === 'broadcast' && (
        <div className="bg-[#03060E] border border-slate-850 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="border-b border-slate-850 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-400" />
              <span>लाइव ब्रॉडकास्ट नोटिफिकेशन पब्लिशर</span>
            </h3>
            <p className="text-xs text-slate-400">
              नया नोटिस या लाइव अलर्ट लिखें जो प्रत्येक छात्र के नोटिफिकेशन पैनल में तुरंत दिखाई देगा।
            </p>
          </div>

          <div className="space-y-3.5 max-w-xl">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">नोटिस का शीर्षक (Heading):</label>
              <input
                type="text"
                value={broadcastTitle}
                onChange={e => setBroadcastTitle(e.target.value)}
                placeholder="उदा. नया डिक्टेशन गद्यांश अपलोड हो चुका है..."
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-850 text-xs text-white outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">संदेश (Message Text):</label>
              <textarea
                rows={4}
                value={broadcastMessage}
                onChange={e => setBroadcastMessage(e.target.value)}
                placeholder="अध्ययन अलर्ट संदेश यहाँ लिखें..."
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-850 text-xs text-white outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <button
              onClick={handlePublishNotice}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs cursor-pointer shadow flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>पब्लिक नोटिस पुश करें</span>
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
