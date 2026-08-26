import React, { useState, useEffect } from 'react';
import { Lock, Mail, Phone, User, Eye, EyeOff, X, Sparkles, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { HansCompainLogo } from './HansCompainLogo';

interface AuthModalsProps {
  isRegisterOpen: boolean;
  onCloseRegister: () => void;
  isLoginOpen: boolean;
  onCloseLogin: () => void;
  isForgotOpen: boolean;
  onCloseForgot: () => void;
  onOpenForgot: () => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  user: { name: string; email: string; phone?: string; role?: string } | null;
  setUser: (u: { name: string; email: string; phone?: string; role?: string } | null) => void;
  showToast: (msg: string, type?: 'info' | 'success' | 'warn') => void;
}

function getCleanDisplayName(name: string | undefined, identifier: string): string {
  if (name && !name.includes('@') && name.trim().length > 0) {
    if (name.toLowerCase() === 'kendo') return 'Scholar';
    return name.trim();
  }
  const prefix = identifier.split('@')[0].replace(/[0-9_.-]+/g, ' ').trim();
  if (prefix.length > 0) {
    return prefix.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }
  return 'Scholar Student';
}

export const AuthModals: React.FC<AuthModalsProps> = ({
  isRegisterOpen,
  onCloseRegister,
  isLoginOpen,
  onCloseLogin,
  isForgotOpen,
  onCloseForgot,
  onOpenForgot,
  onOpenLogin,
  onOpenRegister,
  setUser,
  showToast
}) => {
  // Register state matching the exact UI specification (NO invite code!)
  const [regName, setRegName] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regPhone, setRegPhone] = useState("");
  const [regOtp, setRegOtp] = useState("");
  const [isSendingRegOtp, setIsSendingRegOtp] = useState(false);
  const [regOtpSent, setRegOtpSent] = useState(false);
  const [regOtpTimer, setRegOtpTimer] = useState(0);
  const [regOtpHint, setRegOtpHint] = useState<string | null>(null);
  const [isSubmittingRegister, setIsSubmittingRegister] = useState(false);

  // Login state
  const [loginMode, setLoginMode] = useState<'password' | 'otp'>('password');
  const [loginIdentifier, setLoginIdentifier] = useState(""); // phone or email
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginOtp, setLoginOtp] = useState("");
  const [isSendingLoginOtp, setIsSendingLoginOtp] = useState(false);
  const [loginOtpSent, setLoginOtpSent] = useState(false);
  const [loginOtpTimer, setLoginOtpTimer] = useState(0);
  const [loginOtpHint, setLoginOtpHint] = useState<string | null>(null);
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  // Forgot Password state
  const [forgotTarget, setForgotTarget] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotStep, setForgotStep] = useState<1 | 2 | 3>(1);
  const [forgotOtpHint, setForgotOtpHint] = useState<string | null>(null);
  const [forgotResetToken, setForgotResetToken] = useState("");
  const [isForgotLoading, setIsForgotLoading] = useState(false);

  // Social Login state
  const [socialModalProvider, setSocialModalProvider] = useState<'google' | 'facebook' | null>(null);
  const [socialUserName, setSocialUserName] = useState("");
  const [socialUserEmail, setSocialUserEmail] = useState("");

  // OTP Countdown Timers
  useEffect(() => {
    let interval: any = null;
    if (regOtpTimer > 0) {
      interval = setInterval(() => setRegOtpTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [regOtpTimer]);

  useEffect(() => {
    let interval: any = null;
    if (loginOtpTimer > 0) {
      interval = setInterval(() => setLoginOtpTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [loginOtpTimer]);

  // Send OTP for Registration
  const handleSendRegOtp = async () => {
    const cleanPhone = regPhone.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      showToast("कृपया 10-अंकों का वैध मोबाइल नंबर दर्ज करें (Enter valid 10-digit mobile).", "warn");
      return;
    }
    setIsSendingRegOtp(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone, target: cleanPhone })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");

      setRegOtpSent(true);
      setRegOtpTimer(45);
      setRegOtpHint(data.otpHint || null);
      showToast(`सुरक्षा OTP कोड (+91 ${cleanPhone}) पर भेजा गया है (OTP: ${data.otpHint || '******'}) 📲`, "success");
    } catch (err: any) {
      showToast(err.message || "OTP भेजने में विफल। कृपया पुनः प्रयास करें।", "warn");
    } finally {
      setIsSendingRegOtp(false);
    }
  };

  // Submit Registration (Sign Up)
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      showToast("कृपया अपना पूरा नाम दर्ज करें (Please enter your name).", "warn");
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      showToast("पासवर्ड कम से कम 6 अक्षरों का होना चाहिए (Password must be min 6 characters).", "warn");
      return;
    }
    const cleanPhone = regPhone.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      showToast("कृपया 10-अंकों का वैध मोबाइल नंबर दर्ज करें (Please enter 10-digit phone number).", "warn");
      return;
    }

    setIsSubmittingRegister(true);
    try {
      // If OTP was entered, optionally verify
      if (regOtp && regOtp.trim().length >= 4) {
        try {
          await fetch('/api/auth/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: cleanPhone, target: cleanPhone, otp: regOtp.trim(), name: regName.trim() })
          });
        } catch (e) {
          // ignore soft OTP error if main registration proceeds
        }
      }

      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName.trim(),
          phone: cleanPhone,
          email: `${cleanPhone}@student.hansai.in`,
          password: regPassword.trim()
        })
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.isAlreadyRegistered) {
          showToast(data.error, "warn");
          onCloseRegister();
          onOpenLogin();
          return;
        }
        throw new Error(data.error || "Registration failed");
      }

      const displayName = getCleanDisplayName(regName.trim(), cleanPhone);
      const uObj = { name: displayName, email: `${cleanPhone}@student.hansai.in`, phone: cleanPhone, role: 'student' };
      setUser(uObj);
      localStorage.setItem('hansai-user-session', JSON.stringify(uObj));
      onCloseRegister();
      showToast(`Welcome to Hans Compain, ${displayName}! Account Created Successfully. 🚀`, "success");
    } catch (err: any) {
      showToast(err.message || "Registration failed. Please try again.", "warn");
    } finally {
      setIsSubmittingRegister(false);
    }
  };

  // Send OTP for Login
  const handleSendLoginOtp = async () => {
    const rawTarget = loginIdentifier.trim();
    if (!rawTarget) {
      showToast("कृपया मोबाइल नंबर या ईमेल पता दर्ज करें।", "warn");
      return;
    }
    setIsSendingLoginOtp(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: rawTarget, phone: rawTarget, email: rawTarget })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");

      setLoginOtpSent(true);
      setLoginOtpTimer(45);
      setLoginOtpHint(data.otpHint || null);
      showToast(`सुरक्षा OTP कोड भेजा गया है (${data.otpHint || '******'}) 📲`, "success");
    } catch (err: any) {
      showToast(err.message || "OTP भेजने में विफल।", "warn");
    } finally {
      setIsSendingLoginOtp(false);
    }
  };

  // Submit Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawTarget = loginIdentifier.trim();
    if (!rawTarget) {
      showToast("कृपया मोबाइल नंबर या ईमेल दर्ज करें।", "warn");
      return;
    }

    setIsSubmittingLogin(true);
    try {
      if (loginMode === 'otp') {
        if (!loginOtp || loginOtp.trim().length < 4) {
          showToast("कृपया सही OTP कोड दर्ज करें।", "warn");
          setIsSubmittingLogin(false);
          return;
        }
        const res = await fetch('/api/auth/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ target: rawTarget, phone: rawTarget, email: rawTarget, otp: loginOtp.trim() })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Invalid OTP code");

        const displayName = getCleanDisplayName(data.user?.name, rawTarget);
        const uObj = { name: displayName, email: data.user?.email || rawTarget, phone: data.user?.phone, role: data.user?.role || 'student' };
        setUser(uObj);
        localStorage.setItem('hansai-user-session', JSON.stringify(uObj));
        onCloseLogin();
        showToast(`Welcome back, ${displayName}! Portal Unlocked. 🔐`, "success");
      } else {
        if (!loginPassword.trim()) {
          showToast("कृपया पासवर्ड दर्ज करें।", "warn");
          setIsSubmittingLogin(false);
          return;
        }
        const isPhone = !rawTarget.includes('@') && rawTarget.replace(/\D/g, '').length >= 10;
        const cleanEmail = isPhone ? `${rawTarget.replace(/\D/g, '').slice(-10)}@student.hansai.in` : rawTarget.toLowerCase();

        const res = await fetch('/api/users/login-secure', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, password: loginPassword.trim() })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Invalid credentials. Check password or use OTP login.");

        const displayName = getCleanDisplayName(data.user?.name, rawTarget);
        const uObj = { name: displayName, email: data.user?.email || cleanEmail, phone: data.user?.phone, role: 'student' };
        setUser(uObj);
        localStorage.setItem('hansai-user-session', JSON.stringify(uObj));
        onCloseLogin();
        showToast(`Welcome back, ${displayName}! 🔐`, "success");
      }
    } catch (err: any) {
      showToast(err.message || "Login failed. Check details or use OTP Login.", "warn");
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  // Social Sign-In Handler
  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    const targetEmail = socialUserEmail.trim().toLowerCase();
    const targetName = (socialUserName || targetEmail.split('@')[0]).trim();
    if (!targetEmail || !targetEmail.includes('@')) {
      showToast("कृपया एक वैध ईमेल पता दर्ज करें।", "warn");
      return;
    }
    try {
      const res = await fetch('/api/users/social-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, email: targetEmail, name: targetName })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Social login failed");

      const displayName = getCleanDisplayName(targetName, targetEmail);
      const uObj = { name: displayName, email: targetEmail, role: 'student' };
      setUser(uObj);
      localStorage.setItem('hansai-user-session', JSON.stringify(uObj));
      setSocialModalProvider(null);
      onCloseRegister();
      onCloseLogin();
      showToast(`Welcome ${displayName}! Signed in with ${provider === 'google' ? 'Google' : 'Facebook'}. 🌐`, "success");
    } catch (err: any) {
      showToast(err.message || "Social login failed", "warn");
    }
  };

  // Forgot Password Steps
  const handleForgotStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotTarget.trim()) {
      showToast("कृपया पंजीकृत ईमेल या मोबाइल नंबर दर्ज करें।", "warn");
      return;
    }
    setIsForgotLoading(true);
    try {
      const isPhone = !forgotTarget.includes('@') && forgotTarget.replace(/\D/g, '').length >= 10;
      const cleanEmail = isPhone ? `${forgotTarget.replace(/\D/g, '').slice(-10)}@student.hansai.in` : forgotTarget.toLowerCase();

      const res = await fetch('/api/users/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Account not found");

      if (data.otpHint) setForgotOtpHint(data.otpHint);
      setForgotStep(2);
      showToast("सुरक्षा OTP कोड भेजा गया है! कृपया OTP दर्ज करें।", "info");
    } catch (err: any) {
      showToast(err.message || "खाता नहीं मिला। कृपया रजिस्ट्रेशन करें।", "warn");
    } finally {
      setIsForgotLoading(false);
    }
  };

  const handleForgotStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsForgotLoading(true);
    try {
      const isPhone = !forgotTarget.includes('@') && forgotTarget.replace(/\D/g, '').length >= 10;
      const cleanEmail = isPhone ? `${forgotTarget.replace(/\D/g, '').slice(-10)}@student.hansai.in` : forgotTarget.toLowerCase();

      const res = await fetch('/api/users/verify-security-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          otpToken: forgotOtp.trim()
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed");

      setForgotResetToken(data.resetSessionToken);
      setForgotStep(3);
      showToast("OTP सत्यापित! अब अपना नया पासवर्ड बनाएं।", "success");
    } catch (err: any) {
      showToast(err.message || "गलत OTP कोड दर्ज किया गया है।", "warn");
    } finally {
      setIsForgotLoading(false);
    }
  };

  const handleForgotStep3 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotNewPassword || forgotNewPassword.length < 6) {
      showToast("पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।", "warn");
      return;
    }
    setIsForgotLoading(true);
    try {
      const isPhone = !forgotTarget.includes('@') && forgotTarget.replace(/\D/g, '').length >= 10;
      const cleanEmail = isPhone ? `${forgotTarget.replace(/\D/g, '').slice(-10)}@student.hansai.in` : forgotTarget.toLowerCase();

      const res = await fetch('/api/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          resetSessionToken: forgotResetToken,
          newPassword: forgotNewPassword.trim()
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Password reset failed");

      showToast("पासवर्ड सफलतापूर्वक अपडेट हो गया है! कृपया लॉगिन करें। 🔐", "success");
      onCloseForgot();
      onOpenLogin();
      setLoginIdentifier(forgotTarget);
      setForgotStep(1);
      setForgotTarget("");
      setForgotOtp("");
      setForgotNewPassword("");
    } catch (err: any) {
      showToast(err.message || "पासवर्ड रीसेट करने में त्रुटि।", "warn");
    } finally {
      setIsForgotLoading(false);
    }
  };

  return (
    <>
      {/* 1. REGISTER MODAL (EXACT SPECIFICATION MATCHING USER'S SCREENSHOT - NO INVITE CODE!) */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#f8fafc] text-slate-900 border border-emerald-200 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 text-left shadow-2xl relative animate-fade-in max-h-[95vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={onCloseRegister}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full bg-slate-200/60 hover:bg-slate-300 transition-all cursor-pointer border-none"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header: Register in Emerald Green */}
            <div className="text-center space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight">
                Register
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Create your Hans Compain student account
              </p>
            </div>

            {/* Registration Form (User, Password, Phone +91, OTP Code, Sign Up - STRICTLY NO INVITE CODE!) */}
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              
              {/* Field 1: User / Name */}
              <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-xs focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                <User className="w-5 h-5 text-emerald-600 shrink-0" />
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="अपना पूरा नाम दर्ज करें (Full Name)"
                  className="w-full text-sm font-medium text-slate-800 placeholder:text-slate-400 bg-transparent border-none outline-none"
                  required
                />
              </div>

              {/* Field 2: Password */}
              <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-xs focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                <Lock className="w-5 h-5 text-emerald-600 shrink-0" />
                <input
                  type={showRegPassword ? "text" : "password"}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="पासवर्ड बनाएं (कम से कम 6 अक्षर)"
                  className="w-full text-sm font-medium text-slate-800 placeholder:text-slate-400 bg-transparent border-none outline-none font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="p-1 text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer"
                >
                  {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Field 3: Phone Number (+91) */}
              <div className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-xs focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                <Phone className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-sm font-bold text-slate-700 select-none">+91</span>
                <span className="text-slate-300 select-none">|</span>
                <input
                  type="tel"
                  maxLength={10}
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="10 अंकों का मोबाइल नंबर"
                  className="w-full text-sm font-semibold tracking-wider text-slate-800 placeholder:text-slate-400 bg-transparent border-none outline-none font-mono"
                  required
                />
              </div>

              {/* Field 4: OTP Code with Embedded Resend/Get OTP Button */}
              <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-2 shadow-xs focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                <Mail className="w-5 h-5 text-emerald-600 shrink-0" />
                <input
                  type="text"
                  maxLength={6}
                  value={regOtp}
                  onChange={(e) => setRegOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="OTP Code"
                  className="w-full text-sm font-semibold tracking-wider text-slate-800 placeholder:text-slate-400 bg-transparent border-none outline-none font-mono"
                />
                <button
                  type="button"
                  disabled={isSendingRegOtp || regOtpTimer > 0}
                  onClick={handleSendRegOtp}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap border-none disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed shadow-xs"
                >
                  {isSendingRegOtp ? "Sending..." : regOtpTimer > 0 ? `Resend (${regOtpTimer}s)` : "Get OTP"}
                </button>
              </div>

              {/* Live OTP Demo Hint Helper if sent */}
              {regOtpHint && (
                <div className="text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-center">
                  Verification OTP Code: <span className="font-black text-emerald-900">{regOtpHint}</span>
                </div>
              )}

              {/* Field 5: Sign Up Button (Solid Emerald Green Rounded Pill) */}
              <button
                type="submit"
                disabled={isSubmittingRegister}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-black text-base rounded-2xl transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer border-none disabled:opacity-50 mt-2"
              >
                {isSubmittingRegister ? (
                  <span>Signing Up...</span>
                ) : (
                  <span>Sign Up</span>
                )}
              </button>
            </form>

            {/* Social Logins */}
            <div className="pt-2">
              <div className="relative flex items-center justify-center mb-3">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-[#f8fafc] px-3 text-[11px] text-slate-400 uppercase font-semibold">
                  Or Sign Up With
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSocialModalProvider('google')}
                  className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-slate-700 transition-all cursor-pointer shadow-2xs"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSocialModalProvider('facebook')}
                  className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-slate-700 transition-all cursor-pointer shadow-2xs"
                >
                  <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Facebook</span>
                </button>
              </div>
            </div>

            {/* Footer Navigation */}
            <div className="text-center pt-2 text-xs text-slate-500">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  onCloseRegister();
                  onOpenLogin();
                }}
                className="font-bold text-emerald-600 hover:text-emerald-700 underline bg-transparent border-none cursor-pointer"
              >
                Sign In (लॉग इन)
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 2. SIGN IN (LOGIN) MODAL */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#f8fafc] text-slate-900 border border-slate-200 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 text-left shadow-2xl relative animate-fade-in max-h-[95vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={onCloseLogin}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full bg-slate-200/60 hover:bg-slate-300 transition-all cursor-pointer border-none"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="text-center space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight">
                Sign In
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Log in to access your Hans Compain dashboard
              </p>
            </div>

            {/* Login Toggle: Password vs OTP */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-200/70 rounded-2xl border border-slate-300">
              <button
                type="button"
                onClick={() => setLoginMode('password')}
                className={`py-2 px-2 text-xs font-bold rounded-xl transition-all cursor-pointer border-none flex items-center justify-center gap-1.5 ${
                  loginMode === 'password'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 bg-transparent'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Password</span>
              </button>

              <button
                type="button"
                onClick={() => setLoginMode('otp')}
                className={`py-2 px-2 text-xs font-bold rounded-xl transition-all cursor-pointer border-none flex items-center justify-center gap-1.5 ${
                  loginMode === 'otp'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 bg-transparent'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>OTP Login</span>
              </button>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              {/* Identifier: Mobile or Email */}
              <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-xs focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                <Phone className="w-5 h-5 text-emerald-600 shrink-0" />
                <input
                  type="text"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="मोबाइल नंबर या ईमेल दर्ज करें"
                  className="w-full text-sm font-medium text-slate-800 placeholder:text-slate-400 bg-transparent border-none outline-none font-mono"
                  required
                />
              </div>

              {/* Mode 1: Password Input */}
              {loginMode === 'password' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-xs focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                    <Lock className="w-5 h-5 text-emerald-600 shrink-0" />
                    <input
                      type={showLoginPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••"
                      className="w-full text-sm font-medium text-slate-800 placeholder:text-slate-400 bg-transparent border-none outline-none font-mono"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="p-1 text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => {
                        onCloseLogin();
                        onOpenForgot();
                      }}
                      className="text-xs font-semibold text-emerald-600 hover:underline bg-transparent border-none cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </div>
              )}

              {/* Mode 2: OTP Input */}
              {loginMode === 'otp' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-2 shadow-xs focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                    <Mail className="w-5 h-5 text-emerald-600 shrink-0" />
                    <input
                      type="text"
                      maxLength={6}
                      value={loginOtp}
                      onChange={(e) => setLoginOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="6-Digit OTP"
                      className="w-full text-sm font-semibold tracking-wider text-slate-800 placeholder:text-slate-400 bg-transparent border-none outline-none font-mono"
                    />
                    <button
                      type="button"
                      disabled={isSendingLoginOtp || loginOtpTimer > 0}
                      onClick={handleSendLoginOtp}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap border-none disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed shadow-xs"
                    >
                      {isSendingLoginOtp ? "Sending..." : loginOtpTimer > 0 ? `Resend (${loginOtpTimer}s)` : "Get OTP"}
                    </button>
                  </div>

                  {loginOtpHint && (
                    <div className="text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-center">
                      Security OTP Code: <span className="font-black text-emerald-900">{loginOtpHint}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isSubmittingLogin}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-black text-base rounded-2xl transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer border-none disabled:opacity-50 mt-2"
              >
                {isSubmittingLogin ? (
                  <span>Signing In...</span>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>

            {/* Social Logins */}
            <div className="pt-2">
              <div className="relative flex items-center justify-center mb-3">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-[#f8fafc] px-3 text-[11px] text-slate-400 uppercase font-semibold">
                  Or Sign In With
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSocialModalProvider('google')}
                  className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-slate-700 transition-all cursor-pointer shadow-2xs"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSocialModalProvider('facebook')}
                  className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-slate-700 transition-all cursor-pointer shadow-2xs"
                >
                  <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Facebook</span>
                </button>
              </div>
            </div>

            {/* Footer Navigation */}
            <div className="text-center pt-2 text-xs text-slate-500">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  onCloseLogin();
                  onOpenRegister();
                }}
                className="font-bold text-emerald-600 hover:text-emerald-700 underline bg-transparent border-none cursor-pointer"
              >
                Register here (नया खाता)
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 3. FORGOT PASSWORD MODAL */}
      {isForgotOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#f8fafc] text-slate-900 border border-slate-200 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 text-left shadow-2xl relative animate-fade-in max-h-[95vh] overflow-y-auto">
            
            <button
              onClick={onCloseForgot}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full bg-slate-200/60 hover:bg-slate-300 transition-all cursor-pointer border-none"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-1">
              <h1 className="text-2xl font-extrabold text-emerald-600 tracking-tight">
                Reset Password
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                {forgotStep === 1 && "Enter registered mobile number or email to receive OTP"}
                {forgotStep === 2 && "Enter the 6-digit OTP code to verify your identity"}
                {forgotStep === 3 && "Create a new strong password"}
              </p>
            </div>

            {forgotStep === 1 && (
              <form onSubmit={handleForgotStep1} className="space-y-4">
                <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-xs focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                  <Phone className="w-5 h-5 text-emerald-600 shrink-0" />
                  <input
                    type="text"
                    value={forgotTarget}
                    onChange={(e) => setForgotTarget(e.target.value)}
                    placeholder="मोबाइल नंबर या ईमेल दर्ज करें"
                    className="w-full text-sm font-medium text-slate-800 placeholder:text-slate-400 bg-transparent border-none outline-none font-mono"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isForgotLoading}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-2xl transition-all cursor-pointer border-none disabled:opacity-50 shadow-md shadow-emerald-600/30"
                >
                  {isForgotLoading ? "Sending OTP..." : "Send Verification OTP →"}
                </button>
              </form>
            )}

            {forgotStep === 2 && (
              <form onSubmit={handleForgotStep2} className="space-y-4">
                <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-xs focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                  <Mail className="w-5 h-5 text-emerald-600 shrink-0" />
                  <input
                    type="text"
                    maxLength={6}
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-Digit OTP"
                    className="w-full text-center tracking-widest text-base font-bold text-slate-800 placeholder:text-slate-400 bg-transparent border-none outline-none font-mono"
                    required
                  />
                </div>

                {forgotOtpHint && (
                  <div className="text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-center">
                    Demo OTP: <span className="font-black text-emerald-900">{forgotOtpHint}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isForgotLoading}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-2xl transition-all cursor-pointer border-none disabled:opacity-50 shadow-md shadow-emerald-600/30"
                >
                  {isForgotLoading ? "Verifying..." : "Verify OTP Code →"}
                </button>
              </form>
            )}

            {forgotStep === 3 && (
              <form onSubmit={handleForgotStep3} className="space-y-4">
                <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-xs focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                  <Lock className="w-5 h-5 text-emerald-600 shrink-0" />
                  <input
                    type="password"
                    value={forgotNewPassword}
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                    placeholder="Enter new password (min 6 chars)"
                    className="w-full text-sm font-medium text-slate-800 placeholder:text-slate-400 bg-transparent border-none outline-none font-mono"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isForgotLoading}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-2xl transition-all cursor-pointer border-none disabled:opacity-50 shadow-md shadow-emerald-600/30"
                >
                  {isForgotLoading ? "Updating..." : "Save New Password & Login 🔐"}
                </button>
              </form>
            )}

            <div className="text-center pt-2 text-xs text-slate-500">
              <button
                type="button"
                onClick={() => {
                  onCloseForgot();
                  onOpenLogin();
                }}
                className="font-bold text-emerald-600 hover:underline bg-transparent border-none cursor-pointer"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. SOCIAL LOGIN MODAL (Google & Facebook) */}
      {socialModalProvider && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#f8fafc] text-slate-900 border border-slate-200 rounded-3xl max-w-sm w-full p-6 space-y-4 text-left shadow-2xl relative animate-fade-in">
            
            <button
              onClick={() => setSocialModalProvider(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full bg-slate-200/60 hover:bg-slate-300 transition-all cursor-pointer border-none"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
              {socialModalProvider === 'google' ? (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Sign in with Google</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 fill-[#1877F2]" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Sign in with Facebook</span>
                </>
              )}
            </div>

            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Your Name</label>
                <input
                  type="text"
                  value={socialUserName}
                  onChange={(e) => setSocialUserName(e.target.value)}
                  placeholder="e.g. Radheswar"
                  className="w-full text-xs p-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  {socialModalProvider === 'google' ? 'Google Email (@gmail.com)' : 'Facebook Email / Mobile'}
                </label>
                <input
                  type="email"
                  value={socialUserEmail}
                  onChange={(e) => setSocialUserEmail(e.target.value)}
                  placeholder={socialModalProvider === 'google' ? 'user@gmail.com' : 'user@facebook.com'}
                  className="w-full text-xs p-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500 font-mono"
                  required
                />
              </div>

              <button
                type="button"
                onClick={() => handleSocialLogin(socialModalProvider)}
                className={`w-full py-3 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer border-none ${
                  socialModalProvider === 'google' 
                    ? 'bg-red-600 hover:bg-red-500' 
                    : 'bg-blue-600 hover:bg-blue-500'
                }`}
              >
                Continue with {socialModalProvider === 'google' ? 'Google' : 'Facebook'} 🌐
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
