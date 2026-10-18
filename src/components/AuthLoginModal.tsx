import React, { useState } from 'react';
import { X, Lock, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';
import { signInWithGoogle } from '../firebase';
import { HansCompainLogo } from './HansCompainLogo';

interface AuthLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  onSuccess?: () => void;
}

export const AuthLoginModal: React.FC<AuthLoginModalProps> = ({
  isOpen,
  onClose,
  title = 'रजिस्ट्रेशन / लॉगिन आवश्यक है (Registration Required)',
  description = 'आपने 2 मुफ़्त ट्रायल प्रश्न उपयोग कर लिए हैं। आगे असीमित AI चैट और लाइव डाउट सॉल्विंग के लिए कृपया अपना निःशुल्क अकाउंट बनाएं या लॉगिन करें।',
  onSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await signInWithGoogle('All Exams & Board 2026');
      setLoading(false);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setLoading(false);
      setErrorMsg('लॉगिन विफल रहा या विंडो बंद कर दी गई। कृपया दोबारा प्रयास करें।');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-[#091122] border-2 border-cyan-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl relative text-white text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-950 border border-slate-800 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Center Logo */}
        <div className="flex justify-center pt-2">
          <HansCompainLogo variant="center" className="w-14 h-14" />
        </div>

        {/* Lock Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-black">
          <Lock className="w-3.5 h-3.5" />
          <span>निःशुल्क ट्रायल सीमा (2/2 प्रश्न समाप्त)</span>
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h3 className="text-base sm:text-lg font-black text-white">
            {title}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Benefits Box */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-850 text-left space-y-2 text-xs">
          <div className="font-bold text-cyan-300 flex items-center gap-1.5 text-[11px] uppercase tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>रजिस्ट्रेशन के बाद क्या मिलेगा?</span>
          </div>
          <div className="space-y-1.5 text-slate-300 text-[11px]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>असीमित AI चैट और 24×7 डाउट समाधान</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>10वीं/12वीं बोर्ड व SSC/स्टेनो परीक्षा टेस्ट सीरीज</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>ऑनलाइन क्लास नोट्स और स्टडी पीडीएफ डाउनलोड</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>क्लाउड डेटा सिंक और अध्ययन रिपोर्ट</span>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold">
            {errorMsg}
          </div>
        )}

        {/* 1-Click Google Sign In Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-98 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-3 cursor-pointer shadow-xl transition-all disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#FFFFFF"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#FFFFFF"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FFFFFF"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#FFFFFF"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{loading ? 'लॉगिन हो रहा है...' : 'Google से 1-क्लिक में लॉगिन / रजिस्टर करें'}</span>
        </button>

        <div className="text-[10px] text-slate-500">
          100% सुरक्षित • आपका डेटा निजी रहेगा • पासवर्ड याद रखने की जरूरत नहीं
        </div>

      </div>
    </div>
  );
};

export default AuthLoginModal;
