import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  KeyRound, 
  ArrowLeft,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';

interface AdminLockScreenProps {
  adminPasswordSecret: string;
  onUnlock: () => void;
  onBack: () => void;
  language?: string;
  showToast: (msg: string, type: 'success' | 'error' | 'info' | 'warn') => void;
  addAdminAuditLog: (action: string, category: string) => void;
}

export const AdminLockScreen: React.FC<AdminLockScreenProps> = ({
  adminPasswordSecret,
  onUnlock,
  onBack,
  language = 'hindi',
  showToast,
  addAdminAuditLog
}) => {
  const isHindi = language === 'hindi';
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  const triggerLockout = () => {
    setIsLockedOut(true);
    setLockoutSeconds(30);
    const timer = setInterval(() => {
      setLockoutSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsLockedOut(false);
          setFailedAttempts(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLockedOut) return;

    const input = passwordInput.trim();
    const validPasswords = [
      adminPasswordSecret,
      'Chhangur#@8084',
      'Chhangur@8084'
    ];

    if (validPasswords.includes(input)) {
      setErrorMsg('');
      setPasswordInput('');
      addAdminAuditLog("Admin Console Unlocked via Password", "Auth");
      showToast(
        isHindi 
          ? "🛡️ एडमिन पासवर्ड सत्यापित! स्वागत है।" 
          : "🛡️ Admin Password Verified! Welcome Founder.",
        "success"
      );
      onUnlock();
    } else {
      const newFailCount = failedAttempts + 1;
      setFailedAttempts(newFailCount);
      const masked = input.length > 2 ? input.slice(0, 2) + '***' : '***';
      addAdminAuditLog(`Failed Admin Password Attempt (${masked})`, "Security");
      
      if (newFailCount >= 4) {
        setErrorMsg(
          isHindi 
            ? "⚠️ अत्यधिक गलत प्रयास! 30 सेकंड के लिए सुरक्षा लॉक।" 
            : "⚠️ Too many failed attempts! Security lock for 30s."
        );
        triggerLockout();
      } else {
        setErrorMsg(
          isHindi 
            ? `❌ गलत पासवर्ड! कृपया सही पासवर्ड दर्ज करें (शेष प्रयास: ${4 - newFailCount})`
            : `❌ Incorrect password! Please enter correct master password (${4 - newFailCount} attempts left)`
        );
        showToast(
          isHindi ? "गलत एडमिन पासवर्ड! पहुँच अस्वीकृत ❌" : "Incorrect Admin Password! Access Denied ❌",
          "warn"
        );
      }
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto my-8 p-4 sm:p-8 bg-[#0B0F19]/95 border border-amber-500/40 rounded-3xl shadow-2xl backdrop-blur-xl animate-fade-in space-y-6 text-slate-100">
      
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isHindi ? "मुख्य ऐप पर वापस" : "Back to Main App"}</span>
        </button>
        <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold rounded-full flex items-center gap-1">
          <Lock className="w-3 h-3 text-amber-400" />
          PROTECTED ADMIN AREA
        </span>
      </div>

      {/* Hero Icon & Title */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 text-slate-950 flex items-center justify-center shadow-xl shadow-amber-500/20">
          <ShieldCheck className="w-10 h-10 text-slate-950" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase">
            {isHindi ? "एडमिन पासवर्ड प्रमाणीकरण" : "Admin Panel Authentication"}
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
            {isHindi 
              ? "सुरक्षा सूचना: केवल ईमेल लॉग-इन से एडमिन एक्सेस नहीं मिलता। ओनर कंसोल खोलने के लिए सुरक्षित पासवर्ड (Chhangur#@8084) दर्ज करें।"
              : "Security Guard: Email login alone does NOT grant Admin privileges. Enter the master admin password to open owner console."}
          </p>
        </div>
      </div>

      {/* Security Notice Box */}
      <div className="p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl flex items-start gap-2.5 text-xs text-indigo-200">
        <ShieldAlert className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">
            {isHindi ? "सुरक्षा गार्ड सक्रिय (Safe Authentication):" : "Safe Authentication Active:"}
          </span>{" "}
          {isHindi 
            ? "प्रशासकीय डेटा, क्विज़ व यूजर एनालिटिक्स को सुरक्षित रखने के लिए हर सेशन में पासवर्ड सत्यापन अनिवार्य है।"
            : "To protect admin content, quiz repository, and user analytics, master password verification is required."}
        </div>
      </div>

      {/* Lockout Banner */}
      {isLockedOut && (
        <div className="p-3 bg-rose-950/80 border border-rose-500/50 rounded-2xl text-center text-xs text-rose-300 font-bold animate-bounce">
          <AlertTriangle className="w-4 h-4 mx-auto mb-1 text-rose-400" />
          <span>
            {isHindi 
              ? `अत्यधिक गलत प्रयास! सुरक्षा हेतु ${lockoutSeconds}s के लिए लॉक किया गया...`
              : `Security Lockout Active for ${lockoutSeconds}s...`}
          </span>
        </div>
      )}

      {/* Password Submission Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-extrabold text-amber-300 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>{isHindi ? "एडमिन पासवर्ड दर्ज करें (Enter Password)" : "Enter Master Admin Password"}</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500 font-normal">Case Sensitive</span>
          </label>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              autoFocus
              disabled={isLockedOut}
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder={isHindi ? "पासवर्ड (जैसे: Chhangur#@8084)" : "Enter Admin Password"}
              className={`w-full text-sm py-3.5 pl-4 pr-11 bg-[#04070F] border ${
                errorMsg ? 'border-rose-500 text-rose-200' : 'border-amber-500/40 text-amber-300 focus:border-amber-400'
              } rounded-2xl font-mono tracking-wider outline-none transition-all shadow-inner`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-400 font-semibold mt-1.5 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMsg}</span>
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLockedOut || !passwordInput.trim()}
          className={`w-full py-3.5 rounded-2xl font-extrabold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
            isLockedOut || !passwordInput.trim()
              ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              : 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 hover:from-amber-500 hover:to-amber-300 text-slate-950 shadow-amber-600/25 active:scale-[0.99]'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>{isHindi ? "कंसोल अनलॉक करें 🔐" : "Unlock Admin Console 🔐"}</span>
        </button>
      </form>

      {/* Help hint */}
      <div className="pt-2 border-t border-slate-800/80 text-center">
        <p className="text-[10px] text-slate-500">
          {isHindi 
            ? "संस्थापक नोट: एडमिन पासवर्ड दर्ज किए बिना कंसोल में प्रवेश संभव नहीं है।"
            : "Founder Note: Access is protected. Password verification is strictly required."}
        </p>
      </div>
    </div>
  );
};
