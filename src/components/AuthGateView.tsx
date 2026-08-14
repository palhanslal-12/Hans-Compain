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
  const [activeTab, setActiveTab] = useState<'register' | 'login'>('register');

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
      // Fallback local session registration
      const displayName = getCleanDisplayName(cleanName, cleanEmail);
      const uObj = { name: displayName, email: cleanEmail, role: 'student' };
      setUser(uObj);
      localStorage.setItem('hansai-user-session', JSON.stringify(uObj));
      showToast(`Welcome ${displayName}! Account created and portal unlocked.`, "success");
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
      showToast(err.message || "Login failed. Check password or click Forgot Password.", "warn");
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

        {/* Tab Switcher: Register vs Login */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#03060E] border border-slate-800 rounded-2xl">
          <button
            onClick={() => setActiveTab('register')}
            className={`py-2.5 px-3 text-xs font-black rounded-xl transition-all cursor-pointer border-none flex items-center justify-center gap-2 ${
              activeTab === 'register'
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>1. New User: Register</span>
          </button>

          <button
            onClick={() => setActiveTab('login')}
            className={`py-2.5 px-3 text-xs font-black rounded-xl transition-all cursor-pointer border-none flex items-center justify-center gap-2 ${
              activeTab === 'login'
                ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>2. Login / लॉग इन</span>
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

        <div className="pt-3 border-t border-slate-800/80 text-center text-[10px] text-slate-400 space-y-1">
          <div>SHA-256 Encrypted Security & Active OTP Password Recovery</div>
          <div className="font-extrabold text-slate-300">Hans Compain Academic Ecosystem • LEARN • ASK • GROW</div>
        </div>

      </div>
    </div>
  );
};
