import React, { useState } from 'react';
import { Download, Smartphone, CheckCircle, ArrowRight, X, ExternalLink, Sparkles, ShieldCheck } from 'lucide-react';

interface AppInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
  onInstallSuccess?: () => void;
  language?: 'hindi' | 'english';
}

export const AppInstallModal: React.FC<AppInstallModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onInstallSuccess,
  language = 'hindi'
}) => {
  const [installing, setInstalling] = useState(false);
  const [installed, setInstalled] = useState(false);
  const isHindi = language === 'hindi';

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      setInstalling(true);
      try {
        await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult && choiceResult.outcome === 'accepted') {
          setInstalled(true);
          if (onInstallSuccess) onInstallSuccess();
        }
      } catch (err) {
        console.warn('Install prompt error:', err);
      } finally {
        setInstalling(false);
      }
    } else {
      // Direct instruction or fallback
      const userAgent = window.navigator.userAgent.toLowerCase();
      if (/iphone|ipad|ipod/.test(userAgent)) {
        alert(isHindi ? 'iOS Safari में नीचे शेयर बटन ⎋ दबाकर "Add to Home Screen" चुनें।' : 'Tap the Safari Share button ⎋ and select "Add to Home Screen".');
      }
    }
  };

  const handleDownloadLauncher = () => {
    const launcherHtml = `<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HANS COMPAIN App</title>
  <meta http-equiv="refresh" content="0; url=${window.location.origin}/">
  <style>
    body { background: #03060E; color: white; font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
    .btn { display: inline-block; padding: 12px 24px; background: #0284C7; color: white; border-radius: 12px; text-decoration: none; font-weight: bold; margin-top: 16px; }
  </style>
</head>
<body>
  <h2>HANS COMPAIN AI ऐप खुल रहा है...</h2>
  <p>कृपया प्रतीक्षा करें या नीचे बटन पर क्लिक करें:</p>
  <a class="btn" href="${window.location.origin}/">ऐप खोलें (Open App)</a>
  <script>window.location.href = "${window.location.origin}/";</script>
</body>
</html>`;

    const blob = new Blob([launcherHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Hans_Compain_App_Launcher.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#070D1D] border border-cyan-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl text-slate-100 overflow-hidden">
        {/* Decorative Top Accent Glow */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-500" />
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
          title="बंद करें (Close)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with App Logo */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-cyan-500/40 p-2 flex items-center justify-center shrink-0 shadow-lg">
            <img 
              src="/logo.png" 
              alt="HANS COMPAIN" 
              className="w-full h-full object-contain opacity-90"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black tracking-wide text-white">
                {isHindi ? 'Android स्क्रीन पर ऐप जोड़ें' : 'Install App on Mobile Screen'}
              </h2>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-extrabold uppercase">
                Official
              </span>
            </div>
            <p className="text-xs text-cyan-300/80 font-medium">
              {isHindi ? 'HANS COMPAIN Official App (WebAPK / PWA)' : 'Single Tap Direct Screen Installation'}
            </p>
          </div>
        </div>

        {/* Direct Install CTA Button */}
        {deferredPrompt ? (
          <div className="mb-5 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-teal-950/80 to-cyan-950/80 border border-emerald-500/50">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                {isHindi ? 'ऑटोमैटिक 1-क्लिक इंस्टॉलेशन उपलब्ध है:' : 'One-Click Direct Installation Available:'}
              </span>
              <span className="text-[10px] bg-emerald-500/25 text-emerald-200 px-2 py-0.5 rounded font-mono">Fast ⚡</span>
            </div>
            <button
              onClick={handleInstallClick}
              disabled={installing}
              className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <Smartphone className="w-5 h-5" />
              <span>
                {installing 
                  ? (isHindi ? 'इंस्टॉल हो रहा है...' : 'Installing...')
                  : installed 
                    ? (isHindi ? '✅ ऐप स्क्रीन पर जुड़ गया!' : '✅ App Added to Screen!')
                    : (isHindi ? '📲 अभी मोबाइल स्क्रीन पर इंस्टॉल करें' : '📲 Install Directly to Screen Now')}
              </span>
            </button>
          </div>
        ) : null}

        {/* Step by Step Mobile Screen Setup Guide */}
        <div className="space-y-3 mb-5">
          <div className="text-xs font-black uppercase text-cyan-400 tracking-wider flex items-center gap-1.5">
            <span>📱</span>
            <span>{isHindi ? 'मोबाइल स्क्रीन पर असली ऐप आइकन कैसे लगाएं:' : 'How to Add App Icon to Android Home Screen:'}</span>
          </div>

          <div className="grid grid-cols-1 gap-2.5 text-left">
            {/* Step 1 */}
            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-start gap-3">
              <div className="w-7 h-7 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-black text-xs shrink-0 mt-0.5">
                1
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-200 block mb-0.5">
                  {isHindi ? 'Chrome ब्राउज़र में 3 डॉट्स दबाएं:' : 'Tap Chrome Menu (3 Dots):'}
                </span>
                <span className="text-slate-400">
                  {isHindi 
                    ? 'मोबाइल स्क्रीन के ऊपर दायें कोने में तीन डॉट्स (⋮) पर क्लिक करें।' 
                    : 'Tap the three vertical dots (⋮) in the top-right corner of your mobile browser.'}
                </span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-start gap-3">
              <div className="w-7 h-7 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-black text-xs shrink-0 mt-0.5">
                2
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-200 block mb-0.5">
                  {isHindi ? '"Install app" या "होम स्क्रीन पर जोड़ें" चुनें:' : 'Select "Install app" or "Add to Home screen":'}
                </span>
                <span className="text-slate-400">
                  {isHindi 
                    ? 'मेनू में से "Install app" (ऐप इंस्टॉल करें) या "Add to Home screen" विकल्प पर क्लिक करें।' 
                    : 'Click "Install app" or "Add to Home screen" option from the menu list.'}
                </span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-start gap-3">
              <div className="w-7 h-7 rounded-xl bg-indigo-950 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-black text-xs shrink-0 mt-0.5">
                3
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-200 block mb-0.5">
                  {isHindi ? '"Install / जोड़ें" दबाएं और ऐप तैयार है:' : 'Tap "Install" and Launch Directly:'}
                </span>
                <span className="text-slate-400">
                  {isHindi 
                    ? 'पुष्टि करते ही HANS COMPAIN का लोगो आपके मोबाइल की मेन स्क्रीन पर असली ऐप की तरह लग जाएगा!' 
                    : 'Confirm and HANS COMPAIN logo icon will appear right on your mobile app screen!'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits & Offline Guarantee */}
        <div className="p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl flex items-center justify-between text-xs mb-4">
          <div className="flex items-center gap-2 text-cyan-200">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{isHindi ? '100% सुरक्षित • बिना किसी एड के • डायरेक्ट स्क्रीन एक्सेस' : '100% Secure • Direct Screen Access • No Ads'}</span>
          </div>
          <button
            onClick={handleDownloadLauncher}
            className="text-[11px] font-bold text-cyan-300 hover:text-white underline cursor-pointer shrink-0 ml-2"
            title="Download launcher backup"
          >
            {isHindi ? '📥 बैकअप फ़ाइल' : '📥 Backup Launcher'}
          </button>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="py-2.5 px-5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-all cursor-pointer"
          >
            {isHindi ? 'समझ गए (Got it)' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
