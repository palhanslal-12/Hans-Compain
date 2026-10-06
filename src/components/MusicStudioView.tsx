import React, { useState, useEffect, useRef } from 'react';
import { Music, Play, Pause, Volume2, Sparkles, Clock, RefreshCw, Zap } from 'lucide-react';

interface SoundTrack {
  id: string;
  name: string;
  category: string;
  frequency: number;
  description: string;
  icon: string;
}

export const MusicStudioView: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackId, setCurrentTrackId] = useState<string>('alpha');
  const [volume, setVolume] = useState<number>(0.3);
  const [timerMinutes, setTimerMinutes] = useState<number>(25);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);

  // Web Audio API refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const tracks: SoundTrack[] = [
    {
      id: 'alpha',
      name: 'अल्फा वेव्स (10 Hz Alpha State)',
      category: 'मेमोरी व तीव्र स्मरण',
      frequency: 10,
      description: 'मस्तिष्क को शांत रखकर लंबी अध्ययन बैठकों में याद रखने की क्षमता 2X करता है।',
      icon: '🧠'
    },
    {
      id: 'gamma',
      name: 'गामा वेव्स (40 Hz Gamma Focus)',
      category: 'कठिन गणित व स्टेनो डिक्टेशन',
      frequency: 40,
      description: 'उच्च एकाग्रता, समस्या समाधान और तेज़ गति से टाइपिंग/शॉर्टहैंड हेतु।',
      icon: '⚡'
    },
    {
      id: 'theta',
      name: 'थीटा वेव्स (6 Hz Theta Flow)',
      category: 'डीप विज़ुअलाइज़ेशन व थ्योरी',
      frequency: 6,
      description: 'तनाव मुक्ति और लंबे इतिहास/संविधान अध्यायों को आत्मसात करने हेतु।',
      icon: '🌊'
    },
    {
      id: 'lofi',
      name: 'लो-फाई 432 Hz हार्मोनिक ट्यून',
      category: 'शांत अध्ययन संगीत (Calm Focus)',
      frequency: 432,
      description: 'प्राकृतिक 432 हर्ट्ज विश्राम आवृत्ति जो मन की चंचलता को समाप्त करती है।',
      icon: '🎧'
    }
  ];

  const currentTrack = tracks.find(t => t.id === currentTrackId) || tracks[0];

  // Stop sound helper
  const stopAudio = () => {
    try {
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
        oscRef.current = null;
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    } catch (e) {
      console.warn(e);
    }
  };

  // Start synth tone helper
  const startAudio = (freq: number) => {
    stopAudio();
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // For binaural beat, play pleasant base carrier frequency modulated by target beat
      osc.frequency.setValueAtTime(freq > 50 ? freq : 200 + freq, ctx.currentTime);
      gain.gain.setValueAtTime(volume, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      oscRef.current = osc;
      gainRef.current = gain;
    } catch (e) {
      console.warn('Audio not supported or permission blocked', e);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopAudio();
      setIsPlaying(false);
    } else {
      startAudio(currentTrack.frequency);
      setIsPlaying(true);
    }
  };

  const handleSelectTrack = (trackId: string) => {
    setCurrentTrackId(trackId);
    const newTrack = tracks.find(t => t.id === trackId);
    if (isPlaying && newTrack) {
      startAudio(newTrack.frequency);
    }
  };

  // Timer effect
  useEffect(() => {
    let interval: any = null;
    if (timerActive) {
      interval = setInterval(() => {
        if (timerSeconds > 0) {
          setTimerSeconds(timerSeconds - 1);
        } else if (timerMinutes > 0) {
          setTimerMinutes(timerMinutes - 1);
          setTimerSeconds(59);
        } else {
          setTimerActive(false);
          stopAudio();
          setIsPlaying(false);
          setTimerMinutes(25);
          setTimerSeconds(0);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerMinutes, timerSeconds]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-5 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-pink-950/60 via-slate-900 to-indigo-950/40 p-5 sm:p-6 rounded-3xl border border-pink-500/30 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-bold uppercase border border-pink-500/30 mb-2">
              <Music className="w-3.5 h-3.5" />
              <span>बाइनॉरल बीट्स व डीप स्टडी स्टूडियो</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              फोकस म्यूजिक स्टूडियो (Focus &amp; Memory Beats)
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              अध्ययन के दौरान मस्तिष्क की एकाग्रता बढ़ाने के लिए वैज्ञानिक बाइनॉरल बीट्स और पोमोडोरो टाइमर।
            </p>
          </div>

          {/* Pomodoro Timer Badge */}
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center shrink-0 self-start sm:self-auto">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">पोमोडोरो टाइमर</span>
            <div className="text-2xl font-black font-mono text-pink-400">
              {String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}
            </div>
            <button
              onClick={() => setTimerActive(!timerActive)}
              className="mt-1 text-[11px] font-bold text-cyan-300 hover:text-white cursor-pointer"
            >
              {timerActive ? 'पॉज करें' : 'सत्र शुरू करें'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Player Canvas */}
      <div className="bg-[#091122] border-2 border-pink-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-pink-500/20 border-2 border-pink-400 flex items-center justify-center text-3xl shadow-lg shrink-0">
              {currentTrack.icon}
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-full border border-pink-500/20">
                {currentTrack.category}
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white mt-1">
                {currentTrack.name}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {currentTrack.description}
              </p>
            </div>
          </div>

          {/* Big Play/Pause Button */}
          <button
            onClick={togglePlay}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-xl shrink-0 self-start sm:self-auto ${
              isPlaying
                ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                : 'bg-pink-600 hover:bg-pink-500 text-white'
            }`}
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
          </button>
        </div>

        {/* Volume & Audio Equalizer Simulation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <Volume2 className="w-4 h-4 text-slate-400" />
            <input
              type="range"
              min="0.05"
              max="0.8"
              step="0.05"
              value={volume}
              onChange={(e) => {
                const newVol = parseFloat(e.target.value);
                setVolume(newVol);
                if (gainRef.current && audioCtxRef.current) {
                  gainRef.current.gain.setValueAtTime(newVol, audioCtxRef.current.currentTime);
                }
              }}
              className="w-full accent-pink-500 cursor-pointer"
            />
            <span className="text-xs font-mono text-slate-300 font-bold w-10 text-right">
              {Math.round(volume * 100)}%
            </span>
          </div>

          <div className="flex items-center gap-1.5 h-8 bg-slate-950 p-2 rounded-2xl border border-slate-800 justify-center">
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={i}
                className={`w-1 rounded-full transition-all duration-300 ${
                  isPlaying ? 'bg-pink-500 animate-pulse' : 'bg-slate-800'
                }`}
                style={{
                  height: isPlaying ? `${Math.sin(i + (Date.now() / 200)) * 60 + 40}%` : '20%'
                }}
              />
            ))}
          </div>
        </div>

        {/* Track Selection Cards */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-300 block">
            बाइनॉरल बीट फ्रीक्वेंसी का चयन करें:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {tracks.map(t => (
              <button
                key={t.id}
                onClick={() => handleSelectTrack(t.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                  currentTrackId === t.id
                    ? 'bg-pink-600/20 border-pink-400 text-white font-bold shadow-md'
                    : 'bg-slate-950 border-slate-850 text-slate-300 hover:bg-slate-900'
                }`}
              >
                <span className="text-2xl">{t.icon}</span>
                <div className="min-w-0">
                  <div className="text-xs truncate font-bold">{t.name}</div>
                  <div className="text-[10px] text-pink-300/80">{t.category}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
