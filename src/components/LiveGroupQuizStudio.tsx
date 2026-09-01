import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, Volume2, VolumeX, Trophy, Clock, CheckCircle2, XCircle, 
  Sparkles, Play, Plus, ArrowRight, Share2, Copy, Check, RefreshCw, 
  Flame, Award, ShieldAlert, BookOpen, AlertCircle, Download, 
  HelpCircle, MessageSquare, Zap, Radio, ChevronRight, BarChart2,
  Smile, UserCheck, Star, QrCode, MessageCircle, Send, Mic, MicOff,
  Maximize2, Minimize2, GraduationCap, Compass, Layers, PlusCircle,
  HelpCircle as QuestionIcon
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

// Built-in Comprehensive Question Bank for Competitive & Board Exams
const QUESTION_BANK: Record<string, QuizQuestion[]> = {
  // 1. COMPETITIVE EXAMS
  gk_polity: [
    {
      question: "भारतीय संविधान का कौन सा अनुच्छेद 'समान नागरिक संहिता' (UCC) से संबंधित है?",
      options: ["अनुच्छेद 40", "अनुच्छेद 44", "अनुच्छेद 48", "अनुच्छेद 51A"],
      answerIndex: 1,
      explanation: "अनुच्छेद 44 राज्य के नीति निर्देशक सिद्धांतों (DPSP) के तहत नागरिकों के लिए समान नागरिक संहिता का प्रावधान करता है।",
      hint: "यह नीति निर्देशक तत्वों के अंतर्गत आता है।"
    },
    {
      question: "किस संविधान संशोधन अधिनियम द्वारा प्रस्तावना में 'समाजवादी', 'धर्मनिरपेक्ष' और 'अखंडता' शब्द जोड़े गए?",
      options: ["42वाँ संशोधन 1976", "44वाँ संशोधन 1978", "52वाँ संशोधन 1985", "86वाँ संशोधन 2002"],
      answerIndex: 0,
      explanation: "42वें संविधान संशोधन 1976 (मिनी कॉन्स्टिट्यूशन) द्वारा प्रस्तावना में ये तीनों शब्द जोड़े गए थे।",
      hint: "इसे लघु संविधान भी कहा जाता है।"
    },
    {
      question: "भारत के नियंत्रक एवं महालेखापरीक्षक (CAG) की नियुक्ति संविधान के किस अनुच्छेद के तहत होती है?",
      options: ["अनुच्छेद 76", "अनुच्छेद 148", "अनुच्छेद 280", "अनुच्छेद 324"],
      answerIndex: 1,
      explanation: "अनुच्छेद 148 के तहत भारत के राष्ट्रपति द्वारा CAG की नियुक्ति की जाती है।",
      hint: "यह सार्वजनिक धन का संरक्षक होता है।"
    },
    {
      question: "संविधान के किस अनुच्छेद के तहत वित्तीय आपातकाल (Financial Emergency) घोषित किया जा सकता है?",
      options: ["अनुच्छेद 352", "अनुच्छेद 356", "अनुच्छेद 360", "अनुच्छेद 368"],
      answerIndex: 2,
      explanation: "अनुच्छेद 360 के तहत राष्ट्रपति वित्तीय आपातकाल घोषित कर सकते हैं, जो भारत में अब तक एक बार भी नहीं लगा है।",
      hint: "यह अब तक भारत में कभी लागू नहीं हुआ।"
    }
  ],
  history: [
    {
      question: "1857 के प्रथम स्वतंत्रता संग्राम के समय भारत का गवर्नर जनरल कौन था?",
      options: ["लॉर्ड डलहौजी", "लॉर्ड कैनिंग", "लॉर्ड कर्जन", "लॉर्ड रिपन"],
      answerIndex: 1,
      explanation: "लॉर्ड कैनिंग 1857 के विद्रोह के समय भारत के गवर्नर जनरल थे और 1858 में भारत के पहले वायसराय बने।",
      hint: "वे 1858 के बाद भारत के प्रथम वायसराय भी बने।"
    },
    {
      question: "सिंधु घाटी सभ्यता का प्रमुख बंदरगाह (Dockyard) नगर कौन-सा था?",
      options: ["कालीबंगा", "लोथल", "मोहनजोदड़ो", "हड़प्पा"],
      answerIndex: 1,
      explanation: "गुजरात के भोगवा नदी तट पर स्थित 'लोथल' सिंधु सभ्यता का प्राचीन प्रमुख बंदरगाह था।",
      hint: "यह वर्तमान गुजरात राज्य में स्थित है।"
    },
    {
      question: "महात्मा गांधी ने किस घटना के बाद 'असहयोग आंदोलन' (Non-Cooperation Movement) वापस ले लिया था?",
      options: ["जलियांवाला बाग हत्याकांड", "चौरी-चौरा कांड (1922)", "काकोरी ट्रेन एक्शन", "गांधी-इरविन समझौता"],
      answerIndex: 1,
      explanation: "फरवरी 1922 में उत्तर प्रदेश के गोरखपुर में चौरी-चौरा हिंसक घटना के बाद गांधीजी ने असहयोग आंदोलन स्थगित कर दिया था।",
      hint: "गोरखपुर के निकट घटी हिंसक घटना।"
    },
    {
      question: "त्रिपिटक (Tripitaka) धर्मग्रंथ किस धर्म से संबंधित है?",
      options: ["जैन धर्म", "बौद्ध धर्म", "वैदिक धर्म", "सिख धर्म"],
      answerIndex: 1,
      explanation: "त्रिपिटक (विनय पिटक, सुत्त पिटक, अभिधम्म पिटक) बौद्ध धर्म के मूल प्रमाणिक ग्रंथ हैं।",
      hint: "भगवान बुद्ध के उपदेशों का संग्रह।"
    }
  ],
  science: [
    {
      question: "मानव आँख में किसी वस्तु का प्रतिबिम्ब कहाँ बनता है?",
      options: ["कॉर्निया", "पुतली", "रेटिना (दृष्टिपटल)", "परितारिका"],
      answerIndex: 2,
      explanation: "मानव आँख में लेंस द्वारा वास्तविक और उल्टा प्रतिबिम्ब रेटिना पर बनता है जिसे मस्तिष्क सीधा पहचानता है।",
      hint: "यह आंख का पिछला संवेदी पर्दा है।"
    },
    {
      question: "विद्युत धारा (Electric Current) का SI मात्रक क्या है?",
      options: ["वोल्ट (Volt)", "एम्पीयर (Ampere)", "ओम (Ohm)", "वाट (Watt)"],
      answerIndex: 1,
      explanation: "विद्युत धारा का SI मात्रक एम्पीयर (A) है और इसे अमीटर द्वारा श्रेणीक्रम में मापा जाता है।",
      hint: "आंद्रे-मैरी के नाम पर रखा गया मात्रक।"
    },
    {
      question: "ध्वनि तरंगे किस माध्यम में सबसे तीव्र गति से गमन करती हैं?",
      options: ["निर्वात (Vacuum)", "गैस", "द्रव", "ठोस (Solid)"],
      answerIndex: 3,
      explanation: "ध्वनि तरंगे प्रत्यास्थता (Elasticity) अधिक होने के कारण ठोस (जैसे इस्पात) में सबसे तेज चलती हैं।",
      hint: "धातुओं में ध्वनि सबसे तेज चलती है।"
    },
    {
      question: "मानव शरीर की सबसे बड़ी अंतःस्रावी ग्रंथि (Largest Endocrine Gland) कौन सी है?",
      options: ["पीयूष ग्रंथि", "थायरॉयड ग्रंथि", "अग्न्याशय", "थाइमस"],
      answerIndex: 1,
      explanation: "थायरॉयड ग्रंथि (Thyroid Gland) गले में स्थित सबसे बड़ी अंतःस्रावी ग्रंथि है जो थायरोक्सिन हार्मोन स्रावित करती है।",
      hint: "यह गले में तितली के आकार की होती है।"
    }
  ],
  reasoning: [
    {
      question: "निम्नलिखित श्रृंखला में प्रश्नचिह्न (?) के स्थान पर क्या आएगा?\n3, 7, 16, 35, 74, ?",
      options: ["149", "153", "150", "148"],
      answerIndex: 1,
      explanation: "पैटर्न: (3×2)+1=7, (7×2)+2=16, (16×2)+3=35, (35×2)+4=74, (74×2)+5=153।",
      hint: "×2 + n पैटर्न।"
    },
    {
      question: "यदि 'A' का अर्थ '+', 'B' का अर्थ '-', 'C' का अर्थ '×', और 'D' का अर्थ '÷' है, तो 18 C 4 A 12 D 3 B 6 का मान क्या होगा?",
      options: ["70", "72", "76", "68"],
      answerIndex: 0,
      explanation: "BODMAS नियम: 18 × 4 + (12 ÷ 3) - 6 = 72 + 4 - 6 = 76 - 6 = 70।",
      hint: "पहले भाग फिर गुणा करें।"
    },
    {
      question: "दिए गए विकल्पों में से विषम संख्या युग्म चुनिए:\n(A) 12 : 144  (B) 14 : 196  (C) 16 : 256  (D) 18 : 320",
      options: ["12 : 144", "14 : 196", "16 : 256", "18 : 320"],
      answerIndex: 3,
      explanation: "सभी विकल्पों में पहली संख्या का वर्ग दूसरी संख्या है, लेकिन 18² = 324 होता है (यहाँ 320 दिया है)।",
      hint: "संख्याओं का वर्ग देखें।"
    }
  ],
  current_affairs: [
    {
      question: "भारत के पहले स्वदेशी सौर मिशन का नाम क्या है जिसे इसरो द्वारा सफलतापूर्वक प्रक्षेपित किया गया?",
      options: ["चंद्रयान-3", "आदित्य-L1", "गगनयान", "शुक्रयान-1"],
      answerIndex: 1,
      explanation: "इसरो द्वारा सूर्य का अध्ययन करने के लिए आदित्य-L1 को लैग्रेंजियन बिंदु L1 के चारों ओर हेलो कक्षा में स्थापित किया गया।",
      hint: "सूर्य का पर्यायवाची नाम है।"
    },
    {
      question: "हाल ही में घोषित 'प्रधानमंत्री सूर्य घर मुफ्त बिजली योजना' का मुख्य उद्देश्य क्या है?",
      options: ["1 करोड़ घरों की छतों पर सोलर पैनल लगाना", "मुफ्त गैस सिलेंडर देना", "किसानों को मुफ्त ट्रैक्टर देना", "सड़क निर्माण"],
      answerIndex: 0,
      explanation: "इस योजना के अंतर्गत 1 करोड़ परिवारों को 300 यूनिट तक मुफ्त सौर ऊर्जा बिजली प्रदान करने का लक्ष्य है।",
      hint: "रूफटॉप सोलर पैनल से जुड़ा है।"
    }
  ],

  // 2. BOARD EXAMS (10th & 12th CBSE / UP BOARD / BIHAR BOARD / STATE BOARDS)
  board_10_science: [
    {
      question: "पौधों में प्रकाश संश्लेषण (Photosynthesis) के दौरान कौन-सी गैस उत्सर्जित होती है?",
      options: ["कार्बन डाइऑक्साइड (CO₂)", "ऑक्सीजन (O₂)", "नाइट्रोजन (N₂)", "हाइड्रोजन (H₂)"],
      answerIndex: 1,
      explanation: "प्रकाश संश्लेषण में जल (H₂O) के प्रकाशीय अपघटन से ऑक्सीजन गैस उप-उत्पाद के रूप में निकलती है।",
      hint: "प्राणवायु गैस।"
    },
    {
      question: "अम्ल और क्षार की परस्पर अभिक्रिया से लवण और जल बनने की रासायनिक प्रक्रिया क्या कहलाती है?",
      options: ["संयोजन अभिक्रिया", "उदासीनीकरण अभिक्रिया (Neutralization)", "अपघटन अभिक्रिया", "विस्थापन अभिक्रिया"],
      answerIndex: 1,
      explanation: "Acid + Base → Salt + Water (जैसे HCl + NaOH → NaCl + H₂O), इसे उदासीनीकरण कहते हैं।",
      hint: "pH मान 7 के करीब आता है।"
    },
    {
      question: "पादप में जल एवं खनिज लवणों का संवहन किसके द्वारा होता है?",
      options: ["फ्लोएम (Phloem)", "जाइलम (Xylem)", "रंध्र (Stomata)", "क्लोरोप्लास्ट"],
      answerIndex: 1,
      explanation: "जाइलम ऊतक जड़ों से जल व खनिजों को पौधों के ऊपरी भागों तक पहुंचाता है।",
      hint: "जाइलम = जल, फ्लोएम = फल/भोजन।"
    },
    {
      question: "एक अवतल दर्पण (Concave Mirror) की फोकस दूरी 20 सेमी है। इसकी वक्रता त्रिज्या (Radius of Curvature) क्या होगी?",
      options: ["10 सेमी", "20 सेमी", "40 सेमी", "80 सेमी"],
      answerIndex: 2,
      explanation: "सूत्र: R = 2f, अतः R = 2 × 20 = 40 सेमी।",
      hint: "वक्रता त्रिज्या फोकस दूरी की दोगुनी होती है।"
    }
  ],
  board_10_maths: [
    {
      question: "यदि द्विघात समीकरण ax² + bx + c = 0 के मूल वास्तविक और समान हों, तो विविक्तकर (Discriminant, D) का मान क्या होगा?",
      options: ["D > 0", "D = 0", "D < 0", "D ≤ 0"],
      answerIndex: 1,
      explanation: "जब विविक्तकर b² - 4ac = 0 होता है, तब दोनों मूल वास्तविक एवं बराबर (-b/2a) होते हैं।",
      hint: "D = b² - 4ac शून्य के बराबर होता है।"
    },
    {
      question: "यदि sin θ = 3/5 है, तो cos θ का मान क्या होगा?",
      options: ["4/5", "5/4", "3/4", "1/2"],
      answerIndex: 0,
      explanation: "cos θ = √(1 - sin²θ) = √(1 - 9/25) = √(16/25) = 4/5।",
      hint: "त्रिकोणमितीय सर्वसमिका sin²θ + cos²θ = 1 लगाएं।"
    },
    {
      question: "समांतर श्रेणी (A.P.) 2, 7, 12, ... का 10वाँ पद क्या होगा?",
      options: ["45", "47", "50", "52"],
      answerIndex: 1,
      explanation: "a = 2, d = 5. an = a + (n - 1)d = 2 + (10 - 1)×5 = 2 + 45 = 47।",
      hint: "aₙ = a + (n-1)d सूत्र लगाएं।"
    }
  ],
  board_10_sst: [
    {
      question: "भारत में 'जलियांवाला बाग हत्याकांड' किस वर्ष और किस शहर में हुआ था?",
      options: ["1919 - अमृतसर", "1920 - लाहौर", "1917 - चंपारण", "1922 - गोरखपुर"],
      answerIndex: 0,
      explanation: "13 अप्रैल 1919 (बैसाखी के दिन) अमृतसर में जनरल डायर ने निहत्थी भीड़ पर गोलियां चलवाई थीं।",
      hint: "रॉलेट एक्ट के विरोध में सभा हो रही थी।"
    },
    {
      question: "काली मिट्टी (Black Soil) किस फसल की खेती के लिए सर्वाधिक उपयुक्त मानी जाती है?",
      options: ["कपास (Cotton)", "गेहूं", "चाय", "जूट"],
      answerIndex: 0,
      explanation: "काली मिट्टी को 'रेगुर मिट्टी' भी कहते हैं जो नमी धारण करने की उच्च क्षमता के कारण कपास की खेती हेतु सर्वोत्तम है।",
      hint: "इसे रेगुर मिट्टी भी कहते हैं।"
    }
  ],
  board_12_physics: [
    {
      question: "विद्युत क्षेत्र की तीव्रता (Electric Field Intensity) का SI मात्रक क्या है?",
      options: ["न्यूटन / कूलॉम (N/C)", "जूल / कूलॉम", "कूलॉम / मीटर", "वोल्ट-मीटर"],
      answerIndex: 0,
      explanation: "विद्युत क्षेत्र E = F/q, अतः इसका मात्रक न्यूटन प्रति कूलॉम (N/C) अथवा वोल्ट प्रति मीटर (V/m) होता है।",
      hint: "बल प्रति इकाई आवेश।"
    },
    {
      question: "लेंस की क्षमता (Power of Lens) का SI मात्रक क्या है?",
      options: ["डायोप्टर (Dioptre, D)", "मीटर", "ल्यूमेन", "कैंडेला"],
      answerIndex: 0,
      explanation: "P = 1/f (मीटर में), इसका मात्रक डायोप्टर (D) होता है।",
      hint: "चश्मे के नंबर का मात्रक।"
    },
    {
      question: "प्रकाश विद्युत प्रभाव (Photoelectric Effect) की सफल व्याख्या करने हेतु अल्बर्ट आइंस्टीन को किस वर्ष नोबेल पुरस्कार दिया गया?",
      options: ["1905", "1921", "1930", "1942"],
      answerIndex: 1,
      explanation: "आइंस्टीन को प्रकाश विद्युत प्रभाव और फोटॉन सिद्धांत की व्याख्या हेतु 1921 का भौतिकी नोबेल पुरस्कार मिला था।",
      hint: "फोटॉन ऊर्जा E = hν सिद्धांत।"
    }
  ],
  board_12_chemistry: [
    {
      question: "आदर्श गैस समीकरण (Ideal Gas Equation) का सही रूप क्या है?",
      options: ["PV = nRT", "P/V = RT", "PT = nVR", "PV = n/T"],
      answerIndex: 0,
      explanation: "बॉयल, चार्ल्स और आवोगाद्रो के नियमों को मिलाने पर PV = nRT प्राप्त होता है।",
      hint: "P = दाब, V = आयतन, n = मोल, R = गैस स्थिरांक, T = ताप।"
    },
    {
      question: "गैल्वेनिक सेल (Galvanic Cell) में एनोड (Anode) पर कौन-सी अभिक्रिया होती है?",
      options: ["ऑक्सीकरण (Oxidation)", "अपचयन (Reduction)", "उदासीनीकरण", "अवक्षेपण"],
      answerIndex: 0,
      explanation: "विद्युत रासायनिक सेलों में एनोड पर सदैव ऑक्सीकरण (इलेक्ट्रॉन त्यागना) होता है (An Ox).",
      hint: "Anode = Oxidation (AnOx rule)."
    }
  ],
  board_12_biology: [
    {
      question: "आनुवंशिकी के जनक (Father of Genetics) किन्हें कहा जाता है जिन्होंने मटर के पौधों पर प्रयोग किए?",
      options: ["ग्रेगर जोहान मेंडल", "चार्ल्स डार्विन", "ह्यूगो डी व्रीज", "लैमार्क"],
      answerIndex: 0,
      explanation: "मेंडल ने पाइसम सटाइवम (उद्यान मटर) पर संकरण प्रयोग कर आनुवंशिकता के मूल नियम प्रतिपादित किए।",
      hint: "प्रभाविता एवं पृथक्करण का नियम।"
    },
    {
      question: "डीएनए (DNA) का द्विकुंडली मॉडल (Double Helix Model) 1953 में किसने प्रस्तुत किया था?",
      options: ["वाटसन एवं क्रिक", "रॉबर्ट हुक", "श्लीडेन एवं श्वान", "हरगोविंद खुराना"],
      answerIndex: 0,
      explanation: "जेम्स वाटसन और फ्रांसिस क्रिक ने डीएनए की द्विकुंडलीय संरचना का मॉडल प्रस्तुत किया था।",
      hint: "वाटसन और क्रिक मॉडल।"
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

  // Exam Selection: Competitive Exam vs Board Exam
  const [examType, setExamType] = useState<'competitive' | 'board'>('competitive');
  const [boardClass, setBoardClass] = useState<'10th' | '12th_science' | '12th_arts'>('10th');
  const [selectedSubject, setSelectedSubject] = useState<string>('gk_polity');
  
  // Question Count & Unlimited Mode
  const [questionCountChoice, setQuestionCountChoice] = useState<number | 'unlimited'>(5);
  const [timePerQ, setTimePerQ] = useState<number>(15);
  const [isSpeakerOn, setIsSpeakerOn] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isFullScreenStage, setIsFullScreenStage] = useState<boolean>(false);

  // In-Game state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [isAnswerLocked, setIsAnswerLocked] = useState<boolean>(false);
  const [answerStartTime, setAnswerStartTime] = useState<number>(0);
  const [isGeneratingNextQ, setIsGeneratingNextQ] = useState<boolean>(false);

  // Speech-To-Question Feature (बोलकर प्रश्न बनाएं) & Direct Custom Question (0-Token)
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [voiceModalTab, setVoiceModalTab] = useState<'direct_custom' | 'ai_generate'>('direct_custom');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [activeVoiceTarget, setActiveVoiceTarget] = useState<'question' | 'optA' | 'optB' | 'optC' | 'optD' | 'aiPrompt' | null>(null);
  const [spokenTranscript, setSpokenTranscript] = useState<string>('');
  const [customQText, setCustomQText] = useState<string>('');
  const [customOptA, setCustomOptA] = useState<string>('');
  const [customOptB, setCustomOptB] = useState<string>('');
  const [customOptC, setCustomOptC] = useState<string>('');
  const [customOptD, setCustomOptD] = useState<string>('');
  const [customCorrectIndex, setCustomCorrectIndex] = useState<number>(0);
  const [customExplanation, setCustomExplanation] = useState<string>('');
  const [isGeneratingVoiceQ, setIsGeneratingVoiceQ] = useState<boolean>(false);
  const speechRecognitionRef = useRef<any>(null);

  // Leaderboard state
  const [leaderboardList, setLeaderboardList] = useState<ExamPracticeLeaderboardEntry[]>([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Audio Announcer Debounce Ref
  const speechRef = useRef<boolean>(true);
  speechRef.current = isSpeakerOn;

  // Update default subject when examType or boardClass changes
  useEffect(() => {
    if (examType === 'competitive') {
      setSelectedSubject('gk_polity');
    } else {
      if (boardClass === '10th') {
        setSelectedSubject('board_10_science');
      } else if (boardClass === '12th_science') {
        setSelectedSubject('board_12_physics');
      } else {
        setSelectedSubject('board_10_sst');
      }
    }
  }, [examType, boardClass]);

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
          { id: 'lb-1', name: 'हंसलाल पाल (Founder)', avatar: '👑', examTitle: 'SSC CGL & 12th Physics Battle', subject: 'General Studies & Science', score: 290, totalQuestions: 15, correctCount: 15, wrongCount: 0, timeSpentSeconds: 120, accuracy: 100, rank: 1, timestamp: new Date(Date.now() - 3600000).toISOString() },
          { id: 'lb-2', name: 'प्रिया शर्मा', avatar: '👩‍🎓', examTitle: 'Class 10th Board Science Marathon', subject: 'Class 10 Science & Biology', score: 260, totalQuestions: 15, correctCount: 14, wrongCount: 1, timeSpentSeconds: 145, accuracy: 93, rank: 2, timestamp: new Date(Date.now() - 7200000).toISOString() },
          { id: 'lb-3', name: 'रोहित वर्मा', avatar: '👨‍🎓', examTitle: 'BPSC & State PCS Polity Mega Battle', subject: 'Indian Constitution & DPSP', score: 240, totalQuestions: 15, correctCount: 13, wrongCount: 2, timeSpentSeconds: 160, accuracy: 87, rank: 3, timestamp: new Date(Date.now() - 14400000).toISOString() },
          { id: 'lb-4', name: 'अमित कुमार', avatar: '👨‍💻', examTitle: '12th Chemistry & Organic Lab Battle', subject: 'Chemistry Board Special', score: 220, totalQuestions: 15, correctCount: 12, wrongCount: 3, timeSpentSeconds: 180, accuracy: 80, rank: 4, timestamp: new Date(Date.now() - 28800000).toISOString() },
          { id: 'lb-5', name: 'अंजलि पटेल', avatar: '👩‍🏫', examTitle: 'Railway NTPC & Reasoning Speed Battle', subject: 'Reasoning & GS', score: 210, totalQuestions: 15, correctCount: 11, wrongCount: 4, timeSpentSeconds: 190, accuracy: 73, rank: 5, timestamp: new Date(Date.now() - 43200000).toISOString() }
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

  // Handle Speech Recognition for "बोलकर प्रश्न बनाएं" & Direct Custom Question (0-Token)
  const startVoiceInput = (target: 'question' | 'optA' | 'optB' | 'optC' | 'optD' | 'aiPrompt' = 'question') => {
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        showToast(isHindi ? 'आपका ब्राउज़र वॉयस रिकॉग्निशन सपोर्ट नहीं करता। कृपया टाइप करें।' : 'Speech recognition is not supported in this browser. Please type.', 'warn');
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = isHindi ? 'hi-IN' : 'en-US';
      recognition.continuous = false;
      recognition.interimResults = true;

      setActiveVoiceTarget(target);

      recognition.onstart = () => {
        setIsListening(true);
        showToast(isHindi ? '🎤 माइक चालू है... बोलिए!' : '🎤 Microphone active... Speak!', 'info');
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (target === 'question') setCustomQText(transcript);
        else if (target === 'optA') setCustomOptA(transcript);
        else if (target === 'optB') setCustomOptB(transcript);
        else if (target === 'optC') setCustomOptC(transcript);
        else if (target === 'optD') setCustomOptD(transcript);
        else if (target === 'aiPrompt') setSpokenTranscript(transcript);
      };

      recognition.onerror = (err: any) => {
        console.warn("Speech recognition error:", err);
        setIsListening(false);
        setActiveVoiceTarget(null);
      };

      recognition.onend = () => {
        setIsListening(false);
        setActiveVoiceTarget(null);
      };

      speechRecognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn("Mic start error:", err);
      setIsListening(false);
      setActiveVoiceTarget(null);
    }
  };

  const stopVoiceInput = () => {
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
      setIsListening(false);
      setActiveVoiceTarget(null);
    }
  };

  // Direct User Custom Question Submission (0 Tokens - Exact Question & 4 Options)
  const handleDirectCustomQuestionSubmit = async () => {
    if (!customQText.trim() || !customOptA.trim() || !customOptB.trim() || !customOptC.trim() || !customOptD.trim()) {
      showToast(isHindi ? 'कृपया प्रश्न और चारों विकल्प (A, B, C, D) दर्ज करें' : 'Please enter question and all 4 options (A, B, C, D)', 'warn');
      return;
    }

    const directQ: QuizQuestion = {
      id: `custom-user-q-${Date.now()}`,
      question: customQText.trim(),
      options: [customOptA.trim(), customOptB.trim(), customOptC.trim(), customOptD.trim()],
      answerIndex: customCorrectIndex,
      correctIndex: customCorrectIndex,
      explanation: customExplanation.trim() || (isHindi ? `सही उत्तर विकल्प ${String.fromCharCode(65 + customCorrectIndex)} है।` : `Correct answer is option ${String.fromCharCode(65 + customCorrectIndex)}.`),
      subject: selectedSubject,
      topic: isHindi ? 'उपयोगकर्ता का अपना प्रश्न' : 'User Custom Question'
    };

    if (room && room.status === 'in-progress') {
      const updatedRoom: GroupQuizRoom = {
        ...room,
        questions: [...room.questions, directQ]
      };
      setRoom(updatedRoom);
      await saveGroupQuizRoomToFirestore(updatedRoom);
      showToast(isHindi ? '🚀 आपका अपना प्रश्न क्विज़ रूम में लाइव जुड़ गया!' : '🚀 Custom question added to battle room live!', 'success');
      announceVoice(isHindi ? `नया प्रश्न स्क्रीन पर जुड़ा: ${directQ.question}` : `New question added: ${directQ.question}`);
    } else {
      const newRoomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const hostParticipant: GroupQuizParticipant = {
        id: playerId,
        name: playerName.trim() || (isHindi ? 'विद्यार्थी' : 'Student Host'),
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

      const instantRoom: GroupQuizRoom = {
        id: newRoomCode,
        title: `👑 User Live Battle: ${directQ.question.slice(0, 30)}...`,
        subject: selectedSubject,
        category: examType,
        examType,
        isUnlimitedMode: true,
        hostId: playerId,
        hostName: playerName.trim() || 'Student Host',
        status: 'in-progress',
        currentQuestionIndex: 0,
        timePerQuestion: timePerQ,
        questionStartTime: Date.now(),
        questions: [directQ],
        participants: { [playerId]: hostParticipant },
        speakerEnabled: isSpeakerOn,
        voiceLanguage: isHindi ? 'hindi' : 'english',
        createdAt: new Date().toISOString()
      };

      setRoom(instantRoom);
      setTimeLeft(timePerQ);
      setIsAnswerLocked(false);
      setSelectedOption(null);
      setAnswerStartTime(Date.now());
      await saveGroupQuizRoomToFirestore(instantRoom);
      showToast(isHindi ? '🚀 आपका प्रश्न स्क्रीन पर लाइव शुरू हो गया!' : '🚀 Question live on screen!', 'success');
      announceVoice(isHindi ? `आपका प्रश्न स्क्रीन पर लाइव है: ${directQ.question}` : `Live Question on screen: ${directQ.question}`);
    }

    setIsVoiceModalOpen(false);
    setCustomQText('');
    setCustomOptA('');
    setCustomOptB('');
    setCustomOptC('');
    setCustomOptD('');
    setCustomExplanation('');
    setIsFullScreenStage(true);
  };

  // Generate Question from Spoken text & Launch
  const handleGenerateVoiceQuestion = async () => {
    if (!spokenTranscript.trim()) {
      showToast(isHindi ? 'कृपया पहले अपना प्रश्न बोलें या लिखें' : 'Please speak or enter your question first', 'warn');
      return;
    }

    setIsGeneratingVoiceQ(true);
    try {
      const res = await fetch('/api/quiz/voice-to-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userSpokenText: spokenTranscript.trim(),
          examType,
          subject: selectedSubject,
          language: isHindi ? 'hindi' : 'english'
        })
      });

      const data = await res.json();
      if (data?.question) {
        const newQ: QuizQuestion = data.question;

        if (room && room.status === 'in-progress') {
          // Append to active battle
          const updatedRoom: GroupQuizRoom = {
            ...room,
            questions: [...room.questions, newQ]
          };
          setRoom(updatedRoom);
          await saveGroupQuizRoomToFirestore(updatedRoom);
          showToast(isHindi ? '🎉 आपका बोला हुआ प्रश्न लाइव क्विज़ में जुड़ गया!' : '🎉 Spoken question added to active battle!', 'success');
        } else {
          // Launch instant single/unlimited battle with this question
          const newRoomCode = 'HANS-V' + Math.floor(1000 + Math.random() * 9000);
          const hostParticipant: GroupQuizParticipant = {
            id: playerId,
            name: playerName.trim() || 'Student Host',
            avatar: '🎙️',
            score: 0,
            correctCount: 0,
            wrongCount: 0,
            unattemptedCount: 0,
            totalTimeSeconds: 0,
            isHost: true,
            isReady: true,
            answers: {}
          };

          const instantRoom: GroupQuizRoom = {
            id: newRoomCode,
            title: `🎙️ Voice Battle: ${newQ.question.slice(0, 30)}...`,
            subject: selectedSubject,
            category: examType,
            examType,
            isUnlimitedMode: true,
            hostId: playerId,
            hostName: playerName.trim() || 'Student Host',
            status: 'in-progress',
            currentQuestionIndex: 0,
            timePerQuestion: timePerQ,
            questionStartTime: Date.now(),
            questions: [newQ],
            participants: { [playerId]: hostParticipant },
            speakerEnabled: isSpeakerOn,
            voiceLanguage: isHindi ? 'hindi' : 'english',
            createdAt: new Date().toISOString()
          };

          setRoom(instantRoom);
          setTimeLeft(timePerQ);
          setIsAnswerLocked(false);
          setSelectedOption(null);
          setAnswerStartTime(Date.now());
          await saveGroupQuizRoomToFirestore(instantRoom);
          showToast(isHindi ? '🎙️ बोला हुआ प्रश्न स्क्रीन पर लाइव शुरू हो गया!' : '🎙️ Spoken question launched on live screen!', 'success');
          announceVoice(isHindi ? `आपका प्रश्न स्क्रीन पर लाइव है: ${newQ.question}` : `Live Question on screen: ${newQ.question}`);
        }

        setIsVoiceModalOpen(false);
        setSpokenTranscript('');
        setIsFullScreenStage(true); // Auto full-screen stage presentation
      } else {
        throw new Error("Could not format spoken question");
      }
    } catch (err: any) {
      console.warn("Voice question error:", err);
      showToast(isHindi ? 'प्रश्न बनाने में त्रुटि, कृपया पुनः प्रयास करें' : 'Error converting voice to question', 'error');
    } finally {
      setIsGeneratingVoiceQ(false);
    }
  };

  // Host / Create a room with selected Board or Competitive exam
  const handleCreateRoom = async () => {
    let rawQuestions: QuizQuestion[] = QUESTION_BANK[selectedSubject] || QUESTION_BANK.gk_polity;
    const isUnlimited = questionCountChoice === 'unlimited';
    const targetCount = isUnlimited ? 5 : (Number(questionCountChoice) || 5);
    
    // Shuffled initial bank
    let initialQuestions = [...rawQuestions].sort(() => 0.5 - Math.random()).slice(0, targetCount);
    
    // Attempt dynamic AI question enhancement if needed
    try {
      const res = await fetch('/api/quiz/live-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examType,
          boardClass: examType === 'board' ? boardClass : undefined,
          subject: selectedSubject,
          count: targetCount,
          language: isHindi ? 'hindi' : 'english'
        })
      });
      const data = await res.json();
      if (data?.questions && data.questions.length > 0) {
        initialQuestions = data.questions;
      }
    } catch (e) {
      console.warn("Using offline verified question bank:", e);
    }

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

    const initialParticipants: Record<string, GroupQuizParticipant> = {
      [playerId]: hostParticipant
    };

    const examTitle = examType === 'board' 
      ? `🎓 [Board ${boardClass.replace('_', ' ').toUpperCase()}] ${selectedSubject.replace('board_', '').toUpperCase()} Live Battle`
      : `🏆 [Competitive] ${selectedSubject.toUpperCase()} Live Quiz Battle`;

    const newRoom: GroupQuizRoom = {
      id: newRoomCode,
      title: examTitle,
      subject: selectedSubject,
      category: examType,
      examType,
      boardClass: examType === 'board' ? boardClass : undefined,
      isUnlimitedMode: isUnlimited,
      hostId: playerId,
      hostName: playerName.trim() || 'Student Host',
      status: 'lobby',
      currentQuestionIndex: 0,
      timePerQuestion: timePerQ,
      questionStartTime: 0,
      questions: initialQuestions,
      participants: initialParticipants,
      speakerEnabled: isSpeakerOn,
      voiceLanguage: isHindi ? 'hindi' : 'english',
      createdAt: new Date().toISOString()
    };

    setRoom(newRoom);
    await saveGroupQuizRoomToFirestore(newRoom);
    showToast(isHindi ? `रूम तैयार! कोड: ${newRoomCode}` : `Room Created! Code: ${newRoomCode}`, 'success');
    announceVoice(isHindi 
      ? `ग्रुप क्विज रूम कोड ${newRoomCode} तैयार है! ${isUnlimited ? 'अनलिमिटेड लाइव राउंड्स' : `${targetCount} प्रश्न`} लोड किए गए हैं।` 
      : `Group Quiz Room ${newRoomCode} is ready! ${isUnlimited ? 'Unlimited live rounds' : `${targetCount} questions`} loaded.`);
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

  // Start Quiz Battle
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

  // Move to Next Question or Final Podium (Supports Infinite Mode)
  const handleNextQuestion = async () => {
    if (!room) return;
    const nextIdx = room.currentQuestionIndex + 1;
    const isUnlimited = !!room.isUnlimitedMode;
    
    // If we've reached the end of existing questions:
    if (nextIdx >= room.questions.length) {
      if (isUnlimited) {
        // Generate new question on the fly for infinite battle!
        setIsGeneratingNextQ(true);
        try {
          const res = await fetch('/api/quiz/live-generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              examType: room.examType || 'competitive',
              boardClass: room.boardClass,
              subject: room.subject,
              count: 3,
              language: room.voiceLanguage || 'hindi',
              excludeQuestions: room.questions.map(q => q.question)
            })
          });
          const data = await res.json();
          if (data?.questions && data.questions.length > 0) {
            const extendedQuestions = [...room.questions, ...data.questions];
            const now = Date.now();
            const nextRoom: GroupQuizRoom = {
              ...room,
              status: 'in-progress',
              currentQuestionIndex: nextIdx,
              questionStartTime: now,
              questions: extendedQuestions
            };
            setRoom(nextRoom);
            setTimeLeft(room.timePerQuestion);
            setIsAnswerLocked(false);
            setSelectedOption(null);
            setAnswerStartTime(now);
            await saveGroupQuizRoomToFirestore(nextRoom);

            const nextQ = extendedQuestions[nextIdx];
            announceVoice(isHindi 
              ? `अनलिमिटेड राउंड प्रश्न ${nextIdx + 1}: ${nextQ?.question}` 
              : `Unlimited Round Question ${nextIdx + 1}: ${nextQ?.question}`);
            setIsGeneratingNextQ(false);
            return;
          }
        } catch (err) {
          console.warn("Failed to generate infinite question, fallback to end:", err);
        }
        setIsGeneratingNextQ(false);
      }

      // If not unlimited or failed -> Podium
      handleEndQuizBattle();
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

  // Explicit End Quiz (for Host in Unlimited Mode or premature end)
  const handleEndQuizBattle = async () => {
    if (!room) return;
    const finalRoom: GroupQuizRoom = {
      ...room,
      status: 'podium-finished'
    };
    setRoom(finalRoom);
    await saveGroupQuizRoomToFirestore(finalRoom);

    // Save user score to global leaderboard
    const me = finalRoom.participants[playerId];
    if (me) {
      const accuracy = finalRoom.questions.length > 0 
        ? Math.round((me.correctCount / Math.max(1, me.correctCount + me.wrongCount)) * 100)
        : 100;
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
    <div className={`w-full ${isFullScreenStage ? 'fixed inset-0 z-50 bg-slate-950 overflow-y-auto p-4 sm:p-8' : 'max-w-6xl mx-auto p-2 sm:p-4'} space-y-6 animate-fade-in text-slate-100`}>
      
      {/* TOP HEADER: BLUE & GREEN LIGHT PALETTE */}
      <div className="bg-slate-900/90 border-2 border-blue-500/30 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-teal-500 to-emerald-500 flex items-center justify-center text-white shadow-xl shadow-blue-500/20 shrink-0">
            <Users className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-500/30">
                LIVE MULTIPLAYER & UNLIMITED BATTLES
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30">
                VOICE ANNOUNCER 🔊
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                🎤 बोलकर प्रश्न बनाएं
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
              {isHindi ? '👥 लाइव क्विज़ बैटल — बोर्ड व प्रतियोगी परीक्षाएं' : '👥 Live Quiz Battle — Board & Competitive Exams'}
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              {isHindi 
                ? 'कक्षा 10वीं/12वीं बोर्ड व प्रतियोगी परीक्षाओं के अलग सिलेबस, अनलिमिटेड प्रश्न व बोलकर प्रश्न बनाने की सुविधा!' 
                : 'Distinct streams for Board & Competitive exams, unlimited questions, and speak-to-generate features!'}
            </p>
          </div>
        </div>

        {/* CONTROLS: SPEAK-TO-QUESTION, FULL-SCREEN, SPEAKER & TABS */}
        <div className="flex items-center gap-2 self-stretch md:self-auto justify-end flex-wrap">
          {/* VOICE INPUT BUTTON */}
          <button
            onClick={() => setIsVoiceModalOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-white shadow-lg shadow-orange-950/40 active:scale-95"
            title="Speak your question / बोलकर प्रश्न बनाएं"
          >
            <Mic className="w-4 h-4 animate-bounce" />
            <span>{isHindi ? 'बोलकर पूछें' : 'Speak Question'}</span>
          </button>

          {/* FULL SCREEN TOGGLE */}
          <button
            onClick={() => setIsFullScreenStage(!isFullScreenStage)}
            className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              isFullScreenStage ? 'bg-blue-600 text-white border-blue-400' : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
            title="Toggle Stage Fullscreen Mode"
          >
            {isFullScreenStage ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {onBackToHome && !isFullScreenStage && (
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
              {isHindi ? '⚔️ लाइव बैटल' : '⚔️ Live Battle'}
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
      {/* SPEAK-TO-QUESTION & DIRECT CUSTOM QUESTION MODAL */}
      {/* ========================================================================= */}
      {isVoiceModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-5 sm:p-6 max-w-xl w-full shadow-2xl space-y-5 animate-scale-in my-auto max-h-[95vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    {isHindi ? '🎤 बोलकर / लिखकर अपना प्रश्न जोड़ें' : '🎤 Custom Question Studio'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isHindi ? 'सभी छात्रों की स्क्रीन पर एक साथ दिखेगा (100% फ्री सिंक)' : 'Synced live to all participants screens simultaneously'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  stopVoiceInput();
                  setIsVoiceModalOpen(false);
                }}
                className="text-slate-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => setVoiceModalTab('direct_custom')}
                className={`py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  voiceModalTab === 'direct_custom'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>✍️ अपना प्रश्न + 4 विकल्प</span>
                <span className="text-[10px] bg-slate-900/80 text-amber-300 px-1.5 py-0.5 rounded-md font-mono">0 Token</span>
              </button>

              <button
                type="button"
                onClick={() => setVoiceModalTab('ai_generate')}
                className={`py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  voiceModalTab === 'ai_generate'
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>🤖 AI से ऑटो-फॉर्मेट</span>
              </button>
            </div>

            {/* TAB 1: DIRECT USER CUSTOM QUESTION (0 TOKENS - EXACT USER INPUT) */}
            {voiceModalTab === 'direct_custom' && (
              <div className="space-y-4 animate-fade-in">
                {/* Question Input with Mic */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                    <span>{isHindi ? '1. प्रश्न दर्ज करें (बोलें या लिखें):' : '1. Enter Question (Speak or Type):'}</span>
                    <button
                      type="button"
                      onClick={() => (isListening && activeVoiceTarget === 'question') ? stopVoiceInput() : startVoiceInput('question')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                        isListening && activeVoiceTarget === 'question'
                          ? 'bg-rose-600 text-white animate-pulse'
                          : 'bg-slate-800 hover:bg-slate-700 text-amber-300'
                      }`}
                    >
                      <Mic className="w-3.5 h-3.5" />
                      <span>{isListening && activeVoiceTarget === 'question' ? 'सुन रहे हैं...' : 'माइक से बोलें'}</span>
                    </button>
                  </label>
                  <textarea
                    value={customQText}
                    onChange={(e) => setCustomQText(e.target.value)}
                    placeholder={isHindi ? "यहाँ अपना प्रश्न लिखें या माइक से बोलें... (e.g. भारतीय संविधान में कुल कितने मौलिक अधिकार हैं?)" : "Type or speak your question..."}
                    rows={2}
                    className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                {/* 4 Options with Mic Buttons & Correct Option Selector */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-200 block">
                    {isHindi ? '2. चारों विकल्प दर्ज करें और सही उत्तर चुनें (Select Correct Option):' : '2. Enter 4 Options & Select Correct Answer:'}
                  </span>

                  {[
                    { key: 'A', val: customOptA, setter: setCustomOptA, target: 'optA' as const, index: 0 },
                    { key: 'B', val: customOptB, setter: setCustomOptB, target: 'optB' as const, index: 1 },
                    { key: 'C', val: customOptC, setter: setCustomOptC, target: 'optC' as const, index: 2 },
                    { key: 'D', val: customOptD, setter: setCustomOptD, target: 'optD' as const, index: 3 }
                  ].map((opt) => (
                    <div key={opt.key} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCustomCorrectIndex(opt.index)}
                        className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center shrink-0 cursor-pointer transition-all ${
                          customCorrectIndex === opt.index
                            ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-400 font-bold'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                        title="Click to mark as Correct Answer"
                      >
                        {opt.key}
                      </button>

                      <input
                        type="text"
                        value={opt.val}
                        onChange={(e) => opt.setter(e.target.value)}
                        placeholder={`Option ${opt.key} ${customCorrectIndex === opt.index ? '✓ (सही उत्तर)' : ''}`}
                        className={`flex-1 p-2.5 bg-slate-950 border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors ${
                          customCorrectIndex === opt.index ? 'border-emerald-500 bg-emerald-950/20' : 'border-slate-800 focus:border-amber-500'
                        }`}
                      />

                      <button
                        type="button"
                        onClick={() => (isListening && activeVoiceTarget === opt.target) ? stopVoiceInput() : startVoiceInput(opt.target)}
                        className={`p-2 rounded-xl border transition-all cursor-pointer ${
                          isListening && activeVoiceTarget === opt.target
                            ? 'bg-rose-600 text-white border-rose-400 animate-pulse'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                        }`}
                        title={`Speak Option ${opt.key}`}
                      >
                        <Mic className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Optional Explanation */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">
                    {isHindi ? 'सटीक व्याख्या / हिंट (वैकल्पिक):' : 'Explanation / Hint (Optional):'}
                  </label>
                  <input
                    type="text"
                    value={customExplanation}
                    onChange={(e) => setCustomExplanation(e.target.value)}
                    placeholder={isHindi ? "उत्तर का कारण या तथ्य..." : "Brief explanation..."}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Submit Action */}
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      stopVoiceInput();
                      setIsVoiceModalOpen(false);
                    }}
                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    {isHindi ? 'रद्द करें' : 'Cancel'}
                  </button>

                  <button
                    type="button"
                    onClick={handleDirectCustomQuestionSubmit}
                    disabled={!customQText.trim() || !customOptA.trim() || !customOptB.trim()}
                    className="flex-2 py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all active:scale-95"
                  >
                    <Zap className="w-4 h-4" />
                    <span>{isHindi ? '🚀 सीधे लाइव स्क्रीन पर शुरू करें (0 Token)' : '🚀 Launch to Screen (0 Token)'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: AI AUTO-GENERATE OPTIONS FROM VOICE / TOPIC */}
            {voiceModalTab === 'ai_generate' && (
              <div className="space-y-4 animate-fade-in">
                {/* Mic Pulse */}
                <div className="flex flex-col items-center justify-center p-5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-3 text-center">
                  <button
                    type="button"
                    onClick={() => (isListening && activeVoiceTarget === 'aiPrompt') ? stopVoiceInput() : startVoiceInput('aiPrompt')}
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-2xl ${
                      isListening && activeVoiceTarget === 'aiPrompt'
                        ? 'bg-rose-600 text-white animate-pulse shadow-rose-900/60 ring-8 ring-rose-500/30'
                        : 'bg-gradient-to-tr from-cyan-600 to-blue-500 hover:from-cyan-500 hover:to-blue-400 text-white shadow-cyan-900/40 active:scale-95'
                    }`}
                  >
                    {isListening && activeVoiceTarget === 'aiPrompt' ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
                  </button>

                  <div>
                    <p className="text-xs font-black text-slate-200">
                      {isListening && activeVoiceTarget === 'aiPrompt'
                        ? (isHindi ? '🔴 सुन रहे हैं... बोलिए!' : '🔴 Listening to your voice...') 
                        : (isHindi ? 'माइक दबाकर सिर्फ प्रश्न बोलें — AI विकल्प तैयार करेगा' : 'Press mic to speak — AI will format 4 options')}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {isHindi ? 'उदाहरण: "नीति आयोग का गठन किस वर्ष हुआ था?"' : 'e.g. "When was NITI Aayog established?"'}
                    </p>
                  </div>
                </div>

                {/* Spoken / Typed Prompt */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span>{isHindi ? 'बोला गया / लिखा गया प्रश्न:' : 'Spoken / Typed Question Text:'}</span>
                    {spokenTranscript && (
                      <button
                        onClick={() => setSpokenTranscript('')}
                        className="text-[10px] text-slate-400 hover:text-rose-400 cursor-pointer"
                      >
                        {isHindi ? 'साफ करें' : 'Clear'}
                      </button>
                    )}
                  </label>
                  <textarea
                    value={spokenTranscript}
                    onChange={(e) => setSpokenTranscript(e.target.value)}
                    placeholder={isHindi ? "यहाँ आपका बोला गया प्रश्न दिखाई देगा या आप सीधे टाइप भी कर सकते हैं..." : "Spoken question appears here, or you can type directly..."}
                    rows={2}
                    className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      stopVoiceInput();
                      setIsVoiceModalOpen(false);
                    }}
                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    {isHindi ? 'रद्द करें' : 'Cancel'}
                  </button>

                  <button
                    type="button"
                    disabled={isGeneratingVoiceQ || !spokenTranscript.trim()}
                    onClick={handleGenerateVoiceQuestion}
                    className="flex-2 py-3 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-lg shadow-cyan-950/40 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all active:scale-95"
                  >
                    {isGeneratingVoiceQ ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{isHindi ? 'AI विकल्प तैयार कर रहा है...' : 'AI Generating Options...'}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>{isHindi ? '🤖 AI से विकल्प बनाकर स्क्रीन पर दिखाएं' : '🤖 Generate with AI & Launch'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 1: GLOBAL PRACTICE EXAM LEADERBOARD */}
      {/* ========================================================================= */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  <span>{isHindi ? 'बोर्ड व प्रतियोगी परीक्षाओं की लाइव ऑल-इंडिया रैंक लिस्ट' : 'Live Board & Competitive Practice Leaderboard'}</span>
                </h2>
                <p className="text-xs text-slate-400">
                  {isHindi ? 'सभी छात्रों की सटीकता, स्कोर व समय के आधार पर वास्तविक रैंकिंग' : 'Live student standing ranked by accuracy, net score and response speed'}
                </p>
              </div>

              {/* SEARCH FILTER */}
              <div className="w-full sm:w-72">
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder={isHindi ? "छात्र, बोर्ड या विषय खोजें..." : "Search student, board or subject..."}
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
                    <th className="py-3 px-3">परीक्षा / विषय (Board/Exam)</th>
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
      {/* VIEW 2: LIVE GROUP QUIZ BATTLE (BOARD & COMPETITIVE DUAL STREAM) */}
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
                      <span>{isHindi ? 'नया लाइव क्विज़ रूम बनाएं' : 'Host Live Quiz Battle'}</span>
                    </h2>
                    <p className="text-xs text-slate-400">
                      {isHindi ? 'बोर्ड या प्रतियोगी परीक्षा चुनें, अनलिमिटेड प्रश्न व लाइव मुकाबला शुरू करें' : 'Select Board or Competitive exam stream with unlimited questions'}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-blue-500/20 text-blue-300 font-black text-[10px]">
                    HOST SETUP
                  </span>
                </div>

                {/* 1.1 EXAM STREAM SELECTOR (BOARD EXAM VS COMPETITIVE EXAM) */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-200 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-emerald-400" />
                    <span>{isHindi ? 'परीक्षा का प्रकार (Exam Stream):' : 'Select Exam Stream:'}</span>
                  </label>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setExamType('competitive')}
                      className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-3 ${
                        examType === 'competitive'
                          ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-950/40 ring-2 ring-blue-500/30'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-blue-600/30 text-blue-300 flex items-center justify-center font-bold text-lg shrink-0">
                        🏆
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-black text-white">
                          {isHindi ? 'प्रतियोगी परीक्षाएं' : 'Competitive Exams'}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          SSC, Railway, Banking, UPSC, PSC, Police
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setExamType('board')}
                      className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-3 ${
                        examType === 'board'
                          ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-lg shadow-emerald-950/40 ring-2 ring-emerald-500/30'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-emerald-600/30 text-emerald-300 flex items-center justify-center font-bold text-lg shrink-0">
                        🎓
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-black text-white">
                          {isHindi ? 'बोर्ड परीक्षाएं' : 'Board Exams'}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          10वीं व 12वीं (CBSE, UP, Bihar Board)
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* 1.2 BOARD CLASS PICKER (IF BOARD EXAM CHOSEN) */}
                {examType === 'board' && (
                  <div className="space-y-1.5 p-3 bg-slate-950/60 border border-emerald-500/30 rounded-2xl">
                    <label className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>{isHindi ? 'कक्षा व स्ट्रीम चुनें (Class & Stream):' : 'Select Class & Stream:'}</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: '10th', label: 'कक्षा 10वीं बोर्ड' },
                        { id: '12th_science', label: '12वीं साइंस (PCM/PCB)' },
                        { id: '12th_arts', label: '12वीं कला व कॉमर्स' }
                      ].map(cls => (
                        <button
                          key={cls.id}
                          type="button"
                          onClick={() => setBoardClass(cls.id as any)}
                          className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                            boardClass === cls.id
                              ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {cls.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 1.3 SUBJECT PICKER (SPECIFIC TO STREAM) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    {isHindi ? 'क्विज़ का विषय (Subject):' : 'Select Quiz Subject:'}
                  </label>
                  
                  {examType === 'competitive' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { id: 'gk_polity', label: 'संविधान व राजव्यवस्था', icon: '🏛️' },
                        { id: 'history', label: 'इतिहास व आंदोलन', icon: '📜' },
                        { id: 'science', label: 'सामान्य विज्ञान', icon: '🔬' },
                        { id: 'reasoning', label: 'रीजनिंग व तर्कशक्ति', icon: '🧩' },
                        { id: 'current_affairs', label: 'करेंट अफेयर्स', icon: '⚡' }
                      ].map(subj => (
                        <button
                          key={subj.id}
                          type="button"
                          onClick={() => setSelectedSubject(subj.id)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                            selectedSubject === subj.id
                              ? 'bg-blue-600/20 border-blue-500 text-white shadow'
                              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <span className="text-base">{subj.icon}</span>
                          <span className="text-xs font-bold leading-tight line-clamp-1">{subj.label}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {boardClass === '10th' && [
                        { id: 'board_10_science', label: '10th विज्ञान (Science)', icon: '🔬' },
                        { id: 'board_10_maths', label: '10th गणित (Maths)', icon: '📐' },
                        { id: 'board_10_sst', label: '10th सामाजिक विज्ञान', icon: '🌍' }
                      ].map(subj => (
                        <button
                          key={subj.id}
                          type="button"
                          onClick={() => setSelectedSubject(subj.id)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                            selectedSubject === subj.id
                              ? 'bg-emerald-600/20 border-emerald-500 text-white shadow'
                              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <span className="text-base">{subj.icon}</span>
                          <span className="text-xs font-bold leading-tight line-clamp-1">{subj.label}</span>
                        </button>
                      ))}

                      {boardClass === '12th_science' && [
                        { id: 'board_12_physics', label: '12th भौतिकी (Physics)', icon: '⚡' },
                        { id: 'board_12_chemistry', label: '12th रसायन (Chemistry)', icon: '🧪' },
                        { id: 'board_12_biology', label: '12th जीव विज्ञान (Bio)', icon: '🧬' }
                      ].map(subj => (
                        <button
                          key={subj.id}
                          type="button"
                          onClick={() => setSelectedSubject(subj.id)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                            selectedSubject === subj.id
                              ? 'bg-emerald-600/20 border-emerald-500 text-white shadow'
                              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <span className="text-base">{subj.icon}</span>
                          <span className="text-xs font-bold leading-tight line-clamp-1">{subj.label}</span>
                        </button>
                      ))}

                      {boardClass === '12th_arts' && [
                        { id: 'board_10_sst', label: '12th राजनीति विज्ञान', icon: '🏛️' },
                        { id: 'history', label: '12th इतिहास व कला', icon: '📜' },
                        { id: 'gk_polity', label: 'अर्थशास्त्र व सामान्य ज्ञान', icon: '📊' }
                      ].map(subj => (
                        <button
                          key={subj.id}
                          type="button"
                          onClick={() => setSelectedSubject(subj.id)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                            selectedSubject === subj.id
                              ? 'bg-emerald-600/20 border-emerald-500 text-white shadow'
                              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <span className="text-base">{subj.icon}</span>
                          <span className="text-xs font-bold leading-tight line-clamp-1">{subj.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 1.4 QUESTION COUNT (WITH UNLIMITED MODE) & TIMER */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      {isHindi ? 'प्रश्नों की संख्या (Question Count):' : 'Questions Count:'}
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[5, 10, 15, 'unlimited'].map(cnt => (
                        <button
                          key={String(cnt)}
                          type="button"
                          onClick={() => setQuestionCountChoice(cnt as any)}
                          className={`py-2 rounded-xl text-xs font-black border transition-all cursor-pointer text-center ${
                            questionCountChoice === cnt
                              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400 shadow-md'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {cnt === 'unlimited' ? '♾️ Unlimited' : `${cnt} Qs`}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      {isHindi ? 'समय प्रति प्रश्न:' : 'Time Per Question:'}
                    </label>
                    <div className="flex gap-2">
                      {[15, 30, 45].map(sec => (
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
                    className="w-full py-4 px-4 bg-gradient-to-r from-blue-600 via-teal-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-black rounded-2xl text-sm shadow-xl shadow-blue-900/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
                  >
                    <Radio className="w-4 h-4 animate-pulse" />
                    <span>{isHindi ? '🎯 नया लाइव क्विज़ रूम बनाएं (Create Battle Room)' : '🎯 Create Live Quiz Battle Room'}</span>
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
                        {isHindi ? 'दोस्त द्वारा शेयर किया गया कोड दर्ज कर सीधे लाइव मुकाबले में शामिल हों' : 'Enter the room code shared by your friend to join live'}
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
                            ROOM ACTIVE {room.isUnlimitedMode ? '• ♾️ UNLIMITED' : ''}
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
                            <span>{isCopied ? (isHindi ? 'कॉपी!' : 'Copied!') : (isHindi ? 'लिंक' : 'Link')}</span>
                          </button>
                        </div>
                      </div>

                      {/* Share Prompt */}
                      <p className="text-[11px] text-emerald-300/90 mt-2 bg-emerald-950/40 p-2 rounded-xl border border-emerald-500/20">
                        {isHindi 
                          ? '📲 अपने दोस्तों को WhatsApp या Telegram पर लिंक भेजें — वे सीधे आपके रूम में लाइव जुड़कर मुकाबला करेंगे!' 
                          : '📲 Share the link with friends on WhatsApp or Telegram to invite them to this battle!'}
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
              
              {/* TOP HUD: QUESTION NUMBER, TIME CIRCLE, UNLIMITED BADGE, MY SCORE */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl flex items-center justify-between gap-4 flex-wrap">
                
                {/* QUESTION COUNTER */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-black text-blue-300 font-mono text-sm">
                    Q{room.currentQuestionIndex + 1}
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                      <span>{isHindi ? 'राउंड / प्रश्न' : 'Round / Question'}</span>
                      {room.isUnlimitedMode && (
                        <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded text-[9px] font-mono font-bold">
                          ♾️ UNLIMITED
                        </span>
                      )}
                    </div>
                    <div className="text-xs sm:text-sm font-black text-white">
                      {room.currentQuestionIndex + 1} {room.isUnlimitedMode ? `/ ♾️ (Round ${room.currentQuestionIndex + 1})` : `/ ${room.questions.length}`}
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

                {/* CURRENT USER LIVE SCORE & END BATTLE BUTTON */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">
                      {isHindi ? 'मेरा स्कोर' : 'My Score'}
                    </div>
                    <div className="text-xs sm:text-sm font-black text-emerald-400 font-mono">
                      {myParticipant?.score || 0} pts
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center font-black text-emerald-300 font-mono text-sm">
                    #{myRank || 1}
                  </div>

                  {room.isUnlimitedMode && (room.participants[playerId]?.isHost || true) && (
                    <button
                      onClick={handleEndQuizBattle}
                      className="px-2.5 py-1.5 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 rounded-xl text-[11px] font-bold cursor-pointer transition-all"
                      title="Conclude Battle / क्विज़ संपन्न करें"
                    >
                      {isHindi ? '🏁 क्विज़ समाप्त' : '🏁 End'}
                    </button>
                  )}
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
                        <span className="text-emerald-400 uppercase tracking-wider font-mono">
                          {room.examType === 'board' ? `🎓 Board ${room.boardClass || '10th'}` : '🏆 Competitive Exam'} • {room.subject}
                        </span>
                        <button
                          onClick={() => announceVoice(currentQ.question)}
                          className="flex items-center gap-1 text-slate-400 hover:text-emerald-300 cursor-pointer transition-colors"
                          title="Read question aloud"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span className="text-[11px]">{isHindi ? 'दोबारा सुनें' : 'Listen'}</span>
                        </button>
                      </div>
                      <h2 className="text-base sm:text-2xl font-black text-white leading-relaxed whitespace-pre-line">
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
                            btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-black shadow-lg shadow-emerald-950/50 ring-2 ring-emerald-500/50';
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
                            className={`p-4 sm:p-5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${btnStyle} disabled:cursor-not-allowed`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center font-mono font-bold text-sm shrink-0">
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span className="text-xs sm:text-base font-semibold">{opt}</span>
                            </div>

                            {isReviewing && isCorrectAnswer && (
                              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                            )}
                            {isReviewing && isSelected && !isCorrectAnswer && (
                              <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
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
                        <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                          <strong className="text-emerald-400 font-bold">{isHindi ? 'व्याख्या (Explanation): ' : 'Explanation: '}</strong>
                          {currentQ.explanation}
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          {/* QUICK VOICE DICTATE NEW QUESTION ON THE FLY */}
                          <button
                            onClick={() => setIsVoiceModalOpen(true)}
                            className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                          >
                            <Mic className="w-3.5 h-3.5" />
                            <span>{isHindi ? '🎤 बोलकर नया प्रश्न जोड़ें' : '🎤 Speak New Q'}</span>
                          </button>

                          <button
                            disabled={isGeneratingNextQ}
                            onClick={handleNextQuestion}
                            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg flex items-center gap-2 cursor-pointer active:scale-95 transition-all disabled:opacity-50"
                          >
                            {isGeneratingNextQ ? (
                              <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                <span>{isHindi ? 'अगला राउंड जनरेट हो रहा है...' : 'Generating Next Round...'}</span>
                              </>
                            ) : (
                              <>
                                <span>
                                  {room.isUnlimitedMode
                                    ? (isHindi ? 'अगला अनलिमिटेड राउंड ➔' : 'Next Unlimited Round ➔')
                                    : (room.currentQuestionIndex + 1 >= room.questions.length
                                        ? (isHindi ? 'अंतिम परिणाम व रैंक देखें 🏆' : 'View Final Standings 🏆')
                                        : (isHindi ? 'अगला प्रश्न ➔' : 'Next Question ➔'))}
                                </span>
                                <ChevronRight className="w-4 h-4" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                );
              })()}

            </div>
          )}

          {/* 3. FINAL PODIUM & RESULTS SCREEN */}
          {room && room.status === 'podium-finished' && (
            <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
              
              {/* PODIUM HERO BANNER */}
              <div className="bg-gradient-to-b from-blue-950/60 via-slate-900 to-slate-950 border-2 border-emerald-500/40 rounded-3xl p-6 shadow-2xl text-center space-y-5">
                <div className="inline-flex p-3 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-3xl shadow-xl shadow-amber-500/10 animate-bounce">
                  🏆
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {isHindi ? '🎉 ग्रुप क्विज़ संपन्न — परिणाम व रैंक' : '🎉 Group Quiz Finished — Final Standings'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">
                    {isHindi ? 'सभी प्रतिभागियों के सही-गलत उत्तर, समय और रैंक का विस्तृत विश्लेषण' : 'Complete scorecard breakdown and leader ranks for this live battle'}
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

              {/* PERSONAL SCORECARD */}
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
                      {Math.round((myParticipant.correctCount / Math.max(1, room.questions.length)) * 100)}% Accuracy
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
                      <div className="text-lg font-black text-blue-400 font-mono mt-0.5">{Math.round((myParticipant.totalTimeSeconds / Math.max(1, room.questions.length)) * 10) / 10}s</div>
                    </div>
                  </div>
                </div>
              )}

              {/* ACTION BUTTONS: PLAY AGAIN OR EXPORT */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => setRoom(null)}
                  className="flex-1 py-3.5 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-black text-xs sm:text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>{isHindi ? 'नया ग्रुप क्विज़ खेलें' : 'Play Another Live Battle'}</span>
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
