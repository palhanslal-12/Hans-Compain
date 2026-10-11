import React, { useState, useEffect } from 'react';
import { Download, Smartphone, X, Share2, Copy, Check, ExternalLink, ShieldCheck } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export function getCleanInstallUrl(): string {
  if (typeof window === 'undefined') return 'https://hans-compain.onrender.com';
  return window.location.origin.replace('https://ais-dev-', 'https://ais-pre-');
}

export const PWAInstallButton: React.FC<{ variant?: 'header' | 'sidebar' | 'banner' }> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [copied, setCopied] = useState(false);
  const [inIframe, setInIframe] = useState(false);

  useEffect(() => {
    try {
      setInIframe(window.self !== window.top);
    } catch {
      setInIframe(true);
    }

    // If someone opened a shared link with ?install=1 and not yet installed in standalone mode, auto-open the install card
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      if (params.get('install') === '1' && !isStandalone) {
        setShowModal(true);
      }
    }
  }, []);

  const installUrl = getCleanInstallUrl();
  const shareMessage = `📲 *HANS COMPAIN Shorthand (हंस कैंपेन शॉर्टहैंड) — Official App*\n\nबिना Chrome शॉर्टकट के सीधे फुल-स्क्रीन मोबाइल/लैपटॉप ऐप के रूप में इंस्टॉल करने के लिए नीचे दिए गए लिंक पर क्लिक करें और *"Install"* चुनें:\n👉 ${installUrl}`;

  const handleDirectInstall = async () => {
    if (isInstallable) {
      setIsInstalling(true);
      try {
        const accepted = await install();
        if (accepted) {
          setShowModal(false);
          return;
        }
      } finally {
        setIsInstalling(false);
      }
    }
    setShowModal(true);
  };

  const handleCopyInstallLink = async () => {
    try {
      await navigator.clipboard.writeText(installUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'HANS COMPAIN Shorthand — Official App Install',
          text: 'HANS COMPAIN Shorthand (हंस कैंपेन शॉर्टहैंड) को फुल-स्क्रीन ऐप (Install) के रूप में चलाने के लिए इस लिंक को खोलें:',
          url: installUrl,
        });
        return;
      } catch {
        // user cancelled or unsupported
      }
    }
    await handleCopyInstallLink();
  };

  const handleWhatsAppShare = () => {
    const waLink = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
    window.open(waLink, '_blank', 'noopener,noreferrer');
  };

  const InstallShareModal = () => {
    if (!showModal) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in">
        <div className="w-full max-w-md rounded-3xl bg-[#070E1E] border border-cyan-500/30 p-5 sm:p-6 shadow-2xl space-y-4 text-white max-h-[90dvh] overflow-y-auto">
          {/* Header with Official HANS COMPAIN Crest */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
            <div className="flex items-center gap-3">
              <img
                src="/icon.svg"
                alt="HANS COMPAIN Official Icon"
                className="w-11 h-11 rounded-2xl border border-amber-400/50 shadow-md shrink-0 bg-[#03060E]"
              />
              <div>
                <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-1.5">
                  <span>HANS COMPAIN</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.5 rounded-md font-bold">
                    Official App
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  फुल-स्क्रीन ऐप इंस्टॉल एवं डायरेक्ट शेयर लिंक
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Guarantee Badge: No AI Studio or Chrome Shortcut Logo */}
          <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-[11px] text-slate-200 leading-relaxed">
              <strong className="text-emerald-300">100% HANS COMPAIN ब्रांडिंग:</strong> इस डायरेक्ट लिंक से <strong>"Install"</strong> करने पर आपके फोन में केवल <strong>HANS COMPAIN का हंस लोगो</strong> और फुल-स्क्रीन ऐप खुलेगा (ओपन करते समय Google AI Studio या Chrome शॉर्टकट का आइकन नहीं दिखेगा)।
            </div>
          </div>

          {/* Step 1: Direct Install Action */}
          <div className="space-y-2 bg-[#0B152B] border border-slate-800 rounded-2xl p-3.5">
            <div className="text-xs font-black text-cyan-300 flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" />
              <span>1. अपने डिवाइस में फुल-स्क्रीन ऐप इंस्टॉल करें:</span>
            </div>

            {isInstallable ? (
              <button
                onClick={handleDirectInstall}
                disabled={isInstalling}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all"
              >
                <Download className="w-4 h-4" />
                <span>{isInstalling ? 'इंस्टॉल हो रहा है...' : '📲 अभी 1-क्लिक में Install करें (Full Screen)'}</span>
              </button>
            ) : inIframe ? (
              <div className="space-y-2">
                <p className="text-[11px] text-amber-200/90 leading-relaxed">
                  ⚠️ अभी आप एडिटर प्रीव्यू के अंदर हैं। असली <strong>HANS COMPAIN</strong> आइकन के साथ इंस्टॉल करने के लिए नीचे बटन दबाकर डायरेक्ट ऐप खोलें और फिर <strong>Install</strong> चुनें:
                </p>
                <a
                  href={installUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>डायरेक्ट HANS COMPAIN ऐप टैब में खोलें ↗</span>
                </a>
              </div>
            ) : isIOS ? (
              <div className="text-[11px] text-slate-300 space-y-1.5 leading-relaxed">
                <div>1. Safari में नीचे <strong>Share (शेयर)</strong> बटन दबाएं।</div>
                <div>2. <strong>Add to Home Screen</strong> पर टैप करें।</div>
              </div>
            ) : (
              <div className="text-[11px] text-slate-300 space-y-1.5 leading-relaxed">
                <div>• Chrome के ऊपर दाईं ओर <strong>3-डॉट मेनू (⋮)</strong> पर टैप करें।</div>
                <div>• <strong>"Add to Home screen"</strong> या <strong>"Install app"</strong> दबाएं।</div>
                <div>• पॉपअप में पहला विकल्प <strong>"Install" (↓)</strong> ही चुनें (<em>Create shortcut नहीं</em>)।</div>
              </div>
            )}
          </div>

          {/* Step 2: Share Direct Install Link */}
          <div className="space-y-2.5 bg-[#0B152B] border border-slate-800 rounded-2xl p-3.5">
            <div className="text-xs font-black text-amber-300 flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5" />
              <span>2. छात्रों/दोस्तों को यही Install वाला लिंक भेजें:</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              नीचे दिया गया लिंक शेयर करने पर सामने वाले को सीधे <strong>HANS COMPAIN Install</strong> कार्ड और लोगो ही दिखेगा:
            </p>

            {/* URL Preview Box */}
            <div className="flex items-center gap-2 bg-[#040814] border border-slate-800 rounded-xl p-2 px-3">
              <span className="text-[11px] text-cyan-300 font-mono truncate flex-1 select-all">
                {installUrl}
              </span>
              <button
                onClick={handleCopyInstallLink}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold flex items-center gap-1 shrink-0 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            {/* Share Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleWhatsAppShare}
                className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow cursor-pointer transition-all"
              >
                <span>💬</span>
                <span>WhatsApp पर भेजें</span>
              </button>
              <button
                onClick={handleNativeShare}
                className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow cursor-pointer transition-all"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Install Link</span>
              </button>
            </div>
          </div>

          <button
            onClick={() => setShowModal(false)}
            className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer transition-all"
          >
            बंद करें (Close)
          </button>
        </div>
      </div>
    );
  };

  if (variant === 'sidebar') {
    return (
      <>
        <div className="p-3 bg-gradient-to-r from-blue-900/60 to-indigo-900/60 border border-blue-500/40 rounded-2xl space-y-2">
          <div className="flex items-center justify-between gap-2 text-white font-bold text-xs">
            <div className="flex items-center gap-2">
              <img src="/icon.svg" alt="Hans Compain" className="w-5 h-5 rounded-md border border-amber-400/40" />
              <span>Official App (Install &amp; Share)</span>
            </div>
            {isInstalled && (
              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-black">INSTALLED</span>
            )}
          </div>
          <p className="text-[11px] text-slate-300">
            बिना Chrome शॉर्टकट के असली फुल-स्क्रीन ऐप इंस्टॉल करें या डायरेक्ट लिंक शेयर करें।
          </p>

          <div className="grid grid-cols-2 gap-1.5">
            {!isInstalled && (
              <button
                onClick={handleDirectInstall}
                disabled={isInstalling}
                className="py-2 px-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-[11px] font-black flex items-center justify-center gap-1 shadow-md cursor-pointer transition-all"
              >
                <Download className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{isInstalling ? 'इंस्टॉल...' : 'Install App'}</span>
              </button>
            )}
            <button
              onClick={() => setShowModal(true)}
              className={`${isInstalled ? 'col-span-2' : ''} py-2 px-2.5 bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-amber-500/30 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-all`}
            >
              <Share2 className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Share Link</span>
            </button>
          </div>
        </div>
        <InstallShareModal />
      </>
    );
  }

  // Header capsule variant — always accessible for Install or Sharing Direct Install Link
  return (
    <>
      <div className="flex items-center gap-1.5">
        {!isInstalled && (
          <button
            onClick={handleDirectInstall}
            disabled={isInstalling}
            className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-[11px] flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
            title="HANS COMPAIN फुल-स्क्रीन ऐप इंस्टॉल करें (Install Official App)"
          >
            <Download className="w-3 h-3 text-white shrink-0" />
            <span>{isInstalling ? 'इंस्टॉल...' : 'Install'}</span>
          </button>
        )}
        <button
          onClick={() => setShowModal(true)}
          className="px-2.5 py-1 rounded-xl bg-slate-900 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-all"
          title="डायरेक्ट Install वाला ऐप लिंक शेयर करें"
        >
          <Share2 className="w-3 h-3 text-cyan-400 shrink-0" />
          <span className="hidden sm:inline">Share App</span>
        </button>
      </div>
      <InstallShareModal />
    </>
  );
};
