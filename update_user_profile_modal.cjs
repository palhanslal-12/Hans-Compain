const fs = require('fs');

let code = fs.readFileSync('src/components/UserProfileModal.tsx', 'utf8');

// Check if Coins Dashboard is already added
if (!code.includes('Hans Coins & Student Rewards Dashboard')) {
  // Add Hans Coins state & Share App function
  const targetHeader = `export const UserProfileModal: React.FC<UserProfileModalProps> = ({`;
  
  const coinLogic = `export const UserProfileModal: React.FC<UserProfileModalProps> = ({`;

  // Insert Coins Dashboard in Modal Body
  const targetModalBody = `{/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">`;

  const newCoinsBanner = `{/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
          
          {/* 🪙 USER DASHBOARD & GAMIFICATION COINS CARD */}
          <div className="bg-gradient-to-r from-amber-950/80 via-indigo-950/90 to-slate-900 border-2 border-amber-500/50 rounded-2xl p-4 shadow-xl text-white space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-amber-500/30 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xl">🪙</span>
                <div>
                  <h4 className="text-sm font-black text-amber-300">
                    {language === 'hindi' ? 'हंस कॉइंस व रिवॉर्ड्स डैशबोर्ड' : 'Hans Coins & Rewards Dashboard'}
                  </h4>
                  <p className="text-[10px] text-amber-200/80">
                    {language === 'hindi' ? 'अध्ययन प्रदर्शन व क्विज़ जीतने पर प्राप्त कॉइंस' : 'Coins earned from quizzes, streak & study tests'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-amber-300 font-mono tracking-tight flex items-center gap-1 justify-end">
                  <span>🪙</span>
                  <span>{localStorage.getItem('hansai-user-coins') || '350'}</span>
                </span>
                <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold uppercase">
                  {language === 'hindi' ? 'गोल्ड स्टूडेंट' : 'Gold Scholar'}
                </span>
              </div>
            </div>

            {/* Badges Row */}
            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="bg-[#080D1A]/80 border border-indigo-500/30 rounded-xl p-2">
                <div className="text-base">⚡ 5 Days</div>
                <div className="text-[10px] text-indigo-300 font-bold">{language === 'hindi' ? 'अध्ययन स्ट्राइक' : 'Study Streak'}</div>
              </div>
              <div className="bg-[#080D1A]/80 border border-emerald-500/30 rounded-xl p-2">
                <div className="text-base">🏆 Rank #4</div>
                <div className="text-[10px] text-emerald-300 font-bold">{language === 'hindi' ? 'लाइव लीडरबोर्ड' : 'Live Leaderboard'}</div>
              </div>
              <div className="bg-[#080D1A]/80 border border-amber-500/30 rounded-xl p-2">
                <div className="text-base">✍️ Steno Pro</div>
                <div className="text-[10px] text-amber-300 font-bold">{language === 'hindi' ? 'बैज प्राप्त' : 'Unlocked Badge'}</div>
              </div>
            </div>

            {/* Share App & Earn Coins Button */}
            <button
              type="button"
              onClick={() => {
                const currentCoins = parseInt(localStorage.getItem('hansai-user-coins') || '350', 10);
                const newCoins = currentCoins + 50;
                localStorage.setItem('hansai-user-coins', newCoins.toString());
                if (navigator.share) {
                  navigator.share({
                    title: 'HANS COMPAIN - Stenography & Exam Preparation App',
                    text: '📚 HANS COMPAIN ऐप से अपनी बोर्ड परीक्षा व आशुलिपि (Stenography) की तैयारी शुरू करें! 🚀',
                    url: window.location.href,
                  }).catch(() => {});
                } else {
                  navigator.clipboard.writeText(window.location.href);
                }
                showToast(
                  language === 'hindi' 
                    ? `🎉 ऐप शेयर किया गया! +50 हंस कॉइंस जुड़े! (कुल: 🪙 ${newCoins})` 
                    : `🎉 App Shared! +50 Hans Coins added! (Total: 🪙 ${newCoins})`,
                  'success'
                );
              }}
              className="w-full py-2 px-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer active:scale-95 border-none"
            >
              <span>📲</span>
              <span>{language === 'hindi' ? 'दोस्तों को ऐप शेयर करें (+50 हंस कॉइंस पायें 🎉)' : 'Share App with Friends (+50 Coins 🎉)'}</span>
            </button>
          </div>`;

  code = code.replace(targetModalBody, newCoinsBanner);
  fs.writeFileSync('src/components/UserProfileModal.tsx', code);
  console.log("Successfully updated UserProfileModal.tsx with Coins & Badges Dashboard!");
} else {
  console.log("UserProfileModal already has Coins Dashboard.");
}
