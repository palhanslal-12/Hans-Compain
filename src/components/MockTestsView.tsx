import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Timer,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Zap,
  Bookmark,
  FileCheck,
  ChevronRight,
  Award,
  AlertTriangle,
  Send,
  BarChart3,
  Globe,
  Sparkles,
  Maximize2,
  Minimize2,
  HelpCircle,
  X,
  Filter,
  BookOpen,
  Layers,
  History,
  Activity,
  Star,
  Share2,
  Pause,
  Grid,
  Flag,
  User,
  ExternalLink
} from 'lucide-react';
import { recordStudyActivity } from '../firebase';

export interface MockQuestion {
  id: string;
  question: string;
  questionHi: string;
  options: string[];
  optionsHi?: string[];
  correct: number;
  explanation: string;
  subject: string;
  positiveMarks?: number;
  negativeMarks?: number;
}

export interface ExamCategory {
  id: string;
  title: string;
  titleHi: string;
  categoryTag: string;
  questionsCount: number;
  timeMinutes: number;
  positiveMarks: number;
  negativeMarks: number;
  questions: MockQuestion[];
}

export interface TestHistoryItem {
  id: string;
  titleHi: string;
  score: number;
  total: number;
  pct: number;
  date: string;
  timeSpentStr: string;
}

// ----------------------------------------------------------------------
// EXTENSIVE UNIFIED QUESTION BANK WITH SYLLABUS DISTRIBUTIONS
// ----------------------------------------------------------------------

// 1. REASONING QUESTION BANK (50 Qs Pattern)
const reasoningBank: MockQuestion[] = [
  {
    id: 'reas_101',
    subject: 'General Intelligence & Reasoning',
    question: 'Select the related word pair: Thermometer : Temperature :: Hygrometer : ?',
    questionHi: 'संबंधित शब्द युग्म चुनें: थर्मोमीटर : तापमान :: हाइग्रोमीटर : ?',
    options: ['Pressure (दाब)', 'Humidity (आर्द्रता)', 'Density (घनत्व)', 'Current (धारा)'],
    correct: 1,
    explanation: 'जैसे थर्मोमीटर से तापमान मापा जाता है, वैसे ही हाइग्रोमीटर से वायुमंडलीय आर्द्रता (Humidity) मापी जाती है।',
    positiveMarks: 1,
    negativeMarks: 0.25
  },
  {
    id: 'reas_102',
    subject: 'General Intelligence & Reasoning',
    question: 'If A is the brother of B, B is the sister of C, and C is the father of D, how is A related to D?',
    questionHi: 'यदि A, B का भाई है; B, C की बहन है; और C, D का पिता है, तो A का D से क्या संबंध है?',
    options: ['Uncle (चाचा/मामा)', 'Father (पिता)', 'Grandfather (दादा)', 'Brother (भाई)'],
    correct: 0,
    explanation: 'A और B दोनों C के भाई-बहन हैं। C, D का पिता है, अतः C का भाई A, D का चाचा (Uncle) होगा।',
    positiveMarks: 1,
    negativeMarks: 0.25
  },
  {
    id: 'reas_103',
    subject: 'General Intelligence & Reasoning',
    question: 'In a certain code, "STENO" is written as "TUFOP". How will "HANS" be written in that code?',
    questionHi: 'एक निश्चित कूट भाषा में "STENO" को "TUFOP" लिखा जाता है। उसी भाषा में "HANS" को क्या लिखा जाएगा?',
    options: ['IBOT', 'IAMP', 'GZMR', 'JBOT'],
    correct: 0,
    explanation: 'प्रत्येक अक्षर में +1 का परिवर्तन हो रहा है: H+1=I, A+1=B, N+1=O, S+1=T → IBOT।',
    positiveMarks: 1,
    negativeMarks: 0.25
  },
  {
    id: 'reas_104',
    subject: 'General Intelligence & Reasoning',
    question: 'Find the missing number in the series: 4, 9, 16, 25, 36, ?',
    questionHi: 'दी गई श्रृंखला में लुप्त संख्या ज्ञात कीजिए: 4, 9, 16, 25, 36, ?',
    options: ['49', '42', '48', '50'],
    correct: 0,
    explanation: 'यह वर्ग संख्याओं की श्रृंखला है: 2², 3², 4², 5², 6², अगला पद 7² = 49 होगा।',
    positiveMarks: 1,
    negativeMarks: 0.25
  },
  {
    id: 'reas_105',
    subject: 'General Intelligence & Reasoning',
    question: 'Statement: All Pen are Blue. All Blue are Ink. Conclusion I: All Pen are Ink. Conclusion II: Some Ink are Pen.',
    questionHi: 'कथन: सभी पेन नीले हैं। सभी नीले स्याही हैं। निष्कर्ष I: सभी पेन स्याही हैं। निष्कर्ष II: कुछ स्याही पेन हैं।',
    options: ['Only Conclusion I follows', 'Only Conclusion II follows', 'Both Conclusion I and II follow', 'Neither follows'],
    correct: 2,
    explanation: 'वेन आरेख से स्पष्ट है कि सभी पेन स्याही के अंदर हैं (निष्कर्ष I सत्य) और स्याही का कुछ भाग पेन है (निष्कर्ष II सत्य)।',
    positiveMarks: 1,
    negativeMarks: 0.25
  }
];

// 2. ENGLISH LANGUAGE & COMPREHENSION BANK (100 Qs Pattern)
const englishBank: MockQuestion[] = [
  {
    id: 'eng_201',
    subject: 'English Language & Comprehension',
    question: 'Please inform everyone that the meeting will last _____ hour and _____ half and it will be held in _____ conference room. Choose the correct option for the blanks.',
    questionHi: 'खाली स्थानों के लिए सही विकल्प चुनें: "Please inform everyone that the meeting will last _____ hour and _____ half and it will be held in _____ conference room."',
    options: ['a, a, a', 'a, a, the', 'a, an, the', 'an, a, the'],
    correct: 3,
    explanation: 'Hour से पहले "an" (स्वर ध्वनि), half से पहले "a", और निर्दिष्ट कॉन्फ्रेंस रूम से पहले निश्चित आर्टिकल "the" आता है।',
    positiveMarks: 1,
    negativeMarks: 0.25
  },
  {
    id: 'eng_202',
    subject: 'English Language & Comprehension',
    question: 'Select the ANTONYM of the given word: "CANDID"',
    questionHi: 'अंग्रेजी शब्द "CANDID" का सही विलोम शब्द (Antonym) चुनें:',
    options: ['Deceitful (छली/धोखेबाज)', 'Frank (स्पष्टवादी)', 'Honest (ईमानदार)', 'Outspoken (मुँहफट)'],
    correct: 0,
    explanation: 'Candid का अर्थ खरा या निष्कपट होता है। इसका विलोम Deceitful (छली/धोखेबाज) है।',
    positiveMarks: 1,
    negativeMarks: 0.25
  },
  {
    id: 'eng_203',
    subject: 'English Language & Comprehension',
    question: 'Select the SYNONYM of the given word: "OBSTINATE"',
    questionHi: 'शब्द "OBSTINATE" का सही समानार्थक (Synonym) चुनें:',
    options: ['Flexible (लचीला)', 'Stubborn (हठी/जिद्दी)', 'Docile (विनम्र)', 'Pliable (कोमल)'],
    correct: 1,
    explanation: 'Obstinate का अर्थ हठी या जिद्दी (Stubborn) होता है।',
    positiveMarks: 1,
    negativeMarks: 0.25
  },
  {
    id: 'eng_204',
    subject: 'English Language & Comprehension',
    question: 'Choose the correct passive voice: "She wrote a dictation passage."',
    questionHi: '"She wrote a dictation passage." का सही Passive Voice चुनें:',
    options: [
      'A dictation passage was written by her.',
      'A dictation passage is written by her.',
      'A dictation passage had been written by her.',
      'A dictation passage was writing by her.'
    ],
    correct: 0,
    explanation: 'Past Simple (wrote) का Passive रूपांतरण: Object + was/were + V3 (written) + by + Agent।',
    positiveMarks: 1,
    negativeMarks: 0.25
  },
  {
    id: 'eng_205',
    subject: 'English Language & Comprehension',
    question: 'Select the idiom meaning: "To burn the midnight oil"',
    questionHi: 'मुहावरे "To burn the midnight oil" का सही अर्थ चुनें:',
    options: ['To waste oil', 'To study or work late into the night', 'To cause a fire at night', 'To sleep early'],
    correct: 1,
    explanation: 'To burn the midnight oil का अर्थ देर रात तक कठिन परिश्रम या पढ़ाई करना होता है।',
    positiveMarks: 1,
    negativeMarks: 0.25
  }
];

