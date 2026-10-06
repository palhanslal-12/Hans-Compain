import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  ArrowLeft, 
  Bell, 
  Plus, 
  Sparkles, 
  Cpu, 
  Mic2, 
  Newspaper, 
  FileText, 
  Swords, 
  Mic, 
  Camera, 
  Paperclip, 
  User,
  Settings,
  ShieldCheck,
  BookOpen,
  BrainCircuit,
  FlaskConical,
  Trophy,
  BarChart3,
  Star,
  Send,
  Target,
  GraduationCap,
  MessageSquare,
  Home,
  Search,
  Calendar,
  Globe,
  Clock,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { HansCompainLogo } from './components/HansCompainLogo';
import { DedicatedStenoMasterStudio } from './components/DedicatedStenoMasterStudio';
import { CurrentAffairsHubView } from './components/CurrentAffairsHubView';
import { MockTestsView } from './components/MockTestsView';
import { AIDoubtSolverView } from './components/AIDoubtSolverView';
import { MnemonicsTrickGeneratorView } from './components/MnemonicsTrickGeneratorView';
import { ScienceFormulaLabView } from './components/ScienceFormulaLabView';
import { TimeTravelSimulatorView } from './components/TimeTravelSimulatorView';
import { LiveGroupQuizStudio } from './components/LiveGroupQuizStudio';
import { BoardExamSingleTestBox } from './components/BoardExamSingleTestBox';
import { DailyGoalsView } from './components/DailyGoalsView';
import { AdminPanel } from './components/AdminPanel';
import { StudentGoalOnboardingModal } from './components/StudentGoalOnboardingModal';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { UserProfileModal } from './components/UserProfileModal';
import { AllExamsSyllabusModal } from './components/AllExamsSyllabusModal';
import { MockInterviewView } from './components/MockInterviewView';
import { AdminAnalyticsDashboard } from './components/AdminAnalyticsDashboard';
import { SettingsModal } from './components/SettingsModal';
import { AppsLauncherModal } from './components/AppsLauncherModal';
import { CompetitiveExamsHubModal } from './components/CompetitiveExamsHubModal';
import { BharatiBhawanStudyHub } from './components/BharatiBhawanStudyHub';
import { UnlimitedPyqVaultView } from './components/UnlimitedPyqVaultView';
import { SarkariResultEligibilityHub } from './components/SarkariResultEligibilityHub';
import { FlashcardsView } from './components/FlashcardsView';
import { EduReelsView } from './components/EduReelsView';
import { GlobalBookReader } from './components/GlobalBookReader';
import { InteractivePeriodicTable } from './components/InteractivePeriodicTable';
import { MusicStudioView } from './components/MusicStudioView';
import { WeatherAlertView } from './components/WeatherAlertView';
import { PeerChallengeArena } from './components/PeerChallengeArena';
import { NeuralMemoryMapView } from './components/NeuralMemoryMapView';
import { StudyPlanView } from './components/StudyPlanView';
import { AffiliateStoreView } from './components/AffiliateStoreView';
import { auth, signInWithGoogle, logoutUser } from './firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

