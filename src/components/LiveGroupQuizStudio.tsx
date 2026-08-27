import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, Volume2, VolumeX, Trophy, Clock, CheckCircle2, XCircle, 
  Sparkles, Play, Plus, ArrowRight, Share2, Copy, Check, RefreshCw, 
  Flame, Award, ShieldAlert, BookOpen, AlertCircle, Download, 
  HelpCircle, MessageSquare, Zap, Radio, ChevronRight, BarChart2,
  Smile, UserCheck, Star, QrCode, MessageCircle, Send
} from 'lucide-react';
import { QuizQuestion, GroupQuizRoom, GroupQuizParticipant, MistakeNotebookItem, ExamPracticeLeaderboardEntry } from '../types';
import { speakText, stopAllSpeech } from '../utils/speechUtils';
import { 
  saveGroupQuizRoomToFirestore, 
  subscribeGroupQuizRoomFromFirestore,
  getGroupQuizRoomFromFirestore,
  saveExamLeaderboardEntryToFirestore,
  getExamLeaderboardFromFirestore
} from '../lib/firebase';
import { getAppShareUrl, shareViaWhatsApp, shareViaTelegram, copyToClipboard } from '../utils/shareUtils';

interface LiveGroupQuizStudioProps {
  language?: 'hindi' | 'english';
  showToast: (msg: string, type?: 'info' | 'success' | 'warn' | 'error') => void;
  onAddToMistakeNotebook?: (item: MistakeNotebookItem) => void;
  onExportPdf?: (title: string, elementId?: string, rawText?: string) => void;
  userName?: string;
  userEmail?: string;
  user?: any;
  onBackToHome?: () => void;
}

// Built-in Comprehensive Question Bank for Live Battles
const QUESTION_BANK: Record<string, QuizQuestion[]> = {
  gk: [
    {
      question: "भारतीय संविधान का कौन सा अनुच्छेद 'समान नागरिक संहिता' (UCC) से संबंधित है?",
      options: ["अनुच्छेद 40", "अनुच्छेद 44", "अनुच्छेद 48", "अनुच्छेद 51A"],
      answerIndex: 1,
      explanation: "अनुच्छेद 44 राज्य के नीति निर्देशक सिद्धांतों (DPSP) के तहत नागरिकों के लिए समान नागरिक संहिता का प्रावधान करता है।"
    },
    {
      question: "1857 के प्रथम स्वतंत्रता संग्राम के समय भारत का गवर्नर जनरल कौन था?",
      options: ["लॉर्ड डलहौजी", "लॉर्ड कैनिंग", "लॉर्ड कर्जन", "लॉर्ड रिपन"],
      answerIndex: 1,
      explanation: "लॉर्ड कैनिंग 1857 के विद्रोह के समय भारत के गवर्नर जनरल थे और 1858 में भारत के पहले वायसराय बने।"
    },
    {
      question: "किस संशोधन अधिनियम द्वारा भारतीय संविधान की प्रस्तावना में 'समाजवादी', 'धर्मनिरपेक्ष' और 'अखंडता' शब्द जोड़े गए?",
      options: ["42वाँ संशोधन 1976", "44वाँ संशोधन 1978", "52वाँ संशोधन 1985", "86वाँ संशोधन 2002"],
      answerIndex: 0,
      explanation: "42वें संविधान संशोधन 1976 (मिनी कॉन्स्टिट्यूशन) द्वारा प्रस्तावना में ये तीनों शब्द जोड़े गए थे।"
    },
    {
      question: "सिंधु घाटी सभ्यता का प्रमुख बंदरगाह नगर कौन-सा था?",
      options: ["कालीबंगा", "लोथल", "मोहनजोदड़ो", "हड़प्पा"],
      answerIndex: 1,
      explanation: "गुजरात के भोगवा नदी तट पर स्थित 'लोथल' सिंधु सभ्यता का प्राचीन प्रमुख बंदरगाह (डॉकयार्ड) था।"
    },
    {
      question: "भारत में 'नीली क्रांति' (Blue Revolution) का संबंध किससे है?",
      options: ["दुग्ध उत्पादन", "मत्स्य उत्पादन", "तिलहन उत्पादन", "खाद्यान्न उत्पादन"],
      answerIndex: 1,
      explanation: "नीली क्रांति मत्स्य (मछली) उत्पादन के तीव्र विकास से संबंधित है।"
    }
  ],
  reasoning: [
    {
      question: "निम्नलिखित श्रृंखला में प्रश्नचिह्न (?) के स्थान पर क्या आएगा?\n3, 7, 16, 35, 74, ?",
      options: ["149", "153", "150", "148"],
      answerIndex: 1,
      explanation: "पैटर्न: (3×2)+1=7, (7×2)+2=16, (16×2)+3=35, (35×2)+4=74, (74×2)+5=153।"
    },
    {
      question: "यदि 'A' का अर्थ '+', 'B' का अर्थ '-', 'C' का अर्थ '×', और 'D' का अर्थ '÷' है, तो 18 C 4 A 12 D 3 B 6 का मान क्या होगा?",
      options: ["70", "72", "76", "68"],
      answerIndex: 0,
      explanation: "18 × 4 + (12 ÷ 3) - 6 = 72 + 4 - 6 = 76 - 6 = 70।"
    },
    {
      question: "दिए गए विकल्पों में से विषम संख्या युग्म चुनिए:\n(A) 12 : 144  (B) 14 : 196  (C) 16 : 256  (D) 18 : 320",
      options: ["12 : 144", "14 : 196", "16 : 256", "18 : 320"],
      answerIndex: 3,
      explanation: "सभी संख्याओं का वर्ग है, लेकिन 18² = 324 होता है, जबकि यहाँ 320 दिया है।"
    },
    {
      question: "एक निश्चित कूट भाषा में 'WATER' को 'XBUFS' लिखा जाता है, तो उसी कूट में 'RIVER' को क्या लिखा जाएगा?",
      options: ["SJWFS", "SKWFS", "SJVES", "TJXFS"],
      answerIndex: 0,
      explanation: "प्रत्येक अक्षर में +1 की वृद्धि हो रही है (R->S, I->J, V->W, E->F, R->S = SJWFS)।"
    }
  ],
  science: [
    {
      question: "मानव आँख में किसी वस्तु का प्रतिबिम्ब कहाँ बनता है?",
      options: ["कॉर्निया", "पुतली", "रेटिना (दृष्टिपटल)", "परितारिका"],
      answerIndex: 2,
      explanation: "मानव आँख में लेंस द्वारा वास्तविक और उल्टा प्रतिबिम्ब रेटिना पर बनता है।"
    },
    {
      question: "विद्युत धारा (Electric Current) का SI मात्रक क्या है?",
      options: ["वोल्ट (Volt)", "एम्पीयर (Ampere)", "ओम (Ohm)", "वाट (Watt)"],
      answerIndex: 1,
      explanation: "विद्युत धारा का SI मात्रक एम्पीयर (A) है।"
    },
    {
      question: "ध्वनि तरंगे किस माध्यम में सबसे तीव्र गति से गमन करती हैं?",
      options: ["निर्वात (Vacuum)", "गैस", "द्रव", "ठोस (Solid)"],
      answerIndex: 3,
      explanation: "ध्वनि तरंगे प्रत्यास्थता अधिक होने के कारण ठोस (जैसे स्टील) में सबसे तेज चलती हैं।"
    },
    {
      question: "भोपाल गैस त्रासदी (1984) में किस विषैली गैस का रिसाव हुआ था?",
      options: ["मिथाइल आइसोसाइनेट (MIC)", "सल्फर डाइऑक्साइड", "कार्बन मोनोऑक्साइड", "क्लोरीन"],
      answerIndex: 0,
      explanation: "यूनियन कार्बाइड कारखाने से मिथाइल आइसोसाइनेट (Methyl Isocyanate) का रिसाव हुआ था।"
    }
  ]
};

