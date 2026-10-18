import React, { useState, useEffect } from 'react';
import { X, Search, Sparkles, BookOpen, Volume2, CheckCircle2, Play, Pause, RotateCcw, Clock, Zap } from 'lucide-react';
import { playNaturalSpeech, stopNaturalSpeech } from '../utils/naturalSpeech';

interface FormulaVaultViewProps {
  isOpen: boolean;
  onClose: () => void;
}

interface VaultItem {
  id: string;
  category: 'math' | 'science' | 'english' | 'steno';
  title: string;
  content: string;
  formulaOrRule: string;
  trickOrTip: string;
}

const vaultData: VaultItem[] = [
  // Math
  {
    id: 'm1',
    category: 'math',
    title: 'समांतर श्रेढ़ी (AP) n-वां पद व योग',
    content: 'प्रथम पद a, सार्व अंतर d होने पर n-वां पद और n पदों का योगफल।',
    formulaOrRule: 'an = a + (n-1)d  |  Sn = n/2 [2a + (n-1)d]',
    trickOrTip: 'बोर्ड परीक्षा में एन-थ टर्म और सम ऑफ एन टर्म्स पर सीधा 2 या 5 नंबर का न्यूमेरिकल आता है।'
  },
  {
    id: 'm2',
    category: 'math',
    title: 'द्विघात समीकरण (Quadratic Equation)',
    content: 'श्री धराचार्य सूत्र (Quadratic Formula) और मूलों की प्रकृति (Discriminant)।',
    formulaOrRule: 'x = [-b ± √(b² - 4ac)] / 2a  |  D = b² - 4ac',
    trickOrTip: 'यदि D > 0 तो दो भिन्न वास्तविक मूल, D = 0 तो समान मूल, D < 0 तो कोई वास्तविक मूल नहीं।'
  },
  {
    id: 'm3',
    category: 'math',
    title: 'त्रिकोणमिति सर्वसमिकाएं (Trigonometry)',
    content: 'कक्षा 10वीं और 12वीं की सबसे महत्वपूर्ण त्रिकोणमितीय पहचानें।',
    formulaOrRule: 'sin²θ + cos²θ = 1  |  1 + tan²θ = sec²θ  |  1 + cot²θ = cosec²θ',
    trickOrTip: 'सिद्ध करने वाले प्रश्नों (Prove that) में हमेशा LHS को RHS या दोनों को sin/cos में तोड़े।'
  },

  // Science
  {
    id: 's1',
    category: 'science',
    title: 'गोलीय दर्पण सूत्र और आवर्धन (Mirror Formula)',
    content: 'फोकस दूरी f, वस्तु दूरी u और प्रतिबिंब दूरी v में संबंध।',
    formulaOrRule: '1/f = 1/v + 1/u  |  आवर्धन (m) = -v / u = h₂ / h₁',
    trickOrTip: 'अवतल दर्पण में f और u दोनों ऋणात्मक होते हैं, उत्तल दर्पण में f और r धनात्मक होते हैं।'
  },
  {
    id: 's2',
    category: 'science',
    title: 'ओम का नियम व विद्युत शक्ति (Ohm’s Law & Power)',
    content: 'विभवांतर V, धारा I और प्रतिरोध R का संबंध।',
    formulaOrRule: 'V = IR  |  P = VI = I²R = V² / R',
    trickOrTip: 'श्रेणी क्रम में R = R₁ + R₂ + R₃ और समांतर क्रम में 1/R = 1/R₁ + 1/R₂ होता है।'
  },
  {
    id: 's3',
    category: 'science',
    title: 'रासायनिक अभिक्रियाओं के प्रकार',
    content: 'संयोजन, वियोजन, विस्थापन, द्वि-विस्थापन और उपचयन-अपचयन।',
    formulaOrRule: 'CaO + H₂O → Ca(OH)₂ (ऊष्माक्षेपी)  |  Fe + CuSO₄ → FeSO₄ + Cu (विस्थापन)',
    trickOrTip: 'ऑक्सीकरण (उपचयन) में ऑक्सीजन का जुड़ना या इलेक्ट्रॉन का त्याग होता है।'
  },

  // English Grammar
  {
    id: 'e1',
    category: 'english',
    title: 'Active & Passive Voice (Rules)',
    content: 'ऑब्जेक्ट को सब्जेक्ट बनाना और verb की 3rd form का प्रयोग।',
    formulaOrRule: 'Present Indefinite: is/am/are + V₃  |  Past Indefinite: was/were + V₃  |  Continuous: being + V₃',
    trickOrTip: 'पैसिव वॉइस में हमेशा मुख्य क्रिया की थर्ड फॉर्म (V₃) ही आती है, चाहे टेंस कोई भी हो।'
  },
  {
    id: 'e2',
    category: 'english',
    title: 'Direct & Indirect Speech (Narration)',
    content: 'Reporting verb past tense होने पर अंदर के टेंस में परिवर्तन।',
    formulaOrRule: 'Present Simple → Past Simple  |  Present Cont. → Past Cont.  |  Can → Could, Shall → Should',
    trickOrTip: 'प्रश्नवाचक वाक्य (Interrogative) में that नहीं लगाते बल्कि if / whether या wh-word का प्रयोग होता है।'
  },

  // Steno
  {
    id: 'st1',
    category: 'steno',
    title: 'ऋषि प्रणाली आशुलिपि - व्यंजन रेखाएं',
    content: 'अधोमुखी (Downward) और उर्ध्वगामी (Upward) व्यंजन कोण।',
    formulaOrRule: 'P, B, T, D, CH, J = अधोमुखी (60°-90°)  |  R, H, W, Y = उर्ध्वगामी',
    trickOrTip: '80 से 100 WPM गति प्राप्त करने के लिए आउटलाइन बिना पेन उठाए संक्षिप्त (Brief) बनाएं।'
  }
];

