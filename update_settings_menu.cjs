const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetSection = `{/* App Share Button */}
            <button
              onClick={() => { setIsShareModalOpen(true); setIsHeaderMenuOpen(false); }}
              className="w-full p-2.5 bg-slate-900 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/40 rounded-xl text-cyan-300 flex items-center justify-between transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-cyan-300 shrink-0" />
                <span>{language === 'hindi' ? 'ऐप दोस्तों के साथ शेयर करें' : 'Share HANS COMPAIN App'}</span>
              </div>
              <span className="text-[10px] opacity-70">Share →</span>
            </button>`;

const newSection = `{/* General & Community Options Section */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider block">
                🌐 {language === 'hindi' ? 'जनरल ऐप डाउनलोड व कम्युनिटी लिंक्स:' : 'General App Downloads & Community Links:'}
              </span>

              {/* Direct APK / PWA App Download */}
              <a
                href="/hans-compain.apk"
                download="Hans_Compain_App.apk"
                onClick={(e) => {
                  // Fallback PWA prompt if APK not hosted locally
                  if ('deferredPrompt' in window && (window as any).deferredPrompt) {
                    (window as any).deferredPrompt.prompt();
                  } else {
                    showToast(language === 'hindi' ? '📲 ऐप डाउनलोड/इंस्टॉल प्रक्रिया शुरू हो रही है...' : '📲 Starting App Download/Installation...', 'info');
                  }
                  setIsHeaderMenuOpen(false);
                }}
                className="w-full p-2.5 bg-gradient-to-r from-emerald-950/80 to-teal-950/80 hover:from-emerald-900 hover:to-teal-900 border border-emerald-500/50 rounded-xl text-emerald-200 flex items-center justify-between transition-all cursor-pointer text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">📲</span>
                  <span className="font-bold">{language === 'hindi' ? 'Android APK / App इंस्टॉल करें' : 'Install Android App (.APK / PWA)'}</span>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded font-mono">
                  FREE
                </span>
              </a>

              {/* YouTube Channel Link */}
              <a
                href="https://youtube.com/@hanscompain"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsHeaderMenuOpen(false)}
                className="w-full p-2.5 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 rounded-xl text-rose-300 flex items-center justify-between transition-all cursor-pointer text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">🔴</span>
                  <span className="font-bold">{language === 'hindi' ? 'युट्यूब चैनल (YouTube Official)' : 'Official YouTube Channel'}</span>
                </div>
                <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded border border-rose-500/30 font-mono">
                  Subscribe 🔔
                </span>
              </a>

              {/* Instagram Page Link */}
              <a
                href="https://instagram.com/hans.compain"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsHeaderMenuOpen(false)}
                className="w-full p-2.5 bg-fuchsia-950/40 hover:bg-fuchsia-900/60 border border-fuchsia-500/40 rounded-xl text-fuchsia-300 flex items-center justify-between transition-all cursor-pointer text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">📸</span>
                  <span className="font-bold">{language === 'hindi' ? 'इन्स्टाग्राम पेज (Instagram)' : 'Official Instagram Page'}</span>
                </div>
                <span className="text-[10px] bg-fuchsia-500/20 text-fuchsia-300 px-1.5 py-0.5 rounded border border-fuchsia-500/30 font-mono">
                  Follow ✨
                </span>
              </a>

              {/* App Share Button */}
              <button
                onClick={() => { setIsShareModalOpen(true); setIsHeaderMenuOpen(false); }}
                className="w-full p-2.5 bg-slate-900 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/40 rounded-xl text-cyan-300 flex items-center justify-between transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-cyan-300 shrink-0" />
                  <span>{language === 'hindi' ? 'ऐप दोस्तों के साथ शेयर करें' : 'Share HANS COMPAIN App'}</span>
                </div>
                <span className="text-[10px] opacity-70">Share →</span>
              </button>
            </div>`;

if (code.includes(targetSection)) {
  code = code.replace(targetSection, newSection);
  fs.writeFileSync('src/App.tsx', code);
  console.log("Settings menu updated with General & Social links!");
} else {
  console.log("Target section not found in App.tsx!");
}
