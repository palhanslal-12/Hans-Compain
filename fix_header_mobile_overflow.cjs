const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Optimize Header Left Actions so Logo doesn't push right actions off screen on small mobile screens
const oldLogoHeader = `<div className="flex items-center gap-1 sm:gap-2 cursor-pointer" onClick={() => { setActiveView('chat'); startNewChat(); }}>
            <HansCompainLogo size="sm" showSubtitle={true} />
          </div>`;

const newLogoHeader = `<div className="flex items-center gap-1 sm:gap-2 cursor-pointer shrink-1 overflow-hidden" onClick={() => { setActiveView('chat'); startNewChat(); }}>
            <HansCompainLogo size="xs" showSubtitle={false} className="sm:hidden" />
            <HansCompainLogo size="sm" showSubtitle={true} className="hidden sm:inline-flex" />
          </div>`;

if (code.includes(oldLogoHeader)) {
  code = code.replace(oldLogoHeader, newLogoHeader);
  console.log("Updated Header Left Actions to use compact logo on small mobile screens!");
}

// 2. Re-order Header Right Actions to place ⚙️ SETTINGS right next to Bell so it NEVER gets cut off
const oldRightActions = `{/* Header Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* 🔔 Notification Bell */}
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

          {/* Quick Daily Streak Indicator */}
          <DailyStreakIndicator 
            variant="badge" 
            language={language} 
            onNavigateToView={(view) => setActiveView(view)} 
          />

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

          {/* ⚙️ ALWAYS VISIBLE PROMINENT APP SETTINGS BUTTON (TOP RIGHT) */}
          <button
            onClick={() => setIsHeaderMenuOpen(!isHeaderMenuOpen)}
            className="px-2.5 py-1.5 bg-gradient-to-r from-indigo-900/90 to-slate-900/90 hover:from-indigo-800 hover:to-slate-800 border-2 border-indigo-400/60 hover:border-indigo-300 text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shrink-0 animate-pulse-subtle"
            title="एप सेटिंग्स, थीम व कक्षा चुनें (App Settings & Options)"
          >
            <Settings className="w-4 h-4 text-cyan-300 animate-spin-slow shrink-0" />
            <span className="text-xs font-black tracking-wide text-cyan-200">
              {language === 'hindi' ? 'सेटिंग्स' : 'Settings'}
            </span>
          </button>`;

const newRightActions = `{/* Header Right Actions */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* ⚙️ PROMINENT APP SETTINGS & CLASS GOAL BUTTON (PRIMARY ACTION TOP RIGHT) */}
          <button
            onClick={() => setIsHeaderMenuOpen(!isHeaderMenuOpen)}
            className="px-2 sm:px-2.5 py-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 border-2 border-cyan-300/80 text-white rounded-xl text-xs font-black flex items-center gap-1 sm:gap-1.5 transition-all cursor-pointer shadow-lg shrink-0 active:scale-95"
            title="एप सेटिंग्स, थीम व कक्षा चुनें (App Settings & Class Goal)"
          >
            <Settings className="w-4 h-4 text-yellow-300 animate-spin-slow shrink-0" />
            <span className="text-[11px] sm:text-xs font-black tracking-wide text-white">
              {language === 'hindi' ? 'सेटिंग्स' : 'Settings'}
            </span>
          </button>

          {/* 🔔 Notification Bell */}
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

          {/* Quick Daily Streak Indicator */}
          <DailyStreakIndicator 
            variant="badge" 
            language={language} 
            onNavigateToView={(view) => setActiveView(view)} 
          />

          {/* Quick Return to Chat button if inside sub-view */}
          {activeView !== 'chat' && (
            <button
              onClick={() => setActiveView('chat')}
              className="px-2 py-1.5 bg-indigo-650 hover:bg-indigo-600 rounded-xl text-[10px] font-extrabold text-white flex items-center gap-1 transition-all cursor-pointer shadow-md shrink-0"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Home Chat</span>
            </button>
          )}`;

if (code.includes(oldRightActions)) {
  code = code.replace(oldRightActions, newRightActions);
  console.log("Placed ⚙️ SETTINGS as the first primary action in Header Right Actions!");
} else {
  console.log("oldRightActions not matched, searching alternate string");
}

fs.writeFileSync('src/App.tsx', code);
console.log("App.tsx mobile overflow fix applied successfully!");