export const FormulaVaultView: React.FC<FormulaVaultViewProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'vault' | 'pomodoro'>('vault');
  const [activeCategory, setActiveCategory] = useState<'all' | 'math' | 'science' | 'english' | 'steno'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Pomodoro Timer State
  const [pomodoroMinutes, setPomodoroMinutes] = useState(25);
  const [pomodoroSeconds, setPomodoroSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState<'study' | 'break'>('study');
  const [completedSessions, setCompletedSessions] = useState(0);

  useEffect(() => {
    let timer: any = null;
    if (isTimerRunning) {
      timer = setInterval(() => {
        if (pomodoroSeconds > 0) {
          setPomodoroSeconds(prev => prev - 1);
        } else if (pomodoroMinutes > 0) {
          setPomodoroMinutes(prev => prev - 1);
          setPomodoroSeconds(59);
        } else {
          // Timer finished
          setIsTimerRunning(false);
          if (timerMode === 'study') {
            setCompletedSessions(prev => prev + 1);
            setTimerMode('break');
            setPomodoroMinutes(5);
            setPomodoroSeconds(0);
            playNaturalSpeech('शानदार पढ़ाई! 25 मिनट का सत्र पूरा हुआ। अब 5 मिनट का छोटा ब्रेक लें।');
          } else {
            setTimerMode('study');
            setPomodoroMinutes(25);
            setPomodoroSeconds(0);
            playNaturalSpeech('ब्रेक समाप्त! आइए फिर से अपनी परीक्षा की तैयारी शुरू करें।');
          }
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, pomodoroMinutes, pomodoroSeconds, timerMode]);

  if (!isOpen) return null;

  const filteredVault = vaultData.filter(item => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchesQuery = !q || item.title.toLowerCase().includes(q) || item.formulaOrRule.toLowerCase().includes(q) || item.trickOrTip.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-[#091122] border-2 border-cyan-500/40 rounded-3xl p-5 sm:p-7 max-w-3xl w-full space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar text-white">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-2xl shrink-0">
              ⚡
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                पॉकेट फॉर्मूला डायरी और फोकस टाइमर (Pocket Vault & Focus)
              </h3>
              <p className="text-[11px] text-slate-400">
                Hans Compain — परीक्षा साथी द्वारा संकलित 1-क्लिक फॉर्मूले, ग्रामर नियम व पोमोडोरो टाइमर।
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-950 border border-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-850">
          <button
            onClick={() => setActiveTab('vault')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'vault' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>📚</span>
            <span>फॉर्मूले व शॉर्टकट डायरी (Pocket Vault)</span>
          </button>
          <button
            onClick={() => setActiveTab('pomodoro')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'pomodoro' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>⏱️</span>
            <span>स्मार्ट पोमोडोरो फोकस टाइमर (Focus Timer)</span>
          </button>
        </div>

        {activeTab === 'vault' ? (
          <div className="space-y-4">
            {/* Search & Category Filter */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="फॉर्मूला, नियम या टॉपिक खोजें (उदा. AP, Mirror, Voice)..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {[
                  { id: 'all', label: 'सभी' },
                  { id: 'math', label: 'गणित' },
                  { id: 'science', label: 'विज्ञान' },
                  { id: 'english', label: 'अंग्रेजी' },
                  { id: 'steno', label: 'स्टेनो' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id as any)}
                    className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold cursor-pointer whitespace-nowrap transition-all ${
                      activeCategory === cat.id ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black' : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Vault Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto custom-scrollbar p-1">
              {filteredVault.map(item => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-[#0B132B] border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between space-y-3 group shadow-md"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        {item.category.toUpperCase()}
                      </span>
                      <button
                        onClick={() => playNaturalSpeech(`${item.title}. सूत्र या नियम है: ${item.formulaOrRule}. परीक्षा टिप: ${item.trickOrTip}`)}
                        className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
                        title="भारी आवाज़ में सुनें"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                      </button>
                    </div>
                    <h4 className="text-xs sm:text-sm font-black text-white group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {item.content}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-850 font-mono text-[11px] text-amber-300 font-bold overflow-x-auto">
                      {item.formulaOrRule}
                    </div>
                    <div className="text-[10px] text-emerald-400 flex items-start gap-1.5">
                      <span className="shrink-0">💡</span>
                      <span>{item.trickOrTip}</span>
                    </div>
                  </div>
                </div>
              ))}
              {filteredVault.length === 0 && (
                <div className="col-span-2 py-12 text-center text-slate-500 text-xs">
                  कोई फॉर्मूला या नियम नहीं मिला। कृपया दूसरा कीवर्ड सर्च करें।
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Pomodoro Timer View */
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#03060E] via-[#091122] to-[#0A162B] border border-slate-800 flex flex-col items-center justify-center text-center space-y-6 shadow-2xl">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest font-mono font-bold text-cyan-400">
                {timerMode === 'study' ? '🔥 परीक्षा फोकस सत्र (Study Session)' : '☕ रिलैक्सेशन ब्रेक (Relaxation Break)'}
              </span>
              <div className="text-5xl sm:text-7xl font-black font-mono text-white tracking-wider drop-shadow-[0_0_20px_rgba(0,210,255,0.4)]">
                {String(pomodoroMinutes).padStart(2, '0')}:{String(pomodoroSeconds).padStart(2, '0')}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`px-6 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-lg transition-all ${
                  isTimerRunning ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isTimerRunning ? 'टाइमर रोकें (Pause)' : 'फोकस शुरू करें (Start Study)'}</span>
              </button>

              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerMode('study');
                  setPomodoroMinutes(25);
                  setPomodoroSeconds(0);
                }}
                className="px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>रीसेट</span>
              </button>
            </div>

            <div className="flex items-center gap-6 text-xs text-slate-400 pt-2 border-t border-slate-800/80 w-full justify-center">
              <div>पूरे किए गए सत्र: <span className="font-bold text-emerald-400">{completedSessions}</span></div>
              <div>लक्ष्य: <span className="font-bold text-cyan-300">4 सत्र / दिन</span></div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default FormulaVaultView;
