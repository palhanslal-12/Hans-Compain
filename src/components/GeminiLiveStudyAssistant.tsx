import React, { useState, useEffect, useRef } from 'react';
import { speakText, stopAllSpeech } from '../utils/speechUtils';
import { 
  Sparkles, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  X, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Radio, 
  BookOpen, 
  PenTool, 
  Zap, 
  Lightbulb, 
  ChevronDown,
  MessageSquare,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';

export interface GeminiLiveStudyAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  language?: 'hindi' | 'english';
}

type StudyMode = 'general' | 'shorthand' | 'quiz' | 'concept';

interface ConversationTurn {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const GeminiLiveStudyAssistant: React.FC<GeminiLiveStudyAssistantProps> = ({
  isOpen,
  onClose,
  language = 'hindi'
}) => {
  const [mode, setMode] = useState<StudyMode>('general');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('हाथ खाली रखें, खुलकर पूछें (Hands-Free Study Partner)');
  const [conversation, setConversation] = useState<ConversationTurn[]>([]);
  const [voiceGender, setVoiceGender] = useState<'female' | 'male'>('female');
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);
  const lastUserSpeechRef = useRef<string>('');
  const isSpeakingRef = useRef<boolean>(false);
  const isPausedRef = useRef<boolean>(false);
  const isComponentActiveRef = useRef<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Quick voice prompt starters based on active mode
  const modePrompts: Record<StudyMode, string[]> = {
    general: [
      language === 'hindi' ? 'संविधान के मौलिक अधिकार समझाओ' : 'Explain Fundamental Rights',
      language === 'hindi' ? 'सिंधु घाटी सभ्यता की प्रमुख विशेषताएं' : 'Indus Valley Civilization key points',
      language === 'hindi' ? 'प्रकाश संश्लेषण की क्रिया क्या है?' : 'What is Photosynthesis?',
      language === 'hindi' ? 'SSC CGL में GK की तैयारी कैसे करें?' : 'Best GK strategy for SSC'
    ],
    shorthand: [
      language === 'hindi' ? 'पिटमैन शॉर्टहैंड में R-हुक के नियम' : 'Pitman Shorthand R-Hook rules',
      language === 'hindi' ? '80 wpm स्पीड बढ़ाने के 3 तरीके' : '3 Tips to increase speed to 80 wpm',
      language === 'hindi' ? 'ऋषि प्रणाली में वृत्त के नियम' : 'Circle rules in Rishi Shorthand',
      language === 'hindi' ? 'विशिष्ट वाक्यांश (Phrases) कैसे बनाएं?' : 'How to form fast Steno phrases'
    ],
    quiz: [
      language === 'hindi' ? 'मुझसे SSC Steno का 1 प्रश्न पूछो' : 'Ask me an SSC Steno question',
      language === 'hindi' ? 'भारतीय इतिहास से एक प्रश्न पूछो' : 'Ask an Indian History MCQ',
      language === 'hindi' ? 'सामान्य विज्ञान का ओरल टेस्ट लो' : 'Give me a General Science quiz',
      language === 'hindi' ? 'करंट अफेयर्स 2026 से प्रश्न पूछो' : 'Ask a Current Affairs 2026 question'
    ],
    concept: [
      language === 'hindi' ? 'न्यूटन के गति के नियम सरल भाषा में' : "Newton's laws in simple terms",
      language === 'hindi' ? 'जीडीपी (GDP) क्या है? आसान उदाहरण' : 'Explain GDP with real-life example',
      language === 'hindi' ? 'ओजोन परत का महत्व समझाओ' : 'Significance of Ozone Layer',
      language === 'hindi' ? 'आर्टिफिशियल इंटेलिजेंस कैसे सीखता है?' : 'How does Machine Learning work?'
    ]
  };

