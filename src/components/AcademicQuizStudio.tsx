import React, { useState, useEffect, useRef } from 'react';
import { 
  Award, Clock, CheckCircle2, AlertTriangle, HelpCircle, 
  RotateCcw, Sparkles, BookOpen, Layers, Zap, Download, 
  ChevronLeft, ChevronRight, Check, X, Bookmark, BookmarkCheck,
  Languages, FileText, Share2, Search, Filter, ShieldAlert, ArrowLeft
} from 'lucide-react';
import { QuizQuestion, MistakeNotebookItem } from '../types';

export interface PYQExamRecord {
  id: string;
  examName: string;
  examCode: string;
  year: string;
  dateStr: string;
  shift: string;
  subject: string;
  totalQuestions: number;
  timeMinutes: number;
  marksPerQuestion: number;
  negativeMarks: number;
  questions: QuizQuestion[];
}

interface AcademicQuizStudioProps {
  language?: 'hindi' | 'english';
  showToast: (msg: string, type?: 'info' | 'success' | 'warn' | 'error') => void;
  onExportPdf: (title: string, elementId?: string, rawText?: string) => void;
  mistakeNotebook: MistakeNotebookItem[];
  onAddToMistakeNotebook: (mistake: MistakeNotebookItem) => void;
  onRetestMistakes?: (questions: QuizQuestion[], title: string) => void;
}

