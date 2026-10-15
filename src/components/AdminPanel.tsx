import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Activity,
  Users,
  RefreshCw,
  CheckCircle2,
  Mail,
  MessageSquare,
  Bell,
  Send,
  ShieldAlert,
  Lock,
  Cpu,
  Search,
  Eye,
  Check,
  Unlock,
  Settings,
  Download,
  Power,
  ToggleLeft,
  ToggleRight,
  ChevronDown,
  ChevronUp,
  ArrowLeft
} from 'lucide-react';
import { getLocalActivities } from '../firebase';
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

export interface FeatureToggleConfig {
  id: string;
  name: string;
  hindiName: string;
  category: string;
  desc: string;
}

export const ALL_CONTROLLABLE_FEATURES: FeatureToggleConfig[] = [
  {
    id: 'steno-master',
    name: 'Steno Master Studio',
    hindiName: 'सम्पूर्ण आशुलिपि (Steno Studio)',
    category: 'मुख्य फीचर',
    desc: '80/100 WPM ऑडियो डिक्टेशन व शॉर्टहैंड ट्रांसक्रिप्शन बोर्ड'
  },
  {
    id: 'current-affairs',
    name: 'Current Affairs Hub',
    hindiName: 'करंट अफेयर्स 2026 (PIB हब)',
    category: 'मुख्य फीचर',
    desc: 'दैनिक समाचार विश्लेषण, द्विभाषी रीडर व डेली MCQ क्विज़'
  },
  {
    id: 'group-quiz',
    name: 'Live Group Quiz Battle',
    hindiName: 'लाइव ग्रुप क्विज़ बैटल',
    category: 'मुख्य फीचर',
    desc: '10–50 छात्रों का मल्टीप्लेयर लाइव रैंकिंग क्विज़ और वॉइस रीडर'
  },
  {
    id: 'science-lab',
    name: 'Interactive Science Lab',
    hindiName: 'इंटरएक्टिव साइंस लैब (42 Labs)',
    category: 'मुख्य फीचर',
    desc: 'भौतिकी, रसायन, जीव विज्ञान, भूगोल व गणित की वर्चुअल प्रयोगशालाएं'
  },
  {
    id: 'ai-chat',
    name: 'AI Doubt Solver',
    hindiName: 'AI डाउट सॉल्वर चैट',
    category: 'मुख्य फीचर',
    desc: 'गणित, विज्ञान व सामान्य ज्ञान के प्रश्नों का त्वरित समाधान'
  },
  {
    id: 'mnemonics',
    name: 'AI Mnemonics Generator',
    hindiName: 'AI निमोनिक्स ट्रिक जनरेटर',
    category: 'अध्ययन टूल',
    desc: 'कठिन तिथियों व सूत्रों को याद रखने की शॉर्ट ट्रिक्स'
  },
  {
    id: 'daily-goals',
    name: 'Daily Study Goals',
    hindiName: 'दैनिक लक्ष्य (Daily Goals)',
    category: 'अध्ययन टूल',
    desc: 'GK, English और Math के दैनिक टारगेट व स्ट्रीक ट्रैकर'
  },
  {
    id: 'competitive',
    name: 'Competitive Exams Hub',
    hindiName: 'प्रतियोगी परीक्षा व PYQ बैंक',
    category: 'परीक्षा केंद्र',
    desc: 'SSC, Railway, BPSC CBT मॉक टेस्ट व पिछले वर्षों के प्रश्न'
  },
  {
    id: 'board-exams',
    name: 'Board Exams Hub',
    hindiName: '10th & 12th बोर्ड परीक्षा केंद्र',
    category: 'परीक्षा केंद्र',
    desc: 'बोर्ड परीक्षा OMR टेस्ट सीरीज़ व चैप्टर-वार प्रैक्टिस बॉक्स'
  },
  {
    id: 'time-travel',
    name: 'Time Travel Simulator',
    hindiName: 'काल-यात्रा (ऐतिहासिक संवाद)',
    category: 'अध्ययन टूल',
    desc: 'इतिहास के महान व्यक्तित्वों और घटनाओं का सिमुलेशन'
  },
  {
    id: 'library',
    name: 'Smart Book Reader',
    hindiName: 'स्मार्ट लाइब्रेरी व वॉइस रीडर',
    category: 'अध्ययन टूल',
    desc: 'NCERT व मानक पुस्तकों का डिजिटल अध्याय व ऑडियो रीडर'
  },
  {
    id: 'ocr-scan',
    name: 'Notes OCR Scanner',
    hindiName: 'हस्तलिखित नोट्स फोटो स्कैनर',
    category: 'अध्ययन टूल',
    desc: 'कॉपी या किताब के पन्नों की फोटो से डिजिटल टेक्स्ट व सारांश'
  },
  {
    id: 'edu-reels',
    name: 'Edu-Reels Shorts',
    hindiName: 'एजु-रील्स (Edu Shorts)',
    category: 'क्विक रिवीजन',
    desc: '60 सेकंड में महत्वपूर्ण परीक्षा तथ्यों का त्वरित रिवीजन'
  },
  {
    id: 'flashcards',
    name: 'Smart Flashcards',
    hindiName: '1-मिनट रीकैप व फ्लैशकार्ड्स',
    category: 'क्विक रिवीजन',
    desc: 'महत्वपूर्ण शब्दावली और सूत्रों के मेमोरी कार्ड्स'
  }
];

