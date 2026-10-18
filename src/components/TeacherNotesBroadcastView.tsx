import React, { useState, useEffect } from 'react';
import { X, FileText, Download, Plus, Trash2, BookOpen, Share2, Sparkles, CheckCircle2 } from 'lucide-react';
import { playNaturalSpeech } from '../utils/naturalSpeech';

interface TeacherNotesViewProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
}

interface ClassNoteItem {
  id: string;
  title: string;
  subject: string;
  classLevel: string;
  pdfUrl: string;
  date: string;
  author: string;
}

const defaultNotes: ClassNoteItem[] = [
  {
    id: 'n1',
    title: 'कक्षा 10वीं विज्ञान - प्रकाश का परावर्तन व अपवर्तन (महत्वपूर्ण नोट्स)',
    subject: 'Science (विज्ञान)',
    classLevel: 'Class 10th',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    date: '18 अक्टूबर 2026',
    author: 'Hans Compain Academic Team'
  },
  {
    id: 'n2',
    title: 'SSC Steno 80 WPM Shorthand Dictation PDF & Outlines',
    subject: 'Stenography',
    classLevel: 'Competitive',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    date: '17 अक्टूबर 2026',
    author: 'Hanslal Pal (Founder)'
  },
  {
    id: 'n3',
    title: 'इतिहास - भारत में राष्ट्रवाद (बोर्ड परीक्षा 2026 विशेष)',
    subject: 'Social Science (इतिहास)',
    classLevel: 'Class 10th / 12th',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    date: '16 अक्टूबर 2026',
    author: 'Expert Board Panel'
  }
];

export const TeacherNotesBroadcastView: React.FC<TeacherNotesViewProps> = ({
  isOpen,
  onClose,
  isAdmin = true
}) => {
  const [notesList, setNotesList] = useState<ClassNoteItem[]>(() => {
    try {
      const saved = localStorage.getItem('hans_teacher_notes_list');
      return saved ? JSON.parse(saved) : defaultNotes;
    } catch {
      return defaultNotes;
    }
  });

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Science (विज्ञान)');
  const [newClassLevel, setNewClassLevel] = useState('Class 10th');
  const [newUrl, setNewUrl] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('hans_teacher_notes_list', JSON.stringify(notesList));
    } catch {}
  }, [notesList]);

  if (!isOpen) return null;

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    const newItem: ClassNoteItem = {
      id: `note_${Date.now()}`,
      title: newTitle.trim(),
      subject: newSubject,
      classLevel: newClassLevel,
      pdfUrl: newUrl.trim(),
      date: new Date().toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      author: 'Coaching / Institute Faculty'
    };

    setNotesList([newItem, ...notesList]);
    setNewTitle('');
    setNewUrl('');
    setIsAddingNew(false);
    playNaturalSpeech('नया पीडीएफ नोट्स सफलतापूर्वक अपलोड कर दिया गया है!');
  };

  const handleDelete = (id: string) => {
    setNotesList(notesList.filter(n => n.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-[#091122] border-2 border-emerald-500/40 rounded-3xl p-5 sm:p-7 max-w-3xl w-full space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar text-white">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-2xl shrink-0">
              📂
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                ऑनलाइन क्लास नोट्स एवं पीडीएफ ब्रॉडकास्ट (Digital Class Notes)
              </h3>
              <p className="text-[11px] text-slate-400">
                कोचिंग टीचर सीधे यहाँ से छात्रों को स्टडी पीडीएफ और नोट्स भेज सकते हैं।
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

        {/* Action Bar for Admin/Teacher */}
        {isAdmin && (
          <div className="flex items-center justify-between bg-slate-950 p-3 rounded-2xl border border-slate-850">
            <div className="text-xs font-bold text-slate-300">
              👨‍🏫 टीचर / एडमिन पैनल: छात्रों को नए नोट्स भेजें
            </div>
            <button
              onClick={() => setIsAddingNew(!isAddingNew)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>{isAddingNew ? 'बंद करें' : 'नया पीडीएफ अपलोड करें'}</span>
            </button>
          </div>
        )}

        {/* Add Note Form */}
        {isAddingNew && isAdmin && (
          <form onSubmit={handleAddNote} className="p-4 rounded-2xl bg-[#040814] border border-emerald-500/30 space-y-3 animate-fade-in">
            <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wide">
              नया क्लास नोट्स / पीडीएफ लिंक जोड़ें
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="नोट्स का शीर्षक (उदा. जीव विज्ञान अध्याय 1 नोट्स)..."
                required
                className="w-full p-3 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white outline-none focus:border-emerald-400"
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={newSubject}
                  onChange={e => setNewSubject(e.target.value)}
                  className="p-3 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white outline-none"
                >
                  <option>Science (विज्ञान)</option>
                  <option>Mathematics (गणित)</option>
                  <option>Social Science (इतिहास/भूगोल)</option>
                  <option>English Grammar</option>
                  <option>Stenography</option>
                  <option>General Knowledge</option>
                </select>
                <select
                  value={newClassLevel}
                  onChange={e => setNewClassLevel(e.target.value)}
                  className="p-3 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white outline-none"
                >
                  <option>Class 10th</option>
                  <option>Class 12th</option>
                  <option>Competitive</option>
                  <option>General Batch</option>
                </select>
              </div>
            </div>
            <input
              type="url"
              value={newUrl}
              onChange={e => setNewUrl(e.target.value)}
              placeholder="PDF लिंक (Google Drive / Direct URL)..."
              required
              className="w-full p-3 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white outline-none focus:border-emerald-400"
            />
            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider cursor-pointer shadow-md"
              >
                छात्रों के लिए ब्रॉडकास्ट करें (Publish)
              </button>
            </div>
          </form>
        )}

        {/* Notes List */}
        <div className="space-y-3 max-h-[50vh] overflow-y-auto custom-scrollbar p-1">
          {notesList.map(note => (
            <div
              key={note.id}
              className="p-4 rounded-2xl bg-[#0B132B] border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group shadow-md"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-rose-950/60 border border-rose-500/30 flex items-center justify-center text-rose-400 text-lg shrink-0 mt-0.5">
                  📄
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-800">
                      {note.subject}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {note.classLevel}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-black text-white group-hover:text-emerald-300 transition-colors">
                    {note.title}
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    अपलोडकर्ता: <span className="text-slate-300 font-bold">{note.author}</span> • {note.date}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                <a
                  href={note.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>डाउनलोड / देखें</span>
                </a>
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-800 cursor-pointer"
                    title="डिलीट करें"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {notesList.length === 0 && (
            <div className="py-12 text-center text-slate-500 text-xs">
              कोई क्लास नोट्स उपलब्ध नहीं है।
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default TeacherNotesBroadcastView;