// Curated Real PYQ Exam Database
const CURATED_PYQ_DATA: PYQExamRecord[] = [
  {
    id: "pyq-ssc-cgl-2024-s1",
    examName: "SSC CGL Tier-1 (General Awareness)",
    examCode: "SSC-CGL-2024",
    year: "2024",
    dateStr: "14 Sept 2024",
    shift: "Shift 1 (9:00 AM - 10:00 AM)",
    subject: "Indian Polity & Modern History",
    totalQuestions: 5,
    timeMinutes: 5,
    marksPerQuestion: 2.0,
    negativeMarks: 0.5,
    questions: [
      {
        question: "भारतीय संविधान का कौन सा अनुच्छेद 'समान नागरिक संहिता' (Uniform Civil Code - UCC) से संबंधित है?",
        options: ["अनुच्छेद 40", "अनुच्छेद 44", "अनुच्छेद 48", "अनुच्छेद 51A"],
        answerIndex: 1,
        explanation: "अनुच्छेद 44 राज्य के नीति निर्देशक सिद्धांतों (DPSP) के तहत राज्य को भारत के पूरे क्षेत्र में नागरिकों के लिए एक समान नागरिक संहिता सुनिश्चित करने का निर्देश देता है।",
        hint: "यह नीति निर्देशक तत्वों (Part IV) के अंतर्गत आता है।"
      },
      {
        question: "1857 के प्रथम स्वतंत्रता संग्राम के समय भारत का गवर्नर जनरल कौन था?",
        options: ["लॉर्ड डलहौजी", "लॉर्ड कैनिंग", "लॉर्ड कर्जन", "लॉर्ड रिपन"],
        answerIndex: 1,
        explanation: "लॉर्ड कैनिंग 1857 के विद्रोह के समय गवर्नर जनरल थे और 1858 के भारत सरकार अधिनियम के बाद वे भारत के पहले वायसराय बने।",
        hint: "वे 1858 के बाद भारत के प्रथम वायसराय भी बने।"
      },
      {
        question: "किस संशोधन अधिनियम द्वारा भारतीय संविधान की प्रस्तावना में 'समाजवादी', 'धर्मनिरपेक्ष' और 'अखंडता' शब्द जोड़े गए?",
        options: ["42वाँ संशोधन अधिनियम 1976", "44वाँ संशोधन अधिनियम 1978", "52वाँ संशोधन अधिनियम 1985", "86वाँ संशोधन अधिनियम 2002"],
        answerIndex: 0,
        explanation: "42वें संविधान संशोधन (1976), जिसे 'लघु संविधान' (Mini Constitution) भी कहा जाता है, द्वारा प्रस्तावना में 'समाजवादी', 'धर्मनिरपेक्ष' और 'अखंडता' शब्द जोड़े गए।",
        hint: "इसे मिनी कॉन्स्टिट्यूशन भी कहा जाता है।"
      },
      {
        question: "हड़प्पा सभ्यता का प्रमुख स्थल 'लोथल' किस नदी के तट पर स्थित था?",
        options: ["रावी नदी", "भोगवा नदी", "सिंधु नदी", "घग्घर नदी"],
        answerIndex: 1,
        explanation: "लोथल गुजरात के भाल क्षेत्र में भोगवा नदी के तट पर स्थित एक प्राचीन बंदरगाह शहर था जिसकी खोज एस. आर. राव ने की थी।",
        hint: "यह गुजरात में प्राचीन गोदीवाड़ा (Dockyard) बंदरगाह था।"
      },
      {
        question: "मानव शरीर में रक्त का शुद्धिकरण (Filtration of Blood) किस अंग में होता है?",
        options: ["हृदय (Heart)", "वृक्क / गुर्दे (Kidneys)", "यकृत (Liver)", "फेफड़े (Lungs)"],
        answerIndex: 1,
        explanation: "गुर्दे (Kidneys) में नेफ्रॉन (Nephron) द्वारा रक्त से यूरिया और विषाक्त पदार्थों को छाना जाता है और मूत्र का निर्माण होता है।",
        hint: "इसकी कार्यात्मक इकाई नेफ्रॉन (Nephron) है।"
      }
    ]
  },
  {
    id: "pyq-rrb-ntpc-2022-s2",
    examName: "RRB NTPC CBT-2 (General Science & GK)",
    examCode: "RRB-NTPC-2022",
    year: "2022",
    dateStr: "12 May 2022",
    shift: "Shift 2 (12:30 PM - 2:00 PM)",
    subject: "General Science & Physics",
    totalQuestions: 5,
    timeMinutes: 5,
    marksPerQuestion: 1.0,
    negativeMarks: 0.33,
    questions: [
      {
        question: "प्रकाश वर्ष (Light Year) निम्नलिखित में से किस भौतिक राशि का मात्रक है?",
        options: ["समय (Time)", "दूरी (Distance)", "प्रकाश की गति (Speed of Light)", "तीव्रता (Intensity)"],
        answerIndex: 1,
        explanation: "प्रकाश वर्ष खगोलीय दूरी का मात्रक है। यह एक वर्ष में प्रकाश द्वारा निर्वात में तय की गई कुल दूरी (लगभग 9.46 × 10^15 मीटर) होती है।",
        hint: "यह तारों और आकाशगंगाओं के बीच का माप है।"
      },
      {
        question: "विद्युत धारा (Electric Current) मापने के लिए किस उपकरण का उपयोग किया जाता है?",
        options: ["वोल्टमीटर", "एमीटर (Ammeter)", "गैल्वेनोमीटर", "ओह्ममीटर"],
        answerIndex: 1,
        explanation: "एमीटर को परिपथ में श्रेणीक्रम (Series) में जोड़कर विद्युत धारा (एम्पीयर में) मापी जाती है।",
        hint: "इसकी इकाई एम्पीयर (A) होती है।"
      },
      {
        question: "पादप कोशिकाओं में कोशिका भित्ति (Cell Wall) मुख्य रूप से किसकी बनी होती है?",
        options: ["सेल्युलोज (Cellulose)", "प्रोटीन", "लिपिड्स", "ग्लाइकोजन"],
        answerIndex: 0,
        explanation: "पादप कोशिका भित्ति सेल्युलोज से बनी होती है जो पौधों को संरचनात्मक मजबूती और सुरक्षा प्रदान करती है।",
        hint: "यह एक जटिल कार्बोहाइड्रेट है।"
      },
      {
        question: "ध्वनि तरंगें (Sound Waves) किस माध्यम में यात्रा नहीं कर सकतीं?",
        options: ["ठोस (Solid)", "द्रव (Liquid)", "गैस (Gas)", "निर्वात (Vacuum)"],
        answerIndex: 3,
        explanation: "ध्वनि एक यांत्रिक तरंग (Mechanical Wave) है जिसे संचरण के लिए भौतिक माध्यम की आवश्यकता होती है, इसलिए यह निर्वात में संचरित नहीं हो सकती।",
        hint: "अंतरिक्ष में कोई माध्यम नहीं होता।"
      },
      {
        question: "लोहे पर जंग लगना (Rusting of Iron) किस प्रकार का परिवर्तन है?",
        options: ["भौतिक परिवर्तन", "रासायनिक परिवर्तन (Chemical Change)", "जैविक परिवर्तन", "उदासीनीकरण"],
        answerIndex: 1,
        explanation: "लोहे पर जंग लगना एक रासायनिक व ऑक्सीकरण प्रक्रिया है जिसमें आयरन ऑक्साइड बनता है और यह अपरिवर्तनीय है।",
        hint: "इसमें नया पदार्थ (Fe2O3.xH2O) बनता है।"
      }
    ]
  },
  {
    id: "pyq-bpsc-69th-prelims",
    examName: "BPSC 69th CCE Prelims (History & Geography)",
    examCode: "BPSC-CCE-69",
    year: "2023",
    dateStr: "30 Sept 2023",
    shift: "Morning Shift (12:00 PM - 2:00 PM)",
    subject: "Bihar Special & Indian History",
    totalQuestions: 5,
    timeMinutes: 5,
    marksPerQuestion: 1.0,
    negativeMarks: 0.33,
    questions: [
      {
        question: "चंपारण सत्याग्रह (1917) में गांधीजी को चंपारण आने का निमंत्रण किसने दिया था?",
        options: ["राजकुमार शुक्ल", "डॉ. राजेंद्र प्रसाद", "ब्रजकिशोर प्रसाद", "मजहरुल हक"],
        answerIndex: 0,
        explanation: "राजकुमार शुक्ल ने 1916 के लखनऊ कांग्रेस अधिवेशन में महात्मा गांधी से भेंट कर चंपारण के नील किसानों की दुर्दशा से अवगत कराया और आने का आग्रह किया।",
        hint: "वे चंपारण के मुरली भरहवा गाँव के किसान नेता थे।"
      },
      {
        question: "मौर्य साम्राज्य के संस्थापक चंद्रगुप्त मौर्य के प्रधानमंत्री कौन थे?",
        options: ["चाणक्य (कौटिल्य)", "मेगास्थनीज", "बिंदुसार", "राधागुप्त"],
        answerIndex: 0,
        explanation: "आचार्य चाणक्य (विष्णुगुप्त) चंद्रगुप्त मौर्य के गुरु और प्रधानमंत्री थे जिन्होंने अर्थशास्त्र ग्रंथ की रचना की।",
        hint: "उन्हें विष्णुगुप्त या कौटिल्य भी कहा जाता है।"
      },
      {
        question: "बिहार का शोक (Sorrow of Bihar) किस नदी को कहा जाता है?",
        options: ["गंगा नदी", "सोन नदी", "कोसी नदी", "गंडक नदी"],
        answerIndex: 2,
        explanation: "कोसी नदी अपने मार्ग परिवर्तन और विनाशकारी बाढ़ के लिए जानी जाती है, इसलिए इसे 'बिहार का शोक' कहा जाता है।",
        hint: "यह नेपाल के गोसाईंस्थान से निकलती है।"
      },
      {
        question: "नालंदा विश्वविद्यालय की स्थापना किस गुप्त शासक के शासनकाल में हुई थी?",
        options: ["चंद्रगुप्त प्रथम", "समुद्रगुप्त", "कुमारगुप्त प्रथम", "स्कंदगुप्त"],
        answerIndex: 2,
        explanation: "नालंदा महाविहार की स्थापना 5वीं शताब्दी ईस्वी में गुप्त सम्राट कुमारगुप्त प्रथम (महेंद्रादित्य) द्वारा की गई थी।",
        hint: "उन्हें महेंद्रादित्य की उपाधि भी प्राप्त थी।"
      },
      {
        question: "बिहार में 1857 की क्रांति का नेतृत्व किसने किया था?",
        options: ["वीर कुंवर सिंह", "अमर सिंह", "पीर अली", "हरकिशन सिंह"],
        answerIndex: 0,
        explanation: "जगदीशपुर (भोजपुर) के 80 वर्षीय जमींदार बाबू वीर कुंवर सिंह ने बिहार में 1857 के स्वतंत्रता संग्राम का ऐतिहासिक नेतृत्व किया।",
        hint: "वे जगदीशपुर के वीर स्वतंत्रता सेनानी थे।"
      }
    ]
  },
  {
    id: "pyq-ssc-steno-2023",
    examName: "SSC Stenographer Grade C & D (General English & Reasoning)",
    examCode: "SSC-STENO-2023",
    year: "2023",
    dateStr: "12 Oct 2023",
    shift: "Shift 1",
    subject: "English Grammar & Shorthand Concept",
    totalQuestions: 5,
    timeMinutes: 5,
    marksPerQuestion: 1.0,
    negativeMarks: 0.25,
    questions: [
      {
        question: "Choose the correct idiom meaning for 'A blessing in disguise':",
        options: [
          "An unfortunate event that brings good results later",
          "A secret prayer said in silence",
          "A false friend who betrays you",
          "A direct reward given by a mentor"
        ],
        answerIndex: 0,
        explanation: "'A blessing in disguise' means something that seems bad or unfortunate at first, but ultimately results in something good.",
        hint: "दुख के वेश में आया सुख"
      },
      {
        question: "Find the correctly spelt word:",
        options: ["Accomodation", "Accommodation", "Acommodation", "Accomadation"],
        answerIndex: 1,
        explanation: "The correct spelling is 'Accommodation' with double 'c' and double 'm'.",
        hint: "It contains double 'c' and double 'm'."
      },
      {
        question: "Pitman Shorthand me 'Consonant P and B' me mukhya antar kya hai?",
        options: [
          "P light stroke hai aur B heavy (dark) stroke hai",
          "P curved hai aur B straight hai",
          "P horizontal hai aur B vertical hai",
          "Dono me koi antar nahi hai"
        ],
        answerIndex: 0,
        explanation: "पिटमैन शॉर्टहैंड में 'P' और 'B' दोनों 120 डिग्री के नीचे की ओर बनने वाले सीधे स्ट्रोक हैं, लेकिन 'P' हल्का (Light) और 'B' गहरा (Heavy/Dark) लिखा जाता है।",
        hint: "लाइट और डार्क स्ट्रोक का सिद्धांत।"
      },
      {
        question: "Select the antonym for 'CANDID':",
        options: ["Honest", "Deceptive", "Frank", "Sincere"],
        answerIndex: 1,
        explanation: "'Candid' means truthful, straightforward and honest. Its exact antonym is 'Deceptive' (धोखेबाज़ या कपटी).",
        hint: "Candid means straightforward/honest."
      },
      {
        question: "Fill in the blank with appropriate preposition: 'She has been living in Delhi ______ 2018.'",
        options: ["for", "since", "from", "in"],
        answerIndex: 1,
        explanation: "Present Perfect Continuous Tense me निश्चित समय बिंदु (Point of Time जैसे 2018) के लिए 'since' का प्रयोग किया जाता है।",
        hint: "Point of time के लिए 'since' लगता है।"
      }
    ]
  }
];

