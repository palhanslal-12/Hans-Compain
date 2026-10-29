import React, { useState } from 'react';
import {
  FlaskConical,
  Sparkles,
  Search,
  Volume2,
  RefreshCw,
  BookOpen,
  Info,
  Layers,
  Zap,
  Check,
  X
} from 'lucide-react';
import {
  PeriodicElement,
  getAll118Elements,
  BLOCK_INFO,
  PERIODIC_MNEMONICS
} from '../data/periodicTable118';
import { playNaturalSpeech, stopNaturalSpeech } from '../utils/naturalSpeech';

const ALL_ELEMENTS = getAll118Elements();

export const InteractivePeriodicTable: React.FC<{
  onSelectElement?: (elem: PeriodicElement) => void;
}> = ({ onSelectElement }) => {
  const [selectedElement, setSelectedElement] = useState<PeriodicElement>(
    () => ALL_ELEMENTS.find(e => e.number === 6) || ALL_ELEMENTS[0] // Default Carbon
  );
  const [activeBlock, setActiveBlock] = useState<'all' | 's' | 'p' | 'd' | 'f'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showMnemonicsModal, setShowMnemonicsModal] = useState<boolean>(false);
  const [mobileViewMode, setMobileViewMode] = useState<'table' | 'cards'>('table');

  const categories = [
    { id: 'all', label: 'सभी श्रेणियां (All 10 Categories)' },
    { id: 'alkali', label: 'क्षार धातु (Alkali Metals)', color: 'bg-rose-900/60 border-rose-500/60 text-rose-200' },
    { id: 'alkaline', label: 'क्षारीय मृदा धातु (Alkaline Earth)', color: 'bg-amber-900/60 border-amber-500/60 text-amber-200' },
    { id: 'transition', label: 'संक्रमण धातु (Transition Metals)', color: 'bg-indigo-900/60 border-indigo-500/60 text-indigo-200' },
    { id: 'post-transition', label: 'उत्तर-संक्रमण धातु (Post-Transition)', color: 'bg-blue-900/60 border-blue-500/60 text-blue-200' },
    { id: 'metalloid', label: 'उपधातु (Metalloids)', color: 'bg-teal-900/60 border-teal-500/60 text-teal-200' },
    { id: 'nonmetal', label: 'क्रियाशील अधातु (Reactive Nonmetals)', color: 'bg-emerald-900/60 border-emerald-500/60 text-emerald-200' },
    { id: 'halogen', label: 'हैलोजन (Halogens)', color: 'bg-cyan-900/60 border-cyan-500/60 text-cyan-200' },
    { id: 'noble', label: 'उत्कृष्ट/अक्रिय गैसें (Noble Gases)', color: 'bg-purple-900/60 border-purple-500/60 text-purple-200' },
    { id: 'lanthanide', label: 'लैन्थेनाइड (Lanthanides 4f)', color: 'bg-pink-900/60 border-pink-500/60 text-pink-200' },
    { id: 'actinide', label: 'एक्टिनाइड (Actinides 5f)', color: 'bg-orange-900/60 border-orange-500/60 text-orange-200' }
  ];

  const getElementColor = (cat: PeriodicElement['category'], isSelected: boolean, blk: 's' | 'p' | 'd' | 'f') => {
    if (activeBlock !== 'all' && blk !== activeBlock) {
      return 'bg-slate-950/40 border-slate-900/50 text-slate-600 opacity-25';
    }

    if (selectedCategory !== 'all' && cat !== selectedCategory) {
      return 'bg-slate-950/40 border-slate-900/50 text-slate-600 opacity-25';
    }

    const baseMap: Record<PeriodicElement['category'], string> = {
      alkali: 'bg-rose-950/70 border-rose-500/60 text-rose-200 hover:bg-rose-900',
      alkaline: 'bg-amber-950/70 border-amber-500/60 text-amber-200 hover:bg-amber-900',
      transition: 'bg-indigo-950/70 border-indigo-500/60 text-indigo-200 hover:bg-indigo-900',
      'post-transition': 'bg-blue-950/70 border-blue-500/60 text-blue-200 hover:bg-blue-900',
      metalloid: 'bg-teal-950/70 border-teal-500/60 text-teal-200 hover:bg-teal-900',
      nonmetal: 'bg-emerald-950/70 border-emerald-500/60 text-emerald-200 hover:bg-emerald-900',
      halogen: 'bg-cyan-950/70 border-cyan-500/60 text-cyan-200 hover:bg-cyan-900',
      noble: 'bg-purple-950/70 border-purple-500/60 text-purple-200 hover:bg-purple-900',
      lanthanide: 'bg-pink-950/70 border-pink-500/60 text-pink-200 hover:bg-pink-900',
      actinide: 'bg-orange-950/70 border-orange-500/60 text-orange-200 hover:bg-orange-900'
    };

    const color = baseMap[cat] || 'bg-slate-900 border-slate-700 text-slate-200';
    return isSelected ? `${color} ring-2 ring-cyan-400 scale-105 z-10 shadow-lg` : color;
  };

  const handlePickRandom = () => {
    const randomIndex = Math.floor(Math.random() * ALL_ELEMENTS.length);
    const chosen = ALL_ELEMENTS[randomIndex];
    setSelectedElement(chosen);
    onSelectElement?.(chosen);
  };

  const speakElement = (elem: PeriodicElement) => {
    const text = `${elem.nameHi} (${elem.nameEn})। परमाणु क्रमांक ${elem.number}। परमाणु भार ${elem.mass}। श्रेणी: ${elem.category}। इलेक्ट्रॉनिक विन्यास: ${elem.electronicConfig}। मुख्य उपयोग: ${elem.uses}। परीक्षा तथ्य: ${elem.pyqFact}`;
    playNaturalSpeech(text);
  };

  const filteredElements = ALL_ELEMENTS.filter(e => {
    const blockMatch = activeBlock === 'all' || e.block === activeBlock;
    const catMatch = selectedCategory === 'all' || e.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const searchMatch =
      !q ||
      e.symbol.toLowerCase().includes(q) ||
      e.nameEn.toLowerCase().includes(q) ||
      e.nameHi.includes(q) ||
      e.number.toString() === q;
    return blockMatch && catMatch && searchMatch;
  });

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 animate-fade-in text-white select-none">
      
      {/* 1. TOP HEADER & CONTROLS */}
      <div className="bg-[#091122] border-2 border-cyan-500/40 rounded-3xl p-4 sm:p-6 space-y-4 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-black uppercase border border-cyan-500/40 mb-1.5">
              <FlaskConical className="w-3.5 h-3.5" />
              <span>MODERN PERIODIC TABLE 2026 (मोजले आधुनिक आवर्त सारणी) • 118 Elements • 18 Groups • 7 Periods</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-black font-hindi-title text-white">
              इंटरएक्टिव रासायनिक आवर्त सारणी (Interactive Periodic Table)
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              किसी भी तत्व पर क्लिक करके उसका 3D बोहर मॉडल, इलेक्ट्रॉनिक विन्यास, उपयोग व प्रतियोगी परीक्षा ट्रिक्स देखें।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setShowMnemonicsModal(true)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
            >
              <Zap className="w-4 h-4 text-slate-950" />
              <span>याद करने की जादुई ट्रिक्स (Mnemonics)</span>
            </button>
            <button
              onClick={handlePickRandom}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
              <span>रैंडम तत्व (Random)</span>
            </button>
            <button
              onClick={() => setMobileViewMode(mobileViewMode === 'table' ? 'cards' : 'table')}
              className="md:hidden px-3.5 py-2 rounded-xl bg-slate-900 border border-cyan-500/40 text-cyan-300 text-xs font-bold"
            >
              {mobileViewMode === 'table' ? '📋 लिस्ट व्यू' : '🗺️ 18-ग्रिड टेबल'}
            </button>
          </div>
        </div>

        {/* Search, Block Filters & Category Selector */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="खोजें: सोना, Au, 79, Carbon, Fe, हाइड्रोजन..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Block Selector Buttons */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
            <span className="text-[10px] text-slate-400 font-bold px-2">Block:</span>
            {(['all', 's', 'p', 'd', 'f'] as const).map(b => (
              <button
                key={b}
                onClick={() => setActiveBlock(b)}
                className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer uppercase ${
                  activeBlock === b
                    ? 'bg-cyan-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {b === 'all' ? 'ALL' : `${b.toUpperCase()}-BLOCK`}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 cursor-pointer shrink-0"
          >
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Active Block Explanation Card (When a specific Block is selected) */}
        {activeBlock !== 'all' && (
          <div className="p-4 bg-cyan-950/40 border border-cyan-500/40 rounded-2xl space-y-1.5 text-xs animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="font-black text-cyan-300 text-sm flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>{BLOCK_INFO[activeBlock].name}</span>
              </span>
              <span className="font-mono bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded text-[11px] font-bold">
                सामान्य विन्यास: {BLOCK_INFO[activeBlock].generalConfig}
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              <strong>स्थान:</strong> {BLOCK_INFO[activeBlock].groups} • <strong>विशेषताएं:</strong> {BLOCK_INFO[activeBlock].characteristics}
            </p>
            <div className="text-amber-300 text-[11px] font-bold">
              ⚡ परीक्षा टिप: {BLOCK_INFO[activeBlock].examTip}
            </div>
          </div>
        )}

        {/* Legend Dots */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
          <span className="w-2 h-2 rounded-full bg-rose-500"></span> क्षार धातु
          <span className="w-2 h-2 rounded-full bg-amber-500"></span> क्षारीय मृदा
          <span className="w-2 h-2 rounded-full bg-indigo-500"></span> संक्रमण
          <span className="w-2 h-2 rounded-full bg-blue-500"></span> उत्तर-संक्रमण
          <span className="w-2 h-2 rounded-full bg-teal-500"></span> उपधातु
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span> अधातु
          <span className="w-2 h-2 rounded-full bg-cyan-500"></span> हैलोजन
          <span className="w-2 h-2 rounded-full bg-purple-500"></span> अक्रिय गैस
          <span className="w-2 h-2 rounded-full bg-pink-500"></span> लैन्थेनाइड
          <span className="w-2 h-2 rounded-full bg-orange-500"></span> एक्टिनाइड
        </div>
      </div>

      {/* 2. PERIODIC TABLE GRID (RESPONSIVE SCROLLABLE ON MOBILE, FULL ON PC/TABLET) */}
      {mobileViewMode === 'table' ? (
        <div className="bg-[#040711] border-2 border-slate-800/90 rounded-3xl p-3 sm:p-5 shadow-2xl space-y-4">
          
          <div className="md:hidden text-center text-[10px] text-cyan-400 font-bold bg-cyan-950/40 p-1.5 rounded-xl border border-cyan-500/30 flex items-center justify-center gap-1">
            <span>👉 18-ग्रुप तालिका देखने के लिए उंगली से बाएं-दाएं स्क्रॉल करें</span>
          </div>

          <div className="overflow-x-auto pb-3 scrollbar-thin">
            <div className="min-w-[760px] md:min-w-full space-y-1">
              
              {/* Group Numbers 1 to 18 Header */}
              <div className="grid grid-cols-18 gap-1 text-center text-[10px] font-bold text-slate-500 mb-1">
                {Array.from({ length: 18 }, (_, i) => (
                  <div key={i + 1} className="py-0.5">{i + 1}</div>
                ))}
              </div>

              {/* Periods 1 to 7 */}
              {[1, 2, 3, 4, 5, 6, 7].map(periodNum => {
                const periodElements = ALL_ELEMENTS.filter(e => e.period === periodNum);
                
                return (
                  <div key={periodNum} className="grid grid-cols-18 gap-1 items-center">
                    {Array.from({ length: 18 }, (_, colIdx) => {
                      const groupNum = colIdx + 1;
                      // Handle Period 6 & 7 Lanthanide / Actinide placeholder slots
                      if (periodNum === 6 && groupNum === 3) {
                        return (
                          <div
                            key="lanth_placeholder"
                            onClick={() => setSelectedCategory('lanthanide')}
                            className="p-1 rounded-lg border border-pink-500/50 bg-pink-950/40 text-pink-300 text-center cursor-pointer hover:bg-pink-900/60 transition-all flex flex-col justify-center items-center h-13"
                            title="लैन्थेनाइड श्रृंखला (57-71)"
                          >
                            <span className="text-[9px] font-mono font-bold">57-71</span>
                            <span className="text-[10px] font-black">La-Lu</span>
                            <span className="text-[8px] truncate">लैन्थेनाइड</span>
                          </div>
                        );
                      }
                      if (periodNum === 7 && groupNum === 3) {
                        return (
                          <div
                            key="act_placeholder"
                            onClick={() => setSelectedCategory('actinide')}
                            className="p-1 rounded-lg border border-orange-500/50 bg-orange-950/40 text-orange-300 text-center cursor-pointer hover:bg-orange-900/60 transition-all flex flex-col justify-center items-center h-13"
                            title="एक्टिनाइड श्रृंखला (89-103)"
                          >
                            <span className="text-[9px] font-mono font-bold">89-103</span>
                            <span className="text-[10px] font-black">Ac-Lr</span>
                            <span className="text-[8px] truncate">एक्टिनाइड</span>
                          </div>
                        );
                      }

                      const elem = periodElements.find(e => e.group === groupNum);
                      if (!elem) {
                        return <div key={`empty-${periodNum}-${groupNum}`} className="h-13" />;
                      }

                      const isSelected = selectedElement.number === elem.number;
                      const colorClass = getElementColor(elem.category, isSelected, elem.block);

                      return (
                        <button
                          key={elem.number}
                          onClick={() => {
                            setSelectedElement(elem);
                            onSelectElement?.(elem);
                          }}
                          className={`p-1 rounded-lg border ${colorClass} transition-all flex flex-col justify-between items-center text-center cursor-pointer h-13 relative group`}
                        >
                          <div className="w-full flex items-center justify-between text-[8px] font-mono opacity-80 px-0.5">
                            <span>{elem.number}</span>
                            <span className="uppercase text-[7px] font-black">{elem.block}</span>
                          </div>
                          <span className="text-xs sm:text-sm font-black leading-none">
                            {elem.symbol}
                          </span>
                          <span className="text-[7.5px] truncate w-full font-bold">
                            {elem.nameHi}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                );
              })}

              {/* F-BLOCK INNER TRANSITION ELEMENTS ROW (Bottom of Table) */}
              <div className="pt-4 space-y-1 border-t border-slate-800/80 mt-3">
                <div className="text-center text-[10px] font-black tracking-widest uppercase text-pink-400">
                  ⚛️ F-BLOCK INNER TRANSITION ELEMENTS (अन्तर-संक्रमण तत्व)
                </div>

                {/* Lanthanides 57 to 71 */}
                <div className="flex items-center gap-1">
                  <div className="w-20 text-[9px] font-bold text-pink-300 shrink-0 text-right pr-2">
                    लैन्थेनाइड (4f):
                  </div>
                  <div className="grid grid-cols-15 gap-1 flex-1">
                    {ALL_ELEMENTS.filter(e => e.category === 'lanthanide').map(elem => {
                      const isSelected = selectedElement.number === elem.number;
                      const colorClass = getElementColor(elem.category, isSelected, elem.block);
                      return (
                        <button
                          key={elem.number}
                          onClick={() => {
                            setSelectedElement(elem);
                            onSelectElement?.(elem);
                          }}
                          className={`p-1 rounded-lg border ${colorClass} transition-all flex flex-col justify-between items-center text-center cursor-pointer h-12`}
                        >
                          <span className="text-[8px] font-mono opacity-80">{elem.number}</span>
                          <span className="text-xs font-black leading-none">{elem.symbol}</span>
                          <span className="text-[7px] truncate w-full">{elem.nameHi}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Actinides 89 to 103 */}
                <div className="flex items-center gap-1">
                  <div className="w-20 text-[9px] font-bold text-orange-300 shrink-0 text-right pr-2">
                    एक्टिनाइड (5f):
                  </div>
                  <div className="grid grid-cols-15 gap-1 flex-1">
                    {ALL_ELEMENTS.filter(e => e.category === 'actinide').map(elem => {
                      const isSelected = selectedElement.number === elem.number;
                      const colorClass = getElementColor(elem.category, isSelected, elem.block);
                      return (
                        <button
                          key={elem.number}
                          onClick={() => {
                            setSelectedElement(elem);
                            onSelectElement?.(elem);
                          }}
                          className={`p-1 rounded-lg border ${colorClass} transition-all flex flex-col justify-between items-center text-center cursor-pointer h-12`}
                        >
                          <span className="text-[8px] font-mono opacity-80">{elem.number}</span>
                          <span className="text-xs font-black leading-none">{elem.symbol}</span>
                          <span className="text-[7px] truncate w-full">{elem.nameHi}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      ) : (
        /* MOBILE CARDS LIST VIEW (Quick Touch Grid for Phone Users) */
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {filteredElements.map(elem => {
            const isSelected = selectedElement.number === elem.number;
            const colorClass = getElementColor(elem.category, isSelected, elem.block);
            return (
              <button
                key={elem.number}
                onClick={() => {
                  setSelectedElement(elem);
                  onSelectElement?.(elem);
                }}
                className={`p-2.5 rounded-2xl border ${colorClass} transition-all flex items-center justify-between text-left cursor-pointer`}
              >
                <div>
                  <div className="text-[9px] font-mono opacity-70">Z = {elem.number} • {elem.block.toUpperCase()}-Block</div>
                  <div className="text-sm font-black">{elem.symbol} • {elem.nameHi}</div>
                  <div className="text-[9px] opacity-80">{elem.nameEn} ({elem.mass} u)</div>
                </div>
                <div className="text-xs font-bold text-cyan-400">→</div>
              </button>
            );
          })}
        </div>
      )}

      {/* 3. SELECTED ELEMENT DEEP INSPECTION CARD (BOHR ORBITAL + CONSTANTS + USES + PYQ) */}
      <div className="bg-[#091122] border-2 border-cyan-500/50 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
        
        {/* Element Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/30 via-slate-900 to-indigo-950 border-2 border-cyan-400 flex flex-col items-center justify-center font-black shrink-0 shadow-lg">
              <div className="w-full flex justify-between px-1.5 text-[9px] font-mono text-slate-400">
                <span>{selectedElement.number}</span>
                <span className="text-cyan-400">{selectedElement.block.toUpperCase()}</span>
              </div>
              <span className="text-2xl font-black text-white leading-none mt-0.5">{selectedElement.symbol}</span>
              <span className="text-[8px] font-mono text-slate-400">{selectedElement.mass}</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white">{selectedElement.nameHi} ({selectedElement.nameEn})</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold uppercase">
                  {selectedElement.category}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                <strong>इलेक्ट्रॉनिक विन्यास:</strong> <span className="font-mono text-cyan-300 font-bold">{selectedElement.electronicConfig}</span> • 
                आवर्त: {selectedElement.period} • वर्ग: {selectedElement.group} • अवस्था: <strong className="text-white">{selectedElement.state}</strong> • खोज: {selectedElement.discovered}
              </p>
            </div>
          </div>

          <button
            onClick={() => speakElement(selectedElement)}
            className="px-4 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center gap-2 cursor-pointer shadow-lg shrink-0"
          >
            <Volume2 className="w-4 h-4" />
            <span>सुनें (Audio)</span>
          </button>
        </div>

        {/* 3 Columns: Bohr Orbitals Visualizer | Constants | Real-life Uses & PYQ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Col 1 (4 cols): Animated Bohr Electron Orbitals */}
          <div className="lg:col-span-4 bg-[#040711] border border-cyan-500/30 rounded-2xl p-4 flex flex-col items-center justify-between min-h-[260px]">
            <div className="text-[11px] font-black text-cyan-300 uppercase tracking-wider mb-2">
              बोहर परमाणु मॉडल (BOHR ELECTRON ORBITALS)
            </div>

            <svg viewBox="0 0 200 200" className="w-44 h-44 select-none">
              {/* Nucleus */}
              <circle cx="100" cy="100" r="14" fill="#DC2626" stroke="#FCA5A5" strokeWidth="2" />
              <text x="100" y="103" fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle">
                {selectedElement.number} p⁺
              </text>

              {/* Concentric Shells K, L, M, N */}
              {selectedElement.shells.map((count, sIdx) => {
                const radius = 30 + sIdx * 18;
                return (
                  <g key={sIdx}>
                    <circle cx="100" cy="100" r={radius} fill="none" stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 3" opacity={0.6} />
                    {Array.from({ length: Math.min(8, count) }).map((_, eIdx) => {
                      const angle = (eIdx * Math.PI * 2) / Math.min(8, count);
                      const ex = 100 + Math.cos(angle) * radius;
                      const ey = 100 + Math.sin(angle) * radius;
                      return (
                        <circle key={eIdx} cx={ex} cy={ey} r="3" fill="#22D3EE" className="animate-pulse" />
                      );
                    })}
                  </g>
                );
              })}
            </svg>

            <div className="text-[10px] text-slate-400 font-mono mt-1">
              Shell Configuration: <strong className="text-cyan-300">{selectedElement.shells.join(', ')}</strong>
            </div>
          </div>

          {/* Col 2 (4 cols): Physical & Chemical Constants */}
          <div className="lg:col-span-4 bg-[#040711] border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="text-[11px] font-black text-amber-300 uppercase tracking-wider border-b border-slate-800 pb-2">
              भौतिक व रासायनिक स्थिरांक
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-850">
                <span className="text-slate-400">विद्युत ऋणात्मकता (Pauling):</span>
                <span className="font-mono font-black text-amber-300">{selectedElement.electronegativity}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-850">
                <span className="text-slate-400">संयोजकता (Valency):</span>
                <span className="font-mono font-black text-emerald-400">{selectedElement.valency}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-850">
                <span className="text-slate-400">ऑक्सीकरण अवस्थाएं:</span>
                <span className="font-mono font-bold text-cyan-300">{selectedElement.oxidationStates}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-850">
                <span className="text-slate-400">गलनांक (Melting Point):</span>
                <span className="font-mono font-bold text-white">{selectedElement.meltingPointK} K ({(selectedElement.meltingPointK - 273.15).toFixed(1)} °C)</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400">घनत्व (Density):</span>
                <span className="font-mono font-bold text-white">{selectedElement.density}</span>
              </div>
            </div>
          </div>

          {/* Col 3 (4 cols): Real-Life Uses & PYQ Highlights */}
          <div className="lg:col-span-4 space-y-3">
            
            <div className="p-4 bg-[#040711] border border-emerald-500/30 rounded-2xl text-xs space-y-1">
              <span className="font-black text-emerald-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>दैनिक जीवन व उद्योग में प्रमुख उपयोग:</span>
              </span>
              <p className="text-slate-300 leading-relaxed text-[11px] pt-1">
                {selectedElement.uses}
              </p>
            </div>

            <div className="p-4 bg-amber-950/40 border border-amber-500/40 rounded-2xl text-xs space-y-1">
              <span className="font-black text-amber-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>प्रतियोगी परीक्षा हाइलाइट (PYQ):</span>
              </span>
              <p className="text-slate-200 leading-relaxed text-[11px] pt-1">
                {selectedElement.pyqFact}
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* 4. MNEMONICS MODAL (याद करने की जादुई ट्रिक्स) */}
      {showMnemonicsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#091122] border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-5 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-black text-white font-hindi-title">
                  आवर्त सारणी याद करने की जादुई ट्रिक्स (Mnemonics)
                </h3>
              </div>
              <button
                onClick={() => setShowMnemonicsModal(false)}
                className="p-1 rounded-xl bg-slate-900 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {PERIODIC_MNEMONICS.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-amber-300 text-sm">{item.group}</span>
                    <span className="font-mono text-cyan-300 font-bold">{item.elements}</span>
                  </div>
                  <div className="text-emerald-300 font-hindi-title text-sm font-bold pt-0.5">
                    "{item.trick}"
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowMnemonicsModal(false)}
                className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs cursor-pointer shadow-lg"
              >
                कंठस्थ हो गया (Close)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default InteractivePeriodicTable;
