import React, { useState } from 'react';
import { Camera, Upload, Sparkles, CheckCircle2, HelpCircle, Download, FileText } from 'lucide-react';

interface PhotoDoubtViewProps {
  onExportPdf: (title: string, elementId: string) => void;
  showToast: (msg: string, type?: 'info' | 'success' | 'warn') => void;
}

export const PhotoDoubtView: React.FC<PhotoDoubtViewProps> = ({ onExportPdf, showToast }) => {
  const [image, setImage] = useState<{ mimeType: string; data: string; previewUrl: string } | null>(null);
  const [userQuery, setUserQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = (reader.result as string).split(",")[1];
      setImage({
        mimeType: file.type,
        data: base64String,
        previewUrl: URL.createObjectURL(file)
      });
      showToast("Question photo uploaded! Click Solve Doubt to process. 📸", "info");
    };
    reader.readAsDataURL(file);
  };

  const handleSolveDoubt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      showToast("Please upload or capture an image of your question first.", "warn");
      return;
    }
    setIsProcessing(true);
    try {
      const res = await fetch("/api/ocr-solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: image.data,
          mimeType: image.mimeType,
          userQuery
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Doubt solver failed");
      setResult(data.ocrResult);
      showToast("Doubt solved & practice MCQs ready! 🧠", "success");
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Failed to solve doubt from photo.", "warn");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#03060E] text-slate-100 min-h-full">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900/50 via-teal-900/50 to-slate-900 border border-emerald-500/30 rounded-2xl p-5 shadow-xl flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs uppercase tracking-wider mb-1">
              <Camera className="w-4 h-4" />
              <span>Smart Vision Doubt Solver</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Photo Doubt Solver & OCR MCQ Generator / फोटो समाधान
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Upload any question photo from textbooks or mock papers to get an instant AI solution and similar practice MCQs.
            </p>
          </div>
        </div>

        {/* Upload & Form */}
        <form onSubmit={handleSolveDoubt} className="bg-[#0A0E1A] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            
            {/* Image Upload Area */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                Upload Question Image / प्रश्न का फोटो अपलोड करें
              </label>
              <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-2xl p-4 text-center bg-[#03060E] relative cursor-pointer transition-all">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {image ? (
                  <div className="space-y-2">
                    <img src={image.previewUrl} alt="Question Uploaded" className="max-h-40 mx-auto rounded-lg object-contain" />
                    <span className="text-[11px] text-emerald-400 font-bold block">Change Photo 📸</span>
                  </div>
                ) : (
                  <div className="py-6 space-y-2">
                    <Upload className="w-8 h-8 text-emerald-400 mx-auto" />
                    <p className="text-xs text-slate-300 font-semibold">Click or drag & drop textbook photo</p>
                    <p className="text-[10px] text-slate-500">Supports PNG, JPG, JPEG, WebP</p>
                  </div>
                )}
              </div>
            </div>

            {/* Query Input */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-300">
                Additional Instructions / अतिरिक्त प्रश्न विवरण (Optional)
              </label>
              <textarea
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="e.g. Explain step 2 clearly or explain in Hindi with shortcuts..."
                rows={4}
                className="w-full text-xs p-3 bg-[#03060E] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 resize-none"
              />
              <button
                type="submit"
                disabled={isProcessing || !image}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer border-none disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Analyzing Photo & Solving Doubt...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Solve Question Photo / समाधान प्राप्त करें</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </form>

        {/* Solution Output */}
        {result && (
          <div id="ocr-solution-export-container" className="bg-[#0A0E1A] border border-emerald-500/30 rounded-2xl p-5 sm:p-6 space-y-6 shadow-xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-black text-white">Verified AI Solution</h2>
              </div>
              <button
                onClick={() => onExportPdf("Doubt Solution & MCQs", "ocr-solution-export-container")}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-300 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>
            </div>

            {/* Extracted Text */}
            {result.extractedText && (
              <div className="bg-[#03060E] border border-slate-800 rounded-xl p-4 text-xs space-y-1">
                <div className="font-extrabold text-slate-400 text-[10px] uppercase tracking-wider flex items-center gap-1">
                  <FileText className="w-3 h-3 text-indigo-400" />
                  Extracted Question Text
                </div>
                <p className="text-slate-200 font-mono whitespace-pre-wrap">{result.extractedText}</p>
              </div>
            )}

            {/* Comprehensive Solution */}
            <div className="bg-[#03060E] border border-emerald-500/20 rounded-xl p-4 text-xs space-y-2">
              <div className="font-extrabold text-emerald-400 text-sm">💡 Detailed Step-by-Step Explanation</div>
              <div className="text-slate-200 leading-relaxed whitespace-pre-wrap">{result.solution}</div>
            </div>

            {/* Practice MCQs generated from OCR */}
            {result.practiceMcqs && result.practiceMcqs.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  Similar Practice MCQs Generated from this Photo
                </h3>
                <div className="space-y-3">
                  {result.practiceMcqs.map((mcq: any, mIdx: number) => (
                    <div key={mIdx} className="bg-[#03060E] border border-slate-800 rounded-xl p-4 space-y-2">
                      <p className="text-xs font-bold text-slate-200">{mIdx + 1}. {mcq.question}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {mcq.options && mcq.options.map((opt: string, oIdx: number) => (
                          <div
                            key={oIdx}
                            className={`p-2 rounded-lg text-[11px] border ${
                              oIdx === mcq.answerIndex
                                ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300 font-bold"
                                : "bg-slate-900 border-slate-800 text-slate-300"
                            }`}
                          >
                            {String.fromCharCode(65 + oIdx)}. {opt}
                          </div>
                        ))}
                      </div>
                      {mcq.explanation && (
                        <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-850">
                          <strong className="text-amber-300">Explanation:</strong> {mcq.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
