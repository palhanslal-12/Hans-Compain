import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Lock, CheckCircle2, AlertCircle, HeartHandshake, Mail } from 'lucide-react';
import { HansCompainLogo } from './HansCompainLogo';

interface TermsAndPrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'terms' | 'privacy' | 'creator' | 'roadmap';
}

export const TermsAndPrivacyModal: React.FC<TermsAndPrivacyModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'terms'
}) => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'creator' | 'roadmap'>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-[#091122] border-2 border-cyan-500/40 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl relative text-white overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-[#0c162d]">
          <div className="flex items-center gap-3">
            <HansCompainLogo variant="center" className="w-9 h-9" />
            <div>
              <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                <span>HANS COMPAIN</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  आधिकारिक दस्तावेज़
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                नियम, शर्तें एवं गोपनीयता नीति (Terms & Privacy Policy 2026)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-900 border border-slate-700 cursor-pointer"
            title="बंद करें"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 shrink-0 px-4 pt-2 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('terms')}
            className={`flex items-center gap-1.5 px-3 py-2.5 font-bold text-xs border-b-2 cursor-pointer transition-all shrink-0 ${
              activeTab === 'terms'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30 rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>📜 नियम व शर्तें</span>
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-1.5 px-3 py-2.5 font-bold text-xs border-b-2 cursor-pointer transition-all shrink-0 ${
              activeTab === 'privacy'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-950/30 rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>🔒 गोपनीयता नीति</span>
          </button>
          <button
            onClick={() => setActiveTab('creator')}
            className={`flex items-center gap-1.5 px-3 py-2.5 font-bold text-xs border-b-2 cursor-pointer transition-all shrink-0 ${
              activeTab === 'creator'
                ? 'border-amber-400 text-amber-300 bg-amber-950/30 rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>👨‍💻</span>
            <span>क्रिएटर परिचय (Hanslal)</span>
          </button>
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`flex items-center gap-1.5 px-3 py-2.5 font-bold text-xs border-b-2 cursor-pointer transition-all shrink-0 ${
              activeTab === 'roadmap'
                ? 'border-purple-400 text-purple-300 bg-purple-950/30 rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🚀</span>
            <span>रोडमैप (Roadmap)</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs text-slate-300 leading-relaxed custom-scrollbar">
          {activeTab === 'terms' ? (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-cyan-200 text-xs">
                <div className="font-bold text-cyan-300 flex items-center gap-2 mb-1">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>प्रस्तावना एवं शैक्षणिक सेवा समझौता (Service Agreement)</span>
                </div>
                HANS COMPAIN एक पूर्णतः शैक्षणिक एवं प्रतियोगी परीक्षा तैयारी प्लेटफॉर्म है। इस ऐप का उपयोग करके आप निम्नलिखित शर्तों का पालन करने के लिए अपनी पूर्ण सहमति प्रदान करते हैं।
              </div>

              <div className="space-y-3">
                <div className="border border-slate-800 rounded-2xl p-4 bg-slate-950/40 space-y-2">
                  <h4 className="font-black text-white text-xs sm:text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[10px]">1</span>
                    शैक्षणिक उपयोग एवं खाता दायित्व (Educational Use & Account Responsibility)
                  </h4>
                  <p>
                    • इस प्लेटफॉर्म का उपयोग केवल वैध अध्ययन, प्रतियोगी परीक्षाओं (UPSC, SSC, Railway, Banking, 10वीं/12वीं बोर्ड) और ज्ञानार्जन के लिए किया जाना चाहिए।<br />
                    • यूजर अपने लॉगिन क्रेडेंशियल (ईमेल व पासवर्ड) की गोपनीयता बनाए रखने के लिए स्वयं जिम्मेदार हैं। किसी अन्य व्यक्ति के साथ अपना पासवर्ड साझा न करें।
                  </p>
                </div>

                <div className="border border-slate-800 rounded-2xl p-4 bg-slate-950/40 space-y-2">
                  <h4 className="font-black text-white text-xs sm:text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[10px]">2</span>
                    एआई मॉडल एवं अध्ययन सामग्री मार्गदर्शन (AI Assistance Disclaimer)
                  </h4>
                  <p>
                    • हमारा AI ट्यूटर और डाउट सॉल्वर आधुनिक शैक्षणिक एल्गोरिदम पर आधारित है और 24×7 सहायता प्रदान करता है।<br />
                    • परीक्षा संबंधित आधिकारिक अधिसूचना, पाठ्यक्रम एवं नियमों के लिए संबंधित आयोग/बोर्ड की आधिकारिक वेबसाइट को अंतिम प्रमाण माना जाना चाहिए।
                  </p>
                </div>

                <div className="border border-slate-800 rounded-2xl p-4 bg-slate-950/40 space-y-2">
                  <h4 className="font-black text-white text-xs sm:text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[10px]">3</span>
                    प्रतिबंधित गतिविधियां (Prohibited Conduct)
                  </h4>
                  <p>
                    • प्लेटफॉर्म पर किसी भी प्रकार का अभद्र, आपत्तिजनक, गैर-कानूनी या स्पैम कंटेंट पोस्ट करना सख्त वर्जित है।<br />
                    • किसी भी तरह के ऑटोमेटेड बॉट या स्क्रैपिंग द्वारा प्लेटफॉर्म को बाधित करने का प्रयास करने पर अकाउंट तुरंत निलंबित किया जा सकता है।
                  </p>
                </div>

                <div className="border border-slate-800 rounded-2xl p-4 bg-slate-950/40 space-y-2">
                  <h4 className="font-black text-white text-xs sm:text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[10px]">4</span>
                    अपडेट एवं शर्तों में संशोधन (Modifications)
                  </h4>
                  <p>
                    • HANS COMPAIN समय-समय पर छात्रों के हित में नई सुविधाओं को जोड़ने या नियमों को अद्यतन करने का अधिकार सुरक्षित रखता है। अद्यतन नियम ऐप पर प्रकाशित होते ही प्रभावी होंगे।
                  </p>
                </div>
              </div>
            </div>
          ) : activeTab === 'privacy' ? (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-200 text-xs">
                <div className="font-bold text-emerald-300 flex items-center gap-2 mb-1">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>आपकी गोपनीयता हमारी सर्वोच्च प्राथमिकता है (Privacy Guarantee)</span>
                </div>
                HANS COMPAIN छात्र डेटा की सुरक्षा एवं पारदर्शिता के उच्चतम मानकों का पालन करता है। हम कभी भी किसी तीसरे पक्ष (Third Party) को आपका व्यक्तिगत डेटा नहीं बेचते हैं।
              </div>

              <div className="space-y-3">
                <div className="border border-slate-800 rounded-2xl p-4 bg-slate-950/40 space-y-2">
                  <h4 className="font-black text-white text-xs sm:text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    हम कौन-सी जानकारी एकत्र करते हैं? (Collected Information)
                  </h4>
                  <p>
                    • <strong>अकाउंट विवरण:</strong> आपका नाम, ईमेल आईडी, चुनी हुई परीक्षा/बोर्ड और लॉगिन समय।<br />
                    • <strong>अध्ययन प्रगति:</strong> आपके हल किए गए मॉक टेस्ट स्कोर, पसंदीदा विषय और अध्ययन लक्ष्य।<br />
                    • <strong>सुरक्षा लॉग:</strong> प्रमाणीकरण टोकन ताकि आप बार-बार लॉगिन किए बिना अध्ययन जारी रख सकें।
                  </p>
                </div>

                <div className="border border-slate-800 rounded-2xl p-4 bg-slate-950/40 space-y-2">
                  <h4 className="font-black text-white text-xs sm:text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    जानकारी का उपयोग कैसे किया जाता है? (Usage of Data)
                  </h4>
                  <p>
                    • आपको व्यक्तिगत अध्ययन सामग्री, टेस्ट परिणाम और महत्वपूर्ण परीक्षा अलर्ट उपलब्ध कराने हेतु।<br />
                    • आपके खाते को सुरक्षित रखने और अनधिकृत एक्सेस को रोकने हेतु।<br />
                    • आपके अनुरोध पर पासवर्ड रीसेट लिंक और सुरक्षा सूचनाएं भेजने हेतु।
                  </p>
                </div>

                <div className="border border-slate-800 rounded-2xl p-4 bg-slate-950/40 space-y-2">
                  <h4 className="font-black text-white text-xs sm:text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    डेटा सुरक्षा एवं सुरक्षा प्रोटोकॉल (Data Security & Encryption)
                  </h4>
                  <p>
                    • सभी पासवर्ड और क्रेडेंशियल्स आधुनिक उद्योग मानकों के अनुसार सुरक्षित एन्क्रिप्टेड (SSL/TLS 256-bit) चैनल के माध्यम से संचारित होते हैं।<br />
                    • आप जब चाहें अपना अकाउंट या डेटा हटाने का अनुरोध कर सकते हैं।
                  </p>
                </div>

                <div className="border border-slate-800 rounded-2xl p-4 bg-slate-950/40 space-y-2">
                  <h4 className="font-black text-white text-xs sm:text-sm flex items-center gap-2">
                    <HeartHandshake className="w-4 h-4 text-cyan-400" />
                    छात्र सहायता एवं संपर्क (Contact & Grievance)
                  </h4>
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>आधिकारिक सपोर्ट ईमेल: <span className="font-mono text-cyan-300 font-bold">support@hanscompain.in</span> (व <span className="font-mono text-cyan-300 font-bold">hanscompain@gmail.com</span>)</span>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    यदि आपको गोपनीयता या नियमों से संबंधित कोई भी प्रश्न या समस्या है, तो आप निसंकोच ऊपर दिए गए पते पर लिख सकते हैं।
                  </p>
                </div>
              </div>
            </div>
          ) : activeTab === 'creator' ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 space-y-3">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <img
                    src="/public/assets/aistudio/file_0000000058f081f49120dae0de21f633_e6442101.png"
                    alt="Hanslal Pal - Founder"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-amber-400 shadow-xl shrink-0"
                  />
                  <div className="text-center sm:text-left">
                    <h3 className="text-base font-black text-white">Hanslal Pal</h3>
                    <p className="text-xs text-amber-300 font-bold">Founder, Developer & Hans AI Creator (Bihar, India)</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  Hanslal Pal is an undergraduate student and tech enthusiast based in Bihar, India. Balancing rigorous competitive exam preparation with software development, Hanslal built <strong>Hans Compain</strong> and <strong>Hansa AI</strong> to solve real-world learning challenges faced by students.
                </p>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  His mission is to bridge the gap between traditional study methods and modern digital tools, providing aspirants with smart, accessible, and high-performance resources for competitive exams like SSC Stenographer and Board Exams.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/40 space-y-3">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <span>🚀</span>
                  <span>Hans Compain - Product Roadmap</span>
                </h3>
                <div className="space-y-2.5 text-xs sm:text-sm">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <strong className="text-purple-300 block mb-1">Phase 1 (Current):</strong>
                    Core study modules, adaptive quizzes, stenography practice tools, science virtual labs, and AI doubt solver.
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <strong className="text-purple-300 block mb-1">Phase 2 (Upcoming):</strong>
                    Advanced AI-powered personalization, student performance analytics dashboard, and smart study planner sync.
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <strong className="text-purple-300 block mb-1">Phase 3 (Future Scale):</strong>
                    Community study groups, offline-first sync, and advanced mock test series tailored for competitive exams across India.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0c162d] flex items-center justify-between shrink-0">
          <div className="text-[10px] text-slate-400">
            अंतिम नवीनीकरण: जनवरी 2026 • सर्वाधिकार सुरक्षित HANS COMPAIN
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs cursor-pointer shadow-lg transition-all"
          >
            समझ गया / बंद करें (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
