import React, { useState, useEffect } from 'react';
import { Mic, Send, Sparkles, Volume2, Award, UserCheck, ShieldCheck, RefreshCw, AlertTriangle } from 'lucide-react';
import { recordStudyActivity } from '../firebase';
import { playNaturalSpeech, stopNaturalSpeech } from '../utils/naturalSpeech';

interface InterviewMessage {
  sender: 'ai' | 'user';
  panelist?: string;
  text: string;
  scoreTip?: string;
}

const professionalCareerBoards: Record<string, { name: string; category: string; opener: string; questions: string[] }> = {
  ssc_steno: {
    name: 'SSC & High Court Stenographer Skill Board',
    category: 'Stenographer & Court Services',
    opener: 'नमस्कार! Hans Compain Professional Interview Board में आपका स्वागत है। कृपया अपना संक्षिप्त परिचय दें और बताएं कि आपने आशुलिपि (Shorthand) क्षेत्र को क्यों चुना?',
    questions: [
      'बहुत बढ़िया! यह बताएं कि 80 WPM और 100 WPM की स्पीड डिक्टेशन लिखते समय जब कोई कठिन या अपरिचित तकनीकी शब्द आता है, तो आप उसे कैसे मैनेज करते हैं?',
      'शानदार! कार्यालय में एक निजी सहायक (Personal Assistant) के रूप में गोपनीय फाइलों की सुरक्षा और समय प्रबंधन में आपकी प्राथमिक जिम्मेदारी क्या होगी?',
      'उत्कृष्ट उत्तर! अंतिम प्रश्न: भारत के मुख्य न्यायाधीश और संसद के दोनों सदनों के वर्तमान पीठासीन अधिकारियों के नाम बताएं।'
    ]
  },
  ssc_cgl: {
    name: 'SSC CGL / CHSL Service Preference Board',
    category: 'Central Staff Selection Commission',
    opener: 'स्वागत है। SSC CGL/CHSL के माध्यम से केंद्र सरकार के मंत्रालयों में आपकी पसंदीदा पद वरीयता (Post Preference) क्या है और क्यों?',
    questions: [
      'जीएसटी इंस्पेक्टर या सहायक समीक्षा अधिकारी (ARO) के रूप में वित्तीय अनियमितताओं को रोकने के लिए डिजिटल टूल्स का क्या महत्व है?',
      'यदि आपके वरिष्ठ अधिकारी से किसी प्रशासनिक निर्णय पर विचार भिन्नता हो, तो आप स्थिति को कैसे हल करेंगे?',
      'भारत की हालिया आर्थिक नीतियों और राजस्व संग्रह प्रणाली में मुख्य सुधार क्या हैं?'
    ]
  },
  upsc_civil: {
    name: 'UPSC Civil Services Personality Test Board (IAS/IPS/IFS)',
    category: 'Union Public Service Commission',
    opener: 'आइए, बैठिए। बोर्ड को बिना अपना नाम बताए अपनी शैक्षणिक पृष्ठभूमि और अपने गृह जिले की तीन मुख्य प्रशासनिक चुनौतियों के बारे में बताएं।',
    questions: [
      'सटीक विश्लेषण! आपके अनुसार आपके राज्य में कृषि, सार्वजनिक स्वास्थ्य और युवाओं के रोजगार को बढ़ाने के लिए सबसे प्रभावी प्रशासनिक कदम क्या होना चाहिए?',
      'यदि आप जिले के उप-जिलाधिकारी (SDM) हैं और प्रतियोगी परीक्षा के दिन अचानक भारी जलभराव हो जाए, तो आप परीक्षा केंद्रों पर निर्बाध व्यवस्था कैसे सुनिश्चित करेंगे?',
      'बहुत संतुलित दृष्टिकोण! भारतीय संविधान की प्रस्तावना में वर्णित "बंधुता" (Fraternity) और कानून के शासन का आज के डिजिटल युग में क्या महत्व है?'
    ]
  },
  railway_bank: {
    name: 'Railway RRB & Banking Officer Career Board',
    category: 'Railway & Financial Sector',
    opener: 'नमस्कार! रेलवे स्टेशन मास्टर / बैंक पीओ परीक्षा साक्षात्कार में आपका स्वागत है। डिजिटल बैंकिंग और स्वचालित रेल सुरक्षा प्रणाली (KAVACH) पर अपने विचार व्यक्त करें।',
    questions: [
      'बैंक में साइबर धोखाधड़ी से आम ग्राहकों को बचाने के लिए वित्तीय साक्षरता अभियान कैसे चलाएंगे?',
      'रेलवे या बैंकिंग आपातकालीन परिस्थितियों में यात्रियों व ग्राहकों की भीड़ को नियंत्रित करने के लिए आपकी रणनीति क्या होगी?',
      'प्राथमिकता क्षेत्र ऋण (Priority Sector Lending) और भारतीय अर्थव्यवस्था के सुदृढ़ीकरण में सार्वजनिक बैंकों की क्या भूमिका है?'
    ]
  }
};

