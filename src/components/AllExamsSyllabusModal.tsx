import React, { useState } from 'react';
import { X, BookOpen, CheckCircle2, Search, FileText, Award, ChevronRight } from 'lucide-react';

interface SyllabusCategory {
  id: string;
  title: string;
  badge: string;
  pattern: string;
  negativeMarking: string;
  targetViewId: string;
  subjects: { name: string; marks: string; topics: string[] }[];
}

const syllabusDatabase: Record<string, SyllabusCategory> = {
  ssc_steno: {
    id: 'ssc_steno',
    title: 'SSC Stenographer Grade C & D Official Syllabus 2026',
    badge: 'SSC & SKILL TEST',
    pattern: 'CBT 200 अंक (2 घंटे) + Shorthand Skill Test (80/100 WPM)',
    negativeMarking: '0.25 अंक प्रति गलत उत्तर',
    targetViewId: 'steno-master',
    subjects: [
      {
        name: '1. English Language & Comprehension (100 प्रश्न)',
        marks: '100 अंक',
        topics: ['Active & Passive Voice (10 प्रश्न)', 'Direct & Indirect Narration (10 प्रश्न)', 'Cloze Test (20 प्रश्न)', 'Reading Comprehension (15 प्रश्न)', 'Error Spotting, Synonyms, Antonyms & Idioms']
      },
      {
        name: '2. General Intelligence & Reasoning (50 प्रश्न)',
        marks: '50 अंक',
        topics: ['Coding-Decoding & Analogy', 'Number & Alphabet Series', 'Syllogism & Blood Relations', 'Direction Sense, Mirror Image & Paper Folding']
      },
      {
        name: '3. General Awareness & Current Affairs (50 प्रश्न)',
        marks: '50 अंक',
        topics: ['Daily Current Affairs (राष्ट्रीय व अंतर्राष्ट्रीय)', 'भारतीय संविधान, इतिहास व भूगोल', 'सामान्य विज्ञान (Physics, Chemistry, Biology)', 'नृत्य, त्योहार, पुरस्कार एवं पुस्तकें']
      },
      {
        name: '4. Shorthand Skill Test (आशुलिपि कौशल परीक्षा)',
        marks: 'Qualifying',
        topics: ['Grade D: 80 WPM (800 शब्द - 10 मिनट डिक्टेशन)', 'Grade C: 100 WPM (1000 शब्द - 10 मिनट डिक्टेशन)', 'हिन्दी या अंग्रेजी ट्रांसक्रिप्शन कंप्यूटर पर']
      }
    ]
  },
  ssc_cgl_railway: {
    id: 'ssc_cgl_railway',
    title: 'SSC CGL / CHSL / RRB NTPC & Group-D Syllabus',
    badge: 'TCS iON PATTERN',
    pattern: 'Tier-1 & Tier-2 कंप्यूटर आधारित परीक्षा (CBT)',
    negativeMarking: '1/4 (SSC) एवं 1/3 (Railway)',
    targetViewId: 'mock',
    subjects: [
      {
        name: '1. Quantitative Aptitude (गणित)',
        marks: '50 अंक',
        topics: ['Percentage, Profit & Loss, SI & CI', 'Time & Work, Time Speed Distance', 'Algebra, Trigonometry, Geometry & Mensuration 2D/3D', 'Data Interpretation (DI)']
      },
      {
        name: '2. General Science & GK (सामान्य विज्ञान व जीके)',
        marks: '50 अंक',
        topics: ['NCERT 9th & 10th Physics (विद्युत, प्रकाश, गति)', 'Chemistry (आवर्त सारणी, अम्ल-क्षार, धातु-अधातु)', 'Biology (मानव शरीर तंत्र, विटामिन व रोग)', 'Static GK & Current Affairs 2026']
      }
    ]
  },
  board_10_12: {
    id: 'board_10_12',
    title: '10th & 12th Board Exam Syllabus (BSEB Bihar / UP / CBSE)',
    badge: '50% OBJECTIVE PATTERN',
    pattern: '50% वस्तुनिष्ठ (OMR MCQs) + 50% लघु एवं दीर्घ उत्तरीय प्रश्न',
    negativeMarking: 'कोई नेगेटिव मार्किंग नहीं (No Negative Marking)',
    targetViewId: 'board-exam',
    subjects: [
      {
        name: '1. विज्ञान एवं भौतिकी (Science & Physics)',
        marks: '100 अंक (70 लिखित + 30 प्रैक्टिकल)',
        topics: ['प्रकाश का परावर्तन तथा अपवर्तन (लेंस व दर्पण सूत्र)', 'विद्युत धारा, ओम का नियम एवं चुंबकीय प्रभाव', 'रासायनिक अभिक्रियाएं एवं कार्बनिक यौगिक', 'जैव प्रक्रम, नियंत्रण एवं आनुवंशिकता']
      },
      {
        name: '2. गणित (Mathematics - K.C. Sinha & NCERT)',
        marks: '100 अंक',
        topics: ['वास्तविक संख्याएं, बहुपद व द्विघात समीकरण', 'समांतर श्रेणी (A.P.) एवं निर्देशांक ज्यामिति', 'त्रिकोणमिति के परिचय एवं ऊंचाई और दूरी', 'पृष्ठीय क्षेत्रफल, आयतन एवं प्रायिकता']
      }
    ]
  }
};

