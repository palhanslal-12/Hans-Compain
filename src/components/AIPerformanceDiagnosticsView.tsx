import React, { useState } from 'react';
import { 
  Activity, Sparkles, Brain, CheckCircle, AlertTriangle, Download, 
  RotateCcw, BookOpen, Target, ArrowRight, BarChart2, Zap, ShieldAlert,
  Flame, Award, Layers, Search
} from 'lucide-react';

interface WeakTopicItem {
  id: string;
  subject: string;
  topic: string;
  accuracyRate: number; // e.g. 42%
  riskLevel: 'critical' | 'moderate' | 'stable';
  lastAssessed: string;
  gapReason: string;
  remediationSteps: string[];
  practiceQuestions: Array<{
    q: string;
    options: string[];
    correct: number;
    explanation: string;
  }>;
}

const DEFAULT_WEAK_AREAS: WeakTopicItem[] = [
  {
    id: 'weak-1',
    subject: 'Polity & Constitution',
    topic: 'Writs & Constitutional Remedies (Article 32 & 226)',
    accuracyRate: 38,
    riskLevel: 'critical',
    lastAssessed: '2 days ago',
    gapReason: 'Confusion between Mandamus (परमादेश) vs Quo-Warranto (अधिकार-पृच्छा) jurisdiction over private individuals.',
    remediationSteps: [
      'Step 1: Note that Mandamus cannot be issued against a purely private individual or contract.',
      'Step 2: Remember Habeas Corpus (बंदी प्रत्यक्षीकरण) applies to both public and private detention.',
      'Step 3: Solve the 5 target MCQs below.'
    ],
    practiceQuestions: [
      {
        q: 'Which writ can be issued against both public authorities and private individuals?',
        options: ['Mandamus (परमादेश)', 'Habeas Corpus (बंदी प्रत्यक्षीकरण)', 'Quo-Warranto (अधिकार-पृच्छा)', 'Certiorari (उत्प्रेषण)'],
        correct: 1,
        explanation: 'Habeas Corpus (बंदी प्रत्यक्षीकरण) is the only writ that can be issued against both public authorities and private individuals.'
      },
      {
        q: 'Article 32 can be invoked for the enforcement of:',
        options: ['Fundamental Rights only', 'Directive Principles', 'Statutory Rights only', 'Fundamental Duties'],
        correct: 0,
        explanation: 'Article 32 is guaranteed only for Fundamental Rights under Part III of the Constitution.'
      }
    ]
  },
  {
    id: 'weak-2',
    subject: 'Quantitative Aptitude',
    topic: 'Time, Speed & Distance (Relative Speed of Trains)',
    accuracyRate: 45,
    riskLevel: 'critical',
    lastAssessed: '1 day ago',
    gapReason: 'Conversion errors between km/h and m/s (multiply by 5/18 vs 18/5) and bridge length addition.',
    remediationSteps: [
      'Step 1: Always convert km/h to m/s by multiplying with 5/18.',
      'Step 2: Total Distance = Length of Train + Length of Platform/Bridge.',
      'Step 3: Opposite directions = Add speeds (S1 + S2); Same direction = Subtract (S1 - S2).'
    ],
    practiceQuestions: [
      {
        q: 'A train 150m long moving at 72 km/h crosses a platform 250m long in how many seconds?',
        options: ['15 seconds', '20 seconds', '25 seconds', '30 seconds'],
        correct: 1,
        explanation: 'Speed = 72 * (5/18) = 20 m/s. Total Distance = 150 + 250 = 400m. Time = 400 / 20 = 20 seconds.'
      }
    ]
  },
  {
    id: 'weak-3',
    subject: 'General Science',
    topic: 'Human Eye Optics & Lens Corrections (Myopia vs Hypermetropia)',
    accuracyRate: 58,
    riskLevel: 'moderate',
    lastAssessed: '3 days ago',
    gapReason: 'Mixing concave vs convex lens powers and image formation in front of vs behind retina.',
    remediationSteps: [
      'Step 1: Myopia (निकट दृष्टि दोष) = Image formed in front of retina → Concave (अवतल) lens.',
      'Step 2: Hypermetropia (दूर दृष्टि दोष) = Image formed behind retina → Convex (उत्तल) lens.',
      'Step 3: Presbyopia (जरा दृष्टि दोष) = Bifocal lens.'
    ],
    practiceQuestions: [
      {
        q: 'Myopia (Near-sightedness) is corrected using which lens?',
        options: ['Convex Lens (उत्तल लेंस)', 'Concave Lens (अवतल लेंस)', 'Bifocal Lens', 'Cylindrical Lens'],
        correct: 1,
        explanation: 'Myopia is corrected by using a concave lens (diverging lens) which pushes the image back onto the retina.'
      }
    ]
  },
  {
    id: 'weak-4',
    subject: 'Shorthand / Stenography',
    topic: 'Pitman Halving Principle & Circle S Rules',
    accuracyRate: 52,
    riskLevel: 'moderate',
    lastAssessed: '4 days ago',
    gapReason: 'Strokes halved for T or D when followed by a vowel or compound curve.',
    remediationSteps: [
      'Step 1: A stroke is halved to express T or D in thin strokes, and only D in thick strokes with proper join.',
      'Step 2: Do not halve when a final vowel follows T or D (e.g. Pit vs Pity).',
      'Step 3: Practice speed drills at 80 WPM.'
    ],
    practiceQuestions: [
      {
        q: 'In Pitman Shorthand, what does the halving principle indicate?',
        options: ['Addition of R or L', 'Addition of T or D', 'Addition of ing', 'Addition of Shun hook'],
        correct: 1,
        explanation: 'Halving a stroke indicates the addition of T or D (e.g., Thought, Part, Late).'
      }
    ]
  }
];

