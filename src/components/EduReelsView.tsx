import React, { useState, useEffect } from 'react';
import {
  Film,
  Play,
  Pause,
  Heart,
  Bookmark,
  Volume2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Activity,
  RefreshCw,
  Zap,
  Target,
  AlertTriangle
} from 'lucide-react';
import { getLocalActivities, LocalActivityLog } from '../firebase';
import { playNaturalSpeech, stopNaturalSpeech } from '../utils/naturalSpeech';

interface Reel {
  id: string;
  topic: string;
  subject: string;
  duration: string;
  videoTitle: string;
  instructor: string;
  conceptBulletPoints: string[];
  trickExplanation: string;
  likes: number;
  isWeakTopicSpecial?: boolean;
  timestamp?: string;
}

const defaultStarterReels: Reel[] = [
  {
    id: 'r1',
    topic: 'संविधान के नीति निर्देशक तत्व (DPSP)',
    subject: 'भारतीय राजव्यवस्था (Polity)',
    duration: '15s Auto',
    videoTitle: 'DPSP अनुच्छेद 36-51 का 15-सेकंड रिवीजन',
    instructor: 'Hans AI Performance Engine',
    conceptBulletPoints: [
      'आयरलैंड के संविधान से प्रेरित (भाग 4, अनुच्छेद 36 से 51)',
      'अनुच्छेद 40: ग्राम पंचायतों का गठन (गांधीवादी सिद्धांत)',
      'अनुच्छेद 44: समान नागरिक संहिता (Uniform Civil Code)',
      'अनुच्छेद 50: कार्यपालिका से न्यायपालिका का पृथक्करण'
    ],
    trickExplanation: 'आपके हालिया क्विज़ और कमज़ोर विषय विश्लेषण के आधार पर यह रील तैयार की गई है!',
    likes: 1540,
    isWeakTopicSpecial: true,
    timestamp: 'अभी सक्रिय'
  },
  {
    id: 'r2',
    topic: 'आशुलिपि गति बूस्टर (Steno Rules)',
    subject: 'ऋषि प्रणाली आशुलिपि',
    duration: '15s Auto',
    videoTitle: '80 से 100 WPM गति बढ़ाने का जादुई वाक्यांश नियम (Phraseography)',
    instructor: 'Hans Compain Auto-Activity Engine',
    conceptBulletPoints: [
      '"अध्यक्ष महोदय" व "इस बात की आवश्यकता है कि" को बिना पेंसिल उठाए एक साथ जोड़ें।',
      'हल्के और गहरे (Light & Dark) स्ट्रोक में स्पष्ट अंतर रखें।',
      'डिक्टेशन लिखने के तुरंत बाद 5 मिनट अपनी आउटलाइन स्वयं पढ़ें।'
    ],
    trickExplanation: 'आपके आशुलिपि अभ्यास की गतिविधि के आधार पर यह स्मार्ट शॉर्टहैंड रील स्वतः क्रिएट की गई है।',
    likes: 2180,
    isWeakTopicSpecial: false,
    timestamp: 'ऑटो-सिंक'
  },
  {
    id: 'r3',
    topic: 'साइंस व बोर्ड फॉर्मूला (Lab Activity)',
    subject: 'भौतिक विज्ञान (Ohm & Lens)',
    duration: '15s Auto',
    videoTitle: 'ओम का नियम (V = IR) एवं लेंस सूत्र (1/f = 1/v - 1/u) एक नज़र में',
    instructor: 'Hans Compain Auto-Activity Engine',
    conceptBulletPoints: [
      'यदि प्रतिरोध (R) दोगुना किया जाए, तो विद्युत धारा (I) आधी हो जाती है।',
      'उत्तल लेंस की फोकस दूरी धनात्मक (+) और अवतल लेंस की ऋणात्मक (-) होती है।',
      'सरल लोलक का आवर्तकाल लंबाई के वर्गमूल के समानुपाती होता है।'
    ],
    trickExplanation: 'साइंस लैब और टेस्ट की आपकी गतिविधि से यह फॉर्मूला रिवीजन रील ऑटोमैटिक चल रही है।',
    likes: 1290,
    isWeakTopicSpecial: false,
    timestamp: 'ऑटो-सिंक'
  }
];

