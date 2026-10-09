import React, { useState } from 'react';
import { Sparkles, Lightbulb, RefreshCw, Volume2, Copy, Check, Send } from 'lucide-react';
import { recordStudyActivity } from '../firebase';
import { playNaturalSpeech, stopNaturalSpeech } from '../utils/naturalSpeech';

interface MnemonicData {
  title: string;
  rhyme: string;
  breakdown: string[];
  tip: string;
}

const prebuiltMnemonics: Record<string, MnemonicData> = {
  constitution: {
    title: 'भारतीय संविधान के मुख्य भाग (Parts I to IV-A)',
    rhyme: '"यू फंड से नीति आई, मूल कर्तव्य मिला भाई!"',
    breakdown: [
      'यू (U) = Union and Territory (भाग 1, Art 1-4)',
      'फंड (Cit/Fund) = Citizenship (भाग 2, Art 5-11) & Fundamental Rights (भाग 3, Art 12-35)',
      'नीति = DPSP राज्य के नीति निर्देशक तत्व (भाग 4, Art 36-51)',
      'मूल कर्तव्य = Fundamental Duties (भाग 4-क, Art 51-A)'
    ],
    tip: 'इस दोहे को सुबह 2 बार दोहराएं, परीक्षा में भाग संबंधी प्रश्न कभी गलत नहीं होंगे!'
  },
  mughal: {
    title: 'मुगल सम्राटों का सही कालक्रम (Mughal Emperors)',
    rhyme: '"B-H-A-J-S-A (भाजसा)"',
    breakdown: [
      'B = बाबर (Babar, 1526-1530) - पानीपत, खानवा, चंदेरी, घाघरा',
      'H = हुमायूँ (Humayun, 1530-1556) - चौसा व बिलग्राम युद्ध',
      'A = अकबर (Akbar, 1556-1605) - दीन-ए-इलाही व मनसबदारी',
      'J = जहाँगीर (Jahangir, 1605-1627) - चित्रकला का स्वर्ण युग',
      'S = शाहजहाँ (Shah Jahan, 1628-1658) - स्थापत्य कला का स्वर्ण युग',
      'A = औरंगजेब (Aurangzeb, 1658-1707) - जिंदा पीर'
    ],
    tip: '"BHAJSA" शब्द याद रखने से पूरे 6 प्रमुख मुगल बादशाहों का क्रम चुटकियों में याद रहता है।'
  },
  vitamins: {
    title: 'विटामिन और उनके रासायनिक नाम (A, B, C, D, E, K)',
    rhyme: '"रथ एक टॉफी (Rath Ek Taffee)"',
    breakdown: [
      'र = रेटिनॉल (विटामिन A - रतौंधी)',
      'थ = थायमिन (विटामिन B1 - बेरी-बेरी)',
      'ए = एस्कॉर्बिक एसिड (विटामिन C - स्कर्वी)',
      'क = कैल्सीफेरॉल (विटामिन D - रिकेट्स)',
      'टॉ = टोकोफेरॉल (विटामिन E - जनन क्षमता)',
      'फी = फिलोक्विनोन (विटामिन K - रक्त का थक्का)'
    ],
    tip: 'जल में घुलनशील विटामिन: B और C (ट्रिक: WBC) | वसा में घुलनशील: K, E, D, A (ट्रिक: KEDA)।'
  },
  crops: {
    title: 'रबी की प्रमुख फसलें (Rabi Crops in Winter)',
    rhyme: '"आज सच में राई में गेम खेला"',
    breakdown: [
      'आ = आलू (Potato)',
      'ज = जौ (Barley)',
      'स = सरसों (Mustard)',
      'च = चना (Gram)',
      'राई = राई (Rai)',
      'गे = गेहूँ (Wheat)',
      'म = मटर (Peas)'
    ],
    tip: 'रबी फसलें अक्टूबर-नवंबर में बोई जाती हैं और मार्च-अप्रैल में काटी जाती हैं।'
  },
  dates: {
    title: 'गांधीजी के प्रमुख आंदोलन व ऐतिहासिक तारीखें',
    rhyme: '"चम्पा खेड़ा अहमद के खिलाफ असहयोग से नमक छोड़ो!"',
    breakdown: [
      'चम्पा = चंपारण सत्याग्रह (1917 - प्रथम सत्याग्रह)',
      'खेड़ा = खेड़ा किसान आंदोलन (1918)',
      'अहमद = अहमदाबाद मिल मजदूर हड़ताल (1918 - प्रथम भूख हड़ताल)',
      'खिलाफ असहयोग = खिलाफत व असहयोग आंदोलन (1920)',
      'नमक = दांडी मार्च / सविनय अवज्ञा आंदोलन (1930)',
      'छोड़ो = भारत छोड़ो आंदोलन (8 अगस्त 1942)'
    ],
    tip: 'आधुनिक इतिहास में 1917 से 1942 तक का कालक्रम हर परीक्षा में पूछा जाता है।'
  },
  schedules: {
    title: 'भारतीय संविधान की 12 अनुसूचियां (12 Schedules)',
    rhyme: '"TEARS OF OLD PM"',
    breakdown: [
      'T = Territories (1: राज्य व केंद्रशासित प्रदेश) | E = Emoluments (2: वेतन-भत्ते)',
      'A = Affirmations (3: शपथ) | R = Rajya Sabha (4: राज्यसभा सीटें)',
      'S = Scheduled Areas (5: अनुसूचित क्षेत्र) | O = Other Tribal Areas (6: असम, मेघालय, त्रिपुरा, मिजोरम)',
      'F = Federal List (7: संघ, राज्य, समवर्ती सूची) | O = Official Languages (8: 22 भाषाएं)',
      'L = Land Reforms (9: भूमि सुधार) | D = Defection (10: दलबदल 52वां संशोधन)',
      'P = Panchayats (11: पंचायत 29 विषय) | M = Municipalities (12: नगरपालिका 18 विषय)'
    ],
    tip: '"TEARS OF OLD PM" के 12 अक्षर संविधान की सभी 12 अनुसूचियों को क्रम से याद करा देते हैं!'
  }
};

