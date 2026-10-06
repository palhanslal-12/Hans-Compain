import React, { useState } from 'react';
import { Calendar, CheckCircle2, Circle, Clock, Target, Sparkles, Award } from 'lucide-react';

interface StudySlot {
  id: string;
  time: string;
  subject: string;
  activity: string;
  duration: string;
  completed: boolean;
}

export const StudyPlanView: React.FC = () => {
  const [targetExam, setTargetExam] = useState<string>('steno');
  const [slots, setSlots] = useState<Record<string, StudySlot[]>>({
    steno: [
      { id: 's1', time: '06:00 AM - 07:30 AM', subject: 'आशुलिपि (Hindi Shorthand)', activity: '80 WPM डिक्टेशन लिखना व पढ़ना (2 संपादकीय)', duration: '90 मिनट', completed: true },
      { id: 's2', time: '08:30 AM - 10:00 AM', subject: 'सामान्य ज्ञान (General Awareness)', activity: 'दैनिक करेंट अफेयर्स + आधुनिक भारत का इतिहास', duration: '90 मिनट', completed: false },
      { id: 's3', time: '02:00 PM - 03:30 PM', subject: 'English Language', activity: 'Active/Passive Voice, Narration व 30 Vocab', duration: '90 मिनट', completed: false },
      { id: 's4', time: '05:00 PM - 06:30 PM', subject: 'रीजनिंग (General Intelligence)', activity: 'Coding-Decoding व Syllogism 50 प्रश्न', duration: '90 मिनट', completed: false },
      { id: 's5', time: '09:00 PM - 10:00 PM', subject: 'टाइपिंग व रिवीजन', activity: 'हिंदी मंगल फॉन्ट टाइपिंग + फ्लैशकार्ड्स दोहराव', duration: '60 मिनट', completed: false }
    ],
    board: [
      { id: 'b1', time: '06:30 AM - 08:00 AM', subject: 'गणित (Mathematics)', activity: 'त्रिकोणमिति एवं द्विघात समीकरण (K.C. Sinha)', duration: '90 मिनट', completed: true },
      { id: 'b2', time: '10:00 AM - 11:30 AM', subject: 'भौतिकी (Physics)', activity: 'ओम का नियम, विद्युत परिपथ व न्यूमेरिकल सवाल', duration: '90 मिनट', completed: false },
      { id: 'b3', time: '03:00 PM - 04:30 PM', subject: 'रसायन विज्ञान (Chemistry)', activity: 'रासायनिक अभिक्रियाएं व आवर्त सारणी याद करना', duration: '90 मिनट', completed: false },
      { id: 'b4', time: '07:00 PM - 08:30 PM', subject: 'जीव विज्ञान (Biology)', activity: 'मानव हृदय व पाचन तंत्र के सचित्र आरेख अभ्यास', duration: '90 मिनट', completed: false },
      { id: 'b5', time: '09:30 PM - 10:30 PM', subject: 'हिन्दी / संस्कृत', activity: 'व्याकरण, संधि-विच्छेद व निबंध लेखन', duration: '60 मिनट', completed: false }
    ]
  });

  const activeSlots = slots[targetExam] || slots.steno;

  const toggleComplete = (slotId: string) => {
    setSlots(prev => {
      const currentSlots = prev[targetExam] || [];
      return {
        ...prev,
        [targetExam]: currentSlots.map(s => s.id === slotId ? { ...s, completed: !s.completed } : s)
      };
    });
  };

  const completedCount = activeSlots.filter(s => s.completed).length;
  const progressPercent = Math.round((completedCount / activeSlots.length) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-5 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-blue-950/40 p-5 sm:p-6 rounded-3xl border border-indigo-500/30 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase border border-indigo-500/30 mb-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>व्यक्तिगत दैनिक समय-सारिणी (Personalized Timetable)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              दैनिक अध्ययन योजना (Study Plan &amp; Daily Routine)
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              अपने लक्ष्य के अनुसार वैज्ञानिक दैनिक रूटीन का पालन करें और आज के पूरे हुए विषयों पर टिक लगाएं।
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setTargetExam('steno')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                targetExam === 'steno' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              SSC &amp; स्टेनो रूटीन
            </button>
            <button
              onClick={() => setTargetExam('board')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                targetExam === 'board' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              10th / 12th बोर्ड रूटीन
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>आज की प्रगति (Today's Completion):</span>
            <span className="text-cyan-400 font-mono">{completedCount} / {activeSlots.length} स्लॉट ({progressPercent}%)</span>
          </div>
          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Slots List */}
      <div className="space-y-3">
        {activeSlots.map(slot => (
          <div
            key={slot.id}
            onClick={() => toggleComplete(slot.id)}
            className={`p-4 rounded-3xl border transition-all cursor-pointer flex items-center justify-between gap-3 shadow-md ${
              slot.completed
                ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-200'
                : 'bg-[#091122] border-slate-800 hover:border-slate-700 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <button className="text-xl shrink-0 cursor-pointer">
                {slot.completed ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                ) : (
                  <Circle className="w-6 h-6 text-slate-600" />
                )}
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-black ${slot.completed ? 'text-emerald-300 line-through' : 'text-white'}`}>
                    {slot.subject}
                  </span>
                  <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/20">
                    {slot.time}
                  </span>
                </div>
                <p className={`text-xs mt-0.5 ${slot.completed ? 'text-slate-500 line-through' : 'text-slate-400'}`}>
                  {slot.activity}
                </p>
              </div>
            </div>

            <span className="text-xs font-mono text-slate-500 shrink-0 hidden sm:inline-block">
              {slot.duration}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