export const EduReelsView: React.FC = () => {
  const [reels, setReels] = useState<Reel[]>(defaultStarterReels);
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [autoPlayStream, setAutoPlayStream] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [likedReels, setLikedReels] = useState<string[]>([]);
  const [weakTopicsList, setWeakTopicsList] = useState<string[]>([]);

  const loadWeakTopicsAndReels = () => {
    try {
      const mistakes = JSON.parse(localStorage.getItem('hans_compain_mistake_notebook') || '[]');
      if (Array.isArray(mistakes) && mistakes.length > 0) {
        const subjects = Array.from(new Set(mistakes.map((m: any) => m.subject || m.questionText.slice(0, 20))));
        setWeakTopicsList(subjects as string[]);

        // Auto-generate Reels targeting weak topics
        const weakReels: Reel[] = mistakes.slice(0, 3).map((m: any, idx: number) => ({
          id: `weak_reel_${m.id || idx}`,
          topic: `⚡ कमज़ोर विषय स्पेशल: ${m.subject || 'अध्ययन प्रश्न'}`,
          subject: m.examTitle || 'परीक्षा टॉपिक',
          duration: '15s AI Reel',
          videoTitle: m.questionText || 'गलत हुए प्रश्न की तुरंत तैयारी',
          instructor: 'AI Performance Weak Subject Engine',
          conceptBulletPoints: [
            `सही उत्तर: ${m.options?.[m.correctOptionIdx] || 'मुख्य सिद्धांत'}`,
            `व्याख्या: ${m.explanation || 'परीक्षा से पहले इस उत्तर को 2 बार दोहराएं।'}`,
            'नियमित टेस्ट देने से यह कमज़ोर टॉपिक आपकी मजबूत पकड़ में आ जाएगा।'
          ],
          trickExplanation: 'यह रील आपके टेस्ट में गलत हुए प्रश्नों (Mistake Notebook) से आपके कमज़ोर विषयों को ठीक करने के लिए स्वतः बनी है।',
          likes: 240 + idx * 30,
          isWeakTopicSpecial: true,
          timestamp: 'AI Weak Topic Focus'
        }));

        setReels([...weakReels, ...defaultStarterReels]);
        return;
      }
    } catch {
      // ignore
    }
    setReels(defaultStarterReels);
  };

  useEffect(() => {
    loadWeakTopicsAndReels();
    const handler = () => loadWeakTopicsAndReels();
    window.addEventListener('hans_mistake_notebook_updated', handler);
    return () => window.removeEventListener('hans_mistake_notebook_updated', handler);
  }, []);

  // Automatic Reel Stream Timer
  useEffect(() => {
    if (!autoPlayStream) return;
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setCurrentReelIndex(idx => (idx + 1) % reels.length);
          return 0;
        }
        return prev + 2;
      });
    }, 180);
    return () => clearInterval(interval);
  }, [autoPlayStream, reels.length]);

  const currentReel = reels[currentReelIndex] || reels[0];
  const isLiked = likedReels.includes(currentReel.id);

  const toggleSpeech = () => {
    if (isPlayingAudio) {
      stopNaturalSpeech();
      setIsPlayingAudio(false);
    } else {
      const text = `${currentReel.videoTitle}. ${currentReel.conceptBulletPoints.join('. ')}. ${currentReel.trickExplanation}`;
      setIsPlayingAudio(true);
      playNaturalSpeech(
        text,
        () => setIsPlayingAudio(false),
        undefined,
        0.96
      );
    }
  };

  const handleNext = () => {
    if (isPlayingAudio) {
      stopNaturalSpeech();
      setIsPlayingAudio(false);
    }
    setProgress(0);
    setCurrentReelIndex(prev => (prev + 1) % reels.length);
  };

  const handlePrev = () => {
    if (isPlayingAudio) {
      stopNaturalSpeech();
      setIsPlayingAudio(false);
    }
    setProgress(0);
    setCurrentReelIndex(prev => (prev - 1 + reels.length) % reels.length);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4 animate-fade-in pb-12 text-white">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-950/70 via-slate-900 to-indigo-950/60 p-5 rounded-3xl border border-rose-500/30 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold uppercase border border-rose-500/30 mb-1">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>एआई परफॉर्मेंस व कमज़ोर विषय रील्स (AI Weak Subject Reels)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white font-hindi-title">
            एजु-रील्स (Edu Shorts &amp; Weak Topic Recommender)
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            आपके टेस्ट में गलत हुए प्रश्नों और कमज़ोर विषयों (Weak Topics) को पहचानकर एआई द्वारा निर्मित 15-सेकंड रिवीजन रील्स।
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setAutoPlayStream(!autoPlayStream)}
            className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 border cursor-pointer transition-all ${
              autoPlayStream
                ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            {autoPlayStream ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{autoPlayStream ? 'ऑटो-स्क्रॉल चालू' : 'ऑटो-स्क्रॉल बंद'}</span>
          </button>

          <button
            onClick={loadWeakTopicsAndReels}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 hover:text-white cursor-pointer"
            title="कमज़ोर विषय रील्स सिंक करें"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {weakTopicsList.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-200 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>
            <strong>AI कमज़ोर विषय अलर्ट:</strong> आपकी मिस्टेक नोटबुक में पहचान किए गए मुख्य विषय: <strong>{weakTopicsList.slice(0, 3).join(', ')}</strong>
          </span>
        </div>
      )}

      {/* Main Reel Player */}
      <div className="bg-[#091122] border-2 border-rose-500/40 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col justify-between min-h-[470px]">
        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-950">
          <div
            className="h-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Content Box */}
        <div className="p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs font-black text-rose-300 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-rose-400" />
              <span>{currentReel.topic}</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400 font-bold bg-slate-950 px-2.5 py-1 rounded-full border border-slate-850">
              {currentReel.duration} • {currentReelIndex + 1}/{reels.length}
            </span>
          </div>

          <h2 className="text-lg sm:text-2xl font-black text-white leading-snug">
            {currentReel.videoTitle}
          </h2>

          <div className="space-y-2.5 bg-[#040814] p-4 sm:p-5 rounded-2xl border border-slate-850">
            <span className="text-[10px] font-bold uppercase text-cyan-400 block tracking-wider">
              📌 मुख्य अवधारणा व एआई रिवीजन पॉइंट्स:
            </span>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
              {currentReel.conceptBulletPoints.map((pt, pIdx) => (
                <li key={pIdx} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200">
            💡 <strong>स्मार्ट टिप:</strong> {currentReel.trickExplanation}
          </div>
        </div>

        {/* Action Bar */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-850 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (isLiked) setLikedReels(likedReels.filter(i => i !== currentReel.id));
                else setLikedReels([...likedReels, currentReel.id]);
              }}
              className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                isLiked ? 'bg-rose-600 text-white border-rose-400' : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-white' : ''}`} />
              <span>{currentReel.likes + (isLiked ? 1 : 0)}</span>
            </button>

            <button
              onClick={toggleSpeech}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                isPlayingAudio ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-900 border border-slate-800 text-cyan-300'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{isPlayingAudio ? 'रुकें' : 'सुनें 📢'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex items-center gap-1 cursor-pointer shadow-lg"
            >
              <span>अगली रील</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EduReelsView;
