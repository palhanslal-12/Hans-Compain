import React, { useState, useRef } from 'react';
import { 
  User, 
  Camera, 
  Upload, 
  Sparkles, 
  X, 
  Check, 
  CheckCircle2, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Trash2, 
  Award, 
  Target, 
  ShieldCheck, 
  RefreshCw 
} from 'lucide-react';

export interface UserProfileData {
  name: string;
  email: string;
  avatarUrl?: string;
  targetExam?: string;
  role?: string;
  phone?: string;
}

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfileData | null;
  onSaveProfile: (updatedData: { name: string; avatarUrl: string; targetExam: string }) => void;
  showToast: (msg: string, type?: 'info' | 'success' | 'warn' | 'error') => void;
  language?: string;
}

// 12 Curated Preset Avatars with High Reliability
const PRESET_AVATARS = [
  {
    id: 'avatar-1',
    label: 'Scholar Guy',
    url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    emoji: '👨‍🎓'
  },
  {
    id: 'avatar-2',
    label: 'Scholar Girl',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    emoji: '👩‍🎓'
  },
  {
    id: 'avatar-3',
    label: 'Civil Officer',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    emoji: '🏛️'
  },
  {
    id: 'avatar-4',
    label: 'Aspirant Leader',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    emoji: '🌟'
  },
  {
    id: 'avatar-5',
    label: 'Focused Researcher',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    emoji: '🔬'
  },
  {
    id: 'avatar-6',
    label: 'Creative Thinker',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    emoji: '💡'
  },
  {
    id: 'avatar-7',
    label: 'Steno Professional',
    url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
    emoji: '✍️'
  },
  {
    id: 'avatar-8',
    label: 'Speed Typist',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    emoji: '⌨️'
  },
  {
    id: 'avatar-9',
    label: 'Ranker Pro',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    emoji: '🏆'
  },
  {
    id: 'avatar-10',
    label: 'Disciplined Aspirant',
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    emoji: '🎯'
  },
  {
    id: 'avatar-11',
    label: 'Active Learner',
    url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
    emoji: '📖'
  },
  {
    id: 'avatar-12',
    label: 'Zen Mind',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    emoji: '🧘'
  }
];

