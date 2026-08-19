// /src/utils/voiceInputUtils.ts
// Robust, multi-lingual Voice-to-Text Speech Recognition for Hindi & English

export interface VoiceRecognitionOptions {
  lang?: string;
  onResult: (transcript: string) => void;
  onEnd?: () => void;
  onError?: (errorMsg: string) => void;
}

export interface VoiceRecognitionHandle {
  stop: () => void;
}

export const isVoiceRecognitionSupported = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
};

export const startVoiceRecognition = (options: VoiceRecognitionOptions): VoiceRecognitionHandle => {
  if (typeof window === 'undefined') {
    if (options.onError) options.onError("Voice recognition is not supported in this environment.");
    return { stop: () => {} };
  }

  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    if (options.onError) {
      options.onError("Speech recognition is not supported on this browser. Try Chrome or Edge.");
    }
    return { stop: () => {} };
  }

  try {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.lang = options.lang || 'hi-IN';

    let finalTranscript = '';

    recognition.onresult = (event: any) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          currentTranscript += event.results[i][0].transcript;
        }
      }
      const full = (finalTranscript + ' ' + currentTranscript).trim();
      if (full) {
        options.onResult(full);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn("Speech recognition error:", event.error);
      if (options.onError && event.error !== 'no-speech' && event.error !== 'aborted') {
        options.onError(`Microphone error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      if (options.onEnd) {
        options.onEnd();
      }
    };

    recognition.start();

    return {
      stop: () => {
        try {
          recognition.stop();
        } catch (e) {}
      }
    };
  } catch (err: any) {
    console.error("Failed to start voice recognition:", err);
    if (options.onError) {
      options.onError("Microphone access could not be initialized.");
    }
    return { stop: () => {} };
  }
};
