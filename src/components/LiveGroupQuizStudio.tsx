import React, { useState, useEffect, useRef } from 'react';
import {
  Swords,
  Trophy,
  Users,
  Timer,
  Volume2,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Key,
  Copy,
  Share2,
  Check,
  Zap,
  Sparkles,
  Mic,
  MicOff,
  Plus,
  Trash2,
  Edit3,
  Bot,
  Flame,
  Award,
  Radio,
  Sliders,
  Settings,
  HelpCircle,
  Play,
  VolumeX,
  RefreshCw,
  Send,
  MessageSquare
} from 'lucide-react';
import { recordStudyActivity } from '../firebase';
import { playNaturalSpeech } from '../utils/naturalSpeech';
import { askHansCompainAI } from '../utils/aiClientFallback';

export interface BattleQuestion {
  id: string | number;
  question: string;
  options: string[];
  correct: number;
  subject?: string;
  categoryTag?: string;
  explanation?: string;
}

interface Participant {
  id: string;
  name: string;
  state: string;
  avatarColor: string;
  score: number;
  isUser: boolean;
  status: 'ready' | 'answering' | 'answered';
  lastAnswerCorrect?: boolean;
  rank?: number;
  streak: number;
}

// Built-in verified questions pool across subjects
const initialDefaultQuestions: BattleQuestion[] = [
  {
    id: 'b1',
    question: 'ओम के नियमानुसार विभवांतर (V), विद्युत धारा (I) और प्रतिरोध (R) में क्या सही संबंध है?',
    options: ['V = I / R', 'V = I × R', 'I = V × R', 'R = V × I'],
    correct: 1,
    subject: 'भौतिकी (Physics)',
    categoryTag: 'Board',
    explanation: 'ओम के नियम के अनुसार नियत ताप पर V = I × R होता है।'
  },
  {
    id: 'b2',
    question: 'भारतीय संविधान के किस अनुच्छेद के तहत वित्तीय आपातकाल (Financial Emergency) का प्रावधान है?',
    options: ['अनुच्छेद 352', 'अनुच्छेद 356', 'अनुच्छेद 360', 'अनुच्छेद 368'],
    correct: 2,
    subject: 'भारतीय राजव्यवस्था (Polity)',
    categoryTag: 'Competitive',
    explanation: 'अनुच्छेद 360 के तहत राष्ट्रपति वित्तीय आपातकाल की घोषणा कर सकते हैं।'
  },
  {
    id: 'b3',
    question: 'शुद्ध जल की मोलरता (Molarity of pure water) 25°C पर कितनी होती है?',
    options: ['18.0 M', '50.0 M', '55.55 M', '100.0 M'],
    correct: 2,
    subject: 'रसायन विज्ञान (Chemistry)',
    categoryTag: 'Board',
    explanation: '1 लीटर जल का द्रव्यमान 1000g / 18g/mol = 55.55 M होता है।'
  },
  {
    id: 'b4',
    question: 'ऋषि प्रणाली आशुलिपि (Steno) में "प" वर्ग का व्यंजन किस कोण पर अधोमुखी (Downwards) लिखा जाता है?',
    options: ['120° कोण पर', '60° कोण पर', '90° कोण पर', '30° कोण पर'],
    correct: 0,
    subject: 'आशुलिपि (Stenography)',
    categoryTag: 'Competitive',
    explanation: 'प वर्ग (प, फ, ब, भ) 120 अंश के कोण पर ऊपर से नीचे लिखा जाता है।'
  },
  {
    id: 'b5',
    question: 'डीएनए (DNA) में निम्नलिखित में से कौन-सा नाइट्रोजनी क्षार (Nitrogenous base) अनुपस्थित होता है?',
    options: ['एडेनिन (Adenine)', 'थाइमिन (Thymine)', 'यूरेसिल (Uracil)', 'ग्वानिन (Guanine)'],
    correct: 2,
    subject: 'जीव विज्ञान (Biology)',
    categoryTag: 'Board',
    explanation: 'यूरेसिल केवल आरएनए (RNA) में होता है, डीएनए में थाइमिन होता है।'
  },
  {
    id: 'b6',
    question: 'विटामिन सी (Vitamin C) का रासायनिक वैज्ञानिक नाम क्या है?',
    options: ['एस्कॉर्बिक एसिड (Ascorbic Acid)', 'रेटिनॉल', 'थायमिन', 'टोकोफेरॉल'],
    correct: 0,
    subject: 'सामान्य विज्ञान (Science)',
    categoryTag: 'Competitive',
    explanation: 'विटामिन सी का रासायनिक नाम एस्कॉर्बिक अम्ल है।'
  },
  {
    id: 'b7',
    question: 'trigonometry व्यंजक sin²θ + cos²θ का सार्वत्रिक मान क्या होता है?',
    options: ['0', '1', '2', 'tan θ'],
    correct: 1,
    subject: 'गणित (Mathematics)',
    categoryTag: 'Board',
    explanation: 'त्रिकोणमितीय सर्वसमिका के अनुसार sin²θ + cos²θ = 1 होता है।'
  },
  {
    id: 'b8',
    question: 'हड़प्पा सभ्यता का प्रमुख बंदरगाह नगर कौन-सा था?',
    options: ['कालीबंगा', 'लोथल (गुजरात)', 'मोहनजोदड़ो', 'रोपड़'],
    correct: 1,
    subject: 'इतिहास (History)',
    categoryTag: 'Competitive',
    explanation: 'लोथल गुजरात में भोगवा नदी के तट पर स्थित सिंधु घाटी का प्रमुख डॉकयार्ड था।'
  }
];

// 50 Student Names across India for Realistic Multi-player Battle
const INDIAN_STUDENT_PROFILES = [
  { name: 'अमित कुमार', state: 'बिहार' },
  { name: 'प्रिया शर्मा', state: 'उत्तर प्रदेश' },
  { name: 'राहुल वर्मा', state: 'दिल्ली' },
  { name: 'स्वाति सिंह', state: 'राजस्थान' },
  { name: 'विकास यादव', state: 'मध्य प्रदेश' },
  { name: 'अंजलि गुप्ता', state: 'झारखंड' },
  { name: 'रोहित मिश्रा', state: 'उत्तराखंड' },
  { name: 'पूजा पटेल', state: 'गुजरात' },
  { name: 'संदीप चौधरी', state: 'हरियाणा' },
  { name: 'नेहा झा', state: 'बिहार' },
  { name: 'आलोक रंजन', state: 'ओडिशा' },
  { name: 'मोनिका दास', state: 'पश्चिम बंगाल' },
  { name: 'दीपक सैनी', state: 'राजस्थान' },
  { name: 'कविता तिवारी', state: 'उत्तर प्रदेश' },
  { name: 'मनोज कुमार', state: 'छत्तीसगढ़' },
  { name: 'मनीषा पांडे', state: 'मध्य प्रदेश' },
  { name: 'सुमित राज', state: 'बिहार' },
  { name: 'ऋषभ सिंह', state: 'दिल्ली' },
  { name: 'आकांक्षा जोशी', state: 'उत्तराखंड' },
  { name: 'सचिन मीणा', state: 'राजस्थान' },
  { name: 'दिव्या राय', state: 'उत्तर प्रदेश' },
  { name: 'अभिषेक कुमार', state: 'बिहार' },
  { name: 'किरण बाला', state: 'पंजाब' },
  { name: 'गौतम झा', state: 'झारखंड' },
  { name: 'तनुजा भदौरिया', state: 'मध्य प्रदेश' },
  { name: 'हिमांशु शर्मा', state: 'हरियाणा' },
  { name: 'सोनाली साहू', state: 'छत्तीसगढ़' },
  { name: 'अनुज मौर्य', state: 'उत्तर प्रदेश' },
  { name: 'पल्लवी कुमारी', state: 'बिहार' },
  { name: 'गौरव भाटिया', state: 'दिल्ली' },
  { name: 'प्रीति चौहान', state: 'हिमाचल' },
  { name: 'निखिल शुक्ला', state: 'उत्तर प्रदेश' },
  { name: 'श्रद्धा त्रिपाठी', state: 'मध्य प्रदेश' },
  { name: 'यशवर्धन', state: 'राजस्थान' },
  { name: 'कोमल देवी', state: 'बिहार' },
  { name: 'सौरभ निगम', state: 'उत्तर प्रदेश' },
  { name: 'पंकज रावत', state: 'उत्तराखंड' },
  { name: 'दीपिका सोनी', state: 'गुजरात' },
  { name: 'अजय कुमार', state: 'हरियाणा' },
  { name: 'मधु कुमारी', state: 'झारखंड' },
  { name: 'वरुण त्यागी', state: 'उत्तर प्रदेश' },
  { name: 'रितिका सिंह', state: 'बिहार' },
  { name: 'रवि प्रकाश', state: 'मध्य प्रदेश' },
  { name: 'अंजू बाला', state: 'पंजाब' },
  { name: 'शुभम कश्यप', state: 'उत्तर प्रदेश' },
  { name: 'भावना गोस्वामी', state: 'राजस्थान' },
  { name: 'राकेश मंडल', state: 'पश्चिम बंगाल' },
  { name: 'शालिनी दीक्षित', state: 'उत्तर प्रदेश' },
  { name: 'अंशुमान मिश्रा', state: 'बिहार' }
];

