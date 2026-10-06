import React, { useState } from 'react';
import { FlaskConical, Sparkles, X, Info } from 'lucide-react';

interface ElementData {
  number: number;
  symbol: string;
  nameHi: string;
  nameEn: string;
  mass: number;
  category: string;
  color: string;
  electronicConfig: string;
  valency: number;
  funFact: string;
}

export const InteractivePeriodicTable: React.FC = () => {
  const [selectedElement, setSelectedElement] = useState<ElementData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const elements: ElementData[] = [
    { number: 1, symbol: 'H', nameHi: 'हाइड्रोजन', nameEn: 'Hydrogen', mass: 1.008, category: 'nonmetal', color: 'bg-emerald-600/30 border-emerald-400 text-emerald-200', electronicConfig: '1s¹', valency: 1, funFact: 'ब्रह्मांड में सबसे प्रचुर मात्रा में पाया जाने वाला तत्व (लगभग 75%)।' },
    { number: 2, symbol: 'He', nameHi: 'हीलियम', nameEn: 'Helium', mass: 4.0026, category: 'noble', color: 'bg-purple-600/30 border-purple-400 text-purple-200', electronicConfig: '1s²', valency: 0, funFact: 'अक्रिय गैस; गुब्बारों और गोताखोरी गैस सिलेंडरों में उपयोग होती है।' },
    { number: 3, symbol: 'Li', nameHi: 'लिथियम', nameEn: 'Lithium', mass: 6.94, category: 'alkali', color: 'bg-rose-600/30 border-rose-400 text-rose-200', electronicConfig: '[He] 2s¹', valency: 1, funFact: 'सबसे हल्की ज्ञात धातु; मोबाइल व इलेक्ट्रिक वाहन बैटरी में अनिवार्य।' },
    { number: 4, symbol: 'Be', nameHi: 'बेरिलियम', nameEn: 'Beryllium', mass: 9.0122, category: 'alkaline', color: 'bg-amber-600/30 border-amber-400 text-amber-200', electronicConfig: '[He] 2s²', valency: 2, funFact: 'पन्ना (Emerald) रत्न में मौजूद दुर्लभ तत्व।' },
    { number: 5, symbol: 'B', nameHi: 'बोरॉन', nameEn: 'Boron', mass: 10.81, category: 'metalloid', color: 'bg-teal-600/30 border-teal-400 text-teal-200', electronicConfig: '[He] 2s² 2p¹', valency: 3, funFact: 'उपधातु (Metalloid); पाइरेक्स ग्लास बनाने में प्रयुक्त।' },
    { number: 6, symbol: 'C', nameHi: 'कार्बन', nameEn: 'Carbon', mass: 12.011, category: 'nonmetal', color: 'bg-emerald-600/30 border-emerald-400 text-emerald-200', electronicConfig: '[He] 2s² 2p²', valency: 4, funFact: 'जीवन का आधार; हीरा और ग्रेफाइट इसके दो प्रमुख अपररूप (Allotropes) हैं।' },
    { number: 7, symbol: 'N', nameHi: 'नाइट्रोजन', nameEn: 'Nitrogen', mass: 14.007, category: 'nonmetal', color: 'bg-emerald-600/30 border-emerald-400 text-emerald-200', electronicConfig: '[He] 2s² 2p³', valency: 3, funFact: 'वायुमंडल में 78% आयतन नाइट्रोजन का है।' },
    { number: 8, symbol: 'O', nameHi: 'ऑक्सीजन', nameEn: 'Oxygen', mass: 15.999, category: 'nonmetal', color: 'bg-emerald-600/30 border-emerald-400 text-emerald-200', electronicConfig: '[He] 2s² 2p⁴', valency: 2, funFact: 'श्वसन और दहन के लिए अत्यंत आवश्यक; वायुमंडल में 21%। ' },
    { number: 9, symbol: 'F', nameHi: 'फ्लोरीन', nameEn: 'Fluorine', mass: 18.998, category: 'halogen', color: 'bg-sky-600/30 border-sky-400 text-sky-200', electronicConfig: '[He] 2s² 2p⁵', valency: 1, funFact: 'आवर्त सारणी का सर्वाधिक विद्युत ऋणात्मक (Electronegative) तत्व।' },
    { number: 10, symbol: 'Ne', nameHi: 'नियॉन', nameEn: 'Neon', mass: 20.18, category: 'noble', color: 'bg-purple-600/30 border-purple-400 text-purple-200', electronicConfig: '[He] 2s² 2p⁶', valency: 0, funFact: 'लाल-नारंगी चमक वाले विज्ञापन साइनबोर्ड में प्रयुक्त।' },
    { number: 11, symbol: 'Na', nameHi: 'सोडियम', nameEn: 'Sodium', mass: 22.99, category: 'alkali', color: 'bg-rose-600/30 border-rose-400 text-rose-200', electronicConfig: '[Ne] 3s¹', valency: 1, funFact: 'इतना मुलायम कि चाकू से काटा जा सकता है; केरोसिन तेल में डुबोकर रखा जाता है।' },
    { number: 12, symbol: 'Mg', nameHi: 'मैग्नीशियम', nameEn: 'Magnesium', mass: 24.305, category: 'alkaline', color: 'bg-amber-600/30 border-amber-400 text-amber-200', electronicConfig: '[Ne] 3s²', valency: 2, funFact: 'क्लोरोफिल के केंद्र में स्थित धातु आयन।' },
    { number: 13, symbol: 'Al', nameHi: 'एल्युमीनियम', nameEn: 'Aluminium', mass: 26.982, category: 'metal', color: 'bg-blue-600/30 border-blue-400 text-blue-200', electronicConfig: '[Ne] 3s² 3p¹', valency: 3, funFact: 'पृथ्वी की भूपर्पटी (Crust) में सर्वाधिक पाई जाने वाली धातु।' },
    { number: 14, symbol: 'Si', nameHi: 'सिलिकॉन', nameEn: 'Silicon', mass: 28.085, category: 'metalloid', color: 'bg-teal-600/30 border-teal-400 text-teal-200', electronicConfig: '[Ne] 3s² 3p²', valency: 4, funFact: 'कंप्यूटर चिप्स और सौर सेलों का दिल (अर्धचालक)।' },
    { number: 15, symbol: 'P', nameHi: 'फास्फोरस', nameEn: 'Phosphorus', mass: 30.974, category: 'nonmetal', color: 'bg-emerald-600/30 border-emerald-400 text-emerald-200', electronicConfig: '[Ne] 3s² 3p³', valency: 3, funFact: 'माचिस की तीली में लाल फास्फोरस का प्रयोग होता है।' },
    { number: 16, symbol: 'S', nameHi: 'सल्फर (गंधक)', nameEn: 'Sulfur', mass: 32.06, category: 'nonmetal', color: 'bg-emerald-600/30 border-emerald-400 text-emerald-200', electronicConfig: '[Ne] 3s² 3p⁴', valency: 2, funFact: 'प्याज़ काटते समय आंखों में आंसू सल्फर यौगिकों के कारण आते हैं।' },
    { number: 17, symbol: 'Cl', nameHi: 'क्लोरीन', nameEn: 'Chlorine', mass: 35.45, category: 'halogen', color: 'bg-sky-600/30 border-sky-400 text-sky-200', electronicConfig: '[Ne] 3s² 3p⁵', valency: 1, funFact: 'पीने के पानी को कीटाणुरहित करने में प्रयुक्त हैलोजन।' },
    { number: 18, symbol: 'Ar', nameHi: 'आर्गन', nameEn: 'Argon', mass: 39.948, category: 'noble', color: 'bg-purple-600/30 border-purple-400 text-purple-200', electronicConfig: '[Ne] 3s² 3p⁶', valency: 0, funFact: 'साधारण विद्युत बल्बों में टंगस्टन फिलामेंट की सुरक्षा हेतु भरी जाती है।' },
    { number: 19, symbol: 'K', nameHi: 'पोटैशियम', nameEn: 'Potassium', mass: 39.098, category: 'alkali', color: 'bg-rose-600/30 border-rose-400 text-rose-200', electronicConfig: '[Ar] 4s¹', valency: 1, funFact: 'मानव तंत्रिका तंत्र और मांसपेशियों के संचालन के लिए अनिवार्य।' },
    { number: 20, symbol: 'Ca', nameHi: 'कैल्शियम', nameEn: 'Calcium', mass: 40.078, category: 'alkaline', color: 'bg-amber-600/30 border-amber-400 text-amber-200', electronicConfig: '[Ar] 4s²', valency: 2, funFact: 'हड्डियों, दांतों और चूना पत्थर (CaCO₃) का मुख्य घटक।' }
  ];

  const categories = [
    { id: 'all', label: 'सभी तत्व (All 1-20)' },
    { id: 'alkali', label: 'क्षार धातुएं (Alkali)' },
    { id: 'alkaline', label: 'क्षारीय मृदा धातुएं (Alkaline)' },
    { id: 'metalloid', label: 'उपधातुएं (Metalloids)' },
    { id: 'nonmetal', label: 'अधातुएं (Non-metals)' },
    { id: 'halogen', label: 'हैलोजन (Halogens)' },
    { id: 'noble', label: 'अक्रिय गैसें (Noble Gases)' }
  ];

  const filtered = elements.filter(e => selectedCategory === 'all' || e.category === selectedCategory);

  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900 to-indigo-950/40 p-5 sm:p-6 rounded-3xl border border-cyan-500/30 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold uppercase border border-cyan-500/30 mb-2">
              <FlaskConical className="w-3.5 h-3.5" />
              <span>आधुनिक आवर्त सारणी (मोजले नियम)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              इंटरैक्टिव पीरियोडिक टेबल (Interactive Periodic Table)
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              किसी भी तत्व (Element) पर टैप करके उसका इलेक्ट्रॉनिक विन्यास, संयोजकता, परमाणु भार एवं परीक्षा में पूछे जाने वाले रोचक तथ्य जानें।
            </p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-800">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-cyan-500 text-slate-950 shadow'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Elements */}
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-2">
        {filtered.map(elem => (
          <button
            key={elem.number}
            onClick={() => setSelectedElement(elem)}
            className={`p-2 rounded-2xl border ${elem.color} hover:scale-105 transition-all flex flex-col items-center justify-between text-center cursor-pointer shadow aspect-square`}
          >
            <span className="text-[10px] font-mono font-bold self-start opacity-70">
              {elem.number}
            </span>
            <span className="text-base sm:text-lg font-black tracking-tight">
              {elem.symbol}
            </span>
            <span className="text-[9px] truncate w-full font-semibold">
              {elem.nameHi}
            </span>
          </button>
        ))}
      </div>

      {/* Element Detail Inspection Modal */}
      {selectedElement && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#091122] border-2 border-cyan-500/50 rounded-3xl p-6 sm:p-7 max-w-md w-full space-y-4 shadow-2xl relative">
            <button
              onClick={() => setSelectedElement(null)}
              className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Element Header */}
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border-2 border-cyan-400 text-cyan-300 flex flex-col items-center justify-center font-black">
                <span className="text-xs font-mono">{selectedElement.number}</span>
                <span className="text-xl leading-none">{selectedElement.symbol}</span>
              </div>
              <div>
                <h3 className="text-lg font-black text-white">{selectedElement.nameHi}</h3>
                <div className="text-xs text-slate-400">{selectedElement.nameEn} • {selectedElement.category.toUpperCase()}</div>
              </div>
            </div>

            {/* Key Properties Table */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-850">
                <span className="text-[10px] text-slate-400 block">परमाणु भार (Atomic Mass):</span>
                <span className="font-mono font-bold text-white">{selectedElement.mass} u</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-850">
                <span className="text-[10px] text-slate-400 block">संयोजकता (Valency):</span>
                <span className="font-mono font-bold text-emerald-400">{selectedElement.valency}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-850 col-span-2">
                <span className="text-[10px] text-slate-400 block">इलेक्ट्रॉनिक विन्यास (Configuration):</span>
                <span className="font-mono font-bold text-cyan-300">{selectedElement.electronicConfig}</span>
              </div>
            </div>

            {/* Board Exam Fact */}
            <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-slate-200 space-y-1">
              <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-cyan-400" />
                <span>परीक्षा उपयोगिता व तथ्य:</span>
              </span>
              <p className="text-[11px] leading-relaxed text-slate-300">
                {selectedElement.funFact}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
