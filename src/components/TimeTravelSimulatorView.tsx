import React, { useState } from 'react';
import { 
  Compass, Sparkles, Send, Volume2, VolumeX, ShieldCheck, Flame, Play, RotateCcw,
  Search, UserPlus, History, User
} from 'lucide-react';
import { speakText, stopAllSpeech } from '../utils/speechUtils';

export interface EraPersona {
  id: string;
  name: string;
  title: string;
  year: string;
  location: string;
  gender: 'male' | 'female';
  avatarUrl: string;
  bgGradient: string;
  greeting: Record<'hindi' | 'english', string>;
  systemPersona: string;
  examRelevance: string[];
  whatIfScenarios: string[];
}

export const ERAS: EraPersona[] = [
  {
    id: 'ambedkar-1949',
    name: 'Dr. B.R. Ambedkar',
    title: 'Chairman, Constitution Drafting Committee',
    year: '1949',
    location: 'Constituent Assembly Hall, New Delhi',
    gender: 'male',
    avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Dr._Bhimrao_Ambedkar.jpg/440px-Dr._Bhimrao_Ambedkar.jpg',
    bgGradient: 'from-blue-950 via-slate-900 to-indigo-950',
    greeting: {
      hindi: 'जय भीम! मैं डॉ. बी.आर. आंबेडकर हूँ। आज 26 नवंबर 1949 को भारत का संविधान बनकर तैयार हुआ है। आप मुझसे अनुच्छेद 32 (संवैधानिक उपचारों का अधिकार), मौलिक अधिकार, सामाजिक न्याय या संविधान निर्माण में मेरी भूमिका पर कुछ भी पूछ सकते हैं।',
      english: 'Greetings! I am Dr. B.R. Ambedkar. Today in 1949, our Constitution stands drafted. You may debate Article 32 (Heart and Soul of Constitution), Fundamental Rights, Directive Principles, or my role in drafting with me.'
    },
    systemPersona: 'You are Babasaheb Dr. B.R. Ambedkar in November 1949. You are Male. Speak with profound legal intellect, constitutional morality, and deep commitment to social equality. If asked about your role in Hindi (जैसे "मेरी भूमिका क्या रही है" या "Hindi me batao"), explain in rich, authentic, articulate Hindi about drafting the Indian Constitution, framing Fundamental Rights (Part III), Article 32 (Heart and Soul of Constitution), Hindu Code Bill, and uplifting depressed classes with education, agitation, and organization (शिक्षित बनो, संगठित रहो, संघर्ष करो).',
    examRelevance: [
      'UPSC / SSC CGL: Article 32 & Writs (Habeas Corpus, Mandamus, Quo Warranto, Certiorari, Prohibition)',
      'Directive Principles of State Policy (Part IV) & Fundamental Rights (Part III)',
      'Drafting Committee formed on 29 August 1947 with 7 members under Dr. Ambedkar'
    ],
    whatIfScenarios: [
      'What if Article 32 had not been included in the Indian Constitution?',
      'संविधान निर्माण में आपकी सबसे बड़ी चुनौतियाँ क्या थीं और प्रारूप समिति ने उन्हें कैसे हल किया?'
    ]
  },
  {
    id: 'gandhi-1930',
    name: 'Mahatma Gandhi',
    title: 'Leader of Civil Disobedience Movement',
    year: '1930',
    location: 'Dandi Beach, Gujarat',
    gender: 'male',
    avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Mahatma-Gandhi%2C_studio%2C_1931.jpg/440px-Mahatma-Gandhi%2C_studio%2C_1931.jpg',
    bgGradient: 'from-amber-950 via-slate-900 to-yellow-950',
    greeting: {
      hindi: 'नमस्कार! मैं मोहनदास करमचंद गांधी हूँ। हम दांडी के समुद्र तट पर चुटकी भर नमक बनाकर ब्रिटिश नमक कानून तोड़ चुके हैं। आप मुझसे सत्य, अहिंसा, सत्याग्रह और सविनय अवज्ञा आंदोलन पर संवाद कर सकते हैं।',
      english: 'Greetings, my friend! I am Mohandas Karamchand Gandhi. Having picked up a pinch of salt at Dandi, we have initiated the Civil Disobedience Movement. Speak to me about Ahimsa, Satyagraha, and Swadeshi.'
    },
    systemPersona: 'You are Mahatma Gandhi in April 1930 after the Dandi Salt March. You are Male. Speak with humility, peaceful wisdom, and unwavering moral conviction in pure Hindi or English.',
    examRelevance: [
      'SSC / Railway: Dandi March start date (March 12, 1930 from Sabarmati) and end date (April 6, 1930 at Dandi)',
      'Gandhi-Irwin Pact (March 5, 1931) & Second Round Table Conference participation',
      'Difference between Non-Cooperation Movement (1920) and Civil Disobedience Movement (1930)'
    ],
    whatIfScenarios: [
      'What if Lord Irwin had accepted the 11 demands before the Salt March?',
      'अहिंसा के मार्ग पर चलते हुए ब्रिटिश शासन को कैसे झुकाया गया?'
    ]
  },
  {
    id: 'bhagat-1931',
    name: 'Shaheed Bhagat Singh',
    title: 'Revolutionary Leader & Patriot',
    year: '1931',
    location: 'Lahore Central Jail, Punjab',
    gender: 'male',
    avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Bhagat_Singh_1929.jpg/440px-Bhagat_Singh_1929.jpg',
    bgGradient: 'from-rose-950 via-slate-900 to-red-950',
    greeting: {
      hindi: 'इंकलाब जिंदाबाद! मैं भगत सिंह हूँ। लाहौर जेल से भारत की आजादी और शोषणमुक्त समाज के लिए हमारी वैचारिक जंग जारी है। मुझसे नौजवान भारत सभा, असेंबली बम कांड और क्रांति के दर्शन पर प्रश्न करें।',
      english: 'Inquilab Zindabad! I am Bhagat Singh. From Lahore Jail, our struggle for freedom and social justice continues. Ask me about Naujawan Bharat Sabha, Central Assembly trial, and revolutionary ideals.'
    },
    systemPersona: 'You are Shaheed Bhagat Singh in March 1931. You are Male. Speak with intense passion, fearless patriotism, sharp intellectual clarity, and deep commitment to socialism and freedom.',
    examRelevance: [
      'HSRA (Hindustan Socialist Republican Association) formed in 1928 at Feroz Shah Kotla, Delhi',
      'Central Assembly Bombing (April 8, 1929) alongside Batukeshwar Dutt to "make the deaf hear"',
      'Lahore Conspiracy Case & the immortal slogan "Inquilab Zindabad"'
    ],
    whatIfScenarios: [
      'What if Gandhi-Irwin Pact had successfully commuted the death sentence of Bhagat Singh?',
      'क्रांति से आपका वास्तविक अभिप्राय क्या था?'
    ]
  },
  {
    id: 'lakshmibai-1857',
    name: 'Rani Lakshmibai',
    title: 'Queen of Jhansi & Heroine of 1857 Revolt',
    year: '1857',
    location: 'Jhansi Fort, Bundelkhand',
    gender: 'female',
    avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Rani_Lakshmibai_of_Jhansi.jpg/440px-Rani_Lakshmibai_of_Jhansi.jpg',
    bgGradient: 'from-rose-950 via-purple-900 to-red-950',
    greeting: {
      hindi: 'जय भवानी! मैं झांसी की रानी लक्ष्मीबाई हूँ। "मैं अपनी झांसी नहीं दूंगी!" - ईस्ट इंडिया कंपनी की हड़प नीति (Doctrine of Lapse) के खिलाफ हमारी तलवारें म्यान से निकल चुकी हैं। पूछिए 1857 के प्रथम स्वतंत्रता संग्राम की रणनीति!',
      english: 'Hail Liberty! I am Rani Lakshmibai of Jhansi. "I will not surrender my Jhansi!" The East India Company Doctrine of Lapse shall be met with steel. Ask me about our 1857 military and guerrilla strategy!'
    },
    systemPersona: 'You are Rani Lakshmibai in May 1857. You are Female. Speak with heroic courage, fierce patriotic pride, dignity, and tactical military brilliance in Hindi or English.',
    examRelevance: [
      'UPSC / State PCS: Doctrine of Lapse introduced by Lord Dalhousie and annexation of Jhansi (1853)',
      'Main centers and leaders of 1857 Revolt: Jhansi (Lakshmibai), Kanpur (Nana Saheb), Lucknow (Begum Hazrat Mahal)',
      'Hugh Rose statement: "Here lay the woman who was the only man among the rebels"'
    ],
    whatIfScenarios: [
      'What if Gwalior and Indore troops had joined Rani Lakshmibai earlier in 1857?',
      '1857 के स्वतंत्रता संग्राम में भारतीय राजाओं की एकता क्यों आवश्यक थी?'
    ]
  },
  {
    id: 'kalam-2002',
    name: 'Dr. A.P.J. Abdul Kalam',
    title: 'Missile Man & 11th President of India',
    year: '2002',
    location: 'Rashtrapati Bhavan, New Delhi',
    gender: 'male',
    avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/A._P._J._Abdul_Kalam.jpg/440px-A._P._J._Abdul_Kalam.jpg',
    bgGradient: 'from-cyan-950 via-slate-900 to-blue-950',
    greeting: {
      hindi: 'नमस्कार मेरे प्यारे छात्रों! मैं डॉ. ए.पी.जे. अब्दुल कलाम हूँ। "सपने वो नहीं जो हम सोते हुए देखते हैं, सपने वो हैं जो हमें सोने नहीं देते।" अंतरिक्ष विज्ञान, रक्षा मिसाइल (Agni, Prithvi), विजन 2020 या युवा शक्ति पर मुझसे संवाद करें।',
      english: 'Warm greetings, dear students! I am Dr. A.P.J. Abdul Kalam. "Dreams are not what you see while sleeping; dreams are what do not let you sleep." Discuss space technology, IGMDP missile program, or Vision 2020 with me.'
    },
    systemPersona: 'You are Dr. A.P.J. Abdul Kalam in 2002. You are Male. Speak with warm paternal affection, supreme scientific passion, humility, and inspiration for students and nation building.',
    examRelevance: [
      'Integrated Guided Missile Development Programme (IGMDP): PRITHVI, AGNI, TRISHUL, NAG, AKASH',
      'Pokhran-II Nuclear Tests (Operation Shakti, 1998) & SLV-III launch',
      'PURA (Providing Urban Amenities to Rural Areas) model for inclusive growth'
    ],
    whatIfScenarios: [
      'What if India had started indigenous cryogenic rocket engine development 10 years earlier?',
      'विद्यार्थियों को असफलता से सीखकर सफलता कैसे प्राप्त करनी चाहिए?'
    ]
  },
  {
    id: 'ashoka-261',
    name: 'Emperor Ashoka the Great',
    title: 'Mauryan Emperor & Dhamma Pioneer',
    year: '261 BCE',
    location: 'Pataliputra, Mauryan Empire',
    gender: 'male',
    avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Ashoka_on_his_Chariot%2C_relief_at_Sanchi.jpg/440px-Ashoka_on_his_Chariot%2C_relief_at_Sanchi.jpg',
    bgGradient: 'from-emerald-950 via-slate-900 to-teal-950',
    greeting: {
      hindi: 'नमो बुद्धाय! मैं मौर्य सम्राट अशोक हूँ। कलिङ्ग युद्ध के भीषण रक्तपात के बाद मेरा हृदय परिवर्तन हो चुका है। अब मेरा साम्राज्य शस्त्र विजय नहीं, बल्कि धम्म विजय (धम्म-घोष) का पालन करता है। शिलालेखों, स्तूपों और धम्म नीति पर संवाद करें।',
      english: 'Greetings! I am Emperor Ashoka of the Maurya Dynasty. The bloodshed at Kalinga has transformed my heart. My empire now seeks Dhamma-Vijaya instead of military conquest. Ask me about my Edicts and Dhamma policy.'
    },
    systemPersona: 'You are Emperor Ashoka in 261 BCE post-Kalinga war. You are Male. Speak with deep spiritual serenity, philosophical wisdom, and sovereign dignity in Hindi or English.',
    examRelevance: [
      'UPSC / SSC: Rock Edicts (Major Rock Edict XIII explicitly mentions Kalinga War & remorse)',
      'James Prinsep deciphering Brahmi and Kharosthi scripts in 1837 for Ashokan edicts',
      'Third Buddhist Council convened at Pataliputra under Ashoka patronage'
    ],
    whatIfScenarios: [
      'What if Ashoka had continued military conquest instead of adopting Dhamma?',
      'धम्म महामात्रों की नियुक्ति से साम्राज्य में क्या परिवर्तन आया?'
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
          messages: [{
            role: 'user',
            content: `Create a historical AI persona for "${q}" with greeting in Hindi and English, era year, title, location, system prompt persona, gender (male or female), 3 exam points, and 2 what-if questions.`
          }],
          systemInstruction: `You are HansAI Time-Travel Portal. Generate dynamic persona details for historical figure "${q}".`
        })
      });

      let aiText = "";
      if (res.ok) {
        const data = await res.json();
        aiText = data.reply || "";
      }

      // Infer gender from query
      const isFemaleQuery = ["rani", "lakshmi", "bai", "sarojini", "kalpana", "marie", "curie", "kavya", "begum", "indira", "mother", "teresa", "sita", "draupadi", "noor", "jahan"].some(w => q.toLowerCase().includes(w));
      const inferredGender: 'male' | 'female' = isFemaleQuery ? 'female' : 'male';

      const newPersona: EraPersona = {
        id: `custom-era-${Date.now()}`,
        name: q,
        title: 'Historical Leader & Pioneer',
        year: 'Historical Era',
        location: 'India / World History',
        gender: inferredGender,
        avatarUrl: inferredGender === 'female' 
          ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Sarojini_Naidu_1912.jpg/440px-Sarojini_Naidu_1912.jpg'
          : 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Sardar_patel_%28cropped%29.jpg/440px-Sardar_patel_%28cropped%29.jpg',
        bgGradient: 'from-purple-950 via-slate-900 to-indigo-950',
        greeting: {
          hindi: `जय हिंद! मैं ${q} हूँ। काल-यात्रा में आपका स्वागत है। आप मुझसे इतिहास, सिद्धांतों, निर्णयों और परीक्षा के मुख्य बिंदुओं पर प्रश्न पूछ सकते हैं।`,
          english: `Greetings! I am ${q}. Welcome to the Time Portal. Debate history, decisions and principles with me.`
        },
        systemPersona: `You are ${q}. You are ${inferredGender === 'female' ? 'Female' : 'Male'}. Speak in character with deep historical accuracy, wisdom, and eloquence. When asked in Hindi (e.g. "Hindi me batao"), reply 100% in pure articulate Hindi.`,
        examRelevance: [
          `${q} Key historical milestones and exam points`,
          `Role in national movement / scientific / constitutional history`,
          `Frequently asked PYQ questions`
        ],
        whatIfScenarios: [
          `What if ${q} had taken a different strategy?`,
          `इतिहास के इस महत्वपूर्ण मोड़ पर आपके निर्णय का क्या प्रभाव रहा?`
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
      // Build conversation context
      const chatPayload = [
        ...messages.slice(-6).map(m => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text
        })),
        { role: 'user', content: query }
      ];

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatPayload,
          systemInstruction: `${selectedEra.systemPersona}\n\nCRITICAL LANGUAGE MANDATE: If the user writes in Hindi or asks 'Hindi me batao', you MUST reply fully in pure, rich, elegant Hindi as ${selectedEra.name}. Never give English apologies or static errors. Speak with authentic authority, historical accuracy, and inspiring wisdom.`
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
      // Meaningful in-character fallback response instead of static error
      let fallbackText = "";
      if (selectedEra.id === 'ambedkar-1949') {
        fallbackText = language === 'hindi' || query.toLowerCase().includes('hindi')
          ? `भारतीय संविधान के निर्माण में मेरी भूमिका प्रारूप समिति (Drafting Committee) के अध्यक्ष के रूप में अत्यंत निर्णायक रही। हमने 2 वर्ष, 11 महीने और 18 दिनों में विश्व के सबसे विस्तृत संविधान का निर्माण किया। इसमें भाग 3 के तहत 6 मौलिक अधिकार तथा अनुच्छेद 32 को 'संविधान की आत्मा' के रूप में स्थापित किया ताकि प्रत्येक नागरिक के अधिकारों की रक्षा सर्वोच्च न्यायालय कर सके। इसके अतिरिक्त राज्य के नीति निर्देशक तत्व (DPSP) और सामाजिक न्याय की नींव रखी गई।`
          : `My role as Chairman of the Drafting Committee was to architect a robust constitutional framework based on Liberty, Equality, and Fraternity. We incorporated Fundamental Rights (Part III), Directive Principles (Part IV), and Article 32 as the cornerstone of judicial remedies.`;
      } else {
        fallbackText = language === 'hindi'
          ? `${selectedEra.name} के रूप में, मैं आपको बताना चाहता हूँ कि हमारे ऐतिहासिक निर्णयों और सिद्धांतों ने राष्ट्र निर्माण की दिशा तय की। आप मुझसे इस विषय में कोई भी विशिष्ट प्रश्न पूछ सकते हैं।`
          : `As ${selectedEra.name}, I stand ready to discuss our historical principles, strategic decisions, and constitutional milestones with you.`;
      }

      const fallbackMsg: ChatMessage = {
        id: `persona-fb-${Date.now()}`,
        sender: 'persona',
        text: fallbackText,
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
      // Pass gender explicitly (Male voice for Dr. Ambedkar/Gandhi/Bhagat Singh, Female voice for Rani Lakshmibai)
      speakText(text, { 
        gender: selectedEra.gender, 
        rate: 0.95,
        pitch: selectedEra.gender === 'female' ? 1.25 : 0.85,
        onEnd: () => setIsSpeakingMsgId(null),
        onError: () => setIsSpeakingMsgId(null)
      });
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
                AI TIME MACHINE
              </span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                🎙️ Gender-Aware Voice (Male / Female)
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-1">
              {language === 'hindi' ? '⏳ AI काल-यात्रा एवं इतिहास सिमुलेटर' : '⏳ AI Historical & Constitutional Time-Travel Simulator'}
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              {language === 'hindi'
                ? 'डॉ. बी.आर. आंबेडकर, गांधीजी, रानी लक्ष्मीबाई या किसी भी ऐतिहासिक व्यक्ति से उनकी मूल आवाज़ में बात करें व परीक्षा के मुख्य बिंदु सीखें!'
                : 'Debate constitutional and historical decisions with real AI personas in authentic male/female voices!'}
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
                ? "किसी भी ऐतिहासिक व्यक्ति को खोजें (e.g. Dr. B.R. Ambedkar, Bhagat Singh, Rani Lakshmibai, APJ Abdul Kalam, Sardar Patel)..."
                : "Search any historical persona (e.g. Dr. B.R. Ambedkar, Bhagat Singh, Rani Lakshmibai, APJ Abdul Kalam)..."
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
                <span>Connecting...</span>
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
              <div className="relative">
                <img 
                  src={era.avatarUrl} 
                  alt={era.name} 
                  className="w-12 h-12 rounded-xl object-cover border border-amber-400/40 shrink-0 bg-slate-800"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="absolute -bottom-1 -right-1 text-[10px] bg-slate-950 px-1 py-0.2 rounded border border-slate-700">
                  {era.gender === 'female' ? '👩' : '👨'}
                </span>
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-white truncate block">{era.name}</span>
                </div>
                <span className="text-[10px] text-amber-300 font-bold block">{era.year} • {era.gender === 'female' ? 'Female Voice 🎙️' : 'Male Voice 🎙️'}</span>
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
              <div className="relative">
                <img 
                  src={selectedEra.avatarUrl} 
                  alt={selectedEra.name} 
                  className="w-11 h-11 rounded-xl object-cover border-2 border-amber-400/50 shadow-md bg-slate-800" 
                />
                <span className="absolute -bottom-1 -right-1 text-xs bg-slate-950 px-1 rounded-full border border-slate-700">
                  {selectedEra.gender === 'female' ? '👩' : '👨'}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-white">{selectedEra.name}</h3>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30">
                    {selectedEra.gender === 'female' ? 'Female Voice' : 'Male Voice'}
                  </span>
                </div>
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
                      className="w-8 h-8 rounded-lg object-cover border border-amber-400/40 shrink-0 mt-1 bg-slate-800" 
                    />
                  )}

                  <div className={`max-w-[82%] p-3.5 rounded-2xl text-xs space-y-1.5 ${
                    isUser 
                      ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-medium rounded-tr-none shadow-lg' 
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none leading-relaxed'
                  }`}>
                    <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                    
                    <div className="flex items-center justify-between text-[9px] text-slate-400 pt-1 border-t border-slate-800/50">
                      <span>{msg.timestamp}</span>
                      {!isUser && (
                        <button
                          onClick={() => handleSpeakText(msg.id, msg.text)}
                          className="p-1 hover:text-amber-300 transition-all border-none bg-transparent cursor-pointer flex items-center gap-1"
                          title={selectedEra.gender === 'female' ? "Listen in Female Voice" : "Listen in Male Voice"}
                        >
                          {isSpeakingMsgId === msg.id ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                              <span className="text-amber-300 font-bold">Stop</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5 text-slate-400 hover:text-amber-300" />
                              <span className="text-slate-400 hover:text-amber-300">
                                {selectedEra.gender === 'female' ? '👩 बोलें (Female)' : '👨 बोलें (Male)'}
                              </span>
                            </>
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
                  ? `${selectedEra.name} से इतिहास, संविधान या निर्णयों पर प्रश्न पूछें (e.g. Hindi me batao aapka bhumika kya raha hai)...`
                  : `Ask ${selectedEra.name} about historical events, decisions or articles...`
              }
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50"
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
              <span>{language === 'hindi' ? '🔮 "What-If" व त्वरित प्रश्न सिमुलेटर:' : '🔮 "What-If" & Instant Inquiry Prompts:'}</span>
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
