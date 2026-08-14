import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  GraduationCap, 
  BrainCircuit, 
  PenTool, 
  MapPin, 
  BookOpen, 
  Calculator, 
  Mic, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  X,
  Volume2
} from 'lucide-react';

interface StartupIntroSplashProps {
  onComplete: () => void;
  onExploreFeature?: (featureId: string) => void;
  language?: 'hindi' | 'english';
}

export const StartupIntroSplash: React.FC<StartupIntroSplashProps> = ({ 
  onComplete,
  onExploreFeature,
  language = 'hindi'
}) => {
  const [activeFeatureIdx, setActiveFeatureIdx] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const features = [
    {
      id: 'chat',
      icon: GraduationCap,
      color: 'from-emerald-500 to-green-600',
      textColor: 'text-emerald-400',
      badge: 'Academic Core',
      title: language === 'hindi' ? 'एआई विषय विशेषज्ञ (AI Subject Tutor)' : 'AI Academic Multi-Subject Tutor',
      desc: language === 'hindi' 
        ? 'भूगोल, इतिहास, राजव्यवस्था, सामान्य विज्ञान, गणित व अंग्रेजी के हर टॉपिक का विस्तृत व चरणबद्ध अध्ययन।' 
        : 'Deep step-by-step master explanations for Geography, History, Polity, Science, Math & Reasoning.'
    },
    {
      id: 'quiz',
      icon: BrainCircuit,
      color: 'from-amber-500 to-orange-600',
      textColor: 'text-amber-400',
      badge: 'Interactive Tests',
      title: language === 'hindi' ? 'ऑटो चैप्टर क्विज़ मास्टर (Auto Quiz Master)' : 'Auto Chapter Quiz Master',
      desc: language === 'hindi' 
        ? 'नेगेटिव मार्किंग, स्कोरकार्ड, स्वतः सुरक्षित रिकॉर्ड्स (Auto-Save) एवं हर प्रश्न की पूर्ण व्याख्या।' 
        : 'Instant 5-question exam MCQs with negative marking, auto-saved test records & full review explanations.'
    },
    {
      id: 'shorthand',
      icon: PenTool,
      color: 'from-indigo-500 to-purple-600',
      textColor: 'text-indigo-400',
      badge: 'Skill Lab',
      title: language === 'hindi' ? 'पिटमैन आशुलिपि व डिक्टेशन (Shorthand Master)' : 'Pitman Shorthand & Audio Dictation',
      desc: language === 'hindi' 
        ? 'हिंदी मानक/विशिष्ट एवं इंग्लिश पिटमैन नियम, स्ट्रोक्स गाइड तथा 40 से 120 WPM वॉयस डिक्टेशन टाइमर।' 
        : 'Comprehensive Hindi/English shorthand stroke guides with multi-speed (40-120 WPM) audio player.'
    },
    {
      icon: MapPin,
      color: 'from-cyan-500 to-blue-600',
      textColor: 'text-cyan-400',
      badge: 'Geography GIS',
      title: language === 'hindi' ? 'जीआईएस व उपग्रह मानचित्र (Satellite Maps)' : 'Interactive GIS & Satellite Maps',
      desc: language === 'hindi' 
        ? 'ओपनस्ट्रीट व सैटेलाइट व्यू, दूरी व मार्ग गणना, अक्षांश-देशांतर लोकेटर और लाइव अर्थ मैपिंग।' 
        : 'Full satellite imagery, topological maps, distance calculator, and real-time coordinate finder.'
    },
    {
      icon: BookOpen,
      color: 'from-teal-500 to-emerald-600',
      textColor: 'text-teal-400',
      badge: 'Library & OCR',
      title: language === 'hindi' ? 'डिजिटल लाइब्रेरी व स्मार्ट OCR (Book OCR)' : 'Digital Library & Smart Image OCR',
      desc: language === 'hindi' 
        ? 'पाठ्यपुस्तकें, पीडीएफ रीडर, नोट्स हाइलाइटर और हस्तलिखित/प्रिंटेड पृष्ठों से त्वरित टेक्स्ट कन्वर्शन।' 
        : 'Curriculum textbook library with PDF reader and instant handwritten/printed photo-to-text OCR.'
    },
    {
      icon: Calculator,
      color: 'from-pink-500 to-rose-600',
      textColor: 'text-pink-400',
      badge: 'Business Tools',
      title: language === 'hindi' ? 'कृषि व व्यापार कैलकुलेटर (Agro Calculators)' : 'Agro-Commerce & Profit Calculators',
      desc: language === 'hindi' 
        ? 'फसल पैदावार, मंडी भाव, ईएमआई, जीएसटी, लाभ-हानि व व्यवसाय वृद्धि अनुमान टूल्स।' 
        : 'Crop yield estimation, mandi rate tools, loan EMI, GST, margin calculation & financial projections.'
    },
    {
      icon: Mic,
      color: 'from-violet-500 to-indigo-600',
      textColor: 'text-violet-400',
      badge: 'Voice Lab',
      title: language === 'hindi' ? 'वॉयस लेक्चर रिकॉर्डर व प्रोजेक्ट्स (Voice Notes)' : 'Voice Study Recorder & Projects',
      desc: language === 'hindi' 
        ? 'कक्षा व्याख्यान ऑडियो रिकॉर्डिंग, वॉयस नोट्स ट्रांसक्रिप्शन और व्यवस्थित स्टडी बाइंडर्स।' 
        : 'Lecture audio recording, study binders, voice notes organizer, and audio playback archive.'
    },
    {
      icon: ShieldCheck,
      color: 'from-blue-600 to-indigo-700',
      textColor: 'text-blue-400',
      badge: 'Security 100%',
      title: language === 'hindi' ? '100% सुरक्षित पोर्टल (Encrypted Security)' : '100% Safe & Encrypted Security',
      desc: language === 'hindi' 
        ? 'SHA-256 एन्क्रिप्टेड पासवर्ड्स, सोशल ऑथेंटिकेशन, लाइव एक्टिविटी ट्रैकर और शून्य डेटा लीक।' 
        : 'SHA-256 password salting, real social login, live user activity tracker & private admin console.'
    }
  ];

  // Auto rotate features highlight every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFeatureIdx((prev) => (prev + 1) % features.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [features.length]);

  const handleFinish = () => {
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 400);
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030712]/95 backdrop-blur-xl transition-opacity duration-400 ${
        isExiting ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Dynamic Background Glow Rings */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-2xl w-full bg-[#090E1D]/90 border border-slate-700/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center overflow-hidden">
        
        {/* Skip / Close Button Top Right */}
        <button
          onClick={handleFinish}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors cursor-pointer text-xs flex items-center gap-1 border border-slate-700/50"
        >
          <span>{language === 'hindi' ? 'छोड़ें (Skip)' : 'Skip'}</span>
          <X className="w-3.5 h-3.5" />
        </button>

        {/* LOGO & BRAND ANIMATION */}
        <div className="flex flex-col items-center justify-center pt-2 space-y-3">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center animate-bounce duration-1000">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-full blur-xl" />
            <img 
              src="/logo.svg" 
              alt="Hans Compain Logo" 
              className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(34,197,94,0.35)]" 
            />
          </div>

          {/* Typography */}
          <div>
            <div className="text-2xl sm:text-4xl font-black tracking-wider flex items-center justify-center gap-2">
              <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-500 bg-clip-text text-transparent">
                HANS
              </span>
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
                COMPAIN
              </span>
            </div>

            {/* Slogan with stylish bullets */}
            <div className="flex items-center justify-center gap-3 text-xs sm:text-sm font-black tracking-widest text-slate-300 mt-2">
              <span className="text-emerald-400">LEARN</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-cyan-400">ASK</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span className="text-blue-400">GROW</span>
            </div>
          </div>
        </div>

        {/* FEATURE HIGHLIGHT CAROUSEL */}
        <div className="bg-[#050914]/80 border border-slate-800 rounded-2xl p-4 sm:p-5 text-left transition-all">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-[11px] font-black text-slate-300 uppercase tracking-wider">
                {language === 'hindi' ? 'प्रमुख फीचर्स एवं क्षमताएं' : 'Featured Core Capabilities'}
              </span>
            </div>
            <span className="text-[10px] bg-slate-800 text-slate-400 font-mono px-2 py-0.5 rounded-full">
              {activeFeatureIdx + 1} / {features.length}
            </span>
          </div>

          {/* Active Feature Card */}
          {(() => {
            const feat = features[activeFeatureIdx];
            const IconComp = feat.icon;
            return (
              <div 
                onClick={() => {
                  if (feat.id && onExploreFeature) {
                    onExploreFeature(feat.id);
                  }
                }}
                className={`flex items-start gap-4 p-2 rounded-xl transition-all ${onExploreFeature ? 'cursor-pointer hover:bg-slate-850/60' : ''}`}
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feat.color} text-white flex items-center justify-center shrink-0 shadow-lg`}>
                  <IconComp className="w-6 h-6" />
                </div>
                <div className="space-y-1 overflow-hidden flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white truncate">{feat.title}</span>
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-slate-800 ${feat.textColor}`}>
                      {feat.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })()}

          {/* Feature Indicator Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-4 pt-2 border-t border-slate-800/50">
            {features.map((f, i) => (
              <button
                key={i}
                onClick={() => setActiveFeatureIdx(i)}
                className={`h-1.5 rounded-full transition-all cursor-pointer border-none ${
                  activeFeatureIdx === i 
                    ? 'w-6 bg-gradient-to-r from-emerald-400 to-cyan-400' 
                    : 'w-1.5 bg-slate-700 hover:bg-slate-600'
                }`}
                title={f.title}
              />
            ))}
          </div>
        </div>

        {/* Enter Button Action */}
        <div className="pt-2">
          <button
            onClick={handleFinish}
            className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-emerald-950/50 hover:shadow-cyan-500/20 transition-all flex items-center justify-center gap-3 cursor-pointer border-none"
          >
            <span>{language === 'hindi' ? 'पोर्टल में प्रवेश करें (Enter Hans Compain)' : 'Get Started with Hans Compain'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom Trust & Security Banner */}
        <div className="flex items-center justify-center gap-4 text-[10px] text-slate-500 pt-1">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            100% Privacy Protected
          </span>
          <span>•</span>
          <span>Verified Academic AI Ecosystem</span>
          <span>•</span>
          <span>v3.8 Multi-Tool</span>
        </div>

      </div>
    </div>
  );
};