const TARGET_EXAM_OPTIONS = [
  'SSC CGL / CHSL / MTS',
  'SSC Stenographer Grade C & D',
  'UPSC Civil Services / IAS',
  'Railway RRB NTPC & Group D',
  'State PSC (BPSC, UPPSC, MPPSC)',
  'Banking (IBPS PO, SBI PO & Clerk)',
  'Police SI & Constable',
  'Teaching & CTET / STET',
  'General Competitive Exams 2026'
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onSaveProfile,
  showToast,
  language = 'hindi'
}) => {
  const [name, setName] = useState(user?.name || 'Scholar Student');
  const [avatarUrl, setAvatarUrl] = useState(
    user?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200'
  );
  const [targetExam, setTargetExam] = useState(user?.targetExam || 'SSC Stenographer Grade C & D');
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [showUrlField, setShowUrlField] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state when modal opens or user prop changes
  React.useEffect(() => {
    if (isOpen) {
      setName(user?.name || 'Scholar Student');
      setAvatarUrl(user?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200');
      setTargetExam(user?.targetExam || 'SSC Stenographer Grade C & D');
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  // Handle local file upload from camera or device gallery
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast(language === 'hindi' ? '⚠️ फ़ोटो 5MB से छोटी होनी चाहिए।' : '⚠️ Photo must be under 5MB.', 'warn');
      return;
    }

    setIsProcessingImage(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        // Compress / resize image in canvas to maintain lightning fast load
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 300;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
            setAvatarUrl(compressedDataUrl);
            showToast(language === 'hindi' ? '📸 फ़ोटो सफलतापूर्वक अपलोड हुई!' : '📸 Photo uploaded successfully!', 'success');
          } else {
            setAvatarUrl(result);
          }
          setIsProcessingImage(false);
        };
        img.onerror = () => {
          setAvatarUrl(result);
          setIsProcessingImage(false);
        };
        img.src = result;
      } else {
        setIsProcessingImage(false);
      }
    };
    reader.onerror = () => {
      setIsProcessingImage(false);
      showToast(language === 'hindi' ? '❌ फ़ोटो पढ़ने में त्रुटि हुई।' : '❌ Failed to read photo.', 'error');
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCustomUrl = () => {
    if (!customUrlInput.trim()) return;
    setAvatarUrl(customUrlInput.trim());
    setCustomUrlInput('');
    setShowUrlField(false);
    showToast(language === 'hindi' ? '🔗 इमेज लिंक लागू कर दिया गया!' : '🔗 Image URL applied!', 'success');
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanName = name.trim() || 'Scholar Student';
    const cleanAvatar = avatarUrl.trim() || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200';
    
    onSaveProfile({
      name: cleanName,
      avatarUrl: cleanAvatar,
      targetExam: targetExam
    });

    showToast(
      language === 'hindi' 
        ? `✅ प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई: "${cleanName}"` 
        : `✅ Profile updated: "${cleanName}"`,
      'success'
    );
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in text-left font-sans"
      onClick={onClose}
    >
      <div 
        className="bg-[#0B1020] border-2 border-indigo-500/40 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-100 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
        id="user-profile-editor-modal"
      >
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-cyan-950 p-4 sm:p-5 border-b border-indigo-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center justify-center relative shadow-inner">
              <User className="w-5 h-5 text-amber-300" />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#0B1020] flex items-center justify-center text-[9px] font-bold">
                ✓
              </span>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-1.5">
                <span>{language === 'hindi' ? 'यूज़र प्रोफ़ाइल व फ़ोटो सेटिंग्स' : 'User Profile & Avatar Settings'}</span>
              </h2>
              <p className="text-xs text-slate-400">
                {language === 'hindi' ? 'अपना नाम, प्रोफ़ाइल फ़ोटो और लक्ष्य परीक्षा कस्टमाइज़ करें' : 'Set your name, custom photo avatar, and target exam'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer border border-slate-700"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
          
          {/* Live Preview Card */}
          <div className="bg-gradient-to-br from-[#0F172E] via-[#0E1528] to-[#0A0F1D] border border-indigo-500/30 rounded-2xl p-4 flex items-center gap-4 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-2xl rounded-full pointer-events-none" />

            {/* Avatar with Camera Overlay */}
            <div className="relative group shrink-0">
              <img 
                src={avatarUrl} 
                alt="Profile Preview" 
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-indigo-400/80 shadow-md transition-all group-hover:brightness-90"
                referrerPolicy="no-referrer"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-all cursor-pointer border-none"
                title="Change Photo"
              >
                <Camera className="w-5 h-5 text-amber-300" />
                <span className="text-[9px] font-bold mt-0.5">Upload</span>
              </button>
              {isProcessingImage && (
                <div className="absolute inset-0 rounded-2xl bg-black/70 flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-indigo-400 animate-spin" />
                </div>
              )}
            </div>

            {/* Live Name & Badge */}
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 w-max">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Student Aspirant</span>
                </span>
                {user?.email && (
                  <span className="text-[10px] text-slate-500 font-mono truncate hidden sm:inline">
                    {user.email}
                  </span>
                )}
              </div>

              <h3 className="text-base sm:text-lg font-black text-white truncate">
                {name || (language === 'hindi' ? 'अध्ययन विद्यार्थी' : 'Scholar Student')}
              </h3>

              <p className="text-xs text-indigo-300 font-semibold flex items-center gap-1 truncate">
                <Target className="w-3 h-3 text-indigo-400 shrink-0" />
                <span className="truncate">{targetExam}</span>
              </p>
            </div>
          </div>

          {/* Photo Actions Row (Upload / Link / Reset) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-indigo-400" />
                <span>{language === 'hindi' ? 'प्रोफ़ाइल फ़ोटो बदलें' : 'Profile Photo Options'}</span>
              </label>
              <span className="text-[10px] text-slate-400">JPG, PNG or GIF (Max 5MB)</span>
            </div>

            {/* Hidden File Input */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept="image/*" 
              className="hidden" 
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-98 shadow-sm"
              >
                <Upload className="w-3.5 h-3.5 text-indigo-400" />
                <span>{language === 'hindi' ? 'फ़ोटो अपलोड करें' : 'Upload Photo'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowUrlField(!showUrlField)}
                className="p-2.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-98"
              >
                <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span>{language === 'hindi' ? 'इमेज URL लिंक' : 'Paste Image URL'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAvatarUrl('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200');
                  showToast(language === 'hindi' ? 'मूल फ़ोटो पर रीसेट किया गया।' : 'Reset to default avatar.', 'info');
                }}
                className="p-2.5 bg-slate-800/60 hover:bg-rose-950/40 hover:border-rose-500/30 border border-slate-700 text-slate-400 hover:text-rose-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer col-span-2 sm:col-span-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{language === 'hindi' ? 'रीसेट करें' : 'Reset Default'}</span>
              </button>
            </div>

            {/* Custom URL Input Accordion */}
            {showUrlField && (
              <div className="p-3 bg-[#080D1A] border border-cyan-500/30 rounded-xl space-y-2 animate-fade-in">
                <span className="text-[10px] text-cyan-300 font-bold block">
                  {language === 'hindi' ? 'वेब से किसी इमेज का डायरेक्ट लिंक डालें:' : 'Paste direct image URL from web:'}
                </span>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    placeholder="https://example.com/my-photo.jpg"
                    className="flex-1 text-xs py-2 px-3 bg-[#050810] border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCustomUrl}
                    className="px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-lg transition-all cursor-pointer shrink-0"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Preset Avatars Grid */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{language === 'hindi' ? 'या तैयार अवतार चुनें (Preset Avatars)' : 'Or Choose Ready Avatar'}</span>
              </label>
              <span className="text-[10px] text-slate-500">{PRESET_AVATARS.length} styles</span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
              {PRESET_AVATARS.map((preset) => {
                const isSelected = avatarUrl === preset.url;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setAvatarUrl(preset.url);
                      showToast(language === 'hindi' ? `अवतार चुना गया: ${preset.label}` : `Selected: ${preset.label}`, 'info');
                    }}
                    className={`relative p-1 rounded-2xl border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      isSelected
                        ? 'bg-indigo-600/30 border-indigo-400 ring-2 ring-indigo-400 shadow-lg scale-105'
                        : 'bg-[#090D18] border-slate-800 hover:border-slate-600 hover:scale-102 opacity-80 hover:opacity-100'
                    }`}
                    title={preset.label}
                  >
                    <img 
                      src={preset.url} 
                      alt={preset.label} 
                      className="w-12 h-12 rounded-xl object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-[9px] font-bold text-slate-300 truncate max-w-full block px-0.5">
                      {preset.emoji} {preset.label.split(' ')[0]}
                    </span>
                    {isSelected && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 text-white rounded-full flex items-center justify-center text-[9px] font-black shadow">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Fields: Name & Target Exam */}
          <form onSubmit={handleSave} className="space-y-4 pt-2 border-t border-slate-800">
            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">
                {language === 'hindi' ? 'आपका पूरा नाम (Display Name)' : 'Your Full Name / Display Name'} <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder={language === 'hindi' ? "जैसे: हंसलाल पाल, अमन शर्मा..." : "e.g., Hanslal Pal, Rohan..."}
                  className="w-full text-xs sm:text-sm py-2.5 pl-9 pr-3.5 bg-[#070A12] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-bold transition-colors"
                  id="profile-name-input"
                />
                <User className="w-4 h-4 text-indigo-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* Target Exam Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">
                {language === 'hindi' ? 'लक्ष्य परीक्षा / विषय (Target Exam Specialization)' : 'Target Exam / Field of Study'}
              </label>
              <div className="relative">
                <select
                  value={targetExam}
                  onChange={(e) => setTargetExam(e.target.value)}
                  className="w-full text-xs sm:text-sm py-2.5 pl-9 pr-3.5 bg-[#070A12] border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:border-indigo-500 cursor-pointer"
                  id="profile-target-exam-select"
                >
                  {TARGET_EXAM_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <Target className="w-4 h-4 text-amber-400 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>
          </form>

        </div>

        {/* Modal Bottom Action Footer */}
        <div className="p-4 bg-[#0A0E1A] border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
          >
            {language === 'hindi' ? 'रद्द करें' : 'Cancel'}
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 via-indigo-650 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white rounded-xl text-xs font-black flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/30 cursor-pointer active:scale-95 border-none"
            id="save-user-profile-btn"
          >
            <Check className="w-4 h-4 text-emerald-300" />
            <span>{language === 'hindi' ? 'प्रोफ़ाइल सेव करें (Save Changes)' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