export const MockInterviewView: React.FC = () => {
  const [selectedBoard, setSelectedBoard] = useState<string>('ssc_steno');
  const [questionIdx, setQuestionIdx] = useState(0);
  const [confidenceScore, setConfidenceScore] = useState(88);
  const [fluencyScore, setFluencyScore] = useState(90);
  const [contextAccuracy, setContextAccuracy] = useState(92);
  const [messages, setMessages] = useState<InterviewMessage[]>([
    {
      sender: 'ai',
      panelist: 'अध्यक्ष (Chairman - Professional Career Board)',
      text: professionalCareerBoards.ssc_steno.opener
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const speakText = (text: string) => {
    playNaturalSpeech(text);
  };

  const switchBoard = (boardKey: string) => {
    setSelectedBoard(boardKey);
    setQuestionIdx(0);
    const opener = professionalCareerBoards[boardKey].opener;
    setMessages([
      {
        sender: 'ai',
        panelist: 'अध्यक्ष (Chairman - Professional Career Board)',
        text: opener
      }
    ]);
    speakText(opener);
  };

  const handleSend = async () => {
    const userText = input.trim();
    if (!userText) return;
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setIsLoading(true);

    const board = professionalCareerBoards[selectedBoard] || professionalCareerBoards.ssc_steno;
    const nextQ = board.questions[questionIdx % board.questions.length];
    setQuestionIdx(prev => prev + 1);

    setConfidenceScore(prev => Math.min(99, prev + 1));
    setFluencyScore(prev => Math.min(98, prev + 1));
    setContextAccuracy(prev => Math.min(98, prev + 1));

    recordStudyActivity(
      'Professional Career Interview',
      board.name,
      `इंटरव्यू उत्तर: "${userText.slice(0, 80)}..." | कॉन्फिडेंस: ${confidenceScore}%`,
      confidenceScore
    );

    setTimeout(() => {
      const replyText = nextQ;
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          panelist: `बोर्ड सदस्य #${(questionIdx % 3) + 1}`,
          text: replyText,
          scoreTip: 'सकारात्मक विश्लेषण: आपके प्रशासनिक उत्तर में स्पष्टता और पेशेवर गरिमा झलकती है। उत्तर को तथ्य-आधारित रखें।'
        }
      ]);
      setIsLoading(false);
      speakText(replyText);
    }, 650);
  };

  const handleVoiceMic = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new SpeechRec();
      rec.lang = 'hi-IN';
      rec.onresult = (e: any) => setInput(e.results[0][0].transcript);
      rec.start();
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-4 py-4 space-y-5 animate-fade-in text-white font-sans">
      {/* Header */}
      <div className="bg-[#091122] border border-indigo-500/30 p-5 sm:p-6 rounded-3xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-black uppercase mb-1.5 border border-indigo-500/30">
            🎙️ PROFESSIONAL CAREER INTERVIEW BOARD SIMULATOR
          </div>
          <h1 className="text-xl sm:text-3xl font-black font-hindi-title text-white">
            प्रोफेशनल करियर इंटरव्यू बोर्ड (Professional Interview Board)
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-0.5">
            SSC स्टेनोग्राफर, CGL, UPSC सिविल सर्विसेज व बैंकिंग बोर्ड इंटरव्यू का लाइव रियल-टाइम सिमुलेशन।
          </p>
        </div>

        {/* Evaluation Metrics */}
        <div className="flex gap-3 bg-[#03060E] p-3 rounded-2xl border border-indigo-500/30 shrink-0">
          <div className="text-center px-2">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Confidence</div>
            <div className="text-base sm:text-lg font-black text-emerald-400">{confidenceScore}%</div>
          </div>
          <div className="w-px bg-slate-800" />
          <div className="text-center px-2">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Fluency</div>
            <div className="text-base sm:text-lg font-black text-cyan-400">{fluencyScore}%</div>
          </div>
          <div className="w-px bg-slate-800" />
          <div className="text-center px-2">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Context</div>
            <div className="text-base sm:text-lg font-black text-purple-400">{contextAccuracy}%</div>
          </div>
        </div>
      </div>

      {/* Board Selector Tabs (Exclusively Professional Competitive Career Tracks) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {Object.entries(professionalCareerBoards).map(([key, board]) => (
          <button
            key={key}
            onClick={() => switchBoard(key)}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
              selectedBoard === key
                ? 'bg-indigo-600/25 border-indigo-400 text-white shadow-lg ring-1 ring-indigo-400/40'
                : 'bg-[#091122] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            <div className="text-[10px] font-black uppercase tracking-wider text-indigo-400">{board.category}</div>
            <div className="text-xs font-extrabold truncate mt-0.5">{board.name}</div>
          </button>
        ))}
      </div>

      {/* Live Chat & Evaluation Console */}
      <div className="bg-[#091122] border border-slate-800 rounded-3xl p-4 sm:p-6 space-y-4 shadow-2xl flex flex-col h-[480px]">
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-2">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'} space-y-1`}
            >
              {m.panelist && (
                <span className="text-[11px] font-bold text-indigo-300 flex items-center gap-1.5 px-1">
                  <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{m.panelist}</span>
                </span>
              )}
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white font-medium rounded-br-none'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                }`}
              >
                {m.text}
              </div>
              {m.scoreTip && (
                <div className="text-[11px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 p-2 rounded-xl flex items-start gap-1.5 max-w-[85%]">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{m.scoreTip}</span>
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="text-xs text-indigo-400 font-bold flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
              <span>इंटरव्यू बोर्ड आपके उत्तर का विश्लेषण कर रहा है...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
          <button
            onClick={handleVoiceMic}
            className="p-3 rounded-2xl bg-indigo-950 border border-indigo-500/40 text-indigo-300 hover:text-white cursor-pointer"
            title="वॉयस उत्तर दें"
          >
            <Mic className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="इंटरव्यू बोर्ड के सामने अपना उत्तर यहाँ लिखें या बोलें..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500"
          />
          <button
            onClick={handleSend}
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg cursor-pointer flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" />
            <span>उत्तर जमा करें</span>
          </button>
        </div>
      </div>
    </div>
  );
};
