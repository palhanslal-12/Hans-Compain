import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, Square, Languages, Link as LinkIcon, 
  FileText, Copy, Check, Sparkles, RefreshCw, Sliders, 
  BookOpen, Headphones, Radio, Volume2, Eye, EyeOff
} from 'lucide-react';

interface ArticleVoiceReaderProps {
  onBackToChat: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  language?: 'english' | 'hindi';
}

export const ArticleVoiceReader: React.FC<ArticleVoiceReaderProps> = ({ 
  showToast,
  language = 'hindi'
}) => {
  const isHindi = language === 'hindi';

  const [inputText, setInputText] = useState<string>('');
  const [articleUrl, setArticleUrl] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'text' | 'url'>('text');
  
  // Translation controls (with hide/show option as requested)
  const [showTranslatePanel, setShowTranslatePanel] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('hindi');
  const [translatedText, setTranslatedText] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [isFetchingUrl, setIsFetchingUrl] = useState<boolean>(false);

  // Speech Mode & Voice Settings
  const [speechLang, setSpeechLang] = useState<'hi' | 'en'>('hi');
  const [sentences, setSentences] = useState<string[]>([]);
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(0.9); // Natural speech pace
  const [voicePitch, setVoicePitch] = useState<number>(1.0); // Natural pitch
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [copied, setCopied] = useState<boolean>(false);

  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const currentText = translatedText || inputText;

  // Load browser speech voices cleanly
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const updateVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      
      // Sort voices so Hindi voices are prioritized
      const sortedVoices = [...availableVoices].sort((a, b) => {
        const aIsHindi = a.lang.toLowerCase().startsWith('hi') || a.name.toLowerCase().includes('hindi');
        const bIsHindi = b.lang.toLowerCase().startsWith('hi') || b.name.toLowerCase().includes('hindi');
        if (aIsHindi && !bIsHindi) return -1;
        if (!aIsHindi && bIsHindi) return 1;
        return 0;
      });

      setVoices(sortedVoices);

      const hindiVoice = sortedVoices.find(v => v.lang.toLowerCase().startsWith('hi') || v.name.toLowerCase().includes('hindi'));
      const engVoice = sortedVoices.find(v => v.lang.toLowerCase().startsWith('en'));
      
      setSelectedVoice(speechLang === 'hi' ? (hindiVoice || sortedVoices[0] || null) : (engVoice || sortedVoices[0] || null));
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [speechLang]);

  // Check if text contains Devanagari / Hindi script
  const containsHindiScript = (text: string) => {
    return /[\u0900-\u097F]/.test(text);
  };

  // Split article text into smooth, unbroken readable sentences
  useEffect(() => {
    if (!currentText.trim()) {
      setSentences([]);
      return;
    }

    // Strip markdown formatting symbols cleanly
    const cleanedText = currentText.replace(/[*_#`~>\[\]]/g, '');

    // Split by full stops, Hindi purna viram (।), exclamations, question marks, linebreaks
    const rawChunks = cleanedText
      .split(/(?<=[.!?।\n])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    // If a chunk is very long (>120 chars), split by commas to prevent browser TTS stalls
    const smoothSentences: string[] = [];
    rawChunks.forEach(chunk => {
      if (chunk.length > 120 && chunk.includes(',')) {
        const parts = chunk.split(/(?<=,)\s+/);
        parts.forEach(p => {
          if (p.trim().length > 0) smoothSentences.push(p.trim());
        });
      } else {
        smoothSentences.push(chunk);
      }
    });

    setSentences(smoothSentences.length > 0 ? smoothSentences : [cleanedText]);

    // Auto set speech language mode to Hindi if Devanagari script is detected
    if (containsHindiScript(currentText)) {
      setSpeechLang('hi');
    }
  }, [currentText]);

  // Fetch article URL content
  const handleFetchUrl = async () => {
    if (!articleUrl.trim()) {
      showToast(isHindi ? "कृपया किसी लेख की लिंक दर्ज करें" : "Please enter a valid article URL", "info");
      return;
    }

    setIsFetchingUrl(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Extract the main article text cleanly from this webpage URL: ${articleUrl}. Return plain readable text without HTML tags or markdown so it can be read smoothly aloud.`
        })
      });

      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();
      const extractedText = data.response || (isHindi ? "लेख लोड हो गया है।" : "Article text loaded successfully.");
      
      setInputText(extractedText);
      setTranslatedText(extractedText);
      showToast(isHindi ? "लेख लोड हो गया" : "Article loaded", "success");
    } catch (err) {
      const fallbackText = isHindi 
        ? `वेबसाइट लिंक (${articleUrl}) से प्राप्त मुख्य सामग्री।`
        : `Article extracted from link (${articleUrl}).`;
      setInputText(fallbackText);
      setTranslatedText(fallbackText);
      showToast(isHindi ? "लेख तैयार है" : "Article loaded", "info");
    } finally {
      setIsFetchingUrl(false);
    }
  };

  // AI Translation Handler (Sleek Cyan/Indigo theme)
  const handleTranslate = async () => {
    const textToTranslate = inputText || translatedText;
    if (!textToTranslate.trim()) {
      showToast(isHindi ? "कृपया पहले कोई पाठ दर्ज करें" : "Please enter text first", "info");
      return;
    }

    setIsTranslating(true);
    stopSpeech();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Translate the following article text cleanly into: ${selectedLanguage}. Return natural spoken words suitable for clear speech synthesis without any markdown:\n\n${textToTranslate}`
        })
      });

      if (!res.ok) throw new Error("Translation failed");
      const data = await res.json();
      const result = data.response || textToTranslate;
      setTranslatedText(result);

      if (selectedLanguage === 'hindi' || selectedLanguage === 'hinglish' || selectedLanguage === 'bhojpuri') {
        setSpeechLang('hi');
      } else {
        setSpeechLang('en');
      }

      showToast(isHindi ? "अनुवाद संपन्न" : "Translation complete", "success");
    } catch (err) {
      showToast(isHindi ? "अनुवाद में त्रुटि आई" : "Translation error", "error");
      setTranslatedText(textToTranslate);
    } finally {
      setIsTranslating(false);
    }
  };

  // Robust Sequential Speech Player for Hindi & English
  const playSentenceAtIndex = (index: number, sentenceList: string[]) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    
    if (index >= sentenceList.length) {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentSentenceIdx(-1);
      showToast(isHindi ? "पूरा लेख पढ़ लिया गया" : "Full article reading completed", "success");
      return;
    }

    const rawText = sentenceList[index];
    if (!rawText) {
      playSentenceAtIndex(index + 1, sentenceList);
      return;
    }

    // Clean text for speech
    const speechText = rawText.replace(/[।!?\n]/g, ' ').trim();
    if (!speechText) {
      playSentenceAtIndex(index + 1, sentenceList);
      return;
    }

    window.speechSynthesis.cancel();
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    const utterance = new SpeechSynthesisUtterance(speechText);
    activeUtteranceRef.current = utterance;
    utterance.rate = playbackRate;
    utterance.pitch = voicePitch;

    // Detect if this sentence is in Hindi or if Speech Language is set to Hindi
    const isTextHindi = containsHindiScript(speechText) || speechLang === 'hi';

    if (isTextHindi) {
      utterance.lang = 'hi-IN';
      
      // Look specifically for a Hindi voice in available system voices
      const hindiVoice = voices.find(v => v.lang.toLowerCase().startsWith('hi') || v.name.toLowerCase().includes('hindi') || v.name.toLowerCase().includes('google हिन्दी'));
      
      if (hindiVoice) {
        utterance.voice = hindiVoice;
      } else if (selectedVoice && selectedVoice.lang.toLowerCase().startsWith('hi')) {
        utterance.voice = selectedVoice;
      } else {
        // CRITICAL FIX: If no explicit Hindi voice object exists, set voice to null!
        // Do NOT assign an English voice object to a hi-IN utterance or Chrome will remain silent!
        utterance.voice = null;
      }
    } else {
      utterance.lang = 'en-US';
      const engVoice = voices.find(v => v.lang.toLowerCase().startsWith('en'));
      if (selectedVoice && selectedVoice.lang.toLowerCase().startsWith('en')) {
        utterance.voice = selectedVoice;
      } else if (engVoice) {
        utterance.voice = engVoice;
      } else {
        utterance.voice = null;
      }
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      setCurrentSentenceIdx(index);
    };

    utterance.onend = () => {
      playSentenceAtIndex(index + 1, sentenceList);
    };

    utterance.onerror = (e) => {
      console.warn("Speech Synthesis Utterance Error:", e);
      // Skip failed sentence and continue seamlessly
      playSentenceAtIndex(index + 1, sentenceList);
    };

    // Ensure engine is active and speak
    window.speechSynthesis.speak(utterance);
  };

  const startSpeech = (startFromIdx?: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      showToast(isHindi ? "ब्राउज़र में वाइस स्पीच उपलब्ध नहीं है" : "Speech synthesis not supported", "error");
      return;
    }

    if (sentences.length === 0) {
      showToast(isHindi ? "पढ़ने के लिए कोई सामग्री उपलब्ध नहीं है" : "No content available to speak", "info");
      return;
    }

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    const targetIdx = typeof startFromIdx === 'number' ? startFromIdx : (currentSentenceIdx >= 0 ? currentSentenceIdx : 0);
    playSentenceAtIndex(targetIdx, sentences);
  };

  const pauseSpeech = () => {
    if ('speechSynthesis' in window && isPlaying) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentSentenceIdx(-1);
    }
  };

  const handleCopy = () => {
    if (!currentText) return;
    navigator.clipboard.writeText(currentText);
    setCopied(true);
    showToast(isHindi ? "पाठ कॉपी हो गया" : "Text copied", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-5 space-y-4 font-sans text-left animate-fade-in">
      
      {/* Sleek Minimal Header */}
      <div className="flex items-center justify-between bg-[#0B0F19] border border-slate-800 px-4 py-3 rounded-2xl shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-lg">
            🎙️
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span>{isHindi ? "आर्टिकल वाइस रीडर" : "Article Voice Reader"}</span>
            </h1>
            <p className="text-[11px] text-slate-400">
              {isHindi ? "सामग्री डालें और स्पष्ट आवाज़ में पूरा लेख सुनें" : "Paste content or load a link to listen aloud"}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        {isPlaying ? (
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>{isHindi ? `वाक्य ${currentSentenceIdx + 1}/${sentences.length}` : `Sentence ${currentSentenceIdx + 1}/${sentences.length}`}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800/80 border border-slate-700/60 rounded-xl text-slate-300 text-[11px] font-medium">
            <Radio className="w-3.5 h-3.5 text-indigo-400" />
            <span>{isHindi ? "वाइस इंजन तैयार" : "Speech Engine Ready"}</span>
          </div>
        )}
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          
          {/* Input Panel (Text vs Link) */}
          <div className="bg-[#0B0F19] border border-slate-800 p-3.5 rounded-2xl space-y-3 shadow-md">
            <div className="flex items-center bg-slate-900/90 p-1 rounded-xl gap-1">
              <button
                onClick={() => setActiveTab('text')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'text'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{isHindi ? "पाठ पेस्ट करें" : "Paste Text"}</span>
              </button>
              <button
                onClick={() => setActiveTab('url')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'url'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>{isHindi ? "वेबसाइट लिंक" : "Article Link"}</span>
              </button>
            </div>

            {activeTab === 'text' ? (
              <textarea
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  setTranslatedText(e.target.value);
                }}
                placeholder={isHindi ? "यहाँ कोई भी समाचार, लेख या नोट्स लिखें..." : "Paste news, article, or notes here..."}
                rows={6}
                className="w-full p-3 bg-slate-900/90 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-white placeholder-slate-500 outline-none resize-none transition-all"
              />
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={articleUrl}
                    onChange={(e) => setArticleUrl(e.target.value)}
                    placeholder="https://example.com/article..."
                    className="flex-1 p-2.5 bg-slate-900/90 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-white placeholder-slate-500 outline-none"
                  />
                  <button
                    onClick={handleFetchUrl}
                    disabled={isFetchingUrl}
                    className="px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-550 text-white font-semibold text-xs rounded-xl flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    {isFetchingUrl ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <span>{isHindi ? "लोड करें" : "Fetch"}</span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Voice Language & Speech Engine Selector */}
          <div className="bg-[#0B0F19] border border-slate-800 p-3.5 rounded-2xl space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>{isHindi ? "वाइस भाषा एवं गति" : "Voice Language & Speed"}</span>
              </span>

              {/* Translation Option Toggle Button */}
              <button
                onClick={() => setShowTranslatePanel(!showTranslatePanel)}
                className="text-[11px] font-medium text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                {showTranslatePanel ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-cyan-400" />}
                <span>{showTranslatePanel ? (isHindi ? "अनुवाद छिपाएँ" : "Hide Translation") : (isHindi ? "अनुवाद विकल्प" : "Translation Option")}</span>
              </button>
            </div>

            {/* Speech Language Switcher (Pure Single Language Labels) */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-medium block">
                {isHindi ? "आवाज़ की भाषा:" : "Speech Language:"}
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => {
                    setSpeechLang('hi');
                    showToast(isHindi ? "हिंदी आवाज़ सक्रिय" : "Hindi Speech Active", "info");
                  }}
                  className={`py-2 rounded-xl border text-center font-bold cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                    speechLang === 'hi'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isHindi ? "हिंदी" : "Hindi"}</span>
                </button>
                <button
                  onClick={() => {
                    setSpeechLang('en');
                    showToast(isHindi ? "अंग्रेजी आवाज़ सक्रिय" : "English Speech Active", "info");
                  }}
                  className={`py-2 rounded-xl border text-center font-bold cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                    speechLang === 'en'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isHindi ? "अंग्रेजी" : "English"}</span>
                </button>
              </div>
            </div>

            {/* Voice Engine Picker */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-medium block">
                {isHindi ? "सिस्टम आवाज़ इंजन:" : "System Voice Engine:"}
              </label>
              <select
                value={selectedVoice?.name || ''}
                onChange={(e) => {
                  const voice = voices.find(v => v.name === e.target.value) || null;
                  setSelectedVoice(voice);
                }}
                className="w-full p-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-200 outline-none truncate cursor-pointer font-medium"
              >
                {voices.length > 0 ? (
                  voices.map((v, i) => (
                    <option key={i} value={v.name}>
                      {v.name} ({v.lang})
                    </option>
                  ))
                ) : (
                  <option value="">{isHindi ? "मानक आवाज़ इंजन" : "Standard Voice Engine"}</option>
                )}
              </select>
            </div>

            {/* Speed & Pitch Controls */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-medium block">
                  {isHindi ? "गति:" : "Speed:"} {playbackRate}x
                </label>
                <div className="flex items-center gap-1">
                  {[0.8, 0.9, 1.0].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => {
                        setPlaybackRate(rate);
                        if (isPlaying) {
                          stopSpeech();
                          setTimeout(() => startSpeech(), 100);
                        }
                      }}
                      className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                        playbackRate === rate
                          ? 'bg-amber-500 text-slate-950 shadow-sm'
                          : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-medium block">
                  {isHindi ? "स्वर टोन:" : "Voice Tone:"}
                </label>
                <div className="flex items-center gap-1">
                  {[
                    { label: isHindi ? 'स्वाभाविक' : 'Natural', pitch: 1.0 },
                    { label: isHindi ? 'मधुर' : 'Warm', pitch: 1.1 }
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => setVoicePitch(p.pitch)}
                      className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                        voicePitch === p.pitch
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Optional Translation Option (Sleek Indigo/Cyan style, NOT Pink!) */}
          {showTranslatePanel && (
            <div className="bg-[#0B0F19] border border-cyan-500/30 p-3.5 rounded-2xl space-y-2.5 shadow-md">
              <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <Languages className="w-4 h-4 text-cyan-400" />
                <span>{isHindi ? "अन्य भाषा में अनुवाद करें" : "Translate to Language"}</span>
              </span>

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="p-2 bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl text-xs text-white outline-none font-medium cursor-pointer"
                >
                  <option value="hindi">{isHindi ? "हिंदी" : "Hindi"}</option>
                  <option value="english">{isHindi ? "अंग्रेजी" : "English"}</option>
                  <option value="hinglish">Hinglish</option>
                  <option value="bhojpuri">{isHindi ? "भोजपुरी" : "Bhojpuri"}</option>
                  <option value="marathi">{isHindi ? "मराठी" : "Marathi"}</option>
                  <option value="bengali">{isHindi ? "बंगला" : "Bengali"}</option>
                  <option value="tamil">{isHindi ? "तमिल" : "Tamil"}</option>
                  <option value="telugu">{isHindi ? "तेलुगु" : "Telugu"}</option>
                  <option value="gujarati">{isHindi ? "गुजराती" : "Gujarati"}</option>
                  <option value="punjabi">{isHindi ? "पंजाबी" : "Punjabi"}</option>
                </select>

                <button
                  onClick={handleTranslate}
                  disabled={isTranslating}
                  className="py-2.5 px-3 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-cyan-400/30 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isTranslating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>{isHindi ? "अनुवाद जारी..." : "Translating..."}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                      <span>{isHindi ? "अनुवाद करें" : "Translate"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right Panel: Player & Article Text (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          
          {/* Main Audio Player Console */}
          <div className="bg-[#0B0F19] border border-slate-800 p-4 rounded-2xl shadow-md space-y-3 relative">
            
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isPlaying ? 'bg-amber-500 text-slate-950' : 'bg-indigo-600 text-white'}`}>
                  <Headphones className={`w-5 h-5 ${isPlaying ? 'animate-bounce' : ''}`} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white flex items-center gap-2">
                    <span>{isHindi ? "वाइस प्लेयर" : "Voice Player"}</span>
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    {isPlaying 
                      ? (isHindi ? `वाक्य ${currentSentenceIdx + 1} / ${sentences.length} पढ़ा जा रहा है...` : `Reading sentence ${currentSentenceIdx + 1} / ${sentences.length}...`) 
                      : isPaused 
                      ? (isHindi ? "ऑडियो रुका हुआ है" : "Audio paused") 
                      : (isHindi ? "पूरा लेख सुनने के लिए प्ले दबाएँ" : "Press play to listen to article")}
                  </p>
                </div>
              </div>

              {/* Font Size Selector */}
              <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs text-slate-300 gap-1">
                <button
                  onClick={() => setFontSize('sm')}
                  className={`px-2 py-0.5 rounded text-[10px] ${fontSize === 'sm' ? 'bg-indigo-600 text-white font-bold' : 'hover:text-white'}`}
                >
                  A-
                </button>
                <button
                  onClick={() => setFontSize('base')}
                  className={`px-2 py-0.5 rounded text-[10px] ${fontSize === 'base' ? 'bg-indigo-600 text-white font-bold' : 'hover:text-white'}`}
                >
                  A
                </button>
                <button
                  onClick={() => setFontSize('lg')}
                  className={`px-2 py-0.5 rounded text-[10px] ${fontSize === 'lg' ? 'bg-indigo-600 text-white font-bold' : 'hover:text-white'}`}
                >
                  A+
                </button>
              </div>
            </div>

            {/* Sentence Progress Bar */}
            {sentences.length > 0 && currentSentenceIdx >= 0 && (
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-amber-400 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${Math.round(((currentSentenceIdx + 1) / sentences.length) * 100)}%` }}
                />
              </div>
            )}

            {/* Primary Play Controls */}
            <div className="flex items-center justify-center gap-3 py-1">
              
              {!isPlaying ? (
                <button
                  onClick={() => startSpeech()}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer active:scale-95 border-none"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>{isPaused ? (isHindi ? "पुनः चालू करें" : "Resume") : (isHindi ? "पूरा लेख सुनें" : "Listen Article")}</span>
                </button>
              ) : (
                <button
                  onClick={pauseSpeech}
                  className="px-6 py-3 bg-amber-500 text-slate-950 hover:bg-amber-400 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer active:scale-95 border-none"
                >
                  <Pause className="w-4 h-4 fill-slate-950" />
                  <span>{isHindi ? "रोकें" : "Pause"}</span>
                </button>
              )}

              {/* Stop Button */}
              <button
                onClick={stopSpeech}
                disabled={!isPlaying && !isPaused}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>{isHindi ? "बंद करें" : "Stop"}</span>
              </button>

              <button
                onClick={handleCopy}
                className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-all cursor-pointer"
                title={isHindi ? "कॉपी करें" : "Copy text"}
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

          </div>

          {/* Article Text View with Interactive Sentence Highlighting */}
          <div className="bg-[#0B0F19] border border-slate-800 p-4 rounded-2xl space-y-3 flex-1 flex flex-col justify-between shadow-md min-h-[340px]">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span>{isHindi ? "लेख सामग्री" : "Article Content"}</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {sentences.length} {isHindi ? "वाक्य" : "sentences"}
              </span>
            </div>

            <div className="flex-1 py-1 overflow-y-auto max-h-[420px] scrollbar-thin space-y-1.5">
              {sentences.length > 0 ? (
                sentences.map((sent, idx) => {
                  const isCurrent = idx === currentSentenceIdx && isPlaying;
                  return (
                    <p
                      key={idx}
                      onClick={() => {
                        startSpeech(idx);
                      }}
                      className={`cursor-pointer p-2 rounded-xl transition-all ${
                        fontSize === 'sm' ? 'text-xs' :
                        fontSize === 'base' ? 'text-sm' :
                        fontSize === 'lg' ? 'text-base' : 'text-lg'
                      } ${
                        isCurrent
                          ? 'bg-indigo-950/80 border-l-4 border-amber-400 text-white font-semibold pl-3 shadow-sm'
                          : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                      }`}
                    >
                      {sent}
                    </p>
                  );
                })
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500 space-y-2">
                  <Headphones className="w-8 h-8 text-slate-700" />
                  <p className="text-xs font-medium">
                    {isHindi 
                      ? "कोई लेख लोडेड नहीं है। पाठ पेस्ट करें या लिंक दर्ज करें।" 
                      : "No article loaded. Paste text or enter link."}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
              <span>{isHindi ? "किसी वाक्य पर क्लिक करके सीधे वहीं से सुनें" : "Click any sentence to jump to that part"}</span>
              <span className="text-indigo-400 font-semibold">HansAI Speech</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
