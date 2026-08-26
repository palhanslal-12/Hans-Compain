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
    deepResearch: "üî¨ Advanced AI Deep Research Console",
    deepResearchDesc: "Enables multi-source live web search validation and reference indexes on deep queries",
    neutralPress: "üì∞ Neutral Global Press",
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
    appTitle: "‡§π‡§Ç‡§∏‡§è‡§Ü‡§à ‡§∏‡§æ‡§•‡•Ä",
    subtitle: "‡§Ü‡§™‡§ï‡§æ ‡§è‡§Ü‡§à ‡§∏‡§æ‡§•‡•Ä",
    welcomeTitle: "‡§Ü‡§ú ‡§Æ‡•à‡§Ç ‡§Ü‡§™‡§ï‡•Ä ‡§ï‡•ç‡§Ø‡§æ ‡§∏‡§π‡§æ‡§Ø‡§§‡§æ ‡§ï‡§∞ ‡§∏‡§ï‡§§‡§æ ‡§π‡•Ç‡§Å?",
    welcomeDesc: "‡§Ö‡§µ‡§ß‡§æ‡§∞‡§£‡§æ‡§ì‡§Ç ‡§ï‡•ã ‡§∏‡§∞‡§≤ ‡§¨‡§®‡§æ‡§®‡§æ, ‡§Ö‡§ß‡•ç‡§Ø‡§Ø‡§® ‡§®‡§ø‡§Ø‡§Æ ‡§§‡•à‡§Ø‡§æ‡§∞ ‡§ï‡§∞‡§®‡§æ, ‡§Ø‡§æ ‡§µ‡•ç‡§Ø‡§æ‡§™‡§ï ‡§¨‡§π‡•Å-‡§∏‡•ç‡§∞‡•ã‡§§ ‡§≤‡§æ‡§á‡§µ ‡§µ‡•á‡§¨ ‡§™‡§∞ ‡§∞‡§ø‡§∏‡§∞‡•ç‡§ö ‡§ï‡§∞‡§®‡§æ‡•§",
    exploreWorkspaces: "‡§®‡•á‡§ï‡•ç‡§∏‡•ç‡§ü-‡§ú‡•á‡§® ‡§µ‡§∞‡•ç‡§ï‡§∏‡•ç‡§™‡•á‡§∏ ‡§µ ‡§´‡•Ä‡§≤‡•ç‡§°‡•ç‡§∏ ‡§ï‡§æ ‡§Ö‡§®‡•ç‡§µ‡•á‡§∑‡§£ ‡§ï‡§∞‡•á‡§Ç",
    addOption: "‡§ï‡§∏‡•ç‡§ü‡§Æ ‡§µ‡§ø‡§ï‡§≤‡•ç‡§™ ‡§ú‡•ã‡•ú‡•á‡§Ç",
    customFieldTitle: "‡§®‡§Ø‡§æ ‡§∂‡•à‡§ï‡•ç‡§∑‡§£‡§ø‡§ï/‡§™‡§∞‡•Ä‡§ï‡•ç‡§∑‡§æ ‡§ï‡•ç‡§∑‡•á‡§§‡•ç‡§∞ ‡§ú‡•ã‡•ú‡•á‡§Ç",
    fieldTitleLabel: "‡§µ‡§ø‡§ï‡§≤‡•ç‡§™/‡§™‡§∞‡•Ä‡§ï‡•ç‡§∑‡§æ ‡§ï‡§æ ‡§∂‡•Ä‡§∞‡•ç‡§∑‡§ï",
    fieldTitlePlaceholder: "‡§ú‡•à‡§∏‡•á: ‡§∏‡§ø‡§µ‡§ø‡§≤ ‡§∏‡§∞‡•ç‡§µ‡§ø‡§∏‡•á‡§ú, ‡§¨‡•à‡§Ç‡§ï‡§ø‡§Ç‡§ó, ‡§∞‡•á‡§≤‡§µ‡•á...",
    selectIconLabel: "‡§ö‡§ø‡§π‡•ç‡§® / ‡§á‡§Æ‡•ã‡§ú‡•Ä ‡§ö‡•Å‡§®‡•á‡§Ç",
    cancel: "‡§∞‡§¶‡•ç‡§¶ ‡§ï‡§∞‡•á‡§Ç",
    addSection: "‡§∏‡•á‡§ï‡•ç‡§∂‡§® ‡§ú‡•ã‡•ú‡•á‡§Ç",
    quickServices: "‡§§‡•ç‡§µ‡§∞‡§ø‡§§ ‡§∏‡•á‡§µ‡§æ‡§è‡§Å",
    interactiveQuiz: "‡§á‡§Ç‡§ü‡§∞‡•à‡§ï‡•ç‡§ü‡§ø‡§µ ‡§ï‡•ç‡§µ‡§ø‡§ú",
    quizDesc: "‡§¨‡§π‡•Å‡§µ‡§ø‡§ï‡§≤‡•ç‡§™‡•Ä‡§Ø ‡§ö‡•Å‡§®‡•å‡§§‡•Ä",
    syllabusResearch: "‡§∏‡§ø‡§≤‡•á‡§¨‡§∏ ‡§∞‡§ø‡§∏‡§∞‡•ç‡§ö",
    syllabusResearchDesc: "‡§µ‡§ø‡§∏‡•ç‡§§‡•É‡§§ ‡§∏‡§ø‡§≤‡•á‡§¨‡§∏ ‡§Ö‡§ß‡•ç‡§Ø‡§Ø‡§® ‡§ó‡§æ‡§á‡§°",
    studyTimer: "‡§∏‡•ç‡§Æ‡§æ‡§∞‡•ç‡§ü ‡§∏‡•ç‡§ü‡§°‡•Ä ‡§ü‡§æ‡§á‡§Æ‡§∞",
    studyTimerDesc: "‡§ï‡§∏‡•ç‡§ü‡§Æ ‡§™‡•ã‡§Æ‡•ã‡§°‡•ã‡§∞‡•ã ‡§Ö‡§≤‡§∞‡•ç‡§ü‡•ç‡§∏",
    notesFolders: "‡§®‡•ã‡§ü‡•ç‡§∏ ‡§î‡§∞ ‡§´‡•ã‡§≤‡•ç‡§°‡§∞",
    notesFoldersDesc: "‡§∂‡•â‡§∞‡•ç‡§ü ‡§π‡•à‡§Ç‡§° ‡§î‡§∞ ‡§Ö‡§ï‡§æ‡§¶‡§Æ‡§ø‡§ï ‡§≤‡•â‡§ó‡•ç‡§∏",
    feedbackReview: "‡§´‡•Ä‡§°‡§¨‡•à‡§ï ‡§¶‡§∞‡•ç‡§ú ‡§ï‡§∞‡•á‡§Ç",
    feedbackDesc: "‡§Ö‡§™‡§®‡•Ä ‡§∞‡•á‡§ü‡§ø‡§Ç‡§ó ‡§î‡§∞ ‡§∏‡•Å‡§ù‡§æ‡§µ ‡§∏‡§æ‡§ù‡§æ ‡§ï‡§∞‡•á‡§Ç",
    utilityDashboard: "‡§™‡•ç‡§∞‡•Ä‡§Æ‡§ø‡§Ø‡§Æ ‡§Ø‡•Ç‡§ü‡§ø‡§≤‡§ø‡§ü‡•Ä ‡§°‡•à‡§∂‡§¨‡•ã‡§∞‡•ç‡§° ‡§î‡§∞ ‡§®‡§ø‡§Ø‡§Ç‡§§‡•ç‡§∞‡§£",
    deepResearch: "üî¨ ‡§è‡§°‡§µ‡§æ‡§Ç‡§∏‡•ç‡§° ‡§è‡§Ü‡§à ‡§°‡•Ä‡§™ ‡§∞‡§ø‡§∏‡§∞‡•ç‡§ö ‡§ï‡§Ç‡§∏‡•ã‡§≤",
    deepResearchDesc: "‡§ó‡§π‡§® ‡§™‡•ç‡§∞‡§∂‡•ç‡§®‡•ã‡§Ç ‡§™‡§∞ ‡§¨‡§π‡•Å-‡§∏‡•ç‡§∞‡•ã‡§§ ‡§≤‡§æ‡§á‡§µ ‡§µ‡•á‡§¨ ‡§ñ‡•ã‡§ú ‡§∏‡§§‡•ç‡§Ø‡§æ‡§™‡§® ‡§î‡§∞ ‡§∏‡§Ç‡§¶‡§∞‡•ç‡§≠ ‡§∏‡•Ç‡§ö‡§ø‡§Ø‡•ã‡§Ç ‡§ï‡•ã ‡§∏‡§ï‡•ç‡§∞‡§ø‡§Ø ‡§ï‡§∞‡•á‡§Ç",
    neutralPress: "üì∞ ‡§®‡§ø‡§∑‡•ç‡§™‡§ï‡•ç‡§∑ ‡§µ‡•à‡§∂‡•ç‡§µ‡§ø‡§ï ‡§®‡•ç‡§Ø‡•Ç‡•õ ‡§™‡•ç‡§∞‡•á‡§∏",
    neutralPressDesc: "‡§™‡•Ç‡§∞‡•ç‡§µ‡§æ‡§ó‡•ç‡§∞‡§π-‡§Æ‡•Å‡§ï‡•ç‡§§ ‡§∏‡§§‡•ç‡§Ø‡§æ‡§™‡§ø‡§§ ‡§µ‡•à‡§∂‡•ç‡§µ‡§ø‡§ï ‡§®‡•ç‡§Ø‡•Ç‡•õ ‡§´‡•Ä‡§°, ‡§≤‡§æ‡§á‡§µ ‡§µ‡•á‡§¨ ‡§ó‡•ç‡§∞‡§æ‡§â‡§Ç‡§°‡§ø‡§Ç‡§ó ‡§¶‡•ç‡§µ‡§æ‡§∞‡§æ ‡§Ö‡§™‡§°‡•á‡§ü‡•á‡§°",
    deepResearchActive: "‡§°‡•Ä‡§™ ‡§∏‡§∞‡•ç‡§ö ‡§∏‡§ï‡•ç‡§∞‡§ø‡§Ø",
    deepResearchInactive: "‡§Æ‡§æ‡§®‡§ï ‡§Æ‡•â‡§°‡§≤ ‡§∏‡§∞‡•ç‡§ö ‡§∏‡§ï‡•ç‡§∞‡§ø‡§Ø",
    verifiedNewsTitle: "‡§∏‡§§‡•ç‡§Ø‡§æ‡§™‡§ø‡§§ ‡§µ‡•à‡§∂‡•ç‡§µ‡§ø‡§ï ‡§∏‡§Æ‡§æ‡§ö‡§æ‡§∞ ‡§´‡•Ä‡§°",
    biasFilterLabel: "‡§è‡§Ü‡§à ‡§™‡•Ç‡§∞‡•ç‡§µ‡§æ‡§ó‡•ç‡§∞‡§π-‡§∞‡•ã‡§ß‡•Ä ‡§µ ‡§∂‡•Å‡§¶‡•ç‡§ß‡§§‡§æ ‡§´‡§ø‡§≤‡•ç‡§ü‡§∞ ‡§∏‡§ï‡•ç‡§∞‡§ø‡§Ø",
    fetchNewsButton: "‡§∏‡§§‡•ç‡§Ø‡§æ‡§™‡§ø‡§§ ‡§®‡•ç‡§Ø‡•Ç‡•õ ‡§´‡•Ä‡§° ‡§∞‡•Ä‡§´‡•ç‡§∞‡•á‡§∂ ‡§ï‡§∞‡•á‡§Ç",
    newsLoading: "‡§®‡§ø‡§∑‡•ç‡§™‡§ï‡•ç‡§∑ ‡§∏‡§Æ‡§æ‡§ö‡§æ‡§∞‡•ã‡§Ç ‡§ï‡•Ä ‡§ñ‡•ã‡§ú ‡§î‡§∞ ‡§µ‡§ø‡§∂‡•ç‡§≤‡•á‡§∑‡§£ ‡§ú‡§æ‡§∞‡•Ä ‡§π‡•à...",
    loginTitle: "‡§ó‡•Ç‡§ó‡§≤ ‡§¶‡•ç‡§µ‡§æ‡§∞‡§æ ‡§∏‡§æ‡§á‡§® ‡§á‡§® ‡§ï‡§∞‡•á‡§Ç",
    loginDesc: "‡§∏‡§Æ‡•Ä‡§ï‡•ç‡§∑‡§æ ‡§î‡§∞ ‡§µ‡•ç‡§Ø‡§µ‡§∏‡•ç‡§•‡§æ‡§™‡§ï ‡§∏‡•Å‡§µ‡§ø‡§ß‡§æ‡§ì‡§Ç ‡§ï‡•ã ‡§Ö‡§®‡§≤‡•â‡§ï ‡§ï‡§∞‡§®‡•á ‡§ï‡•á ‡§≤‡§ø‡§è ‡§è‡§ï ‡§Ü‡§ß‡§ø‡§ï‡§æ‡§∞‡§ø‡§ï ‡§ó‡•Ç‡§ó‡§≤ ‡§ñ‡§æ‡§§‡•á ‡§ï‡§æ ‡§ö‡§Ø‡§® ‡§ï‡§∞‡•á‡§Ç‡•§",
    ownerBypass: "‡§∏‡•ç‡§µ‡§æ‡§Æ‡•Ä ‡§è‡§°‡§Æ‡§ø‡§® ‡§≤‡•â‡§ó‡§ø‡§®:",
    ownerBypassDesc: "‡§π‡§Ç‡§∏‡§≤‡§æ‡§≤ ‡§™‡§æ‡§≤ ‡§ú‡•Ä ‡§ï‡•á ‡§∞‡•Ç‡§™ ‡§Æ‡•á‡§Ç ‡§≤‡•â‡§ó‡§ø‡§® ‡§ï‡§∞‡§®‡•á ‡§ï‡•á ‡§≤‡§ø‡§è palhanslal4@gmail.com ‡§ï‡§æ ‡§â‡§™‡§Ø‡•ã‡§ó ‡§ï‡§∞‡•á‡§Ç‡•§ ‡§Ö‡§®‡•ç‡§Ø ‡§á‡§®‡§™‡•Å‡§ü ‡§µ‡§æ‡§∏‡•ç‡§§‡§µ‡§ø‡§ï ‡§ó‡•Ç‡§ó‡§≤ ‡§õ‡§æ‡§§‡•ç‡§∞ ‡§™‡•ç‡§∞‡•ã‡§´‡§æ‡§á‡§≤ ‡§ï‡§æ ‡§Ö‡§®‡•Å‡§ï‡§∞‡§£ ‡§ï‡§∞‡•á‡§Ç‡§ó‡•á‡•§",
    yourNameLabel: "‡§Ü‡§™‡§ï‡§æ ‡§®‡§æ‡§Æ",
    emailLabel: "‡§à‡§Æ‡•á‡§≤ ‡§™‡§§‡§æ",
    googleSignInBtn: "‡§ó‡•Ç‡§ó‡§≤ ‡§∏‡•á ‡§∏‡§æ‡§á‡§® ‡§á‡§® ‡§ï‡§∞‡•á‡§Ç",
    verifyProceed: "‡§∏‡§§‡•ç‡§Ø‡§æ‡§™‡§ø‡§§ ‡§ï‡§∞‡•á‡§Ç ‡§î‡§∞ ‡§Ü‡§ó‡•á ‡§¨‡§¢‡§º‡•á‡§Ç",
    feedbackTitle: "‡§â‡§™‡§Ø‡•ã‡§ó‡§ï‡§∞‡•ç‡§§‡§æ ‡§Ö‡§®‡•Å‡§≠‡§µ ‡§∏‡§Æ‡•Ä‡§ï‡•ç‡§∑‡§æ‡§è‡§Å",
    feedbackWrite: "‡§è‡§ï ‡§∏‡§Æ‡•Ä‡§ï‡•ç‡§∑‡§æ ‡§≤‡§ø‡§ñ‡•á‡§Ç",
    feedbackLoggedOutWarning: "‡§∏‡§Æ‡•Ä‡§ï‡•ç‡§∑‡§æ ‡§¶‡§∞‡•ç‡§ú ‡§ï‡§∞‡§®‡•á ‡§ï‡•á ‡§≤‡§ø‡§è ‡§ï‡•É‡§™‡§Ø‡§æ ‡§Ö‡§™‡§®‡•á ‡§ó‡•Ç‡§ó‡§≤ ‡§ñ‡§æ‡§§‡•á ‡§∏‡•á ‡§∏‡§æ‡§á‡§® ‡§á‡§® ‡§ï‡§∞‡•á‡§Ç‡•§",
    submitFeedbackBtn: "‡§∏‡§Æ‡•Ä‡§ï‡•ç‡§∑‡§æ ‡§≠‡•á‡§ú‡•á‡§Ç",
    ratingAccuracy: "‡§§‡§•‡•ç‡§Ø‡§æ‡§§‡•ç‡§Æ‡§ï ‡§∂‡•Å‡§¶‡•ç‡§ß‡§§‡§æ",
    ratingSpeed: "‡§∏‡§ø‡§∏‡•ç‡§ü‡§Æ ‡§ï‡•Ä ‡§ó‡§§‡§ø ‡§µ ‡§≤‡•á‡§ü‡•á‡§Ç‡§∏‡•Ä",
    ratingExperience: "‡§Ø‡•Ç‡§Ü‡§à ‡§Ö‡§®‡•Å‡§≠‡§µ",
    reviewTextPlaceholder: "‡§π‡§Ç‡§∏‡§è‡§Ü‡§à ‡§ï‡•Ä ‡§ó‡§§‡§ø, ‡§â‡§™‡§Ø‡•ã‡§ó‡§ø‡§§‡§æ ‡§Ø‡§æ ‡§µ‡§ø‡§∑‡§Ø‡§µ‡§∏‡•ç‡§§‡•Å ‡§™‡§∞ ‡§Ö‡§™‡§®‡•Ä ‡§∏‡•ç‡§™‡§∑‡•ç‡§ü ‡§ü‡§ø‡§™‡•ç‡§™‡§£‡•Ä ‡§≤‡§ø‡§ñ‡•á‡§Ç...",
    aboutCreatorTitle: "‡§®‡§ø‡§∞‡•ç‡§Æ‡§æ‡§§‡§æ ‡§ï‡•á ‡§¨‡§æ‡§∞‡•á ‡§Æ‡•á‡§Ç",
    logoutBtn: "‡§≤‡•â‡§ó ‡§Ü‡§â‡§ü",
    welcomeGreeting: "‡§®‡§Æ‡§∏‡•ç‡§§‡•á! ‡§Æ‡•à‡§Ç ‡§π‡§Ç‡§∏‡§è‡§Ü‡§à ‡§π‡•Ç‡§Å, ‡§Ü‡§™‡§ï‡§æ ‡§è‡§Ü‡§à ‡§∏‡§æ‡§•‡•Ä‡•§ ‡§Ü‡§ú ‡§Ü‡§™ ‡§ï‡§ø‡§∏ ‡§µ‡§ø‡§∑‡§Ø ‡§ï‡•á ‡§¨‡§æ‡§∞‡•á ‡§Æ‡•á‡§Ç ‡§ú‡§æ‡§®‡§®‡§æ, ‡§∏‡•Ä‡§ñ‡§®‡§æ ‡§Ø‡§æ ‡§∂‡•ã‡§ß ‡§ï‡§∞‡§®‡§æ ‡§ö‡§æ‡§π‡§§‡•á ‡§π‡•à‡§Ç?",
    micListening: "‡§∏‡•Å‡§® ‡§∞‡§π‡§æ ‡§π‡•Ç‡§Å... ‡§Ö‡§¨ ‡§¨‡•ã‡§≤‡•á‡§Ç",
    micTooltip: "‡§Ü‡§µ‡§æ‡§ú ‡§¶‡•ç‡§µ‡§æ‡§∞‡§æ ‡§ü‡§æ‡§á‡§™ ‡§ï‡§∞‡•á‡§Ç (‡§∏‡•ç‡§™‡•Ä‡§ö-‡§ü‡•Ç-‡§ü‡•á‡§ï‡•ç‡§∏‡•ç‡§ü)",
    speakerTooltip: "‡§∏‡§π‡§æ‡§Ø‡§ï ‡§ï‡•á ‡§â‡§§‡•ç‡§§‡§∞ ‡§ï‡•ã ‡§¨‡•ã‡§≤‡§ï‡§∞ ‡§∏‡•Å‡§®‡•á‡§Ç",
    creatorAnswerText: "‡§π‡§Ç‡§∏‡§è‡§Ü‡§à ‡§ï‡•ã ‡§µ‡§ø‡§¶‡•ç‡§Ø‡§æ‡§∞‡•ç‡§•‡§ø‡§Ø‡•ã‡§Ç ‡§î‡§∞ ‡§∂‡•ã‡§ß‡§ï‡§∞‡•ç‡§§‡§æ‡§ì‡§Ç ‡§ï‡•ã ‡§∏‡§∂‡§ï‡•ç‡§§ ‡§¨‡§®‡§æ‡§®‡•á ‡§è‡§µ‡§Ç ‡§§‡•ç‡§µ‡§∞‡§ø‡§§ ‡§Ö‡§ß‡•ç‡§Ø‡§Ø‡§® ‡§Æ‡•á‡§Ç ‡§∏‡§π‡§æ‡§Ø‡§§‡§æ ‡§π‡•á‡§§‡•Å ‡§§‡•à‡§Ø‡§æ‡§∞ ‡§ï‡§ø‡§Ø‡§æ ‡§ó‡§Ø‡§æ ‡§π‡•à‡•§",
    noAccountHeader: "‡§Ö‡§™‡§®‡•á ‡§ñ‡§æ‡§§‡•á ‡§ï‡•ã ‡§∏‡§§‡•ç‡§Ø‡§æ‡§™‡§ø‡§§ ‡§ï‡§∞‡•á‡§Ç",
    selectAccountHeader: "‡§ó‡•Ç‡§ó‡§≤ ‡§ñ‡§æ‡§§‡§æ ‡§ö‡•Å‡§®‡§®‡•á ‡§µ‡§æ‡§≤‡§æ",
    useAnotherAccount: "‡§®‡§Ø‡§æ ‡§ó‡•Ç‡§ó‡§≤ ‡§Ö‡§ï‡§æ‡§â‡§Ç‡§ü ‡§ú‡•ã‡•ú‡•á‡§Ç",
    activeSearch: "‡§ó‡§π‡§® ‡§µ‡•á‡§¨ ‡§∞‡§ø‡§∏‡§∞‡•ç‡§ö ‡§ú‡§æ‡§∞‡•Ä ‡§π‡•à...",
    ownerDashboard: "‡§∏‡•ç‡§µ‡§æ‡§Æ‡•Ä ‡§è‡§°‡§Æ‡§ø‡§® ‡§°‡•à‡§∂‡§¨‡•ã‡§∞‡•ç‡§°",
    noAdminWarning: "‡§™‡§π‡•Å‡§Ç‡§ö ‡§Ö‡§∏‡•ç‡§µ‡•Ä‡§ï‡•É‡§§‡•§ ‡§ï‡•á‡§µ‡§≤ palhanslal4@gmail.com ‡§π‡•Ä ‡§è‡§°‡§Æ‡§ø‡§® ‡§ï‡§Ç‡§∏‡•ã‡§≤ ‡§ñ‡•ã‡§≤ ‡§∏‡§ï‡§§‡•á ‡§π‡•à‡§Ç‡•§",
    backToHome: "‡§Ö‡§ß‡•ç‡§Ø‡§Ø‡§® ‡§ï‡•ç‡§∑‡•á‡§§‡•ç‡§∞ ‡§Æ‡•á‡§Ç ‡§≤‡•å‡§ü‡•á‡§Ç",
    totalReviews: "‡§∏‡§≠‡•Ä ‡§∏‡§π‡•á‡§ú‡•á ‡§ó‡§è ‡§´‡•Ä‡§°‡§¨‡•à‡§ï",
    carouselAccuracy: "‡§∂‡•Å‡§¶‡•ç‡§ß‡§§‡§æ",
    carouselSpeed: "‡§ó‡§§‡§ø",
    carouselUI: "‡§Ø‡•Ç‡§Ü‡§à",
  },
  spanish: {
    appTitle: "HansAI",
    subtitle: "Su Compa√±ero de IA",
    welcomeTitle: "¬øC√≥mo puedo ayudarte hoy?",
    welcomeDesc: "Explicando conceptos de forma sencilla o realizando investigaciones profundas de m√∫ltiples fuentes en la web.",
    exploreWorkspaces: "EXPLORAR ESPACIOS DE TRABAJO DE PR√ìXIMA GENERACI√ìN",
    cancel: "Cancelar",
    quickServices: "Servicios R√°pidos",
    interactiveQuiz: "Cuestionario Interactivo",
    syllabusResearch: "Investigaci√≥n del Plan de Estudios",
    studyTimer: "Temporizador de Estudio Inteligente",
    notesFolders: "Notas y Carpetas",
    feedbackReview: "Enviar sugerencia",
    utilityDashboard: "Panel de Utilidades Premium",
    deepResearch: "Consola de Investigaci√≥n Profunda de IA",
    verifiedNewsTitle: "Canal de Noticias Verificadas",
    newsLoading: "Analizando noticias neutrales...",
    loginTitle: "Registrarse con Google",
    logoutBtn: "Cerrar sesi√≥n",
    welcomeGreeting: "¬°Hola! Soy HansAI, tu compa√±ero de IA. ¬øC√≥mo puedo ayudarte a aprender, escribir o investigar hoy?",
    creatorAnswerText: "HansAI ha sido dise√±ado para empoderar a estudiantes, investigadores y profesionales."
  },
  french: {
    appTitle: "HansAI",
    subtitle: "Votre Compagnon IA",
    welcomeTitle: "Comment puis-je vous aider aujourd'hui?",
    welcomeDesc: "Expliquer des concepts simplement ou effectuer des recherches approfondies de sources multiples sur le web.",
    exploreWorkspaces: "EXPLORER LES ESPACES DE TRAVAIL DE NOUVELLE G√âN√âRATION",
    cancel: "Annuler",
    quickServices: "Services Rapides",
    interactiveQuiz: "Quiz Interactif",
    syllabusResearch: "Recherche de Programme",
    studyTimer: "Minuteur d'√âtude Intelligent",
    notesFolders: "Notes & Dossiers",
    feedbackReview: "Soumettre un avis",
    utilityDashboard: "Tableau de Bord Premium",
    deepResearch: "Console de Recherche IA Approfondie",
    verifiedNewsTitle: "Fil d'Actualit√©s V√©rifi√©es",
    newsLoading: "Analyse des nouvelles neutres en cours...",
    loginTitle: "Se connecter avec Google",
    logoutBtn: "Se d√©connecter",
    welcomeGreeting: "Bonjour! Je suis HansAI, votre compagnon IA. Comment puis-je vous aider √† apprendre, √† √©crire ou √† faire des recherches aujourd'hui?",
    creatorAnswerText: "HansAI a √©t√© con√ßu pour autonomiser les √©tudiants, les chercheurs et les professionnels."
  },
  german: {
    appTitle: "HansAI",
    subtitle: "Ihr KI-Begleiter",
    welcomeTitle: "Wie kann ich Ihnen heute helfen?",
    welcomeDesc: "Konzepte einfach erkl√§ren oder tiefgehende Recherchen aus mehreren Webquellen durchf√ºhren.",
    exploreWorkspaces: "NEXT-GEN ARBEITSBEREICHE ERKUNDEN",
    cancel: "Abbrechen",
    quickServices: "Schnellunterst√ºtzung",
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

    showToast(language === 'hindi' ? "üìÑ PDF ‡§§‡•à‡§Ø‡§æ‡§∞ ‡§π‡•ã ‡§∞‡§π‡§æ ‡§π‡•à, ‡§ï‡•É‡§™‡§Ø‡§æ ‡§™‡•ç‡§∞‡§§‡•Ä‡§ï‡•ç‡§∑‡§æ ‡§ï‡§∞‡•á‡§Ç..." : "üìÑ Generating high-res PDF...", "info");
    const success = await generateStudyNotesPdf({
      title: title || 'HansAI Study Notes',
      content: content,
      author: user?.name || user?.email || 'HansAI Student',
      language: language
    });

    if (success) {
      showToast(language === 'hindi' ? "üìÑ PDF ‡§´‡§æ‡§á‡§≤ ‡§∏‡§´‡§≤‡§§‡§æ‡§™‡•Ç‡§∞‡•ç‡§µ‡§ï ‡§°‡§æ‡§â‡§®‡§≤‡•ã‡§° ‡§π‡•ã ‡§ó‡§à! üì•" : "üìÑ PDF downloaded successfully! üì•", "success");
    }
  };

  // 1-Click Message to PDF Downloader
  const handleDownloadMessagePdf = async (msg: Message) => {
    showToast(language === 'hindi' ? "üì• PDF ‡§§‡•à‡§Ø‡§æ‡§∞ ‡§π‡•ã ‡§∞‡§π‡§æ ‡§π‡•à..." : "üì• Preparing PDF...", "info");
    const success = await generateStudyNotesPdf({
      title: `HansAI Study Notes - ${new Date().toLocaleDateString()}`,
      topic: msg.content.slice(0, 45).replace(/[#*`]/g, '').trim(),
      content: msg.content,
      author: user?.name || user?.email || 'HansAI Student',
      language: language
    });
    if (success) {
      showToast(language === 'hindi' ? "üì• ‡§®‡•ã‡§ü‡•ç‡§∏ ‡§ï‡•Ä PDF ‡§´‡§æ‡§á‡§≤ ‡§°‡§æ‡§â‡§®‡§≤‡•ã‡§° ‡§π‡•ã ‡§ó‡§à!" : "üì• Study notes PDF downloaded!", "success");
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
      { progress: 35, status: "Loading HansAI Core... / ‡§π‡§Ç‡§∏-‡§è‡§Ü‡§à ‡§≤‡•ã‡§° ‡§π‡•ã ‡§∞‡§π‡§æ ‡§π‡•à" },
      { progress: 65, status: "Preparing Shorthand & SSC Modules..." },
      { progress: 90, status: "Connecting 1,420 Active Students..." },
      { progress: 100, status: "Welcome to HansAI! / ‡§∏‡•ç‡§µ‡§æ‡§ó‡§§‡§Æ!" }
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
            ? "‚è±Ô∏è 3 ‡§ò‡§Ç‡§ü‡•á ‡§ï‡•Ä ‡§∏‡§§‡•ç‡§∞ ‡§∏‡•Ä‡§Æ‡§æ ‡§∏‡§Æ‡§æ‡§™‡•ç‡§§! ‡§Ü‡§™‡§ï‡§æ ‡§Ö‡§ï‡§æ‡§â‡§Ç‡§ü ‡§ë‡§ü‡•ã‡§Æ‡•à‡§ü‡§ø‡§ï ‡§≤‡•â‡§ó‡§Ü‡§â‡§ü ‡§ï‡§∞ ‡§¶‡§ø‡§Ø‡§æ ‡§ó‡§Ø‡§æ ‡§π‡•à‡•§"
            : "‚è±Ô∏è 3 Hours Session Limit Reached! You have been automatically logged out for security and study discipline.",
          "warn"
        );

        // Append assistant chat notification message
        setChatMessages(prev => [
          ...prev,
          {
            id: `sys-logout-${Date.now()}`,
            role: 'assistant',
            content: language === 'hindi'
              ? "‚ö†Ô∏è **‡§∏‡•ç‡§µ‡§ö‡§æ‡§≤‡§ø‡§§ ‡§≤‡•â‡§ó‡§Ü‡§â‡§ü ‡§∏‡•Ç‡§ö‡§®‡§æ (3 Hours Auto Logout Notification)**\n\n‡§Ü‡§™‡§ï‡•Ä 3 ‡§ò‡§Ç‡§ü‡•á ‡§ï‡•Ä ‡§®‡§ø‡§∞‡§Ç‡§§‡§∞ ‡§Ö‡§ß‡•ç‡§Ø‡§Ø‡§® ‡§∏‡§§‡•ç‡§∞ ‡§∏‡•Ä‡§Æ‡§æ ‡§™‡•Ç‡§∞‡•Ä ‡§π‡•ã ‡§ö‡•Å‡§ï‡•Ä ‡§π‡•à‡•§ ‡§∏‡•Å‡§∞‡§ï‡•ç‡§∑‡§æ ‡§è‡§µ‡§Ç ‡§Ö‡§ß‡•ç‡§Ø‡§Ø‡§® ‡§Ö‡§®‡•Å‡§∂‡§æ‡§∏‡§® ‡§¨‡§®‡§æ‡§è ‡§∞‡§ñ‡§®‡•á ‡§ï‡•á ‡§≤‡§ø‡§è ‡§Ü‡§™‡§ï‡§æ ‡§Ö‡§ï‡§æ‡§â‡§Ç‡§ü ‡§ë‡§ü‡•ã‡§Æ‡•à‡§ü‡§ø‡§ï ‡§≤‡•â‡§ó‡§Ü‡§â‡§ü ‡§ï‡§ø‡§Ø‡§æ ‡§ó‡§Ø‡§æ ‡§π‡•à‡•§\n\n‡§™‡•Å‡§®‡§É ‡§Ö‡§≠‡•ç‡§Ø‡§æ‡§∏ ‡§ú‡§æ‡§∞‡•Ä ‡§∞‡§ñ‡§®‡•á ‡§ï‡•á ‡§≤‡§ø‡§è ‡§ï‡•É‡§™‡§Ø‡§æ **Login / Register** ‡§ï‡§∞‡•á‡§Ç‡•§"
              : "‚ö†Ô∏è **Automatic Logout Notification (3 Hours Limit Reached)**\n\nYour 3-hour continuous study session limit has expired. To maintain security and learning discipline, your session has been automatically logged out.\n\nPlease click **Login / Register** to start a new session.",
            timestamp: new Date()
          }
        ]);
      } else if (remaining <= WARNING_THRESHOLD_MS && !warningShown) {
        warningShown = true;
        const remMins = Math.ceil(remaining / (60 * 1000));
        showToast(
          language === 'hindi'
            ? `‚è±Ô∏è ‡§ß‡•ç‡§Ø‡§æ‡§® ‡§¶‡•á‡§Ç! ‡§Ü‡§™‡§ï‡§æ ‡§∏‡§§‡•ç‡§∞ ${remMins} ‡§Æ‡§ø‡§®‡§ü ‡§Æ‡•á‡§Ç (3 ‡§ò‡§Ç‡§ü‡•á ‡§™‡•Ç‡§∞‡•á ‡§π‡•ã‡§®‡•á ‡§™‡§∞) ‡§ë‡§ü‡•ã‡§Æ‡•à‡§ü‡§ø‡§ï ‡§≤‡•â‡§ó‡§Ü‡§â‡§ü ‡§π‡•ã ‡§ú‡§æ‡§è‡§ó‡§æ‡•§`
            : `‚è±Ô∏è Notice! Your session will auto-logout in ${remMins} minutes (3 hours limit).`,
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
        const deviceStr = (isMobile ? 'üì± Mobile' : 'üíª Desktop') + (platform ? ` (${platform})` : '');

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
            name: `${isMobile ? 'üì± Guest Mobile' : 'üíª Guest Desktop'} (${visitorId.slice(-6)})`,
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
      { id: 'usr_01', name: 'Hanslal Pal (Founder Owner)', email: 'palhanslal4@gmail.com', registeredAt: '2026-01-01T08:00:00.000Z', lastActiveAt: new Date().toISOString(), promptCount: 142, deviceInfo: 'üíª Founder Admin Station', isGuest: false, referralSource: 'Owner Console' }
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
    { id: 'sp_01', title: 'SSC CGL Tier-1 Final Result & Marks Released 2026', category: 'Results', date: 'Today / ‡§Ü‡§ú', url: 'https://www.sarkariresult.com/' },
    { id: 'sp_02', title: 'BPSC 71st Combined Prelims Admit Card Download Direct Link', category: 'Admit Card', date: 'Today / ‡§Ü‡§ú', url: 'https://www.sarkariresult.com/' },
    { id: 'sp_03', title: 'Railway RRB NTPC Graduate / Non-Graduate 11,558 Posts Online Form', category: 'Latest Jobs', date: 'New / ‡§®‡§Ø‡§æ', url: 'https://www.sarkariresult.com/' },
    { id: 'sp_04', title: 'UP Police Constable Final Answer Key & PET Exam Schedule', category: 'Answer Key', date: 'New / ‡§®‡§Ø‡§æ', url: 'https://www.sarkariresult.com/' },
    { id: 'sp_05', title: 'Bihar TRE 4.0 Teacher Recruitment 1 Lakh+ Vacancy Notification', category: 'Latest Jobs', date: 'Latest / ‡§®‡§µ‡•Ä‡§®‡§§‡§Æ', url: 'https://www.sarkariresult.com/' },
    { id: 'sp_06', title: 'UPSC Civil Services CSE Prelims 2026 Online Application Form', category: 'Latest Jobs', date: 'Live / ‡§≤‡§æ‡§á‡§µ', url: 'https://www.sarkariresult.com/' }
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
      showToast("Owner Admin Password Verified! Welcome Hanslal Pal Ji üõ°Ô∏è", "success");
      fetchOwnerAnalytics();
    } else {
      setOwnerPasswordError(true);
      addAdminAuditLog(`Failed unlock attempt: ${input.substring(0, 3)}***`, "Security");
      showToast("Incorrect Password! / ‡§ó‡§≤‡§§ ‡§™‡§æ‡§∏‡§µ‡§∞‡•ç‡§° ‡§¶‡§∞‡•ç‡§ú ‡§ï‡§ø‡§Ø‡§æ ‡§ó‡§Ø‡§æ", "warn");
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
    if (!window.confirm(`‡§ï‡•ç‡§Ø‡§æ ‡§Ü‡§™ ${usr.name} (${usr.email}) ‡§ï‡§æ ‡§°‡•á‡§ü‡§æ ‡§∏‡•ç‡§•‡§æ‡§Ø‡•Ä ‡§∞‡•Ç‡§™ ‡§∏‡•á ‡§°‡§ø‡§≤‡•Ä‡§ü ‡§ï‡§∞‡§®‡§æ ‡§ö‡§æ‡§π‡§§‡•á ‡§π‡•à‡§Ç?`)) {
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
        showToast(`User ${usr.name} deleted successfully! üóëÔ∏è`, "success");
        if (selectedUserBiodata?.id === usr.id) setSelectedUserBiodata(null);
        fetchOwnerAnalytics();
      } else {
        showToast("Deleted from Firestore! üóëÔ∏è", "success");
        fetchOwnerAnalytics();
      }
    } catch (err) {
      showToast("User deleted from Firestore. üóëÔ∏è", "info");
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
      showToast(`Welcome ${cleanName}! Registered successfully in Firestore. üéâ`, "success");
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
      const devStr = isMobile ? 'üì± Guest Mobile' : 'üíª Guest Desktop';
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
        ? `‡§á‡§§‡§ø‡§π‡§æ‡§∏ ‡§∏‡•á "${title ? title.slice(0, 30) : '‡§Ü‡§á‡§ü‡§Æ'}" ‡§π‡§ü‡§æ ‡§¶‡§ø‡§Ø‡§æ ‡§ó‡§Ø‡§æ üóëÔ∏è`
        : `Cleared item from history üóëÔ∏è`,
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
    showToast('Chat session deleted üóëÔ∏è', 'info');
  };

  const handleRenameChat = (id: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    setSavedChats(prev => prev.map(c => c.id === id ? { ...c, title: newTitle.trim() } : c));
    setEditingChatId(null);
    setEditingChatTitle('');
    showToast('Chat title updated ‚úèÔ∏è', 'success');
  };

  const handlePinChat = (id: string) => {
    setSavedChats(prev => prev.map(c => c.id === id ? { ...c, isPinned: !c.isPinned } : c));
    showToast('Chat pin status updated üìå', 'info');
  };

  const handleClearAllChats = () => {
    setSavedChats([]);
    setCurrentChatSessionId(null);
    setChatMessages([]);
    setIsClearAllChatsModalOpen(false);
    showToast('All chat history cleared üßπ', 'info');
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
        showToast(language === 'hindi' ? "‡§∏‡§§‡•ç‡§Ø‡§æ‡§™‡§ø‡§§ ‡§®‡•ç‡§Ø‡•Ç‡•õ ‡§´‡•Ä‡§° ‡§∏‡§´‡§≤‡§§‡§æ‡§™‡•Ç‡§∞‡•ç‡§µ‡§ï ‡§Ö‡§™‡§°‡•á‡§ü ‡§ï‡•Ä ‡§ó‡§à! üì∞" : "Latest bias-filtered news feed synchronized! üì∞", "success");
      }
    } catch (err) {
      console.error(err);
      showToast("‡§®‡•ç‡§Ø‡•Ç‡•õ ‡§´‡•Ä‡§° ‡§≤‡§æ‡§®‡•á ‡§Æ‡•á‡§Ç ‡§∏‡§Æ‡§∏‡•ç‡§Ø‡§æ‡•§", "warn");
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
        comment: '‡§Ö‡§¶‡•ç‡§≠‡•Å‡§§ ‡§™‡•ç‡§≤‡•á‡§ü‡§´‡•â‡§∞‡•ç‡§Æ! ‡§π‡§ø‡§®‡•ç‡§¶‡•Ä ‡§î‡§∞ ‡§á‡§Ç‡§ó‡•ç‡§≤‡§ø‡§∂ ‡§Æ‡•á‡§Ç 100% ‡§∂‡•Å‡§¶‡•ç‡§ß‡§§‡§æ ‡§ï‡•á ‡§∏‡§æ‡§• ‡§∏‡§ø‡§≤‡•á‡§¨‡§∏ ‡§§‡§•‡§æ ‡§ï‡•ú‡§ï ‡§Æ‡§æ‡§∞‡•ç‡§ó‡§¶‡§∞‡•ç‡§∂‡§® ‡§∏‡§ï‡•ç‡§∑‡§Æ ‡§π‡•à‡•§',
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

  // ‚≠ê Automatic 5-Star Feedback Popup Trigger when user finishes a feature or quiz and returns to Home / Chat
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
    showToast("üéØ ‡§¶‡•à‡§®‡§ø‡§ï ‡§≤‡§ï‡•ç‡§∑‡•ç‡§Ø ‡§Ö‡§®‡•Å‡§∏‡•ç‡§Æ‡§æ‡§∞‡§ï: ‡§Ü‡§™‡§ï‡•á ‡§™‡§æ‡§∏ ‡§Ö‡§≠‡•Ä ‡§≠‡•Ä ‡§ï‡•Å‡§õ ‡§Ö‡§ß‡•Ç‡§∞‡•á ‡§¶‡•à‡§®‡§ø‡§ï ‡§≤‡§ï‡•ç‡§∑‡•ç‡§Ø ‡§π‡•à‡§Ç!", "warn");
    setReminderAlertState(true);
    
    // Try browser Notification natively
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        try {
          new Notification("HansAI Goal Reminder / ‡§Ø‡§æ‡§¶ ‡§¶‡§ø‡§≤‡§æ‡§®‡•á ‡§µ‡§æ‡§≤‡§æ", {
            body: "‡§Ü‡§™‡§ï‡•á ‡§™‡§æ‡§∏ ‡§Ö‡§≠‡•Ä ‡§≠‡•Ä ‡§ï‡•Å‡§õ ‡§Ö‡§ß‡•Ç‡§∞‡•á ‡§¶‡•à‡§®‡§ø‡§ï ‡§≤‡§ï‡•ç‡§∑‡•ç‡§Ø ‡§π‡•à‡§Ç! ‡§á‡§®‡•ç‡§π‡•á‡§Ç ‡§Ü‡§ú ‡§π‡•Ä ‡§™‡•Ç‡§∞‡•ç‡§£ ‡§ï‡§∞‡•á‡§Ç ‡§î‡§∞ ‡§§‡•à‡§Ø‡§æ‡§∞‡•Ä ‡§ï‡•ú‡§ï ‡§∞‡§ñ‡•á‡§Ç‡•§ üöÄ",
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
    setVoiceAssistantStatus("üîä Speaking AI Response...");

    speakText(replyText, {
      lang: selectedIndianVoiceLang,
      rate: 1.0,
      onEnd: () => {
        isVoiceAssistantSpeakingRef.current = false;
        setIsVoiceAssistantSpeaking(false);
        setVoiceAssistantStatus(
          language === 'hindi' 
            ? "üü¢ ‡§è‡§ï‡•ç‡§ü‡§ø‡§µ - ‡§¨‡•ã‡§≤‡§ø‡§è (‡§Ü‡§™‡§ï‡•Ä ‡§Ü‡§µ‡§æ‡§ú‡§º ‡§∏‡•Å‡§®‡•Ä ‡§ú‡§æ ‡§∞‡§π‡•Ä ‡§π‡•à...)" 
            : "üü¢ Active - Listening for your voice..."
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
            ? "üü¢ ‡§è‡§ï‡•ç‡§ü‡§ø‡§µ - ‡§¨‡•ã‡§≤‡§ø‡§è (‡§Ü‡§™‡§ï‡•Ä ‡§Ü‡§µ‡§æ‡§ú‡§º ‡§∏‡•Å‡§®‡•Ä ‡§ú‡§æ ‡§∞‡§π‡•Ä ‡§π‡•à...)" 
            : "üü¢ Active - Listening for your voice..."
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
      .replace(/^(ok|okay|hey|hello|‡§ì‡§™‡•á‡§®|‡§ì‡§ï‡•á|‡§ì‡§ï|‡§ì‡§™‡§®)?\s*(open\s*ai|ai|hansai|‡§ì‡§™‡•á‡§®\s*‡§è‡§Ü‡§à|‡§ì‡§ï‡•á\s*‡§è‡§Ü‡§à|‡§ì‡§ï\s*‡§è‡§Ü‡§à|‡§ì‡§™‡§®\s*‡§è‡§Ü‡§à)\b/i, "")
      .trim();

    if (!cleanQuery) cleanQuery = queryText;

    setVoiceAssistantStatus(`ü§î Thinking: "${cleanQuery}"`);
    showToast(`üéôÔ∏è Hands-Free Query: "${cleanQuery}"`, "info");

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
            ? "üü¢ ‡§è‡§ï‡•ç‡§ü‡§ø‡§µ - ‡§¨‡•ã‡§≤‡§ø‡§è (‡§¨‡•ã‡§≤‡§®‡•á ‡§ï‡•á ‡§¨‡§æ‡§¶ 1 ‡§∏‡•á‡§ï‡§Ç‡§° ‡§∞‡•Å‡§ï‡•á‡§Ç)"
            : "üü¢ Active - Speak now (AI responds 1s after you pause)"
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
        setVoiceAssistantStatus(`üéôÔ∏è Hearing: "${trimmed}"`);

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
          setVoiceAssistantStatus("‚ö†Ô∏è Microphone Permission Denied.");
          showToast("‚ö†Ô∏è Microphone access denied. Please allow mic permissions in browser settings.", "warn");
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
          ? "‡§á‡§∏ ‡§¨‡•ç‡§∞‡§æ‡§â‡§ú‡§º‡§∞ ‡§Æ‡•á‡§Ç ‡§µ‡•â‡§Ø‡§∏ ‡§Ö‡§∏‡•ç‡§∏‡§ø‡§∏‡•ç‡§ü‡•á‡§Ç‡§ü ‡§∏‡§Æ‡§∞‡•ç‡§•‡§ø‡§§ ‡§®‡§π‡•Ä‡§Ç ‡§π‡•à‡•§ ‡§ï‡•É‡§™‡§Ø‡§æ Chrome ‡§Ø‡§æ Edge ‡§ï‡§æ ‡§â‡§™‡§Ø‡•ã‡§ó ‡§ï‡§∞‡•á‡§Ç‡•§" 
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
    showToast("üéôÔ∏è Hands-Free Voice Assistant Active! Speak your question.", "success");

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
          ? "‡§á‡§∏ ‡§¨‡•ç‡§∞‡§æ‡§â‡§ú‡§º‡§∞ ‡§Æ‡•á‡§Ç ‡§µ‡•â‡§Ø‡§∏ ‡§°‡§ø‡§ï‡•ç‡§ü‡•á‡§∂‡§® ‡§∏‡§Æ‡§∞‡•ç‡§•‡§ø‡§§ ‡§®‡§π‡•Ä‡§Ç ‡§π‡•à‡•§ ‡§ï‡•É‡§™‡§Ø‡§æ Chrome ‡§Ø‡§æ Edge ‡§ï‡§æ ‡§â‡§™‡§Ø‡•ã‡§ó ‡§ï‡§∞‡•á‡§Ç‡•§" 
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
          ? "‡§á‡§∏ ‡§¨‡•ç‡§∞‡§æ‡§â‡§ú‡§º‡§∞ ‡§Æ‡•á‡§Ç ‡§µ‡•â‡§Ø‡§∏ ‡§°‡§ø‡§ï‡•ç‡§ü‡•á‡§∂‡§® ‡§∏‡§Æ‡§∞‡•ç‡§•‡§ø‡§§ ‡§®‡§π‡•Ä‡§Ç ‡§π‡•à‡•§ ‡§ï‡•É‡§™‡§Ø‡§æ Chrome ‡§Ø‡§æ Edge ‡§ï‡§æ ‡§â‡§™‡§Ø‡•ã‡§ó ‡§ï‡§∞‡•á‡§Ç‡•§" 
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
            ? "üéôÔ∏è ‡§Æ‡§æ‡§á‡§ï‡•ç‡§∞‡•ã‡§´‡•ã‡§® ‡§ö‡§æ‡§≤‡•Ç! ‡§¨‡•ã‡§≤‡§®‡§æ ‡§∂‡•Å‡§∞‡•Ç ‡§ï‡§∞‡•á‡§Ç..." 
            : "üéôÔ∏è Microphone Active! Start speaking...", 
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
          ? "‡§á‡§∏ ‡§¨‡•ç‡§∞‡§æ‡§â‡§ú‡§º‡§∞ ‡§Æ‡•á‡§Ç ‡§µ‡•â‡§Ø‡§∏ ‡§°‡§ø‡§ï‡•ç‡§ü‡•á‡§∂‡§® ‡§∏‡§Æ‡§∞‡•ç‡§•‡§ø‡§§ ‡§®‡§π‡•Ä‡§Ç ‡§π‡•à‡•§ ‡§ï‡•É‡§™‡§Ø‡§æ Chrome ‡§Ø‡§æ Edge ‡§ï‡§æ ‡§â‡§™‡§Ø‡•ã‡§ó ‡§ï‡§∞‡•á‡§Ç‡•§" 
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
            ? "üéôÔ∏è ‡§Æ‡§æ‡§á‡§ï‡•ç‡§∞‡•ã‡§´‡•ã‡§® ‡§ö‡§æ‡§≤‡•Ç! ‡§¨‡•ã‡§≤‡§ï‡§∞ ‡§®‡•ã‡§ü‡•ç‡§∏ ‡§≤‡§ø‡§ñ‡§®‡§æ ‡§∂‡•Å‡§∞‡•Ç ‡§ï‡§∞‡•á‡§Ç..." 
            : "üéôÔ∏è Microphone Active! Start speaking to dictate notes...", 
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
      .replaceAll('$\\rightarrow$', '‚Üí')
      .replaceAll('\\rightarrow', '‚Üí')
      .replaceAll('$\\leftarrow$', '‚Üê')
      .replaceAll('\\leftarrow', '‚Üê')
      .replaceAll('$\\Rightarrow$', '‚áí')
      .replaceAll('\\Rightarrow', '‚áí')
      .replaceAll('$\\Leftrightarrow$', '‚áî')
      .replaceAll('\\Leftrightarrow', '‚áî')
      .replace(/\$\s*‚Üí\s*\$/g, '‚Üí')
      .replace(/\$\s*([a-zA-Z0-9\s]+)\s*\$/g, '$1');

    const highlightRegex = /(shorthand|steno|stenographer|dictation|consonants|vowels|Pitman|PMEGP|Mudra|subsidy|subsidies|yield percentage|processed goods|machinery|net profit|revenue|‡§π‡§Ç‡§∏‡§≤‡§æ‡§≤ ‡§™‡§æ‡§≤|‡§π‡§Ç‡§∏‡§≤‡§æ‡§≤ ‡§™‡§æ‡§≤ ‡§ú‡•Ä|Article \d+|‡§Ö‡§®‡•Å‡§ö‡•ç‡§õ‡•á‡§¶ \d+|Fundamental Rights|‡§Æ‡•å‡§≤‡§ø‡§ï ‡§Ö‡§ß‡§ø‡§ï‡§æ‡§∞|Important|‡§Æ‡§π‡§§‡•ç‡§µ‡§™‡•Ç‡§∞‡•ç‡§£|Key Point|Key Takeaway|Formula|‡§∏‡•Ç‡§§‡•ç‡§∞|PYQ|Note:|Exam Tip|‡§Ø‡§æ‡§¶ ‡§∞‡§ñ‡•á‡§Ç)/ig;

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

      // Bullet points (* , - , ‚Ä¢ )
      let isBullet = false;
      let bulletText = trimmed;
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('‚Ä¢ ')) {
        isBullet = true;
        bulletText = trimmed.slice(2);
      }

      if (isBullet) {
        renderedElements.push(
          <div key={`bullet-${index}`} className="flex items-start gap-2 my-1 pl-1 text-slate-100">
            <span className="text-amber-400 font-extrabold text-sm leading-none mt-1 select-none">‚Ä¢</span>
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
      emoji: "üèõÔ∏è",
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
      emoji: "üö©",
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
      emoji: "ü¶Å",
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
      emoji: "üî¨",
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
  const [newSegmentEmoji, setNewSegmentEmoji] = useState<string>("üöÄ");
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
        <div class="org-title">üèÜ HANS-AI ACADEMIC EVALUATION COUNCIL</div>
        <div class="sub-org">‡§∞‡§æ‡§∑‡•ç‡§ü‡•ç‡§∞‡•Ä‡§Ø ‡§™‡§∞‡•Ä‡§ï‡•ç‡§∑‡§æ ‡§Æ‡•Ç‡§≤‡•ç‡§Ø‡§æ‡§Ç‡§ï‡§® ‡§è‡§µ‡§Ç ‡§°‡§ø‡§ú‡§ø‡§ü‡§≤ ‡§≤‡§∞‡•ç‡§®‡§ø‡§Ç‡§ó ‡§∏‡§ø‡§∏‡•ç‡§ü‡§Æ (A1 GRADE REPORT)</div>
        <div class="card-type">OFFICIAL CHAPTER SCORECARD & A1 CERTIFICATE</div>
      </div>
      <div class="meta-grid">
        <div class="meta-item"><strong>Student Name / ‡§µ‡§ø‡§¶‡•ç‡§Ø‡§æ‡§∞‡•ç‡§•‡•Ä ‡§ï‡§æ ‡§®‡§æ‡§Æ</strong><span>${studentName}</span></div>
        <div class="meta-item"><strong>Roll / Reg Number</strong><span>${studentRoll}</span></div>
        <div class="meta-item"><strong>Chapter / Subject / ‡§Ö‡§ß‡•ç‡§Ø‡§æ‡§Ø</strong><span>${quizSubject}</span></div>
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
    showToast("A1 Size Report Card Downloaded Successfully! üìú", "success");
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
      { id: 'track-1', exam: 'SSC CGL', subject: 'Quantitative Aptitude', topic: 'Percentage & Interest (‡§™‡•ç‡§∞‡§§‡§ø‡§∂‡§§ ‡§î‡§∞ ‡§¨‡•ç‡§Ø‡§æ‡§ú)', done: true, notes: true, quiz: false },
      { id: 'track-2', exam: 'SSC CGL', subject: 'General Awareness', topic: 'Indian Constitution Articles (‡§Æ‡§π‡§§‡•ç‡§µ‡§™‡•Ç‡§∞‡•ç‡§£ ‡§Ö‡§®‡•Å‡§ö‡•ç‡§õ‡•á‡§¶)', done: false, notes: false, quiz: false },
      { id: 'track-3', exam: 'SSC Stenographer', subject: 'English Grammar', topic: 'Prepositions & Common Errors (‡§™‡•ç‡§∞‡•Ä‡§™‡•ã‡§ú‡•Ä‡§∂‡§® ‡§®‡§ø‡§Ø‡§Æ)', done: true, notes: false, quiz: true },
      { id: 'track-4', exam: 'SSC Stenographer', subject: 'Shorthand Skill', topic: 'Grammalogues & Contractions (‡§∂‡•â‡§∞‡•ç‡§ü‡§π‡•à‡§Ç‡§° ‡§ó‡§§‡§ø ‡§®‡§ø‡§Ø‡§Æ)', done: false, notes: false, quiz: false },
      { id: 'track-5', exam: 'BPSC/State Exams', subject: 'History', topic: 'Modern India Freedom Movement (‡§∏‡•ç‡§µ‡§§‡§Ç‡§§‡•ç‡§∞‡§§‡§æ ‡§∏‡§Ç‡§ó‡•ç‡§∞‡§æ‡§Æ)', done: false, notes: false, quiz: false },
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
  const [morningPoem, setMorningPoem] = useState<string>("‡§ö‡§æ‡§Ø ‡§ï‡•á ‡§∏‡§æ‡§• ‡§ï‡§°‡§º‡§ï ‡§∏‡§Ç‡§ï‡§≤‡•ç‡§™ ‡§ï‡•Ä ‡§¨‡§æ‡§∞‡•Ä,\n‡§π‡§Ç‡§∏‡§≤‡§æ‡§≤ ‡§™‡§æ‡§≤ ‡§ú‡•Ä ‡§ï‡•á ‡§µ‡§ø‡§ú‡§º‡§® ‡§∏‡•á ‡§§‡•à‡§Ø‡§æ‡§∞‡•Ä‡•§\n‡§Ü‡§≤‡§∏‡•ç‡§Ø ‡§ï‡•ã ‡§õ‡•ã‡§°‡§º, ‡§≤‡§ï‡•ç‡§∑‡•ç‡§Ø ‡§ï‡•ã ‡§ó‡§≤‡•á ‡§≤‡§ó‡§æ‡§è‡§Ç,\n‡§ö‡§≤‡•ã ‡§Ü‡§ú SSC ‡§î‡§∞ ‡§∂‡•â‡§∞‡•ç‡§ü‡§π‡•à‡§Ç‡§° ‡§Æ‡•á‡§Ç ‡§ß‡•Ç‡§Æ ‡§Æ‡§ö‡§æ‡§è‡§Ç! ‚òïü•û");
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
      'hanslal pal', '‡§π‡§Ç‡§∏‡§≤‡§æ‡§≤ ‡§™‡§æ‡§≤', 'who created you', 'who made you', 'who built you', 'your creator', 'your founder', 'who is your creator', 'who is your founder'
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
    showToast(`${crop} optimal pricing and volume presets loaded! üåæ`, "success");
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
          showToast("Resumed your in-progress quiz session! üìù‚ö°", "success");
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
              showToast("‡§∏‡§Æ‡§Ø ‡§∏‡§Æ‡§æ‡§™‡•ç‡§§! (Time's up for this question)", "info");
            }
            return 0;
          } else {
            // Total quiz time ended! Finish test
            advanceQuiz();
            showToast("‡§ï‡•Å‡§≤ ‡§∏‡§Æ‡§Ø ‡§∏‡§Æ‡§æ‡§™‡•ç‡§§! (Total Quiz Time Finished)", "info");
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
          question: `"${targetedSubject}" ‡§Ö‡§≠‡•ç‡§Ø‡§æ‡§∏ ‡§™‡•ç‡§∞‡§∂‡•ç‡§® (${targetDifficulty.toUpperCase()}): ‡§á‡§∏ ‡§µ‡§ø‡§∑‡§Ø ‡§ï‡•Ä ‡§¨‡•á‡§π‡§§‡§∞ ‡§§‡•à‡§Ø‡§æ‡§∞‡•Ä ‡§ï‡•á ‡§≤‡§ø‡§è ‡§∏‡§¨‡§∏‡•á ‡§Æ‡§π‡§§‡•ç‡§µ‡§™‡•Ç‡§∞‡•ç‡§£ ‡§∞‡§£‡§®‡•Ä‡§§‡§ø ‡§ï‡•ç‡§Ø‡§æ ‡§π‡•à?`,
          options: [
            "‡§®‡§ø‡§Ø‡§Æ‡§ø‡§§ ‡§Ö‡§≠‡•ç‡§Ø‡§æ‡§∏ ‡§ï‡•ç‡§µ‡§ø‡§ú‡§º ‡§¶‡•á‡§®‡§æ, ‡§ó‡§≤‡§§‡§ø‡§Ø‡•ã‡§Ç ‡§ï‡§æ ‡§µ‡§ø‡§∂‡•ç‡§≤‡•á‡§∑‡§£ ‡§ï‡§∞‡§®‡§æ ‡§î‡§∞ ‡§â‡§§‡•ç‡§§‡§∞‡•ã‡§Ç ‡§ï‡•Ä ‡§µ‡•ç‡§Ø‡§æ‡§ñ‡•ç‡§Ø‡§æ ‡§™‡§¢‡§º‡§®‡§æ",
            "‡§ï‡•á‡§µ‡§≤ ‡§â‡§§‡•ç‡§§‡§∞‡•ã‡§Ç ‡§ï‡•ã ‡§∞‡§ü‡§®‡§æ ‡§¨‡§ø‡§®‡§æ ‡§Ö‡§µ‡§ß‡§æ‡§∞‡§£‡§æ ‡§∏‡§Æ‡§ù‡•á",
            "‡§ï‡§†‡§ø‡§® ‡§µ‡§ø‡§∑‡§Ø‡•ã‡§Ç ‡§ï‡•ã ‡§™‡§∞‡•Ä‡§ï‡•ç‡§∑‡§æ ‡§ï‡•á ‡§≤‡§ø‡§è ‡§õ‡•ã‡§°‡§º ‡§¶‡•á‡§®‡§æ",
            "‡§Ö‡§µ‡§ø‡§∂‡•ç‡§µ‡§∏‡§®‡•Ä‡§Ø ‡§∏‡•ç‡§∞‡•ã‡§§‡•ã‡§Ç ‡§∏‡•á ‡§¨‡§ø‡§®‡§æ ‡§∏‡§Æ‡§Ø ‡§∏‡•Ä‡§Æ‡§æ ‡§Ö‡§≠‡•ç‡§Ø‡§æ‡§∏ ‡§ï‡§∞‡§®‡§æ"
          ],
          answerIndex: 0,
          explanation: "‡§®‡§ø‡§Ø‡§Æ‡§ø‡§§ ‡§ü‡•á‡§∏‡•ç‡§ü ‡§π‡§≤ ‡§ï‡§∞‡§®‡§æ, ‡§ï‡§Æ‡§ú‡•ã‡§∞ ‡§¨‡§ø‡§Ç‡§¶‡•Å‡§ì‡§Ç ‡§ï‡•ã ‡§™‡§π‡§ö‡§æ‡§®‡§®‡§æ ‡§î‡§∞ ‡§∏‡§π‡•Ä ‡§µ‡•ç‡§Ø‡§æ‡§ñ‡•ç‡§Ø‡§æ ‡§∏‡§Æ‡§ù‡§®‡§æ ‡§™‡§∞‡•Ä‡§ï‡•ç‡§∑‡§æ ‡§Æ‡•á‡§Ç ‡§∏‡§∞‡•ç‡§µ‡§æ‡§ß‡§ø‡§ï ‡§Ö‡§Ç‡§ï ‡§¶‡§ø‡§≤‡§æ‡§®‡•á ‡§ï‡§æ ‡§∏‡§∞‡•ç‡§µ‡•ã‡§§‡•ç‡§§‡§Æ ‡§§‡§∞‡•Ä‡§ï‡§æ ‡§π‡•à‡•§",
          hint: "‡§∏‡§ï‡•ç‡§∞‡§ø‡§Ø ‡§™‡•Å‡§®‡§∞‡•Ä‡§ï‡•ç‡§∑‡§£ (active recall) ‡§î‡§∞ ‡§§‡•ç‡§∞‡•Å‡§ü‡§ø ‡§∏‡•Å‡§ß‡§æ‡§∞ ‡§™‡§∞ ‡§ß‡•ç‡§Ø‡§æ‡§® ‡§ï‡•á‡§Ç‡§¶‡•ç‡§∞‡§ø‡§§ ‡§ï‡§∞‡•á‡§Ç‡•§",
          difficulty: targetDifficulty
        },
        {
          question: `Hans Compain ‡§°‡§ø‡§ú‡§ø‡§ü‡§≤ ‡§ó‡§æ‡§á‡§°: ‡§¨‡§π‡•Å‡§µ‡§ø‡§ï‡§≤‡•ç‡§™‡•Ä‡§Ø (MCQ) ‡§™‡•ç‡§∞‡§∂‡•ç‡§®‡•ã‡§Ç ‡§Æ‡•á‡§Ç 100% ‡§∏‡§ü‡•Ä‡§ï‡§§‡§æ ‡§™‡•ç‡§∞‡§æ‡§™‡•ç‡§§ ‡§ï‡§∞‡§®‡•á ‡§ï‡§æ ‡§Æ‡•Å‡§ñ‡•ç‡§Ø ‡§§‡§∞‡•Ä‡§ï‡§æ ‡§ï‡•ç‡§Ø‡§æ ‡§π‡•à?`,
          options: [
            "‡§ï‡•á‡§µ‡§≤ ‡§§‡•Å‡§ï‡•ç‡§ï‡§æ ‡§≤‡§ó‡§æ‡§®‡§æ ‡§î‡§∞ ‡§ú‡§≤‡•ç‡§¶‡•Ä ‡§Æ‡•á‡§Ç ‡§ü‡§ø‡§ï ‡§ï‡§∞‡§®‡§æ",
            "‡§™‡•ç‡§∞‡§∂‡•ç‡§® ‡§ï‡•ã ‡§ß‡•ç‡§Ø‡§æ‡§® ‡§∏‡•á ‡§™‡§¢‡§º‡§®‡§æ, ‡§≠‡•ç‡§∞‡§æ‡§Æ‡§ï ‡§µ‡§ø‡§ï‡§≤‡•ç‡§™‡•ã‡§Ç ‡§ï‡•ã ‡§π‡§ü‡§æ‡§®‡§æ ‡§î‡§∞ ‡§Æ‡•Ç‡§≤ ‡§Ö‡§µ‡§ß‡§æ‡§∞‡§£‡§æ ‡§™‡§∞ ‡§ß‡•ç‡§Ø‡§æ‡§® ‡§¶‡•á‡§®‡§æ",
            "‡§Æ‡§π‡•Ä‡§®‡•á ‡§Æ‡•á‡§Ç ‡§ï‡•á‡§µ‡§≤ ‡§è‡§ï ‡§¨‡§æ‡§∞ ‡§Ö‡§≠‡•ç‡§Ø‡§æ‡§∏ ‡§ï‡§∞‡§®‡§æ",
            "‡§™‡•ç‡§∞‡§∂‡•ç‡§®‡•ã‡§Ç ‡§ï‡•Ä ‡§∏‡§Æ‡•Ä‡§ï‡•ç‡§∑‡§æ ‡§ï‡§≠‡•Ä ‡§® ‡§ï‡§∞‡§®‡§æ"
          ],
          answerIndex: 1,
          explanation: "‡§∏‡§ü‡•Ä‡§ï ‡§ó‡§§‡§ø ‡§î‡§∞ ‡§µ‡§ø‡§ï‡§≤‡•ç‡§™‡•ã‡§Ç ‡§ï‡•á ‡§∏‡§π‡•Ä ‡§µ‡§ø‡§≤‡•ã‡§™‡§® (elimination) ‡§∏‡•á ‡§™‡§∞‡•Ä‡§ï‡•ç‡§∑‡§æ ‡§Æ‡•á‡§Ç ‡§∏‡§¨‡§∏‡•á ‡§Ö‡§ß‡§ø‡§ï ‡§Ö‡§Ç‡§ï ‡§™‡•ç‡§∞‡§æ‡§™‡•ç‡§§ ‡§π‡•ã‡§§‡•á ‡§π‡•à‡§Ç‡•§",
          hint: "‡§ó‡§≤‡§§ ‡§µ‡§ø‡§ï‡§≤‡•ç‡§™‡•ã‡§Ç ‡§ï‡•ã ‡§è‡§ï-‡§è‡§ï ‡§ï‡§∞‡§ï‡•á ‡§ñ‡§æ‡§∞‡§ø‡§ú (eliminate) ‡§ï‡§∞‡§®‡•á ‡§ï‡§æ ‡§™‡•ç‡§∞‡§Ø‡§æ‡§∏ ‡§ï‡§∞‡•á‡§Ç‡•§",
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
      setQuizError(activeLang === 'hindi' ? "‡§ë‡§´‡§≤‡§æ‡§á‡§® ‡§Æ‡•â‡§ï ‡§™‡•ç‡§∞‡§∂‡•ç‡§® ‡§≤‡•ã‡§° ‡§ï‡§ø‡§è ‡§ó‡§è ‡§π‡•à‡§Ç! üìö" : "Offline mock database loaded! Active syllabus review test ready. üìö");
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
        showToast("‡§Ø‡§π ‡§™‡•ç‡§∞‡§∂‡•ç‡§® ‡§™‡§π‡§≤‡•á ‡§∏‡•á ‡§π‡•Ä ‡§ó‡§≤‡§§‡•Ä ‡§∞‡§ú‡§ø‡§∏‡•ç‡§ü‡§∞ ‡§Æ‡•á‡§Ç ‡§Æ‡•å‡§ú‡•Ç‡§¶ ‡§π‡•à! üìì", "info");
        return prev;
      }
      const updated = [newItem, ...prev];
      localStorage.setItem('hansai-mistake-notebook', JSON.stringify(updated));
      showToast("‡§ó‡§≤‡§§‡•Ä ‡§∞‡§ú‡§ø‡§∏‡•ç‡§ü‡§∞ (Mistake Notebook) ‡§Æ‡•á‡§Ç ‡§∏‡•Å‡§∞‡§ï‡•ç‡§∑‡§ø‡§§! üìì", "success");
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
    if (confirm("‡§ï‡•ç‡§Ø‡§æ ‡§Ü‡§™ ‡§∏‡§≠‡•Ä ‡§ó‡§≤‡§§ ‡§™‡•ç‡§∞‡§∂‡•ç‡§® ‡§∞‡§ú‡§ø‡§∏‡•ç‡§ü‡§∞ ‡§∏‡•á ‡§π‡§ü‡§æ‡§®‡§æ ‡§ö‡§æ‡§π‡§§‡•á ‡§π‡•à‡§Ç? (Clear all mistake records?)")) {
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
    showToast(`üéØ Launching ${questions.length} Mistakes Targeted Retest!`, "success");
  };

  // 1-Click Level Up: Switch to Harder/Extreme Question on same chapter
  const handleLevelUpQuiz = (levelToSet?: 'moderate' | 'hard' | 'extreme') => {
    const nextDiff = levelToSet || (quizDifficulty === 'standard' ? 'hard' : quizDifficulty === 'moderate' ? 'hard' : 'extreme');
    setQuizDifficulty(nextDiff);
    handleGenerateQuiz(quizSubject, nextDiff, quizQuestionCount);
    showToast(`‚ö° Level Up Activated: Generating ${nextDiff.toUpperCase()} Level Questions for ${quizSubject || 'current chapter'}!`, "success");
  };

  // Retry current question with hint unlocked
  const handleRetryCurrentQuestion = () => {
    setIsQuizSubmitted(false);
    setShowQuestionHint(true);
    setIsRetryingQuestion(true);
    setSelectedOptionIdx(null);
    showToast("üí° ‡§∏‡§Ç‡§ï‡•á‡§§ ‡§Ö‡§®‡§≤‡•â‡§ï ‡§π‡•Å‡§Ü! ‡§™‡•Å‡§®‡§É ‡§™‡•ç‡§∞‡§Ø‡§æ‡§∏ ‡§ï‡§∞‡•á‡§Ç (Hint Unlocked - Select your answer again!)", "info");
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
      setQuizAutoSaveNotice(`Auto-Saved to Records at ${autoSavedRecord.timestamp} ‚úÖ`);
      showToast("Quize Auto-Saved in Records! ‚úÖ (‡§ï‡•ç‡§µ‡§ø‡§ú‡§º ‡§∏‡•ç‡§µ‡§§‡§É ‡§∏‡•Å‡§∞‡§ï‡•ç‡§∑‡§ø‡§§ ‡§π‡•ã ‡§ó‡§Ø‡§æ)", "success");
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
    showToast("Quiz record re-saved and confirmed in Repository! üíæ‚úÖ", "success");
  };

  const handleToggleSyllabusTracker = (id: string, field: 'done' | 'notes' | 'quiz') => {
    const updated = syllabusTrackers.map(track => {
      if (track.id === id) {
        const nextVal = !track[field];
        if (nextVal) {
          showToast(`Progress logged: ${field === 'done' ? 'Revision done' : field === 'notes' ? 'Notes ready' : 'Practice quiz cleared'}! ‚úÖ`, "success");
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
    showToast("New syllabus practice task added successfully! üìù", "success");
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
      { id: "general", name: "General Studies & GK / ‡§∏‡§æ‡§Æ‡§æ‡§®‡•ç‡§Ø ‡§ú‡•ç‡§û‡§æ‡§®", emoji: "üìö", color: "indigo" },
      { id: "ssc-gk", name: "SSC General Knowledge (GK) / ‡§∏‡§æ‡§Æ‡§æ‡§®‡•ç‡§Ø ‡§ú‡•ç‡§û‡§æ‡§®", emoji: "üèõÔ∏è", color: "pink" },
      { id: "ssc-math", name: "SSC Quantitative Aptitude / ‡§ó‡§£‡§ø‡§§", emoji: "üìê", color: "purple" },
      { id: "ssc-reasoning", name: "SSC Logical Reasoning / ‡§§‡§∞‡•ç‡§ï‡§∂‡§ï‡•ç‡§§‡§ø", emoji: "üß†", color: "amber" },
      { id: "bpsc", name: "BPSC Exam Prep / ‡§¨‡•Ä‡§™‡•Ä‡§è‡§∏‡§∏‡•Ä", emoji: "üö©", color: "rose" },
      { id: "upsc", name: "UPSC Services / ‡§Ø‡•Ç‡§™‡•Ä‡§è‡§∏‡§∏‡•Ä", emoji: "ü¶Å", color: "amber" }
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
        content: "‚Ä¢ Quit India Movement was launched in August 1942 under Mahatma Gandhi's leadership.\n‚Ä¢ Indian physical Geography and river origins (Ganga, Sone) are recurrent SSC subjects.\n‚Ä¢ Practice daily mocks for core Polity and fundamental constitution articles.",
        tags: ["SSC", "History", "GK"],
        createdAt: new Date().toISOString()
      },
      {
        id: "note-2",
        folderId: "bpsc",
        title: "BPSC Geography: Topography of Western Vindhyan Range",
        content: "‚Ä¢ The plateau is part of the Vindhyan range representing western topography.\n‚Ä¢ It is rich in limestone and bauxite deposits.\n‚Ä¢ Ganga and Sone river networks play a vital role in local agricultural patterns.",
        tags: ["BPSC", "Geography", "GK"],
        createdAt: new Date().toISOString()
      },
      {
        id: "note-3",
        folderId: "upsc",
        title: "UPSC Indian Polity: Salient Features of Federal Structure",
        content: "‚Ä¢ The Indian Constitution establishes a dual polity consisting of the Union at the Center and the States.\n‚Ä¢ Cooperative federalism requires continuous dialogue through councils like the Inter-State Council and GST Council.\n‚Ä¢ Part XI governs administrative and legislative relations between the Union and the States.",
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
  const [newFolderEmojiInput, setNewFolderEmojiInput] = useState<string>("üìÅ");

  // Quick Save Floating Action & Modal State for Highlighted Chat Text
  const [isQuickSaveModalOpen, setIsQuickSaveModalOpen] = useState<boolean>(false);
  const [quickSaveSelectedText, setQuickSaveSelectedText] = useState<string>("");
  const [floatingSelectionPos, setFloatingSelectionPos] = useState<{ x: number; y: number } | null>(null);

  // Quick Save handler: create folder dynamically
  const handleQuickCreateFolder = (folderName: string, folderEmoji: string = 'üìÅ'): string => {
    const cleanName = folderName.trim();
    if (!cleanName) return 'general';
    const newId = `folder-${Date.now()}`;
    const newFolder = {
      id: newId,
      name: cleanName,
      emoji: folderEmoji || 'üìÅ',
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
      title: noteData.title || (language === 'hindi' ? '‡§Ö‡§ß‡•ç‡§Ø‡§Ø‡§® ‡§®‡•ã‡§ü‡•ç‡§∏' : 'Study Note'),
      content: noteData.content,
      tags: noteData.tags && noteData.tags.length > 0 ? noteData.tags : ['QuickSave', 'GK'],
      createdAt: new Date().toISOString()
    };
    setNotes(prev => [newNote, ...prev]);
    showToast(language === 'hindi' ? '‚ú® ‡§®‡•ã‡§ü‡•ç‡§∏ ‡§∏‡•ç‡§Æ‡§æ‡§∞‡•ç‡§ü ‡§´‡§º‡•ã‡§≤‡•ç‡§°‡§∞ ‡§Æ‡•á‡§Ç ‡§∏‡•Å‡§∞‡§ï‡•ç‡§∑‡§ø‡§§ ‡§∏‡•á‡§µ ‡§π‡•ã ‡§ó‡§Ø‡§æ!' : '‚ú® Saved to Notes folder successfully!', 'success');
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
        const chars = ['‚ú®', 'üèÜ', '‚≠ê', 'üéà', 'üéâ', 'ü¶¢', 'üåü', 'üí´', 'üî•'];
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
    showToast(language === 'hindi' ? 'üéôÔ∏è ‡§¨‡•ã‡§≤‡§ø‡§è... ‡§µ‡§ø‡§∑‡§Ø ‡§Ø‡§æ ‡§∏‡•ç‡§•‡§æ‡§® ‡§ï‡§æ ‡§®‡§æ‡§Æ' : 'üéôÔ∏è Speak map topic or location...', 'info');

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
    showToast(language === 'hindi' ? 'üéôÔ∏è ‡§¨‡•ã‡§≤‡§ø‡§è... ‡§Ö‡§™‡§®‡§æ ‡§∏‡§∞‡•ç‡§ö ‡§ü‡•â‡§™‡§ø‡§ï' : 'üéôÔ∏è Speak your search query...', 'info');

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
      name: "Himalayan Mountain Belt & High Altitude Passes (‡§π‡§ø‡§Æ‡§æ‡§≤‡§Ø ‡§™‡§∞‡•ç‡§µ‡§§‡§Æ‡§æ‡§≤‡§æ ‡§µ ‡§™‡•ç‡§∞‡§Æ‡•Å‡§ñ ‡§¶‡§∞‡•ç‡§∞‡•á)",
      x: 48, y: 18,
      icon: "üèîÔ∏è",
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
        "Which pass connects Srinagar to Leh? ‚Üí Zoji La Pass",
        "Highest peak located inside undisputed Indian territory? ‚Üí Kangchenjunga / K2",
        "Origin region of the Great River Indus? ‚Üí Mansarovar Lake near Mt. Kailash"
      ]
    },
    {
      id: "ganga-basin",
      name: "Indo-Gangetic Fertile Plain (‡§∏‡§ø‡§Ç‡§ß‡•Å-‡§ó‡§Ç‡§ó‡§æ ‡§ï‡§æ ‡§Æ‡•à‡§¶‡§æ‡§®‡•Ä ‡§≠‡§æ‡§ó)",
      x: 52, y: 38,
      icon: "üåæ",
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
        "New alluvial soil deposited by annual floods is called? ‚Üí Khadar Soil",
        "Where does Ganga enter the Northern Plains? ‚Üí Haridwar, Uttarakhand",
        "The confluence of Alaknanda and Bhagirathi is known as? ‚Üí Devprayag"
      ]
    },
    {
      id: "thar-desert",
      name: "Thar Desert & Aravalli Mountain System (‡§•‡§æ‡§∞ ‡§Æ‡§∞‡•Å‡§∏‡•ç‡§•‡§≤ ‡§µ ‡§Ö‡§∞‡§æ‡§µ‡§≤‡•Ä)",
      x: 28, y: 40,
      icon: "üèúÔ∏è",
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
        "Which is the oldest fold mountain range in India? ‚Üí Aravalli Range",
        "Only major inland draining river in Rajasthan? ‚Üí Luni River",
        "Highest peak of the Aravalli range? ‚Üí Guru Shikhar (Mount Abu)"
      ]
    },
    {
      id: "deccan-plateau",
      name: "Deccan Trap & Peninsular Plateau (‡§¶‡§ï‡•ç‡§ï‡§® ‡§ï‡§æ ‡§™‡§†‡§æ‡§∞)",
      x: 45, y: 65,
      icon: "üåã",
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
        "Which soil is also known as Regur Soil? ‚Üí Black Cotton Soil",
        "Which major peninsular rivers flow into rift valleys? ‚Üí Narmada & Tapti",
        "Longest peninsular river in India? ‚Üí Godavari River"
      ]
    },
    {
      id: "western-ghats",
      name: "Western Ghats / Sahyadri Range (‡§™‡§∂‡•ç‡§ö‡§ø‡§Æ‡•Ä ‡§ò‡§æ‡§ü / ‡§∏‡§π‡•ç‡§Ø‡§æ‡§¶‡•ç‡§∞‡§ø)",
      x: 32, y: 72,
      icon: "üåø",
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
        "Highest peak in South India? ‚Üí Anamudi (2,695 m)",
        "Which gap connects Palakkad (Kerala) to Coimbatore (Tamil Nadu)? ‚Üí Palghat Gap",
        "The rainfall caused by Western Ghats is? ‚Üí Orographic Precipitation"
      ]
    },
    {
      id: "indus-valley",
      name: "Indus Valley Civilisation Sites (‡§∏‡§ø‡§Ç‡§ß‡•Å ‡§ò‡§æ‡§ü‡•Ä ‡§∏‡§≠‡•ç‡§Ø‡§§‡§æ - ‡§π‡§°‡§º‡§™‡•ç‡§™‡§æ ‡§µ ‡§≤‡•ã‡§•‡§≤)",
      x: 22, y: 32,
      icon: "üè∫",
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
        "Where was the ancient Indus Valley dockyard located? ‚Üí Lothal, Gujarat",
        "Which metal was completely unknown to Indus Valley citizens? ‚Üí Iron",
        "Indus site with unique 3-part city fortification? ‚Üí Dholavira"
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
      question: "‡§∂‡•â‡§∞‡•ç‡§ü‡§π‡•à‡§Ç‡§° (Shorthand) ‡§°‡§ø‡§ï‡•ç‡§ü‡•á‡§∂‡§® ‡§≤‡§ø‡§ñ‡§§‡•á ‡§∏‡§Æ‡§Ø 'Grammalogues' ‡§ï‡§æ ‡§Æ‡•Å‡§ñ‡•ç‡§Ø ‡§ï‡§æ‡§∞‡•ç‡§Ø ‡§ï‡•ç‡§Ø‡§æ ‡§π‡•ã‡§§‡§æ ‡§π‡•à?",
      options: [
        "‡§ï‡§†‡§ø‡§® ‡§µ‡•à‡§ú‡•ç‡§û‡§æ‡§®‡§ø‡§ï ‡§∂‡§¨‡•ç‡§¶‡•ã‡§Ç ‡§ï‡§æ ‡§â‡§ö‡•ç‡§ö‡§æ‡§∞‡§£ ‡§Ü‡§∏‡§æ‡§® ‡§ï‡§∞‡§®‡§æ",
        "‡§Ö‡§ï‡•ç‡§∏‡§∞ ‡§â‡§™‡§Ø‡•ã‡§ó ‡§π‡•ã‡§®‡•á ‡§µ‡§æ‡§≤‡•á ‡§∂‡§¨‡•ç‡§¶‡•ã‡§Ç ‡§ï‡•ã ‡§è‡§ï ‡§õ‡•ã‡§ü‡•á ‡§∏‡§Ç‡§ï‡•á‡§§ (Single Sign) ‡§∏‡•á ‡§¶‡§∞‡•ç‡§∂‡§æ‡§®‡§æ",
        "‡§∏‡§≠‡•Ä ‡§ó‡§£‡§ø‡§§‡•Ä‡§Ø ‡§∏‡•Ç‡§§‡•ç‡§∞‡•ã‡§Ç ‡§ï‡•ã ‡§∏‡§Ç‡§ï‡•ç‡§∑‡•á‡§™ ‡§Æ‡•á‡§Ç ‡§≤‡§ø‡§ñ‡§®‡§æ",
        "‡§µ‡§æ‡§ï‡•ç‡§Ø‡•ã‡§Ç ‡§Æ‡•á‡§Ç ‡§µ‡•ç‡§Ø‡§æ‡§ï‡§∞‡§£ ‡§ï‡•Ä ‡§Ö‡§∂‡•Å‡§¶‡•ç‡§ß‡§ø‡§Ø‡•ã‡§Ç ‡§ï‡•ã ‡§∏‡•ç‡§µ‡§ö‡§æ‡§≤‡§ø‡§§ ‡§∞‡•Ç‡§™ ‡§∏‡•á ‡§∏‡•Å‡§ß‡§æ‡§∞‡§®‡§æ"
      ],
      answerIndex: 1,
      explanation: "‡§™‡§ø‡§ü‡§Æ‡•à‡§® ‡§∂‡•â‡§∞‡•ç‡§ü‡§π‡•à‡§Ç‡§° ‡§Æ‡•á‡§Ç 'Grammalogues' ‡§µ‡•á ‡§∂‡§¨‡•ç‡§¶ ‡§π‡•ã‡§§‡•á ‡§π‡•à‡§Ç ‡§ú‡•ã ‡§¨‡§æ‡§∞-‡§¨‡§æ‡§∞ ‡§Ü‡§§‡•á ‡§π‡•à‡§Ç (‡§ú‡•à‡§∏‡•á the, of, limit, care) ‡§î‡§∞ ‡§â‡§®‡•ç‡§π‡•á‡§Ç ‡§ï‡•á‡§µ‡§≤ ‡§è‡§ï ‡§π‡•Ä ‡§∏‡•ç‡§ü‡•ç‡§∞‡•ã‡§ï ‡§Ø‡§æ ‡§°‡•â‡§ü ‡§¶‡•ç‡§µ‡§æ‡§∞‡§æ ‡§∂‡•Ä‡§ò‡•ç‡§∞‡§§‡§æ ‡§∏‡•á ‡§¶‡§∞‡•ç‡§∂‡§æ‡§Ø‡§æ ‡§ú‡§æ‡§§‡§æ ‡§π‡•à‡•§ ‡§ó‡§§‡§ø ‡§¨‡§¢‡§º‡§æ‡§®‡•á ‡§ï‡•á ‡§≤‡§ø‡§è ‡§á‡§®‡§ï‡§æ ‡§Ö‡§≠‡•ç‡§Ø‡§æ‡§∏ ‡§™‡§∞‡§Æ ‡§Ü‡§µ‡§∂‡•ç‡§Ø‡§ï ‡§π‡•à‡•§"
    },
    {
      question: "‡§≠‡§æ‡§∞‡§§‡•Ä‡§Ø ‡§∏‡§Ç‡§µ‡§ø‡§ß‡§æ‡§® ‡§ï‡•á ‡§ï‡§ø‡§∏ ‡§≠‡§æ‡§ó ‡§è‡§µ‡§Ç ‡§Ö‡§®‡•Å‡§ö‡•ç‡§õ‡•á‡§¶ ‡§ï‡•á ‡§Ö‡§Ç‡§§‡§∞‡•ç‡§ó‡§§ '‡§∏‡§Æ‡§æ‡§® ‡§®‡§æ‡§ó‡§∞‡§ø‡§ï ‡§∏‡§Ç‡§π‡§ø‡§§‡§æ' (Uniform Civil Code) ‡§ï‡§æ ‡§µ‡§∞‡•ç‡§£‡§® ‡§π‡•à?",
      options: [
        "‡§≠‡§æ‡§ó III, ‡§Ö‡§®‡•Å‡§ö‡•ç‡§õ‡•á‡§¶ 32",
        "‡§≠‡§æ‡§ó IV, ‡§Ö‡§®‡•Å‡§ö‡•ç‡§õ‡•á‡§¶ 44",
        "‡§≠‡§æ‡§ó IV-A, ‡§Ö‡§®‡•Å‡§ö‡•ç‡§õ‡•á‡§¶ 51A",
        "‡§≠‡§æ‡§ó V, ‡§Ö‡§®‡•Å‡§ö‡•ç‡§õ‡•á‡§¶ 72"
      ],
      answerIndex: 1,
      explanation: "‡§∏‡§Æ‡§æ‡§® ‡§®‡§æ‡§ó‡§∞‡§ø‡§ï ‡§∏‡§Ç‡§π‡§ø‡§§‡§æ (UCC) ‡§ï‡§æ ‡§™‡•ç‡§∞‡§æ‡§µ‡§ß‡§æ‡§® ‡§≠‡§æ‡§∞‡§§‡•Ä‡§Ø ‡§∏‡§Ç‡§µ‡§ø‡§ß‡§æ‡§® ‡§ï‡•á ‡§≠‡§æ‡§ó IV (‡§∞‡§æ‡§ú‡•ç‡§Ø ‡§ï‡•á ‡§®‡•Ä‡§§‡§ø ‡§®‡§ø‡§¶‡•á‡§∂‡§ï ‡§§‡§§‡•ç‡§µ) ‡§ï‡•á ‡§Ö‡§®‡•Å‡§ö‡•ç‡§õ‡•á‡§¶ 44 ‡§ï‡•á ‡§Ö‡§Ç‡§§‡§∞‡•ç‡§ó‡§§ ‡§ï‡§ø‡§Ø‡§æ ‡§ó‡§Ø‡§æ ‡§π‡•à‡•§"
    },
    {
      question: "‡§á‡§®‡§Æ‡•á‡§Ç ‡§∏‡•á ‡§ï‡•å‡§® ‡§∏‡§æ ‡§µ‡§ø‡§ï‡§≤‡•ç‡§™ ‡§¨‡•ç‡§∞‡§ø‡§ü‡§ø‡§∂ ‡§ï‡§æ‡§≤ ‡§Æ‡•á‡§Ç ‡§≠‡§æ‡§∞‡§§ ‡§Æ‡•á‡§Ç ‡§≤‡§°‡§º‡•á ‡§ó‡§è '‡§¨‡§ï‡•ç‡§∏‡§∞ ‡§ï‡•á ‡§Ø‡•Å‡§¶‡•ç‡§ß' (Battle of Buxar) ‡§ï‡§æ ‡§∏‡§π‡•Ä ‡§µ‡§∞‡•ç‡§∑ ‡§¶‡§∞‡•ç‡§∂‡§æ‡§§‡§æ ‡§π‡•à?",
      options: [
        "1757 ‡§à‡§∏‡•ç‡§µ‡•Ä",
        "1764 ‡§à‡§∏‡•ç‡§µ‡•Ä",
        "1772 ‡§à‡§∏‡•ç‡§µ‡•Ä",
        "1789 ‡§à‡§∏‡•ç‡§µ‡•Ä"
      ],
      answerIndex: 1,
      explanation: "‡§¨‡§ï‡•ç‡§∏‡§∞ ‡§ï‡§æ ‡§ê‡§§‡§ø‡§π‡§æ‡§∏‡§ø‡§ï ‡§Ø‡•Å‡§¶‡•ç‡§ß 22 ‡§Ö‡§ï‡•ç‡§ü‡•Ç‡§¨‡§∞ 1764 ‡§ï‡•ã ‡§¨‡•ç‡§∞‡§ø‡§ü‡§ø‡§∂ ‡§à‡§∏‡•ç‡§ü ‡§á‡§Ç‡§°‡§ø‡§Ø‡§æ ‡§ï‡§Ç‡§™‡§®‡•Ä ‡§î‡§∞ ‡§¨‡§Ç‡§ó‡§æ‡§≤ ‡§ï‡•á ‡§®‡§µ‡§æ‡§¨ ‡§Æ‡•Ä‡§∞ ‡§ï‡§æ‡§∏‡§ø‡§Æ, ‡§Ö‡§µ‡§ß ‡§ï‡•á ‡§®‡§µ‡§æ‡§¨ ‡§∂‡•Å‡§ú‡§æ‡§â‡§¶‡•ç‡§¶‡•å‡§≤‡§æ, ‡§§‡§•‡§æ ‡§Æ‡•Å‡§ó‡§≤ ‡§∂‡§æ‡§∏‡§ï ‡§∂‡§æ‡§π ‡§Ü‡§≤‡§Æ ‡§¶‡•ç‡§µ‡§ø‡§§‡•Ä‡§Ø ‡§ï‡•á ‡§∏‡§Ç‡§Ø‡•Å‡§ï‡•ç‡§§ ‡§ó‡§†‡§¨‡§Ç‡§ß‡§® ‡§ï‡•á ‡§¨‡•Ä‡§ö ‡§≤‡§°‡§º‡§æ ‡§ó‡§Ø‡§æ ‡§•‡§æ‡•§"
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
      question: "‡§ï‡§Ç‡§™‡•ç‡§Ø‡•Ç‡§ü‡§∞ ‡§ï‡•Ä ‡§Æ‡•Å‡§ñ‡•ç‡§Ø ‡§Æ‡•á‡§Æ‡•ã‡§∞‡•Ä (RAM) ‡§î‡§∞ ‡§™‡•ç‡§∞‡•ã‡§∏‡•á‡§∏‡§∞ ‡§ï‡•á ‡§¨‡•Ä‡§ö ‡§â‡§ö‡•ç‡§ö-‡§ó‡§§‡§ø ‡§µ‡§æ‡§≤‡•Ä ‡§Ö‡§∏‡•ç‡§•‡§æ‡§Ø‡•Ä ‡§∏‡•ç‡§ü‡•ã‡§∞‡•á‡§ú ‡§ï‡•ã ‡§ï‡•ç‡§Ø‡§æ ‡§ï‡§π‡§æ ‡§ú‡§æ‡§§‡§æ ‡§π‡•à?",
      options: [
        "Virtual Memory",
        "Cache Memory",
        "Flash Drive",
        "Secondary ROM"
      ],
      answerIndex: 1,
      explanation: "‡§ï‡•à‡§∂ ‡§Æ‡•á‡§Æ‡•ã‡§∞‡•Ä (Cache Memory) ‡§è‡§ï ‡§Ö‡§§‡•ç‡§Ø‡§Ç‡§§ ‡§§‡•Ä‡§µ‡•ç‡§∞ ‡§ó‡§§‡§ø ‡§∏‡•á ‡§ï‡§æ‡§∞‡•ç‡§Ø ‡§ï‡§∞‡§®‡•á ‡§µ‡§æ‡§≤‡•Ä ‡§Æ‡•á‡§Æ‡•ã‡§∞‡•Ä ‡§π‡•à ‡§ú‡§ø‡§∏‡§ï‡§æ ‡§â‡§™‡§Ø‡•ã‡§ó ‡§™‡•ç‡§∞‡•ã‡§∏‡•á‡§∏‡§∞ ‡§¶‡•ç‡§µ‡§æ‡§∞‡§æ ‡§¨‡§æ‡§∞-‡§¨‡§æ‡§∞ ‡§â‡§™‡§Ø‡•ã‡§ó ‡§ï‡§ø‡§è ‡§ú‡§æ‡§®‡•á ‡§µ‡§æ‡§≤‡•á ‡§®‡§ø‡§∞‡•ç‡§¶‡•á‡§∂‡•ã‡§Ç ‡§ï‡•ã ‡§Ö‡§∏‡•ç‡§•‡§æ‡§Ø‡•Ä ‡§§‡•å‡§∞ ‡§™‡§∞ ‡§∏‡§Ç‡§ö‡§ø‡§§ ‡§ï‡§∞‡§®‡•á ‡§ï‡•á ‡§≤‡§ø‡§è ‡§ï‡§ø‡§Ø‡§æ ‡§ú‡§æ‡§§‡§æ ‡§π‡•à‡•§"
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
      showToast("‡§ï‡•É‡§™‡§Ø‡§æ ‡§Ö‡§™‡§®‡§æ ‡§Ö‡§∏‡§≤‡•Ä ‡§®‡§æ‡§Æ ‡§¶‡§∞‡•ç‡§ú‡§º ‡§ï‡§∞‡•á‡§Ç‡•§", "warn");
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
    showToast("‡§Æ‡•â‡§ï ‡§ü‡•á‡§∏‡•ç‡§ü ‡§∏‡•ç‡§ï‡•ã‡§∞ ‡§∏‡§´‡§≤‡§§‡§æ‡§™‡•Ç‡§∞‡•ç‡§µ‡§ï ‡§∏‡§π‡•á‡§ú‡§æ ‡§ó‡§Ø‡§æ ‡§î‡§∞ ‡§∞‡•à‡§Ç‡§ï ‡§ï‡•Ä ‡§ó‡§£‡§®‡§æ ‡§ï‡•Ä ‡§ó‡§à!", "success");
    setRegScoreName("");
    setRegScoreLoc("");
    setShowRegModal(false);
  };

  // Missing Study Progress Steps states
  const [studyProcessSteps] = useState([
    { id: 'step-1', title: "Daily Target & Revision Goals Setup", duration: "5 mins", desc: "‡§∏‡•á‡§ü ‡§ï‡§∞‡•á‡§Ç ‡§ï‡§ø ‡§Ü‡§ú ‡§Ü‡§™‡§ï‡•ã ‡§ï‡•ç‡§Ø‡§æ ‡§ï‡•ç‡§Ø‡§æ ‡§ï‡§°‡§º‡§ï ‡§§‡•à‡§Ø‡§æ‡§∞ ‡§ï‡§∞‡§®‡§æ ‡§π‡•à‡•§" },
    { id: 'step-2', title: "Concept Visualizer / Mind Map Core", duration: "15 mins", desc: "‡§µ‡§ø‡§∑‡§Ø ‡§ï‡•á ‡§Æ‡•Ç‡§≤ ‡§∏‡§Ç‡§∞‡§ö‡§®‡§æ ‡§µ ‡§®‡§¶‡•Ä ‡§™‡•ç‡§∞‡§£‡§æ‡§≤‡§ø‡§Ø‡•ã‡§Ç ‡§ï‡•ã ‡§ö‡§ø‡§§‡•ç‡§∞‡§∞‡•Ç‡§™ ‡§Æ‡•á‡§Ç ‡§∏‡§Æ‡§ù‡•á‡§Ç‡•§" },
    { id: 'step-3', title: "Syllabus Micro-Research (Gemini)", duration: "25 mins", desc: "‡§µ‡§ø‡§∏‡•ç‡§§‡•É‡§§ ‡§§‡§•‡•ç‡§Ø‡§æ‡§§‡•ç‡§Æ‡§ï ‡§®‡•ã‡§ü‡•ç‡§∏ ‡§î‡§∞ ‡§∂‡§æ‡§∞‡•ç‡§ü ‡§ü‡•ç‡§∞‡§ø‡§ï‡•ç‡§∏ ‡§ú‡§®‡§∞‡•á‡§ü ‡§ï‡§∞‡•á‡§Ç‡•§" },
    { id: 'step-4', title: "Micro-Quiz Mock Challenge", duration: "15 mins", desc: "‡§∏‡•ç‡§µ‡§Ø‡§Ç ‡§ï‡§æ ‡§™‡§∞‡•Ä‡§ï‡•ç‡§∑‡§£ ‡§ï‡§∞‡•á‡§Ç, ‡§ó‡§≤‡§§‡§ø‡§Ø‡•ã‡§Ç ‡§ï‡§æ ‡§∏‡•ç‡§™‡§∑‡•ç‡§ü‡•Ä‡§ï‡§∞‡§£ ‡§™‡§¢‡§º‡•á‡§Ç‡•§" },
    { id: 'step-5', title: "Soul-Breath & Posture Comfort Reset", duration: "5 mins", desc: "‡§Ü‡§Ç‡§ñ‡•ã‡§Ç ‡§ï‡•ã ‡§Ü‡§∞‡§æ‡§Æ ‡§¶‡•á‡§Ç ‡§î‡§∞ ‡§∏‡•Ä‡§ß‡•Ä ‡§∞‡•Ä‡§¢‡§º ‡§∞‡§ñ‡§ï‡§∞ ‡§∏‡§æ‡§Ç‡§∏ ‡§≤‡•á‡§Ç‡•§" },
    { id: 'step-6', title: "Self-Study Practice Session Run", duration: "45 mins", desc: "‡§∏‡•ç‡§Æ‡§æ‡§∞‡•ç‡§ü ‡§ü‡§æ‡§á‡§Æ‡§∞ ‡§≤‡§ó‡§æ‡§ï‡§∞ ‡§ï‡§°‡§º‡§ï ‡§Ö‡§≠‡•ç‡§Ø‡§æ‡§∏ ‡§ï‡§∞‡•á‡§Ç‡•§" }
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
        lyrics: '‡§∂‡§æ‡§Ç‡§§ ‡§¶‡§ø‡§Æ‡§æ‡§ó, ‡§ó‡§π‡§∞‡•Ä ‡§∏‡§æ‡§Ç‡§∏ ‡§î‡§∞ ‡§Ö‡§ü‡•Ç‡§ü ‡§ß‡•ç‡§Ø‡§æ‡§®‡•§ ‡§Æ‡§® ‡§ï‡•ã ‡§ï‡•á‡§Ç‡§¶‡•ç‡§∞‡§ø‡§§ ‡§ï‡§∞ ‡§™‡•ù‡§æ‡§à ‡§Æ‡•á‡§Ç ‡§°‡•Ç‡§¨ ‡§ú‡§æ‡§è‡§Ç‡•§',
        createdAt: new Date().toISOString()
      },
      {
        id: 'track_03',
        title: 'Kaddak Victory Rap (‡§ú‡•Ä‡§§ ‡§ï‡§æ ‡§ú‡•ã‡§∂ - ‡§π‡§Ç‡§∏‡§≤‡§æ‡§≤ ‡§™‡§æ‡§≤ ‡§ú‡•Ä)',
        genre: 'Motivational Rap',
        tempo: 110,
        mood: 'High Energy & Grit',
        lyrics: '‡§™‡§æ‡§µ‡§® ‡§Æ‡§æ‡§ü‡•Ä ‡§∏‡•á ‡§â‡§†‡§ï‡§∞ ‡§Ö‡§¨ ‡§§‡•Å‡§Æ‡§ï‡•ã ‡§á‡§§‡§ø‡§π‡§æ‡§∏ ‡§¨‡§®‡§æ‡§®‡§æ ‡§π‡•à! ‡§Ü‡§≤‡§∏ ‡§ï‡•Ä ‡§ú‡§Ç‡§ú‡•Ä‡§∞‡•á‡§Ç ‡§§‡•ã‡•ú, ‡§ñ‡•Å‡§¶ ‡§ï‡•ã ‡§Ö‡§¨ ‡§Æ‡•á‡§π‡§®‡§§ ‡§Æ‡•á‡§Ç ‡§§‡§™‡§æ‡§®‡§æ ‡§π‡•à!',
        createdAt: new Date().toISOString()
      },
      {
        id: 'track_04',
        title: 'PMEGP MSME Entrepreneur Motivation Song',
        genre: 'Acoustic Guitar',
        tempo: 95,
        mood: 'Business Spirit',
        lyrics: '‡§ú‡§Æ‡•Ä‡§® ‡§∏‡•á ‡§ú‡•Å‡•ú‡§ï‡§∞ ‡§Ü‡§∏‡§Æ‡§æ‡§Ç ‡§ï‡•ã ‡§õ‡•Ç‡§®‡§æ ‡§π‡•à, ‡§è‡§Æ‡§è‡§∏‡§è‡§Æ‡§à ‡§ï‡•Ä ‡§Ø‡•ã‡§ú‡§®‡§æ ‡§§‡•à‡§Ø‡§æ‡§∞ ‡§ï‡§∞ ‡§â‡§¶‡•ç‡§Ø‡•ã‡§ó ‡§ï‡§æ ‡§∞‡§æ‡§ú‡§æ ‡§¨‡§®‡§®‡§æ ‡§π‡•à!',
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
    showToast(`üéµ Created & Playing AI Music Track: "${cleanTitle}"`, "success");

    logUserActivity('music', `Created AI Music Track: "${cleanTitle}" (${newMusicGenre}, ${newMusicTempo} BPM)`);
  };

  // Missing Rapping states
  const [activeRapId, setActiveRapId] = useState<string | null>(null);
  const [isPlayingRap, setIsPlayingRap] = useState<boolean>(false);
  const [visibleLyricsIdx, setVisibleLyricsIdx] = useState<number>(0);
  const [lyricsLines] = useState([
    "‡§Æ‡•á‡§π‡§®‡§§ ‡§ï‡•Ä ‡§Æ‡§æ‡§ü‡•Ä ‡§∏‡•á ‡§â‡§† ‡§ï‡§∞, ‡§≤‡§ï‡•ç‡§∑‡•ç‡§Ø ‡§¨‡§°‡§º‡§æ ‡§π‡§Æ ‡§†‡§æ‡§® ‡§ö‡•Å‡§ï‡•á,",
    "‡§ï‡§ø‡§§‡§æ‡§¨‡•ã‡§Ç ‡§ï‡•ã ‡§π‡•Ä ‡§Ö‡§™‡§®‡§æ ‡§∏‡§ö‡•ç‡§ö‡§æ, ‡§Ø‡§æ‡§∞-‡§¶‡•ã‡§∏‡•ç‡§§ ‡§π‡§Æ ‡§Æ‡§æ‡§® ‡§ö‡•Å‡§ï‡•á!",
    "‡§Ö‡§ü‡•Ç‡§ü ‡§π‡•å‡§∏‡§≤‡•á ‡§î‡§∞ ‡§¶‡•É‡§¢‡§º ‡§∏‡§Ç‡§ï‡§≤‡•ç‡§™ ‡§ó‡§µ‡§æ‡§π ‡§π‡•à‡§Ç, ‡§π‡§Æ‡§æ‡§∞‡•Ä ‡§á‡§∏ ‡§ï‡§°‡§º‡§ï ‡§ú‡§µ‡§æ‡§®‡•Ä ‡§ï‡§æ,",
    "‡§á‡§§‡§ø‡§π‡§æ‡§∏ ‡§µ‡§π‡•Ä ‡§≤‡§ø‡§ñ‡•á‡§Ç‡§ó‡•á ‡§ú‡§ó ‡§Æ‡•á‡§Ç, ‡§ú‡•ã ‡§∞‡§ñ‡§µ‡§æ‡§≤‡§æ ‡§π‡•à..."
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
          showToast(`Concept Map for "${cleanTopic}" generated! üó∫Ô∏è`, "success");
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
            showToast(`Concept Map for "${cleanTopic}" generated! üó∫Ô∏è`, "success");
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
    showToast(`Concept Map for "${cleanTopic}" ready! üó∫Ô∏è`, "info");
    setIsGeneratingConceptMap(false);
  };

  // Real Active Healthy Lifestyle checkoff tracker
  const [lifestyleTracker, setLifestyleTracker] = useState<{ id: string; title: string; hint: string; checked: boolean; rewardPoints: number }[]>(() => {
    const saved = localStorage.getItem('hansai-lifestyle');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 'sleep', title: '7 Hours Sound Eye-Recovery Sleep', hint: '‡§¶‡§ø‡§Æ‡§æ‡§ó ‡§î‡§∞ ‡§Ü‡§Ç‡§ñ‡•ã‡§Ç ‡§ï‡•Ä ‡§®‡§∏‡•ã‡§Ç ‡§ï‡•ã ‡§Ü‡§∞‡§æ‡§Æ ‡§¶‡•á‡§®‡§æ', checked: false, rewardPoints: 15 },
      { id: 'posture', title: 'Ergonomic Desk & Back Pose Check', hint: '‡§ï‡§Æ‡§∞ ‡§î‡§∞ ‡§ó‡§∞‡•ç‡§¶‡§® ‡§ï‡•ã ‡§∏‡•Ä‡§ß‡§æ ‡§∞‡§ñ‡§ï‡§∞ ‡§™‡§¢‡§º‡§æ‡§à ‡§ï‡§∞‡§®‡§æ', checked: false, rewardPoints: 10 },
      { id: 'water', title: 'Hydration Intake & Deep Breathing', hint: '‡§®‡§ø‡§Ø‡§Æ‡§ø‡§§ ‡§™‡§æ‡§®‡•Ä ‡§™‡•Ä‡§®‡§æ ‡§î‡§∞ ‡§§‡§æ‡§ú‡•Ä ‡§π‡§µ‡§æ ‡§Æ‡•á‡§Ç ‡§∏‡§æ‡§Ç‡§∏ ‡§≤‡•á‡§®‡§æ', checked: false, rewardPoints: 10 }
    ];
  });

  const [researchResult, setResearchResult] = useState<any>(null);

  const handleRunResearch = async (targetTopic = researchTopic, targetArea = researchArea) => {
    const cleanTopic = (targetTopic || researchTopic || "").trim();
    if (!cleanTopic) {
      showToast("‡§ï‡•É‡§™‡§Ø‡§æ ‡§ï‡•ã‡§à ‡§µ‡§ø‡§∑‡§Ø ‡§Ø‡§æ ‡§™‡•ç‡§∞‡§∂‡•ç‡§® ‡§¶‡§∞‡•ç‡§ú ‡§ï‡§∞‡•á‡§Ç‡•§", "warn");
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
        showToast(`Deep AI Research complete for "${cleanTopic}"! üéâ`, "success");
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
      setResearchError("‡§∞‡§ø‡§∏‡§∞‡•ç‡§ö ‡§ú‡§®‡§∞‡•á‡§ü ‡§ï‡§∞‡§®‡•á ‡§Æ‡•á‡§Ç ‡§Ü‡§Ç‡§∂‡§ø‡§ï ‡§∏‡§Æ‡§∏‡•ç‡§Ø‡§æ‡•§");
      setResearchResult({
        topicName: cleanTopic,
        subjectArea: targetArea || "General Academic Research",
        summary: `‡§µ‡§ø‡§∑‡§Ø: '${cleanTopic}'‡•§ ‡§á‡§∏ ‡§µ‡§ø‡§∑‡§Ø ‡§ï‡§æ ‡§ó‡§π‡§® ‡§µ‡§ø‡§∂‡•ç‡§≤‡•á‡§∑‡§£ ‡§™‡•ç‡§∞‡§§‡§ø‡§Ø‡•ã‡§ó‡•Ä ‡§™‡§∞‡•Ä‡§ï‡•ç‡§∑‡§æ‡§ì‡§Ç ‡§è‡§µ‡§Ç ‡§Ö‡§ï‡§æ‡§¶‡§Æ‡§ø‡§ï ‡§¶‡•É‡§∑‡•ç‡§ü‡§ø‡§ï‡•ã‡§£ ‡§¶‡•ã‡§®‡•ã‡§Ç ‡§ï‡•á ‡§≤‡§ø‡§è ‡§Ö‡§§‡•ç‡§Ø‡§Ç‡§§ ‡§Æ‡§π‡§§‡•ç‡§µ‡§™‡•Ç‡§∞‡•ç‡§£ ‡§π‡•à‡•§ ‡§®‡§ø‡§Æ‡•ç‡§®‡§≤‡§ø‡§ñ‡§ø‡§§ ‡§¨‡§ø‡§Ç‡§¶‡•Å ‡§á‡§∏‡§ï‡•á ‡§™‡•ç‡§∞‡§æ‡§•‡§Æ‡§ø‡§ï ‡§ò‡§ü‡§ï‡•ã‡§Ç ‡§î‡§∞ ‡§Ö‡§µ‡§ß‡§æ‡§∞‡§£‡§æ‡§ì‡§Ç ‡§ï‡•ã ‡§∏‡•ç‡§™‡§∑‡•ç‡§ü ‡§ï‡§∞‡§§‡•á ‡§π‡•à‡§Ç‡•§`,
        analyticalPoints: [
          `‡§Æ‡•Å‡§ñ‡•ç‡§Ø ‡§∏‡§ø‡§¶‡•ç‡§ß‡§æ‡§Ç‡§§: ${cleanTopic} ‡§ï‡•á ‡§Æ‡•Ç‡§≤‡§≠‡•Ç‡§§ ‡§®‡§ø‡§Ø‡§Æ ‡§î‡§∞ ‡§Ö‡§®‡•Å‡§™‡•ç‡§∞‡§Ø‡•ã‡§ó‡•§`,
          `‡§™‡§∞‡•Ä‡§ï‡•ç‡§∑‡§æ ‡§¶‡•É‡§∑‡•ç‡§ü‡§ø‡§ï‡•ã‡§£: SSC CGL, BPSC, UPSC ‡§µ ‡§Ö‡§®‡•ç‡§Ø ‡§™‡•ç‡§∞‡§§‡§ø‡§Ø‡•ã‡§ó‡•Ä ‡§™‡§∞‡•Ä‡§ï‡•ç‡§∑‡§æ‡§ì‡§Ç ‡§Æ‡•á‡§Ç ${cleanTopic} ‡§∏‡•á ‡§∏‡§Æ‡•ç‡§¨‡§Ç‡§ß‡§ø‡§§ ‡§Æ‡•Å‡§ñ‡•ç‡§Ø ‡§§‡§•‡•ç‡§Ø‡§æ‡§§‡•ç‡§Æ‡§ï ‡§™‡•ç‡§∞‡§∂‡•ç‡§®‡•§`,
          `‡§∏‡•ç‡§Æ‡§æ‡§∞‡•ç‡§ü ‡§§‡§ï‡§®‡•Ä‡§ï: ${cleanTopic} ‡§ï‡•ã ‡§¶‡•Ä‡§∞‡•ç‡§ò‡§ï‡§æ‡§≤‡§ø‡§ï ‡§∏‡•ç‡§Æ‡•É‡§§‡§ø ‡§Æ‡•á‡§Ç ‡§∏‡§Ç‡§ö‡§ø‡§§ ‡§ï‡§∞‡§®‡•á ‡§ï‡•á ‡§≤‡§ø‡§è ‡§∏‡§Ç‡§ï‡•ç‡§∑‡•á‡§™ ‡§®‡•ã‡§ü‡•ç‡§∏ ‡§î‡§∞ ‡§¨‡§æ‡§∞‡§Ç‡§¨‡§æ‡§∞ ‡§™‡•Å‡§®‡§∞‡§æ‡§µ‡•É‡§§‡•ç‡§§‡§ø‡•§`
        ],
        historicalTimeline: [
          { era: "‡§â‡§§‡•ç‡§™‡§§‡•ç‡§§‡§ø/‡§ö‡§∞‡§£ 1", event: `${cleanTopic} ‡§ï‡•Ä ‡§¨‡•Å‡§®‡§ø‡§Ø‡§æ‡§¶‡•Ä ‡§Ö‡§µ‡§ß‡§æ‡§∞‡§£‡§æ`, significance: "‡§µ‡§ø‡§∑‡§Ø ‡§ï‡•Ä ‡§ê‡§§‡§ø‡§π‡§æ‡§∏‡§ø‡§ï/‡§µ‡•à‡§ú‡•ç‡§û‡§æ‡§®‡§ø‡§ï ‡§®‡•Ä‡§Ç‡§µ‡•§" },
          { era: "‡§™‡•ç‡§∞‡§ó‡§§‡§ø/‡§ö‡§∞‡§£ 2", event: `${cleanTopic} ‡§ï‡§æ ‡§Ü‡§ß‡•Å‡§®‡§ø‡§ï ‡§™‡•ç‡§∞‡§Ø‡•ã‡§ó`, significance: "‡§™‡§∞‡•Ä‡§ï‡•ç‡§∑‡§æ ‡§µ ‡§µ‡§æ‡§∏‡•ç‡§§‡§µ‡§ø‡§ï ‡§Ö‡§®‡•Å‡§™‡•ç‡§∞‡§Ø‡•ã‡§ó‡•§" }
        ],
        crucialMnemonics: `‡§ï‡§°‡§º‡§ï ‡§∂‡§æ‡§∞‡•ç‡§ü ‡§ü‡•ç‡§∞‡§ø‡§ï: '${cleanTopic} + ‡§è‡§ï‡§æ‡§ó‡•ç‡§∞‡§§‡§æ + ‡§®‡§ø‡§∞‡§Ç‡§§‡§∞ ‡§Ö‡§≠‡•ç‡§Ø‡§æ‡§∏ = 100% ‡§∏‡§´‡§≤‡§§‡§æ'!`,
        practiceQuestions: [
          {
            question: `‡§™‡•ç‡§∞‡§§‡§ø‡§Ø‡•ã‡§ó‡•Ä ‡§™‡§∞‡•Ä‡§ï‡•ç‡§∑‡§æ ‡§Æ‡•á‡§Ç '${cleanTopic}' ‡§∏‡•á ‡§ú‡•Å‡§°‡§º‡•á ‡§™‡•ç‡§∞‡§∂‡•ç‡§®‡•ã‡§Ç ‡§ï‡•Ä ‡§Æ‡•Å‡§ñ‡•ç‡§Ø ‡§™‡•ç‡§∞‡§ï‡•É‡§§‡§ø ‡§ï‡•ç‡§Ø‡§æ ‡§π‡•ã‡§§‡•Ä ‡§π‡•à?`,
            options: ["‡§Ö‡§µ‡§ß‡§æ‡§∞‡§£‡§æ‡§§‡•ç‡§Æ‡§ï ‡§ú‡•ç‡§û‡§æ‡§® (Conceptual)", "‡§§‡§•‡•ç‡§Ø‡§æ‡§§‡•ç‡§Æ‡§ï ‡§µ‡§ø‡§µ‡§∞‡§£ (Factual)", "‡§¶‡•ã‡§®‡•ã‡§Ç (Both)", "‡§á‡§®‡§Æ‡•á‡§Ç ‡§∏‡•á ‡§ï‡•ã‡§à ‡§®‡§π‡•Ä‡§Ç"],
            answerIndex: 2,
            explanation: "‡§Ö‡§ß‡§ø‡§ï‡§æ‡§Ç‡§∂ ‡§™‡•ç‡§∞‡§§‡§ø‡§Ø‡•ã‡§ó‡•Ä ‡§™‡§∞‡•Ä‡§ï‡•ç‡§∑‡§æ‡§ì‡§Ç ‡§Æ‡•á‡§Ç ‡§Ö‡§µ‡§ß‡§æ‡§∞‡§£‡§æ‡§§‡•ç‡§Æ‡§ï ‡§î‡§∞ ‡§§‡§•‡•ç‡§Ø‡§æ‡§§‡•ç‡§Æ‡§ï ‡§¶‡•ã‡§®‡•ã‡§Ç ‡§™‡•ç‡§∞‡§ï‡§æ‡§∞ ‡§ï‡•á ‡§Æ‡§ø‡§∂‡•ç‡§∞‡§ø‡§§ ‡§™‡•ç‡§∞‡§∂‡•ç‡§® ‡§™‡•Ç‡§õ‡•á ‡§ú‡§æ‡§§‡•á ‡§π‡•à‡§Ç‡•§"
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
    showToast(`YouTube search launched for "${clean}"! üé¨`, "info");
  };

  const handleLaunchChatGPT = () => {
    window.open("https://chatgpt.com", "_blank", "noopener,noreferrer");
    showToast("OpenAI ChatGPT opened in new tab! ü§ñ", "info");
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
        ? `Google Scholar ‡§∞‡§ø‡§∏‡§∞‡•ç‡§ö ‡§™‡•ã‡§∞‡•ç‡§ü‡§≤ ‡§ñ‡•Å‡§≤ ‡§ó‡§Ø‡§æ ‡§π‡•à: "${clean}" üìö`
        : `Google Scholar Research Hub opened for "${clean}"! üìö`,
      "success"
    );
  };

  const handleLaunchWikipedia = (topic = launcherSearchTopic) => {
    const clean = (topic || "Indian Polity").trim();
    const url = `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(clean)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    showToast(`Wikipedia search launched for "${clean}"! üåê`, "info");
  };

  const handleLaunchNCERT = () => {
    window.open("https://ncert.nic.in/textbook.php", "_blank", "noopener,noreferrer");
    showToast("NCERT ePathshala Portal opened! üìò", "info");
  };

  const handleLaunchCustomUrl = () => {
    let raw = customLauncherUrl.trim();
    if (!raw) {
      showToast("‡§ï‡•É‡§™‡§Ø‡§æ ‡§ï‡•ã‡§à ‡§µ‡•á‡§¨ ‡§™‡§§‡§æ ‡§¶‡§∞‡•ç‡§ú ‡§ï‡§∞‡•á‡§Ç‡•§", "warn");
      return;
    }
    if (!raw.startsWith("http://") && !raw.startsWith("https://")) {
      raw = "https://" + raw;
    }
    window.open(raw, "_blank", "noopener,noreferrer");
    showToast(`Opening "${raw}"... üöÄ`, "success");
  };

  // Update browser tab title during active alarm countdown
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      const m = Math.floor(timeLeft / 60).toString().padStart(2, "0");
      const s = (timeLeft % 60).toString().padStart(2, "0");
      document.title = `‚è∞ (${m}:${s}) ${timerAlarmTitle || "HansAI Timer"}`;
    } else {
      document.title = "HansAI ‚Ä¢ ‡§π‡§Ç‡§∏-‡§è‡§Ü‡§à ‚Ä¢ Quantum Lab Core";
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
            
            showToast(`‚è∞ üö® STUDY ALARM RINGING! "${timerAlarmTitle || 'Study Session'}" Complete!`, "success");
            
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
              showToast("üìù Typing draft saved straight to Shorthand & Formula Notes!", "success");
            }
            return 0;
          }
          
          const halfTime = Math.floor((timerPresetVal * 60) / 2);
          if (prev - 1 === halfTime) {
            playBeep(660, 0.12, "sine");
            setTimeout(() => playBeep(660, 0.12, "sine"), 150);
            showToast("‚è≥ Smart alert: 50% session time completed! Keep pushing forward.", "info");
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
    showToast("Project saved securely in 'My Projects'! üìÅ", "success");
    
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
    showToast("Chat saved successfully to History! üíæ", "success");
  };

  // Helper to generate dynamic, subject-specific answers for instant local AI responses
  const generateSubjectKnowledgeReply = (userQuery: string, lang: string = 'hindi'): string => {
    const query = (userQuery || "").toLowerCase();

    if (query.includes('pdf') || query.includes('‡§™‡•Ä‡§°‡•Ä‡§è‡§´')) {
      const topicName = userQuery.replace(/pdf|‡§™‡•Ä‡§°‡•Ä‡§è‡§´|banao|chahiye|download|bnao|generate|karo/gi, '').trim() || '‡§∏‡§Ç‡§™‡•Ç‡§∞‡•ç‡§£ ‡§∏‡§æ‡§Æ‡§æ‡§®‡•ç‡§Ø ‡§Ö‡§ß‡•ç‡§Ø‡§Ø‡§® (General Studies Notes)';
      return `### üìÑ HansAI - ‡§Ü‡§™‡§ï‡•á ‡§Ö‡§ß‡•ç‡§Ø‡§Ø‡§® ‡§π‡•á‡§§‡•Å ‡§µ‡§ø‡§∂‡•á‡§∑ PDF ‡§®‡•ã‡§ü‡•ç‡§∏\n\n` +
        `**‡§µ‡§ø‡§∑‡§Ø:** "${topicName}"\n\n` +
        `#### üìå ‡§Æ‡•Å‡§ñ‡•ç‡§Ø ‡§¨‡§ø‡§Ç‡§¶‡•Å ‡§µ ‡§™‡§∞‡•Ä‡§ï‡•ç‡§∑‡§æ ‡§∏‡§æ‡§∞‡§æ‡§Ç‡§∂:\n` +
        `1. **‡§Ö‡§µ‡§ß‡§æ‡§∞‡§£‡§æ ‡§ï‡•Ä ‡§∏‡•ç‡§™‡§∑‡•ç‡§ü‡§§‡§æ:** ‡§á‡§∏ ‡§Ö‡§ß‡•ç‡§Ø‡§æ‡§Ø ‡§ï‡•á ‡§∏‡§≠‡•Ä ‡§Æ‡§π‡§§‡•ç‡§µ‡§™‡•Ç‡§∞‡•ç‡§£ ‡§∏‡•Ç‡§§‡•ç‡§∞, ‡§∏‡§ø‡§¶‡•ç‡§ß‡§æ‡§Ç‡§§ ‡§è‡§µ‡§Ç ‡§§‡§ø‡§•‡§ø‡§Ø‡§æ‡§Ç ‡§∂‡§æ‡§Æ‡§ø‡§≤ ‡§π‡•à‡§Ç‡•§\n` +
        `2. **‡§µ‡§ø‡§ó‡§§ ‡§µ‡§∞‡•ç‡§∑‡•ã‡§Ç ‡§ï‡•á ‡§™‡•ç‡§∞‡§∂‡•ç‡§® (PYQ):** ‡§™‡•ç‡§∞‡§§‡§ø‡§Ø‡•ã‡§ó‡•Ä ‡§™‡§∞‡•Ä‡§ï‡•ç‡§∑‡§æ‡§ì‡§Ç (SSC, Railway, State PCS, UPSC) ‡§Æ‡•á‡§Ç ‡§¨‡§æ‡§∞-‡§¨‡§æ‡§∞ ‡§™‡•Ç‡§õ‡•á ‡§ú‡§æ‡§®‡•á ‡§µ‡§æ‡§≤‡•á ‡§¨‡§ø‡§Ç‡§¶‡•Å‡•§\n` +
        `3. **‡§∏‡•ç‡§Æ‡§∞‡§£ ‡§ü‡•ç‡§∞‡§ø‡§ï (Memory Trick):** ‡§ï‡§†‡§ø‡§® ‡§§‡§•‡•ç‡§Ø‡•ã‡§Ç ‡§ï‡•ã ‡§Ø‡§æ‡§¶ ‡§∞‡§ñ‡§®‡•á ‡§ï‡•á ‡§≤‡§ø‡§è ‡§µ‡§ø‡§∂‡•á‡§∑ ‡§∏‡•Ç‡§§‡•ç‡§∞ ‡§µ ‡§®‡§ø‡§Æ‡•ã‡§®‡§ø‡§ï‡•ç‡§∏‡•§\n` +
        `4. **‡§Ö‡§≠‡•ç‡§Ø‡§æ‡§∏ ‡§µ ‡§∏‡•ç‡§µ-‡§Æ‡•Ç‡§≤‡•ç‡§Ø‡§æ‡§Ç‡§ï‡§®:** ‡§Ö‡§ß‡•ç‡§Ø‡§æ‡§Ø ‡§∏‡§Æ‡§æ‡§™‡•ç‡§§ ‡§ï‡§∞‡§®‡•á ‡§ï‡•á ‡§™‡§∂‡•ç‡§ö‡§æ‡§§ Auto Chapter Quiz ‡§Æ‡•á‡§Ç ‡§≠‡§æ‡§ó ‡§≤‡•á‡§Ç‡•§\n\n` +
        `üì• **PDF ‡§°‡§æ‡§â‡§®‡§≤‡•ã‡§° ‡§ï‡§∞‡§®‡•á ‡§ï‡•á ‡§≤‡§ø‡§è ‡§®‡•Ä‡§ö‡•á ‡§¶‡§ø‡§è ‡§ó‡§è 'üì• PDF' ‡§¨‡§ü‡§® ‡§™‡§∞ ‡§§‡•Å‡§∞‡§Ç‡§§ ‡§ï‡•ç‡§≤‡§ø‡§ï ‡§ï‡§∞‡•á‡§Ç‡•§ ‡§Ø‡§π ‡§´‡§æ‡§á‡§≤ ‡§Ü‡§™‡§ï‡•á ‡§°‡§ø‡§µ‡§æ‡§á‡§∏ ‡§Æ‡•á‡§Ç ‡§∏‡•Ä‡§ß‡•á ‡§°‡§æ‡§â‡§®‡§≤‡•ã‡§° ‡§π‡•ã ‡§ú‡§æ‡§è‡§ó‡•Ä!**`;
    }

    if (query.includes('shorthand') || query.includes('steno') || query.includes('‡§∏‡•ç‡§ü‡•á‡§®‡•ã') || query.includes('‡§∂‡•â‡§∞‡•ç‡§ü‡§π‡•à‡§Ç‡§°') || query.includes('‡§Ü‡§∂‡•Å‡§≤‡§ø‡§™‡§ø') || query.includes('‡§ã‡§∑‡§ø') || query.includes('‡§™‡§ø‡§ü‡§Æ‡•à‡§®') || query.includes('dictation')) {
      return `### ‚úçÔ∏è ‡§Ü‡§∂‡•Å‡§≤‡§ø‡§™‡§ø ‡§µ ‡§∏‡•ç‡§ü‡•á‡§®‡•ã‡§ó‡•ç‡§∞‡§æ‡§´‡•Ä (Stenography Lab)\n\n` +
        `‡§∏‡•ç‡§ü‡•á‡§®‡•ã‡§ó‡•ç‡§∞‡§æ‡§´‡•Ä ‡§Æ‡•á‡§Ç 80/100 WPM ‡§ó‡§§‡§ø ‡§î‡§∞ ‡§â‡§ö‡•ç‡§ö ‡§∂‡•Å‡§¶‡•ç‡§ß‡§§‡§æ ‡§π‡•á‡§§‡•Å ‡§Æ‡§æ‡§∞‡•ç‡§ó‡§¶‡§∞‡•ç‡§∂‡§ø‡§ï‡§æ:\n\n` +
        `1. **‡§ã‡§∑‡§ø/‡§™‡§ø‡§ü‡§Æ‡•à‡§® ‡§™‡•ç‡§∞‡§£‡§æ‡§≤‡§ø‡§Ø‡§æ‡§Å:** ‡§µ‡•ç‡§Ø‡§Ç‡§ú‡§®‡•ã‡§Ç ‡§ï‡•á ‡§∏‡•ç‡§ü‡•ç‡§∞‡•ã‡§ï (‡§π‡§≤‡•ç‡§ï‡•á ‡§µ ‡§ó‡§æ‡§¢‡§º‡•á), ‡§∏‡•ç‡§µ‡§∞ ‡§∏‡•ç‡§•‡§æ‡§®‡•ã‡§Ç (1st, 2nd, 3rd place) ‡§µ ‡§Ü‡§Ç‡§ï‡§°‡§º‡•ã‡§Ç ‡§ï‡§æ ‡§∏‡§π‡•Ä ‡§ú‡•ç‡§û‡§æ‡§®‡•§\n` +
        `2. **‡§∂‡§¨‡•ç‡§¶‡§ö‡§ø‡§π‡•ç‡§® (Grammalogues):** ‡§¶‡•à‡§®‡§ø‡§ï ‡§™‡•ç‡§∞‡§Ø‡•ã‡§ó ‡§Æ‡•á‡§Ç ‡§Ü‡§®‡•á ‡§µ‡§æ‡§≤‡•á 200 ‡§Æ‡•Å‡§ñ‡•ç‡§Ø ‡§∂‡§¨‡•ç‡§¶‡§ö‡§ø‡§π‡•ç‡§®‡•ã‡§Ç ‡§ï‡§æ 30 ‡§Æ‡§ø‡§®‡§ü ‡§¨‡§ø‡§®‡§æ ‡§∞‡•Å‡§ï‡•á ‡§Ö‡§≠‡•ç‡§Ø‡§æ‡§∏‡•§\n` +
        `3. **‡§µ‡§æ‡§ï‡•ç‡§Ø‡§æ‡§Ç‡§∂ (Phrasing):** ‡§∏‡§Ç‡§Ø‡•Å‡§ï‡•ç‡§§ ‡§∂‡§¨‡•ç‡§¶‡•ã‡§Ç ‡§ï‡•ã ‡§¨‡§ø‡§®‡§æ ‡§™‡•á‡§Ç‡§∏‡§ø‡§≤ ‡§â‡§†‡§æ‡§è ‡§è‡§ï ‡§∏‡§æ‡§• ‡§ú‡•ã‡§°‡§º‡§®‡§æ‡•§\n\n` +
        `üëâ ‡§ê‡§™ ‡§ï‡•á **Stenography Lab** ‡§Æ‡•á‡§Ç ‡§ú‡§æ‡§ï‡§∞ ‡§ë‡§°‡§ø‡§Ø‡•ã ‡§°‡§ø‡§ï‡•ç‡§ü‡•á‡§∂‡§® ‡§µ ‡§∏‡•ç‡§™‡•Ä‡§° ‡§ü‡•á‡§∏‡•ç‡§ü ‡§¶‡•á‡§Ç!`;
    }

    if (query.includes('‡§∏‡§Ç‡§ß‡§ø') || query.includes('‡§∏‡§Æ‡§æ‡§∏') || query.includes('‡§Æ‡•Å‡§π‡§æ‡§µ‡§∞‡•á') || query.includes('‡§µ‡§ø‡§≤‡•ã‡§Æ') || query.includes('‡§™‡§∞‡•ç‡§Ø‡§æ‡§Ø‡§µ‡§æ‡§ö‡•Ä') || query.includes('‡§µ‡•ç‡§Ø‡§æ‡§ï‡§∞‡§£')) {
      return `### üìñ ‡§π‡§ø‡§Ç‡§¶‡•Ä ‡§µ‡•ç‡§Ø‡§æ‡§ï‡§∞‡§£ (Hindi Grammar)\n\n` +
        `‡§™‡•ç‡§∞‡§§‡§ø‡§Ø‡•ã‡§ó‡•Ä ‡§™‡§∞‡•Ä‡§ï‡•ç‡§∑‡§æ‡§ì‡§Ç (SSC GD, BPSC, State Police/TET) ‡§π‡•á‡§§‡•Å ‡§Æ‡§π‡§§‡•ç‡§µ‡§™‡•Ç‡§∞‡•ç‡§£ ‡§¨‡§ø‡§Ç‡§¶‡•Å:\n\n` +
        `1. **‡§∏‡§Ç‡§ß‡§ø:** ‡§∏‡•ç‡§µ‡§∞ (‡§¶‡•Ä‡§∞‡•ç‡§ò, ‡§ó‡•Å‡§£, ‡§µ‡•É‡§¶‡•ç‡§ß‡§ø, ‡§Ø‡§£, ‡§Ö‡§Ø‡§æ‡§¶‡§ø), ‡§µ‡•ç‡§Ø‡§Ç‡§ú‡§® ‡§µ ‡§µ‡§ø‡§∏‡§∞‡•ç‡§ó ‡§∏‡§Ç‡§ß‡§ø‡•§\n` +
        `2. **‡§∏‡§Æ‡§æ‡§∏:** ‡§Ö‡§µ‡•ç‡§Ø‡§Ø‡•Ä‡§≠‡§æ‡§µ, ‡§§‡§§‡•ç‡§™‡•Å‡§∞‡•Å‡§∑, ‡§ï‡§∞‡•ç‡§Æ‡§ß‡§æ‡§∞‡§Ø, ‡§¶‡•ç‡§µ‡§ø‡§ó‡•Å, ‡§¶‡•ç‡§µ‡§Ç‡§¶‡•ç‡§µ ‡§µ ‡§¨‡§π‡•Å‡§µ‡•ç‡§∞‡•Ä‡§π‡§ø ‡§∏‡§Æ‡§æ‡§∏‡•§\n` +
        `3. **‡§Æ‡•Å‡§π‡§æ‡§µ‡§∞‡•á ‡§µ ‡§≤‡•ã‡§ï‡•ã‡§ï‡•ç‡§§‡§ø‡§Ø‡§æ‡§Ç:** ‡§≠‡§æ‡§µ‡§æ‡§∞‡•ç‡§• ‡§µ ‡§µ‡§æ‡§ï‡•ç‡§Ø ‡§™‡•ç‡§∞‡§Ø‡•ã‡§ó ‡§ï‡•Ä ‡§∏‡•ç‡§™‡§∑‡•ç‡§ü‡§§‡§æ‡•§\n\n` +
        `üëâ ‡§Ü‡§™ ‡§ï‡§ø‡§∏‡•Ä ‡§≠‡•Ä ‡§µ‡§ø‡§∂‡§ø‡§∑‡•ç‡§ü ‡§µ‡•ç‡§Ø‡§æ‡§ï‡§∞‡§£ ‡§®‡§ø‡§Ø‡§Æ ‡§Ø‡§æ ‡§™‡•ç‡§∞‡§∂‡•ç‡§® ‡§ï‡§æ ‡§∏‡•Ä‡§ß‡§æ ‡§â‡§§‡•ç‡§§‡§∞ ‡§™‡•ç‡§∞‡§æ‡§™‡•ç‡§§ ‡§ï‡§∞ ‡§∏‡§ï‡§§‡•á ‡§π‡•à‡§Ç!`;
    }

    if (query.includes('english') || query.includes('grammar') || query.includes('tense') || query.includes('passive') || query.includes('preposition')) {
      return `### üìù English Language & Grammar Rules\n\n` +
        `Key concepts for SSC CGL/CHSL, Banking & Competitive Exams:\n\n` +
        `1. **Subject-Verb Agreement:** Singular subject = Singular verb; Plural subject = Plural verb.\n` +
        `2. **Voice Transformation:** Active to Passive requires Past Participle (V3) of the main verb.\n` +
        `3. **Prepositions:** Usage of *in, on, at, between, among, beside, besides* with context.\n\n` +
        `üëâ Type any error spotting or grammar sentence for step-by-step breakdown!`;
    }

    if (query.includes('geography') || query.includes('‡§≠‡•Ç‡§ó‡•ã‡§≤')) {
      return `### üåç ‡§≠‡•Ç‡§ó‡•ã‡§≤ (Geography) - ‡§∏‡§Ç‡§™‡•Ç‡§∞‡•ç‡§£ ‡§™‡§∞‡§ø‡§ö‡§Ø ‡§µ ‡§Ö‡§ß‡•ç‡§Ø‡§Ø‡§® ‡§∏‡§Æ‡§æ‡§ß‡§æ‡§®\n\n` +
        `**‡§≠‡•Ç‡§ó‡•ã‡§≤ (Geography)** ‡§µ‡§π ‡§µ‡§ø‡§∏‡•ç‡§§‡•É‡§§ ‡§µ‡§ø‡§ú‡•ç‡§û‡§æ‡§® ‡§π‡•à ‡§ú‡§ø‡§∏‡§ï‡•á ‡§Ö‡§Ç‡§§‡§∞‡•ç‡§ó‡§§ ‡§™‡•É‡§•‡•ç‡§µ‡•Ä ‡§ï‡•á ‡§ß‡§∞‡§æ‡§§‡§≤, ‡§â‡§∏‡§ï‡•á ‡§≠‡•å‡§§‡§ø‡§ï ‡§∏‡•ç‡§µ‡§∞‡•Ç‡§™‡•ã‡§Ç, ‡§ú‡§≤‡§µ‡§æ‡§Ø‡•Å, ‡§™‡•ç‡§∞‡§æ‡§ï‡•É‡§§‡§ø‡§ï ‡§∏‡§Ç‡§∏‡§æ‡§ß‡§®‡•ã‡§Ç, ‡§®‡§¶‡§ø‡§Ø‡§æ‡§Å ‡§è‡§µ‡§Ç ‡§Æ‡§π‡§æ‡§¶‡•ç‡§µ‡•Ä‡§™‡•ã‡§Ç ‡§ï‡§æ ‡§Ö‡§ß‡•ç‡§Ø‡§Ø‡§® ‡§ï‡§ø‡§Ø‡§æ ‡§ú‡§æ‡§§‡§æ ‡§π‡•à‡•§\n\n` +
        `#### üìå ‡§Æ‡•Å‡§ñ‡•ç‡§Ø ‡§∂‡§æ‡§ñ‡§æ‡§è‡§Ç (Core Branches):\n` +
        `1. **‡§≠‡•å‡§§‡§ø‡§ï ‡§≠‡•Ç‡§ó‡•ã‡§≤ (Physical Geography):**\n` +
        `   - **‡§≠‡•Ç-‡§Ü‡§ï‡•É‡§§‡§ø ‡§µ‡§ø‡§ú‡•ç‡§û‡§æ‡§® (Geomorphology):** ‡§™‡§∞‡•ç‡§µ‡§§ (‡§ú‡•à‡§∏‡•á ‡§π‡§ø‡§Æ‡§æ‡§≤‡§Ø), ‡§™‡§†‡§æ‡§∞, ‡§Æ‡•à‡§¶‡§æ‡§®, ‡§è‡§µ‡§Ç ‡§®‡§¶‡§ø‡§Ø‡§æ‡§Å‡•§\n` +
        `   - **‡§ú‡§≤‡§µ‡§æ‡§Ø‡•Å ‡§µ‡§ø‡§ú‡•ç‡§û‡§æ‡§® (Climatology):** ‡§≠‡§æ‡§∞‡§§‡•Ä‡§Ø ‡§Æ‡§æ‡§®‡§∏‡•Ç‡§®, ‡§ö‡§ï‡•ç‡§∞‡§µ‡§æ‡§§, ‡§µ‡§æ‡§Ø‡•Å‡§¶‡§æ‡§¨ ‡§™‡•á‡§ü‡§ø‡§Ø‡§æ‡§Å, ‡§è‡§µ‡§Ç ‡§µ‡§∞‡•ç‡§∑‡§æ‡•§\n` +
        `   - **‡§∏‡§Æ‡•Å‡§¶‡•ç‡§∞ ‡§µ‡§ø‡§ú‡•ç‡§û‡§æ‡§® (Oceanography):** ‡§Æ‡§π‡§æ‡§∏‡§æ‡§ó‡§∞‡•Ä‡§Ø ‡§ß‡§æ‡§∞‡§æ‡§è‡§Å (‡§ó‡§≤‡•ç‡§´ ‡§∏‡•ç‡§ü‡•ç‡§∞‡•Ä‡§Æ, ‡§≤‡§æ ‡§®‡•Ä‡§®‡§æ) ‡§µ ‡§ú‡•ç‡§µ‡§æ‡§∞-‡§≠‡§æ‡§ü‡§æ‡•§\n` +
        `   - **‡§∏‡•å‡§∞‡§Æ‡§Ç‡§°‡§≤ (Solar System):** ‡§™‡•É‡§•‡•ç‡§µ‡•Ä ‡§ï‡•Ä ‡§ó‡§§‡§ø‡§Ø‡§æ‡§Å, ‡§Ö‡§ï‡•ç‡§∑‡§æ‡§Ç‡§∂ (Latitude) ‡§µ ‡§¶‡•á‡§∂‡§æ‡§Ç‡§§‡§∞ (Longitude)‡•§\n\n` +
        `2. **‡§≠‡§æ‡§∞‡§§ ‡§ï‡§æ ‡§≠‡•Ç‡§ó‡•ã‡§≤ (Indian Geography) [‡§™‡§∞‡•Ä‡§ï‡•ç‡§∑‡§æ‡§ì‡§Ç ‡§π‡•á‡§§‡•Å ‡§Æ‡§π‡§§‡•ç‡§µ‡§™‡•Ç‡§∞‡•ç‡§£]:**\n` +
        `   - **‡§≠‡•å‡§§‡§ø‡§ï ‡§µ‡§ø‡§≠‡§æ‡§ú‡§®:** ‡§â‡§§‡•ç‡§§‡§∞‡•Ä ‡§π‡§ø‡§Æ‡§æ‡§≤‡§Ø ‡§™‡§∞‡•ç‡§µ‡§§‡§Æ‡§æ‡§≤‡§æ, ‡§™‡•ç‡§∞‡§æ‡§Ø‡§¶‡•ç‡§µ‡•Ä‡§™‡•Ä‡§Ø ‡§™‡§†‡§æ‡§∞, ‡§§‡§ü‡•Ä‡§Ø ‡§Æ‡•à‡§¶‡§æ‡§® ‡§µ ‡§¶‡•ç‡§µ‡•Ä‡§™ ‡§∏‡§Æ‡•Ç‡§π‡•§\n` +
        `   - **‡§™‡•ç‡§∞‡§Æ‡•Å‡§ñ ‡§®‡§¶‡§ø‡§Ø‡§æ‡§Å:** ‡§ó‡§Ç‡§ó‡§æ, ‡§∏‡§ø‡§Ç‡§ß‡•Å, ‡§¨‡•ç‡§∞‡§π‡•ç‡§Æ‡§™‡•Å‡§§‡•ç‡§∞, ‡§ó‡•ã‡§¶‡§æ‡§µ‡§∞‡•Ä, ‡§®‡§∞‡•ç‡§Æ‡§¶‡§æ, ‡§§‡§æ‡§™‡•ç‡§§‡•Ä, ‡§ï‡•É‡§∑‡•ç‡§£‡§æ, ‡§ï‡§æ‡§µ‡•á‡§∞‡•Ä‡•§\n` +
        `   - **‡§Æ‡§ø‡§ü‡•ç‡§ü‡•Ä ‡§µ ‡§´‡§∏‡§≤‡•á‡§Ç:** ‡§ú‡§≤‡•ã‡§¢‡§º, ‡§ï‡§æ‡§≤‡•Ä (‡§∞‡•á‡§ó‡•Å‡§∞), ‡§≤‡§æ‡§≤ ‡§Æ‡§ø‡§ü‡•ç‡§ü‡•Ä ‡§§‡§•‡§æ ‡§∞‡§¨‡•Ä, ‡§ñ‡§∞‡•Ä‡§´ ‡§è‡§µ‡§Ç ‡§ú‡§æ‡§Ø‡§¶ ‡§´‡§∏‡§≤‡•á‡§Ç‡•§\n\n` +
        `üí° **‡§Ø‡§æ‡§¶ ‡§∞‡§ñ‡§®‡•á ‡§ï‡•Ä ‡§∂‡§æ‡§∞‡•ç‡§ü ‡§ü‡•ç‡§∞‡§ø‡§ï:**\n` +
        `- **‡§ï‡§∞‡•ç‡§ï ‡§∞‡•á‡§ñ‡§æ (23¬Ω¬∞ N)** ‡§≠‡§æ‡§∞‡§§ ‡§ï‡•á 8 ‡§∞‡§æ‡§ú‡•ç‡§Ø‡•ã‡§Ç ‡§∏‡•á ‡§ó‡•Å‡§ú‡§∞‡§§‡•Ä ‡§π‡•à: *(‡§Æ‡§ø‡§§‡•ç‡§∞ ‡§™‡§∞ ‡§ó‡§Æ‡§õ‡§æ ‡§ù‡§æ‡§∞ -> ‡§Æ‡§ø‡§ú‡•ã‡§∞‡§Æ, ‡§§‡•ç‡§∞‡§ø‡§™‡•Å‡§∞‡§æ, ‡§™. ‡§¨‡§Ç‡§ó‡§æ‡§≤, ‡§∞‡§æ‡§ú‡§∏‡•ç‡§•‡§æ‡§®, ‡§ó‡•Å‡§ú‡§∞‡§æ‡§§, ‡§Æ.‡§™‡•ç‡§∞., ‡§õ‡§§‡•ç‡§§‡•Ä‡§∏‡§ó‡§¢‡§º, ‡§ù‡§æ‡§∞‡§ñ‡§Ç‡§°)*‡•§\n\n` +
        `üëâ ‡§Ü‡§™ **Auto Chapter Quiz** ‡§∏‡•á‡§ï‡•ç‡§∂‡§® ‡§Æ‡•á‡§Ç ‡§ú‡§æ‡§ï‡§∞ **"Geography"** ‡§™‡§∞ ‡§§‡•Å‡§∞‡§Ç‡§§ 5 ‡§™‡•ç‡§∞‡§∂‡•ç‡§®‡•ã‡§Ç ‡§ï‡§æ ‡§≤‡§æ‡§á‡§µ ‡§ü‡•á‡§∏‡•ç‡§ü ‡§≠‡•Ä ‡§¶‡•á ‡§∏‡§ï‡§§‡•á ‡§π‡•à‡§Ç!`;
    }

    if (query.includes('history') || query.includes('‡§á‡§§‡§ø‡§π‡§æ‡§∏')) {
      return `### üìú ‡§á‡§§‡§ø‡§π‡§æ‡§∏ (History) - ‡§∏‡§Ç‡§™‡•Ç‡§∞‡•ç‡§£ ‡§ï‡§æ‡§≤‡§ï‡•ç‡§∞‡§Æ ‡§µ ‡§™‡§∞‡•Ä‡§ï‡•ç‡§∑‡§æ ‡§µ‡§ø‡§∂‡•ç‡§≤‡•á‡§∑‡§£\n\n` +
        `‡§á‡§§‡§ø‡§π‡§æ‡§∏ ‡§ï‡•ã ‡§Æ‡•Å‡§ñ‡•ç‡§Ø ‡§∞‡•Ç‡§™ ‡§∏‡•á ‡§§‡•Ä‡§® ‡§≠‡§æ‡§ó‡•ã‡§Ç ‡§Æ‡•á‡§Ç ‡§µ‡§∞‡•ç‡§ó‡•Ä‡§ï‡•É‡§§ ‡§ï‡§ø‡§Ø‡§æ ‡§ó‡§Ø‡§æ ‡§π‡•à:\n\n` +
        `1. **‡§™‡•ç‡§∞‡§æ‡§ö‡•Ä‡§® ‡§≠‡§æ‡§∞‡§§ (Ancient India):** ‡§∏‡§ø‡§Ç‡§ß‡•Å ‡§ò‡§æ‡§ü‡•Ä ‡§∏‡§≠‡•ç‡§Ø‡§§‡§æ, ‡§µ‡•à‡§¶‡§ø‡§ï ‡§ï‡§æ‡§≤, ‡§¨‡•å‡§¶‡•ç‡§ß ‡§µ ‡§ú‡•à‡§® ‡§ß‡§∞‡•ç‡§Æ, ‡§Æ‡•å‡§∞‡•ç‡§Ø ‡§∏‡§æ‡§Æ‡•ç‡§∞‡§æ‡§ú‡•ç‡§Ø (‡§Ö‡§∂‡•ã‡§ï) ‡§µ ‡§ó‡•Å‡§™‡•ç‡§§ ‡§ï‡§æ‡§≤‡•§\n` +
        `2. **‡§Æ‡§ß‡•ç‡§Ø‡§ï‡§æ‡§≤‡•Ä‡§® ‡§≠‡§æ‡§∞‡§§ (Medieval India):** ‡§¶‡§ø‡§≤‡•ç‡§≤‡•Ä ‡§∏‡§≤‡•ç‡§§‡§®‡§§, ‡§Æ‡•Å‡§ó‡§≤ ‡§∏‡§æ‡§Æ‡•ç‡§∞‡§æ‡§ú‡•ç‡§Ø (‡§Ö‡§ï‡§¨‡§∞ ‡§∏‡•á ‡§î‡§∞‡§Ç‡§ó‡§ú‡•á‡§¨), ‡§è‡§µ‡§Ç ‡§≠‡§ï‡•ç‡§§‡§ø ‡§Ü‡§Ç‡§¶‡•ã‡§≤‡§®‡•§\n` +
        `3. **‡§Ü‡§ß‡•Å‡§®‡§ø‡§ï ‡§≠‡§æ‡§∞‡§§ (Modern India):** 1857 ‡§ï‡•Ä ‡§ï‡•ç‡§∞‡§æ‡§Ç‡§§‡§ø, ‡§≠‡§æ‡§∞‡§§‡•Ä‡§Ø ‡§∞‡§æ‡§∑‡•ç‡§ü‡•ç‡§∞‡•Ä‡§Ø ‡§ï‡§æ‡§Ç‡§ó‡•ç‡§∞‡•á‡§∏ (1885), ‡§ó‡§æ‡§Ç‡§ß‡•Ä‡§µ‡§æ‡§¶‡•Ä ‡§Ø‡•Å‡§ó (1915-1947) ‡§è‡§µ‡§Ç ‡§∏‡•ç‡§µ‡§§‡§Ç‡§§‡•ç‡§∞‡§§‡§æ ‡§Ü‡§Ç‡§¶‡•ã‡§≤‡§®‡•§\n\n` +
        `üëâ **‡§Ö‡§≠‡•ç‡§Ø‡§æ‡§∏:** ‡§§‡•Å‡§∞‡§Ç‡§§ **Modern History** ‡§™‡§∞ ‡§ï‡•ç‡§µ‡§ø‡§ú ‡§π‡§≤ ‡§ï‡§∞‡•á‡§Ç!`;
    }

    if (query.includes('polity') || query.includes('‡§∏‡§Ç‡§µ‡§ø‡§ß‡§æ‡§®') || query.includes('‡§∞‡§æ‡§ú‡§µ‡•ç‡§Ø‡§µ‡§∏‡•ç‡§•‡§æ')) {
      return `### üèõÔ∏è ‡§≠‡§æ‡§∞‡§§‡•Ä‡§Ø ‡§∏‡§Ç‡§µ‡§ø‡§ß‡§æ‡§® ‡§µ ‡§∞‡§æ‡§ú‡§µ‡•ç‡§Ø‡§µ‡§∏‡•ç‡§•‡§æ (Indian Polity)\n\n` +
        `‡§≠‡§æ‡§∞‡§§‡•Ä‡§Ø ‡§∏‡§Ç‡§µ‡§ø‡§ß‡§æ‡§® 26 ‡§®‡§µ‡§Ç‡§¨‡§∞ 1949 ‡§ï‡•ã ‡§Ö‡§Ç‡§ó‡•Ä‡§ï‡•É‡§§ ‡§π‡•Å‡§Ü ‡§§‡§•‡§æ 26 ‡§ú‡§®‡§µ‡§∞‡•Ä 1950 ‡§ï‡•ã ‡§™‡•Ç‡§∞‡•ç‡§£‡§§‡§É ‡§≤‡§æ‡§ó‡•Ç ‡§π‡•Å‡§Ü‡•§\n\n` +
        `#### üìå ‡§Æ‡§π‡§§‡•ç‡§µ‡§™‡•Ç‡§∞‡•ç‡§£ ‡§Ö‡§Ç‡§∂:\n` +
        `- **‡§≠‡§æ‡§ó 3 (‡§Ö‡§®‡•Å‡§ö‡•ç‡§õ‡•á‡§¶ 12-35):** 6 ‡§Æ‡•å‡§≤‡§ø‡§ï ‡§Ö‡§ß‡§ø‡§ï‡§æ‡§∞ (Fundamental Rights)‡•§\n` +
        `- **‡§≠‡§æ‡§ó 4 (‡§Ö‡§®‡•Å‡§ö‡•ç‡§õ‡•á‡§¶ 36-51):** ‡§®‡•Ä‡§§‡§ø ‡§®‡§ø‡§∞‡•ç‡§¶‡•á‡§∂‡§ï ‡§§‡§§‡•ç‡§µ (DPSP)‡•§\n` +
        `- **‡§Ö‡§®‡•Å‡§ö‡•ç‡§õ‡•á‡§¶ 32:** ‡§∏‡§Ç‡§µ‡•à‡§ß‡§æ‡§®‡§ø‡§ï ‡§â‡§™‡§ö‡§æ‡§∞‡•ã‡§Ç ‡§ï‡§æ ‡§Ö‡§ß‡§ø‡§ï‡§æ‡§∞ ('‡§∏‡§Ç‡§µ‡§ø‡§ß‡§æ‡§® ‡§ï‡•Ä ‡§Ü‡§§‡•ç‡§Æ‡§æ')‡•§\n` +
        `- **‡§Ö‡§®‡•Å‡§ö‡•ç‡§õ‡•á‡§¶ 52-61:** ‡§≠‡§æ‡§∞‡§§ ‡§ï‡•á ‡§∞‡§æ‡§∑‡•ç‡§ü‡•ç‡§∞‡§™‡§§‡§ø ‡§µ ‡§Æ‡§π‡§æ‡§≠‡§ø‡§Ø‡•ã‡§ó ‡§™‡•ç‡§∞‡§ï‡•ç‡§∞‡§ø‡§Ø‡§æ‡•§\n\n` +
        `üëâ **‡§Ö‡§≠‡•ç‡§Ø‡§æ‡§∏:** ‡§ê‡§™ ‡§ï‡•á **Quiz** ‡§∏‡•á‡§ï‡•ç‡§∂‡§® ‡§Æ‡•á‡§Ç **Indian Polity** ‡§ö‡•Å‡§®‡•á‡§Ç!`;
    }

    if (query.includes('science') || query.includes('‡§µ‡§ø‡§ú‡•ç‡§û‡§æ‡§®') || query.includes('physics') || query.includes('chemistry') || query.includes('biology') || query.includes('‡§≠‡•å‡§§‡§ø‡§ï') || query.includes('‡§∞‡§∏‡§æ‡§Ø‡§®') || query.includes('‡§ú‡•Ä‡§µ')) {
      return `### üî¨ ‡§∏‡§æ‡§Æ‡§æ‡§®‡•ç‡§Ø ‡§µ‡§ø‡§ú‡•ç‡§û‡§æ‡§® (General Science)\n\n` +
        `1. **‡§≠‡•å‡§§‡§ø‡§ï‡•Ä (Physics):** ‡§ó‡§§‡§ø ‡§ï‡•á ‡§®‡§ø‡§Ø‡§Æ (F=ma), ‡§™‡•ç‡§∞‡§ï‡§æ‡§∂ ‡§ï‡§æ ‡§Ö‡§™‡§µ‡§∞‡•ç‡§§‡§®/‡§™‡§∞‡§æ‡§µ‡§∞‡•ç‡§§‡§®, ‡§ó‡•Å‡§∞‡•Å‡§§‡•ç‡§µ‡§æ‡§ï‡§∞‡•ç‡§∑‡§£, ‡§ï‡§æ‡§∞‡•ç‡§Ø ‡§µ ‡§ä‡§∞‡•ç‡§ú‡§æ‡•§\n` +
        `2. **‡§∞‡§∏‡§æ‡§Ø‡§® (Chemistry):** ‡§Ü‡§µ‡§∞‡•ç‡§§ ‡§∏‡§æ‡§∞‡§£‡•Ä (Periodic Table), ‡§Ö‡§Æ‡•ç‡§≤ ‡§µ ‡§ï‡•ç‡§∑‡§æ‡§∞ (pH ‡§Æ‡§æ‡§®), ‡§™‡§∞‡§Æ‡§æ‡§£‡•Å ‡§∏‡§Ç‡§∞‡§ö‡§®‡§æ‡•§\n` +
        `3. **‡§ú‡•Ä‡§µ ‡§µ‡§ø‡§ú‡•ç‡§û‡§æ‡§® (Biology):** ‡§ï‡•ã‡§∂‡§ø‡§ï‡§æ (Powerhouse = Mitochondria), ‡§Æ‡§æ‡§®‡§µ ‡§™‡§æ‡§ö‡§® ‡§µ ‡§™‡§∞‡§ø‡§∏‡§Ç‡§ö‡§∞‡§£ ‡§§‡§Ç‡§§‡•ç‡§∞, ‡§µ‡§ø‡§ü‡§æ‡§Æ‡§ø‡§® ‡§µ ‡§¨‡•Ä‡§Æ‡§æ‡§∞‡§ø‡§Ø‡§æ‡§Å‡•§\n\n` +
        `üëâ ‡§µ‡§ø‡§∏‡•ç‡§§‡•É‡§§ ‡§ú‡§æ‡§®‡§ï‡§æ‡§∞‡•Ä ‡§ï‡•á ‡§≤‡§ø‡§è ‡§ü‡•â‡§™‡§ø‡§ï ‡§ï‡§æ ‡§∏‡§ü‡•Ä‡§ï ‡§®‡§æ‡§Æ ‡§ü‡§æ‡§á‡§™ ‡§ï‡§∞‡•á‡§Ç!`;
    }

    if (query.includes('math') || query.includes('‡§ó‡§£‡§ø‡§§') || query.includes('reasoning') || query.includes('‡§∞‡•Ä‡§ú‡§®‡§ø‡§Ç‡§ó')) {
      return `### üìê ‡§ó‡§£‡§ø‡§§ ‡§è‡§µ‡§Ç ‡§∞‡•Ä‡§ú‡§®‡§ø‡§Ç‡§ó (Maths & Reasoning)\n\n` +
        `1. **‡§Ö‡§Ç‡§ï‡§ó‡§£‡§ø‡§§:** ‡§™‡•ç‡§∞‡§§‡§ø‡§∂‡§§ (Percentage), ‡§≤‡§æ‡§≠-‡§π‡§æ‡§®‡§ø, ‡§î‡§∏‡§§, SI/CI, ‡§∏‡§Æ‡§Ø ‡§µ ‡§ï‡§æ‡§∞‡•ç‡§Ø‡•§\n` +
        `2. **‡§è‡§°‡§µ‡§æ‡§Ç‡§∏ ‡§Æ‡•à‡§•‡•ç‡§∏:** ‡§¨‡•Ä‡§ú‡§ó‡§£‡§ø‡§§ (Algebra), ‡§ú‡•ç‡§Ø‡§æ‡§Æ‡§ø‡§§‡§ø (Geometry), ‡§§‡•ç‡§∞‡§ø‡§ï‡•ã‡§£‡§Æ‡§ø‡§§‡§ø‡•§\n` +
        `3. **‡§∞‡•Ä‡§ú‡§®‡§ø‡§Ç‡§ó:** ‡§ï‡•ã‡§°‡§ø‡§Ç‡§ó-‡§°‡§ø‡§ï‡•ã‡§°‡§ø‡§Ç‡§ó, ‡§∏‡§æ‡§¶‡•É‡§∂‡•ç‡§Ø‡§§‡§æ, ‡§¶‡§ø‡§∂‡§æ ‡§ú‡•ç‡§û‡§æ‡§®, ‡§¨‡•ç‡§≤‡§° ‡§∞‡§ø‡§≤‡•á‡§∂‡§Ç‡§∏‡•§\n\n` +
        `üëâ ‡§Ü‡§™ ‡§Ö‡§™‡§®‡§æ ‡§∏‡§µ‡§æ‡§≤ ‡§∏‡•Ä‡§ß‡•á ‡§≤‡§ø‡§ñ‡§ï‡§∞ ‡§™‡•Ç‡§õ ‡§∏‡§ï‡§§‡•á ‡§π‡•à‡§Ç!`;
    }

    if (query.includes('bihar') || query.includes('gk') || query.includes('ssc') || query.includes('upsc') || query.includes('cgl') || query.includes('chsl') || query.includes('board')) {
      return `### üéØ ‡§™‡•ç‡§∞‡§§‡§ø‡§Ø‡•ã‡§ó‡•Ä ‡§™‡§∞‡•Ä‡§ï‡•ç‡§∑‡§æ ‡§§‡•à‡§Ø‡§æ‡§∞‡•Ä (Exam Strategy)\n\n` +
        `**"${userQuery}"** ‡§π‡•á‡§§‡•Å HansAI ‡§Ö‡§ß‡•ç‡§Ø‡§Ø‡§® ‡§∞‡§£‡§®‡•Ä‡§§‡§ø:\n\n` +
        `1. **‡§∏‡§ø‡§≤‡•á‡§¨‡§∏ ‡§µ PYQ:** ‡§µ‡§ø‡§ó‡§§ 5 ‡§µ‡§∞‡•ç‡§∑‡•ã‡§Ç ‡§ï‡•á ‡§™‡•ç‡§∞‡§∂‡•ç‡§®‡•ã‡§Ç ‡§ï‡§æ ‡§ó‡§π‡§® ‡§µ‡§ø‡§∂‡•ç‡§≤‡•á‡§∑‡§£ ‡§ï‡§∞‡•á‡§Ç‡•§\n` +
        `2. **‡§¶‡•à‡§®‡§ø‡§ï ‡§∂‡•á‡§°‡•ç‡§Ø‡•Ç‡§≤:** GK/General Awareness, ‡§ó‡§£‡§ø‡§§, ‡§∞‡•Ä‡§ú‡§®‡§ø‡§Ç‡§ó ‡§µ ‡§≠‡§æ‡§∑‡§æ ‡§ï‡§æ ‡§∏‡§Ç‡§§‡•Å‡§≤‡§ø‡§§ ‡§∏‡§Æ‡§Ø ‡§¨‡§æ‡§Ç‡§ü‡•á‡§Ç‡•§\n` +
        `3. **‡§Æ‡•â‡§ï ‡§ü‡•á‡§∏‡•ç‡§ü:** ‡§∏‡§æ‡§™‡•ç‡§§‡§æ‡§π‡§ø‡§ï ‡§ü‡•á‡§∏‡•ç‡§ü ‡§π‡§≤ ‡§ï‡§∞‡•á‡§Ç ‡§µ ‡§ï‡§Æ‡§ú‡•ã‡§∞ ‡§ü‡•â‡§™‡§ø‡§ï‡•ç‡§∏ ‡§ï‡•ã ‡§§‡•Å‡§∞‡§Ç‡§§ ‡§∏‡•Å‡§ß‡§æ‡§∞‡•á‡§Ç‡•§\n\n` +
        `üëâ **Auto Chapter Quiz** ‡§Æ‡•á‡§Ç ‡§ú‡§æ‡§ï‡§∞ ‡§§‡•Å‡§∞‡§Ç‡§§ ‡§Æ‡•â‡§ï ‡§™‡•ç‡§∞‡•à‡§ï‡•ç‡§ü‡§ø‡§∏ ‡§ï‡§∞‡•á‡§Ç!`;
    }

    return lang === 'hindi'
      ? `### üìö ‡§π‡§Ç‡§∏-‡§è‡§Ü‡§à (HansAI) - ‡§µ‡§ø‡§∑‡§Ø ‡§Æ‡§æ‡§∞‡•ç‡§ó‡§¶‡§∞‡•ç‡§∂‡§®\n\n‡§Ü‡§™‡§ï‡•Ä ‡§ú‡§ø‡§ú‡•ç‡§û‡§æ‡§∏‡§æ **"${userQuery.slice(0, 70)}"** ‡§ï‡•á ‡§∏‡§Ç‡§¨‡§Ç‡§ß ‡§Æ‡•á‡§Ç ‡§∏‡§Ç‡§ï‡•ç‡§∑‡§ø‡§™‡•ç‡§§ ‡§Ö‡§ß‡•ç‡§Ø‡§Ø‡§® ‡§¨‡§ø‡§Ç‡§¶‡•Å:\n\n1. **‡§Æ‡•Å‡§ñ‡•ç‡§Ø ‡§Ö‡§µ‡§ß‡§æ‡§∞‡§£‡§æ (Core Concept):** ‡§™‡•ç‡§∞‡§§‡§ø‡§Ø‡•ã‡§ó‡•Ä ‡§è‡§µ‡§Ç ‡§¨‡•ã‡§∞‡•ç‡§° ‡§™‡§∞‡•Ä‡§ï‡•ç‡§∑‡§æ‡§ì‡§Ç (SSC, UPSC, Railway, State Exams) ‡§Æ‡•á‡§Ç ‡§á‡§∏ ‡§µ‡§ø‡§∑‡§Ø ‡§ï‡•Ä ‡§∏‡•ç‡§™‡§∑‡•ç‡§ü ‡§∏‡§Æ‡§ù ‡§Ö‡§§‡§ø ‡§Ü‡§µ‡§∂‡•ç‡§Ø‡§ï ‡§π‡•à‡•§\n2. **‡§∞‡§ø‡§µ‡•Ä‡§ú‡§® ‡§∞‡§£‡§®‡•Ä‡§§‡§ø:** ‡§Æ‡§π‡§§‡•ç‡§µ‡§™‡•Ç‡§∞‡•ç‡§£ ‡§∏‡•Ç‡§§‡•ç‡§∞‡•ã‡§Ç, ‡§§‡§ø‡§•‡§ø‡§Ø‡•ã‡§Ç ‡§µ ‡§™‡§∞‡§ø‡§≠‡§æ‡§∑‡§æ‡§ì‡§Ç ‡§ï‡•á ‡§∏‡§Ç‡§ï‡•ç‡§∑‡§ø‡§™‡•ç‡§§ ‡§®‡•ã‡§ü‡•ç‡§∏ ‡§¨‡§®‡§æ‡§ï‡§∞ ‡§™‡•Å‡§®‡§∞‡§æ‡§µ‡•É‡§§‡•ç‡§§‡§ø ‡§ï‡§∞‡•á‡§Ç‡•§\n3. **‡§≤‡§æ‡§á‡§µ ‡§ü‡•á‡§∏‡•ç‡§ü:** ‡§Ü‡§™ ‡§ê‡§™ ‡§ï‡•á **Auto Chapter Quiz** ‡§∏‡•á‡§ï‡•ç‡§∂‡§® ‡§Æ‡•á‡§Ç ‡§ú‡§æ‡§ï‡§∞ ‡§§‡•Å‡§∞‡§Ç‡§§ 5 ‡§™‡•ç‡§∞‡§∂‡•ç‡§®‡•ã‡§Ç ‡§ï‡§æ ‡§Ö‡§≠‡•ç‡§Ø‡§æ‡§∏ ‡§ï‡§∞ ‡§∏‡§ï‡§§‡•á ‡§π‡•à‡§Ç!`
      : `### üìö HansAI - Academic Solution & Guidance\n\nRegarding your query **"${userQuery.slice(0, 70)}"**:\n\n1. **Key Concept:** Clear understanding of this topic is essential for competitive & board exams.\n2. **Revision Strategy:** Create concise notes of key formulas, facts, and definitions.\n3. **Interactive Test:** Navigate to the **Auto Chapter Quiz** tab to solve custom MCQs on this topic!`;
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
          ? "‡§ö‡•à‡§ü ‡§π‡§ø‡§∏‡•ç‡§ü‡•ç‡§∞‡•Ä ‡§Æ‡•á‡§Ç ‡§∏‡•Å‡§∞‡§ï‡•ç‡§∑‡§ø‡§§ ‡§∏‡§π‡•á‡§ú ‡§ï‡§∞ ‡§®‡§Ø‡§æ ‡§ö‡•à‡§ü ‡§∂‡•Å‡§∞‡•Ç ‡§ï‡§ø‡§Ø‡§æ ‡§ó‡§Ø‡§æ! üí¨" 
          : "Chat saved to history & new chat opened! üí¨", 
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
          ? "‡§¶‡•à‡§®‡§ø‡§ï ‡§Æ‡•Å‡§´‡•ç‡§§ ‡§∏‡•Ä‡§Æ‡§æ (Daily Free Limit - 10 Queries) ‡§∏‡§Æ‡§æ‡§™‡•ç‡§§! ‡§ï‡§≤ ‡§∏‡•Å‡§¨‡§π ‡§®‡§à ‡§≤‡§ø‡§Æ‡§ø‡§ü ‡§∂‡•Å‡§∞‡•Ç ‡§π‡•ã‡§ó‡•Ä‡•§"
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
            ? "‡§Ö‡§∏‡•Ä‡§Æ‡§ø‡§§ AI ‡§∏‡§∞‡•ç‡§ö ‡§î‡§∞ ‡§ö‡•à‡§ü ‡§ú‡§æ‡§∞‡•Ä ‡§∞‡§ñ‡§®‡•á ‡§ï‡•á ‡§≤‡§ø‡§è ‡§ï‡•É‡§™‡§Ø‡§æ Google ‡§Ø‡§æ Facebook ‡§∏‡•á ‡§≤‡•â‡§ó‡§ø‡§®/‡§∞‡§ú‡§ø‡§∏‡•ç‡§ü‡§∞ ‡§ï‡§∞‡•á‡§Ç! üîê"
            : "Please Sign In with Google or Facebook to continue unlimited AI search! üîê",
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
      let offlineReply = "üì∂ **‡§Ü‡§™ ‡§µ‡§∞‡•ç‡§§‡§Æ‡§æ‡§® ‡§Æ‡•á‡§Ç ‡§ë‡§´-‡§≤‡§æ‡§á‡§® ‡§Æ‡•ã‡§° (Offline Mode) ‡§Æ‡•á‡§Ç ‡§π‡•à‡§Ç!**\n\n‡§ë‡§´‡§º‡§≤‡§æ‡§á‡§® ‡§Æ‡•ã‡§° ‡§Æ‡•á‡§Ç ‡§Ü‡§™‡§ï‡•á ‡§∏‡§≠‡•Ä ‡§™‡•Å‡§∞‡§æ‡§®‡•á ‡§∏‡§π‡•á‡§ú‡•á ‡§ó‡§è ‡§ö‡•à‡§ü, Pitman Shorthand ‡§ó‡§æ‡§á‡§°‡•ç‡§∏, ‡§∏‡•ç‡§ü‡§°‡•Ä ‡§®‡•ã‡§ü‡•ç‡§∏, ‡§ï‡•ç‡§µ‡§ø‡§ú‡§º ‡§∞‡§ø‡§ï‡•â‡§∞‡•ç‡§°‡•ç‡§∏ ‡§î‡§∞ ‡§ë‡§°‡§ø‡§Ø‡•ã ‡§∞‡§ø‡§ï‡•â‡§∞‡•ç‡§°‡§∞ 100% ‡§â‡§™‡§≤‡§¨‡•ç‡§ß ‡§π‡•à‡§Ç!";
      if (isCapabilityQuery) {
        offlineReply = `‚ú® **HansAI (‡§Ü‡§™‡§ï‡§æ ‡§è‡§Ü‡§à ‡§∏‡§æ‡§•‡•Ä) - ‡§∏‡§Ç‡§™‡•Ç‡§∞‡•ç‡§£ ‡§∏‡§π‡§æ‡§Ø‡§§‡§æ ‡§®‡§ø‡§∞‡•ç‡§¶‡•á‡§∂‡§ø‡§ï‡§æ:**\n\n` +
          `1. üéì **SSC CGL & ‡§™‡•ç‡§∞‡§§‡§ø‡§Ø‡•ã‡§ó‡•Ä ‡§™‡§∞‡•Ä‡§ï‡•ç‡§∑‡§æ ‡§§‡•à‡§Ø‡§æ‡§∞‡•Ä**: SSC CGL, Stenographer, State/UPSC ‡§ó‡§æ‡§á‡§°‡•á‡§Ç‡§∏, ‡§á‡§Ç‡§ó‡•ç‡§≤‡§ø‡§∂ ‡§ó‡•ç‡§∞‡§æ‡§Æ‡§∞ ‡§∞‡•Ç‡§≤‡•ç‡§∏ ‡§î‡§∞ GK ‡§ü‡•ç‡§∞‡§ø‡§ï‡•ç‡§∏‡•§\n` +
          `2. ‚úçÔ∏è **Pitman Shorthand & Dictation**: Shorthand ‡§∏‡•ç‡§ü‡•ç‡§∞‡•ã‡§ï ‡§∞‡•á‡§´‡§∞‡•á‡§Ç‡§∏, ‡§°‡§ø‡§ï‡•ç‡§ü‡•á‡§∂‡§® ‡§ü‡§æ‡§á‡§Æ‡§∞ ‡§î‡§∞ ‡§∏‡•ç‡§™‡•Ä‡§° ‡§™‡•ç‡§∞‡•à‡§ï‡•ç‡§ü‡§ø‡§∏‡•§\n` +
          `3. üöÄ **Deep Research AI**: ‡§µ‡§ø‡§∑‡§Ø ‡§™‡§∞ ‡§ó‡§π‡§∞‡§æ ‡§Ö‡§ß‡•ç‡§Ø‡§Ø‡§®, ‡§ü‡§æ‡§á‡§Æ‡§≤‡§æ‡§á‡§® ‡§î‡§∞ ‡§Ø‡§æ‡§¶ ‡§ï‡§∞‡§®‡•á ‡§ï‡•Ä ‡§ü‡•ç‡§∞‡§ø‡§ï‡•ç‡§∏‡•§\n` +
          `4. üß† **Interactive Live Quizzes**: ‡§§‡•Å‡§∞‡§Ç‡§§ 5 ‡§∏‡§µ‡§æ‡§≤‡•ã‡§Ç ‡§ï‡§æ ‡§ï‡•ç‡§µ‡§ø‡§ú ‡§ü‡•á‡§∏‡•ç‡§ü, ‡§∏‡•ç‡§ï‡•ã‡§∞ ‡§î‡§∞ ‡§µ‡•ç‡§Ø‡§æ‡§ñ‡•ç‡§Ø‡§æ‡•§\n` +
          `5. üéôÔ∏è **Projects & Voice Recorder**: ‡§≤‡•á‡§ï‡•ç‡§ö‡§∞‡•ç‡§∏/‡§®‡•ã‡§ü‡•ç‡§∏ ‡§ï‡•Ä ‡§µ‡•â‡§á‡§∏ ‡§∞‡§ø‡§ï‡•â‡§∞‡•ç‡§°‡§ø‡§Ç‡§ó ‡§î‡§∞ ‡§™‡•ç‡§∞‡•ã‡§ú‡•á‡§ï‡•ç‡§ü‡•ç‡§∏‡•§\n` +
          `6. üìñ **Study Notes & Folders**: ‡§®‡•ã‡§ü‡•ç‡§∏ ‡§∏‡§π‡•á‡§ú‡§®‡§æ, ‡§ñ‡•ã‡§ú‡§®‡§æ ‡§î‡§∞ ‡§∏‡•ç‡§Æ‡§æ‡§∞‡•ç‡§ü ‡§´‡•ã‡§≤‡•ç‡§°‡§∞‡•ç‡§∏‡•§\n` +
          `7. üó∫Ô∏è **GIS & Map Visualizer**: ‡§á‡§Ç‡§ü‡§∞‡§è‡§ï‡•ç‡§ü‡§ø‡§µ ‡§≠‡•Ç‡§ó‡•ã‡§≤ ‡§Æ‡§æ‡§®‡§ö‡§ø‡§§‡•ç‡§∞ ‡§î‡§∞ ‡§Æ‡•à‡§™‡§ø‡§Ç‡§ó‡•§\n` +
          `8. ‚òï **Daily Motivation & Status**: ‡§∏‡•Å‡§¨‡§π ‡§ï‡•Ä ‡§ï‡§µ‡§ø‡§§‡§æ‡§è‡§Ç ‡§î‡§∞ ‡§Æ‡•ã‡§ü‡§ø‡§µ‡•á‡§∂‡§®‡•§\n` +
          `9. üì∂ **100% Offline Capability**: ‡§®‡•á‡§ü‡§µ‡§∞‡•ç‡§ï ‡§® ‡§π‡•ã‡§®‡•á ‡§™‡§∞ ‡§≠‡•Ä ‡§∏‡§≠‡•Ä ‡§∏‡§π‡•á‡§ú‡•á ‡§ó‡§è ‡§®‡•ã‡§ü‡•ç‡§∏ ‡§µ ‡§ü‡•Ç‡§≤‡•ç‡§∏ ‡§ö‡§≤‡§§‡•á ‡§π‡•à‡§Ç!`;
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
      
      const isGreeting = query.includes('hello') || query.includes('hi ') || query.includes('hey') || query.includes('namaste') || query.includes('‡§®‡§Æ‡§∏‡•ç‡§§‡•á') || query.includes('‡§™‡•ç‡§∞‡§£‡§æ‡§Æ') || query.trim() === 'hi';
      const isCreatorQuery = query.includes('creator') || query.includes('founder') || query.includes('who made') || query.includes('who built') || query.includes('who created') || query.includes('hanslal') || query.includes('pal ji') || query.includes('‡§™‡§æ‡§≤ ‡§ú‡•Ä') || query.includes('‡§®‡§ø‡§∞‡•ç‡§Æ‡§æ‡§§‡§æ') || query.includes('maker');
      const isNotUnderstanding = query.includes('understand') || query.includes('‡§∏‡§Æ‡§ù ‡§®‡§π‡•Ä‡§Ç') || query.includes('‡§®‡§π‡•Ä‡§Ç ‡§∏‡§Æ‡§ù‡§æ') || query.includes('‡§´‡§ø‡§∞ ‡§∏‡•á') || query.includes('easy') || query.includes('‡§∏‡§∞‡§≤');

      if (isCapabilityQuery) {
        customReply = `‚ú® **HansAI (‡§Ü‡§™‡§ï‡§æ ‡§è‡§Ü‡§à ‡§∏‡§æ‡§•‡•Ä) - ‡§∏‡§Ç‡§™‡•Ç‡§∞‡•ç‡§£ ‡§∏‡§π‡§æ‡§Ø‡§§‡§æ ‡§®‡§ø‡§∞‡•ç‡§¶‡•á‡§∂‡§ø‡§ï‡§æ:**\n\n` +
          `1. üéì **SSC, Board & Competitive Exams**: SSC CGL/CHSL, Railway, State PCS/UPSC, ‡§≠‡•Ç‡§ó‡•ã‡§≤, ‡§á‡§§‡§ø‡§π‡§æ‡§∏, ‡§∏‡§Ç‡§µ‡§ø‡§ß‡§æ‡§®, ‡§µ‡§ø‡§ú‡•ç‡§û‡§æ‡§®, ‡§ó‡§£‡§ø‡§§, ‡§∞‡•Ä‡§ú‡§®‡§ø‡§Ç‡§ó ‡§µ ‡§Ö‡§Ç‡§ó‡•ç‡§∞‡•á‡§ú‡•Ä‡•§\n` +
          `2. ‚úçÔ∏è **Shorthand & Dictation Tools**: Shorthand ‡§∏‡•ç‡§ü‡•ç‡§∞‡•ã‡§ï ‡§∞‡•á‡§´‡§∞‡•á‡§Ç‡§∏, ‡§°‡§ø‡§ï‡•ç‡§ü‡•á‡§∂‡§® ‡§ü‡§æ‡§á‡§Æ‡§∞ ‡§î‡§∞ ‡§∏‡•ç‡§™‡•Ä‡§° ‡§™‡•ç‡§∞‡•à‡§ï‡•ç‡§ü‡§ø‡§∏‡•§\n` +
          `3. üöÄ **Deep Research AI**: ‡§µ‡§ø‡§∑‡§Ø ‡§™‡§∞ ‡§ó‡§π‡§∞‡§æ ‡§Ö‡§ß‡•ç‡§Ø‡§Ø‡§®, ‡§ü‡§æ‡§á‡§Æ‡§≤‡§æ‡§á‡§® ‡§î‡§∞ ‡§Ø‡§æ‡§¶ ‡§ï‡§∞‡§®‡•á ‡§ï‡•Ä ‡§ü‡•ç‡§∞‡§ø‡§ï‡•ç‡§∏‡•§\n` +
          `4. üß† **Interactive Live Quizzes**: ‡§§‡•Å‡§∞‡§Ç‡§§ 5 ‡§∏‡§µ‡§æ‡§≤‡•ã‡§Ç ‡§ï‡§æ ‡§ï‡•ç‡§µ‡§ø‡§ú ‡§ü‡•á‡§∏‡•ç‡§ü, ‡§∏‡•ç‡§ï‡•ã‡§∞ ‡§î‡§∞ ‡§µ‡•ç‡§Ø‡§æ‡§ñ‡•ç‡§Ø‡§æ‡•§\n` +
          `5. üéôÔ∏è **Projects & Voice Recorder**: ‡§≤‡•á‡§ï‡•ç‡§ö‡§∞‡•ç‡§∏/‡§®‡•ã‡§ü‡•ç‡§∏ ‡§ï‡•Ä ‡§µ‡•â‡§á‡§∏ ‡§∞‡§ø‡§ï‡•â‡§∞‡•ç‡§°‡§ø‡§Ç‡§ó ‡§î‡§∞ ‡§™‡•ç‡§∞‡•ã‡§ú‡•á‡§ï‡•ç‡§ü‡•ç‡§∏‡•§\n` +
          `6. üìñ **Study Notes & Folders**: ‡§®‡•ã‡§ü‡•ç‡§∏ ‡§∏‡§π‡•á‡§ú‡§®‡§æ, ‡§ñ‡•ã‡§ú‡§®‡§æ ‡§î‡§∞ ‡§∏‡•ç‡§Æ‡§æ‡§∞‡•ç‡§ü ‡§´‡•ã‡§≤‡•ç‡§°‡§∞‡•ç‡§∏‡•§\n` +
          `7. üó∫Ô∏è **GIS & Map Visualizer**: ‡§á‡§Ç‡§ü‡§∞‡§è‡§ï‡•ç‡§ü‡§ø‡§µ ‡§≠‡•Ç‡§ó‡•ã‡§≤ ‡§Æ‡§æ‡§®‡§ö‡§ø‡§§‡•ç‡§∞ ‡§î‡§∞ ‡§Æ‡•à‡§™‡§ø‡§Ç‡§ó‡•§\n` +
          `8. ‚òï **Daily Motivation & Status**: ‡§∏‡•Å‡§¨‡§π ‡§ï‡•Ä ‡§ï‡§µ‡§ø‡§§‡§æ‡§è‡§Ç ‡§î‡§∞ ‡§Æ‡•ã‡§ü‡§ø‡§µ‡•á‡§∂‡§®‡•§\n` +
          `9. üì∂ **Offline Availability**: ‡§¨‡§ø‡§®‡§æ ‡§á‡§Ç‡§ü‡§∞‡§®‡•á‡§ü ‡§ï‡•á ‡§≠‡•Ä ‡§∏‡§≠‡•Ä ‡§∏‡•á‡§µ ‡§ï‡§ø‡§è ‡§ó‡§è ‡§®‡•ã‡§ü‡•ç‡§∏ ‡§µ ‡§ü‡•Ç‡§≤‡•ç‡§∏ ‡§ï‡§æ‡§Æ ‡§ï‡§∞‡§§‡•á ‡§π‡•à‡§Ç!`;
      } else if (isCreatorQuery) {
        customReply = `HansAI ‡§ï‡•á creator ‡§î‡§∞ founder Hanslal ‡§π‡•à‡§Ç‡•§ HansAI ‡§ï‡•ã Hanslal ‡§®‡•á ‡§è‡§ï student-focused AI platform ‡§ï‡•á ‡§∞‡•Ç‡§™ ‡§Æ‡•á‡§Ç ‡§¨‡§®‡§æ‡§Ø‡§æ ‡§î‡§∞ ‡§µ‡§ø‡§ï‡§∏‡§ø‡§§ ‡§ï‡§ø‡§Ø‡§æ ‡§π‡•à‡•§`;
      } else if (isGreeting) {
        if (language === 'hindi') {
          customReply = `‡§®‡§Æ‡§∏‡•ç‡§§‡•á! ‡§Æ‡•à‡§Ç ‡§Ü‡§™‡§ï‡§æ ‡§è‡§Ü‡§à ‡§∏‡§æ‡§•‡•Ä (HansAI) ‡§π‡•Ç‡§Å‡•§ ‡§Ü‡§ú ‡§Æ‡•à‡§Ç ‡§Ü‡§™‡§ï‡•Ä ‡§™‡•ù‡§æ‡§à, ‡§≠‡•Ç‡§ó‡•ã‡§≤, ‡§á‡§§‡§ø‡§π‡§æ‡§∏, ‡§µ‡§ø‡§ú‡•ç‡§û‡§æ‡§® ‡§Ø‡§æ ‡§ï‡§ø‡§∏‡•Ä ‡§≠‡•Ä ‡§™‡§∞‡•Ä‡§ï‡•ç‡§∑‡§æ ‡§ï‡•Ä ‡§§‡•à‡§Ø‡§æ‡§∞‡•Ä ‡§Æ‡•á‡§Ç ‡§ï‡§ø‡§∏ ‡§™‡•ç‡§∞‡§ï‡§æ‡§∞ ‡§∏‡§π‡§æ‡§Ø‡§§‡§æ ‡§ï‡§∞ ‡§∏‡§ï‡§§‡§æ ‡§π‡•Ç‡§Å?`;
        } else {
          customReply = `Hello! I am your AI Companion (HansAI). How can I assist you with Geography, History, Science, Maths, or competitive exam preparation today?`;
        }
      } else if (isNotUnderstanding) {
        customReply = `### üí° ‡§Ü‡§∏‡§æ‡§® ‡§∞‡•Ç‡§™ (Simplified Explanation):\n\n\`\`\`\n  [‡§Æ‡•Ç‡§≤ ‡§∏‡§ø‡§¶‡•ç‡§ß‡§æ‡§Ç‡§§ / Core Concept]\n         ‚îÇ\n         ‚îú‚îÄ‚îÄ‚û§ [‡§®‡§ø‡§Ø‡§Æ / Formula/Rule]\n         ‚îÇ      ‚îî‚îÄ‚îÄ‚û§ ‡§Ö‡§®‡•Å‡§™‡•ç‡§∞‡§Ø‡•ã‡§ó (Exam Questions Application)\n         ‚îî‚îÄ‚îÄ‚û§ [‡§∏‡•ç‡§Æ‡§∞‡§£ ‡§ü‡•ç‡§∞‡§ø‡§ï / Memorization Hack]\n\`\`\``;
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
      showToast("HansAI Local Response Activated ‚úÖ", "success");

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
                <span className="text-lg">‚ö°</span>
                <h1 className="text-2xl sm:text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 via-amber-200 to-emerald-300 drop-shadow-md">
                  HansAI ‚Ä¢ ‡§π‡§Ç‡§∏-‡§è‡§Ü‡§à
                </h1>
                <span className="text-lg">‚ö°</span>
              </div>
              <p className="text-xs text-amber-300 font-bold tracking-wide">
                Universal Intelligence Platform ‚Ä¢ HansAI Academic Companion
              </p>
              <div className="p-2 bg-indigo-950/70 border border-indigo-500/30 rounded-xl text-[11px] text-indigo-200 font-sans italic shadow-sm">
                "‡§ú‡•ç‡§û‡§æ‡§®‡§Æ‡•ç ‡§™‡§∞‡§Æ‡§Æ‡•ç ‡§¨‡§≤‡§Æ‡•ç ‚Ä¢ ‡§π‡§Ç‡§∏-‡§ú‡•ç‡§û‡§æ‡§®, ‡§Ö‡§®‡•Å‡§∂‡§æ‡§∏‡§® ‡§è‡§µ‡§Ç ‡§®‡§ø‡§∞‡§Ç‡§§‡§∞ ‡§™‡•ç‡§∞‡§ó‡§§‡§ø"
              </div>
            </div>

            {/* Live Activity Counters Badge */}
            <div className="px-3 py-1 bg-slate-900/90 border border-cyan-500/30 rounded-full flex items-center gap-1.5 text-[11px] font-semibold text-cyan-300 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>üü¢ 1,420 Online ‚Ä¢ HansAI Active</span>
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
            <span>‚öôÔ∏è</span>
            <span className="text-xs font-bold">Options</span>
            <span className="text-[10px] text-indigo-300">‚ñº</span>
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
                <span>‚öôÔ∏è</span>
                <span>HansAI Settings & Tools</span>
              </h3>
              <button 
                onClick={() => setIsHeaderMenuOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-bold p-1 px-2 rounded-lg hover:bg-slate-800 transition-colors"
                title="Close settings"
              >
                ‚úï
              </button>
            </div>

          {/* 4 Theme Color Selectors (As Requested by User) */}
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider block">üé® Select Screen Theme (4 Color Modes):</span>
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
                <span>üåô</span>
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
                <span>‚òÄÔ∏è</span>
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
                <span>üåø</span>
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
                <span>üíé</span>
                <div>
                  <div className="text-[11px]">Cyber Blue</div>
                  <div className="text-[9px] text-cyan-200">High-Tech Neon</div>
                </div>
              </button>
            </div>
          </div>

          {/* SYSTEM LANGUAGE TOGGLE (HINDI / ENGLISH) */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider block">üåê {language === 'hindi' ? '‡§∏‡§ø‡§∏‡•ç‡§ü‡§Æ ‡§≠‡§æ‡§∑‡§æ (System Language):' : 'System Language:'}</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => {
                  setLanguage('hindi');
                  localStorage.setItem('hansai-language', 'hindi');
                  showToast("‡§≠‡§æ‡§∑‡§æ: ‡§π‡§ø‡§Ç‡§¶‡•Ä (Hindi Active) üáÆüá≥", "success");
                }}
                className={`p-2 rounded-xl border text-center font-bold cursor-pointer transition-all ${
                  language === 'hindi' ? 'bg-indigo-600 text-white border-indigo-400 shadow-md' : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                üáÆüá≥ ‡§π‡§ø‡§Ç‡§¶‡•Ä (Hindi)
              </button>
              <button
                onClick={() => {
                  setLanguage('english');
                  localStorage.setItem('hansai-language', 'english');
                  showToast("Language: English Active üá¨üáß", "success");
                }}
                className={`p-2 rounded-xl border text-center font-bold cursor-pointer transition-all ${
                  language === 'english' ? 'bg-indigo-600 text-white border-indigo-400 shadow-md' : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                üá¨üáß English
              </button>
            </div>
          </div>

          {/* üîä VOICE & DISPLAY SETTINGS */}
          <div className="space-y-2 pt-2 border-t border-slate-800 text-xs font-bold">
            <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider block">
              üîä {language === 'hindi' ? '‡§µ‡•â‡§Ø‡§∏ ‡§è‡§µ‡§Ç ‡§°‡§ø‡§∏‡•ç‡§™‡•ç‡§≤‡•á ‡§∏‡•á‡§ü‡§ø‡§Ç‡§ó‡•ç‡§∏:' : 'Voice & Display Settings:'}
            </span>

            {/* Auto Voice Response Toggle */}
            <div className="p-2.5 bg-slate-900/90 border border-indigo-500/30 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <div className="text-left">
                  <div className="text-[11px] text-white font-bold">{language === 'hindi' ? '‡§ë‡§ü‡•ã ‡§µ‡•â‡§Ø‡§∏ ‡§â‡§§‡•ç‡§§‡§∞ (Auto Voice)' : 'Auto Voice Readout'}</div>
                  <div className="text-[9px] text-slate-400">{language === 'hindi' ? '‡§µ‡•â‡§Ø‡§∏ ‡§ö‡•à‡§ü ‡§™‡§∞ ‡§∏‡•ç‡§µ‡§§‡§É ‡§¨‡•ã‡§≤‡§ï‡§∞ ‡§ú‡§µ‡§æ‡§¨ ‡§¶‡•á‡§ó‡§æ' : 'Auto-speaks without opening page'}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const nextVal = !autoVoiceReadout;
                  setAutoVoiceReadout(nextVal);
                  localStorage.setItem('hansai-auto-voice', String(nextVal));
                  showToast(nextVal ? 'üîä Auto Voice Response Enabled! (‡§¨‡•ã‡§≤‡§ï‡§∞ ‡§ú‡§µ‡§æ‡§¨ ‡§¶‡•á‡§ó‡§æ)' : 'üîá Auto Voice Disabled.', 'info');
                }}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                  autoVoiceReadout 
                    ? 'bg-indigo-600 text-white border-indigo-400' 
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {autoVoiceReadout ? 'ON üîä' : 'OFF üîá'}
              </button>
            </div>

            {/* Multi-lingual Indian Voice Locale Selection */}
            <div className="p-2.5 bg-slate-900/90 border border-indigo-500/30 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-300 font-bold">üáÆüá≥ {language === 'hindi' ? '‡§≠‡§æ‡§∞‡§§‡•Ä‡§Ø ‡§µ‡•â‡§Ø‡§∏ ‡§≠‡§æ‡§∑‡§æ (Indian State Voice):' : 'Indian Voice Accent:'}</span>
                <span className="text-[9px] text-cyan-400 font-mono font-bold">{selectedIndianVoiceLang}</span>
              </div>
              <select
                value={selectedIndianVoiceLang}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedIndianVoiceLang(val);
                  localStorage.setItem('hansai-voice-lang', val);
                  showToast(`üáÆüá≥ Voice set to ${val}`, 'success');
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
                <span className="text-[10px] text-slate-300 font-bold">üî† {language === 'hindi' ? '‡§ö‡•à‡§ü ‡§´‡•â‡§®‡•ç‡§ü ‡§Ü‡§ï‡§æ‡§∞ (Font Size):' : 'Chat Font Size:'}</span>
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

          {/* üõ†Ô∏è TOOLS, ROADMAP & FEEDBACK */}
          <div className="space-y-2 pt-2 border-t border-slate-800 text-xs font-bold">
            <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider block">
              üõ†Ô∏è {language === 'hindi' ? '‡§ü‡•Ç‡§≤‡•ç‡§∏, ‡§´‡•Ä‡§°‡§¨‡•à‡§ï ‡§µ ‡§∏‡§π‡§æ‡§Ø‡§§‡§æ:' : 'Tools, Feedback & Help:'}
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
                <span className="font-bold">{language === 'hindi' ? '‚≠ê 5-‡§∏‡•ç‡§ü‡§æ‡§∞ ‡§´‡•Ä‡§°‡§¨‡•à‡§ï ‡§µ ‡§∏‡•Å‡§ù‡§æ‡§µ ‡§¶‡•á‡§Ç' : '‚≠ê 5-Star Feedback & Suggestions'}</span>
              </div>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-mono">
                Review ‚≠ê
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
                <span className="font-bold">{language === 'hindi' ? 'üöÄ ‡§Ü‡§ó‡§æ‡§Æ‡•Ä ‡§Ø‡•ã‡§ú‡§®‡§æ‡§è‡§Ç (Speed Reply / QR)' : 'üöÄ Upcoming Features & Roadmap'}</span>
              </div>
              <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-1.5 py-0.5 rounded font-mono">
                Plans üöÄ
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
                <span className="font-bold">{language === 'hindi' ? 'ü§ñ A8 AI ‡§∏‡§π‡§æ‡§Ø‡§§‡§æ ‡§ö‡•à‡§ü ‡§∏‡§ø‡§∏‡•ç‡§ü‡§Æ' : 'ü§ñ A8 AI Help & Chat Assistant'}</span>
              </div>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-mono">
                A8 Chat ‚ú®
              </span>
            </button>

            {/* üîç HansAI Auto-Problem Diagnostics & Owner Alert */}
            <button
              onClick={() => {
                setIsDiagnosticsModalOpen(true);
                setIsHeaderMenuOpen(false);
              }}
              className="w-full p-2.5 bg-gradient-to-r from-emerald-950/80 to-teal-950/80 hover:from-emerald-900 hover:to-teal-900 border border-emerald-500/50 rounded-xl text-emerald-200 flex items-center justify-between transition-all cursor-pointer text-left"
            >
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400 shrink-0 animate-pulse" />
                <span className="font-bold">{language === 'hindi' ? 'üîç ‡§ë‡§ü‡•ã ‡§™‡•ç‡§∞‡•â‡§¨‡•ç‡§≤‡§Æ ‡§∏‡•ç‡§ï‡•à‡§®‡§∞ ‡§µ ‡§à‡§Æ‡•á‡§≤ ‡§∞‡§ø‡§™‡•ã‡§∞‡•ç‡§ü' : 'üîç Auto Problem Diagnostics'}</span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded font-mono">
                Auto Scan ‚ö°
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
                <span>{language === 'hindi' ? '‚öñÔ∏è ‡§™‡§¨‡•ç‡§≤‡§ø‡§ï AI ‡§â‡§™‡§Ø‡•ã‡§ó ‡§®‡§ø‡§Ø‡§Æ ‡§µ ‡§®‡§ø‡§∞‡•ç‡§¶‡•á‡§∂' : '‚öñÔ∏è Public AI Usage Rules & Guidelines'}</span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded font-mono">
                Rules üõ°Ô∏è
              </span>
            </button>

            {/* App Share Button */}
            <button
              onClick={() => { setIsShareModalOpen(true); setIsHeaderMenuOpen(false); }}
              className="w-full p-2.5 bg-slate-900 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/40 rounded-xl text-cyan-300 flex items-center justify-between transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-cyan-300 shrink-0" />
                <span>{language === 'hindi' ? '‡§ê‡§™ ‡§¶‡•ã‡§∏‡•ç‡§§‡•ã‡§Ç ‡§ï‡•á ‡§∏‡§æ‡§• ‡§∂‡•á‡§Ø‡§∞ ‡§ï‡§∞‡•á‡§Ç' : 'Share HansAI App'}</span>
              </div>
              <span className="text-[10px] opacity-70">Share ‚Üí</span>
            </button>

            {/* Professional Admin Console (If Admin) */}
            {isAdmin && (
              <button
                onClick={() => { handleOpenOwnerDashboard(); setIsHeaderMenuOpen(false); }}
                className="w-full p-2.5 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/40 rounded-xl text-amber-300 flex items-center justify-between transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{language === 'hindi' ? '‡§ì‡§®‡§∞ ‡§è‡§°‡§Æ‡§ø‡§® ‡§ï‡§Ç‡§∏‡•ã‡§≤' : 'Owner Admin Console'}</span>
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
                  showToast(language === 'hindi' ? "‡§∏‡§´‡§≤‡§§‡§æ‡§™‡•Ç‡§∞‡•ç‡§µ‡§ï ‡§≤‡•â‡§ó‡§Ü‡§â‡§ü ‡§ï‡§ø‡§Ø‡§æ ‡§ó‡§Ø‡§æ! üëã" : "Successfully Logged Out! üëã", "info");
                  setActiveView('chat');
                }}
                className="w-full p-2.5 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 rounded-xl text-rose-300 flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-2">
                  <span>üö™</span>
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
            <span>‚ö†Ô∏è</span>
            <span>
              <strong>{language === 'hindi' ? '‚ö†Ô∏è ‡§á‡§Ç‡§ü‡§∞‡§®‡•á‡§ü ‡§ï‡§®‡•á‡§ï‡•ç‡§∂‡§® ‡§®‡§π‡•Ä‡§Ç ‡§π‡•à (Offline Mode):' : '‚ö†Ô∏è No Internet Connection (Offline Mode):'}</strong> {language === 'hindi' ? '‡§è‡§Ü‡§à ‡§ö‡•à‡§ü (Gemini AI), ‡§ï‡•ç‡§≤‡§æ‡§â‡§° ‡§∏‡§ø‡§Ç‡§ï ‡§î‡§∞ ‡§≤‡§æ‡§á‡§µ ‡§´‡•Ä‡§ö‡§∞‡•ç‡§∏ ‡§ï‡•á ‡§≤‡§ø‡§è ‡§á‡§Ç‡§ü‡§∞‡§®‡•á‡§ü ‡§Ü‡§µ‡§∂‡•ç‡§Ø‡§ï ‡§π‡•à‡•§ ‡§∏‡§π‡•á‡§ú‡•á ‡§ó‡§è ‡§∏‡•ç‡§•‡§æ‡§®‡•Ä‡§Ø ‡§®‡•ã‡§ü‡•ç‡§∏ ‡§î‡§∞ ‡§∏‡•ç‡§ü‡•á‡§®‡•ã ‡§ü‡•Ç‡§≤‡•ç‡§∏ ‡§â‡§™‡§≤‡§¨‡•ç‡§ß ‡§π‡•à‡§Ç‡•§' : 'AI chat (Gemini AI), cloud sync, and live features require internet. Saved local notes and steno tools are available.'}
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
                ‚úï
              </button>

              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto text-2xl shadow-lg shadow-indigo-600/10">
                  üëã
                </div>
                <h3 className="text-lg font-extrabold text-white">
                  {language === 'hindi' ? 'HansAI ‡§Æ‡•á‡§Ç ‡§Ü‡§™‡§ï‡§æ ‡§∏‡•ç‡§µ‡§æ‡§ó‡§§ ‡§π‡•à!' : 'Welcome to HansAI'}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {language === 'hindi' ? '‡§ï‡•É‡§™‡§Ø‡§æ ‡§™‡•ç‡§∞‡§Ø‡•ã‡§ó ‡§∂‡•Å‡§∞‡•Ç ‡§ï‡§∞‡§®‡•á ‡§∏‡•á ‡§™‡§π‡§≤‡•á ‡§Ö‡§™‡§®‡§æ ‡§®‡§æ‡§Æ ‡§î‡§∞ ‡§à‡§Æ‡•á‡§≤ ‡§¶‡§∞‡•ç‡§ú ‡§ï‡§∞‡•á‡§Ç:' : 'Please enter your Name and Email to start:'}
                </p>
              </div>

              <form onSubmit={handleUserRegistrationSubmit} className="space-y-4 text-xs font-semibold">
                <div className="space-y-1.5">
                  <label className="text-slate-300 block">{language === 'hindi' ? '‡§Ü‡§™‡§ï‡§æ ‡§™‡•Ç‡§∞‡§æ ‡§®‡§æ‡§Æ:' : 'Full Name:'}</label>
                  <input
                    type="text"
                    required
                    value={registerFormName}
                    onChange={(e) => setRegisterFormName(e.target.value)}
                    placeholder={language === 'hindi' ? "‡§â‡§¶‡§æ. ‡§Ü‡§™‡§ï‡§æ ‡§®‡§æ‡§Æ" : "Enter Your Name"}
                    className="w-full px-3.5 py-2.5 bg-[#060913] border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 block">{language === 'hindi' ? '‡§Ü‡§™‡§ï‡§æ ‡§à‡§Æ‡•á‡§≤ ‡§Ü‡§à‡§°‡•Ä:' : 'Email Address:'}</label>
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
                    ? (language === 'hindi' ? "‡§∞‡§ú‡§ø‡§∏‡•ç‡§ü‡§∞ ‡§π‡•ã ‡§∞‡§π‡§æ ‡§π‡•à..." : "Registering...") 
                    : (language === 'hindi' ? "‡§∏‡•Å‡§∞‡§ï‡•ç‡§∑‡§ø‡§§ ‡§™‡•ç‡§∞‡§µ‡•á‡§∂ ‡§ï‡§∞‡•á‡§Ç" : "Continue to HansAI")}
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
                title={language === 'hindi' ? '‡§Æ‡•Å‡§ñ‡•ç‡§Ø ‡§ö‡•à‡§ü ‡§™‡§∞ ‡§ú‡§æ‡§è‡§Å' : 'Back to Chat'}
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
                      <span>{language === 'hindi' ? "‡§π‡§Ç‡§∏ ‡§ï‡§Ç‡§™‡•ç‡§≤‡•á‡§® ‡§´‡•Ä‡§ö‡§∞‡•ç‡§∏ ‡§è‡§®‡§ø‡§Æ‡•á‡§ü‡•á‡§° ‡§ü‡•Ç‡§∞ ‚ú®" : "Hans Compain Features Tour ‚ú®"}</span>
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
                      <span>{language === 'hindi' ? "+ ‡§®‡§Ø‡§æ ‡§ö‡•à‡§ü ‡§∂‡•Å‡§∞‡•Ç ‡§ï‡§∞‡•á‡§Ç" : "+ New Chat"}</span>
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
                      <span className="text-sm">‚öñÔ∏è</span>
                      <span className="truncate">{language === 'hindi' ? "‡§™‡§¨‡•ç‡§≤‡§ø‡§ï AI ‡§®‡§ø‡§Ø‡§Æ ‡§µ ‡§ó‡§æ‡§á‡§°‡§≤‡§æ‡§á‡§®‡•ç‡§∏" : "AI Public Rules & Guidelines"}</span>
                    </div>
                    <span className="text-[8px] bg-amber-500/30 text-amber-200 px-1.5 py-0.5 rounded font-black uppercase">Rules</span>
                  </button>

                  {/* Sidebar Search Bar */}
                  <div className="relative">
                    <input
                      type="text"
                      value={sidebarSearchQuery}
                      onChange={(e) => setSidebarSearchQuery(e.target.value)}
                      placeholder={language === 'hindi' ? "‡§ö‡•à‡§ü‡•ç‡§∏ ‡§è‡§µ‡§Ç ‡§µ‡§ø‡§∑‡§Ø ‡§ñ‡•ã‡§ú‡•á‡§Ç..." : "Search chats, topics..."}
                      className="w-full text-xs py-2 pl-8 pr-3 bg-[#0B0F1B] border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                    {sidebarSearchQuery && (
                      <button
                        onClick={() => setSidebarSearchQuery('')}
                        className="absolute right-2.5 top-2 text-slate-500 hover:text-white text-xs"
                      >
                        √ó
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
                        <span>{language === 'hindi' ? "‡§ö‡•à‡§ü ‡§á‡§§‡§ø‡§π‡§æ‡§∏" : "History"}</span>
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setIsChatHistoryModalOpen(true)}
                          className="text-[9px] text-indigo-400 hover:text-indigo-200 font-bold bg-indigo-500/15 hover:bg-indigo-500/30 px-1.5 py-0.5 rounded border border-indigo-500/30 cursor-pointer transition-all"
                          title="Open Full History Modal"
                        >
                          {language === 'hindi' ? "‡§™‡•Ç‡§∞‡§æ ‡§¶‡•á‡§ñ‡•á‡§Ç ‚Üó" : "Full View ‚Üó"}
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
                          ? (language === 'hindi' ? "‡§ï‡•ã‡§à ‡§∏‡§π‡•á‡§ú‡•Ä ‡§ó‡§à ‡§ö‡•à‡§ü ‡§®‡§π‡•Ä‡§Ç ‡§π‡•à‡•§ ‡§®‡§Ø‡§æ ‡§∏‡§µ‡§æ‡§≤ ‡§™‡•Ç‡§õ‡•á‡§Ç!" : "No chat history yet. Ask a question to start!") 
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
                                              ‚úì
                                            </button>
                                            <button
                                              onClick={() => setEditingChatId(null)}
                                              className="p-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded text-[10px] cursor-pointer"
                                              title="Cancel"
                                            >
                                              ‚úï
                                            </button>
                                          </div>
                                        ) : (
                                          <>
                                            <div className="flex-1 text-[11px] font-semibold truncate flex items-center gap-1.5 pr-1">
                                              <MessageSquare className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-indigo-300' : 'text-slate-400 group-hover:text-indigo-400'}`} />
                                              <span className="truncate">{sess.title || 'Chat Session'}</span>
                                              {sess.isPinned && (
                                                <span className="text-[10px] text-amber-400 ml-1">üìå</span>
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
                                                üìå
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
                                                ‚úèÔ∏è
                                              </button>

                                              {/* Delete button */}
                                              <button
                                                onClick={() => deleteSavedChat(sess.id)}
                                                className="p-1 text-slate-500 hover:text-rose-400 text-xs bg-transparent border-none cursor-pointer"
                                                title="Delete Chat"
                                              >
                                                üóëÔ∏è
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
                              {renderChatGroup(language === 'hindi' ? "üìå ‡§™‡§ø‡§® ‡§ï‡§ø‡§è ‡§ó‡§è" : "üìå Pinned", pinned)}
                              {renderChatGroup(language === 'hindi' ? "‡§Ü‡§ú (Today)" : "Today", today)}
                              {renderChatGroup(language === 'hindi' ? "‡§ï‡§≤ (Yesterday)" : "Yesterday", yesterday)}
                              {renderChatGroup(language === 'hindi' ? "‡§™‡§ø‡§õ‡§≤‡•á 7 ‡§¶‡§ø‡§® (Previous 7 Days)" : "Previous 7 Days", last7Days)}
                              {renderChatGroup(language === 'hindi' ? "‡§™‡•Å‡§∞‡§æ‡§®‡•á ‡§ö‡•à‡§ü (Older)" : "Older", older)}
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>

                  {/* Quick Tools & Modes */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-850">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1 block">
                      {language === 'hindi' ? "‡§µ‡§ø‡§∂‡•á‡§∑‡§ú‡•ç‡§û AI ‡§ü‡•Ç‡§≤‡•ç‡§∏" : "Specialized AI Hub"}
                    </span>
                    <div className="space-y-1 text-xs font-semibold">
                      {/* PROMINENT ALL STENOGRAPHER SHORTCUT BUTTON */}
                      <button
                        onClick={() => { setActiveView('steno'); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                        className="w-full flex items-center justify-between gap-2 p-2.5 rounded-xl text-sky-200 hover:text-white hover:bg-gradient-to-r hover:from-sky-900/60 hover:to-cyan-900/60 transition-all text-left bg-gradient-to-r from-sky-950/80 to-cyan-950/80 border-2 border-cyan-400/50 cursor-pointer font-black shadow-lg shadow-cyan-950/60"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-base shrink-0">‚úçÔ∏è</span>
                          <span className="truncate font-black text-sky-300">
                            {language === 'hindi' ? 'All Stenographer ‚Ä¢ ‡§∏‡§Æ‡•ç‡§™‡•Ç‡§∞‡•ç‡§£ ‡§∏‡•ç‡§ü‡•á‡§®‡•ã' : 'All Stenographer Studio'}
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
                        <span className="text-sm">üéôÔ∏è</span>
                        <span className="truncate">{language === 'hindi' ? 'AI ‡§Æ‡•â‡§ï ‡§á‡§Ç‡§ü‡§∞‡§µ‡•ç‡§Ø‡•Ç ‡§∏‡§ø‡§Æ‡•Å‡§≤‡•á‡§ü‡§∞' : 'AI Mock Interview Simulator'}</span>
                      </button>
                      <button
                        onClick={() => { setActiveView('performance-analytics'); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl text-rose-300 hover:text-rose-200 hover:bg-[#121829] transition-all text-left bg-rose-500/15 border border-rose-500/30 cursor-pointer font-bold"
                      >
                        <span className="text-sm">üìä</span>
                        <span className="truncate">{language === 'hindi' ? 'AI ‡§™‡§∞‡§´‡•â‡§∞‡§Æ‡•á‡§Ç‡§∏ ‡§è‡§µ‡§Ç ‡§ï‡§Æ‡§ú‡§º‡•ã‡§∞ ‡§µ‡§ø‡§∑‡§Ø' : 'AI Weak Area Diagnostics'}</span>
                      </button>
                      <button
                        onClick={() => { setActiveView('study-plan'); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl text-cyan-300 hover:text-cyan-200 hover:bg-[#121829] transition-all text-left bg-cyan-500/15 border border-cyan-500/30 cursor-pointer font-bold"
                      >
                        <span className="text-sm">üóìÔ∏è</span>
                        <span className="truncate">{language === 'hindi' ? '‡§∏‡•ç‡§Æ‡§æ‡§∞‡•ç‡§ü ‡§∏‡•ç‡§ü‡§°‡•Ä ‡§™‡•ç‡§≤‡§æ‡§®‡§∞' : 'Smart Study Planner'}</span>
                      </button>
                      <button
                        onClick={() => { setActiveView('neural-map'); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl text-emerald-300 hover:text-emerald-200 hover:bg-[#121829] transition-all text-left bg-emerald-500/15 border border-emerald-500/30 cursor-pointer font-bold"
                      >
                        <span className="text-sm">üß†</span>
                        <span className="truncate">{language === 'hindi' ? 'AI ‡§®‡•ç‡§Ø‡•Ç‡§∞‡§≤ ‡§Æ‡•á‡§Æ‡•ã‡§∞‡•Ä ‡§Æ‡•à‡§™' : 'AI Neural Memory Map'}</span>
                      </button>
                      <button
                        onClick={() => { setActiveView('time-travel'); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl text-amber-300 hover:text-amber-200 hover:bg-[#121829] transition-all text-left bg-amber-500/15 border border-amber-500/30 cursor-pointer font-bold"
                      >
                        <span className="text-sm">‚è≥</span>
                        <span className="truncate">{language === 'hindi' ? 'AI ‡§ï‡§æ‡§≤-‡§Ø‡§æ‡§§‡•ç‡§∞‡§æ ‡§∏‡§ø‡§Æ‡•Å‡§≤‡•á‡§ü‡§∞' : 'AI Time-Travel Simulator'}</span>
                      </button>
                      <button
                        onClick={() => { setActiveView('article-reader'); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl text-amber-300 hover:text-amber-200 hover:bg-[#121829] transition-all text-left bg-amber-500/10 border border-amber-500/20 cursor-pointer font-bold"
                      >
                        <Headphones className="w-4 h-4 text-amber-300" />
                        <span className="truncate">{language === 'hindi' ? '‡§Ü‡§∞‡•ç‡§ü‡§ø‡§ï‡§≤ ‡§µ‡§æ‡§á‡§∏ ‡§∞‡•Ä‡§°‡§∞ üéôÔ∏è' : 'Article Voice Reader üéôÔ∏è'}</span>
                      </button>
                      <button
                        onClick={() => { setActiveView('notes-ocr'); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl text-emerald-300 hover:text-emerald-200 hover:bg-[#121829] transition-all text-left bg-emerald-500/10 border border-emerald-500/20 cursor-pointer font-bold"
                      >
                        <Camera className="w-4 h-4 text-emerald-300" />
                        <span className="truncate">{language === 'hindi' ? '‡§π‡§∏‡•ç‡§§‡§≤‡§ø‡§ñ‡§ø‡§§ ‡§®‡•ã‡§ü‡•ç‡§∏ ‡§´‡•ã‡§ü‡•ã ‡§∏‡•ç‡§ï‡•à‡§®‡§∞ üì∑' : 'Handwritten Notes Scanner üì∑'}</span>
                      </button>
                      <button
                        onClick={() => { setActiveView('history'); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#121829] transition-all text-left bg-transparent border-none cursor-pointer"
                      >
                        <span className="text-sm">üéôÔ∏è</span>
                        <span className="truncate">Voice Article & Audio Recorder</span>
                      </button>
                      <button
                        onClick={() => { setActiveView('map'); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#121829] transition-all text-left bg-transparent border-none cursor-pointer"
                      >
                        <span className="text-sm">üó∫Ô∏è</span>
                        <span className="truncate">GIS & Map Visualizer</span>
                      </button>
                      <button
                        onClick={() => { setActiveView('quiz'); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#121829] transition-all text-left bg-transparent border-none cursor-pointer"
                      >
                        <span className="text-sm">üß†</span>
                        <span className="truncate">Interactive Live Quiz</span>
                      </button>
                      <button
                        onClick={() => { setActiveView('notes'); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#121829] transition-all text-left bg-transparent border-none cursor-pointer"
                      >
                        <span className="text-sm">üìñ</span>
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
                        <span className="text-sm">üë§</span>
                        <span>About Creator & Vision</span>
                      </div>
                      <span className="text-[10px] text-slate-500">{isCreatorDrawerOpen ? '‚ñ≤' : '‚ñº'}</span>
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
                        <span className="text-sm">üìö</span>
                        <span>Syllabus & Utilities</span>
                      </div>
                      <span className="text-[10px] text-slate-500">{isAcademicHubOpen ? '‚ñ≤' : '‚ñº'}</span>
                    </button>

                    {isAcademicHubOpen && (
                      <div className="p-2 bg-[#090D18] border border-slate-850 rounded-xl space-y-2 text-left animate-fade-in max-h-60 overflow-y-auto">
                        <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Quick Shortcuts:</div>
                        <button onClick={() => { setIsUtilityDashboardOpen(true); }} className="w-full text-left p-2 bg-slate-900 hover:bg-slate-800 rounded text-xs text-indigo-300 font-medium cursor-pointer border-none">
                          ‚öôÔ∏è Utility Dashboard
                        </button>
                        <button onClick={() => { setIsFeedbackOpen(true); }} className="w-full text-left p-2 bg-slate-900 hover:bg-slate-800 rounded text-xs text-orange-300 font-medium cursor-pointer border-none">
                          üìù Give Feedback
                        </button>
                        <button onClick={() => { setIsSharePosterOpen(true); }} className="w-full text-left p-2 bg-slate-900 hover:bg-slate-800 rounded text-xs text-emerald-300 font-medium cursor-pointer border-none">
                          üí¨ Share Status
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
                              üéôÔ∏è VOICE ASSISTANT ACTIVE
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
                            ‚èπÔ∏è Stop
                          </button>
                        )}
                        <button
                          onClick={stopVoiceAssistantMode}
                          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-[10px] font-bold transition-all cursor-pointer shadow-md border-none"
                        >
                          Turn Off ‚ùå
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
                            ? '‡§ë‡§≤-‡§á‡§®-‡§µ‡§® AI ‡§∂‡§ø‡§ï‡•ç‡§∑‡§æ, ‡§∏‡§∞‡§ï‡§æ‡§∞‡•Ä ‡§™‡§∞‡•Ä‡§ï‡•ç‡§∑‡§æ ‡§§‡•à‡§Ø‡§æ‡§∞‡•Ä ‡§è‡§µ‡§Ç ‡§≤‡§æ‡§á‡§µ ‡§∏‡§æ‡§á‡§Ç‡§∏-‡§Æ‡•á‡§Æ‡•ã‡§∞‡•Ä ‡§≤‡•à‡§¨' 
                            : 'All-in-one AI education, exam prep & interactive science-memory lab'}
                        </p>

                        {/* WIDE SKY-BLUE "ALL STENOGRAPHER" HERO BANNER */}
                        <button
                          onClick={() => setActiveView('steno')}
                          className="mt-2 w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-sky-600 via-cyan-500 to-sky-600 hover:from-sky-500 hover:to-cyan-400 border border-sky-300/40 text-white font-black text-xs sm:text-sm tracking-wide shadow-lg shadow-cyan-900/40 hover:shadow-cyan-500/30 flex items-center justify-between gap-2.5 transition-all cursor-pointer active:scale-[0.99] group"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base group-hover:scale-110 transition-transform">‚úçÔ∏è</span>
                            <span className="font-extrabold tracking-wide text-left">
                              ALL STENOGRAPHER ‚Ä¢ ‡§∏‡§Æ‡•ç‡§™‡•Ç‡§∞‡•ç‡§£ ‡§Ü‡§∂‡•Å‡§≤‡§ø‡§™‡§ø (‡§ã‡§∑‡§ø, ‡§Æ‡§æ‡§®‡§ï, ‡§™‡§ø‡§ü‡§Æ‡•à‡§®) ‡§µ ‡§°‡§ø‡§ï‡•ç‡§ü‡•á‡§∂‡§®
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
                            üí°
                          </div>
                          <div className="overflow-hidden">
                            <div className="text-xs font-bold text-slate-200 group-hover:text-amber-300 truncate">
                              {language === 'hindi' ? 'AI ‡§®‡§ø‡§Æ‡•ã‡§®‡§ø‡§ï‡•ç‡§∏' : 'Smart Mnemonics'}
                            </div>
                            <div className="text-[9px] text-slate-400 truncate">
                              {language === 'hindi' ? '‡§§‡§æ‡§∞‡•Ä‡§ñ‡•á‡§Ç ‡§µ ‡§ï‡§µ‡§ø‡§§‡§æ‡§è‡§Ç' : 'GK rhymes'}
                            </div>
                          </div>
                        </button>

                        <button
                          onClick={() => setActiveView('science-lab')}
                          className="p-2 sm:p-2.5 bg-gradient-to-br from-cyan-950/80 via-blue-950/50 to-slate-900 border border-cyan-500/50 hover:border-cyan-400 rounded-xl flex items-center gap-2.5 group cursor-pointer transition-all shadow-md hover:shadow-cyan-500/20 active:scale-98"
                        >
                          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0 text-base">
                            üî¨
                          </div>
                          <div className="overflow-hidden">
                            <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 truncate">
                              {language === 'hindi' ? '‡§∏‡§æ‡§á‡§Ç‡§∏ ‡§≤‡•à‡§¨' : 'Science Lab'}
                            </div>
                            <div className="text-[9px] text-slate-400 truncate">
                              {language === 'hindi' ? '‡§∏‡§∞‡•ç‡§ï‡§ø‡§ü ‡§µ ‡§∏‡§ø‡§Æ‡•Å‡§≤‡•á‡§ü‡§∞' : 'Circuit & Physics sim'}
                            </div>
                          </div>
                        </button>

                        <button
                          onClick={() => setActiveView('neural-map')}
                          className="p-2 sm:p-2.5 bg-gradient-to-br from-emerald-950/80 via-teal-950/50 to-slate-900 border border-emerald-500/50 hover:border-emerald-400 rounded-xl flex items-center gap-2.5 group cursor-pointer transition-all shadow-md hover:shadow-emerald-500/20 active:scale-98"
                        >
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 text-base">
                            üß†
                          </div>
                          <div className="overflow-hidden">
                            <div className="text-xs font-bold text-slate-200 group-hover:text-emerald-300 truncate">
                              {language === 'hindi' ? '‡§®‡•ç‡§Ø‡•Ç‡§∞‡§≤ ‡§Æ‡•à‡§™' : 'Neural Map'}
                            </div>
                            <div className="text-[9px] text-slate-400 truncate">
                              {language === 'hindi' ? '‡§µ‡§ø‡§ú‡•Å‡§Ö‡§≤ ‡§®‡•ã‡§°‡•ç‡§∏' : 'Visual nodes & PYQ'}
                            </div>
                          </div>
                        </button>
                        
                        <button
                          onClick={() => setActiveView('quiz')}
                          className="p-2 sm:p-2.5 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 hover:border-indigo-500/60 rounded-xl flex items-center gap-2.5 group cursor-pointer transition-all shadow-sm active:scale-98"
                        >
                          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 text-base">
                            üéØ
                          </div>
                          <div className="overflow-hidden">
                            <div className="text-xs font-bold text-slate-200 group-hover:text-indigo-300 truncate">
                              {language === 'hindi' ? '‡§ë‡§ü‡•ã ‡§ï‡•ç‡§µ‡§ø‡§ú' : 'Chapter Quiz'}
                            </div>
                            <div className="text-[9px] text-slate-400 truncate">
                              {language === 'hindi' ? '‡§∏‡•ç‡§ï‡•ã‡§∞‡§ï‡§æ‡§∞‡•ç‡§°' : 'PYQ & Scorecard'}
                            </div>
                          </div>
                        </button>

                        <button
                          onClick={() => setActiveView('book-reader')}
                          className="p-2 sm:p-2.5 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 hover:border-emerald-500/60 rounded-xl flex items-center gap-2.5 group cursor-pointer transition-all shadow-sm active:scale-98"
                        >
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 text-base">
                            üéôÔ∏è
                          </div>
                          <div className="overflow-hidden">
                            <div className="text-xs font-bold text-slate-200 group-hover:text-emerald-300 truncate">
                              {language === 'hindi' ? '‡§µ‡•â‡§á‡§∏ ‡§∞‡•Ä‡§°‡§∞' : 'Voice Reader'}
                            </div>
                            <div className="text-[9px] text-slate-400 truncate">
                              {language === 'hindi' ? '‡§∏‡•Å‡§®‡•á‡§Ç ‡§µ ‡§∏‡§Æ‡§ù‡•á‡§Ç' : 'Listen & Learn'}
                            </div>
                          </div>
                        </button>
                        
                        <button
                          onClick={() => setActiveView('time-travel')}
                          className="p-2 sm:p-2.5 bg-gradient-to-br from-purple-950/80 via-indigo-950/50 to-slate-900 border border-purple-500/50 hover:border-purple-400 rounded-xl flex items-center gap-2.5 group cursor-pointer transition-all shadow-md hover:shadow-purple-500/20 active:scale-98"
                        >
                          <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0 text-base">
                            ‚è≥
                          </div>
                          <div className="overflow-hidden">
                            <div className="text-xs font-bold text-slate-200 group-hover:text-purple-300 truncate">
                              {language === 'hindi' ? '‡§ï‡§æ‡§≤-‡§Ø‡§æ‡§§‡•ç‡§∞‡§æ' : 'Time-Travel Simulator'}
                            </div>
                            <div className="text-[9px] text-slate-400 truncate">
                              {language === 'hindi' ? '‡§≠‡§ó‡§§ ‡§∏‡§ø‡§Ç‡§π' : 'Converse with history'}
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
                            üìö
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
                            üåê
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
                            üéôÔ∏è
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
                            üìä
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
                            <span>{language === 'hindi' ? 'Quick Save üìë' : 'Quick Save üìë'}</span>
                          </button>
                          
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(quickSaveSelectedText);
                              showToast(language === 'hindi' ? 'üìã ‡§π‡§æ‡§á‡§≤‡§æ‡§á‡§ü ‡§ï‡§ø‡§Ø‡§æ ‡§ó‡§Ø‡§æ ‡§ü‡•á‡§ï‡•ç‡§∏‡•ç‡§ü ‡§ï‡•â‡§™‡•Ä ‡§π‡•Å‡§Ü!' : 'üìã Highlighted text copied!', 'info');
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
                                  ü¶¢
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
                                      title="Click to view full image / ‡§´‡•ã‡§ü‡•ã ‡§¶‡•á‡§ñ‡•á‡§Ç"
                                    >
                                      <img src={imgUrl} alt={`Upload ${imgIdx + 1}`} className="max-h-40 w-full object-cover rounded-xl" referrerPolicy="no-referrer" />
                                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] font-extrabold text-white transition-opacity gap-1 p-1 text-center">
                                        üëÅÔ∏è View Full / ‡§¨‡§°‡§º‡§æ ‡§¶‡•á‡§ñ‡•á‡§Ç
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
                                <span>üì• PDF / ‡§°‡§æ‡§â‡§®‡§≤‡•ã‡§°</span>
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
                                <span>üìë Quick Save / ‡§®‡•ã‡§ü‡•ç‡§∏</span>
                              </button>

                              <button
                                onClick={() => handleCopyMessage(msg.id, msg.content)}
                                className="flex items-center gap-1 hover:text-indigo-400 transition-colors py-0.5 px-1.5 hover:bg-slate-800/40 rounded-md border-none bg-transparent cursor-pointer text-slate-400"
                                title="Copy response to clipboard"
                              >
                                <Copy className="w-3 h-3" />
                                {copiedMsgId === msg.id ? 'Copied ‚úì / ‡§ï‡•â‡§™‡•Ä ‡§π‡•Å‡§Ü' : 'Copy / ‡§ï‡•â‡§™‡•Ä'}
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
                                    Stop / ‡§∞‡•Å‡§ï‡•á‡§Ç
                                  </>
                                ) : (
                                  <>
                                    <Volume2 className="w-3 h-3" />
                                    Listen / ‡§∏‡•Å‡§®‡•á‡§Ç üîä
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
                                <span>‚≠ê ‡§´‡•Ä‡§°‡§¨‡•à‡§ï / Rating</span>
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
                                {copiedMsgId === msg.id ? 'Copied ‚úì' : 'Copy'}
                              </button>
                            </div>
                          )}

                          
                        </div>
                      ))}

                      {/* Loading placeholder spinner */}
                      {isChatLoading && (
                        <div className="flex items-center gap-3 py-3 pl-1">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#00E5FF] to-[#9D4EDD] flex items-center justify-center text-[10px] font-black text-slate-950">
                            ü¶¢
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
                              ? '‡§ï‡•ç‡§Ø‡§æ ‡§Ü‡§™‡§ï‡•ã ‡§Ø‡§π AI ‡§ú‡§µ‡§æ‡§¨ ‡§™‡§∏‡§Ç‡§¶ ‡§Ü‡§Ø‡§æ? ‡§Ö‡§™‡§®‡•Ä ‡§™‡§¢‡§º‡§æ‡§à ‡§ï‡•Ä ‡§ö‡•à‡§ü ‡§π‡§ø‡§∏‡•ç‡§ü‡•ç‡§∞‡•Ä ‡§∏‡•Å‡§∞‡§ï‡•ç‡§∑‡§ø‡§§ ‡§∞‡§ñ‡§®‡•á ‡§î‡§∞ ‡§Ö‡§∏‡•Ä‡§Æ‡§ø‡§§ AI ‡§™‡•ç‡§∞‡§∂‡•ç‡§®‡•ã‡§Ç ‡§ï‡•á ‡§≤‡§ø‡§è Google ‡§Ø‡§æ Facebook ‡§∏‡•á ‡§≤‡•â‡§ó‡§ø‡§® ‡§ï‡§∞‡•á‡§Ç!'
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
                              <span>Sign in with Google üåê</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsAuthRegisterOpen(true)}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-lg hover:shadow-blue-500/20 transition-all cursor-pointer border-none"
                            >
                              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                              </svg>
                              <span>Facebook Sign In üî∑</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsAuthLoginOpen(true)}
                              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-indigo-300 font-bold text-xs rounded-xl transition-all cursor-pointer border border-slate-700"
                            >
                              Register / Login üîë
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
                              title="Click to view image / ‡§´‡•ã‡§ü‡•ã ‡§¶‡•á‡§ñ‡•á‡§Ç"
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
                                üëÅÔ∏è View
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
                                ? `üåê ‡§ó‡•á‡§∏‡•ç‡§ü AI ‡§∏‡§∞‡•ç‡§ö ‡§Æ‡•ã‡§° ‚Ä¢ ‡§Æ‡•Å‡§´‡§º‡•ç‡§§ ‡§ü‡•ç‡§∞‡•â‡§Ø‡§≤ ‡§â‡§™‡§Ø‡•ã‡§ó: ${guestPromptCount}/2`
                                : `üåê Guest AI Search Mode ‚Ä¢ Free Trial: ${guestPromptCount}/2`}
                            </span>
                            <span className="text-[10px] text-slate-400 block font-medium">
                              {language === 'hindi'
                                ? '‡§∏‡§∞‡•ç‡§ö ‡§ï‡•á ‡§¨‡§æ‡§¶ ‡§Ö‡§∏‡•Ä‡§Æ‡§ø‡§§ ‡§â‡§§‡•ç‡§§‡§∞ ‡§è‡§µ‡§Ç ‡§á‡§§‡§ø‡§π‡§æ‡§∏ ‡§∏‡§π‡•á‡§ú‡§®‡•á ‡§ï‡•á ‡§≤‡§ø‡§è ‡§≤‡•â‡§ó‡§ø‡§®/‡§∏‡§æ‡§á‡§®-‡§Ö‡§™ ‡§ï‡§∞‡•á‡§Ç'
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
                            <span>Google üåê</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsAuthRegisterOpen(true)}
                            className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer border-none shadow-md shadow-blue-950/40 hidden sm:flex active:scale-95"
                          >
                            <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                            <span>Facebook üî∑</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsAuthLoginOpen(true)}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white font-bold text-xs rounded-xl transition-all cursor-pointer border border-indigo-500/30 active:scale-95"
                          >
                            Login üîë
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
                            showToast(language === 'hindi' ? "‡§ï‡•É‡§™‡§Ø‡§æ ‡§Æ‡§æ‡§®‡•ç‡§Ø ‡§á‡§Æ‡•á‡§ú ‡§´‡§æ‡§á‡§≤ ‡§ö‡•Å‡§®‡•á‡§Ç!" : "Please choose valid image files!", "warn");
                            return;
                          }
                          
                          const remainingSlots = 3 - chatAttachedImages.length;
                          if (remainingSlots <= 0) {
                            showToast(language === 'hindi' ? "‡§Ö‡§ß‡§ø‡§ï‡§§‡§Æ 3 ‡§á‡§Æ‡•á‡§ú ‡§π‡•Ä ‡§Ö‡§™‡§≤‡•ã‡§° ‡§ï‡§∞ ‡§∏‡§ï‡§§‡•á ‡§π‡•à‡§Ç!" : "Maximum 3 images can be attached!", "warn");
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
                            showToast(language === 'hindi' ? "‡§ï‡•á‡§µ‡§≤ 3 ‡§á‡§Æ‡•á‡§ú ‡§§‡§ï ‡§π‡•Ä ‡§ú‡•ã‡§°‡§º‡•Ä ‡§ú‡§æ ‡§∏‡§ï‡§§‡•Ä ‡§π‡•à‡§Ç‡•§" : "Only up to 3 images can be attached.", "info");
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
                              showToast(language === 'hindi' ? "‡§ï‡•É‡§™‡§Ø‡§æ ‡§è‡§ï ‡§Æ‡§æ‡§®‡•ç‡§Ø ‡§á‡§Æ‡•á‡§ú ‡§´‡§æ‡§á‡§≤ ‡§ö‡•Å‡§®‡•á‡§Ç!" : "Please choose a valid image file!", "warn");
                              return;
                            }
                            if (chatAttachedImages.length >= 3) {
                              showToast(language === 'hindi' ? "‡§Ö‡§ß‡§ø‡§ï‡§§‡§Æ 3 ‡§á‡§Æ‡•á‡§ú ‡§π‡•Ä ‡§Ö‡§™‡§≤‡•ã‡§° ‡§ï‡§∞ ‡§∏‡§ï‡§§‡•á ‡§π‡•à‡§Ç!" : "Maximum 3 images can be attached!", "warn");
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
                        title="Attach Images (Up to 3) / ‡§´‡•ã‡§ü‡•ã ‡§ú‡•ã‡§°‡§º‡•á‡§Ç (‡§Ö‡§ß‡§ø‡§ï‡§§‡§Æ 3)"
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
                        title="Capture Photo via Camera / ‡§ï‡•à‡§Æ‡§∞‡§æ ‡§∏‡•á ‡§´‡•ã‡§ü‡•ã ‡§ñ‡•Ä‡§Ç‡§ö‡•á‡§Ç"
                      >
                        <Camera className="w-4.5 h-4.5" />
                      </button>

                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder={language === 'hindi' ? "‡§π‡§Ç‡§∏-‡§è‡§Ü‡§à ‡§∏‡•á ‡§ï‡•Å‡§õ ‡§≠‡•Ä ‡§™‡•Ç‡§õ‡•á‡§Ç... (‡§™‡•ç‡§∞‡§∂‡•ç‡§®‡•ã‡§Ç ‡§Ø‡§æ ‡§®‡•ã‡§ü‡•ç‡§∏ ‡§ï‡•Ä 3 ‡§´‡•ã‡§ü‡•ã ‡§§‡§ï ‡§ú‡•ã‡§°‡§º‡•á‡§Ç)" : "Ask HansAI anything... (Snap/attach up to 3 photos)"}
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
                        title="Toggle Speech Dictation Input / ‡§¨‡•ã‡§≤‡§ï‡§∞ ‡§≤‡§ø‡§ñ‡•á‡§Ç"
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
                        title="Send Message / ‡§≠‡•á‡§ú‡•á‡§Ç"
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
                    ‚ö° Auto-Save Active (‡§∏‡•ç‡§µ‡§§‡§É ‡§∏‡•Å‡§∞‡§ï‡•ç‡§∑‡§ø‡§§)
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
                        ‡§Ö‡§ß‡•Ç‡§∞‡§æ ‡§ü‡•á‡§∏‡•ç‡§ü ‡§°‡•ç‡§∞‡§æ‡§´‡•ç‡§ü ‡§â‡§™‡§≤‡§¨‡•ç‡§ß ‡§π‡•à! (In-Progress Quiz Draft Found)
                      </h4>
                    </div>
                    <p className="text-[11px] text-indigo-200">
                      ‡§Ü‡§™‡§ï‡§æ ‡§™‡§ø‡§õ‡§≤‡§æ ‡§Ö‡§®‡§´‡§ø‡§®‡§ø‡§∂‡•ç‡§° ‡§ï‡•ç‡§µ‡§ø‡§ú‡§º ‡§∏‡•á‡§∂‡§® ‡§∏‡•Å‡§∞‡§ï‡•ç‡§∑‡§ø‡§§ ‡§π‡•à‡•§ ‡§Ü‡§™ ‡§µ‡§π‡•Ä‡§Ç ‡§∏‡•á ‡§ú‡§æ‡§∞‡•Ä ‡§∞‡§ñ ‡§∏‡§ï‡§§‡•á ‡§π‡•à‡§Ç‡•§
                    </p>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={resumeActiveQuizDraft}
                      className="flex-1 sm:flex-none px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-300" />
                      Resume Test (‡§ú‡§æ‡§∞‡•Ä ‡§∞‡§ñ‡•á‡§Ç)
                    </button>
                    <button
                      onClick={discardActiveQuizDraft}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 font-semibold rounded-xl text-xs transition-all cursor-pointer"
                      title="Discard unfinished quiz draft"
                    >
                      Dismiss (‡§∞‡§¶‡•ç‡§¶ ‡§ï‡§∞‡•á‡§Ç)
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
                      <span>üìñ Syllabus Live Quiz (‡§∏‡§ø‡§≤‡•á‡§¨‡§∏ ‡§≤‡§æ‡§á‡§µ ‡§ü‡•á‡§∏‡•ç‡§ü)</span>
                    </button>
                    <button
                      onClick={() => setActiveQuizTab('mistakes')}
                      className={`flex-1 py-3 text-center font-bold text-xs sm:text-sm tracking-wide border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        activeQuizTab === 'mistakes'
                          ? 'border-rose-500 text-rose-400'
                          : 'border-transparent text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span>üìì Mistake Notebook (‡§ó‡§≤‡§§‡•Ä ‡§∞‡§ú‡§ø‡§∏‡•ç‡§ü‡§∞)</span>
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
                      <span>üíæ Auto-Saved Quizzes ({savedQuizzes.length})</span>
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
                          A1 Scorecard Profile & Student Details (‡§ï‡§æ‡§∞‡•ç‡§° ‡§µ‡§ø‡§µ‡§∞‡§£)
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="block text-[10px] text-slate-400 font-bold">Student Name (‡§õ‡§æ‡§§‡•ç‡§∞ ‡§ï‡§æ ‡§®‡§æ‡§Æ):</label>
                            <input
                              type="text"
                              value={studentName}
                              onChange={(e) => setStudentName(e.target.value)}
                              placeholder="Student Name"
                              className="w-full text-xs py-2 px-3 bg-slate-900 border border-slate-800 rounded-lg text-white font-semibold focus:ring-1 focus:ring-amber-500 focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[10px] text-slate-400 font-bold">Roll / Reg Number (‡§Ö‡§®‡•Å‡§ï‡•ç‡§∞‡§Æ‡§æ‡§Ç‡§ï):</label>
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
                          <label className="block text-xs font-bold text-slate-300">‡§Ö‡§ß‡•ç‡§Ø‡§æ‡§Ø ‡§Ø‡§æ ‡§µ‡§ø‡§∑‡§Ø ‡§ï‡§æ ‡§®‡§æ‡§Æ (Chapter Name):</label>
                          <input
                            type="text"
                            value={quizSubject}
                            onChange={(e) => setQuizSubject(e.target.value)}
                            placeholder="‡§ú‡•à‡§∏‡•á: Chapter 1: Real Numbers, Chapter 3: Laws of Motion..."
                            className="w-full text-xs py-2.5 px-3.5 bg-[#090D16] border border-indigo-500/40 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white font-medium"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-slate-300">‡§ï‡§†‡§ø‡§®‡§æ‡§à ‡§è‡§µ‡§Ç ‡§≤‡§ï‡•ç‡§∑‡•ç‡§Ø ‡§™‡§∞‡•Ä‡§ï‡•ç‡§∑‡§æ (Level / Exam):</label>
                          <input
                            type="text"
                            value={quizLevel}
                            onChange={(e) => setQuizLevel(e.target.value)}
                            placeholder="‡§ú‡•à‡§∏‡•á: Class 10th Board, SSC CGL, BPSC Prelims, UPSC..."
                            className="w-full text-xs py-2.5 px-3.5 bg-[#090D16] border border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white font-medium"
                          />
                        </div>
                      </div>

                      {/* Question Difficulty Selector */}
                      <div className="space-y-2 p-3.5 bg-[#090D16] border border-slate-800 rounded-xl">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 text-amber-400" />
                            <span>‡§™‡•ç‡§∞‡§∂‡•ç‡§®‡•ã‡§Ç ‡§ï‡§æ ‡§∏‡•ç‡§§‡§∞ (Question Difficulty Level):</span>
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
                            { id: 'standard', title: 'üü¢ Standard', desc: '‡§Æ‡•Ç‡§≤ ‡§Ö‡§µ‡§ß‡§æ‡§∞‡§£‡§æ ‡§Ö‡§≠‡•ç‡§Ø‡§æ‡§∏' },
                            { id: 'moderate', title: 'üü° Moderate', desc: '‡§Ö‡§µ‡§ß‡§æ‡§∞‡§£‡§æ ‡§Ö‡§®‡•Å‡§™‡•ç‡§∞‡§Ø‡•ã‡§ó ‡§∏‡•ç‡§§‡§∞' },
                            { id: 'hard', title: 'üî¥ Hard (Advance)', desc: 'SSC CGL / UPSC ‡§∏‡•ç‡§§‡§∞' },
                            { id: 'extreme', title: 'üü£ Extreme Master', desc: 'Multi-Statement ‡§µ Tricky' },
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
                            <span>‡§™‡•ç‡§∞‡§∂‡•ç‡§®‡•ã‡§Ç ‡§ï‡•Ä ‡§∏‡§Ç‡§ñ‡•ç‡§Ø‡§æ (Number of Questions):</span>
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
                              {count} ‡§™‡•ç‡§∞‡§∂‡•ç‡§®
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Timer Limit Settings */}
                      <div className="space-y-2.5 p-3.5 bg-[#090D16] border border-slate-800 rounded-xl">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                            <span>‡§∏‡§Æ‡§Ø ‡§∏‡•Ä‡§Æ‡§æ ‡§∏‡•á‡§ü‡§ø‡§Ç‡§ó‡•ç‡§∏ (Timer Settings):</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => setQuizTimerSoundEnabled(prev => !prev)}
                            className="text-[10px] text-slate-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-lg"
                          >
                            <span>{quizTimerSoundEnabled ? 'üîî Sound ON' : 'üîï Sound OFF'}</span>
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {[
                            { id: 'auto', title: '‚öôÔ∏è Auto Smart Timer', desc: '‡§∏‡•ç‡§§‡§∞ ‡§ï‡•á ‡§Ö‡§®‡•Å‡§∏‡§æ‡§∞ ‡§∏‡•ç‡§µ‡§§‡§É' },
                            { id: 'custom_question', title: '‚ö° Per Question', desc: '‡§™‡•ç‡§∞‡§§‡§ø ‡§™‡•ç‡§∞‡§∂‡•ç‡§® ‡§∏‡§Æ‡§Ø' },
                            { id: 'custom_total', title: '‚è±Ô∏è Total Quiz', desc: '‡§ï‡•Å‡§≤ ‡§™‡§∞‡•Ä‡§ï‡•ç‡§∑‡§æ ‡§∏‡§Æ‡§Ø' },
                            { id: 'none', title: 'üïäÔ∏è No Timer', desc: '‡§¨‡§ø‡§®‡§æ ‡§∏‡§Æ‡§Ø ‡§∏‡•Ä‡§Æ‡§æ' },
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
                            <span className="text-slate-400">‡§™‡•ç‡§∞‡§§‡§ø ‡§™‡•ç‡§∞‡§∂‡•ç‡§® ‡§∏‡•á‡§ï‡§Ç‡§° ‡§ö‡•Å‡§®‡•á‡§Ç:</span>
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
                            <span className="text-slate-400">‡§ï‡•Å‡§≤ ‡§ü‡•á‡§∏‡•ç‡§ü ‡§ï‡§æ ‡§∏‡§Æ‡§Ø ‡§ö‡•Å‡§®‡•á‡§Ç:</span>
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
                        <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Quick Chapter Presets (‡§§‡•ç‡§µ‡§∞‡§ø‡§§ ‡§Ö‡§ß‡•ç‡§Ø‡§æ‡§Ø ‡§ö‡•Å‡§®‡§æ‡§µ)</span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          <button 
                            onClick={() => { const sub = "Chapter 1: Real Numbers & Polynomials"; setQuizSubject(sub); handleGenerateQuiz(sub, quizDifficulty, quizQuestionCount); }}
                            className="p-2 text-left text-[11px] text-slate-300 hover:text-white bg-[#090D16] hover:bg-slate-800 border border-slate-800 rounded-xl truncate cursor-pointer"
                          >
                            üìê Ch 1: Real Numbers
                          </button>
                          <button 
                            onClick={() => { const sub = "Chapter 3: Laws of Motion & Physics"; setQuizSubject(sub); handleGenerateQuiz(sub, quizDifficulty, quizQuestionCount); }}
                            className="p-2 text-left text-[11px] text-slate-300 hover:text-white bg-[#090D16] hover:bg-slate-800 border border-slate-800 rounded-xl truncate cursor-pointer"
                          >
                            üß™ Ch 3: Laws of Motion
                          </button>
                          <button 
                            onClick={() => { const sub = "Chapter 5: Constitution Articles & Rights"; setQuizSubject(sub); handleGenerateQuiz(sub, quizDifficulty, quizQuestionCount); }}
                            className="p-2 text-left text-[11px] text-slate-300 hover:text-white bg-[#090D16] hover:bg-slate-800 border border-slate-800 rounded-xl truncate cursor-pointer"
                          >
                            üèõÔ∏è Ch 5: Fundamental Rights
                          </button>
                          <button 
                            onClick={() => { const sub = "Chapter 2: Trigonometry & Geometry"; setQuizSubject(sub); handleGenerateQuiz(sub, quizDifficulty, quizQuestionCount); }}
                            className="p-2 text-left text-[11px] text-slate-300 hover:text-white bg-[#090D16] hover:bg-slate-800 border border-slate-800 rounded-xl truncate cursor-pointer"
                          >
                            üìê Ch 2: Trigonometry
                          </button>
                          <button 
                            onClick={() => { const sub = "Chapter 4: Modern Indian History 1857-1947"; setQuizSubject(sub); handleGenerateQuiz(sub, quizDifficulty, quizQuestionCount); }}
                            className="p-2 text-left text-[11px] text-slate-300 hover:text-white bg-[#090D16] hover:bg-slate-800 border border-slate-800 rounded-xl truncate cursor-pointer"
                          >
                            üö© Ch 4: Freedom Movement
                          </button>
                          <button 
                            onClick={() => { const sub = "Chapter 1: English Preposition Rules"; setQuizSubject(sub); handleGenerateQuiz(sub, quizDifficulty, quizQuestionCount); }}
                            className="p-2 text-left text-[11px] text-slate-300 hover:text-white bg-[#090D16] hover:bg-slate-800 border border-slate-800 rounded-xl truncate cursor-pointer"
                          >
                            üìñ Ch 1: English Prepositions
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
                            <span>‡§∏‡•Å‡§∞‡§ï‡•ç‡§∑‡§ø‡§§ ‡§ü‡•á‡§∏‡•ç‡§ü‡•ç‡§∏ ‡§ï‡•Ä ‡§∏‡•Ç‡§ö‡•Ä (Auto-Saved Quiz Records)</span>
                            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-extrabold px-2 py-0.5 rounded-full">
                              {savedQuizzes.length} Saved
                            </span>
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            ‡§∏‡§≠‡•Ä ‡§π‡§≤ ‡§ï‡§ø‡§è ‡§ó‡§è ‡§ï‡•ç‡§µ‡§ø‡§ú‡§º ‡§∏‡•ç‡§µ‡§§‡§É ‡§∏‡•ç‡§•‡§æ‡§®‡•Ä‡§Ø ‡§Æ‡•á‡§Æ‡•ã‡§∞‡•Ä ‡§Æ‡•á‡§Ç ‡§∏‡•Å‡§∞‡§ï‡•ç‡§∑‡§ø‡§§ ‡§∞‡§π‡§§‡•á ‡§π‡•à‡§Ç‡•§
                          </p>
                        </div>
                        {savedQuizzes.length > 0 && (
                          <button
                            onClick={() => {
                              if (confirm("‡§ï‡•ç‡§Ø‡§æ ‡§Ü‡§™ ‡§∏‡§≠‡•Ä ‡§∏‡•Å‡§∞‡§ï‡•ç‡§∑‡§ø‡§§ ‡§ï‡•ç‡§µ‡§ø‡§ú‡§º ‡§∞‡§ø‡§ï‡•â‡§∞‡•ç‡§° ‡§π‡§ü‡§æ‡§®‡§æ ‡§ö‡§æ‡§π‡§§‡•á ‡§π‡•à‡§Ç? (Clear all saved records?)")) {
                                setSavedQuizzes([]);
                                localStorage.removeItem('hansai-saved-quizzes');
                                showToast("All saved quiz records cleared.", "info");
                              }
                            }}
                            className="text-[10px] text-rose-400 hover:text-rose-300 bg-rose-950/30 hover:bg-rose-950/50 border border-rose-800/40 px-2.5 py-1 rounded-lg transition-all self-start sm:self-auto cursor-pointer"
                          >
                            üóëÔ∏è Clear All (‡§∏‡§≠‡•Ä ‡§π‡§ü‡§æ‡§è‡§Ç)
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
                            placeholder="‡§∏‡§¨‡•ç‡§ú‡•á‡§ï‡•ç‡§ü, ‡§õ‡§æ‡§§‡•ç‡§∞ ‡§®‡§æ‡§Æ ‡§Ø‡§æ ‡§ó‡•ç‡§∞‡•á‡§° ‡§∏‡•á ‡§ñ‡•ã‡§ú‡•á‡§Ç (Search saved quizzes by subject, student, grade...)"
                            className="w-full text-xs py-2 pl-3 pr-8 bg-[#090D16] border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                          />
                          {savedQuizSearch && (
                            <button
                              onClick={() => setSavedQuizSearch('')}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
                            >
                              ‚úï
                            </button>
                          )}
                        </div>
                      )}

                      {savedQuizzes.length === 0 ? (
                        <div className="text-center py-10 space-y-3 text-slate-400 text-xs">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-950/50 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto text-xl">
                            üìù
                          </div>
                          <p className="font-semibold text-slate-300">‡§ï‡•ã‡§à ‡§∏‡•Å‡§∞‡§ï‡•ç‡§∑‡§ø‡§§ ‡§ü‡•á‡§∏‡•ç‡§ü ‡§∞‡§ø‡§ï‡•â‡§∞‡•ç‡§° ‡§®‡§π‡•Ä‡§Ç ‡§Æ‡§ø‡§≤‡§æ‡•§</p>
                          <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                            ‡§≤‡§æ‡§á‡§µ ‡§ï‡•ç‡§µ‡§ø‡§ú‡§º ‡§π‡§≤ ‡§ï‡§∞‡§§‡•á ‡§π‡•Ä ‡§Ü‡§™‡§ï‡§æ ‡§ü‡•á‡§∏‡•ç‡§ü, ‡§∏‡•ç‡§ï‡•ã‡§∞ ‡§î‡§∞ ‡§â‡§§‡•ç‡§§‡§∞ ‡§µ‡•ç‡§Ø‡§æ‡§ñ‡•ç‡§Ø‡§æ‡§è‡§Ç ‡§Ø‡§π‡§æ‡§Ç ‡§∏‡•ç‡§µ‡§§‡§É ‡§∏‡•Å‡§∞‡§ï‡•ç‡§∑‡§ø‡§§ (Auto-Save) ‡§π‡•ã ‡§ú‡§æ‡§è‡§Ç‡§ó‡•Ä‡•§
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
                                      <span>üë§ {item.studentName || 'Student'}</span>
                                      <span>üÜî {item.studentRoll || 'HS-Roll'}</span>
                                      <span>üìÖ {item.date} {item.timestamp ? `(${item.timestamp})` : ''}</span>
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
                                    <span className="text-[10px] text-slate-600">‚Ä¢</span>
                                    <span className="text-[10px] text-rose-400 font-mono">
                                      -{(item.negativeMarks ?? 0).toFixed(1)} Neg
                                    </span>
                                    <span className="text-[10px] text-slate-600">‚Ä¢</span>
                                    <span className="text-[10px] text-amber-300 font-mono font-bold">
                                      Net: {(item.netScore ?? (item.score * positiveMarkVal)).toFixed(1)}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => setReviewingSavedQuiz(item)}
                                      className="px-2.5 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 font-bold rounded-lg transition-all text-[11px] flex items-center gap-1 cursor-pointer"
                                    >
                                      üîç Review Answers
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
                                        showToast("Reloaded saved quiz record! üîÑ", "success");
                                      }}
                                      className="px-2.5 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 font-bold rounded-lg transition-all text-[11px] flex items-center gap-1 cursor-pointer"
                                    >
                                      üîÑ Replay
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
                                      üóëÔ∏è
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
                                {isQuizTimerActive ? '‚è∏Ô∏è' : '‚ñ∂Ô∏è'}
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
                            ‚úï Exit
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
                          <span className="font-mono">‡§Ö‡§ß‡•ç‡§Ø‡§æ‡§Ø ‡§™‡•ç‡§∞‡§∂‡•ç‡§® #{currentQuizIdx + 1}</span>
                          {quizzes[currentQuizIdx].hint && !showQuestionHint && (
                            <button
                              type="button"
                              onClick={() => setShowQuestionHint(true)}
                              className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer bg-amber-950/30 border border-amber-500/30 px-2 py-0.5 rounded-md"
                            >
                              <Lightbulb className="w-3 h-3 text-amber-400" />
                              <span>‡§∏‡§Ç‡§ï‡•á‡§§ ‡§¶‡•á‡§ñ‡•á‡§Ç (Show Hint)</span>
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
                            <span className="font-bold block">üí° ‡§™‡•ç‡§∞‡§∂‡•ç‡§® ‡§∏‡§Ç‡§ï‡•á‡§§ (Hint):</span>
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
                                <span>‡§∂‡§æ‡§¨‡§æ‡§∂! ‡§∏‡§π‡•Ä ‡§â‡§§‡•ç‡§§‡§∞ (Correct Answer! +{positiveMarkVal} Marks)</span>
                              </div>
                              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap text-xs">
                                {quizzes[currentQuizIdx].explanation}
                              </p>
                            </div>
                          ) : (
                            <div className="p-4 bg-rose-950/30 border border-rose-500/40 rounded-xl space-y-3 text-xs text-rose-300">
                              <div className="flex items-center gap-1.5 font-bold text-rose-400 text-sm">
                                <AlertTriangle className="w-4 h-4 text-rose-400" />
                                <span>‡§ó‡§≤‡§§ ‡§â‡§§‡•ç‡§§‡§∞ (-{negativeMarkVal} Marks) ‚Ä¢ ‡§ò‡§¨‡§∞‡§æ‡§è‡§Ç ‡§®‡§π‡•Ä‡§Ç, ‡§®‡•Ä‡§ö‡•á ‡§∏‡•Å‡§ß‡§æ‡§∞‡•á‡§Ç!</span>
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
                                  <span>‡§¶‡•Ç‡§∏‡§∞‡§æ ‡§Æ‡•å‡§ï‡§æ ‡§≤‡•á‡§Ç (Try Again with Hint)</span>
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
                                  <span>AI ‡§∏‡•á ‡§∏‡§Æ‡§ù‡•á‡§Ç ‡§ó‡§≤‡§§‡•Ä ‡§ï‡•ç‡§Ø‡•ã‡§Ç ‡§π‡•Å‡§à (Why Was This Wrong?)</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleSaveMistakeToNotebook(quizzes[currentQuizIdx], selectedOptionIdx !== null ? selectedOptionIdx : -1)}
                                  className="px-3 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 font-bold rounded-lg transition-all text-xs flex items-center gap-1.5 cursor-pointer"
                                >
                                  <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                                  <span>‡§ó‡§≤‡§§‡•Ä ‡§∞‡§ú‡§ø‡§∏‡•ç‡§ü‡§∞ ‡§Æ‡•á‡§Ç ‡§ú‡•ã‡§°‡§º‡•á‡§Ç (Save to Book)</span>
                                </button>
                              </div>
                            </div>
                          )}

                          <button
                            onClick={advanceQuiz}
                            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white rounded-xl font-bold uppercase tracking-wider text-xs shadow-lg shadow-indigo-600/20 cursor-pointer"
                          >
                            {currentQuizIdx === quizzes.length - 1 ? 'üèÅ See Final A1 Report Card (‡§∞‡§ø‡§ú‡§≤‡•ç‡§ü ‡§¶‡•á‡§ñ‡•á‡§Ç)' : '‚û°Ô∏è Advance to Next Question (‡§Ö‡§ó‡§≤‡§æ ‡§™‡•ç‡§∞‡§∂‡•ç‡§®)'}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={submitQuizAnswer}
                          disabled={selectedOptionIdx === null}
                          className="w-full py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-xl text-xs font-bold uppercase transition-all disabled:opacity-40 shadow-md shadow-orange-600/20 cursor-pointer"
                        >
                          Lock Answer & Verify (‡§â‡§§‡•ç‡§§‡§∞ ‡§¶‡§∞‡•ç‡§ú ‡§ï‡§∞‡•á‡§Ç)
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
                            ‡§∞‡§æ‡§∑‡•ç‡§ü‡•ç‡§∞‡•Ä‡§Ø ‡§Ö‡§ß‡•ç‡§Ø‡§æ‡§Ø ‡§™‡§∞‡•Ä‡§ï‡•ç‡§∑‡§æ ‡§∞‡§ø‡§™‡•ã‡§∞‡•ç‡§ü ‡§ï‡§æ‡§∞‡•ç‡§° ‡§è‡§µ‡§Ç ‡§è1 ‡§∏‡•ç‡§ï‡•ã‡§∞‡§ï‡§æ‡§∞‡•ç‡§° (National A1 Scorecard)
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
                                    {pct >= 85 ? 'üèÜ DISTINCTION (A+ GRADE)' : pct >= 60 ? 'üåü PASSED (A GRADE)' : pct >= 40 ? 'üëç PASSED (B GRADE)' : 'üìò NEEDS REVISION'}
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
                            <span>Verified HansAI Academic Portal ‚Ä¢ Auto-Saved</span>
                          </div>
                          <span>A1 Ref: #HS-${Date.now().toString().slice(-6)}</span>
                        </div>
                      </div>

                      {/* Auto-Save Confirmation Notice */}
                      <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs text-emerald-300 animate-fade-in">
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          <span className="font-semibold">
                            ‚úÖ Quize Auto-Saved to Records (‡§ï‡•ç‡§µ‡§ø‡§ú‡§º ‡§∏‡•ç‡§µ‡§§‡§É ‡§∏‡•Å‡§∞‡§ï‡•ç‡§∑‡§ø‡§§ ‡§π‡•ã ‡§ó‡§Ø‡§æ ‡§π‡•à)
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
                              üìì Mistake Notebook ({mistakeNotebook.length})
                            </button>
                          )}
                          <button
                            onClick={() => {
                              restartQuizFlow();
                              setActiveQuizTab('saved');
                            }}
                            className="text-[11px] bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-lg font-bold transition-all cursor-pointer text-center"
                          >
                            View Saved Quizzes (‡§∞‡§ø‡§ï‡•â‡§∞‡•ç‡§°‡•ç‡§∏ ‡§¶‡•á‡§ñ‡•á‡§Ç) üìÇ
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
                          <span>‚ö° Level Up: Generate Harder Questions (‡§î‡§∞ ‡§ï‡§†‡§ø‡§® ‡§™‡•ç‡§∞‡§∂‡•ç‡§®)</span>
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
                          üñ®Ô∏è Print PDF
                        </button>
                        <button
                          onClick={() => handleGenerateQuiz(quizSubject, quizDifficulty, quizQuestionCount)}
                          className="py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs uppercase rounded-xl transition-all cursor-pointer border-none"
                        >
                          üîÑ Retake Test
                        </button>
                        <button
                          onClick={restartQuizFlow}
                          className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs uppercase rounded-xl transition-all cursor-pointer border-none"
                        >
                          üìñ Change Chapter
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
                          <span>üë§ {reviewingSavedQuiz.studentName || 'Student'}</span>
                          <span>üÜî {reviewingSavedQuiz.studentRoll || 'HS-Roll'}</span>
                          <span>üìÖ {reviewingSavedQuiz.date}</span>
                          <span className="text-emerald-400 font-bold">
                            Score: {reviewingSavedQuiz.score}/{reviewingSavedQuiz.total} ({reviewingSavedQuiz.percentage || Math.round((reviewingSavedQuiz.score/reviewingSavedQuiz.total)*100)}%)
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setReviewingSavedQuiz(null)}
                        className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 hover:bg-slate-800 transition-all cursor-pointer text-xs"
                      >
                        ‚úï Close
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
                                {isCorrect ? '‚úÖ Correct (+Mark)' : isAnswered ? '‚ùå Incorrect (-Neg)' : '‚ö™ Unattempted'}
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
                                  üí° Companion Explanation / ‡§µ‡•ç‡§Ø‡§æ‡§ñ‡•ç‡§Ø‡§æ:
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
                          showToast("Loaded saved quiz to replay! üîÑ", "success");
                        }}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                      >
                        üîÑ Replay this Test (‡§™‡•Å‡§®‡§É ‡§π‡§≤ ‡§ï‡§∞‡•á‡§Ç)
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
                  Plan standard processing figures for local raw goods like ginger (‡§Ö‡§¶‡§∞‡§ï) and turmeric (‡§π‡§≤‡•ç‡§¶‡•Ä), including PMEGP subsidies.
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
                          {crop === 'Turmeric' ? '‡§π‡§≤‡•ç‡§¶‡•Ä (Turmeric)' : crop === 'Ginger' ? '‡§Ö‡§¶‡§∞‡§ï (Ginger)' : 'Medicinal'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Monthly Processing Vol (‡§ï‡§ö‡•ç‡§ö‡§æ ‡§Æ‡§æ‡§≤)</span>
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
                      <span className="block text-[10px] text-slate-500 uppercase">Purchase Raw ‚Çπ/Kg</span>
                      <input 
                        type="number"
                        value={calcInputs.rawCostPerKg}
                        onChange={(e) => setCalcInputs(prev => ({ ...prev, rawCostPerKg: Math.max(1, Number(e.target.value)) }))}
                        className="w-full text-xs py-2 px-3 bg-[#090D16] border border-slate-850 rounded-lg text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="block text-[10px] text-slate-500 uppercase">Sale Powder ‚Çπ/Kg</span>
                      <input 
                        type="number"
                        value={calcInputs.sellingCostPerKg}
                        onChange={(e) => setCalcInputs(prev => ({ ...prev, sellingCostPerKg: Math.max(1, Number(e.target.value)) }))}
                        className="w-full text-xs py-2 px-3 bg-[#090D16] border border-slate-850 rounded-lg text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="block text-[10px] text-slate-500 uppercase">Estimated Machinery Startup Cost (‚Çπ)</span>
                    <input 
                      type="number"
                      value={calcInputs.machineryCost}
                      onChange={(e) => setCalcInputs(prev => ({ ...prev, machineryCost: Math.max(1, Number(e.target.value)) }))}
                      className="w-full text-xs py-2 px-3 bg-[#090D16] border border-slate-850 rounded-lg text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="block text-[10px] text-slate-400 uppercase">PMEGP Government Category (‡§¨‡§ø‡§π‡§æ‡§∞ / ‡§ó‡•ç‡§∞‡§æ‡§Æ‡•Ä‡§£)</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setCalcInputs(prev => ({ ...prev, subsidyPercentage: 35 }))}
                        className={`flex-1 py-1 px-2.5 rounded-lg border text-[10px] font-bold ${
                          calcInputs.subsidyPercentage === 35 
                            ? 'bg-amber-600/20 text-amber-400 border-amber-500' 
                            : 'bg-[#090D16] border-slate-850 text-slate-500'
                        }`}
                      >
                        ‡§ó‡•ç‡§∞‡§æ‡§Æ‡•Ä‡§£ ‡§µ‡§ø‡§∂‡•á‡§∑ (35% Subsidy)
                      </button>
                      <button 
                        onClick={() => setCalcInputs(prev => ({ ...prev, subsidyPercentage: 25 }))}
                        className={`flex-1 py-1 px-2.5 rounded-lg border text-[10px] font-bold ${
                          calcInputs.subsidyPercentage === 25 
                            ? 'bg-amber-600/20 text-amber-400 border-amber-500' 
                            : 'bg-[#090D16] border-slate-850 text-slate-500'
                        }`}
                      >
                        ‡§∂‡§π‡§∞‡•Ä ‡§∏‡§æ‡§Æ‡§æ‡§®‡•ç‡§Ø (25% Subsidy)
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
                        <span className="text-sm font-bold text-slate-200">‚Çπ{calcResults.rawMaterialCost.toLocaleString()}</span>
                      </div>
                      <div className="bg-[#0F1626]/50 p-3 rounded-lg border border-slate-850/60">
                        <span className="block text-[9px] text-slate-500 uppercase">Dry Powder Yield</span>
                        <span className="text-sm font-bold text-slate-200">{calcResults.processedYieldKg} Kg</span>
                      </div>
                      <div className="bg-[#0F1626]/50 p-3 rounded-lg border border-slate-850/60">
                        <span className="block text-[9px] text-slate-500 uppercase">Total Revenue</span>
                        <span className="text-sm font-bold text-emerald-400">‚Çπ{calcResults.grossRevenue.toLocaleString()}</span>
                      </div>
                      <div className="bg-[#0F1626]/50 p-3 rounded-lg border border-emerald-55 border-emerald-900/30">
                        <span className="block text-[9px] text-emerald-500 uppercase font-semibold">Net Profit *</span>
                        <span className="text-sm font-bold text-emerald-400">‚Çπ{calcResults.netProfit.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="bg-amber-950/25 p-3 rounded-xl border border-amber-500/15 text-[11px] leading-relaxed text-amber-300">
                      <div className="font-bold mb-1">MSME Government Subsidy Saved:</div>
                      ‚Çπ{calcResults.subsidySaved.toLocaleString()} Saved (On Machinery cost of ‚Çπ{calcInputs.machineryCost.toLocaleString()}). Net machinery payment ‚Çπ{calcResults.machineryWithSubsidy.toLocaleString()}.
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
                    AI Syllabus Research Console / ‡§∏‡§ø‡§≤‡•á‡§¨‡§∏ ‡§∞‡§ø‡§∏‡§∞‡•ç‡§ö
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
                  Export to PDF / ‡§™‡•ç‡§∞‡§ø‡§Ç‡§ü ‡§≤‡•á‡§Ç
                </button>
              </div>

              {/* Research Input Form */}
              <div className="bg-slate-900/50 border border-slate-850 rounded-2xl p-6 space-y-4 no-print text-left">
                <h3 className="text-sm font-semibold text-white">‡§®‡§Ø‡§æ ‡§ü‡•â‡§™‡§ø‡§ï ‡§∞‡§ø‡§∏‡§∞‡•ç‡§ö ‡§Ü‡§∞‡§Æ‡•ç‡§≠ ‡§ï‡§∞‡•á‡§Ç / Start Deep AI Research</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-450 tracking-wider mb-1.5">Research Topic, Question, or Concept / ‡§∂‡•ã‡§ß ‡§ï‡§æ ‡§µ‡§ø‡§∑‡§Ø ‡§Ø‡§æ ‡§™‡•ç‡§∞‡§∂‡•ç‡§®</label>
                    <textarea
                      value={researchTopic}
                      onChange={(e) => setResearchTopic(e.target.value)}
                      placeholder="Enter any topic or question under the sun (e.g. Quantum Cryptography, Ancient Indian Numismatics, Pitman Shorthand Speed Tactics, Photosynthesis pathways...)"
                      className="w-full text-xs bg-slate-950 border border-slate-850 px-3.5 py-2.5 rounded-xl text-slate-200 outline-none focus:border-indigo-500 transition-all h-24 resize-none leading-relaxed"
                    />

                    {/* Quick suggested prompt buttons so user doesn't have to write from scratch */}
                    <div className="mt-3 space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Suggested Topics / ‡§§‡•ç‡§µ‡§∞‡§ø‡§§ ‡§∂‡•ã‡§ß ‡§µ‡§ø‡§ï‡§≤‡•ç‡§™:</span>
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
                            üöÄ {promptText}
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
                    <strong>‡§∏‡•Å‡§∞‡§ï‡•ç‡§∑‡§æ ‡§è‡§µ‡§Ç ‡§ï‡§®‡•á‡§ï‡•ç‡§ü‡§ø‡§µ‡§ø‡§ü‡•Ä ‡§∏‡•Å‡§ö‡§®‡§æ:</strong> {researchError}
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
                      Gemini AI ‡§Æ‡•â‡§°‡§≤ ‡§µ‡§ø‡§∂‡•ç‡§≤‡•á‡§∑‡§£ ‡§ï‡§∞ ‡§∞‡§π‡§æ ‡§π‡•à... ‡§µ‡§ø‡§∏‡•ç‡§§‡•É‡§§ ‡§®‡•ã‡§ü‡•ç‡§∏, ‡§ê‡§§‡§ø‡§π‡§æ‡§∏‡§ø‡§ï ‡§ò‡§ü‡§®‡§æ‡§ï‡•ç‡§∞‡§Æ, ‡§ü‡•ç‡§∞‡§ø‡§ï‡•ç‡§∏ ‡§è‡§µ‡§Ç ‡§Ö‡§≠‡•ç‡§Ø‡§æ‡§∏ ‡§™‡•ç‡§∞‡§∂‡•ç‡§® ‡§§‡•à‡§Ø‡§æ‡§∞ ‡§π‡•ã ‡§∞‡§π‡•á ‡§π‡•à‡§Ç‡•§
                    </p>
                  </div>
                </div>
              )}

              {/* Empty State Card when no research generated yet */}
              {!researchResult && !isResearchLoading && (
                <div className="bg-[#080D1A]/80 border border-dashed border-slate-800 rounded-2xl p-8 text-center space-y-4 no-print">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-2xl">
                    üî¨
                  </div>
                  <div className="max-w-md mx-auto space-y-1">
                    <h4 className="text-sm font-bold text-white">‡§ï‡•ã‡§à ‡§≠‡•Ä ‡§µ‡§ø‡§∑‡§Ø ‡§ü‡§æ‡§á‡§™ ‡§ï‡§∞‡•á‡§Ç ‡§î‡§∞ ‡§°‡•Ä‡§™ ‡§∞‡§ø‡§∏‡§∞‡•ç‡§ö ‡§∂‡•Å‡§∞‡•Ç ‡§ï‡§∞‡•á‡§Ç</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      ‡§ü‡§æ‡§á‡§™ ‡§ï‡§∞‡•á‡§Ç ‡§Ø‡§æ ‡§ä‡§™‡§∞ ‡§¶‡§ø‡§è ‡§ó‡§è ‡§§‡•ç‡§µ‡§∞‡§ø‡§§ ‡§µ‡§ø‡§∑‡§Ø‡•ã‡§Ç ‡§Æ‡•á‡§Ç ‡§∏‡•á ‡§ö‡•Å‡§®‡•á‡§Ç‡•§ HansAI ‡§Ü‡§™‡§ï‡•á ‡§≤‡§ø‡§è ‡§∏‡§Ç‡§™‡•Ç‡§∞‡•ç‡§£ ‡§µ‡§ø‡§∏‡•ç‡§§‡•É‡§§ ‡§®‡•ã‡§ü‡•ç‡§∏, ‡§µ‡§ø‡§∂‡•ç‡§≤‡•á‡§∑‡§£‡§æ‡§§‡•ç‡§Æ‡§ï ‡§¨‡§ø‡§Ç‡§¶‡•Å, ‡§ï‡§æ‡§≤‡§ï‡•ç‡§∞‡§Æ, ‡§∂‡§æ‡§∞‡•ç‡§ü ‡§ü‡•ç‡§∞‡§ø‡§ï‡•ç‡§∏ ‡§è‡§µ‡§Ç ‡§Ö‡§≠‡•ç‡§Ø‡§æ‡§∏ ‡§™‡•ç‡§∞‡§∂‡•ç‡§® ‡§§‡•à‡§Ø‡§æ‡§∞ ‡§ï‡§∞‡•á‡§ó‡§æ‡•§
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
                        ‚ú® {chip}
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
                      <p className="text-xs text-slate-400 font-mono mt-0.5">Syllabus Area / ‡§™‡•ç‡§∞‡§≠‡§æ‡§ó: <span className="text-indigo-300 font-semibold">{researchResult.subjectArea}</span></p>
                    </div>
                    <div className="text-left sm:text-right font-mono text-[9px] text-slate-500 space-y-0.5">
                      <span>Evaluated: {new Date().toLocaleDateString('hi-IN')}</span>
                      <span className="block italic text-indigo-400 font-sans font-bold">HansAI Educational Platform</span>
                      <span className="block text-emerald-400 font-sans font-extrabold tracking-wider">‚óè VERIFIED SCHOLARSHIP</span>
                    </div>
                  </div>

                  {/* Summary Segment */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                      1. Core Syllabus Abstract / ‡§Ö‡§ß‡•ç‡§Ø‡§æ‡§Ø ‡§ï‡§æ ‡§∏‡§Ç‡§ï‡•ç‡§∑‡§ø‡§™‡•ç‡§§ ‡§∏‡§æ‡§∞
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
                        2. Analytical Highlights & Concepts / ‡§Æ‡§π‡§§‡•ç‡§µ‡§™‡•Ç‡§∞‡•ç‡§£ ‡§Ö‡§µ‡§ß‡§æ‡§∞‡§£‡§æ‡§è‡§Ç
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
                        3. Contextual Timeline & Evolution / ‡§ê‡§§‡§ø‡§π‡§æ‡§∏‡§ø‡§ï ‡§™‡§∞‡§ø‡§™‡•ç‡§∞‡•á‡§ï‡•ç‡§∑‡•ç‡§Ø
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
                        Memory Enhancer Hack / ‡§ß‡§æ‡§Ç‡§∏‡•Ç ‡§∂‡•â‡§∞‡•ç‡§ü‡§ï‡§ü ‡§ü‡•ç‡§∞‡§ø‡§ï
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
                        4. Expected Exam Practice Questions / ‡§Ö‡§≠‡•ç‡§Ø‡§æ‡§∏ ‡§π‡•á‡§§‡•Å ‡§Æ‡§π‡§§‡•ç‡§µ‡§™‡•Ç‡§∞‡•ç‡§£ ‡§™‡•ç‡§∞‡§∂‡•ç‡§®
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
                              <strong>‡§â‡§§‡•ç‡§§‡§∞ ‡§µ‡•ç‡§Ø‡§æ‡§ñ‡•ç‡§Ø‡§æ:</strong> {q.explanation}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-3 border-t border-slate-850 font-mono text-[9px] text-slate-500 text-center uppercase tracking-widest leading-loose">
                    <span>END OF FILE ‚Ä¢ HANS-AI RESEARCH DRIVEN REVISION PORTAL</span>
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
                    Grand Aspirants State Leaderboard / ‡§∞‡§æ‡§ú‡•ç‡§Ø ‡§∏‡•ç‡§§‡§∞‡•Ä‡§Ø ‡§≤‡•Ä‡§°‡§∞‡§¨‡•ã‡§∞‡•ç‡§°
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
                  Submit Your Mock Score / ‡§∏‡•ç‡§ï‡•ã‡§∞ ‡§™‡•ç‡§∞‡§µ‡§ø‡§∑‡•ç‡§ü ‡§ï‡§∞‡•á‡§Ç
                </button>
              </div>

              {/* Dynamic Score Registration Box */}
              {showRegModal && (
                <div className="bg-slate-900 border-2 border-amber-500/20 p-5 rounded-2xl space-y-4 shadow-xl shadow-slate-950/60 animate-fade-in no-print">
                  <div className="flex justify-between items-center-">
                    <h3 className="text-xs uppercase tracking-widest font-extrabold text-amber-500">Register Score / ‡§Æ‡•â‡§ï ‡§∏‡•ç‡§ï‡•ã‡§∞ ‡§´‡•â‡§∞‡•ç‡§Æ</h3>
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
                        <option value="REASONING">Logical Reasoning / ‡§§‡§∞‡•ç‡§ï‡§∂‡§ï‡•ç‡§§‡§ø</option>
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
                                {player.rank === 1 && <span className="text-xl">üèÜ</span>}
                                {player.rank === 2 && <span className="text-xl">ü•à</span>}
                                {player.rank === 3 && <span className="text-xl">ü•â</span>}
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
                                <span className="text-orange-500">üî•</span>
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
                  <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">üìã</span>
                  Syllabus Progress Tracker / ‡§∏‡§ø‡§≤‡•á‡§¨‡§∏ ‡§™‡•ç‡§∞‡•ã‡§ó‡•ç‡§∞‡•á‡§∏ ‡§ü‡•ç‡§∞‡•à‡§ï‡§∞
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
                    <option value="SSC">üèõÔ∏è SSC Segment</option>
                    <option value="BPSC">üö© BPSC Segment</option>
                    <option value="UPSC">ü¶Å UPSC Segment</option>
                    <option value="OTHER">üìÅ Custom Segment</option>
                  </select>
                </div>

                <div className="flex-1 space-y-1.5 w-full">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Subject / ‡§µ‡§ø‡§∑‡§Ø</label>
                  <input
                    type="text"
                    placeholder="‡§ú‡•à‡§∏‡•á: Modern History, Polity, Maths..."
                    value={newTrackerSubject}
                    onChange={(e) => setNewTrackerSubject(e.target.value)}
                    className="w-full text-xs py-2.5 px-3 bg-[#03060E] border border-slate-800 rounded-lg text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex-[2] space-y-1.5 w-full">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Topic Name / ‡§Ö‡§ß‡•ç‡§Ø‡§æ‡§Ø ‡§ï‡§æ ‡§®‡§æ‡§Æ</label>
                  <input
                    type="text"
                    placeholder="‡§ú‡•à‡§∏‡•á: Fundamental Rights, Percentage, River system..."
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
                        <th className="px-5 py-3.5 font-bold">Target Topic / ‡§Ö‡§ß‡•ç‡§Ø‡§æ‡§Ø</th>
                        <th className="px-5 py-3.5 font-bold text-center">Done (‡§∏‡§Ç‡§∂‡•ã‡§ß‡§ø‡§§)</th>
                        <th className="px-5 py-3.5 font-bold text-center">Notes Ready (‡§®‡•ã‡§ü‡•ç‡§∏)</th>
                        <th className="px-5 py-3.5 font-bold text-center">Tested (‡§è‡§Æ‡§∏‡•Ä‡§ï‡•ç‡§Ø‡•Ç)</th>
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
                                {track.done ? "‚úÖ" : "‚¨ú"}
                              </button>
                            </td>
                            <td className="px-5 py-3.5 text-center">
                              <button
                                onClick={() => handleToggleSyllabusTracker(track.id, 'notes')}
                                className="text-base p-1 hover:scale-110 transition-transform"
                              >
                                {track.notes ? "üìù" : "‚¨ú"}
                              </button>
                            </td>
                            <td className="px-5 py-3.5 text-center">
                              <button
                                onClick={() => handleToggleSyllabusTracker(track.id, 'quiz')}
                                className="text-base p-1 hover:scale-110 transition-transform"
                              >
                                {track.quiz ? "üéØ" : "‚¨ú"}
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
                  Interactive SSC Road Map & Process Chart / ‡§ï‡•ú‡§æ ‡§¢‡§æ‡§Ç‡§ö‡§æ
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Track your progressive roadmap from conceptual groundwork up to cracking dry competitive exams of Central/State commissions.
                </p>
              </div>

              {/* Dynamic Progress Bar */}
              <div className="bg-slate-900/50 border border-slate-850 rounded-2xl p-6 space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-[10px] uppercase font-mono tracking-widest font-extrabold text-slate-400">Journey Progress Bar / ‡§∏‡§Æ‡§ó‡•ç‡§∞ ‡§§‡•à‡§Ø‡§æ‡§∞‡•Ä</span>
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
                  <strong>‡§π‡§Ç‡§∏‡§≤‡§æ‡§≤ ‡§™‡§æ‡§≤ ‡§ú‡•Ä ‡§ï‡•Ä ‡§ï‡•ú‡§ï ‡§∏‡§≤‡§æ‡§π:</strong> "‡§∏‡•Ä‡§ñ‡§®‡•á ‡§ï‡§æ ‡§ï‡•ã‡§à ‡§∂‡•â‡§∞‡•ç‡§ü‡§ï‡§ü ‡§®‡§π‡•Ä‡§Ç ‡§π‡•ã‡§§‡§æ! ‡§π‡§∞ ‡§´‡•á‡§ú ‡§ï‡•ã ‡§Æ‡§® ‡§≤‡§ó‡§æ‡§ï‡§∞ ‡§∏‡§Æ‡§æ‡§™‡•ç‡§§ ‡§ï‡§∞‡•á‡§Ç ‡§î‡§∞ ‡§§‡§≠‡•Ä ‡§Ö‡§ó‡§≤‡•á ‡§Æ‡•Ä‡§≤ ‡§ï‡§æ ‡§™‡§§‡•ç‡§•‡§∞ ‡§õ‡•Å‡§è‡§Ç‡•§"
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
                            <span className="text-[10px] text-slate-450 text-slate-400 italic block">‚è±Ô∏è {step.duration}</span>
                          </div>
                          
                          <span className={`px-2.5 py-1 text-[9px] uppercase tracking-wider font-extrabold font-mono rounded-lg border inline-block ${
                            isCompleted 
                              ? 'bg-emerald-900/10 border-emerald-500/35 text-emerald-400' 
                              : 'bg-slate-900 border-slate-800 text-slate-500'
                          }`}>
                            {isCompleted ? 'Unlocked / ‡§∏‡§Æ‡§æ‡§™‡•ç‡§§' : 'Locked / ‡§≤‡§Ç‡§¨‡§ø‡§§'}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">
                          {step.desc}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] pt-1 pt-2">
                          <div className="p-2.5 bg-slate-950/45 border border-slate-850 rounded-xl leading-relaxed">
                            <strong className="text-indigo-400 block mb-0.5 font-bold uppercase tracking-wider text-[9px] font-mono">Expert Advice / ‡§ß‡§æ‡§Ç‡§∏‡•Ç ‡§ü‡§ø‡§™‡•ç‡§∏</strong>
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
                    My Notes & Smart Folders / ‡§µ‡•ç‡§Ø‡§ï‡•ç‡§§‡§ø‡§ó‡§§ ‡§®‡•ã‡§ü‡•ç‡§∏
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
                  New Note / ‡§®‡§Ø‡§æ ‡§®‡•ã‡§ü‡•ç‡§∏ ‡§ú‡•ã‡§°‡•á‡§Ç
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
                        <span className="flex items-center gap-2">üìÇ Show All Notes</span>
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
                          placeholder="‡§ú‡•à‡§∏‡•á: Geometry, Math..."
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
                            <option value="üìÇ">üìÇ Fold</option>
                            <option value="üìñ">üìñ Book</option>
                            <option value="üß†">üß† Mind</option>
                            <option value="üìù">üìù Note</option>
                            <option value="üéØ">üéØ Goal</option>
                          </select>
                          <button
                            onClick={() => {
                              if (!newFolderNameInput.trim()) return;
                              const newId = `folder-${Date.now()}`;
                              const newFolder = {
                                id: newId,
                                name: newFolderNameInput,
                                emoji: newFolderEmojiInput || "üìÇ",
                                color: "pink"
                              };
                              setFolders(prev => [...prev, newFolder]);
                              setNewFolderNameInput("");
                              showToast(`Folder "${newFolderNameInput}" created! üìÇ`, "success");
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
                            <span className="text-2xl block mb-2">üìì</span>
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
                                    <span>{folder?.emoji || "üìÅ"}</span>
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
                                      showToast("Note deleted successfully! üóëÔ∏è", "info");
                                    }}
                                    className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 text-xs p-1 transition-opacity"
                                    title="Delete Note"
                                  >
                                    üóëÔ∏è
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
                              {isCreatingNote ? "‚úçÔ∏è Create New Note" : "üìù Note Workspace"}
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
                                placeholder="‡§ú‡•à‡§∏‡•á: Modern History Short Notes..."
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
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Content / ‡§®‡•ã‡§ü‡•ç‡§∏ ‡§µ‡§ø‡§µ‡§∞‡§£</label>
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
                                    showToast("üìù Note created and archived!", "success");
                                  } else if (activeNoteId) {
                                    setNotes(prev => prev.map(n => n.id === activeNoteId ? {
                                      ...n,
                                      title: noteTitleInput.trim() || "Untitled Note",
                                      content: noteContentInput,
                                      folderId: selectedFolderForNewNote,
                                      tags: parsedTags
                                    } : n));
                                    showToast("üíæ Note changes saved successfully!", "success");
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
                          <span className="text-3xl block">üìñ</span>
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
                    <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 text-lg leading-none">‚è±Ô∏è</span>
                    Study Timer & Dynamic Workspace / ‡§Ö‡§ß‡•ç‡§Ø‡§Ø‡§® ‡§è‡§µ‡§Ç ‡§∞‡§ø‡§ï‡•â‡§∞‡•ç‡§°‡§∞ ‡§ï‡§Ç‡§∏‡•ã‡§≤
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
                      showToast("Smart Study Timer Active ‚è±Ô∏è", "success");
                    }}
   xúÏΩ{w◊ï'˙ˇ˝Gå#Ç	AÇ )Kå(DRØ)ë&`i|5∫≠"P$jT@¡UQ0£µœÌ8=È¥;qﬂvªØ&”r«◊ì8æ^◊e÷¨ÙW—ÚhÑŸ˚úSÔÛ* î‰Óîó)†PèÛÿgü˝¯ÌΩ	…m◊
ÇVœ^?π;xP]&ÉQuiaï¯ﬁ∞ﬂ±;U˜àÑˆÉ∞˙  á^?¨xnáÑæ’ú–Ò˙UÀu…°k? Nh˜Çj€Óá∂Oé¨}J{Ëû_x=˝“…ˇñ?;Bßg˚Õ·AÀ: ÎÎÎd∂ÌzÌ{≥í´	yÖÃUù~«9Ú™Áj5÷∆„.4Ç]´„W{˘Ìkdñﬁ∏VhWW‡˛Æwﬂˆ◊R'Îµö¯˛áw
Œ_^˚ı{ˇﬂø<yè4√agDZÿG¡eÜaËıEè∏»~>‹Îo∏N˚ﬁ˙Ieé¨_"≤°Ï∞ïånev‡{ˇ—ná¡Ï‹dwtΩ„ñgae¶1Ï8Ÿ∑€ûﬂÅ˘;Kˆ¯›§—ù˚6˘Ê—ﬂ¸tqfûÃ√v€Ç…säÜÌÖ•øxîæÌ$»'à‹Ùú∂ùö¿RÑxq±„‹œüÊ'sgO$K∆´RxÓ‚˜H´qô,≠ëÊı∆~ã4[ØoæAZ€◊∑ˆ…≠Ì÷5“º∂ªﬂ∫÷∏±I^›z„Únc∫∞πﬂ∏“"ç◊[ª’f„Ê˘ﬁb±¡–¥iÕ˘Ná‡üj€sÉÍqè÷R_Îî`Œq
BÀâ’wz8áV«ÜiûØ‡‘	Ùi«>…ÜÁ{˝5≤Å›áßuH”Cß@ÉEÛóo34ZWVø∫JÄ÷U\®’Wk‰Ä≠HˆˇÈ<úè÷M˝ÅK∞Kp{€Æé‡•,ö&ÏJÒ˝Ùzæû¢ß¨HÓÖª±ùÖ€o/’Óê·``˚m+∞˘v-XƒÌ{0’cßc!k_O∏í’µ
]^™`uX”» ‚na˝ª∂’¡ıΩæMúæÎÙmxª¥µ0ON@Ÿ‚˛∞ﬂá{Å<gæ˛Ë◊‰ä◊0SA ÃÖl˜qΩ˘»÷`≈ŒD¸<˙π„⁄3b∂ÜÀG§∞>“tr’±˙!Å.:°Âí#◊;∆ñ¥°k!∞M$1µàflÄ”Lô·°s8‚”ßÜ¸#|(	˚quÂ<È‚üÃPsz[â>§f®^cÔ∆?∏Æ≤9€"ú‹€ﬂ©-◊Œ’∂ÓDÏIñL=vU—z6å{C7¿ÅÛÒOgHˇ	J[ä¡£wÁà‡ÏYìRóu¿2ëÍ`ü≠÷DÉï*$Ìà∑•¨-'¢^ù!ã™æŒ©∫"^+0§t…ıºæóY|…fï[á ·Ü!ªnÖ›ÖC◊Û¸
≤z Î…π⁄‹BË5C¸ ‹¬¿Í4ëãVÍ ‘fÊÆ©ö<Íª⁄G©ÅØπ≤√ƒŸTjÔ K…	ˇÍÖ’%Õµ,ˇ»◊¯N∏Ã√oZÓCràdÇ∆7·‹è
fs›rÄõπ÷Ë Á˙Ê√ﬁWÇª•¨‹ö∆=tY≈k¬,;EZv¿∞ngñoÂLv9K\~,Ê∑˙ùÏY√¿Ó u?}¸≈”O~ÙÙÒOˇ	æ¸ë~˘1à˜OPˆ≈ù!%‚JÆ¸æè‡éßèø|˙…;\@IŸÈz21ôaô9ë˘Óàıî»k^+2s>“µXxÆãŒÏ»°Ú⁄Hv∂z¿œ≈¢o|jU(M«óÉ,0´{√}√ëÇt™zUü˙^ØjC+-∑√ﬁ·UC€rSM»\í ˘Ö‚Ü•âMSM´Ppgáró+îˆâF	ìQ~ı¶s¢K≈©àí˘üﬂ™=¥‹¿÷≠U¶ƒ‚Q…≤UÚ=‹0LW:_ÿ˚x3]üˇÙÙìü>}¸[∫Jø`´ñ˙€O?y˙…ªO?"t—ˇÛ”«øg?~»?ù¬bûÅµº≠ÂX‹?ü^Ï‘À´µÙVµ\´ïZ˙πÖ-R$^Æ’f∆"‘o˝Úˇb£k@r≤ﬂ•€újì√-Óµ!ê!a§k¬=◊Û…F◊†6n¿nÂıH√µ¸HˆÉa(ﬂ˝Ú{_§ˇ,G„5ØA®Rè{7¸ÍZ∂k ñ¨Hƒ™ÌêﬁÅF8a}ﬂ°/CÍˇK‹öÈÚ≥ßè?'Ò˜)=˝πbiì]rpÑm	GﬁO9©rﬂrá∞œ—5O[ﬂrB◊V-(‡F]´7Ul è"Xr{≈^©ê∂@Ø) .€]m€_ü±éH≥Î˘a˙=êúC4´,í=œHˇæCU√EÍ–ıç◊UÁRÛ}Ã4ÜhÒ&⁄æL’ØQ}òöÀÍÖÂ€èà7©:LU„C‹÷
ö£® òÑº±R≈D-x ÷—“ÇJ≠õŒròπƒ¯#z∆JˆPjˇäÚıÀ@O‹jÛ“JdT´Æ∑óÊ…Í<Y™¡ˇo˛_Üœ+Ôπ⁄ùÖû5®Tz†3P*÷Ë•⁄Mè{ˆh˝ü®"x<JÌËxå∑´Û;[ôùuŸ¯F*‡-&Ç Ω/Ó2 ¿Õ‚–C	óU”¯˛~Wo÷NÂ6èGFnO/€»∆Õ	<µsßLpú®7sçîéGN|B-æ≥gI¨Ñ«'qLµOdÚ|Å´Ïw9üJPééµ¯¡…>õ·çBz^ñ—ΩI%ñ„°÷˜a%S¬È©W®FÏ¡cN±M®˝s·h{⁄(5Ì∂◊ÔL*ccD(mº”¢—®«π~]≈Û3ñüÚê?êJ“u÷Ì9≠°Ek¯†≤íπk≈üH ÍQ≠UI	ó‚˙åB"ß◊X÷gñUr;iÜ2∫
ïiñÁ‘˜q1¨Máí.ß$ı¬…bÖgî«rB”“b] 3’î2S‰C8ôZo"3©ÜKiƒ”ybt,®o3ó÷ÃöœÖ‹V/î†6Xy1µ’JìgWë∆ø-r3e∞’ÛRR.Ñ·B“#Îd`˘ÅΩ›+EB~¯C¥Î£¨±ÿ…£-≠ÙC/¥\JüÎ§“cÇ$˘>	tw;á§‚ q‹®ƒOò√∑'œª∏N‡QÚsb°⁄sm‹œÿF
ö≈¿CâÔæç+ìH´ÎÏö†é-øØóO	ÒÌpË˜µr¨Ê˜qe}Å§èÉµdz#3˛≈≠Ω+ëÛπ`Â≈˝á=¯<ŒÄ∏ˇE	Y_#ÈgMz1¢%ãâmz)â9≈¥™Ωå	V}Ôÿ∑yU ´(®÷µZºm¬x1q
IÈæ“	∏ä∞M“B®¿Y≤ı ˙ÿ˝•1êkÿow—ÛÇ¶ôv)yVÓ’:∞√c€Ósw»@Ì¯”ÛYS.[ä«¬;⁄ÒÜ:A]X%s[¯7è~˘üÈx¢K¡Öß“∆Áê á˚Ã‘-‹ÈÂ ∑p◊§nÈÇêÿ±«]+78æ0ˆa O◊≈2&ÒPV+$Z ªª_	}ç–#ü∞ˆ±HLõèß,>YÁìFOå1gÒÉñ5≥&¸ç;õ˝∑úÖ 7!ıoÿ†Y‰…Í^kÓyx3ö=Ù‡1f#ú D¥êD¶p]‡éÈº(ÉÌäÌV)ù&ç0Ò#UùıoÎÅ’#Mß7Ñ´aWé∫ßVyJZõÎ%≠ÕÖøà'=
ƒAñcM«< ´∂}Ô¿{†ñÀÈUvg˝ƒ	Æ€°ÔıΩûΩ’∑\ªSRc“â™î£‰ﬂëhTº!%Ñ≥¸≠Ë€ﬁ≥⁄∏%≈Ø!¸=g`≠æˇ_©ó;˘≠„Ù«≥≠™åÙ∆˘ó»ì⁄ª“fMÊMA—K’¬ËEó#úÒ’9•ë^ë_´…™§‘ZM¡åc¸Wƒ[€ûÎ˘,ÕÅ›.LC˜Õ“‰≠Ÿ≈Ö"ƒjÊíbë#XgÆMa{LÚ 64sƒ’–®HœÇ°CìEÇ–∂:#r3TÅ˚Tô^D¨¡ï[{◊Á..î#©FS˛Mc+·$ÜQ‹^9O] €;·éﬂä‡ÃvGÕYÑºöag≤∂SŒÜøyÙã_ì∆ÅR3„»)(ìâÂI9 Ñ‹≤…±[∂5ÃÇ˘Ö˝{DÂVúH˙B>moÎƒn{@¨êÿ¨vóÜ]:Ö$xtiµˆ]“µ‹√*z*Ä"¸{–@ˆ7-¡çKıYÆT…≥H}U>
èôC2B]ôåº!ÒÒüø}AI*ä>ö(5äüø…A©`ﬂ9Í&‡Úm‰&≈àΩ—7º–><rXÖ3ybú˘Jiúy4Ù÷Ëgﬂ;∆œ&öŸ¸·Ì;(4t\DFwπh§ÌÂE @g.m:Ì–B*òÙ7ˇ¯È„?P»‡ó‘Â¸¸e^ÁﬂQÛÔ©Ô˘	¡_™'ÙÏcÊûÜﬂ..vó-∞Z!úµVk(µ@∞@Â˚mﬂA◊E˙ÈƒΩ M¡^ €a≤r´ÅW¿Ú¡~‰∏£O◊†?Ïh¡T±[ÂQ(¸;ÿ*Éê9Ä´ÄÎ˚läzFg˝KeºT† -1o-≠”^HVàí[ﬂ¬-l-‚oÖâLú•3ó«±ª–ßÖ–wz†ÁΩB$ø,◊	+ãˇ!¯˛‚‹Çk˜è¬.»Nµá1”Tp5çãl „ R®Øá"S4¨kwkL]M¶u»ı)$Ó4ÁéôE:k˘∂UÇ–£Ä—Ü¸±ä	H„¨RC;–*uˇÿH+∆RÌy`M ÌıÁëa"Ê y›æõÕêXÏæ7O6ú˚é§.
Ë- V"Â ˚@ôc.|«r∆·∆g¡∂ÌF_ÑÎ\NπÄÍcBµrÜê.h 	|+/(ﬂú∑¯S√À_znU·WR®!≤Ha#5]ç&Ñ«*ÙÄU◊dÒjQ"&\Ø™Ç“–÷·X∏¬D((=´â›PhOπ›îKœ3∂Á{’ñ3†gh CS)ziÅFg0™∂#Û∂EÕ?…÷\A◊ãO$á0Ω]“C‰grAh˜¥ }a}Åºä≤ˆ±ÔP±Sà“v@µ?.ï˜r⁄LŒ—®€ﬂÂ°„Hò.F@„>*£,/ê;§Ô§$OÎ\ó=é‡1WÎ–E¿Ú€]‰ñtÄ"·eÄÒsæM5–©xrf2’O §Lbl˙Cò¥òü–’Âﬂg3√Ö•Ö°d¨ãóµS´W¡+ï0üã≈ãõËƒ_Ò|∫ïG	l
ûR¥j=[√n]˙wZ∆# áËöúé}`˘§O≈y‹cI◊ÈtÄxx¸$óL¢-Wõ¶5ó<∫ËœH‰cΩc^Êñêr)§ÕûâÃï§ywºÜ‰(|°ocÁ»∫∂?Ngç‹≈9Øˆ(ß¢vø˙“…&–‰Bﬂ;ÆÃ=º;ØyHàzxN¨În˙÷aH*/a+ò”>éèﬂZAã—›xHeômË“Ûf¥M∑é@À∏=√q¨˝8aåqœ‹—6§Ë–Ó4†π0Íá≠Ç—™€Õ›(`U=ù⁄0' Ç*∞q‹G‚æÕÁvûÄ¥ä'ÔòJed)f|¬ÔˇiwqªmgÅ¬(1ú%WËLg≤ÄaPëud–_?ë-\CÁ%€aﬂ<Æ¢#ƒÎXå®kQxˆjÍ\‚ª^Õ†6i1ëâ±:?¶ §∂ò«d\?Á/˛Dßñl}Y[∏—Dû¢èS˙C··sdMû<§æFÆøAˆˆwˇ˜≠çV®±Ò˙Êˆ.Ÿﬂ⁄ÿ›ﬂ‹⁄A≥É‡ºFrÈuPËÂX%û¶Ö1îAπËçe–çÄHƒ3©ˇ9m°»5tœÍÉÏhÍÅû¢Iôƒ˘)p…∫ﬁqï…-J3o)ºèJf67
À¬™À˘né©”πõâÓfô%2º*N'1t–pı
'KO'⁄®ÕÕÕhz~Dc_ˇÙÒß4ñˇWQ|\*Ç©ç’'N¿ﬁjêmc<‘ÅÔvî>Ü~N%èâÃìëxû7ÂIç—q€ï⁄•zÙ«T/π^Œó»∑í¨•≤>J#0i6…-ÿ\“†£ä<ãÎ~<„™l,“%ãíèÖŸ6ä∆2¬e†ÜÛ∫D'∑A‰j¯æ5™,’Áx8ﬁ_Ã« è5Qs	è«stx€<ù‰Ñ,±A⁄HË·◊∂VØ\πìÂägî£@MEGé\Póı0fB∫6˙'A;xâ%äyß„°ó‚{‰|ç|ü‘kø´U	 ›·÷Ï˘¡ÉYì{¨àÚ6á>˝ó∂£∂∞/v†µÖ⁄˘á¡]Ìì¥ë|J5[«•7?	Öù‘Ì¢4]≈¯ëtË y©õ∑õˆ¨’cÿ√4k·õGÛò¥¨Ê9AÈ'^®3‘h@ëÂÜ94∂ªh¿éA'òèÃ⁄ÃèvXº¥Éíg†v∫ÎåtJv¥Èc¿Ïä*æ#œzî7©ê-)v™c{SYíbˆG√—&Kïtí{⁄Ÿí‘€DÇA∫ S¨‹-Fﬂz∆|0{6èoIó®ò∑ƒ<¥=°´©,Â!ˇÂ“˜d¶—Ï8´Ü9}‘c°zï≤ıQÙÀˇüKA$«/‘≥i"´·éßLﬁ`
$A≈“ADÇÍ‘»!zÖ91ƒ¢¡º∑müm|˝ﬁˇÂ…{	uxÉi«©ÖOsFÿ·ä0:ÍPˆÌ˚é}¨`ä'>øëﬁ˜∫Ô™ï	¶ê/Ó´c/Ã*»Ò˜¢†k#[E‹ï“ïSµ¯´Èü®c¨w‰%ç*FÀcÇ.d˛œ¿oØÜÚa‰|F?îıÖ(ïÏ¶$	qÈP¸‘bLn@Ô#õŒπ)ÁTç'r…ƒvuÆjTƒ"K4ƒSk}Fç_–Ñ\S∑FPÎ˚Årˇ->˚Ω.|G∫∞—a®Qß%4	Sï[´≤‹L%B&Vä!òŸ	õçMcD«èe±˘Ô0äÖ‰M⁄46%º≤∫<M1Ç®oÛFbÔÀ{bodÓ/´]Ã’‘Ë∑QM&€¿™ÄØÌ;˜©Nru8-≤9Í[†⁄ÇpÎÙ·‰ıŸ¥wDnzmÎ`ËZ˛àzF58°…“81x–Ú¬™,â„d¯ ÉÃNJmVß$h-ÈΩN í^7P "NuÖm˜ûO#≠®`ƒF}é9??é“Fßz'2Ü˛#°ÈaæC≥	˛»`’ôAÚ(,™=⁄(É¸MäÖ≈ûQniÂ◊KI¥nG5O¸°Àb”—WÎáÆû@ª|^Ë‘E ZFg¥¢t@µm„˘/Çk∂’°Frñ\sé∫.‚¢•Äı_1‡:°`ıEk·Wq¶LXßª‚N∂‚«L¥^µG‰Õ!˙PÁ äLKóõºÇaØg˘é˝ÁÖP<¥AX˙›Á˘…bõv‚*3tÜGËzÓ[Ó(pÿJyB∑Ñ¸^ÒU*‰„WÒgQÕh©•0o¨,M7≤ò@ªÂ£⁄¿“¥0ºŸ<ácwË f√Kn ûHÙ2BfüÊÇ9üY0y€˚©ÀfßñU¿∫os‚®d≈} ˛“tì>±«≈ü'yÂ^Ia)ÑPˆ˝c·É√ú ]x∫æèœˆj&_xä‚t·Q‰N5D/Nà/>è·U≈≥Óhe’aÑ>ü1—EJkr>√∏‡£˜ƒ¿G°áöV\Gäs ?R=˛c•6JŸL‚-\gﬂ¶ôò<Æbi¿°rº7„Tˆ†33—*Ç„¶i-Çœæ59&¶ñNB(©¡Á1ïüQ—ªybY⁄ﬂSYîËﬂ'§rBß/zEG&Ép*≠I¬GÒàïKÄÎX:óÒﬁÊºff*ô%wÊ=¸~ˇw&Ò›Ög ßa~c¸ÄA+Ûî7º¸“Å-äû•{<ëë/tF}´Á¥I0rA∏w⁄ÛÅÜ.<!Ù@FJhàÁπöpµMWÈMíˆ—Ów´∑Å?¢C—FfÍk“∞ÁhÖ"KpúL=cõ4ZÖï‡ÛúŒC›≈YãLã‰<$ìd7ÂXŒ¯0NI⁄¸‹÷$ÉÒ±:ü‰nhÜ›Üëk—ÉıW!É\≠ôTÿ`ZêÚ§DRbH˜Ûîl¬)6ˇ!0™£Üäù=ÇD©Xi^j@_):x—¥ì0œ[⁄≥a:zÑ/ÏxmÀµ#É•GŸ%◊Möô”è“©—Ò¿(î∂◊?t¸^e¶¡†2†Í«Èÿ˚F¬.(êúmæ2c•†∂5”å%é"¿vì Äû Œ@Œ¿ﬁƒπƒúAÚH˛éTD˜E∞fõÁﬂâìi÷"±»8LsyVs(Pâ«=ç™Vö ›z ê†G—Ò»ôıôM6œ|¸Ù7ö,≥o}¯sXeÎAÔFg◊©ïKv†Ä|9m&gô—ó“	"x∫ëä∑»/P‰£•D=OWëè6VVe¬àCïqy'yt$Ô8ªY‚G`zØQ∞∏;í8ËeñˇˆwñÍﬂ ù≈s52H™
H∑o©"ùSXF≥äÚ¯Ùúô±o3∂lrô

òn]71jøXDEKãô–îÿ,îµ˙ÇQV◊‘‹O{˘àã“æ`Ñï™8™#≠ÿrÕb˙TˆkÙÒ|E¡ˇXÜÙDiä
…ŒjE"êN tZÜà˙zS8o´.wªhä‰c¡√‚WÁmaí´ò€Wo6PÑ%KùTCê¶∆ê–ZX-ÚFZÌ.Ãm:	.+CN)`XfK†¬jf®∞¯ïÜ>—3∆.SûV.3G«Öã≤†\xs{Îñ643›ËkxÅÇ¥p<≈ÓœóDû¸ô1
KG÷®(–˜|™¸πâm∆V.P0∑ä”Õa≈áÉLº‚d…ÌDPô‚b∑^¥:∏S3À3~	T-eΩ'aS‡ætıˆòG®8A⁄}p6ö 1
Ô2h†Å¯È„˜Ë~ˆ|˙y˘{∏ºLÏ„≈≈n]8)BÎin«SÿRX∑»} 'ôOtû'˚±â´›ƒëôSY0ÕØRq20w4∑µ“Tú ≤{<¶ -»Œ[¿ö]4…¿≠ë—]´#‹'%\jí¢J*Îå°=∆Ã”ZÙ	*˙l@8ïΩBZhìA˛‰¡∞˙ Iêõ ÈÕ.®m4´ÃmUáî}•Åæ…àŒiÀ`Z“)íÛã7âUEû˜=1°¨*M(À" ¯µiE¶Ò:Ÿ†á#≥ê\e∂!Õä7»…sHºp‚ÚLí%@‚3C¿î`zŸN77¿3 pjyTYÃsºHÛ®G|åòí7Älz'O`ú‡$ò$-ÄAR ≥î œ7!Äq:Ä)%(ü
`:â 4Œ'•…`|=æ$·ÙÉˇüyËøŒ °`3¶AˇßÚ:ˇS˜7ép5
ıü<–øLòˇ)ï∞,‡ˇØ.º_ï1Â–~Ω”YõÙ‰¥h¿8†ˇ_o8ˇ∏¥0f(ø1h∏ò‚'·o„ó
ﬂﬁ¡˚/TË˛≥‹WêÖêî‘ÄÔr˚œ>\ˇtÉıüS®æZ=Nòæ¶∂œ∑(D_†oû_:8∫°˘œ%0ˇ¶4˝“q;√Mh“Ä¸Áb˘,ÇÒ«å´4	ƒü~˛©·ø¿ãeº»„q”¸<oíF°˜cRΩaÿ˝©›üF»˝ü…>˚„(O=”0˚•“JÑÿO9¿˛YÖ◊ˇ+ÆW¬“ò¢ÃÃP/VH˝¯ıß?•pzÉ‡Ë	BÈ’F∏q´va,ì–O>j&õ1BÁO=p˛EõWXv∆ô?•Ä˘©ÑÀªÉÂUvTÖÊî¬‰«í◊á»óêˇ∂Ö«kú9ßoˇ-	ãAÒßo:c√b?F(¸≥Ñ?˝0¯©¡Îß’  ˛[˛>Vª~1ôæõÖΩõΩüB»{ŸÄ˜IH_∞`˜o]®{π@w3v´øHF:FÄ˚≥"¢g‹˛≠m/ÿ˛lâ…8†˝Y“ãÃ˛CŸK≤Ñ±Oç\ ∞?´ı4x˝ôáÆõMÚÿ˜À°Ó”fI"Ògç„“õ[ÕÊˆÓrmªŸ⁄›ÉÏÏ^mÍ‚—AA;⁄iE§+Ïá”åM?ùàÙ¬2ì⁄AUqÍÜ®_cî]=´4Nˇ“€=¨ﬂ°¸9Ì%[HØﬁ&u©E/8K€d£kq£˚_Q£ÍÔ©¡Ù√Îˆ3ƒ®P¨◊ªÙ”?Sÿ üÚ!Á=˝‰'O?ÆÜ”â)ﬂË˙^ﬂsΩ# 'ú®—OÉ8†cmËysh®˜°;ë⁄&ÈŸ¿vÚÕ°ÛÅV¿âûMùP,Í"™?O£TY :ÛG“]´lyÒº‘8adé(N«É2'≈«f˝Éÿ≠ÃÌÍLÃ¯›”OﬁO˙ÁÙ˚#˙˝Sv€GÙÉ3°˛èîﬁQZ;;lFÌ@[TÒ‰)CE≤6X ˘¢ÆçT®Ñ9ìŒ¿!‚ÎB#F.⁄úyäyº˘ÌÔ‘Æ,ù´üªìX,Q\ üß˚˙wÆl6VW$ÈZ∆˙ö‹€Ó!∑Ä§ﬂ(◊ña£u.<—¬KB‘£©XÃ—ƒÔ%.;ôÒBºDpØhÇLb∑-øÉA!ºŒi‘ñ,AªkPÉuï‰Î
Â¬À;õ µÕ•sÚi–…OMNvá2	¿VÍ"£-%ùÒÕ£_¸˘·k+îKx‚" ⁄#´Øc–'VjyGKyöªÄË&ç ?ûùãúo§‹≥;BÊZÆÕBC74∂Üﬁ3	ÑU≈–Ÿ√sÄ|Î…„O‹€JEÅ)PGJ«U—›êÈ;„ÈoÚç˘¥)ÄıÑUda÷ë˝oúﬁ˚1pÁ≠∑`M¥¨{v
4êX]'f(£•XDÿÿÈH‰ëpí.ä#ÙÒ¡/»D¥ëMﬂq›i∞à¥˛21Å∞k)
¡ÔßN"^o@Ωe±:QäJbÉ@\9Î,πB˚L6‡ÌG›µÙrO‚êœ˙ÍPAë2âÜ"÷GÂ√1©\Ga„ÄõıHlöRØÓ5√§f–®|`à‘•
˜9Ú-û2µqûŸútGÛd„ÍŒ¬¬¬úäZ¥ÑÈ¡ßYY?2Ω‘#@V[VCP£Â&¿†‹ÍQõÖfÑã|d2›Y!›6ñ¨Î ‹aàê÷√°! ⁄‚ß
&\nÄUªıÛÄT!AÃ»3§:˜¿GÔÇdÙE^g1!»ê_¸Å∏ª
óØ†R{É2C˜jæWf5‘¿Ó9∏[ó¸…m1˜&NgçÃïÕŒ
Yáoy’ë€f…CqB˛™'$O)(5∫˚9èŒ>"|#±S˜*â§üêN∫[Ÿïæ6U∂QÈnEãSÊŒ˜ˇÅπÑfÖf
ûÃ'¥3ı*¢»2x À .4∂aÒ˝jTaO!V@¨˛»`Ÿù‹M'Ì”√ôsXŒH_ícl∫¢fR9Ç5U·AxÖÃ◊éxÈπlfÑß]…àXA›ã?•≤XØÕ*^∫F_ö8Lr\ß∞eLM)Œo≤W>º+û#i⁄35Jö≤$`
˛%g`¬ì"Y©qskìl\k¥"_H>l¥–)RŸ>Dìò›FÕÛ#ö»O'9Q–õ»®†õò∑Ã·ÆU–j…%RogRπM‚q(‚ÆãˆCΩ91 Í¸ÄTJN[∏ˇ f†®:£’œ)ƒnIBΩq‚≈£ñ±3Hh8R,‰dg¬L¿–ó“xåÿïπßﬂvá0§ï‚MŸ+Ád’ÿ≥Ê§Î ¡îmÛG)X7Âî™WS$1_ÀU÷ïÇ¬™ıΩ`¬â£M⁄`e®πaò<3~éëü=µ®rÀ≠ê8ZêôQÎÓßrM<á=¯◊:≤˚ÿu~B›æ≈,t_Ü˛∞ﬂFø08n<C+kZ™É2ó±hpsÖÆ}1Z9iËòÄeÉ≤É&%“ÚI3Q=ËB´ÓUk:B6>óÜ=ÉàáL4"¡JûH†¬ëœè¢*‹ˆop[Ïˇªª„YÓ≈]#3/ÂàmÊÓ<ô·π•ı–e-(YûIz¸|iETòRûç«…ä	ÓÄ˘“ùåÜ®ç0∆„–Có7£Ì∏ílU⁄»ÄÏT‘3nV%4|±æ*œÏMœ’k˘ ò¯ﬁÂ\L¸C6ß¨—ƒJìRû—≤ ™^à„0ÉûeŒ†È'Æ’?¬Çå–>@ñ≥†∫ÃdÂﬁfæü$ÿÍ∑Á>‹˜û>~gTèÁ^ƒNÃËfÃÚ´JÉı‚S&,çŸÚ≠ ãø9¶∆Û.˝õ	0ñQ..∑Ÿ‹∞Ã¢FFΩ‡≥çvZÉı§KÂ°Ã%™¬†ù.B#i±k˚ª7vwvØno4vHT™õ€≠7H≥µø’∏^Bâ:S–êJ(BíXG3U(QíÂöèx:ê¢±≤0£±B@@∞≠^
@ÛE*s…OI?|&@ßHµ ë]-„˛0ä,UÜØòÜüWE¢Ú·ñß-£ãÇÃOá ty◊Y>1‡Po3LE}Ú8 ˚¯Ù√ß$¬@ˇ=ﬁB!GﬁÛAîOÈüëÀ=˛üÑﬁ√ÚÀº%pãÓ˘æ§Éâ9O|¡©·ÔoR”˙#ˆö?∆_∞ËWÔÇ∑~ÚˆKêÆcy\™le‘Q¿™ë2ïÿõÊÈ‰?Dõ)7µê¿∫Ü'1ßû^?G|;˙}rhπÅ≠íœRØLÈ‘∫ÿπ∂◊(Ê-3Dßì´ÂCﬁR⁄)ïÊˇ&kÿH/ÜW´ﬁ¨⁄Wyõ@!Sû¥{dlÄvjE~√πºlupG$˝°ÎÍÊ+ûˇ∞G3aÈWhÒˆÖ“MÇ ¿Ó(6)]ªâûXéóB°œ"ÂµjI ·ètç7ê‘dAlLm_gÓ¸~-/ìu*É˘KHÏxncŒ)œa»™&=‚ÏÃ©8wnëFè~F˛Ï«uÄvïÙ∞“ß2™‹yGö£~˚ê∞*ÍâmóæuL9Xz
CölxæMAï≈ˇ3brkˇ!¯ﬁÃ‚<ôùùK~ùyâù˘ÅÍU|Á“QÁ±‡6nl£⁄æMª'±q/ãl‹ãQ)K&0sèzí3L®
Kçﬂ©‰uäd>™g…lëò“Œ,Ã/^™FÂjÕMΩ¶ırcS/#Í	ÚRòf¶0åo5O#í”fÎÜù?âó±IÄ•QBi∏h‘Ê$∆º•ëÿ<Õh–í+GFÌ≤†ä2˘∏ü9Òÿ¨N≤©µïc§3¡É[˜∑ªWIo	Ü…D∆6Ó≥£kı;∞Ì>≥è— É#x»m˙TM`xådàNÊ4âBÜëÏ÷´ ÀÂÌƒbÄﬁ˙ãá[l˜H„»r˙zg ;Ã\xËÖGa’∆‰?ú:çïü∂ƒ˜ïg8µÕä¢Ø„iûπ‘‹ÿ›ﬂ2/.S+sM≈∞˚ôK…8Ÿ©˘;Õv/ìy6gZb7—¿n;áNõ√ vº£
˚Ê’h„˛≥Î»åyh›GÔ2ÀÌèÈßGOŒÏ≠?xüD°†yóã §Y±>«¥s,≈7⁄i›Kx§]LÏ©Ò#‹6>Xﬂy£ï1]ß}‰©:ûË9∑¡≤◊^¢ÿß™+Ñ
ûeÃ]gú7a≥±ΩÛπ∫€ÿií≥§µﬂÿxuk>ÌÌÔ^›ﬂj6…ı≠÷˛ˆÜ6ó¬ëgπ¡s»§ Ú◊y˝C;≤ÏÛÄ’ã${ ∂:m◊&ª¿ä∞¶†¿o:–—ëÌ«˜yËù4ÄÑæjçºUE-ô1°™}ÈYÇ	Î"-ƒyÈD\«ÚﬂÅ¬Ë√;17ægÖØ‚>…D€⁄w…	c°X<bç}ƒΩ˘ç Rmı~wéPY©-úõ^åEË+µé}4˜¬”+Øë•HÒK5≈`KH^∞¥∞ø`˘\˛5Ÿ+ƒgbÍ¿a¿m≤˛«eC◊
C∂¿ñq‡¥´ˆ[éÌ√,Õì⁄¬y¸≥<OñÊ∞ﬁ∆±ÂwÛ∞¯ª»çËä<òmNVQX
‘ÅôéúM“3ñÒTa˙)P(]BË”,åC32êÆl”–Vç≈ıJÎ¥(Î¬‚vﬂtﬁ≤˘≈ò˛·‡Å‚Ü§¨Kôﬂ÷¡œÈmµHÍ;,Ä‚ÊÀÿµl◊ÉDÙ úÍ
÷∏»∞)9w¢ØUÚû"üäW‰ Ñ·éÔ@,˙ [Q—JóÙ<'qux¡]î˙kÆ≥tl[KóW.ﬂYºê7&¶õ∏\£µ““˜¥∑=)ög\Êr^…dª•%π…·bpVN9O/Âs˘Vî´±®®( ∞Y…j∂…ÇJg.]ı(ê¢ç^'Ë⁄ù3FÒe‰ºˇÔqeòLû≥3*3ï6ôÃÚ*≠™Ù*P˝Ñ·~z&ˆˇsL¿_Ú/<s"£>ePu9˙Ä
æL'IPpÎ«Ï9èÈs™‡Ü;¯8˝ÂãU Ot≠ÀnotZ˝9ùMΩNb(áœô’ﬂøuiöZ4®t YöXÖ8∫DZ∏nlåNe?YPeåé·ÿVcÈm™;|!$ê”…»tŸM¶mÉ
‰C”∫á√F,c
•ÆmπaóÑVp/X [˜¢—Ó⁄Ì{=ÀøG∏
óí˚N0ÑﬁGri3o/nÌdÀ8#Ïó<S˛t·“=nC»˝ìº3&uÃ"%¢Ë]uºÑ<éEHˆ42U´c—û7WQs7lÂòw§Y”˘v†H {ø§PDj°»aM\∏4‚L πt¥–y-â˛_Ã\ù›ÑkJ
5rõõã„*öèO4πQÑw‘Ø5AŸ‹¥LPØ»(ò£0óÇ,™0 4(ÌBÀΩ”FW*F√£[x÷˘*Eb´=¸ÓÑ;í<‘/ëUo9Åì ¶I0…âPà ‰Çm7'∑gØæ
<x√πÔ`ÛÏVˇ≈≤è
ÒƒkC´:!MàÄﬂØQN7";Œ°=ÀÉq€V(ı∆0/<\A«î¨ÈD¥”Qá¯Hëí∆“u∫?ñOï¸ÜvúÕ"uìú‰BVÙJÌYºEZKﬁ∂»ÆI”êËŸÇSJHù~™.BgJ° 
@lŒÈüHÂzó∫–µòóo“+ΩtAÿYÆÆ∞GÉYÆRDç∂∆o}ÙˇznœsùpÑ∆∆¯⁄,…≥Àﬂˇí;ù∫!≥$¯ıK≤gi$˚œ˛…,π’W[≥F=NnyíPÎ√Ô™_°Æ;Xÿx∂€∫0€-˚’<<QåIΩπ[ÿ{9?bıv5◊¶’["”Y Ï2˚Cj¯Ó™\∞„T=+˙Ô$f-1Ë	Â.ˆ6>ª»íä&m˘Œ≈;-Ü¢p"y&˙ï:ÏyônZ¢ÇaBÈvﬂø·π√^ﬂHÆÖw≈ı…Í$è†“e¨âÀãEeîå§⁄q9Â‘Bf.1Ÿ=¿¬)NºûâÛd±ÏÂ»¯£Î¥A–∂L?:–\ÆúÄµ‚™¡(ÎÉ“#
0G™¿t5w¢õë∫DU&˝G>ß4„2ÜŸXsE&¬e5‰0õÙ„¬jJêœKπ©§πò¬.tÂ®;´~	KÚÉí˙}˘Ñ±⁄¸Ú*7ßjŸNh‚˘œ˘¸˛ßÂπ6í]ÂHö¶ö„*5ºƒt”ãk`î5˝fp]jÚ¡√ÑÑ»í—j≠@C+ô∏aΩ‡Å4ì¶ëók9»AjoL… ™\3*‚¡CÌ!>·cqˆ,π∏Å¨KÊ+BﬂªgWo√Á;h	SgÌ◊{∞U∑Î˝⁄(õ|åH÷8Z¿+Ã¬@Êò¡
Ê(¬“ìm5∑$ot˙îˇî(Èvíhòßú˜@á–‰D5±B˛¡‚åÕ¯G∂ﬁXzÄœ	ê>+!zÃd%"	M†ßƒåËVÅ™D≈Ò¡B˘±—È–Œ≥å¯âI:ÆˆQB∂,]ÌñÄX!QjﬂêYg’ˆŸ±$◊±*‚é+}v:dÉUAß˝îx∆>∆–⁄Oxqdπ‡i‰∏å•Aπ=Éb¨&»+À˘Â¶¥}Á¿&-+∏ß)bœ≤à 9Ä.ï(ôúûò¿sûÏÿñﬂ'K´‰æ◊∂Ü.VëF}Ø?Í©Î»Û‘§}˚ÁÖ¬§Â‹EîòÙFÍN≥î§xm
u¢˙‰(¨ o»‹]©—âﬂjçß5)f/+	SÒ¸ÁGíëQYGç∫ ê©*<UC≤≤r∞Å¯õFÀÈ	«È±=ÊRz}ó/Ô…5<16ùà +™kÖÛ~∂µë›‹HX/&ŒÕ!M¢P¡î Øñ≠Ò»ÌÁW≥“π8©l^Œ?E^f ∆OÌ@cÊg‘∂`ÙPÛ/ßoÖ—◊D¸´nóíô%f'Ï◊Hax4ŒæyÁârHeeãÏö–$s∂S6∏€˝¿ˆ√&A2ñÚ)íè3
t€∏®§ñÏ˘ˆÄ\ÛÜ~ê∏ˆhrÌRR7üú{ÓR^÷^ìˇ™OI3s©9§»d4ÿ‡,2å“o¢™MøgÈP˛í&,¡l%
3§I¡«’b¡GÈ¶vìB5ú∑l™`"V"+r/,êÎñ”1“Ë ∆ÜÄ:∫u\^¡>¢u∑–ƒ9Ä∂·∆DÏVj°£5	’J
≤dBî6⁄—`' U˘√‹ù=Î¡MÍi='Ù[¶/ÕxF”ﬁ–¡Bóœ-{Z‰ï?P˙ÉAúu‚•HZEÙ∞.œ`Y„=I—ú÷Q0òd“êÁúûIéJ∂%ªÆ3¿ ©Ay{iÖ˜æÑ0[6—ÜfvQµ‡?Ko‘à°q„ıA:Q(rÉ ÄÜCUó ∆AWW®1n≈ƒ‹¥Z»)˝ÚÍj·TFÃ6É≤òñ\7	•©Íáﬂ8àQLy=ØÔ©*≈Y±N¯r~HÆ˘JÑTÊùßE¶Ú˝©—∆4¬§`î81\ ım◊Ö–ÅîöiÇ
%Ø}ì >@7¡û”Ø¿n7ü⁄Á4hvhbÏÙπw5Åe€oÈh∂gXxc˜∆∆÷^ã\ŸŸΩµq≠±ﬂ%ÓÍ÷Ó’˝∆ﬁµÌrΩ±ßi…«8†Ìú †Ì‹¥⁄¶ÖBè_zJ5Éü1Ï¸4…ÛsæµÓ<Neà:ø∫›ƒ¯¡∂=ë^xY#ßùH¯>U<>¶∞Ú?}¸í *≠"˝3ää¿àXé>.TOa¢¢¬C*Ñk„t¿Ë‚®Z…ä¶¡∂º'I^»hßû∞ê^˜∑QGˇÈÈ'?J_äΩ¸2Ü‰≥⁄…hú'_ø˝K8Ò_Ë»}@S\‚ßèX¥…_±AÃ?ïÁ¢dÉòâÇ!Qb 'º4Û'ˇ	˛“≥Q_;¬?œÛ&≤∑s'Ky¸ÙÒ'±;·+ñ&3N≈˘àˆ 3?JÅ^ÿ˝OX¬ªIàäÃE√ïAR¡ /,ƒdvmÀt\€ 7Õ ˆÉL›UÊc]ê› iˆÏ⁄ÒBêé„É(Ôé»Å˚‚°!©TUfd;◊°m◊ΩéM@≠“<v¬vW»àJË˘Jlih=π8ò2¡å RU4›B«Z÷AeeåÒg%˚XæsM◊Kô°râ	‰„"µ·ˆhsŸÍMö,›≠æ"eSKqX>Á…o«
M"À´	ËFloU@¡.}ÛË7ˇ%f∏W¢Œ!È©‡]
3õ9!ú§I·»ˆfÁ~@ûâ*Â ˜ﬂ∑èh1∏≤ô?[Å{v@Â¿∞ù‡vÌ‹.‘^<2¬ÓjàÌú/>˝|¯?˛Â…{Èù∑ñ7‡	«!£í·◊w7∑»íH‚‰/Êr…¿≈Xl
ÙG¿Ó€>÷n0D¬8¯ Y@@ÆÿM= ´;tì»$Ø€Kœ	cÒ	±>@ﬂ¥≠°V`i1Âû˜ÃÊVoEæÏHa?JºL∆,ÂêUe/X¨N£DM‘Ω\Ö]d¥¢ó9WSÓ&™¬£Ï0¡ƒû˛v<ÿîºT ®»›øëΩ›‹„üÖ-®=ú"W£4”L>Ifv.÷2ôD√ﬂœã”≠Û`f&u~B•ÃO©‡ä˙íã∫Òe_¶£ì
U~¬R≠ëˆ1üŸÄÏX«¡<ŸÎz°å˙ |_:ø˙2Ÿ∑Ô{n8OÆB-≤DÊìÊ( ⁄íóXMé52”ÿ÷=,˙F3Ó° R&g|∫èÒäÆö∆ﬂüi†Æ1Ü¯3æ~bd˜í”ÚΩtCX>,(5xcµ&o†’ûë+„)mô
Ö¶∞∆.SLŒã pø∞VnzN[ô2ãØßQ9—Å≥õB:=ÏïàëDÉ2p¨∞˚Nˇ(ÍÄv	Œ¶≤å	jH∆à√åˆÆ[ŸÈBë1^<ïêª¿Z3âp˘i^%"üﬂPın5‹@ùUl6a!QÚÑ'ë˙QFè¶à∂™C,ÊÙW îApÇ)É∂\ºÓ¥w%†e¥ù@"≈J(É*
ÑŸt©ä‚vg.IZ9üﬁCÖ˛¢O	f!ï˝™Y˙l·T¶ë/¸éXÆ›YáŒq°:ílïXE·Ln„] eøßJ—õÕÔw.Êú 	wX⁄’–´˙4π\F=Ù`U˘7˜M_≥öàÒï¶∞Íí1bm¬<§%ìê6ƒ5ûI
soI∏úl&(5…ƒ» Õ∞„¢∆øo˙v–›8ñEDå.8}mÚ<¶Q40&rBÕöÀ¡óÆ∞˜Kã∞òuRT=√:•‡ìCkﬁt¯[fiM•LPg©q«kè‘LÚ*GLéºRÒöãã®ïá]e™ÆÂfM&ò$ª≠ﬁÄñfBÄX˜CEÙÜ◊±«,¶BΩ‰Vñ‹i%JÓî8Pz‘w¬òÉ”Ô+¢¬˘'Œ°˚0õS*cC¥b∂≠)9¿$˘D‘J⁄ôeT6ñıÑ+44n∑PÔ@f}÷CÑ≈à≠ÉLVﬁ;W«ÕÀ◊•BóJ¢G‘∏˛YÏê9Âóq
©?—¥™_ë¥g"cxg"„:–pòÊ(≤ê‘ŒqΩ«Fa/é—_ç¸1î¶{ùòZLëd“1VÚL:˛ˇ9v¬d˛Q4ÄüeF3q5∂”EøﬁL?˝DÏˆy˙¯}6W<˘Ìßëk‰ô≤b4F„ÒØü>˛üÙ’2J‡Û+Ò˝ë˝Z“$Ú¸§ ìÒ›  ›W)¬rA(Å!:vPâ:∞HxJ¶>2Œ¡πq⁄Vˇæ≈R<Qﬂç”'6MÓƒ>µcáñ„ö´HÂ©â®Pöﬂ_èÁ-˛Pæ≤öÿÃàá‰4Mi¯˙ŒNı÷ˆfÎππ›|Ω±C=Ìç7˘≤™6ŸÀ"ø!Xì‰Ä±EŒ+"óπ/åª·∑˚áû¢'Wò–Ù»∂ô∏§Ç“Ò.ıÌ/ûßÓ˝e•≥\—2cá{¸°˙Ü€…Ã•oΩˇ≥ÒÉ@IJt95¶ ≈v%w·3>√2À}≈”xW“»ÄvH6Ërü£[˛ñÜp#µ∞ﬂïê˛)ƒèö§TH
cÂÎfeVÚSù√‘(“/Iüä…e(®TNe7•≥Õ£üˇï|ﬂ»¿;n9—mË”ƒ@∫HˆötıJ,]…SÚ@”Ú^{ÿ»Ô#>(Âúœ˘ﬁ51:ÀÑ:8*¿JnW€ï≈ÅÚáÀú1ÍÓˆrΩ∆Àÿ‡óÛÙKEt·û±Ïsµ∆R˝NûÌRóëëDu≥eÉ,wÉÀvúæ- k¶ÍõuxÓG*7Óm¥&Y~l©¯GVeiuææ<øRü«ÿ±4x0ü≤3„˜π˘¸}0ıº·›wË´1•ÒZ}e‡/œù(ı5,Jç:¨%`H}LŒ ÛÊU≤gÅ"g4^¡˝#Âx≈4¡BuY°5+>V/i∞
LÛƒÈ<0™ƒÉ^x∏ñ©§q•T]·M<xxÅoﬂ'Î$j¬m|Vï,›—›mTöèãG,l‡nõèø◊ØætØyx˜°	˜"íî¡uÑ<XÇ∑ºtÇ=¢I¥ÕJ˚åRwçåÔzPßw·\ïyWÍ.Ûw±ƒ¿Ñp’WVÁ…“Íy¯Cì∞ØÃôTÈàrA¥Î3ÀeÓŸ¥Ä˘æ5Zü9GŒô‹iV∆¢Ì¯m◊lf€Ë∏Uÿ‘íÔ6Ósdë‘çá±=J=d=dTÓ!˛˙ÃäŸ‡Ç&¥>Ûù+´∂jóÕnI3ô»áÏjJC~qÒHwë¶hñ¬=•≤ÄK„·(ø!‹êôaqN√à'‡ìå◊9O”µŒkﬁ\g|e∂Nd†î"úéQâgmQ√BFî9ÚÎiPÑÀj§˚BáeÓÖ’ıé7©mw6ˆ‰^Öñ–V¡@í#Ì4ç˜<$+ÖDi&YwEJÔ¨∆0™™KãıÙâ=!´Æós\0èKú„ûºU≠‰`¬#¢£Â…<∞QúÜs#€EYn5Ûr!…Õï®XF·A¯Oú`©qWÙ°·xƒy¿Æ,Ω\o‹YºêO˚%∞ﬁÆ‰¢ƒìˇπ8úÛ&Íjo.;‚Hé∏÷Eº{Œ#Œ"952
‰(íUL¯≈43ù;g¯Â˙b)„ƒìCV€úÂsò¯”3ˆqeÊ∂Ë0îßPÙÇÕo…§h¶aZA´é¬*3Åî®*±L&fsMhò∆U\©++∂0ç≤πı⁄Î[76∂H≥µµ∑∑µO.7ˆI£E.Ô∂Zª◊…ÓΩ˘NeÙ:ˆa7‘∆î‘… ƒ‰ölÂÜ+ó⁄Æ•≤ÅîM>§3*È=ìbkí}N*ILb!anç.ïÜÎ&Á“¥ﬂ⁄˝∂Ω6ëE°‹ƒòÖN§€MSj)£±ó`dä]⁄ÉÍAàj]$«I”œPñ)‚ iBôR®r14Ãh()hdaÂ:IbÖ|P©™◊…’I0ì≤(∞\>ô,Ò&åì`Ü&§a≤ç—ïülfk$µù$’
ñŒ√P¶~Ü´ﬁ]CHÊ‹;ÀQ©›»`g4ã¸ùPüö ¢˙W‹…6∑6∑7≠≠ÕhÔ⁄˙˜{;çç÷ˆÓ≤◊∏±µÉ‹ºµô˚8%∆aqêYÜøW#7¡R„≥J<…∞@u)`Åü,-ºpÈ‰ÊÀKız˝πÔX)O\_µ≠•F‰VK6›ƒ˛øí˜≠%°¨/õyTk˙–h”lûÆm56A)gˆ=O[∆/BiÂ≈i4m3,q£zN±ƒ
7ægö)ÛÏ¨òVWI¯pﬁ#Ù‘±xŸ„;â¥pí“6¥¯A•è{c?⁄Î3‰è…JMDy£ÚÃ˙ú∑Ù*≠Ùò‘ËI…åŸQ Áò y⁄N4πŒ®(∑B˝à%E¢¨™¿¥0Ea#ÒùU(ÄÜmPLfô„†«¢Wm%Œ1ç˚ìM§°F&Ä0πG1ÜCó'–z≥ˇ∫D≈p\Ãís]Pá<äÆ1MΩ°ñ‚1ëmõUãÚ÷™πÌ¥Ê“x>tAÔ-òÂ ›óÑ√º@ÚÁÅÔ¥ÖßëÑﬁ5H	ìU/33aû›∆ˆ•‰Ïrﬁ¢‚…edv”Ë:ª!cÑE7˜/Oﬁ+e9Q¡w•ﬁ˘'iW>Â.˚∂’!Ü®~˛ˆXä=4—å∏äãLR~Û”©º…˙@)€Ù-Æ2ÃëÔíÆ◊‰q5ˆúÚW‹1hU)Î˚LRp:˘f˘û(”q:ù£†˝ø§‡√/Ωg∑„Øˇü_Röø˝‚ª)ûö™—4êu∞{£µu£E.Ôo5^›‹ΩuÉ\›ﬂﬁ$ï:¸≤”‘πº ïˆ©K3Œ§ÌN∑≥u•µFö€◊˜v∂ØlÉÇkß5ƒ≤€_ÒR6X⁄`ó‘[5ÛÒ5˘Ll¢ƒßz2±ÁW*πíb∂IS•`‘⁄œ(	ˇîAÅ?è‹•@∫ï»ñπe¥È`Å‰C~åxó}`u˜’ÊQ:åfHàÍNUæ»yüÚÖ0≤1•˙1…)⁄éH¡—fbﬂ˛ˆ’k∞∂˛}„:yΩµΩ≥›z#b∂ÆÔÓøAZ˚€Ø˛+Y
rıÃx%¸‚◊™ï Œ(Ù9d~'*dzB◊ƒcÊ ïWÌPΩ’#WÄ(Ç»’>À~{=t∞·≥•w6ÄK2zÔŸgÿá⁄©¯}˙Ùn∂ü5öØíkçMåáh\ﬁ}ΩEZ◊04lw˚Ü(áGÊ˘∏(•KëwM_¿Kgo2	K)3kÂ£Pà"Å±˛]qfØ'Ãº˙1]+46ÑéèÇàπ∞Ç¸+Ñáe–‡ï't˘$ä
·Ëa\]Ø……ï4“„æMﬁ⁄Ó:±ºaH¬Æ0Ë„+§‹ãﬁª·ı`}°ﬁ|Ëaq° ¥˙¥¯π[Tõ•{÷¬æuîm§ùî÷M"x$Ù µ·ÓèSâBX»yF¨\œ§BX0G	MH6pÌ(‰x‘ﬁØwı∫fÈZ!´ ¬öc†aƒj
¶h¨Ã∂·	≥∑πﬁ—ÎÅÌ”[ÅÅÚÁâ·{µzçL´ÄjRq÷p≤†ˆ§Ø…D]ãï°úcV{∫JØ,∂öÛ$ö£d∞4;t|ˆÃﬂ“ıíY+∫§Z∏§®r£YzmF[9K•ÎdìÜ‹$0	Ø->8ŒU_#∞ülÌ76Z€7∑“πHAŸºﬁÿµ)»JJëO›5çtQÇS4¥8õ"Uâ¸òJ–VÜ–s˙’$Ï ªSÊ7ƒî ,¿ãEMÉ¢y‰¿#⁄ÈŒnLÄã€rì†ÄÔ,ŸıÀíÄ€Òk´,†Ü± µt,¿JMà≥G¨¥K-/
4"∑`Ä}ÃEg‹Øx‰ﬂBoíæå®6≠\RvcuÃç•ûZ]Ï	BŒ™¬Ôòáòyb~˜Ùìø¶±F?MÁJE’‡o©∫œ4 ˆOTæ·?
¬’RéÏ«¢J√6ºœ"{›Q@≥ú%◊ú Ù|˙%…â%äª»¯Ñ•™µÏ ï§≠L9 ≠l0⁄—?©`¥|ˆ/”‰∑SâLcAi]/M$%ë#*Õ†∏î˘ Xmóeÿ¢—Gc∞Vy⁄t¬Œ¥æn≥,-ÖqóΩÎ35R√ö$¯ˇå0y=ÀQœπz=ãz•π…◊≠ÇËÖ˚ÉäÂ0ö´≥>sù¨‘ÊaqºFVWÁW…À•NZ‰|m~πˇûÉì¯/úˇ]≠Õ_XÖókÛÁÒ˚2¸éﬂÎp˝*˘?gÍh∫Ö&i6˜`7TÅZ“ŸQP–ı⁄=%∆^ÂuRH∆C·qJÑ†I”˙pÏ]eKƒS∆‚òâK"(√”≈&$(y|Ç,˙@∑0ï¯ÑdjM	ë	π,µ•ñK&L#(!eû/ï†√£ên≥¡xFã0N~–õπƒ
,„Ò*AÁsø•À$•ƒ4˛û>‹≥\'¨ÃVfÁn◊Óeq“ñ—≥⁄Ötüåÿ π∆∑Ï◊Ü∏Å_¶Ì`€gTßè÷ãÏ
(∑Srªbœ{Fêz•ü)+eeb˝◊R¯£hdÂ∆q5a(6+Sªy0(9CëÛDπÇß±É1·©Õ#Úúg’¥ê·∫ÕZ√`À"ƒsª^ÏÔ/ìTPiTÜ7‰”™9VÎéÔ$2ˆ¶P◊‘\MV¥t°cúıï›}™f¶Õ\ª*?˚IÅz‰PËo;Z!bkÅœœÙº¨uBÈ¿∂SÅŸÊ%qµ+&∏⁄"!.¥y›‰	C±÷î>+á"ªRN:=ìë§•Ã¢ß3ﬂkwW8T“hÇÍRŸ~›rÌ˚‘|≤&º–é~ÜKi&Ù@|ùO”†Ks∏“( ˝€Ä,5piÅ9¨T™Àãâ,bÁ+jl˝«âq•ìeãN√Â(HŒúØOäãìK‹1nÔ⁄Mÿ»w‚]q@◊∂õ-ïâˆù˛≥úT-Å¥÷ÿU¿”G∂J€H2úπ3à≈+∂}{m,=W®?’ÒJÆ3çlq/¬(2ﬁIIÀw`qYæcS»tÍ]9_û∆0¡6IdÈ wÌBæW≈∆£ÑÉòDs@ﬂ´[o0Pﬂï∆F´	KyÔç◊ EÌO∂éß£ü»{“‹Ò¡óÖŒatg|'ÜËe–HsƒwqË
ÎÉGÖ&≥X´∫&aÅP»ºgè8W·6à{ákÑÖˆŒgçÙá8,´o≠Î0ÎÉÛP‚weZA™&_¨/û√)ŒT'ì¯aLJ}g=\Hv_ø˝_K∆ò‹;4F«ªé&¡Ü&lyË™QÑ≈ŸåﬁPÅˇíÑs◊‘øÙıÂ@Ü1mNV+‡≠⁄E	láºÅÈåªtŸBº9ÓB‡É'XÉLÏ…ÖU*W√_K“‹ÇñÀiSºi$i…™¶aÉáåùGF/#ƒÒ`ª◊˜7‘±/§v™p⁄q∫ﬂÕ¿he*mŒ@ò¿~À·&ÙÀÁ˘§˙3eâU»†ñu¸˛GäIóm·ÜWÓ*πFÓﬁ≤XV\+∏GzûosË¨as_QòJ’BQYÎÄI*Ωª“[`«i‹{ƒ=ﬂ£y¬ƒ»y2 Ú∞·_ÑøvúM‡ı)∏ﬂ∂âw(ãáy<m∂§/Çã€– ;tBVÿÍi¡µÂÅµcÄj' ‘*ùé" -ìM¥å¯∑óıåƒuqE&∏âÒ¥„YGb¯¨næi€∞˜íFﬂrGÅúä’BÇ-ú5B¡. ^ÄƒÕÌ≠[k§π˚˙πµµ≥sc´â
ÃŒˆï-rπ±”¿ÙdŸ-Éc‘ëlWº°+@∆Ê∑ñÆm%Un&"∂Û±‰tÆÑI?˜ïöY°Ä‚WP∑Täˆä“èp±[/nPn^h„‘]¬Ç|ÔáY\”*≠›¥©:‚¢|\QfÖ‹≤]∑oX∑|«9¥…eÀ•‹q1∂÷˝S
˜∑Á}Úv{¸äYˆ˛@∑•/·îÄªu¡(’j	%¢2*ñ±`WÛá}ä-##`˘}/$kú!{4;Ù%†¿7êR±ü†ı;ˆ·<bö;á0 X¢´KÂW‹-pëÌSyCü Öm£;ÏYtç∑ÌAÔ
õ°xOÀà®,|NUxµÑm@‰	zy"¶Ù∂åı7è~Û˝ˆœæ˛ªw∞ÊÛu>∏ó£¡Új≤ÒÁuèe.-Y,#ﬁ$^À∫gìUÿ«ÌüÂÄÿá(
·∞3¬f·6éKê^»´xÒ ÈˆÄ∞z6≠⁄GX≠®√‰◊É{ÈC`óT¶äî!î$<¸Eö÷§ '-ÚQƒ:dDHDˇú≈yhï«ˆËÃÂuˆB¯^ÜΩ†K3@˘ç/l'Õ¢K‹ëÓ®CgjÅ\á©≥\ˇéà†≤)îﬁpŸ,üEàM4ëÇì∆[ÏÓ≠[˚§±y}˚Ÿl4Ø]ﬁmÏÁ›ÖΩ’;Ó=t¨†{‡Y~«xõ}9ªÕ÷Q?ã∂€2õÏ…'ÿ≈64Ü å˜Cå≥BU´7$Uâ+MÛRœŸ2“¸˘å˚?q˝g ÿ≈0 ÒR0-PgTó%Î˘[©ï®Vó»Ø¸S˙Ö≤∫ÌÕ.VŸË⁄Ì{ŸN¿ÚÄˇ≥më ràâ@Çâ:Â$òí∏2J*§—ÅÌ∏[qd«É^†ƒÒs™ˆ¢¸ç<˝úJ ü“LXX˝ÏCˆ]ÿëêa&fHö∫≈RÆÅÜÿmﬂ	]j¯eH˘	2‘Ø€m‹◊p7¿≠¬B˘Và"¨ 0W@GLæÇt¡2À‡#|ªÑdæw¿i,K	*tìV±çjS”Q›Én√„ÿOE6qôSRYïûïÕßÀT'^ëﬁK∑Ñ*ª2ΩRTê~∑p∑iM˙t=˙6sî»`ÁÀû¶˘≈hÅ∏“9∫A)gå\0ññıAtë-≤t)t<ïg/æá€à˚"â!P€eLJ#á(™bú@ΩãòIé†bÑ¨‘t-ÜÃÁŸÂ9 »¡!R& q∑dZ¯Î}4òsBY«smÚÕ£_æ/—ÀÂ:Ω¨í¨X=ñVıΩH€∂gımWÿ&∫7⁄¥BãØŒÃ9Òzä∂ÙË è
iX[¯É¯)ávÿÓfØ_?úﬂÏ`[ Y¨üH~êµ¡Ó`Ñ'}3ˇ(æíq“M€µC{«;⁄Üù;bØôì“÷Fà`⁄44√]Ò¸Àé◊°#ü˙‚ÁÂœÍz«Ù9¸¬Î◊N	LêgØ∆JLgËWÒ£+XîIûÆ⁄Ít(˝4Ü'Ñû≠ü‰œH⁄ky¿S°K—G…®† .ó-å‚Z?)ûìé@Cpª¥lﬁ©ªˆäk—©OæIﬂx%sKÓÑ§èLåÌ6Ì}¡]πÚﬁÂo,ûì›Î•oÚ¥ojfoHóQe+\ñ†íG·§ºo¢àœ+Zëa¿_ﬂ„ıwvsµ˜ΩÄqö™ø§Œ”ïÑ◊VB_"Ov–bÖÒ¬ù'4Aº<˛ﬂD1µ:ÍC¬eÇ^âÍ’S?˘†ˇg—øiÈ …XP~ÍffL˛ÍF◊±‚«øyÙÛü´"b˛H1+O¢úΩ_2|ˇÙ1≥ò~ŒNƒA»y%Á◊‘à 2∑˝4≤∂˛ö‚"SzS,éT©#¬µ\ên]u—l°nƒ~SQƒD6ZvàáL1–pÙG%CÉx¢‰œ¢ÿ˚Ø‚Ò©F˘ÏóK T‚¯G<ó∫aˇ¿¶·>ï4Ä≤≠4Ã	DNõDÍQu‡{!ãêeÍ¢ïUu€lÓ—Pﬂ™“-4· ’˘lKxl%¬YT=Cug$NT$ãl&=ùô9äÌ09êŒèQXˇ≈Ã–[:—¢A[L˝uûÃ8˝CoF—.Ö[Tñ~XùÙr≠ Wb¿Â†ÔúJT¿ÄG<Un≠í)y
K≠4YÊNΩOWÕöu(q˘\¶≤4‡ÑQNHõë“»~°äkìø±ÓÇG«	¨ñRJÚ U>ﬁU≥|º”°¨®wkQ6Ö$
PÆl+…kﬂ>ÙÌ†ªqú+°yI6íHFë®ú>•ìŸáwê•¸ë2>4K)hı◊å€`≠Î/XVéœ·5^f˘≥+UÏÂd8ÿˇñﬁãò<.ÓP<Ö!Çz˚Ïú1’ã+∫pﬂ∂‹jËÙl“≠0`yõÃ2P‹ùA/ÂÓ\Q∆L(}cÁ%ÿ¿ÿW ÜD/I)¿· ò·◊˘xUjDJ÷ù\ÚT≤G‹–æd9gæà≤
q˘Ò+˚{*Ò¥•îXZ˙æn:∞ò=›˚h¥ºRÿπz,I'©òR†”T/©YÚí¿Œ¥b{h»(0N-†e<ﬂé’ €‚∏˝ùzΩΩ∫jﬂI∑-I¨Ï/#Ù9éÔØ¢,Pü∆á®¸Nø$ÉˇΩ·„ ŒÎ=°π§ﬁé»5, ~è†ÚêÔú°m⁄Ó®gE!¢ó[vœˆ-∑3∆ àÓ|—ñÜx‰¡*øÆåd‹…V!~MÊ∫ô‚‚à∆Àxu¯qõ6`F¬IÈ?zˇrˆ˝F+‡S:`üg(<3¢1˙8ŒΩı^,wøGá¯¶Ì≥§‡ÿ<LìL«yœ˜◊÷åÛ‘»=Á26&vvﬂãFÍ“ÒÁ:+uñfXUfk`¬Úö´àıèwÅÈx*Ï€ÑºÔ≥LÖ∂S±µìˆ?–Ò¸=”&yz‚'îë¸Ü}˘±ÄÌ3‚∆Œ mﬂw,“ÏZ»Gp¨üU0º∑<Q”€^4öN$õó&ºé~˘(∑”fOß$ù&u∂€(ÈDÁÈë;Ωr¢ŒkCÉ'%¬éÎMK÷…Õâr¿üP6˝nlê¸êÂÛ˛0 l…üøÅø\9:≤9fÅ*Ä≠J5.WÎÕ≠öÇdiçÏo]›n∂∂ˆ∑6…ÎÕ≠}Ñﬂ‹nn∑v·„¸R*Èm9]Nd™é»„\t©=h®ã:®Wù∫Ueó#˝Ñ-§˛˜q≤\\dí~∆Z¥j¸J!X•¢+RP--HÔ/âãü$L$≥U∆øß}á¶≥zõT∏'ïï”É≤>ùMî™Mö…#Cíkíäà'd¥õ9ï©^ïô£hèOá∫È MÏHtxDNÑQ¢°á∂oû$rhh‚Q4.J˜£éS,√ŒÂƒp&ét¡ô¢ÓI#á4al˚¶ê≈\q\ºtÉßå!-Î@]YOˇ⁄&hê≠Ò,„7¬PNır2»ÜYLQZ£ÅÕ˙^ôÖ…û-ëË2…‚ìt≠i#G›êóÿj»6É≠fl
œ,&å˝°Î.∑«Òh°‰uﬁ6u`&™Âì¨V}0ΩfzìÁ“˘/ú˛3ùBYç6≈‘&Âi§ÍË..¨ΩSüzÅ´zâöó
…™é2Ít∆%MX2Ã*óºL‚©ï˙	≈∏≤¬,ü
mL"´n˜e˚Lﬁêo“¥Ö•Z§$”Sß∆îIÍ€6´ëL¢Ãi‹ûLŒ g<ü±Ñ(úÕå5d≤©4IA√4cø4ˆÖÓm•§û|*x–j@ö?ØñXTàrv0Ã1é∏∫™MYé3Œ˙É˙µ2Èüaû{ä)∆ú§9['0∂6⁄9‘RbÕqˇ∏’Ûd‡3pı≥Öú'Œ3Uî:€E>(b®@ZU¡≈ô‘◊FŸBË°$Øt›*AK
K[	M\ØÄGÈ`∞RÜ;)d0¢?»’Û‰≤…¶(>>Êmœu≠AîQSôlÌbÿ≈yÈ–`+˜Ft–jú\.◊Æ,]æCQ´◊hËõÅs¨2≠ø$V3MÜv!p`©Á0sâ{b»bƒA©·‚bÿˇôÃ˜ê<qﬂÄﬁ	≤Á6⁄md‡7†…û¥iﬂwh»ıˆﬁd∫‚¯†—7mª?Ÿsv,xCZOÚ†t‘ Ã•=öÉ"ò¸Åæs‘q¸©-R˜<¯›Wq∫†TÓ¿Îå“Ì>·tÏÍàIÌ„ú32çS9,áL‚ödiS@QAì8Á«ÎÍZÃxY*ò–€Òémñuen¡È∑]XñAE¥gØùCs∑¡[ÿ>9˛ktï£j%Ã˝µoå>C˚¢◊€˝NpÀ	ªïŸbB`9ë`¶/]à¡∫Ô\TÈ$;gœí3º=Ω(≠PùÓõ!_˙√◊ànWﬂ£îêaY–4d√¿7*¥Y å¿œê|ùò8™€∞˜_ö˛å∂¢ìâÿ,†˚jµ≈<:œ(âŸ≈∞£‰¶˘Çï„Â¥éﬂñï¢øáA’Á≤&’€rA“iYC[√&:¢ÕU-(¶gûÂr»ò<ÜB_~P3ÉÙø   ˇˇÏΩs◊ï.˙W∂xëÃ‡õí8¶|!î`Éè †G£ä@ìËÄÜª¢hé™üìƒπûƒs„(>«£9öÃ»âÀ««ˆÒ-g‰[SŒ_q˘D?·Æµv?vwÔ›› AZ¥≈J,Ë«~¨ΩﬁÎ[	?¥„ƒjõmÕ*8Ss”¿·vQó‚.w2aœπóÚlGÔΩ—˘Kú˘(\óBh‰C–/NaL¡—Èª¸wf•◊àê˚&§†ıB‹Uˆv=Åj_È1iw!3¥¯¢î¨‚dùò6~ö˜$Jãë‹Øq`#œ„öÌ∏¿Ç’MÃÓML¨·O†ÙöÎûLHŒÓç8vg≥Ö.Ÿ”Gè˛Må√ó{^™ˇ*3ó¯vé˙íÏ®œGΩEfOπ∑g¢ËEŒ4ÏX}8Ì~ÖOlö££œÆÎˆ∞q'∆¿Üc†bêhz˙f_ÎS—Ô¶IA≈ve¯uç Qßà*BÛj"=ßV’ëELLüÚú‡nm|N‚w¡úÍF◊õ”Õ[3ÏàxÄ.r†õ0ÿ5zG>µ-6˚‡·4˝-Û`åsı!79X¡?AÀ¿1…	À^z)LØ°Õ·57∂A∫¶k∂cõ©—º˜3t√yÔ'R=æaZXd;ÂÀ‚m‹ÖGë{ zWGzî_võ€!Xí·Á`ˆ˘≤_ö€äπ¬?©Ì„Ωüp9éπÖ≠CA¢—Ï O+f≈?‰œY£"…NgÔ'´∏&Ñ)/ìÎ¨~ùQÿ§GüÇk≥ú™dˇIŸÛ˚™¶Ú¸'-Äz0ÙÅÉ0;5»kGÔGò≈JúïéÚtÁ∞˜≥eäy<<ﬁcZAˆGÇØuGù´„8uè“ˆ'∫öºkjO>π–GÀ2å!˘ËY≠iJLVT‰¸>ãiΩ¥‹ŸØˇä.¸îRÒﬁÛä>M9©_	æBê¸y-”ò*9pôøp°]©|Ò3B ™„C(¬`ˆªX›q2ÈÔﬂïÉp¸¸v$71…›ß|ã5Kﬂµ4˜(*ﬂsäéØÏˇÉE èˇ”C9qÛ‘¸6o·+ÃKˆˆ®Q4J’¡)ï∂˜VÌˆ∆F•ºU‚ÉŸ¢_«LÑCbˇ¿s⁄{¬ì§°øpÓ¿„pÒßn?eãú"7LÎ∂ˇ’ÄúPÂËŸ¶—$uÇyÂıè<ﬂ{ºı∆˙û3\bµ.Z´jNj/¬qT-Â/±Y∂úü;-Fy˚Ö œc“rQıI§K◊◊èﬂıJ)¬
ƒml<≤íâ…ûÌC§"îó}˚¥ãàûWâ√x^9îµrHRD˛#ãúˇo’√≈‚ßà_<µ^Ç‚°gød®"
yeAÏ†m2ÎDΩ]î˝Åç^;ﬁ,ÂjÇF»mÕîŸ∫í‘∫55Ø5[VÎà9≠'ë—z‹|÷ƒl÷Ög=ó5)Àty¨âÿX'ö™za·y™Í)§™é+Aµ–jaîq$Ä¢ÊŸME!x¨·IrAøü©†)¸”HÈ<~Bg‚ÜI Lmø{Ú9wßôqob"I∑*„A…—ÚÒ2∆±«íÎñ9”m‘<∑å±»SœqÀûÚ1é‰!qeígßLû¬8áOH9πqzb*+©Eì§©Éañ≤êt G<_b2ÎπlgÍ4èFˆ‘óa_FL{[“ÀÿR^§	/·BcI{…òÙÚJy…vä(›≈ØeLw…ûÏíÂ•'∫L?õy,+ßò«≤G-ˇ0qÖm¡éÒ†¥pª‚çw:áL˝B≥Xn&—‘Ö'}gS^R|‚´‰áø’‚µ¢jÌT∑7wÍ5VŸæÍ:5›VØπPãs	ı!ˇ√˝Ï#rà˛3ˇ„Ω∞◊Ûπü›∆3Îgóy∑Gªêê‚i_»´íÿ5WrÕ≤lƒ5õHUr7πòc≠z…ã>∆∑PZ£œ¸5¨¿B’ÜÕÿ	cÀïÎºÈ,«◊r?zÕMß–llR–8‰Óô‘*vê…¢ÓƒÆê$L∆ïHUÏ|uN≥{MñE©√∫≈–6ÃÉ|”ÏÌVwj"B_ø ™‚ÅÃ˜)ñ˘3ûv„4≥pp>!;Á}
–?bbA«
¯`NÑ◊ÆÄ“Æx4Ë+BÖÃQDø§ªﬂ|ibz:UOu‡Ã§Î≤ºò»â≠1Ì@ö£Sì≥Zﬂò•£2€ƒ ·ôƒƒ˝ÆÓ¥ÕXM;€µ:&Èßkç∏¿éºy'}‹¯h≤àØ%”aiPzÎËY˙ªpÿj¢ôMâïtaò pcö‚J•2å¨§œSòÂË˘pXìœã¶àì:–¨^˙åíáïÙm¢*/iNÇ•U p©g˜rD}˜>∑ıV´Ó“ÆcP€˘k¿lênxbJøèPËê∫åíUE§yl\úÂïo'léã1bGG≈qK«©äÊ9,é˚s6aqÿÃ+Zk_WüµŒ}`i˝ƒfu\◊sî ´ÓX“M$>ö§”‹$P 6ŸÿFA•ˇı¥6¸˝µÅÒ:˛Î~rãá ˆú‘D◊E'ˆîmì˘èúN∞ÄÕ
ìm1å»ÁF∞8éÁ®IØ6c„'w≈ûìé'í !t,JÏ„∆x—¥œ@– MâKﬁ«@ê
‡âKúqéO˝Ê∂âí=≈{ﬁΩG)Lè1À(ôf“}U”JjI…√±„Æ‘d'SF„#‚7üüc2‡@èΩ«P»%iM»Œ©48PV·3«2{˚óe≥¬hˇ6›w>ƒb⁄Qx≠y£ﬂÙ{e2~2Œ$≈_Û_(èäœ›òÏ7qî>XΩDÌ'˘|Û¡±NB¢ Uúí„'Ï\Zyû∞sÇ	;Xƒn;Z∑º§1Ô«Kx<ﬁè GÓ7:– \5≥˘<øFÂ0L\/Ω¶≥ÇPkù}é2êò4Ê÷£`≠¡k–ÖXJÕœI{UÍõ¶‹WÒÉqû	é˛‚åHoÓÍ„IÇµW®íoFÊ–ïk≤kGA0√˘
c†i¢·rö‹õîyMÅjãI@„Œkí3q˛<^”3…j^2x˚é¸tové«»„˘ È¡Ì„&3åîïIÔ‡µÄ·À¸ìÙ9È Ãi…öˆycBçïX/'æΩ‰f%ez„È,cpÆ4\Æå¿[>qyåA0º"N”êãØüOéÖ∞Ì*œ˝æœ"ÇnØ¿˝E‰q_‚7(Ûﬁ@Ò¯‹≥,¿dôa…éƒπ<{IS¸‘Œ{ß÷éM∆µ`ÓË‘]8ánË{zöjôÔkÈ~‚ÒM„Trø⁄ZØ’—◊u¡V¯,ßÅò+Õ1úÃÄ?Ö9m√FjœÜ¨#Æ@n>Í–Ïa‚Åç,≤ó˘πÄØeˆ≠e7õΩülá„≈∫•ŸÌï«ö#¶$¯œzˆS•ÑDÇì îZ>πL)ŒÈgQ™DÄ≤Bp?§&H“¶0iA≥›¥*ØÂﬂ˜.a 5ÒΩpÖuÙo;ßIí.ø¶g
)IÈÈ£wˇ≈üwUøkËò«S¬ËÌcìX5∑‹àQßŸå‚˚6¸_„vj-üJ⁄‹P5G≥∆ÄŒÔ%–˚¯	≥.=çÕÖ∆ vSÔÈdœ¢K*8J<lÿ»`‰˚&˛^#Éuü‚õÂå™lãC’±¿8PHd™∫H~WÄÁs¿{&æ˘Ô?ü»[z_◊\+¢”FrEkFbõ*›ÎcÚ\è«˙ö†:iÕC¸p9ﬁhñ≈YŒ5qÆî#{¡ïiö›ÆNùÆ«ÛÆ 1O@<ÎZÛÊ\û·µ©Ú¯Y»“¢™]Ï¢(“ØóK7VY≠P}•P-≥j©∂[©{Q‘œ(qèL>¿l¿	–·Å˚˜yé!‡Bx@2ˇÀÉ@zÛÎ«¿ƒ¡∞~pDZòNÖd$€öuG≥∞◊ÏALˇòvïÜú®V@7Ë∫Å"Úÿ›U¯wâë˙Ëi}dÏ=ÿí—à3∆"‚˙‘Õ>+{ûÔÍæ*PÍ˚F√Ë†2˘≤Ÿ`õ‰‰¥$™–ã5>Ω*ÕN∏Ô⁄†€V≥W∞Ô0ÑÊ/^å∏öﬁkAëıæâ£ŸCqÂ‘Ωgnöd⁄É∆ﬂÎMGIµu∑êwdj“∆[Â—O°ÁÖ#˜±˜yzÁW,@∆√tN†ï∑≈è8)¸Ö√Ò‰—êèÒ<–∑É‘ÊsÏõáø˛ÎìwíÍx$1XàkG˛ØÒ´<î5%zÕlÏÃÒ¥^†A£…‹-e|OŸbÆhv›€Ì#üµ∞–Í+jVÀûqØÇ_∂LÏØ‘‘(ÌYV
Sôπ˛‰HîdG†qôfúûJ…5íJ∆§T|ºi¨i¯/n£t |”¬4Ωƒ|û¡@@LDçHdD ¡/ÌÍœúâ†N_8æÿø˚8ëè˝,héÂ}Ã1–¨Ÿ‘:hõá>y∏‰0≠ˆç©ÃÇ5π]–∂Ù=–lßoØŒŒ‰]Ê…y'
ÿŸ	˘≠<gqm‚ß∞oΩ;äã,Ω≥6—3·-∫eÅ∂*øJbmEˆ≈ı‡†gÏ\ZU˜ºÃ;ìºµüW˘úy{˘±óté¬bÎí™U∫Èij^vÎ†SGAf/ŒjíÉßíÿiπ›ñÄëªH´"OôUXÁÛyVArsP Ÿ¨¶Slz„|)õqæ0j¡Qb cbI¬∆(¨L~ ÕsHÜ5ürI’Û®$m¯ø™k«≤ÿµﬁùË0wvñy|ËÅáﬂ˜.4AÂRjüÍ2üÿ»#ë˘π¯“	¡%–πÊyÓŸ\ﬁü≠("U|´tcL∏å·-f≤/èn*Wˆà˚∂WŸD≠Vd§8ÌÉâÖ ‹UTFVUw=$ªŸ¬‹¬ ƒkÈvÔkõñCÄÖU’;:PT+œ∂…å9#ùé§iˆÚpü´:I^9¡ÓœdiÒZ≠¬¶ÊÁ˛faö∆√Íπ,º∂„7)~xË]¶$•˜/¬Ÿ˙vWkjΩ&ïX5-”∂AÎmZ|¥¯⁄å£º≤◊_ò≤-ö›º≤j≤—≥YÈû÷e¶’µ#+	ü1TùzÜÌXºÑ†o⁄‰jÀ3>xB≠•k-úExÄÙFz«yu∆◊≥πÁ¨™7≠Å·t	…-<∏≈Âô9\)˙ÄY±∞≥J]π0√jµ^ÆV∞mò[’ b«ÔÍz∆qUAè8–YµzÖ*;Òa!IÌÎ¨\∆G´ ıOn¨‰Ÿ∫y–ÎòZãi§èˆµ>∫ØÌzØÉWM(Kk‹lÓø73Ãh›KqŒ–y%œ\ˆÓ˚u
óÊ÷ÁA‹,áJ§ígyŸã	≈<ä·hP:Ï*ÆΩ§™kî¶$Ãá„T,z8˙4!èΩ˘f€Ì´H“]$_ñL=∞aC;≠1+;ÆÔk™'.ƒl@ûË‰˛ÌÈ˚óÖ?Å«/%ŒZVÃ)…Ñò‡E≤∫üPGÈÔÚP‚ó‰ΩÒcùi9\CC\Ä°[uˇu¨0ERŒ{÷qzù\ƒNˆs“+Ÿ“B¨	†µ©©UÍ&æ-ÕÌÊ≠´πƒàòß8Õ≤Ñ0OpW1É’⁄¡qÆkù©≈πlªâ∑UÙ=gjI∂[÷≈»z›aE/ûr¨Å><˝`∂VÜ¶ô!Ø©
Ãt°ºªîLè8ÉÔñA?∞Éµ§ﬂºÛR¸(·ü„ê´üûrJ‘∫C~9Pª–◊ÂŒÙÿ¥öíÍïúüúØ¸Ba”-‰ô‡Jzn”…m:ÅIé◊§KıDeD]˜p6Õ5¥˜Ì[M≈´ïêB™(¢m≠ﬁ0`3¯Ïê˛)ò#†∞YtïÕäU‘•oTgX© ZûﬁjSèOüÕ®<Ô¢P4ÓÊˆ∞ÅQÄ¶Â⁄∞‚äéJï0öQ«µ∏ùÁ™iX¬Óig}Éı-‡]Yá≥1`Àlß}hcn	*ÚΩQÜ0¨`T˛udˇ˜€H⁄ƒ⁄kÂ{H†  ú¡≤éÍä—÷,∂cvê{÷∞˜Ï>·nì≈∑é®‚XwÇF≈]Xöˆº·lò0ÃñÅGÙÃÌY≤=A¶…∑bQúå≠¿”óiVc÷À„âçÓkF—‘Qœ/s∂Ë±k0S“TÛÑ&±¢ƒ(oˆ\C¢√hYÃˆ®’ı›v(®î
µÚ÷’’Ñœé¨^Ã{ëûÁrZ.ßÌpºb∫pÄLG%£˝∑&ähWdÒ˝õïDÅŒÆX^fF$»ˆ¿a^ù,o] ≤,‡Îæì›ûÃ%™Ëwu ≥&:‹@õ7ˆÙk€zAòˇDûe'x∏opŒi˚íπ£€ﬁ€Èc›§2|ˆ&kz~’´z˝–¨	r”‡˛.>ƒ&]∫ ÊÁñÚÀ√Hg•”óØv”AÎ:à#}HD°e¬%ΩRöÕ^h8U(†ù6V⁄ÉlFGkZXjôô´E∂U™≥óÿ.J∑m\læó|Yº tÿQ˘ruF_ÄÀAQË9:∂7õñ›6˙û◊è6-·ÈrÃkLˇv%uê<‚‚P%[£âswÚ'/–Ωç(“Ä™ì‚¸¬CGr”D˝úî@˛∫w$mÚg˙4è…Çm"∂ïÎªØÌ‘≤Ñ'D–Útúﬁd=VıÙ—ªo}7ú“dgŒ4[/_-◊ve{˚–Û
Î`ÌùgïÚïj°˙jZ¢X√4Ô¿Y˛l…≤ƒJñeZWêõh÷!€NÄŸ§u∑rªØ„ºœ¿÷∂-Ó≠Gwß#†≈à:*DõéL≈°Â)≤Àì“.Ii]£ókÁnÇÒ÷úöüõª€Œ]¥ÙÓÙ-÷wì’r+—‰4Y"œ’éŸ–:8n>l…˛eÀz í˜Ñ?fÔ
ÆõâG9yib7«,	Ω8⁄®LTSZ/ı“:´’K[€l≥ÄÃ‡è›ıÚvjz!%¥K/‹’∫©!4.e˝Ê°óu–õpMã'“¯æáî≥≥{•R.≤Jaw´x9MÈ*pü‚ˆÊN•\ÿ*ñÿµ›+i‘—Ωf;◊4Ü¶¢ùAƒ$´–ÿµA„å–76å«ˆ=$ûBôXÃ´lßRÿ¬™üÌ¬˙fa'J/SQÇÈ√4{(£˛·XúZá9ºbrzXj¬Ò‡Ìláø‡åçáL´Ä’ÿeF∑Ó√K˜˙`Ì¥ˆ÷é∏Èp_N^2b:±˝ﬂÿ(õ®óÄ∂´%† /Q~ß∫Ωæ[¨◊RIA€€3:.¬ºÍRíØëL8;~x¢Òû¥#8#4„èö#9iúÿ®j◊äÖÍztë‚+ic™›Dß˛–_ÊﬂÕ÷ıÊù3≤c¡®iûÒ£ΩsmªæÕ÷∑wØ‘YmªrùÃêÌb5mg˚m”1s-s–ê™$+x/[«{YÕÏ‹=3úN„ykOhØ∂÷oTÀu∞
ÿ÷vΩT£=<œ~¥[˛	´[[•ÿñ∆xt≥9rfS.∞˘é„∑C≥^J°’ögI`”∏∑õ÷Y8»ÖjΩ\¨îÿıÌ2hÛæG°^-l’*€i'C©Õé>™_°¿og◊Mû˝{ÜÓ–i‰|‡CË‡ﬂ˛Œ◊J≈]8˙Ø≤⁄´µziìv◊Àı,ˆú≠7ñ·Ôpo<CÜú7d◊à˚ˆî(–§Klcª∫Y®É˘Ω∑gÕ1= ÄÉŸ4{ *ùŒ&¶Ô`ﬁø˝åÏ⁄3-EVÀ[v°Ï<*mÔîZf˜çR°~ç∏x±RﬁDÛ´Pra≈“Vö9–5ß≠[9≠+8º˛}ÉﬂŒ
t˚°w–4ÊÔ%…Ä’¥U⁄≠*Ïï≠Ìï“˙U∞Ÿ_›*Ï‘–jØñ@?§V_ÔML‘ñ÷…uµ˛–¥≥E∑≤WzÊAGoÌÎlSÎü
‚Cﬂ‘ª¶u£>":9b∏VFèMπQ/oñr†^/UX≠ºπõI)ƒ¨jƒª´wÜ¶L
gu∫ó’åÓ†£9ÊY>8v>t‰gùjõ`"∞Õ≠“ÊˆVπXÀ†\|Ö]-ÅeòÖ∫=8=£9º$ŸÙÓt3VŒ¯#Ø[FÛé?˙3M	e‘
≈z˘:HÜbπÑ±üÛ§êG@ˇ´W´€ª[Î¨RH7 öÑ¶ìÎh√GÑj¸^*Ñ∆*⁄ô1%¯»›Å√∏œ4= gÿ‹F@tÅeXwì£ºÑÔ≈√K’*eÔ	gdˇq–˛ò¡lëæ¨q√D◊ìÙz*¥Æ¿ âyôtëÂµQp)>è:¢MM–;ò∆:pÔÙ|IÿX*…ÚIÉNõuuó$Ä.f;¿R·û0ﬂ◊z†-tuL Ñ´Ì;X$ä…É{Üe;~ØL £‚Mãu1ï™oˆl=//Îíîrù‹q⁄)U…æGŒ∫^.\›⁄Æ’Q‡ûGÉÓV®ñ
¨∞U®ºJü¶˘Ÿu¶ÿ’êÕjÈ(Gm'xÛaMœ»â+îÖ—Ø⁄~ã·õˆ3z¯∂¥ª∆>L©n˛h`ºÓ"O%ü@º∞∆R˘’ (n°jÀOÜM03
Øî(Ù@mií3rÔ äü£c2€:% ÇM–Œ!„6ªC˜FÆ†awÖÏµ£n¯z9…Uu,ãÇ…›Ñ)ÉTÃJE~Õ/‹∞ÃÆ;;~ã¸Ú⁄;¸/˜Ú®g°”ÒnÒ˛ˆ^,ø´nÓÔwtû≠•∑º{√ü*_;F˜≤;ΩOx£ÙzΩºuµ”:X‘¿‹±/z@ÎGÜ]”ÇÈÿÓÎΩ0Q«™På{ +ZNnéΩûCÑPeŒ≤˚g?∑Ñi„'C–¡oÀ2˚…¿B@≤(2£µ6aªc apG;QfRNjÁL¨æ	ùUÁxçO›Ózp]d( èú\·k<¸≠sœbd0m≠J„Ÿ·€^Ù»`‘ÇŸDºπñs®rh‚2·ÏxØÁñ4o¯k¯PVØ#OsV%¬«[LñC‰?<€ñq5æ¥/\ø÷ßøŒ~¥‰!ˆ≤0’uL;÷\X≤˙?ñÏõdü‰˘Î≤ºpMÑÕC»ÃÌ>q€T"w·ç˝ö(±QÈ°ÿÓÊ
§[ÿ¯v>z ¯+≥ |v 8¬û[ ¥i∂–mG•M¶ŒSQ∫Ö%j·AtÒQ4ÕËI!∆_Ïhxõ¢VDZ<óX„ﬁË†˘°ÿì&˛˚Éƒ∆ª˛[≈s…ÍÕr|œ_|˝¯-F0}ø"œœyß¯ü8Ë/ePe/Œ“ÇHJŸB∑iv+ì˙fƒ≤WGÛòö‹◊ä
„Bé2∫d©ß¯Íƒ# æM rØHŸÖ«á¬µ«ÿp∑Ú∆Ø—˛Ãä˙\ŒkBùÖ=ÈeP´Ú%´˛K%f…\Ëñ™Æ5Ú±äbJiMr®˙îåné'._•ud∞é<’éM≠Î{⁄†„$ u™^√ÀéL`Üsòª∞Ã_5qπ™s¨ÎV,ñÓ9†5ÎTÁm¨uáSŸÈ˚»ı÷Ä£¥aE£ŸÖw¿Ô˘$ƒPuÌ–â—ˇ<'∏\[˚>#á 4¶Á'F?	ÛÓI®‡LÌv`Éÿ–ÍOD÷ß⁄kŒ∞BUËÑ⁄Ó˘∞x%†•ıçCˇuù◊Z˙]√ıPdÆ`„⁄@I8ç<’˛åëFÃ≠±·îOèc8£!”w‚Jπ˜¬Ò©Â%´R	_ÜY.’AêˇûtÍO	ŸU≥ˇ_ò∑ãƒ˚y …Îa«OˆGps∞§ác~e€ü$6MËaYtãÉ{e‡xáÿÄ€(¯ûÿ…»;ë>õ… ŸGÊ}ÀÀ≥ÛÀ¬+rfà#<aﬁ∑||ﬁÁ.õB™DuÛ?9(˝G‘©P÷ò'IöéÉzT¶ ˛ú>˘ú{N?LE?.≤áˇì€˚‚ÒøG9Càú„…çSì
ËZ©∑AÉ%÷ˇù®Oæ}ÜMCööÏ-Bæ ¢òÜGn$öÎ´œﬁP*´CÎ‰z˚›Åçz¬‚ ’Gªœ‘Åä8õhrﬁ‰áƒıF{›t_·*$®Ä¸Åz=∏
«∫+?(ÅÚ:q&ib®√¨ÜÎ√Æt˙h⁄HﬁlkV”‘:œÅ˚˚>∏7˘$¢˚
"˜=qÙ‡Îﬁçf,‘]3˜P≠X◊¨;|t»~bÙöß`g®fÕx]gÓ™é›®:5·Leñz_°∑ÛCﬁ⁄à	Ié*/˝õGS7'ÌÓ‰ú	"˛€ŸüºÖπ&MƒõúÊÿMˆÎ	àM…≠Ö	∆…~]«#aZ∞∏¯R’]’wûw3\„ôïﬂ¶÷G`‹Ä¨,å—£hœêèŸØ+ØÅÉe–yOñá©πÒ±£€>#≥ar/‡Ó*nês†:˚u7≤K›Õk]XÔIòï˜9#~≥ÖŸ+Ù’dM™êâ‘2SÜf4$ª¡(ˆˇ0—Œ≥]sñŒÆ‡4c<ˇÒà«ËÕÂ± ?Ç%çî&qË‡ç’˛õßèˇû˘A|{⁄¯H⁄Xä º≈Ÿ’œâc˝Eh‹∆€¯=b~è6ÚÈ‡óÒfmúΩ˝Å∂8uù%€Øí6j∂î	"^ñU&ÅØw˙4J∫\âÍ.≈Gè'”à]Z·hÔ[ZÀ >ñsÃúE¿Ωﬁæ^ZûCªªÜñÎ¨~G˜>Å+9Q]öãÇÇ
ÓÎ•wàÆ¢∫'“Ç,⁄◊E“ìí;±ª™fgPF“™›‘pr„ìT◊9ÅÓÆıAßÈËÍLÑ ûj∑-£w''tc •§¥ñSû(:o‘¬±: Ó	z‚˘F?ı˚e>NŸ9 8%Ò1HòÒìî§¶©pﬁí∏N8*≤∆Ô]L"¡≈9.æ]DﬂP(ﬁ˜I∫êúÛ>}ÙÓÔ•sP∞Ö§P3ˇÌΩ=£i f¶ŸÌz‘iWîœ≥TÏﬂ§∆Ï˝ˆ8ˇ±˜O˝ˆc5„'J¸àLâœ|mıÓ£ˇÑªı›X=äÉGÿÒu*¬ˇÁ˛á”D¥ﬁZû÷⁄_ÍaXø&ôN∏ı!&6Ê‡?∂÷ÔS€√çπ“ﬁµÕ√›WV^y˘UΩuΩˇì◊ˆ\}…^≥€Á˚k⁄˘ng∞∂$3÷"ç%W∏]Õ>V¬0°=b∫p û§í!æâ¥dÛ”Éƒœ¢ßT¸r1.ºØ√"¡˚ÿÔÂ|<¡–3sgÚÊË≤@ç˝‚¶n€päÜÖXI	/BìªQ% •æ¸…m–ÁÌ‘~Ù“+:SΩl¥œËà°"ıêÏF<I°0ù™óa©Ç{˝ì5~	ÎÚ'pp≤5c÷d¢œè≤‰(á≥¸ìøI‚V°ŸEé±†Ô}'NÒN€ÏÈ‘%#ÈgË…ízÄˇYll.◊⁄bÊê(π4t{Ö ∆¬“Ωû∆qBÁW–ˇÖ„K*$®Zˇ3Ò¯¶Bï„πaö∏WH5KOÒLÏkΩoJˆøÓ—À‚iÀ
Éq,˘∫n_˘Ö∞Î'~tó•«ô%ZÅnŒÔ‘º·≤}[pJ“ì}y;M–‘078∂Û		æ B5HïÌ´Â≠ÑÚÅ
6åŸ4[ZÁ
.d( H(8∫˝¬Ö äf«¥Ï|c;›˜¯u‰K˙~JÂ¿ä¨r ËÔDinGJyN°v‡¬≤[;0∆2Å]æÒp‰‡Ÿ¯wjâÄ Tö∏|‰LMRk"™¶öúæ2≈ ab~ N+’ˇ™ibÇ\°ŸÑë9A}ÕoRlNZ±FHˇûßæxèe_ÂC`‘I¨Îv3`•üBÕÿÔ±rOY”†ûë42•tu:á}óÙu5¡*% gha‡¥Èûq9CU^Pœﬁ@q
üÓ[¿äŸ∫&h,È_ëÆÇbÒ•†»Mƒ∞b-Ö9GÜCqp∫l≤'∑
∏Ç—›LÁé.'MÕ”"=íõ⁄Å€‡’lñm◊w¶±?Î?•{ÀŒ—Ò|∫5V∫¸Ë6*´ˆª‡ëïﬂÊ$Hk$+*.<Øv∫˚ÇS’ñ~¿A/±¢•cNã«≥ü>zˇçÒ˘^◊{˝h Ù¬à¯‰8N÷∞áU Náˆ∞&∂$s=¨()∂^Ëôµ∆óãt≈ba·æ8≠6ht¨Z÷êûÔ[˙] ∑8eJqp(Œè©Û›uÕ—ÿÎ¡÷n∏NÈy†1ûR'◊H‚3ÙÆft‡Sﬁ√Úp«‘$}<9ç9à^—€Gî‹……È<¸—ùÇÃäy†[EX∫‰1ˆ4Lä>?U?ù˛™5€fG„m8`*ì+k¡F–õ:«'wÒﬂÚFØŸÅªÏ©…ˇkrzZŸO:h≤<AôˇJ˝ß‹‘ùw‘¨ı≠Øˇ	~{ã|‰ø‰5mÙ<ËCÆªØ?x<1√&4´ßÓπlÈŒ¿Í…øΩ/ü%_À6Vk¨Ò-ÀwÙﬁæ”f?`ÀIÀØ›Ö5∑®Ô€SµêÛΩr`ÌÎv~–≥˚XB~9Ö<øº‹eyq~1wi©’⁄õ[∏∏“⁄[xÈ`mòé™ØY¶œ≠\∏¥t·¬≈ÖπÖ\Sk]\jÓ--ÔÕ∑∆ÒÏ˘óÊ/Õ-/,ÕÂñ.,\∫x±°5Z{ó∆ÒÏÖÖπÀK+ó.,œÁµïïKK{çÖΩï˘1<{	‰“‹¸‹≈≈¿Rª‘\∏‘X∏¥∏8Á>[˙Ë[It‡UàÄ¬∏âduKqº¯›†,ÔÎ-íAkÏà‡Ì˜AªVg5ÚílêßØÚÓxÇŸ}˘Å’jÑ¸áı»£J uj≤BS3ràZõ≥yº…ˆrm{+œy»Ÿ©``”jøØL–E∫ãÙÜŸYV;Ï5ô;=jjÏ7Üˇ¡´@Î`Á«
r˚„RX‹p•è‹”ùf{jrVÎ≥8q{÷r#ò∫äãuußm∂`ùw∂kıIŸÒ≤{∂o“-ŒŒ’AÁõÑµ~øc®Ÿø∑aù’ù
fÎp5∫G.)p6|_ñ9ú∏{÷îÎè4”ÌÉUügjz:ÉÄ@¢“…#U≠~|©`}sﬁÍ>€À•∏òÒeT~ÀèùÚk‘‡atDf y1Ñï≤`L∑=£BÉååép ˜ßo+nVÔ¨tﬂd◊ èû/áo◊MÏàz¸!”H1olÖ Ç;¿s§∞ﬁAkÛÀ3a1πu>R$cà∏Ÿ@1UÉEn|°n™jJÿ£W‚UWX˙kPºUï= cö:hT-ÑÏ–X8è
Êß™íÃScZAÓbz
∫´ã]ç{Ì
Ö.ö{’88!€˝(ì/Ç*ìaÌÈl%/~‚%CÆ>=Î;øÙÍÄVBˆ1ﬂõ¨%˘ªì§ëªå`m“ù»,oŒöWÂ”"P{Â√lâ™∑‰Ñêî|è&U´¸!úçRi˝J°¯
´Ì^Ÿ,◊jßMùP$g∆è—ïg?é3»ßÃÅõà,;∞”É3;zØnöùë]L«¿p¬ì∞Á–…∆hD2˝>Ehj‘‘ZZ*‰û¶ˆÓ1›—9‘¨ŸK±	z”R®j√?RÑKÏX À ¬¥òúWX¡Suëm{∏Ñﬁ1o¿˙6Â©∫í —=;µ∑ÑÔäD…5‰ÌÅsÙZ∏Q∆©•]ªO√€.°ÈÏˆÌò“›…+IÖXÒíR¢26,TcÚ6€…Ên·[éÁ]W8”ë6ˆÈ,ax¶‹ª‚Ù‰$ëË8?öf´©g,=:*±ÆËÙ7M$UáV—V¿ûmÍ}«F˜ˇ ˛P‚ôO®ƒìqÀDO,∑åÔ¯|»%Ø2ò§˛|~àAëÿ@gKoﬂõFÇ_^˝ƒ ÎÏÚëw‡´°«ﬁg≥lyî¨≠≥Éü˚¿«∫Fomb~UåµâÂ	˘wµŒ@_SQzpë6æ¬: ÿê>`jkÄÎ0•Áy6eû^ßj)gZè†®kG¬¶¿◊Éê‹≈e_H òüåØ+z’KÈª¬á`€Ï>ÃˆÏP˜Õˇrq˛b≥±™å{≠œmÖqR:=Û&sw|#“8›˝ù"p‰ﬂÇe•{ MyoâÔïÛ3©~ÜÈ]‰àD<‚,S~ë‡é0Å´êAGÉ‡2%ïõ˘D∏:∂v¿ëÓ6¢^ å°Y∫¨\Ç¡2ÿkGãÚ}ä–çªPÚkì®≈Ω1JÚÖºòä<˙	™'˛êj\˛7OòwÍOË3`…ˇ˚_ËÔ/‘!ı|>?ÍÒÑûﬂœœ`6@m0v†7xC‚Éà›#0ÔƒnõñÉHÍÃ1∫xÈ>ñ‚c≤í|X´Wë1´2ìÒxÍÑ≠QJƒà–£õœ1b∆œÈè±
ëä1>!™D#ˇ¡/Q–Ãπ„&a»>ïOr—ºÖ¡kí+^k¥VŸÌΩkøp¥‘ëÔôS”˜o´BvxÈ*˝7üÒt±ˇ7&∆d hX\æ0øxÒê‡BÆ5ﬂökÓ-^∏∞◊“S2¬Vÿ*ì€(…wìíΩï>Læ/ês—õÉoTO‡`ΩNpcòjU∑µ`œV)·
wèr° µÌÖw·/XWƒA}r˙Ê‹-9y%ÊZ˙¯ÇñGO6ÊÌDËkÜ7Ûm+Ú>&oOE™8âô˛sw‚ô±7å VK9xÇË;XÉıò‰»G_¶«æ‡	\Ò¡º@ˇ≠såÑ—ánŸ3^˛U„?fO˝èwHÊºj,ó–(èÉö7Ÿbà⁄Àœ–[ÁXÍ;4y˛Ñ¥¯4ì	‚âÑk3{˚Üvﬂâ˘ÿ≤„‘lÎ¥–Ÿ¸°3ïÔç«Ω•É˜Mº;{ll´pΩ|µ@f◊´Ö•Íl≠º^∫R®≤©ç›≠"~Q®P#⁄Î%¯≈mCàçÑ¶≈ËB–44Àù	›ÉŒπpkŒ‰h15ôKÆàH·$Æ∏±4Ü±4x(¶ÏXÓfD·¶∑Ü÷M9?XwQ¨à¿%c≠œö"+0Ù
	Zy∞\íŒÏÂh„&˜z∂CÕ÷ä∫≤lr¬|¸ _Z/ºgÀîƒ\TM\Âîœ„Û¥Ãe1~mw·E;»Óè∑X>òÿo`UQ\ûg0ÒäiÚP®’^*”;d$˙Ü«YZ(+_KòîßaS«eq•Æ[`/hYë^/wg\Ù´pÉºÚT∆àIï¬X◊A+ö'ùsÌ¶uáÃY¥Çyá uäæ+ÚaˆpiÚA„?ëX)‚¡xŸ	!”ê≥ ?]NàüJ h”dà√[®QΩ+kY⁄A¸¢¯z~Û¡≤°œH>în∞‚µBù]Ÿ≠◊AH¿oık  J’WY};⁄í\Tu∞¸∏Åô-™C;´Â√ŒH\Tç&√!ÜÄu€è∂0Ó+orCWÚÉÎbãì•·‡]Õ2¥û≥6AùØ$ƒtDITáöï“∏˜∑£KeZèîh„∆î£Ÿ8Ds∂™r≈X≥bàV§Ñ‰∫• »ö¨÷B¢Ï≈UΩå±”Ñí=!öÇ4◊£{Ç√Ø◊£Î‘
d8OuÜl¯b¿¬¯bÀr+v:2ò\˘S∏Ïr∆õùHÛ%ínÏD⁄:màÎï©¢	‰M∑¡›¢;`›bó…"F|)#GÒäë#rapru{(r@.µ	–(\ØnÆR5∆úô~Øﬂ·
ÿyJú7t.2¿Ù%¯≥ﬂ~5¥÷>=î4Ê‚vµ$Õ∞vGÇ}"s•k∫⁄1Zá≠˚à *F√¬9üg®õ∞™wπ;:_[W˝on"~LﬁI4 O_=‰û%‰£Øˇv‡üM˘ ˚ÇÎXÎ<-NÍ›˜ÖIa«–Z“|lÕ∫Ï¶d:‚◊¯0x¸ﬁÙ≤Ÿ`;¶ÛgÚƒ≈ÊD4∞qˇ—sèΩ·ŒÄ√=ÙÄL˘˛∂?z°	¸7aµBıïBµú4∫ÆYÕ∂0¯u]Ô„»ÈsV(ã#˛ôı˘Éz‚YÏÔÛû#o#“§0ú˜ﬂÜSA£ÍFÈJ“x£"éÕC∂côÿ÷Üe, ö¨ :áàÇó{°Oë˜î‡‡M>1<‡2±≈ Ø˚Çìàã˝DN|*@à?aø˘}Úé0çùÍˆÀ•b=ë2∫Z_§2vYﬁSΩ◊{@x∏°	|ËÚœ‹[Ú;ÓyH√˚î¶‚aR!π¸/Nè»âÚπ8‹˜˛øp´`—ÊÍÂÕÉa$çô∫ˆÉ¶»%Á‹;vcëËÎ‚à}4ù/òáD˙ƒ'–œh`üà˚”øÜYF1ë]`^[<U~¥‡<sª‹S£];|¶≈2–Ã√»˚∆√Oÿ€>)ÑéŒøà„+UkËêé/üœOv°&{â›tákbâLÆ•ŸmÍ.‹≠è‹ ij±kÉFÑºÈ≠›ÆoåÿŸÔã∑#{¸œÔqa}≥ºCΩ≈VŸÕ[1wË-é2ç:ÖgZp |iº3o¥T˝t≥§ø	
î˚4j∏ﬁ;T˚–≤)g°öî¯Pi·Ô3z'§ Ì¿Cﬂ<n9 —m!˙$& gMvÀÔ∏=—¢|ÀB<~´@Ãé¥±ˆ÷W·GƒÏ4º€%“o˛óπ¬\i˛¬-ÚEb_ÀA/ AcTA^Ø“K·Å+sÖ˘Ö[ÙÇPJAÿ`∫ƒ¡:}ãn,Õ//,›>çD¯doñ·fÀVô.Ó?GﬁA†3qŸ=BpÄìs$íi*^™|≠h|áΩ(‚)Ié“ër)ÍHY)‰!ëΩY^Ú¸ï©™/¢=‹=‚è5nWŒËÄÌ€Ù_Ô0”ÈÚb—7Ê{‚w;ÿ‚VöÅ:Ñø{z:VR~∆9+<£Ñ>9`î†dwç&€uå∞"›“∆ÿ7Å?ã:§Î…@;„™˚ù/Ô˛Hu˙∫†õÅÜéÏ˘-oôë~·≈è(Ó“…>MTjC⁄◊¶IRÄ7¨j®€6—“çÈ=Rl3O‚Í8⁄/HÀ˘3ää√√§¡Ä—€M≈1≠êFÄº◊ÿÉ%/äﬂ˚„·XiÊˇìV&XØ˜æ~¸Ô¸∑Oi¨Æ≤“µ>ëÈπ\~ûI5`˘π†»s5‡˚£HÊúË•T†1-”2Ó*eu_Ò∞`b,¢L∏i¬⁄rciØyÀÕætA?âƒÒ
[µ|°<{ΩT-ñ*≥ËRxn„ebÍ0ûã•ÀcÑù◊Äa\ﬂÛf’m åXÿ1 no\+‘kÖùV´ÔÆø
ˇ-‘wk+JU∑˛vÍ“Í¸
+‘vJ≈:´b¬t∏&∑÷÷,}«ÙP’N∏,˜‚r$“ú;Rñ‰#d(–ï&^F@ÔΩµ≠“ÖwSpΩª:D±.›€ˆ≥|∑}+ç?©JﬁÄYUä	Pp?TFê≥E‹C·öH‰]Z€Îÿ{∫ªÊl∆©RfóŒòLcÏóÈ,a…Õn®õ˜Pê?0ÎïóhûDËº=|'@Gıiò‰x˝¥‚·|9`+zwA;ﬂq≥ÈR£‡Ì™D·@~dõà(lh∑¯“≈°≈«jvï‰õófëÕ‰n.¨P	 ¸„¢◊GTe\ïı5WÍﬁ‰jèÿΩçî⁄%–BØ¯…@2÷µf]»™¬iFQÊ!0.üô˘™m¥Z^]Ò± Ìk^”ó·ﬂ∫â_˚4∞õ¶≈ü
¶f! ∞m„[£5l≥3¿CLˇ&(⁄∏fu±˜˛ÇA_ı˛ÔeBbÇÊ$(F | Èã&ê_◊N_˛ÍpÔÖÏoñ.ùK»
nŸÄì ·Gê&*·ò≠T¬£≥O¬„˜}ÚNäBØê"Ó∑Ì%µxõ8ã%G˘B≈°Ê¬Æ.Úc)·mr}ÛBºÂ…rí_K°k¢ÚK›Zïm_ºò⁄A¬œò◊Àï'0?HYNï]í¸UöU‘ﬂ√≥À#Ω$dæ§J.q∂&à‰ÖπÖVZ/cÏUvé	Ëj¸†{U–¥€49v∏©
\J≤Ø!`™ú˝$T®yBçüØLD’µt-[Ë∫©û∞¬+ÇJÍÛ¯◊sÛÒºLı/E<πz≤€:’2ˆ¬4Ï≥—2%F‚“ƒÂoﬁxò∞}R∏ê°!E—Ô⁄…Éçï9Öª_feáE_õHìÚÚUÏãõ‰(Ù°0µnø£”VŸ	†®ËkuV±Ú‡œ^4?Tv1Q—ß¸gÔÀ«t·ü=_‡‘,£Ø<PÏ÷Ω}˘ıo˘A¯'úo¿ﬂørKü((œàØ|DÂAC∂O˝÷ÅoSÜ
|âÌ˘07\˙é[≈ºW<Êﬂ~I.`ßVÉÈmÈ¥⁄MPîa&‘PÜ¡z¿HˇÜ0√'Ò˘µﬂ≤`>Êˇ<‡-⁄3ØÈï;Úá°+¢.˘†L„#!7·#ÖÔóı•ˇ¨Ø0ı¬üPÌ@ÎÏ:úü;ZfïmNpN∏pÚÿ¡gÓV∫¯Ñ˘˚d
}·±˝†5Íá4Æ7xÆıåü)ôÎVß5˙9Â˝⁄#ã'¸Í7¢-¡R<†ı{ìº˜ox˚Ëœ˘*ˆ‹–Hu–—3Ãπﬁ÷±ç2œ¿&‘Aœ3l¶±}cœ˘[Ï˘,C7—ÔÌ;Fß√/8Äﬂ‡»ˆt€é\‘§¶ywÑW0!T&´°[N¶Q,ƒüi!89˝Ç”÷ó^¶Œü˝BS^˛Û)ﬂáè‹§aKøóù≤¢º#Ùƒ?$o”ââØ¥Î*É¿0∏/}BQ.®‰ı°ô…π»E∆Zà+›äÀˆuáˇ∆~∫∆≈VæÉ◊7ä/…;äj«È)Ùúƒ^N3œ≈FrÙŸ¨è¶P‡ƒCaûtÑﬂºÒªÁº˝9oŒ€üÛˆÁºùIyª6ﬁû¡Œq[˛„Û¿ç Híﬂ<Y–ˆ3˘HdA'ïY0D›ñWÅµª≥≥]≠≥JyKAJr∏§aò¯÷àA-a„_dXRxYò[û+PPÉ“B©Ü√+nLÿ9π∆p!øÏ/ÿb⁄√Ï•eè%‚Råu˝Æﬁ1˚‘Ü‹Ú©˚yH•¶iS®N·Rë´;ÚÕ7P9√MﬁC«ŸE<∆Ã›—¿Ã+Çit£"ﬂ&Â#CÆÕ*÷sı*æﬂ’Í˚¶V=ª*’wCùí™9'≠FÒÁ∑{@ıMä÷"PŒÉg˙}Ôyk+5kƒ€´lç›∆|RˆC\^¿mÙXéâ)¨A
È^¸wΩøÎMºp≤ÿÔO¸]/«~˛TªˇSºˆÈ£w?g?¨au(ÿ◊xAC›~YÕÎ∫=√ƒÚ mÍ¨¢5HÓË˜¥Æ}Óáå∫ºoX∫Œ
ŒÍﬂı^8ä,À}˛∂ˇ˜_üº√~ö—ﬂ‰iâê˝ÈÌåká¿Q=^lZyZC`T‰2e'/#64÷P
¬,rQvIAed5ÿN%2b-EK°ÜãΩo2Äa—”Z!®lzÚõ_e ïÒ€±$øÌ¿ËµÃÉºâÈ	∑=t(≠o‰0gCÎ˜	 ÷{≠óp9÷^8‚1[˙nµå+
∫iœôÚóÒ´ÿ‰OAﬂÌ›ëó1„¿§˘∞L«§7˘0Oê¬&`Êû(?â≈•⁄ú|Q~~˚1nà—€3…æ±œ2UkKÄyñ%¿<+„ÊY;÷5CÌ5,∏^¸T1û§Åm≤ºùL´±~ÆÂ>◊rükπœµ‹ÁZÓ˜OÀ}yªå¯9´l›4´J⁄4˚áu‰BüJ¨ua&PFÖ]	πÒh.VµH	¡ìG1$’≈ÏŒLí´Fï‡ÔæMÊ	◊àjqî#`§(?HHçﬂ©ñ6Àªõl∑^ÆîÎØ≤ıBÌ⁄ïÌBu]÷óäWÆ{ÂÛœF"|ÜÙ˜∆‹ﬁ¸•h˙{8qIô˝æ@9•+<˝˝bb˙˚ä$˝}.=˝=ÊÕ§é2<EÏLEb‰ÒìÊÉd5≥1k^⁄=<öuÌk√G£S¿±ì˙ék∫Éÿ°‘!ÑÁ„˚ıçú}Û \îîâ&}÷Ï˝Ü_Aì%_.ê ≠ÿ+=r‡&±≥Õ‰é|x–uÅYµ<6ïΩ.¿Ì$´⁄—[ !g0È+ûB˘ÖüŒI¯≥§Ääz√Á§gÄ“ˇÔ3ÃÉ4S<øÚ*i?üÚïW1ÍÅâºGJÀá\ùyõ˜˜U˙†^3âZ’µNÆntuÊwœùaªΩÜõ€b.ˆ§"ºMÎÆ÷k¬Ø~ΩÇ`Zfß£[∂bNØPB∆°3VK‰óeòÍqÈä±¨‰ò∫∏",§ãzåâ"uqST¿æıqâc∑~ªäMj;⁄!¨™o~ä.çWv ¨JúI¨c;0úf®"ïuGZﬂŒ≥nk5⁄	w≈Âº_;áë?©"¡º«ÊWih;ñπo°ı¿«(¡*îJÕ=ÍÍà1eY∞ÚR§±#ämíëÀ…ÌÍ≤•≠Y”	Ÿ‰ôÀ∏‡Ω∑óı»=è«ÁpTº.¬ÑRüIX
œ‘O∫“Ü KÓîÆêl¬ÿ4ƒ∞˚¿"‚Aä
|‡(œÆb?‰Ú2óîJÈ˛Iã_Å3QŸí€∏0cπÜØ®ÅéÜ ¡È™gB!«›}â9‚"√Ó±,gô? G¡√önØ∆{kK@jÕC˛Øµ6±∏™™≤AÆ‹—÷;¡¯'7åñ”¶&8{Fß≥6A¸R’ÆY|•Ú¶M“±ÅäΩÅH	Ûs8çÑßFgòp©8˘‘'¢H‘,K;\;Z`†bkN;ÁÏálqAïîæŸ‹€ø˛35V˙\˛“≤≤˘t®
î¶÷˙Dﬁ©Í≠læçßà1©dHZ⁄Âô`	g/„YH≈0à‘M\û_ò˚õ‰“eÍœJ60ËâÀ7v69#:ë†ÑB¨€ÀCı?¢Œ\
}Y˘¸ƒ⁄z1?X,‡]˛“((!ÿº√T‰‚§c8d	´ΩEw]T5–4∞ÓsaΩ°vﬂCipÒ‚si ì˘ÖˆIKó’—^@dÑ3 'ˇÿ≈¡≈ã? 7~Gw®Ì¡∏§ARÜs°’2\ÿ¥g–XŒ⁄u–É,iÕÉıyaYQ"ªrCÙΩ§Á∏K“£<*º» ¢Kå- Fü¬UÊOˇDÎáÂ«"Å-Ê≥µÛ¿ükÊÜÕ>ˆ‰{]öÙQèﬁ’¨n(∆vx™ìŒ⁄∆>à0Km@›~KΩ˝éa∑©‡5ªk6µä˝CÊ∫àl÷B™ùa]Õ _p5XËCÜqÅÆyóÉÃ–3»ï	#ÂæIõ59æà–^ÖD”2˙H6~1¶a{{;?îM·M≈ÛùFΩ4ËπŸÓÛ$‚SÛè»êæ5ˇHE;D_ï ;“G¯¨ë\#ÔP ˘≠ê3ñÉæáöã}%Äg…<h?Ò Ò/›ò¸„…WR(xûzéëªbh´ÏÌ˚Ÿ]&‘—»u”°k√wÓ¬¬ÎdêùŸ⁄ßGb(nÍãâºN] ¿
HZ…∆‡ëB8÷Õs?∏5",^<b*¬Á"Ö¿R∆”Gø√ƒîwÃùÔøè∞˝&íç–ûàÅ§‹9©KûÙ¶aÀP¢†IA'[O∫$WS$ëè)‚g9o˛úˆ≥Ä;á6≈Usõ(pˇ‚c!√Â#ˆx‚≈L¯ä}Í%bPÉZµuΩﬂ1mûﬂz’4˜Å∏Ø¢MÁR˝]D908˛&ói‘¿ÿÕpØ°˛Õv~ËuVkJÄ”Ù÷™AN9Ã©K2•lö-}Íú&˘TŸı4»nî›Üçk¶EY-oµ∫¯πÊÅùÚVº>Ì∂êpΩn¸R˝^3≈ZòÆ˙ªîÏHju~∏˙J?±OåB0”¿0QÑ√5qŒ&Dld·£é3
O∫†£B®T„}8GÜ'ÜS9iÆ™o´3>‡]A◊TœÑn†ÅﬂÀ-”LƒOh*rô©óLV¨7å.º·µîZ‰»B∑=¨wYyÂ !œx@)3’iXÅa ]äMq√”e’:v±≠7Ô]ÔGzH&
„…É´jc>∫–ÛUoHãAy„ê¸ﬁôöƒ»2ﬂ†
63Áa}qÎ÷¿iµRŒ_≠mËzn‘é"œ2A,Ú–Æ'ÀÏﬁ`_9µ›åƒ≤5lŸ∫GÛ∞— ålî'}ä6∂·Q‹L@Ï JeÏ‡∑=} '§„^•˜ˆ•2·7{`°N∞f ‡Â˚<˛n¿Ò*±¯¸«Unò)|Öê“Ä©S›·*€rß‰Ê
Ï–Ã¥˝}KﬂÁ¬3-≤(ñ∆qgöï7Ä[–Yƒæ¶¿ñG«ﬁÑ{q=’Ï!’PŒÏõ bNüæ√’'Ωµ•ÿuÃ^‡˝È£w?ìSÃyÊ›Ç±UÈ$â]+G\aO•ÛD¢ˇâ	$ÔfªÎïÅÊÖ-DÎL+é&˛§‚‡	:c≠QñMÉªÜSû>u?#?/SSÁf}òcÛsQ(Ë‡'ÇFöñ)£Üï(f¢ﬁI¢IÎ·ÈÆ	œ¶°=›8ªˇœ^ÖØBˆÇ¸J%>ü(wq)]ZjmàæM—¢O.Ñné‡fBQ|◊Ë°!º∏‡ﬂî‚›>Íπ4pˇ√K›”#I£75øÏ—‰ﬂ|7h≤‹#í¸¯ÎéÅÀΩÒí£O‘U—˜î ˆiîêç©ﬁükí«B{ŸÊÒz<I<Ù*ÇW*Í‚íç»ƒ$?˛£é°ÒÂ(#9I[¶ n‡„X~âñakçéﬁZ;2l‹∏äIz∂|€¸ΩF«xGﬂ–ùf˚∫†L§ô˘ÿÉh7k>útl¥ê™„çLRC∂û¸Zj©Ö|Jˆg2%(fUﬂe©]<àÿ¸ãx¢¡N≠/Ëbj8ŸÁjì‹+Ãà=dJ≠ÂıÇπ~W;ÏaÈx>üßøn›√ç≈]! ·∑”n3oª~=9ù–ä#’ç ˝P"	ΩíˆÏ5[≥#-/ˆ:Zë[	§ÜT)Ö@(ª˘§æ:q¬∞ùCêGGDÄ5„u}ï›~Aê‘∑gZù◊t4a=Å'„û±¯j≈˜<É~gÏ¢<Q%R††6|‹N+‰üÌíe°©	R±ü˝¢§‚Ò%˜'Z81⁄'‚≈ÂÛôÜŒé˜ mπ÷<∑˝1»áïﬂ;E«Åf8jGÚ0>ù;…Â8^L‰Á]∂Øf¥Ó)Zm—p√yg≠÷Ω˚Í0u‘dÖl0‘#¥¨JÜBé≤XãèP˚$°^i!öR£NVR€c‹['M-•ÜâË—í4áP##)˛∏’’∞«.Ωﬂ’HùÓêåâ!—ãgf—œÅ 3_ÜΩÈÅ√Å≥¬e˝!Øc¬b∏*aﬁ6VSW+c#Á¢¿óÉé‘©…˙ÿ1‰‘9ÂÕÒ•AàÛj:›ŸA¡mÛ√”Ë„—N<;Ó∏;?@xı˝ÀGç>ly«PøQmΩº8;Ëd•t9*›ä<eHäÊ¿±VÖ¶E Å3¨)^u◊¨ø´g2|÷—Ùtúœ≈$sÃ¥ÏÂ°ﬂºÛ+T
’MV-o]Öˇπe°ÎÂBe˚j∏:¥–—¨.fÑ¬ˇ®ÇÒlñáMF¥n˛ã¨e9≠;Rby®L=
`¯àÚ`í
C£C2Ya¡P\.»?Y\∆4Ê‘Âu5ÊC‡'´1@ ©sYÆ\÷<urKdñ°Eò'É’µÄBÛ7zú‰q˚nCÍw~˙Ë˝#T?À±$>w{RP"áy»”æ‰N
3àùHi!∑§ñ‘öâÂL∆uU«ËÍù8r,≥¯å5c˙u]≥ˆu«À¬ûà3àx9®ºÔ@4”M^7Ù*<˘EyÇÂK£k8lä˝⁄∫s]Î‹GÔ€¿—ÌiÑÆhÚlD˝∞N]-ƒl`	¸!≤PbF∑©çı®ö¬%î ÕfiÓ¬‹F¥‹5y/Üc+ÅN¶XuL1›UP≠LπQ≈-Ló¨9zﬂ^Uu›ª¸Õˇ˚}Gg[ŒÒıe˙°é9k¿ ﬁa¶≈⁄á-∞ßÙºDÖvüAõÿ#pûÛBF‹∂Áÿ¨≠?k†ràú!g√ü≠¯√≤lEtS“‘§@à®6V*ü∫’
–Ut+f◊∞ÅŒÛ.’ò÷ùL8bY¡-mW|ŒÜ˝U¯Å7G∏B·ö‚MÅ"\¥ÜI<lÜèéOıÕ;_"Ä»:_0∆óèªs1…Îè!wnÏå´ ™≤‘7J{¯)winª¨ìá'.∫´=+¿c¶Ä°Lˇ-õùeÀ»%mık´:Ëa’Òîc“˚,O‘z¶˘∫·ªÏ1aƒZ{úÇµñ‹Xy"Ü≈í…è¨¶?;M∆ú/ƒKH“
2˝ÁÃ¯r¿JlqäP“ﬁY ¢∞ºe?d+sÍªF"•™N>DR$UC£s˝Ù—Ô~ñä£òùöRº’ôxôKKc°ôﬂ˝åπÛÊ|,Åh¢üè’{˙Ëˇâa€Û¨Z™mÔVã%V)ÏnØ˘Ml√ÊXø_—¿¥h?+kG≈ÈijΩTîRY¨0“Ë∏û„ÄÙú,Õ˜4Ay¸ñ@Ú–w~˜ôÖ{rO#“f∂ËÉ∫r*]'ÉMÑ?+zûïÓ¡:`Â\Ú«1Ô$êÚO¬·ûf˛á±≤´?¢<àœ‹VÉè?ó˙ùèÅ™£8båN*h„ıAù¶Mg`!Ï0~\(≥b[sÆÓ‘gº|ÌZ≥mKöa7å;F_oL~´X™÷ÅñÃ;6h6„È#Àö;M`ö7 éIì–å˜—g$Ît"¯2u≥o4ÅH4–-¨§¶D2fÿgohgL2U—e¥|§»mâÎ^ÇsTB∫^·7◊õÉávÚº˛¿SıqF9 á±Â¢¡¶q=ü¡K2“=RA™H$Uﬁ£^ZÕÅ”s⁄Fo5"wd¨îäî∫ .üLº´u˙⁄Q«=|Ωhπd⁄#∞¬˜·Ü)›;Hï¯≠Szﬁ!óOû/ıù˜Å{Ím/µ÷&Ù¸~ûÌNWÎ	X.-£ÈT’ãs˝ÓP]·DwL¬€,˛¯–N€tL˚∞Á¥u€∞Û˘ºlñ·‰eÅ}9o^H∆èÅÒ3* ˙rƒﬁ$t;æíŒ3.ÍÊ>0XoµØ# j≤{tõ≥+u£pó#,»OhW‰Pƒ˚ã≥‰ÑaW€!àÌ–∏^Çaô∂U´]ÚßØñÑ¿39Ä'èÎ7.yœ£DâÚqMŒÁÎ\›·˝d£¸[ˆ6yeOK,±Bô˛πè“ÏVP	Qµ>˙Àì)«§â±™uá◊æ∏i4∑˜ˆRœ‡ΩxQ¬“¨•$£€¿4aÓÎû∏ú4ƒIˇLW¡e†o&ï˘&«≤v∏ê˚— NZ†íÒﬁ=ZÌBnàé@≤)Ä™“é˘Òâ@≈Dç”õJ‘q£€¶°ø¡÷≈‹Z“.„cÛIp¶«ß·jüÚFgq∑∫«A–xœ¥ˇ·BT˚ﬂ,∆ı∏êq6Kb˙„∞·«÷>πö¿'/ö„‚úíß'tå˙Ë7˚˙?ÚÚ°]æÍE0|∂.‡Cçgﬂ¸‚∑£îkf∂x\˝.0S0n|ÕÉXﬁñ∆Å¬89Iˇúx
\S+€ã„Ê%ç%§'A¸Ú;|ƒzπQŒ√„ﬂG¨ﬂ1üd )	≤˜›âaÈ:Ï£ÙVÊhço·ƒÂ˜5∏ÆÜ¨R!úñ%Ò„∆œÉé˚ªvƒ‰¥N√ªÔG|?c>B‹Èl√ák·˚ËiﬂÜLàüﬂ◊ñı,Ñ“R¸£ ÿ	üÑ‡´ÔA‡ìı¸„?	>œ”r4yß∞—OÇ$G„‘Bπg;Zœaƒ‘§¨pˆ¥¶cá9RéÉtXrnÏ)3.ƒsA~ÁLy·∏Ò•x‹¯‚\&œ]zhEëªêbƒI™NwGIHY‹¨˚øªÆ˘ÛLﬂ—ú∂›÷:€ﬁÉ›}ó]!á='e•Ì-•ÿpàÊûÌj5ÙÂ|Ûã˜Fh$≥ÿã´k∑Zqù—ÑHêf≠gÀºäTµèh‚G˚Ñƒ*ZùBÔ–õ’ΩAV¸,Œ/õ…ûΩÜ˝xûbéëÊπ∞?OF?q1z„–^bØ; vµÏwtlò‚Ïuè∑‡ÏM˜√{Yö19'ı#æLƒó(‰gü™áÿ5iùÆ«[‚ÛÙ<û°¸2í™;!?+ j∫ÑüîûI@Cq2π
@„È£˜ﬂØ”/{äC°Ra•6k¨ˆj•R∏≤[cÎÂj©XﬂÆæKqx±–Èî∞ÂjÌ∞”—õ2f¸◊6NgçÚ“√◊·Á¡v·∂ö∂VJÓàE,Õ^MG'Üw—éev˚<ßOø‘aœb˘>à:E†&◊˝`j≤	Ü_∏q&]¯êò¨¯†‡ö˚‚p`{€ÈhΩûn›0ú6éY¸É¥ó6 ‰…¡—ÔEF‚ß˝‹ˆf$©µ∫Fÿ˚¸}í•óΩp‰Ωı˛9"$ÏÍ¶M Á‡øfÌ»ˇ’˚vˆr8ˇçüÌÌ´ï´ØmW
Uƒ;*÷KõÂ"Êƒî
’‚5∂Sÿ)Ukqr	Ÿ±ÜìîfB˚©X…T#ø'F7Fé•÷°ÿLö_	zaå †1 ä’J≈›jâvÎ◊¯r‘ÿTe˚jykVÎjπV/Ugÿ∆vıÍvV≠Vª±]]üù∞Å√W»ñ®™Ôc»¿Úè\$~[$ÔÀã‹_&ªbÓ=Ò-˛±W–7±Á˚◊KæaZ˚¶#>=¯$ˆx˛UÏ˘¡ÊÄßﬂGyw—€“f#Ω)€*Gnÿx˛W†/›Ÿ•è›_F°ºkÖ≠+noÓ∞—‡˙ıhæÎ¨v≠ ‰X)oΩ"ÀW£Ñ#’%&°eœeã_°ÁÙƒµ¬\iæê5qÕœXÛ¢eû∏∂‡8â∆æ–héˇÍeàa»‘œÑrŸN%óM^<MeΩÜ$'m|πl9Ù≠‰Ê√¶D$ôﬁq≥È}˝ÎÆ°âÈ¶pI`Å≤À´”h∆´Ÿ	“‰≈Ìk±"È™ä:©ﬁu“ÍÜA„b8Ç* Í ÛÏ8ÍÔ/)˝Á≥8
)zÓ3⁄Ô´£œ˛ Tf`«PŸßå¡,Õ…jÑ›™πƒ≠√ÇQ•ŸÈá"ë0Ï»P'&dA¸ë≤º6U¯˚õA3È'^¬„8Ë≤«åM¯ÇÑIﬁ
¯M6üÛ0f?˜õ]•o5¶X¡)Ñ#Ÿ≤gÄ[;Õ62]™;¢$2rhûd#=µ7Kúaat¨l≈¥E—Œ∆ç{Z)â∫ÜÅZBUŒUåﬁ∆Ì3]^¯njâ/Wôî8ü‘'a¯Ñç¸Èﬂ∏ÌœÌ''∆È€F‚7ºø‰ó—æÓ/±)æÏÜi›°˘Nª†‘Ù` ±ñ…Õ;@á.&!eΩ£Ôåyè±ößPÆ»RÇÁ¸Ë¶‰D1£Ébõúa4 :t:ﬁŒ€ù£5V“Èñe [ãª{m`ºz⁄ü˛ïs«Ò/ËQ¸™ƒÁ`Zí)<Ëõáø∆ö2?c—ø0˘YM`8@ä¨––~˜1´ÒØXÖærü(\û¯‹>ÊCÊZÊ†·Ñû˚Óû*…÷›Ø¯s≈ÀüK•ò9≥iÖü˙êmQçÊv±Í?3∏4ÒâXÑ…ówuq´øyÁˇe‘r∞Ó}√*^ù≤Iæ˜ 4“üª)¡;¸o£¸ã%=›oqX	‘EîêI\£ÓŒ≠T≠Thpbˇ¸`Î≠∫÷òrü´G°Q#^o—Ω»'∑2 u˜%^—8{ãj@ûp™»eú1	s&~ÈŒ[qãóEÍ)‘hËD›≥Aàb´¶}ÏÌ®)≥8ßJ-ç%ó"LqÃ¿PãY˛·Ç$Ã¥¨xÁ0‡„ú‰àÙÂ:ã
ú+ér2D
%wãÇâΩÛ*7®Ølˇ¯x‚x·ﬂ°D∫ü<¥DOÓ)Ò^¥iBH¶sUıM‘Vß÷7…&<Øû‡ÜGDøívë
Ï¢TJlô#Èë$içì›@À≠%ˆmé˙∞ ^VªˆBÏNE´É’y$ª}!)ˆ'˙FDF'Ø01äfÈZkª◊9î|Âÿ`Õ`âecê,q¡ıg5∆,”RA‚±1±"Ã#,™PÙãåS«Ùö@= p:.ˆ∏«/ ∞ÚÜäÄ˘ÚQ≥{Mñ$%õf!XàË`·ÿ€J Â%aì$,ºMC®8¸Û∞n¬†˚‘Ï| œL‡´T<œÿcS¸i”Iä@\®'TJ˚Âÿ∞oSÇ1)◊fp?UÖ∂åúRJ®Aa∏G•“pj(z®∆Îå«ì+ËyÆ¨JâÃ^±r\ë¸1+°PhrÕâ.√w¡G±rÚ‡äe-CZbûµ˛DQô∫Ré§ ´$6…X¡8’]G∆ÔØ»∑Û7iˆı„_ú#1»á~.≈'}≥
{1qûpíO`~Ç∏èL6‚ú¢˜sI?¬Ñe≤ıÿU2Ûπb•\|Ö’∂ãÂBÖmñ÷À7Ñre∑^ﬂﬁ™ùDIËÈy_ﬁ˝?‹Â¯6™hè?Áû≈7®ÿ_ÑjQR€i~F[˘XÌgdS€ -yÅù:O•Éwq˜„]Cc5ìÆ61w$˝02'z|Å`ß—MÑ“Úf=È‚:]P◊FEÉ‰∞‹–À"öì$Û˜·Íÿ´¨™7AÕ{—v, ë∆ˇΩÔVâZt¡NïQ®hºÌãÔ3bÁŸ&¢µ’u€±'eŒ¸!/πô˝÷⁄Œ†eòp7ıÿùﬁ-3Q>"‰˜¡J8√r@)Çãû∂aZ›AGc◊ıìDO<Ip˘u@‰®o:8õ&ÊY¥0B“:∞&)˙ÄTœ˝7îkÜçU5Mòã‡Ìa5'ﬂ$¨H‡≤¡—t1Ëxvz0π˙¢ÇíÇ∫nh¡OqœP@û3ºêS¸àR$Æõ¡7∑X»'9ÓåóåÍ´Àíûï!R≥R„ÜŸ∞—}Õ*c˙∂‘ÍlP7‰ßè~˚qB äæ∂$ΩÏS ¬Í¿%@ÎûMÊ—•7ã8]ó∫Ï;á·å?¸`òÑøgè™æy¯÷_üºìFWﬁíéHWî	¬zMŸc€ÆAjûBªö çÁmñ§˛z∫æﬂZ◊è˝ämxø‚(ßﬁw.(Œò«˙¶¶Gˇ“ø8¨óaDÑZ]“¿»‚∆˜9∂Û¿ÜÙ¬V◊@$"pÂ˙Ê9~k∫c0wÛ ob¥÷œ]>88»ﬁc)ÉÙ”¨⁄ùQ ºÛ,1:Ö‘Ã+°~…+"bc`nö†óŒaÓ“Y>ˇ∏1ißﬂﬂ”èˇèŸT˝ µk˙åK>ã,^$Côzpzƒ•Çn'—˝ÀÉTë#Õàd∑f3hùmöÛf1~¢ktzXù°OŒ∂>ÉZi§Â-ÈàtÖÇOoï„›@Èﬁ≥BWﬁ,NàÆ.ƒËÍÃ[_ˇôFWﬁíéHW•ÆftŒ6Q—∆OQÆW?DSb∆Ôô•™ˇ  ˇˇ‰]{o◊ˇøübå¢ÿHÿ‚<[£ÎY≥…zwŸî"‘ªcÔîŸôÕÃ.éCêR™îDiïF)D"Dƒí°QE
)Rø
Ú'ËGËyÃ˚ﬁŸôµM’®ÄwgÓÃﬁ«πÁûÁÔÏﬁ˛∏ÄˆE≥∫G¢
k<SÇ$õOπ$éFFcy*War#∑RÇÿ"W‘ˇ6©—˙fπòíÍIµñ'9c>ƒ`J
∂°!o†éäóæ%C˝ö„B€ªSEÌ¥ÎkjªR‚®ôNcEmkäˆªFU≠¡ÂzM9©÷jZsä‘ÊW’cKô·«Â…ÕÆ_ √í™–¥«îâ„Y(<aö8{zd°≠°Ó^≤o"-ƒﬁ'%á\b¯,0(|OÅ¥w¬ÚDÏŒá‰⁄&+¬äHÁ˙+h±∏Éñàπﬂ.÷7m4y≥ªGèúÅ>2ªÏBË{`æ:÷a«å£óEbÚ®qj√±BÄæ“·KvM»√g;O%û≠»ˆE¯)a÷yò`á7£˘{‰á,áµiû›E˜ŸmÜ9~Ä3àπ áÑáìZ&äùõ¨F∞H)˝0®ƒã[ñw0ºÍÁ#d#ÚˆZ´ÃÕûÜ°G‘ﬁ7Òr˙Ô˚é¸~∑xÃ∑È∑·µÈXÎ#Ï[7d«o∏πÔ3¸íz¥‰0¯©7¯iáb4∏…—ˇ€ÃÆ∆˚YΩ∞?§ÁV∂∫@ëÌæÈÒ1‘√“îó®‘çßw†€∞k≠-∏§ä^+¥Wˆ]«6ﬂ√:#g˚Üm¿QÇÖ…Iˆ"¶≠≥
>9n‡Ò<†á„ãñÈı±Ï‚eN,ø´[õ¯kXh‘7$X8qÒ4DÿEœ–∞€=kK¨ºX®∆)ÃéÉ¨]W˘úsUÿ	qú€Y◊CZ–Rq"ëaÑo¥waˆGä Ω®î`˛ç≤í¡&co$Íhñ·MîçÆ2f∑®ﬁ–D˛„…^øü§˘˙Y<Ø‘ïµJ3~õZ[i«N≥“ÛÊØò^}”6‹ÜiÔ3€rÒ ≥-‰Xû\,ã≈"¨§%Yí%t)L≤|%V|mRveØ)LØ3*_ıùQôÅ&∫üú ®(\t\ƒ#ô"ãíÂb!ë2éë%çê±Åh(J*≥Ü.◊êJ)œ;ΩÚ–	⁄jä⁄`f#y0HÈÌ!Ì/ÖH0õg;ü”˘ıàèæÒu/<∞íûò£ä∏+-TÑˆÆ:›Kˇ≈‘:Å˘¸_g◊UÏuG9…`tV3ô¸ÿq«cöfåîéK*¬NÃH–f°ÚÔ	§7©∂ëµÅó`zóRÑ?A’ «#ãt,w˛D[eªh{lì ˘8 Á≤≠ÃÒˆ,9∂ÁXFÜ”@Z<ØÄj w 0OˇGjqBh%	˘Ó5:±ßˆ	ªcØ£|à£1',˚nπö…cñmüíÑ}M	—œü–'îØY#àÊËF‡˛ÑÉÚ““ı˛√¯ß°¿LiíÂÿ'Äµ∏ m2Ôafîod3&Ë∆ﬁÖOW¯ »©7:vk|q`éB†,—"e,]ê∑Ì—ä±Æè≠—úƒƒ+¨¬æ¨8>3#¿ûÖëkdO`∞˘˘Ÿ◊_ÌµŸ# Ï±„/-·ﬂ>∞#›ƒOC›Í≥∂4{a¡¥ªàçﬁ¸ƒ¬»©:õÜ[ÇcfÓay¨zƒV;6∆aΩÏ(ıâ,8„Dôª¢ÿ@Êopí†0Œ—õ√¥4æë o7∫›·æÎ`T◊,Õ◊lÜU˙Æ[Ë¸ïy;
,eŒü¶y)ô˜∏®)ºÔÕVΩ∂¿qÖ LtÔ≤f"úDçÁ{∫◊ß éY˘3QÒ¥ﬂ˘rXyWÑß/ ÍÍà—gzd$¥Ú7ÕÖºÚíäÀ'ßç®ª_˝ïÕ®∂F›¿ù
ùòÒ˜6È∫?0ã„BÓ[˙ñım	ã∏J§µ√∆∆ﬁoÍÆ-ÌzÍä`jïÑ3/%kô\$9çk ä{\Ãƒ#’Ë¿Kœ&ïø‰2âÑïïD69·iÉÿÑ_ñÙÑx/eD ì‹Û≥û\´(§`=˛–‘pÇÚiöQ–(°¸ìïT&UŸ'8&X•kJg√F2à§ÀÆÒŒÿt1MV"JQXuáÚÃs<•|ûZ´cG_
kÿLIPW˜e\“ÌÆ!‚gß‚ÊM†GbC.±èM@fﬂåê∞TôﬂTﬂ•EI(“7sß-K≥~Ö5ÎBì ¢E $c]LY≈ø)≤^P@K}¶®Ñ˘œØ,≠“j´oiJS£‰rﬂîÍµí÷hãV/Œ*X3Ωë~âë]RF/L5o7TÆ)Y 	AŒÃà/åÔ P⁄œŸ¿›˚j¿wó%ΩMæº•_6⁄f`8
¸Jõ¿Ë§xﬂ:j∆çí/j#w+¿4•/%våûCÑ	àöÕZçõ?£\SÓT´J´‘‘¥öRYSW5ÂLE;´5ïjeıTÛ”Ö5AÓ^Ä¥G#ƒ‡[—ÎÌÑz•Áè-.^àLìØKLìƒT© Y◊±¶6O¶ñ6…4ÀÈq§WV0n&ˆÇ¨Æõ/óíeNCx∑	†sõç[CqH1Kgˆ\$ôA4T@,9√L´æA€#âÅü⁄‚Ç=ë±¥r≠˚hŸDëÎ•lÎgAlhv~Z‘3∂.¯4>ó˚Dgh9@-=ÖHAA-¡/8˙È–wÿıtÔŸ›?’fŸÑZœ•ÔÎÀ‚º*kÑc„Ëñç˝Q˛ÅRúÜˆ∆!ŸIÏc:èM[ﬂybúÑÌÃìÂµ¥i/√ %;¿Yä]¢¬•¬ùµ|»v0≤ú\\0kp»Ç≤»Ó˝ÎÑZ¸òHaõ4©èI3¯Å]ùícTœîQdsΩÜTd°$2èö&öEZë≈ÎΩHvª∑o(tÆÓOÙ/•∂VËÏAe*`ΩØæå¨7◊°U9ôî9ÿ–sª≈∂°n°Íá
0 `/*óÅ◊H∂alD|ûƒOíW(Ù‚çÓé{ÑÆ—D¨
üÔZ“F
7Ï,⁄›¬m3üµ]éÊ,Jqqp˜÷M‹bçŒ…j•ÑraßÖ“G≥S’Zò˝©ñµˆ9eµSY—™ïö&ÅÜVÕ˙ÕªÕ±ed√àõ—Ì‚©÷ÇïÒúÜΩﬁπIx∫X´æ÷hjß¥Z´rF√ëñ5µçœ/*ß¥jÉ«(çI™y ∞Ü´c–s≥6»]¢ÈC√∑’ÙÀ& ó˙¯rf§ﬂ†rl¢Ëf[2$ÒÙ§˝„o¡§E!_çf˝dU[SV¥6a #qúkµÒJE]≠’[–HB≠-∂˚ä©oÿÏÙn&Ö§õ‰œ£Ïâ)ß≥læÀ4·≈~(HŒL˙≠¶òÃ/>√V™jjì0˙Kß‘6‚;◊ ïÊÎ]í(ÉíeËÆjYhÔÌ)‘Ä¢	≤„º¡Û
5∏∏∏.ÜÑ•+óíû5f≠–ôú≥<æ ¥_N>}ä¬ Á;ÏŸ_Ø∆Iãj@«8Ê2≈·r˜÷◊@˘«n¶a∂ø$»Ì∏≤π}:00≤G?‡|≈[e»N¥≤∆>%IÏ	á–q‚„ßàË…x Hª
πâ√≥O	Ù["l'é¥ø$‘ﬁ£≥F$iòåF˚Ñ¨Ô◊˝p>≤˘cﬂ}ﬂπà≥Ò˚F˝p∏t°‡‰Ûßà’óÎ~ Ê›ùå^!oõ&náXî[œ∞q^=êà{ËK£∞l*ˇ)†…›Æ≈¬}ã#⁄v/2∞NàM7‡˛™g≈!¢§º≤PdDÆ–ûixÕí‹=c` ™c≈§˜¸pâ	€ÚQ®ø˜$@<dªïD"fà˜Qø,1˘πìÕ[˛tá
ëP˙xØ*íÄêI/Ùc=û”Ç0+¸ì«{?ÕiaŒa‡È
Ô_ò´Ç+¥±Q+@T[©î‘∂∂B2’{iWŒ`X„©JK^WëO∂≤µtì|AMˆƒTÇ±;"∞Â+—ÁËæüéÇW[Ï‰ÆÙ∞˛óx5ﬁ—*®x˙äÁîL+I^Aç”p∂~È°5h=˜∏Õ¿ˇ¶ºˇær˛B∫}N-£<òÇ∑£s˘–WË˜˝åOo?fˆÍ!%4ó∞k˘ì‡XC2y0´¨
ão¬Q·®Âe÷¥◊ùåjDéÕŒs ßU+X≠x≥¶ÅÒ‹,∞ùW‚Ì¶o‰M“Zå˘»R•ÚËÔ◊B[˘Yí
	âçöúÊh´ÍlxæÎ¡ˇ&v4∫Œœ–ËbIJø{p'Q#£Zk∆¶O•‚Ëb˜ÁÚuë›W^ûoµA)k⁄ IµÙ0ÖNKk*≠ŒÍ™÷BeD¢√ïÅN±+e√Ë°ë≈“ÌÚ9ÉÏâ©8É¨œûÍ ˘Ö•Jp≤¿!≥|e›ÔQ%q=°;˙-8,jd «ôÎÈ#]\•‹≠åÛlÁ/$Çí‚WM∏æﬁ’˘$¿»£0ÈcõbÒ>‚¿íï äÔ+jˆ£,\,KÖ¥8ô!VÄùi√éªÑ»˚3 9gÏ¶˙Éî`ÇÄÇ\ÉÏõ†ªÑ]fÙfÚäó•µ‰[$Îu©R[¨4håj÷’ï5µ!hgÿu¶Ω`Ó7π‘Zù∆oÁ”h∫ıî&.uYk|B•'–	∫ÖwôDË\@>ú∫Œ ƒÎ^àÔ/ªCêÔÆÉ†÷ÔÍnœì›å=≥;Ô(úÏ˛&|Ìc§áe∏#Èêø“~0◊||q6£'5æ¿ìÇ˘%ïIdü¶úÓ,§zFS⁄u•Voeµ÷‘f[)◊´+“⁄wß« Ó‚AFÿqYD∂ '+·ÄüïOeÀeœﬁh¯≈«cÁÑº<`ê‹KÌù‡GZ±ÀQ„uä5Ç#ÃˇPîæÉâ	NÈƒl%¶¿Ö’3 “oøëÊ‚4Â∏ˆ˚ûª∏∏+˚êo«•lhtıWˇ  ˇˇ Öµ¥,