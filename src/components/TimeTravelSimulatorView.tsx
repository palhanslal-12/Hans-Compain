import React, { useState } from 'react';
import { History, Sparkles, MessageSquare, Volume2, BookOpen, Award, Send } from 'lucide-react';
import { recordStudyActivity } from '../firebase';
import { playNaturalSpeech, stopNaturalSpeech } from '../utils/naturalSpeech';

interface HistoricalPersona {
  id: string;
  name: string;
  era: string;
  title: string;
  avatar: string;
  greeting: string;
  examFacts: string[];
  sampleDialogues: { prompt: string; reply: string }[];
}

export const TimeTravelSimulatorView: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('bhagat');
  const [activePromptIndex, setActivePromptIndex] = useState<number>(0);
  const [customQuestion, setCustomQuestion] = useState<string>('');
  const [customConversations, setCustomConversations] = useState<{ q: string; a: string }[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const personas: HistoricalPersona[] = [
    {
      id: 'bhagat',
      name: 'शहीद भगत सिंह (Shaheed Bhagat Singh)',
      era: '1907 – 23 मार्च 1931 (लाहौर षड्यंत्र व HSRA)',
      title: 'भारतीय स्वतंत्रता संग्राम के महान क्रांतिकारी',
      avatar: '🇮🇳',
      greeting:
        'इंकलाब ज़िंदाबाद! मित्र, गोलियों और बमों से क्रांति नहीं आती, क्रांति की तलवार तो विचारों की सान पर तेज़ होती है। पूछो, उस दौर के संघर्ष के बारे में क्या जानना चाहते हो?',
      examFacts: [
        '1926 में "नौजवान भारत सभा" की स्थापना भगत सिंह ने पंजाब में की थी।',
        '1928 में दिल्ली के फिरोज़शाह कोटला में चंद्रशेखर आज़ाद के साथ "हिंदुस्तान सोशलिस्ट रिपब्लिकन एसोसिएशन" (HSRA) का गठन किया।',
        '8 अप्रैल 1929 को बटुकेश्वर दत्त के साथ केंद्रीय विधानसभा (Central Legislative Assembly) में पब्लिक सेफ्टी बिल और ट्रेड डिस्प्यूट्स बिल के विरोध में बम फेंका।',
        'प्रसिद्ध पुस्तक: "मैं नास्तिक क्यों हूँ" (Why I am an Atheist - 1930, लाहौर सेंट्रल जेल)।'
      ],
      sampleDialogues: [
        {
          prompt: '8 अप्रैल 1929 को असेंबली में बम फेंकने का मुख्य उद्देश्य क्या था?',
          reply:
            'हमारा उद्देश्य किसी की जान लेना कतई नहीं था, इसीलिए हमने खाली बेंचों पर कम तीव्रता वाला धुएं का बम फेंका और भागने के बजाय अपनी गिरफ्तारी दी। हमारा पर्चा स्पष्ट था: "बहरे कानों को सुनाने के लिए धमाके की आवश्यकता होती है।" हम ब्रिटिश सरकार के दमनकारी Public Safety Bill और Trade Disputes Bill का पर्दाफाश करना चाहते थे।'
        },
        {
          prompt: 'एचएसआरए (HSRA) में "सोशलिस्ट" शब्द क्यों जोड़ा गया?',
          reply:
            '1928 में फिरोज़शाह कोटला की बैठक में हमने तय किया कि हमारी लड़ाई केवल अंग्रेजों को भगाने तक सीमित नहीं है, बल्कि एक ऐसे भारत का निर्माण करना है जहाँ मनुष्य द्वारा मनुष्य का और एक राष्ट्र द्वारा दूसरे राष्ट्र का शोषण समाप्त हो। इसी समाजवादी लक्ष्य के लिए HRA का नाम बदलकर HSRA किया गया।'
        }
      ]
    },
    {
      id: 'ambedkar',
      name: 'डॉ. भीमराव रामजी अंबेडकर (Dr. B.R. Ambedkar)',
      era: '1891 – 1956 (संविधान निर्माण व सामाजिक न्याय)',
      title: 'प्रारूप समिति के अध्यक्ष एवं भारत के प्रथम कानून मंत्री',
      avatar: '⚖️',
      greeting:
        'जय भीम! शिक्षा वह शेरनी का दूध है जो पिएगा वह दहाड़ेगा। भारतीय संविधान की संरचना, मूल अधिकारों या ऐतिहासिक संधियों के विषय में अपना प्रश्न पूछें।',
      examFacts: [
        '29 अगस्त 1947 को गठित 7-सदस्यीय "प्रारूप समिति" (Drafting Committee) के अध्यक्ष चुने गए।',
        'अनुच्छेद 32 (संवैधानिक उपचारों का अधिकार) को डॉ. अंबेडकर ने "संविधान की आत्मा और हृदय" (Heart and Soul of the Constitution) कहा।',
        'तीनों गोलमेज सम्मेलनों (1930, 1931, 1932 - लंदन) में भाग लेने वाले प्रमुख भारतीय नेता।',
        '1924 में "बहिष्कृत हितकारिणी सभा" और 1936 में "इंडिपेंडेंट लेबर पार्टी" की स्थापना की; प्रमुख पत्रिका: "मूकनायक" (1920)।'
      ],
      sampleDialogues: [
        {
          prompt: 'आपने अनुच्छेद 32 को संविधान की आत्मा और हृदय क्यों कहा?',
          reply:
            'यदि मुझे इस संविधान का कोई एक अनुच्छेद बताना हो जिसके बिना यह संविधान शून्य हो जाएगा, तो मैं अनुच्छेद 32 को छोड़कर किसी और का नाम नहीं लूँगा। केवल मौलिक अधिकार लिख देने से नागरिकों की रक्षा नहीं होती; अनुच्छेद 32 सर्वोच्च न्यायालय को 5 रिट (बंदी प्रत्यक्षीकरण, परमादेश, प्रतिषेध, उत्प्रेषण, अधिकार-पृच्छा) जारी करने की शक्ति देता है।'
        },
        {
          prompt: '1932 का पूना पैक्ट (Poona Pact) क्या था?',
          reply:
            '24 सितंबर 1932 को यरवदा सेंट्रल जेल (पुणे) में महात्मा गांधी और मेरे बीच यह ऐतिहासिक समझौता हुआ। इसमें दलित वर्गों (Depressed Classes) के लिए पृथक निर्वाचिका के स्थान पर प्रांतीय विधानमंडलों में आरक्षित सीटों की संख्या 71 से बढ़ाकर 147 (या 148) कर दी गई।'
        }
      ]
    },
    {
      id: 'chanakya',
      name: 'आचार्य चाणक्य (कौटिल्य / विष्णुगुप्त)',
      era: 'चौथी शताब्दी ईसा पूर्व (मौर्य साम्राज्य व तक्षशिला)',
      title: 'अर्थशास्त्र के रचयिता एवं चंद्रगुप्त मौर्य के प्रधानमंत्री',
      avatar: '📜',
      greeting:
        'कल्याण हो! तक्षशिला के प्रांगण और पाटलिपुत्र के राजदरबार से मैं विष्णुगुप्त तुम्हारा स्वागत करता हूँ। राज्य के सप्तांग सिद्धांत या मौर्य प्रशासन पर क्या जिज्ञासा है?',
      examFacts: [
        'कौटिल्य का "अर्थशास्त्र" मुख्य रूप से राजनीति, लोक प्रशासन और राजव्यवस्था (Statecraft & Polity) का ग्रंथ है, जो 15 अधिकरणों और 180 प्रकरणों में विभाजित है।',
        'राज्य का "सप्तांग सिद्धांत": स्वामी (राजा), अमात्य (मंत्री), जनपद (क्षेत्र व प्रजा), दुर्ग (किला), कोष (खजाना), दंड/बल (सेना), और मित्र (सहयोगी)।',
        'नंद वंश के अंतिम शासक धनानंद को पराजित कर 322 ईसा पूर्व में चंद्रगुप्त मौर्य ने मौर्य वंश की स्थापना की।'
      ],
      sampleDialogues: [
        {
          prompt: 'अर्थशास्त्र में वर्णित राज्य के "सप्तांग सिद्धांत" के 7 अंग कौन-से हैं?',
          reply:
            'जिस प्रकार मानव शरीर विभिन्न अंगों से मिलकर चलता है, उसी प्रकार राज्य के सात अंग हैं: 1. स्वामी (राजा - मस्तिष्क), 2. अमात्य (योग्य मंत्री - आँखें), 3. जनपद (भूमि व जनसंख्या - जंघाएं), 4. दुर्ग (सुरक्षित किला - बाहें), 5. कोष (राजकोष - मुख), 6. दंड या सेना (बल - मन), और 7. सुहृद या मित्र (कान)।'
        }
      ]
    },
    {
      id: 'bose',
      name: 'नेताजी सुभाष चंद्र बोस (Netaji Subhas Chandra Bose)',
      era: '1897 – 1945 (आज़ाद हिंद फौज व फॉरवर्ड ब्लॉक)',
      title: 'आज़ाद हिंद सरकार के सर्वोच्च सेनापति',
      avatar: '🎖️',
      greeting:
        'जय हिंद! "तुम मुझे खून दो, मैं तुम्हें आज़ादी दूँगा!" स्वतंत्रता भीख में नहीं मिलती, उसे छीनना पड़ता है। आज़ाद हिंद फौज और स्वतंत्रता संघर्ष के बारे में पूछो!',
      examFacts: [
        '1938 (हरिपुरा) और 1939 (त्रिपुरी) कांग्रेस अधिवेशन के अध्यक्ष चुने गए; 1939 में "फॉरवर्ड ब्लॉक" की स्थापना की।',
        '21 अक्टूबर 1943 को सिंगापुर में "आज़ाद हिंद सरकार" (आरज़ी हुकूमत-ए-आज़ाद हिंद) का गठन किया।',
        'प्रसिद्ध पुस्तक: "द इंडियन स्ट्रगल" (The Indian Struggle); नारा: "दिल्ली चलो" और "जय हिंद"।'
      ],
      sampleDialogues: [
        {
          prompt: '1939 के त्रिपुरी संकट और फॉरवर्ड ब्लॉक के गठन की कहानी क्या थी?',
          reply:
            '1939 के त्रिपुरी कांग्रेस अधिवेशन में चुनाव जीतने के बाद कार्यकारिणी गठन पर वैचारिक मतभेद होने के कारण मैंने अध्यक्ष पद से त्यागपत्र दे दिया (जिसके बाद डॉ. राजेंद्र प्रसाद अध्यक्ष बने) और मई 1939 में कांग्रेस के भीतर ही वामपंथी व क्रांतिकारी शक्तियों को एकजुट करने के लिए "फॉरवर्ड ब्लॉक" की स्थापना की।'
        }
      ]
    }
  ];

  const currentPersona = personas.find(p => p.id === selectedId) || personas[0];
  const currentDialogue = currentPersona.sampleDialogues[activePromptIndex] || currentPersona.sampleDialogues[0];

  const speakResponse = (text: string) => {
    playNaturalSpeech(text, undefined, undefined, 0.94);
  };

  const handleAskCustomQuestion = async () => {
    if (!customQuestion.trim()) return;
    const q = customQuestion.trim();
    setCustomQuestion('');
    setIsGenerating(true);

    try {
      const res = await fetch('/api/ai/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `आप ${currentPersona.name} (${currentPersona.era}) हैं। छात्र ने आपसे पूछा है: "${q}"। कृपया प्रथम पुरुष (First Person - जैसे स्वयं ${currentPersona.name} बोल रहे हों) में ऐतिहासिक तथ्यों और परीक्षा उपयोगी तारीखों के साथ हिंदी में उत्तर दें।`,
          mode: 'chat'
        })
      });
      const data = await res.json();
      const reply = data.answer || currentDialogue.reply;
      setCustomConversations(prev => [{ q, a: reply }, ...prev]);
      recordStudyActivity('time-travel', `${currentPersona.name}: ${q}`, reply.slice(0, 200), 100);
    } catch {
      setCustomConversations(prev => [{ q, a: currentDialogue.reply }, ...prev]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/50 p-5 sm:p-6 rounded-3xl border border-purple-500/30 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold uppercase border border-purple-500/30 mb-2">
              <History className="w-3.5 h-3.5" />
              <span>ऐतिहासिक संवाद सिमुलेटर (AI Time-Travel)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              काल-यात्रा: महान महापुरुषों से सीधा संवाद ⏳
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              शहीद भगत सिंह, डॉ. अंबेडकर, चाणक्य और सुभाष चंद्र बोस से खुद अपना कोई भी ऐतिहासिक प्रश्न पूछें।
            </p>
          </div>
        </div>

        {/* Persona Switcher */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 mt-4 pt-4 border-t border-slate-800">
          {personas.map(p => (
            <button
              key={p.id}
              onClick={() => {
                setSelectedId(p.id);
                setActivePromptIndex(0);
              }}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                selectedId === p.id
                  ? 'bg-purple-600/25 border-purple-400 text-white shadow-lg'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <span className="text-2xl shrink-0">{p.avatar}</span>
              <div className="min-w-0">
                <div className="text-xs font-black truncate">{p.name}</div>
                <div className="text-[10px] text-purple-300 truncate">{p.era}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Dialogue & Exam Facts Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 7 Cols: Interactive Persona Conversation */}
        <div className="lg:col-span-7 bg-[#091122] border border-purple-500/30 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400 flex items-center justify-center text-2xl shrink-0">
                  {currentPersona.avatar}
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-white">{currentPersona.name}</h2>
                  <p className="text-xs text-purple-300">{currentPersona.title}</p>
                </div>
              </div>
              <button
                onClick={() => speakResponse(currentDialogue.reply)}
                className="p-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-500/40 cursor-pointer flex items-center gap-1 text-xs font-bold shrink-0"
              >
                <Volume2 className="w-4 h-4" />
                <span>आवाज़ सुनें</span>
              </button>
            </div>

            {/* Greeting */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-300 italic leading-relaxed">
              &ldquo;{currentPersona.greeting}&rdquo;
            </div>

            {/* Interactive Question Selector */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-purple-300 uppercase tracking-wider block">
                प्रमुख ऐतिहासिक प्रश्न चुनें:
              </span>
              <div className="space-y-2">
                {currentPersona.sampleDialogues.map((d, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePromptIndex(idx)}
                    className={`w-full p-3 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      activePromptIndex === idx
                        ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                    <span>{d.prompt}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Answer Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/40 to-slate-950 border border-purple-500/40 space-y-2">
              <span className="text-[10px] font-black uppercase text-amber-300 block">
                🎙️ {currentPersona.name} का उत्तर:
              </span>
              <p className="text-xs sm:text-sm text-slate-100 leading-relaxed">
                {currentDialogue.reply}
              </p>
            </div>

            {/* Live Custom AI Question Input */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <span className="text-[11px] font-black text-cyan-300 uppercase block">
                ✨ {currentPersona.name} से अपना खुद का सवाल पूछें (Live AI Dialogue):
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customQuestion}
                  onChange={e => setCustomQuestion(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAskCustomQuestion()}
                  placeholder={`${currentPersona.name} से कोई भी ऐतिहासिक सवाल पूछें...`}
                  className="flex-1 bg-slate-950 border border-slate-800 focus:border-purple-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
                <button
                  onClick={handleAskCustomQuestion}
                  disabled={isGenerating}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <span>{isGenerating ? 'सोच रहे हैं...' : 'पूछें'}</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              {customConversations.map((conv, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-1.5 mt-2">
                  <div className="text-xs font-bold text-cyan-300">आपका प्रश्न: {conv.q}</div>
                  <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">{conv.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 5 Cols: High-Yield Exam Facts */}
        <div className="lg:col-span-5 bg-[#091122] border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-amber-400 font-black text-sm border-b border-slate-800 pb-3">
            <Award className="w-4 h-4" />
            <span>परीक्षा उपयोगी गोल्डन पॉइंट्स (Exam Hits)</span>
          </div>
          <div className="space-y-3">
            {currentPersona.examFacts.map((fact, fIdx) => (
              <div
                key={fIdx}
                className="p-3.5 rounded-2xl bg-slate-950 border border-slate-850 text-xs text-slate-200 leading-relaxed flex items-start gap-2.5"
              >
                <span className="w-5 h-5 rounded-lg bg-amber-500/20 text-amber-300 font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {fIdx + 1}
                </span>
                <span>{fact}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
