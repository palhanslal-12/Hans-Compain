import React, { useState } from 'react';
import { Sparkles, Zap, Newspaper, QrCode, X, CheckCircle, Bell, ArrowRight, ShieldCheck, Star } from 'lucide-react';

interface UpcomingFeaturesRoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: 'hindi' | 'english';
  showToast?: (msg: string, type?: 'success' | 'warn' | 'info' | 'error') => void;
  onLaunchFeature?: (featureId: string) => void;
  onOpenFeedback?: () => void;
}

export const UpcomingFeaturesRoadmapModal: React.FC<UpcomingFeaturesRoadmapModalProps> = ({
  isOpen,
  onClose,
  language = 'hindi',
  showToast = () => {},
  onLaunchFeature,
  onOpenFeedback
}) => {
  const [subscribedFeature, setSubscribedFeature] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleNotifyMe = (featureName: string) => {
    setSubscribedFeature(featureName);
    showToast(`🔔 "${featureName}" के रिलीज़ होने पर आपको सूचित किया जाएगा!`, "success");
    setTimeout(() => setSubscribedFeature(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#080C18] border border-cyan-500/30 rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-cyan-950/80 via-slate-900 to-indigo-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-lg flex items-center gap-2">
                HansAI Companion • प्रोजेक्ट रोडमैप व योजनाएं
                <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2.5 py-0.5 rounded-full border border-cyan-500/40">
                  Plans & Features
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Speed Reply, Current Affairs & QR Scanner Innovation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-200 text-sm">
          {/* Feature 1: Speed Reply, Response (ACTIVE & OPTIMIZED) */}
          <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900/90 to-slate-900 border border-emerald-500/40 rounded-2xl p-4 sm:p-5 relative overflow-hidden group">
            <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/50 rounded-full text-[11px] font-bold text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>LIVE & 100% ACTIVE</span>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div className="space-y-1.5 flex-1 pr-24">
                <h4 className="font-bold text-white text-base flex items-center gap-2">
                  # Speed Reply, Response (सुपरफ़ास्ट उत्तर)
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  सब-सेकंड लो-लेटेंसी AI रिस्पॉन्स, वॉइस टू वॉइस ऑटो-रीडआउट, और लोकल स्मार्ट फॉलबैक। बिना किसी रुकावट के तुरंत उत्तर प्राप्त करें।
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="text-[11px] bg-slate-800/80 px-2 py-0.5 rounded text-emerald-300 border border-emerald-500/30">
                    ⚡ &lt;0.8s Streaming
                  </span>
                  <span className="text-[11px] bg-slate-800/80 px-2 py-0.5 rounded text-cyan-300 border border-cyan-500/30">
                    🎙️ Auto-Voice Output
                  </span>
                  <span className="text-[11px] bg-slate-800/80 px-2 py-0.5 rounded text-amber-300 border border-amber-500/30">
                    🇮🇳 All State Languages
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2: Current Affairs (NOW ACTIVE) */}
          <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900/90 to-slate-900 border border-indigo-500/40 rounded-2xl p-4 sm:p-5 relative overflow-hidden group">
            <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/50 rounded-full text-[11px] font-bold text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>LIVE & AVAILABLE NOW</span>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
                <Newspaper className="w-6 h-6" />
              </div>
              <div className="space-y-1.5 flex-1 pr-24">
                <h4 className="font-bold text-white text-base flex items-center gap-2">
                  # Current Affairs (दैनिक समसामयिकी व परीक्षा बुलेटिन)
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  दैनिक राष्ट्रीय व अंतर्राष्ट्रीय करंट अफेयर्स, परीक्षा उपयोगी 1-लाइनर फैक्ट्स, साप्ताहिक क्विज़ और स्टेट लेवल बुलेटिन (हिंदी, इंग्लिश एवं क्षेत्रीय भाषाओं में)।
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-2">
                  {onLaunchFeature && (
                    <button
                      onClick={() => {
                        onClose();
                        onLaunchFeature('current-affairs');
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/30 cursor-pointer border-none"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-300" />
                      <span>करंट अफेयर्स हब खोलें (Open Hub) →</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleNotifyMe('Current Affairs')}
                    className="px-3 py-1.5 rounded-lg bg-indigo-950 hover:bg-indigo-900 border border-indigo-500/30 text-indigo-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <Bell className="w-3.5 h-3.5 text-amber-300" />
                    {subscribedFeature === 'Current Affairs' ? 'नोटिफिकेशन सेट हो गया ✅' : 'डेली अलर्ट'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 3: QR Scanner (NOW ACTIVE) */}
          <div className="bg-gradient-to-br from-cyan-950/40 via-slate-900/90 to-slate-900 border border-cyan-500/40 rounded-2xl p-4 sm:p-5 relative overflow-hidden group">
            <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/50 rounded-full text-[11px] font-bold text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>LIVE & AVAILABLE NOW</span>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                <QrCode className="w-6 h-6" />
              </div>
              <div className="space-y-1.5 flex-1 pr-24">
                <h4 className="font-bold text-white text-base flex items-center gap-2">
                  # QR Scanner (स्मार्ट क्वेश्चन व नोट्स स्कैनर)
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  किताबों के QR कोड, स्टडी नोट्स, और क्वेश्चन पेपर्स को तुरंत स्कैन करके सीधा HansAI में खोलें और वॉइस से व्याख्या सुनें।
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-2">
                  {onLaunchFeature && (
                    <button
                      onClick={() => {
                        onClose();
                        onLaunchFeature('qr-scanner');
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-black flex items-center gap-1.5 transition-all shadow-md shadow-cyan-600/30 cursor-pointer border-none"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>QR स्कैनर खोलें (Open Scanner) →</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleNotifyMe('QR Scanner')}
                    className="px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/30 text-cyan-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <Bell className="w-3.5 h-3.5 text-amber-300" />
                    {subscribedFeature === 'QR Scanner' ? 'नोटिफिकेशन सेट हो गया ✅' : 'डेली अलर्ट'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* User Suggestion prompt */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                आप कुछ और सुझाव दे सकते हैं?
              </span>
              <p className="text-[11px] text-slate-400">
                यदि आपके पास HansAI Companion के लिए कोई नया फीचर या सुझाव है, तो सीधे शेयर करें।
              </p>
            </div>
            {onOpenFeedback && (
              <button
                onClick={() => {
                  onClose();
                  onOpenFeedback();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold shrink-0 transition-colors"
              >
                सुझाव दें ⭐
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>HansAI Companion • Continuous Innovation</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition-colors"
          >
            बंद करें
          </button>
        </div>
      </div>
    </div>
  );
};
