import React, { useState, useEffect } from 'react';
import { Swords, Flame, Trophy, Timer, RotateCcw, Share2, CheckCircle2, User, Zap } from 'lucide-react';

interface BattleQuestion {
  question: string;
  options: string[];
  correct: number;
}

export const PeerChallengeArena: React.FC = () => {
  const [inBattle, setInBattle] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [battleFinished, setBattleFinished] = useState(false);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);

  const questions: BattleQuestion[] = [
    {
      question: 'भारत के वर्तमान मुख्य चुनाव आयुक्त (Chief Election Commissioner) कौन हैं?',
      options: ['राजीव कुमार', 'सुनील अरोड़ा', 'ज्ञानेश कुमार', 'सुशील चंद्रा'],
      correct: 0
    },
    {
      question: 'विटामिन सी (Vitamin C) का रासायनिक नाम क्या है?',
      options: ['रेटिनॉल', 'एस्कॉर्बिक एसिड', 'थायमिन', 'टोकोफेरॉल'],
      correct: 1
    },
    {
      question: 'ऋषि प्रणाली में "भारत सरकार" का संक्षिप्त वाक्यांश कैसे बनता है?',
      options: ['भ + र + स वृत्त', 'भ रेखाक्षर काटकर स वृत्त', 'भारत लिखकर ग से काटना', 'केवल भ'],
      correct: 2
    },
    {
      question: 'पानीपत की तृतीय लड़ाई (Third Battle of Panipat) किस वर्ष हुई थी?',
      options: ['1526', '1556', '1761', '1764'],
      correct: 2
    },
    {
      question: 'मानव शरीर में रक्तचाप (Blood Pressure) मापने का यंत्र कौन-सा है?',
      options: ['बैरोमीटर', 'स्फिग्मोमैनोमीटर', 'थर्मामीटर', 'स्टेथोस्कोप'],
      correct: 1
    }
  ];

  // Timer countdown
  useEffect(() => {
    let timer: any = null;
    if (inBattle && !battleFinished && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && inBattle && !battleFinished) {
      handleNextQuestion(null);
    }
    return () => clearInterval(timer);
  }, [inBattle, battleFinished, timeLeft]);

  const startBattle = () => {
    setInBattle(true);
    setCurrentQIndex(0);
    setUserScore(0);
    setBotScore(0);
    setTimeLeft(15);
    setBattleFinished(false);
    setSelectedOpt(null);
  };

  const handleSelect = (optIndex: number) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(optIndex);

    const isCorrect = optIndex === questions[currentQIndex].correct;
    if (isCorrect) setUserScore(s => s + 10);

    // Bot random answer simulation (80% chance correct)
    if (Math.random() > 0.3) {
      setBotScore(b => b + 10);
    }

    setTimeout(() => {
      handleNextQuestion(optIndex);
    }, 800);
  };

  const handleNextQuestion = (_userOpt: number | null) => {
    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex(q => q + 1);
      setTimeLeft(15);
      setSelectedOpt(null);
    } else {
      setBattleFinished(true);
    }
  };

  const currentQ = questions[currentQIndex];

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-950/60 via-slate-900 to-red-950/40 p-5 sm:p-6 rounded-3xl border border-orange-500/30 shadow-xl text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-bold uppercase border border-orange-500/30">
          <Swords className="w-3.5 h-3.5" />
          <span>1v1 लाइव स्पीड क्विज़ एरिना</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-white">
          पीयर चैलेंज एरिना (Peer Speed Battle)
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm">
          5 तीव्र प्रश्न, 15 सेकंड का टाइमर। अपने प्रतिस्पर्धी से पहले सही उत्तर देकर जीतें।
        </p>
      </div>

      {!inBattle ? (
        <div className="bg-[#091122] border-2 border-orange-500/40 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-20 h-20 rounded-3xl bg-orange-500/20 border-2 border-orange-400 mx-auto flex items-center justify-center text-4xl shadow-lg">
            ⚔️
          </div>
          <div>
            <h2 className="text-lg font-black text-white">तैयार हैं लाइव मुकाबले के लिए?</h2>
            <p className="text-xs text-slate-400 mt-1">
              आपका मुकाबला लाइव ऑनलाइन छात्र (अमित - पटना जोन) के साथ होगा।
            </p>
          </div>
          <button
            onClick={startBattle}
            className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-black text-sm rounded-2xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 mx-auto"
          >
            <Zap className="w-5 h-5 text-amber-300" />
            <span>मुकाबला शुरू करें (START BATTLE)</span>
          </button>
        </div>
      ) : battleFinished ? (
        <div className="bg-[#091122] border-2 border-amber-500/40 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <Trophy className="w-16 h-16 text-amber-400 mx-auto animate-bounce" />
          <div>
            <h2 className="text-2xl font-black text-white">
              {userScore >= botScore ? '🎉 बधाई! आप विजयी रहे (VICTORY)!' : '⚡ अच्छा प्रयास! मुकाबला कड़ा था!'}
            </h2>
            <div className="flex items-center justify-center gap-8 mt-4">
              <div className="text-center">
                <span className="text-xs text-slate-400 block font-bold">आपका स्कोर</span>
                <span className="text-3xl font-black text-emerald-400 font-mono">{userScore} अंक</span>
              </div>
              <div className="text-xl font-black text-slate-600">VS</div>
              <div className="text-center">
                <span className="text-xs text-slate-400 block font-bold">प्रतिद्वंद्वी (अमित)</span>
                <span className="text-3xl font-black text-rose-400 font-mono">{botScore} अंक</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={startBattle}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow"
            >
              <RotateCcw className="w-4 h-4" />
              <span>दोबारा मुकाबला खेलें</span>
            </button>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(
                  'क्या तुम मुझे 5 सवालों में हरा सकते हो? HANS COMPAIN ऐप पर लाइव क्विज़ चैलेंज स्वीकार करो!'
                );
              }}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow"
            >
              <Share2 className="w-4 h-4" />
              <span>मित्रों को चुनौती भेजें</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[#091122] border-2 border-orange-500/40 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
          {/* Battle Status Bar */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                आप
              </div>
              <span className="text-xs font-mono font-black text-emerald-400">{userScore} pts</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 font-mono text-xs font-bold text-amber-400">
              <Timer className="w-4 h-4" />
              <span>{timeLeft}s</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-black text-rose-400">{botScore} pts</span>
              <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-bold">
                अमित
              </div>
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-1.5 text-center">
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
              प्रश्न {currentQIndex + 1} / {questions.length}
            </span>
            <h2 className="text-base sm:text-lg font-black text-white leading-relaxed">
              {currentQ.question}
            </h2>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
            {currentQ.options.map((opt, oIdx) => {
              let btnStyle = 'bg-slate-950 border-slate-850 text-slate-300 hover:bg-slate-800';
              if (selectedOpt !== null) {
                if (oIdx === currentQ.correct) {
                  btnStyle = 'bg-emerald-950 border-emerald-500 text-emerald-200 font-bold';
                } else if (selectedOpt === oIdx) {
                  btnStyle = 'bg-rose-950 border-rose-500 text-rose-200';
                } else {
                  btnStyle = 'bg-slate-950/40 border-slate-900 text-slate-600';
                }
              }

              return (
                <button
                  key={oIdx}
                  disabled={selectedOpt !== null}
                  onClick={() => handleSelect(oIdx)}
                  className={`p-3.5 rounded-2xl border text-left text-xs transition-all flex items-center gap-2.5 cursor-pointer ${btnStyle}`}
                >
                  <span className="w-5 h-5 rounded-lg bg-slate-900 text-slate-400 text-[10px] font-bold flex items-center justify-center border border-slate-800 shrink-0">
                    {String.fromCharCode(65 + oIdx)}
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
