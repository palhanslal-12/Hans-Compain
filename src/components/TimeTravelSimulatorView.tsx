import React, { useState, useRef } from 'react';
import { 
  Compass, Sparkles, Send, Volume2, VolumeX, MessageSquare, 
  HelpCircle, BookOpen, Clock, ShieldCheck, Flame, UserCheck, Play, RotateCcw,
  Search, Plus, UserPlus
} from 'lucide-react';
import { speakText, stopAllSpeech } from '../utils/speechUtils';

interface EraPersona {
  id: string;
  name: string;
  title: string;
  year: string;
  location: string;
  avatarUrl: string;
  bgGradient: string;
  greeting: Record<'hindi' | 'english', string>;
  systemPersona: string;
  examRelevance: string[];
  whatIfScenarios: string[];
}

const ERAS: EraPersona[] = [
  {
    id: 'ambedkar-1949',
    name: 'Dr. B.R. Ambedkar',
    title: 'Chairman, Constitution Drafting Committee',
    year: '1949',
    location: 'Constituent Assembly Hall, New Delhi',
    avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200',
    bgGradient: 'from-blue-950 via-slate-900 to-indigo-950',
    greeting: {
      hindi: 'जय भीम! मैं डॉ. बी.आर. आंबेडकर हूँ। आज 26 नवंबर 1949 को भारत का संविधान बनकर तैयार हुआ है। आप मुझसे अनुच्छेद 32 (संवैधानिक उपचारों का अधिकार), मौलिक अधिकार या आरक्षण नीति पर कुछ भी पूछ सकते हैं।',
      english: 'Greetings! I am Dr. B.R. Ambedkar. Today in 1949, our Constitution stands drafted. You may debate Article 32 (Heart and Soul of Constitution), Fundamental Rights, or Directive Principles with me.'
    },
    systemPersona: 'You are Dr. B.R. Ambedkar in November 1949. Speak with immense intellect, legal authority, and deep commitment to social equality and constitutional morality. Answer in the same language as the user query (Hindi or English).',
    examRelevance: [
      'UPSC / SSC CGL: Article 32 & Writs (Habeas Corpus, Mandamus, Certiorari)',
      'Directive Principles of State Policy (Part IV)',
      'Difference between Fundamental Rights and Legal Rights'
    ],
    whatIfScenarios: [
      'What if Article 32 had not been included in the Constitution?',
      'What if India had adopted a Presidential System instead of Parliamentary?'
    ]
  },
  {
    id: 'gandhi-1930',
    name: 'Mahatma Gandhi',
    title: 'Leader of Civil Disobedience Movement',
    year: '1930',
    location: 'Dandi Beach, Gujarat',
    avatarUrl: 'https://images.unsplash.com/photo-1509021436471-1513076b225a?w=200',
    bgGradient: 'from-amber-950 via-slate-900 to-yellow-950',
    greeting: {
      hindi: 'नमस्कार! मैं मोहनदास करमचंद गांधी हूँ। हम दांडी के समुद्र तट पर चुटकी भर नमक बनाकर ब्रिटिश नमक कानून तोड़ चुके हैं। आप मुझसे सत्य, अहिंसा और सविनय अवज्ञा आंदोलन पर संवाद कर सकते हैं।',
      english: 'Greetings, my friend! I am Mohandas Karamchand Gandhi. Having picked up a pinch of salt at Dandi, we have initiated the Civil Disobedience Movement. Speak to me about Ahimsa, Satyagraha, and Swadeshi.'
    },
    systemPersona: 'You are Mahatma Gandhi in April 1930 after the Dandi Salt March. Speak with humility, peaceful wisdom, and unwavering moral conviction. Answer in Hindi or English according to the query.',
    examRelevance: [
      'SSC / Railway: Dandi March start date (March 12, 1930) and end date (April 6, 1930)',
      'Gandhi-Irwin Pact 1931 & Round Table Conferences',
      'Difference between Non-Cooperation (1920) and Civil Disobedience (1930)'
    ],
    whatIfScenarios: [
      'What if Lord Irwin had accepted the 11 demands before the Salt March?',
      'What if violence had erupted during the Dandi March?'
    ]
  },
  {
    id: 'bhagat-1931',
    name: 'Shaheed Bhagat Singh',
    title: 'Revolutionary Leader & Patriot',
    year: '1931',
    location: 'Lahore Central Jail, Punjab',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    bgGradient: 'from-rose-950 via-slate-900 to-red-950',
    greeting: {
      hindi: 'इंकलाब जिंदाबाद! मैं भगत सिंह हूँ। लाहौर जेल से भारत की आजादी और समाजवाद के लिए हमारी वैचारिक जंग जारी है। मुझसे नौजवान भारत सभा, असेंबली बम कांड और क्रांति के दर्शन पर प्रश्न करें।',
      english: 'Inquilab Zindabad! I am Bhagat Singh. From Lahore Jail, our struggle for freedom and social justice continues. Ask me about Naujawan Bharat Sabha, Central Assembly trial and revolutionary ideals.'
    },
    systemPersona: 'You are Bhagat Singh in March 1931. Speak with intense passion, fearless patriotism, Marxist ideology, and deep clarity on revolution. Answer in Hindi or English.',
    examRelevance: [
      'HSRA (Hindustan Socialist Republican Association) formed in 1928 at Feroz Shah Kotla',
      'Central Assembly Bombing (April 8, 1929) alongside Batukeshwar Dutt',
      'Lahore Conspiracy Case & Saunders'
    ],
    whatIfScenarios: [
      'What if Gandhi-Irwin Pact had successfully commuted the death sentence of Bhagat Singh?',
      'What if HSRA had transformed into a mass political party?'
    ]
  },
  {
    id: 'lakshmibai-1857',
    name: 'Rani Lakshmibai',
    title: 'Queen of Jhansi & Heroine of 1857 Revolt',
    year: '1857',
    location: 'Jhansi Fort, Bundelkhand',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    bgGradient: 'from-rose-950 via-slate-900 to-red-950',
    greeting: {
      hindi: 'जय भवानी! मैं झांसी की रानी लक्ष्मीबाई हूँ। "मैं अपनी झांसी नहीं दूंगी!" - ईस्ट इंडिया कंपनी के हड़प नीति (Doctrine of Lapse) के खिलाफ हमारी तलवारें म्यान से निकल चुकी हैं। पूछिए 1857 की क्रांति की रणनीति!',
      english: 'Hail Liberty! I am Rani Lakshmibai of Jhansi. "I will not surrender my Jhansi!" The East India Company Doctrine of Lapse shall be met with steel. Ask me about our 1857 strategy!'
    },
    systemPersona: 'You are Rani Lakshmibai in May 1857. Speak with heroic courage, fierce patriotic pride, and tactical military brilliance. Answer in Hindi or English.',
    examRelevance: [
      'UPSC / State PCS: Doctrine of Lapse introduced by Lord Dalhousie',
      'Main centers and leaders of 1857 Revolt (Jhansi, Kanpur, Lucknow, Delhi)',
      'Causes for the partial failure of the 1857 Uprising'
    ],
    whatIfScenarios: [
      'What if Gwalior and Indore troops had joined Rani Lakshmibai earlier?',
      'What if the Doctrine of Lapse was never implemented?'
    ]
  },
  {
    id: 'ashoka-261',
    name: 'Emperor Ashoka the Great',
    title: 'Mauryan Emperor',
    year: '261 BCE',
    location: 'Pataliputra, Mauryan Empire',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    bgGradient: 'from-emerald-950 via-slate-900 to-teal-950',
    greeting: {
      hindi: 'नमो बुद्धाय! मैं मौर्य सम्राट अशोक हूँ। कलिङ्ग युद्ध के भीषण रक्तपात के बाद मेरा हृदय परिवर्तन हो चुका है। अब मेरा साम्राज्य शस्त्र विजय नहीं, बल्कि धम्म विजय का पालन करता है। शिलालेखों और धम्म नीति पर संवाद करें।',
      english: 'Greetings! I am Emperor Ashoka of the Maurya Dynasty. The bloodshed at Kalinga has transformed my heart. My empire now seeks Dhamma-Vijaya instead of military conquest. Ask me about my Edicts and Dhamma.'
    },
    systemPersona: 'You are Emperor Ashoka in 261 BCE post-Kalinga war. Speak with deep spiritual serenity, philosophical wisdom, and sovereign dignity. Answer in Hindi or English.',
    examRelevance: [
      'UPSC / SSC: Rock Edicts (Major Rock Edict XIII mentions Kalinga War)',
      'James Prinsep deciphering Brahmi script in 1837',
      'Third Buddhist Council at Pataliputra under Ashoka'
    ],
    whatIfScenarios: [
      'What if Ashoka had continued military expansion towards South India?',
      'What if the Rock Edicts had not survived into modern times?'
    ]
  }
];

