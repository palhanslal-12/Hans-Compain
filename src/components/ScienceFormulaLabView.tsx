import React, { useState } from 'react';
import { 
  Zap, Compass, Activity, Play, RotateCcw, Sparkles, BookOpen, 
  HelpCircle, CheckCircle2, Sliders, RefreshCw, Calculator, Flame, Award, Volume2, ArrowRight
} from 'lucide-react';
import { speakText, stopAllSpeech } from '../utils/speechUtils';

interface ScienceFormulaLabViewProps {
  showToast: (msg: string, type: 'success' | 'error' | 'info' | 'warn') => void;
  language: 'hindi' | 'english';
}

export const ScienceFormulaLabView: React.FC<ScienceFormulaLabViewProps> = ({ showToast, language }) => {
  const [activeTab, setActiveTab] = useState<'circuits' | 'optics' | 'pendulum' | 'trig' | 'finance' | 'custom-solver'>('circuits');

  // Lab 1: Ohm's Law States
  const [voltage, setVoltage] = useState<number>(12); // V
  const [resistance, setResistance] = useState<number>(10); // Ohms
  
  const current = (voltage / resistance).toFixed(2); // I = V / R
  const power = (voltage * (voltage / resistance)).toFixed(2); // P = V * I

  // Lab 2: Optics Lens States
  const [focalLength, setFocalLength] = useState<number>(20); // f in cm
  const [objectDistance, setObjectDistance] = useState<number>(40); // u in cm
  
  // Lens Formula: 1/f = 1/v - 1/u => 1/v = 1/f + 1/u => v = (f * u) / (u + f)
  // Note u is negative in sign convention: u = -objectDistance
  const uSign = -objectDistance;
  const vCalculated = (focalLength * uSign) / (uSign + focalLength);
  const vDisplay = isFinite(vCalculated) ? vCalculated.toFixed(1) : '∞';
  const magnification = isFinite(vCalculated) ? (vCalculated / uSign).toFixed(2) : '∞';

  // Lab 3: Pendulum States
  const [pendulumLength, setPendulumLength] = useState<number>(1.0); // L in meters
  const [gravity, setGravity] = useState<number>(9.8); // g in m/s^2
  
  const timePeriod = (2 * Math.PI * Math.sqrt(pendulumLength / gravity)).toFixed(2); // T = 2 * pi * sqrt(L/g)
  const frequency = (1 / parseFloat(timePeriod)).toFixed(2);

  // Lab 4: Trigonometry States
  const [angleDeg, setAngleDeg] = useState<number>(45);
  const angleRad = (angleDeg * Math.PI) / 180;
  const sinVal = Math.sin(angleRad).toFixed(3);
  const cosVal = Math.cos(angleRad).toFixed(3);
  const tanVal = Math.cos(angleRad) !== 0 ? Math.tan(angleRad).toFixed(3) : 'Undefined';

  // Lab 5: Compound Interest States
  const [principal, setPrincipal] = useState<number>(10000);
  const [rate, setRate] = useState<number>(8); // % per annum
  const [years, setYears] = useState<number>(5);
  
  const simpleInterestAmount = principal + (principal * rate * years) / 100;
  const compoundInterestAmount = principal * Math.pow(1 + rate / 100, years);
  const compoundProfit = compoundInterestAmount - principal;

  // Custom AI Formula Solver States
  const [customFormulaQuery, setCustomFormulaQuery] = useState('');
  const [isSolving, setIsSolving] = useState(false);
  const [solverResult, setSolverResult] = useState<string | null>(null);

  const handleSolveCustomFormula = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = customFormulaQuery.trim();
    if (!query) return;

    setIsSolving(true);
    setSolverResult(null);
    showToast(
      language === 'hindi' ? `🔬 "${query}" का हल व सूत्र चरणबद्ध तैयार हो रहा है...` : `🔬 Solving formula for "${query}"...`,
      'info'
    );

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Provide step-by-step formula solution, substitution, variables explanation, unit analysis and exam tip for: "${query}". Format clearly with bullet points.`,
          systemInstruction: `You are HansAI Physics & Science Master. Explain formulas with step-by-step calculation, SI units, and student exam shortcuts in Hindi & English.`
        })
      });

      if (res.ok) {
        const data = await res.json();
        setSolverResult(data.reply || 'Calculation completed.');
        showToast(language === 'hindi' ? '✅ हल तैयार है!' : '✅ Solution generated!', 'success');
      }
    } catch (err) {
      showToast('Could not solve formula. Please try again.', 'error');
    } finally {
      setIsSolving(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-3 sm:p-6 text-slate-100 space-y-6 animate-fade-in text-left">
      
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-cyan-950/90 via-slate-900 to-indigo-950 border-2 border-cyan-500/40 p-5 rounded-3xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-xl shadow-cyan-500/10 shrink-0">
            <Zap className="w-8 h-8 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-black uppercase tracking-widest border border-cyan-500/30">
                INTERACTIVE SCIENCE & FORMULA LAB
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-1">
              {language === 'hindi' ? '🔬 इंटरएक्टिव साइंस व फॉर्मूला प्लेग्राउंड' : '🔬 Interactive Science & Formula Playground'}
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              {language === 'hindi'
                ? 'फिजिक्स, गणित, केमिस्ट्री व अर्थशास्त्र के फॉर्मूलों को केवल रटें नहीं — स्लाइडर चलाएं और लाइव विजुअल सिमुलेशन में समझें!'
                : 'Interact with Physics circuits, Optics lenses, Pendulums, Trigonometry & Finance with live visual simulations!'}
            </p>
          </div>
        </div>
      </div>

      {/* LAB SELECTOR TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'circuits', label: '⚡ Electric Circuit (Ohm\'s Law)', icon: '⚡' },
          { id: 'optics', label: '🔭 Lens & Mirror Optics', icon: '🔭' },
          { id: 'pendulum', label: '🕰️ Simple Pendulum', icon: '🕰️' },
          { id: 'trig', label: '📐 Trigonometry & Unit Circle', icon: '📐' },
          { id: 'finance', label: '💰 Compound Interest Growth', icon: '💰' },
          { id: 'custom-solver', label: '🤖 AI Formula Solver', icon: '🤖' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all border cursor-pointer shrink-0 flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 border-cyan-300 shadow-xl scale-105'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-850'
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* LAB VIEW 1: ELECTRIC CIRCUITS & OHM'S LAW */}
      {activeTab === 'circuits' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* SLIDERS & CONTROLS (5 COLS) */}
          <div className="lg:col-span-5 bg-[#090D16] border border-slate-800 p-6 rounded-3xl space-y-6 shadow-xl">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider">Ohm\'s Law Formula: V = I × R</span>
              <h2 className="text-base font-extrabold text-white mt-1">विद्युत परिपथ एवं ओम का नियम</h2>
            </div>

            {/* Voltage Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">Voltage (V):</span>
                <span className="text-cyan-400 font-mono text-sm">{voltage} Volts</span>
              </div>
              <input
                type="range"
                min="1"
                max="24"
                step="1"
                value={voltage}
                onChange={(e) => setVoltage(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Resistance Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">Resistance (R):</span>
                <span className="text-amber-400 font-mono text-sm">{resistance} Ω (Ohms)</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                step="1"
                value={resistance}
                onChange={(e) => setResistance(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            {/* CALCULATION RESULTS */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-400 block">Current (I = V/R)</span>
                <span className="text-lg font-black text-emerald-400 font-mono">{current} A</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-400 block">Power (P = V × I)</span>
                <span className="text-lg font-black text-yellow-400 font-mono">{power} W</span>
              </div>
            </div>

            <div className="p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl text-xs text-cyan-200 leading-relaxed font-medium">
              💡 <strong>परीक्षा तथ्य:</strong> यदि वोल्टेज स्थिर रहे और प्रतिरोध (R) दोगुना कर दिया जाए, तो धारा (I) आधी हो जाएगी।
            </div>
          </div>

          {/* LIVE SIMULATION CANVAS (7 COLS) */}
          <div className="lg:col-span-7 bg-[#060A12] border-2 border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-4 text-center">
            <span className="text-xs font-black text-cyan-400 uppercase tracking-widest block">
              ⚡ LIVE CIRCUIT SIMULATION
            </span>

            <svg viewBox="0 0 400 240" className="w-full h-[260px] bg-[#090D16] rounded-2xl border border-slate-800 shadow-inner">
              {/* Circuit Wires */}
              <rect x="50" y="40" width="300" height="160" fill="none" stroke="#334155" strokeWidth="4" rx="12" />

              {/* Battery Symbol */}
              <g transform="translate(45, 120)">
                <line x1="0" y1="-20" x2="0" y2="20" stroke="#06B6D4" strokeWidth="6" />
                <line x1="10" y1="-10" x2="10" y2="10" stroke="#06B6D4" strokeWidth="3" />
                <text x="-25" y="4" fill="#06B6D4" fontSize="10" fontWeight="bold">+ {voltage}V -</text>
              </g>

              {/* Resistor Symbol */}
              <g transform="translate(200, 40)">
                <rect x="-30" y="-12" width="60" height="24" fill="#1E293B" stroke="#F59E0B" strokeWidth="3" rx="4" />
                <text x="0" y="4" fill="#F59E0B" fontSize="10" fontWeight="bold" textAnchor="middle">{resistance} Ω</text>
              </g>

              {/* Bulb Glow Symbol */}
              <g transform="translate(350, 120)">
                <circle cx="0" cy="0" r="18" fill={parseFloat(power) > 50 ? '#FBBF24' : '#78350F'} stroke="#F59E0B" strokeWidth="2" className="transition-all" />
                <text x="0" y="4" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">{power}W</text>
              </g>

              {/* Electron Particles Animation */}
              <circle cx="200" cy="200" r="4" fill="#10B981" className="animate-ping" />
            </svg>

            <div className="flex justify-between items-center text-xs font-bold text-slate-300 px-2">
              <span>इलेक्ट्रॉन प्रवाह की गति धारा (I = {current}A) पर निर्भर करती है।</span>
            </div>
          </div>

        </div>
      )}

      {/* LAB VIEW 2: OPTICS LENS & MIRRORS */}
      {activeTab === 'optics' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 bg-[#090D16] border border-slate-800 p-6 rounded-3xl space-y-6 shadow-xl">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider">Lens Formula: 1/f = 1/v - 1/u</span>
              <h2 className="text-base font-extrabold text-white mt-1">उत्तल लेंस प्रकाशिकी (Convex Lens Optics)</h2>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">Focal Length (f):</span>
                <span className="text-cyan-400 font-mono text-sm">{focalLength} cm</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                step="1"
                value={focalLength}
                onChange={(e) => setFocalLength(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">Object Distance (u):</span>
                <span className="text-amber-400 font-mono text-sm">-{objectDistance} cm</span>
              </div>
              <input
                type="range"
                min="15"
                max="100"
                step="1"
                value={objectDistance}
                onChange={(e) => setObjectDistance(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-400 block">Image Dist (v)</span>
                <span className="text-base font-black text-emerald-400 font-mono">{vDisplay} cm</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-400 block">Magnification (m = v/u)</span>
                <span className="text-base font-black text-yellow-400 font-mono">{magnification}x</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#060A12] border-2 border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-4 text-center">
            <span className="text-xs font-black text-cyan-400 uppercase tracking-widest block">
              🔭 OPTICS RAY DIAGRAM
            </span>

            <svg viewBox="0 0 400 200" className="w-full h-[240px] bg-[#090D16] rounded-2xl border border-slate-800">
              {/* Principal Axis */}
              <line x1="10" y1="100" x2="390" y2="100" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />
              
              {/* Convex Lens */}
              <ellipse cx="200" cy="100" rx="10" ry="70" fill="rgba(6, 182, 212, 0.2)" stroke="#06B6D4" strokeWidth="2" />
              
              {/* Object Arrow */}
              <line x1={200 - objectDistance * 1.5} y1="100" x2={200 - objectDistance * 1.5} y2="50" stroke="#F59E0B" strokeWidth="4" />
              <polygon points={`${200 - objectDistance * 1.5},42 ${200 - objectDistance * 1.5 - 5},52 ${200 - objectDistance * 1.5 + 5},52`} fill="#F59E0B" />

              {/* Focus points F1, F2 */}
              <circle cx={200 - focalLength * 1.5} cy="100" r="3" fill="#06B6D4" />
              <text x={200 - focalLength * 1.5} y="115" fill="#06B6D4" fontSize="8" textAnchor="middle">F1</text>
              <circle cx={200 + focalLength * 1.5} cy="100" r="3" fill="#06B6D4" />
              <text x={200 + focalLength * 1.5} y="115" fill="#06B6D4" fontSize="8" textAnchor="middle">F2</text>
            </svg>
          </div>
        </div>
      )}

      {/* LAB VIEW 3: SIMPLE PENDULUM */}
      {activeTab === 'pendulum' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 bg-[#090D16] border border-slate-800 p-6 rounded-3xl space-y-6 shadow-xl">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider">Formula: T = 2π √(L/g)</span>
              <h2 className="text-base font-extrabold text-white mt-1">सरल लोलक (Simple Pendulum Period)</h2>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">Length of String (L):</span>
                <span className="text-cyan-400 font-mono text-sm">{pendulumLength} meters</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="5.0"
                step="0.1"
                value={pendulumLength}
                onChange={(e) => setPendulumLength(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">Gravity (g):</span>
                <span className="text-amber-400 font-mono text-sm">{gravity} m/s²</span>
              </div>
              <input
                type="range"
                min="1.6"
                max="24.8"
                step="0.1"
                value={gravity}
                onChange={(e) => setGravity(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-400 block">Time Period (T)</span>
                <span className="text-lg font-black text-emerald-400 font-mono">{timePeriod} sec</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-400 block">Frequency (f = 1/T)</span>
                <span className="text-lg font-black text-yellow-400 font-mono">{frequency} Hz</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#060A12] border-2 border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-4 text-center">
            <span className="text-xs font-black text-cyan-400 uppercase tracking-widest block">
              🕰️ SWINGING PENDULUM SIMULATION
            </span>

            <svg viewBox="0 0 300 220" className="w-full h-[240px] bg-[#090D16] rounded-2xl border border-slate-800">
              <line x1="150" y1="20" x2="150" y2={30 + pendulumLength * 30} stroke="#38BDF8" strokeWidth="3" className="animate-pulse" />
              <circle cx="150" cy={30 + pendulumLength * 30} r="16" fill="#F59E0B" stroke="#FBBF24" strokeWidth="3" />
            </svg>
          </div>
        </div>
      )}

      {/* LAB VIEW 4: TRIGONOMETRY */}
      {activeTab === 'trig' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 bg-[#090D16] border border-slate-800 p-6 rounded-3xl space-y-6 shadow-xl">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider">sin²θ + cos²θ = 1</span>
              <h2 className="text-base font-extrabold text-white mt-1">त्रिकोणमिति व इकाई वृत्त (Unit Circle)</h2>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">Angle (θ):</span>
                <span className="text-cyan-400 font-mono text-sm">{angleDeg}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                step="1"
                value={angleDeg}
                onChange={(e) => setAngleDeg(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-2xl text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-400 block">sin(θ)</span>
                <span className="text-sm font-black text-emerald-400 font-mono">{sinVal}</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-2xl text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-400 block">cos(θ)</span>
                <span className="text-sm font-black text-cyan-400 font-mono">{cosVal}</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-2xl text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-400 block">tan(θ)</span>
                <span className="text-sm font-black text-yellow-400 font-mono">{tanVal}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#060A12] border-2 border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-4 text-center">
            <span className="text-xs font-black text-cyan-400 uppercase tracking-widest block">
              📐 UNIT CIRCLE VISUALIZER
            </span>

            <svg viewBox="0 0 240 240" className="w-full h-[240px] bg-[#090D16] rounded-2xl border border-slate-800">
              <circle cx="120" cy="120" r="80" fill="none" stroke="#334155" strokeWidth="2" />
              <line x1="20" y1="120" x2="220" y2="120" stroke="#475569" strokeWidth="1" />
              <line x1="120" y1="20" x2="120" y2="220" stroke="#475569" strokeWidth="1" />
              
              {/* Angle Vector */}
              <line x1="120" y1="120" x2={120 + 80 * Math.cos(angleRad)} y2={120 - 80 * Math.sin(angleRad)} stroke="#06B6D4" strokeWidth="3" />
            </svg>
          </div>
        </div>
      )}

      {/* LAB VIEW 5: FINANCE & COMPOUND INTEREST */}
      {activeTab === 'finance' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 bg-[#090D16] border border-slate-800 p-6 rounded-3xl space-y-6 shadow-xl">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider">A = P(1 + r/100)^t</span>
              <h2 className="text-base font-extrabold text-white mt-1">चक्रवृद्धि ब्याज प्रयोगशाला (Compound Interest)</h2>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">Principal (मूलधन):</span>
                <span className="text-cyan-400 font-mono text-sm">₹{principal.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="100000"
                step="1000"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">Rate (ब्याज दर):</span>
                <span className="text-amber-400 font-mono text-sm">{rate}% p.a.</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                step="0.5"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">Time (समय):</span>
                <span className="text-emerald-400 font-mono text-sm">{years} Years</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                step="1"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#060A12] border-2 border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-4 text-center">
            <span className="text-xs font-black text-cyan-400 uppercase tracking-widest block">
              💰 GROWTH COMPARISON (SI VS CI)
            </span>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-400 block">Simple Interest Total</span>
                <span className="text-lg font-black text-cyan-400 font-mono">₹{Math.round(simpleInterestAmount).toLocaleString()}</span>
              </div>
              <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-center space-y-1">
                <span className="text-[10px] font-bold text-emerald-300 block">Compound Interest Total</span>
                <span className="text-lg font-black text-emerald-400 font-mono">₹{Math.round(compoundInterestAmount).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LAB VIEW 6: AI CUSTOM FORMULA SOLVER */}
      {activeTab === 'custom-solver' && (
        <div className="bg-[#090D16] border-2 border-cyan-500/40 rounded-3xl p-6 space-y-5 shadow-2xl">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider">AI FORMULA SOLVER</span>
            <h2 className="text-lg font-extrabold text-white mt-1">कोई भी भौतिकी/गणित/केमिस्ट्री फॉर्मूला व न्यूमेरिकल हल करें</h2>
          </div>

          <form onSubmit={handleSolveCustomFormula} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={customFormulaQuery}
              onChange={(e) => setCustomFormulaQuery(e.target.value)}
              placeholder="उदाहरण: Kinetic energy of 5kg mass at 10m/s, pH of 0.01M HCl, Derivative of x^3 + 4x..."
              className="flex-1 px-4 py-3 bg-[#060A12] border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-medium"
            />
            <button
              type="submit"
              disabled={isSolving || !customFormulaQuery.trim()}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-40"
            >
              {isSolving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Calculator className="w-4 h-4" />}
              <span>{isSolving ? 'Solving...' : 'Solve Step-by-Step'}</span>
            </button>
          </form>

          {solverResult && (
            <div className="p-5 bg-[#060A12] border border-slate-800 rounded-2xl space-y-2 animate-fade-in">
              <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest block">STEP-BY-STEP SOLUTION</span>
              <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed whitespace-pre-line">
                {solverResult}
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