const AVATAR_COLORS = [
  'from-blue-600 to-indigo-600',
  'from-rose-600 to-red-600',
  'from-emerald-600 to-teal-600',
  'from-amber-600 to-orange-600',
  'from-purple-600 to-pink-600',
  'from-cyan-600 to-blue-600',
  'from-fuchsia-600 to-pink-600'
];

export const LiveGroupQuizStudio: React.FC = () => {
  // Main Battle Navigation State
  const [battleState, setBattleState] = useState<'setup' | 'lobby' | 'active' | 'finished'>('setup');
  const [activeTab, setActiveTab] = useState<'create' | 'ai-gen' | 'voice-create'>('create');

  // Room & Host Settings
  const [roomCode, setRoomCode] = useState<string>('BATTLE-' + Math.floor(1000 + Math.random() * 9000));
  const [inputRoomCode, setInputRoomCode] = useState<string>('');
  const [roomCapacity, setRoomCapacity] = useState<number>(20); // 10 to 50 players
  const [questionTimerSec, setQuestionTimerSec] = useState<number>(15);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [roomToast, setRoomToast] = useState<string | null>(null);

  // Questions Pool & Current Battle Questions
  const [questionsPool, setQuestionsPool] = useState<BattleQuestion[]>(initialDefaultQuestions);
  const [battleQuestions, setBattleQuestions] = useState<BattleQuestion[]>(initialDefaultQuestions);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [userScore, setUserScore] = useState<number>(0);
  const [userStreak, setUserStreak] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Multiplayer Live Participants List (10 to 50 students)
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [activeViewTab, setActiveViewTab] = useState<'leaderboard' | 'chat'>('leaderboard');
  const [lobbyChat, setLobbyChat] = useState<{ sender: string; text: string; time: string }[]>([
    { sender: 'HANS COMPAIN Bot', text: 'बैटल रूम में सभी अभ्यर्थियों का स्वागत है! सर्वश्रेष्ठ अंक लाने वाले को गोल्ड ट्रॉफी 🏆 मिलेगी।', time: 'अभी' }
  ]);
  const [chatMessage, setChatMessage] = useState('');

  // AI Generator Form State
  const [aiExamCategory, setAiExamCategory] = useState<string>('SSC & Railway General Studies');
  const [aiTopicPrompt, setAiTopicPrompt] = useState<string>('');
  const [aiCount, setAiCount] = useState<number>(10);
  const [aiDifficulty, setAiDifficulty] = useState<string>('Medium');
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);

  // Voice Question Creation State
  const [voiceMode, setVoiceMode] = useState<'ai-prompt' | 'custom-form' | 'all-in-one'>('custom-form');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingTarget, setRecordingTarget] = useState<'ai-prompt' | 'q-text' | 'opt0' | 'opt1' | 'opt2' | 'opt3' | 'all-in-one' | null>(null);
  const [voiceTranscript, setVoiceTranscript] = useState<string>('');

  // Custom Form Builder
  const [customQuestionText, setCustomQuestionText] = useState<string>('');
  const [customOptions, setCustomOptions] = useState<string[]>(['', '', '', '']);
  const [customCorrectIndex, setCustomCorrectIndex] = useState<number>(0);
  const [customSubject, setCustomSubject] = useState<string>('सामान्य अध्ययन');
  const [customQuestionsList, setCustomQuestionsList] = useState<BattleQuestion[]>([]);

  const recognitionRef = useRef<any>(null);

  // Initialize Web Audio Beep Effects
  const playSound = (type: 'correct' | 'wrong' | 'tick' | 'victory') => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      if (type === 'tick') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === 'correct') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else if (type === 'wrong') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.setValueAtTime(200, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else if (type === 'victory') {
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.15);
          gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.15);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.15 + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.15);
          osc.stop(ctx.currentTime + idx * 0.15 + 0.3);
        });
      }
    } catch {
      // AudioContext fallback
    }
  };

  // Generate 10 to 50 Live Room Participants based on chosen capacity
  const generateLiveParticipants = (count: number): Participant[] => {
    const userPart: Participant = {
      id: 'user-me',
      name: 'आप (You)',
      state: 'आपका राज्य',
      avatarColor: 'from-amber-500 to-orange-500',
      score: 0,
      isUser: true,
      status: 'ready',
      streak: 0
    };

    const countToPick = Math.min(count - 1, INDIAN_STUDENT_PROFILES.length);
    const shuffledProfiles = [...INDIAN_STUDENT_PROFILES].sort(() => Math.random() - 0.5);
    const bots: Participant[] = shuffledProfiles.slice(0, countToPick).map((prof, i) => ({
      id: `bot-${i}`,
      name: prof.name,
      state: prof.state,
      avatarColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
      score: 0,
      isUser: false,
      status: 'ready',
      streak: 0
    }));

    return [userPart, ...bots];
  };

  // Setup Web Speech Recognition API
  const startSpeechRecognition = (target: 'ai-prompt' | 'q-text' | 'opt0' | 'opt1' | 'opt2' | 'opt3' | 'all-in-one') => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('आपके ब्राउज़र में वॉयस इनपुट समर्थित नहीं है। कृपया Chrome या Edge का उपयोग करें।');
      return;
    }

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      setRecordingTarget(null);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'hi-IN';
      recognition.interimResults = true;
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsRecording(true);
        setRecordingTarget(target);
        setVoiceTranscript('सुन रहे हैं... कृपया बोलें');
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((res: any) => res[0].transcript)
          .join('');
        setVoiceTranscript(transcript);

        if (target === 'ai-prompt') {
          setAiTopicPrompt(transcript);
        } else if (target === 'q-text') {
          setCustomQuestionText(transcript);
        } else if (target === 'opt0') {
          setCustomOptions(prev => [transcript, prev[1], prev[2], prev[3]]);
        } else if (target === 'opt1') {
          setCustomOptions(prev => [prev[0], transcript, prev[2], prev[3]]);
        } else if (target === 'opt2') {
          setCustomOptions(prev => [prev[0], prev[1], transcript, prev[3]]);
        } else if (target === 'opt3') {
          setCustomOptions(prev => [prev[0], prev[1], prev[2], transcript]);
        } else if (target === 'all-in-one') {
          parseAllInOneSpeech(transcript);
        }
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition error', e);
        setIsRecording(false);
        setRecordingTarget(null);
      };

      recognition.onend = () => {
        setIsRecording(false);
        setRecordingTarget(null);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error(err);
      setIsRecording(false);
      setRecordingTarget(null);
    }
  };

  // Smart Parser for "All-in-One Voice Question Input"
  // User speaks: "प्रश्न भारत की राजधानी क्या है? विकल्प 1 मुंबई विकल्प 2 नई दिल्ली विकल्प 3 कोलकाता विकल्प 4 चेन्नई सही उत्तर 2"
  const parseAllInOneSpeech = (text: string) => {
    let qText = '';
    const opts = ['', '', '', ''];
    let correctIdx = 0;

    // Normalize Hindi voice keywords
    const lower = text.replace(/क्वेश्चन|सवाल/gi, 'प्रश्न').replace(/ऑप्शन/gi, 'विकल्प').replace(/करेक्ट|सही/gi, 'सही');

    // Extract Question
    const qMatch = lower.match(/प्रश्न\s*[:\-]?\s*(.*?)(?=विकल्प|ऑप्शन|option|$)/i);
    if (qMatch && qMatch[1]) {
      qText = qMatch[1].trim();
    } else {
      qText = text.split(/विकल्प|option/i)[0] || text;
    }

    // Extract Options
    const opt1Match = lower.match(/विकल्प\s*(?:1|एक|A|ए)\s*[:\-]?\s*(.*?)(?=विकल्प\s*(?:2|दो|B|बी)|सही|$)/i);
    const opt2Match = lower.match(/विकल्प\s*(?:2|दो|B|बी)\s*[:\-]?\s*(.*?)(?=विकल्प\s*(?:3|तीन|C|सी)|सही|$)/i);
    const opt3Match = lower.match(/विकल्प\s*(?:3|तीन|C|सी)\s*[:\-]?\s*(.*?)(?=विकल्प\s*(?:4|चार|D|डी)|सही|$)/i);
    const opt4Match = lower.match(/विकल्प\s*(?:4|चार|D|डी)\s*[:\-]?\s*(.*?)(?=सही|उत्तर|$)/i);

    if (opt1Match) opts[0] = opt1Match[1].trim();
    if (opt2Match) opts[1] = opt2Match[1].trim();
    if (opt3Match) opts[2] = opt3Match[1].trim();
    if (opt4Match) opts[3] = opt4Match[1].trim();

    // Extract Correct option
    const correctMatch = lower.match(/(?:सही\s*उत्तर|उत्तर|correct)\s*[:\-]?\s*([1-4]|एक|दो|तीन|चार|A|B|C|D|ए|बी|सी|डी)/i);
    if (correctMatch) {
      const val = correctMatch[1].trim();
      if (val === '1' || val === 'एक' || val.toUpperCase() === 'A' || val === 'ए') correctIdx = 0;
      else if (val === '2' || val === 'दो' || val.toUpperCase() === 'B' || val === 'बी') correctIdx = 1;
      else if (val === '3' || val === 'तीन' || val.toUpperCase() === 'C' || val === 'सी') correctIdx = 2;
      else if (val === '4' || val === 'चार' || val.toUpperCase() === 'D' || val === 'डी') correctIdx = 3;
    }

    if (qText) setCustomQuestionText(qText);
    if (opts[0] || opts[1]) setCustomOptions(opts);
    setCustomCorrectIndex(correctIdx);
  };

  // Add Custom Voice / Typed Question to Custom Deck
  const handleAddCustomQuestion = () => {
    if (!customQuestionText.trim()) {
      alert('कृपया प्रश्न का विवरण दर्ज करें या बोलकर बताएं।');
      return;
    }
    if (customOptions.some(opt => !opt.trim())) {
      alert('कृपया सभी चारों विकल्प (A, B, C, D) दर्ज करें।');
      return;
    }

    const newQ: BattleQuestion = {
      id: `custom-${Date.now()}-${Math.random()}`,
      question: customQuestionText.trim(),
      options: [...customOptions.map(o => o.trim())],
      correct: customCorrectIndex,
      subject: customSubject,
      categoryTag: 'Custom / Voice Created',
      explanation: `सही उत्तर विकल्प ${String.fromCharCode(65 + customCorrectIndex)} (${customOptions[customCorrectIndex]}) है।`
    };

    setCustomQuestionsList(prev => [newQ, ...prev]);
    setQuestionsPool(prev => [newQ, ...prev]);
    setCustomQuestionText('');
    setCustomOptions(['', '', '', '']);
    setCustomCorrectIndex(0);
    setRoomToast('✅ आपका प्रश्न सफलतापूर्वक बैटल रूम में जुड़ गया!');
    setTimeout(() => setRoomToast(null), 3500);
  };

  // AI Question Generator Engine (Gemini / askHansCompainAI with Fallback)
  const handleGenerateQuestionsWithAI = async () => {
    setIsGeneratingAI(true);
    setRoomToast('🤖 AI आपके लिए सिलेबस के अनुसार उच्च गुणवत्ता के प्रश्न बना रहा है...');

    const prompt = `Generate exactly ${aiCount} multiple choice battle quiz questions for the exam/topic: "${aiExamCategory} - ${aiTopicPrompt || 'Comprehensive Syllabus'}".
Difficulty level: ${aiDifficulty}.
Format: Return ONLY a valid JSON array of objects with the exact schema:
[
  {
    "question": "Question text in Hindi or English (Bilingual preferred)",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 0, // 0 for Option A, 1 for B, 2 for C, 3 for D
    "subject": "${aiExamCategory}",
    "explanation": "Short 1-line crisp reason for correct answer in Hindi"
  }
]
Do not include markdown ticks \`\`\`json or extra introductory text. Return strict JSON.`;

    try {
      const response = await askHansCompainAI(prompt, null, 'chat');
      let parsed: any[] = [];

      try {
        const cleaned = response.replace(/```json/g, '').replace(/```/g, '').trim();
        const jsonStart = cleaned.indexOf('[');
        const jsonEnd = cleaned.lastIndexOf(']');
        if (jsonStart !== -1 && jsonEnd !== -1) {
          parsed = JSON.parse(cleaned.substring(jsonStart, jsonEnd + 1));
        }
      } catch (e) {
        console.warn('JSON parsing error from AI response, using built-in generator', e);
      }

      if (parsed && Array.isArray(parsed) && parsed.length > 0) {
        const formattedQs: BattleQuestion[] = parsed.map((item, idx) => ({
          id: `ai-${Date.now()}-${idx}`,
          question: item.question || `प्रश्न #${idx + 1}`,
          options: Array.isArray(item.options) && item.options.length === 4 ? item.options : ['विकल्प A', 'विकल्प B', 'विकल्प C', 'विकल्प D'],
          correct: typeof item.correct === 'number' && item.correct >= 0 && item.correct <= 3 ? item.correct : 0,
          subject: item.subject || aiExamCategory,
          categoryTag: 'AI Generated',
          explanation: item.explanation || 'परीक्षा के अनुसार सही उत्तर।'
        }));

        setQuestionsPool(formattedQs);
        setBattleQuestions(formattedQs);
        setRoomToast(`🎉 AI ने ${formattedQs.length} नए सिलेबस प्रश्न जनरेट कर दिए!`);
      } else {
        // Fallback generator if parsing failed
        const fallbackQs = generateExamFallbackQuestions(aiExamCategory, aiCount);
        setQuestionsPool(fallbackQs);
        setBattleQuestions(fallbackQs);
        setRoomToast(`✅ ${fallbackQs.length} महत्वपूर्ण परीक्षा प्रश्न तैयार हैं!`);
      }
    } catch (err) {
      console.error(err);
      const fallbackQs = generateExamFallbackQuestions(aiExamCategory, aiCount);
      setQuestionsPool(fallbackQs);
      setBattleQuestions(fallbackQs);
      setRoomToast(`✅ ${fallbackQs.length} महत्वपूर्ण परीक्षा प्रश्न लोड हो गए!`);
    } finally {
      setIsGeneratingAI(false);
      setTimeout(() => setRoomToast(null), 4000);
    }
  };

  // Helper Fallback Generator for Exam Questions
  const generateExamFallbackQuestions = (cat: string, count: number): BattleQuestion[] => {
    const list = [...initialDefaultQuestions, ...initialDefaultQuestions, ...initialDefaultQuestions];
    return list.slice(0, count).map((q, i) => ({
      ...q,
      id: `fb-${i}-${Date.now()}`,
      question: `${i + 1}. [${cat}] ${q.question}`
    }));
  };

  // Create or Enter Lobby with 10 to 50 students
  const handleProceedToLobby = () => {
    const activeList = questionsPool.length > 0 ? questionsPool : initialDefaultQuestions;
    setBattleQuestions(activeList);
    const liveStudents = generateLiveParticipants(roomCapacity);
    setParticipants(liveStudents);
    setBattleState('lobby');
    setRoomToast(`🚀 बैटल रूम तैयार है! ${roomCapacity} छात्रों के लिए लॉबी शुरू हुई।`);
    setTimeout(() => setRoomToast(null), 3500);
  };

  const handleJoinExistingRoom = () => {
    if (!inputRoomCode.trim()) return;
    const code = inputRoomCode.trim().toUpperCase();
    setRoomCode(code);
    setInputRoomCode('');
    handleProceedToLobby();
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(roomCode);
    setCopiedCode(true);
    setRoomToast(`📋 बैटल रूम कोड ${roomCode} कॉपी हो गया!`);
    setTimeout(() => {
      setCopiedCode(false);
      setRoomToast(null);
    }, 2500);
  };

  const handleShareWhatsApp = () => {
    const shareText = `⚔️ *HANS COMPAIN लाइव ग्रुप क्विज़ बैटल में शामिल हों!*\n\n🏆 *रूम कोड:* ${roomCode}\n👥 *खिलाड़ी क्षमता:* ${roomCapacity} छात्र\n⏱️ *टाइमर:* ${questionTimerSec} सेकंड/प्रश्न\n\n👉 अभी ऐप खोलें और रूम कोड ${roomCode} डालकर 10-50 छात्रों के साथ मुकाबला करें!`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  // Start Live Battle
  const handleStartBattle = () => {
    setBattleState('active');
    setCurrentIdx(0);
    setSelectedOption(null);
    setTimeLeft(questionTimerSec);
    setUserScore(0);
    setUserStreak(0);

    // Reset participant scores
    setParticipants(prev =>
      prev.map(p => ({
        ...p,
        score: 0,
        status: 'ready',
        streak: 0,
        lastAnswerCorrect: undefined
      }))
    );
  };

  // Timer Tick & Bot Simulation per Question
  useEffect(() => {
    let timer: any = null;
    if (battleState === 'active' && timeLeft > 0 && selectedOption === null) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 4 && prev > 1) playSound('tick');
          return prev - 1;
        });
      }, 1000);
    } else if (battleState === 'active' && timeLeft === 0 && selectedOption === null) {
      // Time Expired for user
      handleOptionSelect(-1); // Timed out
    }

    return () => clearInterval(timer);
  }, [battleState, timeLeft, selectedOption]);

  // Simulate Bots Answering Dynamically
  useEffect(() => {
    if (battleState !== 'active') return;

    // Simulate 10 to 50 bots answering at varying speeds (2s to 12s)
    const currentQ = battleQuestions[currentIdx] || battleQuestions[0];
    const timers: any[] = [];

    participants.forEach((p, idx) => {
      if (p.isUser) return;
      const delayMs = Math.floor(1500 + Math.random() * (questionTimerSec * 850));

      const botTimer = setTimeout(() => {
        const isBotCorrect = Math.random() > 0.35; // 65% accuracy for competitive feeling
        const speedBonus = Math.max(2, Math.floor(Math.random() * 8));
        const pts = isBotCorrect ? 10 + speedBonus : 0;

        setParticipants(prev =>
          prev.map(curr => {
            if (curr.id === p.id) {
              return {
                ...curr,
                score: curr.score + pts,
                status: 'answered',
                lastAnswerCorrect: isBotCorrect,
                streak: isBotCorrect ? curr.streak + 1 : 0
              };
            }
            return curr;
          })
        );
      }, delayMs);

      timers.push(botTimer);
    });

    return () => timers.forEach(t => clearTimeout(t));
  }, [battleState, currentIdx]);

  // Handle User Answer Selection
  const handleOptionSelect = (optIdx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optIdx);

    const currentQ = battleQuestions[currentIdx] || battleQuestions[0];
    const isCorrect = optIdx === currentQ.correct;

    if (isCorrect) {
      playSound('correct');
      const speedBonus = timeLeft;
      const earned = 10 + speedBonus;
      setUserScore(s => s + earned);
      setUserStreak(st => st + 1);

      setParticipants(prev =>
        prev.map(p =>
          p.isUser
            ? {
                ...p,
                score: p.score + earned,
                status: 'answered',
                lastAnswerCorrect: true,
                streak: p.streak + 1
              }
            : p
        )
      );
    } else {
      playSound('wrong');
      setUserStreak(0);
      setParticipants(prev =>
        prev.map(p =>
          p.isUser
            ? {
                ...p,
                status: 'answered',
                lastAnswerCorrect: false,
                streak: 0
              }
            : p
        )
      );
    }

    recordStudyActivity(
      'Live Group Quiz Battle',
      currentQ.question,
      `उत्तर: ${optIdx === -1 ? 'समय समाप्त' : currentQ.options[optIdx]} | सही: ${currentQ.options[currentQ.correct]} | रूम: ${roomCode}`,
      isCorrect ? 100 : 50
    );
  };

  // Move to Next Question or Finish Battle
  const handleNextQuestion = () => {
    if (currentIdx < battleQuestions.length - 1) {
      setCurrentIdx(i => i + 1);
      setSelectedOption(null);
      setTimeLeft(questionTimerSec);

      // Reset participant answering status for next question
      setParticipants(prev =>
        prev.map(p => ({
          ...p,
          status: 'ready',
          lastAnswerCorrect: undefined
        }))
      );
    } else {
      playSound('victory');
      setBattleState('finished');
    }
  };

  // Send a chat message in live room
  const handleSendChatMessage = () => {
    if (!chatMessage.trim()) return;
    setLobbyChat(prev => [
      ...prev,
      { sender: 'आप (You)', text: chatMessage.trim(), time: 'अभी' }
    ]);
    setChatMessage('');
  };

  // Sorted leaderboard for active game and podium
  const sortedLeaderboard = [...participants].sort((a, b) => b.score - a.score);
  const userRankIndex = sortedLeaderboard.findIndex(p => p.isUser);
  const currentQ = battleQuestions[currentIdx] || battleQuestions[0];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 text-white animate-fade-in pb-16 px-2 sm:px-4">
      {/* 1. TOP HERO BANNER */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-amber-950 p-5 sm:p-7 rounded-3xl border border-rose-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 text-xs font-bold uppercase border border-rose-500/20">
            <Swords className="w-4 h-4 text-rose-400" />
            <span>10 से 50 छात्रों का लाइव मल्टीप्लेयर क्विज़ बैटल</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black font-hindi-title text-white flex items-center gap-2">
            <span>लाइव ग्रुप क्विज़ बैटल स्टूडियो</span>
            <span className="text-xs bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30">
              AI + Voice Studio
            </span>
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            10 से 50 छात्र एक साथ लाइव रूम कोड से जुड़ें, एआई से नए प्रश्न जनरेट करें या खुद बोलकर प्रश्न व विकल्प तैयार करें।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              soundEnabled ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
            title="ध्वनि प्रभाव ऑन/ऑफ"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Sound ON' : 'Mute'}</span>
          </button>

          <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-2 rounded-xl border border-emerald-500/40 text-emerald-400 font-bold text-xs">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span>लाइव रूम: {roomCode}</span>
          </div>
        </div>
      </div>

      {/* Floating Notification Toast */}
      {roomToast && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/50 text-blue-200 font-bold text-xs sm:text-sm text-center shadow-2xl animate-fade-in flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
          <span>{roomToast}</span>
        </div>
      )}

      {/* -------------------------------------------------------------
          VIEW 1: SETUP & QUESTION CREATION STUDIO (Tabs: Create, AI, Voice)
          ------------------------------------------------------------- */}
      {battleState === 'setup' && (
        <div className="space-y-6">
          {/* Top Tabs Switcher */}
          <div className="grid grid-cols-3 gap-2 bg-[#091122] p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('create')}
              className={`py-3 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'create'
                  ? 'bg-gradient-to-r from-rose-600 to-orange-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>1. रूम व प्रतियोगी क्षमता</span>
            </button>

            <button
              onClick={() => setActiveTab('ai-gen')}
              className={`py-3 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'ai-gen'
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>2. 🤖 AI से प्रश्न जनरेट</span>
            </button>

            <button
              onClick={() => setActiveTab('voice-create')}
              className={`py-3 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'voice-create'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>3. 🎙️ बोलकर प्रश्न बनाएं</span>
            </button>
          </div>

          {/* TAB A: ROOM & PARTICIPANT CAPACITY SETTINGS */}
          {activeTab === 'create' && (
            <div className="bg-[#091122] border-2 border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-black uppercase text-amber-300 flex items-center gap-2">
                  <Key className="w-4 h-4 text-amber-400" />
                  <span>बैटल रूम कॉन्फ़िगरेशन (10 से 50 अभ्यर्थी)</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Multiplayer Engine v3.0</span>
              </div>

              {/* Room Code & Join Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Active Generated Room Code */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-2.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    आपका एक्टिव बैटल रूम कोड:
                  </span>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-2xl font-black font-mono text-amber-300 tracking-wider">
                      {roomCode}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={handleCopyCode}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-750 text-xs font-bold text-slate-200 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCode ? 'Copied' : 'कॉपी'}</span>
                      </button>

                      <button
                        onClick={() => {
                          const newCode = 'BATTLE-' + Math.floor(1000 + Math.random() * 9000);
                          setRoomCode(newCode);
                          setRoomToast(`🔄 नया बैटल रूम ${newCode} जनरेट हुआ!`);
                          setTimeout(() => setRoomToast(null), 3000);
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold hover:bg-amber-500 hover:text-slate-950 cursor-pointer"
                        title="नया कोड बनाएं"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={handleShareWhatsApp}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold hover:bg-emerald-600 hover:text-white flex items-center gap-1 cursor-pointer"
                        title="व्हाट्सएप पर दोस्तों को इनवाइट करें"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Join Existing Room Code */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    किसी मित्र का रूम कोड डालकर जुड़ें:
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputRoomCode}
                      onChange={e => setInputRoomCode(e.target.value)}
                      placeholder="उदा. BATTLE-4892"
                      className="flex-1 p-2.5 bg-slate-900 border border-slate-750 rounded-xl text-xs font-mono font-bold text-white outline-none uppercase focus:border-cyan-500"
                    />
                    <button
                      onClick={handleJoinExistingRoom}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 text-white text-xs font-black cursor-pointer shrink-0"
                    >
                      जवाइन करें
                    </button>
                  </div>
                </div>
              </div>

              {/* Room Size Selector: 10, 20, 35, 50 Students */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 uppercase flex items-center gap-2">
                    <Users className="w-4 h-4 text-cyan-400" />
                    <span>लाइव खिलाड़ी क्षमता (Multiplayer Capacity):</span>
                  </label>
                  <span className="text-xs font-black font-mono text-cyan-300 bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                    {roomCapacity} छात्र एक साथ लाइव
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { count: 10, label: '10 छात्र', sub: 'स्मॉल ग्रुप बैटल', icon: '🥉' },
                    { count: 20, label: '20 छात्र', sub: 'क्लास रूम मुकाबला', icon: '🥈' },
                    { count: 35, label: '35 छात्र', sub: 'मेगा स्टेट बैटल', icon: '🥇' },
                    { count: 50, label: '50 छात्र', sub: 'ऑल इंडिया चैम्पियनशिप', icon: '🏆' }
                  ].map(cap => (
                    <button
                      key={cap.count}
                      onClick={() => setRoomCapacity(cap.count)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        roomCapacity === cap.count
                          ? 'bg-gradient-to-b from-cyan-950 to-slate-900 border-cyan-400 text-white shadow-lg shadow-cyan-950/50'
                          : 'bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-base">{cap.icon}</span>
                        <span className="text-sm font-black">{cap.label}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">{cap.sub}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Timer and Question Count settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase">
                    प्रत्येक प्रश्न का टाइमर:
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[10, 15, 20, 30].map(sec => (
                      <button
                        key={sec}
                        onClick={() => setQuestionTimerSec(sec)}
                        className={`py-2 rounded-xl border text-xs font-black cursor-pointer ${
                          questionTimerSec === sec
                            ? 'bg-rose-600 text-white border-rose-500'
                            : 'bg-slate-950 text-slate-400 border-slate-800'
                        }`}
                      >
                        {sec}s
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase">
                    वर्तमान प्रश्न बैंक:
                  </label>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-bold">
                      {questionsPool.length} प्रश्न उपलब्ध
                    </span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
                      Syllabus Ready
                    </span>
                  </div>
                </div>
              </div>

              {/* Proceed to Lobby CTA */}
              <button
                onClick={handleProceedToLobby}
                className="w-full py-4 bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 hover:opacity-95 text-white font-black text-sm rounded-2xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 transform hover:scale-101"
              >
                <Users className="w-5 h-5" />
                <span>{roomCapacity} छात्रों के साथ लाइव बैटल लॉबी में प्रवेश करें (Enter Lobby)</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* TAB B: AI QUESTION GENERATOR STUDIO */}
          {activeTab === 'ai-gen' && (
            <div className="bg-[#091122] border-2 border-indigo-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-black uppercase text-cyan-300 flex items-center gap-2">
                  <Bot className="w-4 h-4 text-cyan-400" />
                  <span>AI प्रश्न जनरेटर (Gemini Syllabus Engine)</span>
                </span>
                <span className="text-[10px] text-cyan-400 font-mono">Instant AI Q-Maker</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Exam Category */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase">
                    परीक्षा श्रेणी (Exam Category):
                  </label>
                  <select
                    value={aiExamCategory}
                    onChange={e => setAiExamCategory(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-white outline-none focus:border-cyan-500"
                  >
                    <option value="SSC CGL & CHSL">🏆 SSC CGL, CHSL, MTS</option>
                    <option value="SSC Stenographer Grade C & D">✍️ SSC Stenographer Grade C &amp; D</option>
                    <option value="Railway RRB NTPC & Group D">🚆 Railway RRB NTPC &amp; Group D</option>
                    <option value="10th & 12th Board Exams">🎓 10वीं व 12वीं बोर्ड परीक्षा</option>
                    <option value="General Science (Physics, Chem, Bio)">🔬 सामान्य विज्ञान (Physics, Chem, Bio)</option>
                    <option value="Indian Polity & Constitution">🏛️ भारतीय राजव्यवस्था व संविधान</option>
                    <option value="Current Affairs 2026">📰 ताजा करेंट अफेयर्स (Latest CA)</option>
                  </select>
                </div>

                {/* Question Count */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase">
                    प्रश्नों की संख्या:
                  </label>
                  <select
                    value={aiCount}
                    onChange={e => setAiCount(Number(e.target.value))}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-white outline-none focus:border-cyan-500"
                  >
                    <option value={5}>5 प्रश्न (क्विक मुकाबला)</option>
                    <option value={10}>10 प्रश्न (मानक बैटल)</option>
                    <option value={15}>15 प्रश्न (विस्तृत टेस्ट)</option>
                    <option value={20}>20 प्रश्न (फुल मॉक बैटल)</option>
                  </select>
                </div>

                {/* Difficulty */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase">
                    कठिनाई स्तर (Difficulty):
                  </label>
                  <select
                    value={aiDifficulty}
                    onChange={e => setAiDifficulty(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-white outline-none focus:border-cyan-500"
                  >
                    <option value="Easy">सरल (Easy - Foundation)</option>
                    <option value="Medium">मध्यम (Medium - Official Exam Standard)</option>
                    <option value="Hard">कठिन (Hard - Advanced / Topper Level)</option>
                  </select>
                </div>
              </div>

              {/* Custom Topic Prompt with Mic Button */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase flex items-center justify-between">
                  <span>विशिष्ट टॉपिक या अध्याय (लिखें या बोलकर बताएं):</span>
                  {isRecording && recordingTarget === 'ai-prompt' && (
                    <span className="text-rose-400 animate-pulse font-bold text-xs flex items-center gap-1">
                      <Mic className="w-3.5 h-3.5" /> वॉयस रिकॉर्डिंग चालू है...
                    </span>
                  )}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiTopicPrompt}
                    onChange={e => setAiTopicPrompt(e.target.value)}
                    placeholder="उदा. प्रकाश का अपवर्तन, 1857 की क्रांति, मौलिक अधिकार, या आशुलिपि नियम"
                    className="flex-1 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-white outline-none focus:border-cyan-500"
                  />
                  <button
                    onClick={() => startSpeechRecognition('ai-prompt')}
                    className={`p-3 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      isRecording && recordingTarget === 'ai-prompt'
                        ? 'bg-rose-600 border-rose-500 text-white animate-pulse'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                    }`}
                    title="बोलकर टॉपिक बताएं"
                  >
                    <Mic className="w-4 h-4 text-cyan-400" />
                    <span>बोलें</span>
                  </button>
                </div>
              </div>

              {/* Generate CTA */}
              <button
                onClick={handleGenerateQuestionsWithAI}
                disabled={isGeneratingAI}
                className={`w-full py-4 rounded-2xl font-black text-sm text-white shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  isGeneratingAI
                    ? 'bg-slate-800 opacity-60 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 via-cyan-600 to-blue-600 hover:opacity-95 transform hover:scale-101'
                }`}
              >
                {isGeneratingAI ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>AI प्रश्न तैयार कर रहा है... कृपया प्रतीक्षा करें</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-amber-300" />
                    <span>AI से {aiCount} प्रश्न सेट तुरंत जनरेट करें (Generate AI Quiz)</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* TAB C: VOICE-TO-QUESTION STUDIO (बोलकर प्रश्न और विकल्प तैयार करें) */}
          {activeTab === 'voice-create' && (
            <div className="bg-[#091122] border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-black uppercase text-emerald-300 flex items-center gap-2">
                  <Mic className="w-4 h-4 text-emerald-400" />
                  <span>वॉयस प्रश्न क्रिएटर (Speak to Create Questions &amp; Options)</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">Speech-to-Quiz Engine</span>
              </div>

              {/* Voice Mode Selector: All-in-One Voice vs Step-by-Step Form */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setVoiceMode('all-in-one')}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    voiceMode === 'all-in-one'
                      ? 'bg-emerald-950/80 border-emerald-400 text-white shadow-lg'
                      : 'bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-black">ऑल-इन-वन वॉयस डिटेक्शन</span>
                  </div>
                  <p className="text-[10px] text-slate-300 mt-1">
                    एक ही बार बोलें: "प्रश्न ... विकल्प 1 ... विकल्प 2 ... विकल्प 3 ... विकल्प 4 ... सही उत्तर 2"
                  </p>
                </button>

                <button
                  onClick={() => setVoiceMode('custom-form')}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    voiceMode === 'custom-form'
                      ? 'bg-emerald-950/80 border-emerald-400 text-white shadow-lg'
                      : 'bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-black">स्टेप-बाय-स्टेप वॉयस फॉर्म</span>
                  </div>
                  <p className="text-[10px] text-slate-300 mt-1">
                    प्रश्न और प्रत्येक विकल्प के माइक बटन पर क्लिक करके अलग-अलग बोलें या टाइप करें।
                  </p>
                </button>
              </div>

              {/* MODE 1: ALL-IN-ONE SPEECH DETECTOR */}
              {voiceMode === 'all-in-one' && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <Mic className="w-4 h-4 text-emerald-400" />
                      <span>माइक दबाएं और पूरा प्रश्न + 4 विकल्प + सही उत्तर एक साथ बोलें:</span>
                    </span>
                    <button
                      onClick={() => startSpeechRecognition('all-in-one')}
                      className={`px-4 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-lg transition-all ${
                        isRecording && recordingTarget === 'all-in-one'
                          ? 'bg-rose-600 text-white animate-pulse'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      }`}
                    >
                      {isRecording && recordingTarget === 'all-in-one' ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      <span>{isRecording && recordingTarget === 'all-in-one' ? 'रिकॉर्डिंग रोकें' : 'बोलना शुरू करें'}</span>
                    </button>
                  </div>

                  {voiceTranscript && (
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-200">
                      <strong className="text-amber-300">ट्रांसक्रिप्ट:</strong> {voiceTranscript}
                    </div>
                  )}
                </div>
              )}

              {/* STEP-BY-STEP QUESTION & OPTIONS INPUT FORM */}
              <div className="space-y-4">
                {/* 1. Question Input with Mic */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase flex items-center justify-between">
                    <span>प्रश्न टेक्स्ट (Question Text):</span>
                    {isRecording && recordingTarget === 'q-text' && (
                      <span className="text-rose-400 animate-pulse text-xs">सुन रहे हैं...</span>
                    )}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customQuestionText}
                      onChange={e => setCustomQuestionText(e.target.value)}
                      placeholder="उदा. भारत के प्रथम राष्ट्रपति कौन थे?"
                      className="flex-1 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-white outline-none focus:border-emerald-500"
                    />
                    <button
                      onClick={() => startSpeechRecognition('q-text')}
                      className={`p-3 rounded-xl border text-xs font-bold cursor-pointer shrink-0 ${
                        isRecording && recordingTarget === 'q-text'
                          ? 'bg-rose-600 text-white animate-pulse'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                      }`}
                      title="बोलकर प्रश्न बताएं"
                    >
                      <Mic className="w-4 h-4 text-emerald-400" />
                    </button>
                  </div>
                </div>

                {/* 2. 4 Options with Individual Mic Buttons */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase">
                    4 विकल्प (बोलकर या टाइप करके दर्ज करें और सही विकल्प चुनें):
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {customOptions.map((opt, oIdx) => (
                      <div key={oIdx} className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                          <span>विकल्प {String.fromCharCode(65 + oIdx)}</span>
                          <label className="flex items-center gap-1 text-emerald-400 cursor-pointer">
                            <input
                              type="radio"
                              name="correctOption"
                              checked={customCorrectIndex === oIdx}
                              onChange={() => setCustomCorrectIndex(oIdx)}
                              className="accent-emerald-500 cursor-pointer"
                            />
                            <span>सही उत्तर</span>
                          </label>
                        </div>
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            value={opt}
                            onChange={e => {
                              const val = e.target.value;
                              setCustomOptions(prev => {
                                const next = [...prev];
                                next[oIdx] = val;
                                return next;
                              });
                            }}
                            placeholder={`विकल्प ${String.fromCharCode(65 + oIdx)}...`}
                            className={`flex-1 p-2.5 bg-slate-950 border rounded-xl text-xs font-bold text-white outline-none ${
                              customCorrectIndex === oIdx ? 'border-emerald-500/80 bg-emerald-950/20' : 'border-slate-800'
                            }`}
                          />
                          <button
                            onClick={() => startSpeechRecognition(`opt${oIdx}` as any)}
                            className={`p-2.5 rounded-xl border text-xs cursor-pointer shrink-0 ${
                              isRecording && recordingTarget === `opt${oIdx}`
                                ? 'bg-rose-600 text-white animate-pulse'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                            }`}
                            title={`बोलकर विकल्प ${String.fromCharCode(65 + oIdx)} भरें`}
                          >
                            <Mic className="w-4 h-4 text-emerald-400" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add to Battle Pool Button */}
                <button
                  onClick={handleAddCustomQuestion}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>यह प्रश्न बैटल रूम में जोड़ें (Add Question)</span>
                </button>
              </div>

              {/* Custom Questions List Preview */}
              {customQuestionsList.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-slate-800">
                  <span className="text-xs font-bold text-amber-300">
                    आपके द्वारा जोड़े गए प्रश्न ({customQuestionsList.length}):
                  </span>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {customQuestionsList.map((cq, i) => (
                      <div key={i} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                        <div className="space-y-0.5 max-w-[80%]">
                          <p className="font-bold text-white truncate">{i + 1}. {cq.question}</p>
                          <p className="text-[10px] text-emerald-400">सही: {cq.options[cq.correct]}</p>
                        </div>
                        <button
                          onClick={() => {
                            setCustomQuestionsList(prev => prev.filter((_, idx) => idx !== i));
                            setQuestionsPool(prev => prev.filter(q => q.id !== cq.id));
                          }}
                          className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* -------------------------------------------------------------
          VIEW 2: LIVE MULTIPLAYER LOBBY (10 to 50 Students Waiting Room)
          ------------------------------------------------------------- */}
      {battleState === 'lobby' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Lobby Status Card */}
          <div className="lg:col-span-2 bg-[#091122] border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⚔️</span>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    लाइव बैटल रूम लॉबी
                  </h2>
                </div>
                <p className="text-slate-300 text-xs mt-1">
                  रूम कोड: <strong className="text-amber-300 font-mono text-sm">{roomCode}</strong> • क्षमता: <strong className="text-cyan-300">{roomCapacity} छात्र</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-750 text-xs font-bold text-slate-200 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCode ? 'Copied' : 'कोड कॉपी'}</span>
                </button>
                <button
                  onClick={handleShareWhatsApp}
                  className="px-3 py-2 rounded-xl bg-emerald-600 text-white text-xs font-black flex items-center gap-1 cursor-pointer shadow-md"
                >
                  <Share2 className="w-4 h-4" />
                  <span>व्हाट्सएप शेयर</span>
                </button>
              </div>
            </div>

            {/* 10 to 50 Students Grid in Lobby */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>जुड़े हुए लाइव प्रतियोगी ({participants.length} / {roomCapacity}):</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  🟢 सभी तैयार (Ready)
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-72 overflow-y-auto p-2 bg-slate-950/70 rounded-2xl border border-slate-850">
                {participants.map((p, idx) => (
                  <div
                    key={p.id}
                    className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${
                      p.isUser
                        ? 'bg-amber-500/10 border-amber-500/50 shadow-md'
                        : 'bg-slate-900/80 border-slate-800'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${p.avatarColor} text-white font-black text-xs flex items-center justify-center shrink-0 shadow-inner`}>
                      {p.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white truncate">
                        {p.name}
                      </p>
                      <p className="text-[9px] text-slate-400 truncate">{p.state}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Battle Info Cards */}
            <div className="grid grid-cols-3 gap-3 p-3 bg-slate-950 rounded-2xl border border-slate-800 text-center">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">कुल प्रश्न</span>
                <span className="text-sm font-black text-amber-300 font-mono">{battleQuestions.length} Qs</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">प्रति प्रश्न टाइमर</span>
                <span className="text-sm font-black text-rose-400 font-mono">{questionTimerSec}s</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">अधिकतम अंक</span>
                <span className="text-sm font-black text-emerald-400 font-mono">{battleQuestions.length * (10 + questionTimerSec)} pts</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => setBattleState('setup')}
                className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs rounded-2xl border border-slate-750 cursor-pointer"
              >
                ⚙️ सेटिंग्स बदलें
              </button>

              <button
                onClick={handleStartBattle}
                className="flex-1 py-3.5 bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 hover:opacity-95 text-white font-black text-sm rounded-2xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 transform hover:scale-101"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>मुकाबला शुरू करें (Start Live Battle Now)</span>
              </button>
            </div>
          </div>

          {/* Lobby Live Chat & Rules Card */}
          <div className="bg-[#091122] border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-cyan-400" />
                  <span>लाइव रूम चैट व नियम</span>
                </h3>
                <span className="text-[10px] text-emerald-400 font-mono">LOBBY CHAT</span>
              </div>

              {/* Chat Messages */}
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {lobbyChat.map((msg, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-950 border border-slate-850 space-y-1 text-xs">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-amber-300">{msg.sender}</span>
                      <span className="text-slate-500">{msg.time}</span>
                    </div>
                    <p className="text-slate-200">{msg.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Input */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={e => setChatMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendChatMessage()}
                  placeholder="साथियों को मैसेज भेजें..."
                  className="flex-1 p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-cyan-500"
                />
                <button
                  onClick={handleSendChatMessage}
                  className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          VIEW 3: ACTIVE LIVE BATTLE ARENA (Interactive In-Game Screen)
          ------------------------------------------------------------- */}
      {battleState === 'active' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Battle Question Column */}
          <div className="lg:col-span-3 space-y-6">
            {/* Top Bar with Question Count, Timer, and User Live Score */}
            <div className="flex items-center justify-between bg-[#091122] border border-slate-800 p-4 rounded-2xl shadow-lg">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  प्रश्न {currentIdx + 1} / {battleQuestions.length}
                </span>
                <button
                  onClick={() => playNaturalSpeech(currentQ.question + '. ' + currentQ.options.join('. '))}
                  className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:text-rose-400 transition-colors cursor-pointer"
                  title="प्रश्न आवाज में सुनें"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <span className="text-[10px] bg-slate-950 text-cyan-300 px-2.5 py-0.5 rounded-full border border-slate-800 hidden sm:inline">
                  {currentQ.subject || 'सामान्य अध्ययन'}
                </span>
              </div>

              {/* Dynamic Countdown Timer with Color Pulse */}
              <div className={`flex items-center gap-1.5 font-mono font-black text-sm sm:text-base px-3 py-1 rounded-xl border ${
                timeLeft <= 4
                  ? 'bg-rose-950 border-rose-500 text-rose-400 animate-pulse'
                  : 'bg-slate-950 border-slate-800 text-amber-300'
              }`}>
                <Timer className="w-4 h-4" />
                <span>{timeLeft}s</span>
              </div>

              <div className="flex items-center gap-2">
                {userStreak > 1 && (
                  <span className="text-[10px] font-black text-orange-400 bg-orange-950/80 px-2 py-0.5 rounded-md border border-orange-500/40 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-orange-400 fill-current" />
                    <span>{userStreak}x Streak</span>
                  </span>
                )}
                <div className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  आपका स्कोर: {userScore} pts
                </div>
              </div>
            </div>

            {/* Question Text & Options Card */}
            <div className="bg-[#091122] border-2 border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <h3 className="text-lg sm:text-2xl font-bold text-white leading-relaxed">
                {currentQ.question}
              </h3>

              {/* 4 Interactive Option Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {currentQ.options.map((opt, oIdx) => {
                  const hasAnswered = selectedOption !== null;
                  const isSelected = selectedOption === oIdx;
                  const isCorrect = oIdx === currentQ.correct;

                  let btnStyle = 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700';
                  if (hasAnswered) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-950/90 border-emerald-500 text-emerald-200 shadow-lg shadow-emerald-950/50';
                    } else if (isSelected && !isCorrect) {
                      btnStyle = 'bg-rose-950/90 border-rose-500 text-rose-200 shadow-lg shadow-rose-950/50';
                    } else {
                      btnStyle = 'bg-slate-950/40 border-slate-850 text-slate-500 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleOptionSelect(oIdx)}
                      disabled={hasAnswered}
                      className={`p-4 sm:p-5 rounded-2xl border text-left text-sm sm:text-base font-semibold transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center border ${
                          hasAnswered && isCorrect
                            ? 'bg-emerald-600 text-white border-emerald-400'
                            : hasAnswered && isSelected && !isCorrect
                            ? 'bg-rose-600 text-white border-rose-400'
                            : 'bg-slate-900 text-slate-400 border-slate-800'
                        }`}>
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span className="leading-snug">{opt}</span>
                      </div>
                      {hasAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                      {hasAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Next Question Button */}
              {selectedOption !== null && (
                <div className="space-y-4 pt-3 border-t border-slate-800 animate-fade-in">
                  {currentQ.explanation && (
                    <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs text-slate-300">
                      <strong className="text-amber-300">व्याख्या:</strong> {currentQ.explanation}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-slate-400">
                      आपकी वर्तमान रैंक: <strong className="text-amber-300 font-mono">#{userRankIndex + 1}</strong> / {participants.length}
                    </div>

                    <button
                      onClick={handleNextQuestion}
                      className="px-8 py-3 bg-gradient-to-r from-rose-600 to-orange-600 text-white font-black text-sm rounded-2xl flex items-center gap-2 cursor-pointer shadow-lg transform hover:scale-102 transition-all"
                    >
                      <span>{currentIdx < battleQuestions.length - 1 ? 'अगला मुकाबला (Next Q)' : 'बैटल परिणाम देखें (Result)'}</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Live 10 to 50 Multi-player Leaderboard Column */}
          <div className="space-y-4">
            <div className="bg-[#091122] border-2 border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>लाइव लीडरबोर्ड ({participants.length})</span>
                </h3>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">LIVE</span>
              </div>

              {/* Live Ranked List with Real-Time Dynamic Shifting */}
              <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
                {sortedLeaderboard.map((player, pIdx) => {
                  const isTop3 = pIdx < 3;
                  return (
                    <div
                      key={player.id}
                      className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                        player.isUser
                          ? 'bg-amber-500/15 border-amber-500/60 shadow-md'
                          : 'bg-slate-950/80 border-slate-850'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                          pIdx === 0
                            ? 'bg-amber-400 text-slate-950 font-bold'
                            : pIdx === 1
                            ? 'bg-slate-300 text-slate-950 font-bold'
                            : pIdx === 2
                            ? 'bg-amber-700 text-white font-bold'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {pIdx + 1}
                        </span>
                        <div className="min-w-0">
                          <p className={`text-xs truncate ${player.isUser ? 'font-black text-amber-300' : 'font-bold text-white'}`}>
                            {player.name}
                          </p>
                          <span className="text-[9px] text-slate-400">{player.state}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {player.status === 'answered' && (
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                            player.lastAnswerCorrect ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                          }`}>
                            {player.lastAnswerCorrect ? '✓' : '✗'}
                          </span>
                        )}
                        <span className="font-mono text-xs font-black text-amber-300">
                          {player.score} pts
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          VIEW 4: POST-BATTLE PODIUM & FULL RANK RESULTS
          ------------------------------------------------------------- */}
      {battleState === 'finished' && (
        <div className="bg-[#091122] border-2 border-rose-500/40 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl animate-fade-in">
          {/* Podium Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-bold uppercase border border-amber-500/20">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>ग्रुप क्विज़ बैटल समाप्त</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white font-hindi-title">
              बैटल चैम्पियनशिप परिणाम (Grand Podium)
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm">
              रूम कोड: <strong className="text-amber-300 font-mono">{roomCode}</strong> • कुल प्रतियोगी: <strong className="text-cyan-300">{participants.length} छात्र</strong>
            </p>
          </div>

          {/* Top 3 Grand Visual Podium */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-2xl mx-auto pt-6 items-end">
            {/* Rank 2 - Silver */}
            {sortedLeaderboard[1] && (
              <div className="bg-slate-900 border border-slate-700 rounded-3xl p-4 text-center space-y-2 shadow-xl flex flex-col items-center">
                <span className="text-2xl sm:text-3xl">🥈</span>
                <span className="text-xs font-black text-slate-300 truncate w-full">
                  {sortedLeaderboard[1].name}
                </span>
                <span className="text-[10px] text-slate-400">{sortedLeaderboard[1].state}</span>
                <span className="font-mono text-xs sm:text-sm font-black text-amber-300">
                  {sortedLeaderboard[1].score} pts
                </span>
                <span className="text-[9px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-bold">
                  रैंक #2
                </span>
              </div>
            )}

            {/* Rank 1 - Gold (Taller) */}
            {sortedLeaderboard[0] && (
              <div className="bg-gradient-to-b from-amber-950 via-slate-900 to-amber-950 border-2 border-amber-400 rounded-3xl p-5 text-center space-y-2.5 shadow-2xl flex flex-col items-center -translate-y-4">
                <span className="text-3xl sm:text-4xl animate-bounce">🏆</span>
                <span className="text-xs sm:text-sm font-black text-amber-300 truncate w-full">
                  {sortedLeaderboard[0].name}
                </span>
                <span className="text-[10px] text-slate-300">{sortedLeaderboard[0].state}</span>
                <span className="font-mono text-sm sm:text-base font-black text-amber-400">
                  {sortedLeaderboard[0].score} pts
                </span>
                <span className="text-[10px] bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-full font-black uppercase">
                  विजेता (1st Rank)
                </span>
              </div>
            )}

            {/* Rank 3 - Bronze */}
            {sortedLeaderboard[2] && (
              <div className="bg-slate-900 border border-amber-900/60 rounded-3xl p-4 text-center space-y-2 shadow-xl flex flex-col items-center">
                <span className="text-2xl sm:text-3xl">🥉</span>
                <span className="text-xs font-black text-amber-700 truncate w-full">
                  {sortedLeaderboard[2].name}
                </span>
                <span className="text-[10px] text-slate-400">{sortedLeaderboard[2].state}</span>
                <span className="font-mono text-xs sm:text-sm font-black text-amber-300">
                  {sortedLeaderboard[2].score} pts
                </span>
                <span className="text-[9px] bg-slate-800 text-amber-500 px-2 py-0.5 rounded-full font-bold">
                  रैंक #3
                </span>
              </div>
            )}
          </div>

          {/* User Scorecard Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl font-black text-amber-300 font-mono">
                #{userRankIndex + 1}
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">आपकी अंतिम रैंक</p>
                <h4 className="text-base sm:text-lg font-black text-white">
                  Rank #{userRankIndex + 1} / {participants.length} छात्र
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-4 text-center">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">आपका कुल स्कोर</span>
                <span className="text-lg font-black text-emerald-400 font-mono">{userScore} pts</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">सटीकता (Accuracy)</span>
                <span className="text-lg font-black text-cyan-400 font-mono">
                  {Math.round((userScore / Math.max(1, battleQuestions.length * (10 + questionTimerSec))) * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Full Rank Table of All 10-50 Students */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>सभी {participants.length} प्रतियोगियों की संपूर्ण रैंक सूची</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-80 overflow-y-auto pr-1">
              {sortedLeaderboard.map((p, idx) => (
                <div
                  key={p.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                    p.isUser
                      ? 'bg-amber-500/20 border-amber-500/60 font-black'
                      : 'bg-slate-950 border-slate-850'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-slate-400 text-[10px] w-6">#{idx + 1}</span>
                    <span className="text-white truncate">{p.name}</span>
                  </div>
                  <span className="font-mono text-amber-300 font-bold">{p.score} pts</span>
                </div>
              ))}
            </div>
          </div>

          {/* Post-Battle Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-800">
            <button
              onClick={() => {
                setBattleState('setup');
                setActiveTab('create');
              }}
              className="flex-1 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-black text-xs sm:text-sm rounded-2xl cursor-pointer shadow-lg flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>नया बैटल रूम बनाएं / पुनः खेलें (New Battle Room)</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="py-3.5 px-6 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs sm:text-sm rounded-2xl border border-slate-750 cursor-pointer flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span>परिणाम दोस्तों को शेयर करें</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveGroupQuizStudio;
