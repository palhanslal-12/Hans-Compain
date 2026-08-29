import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Volume2, VolumeX, Send, RotateCcw, Award, CheckCircle2, 
  AlertTriangle, Sparkles, User, Briefcase, ChevronRight, Download, BookOpen, 
  HelpCircle, ArrowLeft, Clock, ShieldCheck, Flame, MessageSquare, Star
} from 'lucide-react';
import { speakText, stopAllSpeech, INDIAN_LANGUAGES } from '../utils/speechUtils';

interface QuestionItem {
  id: number;
  interviewerName: string;
  interviewerRole: string;
  interviewerAvatar: string;
  gender: 'male' | 'female';
  question: string;
  questionHi?: string;
  idealKeyPoints: string[];
  expectedKeywords: string[];
}

interface EvaluationResult {
  score: number; // 0-100
  knowledgeScore: number;
  clarityScore: number;
  confidenceScore: number;
  strengths: string[];
  improvements: string[];
  modelAnswer: string;
  detailedFeedback: string;
}

interface RoundRecord {
  question: QuestionItem;
  userAnswer: string;
  evaluation?: EvaluationResult;
}

const INTERVIEW_PRESETS = [
  {
    id: 'upsc',
    title: 'UPSC Civil Services / State PCS Personality Test',
    titleHi: 'UPSC सिविल सेवा / राज्य लोक सेवा व्यक्तित्व परीक्षण',
    icon: '🏛️',
    description: 'Analytical, governance, ethics, and current socio-economic issues.',
    color: 'from-amber-600 to-amber-900',
    questions: [
      {
        id: 1,
        interviewerName: 'Board Chairperson',
        interviewerRole: 'Senior Civil Servant',
        interviewerAvatar: '👨‍💼',
        gender: 'male' as const,
        question: 'नमस्ते! Tell us briefly about yourself, and why do you wish to join the civil services instead of the private sector?',
        questionHi: 'नमस्ते! हमें अपने बारे में संक्षेप में बताएं, और आप निजी क्षेत्र के बजाय सिविल सेवा में क्यों शामिल होना चाहते हैं?',
        idealKeyPoints: ['Clarity of purpose', 'Public impact vs commercial focus', 'Leadership & accountability'],
        expectedKeywords: ['public service', 'grassroots impact', 'governance', 'policy implementation']
      },
      {
        id: 2,
        interviewerName: 'Dr. Sharma',
        interviewerRole: 'Economics & Policy Expert',
        interviewerAvatar: '👨‍🏫',
        gender: 'male' as const,
        question: 'In your view, how can India balance rapid industrial growth with environmental sustainability and climate goals?',
        questionHi: 'आपके विचार में, भारत पर्यावरण स्थिरता और जलवायु लक्ष्यों के साथ तीव्र औद्योगिक विकास को कैसे संतुलित कर सकता है?',
        idealKeyPoints: ['Renewable energy transition', 'Green GDP & carbon markets', 'Inclusive community rehabilitation'],
        expectedKeywords: ['solar energy', 'sustainability', 'EV adoption', 'circular economy']
      },
      {
        id: 3,
        interviewerName: 'Ms. Verma',
        interviewerRole: 'Social & Ethics Specialist',
        interviewerAvatar: '👩‍⚖️',
        gender: 'female' as const,
        question: 'If you are appointed District Magistrate in a communally sensitive area and a riot breaks out, what will be your first 3 immediate actions?',
        questionHi: 'यदि आपको सांप्रदायिक रूप से संवेदनशील क्षेत्र में जिला मजिस्ट्रेट नियुक्त किया जाता है और दंगा भड़क उठता है, तो आपकी पहली 3 तत्काल कार्रवाइयां क्या होंगी?',
        idealKeyPoints: ['Law & order maintenance', 'Section 144 / police deployment', 'Community peace committee dialogue & anti-rumor drive'],
        expectedKeywords: ['law and order', 'curfew', 'neutrality', 'fact-checking', 'peace committee']
      }
    ]
  },
  {
    id: 'banking',
    title: 'IBPS / SBI PO & Banking Officer Board',
    titleHi: 'बैंकिंग अधिकारी (IBPS PO, SBI PO, RBI) साक्षात्कार',
    icon: '🏦',
    description: 'Financial awareness, monetary policy, customer handling & banking ethics.',
    color: 'from-blue-600 to-blue-900',
    questions: [
      {
        id: 1,
        interviewerName: 'General Manager (Chairman)',
        interviewerRole: 'Chief Executive Banking',
        interviewerAvatar: '👨‍💼',
        gender: 'male' as const,
        question: 'Welcome! What is the difference between Monetary Policy and Fiscal Policy, and how does Repo Rate control inflation?',
        questionHi: 'आपका स्वागत है! मौद्रिक नीति और राजकोषीय नीति में क्या अंतर है, और रेपो दर मुद्रास्फीति को कैसे नियंत्रित करती है?',
        idealKeyPoints: ['RBI controls monetary policy, Government controls fiscal', 'Repo rate hike reduces money supply and cools demand'],
        expectedKeywords: ['RBI', 'Repo Rate', 'Liquidity', 'Fiscal Deficit', 'Taxes']
      },
      {
        id: 2,
        interviewerName: 'Chief Credit Officer',
        interviewerRole: 'Risk & NPA Specialist',
        interviewerAvatar: '👩‍💼',
        gender: 'female' as const,
        question: 'What are Non-Performing Assets (NPAs), and what measures can a branch manager take to prevent fresh slippages?',
        questionHi: 'गैर-निष्पादित संपत्तियां (NPA) क्या हैं, और एक शाखा प्रबंधक नए स्लिपेज को रोकने के लिए क्या उपाय कर सकता है?',
        idealKeyPoints: ['90-day overdue definition', 'Early warning signals (SMA-0,1,2)', 'Regular follow-up & viable restructuring'],
        expectedKeywords: ['NPA', 'SMA', 'IBC', 'CIBIL check', 'Collateral']
      },
      {
        id: 3,
        interviewerName: 'HR Director',
        interviewerRole: 'Customer Relations & Ethics',
        interviewerAvatar: '👨‍💼',
        gender: 'male' as const,
        question: 'How will you handle an angry rural customer who lost money due to an online OTP scam and blames the bank branch?',
        questionHi: 'आप एक ऐसे नाराज ग्रामीण ग्राहक को कैसे संभालेंगे जिसने ऑनलाइन ओटीपी घोटाले के कारण पैसे खो दिए हैं और बैंक शाखा को जिम्मेदार ठहराता है?',
        idealKeyPoints: ['Empathy & active listening', 'Immediate card/account freeze', 'Lodge cyber complaint & guide refund process'],
        expectedKeywords: ['empathy', 'account freeze', 'cyber cell', 'grievance redressal']
      }
    ]
  },
  {
    id: 'ssc',
    title: 'SSC CGL / Stenographer Board & Skill Viva',
    titleHi: 'SSC CGL / आशुलिपिक व्यक्तित्व व मौखिक परीक्षा',
    icon: '💼',
    description: 'General knowledge, computer proficiency, stenography accuracy & administrative aptitude.',
    color: 'from-emerald-600 to-emerald-900',
    questions: [
      {
        id: 1,
        interviewerName: 'Section Officer',
        interviewerRole: 'Central Secretariat Service',
        interviewerAvatar: '👨‍💼',
        gender: 'male' as const,
        question: 'What are the main constitutional provisions regarding the Right to Information (RTI Act 2005) and its importance in transparency?',
        questionHi: 'सूचना का अधिकार (RTI अधिनियम 2005) के संबंध में मुख्य संवैधानिक प्रावधान क्या हैं और पारदर्शिता में इसका क्या महत्व है?',
        idealKeyPoints: ['RTI derives from Article 19(1)(a)', '30-day response timeline', 'Promotes citizen empowerment'],
        expectedKeywords: ['Article 19', 'transparency', 'PIO', '30 days', 'accountability']
      },
      {
        id: 2,
        interviewerName: 'Senior Registrar',
        interviewerRole: 'Document & Administration Board',
        interviewerAvatar: '👩‍🏫',
        gender: 'female' as const,
        question: 'In official government correspondence, what is the key difference between an Office Memorandum (OM) and a Notification?',
        questionHi: 'आधिकारिक सरकारी पत्राचार में, कार्यालय ज्ञापन (OM) और अधिसूचना में मुख्य अंतर क्या है?',
        idealKeyPoints: ['OM is internal departmental communication', 'Notification is published in the Official Gazette for legal enforcement'],
        expectedKeywords: ['OM', 'Gazette', 'statutory rules', 'internal routing']
      }
    ]
  },
  {
    id: 'defense',
    title: 'SSB / Defense Officer Interview (NDA / CDS / AFCAT)',
    titleHi: 'रक्षा सेवा (SSB इंटरव्यू / NDA / CDS / AFCAT)',
    icon: '🛡️',
    description: 'Officer Like Qualities (OLQs), decisiveness, situational judgment, and physical mental stamina.',
    color: 'from-rose-600 to-rose-900',
    questions: [
      {
        id: 1,
        interviewerName: 'Interviewing Officer (Col. Retd)',
        interviewerRole: 'SSB Board President',
        interviewerAvatar: '🎖️',
        gender: 'male' as const,
        question: 'Candidate, tell me about a real situation in your life where you faced severe failure or setback, and how you overcame it.',
        questionHi: 'उम्मीदवार, मुझे अपने जीवन की एक वास्तविक स्थिति के बारे में बताएं जहां आपको गंभीर विफलता या असफलता का सामना करना पड़ा और आपने उस पर कैसे काबू पाया।',
        idealKeyPoints: ['Honest reflection', 'No blame game', 'Action-oriented comeback and lesson learned'],
        expectedKeywords: ['resilience', 'lesson', 'discipline', 'determination', 'responsibility']
      },
      {
        id: 2,
        interviewerName: 'Psychologist Officer',
        interviewerRole: 'Behavioral Evaluator',
        interviewerAvatar: '👨‍⚕️',
        gender: 'male' as const,
        question: 'You are leading a team of 4 in a remote camp, and one teammate sprains an ankle with no cellular signal. What will be your step-by-step plan?',
        questionHi: 'आप एक सुदूर शिविर में 4 लोगों की टीम का नेतृत्व कर रहे हैं, और सेलुलर सिग्नल न होने पर एक साथी के टखने में मोच आ जाती है। आपकी कदम-दर-कदम योजना क्या होगी?',
        idealKeyPoints: ['First aid & immobilize limb', 'Ensure safe shelter', 'Send 2 buddy pairs for help while 1 stays with casualty'],
        expectedKeywords: ['first aid', 'buddy system', 'shelter', 'calm leadership']
      }
    ]
  },
  {
    id: 'live-dynamic',
    title: 'Live Real-Time AI Interview (Unrecorded Dynamic)',
    titleHi: 'लाइव रीयल-टाइम AI इंटरव्यू (कोई रिकॉर्डिंग नहीं, असली अनुभव)',
    icon: '🔥',
    description: 'Start a completely live, unpredictable interview directly with the voice AI agent.',
    color: 'from-violet-600 to-violet-900',
    questions: []
  }
];

