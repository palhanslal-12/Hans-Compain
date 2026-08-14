import React, { useState } from 'react';
import { Lock, Mail, Key, ShieldCheck, X, Sparkles, CheckCircle2, AlertCircle, ArrowRight, UserCheck } from 'lucide-react';
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
  user: { name: string; email: string } | null;
  setUser: (u: { name: string; email: string; role?: string } | null) => void;
  showToast: (msg: string, type?: 'info' | 'success' | 'warn') => void;
}

function getCleanDisplayName(name: string | undefined, email: string): string {
  if (name && !name.includes('@') && name.trim().length > 0) {
    if (name.toLowerCase() === 'kendo') return 'Scholar';
    return name.trim();
  }
  const prefix = email.split('@')[0].replace(/[0-9_.-]+/g, ' ').trim();
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
  // Register state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regQuestion, setRegQuestion] = useState("What is your primary target exam?");
  const [regAnswer, setRegAnswer] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Forgot Password state
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStep, setForgotStep] = useState<1 | 2 | 3>(1);
  const [forgotQuestion, setForgotQuestion] = useState("");
  const [forgotAnswer, setForgotAnswer] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [forgotResetToken, setForgotResetToken] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotOtpHint, setForgotOtpHint] = useState<string | null>(null);
  const [isForgotLoading, setIsForgotLoading] = useState(false);

  // Social Login Modal State
  const [socialModalProvider, setSocialModalProvider] = useState<'google' | 'facebook' | null>(null);
  const [socialUserEmail, setSocialUserEmail] = useState("");
  const [socialUserName, setSocialUserName] = useState("");

  // Social Login Handler (Google & Facebook)
  const handleSocialLogin = async (provider: 'google' | 'facebook', directEmail?: string, directName?: string) => {
    const targetEmail = (directEmail || socialUserEmail).trim().toLowerCase();
    const targetName = (directName || socialUserName || targetEmail.split('@')[0]).trim();
    
    if (!targetEmail || !targetEmail.includes('@')) {
      showToast("Please enter a valid email address.", "warn");
      return;
    }

    try {
      const res = await fetch('/api/users/social-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          email: targetEmail,
          name: targetName
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Social login failed");

      const displayName = getCleanDisplayName(targetName, targetEmail);
      const uObj = { name: displayName, email: targetEmail, role: 'student' };
      setUser(uObj);
      localStorage.setItem('hansai-user-session', JSON.stringify(uObj));
      
      setSocialModalProvider(null);
      setSocialUserEmail("");
      setSocialUserName("");
      onCloseRegister();
      onCloseLogin();
      showToast(`Welcome ${displayName}! Authenticated via ${provider === 'google' ? 'Google' : 'Facebook'}. 🌐`, "success");
    } catch (err: any) {
      showToast(err.message || "Social login failed. Please try standard login.", "warn");
    }
  };

  // 1. Submit Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) {
      showToast("Please enter Name and Email.", "warn");
      return;
    }
    if (regPassword && regPassword.length < 6) {
      showToast("Password must be at least 6 characters for security.", "warn");
      return;
    }

    const cleanName = regName.trim();
    const cleanEmail = regEmail.trim().toLowerCase();
    setIsRegistering(true);

    try {
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          password: regPassword || "123456",
          securityQuestion: regQuestion,
          securityAnswer: regAnswer || "SSC Exam"
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

      const displayName = getCleanDisplayName(cleanName, cleanEmail);
      const uObj = { name: displayName, email: cleanEmail, role: 'student' };
      setUser(uObj);
      localStorage.setItem('hansai-user-session', JSON.stringify(uObj));
      onCloseRegister();
      showToast(`Welcome ${displayName}! Account created securely. 🛡️`, "success");
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Registration failed. Try logging in instead.", "warn");
    } finally {
      setIsRegistering(false);
    }
  };

  // 2. Submit Secure Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      showToast("Please enter Email and Password.", "warn");
      return;
    }
    const cleanEmail = loginEmail.trim().toLowerCase();
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/users/login-secure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: loginPassword.trim() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid credentials");

      const displayName = getCleanDisplayName(data.user?.name, cleanEmail);
      const uObj = { name: displayName, email: cleanEmail, role: 'student' };
      setUser(uObj);
      localStorage.setItem('hansai-user-session', JSON.stringify(uObj));
      onCloseLogin();
      showToast(`Welcome back, ${uObj.name}! Logged in securely. 🔐`, "success");
    } catch (err: any) {
      showToast(err.message || "Login failed. Check password or click Forgot Password.", "warn");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // 3. Initiate Forgot Password
  const handleForgotStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      showToast("Please enter your registered email address.", "warn");
      return;
    }
    setIsForgotLoading(true);
    try {
      const res = await fetch('/api/users/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail.trim().toLowerCase() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Account not found");

      setForgotQuestion(data.securityQuestion || "What is your primary target exam?");
      if (data.otpHint) setForgotOtpHint(data.otpHint);
      setForgotStep(2);
      showToast("Security Verification active! Answer security question or enter OTP.", "info");
    } catch (err: any) {
      showToast(err.message || "Failed to locate account.", "warn");
    } finally {
      setIsForgotLoading(false);
    }
  };

  // 4. Verify Answer / OTP
  const handleForgotStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsForgotLoading(true);
    try {
      const res = await fetch('/api/users/verify-security-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotEmail.trim().toLowerCase(),
          securityAnswer: forgotAnswer.trim(),
          otpToken: forgotOtp.trim()
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed");

      setForgotResetToken(data.resetSessionToken);
      setForgotStep(3);
      showToast("Identity verified! Set your new password now.", "success");
    } catch (err: any) {
      showToast(err.message || "Incorrect security answer or invalid OTP.", "warn");
    } finally {
      setIsForgotLoading(false);
    }
  };

  // 5. Set New Password
  const handleForgotStep3 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotNewPassword || forgotNewPassword.length < 6) {
      showToast("New password must be at least 6 characters long.", "warn");
      return;
    }
    setIsForgotLoading(true);
    try {
      const res = await fetch('/api/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotEmail.trim().toLowerCase(),
          resetSessionToken: forgotResetToken,
          newPassword: forgotNewPassword.trim()
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Password reset failed");

      showToast(data.message || "Password successfully changed! Please login now. 🔐", "success");
      onCloseForgot();
      onOpenLogin();
      setLoginEmail(forgotEmail);
      // Reset state
      setForgotStep(1);
      setForgotEmail("");
      setForgotAnswer("");
      setForgotOtp("");
      setForgotNewPassword("");
    } catch (err: any) {
      showToast(err.message || "Failed to update password.", "warn");
    } finally {
      setIsForgotLoading(false);
    }
  };

  return (
    <>
      {/* 1. REGISTER MODAL */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0A0F1D] border border-emerald-500/40 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 text-left shadow-2xl relative animate-fade-in max-h-[90vh] overflow-y-auto">
            <button
              onClick={onCloseRegister}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <HansCompainLogo size="sm" />
              <h2 className="text-xl font-black text-white tracking-tight pt-2">
                Create Student Account / नया खाता
              </h2>
              <p className="text-xs text-slate-400">
                Register to track your quizzes, notes, and study progress securely.
              </p>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setSocialModalProvider('google')}
                className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-red-500/50 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-slate-200 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Google Sign-In</span>
              </button>

              <button
                type="button"
                onClick={() => setSocialModalProvider('facebook')}
                className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/50 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-slate-200 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook Login</span>
              </button>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-800 w-full" />
              <span className="bg-[#0A0F1D] px-2 text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                Or with Email & Password
              </span>
            </div>

            {/* Email Registration Form */}
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Full Name / छात्र का नाम</label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full text-xs p-3 bg-[#050811] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Email Address / ईमेल</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full text-xs p-3 bg-[#050811] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Password / पासवर्ड (min 6 chars)</label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs p-3 bg-[#050811] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">Security Question (For Password Recovery)</label>
                <select
                  value={regQuestion}
                  onChange={(e) => setRegQuestion(e.target.value)}
                  className="w-full text-[11px] p-2.5 bg-[#050811] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="What is your primary target exam?">What is your primary target exam?</option>
                  <option value="What is your favorite subject?">What is your favorite subject?</option>
                  <option value="What is your birth city?">What is your birth city?</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">Security Answer / उत्तर</label>
                <input
                  type="text"
                  value={regAnswer}
                  onChange={(e) => setRegAnswer(e.target.value)}
                  placeholder="e.g. SSC Stenographer 2026"
                  className="w-full text-xs p-2.5 bg-[#050811] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isRegistering}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-950/50 cursor-pointer transition-all border-none disabled:opacity-50 mt-2"
              >
                {isRegistering ? "Creating Account..." : "Complete Registration & Unlock 🚀"}
              </button>
            </form>

            <div className="text-center pt-2">
              <span className="text-xs text-slate-400">Already registered? </span>
              <button
                onClick={() => {
                  onCloseRegister();
                  onOpenLogin();
                }}
                className="text-xs font-bold text-emerald-400 hover:underline bg-transparent border-none cursor-pointer"
              >
                Login here (लॉग इन करें) →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. LOGIN MODAL */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0A0F1D] border border-cyan-500/40 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 text-left shadow-2xl relative animate-fade-in">
            <button
              onClick={onCloseLogin}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <HansCompainLogo size="sm" />
              <h2 className="text-xl font-black text-white tracking-tight pt-2">
                Student Sign In / छात्र लॉगिन
              </h2>
              <p className="text-xs text-slate-400">
                Enter your registered email and password to access your dashboard.
              </p>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setSocialModalProvider('google')}
                className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-red-500/50 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-slate-200 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Google Login</span>
              </button>

              <button
                type="button"
                onClick={() => setSocialModalProvider('facebook')}
                className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/50 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-slate-200 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook Login</span>
              </button>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-800 w-full" />
              <span className="bg-[#0A0F1D] px-2 text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                Or with Email & Password
              </span>
            </div>

            {/* Email Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Registered Email / ईमेल</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full text-xs p-3 bg-[#050811] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500 font-mono"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-300">Password / पासवर्ड</label>
                  <button
                    type="button"
                    onClick={() => {
                      onCloseLogin();
                      onOpenForgot();
                    }}
                    className="text-[10px] text-amber-400 hover:underline font-bold bg-transparent border-none cursor-pointer"
                  >
                    Forgot Password? (पासवर्ड भूल गए?)
                  </button>
                </div>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs p-3 bg-[#050811] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500 font-mono"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs rounded-xl shadow-lg shadow-cyan-950/50 cursor-pointer transition-all border-none disabled:opacity-50 mt-2"
              >
                {isLoggingIn ? "Authenticating..." : "Login Securely 🔐"}
              </button>
            </form>

            <div className="text-center pt-2">
              <span className="text-xs text-slate-400">New user? </span>
              <button
                onClick={() => {
                  onCloseLogin();
                  onOpenRegister();
                }}
                className="text-xs font-bold text-cyan-400 hover:underline bg-transparent border-none cursor-pointer"
              >
                Create an account (रजिस्टर करें) →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. FORGOT PASSWORD MODAL */}
      {isForgotOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0A0F1D] border border-amber-500/40 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 text-left shadow-2xl relative animate-fade-in">
            <button
              onClick={onCloseForgot}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <HansCompainLogo size="sm" />
              <h2 className="text-xl font-black text-white tracking-tight pt-2">
                Password Recovery / पासवर्ड रीसेट
              </h2>
              <p className="text-xs text-slate-400">
                {forgotStep === 1 && "Enter your registered email address to verify your identity."}
                {forgotStep === 2 && "Answer your security question or enter the 6-digit OTP."}
                {forgotStep === 3 && "Create a new strong password for your account."}
              </p>
            </div>

            {forgotStep === 1 && (
              <form onSubmit={handleForgotStep1} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Registered Email / ईमेल</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full text-xs p-3 bg-[#050811] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500 font-mono"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isForgotLoading}
                  className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer border-none disabled:opacity-50"
                >
                  {isForgotLoading ? "Verifying..." : "Find Account & Continue →"}
                </button>
              </form>
            )}

            {forgotStep === 2 && (
              <form onSubmit={handleForgotStep2} className="space-y-3.5">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-[10px] text-amber-400 uppercase font-bold block">Security Question:</span>
                  <p className="text-xs text-white font-semibold">{forgotQuestion}</p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Your Security Answer</label>
                  <input
                    type="text"
                    value={forgotAnswer}
                    onChange={(e) => setForgotAnswer(e.target.value)}
                    placeholder="Enter answer"
                    className="w-full text-xs p-3 bg-[#050811] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="relative flex items-center justify-center my-1">
                  <div className="border-t border-slate-800 w-full" />
                  <span className="bg-[#0A0F1D] px-2 text-[10px] text-slate-500 uppercase font-bold">OR OTP CODE</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    6-Digit OTP Code {forgotOtpHint && <span className="text-amber-400 font-mono">({forgotOtpHint})</span>}
                  </label>
                  <input
                    type="text"
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value)}
                    placeholder="e.g. 849201"
                    maxLength={6}
                    className="w-full text-xs p-3 bg-[#050811] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500 font-mono tracking-widest text-center text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isForgotLoading}
                  className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer border-none disabled:opacity-50"
                >
                  {isForgotLoading ? "Verifying..." : "Verify & Set New Password →"}
                </button>
              </form>
            )}

            {forgotStep === 3 && (
              <form onSubmit={handleForgotStep3} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">New Strong Password</label>
                  <input
                    type="password"
                    value={forgotNewPassword}
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs p-3 bg-[#050811] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500 font-mono"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isForgotLoading}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer border-none disabled:opacity-50"
                >
                  {isForgotLoading ? "Updating..." : "Save Password & Login 🔐"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 4. REAL SOCIAL LOGIN MODAL (Google & Facebook) */}
      {socialModalProvider && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D1322] border border-slate-700 rounded-3xl max-w-sm w-full p-6 space-y-4 text-left shadow-2xl relative animate-fade-in">
            <button
              onClick={() => setSocialModalProvider(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-sm font-bold text-white">
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

            <p className="text-xs text-slate-400">
              Enter your {socialModalProvider === 'google' ? 'Google' : 'Facebook'} account details to continue to Hans Compain.
            </p>

            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Your Name / नाम</label>
                <input
                  type="text"
                  value={socialUserName}
                  onChange={(e) => setSocialUserName(e.target.value)}
                  placeholder="e.g. Anand Sharma"
                  className="w-full text-xs p-3 bg-[#050811] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  {socialModalProvider === 'google' ? 'Google Email (@gmail.com)' : 'Facebook Email or Mobile'}
                </label>
                <input
                  type="email"
                  value={socialUserEmail}
                  onChange={(e) => setSocialUserEmail(e.target.value)}
                  placeholder={socialModalProvider === 'google' ? 'your.name@gmail.com' : 'user@facebook.com'}
                  className="w-full text-xs p-3 bg-[#050811] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 font-mono"
                  required
                />
              </div>

              <button
                type="button"
                onClick={() => handleSocialLogin(socialModalProvider)}
                className={`w-full py-3 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all cursor-pointer border-none ${
                  socialModalProvider === 'google' 
                    ? 'bg-red-600 hover:bg-red-500 shadow-red-950/40' 
                    : 'bg-blue-600 hover:bg-blue-500 shadow-blue-950/40'
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
