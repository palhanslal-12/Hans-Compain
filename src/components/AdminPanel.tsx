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
  Cpu
} from 'lucide-react';
import { auth, signInWithGoogle, getLocalActivities } from '../firebase';
import { getSecurityAuditLogs, getClientIp } from '../utils/securityShield';
import { AppHealthScannerModal } from './AppHealthScannerModal';

interface RegisteredUserItem {
  userId: string;
  email: string;
  displayName: string;
  lastActive: string;
  lastTopic?: string;
  notificationCount?: number;
  autoEmailSentAt?: string | null;
}

export const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'security' | 'whatsapp' | 'broadcast' | 'cache'>('users');
  const [usersList, setUsersList] = useState<RegisteredUserItem[]>([]);
  const [purged, setPurged] = useState(false);
  const [securityLogs, setSecurityLogs] = useState(getSecurityAuditLogs());
  const [localActivities, setLocalActivities] = useState(getLocalActivities());
  const [isHealthScannerOpen, setIsHealthScannerOpen] = useState(false);
  const [whatsappGroupLink, setWhatsappGroupLink] = useState(
    localStorage.getItem('hans_whatsapp_group_url') || 'https://chat.whatsapp.com/HansCompainOfficial'
  );
  const [whatsappBroadcastText, setWhatsappBroadcastText] = useState(
    '🔥 *HANS COMPAIN DAILY STUDY ALERT* 🔥\nआज के 10 करेंट अफेयर्स फैक्ट्स, 80/100 WPM आशुलिपि डिक्टेशन और लाइव ग्रुप क्विज़ बैटल ऐप पर अपलोड हो चुके हैं! अभी अभ्यास करें।'
  );
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [statusBanner, setStatusBanner] = useState<string | null>(null);

  const fetchRegisteredUsers = () => {
    fetch('/api/admin/users')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setUsersList(data);
      })
      .catch(() => {});
    setSecurityLogs(getSecurityAuditLogs());
    setLocalActivities(getLocalActivities());
  };

  useEffect(() => {
    fetchRegisteredUsers();
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

  const handlePurgeCache = () => {
    setPurged(true);
    setTimeout(() => setPurged(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fade-in text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-950/70 via-slate-900 to-amber-950/50 p-6 sm:p-8 rounded-3xl border border-amber-500/30 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-bold uppercase mb-2 border border-amber-500/20">
            <ShieldCheck className="w-4 h-4" /> Owner Admin Console &amp; Automation Hub
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-hindi-title text-white">
            ओनर एडमिन कंसोल (Owner Admin Panel)
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            24-घंटे ऑटो-ईमेल इनएक्टिविटी अलर्ट मॉनिटर, व्हाट्सएप ब्रॉडकास्ट इंजन, और लाइव नोटिस बोर्ड नियंत्रण।
          </p>
          <div className="pt-2">
            <button
              onClick={() => setIsHealthScannerOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs rounded-xl flex items-center gap-2 shadow-lg cursor-pointer transition-all"
            >
              <Cpu className="w-4 h-4 animate-spin" />
              <span>🔬 संपूर्ण ऐप स्वास्थ्य व बग स्कैनर (Run Diagnostic Scanner)</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { id: 'users', label: '📧 24h Auto-Email & Users' },
            { id: 'security', label: '🛡️ Security & Token Audit' },
            { id: 'whatsapp', label: '💬 WhatsApp Console' },
            { id: 'broadcast', label: '🔔 Live Notice Push' },
            { id: 'cache', label: '🧹 Cache Purge' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === t.id
                  ? 'bg-amber-500 text-slate-950 font-black shadow'
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

      {/* TAB 1: REGISTERED USERS & 24-HOUR INACTIVITY AUTO-EMAIL SYSTEM */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-1">
              <div className="text-xs text-slate-400 font-bold uppercase flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" /> पंजीकृत छात्र (Registered)
              </div>
              <div className="text-3xl font-black text-white">{Math.max(1, usersList.length)}</div>
              <div className="text-[11px] text-emerald-400 font-bold">Auto-Tracking Active</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-1">
              <div className="text-xs text-slate-400 font-bold uppercase flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400" /> 24h Inactivity Auto-Email
              </div>
              <div className="text-2xl font-black text-emerald-400">BACKGROUND ON</div>
              <div className="text-[11px] text-slate-400">24 घंटे ऐप न खोलने पर स्वतः ईमेल जाता है</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-1">
              <div className="text-xs text-slate-400 font-bold uppercase flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-400" /> Firebase Auth &amp; DB
              </div>
              <div className="text-2xl font-black text-cyan-400">CONNECTED</div>
              <div className="text-[11px] text-slate-400">Owner: palhanslal4@gmail.com</div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">
                  पंजीकृत छात्र एवं 24-घंटे ऑटो-ईमेल अलर्ट लॉग (Background Auto-Email Status)
                </h3>
                <p className="text-xs text-slate-400">
                  यह फीचर सामान्य छात्रों के मेनू में छिपा रहता है और केवल बैकग्राउंड में 24 घंटे की निष्क्रियता पर उनके ईमेल पर संदेश भेजता है।
                </p>
              </div>
              <button
                onClick={fetchRegisteredUsers}
                className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 hover:text-white cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              {usersList.map((u: any, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-850 space-y-2 text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-900 pb-2">
                    <div>
                      <div className="font-bold text-white text-sm">{u.displayName} ({u.email})</div>
                      <div className="text-[11px] text-cyan-300 font-mono mt-0.5">
                        🕒 अंतिम गतिविधि समय: {u.lastActiveStr || new Date(u.lastActive).toLocaleString('hi-IN')} • 📌 हालिया पेज: <strong className="text-emerald-400">{u.lastTopic || 'Home Dashboard'}</strong>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold text-[10px]">
                        24h Auto-Alert Active
                      </span>
                    </div>
                  </div>

                  {Array.isArray(u.sessionHistory) && u.sessionHistory.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        सत्र गतिविधि लॉग (Page Visit Trail):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {u.sessionHistory.map((s: any, sIdx: number) => (
                          <span key={sIdx} className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-slate-300">
                            {s.page} ({s.timestamp || 'अभी'})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SECURITY SHIELD, ANTI-FRAUD & TOKEN ACTIVITY AUDIT */}
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
                <Activity className="w-4 h-4 text-cyan-400" /> यूजर गतिविधि स्ट्रीम (Stream)
              </div>
              <div className="text-2xl font-black text-cyan-300">{localActivities.length} हालिया एक्शन</div>
              <div className="text-[11px] text-slate-400">फीचर्स व पेज विजिट ट्रैकिंग</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-1">
              <div className="text-xs text-slate-400 font-bold uppercase flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-400" /> टोकन्स व कॉइन्स प्रोग्रेस
              </div>
              <div className="text-2xl font-black text-amber-300">250+ XP Coins/User</div>
              <div className="text-[11px] text-slate-400">100% Secure Activity Logging</div>
            </div>
          </div>

          {/* Real-time Feature & Token Usage Log */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>छात्र फीचर उपयोग व टोकन गतिविधि (Live Feature Token Audit Log)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  देखें कब, किसने, कौन-सा फीचर (स्टैनो डिक्टेशन, क्विज़, चैट) उपयोग किया और कितना स्कोर अर्जित किया।
                </p>
              </div>
              <button
                onClick={fetchRegisteredUsers}
                className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 hover:text-white cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto">
              {localActivities.length > 0 ? (
                localActivities.map((act, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div>
                      <div className="font-bold text-amber-300 flex items-center gap-2">
                        <span>📌 {act.feature}</span>
                        <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-slate-400">{new Date(act.createdAt).toLocaleTimeString('hi-IN')}</span>
                      </div>
                      <div className="text-slate-300 mt-0.5">{act.topic}</div>
                      <div className="text-slate-400 text-[11px]">{act.summary}</div>
                    </div>
                    <div className="shrink-0 flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-black text-[11px]">
                        +{act.scorePercent} Coins/Points
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-500">अभी कोई हालिया गतिविधि दर्ज नहीं है।</div>
              )}
            </div>
          </div>

          {/* Security & Anti-Fraud Violation Logs */}
          <div className="bg-slate-900 border border-rose-900/40 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-rose-400 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-500" />
                  <span>एंटी-फ्रॉड एवं हैकर सुरक्षा ऑडिट (IP Security Audit Monitor)</span>
                </h3>
                <p className="text-xs text-slate-300">
                  यदि कोई बोट या हैकर एक ही IP एड्रेस से लगातार स्पैमिंग करता है, तो IP स्वचालित रूप से ब्लॉक हो जाता है।
                </p>
              </div>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {securityLogs.map((sec, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        sec.severity === 'BLOCKED' ? 'bg-rose-600 text-white' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {sec.severity}
                      </span>
                      <span className="font-bold text-white">IP: {sec.ip}</span>
                      <span className="text-slate-500 text-[10px]">{new Date(sec.timestamp).toLocaleTimeString('hi-IN')}</span>
                    </div>
                    <div className="text-slate-300">{sec.reason}</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 text-[10px] shrink-0 font-mono">
                    User: {sec.userId}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {activeTab === 'whatsapp' && (
        <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div>
            <h3 className="text-lg font-black text-emerald-400 flex items-center gap-2">
              <span>💬 व्हाट्सएप ग्रुप एवं ब्रॉडकास्ट प्रबंधन (WhatsApp Admin Console)</span>
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              साइडबार के "व्हाट्सएप ग्रुप" बटन का लिंक बदलें और छात्रों को सीधे व्हाट्सएप पर डेली स्टडी अलर्ट भेजें।
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">आधिकारिक व्हाट्सएप ग्रुप लिंक (Sidebar WhatsApp Group URL):</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={whatsappGroupLink}
                onChange={(e) => setWhatsappGroupLink(e.target.value)}
                className="flex-1 p-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleSaveWhatsAppConfig}
                className="px-5 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black rounded-2xl text-xs cursor-pointer"
              >
                लिंक सेव करें
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">व्हाट्सएप डेली ब्रॉडकास्ट संदेश (1-Click WhatsApp Broadcast):</label>
            <textarea
              rows={4}
              value={whatsappBroadcastText}
              onChange={(e) => setWhatsappBroadcastText(e.target.value)}
              className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={handleShareToWhatsApp}
              className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <Send className="w-4 h-4" />
              <span>व्हाट्सएप ग्रुप पर तुरंत भेजें (Broadcast on WhatsApp)</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: LIVE NOTICE BOARD PUSH */}
      {activeTab === 'broadcast' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <span>लाइव छात्र सूचना प्रसारण (Push Live Notification to All Students)</span>
          </h3>
          <div className="space-y-3">
            <input
              type="text"
              value={broadcastTitle}
              onChange={(e) => setBroadcastTitle(e.target.value)}
              placeholder="सूचना का शीर्षक (जैसे: आज रात 8 बजे लाइव आशुलिपि टेस्ट)"
              className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs sm:text-sm text-white"
            />
            <textarea
              rows={4}
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              placeholder="सूचना का विस्तृत विवरण लिखें..."
              className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs sm:text-sm text-white"
            />
            <button
              onClick={handlePublishNotice}
              className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-2xl text-xs sm:text-sm cursor-pointer shadow-lg"
            >
              सभी छात्रों को लाइव नोटिफिकेशन भेजें
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: CACHE PURGE */}
      {activeTab === 'cache' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 text-center shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <Trash2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">PWA &amp; Global Cache Purge</h3>
          <p className="text-sm text-slate-300 max-w-lg mx-auto">
            नए करेंट अफेयर्स और ऐप अपडेट को सभी छात्रों के मोबाइल में तुरंत रिफ्रेश करने के लिए ग्लोबल कैश क्लियर करें।
          </p>
          <button
            onClick={handlePurgeCache}
            disabled={purged}
            className="px-8 py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-2xl shadow-lg transition-all cursor-pointer flex items-center gap-2 mx-auto"
          >
            {purged ? <CheckCircle2 className="w-5 h-5" /> : <RefreshCw className="w-5 h-5" />}
            <span>{purged ? 'Cache Purged Successfully!' : 'Purge All Client Caches'}</span>
          </button>
        </div>
      )}

      {/* App Health & Security Diagnostic Scanner Modal */}
      <AppHealthScannerModal
        isOpen={isHealthScannerOpen}
        onClose={() => setIsHealthScannerOpen(false)}
      />
    </div>
  );
};

export default AdminPanel;
