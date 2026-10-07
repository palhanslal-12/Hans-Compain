import React, { useState, useEffect, useRef } from 'react';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  XCircle,
  Volume2,
  RotateCcw,
  Sparkles,
  Award,
  ChevronRight,
  Clock,
  Layers,
  ArrowLeft,
  FileText,
  HelpCircle,
  Check,
  Timer,
  AlertCircle
} from 'lucide-react';
import { recordStudyActivity } from '../firebase';

export interface BoardQuestion {
  id: string;
  board: 'BSEB' | 'UPMSP' | 'CBSE' | 'JAC' | 'ALL';
  classLevel: '10th' | '12th';
  subject: string;
  chapter: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  yearTag: string;
}

interface ChapterNotesData {
  summaryPoints: string[];
  formulas: { title: string; exp: string }[];
  subjectiveQA: { q: string; a: string; marks: string }[];
}

export const getLocalizedText = (text: string, lang: 'hindi' | 'english'): string => {
  if (!text) return '';
  const parenIndex = text.indexOf('(');
  if (parenIndex !== -1) {
    const lastParen = text.lastIndexOf(')');
    const firstPart = text.slice(0, parenIndex).trim();
    const secondPart = lastParen !== -1 ? text.slice(parenIndex + 1, lastParen).trim() : text.slice(parenIndex + 1).trim();

    if (lang === 'english') {
      return secondPart || text;
    } else {
      return firstPart || text;
    }
  }
  return text;
};

const boardExamQuestions: BoardQuestion[] = [
  // Class 10th Science
  {
    id: 'b10-sci-1',
    board: 'BSEB',
    classLevel: '10th',
    subject: 'विज्ञान (Science)',
    chapter: 'प्रकाश का परावर्तन तथा अपवर्तन',
    question: 'प्रकाश के परावर्तन के कितने नियम हैं? (How many laws of reflection of light are there?)',
    options: ['1 नियम (1 Law)', '2 नियम (2 Laws)', '3 नियम (3 Laws)', '4 नियम (4 Laws)'],
    correctAnswer: 1,
    explanation: 'प्रकाश के परावर्तन के 2 मुख्य नियम हैं: (1) आपतन कोण सदैव परावर्तन कोण के बराबर होता है (∠i = ∠r), और (2) आपतित किरण, परावर्तित किरण तथा आपतन बिंदु पर अभिलंब तीनों एक ही तल में होते हैं। (There are 2 laws of reflection of light.)',
    yearTag: 'BSEB 2021, 2023, 2025'
  },
  {
    id: 'b10-sci-2',
    board: 'BSEB',
    classLevel: '10th',
    subject: 'विज्ञान (Science)',
    chapter: 'प्रकाश का परावर्तन तथा अपवर्तन',
    question: 'समतल दर्पण द्वारा बना प्रतिबिंब सदा कैसा होता है? (What is the nature of image formed by plane mirror?)',
    options: ['वास्तविक और उल्टा (Real and Inverted)', 'काल्पनिक और सीधा (Virtual and Erect)', 'वास्तविक और सीधा (Real and Erect)', 'काल्पनिक और उल्टा (Virtual and Inverted)'],
    correctAnswer: 1,
    explanation: 'समतल दर्पण द्वारा बना प्रतिबिंब सदैव काल्पनिक (आभासी), सीधा और वस्तु के समान आकार का होता है। (Image formed by plane mirror is always virtual and erect.)',
    yearTag: 'BSEB 2022, UP Board 2024'
  },
  {
    id: 'b10-sci-3',
    board: 'UPMSP',
    classLevel: '10th',
    subject: 'विज्ञान (Science)',
    chapter: 'विद्युत धारा (Electricity)',
    question: 'प्रतिरोध का SI मात्रक क्या है? (What is the SI unit of resistance?)',
    options: ['एम्पियर (Ampere)', 'ओम (Ohm - Ω)', 'वोल्ट (Volt)', 'वाट (Watt)'],
    correctAnswer: 1,
    explanation: 'प्रतिरोध का SI मात्रक ओम (Ω) है। ओम के नियम के अनुसार R = V / I होता है। (SI unit of resistance is Ohm (Ω). According to Ohm\'s Law, R = V / I.)',
    yearTag: 'UPMSP 2023, BSEB 2024'
  },
  {
    id: 'b10-sci-4',
    board: 'BSEB',
    classLevel: '10th',
    subject: 'विज्ञान (Science)',
    chapter: 'रासायनिक अभिक्रियाएं एवं समीकरण',
    question: 'लोहे को जिंक से लेपित करने की क्रिया को क्या कहते हैं? (What is the process of coating iron with zinc?)',
    options: ['संक्षारण (Corrosion)', 'गैल्वनीकरण (Galvanization)', 'पानी चढ़ाना (Electroplating)', 'विद्युत अपघटन (Electrolysis)'],
    correctAnswer: 1,
    explanation: 'लोहे को जंग से बचाने के लिए उस पर जिंक (जस्ता) की परत चढ़ाने की प्रक्रिया को गैल्वनीकरण (यशदलेपन) कहते हैं। (Process of coating iron with zinc is called Galvanization.)',
    yearTag: 'BSEB 2020, 2024'
  },
  // Class 10th Mathematics
  {
    id: 'b10-math-1',
    board: 'BSEB',
    classLevel: '10th',
    subject: 'गणित (Mathematics)',
    chapter: 'त्रिकोणमिति का परिचय (Trigonometry)',
    question: 'यदि sin θ = 3/5 हो, तो cos θ का मान क्या होगा? (If sin θ = 3/5, what is the value of cos θ?)',
    options: ['4/5', '3/4', '5/4', '5/3'],
    correctAnswer: 0,
    explanation: 'चूँकि sin²θ + cos²θ = 1, अतः cos θ = √(1 - (3/5)²) = √(1 - 9/25) = √(16/25) = 4/5। (cos θ = 4/5.)',
    yearTag: 'BSEB 2023, CBSE 2024'
  },
  {
    id: 'b10-math-2',
    board: 'BSEB',
    classLevel: '10th',
    subject: 'गणित (Mathematics)',
    chapter: 'समांतर श्रेणी (Arithmetic Progression)',
    question: 'समांतर श्रेणी 2, 7, 12, ... का 10वाँ पद क्या होगा? (What is the 10th term of Arithmetic Progression 2, 7, 12, ...?)',
    options: ['45', '47', '50', '52'],
    correctAnswer: 1,
    explanation: 'यहाँ प्रथम पद a = 2, सार्व अंतर d = 7 - 2 = 5, और n = 10। Tn = a + (n - 1)d = 2 + (10 - 1)×5 = 47। (The 10th term of AP is 47.)',
    yearTag: 'NCERT Exemplar, BSEB 2024'
  },
  // Class 10th Social Science
  {
    id: 'b10-sst-1',
    board: 'BSEB',
    classLevel: '10th',
    subject: 'सामाजिक विज्ञान (Social Science)',
    chapter: 'भारत में राष्ट्रवाद (History)',
    question: 'जालियाँवाला बाग हत्याकांड किस तिथि को हुआ था? (On which date did the Jallianwala Bagh massacre happen?)',
    options: ['13 अप्रैल 1919 ई. (13 April 1919)', '14 अप्रैल 1919 ई. (14 April 1919)', '15 अप्रैल 1919 ई. (15 April 1919)', '16 अप्रैल 1919 ई. (16 April 1919)'],
    correctAnswer: 0,
    explanation: '13 अप्रैल 1919 को अमृतसर के जालियाँवाला बाग में जनरल डायर ने निहत्थी भीड़ पर गोलियाँ चलवाई थीं। (Jallianwala Bagh massacre occurred on 13 April 1919.)',
    yearTag: 'BSEB 2019, 2022, 2025'
  },
  // Class 12th Physics
  {
    id: 'b12-phy-1',
    board: 'BSEB',
    classLevel: '12th',
    subject: 'भौतिकी (Physics)',
    chapter: 'स्थिर वैद्युतिकी (Electrostatics)',
    question: 'निर्वात की विद्युतशीलता का मात्रक क्या है? (What is the unit of permittivity of free space ε₀?)',
    options: ['N·m²/C²', 'C²/(N·m²)', 'C/V', 'N/C'],
    correctAnswer: 1,
    explanation: 'कूलॉम के नियम F = (1/4πε₀)·(q₁q₂/r²) से ε₀ का मात्रक C²/(N·m²) होता है। (The unit is C²/N·m².)',
    yearTag: 'BSEB Inter 2023, UPMSP 2024'
  },
  {
    id: 'b12-phy-2',
    board: 'UPMSP',
    classLevel: '12th',
    subject: 'भौतिकी (Physics)',
    chapter: 'अर्धचालक इलेक्ट्रॉनिकी (Semiconductors)',
    question: 'NAND गेट के लिए बूलियन व्यंजक क्या है? (What is the boolean expression for NAND gate?)',
    options: ['Y = A + B', 'Y = A · B', 'Y = overline(A · B)', 'Y = overline(A + B)'],
    correctAnswer: 2,
    explanation: 'AND गेट के साथ NOT गेट जोड़ने पर NAND गेट प्राप्त होता है, जिसका बूलियन व्यंजक Y = overline(A · B) होता है। (NAND Gate expression is Y = overline(A · B).)',
    yearTag: 'BSEB 2022, 2024'
  },
  // Class 12th Chemistry & Biology
  {
    id: 'b12-chem-1',
    board: 'BSEB',
    classLevel: '12th',
    subject: 'रसायन शास्त्र (Chemistry)',
    chapter: 'ठोस अवस्था एवं विलयन (Solutions)',
    question: 'शुद्ध जल की मोलरता कितनी होती है? (What is the molarity of pure water?)',
    options: ['18 M', '50 M', '55.55 M', '100 M'],
    correctAnswer: 2,
    explanation: '1 लीटर (1000 g) शुद्ध जल में मोलों की संख्या = 1000 / 18 = 55.55 मोल/लीटर (M) होती है। (Molarity of pure water is 55.55 M.)',
    yearTag: 'BSEB 2021, CBSE 2023'
  },
  {
    id: 'b12-bio-1',
    board: 'BSEB',
    classLevel: '12th',
    subject: 'जीव विज्ञान (Biology)',
    chapter: 'आनुवंशिकी एवं डीएनए (Genetics)',
    question: 'DNA में कौन-सा नाइट्रोजनी क्षार अनुपस्थित होता है? (Which nitrogenous base is absent in DNA?)',
    options: ['एडेनिन (Adenine)', 'थाइमिन (Thymine)', 'यूरेसिल (Uracil)', 'ग्वानिन (Guanine)'],
    correctAnswer: 2,
    explanation: 'यूरेसिल (Uracil) केवल RNA में पाया जाता है, जबकि DNA में इसके स्थान पर थाइमिन होता है। (Uracil is absent in DNA.)',
    yearTag: 'BSEB 2023, UP Board 2024'
  }
];

