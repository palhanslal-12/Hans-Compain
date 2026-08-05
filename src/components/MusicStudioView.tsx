import React, { useState, useEffect, useRef } from 'react';
import { 
  Music, Play, Pause, Square, Volume2, VolumeX, Sparkles, Search, 
  Plus, Share2, Radio, Disc, Mic, Headphones, Trash2
} from 'lucide-react';

export interface MusicTrack {
  id: string;
  title: string;
  genre: 'Lofi' | 'Rap' | 'Bhakti' | 'Classical' | 'AlphaWaves' | 'StenoBeat';
  bpm: number;
  creatorName: string;
  createdAt: string;
  lyrics: string;
  plays: number;
  isCustom?: boolean;
}

export const INITIAL_MUSIC_TRACKS: MusicTrack[] = [
  {
    id: "trk_001",
    title: "Focus & Grit (जीत का कड़क जोश - Motivation Rap)",
    genre: "Rap",
    bpm: 95,
    creatorName: "Hanslal Pal Ji",
    createdAt: "2026-07-28",
    plays: 1420,
    lyrics: `[Verse 1]\nपावन माटी से उठकर अब तुमको इतिहास बनाना है,\nआलस की जंजीरें तोड़, खुद को अब मेहनत में तपाना है!\nगाँव के खेतों की खुशबू, तेरे पुरखों का संघर्ष याद रख,\nहाथ में कलम, दिमाग में सपना, खुद पर तू पूर्ण विश्वास रख!\n\n[Chorus]\nमेहनत कर, लड़ जा रे बंदे, लक्ष्य को तू पा के रहेगा,\nदुनिया जो आज हंसती है तुझपे, कल वो खुद सर झुका के कहेगा—\n"वाह रे शूरवीर तूने कर दिखाया, असंभव को भी संभव बनाया!"`
  },
  {
    id: "trk_002",
    title: "Saraswati Vandana & Study Focus Lofi",
    genre: "Bhakti",
    bpm: 72,
    creatorName: "HansAI Divine Studio",
    createdAt: "2026-07-30",
    plays: 2890,
    lyrics: `[Invocation]\nया कुन्देन्दुतुषारहारधवला या शुभ्रवस्त्रावृता,\nया वीणावरदण्डमण्डितकरा या श्वेतपद्मासना॥\n\n[Study Lofi Ambient Verse]\nमाँ सरस्वती का वरदान, बुद्धि और ज्ञान का प्रकाश,\nएकाग्र मन से अध्ययन कर, पूर्ण होगा हर अभिलाष!\nलो-फाई संगीत की शांत धारा, तनाव को करे दूर,\nज्ञान का हर एक दीप जलेगा, मन होगा भरपूर!`
  },
  {
    id: "trk_003",
    title: "Steno Speed 100 WPM Rhythm Beat",
    genre: "StenoBeat",
    bpm: 108,
    creatorName: "HansAI Student",
    createdAt: "2026-08-01",
    plays: 870,
    lyrics: `[Speed Beat Dictation]\nपेंसिल की नोक चले तेज़ी से, पिटमैन के हुक और स्ट्रोक सधे,\n80 से 100 की रफ्तार पकड़, परीक्षा के हर सवाल बंधे!\nकंसोनेंट और वॉवेल का तालमेल, डिक्टेशन में ना हो कोई भूल,\nस्टेनोग्राफर का यह कड़ा अभ्यास, बनाएगा तुम्हें सफल और कूल!`
  },
  {
    id: "trk_004",
    title: "Entrepreneur Spirit (धंधे का सिकंदर - Motivation Rap)",
    genre: "Rap",
    bpm: 90,
    creatorName: "HansAI Candidate",
    createdAt: "2026-07-29",
    plays: 640,
    lyrics: `[Verse 1]\nजमीन से जुड़कर आसमां को छूना है,\nखेत की हल्दी-अदरक को अब सोना बनाना है!\nMSME की योजना तैयार कर, फैक्ट्री का ढांचा खड़ा कर,\nमशीनरी पर सब्सिडी मिलेगी, तू तो बस हिम्मत बड़ी कर!\n\n[Chorus]\nबिज़नेस का राजा बनेगा तू, बस ईमान अपना साफ़ रख,\nभारत के माटी की शक्ति, उद्यम का नया इतिहास रख!`
  },
  {
    id: "trk_005",
    title: "Deep Alpha Waves Concentration (10Hz Binaural)",
    genre: "AlphaWaves",
    bpm: 60,
    creatorName: "HansAI Neuroscience Core",
    createdAt: "2026-08-02",
    plays: 3120,
    lyrics: `[Meditative Mantras]\nॐ शांतिः शांतिः शांतिः॥\n10Hz Alpha Waves frequency active for optimal memory retention, deep study focus, and cognitive endurance.`
  }
];

