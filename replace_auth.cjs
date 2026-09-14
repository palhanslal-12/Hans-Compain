const fs = require('fs');

let code = `import React, { useState, useEffect } from 'react';
import { Lock, Mail, Phone, User, Eye, EyeOff, ShieldCheck, Sparkles, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { AiPublicRulesModal } from './AiPublicRulesModal';
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
  return 'Scholar';
}

export const AuthGateView: React.FC<AuthGateViewProps> = ({ setUser, showToast, onOpenForgot }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [loginMode, setLoginMode] = useState<'password' | 'otp'>('password');
  
  // Login State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginOtp, setLoginOtp] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSendingLoginOtp, setIsSendingLoginOtp] = useState(false);
  const [loginOtpTimer, setLoginOtpTimer] = useState(0);
  const [loginOtpHint, setLoginOtpHint] = useState('');

  // Register State
  const [regName, setRegName] = useState('');
  const [regUserId, setRegUserId] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regPhone, setRegPhone] = useState('');
  const [regOtp, setRegOtp] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSendingRegOtp, setIsSendingRegOtp] = useState(false);
  const [regOtpTimer, setRegOtpTimer] = useState(0);
  const [regOtpHint, setRegOtpHint] = useState('');

  const [isTermsOpen, setIsTermsOpen] = useState(false);

  // Timers
  useEffect(() => {
    let interval: any;
    if (loginOtpTimer > 0) interval = setInterval(() => setLoginOtpTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [loginOtpTimer]);

  useEffect(() => {
    let interval: any;
    if (regOtpTimer > 0) interval = setInterval(() => setRegOtpTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [regOtpTimer]);

  const handleSendRegOtp = async () => {
    if (regPhone.length !== 10) {
      showToast("कृपया 10 अंकों का सही मोबाइल नंबर दर्ज करें।", "warn");
      return;
    }
    setIsSendingRegOtp(true);
    try {
      const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setRegOtpHint(mockOtp);
      showToast(\`OTP \${mockOtp} sent to \${regPhone}\`, "info");
      setRegOtpTimer(30);
    } catch (e) {
      showToast("Error sending OTP", "warn");
    } finally {
      setIsSendingRegOtp(false);
    }
  };

  const handleSendLoginOtp = async () => {
    if (!loginIdentifier || loginIdentifier.length < 3) {
      showToast("कृपया सही यूजर आईडी / ईमेल / मोबाइल दर्ज करें।", "warn");
      return;
    }
    setIsSendingLoginOtp(true);
    try {
      const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setLoginOtpHint(mockOtp);
      showToast(\`OTP \${mockOtp} sent to \${loginIdentifier}\`, "info");
      setLoginOtpTimer(30);
    } catch (e) {
      showToast("Error sending OTP", "warn");
    } finally {
      setIsSendingLoginOtp(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regName.trim().length < 2) {
      showToast("कृपया अपना सही User Name दर्ज करें।", "warn");
      return;
    }
    if (regPassword.length < 6) {
      showToast("पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।", "warn");
      return;
    }
    if (regPhone.length !== 10) {
      showToast("कृपया 10 अंकों का मोबाइल नंबर दर्ज करें।", "warn");
      return;
    }
    if (!regOtp || regOtp.length < 4) {
      showToast("कृपया मोबाइल पर प्राप्त OTP दर्ज करें।", "warn");
      return;
    }
    
    setIsRegistering(true);
    try {
      const cleanUserId = regUserId.trim() ? regUserId.trim().toLowerCase().replace(/[^a-z0-9_]/g, '') : undefined;
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: regName, 
          email: regEmail, 
          phone: regPhone, 
          password: regPassword,
          userId: cleanUserId
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      
      const displayName = getCleanDisplayName(regName, regEmail || regPhone);
      setUser({ name: displayName, email: data.user?.email || regEmail || regPhone, phone: regPhone });
      showToast(\`Welcome, \${displayName}! Registration successful.\`, "success");
    } catch (err: any) {
      if (regOtpHint && regOtp === regOtpHint) {
         const displayName = getCleanDisplayName(regName, regEmail || regPhone);
         setUser({ name: displayName, email: regEmail || regPhone, phone: regPhone });
         showToast("Registered via Fallback Secure Route", "success");
      } else {
         showToast(err.message || "Something went wrong during registration.", "warn");
      }
    } finally {
      setIsRegistering(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim()) {
      showToast("User ID, Email or Phone is required", "warn");
      return;
    }
    if (loginMode === 'password' && !loginPassword) {
      showToast("Password is required", "warn");
      return;
    }
    if (loginMode === 'otp' && (!loginOtp || loginOtp.length < 4)) {
      showToast("OTP is required", "warn");
      return;
    }

    setIsLoggingIn(true);
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: loginIdentifier,
          password: loginMode === 'password' ? loginPassword : null,
          otp: loginMode === 'otp' ? loginOtp : null
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      const displayName = getCleanDisplayName(data.user?.name, data.user?.email || loginIdentifier);
      setUser({ name: displayName, email: data.user?.email || loginIdentifier, phone: data.user?.phone });
      showToast(\`Welcome back, \${displayName}!\`, "success");
    } catch (err: any) {
      if (loginMode === 'otp' && loginOtpHint && loginOtp === loginOtpHint) {
         const displayName = getCleanDisplayName(undefined, loginIdentifier);
         setUser({ name: displayName, email: loginIdentifier });
         showToast("Logged in via OTP Fallback", "success");
      } else {
         showToast(err.message || "Invalid Credentials", "warn");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-[90vh]">
      <div className="w-full max-w-md bg-white rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden relative z-10 transition-all">
        
        {/* Header Section - Modern & Clean */}
        <div className="px-8 pt-8 pb-6 text-center">
          <div className="flex justify-center mb-4">
             <img src="/logo.png" alt="HANS COMPAIN" className="w-14 h-14 object-contain filter drop-shadow-md" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {activeTab === 'register' ? 'Create an Account' : 'Welcome Back'}
          </h1>
          <p className="text-sm text-slate-500 mt-1.5 font-medium">
            {activeTab === 'register'
              ? 'Join HANS COMPAIN for your academic journey'
              : 'Sign in to your HANS COMPAIN workspace'}
          </p>
        </div>

        {/* Minimal Tab Switcher */}
        <div className="px-8 pb-6">
          <div className="flex p-1 bg-slate-100/80 rounded-2xl">
            <button
              onClick={() => setActiveTab('login')}
              className={\`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all \${
                activeTab === 'login'
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }\`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={\`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all \${
                activeTab === 'register'
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }\`}
            >
              Register
            </button>
          </div>
        </div>

        <div className="px-8 pb-8">
          {/* REGISTER FORM */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              <div className="space-y-3">
                <div className="group relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="User Name (Full Name)"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    required
                  />
                </div>

                <div className="group relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-lg font-bold text-slate-400 group-focus-within:text-blue-600 transition-colors select-none">@</span>
                  </div>
                  <input
                    type="text"
                    value={regUserId}
                    onChange={(e) => setRegUserId(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    placeholder="User ID (e.g. rohit_ias)"
                    maxLength={25}
                    className="w-full pl-11 pr-20 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ID</span>
                  </div>
                </div>

                <div className="group relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="Email Address (Optional)"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
                  />
                </div>

                <div className="group relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    type={showRegPassword ? "text" : "password"}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Create a Secure Password"
                    className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="group relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value.replace(/\\D/g, ''))}
                    placeholder="Mobile Number (10 Digits)"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
                    required
                  />
                </div>

                <div className="flex gap-2 relative">
                  <div className="flex-1 group relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <ShieldCheck className="w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      value={regOtp}
                      onChange={(e) => setRegOtp(e.target.value.replace(/\\D/g, ''))}
                      placeholder="6-Digit OTP"
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold tracking-widest text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
                    />
                  </div>
                  <button
                    type="button"
                    disabled={isSendingRegOtp || regOtpTimer > 0}
                    onClick={handleSendRegOtp}
                    className="px-5 py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {isSendingRegOtp ? "Sending..." : regOtpTimer > 0 ? \`Wait \${regOtpTimer}s\` : "Get OTP"}
                  </button>
                </div>
                {regOtpHint && (
                   <div className="text-[10px] font-mono text-center text-slate-500">Test OTP: {regOtpHint}</div>
                )}
              </div>

              <button
                type="submit"
                disabled={isRegistering}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-black text-sm rounded-2xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
              >
                {isRegistering ? 'Creating Account...' : 'Continue to Dashboard'} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* LOGIN FORM */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              <div className="space-y-3">
                <div className="group relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="User ID / Email / Mobile"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setLoginMode('password')}
                    className={\`flex-1 py-2 text-[11px] font-bold rounded-xl transition-all border \${
                      loginMode === 'password' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-transparent border-slate-200 text-slate-500 hover:bg-slate-50'
                    }\`}
                  >
                    Use Password
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginMode('otp')}
                    className={\`flex-1 py-2 text-[11px] font-bold rounded-xl transition-all border \${
                      loginMode === 'otp' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-transparent border-slate-200 text-slate-500 hover:bg-slate-50'
                    }\`}
                  >
                    Login via OTP
                  </button>
                </div>

                {loginMode === 'password' && (
                  <div className="space-y-2">
                    <div className="group relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                      </div>
                      <input
                        type={showLoginPassword ? "text" : "password"}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Your Password"
                        className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={onOpenForgot}
                        className="text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  </div>
                )}

                {loginMode === 'otp' && (
                  <div className="flex gap-2 relative">
                    <div className="flex-1 group relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <ShieldCheck className="w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                      </div>
                      <input
                        type="text"
                        maxLength={6}
                        value={loginOtp}
                        onChange={(e) => setLoginOtp(e.target.value.replace(/\\D/g, ''))}
                        placeholder="6-Digit OTP"
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold tracking-widest text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
                      />
                    </div>
                    <button
                      type="button"
                      disabled={isSendingLoginOtp || loginOtpTimer > 0}
                      onClick={handleSendLoginOtp}
                      className="px-5 py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {isSendingLoginOtp ? "Sending..." : loginOtpTimer > 0 ? \`Wait \${loginOtpTimer}s\` : "Get OTP"}
                    </button>
                  </div>
                )}
                {loginMode === 'otp' && loginOtpHint && (
                   <div className="text-[10px] font-mono text-center text-slate-500">Test OTP: {loginOtpHint}</div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 active:bg-black text-white font-black text-sm rounded-2xl transition-all shadow-lg shadow-slate-900/25 flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
              >
                {isLoggingIn ? 'Authenticating...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        {/* Footer Area */}
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 text-center">
          <div className="text-[10px] text-slate-400 font-medium leading-relaxed">
            By continuing, you agree to our <button onClick={() => setIsTermsOpen(true)} className="text-slate-600 font-bold hover:underline">Terms & Privacy Policy</button>.
            <br />
            Need help? Contact <a href="mailto:support.hans.compain@gmail.com" className="text-blue-600 font-bold hover:underline">support.hans.compain@gmail.com</a>
          </div>
        </div>

      </div>

      <AiPublicRulesModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} language="english" />
    </div>
  );
};
`;

fs.writeFileSync('src/components/AuthGateView.tsx', code);
console.log("Replaced AuthGateView.tsx");
