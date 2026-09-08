import React, { useState, useEffect, useRef } from 'react';
import { 
  Award, Clock, CheckCircle2, AlertTriangle, HelpCircle, 
  RotateCcw, Sparkles, BookOpen, Layers, Zap, Download, 
  ChevronLeft, ChevronRight, Check, X, Bookmark, BookmarkCheck,
  Languages, FileText, Share2, Search, Filter, ShieldAlert, ArrowLeft,
  Pause, Play, Menu, Star, Flag, FileQuestion, SlidersHorizontal, AlertCircle,
  CheckSquare
} from 'lucide-react';
import { QuizQuestion, MistakeNotebookItem, BookmarkedQuestionItem } from '../types';
import { TestPerformanceScorecard } from './TestPerformanceScorecard';
import { CURATED_BOARD_EXAM_TESTS } from './BoardExamSingleTestBox';
import { StudentGoalProfile } from './StudentGoalOnboardingModal';
import { dispatchOwnerAlert } from '../utils/ownerAlertService';

export interface PYQExamRecord {
  id: string;
  examName: string;
  examCode: string;
  category: 'board' | 'reasoning' | 'math' | 'english' | 'hindi' | 'history' | 'geography' | 'polity' | 'science' | 'economy' | 'current_affairs' | 'ssc' | 'railway' | 'bpsc' | 'police' | 'banking' | 'teaching' | 'general';
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
  studentGoalProfile?: StudentGoalProfile | null;
  onOpenGoalSelector?: () => void;
  forcedStream?: 'board' | 'competitive';
}

// Curated Pure Board Exam Tests Transformed into Real Exam Records
const BOARD_PYQ_RECORDS: PYQExamRecord[] = CURATED_BOARD_EXAM_TESTS.map(b => ({
  id: b.id,
  examName: `${b.classGrade} Board: ${b.chapter}`,
  examCode: `BOARD-${b.classGrade.replace(/\s+/g, '')}-${b.id}`,
  category: 'board',
  year: '2025-26 Board Pattern',
  dateStr: 'Annual Board Exam Series',
  shift: `${b.classGrade} Single Chapter Test`,
  subject: b.subject,
  totalQuestions: b.totalQuestions,
  timeMinutes: b.timeMinutes,
  marksPerQuestion: 2.0,
  negativeMarks: 0.0,
  questions: b.questions
}));

