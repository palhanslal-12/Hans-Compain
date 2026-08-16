import React from 'react';
import { ShieldCheck, AlertTriangle, Lock, BookOpen, CheckCircle, Scale, X, ExternalLink } from 'lucide-react';

interface AiPublicRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: string;
}

export const AiPublicRulesModal: React.FC<AiPublicRulesModalProps> = ({
  isOpen,
  onClose,
  language = 'hindi',
}) => {
  if (!isOpen) return null;

  const isHindi = language === 'hindi';

  const rules = [
    {
      id: 1,
      icon: <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />,
      badge: isHindi ? 'सत्यापन नियम' : 'Verification Rule',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      title: isHindi ? '1. परीक्षा तिथियां व तथ्य सत्यापन (Fact-Checking & Verification)' : '1. Fact-Checking & Exam Verification',
      desc: isHindi
        ? 'AI शैक्षिक मार्गदर्शन व विषय-समझ हेतु है। सरकारी अधिसूचनाओं, परीक्षा कट-ऑफ, आवेदन तिथियों और आधिकारिक नियमों की पुष्टि हमेशा आधिकारिक पोर्टल (SSC, UPSC, NTA, RRB) से करें।'
        : 'AI is designed for learning and study assistance. Always cross-verify critical exam dates, official notifications, and cut-off marks with official government portals (SSC, UPSC, NTA).'
    },
    {
      id: 2,
      icon: <Lock className="w-5 h-5 text-amber-400 shrink-0" />,
      badge: isHindi ? 'गोपनीयता' : 'Privacy Rule',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      title: isHindi ? '2. व्यक्तिगत व संवेदनशील जानकारी सुरक्षा (No Sensitive Data Sharing)' : '2. Do Not Share Sensitive Personal Information',
      desc: isHindi
        ? 'चैट में कभी भी अपने पासवर्ड, बैंक खाता, UPI पिन, आधार कार्ड, पैन नंबर या व्यक्तिगत गोपनीय दस्तावेज साझा न करें।'
        : 'Never share passwords, bank accounts, UPI PINs, Aadhaar, PAN card numbers, or confidential personal credentials in AI chat prompts.'
    },
    {
      id: 3,
      icon: <Scale className="w-5 h-5 text-indigo-400 shrink-0" />,
      badge: isHindi ? 'नैतिक उपयोग' : 'Ethical Use',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      title: isHindi ? '3. सकारात्मक व नैतिक आचरण (Ethical AI & Academic Integrity)' : '3. Ethical Conduct & Academic Integrity',
      desc: isHindi
        ? 'अभद्र भाषा, घृणास्पद सामग्री, या लाइव परीक्षा हॉल में अनुचित लाभ हेतु AI का उपयोग सख्त वर्जित है। AI का उपयोग ज्ञान बढ़ाने और आत्म-अध्ययन के लिए करें।'
        : 'Abusive language, hate speech, illegal queries, or unauthorized exam-hall usage are strictly prohibited. Use AI positively to accelerate self-study and conceptual clarity.'
    },
    {
      id: 4,
      icon: <BookOpen className="w-5 h-5 text-cyan-400 shrink-0" />,
      badge: isHindi ? 'शैक्षणिक उद्देश्य' : 'Educational Focus',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      title: isHindi ? '4. शैक्षणिक व करियर मार्गदर्शन (Dedicated Academic Purpose)' : '4. Academic & Skill Building Focus',
      desc: isHindi
        ? 'HansAI विशेष रूप से SSC, Stenography (Pitman Shorthand), GK, English, Maths व अन्य प्रतियोगी परीक्षाओं की तैयारी को आसान बनाने हेतु तैयार किया गया है।'
        : 'HansAI is tailored for competitive exams (SSC CGL/CHSL/Steno, State Exams), shorthand dictation, notes revision, and doubt clearing.'
    },
    {
      id: 5,
      icon: <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />,
      badge: isHindi ? 'AI सीमाएं' : 'AI Limitations',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      title: isHindi ? '5. AI की सीमाएं व मानवीय विवेक (AI Limitations & Human Judgment)' : '5. AI Limitations & Responsible Judgment',
      desc: isHindi
        ? 'AI कभी-कभी अप्रत्याशित या अधूरी जानकारी दे सकता है। अपने विवेक का उपयोग करें और संदेह होने पर शिक्षक या मानक पाठ्यपुस्तकों से परामर्श लें।'
        : 'AI may occasionally make errors or provide incomplete information. Use your critical judgment and consult standard textbooks or mentors when in doubt.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in text-left">
      <div className="bg-[#0A0E1A] border border-indigo-500/40 w-full max-w-2xl rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-700 transition-all cursor-pointer border-none"
          title="Close Modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3 border-b border-slate-800 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 shrink-0">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30 font-mono">
                PUBLIC AI GUIDELINES
              </span>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">
                ✓ Verified Standards
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white mt-1">
              {isHindi ? 'पब्लिक AI उपयोग के महत्वपूर्ण नियम व दिशानिर्देश' : 'Public AI Usage Rules & Safety Guidelines'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isHindi
                ? 'HansAI का सुरक्षित, नैतिक और प्रभावी उपयोग सुनिश्चित करने के लिए आवश्यक दिशा-निर्देश'
                : 'Essential guidelines ensuring safe, ethical, and productive AI learning for all users.'}
            </p>
          </div>
        </div>

        {/* Rules List */}
        <div className="space-y-3.5">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="p-3.5 rounded-2xl bg-[#0F1526] border border-slate-800/80 hover:border-indigo-500/40 transition-all space-y-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {rule.icon}
                  <h3 className="text-xs sm:text-sm font-bold text-white">
                    {rule.title}
                  </h3>
                </div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border font-mono ${rule.badgeColor}`}>
                  {rule.badge}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed pl-7">
                {rule.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Responsible AI Guarantee Box */}
        <div className="p-3.5 bg-gradient-to-r from-emerald-950/40 via-cyan-950/30 to-indigo-950/40 border border-emerald-500/30 rounded-2xl flex items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <span className="font-bold text-emerald-300 block">
              🛡️ {isHindi ? 'छात्र हित व डेटा सुरक्षा सर्वोपरि' : 'Student Privacy & Safety First'}
            </span>
            <span className="text-[11px] text-slate-300">
              {isHindi
                ? 'आपकी चैट हिस्ट्री आपके स्थानीय ब्राउज़र में सुरक्षित रहती है और इसे किसी बाहरी विज्ञापनदाता को नहीं बेचा जाता।'
                : 'Your chat history stays safe in your local session and is never sold to third-party advertisers.'}
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <span className="text-[10px] text-slate-400 font-mono">
            HansAI Standards • Version 2.4 Active
          </span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-550 hover:to-cyan-550 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-500/20 transition-all cursor-pointer border-none"
          >
            {isHindi ? 'मैं सहमत हूँ (I Understand & Agree)' : 'I Understand & Agree'}
          </button>
        </div>
      </div>
    </div>
  );
};