interface ChatMessage {
  id: string;
  sender: 'user' | 'persona';
  text: string;
  timestamp: string;
}

interface TimeTravelSimulatorViewProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info' | 'warn') => void;
  language: 'english' | 'hindi' | 'spanish' | 'french' | 'german';
}

export const TimeTravelSimulatorView: React.FC<TimeTravelSimulatorViewProps> = ({ showToast, language }) => {
  const [eraList, setEraList] = useState<EraPersona[]>(ERAS);
  const [selectedEra, setSelectedEra] = useState<EraPersona>(ERAS[0]);
  const [searchPersonaQuery, setSearchPersonaQuery] = useState<string>('');
  const [isSearchingPersona, setIsSearchingPersona] = useState<boolean>(false);
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'persona',
      text: ERAS[0].greeting[language === 'hindi' ? 'hindi' : 'english'],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeakingMsgId, setIsSpeakingMsgId] = useState<string | null>(null);

  const handleSelectEra = (era: EraPersona) => {
    setSelectedEra(era);
    stopAllSpeech();
    setIsSpeakingMsgId(null);
    setMessages([
      {
        id: `init-${Date.now()}`,
        sender: 'persona',
        text: era.greeting[language === 'hindi' ? 'hindi' : 'english'],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // SEARCH ANY HISTORICAL PERSONA / ERA OR CREATE WITH AI
  const handleSearchPersona = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = searchPersonaQuery.trim();
    if (!q) return;

    // Check existing
    const existing = eraList.find(p => p.name.toLowerCase().includes(q.toLowerCase()) || p.title.toLowerCase().includes(q.toLowerCase()));
    if (existing) {
      handleSelectEra(existing);
      showToast(`⏳ Switched time travel to ${existing.name}`, "success");
      setSearchPersonaQuery('');
      return;
    }

    setIsSearchingPersona(true);
    showToast(language === 'hindi' ? `⌛ "${q}" की काल-यात्रा हेतु टाइम मशीन ट्यून हो रही है...` : `⌛ Preparing AI time-travel portal for "${q}"...`, "info");

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Create a historical AI persona for "${q}" with greeting in Hindi and English, era year, title, location, system prompt persona, 3 exam points, and 2 what-if questions.`,
          systemInstruction: `You are HansAI Time-Travel Portal. Generate dynamic persona details for historical figure "${q}".`
        })
      });

      let aiText = "";
      if (res.ok) {
        const data = await res.json();
        aiText = data.reply || "";
      }

      const newPersona: EraPersona = {
        id: `custom-era-${Date.now()}`,
        name: q,
        title: 'Historical Leader & Pioneer',
        year: 'Historical Era',
        location: 'India / World History',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        bgGradient: 'from-purple-950 via-slate-900 to-indigo-950',
        greeting: {
          hindi: `जय हिंद! मैं ${q} हूँ। काल-यात्रा में आपका स्वागत है। आप मुझसे इतिहास, दर्शन और सिद्धांतों पर प्रश्न पूछ सकते हैं।`,
          english: `Greetings! I am ${q}. Welcome to the Time Portal. Debate history, decisions and principles with me.`
        },
        systemPersona: `You are ${q}. Speak in character with deep historical accuracy, wisdom and eloquence. Answer in Hindi or English.`,
        examRelevance: [
          `${q} Key historical milestones and exam points`,
          `Role in national movement / scientific / constitutional history`,
          `Frequently asked PYQ questions`
        ],
        whatIfScenarios: [
          `What if ${q} had taken a different strategy?`,
          `What if the socio-political climate was different?`
        ]
      };

      setEraList(prev => [...prev, newPersona]);
      handleSelectEra(newPersona);
      setSearchPersonaQuery('');
      showToast(language === 'hindi' ? `✨ "${q}" के साथ समय-यात्रा शुरू!` : `✨ Time Travel initialized with "${q}"!`, "success");
    } catch (err) {
      showToast("Could not generate persona, try another query.", "error");
    } finally {
      setIsSearchingPersona(false);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          systemInstruction: selectedEra.systemPersona
        })
      });

      if (res.ok) {
        const data = await res.json();
        const personaMsg: ChatMessage = {
          id: `persona-${Date.now()}`,
          sender: 'persona',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, personaMsg]);
      } else {
        throw new Error("Failed to talk with persona");
      }
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: `persona-err-${Date.now()}`,
        sender: 'persona',
        text: language === 'hindi'
          ? `क्षमा करें, समय-यात्रा पोर्टल में कुछ बाधा आई है। कृपया पुनः प्रयास करें।`
          : `Apologies, temporal static intercepted our communication. Please ask again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeakText = (msgId: string, text: string) => {
    if (isSpeakingMsgId === msgId) {
      stopAllSpeech();
      setIsSpeakingMsgId(null);
    } else {
      stopAllSpeech();
      setIsSpeakingMsgId(msgId);
      speakText(text, { rate: 0.95 });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-3 sm:p-6 text-slate-100 space-y-6">
      
      {/* HEADER BAR */}
      <div className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-amber-950/80 border border-purple-500/30 p-5 rounded-3xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/20 shrink-0">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-widest border border-amber-500/30">
                2030 TIME MACHINE
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-1">
              {language === 'hindi' ? '⏳ AI काल-यात्रा एवं इतिहास सिमुलेटर' : '⏳ AI Historical & Constitutional Time-Travel Simulator'}
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              {language === 'hindi'
                ? 'डॉ. आंबेडकर, गांधीजी या किसी भी ऐतिहासिक व्यक्ति से बात करें, "What-If" प्रश्न पूछें व PYQ सीखें!'
                : 'Debate constitutional and historical decisions with real AI personas & test what-if scenarios!'}
            </p>
          </div>
        </div>
      </div>

      {/* UNIVERSAL HISTORICAL PERSONA SEARCH BAR */}
      <form onSubmit={handleSearchPersona} className="relative w-full">
        <div className="bg-slate-900 border-2 border-purple-500/40 focus-within:border-purple-400 rounded-2xl p-1.5 flex items-center gap-2 shadow-xl">
          <Search className="w-5 h-5 text-purple-400 ml-3 shrink-0" />
          <input
            type="text"
            value={searchPersonaQuery}
            onChange={(e) => setSearchPersonaQuery(e.target.value)}
            placeholder={
              language === 'hindi'
                ? "किसी भी ऐतिहासिक व्यक्ति को खोजें या नया समय बनाएं (e.g. Bhagat Singh, Subhash Chandra Bose, Aryabhata, Akbar, APJ Abdul Kalam)..."
                : "Search any historical persona or era (e.g. Bhagat Singh, Subhash Chandra Bose, Aryabhata)..."
            }
            className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none px-2 py-1 font-medium"
            disabled={isSearchingPersona}
          />
          <button
            type="submit"
            disabled={isSearchingPersona || !searchPersonaQuery.trim()}
            className="px-4 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-black rounded-xl text-xs transition-all border-none cursor-pointer flex items-center gap-2 shrink-0 active:scale-95 disabled:opacity-40"
          >
            {isSearchingPersona ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>{language === 'hindi' ? 'काल-यात्रा शुरू करें' : 'Start Time-Travel'}</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* PERSONA SELECTION CAROUSEL */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
        {eraList.map((era) => {
          const isSelected = era.id === selectedEra.id;
          return (
            <button
              key={era.id}
              onClick={() => handleSelectEra(era)}
              className={`flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer text-left shrink-0 max-w-xs ${
                isSelected 
                  ? 'bg-gradient-to-r from-purple-900/80 to-indigo-900/80 border-amber-400 shadow-xl ring-2 ring-amber-400/30' 
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              <img 
                src={era.avatarUrl} 
                alt={era.name} 
                className="w-11 h-11 rounded-xl object-cover border border-amber-400/40 shrink-0" 
              />
              <div className="overflow-hidden">
                <span className="text-xs font-black text-white truncate block">{era.name}</span>
                <span className="text-[10px] text-amber-300 font-bold block">{era.year} • {era.location}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* MAIN CONVERSATION & EXAM RELEVANCE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT: CHAT INTERFACE WITH HISTORICAL PERSONA (7 COLS) */}
        <div className="lg:col-span-7 bg-[#080C16] border border-slate-800 rounded-3xl shadow-2xl flex flex-col h-[580px] overflow-hidden">
          
          {/* CHAT HEADER */}
          <div className={`p-4 bg-gradient-to-r ${selectedEra.bgGradient} border-b border-slate-800 flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <img 
                src={selectedEra.avatarUrl} 
                alt={selectedEra.name} 
                className="w-10 h-10 rounded-xl object-cover border-2 border-amber-400/50 shadow-md" 
              />
              <div>
                <h3 className="text-sm font-black text-white">{selectedEra.name}</h3>
                <p className="text-[10px] text-amber-200 font-bold">{selectedEra.title} ({selectedEra.year})</p>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Temporal Connection Active
            </span>
          </div>

          {/* CHAT MESSAGES LOG */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div 
                  key={msg.id} 
                  className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <img 
                      src={selectedEra.avatarUrl} 
                      alt="Avatar" 
                      className="w-7 h-7 rounded-lg object-cover border border-amber-400/40 shrink-0 mt-1" 
                    />
                  )}

                  <div className={`max-w-[82%] p-3.5 rounded-2xl text-xs space-y-1 ${
                    isUser 
                      ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-medium rounded-tr-none shadow-lg' 
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none leading-relaxed'
                  }`}>
                    <p className="whitespace-pre-line">{msg.text}</p>
                    
                    <div className="flex items-center justify-between text-[9px] text-slate-400 pt-1">
                      <span>{msg.timestamp}</span>
                      {!isUser && (
                        <button
                          onClick={() => handleSpeakText(msg.id, msg.text)}
                          className="p-1 hover:text-amber-300 transition-all border-none bg-transparent cursor-pointer"
                        >
                          {isSpeakingMsgId === msg.id ? (
                            <VolumeX className="w-3 h-3 text-amber-400" />
                          ) : (
                            <Volume2 className="w-3 h-3 text-slate-400 hover:text-white" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-amber-300 font-bold bg-slate-900/60 p-3 rounded-2xl w-fit border border-slate-800">
                <Compass className="w-4 h-4 animate-spin text-amber-400" />
                <span>{selectedEra.name} {language === 'hindi' ? 'उत्तर सोच रहे हैं...' : 'is responding from history...'}</span>
              </div>
            )}
          </div>

          {/* CHAT INPUT FORM */}
          <div className="p-3 bg-slate-950 border-t border-slate-850 flex items-center gap-2">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={
                language === 'hindi'
                  ? `${selectedEra.name} से इतिहास, संविधान या निर्णयों पर प्रश्न पूछें...`
                  : `Ask ${selectedEra.name} about historical events, articles or strategy...`
              }
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputQuery.trim()}
              className="p-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 rounded-xl font-bold transition-all border-none cursor-pointer disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* RIGHT: EXAM PYQ RELEVANCE & WHAT-IF SCENARIO ENGINE (5 COLS) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* EXAM RELEVANCE BADGES */}
          <div className="bg-[#0A0E1A] border border-amber-500/30 p-4 rounded-3xl space-y-3 shadow-xl">
            <div className="flex items-center gap-2 text-amber-400 font-black text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>{language === 'hindi' ? '🎯 प्रतियोगी परीक्षा दृष्टिकोण (Exam Points):' : '🎯 Exam High-Yield Points:'}</span>
            </div>

            <ul className="space-y-2">
              {selectedEra.examRelevance.map((point, idx) => (
                <li key={idx} className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 flex items-start gap-2">
                  <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* "WHAT-IF" HISTORICAL SCENARIO PROMPTS */}
          <div className="bg-gradient-to-br from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 p-4 rounded-3xl space-y-3 shadow-xl">
            <div className="flex items-center gap-2 text-indigo-300 font-black text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>{language === 'hindi' ? '🔮 "What-If" काल्पनिक इतिहास सिमुलेटर:' : '🔮 "What-If" Historical Simulator:'}</span>
            </div>

            <div className="space-y-2">
              {selectedEra.whatIfScenarios.map((scenario, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(scenario)}
                  className="w-full text-left p-3 bg-slate-900/90 hover:bg-indigo-900/40 border border-indigo-500/20 hover:border-indigo-400 rounded-2xl text-xs font-bold text-indigo-100 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <span>{scenario}</span>
                  <Play className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-125 transition-transform shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

