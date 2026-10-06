import React, { useState } from 'react';
import { X, Globe, Search, Mic, ExternalLink, BookOpen, Sparkles, Youtube, GraduationCap } from 'lucide-react';

interface AppsLauncherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectApp: (viewId: string) => void;
}

export const AppsLauncherModal: React.FC<AppsLauncherModalProps> = ({
  isOpen,
  onClose,
  onSelectApp
}) => {
  const [searchTopic, setSearchTopic] = useState('');
  const [customUrl, setCustomUrl] = useState('');

  if (!isOpen) return null;

  const handleLaunch = (url: string) => {
    window.open(url, '_blank');
  };

  const handleSearchSubmit = (engine: 'youtube' | 'chatgpt' | 'scholar' | 'wikipedia') => {
    const query = encodeURIComponent(searchTopic.trim() || 'Hans Compain Shorthand Dictation');
    if (engine === 'youtube') handleLaunch(`https://www.youtube.com/results?search_query=${query}`);
    if (engine === 'chatgpt') handleLaunch(`https://chat.openai.com`);
    if (engine === 'scholar') handleLaunch(`https://scholar.google.com/scholar?q=${query}`);
    if (engine === 'wikipedia') handleLaunch(`https://hi.wikipedia.org/wiki/Special:Search?search=${query}`);
  };

  const handleCustomUrlOpen = () => {
    let url = customUrl.trim();
    if (!url) return;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    handleLaunch(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#091122] border-2 border-slate-800 rounded-3xl p-6 sm:p-7 max-w-xl w-full space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header matching Screenshot 7 */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-xl shrink-0">
              🌐
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white">
                App & External Resource Launcher / ऐप्स एवं वेब पोर्टल
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-400">
                Open YouTube lectures, OpenAI ChatGPT, Google Scholar, Wikipedia & NCERT books in 1 click.
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

        {/* Study Search Topic Bar */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            STUDY SEARCH TOPIC / विषय या प्रश्न
          </span>
          <div className="flex items-center gap-2 p-2 bg-[#03060E] border border-slate-800 rounded-2xl focus-within:border-cyan-500 transition-all">
            <input
              type="text"
              value={searchTopic}
              onChange={(e) => setSearchTopic(e.target.value)}
              placeholder="e.g. Pitman Shorthand dictation 80wpm, Indian Polity MCQs, Photos..."
              className="flex-1 bg-transparent border-none outline-none text-xs text-white placeholder:text-slate-500 px-1"
            />
            <button
              onClick={() => {
                if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                  const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                  const rec = new SpeechRec();
                  rec.lang = 'hi-IN';
                  rec.onresult = (e: any) => setSearchTopic(e.results[0][0].transcript);
                  rec.start();
                } else {
                  alert('वॉइस इनपुट इस ब्राउज़र में उपलब्ध नहीं है।');
                }
              }}
              className="p-1 px-2 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-slate-800"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Voice</span>
            </button>
          </div>
        </div>

        {/* 1-Click External App Launchers Grid */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            1-CLICK EXTERNAL APP LAUNCHERS
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* YouTube Search */}
            <div
              onClick={() => handleSearchSubmit('youtube')}
              className="p-3 rounded-2xl bg-[#03060E] border border-rose-900/50 hover:border-rose-500 cursor-pointer flex items-center justify-between transition-all group shadow"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">🎬</span>
                <div>
                  <h4 className="text-xs font-black text-white group-hover:text-rose-400">YouTube Search</h4>
                  <p className="text-[9px] text-slate-400">Search video lectures, dictations & tutorials</p>
                </div>
              </div>
              <button className="text-[10px] text-rose-400 font-bold flex items-center gap-1 group-hover:text-white shrink-0 pointer-events-none">
                <span>Launch →</span>
              </button>
            </div>

            {/* OpenAI ChatGPT */}
            <div
              onClick={() => handleSearchSubmit('chatgpt')}
              className="p-3 rounded-2xl bg-[#03060E] border border-emerald-900/50 hover:border-emerald-500 cursor-pointer flex items-center justify-between transition-all group shadow"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">🤖</span>
                <div>
                  <h4 className="text-xs font-black text-white group-hover:text-emerald-400">OpenAI ChatGPT</h4>
                  <p className="text-[9px] text-slate-400">Open ChatGPT AI in a fresh tab</p>
                </div>
              </div>
              <button className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 group-hover:text-white shrink-0 pointer-events-none">
                <span>Launch →</span>
              </button>
            </div>

            {/* Google Scholar */}
            <div
              onClick={() => handleSearchSubmit('scholar')}
              className="p-3 rounded-2xl bg-[#03060E] border border-blue-900/50 hover:border-blue-500 cursor-pointer flex items-center justify-between transition-all group shadow"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">🎓</span>
                <div>
                  <h4 className="text-xs font-black text-white group-hover:text-blue-400">Google Scholar</h4>
                  <p className="text-[9px] text-slate-400">Research academic research papers</p>
                </div>
              </div>
              <button className="text-[10px] text-blue-400 font-bold flex items-center gap-1 group-hover:text-white shrink-0 pointer-events-none">
                <span>Launch →</span>
              </button>
            </div>

            {/* Wikipedia Portal */}
            <div
              onClick={() => handleSearchSubmit('wikipedia')}
              className="p-3 rounded-2xl bg-[#03060E] border border-amber-900/50 hover:border-amber-500 cursor-pointer flex items-center justify-between transition-all group shadow"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">📖</span>
                <div>
                  <h4 className="text-xs font-black text-white group-hover:text-amber-400">Wikipedia Portal</h4>
                  <p className="text-[9px] text-slate-400">Instant encyclopedic facts verification</p>
                </div>
              </div>
              <button className="text-[10px] text-amber-400 font-bold flex items-center gap-1 group-hover:text-white shrink-0 pointer-events-none">
                <span>Launch →</span>
              </button>
            </div>

            {/* NCERT Official Portal */}
            <div
              onClick={() => handleLaunch('https://ncert.nic.in/textbook.php')}
              className="p-3 rounded-2xl bg-[#03060E] border border-cyan-900/50 hover:border-cyan-500 cursor-pointer flex items-center justify-between transition-all group shadow"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">📘</span>
                <div>
                  <h4 className="text-xs font-black text-white group-hover:text-cyan-400">NCERT Official Portal</h4>
                  <p className="text-[9px] text-slate-400">Official text books repository</p>
                </div>
              </div>
              <button className="text-[10px] text-cyan-400 font-bold flex items-center gap-1 group-hover:text-white shrink-0 pointer-events-none">
                <span>Open ↗</span>
              </button>
            </div>

            {/* Sarkari Result Official Portal */}
            <div
              onClick={() => handleLaunch('https://sarkariresult.com')}
              className="p-3 rounded-2xl bg-[#03060E] border border-blue-900/50 hover:border-blue-500 cursor-pointer flex items-center justify-between transition-all group shadow"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">🎖️</span>
                <div>
                  <h4 className="text-xs font-black text-white group-hover:text-blue-400">सरकारी रिजल्ट वेब पोर्टल</h4>
                  <p className="text-[9px] text-slate-400">Official Sarkari Result Portal</p>
                </div>
              </div>
              <button className="text-[10px] text-blue-400 font-bold flex items-center gap-1 group-hover:text-white shrink-0 pointer-events-none">
                <span>Open ↗</span>
              </button>
            </div>

            {/* SSC Official Portal */}
            <div
              onClick={() => handleLaunch('https://ssc.gov.in')}
              className="p-3 rounded-2xl bg-[#03060E] border border-amber-900/50 hover:border-amber-500 cursor-pointer flex items-center justify-between transition-all group shadow"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">🏛️</span>
                <div>
                  <h4 className="text-xs font-black text-white group-hover:text-amber-400">SSC Official Website (ssc.gov.in)</h4>
                  <p className="text-[9px] text-slate-400">SSC Steno & CGL Notifications</p>
                </div>
              </div>
              <button className="text-[10px] text-amber-400 font-bold flex items-center gap-1 group-hover:text-white shrink-0 pointer-events-none">
                <span>Open ↗</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bharati Bhawan Official Web Portal Link */}
        <div
          onClick={() => handleLaunch('https://bharatibhawan.in')}
          className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs text-slate-400 cursor-pointer hover:border-slate-700"
        >
          <div className="flex items-center gap-2">
            <span>🔗</span>
            <span>भारती भवन आधिकारिक वेब पोर्टल (Bharati Bhawan Portal)</span>
          </div>
          <span className="text-[10px] text-cyan-400 font-bold">वेबसाइट ↗</span>
        </div>

        {/* Custom URL Launcher */}
        <div className="space-y-1.5 pt-1 border-t border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            OPEN ANY CUSTOM WEB APP / URL
          </span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="https://example.com"
              className="flex-1 p-2.5 bg-[#03060E] border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
            />
            <button
              onClick={handleCustomUrlOpen}
              className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow shrink-0"
            >
              <span>Open</span>
              <span>🚀</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
