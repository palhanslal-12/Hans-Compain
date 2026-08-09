// /src/utils/speechUtils.ts
// Universal, Rock-Solid Hindi & English Text-To-Speech Engine

let currentAudioPlayer: HTMLAudioElement | null = null;

export interface SpeechOptions {
  rate?: number;
  pitch?: number;
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

export const stopAllSpeech = () => {
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
      } catch (e) {}
      currentAudioPlayer = null;
    }
  }
};

/**
 * Robust Speech Player
 * Tries browser SpeechSynthesis first; if missing Hindi voice or error occurs,
 * seamlessly falls back to Google TTS Audio stream for 100% Hindi Devanagari clarity!
 */
export const speakText = (text: string, options: SpeechOptions = {}) => {
  stopAllSpeech();

  const cleanText = text
    .replace(/[\#\*\_\\`]/g, '')
    .replace(/https?:\/\/\S+/g, '')
    .trim();

  if (!cleanText) {
    if (options.onEnd) options.onEnd();
    return;
  }

  const isHindi = isHindiText(cleanText);

  // Split into chunks by sentence boundaries to prevent cut-offs
  const rawChunks = cleanText.split(/(?<=[.!?\n।])\s+/).filter(c => c.trim().length > 0);
  
  // Re-pack chunks so none exceed 180 characters (for URL safety and speech stability)
  const chunks: string[] = [];
  for (const rawChunk of rawChunks) {
    if (rawChunk.length <= 180) {
      chunks.push(rawChunk);
    } else {
      const words = rawChunk.split(' ');
      let temp = '';
      for (const w of words) {
        if ((temp + ' ' + w).length > 180) {
          if (temp.trim()) chunks.push(temp.trim());
          temp = w;
        } else {
          temp += (temp ? ' ' : '') + w;
        }
      }
      if (temp.trim()) chunks.push(temp.trim());
    }
  }

  if (chunks.length === 0) chunks.push(cleanText.substring(0, 180));

  let currentChunkIdx = 0;
  if (options.onStart) options.onStart();

  // Web Speech API execution
  const tryWebSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      fallbackToAudioTTS();
      return;
    }

    const speakWebChunk = () => {
      if (currentChunkIdx >= chunks.length) {
        if (options.onEnd) options.onEnd();
        return;
      }

      const chunk = chunks[currentChunkIdx];
      const isChunkHindi = isHindiText(chunk) || isHindi;

      try {
        window.speechSynthesis.cancel();
      } catch (e) {}

      const utterance = new SpeechSynthesisUtterance(chunk);
      utterance.rate = options.rate || 1.0;
      utterance.pitch = options.pitch || 1.0;
      utterance.lang = isChunkHindi ? 'hi-IN' : 'en-US';

      // Find best matching voice
      const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
      let bestVoice: SpeechSynthesisVoice | undefined;

      if (isChunkHindi) {
        bestVoice = voices.find(v => 
          v.lang.toLowerCase().includes('hi') || 
          v.name.toLowerCase().includes('hindi') || 
          v.name.toLowerCase().includes('हिन्दी')
        );
      } else {
        bestVoice = voices.find(v => 
          v.lang.toLowerCase().startsWith('en') && 
          (v.name.toLowerCase().includes('google') || v.name.toLowerCase().includes('natural'))
        ) || voices.find(v => v.lang.toLowerCase().startsWith('en'));
      }

      if (bestVoice) {
        utterance.voice = bestVoice;
      }

      let hasEnded = false;

      utterance.onend = () => {
        if (hasEnded) return;
        hasEnded = true;
        currentChunkIdx++;
        speakWebChunk();
      };

      utterance.onerror = (e) => {
        console.warn("WebSpeech synthesis chunk error, falling back to Audio TTS:", e);
        if (hasEnded) return;
        hasEnded = true;
        fallbackToAudioTTS();
      };

      try {
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        fallbackToAudioTTS();
      }
    };

    speakWebChunk();
  };

  // Fallback Audio TTS player using online audio stream
  const fallbackToAudioTTS = () => {
    const playAudioChunk = () => {
      if (currentChunkIdx >= chunks.length) {
        if (options.onEnd) options.onEnd();
        return;
      }

      const chunk = chunks[currentChunkIdx];
      const chunkIsHindi = isHindiText(chunk) || isHindi;
      const langCode = chunkIsHindi ? 'hi' : 'en';

      const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${langCode}&client=tw-ob&q=${encodeURIComponent(chunk)}`;

      const audio = new Audio(audioUrl);
      currentAudioPlayer = audio;
      audio.playbackRate = options.rate || 1.0;

      audio.onended = () => {
        currentChunkIdx++;
        playAudioChunk();
      };

      audio.onerror = (err) => {
        console.warn("Audio TTS fallback error:", err);
        currentChunkIdx++;
        if (currentChunkIdx < chunks.length) {
          playAudioChunk();
        } else {
          if (options.onEnd) options.onEnd();
        }
      };

      audio.play().catch(e => {
        console.warn("Audio play error:", e);
        currentChunkIdx++;
        if (currentChunkIdx < chunks.length) {
          playAudioChunk();
        } else {
          if (options.onEnd) options.onEnd();
        }
      });
    };

    playAudioChunk();
  };

  // Check if native Hindi voice exists in voices array
  const voices = cachedVoices.length > 0 ? cachedVoices : (typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis.getVoices() : []);
  const hasHindiVoice = voices.some(v => v.lang.toLowerCase().includes('hi') || v.name.toLowerCase().includes('hindi') || v.name.toLowerCase().includes('हिन्दी'));

  if (isHindi && !hasHindiVoice) {
    // If browser/device has no native Hindi voice installed, directly use Audio TTS for 100% Hindi Devanagari voice audio!
    fallbackToAudioTTS();
  } else {
    tryWebSpeech();
  }
};
