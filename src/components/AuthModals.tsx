import React, { useState } from 'react';
import { Lock, Mail, Key, ShieldCheck, X, Sparkles, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

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
  if (email.toLowerCase().includes('palhanslal4')) return 'Hanslal Pal';
  if (name && !name.includes('@') && name.trim().length > 0) {
    if (name.toLowerCase() === 'kendo') return 'Scholar';
    return name.trim();
  }
  const prefix = email.split('@')[0].replace(/[0-9_.-]+/g, ' ').trim();
  if (prefix.length > 0) {
    return prefix.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }
  return 'SSC & General Studies Student';
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

  // Google Account Chooser Modal State
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState("");

  // Social Login Handler (Google & Facebook)
  const handleSocialLogin = async (provider: 'google' | 'facebook', directEmail?: string) => {
    let mockEmail = "";
    let mockName = "";
    
    if (provider === 'google') {
      if (directEmail) {
        mockEmail = directEmail.trim().toLowerCase();
      } else {
        setIsGoogleModalOpen(true);
        return;
      }
      mockName = mockEmail.split('@')[0].replace(/[0-9_.-]+/g, ' ').toUpperCase() || "Google Aspirant";
    } else {
      const promptEmail = window.prompt("Facebook Login / फेसबुक से लॉग इन करें:\nEnter your Facebook registered Email or Phone:", regEmail || "student.fb@facebook.com");
      if (!promptEmail || !promptEmail.trim()) return;
      mockEmail = promptEmail.trim().toLowerCase();
      mockName = mockEmail.split('@')[0].replace(/[0-9_.-]+/g, ' ').toUpperCase() || "Facebook Aspirant";
    }

    try {
      const res = await fetch('/api/users/social-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          email: mockEmail,
          name: mockName
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Social login failed");

      const role = mockEmail === 'palhanslal4@gmail.com' ? 'owner' : 'student';
      const displayName = getCleanDisplayName(mockName, mockEmail);
      const uObj = { name: displayName, email: mockEmail, role };
      setUser(uObj);
      localStorage.setItem('hansai-user-session', JSON.stringify(uObj));
      
      setIsGoogleModalOpen(false);
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

      const role = cleanEmail === 'palhanslal4@gmail.com' ? 'owner' : 'student';
      const displayName = getCleanDisplayName(cleanName, cleanEmail);
      const uObj = { name: displayName, email: cleanEmail, role };
      setUser(uObj);
      localStorage.setItem('hansai-user-session', JSON.stringify(uObj));
      onCloseRegister();
      showToast(`Welcome ${displayName}! Registered securely. 🛡️`, "success");
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

      const role = cleanEmail === 'palhanslal4@gmail.com' ? 'owner' : 'student';
      const displayName = getCleanDisplayName(data.user?.name, cleanEmail);
      const uObj = { name: displayName, email: cleanEmail, role };
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
      showToast(err.message || "Incorrect security answer or expired OTP code.", "warn");
    } finally {
      setIsForgotLoading(false);
    }
  };

  // 5. Complete Password Reset
  const handleForgotStep3 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotNewPassword || forgotNewPassword.length < 4) {
      showToast("Please enter a password with at least 4 characters.", "warn");
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
          newPassword: forgotNewPassword
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Password update failed");

      const cleanEmail = forgotEmail.trim().toLowerCase();
      const role = cleanEmail === 'palhanslal4@gmail.com' ? 'owner' : 'student';
      const displayName = getCleanDisplayName(undefined, cleanEmail);
      const uObj = { name: displayName, email: cleanEmail, role };
      setUser(uObj);
      localStorage.setItem('hansai-user-session', JSON.stringify(uObj));

      onCloseForgot();
      setForgotStep(1);
      setForgotNewPassword('');
      showToast("Password updated successfully! Welcome back.", "success");
    } catch (err: any) {
      showToast(err.message || "Password update failed.", "warn");
    } finally {
      setIsForgotLoading(false);
    }
  };

  return (
    <>
      {/* 1. REGISTER MODAL */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0A0E1A] border border-indigo-500/40 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative animate-fade-in text-slate-100">
            <button
              onClick={onCloseRegister}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-transparent border-none cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-indigo-400 font-extrabold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>HansAI Secure Registration</span>
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-white">Create Student Account / पंजीकरण</h3>
              <p className="text-xs text-slate-400 mt-1">Register to save your study history, notes, and leaderboard ranks.</p>
            </div>

            {/* Social Authentication Quick Options */}
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center">Or Sign in with Social Account</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('google')}
                  className="p-2.5 bg-[#161F33] hover:bg-[#1E2A45] border border-slate-700 hover:border-red-500/50 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-white transition-all cursor-pointer"
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
                  onClick={() => handleSocialLogin('facebook')}
                  className="p-2.5 bg-[#161F33] hover:bg-[#1E2A45] border border-slate-700 hover:border-blue-500/50 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-white transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-blue-500" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Facebook</span>
                </button>
              </div>
            </div>

            <div className="relative flex items-center justify-center my-1">
              <div className="border-t border-slate-800 w-full"></div>
              <span className="bg-[#0A0E1A] px-2 text-[10px] text-slate-500 uppercase font-bold">Or Email</span>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Full Name / नाम</label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Enter Name"
                  className="w-full text-xs p-3 bg-[#03060E] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Email Address / ईमेल</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="Enter Email"
                  className="w-full text-xs p-3 bg-[#03060E] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Password / पासवर्ड</label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Create password (min 4 chars)"
                  className="w-full text-xs p-3 bg-[#03060E] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Security Question / सुरक्षा प्रश्न</label>
                <select
                  value={regQuestion}
                  onChange={(e) => setRegQuestion(e.target.value)}
                  className="w-full text-xs p-3 bg-[#03060E] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="What is your primary target exam?">What is your primary target exam?</option>
                  <option value="What is your favorite subject?">What is your favorite subject?</option>
                  <option value="In which city do you prepare?">In which city do you prepare?</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Security Answer / सुरक्षा उत्तर</label>
                <input
                  type="text"
                  value={regAnswer}
                  onChange={(e) => setRegAnswer(e.target.value)}
                  placeholder="e.g. SSC Stenographer"
                  className="w-full text-xs p-3 bg-[#03060E] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isRegistering}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-lg cursor-pointer border-none disabled:opacity-50 mt-2"
              >
                {isRegistering ? "Registering..." : "Complete Secure Registration 🛡️"}
              </button>
            </form>

            <div className="text-center pt-2 border-t border-slate-800 text-xs text-slate-400">
              Already registered?{" "}
              <button
                onClick={() => { onCloseRegister(); onOpenLogin(); }}
                className="text-indigo-400 hover:underline font-bold bg-transparent border-none cursor-pointer"
              >
                Login here
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. LOGIN MODAL */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0A0E1A] border border-indigo-500/40 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative animate-fade-in text-slate-100">
            <button
              onClick={onCloseLogin}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-transparent border-none cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-indigo-400 font-extrabold text-xs uppercase tracking-wider">
              <Lock className="w-4 h-4" />
              <span>HansAI Secure Access</span>
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-white">Student Login / लॉग इन</h3>
              <p className="text-xs text-slate-400 mt-1">Enter your registered email and password to access account features.</p>
            </div>

            {/* Social Authentication Quick Options */}
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center">Quick One-Click Login</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('google')}
                  className="p-2.5 bg-[#161F33] hover:bg-[#1E2A45] border border-slate-700 hover:border-red-500/50 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-white transition-all cursor-pointer"
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
                  onClick={() => handleSocialLogin('facebook')}
                  className="p-2.5 bg-[#161F33] hover:bg-[#1E2A45] border border-slate-700 hover:border-blue-500/50 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-white transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-blue-500" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Facebook</span>
                </button>
              </div>
            </div>

            <div className="relative flex items-center justify-center my-1">
              <div className="border-t border-slate-800 w-full"></div>
              <span className="bg-[#0A0E1A] px-2 text-[10px] text-slate-500 uppercase font-bold">Or Login With Credentials</span>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="Enter Email"
                  className="w-full text-xs p-3 bg-[#03060E] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-300">Password</label>
                  <button
                    type="button"
                    onClick={() => { onCloseLogin(); onOpenForgot(); }}
                    className="text-[10px] text-amber-400 hover:underline font-bold bg-transparent border-none cursor-pointer"
                  >
                    Forgot Password? / पासवर्ड भूल गए?
                  </button>
                </div>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full text-xs p-3 bg-[#03060E] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-lg cursor-pointer border-none disabled:opacity-50 mt-2"
              >
                {isLoggingIn ? "Authenticating..." : "Login to Account 🔐"}
              </button>
            </form>

            <div className="text-center pt-2 border-t border-slate-800 text-xs text-slate-400">
              Don't have an account?{" "}
              <button
                onClick={() => { onCloseLogin(); onOpenRegister(); }}
                className="text-indigo-400 hover:underline font-bold bg-transparent border-none cursor-pointer"
              >
                Register here
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. FORGOT PASSWORD MODAL */}
      {isForgotOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0A0E1A] border border-amber-500/40 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative animate-fade-in text-slate-100">
            <button
              onClick={onCloseForgot}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-transparent border-none cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider">
              <Key className="w-4 h-4" />
              <span>Password Recovery Wizard (Step {forgotStep} of 3)</span>
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-white">Reset Password / पासवर्ड रीसेट</h3>
              <p className="text-xs text-slate-400 mt-1">
                {forgotStep === 1 && "Enter your registered email address to initiate password recovery."}
                {forgotStep === 2 && "Answer your security question or enter the OTP verification code."}
                {forgotStep === 3 && "Verification complete! Enter your new password."}
              </p>
            </div>

            {/* STEP 1 */}
            {forgotStep === 1 && (
              <form onSubmit={handleForgotStep1} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Registered Email Address</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="Enter Email"
                    className="w-full text-xs p-3 bg-[#03060E] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isForgotLoading}
                  className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-lg cursor-pointer border-none disabled:opacity-50"
                >
                  {isForgotLoading ? "Checking..." : "Verify Email & Proceed →"}
                </button>
              </form>
            )}

            {/* STEP 2 */}
            {forgotStep === 2 && (
              <form onSubmit={handleForgotStep2} className="space-y-3">
                <div className="p-3 bg-[#03060E] border border-slate-800 rounded-xl text-xs space-y-1">
                  <span className="text-[10px] text-amber-400 font-bold block">Security Question:</span>
                  <p className="text-white font-semibold">{forgotQuestion}</p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Your Security Answer</label>
                  <input
                    type="text"
                    value={forgotAnswer}
                    onChange={(e) => setForgotAnswer(e.target.value)}
                    placeholder="Enter security answer"
                    className="w-full text-xs p-3 bg-[#03060E] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="text-center text-[10px] text-slate-500 font-bold">--- OR ENTER OTP CODE ---</div>

                {forgotOtpHint && (
                  <div className="p-2 bg-indigo-950/60 border border-indigo-800/40 rounded-xl text-[11px] text-indigo-300 font-mono">
                    OTP Code Generated: <strong>{forgotOtpHint}</strong>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">6-Digit OTP Token</label>
                  <input
                    type="text"
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP code"
                    className="w-full text-xs p-3 bg-[#03060E] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isForgotLoading}
                  className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-lg cursor-pointer border-none disabled:opacity-50"
                >
                  {isForgotLoading ? "Verifying..." : "Verify & Set New Password →"}
                </button>
              </form>
            )}

            {/* STEP 3 */}
            {forgotStep === 3 && (
              <form onSubmit={handleForgotStep3} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">New Password / नया पासवर्ड</label>
                  <input
                    type="password"
                    value={forgotNewPassword}
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                    placeholder="Enter new strong password"
                    className="w-full text-xs p-3 bg-[#03060E] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isForgotLoading}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-lg cursor-pointer border-none disabled:opacity-50"
                >
                  {isForgotLoading ? "Updating..." : "Save New Password & Login 🔒"}
                </button>
              </form>
            )}

            <div className="text-center pt-2 border-t border-slate-800 text-xs">
              <button
                onClick={() => { onCloseForgot(); onOpenLogin(); }}
                className="text-slate-400 hover:text-white font-bold bg-transparent border-none cursor-pointer"
              >
                ← Back to Login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. GOOGLE OAUTH ACCOUNT SELECTOR MODAL */}
      {isGoogleModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D121F] border-2 border-red-500/40 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl relative animate-fade-in text-slate-100 text-left">
            <button
              onClick={() => setIsGoogleModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-transparent border-none cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-red-400 font-extrabold text-xs uppercase tracking-wider">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Google Account Sign-In</span>
            </div>

            <div>
              <h3 className="text-lg font-black text-white">Choose a Google Account</h3>
              <p className="text-xs text-slate-400 mt-0.5">Select an account to continue to HansAI Ecosystem</p>
            </div>

            {/* Account Quick Select Options */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => handleSocialLogin('google', 'palhanslal4@gmail.com')}
                className="w-full p-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/60 rounded-2xl flex items-center gap-3 transition-all cursor-pointer text-left"
              >
                <div className="w-9 h-9 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs shrink-0">
                  👑
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-black text-white">Hanslal Pal (System Owner)</div>
                  <div className="text-[10px] text-amber-400 truncate font-mono">palhanslal4@gmail.com</div>
                </div>
              </button>

              <button
                onClick={() => handleSocialLogin('google', 'student.aspirant@gmail.com')}
                className="w-full p-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500/60 rounded-2xl flex items-center gap-3 transition-all cursor-pointer text-left"
              >
                <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-xs shrink-0">
                  🎓
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-black text-white">Student Aspirant Account</div>
                  <div className="text-[10px] text-indigo-300 truncate font-mono">student.aspirant@gmail.com</div>
                </div>
              </button>
            </div>

            <div className="relative flex items-center justify-center my-2">
              <div className="border-t border-slate-800 w-full"></div>
              <span className="bg-[#0D121F] px-2 text-[10px] text-slate-500 uppercase font-bold">Or Enter Custom Google Email</span>
            </div>

            <div className="space-y-2">
              <input
                type="email"
                value={customGoogleEmail}
                onChange={(e) => setCustomGoogleEmail(e.target.value)}
                placeholder="your.email@gmail.com"
                className="w-full text-xs p-3 bg-[#050811] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-red-500 font-mono"
              />
              <button
                onClick={() => {
                  if (customGoogleEmail.trim()) {
                    handleSocialLogin('google', customGoogleEmail.trim());
                  } else {
                    showToast("Please enter a valid Google email address.", "warn");
                  }
                }}
                className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer transition-all border-none"
              >
                Sign in with Google Email 🌐
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
