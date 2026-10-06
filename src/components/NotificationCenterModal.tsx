import React from 'react';
import { X, Bell, Sparkles } from 'lucide-react';

export const NotificationCenterModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  let customNotices: { id: number; title: string; message: string; time: string }[] = [];
  try {
    customNotices = JSON.parse(localStorage.getItem('hans_custom_notifications') || '[]');
  } catch (e) {
    customNotices = [];
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl animate-scale-up">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Bell className="w-5 h-5" />
            <span>सूचना व अपडेट केंद्र (Notification Center)</span>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {customNotices.map((n) => (
            <div key={n.id} className="p-4 bg-amber-950/30 rounded-2xl border border-amber-500/40 space-y-1">
              <div className="flex items-center justify-between">
                <div className="text-xs font-black text-amber-300">📢 {n.title}</div>
                <span className="text-[10px] text-amber-400/80">{n.time}</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">{n.message}</p>
            </div>
          ))}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-xs font-bold text-amber-400">🔥 Hans Compain Daily Booster</div>
            <p className="text-xs text-slate-300">आज के 10 महत्वपूर्ण करेंट अफेयर्स व गोल्डन वन-लाइनर अपडेट कर दिए गए हैं। अभी अभ्यास करें!</p>
          </div>
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-xs font-bold text-indigo-400">⚔️ Live Quiz Battle</div>
            <p className="text-xs text-slate-300">शाम 8 बजे SSC CGL व Steno महासंग्राम क्विज़ में हिस्सा लें।</p>
          </div>
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-xs font-bold text-emerald-400">📧 24-Hour Auto-Email Study Monitor</div>
            <p className="text-xs text-slate-300">पंजीकृत छात्रों के लिए 24-घंटे निष्क्रियता रिमाइंडर सिस्टम बैकग्राउंड में सक्रिय है।</p>
          </div>
        </div>
      </div>
    </div>
  );
};
