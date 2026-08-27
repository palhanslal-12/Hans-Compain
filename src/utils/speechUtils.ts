// /src/utils/speechUtils.ts
// Universal, Rock-Solid Multi-Lingual Text-To-Speech Engine for All Indian State Languages & English

let currentAudioPlayer: HTMLAudioElement | null = null;
let currentSpeechSessionId = 0;

export interface IndianLanguageOption {
  code: string;
  shortCode: string;
  name: string;
  nativeName: string;
  state: string;
}

export const INDIAN_LANGUAGES: IndianLanguageOption[] = [
  { code: 'hi-IN', shortCode: 'hi', name: 'Hindi', nativeName: 'हिन्दी', state: 'All India / North' },
  { code: 'en-IN', shortCode: 'en', name: 'English (India)', nativeName: 'English', state: 'National / Global' },
  { code: 'hi-IN', shortCode: 'hinglish', name: 'Hinglish (Hindi+English)', nativeName: 'हिंग्लिश', state: 'Pan India Urban' },
  { code: 'hi-IN', shortCode: 'bho', name: 'Bhojpuri', nativeName: 'भोजपुरी', state: 'Bihar / UP / Jharkhand' },
  { code: 'hi-IN', shortCode: 'mai', name: 'Maithili', nativeName: 'मैथिली', state: 'Bihar / Mithilanchal' },
  { code: 'ta-IN', shortCode: 'ta', name: 'Tamil', nativeName: 'தமிழ்', state: 'Tamil Nadu' },
  { code: 'te-IN', shortCode: 'te', name: 'Telugu', nativeName: 'తెలుగు', state: 'Andhra / Telangana' },
  { code: 'kn-IN', shortCode: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', state: 'Karnataka' },
  { code: 'ml-IN', shortCode: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', state: 'Kerala' },
  { code: 'bn-IN', shortCode: 'bn', name: 'Bengali', nativeName: 'বাংলা', state: 'West Bengal / Tripura' },
  { code: 'mr-IN', shortCode: 'mr', name: 'Marathi', nativeName: 'मराठी', state: 'Maharashtra' },
  { code: 'gu-IN', shortCode: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', state: 'Gujarat' },
  { code: 'pa-IN', shortCode: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', state: 'Punjab' },
  { code: 'or-IN', shortCode: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', state: 'Odisha' },
  { code: 'ur-IN', shortCode: 'ur', name: 'Urdu', nativeName: 'اردو', state: 'National' },
  { code: 'hi-IN', shortCode: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', state: 'Classical India' }
];

export interface SpeechOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  gender?: 'male' | 'female';
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

// Preload speech synthesis voices
let cachedVoices: SpeechSynthesisVoice[] = [];

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  const updateVoices = () => {
    try {
      cachedVoices = window.speechSynthesis.getVoices();
    } catch (e) {
      console.warn("Failed to load speechSynthesis voices:", e);
    }
  };
  updateVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = updateVoices;
  }
}

export const detectIndianLanguage = (text: string): string => {
  if (/[\u0900-\u097F]/.test(text)) return 'hi-IN'; // Devanagari (Hindi, Marathi)
  if (/[\u0B80-\u0BFF]/.test(text)) return 'ta-IN'; // Tamil
  if (/[\u0C00-\u0C7F]/.test(text)) return 'te-IN'; // Telugu
  if (/[\u0C80-\u0CFF]/.test(text)) return 'kn-IN'; // Kannada
  if (/[\u0D00-\u0D7F]/.test(text)) return 'ml-IN'; // Malayalam
  if (/[\u0980-\u09FF]/.test(text)) return 'bn-IN'; // Bengali
  if (/[\u0A80-\u0AFF]/.test(text)) return 'gu-IN'; // Gujarati
  if (/[\u0A00-\u0A7F]/.test(text)) return 'pa-IN'; // Gurmukhi (Punjabi)
  if (/[\u0B00-\u0B7F]/.test(text)) return 'or-IN'; // Odia
  if (/[\u0600-\u06FF]/.test(text)) return 'ur-IN'; // Urdu / Arabic
  return 'en-IN';
};

export const isHindiText = (text: string): boolean => {
  return /[\u0900-\u097F]/.test(text);
};

export const cleanTextForSpeech = (rawText: string): string => {
  if (!rawText) return '';
  return rawText
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    // Remove Markdown headers, bold, italic, links, blockquotes
    .replace(/#+\s*/g, '')
    .replace(/[*_~`#>-]/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/https?:\/\/\S+/g, '')
    // Remove emojis and non-standard symbols
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
};

export const stopAllSpeech = () => {
  // Invalidate any active speech session so ongoing or queued callbacks abort immediately
  currentSpeechSessionId++;

  if (typeof window !== 'undefined') {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
    if (currentAudioPlayer) {
      try {
        currentAudioPlayer.pause();
        currentAudioPlayer.currentTime = 0;
        currentAudioPlayer.src = '';
      } catch (e) {}
      currentAudioPlayer = null;
    }
  }
};

/**
 * Universal Speech Engine with All Indian Languages & Gender Voice Support
 */
export const speakText = (text: string, rawOptions: SpeechOptions | string = {}) => {
  const options: SpeechOptions = typeof rawOptions === 'string' ? { lang: rawOptions } : rawOptions;
  
  // Stop all previous speech and get new unique session token
  stopAllSpeech();
  const sessionId = currentSpeechSessionId;

  const cleanText = cleanTextForSpeech(text);

  if (!cleanText) {
    if (options.onEnd) options.onEnd();
    return;
  }

  const detectedLangCode = detectIndianLanguage(cleanText);
  const targetLang = options.lang || detectedLangCode || 'hi-IN';
  const targetGender: 'male' | 'female' = options.gender || 'male';

  // Pitch calculation according to gender
  const defaultPitch = targetGender === 'female' ? 1.2 : 0.88;
  const activePitch = options.pitch !== undefined ? options.pitch : defaultPitch;
  const activeRate = options.rate || 0.95;

  // Split into manageable chunks by sentence punctuation boundaries
  const rawChunks = cleanText.split(/(?<=[.!?\n।|])\s+/).filter(c => c.trim().length > 0);
  
  const chunks: string[] = [];
  for (const rawChunk of rawChunks) {
    if (rawChunk.length <= 150) {
      chunks.push(rawChunk);
    } else {
      const words = rawChunk.split(' ');
      let temp = '';
      for (const w of words) {
        if ((temp + ' ' + w).length > 150) {
          if (temp.trim()) chunks.push(temp.trim());
          temp = w;
        } else {
          temp += (temp ? ' ' : '') + w;
        }
      }
      if (temp.trim()) chunks.push(temp.trim());
    }
  }

  if (chunks.length === 0) chunks.push(cleanText.substring(0, 150));

  let currentChunkIdx = 0;
  if (options.onStart) options.onStart();

  // 1. Web Speech Synthesis with Voice & Pitch Selection
  const tryWebSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      playAudioTTS();
      return;
    }

    const allVoices = window.speechSynthesis.getVoices();
    const voices = allVoices.length > 0 ? allVoices : cachedVoices;

    const speakWebChunk = () => {
      // Abort if session was stopped/superseded
      if (sessionId !== currentSpeechSessionId) {
        return;
      }

      if (currentChunkIdx >= chunks.length) {
        if (options.onEnd) options.onEnd();
        return;
      }

      const chunk = chunks[currentChunkIdx];
      const chunkLang = detectIndianLanguage(chunk) || targetLang;
      const utterance = new SpeechSynthesisUtterance(chunk);
      utterance.rate = activeRate;
      utterance.pitch = activePitch;
      utterance.lang = chunkLang;

      // Pick gender and language appropriate voice
      if (voices.length > 0) {
        const langPrefix = chunkLang.split('-')[0].toLowerCase();
        let matchingVoices = voices.filter(v => 
          v.lang.toLowerCase().startsWith(langPrefix) || 
          v.lang.toLowerCase().includes(chunkLang.toLowerCase())
        );

        if (matchingVoices.length === 0) {
          matchingVoices = voices.filter(v => v.lang.toLowerCase().startsWith('en') || v.lang.toLowerCase().startsWith('hi'));
        }

        let selectedVoice: SpeechSynthesisVoice | undefined;

        if (matchingVoices.length > 0) {
          if (targetGender === 'female') {
            selectedVoice = matchingVoices.find(v => {
              const n = v.name.toLowerCase();
              return n.includes('female') || n.includes('swara') || n.includes('kavya') || 
                     n.includes('priya') || n.includes('zira') || n.includes('samantha') || 
                     n.includes('victoria') || n.includes('kiran') || n.includes('kalpana') ||
                     n.includes('lekha') || n.includes('geeta') || n.includes('ananya');
            });
          } else {
            selectedVoice = matchingVoices.find(v => {
              const n = v.name.toLowerCase();
              return n.includes('male') || n.includes('hemant') || n.includes('neel') || 
                     n.includes('david') || n.includes('alex') || n.includes('mark') || 
                     n.includes('george') || n.includes('ravi') || n.includes('madhav') ||
                     n.includes('valluvar') || n.includes('google');
            });
          }

          if (!selectedVoice) {
            selectedVoice = matchingVoices[0];
          }
        }

        if (selectedVoice) {
          utterance.voice = selectedVoice;
          utterance.lang = selectedVoice.lang;
        }
      }

      let hasEnded = false;

      utterance.onend = () => {
        if (hasEnded || sessionId !== currentSpeechSessionId) return;
        hasEnded = true;
        currentChunkIdx++;
        speakWebChunk();
      };

      utterance.onerror = (e: any) => {
        if (hasEnded || sessionId !== currentSpeechSessionId) return;
        hasEnded = true;

        if (e && (e.error === 'canceled' || e.error === 'interrupted')) {
          if (options.onEnd) options.onEnd();
          return;
        }

        console.warn("WebSpeech synthesis error, trying Audio TTS fallback:", e);
        playAudioTTS();
      };

      try {
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        if (sessionId === currentSpeechSessionId) {
          playAudioTTS();
        }
      }
    };

    speakWebChunk();
  };

  // 2. Server-side /api/tts Audio Streamer Fallback (Multi-lingual)
  const playAudioTTS = () => {
    const playNextChunk = () => {
      if (sessionId !== currentSpeechSessionId) return;

      if (currentChunkIdx >= chunks.length) {
        if (options.onEnd) options.onEnd();
        return;
      }

      const chunk = chunks[currentChunkIdx];
      const chunkLang = (detectIndianLanguage(chunk) || targetLang).slice(0, 2);

      const audioUrl = `/api/tts?text=${encodeURIComponent(chunk)}&lang=${chunkLang}&gender=${targetGender}`;

      const audio = new Audio(audioUrl);
      currentAudioPlayer = audio;
      audio.playbackRate = activeRate;

      audio.onended = () => {
        if (sessionId !== currentSpeechSessionId) return;
        currentChunkIdx++;
        playNextChunk();
      };

      audio.onerror = () => {
        if (sessionId !== currentSpeechSessionId) return;
        currentChunkIdx++;
        if (currentChunkIdx < chunks.length) {
          playNextChunk();
        } else {
          if (options.onEnd) options.onEnd();
        }
      };

      audio.play().catch(() => {
        if (sessionId !== currentSpeechSessionId) return;
        currentChunkIdx++;
        if (currentChunkIdx < chunks.length) {
          playNextChunk();
        } else {
          if (options.onEnd) options.onEnd();
        }
      });
    };

    playNextChunk();
  };

  // Start with WebSpeech (fast, zero-latency, pitch/gender modifiable), fallback to Audio TTS
  tryWebSpeech();
};
