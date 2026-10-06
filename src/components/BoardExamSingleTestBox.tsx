import React, { useState } from 'react';
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
  Check
} from 'lucide-react';
import { recordStudyActivity } from '../firebase';

interface BoardQuestion {
  id: string;
  board: 'BSEB' | 'UPMSP' | 'CBSE' | 'JAC';
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

const boardExamQuestions: BoardQuestion[] = [
  // Class 10th Science (Physics / Chemistry / Biology)
  {
    id: 'b10-sci-1',
    board: 'BSEB',
    classLevel: '10th',
    subject: 'विज्ञान (Science)',
    chapter: 'प्रकाश का परावर्तन तथा अपवर्तन',
    question: 'प्रकाश के परावर्तन के कितने नियम हैं? (How many laws of reflection of light are there?)',
    options: ['1 नियम', '2 नियम', '3 नियम', '4 नियम'],
    correctAnswer: 1,
    explanation: 'प्रकाश के परावर्तन के 2 मुख्य नियम हैं: (1) आपतन कोण सदैव परावर्तन कोण के बराबर होता है (∠i = ∠r), और (2) आपतित किरण, परावर्तित किरण तथा आपतन बिंदु पर अभिलंब तीनों एक ही तल में होते हैं।',
    yearTag: 'BSEB 2021, 2023, 2025'
  },
  {
    id: 'b10-sci-2',
    board: 'BSEB',
    classLevel: '10th',
    subject: 'विज्ञान (Science)',
    chapter: 'प्रकाश का परावर्तन तथा अपवर्तन',
    question: 'समतल दर्पण द्वारा बना प्रतिबिंब सदा कैसा होता है?',
    options: ['वास्तविक और उल्टा', 'काल्पनिक (आभासी) और सीधा', 'वास्तविक और सीधा', 'काल्पनिक और उल्टा'],
    correctAnswer: 1,
    explanation: 'समतल दर्पण द्वारा बना प्रतिबिंब सदैव काल्पनिक (आभासी), सीधा और वस्तु के समान आकार का होता है।',
    yearTag: 'BSEB 2022, UP Board 2024'
  },
  {
    id: 'b10-sci-3',
    board: 'UPMSP',
    classLevel: '10th',
    subject: 'विज्ञान (Science)',
    chapter: 'विद्युत धारा (Electricity)',
    question: 'प्रतिरोध (Resistance) का SI मात्रक क्या है?',
    options: ['एम्पियर (Ampere)', 'ओम (Ohm - Ω)', 'वोल्ट (Volt)', 'वाट (Watt)'],
    correctAnswer: 1,
    explanation: 'प्रतिरोध का SI मात्रक ओम (Ω) है। ओम के नियम के अनुसार R = V / I होता है।',
    yearTag: 'UPMSP 2023, BSEB 2024'
  },
  {
    id: 'b10-sci-4',
    board: 'BSEB',
    classLevel: '10th',
    subject: 'विज्ञान (Science)',
    chapter: 'रासायनिक अभिक्रियाएं एवं समीकरण',
    question: 'लोहे को जिंक (Zinc) से लेपित करने की क्रिया को क्या कहते हैं?',
    options: ['संक्षारण', 'गैल्वनीकरण (Galvanization)', 'पानी चढ़ाना', 'विद्युत अपघटन'],
    correctAnswer: 1,
    explanation: 'लोहे को जंग से बचाने के लिए उस पर जिंक (जस्ता) की परत चढ़ाने की प्रक्रिया को गैल्वनीकरण (यशदलेपन) कहते हैं।',
    yearTag: 'BSEB 2020, 2024'
  },
  // Class 10th Mathematics
  {
    id: 'b10-math-1',
    board: 'BSEB',
    classLevel: '10th',
    subject: 'गणित (Mathematics)',
    chapter: 'त्रिकोणमिति का परिचय (Trigonometry)',
    question: 'यदि sin θ = 3/5 हो, तो cos θ का मान क्या होगा?',
    options: ['4/5', '3/4', '5/4', '5/3'],
    correctAnswer: 0,
    explanation: 'चूँकि sin²θ + cos²θ = 1, अतः cos θ = √(1 - (3/5)²) = √(1 - 9/25) = √(16/25) = 4/5।',
    yearTag: 'BSEB 2023, CBSE 2024'
  },
  {
    id: 'b10-math-2',
    board: 'BSEB',
    classLevel: '10th',
    subject: 'गणित (Mathematics)',
    chapter: 'समांतर श्रेणी (Arithmetic Progression)',
    question: 'समांतर श्रेणी 2, 7, 12, ... का 10वाँ पद क्या होगा?',
    options: ['45', '47', '50', '52'],
    correctAnswer: 1,
    explanation: 'यहाँ प्रथम पद a = 2, सार्व अंतर d = 7 - 2 = 5, और n = 10। सूत्र: Tn = a + (n - 1)d = 2 + (10 - 1)×5 = 2 + 45 = 47।',
    yearTag: 'NCERT Exemplar, BSEB 2024'
  },
  // Class 10th Social Science
  {
    id: 'b10-sst-1',
    board: 'BSEB',
    classLevel: '10th',
    subject: 'सामाजिक विज्ञान (Social Science)',
    chapter: 'भारत में राष्ट्रवाद (History)',
    question: 'जालियाँवाला बाग हत्याकांड किस तिथि को हुआ था?',
    options: ['13 अप्रैल 1919 ई.', '14 अप्रैल 1919 ई.', '15 अप्रैल 1919 ई.', '16 अप्रैल 1919 ई.'],
    correctAnswer: 0,
    explanation: '13 अप्रैल 1919 को बैसाखी के दिन अमृतसर के जालियाँवाला बाग में जनरल डायर ने निहत्थी भीड़ पर गोलियाँ चलवाई थीं।',
    yearTag: 'BSEB 2019, 2022, 2025'
  },
  // Class 12th Physics
  {
    id: 'b12-phy-1',
    board: 'BSEB',
    classLevel: '12th',
    subject: 'भौतिकी (Physics)',
    chapter: 'स्थिर वैद्युतिकी (Electrostatics)',
    question: 'निर्वात की विद्युतशीलता (Permittivity of Free Space - ε₀) का मात्रक क्या है?',
    options: ['N·m²/C²', 'C²/(N·m²)', 'C/V', 'N/C'],
    correctAnswer: 1,
    explanation: 'कूलॉम के नियम F = (1/4πε₀)·(q₁q₂/r²) से ε₀ का मात्रक C²·N⁻¹·m⁻² या फैराड प्रति मीटर (F/m) होता है।',
    yearTag: 'BSEB Inter 2023, UPMSP 2024'
  },
  {
    id: 'b12-phy-2',
    board: 'UPMSP',
    classLevel: '12th',
    subject: 'भौतिकी (Physics)',
    chapter: 'अर्धचालक इलेक्ट्रॉनिकी (Semiconductors)',
    question: 'NAND गेट के लिए बूलियन व्यंजक (Boolean Expression) क्या है?',
    options: ['Y = A + B', 'Y = A · B', 'Y =overline(A · B)', 'Y = overline(A + B)'],
    correctAnswer: 2,
    explanation: 'AND गेट के साथ NOT गेट जोड़ने पर NAND गेट प्राप्त होता है, जिसका बूलियन व्यंजक Y = (A · B)\' या overline(A · B) होता है।',
    yearTag: 'BSEB 2022, 2024'
  },
  // Class 12th Chemistry & Biology
  {
    id: 'b12-chem-1',
    board: 'BSEB',
    classLevel: '12th',
    subject: 'रसायन शास्त्र (Chemistry)',
    chapter: 'ठोस अवस्था एवं विलयन (Solutions)',
    question: 'शुद्ध जल की मोलरता (Molarity of pure water) कितनी होती है?',
    options: ['18 M', '50 M', '55.55 M', '100 M'],
    correctAnswer: 2,
    explanation: '1 लीटर (1000 g) शुद्ध जल में मोलों की संख्या = 1000 / 18 = 55.55 मोल/लीटर (M) होती है।',
    yearTag: 'BSEB 2021, CBSE 2023'
  },
  {
    id: 'b12-bio-1',
    board: 'BSEB',
    classLevel: '12th',
    subject: 'जीव विज्ञान (Biology)',
    chapter: 'आनुवंशिकी एवं डीएनए (Genetics)',
    question: 'DNA में कौन-सा नाइट्रोजनी क्षार (Nitrogenous Base) अनुपस्थित होता है?',
    options: ['एडेनिन (Adenine)', 'थाइमिन (Thymine)', 'यूरेसिल (Uracil)', 'ग्वानिन (Guanine)'],
    correctAnswer: 2,
    explanation: 'यूरेसिल (Uracil) केवल RNA में पाया जाता है, जबकि DNA में इसके स्थान पर थाइमिन (Thymine) होता है।',
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
      { title: 'जूल का तापन नियम (Joule\'s Law)', exp: 'H = I²Rt जूल' }
    ],
    subjectiveQA: [
      {
        q: 'प्रश्न 1: प्रकाश के अपवर्तन के नियमों को लिखें तथा स्नेल के नियम की व्याख्या करें।',
        a: 'उत्तर: जब प्रकाश की किरण एक पारदर्शी माध्यम से दूसरे पारदर्शी माध्यम में प्रवेश करती है, तो वह अपने पथ से विचलित हो जाती है। नियम: (1) आपतित किरण, अपवर्तित किरण और आपतन बिंदु पर अभिलंब तीनों एक ही तल में होते हैं। (2) स्नेल का नियम: किन्हीं दो माध्यमों और एकवर्णी प्रकाश के लिए आपतन कोण की ज्या (sin i) और अपवर्तन कोण की ज्या (sin r) का अनुपात एक नियतांक होता है: sin i / sin r = μ (अपवर्तनांक)।',
        marks: '2 अंक / 5 अंक (दीर्घ उत्तरीय)'
      },
      {
        q: 'प्रश्न 2: ओम का नियम क्या है? इसका प्रायोगिक सत्यापन कैसे किया जाता है?',
        a: 'उत्तर: जॉर्ज साइमन ओम के अनुसार, यदि किसी चालक की भौतिक अवस्थाएं (जैसे ताप) अपरिवर्तित रहें, तो उसके सिरों पर लगाया गया विभवांतर (V) उसमें प्रवाहित विद्युत धारा (I) के समानुपाती होता है। अर्थात् V ∝ I या V = IR, जहाँ R चालक का प्रतिरोध है।',
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
        q: 'प्रश्न 1: सिद्ध करें कि √2 एक अपरिमेय संख्या है। (Prove that √2 is irrational)',
        a: 'उत्तर: इसके विपरीत मान लें कि √2 एक परिमेय संख्या है। तब √2 = p/q (जहाँ p, q सह-अभाज्य पूर्णांक हैं और q ≠ 0)। दोनों तरफ वर्ग करने पर 2 = p²/q² ⇒ p² = 2q², अतः 2, p² को विभाजित करता है इसलिए 2, p को भी विभाजित करेगा। इसी प्रकार 2, q को भी विभाजित करेगा जो हमारी मान्यता का विरोधाभास है। अतः √2 एक अपरिमेय संख्या है।',
        marks: '3 अंक (अनिवार्य बोर्ड प्रश्न)'
      }
    ]
  }
};

