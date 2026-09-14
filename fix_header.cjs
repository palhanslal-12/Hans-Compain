const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const replacement = `<DailyStreakIndicator 
            variant="badge" 
            language={language} 
            onNavigateToView={(view) => setActiveView(view)} 
          />

          {/* 🎯 Quick Board / Exam Goal Pill Button */}
          <button
            onClick={() => setIsOnboardingModalOpen(true)}
            className="hidden md:flex px-2.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black shadow-md items-center gap-1.5 cursor-pointer transition-all border border-blue-400/30 shrink-0"
            title="क्लिक करके अपना बोर्ड या प्रतियोगी परीक्षा लक्ष्य बदलें"
          >
            <span>🎯</span>
            <span className="max-w-[100px] truncate">
              {studentGoalProfile?.stream === 'board' 
                ? \`\${studentGoalProfile.boardDetails?.classGrade || '10th'} • \${studentGoalProfile.boardDetails?.boardName || 'Board'}\`
                : studentGoalProfile?.competitiveDetails?.examName || 'Target Exam'}
            </span>
          </button>`;

code = code.replace(/<DailyStreakIndicator[\s\S]*?\/>/, replacement);
fs.writeFileSync('src/App.tsx', code);
console.log("Replaced!");
