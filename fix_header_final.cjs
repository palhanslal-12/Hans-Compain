const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// We will find the entire <header> ... </header> and replace it.
const regex = /<header className=\{\`px-3 sm:px-6[\s\S]*?<\/header>/m;

const newHeader = `<header className={\`px-2 sm:px-6 h-14 sm:h-16 border-b flex items-center justify-between sticky top-0 z-40 backdrop-blur-md w-full max-w-full overflow-hidden \${
        screenColorMode === 'dark' ? 'bg-[#03060E]/90 border-slate-900' :
        screenColorMode === 'warm_yellow' ? 'bg-[#FAF6E9]/90 border-amber-900/10' :
        screenColorMode === 'eco_gray' ? 'bg-[#F1F3F5]/90 border-slate-200' :
        'bg-[#03132B]/90 border-cyan-500/30'
      }\`}>
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Replaced Hamburger with Feedback & Review */}
          <button
            onClick={() => {
              setFeedbackInitialContext('HansAI Main Platform & App');
              setIsFiveStarFeedbackOpen(true);
            }}
            className="flex px-1.5 sm:px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-500 hover:text-amber-400 rounded-xl text-[10px] sm:text-xs font-extrabold items-center justify-center transition-all cursor-pointer shadow-sm shrink-0"
            title="Give 5-Star Feedback"
          >
            <span className="hidden sm:inline">⭐ Feedback</span>
            <span className="sm:hidden">⭐</span>
          </button>
          
          <button
            onClick={() => setIsFeedbackOpen(true)}
            className="flex px-1.5 sm:px-2.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-500 hover:text-emerald-400 rounded-xl text-[10px] sm:text-xs font-extrabold items-center justify-center transition-all cursor-pointer shadow-sm shrink-0"
            title="Write a User Review"
          >
            <span className="hidden sm:inline">📝 User Review</span>
            <span className="sm:hidden">📝</span>
          </button>
          
          {/* Back Arrow Button (Visible in sub-views OR active chat) */}
          {(activeView !== 'chat' || chatMessages.length > 0) && (
            <button
              onClick={() => {
                if (activeView === 'chat') {
                  startNewChat();
                } else {
                  setActiveView('chat');
                }
              }}
              className="p-1.5 sm:p-2 bg-sky-500/20 hover:bg-sky-500/35 border border-sky-400/40 text-sky-200 hover:text-white rounded-xl text-xs font-extrabold flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95 shrink-0"
              title={activeView === 'chat' ? "Back to Homepage" : "Return to Workspace"}
            >
              <ArrowLeft className="w-4 h-4 text-sky-300" />
            </button>
          )}
          
          <div className="flex items-center gap-1 sm:gap-2 cursor-pointer" onClick={() => { setActiveView('chat'); startNewChat(); }}>
            <HansCompainLogo size="sm" showSubtitle={true} />
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* 🔔 LIVE NOTIFICATION CENTER BELL BUTTON IN HEADER */}
          <button
            onClick={() => setIsNotificationCenterOpen(true)}
            className="relative p-1.5 sm:p-2 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/40 hover:border-amber-400/60 rounded-xl text-amber-300 transition-all cursor-pointer shadow-md flex items-center justify-center group shrink-0"
            title="सूचना व अपडेट केंद्र (Notification & Updates Center)"
          >
            <Bell className="w-4 h-4 text-amber-300 group-hover:animate-bounce" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-rose-500 text-white text-[8px] sm:text-[9px] font-black rounded-full flex items-center justify-center shadow-lg border border-[#0A0F1D] animate-pulse">
              3
            </span>
          </button>

          {/* Quick Daily Streak Indicator in Header */}
          <DailyStreakIndicator 
            variant="badge" 
            language={language} 
            onNavigateToView={(view) => setActiveView(view)} 
          />

          {/* 🎯 Quick Board / Exam Goal Pill Button */}
          <button
            onClick={() => setIsOnboardingModalOpen(true)}
            className="hidden sm:flex px-2 sm:px-2.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-[10px] sm:text-xs font-black shadow-md items-center gap-1.5 cursor-pointer transition-all border border-blue-400/30 shrink-0"
            title="क्लिक करके अपना बोर्ड या प्रतियोगी परीक्षा लक्ष्य बदलें"
          >
            <span>🎯</span>
            <span className="max-w-[80px] sm:max-w-[120px] truncate">
              {studentGoalProfile?.stream === 'board' 
                ? \`\${studentGoalProfile.boardDetails?.classGrade || '10th'} • \${studentGoalProfile.boardDetails?.boardName || 'Board'}\`
                : studentGoalProfile?.competitiveDetails?.examName || 'Target Exam'}
            </span>
          </button>

          {/* Quick Return to Chat button if inside sub-view */}
          {activeView !== 'chat' && (
            <button
              onClick={() => setActiveView('chat')}
              className="px-2 py-1.5 bg-indigo-650 hover:bg-indigo-600 rounded-xl text-[10px] font-extrabold text-white flex items-center gap-1 transition-all cursor-pointer shadow-md shrink-0"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Home Chat</span>
            </button>
          )}

          {/* Main Quick Options / Settings Button (Restored to original small discreet style but with Settings icon) */}
          <button
            onClick={() => setIsHeaderMenuOpen(!isHeaderMenuOpen)}
            className="p-1 px-1.5 text-xs text-slate-500 hover:text-slate-200 hover:bg-slate-800/40 rounded-lg transition-all cursor-pointer bg-transparent border-none opacity-60 hover:opacity-100 flex items-center justify-center shrink-0"
            title="Header Options & Theme Switcher"
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* User Avatar */}
          {user && (
            <button
              onClick={() => setIsUserProfileModalOpen(true)}
              className="hidden sm:block cursor-pointer hover:opacity-80 transition-opacity border-none bg-transparent p-0 relative group shrink-0"
              title="Edit Profile"
            >
              <img 
                src={user.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"} 
                alt={user.name} 
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-indigo-500/40 shadow-sm object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <User className="w-3.5 h-3.5 text-white" />
              </div>
            </button>
          )}
        </div>
      </header>`;

if (code.match(regex)) {
    code = code.replace(regex, newHeader);
    fs.writeFileSync('src/App.tsx', code);
    console.log("Successfully fixed header layout!");
} else {
    console.log("Header NOT FOUND in the file!");
}