export const AcademicQuizStudio: React.FC<AcademicQuizStudioProps> = ({
  language = 'hindi',
  showToast,
  onExportPdf,
  mistakeNotebook,
  onAddToMistakeNotebook,
  onRetestMistakes
}) => {
  const isHindi = language === 'hindi';

  // Navigation Sub-tabs: 'pyq' | 'practice' | 'custom' | 'mistakes'
  const [activeTab, setActiveTab] = useState<'pyq' | 'practice' | 'custom' | 'mistakes'>('pyq');
  
  // Test State
  const [activeTestMode, setActiveTestMode] = useState<boolean>(false);
  const [currentTestTitle, setCurrentTestTitle] = useState<string>('');
  const [currentExamMeta, setCurrentExamMeta] = useState<{ name: string; date: string; shift: string; marksPerQ: number; negMark: number } | null>(null);
  
  const [testQuestions, setTestQuestions] = useState<QuizQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  
  // User Answers Mapping: { [questionIndex]: selectedOptionIndex }
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  // Review Status Mapping: { [questionIndex]: boolean }
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({});
  
  // Instant Language Toggle on live question screen: 'hi' | 'en'
  const [questionLang, setQuestionLang] = useState<'hi' | 'en'>('hi');

  // Test Completed & Result State
  const [isTestSubmitted, setIsTestSubmitted] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{
    totalQuestions: number;
    attempted: number;
    correct: number;
    wrong: number;
    unattempted: number;
    score: number;
    totalMarks: number;
    accuracy: number;
    timeSpentSeconds: number;
  } | null>(null);

  // Timer
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(300);
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);

  // Custom AI Quiz Generation State
  const [customSubject, setCustomSubject] = useState<string>('General Knowledge & Current Affairs');
  const [customCount, setCustomCount] = useState<number>(5);
  const [customDifficulty, setCustomDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [isGeneratingCustom, setIsGeneratingCustom] = useState<boolean>(false);

  // Filter Search
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Timer Countdown Effect
  useEffect(() => {
    let interval: any = null;
    if (activeTestMode && !isTestSubmitted && !isTimerPaused && timeRemainingSeconds > 0) {
      interval = setInterval(() => {
        setTimeRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTestMode, isTestSubmitted, isTimerPaused, timeRemainingSeconds]);

  // Start a PYQ Test
  const handleStartPYQTest = (pyq: PYQExamRecord) => {
    setTestQuestions(pyq.questions);
    setCurrentTestTitle(pyq.examName);
    setCurrentExamMeta({
      name: pyq.examName,
      date: pyq.dateStr,
      shift: pyq.shift,
      marksPerQ: pyq.marksPerQuestion,
      negMark: pyq.negativeMarks
    });
    setUserAnswers({});
    setMarkedForReview({});
    setCurrentQIndex(0);
    setTimeRemainingSeconds(pyq.timeMinutes * 60);
    setIsTestSubmitted(false);
    setTestResult(null);
    setActiveTestMode(true);
    showToast(`📝 ${pyq.examName} टेस्ट शुरू! समय: ${pyq.timeMinutes} मिनट`, 'info');
  };

  // Start Custom Generated Test
  const handleStartCustomQuiz = async () => {
    if (!customSubject.trim()) return;
    setIsGeneratingCustom(true);
    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: customSubject.trim(),
          difficulty: customDifficulty,
          count: customCount,
          language: isHindi ? 'hindi' : 'english'
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate quiz');

      const quizList = data.quizzes || data.quiz || [];
      if (quizList.length > 0) {
        setTestQuestions(quizList);
        setCurrentTestTitle(`Practice Set: ${customSubject}`);
        setCurrentExamMeta({
          name: `Model Practice Set (${customDifficulty.toUpperCase()})`,
          date: new Date().toLocaleDateString('hi-IN'),
          shift: `${customDifficulty} Level Practice`,
          marksPerQ: customDifficulty === 'Advanced' ? 3.0 : 2.0,
          negMark: customDifficulty === 'Advanced' ? 1.0 : 0.5
        });
        setUserAnswers({});
        setMarkedForReview({});
        setCurrentQIndex(0);
        setTimeRemainingSeconds(quizList.length * 60);
        setIsTestSubmitted(false);
        setTestResult(null);
        setActiveTestMode(true);
        showToast(`✨ ${customDifficulty} स्तर का नया प्रैक्टिस सेट तैयार है! All the best!`, "success");
      }
    } catch (err: any) {
      showToast(err.message || "क्विज़ बनाने में त्रुटि", "error");
    } finally {
      setIsGeneratingCustom(false);
    }
  };

  // Option Click during active test
  const handleSelectOption = (optionIndex: number) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQIndex]: optionIndex
    }));
  };

  // Clear current response
  const handleClearResponse = () => {
    setUserAnswers(prev => {
      const updated = { ...prev };
      delete updated[currentQIndex];
      return updated;
    });
  };

  // Toggle Mark for Review
  const handleToggleReview = () => {
    setMarkedForReview(prev => ({
      ...prev,
      [currentQIndex]: !prev[currentQIndex]
    }));
  };

  // Submit Test & Calculate Results
  const handleSubmitTest = () => {
    let correct = 0;
    let wrong = 0;
    let attempted = 0;

    const marksPerQ = currentExamMeta?.marksPerQ || 2.0;
    const negMark = currentExamMeta?.negMark || 0.5;

    testQuestions.forEach((q, idx) => {
      const selected = userAnswers[idx];
      if (selected !== undefined) {
        attempted++;
        if (selected === q.answerIndex) {
          correct++;
        } else {
          wrong++;
        }
      }
    });

    const unattempted = testQuestions.length - attempted;
    const netScore = Math.max(0, (correct * marksPerQ) - (wrong * negMark));
    const totalMarks = testQuestions.length * marksPerQ;
    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

    const resultSummary = {
      totalQuestions: testQuestions.length,
      attempted,
      correct,
      wrong,
      unattempted,
      score: Number(netScore.toFixed(2)),
      totalMarks,
      accuracy,
      timeSpentSeconds: (currentExamMeta?.marksPerQ || 5) * 60 - timeRemainingSeconds
    };

    setTestResult(resultSummary);
    setIsTestSubmitted(true);
    showToast("🎉 टेस्ट पूरा हुआ! अपना स्कोरकार्ड और विस्तृत समाधान नीचे देखें।", "success");
  };

  // Save specific question to Mistake Notebook
  const handleSaveToMistakeNotebook = (q: QuizQuestion, userAnsIdx?: number) => {
    const item: MistakeNotebookItem = {
      id: `mistake_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      question: q.question,
      options: q.options,
      correctAnswerIndex: q.answerIndex,
      userAnswerIndex: userAnsIdx !== undefined ? userAnsIdx : -1,
      explanation: q.explanation || "No explanation provided.",
      subject: currentExamMeta?.name || "General Quiz",
      timestamp: new Date().toLocaleDateString('hi-IN'),
      attemptCount: 1,
      mastered: false
    };
    onAddToMistakeNotebook(item);
    showToast("📓 प्रश्न मिस्टेक नोटबुक में सुरक्षित कर लिया गया!", "success");
  };

  // Format Seconds to MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // ----------------------------------------------------
  // RENDER 1: ACTIVE LIVE TEST SCREEN (SINGLE SCREEN, NO SCROLL)
  // ----------------------------------------------------
  if (activeTestMode && !isTestSubmitted) {
    const currentQ = testQuestions[currentQIndex];
    const selectedAns = userAnswers[currentQIndex];
    const isReviewed = !!markedForReview[currentQIndex];

    return (
      <div className="flex flex-col h-[calc(100vh-8.5rem)] max-h-[860px] w-full max-w-5xl mx-auto bg-[#070B14] border border-slate-800/90 rounded-2xl shadow-2xl overflow-hidden text-slate-100 select-none animate-fadeIn">
        
        {/* TOP BAR: Exam Name, Date/Shift, Instant Language Switcher & Countdown Timer */}
        <div className="bg-[#0D1424] border-b border-slate-800 px-3 sm:px-5 py-2.5 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 truncate">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div className="truncate">
              <h2 className="text-xs sm:text-sm font-black text-white truncate flex items-center gap-2">
                <span>{currentTestTitle}</span>
              </h2>
              {currentExamMeta && (
                <div className="text-[10px] text-slate-400 flex items-center gap-2 truncate">
                  <span className="text-amber-300 font-semibold">{currentExamMeta.date}</span>
                  <span>•</span>
                  <span className="truncate">{currentExamMeta.shift}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Instant Language Switcher */}
            <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg p-0.5 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setQuestionLang('hi')}
                className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${questionLang === 'hi' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => setQuestionLang('en')}
                className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${questionLang === 'en' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                ENG
              </button>
            </div>

            {/* Live Countdown Timer */}
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border font-mono font-bold text-xs ${
              timeRemainingSeconds <= 60 
                ? 'bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse' 
                : timeRemainingSeconds <= 180 
                ? 'bg-amber-950/60 border-amber-500/60 text-amber-300' 
                : 'bg-slate-900 border-slate-700 text-cyan-300'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTime(timeRemainingSeconds)}</span>
            </div>

            {/* Submit Early Button */}
            <button
              onClick={() => {
                if (window.confirm("क्या आप टेस्ट सबमिट करना चाहते हैं? (Are you sure you want to submit?)")) {
                  handleSubmitTest();
                }
              }}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
            >
              Submit Test
            </button>
          </div>
        </div>

        {/* QUESTION NUMBER PALETTE RIBBON (Adda247 / CBT Style) */}
        <div className="bg-[#090E1A] border-b border-slate-800/80 px-3 py-2 flex items-center justify-between gap-2 overflow-x-auto scrollbar-thin shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {testQuestions.map((_, idx) => {
              const isAnswered = userAnswers[idx] !== undefined;
              const isMarked = !!markedForReview[idx];
              const isCurrent = currentQIndex === idx;

              let btnClass = "bg-slate-800 text-slate-400 border-slate-700";
              if (isAnswered && isMarked) {
                btnClass = "bg-purple-600 text-white border-purple-400 ring-1 ring-purple-300";
              } else if (isAnswered) {
                btnClass = "bg-emerald-600 text-white border-emerald-400";
              } else if (isMarked) {
                btnClass = "bg-amber-600 text-white border-amber-400";
              }

              return (
                <button
                  key={idx}
                  onClick={() => setCurrentQIndex(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                    isCurrent ? 'ring-2 ring-indigo-400 scale-105' : ''
                  } ${btnClass}`}
                  title={`Question ${idx + 1}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="hidden sm:flex items-center gap-3 text-[10px] text-slate-400 shrink-0 font-medium">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded bg-emerald-500"></span> हल किया (Answered)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded bg-amber-500"></span> रिव्यू (Review)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded bg-slate-700"></span> शेष (Not Answered)
            </span>
          </div>
        </div>

        {/* MAIN BODY: QUESTION & OPTIONS (Fitted, High-Legibility, No Unwanted Scrolling) */}
        <div className="flex-1 p-3 sm:p-5 flex flex-col justify-between overflow-y-auto">
          
          <div className="space-y-3 sm:space-y-4">
            {/* Question Header Meta */}
            <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
              <span className="font-extrabold text-indigo-400 flex items-center gap-1.5">
                <span>QUESTION {currentQIndex + 1} of {testQuestions.length}</span>
                {isReviewed && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded font-semibold">
                    Marked for Review
                  </span>
                )}
              </span>
              <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                <span className="text-emerald-400">+{currentExamMeta?.marksPerQ || 2.0} Mark</span>
                <span>•</span>
                <span className="text-rose-400">-{currentExamMeta?.negMark || 0.5} Neg</span>
              </div>
            </div>

            {/* Question Statement */}
            <div className="p-3.5 sm:p-4 bg-[#0B101D] border border-slate-800/90 rounded-xl">
              <p className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                {currentQ?.question}
              </p>
            </div>

            {/* 4 Interactive Options */}
            <div className="grid grid-cols-1 gap-2.5">
              {currentQ?.options.map((opt, oIdx) => {
                const isSelected = selectedAns === oIdx;
                const optionLetters = ['A', 'B', 'C', 'D'];

                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelectOption(oIdx)}
                    className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600/25 border-indigo-500 text-white ring-1 ring-indigo-400'
                        : 'bg-[#0B101D] hover:bg-slate-800/80 border-slate-800/80 text-slate-200'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                      isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {optionLetters[oIdx]}
                    </span>
                    <span className="flex-1 leading-snug">{opt}</span>
                    {isSelected && (
                      <Check className="w-4 h-4 text-indigo-400 shrink-0 ml-auto" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* BOTTOM CONTROLS (TCS / Adda247 Navigation Bar) */}
          <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleReview}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isReviewed
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{isReviewed ? 'Unmark Review' : 'Mark for Review'}</span>
              </button>

              {selectedAns !== undefined && (
                <button
                  type="button"
                  onClick={handleClearResponse}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-rose-400 bg-slate-900 border border-slate-800 cursor-pointer"
                >
                  Clear Response
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentQIndex === 0}
                onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              {currentQIndex < testQuestions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentQIndex(prev => prev + 1)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>Save & Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitTest}
                  className="px-5 py-2 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/40 transition-all cursor-pointer flex items-center gap-1"
                >
                  <span>Submit Test</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // RENDER 2: POST-TEST COMPREHENSIVE RESULT & SOLUTION VIEW
  // (Full Solutions & Explanations ONLY Shown Here)
  // ----------------------------------------------------
  if (activeTestMode && isTestSubmitted && testResult) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 text-slate-100 animate-fadeIn p-2 sm:p-4">
        
        {/* Result Summary Scorecard Card */}
        <div className="bg-gradient-to-br from-[#0B1220] via-[#0E1626] to-[#0A0E1A] border border-amber-500/30 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs font-bold text-amber-300 mb-2">
                <Award className="w-3.5 h-3.5" />
                <span>Test Performance Scorecard (अंतिम परिणाम)</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                {currentTestTitle}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                {currentExamMeta?.date} • {currentExamMeta?.shift}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const solutionRaw = `EXAM: ${currentTestTitle}\nSCORE: ${testResult.score}/${testResult.totalMarks} (Accuracy: ${testResult.accuracy}%)\n\n` +
                    testQuestions.map((q, i) => {
                      const userPick = userAnswers[i] !== undefined ? q.options[userAnswers[i]] : 'Not Attempted';
                      const correctPick = q.options[q.answerIndex];
                      return `[Q${i+1}] ${q.question}\nYour Answer: ${userPick}\nCorrect Answer: ${correctPick}\nExplanation: ${q.explanation || 'N/A'}`;
                    }).join('\n\n---\n\n');
                  onExportPdf(`Result-${currentTestTitle}`, 'test-result-export', solutionRaw);
                }}
                className="px-3.5 py-2 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Solutions PDF</span>
              </button>

              <button
                onClick={() => {
                  setActiveTestMode(false);
                  setIsTestSubmitted(false);
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Exit to Test Hub
              </button>
            </div>
          </div>

          {/* Metric Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Net Score</span>
              <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
                {testResult.score} <span className="text-xs text-slate-400 font-normal">/ {testResult.totalMarks}</span>
              </div>
            </div>

            <div className="p-3.5 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Correct (सही)</span>
              <div className="text-xl sm:text-2xl font-black text-emerald-300 font-mono">
                {testResult.correct} <span className="text-xs text-slate-400 font-normal">/ {testResult.totalQuestions}</span>
              </div>
            </div>

            <div className="p-3.5 bg-rose-950/30 border border-rose-500/30 rounded-xl text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">Wrong (गलत)</span>
              <div className="text-xl sm:text-2xl font-black text-rose-300 font-mono">
                {testResult.wrong} <span className="text-xs text-slate-400 font-normal">/ {testResult.totalQuestions}</span>
              </div>
            </div>

            <div className="p-3.5 bg-indigo-950/30 border border-indigo-500/30 rounded-xl text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider">Accuracy (सटीकता)</span>
              <div className="text-xl sm:text-2xl font-black text-indigo-200 font-mono">
                {testResult.accuracy}%
              </div>
            </div>
          </div>
        </div>

        {/* DETAILED QUESTION-BY-QUESTION SOLUTIONS (STEP-BY-STEP EXPLANATIONS) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <span>विस्तृत समाधान एवं व्याख्या (Detailed Step-by-Step Solutions)</span>
            </h3>
            <span className="text-xs text-slate-400">
              Total {testQuestions.length} Questions
            </span>
          </div>

          {testQuestions.map((q, idx) => {
            const userPick = userAnswers[idx];
            const isCorrect = userPick === q.answerIndex;
            const isAttempted = userPick !== undefined;

            return (
              <div 
                key={idx} 
                className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-3 bg-[#0B101D] ${
                  !isAttempted 
                    ? 'border-slate-800' 
                    : isCorrect 
                    ? 'border-emerald-500/40 bg-emerald-950/10' 
                    : 'border-rose-500/40 bg-rose-950/10'
                }`}
              >
                {/* Question Header & Status Badge */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300">
                    Question #{idx + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-[11px] flex items-center gap-1">
                        <Check className="w-3 h-3" /> Correct (+{currentExamMeta?.marksPerQ || 2})
                      </span>
                    ) : isAttempted ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold text-[11px] flex items-center gap-1">
                        <X className="w-3 h-3" /> Incorrect (-{currentExamMeta?.negMark || 0.5})
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-semibold text-[11px]">
                        Unattempted
                      </span>
                    )}

                    {/* Add to Mistake Notebook */}
                    {!isCorrect && (
                      <button
                        onClick={() => handleSaveToMistakeNotebook(q, userPick)}
                        className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-[11px] font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                        title="Add to Mistake Notebook"
                      >
                        <BookmarkCheck className="w-3 h-3" />
                        <span>Add to Mistake Diary</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Question Text */}
                <p className="text-sm sm:text-base font-semibold text-white">
                  {q.question}
                </p>

                {/* 4 Options with Visual Highlighting */}
                <div className="grid grid-cols-1 gap-2 pt-1">
                  {q.options.map((opt, oIdx) => {
                    const isRightOption = oIdx === q.answerIndex;
                    const isUserChoice = userPick === oIdx;

                    let optClass = "bg-slate-900/60 border-slate-800/80 text-slate-400";
                    if (isRightOption) {
                      optClass = "bg-emerald-950/40 border-emerald-500 text-emerald-200 font-bold ring-1 ring-emerald-500/50";
                    } else if (isUserChoice && !isRightOption) {
                      optClass = "bg-rose-950/40 border-rose-500 text-rose-300 line-through";
                    }

                    return (
                      <div
                        key={oIdx}
                        className={`p-2.5 sm:p-3 rounded-xl border text-xs sm:text-sm flex items-center justify-between ${optClass}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs opacity-75">
                            ({String.fromCharCode(65 + oIdx)})
                          </span>
                          <span>{opt}</span>
                        </div>

                        {isRightOption && (
                          <span className="text-[11px] text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded">
                            ✓ Correct Answer
                          </span>
                        )}
                        {isUserChoice && !isRightOption && (
                          <span className="text-[11px] text-rose-400 font-semibold bg-rose-500/20 px-2 py-0.5 rounded">
                            ✗ Your Choice
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Detailed Explanation Box */}
                {q.explanation && (
                  <div className="p-3.5 bg-[#080D18] border border-indigo-500/30 rounded-xl space-y-1.5 text-xs text-slate-300">
                    <div className="font-bold text-indigo-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>विस्तृत व्याख्या एवं मुख्य परीक्षा बिंदु (Detailed Analysis):</span>
                    </div>
                    <p className="leading-relaxed whitespace-pre-wrap text-slate-200">
                      {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    );
  }

  // ----------------------------------------------------
  // RENDER 3: PRIMARY QUIZ HUB DASHBOARD (PYQ, PRACTICE SETS, CUSTOM AI GENERATOR)
  // ----------------------------------------------------
  const filteredPYQs = CURATED_PYQ_DATA.filter(p => 
    p.examName.toLowerCase().includes(searchFilter.toLowerCase()) ||
    p.subject.toLowerCase().includes(searchFilter.toLowerCase()) ||
    p.year.includes(searchFilter)
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-slate-100 text-left animate-fadeIn">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/60 border border-indigo-500/30 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Academic Exam Intelligence Studio</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            {isHindi ? "PYQ व अभ्यास टेस्ट केंद्र" : "PYQ & Practice Test Engine"}
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            विगत वर्षों के वास्तविक प्रश्न पत्र (PYQ) और विषयवार प्रैक्टिस सेट्स को बिना रुकावट सिंगल स्क्रीन पर हल करें।
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>TCS iON / Adda247 Exam Pattern</span>
          </div>
        </div>
      </div>

      {/* Main Sub-Navigation Tabs */}
      <div className="flex border-b border-slate-800 gap-2">
        <button
          onClick={() => setActiveTab('pyq')}
          className={`pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'pyq'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Award className="w-4 h-4 text-amber-400" />
          <span>📅 Previous Year Questions (PYQ)</span>
        </button>

        <button
          onClick={() => setActiveTab('custom')}
          className={`pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'custom'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>✨ Custom AI Practice Sets</span>
        </button>

        <button
          onClick={() => setActiveTab('mistakes')}
          className={`pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'mistakes'
              ? 'border-rose-500 text-rose-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4 text-rose-400" />
          <span>📓 Mistake Diary ({mistakeNotebook.length})</span>
        </button>
      </div>

      {/* TAB 1: PREVIOUS YEAR QUESTIONS (PYQ WITH DATES & SHIFTS) */}
      {activeTab === 'pyq' && (
        <div className="space-y-4">
          
          {/* Search Filter Box */}
          <div className="flex items-center gap-2 bg-[#0B101D] border border-slate-800 rounded-xl px-3 py-2 text-xs">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="परीक्षा का नाम, वर्ष या विषय खोजें (e.g. SSC, BPSC, 2024, Science)..."
              className="bg-transparent text-white placeholder-slate-500 focus:outline-none w-full text-xs"
            />
            {searchFilter && (
              <button onClick={() => setSearchFilter('')} className="text-slate-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* PYQ Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPYQs.map((pyq) => (
              <div 
                key={pyq.id}
                className="bg-[#0B101D] border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-4 transition-all shadow-md group"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300">
                      {pyq.examCode} • {pyq.year}
                    </span>
                    <span className="text-[11px] text-cyan-300 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {pyq.timeMinutes} Min
                    </span>
                  </div>

                  <h3 className="font-extrabold text-white text-sm sm:text-base group-hover:text-amber-300 transition-colors">
                    {pyq.examName}
                  </h3>

                  <div className="text-xs text-slate-400 space-y-1">
                    <p className="flex items-center gap-2">
                      <span className="text-slate-500">📅 Date:</span>
                      <span className="text-slate-300 font-semibold">{pyq.dateStr}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-slate-500">⏱️ Shift:</span>
                      <span className="text-slate-300">{pyq.shift}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-slate-500">📚 Focus:</span>
                      <span className="text-indigo-300 font-medium">{pyq.subject}</span>
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-850 flex items-center justify-between gap-2">
                  <div className="text-[11px] text-slate-400 font-mono">
                    <span className="text-emerald-400">+{pyq.marksPerQuestion}</span> / <span className="text-rose-400">-{pyq.negativeMarks}</span> Neg
                  </div>

                  <button
                    onClick={() => handleStartPYQTest(pyq)}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-md shadow-amber-500/20 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                  >
                    <span>Start PYQ Test</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: CUSTOM AI PRACTICE SETS GENERATOR */}
      {activeTab === 'custom' && (
        <div className="bg-[#0B101D] border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
          <div>
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>कस्टम AI प्रैक्टिस सेट जनरेटर (Dynamic Mock Tests)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              किसी भी विषय, अध्याय या परीक्षा स्तर के लिए तुरंत नए 5-10 वस्तुनिष्ठ प्रश्न तैयार करें।
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">विषय या अध्याय का नाम (Subject / Topic):</label>
              <input
                type="text"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                placeholder="e.g. Modern Indian History, Trigonometry, General Science, English Grammar..."
                className="w-full bg-[#050814] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  कठिनाई स्तर चुनें (Select Question Difficulty):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { 
                      id: 'Beginner', 
                      label: '🟢 Beginner (शुरुआती)', 
                      tag: 'बेसिक व सीधी परिभाषाएं',
                      desc: 'आधारभूत सूत्र, शब्दावली और प्रत्यक्ष तथ्यात्मक प्रश्न' 
                    },
                    { 
                      id: 'Intermediate', 
                      label: '🟡 Intermediate (मध्यम)', 
                      tag: 'मानक प्रतियोगी परीक्षा',
                      desc: 'SSC CGL / CHSL / रेलवे स्तर के व्यावहारिक अनुप्रयोग' 
                    },
                    { 
                      id: 'Advanced', 
                      label: '🔴 Advanced (कठिन)', 
                      tag: 'Tier-2 व विश्लेषणात्मक',
                      desc: 'कथन-आधारित (Multi-statement) एवं उच्च स्तरीय प्रश्न' 
                    }
                  ].map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setCustomDifficulty(d.id as any)}
                      className={`p-3 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                        customDifficulty === d.id
                          ? 'bg-gradient-to-br from-indigo-950/80 to-purple-950/80 border-indigo-400 text-white ring-2 ring-indigo-500/50 shadow-md shadow-indigo-950/50'
                          : 'bg-[#060A15] hover:bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-white">{d.label}</span>
                        {customDifficulty === d.id && (
                          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">{d.tag}</span>
                      <p className="text-[11px] text-slate-400 leading-snug">{d.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">प्रश्नों की संख्या (Number of Questions):</label>
                <div className="grid grid-cols-3 gap-2">
                  {[5, 10, 15].map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setCustomCount(cnt)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                        customCount === cnt
                          ? 'bg-indigo-600 border-indigo-500 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {cnt} प्रश्न ({cnt} Qs)
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleStartCustomQuiz}
              disabled={isGeneratingCustom || !customSubject.trim()}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isGeneratingCustom ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>AI प्रश्न पत्र तैयार हो रहा है...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>प्रैक्टिस टेस्ट शुरू करें ({customCount} Questions)</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: MISTAKE DIARY RE-TESTING */}
      {activeTab === 'mistakes' && (
        <div className="bg-[#0B101D] border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-rose-400" />
                <span>मिस्टेक नोटबुक (गलती रजिस्टर)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                पिछले टेस्ट्स में गलत हुए प्रश्नों का दोहराव और री-टेस्टिंग।
              </p>
            </div>
            {mistakeNotebook.length > 0 && (
              <button
                onClick={() => {
                  const retryQuestions: QuizQuestion[] = mistakeNotebook.map(m => ({
                    question: m.question,
                    options: m.options,
                    answerIndex: m.correctAnswerIndex,
                    explanation: m.explanation
                  }));
                  setTestQuestions(retryQuestions);
                  setCurrentTestTitle("Mistake Diary Re-Test");
                  setCurrentExamMeta({
                    name: "Mistakes Mastery Re-Test",
                    date: new Date().toLocaleDateString('hi-IN'),
                    shift: "Revision Session",
                    marksPerQ: 2.0,
                    negMark: 0.5
                  });
                  setUserAnswers({});
                  setMarkedForReview({});
                  setCurrentQIndex(0);
                  setTimeRemainingSeconds(retryQuestions.length * 60);
                  setIsTestSubmitted(false);
                  setTestResult(null);
                  setActiveTestMode(true);
                }}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-colors"
              >
                Re-Test All Mistakes ({mistakeNotebook.length})
              </button>
            )}
          </div>

          {mistakeNotebook.length === 0 ? (
            <div className="p-8 text-center text-slate-400 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="text-sm font-bold text-white">कोई गलती लंबित नहीं है!</h4>
              <p className="text-xs text-slate-500">
                जब आप किसी टेस्ट में गलत उत्तर देंगे, तो वे प्रश्न यहाँ अभ्यास के लिए सहेजे जाएंगे।
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {mistakeNotebook.map((item, idx) => (
                <div key={item.id || idx} className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-bold text-slate-300">#{idx + 1} • {item.subject || 'General'}</span>
                    <span className="text-rose-400 font-semibold">{item.timestamp}</span>
                  </div>
                  <p className="font-semibold text-white">{item.question}</p>
                  <div className="p-2.5 bg-[#050814] rounded-lg border border-slate-850 text-slate-300">
                    <span className="text-emerald-400 font-bold block mb-1">
                      ✓ सही उत्तर: {item.options[item.correctAnswerIndex]}
                    </span>
                    <p className="text-[11px] text-slate-400">{item.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
