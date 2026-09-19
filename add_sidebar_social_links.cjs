const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetDrawerStr = `{/* Creator & Academic Hub Drawer Toggles */}`;

const newSocialSection = `{/* 🌐 OFFICIAL SOCIAL MEDIA & APP DOWNLOAD COMMUNITY LINKS */}
                  <div className="space-y-2 pt-2 border-t border-slate-850">
                    <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-wider px-1 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <span>📲</span>
                        <span>{language === 'hindi' ? "एप डाउनलोड व सोशल कम्युनिटी" : "App & Official Community"}</span>
                      </span>
                      <span className="text-[9px] bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 px-1.5 py-0.2 rounded">Official</span>
                    </span>

                    <div className="grid grid-cols-2 gap-1.5">
                      {/* APK Download Button */}
                      <button
                        onClick={() => {
                          showToast(language === 'hindi' ? "📥 HANS COMPAIN .APK डाउनलोड शुरू हो रहा है..." : "📥 Downloading HANS COMPAIN .APK...", "info");
                          const link = document.createElement('a');
                          link.href = '#';
                          link.download = 'HansCompain_v3.2.apk';
                          // Simulating direct PWA / APK install trigger
                          showToast(language === 'hindi' ? "✅ ऐप इन्स्टॉल करने के लिए 'Add to Home Screen' या PWA विकल्प चुनें!" : "✅ Tap 'Add to Home Screen' to install app on Mobile!", "success");
                        }}
                        className="p-2 bg-gradient-to-r from-emerald-950/90 to-teal-950/90 hover:from-emerald-900 hover:to-teal-900 border border-emerald-500/40 text-emerald-300 rounded-xl text-[11px] font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
                      >
                        <span className="text-xs">📲</span>
                        <span>{language === 'hindi' ? "APK डाउनलोड" : "Download APK"}</span>
                      </button>

                      {/* WhatsApp / Telegram Channel */}
                      <a
                        href="https://whatsapp.com"
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 bg-gradient-to-r from-green-950/90 to-emerald-950/90 hover:from-green-900 hover:to-emerald-900 border border-green-500/40 text-green-300 rounded-xl text-[11px] font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95 no-underline"
                      >
                        <span className="text-xs">💬</span>
                        <span>{language === 'hindi' ? "व्हाट्सएप ग्रुप" : "WhatsApp Group"}</span>
                      </a>

                      {/* YouTube Official Channel */}
                      <a
                        href="https://youtube.com"
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 bg-gradient-to-r from-rose-950/90 to-red-950/90 hover:from-rose-900 hover:to-red-900 border border-rose-500/40 text-rose-300 rounded-xl text-[11px] font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95 no-underline"
                      >
                        <span className="text-xs">📺</span>
                        <span>{language === 'hindi' ? "यूट्यूब चैनल" : "YouTube Channel"}</span>
                      </a>

                      {/* Share App +50 Coins Button */}
                      <button
                        onClick={() => {
                          const currentCoins = parseInt(localStorage.getItem('hansai-user-coins') || '350', 10);
                          const newCoins = currentCoins + 50;
                          localStorage.setItem('hansai-user-coins', newCoins.toString());
                          if (navigator.share) {
                            navigator.share({
                              title: 'HANS COMPAIN - Shorthand & Study App',
                              text: '🚀 HANS COMPAIN ऐप से अपनी आशुलिपि (Stenography) व बोर्ड परीक्षा की तैयारी करें!',
                              url: window.location.href,
                            }).catch(() => {});
                          } else {
                            navigator.clipboard.writeText(window.location.href);
                          }
                          showToast(language === 'hindi' ? `🎉 ऐप शेयर किया गया! +50 हंस कॉइंस मिले! (कुल: 🪙 ${newCoins})` : `🎉 Shared! +50 Hans Coins added!`, 'success');
                        }}
                        className="p-2 bg-gradient-to-r from-amber-950/90 to-yellow-950/90 hover:from-amber-900 hover:to-yellow-900 border border-amber-500/40 text-amber-300 rounded-xl text-[11px] font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
                      >
                        <span className="text-xs">🪙</span>
                        <span>{language === 'hindi' ? "शेयर (+50 Coins)" : "Share (+50 Coins)"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Creator & Academic Hub Drawer Toggles */}`;

if (code.includes(targetDrawerStr) && !code.includes('OFFICIAL SOCIAL MEDIA & APP DOWNLOAD')) {
  code = code.replace(targetDrawerStr, newSocialSection);
  console.log("Successfully added Official Community Links & Share App section to Sidebar!");
}

fs.writeFileSync('src/App.tsx', code);
console.log("App.tsx updated!");
