import React, { useState } from 'react';
import { BookOpen, Search, Sparkles, CheckCircle2, ArrowRight, Layers, FileText, Target, HelpCircle, X, Download, Copy, Share2, Image } from 'lucide-react';

export interface ExamSyllabusItem {
  id: string;
  name: string;
  category: 'ssc' | 'railway' | 'banking' | 'board' | 'state' | 'upsc' | 'teaching' | 'shorthand';
  level: string; // e.g. "Graduate / 12th / 10th"
  stages: string[];
  durationMarks: string;
  negativeMarking: string;
  subjects: {
    name: string;
    marks: string;
    topics: string[];
  }[];
  howToCompleteStrategy: string[];
}

export const EXAM_SYLLABUS_DATA: ExamSyllabusItem[] = [
  // 1. SSC EXAMS
  {
    id: 'ssc-cgl',
    name: 'SSC CGL (Combined Graduate Level)',
    category: 'ssc',
    level: 'Graduate Degree',
    stages: ['Tier 1 (Computer Based Test - Qualifying)', 'Tier 2 (Computer Based Test - Merit Score)', 'Data Entry Skill Test (DEST)'],
    durationMarks: 'Tier 1: 100 Qs / 200 Marks (60 Mins) | Tier 2: 390 Marks (2 Hrs 15 Mins)',
    negativeMarking: '0.50 Marks in Tier 1 | 1.00 Mark in Tier 2 Section I & II',
    subjects: [
      {
        name: 'Reasoning & General Intelligence',
        marks: '50 Marks (Tier 1) / 90 Marks (Tier 2)',
        topics: ['Analogy & Classification', 'Coding-Decoding', 'Blood Relations & Direction Sense', 'Syllogism & Venn Diagrams', 'Non-Verbal Paper Cutting & Mirror Images', 'Puzzles & Seating Arrangement']
      },
      {
        name: 'General Awareness & Current Affairs',
        marks: '50 Marks (Tier 1) / 75 Marks (Tier 2)',
        topics: ['Indian History (Ancient, Medieval, Modern Freedom Movement)', 'Indian Polity & Articles 12-35', 'Geography (Physical, Rivers, Maps)', 'General Science (Physics, Chemistry, Biology)', 'Economic Scene & Union Budget', 'National & International Current Affairs (Last 8 Months)']
      },
      {
        name: 'Quantitative Aptitude (Mathematics)',
        marks: '50 Marks (Tier 1) / 90 Marks (Tier 2)',
        topics: ['Number System & HCF-LCM', 'Percentage, Profit & Loss, Simple & Compound Interest', 'Ratio & Proportion, Mixture & Allegation', 'Time, Speed & Distance, Time & Work', 'Algebra, Geometry & Trigonometry', 'Mensuration 2D & 3D, Statistics & Probability']
      },
      {
        name: 'English Language & Comprehension',
        marks: '50 Marks (Tier 1) / 135 Marks (Tier 2)',
        topics: ['Grammar Rules (Error Spotting, Sentence Improvement)', 'Vocabulary (Synonyms, Antonyms, One-Word Substitution, Idioms)', 'Cloze Test & Reading Comprehension Passages', 'Active-Passive Voice & Direct-Indirect Speech']
      },
      {
        name: 'Computer Knowledge Module (Tier 2)',
        marks: '60 Marks (20 Qs - Qualifying)',
        topics: ['Computer Basics, CPU, RAM/ROM, OS', 'MS Word, MS Excel, PowerPoint Shortcuts', 'Internet, Email, Cyber Security & Networking Basics']
      }
    ],
    howToCompleteStrategy: [
      'Phase 1 (Day 1-20): Complete Core Concepts of Maths & English Grammar. Create one-page formula sheet.',
      'Phase 2 (Day 21-35): Memorize Lucent GK Static + Read Last 8 Months Current Affairs Magazine.',
      'Phase 3 (Day 36-50): Practice 50+ Previous Year Questions (PYQs) daily & solve 1 Mock Test with Timer.'
    ]
  },
  {
    id: 'ssc-chsl',
    name: 'SSC CHSL (Combined Higher Secondary Level 10+2)',
    category: 'ssc',
    level: '12th Pass (Higher Secondary)',
    stages: ['Tier 1 (CBT Qualifying)', 'Tier 2 (CBT + Typing Test)'],
    durationMarks: '100 Questions / 200 Marks (60 Mins)',
    negativeMarking: '0.50 Marks per wrong answer',
    subjects: [
      {
        name: 'General Intelligence',
        marks: '50 Marks',
        topics: ['Semantic Series', 'Symbolic Operations', 'Venn Diagrams', 'Embedded Figures', 'Critical Thinking']
      },
      {
        name: 'English Language',
        marks: '50 Marks',
        topics: ['Spot the Error', 'Fill in the Blanks', 'Synonyms/Antonyms', 'Spellings/Detecting Mis-spelt words', 'Idioms & Phrases']
      },
      {
        name: 'Quantitative Aptitude',
        marks: '50 Marks',
        topics: ['Arithmetic Skills', 'Basic Algebra', 'Elementary Geometry', 'Mensuration', 'Trigonometric Ratios']
      },
      {
        name: 'General Awareness',
        marks: '50 Marks',
        topics: ['History, Culture, Geography', 'Economic Scene', 'General Policy & Scientific Research', 'Current Events']
      }
    ],
    howToCompleteStrategy: [
      'Master basic arithmetic formulas and English grammar rules in first 2 weeks.',
      'Practice English typing speed (minimum 35 wpm) side-by-side.',
      'Solve CHSL Previous Year Question Papers from 2020-2025.'
    ]
  },
  {
    id: 'ssc-steno',
    name: 'SSC Stenographer Grade C & D',
    category: 'ssc',
    level: '12th Pass + Shorthand Skill',
    stages: ['Computer Based Exam (No Maths!)', 'Shorthand Skill Test (Dictation & Transcription)'],
    durationMarks: '200 Questions / 200 Marks (2 Hours)',
    negativeMarking: '0.25 Marks per wrong answer',
    subjects: [
      {
        name: 'English Language & Comprehension',
        marks: '100 Marks (50% Weightage!)',
        topics: ['Grammar & Error Spotting', 'Synonyms, Antonyms & Idioms', 'Cloze Test & Passage Comprehension', 'Sentence Rearrangement']
      },
      {
        name: 'General Intelligence & Reasoning',
        marks: '50 Marks',
        topics: ['Analogies', 'Similarities & Differences', 'Spatial Visualization', 'Decision Making', 'Arithmetical Reasoning']
      },
      {
        name: 'General Awareness',
        marks: '50 Marks',
        topics: ['Current Events', 'History & Constitution', 'General Science', 'Geography & Static GK']
      },
      {
        name: 'Shorthand Skill Test Module',
        marks: 'Qualifying Skill Test',
        topics: ['Grade C: 100 wpm Dictation (10 Mins) -> 40 Mins Transcription', 'Grade D: 80 wpm Dictation (10 Mins) -> 50 Mins Transcription']
      }
    ],
    howToCompleteStrategy: [
      'Focus 60% of your time on English Language grammar and vocabulary since it holds 100 marks.',
      'Practice 10 minutes of Pitman Shorthand dictation daily with headphones at 80-100 wpm.',
      'Target 150+ in CBT written test to secure top ministry allocations.'
    ]
  },

  // 2. RAILWAY EXAMS (RRB)
  {
    id: 'rrb-ntpc',
    name: 'RRB NTPC (Non-Technical Popular Categories)',
    category: 'railway',
    level: '12th Pass / Graduate',
    stages: ['CBT 1 (Screening Test)', 'CBT 2 (Final Merit Test)', 'Typing Skill Test / CBAT Aptitude Test'],
    durationMarks: 'CBT 1: 100 Qs (90 Mins) | CBT 2: 120 Qs (90 Mins)',
    negativeMarking: '1/3rd Mark negative per wrong answer',
    subjects: [
      {
        name: 'General Awareness',
        marks: '40 Marks (CBT 1) / 50 Marks (CBT 2)',
        topics: ['Current Events of National & International Importance', 'Games and Sports, Art & Culture of India', 'Indian Literature & Monuments', 'General Science & Life Sciences (Up to 10th CBSE)', 'History of India & Freedom Struggle', 'Physical, Social & Economic Geography of India', 'Indian Polity & Governance - Constitution & Political System']
      },
      {
        name: 'Mathematics',
        marks: '30 Marks (CBT 1) / 35 Marks (CBT 2)',
        topics: ['Number System, Decimals, Fractions, LCM-HCF', 'Ratio and Proportions, Percentage, Mensuration', 'Time and Work, Time and Distance', 'Simple and Compound Interest, Profit and Loss', 'Elementary Algebra, Geometry and Trigonometry, Elementary Statistics']
      },
      {
        name: 'General Intelligence and Reasoning',
        marks: '30 Marks (CBT 1) / 35 Marks (CBT 2)',
        topics: ['Analogies, Completion of Number and Alphabetical Series', 'Coding and Decoding, Mathematical Operations', 'Relationships, Analytical Reasoning, Syllogism', 'Jumbling, Venn Diagrams, Data Interpretation and Sufficiency']
      }
    ],
    howToCompleteStrategy: [
      'Science and Static GK carry maximum weightage in RRB NTPC. Finish Class 9 & 10 Science NCERT.',
      'Practice 30 minutes of speed calculation daily (tables, squares, square roots).',
      'Solve last 5 years RRB NTPC shift-wise papers.'
    ]
  },
  {
    id: 'rrb-group-d',
    name: 'RRB Group D (Level-1 Posts)',
    category: 'railway',
    level: '10th Pass / ITI',
    stages: ['Computer Based Test (CBT)', 'Physical Efficiency Test (PET)', 'Document Verification'],
    durationMarks: '100 Questions / 100 Marks (90 Minutes)',
    negativeMarking: '1/3rd Mark negative per wrong answer',
    subjects: [
      {
        name: 'General Science',
        marks: '25 Marks (Physics, Chemistry, Biology up to 10th Standard)',
        topics: ['Motion, Laws of Motion, Work, Energy & Power', 'Periodic Table, Chemical Reactions, Acids & Bases', 'Human Physiology, Diseases, Plants & Nutrition']
      },
      {
        name: 'Mathematics',
        marks: '25 Marks',
        topics: ['BODMAS, Decimals, Fractions, LCM & HCF', 'Age Calculations, Pipe & Cistern, Profit & Loss']
      },
      {
        name: 'General Intelligence & Reasoning',
        marks: '30 Marks',
        topics: ['Coding-Decoding, Direction Sense, Statement & Assumptions, Classification']
      },
      {
        name: 'General Awareness on Current Affairs',
        marks: '20 Marks',
        topics: ['Sports, Personalities in News, Scientific Developments, Railway GK']
      }
    ],
    howToCompleteStrategy: [
      'Focus deeply on 10th General Science (25 Marks) using high-yield formula tables.',
      'Practice Reasoning daily to score 28+ out of 30 marks.',
      'Maintain physical fitness for 35kg weight lifting & 1000 meter run PET test.'
    ]
  },

  // 3. BOARD EXAMS (10TH & 12TH)
  {
    id: 'board-10th',
    name: '10th Board Exam (CBSE / UP / Bihar BSEB / All State Boards)',
    category: 'board',
    level: '10th Secondary Matric',
    stages: ['Theory Exam (80 Marks)', 'Internal Assessment / Practical (20 Marks)'],
    durationMarks: '80 Marks per subject (3 Hours per paper)',
    negativeMarking: 'No Negative Marking in Board Exams!',
    subjects: [
      {
        name: 'Mathematics (Basic / Standard)',
        marks: '80 Marks',
        topics: ['Real Numbers & Polynomials', 'Pair of Linear Equations & Quadratic Equations', 'Arithmetic Progressions (AP)', 'Triangles, Coordinate Geometry & Trigonometry', 'Circles, Surface Areas & Volumes, Statistics & Probability']
      },
      {
        name: 'Science (Physics, Chemistry, Biology)',
        marks: '80 Marks',
        topics: ['Chemical Reactions & Equations, Acids, Bases & Salts, Metals & Non-Metals', 'Carbon & Its Compounds', 'Life Processes, Control & Coordination, How do Organisms Reproduce?', 'Heredity & Evolution', 'Light Reflection & Refraction, Human Eye & Electricity, Magnetic Effects of Electric Current']
      },
      {
        name: 'Social Science (SST)',
        marks: '80 Marks',
        topics: ['History: Rise of Nationalism in Europe, Nationalism in India', 'Geography: Resources, Agriculture, Water, Minerals & Manufacturing', 'Political Science: Power Sharing, Federalism, Gender & Caste', 'Economics: Development, Sectors of Indian Economy, Money & Credit']
      },
      {
        name: 'Hindi & English Language',
        marks: '80 Marks each',
        topics: ['Kavya Khand & Gadya Khand (Hindi A/B)', 'Grammar & Unseen Passages', 'Letter Writing, Essay Writing & Analytical Paragraphs']
      }
    ],
    howToCompleteStrategy: [
      'Read NCERT Textbooks line-by-line twice. NCERT is 95%+ identical to final board paper.',
      'Solve sample papers and past 5 years Board PYQs with proper answer presentation writing.',
      'Practice neat line diagrams in Science & formula derivations in Maths.'
    ]
  },
  {
    id: 'board-12th',
    name: '12th Board Exam (Science / Commerce / Arts - CBSE / State)',
    category: 'board',
    level: '12th Higher Secondary / Inter',
    stages: ['Board Theory Exams', 'Practical / Viva Assessment (30 Marks)'],
    durationMarks: '70-80 Marks per theory paper (3 Hours)',
    negativeMarking: 'No Negative Marking',
    subjects: [
      {
        name: 'Physics (Science)',
        marks: '70 Marks Theory + 30 Practical',
        topics: ['Electrostatics & Current Electricity', 'Magnetic Effects of Current & Magnetism', 'Electromagnetic Induction & Optics (Ray & Wave Optics)', 'Dual Nature of Radiation & Atoms/Nuclei', 'Electronic Devices & Semiconductor Electronics']
      },
      {
        name: 'Chemistry (Science)',
        marks: '70 Marks Theory + 30 Practical',
        topics: ['Solutions, Electrochemistry, Chemical Kinetics', 'd and f Block Elements, Coordination Compounds', 'Haloalkanes, Alcohols, Phenols & Ethers, Aldehydes & Ketones', 'Amines & Biomolecules']
      },
      {
        name: 'Mathematics (Science/Commerce)',
        marks: '80 Marks Theory',
        topics: ['Relations & Functions, Inverse Trigonometry', 'Matrices & Determinants', 'Calculus (Continuity, Differentiation, Integrals, Differential Equations)', 'Vectors & 3D Geometry, Linear Programming & Probability']
      },
      {
        name: 'Accountancy & Economics (Commerce)',
        marks: '80 Marks Theory',
        topics: ['Partnership Accounts, Company Accounts, Financial Statements', 'Macroeconomics & Indian Economic Development']
      },
      {
        name: 'History & Political Science (Arts / Humanities)',
        marks: '80 Marks Theory',
        topics: ['Themes in Indian History Part I, II, III', 'Contemporary World Politics & Politics in India since Independence']
      }
    ],
    howToCompleteStrategy: [
      'Maintain clean derivation notebooks for Physics and organic named reaction charts for Chemistry.',
      'Solve Chapter-wise NCERT exemplar problems.',
      'Take 3 full-length 3-hour timer mock exams before final board dates.'
    ]
  },

  // 4. BANKING EXAMS
  {
    id: 'banking-ibps-po',
    name: 'IBPS PO & SBI PO (Probationary Officer)',
    category: 'banking',
    level: 'Graduate Degree',
    stages: ['Prelims (Speed Test)', 'Mains (Advanced Concepts + Descriptive)', 'Group Discussion & Interview'],
    durationMarks: 'Prelims: 100 Qs / 100 Marks (60 Mins Sectional)',
    negativeMarking: '0.25 Marks per wrong answer',
    subjects: [
      {
        name: 'Quantitative Aptitude / Data Interpretation',
        marks: '35 Marks (Prelims) / 60 Marks (Mains)',
        topics: ['Data Interpretation (Tables, Pie Chart, Bar Graph, Caselet)', 'Number Series & Quadratic Equations', 'Data Sufficiency & Quantity Comparison']
      },
      {
        name: 'Reasoning Ability & Computer Aptitude',
        marks: '35 Marks (Prelims) / 60 Marks (Mains)',
        topics: ['High Level Puzzles (Floor, Box, Scheduling)', 'Seating Arrangement (Circular, Parallel Lines)', 'Input-Output, Coded Inequality, Critical Reasoning']
      },
      {
        name: 'General / Banking / Financial Awareness',
        marks: '40-50 Marks (Mains)',
        topics: ['RBI Monetary Policy (Repo Rate, Reverse Repo, CRR, SLR)', 'Banking Terms & History', 'Financial Current Affairs & Union Budget']
      }
    ],
    howToCompleteStrategy: [
      'Speed and Accuracy are king in banking. Practice 20 speed math questions every morning.',
      'Solve 3 complex puzzles and 3 DI sets every single day.',
      'Read financial newspapers (Economic Times / The Hindu) daily for Mains.'
    ]
  },

  // 5. STATE PCS & POLICE EXAMS
  {
    id: 'state-bpsc',
    name: 'BPSC (Bihar Public Service Commission 70th/71st) & UPPSC',
    category: 'state',
    level: 'Graduate Degree',
    stages: ['Prelims (150 Marks Objective)', 'Mains (Written Descriptive)', 'Personality Test / Interview'],
    durationMarks: '150 Questions / 150 Marks (2 Hours)',
    negativeMarking: '1/3rd Negative Marking',
    subjects: [
      {
        name: 'History of India & Bihar/UP Contribution',
        marks: '30-35 Marks',
        topics: ['Ancient History (Buddhism, Jainism, Maurya, Gupta Empire)', 'Modern History & Freedom Struggle 1857-1947', 'Role of Bihar/UP in Freedom Movement & Key Freedom Fighters']
      },
      {
        name: 'General Science & Technology',
        marks: '30 Marks',
        topics: ['Physics, Chemistry & Applied Biology', 'Space, IT, Defense & Biotechnology in India']
      },
      {
        name: 'Current Affairs & State Special',
        marks: '30-40 Marks',
        topics: ['Bihar/UP Budget, Economic Survey, State Schemes, National Current Events']
      },
      {
        name: 'Indian Polity & Geography',
        marks: '30 Marks',
        topics: ['Preamble, Fundamental Rights, Panchayati Raj System, Soil, Rivers & Climate']
      }
    ],
    howToCompleteStrategy: [
      'Master Modern Indian History and Bihar/UP Special GK which cover almost 50% of the prelims paper.',
      'Read Bihar/UP Economic Survey and Budget thoroughly.',
      'Practice elimination technique for objective MCQs.'
    ]
  },

  // 6. SHORTHAND & SKILL TEST
  {
    id: 'shorthand-skills',
    name: 'Pitman Shorthand & Computer Typing Skill Test',
    category: 'shorthand',
    level: 'Skill Test for Stenographer & Lower Division Clerk (LDC)',
    stages: ['Dictation Speed Test (80 / 100 / 120 wpm)', 'Computer Transcription & Typing Test'],
    durationMarks: '10 Mins Audio Dictation + Computer Typing',
    negativeMarking: 'Percentage of Full/Half Mistakes Allowed (Max 5%-7%)',
    subjects: [
      {
        name: 'English Pitman Shorthand (80 / 100 wpm)',
        marks: 'Qualifying Skill Test',
        topics: ['Alphabet Consonants, Vowels & Position Rules', 'Grammalogues, Short Forms & Contractions', 'Phraseography & Intersected Outlines', 'Editorial & Legal Passages Dictation Practice']
      },
      {
        name: 'Hindi Shorthand (हिंदी आशुलिपि - ऋषि / मानक / विशिष्ट प्रणाली)',
        marks: 'Qualifying Skill Test',
        topics: ['वर्णमाला एवं व्यंजन जोड़ना', 'स्वर एवं मात्रा नियम', 'संक्षिप्त चिन्ह एवं वाक्यांश', 'सरकारी कार्यालयीय पत्र एवं संपादकीय डिक्टेशन']
      },
      {
        name: 'English / Hindi Typing Test',
        marks: '35 wpm English / 30 wpm Hindi',
        topics: ['Touch Typing without looking at Keyboard', 'Accuracy Maintenance above 95%', 'Special Symbols and Numerical Keypad Practice']
      }
    ],
    howToCompleteStrategy: [
      'Practice 2 audio dictation passages daily at 85 wpm (for 80 wpm exam) to build buffer confidence.',
      'Always transcribe the steno outlines on computer within allotted time.',
      'Revise daily 50 grammalogues and special phrase outlines.'
    ]
  }
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectSyllabusPrompt: (promptText: string) => void;
  onOpenStudyPlannerWithExam: (examName: string) => void;
  showToast: (msg: string, type?: 'info' | 'success' | 'warn') => void;
}

