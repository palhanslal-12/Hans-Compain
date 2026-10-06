import React, { useState } from 'react';
import {
  X,
  Settings,
  Globe,
  Target,
  Check,
  GraduationCap,
  Volume2,
  Bell,
  User,
  Palette,
  ShieldCheck,
  CheckCircle2,
  Mic
} from 'lucide-react';
import { auth, signInWithGoogle, logoutUser } from '../firebase';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetExam?: string;
  onSelectExam?: (exam: string) => void;
  language?: 'hindi' | 'english';
  onSelectLanguage?: (lang: 'hindi' | 'english') => void;
  activeColorMode?: string;
  onSelectColorMode?: (mode: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  targetExam = 'SSC & Steno 2026',
  onSelectExam,
  language = 'hindi',
  onSelectLanguage,
  activeColorMode = 'dark',
  onSelectColorMode
}) => {
  const [selectedBoard, setSelectedBoard] = useState<string>(
    () => localStorage.getItem('hans_board_pref') || 'BSEB Bihar Board'
  );
  const [selectedClass, setSelectedClass] = useState<string>(
    () => localStorage.getItem('hans_class_pref') || 'Class 10th & 12th'
  );
  const [voiceRate, setVoiceRate] = useState<string>(
    () => localStorage.getItem('hans_voice_rate') || '1.0x (Normal)'
  );
  const [notifEnabled, setNotifEnabled] = useState<boolean>(
    () => localStorage.getItem('hans_notif_enabled') !== 'false'
  );
  const [wakeWordEnabled, setWakeWordEnabled] = useState<boolean>(
    () => localStorage.getItem('hans_wake_word_enabled') !== 'false'
  );

  if (!isOpen) return null;

  const currentUser = auth.currentUser;

  const exams = [
    'SSC & Steno 2026',
    '10th & 12th Board (BSEB/UP/CBSE)',
    'Railway RRB NTPC & Group-D',
    'BPSC / UPPSC & State Police'
  ];

  const boards = [
    'BSEB Bihar Board',
    'UPMSP UP Board',
    'CBSE New Delhi',
    'JAC Jharkhand / Other State'
  ];

  const classes = [
    'Class 9th & 10th (Matric)',
    'Class 11th & 12th (Inter Science)',
    'Class 11th & 12th (Arts / Commerce)',
    'Graduate / Competitive Aspirant'
  ];

  const colorThemes = [
    { id: 'dark', name: 'Midnight Dark', icon: '🌙', desc: 'Deep Space Premium' },
    { id: 'blue_green_light', name: 'Blue-Green Light', icon: '🌊', desc: 'Sky Blue & Emerald Green' },
    { id: 'warm_yellow', name: 'Warm Yellow', icon: '☀️', desc: 'Eye-Care Reading Mode' },
    { id: 'eco_gray', name: 'Eco Slate Gray', icon: '🌿', desc: 'Slate Focus Theme' },
    { id: 'cyber_blue', name: 'Cyber Blue', icon: '💎', desc: 'High-Tech Neon Blue' }
  ];

  const handleSave = () => {
    localStorage.setItem('hans_board_pref', selectedBoard);
    localStorage.setItem('hans_class_pref', selectedClass);
    localStorage.setItem('hans_voice_rate', voiceRate);
    localStorage.setItem('hans_notif_enabled', String(notifEnabled));
    localStorage.setItem('hans_wake_word_enabled', String(wakeWordEnabled));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-[#091122] border-2 border-slate-800 rounded-3xl p-5 sm:p-7 max-w-lg w-full space-y-5 shadow-2xl text-white max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
          <div className="flex items-center gap-2.5 text-cyan-400 font-black text-base sm:text-lg">
            <Settings className="w-5 h-5 text-cyan-400" />
            <span>{language === 'hindi' ? 'ऐप सेटिंग्स व यूजर प्राथमिकताएं' : 'App Settings & User Preferences'}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-950 border border-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SECTION 1: System Language Toggle */}
        <div className="space-y-2 bg-[#040814] p-3.5 rounded-2xl border border-slate-850">
          <label className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 uppercase tracking-wide">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>1. {language === 'hindi' ? 'सिस्टम भाषा (System Language):' : 'System Language:'}</span>
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { id: 'hindi', label: '🇮🇳 हिन्दी (Hindi)' },
              { id: 'english', label: '🇬🇧 English' }
            ].map(l => (
              <button
                key={l.id}
                type="button"
                onClick={() => onSelectLanguage && onSelectLanguage(l.id as 'hindi' | 'english')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                  language === l.id
                    ? 'bg-cyan-500/20 border-cyan-400 text-white shadow'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>{l.label}</span>
                {language === l.id && <Check className="w-4 h-4 text-cyan-400" />}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 italic">
            * Note: Regardless of UI language, AI automatically responds in whichever language (Hindi/English/Hinglish) you type your query in!
          </p>
        </div>

        {/* SECTION 2: Color Theme Selection */}
        <div className="space-y-2 bg-[#040814] p-3.5 rounded-2xl border border-slate-850">
          <label className="text-xs font-bold text-emerald-300 flex items-center gap-1.5 uppercase tracking-wide">
            <Palette className="w-4 h-4 text-emerald-400" />
            <span>2. {language === 'hindi' ? 'स्क्रीन रंग थीम (Color Theme):' : 'Screen Theme Mode:'}</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {colorThemes.map(th => (
              <button
                key={th.id}
                type="button"
                onClick={() => onSelectColorMode && onSelectColorMode(th.id)}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                  activeColorMode === th.id
                    ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-900'
                }`}
              >
                <span className="text-lg">{th.icon}</span>
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">{th.name}</div>
                  <div className="text-[9px] text-slate-400 truncate">{th.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* SECTION 4: Audio Speed & Wake Word */}
        <div className="space-y-2.5 bg-[#040814] p-3.5 rounded-2xl border border-slate-850">
          <label className="text-xs font-bold text-indigo-300 flex items-center gap-1.5 uppercase tracking-wide">
            <Volume2 className="w-4 h-4 text-indigo-400" />
            <span>4. {language === 'hindi' ? 'ऑडियो गति व "ओके हंस" वॉयस:' : 'Audio Speed & Voice Wake-Word:'}</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['0.85x (Slow)', '1.0x (Normal)', '1.25x (Fast)'].map(v => (
              <button
                key={v}
                type="button"
                onClick={() => setVoiceRate(v)}
                className={`p-2 rounded-xl border text-[11px] font-bold cursor-pointer ${
                  voiceRate === v
                    ? 'bg-indigo-600/30 border-indigo-400 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Mic className="w-3.5 h-3.5 text-cyan-400" />
              <span>"ओके हंस" वेक-वर्ड डिटेक्शन</span>
            </span>
            <button
              type="button"
              onClick={() => setWakeWordEnabled(!wakeWordEnabled)}
              className={`px-3 py-1 rounded-xl text-[10px] font-black cursor-pointer border ${
                wakeWordEnabled
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                  : 'bg-slate-900 border-slate-700 text-slate-400'
              }`}
            >
              {wakeWordEnabled ? 'ON (सक्रिय)' : 'OFF (बंद)'}
            </button>
          </div>
        </div>

        {/* SECTION 5: Notifications & Account Status */}
        <div className="space-y-2.5 bg-[#040814] p-3.5 rounded-2xl border border-slate-850">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1.5 text-rose-300">
              <Bell className="w-4 h-4 text-rose-400" />
              <span>24h स्टडी अलर्ट व ई-मेल रिमाइंडर:</span>
            </span>
            <button
              type="button"
              onClick={() => setNotifEnabled(!notifEnabled)}
              className={`px-3 py-1 rounded-xl text-[10px] font-black cursor-pointer border ${
                notifEnabled
                  ? 'bg-rose-500/20 border-rose-400 text-rose-300'
                  : 'bg-slate-900 border-slate-700 text-slate-400'
              }`}
            >
              {notifEnabled ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300 min-w-0">
              <User className="w-4 h-4 text-cyan-400 shrink-0" />
              <div className="truncate">
                <div className="font-bold text-white text-[11px] truncate">
                  {currentUser ? currentUser.displayName || currentUser.email : 'Guest Student / HANS COMPAIN Core'}
                </div>
                <div className="text-[9px] text-slate-400 truncate">
                  {currentUser ? `UID: ${currentUser.uid.slice(0, 12)}...` : 'Not logged in (Cloud sync off)'}
                </div>
              </div>
            </div>

            {currentUser ? (
              <button
                type="button"
                onClick={() => logoutUser()}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-bold text-rose-400 cursor-pointer shrink-0"
              >
                Logout
              </button>
            ) : (
              <button
                type="button"
                onClick={() => signInWithGoogle(targetExam).catch(() => {})}
                className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-[10px] font-black text-white cursor-pointer shrink-0"
              >
                Google लॉगिन
              </button>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="w-full py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider cursor-pointer transition-all shadow-lg flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{language === 'hindi' ? 'सेटिंग्स व प्राथमिकताएं सुरक्षित करें' : 'Save All Preferences'}</span>
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;
