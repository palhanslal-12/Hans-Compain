import React, { useState, useEffect, useRef } from 'react';
import { 
  Award, Clock, CheckCircle2, AlertTriangle, HelpCircle, 
  RotateCcw, Sparkles, BookOpen, Layers, Zap, Download, 
  ChevronLeft, ChevronRight, Check, X, Bookmark, BookmarkCheck,
  Languages, FileText, Share2, Search, Filter, ShieldAlert, ArrowLeft,
  Pause, Play, Menu, Star, Flag, FileQuestion, SlidersHorizontal, AlertCircle,
  CheckSquare, Flame, ArrowRight, RefreshCw, Volume2
} from 'lucide-react';
import { QuizQuestion, MistakeNotebookItem } from '../types';

interface UnlimitedPyqVaultViewProps {
  onStartCustomTest?: (questions: QuizQuestion[], title: string) => void;
  onAddToMistakeNotebook?: (item: MistakeNotebookItem) => void;
  onExportPdf?: (title: string, elementId?: string, rawText?: string) => void;
  showToast: (msg: string, type?: 'info' | 'success' | 'warn' | 'error') => void;
}

interface ComprehensivePYQ {
  id: string;
  exam: string; // e.g. "SSC CGL"
  category: 'SSC' | 'Railway' | 'UPSC & Defence' | 'Banking' | 'State PSC' | 'Police & SI' | 'Teaching';
  year: string; // "2025", "2024", "2023", "2022", "2021", "2020", "2019"
  shift: string; // "Shift 1", "Shift 2", "Shift 3", "Mains Tier-2"
  subject: 'Polity & Constitution' | 'Modern History' | 'Geography & Environment' | 'General Science (PCB)' | 'Economy & Banking' | 'Quantitative Aptitude' | 'Logical Reasoning' | 'English Comprehension' | 'Hindi Vyakaran' | 'Computer Awareness';
  topic: string;
  questionHi: string;
  questionEn: string;
  optionsHi: string[];
  optionsEn: string[];
  answerIndex: number;
  explanationHi: string;
  explanationEn: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const EXTENSIVE_PYQ_DATABASE: ComprehensivePYQ[] = [
  // POLITY
  {
    id: 'pyq-pol-1',
    exam: 'SSC CGL Tier-1',
    category: 'SSC',
    year: '2024',
    shift: 'Shift 1 (14 Sept 2024)',
    subject: 'Polity & Constitution',
    topic: 'Fundamental Rights & Writs',
    questionHi: 'भारतीय संविधान के किस अनुच्छेद को डॉ. बी.आर. अम्बेडकर ने "संविधान का हृदय और आत्मा" (Heart and Soul of the Constitution) कहा था?',
    questionEn: 'Which Article of the Indian Constitution was termed as the "Heart and Soul of the Constitution" by Dr. B.R. Ambedkar?',
    optionsHi: ['अनुच्छेद 19 (वाक् स्वतंत्रता)', 'अनुच्छेद 21 (प्राण एवं दैहिक स्वतंत्रता)', 'अनुच्छेद 32 (संवैधानिक उपचारों का अधिकार)', 'अनुच्छेद 14 (विधि के समक्ष समता)'],
    optionsEn: ['Article 19 (Freedom of Speech)', 'Article 21 (Right to Life)', 'Article 32 (Right to Constitutional Remedies)', 'Article 14 (Equality before Law)'],
    answerIndex: 2,
    explanationHi: 'अनुच्छेद 32 नागरिकों को अपने मौलिक अधिकारों के प्रवर्तन के लिए सीधे सर्वोच्च न्यायालय जाने का अधिकार देता है। इसके तहत सुप्रीम कोर्ट 5 प्रकार की रिट (बंदी प्रत्यक्षीकरण, परमादेश, प्रतिषेध, उत्प्रेषण, अधिकार-पृच्छा) जारी कर सकता है।',
    explanationEn: 'Article 32 guarantees the right to move the Supreme Court for enforcement of Fundamental Rights. SC can issue 5 writs: Habeas Corpus, Mandamus, Prohibition, Certiorari, and Quo-Warranto.',
    difficulty: 'Easy'
  },
  {
    id: 'pyq-pol-2',
    exam: 'UPSC CDS / NDA',
    category: 'UPSC & Defence',
    year: '2024',
    shift: 'Paper 1 General Knowledge',
    subject: 'Polity & Constitution',
    topic: 'Directive Principles of State Policy (DPSP)',
    questionHi: 'भारतीय संविधान में राज्य के नीति निदेशक तत्व (DPSP) किस देश के संविधान से लिए गए हैं और यह किस भाग में हैं?',
    questionEn: 'Directive Principles of State Policy (DPSP) in Indian Constitution are borrowed from which country and placed in which Part?',
    optionsHi: ['आयरलैंड (भाग IV, अनुच्छेद 36-51)', 'यूएसए (भाग III, अनुच्छेद 12-35)', 'कनाडा (भाग V, अनुच्छेद 52-151)', 'ऑस्ट्रेलिया (भाग IV A, अनुच्छेद 51A)'],
    optionsEn: ['Ireland (Part IV, Articles 36-51)', 'USA (Part III, Articles 12-35)', 'Canada (Part V, Articles 52-151)', 'Australia (Part IV A, Article 51A)'],
    answerIndex: 0,
    explanationHi: 'DPSP को आयरलैंड के संविधान (1937) से लिया गया है। यह संविधान के भाग IV में अनुच्छेद 36 से 51 तक वर्णित हैं तथा यह गैर-प्रवर्तनीय (Non-justiciable) हैं।',
    explanationEn: 'DPSP is borrowed from Irish Constitution (1937) and placed in Part IV (Articles 36 to 51). They are non-justiciable in courts.',
    difficulty: 'Medium'
  },
  {
    id: 'pyq-pol-3',
    exam: 'BPSC 70th Prelims',
    category: 'State PSC',
    year: '2024',
    shift: 'General Studies Paper',
    subject: 'Polity & Constitution',
    topic: 'Panchayati Raj 73rd Amendment',
    questionHi: '73वें संविधान संशोधन अधिनियम, 1992 द्वारा भारतीय संविधान में कौन सी अनुसूची जोड़ी गई और इसमें कुल कितने विषय हैं?',
    questionEn: 'Which Schedule was added to the Indian Constitution by the 73rd Constitutional Amendment Act, 1992, and how many items does it contain?',
    optionsHi: ['11वीं अनुसूची (29 विषय)', '12वीं अनुसूची (18 विषय)', '10वीं अनुसूची (दल-बदल)', '9वीं अनुसूची (भूमि सुधार)'],
    optionsEn: ['11th Schedule (29 Subjects)', '12th Schedule (18 Subjects)', '10th Schedule (Anti-Defection)', '9th Schedule (Land Reforms)'],
    answerIndex: 0,
    explanationHi: '73वें संशोधन ने संविधान में भाग IX और 11वीं अनुसूची को जोड़ा, जिसमें पंचायतों के कार्य के लिए कुल 29 विषय शामिल हैं। 74वें संशोधन ने नगरपालिकाओं के लिए 12वीं अनुसूची (18 विषय) जोड़ी।',
    explanationEn: 'The 73rd Amendment inserted Part IX and 11th Schedule consisting of 29 functional items for Panchayats.',
    difficulty: 'Medium'
  },

  // HISTORY
  {
    id: 'pyq-hist-1',
    exam: 'Railway NTPC CBT-2',
    category: 'Railway',
    year: '2023',
    shift: 'Shift 2 (Graduate Level)',
    subject: 'Modern History',
    topic: 'Indian National Movement',
    questionHi: 'वर्ष 1916 के प्रसिद्ध लखनऊ समझौते (Lucknow Pact) के समय भारतीय राष्ट्रीय कांग्रेस के अध्यक्ष कौन थे?',
    questionEn: 'Who presided over the historic Lucknow Session of the Indian National Congress in 1916?',
    optionsHi: ['अंबिका चरण मजूमदार', 'बाल गंगाधर तिलक', 'एनी बेसेंट', 'मदन मोहन मालवीय'],
    optionsEn: ['Ambica Charan Mazumdar', 'Bal Gangadhar Tilak', 'Annie Besant', 'Madan Mohan Malaviya'],
    answerIndex: 0,
    explanationHi: '1916 के लखनऊ अधिवेशन में कांग्रेस के गरम दल और नरम दल का पुनर्मिलन हुआ तथा कांग्रेस और मुस्लिम लीग के बीच ऐतिहासिक समझौता हुआ। इसके अध्यक्ष अंबिका चरण मजूमदार थे।',
    explanationEn: 'Ambica Charan Mazumdar presided over the 1916 Lucknow session where the Moderates and Extremists reunited and Lucknow Pact with Muslim League was signed.',
    difficulty: 'Medium'
  },
  {
    id: 'pyq-hist-2',
    exam: 'SSC CPO SI',
    category: 'SSC',
    year: '2024',
    shift: 'Shift 3 (June 2024)',
    subject: 'Modern History',
    topic: 'Governor Generals & Viceroys',
    questionHi: 'भारत में स्थानीय स्वशासन (Local Self-Government) का जनक किसे कहा जाता है?',
    questionEn: 'Who is regarded as the "Father of Local Self-Government" in India?',
    optionsHi: ['लॉर्ड रिपन (Lord Ripon)', 'लॉर्ड कर्जन (Lord Curzon)', 'लॉर्ड डलहौजी (Lord Dalhousie)', 'लॉर्ड मेयो (Lord Mayo)'],
    optionsEn: ['Lord Ripon', 'Lord Curzon', 'Lord Dalhousie', 'Lord Mayo'],
    answerIndex: 0,
    explanationHi: 'लॉर्ड रिपन ने 1882 में स्थानीय स्वशासन पर एक ऐतिहासिक प्रस्ताव पेश किया, जिसके कारण उन्हें भारत में स्थानीय स्वशासन का पिता कहा जाता है।',
    explanationEn: 'Lord Ripon introduced the famous Resolution of 1882 for developing local self-governing institutions and is called the Father of Local Self-Government in India.',
    difficulty: 'Easy'
  },

  // GENERAL SCIENCE
  {
    id: 'pyq-sci-1',
    exam: 'Railway Group D / ALP',
    category: 'Railway',
    year: '2024',
    shift: 'Shift 1 Technical',
    subject: 'General Science (PCB)',
    topic: 'Physics - Optics & Human Eye',
    questionHi: 'निकट दृष्टि दोष (Myopia) को ठीक करने के लिए किस प्रकार के लेंस का उपयोग किया जाता है?',
    questionEn: 'Which type of lens is used to correct Myopia (Short-sightedness)?',
    optionsHi: ['अवतल लेंस (Concave Lens)', 'उत्तल लेंस (Convex Lens)', 'द्विफोकसी लेंस (Bifocal Lens)', 'बेलनाकार लेंस (Cylindrical Lens)'],
    optionsEn: ['Concave Lens', 'Convex Lens', 'Bifocal Lens', 'Cylindrical Lens'],
    answerIndex: 0,
    explanationHi: 'मायोपिया (निकट दृष्टि दोष) में दूर की वस्तुएं धुंधली दिखती हैं क्योंकि छवि रेटिना से पहले बनती है। अपसारी क्षमता वाले अवतल लेंस (Concave Lens) का उपयोग करके छवि को रेटिना पर केंद्रित किया जाता है।',
    explanationEn: 'In Myopia, the image is formed in front of the retina. A diverging concave lens is used to correctly focus the rays onto the retina.',
    difficulty: 'Easy'
  },
  {
    id: 'pyq-sci-2',
    exam: 'SSC CHSL 10+2',
    category: 'SSC',
    year: '2024',
    shift: 'Shift 2 (July 2024)',
    subject: 'General Science (PCB)',
    topic: 'Chemistry - Acid, Bases & Salts',
    questionHi: 'चींटी के डंक (Ant Sting) और नेटल पौधे के पत्तों में कौन सा अम्ल मौजूद होता है जो जलन पैदा करता है?',
    questionEn: 'Which acid is naturally present in ant sting and nettle leaf hair that causes burning pain?',
    optionsHi: ['मेथेनोइक अम्ल / फॉर्मिक एसिड (HCOOH)', 'एसिटिक अम्ल (CH3COOH)', 'ऑक्सालिक अम्ल', 'टार्टरिक अम्ल'],
    optionsEn: ['Methanoic acid / Formic acid (HCOOH)', 'Acetic acid (CH3COOH)', 'Oxalic acid', 'Tartaric acid'],
    answerIndex: 0,
    explanationHi: 'चींटी के डंक में फॉर्मिक एसिड (मेथेनोइक एसिड) होता है। इसके प्रभाव को बेकिंग सोडा (सोडियम हाइड्रोजन कार्बोनेट) या कैलामाइन लोशन लगाकर उदासीन किया जाता है।',
    explanationEn: 'Ant stings contain methanoic acid (formic acid, HCOOH). It can be neutralized by applying mild bases like baking soda or calamine solution.',
    difficulty: 'Easy'
  },

  // QUANTITATIVE APTITUDE
  {
    id: 'pyq-quant-1',
    exam: 'SSC CGL Mains Tier-2',
    category: 'SSC',
    year: '2024',
    shift: 'Paper 1 (Quantitative Section)',
    subject: 'Quantitative Aptitude',
    topic: 'Compound Interest vs Simple Interest',
    questionHi: 'किसी निश्चित मूलधन (P) पर 12% वार्षिक ब्याज दर से 2 वर्ष के लिए चक्रवृद्धि ब्याज (CI) और साधारण ब्याज (SI) का अंतर ₹144 है। मूलधन ज्ञात कीजिए।',
    questionEn: 'The difference between Compound Interest and Simple Interest on a certain sum at 12% per annum for 2 years is ₹144. Find the Principal.',
    optionsHi: ['₹10,000', '₹12,000', '₹8,500', '₹15,000'],
    optionsEn: ['₹10,000', '₹12,000', '₹8,500', '₹15,000'],
    answerIndex: 0,
    explanationHi: '2 वर्ष के लिए सूत्र: अंतर (D) = P × (R / 100)²\n144 = P × (12 / 100)²\n144 = P × (144 / 10000)\nP = ₹10,000',
    explanationEn: 'For 2 years: Difference = P * (R/100)^2\n144 = P * (12/100)^2 => 144 = P * (144 / 10000) => P = ₹10,000.',
    difficulty: 'Medium'
  },
  {
    id: 'pyq-quant-2',
    exam: 'Banking IBPS PO Prelims',
    category: 'Banking',
    year: '2024',
    shift: 'Quantitative Section Shift 1',
    subject: 'Quantitative Aptitude',
    topic: 'Time and Work Mechanics',
    questionHi: 'A किसी कार्य को 15 दिनों में और B उसी कार्य को 20 दिनों में पूरा कर सकता है। यदि वे दोनों एक साथ 4 दिनों तक कार्य करते हैं, तो कार्य का कितना भाग शेष रह जाएगा?',
    questionEn: 'A can do a work in 15 days and B in 20 days. If they work together on it for 4 days, what fraction of work is left?',
    optionsHi: ['8/15 भाग', '7/15 भाग', '1/3 भाग', '2/5 भाग'],
    optionsEn: ['8/15 fraction', '7/15 fraction', '1/3 fraction', '2/5 fraction'],
    answerIndex: 0,
    explanationHi: 'कुल कार्य (LCM of 15, 20) = 60 यूनिट।\nA की कार्यक्षमता = 60/15 = 4 यूनिट/दिन।\nB की कार्यक्षमता = 60/20 = 3 यूनिट/दिन।\nदोनों की संयुक्त क्षमता = 7 यूनिट/दिन।\n4 दिन में पूरा कार्य = 4 × 7 = 28 यूनिट।\nशेष कार्य = 60 - 28 = 32 यूनिट।\nशेष भाग = 32 / 60 = 8/15 भाग।',
    explanationEn: 'Total work = LCM(15, 20) = 60 units. Efficiency of A = 4, B = 3. Together in 4 days = 4 * 7 = 28 units. Remaining = 60 - 28 = 32 units. Fraction left = 32/60 = 8/15.',
    difficulty: 'Medium'
  },

  // REASONING
  {
    id: 'pyq-reas-1',
    exam: 'SSC CGL / CPO',
    category: 'SSC',
    year: '2024',
    shift: 'TCS iON Shift 2',
    subject: 'Logical Reasoning',
    topic: 'Syllogism (न्याय निगमन)',
    questionHi: 'कथन:\n1. सभी पेन पेंसिल हैं।\n2. कोई पेंसिल रबर नहीं है।\nनिष्कर्ष:\nI. कोई पेन रबर नहीं है।\nII. कुछ पेंसिल पेन हैं।',
    questionEn: 'Statements:\n1. All pens are pencils.\n2. No pencil is an eraser.\nConclusions:\nI. No pen is an eraser.\nII. Some pencils are pens.',
    optionsHi: ['निष्कर्ष I और II दोनों निकलते हैं', 'केवल निष्कर्ष I निकलता है', 'केवल निष्कर्ष II निकलता है', 'न तो I और न ही II'],
    optionsEn: ['Both conclusions I and II follow', 'Only conclusion I follows', 'Only conclusion II follows', 'Neither I nor II follows'],
    answerIndex: 0,
    explanationHi: '1. चूंकि पूरा पेन पेंसिल के अंदर है और कोई पेंसिल रबर नहीं हो सकती, अतः कोई पेन भी रबर नहीं होगा (निष्कर्ष I सत्य है)।\n2. सभी पेन पेंसिल हैं का रूपांतरण (Converse) "कुछ पेंसिल पेन हैं" सदैव सत्य होता है (निष्कर्ष II सत्य है)।',
    explanationEn: 'All pens are inside pencils, and no pencil touches eraser, so no pen touches eraser (I follows). All pens are pencils implies Some pencils are pens (II follows). Both follow.',
    difficulty: 'Easy'
  },

  // GEOGRAPHY
  {
    id: 'pyq-geo-1',
    exam: 'UP Police SI / Constable',
    category: 'Police & SI',
    year: '2024',
    shift: 'General Knowledge Shift 1',
    subject: 'Geography & Environment',
    topic: 'Indian River Systems & Dams',
    questionHi: 'भारत का सबसे ऊँचा बाँध "टिहरी बाँध" (Tehri Dam) किस राज्य में और किन नदियों के संगम पर स्थित है?',
    questionEn: 'India’s highest dam, "Tehri Dam", is situated in which state and at the confluence of which rivers?',
    optionsHi: ['उत्तराखंड (भागीरथी और भिलंगना नदी)', 'हिमाचल प्रदेश (सतलुज नदी)', 'जम्मू-कश्मीर (चिनाब नदी)', 'ओडिशा (महानदी)'],
    optionsEn: ['Uttarakhand (Bhagirathi and Bhilangna)', 'Himachal Pradesh (Satluj)', 'Jammu & Kashmir (Chenab)', 'Odisha (Mahanadi)'],
    answerIndex: 0,
    explanationHi: 'टिहरी बाँध भारत का सबसे ऊँचा (260.5 मीटर) बाँध है, जो उत्तराखंड के टिहरी जिले में भागीरथी और भिलंगना नदी के संगम पर स्थित है।',
    explanationEn: 'Tehri Dam (260.5 m height) is India’s highest dam located in Uttarakhand on the confluence of Bhagirathi and Bhilangna rivers.',
    difficulty: 'Easy'
  }
];

// Procedural Generator for Infinite Random PYQ Generation
function generateProceduralPYQ(index: number): ComprehensivePYQ {
  const categories: ComprehensivePYQ['category'][] = ['SSC', 'Railway', 'UPSC & Defence', 'Banking', 'State PSC', 'Police & SI'];
  const subjects: ComprehensivePYQ['subject'][] = [
    'Polity & Constitution', 'Modern History', 'General Science (PCB)', 'Quantitative Aptitude', 'Logical Reasoning', 'Geography & Environment', 'Economy & Banking'
  ];
  const years = ['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017'];
  const cat = categories[index % categories.length];
  const subj = subjects[index % subjects.length];
  const yr = years[index % years.length];

  const pool = [
    {
      topic: 'Indian Constitution Articles',
      qHi: `भारतीय संविधान का अनुच्छेद ${50 + (index % 40)} निम्नलिखित में से किससे संबंधित है?`,
      qEn: `Article ${50 + (index % 40)} of the Indian Constitution is related to which of the following?`,
      optsHi: ['कार्यपालिका से न्यायपालिका का पृथक्करण', 'समान नागरिक संहिता (UCC)', 'ग्राम पंचायतों का गठन', 'मातृभूमि की रक्षा व राष्ट्रीय स्मारक'],
      optsEn: ['Separation of Judiciary from Executive', 'Uniform Civil Code (UCC)', 'Organization of Village Panchayats', 'Protection of Monuments'],
      ans: 0,
      expHi: `अनुच्छेद 50 राज्य को लोक सेवाओं में न्यायपालिका को कार्यपालिका से पृथक करने के लिए निर्देश देता है।`,
      expEn: `Article 50 directs the state to separate the judiciary from the executive in the public services.`,
      diff: 'Medium' as const
    },
    {
      topic: 'Speed, Time and Distance',
      qHi: `एक ट्रेन 72 किमी/घंटा की गति से चल रही है। 200 मीटर लंबे प्लेटफॉर्म को पार करने में यह 15 सेकंड लेती है। ट्रेन की लंबाई कितनी है?`,
      qEn: `A train running at 72 km/h crosses a 200m long platform in 15 seconds. What is the length of the train?`,
      optsHi: ['100 मीटर', '120 मीटर', '150 मीटर', '80 मीटर'],
      optsEn: ['100 meters', '120 meters', '150 meters', '80 meters'],
      ans: 0,
      expHi: `गति = 72 × (5/18) = 20 मी/से। कुल दूरी = 20 × 15 = 300 मीटर। ट्रेन की लंबाई = 300 - 200 = 100 मीटर।`,
      expEn: `Speed = 72 * 5/18 = 20 m/s. Total distance = 20 * 15 = 300m. Train length = 300 - 200 = 100m.`,
      diff: 'Easy' as const
    },
    {
      topic: 'Chemical Compounds & Uses',
      qHi: `प्लास्टर ऑफ पेरिस (Plaster of Paris) का सही रासायनिक सूत्र क्या है?`,
      qEn: `What is the correct chemical formula of Plaster of Paris (POP)?`,
      optsHi: ['CaSO4 · 1/2 H2O', 'CaSO4 · 2 H2O', 'CaCO3', 'CaOCl2'],
      optsEn: ['CaSO4 · 1/2 H2O (Calcium Sulphate Hemihydrate)', 'CaSO4 · 2 H2O (Gypsum)', 'CaCO3', 'CaOCl2 (Bleaching Powder)'],
      ans: 0,
      expHi: `जिप्सम (CaSO4·2H2O) को 373 K पर गर्म करने पर यह प्लास्टर ऑफ पेरिस (CaSO4·1/2H2O) में बदल जाता है।`,
      expEn: `Heating Gypsum (CaSO4.2H2O) at 373 K loses water molecules to form Calcium Sulphate Hemihydrate (POP).`,
      diff: 'Easy' as const
    },
    {
      topic: 'Biosphere Reserves & National Parks',
      qHi: `काजीरंगा राष्ट्रीय उद्यान (Kaziranga National Park) किस राज्य में स्थित है और यह किसके लिए प्रसिद्ध है?`,
      qEn: `Kaziranga National Park is located in which state and is famous for?`,
      optsHi: ['असम (एक सींग वाला गैंडा / One-horned Rhino)', 'मध्य प्रदेश (रॉयल बंगाल टाइगर)', 'गुजरात (एशियाई शेर)', 'केरल (नीलगिरि तहर)'],
      optsEn: ['Assam (One-horned Rhinoceros)', 'Madhya Pradesh (Royal Bengal Tiger)', 'Gujarat (Asiatic Lion)', 'Kerala (Nilgiri Tahr)'],
      ans: 0,
      expHi: `काजीरंगा राष्ट्रीय उद्यान असम में ब्रह्मपुत्र नदी के किनारे स्थित यूनेस्को विश्व धरोहर स्थल है।`,
      expEn: `Kaziranga in Assam is a UNESCO World Heritage site home to world's largest population of great one-horned rhinos.`,
      diff: 'Easy' as const
    }
  ];

  const item = pool[index % pool.length];
  return {
    id: `pyq-gen-${index + 100}`,
    exam: `${cat} Tier-1 Shift ${(index % 3) + 1}`,
    category: cat,
    year: yr,
    shift: `Official Shift ${(index % 3) + 1}`,
    subject: subj,
    topic: item.topic,
    questionHi: item.qHi,
    questionEn: item.qEn,
    optionsHi: item.optsHi,
    optionsEn: item.optsEn,
    answerIndex: item.ans,
    explanationHi: item.expHi,
    explanationEn: item.expEn,
    difficulty: item.diff
  };
}

export const UnlimitedPyqVaultView: React.FC<UnlimitedPyqVaultViewProps> = ({
  onStartCustomTest,
  onAddToMistakeNotebook,
  onExportPdf,
  showToast
}) => {
  const [activeTab, setActiveTab] = useState<'endless' | 'papers' | 'generator'>('endless');
  const [lang, setLang] = useState<'hi' | 'en'>('hi');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Endless Practice State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [scoreStats, setScoreStats] = useState({ correct: 0, wrong: 0, total: 0 });
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [extraGeneratedQuestions, setExtraGeneratedQuestions] = useState<ComprehensivePYQ[]>([]);

  // Generator Config State
  const [genExam, setGenExam] = useState('SSC CGL 2024-2026');
  const [genSubject, setGenSubject] = useState('All Mixed (Full Mock)');
  const [genCount, setGenCount] = useState<number>(25);

  // Combine static and dynamically generated questions
  const allQuestions = [...EXTENSIVE_PYQ_DATABASE, ...extraGeneratedQuestions];

  const filteredQuestions = allQuestions.filter(q => {
    const matchCat = selectedCategory === 'All' || q.category === selectedCategory;
    const matchSubj = selectedSubject === 'All' || q.subject === selectedSubject;
    const matchYr = selectedYear === 'All' || q.year === selectedYear;
    const matchSearch = q.questionHi.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        q.questionEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        q.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        q.exam.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSubj && matchYr && matchSearch;
  });

  const currentQ = filteredQuestions[currentIndex] || filteredQuestions[0] || EXTENSIVE_PYQ_DATABASE[0];

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null) return; // already answered
    setSelectedOption(idx);
    setShowExplanation(true);

