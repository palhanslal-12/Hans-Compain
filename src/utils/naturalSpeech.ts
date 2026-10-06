// Production-Grade Natural Speech Engine for Hans Compain AI
// Reads COMPLETE long articles from start to finish without pausing or stopping after 1 line.
// Natural human news-anchor cadence in Hindi (hi-IN) and English (en-US).

let isSpeakingActive = false;
let keepAliveTimer: any = null;
let activeUtterancesList: SpeechSynthesisUtterance[] = [];
let currentSpeechRate = 0.93; // Natural news anchor pacing

export function cleanTextForSpeech(text: string): string {
  if (!text) return '';
  return text
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '') // Remove emojis
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1') // Remove markdown bold/italic asterisks
    .replace(/#{1,6}\s+/g, '') // Remove markdown headers
    .replace(/`{1,3}[^`]*`{1,3}/g, '') // Remove code blocks
    .replace(/https?:\/\/\S+/g, '') // Remove links
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Markdown links
    .replace(/[\(\)\[\]\{\}]/g, ' ') // Clean brackets
    .replace(/\|\s*/g, ', ') // Replace table pipes with commas
    .replace(/—|–/g, ', ') // Replace dashes with pause
    .replace(/\s+/g, ' ')
    .trim();
}

export function detectLanguage(text: string): 'hi-IN' | 'en-US' {
  const devanagariRegex = /[\u0900-\u097F]/;
  if (devanagariRegex.test(text)) {
    return 'hi-IN';
  }
  return 'en-US';
}

// Split into complete natural sentence units (e.g. 60-140 chars per natural breath)
export function splitIntoCompleteSentences(text: string): string[] {
  const cleaned = cleanTextForSpeech(text);
  if (!cleaned) return [];

  // Split on Devanagari full stop (।), period, question mark, exclamation, or newline
  const rawParts = cleaned.split(/(?<=[।\.\?\!\n])\s+/);
  const result: string[] = [];

  for (const part of rawParts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    if (trimmed.length <= 140) {
      result.push(trimmed);
    } else {
      // Split long clauses by comma or semicolon
      const subClauses = trimmed.split(/(?<=[,;:])\s+/);
      let buffer = '';
      for (const clause of subClauses) {
        if ((buffer + ' ' + clause).length <= 140) {
          buffer = buffer ? buffer + ' ' + clause : clause;
        } else {
          if (buffer.trim()) result.push(buffer.trim());
          buffer = clause;
        }
      }
      if (buffer.trim()) result.push(buffer.trim());
    }
  }

  return result.filter(r => r.length > 0);
}

// Select most natural human-like voice available
export function getBestNaturalVoice(lang: 'hi-IN' | 'en-US'): SpeechSynthesisVoice | undefined {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return undefined;

  const voices = window.speechSynthesis.getVoices() || [];
  if (voices.length === 0) return undefined;

  if (lang === 'hi-IN') {
    // 1. Prioritize natural neural Hindi voices
    const neuralHindi = voices.find(
      v =>
        (v.lang.startsWith('hi') || v.lang.includes('IN') || v.name.toLowerCase().includes('hindi') || v.name.includes('हिन्दी')) &&
        (v.name.includes('Natural') ||
          v.name.includes('Neural') ||
          v.name.includes('Google हिन्दी') ||
          v.name.includes('Swara') ||
          v.name.includes('Madhur') ||
          v.name.includes('Lekha') ||
          v.name.includes('Neerja') ||
          v.name.includes('Hemant'))
    );
    if (neuralHindi) return neuralHindi;

    // 2. Any Hindi voice
    const anyHindi = voices.find(
      v => v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi') || v.name.includes('हिन्दी')
    );
    if (anyHindi) return anyHindi;

    // 3. Any Indian English/multilingual voice
    return voices.find(v => v.lang.includes('IN'));
  } else {
    // English Natural Voices
    return (
      voices.find(
        v =>
          v.lang.startsWith('en') &&
          (v.name.includes('Natural') ||
            v.name.includes('Neural') ||
            v.name.includes('Google') ||
            v.name.includes('Samantha') ||
            v.name.includes('Jenny') ||
            v.name.includes('Ava') ||
            v.name.includes('Guy'))
      ) || voices.find(v => v.lang.startsWith('en'))
    );
  }
}

// Main Play Function: Seamlessly reads the entire text from beginning to end
export function playNaturalSpeech(
  text: string,
  onEnd?: () => void,
  onSentenceChange?: (sentenceIndex: number, totalSentences: number, currentText: string) => void,
  customRate?: number
) {
  stopNaturalSpeech();

  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('SpeechSynthesis is not supported in this environment.');
    if (onEnd) onEnd();
    return;
  }

  const cleaned = cleanTextForSpeech(text);
  if (!cleaned) {
    if (onEnd) onEnd();
    return;
  }

  const lang = detectLanguage(cleaned);
  const sentences = splitIntoCompleteSentences(cleaned);

  if (sentences.length === 0) {
    if (onEnd) onEnd();
    return;
  }

  isSpeakingActive = true;
  if (customRate) currentSpeechRate = customRate;

  // Clear and prepare global references
  activeUtterancesList = [];
  (window as any).__activeUtterances = activeUtterancesList;

  // Start keep-alive pulse to prevent Chrome from freezing long speech
  if (keepAliveTimer) clearInterval(keepAliveTimer);
  keepAliveTimer = setInterval(() => {
    if (isSpeakingActive && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }
  }, 4000);

  let currentIndex = 0;

  const playNextSentence = () => {
    if (!isSpeakingActive || currentIndex >= sentences.length) {
      stopNaturalSpeech();
      if (onEnd) onEnd();
      return;
    }

    const currentSentence = sentences[currentIndex];
    if (onSentenceChange) {
      onSentenceChange(currentIndex, sentences.length, currentSentence);
    }

    const utterance = new SpeechSynthesisUtterance(currentSentence);
    utterance.lang = lang;
    utterance.rate = lang === 'hi-IN' ? currentSpeechRate : 0.98;
    utterance.pitch = 1.0;

    const bestVoice = getBestNaturalVoice(lang);
    if (bestVoice) {
      utterance.voice = bestVoice;
    }

    utterance.onend = () => {
      currentIndex++;
      if (isSpeakingActive && currentIndex < sentences.length) {
        // Continue immediately to the next sentence without stopping
        playNextSentence();
      } else {
        stopNaturalSpeech();
        if (onEnd) onEnd();
      }
    };

    utterance.onerror = (err) => {
      if (err.error !== 'interrupted' && err.error !== 'canceled') {
        console.warn('Utterance notice:', err.error);
      }
      currentIndex++;
      if (isSpeakingActive && currentIndex < sentences.length) {
        playNextSentence();
      } else {
        stopNaturalSpeech();
        if (onEnd) onEnd();
      }
    };

    // Keep reference in active list
    activeUtterancesList.push(utterance);

    try {
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('SpeechSynthesis error:', e);
      currentIndex++;
      if (isSpeakingActive && currentIndex < sentences.length) {
        playNextSentence();
      } else {
        stopNaturalSpeech();
        if (onEnd) onEnd();
      }
    }
  };

  // Brief 40ms timeout ensures previous cancel is fully flushed in Chromium
  setTimeout(() => {
    if (isSpeakingActive) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      playNextSentence();
    }
  }, 40);
}

export function pauseNaturalSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.pause();
  }
}

export function resumeNaturalSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.resume();
  }
}

export function stopNaturalSpeech() {
  isSpeakingActive = false;
  if (keepAliveTimer) {
    clearInterval(keepAliveTimer);
    keepAliveTimer = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
  activeUtterancesList = [];
  if (typeof window !== 'undefined') {
    (window as any).__activeUtterances = [];
  }
}

export function isSpeechPlaying(): boolean {
  return isSpeakingActive;
}

// Pre-load voices on browser load
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.getVoices();
  if ('onvoiceschanged' in window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }
}
