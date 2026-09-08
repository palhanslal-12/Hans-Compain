import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, BookOpen, CheckCircle2, ChevronRight, 
  Sparkles, Award, Star, Compass, Layers, ShieldCheck, X
} from 'lucide-react';

export interface StudentGoalProfile {
  stream: 'board' | 'competitive';
  boardDetails?: {
    classGrade: 'Class 9th' | 'Class 10th' | 'Class 11th' | 'Class 12th';
    boardName: 'CBSE' | 'UP_BOARD' | 'BIHAR_BOARD' | 'ALL_STATE_BOARDS';
    subStream?: 'science_pcm' | 'science_pcb' | 'commerce' | 'arts';
    primarySubject: string;
  };
  competitiveDetails?: {
    targetExam: 'ssc_steno' | 'ssc_cgl' | 'railway' | 'police' | 'bpsc' | 'banking';
    examName: string;
    medium: 'hindi' | 'english';
  };
  updatedAt: string;
}

interface StudentGoalOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveProfile: (profile: StudentGoalProfile) => void;
  initialProfile?: StudentGoalProfile | null;
  language?: 'hindi' | 'english';
}

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
  const [boardName, setBoardName] = useState<'CBSE' | 'UP_BOARD' | 'BIHAR_BOARD' | 'ALL_STATE_BOARDS'>('UP_BOARD');
  const [subStream, setSubStream] = useState<'science_pcm' | 'science_pcb' | 'commerce' | 'arts'>('science_pcm');
  const [primarySubject, setPrimarySubject] = useState<string>('Mathematics (गणित)');

  // Competitive states
  const [targetExam, setTargetExam] = useState<'ssc_steno' | 'ssc_cgl' | 'railway' | 'police' | 'bpsc' | 'banking'>('ssc_steno');
  const [medium, setMedium] = useState<'hindi' | 'english'>('hindi');

  // Load existing profile if provided
  useEffect(() => {
    if (initialProfile) {
      setStream(initialProfile.stream || 'board');
      if (initialProfile.boardDetails) {
        setClassGrade(initialProfile.boardDetails.classGrade || 'Class 10th');
        setBoardName(initialProfile.boardDetails.boardName || 'UP_BOARD');
        setSubStream(initialProfile.boardDetails.subStream || 'science_pcm');
        setPrimarySubject(initialProfile.boardDetails.primarySubject || 'Mathematics (गणित)');
      }
      if (initialProfile.competitiveDetails) {
        setTargetExam(initialProfile.competitiveDetails.targetExam || 'ssc_steno');
        setMedium(initialProfile.competitiveDetails.medium || 'hindi');
      }
    }
  }, [initialProfile]);

  if (!isOpen) return null;

  const competitiveExamOptions = [
    { id: 'ssc_steno', label: '✍️ SSC Stenographer (Grade C & D)', desc: 'डिक्टेशन, शॉर्टहैंड, रीज़निंग, सामान्य ज्ञान व इंग्लिश' },
    { id: 'ssc_cgl', label: '💼 SSC CGL / CHSL / MTS', desc: 'Tier-1 & Tier-2 सम्पूर्ण तैयारी' },
    { id: 'railway', label: '🚆 Railway RRB (NTPC & Group D)', desc: 'CBT 1 & 2 सामान्य विज्ञान, गणित व रीज़निंग' },
    { id: 'police', label: '👮 UP Police Constable / SI', desc: 'सामान्य हिंदी, सामान्य ज्ञान व कानून' },
    { id: 'bpsc', label: '🏛️ BPSC / State PCS', desc: 'GS Prelims, बिहार विशेष व करंट अफेयर्स' },
    { id: 'banking', label: '🏦 Banking (IBPS PO/Clerk, SBI)', desc: 'Quantitative Aptitude, Reasoning, Banking' }
  ];

  // Derive board subjects based on Class & Stream
  const getAvailableBoardSubjects = (): string[] => {
    if (classGrade === 'Class 9th' || classGrade === 'Class 10th') {
      return [
        'Mathematics (गणित)', 
        'Science (विज्ञान)', 
        'Social Science (सामाजिक विज्ञान)', 
        'Hindi (हिन्दी)', 
        'English (अंग्रेजी)'
      ];
    }
    if (subStream === 'science_pcm') {
      return ['Mathematics (गणित)', 'Physics (भौतिकी)', 'Chemistry (रसायन विज्ञान)', 'English'];
    }
    if (subStream === 'science_pcb') {
      return ['Biology (जीव विज्ञान)', 'Physics (भौतिकी)', 'Chemistry (रसायन विज्ञान)', 'English'];
    }
    if (subStream === 'commerce') {
      return ['Accountancy (लेखाशास्त्र)', 'Business Studies (व्यवसाय अध्ययन)', 'Economics (अर्थशास्त्र)', 'Mathematics'];
    }
    // Arts
    return ['History (इतिहास)', 'Political Science (राजनीति शास्त्र)', 'Geography (भूगोल)', 'Economics (अर्थशास्त्र)', 'Hindi'];
  };

  const handleSave = () => {
    const examMap: Record<string, string> = {
      ssc_steno: 'SSC Stenographer 2026',
      ssc_cgl: 'SSC CGL / CHSL',
      railway: 'Railway RRB NTPC',
      police: 'UP Police Constable',
      bpsc: 'BPSC Prelims',
      banking: 'IBPS / SBI Banking'
    };

    const profile: StudentGoalProfile = {
      stream,
      boardDetails: stream === 'board' ? {
        classGrade,
        boardName,
        subStream: (classGrade === 'Class 11th' || classGrade === 'Class 12th') ? subStream : undefined,
        primarySubject
      } : undefined,
      competitiveDetails: stream === 'competitive' ? {
        targetExam,
        examName: examMap[targetExam] || 'Competitive Exam',
        medium
      } : undefined,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem('hansai_student_goal_profile', JSON.stringify(profile));
    onSaveProfile(profile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-[#080D1A] border-2 border-indigo-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 text-left text-slate-100 scrollbar-thin">
        
        {/* Close button if user already had profile */}
        {initialProfile && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header */}
        <div className="text-center space-y-1.5 border-b border-slate-800 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-indigo-600 flex items-center justify-center text-2xl shadow-xl shadow-amber-500/20 mx-auto">
            🎯
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
            {isHindi ? 'विद्यार्थी लक्ष्य व स्ट्रीम की पुष्टि करें' : 'Confirm Your Stream & Target Exam'}
          </h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {isHindi
              ? 'कृपया अपनी कक्षा और स्ट्रीम चुनें ताकि आपकी पढ़ाई के अनुसार ही सही टेस्ट, PYQ और अध्ययन सामग्री उपलब्ध हो सके।'
              : 'Confirm your class, stream & target exam so relevant mock tests and materials are provided.'}
          </p>
        </div>

        {/* STEP 1: CHOOSE STREAM (BOARD VS COMPETITIVE) */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-indigo-300 tracking-wider flex items-center gap-1.5">
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
                  ? 'bg-amber-950/40 border-amber-500 text-white shadow-lg shadow-amber-950/40'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">🎓</span>
                {stream === 'board' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
              </div>
              <div>
                <div className="text-xs font-black text-white">
                  {isHindi ? 'बोर्ड परीक्षा' : 'Board Exam'}
                </div>
                <div className="text-[10px] text-slate-400">
                  9वीं, 10वीं, 11वीं, 12वीं (UP / Bihar / CBSE)
                </div>
              </div>
            </button>

            {/* Competitive Button */}
            <button
              type="button"
              onClick={() => setStream('competitive')}
              className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                stream === 'competitive'
                  ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-lg shadow-emerald-950/40'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">🏛️</span>
                {stream === 'competitive' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </div>
              <div>
                <div className="text-xs font-black text-white">
                  {isHindi ? 'प्रतियोगी परीक्षा' : 'Competitive Exam'}
                </div>
                <div className="text-[10px] text-slate-400">
                  SSC Steno, CGL, Railway, Police
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* STEP 2: STREAM SPECIFIC DETAILS */}
        {stream === 'board' ? (
          <div className="space-y-4 bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4">
            {/* Class Grade (9th, 10th, 11th, 12th) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
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
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
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
                <label className="text-xs font-bold text-slate-300">
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
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-md'
                          : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-black">{st.label}</div>
                      <div className="text-[10px] text-slate-400">{st.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Board Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                {isHindi ? 'बोर्ड (Board)' : 'Board'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {[
                  { id: 'UP_BOARD', label: 'UP Board' },
                  { id: 'BIHAR_BOARD', label: 'Bihar Board' },
                  { id: 'CBSE', label: 'CBSE' },
                  { id: 'ALL_STATE_BOARDS', label: 'State Board' }
                ].map(b => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBoardName(b.id as any)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold border text-center transition-all cursor-pointer ${
                      boardName === b.id
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                        : 'bg-slate-800/60 text-slate-400 border-slate-700'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Subject Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>{isHindi ? 'प्राथमिक विषय (Primary Subject)' : 'Primary Subject'}</span>
                <span className="text-[10px] text-amber-400 font-bold">✨ विषयवार टेस्ट उपलब्ध</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {getAvailableBoardSubjects().map(sub => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setPrimarySubject(sub)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-black border text-left truncate transition-all cursor-pointer ${
                      primarySubject === sub
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 border-amber-400 shadow-md font-extrabold'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4">
            {/* Target Competitive Exam */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                {isHindi ? 'लक्ष्य प्रतियोगी परीक्षा (Target Exam)' : 'Target Competitive Exam'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {competitiveExamOptions.map(exam => (
                  <button
                    key={exam.id}
                    type="button"
                    onClick={() => setTargetExam(exam.id as any)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      targetExam === exam.id
                        ? 'bg-emerald-950/60 border-emerald-400 text-white shadow-md'
                        : 'bg-slate-800/70 border-slate-700 text-slate-300 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-extrabold flex items-center justify-between">
                      <span>{exam.label}</span>
                      {targetExam === exam.id && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                      {exam.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Language Medium */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
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
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold shadow-md'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {m === 'hindi' ? 'हिंदी माध्यम (Hindi Medium)' : 'English Medium'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUBMIT BUTTON */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleSave}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 hover:from-indigo-500 hover:to-blue-500 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-indigo-950/60 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] transition-all"
          >
            <span>{isHindi ? 'कक्षा व लक्ष्य कन्फर्म करें' : 'Confirm Class & Stream'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