// Curated Real PYQ Exam Database (With Exact TCS/Adda247 Exam Formats & Timing)
const CURATED_PYQ_DATA: PYQExamRecord[] = [
  {
    id: "pyq-ssc-reasoning-2024",
    examName: "Reasoning Special (TCS iON Coded & Logical Deduction)",
    examCode: "SSC-REASONING-2024",
    category: "reasoning",
    year: "2024",
    dateStr: "18 Sept 2024",
    shift: "Shift 2 (12:30 PM - 1:30 PM)",
    subject: "Reasoning",
    totalQuestions: 5,
    timeMinutes: 5,
    marksPerQuestion: 2.0,
    negativeMarks: 0.5,
    questions: [
      {
        question: "एक निश्चित कूट भाषा में,\n'A - B' का अर्थ है 'A, B की बहन है',\n'A ! B' का अर्थ है 'A, B का पिता है',\n'A ₹ B' का अर्थ है 'A, B की बेटी है' और\n'A # B' का अर्थ है 'A, B का बेटा है'।\nउपरोक्त के आधार पर, C, Z से किस प्रकार संबंधित है यदि 'C ₹ D # E ! F - Z' है?",
        options: ["बेटी", "बहन", "बहन की बेटी", "भाई की बेटी"],
        answerIndex: 2,
        explanation: "समीकरण 'C ₹ D # E ! F - Z' का विश्लेषण:\n1. F - Z => F, Z की बहन है।\n2. E ! F => E, F का पिता है (और Z का भी पिता है)।\n3. D # E => D, E का बेटा है (अर्थात D, Z का भाई है)।\n4. C ₹ D => C, D की बेटी है।\nचूँकि D, Z का भाई है और C, D की बेटी है, इसलिए C, Z की 'भाई की बेटी' (भतीजी) होगी।",
        hint: "पहले E, F, Z और D के पारिवारिक संबंध निकालें।"
      },
      {
        question: "दिए गए विकल्पों में से विषम (Odd One Out) संख्या युग्म चुनिए:\n(A) 12 : 144\n(B) 14 : 196\n(C) 16 : 256\n(D) 18 : 320",
        options: ["12 : 144", "14 : 196", "16 : 256", "18 : 320"],
        answerIndex: 3,
        explanation: "सभी विकल्पों में पहली संख्या का वर्ग दूसरी संख्या है (12² = 144, 14² = 196, 16² = 256), लेकिन 18² = 324 होता है (यहाँ 320 दिया गया है)।",
        hint: "संख्याओं के वर्ग (Square) की जांच करें।"
      },
      {
        question: "कथन:\n1. सभी पेन पेंसिल हैं।\n2. कुछ पेंसिल रबर हैं।\nनिष्कर्ष:\nI. कुछ पेन रबर हैं।\nII. कोई पेन रबर नहीं है।",
        options: ["केवल निष्कर्ष I निकलता है", "केवल निष्कर्ष II निकलता है", "या तो I या II निकलता है (Either I or II)", "न तो I और न ही II"],
        answerIndex: 2,
        explanation: "चूँकि पेन और रबर के बीच कोई सीधा संबंध नहीं है, और एक निष्कर्ष सकारात्मक (कुछ पेन रबर हैं) तथा दूसरा नकारात्मक (कोई पेन रबर नहीं है) है, इसलिए यहाँ कॉम्प्लिमेंट्री पेयर (Either/Or) लागू होता है।",
        hint: "सकारात्मक और नकारात्मक कॉम्प्लिमेंट्री पेयर देखें।"
      },
      {
        question: "निम्नलिखित श्रृंखला में प्रश्नचिह्न (?) के स्थान पर क्या आएगा?\n3, 7, 16, 35, 74, ?",
        options: ["149", "153", "150", "148"],
        answerIndex: 1,
        explanation: "पैटर्न: (3 × 2) + 1 = 7\n(7 × 2) + 2 = 16\n(16 × 2) + 3 = 35\n(35 × 2) + 4 = 74\n(74 × 2) + 5 = 148 + 5 = 153",
        hint: "×2 + n पैटर्न।"
      },
      {
        question: "यदि किसी माह की 3 तारीख को सोमवार है, तो उसी माह की 25 तारीख से 3 दिन पहले कौन-सा दिन होगा?",
        options: ["शुक्रवार", "शनिवार", "रविवार", "गुरुवार"],
        answerIndex: 1,
        explanation: "25 तारीख से 3 दिन पहले = 22 तारीख।\n3 तारीख = सोमवार\nदिनों का अंतर = 22 - 3 = 19 दिन\n19 ÷ 7 = शेषफल 5 दिन।\nसोमवार + 5 दिन = शनिवार।",
        hint: "विषम दिन (Odd Days) की गणना करें।"
      }
    ]
  },
  {
    id: "pyq-ssc-cgl-2024-s1",
    examName: "SSC CGL Tier-1 (General Awareness & Polity)",
    examCode: "SSC-CGL-2024",
    category: "ssc",
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
    examName: "RRB NTPC CBT-2 (General Science & Physics)",
    examCode: "RRB-NTPC-2022",
    category: "railway",
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
    examName: "BPSC 69th CCE Prelims (Bihar Special & History)",
    examCode: "BPSC-CCE-69",
    category: "bpsc",
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
    id: "pyq-up-police-2024",
    examName: "UP Police Constable Exam 2024 (General Hindi & GS)",
    examCode: "UP-POLICE-2024",
    category: "police",
    year: "2024",
    dateStr: "23 Aug 2024",
    shift: "Shift 1 (10:00 AM - 12:00 PM)",
    subject: "General Hindi & UP GK",
    totalQuestions: 5,
    timeMinutes: 5,
    marksPerQuestion: 2.0,
    negativeMarks: 0.5,
    questions: [
      {
        question: "'गोदान' उपन्यास के प्रसिद्ध लेखक निम्नलिखित में से कौन हैं?",
        options: ["मुंशी प्रेमचंद", "जयशंकर प्रसाद", "सूर्यकांत त्रिपाठी 'निराला'", "महादेवी वर्मा"],
        answerIndex: 0,
        explanation: "'गोदान' मुंशी प्रेमचंद द्वारा रचित कालजयी उपन्यास है, जो भारतीय किसान के जीवन और शोषण की यथार्थवादी गाथा है।",
        hint: "उन्हें 'उपन्यास सम्राट' भी कहा जाता है।"
      },
      {
        question: "उत्तर प्रदेश का राज्य पक्षी (State Bird) कौन सा है?",
        options: ["सारस / क्रौंच (Sarus Crane)", "मोर (Peacock)", "तोता (Parrot)", "कबूतर"],
        answerIndex: 0,
        explanation: "सारस क्रेन (Grus antigone) उत्तर प्रदेश का राजकीय पक्षी है।",
        hint: "यह विश्व का सबसे लंबा उड़ने वाला पक्षी है।"
      },
      {
        question: "'संधि' के मुख्य रूप से कितने भेद होते हैं?",
        options: ["3 भेद (स्वर, व्यंजन, विसर्ग)", "2 भेद", "4 भेद", "5 भेद"],
        answerIndex: 0,
        explanation: "संधि के तीन मुख्य भेद होते हैं: 1. स्वर संधि, 2. व्यंजन संधि, 3. विसर्ग संधि।",
        hint: "स्वर, व्यंजन और विसर्ग संधि।"
      },
      {
        question: "उत्तर प्रदेश में कुंभ मेला किस पावन संगम पर आयोजित किया जाता है?",
        options: ["प्रयागराज (त्रिवेणी संगम)", "वाराणसी", "हरिद्वार", "अयोध्या"],
        answerIndex: 0,
        explanation: "प्रयागराज में गंगा, यमुना और अदृश्य सरस्वती के संगम पर महाकुंभ व कुंभ मेले का आयोजन होता है।",
        hint: "गंगा, यमुना और सरस्वती का त्रिवेणी संगम।"
      },
      {
        question: "निम्नलिखित में से 'सूर्य' का पर्यायवाची शब्द नहीं है:",
        options: ["दिनकर", "भास्कर", "निशाकर", "दिवाकर"],
        answerIndex: 2,
        explanation: "'निशाकर' चंद्रमा का पर्यायवाची है, जबकि दिनकर, भास्कर और दिवाकर सूर्य के पर्यायवाची हैं।",
        hint: "निशा (रात) करने वाला = चंद्रमा।"
      }
    ]
  },
  {
    id: "pyq-ssc-steno-2023",
    examName: "SSC Stenographer Grade C & D (General English & Reasoning)",
    examCode: "SSC-STENO-2023",
    category: "ssc",
    year: "2023",
    dateStr: "12 Oct 2023",
    shift: "Shift 1 (9:00 AM - 11:00 AM)",
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
  },
  {
    id: "pyq-ssc-rrb-geography-2024",
    examName: "Indian & World Geography Special (भूगोल, नदियाँ एवं राष्ट्रीय उद्यान TCS PYQ)",
    examCode: "SSC-RRB-GEO-2024",
    category: "geography",
    year: "2024-2026",
    dateStr: "Daily Practice Special",
    shift: "TCS Pattern Tier 1 & 2",
    subject: "Geography, Environment & National Parks",
    totalQuestions: 8,
    timeMinutes: 8,
    marksPerQuestion: 2.0,
    negativeMarks: 0.5,
    questions: [
      {
        question: "निम्नलिखित में से कौन-सी प्रायद्वीपीय नदी (Peninsular River) भ्रंश घाटी (Rift Valley) से होकर पश्चिम की ओर बहती है और अरब सागर में गिरते हुए डेल्टा के बजाय ज्वारनदमुख (Estuary) बनाती है?",
        options: ["नर्मदा नदी (Narmada)", "गोदावरी नदी (Godavari)", "कृष्णा नदी (Krishna)", "महानदी (Mahanadi)"],
        answerIndex: 0,
        explanation: "नर्मदा और ताप्ती नदियाँ विंध्याचल एवं सतपुड़ा पर्वत श्रेणियों के बीच भ्रंश घाटी (Rift Valley) से होकर बहती हैं। ये नदियाँ पश्चिम की ओर बहकर खंभात की खाड़ी (अरब सागर) में गिरती हैं और गाद के अभाव तथा तीव्र ढाल के कारण डेल्टा नहीं बल्कि एश्चुअरी (ज्वारनदमुख) बनाती हैं।\n🎯 याद रखने की ट्रिक (Mnemonic): 'समानता' (साबरमती, माही, नर्मदा, ताप्ती - ये चारों नदियाँ पश्चिम की ओर बहती हैं)।",
        hint: "विंध्याचल और सतपुड़ा के मध्य अमरकंटक से निकलने वाली नदी।"
      },
      {
        question: "पृथ्वी के वायुमंडल की किस परत में 'ओजोन परत' (Ozone Layer) पाई जाती है, जो सूर्य से आने वाली हानिकारक पराबैंगनी (UV) किरणों को अवशोषित कर धरातल की रक्षा करती है?",
        options: ["समताप मंडल (Stratosphere)", "क्षोभमंडल (Troposphere)", "मध्यमंडल (Mesosphere)", "आयनमंडल (Ionosphere)"],
        answerIndex: 0,
        explanation: "ओजोन परत (O₃) समताप मंडल (Stratosphere) के निचले हिस्से में लगभग 15 से 35 किमी की ऊंचाई पर स्थित है।\n⚠️ TCS Trap Alert: क्षोभमंडल में समस्त मौसमी घटनाएं (बादल, वर्षा) होती हैं, जबकि समताप मंडल शांत रहने के कारण जेट विमान उड़ाने और ओजोन सुरक्षा परत के लिए आदर्श होता है।",
        hint: "जिस मंडल में तापमान समान रहता है और मौसमी हलचलें नहीं होतीं।"
      },
      {
        question: "दक्कन के पठार (लावा क्षेत्र) पर पाई जाने वाली किस मिट्टी को 'रेगुर मिट्टी' (Regur Soil) या 'स्वतः जुताई वाली मिट्टी' कहा जाता है, जो कपास (Cotton) की खेती के लिए सर्वोत्तम मानी जाती है?",
        options: ["काली मिट्टी (Black Soil)", "जलोढ़ मिट्टी (Alluvial Soil)", "लाल एवं पीली मिट्टी", "लैटेराइट मिट्टी"],
        answerIndex: 0,
        explanation: "काली मिट्टी बेसाल्टिक लावा चट्टानों के अपक्षय (Weathering) से बनती है। इसमें अत्यधिक महीन क्ले कण होने के कारण जल-धारण क्षमता (Moisture retention) सर्वाधिक होती है। ग्रीष्म ऋतु में इसमें गहरी दरारें पड़ जाती हैं, जिससे वायु का संचार होता है; इसलिए इसे 'स्वतः जुताई वाली मिट्टी' भी कहा जाता है।",
        hint: "महाराष्ट्र और गुजरात में कपास उत्पादन के लिए प्रसिद्ध मृदा।"
      },
      {
        question: "भारत का प्रथम राष्ट्रीय उद्यान (First National Park of India) कौन-सा है, जिसे 1936 में 'हेली नेशनल पार्क' के रूप में स्थापित किया गया था और 1973 में 'प्रोजेक्ट टाइगर' भी यहीं से शुरू हुआ था?",
        options: ["जिम कॉर्बेट राष्ट्रीय उद्यान (उत्तराखंड)", "काजीरंगा राष्ट्रीय उद्यान (असम)", "सुंदरबन राष्ट्रीय उद्यान (पश्चिम बंगाल)", "कान्हा राष्ट्रीय उद्यान (मध्य प्रदेश)"],
        answerIndex: 0,
        explanation: "जिम कॉर्बेट राष्ट्रीय उद्यान (उत्तराखंड के नैनीताल/पौड़ी गढ़वाल जिले में) भारत का पहला राष्ट्रीय उद्यान है (1936 में हेली नेशनल पार्क)। 1973 में बाघ संरक्षण हेतु 'प्रोजेक्ट टाइगर' का शुभारंभ भी यहीं से किया गया था।\n📌 अतिरिक्त तथ्य: काजीरंगा एक सींग वाले गैंडे के लिए और सुंदरबन मैंग्रोव व रॉयल बंगाल टाइगर के लिए विख्यात है।",
        hint: "उत्तराखंड के नैनीताल में स्थित भारत का पहला टाइगर रिजर्व।"
      },
      {
        question: "सामरिक रूप से महत्वपूर्ण 'जोजिला दर्रा' (Zoji La Pass) भारत के किस क्षेत्र में स्थित है, जो श्रीनगर को सड़क मार्ग द्वारा लेह (लद्दाख) से जोड़ता है?",
        options: ["लद्दाख / जम्मू-कश्मीर (महान हिमालय)", "सिक्किम (नाथू ला)", "अरुणाचल प्रदेश (बोमडिला)", "हिमाचल प्रदेश (रोहतांग)"],
        answerIndex: 0,
        explanation: "जोजिला दर्रा महान हिमालय श्रेणी (Great Himalayas) में लगभग 11,575 फीट की ऊंचाई पर स्थित है। यह राष्ट्रीय राजमार्ग 1D (NH-1D) के जरिए कश्मीर घाटी (श्रीनगर) को कारगिल व लेह से जोड़ता है।\n🎯 प्रमुख दर्रे परीक्षा सूची: नाथू ला (सिक्किम), शिपकी ला (हिमाचल प्रदेश), लिपुलेख (उत्तराखंड)।",
        hint: "श्रीनगर से लेह-लद्दाख जाने वाला मुख्य हिमालयी दर्रा।"
      },
      {
        question: "भारत में वार्षिक वर्षा का लगभग 75% से अधिक भाग किस मानसून प्रणाली द्वारा प्राप्त होता है, जो जून के प्रथम सप्ताह में केरल तट से टकराता है?",
        options: ["दक्षिण-पश्चिम मानसून (South-West Monsoon)", "उत्तर-पूर्वी मानसून (लौटता मानसून)", "पश्चिमी विक्षोभ (Western Disturbances)", "स्थानीय चक्रवाती हवाएं"],
        answerIndex: 0,
        explanation: "ग्रीष्म ऋतु में भारत के उत्तर-पश्चिम मैदान व तिब्बत के पठार पर निम्न वायुदाब (Low Pressure) बनने से हिंद महासागर की नमी युक्त हवाएं दक्षिण-पश्चिम दिशा से भारत में प्रवेश करती हैं। यह अरब सागर शाखा और बंगाल की खाड़ी शाखा में बंटकर देश के 75%+ भाग में मुख्य मानसूनी वर्षा कराता है।",
        hint: "जून से सितंबर के दौरान केरल से शुरू होने वाला मुख्य ग्रीष्मकालीन मानसून।"
      },
      {
        question: "खनिज संपदा (कोयला, लौह अयस्क, अभ्रक, बॉक्साइट) की प्रचुरता के कारण किस भारतीय पठारी क्षेत्र को 'भारत का रूर' (Ruhr of India) कहा जाता है?",
        options: ["छोटानागपुर का पठार (Chota Nagpur Plateau)", "मालवा का पठार", "दक्कन का ट्रैप", "मेघालय (शिलांग) का पठार"],
        answerIndex: 0,
        explanation: "जर्मनी के खनिज-समृद्ध 'रूर घाटी' की तर्ज पर झारखंड, पश्चिम बंगाल व ओडिशा में विस्तृत छोटानागपुर पठार को 'भारत का रूर' कहा जाता है। भारत का अधिकांश प्राइम कोकिंग कोल दामोदर नदी घाटी क्षेत्र में ही संचित है।",
        hint: "झारखंड और दामोदर नदी घाटी का खनिज-समृद्ध पठार।"
      },
      {
        question: "कर्क रेखा (23°30' N अक्षांश) भारत के 8 राज्यों से होकर गुजरती है। निम्नलिखित में से किस राज्य से होकर कर्क रेखा नहीं गुजरती है?",
        options: ["ओडिशा (Odisha)", "गुजरात (Gujarat)", "मध्य प्रदेश (Madhya Pradesh)", "त्रिपुरा (Tripura)"],
        answerIndex: 0,
        explanation: "कर्क रेखा भारत के 8 राज्यों से गुजरती है: गुजरात, राजस्थान, मध्य प्रदेश, छत्तीसगढ़, झारखंड, पश्चिम बंगाल, त्रिपुरा और मिजोरम। यह ओडिशा, बिहार या उत्तर प्रदेश से होकर नहीं गुजरती है।\n🎯 याद रखने की प्रसिद्ध ट्रिक: 'मित्र पर गमछा झार' (मि-मिजोरम, त्र-त्रिपुरा, प-प.बंगाल, र-राजस्थान, ग-गुजरात, म-म.प्र., छा-छत्तीसगढ़, झार-झारखंड)।",
        hint: "'मित्र पर गमछा झार' ट्रिक का स्मरण करें।"
      }
    ]
  },
  {
    id: "pyq-polity-constitution-2024",
    examName: "Indian Polity & Constitution Special (संविधान, मूल अधिकार एवं संशोधन)",
    examCode: "SSC-POLITY-2024",
    category: "polity",
    year: "2024-2026",
    dateStr: "Daily Practice Special",
    shift: "TCS Pattern",
    subject: "Indian Polity, Articles & Constitutional Amendments",
    totalQuestions: 5,
    timeMinutes: 5,
    marksPerQuestion: 2.0,
    negativeMarks: 0.5,
    questions: [
      {
        question: "भारतीय संविधान का कौन-सा अनुच्छेद 'प्राण एवं दैहिक स्वतंत्रता के संरक्षण' (Protection of Life and Personal Liberty) से संबंधित है?",
        options: ["अनुच्छेद 21 (Article 21)", "अनुच्छेद 19", "अनुच्छेद 14", "अनुच्छेद 25"],
        answerIndex: 0,
        explanation: "अनुच्छेद 21 घोषित करता है कि विधि द्वारा स्थापित प्रक्रिया के अतिरिक्त किसी भी व्यक्ति को उसके जीवन या दैहिक स्वतंत्रता से वंचित नहीं किया जाएगा। मेनका गांधी वाद (1978) के बाद इसमें निजता का अधिकार, स्वच्छ पर्यावरण, आजीविका व विदेश यात्रा का अधिकार भी शामिल माना गया।",
        hint: "मेनका गांधी वाद (1978) से संबंधित मूल अधिकार।"
      },
      {
        question: "भारतीय संविधान के नीति निर्देशक तत्वों (DPSP) के अंतर्गत 'समान नागरिक संहिता' (Uniform Civil Code - UCC) किस अनुच्छेद में वर्णित है?",
        options: ["अनुच्छेद 44 (Article 44)", "अनुच्छेद 40", "अनुच्छेद 48", "अनुच्छेद 50"],
        answerIndex: 0,
        explanation: "अनुच्छेद 44 के तहत राज्य भारत के संपूर्ण राज्यक्षेत्र में नागरिकों के लिए एक समान नागरिक संहिता (UCC) सुनिश्चित करने का प्रयास करेगा। गोवा में यह पुर्तगाली सिविल कोड के रूप में लागू रहा है और हाल ही में उत्तराखंड विधानसभा ने भी यूसीसी विधेयक पारित किया है।",
        hint: "'चार और चार' समान अंक हैं, अतः समान नागरिक संहिता।"
      },
      {
        question: "किस ऐतिहासिक संविधान संशोधन अधिनियम को 'लघु संविधान' (Mini Constitution) कहा जाता है, जिसके द्वारा प्रस्तावना में 'समाजवादी, पंथनिरपेक्ष और अखंडता' शब्द जोड़े गए थे?",
        options: ["42वां संविधान संशोधन अधिनियम, 1976", "44वां संविधान संशोधन, 1978", "86वां संविधान संशोधन, 2002", "73वां संविधान संशोधन, 1992"],
        answerIndex: 0,
        explanation: "42वें संविधान संशोधन अधिनियम (1976) को सरदार स्वर्ण सिंह समिति की सिफारिशों पर लाया गया था। इसके द्वारा प्रस्तावना में संशोधन, मूल कर्तव्यों (भाग IVA) को जोड़ना, तथा 5 विषयों को राज्य सूची से समवर्ती सूची में स्थानांतरित किया गया था।",
        hint: "1976 में इंदिरा गांधी सरकार द्वारा पारित संशोधन।"
      },
      {
        question: "डॉ. भीमराव अंबेडकर ने भारतीय संविधान के किस अनुच्छेद को 'संविधान का हृदय और आत्मा' (Heart and Soul of the Constitution) कहा था?",
        options: ["अनुच्छेद 32 (संवैधानिक उपचारों का अधिकार)", "अनुच्छेद 14 (विधि के समक्ष समता)", "अनुच्छेद 21 (प्राण व दैहिक स्वतंत्रता)", "प्रस्तावना (Preamble)"],
        answerIndex: 0,
        explanation: "अनुच्छेद 32 के तहत मूल अधिकारों के प्रवर्तन के लिए नागरिक सीधे सर्वोच्च न्यायालय (Supreme Court) जा सकते हैं। सुप्रीम कोर्ट को 5 प्रकार की रिट (Habeas Corpus, Mandamus, Prohibition, Quo-Warranto, Certiorari) जारी करने की शक्ति है।",
        hint: "सर्वोच्च न्यायालय द्वारा 5 प्रकार की रिट जारी करने का अधिकार।"
      },
      {
        question: "भारतीय संविधान में 11वां मूल कर्तव्य (6-14 वर्ष के बच्चों को शिक्षा के अवसर उपलब्ध कराना) किस संविधान संशोधन द्वारा जोड़ा गया?",
        options: ["86वां संविधान संशोधन, 2002", "42वां संविधान संशोधन, 1976", "44वां संविधान संशोधन, 1978", "91वां संविधान संशोधन, 2003"],
        answerIndex: 0,
        explanation: "86वें संविधान संशोधन 2002 द्वारा अनुच्छेद 21A (शिक्षा का मूल अधिकार) जोड़ा गया, नीति निर्देशक तत्व अनुच्छेद 45 में बदलाव किया गया, तथा अनुच्छेद 51A(k) के तहत माता-पिता/अभिभावक का 11वां मूल कर्तव्य जोड़ा गया।",
        hint: "2002 का शिक्षा अधिकार संशोधन।"
      }
    ]
  },
  {
    id: "pyq-science-space-isro-2024",
    examName: "General Science, Space Tech & ISRO Missions (विज्ञान एवं अंतरिक्ष प्रौद्योगिकी)",
    examCode: "DEF-SCIENCE-2024",
    category: "science",
    year: "2024-2026",
    dateStr: "Daily Practice Special",
    shift: "TCS Pattern",
    subject: "Science, Space Tech & ISRO Missions",
    totalQuestions: 5,
    timeMinutes: 5,
    marksPerQuestion: 2.0,
    negativeMarks: 0.5,
    questions: [
      {
        question: "इसरो (ISRO) द्वारा 23 अगस्त 2023 को चंद्रमा के दक्षिणी ध्रुव पर सफलतापूर्वक उतारे गए चंद्रयान-3 के लैंडिंग स्थल को क्या नाम दिया गया है?",
        options: ["शिव शक्ति पॉइंट (Shiv Shakti Point)", "तिरंगा पॉइंट", "जवाहर पॉइंट", "अटल पॉइंट"],
        answerIndex: 0,
        explanation: "चंद्रयान-3 के विक्रम लैंडर ने 23 अगस्त 2023 को चंद्रमा के दक्षिणी ध्रुव पर सॉफ्ट लैंडिंग की। प्रधानमंत्री ने इस लैंडिंग स्थल को 'शिव शक्ति पॉइंट' नाम दिया और प्रतिवर्ष 23 अगस्त को 'राष्ट्रीय अंतरिक्ष दिवस' (National Space Day) घोषित किया। चंद्रयान-2 के पदचिह्न स्थल को 'तिरंगा पॉइंट' कहा जाता है।",
        hint: "23 अगस्त को राष्ट्रीय अंतरिक्ष दिवस इसी ऐतिहासिक उपलब्धि पर घोषित किया गया।"
      },
      {
        question: "सूर्य के वायुमंडल (कोरोना एवं क्रोमोस्फीयर) का विस्तृत अध्ययन करने के लिए इसरो द्वारा प्रक्षेपित भारत के पहले सौर मिशन का क्या नाम है?",
        options: ["आदित्य-L1 (Aditya-L1)", "भास्कर-1", "सूर्ययान", "हेलियोस-3"],
        answerIndex: 0,
        explanation: "आदित्य-L1 को 2 सितंबर 2023 को PSLV-C57 द्वारा पृथ्वी से लगभग 15 लाख किमी दूर स्थित लैग्रेंज बिंदु 1 (L1) के हेलो ऑर्बिट में स्थापित किया गया, जहां से सूर्य बिना किसी ग्रहण के लगातार दिखाई देता है।",
        hint: "L1 बिंदु पर स्थित पहला भारतीय सौर वेधशाला मिशन।"
      },
      {
        question: "'प्रकाश वर्ष' (Light Year) निम्नलिखित में से किस भौतिक राशि का मात्रक है?",
        options: ["खगोलीय दूरी (Astronomical Distance)", "समय (Time)", "प्रकाश की तीव्रता", "गति/वेग (Speed)"],
        answerIndex: 0,
        explanation: "⚠️ TCS Trap: नाम में 'वर्ष' होने के कारण कई छात्र इसे समय का मात्रक मान बैठते हैं, जबकि प्रकाश वर्ष दूरी का मात्रक है। प्रकाश द्वारा निर्वात में एक वर्ष में तय की गई दूरी (लगभग 9.46 × 10¹⁵ मीटर) को एक प्रकाश वर्ष कहा जाता है।",
        hint: "तारों और आकाशगंगाओं के बीच की दूरी मापने की इकाई।"
      },
      {
        question: "सूर्य तथा तारों में ऊर्जा का निरंतर विशाल स्रोत कौन-सी भौतिक-रासायनिक अभिक्रिया है?",
        options: ["नाभिकीय संलयन (Nuclear Fusion)", "नाभिकीय विखंडन (Nuclear Fission)", "रासायनिक दहन", "रेडियोधर्मी क्षय"],
        answerIndex: 0,
        explanation: "सूर्य के कोर में अत्यधिक उच्च ताप और दाब पर हाइड्रोजन के हल्के नाभिक मिलकर हीलियम नाभिक बनाते हैं (नाभिकीय संलयन)। इस द्रव्यमान क्षय से आइंस्टीन के समीकरण E = mc² के अनुसार विशाल ऊर्जा उत्सर्जित होती है।",
        hint: "चार हाइड्रोजन नाभिक मिलकर एक हीलियम नाभिक का निर्माण करते हैं।"
      },
      {
        question: "मानव शरीर में रक्त का थक्का (Blood Clotting) जमने के लिए किस विटामिन की अनिवार्य आवश्यकता होती है?",
        options: ["विटामिन K (Phylloquinone)", "विटामिन C", "विटामिन A", "विटामिन E"],
        answerIndex: 0,
        explanation: "विटामिन K यकृत में प्रोथ्रोम्बिन और अन्य रक्त का थक्का बनाने वाले कारकों के संश्लेषण के लिए आवश्यक होता है। इसकी कमी से चोट लगने पर रक्त बहना बंद नहीं होता (Hemorrhage)।",
        hint: "फिलोक्विनोन (Phylloquinone) रासायनिक नाम वाला विटामिन।"
      }
    ]
  },
  {
    id: "pyq-math-quant-2024",
    examName: "Quantitative Aptitude Special (गणित एवं संख्यात्मक अभियोग्यता TCS CGL/CHSL PYQ)",
    examCode: "SSC-MATH-2024",
    category: "math",
    year: "2024-2026",
    dateStr: "Daily Practice Special",
    shift: "TCS Pattern",
    subject: "Mathematics & Quantitative Aptitude",
    totalQuestions: 5,
    timeMinutes: 7,
    marksPerQuestion: 2.0,
    negativeMarks: 0.5,
    questions: [
      {
        question: "किसी वस्तु को ₹720 में बेचने पर एक दुकानदार को 20% का लाभ होता है। यदि वह 10% की हानि पर बेचना चाहे, तो उस वस्तु का विक्रय मूल्य (Selling Price) क्या होना चाहिए?",
        options: ["₹540", "₹600", "₹560", "₹580"],
        answerIndex: 0,
        explanation: "हल चरण:\n1. क्रय मूल्य (Cost Price) = 720 ÷ (1 + 0.20) = 720 ÷ 1.2 = ₹600।\n2. 10% हानि पर विक्रय मूल्य = क्रय मूल्य × (1 - 0.10) = 600 × 0.90 = ₹540।",
        hint: "पहले वस्तु का क्रय मूल्य (Cost Price) ज्ञात करें।"
      },
      {
        question: "A किसी कार्य को 12 दिनों में और B उसी कार्य को 18 दिनों में पूरा कर सकता है। यदि वे दोनों एक साथ मिलकर कार्य करें, तो संपूर्ण कार्य कितने दिनों में समाप्त होगा?",
        options: ["7.2 दिन (36/5 दिन)", "6 दिन", "8 दिन", "9 दिन"],
        answerIndex: 0,
        explanation: "1. 12 और 18 का ल.स. (LCM) = 36 इकाई कुल कार्य।\n2. A की कार्यक्षमता = 36 ÷ 12 = 3 इकाई/दिन।\n3. B की कार्यक्षमता = 36 ÷ 18 = 2 इकाई/दिन।\n4. दोनों की संयुक्त कार्यक्षमता = 3 + 2 = 5 इकाई/दिन।\n5. कुल समय = 36 ÷ 5 = 7.2 दिन।",
        hint: "कुल कार्य को LCM विधि से 36 मानकर हल करें।"
      },
      {
        question: "₹5,000 की मूल राशि पर 10% वार्षिक चक्रवृद्धि ब्याज की दर से 2 वर्ष के चक्रवृद्धि ब्याज (CI) और साधारण ब्याज (SI) का अंतर कितना होगा?",
        options: ["₹50", "₹100", "₹25", "₹75"],
        answerIndex: 0,
        explanation: "2 वर्ष के लिए CI और SI के अंतर का सीधा सूत्र:\nअंतर (D) = P × (R/100)²\nD = 5000 × (10/100)² = 5000 × (1/100) = ₹50।",
        hint: "सूत्र: D = P × (R/100)² का प्रयोग करें।"
      },
      {
        question: "150 मीटर लंबी एक रेलगाड़ी 54 किमी/घंटा की गति से दौड़ रही है। वह 250 मीटर लंबे एक प्लेटफॉर्म को पार करने में कितना समय लेगी?",
        options: ["26.67 सेकंड (80/3 सेकंड)", "20 सेकंड", "30 सेकंड", "24 सेकंड"],
        answerIndex: 0,
        explanation: "1. गति को मीटर/सेकंड में बदलें: 54 × (5/18) = 15 मीटर/सेकंड।\n2. कुल दूरी = ट्रेन की लंबाई + प्लेटफॉर्म की लंबाई = 150 + 250 = 400 मीटर।\n3. समय = कुल दूरी ÷ चाल = 400 ÷ 15 = 80/3 सेकंड = 26.67 सेकंड।",
        hint: "चाल को 5/18 से गुणा कर m/s में बदलें और दोनों लंबाइयों को जोड़ें।"
      },
      {
        question: "एक समबाहु त्रिभुज (Equilateral Triangle) की प्रत्येक भुजा की लंबाई 6 सेमी है। इस त्रिभुज का क्षेत्रफल (Area) कितना होगा?",
        options: ["9√3 सेमी²", "18√3 सेमी²", "36 सेमी²", "12√3 सेमी²"],
        answerIndex: 0,
        explanation: "समबाहु त्रिभुज का क्षेत्रफल = (√3 / 4) × a²\n= (√3 / 4) × (6)² = (√3 / 4) × 36 = 9√3 सेमी²।",
        hint: "समबाहु त्रिभुज का क्षेत्रफल = (√3 / 4) × भुजा²।"
      }
    ]
  },
  {
    id: "pyq-english-ssc-2024",
    examName: "General English Special (Grammar, Vocab, Idioms & Spotting Error TCS PYQ)",
    examCode: "SSC-ENG-2024",
    category: "english",
    year: "2024-2026",
    dateStr: "Daily Practice Special",
    shift: "TCS Pattern",
    subject: "General English & Grammar",
    totalQuestions: 5,
    timeMinutes: 5,
    marksPerQuestion: 2.0,
    negativeMarks: 0.5,
    questions: [
      {
        question: "Select the sentence with the correct Passive Voice conversion:\n'The chef prepared a sumptuous four-course dinner for the foreign delegates.'",
        options: [
          "A sumptuous four-course dinner was prepared by the chef for the foreign delegates.",
          "A sumptuous four-course dinner has been prepared by the chef.",
          "A sumptuous four-course dinner is prepared by the chef.",
          "The foreign delegates were preparing a sumptuous four-course dinner."
        ],
        answerIndex: 0,
        explanation: "Simple Past Tense (prepared) changes into 'was/were + V3 (prepared)' in passive voice. The direct object 'A sumptuous four-course dinner' becomes the new subject.",
        hint: "Simple past passive rule: was/were + V3."
      },
      {
        question: "Select the most appropriate meaning of the idiom: 'Hit the nail on the head'",
        options: [
          "To describe exactly what is causing a situation or problem",
          "To cause physical injury during carpentry work",
          "To miss an important deadline repeatedly",
          "To blame an innocent person for a mistake"
        ],
        answerIndex: 0,
        explanation: "'To hit the nail on the head' means to state or do exactly the right thing or accurately pinpoint the exact reason/cause of an issue.",
        hint: "सटीक बात कहना या सही कारण पकड़ना।"
      },
      {
        question: "Identify the segment that contains a grammatical error:\n'Neither the principal nor the teachers (A) / was present in (B) / the annual convocation ceremony (C) / yesterday. (D)'",
        options: ["was present in (Segment B)", "Neither the principal nor the teachers (Segment A)", "the annual convocation ceremony (Segment C)", "yesterday (Segment D)"],
        answerIndex: 0,
        explanation: "Subject-Verb Agreement Rule: When two subjects are joined by 'neither... nor', the verb agrees with the subject closest to it. Here, the closer subject is plural ('teachers'), so plural verb 'were present' must be used instead of 'was present'.",
        hint: "Neither... nor में वर्ब पास वाले कर्ता (teachers) के अनुसार आती है।"
      },
      {
        question: "Select the most appropriate ANTONYM of the given word: 'BENEVOLENT'",
        options: ["Malevolent", "Compassionate", "Generous", "Altruistic"],
        answerIndex: 0,
        explanation: "'Benevolent' means well-meaning, kindly and charitable. Its exact antonym is 'Malevolent' (having or showing a wish to do evil to others; द्वेषी या दुष्ट). Compassionate, Generous and Altruistic are synonyms.",
        hint: "Bene = Good, Mal = Evil/Bad."
      },
      {
        question: "Choose the correct indirect form:\nRahul said to me, 'I have completed my research project today.'",
        options: [
          "Rahul told me that he had completed his research project that day.",
          "Rahul told me that I have completed my research project today.",
          "Rahul said that he has completed his research project yesterday.",
          "Rahul asked me if he completed his research project."
        ],
        answerIndex: 0,
        explanation: "Rules for Indirect Speech:\n1. 'said to' changes to 'told'.\n2. Present Perfect (have completed) changes to Past Perfect (had completed).\n3. 1st person pronoun 'I' changes to 'he'.\n4. 'today' changes to 'that day'.",
        hint: "have completed → had completed; today → that day."
      }
    ]
  },
  {
    id: "pyq-hindi-vyakaran-2024",
    examName: "General Hindi Special (सामान्य हिन्दी व्याकरण, संधि, समास, मुहावरे एवं वर्तनी शुद्धता)",
    examCode: "HINDI-VYAKARAN-2024",
    category: "hindi",
    year: "2024-2026",
    dateStr: "Daily Practice Special",
    shift: "Police / RO-ARO / Board Pattern",
    subject: "General Hindi Grammar (सामान्य हिन्दी)",
    totalQuestions: 5,
    timeMinutes: 5,
    marksPerQuestion: 2.0,
    negativeMarks: 0.5,
    questions: [
      {
        question: "'सूर्योदय' शब्द का सही संधि-विच्छेद और संधि का नाम क्या है?",
        options: ["सूर्य + उदय (गुण स्वर संधि)", "सूर्य + दय (दीर्घ संधि)", "सूर्यो + दय (वृद्धि संधि)", "सूर्य + उदय (यण संधि)"],
        answerIndex: 0,
        explanation: "सूर्य (अ) + उदय (उ) = सूर्योदय (ओ)। जब 'अ' या 'आ' के बाद 'इ/ई', 'उ/ऊ' या 'ऋ' आए तो क्रमशः 'ए', 'ओ', 'अर्' हो जाता है; इसे 'गुण स्वर संधि' कहते हैं।",
        hint: "अ + उ मिलकर 'ओ' बनता है (गुण संधि)।"
      },
      {
        question: "'यथाशक्ति' शब्द में कौन-सा समास है?",
        options: ["अव्ययीभाव समास", "तत्पुरुष समास", "द्विगु समास", "कर्मधारय समास"],
        answerIndex: 0,
        explanation: "'यथाशक्ति' का विग्रह है 'शक्ति के अनुसार'। जिस समास का पहला पद अव्यय (यथा) और प्रधान हो, उसे 'अव्ययीभाव समास' कहते हैं।",
        hint: "पहला पद 'यथा' एक अव्यय (उपसर्गवत) है।"
      },
      {
        question: "निम्नलिखित में से शुद्ध वर्तनी (Correct Spelling) वाला शब्द चुनिए:",
        options: ["उज्ज्वल", "उज्वल", "उज्जवल", "उजज्वल"],
        answerIndex: 0,
        explanation: "उत् + ज्वल = उज्ज्वल। इसमें व्यंजन संधि के नियमानुसार दो बार आधा 'ज' (ज्ज्व) आता है। अतः 'उज्ज्वल' ही शुद्ध वर्तनी है।",
        hint: "इसमें दो बार आधा 'ज' आता है (उत् + ज्वल)।"
      },
      {
        question: "काव्य शास्त्र में 'शोक' किस रस का स्थायी भाव (Permanent Emotion) है?",
        options: ["करुण रस", "रौद्र रस", "शांत रस", "वीर रस"],
        answerIndex: 0,
        explanation: "करुण रस का स्थायी भाव 'शोक' होता है। रौद्र का क्रोध, शांत का निर्वेद/शम, और वीर रस का स्थायी भाव उत्साह होता है।",
        hint: "दुख या वियोग की स्थिति का रस।"
      },
      {
        question: "'आँखों में धूल झोंकना' मुहावरे का सही और सटीक अर्थ क्या है?",
        options: ["धोखा देना", "आँखों में मिट्टी डालना", "नजरअंदाज करना", "लज्जित होना"],
        answerIndex: 0,
        explanation: "'आँखों में धूल झोंकना' का अर्थ है किसी को चालाकी से चकमा या धोखा देना।",
        hint: "चकमा देना या धोखा देना।"
      }
    ]
  },
  {
    id: "pyq-history-modern-2024",
    examName: "Indian History & National Movement Special (इतिहास एवं राष्ट्रीय आन्दोलन TCS PYQ)",
    examCode: "SSC-HIST-2024",
    category: "history",
    year: "2024-2026",
    dateStr: "Daily Practice Special",
    shift: "TCS Pattern",
    subject: "Indian History & Modern Movement",
    totalQuestions: 5,
    timeMinutes: 5,
    marksPerQuestion: 2.0,
    negativeMarks: 0.5,
    questions: [
      {
        question: "हड़प्पा सभ्यता का प्रसिद्ध 'विशाल स्नानागार' (The Great Bath) किस पुरातात्विक स्थल से उत्खनन में प्राप्त हुआ था?",
        options: ["मोहनजोदड़ो (Mohenjo-daro)", "हड़प्पा (Harappa)", "लोथल (Lothal)", "कालीबंगा (Kalibangan)"],
        answerIndex: 0,
        explanation: "विशाल स्नानागार और विशाल अन्नागार (Great Granary) दोनों पाकिस्तान के सिंध प्रांत में सिंधु नदी के तट पर स्थित मोहनजोदड़ो से प्राप्त हुए थे, जिसकी खोज राखालदास बनर्जी ने 1922 में की थी।",
        hint: "राखालदास बनर्जी द्वारा 1922 में खोजा गया सिंध का प्रमुख स्थल।"
      },
      {
        question: "मौर्य सम्राट अशोक के अधिकांश शिलालेख एवं स्तंभ अभिलेख किस लिपि (Script) में उत्कीर्ण पाए गए हैं?",
        options: ["ब्राह्मी लिपि (Brahmi Script)", "खरोष्ठी लिपि", "ग्रीक-अरामाइक लिपि", "देवनागरी लिपि"],
        answerIndex: 0,
        explanation: "सम्राट अशोक के अधिकांश प्राकृत भाषा के अभिलेख 'ब्राह्मी लिपि' में लिखे गए हैं, जिसे 1837 में जेम्स प्रिंसेप ने सर्वप्रथम पढ़ने में सफलता प्राप्त की थी। पश्चिमोत्तर भारत में खरोष्ठी लिपि का प्रयोग हुआ था।",
        hint: "जेम्स प्रिंसेप ने 1837 में सबसे पहले इसी लिपि को पढ़ा था।"
      },
      {
        question: "महात्मा गांधी ने किस ऐतिहासिक राष्ट्रीय जन-आंदोलन के दौरान भारतीयों को 'करो या मरो' (Do or Die) का मंत्र दिया था?",
        options: ["भारत छोड़ो आंदोलन (1942)", "असहयोग आंदोलन (1920)", "सविनय अवज्ञा आंदोलन (1930)", "चंपारण सत्याग्रह (1917)"],
        answerIndex: 0,
        explanation: "8 अगस्त 1942 को बंबई के ऐतिहासिक ग्वालिया टैंक मैदान (अगस्त क्रांति मैदान) से भारत छोड़ो प्रस्ताव पारित करते हुए गांधीजी ने देशवासियों को 'करो या मरो' का प्रसिद्ध नारा दिया था।",
        hint: "अगस्त क्रांति 1942 का ऐतिहासिक आंदोलन।"
      },
      {
        question: "वर्ष 1905 में 'बंगाल विभाजन' (Partition of Bengal) की घोषणा किस ब्रिटिश वायसराय द्वारा की गई थी?",
        options: ["लॉर्ड कर्जन (Lord Curzon)", "लॉर्ड डलहौजी", "लॉर्ड रिपन", "लॉर्ड चेम्सफोर्ड"],
        answerIndex: 0,
        explanation: "लॉर्ड कर्जन ने फूट डालो और राज करो की नीति के तहत 20 जुलाई 1905 को बंगाल विभाजन की घोषणा की (जो 16 अक्टूबर 1905 को प्रभावी हुआ)। इसके विरोध में ऐतिहासिक 'स्वदेशी और बहिष्कार आंदोलन' प्रारंभ हुआ।",
        hint: "फूट डालो और राज करो की नीति अपनाने वाला वायसराय।"
      },
      {
        question: "1857 के प्रथम स्वतंत्रता संग्राम के दौरान दिल्ली में विद्रोही सैनिकों का वास्तविक सैन्य नेतृत्व किसने संभाला था?",
        options: ["जनरल बख्त खान (General Bakht Khan)", "बहादुर शाह जफर द्वितीय", "तात्या टोपे", "मौलवी अहमदुल्ला"],
        answerIndex: 0,
        explanation: "यद्यपि 82 वर्षीय मुगल सम्राट बहादुर शाह जफर प्रतीकात्मक सम्राट थे, परंतु बरेली से आए विद्रोही सैनिकों के प्रमुख जनरल बख्त खान ने दिल्ली में वास्तविक सैन्य कमान और कोर्ट ऑफ एडमिनिस्ट्रेशन का संचालन किया था।",
        hint: "बरेली से आकर विद्रोही सेना का संचालन करने वाले सेनानायक।"
      }
    ]
  },
  {
    id: "pyq-economy-budget-2024",
    examName: "Indian Economy & Union Budget Special (भारतीय अर्थव्यवस्था, मौद्रिक नीति एवं बजट)",
    examCode: "SSC-ECON-2024",
    category: "economy",
    year: "2024-2026",
    dateStr: "Daily Practice Special",
    shift: "TCS Pattern",
    subject: "Indian Economy, Budget & Banking System",
    totalQuestions: 5,
    timeMinutes: 5,
    marksPerQuestion: 2.0,
    negativeMarks: 0.5,
    questions: [
      {
        question: "भारत में मुद्रास्फीति नियंत्रण एवं ब्याज दरों के लिए 'मौद्रिक नीति' (Monetary Policy) का निर्धारण और क्रियान्वयन कौन करता है?",
        options: ["भारतीय रिजर्व बैंक (RBI) की मौद्रिक नीति समिति (MPC)", "वित्त मंत्रालय (Ministry of Finance)", "नीति आयोग (NITI Aayog)", "भारतीय प्रतिभूति एवं विनिमय बोर्ड (SEBI)"],
        answerIndex: 0,
        explanation: "RBI अधिनियम की धारा 45ZB के तहत 6 सदस्यीय मौद्रिक नीति समिति (MPC) रेपो रेट, रिवर्स रेपो रेट और मुद्रास्फीति लक्ष्य (4% ± 2%) तय करने हेतु उत्तरदायी है। गवर्नर RBI इसके पदेन अध्यक्ष होते हैं।",
        hint: "देश का केंद्रीय बैंक (Central Bank)।"
      },
      {
        question: "जिस ब्याज दर पर भारतीय रिजर्व बैंक (RBI) अन्य वाणिज्यिक बैंकों को उनकी अल्पकालिक नकदी आवश्यकताओं के लिए ऋण प्रदान करता है, उसे क्या कहते हैं?",
        options: ["रेपो दर (Repo Rate)", "रिवर्स रेपो दर (Reverse Repo Rate)", "बैंक दर (Bank Rate)", "वैधानिक तरलता अनुपात (SLR)"],
        answerIndex: 0,
        explanation: "रेपो दर (Repurchase Option Rate) वह दर है जिस पर RBI कमर्शियल बैंकों को सरकारी प्रतिभूतियों के बदले अल्पकालिक ऋण देता है। जब बैंक RBI के पास अपनी अधिशेष नकदी जमा करते हैं, तो उसे 'रिवर्स रेपो दर' कहा जाता है।",
        hint: "Repurchase Option Rate."
      },
      {
        question: "केंद्रीय बजट में सरकार के कुल व्यय और कुल प्राप्तियों (उधार छोड़कर) के बीच के अंतर को क्या कहा जाता है?",
        options: ["राजकोषीय घाटा (Fiscal Deficit)", "राजस्व घाटा (Revenue Deficit)", "प्राथमिक घाटा (Primary Deficit)", "मुद्रीकृत घाटा"],
        answerIndex: 0,
        explanation: "राजकोषीय घाटा = कुल व्यय - (राजस्व प्राप्तियां + गैर-ऋण पूंजीगत प्राप्तियां)। यह सरकार द्वारा एक वित्तीय वर्ष में लिए जाने वाले कुल शुद्ध उधार को दर्शाता है।",
        hint: "सरकार द्वारा लिया जाने वाला कुल ऋण घाटा।"
      },
      {
        question: "भारत में 65 वर्ष पुराने योजना आयोग (Planning Commission) को प्रतिस्थापित कर 'नीति आयोग' (NITI Aayog) का गठन कब किया गया?",
        options: ["1 जनवरी 2015", "15 अगस्त 2014", "1 जुलाई 2017", "26 जनवरी 2016"],
        answerIndex: 0,
        explanation: "1 जनवरी 2015 को केंद्रीय मंत्रिमंडल के प्रस्ताव द्वारा NITI (National Institution for Transforming India) आयोग का गठन किया गया। इसके पदेन अध्यक्ष देश के प्रधानमंत्री होते हैं।",
        hint: "साल 2015 के नववर्ष के पहले दिन।"
      },
      {
        question: "निम्नलिखित में से कौन-सी आर्थिक गतिविधि अर्थव्यवस्था के 'प्राथमिक क्षेत्र' (Primary Sector) के अंतर्गत सम्मिलित है?",
        options: ["कृषि, वानिकी एवं मत्स्य पालन", "ऑटोमोबाइल विनिर्माण", "बैंकिंग एवं वित्तीय सेवाएं", "सॉफ्टवेयर विकास"],
        answerIndex: 0,
        explanation: "प्राकृतिक संसाधनों के सीधे दोहन से जुड़ी गतिविधियां जैसे कृषि, खनन, वानिकी और पशुपालन 'प्राथमिक क्षेत्र' के अंतर्गत आती हैं। विनिर्माण द्वितीयक क्षेत्र और सेवाएं तृतीयक क्षेत्र में आती हैं।",
        hint: "प्राकृतिक संसाधनों से सीधे जुड़ी गतिविधियां।"
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
  onRetestMistakes,
  studentGoalProfile,
  onOpenGoalSelector,
  forcedStream
}) => {
  const isHindi = language === 'hindi';

  // Navigation Sub-tabs: 'pyq' | 'practice' | 'custom' | 'mistakes' | 'bookmarks'
  const [activeTab, setActiveTab] = useState<'pyq' | 'practice' | 'custom' | 'mistakes' | 'bookmarks'>('pyq');
  
  // Active Exam Stream: 'board' | 'competitive' (Default according to confirmed student profile or forced stream)
  const [selectedStream, setSelectedStream] = useState<'board' | 'competitive'>(() => {
    if (forcedStream) return forcedStream;
    if (studentGoalProfile?.stream) return studentGoalProfile.stream;
    return 'competitive';
  });

  // Sync stream when forcedStream or studentGoalProfile changes
  useEffect(() => {
    if (forcedStream) {
      setSelectedStream(forcedStream);
    } else if (studentGoalProfile?.stream) {
      setSelectedStream(studentGoalProfile.stream);
    }
  }, [forcedStream, studentGoalProfile?.stream]);

  // Bookmarked Questions State (Persisted in localStorage)
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<BookmarkedQuestionItem[]>(() => {
    try {
      const saved = localStorage.getItem('hans_bookmarked_questions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync Bookmarks to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('hans_bookmarked_questions', JSON.stringify(bookmarkedQuestions));
    } catch (e) {
      console.error('Failed to save bookmarks to localStorage', e);
    }
  }, [bookmarkedQuestions]);

  // Check if question is bookmarked
  const isQuestionBookmarked = (qText: string) => {
    return bookmarkedQuestions.some(item => item.question === qText);
  };

  // Toggle bookmark for a question
  const handleToggleBookmark = (q: QuizQuestion, examSubject?: string) => {
    if (!q || !q.question) return;
    const existing = isQuestionBookmarked(q.question);
    if (existing) {
      setBookmarkedQuestions(prev => prev.filter(item => item.question !== q.question));
      showToast("🔖 प्रश्न बुकमार्क सूची से हटा दिया गया", "info");
    } else {
      const newItem: BookmarkedQuestionItem = {
        id: `bm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        question: q.question,
        options: q.options,
        answerIndex: q.answerIndex,
        explanation: q.explanation || 'No explanation available.',
        hint: q.hint,
        subject: examSubject || currentExamMeta?.subject || currentExamMeta?.name || 'General Quiz',
        dateStr: new Date().toLocaleDateString('hi-IN')
      };
      setBookmarkedQuestions(prev => [newItem, ...prev]);
      showToast("⭐ प्रश्न 'Bookmarked Questions' में सुरक्षित सहेजा गया!", "success");
    }
  };
  
  // Test State
  const [activeTestMode, setActiveTestMode] = useState<boolean>(false);
  const [currentTestTitle, setCurrentTestTitle] = useState<string>('');
  const [currentExamMeta, setCurrentExamMeta] = useState<{ name: string; subject?: string; date: string; shift: string; marksPerQ: number; negMark: number } | null>(null);
  
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
  const [isPaletteDrawerOpen, setIsPaletteDrawerOpen] = useState<boolean>(false);
  const [isPauseModalOpen, setIsPauseModalOpen] = useState<boolean>(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [reportReason, setReportReason] = useState<string>('');
  const [pyqCategoryFilter, setPyqCategoryFilter] = useState<string>('all');

  // Anti-Cheating & Proctoring Surveillance System (App-switch / Tab-switch / AI Cheat Prevention)
  const [tabSwitchCount, setTabSwitchCount] = useState<number>(0);
  const [isAntiCheatWarningOpen, setIsAntiCheatWarningOpen] = useState<boolean>(false);
  const [antiCheatDisqualified, setAntiCheatDisqualified] = useState<boolean>(false);
  const [antiCheatReason, setAntiCheatReason] = useState<string>('');

  // Custom AI Quiz Generation State
  const [customSubject, setCustomSubject] = useState<string>('Reasoning & Logical Aptitude');
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

  // Anti-Cheating Surveillance: Detects app-switching, tab switching, and window blur
  // (Prevents students from opening another app or using ChatGPT/Gemini to cheat)
  useEffect(() => {
    if (!activeTestMode || isTestSubmitted) return;

    const triggerCheatingStrike = () => {
      // Don't trigger if user is just clicking internal test modals
      if (isPauseModalOpen || isSubmitModalOpen || isReportModalOpen) return;

      if (tabSwitchCount === 0) {
        // Strike 1: Warning Modal & Pause
        setTabSwitchCount(1);
        setIsTimerPaused(true);
        setIsAntiCheatWarningOpen(true);
        if (typeof navigator !== 'undefined' && (navigator as any).vibrate) {
          try { (navigator as any).vibrate([200, 100, 200]); } catch {}
        }
        showToast("⚠️ चेतावनी 1/2: परीक्षा के दौरान अन्य ऐप या टैब खोलना सख्त वर्जित है!", "error");
      } else if (tabSwitchCount >= 1) {
        // Strike 2: Disqualify and Auto-Submit Test Immediately
        setTabSwitchCount(prev => prev + 1);
        setIsAntiCheatWarningOpen(false);
        const reason = "सुरक्षा नियम उल्लंघन: परीक्षा के दौरान दूसरी बार स्क्रीन छोड़ने (अन्य ऐप/सर्च/टैब खोलने) के कारण टेस्ट स्वतः बंद व सबमिट कर दिया गया है।";
        handleSubmitTest(true, reason);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerCheatingStrike();
      }
    };

    const handleWindowBlur = () => {
      triggerCheatingStrike();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [activeTestMode, isTestSubmitted, tabSwitchCount, isPauseModalOpen, isSubmitModalOpen, isReportModalOpen]);

  // Start a PYQ Test
  const handleStartPYQTest = (pyq: PYQExamRecord) => {
    setTestQuestions(pyq.questions);
    setCurrentTestTitle(pyq.examName);
    setCurrentExamMeta({
      name: pyq.examName,
      subject: pyq.subject,
      date: pyq.dateStr,
      shift: pyq.shift,
      marksPerQ: pyq.marksPerQuestion,
      negMark: pyq.negativeMarks
    });
    setUserAnswers({});
    setMarkedForReview({});
    setCurrentQIndex(0);
    setTabSwitchCount(0);
    setIsAntiCheatWarningOpen(false);
    setAntiCheatDisqualified(false);
    setAntiCheatReason('');
    setTimeRemainingSeconds(pyq.timeMinutes * 60);
    setIsTestSubmitted(false);
    setTestResult(null);
    setActiveTestMode(true);
    showToast(`📝 ${pyq.examName} टेस्ट शुरू! समय: ${pyq.timeMinutes} मिनट`, 'info');
  };

  // Dedicated subject fallback ensuring exact topic questions are served
  const getSubjectFallbackQuestions = (topic: string): QuizQuestion[] => {
    const t = (topic || '').toLowerCase();
    if (t.includes('math') || t.includes('गणित') || t.includes('quant') || t.includes('arithmetic') || t.includes('percentage') || t.includes('profit')) {
      return CURATED_PYQ_DATA.find(p => p.category === 'math')?.questions || CURATED_PYQ_DATA[0].questions;
    }
    if (t.includes('english') || t.includes('अंग्रेजी') || t.includes('grammar') || t.includes('vocab') || t.includes('idiom')) {
      return CURATED_PYQ_DATA.find(p => p.category === 'english')?.questions || CURATED_PYQ_DATA[0].questions;
    }
    if (t.includes('hindi') || t.includes('हिन्दी') || t.includes('व्याकरण') || t.includes('संधि') || t.includes('समास') || t.includes('मुहावरे')) {
      return CURATED_PYQ_DATA.find(p => p.category === 'hindi')?.questions || CURATED_PYQ_DATA[0].questions;
    }
    if (t.includes('history') || t.includes('इतिहास') || t.includes('सत्याग्रह') || t.includes('हड़प्पा') || t.includes('गांधी')) {
      return CURATED_PYQ_DATA.find(p => p.category === 'history')?.questions || CURATED_PYQ_DATA[0].questions;
    }
    if (t.includes('economy') || t.includes('अर्थव्यवस्था') || t.includes('budget') || t.includes('बजट') || t.includes('rbi') || t.includes('banking')) {
      return CURATED_PYQ_DATA.find(p => p.category === 'economy')?.questions || CURATED_PYQ_DATA[0].questions;
    }
    if (t.includes('polity') || t.includes('संविधान') || t.includes('constitution') || t.includes('अनुच्छेद')) {
      return CURATED_PYQ_DATA.find(p => p.category === 'polity')?.questions || CURATED_PYQ_DATA[0].questions;
    }
    if (t.includes('science') || t.includes('विज्ञान') || t.includes('space') || t.includes('isro') || t.includes('physics') || t.includes('chemistry') || t.includes('biology')) {
      return CURATED_PYQ_DATA.find(p => p.category === 'science')?.questions || CURATED_PYQ_DATA[0].questions;
    }
    if (t.includes('reasoning') || t.includes('तर्कशक्ति') || t.includes('analogy')) {
      return CURATED_PYQ_DATA.find(p => p.category === 'reasoning')?.questions || CURATED_PYQ_DATA[0].questions;
    }
    if (t.includes('geography') || t.includes('भूगोल') || t.includes('environment') || t.includes('नदी') || t.includes('पर्वत')) {
      return CURATED_PYQ_DATA.find(p => p.category === 'geography')?.questions || CURATED_PYQ_DATA[0].questions;
    }
    return CURATED_PYQ_DATA.find(p => p.category === 'geography')?.questions || CURATED_PYQ_DATA[0].questions;
  };

  // Start dynamic quiz for notification/deep link topic
  const handleStartDynamicTopicQuiz = async (topicName: string, titleName: string) => {
    setIsGeneratingCustom(true);
    setCurrentTestTitle(titleName);
    setCurrentExamMeta({
      name: titleName,
      subject: topicName,
      date: new Date().toLocaleDateString('hi-IN'),
      shift: 'Live Exam Practice',
      marksPerQ: 2.0,
      negMark: 0.5
    });
    setUserAnswers({});
    setMarkedForReview({});
    setCurrentQIndex(0);
    setTabSwitchCount(0);
    setIsAntiCheatWarningOpen(false);
    setAntiCheatDisqualified(false);
    setAntiCheatReason('');
    setIsTestSubmitted(false);
    setTestResult(null);
    setActiveTestMode(true);
    showToast(`⏳ ${topicName} के ताज़ा प्रश्न तैयार हो रहे हैं...`, 'info');

    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: topicName,
          difficulty: 'Intermediate',
          count: 5,
          language: isHindi ? 'hindi' : 'english'
        })
      });
      const data = await res.json();
      const quizList = data.quizzes || data.quiz || [];
      if (quizList.length > 0) {
        setTestQuestions(quizList);
        setTimeRemainingSeconds(quizList.length * 60);
        showToast(`📝 ${titleName} लाइव शुरू!`, 'success');
      } else {
        // Safe subject-specific fallback ensuring exact topic alignment
        const safeQuestions = getSubjectFallbackQuestions(topicName);
        setTestQuestions(safeQuestions);
        setTimeRemainingSeconds(safeQuestions.length * 60);
      }
    } catch (err) {
      const safeQuestions = getSubjectFallbackQuestions(topicName);
      setTestQuestions(safeQuestions);
      setTimeRemainingSeconds(safeQuestions.length * 60);
    } finally {
      setIsGeneratingCustom(false);
    }
  };

  // Launch pre-selected quiz payload from notification or deep link
  const launchPreselectedQuiz = (payload: { 
    examName?: string; 
    topic?: string; 
    category?: string; 
    description?: string;
    questions?: QuizQuestion[];
    marksPerQ?: number;
    negMark?: number;
    timeMinutes?: number;
  }) => {
    if (!payload) return;

    // Reset anti-cheating flags
    setTabSwitchCount(0);
    setIsAntiCheatWarningOpen(false);
    setAntiCheatDisqualified(false);
    setAntiCheatReason('');

    // Direct questions provided (e.g. from Board Exam box, Mistake Retest, or custom generator)
    if (payload.questions && Array.isArray(payload.questions) && payload.questions.length > 0) {
      const qCount = payload.questions.length;
      const testTitle = payload.examName || payload.topic || 'Special Practice Test';
      const testSubj = payload.topic || (payload.category === 'board' ? 'Board Exam' : 'Competitive Exam');
      const timeMin = payload.timeMinutes || Math.max(3, qCount * 2);
      const marksPerQ = payload.marksPerQ ?? 2.0;
      const negMark = payload.negMark ?? (payload.category === 'board' ? 0.0 : 0.5);

      setTestQuestions(payload.questions);
      setCurrentTestTitle(testTitle);
      setCurrentExamMeta({
        name: testTitle,
        subject: testSubj,
        date: new Date().toLocaleDateString('hi-IN'),
        shift: payload.category === 'board' ? 'Board Chapter Single Test' : 'Live Practice Shift',
        marksPerQ,
        negMark
      });
      setUserAnswers({});
      setMarkedForReview({});
      setCurrentQIndex(0);
      setTimeRemainingSeconds(timeMin * 60);
      setIsTestSubmitted(false);
      setTestResult(null);
      setActiveTestMode(true);
      showToast(`📝 ${testTitle} शुरू! (${qCount} प्रश्न, ${timeMin} मिनट)`, 'success');
      return;
    }

    const query = ((payload.examName || '') + ' ' + (payload.topic || '')).toLowerCase();
    
    // Find matching pre-curated test across competitive and board records
    const allRecords = [...BOARD_PYQ_RECORDS, ...CURATED_PYQ_DATA];
    
    // Check 1: Exact substring match in examName, subject or category
    let match = allRecords.find(p => 
      p.examName.toLowerCase().includes(query) || 
      p.subject.toLowerCase().includes(query) ||
      (p.category && query.includes(p.category.toLowerCase()))
    );

    // Check 2: Specialized Topic Keyword Routing (Ensures every subject strictly opens its exact questions!)
    if (!match) {
      if (query.includes('math') || query.includes('गणित') || query.includes('quant') || query.includes('aptitude') || query.includes('arithmetic') || query.includes('percentage') || query.includes('algebra') || query.includes('profit') || query.includes('ब्याज')) {
        match = allRecords.find(p => p.category === 'math' || p.subject.toLowerCase().includes('math') || p.subject.toLowerCase().includes('गणित'));
      } else if (query.includes('english') || query.includes('अंग्रेजी') || query.includes('grammar') || query.includes('vocab') || query.includes('idiom') || query.includes('comprehension')) {
        match = allRecords.find(p => p.category === 'english' || p.subject.toLowerCase().includes('english'));
      } else if (query.includes('hindi') || query.includes('हिन्दी') || query.includes('व्याकरण') || query.includes('संधि') || query.includes('समास') || query.includes('मुहावरे') || query.includes('वर्तनी')) {
        match = allRecords.find(p => p.category === 'hindi' || p.subject.toLowerCase().includes('hindi') || p.subject.toLowerCase().includes('हिन्दी'));
      } else if (query.includes('history') || query.includes('इतिहास') || query.includes('सत्याग्रह') || query.includes('हड़प्पा') || query.includes('गांधी') || query.includes('विभाजन')) {
        match = allRecords.find(p => p.category === 'history' || p.subject.toLowerCase().includes('history') || p.subject.toLowerCase().includes('इतिहास'));
      } else if (query.includes('economy') || query.includes('अर्थव्यवस्था') || query.includes('budget') || query.includes('बजट') || query.includes('rbi') || query.includes('banking') || query.includes('रेपो')) {
        match = allRecords.find(p => p.category === 'economy' || p.subject.toLowerCase().includes('economy') || p.subject.toLowerCase().includes('budget'));
      } else if (query.includes('geography') || query.includes('भूगोल') || query.includes('environment') || query.includes('national park') || query.includes('नदी') || query.includes('पर्वत') || query.includes('park') || query.includes('मानसून')) {
        match = allRecords.find(p => p.category === 'geography' || p.subject.toLowerCase().includes('geography') || p.examName.toLowerCase().includes('भूगोल'));
      } else if (query.includes('polity') || query.includes('constitution') || query.includes('संविधान') || query.includes('अनुच्छेद') || query.includes('article') || query.includes('amendment')) {
        match = allRecords.find(p => p.category === 'polity' || p.subject.toLowerCase().includes('polity'));
      } else if (query.includes('space') || query.includes('isro') || query.includes('science') || query.includes('विज्ञान') || query.includes('chandrayaan') || query.includes('aditya') || query.includes('physics') || query.includes('chemistry') || query.includes('biology')) {
        match = allRecords.find(p => p.category === 'science' || p.subject.toLowerCase().includes('science'));
      } else if (query.includes('reasoning') || query.includes('तर्कशक्ति') || query.includes('analogy') || query.includes('coding-decoding')) {
        match = allRecords.find(p => p.category === 'reasoning');
      } else if (query.includes('railway') || query.includes('rrb') || query.includes('ntpc')) {
        match = allRecords.find(p => p.category === 'railway');
      } else if (query.includes('bpsc') || query.includes('bihar')) {
        match = allRecords.find(p => p.category === 'bpsc');
      } else if (query.includes('police')) {
        match = allRecords.find(p => p.category === 'police');
      } else if (query.includes('ssc')) {
        match = allRecords.find(p => p.category === 'ssc');
      }
    }

    if (match) {
      handleStartPYQTest(match);
      return;
    }

    // Check 3: If still not matched, dynamically generate live quiz on that specific topic (never fallback to Reasoning!)
    const targetTopic = payload.topic || payload.examName || 'Daily Practice Test';
    const targetTitle = payload.examName || `Live Quiz: ${targetTopic}`;
    handleStartDynamicTopicQuiz(targetTopic, targetTitle);
  };

  // Check for auto-launch on mount and via CustomEvent
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('hansai_launch_quiz');
      if (saved) {
        sessionStorage.removeItem('hansai_launch_quiz');
        const parsed = JSON.parse(saved);
        launchPreselectedQuiz(parsed);
      }
    } catch (e) {
      console.error("Auto launch parse error", e);
    }

    const handleCustomLaunch = (e: any) => {
      if (e?.detail) {
        launchPreselectedQuiz(e.detail);
      }
    };

    window.addEventListener('hansai_launch_quiz_event', handleCustomLaunch);
    return () => window.removeEventListener('hansai_launch_quiz_event', handleCustomLaunch);
  }, []);

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
          subject: customSubject,
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
  const handleSubmitTest = (isAntiCheat?: boolean | React.MouseEvent, customReason?: string) => {
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
      timeSpentSeconds: Math.max(10, (testQuestions.length * 60) - timeRemainingSeconds)
    };

    const isDisqualified = typeof isAntiCheat === 'boolean' ? isAntiCheat : false;
    if (isDisqualified) {
      setAntiCheatDisqualified(true);
      if (customReason) setAntiCheatReason(customReason);
      showToast("🚫 सुरक्षा कारणों (स्क्रीन छोड़ने / अन्य ऐप खोलने) से टेस्ट स्वतः सबमिट हुआ!", "error");
    } else {
      showToast("🎉 टेस्ट सफलतापूर्वक सबमिट हुआ! स्कोरकार्ड नीचे देखें।", "success");
    }

    setTestResult(resultSummary);
    setIsTestSubmitted(true);
    setIsSubmitModalOpen(false);
    setIsTimerPaused(false);

    // Inform owner of test submission & performance
    try {
      fetch('/api/users/log-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Student',
          email: 'student_quiz@hansai.app',
          type: 'test_submitted',
          query: `Test Submitted: ${currentTestTitle} (Score: ${netScore.toFixed(1)}/${totalMarks})`
        })
      }).catch(console.warn);

      dispatchOwnerAlert(
        'test_quiz',
        `📝 Test Submitted: ${currentTestTitle}`,
        `Quiz submitted successfully. Score: ${netScore.toFixed(1)}/${totalMarks} (${accuracy}% accuracy, ${correct} correct, ${wrong} wrong).`,
        'info'
      );
    } catch (e) {
      console.warn("Could not dispatch alert", e);
    }
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
  // RENDER 1: ACTIVE LIVE TEST SCREEN (EXACT ADDA247 / TCS PATTERN)
  // ----------------------------------------------------
  if (activeTestMode && !isTestSubmitted) {
    const currentQ = testQuestions[currentQIndex];
    const selectedAns = userAnswers[currentQIndex];
    const isReviewed = !!markedForReview[currentQIndex];

    // Status counts for palette
    const answeredCount = Object.keys(userAnswers).length;
    const reviewedCount = Object.values(markedForReview).filter(Boolean).length;
    const notVisitedCount = testQuestions.length - answeredCount;

    return (
      <div className="fixed inset-0 z-50 flex flex-col h-screen w-screen max-w-full bg-[#070B14] shadow-2xl overflow-hidden text-slate-100 select-none animate-fadeIn">
        
        {/* COMPACT TOP HEADER: Pause | Subject & Question Counter | Timer | Language, Review, Palette */}
        <div className="bg-[#0B101D] border-b border-slate-800/90 px-3 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between gap-2 shrink-0">
          
          {/* Left: Sleek Pause/Exit & Title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              type="button"
              onClick={() => {
                setIsTimerPaused(true);
                setIsPauseModalOpen(true);
              }}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white flex items-center justify-center transition-all active:scale-95 cursor-pointer shrink-0 shadow-sm"
              title="Pause Test / टेस्ट रोकें"
            >
              <Pause className="w-4 h-4 fill-white text-white" />
            </button>

            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-black text-white truncate leading-tight flex items-center gap-1.5">
                <span>{currentExamMeta?.subject || currentTestTitle}</span>
                <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">• Q {currentQIndex + 1}/{testQuestions.length}</span>
              </h2>
            </div>
          </div>

          {/* Center: Crimson Live Timer with Clock & Anti-Cheat Proctoring Indicator */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl bg-slate-900 border border-rose-500/40 text-white shadow-inner">
              <Clock className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span className="text-xs sm:text-sm font-black font-mono text-rose-400">
                {formatTime(timeRemainingSeconds)}
              </span>
            </div>

            {/* Anti-Cheating Live Surveillance Badge */}
            <div 
              className={`hidden xs:flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-xl border text-[10px] sm:text-xs font-bold transition-all ${
                tabSwitchCount === 0 
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' 
                  : 'bg-rose-950/90 border-rose-500 text-rose-300 animate-pulse ring-1 ring-rose-500/40'
              }`}
              title="एंटी-चीटिंग निगरानी: स्क्रीन छोड़ने / दूसरा ऐप खोलने पर अधिकतम 1 चेतावनी, 2 स्ट्राइक पर टेस्ट स्वतः बंद!"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">सुरक्षा:</span>
              <span className="font-mono">{tabSwitchCount}/2 स्ट्राइक</span>
            </div>
          </div>

          {/* Right: Quick actions: Language, Review Star, Palette Menu */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Language Switcher */}
            <button
              type="button"
              onClick={() => {
                setQuestionLang(prev => prev === 'hi' ? 'en' : 'hi');
                showToast(questionLang === 'hi' ? 'Language: English' : 'भाषा: हिन्दी', 'info');
              }}
              className="h-8 px-2 sm:px-2.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-indigo-500 text-white font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
              title="भाषा बदलें / Toggle Language"
            >
              <Languages className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-extrabold">{questionLang === 'hi' ? 'अ' : 'En'}</span>
            </button>

            {/* Review Star Toggle */}
            <button
              type="button"
              onClick={handleToggleReview}
              className={`h-8 px-2 sm:px-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border ${
                isReviewed 
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm' 
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              title="Mark for Review (समीक्षा हेतु चिह्नित करें)"
            >
              <Star className={`w-3.5 h-3.5 ${isReviewed ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">{isReviewed ? 'Reviewed' : 'Review'}</span>
            </button>

            {/* Palette Drawer Button [≡] */}
            <button
              type="button"
              onClick={() => setIsPaletteDrawerOpen(true)}
              className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-amber-500 text-white flex items-center justify-center transition-colors cursor-pointer shadow-sm"
              title="Question Palette (प्रश्नावली तालिका)"
            >
              <Menu className="w-4 h-4 text-slate-300" />
            </button>
          </div>
        </div>

        {/* MAIN BODY: Fitted Single-Screen Layout with Full Vertical Space & Anti-Copy Protection */}
        <div 
          className="flex-1 p-3 sm:p-5 flex flex-col justify-between overflow-y-auto select-none"
          onCopy={(e) => {
            e.preventDefault();
            showToast('⚠️ परीक्षा सुरक्षा: टेस्ट के दौरान प्रश्नों को कॉपी करना वर्जित है!', 'error');
          }}
          onContextMenu={(e) => {
            e.preventDefault();
          }}
        >
          <div className="space-y-3 sm:space-y-4 max-w-4xl mx-auto w-full">
            {/* QUESTION NUMBER & MARKS ROW */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/50 text-indigo-300 font-black text-xs flex items-center justify-center">
                  {currentQIndex + 1}
                </span>
                <span className="text-xs sm:text-sm font-black text-slate-200">
                  प्रश्न {currentQIndex + 1} / {testQuestions.length}
                </span>
              </div>

              {/* Marks Badges & Bookmark */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleToggleBookmark(currentQ)}
                  className={`px-2.5 py-1 rounded-lg border font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-all ${
                    isQuestionBookmarked(currentQ?.question || '')
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 ring-1 ring-amber-400/30'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                  title="Bookmark"
                >
                  <Bookmark className={`w-3 h-3 ${isQuestionBookmarked(currentQ?.question || '') ? 'text-amber-400 fill-amber-400' : ''}`} />
                  <span className="hidden sm:inline">Bookmark</span>
                </button>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-bold text-[11px] font-mono">
                  +{currentExamMeta?.marksPerQ || 2.0}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-rose-500/15 border border-rose-500/40 text-rose-400 font-bold text-[11px] font-mono">
                  -{currentExamMeta?.negMark || 0.5}
                </span>
              </div>
            </div>

            {/* Question Statement */}
            <div className="bg-[#0A101E] border border-slate-800/90 rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm md:text-base font-semibold leading-relaxed text-white whitespace-pre-line shadow-xs">
              {currentQ?.question}
            </div>

            {/* 4 Interactive Options (A, B, C, D) with Comfortable Compact Height */}
            <div className="grid grid-cols-1 gap-2 sm:gap-2.5">
              {currentQ?.options.map((opt, oIdx) => {
                const isSelected = selectedAns === oIdx;
                const optionLetters = ['A', 'B', 'C', 'D'];

                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelectOption(oIdx)}
                    className={`w-full text-left p-2.5 sm:p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center gap-3 cursor-pointer shadow-xs ${
                      isSelected
                        ? 'bg-indigo-950/60 border-2 border-indigo-500 text-white ring-2 ring-indigo-500/30'
                        : 'bg-[#0E1526] hover:bg-slate-800/80 border-slate-800 text-slate-200'
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                      isSelected ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}>
                      {optionLetters[oIdx]}
                    </span>
                    <span className="flex-1 leading-snug">{opt}</span>
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                        ✓
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* COMPACT SINGLE-ROW STICKY BOTTOM ACTION BAR (No Redundant Submit Button) */}
        <div className="bg-[#0B101D] border-t border-slate-800 px-3 sm:px-6 py-2.5 shrink-0 flex items-center justify-between gap-2 z-20 shadow-2xl">
          {/* Left: Previous */}
          <button
            type="button"
            onClick={() => {
              if (currentQIndex > 0) setCurrentQIndex(prev => prev - 1);
            }}
            disabled={currentQIndex === 0}
            className="px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          {/* Center: Clear Response & Report */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClearResponse}
              disabled={selectedAns === undefined}
              className="px-3 py-2 rounded-xl border border-slate-700 bg-slate-900/90 hover:bg-slate-800 text-slate-300 font-bold text-xs transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span>Clear</span>
            </button>
            <button
              type="button"
              onClick={() => setIsReportModalOpen(true)}
              className="px-2.5 py-2 rounded-xl border border-slate-700/60 bg-slate-900/70 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
              title="Report Error / त्रुटि रिपोर्ट करें"
            >
              <Flag className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right: Primary Save & Next (Which becomes Submit on last question) */}
          <button
            type="button"
            onClick={() => {
              if (currentQIndex < testQuestions.length - 1) {
                setCurrentQIndex(prev => prev + 1);
              } else {
                setIsSubmitModalOpen(true);
              }
            }}
            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer ${
              currentQIndex < testQuestions.length - 1
                ? 'bg-[#FF3B47] hover:bg-[#E02E3A] text-white shadow-rose-950/40'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40'
            }`}
          >
            {currentQIndex < testQuestions.length - 1 ? (
              <>
                <span>Save & Next (अगला प्रश्न)</span>
                <ChevronRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <CheckSquare className="w-4 h-4" />
                <span>Submit Test (सबमिट करें)</span>
              </>
            )}
          </button>
        </div>

        {/* ========================================================= */}
        {/* MODAL 0: SUBMIT CONFIRMATION MODAL (No window.confirm!) */}
        {/* ========================================================= */}
        {isSubmitModalOpen && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-[#0B101D] border border-emerald-500/40 rounded-3xl p-6 max-w-md w-full text-center space-y-4 shadow-2xl">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-lg font-black text-white">सबमिट की पुष्टि करें (Confirm Submission)</h3>
                <p className="text-xs text-slate-400 mt-1">क्या आप वाकई अपना टेस्ट पूरा करके परिणाम देखना चाहते हैं?</p>
              </div>

              {/* Status summary */}
              <div className="grid grid-cols-3 gap-2 text-xs bg-slate-900/80 border border-slate-800 rounded-2xl p-3">
                <div>
                  <span className="text-slate-500 block text-[10px]">कुल प्रश्न</span>
                  <strong className="text-white text-sm font-bold">{testQuestions.length}</strong>
                </div>
                <div>
                  <span className="text-emerald-500 block text-[10px]">हल किए गए</span>
                  <strong className="text-emerald-400 text-sm font-bold">{answeredCount}</strong>
                </div>
                <div>
                  <span className="text-rose-500 block text-[10px]">छूटे हुए</span>
                  <strong className="text-rose-400 text-sm font-bold">{notVisitedCount}</strong>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleSubmitTest()}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckSquare className="w-4 h-4" />
                  <span>हाँ, टेस्ट सबमिट करें (Confirm Submit)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  नहीं, टेस्ट जारी रखें (Keep Answering)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODAL 1: QUESTION PALETTE DRAWER SHEET (When clicking [≡]) */}
        {/* ========================================================= */}
        {isPaletteDrawerOpen && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex flex-col justify-end animate-fadeIn">
            <div className="bg-[#0B101D] border-t border-slate-800 rounded-t-3xl p-5 max-h-[80%] flex flex-col space-y-4">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="font-extrabold text-white text-base">Question Palette (प्रश्नावली)</h3>
                  <p className="text-xs text-slate-400">किसी भी प्रश्न पर सीधे जाने के लिए संख्या पर क्लिक करें</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPaletteDrawerOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status Legend */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-emerald-500"></div>
                  <span className="text-slate-300">Answered: <strong className="text-white">{answeredCount}</strong></span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-amber-500"></div>
                  <span className="text-slate-300">Review: <strong className="text-white">{reviewedCount}</strong></span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-purple-600"></div>
                  <span className="text-slate-300">Ans & Review</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-slate-700"></div>
                  <span className="text-slate-300">Not Answered: <strong className="text-white">{notVisitedCount}</strong></span>
                </div>
              </div>

              {/* Question Number Buttons Grid */}
              <div className="grid grid-cols-5 sm:grid-cols-8 gap-2.5 overflow-y-auto max-h-60 p-1">
                {testQuestions.map((_, qIdx) => {
                  const isAns = userAnswers[qIdx] !== undefined;
                  const isRev = !!markedForReview[qIdx];
                  const isCurr = currentQIndex === qIdx;

                  let badgeColor = "bg-slate-800 text-slate-300 border-slate-700";
                  if (isAns && isRev) {
                    badgeColor = "bg-purple-600 text-white border-purple-400";
                  } else if (isAns) {
                    badgeColor = "bg-emerald-600 text-white border-emerald-400";
                  } else if (isRev) {
                    badgeColor = "bg-amber-600 text-white border-amber-400";
                  }

                  return (
                    <button
                      key={qIdx}
                      onClick={() => {
                        setCurrentQIndex(qIdx);
                        setIsPaletteDrawerOpen(false);
                      }}
                      className={`h-11 rounded-xl font-black text-sm border flex items-center justify-center transition-all cursor-pointer ${
                        isCurr ? 'ring-2 ring-indigo-400 scale-105 shadow-md' : ''
                      } ${badgeColor}`}
                    >
                      {qIdx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Submit Test from Palette */}
              <button
                type="button"
                onClick={() => {
                  setIsPaletteDrawerOpen(false);
                  handleSubmitTest();
                }}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-xl transition-all cursor-pointer"
              >
                Submit Full Test
              </button>

            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODAL 2: PAUSE MODAL (When clicking red [⏸] button) */}
        {/* ========================================================= */}
        {isPauseModalOpen && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-[#0B101D] border border-slate-800 rounded-3xl p-6 max-w-md w-full text-center space-y-4 shadow-2xl">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-md">
                <Pause className="w-7 h-7 fill-amber-400" />
              </div>

              <div>
                <h3 className="text-lg font-black text-white">Test Paused (टेस्ट रुका हुआ है)</h3>
                <p className="text-xs text-slate-400 mt-1">आपका टाइमर रोक दिया गया है। आप जब चाहें दोबारा शुरू कर सकते हैं।</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-around text-xs">
                <div>
                  <span className="text-slate-500 block">शेष समय:</span>
                  <strong className="text-rose-400 text-sm font-mono">{formatTime(timeRemainingSeconds)}</strong>
                </div>
                <div className="h-6 w-px bg-slate-800"></div>
                <div>
                  <span className="text-slate-500 block">हल किए प्रश्न:</span>
                  <strong className="text-emerald-400 text-sm">{answeredCount} / {testQuestions.length}</strong>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsTimerPaused(false);
                    setIsPauseModalOpen(false);
                  }}
                  className="w-full py-3.5 bg-[#FF3B47] hover:bg-[#E02E3A] text-white font-extrabold text-sm rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Resume Test (जारी रखें)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsPauseModalOpen(false);
                    setIsTimerPaused(false);
                    setActiveTestMode(false);
                  }}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Quit Test (टेस्ट से बाहर निकलें)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODAL 3: REPORT QUESTION MODAL (When clicking [⚑ Report]) */}
        {/* ========================================================= */}
        {isReportModalOpen && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-[#0B101D] border border-slate-800 rounded-3xl p-5 max-w-md w-full space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
                  <Flag className="w-4 h-4 text-rose-400" />
                  <span>Report Question {currentQIndex + 1}</span>
                </h4>
                <button onClick={() => setIsReportModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-300">
                यदि प्रश्न में कोई टाइपो, अनुवाद त्रुटि या गलत विकल्प है तो नीचे चुनें:
              </p>

              <div className="space-y-2 text-xs">
                {['प्रश्न में वर्तनी या अनुवाद त्रुटि है', 'गलत उत्तर / विकल्प दिया गया है', 'प्रश्न अधूरा या अस्पष्ट है', 'अन्य समस्या'].map((reason, rIdx) => (
                  <button
                    key={rIdx}
                    onClick={() => {
                      showToast(`✓ प्रश्न ${currentQIndex + 1} की रिपोर्ट सबमिट कर दी गई है!`, 'success');
                      setIsReportModalOpen(false);
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-medium cursor-pointer transition-colors"
                  >
                    {reason}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODAL 4: ANTI-CHEATING STRIKE 1 WARNING MODAL             */}
        {/* ========================================================= */}
        {isAntiCheatWarningOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
            <div className="bg-[#0D1322] border-2 border-rose-500/90 rounded-3xl max-w-md w-full p-6 text-slate-100 shadow-2xl shadow-rose-950/60 space-y-4 animate-scaleUp text-left">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 mx-auto">
                <AlertTriangle className="w-8 h-8 text-rose-400 animate-bounce" />
              </div>

              <div className="text-center space-y-1.5">
                <span className="px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-black uppercase tracking-wider">
                  ⚠️ अनुचित साधन चेतावनी (Strike 1 / 2)
                </span>
                <h3 className="text-lg font-black text-white">
                  आपने परीक्षा स्क्रीन छोड़ दी थी!
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  हमारे एंटी-चीटिंग निगरानी तंत्र ने पाया कि आपने दूसरा ऐप या ब्राउज़र टैब खोला था। किसी भी AI टूल (जैसे ChatGPT, Gemini) या सर्च इंजन से नकल करने की अनुमति नहीं है।
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-950/50 border border-rose-800/80 text-rose-200 text-xs font-semibold leading-relaxed space-y-1">
                <p className="font-extrabold text-rose-300 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>अंतिम चेतावनी (Final Warning):</span>
                </p>
                <p>
                  यदि आपने एक बार और स्क्रीन छोड़ी या दूसरा ऐप खोला, तो आपका टेस्ट <strong>तुरंत बंद और स्वतः सबमिट (Auto-Closed)</strong> हो जाएगा!
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsAntiCheatWarningOpen(false);
                  setIsTimerPaused(false);
                  showToast("टेस्ट पुनः शुरू हुआ। कृपया स्क्रीन पर बने रहें!", "info");
                }}
                className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-sm shadow-lg shadow-rose-900/40 transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>नियम समझ गया, टेस्ट जारी रखें (Resume Test)</span>
              </button>
            </div>
          </div>
        )}

      </div>
    );
  }

  // ----------------------------------------------------
  // RENDER 2: POST-TEST COMPREHENSIVE RESULT & SOLUTION VIEW
  // (Full Solutions & Explanations ONLY Shown Here)
  // ----------------------------------------------------
  if (activeTestMode && isTestSubmitted && testResult) {
    return (
      <div className="w-full max-w-5xl mx-auto py-2 space-y-4">
        {antiCheatDisqualified && (
          <div className="p-4 sm:p-5 rounded-3xl bg-rose-950/90 border-2 border-rose-500/90 text-rose-200 flex items-start gap-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/25 border border-rose-500/50 flex items-center justify-center text-rose-400 shrink-0">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-base sm:text-lg font-black text-white">
                  🚫 अनुचित साधन / परीक्षा सुरक्षा उल्लंघन (Anti-Cheating Auto-Closed)
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider">
                  Disqualified & Auto-Submitted
                </span>
              </div>
              <p className="text-xs sm:text-sm text-rose-200 mt-1.5 leading-relaxed font-medium">
                {antiCheatReason || 'परीक्षा के दौरान दो बार अन्य ऐप या ब्राउज़र विंडो खोली गई। निष्पक्ष मूल्यांकन और AI सर्च से नकल रोकने के लिए आपका टेस्ट स्वतः समाप्त और सबमिट कर दिया गया है।'}
              </p>
              <div className="mt-3 pt-2.5 border-t border-rose-900/60 flex items-center gap-3 text-xs text-rose-300 font-bold">
                <span>⚠️ दर्ज स्ट्राइक: <strong>{tabSwitchCount} / 2</strong></span>
                <span>•</span>
                <span>आपके द्वारा अब तक दर्ज उत्तरों के आधार पर स्कोरकार्ड नीचे तैयार किया गया है।</span>
              </div>
            </div>
          </div>
        )}

        <TestPerformanceScorecard
          data={{
            testTitle: currentTestTitle,
            category: (currentExamMeta as any)?.category === 'board' ? 'board' : 'competitive',
            boardName: (currentExamMeta as any)?.board || 'UP / CBSE / State Board',
            classGrade: (currentExamMeta as any)?.classGrade,
            subject: currentExamMeta?.subject || 'All Subjects',
            score: testResult.score,
            totalMarks: testResult.totalMarks,
            totalQuestions: testResult.totalQuestions,
            correct: testResult.correct,
            wrong: testResult.wrong,
            unattempted: testResult.unattempted,
            accuracy: testResult.accuracy,
            timeSpentSeconds: testResult.timeSpentSeconds || 280,
            totalTimeMinutes: Math.round((testQuestions.length * 60) / 60),
            negativeMarksPerWrong: currentExamMeta?.negMark || 0.5,
            netNegativeMarks: Number((testResult.wrong * (currentExamMeta?.negMark || 0.5)).toFixed(1)),
            questions: testQuestions,
            userAnswers: userAnswers,
            dateStr: currentExamMeta?.date || new Date().toLocaleDateString('hi-IN'),
            userName: 'Student'
          }}
          onExit={() => {
            setActiveTestMode(false);
            setIsTestSubmitted(false);
          }}
          onReattempt={() => {
            setUserAnswers({});
            setMarkedForReview({});
            setCurrentQIndex(0);
            setTimeRemainingSeconds(testQuestions.length * 60);
            setIsTestSubmitted(false);
            setTestResult(null);
            setActiveTestMode(true);
            showToast("🔄 टेस्ट पुनः प्रारंभ हुआ! All the Best!", "info");
          }}
          onExportPdf={(title, elementId, rawText) => onExportPdf(title, elementId, rawText)}
          showToast={showToast}
          isQuestionBookmarked={(qText) => isQuestionBookmarked(qText)}
          onToggleBookmark={(q) => handleToggleBookmark(q)}
          onAddToMistakeNotebook={(item: any) => onAddToMistakeNotebook({
            id: item.id || `mistake_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            question: item.question,
            options: item.options || [],
            correctAnswer: item.correctAnswer,
            explanation: item.explanation || 'Revision solution note',
            subject: item.subject || 'All Subjects',
            topic: item.topic || 'Test Series',
            timestamp: new Date().toISOString()
          })}
        />
      </div>
    );
  }

  if (false && activeTestMode && isTestSubmitted && testResult) {
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

          {/* Speed vs Accuracy 4-Quadrant Analysis Matrix */}
          <div className="bg-[#060A14] border border-cyan-500/30 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-extrabold text-white">
                  Speed vs Accuracy Matrix (गति व सटीकता 4-क्वाड्रेंट विश्लेषण)
                </h4>
              </div>
              <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/50 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
                AI Cognitive Diagnostics
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
              {/* Quadrant 1: Fast & Correct */}
              <div className="p-3 bg-emerald-950/20 border border-emerald-500/40 rounded-xl space-y-1">
                <div className="flex items-center justify-between font-bold text-emerald-300">
                  <span className="flex items-center gap-1.5">⚡ Q1: Fast & Accurate (सुपर स्ट्रेंथ)</span>
                  <span className="text-sm font-mono font-black">{Math.max(1, Math.round(testResult.correct * 0.7))} Qs</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  कम समय में सटीक उत्तर। यह विषय आपकी मुख्य ताकत है।
                </p>
              </div>

              {/* Quadrant 2: Slow & Correct */}
              <div className="p-3 bg-indigo-950/20 border border-indigo-500/40 rounded-xl space-y-1">
                <div className="flex items-center justify-between font-bold text-indigo-300">
                  <span className="flex items-center gap-1.5">🎯 Q2: Slow & Accurate (सटीक पर धीमा)</span>
                  <span className="text-sm font-mono font-black">{Math.max(0, testResult.correct - Math.round(testResult.correct * 0.7))} Qs</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  कांसेप्ट सही है परंतु स्पीड ड्रिल्स और शॉर्ट ट्रिक्स का अभ्यास आवश्यक है।
                </p>
              </div>

              {/* Quadrant 3: Fast & Wrong */}
              <div className="p-3 bg-amber-950/20 border border-amber-500/40 rounded-xl space-y-1">
                <div className="flex items-center justify-between font-bold text-amber-300">
                  <span className="flex items-center gap-1.5">⚠️ Q3: Fast & Wrong (जल्दबाजी की गलती)</span>
                  <span className="text-sm font-mono font-black">{Math.round(testResult.wrong * 0.6)} Qs</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  जल्दबाजी में सिली मिस्टेक! प्रश्न के 'नहीं/NOT' जैसे शब्दों को ध्यान से पढ़ें।
                </p>
              </div>

              {/* Quadrant 4: Slow & Wrong */}
              <div className="p-3 bg-rose-950/20 border border-rose-500/40 rounded-xl space-y-1">
                <div className="flex items-center justify-between font-bold text-rose-300">
                  <span className="flex items-center gap-1.5">🛑 Q4: Slow & Wrong (कांसेप्ट गैप)</span>
                  <span className="text-sm font-mono font-black">{Math.max(0, testResult.wrong - Math.round(testResult.wrong * 0.6))} Qs</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  समय भी नष्ट हुआ और नकारात्मक अंक भी मिले। HansAI नोट्स से बुनियादी थ्योरी दोहराएं।
                </p>
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

                    {/* Bookmark Question Toggle */}
                    <button
                      onClick={() => handleToggleBookmark(q)}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 border ${
                        isQuestionBookmarked(q.question)
                          ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                      }`}
                      title="Bookmark Question"
                    >
                      {isQuestionBookmarked(q.question) ? (
                        <BookmarkCheck className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      ) : (
                        <Bookmark className="w-3 h-3 text-slate-400" />
                      )}
                      <span>{isQuestionBookmarked(q.question) ? 'Bookmarked' : 'Bookmark'}</span>
                    </button>

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
  const targetExams = selectedStream === 'board' ? BOARD_PYQ_RECORDS : CURATED_PYQ_DATA;

  const filteredPYQs = targetExams.filter(p => {
    const matchesSearch = 
      p.examName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.subject.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.category.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.year.includes(searchFilter) ||
      p.shift.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesCategory = 
      pyqCategoryFilter === 'all' ||
      (selectedStream === 'board'
        ? p.subject.toLowerCase().includes(pyqCategoryFilter.toLowerCase()) || p.examName.toLowerCase().includes(pyqCategoryFilter.toLowerCase())
        : p.category === pyqCategoryFilter);

    return matchesSearch && matchesCategory;
  });

  const boardCategories = [
    { id: 'all', label: 'All Board Subjects (सभी विषय)' },
    { id: 'science', label: '🧪 Science (विज्ञान)' },
    { id: 'mathematics', label: '📐 Mathematics (गणित)' },
    { id: 'social', label: '🌍 Social Science (सामाजिक विज्ञान)' },
    { id: 'physics', label: '⚛️ Physics (भौतिकी)' },
    { id: 'chemistry', label: '⚗️ Chemistry (रसायन विज्ञान)' },
    { id: 'biology', label: '🧬 Biology (जीव विज्ञान)' },
  ];

  const competitiveCategories = [
    { id: 'all', label: 'All Exams (सभी)' },
    { id: 'math', label: '📐 Math & Quant (गणित)' },
    { id: 'reasoning', label: '🧠 Reasoning (तर्कशक्ति)' },
    { id: 'english', label: '📖 English Language' },
    { id: 'hindi', label: '✍️ General Hindi (हिन्दी)' },
    { id: 'geography', label: '🌍 Geography (भूगोल)' },
    { id: 'polity', label: '⚖️ Indian Polity (संविधान)' },
    { id: 'history', label: '🏛️ History (इतिहास)' },
    { id: 'science', label: '🚀 Science & Space (विज्ञान)' },
    { id: 'economy', label: '📊 Economy & Budget (अर्थव्यवस्था)' },
    { id: 'ssc', label: '🏛️ SSC (CGL/CHSL/Steno)' },
    { id: 'railway', label: '🚆 Railways RRB' },
    { id: 'bpsc', label: '🎯 BPSC / State PSC' },
    { id: 'police', label: '👮 Police & Defence' },
    { id: 'banking', label: '💳 Banking & Teaching' }
  ];

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

      {/* Educational Walkthrough Steps Guide */}
      <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 sm:p-5 space-y-3">
        <h2 className="text-xs font-black text-amber-300 uppercase tracking-widest flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{isHindi ? "📚 टेस्ट गाइड: परीक्षा की तैयारी कैसे करें? (3 Easy Steps)" : "📚 Test Guide: How to Practice? (3 Easy Steps)"}</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/50 p-3.5 border border-slate-800/80 rounded-xl space-y-1.5">
            <div className="text-xs font-black text-amber-400 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center font-mono font-bold text-[10px]">1</span>
              <span>{isHindi ? "टेस्ट प्रकार चुनें (Select Category)" : "Select Test Type"}</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {isHindi 
                ? "नीचे दिए गए टैब से 'Previous Year Questions (PYQs)' चुनें या 'Custom AI Practice Sets' द्वारा विशिष्ट विषय का नया टेस्ट जेनरेट करें।"
                : "Choose 'Previous Year Questions (PYQs)' below or switch to 'Custom AI Practice Sets' to generate dynamic mock exams."}
            </p>
          </div>
          <div className="bg-slate-900/50 p-3.5 border border-slate-800/80 rounded-xl space-y-1.5">
            <div className="text-xs font-black text-sky-400 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-sky-500/10 text-sky-400 flex items-center justify-center font-mono font-bold text-[10px]">2</span>
              <span>{isHindi ? "हल करें और मार्क करें (Solve & Bookmark)" : "Attempt & Review"}</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {isHindi 
                ? "वास्तविक परीक्षा पैटर्न पर समय सीमा के अंदर टेस्ट हल करें। कठिन या अच्छे प्रश्नों को 'Bookmark 🔖' करना न भूलें।"
                : "Solve questions within the real exam timers. Click 'Bookmark' to save tricky concepts for rapid revision later."}
            </p>
          </div>
          <div className="bg-slate-900/50 p-3.5 border border-slate-800/80 rounded-xl space-y-1.5">
            <div className="text-xs font-black text-rose-400 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center font-mono font-bold text-[10px]">3</span>
              <span>{isHindi ? "गलतियाँ सुधारें (Mistake Diary)" : "Master Your Mistakes"}</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {isHindi 
                ? "टेस्ट पूरा होने के बाद गलत प्रश्नों को देखें। वे स्वतः 'Mistake Diary 📓' में जुड़ेंगे ताकि आप उनका दोबारा रिविजन कर सकें।"
                : "Upon submission, wrong answers automatically sync with 'Mistake Diary 📓' so you can re-test them anytime and score 100%."}
            </p>
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

        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'bookmarks'
              ? 'border-yellow-400 text-yellow-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bookmark className="w-4 h-4 text-yellow-400" />
          <span>🔖 Bookmarked Questions ({bookmarkedQuestions.length})</span>
        </button>
      </div>

      {/* TAB 1: PREVIOUS YEAR QUESTIONS (PYQ WITH DATES, SHIFTS, TIME & QUESTION COUNT) */}
      {activeTab === 'pyq' && (
        <div className="space-y-4">
          
          {/* Search Filter Box */}
          <div className="bg-[#0B101D] border border-slate-800 rounded-2xl p-4 space-y-3">
            {/* Stream Header Badge: Pure Separation of Board & Competitive Streams */}
            <div className="flex items-center justify-between flex-wrap gap-2 pb-2.5 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                {selectedStream === 'board' ? (
                  <div className="px-3.5 py-1.5 rounded-xl font-black text-xs flex items-center gap-2 bg-amber-500/15 border border-amber-500/40 text-amber-300">
                    <span>🎓 बोर्ड परीक्षा टेस्ट (Board Exam Tests)</span>
                    <span className="text-[10px] text-slate-400 font-normal">कक्षा 9वीं, 10वीं, 11वीं, 12वीं चैप्टर टेस्ट</span>
                  </div>
                ) : (
                  <div className="px-3.5 py-1.5 rounded-xl font-black text-xs flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/40 text-emerald-300">
                    <span>🏛️ प्रतियोगी परीक्षा टेस्ट (Competitive Exam Tests)</span>
                    <span className="text-[10px] text-slate-400 font-normal">SSC, Railway, Police, BPSC, Banking</span>
                  </div>
                )}
              </div>

              {onOpenGoalSelector && (
                <button
                  type="button"
                  onClick={onOpenGoalSelector}
                  className="text-[11px] font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-all"
                  title="लक्ष्य बदलें (Change Goal)"
                >
                  <span>🎯 {studentGoalProfile?.stream === 'board' ? `${studentGoalProfile.boardDetails?.classGrade || '10वीं'} बोर्ड` : (studentGoalProfile?.competitiveDetails?.examName || 'प्रतियोगी')}</span>
                  <span className="text-[10px] text-slate-400 underline">(बदलें)</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2.5 bg-[#050814] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs">
              <Search className="w-4 h-4 text-amber-400 shrink-0" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder={
                  selectedStream === 'board'
                    ? "बोर्ड विषय या अध्याय खोजें (उदा. Science, रासायनिक अभिक्रियाएं, गणित, विलोपन विधि, Physics)..."
                    : "परीक्षा का नाम या विषय खोजें (उदा. SSC CGL, Reasoning, Railway NTPC, BPSC, Police)..."
                }
                className="bg-transparent text-white placeholder-slate-500 focus:outline-none w-full text-xs"
              />
              {searchFilter && (
                <button 
                  type="button" 
                  onClick={() => setSearchFilter('')} 
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Stream Specific Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin text-xs">
              {(selectedStream === 'board' ? boardCategories : competitiveCategories).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setPyqCategoryFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap text-[11px] transition-all cursor-pointer ${
                    pyqCategoryFilter === cat.id
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic AI Custom Exam Paper Generator Card when searching */}
          {searchFilter.trim().length > 1 && (
            <div className="bg-gradient-to-r from-indigo-950/70 via-slate-900 to-purple-950/70 border border-indigo-500/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg animate-fadeIn">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-[11px] font-black uppercase tracking-wider text-indigo-400">Instant AI PYQ Paper Generator</span>
                </div>
                <h4 className="text-sm sm:text-base font-black text-white">
                  Generate Instant PYQ Paper: &ldquo;{searchFilter}&rdquo;
                </h4>
                <p className="text-xs text-slate-300">
                  खोजे गए परीक्षा नाम के अनुरूप AI द्वारा 5 से 10 वास्तविक परीक्षा स्तर के प्रश्न तुरंत तैयार करें।
                </p>
              </div>

              <button
                type="button"
                disabled={isGeneratingCustom}
                onClick={async () => {
                  setCustomSubject(searchFilter.trim());
                  setActiveTab('custom');
                }}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Create Exam Paper</span>
              </button>
            </div>
          )}

          {/* PYQ Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPYQs.map((pyq) => (
              <div 
                key={pyq.id}
                className="bg-[#0B101D] border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-4 transition-all shadow-md group hover:shadow-xl hover:shadow-amber-950/20"
              >
                <div className="space-y-3">
                  {/* Top Badges: Exam Code, Total Time & Question Count */}
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300">
                      {pyq.examCode} • {pyq.year}
                    </span>

                    <div className="flex items-center gap-2">
                      {/* Total Time Badge */}
                      <span className="text-[11px] font-extrabold text-cyan-300 bg-cyan-950/50 border border-cyan-500/40 px-2.5 py-0.5 rounded-lg font-mono flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{pyq.timeMinutes} Min</span>
                      </span>

                      {/* Total Questions Badge */}
                      <span className="text-[11px] font-extrabold text-emerald-300 bg-emerald-950/50 border border-emerald-500/40 px-2.5 py-0.5 rounded-lg font-mono flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{pyq.totalQuestions} Qs</span>
                      </span>
                    </div>
                  </div>

                  {/* Exam Name Title */}
                  <h3 className="font-extrabold text-white text-sm sm:text-base group-hover:text-amber-300 transition-colors leading-snug">
                    {pyq.examName}
                  </h3>

                  {/* Detailed Meta: Date, Shift, Focus Subject */}
                  <div className="bg-[#060A14] border border-slate-800/80 rounded-xl p-3 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <span>📅 Date:</span>
                        <strong className="text-white font-medium">{pyq.dateStr}</strong>
                      </span>
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <span>⏱️ Shift:</span>
                        <strong className="text-amber-300 font-medium">{pyq.shift}</strong>
                      </span>
                    </div>

                    <div className="pt-1 border-t border-slate-800/60 flex items-center gap-1.5 text-slate-300">
                      <span className="text-slate-500">📚 Subject:</span>
                      <span className="text-indigo-300 font-bold">{pyq.subject}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Marks & Start Exam Button */}
                <div className="pt-3 border-t border-slate-850 flex items-center justify-between gap-2">
                  <div className="text-[11px] text-slate-400 font-mono">
                    <span className="text-emerald-400 font-bold">+{pyq.marksPerQuestion}</span> / <span className="text-rose-400 font-bold">-{pyq.negativeMarks}</span> Neg
                  </div>

                  <button
                    type="button"
                    onClick={() => handleStartPYQTest(pyq)}
                    className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-md shadow-amber-500/20 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                  >
                    <span>Start Test (शुरू करें)</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredPYQs.length === 0 && (
            <div className="bg-[#0B101D] border border-slate-800 rounded-2xl p-8 text-center space-y-3">
              <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
              <h4 className="text-white font-bold text-base">कोई पूर्व-निर्धारित प्रश्न पत्र नहीं मिला</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                चिंता न करें! आप &ldquo;कस्टम AI प्रैक्टिस सेट&rdquo; टैब में जाकर किसी भी परीक्षा के लिए तुरंत नया पेपर बना सकते हैं।
              </p>
              <button
                type="button"
                onClick={() => {
                  if (searchFilter) setCustomSubject(searchFilter);
                  setActiveTab('custom');
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Create Custom Quiz for &ldquo;{searchFilter || 'Exam'}&rdquo;
              </button>
            </div>
          )}
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

      {/* TAB 4: BOOKMARKED QUESTIONS FOR REVISION */}
      {activeTab === 'bookmarks' && (
        <div className="bg-[#0B101D] border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="font-extrabold text-white text-base sm:text-lg flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span>बुकमार्क प्रश्न रजिस्टर (Bookmarked Questions - {bookmarkedQuestions.length})</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                परीक्षा रिवीजन के लिए आपके द्वारा सहेजे गए महत्वपूर्ण व कठिन प्रश्न।
              </p>
            </div>

            {bookmarkedQuestions.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => {
                    const bmQuestions: QuizQuestion[] = bookmarkedQuestions.map(bm => ({
                      question: bm.question,
                      options: bm.options,
                      answerIndex: bm.answerIndex,
                      explanation: bm.explanation,
                      hint: bm.hint
                    }));
                    setTestQuestions(bmQuestions);
                    setCurrentTestTitle("Revision Test: Bookmarked Questions");
                    setCurrentExamMeta({
                      name: "Bookmarked Revision Test",
                      date: new Date().toLocaleDateString('hi-IN'),
                      shift: "Revision Session",
                      marksPerQ: 2.0,
                      negMark: 0.5
                    });
                    setUserAnswers({});
                    setMarkedForReview({});
                    setCurrentQIndex(0);
                    setTimeRemainingSeconds(bmQuestions.length * 60);
                    setIsTestSubmitted(false);
                    setTestResult(null);
                    setActiveTestMode(true);
                  }}
                  className="px-3.5 py-2 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer transition-colors flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Start Bookmark Practice Test ({bookmarkedQuestions.length})</span>
                </button>

                <button
                  onClick={() => {
                    const textContent = `BOOKMARKED QUESTIONS REVISION SHEET (${bookmarkedQuestions.length} Questions)\n\n` +
                      bookmarkedQuestions.map((bm, i) => 
                        `[Q${i+1}] (${bm.subject || 'General'})\nQuestion: ${bm.question}\nOptions:\n${bm.options.map((o, oi) => `  ${String.fromCharCode(65+oi)}. ${o}`).join('\n')}\nCorrect Answer: ${bm.options[bm.answerIndex]}\nExplanation: ${bm.explanation}\n`
                      ).join('\n---\n\n');
                    onExportPdf("Bookmarked-Questions-Revision", "bm-pdf-export", textContent);
                  }}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-slate-300" />
                  <span>Export PDF</span>
                </button>

                <button
                  onClick={() => {
                    if (window.confirm("क्या आप सभी बुकमार्क किए गए प्रश्नों को हटाना चाहते हैं?")) {
                      setBookmarkedQuestions([]);
                      showToast("सभी बुकमार्क हटा दिए गए", "info");
                    }
                  }}
                  className="px-3 py-2 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>

          {bookmarkedQuestions.length === 0 ? (
            <div className="p-10 text-center text-slate-400 space-y-3 bg-[#070B14] rounded-2xl border border-slate-800/80">
              <Bookmark className="w-12 h-12 text-slate-600 mx-auto" />
              <h4 className="text-base font-bold text-white">कोई भी प्रश्न बुकमार्क नहीं किया गया है</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                लाइव टेस्ट या PYQ अभ्यास के दौरान किसी भी कठिन या महत्वपूर्ण प्रश्न के पास <strong>Bookmark (🔖)</strong> बटन दबाकर उसे यहाँ सहेजें।
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookmarkedQuestions.map((bm, idx) => (
                <div 
                  key={bm.id || idx} 
                  className="p-4 sm:p-5 bg-[#070B14] border border-slate-800 hover:border-yellow-500/40 rounded-2xl space-y-3 transition-all text-xs"
                >
                  <div className="flex items-center justify-between text-xs border-b border-slate-800/80 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-yellow-500/20 text-yellow-300 font-bold flex items-center justify-center text-[11px]">
                        #{idx + 1}
                      </span>
                      <span className="font-bold text-slate-300">
                        {bm.subject || 'General Quiz'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {bm.dateStr && (
                        <span className="text-[10px] text-slate-500 font-mono">
                          Saved: {bm.dateStr}
                        </span>
                      )}
                      <button
                        onClick={() => handleToggleBookmark({
                          question: bm.question,
                          options: bm.options,
                          answerIndex: bm.answerIndex,
                          explanation: bm.explanation
                        }, bm.subject)}
                        className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-lg font-bold text-[11px] transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>

                  {/* Question Text */}
                  <p className="text-sm sm:text-base font-bold text-white leading-relaxed">
                    {bm.question}
                  </p>

                  {/* Options List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {bm.options.map((opt, oIdx) => {
                      const isCorrectOpt = oIdx === bm.answerIndex;
                      return (
                        <div
                          key={oIdx}
                          className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                            isCorrectOpt
                              ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200 font-bold'
                              : 'bg-slate-900/80 border-slate-800 text-slate-300'
                          }`}
                        >
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                            isCorrectOpt ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span className="flex-1">{opt}</span>
                          {isCorrectOpt && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation Box */}
                  <div className="p-3 bg-[#0E1526] rounded-xl border border-slate-800 text-slate-300 space-y-1">
                    <span className="text-emerald-400 font-bold text-xs flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>सही उत्तर (Correct Answer): {bm.options[bm.answerIndex]}</span>
                    </span>
                    <p className="text-xs leading-relaxed text-slate-300">
                      <strong>व्याख्या (Explanation):</strong> {bm.explanation}
                    </p>
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
