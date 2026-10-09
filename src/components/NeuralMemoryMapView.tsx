import React, { useState } from 'react';
import { BrainCircuit, Sparkles, ChevronRight, Volume2, BookOpen, Layers, Plus } from 'lucide-react';
import { recordStudyActivity } from '../firebase';
import { playNaturalSpeech, stopNaturalSpeech } from '../utils/naturalSpeech';

interface MindNode {
  id: string;
  title: string;
  category: string;
  centralConcept: string;
  branches: {
    heading: string;
    points: string[];
    color: string;
  }[];
}

export const NeuralMemoryMapView: React.FC = () => {
  const [selectedMapId, setSelectedMapId] = useState<string>('revolt1857');
  const [customTopic, setCustomTopic] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [customMaps, setCustomMaps] = useState<MindNode[]>([]);

  const builtInMaps: MindNode[] = [
    {
      id: 'revolt1857',
      title: '1857 की क्रांति (प्रमुख केंद्र व नायक)',
      category: 'आधुनिक भारत का इतिहास',
      centralConcept: '1857 का प्रथम स्वतंत्रता संग्राम (प्रतीक: कमल और रोटी)',
      branches: [
        {
          heading: '1. दिल्ली व मेरठ केंद्र',
          color: 'border-amber-500/50 bg-amber-950/20 text-amber-300',
          points: [
            '10 मई 1857 को मेरठ से क्रांति की शुरुआत',
            'दिल्ली में सम्राट बहादुर शाह ज़फर (द्वितीय) को नेता घोषित किया गया',
            'सैन्य नेतृत्व: जनरल बख्त खान ने संभाला'
          ]
        },
        {
          heading: '2. कानपुर व लखनऊ (अवध)',
          color: 'border-cyan-500/50 bg-cyan-950/20 text-cyan-300',
          points: [
            'कानपुर: नाना साहेब (धोंधू पंत) व तात्या टोपे (रामचंद्र पांडुरंग)',
            'लखनऊ: बेगम हज़रत महल (बिरजिस कादिर को नवाब घोषित किया)',
            'दमनकर्ता: कॉलिन कैंपबेल'
          ]
        },
        {
          heading: '3. बिहार (जगदीशपुर) व झाँसी',
          color: 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300',
          points: [
            'बिहार (आरा/जगदीशपुर): 80 वर्षीय बाबू वीर कुंवर सिंह',
            'झाँसी व ग्वालियर: रानी लक्ष्मीबाई ("खूब लड़ी मर्दानी")',
            'जनरल ह्यूरोज़ ने लक्ष्मीबाई को "विद्रोहियों में अकेली मर्द" कहा'
          ]
        },
        {
          heading: '4. महत्वपूर्ण पुस्तकें व कथन',
          color: 'border-purple-500/50 bg-purple-950/20 text-purple-300',
          points: [
            'वी.डी. सावरकर: "The Indian War of Independence 1857"',
            'एस.एन. सेन: "Eighteen Fifty-Seven" (सरकारी इतिहासकार)',
            'क्रांति के समय गवर्नर जनरल: लॉर्ड कैनिंग'
          ]
        }
      ]
    },
    {
      id: 'fundamental_rights',
      title: 'मौलिक अधिकार (भाग 3: अनुच्छेद 12–35)',
      category: 'भारतीय संविधान (Polity)',
      centralConcept: 'मौलिक अधिकार (अमेरिका के संविधान से प्रेरित - भारत का मैग्नाकार्टा)',
      branches: [
        {
          heading: '1. समानता (14-18) व स्वतंत्रता (19-22)',
          color: 'border-blue-500/50 bg-blue-950/20 text-blue-300',
          points: [
            'अनुच्छेद 14: विधि के समक्ष समता; अनुच्छेद 17: अस्पृश्यता का अंत',
            'अनुच्छेद 18: उपाधियों का अंत',
            'अनुच्छेद 19(1)(a): वाक् एवं अभिव्यक्ति की स्वतंत्रता',
            'अनुच्छेद 21A: 6-14 वर्ष के बच्चों को निःशुल्क शिक्षा (86वाँ संशोधन, 2002)'
          ]
        },
        {
          heading: '2. शोषण के विरुद्ध व धार्मिक स्वतंत्रता (23-28)',
          color: 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300',
          points: [
            'अनुच्छेद 23: मानव दुर्व्यापार एवं बलात् श्रम (बेगार) का निषेध',
            'अनुच्छेद 24: कारखानों में 14 वर्ष से कम आयु के बालकों के नियोजन का प्रतिषेध',
            'अनुच्छेद 25: अंतःकरण और धर्म के अबाध रूप से मानने का अधिकार'
          ]
        },
        {
          heading: '3. संवैधानिक उपचारों का अधिकार (अनुच्छेद 32)',
          color: 'border-amber-500/50 bg-amber-950/20 text-amber-300',
          points: [
            'डॉ. अंबेडकर द्वारा "संविधान की आत्मा और हृदय" कहा गया',
            'सुप्रीम कोर्ट (अनु. 32) और हाई कोर्ट (अनु. 226) द्वारा 5 रिट जारी की जाती हैं',
            '44वें संशोधन (1978) द्वारा संपत्ति का अधिकार (अनु. 31) हटाकर अनु. 300A में विधिक अधिकार बनाया गया'
          ]
        }
      ]
    },
    {
      id: 'steno_rishi',
      title: 'ऋषि प्रणाली आशुलिपि (गति वर्धक नियम)',
      category: 'शॉर्टहैंड कौशल (80/100 WPM)',
      centralConcept: 'ऋषि प्रणाली: रेखाक्षर संकुचन, वृत्त एवं हुक के मुख्य सिद्धांत',
      branches: [
        {
          heading: '1. स/श/ज़ का वृत्त (Circle Rules)',
          color: 'border-cyan-500/50 bg-cyan-950/20 text-cyan-300',
          points: [
            'सरल रेखा में छोटा वृत्त बाईं (घड़ी की विपरीत) दिशा से जुड़ता है',
            'वक्र रेखाओं के अंदर की ओर छोटा वृत्त लगता है',
            'बड़ा वृत्त प्रारंभ में "स्व" और मध्य/अंत में "स-स" पढ़ा जाता है'
          ]
        },
        {
          heading: '2. र (R) और ल (L) के प्रारंभिक हुक',
          color: 'border-pink-500/50 bg-pink-950/20 text-pink-300',
          points: [
            'सरल रेखाओं में प्रारंभिक छोटा हुक बाईं ओर से "र" और दाईं ओर से "ल" बनाता है',
            'वक्र रेखाओं के भीतर प्रारंभ में छोटा हुक "र" और बड़ा हुक "ल" पढ़ा जाता है'
          ]
        },
        {
          heading: '3. अर्द्धीकरण (Halving) व द्विगुणन (Doubling)',
          color: 'border-amber-500/50 bg-amber-950/20 text-amber-300',
          points: [
            'रेखाक्षर को आधा (1/2) करने पर "त", "ट" या "द" जुड़ जाता है',
            'रेखाक्षर को दोगुना (2x) लंबा करने पर "तर", "दर" या "टर" जुड़ जाता है'
          ]
        }
      ]
    }
  ];

  const allMaps = [...customMaps, ...builtInMaps];
  const currentMap = allMaps.find(m => m.id === selectedMapId) || allMaps[0];

  const handleGenerateCustomMap = async () => {
    if (!customTopic.trim()) return;
    const topic = customTopic.trim();
    setCustomTopic('');
    setIsGenerating(true);

    try {
      const res = await fetch('/api/ai/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `विषय "${topic}" पर परीक्षा रिवीजन के लिए 4 मुख्य शाखाओं (Branches) में बंटा हुआ विस्तृत हिंदी सारांश बनाएं। प्रत्येक शाखा में 3 महत्वपूर्ण परीक्षा बिंदु लिखें।`,
          mode: 'chat'
        })
      });
      const data = await res.json();
      const rawText = (data.answer || '').split('\n').map((l: string) => l.trim()).filter(Boolean);

      const newId = `custom-${Date.now()}`;
      const newMap: MindNode = {
        id: newId,
        title: `${topic} (AI मेमोरी मैप)`,
        category: 'AI कस्टम न्यूरल मैप',
        centralConcept: `${topic} — सम्पूर्ण परीक्षा संरचना एवं मुख्य बिंदु`,
        branches: [
          {
            heading: `1. ${topic} : मुख्य परिचय व परिभाषा`,
            color: 'border-cyan-500/50 bg-cyan-950/20 text-cyan-300',
            points: rawText.slice(0, 3).length ? rawText.slice(0, 3) : [`${topic} का मूल सिद्धांत एवं ऐतिहासिक पृष्ठभूमि`, 'परीक्षा में पूछे जाने वाले मुख्य तथ्य']
          },
          {
            heading: `2. ${topic} : प्रमुख नियम, सूत्र व अनुच्छेद`,
            color: 'border-amber-500/50 bg-amber-950/20 text-amber-300',
            points: rawText.slice(3, 6).length ? rawText.slice(3, 6) : [`${topic} के अंतर्गत आने वाले प्रमुख बिंदु`, 'महत्वपूर्ण तिथियाँ एवं आँकड़े']
          },
          {
            heading: `3. ${topic} : परीक्षा उपयोगी प्रश्न बिंदु`,
            color: 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300',
            points: rawText.slice(6, 9).length ? rawText.slice(6, 9) : ['SSC, Railway एवं बोर्ड परीक्षा हेतु अत्यंत महत्वपूर्ण', 'त्वरित रिवीजन वन-लाइनर']
          }
        ]
      };

      setCustomMaps(prev => [newMap, ...prev]);
      setSelectedMapId(newId);
      recordStudyActivity('neural-map', topic, newMap.centralConcept, 100);
    } catch {
      // fallback
    } finally {
      setIsGenerating(false);
    }
  };

  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const speakMap = () => {
    if (isSpeaking) {
      stopNaturalSpeech();
      setIsSpeaking(false);
      return;
    }
    const text = `${currentMap.centralConcept}. ` + currentMap.branches.map(b => `${b.heading}: ${b.points.join(', ')}`).join('. ');
    setIsSpeaking(true);
    playNaturalSpeech(text, () => setIsSpeaking(false), undefined, 0.95);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900 to-indigo-950/50 p-5 sm:p-6 rounded-3xl border border-cyan-500/30 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold uppercase border border-cyan-500/30 mb-2">
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>विज़ुअल माइंड-मैपिंग इंजन (AI Neural Memory Map)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              AI न्यूरल मेमोरी मैप (Visual Concept Tree)
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              किसी भी अध्याय का नाम टाइप करें और एक ही स्क्रीन पर उसका पूरा न्यूरल मेमोरी मैप बनाएं।
            </p>
          </div>
          <button
            onClick={speakMap}
            className="px-4 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center gap-2 cursor-pointer shrink-0 self-start sm:self-auto shadow-lg"
          >
            <Volume2 className="w-4 h-4" />
            <span>पूरा मैप ऑडियो में सुनें</span>
          </button>
        </div>

        {/* Custom AI Topic Input */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-800">
          <input
            type="text"
            value={customTopic}
            onChange={e => setCustomTopic(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleGenerateCustomMap()}
            placeholder="नया न्यूरल मैप बनाने के लिए कोई भी टॉपिक लिखें (जैसे: मुगल साम्राज्य, प्रकाश का अपवर्तन, संसद)..."
            className="flex-1 bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-white outline-none"
          />
          <button
            onClick={handleGenerateCustomMap}
            disabled={isGenerating}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>{isGenerating ? 'AI मैप बन रहा है...' : 'AI न्यूरल मैप बनाएं'}</span>
          </button>
        </div>

        {/* Topic Selector */}
        <div className="flex flex-wrap gap-2 pt-2">
          {allMaps.map(m => (
            <button
              key={m.id}
              onClick={() => setSelectedMapId(m.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedMapId === m.id
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                  : 'bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-900'
              }`}
            >
              {m.title}
            </button>
          ))}
        </div>
      </div>

      {/* Central Node + Branches Diagram */}
      <div className="bg-[#091122] border-2 border-slate-800 rounded-3xl p-5 sm:p-7 space-y-6 shadow-2xl">
        {/* Central Root Node */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-cyan-950 border-2 border-cyan-400/60 text-center shadow-lg">
          <span className="text-[10px] font-black uppercase tracking-widest text-cyan-300 block mb-1">
            केंद्रीय विषय (ROOT NODE • {currentMap.category})
          </span>
          <h2 className="text-base sm:text-lg font-black text-white">{currentMap.centralConcept}</h2>
        </div>

        {/* Connected Branches */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentMap.branches.map((branch, idx) => (
            <div
              key={idx}
              className={`p-4 sm:p-5 rounded-2xl border-2 space-y-3 transition-all ${branch.color}`}
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <h3 className="text-sm font-black text-white">{branch.heading}</h3>
                <Layers className="w-4 h-4 opacity-70" />
              </div>
              <ul className="space-y-2">
                {branch.points.map((pt, pIdx) => (
                  <li key={pIdx} className="text-xs text-slate-200 flex items-start gap-2 leading-relaxed">
                    <ChevronRight className="w-3.5 h-3.5 mt-0.5 shrink-0 text-cyan-400" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
