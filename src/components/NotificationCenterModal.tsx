import React, { useState } from 'react';
import { X, Bell, Sparkles, Smartphone, CheckCircle2, Send, ShieldCheck } from 'lucide-react';
import StudentAlertEngine, { OFFICIAL_TAGLINE } from '../utils/studentAlertEngine';

export const NotificationCenterModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState<'notices' | 'alerts'>('alerts');
  const [pushStatus, setPushStatus] = useState<string>('idle');
  const [testSentMsg, setTestSentMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const userName = StudentAlertEngine.getUserDisplayName();

  let customNotices: { id: number; title: string; message: string; time: string }[] = [];
  try {
    customNotices = JSON.parse(localStorage.getItem('hans_custom_notifications') || '[]');
  } catch (e) {
    customNotices = [];
  }

  const handleEnablePush = async () => {
    const granted = await StudentAlertEngine.requestNotificationPermission();
    if (granted) {
      setPushStatus('granted');
      StudentAlertEngine.triggerDemoAlert('inactivity');
      setTestSentMsg('सफल! आपके फोन पर डेमो अलर्ट भेज दिया गया है।');
    } else {
      setPushStatus('denied');
      setTestSentMsg('ब्राउज़र सेटिंग से नोटिफिकेशन की अनुमति दें।');
    }
    setTimeout(() => setTestSentMsg(null), 4000);
  };

  const handleTriggerTest = (type: 'inactivity' | 'incomplete' | 'daily_ca' | 'quiz') => {
    StudentAlertEngine.triggerDemoAlert(type);
    setTestSentMsg(`अलर्ट भेजा गया! अपने फोन स्क्रीन व नोटिफिकेशन बार को चेक करें।`);
    setTimeout(() => setTestSentMsg(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-[#091122] border-2 border-amber-500/40 rounded-3xl p-5 sm:p-7 max-w-lg w-full space-y-4 shadow-2xl relative text-white max-h-[90vh] overflow-y-auto custom-scrollbar">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5 text-amber-400 font-black text-sm sm:text-base">
            <Bell className="w-5 h-5" />
            <span>स्मार्ट सूचना व अलर्ट केंद्र (Notification Hub)</span>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Personalized Welcome Badge & Official Tagline */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-cyan-500/10 to-indigo-500/15 border border-amber-500/30 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-white">नमस्ते, <span className="text-cyan-300">{userName}</span> जी! 👋</span>
            <span className="text-[9px] font-mono bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded">AUTO-ALERTS ON</span>
          </div>
          <p className="text-[11px] text-amber-200/90 font-medium italic">
            ✨ "{OFFICIAL_TAGLINE}"
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-850 text-xs">
          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === 'alerts' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            🔔 फोन व ईमेल ऑटो-अलर्ट्स
          </button>
          <button
            onClick={() => setActiveTab('notices')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === 'notices' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            📢 दैनिक सूचनाएं
          </button>
        </div>

        {activeTab === 'alerts' ? (
          <div className="space-y-3 text-xs">
            {/* Enable Mobile Push Notification Card */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-cyan-300 font-bold">
                  <Smartphone className="w-4 h-4 text-cyan-400" />
                  <span>मोबाइल स्क्रीन पुश नोटिफिकेशन</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">SHORT LOGO + NAME</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                ऐप बंद होने पर भी 24 घंटे इनएक्टिविटी, अधूरा टेस्ट और दैनिक करेंट अफेयर्स का अलर्ट आपके फोन पर नाम सहित पहुंचेगा।
              </p>
              <button
                onClick={handleEnablePush}
                className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow transition-all"
              >
                <Smartphone className="w-4 h-4" />
                <span>फोन नोटिफिकेशन सक्रिय करें व टेस्ट भेजें</span>
              </button>
            </div>

            {testSentMsg && (
              <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center animate-fade-in">
                {testSentMsg}
              </div>
            )}

            {/* Test Alert Buttons for Student & Admin Demo */}
            <div className="space-y-2 pt-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                तुरंत टेस्ट अलर्ट भेजकर देखें (Instant Demo Triggers):
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleTriggerTest('inactivity')}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-400/50 text-left cursor-pointer transition-all"
                >
                  <div className="font-bold text-amber-300 text-[11px]">⏳ 24h इनएक्टिविटी</div>
                  <div className="text-[10px] text-slate-400">नाम व टैगलाइन सहित अलर्ट</div>
                </button>

                <button
                  onClick={() => handleTriggerTest('incomplete')}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-rose-400/50 text-left cursor-pointer transition-all"
                >
                  <div className="font-bold text-rose-300 text-[11px]">⚠️ अधूरा टेस्ट अलर्ट</div>
                  <div className="text-[10px] text-slate-400">बीच में छूटा टेस्ट पूरा करें</div>
                </button>

                <button
                  onClick={() => handleTriggerTest('daily_ca')}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-cyan-400/50 text-left cursor-pointer transition-all"
                >
                  <div className="font-bold text-cyan-300 text-[11px]">📰 15+ करेंट अफेयर्स</div>
                  <div className="text-[10px] text-slate-400">दैनिक ज्ञान व क्विज़ अलर्ट</div>
                </button>

                <button
                  onClick={() => handleTriggerTest('quiz')}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-emerald-400/50 text-left cursor-pointer transition-all"
                >
                  <div className="font-bold text-emerald-300 text-[11px]">🎯 विषय-वार क्विज़</div>
                  <div className="text-[10px] text-slate-400">Voice, Narration व Science</div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
            {customNotices.map((n) => (
              <div key={n.id} className="p-3.5 bg-amber-950/30 rounded-2xl border border-amber-500/40 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-black text-amber-300">📢 {n.title}</div>
                  <span className="text-[10px] text-amber-400/80">{n.time}</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">{n.message}</p>
              </div>
            ))}
            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-xs font-bold text-amber-400">🔥 Hans Compain Daily Booster</div>
              <p className="text-xs text-slate-300">आज के 15+ महत्वपूर्ण करेंट अफेयर्स व गोल्डन वन-लाइनर अपडेट कर दिए गए हैं। अभी अभ्यास करें!</p>
            </div>
            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-xs font-bold text-emerald-400">📧 24-Hour Auto-Email & Mobile Monitor</div>
              <p className="text-xs text-slate-300">पंजीकृत छात्रों के लिए 24-घंटे निष्क्रियता रिमाइंडर और अधूरा टेस्ट अलर्ट बैकग्राउंड में सक्रिय है।</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default NotificationCenterModal;

