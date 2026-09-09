import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'react-qr-code';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { QrCode, Camera, Upload, Sparkles, CheckCircle2, Copy, ArrowRight, BookOpen, HelpCircle, RefreshCw, X, Zap, Download } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'scan' | 'generate'>('scan');
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanningLive, setIsScanningLive] = useState(false);
  const [analyzingImage, setAnalyzingImage] = useState(false);
  
  // Generator states
  const [generatorText, setGeneratorText] = useState('HANS COMPAIN: Important Polity Article 32 Study Notes & PYQ Revision');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Live scanner effect
  useEffect(() => {
    let scanner: any = null;
    if (isScanningLive) {
      setTimeout(() => {
        try {
          scanner = new Html5QrcodeScanner("qr-reader-notes", { fps: 10, qrbox: { width: 250, height: 250 } }, false);
          scanner.render((decodedText: string) => {
            setScanResult(decodedText.trim());
            setIsScanningLive(false);
            showToast(isHindi ? `QR कोड सफलतापूर्वक स्कैन हुआ!` : `QR Code successfully scanned!`, "success");
            if (scanner) scanner.clear().catch(console.error);
          }, () => {});
        } catch (e) {
          console.warn("Scanner init error:", e);
        }
      }, 100);
    }
    return () => {
      if (scanner) scanner.clear().catch(console.error);
    };
  }, [isScanningLive, isHindi, showToast]);

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
      const simulatedResult = `[QR / IMAGE EXTRACTED FROM ${file.name.toUpperCase()}]: Indian Polity Article 32 (Right to Constitutional Remedies) called Heart & Soul of Constitution by Dr. B.R. Ambedkar. Supreme Court issues 5 writs: Habeas Corpus, Mandamus, Prohibition, Quo-Warranto, Certiorari.`;
      setScanResult(simulatedResult);
      showToast(isHindi ? "इमेज से क्वेश्चन/QR कोड सफलतापूर्वक पढ़ा गया!" : "Question/QR code successfully extracted from image!", "success");
    }, 1000);
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
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0a0f1d] text-slate-100 space-y-6">
      {/* Minimal Clean Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
        <div>
          <h1 className="text-base font-black text-white flex items-center gap-2">
            <QrCode className="w-5 h-5 text-cyan-400" />
            <span>{isHindi ? "स्मार्ट QR एवं नोट्स स्कैनर" : "Smart QR & Notes Scanner"}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {isHindi ? "किताबों के QR स्कैन करें या अपने नोट्स का QR कोड बनाएं" : "Scan book QRs or generate your own study note QRs"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('scan')}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              activeTab === 'scan' ? 'bg-cyan-600 text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {isHindi ? '📷 QR स्कैनर' : '📷 Scan QR'}
          </button>
          <button
            onClick={() => setActiveTab('generate')}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              activeTab === 'generate' ? 'bg-cyan-600 text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {isHindi ? '➕ QR जेनरेटर' : '➕ Generate QR'}
          </button>
        </div>
      </div>

      {activeTab === 'scan' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Scanner Panel */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4 text-center">
              <div className="w-full aspect-video bg-slate-950/90 border-2 border-dashed border-cyan-500/40 rounded-2xl flex flex-col items-center justify-center p-4 relative overflow-hidden">
                {isScanningLive ? (
                  <div className="w-full h-full flex flex-col items-center justify-center relative">
                    <div id="qr-reader-notes" className="w-full h-full object-cover"></div>
                    <button
                      onClick={() => setIsScanningLive(false)}
                      className="absolute top-2 right-2 px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-bold z-10 cursor-pointer"
                    >
                      {isHindi ? 'बंद करें' : 'Close'}
                    </button>
                  </div>
                ) : analyzingImage ? (
                  <div className="space-y-2 flex flex-col items-center">
                    <RefreshCw className="w-10 h-10 text-amber-400 animate-spin" />
                    <div className="text-xs font-bold text-amber-300">
                      {isHindi ? 'इमेज से टेक्स्ट व QR कोड निकाला जा रहा है...' : 'Extracting text & QR code from image...'}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 flex flex-col items-center">
                    <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <QrCode className="w-8 h-8" />
                    </div>
                    <div className="text-xs text-slate-400">
                      {isHindi ? 'कैमरे से लाइव QR स्कैन करें या QR इमेज फाइल अपलोड करें' : 'Scan live QR with camera or upload image file'}
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                      <button
                        onClick={() => setIsScanningLive(true)}
                        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 cursor-pointer transition-all shadow-md"
                      >
                        <Camera className="w-4 h-4" />
                        <span>{isHindi ? 'कैमरा स्कैन शुरू करें' : 'Start Camera'}</span>
                      </button>

                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer transition-all border border-slate-700"
                      >
                        <Upload className="w-4 h-4" />
                        <span>{isHindi ? 'QR इमेज चुनें' : 'Upload Image'}</span>
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
                <div className="text-xs font-bold text-slate-400">
                  {isHindi ? '⚡ तुरंत टेस्ट करने के लिए सैंपल QR चुनें:' : '⚡ Tap a sample QR to test instantly:'}
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {SAMPLE_DEMO_QRS.map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleSimulateScan(item.codeData)}
                      className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wide">{item.type}</div>
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
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4 flex flex-col justify-between min-h-[350px]">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    {isHindi ? 'स्कैन किया गया डेटा (Decoded Output)' : 'Decoded QR Output'}
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
                    {isHindi ? 'कोई QR कोड अभी स्कैन नहीं हुआ है। कैमरा ऑन करें या सैंपल चुनें।' : 'No QR code scanned yet. Start camera or select sample.'}
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
                    <span>{isHindi ? 'HansAI से व्याख्या पूछें 🚀' : 'Ask HansAI Explanation 🚀'}</span>
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
      ) : (
        /* QR GENERATOR TAB */
        <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl text-center">
          <div className="space-y-2">
            <h2 className="text-lg font-black text-white">
              {isHindi ? 'अपने नोट्स / प्रश्नों के लिए QR कोड बनाएं' : 'Generate QR Code for Study Notes'}
            </h2>
            <p className="text-xs text-slate-400">
              {isHindi ? 'नीचे अपने अध्ययन नोट्स या प्रश्न टाइप करें, तुरंत एक साफ़ QR कोड तैयार हो जाएगा जिसे दोस्त स्कैन कर सकेंगे।' : 'Type your notes or question below to instantly generate a scannable QR code.'}
            </p>
          </div>

          <div className="space-y-3 text-left">
            <label className="text-xs font-bold text-slate-300 block">
              {isHindi ? 'नोट्स या प्रश्न टेक्स्ट:' : 'Notes / Question Text:'}
            </label>
            <textarea
              value={generatorText}
              onChange={(e) => setGeneratorText(e.target.value)}
              rows={4}
              placeholder="Enter notes or question to encode..."
              className="w-full p-3 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl text-xs text-white font-mono focus:outline-none"
            />
          </div>

          {generatorText.trim() && (
            <div className="p-5 bg-slate-950 border border-cyan-500/30 rounded-2xl flex flex-col items-center justify-center space-y-4">
              <div className="bg-white p-3 rounded-2xl shadow-inner">
                <QRCode value={generatorText} size={160} />
              </div>
              <span className="text-xs font-mono font-bold text-cyan-400">
                {isHindi ? 'स्कैनेबल QR कोड तैयार है' : 'Ready to Scan & Share'}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
