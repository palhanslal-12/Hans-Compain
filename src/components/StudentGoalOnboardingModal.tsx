import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, BookOpen, CheckCircle2, ChevronRight, 
  Sparkles, Award, Star, Compass, Layers, ShieldCheck, X, Search, Zap, Swords, FileText
} from 'lucide-react';

export interface StudentGoalProfile {
  stream: 'board' | 'competitive';
  boardDetails?: {
    classGrade: 'Class 9th' | 'Class 10th' | 'Class 11th' | 'Class 12th';
    boardName: 'CBSE' | 'ICSE' | 'UP_BOARD' | 'BIHAR_BOARD' | 'ALL_STATE_BOARDS';
    specificStateBoard?: string;
    subStream?: 'science_pcm' | 'science_pcb' | 'commerce' | 'arts';
    primarySubject: string;
  };
  competitiveDetails?: {
    targetExam: string;
    examName: string;
    medium: 'hindi' | 'english';
  };
  selectedMode?: 'quiz' | 'battle' | 'board_mock';
  updatedAt: string;
}

interface StudentGoalOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveProfile: (profile: StudentGoalProfile) => void;
  initialProfile?: StudentGoalProfile | null;
  language?: 'hindi' | 'english';
}

const INDIAN_STATE_BOARDS = [
  { id: 'UP', name: 'Uttar Pradesh Board (UPMSP)' },
  { id: 'BIHAR', name: 'Bihar School Examination Board (BSEB)' },
  { id: 'MP', name: 'Madhya Pradesh Board (MPBSE)' },
  { id: 'RAJASTHAN', name: 'Rajasthan Board of Secondary Education (RBSE)' },
  { id: 'MAHARASHTRA', name: 'Maharashtra State Board (MSBSHSE)' },
  { id: 'HARYANA', name: 'Haryana Board of School Education (BSEH)' },
  { id: 'GUJARAT', name: 'Gujarat Secondary & Higher Education Board (GSEB)' },
  { id: 'PUNJAB', name: 'Punjab School Education Board (PSEB)' },
  { id: 'JHARKHAND', name: 'Jharkhand Academic Council (JAC)' },
  { id: 'CHHATTISGARH', name: 'Chhattisgarh Board of Secondary Education (CGBSE)' },
  { id: 'HIMACHAL', name: 'Himachal Pradesh Board (HPBOSE)' },
  { id: 'UTTARAKHAND', name: 'Uttarakhand Board of School Education (UBSE)' },
  { id: 'WEST_BENGAL', name: 'West Bengal Board of Secondary Education (WBBSE)' },
  { id: 'ODISHA', name: 'Board of Secondary Education Odisha (BSE)' },
  { id: 'KARNATAKA', name: 'Karnataka School Examination and Assessment Board' },
  { id: 'TAMIL_NADU', name: 'Directorate of Government Examinations Tamil Nadu (TNBSE)' }
];