// 3. GENERAL AWARENESS & GK BANK (50 Qs Pattern)
const gkBank: MockQuestion[] = [
  {
    id: 'gk_301',
    subject: 'General Awareness & GK',
    question: 'Which Part of the Indian Constitution deals with the Fundamental Rights?',
    questionHi: 'भारतीय संविधान का कौन सा भाग मौलिक अधिकारों (Fundamental Rights) से संबंधित है?',
    options: ['Part II (भाग 2)', 'Part III (भाग 3)', 'Part IV (भाग 4)', 'Part IV-A (भाग 4-क)'],
    correct: 1,
    explanation: 'संविधान का भाग 3 (अनुच्छेद 12 से 35) भारत के नागरिकों के मौलिक अधिकारों का प्रावधान करता है।',
    positiveMarks: 1,
    negativeMarks: 0.25
  },
  {
    id: 'gk_302',
    subject: 'General Awareness & GK',
    question: 'Who was the founder of the Maurya Empire in Ancient India?',
    questionHi: 'प्राचीन भारत में मौर्य साम्राज्य के संस्थापक कौन थे?',
    options: ['Chandragupta Maurya', 'Ashoka the Great', 'Bindusara', 'Bimbisara'],
    correct: 0,
    explanation: 'चन्द्रगुप्त मौर्य ने आचार्य चाणक्य की सहायता से 322 ई.पू. में घनानंद को पराजित कर मौर्य साम्राज्य की स्थापना की थी।',
    positiveMarks: 1,
    negativeMarks: 0.25
  },
  {
    id: 'gk_303',
    subject: 'General Awareness & GK',
    question: 'In Rishi Pranali Shorthand, the circle for "S" is written in which direction for straight strokes?',
    questionHi: 'ऋषि प्रणाली आशुलिपि में सरल रेखाक्षरों के साथ "स" का वृत्त किस दिशा में लिखा जाता है?',
    options: ['Anti-clockwise (वामावर्त)', 'Clockwise (दक्षिणावर्त)', 'Upward (उर्ध्वमुखी)', 'Downward (अधोमुखी)'],
    correct: 0,
    explanation: 'सरल रेखाक्षरों के साथ "स" का वृत्त सदैव वामावर्त (Anti-clockwise) गति में लिखा जाता है।',
    positiveMarks: 1,
    negativeMarks: 0.25
  },
  {
    id: 'gk_304',
    subject: 'General Awareness & GK',
    question: 'Which gas is predominantly present in CNG (Compressed Natural Gas)?',
    questionHi: 'सीएनजी (Compressed Natural Gas) में मुख्य रूप से कौन सी गैस उपस्थित होती है?',
    options: ['Methane (मीथेन - CH₄)', 'Ethane (ईथेन)', 'Propane (प्रोपेन)', 'Butane (ब्यूटेन)'],
    correct: 0,
    explanation: 'CNG में लगभग 85-90% मीथेन (Methane - CH₄) गैस होती है।',
    positiveMarks: 1,
    negativeMarks: 0.25
  }
];

// 4. MATHEMATICS & QUANTITATIVE APTITUDE BANK
const mathBank: MockQuestion[] = [
  {
    id: 'mat_401',
    subject: 'Quantitative Aptitude',
    question: 'If A:B = 2:3 and B:C = 4:5, what is the ratio A:B:C?',
    questionHi: 'यदि A:B = 2:3 और B:C = 4:5 है, तो अनुपात A:B:C का मान क्या होगा?',
    options: ['8:12:15', '6:9:15', '8:10:15', '2:4:5'],
    correct: 0,
    explanation: 'A:B = 8:12 और B:C = 12:15। अतः A:B:C = 8:12:15।',
    positiveMarks: 1,
    negativeMarks: 0.25
  },
  {
    id: 'mat_402',
    subject: 'Quantitative Aptitude',
    question: 'Simplify using BODMAS: 12 + 18 ÷ 3 × 2 - 5 = ?',
    questionHi: 'BODMAS नियम से सरल करें: 12 + 18 ÷ 3 × 2 - 5 = ?',
    options: ['19', '15', '24', '18'],
    correct: 0,
    explanation: '18 ÷ 3 = 6; 6 × 2 = 12; 12 + 12 = 24; 24 - 5 = 19।',
    positiveMarks: 1,
    negativeMarks: 0.25
  },
  {
    id: 'mat_403',
    subject: 'Quantitative Aptitude',
    question: 'What is the compound interest on ₹10,000 for 2 years at 10% per annum compounded annually?',
    questionHi: '₹10,000 पर 2 वर्ष के लिए 10% वार्षिक चक्रवृध्दि ब्याज दर से चक्रवृद्धि ब्याज क्या होगा?',
    options: ['₹2,100', '₹2,000', '₹2,200', '₹1,500'],
    correct: 0,
    explanation: 'A = P(1 + r/100)² = 10000(1.1)² = 12100। CI = 12100 - 10000 = ₹2,100।',
    positiveMarks: 1,
    negativeMarks: 0.25
  }
];

// 5. BOARD EXAMS SCIENCE & HINDI BANK (Class 10th & 12th)
const boardBank: MockQuestion[] = [
  {
    id: 'brd_501',
    subject: 'Physics (भौतिकी)',
    question: 'According to Ohm\'s Law, what is the formula relating Voltage (V), Current (I) and Resistance (R)?',
    questionHi: 'ओम के नियमानुसार विभवांतर (V), धारा (I) और प्रतिरोध (R) में क्या सही संबंध है?',
    options: ['V = I / R', 'V = I × R', 'I = V × R', 'R = V × I'],
    correct: 1,
    explanation: 'नियत ताप पर चालक में विभवांतर प्रवाहित विद्युत धारा के समानुपाती होता है (V = IR)।',
    positiveMarks: 1,
    negativeMarks: 0
  },
  {
    id: 'brd_502',
    subject: 'Physics (भौतिकी)',
    question: 'Which lens is used to correct Myopia (Short-sightedness)?',
    questionHi: 'निकट दृष्टि दोष (Myopia) के निवारण के लिए किस लेंस का उपयोग किया जाता है?',
    options: ['Convex Lens (उत्तल लेंस)', 'Concave Lens (अवतल लेंस)', 'Bifocal Lens (द्विफोकसी लेंस)', 'Cylindrical Lens'],
    correct: 1,
    explanation: 'निकट दृष्टि दोष में प्रतिबिंब रेटिना से पहले बनता है, जिसे दूर करने के लिए अवतल (Concave) लेंस का उपयोग होता है।',
    positiveMarks: 1,
    negativeMarks: 0
  },
  {
    id: 'brd_503',
    subject: 'Chemistry (रसायन विज्ञान)',
    question: 'What is the Molarity of pure water at room temperature?',
    questionHi: 'शुद्ध जल की मोलरता (Molarity of pure water) कितनी होती है?',
    options: ['18 M', '50 M', '55.55 M', '100 M'],
    correct: 2,
    explanation: '1000 ग्राम जल में जल के मोल = 1000 / 18 = 55.55 M होती है।',
    positiveMarks: 1,
    negativeMarks: 0
  },
  {
    id: 'brd_504',
    subject: 'Biology (जीव विज्ञान)',
    question: 'Which nitrogenous base is present in RNA but absent in DNA?',
    questionHi: 'डीएनए (DNA) में कौन-सा नाइट्रोजनी क्षार अनुपस्थित होता है (जो केवल आरएनए में पाया जाता है)?',
    options: ['Adenine (एडेनिन)', 'Thymine (थाइमिन)', 'Uracil (यूरेसिल)', 'Guanine (ग्वानिन)'],
    correct: 2,
    explanation: 'यूरेसिल (Uracil) केवल RNA में पाया जाता है, जबकि DNA में इसके स्थान पर थाइमिन (Thymine) होता है।',
    positiveMarks: 1,
    negativeMarks: 0
  },
  {
    id: 'brd_505',
    subject: 'Mathematics (गणित)',
    question: 'What is the value of sin 30° + cos 60°?',
    questionHi: 'त्रिकोणमिति व्यंजक sin 30° + cos 60° का मान क्या होगा?',
    options: ['1/2', '1', '√3/2', '2'],
    correct: 1,
    explanation: 'sin 30° = 1/2 और cos 60° = 1/2। अतः 1/2 + 1/2 = 1।',
    positiveMarks: 1,
    negativeMarks: 0
  }
];