interface AIPerformanceDiagnosticsViewProps {
  language: 'english' | 'hindi';
  showToast: (msg: string, type?: 'success' | 'error' | 'info' | 'warn') => void;
  onExportPdf?: (title: string, elementId?: string, rawText?: string) => void;
  onNavigateToQuiz?: (subject: string) => void;
}

export const AIPerformanceDiagnosticsView: React.FC<AIPerformanceDiagnosticsViewProps> = ({
  language,
  showToast,
  onExportPdf,
  onNavigateToQuiz
}) => {
  const isHindi = language === 'hindi';
  const [weakTopics, setWeakTopics] = useState<WeakTopicItem[]>(DEFAULT_WEAK_AREAS);
  const [selectedTopic, setSelectedTopic] = useState<WeakTopicItem>(DEFAULT_WEAK_AREAS[0]);
  const [activeQuestionAnswers, setActiveQuestionAnswers] = useState<Record<number, number>>({});
  const [isGeneratingWorksheet, setIsGeneratingWorksheet] = useState<boolean>(false);
  const [customSubjectInput, setCustomSubjectInput] = useState<string>('');

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    setActiveQuestionAnswers(prev => ({
      ...prev,
      [qIdx]: optIdx
    }));
  };

  const handleGenerateAIAnalysis = () => {
    if (!customSubjectInput.trim()) {
      showToast(isHindi ? "कृपया विषय या परीक्षा का नाम दर्ज करें।" : "Please enter a subject or topic name.", "warn");
      return;
    }

    setIsGeneratingWorksheet(true);
    setTimeout(() => {
      const newTopic: WeakTopicItem = {
        id: `custom-${Date.now()}`,
        subject: customSubjectInput.trim(),
        topic: `${customSubjectInput.trim()}: Core Conceptual Review & Diagnostic`,
        accuracyRate: 40,
        riskLevel: 'critical',
        lastAssessed: 'Just now',
        gapReason: `AI has detected potential conceptual gaps in ${customSubjectInput.trim()} key definitions and formula recall.`,
        remediationSteps: [
          `Step 1: Review the 3 core principles of ${customSubjectInput.trim()}.`,
          `Step 2: Memorize short memory mnemonic anchors and active formulas.`,
          `Step 3: Solve daily 5-question active recall drill.`
        ],
        practiceQuestions: [
          {
            q: `What is the foundational principle of ${customSubjectInput.trim()} in competitive exams?`,
            options: ['Conceptual clarity and active recall', 'Rote memorization without practice', 'Ignoring previous year questions', 'Only last-day revision'],
            correct: 0,
            explanation: 'Mastery requires conceptual clarity, regular active recall drills, and solving PYQs.'
          }
        ]
      };

      setWeakTopics(prev => [newTopic, ...prev]);
      setSelectedTopic(newTopic);
      setIsGeneratingWorksheet(false);
      setCustomSubjectInput('');
      showToast(isHindi ? `"${newTopic.subject}" का डायग्नोस्टिक वर्कशीट तैयार हो गया!` : `Diagnostic worksheet generated for ${newTopic.subject}!`, "success");
    }, 800);
  };

  const handleDownloadWorksheet = () => {
    let text = `=== HANS AI WEAK AREA REMEDIATION WORKSHEET ===\n`;
    text += `Topic: ${selectedTopic.topic}\n`;
    text += `Subject: ${selectedTopic.subject}\n`;
    text += `Current Mastery / Accuracy: ${selectedTopic.accuracyRate}%\n`;
    text += `Identified Gap: ${selectedTopic.gapReason}\n\n`;
    text += `--- 3-STEP REMEDIATION ACTION PLAN ---\n`;
    selectedTopic.remediationSteps.forEach(step => {
      text += `• ${step}\n`;
    });
    text += `\n--- PRACTICE DIAGNOSTIC QUESTIONS ---\n`;
    selectedTopic.practiceQuestions.forEach((q, idx) => {
      text += `\nQ${idx + 1}: ${q.q}\n`;
      q.options.forEach((opt, oIdx) => {
        text += `  [${oIdx + 1}] ${opt}\n`;
      });
      text += `Correct Answer: [${q.correct + 1}] ${q.options[q.correct]}\n`;
      text += `Explanation: ${q.explanation}\n`;
    });

    if (onExportPdf) {
      onExportPdf(`${selectedTopic.subject} Remediation Worksheet`, undefined, text);
    } else {
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Remediation_Worksheet_${selectedTopic.subject.replace(/\s+/g, '_')}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      showToast("Worksheet downloaded! 📥", "success");
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#03060E] text-slate-100 min-h-full">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Hero Banner */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
              <Activity className="w-4 h-4 text-indigo-400" />
              <span>AI Conceptual Gap & Weak Area Engine</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>📊</span>
              <span>{isHindi ? "कमज़ोर विषय विश्लेषण एवं सुधार" : "AI Performance Diagnostics"}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              {isHindi
                ? "क्विज़ एवं टेस्ट के आधार पर कमज़ोर विषयों की पहचान, वैचारिक अंतराल का विश्लेषण और 3-चरणीय कस्टम वर्कशीट।"
                : "Identify conceptual gaps from quiz responses and automatically generate customized 3-step revision worksheets."}
            </p>
          </div>
          <button
            onClick={handleDownloadWorksheet}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm cursor-pointer shrink-0 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>{isHindi ? "वर्कशीट PDF डाउनलोड" : "Download Worksheet PDF"}</span>
          </button>
        </div>

        {/* Quick User Guide Box (Onboarding Helper) */}
        <div className="bg-indigo-950/25 border border-indigo-500/30 rounded-2xl p-5 space-y-3">
          <h2 className="text-xs font-black text-indigo-300 uppercase tracking-widest flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{isHindi ? "🚀 इसका उपयोग कैसे करें? (Quick Step-by-Step Guide)" : "🚀 How to Use this Tool? (Quick Guide)"}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/40 p-3.5 border border-slate-800/60 rounded-xl space-y-1.5">
              <div className="text-xs font-black text-amber-400 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center font-mono font-bold text-[10px]">1</span>
                <span>{isHindi ? "विषय चुनें या खोजें" : "Choose / Enter Topic"}</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {isHindi 
                  ? "बाईं ओर दी गई चिह्नित कमज़ोर टॉपिक की लिस्ट से कोई टॉपिक चुनें, या ऊपर बने सर्च इनपुट में कोई नया विषय लिखकर 'Diagnose' करें।"
                  : "Pick an identified weak topic from the left sidebar list, or type any subject/chapter in the box above and click 'Diagnose'."}
              </p>
            </div>
            <div className="bg-slate-900/40 p-3.5 border border-slate-800/60 rounded-xl space-y-1.5">
              <div className="text-xs font-black text-sky-400 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-sky-500/10 text-sky-400 flex items-center justify-center font-mono font-bold text-[10px]">2</span>
                <span>{isHindi ? "3-चरणीय सुधार योजना पढ़ें" : "Study Action Plan"}</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {isHindi 
                  ? "AI आपके लिए वैचारिक अंतराल (Conceptual Gap Analysis) और उसे मजबूत करने के लिए 3 बहुत ही आसान कदम (3-Step Action Plan) दर्शाएगा।"
                  : "Review the AI-identified conceptual gaps and follow the personalized 3-step action plan carefully to clear confusion."}
              </p>
            </div>
            <div className="bg-slate-900/40 p-3.5 border border-slate-800/60 rounded-xl space-y-1.5">
              <div className="text-xs font-black text-emerald-400 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-mono font-bold text-[10px]">3</span>
                <span>{isHindi ? "लाइव अभ्यास प्रश्न हल करें" : "Solve Practice Drills"}</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {isHindi 
                  ? "नीचे दिए गए अभ्यास प्रश्नों (Targeted MCQs) को हल करें। सही/गलत उत्तर चुनने पर विस्तृत स्पष्टीकरण (Explanation) ज़रूर पढ़ें।"
                  : "Solve the quick practice multiple-choice questions at the bottom. Read the explanation on submit to secure your progress."}
              </p>
            </div>
          </div>
        </div>

        {/* Custom Subject Diagnostic Trigger */}
        <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 w-full relative">
            <input
              type="text"
              value={customSubjectInput}
              onChange={(e) => setCustomSubjectInput(e.target.value)}
              placeholder={isHindi ? "किसी भी विषय/टॉपिक का नाम लिखें (उदा. सिंधु घाटी सभ्यता, Trigonometry, Reasoning)..." : "Enter any subject/topic (e.g. Modern History, Speed Maths, Polity Articles)..."}
              className="w-full px-4 py-2.5 bg-[#03060E] border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <button
            onClick={handleGenerateAIAnalysis}
            disabled={isGeneratingWorksheet}
            className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-50 transition-colors"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{isGeneratingWorksheet ? (isHindi ? "स्कैनिंग..." : "Scanning...") : (isHindi ? "नया टॉपिक डायग्नोस करें" : "Diagnose Topic")}</span>
          </button>
        </div>

        {/* Main Grid: Left Weak Topics List, Right Selected Topic Worksheet */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Weak Areas List */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between px-1">
              <span>{isHindi ? "चिह्नित कमज़ोर विषय" : "Identified Weak Topics"}</span>
              <span className="text-indigo-400">{weakTopics.length} Focus Areas</span>
            </div>

            {weakTopics.map((topic) => (
              <div
                key={topic.id}
                onClick={() => setSelectedTopic(topic)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedTopic.id === topic.id
                    ? 'bg-indigo-950/30 border-indigo-500 shadow-xl shadow-indigo-900/20'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                    {topic.subject}
                  </span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    topic.riskLevel === 'critical'
                      ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                      : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                  }`}>
                    {topic.accuracyRate}% Accuracy
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-1">
                  {topic.topic}
                </h3>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                  {topic.gapReason}
                </p>
              </div>
            ))}
          </div>

          {/* Right Column: In-depth Remediation Worksheet */}
          <div className="lg:col-span-2 space-y-5">
            <div className="p-5 sm:p-6 bg-slate-900/50 border border-slate-800 rounded-3xl space-y-5 shadow-xl">
              
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] text-indigo-400 font-mono font-bold uppercase tracking-wider">
                    {selectedTopic.subject}
                  </span>
                  <h2 className="text-base sm:text-lg font-black text-white mt-0.5">
                    {selectedTopic.topic}
                  </h2>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-slate-400">Conceptual Health</div>
                  <div className="text-base font-black text-amber-400">{selectedTopic.accuracyRate}% (Low)</div>
                </div>
              </div>

              {/* Identified Gap Box */}
              <div className="p-4 bg-rose-950/30 border border-rose-500/30 rounded-2xl space-y-1.5">
                <div className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>{isHindi ? "पहचाना गया वैचारिक अंतराल (Identified Gap):" : "Identified Conceptual Gap:"}</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {selectedTopic.gapReason}
                </p>
              </div>

              {/* 3-Step Action Plan */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" />
                  <span>{isHindi ? "3-चरणीय सुधार योजना (3-Step Action Plan):" : "3-Step Remediation Plan:"}</span>
                </h3>

                <div className="space-y-2">
                  {selectedTopic.remediationSteps.map((step, idx) => (
                    <div key={idx} className="p-3 bg-[#03060E] border border-slate-800 rounded-xl text-xs text-slate-200 flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Practice Questions */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{isHindi ? "लक्षित अभ्यास प्रश्न (Targeted Drill):" : "Targeted Practice Drill:"}</span>
                </h3>

                <div className="space-y-4">
                  {selectedTopic.practiceQuestions.map((q, qIdx) => {
                    const selectedOpt = activeQuestionAnswers[qIdx];
                    const isAnswered = selectedOpt !== undefined;

                    return (
                      <div key={qIdx} className="p-4 bg-[#050814] border border-slate-800 rounded-2xl space-y-3">
                        <div className="text-xs sm:text-sm font-bold text-white">
                          <span className="text-amber-400 mr-1.5">Q{qIdx + 1}.</span>
                          {q.q}
                        </div>

                        <div className="space-y-1.5">
                          {q.options.map((opt, oIdx) => (
                            <button
                              key={oIdx}
                              onClick={() => handleSelectOption(qIdx, oIdx)}
                              className={`w-full p-2.5 rounded-xl text-xs font-semibold text-left transition-all border cursor-pointer ${
                                isAnswered
                                  ? oIdx === q.correct
                                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold'
                                    : oIdx === selectedOpt
                                    ? 'bg-rose-950/80 border-rose-500 text-rose-200 font-bold'
                                    : 'bg-[#03060E] border-slate-800 text-slate-400'
                                  : 'bg-[#03060E] border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white'
                              }`}
                            >
                              <span className="font-mono mr-2">{String.fromCharCode(65 + oIdx)}.</span>
                              <span>{opt}</span>
                            </button>
                          ))}
                        </div>

                        {isAnswered && (
                          <div className="p-3 bg-indigo-950/30 border border-indigo-500/20 rounded-xl text-xs text-indigo-200 animate-fade-in">
                            <span className="font-bold text-amber-400">व्याख्या: </span>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
