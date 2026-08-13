import React, { useState, useRef } from 'react';
import { 
  Camera, Upload, Sparkles, FileText, CheckCircle2, 
  HelpCircle, Volume2, VolumeX, Copy, Check, RefreshCw, 
  BookOpen, Brain, Download, ArrowRight, ShieldCheck 
} from 'lucide-react';
import { speakText, stopAllSpeech } from '../utils/speechUtils';

interface NotesOcrViewProps {
  onExportPdf: (title: string, elementId: string) => void;
  showToast: (msg: string, type?: 'info' | 'success' | 'warn') => void;
  language?: 'english' | 'hindi';
}

export const NotesOcrView: React.FC<NotesOcrViewProps> = ({ onExportPdf, showToast, language = 'hindi' }) => {
  const isHindi = language === 'hindi';

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState<string>('image/jpeg');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'text' | 'summary' | 'quiz'>('summary');
  
  // Digitized Results
  const [extractedText, setExtractedText] = useState<string>('');
  const [summaryText, setSummaryText] = useState<string>('');
  const [generatedQuiz, setGeneratedQuiz] = useState<Array<{
    question: string;
    options: string[];
    answerIndex: number;
    explanation: string;
  }>>([]);
  
  // Quiz Interaction State
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  
  // Audio State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showToast(isHindi ? "फ़ाइल बहुत बड़ी है (अधिकतम 10MB)" : "File too large (Max 10MB)", "warn");
        return;
      }
      setImageMime(file.type || 'image/jpeg');
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setSelectedImage(result);
        processNotesImage(result, file.type || 'image/jpeg');
      };
      reader.readAsDataURL(file);
    }
  };

  const processNotesImage = async (base64DataUrl: string, mimeType: string) => {
    setIsProcessing(true);
    setExtractedText('');
    setSummaryText('');
    setGeneratedQuiz([]);
    setUserAnswers({});
    setShowResults(false);
    stopAllSpeech();
    setIsPlayingAudio(false);

    showToast(isHindi ? "फोटो से नोट्स का विश्लेषण हो रहा है..." : "Analyzing handwritten photo notes...", "info");

    try {
      // Extract base64 payload
      const base64Data = base64DataUrl.split(',')[1];

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Perform thorough OCR and Academic Analysis on this uploaded handwritten/printed study note image strictly in ${isHindi ? 'Hindi' : 'English'}.
Return a structured output in Markdown with three clear sections:

### 📝 DIGITAL TEXT (डिजिटल पाठ)
[Exact transcription of the text in the image]

### 💡 SUMMARY & KEY FORMULAS (मुख्य सारांश व सूत्र)
[Bulleted summary, key terms, definitions, and formulas found in the note]

### 🧠 PRACTICE MCQS (अभ्यास बहुविकल्पीय प्रश्न)
[Provide 3 practice multiple-choice questions based on this note. Format each MCQ clearly as:
Q1: Question?
A) Option 1
B) Option 2
C) Option 3
D) Option 4
Answer: B
Explanation: Reason...]`,
          imagePayload: {
            mimeType,
            data: base64Data
          }
        })
      });

      if (!res.ok) throw new Error("Processing failed");

      const data = await res.json();
      const reply = data.reply || "";

      // Parse sections
      setSummaryText(reply);
      setExtractedText(reply);

      // Simple parse for MCQs
      const mcqs: Array<{ question: string; options: string[]; answerIndex: number; explanation: string }> = [];
      const qBlocks = reply.split(/Q\d+:/i);
      
      for (let i = 1; i < qBlocks.length; i++) {
        const block = qBlocks[i];
        const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
        const qText = lines[0] || "Practice Question";
        const options: string[] = [];
        let ansIdx = 0;
        let expText = "Based on uploaded notes.";

        lines.forEach(line => {
          if (/^[A-D]\)/i.test(line) || /^[A-D]\./i.test(line)) {
            options.push(line.replace(/^[A-D][\)\.]\s*/i, ''));
          } else if (line.toLowerCase().startsWith("answer:")) {
            const letter = line.split(":")[1]?.trim().toUpperCase();
            if (letter === 'A') ansIdx = 0;
            if (letter === 'B') ansIdx = 1;
            if (letter === 'C') ansIdx = 2;
            if (letter === 'D') ansIdx = 3;
          } else if (line.toLowerCase().startsWith("explanation:")) {
            expText = line.replace(/explanation:/i, '').trim();
          }
        });

        if (options.length >= 2) {
          mcqs.push({
            question: qText,
            options: options.slice(0, 4),
            answerIndex: ansIdx,
            explanation: expText
          });
        }
      }

      if (mcqs.length > 0) {
        setGeneratedQuiz(mcqs);
      }

      showToast(isHindi ? "नोट्स का सफलतापूर्वक डिजिटलीकरण हुआ!" : "Notes successfully scanned & analyzed!", "success");
    } catch (err) {
      console.error("Notes OCR error:", err);
      showToast(isHindi ? "फोटो विश्लेषण में त्रुटि आई। कृपया पुनः प्रयास करें।" : "Failed to analyze photo notes. Please retry.", "warn");
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleAudioSpeech = () => {
    if (isPlayingAudio) {
      stopAllSpeech();
      setIsPlayingAudio(false);
    } else {
      if (!summaryText) return;
      setIsPlayingAudio(true);
      speakText(summaryText, {
        onEnd: () => setIsPlayingAudio(false),
        onError: () => setIsPlayingAudio(false)
      });
    }
  };

  const handleCopyText = () => {
    if (!summaryText) return;
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    showToast(isHindi ? "टेक्स्ट कॉपी हो गया" : "Text copied to clipboard", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-5 space-y-4 font-sans text-left animate-fade-in" id="notes-ocr-export-node">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0B0F19] via-[#121829] to-[#0B0F19] border border-amber-500/30 p-5 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl shadow-inner">
            📷
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                HansAI Vision & OCR Engine
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
              {isHindi ? "हस्तलिखित नोट्स स्कैनर व डिजिटल गाइड" : "Handwritten Notes Photo Scanner"}
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              {isHindi 
                ? "कॉपी या किताब के पन्नों की फोटो अपलोड करें और तुरंत डिजिटल नोट्स, सारांश व क्विज़ पाएं।" 
                : "Upload or capture photos of handwritten copy pages to get digital text, summaries & practice MCQs."}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <input 
            type="file" 
            ref={fileInputRef} 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileChange} 
          />
          <input 
            type="file" 
            ref={cameraInputRef} 
            accept="image/*" 
            capture="environment" 
            className="hidden" 
            onChange={handleFileChange} 
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 md:flex-none px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/20"
          >
            <Upload className="w-4 h-4" />
            <span>{isHindi ? "फोटो अपलोड करें" : "Upload Photo"}</span>
          </button>

          <button
            onClick={() => cameraInputRef.current?.click()}
            className="flex-1 md:flex-none px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
          >
            <Camera className="w-4 h-4" />
            <span>{isHindi ? "कैमरा से खींचें" : "Take Photo"}</span>
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Image Preview & Upload Dropzone */}
        <div className="lg:col-span-5 bg-[#0B0F19] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 border-b border-slate-800 pb-2">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-400" />
              {isHindi ? "नोट्स की तस्वीर (Selected Note Image)" : "Note Image Preview"}
            </span>
            {selectedImage && (
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 font-mono">
                {isHindi ? "सक्रिय" : "Active"}
              </span>
            )}
          </div>

          <div className="my-auto py-3">
            {selectedImage ? (
              <div className="relative group rounded-xl overflow-hidden border border-slate-700 bg-black/40 max-h-[380px] flex items-center justify-center">
                <img 
                  src={selectedImage} 
                  alt="Uploaded Notes" 
                  className="max-h-[360px] w-auto object-contain rounded-lg" 
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-3 right-3 bg-slate-900/90 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-700 flex items-center gap-1.5 shadow-lg backdrop-blur"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{isHindi ? "बदलें" : "Change"}</span>
                </button>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-800 hover:border-amber-500/50 rounded-2xl p-8 text-center cursor-pointer transition-all bg-[#060913] group"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-slate-800/80 group-hover:bg-amber-500/20 flex items-center justify-center text-2xl transition-all">
                  📝
                </div>
                <h3 className="text-sm font-bold text-white mt-3">
                  {isHindi ? "हस्तलिखित नोट्स की फोटो यहां अपलोड करें" : "Upload photo of handwritten notes here"}
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  {isHindi 
                    ? "PNG, JPG या JPEG फोटो का चयन करें। AI स्वतः पढ़कर पूरा नोट्स तैयार कर देगा।" 
                    : "Select PNG or JPG photo. AI will automatically digitize & explain."}
                </p>
              </div>
            )}
          </div>

          {/* Tips Footer */}
          <div className="bg-[#060913] border border-slate-850 p-3 rounded-xl text-[11px] text-slate-400 space-y-1">
            <span className="font-bold text-amber-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              {isHindi ? "सटीक परिणाम पाने की सलाह:" : "Tips for Best Results:"}
            </span>
            <p>{isHindi ? "• फोटो साफ और अच्छी रोशनी में खींचें।" : "• Ensure clear lighting and legible handwriting."}</p>
            <p>{isHindi ? "• हिंदी या अंग्रेजी दोनों भाषा के नोट्स समर्थित हैं।" : "• Supports both Hindi and English notes."}</p>
          </div>
        </div>

        {/* Right Column: AI Output Tabs & Reader */}
        <div className="lg:col-span-7 bg-[#0B0F19] border border-slate-800 rounded-2xl p-4 flex flex-col space-y-3 min-h-[460px]">
          
          {/* Top Bar Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-1.5 bg-[#060913] p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab('summary')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'summary' 
                    ? 'bg-amber-500 text-slate-950 shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {isHindi ? "सारांश व सूत्र" : "Summary & Formulas"}
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  activeTab === 'quiz' 
                    ? 'bg-amber-500 text-slate-950 shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>{isHindi ? "अभ्यास क्विज़" : "Practice Quiz"}</span>
                {generatedQuiz.length > 0 && (
                  <span className="bg-slate-950 text-amber-300 px-1.5 py-0.2 rounded text-[10px] font-mono">
                    {generatedQuiz.length}
                  </span>
                )}
              </button>
            </div>

            {summaryText && (
              <div className="flex items-center gap-2">
                {/* Voice Reader Toggle */}
                <button
                  onClick={toggleAudioSpeech}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isPlayingAudio 
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse' 
                      : 'bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30'
                  }`}
                >
                  {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>{isPlayingAudio ? (isHindi ? "रोकें" : "Stop") : (isHindi ? "सुनें (Listen)" : "Listen")}</span>
                </button>

                {/* Copy Text Button */}
                <button
                  onClick={handleCopyText}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-all cursor-pointer border border-slate-700"
                  title="Copy"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>

                {/* PDF Export Button */}
                <button
                  onClick={() => onExportPdf("HansAI_Scanned_Notes", "notes-ocr-export-node")}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-slate-700"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>PDF</span>
                </button>
              </div>
            )}
          </div>

          {/* Content Output Body */}
          <div className="flex-1 overflow-y-auto max-h-[440px] pr-1">
            {isProcessing ? (
              <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
                <Sparkles className="w-10 h-10 text-amber-400 animate-spin" />
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {isHindi ? "फोटो नोट्स का विश्लेषण किया जा रहा है..." : "Processing handwritten notes with AI OCR..."}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {isHindi ? "पाठ, सूत्र और अभ्यास प्रश्नों का निर्माण हो रहा है।" : "Extracting handwriting, key facts, and practice MCQs."}
                  </p>
                </div>
              </div>
            ) : summaryText ? (
              activeTab === 'summary' ? (
                <div className="prose prose-invert prose-sm max-w-none text-slate-200 leading-relaxed whitespace-pre-wrap font-sans text-xs sm:text-sm bg-[#060913] p-4 rounded-xl border border-slate-800">
                  {summaryText}
                </div>
              ) : (
                <div className="space-y-4">
                  {generatedQuiz.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 text-xs">
                      {isHindi ? "इस नोट्स से जुड़े अभ्यास प्रश्न ऊपर 'सारांश' में उपलब्ध हैं।" : "Practice questions parsed in summary view."}
                    </div>
                  ) : (
                    generatedQuiz.map((q, qIdx) => {
                      const selectedOpt = userAnswers[qIdx];
                      const isAnswered = selectedOpt !== undefined;
                      const isCorrect = selectedOpt === q.answerIndex;

                      return (
                        <div key={qIdx} className="bg-[#060913] border border-slate-800 p-4 rounded-xl space-y-3">
                          <div className="flex items-start gap-2">
                            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-bold rounded border border-amber-500/30">
                              Q{qIdx + 1}
                            </span>
                            <p className="text-xs sm:text-sm font-bold text-white leading-snug">
                              {q.question}
                            </p>
                          </div>

                          <div className="grid grid-cols-1 gap-2 pt-1">
                            {q.options.map((opt, optIdx) => {
                              let btnClass = "bg-[#0B0F19] hover:bg-slate-800 text-slate-200 border-slate-800";
                              if (showResults) {
                                if (optIdx === q.answerIndex) {
                                  btnClass = "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold";
                                } else if (selectedOpt === optIdx) {
                                  btnClass = "bg-rose-500/20 border-rose-500/50 text-rose-300";
                                }
                              } else if (selectedOpt === optIdx) {
                                btnClass = "bg-indigo-600/30 border-indigo-500 text-white font-bold";
                              }

                              return (
                                <button
                                  key={optIdx}
                                  disabled={showResults}
                                  onClick={() => setUserAnswers(prev => ({ ...prev, [qIdx]: optIdx }))}
                                  className={`w-full text-left px-3.5 py-2.5 rounded-xl border text-xs transition-all flex items-center justify-between cursor-pointer ${btnClass}`}
                                >
                                  <span>{opt}</span>
                                  {showResults && optIdx === q.answerIndex && (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {showResults && (
                            <div className="mt-2 p-2.5 bg-slate-900/80 rounded-lg border border-slate-800 text-[11px] text-slate-300">
                              <strong className="text-amber-400 block mb-0.5">{isHindi ? "व्याख्या:" : "Explanation:"}</strong>
                              {q.explanation}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}

                  {generatedQuiz.length > 0 && !showResults && (
                    <button
                      onClick={() => setShowResults(true)}
                      className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg cursor-pointer transition-all uppercase tracking-wider"
                    >
                      {isHindi ? "उत्तर व व्याख्या देखें" : "Submit & Check Answers"}
                    </button>
                  )}
                </div>
              )
            ) : (
              <div className="py-20 text-center space-y-2 text-slate-500">
                <Brain className="w-10 h-10 mx-auto text-slate-700" />
                <p className="text-xs">
                  {isHindi 
                    ? "बाईं ओर से अपनी कॉपी के नोट्स की फोटो अपलोड करें।" 
                    : "Upload a photo of your study notes on the left to begin analysis."}
                </p>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