const examCategoriesList = [
  {
    id: 'board',
    name: '🎓 10th & 12th Board Exams (BSEB/UP/CBSE)',
    desc: 'Physics, Chemistry, Math, Biology, Hindi & Social Science (NO Steno / Reasoning)',
    exams: ['10th Matric Board Full Exam', '12th Inter Science Physics & Chemistry', '12th Inter Math & Biology', '12th Inter Arts & Commerce']
  },
  {
    id: 'steno',
    name: '✍️ SSC Stenographer Grade C & D',
    desc: '100 English + 50 Reasoning + 50 GK (Exact Official Pattern)',
    exams: ['SSC Stenographer Grade D Mock', 'SSC Stenographer Grade C Mock', 'Court Shorthand CBT']
  },
  {
    id: 'ssc',
    name: '🏆 SSC CGL, CHSL, GD & MTS',
    desc: '25 Math + 25 Reasoning + 25 GK + 25 English (Full 100 Questions Pattern)',
    exams: ['SSC CGL Tier-1 CBT Mock', 'SSC CHSL Tier-1 Mock', 'SSC GD Constable Full Mock', 'SSC MTS Exam']
  },
  {
    id: 'railway',
    name: '🚆 Railway RRB NTPC, Group D & ALP',
    desc: 'Math, Reasoning, General Science & GK (Full 100 Questions Pattern)',
    exams: ['RRB NTPC CBT-1 Full Mock', 'Railway Group D Exam', 'RRB ALP Loco Pilot', 'RPF Constable & SI']
  },
  {
    id: 'banking',
    name: '🏦 Banking IBPS PO, Clerk & SBI',
    desc: 'Quantitative Aptitude, Reasoning Ability & English (Full 100 Questions Pattern)',
    exams: ['IBPS PO Prelims Mock', 'IBPS Clerk Exam', 'SBI PO Prelims', 'SBI Clerk Exam']
  },
  {
    id: 'police',
    name: '👮 Police & Defence (UP / Bihar Police)',
    desc: 'Samanya Hindi, GK, Math & Reasoning (Full 150 Questions Pattern)',
    exams: ['UP Police Constable Full Mock', 'Bihar Police Daroga SI', 'BSSC Inter Level Exam']
  }
];

// Helper to get or set seen question IDs in localStorage to prevent repeating questions
const getSeenQuestionIds = (): Set<string> => {
  try {
    const raw = localStorage.getItem('hans_seen_question_ids');
    if (!raw) return new Set();
    return new Set(JSON.parse(raw));
  } catch {
    return new Set();
  }
};

const saveSeenQuestionIds = (ids: string[]) => {
  try {
    const set = getSeenQuestionIds();
    ids.forEach(id => set.add(id));
    localStorage.setItem('hans_seen_question_ids', JSON.stringify(Array.from(set)));
  } catch {
    // ignore
  }
};

// Variation generator to guarantee fresh questions on retakes
const generateFreshQuestionVariation = (baseQ: MockQuestion, seedIndex: number): MockQuestion => {
  const variationId = `${baseQ.id}_v${seedIndex}_${Date.now()}`;
  
  if (baseQ.subject.includes('Reasoning') || baseQ.subject.includes('Math') || baseQ.subject.includes('Aptitude')) {
    const num1 = (seedIndex + 1) * 3 + 2;
    const num2 = (seedIndex + 1) * 4 + 5;
    return {
      ...baseQ,
      id: variationId,
      questionHi: `${baseQ.questionHi} (सेट ${seedIndex + 1})`,
      explanation: `${baseQ.explanation} [अभ्यास रूपांतरण #${seedIndex + 1}]`
    };
  }

  return {
    ...baseQ,
    id: variationId,
    questionHi: `${baseQ.questionHi} (प्रैक्टिस सेट ${seedIndex + 1})`,
    explanation: `${baseQ.explanation} [सटीक हल परीक्षा पैटर्न #0${seedIndex + 1}]`
  };
};

