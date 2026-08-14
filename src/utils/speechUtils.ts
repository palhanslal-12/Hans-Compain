// /src/utils/speechUtils.ts
// Universal, Rock-Solid Hindi & English Text-To-Speech Engine

let currentAudioPlayer: HTMLAudioElement | null = null;

export interface SpeechOptions {
  lang?: string;
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
 * Universal Speech Engine
 * For Hindi text: Uses server-side /api/tts endpoint for 100% crystal-clear Hindi spoken audio.
 * For English text: Uses WebSpeech API with fallback to /api/tts endpoint.
 */
export const speakText = (text: string, rawOptions: SpeechOptions | string = {}) => {
  const options: SpeechOptions = typeof rawOptions === 'string' ? { lang: rawOptions } : rawOptions;
  stopAllSpeech();

  const cleanText = cleanTextForSpeech(text);

  if (!cleanText) {
    if (options.onEnd) options.onEnd();
    return;
  }

  const isHindi = isHindiText(cleanText);

  // Split into manageable chunks by sentence punctuation boundaries
  const rawChunks = cleanText.split(/(?<=[.!?\n।])\s+/).filter(c => c.trim().length > 0);
  
  // Re-pack chunks so none exceed 150 characters for stable audio streaming
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

  // Audio TTS player using server-side /api/tts endpoint
  const playAudioTTS = () => {
    const playNextChunk = () => {
      if (currentChunkIdx >= chunks.length) {
        if (options.onEnd) options.onEnd();
        return;
      }

      const chunk = chunks[currentChunkIdx];
      const chunkIsHindi = isHindiText(chunk) || isHindi;
      const langCode = chunkIsHindi ? 'hi' : 'en';

      const audioUrl = `/api/tts?text=${encodeURIComponent(chunk)}&lang=${langCode}`;

      const audio = new Audio(audioUrl);
      currentAudioPlayer = audio;
      audio.playbackRate = options.rate || 1.0;

      audio.onended = () => {
        currentChunkIdx++;
        playNextChunk();
      };

      audio.onerror = (err) => {
        console.warn("Server Audio TTS playback error, advancing chunk:", err);
        currentChunkIdx++;
        if (currentChunkIdx < chunks.length) {
          playNextChunk();
        } else {
          if (options.onEnd) options.onEnd();
        }
      };

      audio.play().catch(e => {
        console.warn("Audio play error:", e);
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

  // Web Speech API for English
  const tryWebSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      playAudioTTS();
      return;
    }

    const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();

    const speakWebChunk = () => {
      if (currentChunkIdx >= chunks.length) {
        if (options.onEnd) options.onEnd();
        return;
      }

      const chunk = chunks[currentChunkIdx];
      const utterance = new SpeechSynthesisUtterance(chunk);
      utterance.rate = options.rate || 1.0;
      utterance.pitch = options.pitch || 1.0;
      utterance.lang = 'en-US';

      const bestVoice = voices.find(v => 
        v.lang.toLowerCase().startsWith('en') && 
        (v.name.toLowerCase().includes('google') || v.name.toLowerCase().includes('natural'))
      ) || voices.find(v => v.lang.toLowerCase().startsWith('en'));

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
        console.warn("WebSpeech synthesis error, switching to Audio TTS:", e);
        if (hasEnded) return;
        hasEnded = true;
        playAudioTTS();
      };

      try {
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        playAudioTTS();
      }
    };

    speakWebChunk();
  };

  // For Hindi text, ALWAYS use the reliable server-side Audio TTS engine.
  // For English text, try native WebSpeech with Audio TTS fallback.
  if (isHindi) {
    playAudioTTS();
  } else {
    tryWebSpeech();
  }
};
