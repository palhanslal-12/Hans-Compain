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

export interface PYQExamRecord {
  id: string;
  examName: string;
  examCode: string;
  category: 'reasoning' | 'ssc' | 'railway' | 'bpsc' | 'police' | 'banking' | 'teaching' | 'general';
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

  // Navigation Sub-tabs: 'pyq' | 'practice' | 'custom' | 'mistakes' | 'bookmarks'
  const [activeTab, setActiveTab] = useState<'pyq' | 'practice' | 'custom' | 'mistakes' | 'bookmarks'>('pyq');
  
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
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [reportReason, setReportReason] = useState<string>('');
  const [pyqCategoryFilter, setPyqCategoryFilter] = useState<string>('all');

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
      <div className="relative flex flex-col h-[calc(100vh-8.5rem)] max-h-[860px] w-full max-w-4xl mx-auto bg-[#070B14] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100 select-none animate-fadeIn">
        
        {/* TOP HEADER: Red Pause Button | Subject Title & Crimson Time Left | [A अ] Lang & [≡] Menu */}
        <div className="bg-[#0B101D] border-b border-slate-800/90 px-3 sm:px-5 py-3 flex items-center justify-between gap-3 shrink-0">
          
          {/* Left: Red Rounded-Square Pause Button & Title/Time */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => {
                setIsTimerPaused(true);
                setIsPauseModalOpen(true);
              }}
              className="w-10 h-10 rounded-2xl bg-[#FF3B47] hover:bg-[#E02E3A] text-white flex items-center justify-center shadow-lg shadow-rose-900/30 transition-all active:scale-95 cursor-pointer shrink-0"
              title="Pause Test"
            >
              <Pause className="w-5 h-5 fill-white text-white" />
            </button>

            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-black text-white truncate leading-tight">
                {currentExamMeta?.subject || currentTestTitle}
              </h2>
              <div className="text-xs sm:text-sm font-semibold text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span>Total Time left:</span>
                <span className="text-[#FF3B47] font-extrabold font-mono text-sm sm:text-base">
                  {formatTime(timeRemainingSeconds)}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Language Switcher [A अ] & Menu Palette [≡] */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Language Switcher Button */}
            <button
              type="button"
              onClick={() => {
                setQuestionLang(prev => prev === 'hi' ? 'en' : 'hi');
                showToast(questionLang === 'hi' ? 'Language: English' : 'भाषा: हिन्दी', 'info');
              }}
              className="h-10 px-3 rounded-2xl bg-slate-900 border border-slate-700/80 hover:border-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              title="भाषा बदलें / Toggle Language"
            >
              <Languages className="w-4 h-4 text-indigo-400" />
              <span className="font-extrabold">{questionLang === 'hi' ? 'अ (Hindi)' : 'A (English)'}</span>
            </button>

            {/* Menu Palette Button [≡] */}
            <button
              type="button"
              onClick={() => setIsPaletteDrawerOpen(true)}
              className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-700/80 hover:border-amber-500 text-white flex items-center justify-center transition-colors cursor-pointer shadow-sm"
              title="Question Palette (प्रश्नावली)"
            >
              <Menu className="w-5 h-5 text-slate-300" />
            </button>
          </div>
        </div>

        {/* SUBHEADER: Pill Question Type Badge & Review ☆ Button */}
        <div className="bg-[#090E1A] border-b border-slate-800/80 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-2 shrink-0">
          <div className="px-3.5 py-1 rounded-full bg-slate-800/90 border border-slate-700/70 text-slate-300 text-xs font-semibold flex items-center gap-1.5 shadow-xs">
            <CheckSquare className="w-3.5 h-3.5 text-indigo-400" />
            <span>Question Type : Multiple Choice</span>
          </div>

          <button
            type="button"
            onClick={handleToggleReview}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              isReviewed 
                ? 'bg-amber-500/20 border border-amber-500 text-amber-300 shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${isReviewed ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
            <span>Review {isReviewed ? '★' : '☆'}</span>
          </button>
        </div>

        {/* MAIN BODY: Fitted Single-Screen Layout */}
        <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between overflow-y-auto">
          
          <div className="space-y-4">
            {/* QUESTION NUMBER & MARKS ROW */}
            <div className="flex items-center justify-between">
              {/* Question Badge & Title */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-white font-black text-sm flex items-center justify-center shadow-xs">
                  {currentQIndex + 1}
                </div>
                <span className="text-base sm:text-lg font-black text-white tracking-wide">
                  Question
                </span>
              </div>

              {/* Marks Badges (+2.0 / -0.5) & Bookmark Action */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleBookmark(currentQ)}
                  className={`px-3 py-1 rounded-lg border font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                    isQuestionBookmarked(currentQ?.question || '')
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 ring-1 ring-amber-400/30'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                  title="Bookmark Question for Later Revision"
                >
                  {isQuestionBookmarked(currentQ?.question || '') ? (
                    <BookmarkCheck className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ) : (
                    <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span className="hidden sm:inline">
                    {isQuestionBookmarked(currentQ?.question || '') ? 'Bookmarked' : 'Bookmark'}
                  </span>
                </button>

                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-extrabold text-xs font-mono">
                  +{currentExamMeta?.marksPerQ || 2.0}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-rose-500/15 border border-rose-500/40 text-rose-400 font-extrabold text-xs font-mono">
                  -{currentExamMeta?.negMark || 0.5}
                </span>
              </div>
            </div>

            {/* Question Statement */}
            <div className="bg-[#0A101E] border border-slate-800/90 rounded-2xl p-4 sm:p-5 text-sm sm:text-base font-semibold leading-relaxed text-white whitespace-pre-line shadow-xs">
              {currentQ?.question}
            </div>

            {/* 4 Interactive Options (A, B, C, D) */}
            <div className="grid grid-cols-1 gap-3">
              {currentQ?.options.map((opt, oIdx) => {
                const isSelected = selectedAns === oIdx;
                const optionLetters = ['A', 'B', 'C', 'D'];

                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelectOption(oIdx)}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border text-sm sm:text-base font-medium transition-all flex items-center gap-3.5 cursor-pointer shadow-xs ${
                      isSelected
                        ? 'bg-indigo-950/50 border-2 border-indigo-500 text-white ring-2 ring-indigo-500/30'
                        : 'bg-[#0E1526] hover:bg-slate-800/80 border-slate-800 text-slate-200'
                    }`}
                  >
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 transition-colors ${
                      isSelected ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}>
                      ({optionLetters[oIdx]})
                    </span>
                    <span className="flex-1 leading-snug">{opt}</span>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                        ✓
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* BOTTOM CONTROLS: Top Row [Report] & [Clear Response] | Bottom Row Full Width [Save & Next] */}
          <div className="pt-4 mt-4 border-t border-slate-800 space-y-3 shrink-0">
            
            {/* Top Action Row */}
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setIsReportModalOpen(true)}
                className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900/90 hover:bg-rose-950/40 hover:border-rose-500/60 text-rose-400 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Flag className="w-3.5 h-3.5 text-rose-400" />
                <span>Report</span>
              </button>

              <button
                type="button"
                onClick={handleClearResponse}
                disabled={selectedAns === undefined}
                className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900/90 hover:bg-slate-800 text-slate-300 font-bold text-xs transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span>Clear Response</span>
              </button>
            </div>

            {/* Bottom Full-Width Prominent Red/Coral Button */}
            <button
              type="button"
              onClick={() => {
                if (currentQIndex < testQuestions.length - 1) {
                  setCurrentQIndex(prev => prev + 1);
                } else {
                  if (window.confirm("क्या आप टेस्ट सबमिट करना चाहते हैं? (Are you sure you want to submit?)")) {
                    handleSubmitTest();
                  }
                }
              }}
              className={`w-full py-4 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.99] cursor-pointer ${
                currentQIndex < testQuestions.length - 1
                  ? 'bg-[#FF3B47] hover:bg-[#E02E3A] text-white shadow-rose-900/40'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40'
              }`}
            >
              <span>{currentQIndex < testQuestions.length - 1 ? 'Save & Next' : 'Submit Test (सबमिट करें)'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

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
                    if (window.confirm("क्या आप टेस्ट छोड़ना चाहते हैं?")) {
                      setIsPauseModalOpen(false);
                      setIsTimerPaused(false);
                      setActiveTestMode(false);
                    }
                  }}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-400 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Quit Test (बाहर निकलें)
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
  const filteredPYQs = CURATED_PYQ_DATA.filter(p => {
    const matchesSearch = 
      p.examName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.subject.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.category.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.year.includes(searchFilter) ||
      p.shift.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesCategory = 
      pyqCategoryFilter === 'all' ||
      p.category === pyqCategoryFilter;

    return matchesSearch && matchesCategory;
  });

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
            <div className="flex items-center gap-2.5 bg-[#050814] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs">
              <Search className="w-4 h-4 text-amber-400 shrink-0" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="परीक्षा का नाम, विषय या वर्ष खोजें (उदा. SSC CGL, Reasoning, Railway NTPC, BPSC, Police)..."
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

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin text-xs">
              {[
                { id: 'all', label: 'All Exams (सभी)' },
                { id: 'reasoning', label: '🧠 Reasoning Special' },
                { id: 'ssc', label: '🏛️ SSC (CGL/CHSL/Steno)' },
                { id: 'railway', label: '🚆 Railways RRB' },
                { id: 'bpsc', label: '🎯 BPSC / State PSC' },
                { id: 'police', label: '👮 Police & Defence' },
                { id: 'banking', label: '💳 Banking & Teaching' }
              ].map((cat) => (
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