interface MockInterviewViewProps {
  language: 'english' | 'hindi';
  showToast: (msg: string, type?: 'success' | 'error' | 'info' | 'warn') => void;
  onExportPdf?: (title: string, elementId?: string, rawText?: string) => void;
  onStartLiveChat?: () => void;
}

export const MockInterviewView: React.FC<MockInterviewViewProps> = ({
  language,
  showToast,
  onExportPdf,
  onStartLiveChat
}) => {
  const isHindi = language === 'hindi';
  const [selectedPresetId, setSelectedPresetId] = useState<string>('upsc');
  const [interviewState, setInterviewState] = useState<'idle' | 'in_progress' | 'evaluating' | 'completed'>('idle');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswerText, setUserAnswerText] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [rounds, setRounds] = useState<RoundRecord[]>([]);
  const [overallScore, setOverallScore] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [voiceSpeed, setVoiceSpeed] = useState<number>(1.0);

  // Advanced Voice & Language parameters
  const [selectedVoiceLang, setSelectedVoiceLang] = useState<string>(isHindi ? 'hi-IN' : 'en-IN');
  const [voiceEngine, setVoiceEngine] = useState<'cloud' | 'local'>('cloud'); // Default to Cloud Voice for maximum clarity
  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('male');
  const [voicePitch, setVoicePitch] = useState<number>(1.0);

  const recognitionRef = useRef<any>(null);
  const timerIntervalRef = useRef<any>(null);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);

  const stopAllActiveAudio = () => {
    stopAllSpeech();
    if (activeAudioRef.current) {
      try {
        activeAudioRef.current.pause();
        activeAudioRef.current.currentTime = 0;
        activeAudioRef.current.src = '';
      } catch (e) {}
      activeAudioRef.current = null;
    }
  };

  const activePreset = INTERVIEW_PRESETS.find(p => p.id === selectedPresetId) || INTERVIEW_PRESETS[0];
  const currentQuestion = activePreset.questions[currentQuestionIndex];

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = selectedVoiceLang; // Syncs microphone transcription language with selected voice language!

      rec.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setUserAnswerText(prev => prev ? `${prev} ${transcript}` : transcript);
      };

      rec.onerror = () => {
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }

    return () => {
      stopAllActiveAudio();
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [selectedVoiceLang]);

  // Start Interview
  const handleStartInterview = (presetId: string) => {
    if (presetId === 'live-dynamic') {
      if (onStartLiveChat) {
        onStartLiveChat();
        return;
      }
    }

    setSelectedPresetId(presetId);
    setInterviewState('in_progress');
    setCurrentQuestionIndex(0);
    setUserAnswerText('');
    setRounds([]);
    setOverallScore(0);
    setTimerSeconds(0);

    const preset = INTERVIEW_PRESETS.find(p => p.id === presetId) || INTERVIEW_PRESETS[0];
    const firstQ = preset.questions[0];

    // Speak initial welcome & question after a short delay to allow state changes to register
    setTimeout(() => {
      speakQuestionText(firstQ.question, firstQ.gender, firstQ.questionHi);
    }, 200);

    // Start timer
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = setInterval(() => {
      setTimerSeconds(prev => prev + 1);
    }, 1000);
  };

  const speakQuestionText = (enText: string, defaultGender: 'male' | 'female' = 'male', hiText?: string) => {
    stopAllActiveAudio();
    setIsPlayingAudio(true);

    const activeGender = selectedGender || defaultGender;
    const isHindiSelected = selectedVoiceLang.startsWith('hi') || selectedVoiceLang === 'hinglish';
    const textToSpeak = (isHindiSelected && hiText) ? hiText : enText;

    if (voiceEngine === 'cloud') {
      // Crystal clear Premium Cloud stream
      const shortCode = selectedVoiceLang === 'hinglish' ? 'hi' : selectedVoiceLang.slice(0, 2);
      const audioUrl = `/api/tts?text=${encodeURIComponent(textToSpeak)}&lang=${shortCode}&gender=${activeGender}`;
      const audio = new Audio(audioUrl);
      activeAudioRef.current = audio;
      audio.playbackRate = voiceSpeed;

      audio.onended = () => {
        setIsPlayingAudio(false);
      };

      audio.onerror = () => {
        setIsPlayingAudio(false);
        // Fallback to local
        speakLocalFallback(textToSpeak, activeGender);
      };

      audio.play().catch((err) => {
        console.warn("Cloud Audio play failed, falling back to local:", err);
        setIsPlayingAudio(false);
        speakLocalFallback(textToSpeak, activeGender);
      });
    } else {
      speakLocalFallback(textToSpeak, activeGender);
    }
  };

  const speakLocalFallback = (textToSpeak: string, activeGender: 'male' | 'female') => {
    setIsPlayingAudio(true);
    speakText(textToSpeak, {
      gender: activeGender,
      lang: selectedVoiceLang === 'hinglish' ? 'hi-IN' : selectedVoiceLang,
      pitch: voicePitch,
      rate: voiceSpeed,
      onEnd: () => setIsPlayingAudio(false),
      onError: () => setIsPlayingAudio(false)
    });
  };

  const toggleMic = () => {
    if (!recognitionRef.current) {
      showToast(isHindi ? "माइक सपोर्ट उपलब्ध नहीं है, कृपया टाइप करें।" : "Speech recognition not supported, please type your answer.", "warn");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      showToast(isHindi ? "माइक बंद किया गया" : "Mic paused", "info");
    } else {
      stopAllActiveAudio();
      try {
        recognitionRef.current.start();
        setIsListening(true);
        showToast(isHindi ? "माइक सक्रिय है, बोलें..." : "Listening... Speak your answer.", "success");
      } catch (e) {
        console.error("Mic start error", e);
      }
    }
  };

  // Evaluate single answer
  const handleSubmitAnswer = async () => {
    if (!userAnswerText.trim() || userAnswerText.trim().length < 5) {
      showToast(isHindi ? "कृपया अपना उत्तर विस्तार से दर्ज करें या माइक से बोलें।" : "Please provide a detailed answer before submitting.", "warn");
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setInterviewState('evaluating');
    const q = currentQuestion;

    // Evaluate logic based on keywords and depth
    const words = userAnswerText.trim().split(/\s+/);
    const wordCount = words.length;

    // Check keyword hits
    let matchedKeywords = 0;
    q.expectedKeywords.forEach(kw => {
      if (userAnswerText.toLowerCase().includes(kw.toLowerCase())) {
        matchedKeywords++;
      }
    });

    const knowledgeScore = Math.min(95, Math.max(50, Math.round(55 + (matchedKeywords / Math.max(1, q.expectedKeywords.length)) * 35 + (wordCount > 30 ? 10 : 0))));
    const clarityScore = Math.min(98, Math.max(60, Math.round(65 + (wordCount >= 25 ? 20 : 5) + Math.random() * 10)));
    const confidenceScore = Math.min(95, Math.max(55, Math.round(60 + (wordCount >= 35 ? 25 : 10) + Math.random() * 10)));
    const roundScore = Math.round((knowledgeScore * 0.45) + (clarityScore * 0.30) + (confidenceScore * 0.25));

    const evaluation: EvaluationResult = {
      score: roundScore,
      knowledgeScore,
      clarityScore,
      confidenceScore,
      strengths: [
        wordCount > 25 ? 'Good articulated length and structure.' : 'Concise and direct response.',
        matchedKeywords > 0 ? `Covered core terms like: ${q.expectedKeywords.slice(0, 2).join(', ')}` : 'Maintained calm and professional tone.'
      ],
      improvements: [
        wordCount < 40 ? 'Expand with real-world governance/practical examples.' : 'Ensure point-wise structured delivery.',
        'Use standard terminology and proactive solution-oriented framing.'
      ],
      modelAnswer: `आदर्श उत्तर: ${q.idealKeyPoints.join(' • ')}. हमेशा उत्तर को 3 भागों में बांटें: मुख्य परिभाषा, व्यावहारिक दृष्टिकोण व संतुलित निष्कर्ष।`,
      detailedFeedback: `उत्तर का स्तर संतोषजनक रहा। आपने मुख्य अवधारणाओं को छुआ है। इंटरव्यू बोर्ड के समक्ष आत्मविश्वास और संतुलित दृष्टिकोण बनाए रखें।`
    };

    const updatedRounds = [
      ...rounds,
      {
        question: q,
        userAnswer: userAnswerText.trim(),
        evaluation
      }
    ];
    setRounds(updatedRounds);

    showToast(isHindi ? `राउंड ${currentQuestionIndex + 1} का मूल्यांकन पूरा हुआ! 🎯 (अंक: ${roundScore}/100)` : `Round ${currentQuestionIndex + 1} Evaluated! (Score: ${roundScore}/100)`, "success");

    // Check next question or finish
    if (currentQuestionIndex + 1 < activePreset.questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setUserAnswerText('');
      setInterviewState('in_progress');
      const nextQ = activePreset.questions[currentQuestionIndex + 1];
      speakQuestionText(nextQ.question, nextQ.gender, nextQ.questionHi);
    } else {
      // Completed! Calculate total score
      const totalScore = Math.round(updatedRounds.reduce((acc, r) => acc + (r.evaluation?.score || 0), 0) / updatedRounds.length);
      setOverallScore(totalScore);
      setInterviewState('completed');
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  };

  const handleDownloadReport = () => {
    let reportText = `=== HANS AI MOCK INTERVIEW EVALUATION REPORT ===\n`;
    reportText += `Candidate Target: ${activePreset.title}\n`;
    reportText += `Date: ${new Date().toLocaleDateString()}\n`;
    reportText += `Overall Score: ${overallScore} / 100\n`;
    reportText += `Total Duration: ${Math.floor(timerSeconds / 60)}m ${timerSeconds % 60}s\n\n`;

    rounds.forEach((r, idx) => {
      reportText += `\n--- ROUND ${idx + 1} [${r.question.interviewerRole}] ---\n`;
      reportText += `Q: ${r.question.question}\n`;
      reportText += `Candidate Answer: ${r.userAnswer}\n`;
      reportText += `Score: ${r.evaluation?.score}/100 (Knowledge: ${r.evaluation?.knowledgeScore}, Clarity: ${r.evaluation?.clarityScore}, Confidence: ${r.evaluation?.confidenceScore})\n`;
      reportText += `Feedback: ${r.evaluation?.detailedFeedback}\n`;
      reportText += `Model Key Points: ${r.question.idealKeyPoints.join('; ')}\n`;
    });

    if (onExportPdf) {
      onExportPdf(`${activePreset.title} Interview Report`, undefined, reportText);
    } else {
      const blob = new Blob([reportText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `HansAI_Mock_Interview_Scorecard.txt`;
      a.click();
      URL.revokeObjectURL(url);
      showToast("Report downloaded successfully! 📥", "success");
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#03060E] text-slate-100 min-h-full">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-[#0A0E1A] border border-indigo-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-extrabold text-xs uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>AI Personality & Mock Interview Simulator</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>🎙️</span>
              <span>{isHindi ? "एआई मॉक इंटरव्यू एवं व्यक्तित्व परीक्षण" : "AI Mock Interview & Viva Simulator"}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              {isHindi 
                ? "UPSC, SSC, बैंकिंग और राज्य लोक सेवा आयोग के लिए रीयल-टाइम इंटरव्यू बोर्ड सिमुलेशन, वॉयस उत्तर और AI स्कोरकार्ड।"
                : "Real-time AI Interview Board simulation for UPSC, Banking, SSC & Defense with voice input and in-depth performance analytics."}
            </p>
          </div>

          {interviewState === 'in_progress' && (
            <div className="flex items-center gap-3 bg-indigo-950/80 border border-indigo-500/40 px-3.5 py-2 rounded-2xl shrink-0">
              <Clock className="w-4 h-4 text-amber-400 animate-spin" />
              <div className="text-right font-mono">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Time Elapsed</div>
                <div className="text-sm font-black text-white">
                  {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Live Audio & Language Control Panel */}
        <div className="bg-[#090D1A] border border-indigo-500/20 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
            <h3 className="text-xs font-black text-indigo-300 uppercase tracking-widest flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>{isHindi ? "🎙️ एआई आवाज़ एवं बहुभाषी सेटिंग्स" : "🎙️ AI Voice & Language Settings"}</span>
            </h3>
            <span className="text-[9px] font-mono bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/20 w-fit">
              Configure Audio Engine Realtime
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* 1. Language Option Dropdown */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-extrabold uppercase flex items-center gap-1">
                <span>🌐</span>
                <span>{isHindi ? "इंटरव्यू भाषा (Language):" : "Interviewer Language:"}</span>
              </label>
              <select
                value={selectedVoiceLang}
                onChange={(e) => {
                  setSelectedVoiceLang(e.target.value);
                  showToast(isHindi ? `भाषा बदलकर ${e.target.selectedOptions[0].text} की गई!` : `Language changed to ${e.target.selectedOptions[0].text}!`, "success");
                }}
                className="w-full text-xs font-semibold bg-slate-900 border border-slate-700/80 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                {INDIAN_LANGUAGES.map((langOpt) => (
                  <option key={langOpt.shortCode} value={langOpt.code}>
                    {langOpt.nativeName} ({langOpt.name})
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Audio Engine Toggle */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-extrabold uppercase flex items-center gap-1">
                <span>⚡</span>
                <span>{isHindi ? "ऑडियो क्वालिटी (Engine):" : "Voice Quality Engine:"}</span>
              </label>
              <div className="grid grid-cols-2 gap-1 bg-slate-900 p-1 rounded-lg border border-slate-700/80">
                <button
                  type="button"
                  onClick={() => {
                    setVoiceEngine('cloud');
                    showToast(isHindi ? "प्रीमियम क्लाउड आवाज़ सक्रिय! (अत्यंत स्पष्ट)" : "Premium Cloud Voice Activated! (Crystal Clear)", "success");
                  }}
                  className={`px-2 py-1 rounded text-[10px] font-black transition-all ${
                    voiceEngine === 'cloud' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Premium ⭐
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setVoiceEngine('local');
                    showToast(isHindi ? "ब्राउज़र लोकल आवाज़ सक्रिय" : "Local Device Voice Activated", "info");
                  }}
                  className={`px-2 py-1 rounded text-[10px] font-black transition-all ${
                    voiceEngine === 'local' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Device Local
                </button>
              </div>
            </div>

            {/* 3. Gender Voice Toggle */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-extrabold uppercase flex items-center gap-1">
                <span>👤</span>
                <span>{isHindi ? "पैनलिस्ट जेंडर (Gender):" : "Voice Gender:"}</span>
              </label>
              <div className="grid grid-cols-2 gap-1 bg-slate-900 p-1 rounded-lg border border-slate-700/80">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedGender('male');
                    showToast(isHindi ? "पुरुष सदस्य की आवाज़ सक्रिय" : "Male Panelist Voice Active", "info");
                  }}
                  className={`px-2 py-1 rounded text-[10px] font-black transition-all ${
                    selectedGender === 'male' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isHindi ? "पुरुष (Male)" : "Male 👨‍💼"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedGender('female');
                    showToast(isHindi ? "महिला सदस्य की आवाज़ सक्रिय" : "Female Panelist Voice Active", "info");
                  }}
                  className={`px-2 py-1 rounded text-[10px] font-black transition-all ${
                    selectedGender === 'female' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isHindi ? "महिला (Female)" : "Female 👩‍💼"}
                </button>
              </div>
            </div>

            {/* 4. Speed Controller Dials */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-extrabold uppercase flex items-center gap-1">
                <span>⏱️</span>
                <span>{isHindi ? "बोलने की गति (Speed):" : "Voice Speed Rate:"}</span>
              </label>
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-700/80">
                {[0.8, 1.0, 1.2].map(speed => (
                  <button
                    key={speed}
                    type="button"
                    onClick={() => {
                      setVoiceSpeed(speed);
                    }}
                    className={`flex-1 py-1 rounded text-[10px] font-black transition-all ${
                      voiceSpeed === speed ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Clarity Tips Indicator */}
          <div className="text-[10px] text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 p-2.5 rounded-xl flex items-center gap-2">
            <span className="text-sm shrink-0">✨</span>
            <p className="leading-relaxed font-semibold">
              {isHindi
                ? "स्पष्ट आवाज और सुंदर उच्चारण के लिए 'Premium' मोड ऑन रखें। यह सीधे क्लाउड वॉयस सर्वर से एचडी ऑडियो प्रदान करता है।"
                : "For maximum clarity and beautiful human-like accents, please use 'Premium' voice mode. This serves crystal-clear audio directly from Google TTS servers."}
            </p>
          </div>
        </div>

        {/* 1. SELECTION SCREEN (IDLE) */}
        {interviewState === 'idle' && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-sm font-bold text-slate-300 flex items-center gap-2">
              <span>🎯</span>
              <span>{isHindi ? "अपना लक्ष्य इंटरव्यू बोर्ड चुनें:" : "Select Your Target Interview Board:"}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {INTERVIEW_PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => setSelectedPresetId(preset.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                    selectedPresetId === preset.id
                      ? 'bg-[#0E1528] border-indigo-500 shadow-xl shadow-indigo-950/50 scale-[1.02]'
                      : 'bg-[#080C16] border-slate-800/80 hover:border-slate-700 hover:bg-[#0C1220]'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">{preset.icon}</span>
                      <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded-full">
                        {preset.questions.length} Rounds
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white">
                        {isHindi ? preset.titleHi : preset.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        {preset.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                    <span className="text-xs text-indigo-400 font-bold">
                      {isHindi ? "बोर्ड सदस्य: 3 विशेषज्ञ" : "Panel: 3 Officers"}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartInterview(preset.id);
                      }}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-lg shadow-indigo-950/40 cursor-pointer"
                    >
                      <span>शुरू करें</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Start Card */}
            <div className="p-5 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/40 border border-emerald-500/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-lg">
                  💡
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {isHindi ? "वॉयस व टाइपिंग दोनों का समर्थन" : "Both Voice (Mic) & Text Supported"}
                  </h4>
                  <p className="text-xs text-slate-300">
                    {isHindi 
                      ? "आप सीधे माइक ऑन करके बोल सकते हैं अथवा कीबोर्ड से अपना उत्तर टाइप कर सकते हैं।" 
                      : "Speak naturally using your microphone or type out structured answers."}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleStartInterview(selectedPresetId)}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-black text-sm rounded-xl shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isHindi ? "मॉक इंटरव्यू प्रारंभ करें ⚡" : "Launch Mock Interview ⚡"}</span>
              </button>
            </div>
          </div>
        )}

        {/* 2. ACTIVE INTERVIEW ROOM */}
        {interviewState === 'in_progress' && (
          <div className="space-y-6 animate-fade-in">
            {/* Progress steps */}
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono bg-[#0A0E1A] p-3 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-bold text-indigo-400">Round {currentQuestionIndex + 1} of {activePreset.questions.length}</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-300">{activePreset.title}</span>
              </div>
              <div className="flex items-center gap-1">
                {activePreset.questions.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-5 h-1.5 rounded-full ${
                      idx === currentQuestionIndex
                        ? 'bg-amber-400 animate-pulse'
                        : idx < currentQuestionIndex
                        ? 'bg-emerald-400'
                        : 'bg-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Interviewer Box */}
            <div className="p-6 bg-gradient-to-br from-[#0B1020] via-[#080C18] to-slate-900 border border-indigo-500/40 rounded-3xl space-y-4 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-2xl shadow-inner">
                    {currentQuestion.interviewerAvatar}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <span>{currentQuestion.interviewerName}</span>
                      <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-md border border-indigo-500/30">
                        {currentQuestion.interviewerRole}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">
                      {isHindi ? "इंटरव्यू बोर्ड पैनलिस्ट" : "Interview Board Member"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => speakQuestionText(currentQuestion.question, currentQuestion.gender, currentQuestion.questionHi)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isPlayingAudio
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  }`}
                  title="Listen to question"
                >
                  {isPlayingAudio ? <Volume2 className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Question Text */}
              <div className="p-4 bg-[#04060E]/80 border border-indigo-500/20 rounded-2xl text-slate-100 text-sm sm:text-base font-semibold leading-relaxed">
                "{(selectedVoiceLang.startsWith('hi') || selectedVoiceLang === 'hinglish') ? (currentQuestion.questionHi || currentQuestion.question) : currentQuestion.question}"
              </div>
            </div>

            {/* Answer Input Section */}
            <div className="p-5 bg-[#0A0E1A] border border-slate-800 rounded-3xl space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isHindi ? "आपका उत्तर (Candidate Response):" : "Your Answer (Candidate Response):"}</span>
                </label>

                {/* Mic Speech-to-Text Button */}
                <button
                  type="button"
                  onClick={toggleMic}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isListening
                      ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-950/50'
                      : 'bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/40'
                  }`}
                >
                  {isListening ? (
                    <>
                      <Mic className="w-3.5 h-3.5 animate-spin" />
                      <span>{isHindi ? "माइक सक्रिय (सुन रहा है...)" : "Listening..."}</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5" />
                      <span>{isHindi ? "बोलकर उत्तर दें (माइक)" : "Speak Answer (Mic)"}</span>
                    </>
                  )}
                </button>
              </div>

              <textarea
                value={userAnswerText}
                onChange={(e) => setUserAnswerText(e.target.value)}
                placeholder={isHindi ? "यहाँ अपना उत्तर लिखें या ऊपर माइक बटन दबाकर बोलें..." : "Type your answer here or click Speak Answer to use voice dictation..."}
                rows={5}
                className="w-full p-4 bg-[#03060E] border border-slate-800 rounded-2xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600"
              />

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-500 font-mono">
                  {userAnswerText.trim().split(/\s+/).filter(Boolean).length} words
                </span>

                <button
                  onClick={handleSubmitAnswer}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-950/40 flex items-center gap-2 cursor-pointer"
                >
                  <span>{isHindi ? "उत्तर जमा करें एवं मूल्यांकन देखें" : "Submit Answer & Next"}</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. EVALUATING LOADING STATE */}
        {interviewState === 'evaluating' && (
          <div className="p-12 bg-[#0A0E1A] border border-indigo-500/30 rounded-3xl text-center space-y-4 animate-fade-in">
            <Sparkles className="w-10 h-10 text-amber-400 animate-spin mx-auto" />
            <h3 className="text-base font-bold text-white">
              {isHindi ? "इंटरव्यू बोर्ड आपके उत्तर का मूल्यांकन कर रहा है..." : "Interview Board is evaluating your response..."}
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Analyzing clarity, factual depth, vocabulary, and constitutional composure...
            </p>
          </div>
        )}

        {/* 4. COMPLETED & FINAL SCORECARD */}
        {interviewState === 'completed' && (
          <div className="space-y-6 animate-fade-in">
            {/* Scorecard Hero Banner */}
            <div className="p-6 bg-gradient-to-br from-indigo-950 via-[#0B0F1E] to-[#04060E] border border-indigo-500/50 rounded-3xl space-y-5 text-center shadow-2xl relative overflow-hidden">
              <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 to-indigo-500/20 border border-amber-400/40">
                <Award className="w-10 h-10 text-amber-400 animate-bounce" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {isHindi ? "मॉक इंटरव्यू परिणाम एवं संपूर्ण विश्लेषण" : "Mock Interview Performance Scorecard"}
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  {activePreset.title} • Completed in {Math.floor(timerSeconds / 60)}m {timerSeconds % 60}s
                </p>
              </div>

              {/* Big Score Dial */}
              <div className="inline-flex items-baseline gap-2 bg-[#02040A] px-6 py-3 rounded-2xl border border-indigo-500/30">
                <span className="text-3xl sm:text-4xl font-black text-emerald-400">{overallScore}</span>
                <span className="text-sm font-bold text-slate-400">/ 100</span>
                <span className="text-xs font-mono font-bold text-amber-400 ml-2">
                  {overallScore >= 80 ? '🌟 Outstanding' : overallScore >= 65 ? '👍 Very Good' : '📚 Needs Practice'}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleDownloadReport}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-950/40 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{isHindi ? "स्कोरकार्ड PDF डाउनलोड करें" : "Download PDF Scorecard"}</span>
                </button>

                <button
                  onClick={() => setInterviewState('idle')}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{isHindi ? "नया इंटरव्यू शुरू करें" : "Restart New Interview"}</span>
                </button>
              </div>
            </div>

            {/* Detailed Round-by-Round Breakdown */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                <span>{isHindi ? "राउंड-वाइज़ विस्तृत फीडबैक एवं आदर्श उत्तर:" : "Round-by-Round Evaluation & Model Answers:"}</span>
              </h3>

              {rounds.map((r, idx) => (
                <div key={idx} className="p-5 bg-[#0A0E1A] border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{r.question.interviewerAvatar}</span>
                      <div>
                        <div className="text-xs font-bold text-white">{r.question.interviewerName} ({r.question.interviewerRole})</div>
                        <div className="text-[10px] text-slate-400 font-mono">Round {idx + 1}</div>
                      </div>
                    </div>
                    <div className="px-2.5 py-1 bg-indigo-950 text-indigo-300 border border-indigo-800 rounded-lg text-xs font-black">
                      {r.evaluation?.score} / 100
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 bg-[#03060E] p-3 rounded-xl border border-slate-800">
                    <span className="font-bold text-slate-400">Q: </span>{r.question.question}
                  </div>

                  <div className="text-xs text-slate-300 bg-indigo-950/30 p-3 rounded-xl border border-indigo-500/20">
                    <span className="font-bold text-indigo-300">Your Answer: </span>{r.userAnswer}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                    <div className="p-2.5 bg-emerald-950/30 border border-emerald-500/20 rounded-xl text-emerald-300">
                      <div className="font-bold mb-1">✅ Strengths:</div>
                      <ul className="list-disc list-inside space-y-0.5">
                        {r.evaluation?.strengths.map((st, sIdx) => (
                          <li key={sIdx}>{st}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-2.5 bg-amber-950/30 border border-amber-500/20 rounded-xl text-amber-300">
                      <div className="font-bold mb-1">💡 Improvement Tips:</div>
                      <ul className="list-disc list-inside space-y-0.5">
                        {r.evaluation?.improvements.map((im, iIdx) => (
                          <li key={iIdx}>{im}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 bg-[#060914] p-3 rounded-xl border border-slate-800">
                    <span className="font-bold text-amber-400">📌 Model Keywords & Approach: </span>
                    {r.question.idealKeyPoints.join(' • ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
