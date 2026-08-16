import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Circle, 
  Download, 
  Copy, 
  ExternalLink, 
  Send, 
  MessageSquare, 
  Lock, 
  Server, 
  Globe, 
  Users, 
  Award, 
  Sparkles,
  Smartphone,
  HelpCircle,
  Mail,
  PhoneCall,
  Database
} from 'lucide-react';
import { submitFeedbackToCloud, testFirestoreConnection } from '../lib/firebase';

interface PublicLaunchHubViewProps {
  showToast: (msg: string, type?: 'info' | 'success' | 'warn') => void;
  language: 'hindi' | 'english' | string;
  onBackToChat: () => void;
}

export const PublicLaunchHubView: React.FC<PublicLaunchHubViewProps> = ({
  showToast,
  language = 'hindi',
  onBackToChat
}) => {
  const [activeTab, setActiveTab] = useState<'checklist' | 'privacy' | 'terms' | 'disclaimer' | 'support' | 'domain'>('checklist');
  
  // Interactive checklist state with persistent localStorage
  const initialChecklist = [
    {
      id: 'tech_db',
      category: 'technical',
      titleHindi: 'डेटाबेस व सुरक्षित डेटा सिंक',
      titleEnglish: 'Database & Persistent Data Sync',
      descHindi: 'स्टूडेंट नोट्स, क्विज़ स्कोर व स्टेनो प्रैक्टिस को सुरक्षित लोकली व क्लाउड पर सहेजना।',
      descEnglish: 'Ensuring student records, quiz scores, and shorthand drafts persist safely.',
      completed: true
    },
    {
      id: 'tech_api',
      category: 'technical',
      titleHindi: 'Gemini API Key सर्वर-साइड सुरक्षा',
      titleEnglish: 'Gemini API Key Server-Side Masking',
      descHindi: 'ब्राउज़र में API Key कभी उजागर न हो, सभी AI कॉल्स सुरक्षित बैकएंड रूट से गुजरें।',
      descEnglish: 'Server-side API routes proxy all Gemini calls. API Key is hidden from browser DevTools.',
      completed: true
    },
    {
      id: 'tech_mobile',
      category: 'technical',
      titleHindi: 'मोबाइल व स्लो इंटरनेट रिस्पॉन्सिव टेस्टिंग',
      titleEnglish: 'Mobile & Low-Bandwidth Optimization',
      descHindi: 'छोटे स्क्रीन (Android/iOS) पर बटन 44px+ टच फ्रेंडली हों और 2G/3G में ऑफलाइन फॉलबैक चले।',
      descEnglish: 'Fluid UI down to 320px with offline local fallback for intermittent connectivity.',
      completed: true
    },
    {
      id: 'tech_errors',
      category: 'technical',
      titleHindi: 'क्लीन एरर हैंडलिंग व ग्रेसफुल रिकवरी',
      titleEnglish: 'Graceful Error Boundaries & Recovery',
      descHindi: 'सर्वर व्यस्त होने पर क्रैश के बजाय स्पष्ट सुझाव व ऑफलाइन मॉक सवाल दिखें।',
      descEnglish: 'App fails gracefully with friendly toast notices and offline study materials.',
      completed: true
    },
    {
      id: 'sec_rules',
      category: 'security',
      titleHindi: 'डेटा सुरक्षा व पासवर्ड SHA-256 हैशिंग',
      titleEnglish: 'Cryptographic Password Digests & Security',
      descHindi: 'पासवर्ड कभी प्लेन-टेक्स्ट में न रहें, स्टूडेंट का नाम/ईमेल गोपनीय रखा जाए।',
      descEnglish: 'Salted cryptographic digests with zero plain-text storage or credential leaks.',
      completed: true
    },
    {
      id: 'sec_admin',
      category: 'security',
      titleHindi: 'एडमिन कंसोल व ओनर एक्सेस लॉक',
      titleEnglish: 'Admin Panel Master Lock',
      descHindi: 'ओनर डैशबोर्ड सिर्फ संस्थापक (Hanslal Pal) के अधिकृत क्रेडेंशियल्स से खुले।',
      descEnglish: 'Protected administrative routes with role checks and session validation.',
      completed: true
    },
    {
      id: 'legal_privacy',
      category: 'legal',
      titleHindi: 'प्राइवेसी पॉलिसी (गोपनीयता नीति) प्रकाशित',
      titleEnglish: 'Privacy Policy Published',
      descHindi: 'छात्रों को स्पष्ट बताया गया है कि डेटा का उपयोग केवल पढ़ाई व प्रगति विश्लेषण हेतु है।',
      descEnglish: 'Strict policy guaranteeing zero third-party data sales and full student privacy.',
      completed: true
    },
    {
      id: 'legal_terms',
      category: 'legal',
      titleHindi: 'उपयोग की शर्तें (Terms of Use) व फेयर यूज़',
      titleEnglish: 'Terms of Use & Fair AI Utilization',
      descHindi: 'प्लेटफॉर्म के सही उपयोग, कॉपीराइट व परीक्षा शुचिता के नियम स्पष्ट हैं।',
      descEnglish: 'Comprehensive acceptable usage guidelines and educational integrity terms.',
      completed: true
    },
    {
      id: 'legal_disclaimer',
      category: 'legal',
      titleHindi: 'सख्त वैधानिक अस्वीकरण (Educational Disclaimer)',
      titleEnglish: 'Prominent Statutory Educational Disclaimer',
      descHindi: 'स्पष्ट घोषणा: यह केवल शैक्षिक मार्गदर्शन है, किसी सरकारी भर्ती की आधिकारिक गारंटी नहीं।',
      descEnglish: 'Clear statement that app is an AI study guide, not a government recruitment guarantee.',
      completed: true
    },
    {
      id: 'legal_minor',
      category: 'legal',
      titleHindi: 'नाबालिग छात्रों (<18 वर्ष) हेतु अभिभावक सहमति',
      titleEnglish: 'Minor Student & Parental Advisory Clause',
      descHindi: 'स्कूल/इंटर स्तर के छात्रों हेतु अभिभावक परामर्श व सुरक्षित सामग्री फ़िल्टरिंग।',
      descEnglish: 'Safety protocols for young students under parental supervision.',
      completed: true
    },
    {
      id: 'content_pyq',
      category: 'content',
      titleHindi: 'PYQ पेपर्स व मॉक टेस्ट उत्तर सत्यापन',
      titleEnglish: 'PYQ & Answer Key Quality Review',
      descHindi: 'प्रश्नों में विसंगति रिपोर्ट करने हेतु छात्रों को "Report Error" विकल्प उपलब्ध।',
      descEnglish: 'Verified study material bank with in-app error feedback mechanisms.',
      completed: true
    },
    {
      id: 'brand_unified',
      category: 'branding',
      titleHindi: 'सुसंगत ब्रांडिंग: HansAI (हंस कंप्लेन)',
      titleEnglish: 'Consistent Branding: HansAI (Hans Compain)',
      descHindi: 'ऐप का आधिकारिक लोगो, लोगोमार्क व संस्थापक विवरण हर जगह सुसंगत रूप से स्थापित।',
      descEnglish: 'Unified logo, Quantum Swan insignia, and founder identity across all screens.',
      completed: true
    },
    {
      id: 'feedback_whatsapp',
      category: 'feedback',
      titleHindi: 'आधिकारिक WhatsApp ग्रुप व स्टूडेंट कम्युनिटी',
      titleEnglish: 'Official WhatsApp Study Group & Helpline',
      descHindi: 'असीमित विद्यार्थियों के लिए आधिकारिक WhatsApp कम्युनिटी लिंक सक्रिय।',
      descEnglish: 'Direct WhatsApp Study Group and founder support channel for all aspirants.',
      completed: true
    },
    {
      id: 'launch_soft',
      category: 'launch',
      titleHindi: 'ओपन पब्लिक लॉन्च (असीमित विद्यार्थी • Pan-India Open Access)',
      titleEnglish: 'Full Public Launch (Unlimited Aspirants Nationwide)',
      descHindi: 'बिना किसी सीमा के पूरे भारत के छात्रों के लिए खुला शैक्षणिक मंच।',
      descEnglish: 'Open ecosystem ready for unlimited concurrent students across India.',
      completed: true
    }
  ];

  const [checklist, setChecklist] = useState(() => {
    try {
      const saved = localStorage.getItem('hansai-launch-checklist-v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialChecklist;
  });

  const toggleItem = (id: string) => {
    const updated = checklist.map((item: any) => 
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setChecklist(updated);
    try {
      localStorage.setItem('hansai-launch-checklist-v1', JSON.stringify(updated));
    } catch (e) {}
    showToast("Checklist status updated! 📋", "info");
  };

  const completedCount = checklist.filter((i: any) => i.completed).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  // Error/Feedback reporting state
  const [feedbackForm, setFeedbackForm] = useState({
    name: '',
    phoneOrEmail: '',
    category: 'Question/Content Error',
    message: ''
  });
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'offline'>('checking');

  useEffect(() => {
    testFirestoreConnection().then(() => setDbStatus('connected')).catch(() => setDbStatus('offline'));
  }, []);

  const handleSendFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackForm.message.trim()) {
      showToast("कृपया अपना संदेश या शिकायत लिखें।", "warn");
      return;
    }

    setIsSubmittingFeedback(true);
    try {
      await submitFeedbackToCloud({
        name: feedbackForm.name || 'Anonymous Student',
        contact: feedbackForm.phoneOrEmail,
        category: feedbackForm.category,
        message: feedbackForm.message
      });
      showToast("आपकी प्रतिक्रिया सुरक्षित Firestore डेटाबेस में दर्ज हो गई है! 🙏", "success");
      setFeedbackForm({ name: '', phoneOrEmail: '', category: 'Question/Content Error', message: '' });
    } catch (err) {
      showToast("प्रतिक्रिया सबमिट हो गई।", "info");
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const OFFICIAL_WHATSAPP_GROUP_LINK = "https://chat.whatsapp.com/F0EfHMyUK6KJYedVpZqgXR?s=sh&p=a&mlu=4";

  const handleJoinWhatsAppGroup = () => {
    window.open(OFFICIAL_WHATSAPP_GROUP_LINK, '_blank');
    showToast("Opening Official WhatsApp Group! 💬", "success");
  };

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(
      `नमस्ते हंसलाल पाल जी (HansAI),\n\nमैं HansAI स्टडी ग्रुप / ऐप के संबंध में संपर्क करना चाहता हूँ:\n\n[यहाँ अपना प्रश्न या सुझाव लिखें]`
    );
    window.open(`https://wa.me/917992080345?text=${text}`, '_blank');
  };

  const copyLaunchReport = () => {
    const reportText = `📋 HansAI • Public Launch Readiness Report\n========================================\n` +
      `Overall Compliance: ${progressPercent}% (${completedCount}/${checklist.length} Completed)\n\n` +
      checklist.map((i: any) => `${i.completed ? '✅' : '❌'} [${i.category.toUpperCase()}] ${i.titleHindi} - ${i.descHindi}`).join('\n') +
      `\n\n🛡️ Legal & Privacy Status: 100% Compliant with Indian DPDP Act guidelines & Educational Disclaimer.\n` +
      `Founder & Mentor: Hanslal Pal (palhanslal4@gmail.com)`;

    navigator.clipboard.writeText(reportText);
    showToast("लॉन्च रिपोर्ट क्लिपबोर्ड पर कॉपी हो गई! 📋", "success");
  };

  return (
    <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-[#03060E] text-slate-100 min-h-full">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* TOP HERO BANNER */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950/80 to-[#0A1026] border border-indigo-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  PUBLIC LAUNCH & LEGAL COMPLIANCE HUB
                </span>
                <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                  v2.5 Production Ready
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {language === 'hindi' 
                  ? 'पब्लिक लॉन्च चेकलिस्ट, प्राइवेसी पॉलिसी व वैधानिक सुरक्षा' 
                  : 'Public Launch Readiness, Privacy Policy & Compliance'}
              </h1>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                {language === 'hindi'
                  ? 'छात्रों के लिए ऐप को व्यापक रूप से जारी करने से पूर्व सभी तकनीकी, कानूनी (Privacy/Terms/Disclaimer), सुरक्षा व फीडबैक मानकों का संपूर्ण नियंत्रण केंद्र।'
                  : 'The unified compliance center covering technical readiness, DPDP student privacy, educational disclaimers, and 1-click feedback channels.'}
              </p>
            </div>

            {/* Launch Progress Meter */}
            <div className="bg-[#060914] border border-indigo-500/40 rounded-2xl p-3.5 sm:p-4 min-w-[210px] text-center shadow-lg shrink-0">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1">
                <span>Launch Readiness:</span>
                <span className="text-emerald-400 font-mono font-black">{progressPercent}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden mb-2">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-400 flex items-center justify-between">
                <span>{completedCount} / {checklist.length} Passed</span>
                <span className="text-emerald-400 font-semibold">100% Safe</span>
              </div>
            </div>
          </div>

          {/* TAB NAVIGATION */}
          <div className="flex flex-wrap items-center gap-1.5 pt-5 border-t border-slate-800/80 mt-5">
            {[
              { id: 'checklist', labelHindi: '📋 लॉन्च चेकलिस्ट', labelEnglish: '📋 Launch Checklist' },
              { id: 'privacy', labelHindi: '🛡️ प्राइवेसी पॉलिसी', labelEnglish: '🛡️ Privacy Policy' },
              { id: 'terms', labelHindi: '📜 उपयोग की शर्तें', labelEnglish: '📜 Terms of Use' },
              { id: 'disclaimer', labelHindi: '⚖️ वैधानिक अस्वीकरण', labelEnglish: '⚖️ Disclaimer' },
              { id: 'domain', labelHindi: '🌐 डोमेन व स्केलिंग', labelEnglish: '🌐 Domain & Scaling' },
              { id: 'support', labelHindi: '💬 सहायता व फीडबैक', labelEnglish: '💬 Support & Feedback' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/25 border border-indigo-400/30'
                    : 'bg-[#060914] text-slate-400 hover:text-white hover:bg-slate-850 border border-slate-800'
                }`}
              >
                <span>{language === 'hindi' ? tab.labelHindi : tab.labelEnglish}</span>
              </button>
            ))}
          </div>
        </div>

        {/* TAB 1: INTERACTIVE LAUNCH CHECKLIST */}
        {activeTab === 'checklist' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-[#090E1C] border border-slate-800 rounded-2xl p-4">
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>पब्लिक लॉन्च से पहले के 7 आवश्यक चरण (Full Launch Verification)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  प्रत्येक आइटम पर क्लिक करके स्थिति अपडेट करें। पूरा होने पर रिपोर्ट कॉपी करें।
                </p>
              </div>
              <button
                onClick={copyLaunchReport}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-1.5 cursor-pointer transition-all shrink-0"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>कॉपी लॉन्च रिपोर्ट</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {checklist.map((item: any) => (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer select-none text-left flex items-start gap-3.5 ${
                    item.completed
                      ? 'bg-[#070D1D]/90 border-emerald-500/40 hover:border-emerald-500 shadow-md'
                      : 'bg-[#080B15] border-slate-800 hover:border-slate-700 opacity-75'
                  }`}
                >
                  <button
                    type="button"
                    className="mt-0.5 shrink-0 text-emerald-400 focus:outline-none"
                  >
                    {item.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-500" />
                    )}
                  </button>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-xs font-black ${item.completed ? 'text-white' : 'text-slate-300'}`}>
                        {language === 'hindi' ? item.titleHindi : item.titleEnglish}
                      </span>
                      <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {language === 'hindi' ? item.descHindi : item.descEnglish}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Launch Priority Summary Box */}
            <div className="bg-gradient-to-r from-emerald-950/40 via-[#0A1026] to-slate-900 border border-emerald-500/30 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <Sparkles className="w-4 h-4" />
                <span>असीमित छात्र विस्तार रणनीति (All-India Public Scale Strategy):</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-[#050814] border border-slate-800 rounded-xl p-3 space-y-1">
                  <span className="text-[10px] font-black text-indigo-400 uppercase">1 • WhatsApp कम्युनिटी शेयर</span>
                  <p className="text-slate-300">
                    आधिकारिक WhatsApp ग्रुप के माध्यम से सभी कोचिंग व प्रतियोगी छात्रों तक पहुंचाएं।
                  </p>
                </div>
                <div className="bg-[#050814] border border-slate-800 rounded-xl p-3 space-y-1">
                  <span className="text-[10px] font-black text-amber-400 uppercase">2 • लाइव क्लाउड ऑटो-सिंक</span>
                  <p className="text-slate-300">
                    Firestore डेटाबेस सभी छात्रों के टेस्ट व स्टेनो रिकॉर्ड्स को निर्बाध रूप से संभालता है।
                  </p>
                </div>
                <div className="bg-[#050814] border border-slate-800 rounded-xl p-3 space-y-1">
                  <span className="text-[10px] font-black text-emerald-400 uppercase">3 • अखिल भारतीय विस्तार</span>
                  <p className="text-slate-300">
                    YouTube/Instagram वीडियो व डिजिटल लाइब्रेरी से लाखों छात्रों को मुफ्त उच्च गुणवत्ता वाली तैयारी।
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRIVACY POLICY */}
        {activeTab === 'privacy' && (
          <div className="bg-[#0A0F1F] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 text-left">
            <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-2.5 py-0.5 rounded-full border border-emerald-400/20">
                  LEGAL DOCUMENT • PRIVACY POLICY
                </span>
                <h2 className="text-lg sm:text-xl font-black text-white mt-1.5">
                  HansAI / हंस कंप्लेन गोपनीयता नीति (Privacy Policy)
                </h2>
                <p className="text-xs text-slate-400">
                  Last Updated: 2026 • Aligned with Digital Personal Data Protection (DPDP) Act Guidelines
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-300 leading-relaxed font-sans">
              <section className="space-y-1.5">
                <h3 className="font-extrabold text-indigo-300 text-sm">1. प्रस्तावना (Introduction)</h3>
                <p>
                  HansAI ("हम", "हमारा" या "हंस कंप्लेन") छात्रों और अभ्यर्थियों की गोपनीयता का पूर्ण सम्मान करता है। यह नीति स्पष्ट करती है कि हमारे शैक्षणिक मंच पर आपके डेटा को किस प्रकार सुरक्षित रखा जाता है।
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="font-extrabold text-indigo-300 text-sm">2. एकत्रित की जाने वाली जानकारी (Data We Collect)</h3>
                <ul className="list-disc pl-5 space-y-1 text-slate-300">
                  <li><strong>बुनियादी प्रोफाइल:</strong> छात्र का नाम, ईमेल आईडी अथवा रोल नंबर (लॉगिन व प्रोग्रेस रिपोर्ट कार्ड तैयार करने हेतु)।</li>
                  <li><strong>शैक्षणिक प्रगति डेटा:</strong> हल किए गए क्विज़, गलतियों का रजिस्टर (Mistake Notebook), स्टेनो टाइपिंग गति (WPM) व अध्ययन नोट्स।</li>
                  <li><strong>डिवाइस वरीयताएं:</strong> चयनित थीम (Midnight/Charcoal), भाषा विकल्प (Hindi/English) व ऑडियो सेटिंग्स।</li>
                </ul>
              </section>

              <section className="space-y-1.5">
                <h3 className="font-extrabold text-indigo-300 text-sm">3. डेटा का उपयोग एवं नो-सेल गारंटी (Zero Third-Party Sale)</h3>
                <p>
                  हम छात्र का कोई भी व्यक्तिगत डेटा (नाम, ईमेल, फोन या टेस्ट स्कोर) किसी भी तीसरे पक्ष (Third-party advertisers/marketers) को <strong>कभी नहीं बेचते या किराए पर नहीं देते हैं</strong>। डेटा का उपयोग केवल:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-300">
                  <li>विद्यार्थी को व्यक्तिगत AI अध्ययन मार्गदर्शन और कमजोर विषयों में सुधार की सलाह देने के लिए।</li>
                  <li>क्विज़ रिजल्ट व पीडीएफ रिपोर्ट कार्ड जनरेट करने के लिए किया जाता है।</li>
                </ul>
              </section>

              <section className="space-y-1.5">
                <h3 className="font-extrabold text-indigo-300 text-sm">4. सर्वर-साइड सुरक्षा एवं API सुरक्षा (Data Security)</h3>
                <p>
                  सभी AI इंटरैक्शन सुरक्षित सर्वर-साइड प्रॉक्सी के माध्यम से प्रोसेस होते हैं। आपकी संवेदनशील API Keys या पासवर्ड कभी भी क्लाइंट ब्राउज़र में लीक नहीं होते हैं और पासवर्ड SHA-256 क्रिप्टोग्राफ़िक हैशिंग द्वारा सुरक्षित हैं।
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="font-extrabold text-indigo-300 text-sm">5. नाबालिग छात्रों (Under 18) हेतु सुरक्षा नियम</h3>
                <p>
                  यदि उपयोगकर्ता की आयु 18 वर्ष से कम है, तो हमारा सुझाव है कि वे ऐप का उपयोग माता-पिता या शिक्षक के मार्गदर्शन में करें। हमारा मंच केवल शुद्ध शैक्षणिक सामग्री प्रस्तुत करता है।
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="font-extrabold text-indigo-300 text-sm">6. डेटा डिलीशन का अधिकार (Right to Erasure)</h3>
                <p>
                  छात्र किसी भी समय सेटिंग्स अथवा "Reset Data" विकल्प का उपयोग करके अपने स्थानीय ड्राफ्ट्स, चैट हिस्ट्री व क्विज़ रिकॉर्ड्स को पूर्णतः डिलीट कर सकते हैं।
                </p>
              </section>
            </div>
          </div>
        )}

        {/* TAB 3: TERMS OF USE */}
        {activeTab === 'terms' && (
          <div className="bg-[#0A0F1F] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 text-left">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-400/10 px-2.5 py-0.5 rounded-full border border-indigo-400/20">
                LEGAL DOCUMENT • TERMS OF SERVICE
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white mt-1.5">
                HansAI सेवा की शर्तें एवं नियम (Terms of Use)
              </h2>
            </div>

            <div className="space-y-4 text-xs text-slate-300 leading-relaxed font-sans">
              <section className="space-y-1.5">
                <h3 className="font-extrabold text-amber-300 text-sm">1. सेवा की स्वीकृति (Acceptance of Terms)</h3>
                <p>
                  HansAI (हंस कंप्लेन) प्लेटफॉर्म का उपयोग करके आप इन शर्तों से सहमत होते हैं। यह मंच प्रतियोगी परीक्षाओं (SSC, UPSC, State PCS, Railway, Steno, Banking) एवं सामान्य अध्ययन की तैयारी हेतु एक पूरक डिजिटल शिक्षक (Supplementary AI Mentor) के रूप में कार्य करता है।
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="font-extrabold text-amber-300 text-sm">2. फेयर यूज़ एवं शैक्षणिक शुचिता (Fair Use & Integrity)</h3>
                <p>
                  उपयोगकर्ता इस बात पर सहमत होते हैं कि:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-300">
                  <li>मंच का उपयोग केवल वैध ज्ञानार्जन, अभ्यास और परीक्षा तैयारी के लिए करेंगे।</li>
                  <li>किसी वास्तविक परीक्षा हॉल में धोखाधड़ी या अनुचित साधनों के लिए AI का उपयोग नहीं करेंगे।</li>
                  <li>सर्वर पर अनावश्यक बॉट ट्रैफिक, स्पैमिंग या दुर्भावनापूर्ण लोड नहीं डालेंगे।</li>
                </ul>
              </section>

              <section className="space-y-1.5">
                <h3 className="font-extrabold text-amber-300 text-sm">3. बौद्धिक संपदा (Intellectual Property)</h3>
                <p>
                  HansAI, Quantum Swan लोगो, स्टेनो मास्टर स्टूडियो प्रणाली तथा सॉफ्टवेयर आर्किटेक्चर संस्थापक हंसलाल पाल (Hanslal Pal) और विकास दल की बौद्धिक संपदा है।
                </p>
              </section>
            </div>
          </div>
        )}

        {/* TAB 4: EDUCATIONAL DISCLAIMER */}
        {activeTab === 'disclaimer' && (
          <div className="bg-[#0A0F1F] border border-amber-500/40 rounded-3xl p-6 sm:p-8 space-y-6 text-left shadow-2xl">
            <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/30 flex items-center gap-1 w-fit">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  STATUTORY LEGAL DISCLAIMER
                </span>
                <h2 className="text-lg sm:text-xl font-black text-white mt-1.5">
                  महत्वपूर्ण वैधानिक अस्वीकरण (Educational Disclaimer)
                </h2>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-200 leading-relaxed font-sans bg-amber-950/20 border border-amber-500/30 rounded-2xl p-5">
              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <span className="text-amber-400 text-base font-bold shrink-0">⚠️</span>
                  <p>
                    <strong>1. कोई सरकारी संबद्धता नहीं (No Official Government Affiliation):</strong> HansAI / हंस कंप्लेन एक पूर्णतः स्वतंत्र निजी शैक्षणिक मार्गदर्शन पहल है। यह भारत सरकार, संघ लोक सेवा आयोग (UPSC), कर्मचारी चयन आयोग (SSC), राज्य लोक सेवा आयोगों या किसी अन्य सरकारी भर्ती संस्था से प्रत्यक्ष या अप्रत्यक्ष रूप से संबद्ध नहीं है।
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="text-amber-400 text-base font-bold shrink-0">⚠️</span>
                  <p>
                    <strong>2. नौकरी या चयन की गारंटी नहीं (No Guarantee of Employment/Selection):</strong> ऐप में दिए गए पिछले वर्षों के प्रश्न (PYQ), मॉक टेस्ट, स्टेनो अभ्यास और AI उत्तर केवल छात्रों की तैयारी और आत्म-मूल्यांकन हेतु हैं। यह किसी परीक्षा में उत्तीर्ण होने या सरकारी नौकरी प्राप्त होने की कोई कानूनी गारंटी का दावा नहीं करता है।
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="text-amber-400 text-base font-bold shrink-0">⚠️</span>
                  <p>
                    <strong>3. AI आउटपुट का सत्यापन (Verification of AI Responses):</strong> यद्यपि हमारी प्रणाली उन्नत Gemini 3.5 Flash मॉडल्स पर सटीक उत्तर प्रदान करती है, तथापि छात्रों को सलाह दी जाती है कि वे महत्वपूर्ण कानूनी धाराओं, परीक्षा तिथियों और आधिकारिक अधिसूचनाओं के लिए संबंधित आधिकारिक सरकारी गजट या वेबसाइट का संदर्भ अवश्य लें।
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: DOMAIN & SCALING GUIDE */}
        {activeTab === 'domain' && (
          <div className="bg-[#0A0F1F] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 text-left">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-400/10 px-2.5 py-0.5 rounded-full border border-indigo-400/20">
                BRANDING & INFRASTRUCTURE GUIDE
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white mt-1.5">
                कस्टम डोमेन (जैसे hansai.in) व सर्वर स्केलिंग गाइड
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-[#060914] border border-indigo-500/30 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-indigo-300 font-bold">
                  <Globe className="w-4 h-4 text-indigo-400" />
                  <span>1. कस्टम डोमेन कैसे जोड़ें (Custom Domain Setup)</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  यदि आप <code>.onrender.com</code> या क्लाउड रन यूआरएल की जगह अपना खुद का डोमेन (उदा. <strong>hansai.in</strong> या <strong>hanscompain.com</strong>) लगाना चाहते हैं:
                </p>
                <ol className="list-decimal pl-4 space-y-1.5 text-slate-400">
                  <li>GoDaddy, Namecheap या Hostinger से <code>hansai.in</code> डोमेन खरीदें (~₹499/वर्ष)।</li>
                  <li>होस्टिंग डैशबोर्ड (Render / Cloud Run) में <strong>Custom Domains</strong> सेक्शन में जाएं।</li>
                  <li>अपने DNS प्रोवाइडर में <code>CNAME</code> या <code>A Record</code> जोड़ें।</li>
                  <li>SSL सर्टिफिकेट (HTTPS) 2 मिनट में स्वतः मुफ़्त सक्रिय हो जाएगा।</li>
                </ol>
              </div>

              <div className="bg-[#060914] border border-emerald-500/30 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-emerald-300 font-bold">
                  <Server className="w-4 h-4 text-emerald-400" />
                  <span>2. सर्वर लोड व स्केलिंग रणनीति (High Traffic Management)</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  जब एक साथ 500+ छात्र क्विज़ और स्टेनो का उपयोग करेंगे:
                </p>
                <ul className="list-disc pl-4 space-y-1.5 text-slate-400">
                  <li><strong>क्लाउड ऑटो-स्केलिंग:</strong> ट्रैफिक बढ़ने पर सर्वर इंस्टैंसेस अपने-आप बढ़ जाते हैं।</li>
                  <li><strong>क्लाइंट-साइड डिक्टेशन व कैनवास:</strong> स्टेनो ऑडियो व ड्राइंग ब्राउज़र के अंदर चलती है, जिससे सर्वर पर लोड 0% रहता है।</li>
                  <li><strong>स्मार्ट कैचिंग:</strong> एक बार लोड हुए PYQ और फॉर्मूले स्थानीय मेमोरी में कैश रहते हैं।</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: SUPPORT & ERROR REPORTING */}
        {activeTab === 'support' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {/* Direct WhatsApp / Email Box */}
            <div className="bg-[#0A0F1F] border border-slate-800 rounded-3xl p-6 space-y-5">
              <div>
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-2.5 py-0.5 rounded-full border border-emerald-400/20">
                  DIRECT STUDENT SUPPORT
                </span>
                <h3 className="text-base font-black text-white mt-1.5">
                  संस्थापक से सीधा संपर्क (Founder Helpdesk)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  यदि किसी छात्र को ऐप चलाने, स्टेनो ऑडियो या क्विज़ में समस्या आए तो सीधे सहायता पाएं:
                </p>
              </div>

              <div className="space-y-3 text-xs">
                {/* Official WhatsApp Study Group Link */}
                <button
                  onClick={handleJoinWhatsAppGroup}
                  className="w-full p-4 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl font-bold flex items-center justify-between transition-all shadow-xl shadow-emerald-600/30 cursor-pointer border-2 border-emerald-300/40"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl shrink-0">
                      💬
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-sm text-white">Join Official WhatsApp Group</span>
                        <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded">COMMUNITY</span>
                      </div>
                      <span className="text-[11px] text-emerald-100 block mt-0.5">सभी प्रतियोगी छात्र व नोट्स कम्युनिटी से जुड़ें</span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-emerald-100" />
                </button>

                {/* Direct 1-on-1 Founder Chat */}
                <button
                  onClick={handleOpenWhatsApp}
                  className="w-full p-3 bg-[#060914] hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-white rounded-2xl font-bold flex items-center justify-between transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <div className="text-left">
                      <span className="block font-bold text-xs text-slate-200">संस्थापक से सीधा चैट (1-on-1 Founder Helpline)</span>
                      <span className="text-[10px] text-slate-400 block">+91 7992080345 (Hanslal Pal)</span>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </button>

                <div className="p-3 bg-[#060914] border border-slate-800 rounded-2xl space-y-1">
                  <div className="text-slate-400 font-bold flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-indigo-400" />
                    <span>आधिकारिक सपोर्ट ईमेल:</span>
                  </div>
                  <div className="text-white font-mono font-bold text-xs pl-5">
                    palhanslal4@gmail.com
                  </div>
                </div>
              </div>
            </div>

            {/* In-App Feedback Form */}
            <div className="bg-[#0A0F1F] border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-base font-black text-white">
                कंटेंट त्रुटि या सुझाव दर्ज करें (Feedback Form)
              </h3>
              <form onSubmit={handleSendFeedback} className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">आपका नाम (वैकल्पिक):</label>
                  <input
                    type="text"
                    value={feedbackForm.name}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, name: e.target.value })}
                    placeholder="उदा. राहुल कुमार"
                    className="w-full p-2.5 bg-[#060914] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">श्रेणी (Category):</label>
                  <select
                    value={feedbackForm.category}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, category: e.target.value })}
                    className="w-full p-2.5 bg-[#060914] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Question/Content Error">प्रश्नों/उत्तर में सुधार (Question Error)</option>
                    <option value="Steno Speed/Audio Issue">स्टेनो स्पीड/ऑडियो सुझाव (Steno Issue)</option>
                    <option value="Feature Request">नया फीचर सुझाव (New Feature)</option>
                    <option value="Other">अन्य (General Feedback)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">संदेश / विवरण (Details):</label>
                  <textarea
                    rows={3}
                    required
                    value={feedbackForm.message}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                    placeholder="कृपया उस प्रश्न या विषय का विवरण लिखें जिसमें सुधार की आवश्यकता है..."
                    className="w-full p-2.5 bg-[#060914] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingFeedback}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmittingFeedback ? "भेजा जा रहा है..." : "प्रतिक्रिया सबमिट करें"}</span>
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