export const App: React.FC = () => {
  // Navigation State: 'home' is the default dashboard screen
  const [activeView, setActiveView] = useState<string>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [language, setLanguage] = useState<'hindi' | 'english'>('hindi');
  const [targetExam, setTargetExam] = useState('SSC & Steno 2026');
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [okHansActive, setOkHansActive] = useState<boolean>(false);
  const [sidebarSearch, setSidebarSearch] = useState<string>('');
  const [statusBanner, setStatusBanner] = useState<string | null>(null);
  const [isListeningMic, setIsListeningMic] = useState<boolean>(false);

  // Modals state
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState(false);
  const [isAllExamsSyllabusOpen, setIsAllExamsSyllabusOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAppsLauncherOpen, setIsAppsLauncherOpen] = useState(false);
  const [isCompetitiveHubOpen, setIsCompetitiveHubOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);

  // Home chat input bar state
  const [homeInput, setHomeInput] = useState('');
  const [submittedHomeQuery, setSubmittedHomeQuery] = useState('');

  // Chat history state in sidebar
  const [chatHistory, setChatHistory] = useState<{ id: number; query: string }[]>([]);

  // Initial direct article & view routing from URL params
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const articleParam = params.get('article') || params.get('articleId');
      const viewParam = params.get('view');
      const hash = window.location.hash;

      if (articleParam || (hash && hash.includes('article='))) {
        setActiveView('current-affairs');
      } else if (viewParam) {
        setActiveView(viewParam);
      }

      const handlePopState = () => {
        const currentParams = new URLSearchParams(window.location.search);
        const art = currentParams.get('article') || currentParams.get('articleId');
        const vw = currentParams.get('view');
        if (art) {
          setActiveView('current-affairs');
        } else if (vw) {
          setActiveView(vw);
        }
      };

      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('hans_chat_history') || '[]');
      if (Array.isArray(saved) && saved.length > 0) {
        setChatHistory(saved);
      }
    } catch {
      // ignore
    }
  }, [activeView]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setCurrentUser(u);
      fetch('/api/user/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: u?.uid || 'hans_user',
          email: u?.email || 'student@hanscompain.in',
          displayName: u?.displayName || 'Hans Student',
          lastTopic: 'App Active'
        })
      }).catch(() => {});
    });
    return () => unsub();
  }, []);

  const showToast = (msg: string) => {
    setStatusBanner(msg);
    setTimeout(() => {
      setStatusBanner(prev => (prev === msg ? null : prev));
    }, 3500);
  };

  // Explicit Chat submit from Home bottom input bar
  const handleHomeChatSubmit = (customQuery?: string) => {
    const q = (customQuery !== undefined ? customQuery : homeInput).trim();
    if (!q) return;
    setSubmittedHomeQuery(q);
    setHomeInput('');
    setActiveView('ai-chat');
  };

  // Voice Dictation into Home Input Bar (Does NOT jump to chat screen automatically)
  const handleVoiceMicInput = () => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      showToast('🎙️ माइक तैयार है: कृपया अपना प्रश्न बोलें या टाइप करके Send दबाएं।');
      return;
    }
    try {
      const recognition = new SpeechRec();
      recognition.lang = 'hi-IN';
      recognition.interimResults = false;
      setIsListeningMic(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript || '';
        if (transcript) {
          setHomeInput(prev => (prev ? `${prev} ${transcript}` : transcript));
        }
        setIsListeningMic(false);
      };
      recognition.onerror = () => setIsListeningMic(false);
      recognition.onend = () => setIsListeningMic(false);
      recognition.start();
    } catch {
      setIsListeningMic(false);
    }
  };

  const toggleOkHansVoice = () => {
    const next = !okHansActive;
    setOkHansActive(next);
    if (next && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance('ओके हंस वॉयस कमांड सक्रिय है।');
      utter.lang = 'hi-IN';
      window.speechSynthesis.speak(utter);
    }
    showToast(next ? '✨ "ओके हंस" वॉयस असिस्टेंट सक्रिय (ON) हो गया है!' : '"ओके हंस" वॉयस मोड ऑफ़ (OFF) किया गया।');
  };

  const navigateTo = (viewId: string) => {
    setActiveView(viewId);
    setSidebarOpen(false);
  };

  const sidebarMenuItems = [
    { icon: Home, label: 'होम / मुख्य डैशबोर्ड', viewId: 'home' },
    { icon: Sparkles, label: 'एजु-रील्स (Edu Shorts)', viewId: 'edu-reels', badge: 'SHORTS' },
    { icon: BookOpen, label: 'स्मार्ट लाइब्रेरी व वाइस रीडर 📖', viewId: 'book-reader', badge: 'BOOKS' },
    { icon: Calendar, label: 'स्मार्ट स्टडी प्लानर', viewId: 'study-plan', badge: 'PLAN' },
    { icon: BrainCircuit, label: 'AI न्यूरल मेमोरी मैप', viewId: 'neural-map' },
    { icon: Zap, label: '1-मिनट रीकैप & फ्लैशकार्ड्स', viewId: 'flashcards', badge: 'QUICK' },
    { icon: Camera, label: 'हस्तलिखित नोट्स फोटो स्कैनर 📷', viewId: 'ocr-scan', badge: 'OCR' },
    { icon: MessageSquare, label: 'ऐप इंस्ट्रक्शन व गाइड असिस्टेंट 🧭', viewId: 'app-guide', badge: 'GUIDE' }
  ];

  const filteredMenuItems = sidebarMenuItems.filter(item =>
    item.label.toLowerCase().includes(sidebarSearch.toLowerCase())
  );

  const NavItem = ({ icon: Icon, label, viewId, badge }: { icon: any; label: string; viewId: string; badge?: string }) => {
    const isActive = activeView === viewId;
    return (
      <button
        onClick={() => navigateTo(viewId)}
        className={`w-full flex items-center justify-between p-2.5 rounded-xl border select-none transition-all duration-200 cursor-pointer ${
          isActive 
            ? 'bg-blue-600/20 border-blue-500/60 text-blue-200 shadow-md font-bold'
            : 'bg-[#091122]/60 text-slate-300 border-slate-900/60 hover:bg-[#0D1830] hover:border-slate-800'
        }`}
      >
        <div className="flex items-center gap-2.5 text-left min-w-0">
          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
          <span className="text-xs truncate">{label}</span>
        </div>
        {badge && (
          <span className="text-[9px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-black uppercase shrink-0">{badge}</span>
        )}
      </button>
    );
  };

  return (
    <div className="min-h-[100dvh] h-[100dvh] max-h-[100dvh] w-full max-w-full overflow-hidden flex flex-col bg-[#03060E] text-white font-sans">
      
      {/* 1. TOP HEADER (EXACT SCREENSHOT STYLE) */}
      <header className="px-3 sm:px-4 h-14 sm:h-16 border-b border-slate-900 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md bg-[#03060E]/95 w-full">
        <div className="flex items-center gap-2 sm:gap-3 shrink min-w-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 bg-[#091122] hover:bg-[#101B34] border border-indigo-500/30 text-indigo-300 hover:text-white rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center shrink-0"
            title="Open 3-Line Menu"
          >
            <Menu className="w-5 h-5 text-cyan-400" />
          </button>

          {activeView !== 'home' && (
            <button
              onClick={() => navigateTo('home')}
              className="p-1.5 px-2 bg-[#091122] hover:bg-[#101B34] border border-cyan-500/30 text-cyan-300 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-md shrink-0"
              title="Return to Home Dashboard"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-400" />
            </button>
          )}

          <div onClick={() => navigateTo('home')} className="flex items-center gap-2 cursor-pointer select-none">
            <HansCompainLogo className="w-7 h-7 sm:w-8 sm:h-8" />
            <span className="font-black text-sm sm:text-base tracking-tight text-white hidden xs:inline">
              HANS COMPAIN
            </span>
          </div>
        </div>

        {/* Header Right Icons Capsule matching Screenshot 1 */}
        <div className="flex items-center gap-2 shrink-0">
          {activeView !== 'home' && (
            <button
              onClick={() => navigateTo('home')}
              className="px-2.5 py-1 rounded-xl bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <span>🌐 Home</span>
            </button>
          )}

          <div className="flex items-center bg-[#070D1D] border border-slate-800 rounded-full p-1 pl-2 gap-1.5 shadow-md">
            <button
              onClick={toggleOkHansVoice}
              className={`px-2 py-0.5 rounded-full border text-[10px] sm:text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                okHansActive
                  ? 'bg-emerald-950 border-emerald-500/60 text-emerald-300'
                  : 'bg-slate-900 border-slate-700/80 text-slate-300 hover:text-white'
              }`}
            >
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>{okHansActive ? '"ओके हंस" ऑन' : '"ओके हंस" ऑफ़'}</span>
            </button>

            <button
              onClick={() => navigateTo('app-guide')}
              className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700/80 text-[10px] sm:text-[11px] font-bold text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer transition-all"
              title="Open App Feature Map & Guide Hub"
            >
              <Mic className="w-3 h-3 text-indigo-400" />
              <span>Hey Compain</span>
            </button>

            <button
              onClick={() => setIsNotificationCenterOpen(true)}
              className="relative p-1 px-1.5 rounded-full bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-white cursor-pointer transition-all"
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-600 text-white text-[8px] font-black rounded-full flex items-center justify-center border border-[#070D1D] animate-pulse">
                3
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Non-intrusive In-App Status Banner */}
      {statusBanner && (
        <div className="bg-emerald-950/90 border-b border-emerald-500/40 px-4 py-2 text-center text-xs font-bold text-emerald-200 flex items-center justify-center gap-2 z-50 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{statusBanner}</span>
        </div>
      )}

      <div className="flex-1 min-h-0 flex overflow-hidden w-full relative">
        
        {/* 2. SIDE-DRAWER / 3-LINE MENU (EXACT SCREENSHOT 3 & 4 MATCH) */}
        <div className={`w-72 sm:w-80 border-r border-slate-850/80 bg-[#060913] flex flex-col justify-between flex-shrink-0 transition-all duration-300 z-30 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } fixed lg:relative inset-y-0 left-0 top-0 h-full shadow-2xl lg:shadow-none`}>
          
          <div className="p-3.5 space-y-2.5 border-b border-slate-850/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HansCompainLogo className="w-7 h-7" />
                <span className="font-black text-sm text-white">HANS COMPAIN</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Action Buttons: Dedicated New Chat, Settings, Rules */}
            <button
              onClick={() => {
                setSubmittedHomeQuery('');
                navigateTo('ai-chat');
              }}
              className="w-full py-2 px-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl text-xs font-black flex items-center justify-between shadow-md cursor-pointer transition-all"
            >
              <div className="flex items-center gap-1.5">
                <span>➕</span>
                <span>नया चैट शुरू करें</span>
              </div>
              <span className="text-[9px] bg-white/20 px-1.5 py-0.2 rounded font-mono">ChatGPT-Style</span>
            </button>

            <button
              onClick={() => { setIsSettingsModalOpen(true); setSidebarOpen(false); }}
              className="w-full py-1.5 px-3 bg-[#091122] hover:bg-[#101B34] border border-cyan-500/30 text-cyan-300 rounded-xl text-xs font-bold flex items-center justify-between cursor-pointer transition-all"
            >
              <div className="flex items-center gap-1.5">
                <span>⚙️</span>
                <span>ऐप सेटिंग्स व क्लास/बोर्ड बदलें</span>
              </div>
              <span>⚙️</span>
            </button>

            <button
              onClick={() => { setIsRulesModalOpen(true); setSidebarOpen(false); }}
              className="w-full py-1.5 px-3 bg-[#091122] hover:bg-[#101B34] border border-amber-500/30 text-amber-300 rounded-xl text-xs font-bold flex items-center justify-between cursor-pointer transition-all"
            >
              <div className="flex items-center gap-1.5">
                <span>⚖️</span>
                <span>पब्लिक एआई नियम व गाइडलाइन्स</span>
              </div>
              <span className="text-[8px] bg-amber-500/20 px-1.5 py-0.2 rounded font-black">RULES</span>
            </button>

            {/* Interactive Sidebar Search Input */}
            <div className="flex items-center gap-2 p-1.5 bg-[#03060E] border border-slate-800 rounded-xl text-xs text-slate-400">
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                value={sidebarSearch}
                onChange={(e) => setSidebarSearch(e.target.value)}
                placeholder="चैट्स एवं विषय खोजें..."
                className="bg-transparent border-none outline-none text-white text-xs w-full placeholder:text-slate-600"
              />
              {sidebarSearch && (
                <button onClick={() => setSidebarSearch('')} className="text-[10px] text-slate-400 hover:text-white cursor-pointer">
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Navigation Links matching Screenshot 3 & 4 */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-widest px-1">
                🚀 मुख्य स्टडी टूल्स व फीचर्स
              </span>
              {filteredMenuItems.map(item => (
                <NavItem
                  key={item.viewId}
                  icon={item.icon}
                  label={item.label}
                  viewId={item.viewId}
                  badge={item.badge}
                />
              ))}
            </div>

            {/* Stateful Chat History matching Screenshot 3 */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold px-1">
                <span>🕒 चैट इतिहास</span>
                <div className="flex items-center gap-1.5 text-cyan-400">
                  <span onClick={() => navigateTo('ai-chat')} className="hover:underline cursor-pointer">पूरा देखें ↗</span>
                  <span className="bg-slate-800 px-1 rounded text-white">{chatHistory.length}</span>
                  <span
                    onClick={() => {
                      setChatHistory([]);
                      localStorage.removeItem('hans_chat_history');
                      showToast('चैट इतिहास साफ़ कर दिया गया है।');
                    }}
                    className="hover:underline cursor-pointer text-slate-500"
                  >
                    Clear
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                {chatHistory.slice(0, 3).map(item => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSubmittedHomeQuery(item.query);
                      navigateTo('ai-chat');
                    }}
                    className="p-1.5 px-2 rounded-xl bg-slate-950/60 border border-slate-850 hover:border-slate-700 text-xs text-slate-300 cursor-pointer flex items-center gap-2 truncate"
                  >
                    <span>💬</span>
                    <span className="truncate">{item.query}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Links matching Screenshot 3 & 4 */}
            <div className="space-y-1 pt-2 border-t border-slate-800 text-xs">
              <div className="grid grid-cols-2 gap-1.5">
                <button 
                  onClick={() => showToast('📲 HANS COMPAIN वेब-ऐप (PWA/APK) आपके डिवाइस के लिए तैयार है!')}
                  className="p-1.5 rounded-xl bg-slate-950 border border-slate-850 hover:border-emerald-500/50 flex items-center justify-between text-[10px] font-bold text-emerald-300 cursor-pointer"
                >
                  <span>📲 APK इंस्टॉल</span>
                  <span className="text-[8px] bg-emerald-500/20 px-1 rounded">OFFICIAL</span>
                </button>
                <button 
                  onClick={() => {
                    const waUrl = localStorage.getItem('hans_whatsapp_group_url') || 'https://chat.whatsapp.com/HansCompainOfficial';
                    window.open(waUrl, '_blank');
                  }}
                  className="p-1.5 rounded-xl bg-slate-950 border border-slate-850 hover:border-emerald-500/50 flex items-center gap-1.5 text-[10px] font-bold text-slate-300 cursor-pointer"
                >
                  <span>💬</span>
                  <span>व्हाट्सएप ग्रुप</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                <button 
                  onClick={() => window.open('https://youtube.com', '_blank')}
                  className="p-1.5 rounded-xl bg-slate-950 border border-slate-850 hover:border-rose-500/50 flex items-center gap-1.5 text-[10px] font-bold text-rose-400 cursor-pointer"
                >
                  <span>📺</span>
                  <span>यूट्यूब चैनल</span>
                </button>
                <button 
                  onClick={() => {
                    const shareUrl = 'https://hans-compain.onrender.com/';
                    navigator.clipboard?.writeText(shareUrl);
                    showToast('🤝 मूल ऐप शेयर लिंक (https://hans-compain.onrender.com/) कॉपी हो गया! (+50 Coins)');
                  }}
                  className="p-1.5 rounded-xl bg-slate-950 border border-slate-850 hover:border-amber-500/50 flex items-center gap-1.5 text-[10px] font-bold text-amber-300 cursor-pointer"
                >
                  <span>🤝</span>
                  <span>मूल शेयर लिंक (+50 Coins)</span>
                </button>
              </div>

              <button 
                onClick={() => navigateTo('admin')}
                className="w-full p-2 rounded-xl bg-slate-950 border border-amber-500/30 hover:border-amber-400 flex items-center justify-between text-xs font-bold text-amber-300 cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Owner Admin Console</span>
                </div>
                <span className="text-[8px] bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded font-black">Admin</span>
              </button>
            </div>
          </div>

          <div className="p-3 border-t border-slate-850/80 bg-[#04070F] flex items-center justify-between text-xs text-slate-400">
            <div
              onClick={() => setIsUserProfileModalOpen(true)}
              className="flex items-center gap-2 min-w-0 cursor-pointer hover:text-cyan-300 transition-colors"
              title="छात्र प्रोफाइल कार्ड खोलें"
            >
              <div className="w-3.5 h-3.5 bg-emerald-500 rounded-full animate-pulse shrink-0"></div>
              <span className="font-extrabold text-white text-[11px] truncate">
                {currentUser ? currentUser.displayName || currentUser.email : 'HANS COMPAIN Core'}
              </span>
            </div>
            {currentUser ? (
              <button
                onClick={() => logoutUser()}
                className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-bold text-rose-400 hover:text-white cursor-pointer shrink-0"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => signInWithGoogle(targetExam).catch(() => {})}
                className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-[10px] font-black text-white cursor-pointer shrink-0"
                title="Register for 24h Auto-Email Study Alerts & Cloud Sync"
              >
                Google लॉगिन
              </button>
            )}
          </div>
        </div>

        {sidebarOpen && (
          <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-20 lg:hidden transition-opacity" />
        )}

        {/* 3. MAIN ROUTED VIEW AREA */}
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#03060E] relative">
          <div className={`flex-1 ${activeView === 'home' ? 'overflow-hidden flex flex-col justify-between p-2 sm:p-3.5' : 'overflow-y-auto px-4 py-4 sm:px-6 sm:py-6'} scrollbar-thin`}>
            
            {/* --- HOME VIEW (DASHBOARD - LOCKED SINGLE-PAGE VIEWPORT) --- */}
            {activeView === 'home' && (
              <div className="max-w-2xl mx-auto w-full h-full flex flex-col justify-between items-center text-center space-y-1.5 sm:space-y-2.5 animate-fade-in overflow-hidden">
                
                {/* Center Official 3D Mascot Logo */}
                <HansCompainLogo variant="center" />

                {/* Main Headline */}
                <h1 className="text-xs sm:text-xs md:text-sm font-extrabold tracking-tight text-slate-200 leading-snug flex items-center justify-center gap-1.5 bg-[#091122]/80 border border-slate-800/80 px-3 py-1 rounded-full shadow-sm">
                  <span className="text-cyan-400 font-black tracking-wider">HANS COMPAIN</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-300">How can I help with Shorthand &amp; Exams today?</span>
                </h1>

                {/* Blue Pill Capsule: ALL STENOGRAPHER BANNER */}
                <div 
                  onClick={() => navigateTo('steno-master')}
                  className="w-full bg-[#0066CC] hover:bg-[#0055B3] px-3.5 py-2 sm:py-2.5 rounded-full shadow-lg border border-blue-400/40 flex items-center justify-between cursor-pointer transition-all hover:scale-101 group"
                >
                  <div className="flex items-center gap-2 text-left">
                    <span className="text-base sm:text-lg">✍️</span>
                    <span className="text-[11px] sm:text-xs font-black text-white tracking-wide uppercase">
                      ALL STENOGRAPHER • सम्पूर्ण आशुलिपि
                    </span>
                  </div>
                  <button className="px-3 py-1 bg-[#4D94FF] text-white font-black text-[10px] sm:text-xs rounded-full shadow group-hover:bg-[#66A3FF] transition-colors pointer-events-none">
                    OPEN
                  </button>
                </div>

                {/* 2-Column Grid (8 Feature Cards) */}
                <div className="grid grid-cols-2 gap-1.5 sm:gap-2.5 w-full text-left">
                  
                  {/* Row 1, Col 1: करेंट अफेयर्स 2026 */}
                  <div 
                    onClick={() => navigateTo('ca')}
                    className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-[#091122] border border-indigo-900/60 hover:border-indigo-500/80 cursor-pointer transition-all hover:bg-[#0D1830] flex items-center gap-2 group shadow-md"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-900/40 border border-purple-500/40 flex items-center justify-center shrink-0 text-base">
                      📰
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-white text-[11px] sm:text-xs truncate">करंट अफेयर्स 2026</div>
                      <div className="text-[9px] sm:text-[10px] text-slate-400 truncate">डेली 10 फैक्ट्स व क्विज़</div>
                    </div>
                  </div>

                  {/* Row 1, Col 2: लाइव ग्रुप क्विज़ बैटल */}
                  <div 
                    onClick={() => navigateTo('group-quiz')}
                    className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-[#091122] border border-emerald-900/60 hover:border-emerald-500/80 cursor-pointer transition-all hover:bg-[#0D1830] flex items-center gap-2 group shadow-md"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-900/40 border border-emerald-500/40 flex items-center justify-center shrink-0 text-base">
                      ⚔️
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-emerald-400 text-[11px] sm:text-xs truncate">ग्रुप क्विज़ बैटल (10-50 छात्र)</div>
                      <div className="text-[9px] sm:text-[10px] text-slate-400 truncate">AI व बोलकर प्रश्न बनाएं</div>
                    </div>
                  </div>

                  {/* Row 2, Col 1: AI निमोनिक्स */}
                  <div 
                    onClick={() => navigateTo('mnemonics')}
                    className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-[#091122] border border-amber-900/60 hover:border-amber-500/80 cursor-pointer transition-all hover:bg-[#0D1830] flex items-center gap-2 group shadow-md"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-900/40 border border-amber-500/40 flex items-center justify-center shrink-0 text-base">
                      💡
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-amber-400 text-[11px] sm:text-xs truncate">AI निमोनिक्स</div>
                      <div className="text-[9px] sm:text-[10px] text-slate-400 truncate">तारीखें व कविताएं</div>
                    </div>
                  </div>

                  {/* Row 2, Col 2: साइंस लैब */}
                  <div 
                    onClick={() => navigateTo('science-lab')}
                    className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-[#091122] border border-cyan-900/60 hover:border-cyan-500/80 cursor-pointer transition-all hover:bg-[#0D1830] flex items-center gap-2 group shadow-md"
                  >
                    <div className="w-8 h-8 rounded-lg bg-cyan-900/40 border border-cyan-500/40 flex items-center justify-center shrink-0 text-base">
                      🔬
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-cyan-400 text-[11px] sm:text-xs truncate">साइंस लैब</div>
                      <div className="text-[9px] sm:text-[10px] text-slate-400 truncate">सर्किट, लेंस व पीरियोडिक</div>
                    </div>
                  </div>

                  {/* Row 3, Col 1: दैनिक लक्ष्य */}
                  <div 
                    onClick={() => navigateTo('daily-goals')}
                    className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-[#091122] border border-blue-900/60 hover:border-blue-500/80 cursor-pointer transition-all hover:bg-[#0D1830] flex items-center gap-2 group shadow-md"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-900/40 border border-blue-500/40 flex items-center justify-center shrink-0 text-base">
                      🎯
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-white text-[11px] sm:text-xs truncate">दैनिक लक्ष्य</div>
                      <div className="text-[9px] sm:text-[10px] text-slate-400 truncate">GK, English &amp; Math</div>
                    </div>
                  </div>

                  {/* Row 3, Col 2: प्रतियोगी परीक्षा */}
                  <div 
                    onClick={() => setIsCompetitiveHubOpen(true)}
                    className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-[#091122] border border-emerald-900/60 hover:border-emerald-500/80 cursor-pointer transition-all hover:bg-[#0D1830] flex items-center gap-2 group shadow-md"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-900/40 border border-emerald-500/40 flex items-center justify-center shrink-0 text-base">
                      📝
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-emerald-400 text-[11px] sm:text-xs truncate">प्रतियोगी परीक्षा</span>
                        <span className="bg-emerald-500 text-slate-950 font-black text-[8px] px-1 py-0.2 rounded">PYQ</span>
                      </div>
                      <div className="text-[9px] sm:text-[10px] text-slate-400 truncate">TCS iON टेस्ट व PYQ बैंक</div>
                    </div>
                  </div>

                  {/* Row 4, Col 1: काल-यात्रा */}
                  <div 
                    onClick={() => navigateTo('time-travel')}
                    className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-[#091122] border border-purple-900/60 hover:border-purple-500/80 cursor-pointer transition-all hover:bg-[#0D1830] flex items-center gap-2 group shadow-md"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-900/40 border border-purple-500/40 flex items-center justify-center shrink-0 text-base">
                      ⏳
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-purple-300 text-[11px] sm:text-xs truncate">काल-यात्रा</div>
                      <div className="text-[9px] sm:text-[10px] text-slate-400 truncate">भगत सिंह व आंबेडकर</div>
                    </div>
                  </div>

                  {/* Row 4, Col 2: बोर्ड परीक्षा */}
                  <div 
                    onClick={() => navigateTo('board-exam')}
                    className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-[#091122] border border-amber-900/60 hover:border-amber-500/80 cursor-pointer transition-all hover:bg-[#0D1830] flex items-center gap-2 group shadow-md"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-900/40 border border-amber-500/40 flex items-center justify-center shrink-0 text-base">
                      🎓
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-amber-300 text-[11px] sm:text-xs truncate">बोर्ड परीक्षा</span>
                        <span className="bg-amber-500 text-slate-950 font-black text-[8px] px-1 py-0.2 rounded">10th&amp;12th</span>
                      </div>
                      <div className="text-[9px] sm:text-[10px] text-slate-400 truncate">चैप्टर व विषय-वार टेस्ट</div>
                    </div>
                  </div>
                </div>

                {/* 4 Quick-Action Tiles */}
                <div className="grid grid-cols-4 gap-1.5 sm:gap-2.5 w-full">
                  
                  {/* Syllabus */}
                  <div 
                    onClick={() => setIsAllExamsSyllabusOpen(true)}
                    className="p-1.5 sm:p-2 rounded-xl bg-[#091122] border border-slate-800/80 hover:border-indigo-500/60 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-[#0D1830] transition-all group"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-rose-950/60 border border-rose-500/30 flex items-center justify-center text-rose-400 text-sm">
                      📚
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-bold text-slate-300 group-hover:text-white">Syllabus</span>
                  </div>

                  {/* Apps */}
                  <div 
                    onClick={() => setIsAppsLauncherOpen(true)}
                    className="p-1.5 sm:p-2 rounded-xl bg-[#091122] border border-slate-800/80 hover:border-cyan-500/60 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-[#0D1830] transition-all group"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-sm">
                      🌐
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-bold text-slate-300 group-hover:text-white">Apps</span>
                  </div>

                  {/* Interview */}
                  <div 
                    onClick={() => navigateTo('mock-interview')}
                    className="p-1.5 sm:p-2 rounded-xl bg-[#091122] border border-slate-800/80 hover:border-indigo-500/60 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-[#0D1830] transition-all group"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-sm">
                      🎙️
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-bold text-slate-300 group-hover:text-white">Interview</span>
                  </div>

                  {/* Analytics */}
                  <div 
                    onClick={() => navigateTo('analytics')}
                    className="p-1.5 sm:p-2 rounded-xl bg-[#091122] border border-slate-800/80 hover:border-emerald-500/60 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-[#0D1830] transition-all group"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-sm">
                      📊
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-bold text-slate-300 group-hover:text-white">Analytics</span>
                  </div>
                </div>

              </div>
            )}

            {/* --- DEDICATED FEATURE VIEWS (ROUTED CLEANLY TO EACH DEDICATED UI) --- */}
            {activeView !== 'home' && (
              <div className="max-w-4xl mx-auto mb-3 flex items-center justify-between bg-slate-900/60 p-2.5 px-4 rounded-2xl border border-slate-800">
                <button
                  onClick={() => setActiveView('home')}
                  className="text-xs font-bold text-cyan-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>← मुख्य होमपेज पर लौटें (Return to Home)</span>
                </button>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest hidden sm:inline">
                  Hans Compain Engine Active Work Page
                </span>
              </div>
            )}

            {(activeView === 'steno-master' || activeView === 'steno') && <DedicatedStenoMasterStudio />}
            {(activeView === 'ca' || activeView === 'current-affairs') && (
              <CurrentAffairsHubView
                currentUser={currentUser}
                onLoginRequired={() => signInWithGoogle(targetExam)}
                onReturnHome={() => setActiveView('home')}
              />
            )}
            {(activeView === 'mock' || activeView === 'competitive') && <MockTestsView />}
            {(activeView === 'board-exam' || activeView === 'board') && <BoardExamSingleTestBox />}
            {(activeView === 'group-quiz' || activeView === 'battle' || activeView === 'quiz-battle' || activeView === 'battle-quiz' || activeView === 'group-battle') && <LiveGroupQuizStudio />}
            {activeView === 'science-lab' && <ScienceFormulaLabView />}
            {activeView === 'mnemonics' && <MnemonicsTrickGeneratorView />}
            {(activeView === 'daily-goals' || activeView === 'goals') && <DailyGoalsView />}
            {activeView === 'time-travel' && <TimeTravelSimulatorView />}

            {/* Direct AI Chat ONLY when explicitly requested */}
            {(activeView === 'ai-chat' || activeView === 'chat' || activeView === 'doubt' || activeView === 'photo-doubt') && (
              <AIDoubtSolverView initialMode="chat" initialQuery={submittedHomeQuery} onNavigate={navigateTo} />
            )}

            {/* Dedicated 3-Step Handwritten Notes OCR Scanner Studio */}
            {activeView === 'ocr-scan' && (
              <AIDoubtSolverView initialMode="ocr" onNavigate={navigateTo} />
            )}

            {/* Dedicated 3-Step App Feature Map & Guide Hub */}
            {activeView === 'app-guide' && (
              <AIDoubtSolverView initialMode="app-guide" onNavigate={navigateTo} />
            )}

            {activeView === 'mock-interview' && <MockInterviewView />}
            {(activeView === 'analytics' || activeView === 'performance-analytics') && <AdminAnalyticsDashboard />}
            {activeView === 'admin' && <AdminPanel />}

            {/* FULL MODULE WORK PAGES FROM ZIP & RENDER PROJECT */}
            {(activeView === 'bharati-bhawan' || activeView === 'bharti-bhawan' || activeView === 'bharatibhawan') && <BharatiBhawanStudyHub />}
            {(activeView === 'pyq' || activeView === 'pyq-vault') && <UnlimitedPyqVaultView />}
            {(activeView === 'sarkari' || activeView === 'sarkari-result') && <SarkariResultEligibilityHub />}
            {activeView === 'flashcards' && <FlashcardsView />}
            {activeView === 'edu-reels' && <EduReelsView />}
            {(activeView === 'book-reader' || activeView === 'global-reader') && <GlobalBookReader initialTab="library" />}
            {activeView === 'voice-reader' && <GlobalBookReader initialTab="voice-reader" />}
            {(activeView === 'periodic' || activeView === 'periodic-table') && <InteractivePeriodicTable />}
            {(activeView === 'music' || activeView === 'music-studio') && <MusicStudioView />}
            {(activeView === 'weather' || activeView === 'weather-alerts') && <WeatherAlertView />}
            {activeView === 'peer-challenge' && <PeerChallengeArena />}
            {activeView === 'neural-map' && <NeuralMemoryMapView />}
            {activeView === 'study-plan' && <StudyPlanView />}
            {(activeView === 'store' || activeView === 'affiliate-store' || activeView === 'affiliate') && <AffiliateStoreView />}

          </div>
          
          {/* 4. BOTTOM INPUT BAR (ONLY ON HOME DASHBOARD) */}
          {activeView === 'home' && (
            <div className="p-3 sm:p-4 border-t border-slate-900 bg-[#03060E] z-10 shrink-0">
              <div className="max-w-2xl mx-auto flex flex-col gap-1.5">
                <div className="flex items-center gap-2 bg-[#091122] border border-slate-800 rounded-3xl p-2 px-3 shadow-lg focus-within:border-cyan-500/80 transition-all">
                  <button 
                    onClick={() => navigateTo('ocr-scan')}
                    className="p-1.5 text-slate-400 hover:text-white cursor-pointer" 
                    title="नोट्स / डॉक्यूमेंट स्कैनर खोलें"
                  >
                    <Paperclip className="w-5 h-5 text-slate-400" />
                  </button>
                  <button 
                    onClick={() => navigateTo('ocr-scan')}
                    className="p-1.5 text-slate-400 hover:text-white cursor-pointer" 
                    title="Camera OCR (हस्तलिखित नोट्स फोटो स्कैनर)"
                  >
                    <Camera className="w-5 h-5 text-cyan-400" />
                  </button>
                  <input 
                    type="text" 
                    value={homeInput}
                    onChange={(e) => setHomeInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleHomeChatSubmit()}
                    placeholder="हंस कॉम्पैन (HANS COMPAIN) से कुछ भी पूछें..." 
                    className="flex-1 bg-transparent border-none outline-none text-white py-1.5 px-2 text-xs sm:text-sm placeholder:text-slate-500"
                  />
                  <button 
                    onClick={handleVoiceMicInput}
                    className={`p-1.5 rounded-full cursor-pointer transition-all ${
                      isListeningMic ? 'bg-rose-600 text-white animate-pulse' : 'text-slate-400 hover:text-white'
                    }`}
                    title="वॉयस इनपुट (बोलकर लिखें)"
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleHomeChatSubmit()}
                    className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center cursor-pointer shadow-md transition-all shrink-0"
                    title="Send Question to AI Tutor"
                  >
                    <Send className="w-4 h-4 ml-0.5" />
                  </button>
                </div>
                <div className="text-center text-[10px] text-slate-500">
                  HANS COMPAIN can make mistakes. Verify important academic facts &amp; formulas.
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ALL MODALS */}
      <StudentGoalOnboardingModal
        isOpen={isOnboardingModalOpen}
        onClose={() => setIsOnboardingModalOpen(false)}
        selectedGoal={targetExam}
        onSelectGoal={(g) => setTargetExam(g)}
      />
      <NotificationCenterModal isOpen={isNotificationCenterOpen} onClose={() => setIsNotificationCenterOpen(false)} />
      <UserProfileModal isOpen={isUserProfileModalOpen} onClose={() => setIsUserProfileModalOpen(false)} />
      <AllExamsSyllabusModal
        isOpen={isAllExamsSyllabusOpen}
        onClose={() => setIsAllExamsSyllabusOpen(false)}
        onNavigate={(viewId) => navigateTo(viewId)}
      />
      <SettingsModal 
        isOpen={isSettingsModalOpen} 
        onClose={() => setIsSettingsModalOpen(false)}
        targetExam={targetExam}
        onSelectExam={setTargetExam}
        language={language}
        onSelectLanguage={setLanguage}
      />
      <AppsLauncherModal 
        isOpen={isAppsLauncherOpen} 
        onClose={() => setIsAppsLauncherOpen(false)}
        onSelectApp={(viewId) => navigateTo(viewId)}
      />
      <CompetitiveExamsHubModal
        isOpen={isCompetitiveHubOpen}
        onClose={() => setIsCompetitiveHubOpen(false)}
        onSelectOption={(viewId) => navigateTo(viewId)}
      />

      {/* Public AI Rules & Guidelines Modal */}
      {isRulesModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#091122] border-2 border-amber-500/40 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-amber-300 font-black text-sm sm:text-base">
                <span>⚖️</span>
                <span>पब्लिक एआई नियम व शैक्षणिक गाइडलाइन्स</span>
              </div>
              <button onClick={() => setIsRulesModalOpen(false)} className="p-1 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>1. <strong>शैक्षणिक उपयोग:</strong> यह प्लेटफ़ॉर्म SSC Stenographer, CGL, Railway, BPSC तथा 10th/12th बोर्ड परीक्षाओं की तैयारी के लिए समर्पित है।</p>
              <p>2. <strong>सटीकता व सत्यापन:</strong> सभी मॉक टेस्ट, शॉर्टहैंड डिक्टेशन (80/100 WPM) और विज्ञान प्रयोगशाला के सूत्रों का नियमित अभ्यास करें।</p>
              <p>3. <strong>ऑटो-ईमेल स्टडी अलर्ट:</strong> पंजीकृत छात्रों को 24 घंटे तक अभ्यास न करने पर स्वचालित रिवीजन रिमाइंडर ईमेल भेजा जाता है।</p>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsRulesModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs cursor-pointer"
              >
                समझ गया (Got It)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;
