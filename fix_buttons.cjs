const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target1 = `className="hidden lg:flex px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-500 hover:text-amber-400 rounded-xl text-xs font-extrabold items-center justify-center transition-all cursor-pointer shadow-sm shrink-0"`;
const replacement1 = `className="flex px-1.5 sm:px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-500 hover:text-amber-400 rounded-xl text-[10px] sm:text-xs font-extrabold items-center justify-center transition-all cursor-pointer shadow-sm shrink-0"`;

const target1Span = `<span>⭐ Feedback</span>`;
const replacement1Span = `<span className="hidden sm:inline">⭐ Feedback</span><span className="sm:hidden">⭐</span>`;

const target2 = `className="hidden lg:flex px-2.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-500 hover:text-emerald-400 rounded-xl text-xs font-extrabold items-center justify-center transition-all cursor-pointer shadow-sm shrink-0"`;
const replacement2 = `className="flex px-1.5 sm:px-2.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-500 hover:text-emerald-400 rounded-xl text-[10px] sm:text-xs font-extrabold items-center justify-center transition-all cursor-pointer shadow-sm shrink-0"`;

const target2Span = `<span>📝 User Review</span>`;
const replacement2Span = `<span className="hidden sm:inline">📝 User Review</span><span className="sm:hidden">📝</span>`;

code = code.replace(target1, replacement1);
code = code.replace(target1Span, replacement1Span);
code = code.replace(target2, replacement2);
code = code.replace(target2Span, replacement2Span);

fs.writeFileSync('src/App.tsx', code);
console.log("Updated buttons for mobile visibility");
