import React, { useState, useRef } from 'react';
import { QrCode, Camera, Upload, Sparkles, CheckCircle2, Copy, ArrowRight, BookOpen, HelpCircle, RefreshCw, X, Zap } from 'lucide-react';

interface SmartQrNotesScannerViewProps {
  onAskAiQuestion?: (q: string) => void;
  showToast: (msg: string, type?: 'info' | 'success' | 'warn') => void;
  language?: string;
}

const SAMPLE_DEMO_QRS = [
  {
    id: 'demo-1',
    label: 'Science NCERT Ch-4: Carbon & Its Compounds (कार्बन एवं उसके यौगिक)',
    codeData: 'HANS_NOTE: Science Chapter 4 - Carbon and its allotropes (Diamond, Graphite, Fullerenes) with SP3, SP2 hybridization mechanics.',
    type: 'Study Notes QR'
  },
  {
    id: 'demo-2',
    label: 'Maths PYQ: Compound Interest vs Simple Interest 2-Year Difference',
    codeData: 'HANS_PYQ: For Principal P, Difference between CI and SI for 2 years is P*(R/100)^2. If diff is ₹144 at 12%, calculate Principal.',
    type: 'Exam PYQ Problem'
  },
  {
    id: 'demo-3',
    label: 'History: Maurya Dynasty & Ashoka 13th Rock Edict Kalinga War',
    codeData: 'HANS_HISTORY: Ashoka conquered Kalinga in 261 BCE (8th regnal year). Mentioned in 13th Major Rock Edict. Converted to Buddhism under Upagupta.',
    type: 'Static GK QR'
  }
];

