const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `<div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 hover:bg-slate-800/80 rounded-xl transition-all cursor-pointer"
            title="Open terminal sidebar"
          >
            <Menu className="w-5 h-5 text-indigo-400" />
          </button>`;

const replacement = `<div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => {
              setFeedbackInitialContext('HansAI Main Platform & App');
              setIsFiveStarFeedbackOpen(true);
            }}
            className="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-500 hover:text-amber-400 rounded-xl text-[10px] sm:text-xs font-extrabold flex items-center justify-center transition-all cursor-pointer shadow-sm shrink-0"
            title="Give 5-Star Feedback"
          >
            <span className="hidden sm:inline">⭐ Feedback</span>
            <span className="sm:hidden">⭐ Feed</span>
          </button>
          
          <button
            onClick={() => setIsFeedbackOpen(true)}
            className="px-2.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-500 hover:text-emerald-400 rounded-xl text-[10px] sm:text-xs font-extrabold flex items-center justify-center transition-all cursor-pointer shadow-sm shrink-0"
            title="Write a User Review"
          >
            <span className="hidden sm:inline">📝 User Review</span>
            <span className="sm:hidden">📝 Review</span>
          </button>`;

if (code.includes('setSidebarOpen(true)')) {
    code = code.replace(target, replacement);
    fs.writeFileSync('src/App.tsx', code);
    console.log("Successfully replaced hamburger with feedback and review buttons!");
} else {
    console.log("Target not found");
}
