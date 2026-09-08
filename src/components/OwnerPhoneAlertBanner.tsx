import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, Bell, Smartphone, Mail, ShieldAlert, 
  CheckCircle2, X, RefreshCw, Volume2, Sparkles, Send
} from 'lucide-react';
import { 
  dispatchOwnerAlert, 
  getOwnerAlertsFromServer, 
  OwnerAlertItem, 
  playOwnerAlertChime, 
  vibratePhoneForAlert 
} from '../utils/ownerAlertService';

interface OwnerPhoneAlertBannerProps {
  userEmail?: string;
  isOwner?: boolean;
  language?: 'hindi' | 'english';
  showToast: (msg: string, type?: 'success' | 'error' | 'info' | 'warn') => void;
  onOpenOwnerDashboard?: () => void;
}

export const OwnerPhoneAlertBanner: React.FC<OwnerPhoneAlertBannerProps> = ({
  userEmail,
  isOwner,
  language = 'hindi',
  showToast,
  onOpenOwnerDashboard
}) => {
  const isHindi = language === 'hindi';
  const isTargetOwner = isOwner || userEmail === 'palhanslal4@gmail.com';

  const [alerts, setAlerts] = useState<OwnerAlertItem[]>([]);
  const [problemCount, setProblemCount] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [isSendingTest, setIsSendingTest] = useState<boolean>(false);

  const fetchAlerts = async () => {
    const data = await getOwnerAlertsFromServer();
    setAlerts(data.alerts);
    setProblemCount(data.problemCount);
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000); // 30s poll
    return () => clearInterval(interval);
  }, []);

  // When app opens, if there are problems, trigger phone alert
  useEffect(() => {
    if (problemCount > 0 && isTargetOwner) {
      vibratePhoneForAlert([300, 100, 300]);
      playOwnerAlertChime(true);
    }
  }, [problemCount, isTargetOwner]);

  const handleSendTestAlert = async () => {
    setIsSendingTest(true);
    await dispatchOwnerAlert(
      'update',
      '📱 Owner Alert Test (Phone & Email Verification)',
      `HansAI Owner Alert Test dispatched at ${new Date().toLocaleTimeString()} to palhanslal4@gmail.com. Phone vibration and email dispatched!`,
      'info'
    );
    await fetchAlerts();
    setIsSendingTest(false);
    showToast(
      isHindi 
        ? '📱 फोन अलर्ट व ईमेल palhanslal4@gmail.com पर भेज दिया गया!' 
        : '📱 Alert sent to phone and email palhanslal4@gmail.com!', 
      'success'
    );
  };

  const handleClearAlerts = async () => {
    try {
      await fetch('/api/owner/clear-alerts', { method: 'POST' });
      setAlerts([]);
      setProblemCount(0);
      showToast(isHindi ? 'सभी अलर्ट्स हटा दिए गए।' : 'All alerts cleared.', 'info');
    } catch (e) {
      showToast('Failed to clear alerts', 'error');
    }
  };

  // Only show if user is owner OR if there is an active problem
  if (!isTargetOwner && problemCount === 0) return null;
  if (isDismissed && problemCount === 0) return null;

  return (
    <>
      <aside 
        aria-label={isHindi ? 'ओनर फोन अलर्ट व सिस्टम स्टेटस' : 'Owner Phone Alert & System Status'}
        className={`w-full px-3 py-2 text-xs transition-all z-40 ${
        problemCount > 0
          ? 'bg-rose-950/90 border-b border-rose-500/50 text-rose-100 animate-pulse'
          : 'bg-slate-900/95 border-b border-indigo-500/30 text-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 min-w-0">
            {problemCount > 0 ? (
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </span>
            ) : (
              <Smartphone className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            )}

            <span className="font-extrabold truncate">
              {problemCount > 0
                ? isHindi 
                  ? `🚨 ओनर फोन अलर्ट: ${problemCount} समस्या पाई गई!` 
                  : `🚨 Owner Phone Alert: ${problemCount} Problem(s) Detected!`
                : isHindi 
                  ? '📱 ओनर फोन व ईमेल अलर्ट सिस्टम सक्रिय (palhanslal4@gmail.com)' 
                  : '📱 Owner Phone & Email Alert Active (palhanslal4@gmail.com)'}
            </span>

            <span className="hidden sm:inline text-[10px] px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-400">
              {alerts.length} {isHindi ? 'अलर्ट्स' : 'Logs'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSendTestAlert}
              disabled={isSendingTest}
              className="px-2.5 py-1 rounded-lg bg-indigo-600/80 hover:bg-indigo-500 text-white text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm active:scale-95"
              title="Send verification test to phone and email"
            >
              <Send className="w-3 h-3" />
              <span>{isSendingTest ? 'भेज रहे हैं...' : isHindi ? 'टेस्ट अलर्ट भेजें' : 'Send Test Alert'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold transition-all cursor-pointer"
            >
              {isHindi ? 'विवरण देखें' : 'View Log'}
            </button>

            {onOpenOwnerDashboard && (
              <button
                type="button"
                onClick={onOpenOwnerDashboard}
                className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-black transition-all cursor-pointer hidden md:inline-flex"
              >
                {isHindi ? 'एडमिन पैनल' : 'Admin Panel'}
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              className="text-slate-400 hover:text-white p-1 cursor-pointer"
              title="Close banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* ALERT LOG MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
          <div className="relative w-full max-w-xl max-h-[85vh] bg-[#0A0E1A] border-2 border-indigo-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col justify-between space-y-4 text-left text-slate-100">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    {isHindi ? 'ओनर फोन व ईमेल अलर्ट रिकॉर्ड' : 'Owner Alert & Notification Vault'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    To: palhanslal4@gmail.com • Web Push + Vibration + Email Sync
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body - Alerts List */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
              {alerts.length === 0 ? (
                <div className="text-center py-8 text-slate-500 space-y-2">
                  <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 opacity-60" />
                  <p className="text-xs">
                    {isHindi ? 'कोई समस्या या पेंडिंग अलर्ट नहीं है। सिस्टम पूरी तरह सुरक्षित है।' : 'No pending alerts. System is running optimally.'}
                  </p>
                </div>
              ) : (
                alerts.map((al) => {
                  const isProb = al.type === 'problem' || al.severity === 'critical' || al.severity === 'high';
                  return (
                    <div
                      key={al.id}
                      className={`p-3 rounded-2xl border transition-all ${
                        isProb
                          ? 'bg-rose-950/30 border-rose-500/40'
                          : 'bg-slate-900/60 border-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          {isProb ? (
                            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                          <h4 className="text-xs font-black text-white">{al.title}</h4>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono shrink-0">
                          {new Date(al.timestamp).toLocaleTimeString()}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                        {al.message}
                      </p>

                      <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400 pt-1.5 border-t border-slate-800/60">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-indigo-400" />
                          <span>Email: palhanslal4@gmail.com</span>
                        </span>
                        <span>•</span>
                        <span>Source: {al.source || 'App Engine'}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleClearAlerts}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-bold transition-all cursor-pointer"
              >
                {isHindi ? 'सभी हटाएं' : 'Clear All'}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSendTestAlert}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black transition-all cursor-pointer shadow-md"
                >
                  {isHindi ? 'टेस्ट अलर्ट भेजें' : 'Send Test Alert'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  {isHindi ? 'बंद करें' : 'Close'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
