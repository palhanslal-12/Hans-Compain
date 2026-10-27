import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  FileText,
  HelpCircle,
  KeyRound,
  GraduationCap
} from 'lucide-react';
import {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  resetPasswordWithEmail
} from '../firebase';
import { HansCompainLogo } from './HansCompainLogo';
import { TermsAndPrivacyModal } from './TermsAndPrivacyModal';

interface AuthLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  onSuccess?: () => void;
  defaultMode?: 'login' | 'register' | 'forgot';
}

export const AuthLoginModal: React.FC<AuthLoginModalProps> = ({
  isOpen,
  onClose,
  title = 'छात्र अकाउंट लॉगिन / रजिस्ट्रेशन',
  description = 'असीमित AI चैट, 24×7 डाउट समाधान, नोट्स और मॉक टेस्ट के लिए अपने अकाउंट में प्रवेश करें।',
  onSuccess,
  defaultMode = 'login'
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(defaultMode);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [targetExam, setTargetExam] = useState('SSC & Steno 2026');

  // UI helpers
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Terms modal state
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [termsModalTab, setTermsModalTab] = useState<'terms' | 'privacy'>('terms');

  if (!isOpen) return null;

  const resetFormState = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleSwitchMode = (newMode: 'login' | 'register' | 'forgot') => {
    resetFormState();
    setMode(newMode);
  };

  const openTerms = (tab: 'terms' | 'privacy') => {
    setTermsModalTab(tab);
    setIsTermsModalOpen(true);
  };

  // Sign In Handler
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim()) {
      setErrorMsg('कृपया अपना ईमेल दर्ज करें।');
      return;
    }
    if (!password) {
      setErrorMsg('कृपया अपना पासवर्ड दर्ज करें।');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmail(email, password, targetExam);
      setLoading(false);
      setSuccessMsg('सफलतापूर्वक लॉगिन हो गया!');
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 500);
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err?.message || 'लॉगिन असफल रहा। कृपया ईमेल और पासवर्ड की जांच करें।');
    }
  };

  // Sign Up / Create Account Handler
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!name.trim()) {
      setErrorMsg('कृपया अपना पूरा नाम दर्ज करें।');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('कृपया एक मान्य ईमेल आईडी दर्ज करें।');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg('पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('दोनों पासवर्ड एक जैसे नहीं हैं। कृपया पुनः दर्ज करें।');
      return;
    }

    setLoading(true);
    try {
      await signUpWithEmail(name, email, password, targetExam);
      setLoading(false);
      setSuccessMsg('खाता सफलतापूर्वक बन गया! स्वागत है HANS COMPAIN में।');
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 600);
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err?.message || 'खाता बनाने में समस्या आई। कृपया पुनः प्रयास करें।');
    }
  };

  // Forgot Password Handler
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('कृपया एक मान्य ईमेल आईडी दर्ज करें।');
      return;
    }

    setLoading(true);
    try {
      const res = await resetPasswordWithEmail(email);
      setLoading(false);
      setSuccessMsg(res.message);
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err?.message || 'पासवर्ड रीसेट लिंक भेजने में त्रुटि हुई।');
    }
  };

  // Google 1-Click Login Handler
  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await signInWithGoogle(targetExam);
      setLoading(false);
      setSuccessMsg('Google से सफलतापूर्वक लॉगिन हो गया!');
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 500);
    } catch (err: any) {
      setLoading(false);
      setErrorMsg('Google लॉगिन विफल रहा या विंडो बंद कर दी गई। आप ईमेल-पासवर्ड से लॉगिन कर सकते हैं।');
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
        <div className="bg-[#091122] border-2 border-cyan-500/40 rounded-3xl p-5 sm:p-7 max-w-md w-full space-y-4 shadow-2xl relative text-white text-left my-auto max-h-[92vh] flex flex-col overflow-hidden">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-950 border border-slate-800 cursor-pointer z-10"
            title="बंद करें"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-3 pt-1 shrink-0">
            <HansCompainLogo variant="center" className="w-12 h-12 shrink-0" />
            <div className="pr-8">
              <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                {mode === 'login' && 'छात्र लॉगिन (Sign In)'}
                {mode === 'register' && 'नया खाता बनाएं (Create Account)'}
                {mode === 'forgot' && 'पासवर्ड रीसेट (Forgot Password)'}
              </h3>
              <p className="text-[11px] text-slate-300 line-clamp-1">
                {mode === 'login' && 'अपने ईमेल व पासवर्ड से तुरंत प्रवेश करें'}
                {mode === 'register' && 'निःशुल्क पंजीकरण करें और असीमित अध्ययन पाएं'}
                {mode === 'forgot' && 'अपना पासवर्ड पुनः प्राप्त करें'}
              </p>
            </div>
          </div>

          {/* Tabs: Sign In / Create Account / Forgot */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950 border border-slate-800 rounded-2xl shrink-0 text-xs font-bold">
            <button
              type="button"
              onClick={() => handleSwitchMode('login')}
              className={`py-2 px-1 rounded-xl text-center cursor-pointer transition-all ${
                mode === 'login'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              लॉगिन
            </button>
            <button
              type="button"
              onClick={() => handleSwitchMode('register')}
              className={`py-2 px-1 rounded-xl text-center cursor-pointer transition-all ${
                mode === 'register'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              नया खाता
            </button>
            <button
              type="button"
              onClick={() => handleSwitchMode('forgot')}
              className={`py-2 px-1 rounded-xl text-center cursor-pointer transition-all text-[11px] ${
                mode === 'forgot'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              पासवर्ड भूल गए?
            </button>
          </div>

          {/* Scrollable Form Body */}
          <div className="overflow-y-auto pr-1 space-y-4 custom-scrollbar">
            {/* Feedback Messages */}
            {errorMsg && (
              <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs font-semibold flex items-start gap-2">
                <span className="text-rose-400 text-sm">⚠️</span>
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* TAB 1: LOGIN (SIGN IN) */}
            {mode === 'login' && (
              <form onSubmit={handleSignIn} className="space-y-3">
                {/* Email field */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-cyan-400" />
                    <span>ईमेल आईडी (Email Address)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="उदा. student@hanscompain.in"
                      className="w-full py-2.5 px-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Password field */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>पासवर्ड (Password)</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleSwitchMode('forgot')}
                      className="text-[10px] text-amber-300 hover:underline cursor-pointer font-bold"
                    >
                      पासवर्ड भूल गए?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="अपना पासवर्ड लिखें"
                      className="w-full py-2.5 pl-3.5 pr-10 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all disabled:opacity-50 mt-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>सत्यापित हो रहा है...</span>
                    </>
                  ) : (
                    <>
                      <span>लॉगिन करें (Sign In)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Switch to Register */}
                <div className="text-center text-[11px] text-slate-400 pt-1">
                  नया छात्र हैं?{' '}
                  <button
                    type="button"
                    onClick={() => handleSwitchMode('register')}
                    className="text-cyan-400 hover:underline font-bold cursor-pointer"
                  >
                    यहाँ निःशुल्क खाता बनाएं
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: REGISTER (CREATE ACCOUNT) */}
            {mode === 'register' && (
              <form onSubmit={handleSignUp} className="space-y-3">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    <span>पूरा नाम (Student Full Name)</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="उदा. राहुल कुमार शर्मा"
                    className="w-full py-2.5 px-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-cyan-400" />
                    <span>ईमेल आईडी (Email Address)</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="उदा. rahul@example.com"
                    className="w-full py-2.5 px-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                {/* Target Exam Selection */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                    <span>लक्ष्य परीक्षा / बोर्ड (Target Exam)</span>
                  </label>
                  <select
                    value={targetExam}
                    onChange={(e) => setTargetExam(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="10वीं बोर्ड (Bihar / CBSE / UP)">10वीं बोर्ड परीक्षा 2026</option>
                    <option value="12वीं बोर्ड (Science / Arts / Comm)">12वीं बोर्ड परीक्षा 2026</option>
                    <option value="SSC & Steno 2026">SSC (CGL, CHSL, MTS, Steno)</option>
                    <option value="Railway RRB 2026">रेलवे (RRB NTPC, Group D, ALP)</option>
                    <option value="UPSC & State PSC">UPSC व राज्य लोक सेवा आयोग (BPSC/UPPSC)</option>
                    <option value="Banking & Police Exams">बैंकिंग / पुलिस परीक्षा</option>
                  </select>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>नया पासवर्ड (Password - कम से कम 6 अक्षर)</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="न्यूनतम 6 अक्षर या अंक"
                      className="w-full py-2.5 pl-3.5 pr-10 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                    <span>पासवर्ड की पुष्टि करें (Confirm Password)</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="पासवर्ड दोबारा दर्ज करें"
                    className="w-full py-2.5 px-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all disabled:opacity-50 mt-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>अकाउंट तैयार हो रहा है...</span>
                    </>
                  ) : (
                    <>
                      <span>नया खाता बनाएं (Create Account)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Switch to Login */}
                <div className="text-center text-[11px] text-slate-400 pt-1">
                  पहले से खाता है?{' '}
                  <button
                    type="button"
                    onClick={() => handleSwitchMode('login')}
                    className="text-cyan-400 hover:underline font-bold cursor-pointer"
                  >
                    यहाँ लॉगिन करें
                  </button>
                </div>
              </form>
            )}

            {/* TAB 3: FORGOT PASSWORD */}
            {mode === 'forgot' && (
              <form onSubmit={handleForgotPassword} className="space-y-3">
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
                  <div className="font-bold flex items-center gap-1.5 mb-1 text-amber-300">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>पासवर्ड भूल गए? कोई बात नहीं!</span>
                  </div>
                  अपना रजिस्टर्ड ईमेल नीचे दर्ज करें। हम आपको पासवर्ड रीसेट करने का सीधा लिंक प्रेषित करेंगे।
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span>पंजीकृत ईमेल आईडी (Registered Email)</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="उदा. student@hanscompain.in"
                    className="w-full py-2.5 px-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all disabled:opacity-50 mt-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>रीसेट लिंक भेजा जा रहा है...</span>
                    </>
                  ) : (
                    <>
                      <span>पासवर्ड रीसेट लिंक भेजें (Reset Password)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-center text-[11px] text-slate-400 pt-1">
                  पासवर्ड याद आ गया?{' '}
                  <button
                    type="button"
                    onClick={() => handleSwitchMode('login')}
                    className="text-cyan-400 hover:underline font-bold cursor-pointer"
                  >
                    वापस लॉगिन पर जाएं
                  </button>
                </div>
              </form>
            )}

            {/* Divider OR Google Sign-In */}
            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-[#091122] px-2 text-slate-400 font-bold">या त्वरित विकल्प (Or)</span>
              </div>
            </div>

            {/* 1-Click Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 active:scale-98 text-slate-200 font-bold text-xs flex items-center justify-center gap-2.5 cursor-pointer shadow transition-all disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google अकाउंट से 1-क्लिक में जारी रखें</span>
            </button>
          </div>

          {/* DEDICATED TERMS AND CONDITIONS / PRIVACY POLICY FOOTER SECTION */}
          {/* As requested: "Us page ke niche me term and condition app niche Dekh sake jisko dekhna ho Ok." */}
          <div className="pt-3 border-t border-slate-800/90 shrink-0 bg-[#070d1a] -mx-5 -mb-5 p-4 rounded-b-3xl space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 leading-tight">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>
                अकाउंट बनाकर या लॉगिन करके आप हमारे कानूनी व सुरक्षा नियमों से सहमत होते हैं:
              </span>
            </div>

            {/* Direct buttons to view terms and policy */}
            <div className="flex items-center justify-between gap-2 pt-0.5">
              <button
                type="button"
                onClick={() => openTerms('terms')}
                className="flex-1 py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-750 text-[11px] font-bold text-cyan-300 hover:text-cyan-200 flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-sm"
              >
                <FileText className="w-3 h-3 text-cyan-400" />
                <span>📜 नियम एवं शर्तें</span>
              </button>

              <button
                type="button"
                onClick={() => openTerms('privacy')}
                className="flex-1 py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-750 text-[11px] font-bold text-emerald-300 hover:text-emerald-200 flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-sm"
              >
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>🔒 गोपनीयता नीति</span>
              </button>
            </div>

            <div className="text-center text-[9px] text-slate-400 flex items-center justify-center gap-2">
              <span>✓ 100% सुरक्षित डेटा एन्क्रिप्शन</span>
              <span>•</span>
              <span>छात्र सहायता: palhanslal4@gmail.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Terms & Privacy Policy Full Viewer Modal */}
      <TermsAndPrivacyModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        initialTab={termsModalTab}
      />
    </>
  );
};

export default AuthLoginModal;
