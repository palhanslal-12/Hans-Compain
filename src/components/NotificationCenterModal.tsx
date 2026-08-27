import React, { useState, useEffect } from 'react';
import { 
  Bell, BellRing, Sparkles, CheckCircle2, AlertCircle, 
  Calendar, Flame, Zap, Award, BookOpen, Trash2, Check, 
  X, ExternalLink, RefreshCw, Volume2, ShieldCheck, ArrowRight,
  Settings, CheckCheck, Clock, FileCheck, Radio
} from 'lucide-react';

export interface AppNotification {
  id: string;
  type: 'app_update' | 'exam_alert' | 'daily_practice' | 'system' | 'task_complete';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionLabel?: string;
  actionTarget?: string; // view name or URL
  badge?: string;
}

const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    type: 'app_update',
    title: '✨ नया फीचर: Unlimited PYQ Vault & Endless Practice चालू!',
    message: 'अब SSC, Railway, UPSC, Banking, BPSC, Police व Defense के 2015-2026 के असीमित पिछले वर्षों के प्रश्न (PYQs) उपलब्ध हैं।',
    timestamp: 'Just now',
    isRead: false,
    actionLabel: 'PYQ Vault खोलें',
    actionTarget: 'pyq-vault',
    badge: 'NEW UPDATE'
  },
  {
    id: 'notif-2',
    type: 'task_complete',
    title: '🎙️ Voice Recording & Notebook Process Complete',
    message: 'आपका ऑडियो ट्रांसक्रिप्शन और स्टडी नोट्स बैकग्राउंड प्रोसेस सफलतापूर्वक पूर्ण हो चुका है।',
    timestamp: '10m ago',
    isRead: false,
    actionLabel: 'नोट्स देखें',
    actionTarget: 'notes',
    badge: 'TASK DONE'
  },
  {
    id: 'notif-3',
    type: 'exam_alert',
    title: '📢 SSC CGL 2026 & Railway NTPC आधिकारिक अपडेट',
    message: 'TCS iON परीक्षा पैटर्न में 4-क्वाड्रेंट स्पीड-एक्यूरेसी स्कोरिंग अनिवार्य। नवीनतम PYQ सेट्स से अभ्यास जारी रखें।',
    timestamp: 'Today',
    isRead: false,
    actionLabel: 'एग्जाम सिलेबस देखें',
    actionTarget: 'syllabus',
    badge: 'EXAM ALERT'
  },
  {
    id: 'notif-4',
    type: 'daily_practice',
    title: '🎯 दैनिक स्ट्रीक रिमाइंडर: आज का 10-मिनट क्विज़',
    message: 'अपनी निरंतरता बनाए रखें! आज का टेस्ट पूरा करें और अपने स्ट्रीक पॉइंट्स व AI बैज अनलॉक करें।',
    timestamp: 'Yesterday',
    isRead: true,
    actionLabel: 'क्विज़ शुरू करें',
    actionTarget: 'quiz',
    badge: 'DAILY GOAL'
  },
  {
    id: 'notif-5',
    type: 'system',
    title: '🛡️ HansAI Companion v4.8 सिक्योरिटी व AI अपग्रेड',
    message: 'सभी इनपुट बॉक्स सुरक्षित व क्लीन किए गए हैं। तेज रिस्पॉन्स और ऑफलाइन डेटा सिंक अब और अधिक स्मूथ है।',
    timestamp: '2 days ago',
    isRead: true,
    badge: 'SYSTEM'
  }
];

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToView?: (view: string) => void;
  showToast: (msg: string, type?: 'info' | 'success' | 'warn' | 'error') => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  onNavigateToView,
  showToast
}) => {
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem('hansai_notifications_v1');
      return saved ? JSON.parse(saved) : DEFAULT_NOTIFICATIONS;
    } catch {
      return DEFAULT_NOTIFICATIONS;
    }
  });

  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'app_update' | 'exam_alert' | 'task_complete'>('all');
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission>(() => {
    return typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default';
  });
  const [showPermissionPrompt, setShowPermissionPrompt] = useState<boolean>(() => {
    return typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default';
  });

  // Save to local storage
  useEffect(() => {
    try {
      localStorage.setItem('hansai_notifications_v1', JSON.stringify(notifications));
    } catch (e) {
      console.error(e);
    }
  }, [notifications]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    showToast("सभी नोटिफिकेशन्स 'पढ़े गए' मार्क कर दिए गए ✅", "success");
  };

  const markSingleAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
    showToast("नोटिफिकेशन हटा दिया गया", "info");
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    showToast("सभी नोटिफिकेशन्स साफ़ कर दिए गए", "info");
  };

  const requestBrowserPermission = async () => {
    if (!('Notification' in window)) {
      showToast("आपका ब्राउज़र पुश नोटिफिकेशन को सपोर्ट नहीं करता।", "warn");
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      setBrowserPermission(permission);
      setShowPermissionPrompt(false);
      if (permission === 'granted') {
        showToast("ब्राउज़र पुश नोटिफिकेशन सक्रिय कर दिया गया! 🔔", "success");
        try {
          new Notification("HansAI Companion 🔔", {
            body: "पुश नोटिफिकेशन चालू है! जब भी कोई बैकग्राउंड प्रोसेस, रिकॉर्डर या ऐप अपडेट पूरा होगा, आपको तुरंत नोटिफिकेशन मिलेगा।",
            icon: "/icon-192.png"
          });
        } catch (e) {
          console.warn("Test notification failed", e);
        }
      } else {
        showToast("नोटिफिकेशन अनुमति अस्वीकार की गई।", "warn");
      }
    } catch {
      showToast("पुश नोटिफिकेशन सक्षम करने में त्रुटि हुई।", "warn");
    }
  };

  const handleActionClick = (notif: AppNotification) => {
    markSingleAsRead(notif.id);
    if (notif.actionTarget && onNavigateToView) {
      onClose();
      onNavigateToView(notif.actionTarget);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'unread') return !n.isRead;
    if (activeFilter === 'all') return true;
    return n.type === activeFilter;
  });

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-start justify-center sm:justify-end p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-[#0B1020] border border-slate-700/80 w-full sm:w-[420px] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] text-slate-100 animate-scale-up mt-12 sm:mt-14 sm:mr-3"
        onClick={(e) => e.stopPropagation()}
        id="native-notification-center-box"
      >
        {/* Compact App-Style Header */}
        <div className="bg-[#0e1529] px-4 py-3.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center relative shrink-0">
              <Bell className="w-4 h-4 text-amber-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5 leading-tight">
                <span>Notifications & Updates</span>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full text-[9px] font-bold">
                    {unreadCount} new
                  </span>
                )}
              </h2>
              <p className="text-[11px] text-slate-400 leading-tight">App updates, AI processes & alerts</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-[11px] font-semibold flex items-center gap-1 cursor-pointer border border-slate-700"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer border border-slate-700"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Clean, Simple Native-Style Permission Access Bar */}
        {browserPermission !== 'granted' && (
          <div className="bg-indigo-950/40 border-b border-indigo-500/20 px-3.5 py-2.5 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-300 text-[11px] leading-tight min-w-0">
              <BellRing className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">बैकग्राउंड प्रोसेस व अपडेट्स का अलर्ट पाने के लिए:</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={requestBrowserPermission}
                className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-[10px] transition-all cursor-pointer border-none shadow-sm"
              >
                Enable
              </button>
              <button
                onClick={() => setShowPermissionPrompt(false)}
                className="p-1 text-slate-400 hover:text-white text-[10px]"
                title="Dismiss"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Simple Filter Pills */}
        <div className="px-3.5 py-2 bg-[#090D1A] border-b border-slate-800/80 flex items-center justify-between gap-1 text-xs">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer border-none ${
                activeFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({notifications.length})
            </button>
            {unreadCount > 0 && (
              <button
                onClick={() => setActiveFilter('unread')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer border-none ${
                  activeFilter === 'unread' ? 'bg-rose-600 text-white' : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                Unread ({unreadCount})
              </button>
            )}
            <button
              onClick={() => setActiveFilter('task_complete')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer border-none ${
                activeFilter === 'task_complete' ? 'bg-emerald-600 text-white' : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              Tasks
            </button>
            <button
              onClick={() => setActiveFilter('app_update')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer border-none ${
                activeFilter === 'app_update' ? 'bg-cyan-600 text-white' : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              Updates
            </button>
          </div>

          {notifications.length > 0 && (
            <button
              onClick={clearAllNotifications}
              className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
              title="Clear all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Notifications List (Native Simple Card Layout) */}
        <div className="flex-1 overflow-y-auto p-2.5 sm:p-3 space-y-2 divide-y divide-slate-850/60">
          {filteredNotifications.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <div className="w-10 h-10 mx-auto rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                <Bell className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-slate-400">कोई नई सूचना नहीं है</div>
              <p className="text-[10px] text-slate-500 max-w-xs mx-auto">
                जब भी कोई बैकग्राउंड प्रोसेस (जैसे वॉयस ट्रांसक्रिप्शन) या नया अपडेट आएगा, यहाँ दिखाई देगा।
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const isUnread = !notif.isRead;
              return (
                <div
                  key={notif.id}
                  onClick={() => markSingleAsRead(notif.id)}
                  className={`pt-2 first:pt-0 p-2.5 rounded-xl transition-all cursor-pointer flex items-start justify-between gap-2.5 ${
                    isUnread
                      ? 'bg-[#121933]/90 border border-indigo-500/40 shadow-sm'
                      : 'bg-slate-900/40 hover:bg-slate-900/80 border border-transparent'
                  }`}
                >
                  {/* Status Indicator Dot / Icon */}
                  <div className="mt-0.5 shrink-0">
                    {notif.type === 'task_complete' ? (
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    ) : notif.type === 'app_update' ? (
                      <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center border border-cyan-500/30">
                        <Zap className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-500/30">
                        <Bell className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {notif.badge && (
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-black tracking-wider uppercase ${
                            notif.type === 'task_complete' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                            notif.type === 'app_update' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' :
                            notif.type === 'exam_alert' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                            'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                          }`}>
                            {notif.badge}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 font-mono flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5 text-slate-500" />
                          {notif.timestamp}
                        </span>
                      </div>

                      {isUnread && (
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                      )}
                    </div>

                    <h3 className={`text-xs leading-snug break-words ${isUnread ? 'text-white font-bold' : 'text-slate-300 font-medium'}`}>
                      {notif.title}
                    </h3>

                    <p className="text-[11px] text-slate-400 leading-relaxed break-words line-clamp-3">
                      {notif.message}
                    </p>

                    {notif.actionLabel && (
                      <div className="pt-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleActionClick(notif);
                          }}
                          className="px-2.5 py-1 bg-indigo-600/90 hover:bg-indigo-600 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer border-none shadow-sm"
                        >
                          <span>{notif.actionLabel}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Delete Item */}
                  <button
                    onClick={(e) => deleteNotification(notif.id, e)}
                    className="p-1 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity"
                    title="Remove"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Simple Footer */}
        <div className="px-3.5 py-2.5 bg-[#090D1A] border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Background Notifications Active</span>
          </div>
          <button
            onClick={() => {
              const newTestNotif: AppNotification = {
                id: `notif-${Date.now()}`,
                type: 'task_complete',
                title: '⚡ प्रोसेस पूरा: AI Notebook & Speech Transcribed',
                message: 'आपका बैकग्राउंड कार्य सफलतापूर्वक समाप्त हुआ। आप कभी भी नोट्स या परिणाम देख सकते हैं।',
                timestamp: 'Just now',
                isRead: false,
                badge: 'TASK DONE',
                actionLabel: 'नोट्स देखें',
                actionTarget: 'notes'
              };
              setNotifications([newTestNotif, ...notifications]);
              showToast("🔔 टास्क कम्प्लीट टेस्ट नोटिफिकेशन भेजा गया!", "success");
            }}
            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-semibold cursor-pointer border border-slate-700 transition-all"
          >
            🔔 Test Alert
          </button>
        </div>
      </div>
    </div>
  );
};