  // Play subtle sound beep on state changes using Web Audio API
  const playChime = (frequency: number, duration: number = 0.12) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio context might be restricted before interaction
    }
  };

  // Speak response using Gemini-like speech synthesis
  const speakSpokenText = (textToSpeak: string) => {
    stopAllSpeech();
    isSpeakingRef.current = true;
    setIsSpeaking(true);
    setStatusMessage(language === 'hindi' ? '🔊 जेमिनी बोल रहा है... (Gemini Speaking)' : '🔊 Gemini Speaking...');

    speakText(textToSpeak, {
      lang: language === 'hindi' ? 'hi-IN' : 'en-US',
      gender: voiceGender,
      rate: 1.0,
      pitch: voiceGender === 'female' ? 1.05 : 0.95,
      onStart: () => {
        isSpeakingRef.current = true;
        setIsSpeaking(true);
        // Abort recognition immediately when starting to speak to prevent echo
        if (recognitionRef.current) {
          try { recognitionRef.current.abort(); } catch (e) {}
        }
      },
      onEnd: () => {
        // Add a 500ms safety buffer after speaking ends before restarting recognition to avoid catching own echo tail
        setTimeout(() => {
          isSpeakingRef.current = false;
          setIsSpeaking(false);
          
          if (isComponentActiveRef.current && !isPausedRef.current) {
            setStatusMessage(language === 'hindi' ? '🎙️ सुन रहा हूँ... आप बोलिए' : '🎙️ Listening... speak now');
            playChime(660, 0.08);
            startListening();
          }
        }, 500);
      },
      onError: () => {
        isSpeakingRef.current = false;
        setIsSpeaking(false);
        if (isComponentActiveRef.current && !isPausedRef.current) {
          startListening();
        }
      }
    });
  };

  // Query Backend Gemini Live Study endpoint
  const queryGeminiLive = async (spokenQuery: string) => {
    if (!spokenQuery || spokenQuery.trim().length < 2) return;

    setIsThinking(true);
    setStatusMessage(language === 'hindi' ? '🔮 जेमिनी सोच रहा है... (Thinking)' : '🔮 Gemini Thinking...');
    
    // Add user query to conversation
    const userTurn: ConversationTurn = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: spokenQuery,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setConversation(prev => [...prev, userTurn]);
    setTranscript('');

    try {
      const res = await fetch('/api/gemini-live-study', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: spokenQuery,
          mode,
          language,
          history: conversation.slice(-4).map(c => ({ role: c.role, text: c.text }))
        })
      });

      if (!res.ok) {
        throw new Error('Failed to get response');
      }

      const data = await res.json();
      const reply = data.spokenText || data.displayText || "मैं समझ गया, कृपया आगे बताएं।";

      // Add assistant response to conversation
      const assistantTurn: ConversationTurn = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: data.displayText || reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setConversation(prev => [...prev, assistantTurn]);

      setIsThinking(false);
      speakSpokenText(reply);
    } catch (err: any) {
      console.error("Gemini Live query error:", err);
      setIsThinking(false);
      const fallbackMsg = language === 'hindi' 
        ? "माफ़ कीजिए, संपर्क में त्रुटि आई। कृपया दोबारा बोलें।" 
        : "Sorry, I had trouble connecting. Please speak again.";
      speakSpokenText(fallbackMsg);
    }
  };

  // Start speech recognition
  const startListening = () => {
    if (!isComponentActiveRef.current || isSpeakingRef.current || isPausedRef.current) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setStatusMessage("⚠️ Browser speech recognition not supported. Use Google Chrome.");
      return;
    }

    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch (e) {}
      recognitionRef.current = null;
    }

    try {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = language === 'hindi' ? 'hi-IN' : 'en-IN';

      rec.onstart = () => {
        setIsListening(true);
        setStatusMessage(language === 'hindi' ? '🎙️ बोलिए, सुन रहा हूँ... (Listening)' : '🎙️ Listening... speak naturally');
      };

      rec.onresult = (event: any) => {
        let interimText = '';
        let isFinalDetected = false;

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const trans = event.results[i][0]?.transcript || '';
          interimText += trans;
          if (event.results[i].isFinal) {
            isFinalDetected = true;
          }
        }

        const trimmed = interimText.trim();
        if (!trimmed) return;

        lastUserSpeechRef.current = trimmed;
        setTranscript(trimmed);

        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }

        const triggerSpeech = () => {
          const finalQuery = lastUserSpeechRef.current;
          if (!finalQuery || finalQuery.length < 2) return;
          lastUserSpeechRef.current = '';
          if (recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch (e) {}
          }
          setIsListening(false);
          queryGeminiLive(finalQuery);
        };

        if (isFinalDetected) {
          triggerSpeech();
        } else {
          // Pause detection: 1.0s of silence sends the speech query! (Reduced for faster response)
          silenceTimerRef.current = setTimeout(() => {
            if (lastUserSpeechRef.current.trim().length >= 2) {
              triggerSpeech();
            }
          }, 1000);
        }
      };

      rec.onerror = (err: any) => {
        const errType = err?.error;
        if (errType === 'no-speech' || errType === 'aborted') {
          return;
        }
        if (errType === 'not-allowed') {
          setStatusMessage("⚠️ Microphone permission denied.");
          setIsListening(false);
          return;
        }
        // Auto recover on other errors
        if (isComponentActiveRef.current && !isPausedRef.current && !isSpeakingRef.current) {
          setTimeout(() => {
            startListening();
          }, 500);
        }
      };

      rec.onend = () => {
        setIsListening(false);
        // If not speaking and not paused, immediately restart listening
        if (isComponentActiveRef.current && !isSpeakingRef.current && !isPausedRef.current && !isThinking) {
          setTimeout(() => {
            if (isComponentActiveRef.current && !isSpeakingRef.current && !isPausedRef.current) {
              startListening();
            }
          }, 250);
        }
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (e) {
      console.warn("Failed to start speech recognition:", e);
    }
  };

  // Interrupt assistant speaking
  const handleInterrupt = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    isSpeakingRef.current = false;
    setIsSpeaking(false);
    setIsThinking(false);
    playChime(520, 0.08);
    startListening();
  };

  // Toggle pause
  const togglePause = () => {
    const nextPaused = !isPaused;
    setIsPaused(nextPaused);
    isPausedRef.current = nextPaused;

    if (nextPaused) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) {}
      }
      setIsListening(false);
      setIsSpeaking(false);
      setStatusMessage(language === 'hindi' ? '⏸️ असिस्टेंट रुका हुआ है (Paused)' : '⏸️ Assistant Paused');
    } else {
      setStatusMessage(language === 'hindi' ? '🎙️ पुनः प्रारंभ हो रहा है...' : '🎙️ Resuming...');
      playChime(700, 0.1);
      startListening();
    }
  };

  // Handle modal open/close lifecycle
  useEffect(() => {
    if (isOpen) {
      isComponentActiveRef.current = true;
      isPausedRef.current = false;
      setIsPaused(false);
      playChime(800, 0.15); // Friendly opening sound
      // Greet the student on first open if empty
      if (conversation.length === 0) {
        const welcomeSpeech = language === 'hindi'
          ? "नमस्ते! मैं आपका हैंड्स-फ्री जेमिनी स्टडी असिस्टेंट हूँ। अपनी पढ़ाई या शॉर्टहैंड का कोई भी सवाल पूछिए।"
          : "Hello! I am your hands-free Gemini Study Assistant. Ask me anything about your studies or shorthand.";
        
        setConversation([{
          id: 'welcome-0',
          role: 'assistant',
          text: welcomeSpeech,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);

        setTimeout(() => {
          speakSpokenText(welcomeSpeech);
        }, 400);
      } else {
        setTimeout(() => {
          startListening();
        }, 500);
      }
    } else {
      isComponentActiveRef.current = false;
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) {}
      }
      setIsListening(false);
      setIsSpeaking(false);
      setIsThinking(false);
    }

    return () => {
      isComponentActiveRef.current = false;
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) {}
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Render Minimized Floating Bar Mode
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50 animate-bounce-short">
        <div className="flex items-center gap-2 p-2 bg-[#060B18]/95 border-2 border-cyan-400/80 rounded-2xl shadow-2xl backdrop-blur-xl">
          {/* Animated Gemini Voice Orb */}
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-pink-500 blur-sm ${isSpeaking || isListening ? 'animate-spin-slow opacity-100' : 'opacity-60'}`} />
            <div className="relative z-10 w-7 h-7 rounded-full bg-[#03060E] flex items-center justify-center text-cyan-300">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
          </div>

          <div className="flex flex-col text-left pr-2 cursor-pointer" onClick={() => setIsMinimized(false)}>
            <span className="text-xs font-black text-white flex items-center gap-1">
              <span>Gemini Live</span>
              {isSpeaking ? <span className="text-[10px] text-cyan-300 animate-pulse">🔊 Speaking</span> : isListening ? <span className="text-[10px] text-emerald-400 animate-pulse">🎙️ Listening</span> : null}
            </span>
            <span className="text-[10px] text-slate-300 truncate max-w-[150px]">
              {statusMessage}
            </span>
          </div>

          <button
            onClick={() => setIsMinimized(false)}
            className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
            title="Maximize Gemini Live"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-rose-900/50 text-slate-400 hover:text-rose-300 rounded-lg transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-xl bg-[#030714] border border-cyan-500/40 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.25)] flex flex-col h-[90vh] max-h-[720px] overflow-hidden">
        
        {/* Dynamic Multi-Color Background Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[radial-gradient(circle_at_center,#00e5ff25,#8800ff20,#ff005515,#0000)] rounded-full blur-3xl pointer-events-none" />

        {/* TOP HEADER */}
        <div className="relative z-10 px-4 py-3 border-b border-slate-800/80 flex items-center justify-between bg-[#060D1E]/80 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            {/* Gemini Live Star Logo */}
            <div className="relative w-9 h-9 rounded-2xl p-[1.5px] bg-[conic-gradient(from_0deg,#ff0055,#ff8800,#ffee00,#00ff66,#00e5ff,#8800ff,#ff0077,#ff0055)] animate-spin-slow">
              <div className="w-full h-full bg-[#03060E] rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm sm:text-base font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300">
                  GEMINI LIVE STUDY
                </h3>
                <span className="text-[9px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-1.5 py-0.2 rounded-full font-black uppercase tracking-wider">
                  HANDS-FREE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">
                हर सपने को मिलेगी उड़ान, जब साथ हो Hans Compain का सच्चा ज्ञान!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Voice Tone Selector (Female / Male) */}
            <button
              onClick={() => setVoiceGender(prev => prev === 'female' ? 'male' : 'female')}
              className="px-2 py-1 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-[11px] text-slate-300 rounded-xl flex items-center gap-1 transition-all cursor-pointer"
              title="Change Voice Gender"
            >
              <span>{voiceGender === 'female' ? '👩 Shimmer' : '👨 Eclipse'}</span>
            </button>

            {/* Minimize button */}
            <button
              onClick={() => setIsMinimized(true)}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 transition-colors cursor-pointer"
              title="Minimize"
            >
              <Minimize2 className="w-4 h-4" />
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-rose-950/40 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* MODE SELECTOR TABS */}
        <div className="relative z-10 px-3 py-2 bg-[#040816]/70 border-b border-slate-800/50 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setMode('general')}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1 cursor-pointer ${
              mode === 'general'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{language === 'hindi' ? '📚 सामान्य अध्ययन' : 'General Study'}</span>
          </button>

          <button
            onClick={() => setMode('shorthand')}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1 cursor-pointer ${
              mode === 'shorthand'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>{language === 'hindi' ? '✍️ आशुलिपि कोच' : 'Shorthand Coach'}</span>
          </button>

          <button
            onClick={() => setMode('quiz')}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1 cursor-pointer ${
              mode === 'quiz'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{language === 'hindi' ? '⚡ ओरल क्विज़' : 'Rapid Quiz'}</span>
          </button>

          <button
            onClick={() => setMode('concept')}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1 cursor-pointer ${
              mode === 'concept'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>{language === 'hindi' ? '💡 सरल व्याख्या' : 'Concept Explainer'}</span>
          </button>
        </div>

        {/* CENTRAL DYNAMIC GEMINI VOICE VISUALIZER */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 text-center overflow-hidden">
          
          {/* Pulsating Gemini Voice Orb */}
          <div className="relative my-auto flex items-center justify-center">
            {/* Multi-layered organic animated ripples */}
            <div className={`absolute w-44 h-44 rounded-full bg-gradient-to-tr from-cyan-500/25 via-indigo-600/20 to-pink-500/25 blur-2xl transition-all duration-700 ${
              isSpeaking ? 'scale-125 opacity-100 animate-pulse' : isListening ? 'scale-110 opacity-80' : 'scale-90 opacity-40'
            }`} />
            
            <div className={`absolute w-36 h-36 rounded-full bg-gradient-to-r from-[#00E5FF] via-[#7C3AED] to-[#EC4899] opacity-70 blur-xl transition-all duration-500 ${
              isSpeaking || isListening ? 'animate-spin-slow' : ''
            }`} />

            {/* Central Glowing Core */}
            <div className={`relative z-10 w-28 h-28 rounded-full bg-[#020510] border-2 flex flex-col items-center justify-center shadow-2xl transition-all duration-300 ${
              isSpeaking 
                ? 'border-cyan-400 shadow-[0_0_35px_rgba(6,182,212,0.6)] scale-105' 
                : isListening 
                ? 'border-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.5)] scale-100'
                : isThinking
                ? 'border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.5)] animate-pulse'
                : 'border-slate-700/80 shadow-inner'
            }`}>
              {isSpeaking ? (
                <div className="flex items-center gap-1 h-8">
                  <span className="w-1.5 bg-cyan-400 rounded-full animate-[bounce_0.6s_infinite_100ms] h-6" />
                  <span className="w-1.5 bg-sky-300 rounded-full animate-[bounce_0.6s_infinite_200ms] h-8" />
                  <span className="w-1.5 bg-indigo-400 rounded-full animate-[bounce_0.6s_infinite_300ms] h-7" />
                  <span className="w-1.5 bg-pink-400 rounded-full animate-[bounce_0.6s_infinite_400ms] h-5" />
                </div>
              ) : isThinking ? (
                <div className="flex flex-col items-center gap-1 text-amber-300">
                  <Sparkles className="w-6 h-6 animate-spin-slow" />
                  <span className="text-[9px] font-black uppercase tracking-wider">Thinking</span>
                </div>
              ) : isListening ? (
                <div className="flex flex-col items-center gap-1 text-emerald-300">
                  <Mic className="w-6 h-6 animate-bounce" />
                  <span className="text-[9px] font-black uppercase tracking-wider">Listening</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 text-slate-400">
                  <MicOff className="w-6 h-6" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Paused</span>
                </div>
              )}
            </div>
          </div>

          {/* Status Pill */}
          <div className="mt-4 max-w-md w-full px-3 py-1.5 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center justify-center gap-2 shadow-inner">
            <span className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-cyan-400 animate-ping' : isListening ? 'bg-emerald-400 animate-ping' : isThinking ? 'bg-amber-400 animate-spin' : 'bg-slate-600'}`} />
            <p className="text-xs sm:text-sm font-bold text-slate-200 truncate">
              {statusMessage}
            </p>
          </div>

          {/* Live Transcript / Current Spoken Speech */}
          {transcript && (
            <div className="mt-2 max-w-md w-full p-2 bg-indigo-950/60 border border-indigo-500/40 rounded-xl text-left animate-fade-in shadow-md">
              <span className="text-[10px] text-indigo-300 font-black uppercase tracking-wider block">
                🎙️ You are saying:
              </span>
              <p className="text-xs text-white font-medium italic mt-0.5">
                "{transcript}"
              </p>
            </div>
          )}

          {/* QUICK PROMPT CHIPS (Tap to speak immediately) */}
          <div className="w-full max-w-md mt-4 text-left">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>{language === 'hindi' ? 'बोलने के लिए सुझाव (Try Asking):' : 'Suggested questions:'}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto scrollbar-none">
              {modePrompts[mode].map((promptText, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    handleInterrupt();
                    queryGeminiLive(promptText);
                  }}
                  className="px-2.5 py-1 bg-slate-900/90 hover:bg-cyan-950/80 border border-slate-800 hover:border-cyan-500/50 rounded-xl text-[11px] text-slate-300 hover:text-cyan-200 transition-all cursor-pointer text-left shrink-0 active:scale-95"
                >
                  💬 {promptText}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* RECENT TRANSCRIPT DRAWER / HISTORY */}
        {conversation.length > 0 && (
          <div className="relative z-10 px-4 py-2 border-t border-slate-800/80 bg-[#060D1E]/95 max-h-40 overflow-y-auto scrollbar-thin">
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
              <span>Transcript & Spoken Log</span>
              <button
                onClick={() => setConversation([])}
                className="hover:text-rose-300 transition-colors cursor-pointer"
              >
                Clear Log
              </button>
            </div>
            <div className="space-y-2">
              {conversation.slice(-3).map((msg) => (
                <div 
                  key={msg.id} 
                  className={`p-2 rounded-xl text-xs ${
                    msg.role === 'user' 
                      ? 'bg-indigo-950/60 border border-indigo-500/30 text-indigo-100 ml-4' 
                      : 'bg-slate-900/90 border border-slate-700/60 text-slate-200 mr-4'
                  }`}
                >
                  <div className="flex items-center justify-between text-[9px] text-slate-400 mb-0.5">
                    <span className="font-bold uppercase tracking-wide">
                      {msg.role === 'user' ? '👤 You' : '✨ Gemini'}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BOTTOM HANDS-FREE CONTROLS */}
        <div className="relative z-10 p-3 bg-[#040816] border-t border-slate-800 flex items-center justify-between gap-2">
          {/* Pause / Resume Button */}
          <button
            onClick={togglePause}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
              isPaused 
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 shadow-md' 
                : 'bg-slate-800/80 hover:bg-slate-750 text-slate-300 border-slate-700'
            }`}
          >
            {isPaused ? <Mic className="w-4 h-4 text-white" /> : <MicOff className="w-4 h-4 text-slate-400" />}
            <span>{isPaused ? (language === 'hindi' ? 'पुनः चालू करें' : 'Resume') : (language === 'hindi' ? 'रोकें (Pause)' : 'Pause')}</span>
          </button>

          {/* Interrupt Speaking Button */}
          {isSpeaking && (
            <button
              onClick={handleInterrupt}
              className="px-4 py-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-lg animate-pulse"
              title="Interrupt and speak now"
            >
              <VolumeX className="w-4 h-4" />
              <span>{language === 'hindi' ? 'रोकें व बोलें (Interrupt)' : 'Interrupt & Speak'}</span>
            </button>
          )}

          {/* Status Indicator / End Button */}
          <button
            onClick={onClose}
            className="px-3 py-2 bg-slate-900 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-500/50 text-slate-300 hover:text-rose-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            {language === 'hindi' ? 'बंद करें (Close)' : 'End Session'}
          </button>
        </div>

      </div>
    </div>
  );
};