export const getStoredFeatureToggles = (): Record<string, boolean> => {
  const defaults: Record<string, boolean> = {};
  ALL_CONTROLLABLE_FEATURES.forEach(f => {
    defaults[f.id] = true;
  });
  try {
    const raw = localStorage.getItem('hans_global_feature_toggles');
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...defaults, ...parsed };
    }
  } catch {
    // ignore
  }
  return defaults;
};

interface AdminPanelProps {
  onReturnHome?: () => void;
  currentUser?: any;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onReturnHome, currentUser }) => {
  // Authorized email and strict password configuration
  const AUTHORIZED_ADMIN_EMAIL = 'palhanslal4@gmail.com';
  const ADMIN_AUTHORIZED_PASSWORD = 'Chhangur#@8084';

  // Check if logged-in user is an unauthorized other email
  const isOtherUserEmail =
    !!currentUser?.email &&
    currentUser.email.trim().toLowerCase() !== AUTHORIZED_ADMIN_EMAIL.toLowerCase();

  // Password protection state
  const [isAuthorized, setIsAuthorized] = useState<boolean>(() => {
    const email = currentUser?.email?.trim().toLowerCase();
    if (email && email !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
      return false;
    }
    return sessionStorage.getItem('hans_admin_authorized') === 'true';
  });
  const [adminPassword, setAdminPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Navigation tabs - 'overview' shows both Feature Controls & Student Tracking cleanly
  const [activeTab, setActiveTab] = useState<
    'overview' | 'features' | 'users' | 'activities' | 'alerts' | 'security' | 'broadcast'
  >('overview');

  const [userFilter, setUserFilter] = useState<'all' | 'registered' | 'guest'>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [featureSearch, setFeatureSearch] = useState('');
  const [usersList, setUsersList] = useState<VisitorRecord[]>([]);
  const [activitiesStream, setActivitiesStream] = useState<ActivityItem[]>([]);
  const [emailAlerts, setEmailAlerts] = useState<any[]>([]);
  const [securityLogs, setSecurityLogs] = useState(getSecurityAuditLogs());
  const [isHealthScannerOpen, setIsHealthScannerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Feature Toggles state initialized from localStorage so it works immediately
  const [featureToggles, setFeatureToggles] = useState<Record<string, boolean>>(() =>
    getStoredFeatureToggles()
  );

  const [whatsappGroupLink, setWhatsappGroupLink] = useState(
    localStorage.getItem('hans_whatsapp_group_url') || 'https://chat.whatsapp.com/HansCompainOfficial'
  );
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [statusBanner, setStatusBanner] = useState<string | null>(null);
  const [expandedUserIds, setExpandedUserIds] = useState<Record<string, boolean>>({});

  const toggleUserExpand = (userId: string) => {
    setExpandedUserIds(prev => ({ ...prev, [userId]: !prev[userId] }));
  };

  const showNotice = (msg: string) => {
    setStatusBanner(msg);
    setTimeout(() => {
      setStatusBanner(prev => (prev === msg ? null : prev));
    }, 3500);
  };

  const fetchAllAnalyticsData = () => {
    setIsLoading(true);
    fetch('/api/admin/users')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setUsersList(
            data.sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime())
          );
        }
      })
      .catch(() => {});

    fetch('/api/admin/activities')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setActivitiesStream(data);
        }
      })
      .catch(() => {});

    fetch('/api/admin/features')
      .then(r => r.json())
      .then(data => {
        if (data && data.success && data.toggles) {
          setFeatureToggles(prev => {
            const merged = { ...prev, ...data.toggles };
            localStorage.setItem('hans_global_feature_toggles', JSON.stringify(merged));
            return merged;
          });
        }
      })
      .catch(() => {});

    fetch('/api/admin/email-alerts')
      .then(r => r.json())
      .then(data => {
        if (data && data.success) {
          setEmailAlerts(data.alerts || []);
        }
      })
      .catch(() => {});

    setSecurityLogs(getSecurityAuditLogs());
    getLocalActivities();
    setTimeout(() => setIsLoading(false), 300);
  };

  useEffect(() => {
    if (isAuthorized) {
      fetchAllAnalyticsData();
      const timer = setInterval(fetchAllAnalyticsData, 15000);
      return () => clearInterval(timer);
    }
  }, [isAuthorized]);

  const handleAdminLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (adminPassword.trim() === ADMIN_AUTHORIZED_PASSWORD) {
      setIsAuthorized(true);
      sessionStorage.setItem('hans_admin_authorized', 'true');
      setPasswordError(null);
    } else {
      setPasswordError('अमान्य सिक्योरिटी पासवर्ड! केवल सही पासवर्ड (Chhangur#@8084) से ही एडमिन पैनल खोला जा सकता है।');
    }
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('hans_admin_authorized');
    setIsAuthorized(false);
    setAdminPassword('');
  };

  // Instant optimistic toggle + backend sync
  const handleFeatureToggle = async (featureId: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    const updated = { ...featureToggles, [featureId]: nextStatus };
    setFeatureToggles(updated);
    localStorage.setItem('hans_global_feature_toggles', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('hans_feature_toggles_updated', { detail: updated }));

    const featObj = ALL_CONTROLLABLE_FEATURES.find(f => f.id === featureId);
    const label = featObj ? featObj.hindiName : featureId;
    showNotice(`${label} को ${nextStatus ? 'चालू (ON)' : 'बंद (OFF)'} कर दिया गया है।`);

    try {
      await fetch('/api/admin/features/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featureId, status: nextStatus })
      });
    } catch {
      // LocalStorage already updated & active
    }
  };

  const handleBulkFeatureToggle = async (enableAll: boolean) => {
    const updated: Record<string, boolean> = {};
    ALL_CONTROLLABLE_FEATURES.forEach(f => {
      updated[f.id] = enableAll;
    });
    setFeatureToggles(updated);
    localStorage.setItem('hans_global_feature_toggles', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('hans_feature_toggles_updated', { detail: updated }));
    showNotice(
      enableAll
        ? 'सभी 14 ऐप फीचर्स को एक साथ चालू (ON) कर दिया गया है।'
        : 'सभी ऐप फीचर्स को अस्थायी रूप से बंद (OFF) कर दिया गया है।'
    );

    try {
      await Promise.all(
        ALL_CONTROLLABLE_FEATURES.map(f =>
          fetch('/api/admin/features/toggle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ featureId: f.id, status: enableAll })
          })
        )
      );
    } catch {
      // ignore
    }
  };

  const handleSaveWhatsAppConfig = () => {
    localStorage.setItem('hans_whatsapp_group_url', whatsappGroupLink.trim());
    showNotice('व्हाट्सएप ग्रुप लिंक सफलतापूर्वक सेव हो गया है।');
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
    showNotice('नया नोटिस सभी छात्रों के नोटिफिकेशन पैनल में पब्लिश कर दिया गया है।');
  };

  const handleExportCSV = () => {
    if (usersList.length === 0) {
      showNotice('एक्सपोर्ट के लिए अभी कोई रिकॉर्ड उपलब्ध नहीं है।');
      return;
    }

    const headers = [
      'User ID',
      'Name',
      'Email',
      'Type',
      'Target Exam',
      'Visit Count',
      'Device',
      'Last Active Time',
      'Last Topic',
      'Features Used'
    ];
    const rows = usersList.map(u => {
      const featStr = u.featuresUsed
        ? Object.entries(u.featuresUsed)
            .map(([k, v]) => `${k}: ${v}x`)
            .join('; ')
        : '';
      return [
        `"${u.userId}"`,
        `"${u.displayName.replace(/"/g, '""')}"`,
        `"${u.email}"`,
        `"${u.userType === 'registered' || u.isLoggedIn ? 'Registered' : 'Guest'}"`,
        `"${u.targetExam || 'SSC & Steno'}"`,
        u.visitCount || 1,
        `"${u.device || 'Web'}"`,
        `"${u.lastActiveStr || u.lastActive}"`,
        `"${(u.lastTopic || '').replace(/"/g, '""')}"`,
        `"${featStr.replace(/"/g, '""')}"`
      ].join(',');
    });

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `hans_compain_report_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotice('छात्रों व विज़िटर्स की CSV रिपोर्ट डाउनलोड हो गई है।');
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

  const filteredFeatures = ALL_CONTROLLABLE_FEATURES.filter(f => {
    const q = featureSearch.toLowerCase();
    return (
      !q ||
      f.hindiName.toLowerCase().includes(q) ||
      f.name.toLowerCase().includes(q) ||
      f.desc.toLowerCase().includes(q)
    );
  });

  const registeredCount = usersList.filter(u => u.userType === 'registered' || u.isLoggedIn).length;
  const guestCount = usersList.filter(u => u.userType === 'guest' && !u.isLoggedIn).length;
  const enabledFeaturesCount = ALL_CONTROLLABLE_FEATURES.filter(
    f => featureToggles[f.id] !== false
  ).length;

  // ============================================================================
  // 1. ACCESS DENIED: IF LOGGED IN WITH ANY OTHER EMAIL
  // ============================================================================
  if (isOtherUserEmail) {
    return (
      <div className="w-full min-h-full overflow-y-auto flex items-center justify-center p-4 bg-[#060A12] text-slate-100 py-12">
        <div className="w-full max-w-md bg-[#0B111E] border border-rose-900/60 rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl text-center">
          <div className="w-12 h-12 rounded-xl bg-rose-950/60 border border-rose-800/80 flex items-center justify-center mx-auto text-rose-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-lg font-bold text-white">
              एक्सेस अस्वीकृत (Access Denied)
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              यह एडमिन पैनल केवल अधिकृत ईमेल (<span className="text-amber-300 font-semibold">{AUTHORIZED_ADMIN_EMAIL}</span>) के लिए आरक्षित है।
            </p>
          </div>
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1 text-left">
            <div className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">वर्तमान लॉग-इन ईमेल:</div>
            <div className="font-mono text-rose-300 truncate">{currentUser?.email}</div>
          </div>
          <p className="text-[11px] text-slate-500">
            अन्य ईमेल से एडमिन पैनल एक्सेस करने की अनुमति नहीं है।
          </p>
          {onReturnHome && (
            <button
              type="button"
              onClick={onReturnHome}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-xs rounded-xl cursor-pointer transition-colors"
            >
              होमपेज पर वापस जाएं
            </button>
          )}
        </div>
      </div>
    );
  }

  // ============================================================================
  // 2. SECURE PASSWORD PROTECTION SCREEN (Chhangur#@8084)
  // ============================================================================
  if (!isAuthorized) {
    return (
      <div className="w-full min-h-full overflow-y-auto flex items-center justify-center p-4 bg-[#060A12] text-slate-100 py-12">
        <form
          onSubmit={handleAdminLogin}
          className="w-full max-w-md bg-[#0B111E] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl"
        >
          <div className="space-y-2">
            <div className="w-11 h-11 rounded-xl bg-slate-900 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Lock className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-white pt-1">
              एडमिनिस्ट्रेटर लॉगिन (Owner Console)
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              यह कंट्रोल पैनल केवल एडमिन (हंसलाल पाल) के लिए सुरक्षित है। कृपया एडमिन सिक्योरिटी पासवर्ड दर्ज करें।
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">एडमिन पासवर्ड (Security Key)</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={adminPassword}
                  onChange={e => {
                    setAdminPassword(e.target.value);
                    if (passwordError) setPasswordError(null);
                  }}
                  placeholder="एडमिन पासवर्ड दर्ज करें..."
                  className="w-full p-3 pr-10 rounded-xl bg-[#060A12] border border-slate-800 text-sm outline-none focus:border-amber-500 text-white placeholder:text-slate-600"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-white cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>

            {passwordError && (
              <div className="text-xs text-rose-300 bg-rose-950/40 border border-rose-800/60 p-2.5 rounded-lg flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{passwordError}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Unlock className="w-4 h-4" />
                <span>कंसोल खोलें (Unlock)</span>
              </button>
              {onReturnHome && (
                <button
                  type="button"
                  onClick={onReturnHome}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>होमपेज</span>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    );
  }

  // ============================================================================
  // REUSABLE SECTION: FEATURE ON/OFF CONTROL MANAGER
  // ============================================================================
  const renderFeatureControlSection = () => (
    <div className="bg-[#0B111E] border border-slate-800/90 rounded-xl overflow-hidden">
      {/* Section Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800/90 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#0D1424]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-slate-300" />
            <h2 className="text-sm sm:text-base font-bold text-white">
              फीचर ऑन-ऑफ़ कंट्रोल पैनल (Feature Access Control)
            </h2>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-mono">
              {enabledFeaturesCount} / {ALL_CONTROLLABLE_FEATURES.length} चालू
            </span>
          </div>
          <p className="text-xs text-slate-400">
            किसी भी फीचर को अपने हाथ से तुरंत चालू (ON) या बंद (OFF) करें। बंद किया गया फीचर छात्रों के लिए लॉक हो जाएगा।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 bg-[#060A12] border border-slate-800 rounded-lg px-3 py-1.5">
            <Search className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <input
              type="text"
              value={featureSearch}
              onChange={e => setFeatureSearch(e.target.value)}
              placeholder="फीचर खोजें..."
              className="bg-transparent border-none outline-none text-xs text-white placeholder:text-slate-500 w-32 sm:w-40"
            />
          </div>

          <button
            onClick={() => handleBulkFeatureToggle(true)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium cursor-pointer transition-colors"
          >
            सभी चालू करें (All ON)
          </button>
          <button
            onClick={() => handleBulkFeatureToggle(false)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium cursor-pointer transition-colors"
          >
            सभी बंद करें (All OFF)
          </button>
        </div>
      </div>

      {/* Clean 2-Column Structured Feature Switch Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:gap-px bg-slate-800/60">
        {filteredFeatures.map(feat => {
          const isEnabled = featureToggles[feat.id] !== false;
          return (
            <div
              key={feat.id}
              onClick={() => handleFeatureToggle(feat.id, isEnabled)}
              className="bg-[#0B111E] hover:bg-[#0F172A] p-4 flex items-center justify-between gap-4 cursor-pointer transition-colors select-none"
            >
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      isEnabled ? 'bg-emerald-400' : 'bg-slate-600'
                    }`}
                  />
                  <span className="font-semibold text-xs sm:text-sm text-white truncate">
                    {feat.hindiName}
                  </span>
                  <span className="text-[10px] text-slate-400 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded">
                    {feat.category}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1 pl-4">{feat.desc}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                    isEnabled
                      ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  {isEnabled ? 'ON (चालू)' : 'OFF (बंद)'}
                </span>

                <button
                  type="button"
                  role="switch"
                  aria-checked={isEnabled}
                  onClick={e => {
                    e.stopPropagation();
                    handleFeatureToggle(feat.id, isEnabled);
                  }}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isEnabled ? 'bg-blue-600' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                      isEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ============================================================================
  // REUSABLE SECTION: STUDENT & VISITOR TRACKING TABLE
  // ============================================================================
  const renderUsersSection = () => (
    <div className="bg-[#0B111E] border border-slate-800/90 rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 sm:p-5 border-b border-slate-800/90 flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-[#0D1424]">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-300" />
            <span>छात्र एवं विज़िटर लॉगिन रिकॉर्ड (Student &amp; Visitor Directory)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            पंजीकृत छात्रों और अतिथि उपयोगकर्ताओं की उपस्थिति व फीचर उपयोग का विवरण।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-lg bg-[#060A12] p-0.5 border border-slate-800">
            {[
              { id: 'all', label: `सभी (${usersList.length})` },
              { id: 'registered', label: `रजिस्टर्ड (${registeredCount})` },
              { id: 'guest', label: `अतिथि (${guestCount})` }
            ].map(filt => (
              <button
                key={filt.id}
                onClick={() => setUserFilter(filt.id as any)}
                className={`px-3 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                  userFilter === filt.id
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {filt.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-[#060A12] border border-slate-800 rounded-lg px-3 py-1.5">
            <Search className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <input
              type="text"
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              placeholder="नाम या ईमेल खोजें..."
              className="bg-transparent border-none outline-none text-xs text-white placeholder:text-slate-500 w-36 sm:w-44"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800/90 bg-[#080D18] text-slate-400 font-semibold">
              <th className="py-3 px-4">छात्र / उपयोगकर्ता</th>
              <th className="py-3 px-4">खाता प्रकार</th>
              <th className="py-3 px-4">अंतिम सक्रिय विषय</th>
              <th className="py-3 px-4">अंतिम समय</th>
              <th className="py-3 px-4">उपयोग संख्या</th>
              <th className="py-3 px-4 text-right">विवरण</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u, i) => {
                const isReg = u.userType === 'registered' || u.isLoggedIn;
                const isExpanded = !!expandedUserIds[u.userId];
                const totalFeatures = u.featuresUsed
                  ? Object.values(u.featuresUsed).reduce((a, b) => a + b, 0)
                  : 1;

                return (
                  <React.Fragment key={u.userId || i}>
                    <tr className="hover:bg-[#0F172A] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-semibold text-slate-200 shrink-0">
                            {(u.displayName?.[0] || 'U').toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <span className="font-semibold text-white block truncate">
                              {u.displayName}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono block truncate">
                              {u.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                            isReg
                              ? 'bg-slate-900 text-slate-200 border-slate-700'
                              : 'bg-slate-900/50 text-slate-400 border-slate-800'
                          }`}
                        >
                          {isReg ? 'रजिस्टर्ड छात्र' : 'अतिथि (Guest)'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {u.lastTopic || 'Home Dashboard'}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                        {u.lastActiveStr || new Date(u.lastActive).toLocaleString('hi-IN')}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-200">
                        {totalFeatures} बार
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => toggleUserExpand(u.userId)}
                          className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-[11px] font-medium text-slate-300 hover:text-white inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>{isExpanded ? 'बंद करें' : 'इतिहास'}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr className="bg-[#080D18]">
                        <td colSpan={6} className="p-4 border-t border-slate-800/80">
                          <div className="space-y-3 pl-2 sm:pl-11 text-xs">
                            <div className="text-[11px] text-slate-400 font-semibold">
                              फीचर उपयोग सांख्यिकी:
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {u.featuresUsed && Object.keys(u.featuresUsed).length > 0 ? (
                                Object.entries(u.featuresUsed).map(([feat, count], fIdx) => (
                                  <span
                                    key={fIdx}
                                    className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300"
                                  >
                                    {feat}: <strong className="text-white">{count}x</strong>
                                  </span>
                                ))
                              ) : (
                                <span className="text-slate-500">कोई अतिरिक्त डेटा नहीं</span>
                              )}
                            </div>

                            <div className="text-[11px] text-slate-400 font-semibold pt-2 border-t border-slate-800/80">
                              हालिया गतिविधि लॉग्स:
                            </div>
                            <div className="space-y-1">
                              {Array.isArray(u.sessionHistory) && u.sessionHistory.length > 0 ? (
                                u.sessionHistory.slice(0, 6).map((hist, hIdx) => (
                                  <div
                                    key={hIdx}
                                    className="flex items-center gap-2 text-slate-400 text-[11px] py-0.5"
                                  >
                                    <span className="font-mono text-slate-500">
                                      [{hist.timestamp}]
                                    </span>
                                    <strong className="text-slate-200">{hist.feature}</strong>
                                    <span>— {hist.action}</span>
                                  </div>
                                ))
                              ) : (
                                <span className="text-slate-500">कोई टाइमलाइन उपलब्ध नहीं है।</span>
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
                  कोई उपयोगकर्ता रिकॉर्ड नहीं मिला।
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ============================================================================
  // FULL-PAGE CLEAN PROFESSIONAL ADMIN CONSOLE
  // ============================================================================
  return (
    <div className="w-full min-h-full overflow-y-auto bg-[#060A12] text-slate-100 font-sans pb-28 scrollbar-thin">
      {/* 1. FULL-WIDTH CLEAN EXECUTIVE TOP BAR */}
      <div className="border-b border-slate-800/90 bg-[#090E1A] px-4 sm:px-6 py-4 sticky top-0 z-10 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            {onReturnHome && (
              <button
                onClick={onReturnHome}
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white cursor-pointer shrink-0 mt-0.5 sm:mt-0"
                title="होमपेज पर लौटें"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  HANS COMPAIN • OWNER ADMIN CONSOLE
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                हंस कैंपेन एडमिनिस्ट्रेटर कंट्रोल सेंटर
              </h1>
            </div>
          </div>

          {/* Clean Uniform Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsHealthScannerOpen(true)}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-medium text-xs rounded-lg flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Cpu className="w-3.5 h-3.5 text-slate-400" />
              <span>सिस्टम डायग्नोस्टिक स्कैनर</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-medium text-xs rounded-lg flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>CSV रिपोर्ट</span>
            </button>

            <button
              onClick={fetchAllAnalyticsData}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-medium text-xs rounded-lg flex items-center gap-2 cursor-pointer transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${isLoading ? 'animate-spin' : ''}`} />
              <span>डेटा रीफ्रेश</span>
            </button>

            <button
              onClick={handleAdminLogout}
              className="px-3 py-2 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-rose-300 font-medium text-xs rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
              title="एडमिन कंसोल लॉक करें"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>कंसोल लॉक करें</span>
            </button>
          </div>
        </div>

        {/* 2. SINGLE-LINE PROFESSIONAL NAVIGATION TAB BAR */}
        <div className="flex items-center gap-1 overflow-x-auto pt-4 mt-4 border-t border-slate-800/80 scrollbar-thin">
          {[
            { id: 'overview', label: 'मुख्य कंट्रोल डैशबोर्ड (Overview)' },
            { id: 'features', label: `फीचर ऑन-ऑफ़ (${enabledFeaturesCount}/${ALL_CONTROLLABLE_FEATURES.length})` },
            { id: 'users', label: `स्टूडेंट रिकॉर्ड्स (${Math.max(1, usersList.length)})` },
            { id: 'activities', label: `लाइव एक्टिविटी (${activitiesStream.length})` },
            { id: 'alerts', label: 'ईमेल अलर्ट लॉग्स' },
            { id: 'broadcast', label: 'नोटिस व व्हाट्सएप' },
            { id: 'security', label: 'सुरक्षा ऑडिट' }
          ].map(t => {
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  active
                    ? 'bg-white text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN CONTENT BODY (FULL WIDTH) */}
      <div className="px-4 sm:px-6 pt-5 space-y-6">
        {/* Status Toast Notification */}
        {statusBanner && (
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs font-medium flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{statusBanner}</span>
            </div>
            <button
              onClick={() => setStatusBanner(null)}
              className="text-slate-400 hover:text-white text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* 3. CLEAN UNIFORM 4-COLUMN KPI SUMMARY STRIP */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-[#0B111E] border border-slate-800/90 rounded-xl p-4">
            <span className="text-xs text-slate-400 block">कुल विज़िटर्स (Total Visitors)</span>
            <div className="text-2xl font-bold text-white mt-1">
              {Math.max(1, usersList.length)}
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">सक्रिय डिवाइस व सत्र</span>
          </div>

          <div className="bg-[#0B111E] border border-slate-800/90 rounded-xl p-4">
            <span className="text-xs text-slate-400 block">रजिस्टर्ड छात्र (Logged-In)</span>
            <div className="text-2xl font-bold text-white mt-1">{registeredCount}</div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">क्लाउड सिंक खाते</span>
          </div>

          <div className="bg-[#0B111E] border border-slate-800/90 rounded-xl p-4">
            <span className="text-xs text-slate-400 block">सक्रिय फीचर्स (Active Modules)</span>
            <div className="text-2xl font-bold text-white mt-1">
              {enabledFeaturesCount} / {ALL_CONTROLLABLE_FEATURES.length}
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">लाईव ऑन-ऑफ़ नियंत्रण</span>
          </div>

          <div className="bg-[#0B111E] border border-slate-800/90 rounded-xl p-4">
            <span className="text-xs text-slate-400 block">लाइव एक्शन लॉग्स (Activity Logs)</span>
            <div className="text-2xl font-bold text-white mt-1">{activitiesStream.length}</div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">रियल-टाइम इवेंट्स</span>
          </div>
        </div>

        {/* =============================================================
            TAB: OVERVIEW (BOTH FEATURE ON/OFF & USERS IN ONE CLEAN PAGE)
            ============================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {renderFeatureControlSection()}
            {renderUsersSection()}
          </div>
        )}

        {/* =============================================================
            TAB: DEDICATED FEATURE ON/OFF MANAGER
            ============================================================= */}
        {activeTab === 'features' && renderFeatureControlSection()}

        {/* =============================================================
            TAB: DEDICATED STUDENT TRACKING
            ============================================================= */}
        {activeTab === 'users' && renderUsersSection()}

        {/* =============================================================
            TAB: REAL-TIME ACTIVITY STREAM
            ============================================================= */}
        {activeTab === 'activities' && (
          <div className="bg-[#0B111E] border border-slate-800/90 rounded-xl overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-800/90 flex items-center justify-between bg-[#0D1424]">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-slate-300" />
                  <span>लाइव फीचर उपयोग टाइमलाइन (Real-Time Action Stream)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  छात्रों द्वारा खोले गए पेजों और अभ्यास सत्रों का क्रमानुसार विवरण।
                </p>
              </div>
              <span className="text-xs font-mono text-slate-300 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                {activitiesStream.length} लॉग्स
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800/90 bg-[#080D18] text-slate-400 font-semibold">
                    <th className="py-3 px-4">छात्र का नाम</th>
                    <th className="py-3 px-4">उपयोग किया गया फीचर</th>
                    <th className="py-3 px-4">गतिविधि विवरण</th>
                    <th className="py-3 px-4 text-right">समय</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {activitiesStream.length > 0 ? (
                    activitiesStream.map((act, idx) => (
                      <tr key={idx} className="hover:bg-[#0F172A]">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-white">{act.displayName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{act.email}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-0.5 rounded bg-slate-900 text-slate-200 font-medium border border-slate-800">
                            {act.feature}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-300">{act.action}</td>
                        <td className="py-3 px-4 text-right font-mono text-slate-400">
                          {act.timestamp}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-500">
                        अभी कोई लाइव एक्टिविटी दर्ज नहीं हुई है।
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =============================================================
            TAB: EMAIL ALERTS & 24H INACTIVITY DISPATCH
            ============================================================= */}
        {activeTab === 'alerts' && (
          <div className="bg-[#0B111E] border border-slate-800/90 rounded-xl overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-800/90 flex flex-wrap items-center justify-between gap-3 bg-[#0D1424]">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-300" />
                  <span>24 घंटे निष्क्रियता व अध्ययन अलर्ट लॉग्स</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  पंजीकृत छात्रों को भेजे गए स्वचालित ईमेल रिमाइंडर और सारांश।
                </p>
              </div>
              <button
                onClick={async () => {
                  try {
                    const res = await fetch('/api/admin/trigger-email-check', { method: 'POST' });
                    const data = await res.json();
                    if (data && data.success) {
                      showNotice('24h ईमेल अलर्ट चेक सफलतापूर्वक पूरा हो गया।');
                      fetchAllAnalyticsData();
                    }
                  } catch {
                    showNotice('ईमेल अलर्ट चेक अनुरोध भेज दिया गया।');
                  }
                }}
                className="px-3.5 py-2 bg-white hover:bg-slate-200 text-slate-950 font-semibold text-xs rounded-lg cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>ईमेल चेक ट्रिगर करें</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800/90 bg-[#080D18] text-slate-400 font-semibold">
                    <th className="py-3 px-4">समय</th>
                    <th className="py-3 px-4">प्रकार</th>
                    <th className="py-3 px-4">प्राप्तकर्ता</th>
                    <th className="py-3 px-4">फीचर</th>
                    <th className="py-3 px-4">विवरण</th>
                    <th className="py-3 px-4 text-right">स्थिति</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70 text-slate-300">
                  {emailAlerts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        कोई ईमेल अलर्ट लॉग नहीं मिला।
                      </td>
                    </tr>
                  ) : (
                    emailAlerts.map(alert => (
                      <tr key={alert.id} className="hover:bg-[#0F172A]">
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                          {alert.timestamp || alert.isoTime}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                            {alert.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-200 whitespace-nowrap">
                          {alert.recipientEmail}
                        </td>
                        <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                          {alert.featureName}
                        </td>
                        <td className="py-3 px-4 text-slate-300 max-w-md">
                          <div className="font-semibold text-white text-xs">{alert.title}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{alert.details}</div>
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-emerald-400 font-semibold text-[11px]">
                          SENT
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =============================================================
            TAB: BROADCAST & WHATSAPP CONFIGURATION
            ============================================================= */}
        {activeTab === 'broadcast' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Live Notice Publisher */}
            <div className="bg-[#0B111E] border border-slate-800/90 rounded-xl p-5 space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <Bell className="w-4 h-4 text-slate-300" />
                  <span>लाइव नोटिस ब्रॉडकास्ट (Student Notification)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  यहाँ लिखा गया संदेश सभी छात्रों के नोटिफिकेशन बेल आइकॉन में तुरंत दिखाई देगा।
                </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 block">
                    नोटिस का शीर्षक (Title)
                  </label>
                  <input
                    type="text"
                    value={broadcastTitle}
                    onChange={e => setBroadcastTitle(e.target.value)}
                    placeholder="उदा. नया 100 WPM डिक्टेशन टेस्ट अपलोड हो गया है"
                    className="w-full p-2.5 rounded-lg bg-[#060A12] border border-slate-800 text-xs text-white outline-none focus:border-slate-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 block">
                    संदेश विवरण (Message)
                  </label>
                  <textarea
                    rows={4}
                    value={broadcastMessage}
                    onChange={e => setBroadcastMessage(e.target.value)}
                    placeholder="छात्रों के लिए सूचना यहाँ लिखें..."
                    className="w-full p-2.5 rounded-lg bg-[#060A12] border border-slate-800 text-xs text-white outline-none focus:border-slate-600 resize-none"
                  />
                </div>

                <button
                  onClick={handlePublishNotice}
                  className="px-4 py-2.5 rounded-lg bg-white hover:bg-slate-200 text-slate-950 font-semibold text-xs cursor-pointer flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>नोटिस पब्लिश करें</span>
                </button>
              </div>
            </div>

            {/* WhatsApp Community Link Setup */}
            <div className="bg-[#0B111E] border border-slate-800/90 rounded-xl p-5 space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-slate-300" />
                  <span>व्हाट्सएप स्टडी ग्रुप लिंक (WhatsApp Group)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  साइडबार मेनू में छात्रों के जुड़ने के लिए आधिकारिक व्हाट्सएप ग्रुप लिंक अपडेट करें।
                </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 block">
                    व्हाट्सएप इनवाइट URL
                  </label>
                  <input
                    type="text"
                    value={whatsappGroupLink}
                    onChange={e => setWhatsappGroupLink(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[#060A12] border border-slate-800 text-xs font-mono text-slate-200 outline-none focus:border-slate-600"
                  />
                </div>

                <button
                  onClick={handleSaveWhatsAppConfig}
                  className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-xs cursor-pointer flex items-center gap-2"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>ग्रुप लिंक सेव करें</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =============================================================
            TAB: SECURITY & RATE SHIELD
            ============================================================= */}
        {activeTab === 'security' && (
          <div className="bg-[#0B111E] border border-slate-800/90 rounded-xl p-5 space-y-4 text-xs">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-slate-300" />
                <span>सिस्टम सुरक्षा एवं रेट-लिमिट ऑडिट (Security Shield)</span>
              </h3>
              <p className="text-slate-400 mt-0.5">
                अनावश्यक ट्रैफिक व बॉट रिक्वेस्ट से सुरक्षा हेतु 30 Req/Min रेट-लिमिटर सक्रिय है।
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <span className="text-xs text-slate-400 font-medium block">कनेक्शन विवरण</span>
                <div className="p-3.5 bg-[#060A12] rounded-lg font-mono text-slate-300 border border-slate-800 leading-relaxed">
                  IP Address: {getClientIp()}
                  <br />
                  Rate Limit: 30 Requests / Minute
                  <br />
                  Session Auth: Active (Verified Owner)
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs text-slate-400 font-medium block">सुरक्षा लॉग्स</span>
                <div className="p-3.5 bg-[#060A12] rounded-lg max-h-[140px] overflow-y-auto text-slate-300 font-mono border border-slate-800 space-y-1">
                  {securityLogs.map((log, lIdx) => (
                    <div key={lIdx} className="text-[11px]">
                      [{log.severity}] {log.reason}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Diagnostic Scanner Modal */}
      <AppHealthScannerModal
        isOpen={isHealthScannerOpen}
        onClose={() => setIsHealthScannerOpen(false)}
      />
    </div>
  );
};

export default AdminPanel;
