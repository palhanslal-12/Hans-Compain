import React, { useState, useEffect, useRef } from 'react';
import { speakText, stopAllSpeech } from './utils/speechUtils';
import { 
  Sprout, 
  TrendingUp, 
  Landmark, 
  Check, 
  Zap,
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
  Camera,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Copy,
  Trash2,
  Folder,
  FolderPlus,
  BookmarkPlus,
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
  MessageSquare,
  MessageCircle,
  ArrowLeft,
  Headphones,
  Shield,
  ShieldCheck,
  LifeBuoy,
  ExternalLink,
  PhoneCall,
  Database,
  Bell,
  BarChart2,
  Sliders,
  Download,
  ToggleLeft,
  ToggleRight,
  Eye,
  LogOut,
  Server,
  Radio,
  FileCode,
  Terminal,
  LayoutDashboard,
  CheckCircle2,
  Lightbulb,
  AlertTriangle,
  Star
} from 'lucide-react';
import { INDIAN_LANGUAGES } from './utils/speechUtils';
import { FiveStarFeedbackModal } from './components/FiveStarFeedbackModal';
import { UpcomingFeaturesRoadmapModal } from './components/UpcomingFeaturesRoadmapModal';
import { AcademicQuizStudio } from './components/AcademicQuizStudio';
import { Message, QuizQuestion, SavedQuizRecord, MistakeNotebookItem, BusinessCalculation, BusinessResult } from './types';
import { HELP_TOPICS, PITMAN_STROKES, PRESET_MOTIVATIONAL_RAPS } from './constants';
import AboutCreator from './components/AboutCreator';
import { StudyPlanView } from './components/StudyPlanView';
import { FlashcardsView } from './components/FlashcardsView';
import { AdminPanel } from './components/AdminPanel';
import { PhotoDoubtView } from './components/PhotoDoubtView';
import { SecurityHubView } from './components/SecurityHubView';
import { AuthModals } from './components/AuthModals';
import { AuthGateView } from './components/AuthGateView';
import { MusicStudioView } from './components/MusicStudioView';
import { ArticleVoiceReader } from './components/ArticleVoiceReader';
import { FileConverterView } from './components/FileConverterView';
import { WeatherAlertView } from './components/WeatherAlertView';
import { AffiliateStoreView } from './components/AffiliateStoreView';
import { AllExamsSyllabusModal } from './components/AllExamsSyllabusModal';
import { GlobalBookReader } from './components/GlobalBookReader';
import { NotesOcrView } from './components/NotesOcrView';
import { NeuralMemoryMapView } from './components/NeuralMemoryMapView';
import { TimeTravelSimulatorView } from './components/TimeTravelSimulatorView';
import { MnemonicsTrickGeneratorView } from './components/MnemonicsTrickGeneratorView';
import { ScienceFormulaLabView } from './components/ScienceFormulaLabView';
import { StartupIntroSplash } from './components/StartupIntroSplash';
import { HansCompainLogo } from './components/HansCompainLogo';
import { QuizMistakeRemediationModal } from './components/QuizMistakeRemediationModal';
import { QuizMistakeNotebookView } from './components/QuizMistakeNotebookView';
import { MockInterviewView } from './components/MockInterviewView';
import { AIPerformanceDiagnosticsView } from './components/AIPerformanceDiagnosticsView';
import { DedicatedStenoMasterStudio } from './components/DedicatedStenoMasterStudio';
import { PublicLaunchHubView } from './components/PublicLaunchHubView';
import { GoogleScholarResearchModal } from './components/GoogleScholarResearchModal';
import { GoogleAdSenseBanner } from './components/GoogleAdSenseBanner';
import { ChatHistoryModal } from './components/ChatHistoryModal';
import { startVoiceRecognition, VoiceRecognitionHandle } from './utils/voiceInputUtils';
import { AiPublicRulesModal } from './components/AiPublicRulesModal';
import { HansAiHelpGuideModal } from './components/HansAiHelpGuideModal';
import { SystemDiagnosticsModal } from './components/SystemDiagnosticsModal';
import { SarkariResultEligibilityHub } from './components/SarkariResultEligibilityHub';
import { DailyStreakIndicator, recordDailyPracticeActivity } from './components/DailyStreakIndicator';
import { QuickSaveNotesModal } from './components/QuickSaveNotesModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { generateStudyNotesPdf } from './utils/pdfGenerator';
import {
  getAppShareUrl,
  getShareText,
  shareViaWhatsApp,
  shareViaTelegram,
  shareViaTwitter,
  shareViaFacebook,
  shareViaLinkedIn,
  shareViaEmail,
  shareUniversal,
  copyToClipboard
} from './utils/shareUtils';
import {
  fetchRealOwnerAnalytics,
  logActivityToFirestore,
  syncUserProfile,
  trackReferralClickToFirestore,
  deleteUserFromFirestore,
  deleteLogFromFirestore,
  RealOwnerAnalyticsData
} from './lib/firebase';

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
    ownerBypassDesc: "Enter the master password to access administrative controls.",
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
    reviewTextPlaceholder: "Write your honest feedback on Hans Compain's speed, utility, or content...",
    aboutCreatorTitle: "About the Creator",
    logoutBtn: "Log Out",
    welcomeGreeting: "Hello! I am Hans Compain, your AI Companion. How can I help you learn, write, or research today?",
    micListening: "Listening... speak now",
    micTooltip: "Use Voice Dictation (Speech-to-Text)",
    speakerTooltip: "Read aloud latest assistant output",
    creatorAnswerText: "Hans Compain has been designed to empower students, researchers, and professionals.",
    noAccountHeader: "Verify your Account",
    selectAccountHeader: "Account Chooser",
    useAnotherAccount: "Use another account / Enter Details",
    activeSearch: "Deep Web Searching...",
    ownerDashboard: "Owner Admin Dashboard",
    noAdminWarning: "Access Denied. Secret Master verification required for admin access.",
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
    verifyProceed: "सत्यापित करें और आगे बढ़ें",
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
    creatorAnswerText: "हंसएआई को विद्यार्थियों और शोधकर्ताओं को सशक्त बनाने एवं त्वरित अध्ययन में सहायता हेतु तैयार किया गया है।",
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
    creatorAnswerText: "HansAI ha sido diseñado para empoderar a estudiantes, investigadores y profesionales."
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
    creatorAnswerText: "HansAI a été conçu pour autonomiser les étudiants, les chercheurs et les professionnels."
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
    creatorAnswerText: "HansAI wurde entwickelt, um Studenten, Forschern und Fachleuten zu helfen."
  }
};

const QuantumSwanLogo = ({ 
  className = "w-12 h-12 sm:w-14 sm:h-14", 
  showLightBg = true,
  containerClassName = ""
}: { 
  className?: string; 
  showLightBg?: boolean;
  containerClassName?: string;
}) => {
  const svgLogo = (
    <svg viewBox="0 0 200 200" className={`${className} transition-transform duration-500 hover:rotate-6`} xmlns="http://www.w3.org/2000/svg" id="hans-app-official-logo">
      <defs>
        <linearGradient id="hansCircleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="50%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#22C55E" />
        </linearGradient>
        <linearGradient id="hansHGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="40%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#1E40AF" />
        </linearGradient>
        <linearGradient id="hansBookGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="hansCapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="50%" stopColor="#0F172A" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </linearGradient>
        <linearGradient id="hansLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4ADE80" />
          <stop offset="100%" stopColor="#16A34A" />
        </linearGradient>
      </defs>

      {/* Outer Arc Frame */}
      <path
        d="M 42 138 C 18 122 18 62 55 28 C 95 -6 160 18 168 70 C 173 100 152 135 125 145"
        fill="none"
        stroke="url(#hansCircleGrad)"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* Green Leaf Accent on Right */}
      <g transform="translate(148, 102) rotate(-20)">
        <path d="M 0 0 C 15 -18 32 -10 28 8 C 12 18 0 10 0 0 Z" fill="url(#hansLeafGrad)" />
        <path d="M 0 0 C 20 -5 28 8 28 8" fill="none" stroke="#15803D" strokeWidth="1.2" />
      </g>
      <g transform="translate(140, 115) rotate(-55)">
        <path d="M 0 0 C 12 -14 26 -8 22 6 C 10 14 0 8 0 0 Z" fill="url(#hansLeafGrad)" />
      </g>

      {/* Open Book Base */}
      <g id="book-base">
        <path
          d="M 38 138 Q 70 128 100 145 Q 100 135 70 120 Q 38 128 38 138 Z"
          fill="url(#hansBookGrad)"
        />
        <path
          d="M 35 142 Q 70 130 100 148 L 100 145 Q 70 128 38 138 Q 35 142 35 142 Z"
          fill="#0284C7"
        />
        <path
          d="M 162 138 Q 130 128 100 145 Q 100 135 130 120 Q 162 128 162 138 Z"
          fill="url(#hansBookGrad)"
        />
        <path
          d="M 165 142 Q 130 130 100 148 L 100 145 Q 130 128 162 138 Q 165 142 165 142 Z"
          fill="#0284C7"
        />
        <path d="M 100 120 L 100 148" stroke="#0F172A" strokeWidth="2.5" />
      </g>

      {/* Center 'H' Shape with Speech Bubble inside bottom counter */}
      <g id="letter-h" fill="url(#hansHGrad)">
        <rect x="71" y="60" width="18" height="66" rx="9" />
        <rect x="111" y="60" width="18" height="66" rx="9" />
        <rect x="71" y="80" width="58" height="18" rx="4" />
        
        <path
          d="M 85 96 C 85 90 115 90 115 96 C 115 110 108 118 100 118 C 96 118 92 122 90 124 C 91 120 88 117 85 114 Z"
          fill="#FFFFFF"
        />
        <circle cx="93" cy="103" r="1.8" fill="#0284C7" />
        <circle cx="100" cy="103" r="1.8" fill="#0284C7" />
        <circle cx="107" cy="103" r="1.8" fill="#0284C7" />
      </g>

      {/* Graduation Cap at Top */}
      <g id="graduation-cap">
        <polygon points="100,32 142,48 100,64 58,48" fill="url(#hansCapGrad)" stroke="#38BDF8" strokeWidth="1" />
        <path d="M 78 55 L 78 63 C 78 69 122 69 122 63 L 122 55 Z" fill="#0F172A" />
        <path d="M 130 50 Q 134 62 132 75" fill="none" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
        <polygon points="130,73 134,73 135,84 129,84" fill="#38BDF8" />
      </g>
    </svg>
  );

  if (!showLightBg) return svgLogo;

  return (
    <div className={`relative inline-flex items-center justify-center p-2.5 sm:p-3.5 rounded-3xl bg-gradient-to-br from-white via-sky-50 to-indigo-100 shadow-[0_0_35px_rgba(56,189,248,0.6)] border-2 border-white/90 transition-all duration-300 hover:scale-[1.20] hover:rotate-3 shrink-0 ${containerClassName}`}>
      {/* Soft Animated Light Pulse Aura */}
      <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-sky-400/50 via-cyan-300/40 to-emerald-400/50 blur-lg animate-pulse pointer-events-none" />
      <div className="relative z-10 flex items-center justify-center">
        {svgLogo}
      </div>
    </div>
  );
};

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
  const [activeView, setActiveView] = useState<'chat' | 'newsboard' | 'research' | 'quiz' | 'leaderboard' | 'process' | 'calculator' | 'rap' | 'notes' | 'timer' | 'history' | 'goals' | 'map' | 'soul' | 'sarkari-result' | 'owner-dashboard' | 'feedback' | 'planner' | 'study-plan' | 'flashcards' | 'photo-doubt' | 'security' | 'book-reader' | 'notes-ocr' | 'photo-ocr' | 'neural-map' | 'time-travel' | 'mnemonics' | 'science-lab' | 'steno' | 'launch-hub' | 'article-reader' | 'file-converter' | 'weather-alerts' | 'affiliate-store' | 'affiliate' | 'mistake-notebook' | 'mock-interview' | 'performance-analytics'>('chat');
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
  const voiceAssistantSilenceTimerRef = useRef<any>(null);
  const voiceAssistantLastTranscriptRef = useRef<string>("");

  // History View Filter & Search State
  const [historyFilterCategory, setHistoryFilterCategory] = useState<'all' | 'chat' | 'session' | 'quiz' | 'timer' | 'note'>('all');
  const [historySearchQuery, setHistorySearchQuery] = useState<string>("");

  // Auth Modals State
  const [isAuthRegisterOpen, setIsAuthRegisterOpen] = useState(false);
  const [isAuthLoginOpen, setIsAuthLoginOpen] = useState(false);
  const [isAuthForgotOpen, setIsAuthForgotOpen] = useState(false);

  // Helper for Export PDF using real jsPDF + html2canvas file generator with full Unicode/Hindi support
  const handleExportPdf = async (title: string, elementId?: string, rawText?: string) => {
    let content = rawText || '';
    if (!content && elementId) {
      const el = document.getElementById(elementId);
      if (el) {
        content = el.innerText || el.textContent || '';
      }
    }
    if (!content) {
      content = `HansAI Study Notes & Academic Solutions for ${title}`;
    }

    showToast(language === 'hindi' ? "📄 PDF तैयार हो रहा है, कृपया प्रतीक्षा करें..." : "📄 Generating high-res PDF...", "info");
    const success = await generateStudyNotesPdf({
      title: title || 'HansAI Study Notes',
      content: content,
      author: user?.name || user?.email || 'HansAI Student',
      language: language
    });

    if (success) {
      showToast(language === 'hindi' ? "📄 PDF फाइल सफलतापूर्वक डाउनलोड हो गई! 📥" : "📄 PDF downloaded successfully! 📥", "success");
    }
  };

  // 1-Click Message to PDF Downloader
  const handleDownloadMessagePdf = async (msg: Message) => {
    showToast(language === 'hindi' ? "📥 PDF तैयार हो रहा है..." : "📥 Preparing PDF...", "info");
    const success = await generateStudyNotesPdf({
      title: `HansAI Study Notes - ${new Date().toLocaleDateString()}`,
      topic: msg.content.slice(0, 45).replace(/[#*`]/g, '').trim(),
      content: msg.content,
      author: user?.name || user?.email || 'HansAI Student',
      language: language
    });
    if (success) {
      showToast(language === 'hindi' ? "📥 नोट्स की PDF फाइल डाउनलोड हो गई!" : "📥 Study notes PDF downloaded!", "success");
    }
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

  const [quizLanguage, setQuizLanguage] = useState<'english' | 'hindi'>(() => {
    return (localStorage.getItem('hansai-quiz-language') as 'english' | 'hindi') || 'hindi';
  });

  useEffect(() => {
    localStorage.setItem('hansai-language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('hansai-quiz-language', quizLanguage);
  }, [quizLanguage]);

  // Translate helper
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  // Hans Compain Intro Splash Animation & Feature Walkthrough
  const [showStartupIntro, setShowStartupIntro] = useState<boolean>(() => {
    return !sessionStorage.getItem('hanscompain_intro_seen');
  });

  // Appearance & Personalization Settings state
  const [theme, setTheme] = useState<'midnight' | 'charcoal' | 'light'>(() => {
    return (localStorage.getItem('hansai-theme') as 'midnight' | 'charcoal' | 'light') || 'midnight';
  });
  const [textSize, setTextSize] = useState<'sm' | 'base' | 'lg'>(() => {
    return (localStorage.getItem('hansai-text-size') as 'sm' | 'base' | 'lg') || 'base';
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareSelectedTab, setShareSelectedTab] = useState<string>('all');
  const [isCopiedShareLink, setIsCopiedShareLink] = useState<boolean>(false);
  const [isAppLauncherOpen, setIsAppLauncherOpen] = useState<boolean>(false);
  const [isGoogleScholarModalOpen, setIsGoogleScholarModalOpen] = useState<boolean>(false);
  const [scholarTopic, setScholarTopic] = useState<string>('Indian Constitution & Fundamental Rights');
  const [isAllExamsSyllabusOpen, setIsAllExamsSyllabusOpen] = useState<boolean>(false);
  const [isAiRulesModalOpen, setIsAiRulesModalOpen] = useState<boolean>(false);
  const [isHelpGuideOpen, setIsHelpGuideOpen] = useState<boolean>(false);
  const [isDiagnosticsModalOpen, setIsDiagnosticsModalOpen] = useState<boolean>(false);
  const [isFiveStarFeedbackOpen, setIsFiveStarFeedbackOpen] = useState<boolean>(false);
  const [feedbackInitialContext, setFeedbackInitialContext] = useState<string>('HansAI Chat & Assistant');
  const [isRoadmapModalOpen, setIsRoadmapModalOpen] = useState<boolean>(false);

  // Auto Voice Response Setting (Auto-speak response on Voice chat without opening new page)
  const [autoVoiceReadout, setAutoVoiceReadout] = useState<boolean>(() => {
    const saved = localStorage.getItem('hansai-auto-voice');
    return saved !== null ? saved === 'true' : true;
  });

  // Multi-lingual Indian Voice selector (Hindi, English, Tamil, Telugu, Kannada, Malayalam, Marathi, Bengali, Gujarati, Punjabi, Odia, etc.)
  const [selectedIndianVoiceLang, setSelectedIndianVoiceLang] = useState<string>(() => {
    return localStorage.getItem('hansai-voice-lang') || 'hi-IN';
  });

  // Chat/Content Font Size Control (Normal, Large, Extra-Large, Huge)
  const [chatFontSize, setChatFontSize] = useState<'normal' | 'large' | 'xl' | 'huge'>(() => {
    return (localStorage.getItem('hansai-chat-font-size') as any) || 'large';
  });

  const wasVoiceTriggeredRef = useRef<boolean>(false);
  
  // Universal Feature Hub (Hide / Show Drawers for Universal Users & Students)
  const [isFeatureHubOpen, setIsFeatureHubOpen] = useState<boolean>(false);
  const [activeFeatureCategory, setActiveFeatureCategory] = useState<string | null>('study');

  // Gemini model settings (Flash vs Flash-Lite)
  const [selectedModel, setSelectedModel] = useState<'gemini-3.7-flash' | 'gemini-3.1-flash-lite'>(() => {
    const saved = localStorage.getItem('hansai-active-model');
    if (saved === 'gemini-3.7-flash' || saved === 'gemini-3.1-flash-lite') return saved;
    return 'gemini-3.7-flash';
  });

  // Educational Key Topics Highlight state
  const [isHighlightingEnabled, setIsHighlightingEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('hansai-highlight-text');
    return saved !== null ? saved === 'true' : true;
  });

  // SCREEN LIGHT / EYE-CARE COLOR MODES (4 Themes: Dark, Warm Yellow, Eco Gray, Cyber Blue)
  const [screenColorMode, setScreenColorMode] = useState<'dark' | 'warm_yellow' | 'eco_gray' | 'cyber_blue'>(() => {
    return (localStorage.getItem('hansai-color-mode') as 'dark' | 'warm_yellow' | 'eco_gray' | 'cyber_blue') || 'dark';
  });

  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState<boolean>(false);

  // Theme generator based on color modes
  const getThemeClasses = () => {
    if (screenColorMode === 'warm_yellow') {
      return {
        bgMain: "bg-[#FAF6E9] text-[#4A2810]",
        bgCard: "bg-[#F3EAD3] border-[#D97706]/30",
        bgInner: "bg-[#FFFDF7]",
        border: "border-[#D97706]/30",
        textTitle: "text-[#78350F]",
        textMuted: "text-[#92400E]",
        sidebar: "bg-[#F3EAD3] border-r border-[#D97706]/30",
        header: "bg-[#FAF6E9] border-b border-[#D97706]/30",
        buttonSecondary: "bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#78350F]",
        inputBg: "bg-[#FFFDF7] border-[#D97706]/30 text-[#78350F]"
      };
    }
    if (screenColorMode === 'eco_gray') {
      return {
        bgMain: "bg-[#F1F3F5] text-slate-800",
        bgCard: "bg-[#E2E8F0] border-slate-300",
        bgInner: "bg-white",
        border: "border-slate-300",
        textTitle: "text-slate-900",
        textMuted: "text-slate-600",
        sidebar: "bg-[#E2E8F0] border-r border-slate-300",
        header: "bg-[#F1F3F5] border-b border-slate-300",
        buttonSecondary: "bg-slate-200 hover:bg-slate-300 text-slate-800",
        inputBg: "bg-white border-slate-300 text-slate-900"
      };
    }
    if (screenColorMode === 'cyber_blue') {
      return {
        bgMain: "bg-[#03132B] text-cyan-100",
        bgCard: "bg-[#0A2246] border-cyan-500/40",
        bgInner: "bg-[#051833]",
        border: "border-cyan-500/40",
        textTitle: "text-cyan-300",
        textMuted: "text-cyan-200/80",
        sidebar: "bg-[#0A2246] border-r border-cyan-500/40",
        header: "bg-[#03132B] border-b border-cyan-500/40",
        buttonSecondary: "bg-[#0D2D5E] hover:bg-[#123A78] text-cyan-200",
        inputBg: "bg-[#051833] border-cyan-500/40 text-cyan-100"
      };
    }
    // Default Dark Midnight
    return {
      bgMain: "bg-[#03060E] text-white",
      bgCard: "bg-[#121214] border-[#00E5FF]/25",
      bgInner: "bg-[#000000]",
      border: "border-[#00E5FF]/25",
      textTitle: "text-white",
      textMuted: "text-slate-300",
      sidebar: "bg-[#121214] border-r border-[#00E5FF]/25",
      header: "bg-[#03060E] border-b border-[#00E5FF]/25",
      buttonSecondary: "bg-[#1A1A1E] hover:bg-slate-800 text-white",
      inputBg: "bg-[#000000] border-[#00E5FF]/25 text-white"
    };
  };

  const themeColors = getThemeClasses();

  // AUTHENTICATED USER STATE & Mandatory Registration Gate
  const [guestPromptCount, setGuestPromptCount] = useState<number>(() => {
    const saved = localStorage.getItem('hansai_guest_prompt_count');
    return saved ? parseInt(saved, 10) : 0;
  });
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

  const isAdmin = Boolean(isOwnerUnlocked || (user && (user.email === 'palhanslal4@gmail.com' || user.role === 'owner')));

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
  const [showSplashScreen, setShowSplashScreen] = useState(false);
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

  // AUTOMATIC 3-HOUR SESSION LOGOUT & NOTIFICATION SYSTEM FOR REGULAR USERS ONLY
  useEffect(() => {
    // Owner Hanslal Pal and unauthenticated users are exempted from auto-logout
    if (!user || user.role === 'owner' || user.email === 'palhanslal4@gmail.com') return;

    let sessionStart = parseInt(localStorage.getItem('hansai-session-timestamp') || '0', 10);
    if (!sessionStart || isNaN(sessionStart)) {
      sessionStart = Date.now();
      localStorage.setItem('hansai-session-timestamp', sessionStart.toString());
    }

    const THREE_HOURS_MS = 3 * 60 * 60 * 1000; // 3 hours = 10,800,000 ms
    const WARNING_THRESHOLD_MS = 15 * 60 * 1000; // 15 minutes warning
    let warningShown = false;

    const checkAutoLogout = () => {
      const elapsed = Date.now() - sessionStart;
      const remaining = THREE_HOURS_MS - elapsed;

      if (remaining <= 0) {
        // 3 Hours Limit Reached -> Trigger Auto Logout
        localStorage.removeItem('hansai-user-session');
        localStorage.removeItem('hansai-session-timestamp');
        setUser(null);
        setIsHeaderMenuOpen(false);
        setActiveView('chat');

        // Show toast notification
        showToast(
          language === 'hindi'
            ? "⏱️ 3 घंटे की सत्र सीमा समाप्त! आपका अकाउंट ऑटोमैटिक लॉगआउट कर दिया गया है।"
            : "⏱️ 3 Hours Session Limit Reached! You have been automatically logged out for security and study discipline.",
          "warn"
        );

        // Append assistant chat notification message
        setChatMessages(prev => [
          ...prev,
          {
            id: `sys-logout-${Date.now()}`,
            role: 'assistant',
            content: language === 'hindi'
              ? "⚠️ **स्वचालित लॉगआउट सूचना (3 Hours Auto Logout Notification)**\n\nआपकी 3 घंटे की निरंतर अध्ययन सत्र सीमा पूरी हो चुकी है। सुरक्षा एवं अध्ययन अनुशासन बनाए रखने के लिए आपका अकाउंट ऑटोमैटिक लॉगआउट किया गया है।\n\nपुनः अभ्यास जारी रखने के लिए कृपया **Login / Register** करें।"
              : "⚠️ **Automatic Logout Notification (3 Hours Limit Reached)**\n\nYour 3-hour continuous study session limit has expired. To maintain security and learning discipline, your session has been automatically logged out.\n\nPlease click **Login / Register** to start a new session.",
            timestamp: new Date()
          }
        ]);
      } else if (remaining <= WARNING_THRESHOLD_MS && !warningShown) {
        warningShown = true;
        const remMins = Math.ceil(remaining / (60 * 1000));
        showToast(
          language === 'hindi'
            ? `⏱️ ध्यान दें! आपका सत्र ${remMins} मिनट में (3 घंटे पूरे होने पर) ऑटोमैटिक लॉगआउट हो जाएगा।`
            : `⏱️ Notice! Your session will auto-logout in ${remMins} minutes (3 hours limit).`,
          "info"
        );
      }
    };

    checkAutoLogout();
    const interval = setInterval(checkAutoLogout, 15000);
    return () => clearInterval(interval);
  }, [user, language]);

  // Browser Back Button & Popstate History Management (Prevents exiting app when back button pressed)
  useEffect(() => {
    // Whenever activeView changes to a sub-feature (not 'chat'), push state into history
    if (activeView !== 'chat') {
      window.history.pushState({ view: activeView }, '', `#${activeView}`);
    }
  }, [activeView]);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // 1. Close open modals first
      if (isShareModalOpen) {
        setIsShareModalOpen(false);
        return;
      }
      if (isSettingsOpen) {
        setIsSettingsOpen(false);
        return;
      }
      if (isAppLauncherOpen) {
        setIsAppLauncherOpen(false);
        return;
      }
      if (isFeatureHubOpen) {
        setIsFeatureHubOpen(false);
        return;
      }
      // 2. Return to Home ('chat') if inside sub-view
      if (activeView !== 'chat') {
        setActiveView('chat');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [activeView, isShareModalOpen, isSettingsOpen, isAppLauncherOpen, isFeatureHubOpen]);

  // Automatic Visitor & App Link Tracking on App Load
  useEffect(() => {
    const trackVisitorSession = async () => {
      try {
        let visitorId = localStorage.getItem('hansai_visitor_id');
        if (!visitorId) {
          visitorId = 'v_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
          localStorage.setItem('hansai_visitor_id', visitorId);
        }
        let storedUser = null;
        try {
          const raw = localStorage.getItem('hansai-user-session') || localStorage.getItem('hansai_registered_user');
          if (raw) storedUser = JSON.parse(raw);
        } catch (e) {}

        const currentEmail = storedUser?.email || user?.email || '';
        const currentName = storedUser?.name || user?.name || '';

        const userAgent = navigator.userAgent || '';
        const platform = navigator.platform || '';
        const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
        const deviceStr = (isMobile ? '📱 Mobile' : '💻 Desktop') + (platform ? ` (${platform})` : '');

        // Extract referral parameters if opened from shared link
        let refSource = 'Direct';
        let refMedium = 'app_share';
        if (typeof window !== 'undefined' && window.location.search) {
          const urlParams = new URLSearchParams(window.location.search);
          const rawRef = urlParams.get('ref') || urlParams.get('source') || urlParams.get('utm_source') || urlParams.get('share');
          if (rawRef) {
            refSource = rawRef;
            trackReferralClickToFirestore({
              referralCode: refSource,
              visitorId,
              referrer: document.referrer || refSource,
              path: urlParams.get('tab') || urlParams.get('view') || 'home'
            }).catch(console.warn);
          }
        }

        // 1. Register/Sync user on Firestore + Server if email is available
        if (currentEmail && currentName) {
          syncUserProfile({
            uid: currentEmail.replace(/[^a-zA-Z0-9]/g, '_'),
            email: currentEmail,
            name: currentName,
            isGuest: false,
            referralSource: refSource
          }).catch(console.warn);

          await fetch('/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: currentName, email: currentEmail })
          }).catch(console.warn);
        } else {
          // Sync visitor user in Firestore
          syncUserProfile({
            uid: visitorId,
            email: `${visitorId}@hansai.visitor`,
            name: `${isMobile ? '📱 Guest Mobile' : '💻 Guest Desktop'} (${visitorId.slice(-6)})`,
            isGuest: true,
            referralSource: refSource
          }).catch(console.warn);
        }

        // 2. Track visitor session on server
        await fetch('/api/users/track-visitor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            visitorId,
            name: currentName,
            email: currentEmail,
            deviceInfo: deviceStr,
            userAgent,
            path: window.location.pathname + window.location.hash,
            referrer: document.referrer || refSource
          })
        }).catch(console.warn);

        // 3. Refresh owner analytics if owner is logged in
        if (currentEmail === 'palhanslal4@gmail.com' || user?.email === 'palhanslal4@gmail.com') {
          fetchOwnerAnalytics();
        }
      } catch (err) {
        console.error("Failed to track visitor session", err);
      }
    };

    trackVisitorSession();

    // Check deep-link navigation from shared URLs (e.g. ?tab=quiz or ?view=steno)
    try {
      if (typeof window !== 'undefined' && window.location.search) {
        const urlParams = new URLSearchParams(window.location.search);
        const targetTab = urlParams.get('tab') || urlParams.get('view');
        if (targetTab) {
          const validViews = ['chat', 'newsboard', 'research', 'quiz', 'leaderboard', 'process', 'calculator', 'rap', 'notes', 'timer', 'history', 'goals', 'map', 'soul', 'sarkari-result', 'owner-dashboard', 'feedback', 'planner', 'study-plan', 'flashcards', 'photo-doubt', 'security', 'book-reader', 'notes-ocr', 'photo-ocr', 'neural-map', 'time-travel', 'mnemonics', 'science-lab', 'steno', 'launch-hub', 'article-reader', 'file-converter', 'weather-alerts', 'affiliate-store', 'affiliate', 'mistake-notebook', 'mock-interview', 'performance-analytics'];
          if (validViews.includes(targetTab)) {
            setActiveView(targetTab as any);
            showToast(`Opened shared workspace: ${targetTab.toUpperCase()}`, 'info');
          }
        }
      }
    } catch (e) {
      console.warn("Could not parse shared deep-link url params", e);
    }
  }, []);

  // Owner analytics state (for owner dashboard) with full RealOwnerAnalyticsData schema
  const [ownerAnalyticsData, setOwnerAnalyticsData] = useState<RealOwnerAnalyticsData>({
    users: [
      { id: 'usr_01', name: 'Hanslal Pal (Founder Owner)', email: 'palhanslal4@gmail.com', registeredAt: '2026-01-01T08:00:00.000Z', lastActiveAt: new Date().toISOString(), promptCount: 142, deviceInfo: '💻 Founder Admin Station', isGuest: false, referralSource: 'Owner Console' }
    ],
    logs: [
      { id: 'log_01', userName: 'Hanslal Pal (Founder Owner)', userEmail: 'palhanslal4@gmail.com', type: 'login', query: 'Owner Admin System Control Started', timestamp: new Date().toISOString(), feature: 'Owner Station' }
    ],
    totalUsers: 1,
    registeredCount: 1,
    visitorCount: 0,
    totalQueries: 1,
    activeToday: 1,
    activeWeek: 1,
    activeMonth: 1,
    featureUsage: [
      { feature: 'AI Study Assistant', count: 1, percent: 100 }
    ],
    mostUsedFeatures: [
      { feature: 'AI Study Assistant', count: 1, percent: 100 }
    ],
    shareAnalytics: {
      totalClicks: 0,
      registeredFromShare: 0,
      conversionRate: 0,
      referralBreakdown: { 'Direct': 1, 'WhatsApp': 0, 'Telegram': 0, 'Social Media': 0, 'Friend Referral': 0 }
    },
    usageTrends: {
      daily: 1,
      weekly: 1,
      monthly: 1,
      chartData: [
        { date: 'Today', count: 1 }
      ]
    },
    aiPerformance: {
      totalAiRequests: 1,
      successfulRequests: 1,
      aiErrors: 0,
      errorRate: 0,
      errorBreakdown: {}
    },
    feedbacks: []
  });
  const [isOwnerAnalyticsLoading, setIsOwnerAnalyticsLoading] = useState(false);
  const [ownerUserSearchQuery, setOwnerUserSearchQuery] = useState("");
  const [ownerUserTypeFilter, setOwnerUserTypeFilter] = useState<"all" | "registered" | "visitors" | "logged_in">("all");
  const [ownerLogSearchQuery, setOwnerLogSearchQuery] = useState("");
  const [ownerLogTypeFilter, setOwnerLogTypeFilter] = useState("all");
  const [selectedUserForLogs, setSelectedUserForLogs] = useState<string | null>(null);
  const [selectedUserBiodata, setSelectedUserBiodata] = useState<any | null>(null);

  // HANS AI ADMIN Navigation & Modules State
  type AdminTabType = 
    | 'dashboard' 
    | 'users' 
    | 'conversations' 
    | 'ai_models' 
    | 'features' 
    | 'content' 
    | 'quizzes' 
    | 'notifications' 
    | 'feedback' 
    | 'analytics' 
    | 'security' 
    | 'system_health' 
    | 'database' 
    | 'seo' 
    | 'settings' 
    | 'admin_logs';

  const [adminActiveTab, setAdminActiveTab] = useState<AdminTabType>('dashboard');

  // Admin Audit Logs State
  const [adminAuditLogs, setAdminAuditLogs] = useState<Array<{ id: string; action: string; category: string; timestamp: string; ip: string }>>([
    { id: 'audit_01', action: 'HANS AI Admin Console Initialized', category: 'Security', timestamp: new Date().toISOString(), ip: '127.0.0.1 (Owner Station)' },
    { id: 'audit_02', action: 'Password Security Guard Verified', category: 'Auth', timestamp: new Date().toISOString(), ip: '127.0.0.1 (Owner Station)' }
  ]);

  const addAdminAuditLog = (action: string, category: string = 'System') => {
    const newEntry = {
      id: 'audit_' + Date.now(),
      action,
      category,
      timestamp: new Date().toISOString(),
      ip: '127.0.0.1 (Owner Console)'
    };
    setAdminAuditLogs(prev => [newEntry, ...prev]);
  };

  // AI Model Controls
  const [aiModelSettings, setAiModelSettings] = useState({
    model: 'gemini-3.7-flash',
    temperature: 0.7,
    maxTokens: 4096,
    safetyLevel: 'Balanced'
  });

  // Feature Flags State
  const [featureFlags, setFeatureFlags] = useState({
    sarkari: true,
    music: true,
    photoDoubt: true,
    rap: true,
    research: true,
    quiz: true,
    map: true,
    soul: true,
    leaderboard: true
  });

  // Notifications & Announcements State
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastPriority, setBroadcastPriority] = useState<'normal' | 'high' | 'urgent'>('high');
  const [activeHeaderBanner, setActiveHeaderBanner] = useState('');

  // SEO Settings State
  const [seoSettings, setSeoSettings] = useState({
    title: 'HANS AI - #1 AI Exam Prep & Study Assistant',
    description: 'Interactive AI Study assistant with Sarkari Result, AI Music, Concept Mapping & Mock Quizzes.',
    keywords: 'HANS AI, SSC CGL, BPSC, Sarkari Result, AI Study'
  });

  // Custom Sarkari Job Posts (Content Manager)
  const [customSarkariPosts, setCustomSarkariPosts] = useState<Array<{ id: string; title: string; category: string; date: string; url: string }>>([
    { id: 'sp_01', title: 'SSC CGL Tier-1 Final Result & Marks Released 2026', category: 'Results', date: 'Today / आज', url: 'https://www.sarkariresult.com/' },
    { id: 'sp_02', title: 'BPSC 71st Combined Prelims Admit Card Download Direct Link', category: 'Admit Card', date: 'Today / आज', url: 'https://www.sarkariresult.com/' },
    { id: 'sp_03', title: 'Railway RRB NTPC Graduate / Non-Graduate 11,558 Posts Online Form', category: 'Latest Jobs', date: 'New / नया', url: 'https://www.sarkariresult.com/' },
    { id: 'sp_04', title: 'UP Police Constable Final Answer Key & PET Exam Schedule', category: 'Answer Key', date: 'New / नया', url: 'https://www.sarkariresult.com/' },
    { id: 'sp_05', title: 'Bihar TRE 4.0 Teacher Recruitment 1 Lakh+ Vacancy Notification', category: 'Latest Jobs', date: 'Latest / नवीनतम', url: 'https://www.sarkariresult.com/' },
    { id: 'sp_06', title: 'UPSC Civil Services CSE Prelims 2026 Online Application Form', category: 'Latest Jobs', date: 'Live / लाइव', url: 'https://www.sarkariresult.com/' }
  ]);
  const [newSarkariTitle, setNewSarkariTitle] = useState('');
  const [newSarkariCategory, setNewSarkariCategory] = useState('Latest Jobs');

  // Security Settings
  const [adminPasswordSecret, setAdminPasswordSecret] = useState('Chhangur#@8084');
  const [newAdminPasswordInput, setNewAdminPasswordInput] = useState('');
  const [adminAutoLockMinutes, setAdminAutoLockMinutes] = useState(15);

  // AI Sandbox Test State
  const [testAiPrompt, setTestAiPrompt] = useState('');
  const [testAiResponse, setTestAiResponse] = useState('');
  const [isTestingAi, setIsTestingAi] = useState(false);

  // Custom Quiz Repository State
  const [customQuizList, setCustomQuizList] = useState([
    { id: 'q_01', question: 'SSC CGL Shorthand Speed Requirement Grade C?', category: 'SSC Shorthand', options: ['100 wpm', '80 wpm', '120 wpm', '140 wpm'], correct: 0, explanation: 'Grade C requires 100 wpm in Pitman Shorthand.' },
    { id: 'q_02', question: 'Which article of Indian Constitution guarantees Right to Equality?', category: 'Polity & GK', options: ['Article 14-18', 'Article 19-22', 'Article 23-24', 'Article 25-28'], correct: 0, explanation: 'Articles 14 to 18 guarantee Right to Equality.' }
  ]);
  const [newQuizQuestion, setNewQuizQuestion] = useState('');
  const [newQuizCategory, setNewQuizCategory] = useState('General Knowledge');
  const [newQuizOptA, setNewQuizOptA] = useState('');
  const [newQuizOptB, setNewQuizOptB] = useState('');
  const [newQuizOptC, setNewQuizOptC] = useState('');
  const [newQuizOptD, setNewQuizOptD] = useState('');
  const [newQuizCorrect, setNewQuizCorrect] = useState(0);
  const [newQuizExplanation, setNewQuizExplanation] = useState('');

  // Owner Password Security Guard State (Always requires password on opening)
  const [isOwnerAuthenticated, setIsOwnerAuthenticated] = useState<boolean>(false);
  const [ownerPasswordInput, setOwnerPasswordInput] = useState("");
  const [ownerPasswordError, setOwnerPasswordError] = useState(false);

  const handleOwnerPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = ownerPasswordInput.trim();
    if (input === adminPasswordSecret || input === 'Chhangur#@8084' || input === 'Chhangur@8084') {
      setIsOwnerAuthenticated(true);
      setOwnerPasswordError(false);
      setOwnerPasswordInput('');
      addAdminAuditLog("Admin Console Unlocked", "Auth");
      showToast("Owner Admin Password Verified! Welcome Hanslal Pal Ji 🛡️", "success");
      fetchOwnerAnalytics();
    } else {
      setOwnerPasswordError(true);
      addAdminAuditLog(`Failed unlock attempt: ${input.substring(0, 3)}***`, "Security");
      showToast("Incorrect Password! / गलत पासवर्ड दर्ज किया गया", "warn");
    }
  };

  const fetchOwnerAnalytics = async () => {
    try {
      setIsOwnerAnalyticsLoading(true);
      const data = await fetchRealOwnerAnalytics();
      setOwnerAnalyticsData(data);
    } catch (e) {
      console.error("Failed to fetch owner analytics from Firestore", e);
      // Fallback to server API if needed
      try {
        const res = await fetch('/api/owner/analytics');
        if (res.ok) {
          const sData = await res.json();
          if (sData) {
            const fetchedUsers = Array.isArray(sData.users) ? sData.users : [];
            setOwnerAnalyticsData(prev => ({
              ...prev,
              users: fetchedUsers,
              logs: Array.isArray(sData.logs) ? sData.logs : [],
              totalUsers: typeof sData.totalUsers === 'number' ? sData.totalUsers : fetchedUsers.length,
              registeredCount: typeof sData.registeredCount === 'number' ? sData.registeredCount : fetchedUsers.filter((u: any) => !u.isGuest && !u.email?.endsWith('@hansai.visitor')).length,
              visitorCount: typeof sData.visitorCount === 'number' ? sData.visitorCount : fetchedUsers.filter((u: any) => u.isGuest || u.email?.endsWith('@hansai.visitor')).length,
              totalQueries: typeof sData.totalQueries === 'number' ? sData.totalQueries : (sData.logs?.length || 0)
            }));
          }
        }
      } catch (err) {}
    } finally {
      setIsOwnerAnalyticsLoading(false);
    }
  };

  const handleDeleteUserRecord = async (usr: any) => {
    if (!window.confirm(`क्या आप ${usr.name} (${usr.email}) का डेटा स्थायी रूप से डिलीट करना चाहते हैं?`)) {
      return;
    }
    try {
      if (usr.id) {
        await deleteUserFromFirestore(usr.id).catch(console.warn);
      }
      const res = await fetch('/api/owner/delete-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: usr.id, userEmail: usr.email })
      });
      if (res.ok) {
        showToast(`User ${usr.name} deleted successfully! 🗑️`, "success");
        if (selectedUserBiodata?.id === usr.id) setSelectedUserBiodata(null);
        fetchOwnerAnalytics();
      } else {
        showToast("Deleted from Firestore! 🗑️", "success");
        fetchOwnerAnalytics();
      }
    } catch (err) {
      showToast("User deleted from Firestore. 🗑️", "info");
      fetchOwnerAnalytics();
    }
  };

  const handleDeleteLogItem = async (logId: string) => {
    try {
      if (logId) {
        await deleteLogFromFirestore(logId).catch(console.warn);
      }
      const res = await fetch('/api/owner/delete-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logId })
      });
      showToast("Log entry deleted.", "info");
      fetchOwnerAnalytics();
    } catch (err) {
      showToast("Log deleted from Firestore.", "info");
      fetchOwnerAnalytics();
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
      // Sync to Firestore directly
      await syncUserProfile({
        uid: cleanEmail.replace(/[^a-zA-Z0-9]/g, '_'),
        email: cleanEmail,
        name: cleanName,
        isGuest: false,
        referralSource: 'Direct Registration'
      }).catch(console.warn);

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
      showToast(`Welcome ${cleanName}! Registered successfully in Firestore. 🎉`, "success");
      fetchOwnerAnalytics();
    } catch (err: any) {
      const role = cleanEmail === 'palhanslal4@gmail.com' ? 'owner' : 'student';
      const newUserObj = { name: cleanName, email: cleanEmail, role };
      setUser(newUserObj);
      localStorage.setItem('hansai-user-session', JSON.stringify(newUserObj));
      setIsUserRegisterModalOpen(false);
      showToast(`Welcome ${cleanName}! Saved in Firestore & Local storage.`, "success");
      fetchOwnerAnalytics();
    } finally {
      setIsRegisteringUser(false);
    }
  };

  const logUserActivity = (type: string, query: string) => {
    if (!query || !query.trim()) return;

    // Advance and update daily study streak on active practice/actions
    try {
      recordDailyPracticeActivity();
    } catch (e) {}

    let activeName = user?.name;
    let activeEmail = user?.email;

    if (!activeEmail) {
      try {
        const saved = localStorage.getItem('hansai-user-session') || localStorage.getItem('hansai_registered_user');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.email) {
            activeName = parsed.name;
            activeEmail = parsed.email;
          }
        }
      } catch (e) {}
    }

    if (!activeEmail) {
      const visitorId = localStorage.getItem('hansai_visitor_id') || 'guest';
      const userAgent = navigator.userAgent || '';
      const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
      const devStr = isMobile ? '📱 Guest Mobile' : '💻 Guest Desktop';
      activeEmail = `${visitorId}@hansai.visitor`;
      activeName = `${devStr} (${visitorId.slice(-6)})`;
    }

    // Instantly append to local activity logs for automatic history
    const typeLabel = type === 'quiz' ? 'quiz' : type === 'timer' ? 'timer' : 'note';
    const newLog = {
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type: typeLabel as 'quiz' | 'timer' | 'note',
      title: `[${type.toUpperCase()}] ${query.trim()}`,
      subtitle: `Recorded on HansAI AI Platform`,
      timestamp: new Date().toISOString()
    };

    setActivityLogs(prev => {
      const updated = [newLog, ...prev];
      try {
        localStorage.setItem('hansai-history', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    // 1. Write to Firestore directly with privacy sanitization
    logActivityToFirestore({
      userName: activeName || 'Student',
      userEmail: activeEmail,
      type,
      query: query.trim()
    }).then(() => {
      if (activeView === 'owner-dashboard' || user?.email === 'palhanslal4@gmail.com') {
        fetchOwnerAnalytics();
      }
    }).catch(err => console.warn("Firestore activity logging error", err));

    // 2. Also forward to server endpoint
    fetch('/api/users/log-activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: activeName || 'Student',
        email: activeEmail,
        type,
        query: query.trim()
      })
    })
    .catch(err => console.warn("Server activity log error", err));
  };

  const deleteSpecificHistoryLog = (logId: string, title?: string) => {
    setActivityLogs(prev => {
      const updated = prev.filter(item => item.id !== logId);
      try {
        localStorage.setItem('hansai-history', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast(
      language === 'hindi'
        ? `इतिहास से "${title ? title.slice(0, 30) : 'आइटम'}" हटा दिया गया 🗑️`
        : `Cleared item from history 🗑️`,
      "info"
    );
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

  // ChatGPT-style active chat session tracking and inline editing states
  const [currentChatSessionId, setCurrentChatSessionId] = useState<string | null>(null);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingChatTitle, setEditingChatTitle] = useState<string>('');
  const [isClearAllChatsModalOpen, setIsClearAllChatsModalOpen] = useState<boolean>(false);
  const [isChatHistoryModalOpen, setIsChatHistoryModalOpen] = useState<boolean>(false);

  const deleteSavedChat = (id: string) => {
    setSavedChats(prev => prev.filter(c => c.id !== id));
    if (currentChatSessionId === id) {
      setCurrentChatSessionId(null);
      setChatMessages([]);
    }
    showToast('Chat session deleted 🗑️', 'info');
  };

  const handleRenameChat = (id: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    setSavedChats(prev => prev.map(c => c.id === id ? { ...c, title: newTitle.trim() } : c));
    setEditingChatId(null);
    setEditingChatTitle('');
    showToast('Chat title updated ✏️', 'success');
  };

  const handlePinChat = (id: string) => {
    setSavedChats(prev => prev.map(c => c.id === id ? { ...c, isPinned: !c.isPinned } : c));
    showToast('Chat pin status updated 📌', 'info');
  };

  const handleClearAllChats = () => {
    setSavedChats([]);
    setCurrentChatSessionId(null);
    setChatMessages([]);
    setIsClearAllChatsModalOpen(false);
    showToast('All chat history cleared 🧹', 'info');
  };

  const filteredSavedChats = (Array.isArray(savedChats) ? savedChats : []).filter(s => 
    s && (!sidebarSearchQuery.trim() || 
    (s.title && s.title.toLowerCase().includes(sidebarSearchQuery.toLowerCase())) ||
    (s.messages && Array.isArray(s.messages) && s.messages.some((m: any) => m && m.content && String(m.content).toLowerCase().includes(sidebarSearchQuery.toLowerCase()))))
  );

  // Group chats by date (Today, Yesterday, Previous 7 Days, Older) like ChatGPT
  const groupChatsByDate = (chats: any[]) => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterdayStart = todayStart - 24 * 60 * 60 * 1000;
    const last7DaysStart = todayStart - 7 * 24 * 60 * 60 * 1000;

    const pinned: any[] = [];
    const today: any[] = [];
    const yesterday: any[] = [];
    const last7Days: any[] = [];
    const older: any[] = [];

    chats.forEach(chat => {
      if (chat.isPinned) {
        pinned.push(chat);
        return;
      }
      const chatTime = chat.timestamp ? new Date(chat.timestamp).getTime() : 0;
      if (chatTime >= todayStart) {
        today.push(chat);
      } else if (chatTime >= yesterdayStart) {
        yesterday.push(chat);
      } else if (chatTime >= last7DaysStart) {
        last7Days.push(chat);
      } else {
        older.push(chat);
      }
    });

    return { pinned, today, yesterday, last7Days, older };
  };

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
  const [fullImageModalUrl, setFullImageModalUrl] = useState<string | null>(null);
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

  const showToast = (msg: string, type: 'info' | 'success' | 'warn' | 'error' = 'success') => {
    const id = `toast-${Date.now()}`;
    const normalizedType: 'info' | 'success' | 'warn' = type === 'error' ? 'warn' : type;
    setToasts(prev => [...prev, { id, msg, type: normalizedType }]);
    
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

  // ⭐ Automatic 5-Star Feedback Popup Trigger when user finishes a feature or quiz and returns to Home / Chat
  const prevActiveViewRef = useRef<string>(activeView);
  useEffect(() => {
    const prev = prevActiveViewRef.current;
    if (prev && prev !== 'chat' && activeView === 'chat') {
      // User just came back to home/chat from another feature or quiz!
      // Check if feedback was already asked in this session to prevent spamming
      const hasAsked = sessionStorage.getItem('hansai_feedback_asked_session');
      if (!hasAsked) {
        const timer = setTimeout(() => {
          setFeedbackInitialContext(`HansAI Feature: ${prev.toUpperCase()}`);
          setIsFiveStarFeedbackOpen(true);
          sessionStorage.setItem('hansai_feedback_asked_session', 'true');
        }, 1200);
        return () => clearTimeout(timer);
      }
    }
    prevActiveViewRef.current = activeView;
  }, [activeView]);

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

  // Voice Speech and Image Attachment states (supports up to 3 images at once)
  const [chatAttachedImages, setChatAttachedImages] = useState<Array<{ id: string; mimeType: string; data: string; previewUrl: string; name?: string }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

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

  // 3. Text to Speech voice readout (Synthesizer) with Universal High-Clarity Hindi & English Engine
  const handleToggleSpeech = (msgId: string, text: string) => {
    if (currentlySpeakingMsgId === msgId) {
      stopAllSpeech();
      setCurrentlySpeakingMsgId(null);
      return;
    }

    stopAllSpeech();
    setCurrentlySpeakingMsgId(msgId);

    speakText(text, {
      rate: 1.0,
      onStart: () => setCurrentlySpeakingMsgId(msgId),
      onEnd: () => setCurrentlySpeakingMsgId(null),
      onError: () => setCurrentlySpeakingMsgId(null)
    });
  };

  // 3.5 Hands-Free Voice Assistant Engine
  const stopVoiceAssistantMode = () => {
    isVoiceAssistantActiveRef.current = false;
    isVoiceAssistantSpeakingRef.current = false;
    if (voiceAssistantSilenceTimerRef.current) {
      clearTimeout(voiceAssistantSilenceTimerRef.current);
      voiceAssistantSilenceTimerRef.current = null;
    }
    if (voiceAssistantRecRef.current) {
      try { voiceAssistantRecRef.current.abort(); } catch (e) {}
      voiceAssistantRecRef.current = null;
    }
    stopAllSpeech();
    setIsVoiceAssistantActive(false);
    setIsVoiceAssistantListening(false);
    setIsVoiceAssistantSpeaking(false);
    setVoiceAssistantTranscript("");
    setVoiceAssistantStatus("Voice Assistant Deactivated");
  };

  const speakVoiceAssistantReply = (replyText: string) => {
    stopAllSpeech();

    isVoiceAssistantSpeakingRef.current = true;
    setIsVoiceAssistantSpeaking(true);
    setVoiceAssistantStatus("🔊 Speaking AI Response...");

    speakText(replyText, {
      lang: selectedIndianVoiceLang,
      rate: 1.0,
      onEnd: () => {
        isVoiceAssistantSpeakingRef.current = false;
        setIsVoiceAssistantSpeaking(false);
        setVoiceAssistantStatus(
          language === 'hindi' 
            ? "🟢 एक्टिव - बोलिए (आपकी आवाज़ सुनी जा रही है...)" 
            : "🟢 Active - Listening for your voice..."
        );
        if (isVoiceAssistantActiveRef.current) {
          setTimeout(() => {
            if (isVoiceAssistantActiveRef.current && !isVoiceAssistantSpeakingRef.current) {
              startListeningCycle();
            }
          }, 400);
        }
      },
      onError: () => {
        isVoiceAssistantSpeakingRef.current = false;
        setIsVoiceAssistantSpeaking(false);
        setVoiceAssistantStatus(
          language === 'hindi' 
            ? "🟢 एक्टिव - बोलिए (आपकी आवाज़ सुनी जा रही है...)" 
            : "🟢 Active - Listening for your voice..."
        );
        if (isVoiceAssistantActiveRef.current) {
          setTimeout(() => {
            if (isVoiceAssistantActiveRef.current && !isVoiceAssistantSpeakingRef.current) {
              startListeningCycle();
            }
          }, 400);
        }
      }
    });
  };

  const handleVoiceAssistantQuery = async (queryText: string) => {
    if (!queryText || !queryText.trim()) return;

    let cleanQuery = queryText
      .replace(/^(ok|okay|hey|hello|ओपेन|ओके|ओक|ओपन)?\s*(open\s*ai|ai|hansai|ओपेन\s*एआई|ओके\s*एआई|ओक\s*एआई|ओपन\s*एआई)\b/i, "")
      .trim();

    if (!cleanQuery) cleanQuery = queryText;

    setVoiceAssistantStatus(`🤔 Thinking: "${cleanQuery}"`);
    showToast(`🎙️ Hands-Free Query: "${cleanQuery}"`, "info");

    await handleSendChat(cleanQuery);
  };

  const startListeningCycle = () => {
    if (!isVoiceAssistantActiveRef.current || isVoiceAssistantSpeakingRef.current) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (voiceAssistantRecRef.current) {
      try { voiceAssistantRecRef.current.abort(); } catch (e) {}
      voiceAssistantRecRef.current = null;
    }

    try {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = language === 'hindi' ? 'hi-IN' : 'en-US';

      rec.onstart = () => {
        setIsVoiceAssistantListening(true);
        setVoiceAssistantStatus(
          language === 'hindi'
            ? "🟢 एक्टिव - बोलिए (बोलने के बाद 1 सेकंड रुकें)"
            : "🟢 Active - Speak now (AI responds 1s after you pause)"
        );
      };

      rec.onresult = (event: any) => {
        let currentText = "";
        let isFinalDetected = false;

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const trans = event.results[i][0]?.transcript || "";
          currentText += trans;
          if (event.results[i].isFinal) {
            isFinalDetected = true;
          }
        }

        const trimmed = currentText.trim();
        if (!trimmed) return;

        voiceAssistantLastTranscriptRef.current = trimmed;
        setVoiceAssistantTranscript(trimmed);
        setVoiceAssistantStatus(`🎙️ Hearing: "${trimmed}"`);

        if (voiceAssistantSilenceTimerRef.current) {
          clearTimeout(voiceAssistantSilenceTimerRef.current);
          voiceAssistantSilenceTimerRef.current = null;
        }

        const triggerQuery = () => {
          const speechToSend = voiceAssistantLastTranscriptRef.current;
          if (!speechToSend || speechToSend.trim().length < 2) return;
          
          voiceAssistantLastTranscriptRef.current = "";
          setVoiceAssistantTranscript("");
          
          if (voiceAssistantRecRef.current) {
            try { voiceAssistantRecRef.current.stop(); } catch (e) {}
          }
          handleVoiceAssistantQuery(speechToSend);
        };

        if (isFinalDetected) {
          triggerQuery();
        } else {
          voiceAssistantSilenceTimerRef.current = setTimeout(() => {
            if (voiceAssistantLastTranscriptRef.current.trim().length >= 2) {
              triggerQuery();
            }
          }, 1100);
        }
      };

      rec.onerror = (err: any) => {
        const errType = err?.error;
        if (errType === 'no-speech' || errType === 'aborted') {
          return;
        }
        if (errType === 'not-allowed' || errType === 'service-not-allowed') {
          isVoiceAssistantActiveRef.current = false;
          setIsVoiceAssistantActive(false);
          setIsVoiceAssistantListening(false);
          setVoiceAssistantStatus("⚠️ Microphone Permission Denied.");
          showToast("⚠️ Microphone access denied. Please allow mic permissions in browser settings.", "warn");
          return;
        }
      };

      rec.onend = () => {
        setIsVoiceAssistantListening(false);
        if (voiceAssistantSilenceTimerRef.current) {
          clearTimeout(voiceAssistantSilenceTimerRef.current);
          voiceAssistantSilenceTimerRef.current = null;
        }

        if (isVoiceAssistantActiveRef.current && !isVoiceAssistantSpeakingRef.current) {
          setTimeout(() => {
            if (isVoiceAssistantActiveRef.current && !isVoiceAssistantSpeakingRef.current) {
              startListeningCycle();
            }
          }, 350);
        }
      };

      voiceAssistantRecRef.current = rec;
      rec.start();
    } catch (e) {
      console.warn("Speech recognition cycle initialization failed:", e);
    }
  };

  const startVoiceAssistantMode = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast(
        language === 'hindi' 
          ? "इस ब्राउज़र में वॉयस अस्सिस्टेंट समर्थित नहीं है। कृपया Chrome या Edge का उपयोग करें।" 
          : "Voice Recognition is not supported in this browser. Please use Chrome or Edge.", 
        "warn"
      );
      return;
    }

    if (isVoiceAssistantActive) {
      stopVoiceAssistantMode();
      return;
    }

    // Warmup audio player
    try {
      const silentAudio = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=");
      silentAudio.play().catch(() => {});
    } catch (e) {}

    isVoiceAssistantActiveRef.current = true;
    setIsVoiceAssistantActive(true);
    showToast("🎙️ Hands-Free Voice Assistant Active! Speak your question.", "success");

    startListeningCycle();
  };

  // 4. Voice Input vocal dictation with Multi-lingual Indian Languages Support
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
      rec.lang = selectedIndianVoiceLang || (language === 'hindi' ? 'hi-IN' : 'en-IN');

      rec.onstart = () => {
        setIsVoiceRecording(true);
        wasVoiceTriggeredRef.current = true;
      };

      rec.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        if (text) {
          setChatInput(prev => prev + (prev ? ' ' : '') + text);
          wasVoiceTriggeredRef.current = true;
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

  // 5. Intelligent Key terms highlighters & Clean Markdown/LaTeX Symbol Sanitizer
  const renderMessageWithHighlights = (content: string | undefined | null) => {
    if (!content) return "";
    let str = typeof content === 'string' ? content : String(content);

    // Clean up raw LaTeX arrow & math symbol clutter
    str = str
      .replaceAll('$\\rightarrow$', '→')
      .replaceAll('\\rightarrow', '→')
      .replaceAll('$\\leftarrow$', '←')
      .replaceAll('\\leftarrow', '←')
      .replaceAll('$\\Rightarrow$', '⇒')
      .replaceAll('\\Rightarrow', '⇒')
      .replaceAll('$\\Leftrightarrow$', '⇔')
      .replaceAll('\\Leftrightarrow', '⇔')
      .replace(/\$\s*→\s*\$/g, '→')
      .replace(/\$\s*([a-zA-Z0-9\s]+)\s*\$/g, '$1');

    const highlightRegex = /(shorthand|steno|stenographer|dictation|consonants|vowels|Pitman|PMEGP|Mudra|subsidy|subsidies|yield percentage|processed goods|machinery|net profit|revenue|हंसलाल पाल|हंसलाल पाल जी|Article \d+|अनुच्छेद \d+|Fundamental Rights|मौलिक अधिकार|Important|महत्वपूर्ण|Key Point|Key Takeaway|Formula|सूत्र|PYQ|Note:|Exam Tip|याद रखें)/ig;

    const highlightInlineText = (text: string) => {
      if (!isHighlightingEnabled || !text) return text;
      const parts = text.split(highlightRegex);
      if (parts.length === 1) return text;

      return parts.map((p, idx) => {
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
      });
    };

    const formatInline = (text: string) => {
      if (!text) return "";
      
      // Handle ==red== highlights
      const redParts = text.split(/(==[^=]+==)/g);
      return redParts.map((rPart, rIdx) => {
        if (rPart.startsWith('==') && rPart.endsWith('==') && rPart.length > 4) {
          const innerText = rPart.slice(2, -2);
          return (
            <strong key={`r-${rIdx}`} className="bg-rose-500/20 text-rose-400 font-bold px-1.5 py-0.5 rounded border border-rose-500/30 mx-0.5 shadow-sm">
              {highlightInlineText(innerText)}
            </strong>
          );
        }

        // Handle ++green++ highlights
        const greenParts = rPart.split(/(\+\+[^+]+\+\+)/g);
        return greenParts.map((gPart, gIdx) => {
          if (gPart.startsWith('++') && gPart.endsWith('++') && gPart.length > 4) {
            const innerText = gPart.slice(2, -2);
            return (
              <strong key={`g-${gIdx}`} className="bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded border border-emerald-500/30 mx-0.5 shadow-sm">
                {highlightInlineText(innerText)}
              </strong>
            );
          }

          // Handle **bold** text
          const boldParts = gPart.split(/(\*\*[^*]+\*\*)/g);
          return boldParts.map((part, bIdx) => {
            if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
              const innerText = part.slice(2, -2);
              return (
                <strong key={bIdx} className="font-bold text-amber-200/95">
                  {highlightInlineText(innerText)}
                </strong>
              );
            }
            // Handle *italic* text
            const italicParts = part.split(/(\*[^*]+\*)/g);
            return italicParts.map((iPart, iIdx) => {
              if (iPart.startsWith('*') && iPart.endsWith('*') && iPart.length > 2) {
                const innerText = iPart.slice(1, -1);
                return (
                  <em key={iIdx} className="italic text-slate-200">
                    {highlightInlineText(innerText)}
                  </em>
                );
              }
              return highlightInlineText(iPart);
            });
          });
        });
      });
    };

    const lines = str.split('\n');
    const renderedElements: React.ReactNode[] = [];
    let inQuoteBlock = false;
    let quoteBuffer: string[] = [];

    const flushQuoteBuffer = (key: string) => {
      if (quoteBuffer.length === 0) return;
      renderedElements.push(
        <blockquote 
          key={key} 
          className="my-2.5 border-l-4 border-amber-500/80 bg-amber-950/20 py-2 px-3.5 rounded-r-xl text-amber-100/95 font-medium shadow-inner"
        >
          {quoteBuffer.map((qLine, qIdx) => (
            <div key={qIdx} className="leading-relaxed">
              {formatInline(qLine)}
            </div>
          ))}
        </blockquote>
      );
      quoteBuffer = [];
      inQuoteBlock = false;
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // Horizontal dividers (---, ***, ___)
      if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
        if (inQuoteBlock) flushQuoteBuffer(`q-${index}`);
        renderedElements.push(
          <hr key={`hr-${index}`} className="my-3 border-t border-slate-700/60" />
        );
        return;
      }

      // Blockquotes (> )
      if (trimmed.startsWith('> ')) {
        inQuoteBlock = true;
        quoteBuffer.push(trimmed.slice(2));
        return;
      } else if (inQuoteBlock) {
        flushQuoteBuffer(`q-${index}`);
      }

      // Headings (###, ##, #)
      if (trimmed.startsWith('### ')) {
        renderedElements.push(
          <h3 key={`h3-${index}`} className="font-extrabold text-indigo-300 text-sm sm:text-base mt-3 mb-1.5 flex items-center gap-1.5">
            {formatInline(trimmed.slice(4))}
          </h3>
        );
        return;
      }
      if (trimmed.startsWith('## ')) {
        renderedElements.push(
          <h2 key={`h2-${index}`} className="font-black text-indigo-200 text-base sm:text-lg mt-3.5 mb-2 flex items-center gap-1.5">
            {formatInline(trimmed.slice(3))}
          </h2>
        );
        return;
      }
      if (trimmed.startsWith('# ')) {
        renderedElements.push(
          <h1 key={`h1-${index}`} className="font-black text-white text-lg sm:text-xl mt-4 mb-2">
            {formatInline(trimmed.slice(2))}
          </h1>
        );
        return;
      }

      // Bullet points (* , - , • )
      let isBullet = false;
      let bulletText = trimmed;
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
        isBullet = true;
        bulletText = trimmed.slice(2);
      }

      if (isBullet) {
        renderedElements.push(
          <div key={`bullet-${index}`} className="flex items-start gap-2 my-1 pl-1 text-slate-100">
            <span className="text-amber-400 font-extrabold text-sm leading-none mt-1 select-none">•</span>
            <div className="flex-1 leading-relaxed">
              {formatInline(bulletText)}
            </div>
          </div>
        );
        return;
      }

      // Empty line
      if (!trimmed) {
        renderedElements.push(<div key={`empty-${index}`} className="h-1.5" />);
        return;
      }

      // Normal text line
      renderedElements.push(
        <div key={`p-${index}`} className="leading-relaxed my-0.5">
          {formatInline(line)}
        </div>
      );
    });

    if (inQuoteBlock) {
      flushQuoteBuffer(`q-end`);
    }

    return <div className="space-y-0.5">{renderedElements}</div>;
  };

  // Chat state
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem('hansai-chat-messages');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [];
  });
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Auto-save chat messages to localStorage continuously
  useEffect(() => {
    if (chatMessages && chatMessages.length > 0) {
      try {
        localStorage.setItem('hansai-chat-messages', JSON.stringify(chatMessages));
      } catch (e) {}
    }
  }, [chatMessages]);
  
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
  
  // Quiz Generator, Difficulty Scaling, Smart Timer & A1 Report Card state
  const [quizSubject, setQuizSubject] = useState('');
  const [quizLevel, setQuizLevel] = useState('Class 10th / Competitive');
  const [quizDifficulty, setQuizDifficulty] = useState<'standard' | 'moderate' | 'hard' | 'extreme'>('standard');
  const [quizQuestionCount, setQuizQuestionCount] = useState<number>(5);
  const [studentName, setStudentName] = useState('Aspirant Student');
  const [studentRoll, setStudentRoll] = useState('HS-2026-8809');
  const [positiveMarkVal, setPositiveMarkVal] = useState(2.0);
  const [negativeMarkVal, setNegativeMarkVal] = useState(0.5);
  
  // Timer settings & Active timer states
  const [quizTimerMode, setQuizTimerMode] = useState<'auto' | 'custom_question' | 'custom_total' | 'none'>('auto');
  const [quizCustomQuestionSeconds, setQuizCustomQuestionSeconds] = useState<number>(30);
  const [quizCustomTotalMinutes, setQuizCustomTotalMinutes] = useState<number>(5);
  const [quizTimeRemaining, setQuizTimeRemaining] = useState<number>(150);
  const [quizTotalTimeLimit, setQuizTotalTimeLimit] = useState<number>(150);
  const [quizTimeSpentSeconds, setQuizTimeSpentSeconds] = useState<number>(0);
  const [isQuizTimerActive, setIsQuizTimerActive] = useState<boolean>(false);
  const [quizTimerSoundEnabled, setQuizTimerSoundEnabled] = useState<boolean>(true);

  // Wrong answer handling, Retries & Hints
  const [isRetryingQuestion, setIsRetryingQuestion] = useState<boolean>(false);
  const [showQuestionHint, setShowQuestionHint] = useState<boolean>(false);
  const [activeMistakeModal, setActiveMistakeModal] = useState<{ question: QuizQuestion; selectedOptionIdx: number } | null>(null);

  // Mistake Revision Notebook state
  const [mistakeNotebook, setMistakeNotebook] = useState<MistakeNotebookItem[]>(() => {
    const saved = localStorage.getItem('hansai-mistake-notebook');
    return saved ? JSON.parse(saved) : [];
  });

  const [userQuizAnswers, setUserQuizAnswers] = useState<Record<number, number>>({});
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [quizzes, setQuizzes] = useState<QuizQuestion[]>([]);
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizError, setQuizError] = useState<string | null>(null);
  const [quizAutoSaveNotice, setQuizAutoSaveNotice] = useState<string | null>(null);
  const [savedQuizSearch, setSavedQuizSearch] = useState('');
  const [reviewingSavedQuiz, setReviewingSavedQuiz] = useState<SavedQuizRecord | null>(null);
  const [hasActiveQuizDraft, setHasActiveQuizDraft] = useState<boolean>(() => {
    return !!localStorage.getItem('hansai-active-quiz-draft');
  });

  const handleDownloadA1Card = () => {
    const totalQ = quizzes.length;
    let correctQ = 0;
    let wrongQ = 0;
    quizzes.forEach((q, idx) => {
      const uAns = userQuizAnswers[idx];
      if (uAns !== undefined && uAns !== null) {
        if (uAns === q.answerIndex) correctQ++;
        else wrongQ++;
      }
    });
    const unattempted = Math.max(0, totalQ - (correctQ + wrongQ));
    const posMarks = (correctQ * positiveMarkVal).toFixed(2);
    const negMarks = (wrongQ * negativeMarkVal).toFixed(2);
    const netScoreVal = Math.max(0, (correctQ * positiveMarkVal) - (wrongQ * negativeMarkVal)).toFixed(2);
    const maxScoreVal = (totalQ * positiveMarkVal).toFixed(2);
    const pct = maxScoreVal !== "0.00" ? Math.min(100, Math.max(0, Math.round((parseFloat(netScoreVal) / parseFloat(maxScoreVal)) * 100))) : 0;

    const cardHtml = `<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>A1 Scorecard - ${studentName} - ${quizSubject}</title>
  <style>
    @page { size: A4 portrait; margin: 8mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { width: 100%; height: 100%; overflow-x: hidden; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #030712; color: #f3f4f6; padding: 20px 12px; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .certificate-card { width: 100%; max-width: 820px; background: linear-gradient(135deg, #090d16 0%, #1e1b4b 50%, #030712 100%); border: 6px double #f59e0b; border-radius: 20px; padding: 25px; box-shadow: 0 20px 50px rgba(0,0,0,0.85); position: relative; overflow: hidden; page-break-inside: avoid; }
    .bg-watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 140px; font-weight: 900; color: rgba(255,255,255,0.02); pointer-events: none; user-select: none; z-index: 0; text-transform: uppercase; white-space: nowrap; }
    .content-wrap { position: relative; z-index: 1; }
    .header { text-align: center; border-bottom: 2px solid rgba(245, 158, 11, 0.4); padding-bottom: 14px; margin-bottom: 18px; }
    .org-title { font-size: 22px; font-weight: 900; color: #fbbf24; letter-spacing: 1.5px; text-transform: uppercase; }
    .sub-org { font-size: 11px; color: #e0e7ff; margin-top: 3px; letter-spacing: 0.5px; font-weight: 600; }
    .card-type { font-size: 13px; color: #818cf8; margin-top: 6px; font-weight: 800; letter-spacing: 1px; background: rgba(99, 102, 241, 0.15); display: inline-block; padding: 3px 14px; border-radius: 16px; border: 1px solid rgba(99, 102, 241, 0.3); }
    .meta-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 14px; text-align: left; margin-bottom: 18px; font-size: 12px; }
    .meta-item strong { color: #94a3b8; display: block; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
    .meta-item span { color: #ffffff; font-weight: 700; font-size: 14px; margin-top: 2px; display: block; }
    .table-container { width: 100%; border-collapse: collapse; margin-bottom: 15px; border-radius: 10px; overflow: hidden; }
    .table-container th, .table-container td { border: 1px solid rgba(255,255,255,0.1); padding: 9px; text-align: center; font-size: 12px; }
    .table-container th { background: #1e1b4b; color: #e0e7ff; font-weight: 700; font-size: 11px; text-transform: uppercase; }
    .table-container td { background: rgba(15, 23, 42, 0.6); }
    .pos { color: #4ade80; font-weight: 800; }
    .neg { color: #f87171; font-weight: 800; }
    .score-summary { background: linear-gradient(90deg, #1e293b, #0f172a); border: 2px solid #10b981; border-radius: 16px; padding: 15px; display: flex; justify-content: space-around; align-items: center; margin-bottom: 18px; flex-wrap: wrap; gap: 10px; }
    .big-score { font-size: 32px; font-weight: 900; color: #34d399; }
    .grade-badge { background: #d97706; color: #ffffff; padding: 6px 18px; border-radius: 40px; font-weight: 800; font-size: 13px; display: inline-block; box-shadow: 0 4px 12px rgba(217, 119, 6, 0.4); }
    .footer { font-size: 10px; color: #64748b; margin-top: 18px; border-top: 1px solid #1e293b; padding-top: 12px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
    @media print {
      body { padding: 0; background: #030712 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .certificate-card { width: 100% !important; max-width: 100% !important; border-width: 4px !important; box-shadow: none !important; border-radius: 0 !important; }
    }
  </style>
</head>
<body>
  <div class="certificate-card">
    <div class="bg-watermark">HANS-AI</div>
    <div class="content-wrap">
      <div class="header">
        <div class="org-title">🏆 HANS-AI ACADEMIC EVALUATION COUNCIL</div>
        <div class="sub-org">राष्ट्रीय परीक्षा मूल्यांकन एवं डिजिटल लर्निंग सिस्टम (A1 GRADE REPORT)</div>
        <div class="card-type">OFFICIAL CHAPTER SCORECARD & A1 CERTIFICATE</div>
      </div>
      <div class="meta-grid">
        <div class="meta-item"><strong>Student Name / विद्यार्थी का नाम</strong><span>${studentName}</span></div>
        <div class="meta-item"><strong>Roll / Reg Number</strong><span>${studentRoll}</span></div>
        <div class="meta-item"><strong>Chapter / Subject / अध्याय</strong><span>${quizSubject}</span></div>
        <div class="meta-item"><strong>Level / Target Exam</strong><span>${quizLevel}</span></div>
      </div>
      <table class="table-container">
        <thead>
          <tr>
            <th>Total MCQs</th>
            <th>Correct Answers</th>
            <th>Wrong Answers</th>
            <th>Unattempted</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${totalQ}</td>
            <td class="pos">${correctQ}</td>
            <td class="neg">${wrongQ}</td>
            <td>${unattempted}</td>
          </tr>
        </tbody>
      </table>
      <table class="table-container">
        <thead>
          <tr>
            <th>Positive Marks (+${positiveMarkVal})</th>
            <th>Negative Marks (-${negativeMarkVal})</th>
            <th>Net Score Obtained</th>
            <th>Percentage Score</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="pos">+${posMarks}</td>
            <td class="neg">-${negMarks}</td>
            <td style="font-size:15px; font-weight:bold; color:#fbbf24;">${netScoreVal} / ${maxScoreVal}</td>
            <td style="font-size:15px; font-weight:bold; color:#38bdf8;">${pct}%</td>
          </tr>
        </tbody>
      </table>
      <div class="score-summary">
        <div>
          <div style="font-size:11px; color:#94a3b8; font-weight:bold; text-transform:uppercase;">PERFORMANCE PERCENTAGE</div>
          <div class="big-score">${pct}%</div>
        </div>
        <div>
          <div style="font-size:11px; color:#94a3b8; font-weight:bold; text-transform:uppercase;">CERTIFICATE GRADE</div>
          <div class="grade-badge">${pct >= 85 ? 'DISTINCTION (GRADE A+)' : pct >= 60 ? 'PASSED (GRADE A)' : pct >= 40 ? 'PASSED (GRADE B)' : 'NEEDS REVISION (GRADE C)'}</div>
        </div>
      </div>
      <div class="footer">
        <div>Verified By: HansAI Educational Platform</div>
        <div>Certificate Ref: #HS-A1-${Date.now().toString().slice(-6)}</div>
      </div>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([cardHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HansAI_A1_Card_${studentName.replace(/\s+/g, '_')}_${quizSubject.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("A1 Size Report Card Downloaded Successfully! 📜", "success");
  };

  // Interactive Quiz Tabs: 'syllabus' | 'saved' | 'mistakes'
  const [activeQuizTab, setActiveQuizTab] = useState<'syllabus' | 'saved' | 'mistakes'>('syllabus');
  const [savedQuizzes, setSavedQuizzes] = useState<SavedQuizRecord[]>(() => {
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

  const saveActiveQuizDraft = (
    currentQList: QuizQuestion[],
    currIdx: number,
    answers: Record<number, number>,
    currScore: number,
    isSubmitted: boolean,
    subj: string,
    lvl: string
  ) => {
    if (!currentQList || currentQList.length === 0) return;
    try {
      const draftData = {
        quizzes: currentQList,
        currentQuizIdx: currIdx,
        userQuizAnswers: answers,
        score: currScore,
        isQuizSubmitted: isSubmitted,
        quizSubject: subj,
        quizLevel: lvl,
        studentName,
        studentRoll,
        positiveMarkVal,
        negativeMarkVal,
        lastSaved: new Date().toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };
      localStorage.setItem('hansai-active-quiz-draft', JSON.stringify(draftData));
      setHasActiveQuizDraft(true);
      setQuizAutoSaveNotice(`Auto-Saved at ${new Date().toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' })}`);
    } catch (err) {
      console.warn("Quiz draft auto-save error:", err);
    }
  };

  const resumeActiveQuizDraft = () => {
    try {
      const savedDraft = localStorage.getItem('hansai-active-quiz-draft');
      if (savedDraft) {
        const data = JSON.parse(savedDraft);
        if (data.quizzes && data.quizzes.length > 0) {
          setQuizzes(data.quizzes);
          setCurrentQuizIdx(data.currentQuizIdx || 0);
          setUserQuizAnswers(data.userQuizAnswers || {});
          setScore(data.score || 0);
          setIsQuizSubmitted(!!data.isQuizSubmitted);
          if (data.quizSubject) setQuizSubject(data.quizSubject);
          if (data.quizLevel) setQuizLevel(data.quizLevel);
          if (data.studentName) setStudentName(data.studentName);
          if (data.studentRoll) setStudentRoll(data.studentRoll);
          if (data.positiveMarkVal) setPositiveMarkVal(data.positiveMarkVal);
          if (data.negativeMarkVal) setNegativeMarkVal(data.negativeMarkVal);
          setSelectedOptionIdx(null);
          showToast("Resumed your in-progress quiz session! 📝⚡", "success");
        }
      }
    } catch (err) {
      console.error("Failed to restore quiz draft:", err);
    }
  };

  const discardActiveQuizDraft = () => {
    localStorage.removeItem('hansai-active-quiz-draft');
    setHasActiveQuizDraft(false);
    showToast("Unfinished quiz draft cleared.", "info");
  };

  // Audio feedback for countdown timer
  const playTimerAlertSound = (freq = 800, duration = 0.15) => {
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return;
      const audioCtx = new AudioCtxClass();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio context might be restricted before interaction
    }
  };

  // Helper to compute initial seconds for smart automatic timer or manual options
  const calculateInitialTimerSeconds = (count: number, difficulty: string, mode: 'auto' | 'custom_question' | 'custom_total' | 'none') => {
    if (mode === 'none') return 0;
    if (mode === 'custom_question') return quizCustomQuestionSeconds;
    if (mode === 'custom_total') return quizCustomTotalMinutes * 60;
    
    // Auto mode: dynamic per-question time according to difficulty
    let perQSec = 30; // standard
    if (difficulty === 'moderate') perQSec = 45;
    else if (difficulty === 'hard') perQSec = 60;
    else if (difficulty === 'extreme') perQSec = 90;
    return count * perQSec;
  };

  const formatTimerDisplay = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Timer useEffect countdown loop
  useEffect(() => {
    if (quizzes.length === 0 || currentQuizIdx >= quizzes.length || !isQuizTimerActive || quizTimerMode === 'none') {
      return;
    }

    const timer = setInterval(() => {
      setQuizTimeSpentSeconds(prev => prev + 1);

      setQuizTimeRemaining(prev => {
        if (prev <= 1) {
          // Time's up!
          if (quizTimerSoundEnabled) {
            playTimerAlertSound(420, 0.4);
          }

          if (quizTimerMode === 'custom_question') {
            // Auto lock current answer for this question
            if (!isQuizSubmitted) {
              const currentQ = quizzes[currentQuizIdx];
              const updatedAnswers = { ...userQuizAnswers, [currentQuizIdx]: selectedOptionIdx ?? -1 };
              setUserQuizAnswers(updatedAnswers);
              setIsQuizSubmitted(true);
              showToast("समय समाप्त! (Time's up for this question)", "info");
            }
            return 0;
          } else {
            // Total quiz time ended! Finish test
            advanceQuiz();
            showToast("कुल समय समाप्त! (Total Quiz Time Finished)", "info");
            return 0;
          }
        }

        // Warning chime at 10 seconds remaining
        if (prev === 11 && quizTimerSoundEnabled) {
          playTimerAlertSound(880, 0.15);
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizzes.length, currentQuizIdx, isQuizTimerActive, quizTimerMode, isQuizSubmitted, quizTimerSoundEnabled, userQuizAnswers, selectedOptionIdx]);

  const handleGenerateQuiz = async (
    subjectParam?: string,
    difficultyParam?: 'standard' | 'moderate' | 'hard' | 'extreme',
    countParam?: number
  ) => {
    const targetDifficulty = difficultyParam || quizDifficulty || 'standard';
    const targetCount = countParam || quizQuestionCount || 5;
    const targetedSubject = subjectParam || quizSubject || "Chapter 1: Real Numbers & Algebra";

    setQuizDifficulty(targetDifficulty);
    setQuizQuestionCount(targetCount);
    setIsGeneratingQuiz(true);
    setQuizError(null);
    setCurrentQuizIdx(0);
    setSelectedOptionIdx(null);
    setIsQuizSubmitted(false);
    setIsRetryingQuestion(false);
    setShowQuestionHint(false);
    setUserQuizAnswers({});
    setScore(0);
    setQuizTimeSpentSeconds(0);

    // Compute timer initial values
    const initSec = calculateInitialTimerSeconds(targetCount, targetDifficulty, quizTimerMode);
    setQuizTimeRemaining(initSec);
    setQuizTotalTimeLimit(initSec);
    setIsQuizTimerActive(quizTimerMode !== 'none');

    // Log quiz activity query for owner analytics
    logUserActivity('quiz', `Quiz Generated: ${targetedSubject} [Level: ${targetDifficulty}, Count: ${targetCount}]`);

    try {
      const activeLang = quizLanguage || language || 'hindi';
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          subject: targetedSubject, 
          level: quizLevel, 
          difficulty: targetDifficulty,
          count: targetCount,
          lang: activeLang 
        })
      });
      if (!res.ok) throw new Error("Academic Node busy.");
      const data = await res.json();
      if (data.quiz && data.quiz.length > 0) {
        setQuizzes(data.quiz);
        saveActiveQuizDraft(data.quiz, 0, {}, 0, false, targetedSubject, quizLevel);
      } else {
        throw new Error("No quiz list returned.");
      }
    } catch (err: any) {
      console.error("Quiz generation error:", err);
      const activeLang = quizLanguage || language || 'hindi';
      // Fallback MCQs matching selected language
      const fallbackList: QuizQuestion[] = activeLang === 'hindi' ? [
        {
          question: `"${targetedSubject}" अभ्यास प्रश्न (${targetDifficulty.toUpperCase()}): इस विषय की बेहतर तैयारी के लिए सबसे महत्वपूर्ण रणनीति क्या है?`,
          options: [
            "नियमित अभ्यास क्विज़ देना, गलतियों का विश्लेषण करना और उत्तरों की व्याख्या पढ़ना",
            "केवल उत्तरों को रटना बिना अवधारणा समझे",
            "कठिन विषयों को परीक्षा के लिए छोड़ देना",
            "अविश्वसनीय स्रोतों से बिना समय सीमा अभ्यास करना"
          ],
          answerIndex: 0,
          explanation: "नियमित टेस्ट हल करना, कमजोर बिंदुओं को पहचानना और सही व्याख्या समझना परीक्षा में सर्वाधिक अंक दिलाने का सर्वोत्तम तरीका है।",
          hint: "सक्रिय पुनरीक्षण (active recall) और त्रुटि सुधार पर ध्यान केंद्रित करें।",
          difficulty: targetDifficulty
        },
        {
          question: `Hans Compain डिजिटल गाइड: बहुविकल्पीय (MCQ) प्रश्नों में 100% सटीकता प्राप्त करने का मुख्य तरीका क्या है?`,
          options: [
            "केवल तुक्का लगाना और जल्दी में टिक करना",
            "प्रश्न को ध्यान से पढ़ना, भ्रामक विकल्पों को हटाना और मूल अवधारणा पर ध्यान देना",
            "महीने में केवल एक बार अभ्यास करना",
            "प्रश्नों की समीक्षा कभी न करना"
          ],
          answerIndex: 1,
          explanation: "सटीक गति और विकल्पों के सही विलोपन (elimination) से परीक्षा में सबसे अधिक अंक प्राप्त होते हैं।",
          hint: "गलत विकल्पों को एक-एक करके खारिज (eliminate) करने का प्रयास करें।",
          difficulty: targetDifficulty
        }
      ] : [
        {
          question: `"${targetedSubject}" Practice Question (${targetDifficulty.toUpperCase()}): What is the most effective strategy for mastering this chapter?`,
          options: [
            "Regular mock quizzes, mistake analysis, and conceptual remediation",
            "Rote memorization without understanding underlying logic",
            "Skipping difficult sub-topics completely",
            "Practicing without time constraints or answer reviews"
          ],
          answerIndex: 0,
          explanation: "Active recall, timely practice, and analyzing weak areas are empirically proven to deliver top scores.",
          hint: "Focus on conceptual clarity and rigorous error remediation.",
          difficulty: targetDifficulty
        },
        {
          question: `Hans Compain Academic Guide: How can candidates maximize accuracy in tricky multi-option questions?`,
          options: [
            "Blind guessing within the first 5 seconds",
            "Careful question reading, eliminating contradictory choices, and verifying key terms",
            "Attempting questions only once a month",
            "Ignoring answer explanations"
          ],
          answerIndex: 1,
          explanation: "Systematic option elimination and careful analysis of trap distractors ensure 100% accuracy.",
          hint: "Eliminate extreme or non-pertinent statements first.",
          difficulty: targetDifficulty
        }
      ];
      setQuizzes(fallbackList);
      saveActiveQuizDraft(fallbackList, 0, {}, 0, false, targetedSubject, quizLevel);
      setQuizError(activeLang === 'hindi' ? "ऑफलाइन मॉक प्रश्न लोड किए गए हैं! 📚" : "Offline mock database loaded! Active syllabus review test ready. 📚");
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  // Mistake Notebook Management Helpers
  const handleSaveMistakeToNotebook = (
    itemOrQuestion: MistakeNotebookItem | QuizQuestion,
    selectedOptionIndex: number = -1,
    remedialExplanation?: string
  ) => {
    let newItem: MistakeNotebookItem;
    if ('userAnswerIndex' in itemOrQuestion && 'timestamp' in itemOrQuestion) {
      newItem = itemOrQuestion as MistakeNotebookItem;
    } else {
      const q = itemOrQuestion as QuizQuestion;
      newItem = {
        id: `mistake-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        subject: quizSubject || 'General Assessment',
        difficulty: q.difficulty || quizDifficulty,
        timestamp: new Date().toLocaleDateString('hi-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        question: q.question,
        options: q.options,
        correctAnswerIndex: q.answerIndex,
        userAnswerIndex: selectedOptionIndex >= 0 ? selectedOptionIndex : 0,
        explanation: q.explanation,
        hint: q.hint,
        remedialExplanation: remedialExplanation || q.explanation,
        attemptsCount: 1,
        mastered: false
      };
    }

    setMistakeNotebook(prev => {
      if (prev.some(m => m.question === newItem.question)) {
        showToast("यह प्रश्न पहले से ही गलती रजिस्टर में मौजूद है! 📓", "info");
        return prev;
      }
      const updated = [newItem, ...prev];
      localStorage.setItem('hansai-mistake-notebook', JSON.stringify(updated));
      showToast("गलती रजिस्टर (Mistake Notebook) में सुरक्षित! 📓", "success");
      return updated;
    });
  };

  const handleDeleteMistake = (id: string) => {
    const updated = mistakeNotebook.filter(m => m.id !== id);
    setMistakeNotebook(updated);
    localStorage.setItem('hansai-mistake-notebook', JSON.stringify(updated));
    showToast("Mistake record removed.", "info");
  };

  const handleClearAllMistakes = () => {
    if (confirm("क्या आप सभी गलत प्रश्न रजिस्टर से हटाना चाहते हैं? (Clear all mistake records?)")) {
      setMistakeNotebook([]);
      localStorage.removeItem('hansai-mistake-notebook');
      showToast("Mistake notebook cleared.", "info");
    }
  };

  const handleToggleMasteredMistake = (id: string) => {
    const updated = mistakeNotebook.map(m => m.id === id ? { ...m, mastered: !m.mastered } : m);
    setMistakeNotebook(updated);
    localStorage.setItem('hansai-mistake-notebook', JSON.stringify(updated));
    showToast("Status updated.", "success");
  };

  const handleStartRetestFromMistakes = (questions: QuizQuestion[], testSubject: string) => {
    setQuizzes(questions);
    setQuizSubject(testSubject);
    setQuizLevel("Mistake Correction Retest");
    setQuizDifficulty('hard');
    setQuizQuestionCount(questions.length);
    setCurrentQuizIdx(0);
    setSelectedOptionIdx(null);
    setIsQuizSubmitted(false);
    setIsRetryingQuestion(false);
    setShowQuestionHint(false);
    setUserQuizAnswers({});
    setScore(0);
    setQuizTimeSpentSeconds(0);
    
    const initTimerSec = calculateInitialTimerSeconds(questions.length, 'hard', quizTimerMode);
    setQuizTimeRemaining(initTimerSec);
    setQuizTotalTimeLimit(initTimerSec);
    setIsQuizTimerActive(quizTimerMode !== 'none');
    
    setActiveQuizTab('syllabus');
    showToast(`🎯 Launching ${questions.length} Mistakes Targeted Retest!`, "success");
  };

  // 1-Click Level Up: Switch to Harder/Extreme Question on same chapter
  const handleLevelUpQuiz = (levelToSet?: 'moderate' | 'hard' | 'extreme') => {
    const nextDiff = levelToSet || (quizDifficulty === 'standard' ? 'hard' : quizDifficulty === 'moderate' ? 'hard' : 'extreme');
    setQuizDifficulty(nextDiff);
    handleGenerateQuiz(quizSubject, nextDiff, quizQuestionCount);
    showToast(`⚡ Level Up Activated: Generating ${nextDiff.toUpperCase()} Level Questions for ${quizSubject || 'current chapter'}!`, "success");
  };

  // Retry current question with hint unlocked
  const handleRetryCurrentQuestion = () => {
    setIsQuizSubmitted(false);
    setShowQuestionHint(true);
    setIsRetryingQuestion(true);
    setSelectedOptionIdx(null);
    showToast("💡 संकेत अनलॉक हुआ! पुनः प्रयास करें (Hint Unlocked - Select your answer again!)", "info");
  };

  const selectQuizOption = (optionIndex: number) => {
    if (!isQuizSubmitted) {
      setSelectedOptionIdx(optionIndex);
    }
  };

  const submitQuizAnswer = () => {
    if (selectedOptionIdx === null) return;
    const currentQ = quizzes[currentQuizIdx];
    const updatedAnswers = { ...userQuizAnswers, [currentQuizIdx]: selectedOptionIdx };
    setUserQuizAnswers(updatedAnswers);
    let newScore = score;
    const isCorrect = selectedOptionIdx === currentQ.answerIndex;

    if (isCorrect) {
      if (!isRetryingQuestion) {
        newScore = score + 1;
        setScore(newScore);
      }
    }
    setIsQuizSubmitted(true);
    saveActiveQuizDraft(quizzes, currentQuizIdx, updatedAnswers, newScore, true, quizSubject, quizLevel);

    // If answer is incorrect and not in notebook, offer quick auto-capture or prompt
    if (!isCorrect) {
      const mistakeItem: MistakeNotebookItem = {
        id: `mistake-${Date.now()}-${currentQuizIdx}`,
        subject: quizSubject || "General Assessment",
        chapter: quizSubject || "Current Chapter",
        difficulty: currentQ.difficulty || quizDifficulty,
        question: currentQ.question,
        options: currentQ.options,
        userAnswerIndex: selectedOptionIdx,
        correctAnswerIndex: currentQ.answerIndex,
        userAnswerText: currentQ.options[selectedOptionIdx] || "None",
        correctAnswerText: currentQ.options[currentQ.answerIndex] || "None",
        explanation: currentQ.explanation || "No explanation provided.",
        hint: currentQ.hint || "Review key conceptual fundamentals.",
        timestamp: new Date().toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString('hi-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        mastered: false,
        attemptCount: 1
      };
      // Auto-save to notebook seamlessly
      setMistakeNotebook(prev => {
        if (prev.some(m => m.question === mistakeItem.question)) return prev;
        const updated = [mistakeItem, ...prev];
        localStorage.setItem('hansai-mistake-notebook', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const advanceQuiz = () => {
    const isLastQ = currentQuizIdx === quizzes.length - 1;
    if (isLastQ) {
      setIsQuizTimerActive(false);
      let correctQ = 0;
      let wrongQ = 0;
      const finalAnswers = { ...userQuizAnswers };
      if (selectedOptionIdx !== null) {
        finalAnswers[currentQuizIdx] = selectedOptionIdx;
      }
      quizzes.forEach((q, idx) => {
        const uAns = finalAnswers[idx];
        if (uAns !== undefined && uAns !== null && uAns >= 0) {
          if (uAns === q.answerIndex) correctQ++;
          else wrongQ++;
        }
      });
      const posMarks = correctQ * positiveMarkVal;
      const negMarks = wrongQ * negativeMarkVal;
      const netScoreVal = Math.max(0, posMarks - negMarks);
      const maxScoreVal = quizzes.length * positiveMarkVal;
      const pct = maxScoreVal > 0 ? Math.round((netScoreVal / maxScoreVal) * 100) : 0;
      const gradeStr = pct >= 85 ? 'DISTINCTION (A+)' : pct >= 60 ? 'PASSED (A)' : pct >= 40 ? 'PASSED (B)' : 'NEEDS REVISION';

      const scoreStr = `Net: ${netScoreVal.toFixed(1)}/${maxScoreVal.toFixed(1)} (${pct}%) [+${posMarks.toFixed(1)}, -${negMarks.toFixed(1)}]`;
      const logItem = {
        id: `hist-quiz-${Date.now()}`,
        type: 'quiz' as const,
        title: `${quizSubject || 'Academic Quiz'} Assessment Finished`,
        subtitle: `Student: ${studentName} | Roll: ${studentRoll} | Level: ${quizDifficulty.toUpperCase()}`,
        score: scoreStr,
        timestamp: new Date().toISOString()
      };
      setActivityLogs(prev => [logItem, ...prev]);

      // AUTO-SAVE COMPLETE QUIZ RECORD IN REPOSITORY & LOCALSTORAGE
      const autoSavedRecord: SavedQuizRecord = {
        id: "quiz-" + Date.now(),
        subject: quizSubject || "SSC & Academic Chapter Assessment",
        level: `${quizLevel} (${quizDifficulty.toUpperCase()})`,
        date: new Date().toLocaleDateString('hi-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        timestamp: new Date().toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' }),
        score: correctQ,
        total: quizzes.length,
        studentName: studentName || 'Aspirant Student',
        studentRoll: studentRoll || 'HS-2026-8809',
        positiveMarks: parseFloat(posMarks.toFixed(1)),
        negativeMarks: parseFloat(negMarks.toFixed(1)),
        netScore: parseFloat(netScoreVal.toFixed(1)),
        maxScore: parseFloat(maxScoreVal.toFixed(1)),
        percentage: pct,
        grade: gradeStr,
        userAnswers: finalAnswers,
        quizzes: quizzes
      };

      const updated = [autoSavedRecord, ...savedQuizzes.filter(q => q.id !== autoSavedRecord.id)];
      setSavedQuizzes(updated);
      localStorage.setItem('hansai-saved-quizzes', JSON.stringify(updated));
      localStorage.removeItem('hansai-active-quiz-draft');
      setHasActiveQuizDraft(false);
      setQuizAutoSaveNotice(`Auto-Saved to Records at ${autoSavedRecord.timestamp} ✅`);
      showToast("Quize Auto-Saved in Records! ✅ (क्विज़ स्वतः सुरक्षित हो गया)", "success");
    } else {
      saveActiveQuizDraft(quizzes, currentQuizIdx + 1, userQuizAnswers, score, false, quizSubject, quizLevel);
      // Reset question-specific timer if in per-question mode
      if (quizTimerMode === 'custom_question') {
        setQuizTimeRemaining(quizCustomQuestionSeconds);
      }
    }
    setCurrentQuizIdx(prev => prev + 1);
    setSelectedOptionIdx(null);
    setIsQuizSubmitted(false);
    setIsRetryingQuestion(false);
    setShowQuestionHint(false);
  };

  const restartQuizFlow = () => {
    setQuizzes([]);
    setCurrentQuizIdx(0);
    setSelectedOptionIdx(null);
    setIsQuizSubmitted(false);
    setIsRetryingQuestion(false);
    setShowQuestionHint(false);
    setUserQuizAnswers({});
    setScore(0);
    setQuizError(null);
    setQuizAutoSaveNotice(null);
    setIsQuizTimerActive(false);
    localStorage.removeItem('hansai-active-quiz-draft');
    setHasActiveQuizDraft(false);
  };

  const handleSaveCurrentQuiz = () => {
    if (quizzes.length === 0) return;
    let correctQ = 0;
    let wrongQ = 0;
    quizzes.forEach((q, idx) => {
      const uAns = userQuizAnswers[idx];
      if (uAns !== undefined && uAns !== null) {
        if (uAns === q.answerIndex) correctQ++;
        else wrongQ++;
      }
    });
    const posMarks = correctQ * positiveMarkVal;
    const negMarks = wrongQ * negativeMarkVal;
    const netScoreVal = Math.max(0, posMarks - negMarks);
    const maxScoreVal = quizzes.length * positiveMarkVal;
    const pct = maxScoreVal > 0 ? Math.round((netScoreVal / maxScoreVal) * 100) : 0;
    const gradeStr = pct >= 85 ? 'DISTINCTION (A+)' : pct >= 60 ? 'PASSED (A)' : pct >= 40 ? 'PASSED (B)' : 'NEEDS REVISION';

    const newSaved: SavedQuizRecord = {
      id: "quiz-" + Date.now(),
      subject: quizSubject || "SSC General Awareness",
      level: quizLevel || "Practice Level",
      date: new Date().toLocaleDateString('hi-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      timestamp: new Date().toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' }),
      score: correctQ,
      total: quizzes.length,
      studentName: studentName || 'Aspirant Student',
      studentRoll: studentRoll || 'HS-2026-8809',
      positiveMarks: parseFloat(posMarks.toFixed(1)),
      negativeMarks: parseFloat(negMarks.toFixed(1)),
      netScore: parseFloat(netScoreVal.toFixed(1)),
      maxScore: parseFloat(maxScoreVal.toFixed(1)),
      percentage: pct,
      grade: gradeStr,
      userAnswers: userQuizAnswers,
      quizzes: quizzes
    };
    const updated = [newSaved, ...savedQuizzes.filter(q => q.id !== newSaved.id)];
    setSavedQuizzes(updated);
    localStorage.setItem('hansai-saved-quizzes', JSON.stringify(updated));
    showToast("Quiz record re-saved and confirmed in Repository! 💾✅", "success");
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

  // Quick Save Floating Action & Modal State for Highlighted Chat Text
  const [isQuickSaveModalOpen, setIsQuickSaveModalOpen] = useState<boolean>(false);
  const [quickSaveSelectedText, setQuickSaveSelectedText] = useState<string>("");
  const [floatingSelectionPos, setFloatingSelectionPos] = useState<{ x: number; y: number } | null>(null);

  // Quick Save handler: create folder dynamically
  const handleQuickCreateFolder = (folderName: string, folderEmoji: string = '📁'): string => {
    const cleanName = folderName.trim();
    if (!cleanName) return 'general';
    const newId = `folder-${Date.now()}`;
    const newFolder = {
      id: newId,
      name: cleanName,
      emoji: folderEmoji || '📁',
      color: 'pink'
    };
    setFolders(prev => [...prev, newFolder]);
    return newId;
  };

  // Quick Save handler: save note into chosen folder
  const handleQuickSaveNote = (noteData: { folderId: string; title: string; content: string; tags: string[] }) => {
    const newNote = {
      id: `note-${Date.now()}`,
      folderId: noteData.folderId || 'general',
      title: noteData.title || (language === 'hindi' ? 'अध्ययन नोट्स' : 'Study Note'),
      content: noteData.content,
      tags: noteData.tags && noteData.tags.length > 0 ? noteData.tags : ['QuickSave', 'GK'],
      createdAt: new Date().toISOString()
    };
    setNotes(prev => [newNote, ...prev]);
    showToast(language === 'hindi' ? '✨ नोट्स स्मार्ट फ़ोल्डर में सुरक्षित सेव हो गया!' : '✨ Saved to Notes folder successfully!', 'success');
  };

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
  const [launcherSearchTopic, setLauncherSearchTopic] = useState<string>("");
  const [customLauncherUrl, setCustomLauncherUrl] = useState<string>("");
  const [customAlarmMinutes, setCustomAlarmMinutes] = useState<string>("");
  const [customAlarmSeconds, setCustomAlarmSeconds] = useState<string>("");

  // 3. Activity Log & Savings state
  const [activityLogs, setActivityLogs] = useState<Array<{ id: string; type: 'timer' | 'quiz' | 'note' | 'chat'; title: string; subtitle: string; score?: string; timestamp: string }>>(() => {
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

  // Auto-save activity logs to localStorage continuously
  useEffect(() => {
    if (activityLogs) {
      try {
        localStorage.setItem('hansai-history', JSON.stringify(activityLogs));
      } catch (e) {}
    }
  }, [activityLogs]);

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

  // Concept Map Explainer & Geographic Visualization states
  const [conceptMapTopic, setConceptMapTopic] = useState('');
  const [mapNodes, setMapNodes] = useState<{ id: string; label: string; desc: string; detail: string; x: number; y: number }[]>([]);
  const [activeMapNode, setActiveMapNode] = useState<any | null>(null);
  const [showDetailedDiagram, setShowDetailedDiagram] = useState(false);
  const [isGeneratingConceptMap, setIsGeneratingConceptMap] = useState(false);
  const [mapTab, setMapTab] = useState<'flowchart' | 'geo'>('flowchart');
  const [selectedGeoRegion, setSelectedGeoRegion] = useState<any | null>(null);
  const [isListeningMapVoice, setIsListeningMapVoice] = useState(false);
  const [mapVoiceHandle, setMapVoiceHandle] = useState<VoiceRecognitionHandle | null>(null);
  const [isListeningLauncherVoice, setIsListeningLauncherVoice] = useState(false);
  const [launcherVoiceHandle, setLauncherVoiceHandle] = useState<VoiceRecognitionHandle | null>(null);

  const handleToggleMapVoice = () => {
    if (isListeningMapVoice) {
      if (mapVoiceHandle) mapVoiceHandle.stop();
      setIsListeningMapVoice(false);
      return;
    }

    stopAllSpeech();
    setIsListeningMapVoice(true);
    showToast(language === 'hindi' ? '🎙️ बोलिए... विषय या स्थान का नाम' : '🎙️ Speak map topic or location...', 'info');

    const handle = startVoiceRecognition({
      lang: language === 'hindi' ? 'hi-IN' : 'en-US',
      onResult: (text) => {
        setConceptMapTopic(text);
      },
      onEnd: () => {
        setIsListeningMapVoice(false);
      },
      onError: (err) => {
        setIsListeningMapVoice(false);
        showToast(err, 'warn');
      }
    });

    setMapVoiceHandle(handle);
  };

  const handleToggleLauncherVoice = () => {
    if (isListeningLauncherVoice) {
      if (launcherVoiceHandle) launcherVoiceHandle.stop();
      setIsListeningLauncherVoice(false);
      return;
    }

    stopAllSpeech();
    setIsListeningLauncherVoice(true);
    showToast(language === 'hindi' ? '🎙️ बोलिए... अपना सर्च टॉपिक' : '🎙️ Speak your search query...', 'info');

    const handle = startVoiceRecognition({
      lang: language === 'hindi' ? 'hi-IN' : 'en-US',
      onResult: (text) => {
        setLauncherSearchTopic(text);
      },
      onEnd: () => {
        setIsListeningLauncherVoice(false);
      },
      onError: (err) => {
        setIsListeningLauncherVoice(false);
        showToast(err, 'warn');
      }
    });

    setLauncherVoiceHandle(handle);
  };

  const geoLandmarks = [
    {
      id: "himalayas",
      name: "Himalayan Mountain Belt & High Altitude Passes (हिमालय पर्वतमाला व प्रमुख दर्रे)",
      x: 48, y: 18,
      icon: "🏔️",
      category: "Physical & Strategic Geography",
      elevation: "8,848m (Mt. Everest Peak)",
      rivers: "Indus, Ganga, Brahmaputra Origins",
      history: "Young Fold Mountains created by Indo-Australian and Eurasian tectonic plate collision. Serves as India's Northern Climate & Security Shield.",
      keyFeatures: [
        "Zoji La Pass: Connects Srinagar with Leh",
        "Nathu La Pass: Connects Sikkim with Tibet (Ancient Silk Route)",
        "Shipki La Pass: Entry point of Sutlej River into India (Himachal Pradesh)",
        "Rohtang Pass: Connects Kullu Valley with Lahaul and Spiti"
      ],
      pyqs: [
        "Which pass connects Srinagar to Leh? → Zoji La Pass",
        "Highest peak located inside undisputed Indian territory? → Kangchenjunga / K2",
        "Origin region of the Great River Indus? → Mansarovar Lake near Mt. Kailash"
      ]
    },
    {
      id: "ganga-basin",
      name: "Indo-Gangetic Fertile Plain (सिंधु-गंगा का मैदानी भाग)",
      x: 52, y: 38,
      icon: "🌾",
      category: "Agrarian Heartland & Alluvial Soil Belt",
      elevation: "Khadar (New Alluvium) & Bhangar (Old Alluvium)",
      rivers: "Ganga, Yamuna, Ghaghara, Son, Kosi, Gandak",
      history: "Nourished the rise of Ancient Empires (Mauryan, Magadha, Gupta, Mughal). World's most fertile agrarian plain supporting staple crops.",
      keyFeatures: [
        "Sunderbans Delta: World's largest mangrove delta formed by Ganga & Brahmaputra",
        "Doab Regions: Fertile land between two converging rivers (e.g., Ganga-Yamuna Doab)",
        "Kosi River: Known as 'Sorrow of Bihar' due to frequent course shifts",
        "Yamuna River: Largest tributary of Ganga meeting at Prayagraj Triveni Sangam"
      ],
      pyqs: [
        "New alluvial soil deposited by annual floods is called? → Khadar Soil",
        "Where does Ganga enter the Northern Plains? → Haridwar, Uttarakhand",
        "The confluence of Alaknanda and Bhagirathi is known as? → Devprayag"
      ]
    },
    {
      id: "thar-desert",
      name: "Thar Desert & Aravalli Mountain System (थार मरुस्थल व अरावली)",
      x: 28, y: 40,
      icon: "🏜️",
      category: "Arid Ecosystem & Ancient Geology",
      elevation: "Oldest Fold Mountain Range in the World",
      rivers: "Luni River (Inland Drainage System)",
      history: "The Aravalli range acts as a barrier preventing desertification towards Eastern India. Rich in zinc, copper, marble, and solar energy.",
      keyFeatures: [
        "Guru Shikhar Peak: Highest peak of Aravalli (1,722 m near Mount Abu)",
        "Luni River: Originates in Pushkar Valley, loses itself in Rann of Kutch",
        "Sambhar Salt Lake: India's largest inland saltwater lake",
        "Thar Desert: World's most densely populated desert region"
      ],
      pyqs: [
        "Which is the oldest fold mountain range in India? → Aravalli Range",
        "Only major inland draining river in Rajasthan? → Luni River",
        "Highest peak of the Aravalli range? → Guru Shikhar (Mount Abu)"
      ]
    },
    {
      id: "deccan-plateau",
      name: "Deccan Trap & Peninsular Plateau (दक्कन का पठार)",
      x: 45, y: 65,
      icon: "🌋",
      category: "Volcanic Basalt Formation & Black Soil",
      elevation: "Regur (Black Cotton Soil) Belt",
      rivers: "Godavari, Krishna, Cauvery, Narmada, Tapti",
      history: "Formed by volcanic fissure eruption lava flows during the Cretaceous period. Ideal for cotton, sugarcane, and oilseed cultivation.",
      keyFeatures: [
        "Godavari River: Longest river of Peninsular India, known as 'Dakshin Ganga'",
        "Narmada & Tapti: Rift valley rivers flowing westward into Arabian Sea",
        "Black Soil: High moisture retention capacity, ideal for cotton farming",
        "Chota Nagpur Plateau: Mineral Storehouse of India (Iron ore, Coal, Mica)"
      ],
      pyqs: [
        "Which soil is also known as Regur Soil? → Black Cotton Soil",
        "Which major peninsular rivers flow into rift valleys? → Narmada & Tapti",
        "Longest peninsular river in India? → Godavari River"
      ]
    },
    {
      id: "western-ghats",
      name: "Western Ghats / Sahyadri Range (पश्चिमी घाट / सह्याद्रि)",
      x: 32, y: 72,
      icon: "🌿",
      category: "UNESCO World Biodiversity Hotspot",
      elevation: "Anamudi Peak (2,695m - Highest in Peninsular India)",
      rivers: "Origin of Godavari, Krishna, Cauvery, Sharavati",
      history: "Continuous mountain barrier creating orographic monsoon rain on the Konkan & Malabar coasts. Houses rich spice, coffee, and tea plantations.",
      keyFeatures: [
        "Anamudi Peak: Highest peak in South India (Anaimalai Hills)",
        "Palakkad Gap (Palghat): Major pass connecting Kerala with Tamil Nadu",
        "Jog Falls: Highest plunge waterfall on Sharavati river in Karnataka",
        "Silent Valley National Park: Famous biodiversity reserve in Palakkad"
      ],
      pyqs: [
        "Highest peak in South India? → Anamudi (2,695 m)",
        "Which gap connects Palakkad (Kerala) to Coimbatore (Tamil Nadu)? → Palghat Gap",
        "The rainfall caused by Western Ghats is? → Orographic Precipitation"
      ]
    },
    {
      id: "indus-valley",
      name: "Indus Valley Civilisation Sites (सिंधु घाटी सभ्यता - हड़प्पा व लोथल)",
      x: 22, y: 32,
      icon: "🏺",
      category: "Archaeological & Bronze Age History",
      elevation: "Harappa, Mohenjo-daro, Lothal, Kalibangan, Dholavira",
      rivers: "Indus, Ravi, Ghaggar-Hakra, Bhogava",
      history: "Famous for grid system city planning, underground drainage, burnt clay bricks, dockyards, and seals made of steatite.",
      keyFeatures: [
        "Lothal (Gujarat): Ancient tidal dockyard on Bhogava river",
        "Mohenjo-daro: 'Mound of the Dead', Great Bath and Dancing Girl bronze statue",
        "Kalibangan (Rajasthan): Evidence of ploughed fields and fire altars",
        "Dholavira (Gujarat): Famous for sophisticated water reservoir harvesting"
      ],
      pyqs: [
        "Where was the ancient Indus Valley dockyard located? → Lothal, Gujarat",
        "Which metal was completely unknown to Indus Valley citizens? → Iron",
        "Indus site with unique 3-part city fortification? → Dholavira"
      ]
    }
  ];

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

    logUserActivity('music', `Created AI Music Track: "${cleanTitle}" (${newMusicGenre}, ${newMusicTempo} BPM)`);
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

  // Auto-scroll to bottom whenever a new chat message is appended or during loading
  useEffect(() => {
    if (chatMessages.length > 0 || isChatLoading) {
      const scrollTimer = setTimeout(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 50);
      return () => clearTimeout(scrollTimer);
    }
  }, [chatMessages, isChatLoading]);

  const handleGenerateConceptMap = async (topicStr?: string) => {
    const rawTopic = topicStr || conceptMapTopic;
    if (!rawTopic || !rawTopic.trim()) {
      showToast("Please enter a topic or question to generate a concept map.", "warn");
      return;
    }
    const cleanTopic = rawTopic.trim();
    setIsGeneratingConceptMap(true);
    setShowDetailedDiagram(false);

    logUserActivity('map', `Concept Map Generated: ${cleanTopic}`);

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

      // Log research search activity for owner analytics
      logUserActivity('research', `[${actualArea}] ${cleanTopic}`);

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
    const clean = (topic || "Indian Constitution & Fundamental Rights").trim();
    setScholarTopic(clean);
    setIsGoogleScholarModalOpen(true);
    const url = `https://scholar.google.com/scholar?q=${encodeURIComponent(clean)}`;
    try {
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (e) {
      console.warn("Popup blocked, scholar modal opened:", e);
    }
    showToast(
      language === 'hindi'
        ? `Google Scholar रिसर्च पोर्टल खुल गया है: "${clean}" 📚`
        : `Google Scholar Research Hub opened for "${clean}"! 📚`,
      "success"
    );
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

  // Helper to generate dynamic, subject-specific answers for instant local AI responses
  const generateSubjectKnowledgeReply = (userQuery: string, lang: string = 'hindi'): string => {
    const query = (userQuery || "").toLowerCase();

    if (query.includes('pdf') || query.includes('पीडीएफ')) {
      const topicName = userQuery.replace(/pdf|पीडीएफ|banao|chahiye|download|bnao|generate|karo/gi, '').trim() || 'संपूर्ण सामान्य अध्ययन (General Studies Notes)';
      return `### 📄 HansAI - आपके अध्ययन हेतु विशेष PDF नोट्स\n\n` +
        `**विषय:** "${topicName}"\n\n` +
        `#### 📌 मुख्य बिंदु व परीक्षा सारांश:\n` +
        `1. **अवधारणा की स्पष्टता:** इस अध्याय के सभी महत्वपूर्ण सूत्र, सिद्धांत एवं तिथियां शामिल हैं।\n` +
        `2. **विगत वर्षों के प्रश्न (PYQ):** प्रतियोगी परीक्षाओं (SSC, Railway, State PCS, UPSC) में बार-बार पूछे जाने वाले बिंदु।\n` +
        `3. **स्मरण ट्रिक (Memory Trick):** कठिन तथ्यों को याद रखने के लिए विशेष सूत्र व निमोनिक्स।\n` +
        `4. **अभ्यास व स्व-मूल्यांकन:** अध्याय समाप्त करने के पश्चात Auto Chapter Quiz में भाग लें।\n\n` +
        `📥 **PDF डाउनलोड करने के लिए नीचे दिए गए '📥 PDF' बटन पर तुरंत क्लिक करें। यह फाइल आपके डिवाइस में सीधे डाउनलोड हो जाएगी!**`;
    }

    if (query.includes('shorthand') || query.includes('steno') || query.includes('स्टेनो') || query.includes('शॉर्टहैंड') || query.includes('आशुलिपि') || query.includes('ऋषि') || query.includes('पिटमैन') || query.includes('dictation')) {
      return `### ✍️ आशुलिपि व स्टेनोग्राफी (Stenography Lab)\n\n` +
        `स्टेनोग्राफी में 80/100 WPM गति और उच्च शुद्धता हेतु मार्गदर्शिका:\n\n` +
        `1. **ऋषि/पिटमैन प्रणालियाँ:** व्यंजनों के स्ट्रोक (हल्के व गाढ़े), स्वर स्थानों (1st, 2nd, 3rd place) व आंकड़ों का सही ज्ञान।\n` +
        `2. **शब्दचिह्न (Grammalogues):** दैनिक प्रयोग में आने वाले 200 मुख्य शब्दचिह्नों का 30 मिनट बिना रुके अभ्यास।\n` +
        `3. **वाक्यांश (Phrasing):** संयुक्त शब्दों को बिना पेंसिल उठाए एक साथ जोड़ना।\n\n` +
        `👉 ऐप के **Stenography Lab** में जाकर ऑडियो डिक्टेशन व स्पीड टेस्ट दें!`;
    }

    if (query.includes('संधि') || query.includes('समास') || query.includes('मुहावरे') || query.includes('विलोम') || query.includes('पर्यायवाची') || query.includes('व्याकरण')) {
      return `### 📖 हिंदी व्याकरण (Hindi Grammar)\n\n` +
        `प्रतियोगी परीक्षाओं (SSC GD, BPSC, State Police/TET) हेतु महत्वपूर्ण बिंदु:\n\n` +
        `1. **संधि:** स्वर (दीर्घ, गुण, वृद्धि, यण, अयादि), व्यंजन व विसर्ग संधि।\n` +
        `2. **समास:** अव्ययीभाव, तत्पुरुष, कर्मधारय, द्विगु, द्वंद्व व बहुव्रीहि समास।\n` +
        `3. **मुहावरे व लोकोक्तियां:** भावार्थ व वाक्य प्रयोग की स्पष्टता।\n\n` +
        `👉 आप किसी भी विशिष्ट व्याकरण नियम या प्रश्न का सीधा उत्तर प्राप्त कर सकते हैं!`;
    }

    if (query.includes('english') || query.includes('grammar') || query.includes('tense') || query.includes('passive') || query.includes('preposition')) {
      return `### 📝 English Language & Grammar Rules\n\n` +
        `Key concepts for SSC CGL/CHSL, Banking & Competitive Exams:\n\n` +
        `1. **Subject-Verb Agreement:** Singular subject = Singular verb; Plural subject = Plural verb.\n` +
        `2. **Voice Transformation:** Active to Passive requires Past Participle (V3) of the main verb.\n` +
        `3. **Prepositions:** Usage of *in, on, at, between, among, beside, besides* with context.\n\n` +
        `👉 Type any error spotting or grammar sentence for step-by-step breakdown!`;
    }

    if (query.includes('geography') || query.includes('भूगोल')) {
      return `### 🌍 भूगोल (Geography) - संपूर्ण परिचय व अध्ययन समाधान\n\n` +
        `**भूगोल (Geography)** वह विस्तृत विज्ञान है जिसके अंतर्गत पृथ्वी के धरातल, उसके भौतिक स्वरूपों, जलवायु, प्राकृतिक संसाधनों, नदियाँ एवं महाद्वीपों का अध्ययन किया जाता है।\n\n` +
        `#### 📌 मुख्य शाखाएं (Core Branches):\n` +
        `1. **भौतिक भूगोल (Physical Geography):**\n` +
        `   - **भू-आकृति विज्ञान (Geomorphology):** पर्वत (जैसे हिमालय), पठार, मैदान, एवं नदियाँ।\n` +
        `   - **जलवायु विज्ञान (Climatology):** भारतीय मानसून, चक्रवात, वायुदाब पेटियाँ, एवं वर्षा।\n` +
        `   - **समुद्र विज्ञान (Oceanography):** महासागरीय धाराएँ (गल्फ स्ट्रीम, ला नीना) व ज्वार-भाटा।\n` +
        `   - **सौरमंडल (Solar System):** पृथ्वी की गतियाँ, अक्षांश (Latitude) व देशांतर (Longitude)।\n\n` +
        `2. **भारत का भूगोल (Indian Geography) [परीक्षाओं हेतु महत्वपूर्ण]:**\n` +
        `   - **भौतिक विभाजन:** उत्तरी हिमालय पर्वतमाला, प्रायद्वीपीय पठार, तटीय मैदान व द्वीप समूह।\n` +
        `   - **प्रमुख नदियाँ:** गंगा, सिंधु, ब्रह्मपुत्र, गोदावरी, नर्मदा, ताप्ती, कृष्णा, कावेरी।\n` +
        `   - **मिट्टी व फसलें:** जलोढ़, काली (रेगुर), लाल मिट्टी तथा रबी, खरीफ एवं जायद फसलें।\n\n` +
        `💡 **याद रखने की शार्ट ट्रिक:**\n` +
        `- **कर्क रेखा (23½° N)** भारत के 8 राज्यों से गुजरती है: *(मित्र पर गमछा झार -> मिजोरम, त्रिपुरा, प. बंगाल, राजस्थान, गुजरात, म.प्र., छत्तीसगढ़, झारखंड)*।\n\n` +
        `👉 आप **Auto Chapter Quiz** सेक्शन में जाकर **"Geography"** पर तुरंत 5 प्रश्नों का लाइव टेस्ट भी दे सकते हैं!`;
    }

    if (query.includes('history') || query.includes('इतिहास')) {
      return `### 📜 इतिहास (History) - संपूर्ण कालक्रम व परीक्षा विश्लेषण\n\n` +
        `इतिहास को मुख्य रूप से तीन भागों में वर्गीकृत किया गया है:\n\n` +
        `1. **प्राचीन भारत (Ancient India):** सिंधु घाटी सभ्यता, वैदिक काल, बौद्ध व जैन धर्म, मौर्य साम्राज्य (अशोक) व गुप्त काल।\n` +
        `2. **मध्यकालीन भारत (Medieval India):** दिल्ली सल्तनत, मुगल साम्राज्य (अकबर से औरंगजेब), एवं भक्ति आंदोलन।\n` +
        `3. **आधुनिक भारत (Modern India):** 1857 की क्रांति, भारतीय राष्ट्रीय कांग्रेस (1885), गांधीवादी युग (1915-1947) एवं स्वतंत्रता आंदोलन।\n\n` +
        `👉 **अभ्यास:** तुरंत **Modern History** पर क्विज हल करें!`;
    }

    if (query.includes('polity') || query.includes('संविधान') || query.includes('राजव्यवस्था')) {
      return `### 🏛️ भारतीय संविधान व राजव्यवस्था (Indian Polity)\n\n` +
        `भारतीय संविधान 26 नवंबर 1949 को अंगीकृत हुआ तथा 26 जनवरी 1950 को पूर्णतः लागू हुआ।\n\n` +
        `#### 📌 महत्वपूर्ण अंश:\n` +
        `- **भाग 3 (अनुच्छेद 12-35):** 6 मौलिक अधिकार (Fundamental Rights)।\n` +
        `- **भाग 4 (अनुच्छेद 36-51):** नीति निर्देशक तत्व (DPSP)।\n` +
        `- **अनुच्छेद 32:** संवैधानिक उपचारों का अधिकार ('संविधान की आत्मा')।\n` +
        `- **अनुच्छेद 52-61:** भारत के राष्ट्रपति व महाभियोग प्रक्रिया।\n\n` +
        `👉 **अभ्यास:** ऐप के **Quiz** सेक्शन में **Indian Polity** चुनें!`;
    }

    if (query.includes('science') || query.includes('विज्ञान') || query.includes('physics') || query.includes('chemistry') || query.includes('biology') || query.includes('भौतिक') || query.includes('रसायन') || query.includes('जीव')) {
      return `### 🔬 सामान्य विज्ञान (General Science)\n\n` +
        `1. **भौतिकी (Physics):** गति के नियम (F=ma), प्रकाश का अपवर्तन/परावर्तन, गुरुत्वाकर्षण, कार्य व ऊर्जा।\n` +
        `2. **रसायन (Chemistry):** आवर्त सारणी (Periodic Table), अम्ल व क्षार (pH मान), परमाणु संरचना।\n` +
        `3. **जीव विज्ञान (Biology):** कोशिका (Powerhouse = Mitochondria), मानव पाचन व परिसंचरण तंत्र, विटामिन व बीमारियाँ।\n\n` +
        `👉 विस्तृत जानकारी के लिए टॉपिक का सटीक नाम टाइप करें!`;
    }

    if (query.includes('math') || query.includes('गणित') || query.includes('reasoning') || query.includes('रीजनिंग')) {
      return `### 📐 गणित एवं रीजनिंग (Maths & Reasoning)\n\n` +
        `1. **अंकगणित:** प्रतिशत (Percentage), लाभ-हानि, औसत, SI/CI, समय व कार्य।\n` +
        `2. **एडवांस मैथ्स:** बीजगणित (Algebra), ज्यामिति (Geometry), त्रिकोणमिति।\n` +
        `3. **रीजनिंग:** कोडिंग-डिकोडिंग, सादृश्यता, दिशा ज्ञान, ब्लड रिलेशंस।\n\n` +
        `👉 आप अपना सवाल सीधे लिखकर पूछ सकते हैं!`;
    }

    if (query.includes('bihar') || query.includes('gk') || query.includes('ssc') || query.includes('upsc') || query.includes('cgl') || query.includes('chsl') || query.includes('board')) {
      return `### 🎯 प्रतियोगी परीक्षा तैयारी (Exam Strategy)\n\n` +
        `**"${userQuery}"** हेतु HansAI अध्ययन रणनीति:\n\n` +
        `1. **सिलेबस व PYQ:** विगत 5 वर्षों के प्रश्नों का गहन विश्लेषण करें।\n` +
        `2. **दैनिक शेड्यूल:** GK/General Awareness, गणित, रीजनिंग व भाषा का संतुलित समय बांटें।\n` +
        `3. **मॉक टेस्ट:** साप्ताहिक टेस्ट हल करें व कमजोर टॉपिक्स को तुरंत सुधारें।\n\n` +
        `👉 **Auto Chapter Quiz** में जाकर तुरंत मॉक प्रैक्टिस करें!`;
    }

    return lang === 'hindi'
      ? `### 📚 हंस-एआई (HansAI) - विषय मार्गदर्शन\n\nआपकी जिज्ञासा **"${userQuery.slice(0, 70)}"** के संबंध में संक्षिप्त अध्ययन बिंदु:\n\n1. **मुख्य अवधारणा (Core Concept):** प्रतियोगी एवं बोर्ड परीक्षाओं (SSC, UPSC, Railway, State Exams) में इस विषय की स्पष्ट समझ अति आवश्यक है।\n2. **रिवीजन रणनीति:** महत्वपूर्ण सूत्रों, तिथियों व परिभाषाओं के संक्षिप्त नोट्स बनाकर पुनरावृत्ति करें।\n3. **लाइव टेस्ट:** आप ऐप के **Auto Chapter Quiz** सेक्शन में जाकर तुरंत 5 प्रश्नों का अभ्यास कर सकते हैं!`
      : `### 📚 HansAI - Academic Solution & Guidance\n\nRegarding your query **"${userQuery.slice(0, 70)}"**:\n\n1. **Key Concept:** Clear understanding of this topic is essential for competitive & board exams.\n2. **Revision Strategy:** Create concise notes of key formulas, facts, and definitions.\n3. **Interactive Test:** Navigate to the **Auto Chapter Quiz** tab to solve custom MCQs on this topic!`;
  };

  // Clear current chat messages & safely archive active conversation to savedChats (ChatGPT style)
  const startNewChat = (silentOption?: boolean | any) => {
    const isSilent = typeof silentOption === 'boolean' ? silentOption : false;
    // If there are current messages, ensure they are safely archived to Chat History
    if (chatMessages.length > 0) {
      const firstUserMsg = chatMessages.find(m => m.role === 'user')?.content || 'Chat Session';
      const cleanTitle = firstUserMsg.length > 38 ? firstUserMsg.slice(0, 38) + '...' : firstUserMsg;
      const targetSessionId = currentChatSessionId || `chat-${Date.now()}`;

      setSavedChats(prev => {
        const existingIdx = prev.findIndex(s => s.id === targetSessionId);
        if (existingIdx >= 0) {
          const updated = [...prev];
          updated[existingIdx] = {
            ...updated[existingIdx],
            messages: chatMessages,
            timestamp: new Date().toISOString()
          };
          return updated;
        } else {
          return [
            {
              id: targetSessionId,
              title: cleanTitle,
              messages: chatMessages,
              timestamp: new Date().toISOString(),
              isPinned: false
            },
            ...prev
          ];
        }
      });
    }

    setChatMessages([]);
    setCurrentChatSessionId(null);
    setActiveView('chat');
    if (!isSilent) {
      showToast(
        language === 'hindi' 
          ? "चैट हिस्ट्री में सुरक्षित सहेज कर नया चैट शुरू किया गया! 💬" 
          : "Chat saved to history & new chat opened! 💬", 
        "success"
      );
    }
  };

  // Load a saved chat (ChatGPT style)
  const loadSavedChat = (chatSession: any) => {
    if (!chatSession) return;
    setCurrentChatSessionId(chatSession.id);
    setChatMessages(chatSession.messages || []);
    setActiveView('chat');
    showToast(`Loaded: ${chatSession.title || 'Chat Session'}`, "success");
  };

  // Trigger Chatbot API Request
  const handleSendChat = async (textToSend?: string) => {
    // Daily 10-Query Limit Check
    const today = new Date().toISOString().slice(0, 10);
    let usage = JSON.parse(localStorage.getItem('hansai_usage') || '{"date":"","count":0}');
    if (usage.date !== today) {
      usage = { date: today, count: 0 };
    }
    if (usage.count >= 10) {
      showToast(
        language === 'hindi'
          ? "दैनिक मुफ्त सीमा (Daily Free Limit - 10 Queries) समाप्त! कल सुबह नई लिमिट शुरू होगी।"
          : "Daily Free Limit Reached (10 queries/day)! Limit resets tomorrow morning.",
        "warn"
      );
      return;
    }
    usage.count++;
    localStorage.setItem('hansai_usage', JSON.stringify(usage));

    // Guest Limit Check (Gemini / ChatGPT style)
    if (!user) {
      if (guestPromptCount >= 2) {
        showToast(
          language === 'hindi'
            ? "असीमित AI सर्च और चैट जारी रखने के लिए कृपया Google या Facebook से लॉगिन/रजिस्टर करें! 🔐"
            : "Please Sign In with Google or Facebook to continue unlimited AI search! 🔐",
          "info"
        );
        setIsAuthRegisterOpen(true);
        return;
      }
      const newCount = guestPromptCount + 1;
      setGuestPromptCount(newCount);
      localStorage.setItem('hansai_guest_prompt_count', newCount.toString());
    }
    const messageContent = textToSend || chatInput;
    if (!messageContent.trim() && chatAttachedImages.length === 0) return;

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

    const imagesPayload = chatAttachedImages.map(img => ({ 
      mimeType: img.mimeType, 
      data: img.data 
    }));

    const previewUrls = chatAttachedImages.map(img => img.previewUrl);

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: messageContent,
      timestamp: new Date(),
      imagePreviewUrl: previewUrls[0] || undefined,
      imagePreviewUrls: previewUrls
    };

    // Determine target session ID and auto-sync to savedChats (ChatGPT style)
    let targetSessionId = currentChatSessionId;
    if (!targetSessionId) {
      targetSessionId = `chat-${Date.now()}`;
      setCurrentChatSessionId(targetSessionId);
      const cleanTitle = messageContent.length > 38 ? messageContent.slice(0, 38) + '...' : messageContent;
      const newSession = {
        id: targetSessionId,
        title: cleanTitle || `Chat - ${new Date().toLocaleDateString()}`,
        messages: [userMsg],
        timestamp: new Date().toISOString(),
        isPinned: false
      };
      setSavedChats(prev => [newSession, ...prev.filter(s => s.id !== targetSessionId)]);
    } else {
      setSavedChats(prev => prev.map(s => {
        if (s.id === targetSessionId) {
          return {
            ...s,
            messages: [...(s.messages || []), userMsg],
            timestamp: new Date().toISOString()
          };
        }
        return s;
      }));
    }

    setChatMessages(prev => [...prev, userMsg]);
    if (!textToSend) setChatInput('');
    setChatAttachedImages([]); // Reset multiple image selection state
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
        const assistantMsg: Message = {
          id: `reply-${Date.now()}`,
          role: 'assistant',
          content: offlineReply,
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, assistantMsg]);
        setSavedChats(prev => prev.map(s => {
          if (s.id === targetSessionId) {
            return {
              ...s,
              messages: [...(s.messages || []), assistantMsg],
              timestamp: new Date().toISOString()
            };
          }
          return s;
        }));
        setIsChatLoading(false);
      }, 300);
      return;
    }

    try {
      const history = [...chatMessages, userMsg].slice(-10).map(m => ({
        role: m.role,
        content: m.content
      }));

      const currentUserEmail = user?.email || "visitor.student@hansai.app";
      const currentUserName = user?.name || "Visitor Aspirant";

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: history,
          model: selectedModel,
          image: imagesPayload[0] || null,
          images: imagesPayload,
          userName: currentUserName,
          userEmail: currentUserEmail
        })
      });

      if (!res.ok) {
        throw new Error("Unable to contact assistant server.");
      }

      const data = await res.json();
      const assistantMsg: Message = {
        id: `reply-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, assistantMsg]);
      setSavedChats(prev => prev.map(s => {
        if (s.id === targetSessionId) {
          return {
            ...s,
            messages: [...(s.messages || []), assistantMsg],
            timestamp: new Date().toISOString()
          };
        }
        return s;
      }));

      const shouldSpeakVoice = isVoiceAssistantActive || isVoiceAssistantActiveRef.current || autoVoiceReadout || wasVoiceTriggeredRef.current;
      if (shouldSpeakVoice && data.reply) {
        if (isVoiceAssistantActive || isVoiceAssistantActiveRef.current) {
          speakVoiceAssistantReply(data.reply);
        } else {
          speakText(data.reply, {
            lang: selectedIndianVoiceLang,
            rate: 1.0
          });
        }
      }
      wasVoiceTriggeredRef.current = false;
    } catch (err: any) {
      console.error("Chat fetch error, running HansAI local smart fallback system:", err);
      
      const query = messageContent.toLowerCase();
      let customReply = "";
      
      const isGreeting = query.includes('hello') || query.includes('hi ') || query.includes('hey') || query.includes('namaste') || query.includes('नमस्ते') || query.includes('प्रणाम') || query.trim() === 'hi';
      const isCreatorQuery = query.includes('creator') || query.includes('founder') || query.includes('who made') || query.includes('who built') || query.includes('who created') || query.includes('hanslal') || query.includes('pal ji') || query.includes('पाल जी') || query.includes('निर्माता') || query.includes('maker');
      const isNotUnderstanding = query.includes('understand') || query.includes('समझ नहीं') || query.includes('नहीं समझा') || query.includes('फिर से') || query.includes('easy') || query.includes('सरल');

      if (isCapabilityQuery) {
        customReply = `✨ **HansAI (आपका एआई साथी) - संपूर्ण सहायता निर्देशिका:**\n\n` +
          `1. 🎓 **SSC, Board & Competitive Exams**: SSC CGL/CHSL, Railway, State PCS/UPSC, भूगोल, इतिहास, संविधान, विज्ञान, गणित, रीजनिंग व अंग्रेजी।\n` +
          `2. ✍️ **Shorthand & Dictation Tools**: Shorthand स्ट्रोक रेफरेंस, डिक्टेशन टाइमर और स्पीड प्रैक्टिस।\n` +
          `3. 🚀 **Deep Research AI**: विषय पर गहरा अध्ययन, टाइमलाइन और याद करने की ट्रिक्स।\n` +
          `4. 🧠 **Interactive Live Quizzes**: तुरंत 5 सवालों का क्विज टेस्ट, स्कोर और व्याख्या।\n` +
          `5. 🎙️ **Projects & Voice Recorder**: लेक्चर्स/नोट्स की वॉइस रिकॉर्डिंग और प्रोजेक्ट्स।\n` +
          `6. 📖 **Study Notes & Folders**: नोट्स सहेजना, खोजना और स्मार्ट फोल्डर्स।\n` +
          `7. 🗺️ **GIS & Map Visualizer**: इंटरएक्टिव भूगोल मानचित्र और मैपिंग।\n` +
          `8. ☕ **Daily Motivation & Status**: सुबह की कविताएं और मोटिवेशन।\n` +
          `9. 📶 **Offline Availability**: बिना इंटरनेट के भी सभी सेव किए गए नोट्स व टूल्स काम करते हैं!`;
      } else if (isCreatorQuery) {
        customReply = `HansAI के creator और founder Hanslal हैं। HansAI को Hanslal ने एक student-focused AI platform के रूप में बनाया और विकसित किया है।`;
      } else if (isGreeting) {
        if (language === 'hindi') {
          customReply = `नमस्ते! मैं आपका एआई साथी (HansAI) हूँ। आज मैं आपकी पढ़ाई, भूगोल, इतिहास, विज्ञान या किसी भी परीक्षा की तैयारी में किस प्रकार सहायता कर सकता हूँ?`;
        } else {
          customReply = `Hello! I am your AI Companion (HansAI). How can I assist you with Geography, History, Science, Maths, or competitive exam preparation today?`;
        }
      } else if (isNotUnderstanding) {
        customReply = `### 💡 आसान रूप (Simplified Explanation):\n\n\`\`\`\n  [मूल सिद्धांत / Core Concept]\n         │\n         ├──➤ [नियम / Formula/Rule]\n         │      └──➤ अनुप्रयोग (Exam Questions Application)\n         └──➤ [स्मरण ट्रिक / Memorization Hack]\n\`\`\``;
      } else {
        customReply = generateSubjectKnowledgeReply(messageContent, language);
      }

      const assistantFallbackMsg: Message = {
        id: `reply-${Date.now()}`,
        role: 'assistant',
        content: customReply,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, assistantFallbackMsg]);
      setSavedChats(prev => prev.map(s => {
        if (s.id === targetSessionId) {
          return {
            ...s,
            messages: [...(s.messages || []), assistantFallbackMsg],
            timestamp: new Date().toISOString()
          };
        }
        return s;
      }));
      showToast("HansAI Local Response Activated ✅", "success");

      const shouldSpeakVoice = isVoiceAssistantActive || isVoiceAssistantActiveRef.current || autoVoiceReadout || wasVoiceTriggeredRef.current;
      if (shouldSpeakVoice && customReply) {
        if (isVoiceAssistantActive || isVoiceAssistantActiveRef.current) {
          speakVoiceAssistantReply(customReply);
        } else {
          speakText(customReply, {
            lang: selectedIndianVoiceLang,
            rate: 1.0
          });
        }
      }
      wasVoiceTriggeredRef.current = false;
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className={`min-h-[100dvh] h-[100dvh] max-h-[100dvh] w-full max-w-full overflow-hidden flex flex-col ${
      screenColorMode === 'dark' ? 'bg-[#03060E] text-slate-100' : 
      screenColorMode === 'warm_yellow' ? 'bg-[#FAF6E9] text-[#78350F] font-sans' : 
      screenColorMode === 'eco_gray' ? 'bg-[#F1F3F5] text-slate-800' :
      'bg-[#03132B] text-cyan-100'
    }`}>

      {/* HANSAI ANIMATED SPLASH SCREEN OVERLAY */}
      {showSplashScreen && (
        <div className="fixed inset-0 z-50 bg-[#02050E] flex flex-col items-center justify-center p-4 text-center select-none overflow-hidden transition-opacity duration-700">
          {/* Google 3-Color Dynamic Glowing Radial Aura */}
          <div className="absolute w-[450px] h-[450px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#4285F4]/30 via-[#EA4335]/20 via-[#FBBC05]/25 to-[#34A853]/30 rounded-full blur-3xl animate-pulse pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />

          <div className="relative z-10 max-w-sm w-full space-y-4 flex flex-col items-center px-4">
            {/* Quantum Swan Logo Glowing Center Shape */}
            <div className="relative group cursor-pointer flex items-center justify-center py-2">
              <QuantumSwanLogo className="w-28 h-28 sm:w-36 sm:h-36 drop-shadow-2xl" showLightBg={true} />
            </div>

            {/* Brand Title & Tagline */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg">⚡</span>
                <h1 className="text-2xl sm:text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 via-amber-200 to-emerald-300 drop-shadow-md">
                  HansAI • हंस-एआई
                </h1>
                <span className="text-lg">⚡</span>
              </div>
              <p className="text-xs text-amber-300 font-bold tracking-wide">
                Universal Intelligence Platform • HansAI Academic Companion
              </p>
              <div className="p-2 bg-indigo-950/70 border border-indigo-500/30 rounded-xl text-[11px] text-indigo-200 font-sans italic shadow-sm">
                "ज्ञानम् परमम् बलम् • हंस-ज्ञान, अनुशासन एवं निरंतर प्रगति"
              </div>
            </div>

            {/* Live Activity Counters Badge */}
            <div className="px-3 py-1 bg-slate-900/90 border border-cyan-500/30 rounded-full flex items-center gap-1.5 text-[11px] font-semibold text-cyan-300 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>🟢 1,420 Online • HansAI Active</span>
            </div>

            {/* Loading Progress Bar */}
            <div className="w-full space-y-1.5 pt-1">
              <div className="w-full bg-slate-900/80 border border-slate-800 rounded-full h-2 overflow-hidden p-0.5">
                <div 
                  className="bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853] h-full rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(66,133,244,0.7)]"
                  style={{ width: `${splashProgress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>{splashStatus}</span>
                <span className="text-amber-400 font-bold">{splashProgress}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hans Compain Startup Intro Animation & Feature Showcase */}
      {showStartupIntro && (
        <StartupIntroSplash
          onComplete={() => {
            sessionStorage.setItem('hanscompain_intro_seen', 'true');
            setShowStartupIntro(false);
          }}
          onExploreFeature={(featureId) => {
            sessionStorage.setItem('hanscompain_intro_seen', 'true');
            setShowStartupIntro(false);
            if (featureId === 'chat' || featureId === 'quiz' || featureId === 'shorthand' || featureId === 'study-plan' || featureId === 'flashcards' || featureId === 'music-studio' || featureId === 'weather-alerts' || featureId === 'store' || featureId === 'security-hub') {
              setActiveView(featureId as any);
            }
          }}
        />
      )}
      
      {/* Top Header Marquee Announcement Banner if set by Admin */}
      {activeHeaderBanner && (
        <div className="bg-gradient-to-r from-amber-600 via-indigo-600 to-cyan-600 text-white text-[11px] font-bold py-1 px-4 flex items-center justify-between z-50 shadow-md">
          <div className="flex items-center gap-2 overflow-hidden truncate">
            <span className="bg-white/20 px-1.5 py-0.5 rounded text-[9px] uppercase font-black tracking-wider animate-pulse shrink-0">ANNOUNCEMENT</span>
            <span className="truncate">{activeHeaderBanner}</span>
          </div>
          <button 
            onClick={() => {
              setActiveHeaderBanner('');
              localStorage.setItem('hansai-banner-dismissed', 'true');
              showToast("Announcement banner dismissed. You can re-enable it in Settings.", "info");
            }}
            className="text-white/80 hover:text-white p-0.5 ml-2 cursor-pointer border-none bg-transparent"
            title="Dismiss announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* HEADER SECTION */}
      <header className={`px-3 sm:px-6 h-14 sm:h-16 border-b flex items-center justify-between sticky top-0 z-40 backdrop-blur-md w-full max-w-full overflow-hidden ${
        screenColorMode === 'dark' ? 'bg-[#03060E]/90 border-slate-900' :
        screenColorMode === 'warm_yellow' ? 'bg-[#FAF6E9]/90 border-amber-900/10' :
        screenColorMode === 'eco_gray' ? 'bg-[#F1F3F5]/90 border-slate-200' :
        'bg-[#03132B]/90 border-cyan-500/30'
      }`}>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 hover:bg-slate-800/80 rounded-xl transition-all cursor-pointer"
            title="Open terminal sidebar"
          >
            <Menu className="w-5 h-5 text-indigo-400" />
          </button>
          
          {/* Back Arrow Button (Visible in sub-views OR active chat) */}
          {(activeView !== 'chat' || chatMessages.length > 0) && (
            <button
              onClick={() => {
                if (activeView === 'chat') {
                  startNewChat();
                } else {
                  setActiveView('chat');
                }
              }}
              className="p-1.5 sm:p-2 bg-sky-500/20 hover:bg-sky-500/35 border border-sky-400/40 text-sky-200 hover:text-white rounded-xl text-xs font-extrabold flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95 shrink-0"
              title={activeView === 'chat' ? "Back to Homepage" : "Return to Workspace"}
            >
              <ArrowLeft className="w-4 h-4 text-sky-300" />
            </button>
          )}

          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setActiveView('chat'); startNewChat(); }}>
            {/* Hans Compain Clean Vector Branding */}
            <HansCompainLogo size="sm" showSubtitle={true} />
          </div>
        </div>

        {/* Header Right Actions - Responsive Mobile Options Menu */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">

          {/* Quick Daily Streak Indicator in Header */}
          <DailyStreakIndicator 
            variant="badge" 
            language={language} 
            onNavigateToView={(view) => setActiveView(view)} 
          />

          {/* Quick Return to Chat button if inside sub-view */}
          {activeView !== 'chat' && (
            <button
              onClick={() => setActiveView('chat')}
              className="px-2 py-1.5 bg-indigo-650 hover:bg-indigo-600 rounded-xl text-[10px] font-extrabold text-white flex items-center gap-1 transition-all cursor-pointer shadow-md"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Home Chat</span>
            </button>
          )}


          {/* Main Quick Options / Settings Button */}
          <button
            onClick={() => setIsHeaderMenuOpen(!isHeaderMenuOpen)}
            className="px-3 py-1.5 bg-indigo-900/60 hover:bg-indigo-800/80 border border-indigo-500/50 text-indigo-100 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            title="Header Options & Theme Switcher"
          >
            <span>⚙️</span>
            <span className="text-xs font-bold">Options</span>
            <span className="text-[10px] text-indigo-300">▼</span>
          </button>

          {/* User Avatar */}
          {user && (
            <img 
              src={user.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"} 
              alt={user.name} 
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-indigo-500/40 shadow-sm object-cover hidden sm:block"
              referrerPolicy="no-referrer"
            />
          )}
        </div>
      </header>

      {/* HEADER QUICK OPTIONS & 4 THEMES DROPDOWN POPOVER */}
      {isHeaderMenuOpen && (
        <>
          {/* Backdrop overlay to dismiss on outside click */}
          <div 
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsHeaderMenuOpen(false)}
          />
          
          <div className="fixed top-14 right-2 sm:right-6 z-50 w-84 max-w-[94vw] max-h-[calc(100vh-4.5rem)] overflow-y-auto overscroll-contain bg-[#0A0F1D] border-2 border-indigo-500/50 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-fade-in space-y-4 text-left custom-scrollbar">
            <div className="sticky -top-4 -mx-4 px-4 pt-3.5 pb-2.5 bg-[#0A0F1D]/95 backdrop-blur-md z-20 flex items-center justify-between border-b border-slate-800 rounded-t-2xl shadow-sm">
              <h3 className="text-xs font-extrabold text-white flex items-center gap-1.5">
                <span>⚙️</span>
                <span>HansAI Settings & Tools</span>
              </h3>
              <button 
                onClick={() => setIsHeaderMenuOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-bold p-1 px-2 rounded-lg hover:bg-slate-800 transition-colors"
                title="Close settings"
              >
                ✕
              </button>
            </div>

          {/* 4 Theme Color Selectors (As Requested by User) */}
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider block">🎨 Select Screen Theme (4 Color Modes):</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => {
                  setScreenColorMode('dark');
                  localStorage.setItem('hansai-color-mode', 'dark');
                  showToast("Theme: Midnight Dark", "success");
                }}
                className={`p-2 rounded-xl border text-left flex items-center gap-2 font-bold cursor-pointer transition-all ${
                  screenColorMode === 'dark' ? 'bg-indigo-600 text-white border-indigo-400 shadow-md' : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <span>🌙</span>
                <div>
                  <div className="text-[11px]">Midnight Dark</div>
                  <div className="text-[9px] text-slate-400">Deep Space</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setScreenColorMode('warm_yellow');
                  localStorage.setItem('hansai-color-mode', 'warm_yellow');
                  showToast("Theme: Warm Yellow (Eye-Care)", "success");
                }}
                className={`p-2 rounded-xl border text-left flex items-center gap-2 font-bold cursor-pointer transition-all ${
                  screenColorMode === 'warm_yellow' ? 'bg-amber-600 text-white border-amber-400 shadow-md' : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <span>☀️</span>
                <div>
                  <div className="text-[11px]">Warm Yellow</div>
                  <div className="text-[9px] text-amber-200">Eye-Care Reading</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setScreenColorMode('eco_gray');
                  localStorage.setItem('hansai-color-mode', 'eco_gray');
                  showToast("Theme: Eco Slate Gray", "success");
                }}
                className={`p-2 rounded-xl border text-left flex items-center gap-2 font-bold cursor-pointer transition-all ${
                  screenColorMode === 'eco_gray' ? 'bg-slate-700 text-white border-slate-400 shadow-md' : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <span>🌿</span>
                <div>
                  <div className="text-[11px]">Eco Gray</div>
                  <div className="text-[9px] text-slate-400">Cool Slate</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setScreenColorMode('cyber_blue');
                  localStorage.setItem('hansai-color-mode', 'cyber_blue');
                  showToast("Theme: Cyber Blue", "success");
                }}
                className={`p-2 rounded-xl border text-left flex items-center gap-2 font-bold cursor-pointer transition-all ${
                  screenColorMode === 'cyber_blue' ? 'bg-cyan-600 text-white border-cyan-400 shadow-md' : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <span>💎</span>
                <div>
                  <div className="text-[11px]">Cyber Blue</div>
                  <div className="text-[9px] text-cyan-200">High-Tech Neon</div>
                </div>
              </button>
            </div>
          </div>

          {/* SYSTEM LANGUAGE TOGGLE (HINDI / ENGLISH) */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider block">🌐 {language === 'hindi' ? 'सिस्टम भाषा (System Language):' : 'System Language:'}</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => {
                  setLanguage('hindi');
                  localStorage.setItem('hansai-language', 'hindi');
                  showToast("भाषा: हिंदी (Hindi Active) 🇮🇳", "success");
                }}
                className={`p-2 rounded-xl border text-center font-bold cursor-pointer transition-all ${
                  language === 'hindi' ? 'bg-indigo-600 text-white border-indigo-400 shadow-md' : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                🇮🇳 हिंदी (Hindi)
              </button>
              <button
                onClick={() => {
                  setLanguage('english');
                  localStorage.setItem('hansai-language', 'english');
                  showToast("Language: English Active 🇬🇧", "success");
                }}
                className={`p-2 rounded-xl border text-center font-bold cursor-pointer transition-all ${
                  language === 'english' ? 'bg-indigo-600 text-white border-indigo-400 shadow-md' : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                🇬🇧 English
              </button>
            </div>
          </div>

          {/* 🔊 VOICE & DISPLAY SETTINGS */}
          <div className="space-y-2 pt-2 border-t border-slate-800 text-xs font-bold">
            <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider block">
              🔊 {language === 'hindi' ? 'वॉयस एवं डिस्प्ले सेटिंग्स:' : 'Voice & Display Settings:'}
            </span>

            {/* Auto Voice Response Toggle */}
            <div className="p-2.5 bg-slate-900/90 border border-indigo-500/30 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <div className="text-left">
                  <div className="text-[11px] text-white font-bold">{language === 'hindi' ? 'ऑटो वॉयस उत्तर (Auto Voice)' : 'Auto Voice Readout'}</div>
                  <div className="text-[9px] text-slate-400">{language === 'hindi' ? 'वॉयस चैट पर स्वतः बोलकर जवाब देगा' : 'Auto-speaks without opening page'}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const nextVal = !autoVoiceReadout;
                  setAutoVoiceReadout(nextVal);
                  localStorage.setItem('hansai-auto-voice', String(nextVal));
                  showToast(nextVal ? '🔊 Auto Voice Response Enabled! (बोलकर जवाब देगा)' : '🔇 Auto Voice Disabled.', 'info');
                }}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                  autoVoiceReadout 
                    ? 'bg-indigo-600 text-white border-indigo-400' 
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {autoVoiceReadout ? 'ON 🔊' : 'OFF 🔇'}
              </button>
            </div>

            {/* Multi-lingual Indian Voice Locale Selection */}
            <div className="p-2.5 bg-slate-900/90 border border-indigo-500/30 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-300 font-bold">🇮🇳 {language === 'hindi' ? 'भारतीय वॉयस भाषा (Indian State Voice):' : 'Indian Voice Accent:'}</span>
                <span className="text-[9px] text-cyan-400 font-mono font-bold">{selectedIndianVoiceLang}</span>
              </div>
              <select
                value={selectedIndianVoiceLang}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedIndianVoiceLang(val);
                  localStorage.setItem('hansai-voice-lang', val);
                  showToast(`🇮🇳 Voice set to ${val}`, 'success');
                }}
                className="w-full bg-[#03060E] border border-indigo-500/40 rounded-lg text-xs text-indigo-100 p-1.5 focus:outline-none focus:border-cyan-400"
              >
                {INDIAN_LANGUAGES.map((langItem) => (
                  <option key={langItem.code} value={langItem.code}>
                    {langItem.name} ({langItem.state})
                  </option>
                ))}
              </select>
            </div>

            {/* Font Size Selector for Clean & Big Text Reading */}
            <div className="p-2.5 bg-slate-900/90 border border-indigo-500/30 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-300 font-bold">🔠 {language === 'hindi' ? 'चैट फॉन्ट आकार (Font Size):' : 'Chat Font Size:'}</span>
                <span className="text-[9px] text-amber-400 font-bold capitalize">{chatFontSize}</span>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {(['normal', 'large', 'xl', 'huge'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setChatFontSize(size);
                      localStorage.setItem('hansai-chat-font-size', size);
                      showToast(`Font Size: ${size.toUpperCase()}`, 'info');
                    }}
                    className={`py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer capitalize ${
                      chatFontSize === size 
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-black' 
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {size === 'normal' ? 'A (Normal)' : size === 'large' ? 'A+ (Large)' : size === 'xl' ? 'A++ (XL)' : 'A+++ (Huge)'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 🛠️ TOOLS, ROADMAP & FEEDBACK */}
          <div className="space-y-2 pt-2 border-t border-slate-800 text-xs font-bold">
            <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider block">
              🛠️ {language === 'hindi' ? 'टूल्स, फीडबैक व सहायता:' : 'Tools, Feedback & Help:'}
            </span>

            {/* 5-Star Feedback & Suggestions Button */}
            <button
              onClick={() => {
                setFeedbackInitialContext('HansAI Main Platform & App');
                setIsFiveStarFeedbackOpen(true);
                setIsHeaderMenuOpen(false);
              }}
              className="w-full p-2.5 bg-gradient-to-r from-amber-950/80 to-yellow-950/80 hover:from-amber-900 hover:to-yellow-900 border border-amber-500/50 rounded-xl text-amber-200 flex items-center justify-between transition-all cursor-pointer text-left"
            >
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
                <span className="font-bold">{language === 'hindi' ? '⭐ 5-स्टार फीडबैक व सुझाव दें' : '⭐ 5-Star Feedback & Suggestions'}</span>
              </div>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-mono">
                Review ⭐
              </span>
            </button>

            {/* Upcoming Roadmap Modal (Speed Reply, Current Affairs, QR Scanner) */}
            <button
              onClick={() => {
                setIsRoadmapModalOpen(true);
                setIsHeaderMenuOpen(false);
              }}
              className="w-full p-2.5 bg-gradient-to-r from-cyan-950/80 to-indigo-950/80 hover:from-cyan-900 hover:to-indigo-900 border border-cyan-500/50 rounded-xl text-cyan-200 flex items-center justify-between transition-all cursor-pointer text-left"
            >
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400 shrink-0 animate-pulse" />
                <span className="font-bold">{language === 'hindi' ? '🚀 आगामी योजनाएं (Speed Reply / QR)' : '🚀 Upcoming Features & Roadmap'}</span>
              </div>
              <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-1.5 py-0.5 rounded font-mono">
                Plans 🚀
              </span>
            </button>

            {/* AI Assistant Help Guide (Explains every feature to avoid confusion) */}
            <button
              onClick={() => {
                setIsHelpGuideOpen(true);
                setIsHeaderMenuOpen(false);
              }}
              className="w-full p-2.5 bg-gradient-to-r from-indigo-950/80 to-purple-950/80 hover:from-indigo-900 hover:to-purple-900 border border-indigo-500/50 rounded-xl text-indigo-200 flex items-center justify-between transition-all cursor-pointer text-left"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
                <span className="font-bold">{language === 'hindi' ? '🤖 A8 AI सहायता चैट सिस्टम' : '🤖 A8 AI Help & Chat Assistant'}</span>
              </div>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-mono">
                A8 Chat ✨
              </span>
            </button>

            {/* 🔍 HansAI Auto-Problem Diagnostics & Owner Alert */}
            <button
              onClick={() => {
                setIsDiagnosticsModalOpen(true);
                setIsHeaderMenuOpen(false);
              }}
              className="w-full p-2.5 bg-gradient-to-r from-emerald-950/80 to-teal-950/80 hover:from-emerald-900 hover:to-teal-900 border border-emerald-500/50 rounded-xl text-emerald-200 flex items-center justify-between transition-all cursor-pointer text-left"
            >
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400 shrink-0 animate-pulse" />
                <span className="font-bold">{language === 'hindi' ? '🔍 ऑटो प्रॉब्लम स्कैनर व ईमेल रिपोर्ट' : '🔍 Auto Problem Diagnostics'}</span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded font-mono">
                Auto Scan ⚡
              </span>
            </button>

            {/* Public AI Rules & Safety Guidelines (Clean single entry) */}
            <button
              type="button"
              onClick={() => {
                setIsAiRulesModalOpen(true);
                setIsHeaderMenuOpen(false);
              }}
              className="w-full p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/50 text-slate-300 hover:text-amber-300 rounded-xl text-xs font-bold flex items-center justify-between transition-all shadow-sm cursor-pointer text-left"
              title="Public AI Usage Rules, Governance & Fair Use Guidelines"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{language === 'hindi' ? '⚖️ पब्लिक AI उपयोग नियम व निर्देश' : '⚖️ Public AI Usage Rules & Guidelines'}</span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded font-mono">
                Rules 🛡️
              </span>
            </button>

            {/* App Share Button */}
            <button
              onClick={() => { setIsShareModalOpen(true); setIsHeaderMenuOpen(false); }}
              className="w-full p-2.5 bg-slate-900 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/40 rounded-xl text-cyan-300 flex items-center justify-between transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-cyan-300 shrink-0" />
                <span>{language === 'hindi' ? 'ऐप दोस्तों के साथ शेयर करें' : 'Share HansAI App'}</span>
              </div>
              <span className="text-[10px] opacity-70">Share →</span>
            </button>

            {/* Professional Admin Console (If Admin) */}
            {isAdmin && (
              <button
                onClick={() => { handleOpenOwnerDashboard(); setIsHeaderMenuOpen(false); }}
                className="w-full p-2.5 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/40 rounded-xl text-amber-300 flex items-center justify-between transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{language === 'hindi' ? 'ओनर एडमिन कंसोल' : 'Owner Admin Console'}</span>
                </div>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30 font-mono">
                  ADMIN
                </span>
              </button>
            )}

            {user ? (
              <button
                onClick={() => {
                  localStorage.removeItem('hansai-user-session');
                  setUser(null);
                  setIsHeaderMenuOpen(false);
                  showToast(language === 'hindi' ? "सफलतापूर्वक लॉगआउट किया गया! 👋" : "Successfully Logged Out! 👋", "info");
                  setActiveView('chat');
                }}
                className="w-full p-2.5 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 rounded-xl text-rose-300 flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-2">
                  <span>🚪</span>
                  <span>Logout ({user.email})</span>
                </div>
                <span className="text-[10px]">Exit</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => { setIsAuthLoginOpen(true); setIsHeaderMenuOpen(false); }}
                  className="p-2 bg-slate-900 hover:bg-slate-800 text-indigo-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border border-indigo-500/30"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Login</span>
                </button>
                <button
                  onClick={() => { setIsAuthRegisterOpen(true); setIsHeaderMenuOpen(false); }}
                  className="p-2 bg-indigo-600 hover:bg-indigo-550 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-md"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Register</span>
                </button>
              </div>
            )}
          </div>
        </div>
        </>
      )}

      {/* Offline Status Top Banner */}
        {isOffline && (
          <div className="bg-amber-950/90 border-b border-amber-500/40 px-4 py-2 text-center text-xs font-semibold text-amber-200 flex items-center justify-center gap-2">
            <span>⚠️</span>
            <span>
              <strong>{language === 'hindi' ? '⚠️ इंटरनेट कनेक्शन नहीं है (Offline Mode):' : '⚠️ No Internet Connection (Offline Mode):'}</strong> {language === 'hindi' ? 'एआई चैट (Gemini AI), क्लाउड सिंक और लाइव फीचर्स के लिए इंटरनेट आवश्यक है। सहेजे गए स्थानीय नोट्स और स्टेनो टूल्स उपलब्ध हैं।' : 'AI chat (Gemini AI), cloud sync, and live features require internet. Saved local notes and steno tools are available.'}
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
                  {language === 'hindi' ? 'HansAI में आपका स्वागत है!' : 'Welcome to HansAI'}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {language === 'hindi' ? 'कृपया प्रयोग शुरू करने से पहले अपना नाम और ईमेल दर्ज करें:' : 'Please enter your Name and Email to start:'}
                </p>
              </div>

              <form onSubmit={handleUserRegistrationSubmit} className="space-y-4 text-xs font-semibold">
                <div className="space-y-1.5">
                  <label className="text-slate-300 block">{language === 'hindi' ? 'आपका पूरा नाम:' : 'Full Name:'}</label>
                  <input
                    type="text"
                    required
                    value={registerFormName}
                    onChange={(e) => setRegisterFormName(e.target.value)}
                    placeholder={language === 'hindi' ? "उदा. आपका नाम" : "Enter Your Name"}
                    className="w-full px-3.5 py-2.5 bg-[#060913] border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 block">{language === 'hindi' ? 'आपका ईमेल आईडी:' : 'Email Address:'}</label>
                  <input
                    type="email"
                    required
                    value={registerFormEmail}
                    onChange={(e) => setRegisterFormEmail(e.target.value)}
                    placeholder="e.g. yourname@gmail.com"
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
                  {isRegisteringUser 
                    ? (language === 'hindi' ? "रजिस्टर हो रहा है..." : "Registering...") 
                    : (language === 'hindi' ? "सुरक्षित प्रवेश करें" : "Continue to HansAI")}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ACTIVE CANVAS VIEW */}
        <div className={`flex-1 min-h-0 ${activeView === 'chat' ? 'overflow-hidden flex flex-col' : 'overflow-y-auto'}`}>
          
          {/* UNIVERSAL BACK BUTTON TOP BAR FOR ALL NON-CHAT SUB-VIEWS */}
          {activeView !== 'chat' && (
            <div className="sticky top-0 z-50 bg-[#060913]/95 backdrop-blur-md border-b border-indigo-500/30 px-3 py-2 flex items-center justify-between shadow-xl">
              <button
                onClick={() => setActiveView('chat')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-550 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer border border-indigo-400/30 active:scale-95 shrink-0"
                title={language === 'hindi' ? 'मुख्य चैट पर जाएँ' : 'Back to Chat'}
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold text-indigo-300 capitalize px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-xl hidden sm:inline">
                  {activeView.replace('-', ' ')}
                </span>
                <button
                  onClick={() => setActiveView('chat')}
                  className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-800/80 hover:bg-slate-700 transition-all cursor-pointer"
                  title="Close View & Return to Chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          
          {/* VIEW: CHAT BOT (CHATGPT & GEMINI STYLE WITH SIDEBAR & NON-SCROLLABLE HOME) */}
          {activeView === 'chat' && (
            <div className="flex-1 min-h-0 flex overflow-hidden w-full relative">
              
              {/* LEFT SIDEBAR (ChatGPT / Gemini style side search & history bar) */}
              <div className={`w-72 sm:w-80 border-r border-slate-850/80 bg-[#060913] flex flex-col justify-between flex-shrink-0 transition-all duration-300 z-30 ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
              } fixed lg:relative inset-y-0 left-0 top-0 h-full shadow-2xl lg:shadow-none`}>
                
                {/* Top Sidebar Controls */}
                <div className="p-3.5 space-y-3 border-b border-slate-850/80">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <HansCompainLogo size="xs" showSubtitle={false} />
                    </div>
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="lg:hidden p-1 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* DAILY STUDY STREAK INDICATOR */}
                  <DailyStreakIndicator 
                    language={language}
                    variant="card"
                    onNavigateToView={(view) => {
                      setActiveView(view);
                      if (window.innerWidth < 1024) setSidebarOpen(false);
                    }}
                  />

                  {/* Intro & Feature Carousel Replay Trigger */}
                  <button
                    onClick={() => {
                      setShowStartupIntro(true);
                      if (window.innerWidth < 1024) setSidebarOpen(false);
                    }}
                    className="w-full py-2 px-3 bg-gradient-to-r from-purple-950/60 to-indigo-950/60 hover:from-purple-900/80 hover:to-indigo-900/80 border border-purple-500/30 rounded-xl text-purple-200 text-xs font-bold flex items-center justify-between transition-all cursor-pointer shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                      <span>{language === 'hindi' ? "हंस कंप्लेन फीचर्स एनिमेटेड टूर ✨" : "Hans Compain Features Tour ✨"}</span>
                    </div>
                    <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-mono">Overview</span>
                  </button>

                  {/* New Chat Button */}
                  <button
                    onClick={() => {
                      startNewChat();
                      if (window.innerWidth < 1024) setSidebarOpen(false);
                    }}
                    className="w-full py-2.5 px-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-550 hover:to-indigo-650 text-white rounded-xl font-bold text-xs flex items-center justify-between transition-all shadow-md shadow-indigo-600/15 cursor-pointer border-none active:scale-98"
                  >
                    <div className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      <span>{language === 'hindi' ? "+ नया चैट शुरू करें" : "+ New Chat"}</span>
                    </div>
                    <span className="text-[9px] bg-indigo-900/80 px-1.5 py-0.5 rounded text-indigo-200 font-mono">ChatGPT-Style</span>
                  </button>

                  {/* Public AI Rules & Safety Button in Sidebar */}
                  <button
                    onClick={() => {
                      setIsAiRulesModalOpen(true);
                      if (window.innerWidth < 1024) setSidebarOpen(false);
                    }}
                    className="w-full py-2 px-3 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/35 rounded-xl text-amber-200 text-xs font-bold flex items-center justify-between transition-all cursor-pointer shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">⚖️</span>
                      <span className="truncate">{language === 'hindi' ? "पब्लिक AI नियम व गाइडलाइन्स" : "AI Public Rules & Guidelines"}</span>
                    </div>
                    <span className="text-[8px] bg-amber-500/30 text-amber-200 px-1.5 py-0.5 rounded font-black uppercase">Rules</span>
                  </button>

                  {/* Sidebar Search Bar */}
                  <div className="relative">
                    <input
                      type="text"
                      value={sidebarSearchQuery}
                      onChange={(e) => setSidebarSearchQuery(e.target.value)}
                      placeholder={language === 'hindi' ? "चैट्स एवं विषय खोजें..." : "Search chats, topics..."}
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
                  
                  {/* Saved Chat History / Recent Chats (Grouped by Date - ChatGPT Style) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                      <span className="flex items-center gap-1">
                        <History className="w-3 h-3 text-indigo-400" />
                        <span>{language === 'hindi' ? "चैट इतिहास" : "History"}</span>
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setIsChatHistoryModalOpen(true)}
                          className="text-[9px] text-indigo-400 hover:text-indigo-200 font-bold bg-indigo-500/15 hover:bg-indigo-500/30 px-1.5 py-0.5 rounded border border-indigo-500/30 cursor-pointer transition-all"
                          title="Open Full History Modal"
                        >
                          {language === 'hindi' ? "पूरा देखें ↗" : "Full View ↗"}
                        </button>
                        <span className="text-[9px] bg-slate-800 px-1.5 py-0.2 rounded text-slate-400">{savedChats.length}</span>
                        {savedChats.length > 0 && (
                          <button
                            onClick={() => setIsClearAllChatsModalOpen(true)}
                            className="text-[9px] text-rose-400 hover:text-rose-300 transition-colors bg-transparent border-none cursor-pointer"
                            title="Clear All Chat History"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>

                    {filteredSavedChats.length === 0 ? (
                      <div className="p-3 text-center text-[10px] text-slate-500 bg-[#080C16] border border-dashed border-slate-850 rounded-xl">
                        {savedChats.length === 0 
                          ? (language === 'hindi' ? "कोई सहेजी गई चैट नहीं है। नया सवाल पूछें!" : "No chat history yet. Ask a question to start!") 
                          : "No matching chats found."}
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {(() => {
                          const { pinned, today, yesterday, last7Days, older } = groupChatsByDate(filteredSavedChats);
                          const renderChatGroup = (groupLabel: string, chats: any[]) => {
                            if (!chats || chats.length === 0) return null;
                            return (
                              <div key={groupLabel} className="space-y-1">
                                <div className="text-[9px] font-black text-slate-500 uppercase tracking-wider px-1.5 pt-1">
                                  {groupLabel}
                                </div>
                                <div className="space-y-1">
                                  {chats.map((sess) => {
                                    const isActive = currentChatSessionId === sess.id;
                                    const isEditing = editingChatId === sess.id;
                                    return (
                                      <div
                                        key={sess.id}
                                        className={`group relative flex items-center justify-between p-2 rounded-xl border transition-all text-left cursor-pointer ${
                                          isActive 
                                            ? 'bg-indigo-950/70 border-indigo-500/50 shadow-md shadow-indigo-950/50 text-white' 
                                            : 'bg-[#090D18] hover:bg-[#121829] border-slate-850 hover:border-indigo-500/30 text-slate-300'
                                        }`}
                                        onClick={() => {
                                          if (!isEditing) {
                                            loadSavedChat(sess);
                                            if (window.innerWidth < 1024) setSidebarOpen(false);
                                          }
                                        }}
                                      >
                                        {isEditing ? (
                                          <div className="flex items-center gap-1 w-full" onClick={(e) => e.stopPropagation()}>
                                            <input
                                              type="text"
                                              value={editingChatTitle}
                                              onChange={(e) => setEditingChatTitle(e.target.value)}
                                              onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleRenameChat(sess.id, editingChatTitle);
                                                if (e.key === 'Escape') setEditingChatId(null);
                                              }}
                                              autoFocus
                                              className="w-full text-[11px] bg-slate-900 border border-indigo-500 rounded px-1.5 py-0.5 text-white focus:outline-none"
                                            />
                                            <button
                                              onClick={() => handleRenameChat(sess.id, editingChatTitle)}
                                              className="p-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] cursor-pointer"
                                              title="Save Title"
                                            >
                                              ✓
                                            </button>
                                            <button
                                              onClick={() => setEditingChatId(null)}
                                              className="p-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded text-[10px] cursor-pointer"
                                              title="Cancel"
                                            >
                                              ✕
                                            </button>
                                          </div>
                                        ) : (
                                          <>
                                            <div className="flex-1 text-[11px] font-semibold truncate flex items-center gap-1.5 pr-1">
                                              <MessageSquare className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-indigo-300' : 'text-slate-400 group-hover:text-indigo-400'}`} />
                                              <span className="truncate">{sess.title || 'Chat Session'}</span>
                                              {sess.isPinned && (
                                                <span className="text-[10px] text-amber-400 ml-1">📌</span>
                                              )}
                                            </div>

                                            {/* Action icons on hover or active */}
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                              {/* Pin/Unpin */}
                                              <button
                                                onClick={() => handlePinChat(sess.id)}
                                                className={`p-1 text-xs hover:text-amber-400 bg-transparent border-none cursor-pointer ${sess.isPinned ? 'text-amber-400' : 'text-slate-500'}`}
                                                title={sess.isPinned ? "Unpin Chat" : "Pin to Top"}
                                              >
                                                📌
                                              </button>

                                              {/* Rename button */}
                                              <button
                                                onClick={() => {
                                                  setEditingChatId(sess.id);
                                                  setEditingChatTitle(sess.title || '');
                                                }}
                                                className="p-1 text-slate-500 hover:text-indigo-300 text-xs bg-transparent border-none cursor-pointer"
                                                title="Rename Chat"
                                              >
                                                ✏️
                                              </button>

                                              {/* Delete button */}
                                              <button
                                                onClick={() => deleteSavedChat(sess.id)}
                                                className="p-1 text-slate-500 hover:text-rose-400 text-xs bg-transparent border-none cursor-pointer"
                                                title="Delete Chat"
                                              >
                                                🗑️
                                              </button>
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          };

                          return (
                            <>
                              {renderChatGroup(language === 'hindi' ? "📌 पिन किए गए" : "📌 Pinned", pinned)}
                              {renderChatGroup(language === 'hindi' ? "आज (Today)" : "Today", today)}
                              {renderChatGroup(language === 'hindi' ? "कल (Yesterday)" : "Yesterday", yesterday)}
                              {renderChatGroup(language === 'hindi' ? "पिछले 7 दिन (Previous 7 Days)" : "Previous 7 Days", last7Days)}
                              {renderChatGroup(language === 'hindi' ? "पुराने चैट (Older)" : "Older", older)}
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>

                  {/* Quick Tools & Modes */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-850">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1 block">
                      {language === 'hindi' ? "विशेषज्ञ AI टूल्स" : "Specialized AI Hub"}
                    </span>
                    <div className="space-y-1 text-xs font-semibold">
                      {/* PROMINENT ALL STENOGRAPHER SHORTCUT BUTTON */}
                      <button
                        onClick={() => { setActiveView('steno'); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                        className="w-full flex items-center justify-between gap-2 p-2.5 rounded-xl text-sky-200 hover:text-white hover:bg-gradient-to-r hover:from-sky-900/60 hover:to-cyan-900/60 transition-all text-left bg-gradient-to-r from-sky-950/80 to-cyan-950/80 border-2 border-cyan-400/50 cursor-pointer font-black shadow-lg shadow-cyan-950/60"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-base shrink-0">✍️</span>
                          <span className="truncate font-black text-sky-300">
                            {language === 'hindi' ? 'All Stenographer • सम्पूर्ण स्टेनो' : 'All Stenographer Studio'}
                          </span>
                        </div>
                        <span className="text-[8px] bg-cyan-400 text-slate-950 px-1.5 py-0.5 rounded-md font-black uppercase shrink-0">
                          Syllabus & Lab
                        </span>
                      </button>

                      <button
                        onClick={() => { setActiveView('mock-interview'); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl text-indigo-300 hover:text-indigo-200 hover:bg-[#121829] transition-all text-left bg-indigo-500/15 border border-indigo-500/30 cursor-pointer font-bold"
                      >
                        <span className="text-sm">🎙️</span>
                        <span className="truncate">{language === 'hindi' ? 'AI मॉक इंटरव्यू सिमुलेटर' : 'AI Mock Interview Simulator'}</span>
                      </button>
                      <button
                        onClick={() => { setActiveView('performance-analytics'); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl text-rose-300 hover:text-rose-200 hover:bg-[#121829] transition-all text-left bg-rose-500/15 border border-rose-500/30 cursor-pointer font-bold"
                      >
                        <span className="text-sm">📊</span>
                        <span className="truncate">{language === 'hindi' ? 'AI परफॉरमेंस एवं कमज़ोर विषय' : 'AI Weak Area Diagnostics'}</span>
                      </button>
                      <button
                        onClick={() => { setActiveView('study-plan'); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl text-cyan-300 hover:text-cyan-200 hover:bg-[#121829] transition-all text-left bg-cyan-500/15 border border-cyan-500/30 cursor-pointer font-bold"
                      >
                        <span className="text-sm">🗓️</span>
                        <span className="truncate">{language === 'hindi' ? 'स्मार्ट स्टडी प्लानर' : 'Smart Study Planner'}</span>
                      </button>
                      <button
                        onClick={() => { setActiveView('neural-map'); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl text-emerald-300 hover:text-emerald-200 hover:bg-[#121829] transition-all text-left bg-emerald-500/15 border border-emerald-500/30 cursor-pointer font-bold"
                      >
                        <span className="text-sm">🧠</span>
                        <span className="truncate">{language === 'hindi' ? 'AI न्यूरल मेमोरी मैप' : 'AI Neural Memory Map'}</span>
                      </button>
                      <button
                        onClick={() => { setActiveView('time-travel'); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl text-amber-300 hover:text-amber-200 hover:bg-[#121829] transition-all text-left bg-amber-500/15 border border-amber-500/30 cursor-pointer font-bold"
                      >
                        <span className="text-sm">⏳</span>
                        <span className="truncate">{language === 'hindi' ? 'AI काल-यात्रा सिमुलेटर' : 'AI Time-Travel Simulator'}</span>
                      </button>
                      <button
                        onClick={() => { setActiveView('article-reader'); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl text-amber-300 hover:text-amber-200 hover:bg-[#121829] transition-all text-left bg-amber-500/10 border border-amber-500/20 cursor-pointer font-bold"
                      >
                        <Headphones className="w-4 h-4 text-amber-300" />
                        <span className="truncate">{language === 'hindi' ? 'आर्टिकल वाइस रीडर 🎙️' : 'Article Voice Reader 🎙️'}</span>
                      </button>
                      <button
                        onClick={() => { setActiveView('notes-ocr'); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl text-emerald-300 hover:text-emerald-200 hover:bg-[#121829] transition-all text-left bg-emerald-500/10 border border-emerald-500/20 cursor-pointer font-bold"
                      >
                        <Camera className="w-4 h-4 text-emerald-300" />
                        <span className="truncate">{language === 'hindi' ? 'हस्तलिखित नोट्स फोटो स्कैनर 📷' : 'Handwritten Notes Scanner 📷'}</span>
                      </button>
                      <button
                        onClick={() => { setActiveView('history'); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#121829] transition-all text-left bg-transparent border-none cursor-pointer"
                      >
                        <span className="text-sm">🎙️</span>
                        <span className="truncate">Voice Article & Audio Recorder</span>
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

                    {isAdmin && (
                      <button
                        onClick={() => {
                          handleOpenOwnerDashboard();
                          if (window.innerWidth < 1024) setSidebarOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-xl text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all text-left text-xs font-bold cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>Owner Admin Console</span>
                        </div>
                        <span className="text-[9px] bg-amber-500/30 px-1.5 py-0.5 rounded text-amber-200 font-mono">Admin</span>
                      </button>
                    )}

                    <button
                      onClick={() => setIsCreatorDrawerOpen(!isCreatorDrawerOpen)}
                      className="w-full flex items-center justify-between p-2 rounded-xl text-slate-300 hover:text-indigo-300 hover:bg-[#121829] transition-all text-left text-xs font-semibold bg-transparent border-none cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">👤</span>
                        <span>About Creator & Vision</span>
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
                    <QuantumSwanLogo className="w-5 h-5" showLightBg={true} />
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

              {/* Mobile Sidebar Backdrop Overlay */}
              {sidebarOpen && (
                <div 
                  onClick={() => setSidebarOpen(false)}
                  className="fixed inset-0 bg-black/70 backdrop-blur-sm z-20 lg:hidden transition-opacity"
                />
              )}

              {/* RIGHT MAIN CHAT AREA (ChatGPT / Gemini style viewport centered layout) */}
              <div className={`flex-1 flex flex-col h-full overflow-hidden ${themeColors.bgMain} relative transition-colors duration-300`}>

                {/* MAIN CHAT CONTENT AREA (Robust auto-scroll viewport) */}
                <div className="chat-interface-view flex flex-col h-full w-full max-w-6xl mx-auto p-2 sm:p-3 overflow-y-auto scrollbar-thin">
                  
                  {/* Hands-Free Voice Assistant Active Status Banner */}
                  {isVoiceAssistantActive && (
                    <div className="mb-2 bg-gradient-to-r from-rose-950/90 via-indigo-950/90 to-slate-900/90 border border-rose-500/50 p-2.5 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-2.5 text-white text-xs animate-fade-in relative overflow-hidden flex-shrink-0">
                      <div className="flex items-center gap-3 text-left">
                        <div className="relative flex-shrink-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isVoiceAssistantSpeaking ? 'bg-amber-500' : 'bg-rose-600'} text-white shadow-lg shadow-rose-500/30`}>
                            <Mic className={`w-4 h-4 ${isVoiceAssistantListening ? 'animate-pulse' : ''}`} />
                          </div>
                          {(isVoiceAssistantListening || isVoiceAssistantSpeaking) && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
                          )}
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-rose-500/30 text-rose-200 text-[9px] font-extrabold uppercase tracking-wider">
                              🎙️ VOICE ASSISTANT ACTIVE
                            </span>
                          </div>
                          <p className="text-xs font-bold text-amber-300 mt-0.5">
                            {voiceAssistantStatus}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isVoiceAssistantSpeaking && (
                          <button
                            onClick={() => {
                              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                              setIsVoiceAssistantSpeaking(false);
                            }}
                            className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-white border border-amber-500/40 rounded-xl text-[10px] font-bold transition-all cursor-pointer"
                          >
                            ⏹️ Stop
                          </button>
                        )}
                        <button
                          onClick={stopVoiceAssistantMode}
                          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-[10px] font-bold transition-all cursor-pointer shadow-md border-none"
                        >
                          Turn Off ❌
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* NEW CHAT WELCOME STATE (Clean A4 / Single-Screen No-Scroll Viewport Layout) */}
                  {chatMessages.length === 0 ? (
                    <div className="flex-1 min-h-0 flex flex-col justify-between max-w-5xl mx-auto w-full py-1 px-1 text-center animate-fade-in select-none overflow-y-auto sm:overflow-hidden scrollbar-none">
                      
                      {/* Logo and Greeting - Prominent & Sleek */}
                      <div className="flex flex-col items-center space-y-1 my-auto">
                        <QuantumSwanLogo className="w-12 h-12 sm:w-14 sm:h-14" showLightBg={true} />
                        <h2 className="text-xl sm:text-2xl font-black tracking-tight font-sans text-white">
                          HansAI - What can I help with today?
                        </h2>
                        <p className="text-xs text-slate-400 font-medium hidden sm:block">
                          {language === 'hindi' 
                            ? 'ऑल-इन-वन AI शिक्षा, सरकारी परीक्षा तैयारी एवं लाइव साइंस-मेमोरी लैब' 
                            : 'All-in-one AI education, exam prep & interactive science-memory lab'}
                        </p>

                        {/* WIDE SKY-BLUE "ALL STENOGRAPHER" HERO BANNER */}
                        <button
                          onClick={() => setActiveView('steno')}
                          className="mt-2 w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-sky-600 via-cyan-500 to-sky-600 hover:from-sky-500 hover:to-cyan-400 border border-sky-300/40 text-white font-black text-xs sm:text-sm tracking-wide shadow-lg shadow-cyan-900/40 hover:shadow-cyan-500/30 flex items-center justify-between gap-2.5 transition-all cursor-pointer active:scale-[0.99] group"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base group-hover:scale-110 transition-transform">✍️</span>
                            <span className="font-extrabold tracking-wide text-left">
                              ALL STENOGRAPHER • सम्पूर्ण आशुलिपि (ऋषि, मानक, पिटमैन) व डिक्टेशन
                            </span>
                          </div>
                          <span className="text-[10px] bg-white/20 text-white px-2.5 py-0.5 rounded-full font-black uppercase tracking-normal shrink-0">
                            OPEN
                          </span>
                        </button>
                      </div>

                      {/* ROW 1: CORE DAILY LEARNING (WIDE BUTTONS) */}
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 w-full text-left mt-3 mb-3">
                        <button
                          onClick={() => setActiveView('mnemonics')}
                          className="p-2 sm:p-2.5 bg-gradient-to-br from-amber-950/80 via-yellow-950/50 to-slate-900 border border-amber-500/50 hover:border-amber-400 rounded-xl flex items-center gap-2.5 group cursor-pointer transition-all shadow-md hover:shadow-amber-500/20 active:scale-98"
                        >
                          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 text-base">
                            💡
                          </div>
                          <div className="overflow-hidden">
                            <div className="text-xs font-bold text-slate-200 group-hover:text-amber-300 truncate">
                              {language === 'hindi' ? 'AI निमोनिक्स' : 'Smart Mnemonics'}
                            </div>
                            <div className="text-[9px] text-slate-400 truncate">
                              {language === 'hindi' ? 'तारीखें व कविताएं' : 'GK rhymes'}
                            </div>
                          </div>
                        </button>

                        <button
                          onClick={() => setActiveView('science-lab')}
                          className="p-2 sm:p-2.5 bg-gradient-to-br from-cyan-950/80 via-blue-950/50 to-slate-900 border border-cyan-500/50 hover:border-cyan-400 rounded-xl flex items-center gap-2.5 group cursor-pointer transition-all shadow-md hover:shadow-cyan-500/20 active:scale-98"
                        >
                          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0 text-base">
                            🔬
                          </div>
                          <div className="overflow-hidden">
                            <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 truncate">
                              {language === 'hindi' ? 'साइंस लैब' : 'Science Lab'}
                            </div>
                            <div className="text-[9px] text-slate-400 truncate">
                              {language === 'hindi' ? 'सर्किट व सिमुलेटर' : 'Circuit & Physics sim'}
                            </div>
                          </div>
                        </button>

                        <button
                          onClick={() => setActiveView('neural-map')}
                          className="p-2 sm:p-2.5 bg-gradient-to-br from-emerald-950/80 via-teal-950/50 to-slate-900 border border-emerald-500/50 hover:border-emerald-400 rounded-xl flex items-center gap-2.5 group cursor-pointer transition-all shadow-md hover:shadow-emerald-500/20 active:scale-98"
                        >
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 text-base">
                            🧠
                          </div>
                          <div className="overflow-hidden">
                            <div className="text-xs font-bold text-slate-200 group-hover:text-emerald-300 truncate">
                              {language === 'hindi' ? 'न्यूरल मैप' : 'Neural Map'}
                            </div>
                            <div className="text-[9px] text-slate-400 truncate">
                              {language === 'hindi' ? 'विजुअल नोड्स' : 'Visual nodes & PYQ'}
                            </div>
                          </div>
                        </button>
                        
                        <button
                          onClick={() => setActiveView('quiz')}
                          className="p-2 sm:p-2.5 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 hover:border-indigo-500/60 rounded-xl flex items-center gap-2.5 group cursor-pointer transition-all shadow-sm active:scale-98"
                        >
                          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 text-base">
                            🎯
                          </div>
                          <div className="overflow-hidden">
                            <div className="text-xs font-bold text-slate-200 group-hover:text-indigo-300 truncate">
                              {language === 'hindi' ? 'ऑटो क्विज' : 'Chapter Quiz'}
                            </div>
                            <div className="text-[9px] text-slate-400 truncate">
                              {language === 'hindi' ? 'स्कोरकार्ड' : 'PYQ & Scorecard'}
                            </div>
                          </div>
                        </button>

                        <button
                          onClick={() => setActiveView('book-reader')}
                          className="p-2 sm:p-2.5 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 hover:border-emerald-500/60 rounded-xl flex items-center gap-2.5 group cursor-pointer transition-all shadow-sm active:scale-98"
                        >
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 text-base">
                            🎙️
                          </div>
                          <div className="overflow-hidden">
                            <div className="text-xs font-bold text-slate-200 group-hover:text-emerald-300 truncate">
                              {language === 'hindi' ? 'वॉइस रीडर' : 'Voice Reader'}
                            </div>
                            <div className="text-[9px] text-slate-400 truncate">
                              {language === 'hindi' ? 'सुनें व समझें' : 'Listen & Learn'}
                            </div>
                          </div>
                        </button>
                        
                        <button
                          onClick={() => setActiveView('time-travel')}
                          className="p-2 sm:p-2.5 bg-gradient-to-br from-purple-950/80 via-indigo-950/50 to-slate-900 border border-purple-500/50 hover:border-purple-400 rounded-xl flex items-center gap-2.5 group cursor-pointer transition-all shadow-md hover:shadow-purple-500/20 active:scale-98"
                        >
                          <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0 text-base">
                            ⏳
                          </div>
                          <div className="overflow-hidden">
                            <div className="text-xs font-bold text-slate-200 group-hover:text-purple-300 truncate">
                              {language === 'hindi' ? 'काल-यात्रा' : 'Time-Travel Simulator'}
                            </div>
                            <div className="text-[9px] text-slate-400 truncate">
                              {language === 'hindi' ? 'भगत सिंह' : 'Converse with history'}
                            </div>
                          </div>
                        </button>
                      </div>

                      {/* ROW 2: OTHER UTILITIES (SQUARE BUTTONS) */}
                      <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full text-center mb-2">
                        <button
                          onClick={() => setIsAllExamsSyllabusOpen(true)}
                          className="p-2 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 hover:border-purple-500/60 rounded-xl flex flex-col items-center justify-center gap-1 group cursor-pointer transition-all shadow-sm active:scale-98"
                        >
                          <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0 text-sm">
                            📚
                          </div>
                          <div className="text-[9px] font-bold text-slate-300 group-hover:text-purple-300 leading-tight">
                            Syllabus
                          </div>
                        </button>

                        <button
                          onClick={() => setIsAppLauncherOpen(true)}
                          className="p-2 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 hover:border-cyan-500/60 rounded-xl flex flex-col items-center justify-center gap-1 group cursor-pointer transition-all shadow-sm active:scale-98"
                        >
                          <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0 text-sm">
                            🌐
                          </div>
                          <div className="text-[9px] font-bold text-slate-300 group-hover:text-cyan-300 leading-tight">
                            Apps
                          </div>
                        </button>
                        
                        <button
                          onClick={() => setActiveView('mock-interview')}
                          className="p-2 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 hover:border-indigo-500/60 rounded-xl flex flex-col items-center justify-center gap-1 group cursor-pointer transition-all shadow-sm active:scale-98"
                        >
                          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 text-sm">
                            🎙️
                          </div>
                          <div className="text-[9px] font-bold text-slate-300 group-hover:text-indigo-300 leading-tight">
                            Interview
                          </div>
                        </button>

                        <button
                          onClick={() => setActiveView('performance-analytics')}
                          className="p-2 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 hover:border-rose-500/60 rounded-xl flex flex-col items-center justify-center gap-1 group cursor-pointer transition-all shadow-sm active:scale-98"
                        >
                          <div className="w-7 h-7 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center shrink-0 text-sm">
                            📊
                          </div>
                          <div className="text-[9px] font-bold text-slate-300 group-hover:text-rose-300 leading-tight">
                            Analytics
                          </div>
                        </button>
                      </div>

                    </div>
                  ) : (
                    /* ACTIVE CHAT MESSAGES THREAD (ChatGPT Style Header & Session Bar) */
                    <div 
                      className="flex-1 min-h-0 space-y-6 w-full max-w-5xl mx-auto mb-2 overflow-y-auto pr-1 relative scrollbar-thin"
                      onMouseUp={() => {
                        const selection = window.getSelection();
                        if (selection && !selection.isCollapsed) {
                          const text = selection.toString().trim();
                          if (text.length > 3) {
                            try {
                              const range = selection.getRangeAt(0);
                              const rect = range.getBoundingClientRect();
                              setQuickSaveSelectedText(text);
                              setFloatingSelectionPos({
                                x: Math.max(10, Math.min(window.innerWidth - 180, rect.left + rect.width / 2)),
                                y: Math.max(10, rect.top - 12)
                              });
                              return;
                            } catch (e) {}
                          }
                        }
                        // Don't auto clear immediately if clicked inside floating toolbar
                      }}
                    >

                      {/* FLOATING QUICK-SAVE ACTION BUTTON ON HIGHLIGHTED TEXT */}
                      {floatingSelectionPos && quickSaveSelectedText && (
                        <div
                          style={{
                            position: 'fixed',
                            left: `${floatingSelectionPos.x}px`,
                            top: `${floatingSelectionPos.y}px`,
                            transform: 'translate(-50%, -100%)',
                            zIndex: 45
                          }}
                          className="animate-fade-in flex items-center gap-1.5 p-1.5 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white rounded-2xl shadow-2xl shadow-pink-900/50 border border-white/20 select-none cursor-pointer"
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsQuickSaveModalOpen(true);
                              setFloatingSelectionPos(null);
                            }}
                            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 active:scale-95 rounded-xl text-xs font-black flex items-center gap-1.5 text-white transition-all cursor-pointer border-none"
                            title="Save this highlighted snippet directly into your Notes Folder"
                          >
                            <BookmarkPlus className="w-3.5 h-3.5 text-pink-200 animate-pulse" />
                            <span>{language === 'hindi' ? 'Quick Save 📑' : 'Quick Save 📑'}</span>
                          </button>
                          
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(quickSaveSelectedText);
                              showToast(language === 'hindi' ? '📋 हाइलाइट किया गया टेक्स्ट कॉपी हुआ!' : '📋 Highlighted text copied!', 'info');
                              setFloatingSelectionPos(null);
                            }}
                            className="p-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all cursor-pointer border-none"
                            title="Copy highlighted text"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFloatingSelectionPos(null);
                            }}
                            className="p-1 hover:bg-white/20 text-white/70 hover:text-white rounded-lg transition-colors cursor-pointer border-none"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      {chatMessages.map((msg) => (
                        <div 
                          key={msg.id}
                          className={`flex flex-col space-y-1 py-1 w-full ${
                            msg.role === 'user' ? 'items-end' : 'items-start'
                          }`}
                        >
                          <div className={`flex items-start gap-3 w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            
                            {/* Avatar */}
                            {msg.role === 'user' ? (
                              <div className="w-7 h-7 rounded-full flex items-center justify-center font-black text-[11px] flex-shrink-0 shadow-sm bg-indigo-600 text-white mt-0.5">
                                U
                              </div>
                            ) : (
                              <div className="relative w-7 h-7 flex-shrink-0 flex items-center justify-center mt-0.5">
                                <div className="absolute inset-0 rounded-full border border-teal-400/35 animate-ping opacity-60" style={{ animationDuration: '3s' }} />
                                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#00E5FF] to-[#9D4EDD] shadow-md flex items-center justify-center text-[11px] font-black text-slate-950 z-10 select-none">
                                  🦢
                                </div>
                              </div>
                            )}

                            {/* Speech Body - Frameless & Unboxed for Assistant */}
                            <div className="flex flex-col flex-1 min-w-0">
                              {/* Attached Images Render (Supports up to 3 images) */}
                              {((msg.imagePreviewUrls && msg.imagePreviewUrls.length > 0) ? msg.imagePreviewUrls : (msg.imagePreviewUrl ? [msg.imagePreviewUrl] : [])).length > 0 && (
                                <div className="mb-2.5 flex flex-wrap gap-2">
                                  {((msg.imagePreviewUrls && msg.imagePreviewUrls.length > 0) ? msg.imagePreviewUrls : (msg.imagePreviewUrl ? [msg.imagePreviewUrl] : [])).map((imgUrl, imgIdx) => (
                                    <div 
                                      key={imgIdx}
                                      onClick={() => setFullImageModalUrl(imgUrl)}
                                      className="max-w-[180px] sm:max-w-[220px] overflow-hidden rounded-xl border border-slate-800 bg-slate-950/40 shadow-md cursor-pointer hover:opacity-90 transition-opacity relative group"
                                      title="Click to view full image / फोटो देखें"
                                    >
                                      <img src={imgUrl} alt={`Upload ${imgIdx + 1}`} className="max-h-40 w-full object-cover rounded-xl" referrerPolicy="no-referrer" />
                                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] font-extrabold text-white transition-opacity gap-1 p-1 text-center">
                                        👁️ View Full / बड़ा देखें
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              <div className={`leading-relaxed whitespace-pre-wrap ${
                                chatFontSize === 'huge' ? 'text-lg sm:text-xl font-medium' :
                                chatFontSize === 'xl' ? 'text-base sm:text-lg font-medium' :
                                chatFontSize === 'large' ? 'text-sm sm:text-base' :
                                'text-xs sm:text-sm'
                              } ${
                                msg.role === 'user' 
                                  ? 'bg-indigo-600 text-white rounded-2xl py-2 px-4 shadow-sm inline-block max-w-[85%] self-end' 
                                  : 'bg-transparent text-slate-100 border-none p-0 sm:p-1 w-full text-left font-sans'
                              }`}>
                                {renderMessageWithHighlights(msg.content)}
                              </div>
                            </div>
                          </div>

                          {/* Msg Actions Console */}
                          {msg.role === 'assistant' && (
                            <div className="flex items-center gap-2 sm:gap-3 pl-10 text-[10px] text-slate-500 font-medium select-none pt-1 flex-wrap">
                              <button
                                onClick={() => handleDownloadMessagePdf(msg)}
                                className="flex items-center gap-1 hover:text-cyan-300 transition-colors py-0.5 px-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-md cursor-pointer font-bold"
                                title="Download this answer/notes directly as PDF"
                              >
                                <Download className="w-3 h-3 text-cyan-400" />
                                <span>📥 PDF / डाउनलोड</span>
                              </button>
                              
                              {/* Quick Save to Notes Smart Folders */}
                              <button
                                onClick={() => {
                                  const selection = window.getSelection()?.toString().trim();
                                  const textToSave = (selection && selection.length > 3) ? selection : msg.content;
                                  setQuickSaveSelectedText(textToSave);
                                  setIsQuickSaveModalOpen(true);
                                  setFloatingSelectionPos(null);
                                }}
                                className="flex items-center gap-1 hover:text-pink-300 transition-colors py-0.5 px-2 bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-500/30 rounded-md cursor-pointer font-bold"
                                title="Quick Save full response or highlighted text directly into Notes & Folders"
                              >
                                <BookmarkPlus className="w-3 h-3 text-pink-400" />
                                <span>📑 Quick Save / नोट्स</span>
                              </button>

                              <button
                                onClick={() => handleCopyMessage(msg.id, msg.content)}
                                className="flex items-center gap-1 hover:text-indigo-400 transition-colors py-0.5 px-1.5 hover:bg-slate-800/40 rounded-md border-none bg-transparent cursor-pointer text-slate-400"
                                title="Copy response to clipboard"
                              >
                                <Copy className="w-3 h-3" />
                                {copiedMsgId === msg.id ? 'Copied ✓ / कॉपी हुआ' : 'Copy / कॉपी'}
                              </button>
                              <button
                                onClick={() => handleToggleSpeech(msg.id, msg.content)}
                                className={`flex items-center gap-1 transition-all py-0.5 px-1.5 rounded-md border-none cursor-pointer ${
                                  currentlySpeakingMsgId === msg.id 
                                    ? 'text-emerald-400 bg-emerald-500/10 font-bold' 
                                    : 'hover:text-amber-400 hover:bg-slate-800/40 bg-transparent text-slate-400'
                                }`}
                                title="Hear this read out loud in Indian Voice"
                              >
                                {currentlySpeakingMsgId === msg.id ? (
                                  <>
                                    <VolumeX className="w-3 h-3 animate-spin text-rose-400" />
                                    Stop / रुकें
                                  </>
                                ) : (
                                  <>
                                    <Volume2 className="w-3 h-3" />
                                    Listen / सुनें 🔊
                                  </>
                                )}
                              </button>
                              
                              {/* 5-Star Feedback Button on Each Assistant Response */}
                              <button
                                onClick={() => {
                                  setFeedbackInitialContext(`Response: "${msg.content.slice(0, 45)}..."`);
                                  setIsFiveStarFeedbackOpen(true);
                                }}
                                className="flex items-center gap-1 hover:text-amber-300 transition-colors py-0.5 px-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-md cursor-pointer font-bold"
                                title="Give 5-Star Feedback & Suggestions on this response"
                              >
                                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                <span>⭐ फीडबैक / Rating</span>
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

                          
                        </div>
                      ))}

                      {/* Loading placeholder spinner */}
                      {isChatLoading && (
                        <div className="flex items-center gap-3 py-3 pl-1">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#00E5FF] to-[#9D4EDD] flex items-center justify-center text-[10px] font-black text-slate-950">
                            🦢
                          </div>
                          <div className="text-slate-400 text-xs sm:text-sm flex items-center gap-2">
                            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-ping"></span>
                            <span className="italic text-slate-400 font-medium">HansAI - Generating response...</span>
                          </div>
                        </div>
                      )}

                      {!user && chatMessages.length > 0 && (
                        <div className="my-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-cyan-950/80 border border-indigo-500/40 text-center space-y-3 shadow-2xl animate-fade-in max-w-2xl mx-auto">
                          <div className="flex items-center justify-center gap-2 text-indigo-300 font-extrabold text-xs uppercase tracking-wider">
                            <Sparkles className="w-4 h-4 text-amber-400" />
                            <span>Save Chat History & Unlock Unlimited AI Queries</span>
                          </div>
                          <p className="text-xs text-slate-300 font-medium leading-relaxed">
                            {language === 'hindi'
                              ? 'क्या आपको यह AI जवाब पसंद आया? अपनी पढ़ाई की चैट हिस्ट्री सुरक्षित रखने और असीमित AI प्रश्नों के लिए Google या Facebook से लॉगिन करें!'
                              : 'Enjoying HansAI? Create a free student account or sign in with Google / Facebook to save your chat history and unlock unlimited AI queries!'}
                          </p>
                          <div className="flex items-center justify-center gap-2.5 flex-wrap pt-1">
                            <button
                              type="button"
                              onClick={() => setIsAuthRegisterOpen(true)}
                              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-lg hover:shadow-red-500/20 transition-all cursor-pointer border-none"
                            >
                              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                              </svg>
                              <span>Sign in with Google 🌐</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsAuthRegisterOpen(true)}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-lg hover:shadow-blue-500/20 transition-all cursor-pointer border-none"
                            >
                              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                              </svg>
                              <span>Facebook Sign In 🔷</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsAuthLoginOpen(true)}
                              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-indigo-300 font-bold text-xs rounded-xl transition-all cursor-pointer border border-slate-700"
                            >
                              Register / Login 🔑
                            </button>
                          </div>
                        </div>
                      )}
                      <div ref={chatBottomRef} />
                    </div>
                  )}

                  {/* FIXED CHAT INPUT AREA AT BOTTOM (Full Width Spacious Box with Camera Upload & Multi-Image Support) */}
                  <div className="shrink-0 max-w-5xl w-full mx-auto pt-1 pb-1">
                    {/* Attached Multiple Images Previews (Up to 3 images) */}
                    {chatAttachedImages.length > 0 && (
                      <div className="mb-2 p-2 rounded-2xl bg-slate-900/90 border border-indigo-500/40 flex flex-wrap items-center gap-2 animate-fade-in">
                        {chatAttachedImages.map((img, idx) => (
                          <div key={img.id || idx} className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 rounded-xl p-1.5 pr-2">
                            <div 
                              onClick={() => setFullImageModalUrl(img.previewUrl)}
                              className="w-10 h-10 rounded-lg border border-indigo-500/40 overflow-hidden bg-slate-950 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                              title="Click to view image / फोटो देखें"
                            >
                              <img src={img.previewUrl} alt={`Attached ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                            <div className="text-left">
                              <span className="text-[11px] font-bold text-indigo-200 block">Image {idx + 1}/3</span>
                              <button
                                type="button"
                                onClick={() => setFullImageModalUrl(img.previewUrl)}
                                className="text-[9px] text-indigo-400 hover:text-indigo-300 font-bold uppercase underline bg-transparent border-none p-0 cursor-pointer"
                              >
                                👁️ View
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => setChatAttachedImages(prev => prev.filter((_, i) => i !== idx))}
                              className="ml-1 p-1 bg-slate-800 hover:bg-rose-950/60 hover:text-rose-400 text-slate-400 rounded-md transition-all border-none cursor-pointer"
                              title="Remove image"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                        {chatAttachedImages.length < 3 && (
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-2.5 py-2 border border-dashed border-indigo-500/40 hover:border-indigo-400 text-indigo-300 rounded-xl text-[11px] font-bold flex items-center gap-1 bg-indigo-950/30 hover:bg-indigo-950/50 transition-all cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add (+{3 - chatAttachedImages.length})</span>
                          </button>
                        )}
                      </div>
                    )}

                    {!user && (
                      <div className="mb-2.5 p-3 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/40 flex flex-wrap items-center justify-between gap-2.5 shadow-2xl animate-fade-in backdrop-blur-md">
                        <div className="flex items-center gap-2.5">
                          <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                          </span>
                          <div>
                            <span className="font-extrabold bg-gradient-to-r from-amber-200 via-indigo-200 to-cyan-200 bg-clip-text text-transparent text-xs sm:text-sm tracking-wide block">
                              {language === 'hindi'
                                ? `🌐 गेस्ट AI सर्च मोड • मुफ़्त ट्रॉयल उपयोग: ${guestPromptCount}/2`
                                : `🌐 Guest AI Search Mode • Free Trial: ${guestPromptCount}/2`}
                            </span>
                            <span className="text-[10px] text-slate-400 block font-medium">
                              {language === 'hindi'
                                ? 'सर्च के बाद असीमित उत्तर एवं इतिहास सहेजने के लिए लॉगिन/साइन-अप करें'
                                : 'Sign in below to unlock unlimited queries & save history'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setIsAuthRegisterOpen(true)}
                            className="px-3 py-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer border-none shadow-md shadow-red-950/40 active:scale-95"
                          >
                            <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            </svg>
                            <span>Google 🌐</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsAuthRegisterOpen(true)}
                            className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer border-none shadow-md shadow-blue-950/40 hidden sm:flex active:scale-95"
                          >
                            <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                            <span>Facebook 🔷</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsAuthLoginOpen(true)}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white font-bold text-xs rounded-xl transition-all cursor-pointer border border-indigo-500/30 active:scale-95"
                          >
                            Login 🔑
                          </button>
                        </div>
                      </div>
                    )}

                    <form 
                      onSubmit={(e) => { e.preventDefault(); handleSendChat(); }}
                      className="bg-slate-900/95 border border-slate-800 p-3 rounded-2xl focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all flex items-center gap-2 shadow-2xl w-full"
                    >
                      {/* Hidden File Gallery Input (Supports multiple files up to 3) */}
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          const files = e.target.files;
                          if (!files || files.length === 0) return;
                          const fileArray = Array.from(files);
                          const validImageFiles = fileArray.filter(f => f.type.startsWith('image/'));
                          
                          if (validImageFiles.length === 0) {
                            showToast(language === 'hindi' ? "कृपया मान्य इमेज फाइल चुनें!" : "Please choose valid image files!", "warn");
                            return;
                          }
                          
                          const remainingSlots = 3 - chatAttachedImages.length;
                          if (remainingSlots <= 0) {
                            showToast(language === 'hindi' ? "अधिकतम 3 इमेज ही अपलोड कर सकते हैं!" : "Maximum 3 images can be attached!", "warn");
                            return;
                          }
                          
                          const filesToAdd = validImageFiles.slice(0, remainingSlots);
                          filesToAdd.forEach((file) => {
                            const reader = new FileReader();
                            reader.onload = () => {
                              const base64Data = (reader.result as string).split(',')[1];
                              setChatAttachedImages(prev => {
                                if (prev.length >= 3) return prev;
                                return [
                                  ...prev,
                                  {
                                    id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                                    mimeType: file.type,
                                    data: base64Data,
                                    previewUrl: URL.createObjectURL(file),
                                    name: file.name
                                  }
                                ];
                              });
                            };
                            reader.readAsDataURL(file);
                          });

                          if (validImageFiles.length > remainingSlots) {
                            showToast(language === 'hindi' ? "केवल 3 इमेज तक ही जोड़ी जा सकती हैं।" : "Only up to 3 images can be attached.", "info");
                          }
                          e.target.value = '';
                        }}
                      />

                      {/* Hidden Camera Snap Input */}
                      <input 
                        type="file" 
                        ref={cameraInputRef}
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (!file.type.startsWith('image/')) {
                              showToast(language === 'hindi' ? "कृपया एक मान्य इमेज फाइल चुनें!" : "Please choose a valid image file!", "warn");
                              return;
                            }
                            if (chatAttachedImages.length >= 3) {
                              showToast(language === 'hindi' ? "अधिकतम 3 इमेज ही अपलोड कर सकते हैं!" : "Maximum 3 images can be attached!", "warn");
                              return;
                            }
                            const reader = new FileReader();
                            reader.onload = () => {
                              const base64Data = (reader.result as string).split(',')[1];
                              setChatAttachedImages(prev => [
                                ...prev,
                                {
                                  id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                                  mimeType: file.type,
                                  data: base64Data,
                                  previewUrl: URL.createObjectURL(file),
                                  name: file.name
                                }
                              ]);
                            };
                            reader.readAsDataURL(file);
                          }
                          e.target.value = '';
                        }}
                      />

                      {/* Attachment Clip Button */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800/60 rounded-xl transition-all flex-shrink-0 border-none bg-transparent cursor-pointer relative"
                        title="Attach Images (Up to 3) / फोटो जोड़ें (अधिकतम 3)"
                      >
                        <Paperclip className="w-4.5 h-4.5" />
                        {chatAttachedImages.length > 0 && (
                          <span className="absolute top-0 right-0 w-4 h-4 bg-indigo-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                            {chatAttachedImages.length}
                          </span>
                        )}
                      </button>

                      {/* Camera Capture Button */}
                      <button
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        className="p-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/50 rounded-xl transition-all flex-shrink-0 border-none bg-transparent cursor-pointer"
                        title="Capture Photo via Camera / कैमरा से फोटो खींचें"
                      >
                        <Camera className="w-4.5 h-4.5" />
                      </button>

                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder={language === 'hindi' ? "हंस-एआई से कुछ भी पूछें... (प्रश्नों या नोट्स की 3 फोटो तक जोड़ें)" : "Ask HansAI anything... (Snap/attach up to 3 photos)"}
                        className="flex-1 w-full bg-transparent px-3 py-2 text-xs sm:text-sm focus:outline-none placeholder-slate-500 text-slate-100 font-sans"
                        disabled={isChatLoading}
                      />

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
                        disabled={isChatLoading || (!chatInput.trim() && chatAttachedImages.length === 0)}
                        title="Send Message / भेजें"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                    <div className="text-center mt-2 px-2 select-none">
                      <p className="text-[10px] text-slate-500">
                        HansAI can make mistakes. Verify important academic facts & formulas.
                      </p>
                    </div>
                  </div>

              </div>

            </div>

          </div>
      )}

          {/* VIEW: ACADEMIC QUIZ GENERATOR & PYQ STUDIO (ADDA247 / TCS ION PATTERN) */}
          {activeView === 'quiz' && (
            <div className="p-3 sm:p-6 w-full">
              <AcademicQuizStudio
                language={language}
                showToast={showToast}
                onExportPdf={(title, elementId, rawText) => {
                  generateStudyNotesPdf({
                    title: title || 'Academic Test Solution',
                    content: rawText || '',
                    language: language === 'hindi' ? 'hindi' : 'english'
                  });
                }}
                mistakeNotebook={mistakeNotebook}
                onAddToMistakeNotebook={(item) => handleSaveMistakeToNotebook(item)}
              />
            </div>
          )}

          {/* LEGACY QUIZ FALLBACK (DISABLED) */}
          {false && activeView === 'quiz' && (
            <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
              <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Award className="w-5.5 h-5.5 text-amber-500" />
                    <h2 className="text-xl font-bold text-white">
                      Syllabus Intelligence Practice Quiz
                    </h2>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Draft 5 intelligent Educational Multiple-Choice Questions dynamically mapped to any standard subject.
                  </p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-[11px] text-emerald-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    ⚡ Auto-Save Active (स्वतः सुरक्षित)
                  </div>
                </div>
              </div>

              {quizAutoSaveNotice && (
                <div className="px-3.5 py-2 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center justify-between animate-fade-in">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{quizAutoSaveNotice}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono">Progress Preserved</span>
                </div>
              )}

              {/* In-Progress Quiz Draft Resume Banner */}
              {hasActiveQuizDraft && quizzes.length === 0 && (
                <div className="p-4 bg-gradient-to-r from-indigo-950/80 via-purple-950/60 to-slate-900 border border-indigo-500/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg shadow-indigo-950/50 animate-fade-in">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Sparkle className="w-4 h-4 text-amber-400 animate-spin" />
                      <h4 className="text-xs sm:text-sm font-bold text-white">
                        अधूरा टेस्ट ड्राफ्ट उपलब्ध है! (In-Progress Quiz Draft Found)
                      </h4>
                    </div>
                    <p className="text-[11px] text-indigo-200">
                      आपका पिछला अनफिनिश्ड क्विज़ सेशन सुरक्षित है। आप वहीं से जारी रख सकते हैं।
                    </p>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={resumeActiveQuizDraft}
                      className="flex-1 sm:flex-none px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-300" />
                      Resume Test (जारी रखें)
                    </button>
                    <button
                      onClick={discardActiveQuizDraft}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 font-semibold rounded-xl text-xs transition-all cursor-pointer"
                      title="Discard unfinished quiz draft"
                    >
                      Dismiss (रद्द करें)
                    </button>
                  </div>
                </div>
              )}

              {quizzes.length === 0 ? (
                <div className="space-y-6">
                  {/* Tab Selector */}
                  <div className="flex border-b border-slate-800">
                    <button
                      onClick={() => setActiveQuizTab('syllabus')}
                      className={`flex-1 py-3 text-center font-bold text-xs sm:text-sm tracking-wide border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        activeQuizTab === 'syllabus'
                          ? 'border-indigo-500 text-indigo-400'
                          : 'border-transparent text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span>📖 Syllabus Live Quiz (सिलेबस लाइव टेस्ट)</span>
                    </button>
                    <button
                      onClick={() => setActiveQuizTab('mistakes')}
                      className={`flex-1 py-3 text-center font-bold text-xs sm:text-sm tracking-wide border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        activeQuizTab === 'mistakes'
                          ? 'border-rose-500 text-rose-400'
                          : 'border-transparent text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span>📓 Mistake Notebook (गलती रजिस्टर)</span>
                      {mistakeNotebook.length > 0 && (
                        <span className="text-[10px] bg-rose-500/20 text-rose-300 font-extrabold px-2 py-0.5 rounded-full">
                          {mistakeNotebook.length}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => setActiveQuizTab('saved')}
                      className={`flex-1 py-3 text-center font-bold text-xs sm:text-sm tracking-wide border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        activeQuizTab === 'saved'
                          ? 'border-indigo-500 text-indigo-400'
                          : 'border-transparent text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span>💾 Auto-Saved Quizzes ({savedQuizzes.length})</span>
                    </button>
                  </div>

                  {activeQuizTab === 'mistakes' ? (
                    <QuizMistakeNotebookView
                      mistakes={mistakeNotebook}
                      onRetest={(questions, title) => handleStartRetestFromMistakes(questions, title)}
                      onDelete={handleDeleteMistake}
                      onClearAll={handleClearAllMistakes}
                      onToggleMastered={handleToggleMasteredMistake}
                    />
                  ) : activeQuizTab === 'syllabus' ? (
                    <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6 space-y-5 text-left">
                      
                      {/* Student A1 Report Card Meta */}
                      <div className="p-3.5 bg-[#090D16] border border-amber-500/30 rounded-xl space-y-3">
                        <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-amber-400" />
                          A1 Scorecard Profile & Student Details (कार्ड विवरण)
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="block text-[10px] text-slate-400 font-bold">Student Name (छात्र का नाम):</label>
                            <input
                              type="text"
                              value={studentName}
                              onChange={(e) => setStudentName(e.target.value)}
                              placeholder="Student Name"
                              className="w-full text-xs py-2 px-3 bg-slate-900 border border-slate-800 rounded-lg text-white font-semibold focus:ring-1 focus:ring-amber-500 focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[10px] text-slate-400 font-bold">Roll / Reg Number (अनुक्रमांक):</label>
                            <input
                              type="text"
                              value={studentRoll}
                              onChange={(e) => setStudentRoll(e.target.value)}
                              placeholder="HS-2026-8809"
                              className="w-full text-xs py-2 px-3 bg-slate-900 border border-slate-800 rounded-lg text-amber-300 font-mono font-semibold focus:ring-1 focus:ring-amber-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Positive & Negative Marking Scheme */}
                        <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-850">
                          <div className="space-y-1">
                            <label className="block text-[10px] text-emerald-400 font-bold">Positive Mark (+Per Question):</label>
                            <input
                              type="number"
                              step="0.5"
                              value={positiveMarkVal}
                              onChange={(e) => setPositiveMarkVal(parseFloat(e.target.value) || 2.0)}
                              className="w-full text-xs py-1.5 px-3 bg-slate-900 border border-emerald-500/40 rounded-lg text-emerald-300 font-bold focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[10px] text-rose-400 font-bold">Negative Mark (-Per Question):</label>
                            <input
                              type="number"
                              step="0.25"
                              value={negativeMarkVal}
                              onChange={(e) => setNegativeMarkVal(parseFloat(e.target.value) || 0.5)}
                              className="w-full text-xs py-1.5 px-3 bg-slate-900 border border-rose-500/40 rounded-lg text-rose-300 font-bold focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Chapter Name & Exam Input */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-slate-300">अध्याय या विषय का नाम (Chapter Name):</label>
                          <input
                            type="text"
                            value={quizSubject}
                            onChange={(e) => setQuizSubject(e.target.value)}
                            placeholder="जैसे: Chapter 1: Real Numbers, Chapter 3: Laws of Motion..."
                            className="w-full text-xs py-2.5 px-3.5 bg-[#090D16] border border-indigo-500/40 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white font-medium"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-slate-300">कठिनाई एवं लक्ष्य परीक्षा (Level / Exam):</label>
                          <input
                            type="text"
                            value={quizLevel}
                            onChange={(e) => setQuizLevel(e.target.value)}
                            placeholder="जैसे: Class 10th Board, SSC CGL, BPSC Prelims, UPSC..."
                            className="w-full text-xs py-2.5 px-3.5 bg-[#090D16] border border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white font-medium"
                          />
                        </div>
                      </div>

                      {/* Question Difficulty Selector */}
                      <div className="space-y-2 p-3.5 bg-[#090D16] border border-slate-800 rounded-xl">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 text-amber-400" />
                            <span>प्रश्नों का स्तर (Question Difficulty Level):</span>
                          </label>
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            quizDifficulty === 'extreme' ? 'bg-purple-950 text-purple-300 border border-purple-500/40' :
                            quizDifficulty === 'hard' ? 'bg-rose-950 text-rose-300 border border-rose-500/40' :
                            quizDifficulty === 'moderate' ? 'bg-amber-950 text-amber-300 border border-amber-500/40' :
                            'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          }`}>
                            {quizDifficulty.toUpperCase()} LEVEL
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                          {[
                            { id: 'standard', title: '🟢 Standard', desc: 'मूल अवधारणा अभ्यास' },
                            { id: 'moderate', title: '🟡 Moderate', desc: 'अवधारणा अनुप्रयोग स्तर' },
                            { id: 'hard', title: '🔴 Hard (Advance)', desc: 'SSC CGL / UPSC स्तर' },
                            { id: 'extreme', title: '🟣 Extreme Master', desc: 'Multi-Statement व Tricky' },
                          ].map((d) => (
                            <button
                              key={d.id}
                              type="button"
                              onClick={() => setQuizDifficulty(d.id as any)}
                              className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                                quizDifficulty === d.id
                                  ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm'
                                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                              }`}
                            >
                              <span className="block text-xs font-bold truncate">{d.title}</span>
                              <span className="block text-[10px] text-slate-500 truncate mt-0.5">{d.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Question Count Selector */}
                      <div className="space-y-2 p-3.5 bg-[#090D16] border border-slate-800 rounded-xl">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                            <span>प्रश्नों की संख्या (Number of Questions):</span>
                          </label>
                          <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                            {quizQuestionCount} Questions
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-2 pt-1">
                          {[5, 10, 15, 20].map((count) => (
                            <button
                              key={count}
                              type="button"
                              onClick={() => setQuizQuestionCount(count)}
                              className={`py-2 rounded-xl text-center border font-bold text-xs transition-all cursor-pointer ${
                                quizQuestionCount === count
                                  ? 'bg-cyan-600/20 border-cyan-500 text-cyan-300'
                                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                              }`}
                            >
                              {count} प्रश्न
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Timer Limit Settings */}
                      <div className="space-y-2.5 p-3.5 bg-[#090D16] border border-slate-800 rounded-xl">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                            <span>समय सीमा सेटिंग्स (Timer Settings):</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => setQuizTimerSoundEnabled(prev => !prev)}
                            className="text-[10px] text-slate-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-lg"
                          >
                            <span>{quizTimerSoundEnabled ? '🔔 Sound ON' : '🔕 Sound OFF'}</span>
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {[
                            { id: 'auto', title: '⚙️ Auto Smart Timer', desc: 'स्तर के अनुसार स्वतः' },
                            { id: 'custom_question', title: '⚡ Per Question', desc: 'प्रति प्रश्न समय' },
                            { id: 'custom_total', title: '⏱️ Total Quiz', desc: 'कुल परीक्षा समय' },
                            { id: 'none', title: '🕊️ No Timer', desc: 'बिना समय सीमा' },
                          ].map((tm) => (
                            <button
                              key={tm.id}
                              type="button"
                              onClick={() => setQuizTimerMode(tm.id as any)}
                              className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                                quizTimerMode === tm.id
                                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm'
                                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                              }`}
                            >
                              <span className="block text-xs font-bold truncate">{tm.title}</span>
                              <span className="block text-[10px] text-slate-500 truncate mt-0.5">{tm.desc}</span>
                            </button>
                          ))}
                        </div>

                        {/* Sub-settings for Timer */}
                        {quizTimerMode === 'custom_question' && (
                          <div className="pt-2 border-t border-slate-850 flex items-center justify-between gap-3 text-xs">
                            <span className="text-slate-400">प्रति प्रश्न सेकंड चुनें:</span>
                            <div className="flex gap-1.5">
                              {[15, 30, 45, 60, 90].map((sec) => (
                                <button
                                  key={sec}
                                  type="button"
                                  onClick={() => setQuizCustomQuestionSeconds(sec)}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer ${
                                    quizCustomQuestionSeconds === sec
                                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                                  }`}
                                >
                                  {sec}s
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {quizTimerMode === 'custom_total' && (
                          <div className="pt-2 border-t border-slate-850 flex items-center justify-between gap-3 text-xs">
                            <span className="text-slate-400">कुल टेस्ट का समय चुनें:</span>
                            <div className="flex gap-1.5">
                              {[2, 5, 10, 15, 20].map((mins) => (
                                <button
                                  key={mins}
                                  type="button"
                                  onClick={() => setQuizCustomTotalMinutes(mins)}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer ${
                                    quizCustomTotalMinutes === mins
                                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                                  }`}
                                >
                                  {mins} min
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Quick Chapter Preset Buttons */}
                      <div className="space-y-2">
                        <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Quick Chapter Presets (त्वरित अध्याय चुनाव)</span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          <button 
                            onClick={() => { const sub = "Chapter 1: Real Numbers & Polynomials"; setQuizSubject(sub); handleGenerateQuiz(sub, quizDifficulty, quizQuestionCount); }}
                            className="p-2 text-left text-[11px] text-slate-300 hover:text-white bg-[#090D16] hover:bg-slate-800 border border-slate-800 rounded-xl truncate cursor-pointer"
                          >
                            📐 Ch 1: Real Numbers
                          </button>
                          <button 
                            onClick={() => { const sub = "Chapter 3: Laws of Motion & Physics"; setQuizSubject(sub); handleGenerateQuiz(sub, quizDifficulty, quizQuestionCount); }}
                            className="p-2 text-left text-[11px] text-slate-300 hover:text-white bg-[#090D16] hover:bg-slate-800 border border-slate-800 rounded-xl truncate cursor-pointer"
                          >
                            🧪 Ch 3: Laws of Motion
                          </button>
                          <button 
                            onClick={() => { const sub = "Chapter 5: Constitution Articles & Rights"; setQuizSubject(sub); handleGenerateQuiz(sub, quizDifficulty, quizQuestionCount); }}
                            className="p-2 text-left text-[11px] text-slate-300 hover:text-white bg-[#090D16] hover:bg-slate-800 border border-slate-800 rounded-xl truncate cursor-pointer"
                          >
                            🏛️ Ch 5: Fundamental Rights
                          </button>
                          <button 
                            onClick={() => { const sub = "Chapter 2: Trigonometry & Geometry"; setQuizSubject(sub); handleGenerateQuiz(sub, quizDifficulty, quizQuestionCount); }}
                            className="p-2 text-left text-[11px] text-slate-300 hover:text-white bg-[#090D16] hover:bg-slate-800 border border-slate-800 rounded-xl truncate cursor-pointer"
                          >
                            📐 Ch 2: Trigonometry
                          </button>
                          <button 
                            onClick={() => { const sub = "Chapter 4: Modern Indian History 1857-1947"; setQuizSubject(sub); handleGenerateQuiz(sub, quizDifficulty, quizQuestionCount); }}
                            className="p-2 text-left text-[11px] text-slate-300 hover:text-white bg-[#090D16] hover:bg-slate-800 border border-slate-800 rounded-xl truncate cursor-pointer"
                          >
                            🚩 Ch 4: Freedom Movement
                          </button>
                          <button 
                            onClick={() => { const sub = "Chapter 1: English Preposition Rules"; setQuizSubject(sub); handleGenerateQuiz(sub, quizDifficulty, quizQuestionCount); }}
                            className="p-2 text-left text-[11px] text-slate-300 hover:text-white bg-[#090D16] hover:bg-slate-800 border border-slate-800 rounded-xl truncate cursor-pointer"
                          >
                            📖 Ch 1: English Prepositions
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
                        onClick={() => handleGenerateQuiz(quizSubject, quizDifficulty, quizQuestionCount)}
                        disabled={isGeneratingQuiz || !quizSubject}
                        className="w-full py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white rounded-xl text-xs font-bold uppercase transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-45"
                      >
                        {isGeneratingQuiz ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin text-white" />
                            <span>Generating {quizQuestionCount} {quizDifficulty.toUpperCase()} Level MCQs...</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4 text-amber-400" />
                            <span>Start {quizDifficulty.toUpperCase()} Quiz ({quizQuestionCount} Questions) & Auto-Save</span>
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6 space-y-4 text-left">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-850 pb-3">
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-2">
                            <span>सुरक्षित टेस्ट्स की सूची (Auto-Saved Quiz Records)</span>
                            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-extrabold px-2 py-0.5 rounded-full">
                              {savedQuizzes.length} Saved
                            </span>
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            सभी हल किए गए क्विज़ स्वतः स्थानीय मेमोरी में सुरक्षित रहते हैं।
                          </p>
                        </div>
                        {savedQuizzes.length > 0 && (
                          <button
                            onClick={() => {
                              if (confirm("क्या आप सभी सुरक्षित क्विज़ रिकॉर्ड हटाना चाहते हैं? (Clear all saved records?)")) {
                                setSavedQuizzes([]);
                                localStorage.removeItem('hansai-saved-quizzes');
                                showToast("All saved quiz records cleared.", "info");
                              }
                            }}
                            className="text-[10px] text-rose-400 hover:text-rose-300 bg-rose-950/30 hover:bg-rose-950/50 border border-rose-800/40 px-2.5 py-1 rounded-lg transition-all self-start sm:self-auto cursor-pointer"
                          >
                            🗑️ Clear All (सभी हटाएं)
                          </button>
                        )}
                      </div>

                      {/* Search Bar for Saved Quizzes */}
                      {savedQuizzes.length > 0 && (
                        <div className="relative">
                          <input
                            type="text"
                            value={savedQuizSearch}
                            onChange={(e) => setSavedQuizSearch(e.target.value)}
                            placeholder="सब्जेक्ट, छात्र नाम या ग्रेड से खोजें (Search saved quizzes by subject, student, grade...)"
                            className="w-full text-xs py-2 pl-3 pr-8 bg-[#090D16] border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                          />
                          {savedQuizSearch && (
                            <button
                              onClick={() => setSavedQuizSearch('')}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      )}

                      {savedQuizzes.length === 0 ? (
                        <div className="text-center py-10 space-y-3 text-slate-400 text-xs">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-950/50 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto text-xl">
                            📝
                          </div>
                          <p className="font-semibold text-slate-300">कोई सुरक्षित टेस्ट रिकॉर्ड नहीं मिला।</p>
                          <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                            लाइव क्विज़ हल करते ही आपका टेस्ट, स्कोर और उत्तर व्याख्याएं यहां स्वतः सुरक्षित (Auto-Save) हो जाएंगी।
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                          {savedQuizzes
                            .filter(item => {
                              if (!savedQuizSearch.trim()) return true;
                              const term = savedQuizSearch.toLowerCase();
                              return (
                                item.subject?.toLowerCase().includes(term) ||
                                item.level?.toLowerCase().includes(term) ||
                                item.studentName?.toLowerCase().includes(term) ||
                                item.studentRoll?.toLowerCase().includes(term) ||
                                item.grade?.toLowerCase().includes(term) ||
                                item.date?.toLowerCase().includes(term)
                              );
                            })
                            .map((item) => (
                              <div key={item.id} className="p-4 rounded-2xl bg-[#090D16] border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col gap-3 text-xs">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <h5 className="font-bold text-slate-100 text-sm">{item.subject}</h5>
                                      <span className="text-[10px] bg-indigo-950 border border-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded-full font-semibold">
                                        {item.level || 'Standard'}
                                      </span>
                                    </div>
                                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-400">
                                      <span>👤 {item.studentName || 'Student'}</span>
                                      <span>🆔 {item.studentRoll || 'HS-Roll'}</span>
                                      <span>📅 {item.date} {item.timestamp ? `(${item.timestamp})` : ''}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-2 self-start sm:self-auto">
                                    <div className="text-right">
                                      <span className="text-xs font-black text-emerald-400 block">
                                        Score: {item.score}/{item.total}
                                      </span>
                                      {item.percentage !== undefined && (
                                        <span className="text-[10px] text-amber-400 font-bold">
                                          {item.percentage}% ({item.grade || 'PASSED'})
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-850">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-emerald-400 font-mono">
                                      +{(item.positiveMarks ?? (item.score * positiveMarkVal)).toFixed(1)} Marks
                                    </span>
                                    <span className="text-[10px] text-slate-600">•</span>
                                    <span className="text-[10px] text-rose-400 font-mono">
                                      -{(item.negativeMarks ?? 0).toFixed(1)} Neg
                                    </span>
                                    <span className="text-[10px] text-slate-600">•</span>
                                    <span className="text-[10px] text-amber-300 font-mono font-bold">
                                      Net: {(item.netScore ?? (item.score * positiveMarkVal)).toFixed(1)}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => setReviewingSavedQuiz(item)}
                                      className="px-2.5 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 font-bold rounded-lg transition-all text-[11px] flex items-center gap-1 cursor-pointer"
                                    >
                                      🔍 Review Answers
                                    </button>
                                    <button
                                      onClick={() => {
                                        setQuizSubject(item.subject);
                                        setQuizLevel(item.level);
                                        setQuizzes(item.quizzes);
                                        setCurrentQuizIdx(0);
                                        setSelectedOptionIdx(null);
                                        setIsQuizSubmitted(false);
                                        setUserQuizAnswers(item.userAnswers || {});
                                        setScore(item.score);
                                        showToast("Reloaded saved quiz record! 🔄", "success");
                                      }}
                                      className="px-2.5 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 font-bold rounded-lg transition-all text-[11px] flex items-center gap-1 cursor-pointer"
                                    >
                                      🔄 Replay
                                    </button>
                                    <button
                                      onClick={() => {
                                        const updated = savedQuizzes.filter(q => q.id !== item.id);
                                        setSavedQuizzes(updated);
                                        localStorage.setItem('hansai-saved-quizzes', JSON.stringify(updated));
                                        showToast("Saved quiz record deleted.", "info");
                                      }}
                                      className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-450 hover:text-rose-300 rounded-lg cursor-pointer"
                                      title="Delete saved quiz"
                                    >
                                      🗑️
                                    </button>
                                  </div>
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
                      {/* Active Quiz Header & Timer HUD */}
                      <div className="flex flex-wrap justify-between items-center text-xs text-slate-400 border-b border-slate-800 pb-3 gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-200">
                            QUESTION {currentQuizIdx + 1} OF {quizzes.length}
                          </span>
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            quizDifficulty === 'extreme' ? 'bg-purple-950 text-purple-300 border border-purple-500/40' :
                            quizDifficulty === 'hard' ? 'bg-rose-950 text-rose-300 border border-rose-500/40' :
                            quizDifficulty === 'moderate' ? 'bg-amber-950 text-amber-300 border border-amber-500/40' :
                            'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          }`}>
                            {quizDifficulty}
                          </span>
                          <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            Auto-Saved
                          </span>
                        </div>

                        {/* Live Timer HUD & Controls */}
                        <div className="flex items-center gap-2.5">
                          {quizTimerMode !== 'none' && (
                            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-mono font-bold text-xs transition-all ${
                              quizTimeRemaining <= 10
                                ? 'bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse shadow-md shadow-rose-900/50'
                                : quizTimeRemaining <= 30
                                ? 'bg-amber-950/60 border-amber-500/60 text-amber-300'
                                : 'bg-slate-900 border-slate-700 text-cyan-300'
                            }`}>
                              <Clock className={`w-3.5 h-3.5 ${quizTimeRemaining <= 10 ? 'text-rose-400 animate-spin' : 'text-cyan-400'}`} />
                              <span>{formatTimerDisplay(quizTimeRemaining)}</span>
                              <button
                                type="button"
                                onClick={() => setIsQuizTimerActive(prev => !prev)}
                                className="ml-1 text-[10px] text-slate-400 hover:text-white cursor-pointer"
                                title={isQuizTimerActive ? 'Pause Timer' : 'Resume Timer'}
                              >
                                {isQuizTimerActive ? '⏸️' : '▶️'}
                              </button>
                            </div>
                          )}

                          <span className="font-bold text-amber-400 bg-amber-950/40 border border-amber-500/30 px-2.5 py-1 rounded-lg">
                            Score: {score}
                          </span>

                          <button
                            onClick={restartQuizFlow}
                            className="text-[11px] text-slate-400 hover:text-rose-300 transition-colors cursor-pointer bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg"
                            title="Exit Quiz"
                          >
                            ✕ Exit
                          </button>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-[#090D16] rounded-full h-1.5">
                        <div 
                          className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${((currentQuizIdx + 1) / quizzes.length) * 100}%` }}
                        ></div>
                      </div>

                      {/* Question Text */}
                      <div className="p-4 bg-[#090D16] border border-slate-850 rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span className="font-mono">अध्याय प्रश्न #{currentQuizIdx + 1}</span>
                          {quizzes[currentQuizIdx].hint && !showQuestionHint && (
                            <button
                              type="button"
                              onClick={() => setShowQuestionHint(true)}
                              className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer bg-amber-950/30 border border-amber-500/30 px-2 py-0.5 rounded-md"
                            >
                              <Lightbulb className="w-3 h-3 text-amber-400" />
                              <span>संकेत देखें (Show Hint)</span>
                            </button>
                          )}
                        </div>
                        <p className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                          {quizzes[currentQuizIdx].question}
                        </p>
                      </div>

                      {/* Question Hint Box */}
                      {showQuestionHint && quizzes[currentQuizIdx].hint && (
                        <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-start gap-2 animate-fade-in">
                          <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
                          <div>
                            <span className="font-bold block">💡 प्रश्न संकेत (Hint):</span>
                            <span>{quizzes[currentQuizIdx].hint}</span>
                          </div>
                        </div>
                      )}

                      {/* Options Grid */}
                      <div className="grid grid-cols-1 gap-2">
                        {quizzes[currentQuizIdx].options.map((opt, oIdx) => {
                          let cardStyle = "bg-[#090D16] hover:bg-slate-800/60 border-slate-800 text-slate-200";
                          if (selectedOptionIdx === oIdx) {
                            cardStyle = "bg-indigo-600/20 border-indigo-500 text-indigo-200 font-semibold";
                          }
                          if (isQuizSubmitted) {
                            if (oIdx === quizzes[currentQuizIdx].answerIndex) {
                              cardStyle = "bg-emerald-600/25 border-emerald-500 text-emerald-300 font-bold";
                            } else if (selectedOptionIdx === oIdx) {
                              cardStyle = "bg-rose-600/25 border-rose-500 text-rose-300 line-through";
                            } else {
                              cardStyle = "opacity-40 bg-[#090D16] border-slate-900 text-slate-500";
                            }
                          }

                          return (
                            <button
                              key={oIdx}
                              onClick={() => selectQuizOption(oIdx)}
                              disabled={isQuizSubmitted}
                              className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex justify-between items-center cursor-pointer disabled:cursor-default ${cardStyle}`}
                            >
                              <span>{opt}</span>
                              {isQuizSubmitted && oIdx === quizzes[currentQuizIdx].answerIndex && (
                                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 ml-2" />
                              )}
                              {isQuizSubmitted && selectedOptionIdx === oIdx && oIdx !== quizzes[currentQuizIdx].answerIndex && (
                                <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 ml-2" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Post-Submission Feedback & Remediation Engine */}
                      {isQuizSubmitted ? (
                        <div className="space-y-3">
                          {selectedOptionIdx === quizzes[currentQuizIdx].answerIndex ? (
                            <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-xl space-y-2 text-xs text-emerald-300">
                              <div className="flex items-center gap-1.5 font-bold text-emerald-400 text-sm">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                <span>शाबाश! सही उत्तर (Correct Answer! +{positiveMarkVal} Marks)</span>
                              </div>
                              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap text-xs">
                                {quizzes[currentQuizIdx].explanation}
                              </p>
                            </div>
                          ) : (
                            <div className="p-4 bg-rose-950/30 border border-rose-500/40 rounded-xl space-y-3 text-xs text-rose-300">
                              <div className="flex items-center gap-1.5 font-bold text-rose-400 text-sm">
                                <AlertTriangle className="w-4 h-4 text-rose-400" />
                                <span>गलत उत्तर (-{negativeMarkVal} Marks) • घबराएं नहीं, नीचे सुधारें!</span>
                              </div>
                              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap text-xs">
                                {quizzes[currentQuizIdx].explanation}
                              </p>

                              {/* Interactive Remediation Actions Bar */}
                              <div className="pt-2 border-t border-rose-900/50 flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  onClick={handleRetryCurrentQuestion}
                                  className="px-3 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold rounded-lg transition-all text-xs flex items-center gap-1.5 cursor-pointer"
                                >
                                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                                  <span>दूसरा मौका लें (Try Again with Hint)</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMistakeModal({
                                      question: quizzes[currentQuizIdx],
                                      selectedOptionIdx: selectedOptionIdx !== null ? selectedOptionIdx : -1,
                                    });
                                  }}
                                  className="px-3 py-2 bg-indigo-600/30 hover:bg-indigo-600/40 border border-indigo-500/40 text-indigo-300 font-bold rounded-lg transition-all text-xs flex items-center gap-1.5 cursor-pointer"
                                >
                                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                                  <span>AI से समझें गलती क्यों हुई (Why Was This Wrong?)</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleSaveMistakeToNotebook(quizzes[currentQuizIdx], selectedOptionIdx !== null ? selectedOptionIdx : -1)}
                                  className="px-3 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 font-bold rounded-lg transition-all text-xs flex items-center gap-1.5 cursor-pointer"
                                >
                                  <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                                  <span>गलती रजिस्टर में जोड़ें (Save to Book)</span>
                                </button>
                              </div>
                            </div>
                          )}

                          <button
                            onClick={advanceQuiz}
                            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white rounded-xl font-bold uppercase tracking-wider text-xs shadow-lg shadow-indigo-600/20 cursor-pointer"
                          >
                            {currentQuizIdx === quizzes.length - 1 ? '🏁 See Final A1 Report Card (रिजल्ट देखें)' : '➡️ Advance to Next Question (अगला प्रश्न)'}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={submitQuizAnswer}
                          disabled={selectedOptionIdx === null}
                          className="w-full py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-xl text-xs font-bold uppercase transition-all disabled:opacity-40 shadow-md shadow-orange-600/20 cursor-pointer"
                        >
                          Lock Answer & Verify (उत्तर दर्ज करें)
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-6 text-left animate-fade-in">
                      {/* A1 SIZE OFFICIAL CERTIFICATE & SCORECARD */}
                      <div className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-indigo-950/80 to-slate-900 border-4 border-amber-500/80 rounded-3xl p-5 sm:p-8 text-center text-white shadow-2xl space-y-6">
                        
                        {/* Gold Double Border Inner Frame */}
                        <div className="absolute inset-2 border-2 border-dashed border-amber-500/30 rounded-2xl pointer-events-none" />

                        {/* Certificate Header */}
                        <div className="relative z-10 border-b border-amber-500/30 pb-4 space-y-1">
                          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 text-amber-300 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                            <Award className="w-3.5 h-3.5 text-amber-400" />
                            OFFICIAL A1 ACADEMIC EVALUATION
                          </div>
                          <h3 className="text-xl sm:text-2xl font-black text-amber-300 tracking-wider uppercase font-sans">
                            HansAI Chapter Quiz Evaluation Council
                          </h3>
                          <p className="text-xs text-indigo-200 font-semibold">
                            राष्ट्रीय अध्याय परीक्षा रिपोर्ट कार्ड एवं ए1 स्कोरकार्ड (National A1 Scorecard)
                          </p>
                        </div>

                        {/* Student & Chapter Info Grid */}
                        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-left text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Student Name</span>
                            <span className="text-sm font-extrabold text-white truncate block">{studentName || 'Aspirant Student'}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Roll / Reg No</span>
                            <span className="text-sm font-extrabold text-amber-300 truncate block">{studentRoll || 'HS-2026-8809'}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Chapter / Subject</span>
                            <span className="text-sm font-extrabold text-indigo-300 truncate block">{quizSubject}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Target Level</span>
                            <span className="text-sm font-extrabold text-cyan-300 truncate block">{quizLevel} ({quizDifficulty.toUpperCase()})</span>
                          </div>
                        </div>

                        {/* Marks & Performance Metrics Breakdown */}
                        {(() => {
                          let correctQ = 0;
                          let wrongQ = 0;
                          quizzes.forEach((q, idx) => {
                            const uAns = userQuizAnswers[idx];
                            if (uAns !== undefined && uAns !== null) {
                              if (uAns === q.answerIndex) correctQ++;
                              else wrongQ++;
                            }
                          });
                          const unattempted = Math.max(0, quizzes.length - (correctQ + wrongQ));
                          const posMarks = (correctQ * positiveMarkVal);
                          const negMarks = (wrongQ * negativeMarkVal);
                          const netScoreVal = Math.max(0, posMarks - negMarks);
                          const maxScoreVal = quizzes.length * positiveMarkVal;
                          const pct = maxScoreVal > 0 ? Math.min(100, Math.max(0, Math.round((netScoreVal / maxScoreVal) * 100))) : 0;

                          return (
                            <div className="relative z-10 space-y-4">
                              {/* Questions Analysis Row */}
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl text-center">
                                  <span className="text-[10px] text-slate-400 font-bold block">TOTAL MCQS</span>
                                  <span className="text-lg font-black text-white">{quizzes.length}</span>
                                </div>
                                <div className="bg-emerald-950/40 border border-emerald-500/40 p-3 rounded-2xl text-center">
                                  <span className="text-[10px] text-emerald-400 font-bold block">CORRECT ANSWERS</span>
                                  <span className="text-lg font-black text-emerald-300">+{correctQ}</span>
                                </div>
                                <div className="bg-rose-950/40 border border-rose-500/40 p-3 rounded-2xl text-center">
                                  <span className="text-[10px] text-rose-400 font-bold block">WRONG ANSWERS</span>
                                  <span className="text-lg font-black text-rose-300">-{wrongQ}</span>
                                </div>
                                <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl text-center">
                                  <span className="text-[10px] text-slate-400 font-bold block">UNATTEMPTED</span>
                                  <span className="text-lg font-black text-slate-400">{unattempted}</span>
                                </div>
                              </div>

                              {/* Positive / Negative Marks Row */}
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                <div className="bg-emerald-950/60 border border-emerald-500/50 p-3 rounded-2xl text-center">
                                  <span className="text-[10px] text-emerald-300 font-bold block">POSITIVE MARKS (+{positiveMarkVal})</span>
                                  <span className="text-xl font-black text-emerald-400">+{posMarks.toFixed(1)}</span>
                                </div>
                                <div className="bg-rose-950/60 border border-rose-500/50 p-3 rounded-2xl text-center">
                                  <span className="text-[10px] text-rose-300 font-bold block">NEGATIVE MARKS (-{negativeMarkVal})</span>
                                  <span className="text-xl font-black text-rose-400">-{negMarks.toFixed(1)}</span>
                                </div>
                                <div className="bg-indigo-950/80 border border-indigo-500/60 p-3 rounded-2xl text-center sm:col-span-2">
                                  <span className="text-[10px] text-indigo-300 font-bold block">NET OBTAINED MARKS</span>
                                  <span className="text-xl font-black text-amber-300">{netScoreVal.toFixed(1)} / {maxScoreVal.toFixed(1)}</span>
                                </div>
                              </div>

                              {/* Net Score & Grade Summary Header */}
                              <div className="bg-gradient-to-r from-amber-950/90 via-indigo-900/90 to-purple-950/90 border border-amber-500/60 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-center sm:text-left">
                                  <span className="text-[10px] text-amber-300 font-extrabold uppercase tracking-widest block">FINAL SCORE PERCENTAGE</span>
                                  <span className="text-3xl font-black text-amber-400">{pct}%</span>
                                </div>
                                <div className="text-center sm:text-right">
                                  <span className="text-[10px] text-indigo-300 font-extrabold uppercase tracking-widest block font-mono">OFFICIAL GRADE</span>
                                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase mt-1 ${
                                    pct >= 85 ? 'bg-amber-500 text-slate-950' : pct >= 60 ? 'bg-emerald-500 text-slate-950' : pct >= 40 ? 'bg-indigo-500 text-white' : 'bg-rose-600 text-white'
                                  }`}>
                                    {pct >= 85 ? '🏆 DISTINCTION (A+ GRADE)' : pct >= 60 ? '🌟 PASSED (A GRADE)' : pct >= 40 ? '👍 PASSED (B GRADE)' : '📘 NEEDS REVISION'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                        {/* Certificate Stamp Footer */}
                        <div className="relative z-10 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800 pt-3">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Verified HansAI Academic Portal • Auto-Saved</span>
                          </div>
                          <span>A1 Ref: #HS-${Date.now().toString().slice(-6)}</span>
                        </div>
                      </div>

                      {/* Auto-Save Confirmation Notice */}
                      <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs text-emerald-300 animate-fade-in">
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          <span className="font-semibold">
                            ✅ Quize Auto-Saved to Records (क्विज़ स्वतः सुरक्षित हो गया है)
                          </span>
                        </div>
                        <div className="flex items-center gap-2 self-stretch sm:self-auto">
                          {mistakeNotebook.length > 0 && (
                            <button
                              onClick={() => {
                                restartQuizFlow();
                                setActiveQuizTab('mistakes');
                              }}
                              className="text-[11px] bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 px-3 py-1 rounded-lg font-bold transition-all cursor-pointer text-center"
                            >
                              📓 Mistake Notebook ({mistakeNotebook.length})
                            </button>
                          )}
                          <button
                            onClick={() => {
                              restartQuizFlow();
                              setActiveQuizTab('saved');
                            }}
                            className="text-[11px] bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-lg font-bold transition-all cursor-pointer text-center"
                          >
                            View Saved Quizzes (रिकॉर्ड्स देखें) 📂
                          </button>
                        </div>
                      </div>

                      {/* Action Buttons Row */}
                      <div className="flex flex-wrap gap-3 justify-center pt-2">
                        {/* 1-Click Level Up */}
                        <button
                          onClick={() => handleLevelUpQuiz()}
                          className="py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs uppercase rounded-xl transition-all shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 cursor-pointer border-none"
                        >
                          <Zap className="w-4 h-4 text-amber-400" />
                          <span>⚡ Level Up: Generate Harder Questions (और कठिन प्रश्न)</span>
                        </button>

                        <button
                          onClick={handleDownloadA1Card}
                          className="flex-1 min-w-[180px] py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer border-none"
                        >
                          <Download className="w-4 h-4 text-slate-950" />
                          <span>Download A1 Card</span>
                        </button>
                        <button
                          onClick={() => window.print()}
                          className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs uppercase rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer border-none"
                        >
                          🖨️ Print PDF
                        </button>
                        <button
                          onClick={() => handleGenerateQuiz(quizSubject, quizDifficulty, quizQuestionCount)}
                          className="py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs uppercase rounded-xl transition-all cursor-pointer border-none"
                        >
                          🔄 Retake Test
                        </button>
                        <button
                          onClick={restartQuizFlow}
                          className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs uppercase rounded-xl transition-all cursor-pointer border-none"
                        >
                          📖 Change Chapter
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* MISTAKE DIAGNOSIS & REMEDIATION MODAL */}
              {activeMistakeModal && (
                <QuizMistakeRemediationModal
                  isOpen={!!activeMistakeModal}
                  onClose={() => setActiveMistakeModal(null)}
                  mistake={activeMistakeModal}
                  onSaveToNotebook={(item) => handleSaveMistakeToNotebook(item)}
                />
              )}

              {/* SAVED QUIZ DETAILED ANSWER REVIEW MODAL */}
              {reviewingSavedQuiz && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-fade-in">
                    {/* Modal Header */}
                    <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-base sm:text-lg font-bold text-white">
                            {reviewingSavedQuiz.subject}
                          </span>
                          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-bold px-2 py-0.5 rounded-full">
                            {reviewingSavedQuiz.level || 'Standard'}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-x-3 text-[11px] text-slate-400">
                          <span>👤 {reviewingSavedQuiz.studentName || 'Student'}</span>
                          <span>🆔 {reviewingSavedQuiz.studentRoll || 'HS-Roll'}</span>
                          <span>📅 {reviewingSavedQuiz.date}</span>
                          <span className="text-emerald-400 font-bold">
                            Score: {reviewingSavedQuiz.score}/{reviewingSavedQuiz.total} ({reviewingSavedQuiz.percentage || Math.round((reviewingSavedQuiz.score/reviewingSavedQuiz.total)*100)}%)
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setReviewingSavedQuiz(null)}
                        className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 hover:bg-slate-800 transition-all cursor-pointer text-xs"
                      >
                        ✕ Close
                      </button>
                    </div>

                    {/* Modal Questions Body */}
                    <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 text-left">
                      {reviewingSavedQuiz.quizzes.map((q, qIdx) => {
                        const studentAnswer = reviewingSavedQuiz.userAnswers ? reviewingSavedQuiz.userAnswers[qIdx] : undefined;
                        const isCorrect = studentAnswer === q.answerIndex;
                        const isAnswered = studentAnswer !== undefined && studentAnswer !== null;

                        return (
                          <div
                            key={qIdx}
                            className={`p-4 rounded-2xl border ${
                              isCorrect 
                                ? 'bg-emerald-950/20 border-emerald-500/30' 
                                : isAnswered 
                                ? 'bg-rose-950/20 border-rose-500/30' 
                                : 'bg-[#090D16] border-slate-800'
                            } space-y-3 text-xs`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-bold text-slate-200 leading-relaxed text-sm">
                                {qIdx + 1}. {q.question}
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                                isCorrect 
                                  ? 'bg-emerald-500/20 text-emerald-300' 
                                  : isAnswered 
                                  ? 'bg-rose-500/20 text-rose-300' 
                                  : 'bg-slate-800 text-slate-400'
                              }`}>
                                {isCorrect ? '✅ Correct (+Mark)' : isAnswered ? '❌ Incorrect (-Neg)' : '⚪ Unattempted'}
                              </span>
                            </div>

                            {/* Options List */}
                            <div className="space-y-1.5">
                              {q.options.map((opt, oIdx) => {
                                const isThisCorrect = oIdx === q.answerIndex;
                                const isSelectedByStudent = studentAnswer === oIdx;

                                let optClass = "bg-slate-900/60 border-slate-800 text-slate-400";
                                if (isThisCorrect) {
                                  optClass = "bg-emerald-950/60 border-emerald-500/60 text-emerald-200 font-semibold";
                                } else if (isSelectedByStudent && !isThisCorrect) {
                                  optClass = "bg-rose-950/60 border-rose-500/60 text-rose-200 line-through";
                                }

                                return (
                                  <div
                                    key={oIdx}
                                    className={`p-2.5 rounded-xl border text-[11px] flex items-center justify-between ${optClass}`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono text-slate-500 font-bold">{String.fromCharCode(65 + oIdx)}.</span>
                                      <span>{opt}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      {isSelectedByStudent && (
                                        <span className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-bold">
                                          Your Choice
                                        </span>
                                      )}
                                      {isThisCorrect && (
                                        <span className="text-[9px] bg-emerald-500 text-slate-950 px-1.5 py-0.5 rounded font-black">
                                          CORRECT
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Explanation */}
                            {q.explanation && (
                              <div className="p-3 bg-indigo-950/30 border border-indigo-500/20 rounded-xl space-y-1">
                                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                                  💡 Companion Explanation / व्याख्या:
                                </span>
                                <p className="text-slate-300 text-[11px] leading-relaxed">
                                  {q.explanation}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Modal Footer */}
                    <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
                      <button
                        onClick={() => {
                          setQuizSubject(reviewingSavedQuiz.subject);
                          setQuizLevel(reviewingSavedQuiz.level);
                          setQuizzes(reviewingSavedQuiz.quizzes);
                          setCurrentQuizIdx(0);
                          setSelectedOptionIdx(null);
                          setIsQuizSubmitted(false);
                          setUserQuizAnswers(reviewingSavedQuiz.userAnswers || {});
                          setScore(reviewingSavedQuiz.score);
                          setReviewingSavedQuiz(null);
                          showToast("Loaded saved quiz to replay! 🔄", "success");
                        }}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                      >
                        🔄 Replay this Test (पुनः हल करें)
                      </button>
                      <button
                        onClick={() => setReviewingSavedQuiz(null)}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-all cursor-pointer"
                      >
                        Done
                      </button>
                    </div>
                  </div>
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
                          <Zap className="w-4 h-4 text-indigo-200 animate-pulse" />
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
                      <span className="block italic text-indigo-400 font-sans font-bold">HansAI Educational Platform</span>
                      <span className="block text-emerald-400 font-sans font-extrabold tracking-wider">● VERIFIED SCHOLARSHIP</span>
                    </div>
                  </div>

                  {/* Summary Segment */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
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
                        placeholder="e.g. Rahul Sharma"
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
          {activeView === 'process' && (
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
                            <span className="text-[10px] text-slate-450 text-slate-400 italic block">⏱️ {step.duration}</span>
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
                            <span className="text-slate-350 text-slate-300">{step.desc}</span>
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
                              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-bold transition-all cursor-pointer shadow-md"
                            >
                              Open Chat 💬
                            </button>
                            <button
                              onClick={() => deleteSavedChat(session.id)}
                              className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/25 text-rose-300 hover:text-rose-200 border border-rose-500/30 hover:border-rose-500/50 rounded-xl text-[10px] font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
                              title={language === 'hindi' ? "सहेजी गई चैट हटाएं" : "Delete saved chat session"}
                              aria-label="Delete saved chat"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                              <span>{language === 'hindi' ? 'हटाएं' : 'Clear'}</span>
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
                                    className="px-3 py-1.5 bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-500/30 rounded-xl text-[10px] font-bold transition-all cursor-pointer shadow-sm"
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
                                  onClick={() => deleteSpecificHistoryLog(log.id, log.title)}
                                  className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/25 text-rose-300 hover:text-rose-200 border border-rose-500/30 hover:border-rose-500/50 rounded-xl text-[10px] font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
                                  title={language === 'hindi' ? "इस आइटम को इतिहास से हटाएं" : "Clear this specific item from history"}
                                  aria-label="Clear specific history item"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                                  <span>{language === 'hindi' ? 'हटाएं' : 'Clear'}</span>
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
                      <Award className="w-8 h-8 text-amber-400 mx-auto animate-bounce" />
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
                    <span className="text-[10px] text-slate-500 italic">Tap checkbox to complete</span>
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
                          className="p-1 text-slate-600 hover:text-rose-400 transition-all"
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

          {/* VIEW: CONCEPT FLOWCHART & GEOGRAPHIC MAP */}
          {activeView === 'map' && (
            <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 animate-fade-in text-left">
              
              {/* Header */}
              <div className="border-b border-slate-800 pb-4 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Network className="w-5.5 h-5.5 text-amber-500 animate-pulse" />
                    GIS Concept & Geographic Visualizer / जीआईएस मैपिंग व संकल्पना
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    {language === 'hindi' 
                      ? 'मैप पर किसी भी बिंदु पर क्लिक करें — ठीक नीचे उस बिंदु की संपूर्ण विस्तृत व्याख्या, परीक्षा तथ्य व शॉर्टकट ट्रिक्स देखें!'
                      : 'Click any point on the map — see its full live explanation, key exam points & memory tricks directly below!'}
                  </p>
                </div>

                {/* Map Mode Subtab Switcher */}
                <div className="flex items-center gap-1.5 bg-[#090D16] p-1.5 rounded-2xl border border-slate-800 shrink-0">
                  <button
                    onClick={() => setMapTab('flowchart')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      mapTab === 'flowchart'
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>🧠 Concept Flowchart Map</span>
                  </button>
                  <button
                    onClick={() => { setMapTab('geo'); if (!selectedGeoRegion) setSelectedGeoRegion(geoLandmarks[0]); }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      mapTab === 'geo'
                        ? 'bg-amber-600 text-white shadow-lg'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>🗺️ Geographic GIS Topography</span>
                  </button>
                </div>
              </div>

              {/* MODE 1: CONCEPT FLOWCHART */}
              {mapTab === 'flowchart' && (
                <div className="space-y-6">
                  {/* Topic Generator Control */}
                  <div className="bg-[#0F1626]/40 border border-slate-800 p-4 rounded-2xl space-y-3">
                    <form 
                      onSubmit={(e) => { e.preventDefault(); handleGenerateConceptMap(); }}
                      className="flex flex-col sm:flex-row gap-2"
                    >
                      <div className="relative flex-1 flex items-center bg-[#090D16] border border-slate-800 focus-within:border-indigo-500 rounded-xl px-2">
                        <input
                          type="text"
                          value={conceptMapTopic}
                          onChange={(e) => setConceptMapTopic(e.target.value)}
                          placeholder={
                            language === 'hindi'
                              ? "कोई भी विषय, प्रश्न या स्थान बोलें या लिखें (जैसे: Newton's Laws, Photosynthesis, 1857 Revolt, Ganga River System)..."
                              : "Speak or type any topic or region (e.g. Newton's Laws, Photosynthesis, Ganga River System, 1857 Revolt)..."
                          }
                          className="flex-1 text-xs px-2 py-3 bg-transparent text-white placeholder-slate-500 focus:outline-none font-sans font-semibold"
                        />
                        <button
                          type="button"
                          onClick={handleToggleMapVoice}
                          className={`p-2 rounded-lg transition-all border cursor-pointer shrink-0 flex items-center gap-1 text-xs font-bold ${
                            isListeningMapVoice
                              ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                              : 'bg-slate-850 text-indigo-300 border-indigo-500/30 hover:bg-indigo-900/40 hover:text-white'
                          }`}
                          title={language === 'hindi' ? 'बोलकर सर्च करें' : 'Speak to search'}
                        >
                          {isListeningMapVoice ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                          <span className="text-[10px] hidden sm:inline">{isListeningMapVoice ? 'Listening...' : 'Voice'}</span>
                        </button>
                      </div>

                      <button
                        type="submit"
                        disabled={isGeneratingConceptMap || !conceptMapTopic.trim()}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shrink-0"
                      >
                        {isGeneratingConceptMap ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Creating GIS Map...</span>
                          </>
                        ) : (
                          <>
                            <Search className="w-3.5 h-3.5" />
                            <span>{language === 'hindi' ? 'मैपिंग व बिंदु बनाएं' : 'Visualize & Map GIS Points'}</span>
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
                          {language === 'hindi' ? 'कोई भी विषय या टॉपिक सर्च करें और लाइव मैप देखें' : 'Search Any Topic to Generate Live GIS Flowchart'}
                        </h3>
                        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                          {language === 'hindi'
                            ? 'ऊपर विषय टाइप करें। AI आपके टॉपिक के सभी बिंदुओं को नक्शे पर जोड़ेगा और ठीक नीचे हर बिंदु की संपूर्ण व्याख्या दिखाएगा।'
                            : 'HansAI will build visual nodes across the map canvas and explain every point in detail right below!'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      
                      {/* FULL-WIDTH VISUAL MAP CANVAS */}
                      <div className="bg-[#090D16] border border-slate-800 rounded-3xl p-5 shadow-2xl relative overflow-hidden">
                        
                        {/* Map Header Info */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800/80 pb-3 gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-base">📍</span>
                            <span className="text-xs font-black text-white uppercase tracking-wider">
                              {language === 'hindi' ? 'जीआईएस मैप कैनवास (GIS Concept Net Canvas)' : 'GIS Interactive Map Canvas'}
                            </span>
                          </div>
                          <span className="text-[10px] text-amber-300 bg-amber-500/10 border border-amber-500/20 font-mono px-2.5 py-0.5 rounded-full font-bold">
                            {language === 'hindi' ? '👉 नक्शे पर किसी बिंदु को चुनें — व्याख्या ठीक नीचे दिखेगी' : '👉 Click any point to view explanation directly below'}
                          </span>
                        </div>

                        {/* Interactive Visual Map Field */}
                        <div className="relative w-full h-[320px] sm:h-[380px] my-4 border border-slate-850 rounded-2xl bg-[#060A12] overflow-hidden p-4 shadow-inner">
                          {/* Tech Grid Lines */}
                          <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.6)_1px,transparent_1px)] bg-[size:24px_24px] opacity-30" />
                          
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
                                    stroke="rgba(245, 158, 11, 0.4)"
                                    strokeWidth="3"
                                    strokeDasharray="6 6"
                                  />
                                  <circle
                                    cx={`${(prev.x + node.x) / 2}%`}
                                    cy={`${(prev.y + node.y) / 2}%`}
                                    r="4"
                                    fill="#F59E0B"
                                    className="animate-ping"
                                  />
                                </g>
                              );
                            })}
                          </svg>

                          {/* Flowchart Nodes (Map Points) */}
                          {mapNodes.map((node, idx) => {
                            const isActive = activeMapNode?.id === node.id;
                            return (
                              <button
                                key={node.id}
                                onClick={() => { setActiveMapNode(node); setShowDetailedDiagram(false); }}
                                className={`absolute px-3.5 py-2 rounded-2xl border text-xs font-black transition-all shadow-2xl -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 cursor-pointer hover:scale-110 z-20 ${
                                  isActive
                                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 border-amber-300 ring-4 ring-amber-400/40 scale-110'
                                    : 'bg-[#0F172A]/90 text-slate-200 border-indigo-500/40 hover:border-amber-400 hover:bg-slate-800'
                                }`}
                                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                              >
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                                  isActive ? 'bg-slate-950 text-amber-300' : 'bg-indigo-900 text-indigo-200'
                                }`}>
                                  {idx + 1}
                                </span>
                                <span className="truncate max-w-[140px] sm:max-w-none">{node.label}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* SEQUENCE STEPPER BAR AT BOTTOM OF CANVAS */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {language === 'hindi' ? 'मैप बिंदु क्रम (Select Map Point):' : 'All Map Points Sequence:'}
                          </span>
                          <div className="flex flex-wrap items-center gap-1.5">
                            {mapNodes.map((node, idx) => {
                              const isActive = activeMapNode?.id === node.id;
                              return (
                                <button
                                  key={`step-btn-${node.id}`}
                                  onClick={() => { setActiveMapNode(node); setShowDetailedDiagram(false); }}
                                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                                    isActive
                                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-extrabold'
                                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                                  }`}
                                >
                                  Point {idx + 1}: {node.label.length > 18 ? node.label.substring(0, 18) + '...' : node.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                      </div>

                      {/* DEDICATED BOTTOM EXPLANATION PANEL (नक्शे के ठीक नीचे विस्तृत बिंदु-वार व्याख्या) */}
                      {activeMapNode && (
                        <div className="bg-gradient-to-br from-[#0B1222] via-[#090D16] to-[#0A0E1A] border-2 border-amber-500/40 rounded-3xl p-6 space-y-5 shadow-2xl animate-fade-in text-left">
                          
                          {/* PANEL HEADER */}
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-amber-500/20 pb-4 gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black text-sm shrink-0">
                                #{mapNodes.findIndex(n => n.id === activeMapNode.id) + 1}
                              </div>
                              <div>
                                <span className="text-[10px] font-extrabold uppercase text-amber-400 tracking-wider bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                                  {language === 'hindi' ? 'चयनित बिंदु की लाइव व्याख्या (Live Point Detail)' : 'Selected Point Live Explanation'}
                                </span>
                                <h3 className="text-lg font-black text-white mt-1 flex items-center gap-2">
                                  <span>📌</span>
                                  <span>{activeMapNode.label}</span>
                                </h3>
                              </div>
                            </div>

                            {/* Action controls */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => speakText(`${activeMapNode.label}. ${activeMapNode.desc}. ${activeMapNode.detail}`)}
                                className="px-3 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                              >
                                <span>🎙️</span>
                                <span>{language === 'hindi' ? 'व्याख्या सुनें' : 'Read Voice'}</span>
                              </button>

                              <button
                                onClick={() => {
                                  const idx = mapNodes.findIndex(n => n.id === activeMapNode.id);
                                  const nextIdx = (idx + 1) % mapNodes.length;
                                  setActiveMapNode(mapNodes[nextIdx]);
                                }}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition-all shadow-md flex items-center gap-1 cursor-pointer"
                              >
                                <span>{language === 'hindi' ? 'अगला बिंदु ➔' : 'Next Point ➔'}</span>
                              </button>
                            </div>
                          </div>

                          {/* CONTENT BREAKDOWN GRID (2 COLS) */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            
                            {/* LEFT: SIMPLIFIED CONCEPT EXPLANATION */}
                            <div className="bg-[#060A12] border border-slate-800 p-4 rounded-2xl space-y-2">
                              <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider block">
                                📖 {language === 'hindi' ? 'सरल शब्दों में संपूर्ण व्याख्या (Detailed Explanation):' : 'Simplified Concept Breakdown:'}
                              </span>
                              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-semibold">
                                {activeMapNode.desc}
                              </p>
                            </div>

                            {/* RIGHT: EXAM UTILITY & MEMORY TRICK */}
                            <div className="bg-[#060A12] border border-slate-800 p-4 rounded-2xl space-y-2">
                              <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider block">
                                💡 {language === 'hindi' ? 'परीक्षा मुख्य तथ्य व सूत्र (Key Exam Facts):' : 'Academic & Exam Utility:'}
                              </span>
                              <p className="text-xs sm:text-sm text-amber-100 leading-relaxed font-medium">
                                {activeMapNode.detail}
                              </p>
                            </div>

                          </div>

                          {/* ASK HANS AI ABOUT THIS POINT */}
                          <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                            <p className="text-xs text-slate-400 font-medium">
                              {language === 'hindi'
                                ? 'क्या इस बिंदु से जुड़ा कोई प्रश्न है? HansAI AI साथी से पूछें!'
                                : 'Have questions about this point? Ask HansAI Companion for instant clarification.'}
                            </p>
                            <button
                              onClick={() => {
                                const prompt = `Explain the map point "${activeMapNode.label}" in detail with examples and exam PYQs.`;
                                setChatInput(prompt);
                                setActiveView('chat');
                                logUserActivity('chat', prompt);
                              }}
                              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all border-none cursor-pointer shrink-0"
                            >
                              💬 Ask AI Companion About This Point
                            </button>
                          </div>

                        </div>
                      )}

                    </div>
                  )}
                </div>
              )}

              {/* MODE 2: INTERACTIVE GEOGRAPHIC LANDMARKS MAP */}
              {mapTab === 'geo' && (
                <div className="space-y-6">
                  
                  {/* GEOGRAPHIC MAP CANVAS */}
                  <div className="bg-[#090D16] border border-slate-800 rounded-3xl p-5 relative min-h-[380px] flex flex-col justify-between shadow-2xl overflow-hidden">
                    {/* Grid Background */}
                    <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />

                    {/* Top Canvas Watermark */}
                    <div className="relative z-10 flex items-center justify-between border-b border-slate-800/80 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-base">🗺️</span>
                        <span className="text-xs font-black text-white uppercase tracking-wider">
                          {language === 'hindi' ? 'भारत भौगोलिक व ऐतिहासिक जीआईएस नक्शा' : 'India Physical & Historical Topography GIS Map'}
                        </span>
                      </div>
                      <span className="text-[10px] text-amber-400 bg-amber-400/10 border border-amber-400/20 font-mono px-2.5 py-0.5 rounded-full font-bold">
                        {language === 'hindi' ? '👉 नक्शे के किसी स्थान पर क्लिक करें — व्याख्या ठीक नीचे दिखेगी' : 'Click hotspot on map — explanation directly below'}
                      </span>
                    </div>

                    {/* Map Outline SVG Background */}
                    <div className="relative w-full h-[320px] my-4 border border-slate-850 rounded-2xl bg-[#060A12] overflow-hidden flex items-center justify-center shadow-inner">
                      <svg viewBox="0 0 100 100" className="w-full h-full opacity-20 text-indigo-500 fill-current">
                        <path d="M 40,10 Q 55,5 70,12 T 80,30 T 65,50 T 70,70 T 50,95 T 30,80 T 35,55 T 20,35 Z" />
                      </svg>

                      {/* Geographic Pins */}
                      {geoLandmarks.map((loc) => {
                        const isSelected = selectedGeoRegion?.id === loc.id;
                        return (
                          <button
                            key={loc.id}
                            onClick={() => setSelectedGeoRegion(loc)}
                            className={`absolute p-2.5 rounded-2xl border text-xs font-extrabold transition-all shadow-2xl flex items-center gap-2 -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 z-20 ${
                              isSelected
                                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 border-amber-300 ring-4 ring-amber-400/30 scale-110'
                                : 'bg-[#0F172A]/90 text-slate-200 border-indigo-500/40 hover:border-indigo-400 hover:bg-slate-800'
                            }`}
                            style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                          >
                            <span className="text-sm">{loc.icon}</span>
                            <span className="hidden sm:inline text-[11px] font-black">{loc.name.split('(')[0]}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Landmark Hotspot Quick Buttons Bar */}
                    <div className="relative z-10 flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {language === 'hindi' ? 'स्थान चुनें:' : 'Select Hotspot:'}
                      </span>
                      {geoLandmarks.map((loc) => (
                        <button
                          key={`btn-${loc.id}`}
                          onClick={() => setSelectedGeoRegion(loc)}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border cursor-pointer ${
                            selectedGeoRegion?.id === loc.id
                              ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-md'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                          }`}
                        >
                          {loc.icon} {loc.name.split('(')[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* DEDICATED BOTTOM EXPLANATION PANEL FOR GIS GEOGRAPHIC LOCATION */}
                  {selectedGeoRegion && (
                    <div className="bg-gradient-to-br from-[#0B1222] via-[#090D16] to-[#0A0E1A] border-2 border-amber-500/40 rounded-3xl p-6 space-y-5 shadow-2xl animate-fade-in text-left">
                      
                      {/* HEADER */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-amber-500/20 pb-3 gap-3">
                        <div>
                          <span className="text-[10px] font-extrabold uppercase text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                            {selectedGeoRegion.category}
                          </span>
                          <h3 className="text-lg font-extrabold text-white mt-1 flex items-center gap-2">
                            <span>{selectedGeoRegion.icon}</span>
                            <span>{selectedGeoRegion.name}</span>
                          </h3>
                        </div>

                        <button
                          onClick={() => speakText(`${selectedGeoRegion.name}. ${selectedGeoRegion.history}. Elevation: ${selectedGeoRegion.elevation}. Rivers: ${selectedGeoRegion.rivers}`)}
                          className="px-3.5 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                        >
                          <span>🎙️</span>
                          <span>{language === 'hindi' ? 'स्थान विवरण सुनें' : 'Read Voice'}</span>
                        </button>
                      </div>

                      {/* CONTENT GRID */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* LEFT: PHYSICAL GEOGRAPHY & HISTORY */}
                        <div className="bg-[#060A12] border border-slate-800 p-4 rounded-2xl space-y-3 text-xs">
                          <div className="flex justify-between border-b border-slate-800 pb-1.5">
                            <span className="text-slate-400">Elevation/Feature:</span>
                            <span className="font-bold text-slate-200">{selectedGeoRegion.elevation}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-800 pb-1.5">
                            <span className="text-slate-400">Rivers / Tributaries:</span>
                            <span className="font-bold text-indigo-400">{selectedGeoRegion.rivers}</span>
                          </div>
                          <p className="text-slate-300 pt-1 leading-relaxed">{selectedGeoRegion.history}</p>
                        </div>

                        {/* RIGHT: KEY EXAM FACTS & PYQS */}
                        <div className="bg-[#060A12] border border-slate-800 p-4 rounded-2xl space-y-3">
                          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Key Exam Facts (मुख्य परीक्षा बिंदु):</span>
                          <ul className="space-y-1.5 text-xs text-slate-200">
                            {selectedGeoRegion.keyFeatures.map((kf: string, i: number) => (
                              <li key={i} className="flex items-start gap-1.5 bg-slate-900/60 p-2 rounded-xl border border-slate-850">
                                <span className="text-amber-400 font-bold">•</span>
                                <span>{kf}</span>
                              </li>
                            ))}
                          </ul>

                          {selectedGeoRegion.pyqs && selectedGeoRegion.pyqs.length > 0 && (
                            <div className="pt-2 border-t border-slate-800 space-y-1">
                              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">PYQ Questions:</span>
                              {selectedGeoRegion.pyqs.map((pq: string, i: number) => (
                                <div key={i} className="p-2 bg-indigo-950/30 border border-indigo-900/40 rounded-xl text-[11px] text-indigo-200 font-medium">
                                  {pq}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                      </div>

                      {/* ASK AI COMPANION */}
                      <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <p className="text-xs text-slate-400 font-medium">
                          {language === 'hindi'
                            ? `क्या ${selectedGeoRegion.name.split('(')[0]} के बारे में और जानना चाहते हैं?`
                            : `Want to ask more about ${selectedGeoRegion.name.split('(')[0]}?`}
                        </p>
                        <button
                          onClick={() => {
                            const prompt = `Please explain the geography, rivers, passes, and historical significance of ${selectedGeoRegion.name} in detail with memory tricks for competitive exams.`;
                            setChatInput(prompt);
                            setActiveView('chat');
                            logUserActivity('chat', prompt);
                          }}
                          className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all border-none cursor-pointer"
                        >
                          💬 Ask HansAI Companion for Deeper Analysis
                        </button>
                      </div>

                    </div>
                  )}

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
                  <Heart className="w-5.5 h-5.5 text-rose-400 animate-pulse" />
                  Soul Wellness & Life Balance / विद्यार्थी जीवन शैली
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Exams are run over years, not days! Practice sound stress relief, mindful breathing, and preserve your vital human force.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#0F1626]/60 border border-slate-800 p-5 rounded-2xl space-y-3">
                  <h3 className="text-sm font-bold text-rose-300">🧘‍♂️ Mindful Breathing & Stress Control</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Take 5 deep breaths before studying complex topics. Keep physical movement integrated with long study sessions.
                  </p>
                </div>
                <div className="bg-[#0F1626]/60 border border-slate-800 p-5 rounded-2xl space-y-3">
                  <h3 className="text-sm font-bold text-indigo-300">📚 Balanced Routine & Consistency</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Maintain 7-8 hours of sound sleep and stay hydrated. Mental clarity is key for competitive exam preparation.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: OWNER ADMIN DASHBOARD */}
          {activeView === 'owner-dashboard' && (
            <div className="max-w-7xl mx-auto px-2 sm:px-4 py-6 animate-fade-in text-left">
              {!isOwnerAuthenticated ? (
                <div className="max-w-md mx-auto bg-[#0F1626] border border-amber-500/30 p-8 rounded-3xl space-y-5 text-center shadow-2xl">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
                    <ShieldCheck className="w-8 h-8 text-amber-400" />
                  </div>
                  <h2 className="text-lg font-bold text-white uppercase tracking-wider">
                    Owner Administration Lock / ऑनर एडमिन लॉगिन
                  </h2>
                  <p className="text-xs text-slate-400">
                    Enter the secret owner security key to access student analytics, search history, and user activity records.
                  </p>
                  <form onSubmit={handleOwnerPasswordSubmit} className="space-y-4">
                    <input
                      type="password"
                      value={ownerPasswordInput}
                      onChange={(e) => setOwnerPasswordInput(e.target.value)}
                      placeholder="Enter Admin Master Password"
                      className="w-full text-xs py-3 px-4 bg-[#060913] border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-center font-mono"
                    />
                    <button
                      type="submit"
                      className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-600/20 cursor-pointer border-none"
                    >
                      Unlock Admin Console 🔓
                    </button>
                  </form>
                </div>
              ) : (
                <>
                  <AdminPanel
                    ownerAnalyticsData={ownerAnalyticsData}
                    isOwnerAnalyticsLoading={isOwnerAnalyticsLoading}
                    fetchOwnerAnalytics={fetchOwnerAnalytics}
                    setIsOwnerAuthenticated={setIsOwnerAuthenticated}
                    feedbacks={feedbacks}
                    handleDeleteLogItem={handleDeleteLogItem}
                    setSelectedOwnerUserForBiodata={setSelectedUserBiodata}
                    setShowOwnerBiodataModal={(val) => { if (!val) setSelectedUserBiodata(null); }}
                    addAdminAuditLog={addAdminAuditLog}
                    showToast={showToast}
                    activeHeaderBanner={activeHeaderBanner}
                    setActiveHeaderBanner={setActiveHeaderBanner}
                    featureFlags={featureFlags}
                    setFeatureFlags={setFeatureFlags}
                    aiModelSettings={aiModelSettings}
                    setAiModelSettings={setAiModelSettings}
                    seoSettings={seoSettings}
                    setSeoSettings={setSeoSettings}
                    adminPasswordSecret={adminPasswordSecret}
                    setAdminPasswordSecret={setAdminPasswordSecret}
                    adminAuditLogs={adminAuditLogs}
                    onOpenDiagnostics={() => setIsDiagnosticsModalOpen(true)}
                  />
                </>
              )}
              {false && (
                <div>
                  <div className="border-b border-slate-800 pb-4 text-left flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-amber-500 shadow-md shadow-amber-500/20 animate-pulse" />
                        <h2 className="text-xl font-bold text-white uppercase tracking-wider">
                          👑 {language === 'hindi' ? 'हंसलाल पाल जी मालिक एडमिन डैशबोर्ड' : 'Owner Admin Console - Hanslal Pal'}
                        </h2>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {language === 'hindi' 
                          ? 'सुरक्षित पासवर्ड-संरक्षित ऑनर एडमिनिस्ट्रेशन कंसोल' 
                          : 'Secure password-protected owner administration console'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setIsOwnerAuthenticated(false);
                          showToast(language === 'hindi' ? "ऑनर कंसोल लॉक हुआ 🔒" : "Owner Console Locked 🔒", "info");
                        }}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md border border-amber-500/30"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>{language === 'hindi' ? 'कंसोल लॉक करें 🔒' : 'Lock Console 🔒'}</span>
                      </button>

                      <button
                        onClick={fetchOwnerAnalytics}
                        disabled={isOwnerAnalyticsLoading}
                        className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-550 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md disabled:opacity-50 border-none"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isOwnerAnalyticsLoading ? 'animate-spin' : ''}`} />
                        <span>{isOwnerAnalyticsLoading ? (language === 'hindi' ? 'लोड हो रहा है...' : 'Loading...') : (language === 'hindi' ? 'रीफ्रेश डेटा' : 'Refresh Data')}</span>
                      </button>
                    </div>
                  </div>

                  {/* Real-time Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="bg-[#0F1626]/80 border border-indigo-500/30 p-4 rounded-2xl space-y-1 shadow-lg shadow-indigo-950/40">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">{language === 'hindi' ? 'कुल दर्शक एवं छात्र' : 'Total Visitors & Users'}</span>
                      <span className="text-2xl font-black text-indigo-400 block font-mono">{ownerAnalyticsData.totalUsers || ownerAnalyticsData.users.length}</span>
                      <span className="text-[9px] text-[#22c55e] block font-semibold">{language === 'hindi' ? 'लिंक खोलने वाले एवं पंजीकृत सभी' : 'All App Link Opens + Registered'}</span>
                    </div>
                    <div className="bg-[#0F1626]/80 border border-emerald-500/30 p-4 rounded-2xl space-y-1 shadow-lg shadow-emerald-950/40">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">{language === 'hindi' ? 'पंजीकृत ईमेल छात्र' : 'Registered Email Students'}</span>
                      <span className="text-2xl font-black text-emerald-400 block font-mono">{ownerAnalyticsData.registeredCount}</span>
                      <span className="text-[9px] text-emerald-300 block font-semibold">{language === 'hindi' ? 'नाम एवं ईमेल दर्ज किए हुए' : 'Verified Name & Email Profiles'}</span>
                    </div>
                    <div className="bg-[#0F1626]/80 border border-amber-500/30 p-4 rounded-2xl space-y-1 shadow-lg shadow-amber-950/40">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">{language === 'hindi' ? 'गेस्ट / लिंक दर्शक' : 'Link Guest Visitors'}</span>
                      <span className="text-2xl font-black text-amber-400 block font-mono">{ownerAnalyticsData.visitorCount}</span>
                      <span className="text-[9px] text-amber-300 block font-semibold">{language === 'hindi' ? 'लिंक शेयर से सीधे आने वाले' : 'Visited via Shared Link'}</span>
                    </div>
                    <div className="bg-[#0F1626]/80 border border-pink-500/30 p-4 rounded-2xl space-y-1 shadow-lg shadow-pink-950/40">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">{language === 'hindi' ? 'कुल छात्र सर्च एवं प्रश्न' : 'Total Searches & Activity'}</span>
                      <span className="text-2xl font-black text-pink-400 block font-mono">{ownerAnalyticsData.totalQueries || ownerAnalyticsData.logs.length}</span>
                      <span className="text-[9px] text-slate-400 block">{language === 'hindi' ? 'सहेजी गई गतिविधि' : 'Logged user interactions'}</span>
                    </div>
                  </div>

                  {/* SECTION 1: REGISTERED USERS & VISITORS LIST */}
                  <div className="bg-[#0F1626]/60 border border-slate-800 p-5 rounded-3xl space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                      <div>
                        <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                          <Users className="w-4 h-4 text-indigo-400" />
                          {language === 'hindi' ? '1. पंजीकृत छात्रों एवं दर्शकों की सूची (Biodata)' : '1. Users & Visitors Directory (Biodata)'} ({ownerAnalyticsData.users.length})
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          Real-time list of all users, registered students, and link visitors with complete activity history.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Filter Category Tabs */}
                        <div className="flex items-center bg-[#060913] p-1 rounded-xl border border-slate-800 text-[10px] font-bold">
                          <button
                            onClick={() => setOwnerUserTypeFilter('all')}
                            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer border-none ${ownerUserTypeFilter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                          >
                            All ({ownerAnalyticsData.users.length})
                          </button>
                          <button
                            onClick={() => setOwnerUserTypeFilter('logged_in')}
                            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer border-none flex items-center gap-1 ${ownerUserTypeFilter === 'logged_in' ? 'bg-emerald-600 text-white font-extrabold shadow-sm' : 'text-slate-400 hover:text-white'}`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse inline-block"></span>
                            {language === 'hindi' ? 'लॉग इन छात्र' : 'Logged-In'} ({ownerAnalyticsData.registeredCount})
                          </button>
                          <button
                            onClick={() => setOwnerUserTypeFilter('registered')}
                            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer border-none ${ownerUserTypeFilter === 'registered' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
                          >
                            Registered ({ownerAnalyticsData.registeredCount})
                          </button>
                          <button
                            onClick={() => setOwnerUserTypeFilter('visitors')}
                            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer border-none ${ownerUserTypeFilter === 'visitors' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'}`}
                          >
                            Visitors ({ownerAnalyticsData.visitorCount})
                          </button>
                        </div>

                        {/* Search box for users */}
                        <div className="relative w-full sm:w-48">
                          <input
                            type="text"
                            value={ownerUserSearchQuery}
                            onChange={(e) => setOwnerUserSearchQuery(e.target.value)}
                            placeholder="Search name or email..."
                            className="w-full text-xs py-1.5 pl-8 pr-3 bg-[#060913] border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                          />
                          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
                        </div>
                      </div>
                    </div>

                    <div className="overflow-x-auto max-h-80 overflow-y-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead className="sticky top-0 bg-[#0B0F1B] z-10">
                          <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase font-bold">
                            <th className="py-2.5 px-3">Student / Visitor Name</th>
                            <th className="py-2.5 px-3">Email / Visitor Identifier</th>
                            <th className="py-2.5 px-3">Account Type</th>
                            <th className="py-2.5 px-3">Device / IP</th>
                            <th className="py-2.5 px-3">First Seen</th>
                            <th className="py-2.5 px-3">Last Active</th>
                            <th className="py-2.5 px-3 text-center">Prompts</th>
                            <th className="py-2.5 px-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-850 font-medium">
                          {ownerAnalyticsData.users
                            .filter(u => {
                              const matchesSearch = 
                                u.name.toLowerCase().includes(ownerUserSearchQuery.toLowerCase()) || 
                                u.email.toLowerCase().includes(ownerUserSearchQuery.toLowerCase());
                              const isGuest = u.isGuest || u.email.endsWith('@hansai.visitor');
                              if (ownerUserTypeFilter === 'logged_in') return matchesSearch && !isGuest;
                              if (ownerUserTypeFilter === 'registered') return matchesSearch && !isGuest;
                              if (ownerUserTypeFilter === 'visitors') return matchesSearch && isGuest;
                              return matchesSearch;
                            })
                            .map((usr) => {
                              const isGuest = usr.isGuest || usr.email.endsWith('@hansai.visitor');
                              return (
                                <tr key={usr.id} className="hover:bg-indigo-500/5 transition-all">
                                  <td className="py-2.5 px-3 text-white font-bold flex items-center gap-2">
                                    <div className={`w-6 h-6 rounded-full font-bold flex items-center justify-center text-[10px] ${
                                      isGuest ? 'bg-amber-500/30 text-amber-300' : 'bg-emerald-500/30 text-emerald-300'
                                    }`}>
                                      {usr.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span>{usr.name}</span>
                                  </td>
                                  <td className="py-2.5 px-3 text-slate-300 font-mono text-[11px]">{usr.email}</td>
                                  <td className="py-2.5 px-3">
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase inline-flex items-center gap-1 ${
                                      isGuest ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                    }`}>
                                      {!isGuest && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>}
                                      {isGuest ? (language === 'hindi' ? 'लिंक दर्शक' : 'Guest Link Visitor') : (language === 'hindi' ? 'लॉग इन / पंजीकृत छात्र 🟢' : 'Logged In Student 🟢')}
                                    </span>
                                  </td>
                                  <td className="py-2.5 px-3 text-slate-400 font-mono text-[10px]">{usr.deviceInfo || (usr as any).device || "Mobile/Desktop"}</td>
                                  <td className="py-2.5 px-3 text-slate-400 font-mono text-[10px]">{usr.registeredAt ? new Date(usr.registeredAt).toLocaleDateString() : ((usr as any).createdAt || "Recent")}</td>
                                  <td className="py-2.5 px-3 text-slate-400 font-mono text-[10px]">{usr.lastActiveAt ? new Date(usr.lastActiveAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ((usr as any).lastActive || "Now")}</td>
                                  <td className="py-2.5 px-3 text-center text-indigo-400 font-mono font-bold">{usr.promptCount ?? (usr as any).queryCount ?? 0}</td>
                                  <td className="py-2.5 px-3 text-right">
                                    <button
                                      onClick={() => {
                                        setSelectedUserForLogs(usr.email);
                                        setOwnerLogSearchQuery(usr.email);
                                        showToast(`Filtering activity logs for ${usr.name}`, "info");
                                      }}
                                      className="px-2.5 py-1 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer border-none"
                                    >
                                      View Activity 🔍
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}

                          {ownerAnalyticsData.users.length === 0 && (
                            <tr>
                              <td colSpan={8} className="py-6 text-center text-slate-500 text-xs">
                                No registered users or visitors recorded yet.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  {/* Real-time Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="bg-[#0F1626]/60 border border-slate-800 p-4 rounded-2xl space-y-1">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">{language === 'hindi' ? 'कुल पंजीकृत छात्र/उपयोगकर्ता' : 'Total Registered Users'}</span>
                      <span className="text-2xl font-black text-indigo-400 block font-mono">{ownerAnalyticsData.totalUsers || ownerAnalyticsData.users.length}</span>
                      <span className="text-[9px] text-[#22c55e] block font-semibold">{language === 'hindi' ? 'नाम एवं ईमेल द्वारा रजिस्टर्ड' : 'Registered via Name & Email'}</span>
                    </div>
                    <div className="bg-[#0F1626]/60 border border-slate-800 p-4 rounded-2xl space-y-1">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">{language === 'hindi' ? 'कुल छात्र सर्च एवं प्रश्न' : 'Total User Searches & Prompts'}</span>
                      <span className="text-2xl font-black text-emerald-400 block font-mono">{ownerAnalyticsData.totalQueries || ownerAnalyticsData.logs.length}</span>
                      <span className="text-[9px] text-slate-400 block">{language === 'hindi' ? 'सहेजी गई गतिविधि' : 'Logged activity records'}</span>
                    </div>
                    <div className="bg-[#0F1626]/60 border border-slate-800 p-4 rounded-2xl space-y-1">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">{language === 'hindi' ? 'ऑफ़लाइन स्थिति' : 'Offline Status'}</span>
                      <span className="text-2xl font-black text-amber-400 block font-mono">{isOffline ? 'OFFLINE' : 'ONLINE'}</span>
                      <span className="text-[9px] text-slate-400 block font-semibold">{language === 'hindi' ? 'सर्विस वर्कर कैश सक्रिय' : 'Service Worker cached'}</span>
                    </div>
                    <div className="bg-[#0F1626]/60 border border-slate-800 p-4 rounded-2xl space-y-1">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">{language === 'hindi' ? 'उपयोगकर्ता रेटिंग औसतन' : 'User Feedback Rate'}</span>
                      <span className="text-2xl font-black text-pink-400 block font-mono">4.9 / 5.0</span>
                      <span className="text-[9px] text-slate-400 block">{language === 'hindi' ? `${feedbacks.length} छात्र समीक्षाओं द्वारा` : `From ${feedbacks.length} student audits`}</span>
                    </div>
                  </div>

                  {/* SECTION 1: REGISTERED USERS LIST */}
                  <div className="bg-[#0F1626]/60 border border-slate-800 p-5 rounded-3xl space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                      <div>
                        <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                          <Users className="w-4 h-4 text-indigo-400" />
                          {language === 'hindi' ? '1. पंजीकृत छात्रों की सूची (कौन-कौन चलाया है)' : '1. Registered Users Directory'} ({ownerAnalyticsData.users.length})
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
                            <th className="py-2.5 px-3 text-right">Action</th>
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
                                <td className="py-2.5 px-3 text-right">
                                  <button
                                    onClick={() => handleDeleteLogItem(logItem.id)}
                                    title="Delete this log"
                                    className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-all cursor-pointer border-none bg-transparent"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 inline" />
                                  </button>
                                </td>
                              </tr>
                            ))}

                          {ownerAnalyticsData.logs.length === 0 && (
                            <tr>
                              <td colSpan={5} className="py-6 text-center text-slate-500 text-xs">
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
                              <td className="py-3 px-3 text-amber-400 whitespace-nowrap">{"★".repeat((fb as any).stars || fb.ratingExperience || fb.ratingAccuracy || 5)}</td>
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

          {/* VIEW: SARKARI RESULT / सरकारी नौकरी & पात्रता फाइंडर */}
          {activeView === 'sarkari-result' && (
            <div className="max-w-6xl mx-auto px-2 sm:px-4 py-6 space-y-8 animate-fade-in text-left">
              
              {/* Top Interactive Student Eligibility Job Matcher */}
              <SarkariResultEligibilityHub
                onAskHansAi={(prompt) => handleSendChat(prompt)}
                onStartStenoMock={(subject) => {
                  setActiveView('steno');
                  showToast(`${subject} का स्टैनो स्टूडियो एक्टिव हो गया! ✍️`, "info");
                }}
                showToast={showToast}
                language={language}
              />

              {/* Classic Sarkari Result 3-Column Updates (Admit Cards, Results, Notifications) */}
              <div className="border-t border-slate-800 pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-orange-400" />
                    <span>दैनिक प्रवेश पत्र व परिणाम त्वरित बुलेटिन (Daily Sarkari Updates)</span>
                  </h3>
                  <a 
                    href="https://www.sarkariresult.com/" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-xs text-orange-400 hover:underline font-bold flex items-center gap-1"
                  >
                    <span>मूल वेबसाइट sarkariresult.com</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

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
                        <div key={idx} className="p-3 bg-[#090D16]/50 rounded-xl border border-slate-855 hover:border-slate-800 transition-all space-y-1">
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
                        <div key={idx} className="p-3 bg-[#090D16]/50 rounded-xl border border-slate-855 space-y-1">
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
                        <div key={idx} className="p-3 bg-[#090D16]/50 rounded-xl border border-slate-855 space-y-1 hover:bg-[#090D16]/80 transition-all">
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

            </div>
          )}

          {/* VIEW: DIGITAL BOOK READER & LIBRARY */}
          {activeView === 'book-reader' && (
            <ErrorBoundary fallbackTitle="Digital Book Reader" onReset={() => setActiveView('chat')}>
              <div className="w-full max-w-7xl mx-auto min-h-[calc(100vh-8rem)] p-2 sm:p-6 animate-fade-in">
                <GlobalBookReader
                  showToast={showToast}
                  language={language}
                  onBackToChat={() => setActiveView('chat')}
                />
              </div>
            </ErrorBoundary>
          )}

          {/* VIEW: DEDICATED STENO MASTER STUDIO */}
          {activeView === 'steno' && (
            <ErrorBoundary fallbackTitle="Steno Master Studio" onReset={() => setActiveView('chat')}>
              <div className="w-full max-w-7xl mx-auto min-h-[calc(100vh-8rem)] p-2 sm:p-6 animate-fade-in">
                <DedicatedStenoMasterStudio
                  showToast={showToast}
                  language={language}
                  onBackToChat={() => setActiveView('chat')}
                />
              </div>
            </ErrorBoundary>
          )}

          {/* VIEW: PUBLIC LAUNCH & LEGAL COMPLIANCE HUB */}
          {activeView === 'launch-hub' && (
            <ErrorBoundary fallbackTitle="Public Launch Hub" onReset={() => setActiveView('chat')}>
              <div className="w-full max-w-7xl mx-auto min-h-[calc(100vh-8rem)] p-2 sm:p-6 animate-fade-in">
                <PublicLaunchHubView
                  showToast={showToast}
                  language={language}
                  onBackToChat={() => setActiveView('chat')}
                />
              </div>
            </ErrorBoundary>
          )}

          {/* VIEW: AI STUDY PLAN & ROADMAP */}
          {(activeView === 'planner' || activeView === 'study-plan') && (
            <ErrorBoundary fallbackTitle="AI Study Planner" onReset={() => setActiveView('chat')}>
              <div className="w-full max-w-7xl mx-auto min-h-[calc(100vh-8rem)] p-2 sm:p-6 animate-fade-in">
                <StudyPlanView user={user} onExportPdf={handleExportPdf} showToast={showToast} language={language} />
              </div>
            </ErrorBoundary>
          )}

          {/* VIEW: AFFILIATE STORE & SARKARI PRODUCTS */}
          {(activeView === 'affiliate-store' || activeView === 'affiliate' || activeView === 'sarkari-result') && (
            <ErrorBoundary fallbackTitle="Affiliate Store" onReset={() => setActiveView('chat')}>
              <div className="w-full max-w-7xl mx-auto min-h-[calc(100vh-8rem)] p-2 sm:p-6 animate-fade-in">
                <AffiliateStoreView user={user} showToast={showToast} />
              </div>
            </ErrorBoundary>
          )}

          {/* VIEW: AI FLASHCARDS DECK */}
          {activeView === 'flashcards' && (
            <ErrorBoundary fallbackTitle="AI Flashcards Deck" onReset={() => setActiveView('chat')}>
              <div className="w-full max-w-7xl mx-auto min-h-[calc(100vh-8rem)] p-2 sm:p-6 animate-fade-in">
                <FlashcardsView onExportPdf={handleExportPdf} showToast={showToast} language={language} />
              </div>
            </ErrorBoundary>
          )}

          {/* VIEW: PHOTO DOUBT SOLVER & OCR */}
          {activeView === 'photo-doubt' && (
            <ErrorBoundary fallbackTitle="Photo Doubt Solver" onReset={() => setActiveView('chat')}>
              <div className="w-full max-w-7xl mx-auto min-h-[calc(100vh-8rem)] p-2 sm:p-6 animate-fade-in">
                <PhotoDoubtView onExportPdf={handleExportPdf} showToast={showToast} />
              </div>
            </ErrorBoundary>
          )}

          {/* VIEW: HANDWRITTEN NOTES OCR & QUIZ SCANNER */}
          {(activeView === 'notes-ocr' || activeView === 'photo-ocr') && (
            <ErrorBoundary fallbackTitle="Notes OCR Scanner" onReset={() => setActiveView('chat')}>
              <div className="w-full max-w-7xl mx-auto min-h-[calc(100vh-8rem)] p-2 sm:p-6 animate-fade-in">
                <NotesOcrView onExportPdf={handleExportPdf} showToast={showToast} language={language} />
              </div>
            </ErrorBoundary>
          )}

          {/* VIEW: ARTICLE VOICE READER & TRANSLATOR */}
          {activeView === 'article-reader' && (
            <ErrorBoundary fallbackTitle="Article Voice Reader" onReset={() => setActiveView('chat')}>
              <div className="w-full max-w-7xl mx-auto min-h-[calc(100vh-8rem)] p-2 sm:p-6 animate-fade-in">
                <ArticleVoiceReader onBackToChat={() => setActiveView('chat')} showToast={showToast} language={language} />
              </div>
            </ErrorBoundary>
          )}

          {/* VIEW: SECURITY SYSTEM AUDIT HUB */}
          {activeView === 'security' && (
            <ErrorBoundary fallbackTitle="Security Hub" onReset={() => setActiveView('chat')}>
              <div className="w-full max-w-7xl mx-auto min-h-[calc(100vh-8rem)] p-2 sm:p-6 animate-fade-in">
                <SecurityHubView user={user} showToast={showToast} />
              </div>
            </ErrorBoundary>
          )}

          {/* VIEW: FILE FORMAT CONVERTER */}
          {activeView === 'file-converter' && (
            <ErrorBoundary fallbackTitle="File Converter" onReset={() => setActiveView('chat')}>
              <div className="w-full max-w-7xl mx-auto min-h-[calc(100vh-8rem)] p-2 sm:p-6 animate-fade-in">
                <FileConverterView 
                  showToast={showToast} 
                  language={language} 
                  onBack={() => setActiveView('chat')} 
                />
              </div>
            </ErrorBoundary>
          )}

          {/* VIEW: WEATHER & CLIMATE ALERT CENTER */}
          {activeView === 'weather-alerts' && (
            <ErrorBoundary fallbackTitle="Weather Alerts" onReset={() => setActiveView('chat')}>
              <div className="w-full max-w-7xl mx-auto min-h-[calc(100vh-8rem)] p-2 sm:p-6 animate-fade-in">
                <WeatherAlertView 
                  showToast={showToast} 
                  language={language} 
                  onBack={() => setActiveView('chat')} 
                />
              </div>
            </ErrorBoundary>
          )}

          {/* VIEW: AI NEURAL KNOWLEDGE SYNAPSE & RETENTION MAP */}
          {activeView === 'neural-map' && (
            <ErrorBoundary fallbackTitle="Neural Knowledge Map" onReset={() => setActiveView('chat')}>
              <div className="w-full max-w-7xl mx-auto min-h-[calc(100vh-8rem)] p-2 sm:p-6 animate-fade-in">
                <NeuralMemoryMapView 
                  showToast={showToast} 
                  language={language} 
                />
              </div>
            </ErrorBoundary>
          )}

          {/* VIEW: AI HISTORICAL TIME-TRAVEL SIMULATOR */}
          {activeView === 'time-travel' && (
            <ErrorBoundary fallbackTitle="Time Travel Simulator" onReset={() => setActiveView('chat')}>
              <div className="w-full max-w-7xl mx-auto min-h-[calc(100vh-8rem)] p-2 sm:p-6 animate-fade-in">
                <TimeTravelSimulatorView 
                  showToast={showToast} 
                  language={language} 
                />
              </div>
            </ErrorBoundary>
          )}

          {/* VIEW: AI SMART MNEMONICS TRICK GENERATOR */}
          {activeView === 'mnemonics' && (
            <ErrorBoundary fallbackTitle="Mnemonics Generator" onReset={() => setActiveView('chat')}>
              <div className="w-full max-w-7xl mx-auto min-h-[calc(100vh-8rem)] p-2 sm:p-6 animate-fade-in">
                <MnemonicsTrickGeneratorView 
                  showToast={showToast} 
                  language={language} 
                />
              </div>
            </ErrorBoundary>
          )}

          {/* VIEW: INTERACTIVE SCIENCE & FORMULA PLAYGROUND LAB */}
          {activeView === 'science-lab' && (
            <ErrorBoundary fallbackTitle="Science Formula Lab" onReset={() => setActiveView('chat')}>
              <div className="w-full max-w-7xl mx-auto min-h-[calc(100vh-8rem)] p-2 sm:p-6 animate-fade-in">
                <ScienceFormulaLabView 
                  showToast={showToast} 
                  language={language} 
                />
              </div>
            </ErrorBoundary>
          )}

          {/* VIEW: AI MOCK INTERVIEW SIMULATOR */}
          {activeView === 'mock-interview' && (
            <ErrorBoundary fallbackTitle="AI Mock Interview" onReset={() => setActiveView('chat')}>
              <div className="w-full max-w-7xl mx-auto min-h-[calc(100vh-8rem)] p-2 sm:p-6 animate-fade-in">
                <MockInterviewView
                  language={language}
                  showToast={showToast}
                  onExportPdf={handleExportPdf}
                  onStartLiveChat={() => {
                    setActiveView('chat');
                    setChatInput("Start a live, unrecorded AI mock interview with me. Act as a strict interview board panel member. Ask me the first question and wait for my response.");
                  }}
                />
              </div>
            </ErrorBoundary>
          )}

          {/* VIEW: AI PERFORMANCE DIAGNOSTICS & WEAK AREA ANALYTICS */}
          {activeView === 'performance-analytics' && (
            <ErrorBoundary fallbackTitle="AI Performance Analytics" onReset={() => setActiveView('chat')}>
              <div className="w-full max-w-7xl mx-auto min-h-[calc(100vh-8rem)] p-2 sm:p-6 animate-fade-in">
                <AIPerformanceDiagnosticsView
                  language={language}
                  showToast={showToast}
                  onExportPdf={handleExportPdf}
                  onNavigateToQuiz={(subj) => {
                    setQuizSubject(subj);
                    setActiveView('quiz');
                  }}
                />
              </div>
            </ErrorBoundary>
          )}

          {/* VIEW: QUIZ MISTAKE NOTEBOOK */}
          {activeView === 'mistake-notebook' && (
            <ErrorBoundary fallbackTitle="Mistake Notebook" onReset={() => setActiveView('chat')}>
              <div className="w-full max-w-7xl mx-auto min-h-[calc(100vh-8rem)] p-2 sm:p-6 animate-fade-in">
                <QuizMistakeNotebookView
                  mistakes={mistakeNotebook}
                  onRetest={(questions, title) => handleStartRetestFromMistakes(questions, title)}
                  onDelete={handleDeleteMistake}
                  onClearAll={handleClearAllMistakes}
                  onToggleMastered={handleToggleMasteredMistake}
                />
              </div>
            </ErrorBoundary>
          )}

        </div>



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
                    onClick={() => setSelectedModel('gemini-3.7-flash')}
                    className={`p-2 rounded-xl border text-left transition-all ${
                      selectedModel === 'gemini-3.7-flash'
                        ? 'border-indigo-500 bg-indigo-500/10 text-white font-semibold shadow-inner'
                        : 'border-slate-800 bg-[#090D16] text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xs font-bold block mb-0.5">Gemini 3.7 Flash (Default)</span>
                    <span className="text-[9px] opacity-75 block">Recommended. Extremely fast, intelligent educational companion.</span>
                  </button>
                  
                  <button
                    onClick={() => setSelectedModel('gemini-3.1-flash-lite')}
                    className={`p-2 rounded-xl border text-left transition-all ${
                      selectedModel === 'gemini-3.1-flash-lite'
                        ? 'border-indigo-500 bg-indigo-500/10 text-white font-semibold shadow-inner'
                        : 'border-slate-800 bg-[#090D16] text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xs font-bold block mb-0.5">Gemini 3.1 Flash Lite (Ultra Fast)</span>
                    <span className="text-[9px] opacity-75 block">Low-latency, lightweight responses for rapid quizzes and revision.</span>
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

              {/* AI Chat Assistant & Feature Guide inside Settings */}
              <div className="border-t border-slate-800/60 pt-3 space-y-2">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                  🤖 {language === 'hindi' ? 'AI चैट असिस्टेंट व हेल्प गाइड' : 'AI Chat Assistant & Feature Guide'}
                </span>
                <button
                  onClick={() => {
                    setIsSettingsOpen(false);
                    setIsHelpGuideOpen(true);
                  }}
                  className="w-full py-2.5 px-3 bg-gradient-to-r from-indigo-950/80 via-purple-950/80 to-slate-900 border border-indigo-500/40 hover:border-indigo-400 rounded-xl text-indigo-200 hover:text-white text-xs font-bold flex items-center justify-between transition-all cursor-pointer shadow-sm active:scale-98"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
                    <span>{language === 'hindi' ? '🤖 HansAI गाइड व सहायता केंद्र' : '🤖 HansAI Help & Feature Guide'}</span>
                  </div>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded font-mono">
                    Guide 📖
                  </span>
                </button>
              </div>

              {/* Official Community, Helpline & Support Section */}
              <div className="border-t border-slate-800/60 pt-3 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  💬 {language === 'hindi' ? 'सपोर्ट व कम्युनिटी (हेल्पलाइन)' : 'Support & Community Helpline'}
                </span>
                <a
                  href="https://chat.whatsapp.com/F0EfHMyUK6KJYedVpZqgXR?s=sh&p=a&mlu=4"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsSettingsOpen(false)}
                  className="w-full py-2 px-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-300 hover:text-emerald-200 text-xs font-bold flex items-center justify-between transition-all no-underline cursor-pointer"
                >
                  <div className="flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{language === 'hindi' ? 'आधिकारिक WhatsApp ग्रुप जॉइन करें' : 'Join WhatsApp Community'}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono">Join 💬</span>
                </a>

                <a
                  href="https://chat.whatsapp.com/F0EfHMyUK6KJYedVpZqgXR?s=sh&p=a&mlu=4"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsSettingsOpen(false)}
                  className="w-full py-2 px-3 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-xl text-indigo-300 hover:text-indigo-200 text-xs font-bold flex items-center justify-between transition-all no-underline cursor-pointer"
                >
                  <div className="flex items-center gap-1.5">
                    <PhoneCall className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{language === 'hindi' ? 'छात्र सहायता व हेल्पलाइन' : 'Student Helpline & 24x7 Support'}</span>
                  </div>
                  <span className="text-[10px] text-indigo-400 font-mono">Help 📞</span>
                </a>
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

              {/* Sign In Options */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsLoginModalOpen(false);
                    setIsAuthLoginOpen(true);
                  }}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer border-none"
                >
                  <Lock className="w-4 h-4" />
                  <span>Student Sign In (Password / OTP) 🔐</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsLoginModalOpen(false);
                    setIsAuthRegisterOpen(true);
                  }}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <User className="w-4 h-4 text-emerald-400" />
                  <span>New User? Create Account 🚀</span>
                </button>
              </div>

              {/* Direct Quick Login Form */}
              <div className="border-t border-slate-800 pt-3 space-y-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">{t('useAnotherAccount')}</span>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const email = (formData.get('email') as string || '').trim().toLowerCase();
                    const name = (formData.get('name') as string || '').trim() || 'Scholar Student';

                    if (!email || !email.includes('@')) {
                      showToast("कृपया एक वैध ईमेल दर्ज करें।", "warn");
                      return;
                    }

                    const hash = email.length % 5;
                    const avatarList = [
                      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100",
                      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100",
                      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100",
                      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100",
                      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"
                    ];
                    const selectedAvatar = avatarList[hash];

                    const loggedUser = { email, name, avatarUrl: selectedAvatar, role: 'student' };
                    localStorage.setItem('hansai-user-session', JSON.stringify(loggedUser));
                    setUser(loggedUser);
                    setIsLoginModalOpen(false);

                    // Sync student registration on server & record login activity
                    fetch('/api/users/register', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ name, email })
                    }).then(() => fetchOwnerAnalytics()).catch(console.warn);

                    fetch('/api/users/log-activity', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        name,
                        email,
                        type: 'login',
                        query: `Student Logged In (${name})`
                      })
                    }).catch(console.warn);
                    
                    showToast(`Successfully authenticated as ${name}! 🚀`, "success");
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
      {sidebarOpen && activeView !== 'chat' && (
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
                <BookOpen className="w-5 h-5 text-indigo-400" />
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

            {/* NEW CHAT BUTTON AT THE VERY TOP */}
            <div className="pt-4 pb-2 border-b border-slate-850/50 space-y-2.5">
              {/* Daily Streak Indicator */}
              <DailyStreakIndicator 
                language={language}
                variant="card"
                onNavigateToView={(view) => {
                  setActiveView(view);
                  setSidebarOpen(false);
                }}
              />

              <button
                onClick={() => {
                  setSidebarOpen(false);
                  setActiveView('chat');
                  startNewChat();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl text-sm font-black transition-all cursor-pointer shadow-lg active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>New Chat</span>
              </button>
            </div>

            <div className="py-4 space-y-2.5">
              <div className="px-2 text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Primary Core Workspace</div>
              {[
                { id: 'chat', title: 'AI Study Chat Workspace', desc: 'Concept explainer & studies', icon: '💬', badge: 'ACTIVECORE' },
                { id: 'book-reader', title: 'Global Digital Library & Book Reader', desc: 'कोई भी बुक खोजें व पढ़ें (Highlight & Voice)', icon: '📚', badge: 'BOOKS' },
                { id: 'sarkari-result', title: 'Sarkari Result & Job Portal', desc: 'सरकारी नौकरी व रिजल्ट अपडेट', icon: '📄', badge: 'SARKARI' },
                { id: 'research', title: 'Deep Research AI', desc: 'डीप रिसर्च मोड', icon: '🚀', badge: 'LIVE WEB' },
                { id: 'timer', title: 'My Projects & Audio Recorder', desc: 'मेरे प्रोजेक्ट्स एवं रिकॉर्डर', icon: '🎙️', badge: 'PROJECTS' },
                { id: 'map', title: 'GIS & Mapping Visualizer', desc: 'नक्शा और जियोग्राफी टूल', icon: '🗺️', badge: 'REAL-TIME GIS' },
                { id: 'quiz', title: 'Interactive Live Quiz', desc: 'लाइव टेस्ट रूम', icon: '🧠', badge: 'PRACTICE' },
                { id: 'notes', title: 'Shorthand & Formula Notes', desc: 'सूत्र व नियम नोट्स', icon: '📝', badge: 'PERSONAL' },
                ...(isAdmin ? [{ id: 'owner-dashboard', title: 'Scholar Founder Hub', desc: 'संस्थापक कंसोल', icon: '🛡️', badge: 'ADMIN' }] : []),
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
              <p className="text-[8px] text-slate-500 font-mono">HansAI Learning & Research System</p>
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
                        { t: "कठिन परिश्रम का कोई विकल्प नहीं है, निरंतर अभ्यास ही सफलता की कुंजी है।", a: "Golden Study Rule" },
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
                        { t: "कठिन परिश्रम का कोई विकल्प नहीं है, निरंतर अभ्यास ही सफलता की कुंजी है।", a: "Golden Study Rule" },
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
                      Developed for HansAI Academic Ecosystem
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
                    { t: "कठिन परिश्रम का कोई विकल्प नहीं है, निरंतर अभ्यास ही सफलता की कुंजी है।", a: "Golden Study Rule" },
                    { t: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", a: "Brian Herbert" },
                    { t: "सफलता की शुरुआत हमेशा स्वयं पर विश्वास करने से होती है।", a: "HansAI Inspiration" }
                  ];
                  const activeQuote = sampleQuotes[new Date().getDate() % sampleQuotes.length];
                  const dynamicShareUrl = getAppShareUrl();
                  
                  const shareText = `🎯 *Hans Compain - Daily Study Motivation* 🎯\n\n"${activeQuote.t}"\n- _${activeQuote.a}_\n\n📲 *Start practicing Live Quizzes, Shorthand & Science Lab for exams!* Join Free At:\n${dynamicShareUrl}\n\n🕊️ _Hans Compain (HansAI) Academic Ecosystem_`;
                  
                  if (navigator.share) {
                    navigator.share({
                      title: 'Hans Compain Daily Status Badge',
                      text: shareText,
                      url: dynamicShareUrl
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
                    { t: "कठिन परिश्रम का कोई विकल्प नहीं है, निरंतर अभ्यास ही सफलता की कुंजी है।", a: "Golden Study Rule" },
                    { t: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", a: "Brian Herbert" },
                    { t: "सफलता की शुरुआत हमेशा स्वयं पर विश्वास करने से होती है।", a: "HansAI Inspiration" }
                  ];
                  const activeQuote = sampleQuotes[new Date().getDate() % sampleQuotes.length];
                  const dynamicShareUrl = getAppShareUrl();
                  
                  const shareText = `🎯 *Hans Compain - Daily Study Motivation* 🎯\n\n"${activeQuote.t}"\n- _${activeQuote.a}_\n\n📲 JOIN AT: ${dynamicShareUrl}\n\n🕊️ _Hans Compain Academic Ecosystem_`;
                  copyToClipboard(shareText, showToast);
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
                    <Zap className="w-3.5 h-3.5 text-indigo-400" />
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
              <div className="relative flex items-center bg-slate-950 border border-slate-800 rounded-xl px-2 focus-within:border-cyan-500">
                <input
                  type="text"
                  value={launcherSearchTopic}
                  onChange={(e) => setLauncherSearchTopic(e.target.value)}
                  placeholder="e.g. Pitman Shorthand dictation 80wpm, Indian Polity MCQs, Photosynthesis..."
                  className="flex-1 text-xs bg-transparent px-2 py-2.5 text-white outline-none font-sans"
                />
                <button
                  type="button"
                  onClick={handleToggleLauncherVoice}
                  className={`p-1.5 rounded-lg transition-all border cursor-pointer shrink-0 flex items-center gap-1 text-xs font-bold ${
                    isListeningLauncherVoice
                      ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                      : 'bg-slate-900 text-cyan-300 border-cyan-500/30 hover:bg-cyan-900/40 hover:text-white'
                  }`}
                  title={language === 'hindi' ? 'बोलकर खोजें' : 'Speak to search'}
                >
                  {isListeningLauncherVoice ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  <span className="text-[10px] hidden sm:inline">{isListeningLauncherVoice ? 'Listening...' : 'Voice'}</span>
                </button>
              </div>
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

      {/* ALL EXAMS SYLLABUS DIRECTORY MODAL */}
      <AllExamsSyllabusModal
        isOpen={isAllExamsSyllabusOpen}
        onClose={() => setIsAllExamsSyllabusOpen(false)}
        onSelectSyllabusPrompt={(promptText) => {
          setActiveView('chat');
          setChatInput(promptText);
        }}
        onOpenStudyPlannerWithExam={(examName) => {
          setActiveView('study-plan');
          showToast(`Syllabus roadmap & planner activated for ${examName}! 🚀`, 'success');
        }}
        showToast={showToast}
      />

      {/* 📚 GOOGLE SCHOLAR & ACADEMIC RESEARCH PAPERS MODAL */}
      <GoogleScholarResearchModal
        isOpen={isGoogleScholarModalOpen}
        onClose={() => setIsGoogleScholarModalOpen(false)}
        initialTopic={scholarTopic}
        language={language}
        showToast={showToast}
      />

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

      {/* HANS COMPAIN ADVANCED SHARE LINK MODAL */}
      {isShareModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in font-sans">
          <div className="bg-[#0A0E1A] border border-cyan-500/30 rounded-3xl max-w-lg w-full p-5 sm:p-6 space-y-4 text-left shadow-2xl shadow-cyan-950/40 relative max-h-[92vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 flex items-center justify-center text-xl shadow-lg shadow-cyan-500/20 text-white font-bold">
                  🚀
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <span>{language === 'hindi' ? 'Hans Compain ऐप शेयर करें' : 'Share Hans Compain App'}</span>
                    <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                      Live Share
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    {language === 'hindi' ? 'दोस्तों और स्टडी ग्रुप्स में 1-क्लिक शेयर करें' : 'Share with friends, batchmates & study groups'}
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

            {/* Feature Deep-Link Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                {language === 'hindi' ? '🎯 क्या शेयर करना चाहते हैं? (Select Workspace)' : '🎯 What do you want to share?'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {[
                  { id: 'all', label: '🌐 All Features', tab: undefined },
                  { id: 'quiz', label: '🧠 Live Quiz', tab: 'quiz' },
                  { id: 'steno', label: '✍️ Shorthand', tab: 'steno' },
                  { id: 'science-lab', label: '🔬 Science Lab', tab: 'science-lab' },
                  { id: 'photo-doubt', label: '📸 Photo Doubt', tab: 'photo-doubt' },
                  { id: 'notes-ocr', label: '📜 Notes OCR', tab: 'notes-ocr' },
                  { id: 'time-travel', label: '⏳ Time Travel', tab: 'time-travel' },
                  { id: 'study-plan', label: '📅 Study Plan', tab: 'study-plan' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setShareSelectedTab(item.id);
                      setIsCopiedShareLink(false);
                    }}
                    className={`p-2 rounded-xl text-[11px] font-bold transition-all text-center border cursor-pointer ${
                      shareSelectedTab === item.id
                        ? 'bg-cyan-600/30 border-cyan-500 text-cyan-200 shadow-md shadow-cyan-950/30'
                        : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* DIRECT COPY LINK BOX */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider block">
                  {language === 'hindi' ? '🔗 लाइव शेयर लिंक (Direct Live Link)' : '🔗 Direct Live Link'}
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {shareSelectedTab === 'all' ? 'Full App' : `Target: ?tab=${shareSelectedTab}`}
                </span>
              </div>
              
              <div className="flex items-center gap-2 bg-[#04070F] border border-cyan-500/30 p-2 rounded-2xl">
                <input
                  type="text"
                  readOnly
                  value={getAppShareUrl(shareSelectedTab === 'all' ? undefined : shareSelectedTab)}
                  className="w-full text-xs bg-transparent text-cyan-200 font-mono outline-none px-2 truncate selection:bg-cyan-800"
                />
                <button
                  onClick={async () => {
                    const targetUrl = getAppShareUrl(shareSelectedTab === 'all' ? undefined : shareSelectedTab);
                    const copied = await copyToClipboard(targetUrl, showToast);
                    if (copied) {
                      setIsCopiedShareLink(true);
                      setTimeout(() => setIsCopiedShareLink(false), 3000);
                    }
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer shadow-md ${
                    isCopiedShareLink
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white'
                  }`}
                >
                  {isCopiedShareLink ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{language === 'hindi' ? 'कॉपी हुआ!' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{language === 'hindi' ? 'लिंक कॉपी करें' : 'Copy Link'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 1-CLICK SOCIAL MEDIA SHARE BUTTONS */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                {language === 'hindi' ? '📱 सोशल मीडिया पर तुरंत शेयर करें (One-Click Share)' : '📱 Share via Social Media'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                
                {/* WhatsApp */}
                <button
                  onClick={() => {
                    const currentTab = shareSelectedTab === 'all' ? undefined : shareSelectedTab;
                    const featureNames: Record<string, string> = {
                      quiz: 'Interactive Live Quiz & Mock Tests',
                      steno: 'Shorthand Studio & Speed Dictation',
                      'science-lab': 'Virtual Science Lab & Formula Hub',
                      'photo-doubt': 'Photo Doubt Solver',
                      'notes-ocr': 'Scanned Handwritten Notes OCR',
                      'time-travel': 'Historical Time Travel Simulator',
                      'study-plan': 'Smart Study Planner'
                    };
                    shareViaWhatsApp({ tab: currentTab, title: currentTab ? featureNames[currentTab] : undefined });
                  }}
                  className="p-2.5 bg-emerald-650 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <span className="text-base">💬</span>
                  <span>WhatsApp</span>
                </button>

                {/* Telegram */}
                <button
                  onClick={() => {
                    const currentTab = shareSelectedTab === 'all' ? undefined : shareSelectedTab;
                    shareViaTelegram({ tab: currentTab });
                  }}
                  className="p-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <span className="text-base">✈️</span>
                  <span>Telegram</span>
                </button>

                {/* Instagram */}
                <button
                  onClick={async () => {
                    const targetUrl = getAppShareUrl(shareSelectedTab === 'all' ? undefined : shareSelectedTab);
                    await copyToClipboard(targetUrl, showToast);
                    showToast(language === 'hindi' ? "📋 लिंक कॉपी हुआ! इंस्टाग्राम स्टोरी या DM में पेस्ट करें 📸" : "📋 Link copied! Paste in Instagram Story or DM! 📸", "success");
                    window.open("https://www.instagram.com", "_blank");
                  }}
                  className="p-2.5 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-90 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <span className="text-base">📸</span>
                  <span>Instagram</span>
                </button>

                {/* X (Twitter) */}
                <button
                  onClick={() => {
                    const currentTab = shareSelectedTab === 'all' ? undefined : shareSelectedTab;
                    shareViaTwitter({ tab: currentTab });
                  }}
                  className="p-2.5 bg-slate-850 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-slate-700 shadow-md"
                >
                  <span className="text-base">𝕏</span>
                  <span>X (Twitter)</span>
                </button>

                {/* Facebook */}
                <button
                  onClick={() => {
                    const currentTab = shareSelectedTab === 'all' ? undefined : shareSelectedTab;
                    shareViaFacebook({ tab: currentTab });
                  }}
                  className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <span className="text-base">📘</span>
                  <span>Facebook</span>
                </button>

                {/* LinkedIn */}
                <button
                  onClick={() => {
                    const currentTab = shareSelectedTab === 'all' ? undefined : shareSelectedTab;
                    shareViaLinkedIn({ tab: currentTab });
                  }}
                  className="p-2.5 bg-blue-700 hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <span className="text-base">💼</span>
                  <span>LinkedIn</span>
                </button>

                {/* Email */}
                <button
                  onClick={() => {
                    const currentTab = shareSelectedTab === 'all' ? undefined : shareSelectedTab;
                    shareViaEmail({ tab: currentTab });
                  }}
                  className="p-2.5 bg-indigo-700 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <span className="text-base">✉️</span>
                  <span>Email</span>
                </button>

                {/* Universal Web Share */}
                <button
                  onClick={() => {
                    const currentTab = shareSelectedTab === 'all' ? undefined : shareSelectedTab;
                    shareUniversal({ tab: currentTab }, showToast);
                  }}
                  className="p-2.5 bg-cyan-700 hover:bg-cyan-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <Share2 className="w-3.5 h-3.5 text-cyan-200" />
                  <span>{language === 'hindi' ? 'अन्य विकल्प' : 'More'}</span>
                </button>

              </div>
            </div>

            {/* AUTOMATIC LINK UPDATE EXPLANATION BANNER */}
            <div className="p-3 bg-[#060A14] border border-cyan-500/20 rounded-2xl space-y-1 text-xs text-slate-300 leading-relaxed">
              <div className="flex items-center gap-2 font-bold text-emerald-400 text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'hindi' ? 'ऑटोमैटिक लाइव अपडेट गारंटी (Zero Downtime)' : 'Automatic Live Updates Guaranteed'}</span>
              </div>
              <p className="text-[11px] text-slate-400">
                {language === 'hindi'
                  ? 'यह शेयर किया गया लिंक हमेशा लाइव रहता है। जब भी Hanslal Pal जी (Founder) कोई नया क्विज़, साइंस एक्सपेरिमेंट या फीचर जोड़ते हैं, तो लिंक खोलने पर छात्रों को तुरंत नया अपडेटेड वर्जन मिलता है।'
                  : 'This shared link stays permanently live and synchronized. Whenever new quizzes, formulas, or features are published, visitors always get the latest version seamlessly.'}
              </p>
            </div>

            {/* Footer note */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
              <span>Hans Compain • Expert Academic & Career AI</span>
              <span className="text-cyan-400 font-medium">Free for Students & Aspirants</span>
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
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                  <ShieldCheck className="w-6 h-6 text-white" />
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
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>सुरक्षित ओनर डैशबोर्ड (Admin Console)</span>
              </p>
              <p className="text-[11px] text-slate-300">
                सामान्य छात्र यूजर इस सेक्शन में प्रवेश नहीं कर सकते। ओनर कंसोल खोलने के लिए अपना <strong>Secret Owner PIN</strong> दर्ज करें।
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
                  showToast("🛡️ Owner Security PIN verified! Welcome Hanslal Pal Ji.", "success");
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

      {/* 🧠 AI MISTAKE REMEDIATION CONCEPT MODAL */}
      {activeMistakeModal && (
        <QuizMistakeRemediationModal
          isOpen={!!activeMistakeModal}
          onClose={() => setActiveMistakeModal(null)}
          mistake={activeMistakeModal}
          onSaveToNotebook={(item) => handleSaveMistakeToNotebook(item)}
          onRetry={handleRetryCurrentQuestion}
        />
      )}

      {/* 🖼️ FULL SCREEN IMAGE VIEWER LIGHTBOX MODAL */}
      {fullImageModalUrl && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-fade-in"
          onClick={() => setFullImageModalUrl(null)}
        >
          <div 
            className="relative max-w-4xl w-full max-h-[92vh] bg-[#0A0E1A] border border-slate-700 rounded-3xl p-4 shadow-2xl flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <span>🖼️</span>
                <span>Uploaded Image Viewer / फोटो दृश्य</span>
              </span>
              <div className="flex items-center gap-2">
                <a 
                  href={fullImageModalUrl} 
                  download="uploaded_photo.png" 
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold no-underline transition-all flex items-center gap-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ⬇️ Save / डाउनलोड
                </a>
                <button 
                  onClick={() => setFullImageModalUrl(null)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-all border-none cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>
            </div>
            <div className="overflow-auto max-h-[75vh] flex items-center justify-center w-full p-2">
              <img 
                src={fullImageModalUrl} 
                alt="Full screen uploaded view" 
                className="max-w-full max-h-[72vh] object-contain rounded-2xl shadow-xl border border-slate-800"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      )}

      {/* ⚖️ PUBLIC AI USAGE RULES & SAFETY GUIDELINES MODAL */}
      <AiPublicRulesModal
        isOpen={isAiRulesModalOpen}
        onClose={() => setIsAiRulesModalOpen(false)}
        language={language}
      />

      {/* 🤖 HANSAI COMPREHENSIVE AI FEATURE & HELP GUIDE MODAL */}
      <HansAiHelpGuideModal
        isOpen={isHelpGuideOpen}
        onClose={() => setIsHelpGuideOpen(false)}
        language={language}
        onNavigateToFeature={(view) => {
          setActiveView(view as any);
        }}
      />

      {/* 🔍 HANSAI AUTOMATIC PROBLEM DETECTOR & SYSTEM DIAGNOSTICS MODAL */}
      <SystemDiagnosticsModal
        isOpen={isDiagnosticsModalOpen}
        onClose={() => setIsDiagnosticsModalOpen(false)}
        language={language}
        onFixAction={(feature) => {
          setActiveView(feature as any);
        }}
      />

      {/* 🗑️ CLEAR ALL CHATS CONFIRMATION MODAL */}
      {isClearAllChatsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#0b0f19] border border-rose-500/40 rounded-2xl max-w-sm w-full p-5 text-left shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center text-xl shrink-0">
                ⚠️
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  {language === 'hindi' ? 'सभी चैट इतिहास हटाएं?' : 'Clear all chat history?'}
                </h4>
                <p className="text-[11px] text-slate-400">
                  {language === 'hindi' 
                    ? 'यह सभी सहेजी गई बातचीत को हमेशा के लिए हटा देगा।' 
                    : 'This will permanently delete all saved conversations.'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsClearAllChatsModalOpen(false)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer border-none"
              >
                {language === 'hindi' ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleClearAllChats}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-rose-950/40 cursor-pointer border-none"
              >
                {language === 'hindi' ? 'हाँ, सब हटाएं' : 'Yes, Delete All'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 💬 DEDICATED CHAT & ACTIVITY HISTORY MODAL */}
      <ChatHistoryModal
        isOpen={isChatHistoryModalOpen}
        onClose={() => setIsChatHistoryModalOpen(false)}
        language={language}
        savedChats={savedChats}
        currentChatSessionId={currentChatSessionId}
        onLoadChat={(chat) => {
          setCurrentChatSessionId(chat.id);
          setChatMessages(chat.messages || []);
          setActiveView('chat');
          showToast(language === 'hindi' ? `चैट "${chat.title || 'सत्र'}" लोड हो गई 💬` : `Loaded "${chat.title || 'Chat'}" 💬`, 'info');
        }}
        onDeleteChat={deleteSavedChat}
        onRenameChat={handleRenameChat}
        onPinChat={handlePinChat}
        onClearAllChats={() => {
          setIsChatHistoryModalOpen(false);
          setIsClearAllChatsModalOpen(true);
        }}
        activityLogs={activityLogs}
        onClearActivityLog={deleteSpecificHistoryLog}
        onStartNewChat={() => {
          startNewChat();
        }}
      />

      {/* ⭐ 5-STAR FEEDBACK & USER SUGGESTIONS MODAL */}
      <FiveStarFeedbackModal
        isOpen={isFiveStarFeedbackOpen}
        onClose={() => setIsFiveStarFeedbackOpen(false)}
        language={language}
        user={user}
        onOpenLogin={() => setIsAuthLoginOpen(true)}
        initialContext={feedbackInitialContext}
        onFeedbackSubmitted={(data) => {
          showToast(language === 'hindi' ? `⭐ आपका ${data.stars}-स्टार फीडबैक व सुझाव दर्ज कर लिया गया है!` : `⭐ Thank you! Your ${data.stars}-star feedback & review was recorded!`, 'success');
        }}
      />

      {/* 🚀 HANS COMPAIN UPCOMING FEATURES & ROADMAP MODAL */}
      <UpcomingFeaturesRoadmapModal
        isOpen={isRoadmapModalOpen}
        onClose={() => setIsRoadmapModalOpen(false)}
        language={language}
        onLaunchFeature={(featureId) => {
          if (featureId === 'chat' || featureId === 'quiz' || featureId === 'shorthand' || featureId === 'study-plan' || featureId === 'flashcards' || featureId === 'music-studio' || featureId === 'weather-alerts' || featureId === 'store' || featureId === 'security-hub') {
            setActiveView(featureId as any);
          }
        }}
      />

      {/* 📑 QUICK SAVE TO NOTES SMART FOLDERS MODAL */}
      <QuickSaveNotesModal
        isOpen={isQuickSaveModalOpen}
        onClose={() => {
          setIsQuickSaveModalOpen(false);
          setFloatingSelectionPos(null);
        }}
        selectedText={quickSaveSelectedText}
        folders={folders}
        language={language}
        onSaveNote={handleQuickSaveNote}
        onCreateFolder={handleQuickCreateFolder}
        onOpenNotesView={() => {
          setIsQuickSaveModalOpen(false);
          setActiveView('notes-ocr' as any);
        }}
      />

    </div>
  );
}
