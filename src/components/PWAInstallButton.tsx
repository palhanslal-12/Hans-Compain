import React, { useState, useEffect } from 'react';
import { Download, X, Share2, Copy, Check, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { usePWAInstall, triggerGlobalAppInstall } from '../hooks/usePWAInstall';

export const PUBLIC_RENDER_ORIGIN = 'https://hans-compain.onrender.com';

export function getCleanAppOrigin(): string {
  if (typeof window === 'undefined') return PUBLIC_RENDER_ORIGIN;
  // If running inside Google AI Studio preview (*.run.app), use the public Render domain for sharing
  // so recipients never see Google AI Studio's logo or "Verify that it's you" login gate!
  if (window.location.hostname.includes('.run.app')) {
    return PUBLIC_RENDER_ORIGIN;
  }
  return window.location.origin;
}

export function getDirectDownloadUrl(): string {
  return `${getCleanAppOrigin()}/?install=1`;
}

export const PWAInstallButton: React.FC<{ variant?: 'header' | 'sidebar' | 'banner' }> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [installHint, setInstallHint] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [inIframe, setInIframe] = useState(false);
  const [isAIStudioPreview, setIsAIStudioPreview] = useState(false);

  useEffect(() => {
    try {
      setInIframe(window.self !== window.top);
    } catch {
      setInIframe(true);
    }

    if (typeof window !== 'undefined') {
      setIsAIStudioPreview(window.location.hostname.includes('.run.app'));
    }

    if (typeof window !== 'undefined' && variant === 'header') {
      const params = new URLSearchParams(window.location.search);
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true;

      if (params.get('install') === '1' && !isStandalone) {
        setShowModal(true);
      }

      const handleOpenModal = () => setShowModal(true);
      window.addEventListener('hans_open_install_modal', handleOpenModal);
      return () => window.removeEventListener('hans_open_install_modal', handleOpenModal);
    }
  }, [variant]);

  const downloadUrl = getDirectDownloadUrl();
  const shareMessage = `📥 *HansCompain — Study Companion (Official App)*\n\nसीधे अपने फोन या लैपटॉप में *HansCompain Official App* डाउनलोड और इंस्टॉल करने के लिए नीचे दिए गए लिंक पर क्लिक करें:\n👉 ${downloadUrl}`;

  const handleHeaderOrSidebarDownloadClick = async () => {
    setInstallHint(null);

    // If Chrome's native beforeinstallprompt is ready, trigger native 1-click install immediately!
    if (isInstallable || (typeof window !== 'undefined' && window.__deferredPwaPrompt)) {
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
      return;
    }

    // Otherwise open the in-app Download Modal directly (never auto-redirect to ais-pre white auth screen)
    setShowModal(true);
  };

  const handleModalDirectInstallClick = async () => {
    setInstallHint(null);

    // 1. Trigger native Chrome WebAPK / PWA install prompt if available
    if (isInstallable || (typeof window !== 'undefined' && window.__deferredPwaPrompt)) {
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
      return;
    }

    // 2. If user is inside WhatsApp / Facebook / Instagram in-app WebView on Android, launch Chrome directly
    const ua = navigator.userAgent || '';
    const isAndroid = /android/i.test(ua);
    const isInAppWebView = /wv|WhatsApp|FBAN|FBAV|Instagram/i.test(ua);
    if (isAndroid && isInAppWebView) {
      const targetHost = window.location.hostname.includes('.run.app')
        ? 'hans-compain.onrender.com/?install=1'
        : `${window.location.host}/?install=1`;
      window.location.href = `intent://${targetHost}#Intent;scheme=https;package=com.android.chrome;end`;
      return;
    }

    // 3. Wait briefly in case Service Worker & manifest just finished registering
    setIsInstalling(true);
    await new Promise((r) => setTimeout(r, 700));
    setIsInstalling(false);

    if (typeof window !== 'undefined' && window.__deferredPwaPrompt) {
      const res = await triggerGlobalAppInstall();
      if (res === 'accepted') {
        setShowModal(false);
        return;
      }
    }

    // 4. Explain clearly why the browser didn't show the native popup and how to install in 1 tap
    if (isIOS) {
      setInstallHint(
        'iPhone/iPad में इंस्टॉल करने के लिए नीचे Safari के Share बटन पर टैप करें और "Add to Home Screen" चुनें।'
      );
    } else if (inIframe) {
      setInstallHint(
        'आप अभी AI Studio के प्रीव्यू बॉक्स (iframe) के अंदर हैं जहाँ ब्राउज़र डायरेक्ट ऐप डाउनलोड पॉपअप ब्लॉक करता है। सीधे ऐप डाउनलोड करने के लिए या तो ऊपर दाईं ओर Chrome के 3-डॉट मेनू (⋮) से "Install app" चुनें, या अपने Render लिंक (hans-compain.onrender.com) को Chrome में खोलें।'
      );
    } else {
      setInstallHint(
        'यदि डाउनलोड पॉपअप अपने-आप नहीं खुला, तो इसका मतलब आपके फोन में इसका पुराना शॉर्टकट पहले से मौजूद है। पहले फोन की होम-स्क्रीन से पुराना आइकन हटाएँ (Remove/Uninstall), या ऊपर दाईं ओर Chrome के 3-डॉट मेनू (⋮) पर टैप करके "Install app" (या "Add to Home screen" → "Install") दबाएँ।'
      );
    }
  };

  const handleCopyDownloadLink = async () => {
    try {
      await navigator.clipboard.writeText(downloadUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'HansCompain — Study Companion (Official App)',
          text: 'HansCompain — Study Companion आधिकारिक ऐप डाउनलोड व इंस्टॉल करने का डायरेक्ट लिंक:',
          url: downloadUrl,
        });
        return;
      } catch {
        // user cancelled
      }
    }
    await handleCopyDownloadLink();
  };

  const handleWhatsAppShare = () => {
    const waLink = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
    window.open(waLink, '_blank', 'noopener,noreferrer');
  };

  const DownloadInstallModal = () => {
    if (!showModal) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fade-in">
        <div className="w-full max-w-md rounded-3xl bg-[#070E1E] border-2 border-emerald-500/40 p-5 sm:p-6 shadow-2xl space-y-4 text-white max-h-[92dvh] overflow-y-auto">
          {/* Official HansCompain App Store Style Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3.5">
              <img
                src="/logo.png?v=3"
                alt="HansCompain Study Companion Logo"
                className="w-16 h-16 rounded-2xl border-2 border-cyan-400/60 shadow-lg shrink-0 bg-[#060c16] object-cover"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base sm:text-lg font-black">
                    <span className="text-white">Hans</span>
                    <span className="text-[#76c843]">Compain</span>
                  </h3>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                </div>
                <p className="text-[11px] text-cyan-300 font-extrabold tracking-wide uppercase">
                  STUDY COMPANION • Official App
                </p>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-semibold">
                  <span>⭐ 4.9</span>
                  <span>•</span>
                  <span>3.2 MB</span>
                  <span>•</span>
                  <span>Android / iOS / PC</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Primary 1-Click Direct Download & Install Button */}
          <div className="space-y-3 bg-[#0B152B] border border-emerald-500/30 rounded-2xl p-4">
            <button
              onClick={handleModalDirectInstallClick}
              disabled={isInstalling}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-lime-500 hover:from-emerald-400 hover:to-lime-400 text-slate-950 rounded-2xl text-sm font-black flex items-center justify-center gap-2 shadow-xl cursor-pointer transition-all active:scale-98"
            >
              <Download className="w-5 h-5 stroke-[2.5]" />
              <span>
                {isInstalling
                  ? 'ऐप इंस्टॉलेशन तैयार हो रहा है...'
                  : '📥 Download & Install App (सीधे इंस्टॉल करें)'}
              </span>
            </button>

            {installHint && (
              <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs leading-relaxed">
                💡 <strong>महत्वपूर्ण जानकारी:</strong> {installHint}
              </div>
            )}

            <div className="flex items-center gap-2 text-[11px] text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                सीधे आपके फोन में <strong>HansCompain (Study Companion)</strong> के असली लोगो के साथ फुल-स्क्रीन ऐप इंस्टॉल होगा।
              </span>
            </div>
          </div>

          {/* Public Direct App Download Link (Render Domain - No Google AI Studio Gate) */}
          <div className="space-y-2.5 bg-[#0B152B] border border-slate-800 rounded-2xl p-3.5">
            <div className="text-xs font-black text-amber-300 flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5" />
              <span>पब्लिक ऐप डाउनलोड लिंक (बिना Google AI Studio पॉपअप के):</span>
            </div>

            <div className="flex items-center gap-2 bg-[#040814] border border-slate-800 rounded-xl p-2 px-3">
              <span className="text-[11px] text-cyan-300 font-mono truncate flex-1 select-all">
                {downloadUrl}
              </span>
              <button
                onClick={handleCopyDownloadLink}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold flex items-center gap-1 shrink-0 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            {isAIStudioPreview && (
              <p className="text-[10px] text-slate-400 leading-relaxed">
                नोट: <code className="text-amber-300">ais-pre-...run.app</code> Google AI Studio का प्राइवेट टेस्ट लिंक है, इसलिए उसे खोलने पर पहले Google AI Studio का लोगो और <em>&quot;Verify that it&apos;s you&quot;</em> पॉपअप आता है। ऊपर दिया गया <strong className="text-emerald-300">Render लिंक ({PUBLIC_RENDER_ORIGIN})</strong> आपका पब्लिक लिंक है जहाँ कोई पॉपअप या AI Studio लोगो नहीं आता।
              </p>
            )}

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
                <span>Share Download Link</span>
              </button>
            </div>
          </div>

          <button
            onClick={() => setShowModal(false)}
            className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer transition-all"
          >
            ब्राउज़र में जारी रखें (Close)
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
              <img src="/logo.png?v=3" alt="HansCompain" className="w-6 h-6 rounded-md border border-cyan-400/50 object-cover" />
              <span>HansCompain Official App</span>
            </div>
            {isInstalled && (
              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-black">INSTALLED</span>
            )}
          </div>
          <p className="text-[11px] text-slate-300">
            1-क्लिक में असली फुल-स्क्रीन मोबाइल ऐप डाउनलोड करें या डाउनलोड लिंक शेयर करें।
          </p>

          <div className="grid grid-cols-2 gap-1.5">
            {!isInstalled && (
              <button
                onClick={handleHeaderOrSidebarDownloadClick}
                disabled={isInstalling}
                className="py-2 px-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-[11px] font-black flex items-center justify-center gap-1 shadow-md cursor-pointer transition-all"
              >
                <Download className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{isInstalling ? 'डाउनलोड...' : 'Download App'}</span>
              </button>
            )}
            <button
              onClick={() => setShowModal(true)}
              className={`${isInstalled ? 'col-span-2' : ''} py-2 px-2.5 bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-amber-500/30 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-all`}
            >
              <Share2 className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Share App</span>
            </button>
          </div>
        </div>
        <DownloadInstallModal />
      </>
    );
  }

  return (
    <>
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        {!isInstalled && (
          <button
            onClick={handleHeaderOrSidebarDownloadClick}
            disabled={isInstalling}
            className="px-2 py-1 sm:px-2.5 sm:py-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-[10px] sm:text-[11px] flex items-center gap-1 shadow-md cursor-pointer transition-all shrink-0"
            title="HansCompain ऐप सीधे डाउनलोड व इंस्टॉल करें"
          >
            <Download className="w-3 h-3 text-white shrink-0" />
            <span className="hidden xs:inline">{isInstalling ? 'डाउनलोड...' : 'App'}</span>
            <span className="hidden sm:inline">{isInstalling ? 'डाउनलोड...' : 'Download App'}</span>
          </button>
        )}
        <button
          onClick={() => setShowModal(true)}
          className="p-1 sm:px-2 sm:py-1 rounded-xl bg-slate-900 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 font-bold text-[10px] sm:text-[11px] flex items-center gap-1 cursor-pointer transition-all shrink-0"
          title="डायरेक्ट ऐप डाउनलोड लिंक शेयर करें"
        >
          <Share2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="hidden md:inline">Share</span>
        </button>
      </div>
      <DownloadInstallModal />
    </>
  );
};