const chapterNotesMap: Record<string, ChapterNotesData> = {
  'विज्ञान (Science)': {
    summaryPoints: [
      'दर्पण सूत्र (Mirror Formula): 1/v + 1/u = 1/f (जहाँ u = वस्तु की दूरी, v = प्रतिबिंब की दूरी, f = फोकस दूरी)।',
      'लेंस की क्षमता (Power of Lens): P = 1 / f (मीटर में), इसका SI मात्रक डाइऑप्टर (Dioptre - D) होता है।',
      'ओम का नियम (Ohm\'s Law): नियत ताप पर चालक के सिरों के बीच विभवांतर प्रवाहित धारा के समानुपाती होता है (V = I × R)।',
      'उदासीनीकरण अभिक्रिया: अम्ल + क्षार → लवण + जल (जैसे: HCl + NaOH → NaCl + H₂O)।'
    ],
    formulas: [
      { title: 'दर्पण सूत्र (Mirror Formula)', exp: '1/v + 1/u = 1/f' },
      { title: 'लेंस सूत्र (Lens Formula)', exp: '1/v - 1/u = 1/f' },
      { title: 'विद्युत शक्ति (Electric Power)', exp: 'P = V × I = I²R = V²/R' },
      { title: 'जूल का तापन नियम (Joule\'s Law)', exp: 'H = I²Rt' }
    ],
    subjectiveQA: [
      {
        q: 'प्रश्न 1: प्रकाश के अपवर्तन के नियमों को लिखें तथा स्नेल के नियम की व्याख्या करें। (State laws of refraction and explain Snell\'s Law.)',
        a: 'उत्तर: जब प्रकाश की किरण एक पारदर्शी माध्यम से दूसरे पारदर्शी माध्यम में प्रवेश करती है, तो वह अपने पथ से विचलित हो जाती है। नियम: (1) आपतित किरण, अपवर्तित किरण और आपतन बिंदु पर अभिलंब तीनों एक ही तल में होते हैं। (2) स्नेल का नियम: किन्हीं दो माध्यमों और एकवर्णी प्रकाश के लिए आपतन कोण की ज्या (sin i) और अपवर्तन कोण की ज्या (sin r) का अनुपात एक नियतांक होता है: sin i / sin r = μ (अपवर्तनांक)।',
        marks: '2 अंक / 5 अंक (दीर्घ उत्तरीय)'
      },
      {
        q: 'प्रश्न 2: ओम का नियम क्या है? इसका प्रायोगिक सत्यापन कैसे किया जाता है? (What is Ohm\'s law and how to verify it?)',
        a: 'उत्तर: जॉर्ज साइमन ओम के अनुसार, यदि किसी चालक की भौतिक अवस्थाएं (जैसे ताप) अपरिवर्तित रहें, तो उसके सिरों पर लगाया गया विभवांतर (V) उसमें प्रवाहित विद्युत धारा (I) के समानुपाती होता है। अर्थात् V = IR, जहाँ R चालक का प्रतिरोध है।',
        marks: '5 अंक (दीर्घ उत्तरीय)'
      }
    ]
  },
  'गणित (Mathematics)': {
    summaryPoints: [
      'यूक्लिड विभाजन प्रमेयिका: a = bq + r, जहाँ 0 ≤ r < b।',
      'द्विघात समीकरण ax² + bx + c = 0 का विविक्तकर (Discriminant) D = b² - 4ac होता है।',
      'समांतर श्रेणी (AP) के प्रथम n पदों का योग: Sn = (n/2) [2a + (n - 1)d]।',
      'पाइथागोरस प्रमेय: समकोण त्रिभुज में कर्ण का वर्ग अन्य दो भुजाओं के वर्गों के योग के बराबर होता है (H² = P² + B²)।'
    ],
    formulas: [
      { title: 'द्विघात सूत्र (Quadratic Formula)', exp: 'x = [-b ± √(b² - 4ac)] / 2a' },
      { title: 'त्रिकोणमितीय सर्वसमिका', exp: 'sin²θ + cos²θ = 1, sec²θ - tan²θ = 1' },
      { title: 'दूरी सूत्र (Distance Formula)', exp: 'd = √[(x₂ - x₁)² + (y₂ - y₁)²]' },
      { title: 'शंकु का आयतन (Volume of Cone)', exp: 'V = (1/3) πr²h' }
    ],
    subjectiveQA: [
      {
        q: 'प्रश्न 1: सिद्ध करें कि √2 एक अपरिमेय संख्या है। (Prove that √2 is irrational.)',
        a: 'उत्तर: इसके विपरीत मान लें कि √2 एक परिमेय संख्या है। तब √2 = p/q (जहाँ p, q सह-अभाज्य पूर्णांक हैं और q ≠ 0)। दोनों तरफ वर्ग करने पर 2 = p²/q² ⇒ p² = 2q², अतः 2, p को विभाजित करता है। इसी प्रकार 2, q को भी विभाजित करेगा जो हमारी मान्यता का विरोधाभास है। अतः √2 एक अपरिमेय संख्या है।',
        marks: '3 अंक (अनिवार्य बोर्ड प्रश्न)'
      }
    ]
  }
};

