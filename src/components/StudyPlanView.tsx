import React, { useState } from 'react';
import { Target, Calendar, Clock, BookOpen, CheckCircle, Download, Sparkles, AlertCircle } from 'lucide-react';

interface StudyPlanProps {
  user: { name: string; email: string } | null;
  onExportPdf: (title: string, elementId: string) => void;
  showToast: (msg: string, type?: 'info' | 'success' | 'warn') => void;
}

export const StudyPlanView: React.FC<StudyPlanProps> = ({ user, onExportPdf, showToast }) => {
  const [goal, setGoal] = useState("SSC CGL / Stenographer 2026");
  const [days, setDays] = useState(30);
  const [weakAreas, setWeakAreas] = useState("Maths Speed, Error Spotting in English, Shorthand Strokes");
  const [dailyHours, setDailyHours] = useState(4);
  const [isGenerating, setIsGenerating] = useState(false);
  const [planResult, setPlanResult] = useState<any | null>(null);

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const res = await fetch("/api/study-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal,
          days,
          weakAreas,
          dailyHours
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Study plan generation failed");
      setPlanResult(data.plan);
      showToast("Personalized AI Study Plan generated! 🎯", "success");
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Failed to generate study plan.", "warn");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#03060E] text-slate-100 min-h-full">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-indigo-900/60 via-purple-900/50 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-extrabold text-xs uppercase tracking-wider mb-1">
              <Target className="w-4 h-4" />
              <span>HansAI Smart Academic Engine</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              AI Study Plan & Roadmap Generator / अध्ययन रोडमैप
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Get a customized day-by-day preparation schedule tailored to your target exam, available hours, and weak areas.
            </p>
          </div>
          <div className="text-right sm:text-right font-mono text-[11px] text-indigo-300 bg-indigo-950/60 p-2.5 rounded-xl border border-indigo-800/40">
            <div>User: {user?.name || 'Aspirant'}</div>
            <div className="text-emerald-400 font-bold">Status: Active AI Guidance</div>
          </div>
        </div>

        {/* Form Controls */}
        <form onSubmit={handleGeneratePlan} className="bg-[#0A0E1A] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-indigo-400" />
                Target Exam / परीक्षा लक्ष्य
              </label>
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. SSC CGL Tier 1, BPSC, SSC Stenographer"
                className="w-full text-xs p-3 bg-[#03060E] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                Timeline (Days) / समयावधि (दिन)
              </label>
              <select
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full text-xs p-3 bg-[#03060E] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              >
                <option value={7}>7 Days (Rapid Crash Course)</option>
                <option value={15}>15 Days (High-Yield Sprint)</option>
                <option value={30}>30 Days (Complete Syllabus Review)</option>
                <option value={60}>60 Days (Comprehensive Mastery)</option>
                <option value={90}>90 Days (Zero to Hero Foundation)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                Weak Areas & Focus Subjects / कमजोर विषय
              </label>
              <input
                type="text"
                value={weakAreas}
                onChange={(e) => setWeakAreas(e.target.value)}
                placeholder="e.g. Geometry, Prepositions, Shorthand Strokes"
                className="w-full text-xs p-3 bg-[#03060E] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                Daily Available Hours / दैनिक समय (घंटे)
              </label>
              <select
                value={dailyHours}
                onChange={(e) => setDailyHours(Number(e.target.value))}
                className="w-full text-xs p-3 bg-[#03060E] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              >
                <option value={2}>2 Hours / day (Part-time aspirants)</option>
                <option value={4}>4 Hours / day (Standard preparation)</option>
                <option value={6}>6 Hours / day (Dedicated full-time)</option>
                <option value={8}>8+ Hours / day (Intensive exam mode)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer border-none disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                <span>Crafting Personalized AI Study Schedule...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate Smart Study Roadmap / रोडमैप बनाएं</span>
              </>
            )}
          </button>
        </form>

        {/* Study Plan Output */}
        {planResult && (
          <div id="study-plan-export-container" className="bg-[#0A0E1A] border border-indigo-500/30 rounded-2xl p-5 sm:p-6 space-y-6 shadow-xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-black text-white">{planResult.title || goal}</h2>
                <p className="text-xs text-indigo-300 mt-0.5">Target: {days} Days | {dailyHours} Hours/day</p>
              </div>
              <button
                onClick={() => onExportPdf(`${planResult.title || goal} - Study Plan`, 'study-plan-export-container')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-300 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>
            </div>

            {/* Overview & Key Strategy */}
            <div className="bg-[#03060E] border border-slate-800 rounded-xl p-4 text-xs text-slate-300 space-y-2">
              <div className="font-extrabold text-indigo-400 text-sm">💡 AI Executive Strategy Overview</div>
              <p>{planResult.overview || planResult.strategy}</p>
            </div>

            {/* Weekly / Phase Breakdown */}
            {planResult.weeklyPhases && planResult.weeklyPhases.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  Phase Breakdown & Weekly Milestones
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {planResult.weeklyPhases.map((phase: any, idx: number) => (
                    <div key={idx} className="bg-[#03060E] border border-slate-800 rounded-xl p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-amber-300">{phase.phaseName || `Week ${idx + 1}`}</span>
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md font-mono">{phase.duration || 'Days 1-7'}</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-200">{phase.focusTopic}</p>
                      <ul className="text-[11px] text-slate-400 space-y-1 list-disc pl-4">
                        {phase.dailyTasks && phase.dailyTasks.map((task: string, tIdx: number) => (
                          <li key={tIdx}>{task}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Daily Schedule Allocation */}
            {planResult.dailyTimeBlocks && (
              <div className="space-y-3">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  Optimal Daily Hour Allocation
                </h3>
                <div className="bg-[#03060E] border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
                  {planResult.dailyTimeBlocks.map((block: any, bIdx: number) => (
                    <div key={bIdx} className="flex items-center justify-between border-b border-slate-850/60 pb-1.5 last:border-none">
                      <span className="font-bold text-slate-300">{block.slotName || `Slot ${bIdx + 1}`}</span>
                      <span className="text-indigo-300 font-mono">{block.duration}</span>
                      <span className="text-slate-400">{block.activity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* High Yield Tips */}
            {planResult.highYieldTips && (
              <div className="bg-amber-500/10 border border-amber-500/25 rounded-xl p-4 space-y-2 text-xs">
                <div className="font-extrabold text-amber-300 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" />
                  Aspirant Golden Rules for Exam Success
                </div>
                <ul className="list-disc pl-4 space-y-1 text-slate-300">
                  {planResult.highYieldTips.map((tip: string, tpIdx: number) => (
                    <li key={tpIdx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
