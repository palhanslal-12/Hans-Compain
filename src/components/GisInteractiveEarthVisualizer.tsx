import React, { useState, useEffect, useRef } from 'react';
import {
  Globe, Compass, Layers, RotateCcw, Play, Pause, Sun, Moon,
  Zap, Info, MapPin, Sparkles, Navigation, Flame, Eye, Maximize2,
  Volume2, VolumeX, ArrowRight, ArrowLeft, ShieldCheck, CheckCircle2,
  ChevronRight, RefreshCw, BookOpen, AlertCircle, Presentation,
  Crosshair, Radio, HelpCircle, Check, X, Award
} from 'lucide-react';
import { speakText, stopAllSpeech } from '../utils/speechUtils';
import {
  INDIAN_STATES_DATA,
  PPT_GEOGRAPHY_SLIDES,
  GisStateInfo,
  PptSlide
} from '../data/gisMapData';

interface GisInteractiveEarthVisualizerProps {
  language?: 'hindi' | 'english';
  showToast: (msg: string, type?: 'info' | 'success' | 'warn' | 'error') => void;
  onAskAiDoubt?: (topic: string) => void;
}

export const GisInteractiveEarthVisualizer: React.FC<GisInteractiveEarthVisualizerProps> = ({
  language = 'hindi',
  showToast,
  onAskAiDoubt
}) => {
  const isHindi = language === 'hindi';

  // Active Presentation Mode & Slide
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [activeViewMode, setActiveViewMode] = useState<'ppt_slide' | 'interactive_india' | 'earth_3d'>('ppt_slide');
  
  // Slide auto-play state
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [autoPlayIntervalSec, setAutoPlayIntervalSec] = useState<number>(10);
  
  // Laser Pointer mode
  const [isLaserPointerOn, setIsLaserPointerOn] = useState<boolean>(false);
  const [laserPos, setLaserPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const projectorRef = useRef<HTMLDivElement>(null);

  // Selected State / Feature in India Map
  const [selectedStateId, setSelectedStateId] = useState<string>('JK_LADAKH');
  const [activeGisLayer, setActiveGisLayer] = useState<'all' | 'river' | 'mountain' | 'monsoon' | 'mineral' | 'park'>('all');

  // Earth 3D Animation & Physics Simulation
  const [is3DPlaying, setIs3DPlaying] = useState<boolean>(true);
  const [earthRotationAngle, setEarthRotationAngle] = useState<number>(0);
  const [selectedCoreLayerIndex, setSelectedCoreLayerIndex] = useState<number>(0);
  const [showLatitudeGrid, setShowLatitudeGrid] = useState<boolean>(true);
  const [showAtmosphereGlow, setShowAtmosphereGlow] = useState<boolean>(true);

  // Voice Narrator State
  const [isVoiceSpeaking, setIsVoiceSpeaking] = useState<boolean>(false);

  // Mini-Quiz State for current slide
  const [userSelectedOption, setUserSelectedOption] = useState<number | null>(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState<boolean>(false);

  const activeSlide: PptSlide = PPT_GEOGRAPHY_SLIDES[activeSlideIndex] || PPT_GEOGRAPHY_SLIDES[0];
  const selectedStateData = INDIAN_STATES_DATA.find(s => s.id === selectedStateId) || INDIAN_STATES_DATA[0];

  // Auto-play timer for Slideshow
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isAutoPlaying) {
      timer = setInterval(() => {
        setActiveSlideIndex(prev => {
          const next = (prev + 1) % PPT_GEOGRAPHY_SLIDES.length;
          setUserSelectedOption(null);
          setIsQuizSubmitted(false);
          return next;
        });
      }, autoPlayIntervalSec * 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isAutoPlaying, autoPlayIntervalSec]);

  // 3D Earth continuous smooth rotation
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();
    const animate3D = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;
      if (is3DPlaying) {
        setEarthRotationAngle(prev => (prev + 30 * delta) % 360);
      }
      animId = requestAnimationFrame(animate3D);
    };
    animId = requestAnimationFrame(animate3D);
    return () => cancelAnimationFrame(animId);
  }, [is3DPlaying]);

  // Keyboard navigation for presentation slides
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        goToNextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        goToPrevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSlideIndex]);

  const goToNextSlide = () => {
    if (activeSlideIndex < PPT_GEOGRAPHY_SLIDES.length - 1) {
      setActiveSlideIndex(prev => prev + 1);
      setUserSelectedOption(null);
      setIsQuizSubmitted(false);
      if (isVoiceSpeaking) {
        stopAllSpeech();
        setIsVoiceSpeaking(false);
      }
    } else {
      showToast(isHindi ? '🎉 आपने सभी स्लाइड्स देख ली हैं!' : '🎉 Reached the end of the slide deck!', 'info');
    }
  };

  const goToPrevSlide = () => {
    if (activeSlideIndex > 0) {
      setActiveSlideIndex(prev => prev - 1);
      setUserSelectedOption(null);
      setIsQuizSubmitted(false);
      if (isVoiceSpeaking) {
        stopAllSpeech();
        setIsVoiceSpeaking(false);
      }
    }
  };

  // Laser Pointer Tracker
  const handleProjectorMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isLaserPointerOn || !projectorRef.current) return;
    const rect = projectorRef.current.getBoundingClientRect();
    setLaserPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // Voice narration toggle
  const handleToggleVoice = () => {
    if (isVoiceSpeaking) {
      stopAllSpeech();
      setIsVoiceSpeaking(false);
    } else {
      setIsVoiceSpeaking(true);
      const textToSpeak = isHindi
        ? `${activeSlide.titleHi}. ${activeSlide.subtitleHi}. मुख्य बिंदु: ${activeSlide.keyPointsHi.join('. ')}`
        : `${activeSlide.titleEn}. ${activeSlide.subtitleEn}. Key points: ${activeSlide.keyPointsEn.join('. ')}`;

      speakText(textToSpeak, {
        lang: isHindi ? 'hi-IN' : 'en-US',
        rate: 1.0,
        onEnd: () => {
          setIsVoiceSpeaking(false);
        }
      });
    }
  };

  return (
    <div className="w-full space-y-4 text-slate-100 animate-fade-in select-none">
      {/* 1. TOP PRESENTATION STUDIO TOOLBAR */}
      <div className="p-3 sm:p-5 rounded-3xl bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border-2 border-cyan-500/40 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-600 flex items-center justify-center text-xl shadow-lg shadow-cyan-500/30 shrink-0 ring-2 ring-cyan-400/40">
            📽️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
                <span>{isHindi ? 'GIS मैप व भूगोल पावरपॉइंट स्टूडियो' : 'GIS Map & Geography PPT Studio'}</span>
                <span className="text-[10px] font-black bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 px-2 py-0.5 rounded-full uppercase">
                  PPT Mode 2026
                </span>
              </h1>
            </div>
            <p className="text-xs text-cyan-200/80 font-medium">
              {isHindi
                ? 'पावरपॉइंट प्रेजेंटेशन की तरह मैप व हर भौगोलिक टॉपिक को आसानी से समझें'
                : 'PowerPoint-style interactive animated map slides with voice narration & exam facts'}
            </p>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-2xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveViewMode('ppt_slide')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeViewMode === 'ppt_slide'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Presentation className="w-3.5 h-3.5" />
            <span>{isHindi ? 'स्लाइड प्रेजेंटेशन' : 'PPT Slides'}</span>
          </button>

          <button
            onClick={() => setActiveViewMode('interactive_india')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeViewMode === 'interactive_india'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{isHindi ? 'भारत का GIS मानचित्र' : 'India GIS Map'}</span>
          </button>

          <button
            onClick={() => setActiveViewMode('earth_3d')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeViewMode === 'earth_3d'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{isHindi ? '3D पृथ्वी व ब्रह्मांड' : '3D Earth Lab'}</span>
          </button>
        </div>
      </div>

      {/* 2. PPT PRESENTER CONTROLS & HUD */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2.5 sm:p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Slide Counter & Arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevSlide}
            disabled={activeSlideIndex === 0}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 transition-all cursor-pointer flex items-center gap-1 font-bold"
            title="Previous Slide (Left Arrow)"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{isHindi ? 'पिछली' : 'Prev'}</span>
          </button>

          <div className="px-3 py-1 bg-cyan-950/80 border border-cyan-500/40 rounded-xl text-cyan-300 font-mono font-bold flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span>
              {isHindi ? 'स्लाइड' : 'Slide'} {activeSlide.slideNumber} / {PPT_GEOGRAPHY_SLIDES.length}
            </span>
          </div>

          <button
            onClick={goToNextSlide}
            disabled={activeSlideIndex === PPT_GEOGRAPHY_SLIDES.length - 1}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 transition-all cursor-pointer flex items-center gap-1 font-bold"
            title="Next Slide (Right Arrow / Space)"
          >
            <span className="hidden sm:inline">{isHindi ? 'अगली' : 'Next'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Presentation Tools: Laser, Auto-Play, Voice, Doubt */}
        <div className="flex items-center gap-2">
          {/* Laser Pointer Toggle */}
          <button
            onClick={() => {
              setIsLaserPointerOn(!isLaserPointerOn);
              showToast(
                !isLaserPointerOn
                  ? (isHindi ? '🔴 लेज़र पॉइंटर चालू: माउस से मैप पर इंगित करें' : '🔴 Laser pointer active')
                  : (isHindi ? 'लेज़र पॉइंटर बंद' : 'Laser pointer off'),
                'info'
              );
            }}
            className={`px-2.5 py-1 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isLaserPointerOn
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40 ring-2 ring-rose-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>{isHindi ? 'लेज़र पॉइंटर' : 'Laser'}</span>
          </button>

          {/* Auto-Play Slideshow */}
          <button
            onClick={() => {
              setIsAutoPlaying(!isAutoPlaying);
              showToast(
                !isAutoPlaying
                  ? (isHindi ? `⏯️ ऑटो-स्लाइड शो चालू (${autoPlayIntervalSec}s)` : `⏯️ Auto-play started (${autoPlayIntervalSec}s)`)
                  : (isHindi ? 'ऑटो-स्लाइड शो रुका' : 'Auto-play paused'),
                'info'
              );
            }}
            className={`px-2.5 py-1 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isAutoPlaying
                ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isAutoPlaying ? (isHindi ? 'रोकें' : 'Pause') : (isHindi ? 'ऑटो शो' : 'Auto Play')}</span>
          </button>

          {/* Voice Narrator */}
          <button
            onClick={handleToggleVoice}
            className={`px-2.5 py-1 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isVoiceSpeaking
                ? 'bg-amber-500 text-slate-950 font-black animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            {isVoiceSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{isVoiceSpeaking ? (isHindi ? 'आवाज रोकें' : 'Stop') : (isHindi ? 'शिक्षक आवाज' : 'Narrate')}</span>
          </button>

          {/* Ask AI Doubt Button */}
          {onAskAiDoubt && (
            <button
              onClick={() => onAskAiDoubt(isHindi ? activeSlide.titleHi : activeSlide.titleEn)}
              className="px-2.5 py-1 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">{isHindi ? 'AI से डाउट पूछें' : 'Ask AI Doubt'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. MAIN PPT PRESENTATION PROJECTOR VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* LEFT COLUMN: INTERACTIVE VISUAL MAP PROJECTOR (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div
            ref={projectorRef}
            onMouseMove={handleProjectorMouseMove}
            className="bg-gradient-to-b from-[#060c18] via-[#091224] to-[#060c18] border-2 border-cyan-500/40 rounded-3xl p-3 sm:p-5 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[480px]"
          >
            {/* Background Presentation Grid & Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

            {/* Laser Pointer Dot if enabled */}
            {isLaserPointerOn && (
              <div
                className="absolute w-4 h-4 bg-rose-500 rounded-full pointer-events-none z-50 shadow-[0_0_15px_#f43f5e] animate-ping"
                style={{
                  left: laserPos.x - 8,
                  top: laserPos.y - 8
                }}
              />
            )}

            {/* Projector Top Badge: Slide Subject & GIS Layers */}
            <div className="relative z-10 flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-950 bg-amber-400 px-2 py-0.5 rounded-lg uppercase tracking-wider">
                  PPT Slide {activeSlide.slideNumber}
                </span>
                <span className="text-xs font-bold text-cyan-300">
                  {isHindi ? activeSlide.subtitleHi : activeSlide.subtitleEn}
                </span>
              </div>

              {/* GIS Layer Toggles for Map */}
              {(activeSlide.mapViewType === 'india_map' || activeViewMode === 'interactive_india') && (
                <div className="flex items-center gap-1 bg-slate-950/90 px-2 py-1 rounded-xl border border-slate-800 text-[10px] font-bold">
                  {[
                    { id: 'all', label: isHindi ? 'सभी' : 'All' },
                    { id: 'river', label: isHindi ? '🌊 नदियाँ' : '🌊 Rivers' },
                    { id: 'mountain', label: isHindi ? '🏔️ पर्वत' : '🏔️ Mountains' },
                    { id: 'monsoon', label: isHindi ? '🌧️ मानसून' : '🌧️ Monsoon' },
                    { id: 'mineral', label: isHindi ? '⛏️ खनिज' : '⛏️ Minerals' }
                  ].map(layer => (
                    <button
                      key={layer.id}
                      onClick={() => setActiveGisLayer(layer.id as any)}
                      className={`px-1.5 py-0.5 rounded cursor-pointer transition-all ${
                        activeGisLayer === layer.id
                          ? 'bg-cyan-500 text-slate-950 font-black'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {layer.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* MAIN VISUAL CANVAS AREA */}
            <div className="relative z-10 flex-1 flex items-center justify-center my-auto p-2">
              
              {/* VIEW 1: INDIA HIGH-DEFINITION VECTOR GIS MAP */}
              {(activeSlide.mapViewType === 'india_map' || activeViewMode === 'interactive_india') && (
                <div className="relative w-full max-w-md flex flex-col items-center justify-center">
                  
                  {/* SVG India Map Simulation with Clickable State Clusters & GIS Overlays */}
                  <div className="relative w-72 h-80 sm:w-80 sm:h-92 bg-slate-950/80 rounded-3xl border border-cyan-500/30 p-2 shadow-inner flex items-center justify-center overflow-hidden">
                    
                    <svg viewBox="0 0 400 450" className="w-full h-full">
                      {/* State Regional Polygons */}
                      {/* 1. North - J&K / Ladakh */}
                      <path
                        d="M 170 30 L 230 40 L 220 90 L 170 95 L 145 70 Z"
                        fill={selectedStateId === 'JK_LADAKH' ? '#38bdf8' : '#0369a1'}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        className="cursor-pointer hover:opacity-80 transition-all"
                        onClick={() => setSelectedStateId('JK_LADAKH')}
                      />
                      {/* 2. Himachal & Uttarakhand */}
                      <path
                        d="M 170 95 L 220 90 L 210 130 L 165 125 Z"
                        fill={selectedStateId === 'HP_UK' ? '#60a5fa' : '#1d4ed8'}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        className="cursor-pointer hover:opacity-80 transition-all"
                        onClick={() => setSelectedStateId('HP_UK')}
                      />
                      {/* 3. Punjab & Haryana */}
                      <path
                        d="M 130 100 L 165 125 L 155 160 L 120 140 Z"
                        fill={selectedStateId === 'PUNJAB_HARYANA' ? '#34d399' : '#047857'}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        className="cursor-pointer hover:opacity-80 transition-all"
                        onClick={() => setSelectedStateId('PUNJAB_HARYANA')}
                      />
                      {/* 4. Rajasthan (Thar Desert) */}
                      <path
                        d="M 80 130 L 135 125 L 150 190 L 70 200 Z"
                        fill={selectedStateId === 'RAJASTHAN' ? '#fbbf24' : '#b45309'}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        className="cursor-pointer hover:opacity-80 transition-all"
                        onClick={() => setSelectedStateId('RAJASTHAN')}
                      />
                      {/* 5. UP & Bihar (Gangetic Plain) */}
                      <path
                        d="M 155 160 L 250 140 L 270 200 L 160 210 Z"
                        fill={selectedStateId === 'UP_BIHAR' ? '#4ade80' : '#15803d'}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        className="cursor-pointer hover:opacity-80 transition-all"
                        onClick={() => setSelectedStateId('UP_BIHAR')}
                      />
                      {/* 6. Gujarat */}
                      <path
                        d="M 50 195 L 105 200 L 110 260 L 50 250 Z"
                        fill={selectedStateId === 'GUJARAT' ? '#f59e0b' : '#c2410c'}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        className="cursor-pointer hover:opacity-80 transition-all"
                        onClick={() => setSelectedStateId('GUJARAT')}
                      />
                      {/* 7. MP & Chhattisgarh */}
                      <path
                        d="M 110 200 L 210 205 L 220 280 L 120 270 Z"
                        fill={selectedStateId === 'MP_CG' ? '#fb7185' : '#be123c'}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        className="cursor-pointer hover:opacity-80 transition-all"
                        onClick={() => setSelectedStateId('MP_CG')}
                      />
                      {/* 8. West Bengal & North-East */}
                      <path
                        d="M 270 170 L 370 150 L 360 220 L 270 230 Z"
                        fill={selectedStateId === 'WB_NE' ? '#a78bfa' : '#6d28d9'}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        className="cursor-pointer hover:opacity-80 transition-all"
                        onClick={() => setSelectedStateId('WB_NE')}
                      />
                      {/* 9. Maharashtra & Deccan Trap */}
                      <path
                        d="M 100 260 L 190 270 L 175 330 L 100 320 Z"
                        fill={selectedStateId === 'MAHARASHTRA' ? '#f97316' : '#c2410c'}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        className="cursor-pointer hover:opacity-80 transition-all"
                        onClick={() => setSelectedStateId('MAHARASHTRA')}
                      />
                      {/* 10. Odisha & Jharkhand */}
                      <path
                        d="M 210 240 L 270 230 L 255 310 L 205 290 Z"
                        fill={selectedStateId === 'ODISHA_JHARKHAND' ? '#c084fc' : '#7e22ce'}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        className="cursor-pointer hover:opacity-80 transition-all"
                        onClick={() => setSelectedStateId('ODISHA_JHARKHAND')}
                      />
                      {/* 11. South India (KA, TN, KL, AP, TS) */}
                      <path
                        d="M 115 325 L 210 320 L 180 430 L 130 420 Z"
                        fill={selectedStateId === 'SOUTH_INDIA' ? '#2dd4bf' : '#0f766e'}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        className="cursor-pointer hover:opacity-80 transition-all"
                        onClick={() => setSelectedStateId('SOUTH_INDIA')}
                      />

                      {/* GIS LAYER OVERLAYS */}
                      {/* A. RIVERS (Blue Flow Lines) */}
                      {(activeGisLayer === 'all' || activeGisLayer === 'river') && (
                        <g stroke="#38bdf8" strokeWidth="2.5" fill="none" strokeLinecap="round" className="animate-pulse">
                          {/* Ganga River */}
                          <path d="M 170 120 Q 210 160 270 210" />
                          {/* Yamuna */}
                          <path d="M 160 125 Q 190 165 220 185" strokeDasharray="3,3" />
                          {/* Brahmaputra */}
                          <path d="M 360 160 Q 320 170 280 215" stroke="#67e8f9" />
                          {/* Narmada */}
                          <path d="M 180 230 L 90 235" stroke="#06b6d4" />
                          {/* Godavari */}
                          <path d="M 120 280 Q 180 290 230 310" stroke="#0ea5e9" />
                          {/* Indus */}
                          <path d="M 210 50 Q 170 60 140 100" stroke="#bae6fd" />
                        </g>
                      )}

                      {/* B. MOUNTAIN RANGES (Brown Ridges) */}
                      {(activeGisLayer === 'all' || activeGisLayer === 'mountain') && (
                        <g fill="none" stroke="#f59e0b" strokeWidth="3">
                          {/* Himalayan Arc */}
                          <path d="M 150 70 Q 240 100 350 150" strokeDasharray="4,2" />
                          {/* Aravalli Range */}
                          <path d="M 100 140 L 140 190" stroke="#fbbf24" />
                          {/* Western Ghats */}
                          <path d="M 100 270 L 130 400" stroke="#ea580c" />
                          {/* Eastern Ghats */}
                          <path d="M 230 270 L 170 380" stroke="#d97706" strokeDasharray="5,5" />
                        </g>
                      )}

                      {/* C. MONSOON WINDS (Directional Arrows) */}
                      {(activeGisLayer === 'all' || activeGisLayer === 'monsoon') && (
                        <g stroke="#10b981" strokeWidth="2" fill="#10b981">
                          {/* SW Monsoon Arabian Branch */}
                          <path d="M 40 380 L 100 320" markerEnd="url(#arrow)" />
                          <path d="M 60 310 L 120 250" />
                          {/* Bay of Bengal Branch */}
                          <path d="M 260 380 L 280 250" />
                        </g>
                      )}
                    </svg>

                    {/* Tropic of Cancer Line Overlay */}
                    <div className="absolute top-[48%] inset-x-4 border-b-2 border-dashed border-rose-400/80 flex items-center justify-between text-[8px] font-black text-rose-300">
                      <span>23.5°N Tropic of Cancer (कर्क रेखा)</span>
                      <span>8 States</span>
                    </div>

                  </div>

                  {/* Click Instruction Banner */}
                  <span className="text-[10px] text-cyan-300/90 font-bold bg-slate-950/80 px-3 py-1 rounded-full border border-cyan-500/30 mt-2">
                    {isHindi ? '👆 मानचित्र के किसी भी राज्य/क्षेत्र पर क्लिक करके विवरण देखें' : '👆 Click any region on the map to inspect details'}
                  </span>
                </div>
              )}

              {/* VIEW 2: 3D ROTATABLE EARTH & DAY/NIGHT SIMULATION */}
              {activeSlide.mapViewType === 'earth_3d' && (
                <div className="relative flex flex-col items-center justify-center">
                  {/* Sun Light Source Indicator */}
                  <div className="absolute -left-28 top-1/2 -translate-y-1/2 flex flex-col items-center text-amber-400 pointer-events-none animate-pulse">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-300 to-orange-500 shadow-2xl shadow-amber-400/50 flex items-center justify-center font-black text-[11px] text-slate-950">
                      SUN ☀️
                    </div>
                    <span className="text-[9px] font-bold text-amber-300 mt-1">
                      {isHindi ? 'सूर्य प्रकाश ➔' : 'Solar Rays ➔'}
                    </span>
                  </div>

                  {/* 23.5° Tilted Earth Container */}
                  <div
                    className="relative w-52 h-52 rounded-full transition-transform duration-300"
                    style={{ transform: 'rotate(23.44deg)' }}
                  >
                    {/* Axial Pole Line */}
                    <div className="absolute left-1/2 -top-6 -bottom-6 w-1 bg-gradient-to-b from-amber-400 via-cyan-400 to-emerald-400 -translate-x-1/2 z-30 shadow-lg">
                      <span className="absolute -top-4 -left-6 text-[8px] font-black text-amber-300 bg-slate-950 px-1 rounded border border-amber-400">
                        N. Pole 90°
                      </span>
                      <span className="absolute -bottom-4 -left-6 text-[8px] font-black text-emerald-300 bg-slate-950 px-1 rounded border border-emerald-400">
                        S. Pole 90°
                      </span>
                    </div>

                    {/* Rotating Globe Sphere */}
                    <div
                      className="w-full h-full rounded-full overflow-hidden relative shadow-2xl border-2 border-cyan-400/50"
                      style={{
                        background: 'radial-gradient(circle at 30% 50%, #1e40af 0%, #0c4a6e 50%, #082f49 100%)',
                        boxShadow: showAtmosphereGlow ? '0 0 35px rgba(56, 189, 248, 0.4), inset -20px 0 30px rgba(0,0,0,0.85)' : 'none'
                      }}
                    >
                      {/* Rotating World Landmass Texture */}
                      <div
                        className="absolute inset-0 flex"
                        style={{
                          transform: `translateX(-${(earthRotationAngle / 360) * 100}%)`,
                          width: '200%'
                        }}
                      >
                        {[0, 1].map((copyIdx) => (
                          <svg key={copyIdx} viewBox="0 0 400 200" className="w-1/2 h-full opacity-85">
                            {/* Asia & India */}
                            <path d="M 220 50 Q 250 40 280 60 Q 270 90 250 110 Q 240 130 230 110 Q 210 90 220 50 Z" fill="#10b981" />
                            {/* India Subcontinent */}
                            <path d="M 235 95 L 250 115 L 240 135 L 230 115 Z" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
                            {/* Africa */}
                            <path d="M 160 70 Q 190 75 190 120 Q 170 160 150 130 Q 140 90 160 70 Z" fill="#059669" />
                            {/* Europe */}
                            <path d="M 170 30 Q 210 35 200 65 Q 170 65 170 30 Z" fill="#34d399" />
                            {/* Americas */}
                            <path d="M 60 40 Q 90 50 80 90 Q 60 110 50 80 Z" fill="#10b981" />
                            <path d="M 80 110 Q 110 130 90 180 Q 70 160 70 120 Z" fill="#059669" />
                          </svg>
                        ))}
                      </div>

                      {/* Equator & Latitudinal Grid Lines */}
                      {showLatitudeGrid && (
                        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between py-4">
                          <div className="w-full h-px bg-cyan-400/30" />
                          <div className="w-full h-0.5 bg-amber-400/70 border-b border-amber-300" />
                          <div className="w-full h-px bg-cyan-400/30" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Solstice & Equinox Selector */}
                  <div className="flex items-center gap-1.5 bg-slate-950/90 px-3 py-1.5 rounded-2xl border border-slate-800 mt-3 text-[10px] font-bold">
                    <span className="text-amber-300">☀️ {isHindi ? 'ऋतु स्थिति:' : 'Season State:'}</span>
                    <span className="bg-amber-500/20 text-amber-200 px-2 py-0.5 rounded-lg border border-amber-500/30">
                      21 जून (कर्क संक्रांति)
                    </span>
                    <span className="bg-cyan-500/20 text-cyan-200 px-2 py-0.5 rounded-lg border border-cyan-500/30">
                      22 दिसंबर (मकर संक्रांति)
                    </span>
                  </div>
                </div>
              )}

              {/* VIEW 3: EARTH INTERIOR CONCENTRIC CUT-AWAY */}
              {activeSlide.mapViewType === 'layers_cutaway' && (
                <div className="relative flex flex-col items-center justify-center">
                  <div className="relative w-60 h-60 rounded-full flex items-center justify-center overflow-hidden border-2 border-slate-700 shadow-2xl">
                    
                    {/* Layer 1: Crust */}
                    <div
                      onClick={() => setSelectedCoreLayerIndex(0)}
                      className={`absolute inset-0 rounded-full cursor-pointer transition-all ${
                        selectedCoreLayerIndex === 0 ? 'ring-4 ring-cyan-400' : ''
                      }`}
                      style={{ background: 'radial-gradient(circle, #334155 0%, #1e293b 85%, #0f172a 100%)' }}
                    />

                    {/* Layer 2: Mantle */}
                    <div
                      onClick={() => setSelectedCoreLayerIndex(1)}
                      className={`absolute w-44 h-44 rounded-full cursor-pointer transition-all flex items-center justify-center ${
                        selectedCoreLayerIndex === 1 ? 'ring-4 ring-rose-400' : ''
                      }`}
                      style={{ background: 'radial-gradient(circle, #b91c1c 0%, #c2410c 60%, #ea580c 100%)' }}
                    />

                    {/* Layer 3: Outer Core */}
                    <div
                      onClick={() => setSelectedCoreLayerIndex(2)}
                      className={`absolute w-28 h-28 rounded-full cursor-pointer transition-all flex items-center justify-center animate-pulse ${
                        selectedCoreLayerIndex === 2 ? 'ring-4 ring-amber-400' : ''
                      }`}
                      style={{ background: 'radial-gradient(circle, #fbbf24 0%, #d97706 70%, #b45309 100%)' }}
                    />

                    {/* Layer 4: Inner Core */}
                    <div
                      onClick={() => setSelectedCoreLayerIndex(3)}
                      className={`absolute w-14 h-14 rounded-full cursor-pointer transition-all flex flex-col items-center justify-center text-[8px] font-black text-slate-950 shadow-inner ${
                        selectedCoreLayerIndex === 3 ? 'ring-4 ring-white' : ''
                      }`}
                      style={{ background: '#ffffff', boxShadow: '0 0 25px rgba(255,255,255,0.9)' }}
                    >
                      <span>INNER</span>
                      <span>CORE</span>
                    </div>
                  </div>

                  {/* Layer Selector Chips */}
                  <div className="flex flex-wrap items-center justify-center gap-1.5 bg-slate-950/90 px-3 py-1.5 rounded-2xl border border-slate-800 text-[10px] font-bold mt-3">
                    {[
                      { idx: 0, label: '1. Crust (SIAL/SIMA)' },
                      { idx: 1, label: '2. Mantle (Astheno)' },
                      { idx: 2, label: '3. Outer Core (Liquid)' },
                      { idx: 3, label: '4. Inner Core (Solid NIFE)' }
                    ].map(l => (
                      <button
                        key={l.idx}
                        onClick={() => setSelectedCoreLayerIndex(l.idx)}
                        className={`px-2 py-0.5 rounded cursor-pointer ${
                          selectedCoreLayerIndex === l.idx ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* VIEW 4: ATMOSPHERE STACK INFOGRAPHIC */}
              {activeSlide.mapViewType === 'atmosphere_stack' && (
                <div className="w-full max-w-sm flex flex-col justify-between py-1 space-y-1.5">
                  {[
                    { name: '5. Exosphere (बहिर्मंडल)', range: '600+ km', color: 'border-purple-400 bg-purple-950/40', icon: '🛰️ Satellites' },
                    { name: '4. Thermosphere / Ionosphere (आयनमंडल)', range: '80-600 km', color: 'border-indigo-400 bg-indigo-950/40', icon: '📡 Radio Bounce & Auroras' },
                    { name: '3. Mesosphere (मध्यमंडल)', range: '50-80 km', color: 'border-cyan-400 bg-cyan-950/40', icon: '☄️ Meteorites Burn (-100°C)' },
                    { name: '2. Stratosphere (समतापमंडल)', range: '15-50 km', color: 'border-emerald-400 bg-emerald-950/40', icon: '🛡️ Ozone Layer & Jets' },
                    { name: '1. Troposphere (क्षोभमंडल)', range: '0-15 km', color: 'border-amber-400 bg-amber-950/40', icon: '🌧️ All Weather (Lapse 6.5°C/km)' }
                  ].map((atmo, aIdx) => (
                    <div key={aIdx} className={`p-2 rounded-xl border flex items-center justify-between text-xs ${atmo.color}`}>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{atmo.name}</span>
                        <span className="text-[10px] text-slate-300">({atmo.range})</span>
                      </div>
                      <span className="text-[10px] font-bold text-amber-300 bg-slate-950/80 px-1.5 py-0.5 rounded">
                        {atmo.icon}
                      </span>
                    </div>
                  ))}
                </div>
              )}

            </div>

            {/* PROJECTOR FOOTER: Diagram Badges */}
            <div className="relative z-10 pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                {activeSlide.diagramBadges.map((badge, bIdx) => (
                  <span
                    key={bIdx}
                    className="text-[9px] font-bold text-cyan-200 bg-cyan-950/80 px-2 py-0.5 rounded-lg border border-cyan-500/30"
                  >
                    ✨ {badge}
                  </span>
                ))}
              </div>
              <span className="text-[9px] text-slate-400 font-mono">
                NCERT Class 6-12 & UPSC/SSC Syllabus Aligned
              </span>
            </div>

          </div>

          {/* SELECTED STATE INFO CARD (When in India Map Mode) */}
          {(activeSlide.mapViewType === 'india_map' || activeViewMode === 'interactive_india') && (
            <div className="bg-slate-950 border-2 border-amber-500/40 rounded-3xl p-4 shadow-xl text-left space-y-2.5 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-base">
                    📍
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-amber-200">
                      {isHindi ? selectedStateData.nameHi : selectedStateData.nameEn}
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      {isHindi ? 'राजधानी:' : 'Capital:'} {isHindi ? selectedStateData.capitalHi : selectedStateData.capitalEn} • {selectedStateData.highestPeak}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-black bg-amber-400 text-slate-950 px-2 py-0.5 rounded">
                  GIS Fact
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-bold text-cyan-400 block">🌊 {isHindi ? 'प्रमुख नदियाँ:' : 'Rivers:'}</span>
                  <span className="text-slate-200">{selectedStateData.majorRivers.join(', ')}</span>
                </div>
                <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-bold text-emerald-400 block">🐅 {isHindi ? 'राष्ट्रीय उद्यान:' : 'National Park:'}</span>
                  <span className="text-slate-200">{selectedStateData.famousPark}</span>
                </div>
              </div>

              <div className="p-2.5 bg-gradient-to-r from-amber-950/40 to-slate-900 rounded-xl border border-amber-500/30 text-xs text-amber-200">
                <span className="font-bold text-amber-300">🎯 {isHindi ? 'परीक्षा में बार-बार पूछा गया प्रश्न:' : 'Exam Fact:'} </span>
                <span>{isHindi ? selectedStateData.examFactHi : selectedStateData.examFactEn}</span>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: PPT LECTURE NOTES, BULLET POINTS & INSTANT MINI-QUIZ (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* PPT Slide Notes Card */}
          <div className="bg-slate-950 border-2 border-cyan-500/30 rounded-3xl p-5 shadow-2xl space-y-3.5 text-left">
            
            {/* Header */}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/40">
                  SLIDE NOTE {activeSlide.slideNumber}
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">
                  {activeSlide.category.replace('_', ' ')}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mt-1 leading-snug">
                {isHindi ? activeSlide.titleHi : activeSlide.titleEn}
              </h3>
            </div>

            {/* Bullet Points with Highlighted Formatting */}
            <div className="space-y-2.5">
              {(isHindi ? activeSlide.keyPointsHi : activeSlide.keyPointsEn).map((point, pIdx) => (
                <div key={pIdx} className="p-2.5 bg-slate-900/90 border border-slate-800 rounded-2xl text-xs text-slate-200 leading-relaxed flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                    {pIdx + 1}
                  </div>
                  <div
                    className="flex-1"
                    dangerouslySetInnerHTML={{
                      __html: point.replace(/\*\*(.*?)\*\*/g, '<strong class="text-amber-300">$1</strong>')
                    }}
                  />
                </div>
              ))}
            </div>

          </div>

          {/* INSTANT PPT MINI-QUIZ ON THIS SLIDE */}
          {activeSlide.examQuestions && activeSlide.examQuestions.length > 0 && (
            <div className="bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border-2 border-indigo-500/40 rounded-3xl p-4 shadow-2xl space-y-3 text-left animate-fade-in">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-black text-white">
                    {isHindi ? 'स्लाइड क्विज़: समझ की जांच' : 'Slide Mini-Quiz Check'}
                  </span>
                </div>
                <span className="text-[10px] font-bold bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded">
                  100% Exam Match
                </span>
              </div>

              {activeSlide.examQuestions.map((q, qIdx) => (
                <div key={qIdx} className="space-y-2">
                  <p className="text-xs font-bold text-slate-200">
                    Q. {isHindi ? q.questionHi : q.questionEn}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = userSelectedOption === optIdx;
                      const isCorrect = optIdx === q.correctIndex;
                      let btnStyle = 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300';
                      if (isQuizSubmitted) {
                        if (isCorrect) btnStyle = 'bg-emerald-950 border-emerald-400 text-emerald-200 font-bold';
                        else if (isSelected) btnStyle = 'bg-rose-950 border-rose-500 text-rose-200';
                      } else if (isSelected) {
                        btnStyle = 'bg-indigo-950 border-indigo-400 text-indigo-200 font-bold';
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={isQuizSubmitted}
                          onClick={() => {
                            setUserSelectedOption(optIdx);
                            setIsQuizSubmitted(true);
                            if (optIdx === q.correctIndex) {
                              showToast(isHindi ? '🎉 बिल्कुल सही उत्तर! शाबाश!' : '🎉 Correct answer!', 'success');
                            } else {
                              showToast(isHindi ? '❌ गलत उत्तर! व्याख्या देखें।' : '❌ Incorrect, check explanation.', 'warn');
                            }
                          }}
                          className={`p-2 rounded-xl border text-xs text-left transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {isQuizSubmitted && isCorrect && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                          {isQuizSubmitted && isSelected && !isCorrect && <X className="w-3.5 h-3.5 text-rose-400" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation after submission */}
                  {isQuizSubmitted && (
                    <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1 animate-fade-in">
                      <span className="font-bold text-amber-300 block">💡 {isHindi ? 'NCERT व्याख्या:' : 'Explanation:'}</span>
                      <p>{isHindi ? q.explanationHi : q.explanationEn}</p>
                    </div>
                  )}
                </div>
              ))}

            </div>
          )}

        </div>

      </div>

      {/* 4. PPT SLIDES THUMBNAIL STRIP CAROUSEL (BOTTOM BAR) */}
      <div className="space-y-2 pt-2 text-left">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isHindi ? 'सभी पावरपॉइंट स्लाइड्स (PPT Slide Deck):' : 'All PPT Slides:'}</span>
          </span>
          <span className="text-[10px] text-slate-500">
            {isHindi ? 'किसी भी स्लाइड पर क्लिक करके सीधे उस पर जाएं' : 'Click any slide to jump'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 overflow-x-auto pb-1">
          {PPT_GEOGRAPHY_SLIDES.map((slide, sIdx) => {
            const isActive = activeSlideIndex === sIdx;
            return (
              <button
                key={slide.id}
                onClick={() => {
                  setActiveSlideIndex(sIdx);
                  setUserSelectedOption(null);
                  setIsQuizSubmitted(false);
                  if (isVoiceSpeaking) {
                    stopAllSpeech();
                    setIsVoiceSpeaking(false);
                  }
                }}
                className={`p-2 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[70px] active:scale-95 ${
                  isActive
                    ? 'bg-gradient-to-b from-cyan-950 via-slate-900 to-cyan-950 border-cyan-400 ring-2 ring-cyan-400/50 shadow-lg'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 opacity-75 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-black px-1.5 py-0.2 rounded ${
                    isActive ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    #{slide.slideNumber}
                  </span>
                  <span className="text-xs">
                    {slide.mapViewType === 'earth_3d' ? '🌍' : slide.mapViewType === 'atmosphere_stack' ? '☁️' : '🗺️'}
                  </span>
                </div>
                <div className="text-[10px] font-bold text-slate-200 truncate mt-1">
                  {isHindi ? slide.titleHi.replace(/स्लाइड \d+:\s*/, '') : slide.titleEn.replace(/Slide \d+:\s*/, '')}
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
