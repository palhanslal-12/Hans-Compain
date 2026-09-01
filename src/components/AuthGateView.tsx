import { AiPublicRulesModal } from './AiPublicRulesModal';
import React, { useState, useEffect } from 'react';
import { Lock, Mail, Phone, User, Eye, EyeOff, ShieldCheck, Sparkles, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { HansCompainLogo } from './HansCompainLogo';

interface AuthGateViewProps {
  setUser: (u: { name: string; email: string; phone?: string; role?: string } | null) => void;
  showToast: (msg: string, type?: 'info' | 'success' | 'warn') => void;
  onOpenForgot: () => void;
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

export const AuthGateView: React.FC<AuthGateViewProps> = ({ setUser, showToast, onOpenForgot }) => {
  const [activeTab, setActiveTab] = useState<'register' | 'login'>('register');

  // Register State (NO invite code!)
  const [regName, setRegName] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regPhone, setRegPhone] = useState("");
  const [regOtp, setRegOtp] = useState("");
  const [isSendingRegOtp, setIsSendingRegOtp] = useState(false);
  const [regOtpSent, setRegOtpSent] = useState(false);
  const [regOtpTimer, setRegOtpTimer] = useState(0);
  const [regOtpHint, setRegOtpHint] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  // Login State
  const [loginMode, setLoginMode] = useState<'password' | 'otp'>('password');
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginOtp, setLoginOtp] = useState("");
  const [isSendingLoginOtp, setIsSendingLoginOtp] = useState(false);
  const [loginOtpSent, setLoginOtpSent] = useState(false);
  const [loginOtpTimer, setLoginOtpTimer] = useState(0);
  const [loginOtpHint, setLoginOtpHint] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  // OTP Timers
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

  // Send Registration OTP
  const handleSendRegOtp = async () => {
    const cleanPhone = regPhone.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      showToast("कृपया 10-अंकों का वैध मोबाइल नंबर दर्ज करें (Enter valid 10-digit mobile number).", "warn");
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
      showToast(err.message || "OTP भेजने में त्रुटि।", "warn");
    } finally {
      setIsSendingRegOtp(false);
    }
  };

  // Submit Registration (Sign Up)
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      showToast("Please enter your name.", "warn");
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      showToast("Password must be at least 6 characters.", "warn");
      return;
    }
    const cleanPhone = regPhone.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      showToast("Please enter a valid 10-digit mobile number.", "warn");
      return;
    }

    setIsRegistering(true);
    try {
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
          setActiveTab('login');
          setLoginIdentifier(cleanPhone);
          return;
        }
        throw new Error(data.error || "Registration failed");
      }

      const displayName = getCleanDisplayName(regName.trim(), cleanPhone);
      const uObj = { name: displayName, email: `${cleanPhone}@student.hansai.in`, phone: cleanPhone, role: 'student' };
      setUser(uObj);
      localStorage.setItem('hansai-user-session', JSON.stringify(uObj));
      showToast(`Welcome to Hans Compain, ${displayName}! 🚀`, "success");
    } catch (err: any) {
      showToast(err.message || "Registration failed. Please check details or login.", "warn");
    } finally {
      setIsRegistering(false);
    }
  };

  // Send Login OTP
  const handleSendLoginOtp = async () => {
    const rawTarget = loginIdentifier.trim();
    if (!rawTarget) {
      showToast("कृपया मोबाइल नंबर या ईमेल दर्ज करें।", "warn");
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
      showToast(err.message || "OTP भेजने में त्रुटि।", "warn");
    } finally {
      setIsSendingLoginOtp(false);
    }
  };

  // Submit Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawTarget = loginIdentifier.trim();
    if (!rawTarget) {
      showToast("Please enter Mobile or Email.", "warn");
      return;
    }

    setIsLoggingIn(true);
    try {
      if (loginMode === 'otp') {
        if (!loginOtp || loginOtp.trim().length < 4) {
          showToast("कृपया सही सुरक्षा OTP कोड दर्ज करें।", "warn");
          setIsLoggingIn(false);
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
        showToast(`Welcome back, ${displayName}! Portal unlocked. 🔐`, "success");
      } else {
        if (!loginPassword.trim()) {
          showToast("Please enter your password.", "warn");
          setIsLoggingIn(false);
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
        if (!res.ok) throw new Error(data.error || "Invalid credentials");

        const displayName = getCleanDisplayName(data.user?.name, rawTarget);
        const uObj = { name: displayName, email: data.user?.email || cleanEmail, phone: data.user?.phone, role: 'student' };
        setUser(uObj);
        localStorage.setItem('hansai-user-session', JSON.stringify(uObj));
        showToast(`Welcome back, ${displayName}! 🔐`, "success");
      }
    } catch (err: any) {
      showToast(err.message || "Login failed. Check password or use OTP login.", "warn");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#eef2f6] text-slate-900 min-h-full flex items-center justify-center">
      <div className="max-w-md w-full bg-[#f8fafc] border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative animate-fade-in my-auto">
        
        {/* Top Logo and Header */}
        <div className="text-center space-y-2 flex flex-col items-center">
          <HansCompainLogo size="md" />

          <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight pt-1">
            {activeTab === 'register' ? 'Register' : 'Sign In'}
          </h1>

          <p className="text-xs text-slate-500 font-medium px-2">
            {activeTab === 'register'
              ? 'Create your Hans Compain student account'
              : 'Sign in to access your quizzes, notes & study tools'}
          </p>
        </div>

        {/* Tab Switcher: Register vs Sign In */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-200/80 rounded-2xl border border-slate-300">
          <button
            onClick={() => setActiveTab('register')}
            className={`py-2 px-3 text-xs font-black rounded-xl transition-all cursor-pointer border-none flex items-center justify-center gap-1.5 ${
              activeTab === 'register'
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 bg-transparent"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Register</span>
          </button>

          <button
            onClick={() => setActiveTab('login')}
            className={`py-2 px-3 text-xs font-black rounded-xl transition-all cursor-pointer border-none flex items-center justify-center gap-1.5 ${
              activeTab === 'login'
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 bg-transparent"
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        </div>

        {/* TAB 1: REGISTER FORM (EXACT SPECIFICATION: USER, PASSWORD, PHONE +91, OTP CODE, SIGN UP - NO INVITE CODE!) */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4 animate-fade-in text-left">
            
            {/* Field 1: User / Full Name */}
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

            {/* Field 3: Phone (+91) */}
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

            {/* Live Demo OTP display */}
            {regOtpHint && (
              <div className="text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-center">
                Verification OTP Code: <span className="font-black text-emerald-900">{regOtpHint}</span>
              </div>
            )}

            {/* Field 5: Sign Up Button (Solid Emerald Green Rounded Pill) */}
            <button
              type="submit"
              disabled={isRegistering}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-black text-base rounded-2xl transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer border-none disabled:opacity-50 mt-2"
            >
              {isRegistering ? (
                <span>Signing Up...</span>
              ) : (
                <span>Sign Up</span>
              )}
            </button>
          </form>
        )}

        {/* TAB 2: SIGN IN FORM */}
        {activeTab === 'login' && (
          <div className="space-y-4 animate-fade-in text-left">
            
            {/* Mode Selector */}
            <div className="grid grid-cols-2 gap-1 bg-slate-200/70 p-1 rounded-xl border border-slate-300">
              <button
                type="button"
                onClick={() => setLoginMode('password')}
                className={`py-1.5 px-2 text-xs font-bold rounded-lg transition-all border-none cursor-pointer ${
                  loginMode === 'password' ? 'bg-emerald-600 text-white' : 'text-slate-600 bg-transparent'
                }`}
              >
                Password
              </button>
              <button
                type="button"
                onClick={() => setLoginMode('otp')}
                className={`py-1.5 px-2 text-xs font-bold rounded-lg transition-all border-none cursor-pointer ${
                  loginMode === 'otp' ? 'bg-emerald-600 text-white' : 'text-slate-600 bg-transparent'
                }`}
              >
                OTP Login
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Identifier */}
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

              {/* Password Mode */}
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
                      onClick={onOpenForgot}
                      className="text-xs font-semibold text-emerald-600 hover:underline bg-transparent border-none cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </div>
              )}

              {/* OTP Mode */}
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
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap border-none disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed shadow-xs"
                    >
                      {isSendingLoginOtp ? "Sending..." : loginOtpTimer > 0 ? `Resend (${loginOtpTimer}s)` : "Get OTP"}
                    </button>
                  </div>

                  {loginOtpHint && (
                    <div className="text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-center">
                      Security OTP: <span className="font-black text-emerald-900">{loginOtpHint}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-black text-base rounded-2xl transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer border-none disabled:opacity-50 mt-2"
              >
                {isLoggingIn ? (
                  <span>Signing In...</span>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>
          </div>
        )}

        <div className="pt-3 border-t border-slate-200 text-center text-[11px] text-slate-400 space-y-1.5">
          <div>
            By accessing Hans Compain, you agree to our{" "}
            <button
              type="button"
              onClick={() => setIsTermsOpen(true)}
              className="text-emerald-600 hover:text-emerald-700 font-bold underline bg-transparent border-none cursor-pointer"
            >
              Terms & Conditions (नियम व शर्तें)
            </button>
          </div>
          <div>Secure OTP & SHA-256 Authentication Guard</div>
          <div className="font-bold text-slate-600">Hans Compain Academic Ecosystem • LEARN • ASK • GROW</div>
        </div>

        {/* Terms & Conditions Modal */}
        <AiPublicRulesModal
          isOpen={isTermsOpen}
          onClose={() => setIsTermsOpen(false)}
          language="hindi"
        />

      </div>
    </div>
  );
};