export const AllExamsSyllabusModal = ({
  isOpen,
  onClose,
  onNavigate
}: {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (viewId: string) => void;
}) => {
  const [selectedTab, setSelectedTab] = useState<string>('ssc_steno');
  const [searchQuery, setSearchQuery] = useState('');
  const [completedTopics, setCompletedTopics] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const currentSyllabus = syllabusDatabase[selectedTab] || syllabusDatabase.ssc_steno;

  const toggleTopic = (key: string) => {
    setCompletedTopics(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#091122] border-2 border-slate-800 rounded-3xl p-5 sm:p-7 max-w-3xl w-full space-y-4 shadow-2xl max-h-[90vh] flex flex-col text-white">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 text-lg">
              📚
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                अखिल भारतीय परीक्षा सिलेबस एवं पैटर्न 2026 (All Exams Syllabus)
              </h3>
              <p className="text-xs text-slate-400">
                SSC Stenographer, CGL, Railway RRB, Bihar/UP State Exams एवं 10th/12th बोर्ड का आधिकारिक पाठ्यक्रम।
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-950 border border-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs + Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shrink-0">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'ssc_steno', label: '✍️ SSC & Court Stenographer' },
              { id: 'ssc_cgl_railway', label: '🚆 SSC CGL / CHSL & Railway' },
              { id: 'board_10_12', label: '🎓 10th & 12th Board (BSEB/UP/CBSE)' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedTab(t.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedTab === t.id
                    ? 'bg-rose-600 text-white shadow-lg'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="सिलेबस टॉपिक खोजें..."
              className="bg-transparent border-none outline-none text-xs text-white placeholder:text-slate-500 w-36 sm:w-44"
            />
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          <div className="p-4 rounded-2xl bg-slate-950 border border-rose-500/30 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-black uppercase bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded">
                {currentSyllabus.badge}
              </span>
              <h4 className="text-sm sm:text-base font-black text-white mt-1">{currentSyllabus.title}</h4>
              <p className="text-xs text-slate-300 mt-0.5">पैटर्न: {currentSyllabus.pattern}</p>
            </div>
            <div className="flex flex-col sm:items-end gap-2">
              <div className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/20">
                नेगेटिव मार्किंग: {currentSyllabus.negativeMarking}
              </div>
              {onNavigate && (
                <button
                  onClick={() => {
                    onNavigate(currentSyllabus.targetViewId);
                    onClose();
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black flex items-center gap-1 cursor-pointer shadow"
                >
                  <span>इस सिलेबस का प्रैक्टिस हब खोलें</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {currentSyllabus.subjects.map((sub, idx) => {
              const filteredTopics = sub.topics.filter(t =>
                t.toLowerCase().includes(searchQuery.toLowerCase())
              );
              if (searchQuery && filteredTopics.length === 0) return null;

              return (
                <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-850 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                    <span className="text-xs sm:text-sm font-black text-cyan-300">{sub.name}</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">{sub.marks}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {filteredTopics.map((topic, tIdx) => {
                      const topicKey = `${selectedTab}-${idx}-${tIdx}`;
                      const isDone = !!completedTopics[topicKey];
                      return (
                        <div
                          key={tIdx}
                          onClick={() => toggleTopic(topicKey)}
                          className={`p-2 rounded-xl border flex items-center gap-2 text-xs cursor-pointer transition-all ${
                            isDone
                              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200 font-bold'
                              : 'bg-slate-900/50 border-slate-800/80 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <CheckCircle2
                            className={`w-3.5 h-3.5 shrink-0 ${
                              isDone ? 'text-emerald-400' : 'text-slate-600'
                            }`}
                          />
                          <span>{topic}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