export const LiveGroupQuizStudio: React.FC<LiveGroupQuizStudioProps> = ({
  language = 'hindi',
  showToast,
  onAddToMistakeNotebook,
  onExportPdf,
  userName = 'My Aspirant',
  userEmail = '',
  user,
  onBackToHome
}) => {
  const isHindi = language === 'hindi';

  // Navigation Sub-tab: 'battle' (Live Room) or 'leaderboard' (Global Practice Ranks)
  const [activeTab, setActiveTab] = useState<'battle' | 'leaderboard'>('battle');

  // Room State
  const [room, setRoom] = useState<GroupQuizRoom | null>(null);
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [playerName, setPlayerName] = useState(() => user?.name || user?.email?.split('@')[0] || userName || 'Student Aspirant');
  const [playerId] = useState(() => 'usr_' + Math.random().toString(36).substring(2, 9));

  // Host configuration state
  const [selectedSubject, setSelectedSubject] = useState<'gk' | 'reasoning' | 'science'>('gk');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [timePerQ, setTimePerQ] = useState<number>(15);
  const [isSpeakerOn, setIsSpeakerOn] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // In-Game state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [isAnswerLocked, setIsAnswerLocked] = useState<boolean>(false);
  const [answerStartTime, setAnswerStartTime] = useState<number>(0);
  const [roundReviewTime, setRoundReviewTime] = useState<number>(0);

  // Leaderboard state
  const [leaderboardList, setLeaderboardList] = useState<ExamPracticeLeaderboardEntry[]>([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Audio Announcer Debounce Ref
  const speechRef = useRef<boolean>(true);
  speechRef.current = isSpeakerOn;

  // Speak Helper
  const announceVoice = (text: string) => {
    if (!speechRef.current) return;
    try {
      speakText(text, {
        lang: isHindi ? 'hi-IN' : 'en-IN',
        gender: 'female',
        rate: 1.0
      });
    } catch (e) {
      console.warn("Speech error:", e);
    }
  };

  // Helper to generate public share URL with deep link
  const getQuizShareLink = (roomId: string) => {
    const base = getAppShareUrl('group-quiz');
    const sep = base.includes('?') ? '&' : '?';
    return `${base}${sep}room=${roomId}`;
  };

  // Auto-join or auto-populate room code if present in URL
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.location.search) {
        const urlParams = new URLSearchParams(window.location.search);
        const roomFromUrl = urlParams.get('room');
        if (roomFromUrl) {
          const upperCode = roomFromUrl.trim().toUpperCase();
          setRoomCodeInput(upperCode);
          // Attempt auto-connect
          (async () => {
            const existingRoom = await getGroupQuizRoomFromFirestore(upperCode);
            if (existingRoom) {
              const me: GroupQuizParticipant = {
                id: playerId,
                name: playerName.trim() || 'Student Aspirant',
                avatar: '👨‍🎓',
                score: 0,
                correctCount: 0,
                wrongCount: 0,
                unattemptedCount: 0,
                totalTimeSeconds: 0,
                isHost: existingRoom.hostId === playerId,
                isReady: true,
                answers: {}
              };
              const updatedParticipants = {
                ...existingRoom.participants,
                [playerId]: me
              };
              const updatedRoom: GroupQuizRoom = {
                ...existingRoom,
                participants: updatedParticipants
              };
              setRoom(updatedRoom);
              await saveGroupQuizRoomToFirestore(updatedRoom);
              showToast(isHindi ? `लाइव रूम ${upperCode} में जुड़ गए हैं!` : `Connected to live room ${upperCode}!`, 'success');
            }
          })();
        }
      }
    } catch (err) {
      console.warn("Error parsing URL room code:", err);
    }
  }, []);

  // Load Exam Leaderboard on mount / tab change
  useEffect(() => {
    if (activeTab === 'leaderboard') {
      fetchLeaderboard();
    }
  }, [activeTab]);

  const fetchLeaderboard = async () => {
    setIsLoadingLeaderboard(true);
    try {
      const data = await getExamLeaderboardFromFirestore(40);
      if (data && data.length > 0) {
        setLeaderboardList(data);
      } else {
        const sample: ExamPracticeLeaderboardEntry[] = [
          { id: 'lb-1', name: 'हंसलाल पाल (Founder)', avatar: '👑', examTitle: 'SSC CGL Tier 1 Mock Full', subject: 'General Studies & Reasoning', score: 194, totalQuestions: 100, correctCount: 97, wrongCount: 3, timeSpentSeconds: 2450, accuracy: 97, rank: 1, timestamp: new Date(Date.now() - 3600000).toISOString() },
          { id: 'lb-2', name: 'प्रिया शर्मा', avatar: '👩‍🎓', examTitle: 'Railway NTPC CBT-1 Mock', subject: 'General Awareness', score: 186, totalQuestions: 100, correctCount: 93, wrongCount: 7, timeSpentSeconds: 2600, accuracy: 93, rank: 2, timestamp: new Date(Date.now() - 7200000).toISOString() },
          { id: 'lb-3', name: 'रोहित वर्मा', avatar: '👨‍🎓', examTitle: 'BPSC Prelims Full Mock', subject: 'Polity & Bihar GK', score: 180, totalQuestions: 100, correctCount: 90, wrongCount: 10, timeSpentSeconds: 2750, accuracy: 90, rank: 3, timestamp: new Date(Date.now() - 14400000).toISOString() },
          { id: 'lb-4', name: 'अमित कुमार', avatar: '👨‍💻', examTitle: 'SSC GD Constable Test', subject: 'Maths & Reasoning', score: 174, totalQuestions: 100, correctCount: 87, wrongCount: 13, timeSpentSeconds: 2900, accuracy: 87, rank: 4, timestamp: new Date(Date.now() - 28800000).toISOString() },
          { id: 'lb-5', name: 'अंजलि पटेल', avatar: '👩‍🏫', examTitle: 'State Police SI Special', subject: 'Indian Constitution & CrPC', score: 168, totalQuestions: 100, correctCount: 84, wrongCount: 16, timeSpentSeconds: 3100, accuracy: 84, rank: 5, timestamp: new Date(Date.now() - 43200000).toISOString() }
        ];
        setLeaderboardList(sample);
      }
    } catch (e) {
      console.warn("Could not load leaderboard:", e);
    } finally {
      setIsLoadingLeaderboard(false);
    }
  };

  // Real-time Firestore sync listener for active Room
  useEffect(() => {
    if (!room?.id) return;
    const unsub = subscribeGroupQuizRoomFromFirestore(room.id, (updatedRoom) => {
      if (updatedRoom) {
        setRoom(prev => {
          return {
            ...prev,
            ...updatedRoom,
            questions: updatedRoom.questions || prev?.questions || []
          };
        });
      }
    });
    return () => unsub();
  }, [room?.id]);

  // Any User can Host / Create a room
  const handleCreateRoom = async () => {
    const rawQuestions = QUESTION_BANK[selectedSubject] || QUESTION_BANK.gk;
    const shuffledQuestions = [...rawQuestions].sort(() => 0.5 - Math.random()).slice(0, questionCount);
    
    const newRoomCode = 'HANS-' + Math.floor(1000 + Math.random() * 9000);
    
    const hostParticipant: GroupQuizParticipant = {
      id: playerId,
      name: playerName.trim() || 'Student Host',
      avatar: '👑',
      score: 0,
      correctCount: 0,
      wrongCount: 0,
      unattemptedCount: 0,
      totalTimeSeconds: 0,
      isHost: true,
      isReady: true,
      answers: {}
    };

    // 100% REAL users only - NO simulated bots or fake names!
    const initialParticipants: Record<string, GroupQuizParticipant> = {
      [playerId]: hostParticipant
    };

    const newRoom: GroupQuizRoom = {
      id: newRoomCode,
      title: `${selectedSubject.toUpperCase()} Live Group Battle`,
      subject: selectedSubject,
      category: 'live-battle',
      hostId: playerId,
      hostName: playerName.trim() || 'Student Host',
      status: 'lobby',
      currentQuestionIndex: 0,
      timePerQuestion: timePerQ,
      questionStartTime: 0,
      questions: shuffledQuestions,
      participants: initialParticipants,
      speakerEnabled: isSpeakerOn,
      voiceLanguage: isHindi ? 'hindi' : 'english',
      createdAt: new Date().toISOString()
    };

    setRoom(newRoom);
    await saveGroupQuizRoomToFirestore(newRoom);
    showToast(isHindi ? `रूम तैयार! कोड: ${newRoomCode}` : `Room Created! Code: ${newRoomCode}`, 'success');
    announceVoice(isHindi ? `ग्रुप क्विज रूम कोड ${newRoomCode} तैयार है! अपने दोस्तों को लिंक भेजकर आमंत्रित करें।` : `Group Quiz Room ${newRoomCode} is ready! Share the link to invite friends.`);
  };

  // Join Room via Code
  const handleJoinRoom = async () => {
    const code = roomCodeInput.trim().toUpperCase();
    if (!code) {
      showToast(isHindi ? 'कृपया रूम कोड दर्ज करें' : 'Please enter a valid room code', 'warn');
      return;
    }

    const existingRoom = await getGroupQuizRoomFromFirestore(code);
    if (!existingRoom) {
      showToast(isHindi ? 'रूम नहीं मिला! कृपया सही कोड दर्ज करें।' : 'Room not found! Please check the code.', 'error');
      return;
    }

    const me: GroupQuizParticipant = {
      id: playerId,
      name: playerName.trim() || 'Student Aspirant',
      avatar: '👨‍🎓',
      score: 0,
      correctCount: 0,
      wrongCount: 0,
      unattemptedCount: 0,
      totalTimeSeconds: 0,
      isHost: false,
      isReady: true,
      answers: {}
    };

    const updatedParticipants = {
      ...existingRoom.participants,
      [playerId]: me
    };

    const updatedRoom: GroupQuizRoom = {
      ...existingRoom,
      participants: updatedParticipants
    };

    setRoom(updatedRoom);
    await saveGroupQuizRoomToFirestore(updatedRoom);
    showToast(isHindi ? `आप रूम ${code} में जुड़ गए हैं!` : `Joined Room ${code}!`, 'success');
    announceVoice(isHindi ? `${playerName}, आप लाइव ग्रुप क्विज़ में शामिल हो चुके हैं!` : `Welcome to the Group Quiz, ${playerName}!`);
  };

  // Start Quiz Battle (Host initiates, state propagates to all participants via Firestore)
  const handleStartGame = async () => {
    if (!room) return;
    const now = Date.now();
    const startedRoom: GroupQuizRoom = {
      ...room,
      status: 'in-progress',
      currentQuestionIndex: 0,
      questionStartTime: now
    };
    setRoom(startedRoom);
    setTimeLeft(room.timePerQuestion);
    setIsAnswerLocked(false);
    setSelectedOption(null);
    setAnswerStartTime(now);
    await saveGroupQuizRoomToFirestore(startedRoom);

    const firstQ = room.questions[0];
    announceVoice(isHindi 
      ? `क्विज़ शुरू! पहला प्रश्न: ${firstQ?.question}` 
      : `Quiz Started! Question 1: ${firstQ?.question}`);
  };

  // Timer Tick
  useEffect(() => {
    if (!room || room.status !== 'in-progress') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        if (prev === 6) {
          announceVoice(isHindi ? "अंतिम 5 सेकंड शेष!" : "Final 5 seconds remaining!");
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [room?.status, room?.currentQuestionIndex]);

  // Handle Player Submitting Answer
  const handleSelectOption = async (optionIdx: number) => {
    if (!room || isAnswerLocked || room.status !== 'in-progress') return;
    setIsAnswerLocked(true);
    setSelectedOption(optionIdx);

    const timeTaken = Math.max(0.5, (Date.now() - answerStartTime) / 1000);
    const currentQ = room.questions[room.currentQuestionIndex];
    const isCorrect = optionIdx === currentQ.answerIndex;
    const speedBonus = Math.max(0, Math.round((room.timePerQuestion - timeTaken) * 6));
    const pointsGained = isCorrect ? (100 + speedBonus) : 0;

    const me = room.participants[playerId] || {
      id: playerId,
      name: playerName,
      avatar: '👨‍🎓',
      score: 0,
      correctCount: 0,
      wrongCount: 0,
      unattemptedCount: 0,
      totalTimeSeconds: 0,
      isHost: false,
      isReady: true,
      answers: {}
    };

    const updatedMe: GroupQuizParticipant = {
      ...me,
      score: me.score + pointsGained,
      correctCount: me.correctCount + (isCorrect ? 1 : 0),
      wrongCount: me.wrongCount + (isCorrect ? 0 : 1),
      totalTimeSeconds: me.totalTimeSeconds + timeTaken,
      lastAnswer: {
        questionIndex: room.currentQuestionIndex,
        optionIndex: optionIdx,
        isCorrect,
        timeTakenSeconds: Math.round(timeTaken * 10) / 10,
        timestamp: Date.now()
      },
      answers: {
        ...me.answers,
        [room.currentQuestionIndex]: {
          optionIndex: optionIdx,
          isCorrect,
          timeTakenSeconds: Math.round(timeTaken * 10) / 10
        }
      }
    };

    const updatedRoom: GroupQuizRoom = {
      ...room,
      participants: {
        ...room.participants,
        [playerId]: updatedMe
      }
    };

    setRoom(updatedRoom);
    await saveGroupQuizRoomToFirestore(updatedRoom);

    // Immediate Speaker Announcer
    if (isCorrect) {
      announceVoice(isHindi 
        ? `शाबाश ${playerName.split(' ')[0]}! आपका जवाब बिल्कुल सही है! प्लस ${pointsGained} अंक मिले!` 
        : `Brilliant ${playerName.split(' ')[0]}! Your answer is correct! +${pointsGained} points!`);
    } else {
      announceVoice(isHindi 
        ? `ओह! ${playerName.split(' ')[0]}, आपका जवाब गलत हो गया!` 
        : `Oops! ${playerName.split(' ')[0]}, that answer is wrong!`);
      
      // Auto add to mistake notebook
      if (onAddToMistakeNotebook) {
        onAddToMistakeNotebook({
          id: `mistake-grp-${Date.now()}`,
          question: currentQ.question,
          options: currentQ.options,
          userAnswerIndex: optionIdx,
          correctAnswerIndex: currentQ.answerIndex,
          userAnswerText: currentQ.options[optionIdx],
          correctAnswerText: currentQ.options[currentQ.answerIndex],
          explanation: currentQ.explanation,
          subject: room.subject,
          topic: room.title,
          date: new Date().toLocaleDateString()
        });
      }
    }
  };

  // Time is Up - Move to Review Screen
  const handleTimeUp = async () => {
    if (!room) return;
    const currentQ = room.questions[room.currentQuestionIndex];
    
    // Mark unattempted for those who didn't submit
    const updatedParticipants = { ...room.participants };
    Object.keys(updatedParticipants).forEach(pId => {
      const p = updatedParticipants[pId];
      if (!p.answers[room.currentQuestionIndex]) {
        updatedParticipants[pId] = {
          ...p,
          unattemptedCount: p.unattemptedCount + 1,
          answers: {
            ...p.answers,
            [room.currentQuestionIndex]: {
              optionIndex: -1,
              isCorrect: false,
              timeTakenSeconds: room.timePerQuestion
            }
          }
        };
      }
    });

    const reviewedRoom: GroupQuizRoom = {
      ...room,
      status: 'question-review',
      participants: updatedParticipants
    };

    setRoom(reviewedRoom);
    await saveGroupQuizRoomToFirestore(reviewedRoom);

    announceVoice(isHindi 
      ? `समय समाप्त! सही उत्तर था: ${currentQ?.options[currentQ?.answerIndex]}` 
      : `Time up! The correct answer was: ${currentQ?.options[currentQ?.answerIndex]}`);
  };

  // Move to Next Question or Final Podium
  const handleNextQuestion = async () => {
    if (!room) return;
    const nextIdx = room.currentQuestionIndex + 1;
    
    if (nextIdx >= room.questions.length) {
      // Game Over -> Podium
      const finalRoom: GroupQuizRoom = {
        ...room,
        status: 'podium-finished'
      };
      setRoom(finalRoom);
      await saveGroupQuizRoomToFirestore(finalRoom);

      // Save user score to global leaderboard
      const me = finalRoom.participants[playerId];
      if (me) {
        const accuracy = Math.round((me.correctCount / finalRoom.questions.length) * 100);
        await saveExamLeaderboardEntryToFirestore({
          id: `lb_${playerId}_${Date.now()}`,
          name: me.name,
          avatar: me.avatar,
          examTitle: finalRoom.title,
          subject: finalRoom.subject,
          score: me.score,
          totalQuestions: finalRoom.questions.length,
          correctCount: me.correctCount,
          wrongCount: me.wrongCount,
          timeSpentSeconds: Math.round(me.totalTimeSeconds),
          accuracy,
          timestamp: new Date().toISOString()
        });
      }

      // Announce final winner
      const sortedParticipants = Object.values(finalRoom.participants).sort((a, b) => b.score - a.score);
      const winner = sortedParticipants[0];
      announceVoice(isHindi 
        ? `क्विज़ समाप्त! बधाई हो, प्रथम स्थान पर रहे ${winner?.name} कुल ${winner?.score} अंकों के साथ!` 
        : `Quiz Finished! Congratulations to the winner ${winner?.name} with ${winner?.score} points!`);
      return;
    }

    const now = Date.now();
    const nextRoom: GroupQuizRoom = {
      ...room,
      status: 'in-progress',
      currentQuestionIndex: nextIdx,
      questionStartTime: now
    };

    setRoom(nextRoom);
    setTimeLeft(room.timePerQuestion);
    setIsAnswerLocked(false);
    setSelectedOption(null);
    setAnswerStartTime(now);
    await saveGroupQuizRoomToFirestore(nextRoom);

    const nextQ = room.questions[nextIdx];
    announceVoice(isHindi 
      ? `प्रश्न ${nextIdx + 1}: ${nextQ?.question}` 
      : `Question ${nextIdx + 1}: ${nextQ?.question}`);
  };

  // Copy Room Code / Share Link
  const handleCopyShareLink = () => {
    if (!room) return;
    const shareUrl = getQuizShareLink(room.id);
    copyToClipboard(shareUrl);
    setIsCopied(true);
    showToast(isHindi ? 'रूम लिंक कॉपी हो गया!' : 'Room link copied to clipboard!', 'success');
    setTimeout(() => setIsCopied(false), 2500);
  };

  // WhatsApp Share
  const handleWhatsAppShare = () => {
    if (!room) return;
    const shareUrl = getQuizShareLink(room.id);
    const msg = `🎯 हंस कंपैन (Hans Compain) लाइव ग्रुप क्विज़ चैलेंज!\n👉 रूम कोड: *${room.id}*\n✨ लाइव क्विज़ रूम में तुरंत जुड़ने के लिए नीचे दिए लिंक पर क्लिक करें:\n${shareUrl}`;
    shareViaWhatsApp({ text: msg, url: shareUrl });
  };

  // Telegram Share
  const handleTelegramShare = () => {
    if (!room) return;
    const shareUrl = getQuizShareLink(room.id);
    const msg = `🎯 हंस कंपैन (Hans Compain) लाइव ग्रुप क्विज़! रूम कोड: ${room.id}. लाइव रूम में अभी जुड़ें:`;
    shareViaTelegram({ text: msg, url: shareUrl });
  };

  // Get Sorted Participant Ranks
  const getRankedParticipants = () => {
    if (!room) return [];
    return Object.values(room.participants).sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.correctCount !== a.correctCount) return b.correctCount - a.correctCount;
      return a.totalTimeSeconds - b.totalTimeSeconds;
    });
  };

  const rankedList = getRankedParticipants();
  const myParticipant = room?.participants[playerId];
  const myRank = rankedList.findIndex(p => p.id === playerId) + 1;

  // Filtered leaderboard entries for global tab
  const filteredLeaderboard = leaderboardList.filter(item => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return item.name.toLowerCase().includes(q) || item.examTitle.toLowerCase().includes(q) || item.subject.toLowerCase().includes(q);
  });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-fade-in text-slate-100 p-2 sm:p-4">
      
      {/* TOP HEADER: BLUE & GREEN LIGHT PALETTE */}
      <div className="bg-slate-900/90 border-2 border-blue-500/30 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white shadow-xl shadow-blue-500/20 shrink-0">
            <Users className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-500/30">
                LIVE MULTIPLAYER & RANK LEADERBOARD
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30">
                VOICE ANNOUNCER 🔊
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
              {isHindi ? '👥 लाइव ग्रुप क्विज़ व ऑल-इंडिया रैंक तालिका' : '👥 Live Group Quiz & All-India Rank Leaderboard'}
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              {isHindi 
                ? 'कहीं से भी दोस्तों के साथ रियल-टाइम क्विज़ खेलें — स्पीकर नाम बोलेगा, लाइव स्कोर व रैंक लिस्ट दिखेगी!' 
                : 'Take real-time group quizzes anywhere with live voice announcer, instant timer & ranks!'}
            </p>
          </div>
        </div>

        {/* CONTROLS: SPEAKER TOGGLE & TAB SWITCH */}
        <div className="flex items-center gap-2 self-stretch md:self-auto justify-end flex-wrap">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700"
              title="Back to Home / होम पर वापस"
            >
              <span>←</span>
              <span>{isHindi ? 'होम' : 'Home'}</span>
            </button>
          )}

          <button
            onClick={() => {
              const next = !isSpeakerOn;
              setIsSpeakerOn(next);
              if (!next) stopAllSpeech();
              showToast(next ? 'स्पीकर चालू (Voice Announcer ON)' : 'स्पीकर म्यूट (Voice Announcer OFF)', 'info');
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ${
              isSpeakerOn 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-md shadow-emerald-950/40' 
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
            title="Toggle Voice Speaker"
          >
            {isSpeakerOn ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            <span>{isSpeakerOn ? (isHindi ? 'स्पीकर ON' : 'Speaker ON') : (isHindi ? 'स्पीकर OFF' : 'Muted')}</span>
          </button>

          <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setActiveTab('battle')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'battle' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              {isHindi ? '⚔️ लाइव क्विज़' : '⚔️ Live Battle'}
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'leaderboard' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              {isHindi ? '🏆 रैंक तालिका' : '🏆 Rank Leaderboard'}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: GLOBAL PRACTICE EXAM LEADERBOARD (रैंक के हिसाब से सबका नाम) */}
      {/* ========================================================================= */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  <span>{isHindi ? 'सभी टेस्ट व प्रैक्टिस सेट की लाइव रैंक लिस्ट' : 'Live Practice & Exam Leaderboard'}</span>
                </h2>
                <p className="text-xs text-slate-400">
                  {isHindi ? 'किसने दिया टेस्ट, कितने नंबर पर है, सही-गलत और समय का पूरा हिसाब' : 'All students ranked by accuracy, net score and response speed'}
                </p>
              </div>

              {/* SEARCH FILTER */}
              <div className="w-full sm:w-72">
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder={isHindi ? "छात्र या परीक्षा का नाम खोजें..." : "Search student or exam name..."}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* LEADERBOARD TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] font-black uppercase text-slate-400 tracking-wider">
                    <th className="py-3 px-3">रैंक (Rank)</th>
                    <th className="py-3 px-3">छात्र (Aspirant)</th>
                    <th className="py-3 px-3">परीक्षा / टेस्ट</th>
                    <th className="py-3 px-3 text-center">कुल स्कोर</th>
                    <th className="py-3 px-3 text-center">सही (✅)</th>
                    <th className="py-3 px-3 text-center">गलत (❌)</th>
                    <th className="py-3 px-3 text-center">सटीकता (Accuracy)</th>
                    <th className="py-3 px-3 text-right">समय (Speed)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {filteredLeaderboard.map((item, idx) => {
                    const rankNum = idx + 1;
                    const isTop3 = rankNum <= 3;
                    const isCurrentUser = item.name.toLowerCase().includes(playerName.toLowerCase());

                    return (
                      <tr 
                        key={item.id || idx}
                        className={`transition-colors ${
                          isCurrentUser 
                            ? 'bg-blue-950/40 border-l-4 border-l-blue-500' 
                            : idx % 2 === 0 ? 'bg-slate-900/30' : 'bg-transparent'
                        } hover:bg-slate-800/50`}
                      >
                        <td className="py-3.5 px-3 font-black">
                          {rankNum === 1 ? (
                            <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-extrabold border border-amber-500/40 flex items-center gap-1 w-max">
                              🥇 #1
                            </span>
                          ) : rankNum === 2 ? (
                            <span className="px-2.5 py-1 rounded-full bg-slate-300/20 text-slate-200 font-extrabold border border-slate-400/40 flex items-center gap-1 w-max">
                              🥈 #2
                            </span>
                          ) : rankNum === 3 ? (
                            <span className="px-2.5 py-1 rounded-full bg-amber-700/20 text-amber-500 font-extrabold border border-amber-700/40 flex items-center gap-1 w-max">
                              🥉 #3
                            </span>
                          ) : (
                            <span className="text-slate-400 font-mono pl-2">#{rankNum}</span>
                          )}
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{item.avatar || '👨‍🎓'}</span>
                            <span className="font-bold text-white">{item.name}</span>
                            {isCurrentUser && (
                              <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[9px] font-black">
                                YOU (मेरा नंबर)
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-slate-300 font-medium max-w-xs truncate">
                          {item.examTitle || item.subject}
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-black font-mono">
                            {item.score} pts
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-center font-bold text-emerald-400 font-mono">
                          {item.correctCount || 0}
                        </td>
                        <td className="py-3.5 px-3 text-center font-bold text-rose-400 font-mono">
                          {item.wrongCount || 0}
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span className={`font-extrabold ${item.accuracy >= 90 ? 'text-emerald-400' : item.accuracy >= 75 ? 'text-blue-400' : 'text-amber-400'}`}>
                            {item.accuracy}%
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right text-slate-400 font-mono">
                          {Math.round(item.timeSpentSeconds / 60)}m {item.timeSpentSeconds % 60}s
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: LIVE GROUP QUIZ BATTLE (कही भी हो एक साथ क्विज़) */}
      {/* ========================================================================= */}
      {activeTab === 'battle' && (
        <div className="space-y-6">

          {/* 1. LOBBY SCREEN (CREATE / JOIN ROOM) */}
          {(!room || room.status === 'lobby') && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* LEFT (7 COLS): HOST / CREATE NEW ROOM */}
              <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
                <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                      <Plus className="w-5 h-5 text-blue-400" />
                      <span>{isHindi ? 'नया ग्रुप क्विज़ रूम बनाएं' : 'Host New Group Quiz'}</span>
                    </h2>
                    <p className="text-xs text-slate-400">
                      {isHindi ? 'विषय चुनें, कोड पाएं और दोस्तों को आमंत्रित करें' : 'Choose subject & get 6-digit code for your friends'}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-blue-500/20 text-blue-300 font-black text-[10px]">
                    HOST MODE
                  </span>
                </div>

                {/* PLAYER NAME */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    {isHindi ? 'आपका नाम (Leaderboard में दिखेगा):' : 'Your Display Name:'}
                  </label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white font-bold focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* SUBJECT PICKER */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    {isHindi ? 'क्विज़ का विषय (Subject):' : 'Select Quiz Subject:'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'gk', label: 'सामान्य ज्ञान (GS & Polity)', icon: '🏛️' },
                      { id: 'reasoning', label: 'रीजनिंग (Reasoning)', icon: '🧩' },
                      { id: 'science', label: 'विज्ञान (Science Lab)', icon: '🔬' }
                    ].map(subj => (
                      <button
                        key={subj.id}
                        type="button"
                        onClick={() => setSelectedSubject(subj.id as any)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                          selectedSubject === subj.id
                            ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-xl">{subj.icon}</span>
                        <span className="text-xs font-bold leading-tight line-clamp-1">{subj.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* QUESTION COUNT & TIMER */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      {isHindi ? 'प्रश्नों की संख्या:' : 'Questions Count:'}
                    </label>
                    <div className="flex gap-2">
                      {[5, 10].map(cnt => (
                        <button
                          key={cnt}
                          type="button"
                          onClick={() => setQuestionCount(cnt)}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            questionCount === cnt
                              ? 'bg-emerald-600 text-white border-emerald-500'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {cnt} {isHindi ? 'प्रश्न' : 'Qns'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      {isHindi ? 'समय प्रति प्रश्न:' : 'Time Per Question:'}
                    </label>
                    <div className="flex gap-2">
                      {[15, 30].map(sec => (
                        <button
                          key={sec}
                          type="button"
                          onClick={() => setTimePerQ(sec)}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            timePerQ === sec
                              ? 'bg-blue-600 text-white border-blue-500'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {sec}s ⏱️
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CREATE ACTION BUTTONS */}
                <div className="pt-2">
                  <button
                    onClick={handleCreateRoom}
                    className="w-full py-4 px-4 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-extrabold rounded-2xl text-sm shadow-xl shadow-blue-900/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
                  >
                    <Radio className="w-4 h-4 animate-pulse" />
                    <span>{isHindi ? '🎯 नया लाइव क्विज़ रूम बनाएं (Create Quiz Room)' : '🎯 Create Live Quiz Room'}</span>
                  </button>
                </div>
              </div>

              {/* RIGHT (5 COLS): JOIN EXISTING ROOM & ACTIVE ROOM LOBBY */}
              <div className="lg:col-span-5 space-y-4">
                
                {/* JOIN BOX */}
                {!room && (
                  <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
                    <div className="border-b border-slate-800 pb-3">
                      <h2 className="text-base font-black text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-emerald-400" />
                        <span>{isHindi ? 'रूम कोड से जुड़ें (Join Room)' : 'Join Room with Code'}</span>
                      </h2>
                      <p className="text-xs text-slate-400">
                        {isHindi ? 'दोस्त द्वारा शेयर किया गया रूम कोड (उदा. HANS-4812) दर्ज करें' : 'Enter the room code (e.g. HANS-4812) shared by your friend'}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <input
                        type="text"
                        value={roomCodeInput}
                        onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                        placeholder="e.g. HANS-8921"
                        maxLength={9}
                        className="w-full px-4 py-3 bg-slate-950 border-2 border-slate-700 focus:border-emerald-500 rounded-xl text-center text-base sm:text-lg font-mono font-black text-white tracking-widest focus:outline-none transition-colors"
                      />
                      <button
                        onClick={handleJoinRoom}
                        disabled={!roomCodeInput.trim()}
                        className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 active:scale-95 transition-all"
                      >
                        <Play className="w-4 h-4" />
                        <span>{isHindi ? 'क्विज़ रूम में शामिल हों' : 'Join Room Now'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* CONNECTED LOBBY MEMBERS (WHEN ROOM IS OPEN) */}
                {room && room.status === 'lobby' && (
                  <div className="bg-slate-900/90 border-2 border-emerald-500/40 rounded-3xl p-5 shadow-2xl space-y-4">
                    <div className="border-b border-slate-800 pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            ROOM ACTIVE
                          </span>
                          <h3 className="text-xl font-black text-white font-mono mt-1">
                            {room.id}
                          </h3>
                        </div>
                        
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={handleWhatsAppShare}
                            title="Share on WhatsApp"
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </button>
                          <button
                            onClick={handleTelegramShare}
                            title="Share on Telegram"
                            className="p-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl transition-all cursor-pointer shadow-md"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={handleCopyShareLink}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{isCopied ? (isHindi ? 'कॉपी हुआ!' : 'Copied!') : (isHindi ? 'लिंक' : 'Link')}</span>
                          </button>
                        </div>
                      </div>

                      {/* Share Prompt */}
                      <p className="text-[11px] text-emerald-300/90 mt-2 bg-emerald-950/40 p-2 rounded-xl border border-emerald-500/20">
                        {isHindi 
                          ? '📲 अपने दोस्तों को WhatsApp या Telegram पर लिंक भेजें — वे सीधे आपके रूम में लाइव जुड़कर मुकाबला करेंगे!' 
                          : '📲 Share the link with friends on WhatsApp or Telegram — they will join your live battle room directly!'}
                      </p>
                    </div>

                    {/* CONNECTED MEMBERS LIST */}
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-slate-400 flex items-center justify-between">
                        <span>{isHindi ? 'जुड़े हुए छात्र (Connected Aspirants):' : 'Connected Participants:'}</span>
                        <span className="text-emerald-400 font-mono font-bold">{Object.keys(room.participants).length} Online</span>
                      </div>
                      
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {Object.values(room.participants).map(p => (
                          <div key={p.id} className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-base">{p.avatar}</span>
                              <span className="text-xs font-bold text-white">{p.name}</span>
                              {p.isHost && (
                                <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 text-[9px] font-bold rounded">
                                  HOST
                                </span>
                              )}
                              {p.id === playerId && (
                                <span className="px-1.5 py-0.2 bg-blue-500/20 text-blue-300 text-[9px] font-bold rounded">
                                  YOU
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                              Ready
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* START BUTTON (HOST ONLY) */}
                    {room.participants[playerId]?.isHost ? (
                      <button
                        onClick={handleStartGame}
                        className="w-full py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-black text-sm rounded-2xl shadow-xl shadow-emerald-950/50 flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-all"
                      >
                        <Play className="w-5 h-5 fill-white" />
                        <span>{isHindi ? 'सब तैयार हैं — लाइव क्विज़ शुरू करें! (Start Quiz)' : 'Start Group Quiz Battle!'}</span>
                      </button>
                    ) : (
                      <div className="p-3 bg-blue-950/30 border border-blue-500/20 rounded-xl text-center text-xs text-blue-300">
                        {isHindi ? 'होस्ट द्वारा क्विज़ शुरू करने की प्रतीक्षा की जा रही है...' : 'Waiting for Host to start the quiz...'}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. ACTIVE QUESTION SCREEN (LIVE IN-PROGRESS BATTLE) */}
          {room && (room.status === 'in-progress' || room.status === 'question-review') && (
            <div className="space-y-5 max-w-4xl mx-auto">
              
              {/* TOP HUD: QUESTION NUMBER, TIME CIRCLE, MY SCORE */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl flex items-center justify-between gap-4">
                
                {/* QUESTION COUNTER */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-black text-blue-300 font-mono text-sm">
                    Q{room.currentQuestionIndex + 1}
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">
                      {isHindi ? 'प्रश्न संख्या' : 'Question'}
                    </div>
                    <div className="text-xs sm:text-sm font-black text-white">
                      {room.currentQuestionIndex + 1} / {room.questions.length}
                    </div>
                  </div>
                </div>

                {/* COUNTDOWN TIMER */}
                <div className="flex items-center gap-2">
                  <div className={`px-4 py-2 rounded-2xl border flex items-center gap-2 font-mono font-black text-base sm:text-lg transition-all ${
                    timeLeft <= 5 
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500 animate-pulse' 
                      : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                  }`}>
                    <Clock className="w-4 h-4" />
                    <span>{timeLeft}s</span>
                  </div>
                </div>

                {/* CURRENT USER LIVE SCORE & RANK */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">
                      {isHindi ? 'मेरा स्कोर (My Score)' : 'My Points'}
                    </div>
                    <div className="text-xs sm:text-sm font-black text-emerald-400 font-mono">
                      {myParticipant?.score || 0} pts
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center font-black text-emerald-300 font-mono text-sm">
                    #{myRank || 1}
                  </div>
                </div>
              </div>

              {/* MAIN QUESTION CARD */}
              {(() => {
                const currentQ = room.questions[room.currentQuestionIndex];
                if (!currentQ) return null;

                return (
                  <div className="bg-slate-900/90 border-2 border-blue-500/30 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-6">
                    
                    {/* QUESTION TEXT */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                        <span className="text-blue-400 uppercase tracking-wider">{room.subject} Battle</span>
                        <button
                          onClick={() => announceVoice(currentQ.question)}
                          className="flex items-center gap-1 text-slate-400 hover:text-emerald-300 cursor-pointer transition-colors"
                          title="Read question again"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span className="text-[11px]">{isHindi ? 'दोबारा सुनें' : 'Listen'}</span>
                        </button>
                      </div>
                      <h2 className="text-base sm:text-xl font-black text-white leading-relaxed whitespace-pre-line">
                        {currentQ.question}
                      </h2>
                    </div>

                    {/* OPTIONS GRID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {currentQ.options.map((opt, optIdx) => {
                        const isSelected = selectedOption === optIdx;
                        const isCorrectAnswer = optIdx === currentQ.answerIndex;
                        const isReviewing = room.status === 'question-review';

                        let btnStyle = 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-blue-500/60 hover:bg-slate-900';
                        if (isReviewing) {
                          if (isCorrectAnswer) {
                            btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-black shadow-lg shadow-emerald-950/50';
                          } else if (isSelected && !isCorrectAnswer) {
                            btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200 font-bold';
                          } else {
                            btnStyle = 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-60';
                          }
                        } else if (isSelected) {
                          btnStyle = 'bg-blue-600/30 border-blue-400 text-white font-bold shadow-lg';
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={isAnswerLocked || isReviewing}
                            onClick={() => handleSelectOption(optIdx)}
                            className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${btnStyle} disabled:cursor-not-allowed`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-7 h-7 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span className="text-xs sm:text-sm font-semibold">{opt}</span>
                            </div>

                            {isReviewing && isCorrectAnswer && (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                            )}
                            {isReviewing && isSelected && !isCorrectAnswer && (
                              <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* LIVE PARTICIPANTS RESPONSE TELEMETRY BAR */}
                    <div className="pt-2 border-t border-slate-800 space-y-2">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                        <span>{isHindi ? 'छात्रों के लाइव उत्तर व गति:' : 'Live Participant Responses:'}</span>
                        <span className="text-emerald-400">{Object.values(room.participants).filter(p => p.answers[room.currentQuestionIndex]).length} / {Object.keys(room.participants).length} Responded</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {Object.values(room.participants).map(p => {
                          const ans = p.answers[room.currentQuestionIndex];
                          const hasAnswered = !!ans;
                          const isReviewing = room.status === 'question-review';

                          return (
                            <div key={p.id} className="p-2 bg-slate-950/60 border border-slate-800/80 rounded-xl flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5 truncate">
                                <span className="text-sm">{p.avatar}</span>
                                <span className="text-[11px] font-bold text-slate-200 truncate">{p.name.split(' ')[0]}</span>
                              </div>

                              {hasAnswered ? (
                                isReviewing ? (
                                  ans.isCorrect ? (
                                    <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                      ✅ {ans.timeTakenSeconds}s
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-black text-rose-400 bg-rose-500/20 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                      ❌ {ans.timeTakenSeconds}s
                                    </span>
                                  )
                                ) : (
                                  <span className="text-[10px] font-bold text-blue-400 bg-blue-500/20 px-1.5 py-0.5 rounded">
                                    ⚡ {ans.timeTakenSeconds}s
                                  </span>
                                )
                              ) : (
                                <span className="text-[10px] text-slate-500 italic">Thinking...</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* EXPLANATION & NEXT ROUND BUTTON (IN REVIEW MODE) */}
                    {room.status === 'question-review' && (
                      <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 animate-fade-in">
                        <div className="text-xs text-slate-300 leading-relaxed">
                          <strong className="text-emerald-400 font-bold">{isHindi ? 'व्याख्या (Explanation): ' : 'Explanation: '}</strong>
                          {currentQ.explanation}
                        </div>

                        <div className="flex justify-end">
                          <button
                            onClick={handleNextQuestion}
                            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
                          >
                            <span>
                              {room.currentQuestionIndex + 1 >= room.questions.length
                                ? (isHindi ? 'अंतिम परिणाम व रैंक देखें 🏆' : 'View Final Podium & Ranks 🏆')
                                : (isHindi ? 'अगला प्रश्न ➔' : 'Next Question ➔')}
                            </span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                );
              })()}

            </div>
          )}

          {/* 3. FINAL PODIUM & RESULTS SCREEN (LAST ME PATA CHALE KITNA JAWAB DIYE RIGHT WRONG & TIME) */}
          {room && room.status === 'podium-finished' && (
            <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
              
              {/* PODIUM HERO BANNER */}
              <div className="bg-gradient-to-b from-blue-950/60 via-slate-900 to-slate-950 border-2 border-emerald-500/40 rounded-3xl p-6 shadow-2xl text-center space-y-5">
                <div className="inline-flex p-3 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-3xl shadow-xl shadow-amber-500/10 animate-bounce">
                  🏆
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {isHindi ? '🎉 ग्रुप क्विज़ संपन्न — परिणाम व रैंक' : '🎉 Group Quiz Finished — Final Ranks'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">
                    {isHindi ? 'किसने कितने सही जवाब दिए, कितना समय लिया और कौन कितने नंबर पर रहा' : 'Full summary of correct/wrong answers, response times & final standings'}
                  </p>
                </div>

                {/* TOP 3 PODIUM */}
                <div className="flex items-end justify-center gap-3 sm:gap-6 pt-4 pb-2">
                  
                  {/* #2 SILVER */}
                  {rankedList[1] && (
                    <div className="flex flex-col items-center">
                      <span className="text-2xl">{rankedList[1].avatar}</span>
                      <span className="text-xs font-black text-slate-200 mt-1 max-w-[90px] truncate">{rankedList[1].name}</span>
                      <span className="text-[11px] font-mono text-emerald-400 font-black">{rankedList[1].score} pts</span>
                      <div className="w-20 sm:w-24 h-24 bg-gradient-to-t from-slate-800 to-slate-700 rounded-t-2xl border-t-2 border-slate-400 flex items-center justify-center text-xl font-black text-slate-300 mt-2 shadow-lg">
                        🥈 2nd
                      </div>
                    </div>
                  )}

                  {/* #1 GOLD WINNER */}
                  {rankedList[0] && (
                    <div className="flex flex-col items-center">
                      <span className="text-3xl animate-bounce">{rankedList[0].avatar}</span>
                      <span className="text-sm font-black text-amber-300 mt-1 max-w-[110px] truncate">{rankedList[0].name}</span>
                      <span className="text-xs font-mono text-emerald-300 font-black">{rankedList[0].score} pts</span>
                      <div className="w-24 sm:w-28 h-32 bg-gradient-to-t from-amber-600 to-yellow-500 rounded-t-2xl border-t-2 border-yellow-300 flex items-center justify-center text-2xl font-black text-slate-950 mt-2 shadow-xl shadow-amber-500/20">
                        🥇 1st
                      </div>
                    </div>
                  )}

                  {/* #3 BRONZE */}
                  {rankedList[2] && (
                    <div className="flex flex-col items-center">
                      <span className="text-2xl">{rankedList[2].avatar}</span>
                      <span className="text-xs font-black text-amber-600 mt-1 max-w-[90px] truncate">{rankedList[2].name}</span>
                      <span className="text-[11px] font-mono text-emerald-400 font-black">{rankedList[2].score} pts</span>
                      <div className="w-20 sm:w-24 h-18 bg-gradient-to-t from-amber-950 to-amber-900 rounded-t-2xl border-t-2 border-amber-700 flex items-center justify-center text-lg font-black text-amber-500 mt-2 shadow-lg">
                        🥉 3rd
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* PERSONAL SCORECARD (MERA NUMBER KITNA HAI) */}
              {myParticipant && (
                <div className="bg-slate-900/90 border-2 border-blue-500/40 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-300 font-black text-lg">
                        #{myRank}
                      </div>
                      <div>
                        <h3 className="text-base font-black text-white">
                          {isHindi ? 'आपका व्यक्तिगत रिपोर्ट कार्ड (Mera Number)' : 'Your Personal Report Card'}
                        </h3>
                        <p className="text-xs text-slate-400">
                          {isHindi ? `${myParticipant.name} का सम्पूर्ण विश्लेषण` : `Detailed stats for ${myParticipant.name}`}
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl font-mono font-black text-xs">
                      {Math.round((myParticipant.correctCount / room.questions.length) * 100)}% Accuracy
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-center">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">{isHindi ? 'कुल स्कोर' : 'Total Score'}</div>
                      <div className="text-lg font-black text-emerald-400 font-mono mt-0.5">{myParticipant.score} pts</div>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-center">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">{isHindi ? 'सही जवाब (✅)' : 'Correct'}</div>
                      <div className="text-lg font-black text-emerald-400 font-mono mt-0.5">{myParticipant.correctCount} / {room.questions.length}</div>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-center">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">{isHindi ? 'गलत जवाब (❌)' : 'Wrong'}</div>
                      <div className="text-lg font-black text-rose-400 font-mono mt-0.5">{myParticipant.wrongCount}</div>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-center">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">{isHindi ? 'औसत गति (⏱️)' : 'Avg Time'}</div>
                      <div className="text-lg font-black text-blue-400 font-mono mt-0.5">{Math.round((myParticipant.totalTimeSeconds / room.questions.length) * 10) / 10}s</div>
                    </div>
                  </div>
                </div>
              )}

              {/* COMPLETE RANK TABLE OF ALL PARTICIPANTS */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center justify-between">
                  <span>{isHindi ? 'सम्पूर्ण रैंक तालिका (All Participants)' : 'Complete Standings'}</span>
                  <span className="text-emerald-400 font-mono">{rankedList.length} Aspirants</span>
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-[10px] font-black uppercase text-slate-400">
                        <th className="py-2.5 px-3">रैंक</th>
                        <th className="py-2.5 px-3">छात्र का नाम</th>
                        <th className="py-2.5 px-3 text-center">स्कोर</th>
                        <th className="py-2.5 px-3 text-center">सही (✅)</th>
                        <th className="py-2.5 px-3 text-center">गलत (❌)</th>
                        <th className="py-2.5 px-3 text-right">समय</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-medium">
                      {rankedList.map((p, idx) => {
                        const rankNum = idx + 1;
                        const isMe = p.id === playerId;

                        return (
                          <tr key={p.id} className={isMe ? 'bg-blue-950/50 font-bold' : ''}>
                            <td className="py-3 px-3 font-black font-mono">
                              #{rankNum} {rankNum === 1 ? '🥇' : rankNum === 2 ? '🥈' : rankNum === 3 ? '🥉' : ''}
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2">
                                <span>{p.avatar}</span>
                                <span className="text-white">{p.name}</span>
                                {isMe && <span className="px-1.5 py-0.2 bg-blue-500/20 text-blue-300 text-[9px] rounded font-bold">YOU</span>}
                              </div>
                            </td>
                            <td className="py-3 px-3 text-center font-mono font-bold text-emerald-400">
                              {p.score} pts
                            </td>
                            <td className="py-3 px-3 text-center font-mono text-emerald-400">
                              {p.correctCount}
                            </td>
                            <td className="py-3 px-3 text-center font-mono text-rose-400">
                              {p.wrongCount}
                            </td>
                            <td className="py-3 px-3 text-right font-mono text-slate-400">
                              {Math.round(p.totalTimeSeconds)}s
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ACTION BUTTONS: PLAY AGAIN OR EXPORT */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => setRoom(null)}
                  className="flex-1 py-3.5 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-black text-xs sm:text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>{isHindi ? 'नया ग्रुप क्विज़ खेलें' : 'Play Another Group Quiz'}</span>
                </button>

                {onExportPdf && (
                  <button
                    onClick={() => {
                      onExportPdf(
                        `${room.title} Result`,
                        undefined,
                        `Group Quiz Room: ${room.id}\nScore: ${myParticipant?.score || 0}\nCorrect: ${myParticipant?.correctCount || 0}/${room.questions.length}\nWrong: ${myParticipant?.wrongCount || 0}\nRank: #${myRank}`
                      );
                    }}
                    className="py-3.5 px-6 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm rounded-2xl border border-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isHindi ? 'रिजल्ट डाउनलोड' : 'Export Scorecard'}</span>
                  </button>
                )}
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};
