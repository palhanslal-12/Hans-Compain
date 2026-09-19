const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `{/* Public AI Rules Modal Button */}`;

const newSidebarSettingsBtn = `{/* ⚙️ SIDEBAR PROMINENT APP SETTINGS & CLASS GOAL BUTTON */}
                  <button
                    onClick={() => {
                      setIsHeaderMenuOpen(true);
                      if (window.innerWidth < 1024) setSidebarOpen(false);
                    }}
                    className="w-full py-2.5 px-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 border border-cyan-400/50 text-white rounded-xl text-xs font-black flex items-center justify-between transition-all shadow-md cursor-pointer active:scale-98"
                  >
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4 text-amber-300 animate-spin-slow" />
                      <span>{language === 'hindi' ? "⚙️ एप सेटिंग्स व क्लास/बोर्ड बदलें" : "⚙️ App Settings & Class Goal"}</span>
                    </div>
                    <span className="text-[9px] bg-white/20 text-white font-mono px-1.5 py-0.5 rounded">⚙️</span>
                  </button>

                  {/* Public AI Rules Modal Button */}`;

if (code.includes(targetStr) && !code.includes('SIDEBAR PROMINENT APP SETTINGS')) {
  code = code.replace(targetStr, newSidebarSettingsBtn);
  console.log("Added prominent Settings button into Left Sidebar!");
}

fs.writeFileSync('src/App.tsx', code);
console.log("Updated App.tsx!");