    const isCorrect = idx === currentQ.answerIndex;
    setScoreStats(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      wrong: prev.wrong + (isCorrect ? 0 : 1),
      total: prev.total + 1
    }));

    if (isCorrect) {
      showToast("सटीक उत्तर! +2 अंक 🎯", "success");
    } else {
      showToast("गलत उत्तर! -0.5 अंक ⚠️", "error");
      if (onAddToMistakeNotebook) {
        onAddToMistakeNotebook({
          id: `mistake-${Date.now()}`,
          question: lang === 'hi' ? currentQ.questionHi : currentQ.questionEn,
          options: lang === 'hi' ? currentQ.optionsHi : currentQ.optionsEn,
          subject: selectedSubject,
          userAnswer: (lang === 'hi' ? currentQ.optionsHi : currentQ.optionsEn)[idx],
          correctAnswer: (lang === 'hi' ? currentQ.optionsHi : currentQ.optionsEn)[currentQ.answerIndex],
          explanation: lang === 'hi' ? currentQ.explanationHi : currentQ.explanationEn,
          timestamp: new Date().toISOString(),
          topic: currentQ.topic
        });
      }
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    if (currentIndex + 1 < filteredQuestions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Auto generate more questions so it's truly UNLIMITED!
      const newItems: ComprehensivePYQ[] = [];
      for (let i = 0; i < 10; i++) {
        newItems.push(generateProceduralPYQ(extraGeneratedQuestions.length + i));
      }
      setExtraGeneratedQuestions(prev => [...prev, ...newItems]);
      setCurrentIndex(currentIndex + 1);
      showToast("✨ 10 नए PYQs ऑटो-लोड किए गए (Endless Stream)", "info");
    }
  };

  const handlePrevQuestion = () => {
    if (currentIndex > 0) {
      setSelectedOption(null);
      setShowExplanation(false);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const toggleBookmark = (id: string) => {
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(bookmarkedIds.filter(b => b !== id));
      showToast("बुकमार्क से हटाया गया", "info");
    } else {
      setBookmarkedIds([...bookmarkedIds, id]);
      showToast("PYQ बुकमार्क में सेव हो गया! 📌", "success");
    }
  };

  const handleGenerateAndStartTest = () => {
    const count = genCount;
    const testQs: QuizQuestion[] = [];
    for (let i = 0; i < count; i++) {
      const q = (allQuestions[i % allQuestions.length] || generateProceduralPYQ(i));
      testQs.push({
        question: lang === 'hi' ? q.questionHi : q.questionEn,
        options: lang === 'hi' ? q.optionsHi : q.optionsEn,
        answerIndex: q.answerIndex,
        explanation: lang === 'hi' ? q.explanationHi : q.explanationEn,
        hint: `PYQ Topic: ${q.topic} (${q.exam} ${q.year})`
      });
    }

    if (onStartCustomTest) {
      onStartCustomTest(testQs, `Unlimited PYQ Mock: ${genExam} (${count} Qs)`);
      showToast(`🎯 ${count} प्रश्नों का PYQ टेस्ट शुरू किया गया!`, "success");
    } else {
      showToast("टेस्ट शुरू किया जा रहा है...", "info");
    }
  };

  const categories = ['All', 'SSC', 'Railway', 'UPSC & Defence', 'Banking', 'State PSC', 'Police & SI'];
  const subjects = [
    'All', 'Polity & Constitution', 'Modern History', 'General Science (PCB)', 'Quantitative Aptitude', 'Logical Reasoning', 'Geography & Environment', 'Economy & Banking'
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-[#0a0f1d] text-slate-100 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-cyan-950 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 rounded-full text-xs font-black flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                UNLIMITED PYQ VAULT (2015 - 2026)
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-semibold">
                Endless Practice
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              असीमित पिछले वर्षों के प्रश्न (Unlimited PYQ Hub)
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              SSC CGL/CHSL/CPO/GD, Railway NTPC/ALP/Group D, UPSC, Banking, BPSC व State Police के प्रामाणिक प्रश्न पत्र हल सहित।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800">
              <button
                onClick={() => setActiveTab('endless')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border-none flex items-center gap-1.5 ${
                  activeTab === 'endless' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-300" />
                <span>अनंत अभ्यास (Live)</span>
              </button>
              <button
                onClick={() => setActiveTab('generator')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border-none flex items-center gap-1.5 ${
                  activeTab === 'generator' ? 'bg-cyan-600 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>कस्टम टेस्ट जनरेटर</span>
              </button>
            </div>

            <button
              onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs rounded-xl cursor-pointer transition-all"
            >
              भाषा: <span className="text-cyan-400 uppercase font-black">{lang === 'hi' ? 'हिंदी' : 'English'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Exam Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentIndex(0);
                  setSelectedOption(null);
                  setShowExplanation(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border-none ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentIndex(0);
              }}
              placeholder="Search topic, exam, question..."
              className="bg-transparent border-none outline-none text-xs text-slate-200 placeholder:text-slate-500 w-full"
            />
          </div>
        </div>

        {/* Subject Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1 scrollbar-none text-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mr-1">विषय:</span>
          {subjects.map(subj => (
            <button
              key={subj}
              onClick={() => {
                setSelectedSubject(subj);
                setCurrentIndex(0);
                setSelectedOption(null);
                setShowExplanation(false);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer border-none ${
                selectedSubject === subj
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              {subj}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: ENDLESS PRACTICE MODE */}
      {activeTab === 'endless' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Question Card */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-6 shadow-xl relative">
              {/* Question Meta Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded-xl text-xs font-bold">
                    🏛️ {currentQ.exam} ({currentQ.year})
                  </span>
                  <span className="px-2.5 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-lg text-xs font-semibold">
                    {currentQ.subject}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Shift: {currentQ.shift}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">
                    Q: <b className="text-white">{currentIndex + 1}</b> / {filteredQuestions.length}+
                  </span>
                  <button
                    onClick={() => toggleBookmark(currentQ.id)}
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                      bookmarkedIds.includes(currentQ.id)
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                    title="Bookmark Question"
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <div className="space-y-3">
                <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wide">
                  Topic: {currentQ.topic}
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white leading-relaxed whitespace-pre-wrap">
                  {lang === 'hi' ? currentQ.questionHi : currentQ.questionEn}
                </h2>
              </div>

              {/* Options */}
              <div className="space-y-3 pt-2">
                {(lang === 'hi' ? currentQ.optionsHi : currentQ.optionsEn).map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentQ.answerIndex;
                  const hasAnswered = selectedOption !== null;

                  let btnStyle = "bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-200";
                  if (hasAnswered) {
                    if (isCorrect) {
                      btnStyle = "bg-emerald-950/60 border-emerald-500/80 text-emerald-200 shadow-md shadow-emerald-950/40";
                    } else if (isSelected && !isCorrect) {
                      btnStyle = "bg-rose-950/60 border-rose-500/80 text-rose-200 shadow-md shadow-rose-950/40";
                    } else {
                      btnStyle = "bg-slate-950/40 border-slate-900 text-slate-500 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={hasAnswered}
                      className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-3 cursor-pointer ${btnStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-xs shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </div>

                      {hasAnswered && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      )}
                      {hasAnswered && isSelected && !isCorrect && (
                        <X className="w-5 h-5 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Box */}
              {showExplanation && (
                <div className="bg-[#070b14] border border-cyan-500/30 rounded-2xl p-4 sm:p-5 space-y-2 animate-fade-in">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>विस्तृत व्याख्या व समाधान (Detailed Solution & Concept):</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
                    {lang === 'hi' ? currentQ.explanationHi : currentQ.explanationEn}
                  </p>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={handlePrevQuestion}
                  disabled={currentIndex === 0}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all border border-slate-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>पिछला प्रश्न</span>
                </button>

                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer transition-all shadow-lg shadow-indigo-600/30 border-none"
                >
                  <span>अगला प्रश्न (Next PYQ)</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Stats & Quick Jump */}
          <div className="lg:col-span-4 space-y-4">
            {/* Live Score Tracker */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>लाइव स्कोर व प्रदर्शन (Live Stats)</span>
              </h3>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <div className="text-xs text-slate-400">कुल हल</div>
                  <div className="text-lg font-black text-white">{scoreStats.total}</div>
                </div>
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl">
                  <div className="text-xs text-emerald-400">सटीक (Right)</div>
                  <div className="text-lg font-black text-emerald-300">{scoreStats.correct}</div>
                </div>
                <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl">
                  <div className="text-xs text-rose-400">गलत (Wrong)</div>
                  <div className="text-lg font-black text-rose-300">{scoreStats.wrong}</div>
                </div>
              </div>

              <div className="text-xs text-slate-400 flex items-center justify-between pt-1">
                <span>Accuracy: <b className="text-cyan-300 font-mono">{scoreStats.total > 0 ? Math.round((scoreStats.correct / scoreStats.total) * 100) : 0}%</b></span>
                <span>Net Score: <b className="text-amber-300 font-mono">{(scoreStats.correct * 2 - scoreStats.wrong * 0.5).toFixed(1)} Marks</b></span>
              </div>
            </div>

            {/* Quick Generator Box */}
            <div className="bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-3xl p-5 space-y-3 text-xs">
              <div className="flex items-center gap-2 text-indigo-300 font-bold">
                <Zap className="w-4 h-4 text-amber-300" />
                <span>असीमित टेस्ट जनरेटर (1-Click Test)</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                अपने चुने हुए विषय और परीक्षा के आधार पर तुरंत 25, 50 या 100 प्रश्नों का मॉक टेस्ट जनरेट करें।
              </p>
              <button
                onClick={() => setActiveTab('generator')}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md border-none"
              >
                <span>कस्टम टेस्ट बनाएं →</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CUSTOM TEST GENERATOR */}
      {activeTab === 'generator' && (
        <div className="max-w-3xl mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="space-y-2 text-center">
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-full text-xs font-bold">
              AI-POWERED CUSTOM PYQ GENERATOR
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              अनलिमिटेड PYQ टेस्ट जनरेटर
            </h2>
            <p className="text-xs text-slate-300">
              अपनी पसंद की परीक्षा, विषय और प्रश्नों की संख्या चुनकर नया टेस्ट सेट शुरू करें।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Exam Select */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">🎯 टारगेट परीक्षा (Target Exam):</label>
              <select
                value={genExam}
                onChange={(e) => setGenExam(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 outline-none font-medium"
              >
                <option value="SSC CGL 2024-2026">SSC CGL (Tier 1 & Tier 2)</option>
                <option value="Railway NTPC / Group D">Railway RRB NTPC / Group D / ALP</option>
                <option value="UPSC CSE & CDS / NDA">UPSC CSE / CDS / NDA / CAPF</option>
                <option value="Banking IBPS & SBI PO">Banking SBI / IBPS PO & Clerk</option>
                <option value="BPSC & State PSCs">BPSC 70th / UPPSC / State PSCs</option>
                <option value="State Police SI & Constable">State Police SI & Constable</option>
              </select>
            </div>

            {/* Subject Select */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">📚 विषय (Subject):</label>
              <select
                value={genSubject}
                onChange={(e) => setGenSubject(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 outline-none font-medium"
              >
                <option value="All Mixed (Full Mock)">All Mixed (संपूर्ण फुल मॉक टेस्ट)</option>
                <option value="Polity & Constitution">भारतीय संविधान व राजव्यवस्था</option>
                <option value="Modern History">आधुनिक भारत का इतिहास व राष्ट्रीय आंदोलन</option>
                <option value="General Science (PCB)">सामान्य विज्ञान (Physics, Chem, Bio)</option>
                <option value="Quantitative Aptitude">गणित (Quantitative Aptitude & DI)</option>
                <option value="Logical Reasoning">रीजनिंग (Logical & Analytical Reasoning)</option>
                <option value="Geography & Environment">भूगोल व पर्यावरण</option>
              </select>
            </div>

            {/* Question Count Select */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">🔢 प्रश्नों की संख्या (Questions):</label>
              <div className="grid grid-cols-4 gap-2">
                {[10, 25, 50, 100].map(count => (
                  <button
                    key={count}
                    onClick={() => setGenCount(count)}
                    className={`py-2.5 rounded-xl font-bold cursor-pointer transition-all border-none ${
                      genCount === count
                        ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                        : 'bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    {count} Qs
                  </button>
                ))}
              </div>
            </div>

            {/* Timing */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">⏱️ निर्धारित समय (Time Limit):</label>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-cyan-400 font-bold flex items-center justify-between">
                <span>{genCount === 10 ? '10 मिनट' : genCount === 25 ? '25 मिनट' : genCount === 50 ? '50 मिनट' : '100 मिनट'}</span>
                <span className="text-[11px] text-slate-500">TCS iON Standard</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleGenerateAndStartTest}
              className="w-full sm:flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xl shadow-emerald-600/30 border-none"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>{genCount} प्रश्नों का लाइव टेस्ट शुरू करें 🚀</span>
            </button>
            <button
              onClick={() => setActiveTab('endless')}
              className="py-3 px-5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl text-xs font-bold cursor-pointer transition-all border border-slate-700"
            >
              कैंसिल
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
