import React, { useState } from 'react';
import { GraduationCap, CheckCircle2, X, Sparkles, ShieldCheck } from 'lucide-react';
import { StudentGoalProfile } from './StudentGoalOnboardingModal';

interface BoardSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile?: StudentGoalProfile | null;
  onSaveProfile: (profile: StudentGoalProfile) => void;
  language?: 'hindi' | 'english';
  showToast: (msg: string, type?: 'info' | 'success' | 'warn') => void;
}

export const BoardSelector: React.FC<BoardSelectorProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSaveProfile,
  language = 'hindi',
  showToast
}) => {
  const isHindi = language === 'hindi';

  const [selectedBoard, setSelectedBoard] = useState<'CBSE' | 'UP_BOARD' | 'BIHAR_BOARD' | 'ALL_STATE_BOARDS'>(
    currentProfile?.boardDetails?.boardName || 'UP_BOARD'
  );
  const [selectedClass, setSelectedClass] = useState<'Class 9th' | 'Class 10th' | 'Class 11th' | 'Class 12th'>(
    currentProfile?.boardDetails?.classGrade || 'Class 10th'
  );

  if (!isOpen) return null;

  const boardOptions = [
    {
      id: 'CBSE',
      nameHi: 'सीबीएसई (CBSE Board)',
      nameEn: 'CBSE (Central Board of Secondary Education)',
      descHi: 'राष्ट्रीय स्तर का पाठ्यक्रम, एनसीईआरटी बुक्स व कॉन्सेप्ट आधारित प्रश्न',
      descEn: 'National curriculum, NCERT textbooks & conceptual learning'
    },
    {
      id: 'UP_BOARD',
      nameHi: 'उत्तर प्रदेश बोर्ड (UP Board)',
      nameEn: 'UP Board (Uttar Pradesh Madhyamik Shiksha Parishad)',
      descHi: 'यूपी बोर्ड पाठ्यक्रम, प्रीवियस ईयर पेपर्स व विस्तृत उत्तर लेखन',
      descEn: 'UPMSP curriculum, previous year papers & descriptive answers'
    },
    {
      id: 'BIHAR_BOARD',
      nameHi: 'बिहार बोर्ड (BSEB - Bihar Board)',
      nameEn: 'BSEB (Bihar School Examination Board)',
      descHi: 'बिहार विद्यालय परीक्षा समिति पाठ्यक्रम, ऑब्जेक्टिव एवं सब्जेक्टिव तैयारी',
      descEn: 'BSEB syllabus, high-weightage objective & subjective practice'
    },
    {
      id: 'ALL_STATE_BOARDS',
      nameHi: 'अन्य राज्य बोर्ड (All State Boards / NCERT)',
      nameEn: 'All State Boards & NCERT Aligned',
      descHi: 'एनसीईआरटी आधारित सभी राज्यों के बोर्ड छात्र',
      descEn: 'Universal NCERT aligned board curriculum'
    }
  ];

  const handleSave = () => {
    const updatedProfile: StudentGoalProfile = {
      stream: 'board',
      boardDetails: {
        classGrade: selectedClass,
        boardName: selectedBoard,
        subStream: currentProfile?.boardDetails?.subStream || 'science_pcm',
        primarySubject: currentProfile?.boardDetails?.primarySubject || 'Mathematics (गणित)'
      },
      updatedAt: new Date().toISOString()
    };

    onSaveProfile(updatedProfile);
    showToast(isHindi ? `बोर्ड सफलतापूर्वक अपडेट हुआ: ${selectedBoard}` : `Board successfully updated to ${selectedBoard}`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-[#0a0f1d] border-2 border-amber-500/50 rounded-3xl p-6 shadow-2xl space-y-5 text-left relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-xl shadow-lg shadow-amber-500/30 shrink-0 font-bold">
            🎓
          </div>
          <div>
            <h3 className="text-lg font-black text-white tracking-tight">
              {isHindi ? 'अपना शिक्षा बोर्ड चुनें (Board Selector)' : 'Select Your Education Board'}
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              {isHindi ? 'बोर्ड के अनुसार सिलेबस, ब्लूप्रिंट व महत्वपूर्ण प्रश्न स्वतः फिल्टर होंगे' : 'Dynamic syllabus filtering based on your selected board'}
            </p>
          </div>
        </div>

        {/* Class Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 block">
            {isHindi ? 'कक्षा चुनें (Class Grade):' : 'Select Class:'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['Class 9th', 'Class 10th', 'Class 11th', 'Class 12th'] as const).map((cls) => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className={`py-2 px-3 rounded-xl font-black text-xs transition-all cursor-pointer border ${
                  selectedClass === cls
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md scale-[1.02]'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>

        {/* Board Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 block">
            {isHindi ? 'बोर्ड चुनें (Select Board):' : 'Select Board:'}
          </label>
          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {boardOptions.map((board) => {
              const isSelected = selectedBoard === board.id;
              return (
                <div
                  key={board.id}
                  onClick={() => setSelectedBoard(board.id as any)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500 shadow-lg shadow-amber-500/10'
                      : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="text-xs font-black text-white flex items-center gap-2">
                      <span>{isHindi ? board.nameHi : board.nameEn}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />}
                    </div>
                    <div className="text-[11px] text-slate-400 leading-tight">
                      {isHindi ? board.descHi : board.descEn}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold cursor-pointer transition-all border border-slate-800"
          >
            {isHindi ? 'रद्द करें' : 'Cancel'}
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 cursor-pointer transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isHindi ? 'बोर्ड सेव करें (Save Board)' : 'Save Board Selection'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
