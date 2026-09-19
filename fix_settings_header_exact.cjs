const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Replace the Header Right Actions section so ⚙️ Settings is ALWAYS prominent on top right
const oldHeaderRight = `{/* Header Right Actions */}
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

          {/* 🎯 Quick Board / Exam Goal Pill */}
          <button
            onClick={() => setIsOnboardingModalOpen(true)}
            className="hidden lg:flex px-2 sm:px-2.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-[10px] sm:text-xs font-black shadow-md items-center gap-1.5 cursor-pointer transition-all border border-blue-400/30 shrink-0"
            title="क्लिक करके अपना बोर्ड या प्रतियोगी परीक्षा लक्ष्य बदलें"
          >
            <span>🎯</span>
            <span className="max-w-[100px] truncate">
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

          {/* ⚙️ PROMINENT APP SETTINGS BUTTON */}
          <button
            onClick={() => setIsHeaderMenuOpen(!isHeaderMenuOpen)}
            className="p-1.5 sm:px-2.5 sm:py-1.5 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-600/80 hover:border-indigo-400 text-slate-200 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shrink-0"
            title="एप सेटिंग्स व थीम (App Settings & Themes)"
          >
            <Settings className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">Settings</span>
          </button>`;

const newHeaderRight = `{/* Header Right Actions */}
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

if (code.includes(oldHeaderRight)) {
  code = code.replace(oldHeaderRight, newHeaderRight);
  console.log("Updated header right actions to place ⚙️ Settings prominently at top right!");
} else {
  console.log("oldHeaderRight not matched, searching alternate match");
}

// 2. Insert Class/Section/Exam Selector at the top of Settings Dropdown Menu
const settingsHeaderTitle = `<h3 className="text-xs font-extrabold text-white flex items-center gap-1.5">
                <span>⚙️</span>
                <span>HANS COMPAIN Settings & Tools</span>
              </h3>`;

const settingsHeaderTitleNew = `<h3 className="text-xs font-extrabold text-white flex items-center gap-1.5">
                <span>⚙️</span>
                <span>HANS COMPAIN Settings & Tools</span>
              </h3>`;

const classSelectionOption = `
          {/* 🎯 SELECT CLASS / SECTION / EXAM TARGET OPTION INSIDE SETTINGS */}
          <div className="space-y-1.5 p-2.5 bg-gradient-to-r from-blue-950/80 to-indigo-950/80 border border-blue-500/50 rounded-xl">
            <span className="text-[10px] font-black uppercase text-blue-300 tracking-wider block">
              🎯 {language === 'hindi' ? 'कक्षा, सेक्शन व परीक्षा चुनें:' : 'Select Class, Section & Target Exam:'}
            </span>
            <button
              onClick={() => {
                setIsOnboardingModalOpen(true);
                setIsHeaderMenuOpen(false);
              }}
              className="w-full p-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold rounded-xl text-xs flex items-center justify-between shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">🎯</span>
                <span className="text-xs font-black">
                  {studentGoalProfile?.stream === 'board' 
                    ? \`कक्षा: \${studentGoalProfile.boardDetails?.classGrade || '10th/12th'} (\${studentGoalProfile.boardDetails?.boardName || 'Board'})\`
                    : \`लक्ष्य: \${studentGoalProfile?.competitiveDetails?.examName || 'Steno / Board / Railway'}\`}
                </span>
              </div>
              <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-lg font-mono font-black">
                {language === 'hindi' ? 'बदलें ✏️' : 'Change ✏️'}
              </span>
            </button>
          </div>`;

const themeSectionStart = `{/* 5 Theme Color Selectors (Featuring Blue-Green Light as Requested) */}`;

if (code.includes(themeSectionStart) && !code.includes('🎯 SELECT CLASS / SECTION / EXAM TARGET OPTION INSIDE SETTINGS')) {
  code = code.replace(themeSectionStart, `${classSelectionOption}\n\n          ${themeSectionStart}`);
  console.log("Added Class / Section / Exam target selection inside Settings dropdown!");
} else {
  console.log("themeSectionStart not matched or option already present");
}

fs.writeFileSync('src/App.tsx', code);
console.log("App.tsx file updated successfully!");