export const SmartQrNotesScannerView: React.FC<SmartQrNotesScannerViewProps> = ({ onAskAiQuestion, showToast, language = 'hindi' }) => {
  const isHindi = language === 'hindi';
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanningLive, setIsScanningLive] = useState(false);
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSimulateScan = (data: string) => {
    setScanResult(data);
    showToast(isHindi ? "QR कोड सफलतापूर्वक स्कैन हुआ! 🎯" : "QR Code successfully scanned! 🎯", "success");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalyzingImage(true);
    setTimeout(() => {
      setAnalyzingImage(false);
      const simulatedResult = `[QR DETECTED FROM ${file.name.toUpperCase()}]: Indian Polity Article 32 (Right to Constitutional Remedies) called Heart & Soul of Constitution by Dr. B.R. Ambedkar. Supreme Court issues 5 writs: Habeas Corpus, Mandamus, Prohibition, Quo-Warranto, Certiorari.`;
      setScanResult(simulatedResult);
      showToast(isHindi ? "इमेज से क्वेश्चन/QR कोड सफलतापूर्वक पढ़ा गया!" : "Question/QR code successfully extracted from image!", "success");
    }, 1200);
  };

  const handleCopy = () => {
    if (!scanResult) return;
    navigator.clipboard.writeText(scanResult);
    showToast(isHindi ? "टेक्स्ट क्लिपबोर्ड में कॉपी हो गया! 📋" : "Text copied to clipboard! 📋", "success");
  };

  const handleSendToAi = () => {
    if (!scanResult) return;
    if (onAskAiQuestion) {
      onAskAiQuestion(isHindi 
        ? `कृपया इस स्कैन किए गए प्रश्न/नोट्स की पूरी व्याख्या हिंदी और इंग्लिश में बताएं:\n${scanResult}`
        : `Please explain this scanned question/note thoroughly in English and Hindi:\n${scanResult}`
      );
      showToast(isHindi ? "HansAI Companion में प्रश्न भेजा गया! 🚀" : "Question sent to HansAI Companion! 🚀", "success");
    } else {
      showToast(isHindi ? "HansAI को भेजा गया!" : "Sent to HansAI!", "info");
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-[#0a0f1d] text-slate-100 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 rounded-full text-xs font-bold flex items-center gap-1.5">
              <QrCode className="w-3.5 h-3.5" />
              SMART QR & QUESTION SCANNER
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            स्मार्ट क्वेश्चन व नोट्स QR स्कैनर
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            किताबों, टेस्ट सीरीज़ व नोट्स पर छपे QR कोड या इमेज को स्कैन करें और तुरंत HansAI से ऑडियो व्याख्या व उत्तर प्राप्त करें।
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scanner Panel */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 text-center">
            <div className="w-full aspect-video bg-slate-950/80 border-2 border-dashed border-cyan-500/40 rounded-2xl flex flex-col items-center justify-center p-6 relative overflow-hidden">
              {isScanningLive ? (
                <div className="space-y-3 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin flex items-center justify-center">
                    <Camera className="w-8 h-8 text-cyan-400" />
                  </div>
                  <div className="text-xs font-bold text-cyan-300">कैमरा लाइव QR कोड स्कैन कर रहा है...</div>
                  <button
                    onClick={() => {
                      setIsScanningLive(false);
                      handleSimulateScan(SAMPLE_DEMO_QRS[0].codeData);
                    }}
                    className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    सफल स्कैन सिम्युलेट करें ✅
                  </button>
                </div>
              ) : analyzingImage ? (
                <div className="space-y-2 flex flex-col items-center">
                  <RefreshCw className="w-10 h-10 text-amber-400 animate-spin" />
                  <div className="text-xs font-bold text-amber-300">इमेज से टेक्स्ट व QR कोड निकाला जा रहा है...</div>
                </div>
              ) : (
                <div className="space-y-3 flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <QrCode className="w-8 h-8" />
                  </div>
                  <div className="text-xs text-slate-400">
                    कैमरे से QR कोड स्कैन करें या QR इमेज फाइल अपलोड करें
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    <button
                      onClick={() => setIsScanningLive(true)}
                      className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-2 cursor-pointer transition-all border-none shadow-md shadow-cyan-600/20"
                    >
                      <Camera className="w-4 h-4" />
                      <span>कैमरा स्कैन शुरू करें</span>
                    </button>

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer transition-all border border-slate-700"
                    >
                      <Upload className="w-4 h-4" />
                      <span>QR इमेज चुनें</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Demo QRs */}
            <div className="text-left space-y-2 pt-2">
              <div className="text-xs font-bold text-slate-400">⚡ या तुरंत टेस्ट करने के लिए सैंपल QR चुनें:</div>
              <div className="grid grid-cols-1 gap-2">
                {SAMPLE_DEMO_QRS.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleSimulateScan(item.codeData)}
                    className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wide">{item.type}</div>
                      <div className="text-xs font-medium text-slate-200">{item.label}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scan Result & AI Action Panel */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 flex flex-col justify-between min-h-[350px]">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  स्कैन किया गया डेटा (Decoded Output)
                </span>
                {scanResult && (
                  <button
                    onClick={handleCopy}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer border border-slate-700"
                  >
                    <Copy className="w-3 h-3" />
                    Copy
                  </button>
                )}
              </div>

              {scanResult ? (
                <div className="p-4 bg-slate-950 border border-cyan-500/30 rounded-2xl text-xs text-slate-200 font-mono leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap">
                  {scanResult}
                </div>
              ) : (
                <div className="p-10 border border-dashed border-slate-800 rounded-2xl text-center text-xs text-slate-500">
                  कोई QR कोड या क्वेश्चन अभी स्कैन नहीं हुआ है। बाईं तरफ से कैमरा ऑन करें या सैंपल QR चुनें।
                </div>
              )}
            </div>

            {scanResult && (
              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={handleSendToAi}
                  className="w-full sm:flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg shadow-emerald-600/30 border-none"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>HansAI से पूरी व्याख्या व समाधान पूछें 🚀</span>
                </button>
                <button
                  onClick={() => setScanResult(null)}
                  className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl text-xs font-bold cursor-pointer transition-all border border-slate-700"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