export const StudentGoalOnboardingModal: React.FC<StudentGoalOnboardingModalProps> = ({
  isOpen,
  onClose,
  onSaveProfile,
  initialProfile,
  language = 'hindi'
}) => {
  const isHindi = language === 'hindi';

  const [stream, setStream] = useState<'board' | 'competitive'>('board');
  
  // Board states
  const [classGrade, setClassGrade] = useState<'Class 9th' | 'Class 10th' | 'Class 11th' | 'Class 12th'>('Class 10th');
  const [boardName, setBoardName] = useState<'CBSE' | 'ICSE' | 'UP_BOARD' | 'BIHAR_BOARD' | 'ALL_STATE_BOARDS'>('UP_BOARD');
  const [specificStateBoard, setSpecificStateBoard] = useState<string>('Uttar Pradesh Board (UPMSP)');
  const [boardSearchQuery, setBoardSearchQuery] = useState<string>('');
  const [subStream, setSubStream] = useState<'science_pcm' | 'science_pcb' | 'commerce' | 'arts'>('science_pcm');
  const [primarySubject, setPrimarySubject] = useState<string>('Mathematics (गणित)');

  // Mode Selector State
  const [selectedMode, setSelectedMode] = useState<'quiz' | 'battle' | 'board_mock'>('quiz');

  // Competitive states
  const [targetExam, setTargetExam] = useState<string>('neet');
  const [medium, setMedium] = useState<'hindi' | 'english'>('hindi');

  // Load existing profile if provided
  useEffect(() => {
    if (initialProfile) {
      setStream(initialProfile.stream || 'board');
      if (initialProfile.boardDetails) {
        setClassGrade(initialProfile.boardDetails.classGrade || 'Class 10th');
        setBoardName(initialProfile.boardDetails.boardName || 'UP_BOARD');
        setSpecificStateBoard(initialProfile.boardDetails.specificStateBoard || 'Uttar Pradesh Board (UPMSP)');
        setSubStream(initialProfile.boardDetails.subStream || 'science_pcm');
        setPrimarySubject(initialProfile.boardDetails.primarySubject || 'Mathematics (गणित)');
      }
      if (initialProfile.competitiveDetails) {
        setTargetExam(initialProfile.competitiveDetails.targetExam || 'neet');
        setMedium(initialProfile.competitiveDetails.medium || 'hindi');
      }
      if (initialProfile.selectedMode) {
        setSelectedMode(initialProfile.selectedMode);
      }
    }
  }, [initialProfile]);

  if (!isOpen) return null;

  // Dynamic Competitive Exam Mapping based on Sub-Stream
  const getMappedCompetitiveOptions = () => {
    if (subStream === 'science_pcb') {
      return [
        { id: 'neet', label: '🩺 NEET UG (Medical Entrance)', desc: 'Physics, Chemistry & Biology (NCERT Based)' },
        { id: 'nursing', label: '💉 Nursing Entrance (AIIMS / State BSc Nursing)', desc: 'General Nursing & Science Aptitude' }
      ];
    } else if (subStream === 'science_pcm') {
      return [
        { id: 'jee_main', label: '🚀 JEE Main / Advanced', desc: 'Physics, Chemistry & Mathematics' },
        { id: 'nda', label: '🎖️ NDA & Naval Academy', desc: 'Mathematics, General Ability Test (GAT)' }
      ];
    } else if (subStream === 'arts') {
      return [
        { id: 'cuet', label: '🎯 CUET (UG) Central Universities', desc: 'Domain Subjects, General Test & Language' },
        { id: 'ssc_cgl', label: '💼 SSC CGL / CHSL / MTS', desc: 'General Awareness, Reasoning & English' }
      ];
    } else {
      return [
        { id: 'ssc_steno', label: '✍️ SSC Stenographer (Grade C & D)', desc: 'डिक्टेशन, शॉर्टहैंड, रीज़निंग, सामान्य ज्ञान व इंग्लिश' },
        { id: 'cuet', label: '🎯 CUET (UG)', desc: 'Central University Entrance Test' },
        { id: 'railway', label: '🚆 Railway RRB (NTPC & Group D)', desc: 'CBT 1 & 2 सामान्य विज्ञान, गणित व रीज़निंग' }
      ];
    }
  };

  // Derive board subjects based on Class & Stream
  const getAvailableBoardSubjects = (): string[] => {
    if (classGrade === 'Class 9th' || classGrade === 'Class 10th') {
      return [
        'Science (विज्ञान - भौतिकी, रसायन, जीव)', 
        'Mathematics (गणित)', 
        'Social Science (सामाजिक विज्ञान)', 
        'Hindi (हिन्दी)', 
        'English (अंग्रेजी)',
        'Sanskrit (संस्कृत)'
      ];
    }
    if (subStream === 'science_pcm') {
      return ['Mathematics (गणित)', 'Physics (भौतिक विज्ञान)', 'Chemistry (रसायन विज्ञान)', 'Computer Science / IP', 'English', 'Hindi'];
    }
    if (subStream === 'science_pcb') {
      return ['Biology (जीव विज्ञान - वनस्पति एवं जंतु)', 'Physics (भौतिक विज्ञान)', 'Chemistry (रसायन विज्ञान)', 'English', 'Hindi'];
    }
    if (subStream === 'commerce') {
      return ['Accountancy (लेखाशास्त्र)', 'Business Studies (व्यवसाय अध्ययन)', 'Economics (अर्थशास्त्र)', 'Entrepreneurship (उद्यमिता)', 'Mathematics (गणित)', 'English'];
    }
    // Arts / Humanities
    return [
      'Political Science (राजनीति विज्ञान)', 
      'History (इतिहास)', 
      'Geography (भूगोल)', 
      'Economics (अर्थशास्त्र)', 
      'Sociology / Psychology (समाजशास्त्र / मनोविज्ञान)', 
      'Hindi (हिन्दी)', 
      'English (अंग्रेजी)'
    ];
  };

  const handleSave = () => {
    const examMap: Record<string, string> = {
      neet: 'NEET UG Medical 2026',
      nursing: 'Nursing Entrance (BSc Nursing)',
      jee_main: 'JEE Main 2026',
      nda: 'NDA Entrance',
      cuet: 'CUET (UG)',
      ssc_cgl: 'SSC CGL / CHSL',
      ssc_steno: 'SSC Stenographer 2026',
      railway: 'Railway RRB NTPC'
    };

    const profile: StudentGoalProfile = {
      stream,
      boardDetails: stream === 'board' ? {
        classGrade,
        boardName,
        specificStateBoard: boardName === 'ALL_STATE_BOARDS' ? specificStateBoard : undefined,
        subStream: (classGrade === 'Class 11th' || classGrade === 'Class 12th') ? subStream : undefined,
        primarySubject
      } : undefined,
      competitiveDetails: stream === 'competitive' ? {
        targetExam,
        examName: examMap[targetExam] || 'Competitive Exam',
        medium
      } : undefined,
      selectedMode,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem('hansai_student_goal_profile', JSON.stringify(profile));
    onSaveProfile(profile);
    onClose();
  };

  const filteredStateBoards = INDIAN_STATE_BOARDS.filter(b => 
    b.name.toLowerCase().includes(boardSearchQuery.toLowerCase()) ||
    b.id.toLowerCase().includes(boardSearchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 text-left text-slate-800 scrollbar-thin">
        
        {/* Close button if user already had profile */}
        {initialProfile && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header */}
        <div className="text-center space-y-1.5 border-b border-slate-100 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-2xl shadow-lg shadow-blue-500/20 mx-auto text-white font-bold">
            🎯
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            {isHindi ? 'विद्यार्थी लक्ष्य व मोड सेटअप' : 'Student Goal & Mode Setup'}
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {isHindi
              ? 'अपना बोर्ड, स्ट्रीम और परीक्षा मोड चुनें ताकि आपके अनुसार ही सबसे बेहतरीन शिक्षण सामग्री उपलब्ध हो सके।'
              : 'Configure your board, stream and preferred test mode for personalized learning.'}
          </p>
        </div>

        {/* 3 Easy Steps Guide (Moved to Login/Setup modal as requested) */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3 space-y-2">
          <div className="text-[11px] font-black text-amber-800 uppercase tracking-wide flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{isHindi ? "📚 टेस्ट गाइड: परीक्षा की तैयारी कैसे करें? (3 Easy Steps)" : "📚 Test Guide: 3 Easy Steps"}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-left">
            <div className="bg-white/80 p-2 rounded-xl border border-amber-200">
              <div className="text-[10px] font-black text-amber-700 flex items-center gap-1">
                <span className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-[9px]">1</span>
                <span>{isHindi ? "लक्ष्य चुनें" : "Select"}</span>
              </div>
              <p className="text-[9px] text-slate-600 mt-0.5 leading-tight">
                {isHindi ? "अपना बोर्ड व विषय चुनें।" : "Choose board & subject."}
              </p>
            </div>
            <div className="bg-white/80 p-2 rounded-xl border border-amber-200">
              <div className="text-[10px] font-black text-sky-700 flex items-center gap-1">
                <span className="w-4 h-4 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-[9px]">2</span>
                <span>{isHindi ? "हल करें" : "Attempt"}</span>
              </div>
              <p className="text-[9px] text-slate-600 mt-0.5 leading-tight">
                {isHindi ? "समय सीमा में टेस्ट दें।" : "Solve with timers."}
              </p>
            </div>
            <div className="bg-white/80 p-2 rounded-xl border border-amber-200">
              <div className="text-[10px] font-black text-cyan-700 flex items-center gap-1">
                <span className="w-4 h-4 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold text-[9px]">3</span>
                <span>{isHindi ? "सुधारें" : "Master"}</span>
              </div>
              <p className="text-[9px] text-slate-600 mt-0.5 leading-tight">
                {isHindi ? "गलतियाँ डायरी में सुधारें।" : "Review mistakes."}
              </p>
            </div>
          </div>
        </div>

        {/* STEP 1: CHOOSE STREAM (BOARD VS COMPETITIVE) */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-blue-600 tracking-wider flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" />
            <span>{isHindi ? '1. परीक्षा श्रेणी (Category)' : '1. Examination Category'}</span>
          </label>

          <div className="grid grid-cols-2 gap-3">
            {/* Board Button */}
            <button
              type="button"
              onClick={() => setStream('board')}
              className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                stream === 'board'
                  ? 'bg-blue-50/80 border-blue-600 text-slate-900 shadow-md shadow-blue-500/10'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">🎓</span>
                {stream === 'board' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
              </div>
              <div>
                <div className="text-xs font-black text-slate-900">
                  {isHindi ? 'बोर्ड परीक्षा' : 'Board Exam'}
                </div>
                <div className="text-[10px] text-slate-500">
                  9वीं से 12वीं (CBSE / ICSE / State Boards)
                </div>
              </div>
            </button>

            {/* Competitive Button */}
            <button
              type="button"
              onClick={() => setStream('competitive')}
              className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                stream === 'competitive'
                  ? 'bg-blue-50/80 border-blue-600 text-slate-900 shadow-md shadow-blue-500/10'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">🏛️</span>
                {stream === 'competitive' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
              </div>
              <div>
                <div className="text-xs font-black text-slate-900">
                  {isHindi ? 'प्रतियोगी परीक्षा' : 'Competitive Exam'}
                </div>
                <div className="text-[10px] text-slate-500">
                  NEET, JEE, Nursing, CUET, SSC, NDA
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* STEP 2: STREAM SPECIFIC DETAILS */}
        {stream === 'board' ? (
          <div className="space-y-4 bg-slate-50 border border-slate-200 rounded-2xl p-4">
            {/* Class Grade (9th, 10th, 11th, 12th) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                {isHindi ? 'कक्षा (Class)' : 'Class'}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['Class 9th', 'Class 10th', 'Class 11th', 'Class 12th'] as const).map(cls => (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => {
                      setClassGrade(cls);
                      setPrimarySubject(cls.includes('12') || cls.includes('11') ? 'Physics (भौतिकी)' : 'Mathematics (गणित)');
                    }}
                    className={`py-2 px-2 rounded-xl text-xs font-black border text-center transition-all cursor-pointer ${
                      classGrade === cls
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cls.replace('Class ', '')}
                  </button>
                ))}
              </div>
            </div>

            {/* For 11th & 12th: Stream Selection (PCM, PCB, Commerce, Arts) */}
            {(classGrade === 'Class 11th' || classGrade === 'Class 12th') && (
              <div className="space-y-1.5 animate-fade-in">
                <label className="text-xs font-bold text-slate-700">
                  {isHindi ? 'स्ट्रीम (Stream)' : 'Senior Secondary Stream'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'science_pcm', label: '🧪 Science (PCM)', desc: 'Maths, Physics, Chem' },
                    { id: 'science_pcb', label: '🧬 Science (PCB)', desc: 'Biology, Physics, Chem' },
                    { id: 'commerce', label: '📊 Commerce', desc: 'Accounts, Business, Eco' },
                    { id: 'arts', label: '🎨 Arts / Humanities', desc: 'History, Pol Sci, Geo' },
                  ].map(st => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => {
                        setSubStream(st.id as any);
                        if (st.id === 'science_pcm') setPrimarySubject('Mathematics (गणित)');
                        else if (st.id === 'science_pcb') setPrimarySubject('Biology (जीव विज्ञान)');
                        else if (st.id === 'commerce') setPrimarySubject('Accountancy (लेखाशास्त्र)');
                        else setPrimarySubject('History (इतिहास)');
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        subStream === st.id
                          ? 'bg-blue-50 text-blue-800 border-blue-500 shadow-sm font-bold'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="text-xs font-black">{st.label}</div>
                      <div className="text-[10px] text-slate-500">{st.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Board Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                {isHindi ? 'बोर्ड (Board)' : 'Board'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'CBSE', label: 'CBSE' },
                  { id: 'ALL_STATE_BOARDS', label: 'All State Boards (सारे स्टेट बोर्ड)' },
                  { id: 'ICSE', label: 'ICSE' }
                ].map(b => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBoardName(b.id as any)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                      boardName === b.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Searchable State Boards Dropdown if 'State Board' (ALL_STATE_BOARDS) is selected */}
            {boardName === 'ALL_STATE_BOARDS' && (
              <div className="space-y-2 animate-fade-in bg-white p-3 rounded-xl border border-slate-200">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>{isHindi ? 'सभी भारतीय स्टेट बोर्ड चुनें (Search State Board)' : 'Select State Board'}</span>
                  <span className="text-[10px] text-blue-600 font-bold">{filteredStateBoards.length} Boards</span>
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={boardSearchQuery}
                    onChange={(e) => setBoardSearchQuery(e.target.value)}
                    placeholder={isHindi ? "बोर्ड का नाम खोजें (उदा. MP, Rajasthan, Maharashtra...)" : "Search state board..."}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
                  {filteredStateBoards.map(sb => (
                    <button
                      key={sb.id}
                      type="button"
                      onClick={() => setSpecificStateBoard(sb.name)}
                      className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center justify-between ${
                        specificStateBoard === sb.name
                          ? 'bg-blue-600 text-white font-bold'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>{sb.name}</span>
                      {specificStateBoard === sb.name && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Primary Subject Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>{isHindi ? 'प्राथमिक विषय (Primary Subject)' : 'Primary Subject'}</span>
                <span className="text-[10px] text-blue-600 font-bold">✨ विषयवार टेस्ट उपलब्ध</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {getAvailableBoardSubjects().map(sub => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setPrimarySubject(sub)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-black border text-left truncate transition-all cursor-pointer ${
                      primarySubject === sub
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm font-extrabold'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 bg-slate-50 border border-slate-200 rounded-2xl p-4">
            {/* Stream Selector for Competitive to drive Dynamic Mappings */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                {isHindi ? 'स्ट्रीम / स्ट्रीम स्ट्रीम चुनें (Select Stream for Exam Mapping)' : 'Select Stream for Exam Mapping'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'science_pcb', label: '🧬 Science (PCB)' },
                  { id: 'science_pcm', label: '🚀 Science (PCM)' },
                  { id: 'arts', label: '🎨 Arts / Humanities' },
                  { id: 'commerce', label: '📊 Commerce' }
                ].map(st => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => {
                      setSubStream(st.id as any);
                      if (st.id === 'science_pcb') setTargetExam('neet');
                      else if (st.id === 'science_pcm') setTargetExam('jee_main');
                      else setTargetExam('cuet');
                    }}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold border text-left transition-all cursor-pointer ${
                      subStream === st.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Competitive Exam (Mapped dynamically based on stream selection) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                {isHindi ? 'लक्ष्य प्रतियोगी परीक्षा (Target Exam)' : 'Target Competitive Exam'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {getMappedCompetitiveOptions().map(exam => (
                  <button
                    key={exam.id}
                    type="button"
                    onClick={() => setTargetExam(exam.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      targetExam === exam.id
                        ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-sm font-bold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs font-extrabold flex items-center justify-between">
                      <span>{exam.label}</span>
                      {targetExam === exam.id && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 truncate">
                      {exam.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Language Medium */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                {isHindi ? 'अध्ययन माध्यम (Medium)' : 'Study Medium'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['hindi', 'english'] as const).map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMedium(m)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      medium === m
                        ? 'bg-blue-600 text-white border-blue-600 font-extrabold shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    {m === 'hindi' ? 'हिंदी माध्यम (Hindi Medium)' : 'English Medium'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: SELECT MODE SECTION */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-blue-600 tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            <span>{isHindi ? '2. परीक्षा मोड चुनें (Select Test Mode)' : '2. Select Test Mode'}</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              {
                id: 'quiz',
                icon: '⚡',
                title: isHindi ? 'क्विज़ मोड' : 'Quiz Mode',
                desc: isHindi ? 'अभ्यास व तुरंत स्पष्टीकरण' : 'Practice & Instant Explanation'
              },
              {
                id: 'battle',
                icon: '⚔️',
                title: isHindi ? 'बैटल मोड' : 'Battle Mode',
                desc: isHindi ? 'लाइव 1v1 टाइमड चैलेंज' : 'Live 1v1 Timed Challenge'
              },
              {
                id: 'board_mock',
                icon: '📋',
                title: isHindi ? 'बोर्ड मॉक टेस्ट' : 'Board Mock Test',
                desc: isHindi ? 'पूर्ण सिलेबस टाइमड परीक्षा' : 'Full Syllabus Timed Exam'
              }
            ].map(mode => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setSelectedMode(mode.id as any)}
                className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between space-y-1.5 ${
                  selectedMode === mode.id
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">{mode.icon}</span>
                  {selectedMode === mode.id && <CheckCircle2 className="w-4 h-4 text-white" />}
                </div>
                <div>
                  <div className="text-xs font-black">{mode.title}</div>
                  <div className={`text-[10px] ${selectedMode === mode.id ? 'text-blue-100' : 'text-slate-500'}`}>{mode.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleSave}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] transition-all"
          >
            <span>{isHindi ? 'कक्षा, बोर्ड व मोड कन्फर्म करें' : 'Confirm Goal & Mode Setup'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
