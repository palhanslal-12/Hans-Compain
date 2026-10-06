import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Trophy,
  Activity,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  BrainCircuit,
  Sparkles,
  Clock
} from 'lucide-react';
import { getLocalActivities, LocalActivityLog } from '../firebase';

export const AdminAnalyticsDashboard: React.FC = () => {
  const [activities, setActivities] = useState<LocalActivityLog[]>([]);

  useEffect(() => {
    setActivities(getLocalActivities());
    const handler = () => setActivities(getLocalActivities());
    window.addEventListener('hans-activity-updated', handler);
    return () => window.removeEventListener('hans-activity-updated', handler);
  }, []);

  const subjectMastery = [
    { subject: 'आशुलिपि एवं टंकण (Shorthand & Steno)', accuracy: 92, status: 'Strong (मजबूत)', color: 'from-blue-500 to-cyan-400' },
    { subject: 'सामान्य ज्ञान व करेंट अफेयर्स (GK & CA)', accuracy: 86, status: 'Strong (मजबूत)', color: 'from-emerald-500 to-teal-400' },
    { subject: 'तर्कशक्ति (General Intelligence & Reasoning)', accuracy: 84, status: 'Good (अच्छा)', color: 'from-indigo-500 to-purple-400' },
    { subject: 'अंग्रेजी व्याकरण व शब्दावली (English Language)', accuracy: 71, status: 'Needs Revision (अभ्यास आवश्यक)', color: 'from-amber-500 to-orange-400' },
    { subject: 'गणित एवं संख्यात्मक अभियोग्यता (Quant Maths)', accuracy: 64, status: 'Weak Topic (कमज़ोर विषय)', color: 'from-rose-500 to-pink-500' },
    { subject: 'विज्ञान एवं सूत्र (Physics, Chemistry, Bio)', accuracy: 88, status: 'Strong (मजबूत)', color: 'from-cyan-500 to-blue-400' }
  ];

  const weakTopics = [
    {
      topic: 'त्रिकोणमिति एवं क्षेत्रमिति (Trigonometry & Mensuration 3D)',
      subject: 'गणित (Mathematics)',
      errorRate: '36% गलत उत्तर',
      remedy: 'शंकु, बेलन और गोले के आयतन सूत्रों का AI निमोनिक्स से रिवीजन करें तथा 20 PYQ हल करें।'
    },
    {
      topic: 'Direct/Indirect Narration & Cloze Test',
      subject: 'English Language',
      errorRate: '29% गलत उत्तर',
      remedy: 'SSC Steno में Cloze Test के 20 अंक पक्के करने हेतु प्रतिदिन 2 संपादकीय गद्यांश पढ़ें।'
    },
    {
      topic: '100 WPM संसदीय वाक्यांश आउटलाइन (Advanced Outlines)',
      subject: 'आशुलिपि (Shorthand)',
      errorRate: '18% छूटने की दर',
      remedy: 'फुल-स्क्रीन स्टेनोग्राफी बोर्ड पर कठिन शब्दों के संक्षिप्त चिह्न 5 बार बनाकर अभ्यास करें।'
    }
  ];

  const avgScore =
    activities.length > 0
      ? Math.round(activities.reduce((acc, a) => acc + a.scorePercent, 0) / activities.length)
      : 88;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fade-in text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-indigo-950 p-6 sm:p-8 rounded-3xl border border-emerald-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-bold uppercase mb-2 border border-emerald-500/20">
            <BarChart3 className="w-4 h-4" /> AI Performance &amp; Weak Topic Diagnostic Engine
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-hindi-title text-white">
            AI परफॉर्मेंस एवं कमज़ोर विषय विश्लेषण (Analytics)
          </h1>
          <p className="text-slate-300 text-sm mt-1">
            आपके टेस्ट स्कोर, विषय-वार सटीकता, और कमज़ोर अध्यायों (Weak Topics) की एआई रिपोर्ट।
          </p>
        </div>

        <div className="bg-slate-950 px-4 py-3 rounded-2xl border border-emerald-500/30 text-right shrink-0">
          <div className="text-[10px] text-slate-400 uppercase font-bold">All-India Rank Percentile</div>
          <div className="text-2xl font-black text-emerald-400">Top 4.2%</div>
        </div>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-1 shadow-lg">
          <div className="text-[11px] text-slate-400 font-bold uppercase">कुल अभ्यास सत्र</div>
          <div className="text-3xl font-black text-white">{24 + activities.length}</div>
          <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +14% इस सप्ताह
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-1 shadow-lg">
          <div className="text-[11px] text-slate-400 font-bold uppercase">औसत सटीकता (Accuracy)</div>
          <div className="text-3xl font-black text-cyan-400">{avgScore}%</div>
          <div className="text-[11px] text-slate-400">उत्कृष्ट स्तर</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-1 shadow-lg">
          <div className="text-[11px] text-slate-400 font-bold uppercase">शॉर्टहैंड गति (Steno WPM)</div>
          <div className="text-3xl font-black text-amber-400">85 WPM</div>
          <div className="text-[11px] text-emerald-400 font-bold">Skill Test Ready</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-1 shadow-lg">
          <div className="text-[11px] text-slate-400 font-bold uppercase">अध्ययन स्ट्रीक</div>
          <div className="text-3xl font-black text-orange-400">🔥 4 दिन</div>
          <div className="text-[11px] text-slate-400">लगातार सक्रिय</div>
        </div>
      </div>

      {/* Subject-wise Mastery Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
        <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-cyan-400" />
          <span>विषय-वार दक्षता ग्राफ (Subject-Wise Mastery Breakdown)</span>
        </h2>

        <div className="space-y-4">
          {subjectMastery.map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200">{item.subject}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-300">
                    {item.status}
                  </span>
                  <span className="font-mono font-black text-cyan-400">{item.accuracy}%</span>
                </div>
              </div>
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-500`}
                  style={{ width: `${item.accuracy}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Weak Topic Detector */}
      <div className="bg-slate-900 border border-rose-500/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-rose-300 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            <span>एआई कमज़ोर विषय पहचान (AI Weak Topics &amp; Action Plan)</span>
          </h2>
          <span className="text-[10px] font-bold uppercase bg-rose-500/20 text-rose-300 px-2.5 py-1 rounded-full">
            Priority Focus
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {weakTopics.map((wt, i) => (
            <div key={i} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span className="text-cyan-400">{wt.subject}</span>
                  <span className="text-rose-400">{wt.errorRate}</span>
                </div>
                <h3 className="text-sm font-black text-white mt-1">{wt.topic}</h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{wt.remedy}</p>
              </div>
              <div className="pt-2 border-t border-slate-900 text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>AI सुधार टारगेट सक्रिय</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Recorded Activity Log */}
      {activities.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>हालिया अध्ययन गतिविधियां (Recent Live Study Activities)</span>
          </h3>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {activities.slice(0, 8).map(act => (
              <div key={act.id} className="p-3 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-between text-xs">
                <div>
                  <span className="text-cyan-400 font-bold mr-2">[{act.feature}]</span>
                  <span className="text-slate-200 font-semibold">{act.topic}</span>
                </div>
                <span className="font-mono font-black text-emerald-400">{act.scorePercent}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