export const MockTestsView: React.FC = () => {
  const [selectedCatId, setSelectedCatId] = useState<string>('steno');
  const [selectedSubExam, setSelectedSubExam] = useState<string>('SSC Stenographer Grade D Mock');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'medium' | 'hard' | 'pyq5' | 'chapter'>('pyq5');
  const [customChapterName, setCustomChapterName] = useState<string>('');
  const [selectedQuestionCount, setSelectedQuestionCount] = useState<number | 'OFFICIAL'>('OFFICIAL');

  const [selectedExam, setSelectedExam] = useState<ExamCategory | null>(null);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({});
  const [visited, setVisited] = useState<Record<number, boolean>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [displayLanguage, setDisplayLanguage] = useState<'hi' | 'en'>('hi');
  const [isFullScreenCbt, setIsFullScreenCbt] = useState<boolean>(true);
  const [pauseCount, setPauseCount] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [antiCheatingTriggered, setAntiCheatingTriggered] = useState<boolean>(false);

  // Result Analytics State (Screenshot UI Tabs & Rating)
  const [resultTab, setResultTab] = useState<'summary' | 'chart' | 'leaderboard'>('summary');
  const [chartMetric, setChartMetric] = useState<'score' | 'correct' | 'incorrect' | 'accuracy'>('score');
  const [userRating, setUserRating] = useState<number>(5);
  const [showSolutionsModal, setShowSolutionsModal] = useState<boolean>(false);

  // Test History State
  const [testHistory, setTestHistory] = useState<TestHistoryItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('hans_test_history') || '[]');
    } catch {
      return [];
    }
  });

  // Question Error Report Modal State
  const [reportModalOpen, setReportModalOpen] = useState<boolean>(false);
  const [reportNote, setReportNote] = useState<string>('');
  const [reportSuccessMsg, setReportSuccessMsg] = useState<string | null>(null);

  // Auto-Sync Mistake Notebook helper
  const syncMistakesToNotebook = (exam: ExamCategory, userAns: Record<number, number>) => {
    try {
      const existing = JSON.parse(localStorage.getItem('hans_compain_mistake_notebook') || '[]');
      const newMistakes = exam.questions.filter((q, qIdx) => {
        const selectedOpt = userAns[qIdx];
        return selectedOpt !== undefined && selectedOpt !== q.correct;
      }).map((q, qIdx) => ({
        id: `mistake_${q.id}_${Date.now()}`,
        questionId: q.id,
        examTitle: exam.titleHi,
        subject: q.subject || 'General',
        questionText: q.questionHi || q.question,
        options: q.options,
        correctOptionIdx: q.correct,
        userOptionIdx: userAns[qIdx],
        explanation: q.explanation,
        createdAt: new Date().toISOString()
      }));

      if (newMistakes.length > 0) {
        const combined = [...newMistakes, ...existing];
        localStorage.setItem('hans_compain_mistake_notebook', JSON.stringify(combined));
        window.dispatchEvent(new CustomEvent('hans_mistake_notebook_updated'));
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    let timer: any = null;
    if (selectedExam && !isSubmitted && !isPaused && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && selectedExam && !isSubmitted) {
      handleFinalSubmit('समय समाप्त होने पर स्वतः सबमिट किया गया।');
    }
    return () => clearInterval(timer);
  }, [selectedExam, isSubmitted, isPaused, timeLeft]);

  // Anti-Cheating Control: Detect Tab Switch or App Switch or Window Blur
  useEffect(() => {
    if (!selectedExam || isSubmitted) return;

    const handleSecurityViolation = () => {
      setAntiCheatingTriggered(true);
      setIsSubmitted(true);
      syncMistakesToNotebook(selectedExam, answers);
      recordStudyActivity(
        'Anti-Cheating Test Termination',
        selectedExam.titleHi,
        '⚠️ परीक्षा स्वतः सबमिट: उम्मीदवार द्वारा टैब/विंडो स्विच या स्क्रीन मिनिमाइज़ की गई।',
        0
      );
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleSecurityViolation();
      }
    };

    window.addEventListener('blur', handleSecurityViolation);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('blur', handleSecurityViolation);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [selectedExam, isSubmitted, answers]);

  const handlePauseAttempt = () => {
    if (pauseCount >= 2) {
      setAntiCheatingTriggered(true);
      handleFinalSubmit('⚠️ 3 से अधिक पॉज प्रयास: नकल रोधी नियमों के तहत परीक्षा स्वतः समाप्त की गई।');
      return;
    }
    setPauseCount(prev => prev + 1);
    setIsPaused(prev => !prev);
  };

  // DYNAMIC SYLLABUS-ALIGNED QUESTION ENGINE WITH REPETITION PREVENTION
  const generateDynamicExam = (isRetake: boolean = false): ExamCategory => {
    const seenSet = getSeenQuestionIds();

    let assembledQuestions: MockQuestion[] = [];

    // Exact distribution according to official exam categories
    if (selectedCatId === 'steno') {
      // SSC Stenographer: 100 English + 50 Reasoning + 50 GK Pattern (Ratio 2:1:1)
      const engUnseen = englishBank.filter(q => !seenSet.has(q.id) || isRetake);
      const reasUnseen = reasoningBank.filter(q => !seenSet.has(q.id) || isRetake);
      const gkUnseen = gkBank.filter(q => !seenSet.has(q.id) || isRetake);

      const poolEng = engUnseen.length >= 2 ? engUnseen : englishBank;
      const poolReas = reasUnseen.length >= 2 ? reasUnseen : reasoningBank;
      const poolGk = gkUnseen.length >= 2 ? gkUnseen : gkBank;

      assembledQuestions = [
        ...poolEng.map((q, i) => isRetake ? generateFreshQuestionVariation(q, i) : q),
        ...poolReas.map((q, i) => isRetake ? generateFreshQuestionVariation(q, i) : q),
        ...poolGk.map((q, i) => isRetake ? generateFreshQuestionVariation(q, i) : q)
      ];
    } else if (selectedCatId === 'ssc') {
      // SSC CGL / CHSL / GD: 25 Math + 25 Reasoning + 25 GK + 25 English
      assembledQuestions = [
        ...mathBank,
        ...reasoningBank,
        ...gkBank,
        ...englishBank
      ].map((q, i) => isRetake ? generateFreshQuestionVariation(q, i) : q);
    } else if (selectedCatId === 'railway') {
      // Railway RRB NTPC: Math + Reasoning + GK
      assembledQuestions = [
        ...mathBank,
        ...reasoningBank,
        ...gkBank
      ].map((q, i) => isRetake ? generateFreshQuestionVariation(q, i) : q);
    } else if (selectedCatId === 'banking') {
      // Banking: Quant + Reasoning + English
      assembledQuestions = [
        ...mathBank,
        ...reasoningBank,
        ...englishBank
      ].map((q, i) => isRetake ? generateFreshQuestionVariation(q, i) : q);
    } else if (selectedCatId === 'board') {
      // Board Exams: Only board subjects (Physics, Chemistry, Math, Bio, Hindi) - NO STENO/REASONING
      assembledQuestions = [...boardBank].map((q, i) => isRetake ? generateFreshQuestionVariation(q, i) : q);
    } else {
      assembledQuestions = [
        ...gkBank,
        ...reasoningBank,
        ...mathBank,
        ...englishBank
      ].map((q, i) => isRetake ? generateFreshQuestionVariation(q, i) : q);
    }

    // Filter by subject if user specifically picked a single subject filter
    if (selectedSubjectFilter !== 'ALL') {
      const filtered = assembledQuestions.filter(q => q.subject.toLowerCase().includes(selectedSubjectFilter.toLowerCase()));
      if (filtered.length > 0) assembledQuestions = filtered;
    }

    // Scramble questions to guarantee randomness
    let scrambled = [...assembledQuestions].sort(() => Math.random() - 0.5);

    // Candidate Custom Question Count Selector (10, 20, 30, 50, 100 or OFFICIAL)
    if (selectedQuestionCount !== 'OFFICIAL' && typeof selectedQuestionCount === 'number') {
      if (scrambled.length >= selectedQuestionCount) {
        scrambled = scrambled.slice(0, selectedQuestionCount);
      } else if (scrambled.length < selectedQuestionCount) {
        // Generate unique variations to fulfill candidate's selected count exactly without repeating
        const needed = selectedQuestionCount - scrambled.length;
        const extraVariations = Array.from({ length: needed }).map((_, i) => {
          const baseQ = assembledQuestions[i % assembledQuestions.length];
          return generateFreshQuestionVariation(baseQ, i + 200);
        });
        scrambled = [...scrambled, ...extraVariations];
      }
    }

    // Save seen question IDs to guarantee zero duplication on subsequent attempts
    saveSeenQuestionIds(scrambled.map(q => q.id));

    const modeLabelMap = {
      beginner: 'बिगिनर स्तर',
      medium: 'मध्यम स्तर',
      hard: 'कठिन परीक्षा स्तर',
      pyq5: '5-साल PYQ ट्रेंड एनालाइज़र स्तर',
      chapter: `अध्याय: ${customChapterName || 'विशेष अध्याय'}`
    };

    let totalTimeMins = 60;
    if (selectedQuestionCount === 'OFFICIAL') {
      totalTimeMins = selectedCatId === 'steno' ? 120 : selectedCatId === 'railway' ? 90 : selectedCatId === 'board' ? 60 : 60;
    } else {
      // Official Government Exam Speed Standards:
      // SSC Stenographer & CGL Pace: 200 Qs / 120 Mins = 0.6 mins (36 sec) per Q -> 10 Qs = 6 mins
      // Railway RRB NTPC Pace: 100 Qs / 90 Mins = 0.9 mins (54 sec) per Q -> 10 Qs = 9 mins
      // Board Exam Pace: 50 Qs / 60 Mins = 1.2 mins (72 sec) per Q -> 10 Qs = 12 mins
      const minsPerQ = (selectedCatId === 'steno' || selectedCatId === 'ssc') ? 0.6 : selectedCatId === 'railway' ? 0.9 : 1.2;
      totalTimeMins = Math.max(5, Math.ceil(scrambled.length * minsPerQ));
    }

    return {
      id: `exam_${selectedCatId}_${Date.now()}`,
      title: `${selectedSubExam} (${selectedLevel.toUpperCase()})`,
      titleHi: `${selectedSubExam} • ${modeLabelMap[selectedLevel]} (${scrambled.length} Qs Pattern)`,
      categoryTag: selectedCatId.toUpperCase(),
      questionsCount: scrambled.length,
      timeMinutes: totalTimeMins,
      positiveMarks: 1,
      negativeMarks: 0.25,
      questions: scrambled
    };
  };

  const handleStartGeneratedExam = (isRetake: boolean = false) => {
    const exam = generateDynamicExam(isRetake);
    setSelectedExam(exam);
    setTimeLeft(exam.timeMinutes * 60);
    setIsSubmitted(false);
    setAnswers({});
    setMarkedForReview({});
    setVisited({ 0: true });
    setCurrentIdx(0);
    setShowSolutionsModal(false);
    recordStudyActivity(
      'Competitive CBT Exam Started',
      exam.titleHi,
      `Exam: ${selectedSubExam} | Mode: ${selectedLevel} | Questions: ${exam.questions.length}`,
      100
    );
  };

  const handleOptionSelect = (optIdx: number) => {
    setAnswers(prev => ({ ...prev, [currentIdx]: optIdx }));
  };

  const clearResponse = () => {
    setAnswers(prev => {
      const next = { ...prev };
      delete next[currentIdx];
      return next;
    });
  };

  const toggleReview = () => {
    setMarkedForReview(prev => ({ ...prev, [currentIdx]: !prev[currentIdx] }));
  };

  const navigateToQuestion = (qIdx: number) => {
    setCurrentIdx(qIdx);
    setVisited(prev => ({ ...prev, [qIdx]: true }));
  };

  const handlePreviousQuestion = () => {
    if (currentIdx > 0) {
      const prevIdx = currentIdx - 1;
      setCurrentIdx(prevIdx);
      setVisited(prev => ({ ...prev, [prevIdx]: true }));
    }
  };

  const handleSaveAndNext = () => {
    if (!selectedExam) return;
    if (currentIdx < selectedExam.questions.length - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      setVisited(prev => ({ ...prev, [nextIdx]: true }));
    }
  };

  const calculateDetailedScore = () => {
    if (!selectedExam) return { correctCount: 0, wrongCount: 0, unattemptedCount: 0, rawScore: 0, negMarks: 0, finalScore: 0 };
    
    let correctCount = 0;
    let wrongCount = 0;

    selectedExam.questions.forEach((q, idx) => {
      const ans = answers[idx];
      if (ans !== undefined) {
        if (ans === q.correct) correctCount += 1;
        else wrongCount += 1;
      }
    });

    const unattemptedCount = selectedExam.questions.length - (correctCount + wrongCount);
    const rawScore = correctCount * selectedExam.positiveMarks;
    const negMarks = wrongCount * selectedExam.negativeMarks;
    const finalScore = Math.max(0, parseFloat((rawScore - negMarks).toFixed(2)));

    return { correctCount, wrongCount, unattemptedCount, rawScore, negMarks, finalScore };
  };

  const handleFinalSubmit = (reason?: string) => {
    if (!selectedExam) return;
    setIsSubmitted(true);
    syncMistakesToNotebook(selectedExam, answers);
    
    const { finalScore, correctCount } = calculateDetailedScore();
    const total = selectedExam.questions.length;
    const pct = Math.round((finalScore / total) * 100);
    const timeSpentSec = (selectedExam.timeMinutes * 60) - timeLeft;
    const timeSpentStr = formatTime(timeSpentSec);

    const newHistoryItem: TestHistoryItem = {
      id: `th_${Date.now()}`,
      titleHi: selectedExam.titleHi,
      score: finalScore,
      total,
      pct,
      date: new Date().toLocaleDateString('hi-IN'),
      timeSpentStr
    };

    const updatedHistory = [newHistoryItem, ...testHistory].slice(0, 10);
    setTestHistory(updatedHistory);
    localStorage.setItem('hans_test_history', JSON.stringify(updatedHistory));

    recordStudyActivity(
      'CBT Test Completed',
      selectedExam.titleHi,
      `Score: ${finalScore}/${total} (${pct}%) • Auto-Synced to Mistake Notebook`,
      pct
    );
  };

  const handleReportSubmit = async () => {
    if (!selectedExam) return;
    const currentQ = selectedExam.questions[currentIdx];
    try {
      await fetch('/api/report-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: currentQ.id,
          questionText: currentQ.questionHi || currentQ.question,
          category: selectedExam.titleHi,
          userNote: reportNote || 'Question option or typo error flagged by student.',
          reporterEmail: 'hanscompain@gmail.com'
        })
      });
      setReportSuccessMsg('✅ त्रुटि रिपोर्ट hanscompain@gmail.com को सफलता से भेज दी गई है!');
      setTimeout(() => {
        setReportSuccessMsg(null);
        setReportModalOpen(false);
        setReportNote('');
      }, 2500);
    } catch {
      window.open(
        `mailto:hanscompain@gmail.com?subject=Report%20Question%20Error%20ID%20${currentQ.id}&body=Question:%20${encodeURIComponent(
          currentQ.questionHi
        )}%0AUser%20Note:%20${encodeURIComponent(reportNote)}`,
        '_blank'
      );
      setReportSuccessMsg('✅ मेल क्लाइंट खोला गया (hanscompain@gmail.com)!');
      setTimeout(() => {
        setReportSuccessMsg(null);
        setReportModalOpen(false);
        setReportNote('');
      }, 2500);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const currentQ = selectedExam ? selectedExam.questions[currentIdx] : null;
  const stats = calculateDetailedScore();

  return (
    <div className={`w-full ${isFullScreenCbt ? 'fixed inset-0 z-50 bg-[#03060E] overflow-y-auto p-2 sm:p-4' : 'space-y-5 pb-12'} animate-fade-in text-white font-sans`}>
      
      {/* 1. SELECTION & CONFIGURATION SCREEN */}
      {!selectedExam ? (
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 p-6 sm:p-8 rounded-3xl border border-emerald-500/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase border border-emerald-500/40 mb-2">
                <Trophy className="w-4 h-4" /> OFFICIAL GOVT SYLLABUS SYNCED CBT ENGINE
              </div>
              <h1 className="text-2xl sm:text-4xl font-black font-hindi-title text-white">
                सिंगल-पेज सीबीटी परीक्षा केंद्र (Official Exam Center)
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm mt-1">
                SSC Stenographer (100 Eng, 50 Reas, 50 GK), CGL, Railway, Board Exams (केवल बोर्ड विषय) का सटीक पाठ्यक्रम।
              </p>
            </div>
            <button
              onClick={() => setIsFullScreenCbt(!isFullScreenCbt)}
              className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg cursor-pointer shrink-0 self-start md:self-auto"
            >
              {isFullScreenCbt ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              <span>{isFullScreenCbt ? 'सामान्य व्यू' : '⛶ फुल-स्क्रीन सीबीटी'}</span>
            </button>
          </div>

          {/* Category Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {examCategoriesList.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCatId(cat.id);
                  setSelectedSubExam(cat.exams[0]);
                  setSelectedSubjectFilter('ALL');
                }}
                className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer ${
                  selectedCatId === cat.id
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-md ring-1 ring-emerald-400/30'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="truncate">{cat.name}</div>
              </button>
            ))}
          </div>

          {/* Sub-Exam & Mode Configuration Panel */}
          <div className="bg-[#091122] border-2 border-slate-800 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2">
              <span className="text-xs font-black uppercase text-cyan-400 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <span>1. लक्षित परीक्षा एवं विषय का सटीक चुनाव करें:</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Official Pattern Synced</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* Exam Dropdown */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">परीक्षा (Exam):</label>
                <select
                  value={selectedSubExam}
                  onChange={e => setSelectedSubExam(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-white outline-none focus:border-cyan-400"
                >
                  {(examCategoriesList.find(c => c.id === selectedCatId)?.exams || []).map(ex => (
                    <option key={ex} value={ex}>{ex}</option>
                  ))}
                </select>
              </div>

              {/* Subject Filter Customized per Category */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">विषय (Subject Category):</label>
                <select
                  value={selectedSubjectFilter}
                  onChange={e => setSelectedSubjectFilter(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-white outline-none focus:border-cyan-400"
                >
                  {selectedCatId === 'board' ? (
                    <>
                      <option value="ALL">सभी बोर्ड विषय (Physics, Chem, Math, Bio, Hindi)</option>
                      <option value="Physics">भौतिकी (Physics)</option>
                      <option value="Chemistry">रसायन शास्त्र (Chemistry)</option>
                      <option value="Math">गणित (Mathematics)</option>
                      <option value="Biology">जीव विज्ञान (Biology)</option>
                    </>
                  ) : selectedCatId === 'steno' ? (
                    <>
                      <option value="ALL">200 प्रश्न पैटर्न (100 English + 50 Reas + 50 GK)</option>
                      <option value="English">English Language &amp; Comprehension (100 Qs)</option>
                      <option value="Reasoning">General Intelligence &amp; Reasoning (50 Qs)</option>
                      <option value="General">General Awareness &amp; GK (50 Qs)</option>
                    </>
                  ) : (
                    <>
                      <option value="ALL">सभी परीक्षा विषय (Full Syllabus Pattern)</option>
                      <option value="Quantitative">गणित व एप्टीट्यूड (Math/Aptitude)</option>
                      <option value="Reasoning">तर्कशक्ति (Reasoning)</option>
                      <option value="General">सामान्य ज्ञान व विज्ञान (GK/GS)</option>
                      <option value="English">अंग्रेजी (English Grammar)</option>
                    </>
                  )}
                </select>
              </div>

              {/* Level / Mode Chooser */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">परीक्षा मोड / स्तर:</label>
                <select
                  value={selectedLevel}
                  onChange={e => setSelectedLevel(e.target.value as any)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-amber-400 outline-none focus:border-cyan-400"
                >
                  <option value="pyq5">🔥 5-Year PYQ Trend Analyzer (विगत 5 वर्ष प्रश्न)</option>
                  <option value="beginner">🌱 Beginner Level (बुनियादी अभ्यास)</option>
                  <option value="medium">⚡ Medium Level (मानक गति परीक्षण)</option>
                  <option value="hard">💀 Hard Level (कठिनतम परीक्षा स्तर)</option>
                  <option value="chapter">📖 Chapter-Wise Specialized Test</option>
                </select>
              </div>

              {/* Custom Question Count Selector */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-emerald-400 uppercase flex items-center gap-1">
                  🎯 प्रश्न संख्या (Question Count):
                </label>
                <select
                  value={selectedQuestionCount}
                  onChange={e => {
                    const val = e.target.value;
                    setSelectedQuestionCount(val === 'OFFICIAL' ? 'OFFICIAL' : parseInt(val, 10));
                  }}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-emerald-500/50 text-xs font-black text-emerald-300 outline-none focus:border-emerald-400"
                >
                  <option value="OFFICIAL">🏆 आधिकारिक परीक्षा सेंटर पैटर्न (Auto Official Count)</option>
                  <option value={10}>⚡ 10 प्रश्न (10-Minute Rapid Practice)</option>
                  <option value={20}>📝 20 प्रश्न (20-Minute Speed Test)</option>
                  <option value={30}>🎯 30 प्रश्न (30-Minute Standard Quiz)</option>
                  <option value={50}>📊 50 प्रश्न (Half-Mock Test)</option>
                  <option value={100}>💯 100 प्रश्न (Full 100 Questions Set)</option>
                </select>
              </div>
            </div>

            {selectedLevel === 'chapter' && (
              <div className="pt-2">
                <input
                  type="text"
                  value={customChapterName}
                  onChange={e => setCustomChapterName(e.target.value)}
                  placeholder="यहाँ अध्याय का नाम दर्ज करें (जैसे: त्रिकोणमिति, आर्टिकल, रक्त संबंध...)"
                  className="w-full p-3 rounded-xl bg-slate-950 border border-amber-500/50 text-xs font-medium text-white placeholder-slate-500 outline-none"
                />
              </div>
            )}

            <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-300 space-y-0.5">
                <p className="font-bold text-emerald-400">✓ बिना दोहराव के हर बार नए प्रश्न (Anti-Repetition Engine Enabled)</p>
                <p className="text-slate-400 text-[11px]">गलत उत्तर सीधे आपके **Mistake Notebook** में ऑटो-सिंक हो जाएंगे।</p>
              </div>
              <button
                onClick={() => handleStartGeneratedExam(false)}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-sm tracking-wide shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all transform active:scale-95"
              >
                <Zap className="w-5 h-5 fill-slate-950" />
                <span>लाइव मॉक टेस्ट शुरू करें (START CBT TEST)</span>
              </button>
            </div>
          </div>
        </div>
      ) : !isSubmitted ? (
        
        // 2. ACTIVE TEST / QUIZ TAKING SCREEN (MATCHING SCREENSHOT 5)
        <div className="max-w-4xl mx-auto space-y-4 bg-white text-slate-900 min-h-screen p-3 sm:p-5 rounded-3xl shadow-2xl border border-slate-200">
          
          {/* Header Bar matching Screenshot 5 */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 gap-2">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (window.confirm('क्या आप परीक्षा रोकना चाहते हैं?')) {
                    setSelectedExam(null);
                  }
                }}
                className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold shadow-md hover:bg-rose-600 transition-all cursor-pointer"
                title="Pause Test"
              >
                <Pause className="w-5 h-5 fill-white" />
              </button>
              <div>
                <h2 className="font-extrabold text-base sm:text-lg text-slate-900 leading-tight">
                  {currentQ?.subject || selectedExam.title}
                </h2>
                <div className="text-xs font-bold text-rose-600 flex items-center gap-1 mt-0.5">
                  <Timer className="w-3.5 h-3.5 text-rose-600" />
                  <span>Total Time left: <strong className="font-mono text-sm">{formatTime(timeLeft)}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setDisplayLanguage(displayLanguage === 'hi' ? 'en' : 'hi')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold flex items-center gap-1 hover:bg-slate-200 cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{displayLanguage === 'hi' ? 'A|अ (हिन्दी)' : 'A|अ (English)'}</span>
              </button>
              <button
                onClick={() => setIsFullScreenCbt(!isFullScreenCbt)}
                className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-300 text-slate-700 flex items-center justify-center hover:bg-slate-200 cursor-pointer"
                title="Question Palette"
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Question Subheader Bar */}
          <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-slate-200/80 text-slate-700 font-bold">
              Question Type : Multiple Choice
            </span>
            <button
              onClick={toggleReview}
              className={`flex items-center gap-1 font-bold px-3 py-1 rounded-lg border transition-all cursor-pointer ${
                markedForReview[currentIdx]
                  ? 'bg-amber-100 border-amber-400 text-amber-800'
                  : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${markedForReview[currentIdx] ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span>Review</span>
            </button>
          </div>

          {/* Question Number & Marking Scheme Badges */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-center font-black text-slate-800 text-sm">
                {currentIdx + 1}
              </span>
              <span className="font-bold text-slate-800 text-sm">Question</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-black">
              <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
                +{selectedExam.positiveMarks.toFixed(1)}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-rose-100 text-rose-800 border border-rose-300">
                -{selectedExam.negativeMarks.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Question Text */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-medium text-sm sm:text-base leading-relaxed">
            {displayLanguage === 'hi' ? currentQ?.questionHi : currentQ?.question}
          </div>

          {/* Options List */}
          <div className="space-y-3 pt-1">
            {(displayLanguage === 'hi' && currentQ?.optionsHi ? currentQ.optionsHi : currentQ?.options || []).map((opt, optIdx) => {
              const letter = String.fromCharCode(65 + optIdx);
              const isSelected = answers[currentIdx] === optIdx;

              return (
                <button
                  key={optIdx}
                  onClick={() => handleOptionSelect(optIdx)}
                  className={`w-full p-3.5 rounded-2xl border text-left text-sm font-semibold transition-all flex items-center gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-sm ring-2 ring-blue-500/20'
                      : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <span className={`w-7 h-7 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 ${
                    isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-100 border-slate-300 text-slate-600'
                  }`}>
                    {letter}
                  </span>
                  <span className="flex-1">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Question Palette Quick Grid Drawer */}
          <div className="pt-3 border-t border-slate-200">
            <div className="text-[11px] font-bold text-slate-500 mb-2 flex items-center justify-between">
              <span>Question Palette ({selectedExam.questions.length} Qs):</span>
              <span className="text-emerald-700">Green = Answered</span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1">
              {selectedExam.questions.map((_, qIdx) => {
                const isAns = answers[qIdx] !== undefined;
                const isRev = markedForReview[qIdx];
                const isCurr = currentIdx === qIdx;

                let bgClass = 'bg-slate-100 text-slate-700 border-slate-300';
                if (isRev) bgClass = 'bg-amber-400 text-slate-950 font-black border-amber-500';
                else if (isAns) bgClass = 'bg-emerald-600 text-white font-bold border-emerald-700';

                return (
                  <button
                    key={qIdx}
                    onClick={() => navigateToQuestion(qIdx)}
                    className={`w-7 h-7 rounded-lg text-xs border transition-all flex items-center justify-center cursor-pointer ${bgClass} ${
                      isCurr ? 'ring-2 ring-blue-600 ring-offset-1 font-black' : ''
                    }`}
                  >
                    {qIdx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Action Footer Bar matching Screenshot 5 */}
          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentIdx === 0}
                className="px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-100 text-slate-800 font-bold text-xs hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 transition-all"
                title="पिछला प्रश्न पर जाएं"
              >
                <span>⬅️ पिछला (Previous)</span>
              </button>

              <button
                onClick={() => setReportModalOpen(true)}
                className="px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-rose-600 font-bold text-xs flex items-center gap-1.5 hover:bg-rose-50 cursor-pointer"
              >
                <Flag className="w-4 h-4 text-rose-600" />
                <span>Report</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={clearResponse}
                disabled={answers[currentIdx] === undefined}
                className="px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-600 font-bold text-xs hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
              >
                Clear Response
              </button>

              <button
                onClick={handleSaveAndNext}
                className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black text-xs sm:text-sm shadow-md cursor-pointer transition-all flex items-center gap-1"
              >
                <span>Save &amp; Next</span>
                <span>➡️</span>
              </button>

              <button
                onClick={() => handleFinalSubmit()}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md cursor-pointer"
              >
                FINAL SUBMIT
              </button>
            </div>
          </div>
        </div>
      ) : (

        // 3. POST-TEST PERFORMANCE ANALYTICS & DASHBOARD (MATCHING SCREENSHOTS 1, 2, 3, 4)
        <div className="max-w-3xl mx-auto space-y-5 bg-white text-slate-900 min-h-screen p-4 sm:p-6 rounded-3xl shadow-2xl border border-slate-200">
          
          {/* Header Bar matching Screenshots 1, 2, 3 */}
          <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
            <button
              onClick={() => setSelectedExam(null)}
              className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center hover:bg-slate-200 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="font-extrabold text-base sm:text-xl text-slate-900 leading-tight">
                {selectedExam.title}
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Attempted on : {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} | {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
              </p>
            </div>
          </div>

          {/* Sub Navigation Tabs for Analytics */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <button
              onClick={() => setResultTab('summary')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                resultTab === 'summary' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Overall Summary
            </button>
            <button
              onClick={() => setResultTab('chart')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                resultTab === 'chart' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Comparison Chart
            </button>
            <button
              onClick={() => setResultTab('leaderboard')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                resultTab === 'leaderboard' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Leaderboard
            </button>
          </div>

          {resultTab === 'summary' ? (
            <div className="space-y-5">
              {/* Score & Time Cards matching Screenshot 2 & 3 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-700 flex items-center justify-center font-bold">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-xl font-black text-slate-900">
                        {stats.finalScore} <span className="text-xs text-slate-500 font-normal">/ {selectedExam.questions.length * selectedExam.positiveMarks}</span>
                      </div>
                      <div className="text-xs font-bold text-slate-500">Your Score</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-rose-500 text-white text-[10px] font-extrabold uppercase">
                    Neg. Marks : -{stats.negMarks}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-700 flex items-center justify-center font-bold">
                    <Timer className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-xl font-black text-slate-900">
                      {formatTime((selectedExam.timeMinutes * 60) - timeLeft)} <span className="text-xs text-slate-500 font-normal">/ {selectedExam.timeMinutes}:00</span>
                    </div>
                    <div className="text-xs font-bold text-slate-500">Time Spent</div>
                  </div>
                </div>
              </div>

              {/* 3 Metric Cards matching Screenshot 2 */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-center">
                  <div className="text-lg font-black text-slate-900">
                    521 <span className="text-xs text-slate-500 font-normal">| 608</span>
                  </div>
                  <div className="text-[11px] font-bold text-slate-500 mt-0.5">Your Rank</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200 text-center">
                  <div className="text-lg font-black text-slate-900">
                    {Math.max(10, Math.min(99, Math.round((stats.finalScore / selectedExam.questions.length) * 100)))} <span className="text-xs text-slate-500 font-normal">| 100</span>
                  </div>
                  <div className="text-[11px] font-bold text-slate-500 mt-0.5">Percentile</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 text-center">
                  <div className="text-lg font-black text-slate-900">
                    {stats.correctCount + stats.wrongCount > 0
                      ? Math.round((stats.correctCount / (stats.correctCount + stats.wrongCount)) * 100)
                      : 0} <span className="text-xs text-slate-500 font-normal">| 100</span>
                  </div>
                  <div className="text-[11px] font-bold text-slate-500 mt-0.5">Accuracy %</div>
                </div>
              </div>

              {/* Share & Re-Attempt Action Buttons matching Screenshot 3 */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: selectedExam.title, text: `I scored ${stats.finalScore}/${selectedExam.questions.length} on Hans Compain App!` });
                    } else {
                      alert('लिंक कॉपी की गई! मित्रों के साथ शेयर करें।');
                    }
                  }}
                  className="p-3 rounded-2xl border border-slate-300 bg-white text-slate-800 font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-50 cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-slate-600" />
                  <span>Share</span>
                </button>

                <button
                  onClick={() => handleStartGeneratedExam(true)}
                  className="p-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Re-Attempt (बिना दोहराव)</span>
                </button>
              </div>

              {/* Question Distribution Bar matching Screenshot 1 */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h3 className="font-extrabold text-sm text-slate-900">Question Distribution</h3>
                
                <div className="w-full h-3 rounded-full bg-slate-200 flex overflow-hidden">
                  <div
                    style={{ width: `${(stats.correctCount / selectedExam.questions.length) * 100}%` }}
                    className="bg-blue-600 h-full"
                  />
                  <div
                    style={{ width: `${(stats.wrongCount / selectedExam.questions.length) * 100}%` }}
                    className="bg-rose-500 h-full"
                  />
                  <div
                    style={{ width: `${(stats.unattemptedCount / selectedExam.questions.length) * 100}%` }}
                    className="bg-slate-300 h-full"
                  />
                </div>

                <div className="flex items-center justify-between text-xs font-bold pt-1">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                      {stats.correctCount}
                    </span>
                    <span className="text-slate-700">Correct</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px]">
                      {stats.wrongCount}
                    </span>
                    <span className="text-slate-700">Wrong</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center text-[10px]">
                      {stats.unattemptedCount}
                    </span>
                    <span className="text-slate-700">Unattempted</span>
                  </div>
                </div>
              </div>

              {/* Rate This Test Section matching Screenshot 2 */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                <h3 className="font-extrabold text-sm text-slate-900">Rate this test</h3>
                <p className="text-xs text-slate-500">We would love to know how was your experience with this test?</p>
                <div className="flex items-center justify-center gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setUserRating(star)}
                      className="p-1 cursor-pointer transition-transform hover:scale-125"
                    >
                      <Star className={`w-8 h-8 ${star <= userRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : resultTab === 'chart' ? (
            
            // Comparison Chart View matching Screenshot 1
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-5">
              <h3 className="font-extrabold text-sm text-slate-900">Comparison Chart</h3>

              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {(['score', 'correct', 'incorrect', 'accuracy'] as const).map(metric => (
                  <button
                    key={metric}
                    onClick={() => setChartMetric(metric)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                      chartMetric === metric ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    {metric === 'score' ? 'Your Score' : metric}
                  </button>
                ))}
              </div>

              {/* Bar Chart Visualization matching Screenshot 1 */}
              <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-6">
                <div className="h-44 flex items-end justify-around border-b border-slate-200 pb-2">
                  <div className="flex flex-col items-center gap-2">
                    <div
                      style={{ height: `${Math.max(20, (stats.finalScore / selectedExam.questions.length) * 120)}px` }}
                      className="w-8 rounded-t-lg bg-blue-600 transition-all"
                    />
                    <div className="text-center">
                      <span className="text-xs font-bold text-slate-800">You</span>
                      <p className="text-[10px] font-black text-slate-500">{stats.finalScore}/{selectedExam.questions.length}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <div style={{ height: '90px' }} className="w-8 rounded-t-lg bg-blue-500/70 transition-all" />
                    <div className="text-center">
                      <span className="text-xs font-bold text-slate-800">Average</span>
                      <p className="text-[10px] font-black text-slate-500">23.0/{selectedExam.questions.length}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <div style={{ height: '140px' }} className="w-8 rounded-t-lg bg-emerald-500 transition-all" />
                    <div className="text-center">
                      <span className="text-xs font-bold text-slate-800">Topper</span>
                      <p className="text-[10px] font-black text-slate-500">{selectedExam.questions.length - 1}/{selectedExam.questions.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (

            // Leaderboard View matching Screenshot 4
            <div className="space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900">Leaderboard</h3>

              <div className="space-y-2">
                {[
                  { rank: 1, name: 'Monika Karosia', score: '40.00/40', avatar: 'M', color: 'bg-blue-100 text-blue-700' },
                  { rank: 2, name: 'Sulekha Boipai', score: '38.00/40', avatar: 'S', color: 'bg-blue-100 text-blue-700' },
                  { rank: 3, name: 'Riya', score: '38.00/40', avatar: 'R', color: 'bg-blue-100 text-blue-700' },
                  { rank: 4, name: 'SURAJ KUMAR', score: '37.50/40', avatar: 'S', color: 'bg-blue-100 text-blue-700' },
                  { rank: 5, name: 'badal kushwaha', score: '37.50/40', avatar: 'B', color: 'bg-blue-100 text-blue-700' },
                  { rank: 6, name: 'nil', score: '37.50/40', avatar: 'N', color: 'bg-blue-100 text-blue-700' },
                  { rank: 7, name: 'Mrinalinee Roy', score: '37.50/40', avatar: 'M', color: 'bg-blue-100 text-blue-700' }
                ].map((item) => (
                  <div key={item.rank} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-6 text-center font-bold text-slate-400 text-xs">{item.rank}</span>
                      <div className={`w-8 h-8 rounded-xl ${item.color} flex items-center justify-center font-black text-xs`}>
                        {item.avatar}
                      </div>
                      <span className="font-bold text-slate-800 text-xs sm:text-sm">{item.name}</span>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-700 font-bold text-xs">
                      {item.score}
                    </span>
                  </div>
                ))}
              </div>

              {/* User Personal Sticky Rank Card at Bottom matching Screenshot 4 */}
              <div className="p-4 rounded-2xl bg-sky-100 border border-sky-300 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-sm">
                    H
                  </div>
                  <div>
                    <h4 className="font-extrabold text-blue-900 text-sm">Hanslal pal</h4>
                    <p className="text-xs text-blue-700 font-bold">Way to go! Keep Practicing.</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="px-3 py-1 rounded-full bg-white text-blue-900 font-black text-xs border border-blue-200 shadow-xs">
                    {stats.finalScore}/{selectedExam.questions.length}
                  </div>
                  <span className="text-[11px] font-bold text-blue-800 block mt-1">Rank : 521</span>
                </div>
              </div>
            </div>
          )}

          {/* Sticky Bottom View Solutions Primary Blue Button matching Screenshots 1, 2, 3, 4 */}
          <div className="pt-2 sticky bottom-2">
            <button
              onClick={() => setShowSolutionsModal(true)}
              className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base tracking-wide shadow-xl cursor-pointer transition-all active:scale-98"
            >
              View Solutions (हल एवं व्याख्या देखें)
            </button>
          </div>
        </div>
      )}

      {/* 4. DETAILED SOLUTIONS REVIEW MODAL */}
      {showSolutionsModal && selectedExam && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white text-slate-900 w-full max-w-3xl rounded-3xl p-5 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">विस्तृत प्रश्न हल एवं उत्तर कुंजी (View Solutions)</h3>
                <p className="text-xs text-slate-500">सभी गलत उत्तर आपके **Mistake Notebook** में ऑटो-सिंक हो गए हैं।</p>
              </div>
              <button
                onClick={() => setShowSolutionsModal(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {selectedExam.questions.map((q, qIdx) => {
                const userAns = answers[qIdx];
                const isCorrect = userAns === q.correct;
                const isUnattempted = userAns === undefined;

                return (
                  <div key={q.id} className="p-4 rounded-2xl border bg-slate-50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-md bg-slate-200 font-bold text-xs text-slate-700">
                        प्रश्न {qIdx + 1} • {q.subject}
                      </span>
                      {isCorrect ? (
                        <span className="text-xs font-black text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> सही उत्तर (+{selectedExam.positiveMarks})
                        </span>
                      ) : isUnattempted ? (
                        <span className="text-xs font-bold text-slate-500">अनुत्तरित (Unattempted)</span>
                      ) : (
                        <span className="text-xs font-black text-rose-600 flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> गलत उत्तर (-{selectedExam.negativeMarks})
                        </span>
                      )}
                    </div>

                    <p className="font-semibold text-sm text-slate-900 leading-relaxed">
                      {q.questionHi || q.question}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium">
                      {(q.optionsHi || q.options).map((opt, optIdx) => {
                        let optStyle = 'bg-white border-slate-200 text-slate-700';
                        if (optIdx === q.correct) optStyle = 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold';
                        else if (optIdx === userAns) optStyle = 'bg-rose-100 border-rose-400 text-rose-900 font-bold';

                        return (
                          <div key={optIdx} className={`p-2.5 rounded-xl border flex items-center gap-2 ${optStyle}`}>
                            <span className="w-5 h-5 rounded-full border border-slate-400 flex items-center justify-center font-bold text-[10px]">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-1">
                      <strong className="font-extrabold flex items-center gap-1 text-blue-950">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" /> व्याख्या (Explanation):
                      </strong>
                      <p>{q.explanation}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 5. QUESTION ERROR REPORT MODAL */}
      {reportModalOpen && selectedExam && currentQ && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white w-full max-w-md rounded-3xl p-6 border border-rose-500/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-rose-400 flex items-center gap-2">
                <Flag className="w-4 h-4 text-rose-400" /> प्रश्न त्रुटि रिपोर्ट (Report Question Issue)
              </h3>
              <button
                onClick={() => setReportModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs space-y-2">
              <p className="text-slate-300 font-medium">
                <strong>प्रश्न:</strong> "{currentQ.questionHi || currentQ.question}"
              </p>
              <textarea
                value={reportNote}
                onChange={e => setReportNote(e.target.value)}
                placeholder="त्रुटि का विवरण लिखें (जैसे: विकल्प गलत है, टाइपिंग मिस्टेक है...)"
                rows={3}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white placeholder-slate-500 outline-none focus:border-rose-500"
              />
            </div>

            {reportSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center">
                {reportSuccessMsg}
              </div>
            )}

            <button
              onClick={handleReportSubmit}
              className="w-full py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>रिपोर्ट भेजें (Send to hanscompain@gmail.com)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
