import React, { useState } from 'react';
import { Download, Smartphone, X, Check, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{ variant?: 'header' | 'sidebar' | 'banner' }> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // If already running as an installed standalone PWA, hide
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    setIsInstalling(true);
    try {
      await install();
    } finally {
      setIsInstalling(false);
    }
  };

  if (variant === 'sidebar') {
    return (
      <div className="p-3 bg-gradient-to-r from-blue-900/60 to-indigo-900/60 border border-blue-500/40 rounded-2xl space-y-2">
        <div className="flex items-center gap-2 text-white font-bold text-xs">
          <Smartphone className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>ऐप इनस्टॉल करें (Install App)</span>
        </div>
        <p className="text-[11px] text-slate-300">बिना ब्राउज़र 1-क्लिक में मोबाइल/लैपटॉप पर चलाएं।</p>
        
        {isInstallable && (
          <button
            onClick={handleInstallClick}
            disabled={isInstalling}
            className="w-full py-2 px-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isInstalling ? 'इनस्टॉल हो रहा है...' : 'अभी इंस्टॉल करें'}</span>
          </button>
        )}

        {isIOS && (
          <button
            onClick={() => setShowIOSGuide(true)}
            className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-cyan-500/30 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>iPhone / iPad पर जोड़ें</span>
          </button>
        )}

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700 p-6 shadow-2xl space-y-4 text-white">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-black flex items-center gap-2 text-cyan-400">
                  <Smartphone className="w-4 h-4" />
                  <span>iPhone / iPad पर इनस्टॉल करें</span>
                </h3>
                <button onClick={() => setShowIOSGuide(false)} className="p-1 text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">1</span>
                  <span>Safari ब्राउज़र में नीचे दिए गए <strong>Share (शेयर)</strong> बटन पर टैप करें।</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">2</span>
                  <span>नीचे स्क्रॉल करके <strong>Add to Home Screen (होम स्क्रीन में जोड़ें)</strong> चुनें।</span>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs cursor-pointer"
              >
                समझ गए (Done)
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Header / Capsule variant
  if (isInstallable) {
    return (
      <button
        onClick={handleInstallClick}
        disabled={isInstalling}
        className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-[11px] flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
        title="होम स्क्रीन पर ऐप इनस्टॉल करें (Install PWA)"
      >
        <Download className="w-3 h-3 text-white" />
        <span className="hidden sm:inline">{isInstalling ? 'इनस्टॉल...' : 'App Install'}</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-200 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
          title="iPhone में इनस्टॉल करें"
        >
          <Download className="w-3 h-3 text-cyan-400" />
          <span className="hidden sm:inline">Install iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700 p-6 shadow-2xl space-y-4 text-white">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-black flex items-center gap-2 text-cyan-400">
                  <Smartphone className="w-4 h-4" />
                  <span>iPhone / iPad पर इनस्टॉल करें</span>
                </h3>
                <button onClick={() => setShowIOSGuide(false)} className="p-1 text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">1</span>
                  <span>Safari ब्राउज़र में नीचे दिए गए <strong>Share</strong> बटन पर टैप करें।</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">2</span>
                  <span>नीचे स्क्रॉल करके <strong>Add to Home Screen</strong> चुनें।</span>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs cursor-pointer"
              >
                समझ गए (Done)
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