interface MusicStudioViewProps {
  user?: { name?: string; email?: string } | null;
  showToast?: (msg: string, type?: 'success' | 'warn' | 'info') => void;
  isAdminEmbedded?: boolean;
}

export function MusicStudioView({ user, showToast, isAdminEmbedded = false }: MusicStudioViewProps) {
  const [tracks, setTracks] = useState<MusicTrack[]>(() => {
    try {
      const saved = localStorage.getItem('hansai-custom-music-tracks');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return [...parsed, ...INITIAL_MUSIC_TRACKS.filter(t => !parsed.some((p: any) => p.id === t.id))];
        }
      }
    } catch (e) {}
    return INITIAL_MUSIC_TRACKS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');

  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(INITIAL_MUSIC_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [volume, setVolume] = useState(80);
  const [speedRate, setSpeedRate] = useState(1.0);
  const [activeLineIdx, setActiveLineIdx] = useState(0);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newGenre, setNewGenre] = useState<MusicTrack['genre']>('Lofi');
  const [newBpm, setNewBpm] = useState(85);
  const [newLyrics, setNewLyrics] = useState('');
  const [isGeneratingLyrics, setIsGeneratingLyrics] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const beatIntervalRef = useRef<any>(null);
  const lyricTimerRef = useRef<any>(null);

  useEffect(() => {
    try {
      const customOnly = tracks.filter(t => t.isCustom);
      localStorage.setItem('hansai-custom-music-tracks', JSON.stringify(customOnly));
    } catch (e) {}
  }, [tracks]);

  const stopAudioPlayer = () => {
    if (beatIntervalRef.current) clearInterval(beatIntervalRef.current);
    if (lyricTimerRef.current) clearInterval(lyricTimerRef.current);
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      try { audioCtxRef.current.close(); } catch (e) {}
    }
    audioCtxRef.current = null;
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  useEffect(() => {
    return () => { stopAudioPlayer(); };
  }, []);

  const startSynthesizerBeats = (track: MusicTrack) => {
    stopAudioPlayer();

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.value = volume / 100;
      masterGain.connect(ctx.destination);

      const stepIntervalMs = (60000 / track.bpm) / 2;
      let stepCount = 0;

      beatIntervalRef.current = setInterval(() => {
        if (!ctx || ctx.state === 'closed') return;
        const now = ctx.currentTime;

        if (stepCount % 4 === 0) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = track.genre === 'Bhakti' ? 'triangle' : 'sine';
          const startFreq = track.genre === 'Rap' ? 140 : 110;
          osc.frequency.setValueAtTime(startFreq, now);
          osc.frequency.exponentialRampToValueAtTime(35, now + 0.18);
          
          gain.gain.setValueAtTime(0.4 * (volume / 100), now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now);
          osc.stop(now + 0.26);
        }

        if (stepCount % 4 === 2 || (track.genre === 'StenoBeat' && stepCount % 2 === 1)) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(track.genre === 'Bhakti' ? 320 : 440, now);
          
          gain.gain.setValueAtTime(0.15 * (volume / 100), now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now);
          osc.stop(now + 0.12);
        }

        if (stepCount % 16 === 0) {
          const frequencies = track.genre === 'Bhakti' ? [220, 277.18, 329.63] :
                              track.genre === 'AlphaWaves' ? [146.83, 220] : [174.61, 220, 261.63];

          frequencies.forEach(freq => {
            const padOsc = ctx.createOscillator();
            const padGain = ctx.createGain();
            padOsc.type = 'sine';
            padOsc.frequency.setValueAtTime(freq, now);

            padGain.gain.setValueAtTime(0.05 * (volume / 100), now);
            padGain.gain.linearRampToValueAtTime(0.12 * (volume / 100), now + 0.4);
            padGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

            padOsc.connect(padGain);
            padGain.connect(masterGain);
            padOsc.start(now);
            padOsc.stop(now + 1.9);
          });
        }

        stepCount = (stepCount + 1) % 16;
      }, stepIntervalMs);

      const lines = track.lyrics.split('\n').filter(l => l.trim().length > 0 && !l.startsWith('['));
      setActiveLineIdx(0);

      if (isVoiceEnabled && typeof window !== 'undefined' && window.speechSynthesis && lines.length > 0) {
        let currentLine = 0;

        const speakNextLine = () => {
          if (currentLine >= lines.length) currentLine = 0;
          setActiveLineIdx(currentLine);

          const utt = new SpeechSynthesisUtterance(lines[currentLine]);
          utt.lang = 'hi-IN';
          utt.rate = speedRate;
          utt.pitch = track.genre === 'Rap' ? 1.1 : track.genre === 'Bhakti' ? 0.95 : 1.0;
          utt.volume = volume / 100;

          utt.onend = () => {
            currentLine++;
            lyricTimerRef.current = setTimeout(speakNextLine, 1200 / speedRate);
          };

          window.speechSynthesis.speak(utt);
        };

        speakNextLine();
      }

      setIsPlaying(true);
      if (showToast) showToast(`Playing: ${track.title} 🎵`, "success");

      setTracks(prev => prev.map(t => t.id === track.id ? { ...t, plays: t.plays + 1 } : t));

      fetch('/api/users/log-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user?.name || "Student",
          email: user?.email || "student@example.com",
          type: "music",
          query: `Played Music Track: '${track.title}' (${track.genre})`
        })
      }).catch(() => {});

    } catch (err) {
      console.error("Audio synth error", err);
      if (showToast) showToast("Failed to initialize Web Audio engine", "warn");
    }
  };

  const handlePlayTrack = (track: MusicTrack) => {
    if (currentTrack?.id === track.id && isPlaying) {
      stopAudioPlayer();
    } else {
      setCurrentTrack(track);
      startSynthesizerBeats(track);
    }
  };

  const handleAutoGenerateLyrics = async () => {
    if (!newTitle.trim()) {
      if (showToast) showToast("Please enter a Song Title first!", "warn");
      return;
    }

    setIsGeneratingLyrics(true);
    try {
      const prompt = `Write inspiring Hindi motivational lyrics for a study song titled "${newTitle}" in genre "${newGenre}". Include 2 short verses and a catch chorus.`;
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
          userName: user?.name || "Student",
          userEmail: user?.email || "student@example.com"
        })
      });
      const data = await res.json();
      if (data && data.reply) {
        setNewLyrics(data.reply);
        if (showToast) showToast("AI Lyrics generated successfully! ✨", "success");
      } else {
        throw new Error("Failed to generate");
      }
    } catch (err) {
      setNewLyrics(`[Verse 1]\nकिताबों को साथी बनाकर, सपनों को उड़ान देंगे,\n${newTitle} के हर सवाल का, हम सटीक जवाब देंगे!\n\n[Chorus]\nमेहनत हमारी पहचान बनेगी, जीत की नयी सुबह ढलेगी!`);
      if (showToast) showToast("Generated preset lyrics template!", "info");
    } finally {
      setIsGeneratingLyrics(false);
    }
  };

  const handleCreateTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newLyrics.trim()) {
      if (showToast) showToast("Please fill in both Title and Lyrics", "warn");
      return;
    }

    const createdTrack: MusicTrack = {
      id: "trk_custom_" + Date.now(),
      title: newTitle.trim(),
      genre: newGenre,
      bpm: Number(newBpm) || 90,
      creatorName: user?.name || "Hanslal Pal Student",
      createdAt: new Date().toISOString().split('T')[0],
      lyrics: newLyrics.trim(),
      plays: 1,
      isCustom: true
    };

    setTracks(prev => [createdTrack, ...prev]);
    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewLyrics('');

    if (showToast) showToast(`Created AI Song Track "${createdTrack.title}"! 🎵`, "success");

    setCurrentTrack(createdTrack);
    startSynthesizerBeats(createdTrack);

    fetch('/api/users/log-activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: user?.name || "Student",
        email: user?.email || "student@example.com",
        type: "music",
        query: `Created Custom AI Music: '${createdTrack.title}' (${createdTrack.genre})`
      })
    }).catch(() => {});
  };

  const filteredTracks = tracks.filter(t => {
    const matchesGenre = selectedGenre === 'All' || t.genre === selectedGenre;
    const matchesSearch = !searchQuery.trim() || 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.creatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.lyrics.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  return (
    <div className={`space-y-6 ${isAdminEmbedded ? 'p-0' : 'max-w-6xl mx-auto px-4 py-6'}`}>
      
      <div className="bg-gradient-to-r from-amber-950/40 via-[#0C1220] to-indigo-950/40 border border-amber-500/30 rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xl relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-300 text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
            <span>AI Music & Recital Studio (संगीत व ऑडियो पाठ)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>🎵 AI Study Beats & Audio Recital Hearing Console</span>
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            अध्ययन एकाग्रता, स्टैनो स्पीड, देशभक्ति और भक्ति भाव के लिए एआई म्यूजिक बनाएं, खोजें और रियल-टाइम वेब ऑडियो में सुनें (Hearing Mode Active)।
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-5 py-3 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 hover:from-amber-500 hover:to-amber-300 text-slate-950 font-black rounded-2xl text-xs flex items-center justify-center gap-2 transition-all shadow-xl shadow-amber-600/20 cursor-pointer border-none z-10 whitespace-nowrap"
        >
          <Plus className="w-4 h-4 text-slate-950" />
          <span>+ Create AI Music / म्यूजिक बनाएं</span>
        </button>

        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-3xl rounded-full pointer-events-none" />
      </div>

      {currentTrack && (
        <div className="bg-[#0A0F1D] border-2 border-amber-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 relative overflow-hidden animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            
            <div className="flex items-center gap-3.5">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg ${
                isPlaying ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white animate-spin' : 'bg-slate-800 text-slate-400'
              }`}>
                <Disc className="w-6 h-6" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded text-[9px] font-bold uppercase">
                    {currentTrack.genre} • {currentTrack.bpm} BPM
                  </span>
                  <span className="text-[10px] text-slate-400">By {currentTrack.creatorName}</span>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-white mt-0.5">{currentTrack.title}</h3>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => handlePlayTrack(currentTrack)}
                className={`px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all shadow-lg cursor-pointer border-none ${
                  isPlaying 
                    ? 'bg-rose-600 hover:bg-rose-500 text-white' 
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Pause / रोकें</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Play & Hear / सुनें 🎧</span>
                  </>
                )}
              </button>

              <button
                onClick={stopAudioPlayer}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl transition-all cursor-pointer border-none"
                title="Stop audio"
              >
                <Square className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            <div className="md:col-span-5 bg-[#050811] border border-slate-800/80 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                <span className="flex items-center gap-1.5 text-amber-400">
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  <span>Synthesizer Hearing Waveform</span>
                </span>
                <span>{isPlaying ? 'LIVE AUDIO PLAYING' : 'READY TO HEAR'}</span>
              </div>

              <div className="h-16 flex items-end justify-center gap-1 px-2 py-1 bg-slate-950/80 rounded-xl overflow-hidden">
                {[40, 75, 30, 90, 60, 100, 45, 80, 25, 95, 70, 50, 85, 35, 90, 65, 40, 100, 75, 30, 85, 50, 90, 40].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: isPlaying ? `${Math.max(15, (h * (Math.random() * 0.6 + 0.6)))}%` : '20%' }}
                    className={`w-1.5 rounded-full transition-all duration-150 ${
                      isPlaying 
                        ? i % 2 === 0 ? 'bg-amber-400' : 'bg-emerald-400' 
                        : 'bg-slate-800'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between gap-4 pt-1 text-xs">
                <div className="flex items-center gap-2 flex-1">
                  <button onClick={() => setVolume(volume === 0 ? 80 : 0)} className="text-slate-400 hover:text-white border-none bg-transparent cursor-pointer">
                    {volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <span className="text-[10px] font-mono text-slate-400 w-8">{volume}%</span>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-xl">
                  <span className="text-[10px] text-slate-400">Speed:</span>
                  <select
                    value={speedRate}
                    onChange={(e) => setSpeedRate(Number(e.target.value))}
                    className="bg-transparent text-amber-300 font-bold text-[11px] outline-none cursor-pointer"
                  >
                    <option value={0.8} className="bg-slate-900">0.8x</option>
                    <option value={1.0} className="bg-slate-900">1.0x Normal</option>
                    <option value={1.2} className="bg-slate-900">1.2x Fast</option>
                    <option value={1.5} className="bg-slate-900">1.5x Rapid</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="md:col-span-7 bg-[#050811] border border-slate-800/80 rounded-2xl p-4 min-h-[140px] flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-indigo-400" />
                  <span>AI Teleprompter & Lyrics Recitation</span>
                </span>
                
                <button
                  onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                  className={`text-[10px] px-2.5 py-0.5 rounded-md font-bold transition-all border-none cursor-pointer ${
                    isVoiceEnabled ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  Voice Recitation: {isVoiceEnabled ? 'ON 🔊' : 'OFF 🔇'}
                </button>
              </div>

              <div className="py-3 px-2 overflow-y-auto max-h-36 space-y-1.5 text-center">
                {currentTrack.lyrics.split('\n').map((line, idx) => {
                  if (!line.trim()) return <div key={idx} className="h-2" />;
                  if (line.startsWith('[')) {
                    return (
                      <span key={idx} className="block text-[10px] font-bold text-amber-400/80 uppercase tracking-widest my-1">
                        {line}
                      </span>
                    );
                  }
                  const isCurrent = idx === activeLineIdx && isPlaying;
                  return (
                    <p
                      key={idx}
                      className={`text-xs sm:text-sm font-medium transition-all duration-300 ${
                        isCurrent 
                          ? 'text-amber-300 font-bold scale-[1.02]' 
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {line}
                    </p>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-850/60 text-[10px] text-slate-500">
                <span>HansAI Web Audio Synthesis</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(currentTrack.lyrics);
                    if (showToast) showToast("Lyrics copied to clipboard! 📋", "success");
                  }}
                  className="hover:text-amber-300 flex items-center gap-1 border-none bg-transparent cursor-pointer"
                >
                  <Share2 className="w-3 h-3" />
                  <span>Copy Lyrics</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0A0F1D] border border-slate-800 p-3.5 rounded-2xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search AI songs, BHAKTI, LOFI, STENO beats..."
            className="w-full text-xs py-2.5 pl-9 pr-4 bg-[#04070F] border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs font-semibold">
          {['All', 'Lofi', 'Rap', 'Bhakti', 'StenoBeat', 'AlphaWaves'].map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`px-3 py-1.5 rounded-xl text-[11px] transition-all whitespace-nowrap cursor-pointer border-none ${
                selectedGenre === g 
                  ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md' 
                  : 'bg-slate-850 text-slate-400 hover:text-white'
              }`}
            >
              {g === 'All' ? 'All Songs' : g === 'Bhakti' ? '🌺 Bhakti' : g === 'Lofi' ? '🎧 Study Lofi' : g === 'Rap' ? '🎤 Motivation Rap' : g === 'StenoBeat' ? '✒️ Steno Beat' : '🧠 Alpha Waves'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Music className="w-4 h-4 text-amber-400" />
            <span>Song & Music Library ({filteredTracks.length})</span>
          </h3>
          <span className="text-[10px] text-slate-500">Click any track to play & hear</span>
        </div>

        {filteredTracks.length === 0 ? (
          <div className="p-10 text-center bg-[#0A0F1D] border border-slate-800 rounded-2xl space-y-3">
            <Headphones className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">No music tracks found matching "{searchQuery}".</p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs cursor-pointer border-none"
            >
              + Create New Song Track
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredTracks.map((track) => {
              const isSelected = currentTrack?.id === track.id;
              const isCurrentlyPlaying = isSelected && isPlaying;

              return (
                <div
                  key={track.id}
                  className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-3 ${
                    isSelected 
                      ? 'bg-gradient-to-r from-amber-950/30 to-[#0F172A] border-amber-500/50 shadow-lg' 
                      : 'bg-[#0A0F1D] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          track.genre === 'Bhakti' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' :
                          track.genre === 'Rap' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                          track.genre === 'Lofi' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                          'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {track.genre}
                        </span>
                        <span className="text-[10px] text-slate-500">{track.bpm} BPM</span>
                        {track.isCustom && (
                          <span className="text-[9px] bg-amber-500/30 text-amber-200 px-1.5 py-0.2 rounded font-bold">
                            User Created
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-extrabold text-white">{track.title}</h4>
                      <p className="text-[10px] text-slate-400">Created by <span className="text-slate-300 font-semibold">{track.creatorName}</span> • {track.plays} plays</p>
                    </div>

                    <button
                      onClick={() => handlePlayTrack(track)}
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer border-none flex-shrink-0 ${
                        isCurrentlyPlaying
                          ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 animate-pulse'
                          : 'bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/40'
                      }`}
                      title={isCurrentlyPlaying ? 'Pause Audio' : 'Play & Hear Audio'}
                    >
                      {isCurrentlyPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                    </button>
                  </div>

                  <div className="bg-[#04070F] border border-slate-850 p-2.5 rounded-xl text-[11px] text-slate-400 line-clamp-2 italic">
                    "{track.lyrics.replace(/\[.*?\]/g, '').trim().substring(0, 110)}..."
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-850">
                    <span className="flex items-center gap-1 text-slate-400">
                      <Headphones className="w-3 h-3 text-amber-400" />
                      <span>Click to Hear Audio (सुनें)</span>
                    </span>

                    {track.isCustom && (
                      <button
                        onClick={() => {
                          setTracks(prev => prev.filter(t => t.id !== track.id));
                          if (isSelected) stopAudioPlayer();
                          if (showToast) showToast("Track removed from library", "info");
                        }}
                        className="text-rose-400 hover:text-rose-300 flex items-center gap-1 border-none bg-transparent cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#0A0F1D] border border-amber-500/40 rounded-3xl max-w-lg w-full p-6 space-y-5 text-left shadow-2xl relative">
            
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-xl shadow-lg shadow-amber-500/20">
                  🎵
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Create AI Song / Audio Recital</h3>
                  <p className="text-xs text-amber-400 font-medium">नया एआई संगीत व ऑडियो पाठ बनाएं</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white bg-slate-800 rounded-xl transition-all cursor-pointer border-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTrackSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Song / Recital Title (गीत या पाठ का शीर्षक)
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Saraswati Vandana, SSC Exam Win Motivation, Steno Beat..."
                  className="w-full text-xs p-3 bg-[#04070F] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Genre / Mood</label>
                  <select
                    value={newGenre}
                    onChange={(e) => setNewGenre(e.target.value as any)}
                    className="w-full text-xs p-3 bg-[#04070F] border border-slate-800 rounded-xl text-amber-300 font-bold outline-none"
                  >
                    <option value="Lofi">🎧 Study Lofi Beat</option>
                    <option value="Bhakti">🌺 Bhakti / Devotional</option>
                    <option value="Rap">🎤 Kaddak Rap Motivation</option>
                    <option value="StenoBeat">✒️ Steno Dictation Rhythm</option>
                    <option value="AlphaWaves">🧠 Alpha Waves Concentration</option>
                    <option value="Classical">🪕 Classical Indian</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Tempo (BPM): {newBpm}</label>
                  <input
                    type="range"
                    min="60"
                    max="140"
                    value={newBpm}
                    onChange={(e) => setNewBpm(Number(e.target.value))}
                    className="w-full accent-amber-500 mt-2"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-300">
                    Lyrics & Audio Text (बोल व छंद)
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoGenerateLyrics}
                    disabled={isGeneratingLyrics}
                    className="text-[10px] px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-bold rounded-lg border border-amber-500/30 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>{isGeneratingLyrics ? 'AI Writing...' : '✨ AI Auto-Generate Lyrics'}</span>
                  </button>
                </div>

                <textarea
                  rows={4}
                  value={newLyrics}
                  onChange={(e) => setNewLyrics(e.target.value)}
                  placeholder="Enter lyrics or verses to synthesize into audio..."
                  className="w-full text-xs p-3 bg-[#04070F] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500 leading-relaxed font-sans"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="w-1/3 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs cursor-pointer border-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-3 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-amber-600/20 cursor-pointer border-none"
                >
                  🎵 Synthesize & Save AI Track / ट्रैक बनाएं
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
