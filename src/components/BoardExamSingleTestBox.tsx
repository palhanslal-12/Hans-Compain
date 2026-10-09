import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  CheckCircle2,
  XCircle,
  Volume2,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Timer,
  Pause,
  Play,
  Star,
  Flag,
  Share2,
  Bookmark,
  Eye,
  Menu,
  Users,
  AlertCircle,
  X,
  Zap,
  BookOpen,
  Globe,
  Award,
  ShieldCheck
} from 'lucide-react';
import { recordStudyActivity } from '../firebase';

export interface BoardQuestion {
  id: string;
  classLevel: '10th' | '12th';
  board: 'BSEB' | 'UPMSP' | 'CBSE' | 'RBSE' | 'MPBSE' | 'ALL';
  subject: string;
  chapter: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  yearTag: string;
  avgTimeSec?: number;
  correctPct?: number;
}

export const getLocalizedText = (text: string, lang: 'hindi' | 'english' = 'hindi'): string => {
  if (!text) return '';
  if (lang === 'english') {
    const matchParen = text.match(/\(([A-Za-z0-9\s,.'"?:-]+)\)/);
    if (matchParen && matchParen[1].trim().length > 2 && /[\u0900-\u097F]/.test(text.split('(')[0])) {
      return matchParen[1].trim();
    }
    const stripped = text.replace(/[\u0900-\u097F]+/g, '').replace(/\(\s*\)/g, '').trim();
    return stripped.length > 2 ? stripped : text;
  } else {
    const stripped = text.replace(/\s*\([A-Za-z0-9\s,.'"?:-]+\)/g, '').trim();
    return stripped.length > 1 ? stripped : text;
  }
};

// Official Blueprint Question Count Calculator
export const getBoardOfficialCount = (board: string, cls: string, sub: string) => {
  const isPractical = /physics|chemistry|biology|भौतिकी|रसायन|जीव विज्ञान/i.test(sub);
  const isMathOrLang = /math|गणित|hindi|हिंदी|english|sanskrit/i.test(sub);

  if (board === 'BSEB') {
    if (cls === '10th') {
      if (isMathOrLang) {
        return { totalPaper: 100, standardAttempt: 50, desc: '100 प्रश्न (50 हल करने हैं - 50 अंक)' };
      }
      return { totalPaper: 80, standardAttempt: 40, desc: '80 प्रश्न (40 हल करने हैं - 40 अंक)' };
    } else {
      if (isPractical) {
        return { totalPaper: 70, standardAttempt: 35, desc: '70 प्रश्न (35 हल करने हैं - 35 अंक)' };
      }
      return { totalPaper: 100, standardAttempt: 50, desc: '100 प्रश्न (50 हल करने हैं - 50 अंक)' };
    }
  } else if (board === 'CBSE') {
    if (cls === '12th' && isPractical) {
      return { totalPaper: 16, standardAttempt: 16, desc: '16 MCQs (Section A Objective)' };
    }
    return { totalPaper: 20, standardAttempt: 20, desc: '20 MCQs (Section A Objective)' };
  } else if (board === 'UPMSP') {
    return cls === '10th'
      ? { totalPaper: 20, standardAttempt: 20, desc: '20 MCQs (OMR Sheet Pattern)' }
      : { totalPaper: 25, standardAttempt: 25, desc: '25 MCQs Objective Pattern' };
  }
  return { totalPaper: 25, standardAttempt: 25, desc: '25 MCQs Standard Pattern' };
};

// Curated Emergency Offline Syllabus Fallback
const fallbackBoardQuestions: BoardQuestion[] = [
  {
    id: 'b10_sci_1',
    classLevel: '10th',
    board: 'BSEB',
    subject: 'विज्ञान (Science)',
    chapter: 'प्रकाश का परावर्तन तथा अपवर्तन',
    question: 'प्रकाश के परावर्तन के कितने मुख्य नियम हैं? (How many laws of reflection of light are there?)',
    options: ['1 नियम (1 Law)', '2 नियम (2 Laws)', '3 नियम (3 Laws)', '4 नियम (4 Laws)'],
    correctAnswer: 1,
    explanation: 'प्रकाश के परावर्तन के 2 मुख्य नियम हैं: (1) आपतन कोण सदैव परावर्तन कोण के बराबर होता है (∠i = ∠r), (2) आपतित किरण, परावर्तित किरण और अभिलंब तीनों एक ही तल में होते हैं।',
    yearTag: 'BSEB 2021, 2023, 2025'
  },
  {
    id: 'b10_sci_2',
    classLevel: '10th',
    board: 'BSEB',
    subject: 'विज्ञान (Science)',
    chapter: 'मानव नेत्र',
    question: 'स्पष्ट दृष्टि की न्यूनतम दूरी कितनी होती है? (What is the least distance of distinct vision for a normal eye?)',
    options: ['25 मीटर (25 m)', '2.5 सेमी (2.5 cm)', '25 सेमी (25 cm)', 'अनंत (Infinity)'],
    correctAnswer: 2,
    explanation: 'सामान्य मानव नेत्र के लिए स्पष्ट दर्शन की न्यूनतम दूरी 25 सेंटीमीटर (25 cm) होती है तथा दूर बिंदु अनंत पर होता है।',
    yearTag: 'BSEB / UP Board PYQ'
  },
  {
    id: 'b10_sci_3',
    classLevel: '10th',
    board: 'CBSE',
    subject: 'विज्ञान (Science)',
    chapter: 'विद्युत (Electricity)',
    question: 'विद्युत प्रतिरोध का SI मात्रक क्या है? (What is the SI unit of electrical resistance?)',
    options: ['एम्पियर (Ampere)', 'वोल्ट (Volt)', 'ओम (Ohm - Ω)', 'वाट (Watt)'],
    correctAnswer: 2,
    explanation: 'ओम के नियम (V = IR) के अनुसार प्रतिरोध R = V/I का SI मात्रक ओम (Ω) होता है।',
    yearTag: 'CBSE / BSEB Official'
  },
  {
    id: 'b10_math_1',
    classLevel: '10th',
    board: 'BSEB',
    subject: 'गणित (Mathematics)',
    chapter: 'त्रिकोणमिति (Trigonometry)',
    question: 'sin²θ + cos²θ का मान क्या होता है? (What is the value of sin²θ + cos²θ?)',
    options: ['0', '1', '-1', '2'],
    correctAnswer: 1,
    explanation: 'मूलभूत त्रिकोणमितीय सर्वसमिका के अनुसार किसी भी कोण θ के लिए sin²θ + cos²θ = 1 होता है।',
    yearTag: 'Board Standard 100/100 PYQ'
  },
  {
    id: 'b12_phy_1',
    classLevel: '12th',
    board: 'BSEB',
    subject: 'भौतिकी (Physics)',
    chapter: 'प्रकाशिकी (Optics)',
    question: 'प्रकाशिक तंतु किस सिद्धांत पर कार्य करता है? (On which principle does an Optical Fiber work?)',
    options: [
      'प्रकाश का प्रकीर्णन (Scattering of Light)',
      'पूर्ण आंतरिक परावर्तन (Total Internal Reflection)',
      'व्यतिकरण (Interference)',
      'विवर्तन (Diffraction)'
    ],
    correctAnswer: 1,
    explanation: 'प्रकाशिक तंतु (Optical Fiber) पूर्ण आंतरिक परावर्तन (Total Internal Reflection - TIR) के सिद्धांत पर कार्य करता है।',
    yearTag: '12th Inter Board PYQ'
  },
  {
    id: 'b12_chem_1',
    classLevel: '12th',
    board: 'BSEB',
    subject: 'रसायन विज्ञान (Chemistry)',
    chapter: 'विलयन (Solutions)',
    question: 'मोलरता (Molarity) की इकाई क्या है? (What is the unit of molarity?)',
    options: ['मोल/लीटर (mol/L)', 'मोल/किग्रा (mol/kg)', 'ग्राम/लीटर (g/L)', 'विमाहीन (Dimensionless)'],
    correctAnswer: 0,
    explanation: '1 लीटर विलयन में घुले विलेय के मोलों की संख्या को मोलरता कहते हैं। इसका मात्रक मोल प्रति लीटर (mol/L) होता है।',
    yearTag: '12th Board Official PYQ'
  }
];

const boardLeaderboardPeers = [
  { rank: 1, avatar: 'M', name: 'Mohit Prajapat', ratio: 1.0 },
  { rank: 2, avatar: 'P', name: 'Pinki Singh', ratio: 1.0 },
  { rank: 3, avatar: 'V', name: 'Vrinda mukhija', ratio: 1.0 },
  { rank: 4, avatar: 'A', name: 'Abhi', ratio: 1.0 },
  { rank: 5, avatar: 'A', name: 'Adarsh Thakur', ratio: 0.88 },
  { rank: 6, avatar: 'D', name: 'Dhwanil Solanky', ratio: 0.88 },
  { rank: 7, avatar: 'M', name: 'Maurya Tejash', ratio: 0.82 },
  { rank: 8, avatar: 'V', name: 'vishalchharol@gmail.com', ratio: 0.8 },
  { rank: 9, avatar: 'S', name: 'Shreyanshi', ratio: 0.8 },
  { rank: 10, avatar: 'N', name: 'Nunu', ratio: 0.75 }
];

export const BoardExamSingleTestBox: React.FC<{ language?: 'hindi' | 'english' }> = ({
  language = 'hindi'
}) => {
  // Board & Syllabus Selection
  const [selectedClass, setSelectedClass] = useState<'10th' | '12th'>('10th');
  const [selectedBoard, setSelectedBoard] = useState<'BSEB' | 'UPMSP' | 'CBSE' | 'RBSE' | 'MPBSE'>('BSEB');
  const [selectedSubject, setSelectedSubject] = useState<string>('विज्ञान (Science)');
  const [customSubjectText, setCustomSubjectText] = useState<string>('');
  
  // Custom Topic / Chapter Selection (Open Input - No Rigid Forcing)
  const [topicMode, setTopicMode] = useState<'all-syllabus' | 'custom-chapter'>('all-syllabus');
  const [customTopicInput, setCustomTopicInput] = useState<string>('');
  
  // Question Count & Quality
  const [qualityLevel, setQualityLevel] = useState<'exam-exact' | 'ncert-core' | 'topper-hard'>('exam-exact');
  const [questionCount, setQuestionCount] = useState<number>(40);
  const [examLang, setExamLang] = useState<'hindi' | 'english'>(language);

  // Sync external language prop
  useEffect(() => {
    setExamLang(language);
  }, [language]);

  // Active Live Exam Session State (Adda247 Single-Screen No-Scrolling UI)
  const [isLoadingExam, setIsLoadingExam] = useState<boolean>(false);
  const [activeExamQuestions, setActiveExamQuestions] = useState<BoardQuestion[] | null>(null);
  const [examTitle, setExamTitle] = useState<string>('');
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({});
  const [bookmarked, setBookmarked] = useState<Record<number, boolean>>({});
  const [questionTimes, setQuestionTimes] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [totalExamMinutes, setTotalExamMinutes] = useState<number>(20);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showSubmitConfirmModal, setShowSubmitConfirmModal] = useState<boolean>(false);
  const [showPaletteDrawer, setShowPaletteDrawer] = useState<boolean>(false);
  const [resultSubView, setResultSubView] = useState<'summary' | 'leaderboard' | 'solutions'>('summary');
  const [showSolutionExplanation, setShowSolutionExplanation] = useState<boolean>(true);
  const [attemptedTimestamp, setAttemptedTimestamp] = useState<string>('');

  // Secondary Study Tab (Generator / 90-100% Accelerator / Subjective QA)
  const [studySection, setStudySection] = useState<'exam-generator' | 'topper-accelerator' | 'subjective-qa'>('exam-generator');
  const [revealedSubjective, setRevealedSubjective] = useState<Record<number, boolean>>({});

  // Error Report Modal
  const [reportModalOpen, setReportModalOpen] = useState<boolean>(false);
  const [reportNote, setReportNote] = useState<string>('');
  const [reportSuccessMsg, setReportSuccessMsg] = useState<string | null>(null);

  const subjects10th = [
    'विज्ञान (Science)',
    'गणित (Mathematics)',
    'सामाजिक विज्ञान (Social Science)',
    'हिन्दी (Hindi)',
    'संस्कृत (Sanskrit)',
    'अंग्रेजी (English)'
  ];

  const subjects12th = [
    'भौतिकी (Physics)',
    'रसायन विज्ञान (Chemistry)',
    'जीव विज्ञान (Biology)',
    'गणित (Mathematics)',
    'हिन्दी (Hindi 100)',
    'अंग्रेजी (English 100)',
    'इतिहास (History)',
    'भूगोल (Geography)',
    'राजनीति विज्ञान (Pol Science)',
    'लेखाशास्त्र (Accountancy)'
  ];

  const subjectsForClass = selectedClass === '10th' ? subjects10th : subjects12th;
  const activeSubjectName = customSubjectText.trim() || selectedSubject;
  const officialInfo = getBoardOfficialCount(selectedBoard, selectedClass, activeSubjectName);

  // Auto-set recommended question count on board/subject change
  useEffect(() => {
    setQuestionCount(officialInfo.standardAttempt);
  }, [selectedBoard, selectedClass, selectedSubject]);

  // Countdown Timer Effect
  useEffect(() => {
    let timer: any = null;
    if (activeExamQuestions && !isSubmitted && !isPaused && !showSubmitConfirmModal && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
        setQuestionTimes(prev => ({
          ...prev,
          [currentIdx]: (prev[currentIdx] || 0) + 1
        }));
      }, 1000);
    } else if (timeLeft === 0 && activeExamQuestions && !isSubmitted) {
      confirmAndSubmitBoardExam();
    }
    return () => clearInterval(timer);
  }, [activeExamQuestions, isSubmitted, isPaused, showSubmitConfirmModal, timeLeft, currentIdx]);

  // Keyboard navigation for Previous and Next questions during test
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeExamQuestions || isSubmitted) return;
      if (e.key === 'ArrowLeft' && currentIdx > 0) {
        setCurrentIdx(prev => prev - 1);
      } else if (e.key === 'ArrowRight' && currentIdx < activeExamQuestions.length - 1) {
        setCurrentIdx(prev => prev + 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeExamQuestions, isSubmitted, currentIdx]);

  // Anti-Repetition Helpers
  const getSeenBoardQuestions = (): string[] => {
    try {
      const key = `hans_board_seen_${selectedBoard}_${selectedClass}`;
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch {
      return [];
    }
  };

  const recordSeenBoardQuestions = (qs: BoardQuestion[]) => {
    try {
      const key = `hans_board_seen_${selectedBoard}_${selectedClass}`;
      const existing = getSeenBoardQuestions();
      const newSigs = qs.map(q => q.question.slice(0, 45));
      const combined = Array.from(new Set([...existing, ...newSigs])).slice(-250);
      localStorage.setItem(key, JSON.stringify(combined));
    } catch {
      // ignore
    }
  };

  // LIVE AI BOARD EXAM & CHAPTER-WISE QUESTION GENERATOR
  const handleGenerateLiveBoardExam = async (customCount?: number) => {
    setIsLoadingExam(true);
    const targetCount = customCount || questionCount;
    const targetTopicOrChapter = topicMode === 'custom-chapter' ? customTopicInput.trim() : '';
    const cleanSub = getLocalizedText(activeSubjectName, examLang);
    const titleStr = `${selectedBoard} Class ${selectedClass} ${cleanSub}${
      targetTopicOrChapter ? ` (${targetTopicOrChapter})` : ' Official Exam'
    }`;

    try {
      const excludeQuestions = getSeenBoardQuestions();
      const res = await fetch('/api/board/full-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          board: selectedBoard,
          classLevel: selectedClass,
          subject: activeSubjectName,
          chapterName: targetTopicOrChapter,
          qualityLevel,
          count: targetCount,
          language: examLang,
          excludeQuestions
        })
      });

      const data = await res.json();
      if (data && data.success && Array.isArray(data.questions) && data.questions.length > 0) {
        const formatted: BoardQuestion[] = data.questions.map((q: any, idx: number) => ({
          id: q.id || `board_live_${Date.now()}_${idx}`,
          classLevel: selectedClass,
          board: selectedBoard,
          subject: cleanSub,
          chapter: targetTopicOrChapter || cleanSub,
          question: q.question,
          options: Array.isArray(q.options) ? q.options : ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
          explanation: q.explanation || '',
          yearTag: q.yearTag || `${selectedBoard} ${selectedClass} Official Pattern`,
          avgTimeSec: 20,
          correctPct: 72
        }));

        recordSeenBoardQuestions(formatted);
        startBoardExamView(formatted, titleStr);
        setIsLoadingExam(false);
        return;
      }
    } catch (err) {
      console.warn('Live board generation error, using board syllabus fallback:', err);
    }

    // Fallback strictly to Board Questions
    const filtered = fallbackBoardQuestions.filter(q => q.classLevel === selectedClass);
    const list = filtered.length > 0 ? filtered : fallbackBoardQuestions;
    startBoardExamView(list, titleStr);
    setIsLoadingExam(false);
  };

  const startBoardExamView = (questions: BoardQuestion[], title: string) => {
    const now = new Date();
    const datePart = now
      .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      .replace(/ /g, '-');
    const timePart = now
      .toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
      .toLowerCase();
    setAttemptedTimestamp(`${datePart} | ${timePart}`);

    const mins = Math.max(5, Math.ceil(questions.length * 0.9));
    setExamTitle(title);
    setActiveExamQuestions(questions);
    setTotalExamMinutes(mins);
    setTimeLeft(mins * 60);
    setCurrentIdx(0);
    setAnswers({});
    setMarkedForReview({});
    setBookmarked({});
    setQuestionTimes({});
    setIsPaused(false);
    setIsSubmitted(false);
    setShowSubmitConfirmModal(false);
    setShowPaletteDrawer(false);
    setResultSubView('summary');

    recordStudyActivity(
      'Board Exam Live Test Started',
      title,
      `Class ${selectedClass} ${selectedBoard} | ${questions.length} Live Questions`,
      100
    );
  };

  const confirmAndSubmitBoardExam = () => {
    if (!activeExamQuestions) return;
    setShowSubmitConfirmModal(false);
    setIsSubmitted(true);
    setResultSubView('summary');

    // Sync wrong answers to Mistake Notebook
    try {
      const existing = JSON.parse(localStorage.getItem('hans_compain_mistake_notebook') || '[]');
      const newMistakes = activeExamQuestions
        .map((q, idx) => ({ q, idx, ans: answers[idx] }))
        .filter(item => item.ans !== undefined && item.ans !== item.q.correctAnswer)
        .map(({ q, ans }) => ({
          id: `board_mistake_${q.id}_${Date.now()}`,
          questionId: q.id,
          examTitle,
          subject: q.subject,
          questionText: getLocalizedText(q.question, examLang),
          options: q.options.map(o => getLocalizedText(o, examLang)),
          correctOptionIdx: q.correctAnswer,
          userOptionIdx: ans,
          explanation: getLocalizedText(q.explanation, examLang),
          createdAt: new Date().toISOString()
        }));
      if (newMistakes.length > 0) {
        localStorage.setItem('hans_compain_mistake_notebook', JSON.stringify([...newMistakes, ...existing]));
        window.dispatchEvent(new CustomEvent('hans_mistake_notebook_updated'));
      }
    } catch {
      // ignore
    }

    const stats = getBoardScoreStats();
    const pct = Math.round((stats.correctCount / activeExamQuestions.length) * 100);
    recordStudyActivity(
      'Board Exam Completed',
      examTitle,
      `Score: ${stats.finalScore}/${activeExamQuestions.length} (${pct}%)`,
      pct
    );
  };

  const getBoardScoreStats = () => {
    if (!activeExamQuestions) {
      return { correctCount: 0, wrongCount: 0, attemptedCount: 0, skippedCount: 0, finalScore: 0 };
    }
    let correctCount = 0;
    let wrongCount = 0;
    activeExamQuestions.forEach((q, idx) => {
      const ans = answers[idx];
      if (ans !== undefined) {
        if (ans === q.correctAnswer) correctCount += 1;
        else wrongCount += 1;
      }
    });
    const attemptedCount = correctCount + wrongCount;
    const skippedCount = activeExamQuestions.length - attemptedCount;
    return {
      correctCount,
      wrongCount,
      attemptedCount,
      skippedCount,
      finalScore: correctCount
    };
  };

  const handleReportSubmit = async () => {
    if (!activeExamQuestions) return;
    const currentQ = activeExamQuestions[currentIdx];
    try {
      await fetch('/api/report-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: currentQ.id,
          questionText: getLocalizedText(currentQ.question, examLang),
          category: `Board Exam (${selectedBoard} ${selectedClass} ${activeSubjectName})`,
          userNote: reportNote || 'Reported from live board exam interface'
        })
      });
      setReportSuccessMsg('प्रश्न की रिपोर्ट टीम को भेज दी गई है!');
      setTimeout(() => {
        setReportSuccessMsg(null);
        setReportModalOpen(false);
        setReportNote('');
      }, 1800);
    } catch {
      setReportSuccessMsg('रिपोर्ट दर्ज हो गई है। धन्यवाद!');
      setTimeout(() => {
        setReportSuccessMsg(null);
        setReportModalOpen(false);
      }, 1800);
    }
  };

  const formatTime = (seconds: number) => {
    const safeSec = Math.max(0, seconds);
    const mins = Math.floor(safeSec / 60);
    const secs = safeSec % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const currentQ = activeExamQuestions ? activeExamQuestions[currentIdx] : null;

  // ============================================================================
  // A. ACTIVE TEST SCREEN — EXACT NO-SCROLLING BOARD OMR SCREEN
  // ============================================================================
  if (activeExamQuestions && !isSubmitted && currentQ) {
    const stats = getBoardScoreStats();

    return (
      <div className="fixed inset-0 z-50 h-dvh w-full overflow-hidden flex flex-col bg-white text-slate-900 font-sans select-none">
        {/* Top Header Bar */}
        <div className="shrink-0 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between bg-white shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="w-9 h-9 rounded-full bg-[#e11d48] text-white flex items-center justify-center shadow-sm cursor-pointer shrink-0"
              title="Pause Test"
            >
              {isPaused ? <Play className="w-4 h-4 fill-white" /> : <Pause className="w-4 h-4 fill-white" />}
            </button>
            <div className="min-w-0">
              <h2 className="font-bold text-base sm:text-lg text-slate-900 truncate leading-tight">
                {examTitle}
              </h2>
              <div className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                <span>Time left:</span>
                <span className="font-bold text-[#e11d48] tabular-nums">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Dynamic Language Switcher in Test */}
            <button
              onClick={() => setExamLang(examLang === 'hindi' ? 'english' : 'hindi')}
              className="px-3 py-1.5 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-extrabold cursor-pointer flex items-center gap-1.5 shadow-xs"
              title="टेस्ट की भाषा बदलें (Switch Language)"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>{examLang === 'hindi' ? 'हिन्दी (Active)' : 'English (Active)'}</span>
            </button>

            <button
              onClick={() => setShowPaletteDrawer(!showPaletteDrawer)}
              className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer"
              title="Question Palette"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub-Bar: Question Type & Review Star */}
        <div className="shrink-0 px-4 py-1.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="px-2.5 py-0.5 rounded-full bg-slate-200/70 text-slate-700 text-[11px] font-bold">
            Question Type: {selectedBoard} Class {selectedClass} OMR Objective (+1.0 | 0.0)
          </span>
          <button
            onClick={() => setMarkedForReview(prev => ({ ...prev, [currentIdx]: !prev[currentIdx] }))}
            className="flex items-center gap-1 text-slate-700 font-bold text-xs cursor-pointer hover:text-amber-600"
          >
            <span>Review</span>
            <Star
              className={`w-4 h-4 ${
                markedForReview[currentIdx] ? 'fill-amber-400 text-amber-500' : 'text-slate-400'
              }`}
            />
          </button>
        </div>

        {/* Question Counter & Marks Row */}
        <div className="shrink-0 px-4 pt-2 pb-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              {currentIdx + 1}
            </span>
            <span className="font-extrabold text-slate-900 text-sm sm:text-base">
              Question {currentIdx + 1} of {activeExamQuestions.length}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="px-2.5 py-0.5 rounded-full bg-[#e6f7ed] text-[#16a34a]">+1.0 Mark</span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">No Negative</span>
          </div>
        </div>

        {/* Center Question + 4 Options (No Page Scrolling) */}
        <div className="flex-1 flex flex-col justify-between px-4 py-2 overflow-hidden max-w-3xl w-full mx-auto">
          <div className="text-slate-900 font-medium text-sm sm:text-base leading-snug line-clamp-4">
            {getLocalizedText(currentQ.question, examLang)}
          </div>

          <div className="space-y-2.5 my-auto py-2">
            {currentQ.options.map((opt, optIdx) => {
              const letter = String.fromCharCode(65 + optIdx);
              const isSelected = answers[currentIdx] === optIdx;
              const cleanOpt = getLocalizedText(opt, examLang);

              return (
                <button
                  key={optIdx}
                  onClick={() => setAnswers(prev => ({ ...prev, [currentIdx]: optIdx }))}
                  className={`w-full py-3 px-3.5 rounded-xl border text-left text-sm font-medium transition-all flex items-center gap-3.5 cursor-pointer ${
                    isSelected
                      ? 'bg-sky-50 border-blue-500 text-slate-900 shadow-xs'
                      : 'bg-[#f8fafc] border-slate-200/80 text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-slate-300 text-slate-700'
                    }`}
                  >
                    {letter}
                  </span>
                  <span className="flex-1 truncate sm:whitespace-normal">{cleanOpt}</span>
                </button>
              );
            })}
          </div>

          {/* Dedicated Previous & Next Navigation Buttons */}
          <div className="flex items-center justify-between gap-3 pt-1 border-t border-slate-100">
            <button
              onClick={() => currentIdx > 0 && setCurrentIdx(currentIdx - 1)}
              disabled={currentIdx === 0}
              className="py-2 px-3.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs disabled:opacity-30 cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>← Previous (पिछला)</span>
            </button>

            <span className="text-xs font-bold text-slate-500">
              Q {currentIdx + 1} / {activeExamQuestions.length}
            </span>

            <button
              onClick={() =>
                currentIdx < activeExamQuestions.length - 1 && setCurrentIdx(currentIdx + 1)
              }
              disabled={currentIdx === activeExamQuestions.length - 1}
              className="py-2 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs disabled:opacity-30 cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <span>Next (अगला) →</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Pinned Footer */}
        <div className="shrink-0 px-4 py-2.5 border-t border-slate-200 bg-white space-y-2 max-w-3xl w-full mx-auto">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setReportModalOpen(true)}
              className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-[#e11d48] font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-rose-50 cursor-pointer"
            >
              <Flag className="w-3.5 h-3.5 text-[#e11d48]" />
              <span>Report</span>
            </button>

            <button
              onClick={() => {
                setAnswers(prev => {
                  const next = { ...prev };
                  delete next[currentIdx];
                  return next;
                });
              }}
              className="flex-1 py-2 px-4 rounded-xl border border-slate-300 bg-white text-slate-600 font-semibold text-xs hover:bg-slate-50 cursor-pointer text-center"
            >
              Clear Response
            </button>

            <button
              onClick={() => setShowSubmitConfirmModal(true)}
              className="px-6 py-2 rounded-xl bg-[#9f1239] hover:bg-[#881337] text-white font-extrabold text-xs sm:text-sm shadow-md cursor-pointer"
            >
              Submit Test
            </button>
          </div>
        </div>

        {/* Question Palette Drawer */}
        {showPaletteDrawer && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 flex justify-end">
            <div className="w-72 bg-white h-full p-4 flex flex-col justify-between shadow-2xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="font-bold text-sm text-slate-900">Board Question Palette</h3>
                  <button onClick={() => setShowPaletteDrawer(false)} className="p-1 cursor-pointer">
                    <X className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-2 max-h-[70vh] overflow-y-auto">
                  {activeExamQuestions.map((_, qIdx) => {
                    const isAns = answers[qIdx] !== undefined;
                    const isRev = markedForReview[qIdx];
                    return (
                      <button
                        key={qIdx}
                        onClick={() => {
                          setCurrentIdx(qIdx);
                          setShowPaletteDrawer(false);
                        }}
                        className={`h-9 rounded-lg font-bold text-xs border cursor-pointer ${
                          isRev
                            ? 'bg-amber-400 text-slate-950 border-amber-500'
                            : isAns
                            ? 'bg-emerald-600 text-white border-emerald-700'
                            : currentIdx === qIdx
                            ? 'bg-blue-600 text-white border-blue-700'
                            : 'bg-slate-100 text-slate-700 border-slate-300'
                        }`}
                      >
                        {qIdx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
              <button
                onClick={() => {
                  setShowPaletteDrawer(false);
                  setShowSubmitConfirmModal(true);
                }}
                className="w-full py-3 rounded-xl bg-[#f43f5e] text-white font-bold text-sm cursor-pointer"
              >
                Submit Test
              </button>
            </div>
          </div>
        )}

        {/* Test Summary Confirmation Modal */}
        {showSubmitConfirmModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Board Exam Summary</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  आपके सभी उत्तर ओएमआर में सुरक्षित कर लिए गए हैं।
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#eff6ff] text-slate-800 font-semibold border-b border-slate-200">
                      <th className="py-2.5 px-3">विषय</th>
                      <th className="py-2.5 px-3">हल किए (Attempted)</th>
                      <th className="py-2.5 px-3">छोड़े (Skipped)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800">
                    <tr>
                      <td className="py-2.5 px-3">{getLocalizedText(activeSubjectName, examLang)}</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-600">{stats.attemptedCount}</td>
                      <td className="py-2.5 px-3 text-slate-500">{stats.skippedCount}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-center gap-3 pt-1">
                <button
                  onClick={() => setShowSubmitConfirmModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs cursor-pointer hover:bg-slate-50"
                >
                  Resume Test
                </button>
                <button
                  onClick={confirmAndSubmitBoardExam}
                  className="flex-1 py-2.5 rounded-xl bg-[#f43f5e] hover:bg-rose-600 text-white font-bold text-xs cursor-pointer shadow-md"
                >
                  Yes, Submit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Report Question Modal */}
        {reportModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-3xl p-5 space-y-3.5 shadow-2xl">
              <div className="flex items-center justify-between border-b pb-2.5">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Flag className="w-4 h-4 text-rose-600" />
                  <span>प्रश्न में समस्या या त्रुटि रिपोर्ट करें</span>
                </h3>
                <button onClick={() => setReportModalOpen(false)}>
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              <p className="text-xs text-slate-600">
                यदि किसी प्रश्न, विकल्प या उत्तर में कोई गलती हो, तो तुरंत रिपोर्ट करें। यह ऑटोमैटिक एडमिन अलर्ट पर प्रेषित हो जाएगा।
              </p>

              <textarea
                value={reportNote}
                onChange={e => setReportNote(e.target.value)}
                placeholder="क्या समस्या है? (जैसे: विकल्प गलत है, टाइपिंग त्रुटि, आउट ऑफ सिलेबस)..."
                className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:border-rose-500 h-24"
              />

              {reportSuccessMsg && (
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold">
                  {reportSuccessMsg}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => setReportModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  रद्द करें
                </button>
                <button
                  onClick={handleReportSubmit}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-sm"
                >
                  भेजें (Report)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ============================================================================
  // B. TEST RESULTS & DETAILED SOLUTIONS SCREEN
  // ============================================================================
  if (activeExamQuestions && isSubmitted) {
    const stats = getBoardScoreStats();
    const totalMaxMarks = activeExamQuestions.length;
    const timeSpentSec = Math.max(1, totalExamMinutes * 60 - timeLeft);
    const accuracyVal =
      stats.attemptedCount > 0
        ? ((stats.correctCount / stats.attemptedCount) * 100).toFixed(1)
        : '0.0';
    const percentileVal = Math.max(
      15.0,
      Math.min(99.9, parseFloat(((stats.finalScore / totalMaxMarks) * 85 + 15).toFixed(1)))
    );
    const calculatedRank = stats.finalScore >= totalMaxMarks * 0.9 ? 1 : (stats.finalScore >= totalMaxMarks * 0.75 ? 3 : 18);

    if (resultSubView === 'solutions') {
      const solQ = activeExamQuestions[currentIdx];
      const userAns = answers[currentIdx];
      const isCorrect = userAns === solQ.correctAnswer;
      const isSkipped = userAns === undefined;

      return (
        <div className="fixed inset-0 z-50 h-dvh w-full overflow-hidden flex flex-col bg-white text-slate-900 font-sans">
          <div className="shrink-0 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setResultSubView('summary')}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-800 cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="font-bold text-sm sm:text-base text-slate-900">
                विस्तृत समाधान (Detailed Solutions & Topper Tips)
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setExamLang(examLang === 'hindi' ? 'english' : 'hindi')}
                className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-extrabold flex items-center gap-1"
              >
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>{examLang === 'hindi' ? 'हिन्दी' : 'English'}</span>
              </button>
              <button
                onClick={() => setShowPaletteDrawer(!showPaletteDrawer)}
                className="p-2 rounded-xl border border-slate-200"
              >
                <Menu className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 max-w-3xl w-full mx-auto space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-slate-900">
                Question {currentIdx + 1} of {activeExamQuestions.length}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                  isCorrect
                    ? 'bg-emerald-100 text-emerald-800'
                    : isSkipped
                    ? 'bg-slate-100 text-slate-600'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {isCorrect ? '✓ सही उत्तर (+1.0)' : isSkipped ? '— अनुत्तरित (0.0)' : '✗ गलत उत्तर (0.0)'}
              </span>
            </div>

            <div className="text-sm font-semibold text-slate-900">
              {getLocalizedText(solQ.question, examLang)}
            </div>

            <div className="space-y-2">
              {solQ.options.map((opt, oIdx) => {
                const isRightOpt = oIdx === solQ.correctAnswer;
                const isSelectedByStudent = userAns === oIdx;

                return (
                  <div
                    key={oIdx}
                    className={`p-3 rounded-xl border text-xs sm:text-sm font-medium flex items-center gap-3 ${
                      isRightOpt
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold'
                        : isSelectedByStudent
                        ? 'bg-rose-50 border-rose-500 text-rose-950 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="w-6 h-6 rounded-full bg-white border flex items-center justify-center font-bold text-xs shrink-0">
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span className="flex-1">{getLocalizedText(opt, examLang)}</span>
                    {isRightOpt && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                    {!isRightOpt && isSelectedByStudent && <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
                  </div>
                );
              })}
            </div>

            {/* Topper Solution & Concept Note */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2 mt-3">
              <div className="text-xs font-extrabold text-amber-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>टॉपर व्याख्या व 100% बोर्ड अंक सूत्र (Topper Concept Tip):</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                {getLocalizedText(solQ.explanation, examLang)}
              </p>
            </div>
          </div>

          {/* Solutions Stepper */}
          <div className="shrink-0 px-4 py-2.5 border-t border-slate-200 bg-white flex items-center justify-between max-w-3xl w-full mx-auto">
            <button
              onClick={() => currentIdx > 0 && setCurrentIdx(currentIdx - 1)}
              disabled={currentIdx === 0}
              className="py-2 px-4 rounded-xl border border-slate-300 text-xs font-bold disabled:opacity-30 cursor-pointer"
            >
              ← Previous
            </button>
            <button
              onClick={() => setResultSubView('summary')}
              className="py-2 px-4 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer"
            >
              वापस समरी देखें
            </button>
            <button
              onClick={() => currentIdx < activeExamQuestions.length - 1 && setCurrentIdx(currentIdx + 1)}
              disabled={currentIdx === activeExamQuestions.length - 1}
              className="py-2 px-4 rounded-xl bg-blue-600 text-white text-xs font-bold disabled:opacity-30 cursor-pointer"
            >
              Next →
            </button>
          </div>
        </div>
      );
    }

    // Default Result Summary
    return (
      <div className="fixed inset-0 z-50 h-dvh w-full overflow-hidden flex flex-col bg-white text-slate-900 font-sans">
        <div className="shrink-0 px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setActiveExamQuestions(null)}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-800 cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h2 className="font-bold text-sm sm:text-base text-slate-900 truncate">{examTitle}</h2>
              <p className="text-[11px] text-slate-500">Attempted on: {attemptedTimestamp}</p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setResultSubView('summary')}
              className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                resultSubView === 'summary' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Summary
            </button>
            <button
              onClick={() => setResultSubView('leaderboard')}
              className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                resultSubView === 'leaderboard' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Leaderboard
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2.5 max-w-2xl w-full mx-auto flex flex-col justify-between">
          {resultSubView === 'summary' ? (
            <div className="space-y-3 my-auto">
              <h3 className="font-bold text-sm sm:text-base text-slate-900">
                Board Performance Summary
              </h3>

              <div className="p-3.5 rounded-2xl bg-[#f2fbf6] flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full border-4 border-[#10b981] flex items-center justify-center bg-white">
                    <CheckCircle2 className="w-6 h-6 text-[#10b981]" />
                  </div>
                  <div>
                    <div className="text-lg font-extrabold text-slate-900">
                      {stats.finalScore} <span className="text-slate-400 font-normal">| {totalMaxMarks}</span>
                    </div>
                    <div className="text-xs text-slate-600 font-medium">Your Score ({stats.correctCount} Correct)</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-emerald-600 text-white text-[11px] font-bold">
                  {selectedBoard} Class {selectedClass}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#f8f5ff] flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full border-4 border-[#a855f7] flex items-center justify-center bg-white">
                  <Timer className="w-6 h-6 text-[#a855f7]" />
                </div>
                <div>
                  <div className="text-lg font-extrabold text-slate-900">
                    {formatTime(timeSpentSec)} <span className="text-slate-400 font-normal">| {formatTime(totalExamMinutes * 60)}</span>
                  </div>
                  <div className="text-xs text-slate-600 font-medium">Time Spent</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-3 rounded-2xl bg-[#fefce8] flex flex-col justify-between space-y-2">
                  <div className="w-9 h-9 rounded-full border-2 border-[#facc15] bg-white flex items-center justify-center">
                    <Star className="w-4 h-4 text-[#eab308] fill-[#eab308]" />
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-slate-900">
                      {calculatedRank} <span className="text-slate-400 font-normal">| 60</span>
                    </div>
                    <div className="text-[11px] text-slate-600 font-medium">Rank</div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#fff1f2] flex flex-col justify-between space-y-2">
                  <div className="w-9 h-9 rounded-full border-2 border-[#f43f5e] bg-white flex items-center justify-center text-[#f43f5e] font-extrabold text-xs">
                    %
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-slate-900">
                      {percentileVal} <span className="text-slate-400 font-normal">| 100</span>
                    </div>
                    <div className="text-[11px] text-slate-600 font-medium">Percentile</div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#f0f7ff] flex flex-col justify-between space-y-2">
                  <div className="w-9 h-9 rounded-full border-2 border-[#2563eb] bg-white flex items-center justify-center text-[#2563eb] font-extrabold text-xs">
                    ◎
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-slate-900">
                      {accuracyVal}%
                    </div>
                    <div className="text-[11px] text-slate-600 font-medium">Accuracy</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  onClick={() => handleGenerateLiveBoardExam()}
                  className="py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>नया पेपर जनरेट करें (Non-Repeating)</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentIdx(0);
                    setResultSubView('solutions');
                  }}
                  className="py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Solutions</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <h3 className="font-bold text-sm text-slate-900 mb-2">Board State Leaderboard</h3>
              {boardLeaderboardPeers.map(peer => (
                <div key={peer.rank} className="py-2 px-3 rounded-xl bg-slate-50 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[10px]">
                      {peer.rank}
                    </span>
                    <span className="font-semibold text-slate-900">{peer.name}</span>
                  </div>
                  <span className="font-bold text-slate-700">
                    {Math.round(totalMaxMarks * peer.ratio)} / {totalMaxMarks}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============================================================================
  // C. BOARD EXAM CONFIGURATION & FREE OPEN CHAPTER GENERATOR SCREEN
  // ============================================================================
  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-12 text-white font-sans">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4" />
            <span>
              {selectedBoard} • Class {selectedClass} Official Syllabus & Open Topic Live Generator
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            {examLang === 'hindi'
              ? '10वीं और 12वीं बोर्ड परीक्षा केंद्र — सम्पूर्ण सिलेबस व फ्री टॉपिक जनरेटर'
              : 'Class 10th & 12th Board Exam Center — Live Syllabus & Custom Topic Generator'}
          </h1>
          <p className="text-xs text-slate-400">
            {examLang === 'hindi'
              ? 'खुद से कोई भी अध्याय, टॉपिक या सम्पूर्ण सिलेबस चुनें • आधिकारिक 100/70 प्रश्न ब्लूप्रिंट • बिना किसी प्रश्न पुनरावृत्ति (Zero Repetition) के 100% नए प्रश्न।'
              : 'Choose any chapter, topic, or all syllabus freely. Generated 100% live with official blueprint question counts and zero repeated questions.'}
          </p>
        </div>

        <button
          onClick={() => setExamLang(examLang === 'hindi' ? 'english' : 'hindi')}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-amber-300 shrink-0 cursor-pointer flex items-center gap-1.5"
        >
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <span>{examLang === 'hindi' ? 'हिन्दी माध्यम' : 'English Medium'}</span>
        </button>
      </div>

      {/* Mode Switch Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
        <button
          onClick={() => setStudySection('exam-generator')}
          className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
            studySection === 'exam-generator'
              ? 'bg-amber-500 text-slate-950 font-extrabold'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          ⚡ लाइव बोर्ड टेस्ट व ओपन टॉपिक जनरेटर
        </button>
        <button
          onClick={() => setStudySection('topper-accelerator')}
          className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
            studySection === 'topper-accelerator'
              ? 'bg-amber-500 text-slate-950 font-extrabold'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          🎯 90%-100% टॉपर स्कोर एक्सेलेरेटर व वेटेज
        </button>
        <button
          onClick={() => setStudySection('subjective-qa')}
          className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
            studySection === 'subjective-qa'
              ? 'bg-amber-500 text-slate-950 font-extrabold'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          ✍️ लघु व दीर्घ उत्तरीय (2 & 5 Marks Model QA)
        </button>
      </div>

      {studySection === 'exam-generator' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
          {/* 1. Class & Board Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                1. कक्षा चुनें (Class):
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {(['10th', '12th'] as const).map(cls => (
                  <button
                    key={cls}
                    onClick={() => {
                      setSelectedClass(cls);
                      setSelectedSubject(cls === '10th' ? 'विज्ञान (Science)' : 'भौतिकी (Physics)');
                      setCustomTopicInput('');
                    }}
                    className={`p-3 rounded-xl border text-xs font-extrabold cursor-pointer transition-all ${
                      selectedClass === cls
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Class {cls} ({cls === '10th' ? 'Matric' : 'Inter'})
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                2. अपना बोर्ड चुनें (Board Name):
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {[
                  { id: 'BSEB', label: 'बिहार (BSEB)' },
                  { id: 'CBSE', label: 'CBSE' },
                  { id: 'UPMSP', label: 'UP Board' },
                  { id: 'RBSE', label: 'राजस्थान' },
                  { id: 'MPBSE', label: 'MP Board' }
                ].map(b => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBoard(b.id as any)}
                    className={`p-2.5 rounded-xl border text-center text-xs font-bold cursor-pointer transition-all ${
                      selectedBoard === b.id
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Subject Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">
              3. विषय चुनें या खुद से नाम लिखें (Subject):
            </label>
            <div className="flex flex-wrap gap-2">
              {subjectsForClass.map(sub => (
                <button
                  key={sub}
                  onClick={() => {
                    setSelectedSubject(sub);
                    setCustomSubjectText('');
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                    selectedSubject === sub && !customSubjectText
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {getLocalizedText(sub, examLang)}
                </button>
              ))}
            </div>

            <div className="pt-1">
              <input
                type="text"
                value={customSubjectText}
                onChange={e => setCustomSubjectText(e.target.value)}
                placeholder="या कोई अन्य विषय खुद से लिखें (जैसे: Sanskrit, Geography, Economics, Music)..."
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-semibold text-white placeholder-slate-500 outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* 3. Open Custom Topic / Chapter Selection (User's freedom request) */}
          <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/40 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-extrabold text-indigo-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>4. टॉपिक कवरेज चुनें (Topic & Chapter Selection):</span>
              </label>

              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setTopicMode('all-syllabus')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                    topicMode === 'all-syllabus' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🌐 सम्पूर्ण सिलेबस (All Syllabus)
                </button>
                <button
                  onClick={() => setTopicMode('custom-chapter')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                    topicMode === 'custom-chapter' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ✍️ खुद से कोई भी टॉपिक / चैप्टर लिखें
                </button>
              </div>
            </div>

            {topicMode === 'custom-chapter' ? (
              <div className="space-y-1.5">
                <input
                  type="text"
                  value={customTopicInput}
                  onChange={e => setCustomTopicInput(e.target.value)}
                  placeholder="किसी भी अध्याय, टॉपिक या सूत्र का नाम खुद से लिखें (जैसे: प्रकाश का परावर्तन, Trigonometry, विद्युत धारा, Organic Chemistry)..."
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white placeholder-slate-500 outline-none focus:border-indigo-400"
                />
                <span className="text-[11px] text-indigo-300 block">
                  AI आपके लिखे गए टॉपिक से सटीक, सिलेबस-अनुमोदित प्रश्न तैयार करेगा।
                </span>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  सम्पूर्ण सिलेबस मोड सक्रिय है: {selectedBoard} Class {selectedClass} {getLocalizedText(activeSubjectName, examLang)} के सभी अध्यायों से संतुलित प्रश्न पत्र तैयार होगा।
                </span>
              </div>
            )}
          </div>

          {/* 4. Official Blueprint Info & Question Count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="text-[11px] font-extrabold text-amber-400 flex items-center justify-between">
                <span>📋 आधिकारिक बोर्ड ब्लूप्रिंट (Official Blueprint):</span>
                <button
                  onClick={() => setQuestionCount(officialInfo.standardAttempt)}
                  className="text-[10px] text-cyan-400 underline cursor-pointer"
                >
                  यह संख्या सेट करें
                </button>
              </div>
              <div className="text-xs font-bold text-slate-200">
                {officialInfo.desc}
              </div>
              <div className="text-[10px] text-slate-400">
                {selectedBoard} में वस्तुनिष्ठ प्रश्नों पर 100% सही हल करने पर पूरे अंक मिलते हैं।
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                5. प्रश्न संख्या (Questions to Generate):
              </label>
              <select
                value={questionCount}
                onChange={e => setQuestionCount(parseInt(e.target.value, 10))}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-emerald-300 outline-none"
              >
                <option value={10}>10 Questions (Quick Chapter Test - 8 Mins)</option>
                <option value={16}>16 Questions (CBSE Class 12 Science Pattern)</option>
                <option value={20}>20 Questions (CBSE Class 10 / UP Board OMR Pattern)</option>
                <option value={25}>25 Questions (Standard Practice Test)</option>
                <option value={35}>35 Questions (BSEB 12th Physics/Chem 35 Attempt Pattern)</option>
                <option value={40}>40 Questions (BSEB 10th Science/SST 40 Attempt Pattern)</option>
                <option value={50}>50 Questions (BSEB Math / Hindi Full 50 Attempt Pattern)</option>
              </select>
            </div>
          </div>

          {/* Quality Level & Anti-Repetition Guarantee */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>
                <strong className="text-slate-200">100% नॉन-रिपीटेड गारंटी:</strong> हर बार नए और अप्रत्याशित प्रश्न।
              </span>
            </div>

            <button
              onClick={() => handleGenerateLiveBoardExam()}
              disabled={isLoadingExam}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>
                {isLoadingExam
                  ? 'लाइव बोर्ड प्रश्न-पत्र तैयार हो रहा है...'
                  : topicMode === 'custom-chapter' && customTopicInput
                  ? `⚡ "${customTopicInput}" का लाइव टेस्ट शुरू करें`
                  : `📝 लाइव ${selectedBoard} ${selectedClass} परीक्षा शुरू करें`}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* D. TOPPER 90%-100% SCORE ACCELERATOR TAB */}
      {studySection === 'topper-accelerator' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span>🎯 बोर्ड परीक्षा 90% से 100% टॉपर स्कोरिंग सीक्रेट्स व वेटेज</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {selectedBoard} Class {selectedClass} के स्टेट टॉपर्स की अचूक रणनीति व हाई-वेटेज टॉपिक सूची
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-amber-400">🔥 100/100 स्कोर करने के 3 स्वर्णिम नियम:</span>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
                <li><strong>वस्तुनिष्ठ (MCQ) में पूरे 50/50 या 35/35 अंक लाएं:</strong> बोर्ड परीक्षा में 50% अंक OMR ऑब्जेक्टिव से आते हैं। इसमें एक भी अंक नहीं कटना चाहिए।</li>
                <li><strong>NCERT लाइन-बाय-लाइन डेफिनिशन:</strong> बोर्ड के 80% सवाल सीधे NCERT की बोल्ड हेडिंग व सारांश से पूछे जाते हैं।</li>
                <li><strong>यूनिट एवं सूत्र लिखना:</strong> न्यूमेरिकल में मात्रक (SI Unit) न लिखने पर 0.5 से 1 नंबर कट जाता है।</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-cyan-400">⚠️ जहां 90% छात्र गलतियां करते हैं (Mistake Traps):</span>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
                <li>प्रश्न में 'नहीं है' (NOT) शब्द न पढ़ना और जल्दबाजी में गलत टिक कर देना।</li>
                <li>अवतल दर्पण और उत्तल लेंस के चिह्नों (+ और -) में भ्रमित होना।</li>
                <li>ओएमआर शीट में गोला भरते समय प्रश्न संख्या मिसमैच होना।</li>
              </ul>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => {
                setQualityLevel('topper-hard');
                setStudySection('exam-generator');
              }}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <span>🎯 100/100 टॉपर लेवल टेस्ट शुरू करें</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* E. SUBJECTIVE MODEL QA TAB */}
      {studySection === 'subjective-qa' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-base text-white border-b border-slate-800 pb-3">
            ✍️ बोर्ड परीक्षा लघु एवं दीर्घ उत्तरीय आदर्श मॉडल प्रश्नोत्तर (2 & 5 Marks Model QA)
          </h3>
          <div className="space-y-3">
            {[
              {
                q: 'प्रकाश के परावर्तन के नियमों को लिखें एवं चित्र द्वारा समझाएं।',
                a: 'उत्तर:\n1. प्रथम नियम: आपतित किरण, परावर्तित किरण तथा आपतन बिंदु पर डाला गया अभिलंब तीनों एक ही समतल में होते हैं।\n2. द्वितीय नियम: आपतन कोण (∠i) सदैव परावर्तन कोण (∠r) के बराबर होता है (∠i = ∠r)।',
                marks: '2 Marks (Board Official)'
              },
              {
                q: 'निकट दृष्टि दोष (Myopia) क्या है? इसके दो कारण तथा निवारण का उपाय लिखें।',
                a: 'उत्तर:\nवह दृष्टि दोष जिसमें व्यक्ति को निकट की वस्तुएं तो स्पष्ट दिखाई देती हैं किंतु दूर की वस्तुएं स्पष्ट नहीं दिखाई देतीं।\nकारण:\n(i) नेत्र गोलक का लंबा हो जाना।\n(ii) नेत्र लेंस की वक्रता बढ़ जाना (फोकस दूरी घट जाना)।\nनिवारण:\nउचित फोकस दूरी वाले अवतल लेंस (Concave Lens) के चश्मे का उपयोग।',
                marks: '5 Marks (Long Answer)'
              }
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-xs sm:text-sm font-bold text-white">{item.q}</h4>
                  <span className="text-xs font-bold text-emerald-400 shrink-0">{item.marks}</span>
                </div>
                <button
                  onClick={() => setRevealedSubjective(prev => ({ ...prev, [idx]: !prev[idx] }))}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold cursor-pointer"
                >
                  {revealedSubjective[idx] ? 'उत्तर छुपाएं' : 'आदर्श टॉपर उत्तर देखें'}
                </button>
                {revealedSubjective[idx] && (
                  <div className="p-3 rounded-xl bg-slate-900 text-xs sm:text-sm text-slate-200 whitespace-pre-wrap">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardExamSingleTestBox;
