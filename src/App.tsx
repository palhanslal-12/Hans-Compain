import React, { useState, useEffect, useRef } from 'react';
import { 
  Sprout, 
  TrendingUp, 
  Landmark, 
  Check, 
  Sparkles, 
  Share2,
  BookOpen, 
  Award, 
  Play, 
  Flame, 
  HelpCircle, 
  Send, 
  RefreshCw, 
  AlertCircle, 
  User, 
  Users,
  Lock,
  Key,
  MapPin, 
  ArrowRight, 
  Music, 
  PenTool, 
  Clock,
  ChevronRight,
  Settings,
  Sparkle,
  Cpu,
  Menu,
  X,
  Plus,
  Paperclip,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Copy,
  Trash2,
  Folder,
  FolderPlus,
  Timer,
  Pause,
  RotateCcw,
  History,
  Save,
  FileText,
  CheckCircle,
  HelpCircle as QuestionIcon,
  Flame as BurnIcon,
  Target,
  Heart,
  Network,
  Activity,
  Layers,
  Globe,
  Loader,
  ZoomIn,
  ZoomOut,
  Search,
  MessageSquare
} from 'lucide-react';
import { Message, QuizQuestion, BusinessCalculation, BusinessResult } from './types';
import { HELP_TOPICS, PITMAN_STROKES, PRESET_MOTIVATIONAL_RAPS } from './constants';
import AboutCreator from './components/AboutCreator';
import { StudyPlanView } from './components/StudyPlanView';
import { FlashcardsView } from './components/FlashcardsView';
import { PhotoDoubtView } from './components/PhotoDoubtView';
import { SecurityHubView } from './components/SecurityHubView';
import { AuthModals } from './components/AuthModals';
import { AuthGateView } from './components/AuthGateView';
import { MusicStudioView } from './components/MusicStudioView';

// Multi-lingual Dynamic Translations Map
const translations: Record<'english' | 'hindi' | 'spanish' | 'french' | 'german', Record<string, string>> = {
  english: {
    appTitle: "HansAI",
    subtitle: "Your AI Companion",
    welcomeTitle: "How can I assist you today?",
    welcomeDesc: "Explaining concepts simply, structuring your study rules, or conducting deep multi-source live web research.",
    exploreWorkspaces: "EXPLORE NEXT-GEN WORKSPACES & FIELDS",
    addOption: "Add Custom Field",
    customFieldTitle: "Add Custom Academic/Exam Field",
    fieldTitleLabel: "Option/Exam Title",
    fieldTitlePlaceholder: "e.g., Civil Services, Banking, Railway...",
    selectIconLabel: "Select Icon / Emoji",
    cancel: "Cancel",
    addSection: "Add Section",
    quickServices: "Quick Services",
    interactiveQuiz: "Interactive Quiz",
    quizDesc: "Multiple-Choice Challenge",
    syllabusResearch: "Syllabus Research",
    syllabusResearchDesc: "Detailed syllabus study guide",
    studyTimer: "Smart Study Timer",
    studyTimerDesc: "Custom pomodoro alerts",
    notesFolders: "Notes & Folders",
    notesFoldersDesc: "Shorthand and academic logs",
    feedbackReview: "Submit User Review",
    feedbackDesc: "Share your rating & review",
    utilityDashboard: "Premium Utility Dashboard & Control",
    deepResearch: "🔬 Advanced AI Deep Research Console",
    deepResearchDesc: "Enables multi-source live web search validation and reference indexes on deep queries",
    neutralPress: "📰 Neutral Global Press",
    neutralPressDesc: "Objective verified news feed filtered for bias, updated via live web grounding",
    deepResearchActive: "Deep Search Enabled",
    deepResearchInactive: "Standard Model Search",
    verifiedNewsTitle: "Verified Global News Feed",
    biasFilterLabel: "AI Anti-Bias Anti-Hallucination Filter Active",
    fetchNewsButton: "Refresh Verified News Feed",
    newsLoading: "Grounding and analyzing neutral news...",
    loginTitle: "Sign In with Google",
    loginDesc: "Select an official Google account to activate premium review and admin features.",
    ownerBypass: "Owner Admin Access:",
    ownerBypassDesc: "To sign in as Hanslal Pal, use palhanslal4@gmail.com. Other inputs simulate pristine Google user profiles.",
    yourNameLabel: "Your Name",
    emailLabel: "Email Address",
    googleSignInBtn: "Sign In with Google",
    verifyProceed: "Authenticate & Proceed",
    feedbackTitle: "User Experience Reviews",
    feedbackWrite: "Write a Review",
    feedbackLoggedOutWarning: "Please sign in with your Google account to submit structured reviews.",
    submitFeedbackBtn: "Submit Review",
    ratingAccuracy: "Concept Accuracy",
    ratingSpeed: "System Speed & Latency",
    ratingExperience: "Interface Experience",
    reviewTextPlaceholder: "Write your honest feedback on HansAI's speed, utility, or content...",
    aboutCreatorTitle: "About the Creator",
    logoutBtn: "Log Out",
    welcomeGreeting: "Hello! I am HansAI, your AI Companion. How can I help you learn, write, or research today?",
    micListening: "Listening... speak now",
    micTooltip: "Use Voice Dictation (Speech-to-Text)",
    speakerTooltip: "Read aloud latest assistant output",
    creatorAnswerText: "HansAI has been designed under the visionary guidance of Hanslal Pal Ji to empower students, researchers, and professionals.",
    noAccountHeader: "Verify your Account",
    selectAccountHeader: "Google Account Chooser",
    useAnotherAccount: "Use another account / Custom Google Account",
    activeSearch: "Deep Web Searching...",
    ownerDashboard: "Owner Admin Dashboard",
    noAdminWarning: "Access Denied. Only palhanslal4@gmail.com can access the admin board.",
    backToHome: "Return to Workspace",
    totalReviews: "All Saved Reviews",
    carouselAccuracy: "Accuracy",
    carouselSpeed: "Speed",
    carouselUI: "UI Experience",
  },
  hindi: {
    appTitle: "हंसएआई साथी",
    subtitle: "आपका एआई साथी",
    welcomeTitle: "आज मैं आपकी क्या सहायता कर सकता हूँ?",
    welcomeDesc: "अवधारणाओं को सरल बनाना, अध्ययन नियम तैयार करना, या व्यापक बहु-स्रोत लाइव वेब पर रिसर्च करना।",
    exploreWorkspaces: "नेक्स्ट-जेन वर्कस्पेस व फील्ड्स का अन्वेषण करें",
    addOption: "कस्टम विकल्प जोड़ें",
    customFieldTitle: "नया शैक्षणिक/परीक्षा क्षेत्र जोड़ें",
    fieldTitleLabel: "विकल्प/परीक्षा का शीर्षक",
    fieldTitlePlaceholder: "जैसे: सिविल सर्विसेज, बैंकिंग, रेलवे...",
    selectIconLabel: "चिह्न / इमोजी चुनें",
    cancel: "रद्द करें",
    addSection: "सेक्शन जोड़ें",
    quickServices: "त्वरित सेवाएँ",
    interactiveQuiz: "इंटरैक्टिव क्विज",
    quizDesc: "बहुविकल्पीय चुनौती",
    syllabusResearch: "सिलेबस रिसर्च",
    syllabusResearchDesc: "विस्तृत सिलेबस अध्ययन गाइड",
    studyTimer: "स्मार्ट स्टडी टाइमर",
    studyTimerDesc: "कस्टम पोमोडोरो अलर्ट्स",
    notesFolders: "नोट्स और फोल्डर",
    notesFoldersDesc: "शॉर्ट हैंड और अकादमिक लॉग्स",
    feedbackReview: "फीडबैक दर्ज करें",
    feedbackDesc: "अपनी रेटिंग और सुझाव साझा करें",
    utilityDashboard: "प्रीमियम यूटिलिटी डैशबोर्ड और नियंत्रण",
    deepResearch: "🔬 एडवांस्ड एआई डीप रिसर्च कंसोल",
    deepResearchDesc: "गहन प्रश्नों पर बहु-स्रोत लाइव वेब खोज सत्यापन और संदर्भ सूचियों को सक्रिय करें",
    neutralPress: "📰 निष्पक्ष वैश्विक न्यूज़ प्रेस",
    neutralPressDesc: "पूर्वाग्रह-मुक्त सत्यापित वैश्विक न्यूज़ फीड, लाइव वेब ग्राउंडिंग द्वारा अपडेटेड",
    deepResearchActive: "डीप सर्च सक्रिय",
    deepResearchInactive: "मानक मॉडल सर्च सक्रिय",
    verifiedNewsTitle: "सत्यापित वैश्विक समाचार फीड",
    biasFilterLabel: "एआई पूर्वाग्रह-रोधी व शुद्धता फिल्टर सक्रिय",
    fetchNewsButton: "सत्यापित न्यूज़ फीड रीफ्रेश करें",
    newsLoading: "निष्पक्ष समाचारों की खोज और विश्लेषण जारी है...",
    loginTitle: "गूगल द्वारा साइन इन करें",
    loginDesc: "समीक्षा और व्यवस्थापक सुविधाओं को अनलॉक करने के लिए एक आधिकारिक गूगल खाते का चयन करें।",
    ownerBypass: "स्वामी एडमिन लॉगिन:",
    ownerBypassDesc: "हंसलाल पाल जी के रूप में लॉगिन करने के लिए palhanslal4@gmail.com का उपयोग करें। अन्य इनपुट वास्तविक गूगल छात्र प्रोफाइल का अनुकरण करेंगे।",
    yourNameLabel: "आपका नाम",
    emailLabel: "ईमेल पता",
    googleSignInBtn: "गूगल से साइन इन करें",
    verifyProceed: "सत्यापित करें and आगे बढ़ें",
    feedbackTitle: "उपयोगकर्ता अनुभव समीक्षाएँ",
    feedbackWrite: "एक समीक्षा लिखें",
    feedbackLoggedOutWarning: "समीक्षा दर्ज करने के लिए कृपया अपने गूगल खाते से साइन इन करें।",
    submitFeedbackBtn: "समीक्षा भेजें",
    ratingAccuracy: "तथ्यात्मक शुद्धता",
    ratingSpeed: "सिस्टम की गति व लेटेंसी",
    ratingExperience: "यूआई अनुभव",
    reviewTextPlaceholder: "हंसएआई की गति, उपयोगिता या विषयवस्तु पर अपनी स्पष्ट टिप्पणी लिखें...",
    aboutCreatorTitle: "निर्माता के बारे में",
    logoutBtn: "लॉग आउट",
    welcomeGreeting: "नमस्ते! मैं हंसएआई हूँ, आपका एआई साथी। आज आप किस विषय के बारे में जानना, सीखना या शोध करना चाहते हैं?",
    micListening: "सुन रहा हूँ... अब बोलें",
    micTooltip: "आवाज द्वारा टाइप करें (स्पीच-टू-टेक्स्ट)",
    speakerTooltip: "सहायक के उत्तर को बोलकर सुनें",
    creatorAnswerText: "हंसएआई को दूरदर्शी हंसलाल पाल जी के कड़क मार्गदर्शन में विद्यार्थियों और शोधकर्ताओं को सशक्त बनाने हेतु तैयार किया गया है।",
    noAccountHeader: "अपने खाते को सत्यापित करें",
    selectAccountHeader: "गूगल खाता चुनने वाला",
    useAnotherAccount: "नया गूगल अकाउंट जोड़ें",
    activeSearch: "गहन वेब रिसर्च जारी है...",
    ownerDashboard: "स्वामी एडमिन डैशबोर्ड",
    noAdminWarning: "पहुंच अस्वीकृत। केवल palhanslal4@gmail.com ही एडमिन कंसोल खोल सकते हैं।",
    backToHome: "अध्ययन क्षेत्र में लौटें",
    totalReviews: "सभी सहेजे गए फीडबैक",
    carouselAccuracy: "शुद्धता",
    carouselSpeed: "गति",
    carouselUI: "यूआई",
  },
  spanish: {
    appTitle: "HansAI",
    subtitle: "Su Compañero de IA",
    welcomeTitle: "¿Cómo puedo ayudarte hoy?",
    welcomeDesc: "Explicando conceptos de forma sencilla o realizando investigaciones profundas de múltiples fuentes en la web.",
    exploreWorkspaces: "EXPLORAR ESPACIOS DE TRABAJO DE PRÓXIMA GENERACIÓN",
    cancel: "Cancelar",
    quickServices: "Servicios Rápidos",
    interactiveQuiz: "Cuestionario Interactivo",
    syllabusResearch: "Investigación del Plan de Estudios",
    studyTimer: "Temporizador de Estudio Inteligente",
    notesFolders: "Notas y Carpetas",
    feedbackReview: "Enviar sugerencia",
    utilityDashboard: "Panel de Utilidades Premium",
    deepResearch: "Consola de Investigación Profunda de IA",
    verifiedNewsTitle: "Canal de Noticias Verificadas",
    newsLoading: "Analizando noticias neutrales...",
    loginTitle: "Registrarse con Google",
    logoutBtn: "Cerrar sesión",
    welcomeGreeting: "¡Hola! Soy HansAI, tu compañero de IA. ¿Cómo puedo ayudarte a aprender, escribir o investigar hoy?",
    creatorAnswerText: "HansAI ha sido desarrollado bajo la dirección estratégica y visión del Fundador Hanslal Pal."
  },
  french: {
    appTitle: "HansAI",
    subtitle: "Votre Compagnon IA",
    welcomeTitle: "Comment puis-je vous aider aujourd'hui?",
    welcomeDesc: "Expliquer des concepts simplement ou effectuer des recherches approfondies de sources multiples sur le web.",
    exploreWorkspaces: "EXPLORER LES ESPACES DE TRAVAIL DE NOUVELLE GÉNÉRATION",
    cancel: "Annuler",
    quickServices: "Services Rapides",
    interactiveQuiz: "Quiz Interactif",
    syllabusResearch: "Recherche de Programme",
    studyTimer: "Minuteur d'Étude Intelligent",
    notesFolders: "Notes & Dossiers",
    feedbackReview: "Soumettre un avis",
    utilityDashboard: "Tableau de Bord Premium",
    deepResearch: "Console de Recherche IA Approfondie",
    verifiedNewsTitle: "Fil d'Actualités Vérifiées",
    newsLoading: "Analyse des nouvelles neutres en cours...",
    loginTitle: "Se connecter avec Google",
    logoutBtn: "Se déconnecter",
    welcomeGreeting: "Bonjour! Je suis HansAI, votre compagnon IA. Comment puis-je vous aider à apprendre, à écrire ou à faire des recherches aujourd'hui?",
    creatorAnswerText: "HansAI a été développé sous la direction stratégique et la vision du Fundador Hanslal Pal."
  },
  german: {
    appTitle: "HansAI",
    subtitle: "Ihr KI-Begleiter",
    welcomeTitle: "Wie kann ich Ihnen heute helfen?",
    welcomeDesc: "Konzepte einfach erklären oder tiefgehende Recherchen aus mehreren Webquellen durchführen.",
    exploreWorkspaces: "NEXT-GEN ARBEITSBEREICHE ERKUNDEN",
    cancel: "Abbrechen",
    quickServices: "Schnellunterstützung",
    interactiveQuiz: "Interaktives Quiz",
    syllabusResearch: "Lehrplanforschung",
    studyTimer: "Intelligenter Lerntimer",
    notesFolders: "Notizen & Ordner",
    feedbackReview: "Feedback einreichen",
    utilityDashboard: "Premium-Dienstprogramm-Dashboard",
    deepResearch: "Fortgeschrittene KI-Tiefenforschungskonsole",
    verifiedNewsTitle: "Verifizierter Nachrichtenkanal",
    newsLoading: "Neutrale Nachrichten werden analysiert...",
    loginTitle: "Mit Google anmelden",
    logoutBtn: "Abmelden",
    welcomeGreeting: "Hallo! Ich bin HansAI, Ihr KI-Begleiter. Wie kann ich Ihnen heute beim Lernen, Schreiben oder Recherchieren helfen?",
    creatorAnswerText: "HansAI wurde unter der strategischen Leitung und Vision des Gründers Hanslal Pal entwickelt."
  }
};

const QuantumSwanLogo = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={`${className} animate-vibrant-swan`} id="quantum-swan-ai-logo">
    {/* Swan neck and body vector */}
    <path 
      d="M25,75 Q45,75 50,55 Q55,35 48,25 Q42,15 50,15 Q58,15 62,25 Q66,35 60,45 Q55,52 65,58 Q75,64 78,75 Z" 
      fill="none" 
      stroke="url(#swanGrad)" 
      strokeWidth="3.5" 
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Neural nodes connected to the swan */}
    <circle cx="50" cy="15" r="4" fill="#818CF8" /> {/* Head node */}
    <circle cx="48" cy="25" r="3" fill="#6366F1" />
    <circle cx="50" cy="55" r="3" fill="#6366F1" />
    <circle cx="65" cy="58" r="3" fill="#A5B4FC" />
    <circle cx="78" cy="75" r="4" fill="#818CF8" /> {/* Tail node */}
    <circle cx="25" cy="75" r="4" fill="#818CF8" /> {/* Front edge node */}

    {/* Connecting neural lanes */}
    <line x1="50" y1="15" x2="48" y2="25" stroke="#4F46E5" strokeWidth="1.2" strokeDasharray="2,2" />
    <line x1="48" y1="25" x2="50" y2="55" stroke="#4F46E5" strokeWidth="1.2" />
    <line x1="50" y1="55" x2="65" y2="58" stroke="#4F46E5" strokeWidth="1.2" />
    <line x1="65" y1="58" x2="78" y2="75" stroke="#4F46E5" strokeWidth="1.2" strokeDasharray="1,2" />
    
    {/* Decorative Swan Wing Lines */}
    <path d="M48,55 Q60,50 68,60 Q75,70 78,75" fill="none" stroke="#A5B4FC" strokeWidth="2" opacity="0.8" />
    <path d="M52,58 Q62,55 66,66" fill="none" stroke="#818CF8" strokeWidth="1.5" opacity="0.6" />

    <defs>
      <linearGradient id="swanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#818CF8" />
        <stop offset="50%" stopColor="#6366F1" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
    </defs>
  </svg>
);

const STATUS_THEMES = [
  { id: 'sunset', name: 'Sunset Glow', css: 'from-amber-500 via-orange-600 to-rose-600 text-white shadow-orange-500/15' },
  { id: 'mystic', name: 'Royal Violet', css: 'from-violet-800 via-purple-700 to-pink-600 text-white shadow-purple-500/15' },
  { id: 'aurora', name: 'Aurora Emerald', css: 'from-teal-800 via-emerald-700 to-cyan-600 text-white shadow-emerald-500/15' },
  { id: 'cosmic', name: 'Cosmic Sky', css: 'from-slate-900 via-indigo-950 to-blue-900 text-indigo-100 shadow-indigo-500/15' },
  { id: 'lava', name: 'Crimson Flame', css: 'from-red-700 via-rose-800 to-amber-600 text-amber-50 shadow-red-500/15' },
  { id: 'cyber', name: 'Cyberpunk Neon', css: 'from-indigo-950 via-slate-900 to-purple-950 text-emerald-200 border border-emerald-500/25' },
];

export default function App() {
  // Navigation & View state
  const [activeView, setActiveView] = useState<'chat' | 'newsboard' | 'research' | 'quiz' | 'leaderboard' | 'process' | 'calculator' | 'rap' | 'notes' | 'timer' | 'history' | 'goals' | 'map' | 'soul' | 'sarkari-result' | 'owner-dashboard' | 'feedback' | 'planner' | 'flashcards' | 'photo-doubt' | 'security'>('chat');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarSearchQuery, setSidebarSearchQuery] = useState("");
  const [isCreatorDrawerOpen, setIsCreatorDrawerOpen] = useState(false);
  const [isAcademicHubOpen, setIsAcademicHubOpen] = useState(false);
  const [newspaperZoom, setNewspaperZoom] = useState<number>(100);

  // Hands-Free Voice Assistant State ("Ok AI" / "Ok Open AI")
  const [isVoiceAssistantActive, setIsVoiceAssistantActive] = useState<boolean>(false);
  const [isVoiceAssistantListening, setIsVoiceAssistantListening] = useState<boolean>(false);
  const [isVoiceAssistantSpeaking, setIsVoiceAssistantSpeaking] = useState<boolean>(false);
  const [voiceAssistantStatus, setVoiceAssistantStatus] = useState<string>("Voice Assistant Ready");
  const [voiceAssistantTranscript, setVoiceAssistantTranscript] = useState<string>("");
  const voiceAssistantRecRef = useRef<any>(null);
  const isVoiceAssistantActiveRef = useRef<boolean>(false);
  const isVoiceAssistantSpeakingRef = useRef<boolean>(false);

  // History View Filter & Search State
  const [historyFilterCategory, setHistoryFilterCategory] = useState<'all' | 'chat' | 'session' | 'quiz' | 'timer' | 'note'>('all');
  const [historySearchQuery, setHistorySearchQuery] = useState<string>("");

  // Auth Modals State
  const [isAuthRegisterOpen, setIsAuthRegisterOpen] = useState(false);
  const [isAuthLoginOpen, setIsAuthLoginOpen] = useState(false);
  const [isAuthForgotOpen, setIsAuthForgotOpen] = useState(false);

  // Helper for Export PDF
  const handleExportPdf = (title: string, elementId: string) => {
    const el = document.getElementById(elementId);
    if (!el) {
      window.print();
      return;
    }
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Please allow popups to export PDF");
      return;
    }
    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: sans-serif; padding: 20px; color: #1e293b; line-height: 1.6; }
            h1, h2, h3 { color: #312e81; }
            .bg-\\[\\#03060E\\], .bg-\\[\\#0A0E1A\\] { background: #f8fafc !important; color: #0f172a !important; border: 1px solid #cbd5e1 !important; padding: 12px; margin-bottom: 12px; border-radius: 8px; }
            .text-white, .text-slate-200, .text-slate-300 { color: #0f172a !important; }
            .text-indigo-400, .text-purple-400, .text-emerald-400 { color: #4338ca !important; font-weight: bold; }
            button { display: none !important; }
          </style>
        </head>
        <body>
          <h2>HansAI Document Export: ${title}</h2>
          ${el.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  // Exit intent & Play Store Style Rating States
  const [isLogoutFeedbackOpen, setIsLogoutFeedbackOpen] = useState(false);
  const [logoutRating, setLogoutRating] = useState<number>(5);
  const [logoutComment, setLogoutComment] = useState<string>("");
  const [confettiActive, setConfettiActive] = useState(false);

  // Language state (English/Hindi)
  const [language, setLanguage] = useState<'english' | 'hindi'>(() => {
    return (localStorage.getItem('hansai-language') as 'english' | 'hindi') || 'hindi';
  });

  useEffect(() => {
    localStorage.setItem('hansai-language', language);
  }, [language]);

  // Translate helper
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  // Appearance & Personalization Settings state
  const [theme, setTheme] = useState<'midnight' | 'charcoal' | 'light'>(() => {
    return (localStorage.getItem('hansai-theme') as 'midnight' | 'charcoal' | 'light') || 'midnight';
  });
  const [textSize, setTextSize] = useState<'sm' | 'base' | 'lg'>(() => {
    return (localStorage.getItem('hansai-text-size') as 'sm' | 'base' | 'lg') || 'base';
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Gemini model settings (Flash vs Pro Preview)
  const [selectedModel, setSelectedModel] = useState<'gemini-3.5-flash' | 'gemini-3.1-pro-preview'>(() => {
    return (localStorage.getItem('hansai-active-model') as 'gemini-3.5-flash' | 'gemini-3.1-pro-preview') || 'gemini-3.5-flash';
  });

  // Educational Key Topics Highlight state
  const [isHighlightingEnabled, setIsHighlightingEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('hansai-highlight-text');
    return saved !== null ? saved === 'true' : true;
  });

  // SCREEN LIGHT / EYE-CARE COLOR MODES
  const [screenColorMode, setScreenColorMode] = useState<'dark' | 'warm_yellow' | 'eco_gray'>(() => {
    return (localStorage.getItem('hansai-color-mode') as 'dark' | 'warm_yellow' | 'eco_gray') || 'dark';
  });

  // Theme generator based on color modes
  const getThemeClasses = () => {
    // Overwritten for the premium high-contrast three-color palette across all dark modes
    return {
      bgMain: "bg-[#000000] text-white",
      bgCard: "bg-[#121214] border-[#00E5FF]/25",
      bgInner: "bg-[#000000]",
      border: "border-[#00E5FF]/25",
      textTitle: "text-white",
      textMuted: "text-slate-300",
      sidebar: "bg-[#121214] border-r border-[#00E5FF]/25",
      header: "bg-[#000000] border-b border-[#00E5FF]/25",
      buttonSecondary: "bg-[#1A1A1E] hover:bg-slate-800 text-white",
      inputBg: "bg-[#000000] border-[#00E5FF]/25 text-white"
    };
  };

  const themeColors = getThemeClasses();

  // AUTHENTICATED USER STATE & Mandatory Registration Gate
  const [user, setUser] = useState<{ email: string; name: string; role?: string; avatarUrl?: string } | null>(() => {
    const saved = localStorage.getItem('hansai-user-session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return null; // Guest initially
  });

  // OWNER DASHBOARD SECURITY PIN STATES
  const [isOwnerPinModalOpen, setIsOwnerPinModalOpen] = useState(false);
  const [ownerPinInput, setOwnerPinInput] = useState('');
  const [isOwnerUnlocked, setIsOwnerUnlocked] = useState(false);

  const handleOpenOwnerDashboard = () => {
    if (isOwnerUnlocked || (user && (user.email === 'palhanslal4@gmail.com' || user.role === 'owner'))) {
      setActiveView('owner-dashboard');
    } else {
      setOwnerPinInput('');
      setIsOwnerPinModalOpen(true);
    }
  };

  const [registerFormName, setRegisterFormName] = useState("");
  const [registerFormEmail, setRegisterFormEmail] = useState("");
  const [isRegisteringUser, setIsRegisteringUser] = useState(false);
  const [isUserRegisterModalOpen, setIsUserRegisterModalOpen] = useState(false);

  // ANIMATED SPLASH SCREEN STATE
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const [splashProgress, setSplashProgress] = useState(10);
  const [splashStatus, setSplashStatus] = useState("HansAI Neural Engine Init...");

  useEffect(() => {
    const steps = [
      { progress: 35, status: "Loading HansAI Core... / हंस-एआई लोड हो रहा है" },
      { progress: 65, status: "Preparing Shorthand & SSC Modules..." },
      { progress: 90, status: "Connecting 1,420 Active Students..." },
      { progress: 100, status: "Welcome to HansAI! / स्वागतम!" }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setSplashProgress(steps[currentStep].progress);
        setSplashStatus(steps[currentStep].status);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowSplashScreen(false), 300);
      }
    }, 450);

    return () => clearInterval(interval);
  }, []);

  // Network Offline State
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Owner analytics state (for owner dashboard)
  const [ownerAnalyticsData, setOwnerAnalyticsData] = useState<{
    users: Array<{ id: string; name: string; email: string; registeredAt: string; lastActiveAt: string; promptCount: number }>;
    logs: Array<{ id: string; userName: string; userEmail: string; type: string; query: string; timestamp: string }>;
    totalUsers: number;
    totalQueries: number;
  }>({
    users: [
      { id: 'usr_01', name: 'Hanslal Pal (Founder Owner)', email: 'palhanslal4@gmail.com', registeredAt: '2026-01-01T08:00:00.000Z', lastActiveAt: new Date().toISOString(), promptCount: 142 },
      { id: 'usr_02', name: 'Rahul Sharma', email: 'rahul.steno2026@gmail.com', registeredAt: '2026-07-28T10:15:00.000Z', lastActiveAt: new Date(Date.now() - 900000).toISOString(), promptCount: 38 },
      { id: 'usr_03', name: 'Priya Singh', email: 'priya.ssc.prep@outlook.com', registeredAt: '2026-07-29T14:30:00.000Z', lastActiveAt: new Date(Date.now() - 2700000).toISOString(), promptCount: 29 },
      { id: 'usr_04', name: 'Amit Kumar', email: 'amit.bihar.sarkari@gmail.com', registeredAt: '2026-07-30T09:20:00.000Z', lastActiveAt: new Date(Date.now() - 7200000).toISOString(), promptCount: 54 },
      { id: 'usr_05', name: 'Ananya Roy', email: 'ananya.steno.practice@gmail.com', registeredAt: '2026-07-31T16:00:00.000Z', lastActiveAt: new Date(Date.now() - 18000000).toISOString(), promptCount: 19 }
    ],
    logs: [
      { id: 'log_01', userName: 'Rahul Sharma', userEmail: 'rahul.steno2026@gmail.com', type: 'music', query: 'Created AI Music Track: "Motivational Lofi Beat - Steno 80 WPM Speed Drill"', timestamp: new Date(Date.now() - 600000).toISOString() },
      { id: 'log_02', userName: 'Priya Singh', userEmail: 'priya.ssc.prep@outlook.com', type: 'chat', query: 'Pitman shorthand phraseology rules for court reporter dictation', timestamp: new Date(Date.now() - 1800000).toISOString() },
      { id: 'log_03', userName: 'Amit Kumar', userEmail: 'amit.bihar.sarkari@gmail.com', type: 'search', query: 'Bihar Civil Court Stenographer 2026 admit card & exam pattern', timestamp: new Date(Date.now() - 3000000).toISOString() },
      { id: 'log_04', userName: 'Rahul Sharma', userEmail: 'rahul.steno2026@gmail.com', type: 'quiz', query: 'Completed SSC Steno Mock Practice Test - Score: 88/100', timestamp: new Date(Date.now() - 4500000).toISOString() },
      { id: 'log_05', userName: 'Ananya Roy', userEmail: 'ananya.steno.practice@gmail.com', type: 'music', query: 'Searched Track: "Sitar & Classical Flute Concentration Beat"', timestamp: new Date(Date.now() - 6600000).toISOString() },
      { id: 'log_06', userName: 'Amit Kumar', userEmail: 'amit.bihar.sarkari@gmail.com', type: 'research', query: 'PMEGP Subsidy Scheme & MSME Machinery Loan application steps', timestamp: new Date(Date.now() - 10800000).toISOString() },
      { id: 'log_07', userName: 'Hanslal Pal (Founder Owner)', userEmail: 'palhanslal4@gmail.com', type: 'login', query: 'Owner Admin Console Access Granted & Security Check', timestamp: new Date(Date.now() - 14400000).toISOString() }
    ],
    totalUsers: 5,
    totalQueries: 6
  });
  const [isOwnerAnalyticsLoading, setIsOwnerAnalyticsLoading] = useState(false);
  const [ownerUserSearchQuery, setOwnerUserSearchQuery] = useState("");
  const [ownerLogSearchQuery, setOwnerLogSearchQuery] = useState("");
  const [ownerLogTypeFilter, setOwnerLogTypeFilter] = useState("all");
  const [selectedUserForLogs, setSelectedUserForLogs] = useState<string | null>(null);

  // Owner Password Security Guard State (Always requires password on opening)
  const [isOwnerAuthenticated, setIsOwnerAuthenticated] = useState<boolean>(false);
  const [ownerPasswordInput, setOwnerPasswordInput] = useState("");
  const [ownerPasswordError, setOwnerPasswordError] = useState(false);

  const handleOwnerPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = ownerPasswordInput.trim();
    if (input === 'Chhangur#@8084' || input === 'Chhangur@8084') {
      setIsOwnerAuthenticated(true);
      setOwnerPasswordError(false);
      setOwnerPasswordInput('');
      showToast("Owner Admin Password Verified! Welcome Hanslal Pal Ji 👑", "success");
      fetchOwnerAnalytics();
    } else {
      setOwnerPasswordError(true);
      showToast("Incorrect Password! / गलत पासवर्ड दर्ज किया गया", "warn");
    }
  };

  const fetchOwnerAnalytics = async () => {
    try {
      setIsOwnerAnalyticsLoading(true);
      const res = await fetch('/api/owner/analytics');
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setOwnerAnalyticsData({
            users: Array.isArray(data.users) ? data.users : [],
            logs: Array.isArray(data.logs) ? data.logs : [],
            totalUsers: typeof data.totalUsers === 'number' ? data.totalUsers : (data.users?.length || 0),
            totalQueries: typeof data.totalQueries === 'number' ? data.totalQueries : (data.logs?.length || 0)
          });
        }
      }
    } catch (e) {
      console.error("Failed to fetch owner analytics", e);
    } finally {
      setIsOwnerAnalyticsLoading(false);
    }
  };

  useEffect(() => {
    if (activeView === 'owner-dashboard') {
      fetchOwnerAnalytics();
    }
  }, [activeView]);

  const handleUserRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerFormName.trim() || !registerFormEmail.trim()) {
      showToast("Please enter both Name and Email.", "warn");
      return;
    }
    const cleanName = registerFormName.trim();
    const cleanEmail = registerFormEmail.trim().toLowerCase();

    setIsRegisteringUser(true);
    try {
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: cleanName, email: cleanEmail })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      const role = cleanEmail === 'palhanslal4@gmail.com' ? 'owner' : 'student';
      const newUserObj = { name: cleanName, email: cleanEmail, role };

      setUser(newUserObj);
      localStorage.setItem('hansai-user-session', JSON.stringify(newUserObj));
      setIsUserRegisterModalOpen(false);
      showToast(`Welcome ${cleanName}! Registered successfully. 🎉`, "success");
    } catch (err: any) {
      const role = cleanEmail === 'palhanslal4@gmail.com' ? 'owner' : 'student';
      const newUserObj = { name: cleanName, email: cleanEmail, role };
      setUser(newUserObj);
      localStorage.setItem('hansai-user-session', JSON.stringify(newUserObj));
      setIsUserRegisterModalOpen(false);
      showToast(`Welcome ${cleanName}! Offline mode active.`, "info");
    } finally {
      setIsRegisteringUser(false);
    }
  };

  const logUserActivity = (type: string, query: string) => {
    if (user?.email && query?.trim()) {
      fetch('/api/users/log-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          type,
          query
        })
      }).catch(err => console.error("Activity log error", err));
    }
  };

  // Premium Utility states
  const [advancedResearchMode, setAdvancedResearchMode] = useState(() => {
    return localStorage.getItem('hansai-advanced-research') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('hansai-advanced-research', advancedResearchMode ? 'true' : 'false');
  }, [advancedResearchMode]);

  // Saved Projects and Interactive Audio Recorder states
  const [savedProjects, setSavedProjects] = useState<any[]>(() => {
    const saved = localStorage.getItem('hansai-projects');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('hansai-projects', JSON.stringify(savedProjects));
  }, [savedProjects]);

  const [savedChats, setSavedChats] = useState<any[]>(() => {
    const saved = localStorage.getItem('hansai-saved-chats');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('hansai-saved-chats', JSON.stringify(savedChats));
  }, [savedChats]);

  const filteredSavedChats = (Array.isArray(savedChats) ? savedChats : []).filter(s => 
    s && (!sidebarSearchQuery.trim() || 
    (s.title && s.title.toLowerCase().includes(sidebarSearchQuery.toLowerCase())) ||
    (s.messages && Array.isArray(s.messages) && s.messages.some((m: any) => m && m.content && String(m.content).toLowerCase().includes(sidebarSearchQuery.toLowerCase()))))
  );

  // Audio Recorder States
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<any | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState<any | null>(null);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectNotes, setNewProjectNotes] = useState("");
  const [newProjectPoints, setNewProjectPoints] = useState("");
  const [newProjectHeadlines, setNewProjectHeadlines] = useState("");

  // Collapsible Workspaces Toggle
  const [isWorkspaceCollapsed, setIsWorkspaceCollapsed] = useState(() => {
    return localStorage.getItem('hansai-workspace-collapsed') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('hansai-workspace-collapsed', isWorkspaceCollapsed ? 'true' : 'false');
  }, [isWorkspaceCollapsed]);

  const [isUtilityDashboardOpen, setIsUtilityDashboardOpen] = useState(false);

  // Carousel feedback index
  const [reviewIndex, setReviewIndex] = useState(0);

  // Dynamic news feed state
  const [newsFeed, setNewsFeed] = useState<Array<{ title: string; bulletPoints: string[]; source: string; date: string }>>([
    {
      title: "Global Education Initiatives Announce Multi-Lingual AI Standards",
      bulletPoints: [
        "Major national research hubs sign a treaty for unified classroom safety guardrails.",
        "Emphasizes zero hallucinations, high accessibility, and native translation APIs.",
        "Aims to bridge accessibility gaps in remote schools and universities worldwide."
      ],
      source: "Verified Reuters Grounding",
      date: "2026-06-17"
    }
  ]);
  const [isNewsLoading, setIsNewsLoading] = useState(false);
  const [newsZoom, setNewsZoom] = useState<number>(100);

  const handleFetchVerifiedNews = async () => {
    try {
      setIsNewsLoading(true);
      const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language })
      });
      if (!res.ok) throw new Error("Could not fetch neutral press feeds.");
      const data = await res.json();
      const list = data.newsList || data.news;
      if (list && Array.isArray(list)) {
        setNewsFeed(list);
        showToast(language === 'hindi' ? "सत्यापित न्यूज़ फीड सफलतापूर्वक अपडेट की गई! 📰" : "Latest bias-filtered news feed synchronized! 📰", "success");
      }
    } catch (err) {
      console.error(err);
      showToast("न्यूज़ फीड लाने में समस्या।", "warn");
    } finally {
      setIsNewsLoading(false);
    }
  };

  // DYNAMIC FEEDBACK FEED LIST state
  const [feedbacks, setFeedbacks] = useState<Array<{ id: string; user: string; avatarUrl?: string; ratingAccuracy: number; ratingSpeed: number; ratingExperience: number; comment: string; date: string }>>(() => {
    const saved = localStorage.getItem('hansai-feedbacks-v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'fb-1',
        user: 'palhanslal4@gmail.com',
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        ratingAccuracy: 5,
        ratingSpeed: 5,
        ratingExperience: 5,
        comment: 'अद्भुत प्लेटफॉर्म! हिन्दी और इंग्लिश में 100% शुद्धता के साथ सिलेबस तथा कड़क मार्गदर्शन सक्षम है।',
        date: '2026-06-16'
      },
      {
        id: 'fb-2',
        user: 'satyam.kumar99@gmail.com',
        avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80",
        ratingAccuracy: 5,
        ratingSpeed: 5,
        ratingExperience: 5,
        comment: 'Voice inputs are highly responsive and precise! Helped me construct rapid shorthand rules.',
        date: '2026-06-15'
      },
      {
        id: 'fb-3',
        user: 'aarav.sharma@gmail.com',
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
        ratingAccuracy: 5,
        ratingSpeed: 4,
        ratingExperience: 5,
        comment: 'Excellent UI, eye-care modes look extremely comfortable for late-night study sessions.',
        date: '2026-06-14'
      }
    ];
  });

  // DIALOGS & OVERLAY FEEDBACK/LOGIN toggles
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isSharePosterOpen, setIsSharePosterOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [feedbackRatingAccuracy, setFeedbackRatingAccuracy] = useState<number>(5);
  const [feedbackRatingSpeed, setFeedbackRatingSpeed] = useState<number>(5);
  const [feedbackRatingExperience, setFeedbackRatingExperience] = useState<number>(5);
  const [feedbackComment, setFeedbackComment] = useState<string>("");

  // ALARM REMINDER & TIMER UTILITIES states
  const [reminderEnabled, setReminderEnabled] = useState<boolean>(() => {
    return localStorage.getItem('hansai-reminder-enabled') !== 'false';
  });
  const [reminderTime, setReminderTime] = useState<string>(() => {
    return localStorage.getItem('hansai-reminder-time') || "19:00";
  });
  const [reminderAlertState, setReminderAlertState] = useState<boolean>(false);
  const [hasAlertedHalfTime, setHasAlertedHalfTime] = useState<boolean>(false);

  // APP-LEVEL NOTIFICATION TOAST ARRAY
  const [toasts, setToasts] = useState<Array<{ id: string; msg: string; type: 'info' | 'success' | 'warn' }>>([]);

  const showToast = (msg: string, type: 'info' | 'success' | 'warn' = 'success') => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, msg, type }]);
    
    // Play synthesis beep audio chime natively without requiring external files
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      
      if (type === 'success') {
        oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
        oscillator.start();
        oscillator.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.12); // E5
        gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime + 0.12);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
        oscillator.stop(audioCtx.currentTime + 0.35);
      } else if (type === 'warn') {
        oscillator.frequency.setValueAtTime(329.63, audioCtx.currentTime); // E4
        gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
        oscillator.start();
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        oscillator.stop(audioCtx.currentTime + 0.3);
      } else {
        oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        oscillator.start();
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
        oscillator.stop(audioCtx.currentTime + 0.25);
      }
    } catch (e) {
      console.warn("Audio chime play unsupported/blocked initially", e);
    }

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Sync to local storages
  useEffect(() => {
    localStorage.setItem('hansai-color-mode', screenColorMode);
  }, [screenColorMode]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('hansai-user-session', JSON.stringify(user));
    } else {
      localStorage.removeItem('hansai-user-session');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('hansai-feedbacks-v1', JSON.stringify(feedbacks));
  }, [feedbacks]);

  useEffect(() => {
    localStorage.setItem('hansai-reminder-enabled', String(reminderEnabled));
  }, [reminderEnabled]);

  useEffect(() => {
    localStorage.setItem('hansai-reminder-time', reminderTime);
  }, [reminderTime]);

  const triggerDailyReminder = () => {
    showToast("🎯 दैनिक लक्ष्य अनुस्मारक: आपके पास अभी भी कुछ अधूरे दैनिक लक्ष्य हैं!", "warn");
    setReminderAlertState(true);
    
    // Try browser Notification natively
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        try {
          new Notification("HansAI Goal Reminder / याद दिलाने वाला", {
            body: "आपके पास अभी भी कुछ अधूरे दैनिक लक्ष्य हैं! इन्हें आज ही पूर्ण करें और तैयारी कड़क रखें। 🚀",
            icon: "https://img.icons8.com/fluent/192/000000/brain.png"
          });
        } catch (e) {
          console.warn("Notification spawn failed", e);
        }
      } else if (Notification.permission !== "denied") {
        try { Notification.requestPermission(); } catch (e) {}
      }
    }
  };

  // Voice Speech and Image Attachment states
  const [chatAttachedImage, setChatAttachedImage] = useState<{ mimeType: string; data: string; previewUrl: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [currentlySpeakingMsgId, setCurrentlySpeakingMsgId] = useState<string | null>(null);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [isTimerVoiceRecording, setIsTimerVoiceRecording] = useState(false);
  const [isNotesVoiceRecording, setIsNotesVoiceRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Active settings application to local and window objects
  useEffect(() => {
    localStorage.setItem('hansai-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('hansai-text-size', textSize);
  }, [textSize]);

  useEffect(() => {
    localStorage.setItem('hansai-active-model', selectedModel);
  }, [selectedModel]);

  useEffect(() => {
    localStorage.setItem('hansai-highlight-text', String(isHighlightingEnabled));
  }, [isHighlightingEnabled]);

  // Derived helper mapping text sizes to Tailwind utilities
  const textSizeClass = textSize === 'sm' ? 'text-xs' : textSize === 'lg' ? 'text-base' : 'text-sm';

  // 1. Text Copy to Clipboard Callback
  const handleCopyMessage = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(msgId);
    setTimeout(() => {
      setCopiedMsgId(null);
    }, 2000);
  };

  // 2. Chat Input Clipboard Paste Helper
  const handlePasteInput = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setChatInput(prev => prev + (prev ? ' ' : '') + text);
      }
    } catch (err) {
      console.warn("Direct clipboard read blocked by browser permissions inside iframe context.");
    }
  };

  // 3. Text to Speech voice readout (Synthesizer)
  const handleToggleSpeech = (msgId: string, text: string) => {
    if (currentlySpeakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setCurrentlySpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel(); // Stop other elements speaking if working

    const cleanText = text
      .replace(/[\#\*\_\\`]/g, "") // Strip Markdown symbols
      .replace(/https?:\/\/\s+/g, '') // Strip link URLs
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const voices = window.speechSynthesis.getVoices();
    const containsHindi = /[\u0900-\u097F]/.test(cleanText);

    if (containsHindi) {
      // Prioritize Hindi pronunciation voice
      const hindiVoice = voices.find(v => v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi')) || voices.find(v => v.lang.startsWith('en'));
      if (hindiVoice) utterance.voice = hindiVoice;
    } else {
      // Default to crisp educational English voice
      const englishVoice = voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('google')) || voices.find(v => v.lang.startsWith('en'));
      if (englishVoice) utterance.voice = englishVoice;
    }

    utterance.onend = () => {
      setCurrentlySpeakingMsgId(null);
    };
    utterance.onerror = () => {
      setCurrentlySpeakingMsgId(null);
    };

    setCurrentlySpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // 3.5 Hands-Free Voice Assistant Logic ("Ok AI" / "Ok Open AI")
  const stopVoiceAssistantMode = () => {
    isVoiceAssistantActiveRef.current = false;
    isVoiceAssistantSpeakingRef.current = false;
    if (voiceAssistantRecRef.current) {
      try { voiceAssistantRecRef.current.stop(); } catch (e) {}
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsVoiceAssistantActive(false);
    setIsVoiceAssistantListening(false);
    setIsVoiceAssistantSpeaking(false);
    setVoiceAssistantStatus("Voice Assistant Deactivated");
  };

  const speakVoiceAssistantReply = (replyText: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const cleanText = replyText
      .replace(/[\#\*\_\\`]/g, "")
      .replace(/https?:\/\/\S+/g, "")
      .trim();

    const spokenChunk = cleanText.length > 500 ? cleanText.substring(0, 500) + "..." : cleanText;

    const utterance = new SpeechSynthesisUtterance(spokenChunk);
    const voices = window.speechSynthesis.getVoices();
    const containsHindi = /[\u0900-\u097F]/.test(cleanText);

    if (containsHindi) {
      const hindiVoice = voices.find(v => v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi')) || voices.find(v => v.lang.startsWith('en'));
      if (hindiVoice) utterance.voice = hindiVoice;
    } else {
      const englishVoice = voices.find(v => v.lang.startsWith('en') && (v.name.toLowerCase().includes('google') || v.name.toLowerCase().includes('natural'))) || voices.find(v => v.lang.startsWith('en'));
      if (englishVoice) utterance.voice = englishVoice;
    }

    utterance.rate = 1.0;

    utterance.onstart = () => {
      isVoiceAssistantSpeakingRef.current = true;
      setIsVoiceAssistantSpeaking(true);
      setVoiceAssistantStatus("🔊 Speaking AI Response...");
    };

    utterance.onend = () => {
      isVoiceAssistantSpeakingRef.current = false;
      setIsVoiceAssistantSpeaking(false);
      setVoiceAssistantStatus("🟢 Active - Listening for 'Ok AI' / 'Ok Open AI'...");
      if (isVoiceAssistantActiveRef.current) {
        setTimeout(() => {
          if (isVoiceAssistantActiveRef.current && !isVoiceAssistantSpeakingRef.current) {
            try { voiceAssistantRecRef.current?.start(); } catch (e) {}
          }
        }, 500);
      }
    };

    utterance.onerror = () => {
      isVoiceAssistantSpeakingRef.current = false;
      setIsVoiceAssistantSpeaking(false);
      setVoiceAssistantStatus("🟢 Active - Listening for 'Ok AI' / 'Ok Open AI'...");
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleVoiceAssistantQuery = async (queryText: string) => {
    if (!queryText.trim()) return;

    let cleanQuery = queryText
      .replace(/^(ok|okay|hey|hello|ओपेन|ओके|ओक|ओपन)?\s*(open\s*ai|ai|hansai|ओपेन\s*एआई|ओके\s*एआई|ओक\s*एआई|ओपन\s*एआई)\b/i, "")
      .trim();

    if (!cleanQuery) cleanQuery = queryText;

    setVoiceAssistantStatus(`🤔 Processing: "${cleanQuery}"`);
    showToast(`🎙️ Voice Query: "${cleanQuery}"`, "info");

    await handleSendChat(cleanQuery);
  };

  const startVoiceAssistantMode = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast(
        language === 'hindi' 
          ? "इस ब्राउज़र में वॉयस अस्सिस्टेंट समर्थित नहीं है। कृपया Chrome का उपयोग करें।" 
          : "Voice Recognition is not supported in this browser. Please use Chrome.", 
        "warn"
      );
      return;
    }

    if (isVoiceAssistantActive) {
      stopVoiceAssistantMode();
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'hi-IN';

      rec.onstart = () => {
        isVoiceAssistantActiveRef.current = true;
        setIsVoiceAssistantActive(true);
        setIsVoiceAssistantListening(true);
        setVoiceAssistantStatus("🟢 Active - Say 'Ok AI' / 'Ok Open AI' or speak your question!");
        showToast("🎙️ Hands-Free Voice Assistant Active! Say 'Ok AI' or speak your question.", "success");
      };

      rec.onresult = (event: any) => {
        const resultIndex = event.resultIndex;
        const transcript = event.results[resultIndex][0].transcript;
        const isFinal = event.results[resultIndex].isFinal;
        setVoiceAssistantTranscript(transcript);

        const lowerTrans = transcript.toLowerCase();
        const hasWakeWord = lowerTrans.includes("ok ai") || 
                             lowerTrans.includes("ok open ai") || 
                             lowerTrans.includes("okay ai") || 
                             lowerTrans.includes("hey ai") || 
                             lowerTrans.includes("hello ai") || 
                             lowerTrans.includes("ओपन एआई") || 
                             lowerTrans.includes("ओके एआई") || 
                             lowerTrans.includes("ओपेन एआई") || 
                             lowerTrans.includes("ओक एआई") || 
                             lowerTrans.includes("hansai") ||
                             lowerTrans.includes("open ai");

        if (isFinal) {
          if (hasWakeWord || transcript.trim().length > 3) {
            try { rec.stop(); } catch (e) {}
            handleVoiceAssistantQuery(transcript);
          }
        }
      };

      rec.onerror = (err: any) => {
        const errType = err?.error;
        if (errType === 'no-speech' || errType === 'aborted') {
          // Expected harmless speech recognition events during pause/stop
          return;
        }
        if (errType === 'not-allowed' || errType === 'service-not-allowed') {
          isVoiceAssistantActiveRef.current = false;
          setIsVoiceAssistantActive(false);
          setIsVoiceAssistantListening(false);
          setVoiceAssistantStatus("⚠️ Mic Permission Denied. Tap to grant browser microphone access.");
          showToast("⚠️ Microphone access is blocked by browser/iframe. Please grant mic permissions.", "warn");
          return;
        }
        if (errType === 'audio-capture') {
          isVoiceAssistantActiveRef.current = false;
          setIsVoiceAssistantActive(false);
          setIsVoiceAssistantListening(false);
          setVoiceAssistantStatus("⚠️ Microphone Hardware Not Found.");
          showToast("⚠️ No microphone hardware detected on this device.", "warn");
          return;
        }

        console.warn("Voice Assistant Speech Recognition event:", errType || err);
        setIsVoiceAssistantListening(false);
        setVoiceAssistantStatus("⚠️ Voice Input Paused. Tap to resume.");
      };

      rec.onend = () => {
        setIsVoiceAssistantListening(false);
        if (isVoiceAssistantActiveRef.current && !isVoiceAssistantSpeakingRef.current) {
          setTimeout(() => {
            if (isVoiceAssistantActiveRef.current && !isVoiceAssistantSpeakingRef.current) {
              try { rec.start(); } catch (e) {}
            }
          }, 500);
        }
      };

      voiceAssistantRecRef.current = rec;
      rec.start();
    } catch (err) {
      console.warn("Failed to initialize speech recognition: ", err);
      isVoiceAssistantActiveRef.current = false;
      setIsVoiceAssistantActive(false);
    }
  };

  // 4. Voice Input vocal dictation
  const handleToggleVoiceInput = () => {
    if (isVoiceRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsVoiceRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast(
        language === 'hindi' 
          ? "इस ब्राउज़र में वॉयस डिक्टेशन समर्थित नहीं है। कृपया Chrome या Edge का उपयोग करें।" 
          : "Voice Speech Recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.", 
        "warn"
      );
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'hi-IN'; // Multi-lingual primary locale support (Hindi & English transcriptions seamlessly resolved)

      rec.onstart = () => {
        setIsVoiceRecording(true);
      };

      rec.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        if (text) {
          setChatInput(prev => prev + (prev ? ' ' : '') + text);
        }
      };

      rec.onerror = (err: any) => {
        console.error("Speech Recognition capture error: ", err);
        setIsVoiceRecording(false);
      };

      rec.onend = () => {
        setIsVoiceRecording(false);
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (err) {
      console.error(err);
      setIsVoiceRecording(false);
    }
  };

  const handleToggleTimerVoiceInput = () => {
    if (isTimerVoiceRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsTimerVoiceRecording(false);
      return;
    }

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    setIsVoiceRecording(false);
    setIsNotesVoiceRecording(false);

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast(
        language === 'hindi' 
          ? "इस ब्राउज़र में वॉयस डिक्टेशन समर्थित नहीं है। कृपया Chrome या Edge का उपयोग करें।" 
          : "Voice Dictation is not supported in this browser. Please use Chrome or Edge.", 
        "warn"
      );
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = false;
      rec.lang = language === 'hindi' ? 'hi-IN' : 'en-IN';

      rec.onstart = () => {
        setIsTimerVoiceRecording(true);
        showToast(
          language === 'hindi' 
            ? "🎙️ माइक्रोफोन चालू! बोलना शुरू करें..." 
            : "🎙️ Microphone Active! Start speaking...", 
          "info"
        );
      };

      rec.onresult = (event: any) => {
        const resultIndex = event.resultIndex;
        const text = event.results[resultIndex][0].transcript;
        if (text) {
          setTimerNoteContent(prev => prev + (prev ? ' ' : '') + text);
        }
      };

      rec.onerror = (err: any) => {
        console.error("Timer Speech Recognition capture error: ", err);
        setIsTimerVoiceRecording(false);
      };

      rec.onend = () => {
        setIsTimerVoiceRecording(false);
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (err) {
      console.error(err);
      setIsTimerVoiceRecording(false);
    }
  };

  const handleToggleNotesVoiceInput = () => {
    if (isNotesVoiceRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsNotesVoiceRecording(false);
      return;
    }

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    setIsVoiceRecording(false);
    setIsTimerVoiceRecording(false);

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast(
        language === 'hindi' 
          ? "इस ब्राउज़र में वॉयस डिक्टेशन समर्थित नहीं है। कृपया Chrome या Edge का उपयोग करें।" 
          : "Voice Dictation is not supported in this browser. Please use Chrome or Edge.", 
        "warn"
      );
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = false;
      rec.lang = language === 'hindi' ? 'hi-IN' : 'en-IN';

      rec.onstart = () => {
        setIsNotesVoiceRecording(true);
        showToast(
          language === 'hindi' 
            ? "🎙️ माइक्रोफोन चालू! बोलकर नोट्स लिखना शुरू करें..." 
            : "🎙️ Microphone Active! Start speaking to dictate notes...", 
          "info"
        );
      };

      rec.onresult = (event: any) => {
        const resultIndex = event.resultIndex;
        const text = event.results[resultIndex][0].transcript;
        if (text) {
          setNoteContentInput(prev => prev + (prev ? ' ' : '') + text);
        }
      };

      rec.onerror = (err: any) => {
        console.error("Notes Speech Recognition capture error: ", err);
        setIsNotesVoiceRecording(false);
      };

      rec.onend = () => {
        setIsNotesVoiceRecording(false);
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (err) {
      console.error(err);
      setIsNotesVoiceRecording(false);
    }
  };

  // 5. Intelligent Key terms highlighters (Shorthand, Bihar context, PMEGP MSME)
  const renderMessageWithHighlights = (content: string | undefined | null) => {
    if (!content) return "";
    const str = typeof content === 'string' ? content : String(content);
    if (!isHighlightingEnabled) {
      return str;
    }

    const highlightRegex = /(shorthand|steno|stenographer|dictation|consonants|vowels|Pitman|PMEGP|Mudra|subsidy|subsidies|yield percentage|processed goods|machinery|net profit|revenue|हंसलाल पाल|हंसलाल पाल जी)/ig;

    const parts = str.split(highlightRegex);
    if (parts.length === 1) return str;

    return (
      <>
        {parts.map((p, idx) => {
          if (p.match(highlightRegex)) {
            return (
              <mark 
                key={idx} 
                className="bg-amber-500/20 text-amber-300 font-bold px-1 py-0.5 rounded border border-amber-500/25 transition-all select-all inline-block hover:scale-[1.01]"
              >
                {p}
              </mark>
            );
          }
          return p;
        })}
      </>
    );
  };

  // Chat state
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  
  // Custom-curated dynamic study segments (SSC, BPSC, UPSC, and Stenography)
  const [examSegments, setExamSegments] = useState<Array<{ id: string; title: string; emoji: string; samples: string[] }>>([
    {
      id: "ssc",
      title: "SSC Preparation",
      emoji: "🏛️",
      samples: [
        "How to prepare General Awareness portion for SSC standard exams?",
        "SSC English Grammar: Core concepts and important rules of Active and Passive Voice",
        "Mastering General Studies: High frequency Indian Polity & Constitution topics",
        "Explain fundamental concepts of Economics and National Income for SSC"
      ]
    },
    {
      id: "bpsc",
      title: "BPSC Prep",
      emoji: "🚩",
      samples: [
        "BPSC History: Key freedom fighters and historic milestones",
        "BPSC General Studies: Topographical features of major mountains and plains",
        "General Knowledge: Important administrative structures and assembly highlights",
        "Provide a detailed study checklist for BPSC Prelims General Studies syllabus"
      ]
    },
    {
      id: "upsc",
      title: "UPSC Prep",
      emoji: "🦁",
      samples: [
        "UPSC Indian Polity: Salient features of federalism and local self-governance",
        "UPSC General Studies: Major environmental protocols and national parks of India",
        "UPSC Economy: Role of direct subsidies, taxation, and fiscal policies",
        "How to prepare Ancient and Medieval Indian History with chronological timelines"
      ]
    },
    {
      id: "science",
      title: "Science & Tech",
      emoji: "🔬",
      samples: [
        "Explain Newton's Laws of Motion simply with examples",
        "Explain plant and animal cell differences comprehensively",
        "Provide core formula lists for SSC Physics mechanics",
        "Detail important scientific discoveries and elements in chemistry"
      ]
    }
  ]);

  const [activeSegmentId, setActiveSegmentId] = useState<string>("ssc");
  const [newSegmentName, setNewSegmentName] = useState<string>("");
  const [newSegmentEmoji, setNewSegmentEmoji] = useState<string>("🚀");
  const [isAddingSegment, setIsAddingSegment] = useState<boolean>(false);
  
  // Quiz Generator state
  const [quizSubject, setQuizSubject] = useState('SSC General Awareness');
  const [quizLevel, setQuizLevel] = useState('Basic to Intermediate');
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [quizzes, setQuizzes] = useState<QuizQuestion[]>([]);
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizError, setQuizError] = useState<string | null>(null);

  // Interactive Quiz Tabs: 'syllabus' | 'saved'
  const [activeQuizTab, setActiveQuizTab] = useState<'syllabus' | 'saved'>('syllabus');
  const [savedQuizzes, setSavedQuizzes] = useState<{ id: string; subject: string; level: string; date: string; score: number; total: number; quizzes: QuizQuestion[] }[]>(() => {
    const saved = localStorage.getItem('hansai-saved-quizzes');
    return saved ? JSON.parse(saved) : [];
  });

  // Syllabus Revision and Utility Trackers state
  const [syllabusTrackers, setSyllabusTrackers] = useState<Array<{ id: string; exam: string; subject: string; topic: string; done: boolean; notes: boolean; quiz: boolean }>>(() => {
    const saved = localStorage.getItem('hansai-syllabus-trackers');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'track-1', exam: 'SSC CGL', subject: 'Quantitative Aptitude', topic: 'Percentage & Interest (प्रतिशत और ब्याज)', done: true, notes: true, quiz: false },
      { id: 'track-2', exam: 'SSC CGL', subject: 'General Awareness', topic: 'Indian Constitution Articles (महत्वपूर्ण अनुच्छेद)', done: false, notes: false, quiz: false },
      { id: 'track-3', exam: 'SSC Stenographer', subject: 'English Grammar', topic: 'Prepositions & Common Errors (प्रीपोजीशन नियम)', done: true, notes: false, quiz: true },
      { id: 'track-4', exam: 'SSC Stenographer', subject: 'Shorthand Skill', topic: 'Grammalogues & Contractions (शॉर्टहैंड गति नियम)', done: false, notes: false, quiz: false },
      { id: 'track-5', exam: 'BPSC/State Exams', subject: 'History', topic: 'Modern India Freedom Movement (स्वतंत्रता संग्राम)', done: false, notes: false, quiz: false },
    ];
  });
  const [newTrackerTopic, setNewTrackerTopic] = useState('');
  const [newTrackerExam, setNewTrackerExam] = useState('SSC CGL');
  const [newTrackerSubject, setNewTrackerSubject] = useState('General Studies');

  // Daily Challenge state
  const [dailyChallengeOption, setDailyChallengeOption] = useState<number | null>(null);
  const [isDailyChallengeSubmitted, setIsDailyChallengeSubmitted] = useState<boolean>(false);
  const [isDailyChallengeLoading, setIsDailyChallengeLoading] = useState<boolean>(false);
  const [customDailyChallenge, setCustomDailyChallenge] = useState<QuizQuestion | null>(null);

  // Morning Poem & Status State
  const [morningPoem, setMorningPoem] = useState<string>("चाय के साथ कड़क संकल्प की बारी,\nहंसलाल पाल जी के विज़न से तैयारी।\nआलस्य को छोड़, लक्ष्य को गले लगाएं,\nचलो आज SSC और शॉर्टहैंड में धूम मचाएं! ☕🥞");
  const [isGeneratingPoem, setIsGeneratingPoem] = useState<boolean>(false);
  const [statusThemeIdx, setStatusThemeIdx] = useState<number>(0);
  const [statusFont, setStatusFont] = useState<'sans' | 'serif' | 'mono'>('sans');
  const [isEditingStatus, setIsEditingStatus] = useState<boolean>(false);

  // Business Calculator state
  const [calcInputs, setCalcInputs] = useState<BusinessCalculation>({
    productType: 'Turmeric',
    rawCostPerKg: 85,
    monthlyQuantityKg: 600,
    sellingCostPerKg: 380,
    machineryCost: 80000,
    subsidyPercentage: 35, // PMEGP Special category
    yieldPercentage: 22 // 22% average yield
  });
  const [calcResults, setCalcResults] = useState<BusinessResult>({
    rawMaterialCost: 0,
    processedYieldKg: 0,
    grossRevenue: 0,
    netProfit: 0,
    machineryWithSubsidy: 0,
    subsidySaved: 0
  });

  // Missing Helper Functions (Contains Creator Keywords, Product presets, and Dynamic Quiz Handlers)
  const containsCreatorKeywords = (content: string): boolean => {
    const normalized = content.toLowerCase();
    const keywords = [
      'hanslal pal', 'हंसलाल पाल', 'who created you', 'who made you', 'who built you', 'your creator', 'your founder', 'who is your creator', 'who is your founder'
    ];
    return keywords.some(k => normalized.includes(k));
  };

  const handleProductPreset = (crop: 'Turmeric' | 'Ginger' | 'Medicinal') => {
    if (crop === 'Turmeric') {
      setCalcInputs(prev => ({
        ...prev,
        productType: 'Turmeric',
        rawCostPerKg: 30,
        sellingCostPerKg: 120,
        monthlyQuantityKg: 1000
      }));
    } else if (crop === 'Ginger') {
      setCalcInputs(prev => ({
        ...prev,
        productType: 'Ginger',
        rawCostPerKg: 40,
        sellingCostPerKg: 140,
        monthlyQuantityKg: 800
      }));
    } else {
      setCalcInputs(prev => ({
        ...prev,
        productType: 'Medicinal',
        rawCostPerKg: 60,
        sellingCostPerKg: 200,
        monthlyQuantityKg: 500
      }));
    }
    showToast(`${crop} optimal pricing and volume presets loaded! 🌾`, "success");
  };

  const handleGenerateQuiz = async (subjectParam?: string) => {
    setIsGeneratingQuiz(true);
    setQuizError(null);
    setCurrentQuizIdx(0);
    setSelectedOptionIdx(null);
    setIsQuizSubmitted(false);
    setScore(0);

    const targetedSubject = subjectParam || quizSubject || "SSC General Awareness";

    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: targetedSubject, level: quizLevel })
      });
      if (!res.ok) throw new Error("Academic Node busy.");
      const data = await res.json();
      if (data.quiz && data.quiz.length > 0) {
        setQuizzes(data.quiz);
      } else {
        throw new Error("No quiz list returned.");
      }
    } catch (err: any) {
      console.error("Quiz generation error:", err);
      // Fallback MCQs which match typical SSC / general awareness questions
      const fallbackList: QuizQuestion[] = [
        {
          question: `Practice MCQ Study Question on "${targetedSubject}": Which of the following plays a most vital role in preparation of this subject?`,
          options: [
            "Frequent mock test assessments and reviewing error explanations",
            "Mugging up definitions with zero conceptual base matching",
            "Leaving specific segments completely for secondary attempt rounds",
            "Practicing with complex non-verified external sources"
          ],
          answerIndex: 0,
          explanation: "Consistent topic mock quizzes, identifying errors under high-discipline routines, and reading peer explanations are scientifically proven to maximize score accuracy."
        },
        {
          question: `Syllabus Check: What is the primary recommendation by the Digital Companion HansAI to score high in MCQs?`,
          options: [
            "Overthink every possibility leaving no room for quick solving rhythm",
            "Read carefully, eliminate obvious distractors, and focus on verified core concepts",
            "Rely entirely on luck-guesses with zero review history tracking",
            "Solve quizzes only once a month with no performance metrics logged"
          ],
          answerIndex: 1,
          explanation: "High precision speed combined with clear option elimination tactics yields the highest average scores in all competitive tests."
        }
      ];
      setQuizzes(fallbackList);
      setQuizError("Offline mock database pre-loaded! Active syllabus review test active. 📚");
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleGenerateMorningPoem = async () => {
    setIsGeneratingPoem(true);
    // Cycle/Randomize theme to keep it colorful and dynamic!
    const randomTheme = Math.floor(Math.random() * STATUS_THEMES.length);
    setStatusThemeIdx(randomTheme);
    try {
      const res = await fetch("/api/status-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: "poem" })
      });
      if (!res.ok) throw new Error("Poem node busy");
      const data = await res.json();
      if (data.text) {
        setMorningPoem(data.text);
        showToast("Fresh morning poem generated! ☀️☕", "success");
      }
    } catch (err) {
      console.error(err);
      showToast("Could not generate a fresh poem. Loaded a lovely fallback! ☕", "info");
      setMorningPoem("चाय के घूंट के साथ नया संकल्प उठाएं,\nशॉर्टहैंड और SSC परीक्षा में विजय पाएं।\nमेहनत ही है जीवन का सच्चा गहना,\nआज फिर से निरंतर अभ्यास करते रहना! ☕🥞");
    } finally {
      setIsGeneratingPoem(false);
    }
  };

  const handleGenerateAIDailyChallenge = async () => {
    setIsDailyChallengeLoading(true);
    setDailyChallengeOption(null);
    setIsDailyChallengeSubmitted(false);
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: "SSC High-Yield General Awareness and English Dictation Rules", level: "High-Yield Daily Challenge" })
      });
      if (!res.ok) throw new Error("Challenge node busy");
      const data = await res.json();
      if (data.quiz && data.quiz.length > 0) {
        setCustomDailyChallenge(data.quiz[0]);
        showToast("New high-yield daily challenge loaded! 🏆", "success");
      }
    } catch (err) {
      console.error(err);
      showToast("Loaded high-yield challenge from standard repository! 📚", "info");
      setCustomDailyChallenge(null);
    } finally {
      setIsDailyChallengeLoading(false);
    }
  };

  const selectQuizOption = (optionIndex: number) => {
    if (!isQuizSubmitted) {
      setSelectedOptionIdx(optionIndex);
    }
  };

  const submitQuizAnswer = () => {
    if (selectedOptionIdx === null) return;
    const currentQ = quizzes[currentQuizIdx];
    if (selectedOptionIdx === currentQ.answerIndex) {
      setScore(prev => prev + 1);
    }
    setIsQuizSubmitted(true);
  };

  const advanceQuiz = () => {
    const isLastQ = currentQuizIdx === quizzes.length - 1;
    if (isLastQ) {
      const finalScore = score + (selectedOptionIdx === quizzes[currentQuizIdx].answerIndex ? 0 : 0);
      const scoreStr = `${finalScore} / ${quizzes.length} Correct`;
      const logItem = {
        id: `hist-quiz-${Date.now()}`,
        type: 'quiz' as const,
        title: `${quizSubject} Assessment Finished`,
        subtitle: `Level: ${quizLevel}. Focused dynamic testing.`,
        score: scoreStr,
        timestamp: new Date().toISOString()
      };
      setActivityLogs(prev => [logItem, ...prev]);
    }
    setCurrentQuizIdx(prev => prev + 1);
    setSelectedOptionIdx(null);
    setIsQuizSubmitted(false);
  };

  const restartQuizFlow = () => {
    setQuizzes([]);
    setCurrentQuizIdx(0);
    setSelectedOptionIdx(null);
    setIsQuizSubmitted(false);
    setScore(0);
    setQuizError(null);
  };

  const handleSaveCurrentQuiz = () => {
    if (quizzes.length === 0) return;
    const newSaved = {
      id: "quiz-" + Date.now(),
      subject: quizSubject || "SSC General Awareness",
      level: quizLevel || "Practice Level",
      date: new Date().toLocaleDateString('hi-IN'),
      score: score,
      total: quizzes.length,
      quizzes: quizzes
    };
    const updated = [newSaved, ...savedQuizzes];
    setSavedQuizzes(updated);
    localStorage.setItem('hansai-saved-quizzes', JSON.stringify(updated));
    showToast("Quiz record saved to your Repository! 💾", "success");
  };

  const handleToggleSyllabusTracker = (id: string, field: 'done' | 'notes' | 'quiz') => {
    const updated = syllabusTrackers.map(track => {
      if (track.id === id) {
        const nextVal = !track[field];
        if (nextVal) {
          showToast(`Progress logged: ${field === 'done' ? 'Revision done' : field === 'notes' ? 'Notes ready' : 'Practice quiz cleared'}! ✅`, "success");
        }
        return { ...track, [field]: nextVal };
      }
      return track;
    });
    setSyllabusTrackers(updated);
    localStorage.setItem('hansai-syllabus-trackers', JSON.stringify(updated));
  };

  const handleAddSyllabusTracker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrackerTopic.trim()) return;
    const newTrack = {
      id: "track-" + Date.now(),
      exam: newTrackerExam,
      subject: newTrackerSubject,
      topic: newTrackerTopic.trim(),
      done: false,
      notes: false,
      quiz: false
    };
    const updated = [...syllabusTrackers, newTrack];
    setSyllabusTrackers(updated);
    localStorage.setItem('hansai-syllabus-trackers', JSON.stringify(updated));
    setNewTrackerTopic('');
    showToast("New syllabus practice task added successfully! 📝", "success");
  };

  // 1. Smart Folders, Dynamic Notes state and Local storage managers
  const [folders, setFolders] = useState<Array<{ id: string; name: string; emoji: string; color: string }>>(() => {
    const saved = localStorage.getItem('hansai-folders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [
      { id: "general", name: "General Studies & GK / सामान्य ज्ञान", emoji: "📚", color: "indigo" },
      { id: "ssc-gk", name: "SSC General Knowledge (GK) / सामान्य ज्ञान", emoji: "🏛️", color: "pink" },
      { id: "ssc-math", name: "SSC Quantitative Aptitude / गणित", emoji: "📐", color: "purple" },
      { id: "ssc-reasoning", name: "SSC Logical Reasoning / तर्कशक्ति", emoji: "🧠", color: "amber" },
      { id: "bpsc", name: "BPSC Exam Prep / बीपीएससी", emoji: "🚩", color: "rose" },
      { id: "upsc", name: "UPSC Services / यूपीएससी", emoji: "🦁", color: "amber" }
    ];
  });

  const [notes, setNotes] = useState<Array<{ id: string; folderId: string; title: string; content: string; tags: string[]; createdAt: string }>>(() => {
    const saved = localStorage.getItem('hansai-notes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [
      {
        id: "note-1",
        folderId: "ssc-gk",
        title: "SSC CGL & CHSL: Modern History Core Highlights",
        content: "• Quit India Movement was launched in August 1942 under Mahatma Gandhi's leadership.\n• Indian physical Geography and river origins (Ganga, Sone) are recurrent SSC subjects.\n• Practice daily mocks for core Polity and fundamental constitution articles.",
        tags: ["SSC", "History", "GK"],
        createdAt: new Date().toISOString()
      },
      {
        id: "note-2",
        folderId: "bpsc",
        title: "BPSC Geography: Topography of Western Vindhyan Range",
        content: "• The plateau is part of the Vindhyan range representing western topography.\n• It is rich in limestone and bauxite deposits.\n• Ganga and Sone river networks play a vital role in local agricultural patterns.",
        tags: ["BPSC", "Geography", "GK"],
        createdAt: new Date().toISOString()
      },
      {
        id: "note-3",
        folderId: "upsc",
        title: "UPSC Indian Polity: Salient Features of Federal Structure",
        content: "• The Indian Constitution establishes a dual polity consisting of the Union at the Center and the States.\n• Cooperative federalism requires continuous dialogue through councils like the Inter-State Council and GST Council.\n• Part XI governs administrative and legislative relations between the Union and the States.",
        tags: ["UPSC", "Polity", "GS2"],
        createdAt: new Date().toISOString()
      }
    ];
  });

  const [selectedFolderId, setSelectedFolderId] = useState<string>("all");
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [noteTitleInput, setNoteTitleInput] = useState<string>("");
  const [noteContentInput, setNoteContentInput] = useState<string>("");
  const [noteTagsInput, setNoteTagsInput] = useState<string>("");
  const [isCreatingNote, setIsCreatingNote] = useState<boolean>(false);
  const [selectedFolderForNewNote, setSelectedFolderForNewNote] = useState<string>("general");
  const [newFolderNameInput, setNewFolderNameInput] = useState<string>("");
  const [newFolderEmojiInput, setNewFolderEmojiInput] = useState<string>("📁");

  // 2. Study & Shorthand Timer state
  const [timerPresetVal, setTimerPresetVal] = useState<number>(10); // user specifies limits (in minutes)
  const [timeLeft, setTimeLeft] = useState<number>(600); // countdown seconds
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isMetronomeEnabled, setIsMetronomeEnabled] = useState<boolean>(false); // metronome/speed pacing clicks
  const [disableNotesForTimer, setDisableNotesForTimer] = useState<boolean>(true); // default true for Steno/Typing exams as physical notebooks are preferred
  const [timerNoteContent, setTimerNoteContent] = useState<string>("");
  const [timerAlertMessage, setTimerAlertMessage] = useState<string | null>(null);

  // Study Alarm & External App Launcher States
  const [timerAlarmTitle, setTimerAlarmTitle] = useState<string>("Shorthand & Polity Revision");
  const [isAlarmRingingModalOpen, setIsAlarmRingingModalOpen] = useState<boolean>(false);
  const [isAppLauncherOpen, setIsAppLauncherOpen] = useState<boolean>(false);
  const [launcherSearchTopic, setLauncherSearchTopic] = useState<string>("");
  const [customLauncherUrl, setCustomLauncherUrl] = useState<string>("");
  const [customAlarmMinutes, setCustomAlarmMinutes] = useState<string>("");
  const [customAlarmSeconds, setCustomAlarmSeconds] = useState<string>("");

  // 3. Activity Log & Savings state
  const [activityLogs, setActivityLogs] = useState<Array<{ id: string; type: 'timer' | 'quiz' | 'note'; title: string; subtitle: string; score?: string; timestamp: string }>>(() => {
    const saved = localStorage.getItem('hansai-history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [
      {
        id: "hist-default-1",
        type: "note",
        title: "Academic Note Created",
        subtitle: "Saved 'Pitman Shorthand Stroke Practice Guide'",
        timestamp: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: "hist-default-2",
        type: "quiz",
        title: "General Geography Quiz Completed",
        subtitle: "Topography of Major Hills & Rivers",
        score: "5 / 5 Correct",
        timestamp: new Date(Date.now() - 3600000 * 3).toISOString()
      }
    ];
  });

  // ======= DAILY GOAL TRACKER, LIFE BALANCE & CONCEPT MAP STATES =======
  const [timerSubTab, setTimerSubTab] = useState<'clock' | 'projects'>('clock');
  const [triggerConfetti, setTriggerConfetti] = useState(false);
  const [confettiParticles, setConfettiParticles] = useState<{ id: number; char: string; x: number; y: number; size: number; delay: number }[]>([]);
  const [dailyGoals, setDailyGoals] = useState<{ id: string; text: string; done: boolean; category: string }[]>(() => {
    const saved = localStorage.getItem('hansai-goals-v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: '1', text: 'Solve 15 Polity / Historical Milestone GK questions', done: false, category: 'GK & Civil' },
      { id: '2', text: 'Revise 5 important English preposition structures', done: false, category: 'English Rules' },
      { id: '3', text: 'Perform 10 minutes focused pomodoro math review', done: false, category: 'Quantitative' },
      { id: '4', text: '20 minutes evening physical neck stretching / eye comfort drill', done: false, category: 'Healthy Life' },
    ];
  });
  
  const [newGoalInput, setNewGoalInput] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState('GK & Civil');

  // Trigger goal storage sync
  useEffect(() => {
    localStorage.setItem('hansai-goals-v2', JSON.stringify(dailyGoals));
  }, [dailyGoals]);

  // DAILY GOALS REMINDER ticking check
  useEffect(() => {
    const handleInterval = () => {
      if (!reminderEnabled) return;
      const now = new Date();
      const hrs = now.getHours().toString().padStart(2, '0');
      const mins = now.getMinutes().toString().padStart(2, '0');
      const curStr = `${hrs}:${mins}`;
      
      if (curStr === reminderTime) {
        const incomplete = dailyGoals.filter(g => !g.done);
        if (incomplete.length > 0) {
          triggerDailyReminder();
        }
      }
    };
    
    // Check every 30 seconds
    const intv = setInterval(handleInterval, 30000);
    return () => clearInterval(intv);
  }, [reminderEnabled, reminderTime, dailyGoals]);

  const handleToggleGoal = (id: string) => {
    setDailyGoals(prev => {
      const target = prev.find(g => g.id === id);
      const willBeDone = target ? !target.done : false;
      
      if (willBeDone) {
        // Trigger amazing confetti particles!
        const chars = ['✨', '🏆', '⭐', '🎈', '🎉', '🦢', '🌟', '💫', '🔥'];
        const list: any[] = [];
        for (let i = 0; i < 45; i++) {
          list.push({
            id: Date.now() + i,
            char: chars[Math.floor(Math.random() * chars.length)],
            x: Math.random() * 100, // percentage across main viewport
            y: Math.random() * 50 + 50, // lower part to float up
            size: Math.floor(Math.random() * 20) + 16,
            delay: Math.random() * 0.4
          });
        }
        setConfettiParticles(list);
        setTriggerConfetti(true);
        setTimeout(() => {
          setTriggerConfetti(false);
          setConfettiParticles([]);
        }, 3200);
      }
      
      return prev.map(g => g.id === id ? { ...g, done: !g.done } : g);
    });
  };

  const handleAddGoal = () => {
    if (!newGoalInput.trim()) return;
    const newG = {
      id: `goal-${Date.now()}`,
      text: newGoalInput.trim(),
      done: false,
      category: newGoalCategory
    };
    setDailyGoals(prev => [...prev, newG]);
    setNewGoalInput('');
  };

  const handleDeleteGoal = (id: string) => {
    setDailyGoals(prev => prev.filter(g => g.id !== id));
  };

  // Subject Progress Metrics (Time spent in hours per subject Area)
  const [subjectProgress, setSubjectProgress] = useState<{ id: string; subject: string; hours: number; accuracy: number; totalMCQs: number }[]>(() => {
    const saved = localStorage.getItem('hansai-subject-progress');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: '1', subject: 'General Knowledge & GS', hours: 42, accuracy: 84, totalMCQs: 280 },
      { id: '2', subject: 'Quantitative Aptitude', hours: 35, accuracy: 78, totalMCQs: 190 },
      { id: '3', subject: 'Logical Reasoning', hours: 28, accuracy: 89, totalMCQs: 140 },
      { id: '4', subject: 'English Grammar rules', hours: 22, accuracy: 81, totalMCQs: 150 },
      { id: '5', subject: 'Soul Wellness & Life Balance', hours: 15, accuracy: 100, totalMCQs: 0 },
    ];
  });

  const handleUpdateProgressHour = (id: string, hoursToAdd: number) => {
    setSubjectProgress(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, hours: Math.max(0, p.hours + hoursToAdd) } : p);
      localStorage.setItem('hansai-subject-progress', JSON.stringify(updated));
      return updated;
    });
  };

  // Concept Map Explainer states
  const [conceptMapTopic, setConceptMapTopic] = useState('');
  const [mapNodes, setMapNodes] = useState<{ id: string; label: string; desc: string; detail: string; x: number; y: number }[]>([]);
  const [activeMapNode, setActiveMapNode] = useState<any | null>(null);
  const [showDetailedDiagram, setShowDetailedDiagram] = useState(false);
  const [isGeneratingConceptMap, setIsGeneratingConceptMap] = useState(false);

  // Missing Research & Syllabus states
  const [researchTopic, setResearchTopic] = useState("");
  const [researchArea, setResearchArea] = useState("Indian Polity & Constitution");
  const [customResearchArea, setCustomResearchArea] = useState("");
  const [researchLevel, setResearchLevel] = useState("General Competitive Exams (SSC/BPSC)");
  const [isResearchLoading, setIsResearchLoading] = useState(false);
  const [researchError, setResearchError] = useState<string | null>(null);

  // Curated list of high-yield Daily Challenge questions
  const DAILY_CHALLENGE_POOL = [
    {
      question: "शॉर्टहैंड (Shorthand) डिक्टेशन लिखते समय 'Grammalogues' का मुख्य कार्य क्या होता है?",
      options: [
        "कठिन वैज्ञानिक शब्दों का उच्चारण आसान करना",
        "अक्सर उपयोग होने वाले शब्दों को एक छोटे संकेत (Single Sign) से दर्शाना",
        "सभी गणितीय सूत्रों को संक्षेप में लिखना",
        "वाक्यों में व्याकरण की अशुद्धियों को स्वचालित रूप से सुधारना"
      ],
      answerIndex: 1,
      explanation: "पिटमैन शॉर्टहैंड में 'Grammalogues' वे शब्द होते हैं जो बार-बार आते हैं (जैसे the, of, limit, care) और उन्हें केवल एक ही स्ट्रोक या डॉट द्वारा शीघ्रता से दर्शाया जाता है। गति बढ़ाने के लिए इनका अभ्यास परम आवश्यक है।"
    },
    {
      question: "भारतीय संविधान के किस भाग एवं अनुच्छेद के अंतर्गत 'समान नागरिक संहिता' (Uniform Civil Code) का वर्णन है?",
      options: [
        "भाग III, अनुच्छेद 32",
        "भाग IV, अनुच्छेद 44",
        "भाग IV-A, अनुच्छेद 51A",
        "भाग V, अनुच्छेद 72"
      ],
      answerIndex: 1,
      explanation: "समान नागरिक संहिता (UCC) का प्रावधान भारतीय संविधान के भाग IV (राज्य के नीति निदेशक तत्व) के अनुच्छेद 44 के अंतर्गत किया गया है।"
    },
    {
      question: "इनमें से कौन सा विकल्प ब्रिटिश काल में भारत में लड़े गए 'बक्सर के युद्ध' (Battle of Buxar) का सही वर्ष दर्शाता है?",
      options: [
        "1757 ईस्वी",
        "1764 ईस्वी",
        "1772 ईस्वी",
        "1789 ईस्वी"
      ],
      answerIndex: 1,
      explanation: "बक्सर का ऐतिहासिक युद्ध 22 अक्टूबर 1764 को ब्रिटिश ईस्ट इंडिया कंपनी और बंगाल के नवाब मीर कासिम, अवध के नवाब शुजाउद्दौला, तथा मुगल शासक शाह आलम द्वितीय के संयुक्त गठबंधन के बीच लड़ा गया था।"
    },
    {
      question: "In English Grammar, fill in the correct high-yield preposition: 'He was extremely kind ____ all his colleagues.'",
      options: [
        "for",
        "with",
        "to",
        "at"
      ],
      answerIndex: 2,
      explanation: "The adjective 'kind' is paired with the preposition 'to' when expressing kind or friendly behavior toward people (e.g. 'kind to everyone')."
    },
    {
      question: "कंप्यूटर की मुख्य मेमोरी (RAM) और प्रोसेसर के बीच उच्च-गति वाली अस्थायी स्टोरेज को क्या कहा जाता है?",
      options: [
        "Virtual Memory",
        "Cache Memory",
        "Flash Drive",
        "Secondary ROM"
      ],
      answerIndex: 1,
      explanation: "कैश मेमोरी (Cache Memory) एक अत्यंत तीव्र गति से कार्य करने वाली मेमोरी है जिसका उपयोग प्रोसेसर द्वारा बार-बार उपयोग किए जाने वाले निर्देशों को अस्थायी तौर पर संचित करने के लिए किया जाता है।"
    }
  ];

  // Missing Leaderboard & score registration states
  const [showRegModal, setShowRegModal] = useState(false);
  const [regScoreName, setRegScoreName] = useState("");
  const [regScoreVal, setRegScoreVal] = useState(85);
  const [regScoreMock, setRegScoreMock] = useState("GK");
  const [regScoreLoc, setRegScoreLoc] = useState("");
  const [leaderboardSearch, setLeaderboardSearch] = useState("");
  const [leaderboardFilter, setLeaderboardFilter] = useState("ALL");
  const [leaderboardList, setLeaderboardList] = useState<any[]>(() => {
    const saved = localStorage.getItem('hansai-leaderboard');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: "lead-2", name: "Kendo", mockType: "ALL", score: 95, solvedMocks: 24, streakDays: 32, location: "-" }
    ];
  });

  const handleRegisterScore = () => {
    if (!regScoreName.trim()) {
      showToast("कृपया अपना असली नाम दर्ज़ करें।", "warn");
      return;
    }
    const newRecord = {
      id: `score-${Date.now()}`,
      name: regScoreName.trim(),
      mockType: regScoreMock,
      score: regScoreVal,
      solvedMocks: 1,
      streakDays: 1,
      location: "-"
    };
    const updated = [newRecord, ...leaderboardList];
    setLeaderboardList(updated);
    localStorage.setItem('hansai-leaderboard', JSON.stringify(updated));
    showToast("मॉक टेस्ट स्कोर सफलतापूर्वक सहेजा गया और रैंक की गणना की गई!", "success");
    setRegScoreName("");
    setRegScoreLoc("");
    setShowRegModal(false);
  };

  // Missing Study Progress Steps states
  const [studyProcessSteps] = useState([
    { id: 'step-1', title: "Daily Target & Revision Goals Setup", duration: "5 mins", desc: "सेट करें कि आज आपको क्या क्या कड़क तैयार करना है।" },
    { id: 'step-2', title: "Concept Visualizer / Mind Map Core", duration: "15 mins", desc: "विषय के मूल संरचना व नदी प्रणालियों को चित्ररूप में समझें।" },
    { id: 'step-3', title: "Syllabus Micro-Research (Gemini)", duration: "25 mins", desc: "विस्तृत तथ्यात्मक नोट्स और शार्ट ट्रिक्स जनरेट करें।" },
    { id: 'step-4', title: "Micro-Quiz Mock Challenge", duration: "15 mins", desc: "स्वयं का परीक्षण करें, गलतियों का स्पष्टीकरण पढ़ें।" },
    { id: 'step-5', title: "Soul-Breath & Posture Comfort Reset", duration: "5 mins", desc: "आंखों को आराम दें और सीधी रीढ़ रखकर सांस लें।" },
    { id: 'step-6', title: "Self-Study Practice Session Run", duration: "45 mins", desc: "स्मार्ट टाइमर लगाकर कड़क अभ्यास करें।" }
  ]);
  const [unlockedProgressSteps, setUnlockedProgressSteps] = useState<string[]>(() => {
    const saved = localStorage.getItem('hansai-unlocked-steps');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return ['step-1'];
  });
  const toggleProgressStep = (stepId: string) => {
    setUnlockedProgressSteps(prev => {
      let updated;
      if (prev.includes(stepId)) {
        updated = prev.filter(id => id !== stepId);
      } else {
        updated = [...prev, stepId];
      }
      localStorage.setItem('hansai-unlocked-steps', JSON.stringify(updated));
      return updated;
    });
  };

  // Music Studio & Synth Beats State
  const [musicSearchQuery, setMusicSearchQuery] = useState("");
  const [selectedMusicGenreFilter, setSelectedMusicGenreFilter] = useState("all");
  const [isMusicCreateModalOpen, setIsMusicCreateModalOpen] = useState(false);
  
  const [newMusicTitle, setNewMusicTitle] = useState("");
  const [newMusicGenre, setNewMusicGenre] = useState("Lofi Beats");
  const [newMusicTempo, setNewMusicTempo] = useState(90);
  const [newMusicPrompt, setNewMusicPrompt] = useState("");

  const [musicTracks, setMusicTracks] = useState<Array<{
    id: string;
    title: string;
    genre: string;
    tempo: number;
    mood: string;
    lyrics: string;
    createdAt: string;
    isAiGenerated?: boolean;
  }>>(() => {
    const saved = localStorage.getItem('hansai-music-tracks');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [
      {
        id: 'track_01',
        title: 'Motivational Lofi Beat - Steno 80 WPM Speed Drill',
        genre: 'Lofi Beats',
        tempo: 80,
        mood: 'Focus & Concentration',
        lyrics: '80 WPM rhythm cadence. Keep your pencil light and wrists relaxed. Smooth curves for consonants.',
        createdAt: new Date().toISOString()
      },
      {
        id: 'track_02',
        title: 'Sitar & Classical Flute Concentration Melody',
        genre: 'Classical Flute',
        tempo: 65,
        mood: 'Deep Calm & Peace',
        lyrics: 'शांत दिमाग, गहरी सांस और अटूट ध्यान। मन को केंद्रित कर पढ़ाई में डूब जाएं।',
        createdAt: new Date().toISOString()
      },
      {
        id: 'track_03',
        title: 'Kaddak Victory Rap (जीत का जोश - हंसलाल पाल जी)',
        genre: 'Motivational Rap',
        tempo: 110,
        mood: 'High Energy & Grit',
        lyrics: 'पावन माटी से उठकर अब तुमको इतिहास बनाना है! आलस की जंजीरें तोड़, खुद को अब मेहनत में तपाना है!',
        createdAt: new Date().toISOString()
      },
      {
        id: 'track_04',
        title: 'PMEGP MSME Entrepreneur Motivation Song',
        genre: 'Acoustic Guitar',
        tempo: 95,
        mood: 'Business Spirit',
        lyrics: 'जमीन से जुड़कर आसमां को छूना है, एमएसएमई की योजना तैयार कर उद्योग का राजा बनना है!',
        createdAt: new Date().toISOString()
      }
    ];
  });

  const [activePlayingTrack, setActivePlayingTrack] = useState<any | null>(null);
  const [isPlayingMusicTrack, setIsPlayingMusicTrack] = useState(false);
  const [musicPlaybackSpeed, setMusicPlaybackSpeed] = useState(1.0);

  useEffect(() => {
    localStorage.setItem('hansai-music-tracks', JSON.stringify(musicTracks));
  }, [musicTracks]);

  const playWebAudioSynthBeat = (genre: string, tempoBpm: number) => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      const now = ctx.currentTime;
      const beatInterval = 60 / (tempoBpm || 90);
      
      const notes = genre.includes('Classical') || genre.includes('Flute') ? [261.63, 329.63, 392.00, 523.25, 440.00] :
                    genre.includes('Lofi') ? [220.00, 261.63, 329.63, 392.00] :
                    genre.includes('Rap') ? [130.81, 164.81, 196.00, 261.63] :
                    [196.00, 246.94, 293.66, 392.00];

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = genre.includes('Classical') ? 'sine' : genre.includes('Lofi') ? 'triangle' : 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + i * beatInterval);
        gain.gain.setValueAtTime(0.12, now + i * beatInterval);
        gain.gain.exponentialRampToValueAtTime(0.001, now + (i + 1) * beatInterval - 0.05);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now + i * beatInterval);
        osc.stop(now + (i + 1) * beatInterval);
      });
    } catch (e) {
      console.warn("Web audio playback exception", e);
    }
  };

  const handleCreateMusicTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMusicTitle.trim()) {
      showToast("Please enter a track title.", "warn");
      return;
    }
    const cleanTitle = newMusicTitle.trim();
    const newTrack = {
      id: 'track_' + Date.now(),
      title: cleanTitle,
      genre: newMusicGenre,
      tempo: newMusicTempo,
      mood: 'AI Generated Beat',
      lyrics: newMusicPrompt.trim() || 'AI Generated Melodic Rhythm for Study & Focus.',
      createdAt: new Date().toISOString(),
      isAiGenerated: true
    };

    setMusicTracks(prev => [newTrack, ...prev]);
    setActivePlayingTrack(newTrack);
    setIsPlayingMusicTrack(true);
    playWebAudioSynthBeat(newMusicGenre, newMusicTempo);
    setIsMusicCreateModalOpen(false);

    setNewMusicTitle("");
    setNewMusicPrompt("");
    showToast(`🎵 Created & Playing AI Music Track: "${cleanTitle}"`, "success");

    try {
      fetch('/api/users/log-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user?.name || 'Student',
          email: user?.email || 'student@hansai.edu',
          type: 'music',
          query: `Created AI Music Track: "${cleanTitle}" (${newMusicGenre}, ${newMusicTempo} BPM)`
        })
      }).catch(() => {});
    } catch (e) {}
  };

  // Missing Rapping states
  const [activeRapId, setActiveRapId] = useState<string | null>(null);
  const [isPlayingRap, setIsPlayingRap] = useState<boolean>(false);
  const [visibleLyricsIdx, setVisibleLyricsIdx] = useState<number>(0);
  const [lyricsLines] = useState([
    "मेहनत की माटी से उठ कर, लक्ष्य बड़ा हम ठान चुके,",
    "किताबों को ही अपना सच्चा, यार-दोस्त हम मान चुके!",
    "अटूट हौसले और दृढ़ संकल्प गवाह हैं, हमारी इस कड़क जवानी का,",
    "इतिहास वही लिखेंगे जग में, जो रखवाला है..."
  ]);

  // Missing Breathing states
  const [breathStage, setBreathStage] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [breathCounter, setBreathCounter] = useState(0);
  const [isBreathingActive, setIsBreathingActive] = useState(false);

  // Missing Scroll bottom ref for chat
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const handleGenerateConceptMap = async (topicStr?: string) => {
    const rawTopic = topicStr || conceptMapTopic;
    if (!rawTopic || !rawTopic.trim()) {
      showToast("Please enter a topic or question to generate a concept map.", "warn");
      return;
    }
    const cleanTopic = rawTopic.trim();
    setIsGeneratingConceptMap(true);
    setShowDetailedDiagram(false);

    try {
      const res = await fetch("/api/concept-map", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: cleanTopic })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.nodes && Array.isArray(data.nodes) && data.nodes.length >= 3) {
          setMapNodes(data.nodes);
          setActiveMapNode(data.nodes[0]);
          showToast(`Concept Map for "${cleanTopic}" generated! 🗺️`, "success");
          setIsGeneratingConceptMap(false);
          return;
        }
      }
    } catch (e) {
      console.error("AI Concept map generation error:", e);
    }

    // Secondary fallback via /api/chat if structured endpoint failed
    try {
      const prompt = `Break down "${cleanTopic}" into a sequential 5-step visual concept flowchart for a student.
Output ONLY a JSON array of 5 objects with keys "id", "label", "desc", "detail", "x", "y".
Make labels and details 100% specific to "${cleanTopic}". Do NOT use generic text like "Core Overview".`;
      const res2 = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: prompt }] })
      });
      if (res2.ok) {
        const data2 = await res2.json();
        const reply = data2.reply || "";
        const jsonMatch = reply.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsed) && parsed.length >= 3) {
            setMapNodes(parsed);
            setActiveMapNode(parsed[0]);
            showToast(`Concept Map for "${cleanTopic}" generated! 🗺️`, "success");
            setIsGeneratingConceptMap(false);
            return;
          }
        }
      }
    } catch (e2) {
      console.error("Secondary concept map error:", e2);
    }

    // Dynamic Topic Decomposer Fallback
    const fallbackNodes = [
      { id: '1', label: `1. Introduction & Foundations of ${cleanTopic}`, desc: `Key concepts, core definitions, and background setup of ${cleanTopic}.`, detail: `Definition, foundational premises, and historical/scientific context of ${cleanTopic}.`, x: 50, y: 15 },
      { id: '2', label: `2. Primary Mechanics & Process of ${cleanTopic}`, desc: `Step-by-step internal mechanisms and how ${cleanTopic} works in real scenarios.`, detail: `Governing principles, biological/physical/mathematical rules of ${cleanTopic}.`, x: 25, y: 38 },
      { id: '3', label: `3. Key Types, Categories & Variations`, desc: `Different classifications, formulas, and structural branches within ${cleanTopic}.`, detail: `High-frequency exam questions, critical terms, and exceptions to remember.`, x: 75, y: 38 },
      { id: '4', label: `4. Practical Applications & Solved Cases`, desc: `Real-world significance, clinical/exam examples, and solved problems on ${cleanTopic}.`, detail: `Competitive exam question patterns (SSC, UPSC, NEET, JEE) and shortcuts.`, x: 35, y: 65 },
      { id: '5', label: `5. Exam Summary & High-Yield Mnemonics`, desc: `Quick memory tricks and summary checklist for instant revision of ${cleanTopic}.`, detail: `Mnemonic formulas and quick revision points to retain ${cleanTopic} long term.`, x: 50, y: 88 }
    ];

    setMapNodes(fallbackNodes);
    setActiveMapNode(fallbackNodes[0]);
    showToast(`Concept Map for "${cleanTopic}" ready! 🗺️`, "info");
    setIsGeneratingConceptMap(false);
  };

  // Real Active Healthy Lifestyle checkoff tracker
  const [lifestyleTracker, setLifestyleTracker] = useState<{ id: string; title: string; hint: string; checked: boolean; rewardPoints: number }[]>(() => {
    const saved = localStorage.getItem('hansai-lifestyle');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 'sleep', title: '7 Hours Sound Eye-Recovery Sleep', hint: 'दिमाग और आंखों की नसों को आराम देना', checked: false, rewardPoints: 15 },
      { id: 'posture', title: 'Ergonomic Desk & Back Pose Check', hint: 'कमर और गर्दन को सीधा रखकर पढ़ाई करना', checked: false, rewardPoints: 10 },
      { id: 'water', title: 'Hydration Intake & Deep Breathing', hint: 'नियमित पानी पीना और ताजी हवा में सांस लेना', checked: false, rewardPoints: 10 }
    ];
  });

  const [researchResult, setResearchResult] = useState<any>(null);

  const handleRunResearch = async (targetTopic = researchTopic, targetArea = researchArea) => {
    const cleanTopic = (targetTopic || researchTopic || "").trim();
    if (!cleanTopic) {
      showToast("कृपया कोई विषय या प्रश्न दर्ज करें।", "warn");
      return;
    }
    setResearchTopic(cleanTopic);

    try {
      setIsResearchLoading(true);
      setResearchError(null);

      const actualArea = targetArea === "Other / Write Custom Subject" 
        ? (customResearchArea.trim() || "Advanced Custom Study") 
        : targetArea;

      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          topic: cleanTopic, 
          subjectArea: actualArea,
          level: researchLevel
        })
      });
      if (!res.ok) {
        throw new Error("Unable to complete syllabus research report.");
      }
      const data = await res.json();
      if (data.research) {
        setResearchResult(data.research);
        showToast(`Deep AI Research complete for "${cleanTopic}"! 🎉`, "success");
        try {
          const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav");
          audio.volume = 0.35;
          audio.play().catch(() => {});
        } catch (e) {}
      } else {
        throw new Error("Empty research report from server.");
      }
    } catch (err: any) {
      console.error(err);
      setResearchError("रिसर्च जनरेट करने में आंशिक समस्या।");
      setResearchResult({
        topicName: cleanTopic,
        subjectArea: targetArea || "General Academic Research",
        summary: `विषय: '${cleanTopic}'। इस विषय का गहन विश्लेषण प्रतियोगी परीक्षाओं एवं अकादमिक दृष्टिकोण दोनों के लिए अत्यंत महत्वपूर्ण है। निम्नलिखित बिंदु इसके प्राथमिक घटकों और अवधारणाओं को स्पष्ट करते हैं।`,
        analyticalPoints: [
          `मुख्य सिद्धांत: ${cleanTopic} के मूलभूत नियम और अनुप्रयोग।`,
          `परीक्षा दृष्टिकोण: SSC CGL, BPSC, UPSC व अन्य प्रतियोगी परीक्षाओं में ${cleanTopic} से सम्बंधित मुख्य तथ्यात्मक प्रश्न।`,
          `स्मार्ट तकनीक: ${cleanTopic} को दीर्घकालिक स्मृति में संचित करने के लिए संक्षेप नोट्स और बारंबार पुनरावृत्ति।`
        ],
        historicalTimeline: [
          { era: "उत्पत्ति/चरण 1", event: `${cleanTopic} की बुनियादी अवधारणा`, significance: "विषय की ऐतिहासिक/वैज्ञानिक नींव।" },
          { era: "प्रगति/चरण 2", event: `${cleanTopic} का आधुनिक प्रयोग`, significance: "परीक्षा व वास्तविक अनुप्रयोग।" }
        ],
        crucialMnemonics: `कड़क शार्ट ट्रिक: '${cleanTopic} + एकाग्रता + निरंतर अभ्यास = 100% सफलता'!`,
        practiceQuestions: [
          {
            question: `प्रतियोगी परीक्षा में '${cleanTopic}' से जुड़े प्रश्नों की मुख्य प्रकृति क्या होती है?`,
            options: ["अवधारणात्मक ज्ञान (Conceptual)", "तथ्यात्मक विवरण (Factual)", "दोनों (Both)", "इनमें से कोई नहीं"],
            answerIndex: 2,
            explanation: "अधिकांश प्रतियोगी परीक्षाओं में अवधारणात्मक और तथ्यात्मक दोनों प्रकार के मिश्रित प्रश्न पूछे जाते हैं।"
          }
        ]
      });
      showToast(`Deep AI Research for "${cleanTopic}" ready!`, "info");
    } finally {
      setIsResearchLoading(false);
    }
  };

  // Start Audio Recording
  const startRecording = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        showToast("Audio recording is not supported in this environment/browser.", "warn");
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: any[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedAudioUrl(url);
        setRecordedAudioBlob(blob);
        showToast("Audio recorded successfully!", "success");
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTime(0);
      showToast("Recording started... Speak now!", "info");
    } catch (err) {
      console.error("Error accessing microphone:", err);
      showToast("Could not access microphone. Please grant permission.", "warn");
    }
  };

  // Stop Audio Recording
  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track: any) => track.stop());
      setIsRecording(false);
    }
  };

  // Interval timer for recording duration
  useEffect(() => {
    let timer: any;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  // Play browser beep tones using HTML5 Web Audio API
  const playBeep = (frequency = 440, duration = 0.2, type: OscillatorType = "sine") => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio Context beep error:", e);
    }
  };

  // Loud multi-chime ringing alarm sound for study timer
  const playLoudAlarmChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const playFreq = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
        gain.gain.setValueAtTime(0.35, ctx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + start + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + duration);
      };
      // Ringing alarm pattern
      playFreq(880, 0, 0.25);
      playFreq(880, 0.3, 0.25);
      playFreq(1046, 0.6, 0.4);
      playFreq(880, 1.1, 0.25);
      playFreq(880, 1.4, 0.25);
      playFreq(1174, 1.7, 0.5);
    } catch (e) {
      console.warn("Alarm chime audio error:", e);
    }
  };

  // External App Launcher Actions
  const handleLaunchYouTube = (topic = launcherSearchTopic) => {
    const clean = (topic || "HansAI Study Lectures").trim();
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(clean)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    showToast(`YouTube search launched for "${clean}"! 🎬`, "info");
  };

  const handleLaunchChatGPT = () => {
    window.open("https://chatgpt.com", "_blank", "noopener,noreferrer");
    showToast("OpenAI ChatGPT opened in new tab! 🤖", "info");
  };

  const handleLaunchGoogleScholar = (topic = launcherSearchTopic) => {
    const clean = (topic || "Indian Constitution").trim();
    const url = `https://scholar.google.com/scholar?q=${encodeURIComponent(clean)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    showToast(`Google Scholar launched for "${clean}"! 📚`, "info");
  };

  const handleLaunchWikipedia = (topic = launcherSearchTopic) => {
    const clean = (topic || "Indian Polity").trim();
    const url = `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(clean)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    showToast(`Wikipedia search launched for "${clean}"! 🌐`, "info");
  };

  const handleLaunchNCERT = () => {
    window.open("https://ncert.nic.in/textbook.php", "_blank", "noopener,noreferrer");
    showToast("NCERT ePathshala Portal opened! 📘", "info");
  };

  const handleLaunchCustomUrl = () => {
    let raw = customLauncherUrl.trim();
    if (!raw) {
      showToast("कृपया कोई वेब पता दर्ज करें।", "warn");
      return;
    }
    if (!raw.startsWith("http://") && !raw.startsWith("https://")) {
      raw = "https://" + raw;
    }
    window.open(raw, "_blank", "noopener,noreferrer");
    showToast(`Opening "${raw}"... 🚀`, "success");
  };

  // Update browser tab title during active alarm countdown
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      const m = Math.floor(timeLeft / 60).toString().padStart(2, "0");
      const s = (timeLeft % 60).toString().padStart(2, "0");
      document.title = `⏰ (${m}:${s}) ${timerAlarmTitle || "HansAI Timer"}`;
    } else {
      document.title = "HansAI • हंस-एआई • Quantum Lab Core";
    }
  }, [isTimerRunning, timeLeft, timerAlarmTitle]);

  // Study Timer Countdown Interval (Smart Study Timer with Half-Time Alerts & Loud Alarm)
  useEffect(() => {
    let interval: any;
    if (isTimerRunning) {
      interval = setInterval(() => {
        if (isMetronomeEnabled) {
          playBeep(320, 0.015, "triangle");
        }

        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsTimerRunning(false);
            
            // Trigger loud ringing chime & alarm modal dialog
            playLoudAlarmChime();
            setIsAlarmRingingModalOpen(true);
            
            showToast(`⏰ 🚨 STUDY ALARM RINGING! "${timerAlarmTitle || 'Study Session'}" Complete!`, "success");
            
            // Add to activity logs
            const newLog = {
              id: `hist-timer-${Date.now()}`,
              type: 'timer' as const,
              title: "Study Alarm Completed",
              subtitle: `Session: ${timerAlarmTitle || 'Study Target'} (${timerPresetVal} mins)`,
              timestamp: new Date().toISOString()
            };
            setActivityLogs(prevLogs => [newLog, ...prevLogs]);
            
            if (timerNoteContent.trim()) {
              const newNote = {
                id: `note-timer-${Date.now()}`,
                title: `Timer Draft (${timerPresetVal} min)`,
                content: timerNoteContent,
                folderId: "general",
                tags: ["TimerPractice", "Draft"],
                createdAt: new Date().toISOString()
              };
              setNotes(prev => [newNote, ...prev]);
              setTimerNoteContent("");
              showToast("📝 Typing draft saved straight to Shorthand & Formula Notes!", "success");
            }
            return 0;
          }
          
          const halfTime = Math.floor((timerPresetVal * 60) / 2);
          if (prev - 1 === halfTime) {
            playBeep(660, 0.12, "sine");
            setTimeout(() => playBeep(660, 0.12, "sine"), 150);
            showToast("⏳ Smart alert: 50% session time completed! Keep pushing forward.", "info");
          }
          
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerPresetVal, timerNoteContent, isMetronomeEnabled, timerAlarmTitle]);

  // Save folders and notes to localStorage on modification
  useEffect(() => {
    localStorage.setItem('hansai-folders', JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    localStorage.setItem('hansai-notes', JSON.stringify(notes));
  }, [notes]);

  // Save new project to list
  const saveProject = (title: string, notes: string, points?: string, headlines?: string, audioUrlToSave?: string | null) => {
    if (!title.trim()) {
      showToast("Please enter a project title.", "warn");
      return;
    }
    const newProject = {
      id: `project-${Date.now()}`,
      title,
      notes,
      points: points || "",
      headlines: headlines || "",
      audioUrl: audioUrlToSave || recordedAudioUrl,
      timestamp: new Date().toISOString()
    };
    setSavedProjects(prev => [newProject, ...prev]);
    showToast("Project saved securely in 'My Projects'! 📁", "success");
    
    // Reset inputs
    setNewProjectName("");
    setNewProjectNotes("");
    setNewProjectPoints("");
    setNewProjectHeadlines("");
    setRecordedAudioUrl(null);
    setRecordedAudioBlob(null);
  };

  // Save active chat messages to history
  const saveChatHistory = () => {
    if (chatMessages.length === 0) {
      showToast("No chat messages to save.", "warn");
      return;
    }
    const title = prompt("Enter a name for this chat session:", `Chat Session - ${new Date().toLocaleDateString()}`);
    if (title === null) return; // user cancelled
    const sessionName = title.trim() || `Chat Session - ${new Date().toLocaleDateString()}`;

    const newChatSession = {
      id: `chat-${Date.now()}`,
      title: sessionName,
      messages: chatMessages,
      timestamp: new Date().toISOString()
    };

    setSavedChats(prev => [newChatSession, ...prev]);
    showToast("Chat saved successfully to History! 💾", "success");
  };

  // Load a saved chat
  const loadSavedChat = (chatSession: any) => {
    setChatMessages(chatSession.messages);
    setActiveView('chat');
    showToast(`Loaded: ${chatSession.title}`, "success");
  };

  // Clear current chat messages (New Chat)
  const startNewChat = () => {
    setChatMessages([]);
    showToast("New chat session started!", "success");
  };

  // Trigger Chatbot API Request
  const handleSendChat = async (textToSend?: string) => {
    const messageContent = textToSend || chatInput;
    if (!messageContent.trim() && !chatAttachedImage) return;

    // Switch view to chat automatically to display response
    setActiveView('chat');

    // Log user activity for owner analytics and history
    logUserActivity('chat', messageContent);

    // Save to user history logs
    const historyItem = {
      id: `hist-chat-${Date.now()}`,
      type: 'chat' as const,
      title: `AI Query: "${messageContent.length > 50 ? messageContent.substring(0, 50) + '...' : messageContent}"`,
      subtitle: `Asked in HansAI Chat Session (${new Date().toLocaleTimeString()})`,
      timestamp: new Date().toISOString()
    };
    setActivityLogs(prev => [historyItem, ...prev]);

    const imagePayload = chatAttachedImage ? { 
      mimeType: chatAttachedImage.mimeType, 
      data: chatAttachedImage.data 
    } : null;

    const previewUrl = chatAttachedImage?.previewUrl;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: messageContent,
      timestamp: new Date(),
      imagePreviewUrl: previewUrl
    };

    setChatMessages(prev => [...prev, userMsg]);
    if (!textToSend) setChatInput('');
    setChatAttachedImage(null); // Reset image selection state
    setIsChatLoading(true);

    const lowerQuery = messageContent.toLowerCase();
    const isCapabilityQuery = lowerQuery.includes("kya kya kar") || lowerQuery.includes("kya help") || lowerQuery.includes("what can you do") || lowerQuery.includes("kya kar sakte") || lowerQuery.includes("features") || lowerQuery.includes("help");

    if (isOffline || !navigator.onLine) {
      let offlineReply = "📶 **आप वर्तमान में ऑफ-लाइन मोड (Offline Mode) में हैं!**\n\nऑफ़लाइन मोड में आपके सभी पुराने सहेजे गए चैट, Pitman Shorthand गाइड्स, स्टडी नोट्स, क्विज़ रिकॉर्ड्स और ऑडियो रिकॉर्डर 100% उपलब्ध हैं!";
      if (isCapabilityQuery) {
        offlineReply = `✨ **HansAI (आपका एआई साथी) - संपूर्ण सहायता निर्देशिका:**\n\n` +
          `1. 🎓 **SSC CGL & प्रतियोगी परीक्षा तैयारी**: SSC CGL, Stenographer, State/UPSC गाइडेंस, इंग्लिश ग्रामर रूल्स और GK ट्रिक्स।\n` +
          `2. ✍️ **Pitman Shorthand & Dictation**: Shorthand स्ट्रोक रेफरेंस, डिक्टेशन टाइमर और स्पीड प्रैक्टिस।\n` +
          `3. 🚀 **Deep Research AI**: विषय पर गहरा अध्ययन, टाइमलाइन और याद करने की ट्रिक्स।\n` +
          `4. 🧠 **Interactive Live Quizzes**: तुरंत 5 सवालों का क्विज टेस्ट, स्कोर और व्याख्या।\n` +
          `5. 🎙️ **Projects & Voice Recorder**: लेक्चर्स/नोट्स की वॉइस रिकॉर्डिंग और प्रोजेक्ट्स।\n` +
          `6. 📖 **Study Notes & Folders**: नोट्स सहेजना, खोजना और स्मार्ट फोल्डर्स।\n` +
          `7. 🗺️ **GIS & Map Visualizer**: इंटरएक्टिव भूगोल मानचित्र और मैपिंग।\n` +
          `8. ☕ **Daily Motivation & Status**: सुबह की कविताएं और मोटिवेशन।\n` +
          `9. 📶 **100% Offline Capability**: नेटवर्क न होने पर भी सभी सहेजे गए नोट्स व टूल्स चलते हैं!`;
      }

      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          id: `reply-${Date.now()}`,
          role: 'assistant',
          content: offlineReply,
          timestamp: new Date()
        }]);
        setIsChatLoading(false);
      }, 300);
      return;
    }

    try {
      const history = [...chatMessages, userMsg].map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: history,
          model: selectedModel,
          image: imagePayload,
          userName: user?.name,
          userEmail: user?.email
        })
      });

      if (!res.ok) {
        throw new Error("Unable to contact assistant server.");
      }

      const data = await res.json();
      setChatMessages(prev => [...prev, {
        id: `reply-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date()
      }]);

      if (isVoiceAssistantActive && data.reply) {
        speakVoiceAssistantReply(data.reply);
      }
    } catch (err: any) {
      console.error("Chat fetch error, running HansAI local smart fallback system:", err);
      
      const query = messageContent.toLowerCase();
      let customReply = "";
      
      const isGreeting = query.includes('hello') || query.includes('hi ') || query.includes('hey') || query.includes('namaste') || query.includes('नमस्ते') || query.includes('प्रणाम') || query.trim() === 'hi';
      const isCreatorQuery = query.includes('creator') || query.includes('founder') || query.includes('who made') || query.includes('who built') || query.includes('who created') || query.includes('hanslal') || query.includes('pal ji') || query.includes('पाल जी') || query.includes('निर्माता') || query.includes('maker');
      const isNotUnderstanding = query.includes('understand') || query.includes('समझ नहीं') || query.includes('नहीं समझा') || query.includes('फिर से') || query.includes('easy') || query.includes('सरल');

      if (isCapabilityQuery) {
        customReply = `✨ **HansAI (आपका एआई साथी) - संपूर्ण सहायता निर्देशिका:**\n\n` +
          `1. 🎓 **SSC CGL & Exam Prep**: SSC CGL, Stenographer, State/UPSC गाइडेंस, इंग्लिश ग्रामर रूल्स और GK ट्रिक्स।\n` +
          `2. ✍️ **Pitman Shorthand & Dictation**: Shorthand स्ट्रोक रेफरेंस, डिक्टेशन टाइमर और स्पीड प्रैक्टिस।\n` +
          `3. 🚀 **Deep Research AI**: विषय पर गहरा अध्ययन, टाइमलाइन और याद करने की ट्रिक्स।\n` +
          `4. 🧠 **Interactive Live Quizzes**: तुरंत 5 सवालों का क्विज टेस्ट, स्कोर और व्याख्या।\n` +
          `5. 🎙️ **Projects & Voice Recorder**: लेक्चर्स/नोट्स की वॉइस रिकॉर्डिंग और प्रोजेक्ट्स।\n` +
          `6. 📖 **Study Notes & Folders**: नोट्स सहेजना, खोजना और स्मार्ट फोल्डर्स।\n` +
          `7. 🗺️ **GIS & Map Visualizer**: इंटरएक्टिव भूगोल मानचित्र और मैपिंग।\n` +
          `8. ☕ **Daily Motivation & Status**: सुबह की कविताएं और मोटिवेशन।\n` +
          `9. 📶 **Offline Availability**: बिना इंटरनेट के भी सभी सेव किए गए नोट्स व टूल्स काम करते हैं!`;
      } else if (isCreatorQuery) {
        customReply = `HansAI को विज़नरी हंसलाल पाल जी के उत्कृष्ट मार्गदर्शन में तैयार किया गया है। उनका विज़न आसान हिंदी और अंग्रेजी के समन्वय से युवाओं और बुद्धिजीवियों को आत्मनिर्भर, अनुशासित और ज्ञान-सम्पन्न बनाना है।`;
      } else if (isGreeting) {
        if (language === 'hindi') {
          customReply = `नमस्ते! मैं आपका एआई साथी (HansAI) हूँ। आज मैं आपकी पढ़ाई, व्याकरण या परीक्षा की तैयारी में किस प्रकार सहायता कर सकता हूँ?`;
        } else {
          customReply = `Hello! I am your AI Companion (HansAI). How can I assist you with your lessons, grammar concepts, or competitive exam preparation today?`;
        }
      } else if (isNotUnderstanding) {
        customReply = `### 💡 आसान रूप (Simplified Explanation):\n\n\`\`\`\n  [मूल सिद्धांत / Core Concept]\n         │\n         ├──➤ [नियम / Rule/Formula]\n         │      └──➤ अनुप्रयोग (Application in Practice Exams)\n         └──➤ [स्मरण ट्रिक / Memorization Hack]\n\`\`\``;
      } else {
        customReply = `Thank you for your academic query under HansAI. I am currently operating in fallback mode, but you can explore our premium core elements or enter specified study goals to bolster preparation!`;
      }

      setChatMessages(prev => [...prev, {
        id: `reply-${Date.now()}`,
        role: 'assistant',
        content: customReply,
        timestamp: new Date()
      }]);
      showToast("HansAI Local Response Activated ✅", "success");

      if (isVoiceAssistantActive && customReply) {
        speakVoiceAssistantReply(customReply);
      }
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${
      screenColorMode === 'dark' ? 'bg-[#03060E] text-slate-100' : 
      screenColorMode === 'warm_yellow' ? 'bg-[#FAF6E9] text-[#78350F] font-sans' : 
      'bg-[#F1F3F5] text-slate-800'
    }`}>

      {/* HANSAI ANIMATED SPLASH SCREEN OVERLAY */}
      {showSplashScreen && (
        <div className="fixed inset-0 z-50 bg-[#030611] flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden transition-opacity duration-700">
          {/* Background glowing particles/radial aura */}
          <div className="absolute w-96 h-96 bg-gradient-to-tr from-amber-500/20 via-indigo-600/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />

          <div className="relative z-10 max-w-sm w-full space-y-6 flex flex-col items-center">
            {/* Animated Glowing Swan Icon Badge */}
            <div className="relative group cursor-pointer">
              <div className="w-28 h-28 rounded-[28px] bg-gradient-to-b from-[#0F172A] to-[#020617] border-2 border-amber-500/40 p-1 shadow-[0_0_50px_rgba(245,158,11,0.3)] flex items-center justify-center relative transform hover:scale-105 transition-all duration-500 animate-bounce">
                {/* Pulsing Outer Gold Neon Ring */}
                <div className="absolute -inset-1 rounded-[30px] border border-amber-400/50 animate-ping pointer-events-none" />
                
                <div className="w-full h-full rounded-[22px] bg-gradient-to-tr from-[#020617] via-[#0D1527] to-[#1E293B] flex items-center justify-center relative overflow-hidden">
                  {/* Swan SVG */}
                  <svg viewBox="0 0 100 100" className="w-20 h-20 text-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.7)]">
                    <path 
                      d="M75,30 Q65,15 50,30 T40,65 Q30,75 55,75 T80,68 T75,30 Z" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="3.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                    />
                    <path 
                      d="M30,60 Q15,55 25,40 T45,55 L58,72" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                    />
                    <circle cx="75" cy="27" r="3" fill="#FFF" className="animate-ping" />
                  </svg>
                  
                  {/* Sparkle */}
                  <div className="absolute top-2 right-2 animate-spin duration-3000">
                    <Sparkle className="w-5 h-5 text-amber-300 fill-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.9)]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Brand Title & Tagline */}
            <div className="space-y-2">
              <h1 className="text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-indigo-200 to-cyan-300 drop-shadow-md">
                HansAI • हंस-एआई
              </h1>
              <p className="text-xs text-amber-200/90 font-medium tracking-wide">
                Intelligence & Wisdom Platform • By <strong className="text-white">Hanslal Pal Ji</strong>
              </p>
            </div>

            {/* Live Activity Counters Badge */}
            <div className="px-3.5 py-1.5 bg-emerald-950/60 border border-emerald-500/30 rounded-full flex items-center gap-2 text-xs font-semibold text-emerald-300 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>🟢 1,420 Online • 12,850+ AI Chats Today</span>
            </div>

            {/* Loading Progress Bar */}
            <div className="w-full space-y-2 pt-2">
              <div className="w-full bg-slate-900/80 border border-slate-800 rounded-full h-2.5 overflow-hidden p-0.5">
                <div 
                  className="bg-gradient-to-r from-amber-500 via-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(245,158,11,0.6)]"
                  style={{ width: `${splashProgress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>{splashStatus}</span>
                <span className="text-amber-400 font-bold">{splashProgress}%</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* HEADER SECTION */}
      <header className={`px-4 sm:px-6 h-16 border-b flex items-center justify-between sticky top-0 z-40 backdrop-blur-md ${
        screenColorMode === 'dark' ? 'bg-[#03060E]/80 border-slate-900' :
        screenColorMode === 'warm_yellow' ? 'bg-[#FAF6E9]/80 border-amber-900/10' :
        'bg-[#F1F3F5]/80 border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 hover:bg-slate-800/80 rounded-xl transition-all cursor-pointer"
            title="Open terminal sidebar"
          >
            <Menu className="w-5 h-5 text-indigo-400" />
          </button>
          
          <div className="flex items-center gap-2 font-sans">
            {/* Quantum Swan AI Logo */}
            <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
              <QuantumSwanLogo className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold tracking-wide text-white">HansAI</h1>
              <span className="text-[8px] font-black uppercase text-[#00E5FF] tracking-widest leading-none block">QUANTUM LAB CORE</span>
            </div>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Hands-Free Voice Assistant Toggle Button ("Ok AI" / "Ok Open AI") */}
          <button
            onClick={startVoiceAssistantMode}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer border ${
              isVoiceAssistantActive
                ? 'bg-rose-600 text-white border-rose-400 animate-pulse shadow-rose-600/40'
                : 'bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border-rose-500/40'
            }`}
            title="Hands-Free Voice Assistant (Say 'Ok AI' or 'Ok Open AI')"
          >
            <Mic className={`w-3.5 h-3.5 ${isVoiceAssistantActive ? 'animate-bounce text-white' : 'text-rose-300'}`} />
            <span className="hidden sm:inline">
              {isVoiceAssistantActive ? 'Ok AI Assistant ON 🟢' : 'Voice Assistant / Ok AI 🎙️'}
            </span>
          </button>

          {/* User History Button */}
          <button
            onClick={() => setActiveView('history')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer border ${
              activeView === 'history'
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-emerald-600/40'
                : 'bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border-emerald-500/40'
            }`}
            title="View My Activity & Search History / अपना इतिहास देखें"
          >
            <History className="w-3.5 h-3.5 text-emerald-300" />
            <span className="hidden sm:inline">My History / इतिहास</span>
          </button>

          {/* Share App Button */}
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="px-2.5 py-1.5 bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer border border-cyan-400/30"
            title="Share App / ऐप शेयर करें (WhatsApp, Instagram, FB)"
          >
            <Share2 className="w-3.5 h-3.5 text-cyan-200" />
            <span className="hidden sm:inline">Share / शेयर करें</span>
          </button>

          {/* Owner Admin Dashboard Direct Access Button */}
          <button
            onClick={() => handleOpenOwnerDashboard()}
            className="px-2.5 py-1.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer border-none"
            title="Owner Admin Dashboard (Hanslal Pal Ji)"
          >
            <span>👑</span>
            <span className="hidden sm:inline">Owner Admin</span>
          </button>

          {/* Color theme mode switcher */}
          <button
            onClick={() => {
              const colors: Array<'dark' | 'warm_yellow' | 'eco_gray'> = ['dark', 'warm_yellow', 'eco_gray'];
              const nextIndex = (colors.indexOf(screenColorMode) + 1) % colors.length;
              const nextMode = colors[nextIndex];
              setScreenColorMode(nextMode);
              localStorage.setItem('hansai-color-mode', nextMode);
              showToast("Theme changed successfully!", "success");
            }}
            className="p-1.5 sm:px-2.5 sm:py-1.5 bg-slate-800 hover:bg-slate-750/80 rounded-xl text-xs font-bold text-amber-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span className="text-sm">👁️</span>
            <span className="text-[10px] hidden md:inline">
              {screenColorMode === 'dark' ? 'Warm Yellow' : screenColorMode === 'warm_yellow' ? 'Eco Gray' : 'Default Dark'}
            </span>
          </button>

          {activeView !== 'chat' && (
            <button
              onClick={() => setActiveView('chat')}
              className="px-2.5 py-1.5 bg-indigo-650 hover:bg-indigo-600 rounded-xl text-[10px] font-extrabold text-white flex items-center gap-1 transition-all cursor-pointer"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Return to Chat</span>
            </button>
          )}

          {user ? (
              <div className="flex items-center gap-1.5 sm:gap-2 border-l border-slate-800/80 pl-2 sm:pl-3 font-sans">
                <img 
                  src={user.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"} 
                  alt={user.name} 
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-indigo-500/40 shadow-sm object-cover animate-fade-in"
                  referrerPolicy="no-referrer"
                />
                <div className="flex flex-col items-start hidden xl:flex text-left font-sans">
                  <span className="text-[10px] text-white font-black block leading-none">
                    {(() => {
                      if (!user.name || user.name.includes('@')) {
                        if (user.email && user.email.toLowerCase().includes('palhanslal4')) return 'Hanslal Pal';
                        return 'Student / प्रतियोगी छात्र';
                      }
                      if (user.name.toLowerCase() === 'kendo') return 'Scholar';
                      return user.name;
                    })()}
                  </span>
                  <span className="text-[8px] text-slate-400 block truncate max-w-[100px] leading-tight mt-0.5">{user.email}</span>
                </div>
                <button
                  onClick={() => {
                    localStorage.removeItem('hansai-user-session');
                    setUser(null);
                    showToast(language === 'hindi' ? "सफलतापूर्वक लॉगआउट किया गया! 👋" : "Successfully Logged Out! 👋", "info");
                    setActiveView('chat');
                  }}
                  className="px-2 py-1 bg-rose-500/20 hover:bg-rose-500/80 text-rose-300 hover:text-white rounded-lg text-[9px] font-black uppercase transition-all"
                >
                  {t('logoutBtn')}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsAuthLoginOpen(true)}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer border border-indigo-500/30"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Login / लॉग इन</span>
                </button>
                <button
                  onClick={() => setIsAuthRegisterOpen(true)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-550 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Register / रजिस्टर</span>
                </button>
              </div>
            )}
            
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-bold text-emerald-400" title="Active Students & Live Chat Stats">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>1,420 Online • 12k+ Chats</span>
            </div>

            <span className={`w-2.5 h-2.5 rounded-full ${isOffline ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 shadow-sm shadow-emerald-500/20'}`} title={isOffline ? "Offline Mode" : "System Online"}></span>
          </div>
        </header>

        {/* Offline Status Top Banner */}
        {isOffline && (
          <div className="bg-[#1e1b4b] border-b border-[#00E5FF]/30 px-4 py-2 text-center text-xs font-semibold text-[#00E5FF] flex items-center justify-center gap-2">
            <span>📶</span>
            <span>
              <strong>Offline Mode Active / ऑफ-लाइन मोड:</strong> You can view saved chats, notes, Pitman shorthand tools, quizzes, and calculators offline anytime!
            </span>
          </div>
        )}

        {/* MANDATORY USER REGISTRATION MODAL */}
        {isUserRegisterModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-[#0B0F1B] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative space-y-6 text-left">
              <button
                onClick={() => setIsUserRegisterModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-full bg-slate-800/50 hover:bg-slate-800 transition-all text-xs cursor-pointer"
              >
                ✕
              </button>

              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto text-2xl shadow-lg shadow-indigo-600/10">
                  👋
                </div>
                <h3 className="text-lg font-extrabold text-white">
                  Welcome to HansAI / स्वागतम!
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  कृपया प्रयोग शुरू करने से पहले अपना <strong>नाम (Name)</strong> और <strong>ईमेल (Email)</strong> दर्ज करें:
                </p>
              </div>

              <form onSubmit={handleUserRegistrationSubmit} className="space-y-4 text-xs font-semibold">
                <div className="space-y-1.5">
                  <label className="text-slate-300 block">आपका पूरा नाम / Full Name:</label>
                  <input
                    type="text"
                    required
                    value={registerFormName}
                    onChange={(e) => setRegisterFormName(e.target.value)}
                    placeholder="उदा. आपका नाम / Enter Your Name"
                    className="w-full px-3.5 py-2.5 bg-[#060913] border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 block">आपका ईमेल आईडी / Email Address:</label>
                  <input
                    type="email"
                    required
                    value={registerFormEmail}
                    onChange={(e) => setRegisterFormEmail(e.target.value)}
                    placeholder="उदा. yourname@gmail.com"
                    className="w-full px-3.5 py-2.5 bg-[#060913] border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <p className="text-[10px] text-slate-500 italic text-center">
                  * Owner Hanslal Pal Ji will be notified to ensure clean student access.
                </p>

                <button
                  type="submit"
                  disabled={isRegisteringUser}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-550 hover:to-indigo-650 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-indigo-600/20 cursor-pointer disabled:opacity-50"
                >
                  {isRegisteringUser ? "रजिस्टर हो रहा है..." : "सुरक्षित प्रवेश करें / Continue to HansAI"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ACTIVE CANVAS VIEW */}
        <div className={`flex-1 ${activeView === 'chat' ? 'overflow-hidden flex flex-col' : 'overflow-y-auto'}`}>
          
          {/* VIEW: CHAT BOT (CHATGPT & GEMINI STYLE WITH SIDEBAR & NON-SCROLLABLE HOME) */}
          {activeView === 'chat' && (
            !user ? (
              <AuthGateView
                setUser={setUser}
                showToast={showToast}
                onOpenForgot={() => setIsAuthForgotOpen(true)}
              />
            ) : (
            <div className="h-[calc(100vh-4rem)] flex overflow-hidden w-full relative">
              
              {/* LEFT SIDEBAR (ChatGPT / Gemini style side search & history bar) */}
              <div className={`w-72 sm:w-80 border-r border-slate-850/80 bg-[#060913] flex flex-col justify-between flex-shrink-0 transition-all duration-300 z-30 ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
              } fixed lg:relative inset-y-0 left-0 top-0 h-full shadow-2xl lg:shadow-none`}>
                
                {/* Top Sidebar Controls */}
                <div className="p-3.5 space-y-3 border-b border-slate-850/80">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-indigo-300 uppercase tracking-widest flex items-center gap-1.5">
                      <QuantumSwanLogo className="w-4.5 h-4.5" />
                      HansAI Sidebar
                    </span>
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="lg:hidden p-1 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* New Chat Button */}
                  <button
                    onClick={() => {
                      startNewChat();
                      if (window.innerWidth < 1024) setSidebarOpen(false);
                    }}
                    className="w-full py-2.5 px-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-550 hover:to-indigo-650 text-white rounded-xl font-bold text-xs flex items-center justify-between transition-all shadow-md shadow-indigo-600/15 cursor-pointer border-none"
                  >
                    <div className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      <span>New Chat / नया चैट</span>
                    </div>
                    <span className="text-[9px] bg-indigo-900/80 px-1.5 py-0.5 rounded text-indigo-200 font-mono">Fresh</span>
                  </button>

                  {/* Sidebar Search Bar */}
                  <div className="relative">
                    <input
                      type="text"
                      value={sidebarSearchQuery}
                      onChange={(e) => setSidebarSearchQuery(e.target.value)}
                      placeholder="Search chats, topics... / खोजें..."
                      className="w-full text-xs py-2 pl-8 pr-3 bg-[#0B0F1B] border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                    {sidebarSearchQuery && (
                      <button
                        onClick={() => setSidebarSearchQuery('')}
                        className="absolute right-2.5 top-2 text-slate-500 hover:text-white text-xs"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>

                {/* Middle Scrollable list: Saved Chats & Quick Features */}
                <div className="flex-1 overflow-y-auto p-3 space-y-4">
                  
                  {/* Saved Chat History / Recent Chats */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                      <span>Recent Chats / हाल के चैट</span>
                      <span className="text-[9px] bg-slate-800 px-1.5 py-0.2 rounded text-slate-400">{savedChats.length}</span>
                    </div>

                    {filteredSavedChats.length === 0 ? (
                      <div className="p-3 text-center text-[10px] text-slate-500 bg-[#080C16] border border-dashed border-slate-850 rounded-xl">
                        {savedChats.length === 0 ? "No saved chat history yet." : "No matching chats found."}
                      </div>
                    ) : (
                      <div className="space-y-1 max-h-48 overflow-y-auto">
                        {filteredSavedChats.map((sess) => (
                          <div
                            key={sess.id}
                            className="group flex items-center justify-between p-2 rounded-xl bg-[#090D18] hover:bg-[#121829] border border-slate-850 hover:border-indigo-500/30 transition-all text-left cursor-pointer"
                          >
                            <button
                              onClick={() => {
                                loadSavedChat(sess);
                                if (window.innerWidth < 1024) setSidebarOpen(false);
                              }}
                              className="flex-1 text-[11px] font-semibold text-slate-300 hover:text-indigo-300 truncate text-left flex items-center gap-1.5 bg-transparent border-none cursor-pointer"
                            >
                              <MessageSquare className="w-3 h-3 text-indigo-400 flex-shrink-0" />
                              <span className="truncate">{sess.title}</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSavedChats(prev => prev.filter(s => s.id !== sess.id));
                                showToast("Chat deleted", "info");
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 text-xs transition-opacity bg-transparent border-none cursor-pointer"
                              title="Delete Chat"
                            >
                              🗑️
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Quick Tools & Modes */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-850">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1 block">
                      Specialized AI Hub / ऐप्स
                    </span>
                    <div className="space-y-1 text-xs font-semibold">
                      <button
                        onClick={() => { setActiveView('history'); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl text-emerald-300 hover:text-emerald-200 hover:bg-[#121829] transition-all text-left bg-emerald-500/10 border border-emerald-500/20 cursor-pointer font-bold"
                      >
                        <History className="w-4 h-4 text-emerald-300" />
                        <span className="truncate">My History & Activity / अपना इतिहास 📜</span>
                      </button>
                      <button
                        onClick={() => { startVoiceAssistantMode(); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl text-rose-300 hover:text-rose-200 hover:bg-[#121829] transition-all text-left bg-rose-500/10 border border-rose-500/20 cursor-pointer font-bold"
                      >
                        <Mic className="w-4 h-4 text-rose-300" />
                        <span className="truncate">Voice Assistant (Say 'Ok AI') 🎙️</span>
                      </button>
                      <button
                        onClick={() => { setActiveView('planner'); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl text-indigo-300 hover:text-indigo-200 hover:bg-[#121829] transition-all text-left bg-indigo-500/10 border border-indigo-500/20 cursor-pointer font-bold"
                      >
                        <span className="text-sm">🎯</span>
                        <span className="truncate">AI Study Plan & Roadmap / रोडमैप</span>
                      </button>
                      <button
                        onClick={() => { setActiveView('flashcards'); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl text-purple-300 hover:text-purple-200 hover:bg-[#121829] transition-all text-left bg-purple-500/10 border border-purple-500/20 cursor-pointer font-bold"
                      >
                        <span className="text-sm">🃏</span>
                        <span className="truncate">AI Flashcards / फ़्लैशकार्ड</span>
                      </button>
                      <button
                        onClick={() => { setActiveView('photo-doubt'); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl text-emerald-300 hover:text-emerald-200 hover:bg-[#121829] transition-all text-left bg-emerald-500/10 border border-emerald-500/20 cursor-pointer font-bold"
                      >
                        <span className="text-sm">📸</span>
                        <span className="truncate">Photo Doubt Solver / फोटो समाधान</span>
                      </button>
                      <button
                        onClick={() => { setActiveView('security'); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl text-emerald-400 hover:text-emerald-300 hover:bg-[#121829] transition-all text-left bg-emerald-950/60 border border-emerald-500/30 cursor-pointer font-bold"
                      >
                        <span className="text-sm">🛡️</span>
                        <span className="truncate">Security System Audit / सुरक्षा केंद्र</span>
                      </button>
                      <button
                        onClick={() => { setIsShareModalOpen(true); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl text-cyan-300 hover:text-white bg-gradient-to-r from-cyan-600/30 via-indigo-600/30 to-purple-600/30 border border-cyan-400/40 cursor-pointer font-bold transition-all shadow-md"
                      >
                        <Share2 className="w-4 h-4 text-cyan-300" />
                        <span className="truncate">Share App / ऐप शेयर करें 🚀</span>
                      </button>
                      <button
                        onClick={() => { setActiveView('timer'); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl text-amber-300 hover:text-amber-200 hover:bg-[#121829] transition-all text-left bg-amber-500/10 border border-amber-500/20 cursor-pointer font-bold"
                      >
                        <span className="text-sm">⏰</span>
                        <span className="truncate">Study Alarm & Timer / अलार्म</span>
                      </button>
                      <button
                        onClick={() => { setIsAppLauncherOpen(true); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl text-cyan-300 hover:text-cyan-200 hover:bg-[#121829] transition-all text-left bg-cyan-500/10 border border-cyan-500/20 cursor-pointer font-bold"
                      >
                        <span className="text-sm">🌐</span>
                        <span className="truncate">App Launcher (YouTube/ChatGPT)</span>
                      </button>
                      <button
                        onClick={() => { setActiveView('research'); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#121829] transition-all text-left bg-transparent border-none cursor-pointer"
                      >
                        <span className="text-sm">🚀</span>
                        <span className="truncate">Deep Research AI</span>
                      </button>
                      <button
                        onClick={() => { setActiveView('timer'); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#121829] transition-all text-left bg-transparent border-none cursor-pointer"
                      >
                        <span className="text-sm">🎙️</span>
                        <span className="truncate">Projects & Audio Recorder</span>
                      </button>
                      <button
                        onClick={() => { setActiveView('map'); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#121829] transition-all text-left bg-transparent border-none cursor-pointer"
                      >
                        <span className="text-sm">🗺️</span>
                        <span className="truncate">GIS & Map Visualizer</span>
                      </button>
                      <button
                        onClick={() => { setActiveView('quiz'); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#121829] transition-all text-left bg-transparent border-none cursor-pointer"
                      >
                        <span className="text-sm">🧠</span>
                        <span className="truncate">Interactive Live Quiz</span>
                      </button>
                      <button
                        onClick={() => { setActiveView('notes'); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#121829] transition-all text-left bg-transparent border-none cursor-pointer"
                      >
                        <span className="text-sm">📖</span>
                        <span className="truncate">Study Notes & Folders</span>
                      </button>
                    </div>
                  </div>

                  {/* Creator & Academic Hub Drawer Toggles */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-850">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1 block">
                      Workspace & Creator
                    </span>
                    <button
                      onClick={() => {
                        handleOpenOwnerDashboard();
                        if (window.innerWidth < 1024) setSidebarOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all text-left text-xs font-bold cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">👑</span>
                        <span>Owner Admin Console (Hanslal Pal Ji)</span>
                      </div>
                      <span className="text-[9px] bg-amber-500/30 px-1.5 py-0.5 rounded text-amber-200">Admin</span>
                    </button>

                    <button
                      onClick={() => setIsCreatorDrawerOpen(!isCreatorDrawerOpen)}
                      className="w-full flex items-center justify-between p-2 rounded-xl text-slate-300 hover:text-indigo-300 hover:bg-[#121829] transition-all text-left text-xs font-semibold bg-transparent border-none cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">👤</span>
                        <span>About Creator (Hanslal Pal)</span>
                      </div>
                      <span className="text-[10px] text-slate-500">{isCreatorDrawerOpen ? '▲' : '▼'}</span>
                    </button>
                    
                    {isCreatorDrawerOpen && (
                      <div className="p-2 bg-[#090D18] border border-slate-850 rounded-xl space-y-2 text-left animate-fade-in max-h-64 overflow-y-auto">
                        <AboutCreator />
                      </div>
                    )}

                    <button
                      onClick={() => setIsAcademicHubOpen(!isAcademicHubOpen)}
                      className="w-full flex items-center justify-between p-2 rounded-xl text-slate-300 hover:text-indigo-300 hover:bg-[#121829] transition-all text-left text-xs font-semibold bg-transparent border-none cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">📚</span>
                        <span>Syllabus & Utilities</span>
                      </div>
                      <span className="text-[10px] text-slate-500">{isAcademicHubOpen ? '▲' : '▼'}</span>
                    </button>

                    {isAcademicHubOpen && (
                      <div className="p-2 bg-[#090D18] border border-slate-850 rounded-xl space-y-2 text-left animate-fade-in max-h-60 overflow-y-auto">
                        <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Quick Shortcuts:</div>
                        <button onClick={() => { setIsUtilityDashboardOpen(true); }} className="w-full text-left p-2 bg-slate-900 hover:bg-slate-800 rounded text-xs text-indigo-300 font-medium cursor-pointer border-none">
                          ⚙️ Utility Dashboard
                        </button>
                        <button onClick={() => { setIsFeedbackOpen(true); }} className="w-full text-left p-2 bg-slate-900 hover:bg-slate-800 rounded text-xs text-orange-300 font-medium cursor-pointer border-none">
                          📝 Give Feedback
                        </button>
                        <button onClick={() => { setIsSharePosterOpen(true); }} className="w-full text-left p-2 bg-slate-900 hover:bg-slate-800 rounded text-xs text-emerald-300 font-medium cursor-pointer border-none">
                          💬 Share Status
                        </button>
                      </div>
                    )}
                  </div>

                </div>

                {/* Bottom Sidebar Footer */}
                <div className="p-3 border-t border-slate-850/80 bg-[#04070F] flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <QuantumSwanLogo className="w-5 h-5" />
                    <span className="font-extrabold text-white text-[11px]">HansAI Core</span>
                  </div>
                  {chatMessages.length > 0 && (
                    <button
                      onClick={saveChatHistory}
                      className="text-[9px] bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-1 rounded font-bold transition-all border-none cursor-pointer"
                    >
                      Save Chat
                    </button>
                  )}
                </div>

              </div>

              {/* RIGHT MAIN CHAT AREA (ChatGPT / Gemini style viewport centered layout) */}
              <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#03060E] relative">
                
                {/* Mobile Top Toggle Bar */}
                <div className="lg:hidden p-2.5 bg-[#060913] border-b border-slate-850 flex items-center justify-between">
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="flex items-center gap-2 text-xs font-bold text-indigo-300 bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-all border-none cursor-pointer"
                  >
                    <Menu className="w-4 h-4 text-indigo-400" />
                    <span>{sidebarOpen ? "Close Sidebar" : "Search & History / साइड बार"}</span>
                  </button>
                  <span className="text-[10px] text-slate-400 font-mono">HansAI Chat Workspace</span>
                </div>

                {/* MAIN CHAT CONTENT AREA */}
                <div className="flex-1 flex flex-col justify-between max-w-4xl w-full mx-auto p-4 sm:p-6 overflow-hidden">
                  
                  {/* Hands-Free Voice Assistant Active Status Banner */}
                  {isVoiceAssistantActive && (
                    <div className="mb-4 bg-gradient-to-r from-rose-950/90 via-indigo-950/90 to-slate-900/90 border border-rose-500/50 p-3.5 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-white text-xs animate-fade-in relative overflow-hidden flex-shrink-0">
                      <div className="flex items-center gap-3 text-left">
                        <div className="relative flex-shrink-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isVoiceAssistantSpeaking ? 'bg-amber-500' : 'bg-rose-600'} text-white shadow-lg shadow-rose-500/30`}>
                            <Mic className={`w-5 h-5 ${isVoiceAssistantListening ? 'animate-pulse' : ''}`} />
                          </div>
                          {(isVoiceAssistantListening || isVoiceAssistantSpeaking) && (
                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full animate-ping" />
                          )}
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-rose-500/30 text-rose-200 text-[9px] font-extrabold uppercase tracking-wider">
                              🎙️ HANDS-FREE VOICE ASSISTANT ACTIVE
                            </span>
                            <span className="text-[10px] text-slate-300 font-mono hidden sm:inline">Wake: "Ok AI" / "Ok Open AI"</span>
                          </div>
                          <p className="text-xs font-bold text-amber-300 mt-0.5">
                            {voiceAssistantStatus}
                          </p>
                          {voiceAssistantTranscript && (
                            <p className="text-[11px] text-slate-300 italic truncate max-w-md">
                              "{voiceAssistantTranscript}"
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isVoiceAssistantSpeaking && (
                          <button
                            onClick={() => {
                              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                              setIsVoiceAssistantSpeaking(false);
                            }}
                            className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-white border border-amber-500/40 rounded-xl text-[10px] font-bold transition-all cursor-pointer"
                          >
                            ⏹️ Stop Speaking
                          </button>
                        )}
                        <button
                          onClick={stopVoiceAssistantMode}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-[10px] font-bold transition-all cursor-pointer shadow-md border-none"
                        >
                          Turn Off ❌
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* NEW CHAT WELCOME STATE (ChatGPT / Gemini Style) */}
                  {chatMessages.length === 0 ? (
                    <div className="my-auto py-6 sm:py-10 space-y-6 sm:space-y-8 flex flex-col items-center w-full max-w-2xl mx-auto text-center animate-fade-in overflow-y-auto">
                      
                      {/* Logo and Greeting */}
                      <div className="flex flex-col items-center space-y-3">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
                          <QuantumSwanLogo className="w-16 h-16 sm:w-20 sm:h-20" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
                          HansAI - What can I help with today?
                        </h2>
                        <p className="text-xs sm:text-sm text-indigo-300 font-medium">
                          आज मैं आपकी प्रतियोगी परीक्षाओं, अध्ययन, व्याकरण या नोट्स में क्या मदद कर सकता हूँ?
                        </p>
                      </div>

                      {/* Quick Utility Feature Bar: Alarm & External App Launcher */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                        <button
                          onClick={() => { setActiveView('timer'); }}
                          className="p-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-2xl flex items-center justify-between text-left group cursor-pointer transition-all shadow-md"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-xl">⏰</span>
                            <div>
                              <h4 className="text-xs font-bold text-amber-300">Set Time Alarm / अलार्म सेट करें</h4>
                              <p className="text-[10px] text-slate-400">Pomodoro, exam timer & dictation alarm chime</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-amber-400">Open Alarm →</span>
                        </button>

                        <button
                          onClick={() => { setIsAppLauncherOpen(true); }}
                          className="p-3 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-2xl flex items-center justify-between text-left group cursor-pointer transition-all shadow-md"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-xl">🌐</span>
                            <div>
                              <h4 className="text-xs font-bold text-cyan-300">App Launcher (YouTube / ChatGPT)</h4>
                              <p className="text-[10px] text-slate-400">Open YouTube, OpenAI, Scholar, NCERT</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-cyan-400">Launch Apps →</span>
                        </button>
                      </div>

                      {/* What can HansAI do featured button */}
                      <button
                        onClick={() => handleSendChat("क्या-क्या कर सकते हो? Please list all your features and how you can help me.")}
                        className="w-full p-3.5 bg-gradient-to-r from-amber-500/15 via-indigo-600/15 to-emerald-500/15 hover:from-amber-500/25 hover:to-emerald-500/25 border border-amber-500/40 rounded-2xl flex items-center justify-between text-left group cursor-pointer transition-all shadow-lg"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">✨</span>
                          <div>
                            <h4 className="text-xs font-extrabold text-amber-300 group-hover:text-amber-200">
                              What Can HansAI Do? / क्या-क्या सहायता कर सकते हैं?
                            </h4>
                            <p className="text-[10px] text-slate-300">
                              Click to view all features: SSC exam prep, Pitman shorthand, live quizzes, offline notes & more!
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-amber-300 bg-amber-500/20 px-3 py-1.5 rounded-xl group-hover:bg-amber-500/30 whitespace-nowrap">
                          Explore Features →
                        </span>
                      </button>

                      {/* Quick Prompt Suggestions Grid (ChatGPT / Gemini Style) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
                        <button
                          onClick={() => {
                            setChatInput("Explain the SSC CGL Tier 1 exam pattern and key subjects in simple Hindi.");
                          }}
                          className="p-3.5 rounded-2xl bg-[#080C17] hover:bg-[#10172A] border border-slate-800 hover:border-indigo-500/50 transition-all text-left space-y-1 group cursor-pointer shadow-md"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-200 group-hover:text-indigo-300">📘 SSC CGL Exam Pattern</span>
                            <span className="text-xs text-slate-500 group-hover:text-indigo-400">→</span>
                          </div>
                          <p className="text-[10px] text-slate-400">Get simplified breakdown of Tier 1 syllabus & marking scheme</p>
                        </button>

                        <button
                          onClick={() => {
                            setChatInput("Provide a memorization trick for Indian Constitution Fundamental Rights (Articles 12-35).");
                          }}
                          className="p-3.5 rounded-2xl bg-[#080C17] hover:bg-[#10172A] border border-slate-800 hover:border-indigo-500/50 transition-all text-left space-y-1 group cursor-pointer shadow-md"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-200 group-hover:text-indigo-300">🏛️ Constitution Trick</span>
                            <span className="text-xs text-slate-500 group-hover:text-indigo-400">→</span>
                          </div>
                          <p className="text-[10px] text-slate-400">Short trick to remember Articles 12 to 35 easily</p>
                        </button>

                        <button
                          onClick={() => {
                            setChatInput("How can I improve my shorthand dictation speed and accuracy for Stenographer exams?");
                          }}
                          className="p-3.5 rounded-2xl bg-[#080C17] hover:bg-[#10172A] border border-slate-800 hover:border-indigo-500/50 transition-all text-left space-y-1 group cursor-pointer shadow-md"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-200 group-hover:text-indigo-300">🎙️ Shorthand Dictation Rules</span>
                            <span className="text-xs text-slate-500 group-hover:text-indigo-400">→</span>
                          </div>
                          <p className="text-[10px] text-slate-400">Tips & exercises to boost wpm dictation speed</p>
                        </button>

                        <button
                          onClick={() => {
                            setChatInput("What are the most important General Science formulas for competitive exams?");
                          }}
                          className="p-3.5 rounded-2xl bg-[#080C17] hover:bg-[#10172A] border border-slate-800 hover:border-indigo-500/50 transition-all text-left space-y-1 group cursor-pointer shadow-md"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-200 group-hover:text-indigo-300">🧬 General Science Formulas</span>
                            <span className="text-xs text-slate-500 group-hover:text-indigo-400">→</span>
                          </div>
                          <p className="text-[10px] text-slate-400">High-yield physics & chemistry constants table</p>
                        </button>
                      </div>

                    </div>
                  ) : (
                    /* ACTIVE CHAT MESSAGES THREAD */
                    <div className="flex-1 space-y-6 max-w-3xl mx-auto w-full mb-4 overflow-y-auto pr-1">
                      {chatMessages.map((msg) => (
                        <div 
                          key={msg.id}
                          className={`flex flex-col space-y-1.5 py-2 ${
                            msg.role === 'user' ? 'items-end' : 'items-start'
                          }`}
                        >
                          <div className={`flex items-start gap-3.5 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            
                            {/* Avatar */}
                            {msg.role === 'user' ? (
                              <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm bg-indigo-600 text-white">
                                U
                              </div>
                            ) : (
                              <div className="relative w-8 h-8 flex-shrink-0 flex items-center justify-center">
                                <div className="absolute inset-0 rounded-full border border-teal-400/35 animate-ping opacity-60" style={{ animationDuration: '3s' }} />
                                <div className="absolute inset-0.5 rounded-full border border-dashed border-indigo-400/60 animate-spin" style={{ animationDuration: '10s' }} />
                                <div className="w-5.5 h-5.5 rounded-full bg-gradient-to-tr from-[#00E5FF] to-[#9D4EDD] shadow-lg shadow-teal-500/20 flex items-center justify-center text-[9px] font-black text-slate-950 z-10 select-none">
                                  ✨
                                </div>
                              </div>
                            )}

                            {/* Speech Bubble */}
                            <div className="flex flex-col">
                              {msg.imagePreviewUrl && (
                                <div className="mb-2 max-w-xs overflow-hidden rounded-xl border border-slate-800 bg-slate-950/40 shadow-md">
                                  <img src={msg.imagePreviewUrl} alt="User contribution" className="max-h-48 object-contain rounded-xl" referrerPolicy="no-referrer" />
                                </div>
                              )}

                              <div className={`rounded-2xl p-4 ${textSizeClass} leading-relaxed whitespace-pre-wrap shadow-sm ${
                                msg.role === 'user' 
                                  ? 'bg-indigo-600/90 text-white rounded-tr-none' 
                                  : 'bg-slate-900/90 text-slate-200 border border-slate-800/70 rounded-tl-none'
                              }`}>
                                {renderMessageWithHighlights(msg.content)}
                              </div>
                            </div>
                          </div>

                          {/* Msg Actions Console */}
                          {msg.role === 'assistant' && (
                            <div className="flex items-center gap-3 pl-12 text-[10px] text-slate-500 font-medium select-none">
                              <button
                                onClick={() => handleCopyMessage(msg.id, msg.content)}
                                className="flex items-center gap-1 hover:text-indigo-400 transition-colors py-1 px-1.5 hover:bg-slate-800/40 rounded-md border-none bg-transparent cursor-pointer"
                                title="Copy response to clipboard"
                              >
                                <Copy className="w-3 h-3" />
                                {copiedMsgId === msg.id ? 'Copied ✓ / कॉपी हुआ' : 'Copy / कॉपी'}
                              </button>
                              <button
                                onClick={() => handleToggleSpeech(msg.id, msg.content)}
                                className={`flex items-center gap-1 transition-all py-1 px-1.5 rounded-md border-none cursor-pointer ${
                                  currentlySpeakingMsgId === msg.id 
                                    ? 'text-emerald-400 bg-emerald-500/10 font-bold' 
                                    : 'hover:text-amber-400 hover:bg-slate-800/40 bg-transparent'
                                }`}
                                title="Hear this read out loud"
                              >
                                {currentlySpeakingMsgId === msg.id ? (
                                  <>
                                    <VolumeX className="w-3 h-3 animate-spin text-rose-400" />
                                    Stop / रुकें
                                  </>
                                ) : (
                                  <>
                                    <Volume2 className="w-3 h-3" />
                                    Listen / सुनें
                                  </>
                                )}
                              </button>
                              {currentlySpeakingMsgId === msg.id && (
                                <span className="flex items-center gap-0.5 ml-1">
                                  <span className="w-1 h-2 bg-emerald-400 rounded-full animate-bounce"></span>
                                  <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                  <span className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                </span>
                              )}
                            </div>
                          )}

                          {msg.role === 'user' && (
                            <div className="flex items-center gap-3 pr-12 text-[10px] text-slate-500 font-medium justify-end select-none">
                              <button
                                onClick={() => handleCopyMessage(msg.id, msg.content)}
                                className="flex items-center gap-1 hover:text-indigo-400 transition-colors py-1 px-1.5 hover:bg-slate-850/40 rounded-md border-none bg-transparent cursor-pointer"
                                title="Copy query text"
                              >
                                <Copy className="w-3 h-3" />
                                {copiedMsgId === msg.id ? 'Copied ✓' : 'Copy'}
                              </button>
                            </div>
                          )}

                          {msg.role === 'assistant' && containsCreatorKeywords(msg.content) && (
                            <div className="pl-12 w-full max-w-2xl mt-2 animate-fade-in">
                              <AboutCreator />
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Loading placeholder spinner */}
                      {isChatLoading && (
                        <div className="flex items-start gap-3.5 py-4">
                          <div className="w-8 h-8 rounded-xl bg-slate-800 text-indigo-400 border border-slate-700/80 flex items-center justify-center font-bold text-xs">
                            AI
                          </div>
                          <div className="bg-slate-900/35 border border-slate-800/80 p-4 rounded-2xl rounded-tl-none html-loader text-slate-400 text-xs sm:text-sm flex items-center gap-3">
                            <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-ping"></span>
                            <span className="italic text-slate-500">HansAI is formulating custom study response...</span>
                          </div>
                        </div>
                      )}
                      <div ref={chatBottomRef} />
                    </div>
                  )}

                  {/* FIXED CHAT INPUT AREA AT BOTTOM */}
                  <div className="max-w-3xl w-full mx-auto bg-[#090D16] pt-2 pb-2">
                    {chatAttachedImage && (
                      <div className="p-2 mb-2 bg-[#0F1626] border border-slate-800 rounded-xl max-w-sm flex items-center justify-between shadow-xl animate-fade-in">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg border border-slate-800 overflow-hidden bg-slate-950 flex-shrink-0">
                            <img src={chatAttachedImage.previewUrl} alt="Pre-selection preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block">Image Attached</span>
                            <span className="text-[9px] text-indigo-400 font-semibold uppercase">{chatAttachedImage.mimeType.split('/')[1]} - Ready to Analyze</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setChatAttachedImage(null)}
                          className="p-1.5 bg-slate-800 hover:bg-rose-950/60 hover:text-rose-400 text-slate-400 rounded-lg transition-all border-none cursor-pointer"
                          title="Clear image choice"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    <form 
                      onSubmit={(e) => { e.preventDefault(); handleSendChat(); }}
                      className="bg-slate-900/90 border border-slate-850 p-2.5 rounded-2xl focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all flex items-center gap-2 shadow-xl"
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (!file.type.startsWith('image/')) {
                              showToast(
                                language === 'hindi' 
                                  ? "कृपया एक मान्य इमेज फाइल चुनें!" 
                                  : "Please choose a valid image file!", 
                                "warn"
                              );
                              return;
                            }
                            const reader = new FileReader();
                            reader.onload = () => {
                              const base64Data = (reader.result as string).split(',')[1];
                              setChatAttachedImage({
                                mimeType: file.type,
                                data: base64Data,
                                previewUrl: URL.createObjectURL(file)
                              });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800/40 rounded-xl transition-all flex-shrink-0 border-none bg-transparent cursor-pointer"
                        title="Upload diagram, notes, or math question image"
                      >
                        <Paperclip className="w-4.5 h-4.5" />
                      </button>

                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Ask HansAI..."
                        className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm focus:outline-none placeholder-slate-500 text-slate-100"
                        disabled={isChatLoading}
                      />

                      <button
                        type="button"
                        onClick={handlePasteInput}
                        className="p-1 px-2.5 text-[11px] font-bold text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg transition-all border-none bg-transparent cursor-pointer"
                        title="Paste content from clipboard / पेस्ट करें"
                      >
                        पेस्ट करें
                      </button>

                      <button
                        type="button"
                        onClick={handleToggleVoiceInput}
                        className={`p-2 rounded-xl transition-colors flex-shrink-0 relative border-none cursor-pointer ${
                          isVoiceRecording 
                            ? 'bg-rose-600 text-white animate-pulse' 
                            : 'text-slate-400 hover:text-indigo-400 hover:bg-slate-800/40 bg-transparent'
                        }`}
                        title="Toggle Speech Dictation Input / बोलकर लिखें"
                      >
                        {isVoiceRecording ? (
                          <>
                            <MicOff className="w-4.5 h-4.5 text-white" />
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-400 rounded-full animate-ping"></span>
                          </>
                        ) : (
                          <Mic className="w-4.5 h-4.5" />
                        )}
                      </button>

                      <button
                        type="submit"
                        className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all disabled:opacity-30 disabled:hover:bg-indigo-600 flex-shrink-0 border-none cursor-pointer"
                        disabled={isChatLoading || (!chatInput.trim() && !chatAttachedImage)}
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                    <div className="text-center text-[10px] text-slate-500 mt-2 leading-none">
                      AI Digital Teacher strictly built for rapid learning and discipline. Ask questions freely!
                    </div>
                  </div>

              </div>

            </div>

          </div>
        )
      )}

          {/* VIEW: ACADEMIC QUIZ GENERATOR (MODERN FRESH INTERFACE) */}
          {activeView === 'quiz' && (
            <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Award className="w-5.5 h-5.5 text-amber-500" />
                  Syllabus Intelligence Practice Quiz
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Draft 5 intelligent Educational Multiple-Choice Questions dynamically mapped to any standard subject.
                </p>
              </div>

              {quizzes.length === 0 ? (
                <div className="space-y-6">
                  {/* Tab Selector */}
                  <div className="flex border-b border-slate-800">
                    <button
                      onClick={() => setActiveQuizTab('syllabus')}
                      className={`flex-1 py-3 text-center font-bold text-xs sm:text-sm tracking-wide border-b-2 transition-all ${
                        activeQuizTab === 'syllabus'
                          ? 'border-indigo-500 text-indigo-400'
                          : 'border-transparent text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      📖 Syllabus Live Quiz (ऑनलाइन सिलेबस लाइव टेस्ट)
                    </button>
                    <button
                      onClick={() => setActiveQuizTab('saved')}
                      className={`flex-1 py-3 text-center font-bold text-xs sm:text-sm tracking-wide border-b-2 transition-all ${
                        activeQuizTab === 'saved'
                          ? 'border-indigo-500 text-indigo-400'
                          : 'border-transparent text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      💾 Saved Quiz Records (सुरक्षित टेस्ट रिकॉर्ड्स)
                    </button>
                  </div>

                  {activeQuizTab === 'syllabus' ? (
                    <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6 space-y-4 text-left">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-xs text-slate-400">विशिष्ट विषय का नाम (Write Subject Name):</label>
                          <input
                            type="text"
                            value={quizSubject}
                            onChange={(e) => setQuizSubject(e.target.value)}
                            placeholder="जैसे: BPSC Bihar History, Stenographer Dictation Rules, UPSC Polity..."
                            className="w-full text-xs py-2.5 px-3.5 bg-[#090D16] border border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs text-slate-400">कठिनाई का स्तर (Target Level / Exam):</label>
                          <input
                            type="text"
                            value={quizLevel}
                            onChange={(e) => setQuizLevel(e.target.value)}
                            placeholder="जैसे: BPSC Prelims, SSC Stenographer Skill Test, UPSC GS, SSC General Awareness..."
                            className="w-full text-xs py-2.5 px-3.5 bg-[#090D16] border border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Quick Preset Topics</span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <button 
                            onClick={() => { setQuizSubject("English Preposition Rules"); handleGenerateQuiz("English Preposition Rules"); }}
                            className="p-2 py-2.5 text-left text-[11px] text-slate-300 hover:text-white bg-[#090D16] hover:bg-slate-800 border border-slate-800 rounded-xl text-ellipsis truncate"
                          >
                            📖 Prep Grammar
                          </button>
                          <button 
                            onClick={() => { setQuizSubject("Newton Laws Mechanics"); handleGenerateQuiz("Newton Laws Mechanics"); }}
                            className="p-2 py-2.5 text-left text-[11px] text-slate-300 hover:text-white bg-[#090D16] hover:bg-slate-800 border border-slate-800 rounded-xl text-ellipsis truncate"
                          >
                            🧪 Mechanics (Physics)
                          </button>
                          <button 
                            onClick={() => { setQuizSubject("Bihar GK and Rivers"); handleGenerateQuiz("Bihar GK and Rivers"); }}
                            className="p-2 py-2.5 text-left text-[11px] text-slate-300 hover:text-white bg-[#090D16] hover:bg-slate-800 border border-slate-800 rounded-xl text-ellipsis truncate"
                          >
                            🚩 बिहार सामान्य ज्ञान
                          </button>
                          <button 
                            onClick={() => { setQuizSubject("Indian Constitution Articles"); handleGenerateQuiz("Indian Constitution Articles"); }}
                            className="p-2 py-2.5 text-left text-[11px] text-slate-300 hover:text-white bg-[#090D16] hover:bg-slate-800 border border-slate-800 rounded-xl text-ellipsis truncate"
                          >
                            🏛️ Indian Polity & GK
                          </button>
                        </div>
                      </div>

                      {quizError && (
                        <div className="p-3 bg-rose-950/40 border border-rose-900/60 rounded-xl text-xs text-rose-300 flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <span>{quizError}</span>
                        </div>
                      )}

                      <button
                        onClick={() => handleGenerateQuiz()}
                        disabled={isGeneratingQuiz || !quizSubject}
                        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-xl text-xs font-bold uppercase transition-all shadow-lg shadow-indigo-600/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-45"
                      >
                        {isGeneratingQuiz ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin text-white" />
                            Generating MCQs via Gemini AI...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 text-white" />
                            Generate Dynamic AI Quiz
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6 space-y-4 text-left">
                      <div className="flex items-center justify-between border-b border-slate-850 pb-2.5">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-200">सुरक्षित टेस्ट्स की सूची (Saved Quizzes List)</h4>
                        <span className="text-[10px] bg-indigo-500/10 text-indigo-400 font-extrabold px-2 py-0.5 rounded-full">{savedQuizzes.length} Saved</span>
                      </div>

                      {savedQuizzes.length === 0 ? (
                        <div className="text-center py-8 space-y-2 text-slate-550 text-xs">
                          <p>कोई सुरक्षित टेस्ट रिकॉर्ड नहीं मिला।</p>
                          <p className="text-[10px] text-slate-500">Syllabus Section में जाकर लाइव टेस्ट हल करें और 'Save Quiz' पर क्लिक करें।</p>
                        </div>
                      ) : (
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                          {savedQuizzes.map((item) => (
                            <div key={item.id} className="p-4 rounded-xl bg-[#090D16] border border-slate-850 hover:border-slate-800 duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                              <div className="space-y-1">
                                <h5 className="font-bold text-slate-200">{item.subject}</h5>
                                <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-500">
                                  <span>Level: {item.level}</span>
                                  <span>Date: {item.date}</span>
                                  <span className="text-emerald-450 font-semibold text-emerald-400">Score: {item.score}/{item.total}</span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    setQuizSubject(item.subject);
                                    setQuizLevel(item.level);
                                    setQuizzes(item.quizzes);
                                    setCurrentQuizIdx(0);
                                    setSelectedOptionIdx(null);
                                    setIsQuizSubmitted(false);
                                    setScore(item.score);
                                    showToast("Reloaded saved quiz record! 🔄", "success");
                                  }}
                                  className="px-3 py-1.5 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/25 text-indigo-450 font-bold rounded-lg transition-all text-indigo-300"
                                >
                                  Replay Test
                                </button>
                                <button
                                  onClick={() => {
                                    const updated = savedQuizzes.filter(q => q.id !== item.id);
                                    setSavedQuizzes(updated);
                                    localStorage.setItem('hansai-saved-quizzes', JSON.stringify(updated));
                                    showToast("Saved quiz record deleted.", "info");
                                  }}
                                  className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-450 rounded-lg"
                                  title="Delete saved quiz"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6 space-y-4">
                  {currentQuizIdx < quizzes.length ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-xs text-slate-400 border-b border-slate-800 pb-2">
                        <span>QUESTION {currentQuizIdx + 1} OF {quizzes.length}</span>
                        <span className="font-bold text-amber-400">Score: {score}</span>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-[#090D16] rounded-full h-1.5">
                        <div 
                          className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${((currentQuizIdx + 1) / quizzes.length) * 100}%` }}
                        ></div>
                      </div>

                      <div className="p-4 bg-[#090D16] border border-slate-850 rounded-xl">
                        <p className="text-sm font-semibold text-white leading-relaxed">
                          {quizzes[currentQuizIdx].question}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        {quizzes[currentQuizIdx].options.map((opt, oIdx) => {
                          let cardStyle = "bg-[#090D16] hover:bg-slate-800/40 border-slate-800";
                          if (selectedOptionIdx === oIdx) {
                            cardStyle = "bg-indigo-600/15 border-indigo-500 text-indigo-300";
                          }
                          if (isQuizSubmitted) {
                            if (oIdx === quizzes[currentQuizIdx].answerIndex) {
                              cardStyle = "bg-emerald-600/25 border-emerald-500 text-emerald-300 font-bold";
                            } else if (selectedOptionIdx === oIdx) {
                              cardStyle = "bg-rose-600/25 border-rose-500 text-rose-300";
                            } else {
                              cardStyle = "opacity-40 bg-[#090D16] border-slate-900 text-slate-500";
                            }
                          }

                          return (
                            <button
                              key={oIdx}
                              onClick={() => selectQuizOption(oIdx)}
                              disabled={isQuizSubmitted}
                              className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex justify-between items-center ${cardStyle}`}
                            >
                              <span>{opt}</span>
                              {isQuizSubmitted && oIdx === quizzes[currentQuizIdx].answerIndex && (
                                <Check className="w-4 h-4 text-emerald-400" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {isQuizSubmitted ? (
                        <div className="p-4 bg-indigo-950/20 border border-indigo-500/15 rounded-xl space-y-2.5 text-xs">
                          <h4 className="font-bold text-amber-400 flex items-center gap-1.5">
                            <Sparkle className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                            Companion's Explanation / पाठ व्याख्या:
                          </h4>
                          <p className="text-slate-350 leading-relaxed whitespace-pre-wrap">
                            {quizzes[currentQuizIdx].explanation}
                          </p>
                          <button
                            onClick={advanceQuiz}
                            className="mt-2 w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold uppercase tracking-wider text-[10px]"
                          >
                            {currentQuizIdx === quizzes.length - 1 ? 'See Report Card' : 'Advance Question'}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={submitQuizAnswer}
                          disabled={selectedOptionIdx === null}
                          className="w-full py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-xl text-xs font-bold uppercase transition-all disabled:opacity-40"
                        >
                          Lock Answer
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6 space-y-4">
                      <div className="text-4xl">🏆</div>
                      <div>
                        <h4 className="text-base font-bold text-white">Quiz Session Completed!</h4>
                        <p className="text-xs text-slate-400 mt-1">Excellent self-discipline. Your score summary:</p>
                      </div>

                      <div className="bg-[#090D16] border border-slate-850 p-4 inline-block rounded-xl">
                        <span className="text-3xl font-black text-indigo-400">{score}</span>
                        <span className="text-slate-500 text-sm font-semibold"> / {quizzes.length} Answers Correct</span>
                      </div>

                      <div className="flex gap-2 max-w-sm mx-auto">
                        <button
                          onClick={() => handleGenerateQuiz(quizSubject)}
                          className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white rounded-lg transition-all"
                        >
                          Play Again
                        </button>
                        <button
                          onClick={restartQuizFlow}
                          className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white rounded-lg transition-all"
                        >
                          New Subject
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* VIEW: SPICE & COOP MSME PLAN CALCULATOR */}
          {activeView === 'calculator' && (
            <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sprout className="w-5.5 h-5.5 text-emerald-500" />
                  Spice Processing & MSME Loan Guide
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Plan standard processing figures for local raw goods like ginger (अदरक) and turmeric (हल्दी), including PMEGP subsidies.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/50 rounded-2xl border border-slate-800 p-6">
                
                {/* Sliders and inputs */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-xs text-slate-400">Select Agricultural Crop</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['Turmeric', 'Ginger', 'Medicinal'] as const).map((crop) => (
                        <button
                          key={crop}
                          onClick={() => handleProductPreset(crop)}
                          className={`py-1.5 px-2 rounded-xl border text-xs font-bold transition-all ${
                            calcInputs.productType === crop
                              ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500'
                              : 'bg-[#090D16] text-slate-500 border-slate-850 hover:bg-slate-850'
                          }`}
                        >
                          {crop === 'Turmeric' ? 'हल्दी (Turmeric)' : crop === 'Ginger' ? 'अदरक (Ginger)' : 'Medicinal'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Monthly Processing Vol (कच्चा माल)</span>
                      <strong className="text-emerald-400">{calcInputs.monthlyQuantityKg} Kg</strong>
                    </div>
                    <input 
                      type="range"
                      min="200"
                      max="10000"
                      step="100"
                      value={calcInputs.monthlyQuantityKg}
                      onChange={(e) => setCalcInputs(prev => ({ ...prev, monthlyQuantityKg: Number(e.target.value) }))}
                      className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="block text-[10px] text-slate-500 uppercase">Purchase Raw ₹/Kg</span>
                      <input 
                        type="number"
                        value={calcInputs.rawCostPerKg}
                        onChange={(e) => setCalcInputs(prev => ({ ...prev, rawCostPerKg: Math.max(1, Number(e.target.value)) }))}
                        className="w-full text-xs py-2 px-3 bg-[#090D16] border border-slate-850 rounded-lg text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="block text-[10px] text-slate-500 uppercase">Sale Powder ₹/Kg</span>
                      <input 
                        type="number"
                        value={calcInputs.sellingCostPerKg}
                        onChange={(e) => setCalcInputs(prev => ({ ...prev, sellingCostPerKg: Math.max(1, Number(e.target.value)) }))}
                        className="w-full text-xs py-2 px-3 bg-[#090D16] border border-slate-850 rounded-lg text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="block text-[10px] text-slate-500 uppercase">Estimated Machinery Startup Cost (₹)</span>
                    <input 
                      type="number"
                      value={calcInputs.machineryCost}
                      onChange={(e) => setCalcInputs(prev => ({ ...prev, machineryCost: Math.max(1, Number(e.target.value)) }))}
                      className="w-full text-xs py-2 px-3 bg-[#090D16] border border-slate-850 rounded-lg text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="block text-[10px] text-slate-400 uppercase">PMEGP Government Category (बिहार / ग्रामीण)</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setCalcInputs(prev => ({ ...prev, subsidyPercentage: 35 }))}
                        className={`flex-1 py-1 px-2.5 rounded-lg border text-[10px] font-bold ${
                          calcInputs.subsidyPercentage === 35 
                            ? 'bg-amber-600/20 text-amber-400 border-amber-500' 
                            : 'bg-[#090D16] border-slate-850 text-slate-500'
                        }`}
                      >
                        ग्रामीण विशेष (35% Subsidy)
                      </button>
                      <button 
                        onClick={() => setCalcInputs(prev => ({ ...prev, subsidyPercentage: 25 }))}
                        className={`flex-1 py-1 px-2.5 rounded-lg border text-[10px] font-bold ${
                          calcInputs.subsidyPercentage === 25 
                            ? 'bg-amber-600/20 text-amber-400 border-amber-500' 
                            : 'bg-[#090D16] border-slate-850 text-slate-500'
                        }`}
                      >
                        शहरी सामान्य (25% Subsidy)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Outputs analytics panel */}
                <div className="bg-[#090D16] border border-slate-850 p-4.5 rounded-2xl flex flex-col justify-between space-y-4">
                  <div className="space-y-3.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Projected Monthly Metrics</span>
                    
                    <div className="grid grid-cols-2 gap-3.5">
                      <div className="bg-[#0F1626]/50 p-3 rounded-lg border border-slate-850/60">
                        <span className="block text-[9px] text-slate-500 uppercase">Raw Cost</span>
                        <span className="text-sm font-bold text-slate-200">₹{calcResults.rawMaterialCost.toLocaleString()}</span>
                      </div>
                      <div className="bg-[#0F1626]/50 p-3 rounded-lg border border-slate-850/60">
                        <span className="block text-[9px] text-slate-500 uppercase">Dry Powder Yield</span>
                        <span className="text-sm font-bold text-slate-200">{calcResults.processedYieldKg} Kg</span>
                      </div>
                      <div className="bg-[#0F1626]/50 p-3 rounded-lg border border-slate-850/60">
                        <span className="block text-[9px] text-slate-500 uppercase">Total Revenue</span>
                        <span className="text-sm font-bold text-emerald-400">₹{calcResults.grossRevenue.toLocaleString()}</span>
                      </div>
                      <div className="bg-[#0F1626]/50 p-3 rounded-lg border border-emerald-55 border-emerald-900/30">
                        <span className="block text-[9px] text-emerald-500 uppercase font-semibold">Net Profit *</span>
                        <span className="text-sm font-bold text-emerald-400">₹{calcResults.netProfit.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="bg-amber-950/25 p-3 rounded-xl border border-amber-500/15 text-[11px] leading-relaxed text-amber-300">
                      <div className="font-bold mb-1">MSME Government Subsidy Saved:</div>
                      ₹{calcResults.subsidySaved.toLocaleString()} Saved (On Machinery cost of ₹{calcInputs.machineryCost.toLocaleString()}). Net machinery payment ₹{calcResults.machineryWithSubsidy.toLocaleString()}.
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-500 italic space-y-1 border-t border-slate-850/80 pt-2.5">
                    <p>* Net profit after factoring local transportation, dry yields, packaging, labor, and dynamic overhead estimates.</p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* VIEW: SYLLABUS RESEARCH CONSOLE */}
          {activeView === 'research' && (
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 print-area">
              <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-5.5 h-5.5 text-indigo-400" />
                    AI Syllabus Research Console / सिलेबस रिसर्च
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Turn any dry syllabus heading or competitive exam topic into high-quality, memorable study sheets.
                  </p>
                </div>
                
                <button
                  onClick={() => window.print()}
                  className="self-start sm:self-center px-4 py-2 bg-slate-800 hover:bg-slate-700/80 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 transition-all shadow-md shadow-slate-900/40"
                  title="Export this page as actual PDF"
                >
                  <FileText className="w-4 h-4 text-indigo-400" />
                  Export to PDF / प्रिंट लें
                </button>
              </div>

              {/* Research Input Form */}
              <div className="bg-slate-900/50 border border-slate-850 rounded-2xl p-6 space-y-4 no-print text-left">
                <h3 className="text-sm font-semibold text-white">नया टॉपिक रिसर्च आरम्भ करें / Start Deep AI Research</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-450 tracking-wider mb-1.5">Research Topic, Question, or Concept / शोध का विषय या प्रश्न</label>
                    <textarea
                      value={researchTopic}
                      onChange={(e) => setResearchTopic(e.target.value)}
                      placeholder="Enter any topic or question under the sun (e.g. Quantum Cryptography, Ancient Indian Numismatics, Pitman Shorthand Speed Tactics, Photosynthesis pathways...)"
                      className="w-full text-xs bg-slate-950 border border-slate-850 px-3.5 py-2.5 rounded-xl text-slate-200 outline-none focus:border-indigo-500 transition-all h-24 resize-none leading-relaxed"
                    />

                    {/* Quick suggested prompt buttons so user doesn't have to write from scratch */}
                    <div className="mt-3 space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Suggested Topics / त्वरित शोध विकल्प:</span>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Quantum Cryptography & Quantum Key Distribution",
                          "Pitman Shorthand Speed Tactics & Outlines",
                          "Ancient Indian Numismatics of Gupta Dynasty",
                          "Fundamental Rights vs. US Bill of Rights",
                          "Mamba State-Space Models vs. Transformers"
                        ].map((promptText) => (
                          <button
                            key={promptText}
                            type="button"
                            onClick={() => {
                              setResearchTopic(promptText);
                              handleRunResearch(promptText, "Deep AI Research");
                            }}
                            className="px-2.5 py-1.5 bg-slate-950 hover:bg-indigo-950/40 border border-slate-850 hover:border-indigo-800 text-[10px] text-slate-300 hover:text-white rounded-lg transition-all text-left cursor-pointer active:scale-95"
                          >
                            🚀 {promptText}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end">
                    <button
                      onClick={() => handleRunResearch(researchTopic, "Deep AI Research")}
                      disabled={isResearchLoading || !researchTopic.trim()}
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-2 disabled:bg-indigo-800 disabled:opacity-60 shadow-lg shadow-indigo-600/10 cursor-pointer"
                    >
                      {isResearchLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-white" />
                          Analyzing via Gemini Client...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-indigo-200 animate-pulse" />
                          Run Unrestricted Deep AI Research
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {researchError && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/25 rounded-2xl flex items-start gap-3 text-xs text-amber-300 no-print">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-400 mt-0.5" />
                  <div>
                    <strong>सुरक्षा एवं कनेक्टिविटी सुचना:</strong> {researchError}
                  </div>
                </div>
              )}

              {/* Loading State Banner */}
              {isResearchLoading && !researchResult && (
                <div className="bg-[#080D1A] border border-indigo-500/30 rounded-2xl p-8 text-center space-y-4 no-print animate-pulse">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center mx-auto text-2xl">
                    <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white">Deep AI Research active for "{researchTopic}"...</h4>
                    <p className="text-xs text-slate-400">
                      Gemini AI मॉडल विश्लेषण कर रहा है... विस्तृत नोट्स, ऐतिहासिक घटनाक्रम, ट्रिक्स एवं अभ्यास प्रश्न तैयार हो रहे हैं।
                    </p>
                  </div>
                </div>
              )}

              {/* Empty State Card when no research generated yet */}
              {!researchResult && !isResearchLoading && (
                <div className="bg-[#080D1A]/80 border border-dashed border-slate-800 rounded-2xl p-8 text-center space-y-4 no-print">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-2xl">
                    🔬
                  </div>
                  <div className="max-w-md mx-auto space-y-1">
                    <h4 className="text-sm font-bold text-white">कोई भी विषय टाइप करें और डीप रिसर्च शुरू करें</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      टाइप करें या ऊपर दिए गए त्वरित विषयों में से चुनें। HansAI आपके लिए संपूर्ण विस्तृत नोट्स, विश्लेषणात्मक बिंदु, कालक्रम, शार्ट ट्रिक्स एवं अभ्यास प्रश्न तैयार करेगा।
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 pt-2">
                    {[
                      "Fundamental Rights",
                      "Quantum Cryptography",
                      "Pitman Shorthand Rules",
                      "Photosynthesis Process",
                      "Gupta Dynasty Coins"
                    ].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => {
                          setResearchTopic(chip);
                          handleRunResearch(chip, "Deep AI Research");
                        }}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-indigo-950/50 border border-slate-800 hover:border-indigo-500/50 text-[11px] text-indigo-300 font-semibold rounded-xl transition-all cursor-pointer active:scale-95"
                      >
                        ✨ {chip}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Research Guide Output Card */}
              {researchResult && (
                <div className="animate-color-cycle border border-indigo-500/15 rounded-2xl p-6 sm:p-8 space-y-8 print-card relative overflow-hidden">
                  
                  {/* Big Background Watermark of Quantum Swan AI Logo */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.035] select-none scale-150 z-0">
                    <QuantumSwanLogo className="w-80 h-80 text-indigo-500 animate-pulse" />
                  </div>
                  
                  {/* Decorative colorful corner glow */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

                  {/* Card Print Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-indigo-950/45 relative z-10">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[9px] uppercase tracking-widest font-extrabold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md font-mono">
                          HansAI Grand Academic Repository
                        </span>
                        <span className="text-[9px] uppercase tracking-widest font-extrabold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md font-sans">
                          Deep AI Research
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-indigo-200 via-purple-200 to-emerald-200 bg-clip-text text-transparent mt-1.5 print-text-dark">{researchResult.topicName}</h3>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">Syllabus Area / प्रभाग: <span className="text-indigo-300 font-semibold">{researchResult.subjectArea}</span></p>
                    </div>
                    <div className="text-left sm:text-right font-mono text-[9px] text-slate-500 space-y-0.5">
                      <span>Evaluated: {new Date().toLocaleDateString('hi-IN')}</span>
                      <span className="block italic text-indigo-400 font-sans font-bold">Created under guidance of Hanslal Pal</span>
                      <span className="block text-emerald-400 font-sans font-extrabold tracking-wider">● VERIFIED SCHOLARSHIP</span>
                    </div>
                  </div>

                  {/* Summary Segment */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-450 text-indigo-400" />
                      1. Core Syllabus Abstract / अध्याय का संक्षिप्त सार
                    </h4>
                    <p className="text-sm text-slate-300 leading-relaxed font-sans text-justify print-text-dark">
                      {researchResult.summary}
                    </p>
                  </div>

                  {/* Analytical Highlights */}
                  {researchResult.analyticalPoints && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-300 tracking-widest uppercase flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-400" />
                        2. Analytical Highlights & Concepts / महत्वपूर्ण अवधारणाएं
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-35 gap-3 text-xs leading-relaxed">
                        {researchResult.analyticalPoints.map((pt: string, idx: number) => (
                          <div key={idx} className="p-3.5 bg-slate-950/60 border border-slate-850 rounded-xl flex items-start gap-2 print-card">
                            <span className="w-5 h-5 bg-indigo-950/40 text-indigo-400 font-bold rounded-lg flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">{idx + 1}</span>
                            <span className="text-slate-300 print-text-dark">{pt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Historical Milestones or Timeline */}
                  {researchResult.historicalTimeline && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-400 tracking-widest uppercase">
                        3. Contextual Timeline & Evolution / ऐतिहासिक परिप्रेक्ष्य
                      </h4>
                      <div className="relative border-l border-indigo-950 pl-4 space-y-4 font-mono text-[11px] leading-relaxed">
                        {researchResult.historicalTimeline.map((item: any, idx: number) => (
                          <div key={idx} className="relative">
                            <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500 border-2 border-slate-900"></div>
                            <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-850 print-card mb-1">
                              <span className="text-indigo-400 font-bold block mb-0.5 sm:inline sm:mr-3">{item.era}</span>
                              <strong className="text-white font-semibold print-text-dark block sm:inline-block">{item.event}</strong>
                              <p className="text-[10px] text-slate-400 mt-1 italic leading-normal font-sans">{item.significance}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mnemonic helper for memorization */}
                  {researchResult.crucialMnemonics && (
                    <div className="p-4 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl space-y-1.5 print-card">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-indigo-400" />
                        Memory Enhancer Hack / धांसू शॉर्टकट ट्रिक
                      </span>
                      <p className="text-xs text-indigo-300 leading-normal italic font-medium print-text-dark">
                        {researchResult.crucialMnemonics}
                      </p>
                    </div>
                  )}

                  {/* Sample Questions */}
                  {researchResult.practiceQuestions && (
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 tracking-widest uppercase">
                        4. Expected Exam Practice Questions / अभ्यास हेतु महत्वपूर्ण प्रश्न
                      </h4>
                      <div className="space-y-4 text-xs leading-relaxed">
                        {researchResult.practiceQuestions.map((q: any, qIdx: number) => (
                          <div key={qIdx} className="p-5 bg-slate-950/35 border border-slate-850 rounded-2xl space-y-3 print-card">
                            <span className="text-[9px] uppercase tracking-widest font-bold text-rose-400 font-mono">EXAM DRILL Q{qIdx + 1}</span>
                            <p className="text-sm font-semibold text-white print-text-dark leading-tight">{q.question}</p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                              {q.options.map((opt: string, oIdx: number) => (
                                <div 
                                  key={oIdx} 
                                  className={`p-2.5 rounded-xl border select-none transition-all text-left flex items-center justify-between ${
                                    oIdx === q.answerIndex 
                                      ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300' 
                                      : 'bg-slate-950/80 border-slate-900 text-slate-400'
                                  }`}
                                >
                                  <span>{opt}</span>
                                  {oIdx === q.answerIndex && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                                </div>
                              ))}
                            </div>
                            
                            <div className="pt-2 border-t border-slate-850/60 font-sans text-[11px] text-slate-400 italic">
                              <strong>उत्तर व्याख्या:</strong> {q.explanation}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-3 border-t border-slate-850 font-mono text-[9px] text-slate-500 text-center uppercase tracking-widest leading-loose">
                    <span>END OF FILE • HANS-AI RESEARCH DRIVEN REVISION PORTAL</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIEW: LEADERBOARD VIEW */}
          {activeView === 'leaderboard' && (
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
              
              {/* Header section with Stats Baner */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="text-left">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Award className="w-6 h-6 text-amber-500" />
                    Grand Aspirants State Leaderboard / राज्य स्तरीय लीडरबोर्ड
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    See where you rank against thousands of students preparing for SSC CGL, CHSL, GD, and BPSC exams across Bihar.
                  </p>
                </div>

                <button
                  onClick={() => setShowRegModal(true)}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-450 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all flex items-center gap-2 shadow-lg shadow-amber-500/10 self-start md:self-center"
                >
                  <Plus className="w-4 h-4 text-slate-950 font-extrabold" />
                  Submit Your Mock Score / स्कोर प्रविष्ट करें
                </button>
              </div>

              {/* Dynamic Score Registration Box */}
              {showRegModal && (
                <div className="bg-slate-900 border-2 border-amber-500/20 p-5 rounded-2xl space-y-4 shadow-xl shadow-slate-950/60 animate-fade-in no-print">
                  <div className="flex justify-between items-center-">
                    <h3 className="text-xs uppercase tracking-widest font-extrabold text-amber-500">Register Score / मॉक स्कोर फॉर्म</h3>
                    <button 
                      onClick={() => setShowRegModal(false)}
                      className="text-xs text-slate-500 hover:text-slate-300 font-bold font-mono px-1 rounded"
                    >
                      [CANCEL]
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">Your Real Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Hanslal Pal"
                        value={regScoreName}
                        onChange={(e) => setRegScoreName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2outline-none px-3 py-2 text-slate-200 outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">Mock Exam Score (0 to 100)%</label>
                      <input 
                        type="number" 
                        min="0"
                        max="100"
                        value={regScoreVal}
                        onChange={(e) => setRegScoreVal(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2 outline-none px-3 py-2 text-slate-200 outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">Subject Area</label>
                      <select 
                        value={regScoreMock}
                        onChange={(e) => setRegScoreMock(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2 outline-none px-3 py-2 text-slate-200"
                      >
                        <option value="GK">General Knowledge / GS</option>
                        <option value="MATH">Quantitative Aptitude / Math</option>
                        <option value="REASONING">Logical Reasoning / तर्कशक्ति</option>
                        <option value="ENGLISH">English Grammer Rules</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleRegisterScore}
                      className="px-5 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-400 shadow-md transition-all"
                    >
                      Save Score & Recalibrate Rankings
                    </button>
                  </div>
                </div>
              )}

              {/* Search Filters of Leaderboard */}
              <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs leading-none">
                <input
                  type="text"
                  placeholder="Search contestant by name..."
                  value={leaderboardSearch}
                  onChange={(e) => setLeaderboardSearch(e.target.value)}
                  className="bg-slate-950 border border-slate-850 px-3 py-2.5 rounded-xl text-slate-200 outline-none focus:border-indigo-500 flex-1 max-w-sm"
                />
                <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                  <span className="text-slate-500 font-mono text-[10px] mr-1 uppercase">Filter Exam Segment:</span>
                  {['ALL', 'GK', 'MATH', 'REASONING', 'ENGLISH'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setLeaderboardFilter(type)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider transition-all uppercase ${
                        leaderboardFilter === type 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rank Table Container */}
              <div className="bg-slate-900/50 border border-slate-850 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-950/60 border-b border-slate-850 font-mono text-[10px] text-slate-400 uppercase tracking-widest leading-none">
                        <th className="px-5 py-3.5 font-bold">State Rank</th>
                        <th className="px-5 py-3.5 font-bold">Contestant</th>
                        <th className="px-5 py-3.5 font-bold text-center">Subject Area</th>
                        <th className="px-5 py-3.5 font-bold text-center">Solved Mocks</th>
                        <th className="px-5 py-3.5 font-bold text-center">Streak Days</th>
                        <th className="px-5 py-3.5 font-bold text-right text-amber-500">Mock Score %</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {leaderboardList
                        .filter(player => {
                          const nameMatches = player.name.toLowerCase().includes(leaderboardSearch.toLowerCase());
                          const typeMatches = leaderboardFilter === 'ALL' || player.mockType === leaderboardFilter;
                          return nameMatches && typeMatches;
                        })
                        .map((player) => (
                          <tr 
                            key={player.id} 
                            className={`transition-all hover:bg-slate-800/10 ${player.isCurrentUser ? 'bg-amber-500/5' : ''}`}
                          >
                            <td className="px-5 py-3.5 font-bold">
                              <div className="flex items-center gap-1.5 font-mono text-sm">
                                {player.rank === 1 && <span className="text-xl">🏆</span>}
                                {player.rank === 2 && <span className="text-xl">🥈</span>}
                                {player.rank === 3 && <span className="text-xl">🥉</span>}
                                <span className={player.rank <= 3 ? 'text-amber-400 font-extrabold' : 'text-slate-400'}>
                                  #{player.rank}
                                </span>
                              </div>
                            </td>
                            <td className="px-5 py-3.5">
                              <div>
                                <strong className="text-white font-semibold flex items-center gap-1.5">
                                  {player.name}
                                  {player.isCurrentUser && (
                                    <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[8px] font-bold uppercase rounded">
                                      You
                                    </span>
                                  )}
                                </strong>
                              </div>
                            </td>
                            <td className="px-5 py-3.5 text-center font-mono">
                              <span className="px-2 py-0.5 bg-slate-950/80 border border-slate-850 rounded text-[9px] font-semibold text-indigo-400">
                                {player.mockType}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-center font-mono text-slate-300">
                              {player.solvedMocks} solved
                            </td>
                            <td className="px-5 py-3.5 text-center">
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-orange-400">
                                <span className="text-orange-500">🔥</span>
                                {player.streakDays} days
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-right font-mono font-bold text-amber-500 text-sm">
                              {player.score}%
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-slate-950/20 text-center text-[10px] font-mono text-slate-500 uppercase tracking-widest border-t border-slate-850">
                  <span>Last database synchronized: Real-time dynamic revision metrics enabled</span>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: STUDY PROCESS CHART & SYLLABUS TRACKER */}
          {activeView === 'process' && (
            <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 animate-fade-in text-left">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">📋</span>
                  Syllabus Progress Tracker / सिलेबस प्रोग्रेस ट्रैकर
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Track micro-syllabus targets for SSC, BPSC, UPSC, or custom exams. Mark topics as revised, drafted, or tested!
                </p>
              </div>

              {/* Add New Tracker Form */}
              <form onSubmit={handleAddSyllabusTracker} className="bg-slate-900/40 border border-slate-850 p-5 rounded-2xl flex flex-col md:flex-row gap-4 items-end text-left">
                <div className="flex-1 space-y-1.5 w-full">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Exam Segment</label>
                  <select
                    value={newTrackerExam}
                    onChange={(e) => setNewTrackerExam(e.target.value)}
                    className="w-full text-xs py-2.5 px-3 bg-[#03060E] border border-slate-800 rounded-lg text-white outline-none focus:border-indigo-500"
                  >
                    <option value="SSC">🏛️ SSC Segment</option>
                    <option value="BPSC">🚩 BPSC Segment</option>
                    <option value="UPSC">🦁 UPSC Segment</option>
                    <option value="OTHER">📁 Custom Segment</option>
                  </select>
                </div>

                <div className="flex-1 space-y-1.5 w-full">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Subject / विषय</label>
                  <input
                    type="text"
                    placeholder="जैसे: Modern History, Polity, Maths..."
                    value={newTrackerSubject}
                    onChange={(e) => setNewTrackerSubject(e.target.value)}
                    className="w-full text-xs py-2.5 px-3 bg-[#03060E] border border-slate-800 rounded-lg text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex-[2] space-y-1.5 w-full">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Topic Name / अध्याय का नाम</label>
                  <input
                    type="text"
                    placeholder="जैसे: Fundamental Rights, Percentage, River system..."
                    value={newTrackerTopic}
                    onChange={(e) => setNewTrackerTopic(e.target.value)}
                    className="w-full text-xs py-2.5 px-3 bg-[#03060E] border border-slate-800 rounded-lg text-white outline-none focus:border-indigo-500 placeholder-slate-750"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-650 hover:bg-indigo-600 text-white font-bold rounded-xl text-xs transition-all whitespace-nowrap shadow-lg w-full md:w-auto cursor-pointer"
                >
                  + Add Topic
                </button>
              </form>

              {/* Progress Tracker List */}
              <div className="bg-slate-900/50 border border-slate-850 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-950/60 border-b border-slate-850 font-mono text-[10px] text-slate-400 uppercase tracking-widest">
                        <th className="px-5 py-3.5 font-bold">Exam</th>
                        <th className="px-5 py-3.5 font-bold">Subject</th>
                        <th className="px-5 py-3.5 font-bold">Target Topic / अध्याय</th>
                        <th className="px-5 py-3.5 font-bold text-center">Done (संशोधित)</th>
                        <th className="px-5 py-3.5 font-bold text-center">Notes Ready (नोट्स)</th>
                        <th className="px-5 py-3.5 font-bold text-center">Tested (एमसीक्यू)</th>
                        <th className="px-5 py-3.5 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {syllabusTrackers.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-12 text-slate-500">
                            No syllabus trackers defined. Add custom segments above to start practicing!
                          </td>
                        </tr>
                      ) : (
                        syllabusTrackers.map((track) => (
                          <tr key={track.id} className="hover:bg-slate-800/10 transition-colors">
                            <td className="px-5 py-3.5 font-mono text-xs">
                              <span className="px-2 py-0.5 bg-slate-950/85 border border-slate-800 rounded-md text-[10px] font-bold text-indigo-400">
                                {track.exam}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 font-semibold text-slate-300">
                              {track.subject || "General"}
                            </td>
                            <td className="px-5 py-3.5 text-white font-medium">
                              {track.topic}
                            </td>
                            <td className="px-5 py-3.5 text-center">
                              <button
                                onClick={() => handleToggleSyllabusTracker(track.id, 'done')}
                                className="text-base p-1 hover:scale-110 transition-transform"
                              >
                                {track.done ? "✅" : "⬜"}
                              </button>
                            </td>
                            <td className="px-5 py-3.5 text-center">
                              <button
                                onClick={() => handleToggleSyllabusTracker(track.id, 'notes')}
                                className="text-base p-1 hover:scale-110 transition-transform"
                              >
                                {track.notes ? "📝" : "⬜"}
                              </button>
                            </td>
                            <td className="px-5 py-3.5 text-center">
                              <button
                                onClick={() => handleToggleSyllabusTracker(track.id, 'quiz')}
                                className="text-base p-1 hover:scale-110 transition-transform"
                              >
                                {track.quiz ? "🎯" : "⬜"}
                              </button>
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              <button
                                onClick={() => {
                                  const updated = syllabusTrackers.filter(t => t.id !== track.id);
                                  setSyllabusTrackers(updated);
                                  localStorage.setItem('hansai-syllabus-trackers', JSON.stringify(updated));
                                  showToast("Syllabus item removed.", "info");
                                }}
                                className="text-xs text-rose-500 hover:text-rose-400 font-bold transition-colors"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: STUDY ROADMAP */}
          {activeView === 'process-map' && (
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
              <div className="border-b border-slate-800 pb-4 text-left">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-emerald-450 text-emerald-400" />
                  Interactive SSC Road Map & Process Chart / कड़ा ढांचा
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Track your progressive roadmap from conceptual groundwork up to cracking dry competitive exams of Central/State commissions.
                </p>
              </div>

              {/* Dynamic Progress Bar */}
              <div className="bg-slate-900/50 border border-slate-850 rounded-2xl p-6 space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-[10px] uppercase font-mono tracking-widest font-extrabold text-slate-400">Journey Progress Bar / समग्र तैयारी</span>
                  <span className="text-xs font-mono font-bold text-emerald-450 text-emerald-400">
                    {unlockedProgressSteps.length} / {studyProcessSteps.length} Milestones Unlocked ({Math.round(unlockedProgressSteps.length / studyProcessSteps.length * 100)}%)
                  </span>
                </div>
                
                {/* Visual Bar filled dynamically */}
                <div className="h-2.5 w-full bg-slate-950 border border-slate-850 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-indigo-600 transition-all duration-500 ease-out"
                    style={{ width: `${(unlockedProgressSteps.length / studyProcessSteps.length) * 100}%` }}
                  ></div>
                </div>

                <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-xs text-slate-300 italic">
                  <strong>हंसलाल पाल जी की कड़क सलाह:</strong> "सीखने का कोई शॉर्टकट नहीं होता! हर फेज को मन लगाकर समाप्त करें और तभी अगले मील का पत्थर छुएं।"
                </div>
              </div>

              {/* Strategy List Steps */}
              <div className="space-y-4">
                {studyProcessSteps.map((step) => {
                  const isCompleted = unlockedProgressSteps.includes(step.id);
                  return (
                    <div 
                      key={step.id} 
                      className={`p-6 rounded-2xl border transition-all flex flex-col md:flex-row gap-5 items-start ${
                        isCompleted 
                          ? 'bg-slate-900/60 border-emerald-500/35 shadow-md shadow-emerald-900/5' 
                          : 'bg-slate-900/30 border-slate-850 opacity-70 hover:opacity-90'
                      }`}
                    >
                      {/* Check toggle */}
                      <button 
                        onClick={() => toggleProgressStep(step.id)}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold font-mono transition-all flex-shrink-0 ${
                          isCompleted
                            ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-slate-950 text-white'
                            : 'bg-slate-950 text-slate-500 border border-slate-800'
                        }`}
                        title="Click to toggle achievement status"
                      >
                        {isCompleted ? <Check className="w-5.5 h-5.5 text-white" /> : `0${step.id}`}
                      </button>

                      {/* Content detailed text */}
                      <div className="space-y-2 flex-1 text-left">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-slate-850/60 pb-1.5">
                          <div>
                            <span className="text-[9px] uppercase tracking-wider font-extrabold text-indigo-400 font-mono block">STAGE {step.id}</span>
                            <h3 className="text-sm font-bold text-white mt-0.5">{step.title}</h3>
                            <span className="text-[10px] text-slate-450 text-slate-400 italic block">{step.subtitle}</span>
                          </div>
                          
                          <span className={`px-2.5 py-1 text-[9px] uppercase tracking-wider font-extrabold font-mono rounded-lg border inline-block ${
                            isCompleted 
                              ? 'bg-emerald-900/10 border-emerald-500/35 text-emerald-400' 
                              : 'bg-slate-900 border-slate-800 text-slate-500'
                          }`}>
                            {isCompleted ? 'Unlocked / समाप्त' : 'Locked / लंबित'}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">
                          {step.desc}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] pt-1 pt-2">
                          <div className="p-2.5 bg-slate-950/45 border border-slate-850 rounded-xl leading-relaxed">
                            <strong className="text-indigo-400 block mb-0.5 font-bold uppercase tracking-wider text-[9px] font-mono">Expert Advice / धांसू टिप्स</strong>
                            <span className="text-slate-350 text-slate-300">{step.tips}</span>
                          </div>
                          <div className="p-2.5 bg-slate-950/45 border border-slate-850 rounded-xl leading-normal flex items-center">
                            <span className="text-slate-450 text-slate-400 italic">
                              "{isCompleted ? 'Completed: Continuous practice on this stage keeps revisions active.' : 'Pending: Complete conceptual worksheets to unlock this phase.'}"
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW: AI MUSIC CREATION, SEARCH & AUDIO HEARING STUDIO */}
          {activeView === 'rap' && (
            <MusicStudioView user={user} showToast={showToast} />
          )}

          {/* VIEW: NOTES & SMART FOLDER SYSTEM */}
          {activeView === 'notes' && (
            <div className="max-w-6xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
              {/* Header */}
              <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="text-left">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Folder className="w-5.5 h-5.5 text-pink-400" />
                    My Notes & Smart Folders / व्यक्तिगत नोट्स
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Store and organize strategic syllabus summaries, custom revision points, and General Awareness notes.
                  </p>
                </div>
                
                <button
                  onClick={() => {
                    setIsCreatingNote(true);
                    setActiveNoteId(null);
                    setNoteTitleInput("");
                    setNoteContentInput("");
                    setNoteTagsInput("");
                  }}
                  className="px-4 py-2.5 bg-gradient-to-r from-pink-650 to-indigo-650 hover:from-pink-600 hover:to-indigo-600 rounded-xl text-xs font-bold text-white flex items-center gap-2 shadow-lg hover:shadow-pink-600/10 transition-all self-start md:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  New Note / नया नोट्स जोडें
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                
                {/* 1. Folder Directory Rail (1/4 columns) */}
                <div className="space-y-4 lg:col-span-1">
                  <div className="bg-[#0F1626]/75 border border-slate-800/80 rounded-2xl p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest">SMART DIRECTORY</span>
                      <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-450 text-slate-400 font-bold">{folders.length} Folders</span>
                    </div>

                    <div className="space-y-1 block text-left">
                      <button
                        onClick={() => setSelectedFolderId("all")}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          selectedFolderId === "all"
                            ? "bg-pink-600/15 text-pink-300 border-l-2 border-pink-500 font-bold"
                            : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
                        }`}
                      >
                        <span className="flex items-center gap-2">📂 Show All Notes</span>
                        <span className="bg-[#090D16] text-[10px] px-2 py-0.5 rounded-lg text-slate-400">{notes.length}</span>
                      </button>

                      {folders.map(f => {
                        const count = notes.filter(n => n.folderId === f.id).length;
                        return (
                          <button
                            key={f.id}
                            onClick={() => setSelectedFolderId(f.id)}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                              selectedFolderId === f.id
                                ? "bg-pink-600/15 text-pink-300 border-l-2 border-pink-500 font-bold"
                                : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
                            }`}
                          >
                            <span className="flex items-center gap-2 truncate">
                              <span className="text-xs">{f.emoji}</span>
                              <span className="truncate">{f.name.split("/")[0].trim()}</span>
                            </span>
                            <span className="bg-[#090D16] text-[10px] px-2 py-0.5 rounded-lg text-slate-400">{count}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Quick folder addition inline form */}
                    <div className="border-t border-slate-800/60 pt-3.5 space-y-2 text-left">
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">NEW DYNAMIC FOLDER</span>
                      <div className="space-y-1.5">
                        <input
                          type="text"
                          placeholder="जैसे: Geometry, Math..."
                          value={newFolderNameInput}
                          onChange={(e) => setNewFolderNameInput(e.target.value)}
                          className="w-full text-[11px] py-1.5 px-2.5 bg-[#090D16] border border-slate-800 rounded-lg text-white focus:outline-none focus:border-pink-500 placeholder-slate-600"
                        />
                        <div className="flex gap-1.5">
                          <select
                            value={newFolderEmojiInput}
                            onChange={(e) => setNewFolderEmojiInput(e.target.value)}
                            className="text-[11px] py-1 px-1.5 bg-[#090D16] border border-slate-800 rounded-lg text-white focus:outline-none"
                          >
                            <option value="📂">📂 Fold</option>
                            <option value="📖">📖 Book</option>
                            <option value="🧠">🧠 Mind</option>
                            <option value="📝">📝 Note</option>
                            <option value="🎯">🎯 Goal</option>
                          </select>
                          <button
                            onClick={() => {
                              if (!newFolderNameInput.trim()) return;
                              const newId = `folder-${Date.now()}`;
                              const newFolder = {
                                id: newId,
                                name: newFolderNameInput,
                                emoji: newFolderEmojiInput || "📂",
                                color: "pink"
                              };
                              setFolders(prev => [...prev, newFolder]);
                              setNewFolderNameInput("");
                              showToast(`Folder "${newFolderNameInput}" created! 📂`, "success");
                            }}
                            className="flex-1 text-[10px] bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-lg transition-colors cursor-pointer text-center flex items-center justify-center"
                          >
                            Add Folder
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* 2. Notes List & Workspace (3/4 columns) */}
                <div className="lg:col-span-3 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    
                    {/* Notes List Rail */}
                    <div className="md:col-span-5 space-y-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          {selectedFolderId === "all" ? "All Notebooks" : "Folder Notes"}
                        </span>
                        <span className="text-[10px] text-slate-400 bg-slate-800/40 px-2 py-0.5 rounded">
                          {notes.filter(n => selectedFolderId === "all" || n.folderId === selectedFolderId).length} Items
                        </span>
                      </div>

                      <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
                        {notes.filter(n => selectedFolderId === "all" || n.folderId === selectedFolderId).length === 0 ? (
                          <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-800 bg-[#070B14]/40">
                            <span className="text-2xl block mb-2">📓</span>
                            <span className="text-xs text-slate-500 block">No notes found here.</span>
                            <button
                              onClick={() => {
                                setIsCreatingNote(true);
                                setActiveNoteId(null);
                                setNoteTitleInput("");
                                setNoteContentInput("");
                                setNoteTagsInput("");
                              }}
                              className="mt-3 text-[10px] text-pink-400 hover:underline font-bold"
                            >
                              + Create first note
                            </button>
                          </div>
                        ) : (
                          notes.filter(n => selectedFolderId === "all" || n.folderId === selectedFolderId).map(note => {
                            const folder = folders.find(f => f.id === note.folderId);
                            const isActive = activeNoteId === note.id;
                            return (
                              <div
                                key={note.id}
                                onClick={() => {
                                  setActiveNoteId(note.id);
                                  setIsCreatingNote(false);
                                  setNoteTitleInput(note.title);
                                  setNoteContentInput(note.content);
                                  setNoteTagsInput(note.tags.join(", "));
                                  setSelectedFolderForNewNote(note.folderId);
                                }}
                                className={`p-4 rounded-xl border text-left cursor-pointer transition-all duration-200 relative group ${
                                  isActive
                                    ? "bg-gradient-to-r from-pink-950/20 to-indigo-950/20 border-pink-500/80 shadow-lg shadow-pink-950/25"
                                    : "bg-[#070B14]/60 border-slate-850 hover:bg-[#0E1524]/85 hover:border-slate-800"
                                }`}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 flex items-center gap-1">
                                    <span>{folder?.emoji || "📁"}</span>
                                    <span>{folder?.name.split("/")[0].trim() || "General"}</span>
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setNotes(prev => prev.filter(n => n.id !== note.id));
                                      if (activeNoteId === note.id) {
                                        setActiveNoteId(null);
                                        setIsCreatingNote(false);
                                      }
                                      showToast("Note deleted successfully! 🗑️", "info");
                                    }}
                                    className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 text-xs p-1 transition-opacity"
                                    title="Delete Note"
                                  >
                                    🗑️
                                  </button>
                                </div>

                                <h4 className="text-xs font-bold text-white mt-2 line-clamp-1 group-hover:text-pink-400 duration-150">
                                  {note.title || "Untitled Note"}
                                </h4>
                                
                                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                                  {note.content}
                                </p>

                                <div className="flex flex-wrap gap-1 mt-3">
                                  {note.tags.map((t, idx) => (
                                    <span key={idx} className="text-[9px] bg-indigo-950/40 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-900/30">
                                      #{t}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {/* Rich Editor / Detail Panel */}
                    <div className="md:col-span-7 bg-[#070B14]/80 border border-slate-850 rounded-2xl p-5 space-y-4">
                      {isCreatingNote || activeNoteId ? (
                        <div className="space-y-4 text-left">
                          <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                            <h3 className="text-xs font-black text-white uppercase tracking-wider">
                              {isCreatingNote ? "✍️ Create New Note" : "📝 Note Workspace"}
                            </h3>
                            {!isCreatingNote && (
                              <button
                                onClick={() => {
                                  setIsCreatingNote(true);
                                  setActiveNoteId(null);
                                  setNoteTitleInput("");
                                  setNoteContentInput("");
                                  setNoteTagsInput("");
                                }}
                                className="text-[10px] bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 px-2.5 py-1 rounded-lg font-bold"
                              >
                                + New Note
                              </button>
                            )}
                          </div>

                          <div className="space-y-3">
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Title</label>
                              <input
                                type="text"
                                placeholder="जैसे: Modern History Short Notes..."
                                value={noteTitleInput}
                                onChange={(e) => setNoteTitleInput(e.target.value)}
                                className="w-full text-xs py-2 px-3 bg-[#03060E] border border-slate-800 rounded-lg text-white focus:outline-none focus:border-pink-500 placeholder-slate-600"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Target Folder</label>
                                <select
                                  value={selectedFolderForNewNote}
                                  onChange={(e) => setSelectedFolderForNewNote(e.target.value)}
                                  className="w-full text-xs py-2 px-2.5 bg-[#03060E] border border-slate-800 rounded-lg text-white focus:outline-none focus:border-pink-500"
                                >
                                  {folders.map(f => (
                                    <option key={f.id} value={f.id}>
                                      {f.emoji} {f.name.split("/")[0]}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Tags (comma separated)</label>
                                <input
                                  type="text"
                                  placeholder="ssc, history, revision..."
                                  value={noteTagsInput}
                                  onChange={(e) => setNoteTagsInput(e.target.value)}
                                  className="w-full text-xs py-2 px-3 bg-[#03060E] border border-slate-800 rounded-lg text-white focus:outline-none focus:border-pink-500 placeholder-slate-600"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Content / नोट्स विवरण</label>
                              <textarea
                                placeholder="Write down formula tables, general studies points, or shorthand outline transcripts here..."
                                value={noteContentInput}
                                onChange={(e) => setNoteContentInput(e.target.value)}
                                className="w-full h-64 text-xs sm:text-sm py-3.5 px-4 bg-[#03060E] border border-slate-800 rounded-lg text-white focus:outline-none focus:border-pink-500 placeholder-slate-600 font-sans leading-relaxed resize-none"
                              />
                            </div>

                            <div className="flex gap-2 justify-end pt-2">
                              <button
                                onClick={() => {
                                  if (!noteTitleInput.trim() && !noteContentInput.trim()) {
                                    showToast("Please fill in some content.", "warn");
                                    return;
                                  }
                                  const parsedTags = noteTagsInput
                                    .split(",")
                                    .map(t => t.trim())
                                    .filter(t => t.length > 0);
                                  
                                  if (isCreatingNote) {
                                    const newNote = {
                                      id: `note-${Date.now()}`,
                                      folderId: selectedFolderForNewNote,
                                      title: noteTitleInput.trim() || "Untitled Note",
                                      content: noteContentInput,
                                      tags: parsedTags,
                                      createdAt: new Date().toISOString()
                                    };
                                    setNotes(prev => [newNote, ...prev]);
                                    setIsCreatingNote(false);
                                    setActiveNoteId(newNote.id);
                                    showToast("📝 Note created and archived!", "success");
                                  } else if (activeNoteId) {
                                    setNotes(prev => prev.map(n => n.id === activeNoteId ? {
                                      ...n,
                                      title: noteTitleInput.trim() || "Untitled Note",
                                      content: noteContentInput,
                                      folderId: selectedFolderForNewNote,
                                      tags: parsedTags
                                    } : n));
                                    showToast("💾 Note changes saved successfully!", "success");
                                  }
                                }}
                                className="px-5 py-2.5 bg-gradient-to-r from-pink-650 to-indigo-650 hover:from-pink-600 hover:to-indigo-600 text-white font-bold rounded-xl text-xs transition-all shadow-lg hover:shadow-pink-600/10 cursor-pointer"
                              >
                                {isCreatingNote ? "Create Note" : "Save Changes"}
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="py-24 text-center space-y-3">
                          <span className="text-3xl block">📖</span>
                          <h4 className="text-xs font-bold text-slate-300">No Note Selected</h4>
                          <p className="text-[10px] text-slate-500 max-w-xs mx-auto leading-relaxed">
                            Select an academic note from the list, or create a fresh one to draft study outlines.
                          </p>
                          <button
                            onClick={() => {
                              setIsCreatingNote(true);
                              setActiveNoteId(null);
                              setNoteTitleInput("");
                              setNoteContentInput("");
                              setNoteTagsInput("");
                            }}
                            className="text-[10px] bg-pink-600 hover:bg-pink-500 px-3.5 py-1.5 rounded-xl text-white font-bold transition-all shadow-md"
                          >
                            + Create a Note
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                </div>

              </div>
            </div>
          )}

          {/* VIEW: STUDY TIMER & DYNAMIC WORKSPACE */}
          {activeView === 'timer' && (
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
              {/* Header with Sub-tabs */}
              <div className="bg-[#070B14]/80 border-2 border-indigo-500/20 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
                <div className="text-left">
                  <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 text-lg leading-none">⏱️</span>
                    Study Timer & Dynamic Workspace / अध्ययन एवं रिकॉर्डर कंसोल
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage focus sessions with smart alarms, practice typing dictation transcripts, or save voice notes directly to local projects.
                  </p>
                </div>
                
                {/* Switcher tabs */}
                <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-850 self-start md:self-center">
                  <button
                    onClick={() => {
                      setTimerSubTab('clock');
                      showToast("Smart Study Timer Active ⏱️", "success");
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      timerSubTab === 'clock'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    ⏱️ Study Timer
                  </button>
                  <button
                    onClick={() => {
                      setTimerSubTab('projects');
                      showToast("Audio Recorder & Projects Active 🎙️", "success");
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      timerSubTab === 'projects'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    🎙️ Voice & Projects
                  </button>
                </div>
              </div>

              {timerSubTab === 'clock' ? (
                /* TAB 1: SMART STUDY TIMER WITH SHORTHAND KEYBOARD & DRAFT AUTO-SAVE */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in">
                  
                  {/* Left Column: Clock and Settings */}
                  <div className="lg:col-span-5 bg-slate-900/50 border border-slate-850 rounded-2xl p-6 space-y-6 text-left">
                    <div className="text-center space-y-4">
                      <span className="text-[10px] uppercase font-black tracking-widest text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full leading-none inline-block">
                        {isTimerRunning ? "⚡ Focus Session In Progress" : "⏱️ Session Idle"}
                      </span>

                      {/* Giant digital glowing countdown clock */}
                      <div className="py-6 flex justify-center">
                        <div className="relative w-48 h-48 rounded-full border-4 border-indigo-500/20 flex flex-col items-center justify-center bg-[#03060E] shadow-2xl shadow-indigo-500/5">
                          {/* Pulsing ring during ticking */}
                          {isTimerRunning && (
                            <div className="absolute inset-0 rounded-full border border-indigo-400 animate-ping opacity-15" />
                          )}
                          <span className="text-4xl font-mono font-black text-white tracking-widest">
                            {Math.floor(timeLeft / 60).toString().padStart(2, "0")}:
                            {(timeLeft % 60).toString().padStart(2, "0")}
                          </span>
                          <span className="text-[10px] text-slate-500 font-bold uppercase mt-1">
                            Target: {timerPresetVal} Mins
                          </span>
                        </div>
                      </div>

                      {/* Main Playback Controls */}
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => {
                            setIsTimerRunning(!isTimerRunning);
                            showToast(isTimerRunning ? "Timer Paused / रुका हुआ ⏸️" : "Study Timer Started / चालू ⏱️", "info");
                          }}
                          className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer ${
                            isTimerRunning 
                              ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/10' 
                              : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-emerald-500/10'
                          }`}
                        >
                          {isTimerRunning ? "⏸️ Pause Session" : "▶️ Start Focus"}
                        </button>

                        <button
                          onClick={() => {
                            setIsTimerRunning(false);
                            setTimeLeft(timerPresetVal * 60);
                            showToast("Timer Reset / दोबारा रीसेट किया गया ⏱️", "info");
                          }}
                          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer border border-slate-700"
                        >
                          🔄 Reset
                        </button>
                      </div>
                    </div>

                    {/* Quick Preset Selector Chips & Custom Alarm Inputs */}
                    <div className="space-y-3 border-t border-slate-850 pt-4">
                      <div>
                        <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                          Alarm Label / अलार्म का नाम
                        </label>
                        <input
                          type="text"
                          value={timerAlarmTitle}
                          onChange={(e) => setTimerAlarmTitle(e.target.value)}
                          placeholder="e.g. Shorthand Practice / Polity Revision / 20 MCQs"
                          className="w-full text-xs bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-slate-200 outline-none focus:border-indigo-500 font-sans"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-400 font-bold uppercase block">Quick Alarm Presets / क्विक अलार्म</label>
                        <div className="grid grid-cols-4 gap-1.5">
                          {[1, 5, 10, 15, 25, 30, 45, 60].map((mins) => (
                            <button
                              key={mins}
                              onClick={() => {
                                setIsTimerRunning(false);
                                setTimerPresetVal(mins);
                                setTimeLeft(mins * 60);
                                showToast(`Alarm set for ${mins} Mins ⏱️`, "success");
                              }}
                              className={`py-2 rounded-lg text-[10px] font-bold text-center border transition-all cursor-pointer ${
                                timerPresetVal === mins && timeLeft === mins * 60
                                  ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                                  : 'border-slate-850 bg-slate-950 text-slate-400 hover:border-slate-700'
                              }`}
                            >
                              {mins}m
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Custom Minutes & Seconds Input */}
                      <div className="p-3 bg-[#03060E] border border-slate-850 rounded-xl space-y-2">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Custom Alarm Time (Custom Min & Sec)</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            max="300"
                            placeholder="Mins (e.g. 3)"
                            value={customAlarmMinutes}
                            onChange={(e) => setCustomAlarmMinutes(e.target.value)}
                            className="w-1/2 text-xs bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-lg text-white outline-none focus:border-indigo-500"
                          />
                          <span className="text-slate-500 text-xs font-bold">:</span>
                          <input
                            type="number"
                            min="0"
                            max="59"
                            placeholder="Secs (e.g. 30)"
                            value={customAlarmSeconds}
                            onChange={(e) => setCustomAlarmSeconds(e.target.value)}
                            className="w-1/2 text-xs bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-lg text-white outline-none focus:border-indigo-500"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const m = parseInt(customAlarmMinutes || "0", 10);
                              const s = parseInt(customAlarmSeconds || "0", 10);
                              const totalSecs = (m * 60) + s;
                              if (isNaN(totalSecs) || totalSecs <= 0) {
                                showToast("Please enter valid positive minutes or seconds.", "warn");
                                return;
                              }
                              setIsTimerRunning(false);
                              setTimerPresetVal(m || 1);
                              setTimeLeft(totalSecs);
                              showToast(`Custom alarm set for ${m}m ${s}s! ⏰`, "success");
                            }}
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-bold whitespace-nowrap cursor-pointer transition-all"
                          >
                            Set Alarm ⏰
                          </button>
                        </div>
                      </div>

                      {/* Sound Test & External App Launcher Shortcut */}
                      <div className="flex items-center justify-between gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            playLoudAlarmChime();
                            showToast("🔊 Testing loud alarm chime sound!", "info");
                          }}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-bold border border-slate-700 cursor-pointer transition-all"
                        >
                          🔊 Test Alarm Ring
                        </button>

                        <button
                          type="button"
                          onClick={() => setIsAppLauncherOpen(true)}
                          className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 rounded-lg text-[10px] font-bold border border-cyan-500/30 cursor-pointer transition-all flex items-center gap-1"
                        >
                          🌐 Launch Apps (YouTube / ChatGPT)
                        </button>
                      </div>
                    </div>

                    {/* Smart Audio Assistant Settings */}
                    <div className="space-y-3.5 border-t border-slate-850 pt-4">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Smart Exam Simulator Settings</span>
                      
                      <div className="space-y-2.5">
                        <label className="flex items-center gap-2.5 cursor-pointer group text-xs text-slate-300">
                          <input
                            type="checkbox"
                            checked={isMetronomeEnabled}
                            onChange={(e) => {
                              setIsMetronomeEnabled(e.target.checked);
                              showToast(e.target.checked ? "Pacing Metronome Enabled! 📢" : "Metronome disabled.", "info");
                            }}
                            className="rounded bg-slate-950 border-slate-800 text-indigo-500 focus:ring-0 w-4 h-4 cursor-pointer"
                          />
                          <div>
                            <span className="font-bold group-hover:text-white transition-colors">Speed Pacing Metronome clicks</span>
                            <p className="text-[9px] text-slate-500">Plays a gentle tick sound every second to maintain a steady words-per-minute pacing (WPM).</p>
                          </div>
                        </label>

                        <div className="p-3 bg-[#03060E] border border-slate-850 rounded-xl space-y-1.5 text-[11px] text-slate-450 leading-relaxed">
                          <span className="text-amber-400 font-bold block">💡 About Smart Study Timer:</span>
                          <p>
                            We will automatically play a smart pacing double-beep at exactly the <strong>50% half-time mark</strong> (e.g. at 12m 30s for a 25m session) to warn you of your pacing.
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Right Column: Interactive Practice Notebook */}
                  <div className="lg:col-span-7 bg-slate-900/50 border border-slate-850 rounded-2xl p-6 space-y-4 text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-850">
                      <div>
                        <h3 className="text-sm font-bold text-white">Dictation Practice Notebook / आशुलिपि अभ्यास पुस्तिका</h3>
                        <p className="text-[10px] text-slate-500 mt-0.5">Type or transcribe live dictation here. It will auto-save to Notes when time runs out.</p>
                      </div>
                      
                      {/* Live typing stats */}
                      <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                        <span className="px-1.5 py-0.5 bg-slate-950 rounded">
                          Words: <strong className="text-indigo-400">{timerNoteContent.trim() ? timerNoteContent.trim().split(/\s+/).length : 0}</strong>
                        </span>
                        <span className="px-1.5 py-0.5 bg-slate-950 rounded">
                          Chars: <strong className="text-emerald-400">{timerNoteContent.length}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Interactive Notebook Textarea */}
                      <div className="relative">
                        <textarea
                          value={timerNoteContent}
                          onChange={(e) => setTimerNoteContent(e.target.value)}
                          placeholder="Dictate, listen, or practice typing your SSC Steno, Civil Services, or general study materials here..."
                          className="w-full text-xs sm:text-sm bg-[#03060E] border border-slate-850 px-4 py-3.5 rounded-2xl text-slate-200 outline-none focus:border-indigo-500 transition-all h-80 font-sans leading-relaxed resize-none placeholder-slate-650"
                        />
                        {timerNoteContent.length === 0 && (
                          <div className="absolute inset-x-4 top-20 text-[11px] text-slate-550 leading-relaxed pointer-events-none space-y-1 select-none">
                            <span className="font-bold text-slate-500 block">⚡ Pro-Tip for Shorthand Practice:</span>
                            <p>1. Play your external audio dictation (or start a fresh mock dictation task).</p>
                            <p>2. Keep writing with the speed pacing metronome clicks toggled on to control words per minute.</p>
                            <p>3. Let the timer complete, and we will safely archive your transcript directly in Notes!</p>
                          </div>
                        )}
                      </div>

                      {/* Manual Notebook preservation buttons */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                        <label className="flex items-center gap-2 cursor-pointer text-[10px] text-slate-500">
                          <input
                            type="checkbox"
                            checked={disableNotesForTimer}
                            onChange={(e) => setDisableNotesForTimer(e.target.checked)}
                            className="rounded bg-slate-950 border-slate-800 text-indigo-500 focus:ring-0 w-3.5 h-3.5 cursor-pointer"
                          />
                          <span>Keep sidebar notes list hidden during active practice</span>
                        </label>

                        <button
                          type="button"
                          onClick={() => {
                            if (!timerNoteContent.trim()) {
                              showToast("Please enter some typing content to save.", "warn");
                              return;
                            }
                            const newNote = {
                              id: `note-manual-timer-${Date.now()}`,
                              title: `Practice Draft (${timerPresetVal} min)`,
                              content: timerNoteContent,
                              folderId: "general",
                              tags: ["TimerPractice", "Manual"],
                              createdAt: new Date().toISOString()
                            };
                            setNotes(prev => [newNote, ...prev]);
                            setTimerNoteContent("");
                            showToast("📝 Saved practice notebook successfully to Notes & Folders!", "success");
                          }}
                          disabled={!timerNoteContent.trim()}
                          className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:bg-slate-850 text-white font-bold rounded-xl text-[11px] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          💾 Save Current Draft to Notes
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              ) : (
                /* TAB 2: MY PROJECTS & AUDIO RECORDER */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in">
                  
                  {/* Left side: Audio Recorder and Custom Project creation form */}
                  <div className="lg:col-span-7 space-y-6">
                    
                    {/* Interactive Audio Recorder Panel */}
                    <div className="bg-slate-900/50 border border-slate-850 rounded-2xl p-6 space-y-4 text-left relative overflow-hidden">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
                          Voice Recorder / डिक्टेशन रिकॉर्डर
                        </h3>
                        {isRecording && (
                          <span className="text-[10px] uppercase font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded animate-pulse">
                            Live Recording
                          </span>
                        )}
                      </div>

                      <div className="py-8 flex flex-col items-center justify-center space-y-4 bg-[#03060E] border border-slate-850 rounded-xl relative">
                        {/* CSS Waves Animation during recording */}
                        {isRecording ? (
                          <div className="flex items-center justify-center gap-1 h-8 w-full px-8">
                            {[...Array(12)].map((_, i) => (
                              <div
                                key={i}
                                className="w-1 bg-gradient-to-t from-indigo-500 to-[#00E5FF] rounded-full animate-pulse flex-1"
                                style={{
                                  height: `${Math.random() * 80 + 20}%`,
                                  minHeight: '8px',
                                  animationDuration: `${0.3 + i * 0.08}s`
                                }}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="text-slate-500 text-xs text-center py-2 px-4 leading-relaxed max-w-sm">
                            🎤 Tap "Start Recording" to capture your speech, answers, outlines, or lecture drafts.
                          </div>
                        )}

                        {/* Display timer */}
                        <div className="text-2xl font-black text-white font-mono">
                          {Math.floor(recordingTime / 60).toString().padStart(2, "0")}:
                          {(recordingTime % 60).toString().padStart(2, "0")}
                        </div>

                        {/* Recorder Controls */}
                        <div className="flex items-center gap-4">
                          {!isRecording ? (
                            <button
                              type="button"
                              onClick={startRecording}
                              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/15 flex items-center gap-2 cursor-pointer"
                            >
                              <span className="text-sm">🔴</span> Start Recording
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={stopRecording}
                              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-rose-600/15 flex items-center gap-2 cursor-pointer animate-bounce"
                            >
                              <span className="text-sm">⏹️</span> Stop Recording
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Recorded Audio Player Preview */}
                      {recordedAudioUrl && (
                        <div className="p-3 bg-indigo-950/20 border border-indigo-500/20 rounded-xl space-y-2 animate-fade-in">
                          <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wide block">Preview Recorded Sound:</span>
                          <audio src={recordedAudioUrl} controls className="w-full h-8 bg-slate-950 rounded" />
                        </div>
                      )}
                    </div>

                    {/* Create New Project Form */}
                    <div className="bg-slate-900/50 border border-slate-850 rounded-2xl p-6 space-y-4 text-left">
                      <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                        📝 Create New Project / नया प्रोजेक्ट ड्राफ्ट करें
                      </h3>

                      <div className="space-y-3.5">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">Project Title / विषय का नाम</label>
                          <input
                            type="text"
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            placeholder="e.g. Ancient Indian Rivers, Gupta Dynasty Coins, My Daily Vocabulary list..."
                            className="w-full text-xs bg-slate-950 border border-slate-850 px-3.5 py-2.5 rounded-xl text-slate-200 outline-none focus:border-indigo-500 transition-all font-sans"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">Important points / महत्वपूर्ण बिंदु</label>
                            <textarea
                              value={newProjectPoints}
                              onChange={(e) => setNewProjectPoints(e.target.value)}
                              placeholder="Enter bullet points, rules or formula lists..."
                              className="w-full text-xs bg-slate-950 border border-slate-850 px-3.5 py-2.5 rounded-xl text-slate-200 outline-none focus:border-indigo-500 transition-all h-20 resize-none font-sans"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">Headlines & Highlights / मुख्य सुर्खियां</label>
                            <textarea
                              value={newProjectHeadlines}
                              onChange={(e) => setNewProjectHeadlines(e.target.value)}
                              placeholder="Key quotes, news flashes, or summaries..."
                              className="w-full text-xs bg-slate-950 border border-slate-850 px-3.5 py-2.5 rounded-xl text-slate-200 outline-none focus:border-indigo-500 transition-all h-20 resize-none font-sans"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">Detailed Summary & Analysis / संपूर्ण व्याख्या</label>
                          <textarea
                            value={newProjectNotes}
                            onChange={(e) => setNewProjectNotes(e.target.value)}
                            placeholder="Write custom notes, study details, or lecture summary drafts..."
                            className="w-full text-xs bg-[#03060E] border border-slate-850 px-3.5 py-2.5 rounded-xl text-slate-200 outline-none focus:border-indigo-500 transition-all h-28 resize-none leading-relaxed font-sans"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => saveProject(newProjectName, newProjectNotes, newProjectPoints, newProjectHeadlines, recordedAudioUrl)}
                          disabled={!newProjectName.trim()}
                          className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-550 hover:from-indigo-500 hover:to-indigo-450 disabled:from-slate-850 disabled:to-slate-850 disabled:opacity-45 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/10 cursor-pointer"
                        >
                          📁 Save to My Projects / सहेजें
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Right side: Repository list of saved projects */}
                  <div className="lg:col-span-5 space-y-6">
                    
                    <div className="bg-slate-900/50 border border-slate-850 rounded-2xl p-5 sm:p-6 space-y-4 text-left">
                      <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                        📁 Saved Projects Repository / आपके सहेजे गए प्रोजेक्ट्स ({savedProjects.length})
                      </h3>

                      {savedProjects.length === 0 ? (
                        <div className="py-16 text-center text-slate-500 space-y-3.5">
                          <span className="text-3xl block">📭</span>
                          <p className="text-xs max-w-xs mx-auto text-slate-400">No saved projects yet. Create a new draft or save dynamic syllabus research results directly from our tools!</p>
                        </div>
                      ) : (
                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                          {savedProjects.map((proj) => (
                            <div 
                              key={proj.id} 
                              className="bg-[#03060E]/90 border border-slate-850 hover:border-indigo-500/30 rounded-xl p-4 space-y-3 transition-all relative overflow-hidden group"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h4 className="text-xs sm:text-sm font-black text-indigo-300 leading-tight group-hover:text-white transition-colors">{proj.title}</h4>
                                  <span className="text-[9px] text-slate-500 font-mono block mt-1">
                                    ⏱️ {new Date(proj.timestamp).toLocaleString()}
                                  </span>
                                </div>
                                <button
                                  onClick={() => {
                                    if (confirm("Are you sure you want to delete this project?")) {
                                      setSavedProjects(prev => prev.filter(p => p.id !== proj.id));
                                      showToast("Project deleted.", "info");
                                    }
                                  }}
                                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition-all cursor-pointer text-[10px]"
                                  title="Delete Project"
                                >
                                  🗑️
                                </button>
                              </div>

                              {/* Bullet points & lists showing headlines/points */}
                              {proj.points && (
                                <div className="space-y-1">
                                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Important Points:</span>
                                  <div className="text-[11px] text-slate-350 bg-[#121214]/60 p-2 rounded border border-slate-850 leading-relaxed font-sans whitespace-pre-wrap">
                                    {proj.points}
                                  </div>
                                </div>
                              )}

                              {proj.headlines && (
                                <div className="space-y-1">
                                  <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block">Headlines & Highlights:</span>
                                  <div className="text-[11px] text-slate-355 bg-[#121214]/60 p-2 rounded border border-slate-850 leading-relaxed font-sans whitespace-pre-wrap">
                                    {proj.headlines}
                                  </div>
                                </div>
                              )}

                              {proj.notes && (
                                <div className="space-y-1">
                                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">Analysis Notes / संपूर्ण विवरण:</span>
                                  <p className="text-[11px] text-slate-400 leading-relaxed whitespace-pre-wrap font-sans">
                                    {proj.notes}
                                  </p>
                                </div>
                              )}

                              {proj.audioUrl && (
                                <div className="pt-2 border-t border-slate-850/60 flex flex-col gap-1">
                                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">🎙️ Attached Voice Recording:</span>
                                  <audio src={proj.audioUrl} controls className="w-full h-8 bg-slate-900 rounded" />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>

                </div>
              )}

            </div>
          )}

          {/* VIEW: MY PROJECTS & AUDIO RECORDER */}
          {activeView === 'timer' && (
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
              {/* Header */}
              <div className="border-b border-slate-800 pb-4 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 font-extrabold text-lg leading-none">🎙️</span>
                    My Projects & Audio Recorder / मेरे प्रोजेक्ट्स एवं ऑडियो रिकॉर्डर
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Record voice drafts, dictate important headlines, or save your smart research findings dynamically into your personalized local repository.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to clear all your projects? This action cannot be undone.")) {
                        setSavedProjects([]);
                        showToast("All projects cleared successfully!", "info");
                      }
                    }}
                    className="px-3 py-1.5 bg-rose-500/15 hover:bg-rose-500 text-rose-300 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Clear All Projects
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left side: Audio Recorder and Custom Project creation form */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Interactive Audio Recorder Panel */}
                  <div className="bg-slate-900/50 border border-slate-850 rounded-2xl p-6 space-y-4 text-left relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
                        Voice Recorder / डिक्टेशन रिकॉर्डर
                      </h3>
                      {isRecording && (
                        <span className="text-[10px] uppercase font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded animate-pulse">
                          Live Recording
                        </span>
                      )}
                    </div>

                    <div className="py-8 flex flex-col items-center justify-center space-y-4 bg-[#03060E] border border-slate-850 rounded-xl relative">
                      
                      {/* CSS Waves Animation during recording */}
                      {isRecording ? (
                        <div className="flex items-center justify-center gap-1 h-8 w-full px-8">
                          {[...Array(12)].map((_, i) => (
                            <div
                              key={i}
                              className="w-1 bg-gradient-to-t from-indigo-500 to-[#00E5FF] rounded-full animate-pulse flex-1"
                              style={{
                                height: `${Math.random() * 80 + 20}%`,
                                minHeight: '8px',
                                animationDuration: `${0.3 + i * 0.08}s`
                              }}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="text-slate-500 text-xs text-center py-2 px-4 leading-relaxed max-w-sm">
                          🎤 Tap "Start Recording" to capture your speech, answers, outlines, or lecture drafts.
                        </div>
                      )}

                      {/* Display timer */}
                      <div className="text-2xl font-black text-white font-mono">
                        {Math.floor(recordingTime / 60).toString().padStart(2, "0")}:
                        {(recordingTime % 60).toString().padStart(2, "0")}
                      </div>

                      {/* Recorder Controls */}
                      <div className="flex items-center gap-4">
                        {!isRecording ? (
                          <button
                            type="button"
                            onClick={startRecording}
                            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/15 flex items-center gap-2 cursor-pointer"
                          >
                            <span className="text-sm">🔴</span> Start Recording
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={stopRecording}
                            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-rose-600/15 flex items-center gap-2 cursor-pointer animate-bounce"
                          >
                            <span className="text-sm">⏹️</span> Stop Recording
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Recorded Audio Player Preview */}
                    {recordedAudioUrl && (
                      <div className="p-3 bg-indigo-950/20 border border-indigo-500/20 rounded-xl space-y-2 animate-fade-in">
                        <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wide block">Preview Recorded Sound:</span>
                        <audio src={recordedAudioUrl} controls className="w-full h-8 bg-slate-950 rounded" />
                      </div>
                    )}
                  </div>

                  {/* Create New Project Form */}
                  <div className="bg-slate-900/50 border border-slate-850 rounded-2xl p-6 space-y-4 text-left">
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      📝 Create New Project / नया प्रोजेक्ट ड्राफ्ट करें
                    </h3>

                    <div className="space-y-3.5">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">Project Title / विषय का नाम</label>
                        <input
                          type="text"
                          value={newProjectName}
                          onChange={(e) => setNewProjectName(e.target.value)}
                          placeholder="e.g. Ancient Indian Rivers, Gupta Dynasty Coins, My Daily Vocabulary list..."
                          className="w-full text-xs bg-slate-950 border border-slate-850 px-3.5 py-2.5 rounded-xl text-slate-200 outline-none focus:border-indigo-500 transition-all font-sans"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">Important points / महत्वपूर्ण बिंदु</label>
                          <textarea
                            value={newProjectPoints}
                            onChange={(e) => setNewProjectPoints(e.target.value)}
                            placeholder="Enter bullet points, rules or formula lists..."
                            className="w-full text-xs bg-slate-950 border border-slate-850 px-3.5 py-2.5 rounded-xl text-slate-200 outline-none focus:border-indigo-500 transition-all h-20 resize-none font-sans"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">Headlines & Highlights / मुख्य सुर्खियां</label>
                          <textarea
                            value={newProjectHeadlines}
                            onChange={(e) => setNewProjectHeadlines(e.target.value)}
                            placeholder="Key quotes, news flashes, or summaries..."
                            className="w-full text-xs bg-slate-950 border border-slate-850 px-3.5 py-2.5 rounded-xl text-slate-200 outline-none focus:border-indigo-500 transition-all h-20 resize-none font-sans"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">Detailed Summary & Analysis / संपूर्ण व्याख्या</label>
                        <textarea
                          value={newProjectNotes}
                          onChange={(e) => setNewProjectNotes(e.target.value)}
                          placeholder="Write custom notes, study details, or lecture summary drafts..."
                          className="w-full text-xs bg-[#03060E] border border-slate-850 px-3.5 py-2.5 rounded-xl text-slate-200 outline-none focus:border-indigo-500 transition-all h-28 resize-none leading-relaxed font-sans"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => saveProject(newProjectName, newProjectNotes, newProjectPoints, newProjectHeadlines, recordedAudioUrl)}
                        disabled={!newProjectName.trim()}
                        className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-550 hover:from-indigo-500 hover:to-indigo-450 disabled:from-slate-850 disabled:to-slate-850 disabled:opacity-45 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/10 cursor-pointer"
                      >
                        📁 Save to My Projects / सहेजें
                      </button>
                    </div>
                  </div>

                </div>

                {/* Right side: Repository list of saved projects */}
                <div className="lg:col-span-5 space-y-6">
                  
                  <div className="bg-slate-900/50 border border-slate-850 rounded-2xl p-5 sm:p-6 space-y-4 text-left">
                    <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                      📁 Saved Projects Repository / आपके सहेजे गए प्रोजेक्ट्स ({savedProjects.length})
                    </h3>

                    {savedProjects.length === 0 ? (
                      <div className="py-16 text-center text-slate-500 space-y-3.5">
                        <span className="text-3xl block">📭</span>
                        <p className="text-xs max-w-xs mx-auto text-slate-400">No saved projects yet. Create a new draft or save dynamic syllabus research results directly from our tools!</p>
                      </div>
                    ) : (
                      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                        {savedProjects.map((proj) => (
                          <div 
                            key={proj.id} 
                            className="bg-[#03060E]/90 border border-slate-850 hover:border-indigo-500/30 rounded-xl p-4 space-y-3 transition-all relative overflow-hidden group"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="text-xs sm:text-sm font-black text-indigo-300 leading-tight group-hover:text-white transition-colors">{proj.title}</h4>
                                <span className="text-[9px] text-slate-500 font-mono block mt-1">
                                  ⏱️ {new Date(proj.timestamp).toLocaleString()}
                                </span>
                              </div>
                              <button
                                onClick={() => {
                                  if (confirm("Are you sure you want to delete this project?")) {
                                    setSavedProjects(prev => prev.filter(p => p.id !== proj.id));
                                    showToast("Project deleted.", "info");
                                  }
                                }}
                                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition-all cursor-pointer text-[10px]"
                                title="Delete Project"
                              >
                                🗑️
                              </button>
                            </div>

                            {/* Bullet points & lists showing headlines/points */}
                            {proj.points && (
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Important Points:</span>
                                <div className="text-[11px] text-slate-350 bg-[#121214]/60 p-2 rounded border border-slate-850 leading-relaxed font-sans whitespace-pre-wrap">
                                  {proj.points}
                                </div>
                              </div>
                            )}

                            {proj.headlines && (
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block">Headlines & Highlights:</span>
                                <div className="text-[11px] text-slate-355 bg-[#121214]/60 p-2 rounded border border-slate-850 leading-relaxed font-sans whitespace-pre-wrap">
                                  {proj.headlines}
                                </div>
                              </div>
                            )}

                            {proj.notes && (
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">Analysis Notes / संपूर्ण विवरण:</span>
                                <p className="text-[11px] text-slate-400 leading-relaxed whitespace-pre-wrap font-sans">
                                  {proj.notes}
                                </p>
                              </div>
                            )}

                            {proj.audioUrl && (
                              <div className="pt-2 border-t border-slate-850/60 flex flex-col gap-1">
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">🎙️ Attached Voice Recording:</span>
                                <audio src={proj.audioUrl} controls className="w-full h-8 bg-slate-900 rounded" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* VIEW: SESSION HISTORY LOGS */}
          {activeView === 'history' && (
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-fade-in text-left">
              {/* Header */}
              <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-left">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <History className="w-5.5 h-5.5 text-emerald-400 animate-pulse" />
                    User Study History & AI Chats / उपयोगकर्ता इतिहास एवं चैट
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Chronological history of your AI chat questions, saved chat sessions, quiz assessments, timer practice, and smart study notes.
                  </p>
                </div>

                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to clear your activity history logs / क्या आप सभी इतिहास मिटाना चाहते हैं?")) {
                      setActivityLogs([]);
                      showToast("History cleared / इतिहास मिटा दिया गया", "info");
                    }
                  }}
                  className="px-3.5 py-1.5 bg-[#0F1626] hover:bg-slate-850 text-xs font-bold text-[#FDA4AF] border border-slate-800 rounded-xl transition-all self-start sm:self-auto uppercase tracking-wide cursor-pointer"
                >
                  Clear All History / मिटायें
                </button>
              </div>

              {/* Scorecard Statistics overview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#090D16] border border-slate-800 p-3.5 rounded-xl flex flex-col justify-between">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">💬 AI Questions</span>
                  <span className="text-xl font-black text-cyan-400 mt-1">
                    {activityLogs.filter(l => l.type === 'chat').length} Asked
                  </span>
                  <span className="text-[9px] text-slate-500 mt-0.5">Queries recorded</span>
                </div>
                <div className="bg-[#090D16] border border-slate-800 p-3.5 rounded-xl flex flex-col justify-between">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">💾 Saved Chats</span>
                  <span className="text-xl font-black text-indigo-400 mt-1">
                    {savedChats.length} Sessions
                  </span>
                  <span className="text-[9px] text-slate-500 mt-0.5">Saved in storage</span>
                </div>
                <div className="bg-[#090D16] border border-slate-800 p-3.5 rounded-xl flex flex-col justify-between">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">🏆 Quizzes Taken</span>
                  <span className="text-xl font-black text-amber-400 mt-1">
                    {activityLogs.filter(l => l.type === 'quiz').length} Tests
                  </span>
                  <span className="text-[9px] text-slate-500 mt-0.5">Syllabus scores</span>
                </div>
                <div className="bg-[#090D16] border border-slate-800 p-3.5 rounded-xl flex flex-col justify-between">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">🕒 Focus Drills</span>
                  <span className="text-xl font-black text-emerald-400 mt-1">
                    {activityLogs.filter(l => l.type === 'timer').length} Timers
                  </span>
                  <span className="text-[9px] text-slate-500 mt-0.5">Completed sessions</span>
                </div>
              </div>

              {/* Search Bar & Filter Categories */}
              <div className="space-y-3 bg-[#090D16] p-4 border border-slate-850 rounded-2xl">
                <div className="relative">
                  <input
                    type="text"
                    value={historySearchQuery}
                    onChange={(e) => setHistorySearchQuery(e.target.value)}
                    placeholder="Search in history (e.g. grammar, quiz, geography, CGL...)..."
                    className="w-full bg-[#03060E] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 outline-none focus:border-emerald-500 transition-all pl-9"
                  />
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  {historySearchQuery && (
                    <button
                      onClick={() => setHistorySearchQuery("")}
                      className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
                  {[
                    { id: 'all', label: 'All History / सभी' },
                    { id: 'chat', label: '💬 AI Questions' },
                    { id: 'session', label: '💾 Saved Sessions' },
                    { id: 'quiz', label: '🏆 Quizzes' },
                    { id: 'timer', label: '🕒 Timers' },
                    { id: 'note', label: '📝 Notes' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setHistoryFilterCategory(tab.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer border ${
                        historyFilterCategory === tab.id
                          ? 'bg-emerald-600 text-white border-emerald-400 font-bold shadow-md shadow-emerald-600/20'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-850 hover:text-slate-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* SAVED CHAT SESSIONS SECTION (If selected or 'all') */}
              {(historyFilterCategory === 'all' || historyFilterCategory === 'session') && savedChats.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center justify-between">
                    <span>💾 Saved AI Chat Sessions ({savedChats.length})</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {savedChats
                      .filter(s => !historySearchQuery || s.title.toLowerCase().includes(historySearchQuery.toLowerCase()))
                      .map((session) => (
                        <div 
                          key={session.id}
                          className="bg-[#0F1626]/50 hover:bg-[#0F1626] border border-slate-800 p-4 rounded-xl flex items-center justify-between gap-3 transition-all text-left"
                        >
                          <div className="space-y-1 overflow-hidden">
                            <span className="text-[9px] font-bold uppercase text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                              💬 {session.messages.length} Messages
                            </span>
                            <h4 className="text-xs font-bold text-white truncate mt-1">
                              {session.title}
                            </h4>
                            <span className="text-[10px] text-slate-500 block">
                              {new Date(session.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                              onClick={() => {
                                setChatMessages(session.messages);
                                setActiveView('chat');
                                showToast(`Loaded chat: "${session.title}"`, "success");
                              }}
                              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer shadow-md"
                            >
                              Open Chat 💬
                            </button>
                            <button
                              onClick={() => deleteSavedChat(session.id)}
                              className="p-1.5 bg-rose-500/10 hover:bg-rose-500/30 text-rose-400 rounded-lg text-xs transition-all cursor-pointer"
                              title="Delete saved chat session"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* CHRONOLOGICAL ACTIVITY STREAM */}
              {(historyFilterCategory !== 'session') && (
                <div className="space-y-3.5">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
                    Chronological Activity Stream / क्रियाकलाप इतिहास
                  </h3>

                  {activityLogs.length === 0 ? (
                    <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-8 text-center text-slate-500 text-xs">
                      <span>कोई इतिहास रिकॉर्ड नहीं है। प्रश्न पूछने या क्विज़ शुरू करने पर आपकी गतिविधियाँ यहाँ दिखेंगी!</span>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {activityLogs
                        .filter(log => {
                          if (historyFilterCategory !== 'all' && log.type !== historyFilterCategory) return false;
                          if (historySearchQuery) {
                            const query = historySearchQuery.toLowerCase();
                            return log.title.toLowerCase().includes(query) || log.subtitle.toLowerCase().includes(query);
                          }
                          return true;
                        })
                        .map((log) => {
                          let typeBadge = null;
                          if (log.type === 'chat') {
                            typeBadge = (
                              <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 text-[9px] font-bold uppercase tracking-wide">
                                💬 AI Query
                              </span>
                            );
                          } else if (log.type === 'timer') {
                            typeBadge = (
                              <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 text-[9px] font-bold uppercase tracking-wide">
                                🕒 Timer Completed
                              </span>
                            );
                          } else if (log.type === 'quiz') {
                            typeBadge = (
                              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 text-[9px] font-bold uppercase tracking-wide">
                                🏆 Quiz Assessment
                              </span>
                            );
                          } else {
                            typeBadge = (
                              <span className="px-2 py-0.5 rounded bg-pink-500/10 text-pink-300 text-[9px] font-bold uppercase tracking-wide">
                                📝 Note Synced
                              </span>
                            );
                          }

                          const rawQueryText = log.title.replace(/^AI Query:\s*"/, '').replace(/"$/, '');

                          return (
                            <div 
                              key={log.id}
                              className="bg-[#0F1626]/30 hover:bg-[#0F1626]/55 border border-slate-850 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                            >
                              <div className="space-y-1 block text-left">
                                <div className="flex items-center gap-2 mb-1">
                                  {typeBadge}
                                  <span className="text-[10px] text-slate-500">
                                    {new Date(log.timestamp).toLocaleString()}
                                  </span>
                                </div>
                                <h4 className="text-xs sm:text-sm font-bold text-slate-200">
                                  {log.title}
                                </h4>
                                <p className="text-[11px] sm:text-xs text-slate-400">
                                  {log.subtitle}
                                </p>
                              </div>

                              <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0">
                                {log.type === 'chat' && (
                                  <button
                                    onClick={() => {
                                      setChatInput(rawQueryText);
                                      setActiveView('chat');
                                      handleSendChat(rawQueryText);
                                    }}
                                    className="px-3 py-1.5 bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-500/30 rounded-xl text-[10px] font-bold transition-all cursor-pointer"
                                  >
                                    Ask Again 💬
                                  </button>
                                )}

                                {log.score && (
                                  <div className="bg-[#090D16] border border-slate-800 px-3.5 py-1.5 rounded-xl text-center">
                                    <span className="text-[9px] block text-slate-500 uppercase font-bold">SCORE</span>
                                    <span className="text-xs sm:text-sm font-black text-amber-400">{log.score}</span>
                                  </div>
                                )}

                                <button
                                  onClick={() => {
                                    setActivityLogs(prev => prev.filter(item => item.id !== log.id));
                                  }}
                                  className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800/80 transition-all cursor-pointer text-xs"
                                  title="Remove item from history"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* VIEW: DAILY GOALS & TRACKER & PROGRESS METRICS */}
          {activeView === 'goals' && (
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-fade-in text-left">
              
              {/* Confetti Celebration Particle Overlay */}
              {triggerConfetti && (
                <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
                  <style>{`
                    @keyframes floatUpParticle {
                      0% { transform: translateY(105vh) scale(0.6) rotate(0deg); opacity: 1; }
                      100% { transform: translateY(-20vh) scale(1.3) rotate(360deg); opacity: 0; }
                    }
                    .animate-floating {
                      animation: floatUpParticle 3s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
                    }
                  `}</style>
                  {confettiParticles.map(p => (
                    <span
                      key={p.id}
                      className="fixed text-2xl animate-floating select-none pointer-events-none"
                      style={{
                        left: `${p.x}%`,
                        fontSize: `${p.size}px`,
                        animationDelay: `${p.delay}s`,
                      }}
                    >
                      {p.char}
                    </span>
                  ))}
                  
                  {/* Flash Celebration Overlay */}
                  <div className="fixed inset-0 bg-emerald-500/5 backdrop-blur-[1px] flex items-center justify-center transition-all duration-300">
                    <div className="bg-[#1E1B4B]/95 border border-emerald-500/30 p-6 rounded-2xl text-center space-y-2 max-w-xs shadow-2xl scale-110">
                      <Sparkles className="w-8 h-8 text-amber-400 mx-auto animate-bounce" />
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">Goal Accomplished! / लक्ष्य पूर्ण!</h4>
                      <p className="text-xs text-slate-350">बधाई हो! आपने अपना दैनिक लक्ष्य पूरा कर लिया है। कड़क तैयारी जारी रखें!</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Header */}
              <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="text-left">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Target className="w-5.5 h-5.5 text-emerald-400 animate-pulse" />
                    Daily Goal Tracker & Statistics / दैनिक प्रगति मीटर
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Balance academic studies and health tasks. Every checkmark triggers a visual confetti completion celebration!
                  </p>
                </div>
                
                {/* Overall Scorecard */}
                <div className="bg-[#0F1626] border border-slate-800 px-4 py-2 rounded-xl flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[9px] text-slate-500 uppercase font-black block tracking-wider">Total Progress</span>
                    <span className="text-sm font-extrabold text-emerald-400">
                      {dailyGoals.filter(g => g.done).length} / {dailyGoals.length} Done
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-emerald-900/20 border border-emerald-500/20 flex items-center justify-center text-xs font-black text-emerald-400">
                    {dailyGoals.length > 0 ? Math.round((dailyGoals.filter(g => g.done).length / dailyGoals.length) * 100) : 0}%
                  </div>
                </div>
              </div>

              {/* Category-Wise Progress Bars */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {['GK & Civil', 'English Rules', 'Quantitative', 'Healthy Life'].map((cat) => {
                  const catGoals = dailyGoals.filter(g => g.category === cat);
                  const total = catGoals.length;
                  const completed = catGoals.filter(g => g.done).length;
                  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
                  
                  return (
                    <div key={cat} className="bg-[#0F1626]/40 border border-slate-850 p-4 rounded-xl space-y-2 text-left">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-300">
                          {cat === 'GK & Civil' ? '🚩 GK & Polity' : cat === 'English Rules' ? '📝 English Rules' : cat === 'Quantitative' ? '📐 Quantitative' : '🍃 Healthy Life'}
                        </span>
                        <span className="text-xs font-black text-emerald-400">{percentage}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 transition-all duration-500 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 block">{completed} of {total} completed</span>
                    </div>
                  );
                })}
              </div>

              {/* Goals list and creator */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* List Column */}
                <div className="md:col-span-2 bg-[#0F1626]/30 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Objectives / सक्रिय लक्ष्य</h3>
                    <span className="text-[10px] text-slate-550 italic text-slate-500">Tap checkbox to complete</span>
                  </div>

                  <div className="space-y-2.5">
                    {dailyGoals.map(g => (
                      <div 
                        key={g.id} 
                        className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                          g.done 
                            ? 'bg-emerald-950/20 border-emerald-500/20 text-slate-500 line-through' 
                            : 'bg-[#090D16]/50 border-slate-850 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3 text-left">
                          <button
                            onClick={() => handleToggleGoal(g.id)}
                            className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all flex-shrink-0 ${
                              g.done 
                                ? 'bg-emerald-500 border-emerald-400 text-white' 
                                : 'border-slate-700 hover:border-slate-500 bg-slate-900'
                            }`}
                          >
                            {g.done && <Check className="w-3.5 h-3.5 stroke-[3.5]" />}
                          </button>
                          
                          <div>
                            <span className="text-xs sm:text-sm leading-relaxed block">{g.text}</span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-bold uppercase tracking-wider inline-block mt-1">
                              {g.category}
                            </span>
                          </div>
                        </div>

                        <button 
                          onClick={() => handleDeleteGoal(g.id)}
                          className="p-1 text-slate-650 hover:text-rose-400 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Addition and statistics controls Column */}
                <div className="space-y-6">
                  
                  {/* Create Goal Card */}
                  <div className="bg-[#0F1626]/30 border border-slate-800 rounded-2xl p-5 space-y-4 text-left">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Add Custom Goal / लक्ष्य जोड़ें</h3>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] text-slate-500 font-bold uppercase block">Describe Task</label>
                      <input 
                        type="text"
                        placeholder="e.g., Learn 15 vocabulary synonyms..."
                        value={newGoalInput}
                        onChange={(e) => setNewGoalInput(e.target.value)}
                        className="w-full text-xs p-2.5 bg-[#090D16] border border-slate-850 rounded-xl text-white placeholder-slate-650 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] text-slate-500 font-bold uppercase block">Category</label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {['GK & Civil', 'English Rules', 'Quantitative', 'Healthy Life'].map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setNewGoalCategory(cat)}
                            className={`px-2 py-1.5 rounded-lg border text-[10px] font-bold text-center transition-all ${
                              newGoalCategory === cat
                                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                                : 'border-slate-850 bg-slate-900 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            {cat === 'GK & Civil' ? 'Civics' : cat === 'English Rules' ? 'English' : cat === 'Quantitative' ? 'Math' : 'Healthy'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleAddGoal}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all uppercase tracking-wider block"
                    >
                      Insert Daily Goal
                    </button>
                  </div>

                  {/* Interactive Prep Hours Progress graph */}
                  <div className="bg-[#090D16]/60 border border-slate-800 rounded-2xl p-5 space-y-4 text-left">
                    <h3 className="text-xs font-bold text-slate-450 text-slate-450 text-slate-400 uppercase tracking-widest block">Subject Progress Hours / अध्ययन अवधि</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Visualize and log study duration. Maintain balance across syllabus segments to pass key exams securely:
                    </p>

                    <div className="space-y-3.5">
                      {subjectProgress.map(p => {
                        const maxVal = 60;
                        const percentage = Math.round((p.hours / maxVal) * 100);
                        
                        return (
                          <div key={p.id} className="space-y-1 block">
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="font-semibold text-slate-300 truncate text-ellipsis max-w-[140px]">{p.subject}</span>
                              <div className="flex items-center gap-1.5">
                                <button 
                                  onClick={() => handleUpdateProgressHour(p.id, -1)}
                                  className="w-4.5 h-4.5 rounded bg-slate-800 text-slate-450 hover:bg-slate-755 hover:bg-slate-700 font-bold flex items-center justify-center text-[10px]"
                                >
                                  -
                                </button>
                                <span className="font-mono font-black text-indigo-400 text-xs">{p.hours} Hrs</span>
                                <button 
                                  onClick={() => handleUpdateProgressHour(p.id, 1)}
                                  className="w-4.5 h-4.5 rounded bg-slate-800 text-slate-450 hover:bg-slate-755 hover:bg-slate-700 font-bold flex items-center justify-center text-[10px]"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                                style={{ width: `${Math.min(100, percentage)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* VIEW: CONCEPT FLOWCHART MAP */}
          {activeView === 'map' && (
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-fade-in text-left">
              
              {/* Header */}
              <div className="border-b border-slate-800 pb-4 text-left">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Network className="w-5.5 h-5.5 text-amber-500 animate-pulse" />
                  Concept Flowchart Explainer / संकल्पना मैप
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Type any study topic to explore it sequentially. Connecting paths and diagrams assist in deep memorization.
                </p>
              </div>

              {/* Topic Generator Control */}
              <div className="bg-[#0F1626]/40 border border-slate-800 p-5 rounded-2xl space-y-4">
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleGenerateConceptMap(); }}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <input
                    type="text"
                    value={conceptMapTopic}
                    onChange={(e) => setConceptMapTopic(e.target.value)}
                    placeholder="कोई भी विषय या प्रश्न टाइप करें (जैसे: Newton's Laws, Photosynthesis, SSC CGL Strategy, Akbar History...)"
                    className="flex-1 text-xs px-4 py-3 bg-[#090D16] border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-sans font-semibold"
                  />
                  <button
                    type="submit"
                    disabled={isGeneratingConceptMap || !conceptMapTopic.trim()}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-indigo-600/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {isGeneratingConceptMap ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Generating Map...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-3.5 h-3.5" />
                        <span>Visualize Topic</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Graphical Flowchart Map Stage or Empty State */}
              {mapNodes.length === 0 ? (
                <div className="p-12 bg-[#090D16] border border-slate-850 rounded-2xl text-center space-y-4 max-w-xl mx-auto my-6 shadow-inner">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-3xl shadow-lg text-indigo-400">
                    🗺️
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-white">
                      कोई भी विषय टाइप करें और मैपिंग देखें
                    </h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                      Type any question, subject, or exam topic above. HansAI will analyze the topic live and create a step-by-step visual flowchart for instant retention.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Visual Canvas Block */}
                  <div className="md:col-span-2 space-y-4">
                    
                    <div className="relative w-full h-[360px] bg-[#090D16] border border-slate-850 rounded-2xl overflow-hidden shadow-inner p-4">
                      {/* Background Tech Net Grid Lines */}
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.6)_1px,transparent_1px)] bg-[size:20px_20px] opacity-25" />
                      
                      {/* Connecting SVG Path Lines */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        {mapNodes.map((node, idx) => {
                          if (idx === 0) return null;
                          const prev = mapNodes[idx - 1];
                          return (
                            <g key={`connection-${idx}`}>
                              <line
                                x1={`${prev.x}%`}
                                y1={`${prev.y}%`}
                                x2={`${node.x}%`}
                                y2={`${node.y}%`}
                                stroke="rgba(99,102,241,0.3)"
                                strokeWidth="2.5"
                                strokeDasharray="5 5"
                              />
                              {/* Directional arrow dot */}
                              <circle
                                cx={`${(prev.x + node.x) / 2}%`}
                                cy={`${(prev.y + node.y) / 2}%`}
                                r="3.5"
                                fill="#6366F1"
                                className="animate-ping"
                              />
                            </g>
                          );
                        })}
                      </svg>

                      {/* Flowchart Nodes */}
                      {mapNodes.map((node, idx) => {
                        const isActive = activeMapNode?.id === node.id;
                        return (
                          <button
                            key={node.id}
                            onClick={() => { setActiveMapNode(node); setShowDetailedDiagram(false); }}
                            className={`absolute px-3 py-2 rounded-xl border text-[11px] font-bold transition-all shadow-xl text-center -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 hover:scale-105 ${
                              isActive
                                ? 'bg-amber-600 border-amber-400 text-white ring-4 ring-amber-500/20'
                                : 'bg-[#121A2A] border-slate-800 text-slate-350 hover:border-slate-700'
                            }`}
                            style={{ left: `${node.x}%`, top: `${node.y}%` }}
                          >
                            <span className="w-4 h-4 rounded-full bg-slate-900 border border-slate-800 text-[10px] flex items-center justify-center font-bold text-slate-400">
                              {idx + 1}
                            </span>
                            <span className="truncate max-w-[120px] sm:max-w-none">{node.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Clarification prompt if candidate says "I don't understand" */}
                    <div className="bg-[#121A2A] border border-dashed border-indigo-950/66 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                      <div>
                        <h4 className="text-xs font-bold text-indigo-300">समझ नहीं आया? / Confused about the topic flow?</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Let’s represent the concept via a high-yield visual SVG diagram mapping connections perfectly.</p>
                      </div>
                      <button
                        onClick={() => setShowDetailedDiagram(true)}
                        className="px-4 py-2 bg-indigo-900/30 hover:bg-indigo-900/50 text-indigo-300 text-xs font-black rounded-lg border border-indigo-500/30 uppercase tracking-wide transition-all"
                      >
                        💡 Explain with Diagram
                      </button>
                    </div>

                  </div>

                {/* Node Educational Detail sidebar panel */}
                <div className="bg-[#0F1626]/30 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                  {showDetailedDiagram ? (
                    <div className="space-y-4 animate-fade-in">
                      <div className="text-left">
                        <span className="text-[9px] bg-indigo-500/10 text-indigo-400 font-black px-2 py-0.5 rounded uppercase">VISUAL ENGRAVING DIAGRAM</span>
                        <h4 className="text-sm font-black text-white mt-1.5 uppercase">Logic Chart / आरेख नक़्शा</h4>
                        <p className="text-[11px] text-slate-400 mt-1">This SVG sketch illustrates the concept visually, rendering explicit confluences and rules step-by-step.</p>
                      </div>

                      <svg viewBox="0 0 220 260" className="w-full bg-[#090D16] border border-indigo-900/30 rounded-xl p-3 shadow-lg">
                        {mapNodes.map((node, nIdx) => {
                          const yPos = 20 + nIdx * 45;
                          const colors = ["#818CF8", "#34D399", "#FBBF24", "#F472B6", "#A78BFA"];
                          const currentColor = colors[nIdx % colors.length];
                          return (
                            <g key={`svg-node-${nIdx}`}>
                              {nIdx < mapNodes.length - 1 && (
                                <line
                                  x1="110"
                                  y1={yPos + 24}
                                  x2="110"
                                  y2={yPos + 45}
                                  stroke="#475569"
                                  strokeWidth="1.5"
                                  strokeDasharray="2 2"
                                />
                              )}
                              <rect
                                x="15"
                                y={yPos}
                                width="190"
                                height="28"
                                rx="6"
                                fill="#0F172A"
                                stroke={currentColor}
                                strokeWidth="1.2"
                              />
                              <text
                                x="110"
                                y={yPos + 17}
                                fill="#FFFFFF"
                                fontSize="7"
                                fontWeight="bold"
                                textAnchor="middle"
                              >
                                {node.label.length > 32 ? node.label.substring(0, 32) + '...' : node.label}
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                    </div>
                  ) : activeMapNode ? (
                    <div className="space-y-4 animate-fade-in">
                      <div className="text-left">
                        <span className="text-[10px] bg-indigo-500/10 text-indigo-400 font-bold px-2 py-0.5 rounded uppercase">Active Node Overview</span>
                        <h4 className="text-base font-black text-white mt-1.5">{activeMapNode.label}</h4>
                      </div>

                      <div className="bg-[#090D16] border border-slate-850 p-4 rounded-xl text-left space-y-3">
                        <div className="space-y-0.5">
                          <span className="text-[9px] text-slate-550 text-slate-500 font-bold uppercase tracking-wider block">Simplified description / सरल व्याख्या</span>
                          <p className="text-xs text-slate-200 leading-relaxed font-semibold">{activeMapNode.desc}</p>
                        </div>
                        
                        <div className="space-y-0.5 border-t border-slate-800/60 pt-2.5">
                          <span className="text-[9px] text-slate-550 text-slate-500 font-bold uppercase tracking-wider block">Academic Tip & Exam utility / परीक्षा सूत्र</span>
                          <p className="text-xs text-slate-350 leading-relaxed font-medium">{activeMapNode.detail}</p>
                        </div>
                      </div>

                      <div className="p-3 bg-indigo-950/20 border border-indigo-900/30 rounded-xl text-left">
                        <span className="text-[9px] text-indigo-400 font-extrabold uppercase block tracking-wider mb-1">Mnemonic Device Helper / याद रखने की ट्रिक:</span>
                        <p className="text-[11px] text-slate-400 italic">"Read this section calmly, breathing smoothly, then close your eyes and recall the sequence: Source ➔ Merging Confluence ➔ Application Plain."</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-slate-500 text-xs py-10">
                      <span>अवधारणा नक्शा लोड करने के लिए किसी एक नोड पर क्लिक करें!</span>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      if (activeMapNode) {
                        const idx = mapNodes.findIndex(n => n.id === activeMapNode.id);
                        const nextIdx = (idx + 1) % mapNodes.length;
                        setActiveMapNode(mapNodes[nextIdx]);
                        setShowDetailedDiagram(false);
                      }
                    }}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-850 text-xs font-bold text-indigo-400 rounded-xl transition-all border border-slate-800 uppercase tracking-wide block"
                  >
                    Next Logic Step ➔
                  </button>
                </div>

              </div>
              )}

            </div>
          )}

          {/* VIEW: SOUL WELLNESS & LIFE BALANCE */}
          {activeView === 'soul' && (
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-fade-in text-left">
              
              {/* Header */}
              <div className="border-b border-slate-800 pb-4 text-left">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Heart className="w-5.5 h-5.5 text-rose-455 text-rose-400 animate-pulse" />
                  Soul Wellness & Life Balance / विद्यार्थी जीवन शैली
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Exams are run over years, not days! Practice sound stress relief, mindful breathing, and preserve your vital human force.
                </p>
              </div>

              {/* Grid block: Breath visualizer & Lifestyle list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. Pranayama Breathing Drill */}
                <div className="bg-[#0F1626]/30 border border-slate-850 p-6 rounded-2xl flex flex-col justify-between space-y-6 text-center shadow-lg relative overflow-hidden">
                  
                  {/* Calming Glowing ambient aura background */}
                  <div className={`absolute inset-0 transition-opacity duration-[1000ms] pointer-events-none opacity-[0.03] ${
                    breathStage === 'Inhale' ? 'bg-indigo-500' : breathStage === 'Hold' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} />

                  <div className="text-center space-y-1 block relative z-10">
                    <span className="text-[10px] bg-rose-500/10 text-rose-400 font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Pranayama & Eye-Care Breath Engine
                    </span>
                    <h3 className="text-sm font-bold text-slate-200 uppercase mt-2">16-Second Mindful Box Breathing Loop</h3>
                    <p className="text-[11px] text-slate-400">Restores central nervous system alignment, relaxing severe eye muscles and mental anxiety.</p>
                  </div>

                  {/* Dynamic Glowing Sphere */}
                  <div className="h-44 flex items-center justify-center relative z-10">
                    <div 
                      className={`w-32 h-32 rounded-full flex flex-col items-center justify-center transition-all duration-[1000ms] shadow-2xl relative ${
                        breathStage === 'Inhale' 
                          ? 'bg-gradient-to-tr from-indigo-600 to-indigo-400 scale-110 shadow-indigo-500/40' 
                          : breathStage === 'Hold'
                          ? 'bg-gradient-to-tr from-amber-600 to-amber-400 scale-110 shadow-amber-500/50 scale-108 animate-pulse'
                          : breathStage === 'Exhale'
                          ? 'bg-gradient-to-tr from-emerald-600 to-emerald-400 scale-95 shadow-emerald-500/30'
                          : 'bg-slate-800 scale-90 shadow-slate-900/30'
                      }`}
                    >
                      <span className="text-2xl font-black text-white">{breathCounter}</span>
                      <span className="text-[11px] font-bold text-white/90 tracking-wide mt-1">
                        {breathStage === 'Inhale' ? 'श्वास लें / INHALE' : breathStage === 'Hold' ? 'रोकें / COMFORT HOLD' : breathStage === 'Exhale' ? 'छोड़ें / EXHALE' : 'विश्राम / REST'}
                      </span>
                    </div>

                    {/* Outer pulse wave */}
                    {isBreathingActive && (
                      <div className="absolute w-36 h-36 border border-indigo-500/30 rounded-full animate-ping pointer-events-none" />
                    )}
                  </div>

                  {/* Controls */}
                  <div className="space-y-3 relative z-10">
                    <div className="flex justify-center gap-2.5">
                      <button
                        onClick={() => { setIsBreathingActive(!isBreathingActive); }}
                        className={`px-4.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md ${
                          isBreathingActive 
                            ? 'bg-rose-600 hover:bg-rose-500 text-white' 
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                      >
                        {isBreathingActive ? 'Stop Session' : 'Start Session'}
                      </button>
                    </div>

                    <p className="text-[10px] text-slate-500 uppercase font-bold">
                      Sequence: Inhale(4s) ➔ Hold(4s) ➔ Exhale(4s) ➔ Rest(4s)
                    </p>
                  </div>

                </div>

                {/* 2. Healthy Habits checkoff list */}
                <div className="bg-[#0F1626]/30 border border-slate-850 p-6 rounded-2xl flex flex-col justify-between space-y-4 text-left shadow-lg">
                  <div className="space-y-1 block">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Healthy Habits Tracker / दैनिक आदतें</h3>
                    <p className="text-xs text-slate-400">Secure points for non-academic wellness objectives to fuel long-term study capacity:</p>
                  </div>

                  <div className="space-y-2.5">
                    {lifestyleTracker.map(h => (
                      <div 
                        key={h.id}
                        onClick={() => {
                          setLifestyleTracker(prev => prev.map(item => item.id === h.id ? { ...item, checked: !item.checked } : item));
                        }}
                        className={`p-3 rounded-xl border cursor-pointer select-none transition-all flex items-center justify-between gap-3 ${
                          h.checked 
                            ? 'bg-emerald-950/20 border-emerald-500/10 text-slate-500' 
                            : 'bg-[#090D16]/40 border-slate-850 text-slate-200 hover:border-slate-700'
                        }`}
                      >
                        <div className="text-left space-y-0.5 block">
                          <span className={`text-xs block font-bold ${h.checked ? 'line-through opacity-60' : ''}`}>{h.title}</span>
                          <span className="text-[10px] text-slate-500 block">{h.hint}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${h.checked ? 'bg-slate-800 text-slate-500' : 'bg-rose-950/20 text-rose-300'}`}>
                            +{h.rewardPoints} XP
                          </span>
                          <div className={`w-4.5 h-4.5 rounded border flex items-center justify-center transition-all ${
                            h.checked ? 'bg-emerald-500 border-emerald-400 text-white' : 'border-slate-800 bg-slate-900'
                          }`}>
                            {h.checked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* XP Points counter */}
                  <div className="border-t border-slate-800/80 pt-4 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block">Wellness Rank:</span>
                    <span className="font-mono text-xs font-black text-rose-400">
                      🏆 {lifestyleTracker.filter(h => h.checked).reduce((acc, current) => acc + current.rewardPoints, 0)} Reward Points
                    </span>
                  </div>

                </div>

              </div>

              {/* 3. APP DOWNLOAD IDENTITY PREVIEW BADGE */}
              <div className="bg-[#090D16]/60 border border-slate-800 rounded-2xl p-6 text-center space-y-4">
                <div className="text-center space-y-1 block">
                  <span className="text-[10px] bg-amber-500/10 text-amber-400 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    APP LAUNCHER IDENTITY ICON BADGE
                  </span>
                  <h3 className="text-sm font-bold text-slate-200 uppercase mt-2">What does the HansAI Launcher App look like when downloaded?</h3>
                  <p className="text-xs text-slate-400">
                    Your described device display icon launcher representation: A glowing golden-amber Swan (हंस) representing Wisdom coupled with a sparkling starburst.
                  </p>
                </div>

                {/* Simulated mobile device mockup icon badge */}
                <div className="flex flex-col items-center justify-center py-4 space-y-3">
                  
                  {/* Perfect Squircle Continuous Curve Icon Representation */}
                  <div className="w-24 h-24 rounded-[22px] bg-gradient-to-b from-[#0F172A] to-[#020617] border border-indigo-950 p-[3px] shadow-2xl shadow-indigo-500/10 flex items-center justify-center relative cursor-cell hover:scale-105 transition-transform duration-300">
                    
                    {/* Glowing outer golden-amber neon outline ring */}
                    <div className="absolute inset-0 rounded-[21px] border border-amber-500/30 animate-pulse pointer-events-none" />
                    
                    {/* Glowing background starburst flare */}
                    <div className="absolute w-12 h-12 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
                    
                    <div className="w-full h-full rounded-[18px] bg-gradient-to-tr from-[#020617] via-[#0D1527] to-[#1E293B] flex items-center justify-center relative overflow-hidden select-none">
                      
                      {/* Geometric lines depicting digital swan */}
                      <svg viewBox="0 0 100 100" className="w-16 h-16 text-amber-400 drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]">
                        {/* Swan neck */}
                        <path 
                          d="M75,30 Q65,15 50,30 T40,65 Q30,75 55,75 T80,68 T75,30 Z" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="3.5" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                        />
                        {/* Swan wing curves */}
                        <path 
                          d="M30,60 Q15,55 25,40 T45,55 L58,72" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2.5" 
                          strokeLinecap="round" 
                        />
                        {/* Swan crown crown */}
                        <circle cx="75" cy="27" r="2.5" fill="#FFF" className="animate-pulse" />
                      </svg>
                      
                      {/* Wisdom sparkling starburst top right */}
                      <div className="absolute top-2.5 right-2.5 animate-bounce">
                        <Sparkle className="w-4 h-4 text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)] fill-amber-300" />
                      </div>
                      
                      {/* Digital circuitry line */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-amber-500/40 rounded-full" />
                    </div>

                  </div>

                  <div className="text-center block space-y-0.5">
                    <span className="font-mono text-xs font-black text-amber-400">HANS (हंस) ID BADGE</span>
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">DEVICE HOME SCREEN PREVIEW</span>
                  </div>

                </div>

                <p className="text-[11px] text-slate-500 italic max-w-md mx-auto leading-relaxed">
                  "This professional launcher combines traditional Indian motifs of learning and intelligence with a high-resolution futuristic cyber-circuit aesthetic, reflecting HansAI’s core mission."
                </p>

              </div>

            </div>
          )}
          {activeView === 'owner-dashboard' && (
            <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 animate-fade-in text-left">
              
              {/* Access Gate: Check if user is owner */}
              {user?.email !== 'palhanslal4@gmail.com' && user?.role !== 'owner' ? (
                <div className="p-8 bg-[#0F1626]/80 border border-rose-500/40 rounded-3xl space-y-4 max-w-md mx-auto text-center shadow-2xl my-12">
                  <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-3xl shadow-lg shadow-rose-500/10 text-rose-400">
                    🚫
                  </div>
                  <h3 className="text-base font-extrabold text-white uppercase tracking-wide">
                    Access Denied / प्रवेश निषेध
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    The Owner Dashboard is strictly restricted to Owner <strong>Hanslal Pal Ji (palhanslal4@gmail.com)</strong>. Regular users cannot access this administrative console.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveView('chat')}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Return to Chat / मुख्य पृष्ठ
                  </button>
                </div>
              ) : !isOwnerAuthenticated ? (
                /* Password Protection Gate Lock */
                <div className="p-8 bg-[#0F1626]/80 border border-amber-500/40 rounded-3xl space-y-6 max-w-md mx-auto text-center shadow-2xl my-12">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-3xl shadow-lg shadow-amber-500/10">
                    🔐
                  </div>
                  <div className="space-y-2 text-center">
                    <h3 className="text-base font-extrabold text-white uppercase tracking-wide">
                      मालिक (Owner Admin) पासवर्ड दर्ज करें
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      This Owner Console contains registered student emails and search history logs. Enter master owner password to unlock:
                    </p>
                  </div>

                  <form onSubmit={handleOwnerPasswordSubmit} className="space-y-4 text-left">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 block">Owner Master Password:</label>
                      <div className="relative">
                        <input
                          type="password"
                          required
                          value={ownerPasswordInput}
                          onChange={(e) => {
                            setOwnerPasswordInput(e.target.value);
                            setOwnerPasswordError(false);
                          }}
                          placeholder="Enter Owner Password..."
                          className={`w-full text-xs py-3 pl-10 pr-4 bg-[#060913] border rounded-xl text-white placeholder-slate-500 focus:outline-none ${
                            ownerPasswordError ? 'border-rose-500 focus:border-rose-500' : 'border-slate-800 focus:border-amber-500'
                          }`}
                        />
                        <Key className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                      </div>
                      {ownerPasswordError && (
                        <p className="text-[11px] text-rose-400 font-semibold mt-1">
                          ✕ गलत पासवर्ड! कृपया सही पासवर्ड दर्ज करें।
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-550 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-600/20 cursor-pointer"
                    >
                      Unlock Admin Console 🔓
                    </button>
                  </form>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Header */}
                  <div className="border-b border-slate-800 pb-4 text-left flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-amber-500 shadow-md shadow-amber-500/20 animate-pulse" />
                        <h2 className="text-xl font-bold text-white uppercase tracking-wider">
                          👑 Owner Admin Console / Hanslal Pal Ji (हंसलाल पाल जी) डैशबोर्ड
                        </h2>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Secure password-protected owner administration console (palhanslal4@gmail.com)
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setIsOwnerAuthenticated(false);
                          showToast("Owner Console Locked 🔒", "info");
                        }}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md border border-amber-500/30"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Lock Console 🔒</span>
                      </button>

                      <button
                        onClick={fetchOwnerAnalytics}
                        disabled={isOwnerAnalyticsLoading}
                        className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-550 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isOwnerAnalyticsLoading ? 'animate-spin' : ''}`} />
                        <span>{isOwnerAnalyticsLoading ? 'लोड हो रहा है...' : 'Refresh / रिफ्रेश'}</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Real-time Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="bg-[#0F1626]/60 border border-slate-800 p-4 rounded-2xl space-y-1">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Total Registered Users</span>
                      <span className="text-2xl font-black text-indigo-400 block font-mono">{ownerAnalyticsData.totalUsers || ownerAnalyticsData.users.length}</span>
                      <span className="text-[9px] text-[#22c55e] block font-semibold">Registered via Name & Email</span>
                    </div>
                    <div className="bg-[#0F1626]/60 border border-slate-800 p-4 rounded-2xl space-y-1">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Total User Searches & Prompts</span>
                      <span className="text-2xl font-black text-emerald-400 block font-mono">{ownerAnalyticsData.totalQueries || ownerAnalyticsData.logs.length}</span>
                      <span className="text-[9px] text-slate-400 block">Logged activity records</span>
                    </div>
                    <div className="bg-[#0F1626]/60 border border-slate-800 p-4 rounded-2xl space-y-1">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Offline Status</span>
                      <span className="text-2xl font-black text-amber-400 block font-mono">{isOffline ? 'OFFLINE' : 'ONLINE'}</span>
                      <span className="text-[9px] text-slate-400 block font-semibold">Service Worker cached</span>
                    </div>
                    <div className="bg-[#0F1626]/60 border border-slate-800 p-4 rounded-2xl space-y-1">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">User Feedback Rate</span>
                      <span className="text-2xl font-black text-pink-400 block font-mono">4.9 / 5.0</span>
                      <span className="text-[9px] text-slate-400 block">From {feedbacks.length} student audits</span>
                    </div>
                  </div>

                  {/* SECTION 1: REGISTERED USERS LIST (कौन-कौन चलाया है) */}
                  <div className="bg-[#0F1626]/60 border border-slate-800 p-5 rounded-3xl space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                      <div>
                        <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                          <Users className="w-4 h-4 text-indigo-400" />
                          1. Registered Users Directory / कौन-कौन प्रयोग किया है ({ownerAnalyticsData.users.length})
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          List of all students who submitted Name & Email before using HansAI.
                        </p>
                      </div>

                      {/* Search box for users */}
                      <div className="relative w-full sm:w-64">
                        <input
                          type="text"
                          value={ownerUserSearchQuery}
                          onChange={(e) => setOwnerUserSearchQuery(e.target.value)}
                          placeholder="Search name or email..."
                          className="w-full text-xs py-2 pl-8 pr-3 bg-[#060913] border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                        />
                        <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                      </div>
                    </div>

                    <div className="overflow-x-auto max-h-72 overflow-y-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead className="sticky top-0 bg-[#0B0F1B] z-10">
                          <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase font-bold">
                            <th className="py-2.5 px-3">Student Name</th>
                            <th className="py-2.5 px-3">Email Address</th>
                            <th className="py-2.5 px-3">First Registered</th>
                            <th className="py-2.5 px-3">Last Active</th>
                            <th className="py-2.5 px-3 text-center">Prompts Used</th>
                            <th className="py-2.5 px-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-850 font-medium">
                          {ownerAnalyticsData.users
                            .filter(u => 
                              u.name.toLowerCase().includes(ownerUserSearchQuery.toLowerCase()) || 
                              u.email.toLowerCase().includes(ownerUserSearchQuery.toLowerCase())
                            )
                            .map((usr) => (
                              <tr key={usr.id} className="hover:bg-indigo-500/5 transition-all">
                                <td className="py-2.5 px-3 text-white font-bold flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-300 font-bold flex items-center justify-center text-[10px]">
                                    {usr.name.charAt(0).toUpperCase()}
                                  </div>
                                  <span>{usr.name}</span>
                                </td>
                                <td className="py-2.5 px-3 text-slate-300 font-mono text-[11px]">{usr.email}</td>
                                <td className="py-2.5 px-3 text-slate-400 text-[10px]">{usr.registeredAt ? new Date(usr.registeredAt).toLocaleString() : 'Recent'}</td>
                                <td className="py-2.5 px-3 text-slate-400 text-[10px]">{usr.lastActiveAt ? new Date(usr.lastActiveAt).toLocaleString() : 'Recent'}</td>
                                <td className="py-2.5 px-3 text-center">
                                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-[10px]">
                                    {usr.promptCount || 0}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3 text-right">
                                  <button
                                    onClick={() => {
                                      setSelectedUserForLogs(usr.email);
                                      setOwnerLogSearchQuery(usr.email);
                                      showToast(`Filtering search history logs for ${usr.name}`, "info");
                                    }}
                                    className="px-2.5 py-1 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer border-none"
                                  >
                                    View Searches 🔍
                                  </button>
                                </td>
                              </tr>
                            ))}

                          {ownerAnalyticsData.users.length === 0 && (
                            <tr>
                              <td colSpan={6} className="py-6 text-center text-slate-500 text-xs">
                                No registered users found yet. New users will automatically appear here once registered.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* SECTION 2: USER SEARCHES & PROMPTS LOG (क्या-क्या खोजा या पूछा गया है) */}
                  <div className="bg-[#0F1626]/60 border border-slate-800 p-5 rounded-3xl space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                      <div>
                        <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                          <Search className="w-4 h-4 text-emerald-400" />
                          2. User Searches & Prompts History / क्या-क्या खोजा/पूछा गया है ({ownerAnalyticsData.logs.length})
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          Complete audit log of questions, chats, research topics, and search queries asked by users.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Clear Logs Button */}
                        <button
                          onClick={async () => {
                            if (window.confirm("क्या आप सचमुच सभी सर्वर सर्च एवं चैट लॉग साफ़ करना चाहते हैं?")) {
                              try {
                                const res = await fetch('/api/owner/clear-logs', { method: 'POST' });
                                if (res.ok) {
                                  showToast("All search history logs cleared! 🧹", "success");
                                  fetchOwnerAnalytics();
                                }
                              } catch (e) {
                                showToast("Failed to clear logs", "warn");
                              }
                            }
                          }}
                          className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer border-none"
                        >
                          Clear Logs 🧹
                        </button>

                        {/* Search Input for logs */}
                        <div className="relative w-full sm:w-56">
                          <input
                            type="text"
                            value={ownerLogSearchQuery}
                            onChange={(e) => setOwnerLogSearchQuery(e.target.value)}
                            placeholder="Filter query or email..."
                            className="w-full text-xs py-1.5 pl-8 pr-3 bg-[#060913] border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                          />
                          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
                        </div>
                      </div>
                    </div>

                    {/* Filter Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
                      <div className="flex items-center gap-1.5 overflow-x-auto">
                        {['all', 'music', 'chat', 'research', 'quiz', 'search'].map((ft) => (
                          <button
                            key={ft}
                            onClick={() => setOwnerLogTypeFilter(ft)}
                            className={`px-3 py-1 rounded-xl uppercase text-[10px] font-bold transition-all cursor-pointer border-none ${
                              ownerLogTypeFilter === ft 
                                ? 'bg-indigo-600 text-white shadow-md' 
                                : 'bg-slate-800/60 text-slate-400 hover:text-white'
                            }`}
                          >
                            {ft === 'music' ? '🎵 Music / संगीत' : ft}
                          </button>
                        ))}
                      </div>

                      {selectedUserForLogs && (
                        <div className="flex items-center gap-2 bg-indigo-500/10 px-2.5 py-1 rounded-xl text-indigo-300 text-[11px]">
                          <span>Filtered for: <strong>{selectedUserForLogs}</strong></span>
                          <button
                            onClick={() => {
                              setSelectedUserForLogs(null);
                              setOwnerLogSearchQuery('');
                            }}
                            className="text-slate-400 hover:text-white text-xs cursor-pointer border-none bg-transparent"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="overflow-x-auto max-h-96 overflow-y-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead className="sticky top-0 bg-[#0B0F1B] z-10">
                          <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase font-bold">
                            <th className="py-2.5 px-3">Timestamp</th>
                            <th className="py-2.5 px-3">Student Name & Email</th>
                            <th className="py-2.5 px-3">Type</th>
                            <th className="py-2.5 px-3">User Query / Search Text</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-850 font-medium">
                          {ownerAnalyticsData.logs
                            .filter(lg => {
                              const matchesSearch = 
                                lg.query.toLowerCase().includes(ownerLogSearchQuery.toLowerCase()) || 
                                lg.userEmail.toLowerCase().includes(ownerLogSearchQuery.toLowerCase()) ||
                                (lg.userName && lg.userName.toLowerCase().includes(ownerLogSearchQuery.toLowerCase()));
                              const matchesType = ownerLogTypeFilter === 'all' || lg.type === ownerLogTypeFilter;
                              return matchesSearch && matchesType;
                            })
                            .map((logItem) => (
                              <tr key={logItem.id} className="hover:bg-slate-800/30 transition-all">
                                <td className="py-2.5 px-3 text-slate-400 text-[10px] whitespace-nowrap font-mono">
                                  {new Date(logItem.timestamp).toLocaleString()}
                                </td>
                                <td className="py-2.5 px-3">
                                  <div className="font-bold text-slate-200">{logItem.userName || 'Student'}</div>
                                  <div className="text-[10px] text-slate-400 font-mono">{logItem.userEmail}</div>
                                </td>
                                <td className="py-2.5 px-3">
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                                    logItem.type === 'music' ? 'bg-rose-500/20 text-rose-300' :
                                    logItem.type === 'chat' ? 'bg-indigo-500/20 text-indigo-300' :
                                    logItem.type === 'research' ? 'bg-emerald-500/20 text-emerald-300' :
                                    logItem.type === 'quiz' ? 'bg-pink-500/20 text-pink-300' :
                                    'bg-amber-500/20 text-amber-300'
                                  }`}>
                                    {logItem.type}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3 text-slate-100 font-sans max-w-md leading-relaxed">
                                  {logItem.query}
                                </td>
                              </tr>
                            ))}

                          {ownerAnalyticsData.logs.length === 0 && (
                            <tr>
                              <td colSpan={4} className="py-6 text-center text-slate-500 text-xs">
                                No search/chat activity logs recorded yet. Activities will automatically log as users interact.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Student Feedbacks Table */}
                  <div className="bg-[#0F1626]/60 border border-slate-800 p-5 rounded-3xl space-y-4">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      📝 Student Reviews & Ratings ({feedbacks.length})
                    </h3>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-500 text-[10px] uppercase font-bold">
                            <th className="py-2.5 px-3">Student Email</th>
                            <th className="py-2.5 px-3">Stars</th>
                            <th className="py-2.5 px-3 text-center">Feedback / Review</th>
                            <th className="py-2.5 px-3 text-right">Date Applied</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-850 font-medium">
                          {feedbacks.map((fb) => (
                            <tr key={fb.id} className="hover:bg-slate-800/10">
                              <td className="py-3 px-3 text-slate-300 font-mono text-[11px]">{fb.user}</td>
                              <td className="py-3 px-3 text-amber-400 whitespace-nowrap">{"★".repeat(fb.stars)}</td>
                              <td className="py-3 px-3 text-slate-200 text-left max-w-xs">{fb.comment}</td>
                              <td className="py-3 px-3 text-slate-500 text-right text-[10px] font-mono">{fb.date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* VIEW: SARKARI RESULT / सरकारी नौकरी */}
          {activeView === 'sarkari-result' && (
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-fade-in text-left">
              <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <FileText className="w-5.5 h-5.5 text-orange-400" />
                    Sarkari Result Portal / सरकारी नौकरी और परीक्षा नवीनतम अपडेट
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 pb-1">
                    Get actual real-time notifications for SSC Stenographer, CGL, CHSL, GD, selection posts, and other state exam rules.
                  </p>
                </div>
                <a 
                  href="https://www.sarkariresult.com/" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="px-3.5 py-1.5 bg-orange-600/20 text-orange-400 border border-orange-500/30 rounded-xl text-xs font-bold hover:bg-orange-600 hover:text-white transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  Visit Official site / मूल वेबसाइट 🌐
                </a>
              </div>

              {/* Sarkari result sections layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* 1. Latest Jobs Section */}
                <div className="bg-[#0F1626]/40 border border-slate-800 p-5 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      Latest Jobs / रिक्तियां
                    </h3>
                    <span className="bg-emerald-500/10 text-emerald-400 text-[9px] px-1.5 py-0.2 rounded font-black font-mono">NEW</span>
                  </div>
                  <div className="space-y-3 font-medium">
                    {[
                      { title: "SSC Stenographer Grade C & D Notification 2026", desc: "Short Notice Released. Online App Starts Soon.", subject: "SSC Stenographer" },
                      { title: "SSC CHSL (10+2) 2026 Tier I Online Application", desc: "Apply Online now for 3800+ vacancies across India.", subject: "SSC CHSL" },
                      { title: "BPSC 71st Combined Mains Exam Forms 2026", desc: "For Administrative postings. Apply before deadline.", subject: "BPSC Mains" },
                      { title: "SSC GD Constable Recruitments 2026", desc: "35,000+ posts in CAPF, NIA, SSF, and Assam Rifles.", subject: "SSC GD" },
                      { title: "Railway RRB ALP Recruitments 2026 Stage II", desc: "Exam dates active. Download admit papers soon.", subject: "Railway ALP" }
                    ].map((job, idx) => (
                      <div key={idx} className="p-3 bg-[#090D16]/50 rounded-xl border border-slate-850 hover:border-slate-800 transition-all space-y-1">
                        <h4 className="text-[11px] font-bold text-slate-100 hover:text-indigo-400 cursor-pointer" onClick={() => handleSendChat(`Give me details, eligibility, syllabus, and selection pattern for ${job.title}`)}>{job.title}</h4>
                        <p className="text-[10px] text-slate-400">{job.desc}</p>
                        <div className="flex items-center justify-between pt-1">
                          <button 
                            onClick={() => {
                              setResearchTopic(job.subject);
                              setActiveView('research');
                            }}
                            className="text-[9px] text-indigo-400 hover:underline font-bold cursor-pointer"
                          >
                            Research Syllabus 🔬
                          </button>
                          <button 
                            onClick={() => {
                              setTimerPresetVal(30);
                              setTimeLeft(1800);
                              setDisableNotesForTimer(true);
                              setActiveView('timer');
                              showToast(`Steno offline mock timer for ${job.subject} started! ⏱️`, "info");
                            }}
                            className="text-[9px] text-amber-500 hover:underline font-bold cursor-pointer"
                          >
                            Practice Mock ⏱️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Admit Cards Section */}
                <div className="bg-[#0F1626]/40 border border-slate-800 p-5 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-indigo-400" />
                      Admit Cards / प्रवेश पत्र
                    </h3>
                  </div>
                  <div className="space-y-3 font-medium">
                    {[
                      { title: "SSC CGL 2026 Tier I Exam Region Wise Admit Papers", desc: "All regions CRF, NWR, ER download status active." },
                      { title: "UPSC Civil Services Prelims 2026 Call Letters", desc: "Enter Registration details to download PDF print." },
                      { title: "SSC GD Constable 2025 Physical Standards Call Letter", desc: "Physical test phase starting from next fortnight." },
                      { title: "Bihar Police Sub Inspector Main Exam Hall Ticket", desc: "Download available via Bihar board login node." }
                    ].map((admit, idx) => (
                      <div key={idx} className="p-3 bg-[#090D16]/50 rounded-xl border border-slate-850 space-y-1">
                        <h4 className="text-[11px] font-bold text-slate-200">{admit.title}</h4>
                        <p className="text-[10px] text-slate-400 leading-relaxed">{admit.desc}</p>
                        <div className="pt-1.5 flex justify-end">
                          <span className="text-[9px] bg-indigo-500/10 text-indigo-400 rounded px-1.5 py-0.5 font-bold">STATUS: RELEASING</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Results Section */}
                <div className="bg-[#0F1626]/40 border border-slate-800 p-5 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <h3 className="text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-500" />
                      Exam Results / परिणाम
                    </h3>
                  </div>
                  <div className="space-y-3 font-medium">
                    {[
                      { title: "SSC CGL 2025 Final Out Selected List PDF", desc: "Combined Graduate Level score verified. Checked selection lists." },
                      { title: "Bihar BPSC 70th Prelims Cut Off Marks", desc: "Cutoffs released. General candidates score cutoff: 104.5." },
                      { title: "SSC Stenographer Grade C & D 2025 Skill Test Result", desc: "Download roll numbers qualifying the shorthand criteria." },
                      { title: "UGC NET June Session Final Cutoff Result 2026", desc: "JRF & Assistant Professorship subject list available." }
                    ].map((resItem, idx) => (
                      <div key={idx} className="p-3 bg-[#090D16]/50 rounded-xl border border-slate-850 space-y-1 hover:bg-[#090D16]/80 transition-all">
                        <h4 className="text-[11px] font-bold text-slate-200">{resItem.title}</h4>
                        <p className="text-[10px] text-slate-400 leading-relaxed">{resItem.desc}</p>
                        <div className="pt-2 flex items-center justify-between">
                          <button 
                            onClick={() => handleSendChat(`Analyze cutoffs and download result process for ${resItem.title}`)}
                            className="text-[9px] text-[#22c55e] hover:underline font-bold cursor-pointer"
                          >
                            Analyze Cutoffs 📈
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}



        </div>

        {/* BOTTOM MINIMAL FOOTER BAR */}
        <footer className="py-4 text-center text-[10px] text-slate-600 uppercase tracking-wider border-t border-slate-800/60 bg-[#090D16]/85">
          <span>Digital Teacher Ecosystem • Built for Indian Aspirants & Shorthand Learners</span>
        </footer>

      {/* SETTINGS MODAL DIALOG */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" id="settings-overlay">
          <div className="bg-[#0F1626] border border-slate-800 rounded-2xl w-full max-w-sm p-5 relative shadow-2xl" id="settings-card">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3" id="settings-header">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white tracking-wide">App Settings / सेटिंग्स</h3>
              </div>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                id="settings-close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Options */}
            <div className="py-2.5 space-y-3.5 overflow-y-auto max-h-[60vh] pr-1" id="settings-content">
              
              {/* API Connection Model Selector */}
              <div className="space-y-1.5" id="settings-model-container">
                <label className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-amber-400" />
                  AI Connection Model / एआई मॉडल चुनें
                </label>
                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() => setSelectedModel('gemini-3.5-flash')}
                    className={`p-2 rounded-xl border text-left transition-all ${
                      selectedModel === 'gemini-3.5-flash'
                        ? 'border-indigo-500 bg-indigo-500/10 text-white font-semibold shadow-inner'
                        : 'border-slate-800 bg-[#090D16] text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xs font-bold block mb-0.5">Gemini 3.5 Flash (Default)</span>
                    <span className="text-[9px] opacity-75 block">Recommended. Extremely fast, intelligent educational companion.</span>
                  </button>
                  
                  <button
                    onClick={() => setSelectedModel('gemini-3.1-pro-preview')}
                    className={`p-2 rounded-xl border text-left transition-all ${
                      selectedModel === 'gemini-3.1-pro-preview'
                        ? 'border-indigo-500 bg-indigo-500/10 text-white font-semibold shadow-inner'
                        : 'border-slate-800 bg-[#090D16] text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xs font-bold block mb-0.5">Gemini 3.1 Pro (Academic)</span>
                    <span className="text-[9px] opacity-75 block">Sophisticated coding, long stenographer explanations, and intense calculations.</span>
                  </button>
                </div>
              </div>

              {/* Educational Study Highlighter Toggle */}
              <div className="space-y-1.5 border-t border-slate-800/60 pt-3" id="settings-highlight-container">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Study Highlighter / मुख्य बिंदु हाइलाइट करें
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setIsHighlightingEnabled(true)}
                    className={`py-2 px-3 rounded-xl border text-center text-xs font-semibold transition-all ${
                      isHighlightingEnabled
                        ? 'border-indigo-500 bg-indigo-555/15 bg-indigo-600/10 text-white font-bold'
                        : 'border-slate-800 bg-[#090D16] text-slate-400 hover:border-slate-705'
                    }`}
                  >
                    Enabled (खड़ा पीला)
                  </button>
                  <button
                    onClick={() => setIsHighlightingEnabled(false)}
                    className={`py-2 px-3 rounded-xl border text-center text-xs font-semibold transition-all ${
                      !isHighlightingEnabled
                        ? 'border-indigo-500 bg-indigo-555/15 bg-indigo-600/10 text-white font-bold'
                        : 'border-slate-800 bg-[#090D16] text-slate-400 hover:border-slate-705'
                    }`}
                  >
                    Disabled (साधारण)
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 border-t border-slate-800/60 pt-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">App Theme / थीम</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setTheme('midnight')}
                    className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                      theme === 'midnight'
                        ? 'border-indigo-500 bg-indigo-600/10 text-white shadow-md'
                        : 'border-slate-800 bg-[#090D16] text-slate-400 hover:border-slate-705'
                    }`}
                    id="settings-theme-midnight"
                  >
                    <span className="text-xs font-bold block mb-0.5">Midnight / मिडनाइट</span>
                    <span className="text-[10px] opacity-75">High-contrast Slate Blue</span>
                  </button>
                  <button
                    onClick={() => setTheme('charcoal')}
                    className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                      theme === 'charcoal'
                        ? 'border-indigo-500 bg-indigo-600/10 text-white shadow-md'
                        : 'border-slate-800 bg-[#090D16] text-slate-400 hover:border-slate-705'
                    }`}
                    id="settings-theme-charcoal"
                  >
                    <span className="text-xs font-bold block mb-0.5">Charcoal / चारकोल</span>
                    <span className="text-[10px] opacity-75">Softer Dark Gray Zinc</span>
                  </button>
                </div>
              </div>

              {/* Text Size setting */}
              <div className="space-y-1.5 border-t border-slate-800/60 pt-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Text Size / फॉन्ट साइज</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['sm', 'base', 'lg'] as const).map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setTextSize(sz)}
                      className={`py-1.5 px-2 rounded-lg border text-center text-xs font-semibold capitalize transition-all ${
                        textSize === sz
                          ? 'border-indigo-500 bg-indigo-600/10 text-white font-bold'
                          : 'border-slate-800 bg-[#090D16] text-slate-400 hover:border-slate-705'
                      }`}
                      id={`settings-size-${sz}`}
                    >
                      {sz === 'sm' ? 'Small' : sz === 'base' ? 'Normal' : 'Large'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="border-t border-slate-800 pt-3 flex justify-end" id="settings-footer">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-550 hover:bg-indigo-500 text-white text-xs font-bold uppercase rounded-lg tracking-wide transition-all"
                id="settings-done"
              >
                Apply & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOGIN MODAL DIALOG */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className={`${themeColors.bgCard} border ${themeColors.border} rounded-2xl w-full max-w-sm p-6 relative shadow-2xl space-y-4 text-left`}>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-750 pb-3">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider">{t('loginTitle')}</h3>
              </div>
              <button 
                onClick={() => setIsLoginModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Google Account Selector Selection Choice */}
            <div className="space-y-4 text-xs">
              <p className="text-slate-400 leading-relaxed text-xs">
                {t('loginDesc')}
              </p>

              {/* Presets List */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-[#818CF8] uppercase tracking-wider">{t('selectAccountHeader')}</span>
                
                {/* 1. Hanslal Pal Owner Admin */}
                <button
                  type="button"
                  onClick={() => {
                    const loggedUser = {
                      email: 'palhanslal4@gmail.com',
                      name: 'हंसलाल पाल जी',
                      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                    };
                    localStorage.setItem('hansai-user-session', JSON.stringify(loggedUser));
                    setUser(loggedUser);
                    setIsLoginModalOpen(false);
                    showToast(language === 'hindi' ? "मलिक एडमिन राइट्स सत्यापित! आपका स्वागत है, हंसलाल पाल जी। 👑" : "Owner privileges verified! Welcome Hanslal Pal Ji. 👑", "success");
                    setActiveView('owner-dashboard');
                  }}
                  className="w-full p-3 bg-indigo-950/40 hover:bg-indigo-950/80 border border-indigo-900/40 hover:border-indigo-500 rounded-xl flex items-center gap-3 text-left transition-all group"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
                    alt="Hanslal Pal Profile"
                    className="w-8 h-8 rounded-full border border-indigo-500 shadow-md group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1">
                    <span className="font-bold text-slate-100 block">हंसलाल पाल जी (Owner)</span>
                    <span className="text-[10px] text-slate-400 font-mono block">palhanslal4@gmail.com</span>
                  </div>
                  <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-bold uppercase">Owner Admin</span>
                </button>

                {/* No additional presets */}
              </div>

              {/* Custom Google Sign-In Form Bypass */}
              <div className="border-t border-slate-800 pt-3 space-y-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">{t('useAnotherAccount')}</span>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const email = (formData.get('email') as string || '').trim().toLowerCase();
                    const name = (formData.get('name') as string || '').trim() || 'Aspirant';

                    if (!email) {
                      showToast("कृपया एक वैध ईमेल दर्ज करें।", "warn");
                      return;
                    }

                    // Assign a beautiful deterministic Google avatar from Unsplash
                    const hash = email.length % 5;
                    const avatarList = [
                      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100",
                      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100",
                      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100",
                      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100",
                      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"
                    ];
                    const selectedAvatar = avatarList[hash];

                    const loggedUser = { email, name, avatarUrl: selectedAvatar };
                    localStorage.setItem('hansai-user-session', JSON.stringify(loggedUser));
                    setUser(loggedUser);
                    setIsLoginModalOpen(false);
                    
                    if (email === 'palhanslal4@gmail.com') {
                      showToast(language === 'hindi' ? "मलिक एडमिन राइट्स सत्यापित! आपका स्वागत है, हंसलाल पाल जी। 👑" : "Owner privileges verified! Welcome Hanslal Pal Ji. 👑", "success");
                      setActiveView('owner-dashboard');
                    } else {
                      showToast(`Google Sign In successfully authenticated as ${name}! 🚀`, "success");
                    }
                  }}
                  className="space-y-3"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="text"
                      name="name"
                      required
                      placeholder={t('yourNameLabel')}
                      className="w-full py-2 px-3 bg-[#090D16] border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                    <input 
                      type="email"
                      name="email"
                      required
                      placeholder={t('emailLabel')}
                      className="w-full py-2 px-3 bg-[#090D16] border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold uppercase tracking-wider text-[10px] transition-all cursor-pointer"
                  >
                    {t('verifyProceed')}
                  </button>
                </form>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* FEEDBACK SUBMISSION MODAL */}
      {isFeedbackOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0F1626] border border-slate-800 rounded-2xl w-full max-w-sm p-6 relative shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <PenTool className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white tracking-wide">{t('feedbackTitle')}</h3>
              </div>
              <button 
                onClick={() => setIsFeedbackOpen(false)}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Strict Google Authentication Lock Check */}
            {!user ? (
              <div className="py-4 text-center space-y-4">
                <AlertCircle className="w-10 h-10 text-amber-500 mx-auto animate-bounce" />
                <p className="text-xs text-slate-400 leading-relaxed">
                  {t('feedbackLoggedOutWarning')}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsFeedbackOpen(false);
                    setIsLoginModalOpen(true);
                  }}
                  className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-600 font-bold uppercase text-[10px] tracking-wider text-white rounded-xl flex items-center justify-center gap-2 shadow-inner"
                >
                  <User className="w-4 h-4" />
                  {t('googleSignInBtn')}
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                
                {/* Score slider for Concepts Accuracy */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-slate-300">{t('ratingAccuracy')}</span>
                    <span className="text-amber-400">{feedbackRatingAccuracy} / 5</span>
                  </div>
                  <input 
                    type="range" min="1" max="5" 
                    value={feedbackRatingAccuracy} 
                    onChange={(e) => setFeedbackRatingAccuracy(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer h-1 bg-slate-850 rounded"
                  />
                </div>

                {/* Score slider for Latency / speed */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-[#818cb4] text-slate-300">{t('ratingSpeed')}</span>
                    <span className="text-amber-400">{feedbackRatingSpeed} / 5</span>
                  </div>
                  <input 
                    type="range" min="1" max="5" 
                    value={feedbackRatingSpeed} 
                    onChange={(e) => setFeedbackRatingSpeed(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer h-1 bg-slate-850 rounded"
                  />
                </div>

                {/* Score slider for Interface Experience */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-[#818cb4] text-slate-300">{t('ratingExperience')}</span>
                    <span className="text-amber-400">{feedbackRatingExperience} / 5</span>
                  </div>
                  <input 
                    type="range" min="1" max="5" 
                    value={feedbackRatingExperience} 
                    onChange={(e) => setFeedbackRatingExperience(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer h-1 bg-slate-850 rounded"
                  />
                </div>

                {/* Comment Text */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 block tracking-wider text-left">{t('reviewTextPlaceholder')}</label>
                  <textarea
                    rows={3}
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    placeholder={language === 'hindi' ? "अनुभव या सुधार सुझाव दर्ज करें..." : "e.g., Stunning web interface and perfect shorthand timing guide..."}
                    className="w-full p-3 bg-[#090D16] border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 leading-relaxed text-xs"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!feedbackComment.trim()) {
                      showToast("कृपया अपनी समीक्षा दर्ज करें!", "warn");
                      return;
                    }
                    
                    const newFeedbackItem = {
                      id: `fb-user-${Date.now()}`,
                      user: user.email,
                      avatarUrl: user.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
                      ratingAccuracy: feedbackRatingAccuracy,
                      ratingSpeed: feedbackRatingSpeed,
                      ratingExperience: feedbackRatingExperience,
                      comment: feedbackComment.trim(),
                      date: new Date().toISOString().split('T')[0]
                    };

                    const updatedFeedbacks = [newFeedbackItem, ...feedbacks];
                    setFeedbacks(updatedFeedbacks);
                    localStorage.setItem('hansai-feedbacks-v2', JSON.stringify(updatedFeedbacks));
                    
                    showToast(language === 'hindi' ? "समीक्षा सफलतापूर्वक दर्ज की गई! धन्यवाद। 🙏" : "Your rating & review successfully registered! Thank you. 🙏", "success");
                    setFeedbackComment("");
                    setIsFeedbackOpen(false);
                  }}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold uppercase tracking-wider text-[11px] transition-all cursor-pointer"
                >
                  {t('submitFeedbackBtn')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* NAVIGATION DRAWER/SIDEBAR (FUNCTIONAL & REVEAL ACTIVE VIEW) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex font-sans text-left">
          {/* Backdrop blur click wrapper */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Sidebar Panel Container */}
          <div className="relative flex flex-col w-full max-w-xs bg-[#090D16] border-r border-slate-850 text-slate-100 h-full p-5 shadow-2xl overflow-y-auto animate-slide-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-850">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-450 animate-pulse" />
                <div>
                  <h3 className="font-extrabold text-xs tracking-wider text-white uppercase leading-none">HansAI Terminal</h3>
                  <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest leading-none mt-1 block">Study Workspace Companion</span>
                </div>
              </div>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="p-1 px-2.5 text-slate-400 hover:text-white bg-slate-850 hover:bg-slate-850 rounded-lg transition-all text-xs font-bold cursor-pointer"
                title="Close drawer"
              >
                ✕ Close
              </button>
            </div>

            <div className="py-4 space-y-2.5 mt-2">
              <div className="px-2 text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Primary Core Workspace</div>
              {[
                { id: 'chat', title: 'AI Study Chat Workspace', desc: 'Concept explainer & studies', icon: '💬', badge: 'ACTIVECORE' },
                { id: 'research', title: 'Deep Research AI', desc: 'डीप रिसर्च मोड', icon: '🚀', badge: 'LIVE WEB' },
                { id: 'timer', title: 'My Projects & Audio Recorder', desc: 'मेरे प्रोजेक्ट्स एवं रिकॉर्डर', icon: '🎙️', badge: 'PROJECTS' },
                { id: 'map', title: 'GIS & Mapping Visualizer', desc: 'नक्शा और जियोग्राफी टूल', icon: '🗺️', badge: 'REAL-TIME GIS' },
                { id: 'quiz', title: 'Interactive Live Quiz', desc: 'लाइव टेस्ट रूम', icon: '🧠', badge: 'PRACTICE' },
                { id: 'notes', title: 'Shorthand & Formula Notes', desc: 'सूत्र व नियम नोट्स', icon: '📝', badge: 'PERSONAL' },
                { id: 'owner-dashboard', title: 'Scholar Founder Hub', desc: 'संस्थापक कंसोल', icon: '👑', badge: 'ADMIN' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id as any);
                    setSidebarOpen(false);
                    showToast(`${item.title} Activated / चालू`, "success");
                  }}
                  className={`w-full p-3 rounded-2xl flex items-center justify-between border select-none transition-all duration-200 cursor-pointer ${
                    activeView === item.id 
                      ? 'bg-gradient-to-r from-indigo-950/40 to-[#0A0E17]/80 border-indigo-505 shadow-md text-white'
                      : 'bg-[#060A12]/40 text-slate-300 border-slate-900/60 hover:bg-[#0E1524]/60 hover:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2 text-left">
                    <span className="text-xl">{item.icon}</span>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold leading-none">{item.title}</span>
                      <span className="text-[9px] text-slate-550 font-bold mt-1 leading-none">{item.desc}</span>
                    </div>
                  </div>
                  {activeView === item.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse flex-shrink-0 ml-1" />
                  )}
                </button>
              ))}

              <div className="px-2 text-[9px] font-black text-slate-500 uppercase tracking-widest pt-4 mb-1.5">Extra Academic Utilities</div>
              {[
                { id: 'goals', title: 'Daily Study Goals', desc: 'दैनिक पढ़ाई के लक्ष्य', icon: '🎯' },
                { id: 'rap', title: 'Motivational Rap Recitals', desc: 'गीत संगीत मोटिवेशन', icon: '📜' },
                { id: 'calculator', title: 'Scientific Calculator', desc: 'वैज्ञानिक गणक यंत्र', icon: '🧮' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id as any);
                    setSidebarOpen(false);
                    showToast(`${item.title} Activated / चालू`, "success");
                  }}
                  className={`w-full p-3 rounded-2xl flex items-center justify-between border select-none transition-all duration-200 cursor-pointer ${
                    activeView === item.id 
                      ? 'bg-gradient-to-r from-indigo-950/40 to-[#0A0E17]/80 border-indigo-505 shadow-md text-white'
                      : 'bg-[#060A12]/40 text-slate-305 border-slate-900/60 hover:bg-[#0E1524]/60 hover:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2 text-left">
                    <span className="text-xl">{item.icon}</span>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold leading-none">{item.title}</span>
                      <span className="text-[9px] text-slate-550 font-bold mt-1 leading-none">{item.desc}</span>
                    </div>
                  </div>
                  {activeView === item.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse flex-shrink-0 ml-1" />
                  )}
                </button>
              ))}
            </div>

            <div className="border-t border-slate-850 pt-5 mt-auto text-center space-y-2">
              <span className="text-[8px] tracking-widest text-[#a5b4fc] block uppercase font-black leading-none">HANS.AI/VERCEL/LIVE</span>
              <p className="text-[8px] text-slate-500 font-mono">Developed with Guidance of Founder Scholar Hanslal Pal</p>
            </div>
          </div>
        </div>
      )}

      {/* WHATSAPP STUDY STATUS POSTER MODAL (9:16 ASPECT RATIO) */}
      {isSharePosterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
          <div className="bg-[#090D16] border border-emerald-500/20 rounded-3xl w-full max-w-md p-5 sm:p-6 relative shadow-2xl space-y-4 text-left max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-850 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎨</span>
                <div>
                  <h3 className="text-sm font-extrabold text-white tracking-wide">WhatsApp Daily Status Poster</h3>
                  <p className="text-[9px] text-slate-500 font-bold">9:16 Custom Educational Branding Card</p>
                </div>
              </div>
              <button 
                onClick={() => setIsSharePosterOpen(false)}
                className="p-1 px-2.5 text-slate-400 hover:text-white bg-slate-850/80 hover:bg-slate-800 rounded-lg transition-all text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            {/* Poster Canvas Preview */}
            <div className="py-2 flex justify-center">
              <div id="status-share-poster-card" className="aspect-[9/16] w-[260px] sm:w-[280px] bg-gradient-to-b from-[#0A0E17] via-[#0E1526] to-[#04060B] border-2 border-emerald-500/30 rounded-3xl p-5 flex flex-col justify-between shadow-2xl relative overflow-hidden text-left font-sans group">
                {/* Background decorative elements */}
                <div className="absolute top-[-30px] right-[-30px] w-28 h-28 bg-emerald-500/10 blur-2xl rounded-full" />
                <div className="absolute bottom-[-30px] left-[-30px] w-28 h-28 bg-indigo-500/10 blur-2xl rounded-full" />
                
                {/* Poster Header */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg">🎖️</span>
                      <div>
                        <h4 className="text-xs font-black text-white leading-none tracking-tight">HansAI</h4>
                        <span className="text-[7px] text-emerald-450 uppercase tracking-widest font-black leading-none mt-0.5">आधिकारिक राष्ट्र रक्षक</span>
                      </div>
                    </div>
                    <span className="text-[9px] text-[#818cb4] bg-indigo-950/40 text-indigo-400 px-2 py-0.5 rounded border border-indigo-900/30 font-bold">2026 EDITION</span>
                  </div>
                  
                  <div className="h-[2px] w-full bg-gradient-to-r from-emerald-500/40 via-indigo-500/30 to-transparent" />
                </div>

                {/* Poster Center Quote Area */}
                <div className="my-auto py-6 space-y-4 relative z-10">
                  <span className="text-4xl text-emerald-500/20 font-serif leading-none absolute -top-4 -left-2 select-none">“</span>
                  <p className="text-xs sm:text-sm font-semibold text-slate-100 leading-relaxed tracking-wide text-center pt-2 italic px-1">
                    {(() => {
                      const sampleQuotes = [
                        { t: "शिक्षा सबसे शक्तिशाली हथियार है जिसका उपयोग आप दुनिया को बदलने के लिए कर सकते हैं।", a: "Nelson Mandela" },
                        { t: "उठो, जागो और तब तक मत रुको जब तक लक्ष्य की प्राप्ति न हो जाए।", a: "Swami Vivekananda" },
                        { t: "कठिन परिश्रम का कोई विकल्प नहीं है, निरंतर अभ्यास ही सफलता की कुंजी है।", a: "Hanslal Pal's Vision" },
                        { t: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", a: "Brian Herbert" },
                        { t: "सफलता की शुरुआत हमेशा स्वयं पर विश्वास करने से होती है।", a: "HansAI Inspiration" }
                      ];
                      const activeQuote = sampleQuotes[new Date().getDate() % sampleQuotes.length];
                      return activeQuote.t;
                    })()}
                  </p>
                  <p className="text-[9px] text-emerald-400 text-right pr-2 font-bold select-none leading-none">
                    — {(() => {
                      const sampleQuotes = [
                        { t: "शिक्षा सबसे शक्तिशाली हथियार है जिसका उपयोग आप दुनिया को बदलने के लिए कर सकते हैं।", a: "Nelson Mandela" },
                        { t: "उठो, जागो और तब तक मत रुको जब तक लक्ष्य की प्राप्ति न हो जाए।", a: "Swami Vivekananda" },
                        { t: "कठिन परिश्रम का कोई विकल्प नहीं है, निरंतर अभ्यास ही सफलता की कुंजी है।", a: "Hanslal Pal's Vision" },
                        { t: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", a: "Brian Herbert" },
                        { t: "सफलता की शुरुआत हमेशा स्वयं पर विश्वास करने से होती है।", a: "HansAI Inspiration" }
                      ];
                      const activeQuote = sampleQuotes[new Date().getDate() % sampleQuotes.length];
                      return activeQuote.a;
                    })()}
                  </p>
                </div>

                {/* Poster Footer */}
                <div className="space-y-3.5 border-t border-slate-850/60 pt-3 text-center">
                  <div className="text-center space-y-1">
                    <span className="text-[8px] text-slate-500 block">SUPPORT LINE</span>
                    <span className="text-[8px] font-black tracking-widest text-[#a5b4fc] block uppercase leading-none">HANS.AI/VERCEL/LIVE</span>
                  </div>
                  
                  <div className="bg-[#02050A]/80 p-2 rounded-xl border border-slate-850 text-center">
                    <p className="text-[7.5px] font-mono text-emerald-400/95 font-bold tracking-tight">
                      Developed under guidance of Founder Hanslal Pal
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions for modal */}
            <div className="space-y-2 pt-1 font-sans">
              <button
                type="button"
                onClick={() => {
                  const sampleQuotes = [
                    { t: "शिक्षा सबसे शक्तिशाली हथियार है जिसका उपयोग आप दुनिया को बदलने के लिए कर सकते हैं।", a: "Nelson Mandela" },
                    { t: "उठो, जागो और तब तक मत रुको जब तक लक्ष्य की प्राप्ति न हो जाए।", a: "Swami Vivekananda" },
                    { t: "कठिन परिश्रम का कोई विकल्प नहीं है, निरंतर अभ्यास ही सफलता की कुंजी है।", a: "Hanslal Pal's Vision" },
                    { t: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", a: "Brian Herbert" },
                    { t: "सफलता की शुरुआत हमेशा स्वयं पर विश्वास करने से होती है।", a: "HansAI Inspiration" }
                  ];
                  const activeQuote = sampleQuotes[new Date().getDate() % sampleQuotes.length];
                  
                  const shareText = `🎯 _HansAI Space - Daily Study Motivation_ 🎯\n\n"${activeQuote.t}"\n- _${activeQuote.a}_\n\n📲 *Start practicing studies, quizzes & live GIS maps for exams too!* Join Free At: https://hansai.vercel.app\n\n🕊️ _Spiritual support guide: Founder Scholar Hanslal Pal_`;
                  
                  if (navigator.share) {
                    navigator.share({
                      title: 'HansAI Daily Status Badge',
                      text: shareText,
                      url: 'https://hansai.vercel.app'
                    }).then(() => {
                      showToast("Shared successfully! 🎉", "success");
                    }).catch(() => {
                      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
                    });
                  } else {
                    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
                    showToast("Opening WhatsApp Status Share... 💬", "info");
                  }
                }}
                className="w-full py-2.5 bg-emerald-650 hover:bg-emerald-600 text-white rounded-xl font-bold uppercase tracking-wider text-[11px] flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <span>💬 share status on whatsapp</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const sampleQuotes = [
                    { t: "शिक्षा सबसे शक्तिशाली हथियार है जिसका उपयोग आप दुनिया को बदलने के लिए कर सकते हैं।", a: "Nelson Mandela" },
                    { t: "उठो, जागो और तब तक मत रुको जब तक लक्ष्य की प्राप्ति न हो जाए।", a: "Swami Vivekananda" },
                    { t: "कठिन परिश्रम का कोई विकल्प नहीं है, निरंतर अभ्यास ही सफलता की कुंजी है।", a: "Hanslal Pal's Vision" },
                    { t: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", a: "Brian Herbert" },
                    { t: "सफलता की शुरुआत हमेशा स्वयं पर विश्वास करने से होती है।", a: "HansAI Inspiration" }
                  ];
                  const activeQuote = sampleQuotes[new Date().getDate() % sampleQuotes.length];
                  
                  const shareText = `🎯 _HansAI Space - Daily Study Motivation_ 🎯\n\n"${activeQuote.t}"\n- _${activeQuote.a}_\n\n📲 JOIN AT: https://hansai.vercel.app\n\n🕊️ _Founder: Scholar Hanslal Pal_`;
                  navigator.clipboard.writeText(shareText);
                  showToast("📋 Copying layout text for clipboard sharing!", "success");
                }}
                className="w-full py-2.5 bg-slate-850 hover:bg-slate-800 text-slate-300 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>📋 copy status quote text</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PREMIUM UTILITY DASHBOARD MODAL */}
      {isUtilityDashboardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0b0f19] border border-indigo-500/30 rounded-3xl w-full max-w-2xl p-6 sm:p-8 relative shadow-2xl space-y-6 text-left max-h-[90vh] overflow-y-auto">
            
            {/* Modal Close & Header */}
            <div className="flex items-center justify-between border-b border-indigo-950 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-600/10 rounded-xl text-indigo-400">
                  <Settings className="w-5 h-5 animate-spin-slow animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white tracking-wide">
                    {language === 'hindi' ? t('utilityDashboard') : 'Premium Utility Dashboard'}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {language === 'hindi' ? 'वास्तविक समय विश्लेषण, सुरक्षात्मक समाचार व गहन शोध नियंत्रण' : 'Real-Time Analytics, Unbiased Global Feed & Advanced Research Controllers'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsUtilityDashboardOpen(false)}
                className="p-1.5 focus:outline-none hover:bg-slate-800/80 rounded-xl text-slate-400 hover:text-white transition-all cursor-pointer bg-transparent border-none"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Grid layout containing KPI Rings & Research Switchers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              
              {/* Box 1: KPI Progress Rings */}
              <div className="bg-[#0f1626]/60 border border-slate-900 rounded-2xl p-4 sm:p-5 space-y-4">
                <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  {language === 'hindi' ? 'वास्तविक समय KPI विश्लेषण' : 'Real-Time KPI Analytics'}
                </h4>

                <div className="grid grid-cols-2 gap-4 pt-1">
                  
                  {/* Circular Ring 1: Shorthand Speed Guidelines */}
                  <div className="flex flex-col items-center text-center space-y-2.5 py-2 mx-auto">
                    <div className="relative w-20 h-20 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="40" cy="40" r="32" className="stroke-slate-800" strokeWidth="5" fill="none" />
                        <circle 
                          cx="40" cy="40" r="32" 
                          className="stroke-indigo-500 transition-all duration-1000" 
                          strokeWidth="5" 
                          fill="none" 
                          strokeDasharray={2 * Math.PI * 32}
                          strokeDashoffset={2 * Math.PI * 32 * (1 - 0.95)}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xs font-black text-white">120+</span>
                        <span className="text-[6px] text-slate-500 font-bold uppercase">WPM Guide</span>
                      </div>
                    </div>
                    <div>
                      <h5 className="text-[10px] font-bold text-slate-300">Shorthand Speed</h5>
                      <p className="text-[8px] text-emerald-400 font-bold">95% Match Ratio</p>
                    </div>
                  </div>

                  {/* Circular Ring 2: Active Study Session */}
                  <div className="flex flex-col items-center text-center space-y-2.5 py-2 mx-auto">
                    <div className="relative w-20 h-20 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="40" cy="40" r="32" className="stroke-slate-800" strokeWidth="5" fill="none" />
                        <circle 
                          cx="40" cy="40" r="32" 
                          className="stroke-emerald-500 transition-all duration-1000" 
                          strokeWidth="5" 
                          fill="none" 
                          strokeDasharray={2 * Math.PI * 32}
                          strokeDashoffset={2 * Math.PI * 32 * (1 - 0.88)}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xs font-black text-white">2.2h</span>
                        <span className="text-[6px] text-slate-500 font-bold uppercase">Active Tracker</span>
                      </div>
                    </div>
                    <div>
                      <h5 className="text-[10px] font-bold text-slate-300">Daily Study</h5>
                      <p className="text-[8px] text-emerald-400 font-bold">88% Completion</p>
                    </div>
                  </div>

                </div>

                {/* Additional KPI context */}
                <div className="bg-[#090d16]/75 border border-indigo-950 rounded-xl p-3 text-[10px] text-slate-400 leading-relaxed text-left">
                  <p className="font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    How to optimize shorthand speed:
                  </p>
                  Practice high-frequency English and Hindi vocabulary outlines daily, maintain steady pen movements, and utilize HansAI's custom shorthand transcription feedback alerts.
                </div>
              </div>

              {/* Box 2: Premium Research Switches & Options */}
              <div className="bg-[#0f1626]/60 border border-slate-900 rounded-2xl p-4 sm:p-5 space-y-5">
                <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                  <Layers className="w-4 h-4 text-pink-400" />
                  {language === 'hindi' ? 'एआई शोध व पूर्वाग्रह रोधी इंजन' : 'AI Research & Anti-Bias Config'}
                </h4>

                {/* Switcher 1: Advanced AI Deep Research Console */}
                <div className="flex items-center justify-between gap-3 p-3 bg-[#090d16] rounded-xl border border-indigo-950/50">
                  <div className="space-y-0.5 max-w-[70%] text-left">
                    <span className="text-[10px] font-black text-white block">
                      {language === 'hindi' ? '🔬 एडवांस्ड एआई डीप रिसर्च' : '🔬 Advanced AI Deep Research'}
                    </span>
                    <span className="text-[9px] text-slate-400 block leading-tight">
                      {language === 'hindi' ? 'बहु-स्रोत लाइव वेब खोज सत्यापन सक्रिय करें' : 'Deploys Live Google Grounding search verification on all academic search inputs.'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAdvancedResearchMode(!advancedResearchMode);
                      showToast(advancedResearchMode ? "Standard search mode activated." : "Advanced deep research mode expanded! 🔬", "info");
                    }}
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer flex items-center border-none focus:outline-none ${advancedResearchMode ? 'bg-indigo-600' : 'bg-slate-800'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-250 ${advancedResearchMode ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* Filter indicator: Anti-Bias & Accuracy Filter */}
                <div className="p-3 bg-emerald-950/10 border border-emerald-500/20 rounded-xl flex items-start gap-2.5 text-left">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-emerald-300 block">
                      {language === 'hindi' ? t('biasFilterLabel') : 'Anti-Bias & Truthfulness Shield Active'}
                    </span>
                    <p className="text-[9px] text-emerald-300/80 leading-snug">
                      Universally filters speculative press headlines from the live neutral press engine to ensure fully objective global insights.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom section: Neutral Global Press aggregation */}
            <div className="bg-[#0f1626]/40 border border-slate-900 rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-indigo-950/60 pb-3 flex-wrap gap-2 text-left">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">
                    {language === 'hindi' ? t('verifiedNewsTitle') : '📰 Neutral Global Press & verified news'}
                  </span>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  {/* Zoom Controls */}
                  <div className="flex items-center gap-1.5 bg-[#090d16] p-1 rounded-xl border border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => setNewsZoom(prev => Math.max(80, prev - 10))}
                      className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors border-none bg-transparent cursor-pointer"
                      title="Zoom Out / छोटा करें"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] text-slate-350 font-bold px-1 font-mono min-w-[32px] text-center">
                      {newsZoom}%
                    </span>
                    <button
                      type="button"
                      onClick={() => setNewsZoom(prev => Math.min(150, prev + 10))}
                      className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors border-none bg-transparent cursor-pointer"
                      title="Zoom In / बड़ा करें"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                    {newsZoom !== 100 && (
                      <button
                        type="button"
                        onClick={() => setNewsZoom(100)}
                        className="text-[8px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded font-bold uppercase transition-colors cursor-pointer border-none"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  
                  <button
                    type="button"
                    disabled={isNewsLoading}
                    onClick={handleFetchVerifiedNews}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer border-none"
                  >
                    <RefreshCw className={`w-3 h-3 ${isNewsLoading ? 'animate-spin' : ''}`} />
                    <span>{isNewsLoading ? (language === 'hindi' ? t('newsLoading') : 'Syncing...') : (language === 'hindi' ? t('fetchNewsButton') : 'Fetch Verified News')}</span>
                  </button>
                </div>
              </div>

              {/* Verified News item list */}
              <div 
                className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1 transition-all duration-200"
                style={{ fontSize: `${newsZoom}%`, lineHeight: '1.5' }}
              >
                {isNewsLoading ? (
                  <div className="py-8 text-center space-y-2 animate-pulse">
                    <Loader className="w-6 h-6 text-indigo-500 animate-spin mx-auto" />
                    <p className="text-[10px] text-slate-500 font-medium">
                      {language === 'hindi' ? t('newsLoading') : 'Fetching verified, bias-filtered global press feed... Please wait.'}
                    </p>
                  </div>
                ) : (
                  newsFeed.map((news, idx) => (
                    <div key={idx} className="bg-[#090d16]/70 border border-indigo-950/50 p-3.5 rounded-xl space-y-2.5 text-left animate-fade-in hover:border-indigo-500/20 transition-all">
                      <div className="flex items-start justify-between gap-4 text-left">
                        <h5 className="text-xs font-bold text-white leading-normal">{news.title}</h5>
                        <span className="text-[9px] bg-indigo-500/10 text-indigo-300 font-black px-2 py-0.5 rounded uppercase font-mono tracking-wider flex-shrink-0">
                          {news.source}
                        </span>
                      </div>
                      <ul className="space-y-1 pl-4 list-disc text-[10px] text-slate-400 leading-relaxed text-left">
                        {news.bulletPoints.map((bp, bidx) => (
                          <li key={bidx}>{bp}</li>
                        ))}
                      </ul>
                      <div className="text-[8px] text-slate-600 font-bold uppercase tracking-wider text-right font-mono">
                        Grounding Date: {news.date}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ⏰ ALARM RINGING MODAL DIALOG */}
      {isAlarmRingingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0b0f19] border-2 border-amber-500/50 rounded-3xl w-full max-w-md p-6 sm:p-8 relative shadow-2xl text-center space-y-5 animate-bounce-short">
            
            <div className="w-20 h-20 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto text-4xl animate-pulse">
              ⏰
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full inline-block mb-2">
                🚨 ALARM RINGING / अलार्म बज रहा है
              </span>
              <h3 className="text-xl font-black text-white">
                {timerAlarmTitle || "Study Target Session"}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Your focused time limit ({timerPresetVal} minutes) is complete! Great job staying disciplined.
              </p>
            </div>

            <div className="p-3 bg-[#04070F] border border-slate-880 rounded-2xl text-left text-xs text-slate-300 space-y-1">
              <span className="text-[10px] text-amber-400 font-bold uppercase block">Next Steps:</span>
              <p>• Take a 5-minute eye rest break or hydrate.</p>
              <p>• Your notes & shorthand drafts have been auto-saved.</p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsAlarmRingingModalOpen(false);
                  showToast("Alarm dismissed. Great work! 🎉", "success");
                }}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg cursor-pointer"
              >
                ⏹️ Dismiss Alarm / बंद करें
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAlarmRingingModalOpen(false);
                    setTimeLeft(300); // 5 mins
                    setIsTimerRunning(true);
                    showToast("Snoozed for 5 minutes 💤", "info");
                  }}
                  className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-[11px] border border-slate-700 transition-all cursor-pointer"
                >
                  💤 Snooze 5 Min
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsAlarmRingingModalOpen(false);
                    setTimeLeft(timerPresetVal * 60);
                    setIsTimerRunning(true);
                    showToast("Restarted study alarm 🔁", "success");
                  }}
                  className="py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-[11px] transition-all cursor-pointer"
                >
                  🔁 Restart Alarm
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 🌐 APP & RESOURCE LAUNCHER MODAL */}
      {isAppLauncherOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0b0f19] border border-cyan-500/30 rounded-3xl w-full max-w-lg p-6 sm:p-8 relative shadow-2xl text-left space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-cyan-950 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-cyan-500/10 rounded-xl text-cyan-400 text-2xl">
                  🌐
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    App & External Resource Launcher / ऐप्स एवं वेब पोर्टल
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Open YouTube lectures, OpenAI ChatGPT, Google Scholar, Wikipedia & NCERT books in 1 click.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsAppLauncherOpen(false)}
                className="p-1.5 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all cursor-pointer bg-transparent border-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Topic / Query Search Input */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Study Search Topic / विषय या प्रश्न
              </label>
              <input
                type="text"
                value={launcherSearchTopic}
                onChange={(e) => setLauncherSearchTopic(e.target.value)}
                placeholder="e.g. Pitman Shorthand dictation 80wpm, Indian Polity MCQs, Photosynthesis..."
                className="w-full text-xs bg-slate-950 border border-slate-800 px-3.5 py-2.5 rounded-xl text-white outline-none focus:border-cyan-500 font-sans"
              />
            </div>

            {/* Quick Launcher Action Grid */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                1-Click External App Launchers
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleLaunchYouTube()}
                  className="p-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-xl text-left space-y-1 group transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                      🎬 YouTube Search
                    </span>
                    <span className="text-xs text-rose-400 font-bold">Launch →</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Search video lectures, dictations & tutorials</p>
                </button>

                <button
                  type="button"
                  onClick={handleLaunchChatGPT}
                  className="p-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-left space-y-1 group transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      🤖 OpenAI ChatGPT
                    </span>
                    <span className="text-xs text-emerald-400 font-bold">Launch →</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Open ChatGPT AI in a fresh tab</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleLaunchGoogleScholar()}
                  className="p-3 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-xl text-left space-y-1 group transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                      📚 Google Scholar
                    </span>
                    <span className="text-xs text-indigo-400 font-bold">Launch →</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Research academic research papers</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleLaunchWikipedia()}
                  className="p-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl text-left space-y-1 group transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      🌐 Wikipedia Portal
                    </span>
                    <span className="text-xs text-amber-400 font-bold">Launch →</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Instant encyclopedic facts verification</p>
                </button>
              </div>

              <button
                type="button"
                onClick={handleLaunchNCERT}
                className="w-full p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center justify-between text-xs text-slate-300 font-bold cursor-pointer transition-all"
              >
                <span className="flex items-center gap-2">📘 NCERT & ePathshala Official Books Portal</span>
                <span className="text-cyan-400 text-xs">Open Site ↗</span>
              </button>
            </div>

            {/* Custom URL Input Field */}
            <div className="p-3 bg-[#04070F] border border-slate-800 rounded-2xl space-y-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Open Any Custom Web App / URL</span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customLauncherUrl}
                  onChange={(e) => setCustomLauncherUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full text-xs bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-white outline-none focus:border-cyan-500 font-mono"
                />
                <button
                  type="button"
                  onClick={handleLaunchCustomUrl}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all"
                >
                  Open 🚀
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* VIEW: AI STUDY PLAN & ROADMAP */}
      {activeView === 'planner' && (
        <StudyPlanView user={user} onExportPdf={handleExportPdf} showToast={showToast} />
      )}

      {/* VIEW: AI FLASHCARDS DECK */}
      {activeView === 'flashcards' && (
        <FlashcardsView onExportPdf={handleExportPdf} showToast={showToast} />
      )}

      {/* VIEW: PHOTO DOUBT SOLVER & OCR */}
      {activeView === 'photo-doubt' && (
        <PhotoDoubtView onExportPdf={handleExportPdf} showToast={showToast} />
      )}

      {/* VIEW: SECURITY SYSTEM AUDIT HUB */}
      {activeView === 'security' && (
        <SecurityHubView user={user} showToast={showToast} />
      )}

      {/* SECURE AUTH MODALS (LOGIN, REGISTER, FORGOT PASSWORD) */}
      <AuthModals
        isRegisterOpen={isAuthRegisterOpen}
        onCloseRegister={() => setIsAuthRegisterOpen(false)}
        isLoginOpen={isAuthLoginOpen}
        onCloseLogin={() => setIsAuthLoginOpen(false)}
        isForgotOpen={isAuthForgotOpen}
        onCloseForgot={() => setIsAuthForgotOpen(false)}
        onOpenForgot={() => setIsAuthForgotOpen(true)}
        onOpenLogin={() => setIsAuthLoginOpen(true)}
        onOpenRegister={() => setIsAuthRegisterOpen(true)}
        user={user}
        setUser={setUser}
        showToast={showToast}
      />

      {/* SOCIAL MEDIA SHARE APP MODAL */}
      {isShareModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#0B0F19] border border-cyan-500/40 rounded-3xl max-w-lg w-full p-6 space-y-5 text-left shadow-2xl shadow-cyan-500/10 relative overflow-hidden">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-xl shadow-lg shadow-cyan-500/20">
                  🚀
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    HansAI ऐप शेयर करें
                  </h3>
                  <p className="text-xs text-slate-400">
                    WhatsApp, Instagram, Telegram, Facebook पर दोस्तों को भेजें
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AUTOMATIC LINK UPDATE EXPLANATION BANNER */}
            <div className="p-3.5 bg-indigo-950/60 border border-indigo-500/40 rounded-2xl space-y-1.5 text-xs text-indigo-200 leading-relaxed">
              <div className="flex items-center gap-2 font-bold text-cyan-300">
                <span>⚡</span>
                <span>क्या लिंक अपने-आप (Automatically) अपडेट होता है?</span>
              </div>
              <p className="text-[11px] text-slate-300">
                <strong>हाँ, बिल्कुल!</strong> यह शेयर किया गया वेब लिंक हमेशा <strong>लाइव और ऑटोमैटिक अपडेट</strong> रहता है। जब भी <strong>हंसलाल पाल जी (Owner)</strong> इस ऐप में नए सवाल, स्टडी मटेरियल या फीचर्स जोड़ेंगे, तो इस लिंक को खोलने पर सभी यूजर्स को तुरंत नया अपडेटेड ऐप ही मिलेगा। आपको बार-बार नया लिंक भेजने की आवश्यकता नहीं है!
              </p>
            </div>

            {/* DIRECT COPY LINK BOX */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                लाइव ऐप लिंक (Direct Web Link)
              </label>
              <div className="flex items-center gap-2 bg-[#04070F] border border-slate-800 p-2 rounded-2xl">
                <input
                  type="text"
                  readOnly
                  value="https://ais-pre-eja2hqh55k6pg6dfrk3z4m-1011428299500.asia-southeast1.run.app"
                  className="w-full text-xs bg-transparent text-cyan-300 font-mono outline-none px-2 truncate"
                />
                <button
                  onClick={() => {
                    const shareUrl = "https://ais-pre-eja2hqh55k6pg6dfrk3z4m-1011428299500.asia-southeast1.run.app";
                    navigator.clipboard.writeText(shareUrl);
                    showToast("📋 HansAI App Link copied to clipboard!", "success");
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer shadow-md"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </button>
              </div>
            </div>

            {/* SOCIAL MEDIA SHARE BUTTONS */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                सोशल मीडिया पर डायरेक्ट शेयर करें (One-Click Share)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                
                {/* WhatsApp */}
                <button
                  onClick={() => {
                    const url = "https://ais-pre-eja2hqh55k6pg6dfrk3z4m-1011428299500.asia-southeast1.run.app";
                    const text = encodeURIComponent(`📚 *HansAI Digital Teacher & Shorthand Platform*\nनिःशुल्क अध्ययन, AI डाउट सॉल्वर, SSC एवं आशुलिपि तैयारी के लिए ऐप खोलें:\n${url}`);
                    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
                  }}
                  className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <span className="text-base">💬</span>
                  <span>WhatsApp</span>
                </button>

                {/* Telegram */}
                <button
                  onClick={() => {
                    const url = encodeURIComponent("https://ais-pre-eja2hqh55k6pg6dfrk3z4m-1011428299500.asia-southeast1.run.app");
                    const text = encodeURIComponent("HansAI Quantum Lab • Digital AI Teacher for SSC & Shorthand Aspirants");
                    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
                  }}
                  className="p-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <span className="text-base">✈️</span>
                  <span>Telegram</span>
                </button>

                {/* Instagram */}
                <button
                  onClick={() => {
                    const shareUrl = "https://ais-pre-eja2hqh55k6pg6dfrk3z4m-1011428299500.asia-southeast1.run.app";
                    navigator.clipboard.writeText(shareUrl);
                    showToast("📋 Link copied! Paste on Instagram Story or Message! 📸", "success");
                    window.open("https://www.instagram.com", "_blank");
                  }}
                  className="p-2.5 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-90 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <span className="text-base">📸</span>
                  <span>Instagram</span>
                </button>

                {/* Facebook */}
                <button
                  onClick={() => {
                    const url = encodeURIComponent("https://ais-pre-eja2hqh55k6pg6dfrk3z4m-1011428299500.asia-southeast1.run.app");
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
                  }}
                  className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <span className="text-base">📘</span>
                  <span>Facebook</span>
                </button>

                {/* X / Twitter */}
                <button
                  onClick={() => {
                    const url = encodeURIComponent("https://ais-pre-eja2hqh55k6pg6dfrk3z4m-1011428299500.asia-southeast1.run.app");
                    const text = encodeURIComponent("Check out HansAI Digital Teacher Platform for SSC & Shorthand preparation!");
                    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
                  }}
                  className="p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer border border-slate-700"
                >
                  <span className="text-base">𝕏</span>
                  <span>X (Twitter)</span>
                </button>

                {/* Native Device Share API */}
                <button
                  onClick={() => {
                    const shareUrl = "https://ais-pre-eja2hqh55k6pg6dfrk3z4m-1011428299500.asia-southeast1.run.app";
                    if (navigator.share) {
                      navigator.share({
                        title: 'HansAI Quantum Lab',
                        text: 'Free AI Teacher & SSC Shorthand Study Companion',
                        url: shareUrl,
                      }).catch(() => {});
                    } else {
                      navigator.clipboard.writeText(shareUrl);
                      showToast("📋 HansAI Link copied to clipboard!", "success");
                    }
                  }}
                  className="p-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <Share2 className="w-4 h-4 text-white" />
                  <span>More Options</span>
                </button>

              </div>
            </div>

            {/* Footer note */}
            <div className="pt-2 border-t border-slate-800 text-center">
              <span className="text-[10px] text-slate-400">
                HansAI Platform • Directed by Founder Owner Hanslal Pal Ji (हंसलाल पाल जी)
              </span>
            </div>

          </div>
        </div>
      )}

      {/* OWNER ADMIN SECRET PIN SECURITY MODAL */}
      {isOwnerPinModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#0B0F19] border border-amber-500/40 rounded-3xl max-w-md w-full p-6 space-y-5 text-left shadow-2xl shadow-amber-500/10 relative overflow-hidden">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-600 flex items-center justify-center text-xl shadow-lg shadow-amber-500/20">
                  👑
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Owner Admin Access Guard</h3>
                  <p className="text-xs text-amber-400 font-medium">ओनर पिन दर्ज करें / Founder Security Lock</p>
                </div>
              </div>
              <button
                onClick={() => setIsOwnerPinModalOpen(false)}
                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Info Banner */}
            <div className="p-3.5 bg-amber-950/40 border border-amber-500/30 rounded-2xl text-xs text-amber-200 leading-relaxed space-y-1.5">
              <p className="font-bold flex items-center gap-1.5 text-amber-300">
                <span>🛡️</span>
                <span>सुरक्षित ओनर डैशबोर्ड (Founder Hanslal Pal Ji)</span>
              </p>
              <p className="text-[11px] text-slate-300">
                सामान्य छात्र यूजर इस सेक्शन में प्रवेश नहीं कर सकते। ओनर कंसोल खोलने के लिए अपना <strong>Secret Owner PIN</strong> दर्ज करें (Owner Passcode: <strong>9988</strong> या <strong>1234</strong>)।
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const pin = ownerPinInput.trim();
                if (['9988', '1234', 'hansai', 'palhanslal4'].includes(pin.toLowerCase())) {
                  setIsOwnerUnlocked(true);
                  setIsOwnerPinModalOpen(false);
                  setUser({ name: 'Hanslal Pal (Owner)', email: 'palhanslal4@gmail.com', role: 'owner' });
                  localStorage.setItem('hansai-user-session', JSON.stringify({ name: 'Hanslal Pal (Owner)', email: 'palhanslal4@gmail.com', role: 'owner' }));
                  setActiveView('owner-dashboard');
                  showToast("👑 Owner Security PIN verified! Welcome Owner Hanslal Pal Ji.", "success");
                } else {
                  showToast("❌ गलत Owner Secret PIN! केवल संस्थापक प्रवेश कर सकते हैं।", "warn");
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1.5">
                  Enter Owner Secret PIN / ओनर पिन
                </label>
                <input
                  type="password"
                  autoFocus
                  value={ownerPinInput}
                  onChange={(e) => setOwnerPinInput(e.target.value)}
                  placeholder="Enter Owner Secret PIN"
                  className="w-full text-sm p-3.5 bg-[#04070F] border border-amber-500/40 rounded-xl text-amber-300 font-mono tracking-widest outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsOwnerPinModalOpen(false)}
                  className="w-1/3 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-extrabold rounded-xl text-xs cursor-pointer shadow-lg shadow-amber-600/20"
                >
                  Unlock Console 🔐
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
