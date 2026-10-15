// Production-Grade Natural Human Bilingual Speech Engine for Hans Compain AI
// Powered by Gemini 3.8 Neural TTS (`gemini-3.8-flash-lite-tts`) + Seamless Bilingual (Hindi + English) Voice Engine.
// Reads COMPLETE long articles, English translations, mixed Hindi-English explanations, vocabulary, questions, and notes naturally.

let isSpeakingActive = false;
let isPausedState = false;
let keepAliveTimer: any = null;
let activeUtterancesList: SpeechSynthesisUtterance[] = [];
let activeHtmlAudio: HTMLAudioElement | null = null;
let currentAbortController: AbortController | null = null;
let currentSpeechRate = 1.0;
let serverTtsDownUntil = 0; // Prevents repeated network delays if server TTS is offline

// Clean neural speech synthesis initialization

export function cleanTextForSpeech(text: string): string {
  if (!text) return '';
  return text
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '') // Remove emojis
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1') // Remove markdown bold/italic asterisks
    .replace(/#{1,6}\s+/g, '') // Remove markdown headers
    .replace(/`{1,3}[^`]*`{1,3}/g, '') // Remove code blocks
    .replace(/https?:\/\/\S+/g, '') // Remove links
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Markdown links
    .replace(/[•▪▸►◆◇]/g, '. ') // Bullet points to natural pause
    .replace(/[\(\)\[\]\{\}]/g, ', ') // Natural pause for parenthetical English/Hindi terms
    .replace(/\|\s*/g, '. ') // Replace pipes with sentence pause
    .replace(/—|–/g, ', ') // Replace dashes with pause
    .replace(/,\s*,+/g, ', ')
    .replace(/\.\s*\.+/g, '. ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function detectLanguage(text: string): 'hi-IN' | 'en-US' {
  const devanagariMatches = text.match(/[\u0900-\u097F]/g);
  const latinMatches = text.match(/[a-zA-Z]/g);
  const devCount = devanagariMatches ? devanagariMatches.length : 0;
  const latCount = latinMatches ? latinMatches.length : 0;

  if (devCount > 0 && devCount >= latCount * 0.35) {
    return 'hi-IN';
  }
  if (devCount > 0 && latCount === 0) {
    return 'hi-IN';
  }
  return 'en-US';
}

// Split mixed Hindi + English text into natural bilingual clauses so BOTH languages are pronounced accurately
export function splitIntoCompleteSentences(text: string): string[] {
  const cleaned = cleanTextForSpeech(text);
  if (!cleaned) return [];

  // Split on Devanagari full stop (।), period, question mark, exclamation, semicolon, or newline
  const rawParts = cleaned.split(/(?<=[।\.\?\!\;\n])\s+/);
  const result: string[] = [];

  for (const part of rawParts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    if (trimmed.length <= 200) {
      result.push(trimmed);
    } else {
      const subClauses = trimmed.split(/(?<=[,:])\s+/);
      let buffer = '';
      for (const clause of subClauses) {
        if ((buffer + ' ' + clause).length <= 200) {
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

// Further split a single sentence if it contains distinct Hindi and English script blocks
function splitMixedScriptSubSegments(sentence: string): { text: string; lang: 'hi-IN' | 'en-US' }[] {
  const hasHindi = /[\u0900-\u097F]/.test(sentence);
  const hasEnglish = /[a-zA-Z]{3,}/.test(sentence);

  if (!hasHindi) {
    return [{ text: sentence, lang: 'en-US' }];
  }
  if (!hasEnglish) {
    return [{ text: sentence, lang: 'hi-IN' }];
  }

  // Split by comma/colon/dash to see if clauses are in different languages
  const clauses = sentence
    .split(/(?<=[,:\-])\s+/)
    .map(c => c.trim())
    .filter(Boolean);

  if (clauses.length <= 1) {
    return [{ text: sentence, lang: detectLanguage(sentence) }];
  }

  const merged: { text: string; lang: 'hi-IN' | 'en-US' }[] = [];
  for (const clause of clauses) {
    const lang = detectLanguage(clause);
    if (merged.length > 0 && merged[merged.length - 1].lang === lang) {
      merged[merged.length - 1].text += ' ' + clause;
    } else {
      merged.push({ text: clause, lang });
    }
  }
  return merged;
}

// Select most natural human-like voice available in browser for Hindi or English
export function getBestNaturalVoice(lang: 'hi-IN' | 'en-US'): SpeechSynthesisVoice | undefined {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return undefined;

  const voices = window.speechSynthesis.getVoices() || [];
  if (voices.length === 0) return undefined;

  if (lang === 'hi-IN') {
    const neuralHindi = voices.find(
      v =>
        (v.lang.toLowerCase().startsWith('hi') || v.name.toLowerCase().includes('hindi') || v.name.includes('हिन्दी')) &&
        (v.name.includes('Natural') ||
          v.name.includes('Neural') ||
          v.name.includes('Google') ||
          v.name.includes('Swara') ||
          v.name.includes('Madhur') ||
          v.name.includes('Lekha') ||
          v.name.includes('Neerja') ||
          v.name.includes('Hemant'))
    );
    if (neuralHindi) return neuralHindi;

    const anyHindi = voices.find(
      v => v.lang.toLowerCase().startsWith('hi') || v.name.toLowerCase().includes('hindi') || v.name.includes('हिन्दी')
    );
    if (anyHindi) return anyHindi;

    // Indian English voice can often read Hindi + English fallback better than US voice
    const indianVoice = voices.find(v => v.lang.includes('IN'));
    if (indianVoice) return indianVoice;

    return voices[0];
  } else {
    const neuralIndianEnglish = voices.find(
      v =>
        (v.lang.toLowerCase() === 'en-in' || v.lang.includes('IN')) &&
        v.lang.toLowerCase().startsWith('en') &&
        (v.name.includes('Natural') ||
          v.name.includes('Neural') ||
          v.name.includes('Google') ||
          v.name.includes('Neerja') ||
          v.name.includes('Prabhat') ||
          v.name.includes('Rishi'))
    );
    if (neuralIndianEnglish) return neuralIndianEnglish;

    const anyIndianEnglish = voices.find(v => v.lang.toLowerCase() === 'en-in');
    if (anyIndianEnglish) return anyIndianEnglish;

    const neuralEnglish = voices.find(
      v =>
        v.lang.toLowerCase().startsWith('en') &&
        (v.name.includes('Natural') ||
          v.name.includes('Neural') ||
          v.name.includes('Google') ||
          v.name.includes('Samantha') ||
          v.name.includes('Jenny') ||
          v.name.includes('Aria') ||
          v.name.includes('Guy'))
    );
    if (neuralEnglish) return neuralEnglish;

    return voices.find(v => v.lang.toLowerCase().startsWith('en')) || voices[0];
  }
}

async function fetchGeminiNeuralAudio(sentence: string, signal: AbortSignal): Promise<string | null> {
  const timeoutController = new AbortController();
  const timer = setTimeout(() => timeoutController.abort(), 6000);
  const onParentAbort = () => timeoutController.abort();
  signal.addEventListener('abort', onParentAbort, { once: true });

  try {
    const res = await fetch('/api/tts/speak', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: sentence,
        voiceName: 'Kore'
      }),
      signal: timeoutController.signal
    });

    clearTimeout(timer);
    signal.removeEventListener('abort', onParentAbort);

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    if (data && data.audioBase64) {
      const dataUrl = `data:${data.mimeType || 'audio/mpeg'};base64,${data.audioBase64}`;
      return dataUrl;
    }
  } catch {
    clearTimeout(timer);
    signal.removeEventListener('abort', onParentAbort);
  }
  return null;
}

function speakSentenceWithBilingualBrowser(
  sentence: string,
  rate: number,
  onDone: () => void
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onDone();
    return;
  }

  const segments = splitMixedScriptSubSegments(sentence);
  let segIdx = 0;

  const speakNextSeg = () => {
    if (!isSpeakingActive || segIdx >= segments.length) {
      onDone();
      return;
    }

    const seg = segments[segIdx];
    const utterance = new SpeechSynthesisUtterance(seg.text);
    utterance.lang = seg.lang;
    utterance.rate = Math.max(0.75, Math.min(1.45, rate));
    utterance.pitch = 1.0;

    const bestVoice = getBestNaturalVoice(seg.lang);
    if (bestVoice) {
      utterance.voice = bestVoice;
      if (bestVoice.lang) {
        utterance.lang = bestVoice.lang;
      }
    }

    let finished = false;
    const finishSeg = () => {
      if (finished) return;
      finished = true;
      segIdx++;
      speakNextSeg();
    };

    utterance.onend = finishSeg;
    utterance.onerror = finishSeg;

    activeUtterancesList.push(utterance);
    try {
      window.speechSynthesis.speak(utterance);
    } catch {
      finishSeg();
    }
  };

  speakNextSeg();
}

// Main Play Function: Seamlessly reads the entire text in BOTH Hindi & English with human neural voice
export function playNaturalSpeech(
  text: string,
  onEnd?: () => void,
  onSentenceChange?: (sentenceIndex: number, totalSentences: number, currentText: string) => void,
  customRate?: number
) {
  stopNaturalSpeech();

  const cleaned = cleanTextForSpeech(text);
  if (!cleaned) {
    if (onEnd) onEnd();
    return;
  }

  const sentences = splitIntoCompleteSentences(cleaned);
  if (sentences.length === 0) {
    if (onEnd) onEnd();
    return;
  }

  isSpeakingActive = true;
  isPausedState = false;
  currentSpeechRate = customRate ? customRate : 1.0;

  activeUtterancesList = [];
  if (typeof window !== 'undefined') {
    (window as any).__activeUtterances = activeUtterancesList;
    // Keep Chrome speechSynthesis alive across long multi-minute articles
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.getVoices();
      } catch {
        // ignore
      }
      keepAliveTimer = setInterval(() => {
        if (isSpeakingActive && !isPausedState && window.speechSynthesis.speaking) {
          try {
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
          } catch {
            // ignore
          }
        }
      }, 10000);
    }
  }

  const abortController = new AbortController();
  currentAbortController = abortController;

  let currentIndex = 0;

  const prefetchSentence = (idx: number) => {
    if (idx < sentences.length && isSpeakingActive && Date.now() >= serverTtsDownUntil) {
      fetchGeminiNeuralAudio(sentences[idx], abortController.signal).catch(() => {});
    }
  };

  const playNextSentence = async () => {
    if (!isSpeakingActive || abortController.signal.aborted || currentIndex >= sentences.length) {
      stopNaturalSpeech();
      if (onEnd) onEnd();
      return;
    }

    const currentSentence = sentences[currentIndex];
    if (onSentenceChange) {
      onSentenceChange(currentIndex, sentences.length, currentSentence);
    }

    prefetchSentence(currentIndex + 1);

    // 1. Try Gemini Neural Human Voice (Hindi + English bilingual natural voice)
    const audioDataUrl = await fetchGeminiNeuralAudio(currentSentence, abortController.signal);

    if (!isSpeakingActive || abortController.signal.aborted) {
      return;
    }

    const advanceToNext = () => {
      currentIndex++;
      if (isSpeakingActive && !abortController.signal.aborted && currentIndex < sentences.length) {
        playNextSentence();
      } else {
        stopNaturalSpeech();
        if (onEnd) onEnd();
      }
    };

    if (audioDataUrl && typeof Audio !== 'undefined') {
      try {
        const audio = new Audio(audioDataUrl);
        activeHtmlAudio = audio;
        audio.playbackRate = Math.max(0.75, Math.min(1.5, currentSpeechRate));

        audio.onended = () => {
          activeHtmlAudio = null;
          advanceToNext();
        };

        audio.onerror = () => {
          activeHtmlAudio = null;
          speakSentenceWithBilingualBrowser(currentSentence, currentSpeechRate, advanceToNext);
        };

        if (isPausedState) {
          return;
        }

        await audio.play();
        return;
      } catch {
        activeHtmlAudio = null;
      }
    }

    // 2. Enhanced Bilingual (Hindi + English) Browser Voice Engine
    speakSentenceWithBilingualBrowser(currentSentence, currentSpeechRate, advanceToNext);
  };

  playNextSentence();
}

export function pauseNaturalSpeech() {
  isPausedState = true;
  if (activeHtmlAudio && !activeHtmlAudio.paused) {
    try {
      activeHtmlAudio.pause();
    } catch {
      // ignore
    }
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.pause();
    } catch {
      // ignore
    }
  }
}

export function resumeNaturalSpeech() {
  isPausedState = false;
  if (activeHtmlAudio && activeHtmlAudio.paused) {
    try {
      activeHtmlAudio.play();
    } catch {
      // ignore
    }
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.resume();
    } catch {
      // ignore
    }
  }
}

export function stopNaturalSpeech() {
  isSpeakingActive = false;
  isPausedState = false;

  if (currentAbortController) {
    try {
      currentAbortController.abort();
    } catch {
      // ignore
    }
    currentAbortController = null;
  }

  if (activeHtmlAudio) {
    try {
      activeHtmlAudio.pause();
      activeHtmlAudio.src = '';
    } catch {
      // ignore
    }
    activeHtmlAudio = null;
  }

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
  try {
    window.speechSynthesis.getVoices();
    if ('onvoiceschanged' in window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  } catch {
    // ignore
  }
}
