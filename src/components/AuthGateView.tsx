import React, { useState } from 'react';
import { Lock, User, Mail, Key, ShieldCheck, Sparkles, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { HansCompainLogo } from './HansCompainLogo';

interface AuthGateViewProps {
  setUser: (u: { name: string; email: string; role?: string } | null) => void;
  showToast: (msg: string, type?: 'info' | 'success' | 'warn') => void;
  onOpenForgot: () => void;
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

export const AuthGateView: React.FC<AuthGateViewProps> = ({ setUser, showToast, onOpenForgot }) => {
  const [activeTab, setActiveTab] = useState<'register' | 'login' | 'otp'>('login');

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

  // OTP Login state
  const [otpEmail, setOtpEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [activeOtpHint, setActiveOtpHint] = useState<string | null>(null);

  // Send OTP
  const handleSendOtp = async () => {
    const cleanEmail = otpEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      showToast("कृपया एक वैध ईमेल पता दर्ज करें।", "warn");
      return;
    }
    setIsSendingOtp(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");

      setOtpSent(true);
      setActiveOtpHint(data.otpHint || null);
      setOtpCountdown(60);
      showToast(`सुरक्षा OTP कोड (${data.otpHint || '******'}) भेजा गया है! 📩`, "success");
    } catch (err: any) {
      showToast(err.message || "OTP भेजने में त्रुटि।", "warn");
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = otpEmail.trim().toLowerCase();
    const cleanOtp = otpCode.trim();

    if (!cleanEmail || cleanOtp.length !== 6) {
      showToast("कृपया 6-अंकों का सुरक्षा OTP दर्ज करें।", "warn");
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, otp: cleanOtp })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid OTP code");

      const displayName = getCleanDisplayName(data.user?.name, cleanEmail);
      const uObj = { name: displayName, email: cleanEmail, role: data.user?.role || 'student' };
      setUser(uObj);
      localStorage.setItem('hansai-user-session', JSON.stringify(uObj));
      showToast(`सुरक्षा OTP सत्यापित! Welcome ${displayName}! 🛡️`, "success");
    } catch (err: any) {
      showToast(err.message || "गलत OTP कोड दर्ज किया गया है।", "warn");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Handle Registration Submit
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) {
      showToast("Please fill in your Name and Email.", "warn");
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
      if (!res.ok) throw new Error(data.error || "Registration failed");

      const displayName = getCleanDisplayName(cleanName, cleanEmail);
      const uObj = { name: displayName, email: cleanEmail, role: 'student' };
      setUser(uObj);
      localStorage.setItem('hansai-user-session', JSON.stringify(uObj));
      showToast(`Registration Successful! Welcome to Hans Compain, ${displayName}! 🚀`, "success");
    } catch (err: any) {
      console.error("Reg error:", err);
      showToast(err.message || "Registration failed. Please check details or login.", "warn");
    } finally {
      setIsRegistering(false);
    }
  };

  // Handle Login Submit
  const handleLogin = async (e: React.FormEvent) => {
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
      showToast(`Welcome back, ${uObj.name}! Portal unlocked. 🔐`, "success");
    } catch (err: any) {
      showToast(err.message || "Login failed. Check password or use OTP login.", "warn");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#03060E] text-slate-100 min-h-full flex items-center justify-center">
      <div className="max-w-lg w-full bg-[#0A0E1A] border-2 border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative animate-fade-in my-auto">
        
        {/* Top Header Badge */}
        <div className="text-center space-y-2 flex flex-col items-center">
          <HansCompainLogo size="md" />

          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight pt-2">
            Student Login Required / छात्र लॉगिन
          </h1>

          <p className="text-xs text-slate-300 leading-relaxed px-2">
            हंस कम्पैन के सभी फीचर्स (क्विज़, डिक्टेशन, एआई ट्यूटर) सुरक्षित उपयोग हेतु लॉगिन या नया रजिस्ट्रेशन करें।
          </p>
        </div>

        {/* Tab Switcher: Register vs Password Login vs OTP Login */}
        <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-[#03060E] border border-slate-800 rounded-2xl">
          <button
            onClick={() => setActiveTab('register')}
            className={`py-2 px-2 text-[11px] font-black rounded-xl transition-all cursor-pointer border-none flex items-center justify-center gap-1.5 ${
              activeTab === 'register'
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <User className="w-3 h-3" />
            <span>1. Register</span>
          </button>

          <button
            onClick={() => setActiveTab('login')}
            className={`py-2 px-2 text-[11px] font-black rounded-xl transition-all cursor-pointer border-none flex items-center justify-center gap-1.5 ${
              activeTab === 'login'
                ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Lock className="w-3 h-3" />
            <span>2. Password</span>
          </button>

          <button
            onClick={() => setActiveTab('otp')}
            className={`py-2 px-2 text-[11px] font-black rounded-xl transition-all cursor-pointer border-none flex items-center justify-center gap-1.5 ${
              activeTab === 'otp'
                ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            <span>3. OTP Login</span>
          </button>
        </div>

        {/* TAB 1: REGISTER FORM */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3.5 animate-fade-in text-left">
            <div className="text-xs text-emerald-300 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Step 1: Create your Hans Compain Account / नया पंजीकरण</span>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">Full Name / छात्र का नाम</label>
              <input
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Enter Name"
                className="w-full text-xs p-3 bg-[#03060E] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">Email Address / ईमेल आईडी</label>
              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="Enter Email"
                className="w-full text-xs p-3 bg-[#03060E] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">Create Password / पासवर्ड (min 6 chars)</label>
              <input
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs p-3 bg-[#03060E] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-mono"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-300 mb-1">Security Question</label>
                <select
                  value={regQuestion}
                  onChange={(e) => setRegQuestion(e.target.value)}
                  className="w-full text-[11px] p-2.5 bg-[#03060E] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="What is your primary target exam?">What is your target exam?</option>
                  <option value="What is your favorite subject?">Favorite subject?</option>
                  <option value="In which city do you prepare?">Preparation city?</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-300 mb-1">Security Answer</label>
                <input
                  type="text"
                  value={regAnswer}
                  onChange={(e) => setRegAnswer(e.target.value)}
                  placeholder="e.g. SSC 2026"
                  className="w-full text-[11px] p-2.5 bg-[#03060E] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isRegistering}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer border-none disabled:opacity-50 mt-2"
            >
              {isRegistering ? (
                <span>Registering Account...</span>
              ) : (
                <>
                  <span>Complete Registration & Enter 🚀</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* TAB 2: LOGIN FORM */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-3.5 animate-fade-in text-left">
            <div className="text-xs text-cyan-300 font-bold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Step 2: Sign In to existing account / छात्र लॉगिन</span>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">Registered Email / ईमेल</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Enter Email"
                className="w-full text-xs p-3 bg-[#03060E] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500 font-mono"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-slate-300">Password / पासवर्ड</label>
                <button
                  type="button"
                  onClick={onOpenForgot}
                  className="text-[10px] text-amber-400 hover:underline font-bold bg-transparent border-none cursor-pointer"
                >
                  Forgot Password? / पासवर्ड भूल गए?
                </button>
              </div>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs p-3 bg-[#03060E] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500 font-mono"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer border-none disabled:opacity-50 mt-2"
            >
              {isLoggingIn ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Login & Open Hans Compain 🔐</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* TAB 3: 6-DIGIT OTP LOGIN FORM */}
        {activeTab === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-3.5 animate-fade-in text-left">
            <div className="text-xs text-amber-300 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Step 3: 6-Digit Email OTP Login / वन-टाइम पासवर्ड सत्यापन</span>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">Registered Email / ईमेल</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={otpEmail}
                  onChange={(e) => setOtpEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="flex-1 text-xs p-3 bg-[#03060E] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500 font-mono"
                  required
                />
                <button
                  type="button"
                  disabled={isSendingOtp || otpCountdown > 0}
                  onClick={handleSendOtp}
                  className="px-3.5 py-2 bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/50 text-amber-300 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap disabled:opacity-50"
                >
                  {isSendingOtp ? "Sending..." : otpCountdown > 0 ? `Resend (${otpCountdown}s)` : "Get OTP 📩"}
                </button>
              </div>
            </div>

            {otpSent && (
              <div className="space-y-2 p-3 bg-amber-950/30 border border-amber-500/40 rounded-xl">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-amber-300">Enter 6-Digit OTP (सुरक्षा कोड)</label>
                  {activeOtpHint && (
                    <span className="text-[10px] text-amber-300 font-mono bg-amber-500/20 px-1.5 py-0.5 rounded">
                      OTP: {activeOtpHint}
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="6-Digit OTP"
                  className="w-full text-center tracking-[0.4em] text-lg font-black p-2.5 bg-[#03060E] border border-amber-500/60 rounded-xl text-amber-300 focus:outline-none focus:border-amber-400 font-mono"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifyingOtp || !otpSent}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-500 hover:to-orange-500 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer border-none disabled:opacity-50 mt-2"
            >
              {isVerifyingOtp ? (
                <span>Verifying Security OTP...</span>
              ) : (
                <>
                  <span>Verify OTP & Unlock Portal 🛡️</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        <div className="pt-3 border-t border-slate-800/80 text-center text-[10px] text-slate-400 space-y-1">
          <div>SHA-256 Encrypted Security & Active OTP Password Recovery</div>
          <div className="font-extrabold text-slate-300">Hans Compain Academic Ecosystem • LEARN • ASK • GROW</div>
        </div>

      </div>
    </div>
  );
};
