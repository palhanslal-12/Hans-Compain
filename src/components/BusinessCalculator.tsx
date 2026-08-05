import React, { useState, useEffect } from 'react';
import { Sprout, TrendingUp, HelpCircle, Landmark, CheckCircle, Calculator } from 'lucide-react';
import { BusinessCalculation, BusinessResult } from '../types';

export default function BusinessCalculator() {
  const [inputs, setInputs] = useState<BusinessCalculation>({
    productType: 'Turmeric',
    rawCostPerKg: 80,
    monthlyQuantityKg: 500,
    sellingCostPerKg: 350,
    machineryCost: 75000,
    subsidyPercentage: 35, // default special rural category
    yieldPercentage: 22,
  });

  const [results, setResults] = useState<BusinessResult>({
    rawMaterialCost: 0,
    processedYieldKg: 0,
    grossRevenue: 0,
    netProfit: 0,
    machineryWithSubsidy: 0,
    subsidySaved: 0,
  });

  // Pre-load default settings based on agricultural selection
  const handleProductChange = (type: "Ginger" | "Turmeric" | "Medicinal") => {
    if (type === 'Turmeric') {
      setInputs(prev => ({
        ...prev,
        productType: type,
        rawCostPerKg: 80,
        sellingCostPerKg: 350,
        yieldPercentage: 22 // 22% average powdered yield
      }));
    } else if (type === 'Ginger') {
      setInputs(prev => ({
        ...prev,
        productType: type,
        rawCostPerKg: 70,
        sellingCostPerKg: 420,
        yieldPercentage: 18 // 18% average dry ginger powder yield
      }));
    } else {
      setInputs(prev => ({
        ...prev,
        productType: type,
        rawCostPerKg: 40,
        sellingCostPerKg: 280,
        yieldPercentage: 15 // 15% dehydrated medicinal leaf yield
      }));
    }
  };

  useEffect(() => {
    // Calculators
    const rawMaterialCost = inputs.rawCostPerKg * inputs.monthlyQuantityKg;
    const processedYieldKg = Math.round((inputs.yieldPercentage / 100) * inputs.monthlyQuantityKg);
    const grossRevenue = processedYieldKg * inputs.sellingCostPerKg;
    
    // Estimate other processing costs (packaging, electricity, labor = roughly Rs 15 per finished kg)
    const otherCosts = processedYieldKg * 15;
    const netProfit = grossRevenue - rawMaterialCost - otherCosts;

    const subsidySaved = Math.round(inputs.machineryCost * (inputs.subsidyPercentage / 100));
    const machineryWithSubsidy = inputs.machineryCost - subsidySaved;

    setResults({
      rawMaterialCost,
      processedYieldKg,
      grossRevenue,
      netProfit,
      machineryWithSubsidy,
      subsidySaved,
    });
  }, [inputs]);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs max-w-4xl mx-auto space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Sprout className="w-5 h-5 text-emerald-600" />
          मसाला एवं कृषि प्रसंस्करण कैलकुलेटर (MSME Planner) 
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          हल्दी, अदरक या औषधीय उत्पादों के प्रसंस्करण (Processing) उद्योग का प्रारंभिक वित्तीय लेखा-जोखा और MSME लोन सब्सिडी जानें।
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Parameters Form */}
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">1. कृषि उत्पाद चुनें (Select Crop)</label>
            <div className="grid grid-cols-3 gap-2">
              {(["Turmeric", "Ginger", "Medicinal"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleProductChange(type)}
                  className={`py-2 px-3 text-xs sm:text-sm font-semibold rounded-xl border transition-all text-center ${
                    inputs.productType === type
                      ? "bg-emerald-50 text-emerald-700 border-emerald-400 font-bold"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {type === "Turmeric" ? "हल्दी (Turmeric)" : type === "Ginger" ? "अदरक (Ginger)" : "औषधीय (Medicinal)"}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-600">कच्चा माल मात्रा प्रति माह (Kg)</label>
              <input
                type="number"
                value={inputs.monthlyQuantityKg}
                onChange={(e) => setInputs(prev => ({ ...prev, monthlyQuantityKg: Math.max(1, Number(e.target.value)) }))}
                className="w-full text-sm py-2 px-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-600">कच्चा माल खरीद दाम (₹/Kg)</label>
              <input
                type="number"
                value={inputs.rawCostPerKg}
                onChange={(e) => setInputs(prev => ({ ...prev, rawCostPerKg: Math.max(1, Number(e.target.value)) }))}
                className="w-full text-sm py-2 px-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-600">पाउडर/सुखा उपज % (Yield %)</label>
              <input
                type="number"
                value={inputs.yieldPercentage}
                onChange={(e) => setInputs(prev => ({ ...prev, yieldPercentage: Math.max(1, Number(e.target.value)) }))}
                className="w-full text-sm py-2 px-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-600">मार्केट में बिक्री मूल्य (₹/Powder Kg)</label>
              <input
                type="number"
                value={inputs.sellingCostPerKg}
                onChange={(e) => setInputs(prev => ({ ...prev, sellingCostPerKg: Math.max(1, Number(e.target.value)) }))}
                className="w-full text-sm py-2 px-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-600">मशीनरी कुल लागत (₹) (Dryer, Grinder, Packaging)</label>
              <input
                type="number"
                value={inputs.machineryCost}
                onChange={(e) => setInputs(prev => ({ ...prev, machineryCost: Math.max(1, Number(e.target.value)) }))}
                className="w-full text-sm py-2 px-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-600">PMEGP / MSME सरकारी सब्सिडी श्रेणी</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setInputs(prev => ({ ...prev, subsidyPercentage: 35 }))}
                  className={`py-1.5 px-2.5 rounded-lg border text-xs font-medium transition-all ${
                    inputs.subsidyPercentage === 35
                      ? 'bg-amber-55 bg-amber-50 text-amber-700 border-amber-300'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  ग्रामीण / महिला / विशेष (35% सब्सिडी)
                </button>
                <button
                  type="button"
                  onClick={() => setInputs(prev => ({ ...prev, subsidyPercentage: 25 }))}
                  className={`py-1.5 px-2.5 rounded-lg border text-xs font-medium transition-all ${
                    inputs.subsidyPercentage === 25
                      ? 'bg-amber-55 bg-amber-50 text-amber-700 border-amber-300'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  शहरी सामान्य वर्ग (25% सब्सिडी)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Analysis */}
        <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-emerald-600" />
              अनुमानित परिणाम (Monthly Estimate)
            </h4>

            {/* Calculations metrics */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="bg-white p-3 rounded-xl border border-slate-200/50">
                <span className="block text-[10px] sm:text-xs text-slate-400 font-semibold uppercase">कच्चा माल लागत / माह</span>
                <span className="text-base sm:text-lg font-bold text-slate-800">₹{results.rawMaterialCost.toLocaleString()}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200/50">
                <span className="block text-[10px] sm:text-xs text-slate-400 font-semibold uppercase">तैयार पाउडर उपज</span>
                <span className="text-base sm:text-lg font-bold text-slate-800">{results.processedYieldKg} Kg</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200/50">
                <span className="block text-[10px] sm:text-xs text-slate-400 font-semibold uppercase">अनुमानित कुल रेवेन्यू</span>
                <span className="text-base sm:text-lg font-bold text-slate-800 text-emerald-600">₹{results.grossRevenue.toLocaleString()}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-rose-100 bg-rose-50/20">
                <span className="block text-[10px] sm:text-xs text-rose-500/80 font-semibold uppercase">मासिक शुद्ध मुनाफा *</span>
                <span className={`text-base sm:text-lg font-bold ${results.netProfit >= 0 ? "text-emerald-700" : "text-rose-600"}`}>
                  ₹{results.netProfit.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Subsidy Info */}
            <div className="bg-amber-50/55 border border-amber-100 rounded-xl p-3 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                <Landmark className="w-4 h-4 text-amber-600" />
                <span>PMEGP / MSME सरकारी सब्सिडी छूट:</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 block">बचत हुई राशि:</span>
                  <strong className="text-emerald-700 text-sm font-bold">₹{results.subsidySaved.toLocaleString()}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">मशीन हेतु वास्तविक भुगतान:</span>
                  <strong className="text-slate-700 text-sm font-semibold">₹{results.machineryWithSubsidy.toLocaleString()}</strong>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 italic">
                * Note: खाद्य उद्योग हेतु उद्यमी योजना और PMEGP के तहत बैंकों से 90% तक लोन की विशेष सुविधा है।
              </p>
            </div>
          </div>

          <div className="border-t border-slate-200/80 pt-4 text-xs space-y-2 text-slate-500">
            <h5 className="font-semibold text-slate-600">हंसलाल पाल जी के उपयोगी सुझाव:</h5>
            <div className="flex gap-2 items-start">
              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>कच्चे माल को स्थानीय साप्ताहिक सब्जी मंडियों (हार्ट) से डायरेक्ट खरीदें ताकि ट्रांसपोर्ट ख़र्च कम हो।</span>
            </div>
            <div className="flex gap-2 items-start">
              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>FSSAI लाइसेंस और ब्रांड की आकर्षक पैकेजिंग से आप इस साधारण पाउडर को 2 गुना प्रीमियम दाम पर शहरों में बेच सकते हैं।</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