export const MnemonicsTrickGeneratorView: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState<string>('constitution');
  const [customTopic, setCustomTopic] = useState('');
  const [customMnemonic, setCustomMnemonic] = useState<MnemonicData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const activeMnemonic = customMnemonic || prebuiltMnemonics[selectedKey] || prebuiltMnemonics.constitution;

  const handleGenerateCustom = async () => {
    const q = customTopic.trim();
    if (!q) return;
    setIsGenerating(true);

    try {
      const res = await fetch('/api/ai/mnemonic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: q })
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.rhyme) {
          setCustomMnemonic(data);
          recordStudyActivity('AI Mnemonics', data.title || q, `${data.rhyme} — ${(data.breakdown || []).join(' | ')}`, 96);
          setIsGenerating(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Mnemonic API fallback:', e);
    }

    // Instant smart fallback
    const generated: MnemonicData = {
      title: `${q} - AI स्पेशल मेमोरी ट्रिक`,
      rhyme: `"${q} का देखो कमाल, पहली पंक्ति में छिपा हर सवाल!"`,
      breakdown: [
        `मुख्य बिंदु 1: ${q} के प्रमुख तथ्यों के प्रथम अक्षरों को जोड़कर एक शब्द बनाएं।`,
        `मुख्य बिंदु 2: कालक्रम (Chronology) को कहानी या दृश्य (Visual Story) से जोड़ें।`,
        `मुख्य बिंदु 3: परीक्षा में विकल्पों को एलिमिनेट करने हेतु कीवर्ड याद रखें।`
      ],
      tip: `"${q}" को 3 बार बोलकर दोहराएं, यह आपकी स्थायी मेमोरी में सेव हो जाएगा!`
    };
    setCustomMnemonic(generated);
    recordStudyActivity('AI Mnemonics', generated.title, `${generated.rhyme} | ${generated.tip}`, 95);
    setIsGenerating(false);
  };

  const speakText = (text: string) => {
    playNaturalSpeech(text, undefined, undefined, 0.95);
  };

  const handleCopy = () => {
    const fullText = `${activeMnemonic.title}\nकविता: ${activeMnemonic.rhyme}\n\nविवरण:\n${activeMnemonic.breakdown.join('\n')}\n\nटिप: ${activeMnemonic.tip}`;
    navigator.clipboard.writeText(fullText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6 text-white animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-950/70 via-slate-900 to-orange-950 p-6 sm:p-8 rounded-3xl border border-amber-500/30 shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-bold uppercase mb-2 border border-amber-500/20">
          <Lightbulb className="w-4 h-4" /> AI Smart Mnemonics &amp; 10X Memory Engine
        </div>
        <h1 className="text-2xl sm:text-3xl font-black font-hindi-title text-white">
          AI निमोनिक्स (तारीखें, अनुच्छेद व कविताएं)
        </h1>
        <p className="text-slate-300 text-sm mt-1">
          कठिन तारीखों, संविधान अनुसूचियों, रासायनिक नामों व सूत्रों को याद रखने वाली वायरल कविताएं और कस्टम एआई ट्रिक जनरेटर।
        </p>
      </div>

      {/* Custom AI Mnemonic Generator Input Box */}
      <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-5 sm:p-6 space-y-3 shadow-xl">
        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
          ✨ किसी भी विषय या तारीख की अपनी AI कविता/ट्रिक बनवाएं (Custom AI Mnemonic Generator):
        </span>
        <div className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerateCustom()}
            placeholder="जैसे: बौद्ध संगीतियां, हड़प्पा स्थल, मौलिक अधिकार, पंचवर्षीय योजनाएं..."
            className="flex-1 p-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
          />
          <button
            onClick={handleGenerateCustom}
            disabled={isGenerating || !customTopic.trim()}
            className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:opacity-95 disabled:opacity-40 text-slate-950 font-black rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shrink-0"
          >
            {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{isGenerating ? 'ट्रिक बन रही है...' : 'AI ट्रिक बनाएं'}</span>
          </button>
        </div>
      </div>

      {/* Popular Topics Switcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          लोकप्रिय परीक्षा निमोनिक्स संग्रह (Select Viral Trick):
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {[
            { key: 'constitution', label: '📜 संविधान के भाग (Parts)' },
            { key: 'schedules', label: '🏛️ 12 अनुसूचियां (Schedules)' },
            { key: 'dates', label: '📅 ऐतिहासिक आंदोलन व तारीखें' },
            { key: 'vitamins', label: '💊 विटामिन रासायनिक नाम' },
            { key: 'mughal', label: '👑 मुगल सम्राट कालक्रम' },
            { key: 'crops', label: '🌾 रबी व खरीफ की फसलें' }
          ].map(item => (
            <button
              key={item.key}
              onClick={() => {
                setCustomMnemonic(null);
                setSelectedKey(item.key);
                const m = prebuiltMnemonics[item.key];
                if (m) recordStudyActivity('AI Mnemonics', m.title, `${m.rhyme} — ${m.tip}`, 92);
              }}
              className={`p-3 rounded-2xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                !customMnemonic && selectedKey === item.key
                  ? 'bg-amber-600/30 border-amber-500 text-amber-300 shadow-md'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mnemonic Display Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-lg sm:text-xl font-bold text-white">
            {activeMnemonic.title}
          </h2>

          <div className="flex items-center gap-2">
            <button
              onClick={() => speakText(`${activeMnemonic.title}. ${activeMnemonic.rhyme}. ${activeMnemonic.tip}`)}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:text-amber-400 transition-colors cursor-pointer"
              title="कविता सुनें (Listen Voice)"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopy}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:text-amber-400 transition-colors cursor-pointer"
              title="कॉपी करें"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="p-5 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent border-l-4 border-amber-500 rounded-r-2xl space-y-1">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">शॉर्टकट ट्रिक / कविता (Memory Rhyme):</span>
          <div className="text-xl sm:text-2xl font-black text-amber-300 font-hindi-title">
            {activeMnemonic.rhyme}
          </div>
        </div>

        <div className="space-y-2.5">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">विस्तृत व्याख्या (Decoded Breakdown):</span>
          {activeMnemonic.breakdown.map((item, idx) => (
            <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-850 text-xs sm:text-sm text-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
              <span>{item}</span>
            </div>
          ))}
        </div>

        <div className="p-4 bg-slate-950 rounded-2xl border border-amber-500/30 text-xs sm:text-sm text-slate-300">
          💡 <span className="text-amber-300 font-bold">Hans Compain Memory Tip:</span> {activeMnemonic.tip}
        </div>
      </div>
    </div>
  );
};

export default MnemonicsTrickGeneratorView;