export const AllExamsSyllabusModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectSyllabusPrompt,
  onOpenStudyPlannerWithExam,
  showToast
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExamId, setSelectedExamId] = useState<string>('ssc-cgl');

  if (!isOpen) return null;

  const filteredExams = EXAM_SYLLABUS_DATA.filter(exam => {
    const matchesCat = selectedCategory === 'all' || exam.category === selectedCategory;
    const matchesSearch = exam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          exam.subjects.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCat && matchesSearch;
  });

  const activeExam = EXAM_SYLLABUS_DATA.find(e => e.id === selectedExamId) || filteredExams[0] || EXAM_SYLLABUS_DATA[0];

  const handleCopySyllabus = () => {
    if (!activeExam) return;
    const text = `📚 ${activeExam.name} Syllabus Summary:\nLevel: ${activeExam.level}\nPattern: ${activeExam.durationMarks}\nNegative Marking: ${activeExam.negativeMarking}\n\nSUBJECTS:\n` +
      activeExam.subjects.map(s => `• ${s.name} (${s.marks}):\n  ${s.topics.join(', ')}`).join('\n\n') +
      `\n\nSTRATEGY:\n` + activeExam.howToCompleteStrategy.join('\n');

    navigator.clipboard.writeText(text);
    showToast(`Syllabus for ${activeExam.name} copied to clipboard! 📋`, 'success');
  };

  const handleDownloadPDF = () => {
    if (!activeExam) return;
    try {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8"/>
          <title>${activeExam.name} - Official Syllabus (HansAI)</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 25px; color: #0f172a; background: #ffffff; line-height: 1.5; }
            .header { text-align: center; border-bottom: 3px solid #0284c7; padding-bottom: 12px; margin-bottom: 18px; }
            .badge { display: inline-block; background: #e0f2fe; color: #0369a1; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: bold; }
            .title { font-size: 22px; font-weight: 800; color: #0f172a; margin: 8px 0 4px 0; }
            .meta { font-size: 13px; color: #475569; font-weight: 600; }
            .grid-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 12px; margin-bottom: 18px; }
            .section-title { font-size: 15px; font-weight: bold; color: #0369a1; border-left: 4px solid #0284c7; padding-left: 8px; margin: 18px 0 10px 0; uppercase: true; }
            .stage-chip { display: inline-block; background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; padding: 4px 8px; border-radius: 6px; font-size: 12px; margin-right: 6px; margin-bottom: 6px; font-weight: 600; }
            .subject-card { background: #fafafa; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 12px; }
            .subject-head { display: flex; justify-content: space-between; font-weight: bold; font-size: 14px; color: #0284c7; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 8px; }
            .topic-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 12px; color: #334155; }
            .topic-item { position: relative; padding-left: 12px; }
            .topic-item::before { content: "•"; color: #0284c7; position: absolute; left: 0; font-weight: bold; }
            .strategy-box { background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 12px; font-size: 12px; color: #065f46; }
            .footer { text-align: center; margin-top: 25px; font-size: 10px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 10px; }
            @media print {
              body { padding: 10px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <span class="badge">HansAI Academic Companion • Official Exam Syllabus Directory</span>
            <div class="title">${activeExam.name}</div>
            <div class="meta">Category: ${activeExam.category.toUpperCase()} | Level: ${activeExam.level}</div>
          </div>

          <div class="grid-meta">
            <div><strong>Exam Pattern:</strong> ${activeExam.durationMarks}</div>
            <div><strong>Negative Marking:</strong> ${activeExam.negativeMarking}</div>
          </div>

          <div class="section-title">Exam Stages & Selection Rounds</div>
          <div>
            ${activeExam.stages.map(s => `<span class="stage-chip">✓ ${s}</span>`).join('')}
          </div>

          <div class="section-title">Subject-Wise Topics Breakdown</div>
          ${activeExam.subjects.map(sub => `
            <div class="subject-card">
              <div class="subject-head">
                <span>${sub.name}</span>
                <span>${sub.marks}</span>
              </div>
              <div class="topic-grid">
                ${sub.topics.map(t => `<div class="topic-item">${t}</div>`).join('')}
              </div>
            </div>
          `).join('')}

          <div class="section-title">3-Phase Fast Completion Strategy</div>
          <div class="strategy-box">
            ${activeExam.howToCompleteStrategy.map(st => `<p style="margin: 4px 0;">🎯 ${st}</p>`).join('')}
          </div>

          <div class="footer">
            Downloaded from HansAI Companion • Educational Platform (${new Date().toLocaleDateString()})
          </div>

          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 300);
            };
          </script>
        </body>
        </html>
      `;

      const blob = new Blob([htmlContent], { type: 'text/html' });
      const blobUrl = URL.createObjectURL(blob);

      // Download file link
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${activeExam.name.replace(/[^a-zA-Z0-9]/g, '_')}_Syllabus_HansAI.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Open print popup window for Save As PDF
      const printWin = window.open(blobUrl, '_blank');
      if (printWin) {
        showToast(`PDF Printable window opened! Use 'Save as PDF' to download. 📄`, 'success');
      } else {
        showToast(`Syllabus PDF file downloaded successfully! 📄`, 'success');
      }
    } catch (err) {
      console.error('PDF download error:', err);
      showToast('Error generating PDF. Text copied to clipboard instead.', 'warn');
    }
  };

  const handleDownloadImage = () => {
    if (!activeExam) return;
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = 1000;
      let totalCardHeight = 420;
      activeExam.subjects.forEach(sub => {
        totalCardHeight += 70 + Math.ceil(sub.topics.length / 2) * 28;
      });
      totalCardHeight += activeExam.howToCompleteStrategy.length * 36;

      canvas.width = width;
      canvas.height = Math.max(750, totalCardHeight);

      // Background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGrad.addColorStop(0, '#0F172A');
      bgGrad.addColorStop(0.5, '#0A0E1A');
      bgGrad.addColorStop(1, '#020617');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Border glow
      ctx.strokeStyle = '#0284C7';
      ctx.lineWidth = 6;
      ctx.strokeRect(12, 12, canvas.width - 24, canvas.height - 24);

      // Header Banner
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(35, 35, canvas.width - 70, 125);

      // Category Pill
      ctx.fillStyle = '#0284C7';
      ctx.beginPath();
      if ('roundRect' in ctx) {
        (ctx as any).roundRect(50, 48, 200, 24, 6);
      } else {
        ctx.rect(50, 48, 200, 24);
      }
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(`CATEGORY: ${activeExam.category.toUpperCase()}`, 62, 64);

      // Title
      ctx.fillStyle = '#38BDF8';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(activeExam.name, 50, 105);

      ctx.fillStyle = '#94A3B8';
      ctx.font = '13px sans-serif';
      ctx.fillText(`Level: ${activeExam.level}  |  Pattern: ${activeExam.durationMarks}`, 50, 135);

      let curY = 190;

      // Selection Stages
      ctx.fillStyle = '#38BDF8';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText('SELECTION STAGES & EXAM ROUNDS:', 45, curY);
      curY += 25;

      activeExam.stages.forEach(stage => {
        ctx.fillStyle = '#22C55E';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText('✓ ', 50, curY);
        ctx.fillStyle = '#E2E8F0';
        ctx.font = '13px sans-serif';
        ctx.fillText(stage, 70, curY);
        curY += 24;
      });

      curY += 15;

      // Subjects
      ctx.fillStyle = '#38BDF8';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText('SUBJECT-WISE DETAILED SYLLABUS:', 45, curY);
      curY += 25;

      activeExam.subjects.forEach(sub => {
        const subHeight = 45 + Math.ceil(sub.topics.length / 2) * 26;

        ctx.fillStyle = '#1E293B';
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        ctx.beginPath();
        if ('roundRect' in ctx) {
          (ctx as any).roundRect(45, curY, canvas.width - 90, subHeight, 8);
        } else {
          ctx.rect(45, curY, canvas.width - 90, subHeight);
        }
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#F59E0B';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText(sub.name, 60, curY + 28);

        ctx.fillStyle = '#22C55E';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(sub.marks, canvas.width - 200, curY + 28);

        let tY = curY + 54;
        ctx.fillStyle = '#CBD5E1';
        ctx.font = '12px sans-serif';

        sub.topics.forEach((top, tIdx) => {
          const col = tIdx % 2;
          const xPos = col === 0 ? 65 : 500;
          if (col === 0 && tIdx > 0) tY += 24;
          ctx.fillText(`• ${top}`, xPos, tY);
        });

        curY += subHeight + 15;
      });

      curY += 10;

      // Strategy Box
      const stratBoxHeight = 40 + activeExam.howToCompleteStrategy.length * 28;
      ctx.fillStyle = '#064E3B';
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 1;
      ctx.beginPath();
      if ('roundRect' in ctx) {
        (ctx as any).roundRect(45, curY, canvas.width - 90, stratBoxHeight, 8);
      } else {
        ctx.rect(45, curY, canvas.width - 90, stratBoxHeight);
      }
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#34D399';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('FAST SYLLABUS COMPLETION STRATEGY:', 60, curY + 28);

      let sY = curY + 54;
      ctx.fillStyle = '#E2E8F0';
      ctx.font = '12px sans-serif';
      activeExam.howToCompleteStrategy.forEach(st => {
        ctx.fillText(`🎯 ${st}`, 65, sY);
        sY += 26;
      });

      // Footer
      ctx.fillStyle = '#64748B';
      ctx.font = '11px sans-serif';
      ctx.fillText(`HansAI Academic Companion • Syllabus Directory (${new Date().toLocaleDateString()})`, 45, canvas.height - 25);

      // Download
      const link = document.createElement('a');
      link.download = `${activeExam.name.replace(/[^a-zA-Z0-9]/g, '_')}_Syllabus_HansAI.png`;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast(`Syllabus image for ${activeExam.name} downloaded successfully! 🖼️`, 'success');
    } catch (err) {
      console.error('Image download error:', err);
      showToast('Error exporting syllabus image.', 'warn');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-[#0A0E1A] border border-slate-800 rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-fade-in text-slate-100">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#080C17] flex items-center justify-between gap-3 shrink-0">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-extrabold text-xs uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>All Exams Syllabus & Pattern Hub / संपूर्ण परीक्षा सिलेबस</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white">
              Sarkari Exam & Board Exam Syllabus Directory 📚
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all cursor-pointer border-none bg-transparent"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-3 sm:p-4 border-b border-slate-800/80 bg-[#0A0E1A] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search exam (e.g., CGL, 10th, Railway, Steno)..."
              className="w-full pl-9 pr-3 py-2 bg-[#03060E] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Exams' },
              { id: 'ssc', label: '🏛️ SSC' },
              { id: 'railway', label: '🚆 Railway' },
              { id: 'board', label: '🏫 10th & 12th Board' },
              { id: 'banking', label: '🏦 Banking' },
              { id: 'state', label: '🗺️ State PCS & Police' },
              { id: 'shorthand', label: '🎙️ Shorthand Steno' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shrink-0 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                    : 'bg-[#03060E] text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Main Content Area (Split View: Left Exam List, Right Detailed Syllabus) */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[420px]">
          
          {/* Left Column: Exam List (4 Cols) */}
          <div className="md:col-span-4 border-r border-slate-800 overflow-y-auto p-3 space-y-2 bg-[#050812]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-1 mb-1">
              Select Exam ({filteredExams.length})
            </span>
            {filteredExams.map(exam => (
              <button
                key={exam.id}
                onClick={() => setSelectedExamId(exam.id)}
                className={`w-full p-3 rounded-xl text-left transition-all border cursor-pointer flex flex-col gap-1 ${
                  activeExam.id === exam.id
                    ? 'bg-indigo-950/70 border-indigo-500/80 text-white shadow-lg'
                    : 'bg-[#0A0E1A] border-slate-800 text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold line-clamp-1">{exam.name}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-slate-300 font-mono shrink-0 uppercase">
                    {exam.category}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 line-clamp-1">{exam.level}</span>
              </button>
            ))}

            {filteredExams.length === 0 && (
              <div className="p-6 text-center text-xs text-slate-500">
                No exam found matching "{searchQuery}".
              </div>
            )}
          </div>

          {/* Right Column: Exam Syllabus Detail (8 Cols) */}
          <div className="md:col-span-8 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#0A0E1A]">
            {activeExam && (
              <>
                {/* Active Exam Title Header */}
                <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-950 border border-indigo-500/30 rounded-2xl p-4 space-y-2 shadow-lg">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-600/30 border border-indigo-500/50 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
                      {activeExam.category.toUpperCase()} • {activeExam.level}
                    </span>

                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <button
                        onClick={handleCopySyllabus}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition-all flex items-center gap-1 border-none cursor-pointer"
                        title="Copy Syllabus text"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </button>

                      <button
                        onClick={handleDownloadPDF}
                        className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1 border-none cursor-pointer shadow-sm"
                        title="Download Syllabus as PDF / Print"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>PDF Download</span>
                      </button>

                      <button
                        onClick={handleDownloadImage}
                        className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1 border-none cursor-pointer shadow-sm"
                        title="Download Syllabus as Image (PNG)"
                      >
                        <Image className="w-3.5 h-3.5" />
                        <span>Image Download</span>
                      </button>

                      <button
                        onClick={() => {
                          onOpenStudyPlannerWithExam(activeExam.name);
                          onClose();
                        }}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-lg transition-all flex items-center gap-1 border-none cursor-pointer shadow-md"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Plan Strategy</span>
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg sm:text-xl font-black text-white">
                    {activeExam.name}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-800/80 text-slate-300">
                    <div>
                      <span className="text-slate-400 font-bold">Exam Pattern:</span> {activeExam.durationMarks}
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold">Negative Marking:</span> {activeExam.negativeMarking}
                    </div>
                  </div>
                </div>

                {/* Exam Stages / Tiers */}
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4" />
                    <span>Stages & Exam Rounds / चरण:</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeExam.stages.map((stage, idx) => (
                      <span key={idx} className="px-3 py-1.5 rounded-xl bg-[#03060E] border border-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{stage}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Subject Wise Syllabus Topics Breakdown */}
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4" />
                    <span>Subject-Wise Detailed Topics / विषयवार पाठ्यक्रम:</span>
                  </h4>

                  <div className="space-y-3">
                    {activeExam.subjects.map((sub, idx) => (
                      <div key={idx} className="bg-[#050812] border border-slate-800 rounded-xl p-3.5 space-y-2">
                        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                          <span className="text-xs font-bold text-amber-300">{sub.name}</span>
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                            {sub.marks}
                          </span>
                        </div>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-300 pt-1 pl-1">
                          {sub.topics.map((t, tIdx) => (
                            <li key={tIdx} className="flex items-start gap-1.5">
                              <span className="text-indigo-400 text-xs">•</span>
                              <span>{t}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* How to Complete Syllabus Fast Strategy Roadmap */}
                <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-4 space-y-2 text-xs">
                  <h4 className="font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Target className="w-4 h-4" />
                    <span>Syllabus Complete Kaise Kare? (3-Phase Master Plan)</span>
                  </h4>
                  <div className="space-y-1.5 text-slate-300 pt-1">
                    {activeExam.howToCompleteStrategy.map((strat, sIdx) => (
                      <p key={sIdx} className="leading-relaxed bg-[#03060E] p-2 rounded-lg border border-slate-800/80">
                        {strat}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Direct Action Footer */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
                  <p className="text-[11px] text-slate-400">
                    Need AI teacher guidance on any specific topic from {activeExam.name}?
                  </p>

                  <button
                    onClick={() => {
                      onSelectSyllabusPrompt(`Explain the complete preparation roadmap and key formulas for ${activeExam.name} in simple Hindi.`);
                      onClose();
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 border-none cursor-pointer"
                  >
                    <span>Ask AI Teacher About This Exam</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