export const BoardExamSingleTestBox: React.FC = () => {
  // Multi-Step State: Step 1 (Board & Class) -> Step 2 (Subject & Resource Hub) -> Step 3 (Interactive Tool)
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedBoard, setSelectedBoard] = useState<'ALL' | 'BSEB' | 'UPMSP' | 'CBSE'>('BSEB');
  const [selectedClass, setSelectedClass] = useState<'10th' | '12th'>('10th');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [activeToolMode, setActiveToolMode] = useState<'mcq-test' | 'topper-notes' | 'subjective-qa'>('mcq-test');

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [attempted, setAttempted] = useState<number>(0);
  const [revealedSubjective, setRevealedSubjective] = useState<Record<number, boolean>>({});

  // Filter questions
  const filteredQuestions = boardExamQuestions.filter(q => {
    const classMatch = q.classLevel === selectedClass;
    const boardMatch = selectedBoard === 'ALL' || q.board === selectedBoard || q.board === 'BSEB';
    const subMatch = selectedSubject === 'ALL' || q.subject === selectedSubject;
    return classMatch && boardMatch && subMatch;
  });

  const activeList = filteredQuestions.length > 0 ? filteredQuestions : boardExamQuestions;
  const currentQ = activeList[currentIndex % activeList.length];

  const subjectsForClass = Array.from(
    new Set(boardExamQuestions.filter(q => q.classLevel === selectedClass).map(q => q.subject))
  );

  const handleSelectOption = (idx: number) => {
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
      `${currentQ.question} — ${currentQ.options[currentQ.correctAnswer]} (${currentQ.explanation})`,
      isCorrect ? 100 : 0
    );
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setCurrentIndex(prev => (prev + 1) % activeList.length);
  };

  const handleReset = () => {
    setSelectedOption(null);
    setCurrentIndex(0);
    setScore(0);
    setAttempted(0);
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'hi-IN';
    utter.rate = 0.95;
    window.speechSynthesis.speak(utter);
  };

  const activeNotes =
    chapterNotesMap[selectedSubject] ||
    chapterNotesMap['विज्ञान (Science)'];

  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-fade-in pb-12">
      {/* Top Banner + 3-Step Progress Bar */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-indigo-950/50 border border-amber-500/30 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black uppercase tracking-wider">
              <GraduationCap className="w-4 h-4" />
              <span>10th &amp; 12th Board Exam Hub • {selectedBoard} ({selectedClass})</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              बोर्ड परीक्षा: 3-चरण स्मार्ट अध्ययन एवं सिंगल टेस्ट बॉक्स
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              चरण 1: बोर्ड व कक्षा चुनें → चरण 2: विषय व अध्ययन संसाधन चुनें → चरण 3: लाइव OMR टेस्ट व टॉपर नोट्स।
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-950/90 border border-slate-800 px-4 py-2.5 rounded-2xl shrink-0">
            <div className="text-center pr-3 border-r border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">स्कोर (Score)</span>
              <span className="text-lg font-black text-emerald-400 font-mono">
                {score} / {attempted}
              </span>
            </div>
            <button
              onClick={handleReset}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="टेस्ट रीसेट करें"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Interactive 3-Step Stepper Navigation */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80">
          {[
            { num: 1 as const, title: 'Step 1: बोर्ड व कक्षा', sub: `${selectedBoard} • Class ${selectedClass}` },
            { num: 2 as const, title: 'Step 2: विषय व रिसोर्स हब', sub: selectedSubject === 'ALL' ? 'सभी विषय' : selectedSubject },
            { num: 3 as const, title: 'Step 3: इंटरएक्टिव टूल्स', sub: activeToolMode === 'mcq-test' ? 'OMR सिंगल टेस्ट' : activeToolMode === 'topper-notes' ? 'टॉपर नोट्स' : 'सब्जेक्टिव Q&A' }
          ].map(s => (
            <button
              key={s.num}
              onClick={() => setStep(s.num)}
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

      {/* STEP 1: BOARD & CLASS SELECTION UI */}
      {step === 1 && (
        <div className="bg-[#091122] border-2 border-amber-500/30 rounded-3xl p-5 sm:p-7 space-y-6 shadow-2xl animate-fade-in">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
              चरण 1 / 3 (STEP 1: BOARD &amp; CLASS SELECTION)
            </span>
            <h2 className="text-lg sm:text-xl font-black text-white">
              अपना परीक्षा बोर्ड और कक्षा (10वीं / 12वीं) चुनें
            </h2>
            <p className="text-xs text-slate-400">
              बोर्ड और कक्षा चुनने पर आपके आधिकारिक नवीनतम सिलेबस (2026 पैटर्न) के अनुसार अध्याय और टेस्ट लोड होंगे।
            </p>
          </div>

          {/* Class Selection Cards */}
          <div className="space-y-2">
            <label className="text-xs font-black text-cyan-300 uppercase tracking-wider block">
              1. अपनी कक्षा चुनें (Select Class):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: '10th' as const, title: 'कक्षा 10वीं (Class 10th Matric)', desc: 'विज्ञान, गणित, सामाजिक विज्ञान, हिन्दी, अंग्रेजी व संस्कृत (50% OMR + 50% Subjective)', badge: 'MATRIC 2026' },
                { id: '12th' as const, title: 'कक्षा 12वीं (Class 12th Inter)', desc: 'भौतिकी (Physics), रसायन (Chemistry), जीव विज्ञान (Biology), गणित व आर्ट्स', badge: 'INTERMEDIATE 2026' }
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

          {/* Board Selection Grid */}
          <div className="space-y-2">
            <label className="text-xs font-black text-cyan-300 uppercase tracking-wider block">
              2. अपना राज्य / केंद्रीय बोर्ड चुनें (Select Board):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'BSEB' as const, name: 'बिहार बोर्ड (BSEB Patna)', pattern: '50% वस्तुनिष्ठ (OMR) + भारती भवन व NCERT आधारित' },
                { id: 'UPMSP' as const, name: 'यूपी बोर्ड (UPMSP Prayagraj)', pattern: 'OMR MCQs + विस्तृत उत्तरीय NCERT पैटर्न' },
                { id: 'CBSE' as const, name: 'सीबीएसई बोर्ड (CBSE Delhi)', pattern: 'Competency Based MCQs + NCERT Exemplar' },
                { id: 'ALL' as const, name: 'सभी बोर्ड संयुक्त (All State Boards)', pattern: 'BSEB, UP, JAC, MP एवं RBSE के संयुक्त महत्वपूर्ण प्रश्न' }
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
              <span>अगला चरण: विषय एवं रिसोर्स हब खोलें (Step 2)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SUBJECT & RESOURCE HUB */}
      {step === 2 && (
        <div className="bg-[#091122] border-2 border-cyan-500/30 rounded-3xl p-5 sm:p-7 space-y-6 shadow-2xl animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">
                चरण 2 / 3 (STEP 2: SUBJECT &amp; RESOURCE HUB)
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white">
                विषय (Subject) और अध्ययन टूल चुनें ({selectedBoard} • {selectedClass})
              </h2>
            </div>
            <button
              onClick={() => setStep(1)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>बोर्ड बदलें</span>
            </button>
          </div>

          {/* Subject Selection Pills */}
          <div className="space-y-2">
            <label className="text-xs font-black text-amber-300 uppercase tracking-wider block">
              1. विषय चुनें (Select Subject):
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
                📚 सभी विषय (All Subjects Mix)
              </button>
              {subjectsForClass.map(sub => (
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
                  {sub}
                </button>
              ))}
            </div>
          </div>

          {/* 3 Interactive Resource Cards to launch Step 3 */}
          <div className="space-y-2">
            <label className="text-xs font-black text-amber-300 uppercase tracking-wider block">
              2. इंटरएक्टिव स्टडी टूल खोलें (Select Resource to Launch Step 3):
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* Tool 1: Single Test Box */}
              <div
                onClick={() => {
                  setActiveToolMode('mcq-test');
                  setStep(3);
                }}
                className="p-5 rounded-2xl bg-slate-950 border-2 border-amber-500/40 hover:border-amber-400 cursor-pointer transition-all flex flex-col justify-between gap-4 group shadow-lg"
              >
                <div className="space-y-2">
                  <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl">
                    🎯
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-white group-hover:text-amber-300">
                    चैप्टर-वाइज OMR सिंगल टेस्ट बॉक्स
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    एक-एक प्रश्न का लाइव OMR अभ्यास, तुरंत सही उत्तर, विस्तृत व्याख्या और ऑडियो स्पीकर।
                  </p>
                </div>
                <div className="text-xs font-black text-amber-400 flex items-center justify-between pt-2 border-t border-slate-900">
                  <span>टेस्ट शुरू करें ({activeList.length} प्रश्न)</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Tool 2: Topper Chapter Notes & Formulas */}
              <div
                onClick={() => {
                  setActiveToolMode('topper-notes');
                  setStep(3);
                }}
                className="p-5 rounded-2xl bg-slate-950 border-2 border-cyan-500/40 hover:border-cyan-400 cursor-pointer transition-all flex flex-col justify-between gap-4 group shadow-lg"
              >
                <div className="space-y-2">
                  <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-2xl">
                    📖
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-white group-hover:text-cyan-300">
                    टॉपर शॉर्ट नोट्स व फॉर्मूला शीट
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    परीक्षा से पहले त्वरित रिवीजन के लिए महत्वपूर्ण सूत्र, नियम और वन-लाइनर सारांश।
                  </p>
                </div>
                <div className="text-xs font-black text-cyan-400 flex items-center justify-between pt-2 border-t border-slate-900">
                  <span>नोट्स व सूत्र खोलें</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Tool 3: Subjective Long/Short Q&A */}
              <div
                onClick={() => {
                  setActiveToolMode('subjective-qa');
                  setStep(3);
                }}
                className="p-5 rounded-2xl bg-slate-950 border-2 border-emerald-500/40 hover:border-emerald-400 cursor-pointer transition-all flex flex-col justify-between gap-4 group shadow-lg"
              >
                <div className="space-y-2">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-2xl">
                    ✍️
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-white group-hover:text-emerald-300">
                    लघु व दीर्घ उत्तरीय प्रश्न (Subjective)
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    बोर्ड परीक्षा में बार-बार पूछे जाने वाले 2 अंक और 5 अंक के प्रश्नों के आदर्श टॉपर उत्तर।
                  </p>
                </div>
                <div className="text-xs font-black text-emerald-400 flex items-center justify-between pt-2 border-t border-slate-900">
                  <span>मॉडल उत्तर देखें</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: INTERACTIVE TOOLS (SINGLE TEST BOX / TOPPER NOTES / SUBJECTIVE Q&A) */}
      {step === 3 && (
        <div className="space-y-4 animate-fade-in">
          {/* Mode Switcher Bar inside Step 3 */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-[#091122] p-3 rounded-2xl border border-slate-800">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveToolMode('mcq-test')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  activeToolMode === 'mcq-test'
                    ? 'bg-amber-500 text-slate-950 font-black shadow'
                    : 'bg-slate-950 text-slate-300 border border-slate-800'
                }`}
              >
                🎯 सिंगल टेस्ट बॉक्स (MCQ)
              </button>
              <button
                onClick={() => setActiveToolMode('topper-notes')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  activeToolMode === 'topper-notes'
                    ? 'bg-cyan-500 text-slate-950 font-black shadow'
                    : 'bg-slate-950 text-slate-300 border border-slate-800'
                }`}
              >
                📖 टॉपर नोट्स व फॉर्मूला
              </button>
              <button
                onClick={() => setActiveToolMode('subjective-qa')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  activeToolMode === 'subjective-qa'
                    ? 'bg-emerald-500 text-slate-950 font-black shadow'
                    : 'bg-slate-950 text-slate-300 border border-slate-800'
                }`}
              >
                ✍️ लघु/दीर्घ उत्तरीय प्रश्न
              </button>
            </div>

            <button
              onClick={() => setStep(2)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-cyan-300 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>विषय बदलें (Step 2)</span>
            </button>
          </div>

          {/* TOOL A: INTERACTIVE SINGLE TEST BOX */}
          {activeToolMode === 'mcq-test' && (
            <div className="bg-[#091122] border-2 border-amber-500/30 rounded-3xl p-5 sm:p-7 space-y-5 shadow-2xl relative">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black">
                    प्रश्न {(currentIndex % activeList.length) + 1} / {activeList.length}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
                    {currentQ.subject} • {currentQ.chapter}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[11px] font-bold">
                    🔥 {currentQ.yearTag}
                  </span>
                  <button
                    onClick={() => speakText(`${currentQ.question} विकल्प हैं: ${currentQ.options.join(', ')}`)}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-400 cursor-pointer"
                    title="प्रश्न सुनें"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="py-2">
                <h2 className="text-base sm:text-xl font-black text-white leading-relaxed">
                  {currentQ.question}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentQ.correctAnswer;
                  const showResult = selectedOption !== null;

                  let btnStyle = 'bg-slate-950 border-slate-800 text-slate-200 hover:border-amber-500/50 hover:bg-slate-900';
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
                        <span className="text-xs sm:text-sm">{opt}</span>
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
                      <span>बोर्ड टॉपर व्याख्या (Detailed Solution):</span>
                    </span>
                    <button
                      onClick={() => speakText(currentQ.explanation)}
                      className="text-[11px] font-bold text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>व्याख्या सुनें</span>
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {currentQ.explanation}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <div className="text-xs text-slate-400">
                  {selectedOption === null ? 'उत्तर जांचने के लिए किसी एक विकल्प (A, B, C, D) पर क्लिक करें' : 'उत्तर दर्ज कर लिया गया है!'}
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
                    title="पिछला प्रश्न पर जाएं"
                  >
                    <span>⬅️ पिछला (Previous)</span>
                  </button>
                  <button
                    onClick={handleNextQuestion}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-lg cursor-pointer transition-all"
                  >
                    <span>अगला प्रश्न (Next)</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TOOL B: TOPPER SHORT NOTES & FORMULAS */}
          {activeToolMode === 'topper-notes' && (
            <div className="bg-[#091122] border-2 border-cyan-500/30 rounded-3xl p-5 sm:p-7 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    📖 बोर्ड टॉपर रिवीजन नोट्स एवं सूत्र ({selectedSubject === 'ALL' ? 'विज्ञान एवं गणित' : selectedSubject})
                  </h3>
                  <p className="text-xs text-slate-400">सीधे बोर्ड परीक्षा में पूछे जाने वाले महत्वपूर्ण बिंदु</p>
                </div>
                <button
                  onClick={() => speakText(activeNotes.summaryPoints.join(' '))}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>नोट्स सुनें</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {activeNotes.summaryPoints.map((pt, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-850 flex items-start gap-3 text-xs sm:text-sm text-slate-200">
                    <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 font-black flex items-center justify-center shrink-0 text-xs">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{pt}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2.5 pt-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-400">
                  ⚡ महत्वपूर्ण बोर्ड सूत्र (Important Formulas):
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeNotes.formulas.map((f, i) => (
                    <div key={i} className="p-3.5 rounded-2xl bg-slate-950 border border-amber-500/30 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300">{f.title}</span>
                      <span className="text-xs sm:text-sm font-mono font-black text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg">
                        {f.exp}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TOOL C: SUBJECTIVE LONG/SHORT Q&A */}
          {activeToolMode === 'subjective-qa' && (
            <div className="bg-[#091122] border-2 border-emerald-500/30 rounded-3xl p-5 sm:p-7 space-y-4 shadow-2xl">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-base sm:text-lg font-black text-white">
                  ✍️ लघु एवं दीर्घ उत्तरीय प्रश्न बैंक (Subjective Model Answers)
                </h3>
                <p className="text-xs text-slate-400">
                  पहले स्वयं उत्तर सोचें, फिर &quot;आदर्श उत्तर देखें&quot; पर क्लिक करके बोर्ड मार्किंग स्कीम से मिलान करें।
                </p>
              </div>

              <div className="space-y-4">
                {activeNotes.subjectiveQA.map((item, idx) => (
                  <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="text-xs sm:text-sm font-black text-white leading-relaxed">{item.q}</h4>
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-[10px] font-black shrink-0">
                        {item.marks}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setRevealedSubjective(prev => ({ ...prev, [idx]: !prev[idx] }))
                        }
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer transition-all"
                      >
                        {revealedSubjective[idx] ? 'उत्तर छुपाएं' : 'आदर्श टॉपर उत्तर देखें'}
                      </button>
                      <button
                        onClick={() => speakText(`${item.q} ${item.a}`)}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>सुनें</span>
                      </button>
                    </div>

                    {revealedSubjective[idx] && (
                      <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs sm:text-sm text-slate-200 leading-relaxed animate-fade-in">
                        {item.a}
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
