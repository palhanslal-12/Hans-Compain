import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Timer,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  Zap,
  Bookmark,
  Star,
  Share2,
  Pause,
  Play,
  Flag,
  X,
  Filter,
  Sparkles,
  Globe,
  Eye,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Menu,
  Users,
  Send,
  AlertCircle,
  BookOpen,
  Layers,
  GraduationCap
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
  explanationEn?: string;
  subject: string;
  positiveMarks?: number;
  negativeMarks?: number;
  avgTimeSec?: number;
  correctPct?: number;
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

// Helper to strip bilingual bracket clutter so ONLY single language shows
const cleanSingleLang = (text: string, lang: 'hi' | 'en'): string => {
  if (!text) return '';
  if (lang === 'en') {
    const stripped = text.replace(/\s*\([^)]*[\u0900-\u097F]+[^)]*\)/g, '').trim();
    return stripped || text;
  } else {
    const matchParenHi = text.match(/\(([^)]*[\u0900-\u097F]+[^)]*)\)/);
    if (matchParenHi && !/[\u0900-\u097F]/.test(text.split('(')[0])) {
      return matchParenHi[1].trim();
    }
    const strippedEn = text.replace(/\s*\([A-Za-z0-9\s,.'"-]+\)/g, '').trim();
    return strippedEn || text;
  }
};

// 1. GENERAL AWARENESS & GK BANK (Matching Screenshot 1 & 2 SSC CPO / CGL / Steno Pattern)
const gkBank: MockQuestion[] = [
  {
    id: 'gk_301',
    subject: 'General Awareness',
    question: 'Famous scholar Al-Biruni wrote Kitab-ul-Hind in _______ language.',
    questionHi: 'प्रसिद्ध विद्वान अल-बरूनी ने "किताब-उल-हिन्द" की रचना किस भाषा में की थी?',
    options: ['Sanskrit', 'Arabic', 'Urdu', 'Persian'],
    optionsHi: ['संस्कृत', 'अरबी', 'उर्दू', 'फारसी'],
    correct: 1,
    explanation: 'अल-बरूनी एक प्रसिद्ध फारसी विद्वान थे, जिन्होंने अपनी प्रसिद्ध पुस्तक "किताब-उल-हिन्द" (भारत की खोज) अरबी भाषा में लिखी थी।',
    explanationEn: 'Al-Biruni, a renowned Persian scholar, wrote "Kitab-ul-Hind" (The Book of India) in Arabic. This comprehensive work covers Indian religion, philosophy, and science.',
    positiveMarks: 1,
    negativeMarks: 0.25,
    avgTimeSec: 18,
    correctPct: 68
  },
  {
    id: 'gk_302',
    subject: 'General Awareness',
    question: 'Lost wax casting technique was used to make _______ statues during the Harappan civilization.',
    questionHi: 'हड़प्पा सभ्यता के दौरान लुप्त मोम ढलाई तकनीक (Lost wax casting) का उपयोग _______ की मूर्तियाँ बनाने के लिए किया जाता था।',
    options: ['Stone', 'Bronze', 'Terracotta', 'Iron'],
    optionsHi: ['पत्थर', 'कांस्य (Bronze)', 'टेराकोटा', 'लोहा'],
    correct: 1,
    explanation: 'सिंधु घाटी सभ्यता में "लॉस्ट वैक्स कास्टिंग" (मधुच्छिष्ट विधि) का प्रयोग कांस्य (Bronze) की मूर्तियाँ (जैसे मोहनजोदड़ो की नर्तकी की मूर्ति) बनाने में किया गया था।',
    explanationEn: 'The lost-wax casting technique (Cire Perdue) was extensively used during the Harappan civilization to craft Bronze statues, most famously the "Dancing Girl" of Mohenjo-daro.',
    positiveMarks: 1,
    negativeMarks: 0.25,
    avgTimeSec: 21,
    correctPct: 74
  },
  {
    id: 'gk_303',
    subject: 'General Awareness',
    question: 'Which Article of the Indian Constitution deals with the "Abolition of Untouchability"?',
    questionHi: 'भारतीय संविधान का कौन-सा अनुच्छेद "अस्पृश्यता के उन्मूलन" से संबंधित है?',
    options: ['Article 14', 'Article 17', 'Article 19', 'Article 21'],
    optionsHi: ['अनुच्छेद 14', 'अनुच्छेद 17', 'अनुच्छेद 19', 'अनुच्छेद 21'],
    correct: 1,
    explanation: 'भारतीय संविधान का अनुच्छेद 17 अस्पृश्यता (छुआछूत) को समाप्त करता है और किसी भी रूप में इसके आचरण को दंडनीय अपराध घोषित करता है।',
    explanationEn: 'Article 17 of the Indian Constitution abolishes "Untouchability" and forbids its practice in any form.',
    positiveMarks: 1,
    negativeMarks: 0.25,
    avgTimeSec: 14,
    correctPct: 82
  },
  {
    id: 'gk_304',
    subject: 'General Awareness',
    question: 'Who founded the "Atmiya Sabha" in Calcutta in 1815?',
    questionHi: '1815 में कलकत्ता में "आत्मीय सभा" की स्थापना किसने की थी?',
    options: ['Swami Vivekananda', 'Raja Ram Mohan Roy', 'Dayanand Saraswati', 'Ishwar Chandra Vidyasagar'],
    optionsHi: ['स्वामी विवेकानंद', 'राजा राममोहन राय', 'दयानंद सरस्वती', 'ईश्वर चंद्र विद्यासागर'],
    correct: 1,
    explanation: 'राजा राममोहन राय ने एकेश्वरवाद और सामाजिक सुधारों के प्रचार के लिए 1815 में कलकत्ता में आत्मीय सभा की स्थापना की थी।',
    explanationEn: 'Raja Ram Mohan Roy founded the Atmiya Sabha in Calcutta in 1815 to campaign against idolatry and caste rigidities.',
    positiveMarks: 1,
    negativeMarks: 0.25,
    avgTimeSec: 19,
    correctPct: 65
  },
  {
    id: 'gk_305',
    subject: 'General Awareness',
    question: 'Which enzyme present in human saliva breaks down starch into maltose?',
    questionHi: 'मानव लार में मौजूद कौन-सा एंजाइम स्टार्च को माल्टोज में तोड़ता है?',
    options: ['Pepsin', 'Salivary Amylase (Ptyalin)', 'Trypsin', 'Lipase'],
    optionsHi: ['पेप्सिन', 'लार एमाइलेज (टायलिन)', 'ट्रिप्सिन', 'लाइपेज'],
    correct: 1,
    explanation: 'लार में मौजूद एमाइलेज (टायलिन) एंजाइम भोजन के जटिल स्टार्च को सरल शर्करा (माल्टोज) में परिवर्तित करता है।',
    explanationEn: 'Salivary Amylase (also known as Ptyalin) is the digestive enzyme in human saliva that catalyzes the hydrolysis of starch into maltose.',
    positiveMarks: 1,
    negativeMarks: 0.25,
    avgTimeSec: 16,
    correctPct: 79
  }
];

// 2. REASONING BANK
const reasoningBank: MockQuestion[] = [
  {
    id: 'reas_101',
    subject: 'General Intelligence & Reasoning',
    question: 'Select the related word pair: Thermometer : Temperature :: Hygrometer : ?',
    questionHi: 'संबंधित शब्द युग्म चुनें: थर्मोमीटर : तापमान :: हाइग्रोमीटर : ?',
    options: ['Pressure', 'Humidity', 'Density', 'Electric Current'],
    optionsHi: ['दाब', 'आर्द्रता', 'घनत्व', 'विद्युत धारा'],
    correct: 1,
    explanation: 'जैसे थर्मोमीटर से तापमान मापा जाता है, वैसे ही हाइग्रोमीटर से वायुमंडलीय आर्द्रता मापी जाती है।',
    explanationEn: 'Just as a Thermometer measures Temperature, a Hygrometer is an instrument used to measure atmospheric Humidity.',
    positiveMarks: 1,
    negativeMarks: 0.25,
    avgTimeSec: 15,
    correctPct: 81
  },
  {
    id: 'reas_102',
    subject: 'General Intelligence & Reasoning',
    question: 'If A is the brother of B, B is the sister of C, and C is the father of D, how is A related to D?',
    questionHi: 'यदि A, B का भाई है; B, C की बहन है; और C, D का पिता है, तो A का D से क्या संबंध है?',
    options: ['Uncle', 'Father', 'Grandfather', 'Brother'],
    optionsHi: ['चाचा', 'पिता', 'दादा', 'भाई'],
    correct: 0,
    explanation: 'A और B दोनों C के भाई-बहन हैं। C, D का पिता है, अतः C का भाई A, D का चाचा होगा।',
    explanationEn: 'A is the brother of C, and C is the father of D. Therefore, A is the paternal Uncle of D.',
    positiveMarks: 1,
    negativeMarks: 0.25,
    avgTimeSec: 24,
    correctPct: 72
  },
  {
    id: 'reas_103',
    subject: 'General Intelligence & Reasoning',
    question: 'In a certain code, "STENO" is written as "TUFOP". How will "HANS" be written in that code?',
    questionHi: 'एक निश्चित कूट भाषा में "STENO" को "TUFOP" लिखा जाता है। उसी भाषा में "HANS" को क्या लिखा जाएगा?',
    options: ['IBOT', 'IAMP', 'GZMR', 'JBOT'],
    optionsHi: ['IBOT', 'IAMP', 'GZMR', 'JBOT'],
    correct: 0,
    explanation: 'प्रत्येक अक्षर में +1 का परिवर्तन हो रहा है: H+1=I, A+1=B, N+1=O, S+1=T → IBOT।',
    explanationEn: 'Each letter is shifted forward by +1 position in the English alphabet: H(+1)=I, A(+1)=B, N(+1)=O, S(+1)=T -> IBOT.',
    positiveMarks: 1,
    negativeMarks: 0.25,
    avgTimeSec: 20,
    correctPct: 76
  },
  {
    id: 'reas_104',
    subject: 'General Intelligence & Reasoning',
    question: 'Find the missing number in the series: 4, 9, 16, 25, 36, ?',
    questionHi: 'दी गई श्रृंखला में लुप्त संख्या ज्ञात कीजिए: 4, 9, 16, 25, 36, ?',
    options: ['49', '42', '48', '50'],
    optionsHi: ['49', '42', '48', '50'],
    correct: 0,
    explanation: 'यह क्रमागत पूर्ण वर्ग संख्याओं की श्रृंखला है: 2², 3², 4², 5², 6², अगला पद 7² = 49 होगा।',
    explanationEn: 'The series consists of consecutive perfect squares: 2², 3², 4², 5², 6². The next term is 7² = 49.',
    positiveMarks: 1,
    negativeMarks: 0.25,
    avgTimeSec: 12,
    correctPct: 88
  },
  {
    id: 'reas_105',
    subject: 'General Intelligence & Reasoning',
    question: 'Statements: All Pens are Blue. All Blue are Ink. Conclusions: I. All Pens are Ink. II. Some Ink are Pens.',
    questionHi: 'कथन: सभी पेन नीले हैं। सभी नीले स्याही हैं। निष्कर्ष: I. सभी पेन स्याही हैं। II. कुछ स्याही पेन हैं।',
    options: ['Only Conclusion I follows', 'Only Conclusion II follows', 'Both Conclusion I and II follow', 'Neither follows'],
    optionsHi: ['केवल निष्कर्ष I अनुसरण करता है', 'केवल निष्कर्ष II अनुसरण करता है', 'निष्कर्ष I और II दोनों अनुसरण करते हैं', 'कोई भी अनुसरण नहीं करता है'],
    correct: 2,
    explanation: 'वेन आरेख से स्पष्ट है कि सभी पेन स्याही के अंदर हैं और स्याही का कुछ भाग पेन है।',
    explanationEn: 'From the Venn diagram, since Pens ⊂ Blue ⊂ Ink, all Pens are definitely Ink (I follows) and some Ink are Pens (II follows).',
    positiveMarks: 1,
    negativeMarks: 0.25,
    avgTimeSec: 26,
    correctPct: 69
  }
];

// 3. ENGLISH LANGUAGE BANK
const englishBank: MockQuestion[] = [
  {
    id: 'eng_201',
    subject: 'English Language & Comprehension',
    question: 'Please inform everyone that the meeting will last _____ hour and _____ half and it will be held in _____ conference room.',
    questionHi: 'रिक्त स्थानों के लिए सही आर्टिकल चुनें: "Please inform everyone that the meeting will last _____ hour and _____ half and it will be held in _____ conference room."',
    options: ['a, a, a', 'a, a, the', 'a, an, the', 'an, a, the'],
    optionsHi: ['a, a, a', 'a, a, the', 'a, an, the', 'an, a, the'],
    correct: 3,
    explanation: 'Hour से पहले स्वर ध्वनि के कारण "an", half से पहले "a", और निश्चित कॉन्फ्रेंस रूम से पहले "the" आता है।',
    explanationEn: '"an" is used before "hour" (silent h, vowel sound), "a" before "half", and "the" before the specific "conference room".',
    positiveMarks: 1,
    negativeMarks: 0.25,
    avgTimeSec: 17,
    correctPct: 71
  },
  {
    id: 'eng_202',
    subject: 'English Language & Comprehension',
    question: 'Select the ANTONYM of the given word: "CANDID"',
    questionHi: 'दिए गए शब्द "CANDID" का सही विलोम (Antonym) चुनें:',
    options: ['Deceitful', 'Frank', 'Honest', 'Outspoken'],
    optionsHi: ['Deceitful', 'Frank', 'Honest', 'Outspoken'],
    correct: 0,
    explanation: 'Candid का अर्थ निष्कपट या स्पष्टवादी होता है। इसका सही विलोम Deceitful (धोखेबाज/छली) है।',
    explanationEn: 'Candid means truthful and straightforward. Its exact antonym is Deceitful (dishonest/insincere).',
    positiveMarks: 1,
    negativeMarks: 0.25,
    avgTimeSec: 14,
    correctPct: 77
  },
  {
    id: 'eng_203',
    subject: 'English Language & Comprehension',
    question: 'Select the SYNONYM of the given word: "OBSTINATE"',
    questionHi: 'दिए गए शब्द "OBSTINATE" का सही पर्यायवाची (Synonym) चुनें:',
    options: ['Flexible', 'Stubborn', 'Docile', 'Pliable'],
    optionsHi: ['Flexible', 'Stubborn', 'Docile', 'Pliable'],
    correct: 1,
    explanation: 'Obstinate का अर्थ जिद्दी या हठी होता है, जिसका पर्यायवाची Stubborn है।',
    explanationEn: 'Obstinate means stubbornly refusing to change one’s opinion; hence "Stubborn" is the correct synonym.',
    positiveMarks: 1,
    negativeMarks: 0.25,
    avgTimeSec: 15,
    correctPct: 80
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
    optionsHi: [
      'A dictation passage was written by her.',
      'A dictation passage is written by her.',
      'A dictation passage had been written by her.',
      'A dictation passage was writing by her.'
    ],
    correct: 0,
    explanation: 'Simple Past (wrote) का Passive Voice: Object + was/were + V3 (written) + by + Subject होता है।',
    explanationEn: 'Simple Past active verb "wrote" converts to "was/were + past participle (written)" in Passive Voice.',
    positiveMarks: 1,
    negativeMarks: 0.25,
    avgTimeSec: 16,
    correctPct: 84
  },
  {
    id: 'eng_205',
    subject: 'English Language & Comprehension',
    question: 'Select the meaning of the idiom: "To burn the midnight oil"',
    questionHi: 'मुहावरे "To burn the midnight oil" का सही अर्थ चुनें:',
    options: ['To waste lamp oil', 'To study or work late into the night', 'To create a fire at midnight', 'To wake up in the morning'],
    optionsHi: ['तेल बर्बाद करना', 'देर रात तक कठिन अध्ययन या परिश्रम करना', 'आधी रात को आग जलाना', 'सुबह जल्दी उठना'],
    correct: 1,
    explanation: 'To burn the midnight oil का अर्थ देर रात तक जागकर पढ़ाई या कड़ी मेहनत करना है।',
    explanationEn: 'The idiom "burn the midnight oil" means to read, study, or work late into the night.',
    positiveMarks: 1,
    negativeMarks: 0.25,
    avgTimeSec: 13,
    correctPct: 89
  }
];

// 4. QUANTITATIVE APTITUDE BANK
const mathBank: MockQuestion[] = [
  {
    id: 'math_401',
    subject: 'Quantitative Aptitude',
    question: 'If the cost price of 15 articles is equal to the selling price of 12 articles, find the profit percentage.',
    questionHi: 'यदि 15 वस्तुओं का क्रय मूल्य 12 वस्तुओं के विक्रय मूल्य के बराबर है, तो लाभ प्रतिशत ज्ञात कीजिए।',
    options: ['20%', '25%', '15%', '30%'],
    optionsHi: ['20%', '25%', '15%', '30%'],
    correct: 1,
    explanation: 'लाभ % = ((15 - 12) / 12) × 100 = (3 / 12) × 100 = 25% लाभ।',
    explanationEn: 'CP × 15 = SP × 12 => SP/CP = 15/12 = 5/4. Profit % = ((5 - 4)/4) × 100 = 25%.',
    positiveMarks: 1,
    negativeMarks: 0.25,
    avgTimeSec: 25,
    correctPct: 73
  },
  {
    id: 'math_402',
    subject: 'Quantitative Aptitude',
    question: 'A train 180 meters long is running at a speed of 72 km/h. How much time will it take to cross a pole?',
    questionHi: '180 मीटर लंबी एक रेलगाड़ी 72 किमी/घंटा की चाल से चल रही है। यह एक खंभे को पार करने में कितना समय लेगी?',
    options: ['9 seconds', '10 seconds', '12 seconds', '15 seconds'],
    optionsHi: ['9 सेकंड', '10 सेकंड', '12 सेकंड', '15 सेकंड'],
    correct: 0,
    explanation: 'चाल = 72 × (5/18) = 20 मीटर/सेकंड। समय = दूरी / चाल = 180 / 20 = 9 सेकंड।',
    explanationEn: 'Speed in m/s = 72 × (5/18) = 20 m/s. Time taken = Distance / Speed = 180 / 20 = 9 seconds.',
    positiveMarks: 1,
    negativeMarks: 0.25,
    avgTimeSec: 22,
    correctPct: 78
  }
];

const examCategoriesList = [
  {
    id: 'ssc',
    name: '🏆 SSC CPO, CGL, CHSL & GD',
    desc: 'General Awareness, Reasoning, Quant & English (Official TCS Pattern)',
    exams: ['SSC CPO General Awareness Quiz', 'SSC CGL Tier-1 Full Mock', 'SSC CHSL Tier-1 CBT', 'SSC GD Constable Mock']
  },
  {
    id: 'steno',
    name: '✍️ SSC Stenographer Grade C & D',
    desc: '100 English + 50 Reasoning + 50 General Awareness Pattern',
    exams: ['SSC Stenographer Grade D Mock', 'SSC Stenographer Grade C Mock', 'High Court Steno CBT']
  },
  {
    id: 'railway',
    name: '🚆 Railway RRB NTPC, Group D & ALP',
    desc: 'General Science, GK, Mathematics & Reasoning',
    exams: ['RRB NTPC CBT-1 Mock', 'Railway Group D Science & GK', 'RRB ALP Technician Test']
  },
  {
    id: 'banking',
    name: '🏦 Banking IBPS PO, Clerk & SBI',
    desc: 'Quantitative Aptitude, Reasoning & English Comprehension',
    exams: ['SBI PO Prelims Speed Quiz', 'IBPS Clerk Mock Test', 'RBI Assistant CBT']
  },
  {
    id: 'police',
    name: '👮 Police & State PSC (Bihar / UP)',
    desc: 'General Studies, Indian Polity, History & Mental Ability',
    exams: ['Bihar Police Daroga SI Quiz', 'UP Police Constable Mock', 'BSSC Inter Level CBT']
  }
];

const leaderboardPeers = [
  { rank: 1, avatar: 'M', name: 'Mohit Prajapat', ratio: 1.0 },
  { rank: 2, avatar: 'P', name: 'Pinki Singh', ratio: 1.0 },
  { rank: 3, avatar: 'V', name: 'Vrinda mukhija', ratio: 1.0 },
  { rank: 4, avatar: 'A', name: 'Abhi', ratio: 1.0 },
  { rank: 5, avatar: 'A', name: 'Adarsh Thakur', ratio: 0.8 },
  { rank: 6, avatar: 'D', name: 'Dhwanil Solanky', ratio: 0.8 },
  { rank: 7, avatar: 'M', name: 'Maurya Tejash', ratio: 0.8 },
  { rank: 8, avatar: 'V', name: 'vishalchharolgmailcom', ratio: 0.75 },
  { rank: 9, avatar: 'S', name: 'Shreyanshi', ratio: 0.75 },
  { rank: 10, avatar: 'N', name: 'Nunu', ratio: 0.75 }
];

export const MockTestsView: React.FC = () => {
  const [selectedCatId, setSelectedCatId] = useState<string>('ssc');
  const [selectedSubExam, setSelectedSubExam] = useState<string>('SSC CPO General Awareness Quiz');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('General Awareness');
  const [selectedLevel, setSelectedLevel] = useState<'exam-exact' | 'ncert-concept' | 'moderate' | 'hard'>('exam-exact');
  const [customChapterName, setCustomChapterName] = useState<string>('');
  const [selectedQuestionCount, setSelectedQuestionCount] = useState<number>(5);
  const [isGeneratingLive, setIsGeneratingLive] = useState<boolean>(false);

  const [selectedExam, setSelectedExam] = useState<ExamCategory | null>(null);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({});
  const [bookmarked, setBookmarked] = useState<Record<number, boolean>>({});
  const [questionTimes, setQuestionTimes] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [displayLanguage, setDisplayLanguage] = useState<'en' | 'hi'>('en');
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Exact Adda247 Modals & Views State
  const [showSubmitConfirmModal, setShowSubmitConfirmModal] = useState<boolean>(false);
  const [showPaletteDrawer, setShowPaletteDrawer] = useState<boolean>(false);
  const [resultSubView, setResultSubView] = useState<'summary' | 'leaderboard' | 'solutions'>('summary');
  const [reAttemptMode, setReAttemptMode] = useState<boolean>(false);
  const [reAttemptAnswers, setReAttemptAnswers] = useState<Record<number, number>>({});
  const [showSolutionExplanation, setShowSolutionExplanation] = useState<boolean>(true);
  const [attemptedTimestamp, setAttemptedTimestamp] = useState<string>('');

  // Question Error Report Modal State
  const [reportModalOpen, setReportModalOpen] = useState<boolean>(false);
  const [reportNote, setReportNote] = useState<string>('');
  const [reportSuccessMsg, setReportSuccessMsg] = useState<string | null>(null);

  // Track total time and per-question time
  useEffect(() => {
    let timer: any = null;
    if (selectedExam && !isSubmitted && !isPaused && !showSubmitConfirmModal && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
        setQuestionTimes(prev => ({
          ...prev,
          [currentIdx]: (prev[currentIdx] || 0) + 1
        }));
      }, 1000);
    } else if (timeLeft === 0 && selectedExam && !isSubmitted) {
      confirmAndSubmitTest();
    }
    return () => clearInterval(timer);
  }, [selectedExam, isSubmitted, isPaused, showSubmitConfirmModal, timeLeft, currentIdx]);

  // Auto-Sync Mistake Notebook helper
  const syncMistakesToNotebook = (exam: ExamCategory, userAns: Record<number, number>) => {
    try {
      const existing = JSON.parse(localStorage.getItem('hans_compain_mistake_notebook') || '[]');
      const newMistakes = exam.questions
        .map((q, qIdx) => ({ q, qIdx, selectedOpt: userAns[qIdx] }))
        .filter(item => item.selectedOpt !== undefined && item.selectedOpt !== item.q.correct)
        .map(({ q, selectedOpt }) => ({
          id: `mistake_${q.id}_${Date.now()}`,
          questionId: q.id,
          examTitle: exam.title,
          subject: q.subject || 'General Awareness',
          questionText: displayLanguage === 'hi' ? q.questionHi : q.question,
          options: displayLanguage === 'hi' && q.optionsHi ? q.optionsHi : q.options,
          correctOptionIdx: q.correct,
          userOptionIdx: selectedOpt,
          explanation: displayLanguage === 'hi' ? q.explanation : (q.explanationEn || q.explanation),
          createdAt: new Date().toISOString()
        }));

      if (newMistakes.length > 0) {
        localStorage.setItem('hans_compain_mistake_notebook', JSON.stringify([...newMistakes, ...existing]));
        window.dispatchEvent(new CustomEvent('hans_mistake_notebook_updated'));
      }
    } catch {
      // ignore
    }
  };

  // Helper: Retrieve seen competitive questions for zero-repetition
  const getSeenCompetitiveQuestions = (): string[] => {
    try {
      return JSON.parse(localStorage.getItem('hans_competitive_seen_questions') || '[]');
    } catch {
      return [];
    }
  };

  const recordSeenCompetitiveQuestions = (questions: MockQuestion[]) => {
    try {
      const existing = getSeenCompetitiveQuestions();
      const newSigs = questions.map(q => q.question.slice(0, 45));
      const combined = Array.from(new Set([...existing, ...newSigs])).slice(-150);
      localStorage.setItem('hans_competitive_seen_questions', JSON.stringify(combined));
    } catch {
      // ignore
    }
  };

  // LIVE AI COMPETITIVE SYLLABUS & TOPIC GENERATOR (STRICTLY COMPETITIVE EXAMS)
  const handleStartLiveExam = async (useChapterGenerator: boolean = false) => {
    setIsGeneratingLive(true);
    const targetSubject = selectedSubjectFilter === 'ALL' ? 'General Awareness' : selectedSubjectFilter;
    const examTitle = `${selectedSubExam}${customChapterName ? ` (${customChapterName})` : ''}`;

    try {
      const excludeQuestions = getSeenCompetitiveQuestions();
      const res = await fetch('/api/exam/generate-live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examCategory: selectedSubExam,
          subject: targetSubject,
          chapterName: customChapterName.trim(),
          qualityLevel: selectedLevel,
          count: selectedQuestionCount,
          language: displayLanguage,
          excludeQuestions
        })
      });

      const data = await res.json();
      if (data && data.success && Array.isArray(data.questions) && data.questions.length > 0) {
        const liveQuestions: MockQuestion[] = data.questions.map((q: any, idx: number) => ({
          id: q.id || `live_comp_${Date.now()}_${idx}`,
          subject: q.subject || targetSubject,
          question: q.question,
          questionHi: q.question,
          options: Array.isArray(q.options) ? q.options : ['Option A', 'Option B', 'Option C', 'Option D'],
          optionsHi: Array.isArray(q.options) ? q.options : ['Option A', 'Option B', 'Option C', 'Option D'],
          correct: typeof q.correct === 'number' ? q.correct : (typeof q.correctAnswer === 'number' ? q.correctAnswer : 0),
          explanation: q.explanation || 'Detailed TCS/NTA exam solution verified by Hans Compain AI.',
          explanationEn: q.explanation || 'Detailed TCS/NTA exam solution verified by Hans Compain AI.',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          avgTimeSec: q.avgTimeSec || 20,
          correctPct: q.correctPct || 65
        }));

        recordSeenCompetitiveQuestions(liveQuestions);

        const mins = Math.max(4, Math.ceil(liveQuestions.length * 0.8));
        const newExam: ExamCategory = {
          id: `live_exam_${Date.now()}`,
          title: examTitle,
          titleHi: examTitle,
          categoryTag: selectedCatId.toUpperCase(),
          questionsCount: liveQuestions.length,
          timeMinutes: mins,
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          questions: liveQuestions
        };

        launchExamSession(newExam);
        setIsGeneratingLive(false);
        return;
      }
    } catch (err) {
      console.warn('Live competitive generation error, fallback to curated bank:', err);
    }

    // Instant Syllabus Bank Fallback if offline
    let pool = [...gkBank, ...reasoningBank, ...englishBank, ...mathBank];
    if (selectedSubjectFilter !== 'ALL') {
      const filtered = pool.filter(q => q.subject.toLowerCase().includes(selectedSubjectFilter.toLowerCase()));
      if (filtered.length > 0) pool = filtered;
    }
    const sliced = pool.slice(0, selectedQuestionCount);
    const fallbackExam: ExamCategory = {
      id: `exam_${Date.now()}`,
      title: examTitle,
      titleHi: examTitle,
      categoryTag: selectedCatId.toUpperCase(),
      questionsCount: sliced.length,
      timeMinutes: Math.max(4, sliced.length),
      positiveMarks: 1.0,
      negativeMarks: 0.25,
      questions: sliced
    };
    launchExamSession(fallbackExam);
    setIsGeneratingLive(false);
  };

  const launchExamSession = (exam: ExamCategory) => {
    const now = new Date();
    const datePart = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
    const timePart = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();
    setAttemptedTimestamp(`${datePart} | ${timePart}`);

    setSelectedExam(exam);
    setTimeLeft(exam.timeMinutes * 60);
    setIsSubmitted(false);
    setAnswers({});
    setMarkedForReview({});
    setBookmarked({});
    setQuestionTimes({});
    setCurrentIdx(0);
    setShowSubmitConfirmModal(false);
    setShowPaletteDrawer(false);
    setResultSubView('summary');
    setReAttemptMode(false);
    setReAttemptAnswers({});

    recordStudyActivity(
      'CBT Test Started',
      exam.title,
      `Started ${exam.title} (${exam.questions.length} Qs)`,
      100
    );
  };

  const confirmAndSubmitTest = () => {
    if (!selectedExam) return;
    setShowSubmitConfirmModal(false);
    setIsSubmitted(true);
    setResultSubView('summary');
    syncMistakesToNotebook(selectedExam, answers);

    const stats = calculateDetailedScore();
    const total = selectedExam.questions.length * selectedExam.positiveMarks;
    const pct = Math.max(0, Math.round((stats.finalScore / total) * 100));

    recordStudyActivity(
      'CBT Test Completed',
      selectedExam.title,
      `Score: ${stats.finalScore}/${total} | Attempted: ${stats.attemptedCount}/${selectedExam.questions.length}`,
      pct
    );
  };

  const calculateDetailedScore = () => {
    if (!selectedExam) {
      return {
        correctCount: 0,
        wrongCount: 0,
        attemptedCount: 0,
        skippedCount: 0,
        rawScore: 0,
        negMarks: 0,
        finalScore: 0
      };
    }

    let correctCount = 0;
    let wrongCount = 0;

    selectedExam.questions.forEach((q, idx) => {
      const ans = answers[idx];
      if (ans !== undefined) {
        if (ans === q.correct) correctCount += 1;
        else wrongCount += 1;
      }
    });

    const attemptedCount = correctCount + wrongCount;
    const skippedCount = selectedExam.questions.length - attemptedCount;
    const rawScore = correctCount * selectedExam.positiveMarks;
    const negMarks = parseFloat((wrongCount * selectedExam.negativeMarks).toFixed(2));
    const finalScore = parseFloat((rawScore - negMarks).toFixed(2));

    return {
      correctCount,
      wrongCount,
      attemptedCount,
      skippedCount,
      rawScore,
      negMarks,
      finalScore
    };
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
          questionText: displayLanguage === 'hi' ? currentQ.questionHi : currentQ.question,
          category: selectedExam.title,
          userNote: reportNote || 'Student reported question/option issue from CBT screen.',
          reporterEmail: 'palhanslal4@gmail.com'
        })
      });
      setReportSuccessMsg('✅ रिपोर्ट ऑटोमैटिक एडमिन (hanscompain@gmail.com) को भेज दी गई है!');
      setTimeout(() => {
        setReportSuccessMsg(null);
        setReportModalOpen(false);
        setReportNote('');
      }, 2000);
    } catch {
      setReportSuccessMsg('✅ रिपोर्ट दर्ज कर ली गई है!');
      setTimeout(() => {
        setReportSuccessMsg(null);
        setReportModalOpen(false);
        setReportNote('');
      }, 2000);
    }
  };

  const formatTime = (seconds: number) => {
    const safeSec = Math.max(0, seconds);
    const mins = Math.floor(safeSec / 60);
    const secs = safeSec % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const currentQ = selectedExam ? selectedExam.questions[currentIdx] : null;
  const stats = calculateDetailedScore();

  // ============================================================================
  // 1. CONFIGURATION & LIVE AI CHAPTER-WISE GENERATOR SCREEN
  // ============================================================================
  if (!selectedExam) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 pb-12 text-white font-sans">
        {/* Top Banner */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 sm:p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
              Official Syllabus & Live AI Question Engine
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-white">
              सिंगल-स्क्रीन सीबीटी परीक्षा एवं चैप्टर-वाइज लाइव जनरेटर
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              बिना स्क्रॉलिंग (No-Scrolling) परीक्षा पेज • 100% सिलेबस के अनुसार लाइव प्रश्न • त्रुटि व 24h ईमेल अलर्ट सक्रिय
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setDisplayLanguage(displayLanguage === 'en' ? 'hi' : 'en')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 border border-slate-700 cursor-pointer"
            >
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>भाषा: {displayLanguage === 'en' ? 'English (Pure)' : 'हिन्दी (Pure)'}</span>
            </button>
          </div>
        </div>

        {/* Category Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {examCategoriesList.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCatId(cat.id);
                setSelectedSubExam(cat.exams[0]);
              }}
              className={`p-3 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                selectedCatId === cat.id
                  ? 'bg-emerald-500/15 border-emerald-400 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="truncate">{cat.name}</div>
            </button>
          ))}
        </div>

        {/* Standard Syllabus Exam Configuration */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-extrabold text-cyan-400 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span>1. आधिकारिक परीक्षा सिलेबस पैटर्न चुनें (Official Exam Pattern)</span>
            </h2>
            <span className="text-xs text-slate-400">Live Syllabus Synced</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400">परीक्षा (Exam Name):</label>
              <select
                value={selectedSubExam}
                onChange={e => setSelectedSubExam(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-white outline-none focus:border-cyan-400"
              >
                {(examCategoriesList.find(c => c.id === selectedCatId)?.exams || []).map(ex => (
                  <option key={ex} value={ex}>{ex}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400">विषय (Section / Subject):</label>
              <select
                value={selectedSubjectFilter}
                onChange={e => setSelectedSubjectFilter(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-white outline-none focus:border-cyan-400"
              >
                <option value="General Awareness">General Awareness (GK / GS)</option>
                <option value="General Intelligence & Reasoning">General Intelligence & Reasoning</option>
                <option value="English Language & Comprehension">English Language & Comprehension</option>
                <option value="Quantitative Aptitude">Quantitative Aptitude (Math)</option>
                <option value="ALL">Full Combined Syllabus</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400">प्रश्न क्वालिटी (Question Quality):</label>
              <select
                value={selectedLevel}
                onChange={e => setSelectedLevel(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-amber-400 outline-none focus:border-cyan-400"
              >
                <option value="exam-exact">🏆 Exam-Exact PYQ Standard</option>
                <option value="ncert-concept">📘 NCERT / Concept Foundation</option>
                <option value="moderate">⚡ Moderate Speed Booster</option>
                <option value="hard">🔥 Topper / Rank-Decider Hard</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400">प्रश्न संख्या (Questions):</label>
              <select
                value={selectedQuestionCount}
                onChange={e => setSelectedQuestionCount(parseInt(e.target.value, 10))}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-emerald-500/40 text-xs font-bold text-emerald-300 outline-none"
              >
                <option value={5}>5 Questions (4 Mins Quick Quiz)</option>
                <option value={10}>10 Questions (8 Mins Speed Quiz)</option>
                <option value={20}>20 Questions (15 Mins Sectional)</option>
                <option value={40}>40 Questions (30 Mins Standard)</option>
                <option value={50}>50 Questions (40 Mins Full Section)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-800">
            <div className="text-xs text-slate-400">
              नोट: बोर्ड परीक्षा (10th/12th) के प्रश्न केवल **Board Exam** सेक्शन या नीचे दिए गए **चैप्टर-वाइज जनरेटर** में ही खुलेंगे।
            </div>
            <button
              onClick={() => handleStartLiveExam(false)}
              disabled={isGeneratingLive}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-60 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <Zap className="w-4 h-4" />
              <span>{isGeneratingLive ? 'सिलेबस अनुसार लाइव प्रश्न बन रहे हैं...' : 'लाइव टेस्ट शुरू करें (Start Live Exam)'}</span>
            </button>
          </div>
        </div>

        {/* 2. FREE OPEN AI TOPIC & CHAPTER-WISE GENERATOR (COMPETITIVE EXAMS ONLY) */}
        <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-indigo-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>2. कोई भी टॉपिक या चैप्टर लिखें — ओपन AI लाइव जनरेटर (Any Custom Topic / Chapter / All Syllabus)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                कोई भी टॉपिक, अध्याय, विषय या कॉन्सेप्ट खुद से टाइप करें या 'सम्पूर्ण सिलेबस (All Syllabus)' चुनें — AI तुरंत लाइव नए प्रश्न बनाएगा।
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCustomChapterName('')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer transition-colors ${
                  !customChapterName
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                🌐 सम्पूर्ण सिलेबस (All Syllabus)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="sm:col-span-2 space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-300">
                  खुद से कोई भी टॉपिक / चैप्टर का नाम लिखें (Enter Any Custom Topic / Chapter / Subject Name):
                </label>
                {customChapterName && (
                  <button
                    onClick={() => setCustomChapterName('')}
                    className="text-[10px] text-rose-400 hover:underline cursor-pointer"
                  >
                    Clear (All Syllabus)
                  </button>
                )}
              </div>
              <input
                type="text"
                value={customChapterName}
                onChange={e => setCustomChapterName(e.target.value)}
                placeholder="जैसे: Percentage, Medieval History, Syllogism, Indian Constitution, Physics, या कोई भी टॉपिक..."
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-semibold text-white placeholder-slate-500 outline-none focus:border-indigo-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">लक्षित प्रतियोगी परीक्षा (Target Exam):</label>
              <select
                value={selectedSubExam}
                onChange={e => setSelectedSubExam(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-white outline-none"
              >
                <option value="SSC CPO General Awareness Quiz">SSC CPO / CGL Tier-1</option>
                <option value="SSC Stenographer Grade C & D">SSC Stenographer C & D</option>
                <option value="Railway RRB NTPC & ALP">Railway RRB NTPC / Group D</option>
                <option value="Banking IBPS PO & Clerk">Banking IBPS / SBI PO & Clerk</option>
                <option value="Bihar & UP Police SI/Constable">Bihar / UP Police Exam</option>
                <option value="State PSC & BSSC Exam">State PSC / BSSC Inter Level</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="text-xs text-slate-400">
              💡 <span className="text-slate-300 font-semibold">नॉन-रिपीटेड गारंटी:</span> हर बार नए, सिलेबस-सटीक प्रश्न तैयार होंगे।
            </div>

            <button
              onClick={() => handleStartLiveExam(true)}
              disabled={isGeneratingLive}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-extrabold text-xs flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>
                {isGeneratingLive
                  ? 'लाइव प्रश्न तैयार हो रहे हैं...'
                  : customChapterName
                  ? `⚡ "${customChapterName}" के प्रश्न जनरेट करें`
                  : '⚡ लाइव टेस्ट शुरू करें (Generate Live Test)'}
              </span>
            </button>
          </div>
        </div>

        {/* Notice Card for Board Exam Students */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-amber-300">
                10वीं एवं 12वीं बोर्ड परीक्षा (BSEB बिहार बोर्ड, CBSE, UP Board) छात्र?
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                बोर्ड परीक्षा का आधिकारिक 100/70/80 प्रश्न पैटर्न, OMR शीट एवं चैप्टर टेस्ट समर्पित 'Board Exam' सेक्शन में अलग से उपलब्ध है।
              </div>
            </div>
          </div>

          <button
            onClick={() => window.dispatchEvent(new CustomEvent('hans_navigate_view', { detail: 'board-exam' }))}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
          >
            <span>बोर्ड परीक्षा पोर्टल खोलें</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 2. ACTIVE TEST SCREEN — EXACT ADDA247 NO-SCROLLING SINGLE PAGE (SCREENSHOT 2)
  // ============================================================================
  if (!isSubmitted && currentQ) {
    const qText = cleanSingleLang(
      displayLanguage === 'hi' ? (currentQ.questionHi || currentQ.question) : currentQ.question,
      displayLanguage
    );
    const rawOpts = displayLanguage === 'hi' && currentQ.optionsHi ? currentQ.optionsHi : currentQ.options;

    return (
      <div className="fixed inset-0 z-50 h-dvh w-full overflow-hidden flex flex-col bg-white text-slate-900 font-sans select-none">
        {/* Top App Bar matching Screenshot 2 */}
        <div className="shrink-0 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="w-9 h-9 rounded-full bg-[#e11d48] text-white flex items-center justify-center shadow-sm hover:bg-rose-700 cursor-pointer shrink-0"
              title="Pause Test"
            >
              {isPaused ? <Play className="w-4 h-4 fill-white" /> : <Pause className="w-4 h-4 fill-white" />}
            </button>
            <div className="min-w-0">
              <h2 className="font-bold text-base sm:text-lg text-slate-900 truncate leading-tight">
                {currentQ.subject || selectedExam.title}
              </h2>
              <div className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                <span>Total Time left:</span>
                <span className="font-bold text-[#e11d48] tabular-nums">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setDisplayLanguage(displayLanguage === 'en' ? 'hi' : 'en')}
              className="px-3 py-1.5 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-extrabold cursor-pointer flex items-center gap-1.5 shadow-xs"
              title="टेस्ट की भाषा बदलें (Switch Test Language)"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>{displayLanguage === 'hi' ? 'हिन्दी (Active)' : 'English (Active)'}</span>
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

        {/* Sub-Bar: Question Type & Review Star matching Screenshot 2 */}
        <div className="shrink-0 px-4 py-2 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
            Question Type : Multiple Choice
          </span>
          <button
            onClick={() => setMarkedForReview(prev => ({ ...prev, [currentIdx]: !prev[currentIdx] }))}
            className="flex items-center gap-1 text-slate-700 font-semibold text-sm cursor-pointer hover:text-amber-600"
          >
            <span>Review</span>
            <Star
              className={`w-4 h-4 ${
                markedForReview[currentIdx] ? 'fill-amber-400 text-amber-500' : 'text-slate-600'
              }`}
            />
          </button>
        </div>

        {/* Question Number & +1.0 / -0.25 Row matching Screenshot 2 */}
        <div className="shrink-0 px-4 pt-2.5 pb-1 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center">
              {currentIdx + 1}
            </span>
            <span className="font-bold text-slate-900 text-sm sm:text-base">Question</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="px-2.5 py-0.5 rounded-full bg-[#e6f7ed] text-[#16a34a]">
              +{selectedExam.positiveMarks.toFixed(1)}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#fde8e8] text-[#e11d48]">
              -{selectedExam.negativeMarks.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Main Non-Scrolling Content Area: Question + 4 Options */}
        <div className="flex-1 flex flex-col justify-between px-4 py-2 overflow-hidden max-w-3xl w-full mx-auto">
          <div className="text-slate-900 font-medium text-sm sm:text-base leading-snug line-clamp-4">
            {qText}
          </div>

          <div className="space-y-2.5 my-auto py-2">
            {rawOpts.map((opt, optIdx) => {
              const letter = String.fromCharCode(65 + optIdx);
              const isSelected = answers[currentIdx] === optIdx;
              const cleanOpt = cleanSingleLang(opt, displayLanguage);

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
            <span className="font-bold text-slate-600 text-xs">
              Q {currentIdx + 1} / {selectedExam.questions.length}
            </span>
            <button
              onClick={() =>
                currentIdx < selectedExam.questions.length - 1 && setCurrentIdx(currentIdx + 1)
              }
              disabled={currentIdx === selectedExam.questions.length - 1}
              className="py-2 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs disabled:opacity-30 cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <span>Next (अगला) →</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Pinned Action Bar matching Screenshot 2 */}
        <div className="shrink-0 px-4 py-3 border-t border-slate-200 bg-white space-y-2.5 max-w-3xl w-full mx-auto">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setReportModalOpen(true)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-[#e11d48] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-rose-50 cursor-pointer"
            >
              <Flag className="w-4 h-4 text-[#e11d48]" />
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
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 bg-white text-slate-600 font-semibold text-xs sm:text-sm hover:bg-slate-50 cursor-pointer text-center"
            >
              Clear Response
            </button>
          </div>

          <button
            onClick={() => setShowSubmitConfirmModal(true)}
            className="w-full py-3 rounded-xl bg-[#9f1239] hover:bg-[#881337] text-white font-bold text-sm sm:text-base shadow-md cursor-pointer transition-colors"
          >
            Submit Test
          </button>
        </div>

        {/* Slide-Over Question Palette Drawer */}
        {showPaletteDrawer && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 flex justify-end">
            <div className="w-72 bg-white h-full p-4 flex flex-col justify-between shadow-2xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="font-bold text-sm text-slate-900">Question Palette</h3>
                  <button
                    onClick={() => setShowPaletteDrawer(false)}
                    className="p-1 rounded-lg hover:bg-slate-100"
                  >
                    <X className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {selectedExam.questions.map((_, qIdx) => {
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

        {/* EXACT "TEST SUMMARY" POPUP MODAL MATCHING SCREENSHOT 2 */}
        {showSubmitConfirmModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-4 animate-fade-in">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Test Summary</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Your responses are saved successfully!
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#eff6ff] text-slate-800 font-semibold border-b border-slate-200">
                      <th className="py-2.5 px-3">Section</th>
                      <th className="py-2.5 px-3">Attempted</th>
                      <th className="py-2.5 px-3">Skipped</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800">
                    <tr>
                      <td className="py-2.5 px-3">{currentQ.subject || 'General Awareness'}</td>
                      <td className="py-2.5 px-3">{stats.attemptedCount}</td>
                      <td className="py-2.5 px-3">{stats.skippedCount}</td>
                    </tr>
                    <tr className="font-semibold">
                      <td className="py-2.5 px-3">Total</td>
                      <td className="py-2.5 px-3">{stats.attemptedCount}</td>
                      <td className="py-2.5 px-3">{stats.skippedCount}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-3 rounded-xl bg-[#fffbeb] border border-amber-200/70 flex items-center gap-2.5 text-xs text-amber-700 font-medium">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Are you sure you want to submit the test?</span>
              </div>

              <div className="flex items-center justify-center gap-3 pt-1">
                <button
                  onClick={() => setShowSubmitConfirmModal(false)}
                  className="px-7 py-2.5 rounded-xl border border-slate-300 bg-white text-blue-600 font-bold text-sm hover:bg-slate-50 cursor-pointer"
                >
                  No
                </button>
                <button
                  onClick={confirmAndSubmitTest}
                  className="px-7 py-2.5 rounded-xl bg-[#f43f5e] hover:bg-rose-600 text-white font-bold text-sm shadow-md cursor-pointer"
                >
                  Submit Test
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Question Error Report Modal */}
        {reportModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
            <div className="bg-white text-slate-900 w-full max-w-sm rounded-2xl p-5 shadow-2xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-rose-600 flex items-center gap-1.5">
                  <Flag className="w-4 h-4" /> Report Question Problem
                </h3>
                <button onClick={() => setReportModalOpen(false)} className="p-1">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>
              <textarea
                value={reportNote}
                onChange={e => setReportNote(e.target.value)}
                placeholder="गलत प्रश्न या विकल्प की समस्या लिखें (सीधे एडमिन को ऑटो-ईमेल जाएगा)..."
                rows={3}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs outline-none"
              />
              {reportSuccessMsg && (
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold text-center">
                  {reportSuccessMsg}
                </div>
              )}
              <button
                onClick={handleReportSubmit}
                className="w-full py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs cursor-pointer"
              >
                Send Auto-Alert to Admin
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ============================================================================
  // 3. INTERACTIVE VIEW SOLUTIONS SINGLE-SCREEN PAGE (MATCHING SCREENSHOT 1)
  // ============================================================================
  if (isSubmitted && resultSubView === 'solutions' && currentQ) {
    const qText = cleanSingleLang(
      displayLanguage === 'hi' ? (currentQ.questionHi || currentQ.question) : currentQ.question,
      displayLanguage
    );
    const rawOpts = displayLanguage === 'hi' && currentQ.optionsHi ? currentQ.optionsHi : currentQ.options;
    const activeUserAns = reAttemptMode ? reAttemptAnswers[currentIdx] : answers[currentIdx];
    const showAnswerHighlight = !reAttemptMode || reAttemptAnswers[currentIdx] !== undefined;
    const correctLetter = String.fromCharCode(97 + currentQ.correct);
    const correctOptionText = cleanSingleLang(rawOpts[currentQ.correct] || '', displayLanguage);
    const userSpentSec = questionTimes[currentIdx] || 22;
    const avgSec = currentQ.avgTimeSec || 15;
    const peerCorrectPct = currentQ.correctPct ?? 64;

    return (
      <div className="fixed inset-0 z-50 h-dvh w-full overflow-hidden flex flex-col bg-white text-slate-900 font-sans">
        {/* Top Row 1: Back Arrow + Exam Title + Re-Attempt Toggle Switch (Screenshot 1) */}
        <div className="shrink-0 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={() => setResultSubView('summary')}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-800 cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="font-bold text-sm sm:text-base text-slate-900 truncate">
              {selectedExam.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs sm:text-sm font-medium text-slate-700">Re-Attempt</span>
            <button
              onClick={() => {
                setReAttemptMode(!reAttemptMode);
                setReAttemptAnswers({});
              }}
              className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
                reAttemptMode ? 'bg-emerald-500' : 'bg-slate-200'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                  reAttemptMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Top Row 2: Subject Name + Language Switcher + Menu Icon (Screenshot 1) */}
        <div className="shrink-0 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
          <span className="font-bold text-sm sm:text-base text-slate-800">
            {currentQ.subject || 'General Awareness'}
          </span>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setDisplayLanguage(displayLanguage === 'en' ? 'hi' : 'en')}
              className="px-2 py-1 rounded-md border border-slate-300 text-slate-700 text-xs font-bold cursor-pointer"
            >
              A|अ
            </button>
            <button
              onClick={() => setShowPaletteDrawer(!showPaletteDrawer)}
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Row 3: Red Stopwatch + You : 00:22 + Avg : 00:00 + Green Peer % (Screenshot 1) */}
        <div className="shrink-0 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Timer className="w-5 h-5 text-[#e11d48]" />
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
              You : {formatTime(userSpentSec)}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
              Avg : {formatTime(avgSec)}
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[#e6f7ed] text-[#16a34a] text-xs font-bold flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>{peerCorrectPct}%</span>
          </span>
        </div>

        {/* Row 4: [1] Question + Mark Pill + Bookmark Icon (Screenshot 1) */}
        <div className="shrink-0 px-4 py-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center">
              {currentIdx + 1}
            </span>
            <span className="font-bold text-slate-900 text-sm">Question</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                activeUserAns === currentQ.correct
                  ? 'bg-[#e6f7ed] text-[#16a34a]'
                  : 'bg-[#fde8e8] text-[#e11d48]'
              }`}
            >
              {activeUserAns === currentQ.correct
                ? `+${selectedExam.positiveMarks.toFixed(2)}`
                : `-${selectedExam.negativeMarks.toFixed(2)}`}
            </span>
            <button
              onClick={() => setBookmarked(prev => ({ ...prev, [currentIdx]: !prev[currentIdx] }))}
              className="text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              <Bookmark
                className={`w-4 h-4 ${bookmarked[currentIdx] ? 'fill-slate-800 text-slate-800' : ''}`}
              />
            </button>
          </div>
        </div>

        {/* Center Question + Options + View Solution Area (Fits cleanly without full-page scroll) */}
        <div className="flex-1 flex flex-col justify-between px-4 py-1.5 overflow-y-auto max-w-3xl w-full mx-auto">
          <div className="text-slate-900 font-medium text-sm sm:text-base leading-snug">
            {qText}
          </div>

          {/* 4 Options with exact Green Correct & Red Wrong badges from Screenshot 1 */}
          <div className="space-y-2 my-1.5">
            {rawOpts.map((opt, optIdx) => {
              const letter = String.fromCharCode(65 + optIdx);
              const cleanOpt = cleanSingleLang(opt, displayLanguage);
              const isCorrectOpt = optIdx === currentQ.correct;
              const isUserWrongOpt =
                showAnswerHighlight && activeUserAns === optIdx && optIdx !== currentQ.correct;

              let cardClasses = 'bg-[#f8fafc] border-transparent text-slate-800';
              let circleClasses = 'bg-white border border-slate-200 text-slate-700';

              if (showAnswerHighlight && isCorrectOpt) {
                cardClasses = 'bg-[#dcfce7]/80 border-[#86efac] text-slate-900';
                circleClasses = 'bg-[#16a34a] text-white';
              } else if (isUserWrongOpt) {
                cardClasses = 'bg-[#ffe4e6]/80 border-[#fda4af] text-slate-900';
                circleClasses = 'bg-[#e11d48] text-white';
              }

              return (
                <div
                  key={optIdx}
                  onClick={() => {
                    if (reAttemptMode) {
                      setReAttemptAnswers(prev => ({ ...prev, [currentIdx]: optIdx }));
                    }
                  }}
                  className={`w-full py-2.5 px-3.5 rounded-xl border text-left text-sm font-medium flex items-center justify-between gap-3 ${cardClasses} ${
                    reAttemptMode ? 'cursor-pointer' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${circleClasses}`}
                    >
                      {letter}
                    </span>
                    <span className="truncate sm:whitespace-normal">{cleanOpt}</span>
                  </div>

                  {showAnswerHighlight && isCorrectOpt && (
                    <div className="flex flex-col items-center shrink-0 text-[#16a34a]">
                      <CheckCircle2 className="w-4 h-4 fill-[#16a34a] text-white" />
                      <span className="text-[9px] font-bold">Correct</span>
                    </div>
                  )}

                  {isUserWrongOpt && (
                    <div className="flex flex-col items-center shrink-0 text-[#e11d48]">
                      <XCircle className="w-4 h-4 fill-[#e11d48] text-white" />
                      <span className="text-[9px] font-bold">Wrong</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* View Solution Collapsible Block matching Screenshot 1 */}
          <div className="pt-1">
            <div className="flex items-center justify-between border-b border-slate-200">
              <button
                onClick={() => setShowSolutionExplanation(!showSolutionExplanation)}
                className="pb-1.5 border-b-2 border-blue-600 text-blue-600 font-semibold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>View Solution</span>
                {showSolutionExplanation ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>

              <div className="flex items-center gap-1.5 pb-1">
                <button
                  onClick={() => currentIdx > 0 && setCurrentIdx(currentIdx - 1)}
                  disabled={currentIdx === 0}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold disabled:opacity-40 cursor-pointer"
                >
                  ← Prev
                </button>
                <span className="text-xs font-bold text-slate-500">
                  {currentIdx + 1}/{selectedExam.questions.length}
                </span>
                <button
                  onClick={() =>
                    currentIdx < selectedExam.questions.length - 1 && setCurrentIdx(currentIdx + 1)
                  }
                  disabled={currentIdx === selectedExam.questions.length - 1}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold disabled:opacity-40 cursor-pointer"
                >
                  Next →
                </button>
              </div>
            </div>

            {showSolutionExplanation && (
              <div className="pt-2 text-xs sm:text-sm text-slate-900 space-y-0.5 leading-snug">
                <p className="font-bold">
                  The Correct Answer is:({correctLetter}) {correctOptionText}
                </p>
                <p className="font-bold">Explanation:</p>
                <p className="text-slate-700 line-clamp-3">
                  {displayLanguage === 'hi'
                    ? currentQ.explanation
                    : currentQ.explanationEn || currentQ.explanation}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Pinned Footer Bar matching Screenshot 1: [Report] | [Test Summary] */}
        <div className="shrink-0 px-4 py-2.5 border-t border-slate-200 bg-white flex items-center gap-3 max-w-3xl w-full mx-auto">
          <button
            onClick={() => setReportModalOpen(true)}
            className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-[#e11d48] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-rose-50 cursor-pointer"
          >
            <Flag className="w-4 h-4 text-[#e11d48]" />
            <span>Report</span>
          </button>

          <button
            onClick={() => setResultSubView('summary')}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 bg-white text-blue-600 font-bold text-xs sm:text-sm hover:bg-blue-50 cursor-pointer text-center"
          >
            Test Summary
          </button>
        </div>

        {/* Report Modal */}
        {reportModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
            <div className="bg-white text-slate-900 w-full max-w-sm rounded-2xl p-5 shadow-2xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-rose-600 flex items-center gap-1.5">
                  <Flag className="w-4 h-4" /> Report Question Problem
                </h3>
                <button onClick={() => setReportModalOpen(false)} className="p-1">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>
              <textarea
                value={reportNote}
                onChange={e => setReportNote(e.target.value)}
                placeholder="प्रश्न या उत्तर में समस्या लिखें..."
                rows={3}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs outline-none"
              />
              {reportSuccessMsg && (
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold text-center">
                  {reportSuccessMsg}
                </div>
              )}
              <button
                onClick={handleReportSubmit}
                className="w-full py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs cursor-pointer"
              >
                Send Auto-Alert to Admin
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ============================================================================
  // 4. OVERALL PERFORMANCE SUMMARY & LEADERBOARD SCREEN (SCREENSHOTS 3 & 4)
  // ============================================================================
  const totalMaxMarks = selectedExam.questions.length * selectedExam.positiveMarks;
  const timeSpentSec = Math.max(1, selectedExam.timeMinutes * 60 - timeLeft);
  const accuracyVal =
    stats.attemptedCount > 0
      ? ((stats.correctCount / stats.attemptedCount) * 100).toFixed(1)
      : '0.0';
  const percentileVal = Math.max(
    6.5,
    Math.min(99.8, parseFloat(((Math.max(0, stats.finalScore) / totalMaxMarks) * 95 + 6.5).toFixed(1)))
  );
  const calculatedRank = stats.finalScore >= totalMaxMarks * 0.8 ? 4 : 59;

  return (
    <div className="fixed inset-0 z-50 h-dvh w-full overflow-hidden flex flex-col bg-white text-slate-900 font-sans">
      {/* Top Header matching Screenshots 3 & 4 */}
      <div className="shrink-0 px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setSelectedExam(null)}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-800 cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h2 className="font-bold text-sm sm:text-base text-slate-900 truncate">
              {selectedExam.title}
            </h2>
            <p className="text-[11px] text-slate-500">Attempted on : {attemptedTimestamp}</p>
          </div>
        </div>

        {/* Toggle between Summary (Screenshot 3) & Leaderboard (Screenshot 4) without scrolling */}
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

      {/* Main Content Area — No Full Page Scroll */}
      <div className="flex-1 overflow-y-auto px-4 py-2.5 max-w-2xl w-full mx-auto flex flex-col justify-between">
        {resultSubView === 'summary' ? (
          <div className="space-y-2.5 my-auto">
            <h3 className="font-bold text-sm sm:text-base text-slate-900">
              Overall Performance Summary
            </h3>

            {/* Score Card matching Screenshot 3 */}
            <div className="p-3.5 rounded-2xl bg-[#f2fbf6] flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full border-4 border-[#10b981] flex items-center justify-center bg-white">
                  <CheckCircle2 className="w-6 h-6 text-[#10b981]" />
                </div>
                <div>
                  <div className="text-lg font-extrabold text-slate-900">
                    {stats.finalScore}{' '}
                    <span className="text-slate-400 font-normal">| {totalMaxMarks}</span>
                  </div>
                  <div className="text-xs text-slate-600 font-medium">Your Score</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-[#f43f5e] text-white text-[11px] font-bold">
                Neg. Marks : - {stats.negMarks.toFixed(2)}
              </span>
            </div>

            {/* Time Spent Card matching Screenshot 3 */}
            <div className="p-3.5 rounded-2xl bg-[#f8f5ff] flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full border-4 border-[#a855f7] flex items-center justify-center bg-white">
                <Timer className="w-6 h-6 text-[#a855f7]" />
              </div>
              <div>
                <div className="text-lg font-extrabold text-slate-900">
                  {formatTime(timeSpentSec)}{' '}
                  <span className="text-slate-400 font-normal">
                    | {formatTime(selectedExam.timeMinutes * 60)}
                  </span>
                </div>
                <div className="text-xs text-slate-600 font-medium">Time Spent</div>
              </div>
            </div>

            {/* 3 Vertical Metric Cards matching Screenshot 3 (Your Rank, Percentile, Accuracy) */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 rounded-2xl bg-[#fefce8] flex flex-col justify-between space-y-3">
                <div className="w-10 h-10 rounded-full border-4 border-[#facc15] bg-white flex items-center justify-center">
                  <Star className="w-5 h-5 text-[#eab308] fill-[#eab308]" />
                </div>
                <div>
                  <div className="text-sm sm:text-base font-extrabold text-slate-900">
                    {calculatedRank} <span className="text-slate-400 font-normal">| 62</span>
                  </div>
                  <div className="text-[11px] text-slate-600 font-medium mt-0.5">Your Rank</div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#fff1f2] flex flex-col justify-between space-y-3">
                <div className="w-10 h-10 rounded-full border-4 border-[#f43f5e] bg-white flex items-center justify-center text-[#f43f5e] font-extrabold text-xs">
                  %
                </div>
                <div>
                  <div className="text-sm sm:text-base font-extrabold text-slate-900">
                    {percentileVal} <span className="text-slate-400 font-normal">| 100</span>
                  </div>
                  <div className="text-[11px] text-slate-600 font-medium mt-0.5">Percentile</div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#f0f7ff] flex flex-col justify-between space-y-3">
                <div className="w-10 h-10 rounded-full border-4 border-[#2563eb] bg-white flex items-center justify-center text-[#2563eb] font-extrabold text-xs">
                  ◎
                </div>
                <div>
                  <div className="text-sm sm:text-base font-extrabold text-slate-900">
                    {accuracyVal} <span className="text-slate-400 font-normal">| 100</span>
                  </div>
                  <div className="text-[11px] text-slate-600 font-medium mt-0.5">Accuracy</div>
                </div>
              </div>
            </div>

            {/* Share & Re-Attempt Row matching Screenshot 3 */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator
                      .share({
                        title: selectedExam.title,
                        text: `Scored ${stats.finalScore}/${totalMaxMarks} in ${selectedExam.title}!`
                      })
                      .catch(() => {});
                  }
                }}
                className="py-2.5 rounded-xl border border-slate-300 bg-white text-[#f43f5e] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer hover:bg-rose-50"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>

              <button
                onClick={() => handleStartLiveExam(false)}
                className="py-2.5 rounded-xl bg-[#f43f5e] hover:bg-rose-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <span>Re-Attempt</span>
              </button>
            </div>

            {/* Sectional Summary matching Screenshot 3 */}
            <div className="pt-2 space-y-2 border-t border-slate-100">
              <h4 className="font-bold text-sm text-slate-900">Sectional Summary</h4>
              <div className="border-b border-slate-200">
                <span className="inline-block pb-1.5 border-b-2 border-[#f43f5e] text-[#f43f5e] font-semibold text-xs">
                  {selectedExam.questions[0]?.subject || 'General Awareness'}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-[#f2fbf6] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full border-4 border-[#10b981] flex items-center justify-center bg-white">
                    <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
                  </div>
                  <div>
                    <div className="text-base font-extrabold text-slate-900">
                      {stats.finalScore}{' '}
                      <span className="text-slate-400 font-normal">| {totalMaxMarks}</span>
                    </div>
                    <div className="text-[11px] text-slate-600">Your Score</div>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-md bg-[#f43f5e] text-white text-[10px] font-bold">
                  Neg. Marks : - {stats.negMarks.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* LEADERBOARD VIEW MATCHING SCREENSHOT 4 */
          <div className="flex-1 flex flex-col justify-between py-1">
            <div className="space-y-1.5">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 mb-2">Leaderboard</h3>
              <div className="space-y-1.5">
                {leaderboardPeers.map(peer => {
                  const peerScore = (totalMaxMarks * peer.ratio).toFixed(2);
                  return (
                    <div
                      key={peer.rank}
                      className="py-1.5 px-2.5 rounded-xl flex items-center justify-between hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold flex items-center justify-center">
                          {peer.rank}
                        </span>
                        <div className="w-8 h-8 rounded-lg bg-[#e0f2fe] text-[#0284c7] font-bold text-xs flex items-center justify-center">
                          {peer.avatar}
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-slate-800">
                          {peer.name}
                        </span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                        {peerScore}/{totalMaxMarks}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Highlighted Current User Card matching Screenshot 4 */}
            <div className="p-3 rounded-2xl bg-[#e0f2fe]/70 border border-sky-200 flex items-center justify-between mt-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1d63dc] text-white font-bold text-sm flex items-center justify-center">
                  H
                </div>
                <div>
                  <h4 className="font-bold text-[#1d63dc] text-sm">Hanslal pal</h4>
                  <p className="text-xs text-[#1d63dc] font-medium">
                    Well done! Keep Practicing.
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-0.5 rounded-full bg-white border border-slate-400 text-slate-800 font-bold text-xs">
                  {stats.finalScore.toFixed(2)}/{totalMaxMarks}
                </span>
                <span className="block text-[11px] text-slate-500 mt-0.5">
                  Rank : {calculatedRank}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pinned Bottom Full-Width Blue "View Solutions" Button matching Screenshots 3 & 4 */}
      <div className="shrink-0 p-3 border-t border-slate-100 bg-white max-w-2xl w-full mx-auto">
        <button
          onClick={() => {
            setCurrentIdx(0);
            setResultSubView('solutions');
          }}
          className="w-full py-3.5 rounded-xl bg-[#1d63dc] hover:bg-blue-700 text-white font-bold text-sm sm:text-base shadow-md cursor-pointer transition-colors"
        >
          View Solutions
        </button>
      </div>
    </div>
  );
};
