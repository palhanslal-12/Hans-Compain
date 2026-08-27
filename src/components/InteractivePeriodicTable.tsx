import React, { useState, useMemo } from 'react';
import { 
  Atom, Search, Sparkles, Volume2, VolumeX, Info, BookOpen, 
  HelpCircle, Eye, Zap, Flame, Droplets, Wind, ShieldCheck,
  Award, CheckCircle2, ChevronRight, X, ArrowRight, Layers,
  Compass, Radio, RefreshCw
} from 'lucide-react';
import { 
  ElementData, 
  PERIODIC_TABLE_ELEMENTS, 
  ALL_118_ELEMENTS_SUMMARY, 
  CATEGORY_COLORS, 
  PERIODIC_MNEMONICS,
  getFullElementData 
} from '../data/periodicTableData';
import { speakText, stopAllSpeech } from '../utils/speechUtils';

interface InteractivePeriodicTableProps {
  language: 'hindi' | 'english';
  showToast: (msg: string, type: 'success' | 'error' | 'info' | 'warn') => void;
}

export const InteractivePeriodicTable: React.FC<InteractivePeriodicTableProps> = ({ language, showToast }) => {
  const isHindi = language === 'hindi';

  // Filters & State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBlock, setSelectedBlock] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedElementNumber, setSelectedElementNumber] = useState<number>(6); // Default Carbon (C)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMnemonics, setShowMnemonics] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Selected element full object
  const activeElement = useMemo(() => {
    return getFullElementData(selectedElementNumber);
  }, [selectedElementNumber]);

  // Audio handler
  const handleSpeakElement = (element: ElementData) => {
    if (isPlayingAudio) {
      stopAllSpeech();
      setIsPlayingAudio(false);
      return;
    }

    const narration = isHindi
      ? `तत्व ${element.hindiName}, रासायनिक प्रतीक ${element.symbol}, परमाणु क्रमांक ${element.number}। ` +
        `यह ${CATEGORY_COLORS[element.category]?.hindiLabel || element.category} श्रेणी का तत्व है। ` +
        `इसका परमाणु भार ${element.mass} और इलेक्ट्रॉनिक विन्यास ${element.electronConfig} है। ` +
        `उपयोग: ${element.usesHindi} ` +
        (element.examHighlightHindi ? `परीक्षा विशेष: ${element.examHighlightHindi}` : '')
      : `Element ${element.name}, symbol ${element.symbol}, atomic number ${element.number}. ` +
        `It belongs to the ${element.category} group with an atomic mass of ${element.mass} and electron configuration ${element.electronConfig}. ` +
        `Key applications: ${element.usesEnglish}`;

    setIsPlayingAudio(true);
    speakText(narration, {
      lang: isHindi ? 'hi-IN' : 'en-US',
      onEnd: () => {
        setIsPlayingAudio(false);
      }
    });
  };

  // 18 Groups and 7 Periods Layout Engine
  const mainGridElements = useMemo(() => {
    // Return standard 18x7 grid matrix
    // Lanthanides (57-71) & Actinides (89-103) are placed in separate bottom rows
    const grid: ({ number: number; symbol: string; name: string; hindiName: string; mass: number | string; category: ElementData['category']; period: number; group: number; block: 's' | 'p' | 'd' | 'f' } | null)[][] = Array(7).fill(null).map(() => Array(18).fill(null));

    ALL_118_ELEMENTS_SUMMARY.forEach(el => {
      // Check if it belongs in main grid
      if (el.number >= 57 && el.number <= 71) {
        // Lanthanide - placeholder at period 6, group 3 (row 5, col 2)
        if (el.number === 57) {
          grid[5][2] = {
            number: 57,
            symbol: '57-71',
            name: 'Lanthanides',
            hindiName: 'लैन्थेनाइड',
            mass: 'La-Lu',
            category: 'lanthanide',
            period: 6,
            group: 3,
            block: 'f'
          };
        }
      } else if (el.number >= 89 && el.number <= 103) {
        // Actinide - placeholder at period 7, group 3 (row 6, col 2)
        if (el.number === 89) {
          grid[6][2] = {
            number: 89,
            symbol: '89-103',
            name: 'Actinides',
            hindiName: 'एक्टिनाइड',
            mass: 'Ac-Lr',
            category: 'actinide',
            period: 7,
            group: 3,
            block: 'f'
          };
        }
      } else {
        const rowIndex = el.period - 1;
        const colIndex = el.group - 1;
        if (rowIndex >= 0 && rowIndex < 7 && colIndex >= 0 && colIndex < 18) {
          grid[rowIndex][colIndex] = el;
        }
      }
    });

    return grid;
  }, []);

  // Separate rows for f-block (Lanthanides & Actinides)
  const lanthanideRow = useMemo(() => {
    return ALL_118_ELEMENTS_SUMMARY.filter(el => el.number >= 57 && el.number <= 71);
  }, []);

  const actinideRow = useMemo(() => {
    return ALL_118_ELEMENTS_SUMMARY.filter(el => el.number >= 89 && el.number <= 103);
  }, []);

  // Check matching search or filter
  const isElementHighlighted = (num: number, symbol: string, name: string, hindiName: string, cat: string, block: string) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchNum = num.toString() === q;
      const matchSym = symbol.toLowerCase().includes(q);
      const matchName = name.toLowerCase().includes(q);
      const matchHindi = hindiName.includes(q);
      if (!matchNum && !matchSym && !matchName && !matchHindi) return false;
    }
    if (selectedCategory !== 'all' && cat !== selectedCategory) return false;
    if (selectedBlock !== 'all' && block !== selectedBlock) return false;
    return true;
  };

  return (
    <div className="space-y-6">
      {/* HEADER & TOP CONTROLS */}
      <div className="bg-[#090D16] border border-cyan-500/30 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5">
                <Atom className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                MODERN PERIODIC TABLE 2026 (मोजले आधुनिक आवर्त सारणी)
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                118 Elements • 18 Groups • 7 Periods
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {isHindi ? 'इंटरएक्टिव रासायनिक आवर्त सारणी' : 'Interactive Chemical Elements Periodic Table'}
            </h1>
            <p className="text-xs text-slate-300">
              {isHindi 
                ? 'किसी भी तत्व पर क्लिक करके उसका 3D बोहर मॉडल, इलेक्ट्रॉनिक विन्यास, उपयोग, व प्रतियोगी परीक्षा ट्रिक्स देखें।'
                : 'Click any element to inspect its live Bohr model, electron configuration, oxidation states, real-world uses, and exam mnemonics.'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowMnemonics(!showMnemonics)}
              className={`px-3.5 py-2 rounded-2xl border text-xs font-black flex items-center gap-2 cursor-pointer transition-all ${
                showMnemonics 
                  ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-lg shadow-amber-500/30'
                  : 'bg-slate-900 text-amber-300 border-amber-500/40 hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{isHindi ? '⚡ याद करने की जादुई ट्रिक्स (Mnemonics)' : '⚡ Exam Mnemonics'}</span>
            </button>

            <button
              onClick={() => {
                setSelectedElementNumber(Math.floor(Math.random() * 118) + 1);
                showToast(isHindi ? 'यादृच्छिक तत्व चुना गया!' : 'Random element selected!', 'info');
              }}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-2xl text-xs font-bold text-slate-200 flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isHindi ? 'रैंडम तत्व' : 'Random Element'}</span>
            </button>
          </div>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mt-4 pt-4 border-t border-slate-800/80 items-center">
          {/* Search Input */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={isHindi ? 'खोजें: सोना, Au, 79, Carbon, Fe...' : 'Search: Gold, Au, 79, Carbon, Fe...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-slate-950/80 border border-slate-700 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Block Selector */}
          <div className="md:col-span-4 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-[11px] font-bold text-slate-400 shrink-0">Block:</span>
            {['all', 's', 'p', 'd', 'f'].map(b => (
              <button
                key={b}
                onClick={() => setSelectedBlock(b)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer border shrink-0 ${
                  selectedBlock === b
                    ? 'bg-cyan-500 text-slate-950 border-cyan-300 font-black shadow-sm'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {b === 'all' ? 'All' : `${b}-block`}
              </button>
            ))}
          </div>

          {/* Category Filter Dropdown */}
          <div className="md:col-span-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-2xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="all">{isHindi ? 'सभी श्रेणियां (All 10 Categories)' : 'All Chemical Categories'}</option>
              <option value="alkali-metal">🔴 क्षार धातु (Alkali Metals - Group 1)</option>
              <option value="alkaline-earth">🟠 क्षारीय मृदा धातु (Alkaline Earth - Group 2)</option>
              <option value="transition-metal">🔵 संक्रमण धातु (Transition Metals d-block)</option>
              <option value="post-transition">🟢 उत्तर-संक्रमण धातु (Post-Transition Metals)</option>
              <option value="metalloid">❇️ उपधातु (Metalloids / Semimetals)</option>
              <option value="reactive-nonmetal">🔷 क्रियाशील अधातु (Reactive Non-metals)</option>
              <option value="halogen">🟡 हैलोजन लवण उत्पादक (Halogens - Group 17)</option>
              <option value="noble-gas">🟣 अक्रिय/उत्कृष्ट गैसें (Noble Gases - Group 18)</option>
              <option value="lanthanide">🌸 लैन्थेनाइड (Lanthanides 4f)</option>
              <option value="actinide">🟧 एक्टिनाइड (Actinides 5f Radioactive)</option>
            </select>
          </div>
        </div>

        {/* CATEGORY LEGEND CHIPS */}
        <div className="flex items-center gap-2 overflow-x-auto pt-3 pb-1 scrollbar-none">
          {Object.entries(CATEGORY_COLORS).map(([key, value]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(selectedCategory === key ? 'all' : key)}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                selectedCategory === key
                  ? `${value.badge} font-black scale-105 shadow-md`
                  : 'bg-slate-950/60 text-slate-400 border-slate-800/80 hover:text-slate-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${value.bg.split(' ')[0]}`} />
              <span>{isHindi ? value.hindiLabel : value.enLabel}</span>
            </button>
          ))}
        </div>
      </div>

      {/* EXAM MNEMONICS ACCORDION */}
      {showMnemonics && (
        <div className="bg-[#0A101D] border-2 border-amber-500/40 rounded-3xl p-5 shadow-2xl space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
            <span className="text-xs font-black uppercase text-amber-300 tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              {isHindi ? 'आवर्त सारणी याद करने की जादुई ट्रिक्स (Exam Mnemonics for SSC/UPSC/NEET/JEE)' : 'Periodic Table Memory Mnemonics'}
            </span>
            <button 
              onClick={() => setShowMnemonics(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {PERIODIC_MNEMONICS.map((item, idx) => (
              <div key={idx} className="bg-slate-950 p-3.5 rounded-2xl border border-amber-500/30 space-y-2">
                <span className="text-[11px] font-black text-amber-300 block">{item.titleHindi}</span>
                <div className="p-2 bg-amber-950/30 rounded-xl border border-amber-500/20 text-xs font-bold text-amber-200">
                  💡 "{item.mnemonic}"
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {item.importance}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MAIN PERIODIC TABLE GRID (18 COLUMNS × 7 ROWS) */}
      <div className="bg-[#050811] border-2 border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl overflow-x-auto">
        <div className="min-w-[950px] space-y-2">
          {/* Group Number Headers (1 to 18) */}
          <div className="grid grid-cols-18 gap-1.5 text-center text-[10px] font-mono font-black text-slate-500 pb-1">
            {Array.from({ length: 18 }, (_, i) => (
              <div key={i} className="py-0.5">
                {i + 1}
              </div>
            ))}
          </div>

          {/* 7 Periods of 18 Columns */}
          {mainGridElements.map((periodRow, pIdx) => (
            <div key={pIdx} className="grid grid-cols-18 gap-1.5 items-center">
              {periodRow.map((element, gIdx) => {
                if (!element) {
                  return <div key={gIdx} className="w-full h-14" />;
                }

                const isSpecialPlaceholder = element.symbol === '57-71' || element.symbol === '89-103';
                const isSelected = selectedElementNumber === element.number && !isSpecialPlaceholder;
                const isHighlighted = isElementHighlighted(element.number, element.symbol, element.name, element.hindiName, element.category, element.block);
                const styleColors = CATEGORY_COLORS[element.category] || CATEGORY_COLORS['unknown'];

                return (
                  <button
                    key={gIdx}
                    onClick={() => {
                      if (!isSpecialPlaceholder) {
                        setSelectedElementNumber(element.number);
                      }
                    }}
                    className={`h-14 rounded-xl border p-1 flex flex-col justify-between text-left transition-all cursor-pointer relative overflow-hidden ${
                      isHighlighted ? styleColors.bg : 'bg-slate-950/40 border-slate-900 text-slate-700 opacity-25'
                    } ${
                      isSelected ? 'ring-2 ring-cyan-400 scale-105 z-20 shadow-xl shadow-cyan-500/30' : styleColors.border
                    }`}
                  >
                    <div className="flex justify-between items-start text-[9px] font-mono leading-none">
                      <span className="font-bold text-slate-400">{element.number}</span>
                      <span className="text-[8px] text-slate-500 font-bold uppercase">{element.block}</span>
                    </div>

                    <div className="text-center my-auto">
                      <span className={`text-sm font-black tracking-tight leading-none block ${styleColors.text}`}>
                        {element.symbol}
                      </span>
                      <span className="text-[8px] text-slate-300 font-medium truncate block leading-tight mt-0.5">
                        {isHindi ? element.hindiName : element.name}
                      </span>
                    </div>

                    <div className="text-[8px] font-mono text-slate-400 text-center leading-none">
                      {typeof element.mass === 'number' ? element.mass.toFixed(1) : element.mass}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}

          {/* Separator / Spacing */}
          <div className="pt-4 pb-2">
            <div className="flex items-center gap-3">
              <div className="h-px bg-slate-800 flex-1" />
              <span className="text-[10px] font-black uppercase text-pink-400 tracking-widest px-2 bg-slate-950 border border-slate-800 rounded-full">
                f-Block Inner Transition Elements (अन्तर-संक्रमण तत्व)
              </span>
              <div className="h-px bg-slate-800 flex-1" />
            </div>
          </div>

          {/* Lanthanides Row (4f: 57 to 71) */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <span className="w-20 text-[10px] font-bold text-pink-300 shrink-0">
                {isHindi ? 'लैन्थेनाइड (4f):' : 'Lanthanides:'}
              </span>
              <div className="grid grid-cols-15 gap-1.5 flex-1">
                {lanthanideRow.map(el => {
                  const isSelected = selectedElementNumber === el.number;
                  const isHighlighted = isElementHighlighted(el.number, el.symbol, el.name, el.hindiName, el.category, el.block);
                  const styleColors = CATEGORY_COLORS[el.category];
                  return (
                    <button
                      key={el.number}
                      onClick={() => setSelectedElementNumber(el.number)}
                      className={`h-13 rounded-xl border p-1 flex flex-col justify-between text-left transition-all cursor-pointer relative ${
                        isHighlighted ? styleColors.bg : 'bg-slate-950/40 border-slate-900 text-slate-700 opacity-25'
                      } ${isSelected ? 'ring-2 ring-pink-400 scale-105 z-20 shadow-lg' : styleColors.border}`}
                    >
                      <span className="text-[8px] font-mono text-slate-400 font-bold">{el.number}</span>
                      <span className="text-xs font-black text-pink-300 text-center">{el.symbol}</span>
                      <span className="text-[7px] text-slate-400 truncate text-center">{isHindi ? el.hindiName : el.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actinides Row (5f: 89 to 103) */}
            <div className="flex items-center gap-1.5">
              <span className="w-20 text-[10px] font-bold text-orange-300 shrink-0">
                {isHindi ? 'एक्टिनाइड (5f):' : 'Actinides:'}
              </span>
              <div className="grid grid-cols-15 gap-1.5 flex-1">
                {actinideRow.map(el => {
                  const isSelected = selectedElementNumber === el.number;
                  const isHighlighted = isElementHighlighted(el.number, el.symbol, el.name, el.hindiName, el.category, el.block);
                  const styleColors = CATEGORY_COLORS[el.category];
                  return (
                    <button
                      key={el.number}
                      onClick={() => setSelectedElementNumber(el.number)}
                      className={`h-13 rounded-xl border p-1 flex flex-col justify-between text-left transition-all cursor-pointer relative ${
                        isHighlighted ? styleColors.bg : 'bg-slate-950/40 border-slate-900 text-slate-700 opacity-25'
                      } ${isSelected ? 'ring-2 ring-orange-400 scale-105 z-20 shadow-lg' : styleColors.border}`}
                    >
                      <span className="text-[8px] font-mono text-slate-400 font-bold">{el.number}</span>
                      <span className="text-xs font-black text-orange-300 text-center">{el.symbol}</span>
                      <span className="text-[7px] text-slate-400 truncate text-center">{isHindi ? el.hindiName : el.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SELECTED ELEMENT DEEP-DIVE INSPECTOR & BOHR MODEL */}
      {activeElement && (
        <div className="bg-[#090D16] border-2 border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-4">
              {/* Element Symbol Big Card */}
              <div className={`w-20 h-20 rounded-2xl border-2 p-2 flex flex-col justify-between shadow-xl ${
                CATEGORY_COLORS[activeElement.category]?.bg || 'bg-slate-900'
              } ${CATEGORY_COLORS[activeElement.category]?.border || 'border-cyan-500'}`}>
                <div className="flex justify-between text-[10px] font-mono font-bold text-slate-300">
                  <span>{activeElement.number}</span>
                  <span>{activeElement.block}</span>
                </div>
                <div className="text-2xl font-black text-white text-center">
                  {activeElement.symbol}
                </div>
                <div className="text-[9px] font-mono text-slate-300 text-center truncate">
                  {typeof activeElement.mass === 'number' ? activeElement.mass.toFixed(2) : activeElement.mass}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                    {isHindi ? activeElement.hindiName : activeElement.name}
                  </h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                    CATEGORY_COLORS[activeElement.category]?.badge || 'bg-slate-800 text-slate-300'
                  }`}>
                    {isHindi ? CATEGORY_COLORS[activeElement.category]?.hindiLabel : CATEGORY_COLORS[activeElement.category]?.enLabel}
                  </span>
                </div>
                <p className="text-xs text-cyan-300 font-mono mt-0.5">
                  Electron Config: {activeElement.electronConfig}
                </p>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                  <span>Period {activeElement.period}</span>
                  <span>•</span>
                  <span>Group {activeElement.group}</span>
                  <span>•</span>
                  <span>State: <strong className="text-slate-200 uppercase">{activeElement.state}</strong></span>
                  {activeElement.year && (
                    <>
                      <span>•</span>
                      <span>Discovered: {activeElement.year} ({activeElement.discoveredBy})</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Audio Speech Button */}
            <button
              onClick={() => handleSpeakElement(activeElement)}
              className={`px-4 py-2 rounded-2xl border text-xs font-black flex items-center gap-2 cursor-pointer transition-all ${
                isPlayingAudio 
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/30'
                  : 'bg-cyan-500 text-slate-950 border-cyan-300 hover:bg-cyan-400'
              }`}
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isPlayingAudio ? (isHindi ? 'रोकें' : 'Stop Audio') : (isHindi ? 'सुनें (Audio)' : 'Listen Details')}</span>
            </button>
          </div>

          {/* 3-Column Detailed Properties */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            {/* Bohr Model Live Atomic Simulator (4 Cols) */}
            <div className="md:col-span-4 bg-slate-950 p-4 rounded-2xl border border-cyan-500/30 text-center space-y-2">
              <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider block">
                {isHindi ? 'बोहर परमाणु मॉडल (Bohr Electron Orbitals)' : 'Bohr Atomic Orbitals'}
              </span>

              {/* Concentric Atomic Shells SVG Visual */}
              <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
                {/* Nucleus */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-amber-500 border-2 border-white flex flex-col items-center justify-center text-[8px] font-black text-slate-950 z-10 shadow-lg shadow-rose-500/40">
                  <span>{activeElement.number} p⁺</span>
                  <span className="text-[6px]">{typeof activeElement.mass === 'number' ? Math.round(activeElement.mass - activeElement.number) : '?'} n⁰</span>
                </div>

                {/* Orbit 1 (K Shell) */}
                <div className="absolute w-20 h-20 rounded-full border border-dashed border-cyan-500/60 animate-spin" style={{ animationDuration: '6s' }}>
                  <div className="w-2 h-2 rounded-full bg-cyan-300 absolute -top-1 left-1/2 -translate-x-1/2 shadow-md shadow-cyan-400" />
                  {activeElement.number >= 2 && (
                    <div className="w-2 h-2 rounded-full bg-cyan-300 absolute -bottom-1 left-1/2 -translate-x-1/2 shadow-md shadow-cyan-400" />
                  )}
                </div>

                {/* Orbit 2 (L Shell) */}
                {activeElement.number > 2 && (
                  <div className="absolute w-32 h-32 rounded-full border border-dashed border-purple-500/60 animate-spin" style={{ animationDuration: '10s', animationDirection: 'reverse' }}>
                    <div className="w-2 h-2 rounded-full bg-purple-300 absolute top-1/2 -left-1 -translate-y-1/2 shadow-md" />
                    <div className="w-2 h-2 rounded-full bg-purple-300 absolute top-1/2 -right-1 -translate-y-1/2 shadow-md" />
                  </div>
                )}

                {/* Orbit 3 (M Shell) */}
                {activeElement.number > 10 && (
                  <div className="absolute w-44 h-44 rounded-full border border-dashed border-amber-500/50 animate-spin" style={{ animationDuration: '15s' }}>
                    <div className="w-2 h-2 rounded-full bg-amber-300 absolute top-0 left-1/2 -translate-x-1/2 shadow-md" />
                    <div className="w-2 h-2 rounded-full bg-amber-300 absolute bottom-0 left-1/2 -translate-x-1/2 shadow-md" />
                  </div>
                )}
              </div>

              <div className="text-[10px] font-mono text-slate-400">
                Shell Configuration: <strong className="text-cyan-300">{activeElement.shells?.join(', ') || '2, 8...'}</strong>
              </div>
            </div>

            {/* Atomic & Physical Metrics (4 Cols) */}
            <div className="md:col-span-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                {isHindi ? 'भौतिक व रासायनिक स्थिरांक' : 'Physical & Chemical Properties'}
              </span>

              <div className="space-y-1.5 text-slate-300">
                <div className="flex justify-between border-b border-slate-900 pb-1">
                  <span className="text-slate-400">विद्युत ऋणात्मकता (Pauling):</span>
                  <span className="font-mono font-bold text-amber-300">{activeElement.electronegativity || 'N/A'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-900 pb-1">
                  <span className="text-slate-400">संयोजकता (Valency):</span>
                  <span className="font-mono font-bold text-cyan-300">{activeElement.valency || 'N/A'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-900 pb-1">
                  <span className="text-slate-400">ऑक्सीकरण अवस्थाएं:</span>
                  <span className="font-mono font-bold text-emerald-300">{activeElement.oxidationStates || 'N/A'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-900 pb-1">
                  <span className="text-slate-400">गलनांक (Melting Point):</span>
                  <span className="font-mono text-slate-200">
                    {activeElement.meltingPointK ? `${activeElement.meltingPointK} K (${(activeElement.meltingPointK - 273.15).toFixed(1)}°C)` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">घनत्व (Density):</span>
                  <span className="font-mono text-slate-200">{activeElement.densityGPerCm3 ? `${activeElement.densityGPerCm3} g/cm³` : 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Real World Applications & Exam Tips (4 Cols) */}
            <div className="md:col-span-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider block flex items-center gap-1">
                  <Zap className="w-3 h-3 text-emerald-400" />
                  {isHindi ? 'दैनिक जीवन व उद्योग में प्रमुख उपयोग:' : 'Real-World Applications:'}
                </span>
                <p className="text-slate-200 mt-1 leading-relaxed text-[11px]">
                  {isHindi ? activeElement.usesHindi : activeElement.usesEnglish}
                </p>
              </div>

              {activeElement.examHighlightHindi && (
                <div className="p-2.5 bg-amber-950/40 border border-amber-500/30 rounded-xl space-y-1">
                  <span className="text-[10px] font-black uppercase text-amber-300 block flex items-center gap-1">
                    <Award className="w-3 h-3 text-amber-400" />
                    {isHindi ? 'प्रतियोगी परीक्षा हाइलाइट (PYQ):' : 'Competitive Exam Highlight:'}
                  </span>
                  <p className="text-amber-200 text-[11px] leading-relaxed">
                    {activeElement.examHighlightHindi}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
