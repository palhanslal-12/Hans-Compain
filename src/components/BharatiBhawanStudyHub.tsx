import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  ArrowLeft,
  ExternalLink,
  Calculator,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  FileText,
  Clock,
  Search,
  BookMarked,
  Share2,
  Layers,
  ChevronRight,
  TrendingUp,
  RefreshCw,
  Info,
  Check,
  Zap,
  PlayCircle,
  Brain,
  Calendar,
  MessageSquare,
  Award,
  Target
} from 'lucide-react';

interface BharatiBhawanStudyHubProps {
  onBack: () => void;
  onOpenTest?: (subject: string, chapter: string) => void;
  language?: 'english' | 'hindi';
  showToast?: (msg: string, type?: 'success' | 'error' | 'info' | 'warn') => void;
  onOpenMistakeNotebook?: () => void;
  onOpenDailyGoals?: () => void;
  onOpenStudyPlan?: () => void;
  onOpenChatWithDoubt?: (doubt: string) => void;
}

interface ChapterData {
  id: string;
  number: number;
  titleHi: string;
  titleEn: string;
  marksWeightage: number; // Board exam weightage in marks
  difficulty: 'Easy' | 'Medium' | 'High';
  estHours: number;
  summaryHi: string;
  keyFormulas: string[];
  solvedExamples: {
    question: string;
    stepByStepSolution: string[];
    boardYear: string;
  }[];
  practiceQuestions: {
    q: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

interface SubjectData {
  id: string;
  nameHi: string;
  nameEn: string;
  bookTitle: string;
  author: string;
  totalMarks: number;
  chapters: ChapterData[];
}

const CLASS_10_SUBJECTS: SubjectData[] = [
  {
    id: 'maths',
    nameHi: 'गणित (Mathematics)',
    nameEn: 'Mathematics',
    bookTitle: 'प्राथमिक गणित (भारती भवन)',
    author: 'प्रो. दास गुप्ता, प्रसाद एवं के. सी. सिन्हा पद्धति',
    totalMarks: 100,
    chapters: [
      {
        id: 'real-numbers',
        number: 1,
        titleHi: 'वास्तविक संख्याएं (Real Numbers)',
        titleEn: 'Real Numbers',
        marksWeightage: 10,
        difficulty: 'Easy',
        estHours: 4,
        summaryHi: 'यूक्लिड विभाजन प्रमेयिका (a = bq + r, जहाँ 0 ≤ r < b), अंकगणित की आधारभूत प्रमेय, अपरिमेय संख्याओं का सत्यापन (जैसे सिद्ध करें कि √2, √3, 5-√3 एक अपरिमेय संख्या है), तथा परिमेय संख्याओं के सांत/असांत आवर्ती दशमलव प्रसार (हर के अभाज्य गुणनखंड 2^n * 5^m के रूप में)।',
        keyFormulas: [
          'a = bq + r, 0 ≤ r < b',
          'HCF(a, b) × LCM(a, b) = a × b',
          'सांत दशमलव: यदि हर = 2^n × 5^m (जहाँ n, m ऋणेतर पूर्णांक हैं)'
        ],
        solvedExamples: [
          {
            question: 'सिद्ध करें कि √5 एक अपरिमेय संख्या है (भारती भवन Class 10 Exemplar)',
            stepByStepSolution: [
              'मान लें कि √5 एक परिमेय संख्या है, अतः √5 = p/q जहाँ p और q सह-अभाज्य पूर्णांक हैं तथा q ≠ 0।',
              'दोनों पक्षों का वर्ग करने पर: 5 = p² / q² => p² = 5q²',
              'यहाँ 5, p² को विभाजित करता है, अतः प्रमेय के अनुसार 5, p को भी विभाजित करेगा।',
              'मान लें p = 5k। तब p² = 25k² => 5q² = 25k² => q² = 5k²',
              'अतः 5, q² को विभाजित करता है, इसलिए 5, q को भी विभाजित करेगा।',
              'इससे सिद्ध हुआ कि 5, p और q दोनों का उभयनिष्ठ गुणनखंड है, जो हमारी प्रारम्भिक मान्यता (p और q सह-अभाज्य हैं) का विरोधाभास है।',
              'निष्कर्ष: √5 एक अपरिमेय संख्या है। इति सिद्धम्।'
            ],
            boardYear: 'BSEB 2024 & CBSE 2023 (Repeated 5 Times)'
          },
          {
            question: 'यूक्लिड विभाजन एल्गोरिद्म का प्रयोग कर 135 और 225 का HCF (म.स.) ज्ञात कीजिए।',
            stepByStepSolution: [
              'चरण 1: 225 > 135, अतः 225 = 135 × 1 + 90 (शेषफल r = 90 ≠ 0)',
              'चरण 2: भाजक 135 व शेषफल 90 के लिए: 135 = 90 × 1 + 45 (शेषफल r = 45 ≠ 0)',
              'चरण 3: भाजक 90 व शेषफल 45 के लिए: 90 = 45 × 2 + 0 (शेषफल r = 0)',
              'चूँकि यहाँ शेषफल 0 प्राप्त हो गया है, अतः अंतिम भाजक 45 ही अभीष्ट HCF है।',
              'उत्तर: HCF(135, 225) = 45'
            ],
            boardYear: 'Board Model Set 2025'
          }
        ],
        practiceQuestions: [
          {
            q: 'दो संख्याओं का गुणनफल 2160 है और उनका HCF 12 है, तो उनका LCM क्या होगा?',
            options: ['180', '160', '120', '240'],
            correctIndex: 0,
            explanation: 'सूत्र: HCF × LCM = पहली संख्या × दूसरी संख्या => LCM = 2160 / 12 = 180।'
          },
          {
            q: 'निम्न में कौन सी परिमेय संख्या का दशमलव प्रसार सांत (Terminating) है?',
            options: ['17/8', '3/7', '7/210', '13/125'],
            correctIndex: 0,
            explanation: '17/8 में हर 8 = 2³ है, जो 2^n × 5^m के रूप में है, अतः सांत होगा।'
          }
        ]
      },
      {
        id: 'polynomials',
        number: 2,
        titleHi: 'बहुपद (Polynomials)',
        titleEn: 'Polynomials',
        marksWeightage: 8,
        difficulty: 'Easy',
        estHours: 3,
        summaryHi: 'द्विघात बहुपद ax² + bx + c के शून्यकों (α, β) और गुणांकों के बीच संबंध। शून्यकों का योग α + β = -b/a तथा शून्यकों का गुणनफल αβ = c/a। त्रिघात बहुपद के शून्यक और विभाजन एल्गोरिद्म।',
        keyFormulas: [
          'द्विघात बहुपद = k[x² - (α + β)x + αβ]',
          'α + β = -b/a',
          'αβ = c/a',
          'त्रिघात: α + β + γ = -b/a, αβ + βγ + γα = c/a, αβγ = -d/a'
        ],
        solvedExamples: [
          {
            question: 'द्विघात बहुपद x² + 7x + 10 के शून्यक ज्ञात कीजिए और शून्यकों तथा गुणांकों के बीच संबंध की सत्यता की जाँच कीजिए।',
            stepByStepSolution: [
              'x² + 7x + 10 = x² + 5x + 2x + 10 = x(x + 5) + 2(x + 5) = (x + 5)(x + 2)',
              'शून्यक प्राप्त करने हेतु (x + 5)(x + 2) = 0 => x = -5 अथवा x = -2',
              'अतः शून्यक α = -2, β = -5 हैं।',
              'सत्यता जाँच: α + β = -2 + (-5) = -7 = -(x का गुणांक) / (x² का गुणांक) = -7/1 = -7 (सत्य)',
              'αβ = (-2) × (-5) = 10 = अचर पद / (x² का गुणांक) = 10/1 = 10 (सत्य)'
            ],
            boardYear: 'BSEB 2023'
          }
        ],
        practiceQuestions: [
          {
            q: 'यदि द्विघात बहुपद x² - 3x + 2 के शून्यक α और β हों, तो 1/α + 1/β का मान होगा:',
            options: ['3/2', '2/3', '-3/2', '1/2'],
            correctIndex: 0,
            explanation: '1/α + 1/β = (α + β) / αβ = (-(-3)/1) / (2/1) = 3/2।'
          }
        ]
      },
      {
        id: 'trigonometry',
        number: 3,
        titleHi: 'त्रिकोणमिति एवं ऊँचाई-दूरी (Trigonometry)',
        titleEn: 'Trigonometry & Applications',
        marksWeightage: 20,
        difficulty: 'High',
        estHours: 8,
        summaryHi: 'समकोण त्रिभुज में त्रिकोणमितीय अनुपात (sin, cos, tan, cot, sec, cosec), विशिष्ट कोणों (0°, 30°, 45°, 60°, 90°) के मान, त्रिकोणमितीय सर्वसमिकाएं (sin²θ + cos²θ = 1, 1 + tan²θ = sec²θ, 1 + cot²θ = cosec²θ) तथा ऊँचाई एवं दूरी के उन्नयन व अवनमन कोण आधारित 5-अंकीय प्रश्न।',
        keyFormulas: [
          'sin²θ + cos²θ = 1',
          'sec²θ - tan²θ = 1',
          'cosec²θ - cot²θ = 1',
          'tanθ = sinθ / cosθ, cotθ = cosθ / sinθ',
          'sin 30° = 1/2, sin 45° = 1/√2, sin 60° = √3/2'
        ],
        solvedExamples: [
          {
            question: 'सिद्ध करें: (sin θ - 2 sin³ θ) / (2 cos³ θ - cos θ) = tan θ (भारती भवन 5-अंक प्रश्न)',
            stepByStepSolution: [
              'LHS = (sin θ (1 - 2 sin² θ)) / (cos θ (2 cos² θ - 1))',
              'हम जानते हैं कि 1 = sin² θ + cos² θ',
              'अंश में: 1 - 2 sin² θ = sin² θ + cos² θ - 2 sin² θ = cos² θ - sin² θ',
              'हर में: 2 cos² θ - (sin² θ + cos² θ) = cos² θ - sin² θ',
              'LHS = (sin θ / cos θ) × [(cos² θ - sin² θ) / (cos² θ - sin² θ)]',
              '= tan θ × 1 = tan θ = RHS (इति सिद्धम्)'
            ],
            boardYear: 'Board Topper Repeated Question'
          }
        ],
        practiceQuestions: [
          {
            q: '9 sec² A - 9 tan² A का मान क्या होगा?',
            options: ['9', '1', '0', '8'],
            correctIndex: 0,
            explanation: '9(sec² A - tan² A) = 9 × 1 = 9।'
          }
        ]
      },
      {
        id: 'quadratic',
        number: 4,
        titleHi: 'द्विघात समीकरण (Quadratic Equations)',
        titleEn: 'Quadratic Equations',
        marksWeightage: 10,
        difficulty: 'Medium',
        estHours: 5,
        summaryHi: 'मानक रूप ax² + bx + c = 0। गुणनखंडन विधि, पूर्ण वर्ग बनाकर तथा श्रीधराचार्य द्विघाती सूत्र x = [-b ± √(b² - 4ac)] / (2a)। विविक्तकर D = b² - 4ac की प्रकृति (D > 0 वास्तविक व भिन्न, D = 0 वास्तविक व समान, D < 0 काल्पनिक)।',
        keyFormulas: [
          'D = b² - 4ac',
          'x = (-b ± √D) / (2a)',
          'D > 0 => दो भिन्न वास्तविक मूल',
          'D = 0 => दो बराबर वास्तविक मूल'
        ],
        solvedExamples: [
          {
            question: 'समीकरण 2x² - 4x + 3 = 0 का विविक्तकर ज्ञात कीजिए और मूलों की प्रकृति बताइए।',
            stepByStepSolution: [
              'यहाँ a = 2, b = -4, c = 3',
              'विविक्तकर D = b² - 4ac = (-4)² - 4(2)(3) = 16 - 24 = -8',
              'चूँकि D < 0 (ऋणात्मक है), अतः दिए गए समीकरण के कोई वास्तविक मूल नहीं होंगे (मूल काल्पनिक होंगे)।'
            ],
            boardYear: 'BSEB 2024'
          }
        ],
        practiceQuestions: [
          {
            q: 'यदि द्विघात समीकरण 2x² + kx + 3 = 0 के दोनों मूल बराबर हों, तो k का मान होगा:',
            options: ['±2√6', '±4', '±6', '±√6'],
            correctIndex: 0,
            explanation: 'बराबर मूल हेतु D = 0 => k² - 4(2)(3) = 0 => k² = 24 => k = ±√24 = ±2√6।'
          }
        ]
      },
      {
        id: 'ap',
        number: 5,
        titleHi: 'समानांतर श्रेढ़ी (Arithmetic Progression)',
        titleEn: 'Arithmetic Progression',
        marksWeightage: 10,
        difficulty: 'Medium',
        estHours: 4,
        summaryHi: 'प्रथम पद a, सार्व अंतर d = a₂ - a₁। nवाँ पद an = a + (n - 1)d। प्रथम n पदों का योगफल Sn = n/2 [2a + (n - 1)d] अथवा Sn = n/2 [a + l]। व्यावहारिक दैनिक जीवन आधारित प्रश्न।',
        keyFormulas: [
          'an = a + (n - 1)d',
          'Sn = n/2 × [2a + (n - 1)d]',
          'Sn = n/2 × (a + l)'
        ],
        solvedExamples: [
          {
            question: 'A.P.: 2, 7, 12, ... का 10वाँ पद ज्ञात कीजिए।',
            stepByStepSolution: [
              'प्रथम पद a = 2, सार्व अंतर d = 7 - 2 = 5, n = 10',
              'सूत्र: an = a + (n - 1)d',
              'a₁₀ = 2 + (10 - 1) × 5 = 2 + 9 × 5 = 2 + 45 = 47',
              'उत्तर: 10वाँ पद 47 है।'
            ],
            boardYear: 'Model Set Question'
          }
        ],
        practiceQuestions: [
          {
            q: 'प्रथम 100 प्राकृतिक संख्याओं का योग क्या होगा?',
            options: ['5050', '5000', '5100', '5250'],
            correctIndex: 0,
            explanation: 'Sn = n(n + 1)/2 = 100 × 101 / 2 = 50 × 101 = 5050।'
          }
        ]
      }
    ]
  },
  {
    id: 'physics',
    nameHi: 'भौतिकी (Physics)',
    nameEn: 'Physics',
    bookTitle: 'प्राथमिक भौतिकी (भारती भवन Class 10)',
    author: 'भारती भवन पब्लिशर्स',
    totalMarks: 100,
    chapters: [
      {
        id: 'reflection-refraction',
        number: 1,
        titleHi: 'प्रकाश का परावर्तन एवं अपवर्तन',
        titleEn: 'Reflection & Refraction of Light',
        marksWeightage: 15,
        difficulty: 'Medium',
        estHours: 6,
        summaryHi: 'गोलीय दर्पण (अवतल व उत्तल), दर्पण सूत्र (1/f = 1/v + 1/u), आवर्धन m = -v/u, अपवर्तन के नियम (स्नेल का नियम sin i / sin r = μ), लेंस सूत्र (1/f = 1/v - 1/u), लेंस की क्षमता P = 1/f (मीटर में, मात्रक डायोप्टर D)।',
        keyFormulas: [
          'दर्पण सूत्र: 1/f = 1/v + 1/u',
          'लेंस सूत्र: 1/f = 1/v - 1/u',
          'आवर्धन (दर्पण): m = -v/u = h\'/h',
          'आवर्धन (लेंस): m = v/u = h\'/h',
          'क्षमता: P = 1/f(m) (डायोप्टर)'
        ],
        solvedExamples: [
          {
            question: 'एक उत्तल दर्पण की फोकस दूरी ज्ञात कीजिए जिसकी वक्रता त्रिज्या 32 cm है।',
            stepByStepSolution: [
              'वक्रता त्रिज्या R = +32 cm',
              'सूत्र: f = R / 2',
              'f = 32 / 2 = +16 cm (उत्तल दर्पण की फोकस दूरी धनात्मक होती है)।'
            ],
            boardYear: 'Board 2024'
          }
        ],
        practiceQuestions: [
          {
            q: 'दाढ़ी बनाने (हजामत) में कौन सा दर्पण सर्वाधिक उपयुक्त होता है?',
            options: ['अवतल दर्पण', 'उत्तल दर्पण', 'समतल दर्पण', 'इनमें से कोई नहीं'],
            correctIndex: 0,
            explanation: 'अवतल दर्पण वस्तु का सीधा और बड़ा (आवर्धित) प्रतिबिम्ब बनाता है जब वस्तु ध्रुव और फोकस के मध्य हो।'
          }
        ]
      },
      {
        id: 'electricity',
        number: 2,
        titleHi: 'विद्युत एवं विद्युत धारा (Electricity)',
        titleEn: 'Electricity',
        marksWeightage: 12,
        difficulty: 'High',
        estHours: 5,
        summaryHi: 'ओम का नियम (V = IR), प्रतिरोधकता, श्रेणीक्रम संयोजन (R = R₁ + R₂ + R₃), पार्श्वक्रम संयोजन (1/R = 1/R₁ + 1/R₂ + 1/R₃), जूल का तापन नियम (H = I²Rt), विद्युत शक्ति (P = VI = I²R = V²/R)।',
        keyFormulas: [
          'V = I × R',
          'R = ρ × (l / A)',
          'H = I² × R × t (जूल का तापन नियम)',
          'P = V × I = I²R = V² / R',
          '1 kWh = 3.6 × 10⁶ J (1 यूनिट बिजली)'
        ],
        solvedExamples: [
          {
            question: 'यदि किसी विद्युत बल्ब के तंतु का प्रतिरोध 1200 Ω है, तो यह बल्ब 220 V स्रोत से कितनी विद्युत धारा लेगा?',
            stepByStepSolution: [
              'दिया है: विभवांतर V = 220 V, प्रतिरोध R = 1200 Ω',
              'ओम के नियमानुसार: I = V / R',
              'I = 220 / 1200 = 22 / 120 = 0.18 A',
              'उत्तर: विद्युत धारा = 0.18 ऐम्पियर।'
            ],
            boardYear: 'Board 2023'
          }
        ],
        practiceQuestions: [
          {
            q: 'विद्युत आवेश का SI मात्रक क्या होता है?',
            options: ['कूलॉम (C)', 'ऐम्पियर (A)', 'वोल्ट (V)', 'ओम (Ω)'],
            correctIndex: 0,
            explanation: 'आवेश का SI मात्रक कूलॉम (Coulomb) होता है। धारा का ऐम्पियर होता है।'
          }
        ]
      }
    ]
  },
  {
    id: 'chemistry',
    nameHi: 'रसायन विज्ञान (Chemistry)',
    nameEn: 'Chemistry',
    bookTitle: 'प्राथमिक रसायन (भारती भवन Class 10)',
    author: 'भारती भवन पब्लिशर्स',
    totalMarks: 100,
    chapters: [
      {
        id: 'chemical-reactions',
        number: 1,
        titleHi: 'रासायनिक अभिक्रियाएं एवं समीकरण',
        titleEn: 'Chemical Reactions & Equations',
        marksWeightage: 10,
        difficulty: 'Easy',
        estHours: 4,
        summaryHi: 'संयोजन, वियोजन (अपघटन), विस्थापन, द्विविस्थापन, उपचयन (ऑक्सीकरण) एवं अपचयन (रेडॉक्स अभिक्रिया)। संक्षारण तथा विकृतगंधिता। द्रव्यमान संरक्षण का नियम एवं समीकरण संतुलन।',
        keyFormulas: [
          'संयोजन: A + B -> AB',
          'अपघटन: AB -> A + B',
          'विस्थापन: Fe + CuSO₄ -> FeSO₄ + Cu',
          'रेडॉक्स: ZnO + C -> Zn + CO'
        ],
        solvedExamples: [
          {
            question: 'लोहे की कील को कॉपर सल्फेट के विलयन में डुबोने पर विलयन का रंग क्यों बदल जाता है?',
            stepByStepSolution: [
              'लोहा (Fe) कॉपर (Cu) की अपेक्षा अधिक सक्रिय (अभिक्रियाशील) धातु है।',
              'जब लोहे की कील को नीले कॉपर सल्फेट (CuSO₄) के विलयन में डाला जाता है, तो लोहा कॉपर को विस्थापित कर फेरस सल्फेट (FeSO₄) बनाता है:',
              'Fe (s) + CuSO₄ (aq, नीला) -> FeSO₄ (aq, हल्का हरा) + Cu (s, भूरा)',
              'अतः फेरस सल्फेट बनने के कारण विलयन का नीला रंग गायब होकर हल्का हरा हो जाता है।'
            ],
            boardYear: 'Repeated Board Favourite'
          }
        ],
        practiceQuestions: [
          {
            q: 'श्वसन किस प्रकार की रासायनिक अभिक्रिया है?',
            options: ['ऊष्माक्षेपी (Exothermic)', 'ऊष्माशोषी (Endothermic)', 'संयोजन', 'अपघटन'],
            correctIndex: 0,
            explanation: 'श्वसन क्रिया में ग्लूकोस के ऑक्सीकरण से ऊर्जा (ऊष्मा) मुक्त होती है, अतः यह ऊष्माक्षेपी अभिक्रिया है।'
          }
        ]
      },
      {
        id: 'acids-bases-salts',
        number: 2,
        titleHi: 'अम्ल, क्षारक एवं लवण (Acids, Bases & Salts)',
        titleEn: 'Acids, Bases & Salts',
        marksWeightage: 12,
        difficulty: 'Medium',
        estHours: 4,
        summaryHi: 'pH पैमाना (0 से 14), दैनिक जीवन में pH का महत्व, विरंजक चूर्ण (CaOCl₂), बेकिंग सोडा (NaHCO₃), धोने का सोडा (Na₂CO₃·10H₂O), तथा प्लास्टर ऑफ पेरिस (CaSO₄·1/2H₂O) के निर्माण विधि, समीकरण एवं उपयोग।',
        keyFormulas: [
          'pH = -log[H⁺]',
          'विरंजक चूर्ण: Ca(OH)₂ + Cl₂ -> CaOCl₂ + H₂O',
          'प्लास्टर ऑफ पेरिस: CaSO₄·2H₂O (जिप्सम 373K) -> CaSO₄·1/2H₂O + 1½H₂O'
        ],
        solvedExamples: [
          {
            question: 'बेकिंग सोडा (खाने का सोडा) का रासायनिक नाम, सूत्र एवं दो प्रमुख उपयोग लिखिए।',
            stepByStepSolution: [
              'रासायनिक नाम: सोडियम हाइड्रोजनकार्बोनेट (या सोडियम बाइकार्बोनेट)',
              'रासायनिक सूत्र: NaHCO₃',
              'उपयोग 1: बेकिंग पाउडर बनाने में, जो केक या ब्रेड को स्पंजी व मुलायम बनाता है।',
              'उपयोग 2: पेट की अम्लता (एसिडिटी) दूर करने के लिए ऐन्टासिड के रूप में।'
            ],
            boardYear: 'BSEB & CBSE 2024'
          }
        ],
        practiceQuestions: [
          {
            q: 'शुद्ध जल का pH मान कितना होता है?',
            options: ['7', '0', '14', '1'],
            correctIndex: 0,
            explanation: 'शुद्ध जल उदासीन होता है, इसलिए इसका pH मान ठीक 7 होता है।'
          }
        ]
      }
    ]
  },
  {
    id: 'biology',
    nameHi: 'जीव विज्ञान (Biology)',
    nameEn: 'Biology',
    bookTitle: 'प्राथमिक जीव विज्ञान (भारती भवन Class 10)',
    author: 'भारती भवन पब्लिशर्स',
    totalMarks: 100,
    chapters: [
      {
        id: 'life-processes',
        number: 1,
        titleHi: 'जैव प्रक्रम (Life Processes)',
        titleEn: 'Life Processes',
        marksWeightage: 16,
        difficulty: 'Medium',
        estHours: 6,
        summaryHi: 'स्वपोषी एवं विषमपोषी पोषण, प्रकाश संश्लेषण की रासायनिक क्रिया (6CO₂ + 12H₂O -> C₆H₁₂O₆ + 6O₂ + 6H₂O), मानव पाचन तंत्र, वायवीय एवं अवायवीय श्वसन, मानव हृदय की संरचना एवं दोहरा परिसंचरण, वृक्क (किडनी) एवं नेफ्रॉन द्वारा मूत्र निर्माण क्रिया।',
        keyFormulas: [
          'प्रकाश संश्लेषण: 6CO₂ + 12H₂O (सूर्य का प्रकाश + क्लोरोफिल) -> C₆H₁₂O₆ + 6O₂ + 6H₂O',
          'वायवीय श्वसन: ग्लूकोस -> पाइरूवेट -> 6CO₂ + 6H₂O + 38 ATP'
        ],
        solvedExamples: [
          {
            question: 'वायवीय (ऑक्सी) तथा अवायवीय (अनॉक्सी) श्वसन में तीन मुख्य अंतर लिखिए।',
            stepByStepSolution: [
              '1. उपस्थिति: वायवीय श्वसन ऑक्सीजन की उपस्थिति में होता है, जबकि अवायवीय श्वसन ऑक्सीजन की अनुपस्थिति में होता है।',
              '2. स्थल: वायवीय श्वसन माइटोकॉन्ड्रिया में पूर्ण होता है, जबकि अवायवीय श्वसन कोशिकाद्रव्य (Cytoplasm) में होता है।',
              '3. ऊर्जा उत्पादन: वायवीय श्वसन में 38 ATP (अधिक ऊर्जा) बनती है, जबकि अवायवीय श्वसन में मात्र 2 ATP ऊर्जा मुक्त होती है।'
            ],
            boardYear: 'Very Frequent 3-Mark Question'
          }
        ],
        practiceQuestions: [
          {
            q: 'पादप में जाइलम (Xylem) उत्तरदायी होता है:',
            options: ['जल के वहन के लिए', 'भोजन के वहन के लिए', 'अमीनो अम्ल के वहन के लिए', 'ऑक्सीजन के वहन के लिए'],
            correctIndex: 0,
            explanation: 'जाइलम (Xylem) जड़ों से पत्तियों तक जल एवं खनिज लवणों का परिवहन करता है। फ्लोएम भोजन ले जाता है।'
          }
        ]
      }
    ]
  }
];

const CLASS_9_SUBJECTS: SubjectData[] = [
  {
    id: 'maths-9',
    nameHi: 'गणित (Class 9 Maths)',
    nameEn: 'Class 9 Mathematics',
    bookTitle: 'प्राथमिक गणित 9 (भारती भवन)',
    author: 'प्रो. दास गुप्ता, प्रसाद एवं के. सी. सिन्हा पद्धति',
    totalMarks: 100,
    chapters: [
      {
        id: 'number-system-9',
        number: 1,
        titleHi: 'संख्या पद्धति (Number System)',
        titleEn: 'Number System',
        marksWeightage: 12,
        difficulty: 'Easy',
        estHours: 4,
        summaryHi: 'परिमेय और अपरिमेय संख्याएं, संख्या रेखा पर निरूपण, हर का परिमेयकरण (Rationalization of Denominator), और घातांक नियम (Laws of Exponents)।',
        keyFormulas: [
          'x^(a) × x^(b) = x^(a+b)',
          '1 / (√a - b) = (√a + b) / (a - b²)',
          '(a^p)^q = a^(pq)'
        ],
        solvedExamples: [
          {
            question: '1 / (2 + √3) के हर का परिमेयकरण कीजिए।',
            stepByStepSolution: [
              'हर के विपरीत चिह्न (2 - √3) से अंश और हर में गुणा करने पर:',
              '[1 × (2 - √3)] / [(2 + √3)(2 - √3)]',
              '= (2 - √3) / (2² - (√3)²) = (2 - √3) / (4 - 3)',
              '= (2 - √3) / 1 = 2 - √3',
              'उत्तर: 2 - √3'
            ],
            boardYear: 'Class 9 Final Exam'
          }
        ],
        practiceQuestions: [
          {
            q: 'निम्न में से कौन सी संख्या अपरिमेय है?',
            options: ['√2', '√4', '0.25', '2/3'],
            correctIndex: 0,
            explanation: '√2 का दशमलव प्रसार अशांत और अनावर्ती है, इसलिए यह एक अपरिमेय संख्या है।'
          }
        ]
      },
      {
        id: 'polynomials-9',
        number: 2,
        titleHi: 'बहुपद (Polynomials)',
        titleEn: 'Polynomials',
        marksWeightage: 15,
        difficulty: 'Medium',
        estHours: 5,
        summaryHi: 'एक चर वाले बहुपद, बहुपद के शून्यक, शेषफल प्रमेय (Remainder Theorem), गुणनखंड प्रमेय (Factor Theorem), और बीजीय सर्वसमिकाएं।',
        keyFormulas: [
          '(a + b)³ = a³ + b³ + 3ab(a + b)',
          '(a - b)³ = a³ - b³ - 3ab(a - b)',
          'a³ + b³ + c³ - 3abc = (a + b + c)(a² + b² + c² - ab - bc - ca)'
        ],
        solvedExamples: [
          {
            question: 'यदि p(x) = x³ + 3x² + 3x + 1 को (x + 1) से भाग दिया जाए, तो शेषफल ज्ञात कीजिए।',
            stepByStepSolution: [
              'शेषफल प्रमेय के अनुसार, x + 1 = 0 => x = -1 रखने पर प्राप्त मान ही शेषफल होगा।',
              'p(-1) = (-1)³ + 3(-1)² + 3(-1) + 1',
              '= -1 + 3(1) - 3 + 1',
              '= -1 + 3 - 3 + 1 = 0',
              'उत्तर: शेषफल 0 है।'
            ],
            boardYear: 'Class 9 Mid-Term'
          }
        ],
        practiceQuestions: [
          {
            q: 'बहुपद x⁵ - x⁴ + 3 की घात (Degree) क्या होगी?',
            options: ['5', '4', '3', '1'],
            correctIndex: 0,
            explanation: 'बहुपद में चर की अधिकतम घात को बहुपद की घात कहते हैं। यहाँ अधिकतम घात 5 है।'
          }
        ]
      }
    ]
  },
  {
    id: 'physics-9',
    nameHi: 'भौतिकी (Class 9 Physics)',
    nameEn: 'Class 9 Physics',
    bookTitle: 'प्राथमिक भौतिकी 9 (भारती भवन)',
    author: 'भारती भवन पब्लिशर्स',
    totalMarks: 100,
    chapters: [
      {
        id: 'motion-9',
        number: 1,
        titleHi: 'गति (Motion)',
        titleEn: 'Motion',
        marksWeightage: 15,
        difficulty: 'Medium',
        estHours: 4,
        summaryHi: 'दूरी और विस्थापन, चाल और वेग, त्वरण (Acceleration), गति के ग्राफीय प्रदर्शन और गति के तीन प्रमुख समीकरण।',
        keyFormulas: [
          'v = u + at',
          's = ut + ½ at²',
          'v² = u² + 2as',
          'औसत चाल = कुल दूरी / कुल समय'
        ],
        solvedExamples: [
          {
            question: 'एक बस विराम अवस्था से चलना प्रारंभ करती है और 2 मिनट तक 0.1 m/s² के एकसमान त्वरण से चलती है। प्राप्त की गई चाल ज्ञात कीजिए।',
            stepByStepSolution: [
              'प्रारंभिक वेग u = 0 (विराम अवस्था)',
              'त्वरण a = 0.1 m/s²',
              'समय t = 2 मिनट = 2 × 60 = 120 सेकंड',
              'प्रथम गति समीकरण से: v = u + at',
              'v = 0 + (0.1 × 120) = 12 m/s',
              'उत्तर: प्राप्त की गई चाल 12 m/s है।'
            ],
            boardYear: 'Class 9 Board Pattern'
          }
        ],
        practiceQuestions: [
          {
            q: 'वेग में परिवर्तन की दर को क्या कहते हैं?',
            options: ['त्वरण (Acceleration)', 'विस्थापन', 'चाल', 'बल'],
            correctIndex: 0,
            explanation: 'समय के साथ वेग में परिवर्तन की दर को त्वरण (Acceleration) कहते हैं।'
          }
        ]
      }
    ]
  }
];

const CLASS_11_SUBJECTS: SubjectData[] = [
  {
    id: 'maths-11',
    nameHi: 'गणित (Class 11 Maths)',
    nameEn: 'Class 11 Mathematics',
    bookTitle: 'उच्चतर गणित 11 (भारती भवन)',
    author: 'प्रो. दास गुप्ता एवं के. सी. सिन्हा पद्धति',
    totalMarks: 100,
    chapters: [
      {
        id: 'sets-11',
        number: 1,
        titleHi: 'समुच्चय (Sets)',
        titleEn: 'Sets',
        marksWeightage: 15,
        difficulty: 'Easy',
        estHours: 4,
        summaryHi: 'समुच्चय का निरूपण (रोस्टर व समुच्चय निर्माण रूप), रिक्त, परिमित व अपरिमित समुच्चय, उपसमुच्चय, संघ (Union) व सर्वनिष्ठ (Intersection), वेन आरेख (Venn Diagrams)।',
        keyFormulas: [
          'n(A ∪ B) = n(A) + n(B) - n(A ∩ B)',
          'A - B = {x : x ∈ A और x ∉ B}',
          'De Morgan\'s Law: (A ∪ B)\' = A\' ∩ B\''
        ],
        solvedExamples: [
          {
            question: 'यदि A = {1, 2, 3, 4} और B = {3, 4, 5, 6} हो, तो A ∩ B और A ∪ B ज्ञात कीजिए।',
            stepByStepSolution: [
              'A ∩ B (सर्वनिष्ठ) = दोनों समुच्चयों में उभयनिष्ठ अवयव = {3, 4}',
              'A ∪ B (संघ) = सभी अवयव बिना पुनरावृत्ति के = {1, 2, 3, 4, 5, 6}'
            ],
            boardYear: 'Class 11 Academic'
          }
        ],
        practiceQuestions: [
          {
            q: 'एक रिक्त समुच्चय (Null Set) के उपसमुच्चयों की संख्या कितनी होती है?',
            options: ['1', '0', '2', 'अनंत'],
            correctIndex: 0,
            explanation: 'रिक्त समुच्चय ∅ का केवल एक उपसमुच्चय (स्वयं ∅) होता है। सूत्र 2^n के अनुसार 2^0 = 1।'
          }
        ]
      }
    ]
  },
  {
    id: 'physics-11',
    nameHi: 'भौतिकी (Class 11 Physics)',
    nameEn: 'Class 11 Physics',
    bookTitle: 'भौतिकी भाग 1 (भारती भवन Class 11)',
    author: 'भारती भवन पब्लिशर्स',
    totalMarks: 100,
    chapters: [
      {
        id: 'vectors-11',
        number: 1,
        titleHi: 'सदिश विश्लेषण एवं गति (Vectors)',
        titleEn: 'Vector Analysis',
        marksWeightage: 12,
        difficulty: 'Medium',
        estHours: 5,
        summaryHi: 'अदिश व सदिश राशियां, सदिशों का योग (त्रिभुज व समांतर चतुर्भुज नियम), सदिशों का अदिश गुणनफल (Dot Product) व सदिश गुणनफल (Cross Product), प्रक्षेप्य गति (Projectile Motion)।',
        keyFormulas: [
          'R = √(A² + B² + 2AB cosθ)',
          'A · B = AB cosθ',
          '|A × B| = AB sinθ'
        ],
        solvedExamples: [
          {
            question: 'दो सदिशों A = 2i + 3j व B = i - j का अदिश गुणनफल (Dot Product) ज्ञात कीजिए।',
            stepByStepSolution: [
              'A · B = (2i + 3j) · (i - j)',
              '= 2(1) + 3(-1)',
              '= 2 - 3 = -1',
              'उत्तर: A · B = -1'
            ],
            boardYear: 'Class 11 Physics Board Base'
          }
        ],
        practiceQuestions: [
          {
            q: 'निम्न में से कौन सी सदिश (Vector) राशि है?',
            options: ['बल (Force)', 'कार्य (Work)', 'ऊर्जा (Energy)', 'तापमान'],
            correctIndex: 0,
            explanation: 'बल में परिमाण और दिशा दोनों होते हैं, अतः यह सदिश राशि है। अन्य अदिश हैं।'
          }
        ]
      }
    ]
  }
];

const CLASS_12_SUBJECTS: SubjectData[] = [
  {
    id: 'maths-12',
    nameHi: 'गणित (Class 12 Maths)',
    nameEn: 'Class 12 Mathematics',
    bookTitle: 'उच्चतर गणित 12 (भारती भवन)',
    author: 'डॉ. के. सी. सिन्हा एवं प्रो. दास गुप्ता',
    totalMarks: 100,
    chapters: [
      {
        id: 'matrices-12',
        number: 1,
        titleHi: 'आव्यूह एवं सारणिक (Matrices)',
        titleEn: 'Matrices & Determinants',
        marksWeightage: 15,
        difficulty: 'Medium',
        estHours: 5,
        summaryHi: 'आव्यूह की परिभाषा, प्रकार, आव्यूहों का गुणनफल, सहखंडज (Adjoint) व व्युत्क्रम (Inverse) निकालना, सारणिक के गुणधर्म और रैखिक समीकरणों का आव्यूह विधि से हल।',
        keyFormulas: [
          'A × A⁻¹ = I',
          'A⁻¹ = 1/|A| × adj(A)',
          '|AB| = |A| × |B|'
        ],
        solvedExamples: [
          {
            question: 'यदि A एक 2×2 आव्यूह है और |A| = 5 है, तो |3A| का मान ज्ञात कीजिए।',
            stepByStepSolution: [
              'n×n आव्यूह के लिए सूत्र: |kA| = kⁿ |A|',
              'यहाँ n = 2 और k = 3, अतः |3A| = 3² × |A|',
              '|3A| = 9 × 5 = 45',
              'उत्तर: 45'
            ],
            boardYear: 'BSEB 2024 / CBSE 2023'
          }
        ],
        practiceQuestions: [
          {
            q: 'यदि आव्यूह A का व्युत्क्रम (Inverse) संभव हो, तो |A| का मान क्या होना चाहिए?',
            options: ['|A| ≠ 0', '|A| = 0', '|A| = 1', '|A| < 0'],
            correctIndex: 0,
            explanation: 'व्युत्क्रमणीय आव्यूह (Invertible matrix) के लिए सारणिक का मान शून्य नहीं होना चाहिए (|A| ≠ 0)।'
          }
        ]
      }
    ]
  },
  {
    id: 'physics-12',
    nameHi: 'भौतिकी (Class 12 Physics)',
    nameEn: 'Class 12 Physics',
    bookTitle: 'भौतिकी भाग 1 व 2 (कक्षा 12)',
    author: 'भारती भवन पब्लिशर्स',
    totalMarks: 100,
    chapters: [
      {
        id: 'electrostatics-12',
        number: 1,
        titleHi: 'स्थिरवैद्युतिकी (Electrostatics)',
        titleEn: 'Electrostatics',
        marksWeightage: 15,
        difficulty: 'High',
        estHours: 6,
        summaryHi: 'वैद्युत आवेश, कूलाँम का नियम, वैद्युत क्षेत्र की तीव्रता, वैद्युत द्विध्रुव (Dipole), गॉस का नियम तथा संधारित्र (Capacitor) की धारिता।',
        keyFormulas: [
          'F = 1 / (4πε₀) × (q₁q₂ / r²)',
          'E = F / q',
          'V = W / q',
          'C = Q / V'
        ],
        solvedExamples: [
          {
            question: 'वायु में एक-दूसरे से 30 cm दूरी पर रखे दो छोटे आवेशित गोलों पर क्रमशः 2×10⁻⁷ C तथा 3×10⁻⁷ C आवेश हैं। उनके बीच बल ज्ञात कीजिए।',
            stepByStepSolution: [
              'दिया है: q₁ = 2×10⁻⁷ C, q₂ = 3×10⁻⁷ C, r = 30 cm = 0.3 m',
              'कूलाँम नियम से: F = (9×10⁹) × (q₁q₂ / r²)',
              'F = (9×10⁹) × (2×10⁻⁷ × 3×10⁻⁷) / (0.3)²',
              'F = (9×10⁹) × (6×10⁻¹¼) / 0.09',
              'F = (54×10⁻⁵) / 0.09 = 6×10⁻³ N (प्रतिकर्षण बल)',
              'उत्तर: 6×10⁻³ N'
            ],
            boardYear: 'BSEB 2023'
          }
        ],
        practiceQuestions: [
          {
            q: 'विद्युत क्षेत्र की तीव्रता का SI मात्रक क्या होता है?',
            options: ['न्यूटन प्रति कूलॉम (N/C)', 'जूल प्रति कूलॉम', 'वोल्ट मीटर', 'एम्पियर मीटर'],
            correctIndex: 0,
            explanation: 'तीव्रता E = F / q होती है, अतः इसका मात्रक न्यूटन प्रति कूलॉम (N/C) होता है।'
          }
        ]
      }
    ]
  }
];

const SUBJECTS_BY_CLASS: Record<'9' | '10' | '11' | '12', SubjectData[]> = {
  '9': CLASS_9_SUBJECTS,
  '10': CLASS_10_SUBJECTS,
  '11': CLASS_11_SUBJECTS,
  '12': CLASS_12_SUBJECTS
};

export const BharatiBhawanStudyHub: React.FC<BharatiBhawanStudyHubProps> = ({
  onBack,
  onOpenTest,
  language = 'hindi',
  showToast,
  onOpenMistakeNotebook,
  onOpenDailyGoals,
  onOpenStudyPlan,
  onOpenChatWithDoubt
}) => {
  // Navigation State
  const [selectedClass, setSelectedClass] = useState<'9' | '10' | '11' | '12'>('10');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('maths');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('trigonometry');
  const [activeTab, setActiveTab] = useState<'study' | 'syllabus' | 'calculator' | 'quiz' | 'portal'>('study');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Get active subjects based on chosen class
  const activeClassSubjects = useMemo(() => {
    return SUBJECTS_BY_CLASS[selectedClass] || SUBJECTS_BY_CLASS['10'];
  }, [selectedClass]);

  // 🔗 Persistent Linked Chapter Progress State
  const [completedChaptersMap, setCompletedChaptersMap] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('hans-compain-completed-chapters');
      return saved ? JSON.parse(saved) : { 'trigonometry': true, 'real-numbers': true };
    } catch {
      return { 'trigonometry': true, 'real-numbers': true };
    }
  });

  const isChapterCompleted = (chapterId: string) => !!completedChaptersMap[chapterId];

  const handleToggleChapterCompletion = (chapterId: string) => {
    setCompletedChaptersMap((prev) => {
      const updated = { ...prev, [chapterId]: !prev[chapterId] };
      try {
        localStorage.setItem('hans-compain-completed-chapters', JSON.stringify(updated));
      } catch (e) {}
      if (updated[chapterId]) {
        showToast?.('🎉 बहुत खूब! यह अध्याय पूर्ण चिह्नित हुआ और सिलेबस व लक्ष्यों में जुड़ गया।', 'success');
      } else {
        showToast?.('अध्याय की प्रगति अपडेट की गई।', 'info');
      }
      return updated;
    });
  };

  const handleSetCompletedChaptersCount = (count: number) => {
    const targetCount = Math.max(0, Math.min(count, currentSubject.chapters.length));
    setCompletedChaptersMap((prev) => {
      const updated = { ...prev };
      currentSubject.chapters.forEach((chap, idx) => {
        updated[chap.id] = idx < targetCount;
      });
      try {
        localStorage.setItem('hans-compain-completed-chapters', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // 🧮 Smart Preparation Calculator State ("क्या, कैसे और कब करें")
  const [targetScorePercent, setTargetScorePercent] = useState<number>(90);
  const [daysRemaining, setDaysRemaining] = useState<number>(45);
  const [dailyHours, setDailyHours] = useState<number>(3.5);

  // Chapter Test Quiz State
  const [quizAnswerState, setQuizAnswerState] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Active Subject & Chapter derivations
  const currentSubject = useMemo(() => {
    return activeClassSubjects.find((s) => s.id === selectedSubjectId) || activeClassSubjects[0];
  }, [activeClassSubjects, selectedSubjectId]);

  const currentChapter = useMemo(() => {
    return currentSubject.chapters.find((c) => c.id === selectedChapterId) || currentSubject.chapters[0] || {
      id: 'placeholder',
      number: 1,
      titleHi: 'पाठ्यक्रम उपलब्ध नहीं',
      titleEn: 'No Content Available',
      marksWeightage: 0,
      difficulty: 'Easy',
      estHours: 0,
      summaryHi: '',
      keyFormulas: [],
      solvedExamples: [],
      practiceQuestions: []
    };
  }, [currentSubject, selectedChapterId]);

  // Actual Completed Chapters for the Current Subject
  const currentSubjectCompletedCount = useMemo(() => {
    return currentSubject.chapters.filter((c) => completedChaptersMap[c.id]).length;
  }, [currentSubject, completedChaptersMap]);

  // Actual Marks Secured in Board Exam so far
  const securedMarksInSubject = useMemo(() => {
    return currentSubject.chapters
      .filter((c) => completedChaptersMap[c.id])
      .reduce((acc, c) => acc + c.marksWeightage, 0);
  }, [currentSubject, completedChaptersMap]);

  // Dynamic Calculator Outputs linked to real completed chapters
  const calcMetrics = useMemo(() => {
    const totalChapters = currentSubject.chapters.length;
    const remainingChapters = Math.max(0, totalChapters - currentSubjectCompletedCount);
    const totalAvailableHours = daysRemaining * dailyHours;
    const hoursPerRemainingChapter = remainingChapters > 0 ? (totalAvailableHours / remainingChapters).toFixed(1) : '0';
    
    // Feasibility Score (0 to 100%)
    const requiredHoursPerChapterStandard = 5;
    const requiredTotalHours = remainingChapters * requiredHoursPerChapterStandard;
    const ratio = requiredTotalHours > 0 ? totalAvailableHours / requiredTotalHours : 1;
    const feasibilityIndex = Math.min(99, Math.max(40, Math.round(ratio * 75 + (targetScorePercent >= 90 ? 5 : 15))));

    // Days needed to finish syllabus
    const daysToFinish = remainingChapters > 0 && dailyHours > 0 
      ? Math.ceil((remainingChapters * 5) / dailyHours)
      : 0;
    
    const revisionDaysBuffer = Math.max(0, daysRemaining - daysToFinish);

    return {
      totalChapters,
      remainingChapters,
      totalAvailableHours,
      hoursPerRemainingChapter,
      feasibilityIndex,
      daysToFinish,
      revisionDaysBuffer
    };
  }, [currentSubject, currentSubjectCompletedCount, daysRemaining, dailyHours, targetScorePercent]);

  // Quiz Score Calculation
  const quizScore = useMemo(() => {
    if (!quizSubmitted) return 0;
    let score = 0;
    currentChapter.practiceQuestions.forEach((q, idx) => {
      if (quizAnswerState[idx] === q.correctIndex) {
        score++;
      }
    });
    return score;
  }, [quizSubmitted, quizAnswerState, currentChapter]);

  // Linked Actions: Add wrong questions to Mistake Notebook
  const handleAddMistakesToNotebook = () => {
    const wrongQuestions: any[] = [];
    currentChapter.practiceQuestions.forEach((q, idx) => {
      const userAns = quizAnswerState[idx];
      if (userAns !== undefined && userAns !== q.correctIndex) {
        wrongQuestions.push({
          id: `mistake-${Date.now()}-${idx}`,
          question: q.q,
          options: q.options,
          correctOptionIndex: q.correctIndex,
          userOptionIndex: userAns,
          explanation: q.explanation,
          subject: currentSubject.nameHi,
          topic: currentChapter.titleHi,
          timestamp: new Date().toISOString(),
          exam: 'Bharati Bhawan Chapter Test',
          mastered: false
        });
      }
    });

    if (wrongQuestions.length === 0) {
      showToast?.('कोई गलत उत्तर नहीं है! आपने सभी प्रश्नों के सही उत्तर दिए हैं। 🏆', 'success');
      return;
    }

    try {
      const saved = localStorage.getItem('hans-compain-mistake-notebook');
      const existing = saved ? JSON.parse(saved) : [];
      const merged = [...wrongQuestions, ...existing];
      localStorage.setItem('hans-compain-mistake-notebook', JSON.stringify(merged));
      showToast?.(`📕 ${wrongQuestions.length} गलत प्रश्न आपकी 'मिस्टेक नोटबुक' में जुड़ गए!`, 'success');
      if (onOpenMistakeNotebook) {
        onOpenMistakeNotebook();
      }
    } catch (e) {
      showToast?.('मिस्टेक नोटबुक अपडेट करने में त्रुटि हुई।', 'error');
    }
  };

  // Linked Actions: Add revision goal to Daily Goals
  const handleAddChapterToDailyGoals = () => {
    try {
      const saved = localStorage.getItem('hans-compain-goals-v2');
      const existing = saved ? JSON.parse(saved) : [];
      const newGoal = {
        id: `goal-${Date.now()}`,
        text: `भारती भवन: ${currentChapter.titleHi} (${currentSubject.nameHi}) - रिवीजन व अभ्यास`,
        done: false,
        category: currentSubject.id === 'maths' ? 'Math' : currentSubject.id === 'physics' ? 'Science' : 'Academic'
      };
      localStorage.setItem('hans-compain-goals-v2', JSON.stringify([newGoal, ...existing]));
      showToast?.(`🎯 दैनिक लक्ष्य में '${currentChapter.titleHi}' का रिवीजन जुड़ गया!`, 'success');
      if (onOpenDailyGoals) {
        onOpenDailyGoals();
      }
    } catch (e) {
      showToast?.('दैनिक लक्ष्य सेव करने में समस्या हुई।', 'error');
    }
  };

  // Linked Actions: Ask AI Doubt
  const handleAskDoubtToAI = () => {
    const doubtText = `भारती भवन कक्षा ${selectedClass} (${currentSubject.nameHi}) के अध्याय '${currentChapter.titleHi}' के मुख्य सूत्र और कठिन प्रश्न मुझे सरल भाषा में समझाएं।`;
    if (onOpenChatWithDoubt) {
      onOpenChatWithDoubt(doubtText);
      showToast?.(`🤖 AI ट्यूटर के साथ '${currentChapter.titleHi}' का अध्ययन सत्र शुरू!`, 'info');
    }
  };

  const handleLaunchOfficialPortal = () => {
    const portalUrl = 'https://www.bharatibhawanpublishers.com/';
    try {
      window.open(portalUrl, '_blank', 'noopener,noreferrer');
    } catch (e) {
      console.error("Window open blocked:", e);
    }
    
    // Copy URL to clipboard automatically as a robust fallback!
    try {
      navigator.clipboard.writeText(portalUrl);
      if (showToast) {
        showToast('पोर्टल लिंक क्लिपबोर्ड में कॉपी हो गया! यदि डायरेक्ट नहीं खुला, तो ब्राउज़र में पेस्ट करें। 📗', 'success');
      }
    } catch (err) {
      if (showToast) {
        showToast('भारती भवन आधिकारिक पोर्टल खोला जा रहा है... 📗', 'info');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#070C18] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* TOP STICKY HEADER */}
      <header className="sticky top-0 z-30 bg-[#0A1022]/95 backdrop-blur-md border-b border-emerald-500/20 px-3 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onBack}
              className="p-2 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1 text-xs font-bold"
              title="वापस मुख्य मेनू (Back to Home)"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">होम पर वापस</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 font-black text-lg">
                📗
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-sm sm:text-base font-black text-white tracking-tight">
                    भारती भवन डिजिटल अध्ययन केंद्र
                  </h1>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.5 rounded font-black uppercase">
                    Class {selectedClass}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate max-w-xs sm:max-w-md">
                  {currentSubject.bookTitle} • संपूर्ण अध्याय, सूत्र, हल, सिलेबस विश्लेषण व टेस्ट कैलकुलेटर
                </p>
              </div>
            </div>
          </div>

          {/* Quick External Official Portal Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleLaunchOfficialPortal}
              className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/25 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-95"
            >
              <span>वेब पोर्टल</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* SUB-HEADER / CLASS & SUBJECT SELECTOR */}
      <div className="bg-[#0C1328] border-b border-slate-800 px-3 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Class Picker */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0">
              कक्षा:
            </span>
            {(['9', '10', '11', '12'] as const).map((cls) => (
              <button
                key={cls}
                onClick={() => {
                  setSelectedClass(cls);
                  const subjs = SUBJECTS_BY_CLASS[cls] || SUBJECTS_BY_CLASS['10'];
                  const firstSubj = subjs[0];
                  setSelectedSubjectId(firstSubj.id);
                  setSelectedChapterId(firstSubj.chapters[0]?.id || '');
                  setQuizSubmitted(false);
                  setQuizAnswerState({});
                  showToast?.(`कक्षा ${cls}वीं का पाठ्यक्रम सफलतापूर्वक लोड किया गया।`, 'success');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedClass === cls
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                कक्षा {cls}वीं
              </button>
            ))}
          </div>

          {/* Subject Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {activeClassSubjects.map((subj) => (
              <button
                key={subj.id}
                onClick={() => {
                  setSelectedSubjectId(subj.id);
                  setSelectedChapterId(subj.chapters[0]?.id || '');
                  setQuizSubmitted(false);
                  setQuizAnswerState({});
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  selectedSubjectId === subj.id
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20 border border-emerald-400/40'
                    : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <span>{subj.nameHi.split(' ')[0]}</span>
                <span className="text-[10px] opacity-75">{subj.chapters.length} पाठ</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4 LINKED INTERACTIVE TABS */}
      <div className="bg-[#080E1C] border-b border-slate-800/80 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-start gap-2 overflow-x-auto scrollbar-none py-2">
          {[
            { id: 'study', label: '📖 अध्याय अध्ययन व हल (Study & Solved)', icon: BookOpen },
            { id: 'syllabus', label: '📊 अंक भार व सिलेबस विश्लेषण', icon: TrendingUp },
            { id: 'calculator', label: '🧮 तैयारी व प्रगति कैलकुलेटर', icon: Calculator, badge: 'SMART' },
            { id: 'quiz', label: '⚡ लिंक्ड चैप्टर टेस्ट (Live Test)', icon: PlayCircle },
            { id: 'portal', label: '🌐 पोर्टल जानकारी व ई-कैटलॉग', icon: ExternalLink }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  if (tab.id === 'quiz') {
                    setQuizSubmitted(false);
                    setQuizAnswerState({});
                  }
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[8px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN VIEWPORT BODY */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-3 sm:p-6">
        {/* ======================= TAB 1: STUDY & CHAPTERS ======================= */}
        {activeTab === 'study' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Column: Chapter Navigator */}
            <div className="lg:col-span-4 space-y-3">
              <div className="bg-[#0C1328] border border-slate-800/90 rounded-2xl p-3 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-300">
                    {currentSubject.nameHi} के अध्याय
                  </span>
                  <span className="text-[10px] text-slate-500">भारती भवन पाठ्यसूची</span>
                </div>

                <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
                  {currentSubject.chapters.map((ch) => {
                    const isSelected = ch.id === currentChapter.id;
                    return (
                      <button
                        key={ch.id}
                        onClick={() => {
                          setSelectedChapterId(ch.id);
                          setQuizSubmitted(false);
                          setQuizAnswerState({});
                        }}
                        className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between border ${
                          isSelected
                            ? 'bg-emerald-500/15 border-emerald-500/60 text-emerald-200 shadow-sm'
                            : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800/60 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-300 shrink-0">
                            {ch.number}
                          </span>
                          <span className="truncate">{ch.titleHi}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[9px] bg-slate-800 text-emerald-400 px-1.5 py-0.5 rounded font-mono">
                            {ch.marksWeightage} अंक
                          </span>
                          <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-slate-600'}`} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Jump to Linked Calculator */}
              <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/30 rounded-2xl p-3.5 space-y-2">
                <div className="flex items-center gap-2 text-indigo-300">
                  <Calculator className="w-4 h-4" />
                  <span className="text-xs font-bold">तैयारी रणनीति कैलकुलेटर</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  जानें कि परीक्षा के बचे दिनों में कौन सा चैप्टर कितने घंटे में पूरा करना चाहिए।
                </p>
                <button
                  onClick={() => setActiveTab('calculator')}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-indigo-500/20"
                >
                  कैलकुलेट करें (क्या, कैसे और कब करें) →
                </button>
              </div>
            </div>

            {/* Right Column: Active Chapter Detailed Content */}
            <div className="lg:col-span-8 space-y-5">
              {/* Chapter Card Header */}
              <div className="bg-[#0C1328] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                        अध्याय {currentChapter.number}
                      </span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                        बोर्ड अंक भार: {currentChapter.marksWeightage} Marks
                      </span>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-bold">
                        कठिनाई: {currentChapter.difficulty}
                      </span>
                    </div>
                    <h2 className="text-base sm:text-xl font-black text-white mt-1">
                      {currentChapter.titleHi}
                    </h2>
                  </div>

                  {/* Linked Ecosystem Quick Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleToggleChapterCompletion(currentChapter.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                        isChapterCompleted(currentChapter.id)
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                    >
                      <CheckCircle2 className={`w-3.5 h-3.5 ${isChapterCompleted(currentChapter.id) ? 'text-emerald-400' : 'text-slate-400'}`} />
                      <span>{isChapterCompleted(currentChapter.id) ? 'पूर्ण हुआ ✓' : 'पूर्ण मार्क करें'}</span>
                    </button>

                    <button
                      onClick={handleAddChapterToDailyGoals}
                      className="px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                      title="दैनिक लक्ष्य (Daily Goals) में रिवीजन जोड़ें"
                    >
                      <Target className="w-3.5 h-3.5 text-indigo-400" />
                      <span>डेली गोल्स में जोड़ें</span>
                    </button>

                    <button
                      onClick={handleAskDoubtToAI}
                      className="px-3 py-1.5 bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/30 text-violet-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                      title="AI शिक्षक से इस पाठ का डाउट पूछें"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-violet-400" />
                      <span>AI डाउट</span>
                    </button>

                    {/* Direct Action to Take Chapter Test */}
                    <button
                      onClick={() => setActiveTab('quiz')}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 cursor-pointer active:scale-95"
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span>चैप्टर टेस्ट दें</span>
                    </button>
                  </div>
                </div>

                {/* Core Concept Summary */}
                <div className="space-y-1.5">
                  <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <BookMarked className="w-3.5 h-3.5 text-emerald-400" />
                    <span>मुख्य अवधारणा एवं सारांश (Core Concepts)</span>
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed bg-[#080C16] p-3 rounded-xl border border-slate-800/80">
                    {currentChapter.summaryHi}
                  </p>
                </div>

                {/* Formula Bank */}
                {currentChapter.keyFormulas.length > 0 && (
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>महत्वपूर्ण सूत्र एवं नियम (Formula Bank)</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {currentChapter.keyFormulas.map((f, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl font-mono text-xs text-amber-200 flex items-center gap-2"
                        >
                          <span className="text-[10px] bg-amber-500/30 px-1.5 py-0.5 rounded font-bold text-amber-300">
                            #{idx + 1}
                          </span>
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Solved Exemplar & Board Exam Questions */}
              <div className="bg-[#0C1328] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <span>📝</span>
                    <span>भारती भवन मानक हल व विगत वर्षों के प्रश्न</span>
                  </h3>
                  <span className="text-[10px] text-slate-400">Step-by-Step Solutions</span>
                </div>

                <div className="space-y-4">
                  {currentChapter.solvedExamples.map((ex, idx) => (
                    <div
                      key={idx}
                      className="bg-[#080D1A] border border-slate-800/80 rounded-xl p-3.5 space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-black text-emerald-300">
                          प्रश्न {idx + 1}: {ex.question}
                        </span>
                        <span className="text-[9px] bg-slate-800 text-amber-300 px-2 py-0.5 rounded font-mono shrink-0">
                          {ex.boardYear}
                        </span>
                      </div>

                      <div className="pl-2 border-l-2 border-emerald-500/40 space-y-1.5 text-xs text-slate-300">
                        {ex.stepByStepSolution.map((step, sIdx) => (
                          <p key={sIdx} className="leading-relaxed">
                            {step}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB 2: SYLLABUS & MARKS WEIGHTAGE ======================= */}
        {activeTab === 'syllabus' && (
          <div className="space-y-5">
            <div className="bg-[#0C1328] border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-md space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3.5">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <span>{currentSubject.nameHi} - अंक भार व ब्लूप्रिंट विश्लेषण (Syllabus Tracker)</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    भारती भवन पाठ्यपुस्तकों एवं बोर्ड परीक्षा पैटर्न पर आधारित उच्च-अंक वाले अध्यायों की प्राथमिकता सूची
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">बोर्ड परीक्षा में सुरक्षित अंक</span>
                    <div className="text-lg font-black text-emerald-400">
                      {securedMarksInSubject} / {currentSubject.totalMarks} Marks
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Summary Card */}
              <div className="p-3.5 bg-[#080D1A] border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-bold">
                    सिलेबस कवरेज: {currentSubjectCompletedCount} / {currentSubject.chapters.length} अध्याय पूर्ण
                  </span>
                  <span className="text-emerald-400 font-mono font-bold">
                    {Math.round((securedMarksInSubject / currentSubject.totalMarks) * 100)}% अंक तैयार
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 transition-all duration-500 rounded-full"
                    style={{
                      width: `${Math.min(100, Math.round((securedMarksInSubject / currentSubject.totalMarks) * 100))}%`
                    }}
                  />
                </div>
              </div>

              {/* Table Breakdown */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#070B16] text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">अध्याय क्रम व नाम</th>
                      <th className="py-2.5 px-3">अंक भार (Marks)</th>
                      <th className="py-2.5 px-3">कठिनाई स्तर</th>
                      <th className="py-2.5 px-3">तैयारी स्थिति</th>
                      <th className="py-2.5 px-3">प्राथमिकता श्रेणी</th>
                      <th className="py-2.5 px-3 text-right">कार्रवाई</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {currentSubject.chapters.map((ch) => {
                      const isHighYield = ch.marksWeightage >= 12;
                      const isDone = isChapterCompleted(ch.id);
                      return (
                        <tr key={ch.id} className="hover:bg-slate-800/30">
                          <td className="py-3 px-3 font-bold text-slate-200 flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-800 text-[10px] flex items-center justify-center text-slate-300">
                              {ch.number}
                            </span>
                            <span>{ch.titleHi}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded text-xs font-black bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                              {ch.marksWeightage} Marks
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-300">{ch.difficulty}</td>
                          <td className="py-3 px-3">
                            <button
                              onClick={() => handleToggleChapterCompletion(ch.id)}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                                isDone
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              <CheckCircle2 className={`w-3 h-3 ${isDone ? 'text-emerald-400' : 'text-slate-500'}`} />
                              <span>{isDone ? 'तैयार ✓' : 'अपूर्ण'}</span>
                            </button>
                          </td>
                          <td className="py-3 px-3">
                            {isHighYield ? (
                              <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded text-[10px] font-black">
                                🔴 MUST DO (उच्च अंक)
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded text-[10px] font-bold">
                                🟡 मध्यम भार
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => {
                                setSelectedChapterId(ch.id);
                                setActiveTab('study');
                              }}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                            >
                              पढ़ें →
                            </button>
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

        {/* ======================= TAB 3: SMART PREPARATION CALCULATOR ======================= */}
        {activeTab === 'calculator' && (
          <div className="space-y-5">
            {/* Intro banner */}
            <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-indigo-950/70 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 shadow-lg space-y-2">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-emerald-500/20 text-emerald-300 rounded-xl text-lg font-black">
                  🧮
                </span>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-white">
                    तैयारी व प्रगति कैलकुलेटर ("क्या, कैसे और कब किया जा सकता है")
                  </h2>
                  <p className="text-xs text-slate-300">
                    अपने लक्ष्य प्रतिशत और परीक्षा में बचे दिनों के अनुसार सटीक दैनिक टाइम-टेबल व रणनीति निकालें।
                  </p>
                </div>
              </div>
            </div>

            {/* Main Interactive Controls Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Inputs Form */}
              <div className="lg:col-span-5 bg-[#0C1328] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-md">
                <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-2">
                  अपनी वर्तमान स्थिति चुनें
                </h3>

                {/* Target Score % */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">बोर्ड परीक्षा में लक्ष्य अंक:</span>
                    <span className="text-emerald-400 font-mono text-sm">{targetScorePercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="99"
                    step="5"
                    value={targetScorePercent}
                    onChange={(e) => setTargetScorePercent(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>60% (1st Div)</span>
                    <span>80% (Distinction)</span>
                    <span>95%+ (Topper)</span>
                  </div>
                </div>

                {/* Days Remaining */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">परीक्षा में शेष दिन:</span>
                    <span className="text-amber-300 font-mono text-sm">{daysRemaining} दिन</span>
                  </div>
                  <input
                    type="range"
                    min="7"
                    max="120"
                    step="1"
                    value={daysRemaining}
                    onChange={(e) => setDaysRemaining(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>1 हफ़्ता</span>
                    <span>30 दिन</span>
                    <span>60 दिन</span>
                    <span>120 दिन</span>
                  </div>
                </div>

                {/* Daily Available Study Hours */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">प्रतिदिन पढ़ने के उपलब्ध घंटे:</span>
                    <span className="text-cyan-400 font-mono text-sm">{dailyHours} घंटे / दिन</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    step="0.5"
                    value={dailyHours}
                    onChange={(e) => setDailyHours(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>

                {/* Completed Chapters Count */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">पहले से तैयार अध्याय (Chapters):</span>
                    <span className="text-indigo-300 font-mono text-sm">
                      {currentSubjectCompletedCount} / {calcMetrics.totalChapters}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={calcMetrics.totalChapters}
                    step="1"
                    value={currentSubjectCompletedCount}
                    onChange={(e) => handleSetCompletedChaptersCount(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Outputs & Computed Analysis Cards */}
              <div className="lg:col-span-7 space-y-4">
                {/* 3 Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-[#0C1328] border border-slate-800 rounded-2xl p-3.5 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">तैयारी व्यवहार्यता</span>
                    <div className="text-2xl font-black text-emerald-400">
                      {calcMetrics.feasibilityIndex}%
                    </div>
                    <span className="text-[10px] text-slate-500">
                      {calcMetrics.feasibilityIndex >= 80 ? '🟢 लक्ष्य पूरी तरह साध्य है' : '🟡 अधिक समय देने की आवश्यकता'}
                    </span>
                  </div>

                  <div className="bg-[#0C1328] border border-slate-800 rounded-2xl p-3.5 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">प्रति चैप्टर समय</span>
                    <div className="text-2xl font-black text-cyan-400">
                      {calcMetrics.hoursPerRemainingChapter} hrs
                    </div>
                    <span className="text-[10px] text-slate-500">शेष {calcMetrics.remainingChapters} पाठों हेतु</span>
                  </div>

                  <div className="bg-[#0C1328] border border-slate-800 rounded-2xl p-3.5 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">रिवीजन बफर दिन</span>
                    <div className="text-2xl font-black text-amber-400">
                      {calcMetrics.revisionDaysBuffer} दिन
                    </div>
                    <span className="text-[10px] text-slate-500">सिलेबस समाप्ति के बाद</span>
                  </div>
                </div>

                {/* Roadmap Cards: क्या करें, कैसे करें और कब करें */}
                <div className="bg-[#0C1328] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-md">
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>रणनीतिक योजना: क्या, कैसे और कब करें</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    {/* Step 1: क्या करें */}
                    <div className="bg-[#080D1A] border border-emerald-500/30 rounded-xl p-3 space-y-1.5">
                      <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-[10px]">
                          1
                        </span>
                        <span>क्या पहले करें?</span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        उच्च अंक भार वाले अध्याय (जैसे त्रिकोणमिति 20 अंक, वास्तविक संख्याएं 10 अंक) को पहले पूरा करें।
                      </p>
                    </div>

                    {/* Step 2: कैसे करें */}
                    <div className="bg-[#080D1A] border border-cyan-500/30 rounded-xl p-3 space-y-1.5">
                      <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[10px]">
                          2
                        </span>
                        <span>कैसे करें?</span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        भारती भवन के प्रत्येक अध्याय के सूत्र याद करें + उदाहरण हल करें + 10-प्रश्नों का लिंक्ड टेस्ट तुरंत दें।
                      </p>
                    </div>

                    {/* Step 3: कब करें */}
                    <div className="bg-[#080D1A] border border-amber-500/30 rounded-xl p-3 space-y-1.5">
                      <div className="font-bold text-amber-300 flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px]">
                          3
                        </span>
                        <span>दैनिक समय-चक्र</span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        सुबह 1 घंटा कॉन्सेप्ट + दोपहर 1.5 घंटा अभ्यास + रात 1 घंटा मॉडल पेपर रिवीजन।
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB 4: LINKED CHAPTER TEST ======================= */}
        {activeTab === 'quiz' && (
          <div className="max-w-3xl mx-auto space-y-5">
            <div className="bg-[#0C1328] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-md space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                    {currentSubject.nameHi} • अध्याय {currentChapter.number}
                  </span>
                  <h2 className="text-base sm:text-lg font-black text-white">
                    {currentChapter.titleHi} - लाइव प्रैक्टिस टेस्ट
                  </h2>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">कुल प्रश्न</span>
                  <span className="text-sm font-black text-emerald-400">
                    {currentChapter.practiceQuestions.length} MCQs
                  </span>
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-4 pt-1">
                {currentChapter.practiceQuestions.map((q, qIdx) => {
                  const selectedOpt = quizAnswerState[qIdx];
                  const isCorrect = selectedOpt === q.correctIndex;

                  return (
                    <div
                      key={qIdx}
                      className="bg-[#080C16] border border-slate-800/90 rounded-xl p-3.5 space-y-2.5"
                    >
                      <div className="text-xs font-bold text-slate-200">
                        {qIdx + 1}. {q.q}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, optIdx) => {
                          let optClass = 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/80';
                          if (selectedOpt === optIdx) {
                            optClass = 'bg-indigo-600/30 border-indigo-500 text-indigo-200 font-bold';
                          }
                          if (quizSubmitted) {
                            if (optIdx === q.correctIndex) {
                              optClass = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold';
                            } else if (selectedOpt === optIdx && !isCorrect) {
                              optClass = 'bg-rose-500/20 border-rose-500 text-rose-200 font-bold';
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              disabled={quizSubmitted}
                              onClick={() => {
                                setQuizAnswerState((prev) => ({ ...prev, [qIdx]: optIdx }));
                              }}
                              className={`p-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer flex items-center gap-2 ${optClass}`}
                            >
                              <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] shrink-0">
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 text-[11px] text-slate-300">
                          <span className="font-bold text-emerald-400 mr-1">व्याख्या:</span>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Submit / Reset Actions */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                {!quizSubmitted ? (
                  <button
                    onClick={() => {
                      if (Object.keys(quizAnswerState).length === 0) {
                        showToast?.('कृपया कम से कम एक विकल्प का चयन करें!', 'warn');
                        return;
                      }
                      setQuizSubmitted(true);
                      showToast?.('टेस्ट सफलतापूर्वक सबमिट हुआ! स्कोरकार्ड देखें।', 'success');
                    }}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
                  >
                    उत्तर सबमिट करें व परिणाम देखें
                  </button>
                ) : (
                  <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#080D1A] p-3.5 rounded-xl border border-slate-800">
                    <div>
                      <div className="text-xs text-slate-300">
                        आपका स्कोर:{' '}
                        <span className="font-black text-emerald-400 text-base">{quizScore}</span> /{' '}
                        {currentChapter.practiceQuestions.length}{' '}
                        <span className="text-[11px] text-slate-400">
                          ({Math.round((quizScore / currentChapter.practiceQuestions.length) * 100)}%)
                        </span>
                      </div>
                      {quizScore === currentChapter.practiceQuestions.length ? (
                        <div className="text-[11px] text-emerald-400 font-bold mt-0.5">
                          🌟 शानदार प्रदर्शन! सभी उत्तर शत-प्रतिशत सही हैं।
                        </div>
                      ) : (
                        <div className="text-[11px] text-amber-400 font-medium mt-0.5">
                          💡 {currentChapter.practiceQuestions.length - quizScore} प्रश्न गलत हुए - इन्हें मिस्टेक नोटबुक में जोड़कर दोहराएं।
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {quizScore < currentChapter.practiceQuestions.length && (
                        <button
                          onClick={handleAddMistakesToNotebook}
                          className="px-3 py-2 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                          title="गलत प्रश्नों को रिवीजन के लिए मिस्टेक नोटबुक में जोड़ें"
                        >
                          <BookMarked className="w-3.5 h-3.5 text-rose-400" />
                          <span>मिस्टेक नोटबुक में जोड़ें</span>
                        </button>
                      )}

                      {!isChapterCompleted(currentChapter.id) && quizScore >= Math.ceil(currentChapter.practiceQuestions.length * 0.5) && (
                        <button
                          onClick={() => handleToggleChapterCompletion(currentChapter.id)}
                          className="px-3 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-200 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>अध्याय पूर्ण मार्क करें</span>
                        </button>
                      )}

                      <button
                        onClick={handleAddChapterToDailyGoals}
                        className="px-3 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-200 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                        title="दैनिक लक्ष्य में जोड़ें"
                      >
                        <Target className="w-3.5 h-3.5 text-indigo-400" />
                        <span>डेली गोल्स में जोड़ें</span>
                      </button>

                      <button
                        onClick={() => {
                          setQuizSubmitted(false);
                          setQuizAnswerState({});
                        }}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>पुनः टेस्ट दें</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB 5: OFFICIAL PORTAL & E-CATALOG ======================= */}
        {activeTab === 'portal' && (
          <div className="max-w-4xl mx-auto space-y-5">
            <div className="bg-[#0C1328] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-lg space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-2xl">
                  📗
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-white">
                    भारती भवन पब्लिशर्स एंड डिस्ट्रीब्यूटर्स (आधिकारिक पोर्टल)
                  </h2>
                  <p className="text-xs text-slate-400">
                    भारत के प्रतिष्ठित बोर्ड व स्कूल पाठ्यक्रम की आधिकारिक पुस्तकें
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <p>
                  भारती भवन (Bharati Bhawan) देश के सबसे सम्मानित शैक्षणिक प्रकाशकों में से एक है। विशेष रूप से बिहार बोर्ड (BSEB), सीबीएसई (CBSE), आईसीएसई (ICSE) तथा उत्तर प्रदेश बोर्ड (UP Board) के लाखों मेधावी छात्र-छात्राएं गणित, विज्ञान और भाषा की गहन समझ के लिए भारती भवन की मानक पुस्तकों का अध्ययन करते हैं।
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
                    <span className="font-bold text-emerald-300 text-xs block">आधिकारिक वेबसाइट URL</span>
                    <a
                      href="https://www.bharatibhawanpublishers.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 underline font-mono text-[11px] break-all"
                    >
                      https://www.bharatibhawanpublishers.com/
                    </a>
                  </div>

                  <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
                    <span className="font-bold text-amber-300 text-xs block">मुख्य प्रकाशन शृंखला</span>
                    <p className="text-[11px] text-slate-400">
                      दास गुप्ता प्राथमिक गणित, भारती भवन भौतिकी, रसायन, जीव विज्ञान, संस्कृत एवं हिन्दी व्याकरण
                    </p>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    onClick={handleLaunchOfficialPortal}
                    className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
                  >
                    <span>आधिकारिक भारती भवन पोर्टल खोलें</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
export default BharatiBhawanStudyHub;