export const BoardExamSingleTestBox: React.FC<{ language?: 'hindi' | 'english' }> = ({ language = 'hindi' }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedBoard, setSelectedBoard] = useState<'ALL' | 'BSEB' | 'UPMSP' | 'CBSE'>('BSEB');
  const [selectedClass, setSelectedClass] = useState<'10th' | '12th'>('10th');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [activeToolMode, setActiveToolMode] = useState<'mcq-test' | 'topper-notes' | 'subjective-qa' | 'full-exam'>('mcq-test');

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [attempted, setAttempted] = useState<number>(0);
  const [revealedSubjective, setRevealedSubjective] = useState<Record<number, boolean>>({});

  // Full Exam Mode Specific States
  const [fullExamQuestions, setFullExamQuestions] = useState<BoardQuestion[]>([]);
  const [isLoadingExam, setIsLoadingExam] = useState<boolean>(false);
  const [examError, setExamError] = useState<string | null>(null);
  const [examAnswers, setExamAnswers] = useState<Record<number, number>>({});
  const [examTimer, setExamTimer] = useState<number>(0); // remaining seconds
  const [isExamFinished, setIsExamFinished] = useState<boolean>(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Filter static questions
  const filteredQuestions = boardExamQuestions.filter(q => {
    const classMatch = q.classLevel === selectedClass;
    const boardMatch = selectedBoard === 'ALL' || q.board === selectedBoard || q.board === 'BSEB';
    const subMatch = selectedSubject === 'ALL' || q.subject === selectedSubject;
    return classMatch && boardMatch && subMatch;
  });

  const activeList = activeToolMode === 'full-exam' ? fullExamQuestions : (filteredQuestions.length > 0 ? filteredQuestions : boardExamQuestions);
  const currentQ = activeList[currentIndex % activeList.length];

  const subjectsForClass = Array.from(
    new Set(boardExamQuestions.filter(q => q.classLevel === selectedClass).map(q => q.subject))
  );

  // Load and start full exam with dynamic, syllabus-appropriate board questions
  const handleStartFullExam = async () => {
    setIsLoadingExam(true);
    setExamError(null);
    setIsExamFinished(false);
    setExamAnswers({});
    setCurrentIndex(0);
    setScore(0);
    setAttempted(0);

    try {
      const res = await fetch('/api/board/full-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          board: selectedBoard,
          classLevel: selectedClass,
          subject: selectedSubject === 'ALL' ? 'Science' : selectedSubject,
          language: language
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.questions) && data.questions.length > 0) {
          setFullExamQuestions(data.questions);
          // Set a realistic Board Exam timer: 20 minutes (for practice) or 180 minutes (real board)
          const duration = selectedBoard === 'BSEB' ? 40 * 60 : 20 * 60; // 1 minute per MCQ
          setExamTimer(duration);
          setActiveToolMode('full-exam');
          setStep(3);
          startTimer(duration);
          setIsLoadingExam(false);
          return;
        }
      }
    } catch (err) {
      console.warn('API board generation failed. Falling back to dynamic randomized shuffle of local questions...', err);
    }

    // Fallback: randomized, unique, non-repeating shuffle of local questions according to selected board/subject
    const shuffled = [...filteredQuestions].sort(() => 0.5 - Math.random());
    const finalSelection = shuffled.slice(0, selectedBoard === 'BSEB' ? 40 : 20);

    if (finalSelection.length > 0) {
      setFullExamQuestions(finalSelection);
      const duration = finalSelection.length * 60;
      setExamTimer(duration);
      setActiveToolMode('full-exam');
      setStep(3);
      startTimer(duration);
    } else {
      setExamError(language === 'hindi' ? '⚠️ इस विषय/बोर्ड के लिए प्रश्न-पत्र लोड नहीं हो सका।' : '⚠️ Failed to prepare exam paper.');
    }
    setIsLoadingExam(false);
  };

  const startTimer = (seconds: number) => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = setInterval(() => {
      setExamTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current!);
          handleFinishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleFinishExam = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setIsExamFinished(true);

    // Calculate final scores
    let finalScore = 0;
    fullExamQuestions.forEach((q, idx) => {
      if (examAnswers[idx] === q.correctAnswer) {
        finalScore++;
      }
    });
    setScore(finalScore);
    setAttempted(Object.keys(examAnswers).length);

    recordStudyActivity(
      'board-exam-full',
      `${selectedBoard} ${selectedClass} - Full Exam Simulation`,
      `Completed Full Exam with score: ${finalScore}/${fullExamQuestions.length} (${Math.round((finalScore/fullExamQuestions.length)*100)}% accuracy)`,
      Math.round((finalScore / fullExamQuestions.length) * 100)
    );
  };

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  const handleSelectOption = (idx: number) => {
    if (activeToolMode === 'full-exam') {
      if (isExamFinished) return;
      setExamAnswers(prev => ({ ...prev, [currentIndex]: idx }));
      return;
    }

    if (selectedOption !== null) return;
    setSelectedOption(idx);
    setAttempted(prev => prev + 1);
    const isCorrect = idx === currentQ.correctAnswer;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    recordStudyActivity(
      'board-exam',
      `${currentQ.classLevel} ${currentQ.subject} - ${currentQ.chapter}`,
      `${currentQ.question} — ${currentQ.options[currentQ.correctAnswer]}`,
      isCorrect ? 100 : 0
    );
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setCurrentIndex(prev => (prev + 1) % activeList.length);
  };

  const handleReset = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setSelectedOption(null);
    setCurrentIndex(0);
    setScore(0);
    setAttempted(0);
    setIsExamFinished(false);
    setExamAnswers({});
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = getLocalizedText(text, language);
    const utter = new SpeechSynthesisUtterance(cleanText);
    utter.lang = language === 'hindi' ? 'hi-IN' : 'en-US';
    utter.rate = 0.95;
    window.speechSynthesis.speak(utter);
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPerformanceBadge = () => {
    const percent = (score / activeList.length) * 100;
    if (percent >= 80) return { title: language === 'hindi' ? '🌟 बोर्ड टॉपर रैंक 1' : '🌟 BOARD TOPPER RANK 1', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    if (percent >= 60) return { title: language === 'hindi' ? '📚 प्रथम श्रेणी (First Division Scholar)' : '📚 FIRST DIVISION SCHOLAR', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    if (percent >= 45) return { title: language === 'hindi' ? '🔥 द्वितीय श्रेणी' : '🔥 SECOND DIVISION ACHIEVER', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' };
    return { title: language === 'hindi' ? '📖 उत्तीर्ण (Passed with revision target)' : '📖 PASS & STUDY FOCUS ACTIVE', color: 'text-slate-300 bg-slate-800/40 border-slate-700/50' };
  };

  const activeNotes =
    chapterNotesMap[selectedSubject] ||
    chapterNotesMap['विज्ञान (Science)'];

  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-fade-in pb-12">
      {/* Top Banner + Progress Stepper */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-indigo-950/50 border border-amber-500/30 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black uppercase tracking-wider">
              <GraduationCap className="w-4 h-4" />
              <span>
                {language === 'hindi' 
                  ? `बोर्ड परीक्षा हब • ${selectedBoard} (${selectedClass})`
                  : `Board Exam Hub • ${selectedBoard} (${selectedClass})`}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {language === 'hindi'
                ? 'बोर्ड परीक्षा: वास्तविक 2026 सिलेबस आधारित टेस्ट व एक्जाम'
                : 'Board Exam: Real 2026 Syllabus Test & Exam Box'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              {language === 'hindi'
                ? 'नवीनतम 50% OMR बोर्ड पैटर्न। कोई भी प्रश्न दोबारा नहीं आएगा (No Question Repeat)।'
                : 'Latest 50% OMR Board pattern. Instant dynamic automatic non-repeating exams.'}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-950/90 border border-slate-800 px-4 py-2.5 rounded-2xl shrink-0">
            <div className="text-center pr-3 border-r border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">
                {language === 'hindi' ? 'स्कोर' : 'SCORE'}
              </span>
              <span className="text-lg font-black text-emerald-400 font-mono">
                {score} / {activeToolMode === 'full-exam' ? activeList.length : attempted}
              </span>
            </div>
            <button
              onClick={handleReset}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title={language === 'hindi' ? 'टेस्ट रीसेट करें' : 'Reset Test'}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stepper Steps */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80">
          {[
            { num: 1 as const, title: language === 'hindi' ? 'Step 1: बोर्ड व कक्षा' : 'Step 1: Board & Class', sub: `${selectedBoard} • Class ${selectedClass}` },
            { num: 2 as const, title: language === 'hindi' ? 'Step 2: विषय व टूल्स' : 'Step 2: Subject & Resources', sub: selectedSubject === 'ALL' ? (language === 'hindi' ? 'सभी विषय' : 'All Subjects') : selectedSubject },
            { num: 3 as const, title: language === 'hindi' ? 'Step 3: लाइव अभ्यास' : 'Step 3: Interactive Practice', sub: activeToolMode === 'full-exam' ? (language === 'hindi' ? 'पूर्ण परीक्षा सिमुलेशन' : 'Full Exam Mode') : activeToolMode === 'mcq-test' ? (language === 'hindi' ? 'OMR सिंगल टेस्ट' : 'OMR Single Test') : activeToolMode === 'topper-notes' ? (language === 'hindi' ? 'टॉपर नोट्स' : 'Topper Notes') : (language === 'hindi' ? 'सब्जेक्टिव Q&A' : 'Subjective Q&A') }
          ].map(s => (
            <button
              key={s.num}
              onClick={() => {
                if (activeToolMode === 'full-exam' && !isExamFinished) {
                  if (!confirm(language === 'hindi' ? '⚠️ क्या आप अपनी लाइव परीक्षा बीच में छोड़ना चाहते हैं?' : '⚠️ Do you want to quit the exam in between?')) return;
                }
                setStep(s.num);
              }}
              className={`p-2.5 sm:p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                step === s.num
                  ? 'bg-amber-500/20 border-amber-400 text-white shadow-md'
                  : step > s.num
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="min-w-0">
                <div className="text-[10px] sm:text-xs font-black truncate">{s.title}</div>
                <div className="text-[9px] sm:text-[10px] opacity-80 truncate">{s.sub}</div>
              </div>
              <span className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center shrink-0 ${
                step === s.num ? 'bg-amber-400 text-slate-950' : step > s.num ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}>
                {step > s.num ? <Check className="w-3 h-3" /> : s.num}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* STEP 1: BOARD & CLASS SELECTION */}
      {step === 1 && (
        <div className="bg-[#091122] border-2 border-amber-500/30 rounded-3xl p-5 sm:p-7 space-y-6 shadow-2xl animate-fade-in">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
              {language === 'hindi' ? 'चरण 1 / 3' : 'STEP 1 / 3'}
            </span>
            <h2 className="text-lg sm:text-xl font-black text-white">
              {language === 'hindi' ? 'अपना परीक्षा बोर्ड और कक्षा चुनें' : 'Select your Exam Board & Class'}
            </h2>
            <p className="text-xs text-slate-400">
              {language === 'hindi' 
                ? 'आपके बोर्ड के नवीनतम ब्लूप्रिंट के अनुसार 2026 की परीक्षा जैसी सटीक अनुभव प्रदान की जाएगी।'
                : 'Syllabus and blueprint load instantly matching your official board requirements.'}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-cyan-300 uppercase tracking-wider block">
              1. {language === 'hindi' ? 'कक्षा का चयन करें (Class Level):' : 'Select Class Level:'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: '10th' as const, title: language === 'hindi' ? 'कक्षा 10वीं (Class 10th Matric)' : 'Class 10th (Matric/Secondary)', desc: language === 'hindi' ? 'विज्ञान, गणित, इतिहास व सामाजिक विज्ञान (50% OMR पैटर्न)' : 'Science, Maths, History & Social Science (OMR based)', badge: 'MATRIC 2026' },
                { id: '12th' as const, title: language === 'hindi' ? 'कक्षा 12वीं (Class 12th Inter)' : 'Class 12th (Intermediate Science)', desc: language === 'hindi' ? 'भौतिकी (Physics), रसायन (Chemistry), जीव विज्ञान (Biology)' : 'Physics, Chemistry, Biology & Advanced Topics', badge: 'INTERMEDIATE 2026' }
              ].map(cls => (
                <div
                  key={cls.id}
                  onClick={() => {
                    setSelectedClass(cls.id);
                    setSelectedSubject('ALL');
                    setCurrentIndex(0);
                    setSelectedOption(null);
                  }}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-2 ${
                    selectedClass === cls.id
                      ? 'bg-amber-500/15 border-amber-400 shadow-lg'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base font-black text-white">{cls.title}</span>
                    <span className="text-[9px] font-black px-2 py-0.5 rounded bg-amber-500 text-slate-950">
                      {cls.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{cls.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-cyan-300 uppercase tracking-wider block">
              2. {language === 'hindi' ? 'अपना राज्य / केंद्रीय बोर्ड चुनें:' : 'Select Board:'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'BSEB' as const, name: language === 'hindi' ? 'बिहार बोर्ड (BSEB Patna)' : 'Bihar Board (BSEB)', pattern: language === 'hindi' ? '50% वस्तुनिष्ठ OMR टेस्ट + दीर्घ उत्तरीय' : '50% OMR Objective + Short/Long Syllabus' },
                { id: 'UPMSP' as const, name: language === 'hindi' ? 'यूपी बोर्ड (UPMSP Prayagraj)' : 'UP Board (UPMSP)', pattern: language === 'hindi' ? '20 MCQ OMR + विस्तृत वर्णनात्मक प्रश्न' : '20 OMR MCQs + Broad descriptive sheets' },
                { id: 'CBSE' as const, name: language === 'hindi' ? 'सीबीएसई बोर्ड (CBSE Delhi)' : 'CBSE Board (New Delhi)', pattern: language === 'hindi' ? 'Competency-Based MCQs + केस स्टडीज' : 'Competency-based MCQs + Case Studies' },
                { id: 'ALL' as const, name: language === 'hindi' ? 'सभी बोर्ड संयुक्त (All State Boards)' : 'All State Boards (Mix)', pattern: language === 'hindi' ? 'झारखंड, मध्य प्रदेश व अन्य राज्य बोर्ड' : 'JAC, MPBSE and other state board combined' }
              ].map(b => (
                <div
                  key={b.id}
                  onClick={() => {
                    setSelectedBoard(b.id);
                    setCurrentIndex(0);
                    setSelectedOption(null);
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedBoard === b.id
                      ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-black text-white">{b.name}</span>
                    {selectedBoard === b.id && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{b.pattern}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl cursor-pointer transition-all"
            >
              <span>{language === 'hindi' ? 'अगला चरण: विषय व अध्ययन टूल्स (Step 2)' : 'Next Step: Subject & Resources'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SUBJECT & STUDY TOOLS */}
      {step === 2 && (
        <div className="bg-[#091122] border-2 border-cyan-500/30 rounded-3xl p-5 sm:p-7 space-y-6 shadow-2xl animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">
                {language === 'hindi' ? 'चरण 2 / 3' : 'STEP 2 / 3'}
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white">
                {language === 'hindi' ? `विषय और अध्ययन टूल चुनें` : `Choose Subject & Study Resource`}
              </h2>
            </div>
            <button
              onClick={() => setStep(1)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === 'hindi' ? 'बोर्ड बदलें' : 'Change Board'}</span>
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-amber-300 uppercase tracking-wider block">
              1. {language === 'hindi' ? 'अध्ययन का विषय चुनें:' : 'Select Subject:'}
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setSelectedSubject('ALL');
                  setCurrentIndex(0);
                  setSelectedOption(null);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  selectedSubject === 'ALL'
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black shadow'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                📚 {language === 'hindi' ? 'सभी विषय (Mixed Subjects)' : 'All Subjects (Mix)'}
              </button>
              {subjectsForClass.map(sub => {
                // Remove Hindi characters if english language selected for buttons if needed
                const cleanSub = language === 'english' ? sub.replace(/[\u0900-\u097F]/g, '').replace(/[()]/g, '').trim() || sub : sub;
                return (
                  <button
                    key={sub}
                    onClick={() => {
                      setSelectedSubject(sub);
                      setCurrentIndex(0);
                      setSelectedOption(null);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      selectedSubject === sub
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black shadow'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    {cleanSub}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Resource Cards - Grid of 4 Cards */}
          <div className="space-y-2">
            <label className="text-xs font-black text-amber-300 uppercase tracking-wider block">
              2. {language === 'hindi' ? 'अध्ययन एवं टेस्ट मोड चुनें:' : 'Select Interactive Mode:'}
            </label>
            
            {isLoadingExam ? (
              <div className="p-12 border border-slate-800 bg-slate-950/80 rounded-2xl text-center space-y-3">
                <Sparkles className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
                <h3 className="text-sm font-black text-white">
                  {language === 'hindi' ? 'एआई बोर्ड परीक्षा का नया प्रश्न-पत्र तैयार कर रहा है...' : 'AI is generating a brand new board exam paper...'}
                </h3>
                <p className="text-xs text-slate-400">
                  {language === 'hindi' ? 'सिलेबस और ब्लूप्रिंट का विश्लेषण चल रहा है। कृपया प्रतीक्षा करें।' : 'Analyzing official 2026 blueprints. Please hold on.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Mode A: Real Full Exam Mode */}
                <div
                  onClick={handleStartFullExam}
                  className="p-5 rounded-2xl bg-slate-950 border-2 border-amber-500/50 hover:border-amber-400 cursor-pointer transition-all flex flex-col justify-between gap-4 group shadow-xl bg-gradient-to-br from-slate-950 via-slate-950 to-amber-950/20"
                >
                  <div className="space-y-2">
                    <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl">
                      📝
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-white group-hover:text-amber-300 flex items-center gap-1.5">
                      <span>{language === 'hindi' ? '📝 पूर्ण बोर्ड परीक्षा मोड' : '📝 Full Board Exam Mode'}</span>
                      <span className="bg-rose-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded uppercase">NEW</span>
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {language === 'hindi'
                        ? 'बिना रिपीट होने वाले OMR बोर्ड प्रश्न-पत्र। एआई टाइमर, वास्तविक प्रश्नों की संख्या और रिजल्ट कार्ड के साथ।'
                        : 'Simulate a real board exam session. Uniquely generated, timed test with full question palette.'}
                    </p>
                  </div>
                  <div className="text-xs font-black text-amber-400 flex items-center justify-between pt-2 border-t border-slate-900">
                    <span>{language === 'hindi' ? 'एआई एक्जाम शुरू करें' : 'Launch AI Exam Session'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Mode B: OMR Single Practice */}
                <div
                  onClick={() => {
                    setActiveToolMode('mcq-test');
                    setStep(3);
                  }}
                  className="p-5 rounded-2xl bg-slate-950 border-2 border-cyan-500/30 hover:border-cyan-400 cursor-pointer transition-all flex flex-col justify-between gap-4 group shadow-lg"
                >
                  <div className="space-y-2">
                    <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-2xl">
                      🎯
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-white group-hover:text-cyan-300">
                      {language === 'hindi' ? 'चैप्टर-वाइज OMR सिंगल टेस्ट बॉक्स' : 'Chapter-wise OMR Single Test'}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {language === 'hindi'
                        ? 'एक-एक प्रश्न का त्वरित OMR टेस्ट। तुरंत सही उत्तर, टॉपर व्याख्या और बोलकर सुनने की सुविधा।'
                        : 'Practice questions individually with instant correctness checks, voice support, and expert answers.'}
                    </p>
                  </div>
                  <div className="text-xs font-black text-cyan-400 flex items-center justify-between pt-2 border-t border-slate-900">
                    <span>{language === 'hindi' ? 'OMR टेस्ट शुरू करें' : 'Start OMR Practice'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Mode C: Topper revision notes */}
                <div
                  onClick={() => {
                    setActiveToolMode('topper-notes');
                    setStep(3);
                  }}
                  className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500 cursor-pointer transition-all flex flex-col justify-between gap-4 group shadow-lg"
                >
                  <div className="space-y-2">
                    <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-2xl">
                      📖
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-white group-hover:text-indigo-300">
                      {language === 'hindi' ? 'टॉपर शॉर्ट नोट्स व फॉर्मूला शीट' : 'Topper Short Notes & Formulas'}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {language === 'hindi'
                        ? 'अंतिम मिनटों के रिवीजन के लिए अत्यंत महत्वपूर्ण सूत्र, रासायनिक नियम, जीव विज्ञान चित्र सारांश।'
                        : 'High-yield points, critical formulas, and chemical balance summaries for fast board revision.'}
                    </p>
                  </div>
                  <div className="text-xs font-black text-indigo-400 flex items-center justify-between pt-2 border-t border-slate-900">
                    <span>{language === 'hindi' ? 'रिवीजन नोट्स खोलें' : 'Read Topper Notes'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Mode D: Subjective model QA */}
                <div
                  onClick={() => {
                    setActiveToolMode('subjective-qa');
                    setStep(3);
                  }}
                  className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500 cursor-pointer transition-all flex flex-col justify-between gap-4 group shadow-lg"
                >
                  <div className="space-y-2">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-2xl">
                      ✍️
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-white group-hover:text-emerald-300">
                      {language === 'hindi' ? 'लघु व दीर्घ उत्तरीय प्रश्नोत्तर (Subjective)' : 'Subjective Model Q&A'}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {language === 'hindi'
                        ? '2 अंक और 5 अंक के बार-बार आने वाले बोर्ड परीक्षा के प्रश्न। टॉपर उत्तर लेखन शैली।'
                        : 'Expected 2-marks and 5-marks question sheets complete with official blueprint answer keys.'}
                    </p>
                  </div>
                  <div className="text-xs font-black text-emerald-400 flex items-center justify-between pt-2 border-t border-slate-900">
                    <span>{language === 'hindi' ? 'आदर्श उत्तर देखें' : 'View Subjective Answers'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STEP 3: INTERACTIVE TOOLS */}
      {step === 3 && (
        <div className="space-y-4 animate-fade-in">
          
          {/* Mode Navigation Inside Step 3 */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-[#091122] p-3 rounded-2xl border border-slate-800">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  if (activeToolMode === 'full-exam' && !isExamFinished) {
                    if (!confirm(language === 'hindi' ? 'क्या आप एक्जाम रोकना चाहते हैं?' : 'Exit exam?')) return;
                  }
                  setActiveToolMode('mcq-test');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  activeToolMode === 'mcq-test'
                    ? 'bg-cyan-500 text-slate-950 font-black shadow'
                    : 'bg-slate-950 text-slate-300 border border-slate-800'
                }`}
              >
                🎯 {language === 'hindi' ? 'सिंगल टेस्ट (MCQ)' : 'Single MCQ Test'}
              </button>
              
              <button
                onClick={() => {
                  if (activeToolMode === 'full-exam' && !isExamFinished) {
                    if (!confirm(language === 'hindi' ? 'क्या आप एक्जाम रोकना चाहते हैं?' : 'Exit exam?')) return;
                  }
                  handleStartFullExam();
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  activeToolMode === 'full-exam'
                    ? 'bg-amber-500 text-slate-950 font-black shadow'
                    : 'bg-slate-950 text-slate-300 border border-slate-800'
                }`}
              >
                📝 {language === 'hindi' ? 'पूर्ण परीक्षा सिमुलेटर' : 'Full Exam Simulator'}
              </button>

              <button
                onClick={() => {
                  if (activeToolMode === 'full-exam' && !isExamFinished) {
                    if (!confirm(language === 'hindi' ? 'क्या आप एक्जाम रोकना चाहते हैं?' : 'Exit exam?')) return;
                  }
                  setActiveToolMode('topper-notes');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  activeToolMode === 'topper-notes'
                    ? 'bg-indigo-500 text-slate-950 font-black shadow'
                    : 'bg-slate-950 text-slate-300 border border-slate-800'
                }`}
              >
                📖 {language === 'hindi' ? 'टॉपर नोट्स' : 'Topper Notes'}
              </button>

              <button
                onClick={() => {
                  if (activeToolMode === 'full-exam' && !isExamFinished) {
                    if (!confirm(language === 'hindi' ? 'क्या आप एक्जाम रोकना चाहते हैं?' : 'Exit exam?')) return;
                  }
                  setActiveToolMode('subjective-qa');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  activeToolMode === 'subjective-qa'
                    ? 'bg-emerald-500 text-slate-950 font-black shadow'
                    : 'bg-slate-950 text-slate-300 border border-slate-800'
                }`}
              >
                ✍️ {language === 'hindi' ? 'सब्जेक्टिव Q&A' : 'Subjective Q&A'}
              </button>
            </div>

            <button
              onClick={() => {
                if (activeToolMode === 'full-exam' && !isExamFinished) {
                  if (!confirm(language === 'hindi' ? 'क्या आप एक्जाम छोड़ना चाहते हैं?' : 'Exit exam?')) return;
                }
                setStep(2);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-cyan-300 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === 'hindi' ? 'विषय बदलें (Step 2)' : 'Select Subject'}</span>
            </button>
          </div>

          {examError && (
            <div className="p-4 bg-rose-950/20 border border-rose-500/30 rounded-2xl text-rose-300 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{examError}</span>
            </div>
          )}

          {/* TOOL A: CHAPTER-WISE SINGLE MCQ practising */}
          {activeToolMode === 'mcq-test' && (
            <div className="bg-[#091122] border-2 border-cyan-500/30 rounded-3xl p-5 sm:p-7 space-y-5 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-black">
                    {language === 'hindi' ? `प्रश्न ${(currentIndex % activeList.length) + 1} / ${activeList.length}` : `Question ${(currentIndex % activeList.length) + 1} / ${activeList.length}`}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
                    {getLocalizedText(currentQ.subject, language)} • {getLocalizedText(currentQ.chapter, language)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[11px] font-bold">
                    🔥 {currentQ.yearTag}
                  </span>
                  <button
                    onClick={() => speakText(`${currentQ.question} ${currentQ.options.join(', ')}`)}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-400 cursor-pointer"
                    title="प्रश्न सुनें"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="py-2">
                <h2 className="text-base sm:text-xl font-black text-white leading-relaxed">
                  {getLocalizedText(currentQ.question, language)}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentQ.correctAnswer;
                  const showResult = selectedOption !== null;

                  let btnStyle = 'bg-slate-950 border-slate-800 text-slate-200 hover:border-cyan-500/50 hover:bg-slate-900';
                  if (showResult) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold shadow-lg shadow-emerald-950/50';
                    } else if (isSelected && !isCorrect) {
                      btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200 font-bold';
                    } else {
                      btnStyle = 'bg-slate-950/50 border-slate-900 text-slate-500';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={showResult}
                      className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${btnStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-black text-amber-400 shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="text-xs sm:text-sm">{getLocalizedText(opt, language)}</span>
                      </div>
                      {showResult && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                      {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {selectedOption !== null && (
                <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 space-y-2 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-indigo-300 uppercase flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>{language === 'hindi' ? 'बोर्ड टॉपर व्याख्या (Detailed Solution):' : 'Detailed Solution:'}</span>
                    </span>
                    <button
                      onClick={() => speakText(currentQ.explanation)}
                      className="text-[11px] font-bold text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer bg-transparent"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{language === 'hindi' ? 'व्याख्या सुनें' : 'Listen Explanation'}</span>
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {getLocalizedText(currentQ.explanation, language)}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <div className="text-xs text-slate-400">
                  {selectedOption === null 
                    ? (language === 'hindi' ? 'उत्तर जांचने के लिए किसी एक विकल्प (A, B, C, D) पर क्लिक करें' : 'Click any option to submit your answer.')
                    : (language === 'hindi' ? 'उत्तर दर्ज कर लिया गया है!' : 'Response submitted!')}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (currentIndex > 0) {
                        setCurrentIndex(currentIndex - 1);
                        setSelectedOption(null);
                      }
                    }}
                    disabled={currentIndex === 0}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 disabled:opacity-40 hover:text-white font-bold text-xs sm:text-sm flex items-center gap-1 cursor-pointer transition-all"
                  >
                    <span>{language === 'hindi' ? '⬅️ पिछला (Prev)' : '⬅️ Prev'}</span>
                  </button>
                  <button
                    onClick={handleNextQuestion}
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-lg cursor-pointer transition-all"
                  >
                    <span>{language === 'hindi' ? 'अगला प्रश्न (Next) ➡️' : 'Next Question ➡️'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TOOL B: FULL TIMED BOARD EXAM MODE */}
          {activeToolMode === 'full-exam' && (
            <div className="space-y-4">
              
              {/* Exam Info / Stats bar */}
              <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-lg text-xs font-black uppercase flex items-center gap-1.5">
                    <Timer className="w-4 h-4 text-amber-400" />
                    <span>{formatTime(examTimer)}</span>
                  </div>
                  <span className="text-slate-400 text-xs hidden sm:inline">|</span>
                  <span className="text-slate-300 text-xs font-bold">
                    {language === 'hindi' 
                      ? `${selectedBoard} ${selectedClass} ${selectedSubject === 'ALL' ? 'सम्पूर्ण सिलेबस परीक्षा' : selectedSubject}`
                      : `${selectedBoard} ${selectedClass} - Full exam`}
                  </span>
                </div>

                {!isExamFinished && (
                  <button
                    onClick={handleFinishExam}
                    className="px-4.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-xl shadow cursor-pointer transition-all"
                  >
                    {language === 'hindi' ? '✓ परीक्षा समाप्त करें (Submit)' : '✓ Submit Exam Paper'}
                  </button>
                )}
              </div>

              {isExamFinished ? (
                /* EXAM COMPLETED SUMMARY SCREEN */
                <div className="bg-[#091122] border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 space-y-6 text-center animate-fade-in shadow-2xl">
                  <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/40 rounded-2xl flex items-center justify-center text-3xl mx-auto animate-bounce">
                    🏆
                  </div>
                  
                  <div className="space-y-2">
                    <h2 className="text-xl sm:text-2xl font-black text-white">
                      {language === 'hindi' ? '🎉 बोर्ड परीक्षा सफलतापूर्वक समाप्त!' : '🎉 Board Exam Finished Successfully!'}
                    </h2>
                    <p className="text-slate-400 text-xs sm:text-sm">
                      {language === 'hindi' 
                        ? 'आपका अंतिम परीक्षा स्कोर पत्र और बोर्ड टॉपर मेरिट लिस्ट जनरेट कर दी गई है।'
                        : 'Your official scorecard and predicted rank division is prepared.'}
                    </p>
                  </div>

                  <div className={`p-4 rounded-2xl border ${getPerformanceBadge().color} max-w-sm mx-auto`}>
                    <span className="text-[10px] uppercase font-black block tracking-wider opacity-80">
                      {language === 'hindi' ? 'बोर्ड प्रेडिक्टेड प्रभाग' : 'PREDICTED BOARD DIVISION'}
                    </span>
                    <strong className="text-base sm:text-lg font-black block mt-0.5">
                      {getPerformanceBadge().title}
                    </strong>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5 max-w-lg mx-auto py-3 text-slate-300 text-xs border-y border-slate-900">
                    <div className="text-center">
                      <span className="text-slate-500 font-bold block">{language === 'hindi' ? 'कुल प्रश्न' : 'Questions'}</span>
                      <strong className="text-lg font-black text-white">{activeList.length}</strong>
                    </div>
                    <div className="text-center border-x border-slate-900">
                      <span className="text-slate-500 font-bold block">{language === 'hindi' ? 'सही उत्तर' : 'Correct'}</span>
                      <strong className="text-lg font-black text-emerald-400">{score}</strong>
                    </div>
                    <div className="text-center">
                      <span className="text-slate-500 font-bold block">{language === 'hindi' ? 'सटीकता' : 'Accuracy'}</span>
                      <strong className="text-lg font-black text-cyan-400">
                        {Math.round((score / activeList.length) * 100)}%
                      </strong>
                    </div>
                  </div>

                  <div className="space-y-3 max-w-xl mx-auto text-left">
                    <h3 className="text-xs font-black uppercase text-amber-400">
                      📝 {language === 'hindi' ? 'प्रश्नोत्तर विश्लेषण एवं व्याख्याएं:' : 'Question Solutions & Keys:'}
                    </h3>
                    
                    <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                      {activeList.map((q, idx) => {
                        const userAns = examAnswers[idx];
                        const isCorrect = userAns === q.correctAnswer;
                        return (
                          <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-850 text-xs space-y-1.5">
                            <div className="flex items-start justify-between gap-3">
                              <span className="font-bold text-white leading-relaxed">
                                {idx + 1}. {getLocalizedText(q.question, language)}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black shrink-0 ${isCorrect ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'}`}>
                                {isCorrect ? '✓ CORRECT' : '✗ WRONG'}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400">
                              <span className="font-bold text-slate-500">{language === 'hindi' ? 'आपका उत्तर:' : 'Your Answer:'}</span>{' '}
                              <strong className={isCorrect ? 'text-emerald-400' : 'text-rose-400'}>
                                {userAns !== undefined ? getLocalizedText(q.options[userAns], language) : (language === 'hindi' ? 'छोड़ दिया गया' : 'Not Answered')}
                              </strong>
                              {!isCorrect && (
                                <span className="ml-2">
                                  • <span className="font-bold text-slate-500">{language === 'hindi' ? 'सही उत्तर:' : 'Correct:'}</span>{' '}
                                  <strong className="text-emerald-400">{getLocalizedText(q.options[q.correctAnswer], language)}</strong>
                                </span>
                              )}
                            </div>
                            <div className="p-2 rounded bg-indigo-950/20 text-[11px] text-slate-300 border-l-2 border-indigo-500/40">
                              {getLocalizedText(q.explanation, language)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    onClick={handleStartFullExam}
                    className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs sm:text-sm cursor-pointer shadow-lg inline-flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{language === 'hindi' ? 'नया प्रश्न-पत्र जनरेट करें (Re-Take Exam)' : 'Generate New Exam Paper'}</span>
                  </button>
                </div>
              ) : (
                /* EXAM QUESTION VIEW WITH REAL-TIME TCS-ION PALETTE */
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  
                  {/* Main Question Card */}
                  <div className="lg:col-span-3 bg-[#091122] border-2 border-amber-500/30 rounded-3xl p-5 sm:p-7 space-y-5 shadow-xl">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black">
                        {language === 'hindi' ? `प्रश्न ${currentIndex + 1} / ${activeList.length}` : `Question ${currentIndex + 1} / ${activeList.length}`}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-400 text-[11px] font-bold">
                        {getLocalizedText(currentQ.yearTag, language)}
                      </span>
                    </div>

                    <div className="py-1">
                      <h2 className="text-base sm:text-lg font-black text-white leading-relaxed">
                        {getLocalizedText(currentQ.question, language)}
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      {currentQ.options.map((opt, idx) => {
                        const isSelected = examAnswers[currentIndex] === idx;
                        return (
                          <button
                            key={idx}
                            onClick={() => handleSelectOption(idx)}
                            className={`p-3.5 rounded-xl border-2 text-left text-xs sm:text-sm cursor-pointer transition-all flex items-center gap-3 ${
                              isSelected 
                                ? 'bg-amber-500/10 border-amber-400 text-amber-200 font-bold shadow-md'
                                : 'bg-slate-950 border-slate-850 text-slate-300 hover:border-slate-800 hover:bg-slate-900'
                            }`}
                          >
                            <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                              isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-900 text-slate-400'
                            }`}>
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span>{getLocalizedText(opt, language)}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-850">
                      <button
                        onClick={() => {
                          if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
                        }}
                        disabled={currentIndex === 0}
                        className="px-3.5 py-2 bg-slate-950 border border-slate-850 text-slate-400 hover:text-white text-xs font-bold rounded-xl disabled:opacity-30 cursor-pointer"
                      >
                        ← {language === 'hindi' ? 'पिछला' : 'Prev'}
                      </button>

                      <button
                        onClick={() => {
                          if (currentIndex < activeList.length - 1) {
                            setCurrentIndex(currentIndex + 1);
                          } else {
                            if (confirm(language === 'hindi' ? 'क्या आप परीक्षा समाप्त करना चाहते हैं?' : 'Submit paper?')) {
                              handleFinishExam();
                            }
                          }
                        }}
                        className="px-4.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow cursor-pointer transition-all"
                      >
                        {currentIndex < activeList.length - 1 
                          ? (language === 'hindi' ? 'अगला →' : 'Next →')
                          : (language === 'hindi' ? 'परीक्षा समाप्त करें ✓' : 'Submit Exam ✓')}
                      </button>
                    </div>
                  </div>

                  {/* TCS-ION CBT QUESTION PALETTE (SIDEBAR) */}
                  <div className="p-4 bg-slate-950 border border-slate-850 rounded-3xl space-y-4 h-fit shadow-lg">
                    <div className="border-b border-slate-850 pb-2">
                      <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                        🧭 {language === 'hindi' ? 'कम्प्यूटर आधारित परीक्षा पैलेट:' : 'CBT Question Palette:'}
                      </h4>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 lg:grid-cols-4 gap-1.5 max-h-64 overflow-y-auto pr-1">
                      {activeList.map((_, idx) => {
                        const isVisited = examAnswers[idx] !== undefined;
                        const isCurrent = currentIndex === idx;
                        
                        let baseStyle = 'border-slate-800 text-slate-400 bg-slate-900/40';
                        if (isVisited) baseStyle = 'bg-emerald-600/20 border-emerald-500/50 text-emerald-300 font-bold';
                        if (isCurrent) baseStyle = 'bg-amber-500 text-slate-950 font-black border-amber-400 ring-2 ring-amber-400/40 shadow-md';

                        return (
                          <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`w-8.5 h-8.5 rounded-lg border text-xs flex items-center justify-center cursor-pointer transition-all ${baseStyle}`}
                          >
                            {idx + 1}
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-2 border-t border-slate-900 text-[10px] space-y-1.5 text-slate-400 font-semibold">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-emerald-600/30 border border-emerald-500 rounded-md"></span>
                        <span>{language === 'hindi' ? 'हल किया गया (Answered)' : 'Answered'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-slate-900/80 border border-slate-800 rounded-md"></span>
                        <span>{language === 'hindi' ? 'हल नहीं किया (Not Answered)' : 'Not Answered'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-amber-500 rounded-md"></span>
                        <span>{language === 'hindi' ? 'सक्रिय प्रश्न (Current Question)' : 'Current'}</span>
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}

          {/* TOOL C: TOPPER SHORT REVISION NOTES & FORMULAS */}
          {activeToolMode === 'topper-notes' && (
            <div className="bg-[#091122] border-2 border-cyan-500/30 rounded-3xl p-5 sm:p-7 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    📖 {language === 'hindi' 
                      ? `बोर्ड टॉपर रिवीजन नोट्स एवं सूत्र (${selectedSubject === 'ALL' ? 'विज्ञान एवं गणित' : selectedSubject})`
                      : `Topper Revision Notes & Formulas (${selectedSubject === 'ALL' ? 'Science & Maths' : selectedSubject})`}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {language === 'hindi' ? 'परीक्षा में सीधे पूछे जाने वाले टॉपर सारांश सूत्र' : 'Exam syllabus high-yield formulas.'}
                  </p>
                </div>
                <button
                  onClick={() => speakText(activeNotes.summaryPoints.join(' '))}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer bg-transparent"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{language === 'hindi' ? 'नोट्स सुनें' : 'Read Aloud'}</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {activeNotes.summaryPoints.map((pt, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-850 flex items-start gap-3 text-xs sm:text-sm text-slate-200">
                    <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 font-black flex items-center justify-center shrink-0 text-xs">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{getLocalizedText(pt, language)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2.5 pt-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-400">
                  ⚡ {language === 'hindi' ? 'महत्वपूर्ण सूत्र:' : 'Important formulas:'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeNotes.formulas.map((f, i) => (
                    <div key={i} className="p-3.5 rounded-2xl bg-slate-950 border border-amber-500/30 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300">{getLocalizedText(f.title, language)}</span>
                      <span className="text-xs sm:text-sm font-mono font-black text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg">
                        {f.exp}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TOOL D: SUBJECTIVE LONG/SHORT Q&A */}
          {activeToolMode === 'subjective-qa' && (
            <div className="bg-[#091122] border-2 border-emerald-500/30 rounded-3xl p-5 sm:p-7 space-y-4 shadow-2xl">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-base sm:text-lg font-black text-white">
                  ✍ {language === 'hindi' ? 'लघु एवं दीर्घ उत्तरीय प्रश्न बैंक (Subjective QA)' : 'Subjective Model QA Sheets'}
                </h3>
                <p className="text-xs text-slate-400">
                  {language === 'hindi' 
                    ? 'पहले स्वयं उत्तर सोचें, फिर आदर्श उत्तर पर क्लिक करके टॉपर मार्किंग स्कीम से मिलान करें।'
                    : 'Analyze model textbook questions. Reveal and test model topper answers.'}
                </p>
              </div>

              <div className="space-y-4">
                {activeNotes.subjectiveQA.map((item, idx) => (
                  <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="text-xs sm:text-sm font-black text-white leading-relaxed">
                        {getLocalizedText(item.q, language)}
                      </h4>
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-[10px] font-black shrink-0">
                        {item.marks}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setRevealedSubjective(prev => ({ ...prev, [idx]: !prev[idx] }))
                        }
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer transition-all border-none outline-none"
                      >
                        {revealedSubjective[idx] ? (language === 'hindi' ? 'उत्तर छुपाएं' : 'Hide Answer') : (language === 'hindi' ? 'आदर्श टॉपर उत्तर देखें' : 'View Ideal Answer')}
                      </button>
                      <button
                        onClick={() => speakText(`${item.q} ${item.a}`)}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 text-xs font-bold flex items-center gap-1 cursor-pointer bg-transparent"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{language === 'hindi' ? 'सुनें' : 'Listen'}</span>
                      </button>
                    </div>

                    {revealedSubjective[idx] && (
                      <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs sm:text-sm text-slate-200 leading-relaxed animate-fade-in whitespace-pre-wrap">
                        {getLocalizedText(item.a, language)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default BoardExamSingleTestBox;
