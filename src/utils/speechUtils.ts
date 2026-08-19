// /src/utils/speechUtils.ts
// Universal, Rock-Solid Hindi & English Text-To-Speech Engine with Gender-Aware Voices (Male / Female)

let currentAudioPlayer: HTMLAudioElement | null = null;
let currentSpeechSessionId = 0;

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
 * Universal Speech Engine with Male/Female Gender Voice Support
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

  const isHindi = isHindiText(cleanText);
  const targetGender: 'male' | 'female' = options.gender || 'male';

  // Pitch calculation according to gender
  const defaultPitch = targetGender === 'female' ? 1.25 : 0.85;
  const activePitch = options.pitch !== undefined ? options.pitch : defaultPitch;
  const activeRate = options.rate || 0.95;

  // Split into manageable chunks by sentence punctuation boundaries
  const rawChunks = cleanText.split(/(?<=[.!?\n।])\s+/).filter(c => c.trim().length > 0);
  
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
      const chunkIsHindi = isHindiText(chunk) || isHindi || (options.lang && options.lang.startsWith('hi'));
      const utterance = new SpeechSynthesisUtterance(chunk);
      utterance.rate = activeRate;
      utterance.pitch = activePitch;
      utterance.lang = chunkIsHindi ? 'hi-IN' : (options.lang || 'en-US');

      // Pick gender-appropriate voice
      if (voices.length > 0) {
        let matchingVoices: SpeechSynthesisVoice[] = [];

        if (chunkIsHindi) {
          matchingVoices = voices.filter(v => 
            v.lang.toLowerCase().startsWith('hi') || 
            v.lang.toLowerCase().includes('hi-in') ||
            v.lang.toLowerCase().includes('hindi')
          );
        } else {
          matchingVoices = voices.filter(v => v.lang.toLowerCase().startsWith('en'));
        }

        let selectedVoice: SpeechSynthesisVoice | undefined;

        if (matchingVoices.length > 0) {
          if (targetGender === 'female') {
            selectedVoice = matchingVoices.find(v => {
              const n = v.name.toLowerCase();
              return n.includes('female') || n.includes('swara') || n.includes('kavya') || 
                     n.includes('priya') || n.includes('zira') || n.includes('samantha') || 
                     n.includes('victoria') || n.includes('kiran') || n.includes('kalpana') ||
                     n.includes('lekha');
            });
          } else {
            selectedVoice = matchingVoices.find(v => {
              const n = v.name.toLowerCase();
              return n.includes('male') || n.includes('hemant') || n.includes('neel') || 
                     n.includes('david') || n.includes('alex') || n.includes('mark') || 
                     n.includes('george') || n.includes('ravi') || n.includes('madhav') ||
                     n.includes('google हिन्दी') || n.includes('hindi');
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

        // If explicitly canceled or interrupted by user stop/switch, do NOT fall back to playing second audio!
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

  // 2. Server-side /api/tts Audio Streamer Fallback
  const playAudioTTS = () => {
    const playNextChunk = () => {
      if (sessionId !== currentSpeechSessionId) return;

      if (currentChunkIdx >= chunks.length) {
        if (options.onEnd) options.onEnd();
        return;
      }

      const chunk = chunks[currentChunkIdx];
      const chunkIsHindi = isHindiText(chunk) || isHindi;
      const langCode = chunkIsHindi ? 'hi' : 'en';

      const audioUrl = `/api/tts?text=${encodeURIComponent(chunk)}&lang=${langCode}&gender=${targetGender}`;

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
