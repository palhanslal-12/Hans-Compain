import React, { useState } from 'react';
import {
  FlaskConical,
  Zap,
  Eye,
  Atom,
  Volume2,
  RotateCcw,
  Calculator,
  Sparkles,
  Search,
  ChevronRight,
  ArrowLeft,
  Maximize2,
  Minimize2,
  CheckCircle2,
  Sliders,
  Award,
  Image as ImageIcon,
  Table as TableIcon,
  BookOpen,
  PlusCircle,
  Trash2
} from 'lucide-react';
import { recordStudyActivity } from '../firebase';
import { ScienceLabApparatusVisualizer } from './ScienceLabApparatusVisualizer';
import { SCIENCE_LAB_DETAILS } from '../data/scienceLabDetails';
import { playNaturalSpeech, stopNaturalSpeech } from '../utils/naturalSpeech';
import { InteractivePeriodicTable } from './InteractivePeriodicTable';

export interface ScienceLabConfig {
  id: string;
  number: number;
  category: 'physics' | 'chemistry' | 'biology' | 'geography' | 'mathematics' | 'future';
  categoryLabel: string;
  title: string;
  subtitle: string;
  icon: string;
  badge: string;
  formula: string;
  param1Label: string;
  param1Unit: string;
  param1Min: number;
  param1Max: number;
  param1Default: number;
  param2Label: string;
  param2Unit: string;
  param2Min: number;
  param2Max: number;
  param2Default: number;
  computeResult: (p1: number, p2: number) => {
    primaryLabel: string;
    primaryValue: string;
    secondaryLabel: string;
    secondaryValue: string;
    statusText: string;
  };
  examFacts: string[];
}

export const ALL_28_SCIENCE_LABS: ScienceLabConfig[] = [
  // ===================== PHYSICS (10 LABS) =====================
  {
    id: 'ohm-circuit',
    number: 1,
    category: 'physics',
    categoryLabel: 'भौतिक विज्ञान (Physics)',
    title: 'ओम का नियम एवं विद्युत परिपथ लैब',
    subtitle: 'Ohm’s Law (V = I × R) & Electric Power Simulator',
    icon: '⚡',
    badge: 'CLASS 10 & 12 PHYSICS',
    formula: 'I = V / R   |   P = V × I = V² / R',
    param1Label: 'वोल्टेज (Voltage V)',
    param1Unit: 'V',
    param1Min: 2,
    param1Max: 24,
    param1Default: 12,
    param2Label: 'प्रतिरोध (Resistance R)',
    param2Unit: 'Ω',
    param2Min: 1,
    param2Max: 20,
    param2Default: 4,
    computeResult: (v, r) => {
      const i = v / r;
      const p = v * i;
      return {
        primaryLabel: 'प्रवाहित धारा (Current I)',
        primaryValue: `${i.toFixed(2)} A (एम्पियर)`,
        secondaryLabel: 'विद्युत शक्ति (Power P)',
        secondaryValue: `${p.toFixed(1)} W (वाट)`,
        statusText: i > 4 ? 'उच्च धारा प्रवाह: बल्ब अत्यंत तीव्र चमक रहा है!' : 'सामान्य परिपथ प्रवाह सक्रिय है।'
      };
    },
    examFacts: [
      'नियत ताप पर किसी चालक के सिरों के बीच विभवांतर (V) प्रवाहित धारा (I) के समानुपाती होता है (V = IR)।',
      'अमीटर (Ammeter) को सदैव श्रेणीक्रम (Series) में और वोल्टमीटर को समांतर क्रम (Parallel) में जोड़ा जाता है।',
      'आदर्श अमीटर का प्रतिरोध शून्य (0) और आदर्श वोल्टमीटर का प्रतिरोध अनंत (∞) होता है।'
    ]
  },
  {
    id: 'convex-lens',
    number: 2,
    category: 'physics',
    categoryLabel: 'भौतिक विज्ञान (Physics)',
    title: 'उत्तल एवं अवतल लेंस रे-डायग्राम लैब',
    subtitle: 'Optics Lens Formula (1/v - 1/u = 1/f) & Magnification',
    icon: '🔍',
    badge: 'OPTICS RAY LAB',
    formula: '1/v - 1/u = 1/f   |   m = v / u   |   P = 100 / f(cm)',
    param1Label: 'वस्तु की दूरी (Object Distance |u|)',
    param1Unit: 'cm',
    param1Min: 10,
    param1Max: 80,
    param1Default: 30,
    param2Label: 'फोकस दूरी (Focal Length f)',
    param2Unit: 'cm',
    param2Min: 10,
    param2Max: 40,
    param2Default: 15,
    computeResult: (uAbs, f) => {
      const u = -uAbs;
      const invV = 1 / f + 1 / u;
      const v = Math.abs(invV) < 0.0001 ? 999 : 1 / invV;
      const m = v / u;
      return {
        primaryLabel: 'प्रतिबिंब की दूरी (Image v)',
        primaryValue: Math.abs(v) > 500 ? '∞ (अनंत पर)' : `${v.toFixed(1)} cm`,
        secondaryLabel: 'आवर्धन व क्षमता (m & Power)',
        secondaryValue: `m = ${m.toFixed(2)}x | P = +${(100 / f).toFixed(1)} D`,
        statusText: v > 0 ? 'प्रकृति: वास्तविक तथा उल्टा (Real & Inverted)' : 'प्रकृति: आभासी तथा सीधा (Virtual & Erect)'
      };
    },
    examFacts: [
      'लेंस की क्षमता का SI मात्रक डाइऑप्टर (Dioptre - D) होता है (P = 1/f मीटर में)।',
      'उत्तल लेंस की फोकस दूरी व क्षमता धनात्मक (+) तथा अवतल लेंस की ऋणात्मक (-) होती है।',
      'जब वस्तु 2F पर होती है, तो प्रतिबिंब भी 2F पर वस्तु के बराबर आकार का बनता है।'
    ]
  },
  {
    id: 'spherical-mirror',
    number: 3,
    category: 'physics',
    categoryLabel: 'भौतिक विज्ञान (Physics)',
    title: 'अवतल एवं उत्तल दर्पण परावर्तन लैब',
    subtitle: 'Spherical Mirror Formula (1/v + 1/u = 1/f)',
    icon: '🪞',
    badge: 'MIRROR FORMULA',
    formula: '1/v + 1/u = 1/f   |   f = R / 2   |   m = -v / u',
    param1Label: 'वस्तु की दूरी (|u|)',
    param1Unit: 'cm',
    param1Min: 10,
    param1Max: 80,
    param1Default: 40,
    param2Label: 'वक्रता त्रिज्या (Radius R = 2f)',
    param2Unit: 'cm',
    param2Min: 20,
    param2Max: 60,
    param2Default: 30,
    computeResult: (uAbs, r) => {
      const f = -r / 2;
      const u = -uAbs;
      const invV = 1 / f - 1 / u;
      const v = Math.abs(invV) < 0.0001 ? -999 : 1 / invV;
      const m = -v / u;
      return {
        primaryLabel: 'प्रतिबिंब स्थिति (v)',
        primaryValue: `${v.toFixed(1)} cm (f = ${f} cm)`,
        secondaryLabel: 'रेखीय आवर्धन (m = -v/u)',
        secondaryValue: `${m.toFixed(2)}x`,
        statusText: v < 0 ? 'वास्तविक व उल्टा प्रतिबिंब (दर्पण के सामने)' : 'आभासी व सीधा प्रतिबिंब (दर्पण के पीछे)'
      };
    },
    examFacts: [
      'वाहनों के साइड मिरर (Rear-view Mirror) में उत्तल दर्पण का प्रयोग होता है क्योंकि यह सदैव सीधा और बड़ा दृष्टि क्षेत्र देता है।',
      'दंत चिकित्सक (Dentist), सोलर कुकर और सर्चलाइट में अवतल दर्पण का प्रयोग होता है।'
    ]
  },
  {
    id: 'prism-snell',
    number: 4,
    category: 'physics',
    categoryLabel: 'भौतिक विज्ञान (Physics)',
    title: 'प्रिज्म वर्ण-विक्षेपण एवं स्नेल का नियम लैब',
    subtitle: 'Refraction of Light, Snell’s Law & VIBGYOR Spectrum',
    icon: '🌈',
    badge: 'PRISM & SNELL LAW',
    formula: 'μ = sin(i) / sin(r)   |   δ = (i + e) - A',
    param1Label: 'आपतन कोण (Angle of Incidence i)',
    param1Unit: '°',
    param1Min: 15,
    param1Max: 75,
    param1Default: 45,
    param2Label: 'माध्यम का अपवर्तनांक (Refractive Index μ)',
    param2Unit: '',
    param2Min: 1.2,
    param2Max: 2.4,
    param2Default: 1.5,
    computeResult: (iDeg, mu) => {
      const iRad = (iDeg * Math.PI) / 180;
      const sinR = Math.sin(iRad) / mu;
      const rDeg = (Math.asin(Math.min(1, sinR)) * 180) / Math.PI;
      const speed = (3 / mu).toFixed(2);
      return {
        primaryLabel: 'अपवर्तन कोण (Angle r)',
        primaryValue: `${rDeg.toFixed(1)}°`,
        secondaryLabel: 'माध्यम में प्रकाश की चाल',
        secondaryValue: `${speed} × 10⁸ m/s`,
        statusText: 'बैंगनी रंग का विचलन सर्वाधिक और लाल रंग का विचलन सबसे कम होता है (VIBGYOR)।'
      };
    },
    examFacts: [
      'हीरे (Diamond) का अपवर्तनांक सर्वाधिक (2.42) होता है और क्रांतिक कोण 24.4° होने से पूर्ण आंतरिक परावर्तन होता है।',
      'लाल रंग का तरंगदैर्घ्य (Wavelength) सबसे अधिक होता है, इसलिए खतरे के सिग्नल लाल बनाए जाते हैं।'
    ]
  },
  {
    id: 'pendulum-gravity',
    number: 5,
    category: 'physics',
    categoryLabel: 'भौतिक विज्ञान (Physics)',
    title: 'सरल लोलक एवं आवर्तकाल प्रयोगशाला',
    subtitle: 'Simple Pendulum Time Period (T = 2π√(L/g))',
    icon: '⏱️',
    badge: 'SHM & GRAVITY',
    formula: 'T = 2π √(L / g)   |   f = 1 / T',
    param1Label: 'लोलक की प्रभावी लंबाई (Length L)',
    param1Unit: 'cm',
    param1Min: 20,
    param1Max: 200,
    param1Default: 100,
    param2Label: 'गुरुत्वीय त्वरण (Gravity g)',
    param2Unit: 'm/s²',
    param2Min: 1.6,
    param2Max: 24.8,
    param2Default: 9.8,
    computeResult: (lCm, g) => {
      const lM = lCm / 100;
      const t = 2 * Math.PI * Math.sqrt(lM / g);
      return {
        primaryLabel: 'आवर्तकाल (Time Period T)',
        primaryValue: `${t.toFixed(2)} सेकंड`,
        secondaryLabel: 'आवृत्ति (Frequency f)',
        secondaryValue: `${(1 / t).toFixed(2)} Hz`,
        statusText: 'गर्मियों में लोलक की लंबाई बढ़ने से आवर्तकाल बढ़ जाता है और घड़ी सुस्त (Slow) हो जाती है।'
      };
    },
    examFacts: [
      'सेकंड लोलक (Second’s Pendulum) का आवर्तकाल 2 सेकंड और पृथ्वी पर लंबाई लगभग 99.3 सेमी (1 मीटर) होती है।',
      'लोलक का आवर्तकाल गोलक के द्रव्यमान (Mass) पर निर्भर नहीं करता।'
    ]
  },
  {
    id: 'projectile-motion',
    number: 6,
    category: 'physics',
    categoryLabel: 'भौतिक विज्ञान (Physics)',
    title: 'प्रक्षेप्य गति एवं परास सिमुलेटर लैब',
    subtitle: 'Projectile Motion: Range (R), Max Height (H) & Time of Flight',
    icon: '🚀',
    badge: 'KINEMATICS LAB',
    formula: 'R = (u² sin 2θ) / g   |   H = (u² sin²θ) / 2g',
    param1Label: 'प्रारंभिक वेग (Initial Velocity u)',
    param1Unit: 'm/s',
    param1Min: 10,
    param1Max: 100,
    param1Default: 40,
    param2Label: 'प्रक्षेपण कोण (Launch Angle θ)',
    param2Unit: '°',
    param2Min: 15,
    param2Max: 85,
    param2Default: 45,
    computeResult: (u, theta) => {
      const rad = (theta * Math.PI) / 180;
      const g = 9.8;
      const range = (u * u * Math.sin(2 * rad)) / g;
      const maxH = (u * u * Math.pow(Math.sin(rad), 2)) / (2 * g);
      return {
        primaryLabel: 'क्षैतिज परास (Max Range R)',
        primaryValue: `${range.toFixed(1)} मीटर`,
        secondaryLabel: 'अधिकतम ऊँचाई (Max Height H)',
        secondaryValue: `${maxH.toFixed(1)} मीटर`,
        statusText: theta === 45 ? '45° के कोण पर क्षैतिज परास (Range) अधिकतम होता है!' : 'प्रक्षेप्य का पथ सदैव परवलयाकार (Parabolic) होता है।'
      };
    },
    examFacts: [
      'अधिकतम दूरी तक गेंद या भाला फेंकने के लिए प्रक्षेपण कोण 45° होना चाहिए।',
      'प्रक्षेप्य के उच्चतम बिंदु पर ऊर्ध्वाधर वेग शून्य होता है, केवल क्षैतिज वेग (u cos θ) कार्य करता है।'
    ]
  },
  {
    id: 'newton-friction',
    number: 7,
    category: 'physics',
    categoryLabel: 'भौतिक विज्ञान (Physics)',
    title: 'न्यूटन के गति नियम एवं घर्षण बल लैब',
    subtitle: 'Newton’s Second Law (F = ma), Momentum & Kinetic Energy',
    icon: '⚖️',
    badge: 'LAWS OF MOTION',
    formula: 'F = m × a   |   p = m × v   |   KE = ½ m v²',
    param1Label: 'लगाया गया बल (Applied Force F)',
    param1Unit: 'N',
    param1Min: 10,
    param1Max: 200,
    param1Default: 60,
    param2Label: 'पिंड का द्रव्यमान (Mass m)',
    param2Unit: 'kg',
    param2Min: 2,
    param2Max: 50,
    param2Default: 12,
    computeResult: (f, m) => {
      const a = f / m;
      const v5 = a * 5;
      return {
        primaryLabel: 'उत्पन्न त्वरण (Acceleration a)',
        primaryValue: `${a.toFixed(2)} m/s²`,
        secondaryLabel: '5 सेकंड बाद संवेग (Momentum p)',
        secondaryValue: `${(m * v5).toFixed(0)} kg·m/s`,
        statusText: 'संवेग परिवर्तन की दर लगाए गए असंतुलित बल के समानुपाती होती है।'
      };
    },
    examFacts: [
      'न्यूटन के प्रथम नियम को "जड़त्व का नियम" (Law of Inertia) कहते हैं; इससे बल की परिभाषा मिलती है।',
      'न्यूटन के द्वितीय नियम से बल का सूत्र (F = ma) और तृतीय नियम से क्रिया-प्रतिक्रिया सिद्धांत मिलता है।'
    ]
  },
  {
    id: 'resistor-network',
    number: 8,
    category: 'physics',
    categoryLabel: 'भौतिक विज्ञान (Physics)',
    title: 'श्रेणीक्रम एवं समांतर क्रम प्रतिरोध लैब',
    subtitle: 'Series (R₁ + R₂) vs Parallel (R₁R₂ / (R₁ + R₂)) Combination',
    icon: '🔌',
    badge: 'CIRCUIT NETWORK',
    formula: 'R_series = R₁ + R₂   |   1/R_parallel = 1/R₁ + 1/R₂',
    param1Label: 'प्रथम प्रतिरोध (Resistor R₁)',
    param1Unit: 'Ω',
    param1Min: 2,
    param1Max: 30,
    param1Default: 6,
    param2Label: 'द्वितीय प्रतिरोध (Resistor R₂)',
    param2Unit: 'Ω',
    param2Min: 2,
    param2Max: 30,
    param2Default: 12,
    computeResult: (r1, r2) => {
      const rSeries = r1 + r2;
      const rParallel = (r1 * r2) / (r1 + r2);
      return {
        primaryLabel: 'श्रेणीक्रम तुल्य प्रतिरोध (Rs)',
        primaryValue: `${rSeries.toFixed(1)} Ω`,
        secondaryLabel: 'समांतर क्रम तुल्य प्रतिरोध (Rp)',
        secondaryValue: `${rParallel.toFixed(2)} Ω`,
        statusText: 'घरेलू विद्युत वायरिंग सदैव समांतर क्रम (Parallel) में की जाती है ताकि प्रत्येक उपकरण को समान 220V मिले।'
      };
    },
    examFacts: [
      'फ्यूज तार (Fuse Wire) सीसा और टिन (Pb + Sn) की मिश्रधातु का बना होता है और इसे सदैव श्रेणीक्रम में लगाते हैं।',
      'समांतर क्रम में तुल्य प्रतिरोध सबसे छोटे प्रतिरोध से भी कम प्राप्त होता है।'
    ]
  },
  {
    id: 'faraday-transformer',
    number: 9,
    category: 'physics',
    categoryLabel: 'भौतिक विज्ञान (Physics)',
    title: 'फैराडे विद्युत चुम्बकीय प्रेरण एवं ट्रांसफॉर्मर लैब',
    subtitle: 'Electromagnetic Induction & Step-Up / Step-Down Transformer',
    icon: '🧲',
    badge: 'MAGNETISM & AC',
    formula: 'Vs / Vp = Ns / Np   |   e = -N (dΦ / dt)',
    param1Label: 'प्राथमिक वोल्टेज (Primary Vp)',
    param1Unit: 'V',
    param1Min: 50,
    param1Max: 440,
    param1Default: 220,
    param2Label: 'फेरों का अनुपात (Turns Ratio Ns/Np)',
    param2Unit: 'x',
    param2Min: 0.2,
    param2Max: 5.0,
    param2Default: 2.0,
    computeResult: (vp, ratio) => {
      const vs = vp * ratio;
      return {
        primaryLabel: 'द्वितीयक आउटपुट वोल्टेज (Vs)',
        primaryValue: `${vs.toFixed(0)} V`,
        secondaryLabel: 'ट्रांसफॉर्मर प्रकार (Type)',
        secondaryValue: ratio > 1 ? 'Step-Up (उच्चायी ट्रांसफॉर्मर)' : ratio < 1 ? 'Step-Down (अपचायी)' : '1:1 आइसोलेशन',
        statusText: 'ट्रांसफॉर्मर केवल प्रत्यावर्ती धारा (AC) पर कार्य करता है, दिष्ट धारा (DC) पर नहीं।'
      };
    },
    examFacts: [
      'ट्रांसफॉर्मर अन्योन्य प्रेरण (Mutual Induction) के सिद्धांत पर कार्य करता है और इसकी क्रोड नर्म लोहे (Soft Iron) की बनी होती है।',
      'मोबाइल चार्जर में Step-Down ट्रांसफॉर्मर और रेक्टिफायर (AC से DC बदलने हेतु) लगा होता है।'
    ]
  },
  {
    id: 'sound-wave-echo',
    number: 10,
    category: 'physics',
    categoryLabel: 'भौतिक विज्ञान (Physics)',
    title: 'ध्वनि तरंग, आवृत्ति एवं प्रतिध्वनि (Echo) लैब',
    subtitle: 'Sound Wave Velocity (v = f × λ), Pitch & Echo Distance',
    icon: '🔊',
    badge: 'ACOUSTICS LAB',
    formula: 'v = f × λ   |   Echo Distance d = (v × t) / 2',
    param1Label: 'ध्वनि आवृत्ति (Frequency f)',
    param1Unit: 'Hz',
    param1Min: 20,
    param1Max: 2000,
    param1Default: 440,
    param2Label: 'परावर्तक दीवार की दूरी (Distance d)',
    param2Unit: 'm',
    param2Min: 5,
    param2Max: 100,
    param2Default: 17.2,
    computeResult: (f, d) => {
      const v = 344;
      const lambda = v / f;
      const echoTime = (2 * d) / v;
      return {
        primaryLabel: 'तरंगदैर्घ्य (Wavelength λ)',
        primaryValue: `${lambda.toFixed(2)} मीटर`,
        secondaryLabel: 'प्रतिध्वनि समय (Echo Time)',
        secondaryValue: `${echoTime.toFixed(2)}s (${d >= 17.2 ? 'स्पष्ट प्रतिध्वनि सुनाई देगी' : 'प्रतिध्वनि नहीं'})`,
        statusText: 'स्पष्ट प्रतिध्वनि (Echo) सुनने के लिए न्यूनतम दूरी 17.2 मीटर (समय अंतराल 0.1 सेकंड) होनी चाहिए।'
      };
    },
    examFacts: [
      'मानव कान की श्रव्य परास (Audible Range) 20 Hz से 20,000 Hz (20 kHz) होती है।',
      'ध्वनि अनुदैर्घ्य यांत्रिक तरंग है; यह निर्वात (Vacuum) में गमन नहीं कर सकती और इसकी चाल ठोस (इस्पात) में सर्वाधिक होती है।'
    ]
  },

  // ===================== CHEMISTRY (9 LABS) =====================
  {
    id: 'ph-scale-indicator',
    number: 11,
    category: 'chemistry',
    categoryLabel: 'रसायन विज्ञान (Chemistry)',
    title: 'अम्ल-क्षार pH स्केल एवं सूचक प्रयोगशाला',
    subtitle: 'Acid-Base pH Scale (0–14), Litmus & Universal Indicator',
    icon: '🧪',
    badge: 'ACIDS & BASES',
    formula: 'pH = -log₁₀[H⁺]   |   pH + pOH = 14',
    param1Label: 'विलयन का pH मान (pH Value)',
    param1Unit: 'pH',
    param1Min: 0,
    param1Max: 14,
    param1Default: 7,
    param2Label: 'तापमान (Temperature)',
    param2Unit: '°C',
    param2Min: 15,
    param2Max: 60,
    param2Default: 25,
    computeResult: (ph) => {
      const nature = ph < 7 ? 'अम्लीय (Acidic - नीला लिटमस लाल)' : ph > 7 ? 'क्षारीय (Basic - लाल लिटमस नीला)' : 'उदासीन (Neutral - शुद्ध जल)';
      return {
        primaryLabel: 'विलयन की प्रकृति (Nature)',
        primaryValue: nature,
        secondaryLabel: 'हाइड्रोजन आयन सांद्रता [H⁺]',
        secondaryValue: `10⁻${ph} mol/L (pOH = ${14 - ph})`,
        statusText: ph === 7.4 ? 'मानव रक्त का pH 7.4 (हल्का क्षारीय) होता है।' : ph < 5.6 ? 'अम्लीय वर्षा (pH < 5.6) की श्रेणी!' : 'मानक सूचक परीक्षण सक्रिय।'
      };
    },
    examFacts: [
      'pH स्केल की खोज 1909 में सोरेनसन (Sorensen) ने की थी।',
      'मानव रक्त का pH = 7.4, शुद्ध जल = 7.0, दूध = 6.4, सिरका = 2.4–3.4 और आमाशय रस (HCl) = 1.2 होता है।'
    ]
  },
  {
    id: 'bohr-periodic-118',
    number: 12,
    category: 'chemistry',
    categoryLabel: 'रसायन विज्ञान (Chemistry)',
    title: '118 तत्वों की आवर्त सारणी एवं 3D बोर परमाणु मॉडल',
    subtitle: 'Interactive Bohr Atomic Shells (K, L, M, N) & Electronic Configuration',
    icon: '🧬',
    badge: 'ATOMIC STRUCTURE',
    formula: 'अधिकतम इलेक्ट्रॉन = 2n² (K=2, L=8, M=18, N=32)',
    param1Label: 'परमाणु क्रमांक (Atomic Number Z)',
    param1Unit: 'Z',
    param1Min: 1,
    param1Max: 30,
    param1Default: 11,
    param2Label: 'न्यूट्रॉन संख्या (Neutrons N)',
    param2Unit: 'n⁰',
    param2Min: 0,
    param2Max: 35,
    param2Default: 12,
    computeResult: (z, n) => {
      const names: Record<number, string> = {
        1: 'हाइड्रोजन (H)', 2: 'हीलियम (He)', 6: 'कार्बन (C)', 7: 'नाइट्रोजन (N)', 8: 'ऑक्सीजन (O)',
        11: 'सोडियम (Na)', 12: 'मैग्नीशियम (Mg)', 13: 'एल्युमिनियम (Al)', 17: 'क्लोरीन (Cl)', 20: 'कैल्शियम (Ca)', 26: 'आयरन (Fe)', 29: 'कॉपर (Cu)'
      };
      const k = Math.min(2, z);
      const l = Math.min(8, Math.max(0, z - 2));
      const m = Math.min(18, Math.max(0, z - 10));
      const nShell = Math.max(0, z - 28);
      return {
        primaryLabel: 'तत्व एवं द्रव्यमान संख्या (A = Z + N)',
        primaryValue: `${names[z] || `तत्व Z=${z}`} | A = ${z + n}`,
        secondaryLabel: 'इलेक्ट्रॉनिक विन्यास (K, L, M, N)',
        secondaryValue: [k, l, m, nShell].filter(x => x > 0).join(', '),
        statusText: `नाभिक में ${z} प्रोटॉन और ${n} न्यूट्रॉन स्थित हैं तथा बाह्य कोशों में ${z} इलेक्ट्रॉन परिक्रमा कर रहे हैं।`
      };
    },
    examFacts: [
      'आधुनिक आवर्त सारणी हेनरी मोजले (1913) द्वारा परमाणु क्रमांक (Atomic Number Z) पर आधारित है, जिसमें 18 वर्ग और 7 आवर्त हैं।',
      'प्रोटॉन की खोज रदरफोर्ड/गोल्डस्टीन, इलेक्ट्रॉन की जे.जे. थॉमसन और न्यूट्रॉन की खोज जेम्स चैडविक (1932) ने की।'
    ]
  },
  {
    id: 'acid-base-titration',
    number: 13,
    category: 'chemistry',
    categoryLabel: 'रसायन विज्ञान (Chemistry)',
    title: 'अम्ल-क्षार ब्यूरेट अनुमापन (Titration) लैब',
    subtitle: 'Volumetric Titration (M₁V₁ = M₂V₂) & Phenolphthalein End-Point',
    icon: '💧',
    badge: 'TITRATION LAB',
    formula: 'M₁ × V₁ (Acid) = M₂ × V₂ (Base)',
    param1Label: 'HCl अम्ल की मोलरता (M₁)',
    param1Unit: 'M',
    param1Min: 0.1,
    param1Max: 2.0,
    param1Default: 0.5,
    param2Label: 'NaOH क्षार का आयतन (V₂)',
    param2Unit: 'mL',
    param2Min: 10,
    param2Max: 50,
    param2Default: 25,
    computeResult: (m1, v2) => {
      const v1 = 25;
      const m2 = (m1 * v1) / v2;
      return {
        primaryLabel: 'अज्ञात NaOH की मोलरता (M₂)',
        primaryValue: `${m2.toFixed(3)} M (mol/L)`,
        secondaryLabel: 'उदासीनीकरण बिंदु (End-Point)',
        secondaryValue: `${v2} mL पर हल्का गुलाबी रंग (Phenolphthalein)`,
        statusText: 'HCl + NaOH → NaCl + H₂O + 13.7 kcal ऊष्मा (उदासीनीकरण अभिक्रिया)।'
      };
    },
    examFacts: [
      'फिनोल्फथैलिन सूचक अम्लीय माध्यम में रंगहीन और क्षारीय माध्यम में गुलाबी (Pink) रंग देता है।',
      'मिथाइल ऑरेंज अम्लीय माध्यम में लाल और क्षारीय माध्यम में पीला रंग देता है।'
    ]
  },
  {
    id: 'ideal-gas-laws',
    number: 14,
    category: 'chemistry',
    categoryLabel: 'रसायन विज्ञान (Chemistry)',
    title: 'बॉयल, चार्ल्स एवं आदर्श गैस नियम लैब',
    subtitle: 'Ideal Gas Equation (PV = nRT) & Piston-Cylinder Simulator',
    icon: '🎈',
    badge: 'GAS LAWS LAB',
    formula: 'P × V = n × R × T   |   P₁V₁ / T₁ = P₂V₂ / T₂',
    param1Label: 'गैस का तापमान (Temperature T)',
    param1Unit: 'K',
    param1Min: 200,
    param1Max: 600,
    param1Default: 300,
    param2Label: 'सिलेंडर का आयतन (Volume V)',
    param2Unit: 'L',
    param2Min: 2,
    param2Max: 50,
    param2Default: 10,
    computeResult: (t, v) => {
      const r = 0.0821;
      const p = (1 * r * t) / v;
      return {
        primaryLabel: 'गैस का दाब (Pressure P)',
        primaryValue: `${p.toFixed(2)} atm`,
        secondaryLabel: 'अणुओं की गतिज ऊर्जा',
        secondaryValue: `${((1.5 * 8.314 * t) / 1000).toFixed(2)} kJ/mol`,
        statusText: 'नियत ताप पर आयतन घटाने से गैस का दाब बढ़ता है (बॉयल का नियम: P ∝ 1/V)।'
      };
    },
    examFacts: [
      'परम शून्य ताप (Absolute Zero) 0 K या -273.15°C होता है, जिस पर गैसों की आणविक गति शून्य हो जाती है।',
      'STP पर किसी भी आदर्श गैस के 1 मोल का आयतन 22.4 लीटर होता है।'
    ]
  },
  {
    id: 'electrolysis-cell',
    number: 15,
    category: 'chemistry',
    categoryLabel: 'रसायन विज्ञान (Chemistry)',
    title: 'जल का विद्युत अपघटन एवं गैल्वेनिक सेल लैब',
    subtitle: 'Electrolysis of Water (2H₂O → 2H₂ + O₂) & Faraday’s Law',
    icon: '🔋',
    badge: 'ELECTROCHEMISTRY',
    formula: 'W = Z × I × t   |   कैथोड पर H₂ : एनोड पर O₂ = 2 : 1',
    param1Label: 'विद्युत धारा (Current I)',
    param1Unit: 'A',
    param1Min: 1,
    param1Max: 20,
    param1Default: 5,
    param2Label: 'प्रवाह समय (Time t)',
    param2Unit: 'min',
    param2Min: 5,
    param2Max: 60,
    param2Default: 20,
    computeResult: (i, tMin) => {
      const q = i * tMin * 60;
      const h2Vol = (q / 96500) * 11.2;
      return {
        primaryLabel: 'कुल प्रवाहित आवेश (Q = I×t)',
        primaryValue: `${q} कूलॉम (C)`,
        secondaryLabel: 'मुक्त गैस आयतन (STP पर)',
        secondaryValue: `H₂ = ${(h2Vol * 1000).toFixed(0)} mL | O₂ = ${(h2Vol * 500).toFixed(0)} mL`,
        statusText: 'कैथोड (-) पर हाइड्रोजन गैस का आयतन एनोड (+) पर ऑक्सीजन से ठीक दोगुना (2:1) होता है।'
      };
    },
    examFacts: [
      '1 फैराडे (1 F) = 96,500 कूलॉम/मोल आवेश होता है।',
      'विद्युत लेपन (Electroplating) में जिस धातु की परत चढ़ानी होती है उसे एनोड और वस्तु को कैथोड बनाया जाता है।'
    ]
  },
  {
    id: 'thermo-reactions',
    number: 16,
    category: 'chemistry',
    categoryLabel: 'रसायन विज्ञान (Chemistry)',
    title: 'ऊष्माक्षेपी एवं ऊष्माशोषी अभिक्रिया लैब',
    subtitle: 'Exothermic vs Endothermic Enthalpy (ΔH) & Catalyst Action',
    icon: '🔥',
    badge: 'THERMOCHEMISTRY',
    formula: 'ΔH = H_products - H_reactants',
    param1Label: 'अभिकारक ऊर्जा (Reactant Energy)',
    param1Unit: 'kJ',
    param1Min: 50,
    param1Max: 300,
    param1Default: 200,
    param2Label: 'उत्पाद ऊर्जा (Product Energy)',
    param2Unit: 'kJ',
    param2Min: 50,
    param2Max: 300,
    param2Default: 120,
    computeResult: (er, ep) => {
      const dh = ep - er;
      return {
        primaryLabel: 'एंथैल्पी परिवर्तन (ΔH)',
        primaryValue: `${dh > 0 ? '+' : ''}${dh} kJ/mol`,
        secondaryLabel: 'अभिक्रिया प्रकार',
        secondaryValue: dh < 0 ? 'ऊष्माक्षेपी (Exothermic - ऊष्मा मुक्त)' : 'ऊष्माशोषी (Endothermic - ऊष्मा अवशोषित)',
        statusText: dh < 0 ? 'चूने में पानी मिलाना (CaO + H₂O → Ca(OH)₂) और श्वसन ऊष्माक्षेपी अभिक्रियाएं हैं।' : 'प्रकाश संश्लेषण और बर्फ का पिघलना ऊष्माशोषी प्रक्रियाएं हैं।'
      };
    },
    examFacts: [
      'उत्प्रेरक (Catalyst) अभिक्रिया की सक्रियण ऊर्जा (Activation Energy) को कम करके दर बढ़ा देता है।',
      'अमोनिया निर्माण की हैबर विधि (N₂ + 3H₂ → 2NH₃) में लोहे (Fe) का चूर्ण उत्प्रेरक के रूप में प्रयुक्त होता है।'
    ]
  },
  {
    id: 'organic-hydrocarbons',
    number: 17,
    category: 'chemistry',
    categoryLabel: 'रसायन विज्ञान (Chemistry)',
    title: 'कार्बनिक रसायन एवं हाइड्रोकार्बन संरचना लैब',
    subtitle: 'Alkane (CnH2n+2), Alkene (CnH2n) & Alkyne (CnH2n-2) Builder',
    icon: '⚗️',
    badge: 'ORGANIC CHEMISTRY',
    formula: 'Alkane: CₙH₂ₙ₊₂  |  Alkene: CₙH₂ₙ  |  Alkyne: CₙH₂ₙ₋₂',
    param1Label: 'कार्बन परमाणुओं की संख्या (n)',
    param1Unit: 'C',
    param1Min: 1,
    param1Max: 10,
    param1Default: 2,
    param2Label: 'बंध क्रम (1=एकल, 2=द्विबंध, 3=त्रिबंध)',
    param2Unit: 'Bond',
    param2Min: 1,
    param2Max: 3,
    param2Default: 1,
    computeResult: (n, bond) => {
      const prefixes = ['', 'Meth', 'Eth', 'Prop', 'But', 'Pent', 'Hex', 'Hept', 'Oct', 'Non', 'Dec'];
      const b = Math.round(bond);
      const effN = b > 1 && n === 1 ? 2 : n;
      const hCount = b === 1 ? 2 * effN + 2 : b === 2 ? 2 * effN : 2 * effN - 2;
      const suffix = b === 1 ? 'ane (संतृप्त)' : b === 2 ? 'ene (असंतृप्त द्विबंध)' : 'yne (असंतृप्त त्रिबंध)';
      return {
        primaryLabel: 'आणविक सूत्र (Molecular Formula)',
        primaryValue: `C${effN}H${hCount}`,
        secondaryLabel: 'IUPAC नाम एवं श्रेणी',
        secondaryValue: `${prefixes[effN]}${suffix}`,
        statusText: b === 1 ? 'एल्केन को पैराफिन (कम क्रियाशील) कहा जाता है; LPG में ब्यूटेन व प्रोपेन होता है।' : 'असंतृप्त हाइड्रोकार्बन योगात्मक अभिक्रिया दिखाते हैं।'
      };
    },
    examFacts: [
      'फलों को कृत्रिम रूप से पकाने के लिए एथिलीन (C₂H₄) और एसिटिलीन (C₂H₂) गैस का उपयोग होता है।',
      'मार्श गैस या बायोगैस का मुख्य घटक मीथेन (CH₄) होता है।'
    ]
  },
  {
    id: 'molarity-solution',
    number: 18,
    category: 'chemistry',
    categoryLabel: 'रसायन विज्ञान (Chemistry)',
    title: 'विलयन की मोलरता एवं सांद्रता प्रयोगशाला',
    subtitle: 'Solution Molarity (M = n / V) & Concentration Calculator',
    icon: '🔬',
    badge: 'SOLUTIONS LAB',
    formula: 'M = (विलेय के मोल n) / (विलयन का आयतन लीटर में)',
    param1Label: 'विलेय के मोल (Moles n)',
    param1Unit: 'mol',
    param1Min: 0.5,
    param1Max: 10,
    param1Default: 2,
    param2Label: 'विलयन का आयतन (Volume V)',
    param2Unit: 'L',
    param2Min: 0.5,
    param2Max: 10,
    param2Default: 1,
    computeResult: (n, v) => {
      const m = n / v;
      return {
        primaryLabel: 'विलयन की मोलरता (Molarity M)',
        primaryValue: `${m.toFixed(2)} M (mol/L)`,
        secondaryLabel: 'NaCl ग्राम मात्रा (यदि विलेय NaCl हो)',
        secondaryValue: `${(n * 58.5).toFixed(1)} ग्राम`,
        statusText: 'तापमान बढ़ाने पर विलयन का आयतन बढ़ता है, इसलिए मोलरता ताप पर निर्भर करती है जबकि मोललता नहीं।'
      };
    },
    examFacts: [
      'शुद्ध जल की मोलरता 55.55 M (1000 / 18) होती है।',
      '1 मोल पदार्थ में कणों की संख्या आवोगाद्रो संख्या (6.022 × 10²³) के बराबर होती है।'
    ]
  },
  {
    id: 'radioactivity-halflife',
    number: 19,
    category: 'chemistry',
    categoryLabel: 'रसायन विज्ञान (Chemistry)',
    title: 'रेडियोधर्मिता एवं अर्ध-आयु काल (Half-Life) लैब',
    subtitle: 'Radioactive Decay (N = N₀ (½)ⁿ) & Alpha, Beta, Gamma Rays',
    icon: '☢️',
    badge: 'NUCLEAR LAB',
    formula: 'N = N₀ × (1/2)ⁿ   |   λ = 0.693 / T₁/₂',
    param1Label: 'प्रारंभिक मात्रा (Initial Mass N₀)',
    param1Unit: 'g',
    param1Min: 16,
    param1Max: 256,
    param1Default: 100,
    param2Label: 'बीते हुए अर्ध-आयु काल (Number of Half-Lives n)',
    param2Unit: 'T½',
    param2Min: 1,
    param2Max: 6,
    param2Default: 2,
    computeResult: (n0, halfLives) => {
      const rem = n0 / Math.pow(2, halfLives);
      return {
        primaryLabel: 'शेष रेडियोधर्मी मात्रा (Remaining N)',
        primaryValue: `${rem.toFixed(2)} ग्राम`,
        secondaryLabel: 'विघटित प्रतिशत (Decayed %)',
        secondaryValue: `${(((n0 - rem) / n0) * 100).toFixed(1)}%`,
        statusText: 'गामा (γ) किरणों की भेदन क्षमता सर्वाधिक और अल्फा (α) कणों की आयनन क्षमता सर्वाधिक होती है।'
      };
    },
    examFacts: [
      'रेडियोधर्मिता की खोज हेनरी बेक्वेरेल ने की और रेडियम की खोज मैडम क्यूरी ने की।',
      'जीवाश्मों की आयु कार्बन-14 (C-14, अर्ध-आयु 5730 वर्ष) और पृथ्वी/चट्टानों की आयु यूरेनियम डेटिंग से ज्ञात की जाती है।'
    ]
  },

  // ===================== BIOLOGY & SPACE (9 LABS) =====================
  {
    id: 'photosynthesis-rate',
    number: 20,
    category: 'biology',
    categoryLabel: 'जीव विज्ञान (Biology)',
    title: 'प्रकाश संश्लेषण एवं ऑक्सीजन बुलबुला लैब',
    subtitle: 'Photosynthesis Rate (6CO₂ + 12H₂O → C₆H₁₂O₆ + 6O₂ + 6H₂O)',
    icon: '🌿',
    badge: 'BOTANY LAB',
    formula: '6CO₂ + 12H₂O —(सूर्य का प्रकाश / क्लोरोफिल)→ C₆H₁₂O₆ + 6O₂↑',
    param1Label: 'प्रकाश की तीव्रता (Light Intensity)',
    param1Unit: '%',
    param1Min: 10,
    param1Max: 100,
    param1Default: 70,
    param2Label: 'CO₂ सांद्रता स्तर (CO₂ Level)',
    param2Unit: 'ppm',
    param2Min: 100,
    param2Max: 800,
    param2Default: 400,
    computeResult: (light, co2) => {
      const bubbles = Math.round((light * co2) / 1000);
      return {
        primaryLabel: 'ऑक्सीजन बुलबुले दर (O₂ Bubbles)',
        primaryValue: `${bubbles} बुलबुले / मिनट`,
        secondaryLabel: 'ग्लूकोज संश्लेषण दक्षता',
        secondaryValue: `${Math.min(100, Math.round((light + co2 / 8) / 2))}%`,
        statusText: 'प्रकाश संश्लेषण में निकलने वाली ऑक्सीजन (O₂) जल (H₂O) के प्रकाशिक अपघटन से प्राप्त होती है।'
      };
    },
    examFacts: [
      'क्लोरोफिल (पर्णहरित) के केंद्र में मैग्नीशियम (Mg²⁺) धातु आयन पाया जाता है।',
      'प्रकाश संश्लेषण की दर लाल प्रकाश में सर्वाधिक और हरे प्रकाश में शून्य/न्यूनतम होती है।'
    ]
  },
  {
    id: 'heart-ecg-bp',
    number: 21,
    category: 'biology',
    categoryLabel: 'जीव विज्ञान (Biology)',
    title: 'मानव हृदय स्पंदन, रक्तचाप एवं ECG सिमुलेटर',
    subtitle: 'Cardiac Output (HR × Stroke Volume), Blood Pressure & ECG Wave',
    icon: '❤️',
    badge: 'HUMAN PHYSIOLOGY',
    formula: 'Cardiac Output = Heart Rate (72 BPM) × Stroke Volume (70 mL) ≈ 5 L/min',
    param1Label: 'हृदय स्पंदन दर (Heart Rate)',
    param1Unit: 'BPM',
    param1Min: 60,
    param1Max: 160,
    param1Default: 72,
    param2Label: 'स्ट्रोक आयतन (Stroke Volume)',
    param2Unit: 'mL',
    param2Min: 50,
    param2Max: 110,
    param2Default: 70,
    computeResult: (hr, sv) => {
      const co = (hr * sv) / 1000;
      const sys = Math.round(120 + (hr - 72) * 0.4);
      const dia = Math.round(80 + (hr - 72) * 0.2);
      return {
        primaryLabel: 'कार्डियक आउटपुट (रक्त पंप/मिनट)',
        primaryValue: `${co.toFixed(2)} लीटर / मिनट`,
        secondaryLabel: 'अनुमानित रक्तचाप (BP)',
        secondaryValue: `${sys} / ${dia} mmHg`,
        statusText: 'SA Node (सानु-अलिंद पर्व) को हृदय का प्राकृतिक पेसमेकर कहा जाता है।'
      };
    },
    examFacts: [
      'मानव हृदय में 4 कोष्ठक (2 आलिंद, 2 निलय) होते हैं और सामान्य रक्तचाप 120/80 mmHg (स्फिग्मोमैनोमीटर द्वारा मापित) होता है।',
      'फुफ्फुस धमनी (Pulmonary Artery) एकमात्र धमनी है जिसमें अशुद्ध (विऑक्सीजनित) रक्त बहता है।'
    ]
  },
  {
    id: 'blood-group-typing',
    number: 22,
    category: 'biology',
    categoryLabel: 'जीव विज्ञान (Biology)',
    title: 'ABO एवं Rh रक्त समूह मिलान प्रयोगशाला',
    subtitle: 'Blood Group Compatibility, Antigens, Antibodies & Transfusion',
    icon: '🩸',
    badge: 'HEMATOLOGY LAB',
    formula: 'सर्वदाता (Universal Donor): O⁻   |   सर्वग्राही (Universal Recipient): AB⁺',
    param1Label: 'रक्त समूह कोड (1=A, 2=B, 3=AB, 4=O)',
    param1Unit: 'Type',
    param1Min: 1,
    param1Max: 4,
    param1Default: 4,
    param2Label: 'Rh फैक्टर (1 = Rh Positive +, 0 = Rh Negative -)',
    param2Unit: 'Rh',
    param2Min: 0,
    param2Max: 1,
    param2Default: 0,
    computeResult: (code, rh) => {
      const idx = Math.round(code);
      const isPos = Math.round(rh) === 1;
      const types: Record<number, { name: string; antigen: string; antibody: string; canDonate: string }> = {
        1: { name: 'A', antigen: 'A एंटीजन', antibody: 'b एंटीबॉडी', canDonate: 'A, AB' },
        2: { name: 'B', antigen: 'B एंटीजन', antibody: 'a एंटीबॉडी', canDonate: 'B, AB' },
        3: { name: 'AB', antigen: 'A व B दोनों एंटीजन', antibody: 'कोई एंटीबॉडी नहीं (सर्वग्राही)', canDonate: 'केवल AB' },
        4: { name: 'O', antigen: 'कोई एंटीजन नहीं (सर्वदाता)', antibody: 'a व b दोनों एंटीबॉडी', canDonate: 'A, B, AB, O (सभी को)' }
      };
      const t = types[idx] || types[4];
      return {
        primaryLabel: `चयनित रक्त समूह: ${t.name}${isPos ? '⁺' : '⁻'}`,
        primaryValue: `RBC पर: ${t.antigen}`,
        secondaryLabel: 'प्लाज्मा में एंटीबॉडी व दान पात्रता',
        secondaryValue: `${t.antibody} | दे सकता है: ${t.canDonate}`,
        statusText: idx === 4 && !isPos ? 'O⁻ (O Negative) वास्तविक सर्वदाता है क्योंकि इसमें A, B या Rh कोई एंटीजन नहीं होता!' : 'रक्त आधान से पूर्व क्रॉस-मैचिंग अनिवार्य है।'
      };
    },
    examFacts: [
      'ABO रक्त समूह की खोज कार्ल लैंडस्टीनर (1900) ने की तथा Rh फैक्टर की खोज लैंडस्टीनर व वीनर ने रीसस बंदर में की।',
      'रक्त का थक्का जमने में विटामिन K, फाइब्रिनोजन प्रोटीन, थ्रोम्बिन और कैल्शियम (Ca²⁺) आयन सहायक होते हैं।'
    ]
  },
  {
    id: 'mendel-genetics',
    number: 23,
    category: 'biology',
    categoryLabel: 'जीव विज्ञान (Biology)',
    title: 'मेंडल आनुवंशिकता एवं पनेट स्क्वायर लैब',
    subtitle: 'Mendel’s Monohybrid (3:1) & Dihybrid (9:3:3:1) Cross Simulator',
    icon: '🧬',
    badge: 'GENETICS LAB',
    formula: 'एकसंकर फीनोटाइप = 3 : 1   |   जीनोटाइप = 1 : 2 : 1 (TT : Tt : tt)',
    param1Label: 'क्रॉस प्रकार (1 = Tt × Tt, 2 = Tt × tt, 3 = Dihybrid)',
    param1Unit: 'Cross',
    param1Min: 1,
    param1Max: 3,
    param1Default: 1,
    param2Label: 'कुल संतति पौधों की संख्या (Total Offspring)',
    param2Unit: 'पौधे',
    param2Min: 40,
    param2Max: 400,
    param2Default: 160,
    computeResult: (crossType, total) => {
      const c = Math.round(crossType);
      if (c === 1) {
        return {
          primaryLabel: 'फीनोटाइप अनुपात (लंबे : बौने = 3 : 1)',
          primaryValue: `${Math.round(total * 0.75)} लंबे : ${Math.round(total * 0.25)} बौने पौधे`,
          secondaryLabel: 'जीनोटाइप अनुपात (1 TT : 2 Tt : 1 tt)',
          secondaryValue: `${Math.round(total * 0.25)} TT : ${Math.round(total * 0.5)} Tt : ${Math.round(total * 0.25)} tt`,
          statusText: 'प्रभाविता का नियम एवं पृथक्करण का नियम (Law of Segregation) सत्यापित।'
        };
      }
      if (c === 2) {
        return {
          primaryLabel: 'परीक्षण संकरण (Test Cross Tt × tt = 1 : 1)',
          primaryValue: `${Math.round(total * 0.5)} लंबे (Tt) : ${Math.round(total * 0.5)} बौने (tt)`,
          secondaryLabel: 'जीनोटाइप अनुपात',
          secondaryValue: '1 : 1 (50% विषमयुग्मजी, 50% समयुग्मजी अप्रभावी)',
          statusText: 'अज्ञात प्रभावी फीनोटाइप के जीनोटाइप की जांच के लिए अप्रभावी जनक (tt) से संकरण को Test Cross कहते हैं।'
        };
      }
      return {
        primaryLabel: 'द्विसंकर क्रॉस अनुपात (Dihybrid 9 : 3 : 3 : 1)',
        primaryValue: `${Math.round((total * 9) / 16)} गोल-पीले : ${Math.round((total * 1) / 16)} झुर्रीदार-हरे`,
        secondaryLabel: 'स्वतंत्र अपव्यूहन का नियम',
        secondaryValue: 'जीनोटाइप अनुपात = 1:2:1:2:4:2:1:2:1',
        statusText: 'मेंडल ने अपने प्रयोग उद्यान मटर (Pisum sativum) के 7 विपर्यासी लक्षणों पर किए थे।'
      };
    },
    examFacts: [
      'ग्रेगर जॉन मेंडल को "आनुवंशिकी का जनक" (Father of Genetics) कहा जाता है; "जीन" (Gene) शब्द जोहानसन ने दिया।',
      'DNA की द्विकुंडली (Double Helix) संरचना वाटसन और क्रिक (1953) ने प्रस्तुत की।'
    ]
  },
  {
    id: 'microscope-cell',
    number: 24,
    category: 'biology',
    categoryLabel: 'जीव विज्ञान (Biology)',
    title: 'संयुक्त सूक्ष्मदर्शी एवं कोशिकांग ज़ूम लैब',
    subtitle: 'Compound Microscope Magnification (M = m_o × m_e) & Cell Organelles',
    icon: '🔬',
    badge: 'CYTOLOGY LAB',
    formula: 'कुल आवर्धन (Total Magnification) = अभिदृश्यक लेंस (Objective) × नेत्रिका (Eyepiece)',
    param1Label: 'अभिदृश्यक लेंस आवर्धन (Objective Lens)',
    param1Unit: 'x',
    param1Min: 10,
    param1Max: 100,
    param1Default: 40,
    param2Label: 'नेत्रिका लेंस आवर्धन (Eyepiece Lens)',
    param2Unit: 'x',
    param2Min: 5,
    param2Max: 20,
    param2Default: 10,
    computeResult: (obj, eye) => {
      const totalMag = obj * eye;
      return {
        primaryLabel: 'कुल सूक्ष्मदर्शी आवर्धन (Total Zoom)',
        primaryValue: `${totalMag}x आवर्धन`,
        secondaryLabel: 'दृश्यमान कोशिकांग (Visible Organelles)',
        secondaryValue: totalMag >= 400 ? 'माइटोकॉन्ड्रिया, हरितलवक, केंद्रक व क्रोमेटिन स्पष्ट' : 'कोशिका भित्ति, झिल्ली व केंद्रक दृश्यमान',
        statusText: 'माइटोकॉन्ड्रिया को कोशिका का ऊर्जा गृह (Powerhouse - ATP) और राइबोसोम को प्रोटीन फैक्ट्री कहते हैं।'
      };
    },
    examFacts: [
      'कोशिका की खोज रॉबर्ट हुक (1665) ने और जीवित कोशिका की खोज ल्यूवेनहॉक ने की।',
      'केंद्रक के अतिरिक्त केवल माइटोकॉन्ड्रिया और हरितलवक (Chloroplast) में अपना स्वयं का DNA और 70S राइबोसोम होता है।'
    ]
  },
  {
    id: 'respiration-lungs',
    number: 25,
    category: 'biology',
    categoryLabel: 'जीव विज्ञान (Biology)',
    title: 'मानव श्वसन तंत्र एवं फेफड़े आयतन लैब',
    subtitle: 'Pulmonary Ventilation, Tidal Volume (500 mL) & Alveoli Gas Exchange',
    icon: '🫁',
    badge: 'RESPIRATORY LAB',
    formula: 'Minute Respiratory Volume = श्वसन दर (12–16/min) × Tidal Volume (500 mL)',
    param1Label: 'श्वसन दर (Breaths per Minute)',
    param1Unit: '/min',
    param1Min: 10,
    param1Max: 40,
    param1Default: 15,
    param2Label: 'ज्वारीय आयतन (Tidal Volume TV)',
    param2Unit: 'mL',
    param2Min: 300,
    param2Max: 1200,
    param2Default: 500,
    computeResult: (rate, tv) => {
      const mrv = (rate * tv) / 1000;
      return {
        primaryLabel: 'मिनट श्वसन आयतन (Minute Volume)',
        primaryValue: `${mrv.toFixed(1)} लीटर / मिनट`,
        secondaryLabel: 'कोशिकीय ATP उत्पादन (वायवीय श्वसन)',
        secondaryValue: '1 ग्लूकोज = 38 ATP ऊर्जा',
        statusText: 'कूपिकाओं (Alveoli) में विसरण द्वारा O₂ हीमोग्लोबिन से जुड़कर ऑक्सीहीमोग्लोबिन बनाती है।'
      };
    },
    examFacts: [
      'सामान्य वयस्क की श्वसन दर 12 से 16 बार प्रति मिनट और ज्वारीय आयतन (Tidal Volume) 500 mL होता है।',
      'मांसपेशियों में अवायवीय श्वसन से लैक्टिक अम्ल (Lactic Acid) जमने के कारण थकान और ऐंठन होती है।'
    ]
  },
  {
    id: 'osmosis-cell',
    number: 26,
    category: 'biology',
    categoryLabel: 'जीव विज्ञान (Biology)',
    title: 'परासरण एवं विसरण (Osmosis in RBC) लैब',
    subtitle: 'Hypotonic, Isotonic (0.9% NaCl) & Hypertonic Solution Action',
    icon: '🥔',
    badge: 'OSMOSIS LAB',
    formula: 'परासरण दाब π = C × R × T   (अर्धपारगम्य झिल्ली से विलायक का प्रवाह)',
    param1Label: 'बाहरी विलयन की NaCl सांद्रता',
    param1Unit: '%',
    param1Min: 0.1,
    param1Max: 3.0,
    param1Default: 0.9,
    param2Label: 'तापमान (Temperature)',
    param2Unit: '°C',
    param2Min: 10,
    param2Max: 45,
    param2Default: 27,
    computeResult: (conc) => {
      if (Math.abs(conc - 0.9) < 0.15) {
        return {
          primaryLabel: 'विलयन प्रकार: समपरासारी (Isotonic 0.9% NaCl)',
          primaryValue: 'कोशिका का आकार सामान्य रहेगा',
          secondaryLabel: 'जल प्रवाह स्थिति',
          secondaryValue: 'अंतःप्रवाह = बहिःप्रवाह (संतुलित)',
          statusText: '0.9% NaCl विलयन मानव रक्त कोशिकाओं (RBC) के साथ समपरासारी (Isotonic) होता है।'
        };
      }
      if (conc < 0.9) {
        return {
          primaryLabel: 'विलयन प्रकार: अल्पपरासारी (Hypotonic)',
          primaryValue: 'अंतःपरासरण (Endosmosis - कोशिका फूलेगी)',
          secondaryLabel: 'प्रभाव',
          secondaryValue: 'जल कोशिका के अंदर प्रवेश करेगा (किशमिश का फूलना)',
          statusText: 'अल्पपरासारी विलयन में रखने पर जल कोशिका में प्रवेश करता है और कोशिका स्फीत (Turgid) हो जाती है।'
        };
      }
      return {
        primaryLabel: 'विलयन प्रकार: अतिपरासारी (Hypertonic)',
        primaryValue: 'बहिःपरासरण (Exosmosis - कोशिका सिकुड़ेगी)',
        secondaryLabel: 'प्रभाव',
        secondaryValue: 'जीवद्रव्यकुंचन (Plasmolysis - अंगूर का सिकुड़ना)',
        statusText: 'गाढ़े नमक/चीनी के घोल में रखने पर कोशिका से जल बाहर निकल जाता है।'
      };
    },
    examFacts: [
      'पौधों की जड़ों द्वारा जल का अवशोषण परासरण (Osmosis) द्वारा और पत्तियों से जलवाष्प का निकलना वाष्पोत्सर्जन (Transpiration) कहलाता है।',
      'अचार और मुरब्बे में नमक/चीनी अधिक डालने से जीवाणुओं का जीवद्रव्यकुंचन (Plasmolysis) हो जाता है और अचार खराब नहीं होता।'
    ]
  },
  {
    id: 'human-eye-defects',
    number: 27,
    category: 'biology',
    categoryLabel: 'जीव विज्ञान (Biology)',
    title: 'मानव नेत्र दोष एवं लेंस सुधार प्रयोगशाला',
    subtitle: 'Myopia (Concave Correction), Hypermetropia (Convex) & 25cm Least Distance',
    icon: '👁️',
    badge: 'HUMAN EYE LAB',
    formula: 'स्पष्ट दर्शन की न्यूनतम दूरी = 25 cm   |   दूर बिंदु = अनंत (∞)',
    param1Label: 'नेत्र गोलक फोकस शिफ्ट (-5 = मायोपिया, 0 = सामान्य, +5 = हाइपरमेट्रोपिया)',
    param1Unit: 'D',
    param1Min: -5,
    param1Max: 5,
    param1Default: -2,
    param2Label: 'चश्मे के लेंस की क्षमता (Corrective Lens Power)',
    param2Unit: 'D',
    param2Min: -5,
    param2Max: 5,
    param2Default: -2,
    computeResult: (defect, lens) => {
      if (defect < 0) {
        return {
          primaryLabel: 'दृष्टि दोष: निकट दृष्टि दोष (Myopia)',
          primaryValue: 'प्रतिबिंब रेटिना से पहले बन रहा है',
          secondaryLabel: 'आवश्यक निवारण लेंस',
          secondaryValue: `अवतल लेंस (Concave Lens ${defect} D) — ${defect === lens ? '✓ रेटिना पर सटीक फोकस!' : 'लेंस क्षमता मिलाएं'}`,
          statusText: 'निकट दृष्टि दोष में पास की वस्तु स्पष्ट दिखती है परंतु दूर की नहीं; इसे अवतल (Diverging) लेंस से ठीक करते हैं।'
        };
      }
      if (defect > 0) {
        return {
          primaryLabel: 'दृष्टि दोष: दूर दृष्टि दोष (Hypermetropia)',
          primaryValue: 'प्रतिबिंब रेटिना के पीछे बन रहा है',
          secondaryLabel: 'आवश्यक निवारण लेंस',
          secondaryValue: `उत्तल लेंस (Convex Lens +${defect} D) — ${defect === lens ? '✓ रेटिना पर सटीक फोकस!' : 'लेंस क्षमता मिलाएं'}`,
          statusText: 'दूर दृष्टि दोष में दूर की वस्तु स्पष्ट दिखती है परंतु पास की नहीं; इसे उत्तल (Converging) लेंस से ठीक करते हैं।'
        };
      }
      return {
        primaryLabel: 'स्वस्थ मानव नेत्र (Normal Vision 6/6)',
        primaryValue: 'रेटिना पर वास्तविक व उल्टा प्रतिबिंब',
        secondaryLabel: 'स्पष्ट दृष्टि परास',
        secondaryValue: '25 cm से अनंत (∞) तक',
        statusText: 'नेत्र दान में आँख के केवल कॉर्निया (Cornea) भाग का दान किया जाता है।'
      };
    },
    examFacts: [
      'स्वस्थ आँख के लिए स्पष्ट दर्शन की न्यूनतम दूरी 25 सेमी और अधिकतम दूरी अनंत होती है।',
      'जरा-दृष्टि दोष (Presbyopia) में द्विफोकसी लेंस (Bifocal Lens) और अबिंदुकता (Astigmatism) में बेलनाकार लेंस प्रयुक्त होता है।'
    ]
  },
  {
    id: 'solar-escape-velocity',
    number: 28,
    category: 'biology',
    categoryLabel: 'जीव विज्ञान व अंतरिक्ष (Space & Earth)',
    title: 'सौरमंडल गुरुत्वाकर्षण एवं पलायन वेग लैब',
    subtitle: 'Planetary Gravity, Weight Calculator & Escape Velocity (11.2 km/s)',
    icon: '🪐',
    badge: 'SPACE & ASTRO LAB',
    formula: 'v_e = √(2gR) = √2 × v_orbital   |   पृथ्वी पलायन वेग = 11.2 km/s',
    param1Label: 'पृथ्वी पर आपका द्रव्यमान (Your Mass m)',
    param1Unit: 'kg',
    param1Min: 30,
    param1Max: 120,
    param1Default: 60,
    param2Label: 'खगोलीय पिंड (1=पृथ्वी, 2=चंद्रमा, 3=मंगल, 4=बृहस्पति)',
    param2Unit: 'Planet',
    param2Min: 1,
    param2Max: 4,
    param2Default: 2,
    computeResult: (mass, bodyCode) => {
      const b = Math.round(bodyCode);
      const bodies: Record<number, { name: string; gRatio: number; esc: string }> = {
        1: { name: 'पृथ्वी (Earth)', gRatio: 1.0, esc: '11.2 km/s' },
        2: { name: 'चंद्रमा (Moon - g/6)', gRatio: 0.166, esc: '2.38 km/s' },
        3: { name: 'मंगल ग्रह (Mars)', gRatio: 0.38, esc: '5.03 km/s' },
        4: { name: 'बृहस्पति (Jupiter)', gRatio: 2.53, esc: '59.5 km/s' }
      };
      const body = bodies[b] || bodies[1];
      const weightN = mass * 9.8 * body.gRatio;
      const apparentKg = mass * body.gRatio;
      return {
        primaryLabel: `${body.name} पर आपका आभासी भार`,
        primaryValue: `${apparentKg.toFixed(1)} kg-wt (${weightN.toFixed(0)} N)`,
        secondaryLabel: `${body.name} का पलायन वेग (Escape Velocity)`,
        secondaryValue: body.esc,
        statusText: `द्रव्यमान (${mass} kg) सर्वत्र समान रहता है, केवल गुरुत्व (g) बदलने से भार (W = mg) बदलता है।`
      };
    },
    examFacts: [
      'पृथ्वी का पलायन वेग 11.2 किमी/सेकंड है; चंद्रमा पर कम पलायन वेग (2.38 km/s) के कारण वायुमंडल नहीं है।',
      'भू-स्थिर उपग्रह (Geostationary Satellite) पृथ्वी तल से 35,786 किमी (लगभग 36,000 किमी) की ऊँचाई पर 24 घंटे के आवर्तकाल से घूमता है।'
    ]
  },
  // ===================== GEOGRAPHY & EARTH SCIENCE (2 LABS) =====================
  {
    id: 'geo-tectonic',
    number: 29,
    category: 'geography',
    categoryLabel: 'भूगोल एवं भूविज्ञान (Geography)',
    title: 'विवर्तनिक प्लेट संचलन एवं भूकंपीय तीव्रता लैब',
    subtitle: 'Tectonic Plate Collision & Richter Scale Magnitude Simulator',
    icon: '🌋',
    badge: 'GEOGRAPHY LAB',
    formula: 'M = log₁₀(A) + 3   |   Stress = F / Area',
    param1Label: 'प्लेट खिसकाव गति (Drift Speed)',
    param1Unit: 'cm/yr',
    param1Min: 1,
    param1Max: 20,
    param1Default: 5,
    param2Label: 'भूपर्पटी तनाव बल (Crustal Stress)',
    param2Unit: 'MPa',
    param2Min: 10,
    param2Max: 100,
    param2Default: 40,
    computeResult: (speed, stress) => {
      const mag = Math.min(9.5, Math.max(2.0, (speed * 0.15) + (stress * 0.06)));
      return {
        primaryLabel: 'भूकंपीय तीव्रता (Richter Magnitude M)',
        primaryValue: `${mag.toFixed(1)} Richter`,
        secondaryLabel: 'ऊर्जा मुक्ति (Energy Release)',
        secondaryValue: `${(Math.pow(10, mag) * 1.5).toExponential(1)} J`,
        statusText: mag >= 7.0 ? 'विनाशकारी भूकंप (Destructive Earthquake): भारी तबाही की संभावना!' : mag >= 5.0 ? 'मध्यम भूकंप: झटके महसूस किए गए।' : 'सामान्य विवर्तनिक हलचल (Minor tremor).'
      };
    },
    examFacts: [
      'पृथ्वी का स्थलमंडल (Lithosphere) कई विवर्तनिक प्लेटों (Tectonic Plates) में विभाजित है जो दुर्बलतामंडल पर तैरती हैं।',
      'भूकंप की तीव्रता मापने के लिए रिक्टर स्केल (Richter Scale) का उपयोग किया जाता है, जो एक लघुगणकीय पैमाना है।',
      'सुनामी (Tsunami) समुद्र के भीतर आने वाले भूकंपों या विवर्तनिक प्लेट खिसकने के कारण उत्पन्न होती है।'
    ]
  },
  {
    id: 'geo-water-cycle',
    number: 30,
    category: 'geography',
    categoryLabel: 'भूगोल एवं भूविज्ञान (Geography)',
    title: 'जलीय चक्र (वाष्पीकरण, संघनन एवं वर्षा) लैब',
    subtitle: 'Hydrological Water Cycle & Precipitation Simulator',
    icon: '🌧️',
    badge: 'HYDROLOGY LAB',
    formula: 'P = Evaporation - Condensation + Runoff',
    param1Label: 'तापमान (Surface Temp)',
    param1Unit: '°C',
    param1Min: 15,
    param1Max: 45,
    param1Default: 30,
    param2Label: 'वायुमंडलीय नमी (Humidity)',
    param2Unit: '%',
    param2Min: 20,
    param2Max: 100,
    param2Default: 75,
    computeResult: (temp, hum) => {
      const precip = Math.min(100, Math.max(0, (temp * 0.6) + (hum * 0.4) - 25));
      return {
        primaryLabel: 'वर्षा की संभावना (Precipitation Index)',
        primaryValue: `${precip.toFixed(1)}%`,
        secondaryLabel: 'वाष्पीकरण दर (Evaporation Rate)',
        secondaryValue: `${(temp * 0.12).toFixed(2)} mm/h`,
        statusText: precip > 70 ? 'घनघोर वर्षा एवं बादलों का संघनन (Heavy Rainfall & Condensation)!' : 'सामान्य जल चक्र वाष्पीकरण जारी है।'
      };
    },
    examFacts: [
      'जल चक्र (Water Cycle) में वाष्पीकरण (Evaporation), वाष्पोत्सर्जन (Transpiration), संघनन (Condensation) और वर्षण (Precipitation) मुख्य चरण हैं।',
      'क्षोभमंडल (Troposphere) में ही मौसम संबंधी सभी घटनाएं (वर्षा, आंधी, बादल) होती हैं।'
    ]
  },
  // ===================== MATHEMATICS & GEOMETRY (2 LABS) =====================
  {
    id: 'math-pythagoras',
    number: 31,
    category: 'mathematics',
    categoryLabel: 'गणित एवं ज्यामिति (Mathematics)',
    title: 'पाइथागोरस प्रमेय एवं समकोण त्रिभुज क्षेत्रफल लैब',
    subtitle: 'Pythagoras Theorem (a² + b² = c²) & Right Triangle Visualizer',
    icon: '📐',
    badge: 'GEOMETRY LAB',
    formula: 'c = √(a² + b²)   |   Area = 1/2 × a × b',
    param1Label: 'आधार (Base a)',
    param1Unit: 'cm',
    param1Min: 3,
    param1Max: 30,
    param1Default: 6,
    param2Label: 'लंब (Perpendicular b)',
    param2Unit: 'cm',
    param2Min: 4,
    param2Max: 40,
    param2Default: 8,
    computeResult: (a, b) => {
      const c = Math.sqrt(a * a + b * b);
      const area = 0.5 * a * b;
      return {
        primaryLabel: 'कर्ण की लंबाई (Hypotenuse c)',
        primaryValue: `${c.toFixed(2)} cm`,
        secondaryLabel: 'समकोण त्रिभुज का क्षेत्रफल (Area)',
        secondaryValue: `${area.toFixed(1)} cm²`,
        statusText: `पाइथागोरस त्रिक (Pythagorean Triple): ${a}² + ${b}² = ${c.toFixed(1)}² (${(a*a + b*b).toFixed(0)} = ${(c*c).toFixed(0)})`
      };
    },
    examFacts: [
      'समकोण त्रिभुज में कर्ण का वर्ग अन्य दो भुजाओं के वर्गों के योग के बराबर होता है (Hypotenuse² = Base² + Perpendicular²)।',
      'प्रसिद्ध पाइथागोरस त्रिक (3, 4, 5), (5, 12, 13) और (8, 15, 17) हैं।'
    ]
  },
  {
    id: 'math-coordinate',
    number: 32,
    category: 'mathematics',
    categoryLabel: 'गणित एवं ज्यामिति (Mathematics)',
    title: 'निर्देशांक ज्यामिति - सरल रेखा की ढाल (Slope m) लैब',
    subtitle: 'Coordinate Geometry Line Equation (y = mx + c) Simulator',
    icon: '📈',
    badge: 'COORDINATE LAB',
    formula: 'm = (y₂ - y₁) / (x₂ - x₁)   |   y = mx + c',
    param1Label: 'ढाल (Slope m)',
    param1Unit: '',
    param1Min: -5,
    param1Max: 5,
    param1Default: 2,
    param2Label: 'y-अंतःखंड (Y-Intercept c)',
    param2Unit: 'units',
    param2Min: -10,
    param2Max: 10,
    param2Default: 3,
    computeResult: (m, c) => {
      const angleRad = Math.atan(m);
      const angleDeg = (angleRad * 180) / Math.PI;
      return {
        primaryLabel: 'रेखा का समीकरण (Line Equation)',
        primaryValue: `y = ${m}x ${c >= 0 ? '+ ' + c : '- ' + Math.abs(c)}`,
        secondaryLabel: 'नति कोण (Angle of Inclination θ)',
        secondaryValue: `${angleDeg.toFixed(1)}°`,
        statusText: m > 0 ? 'रेखा ऊपर की ओर उठ रही है (धनात्मक ढाल)' : m < 0 ? 'रेखा नीचे की ओर झुक रही है (ऋणात्मक ढाल)' : 'रेखा X-अक्ष के समांतर है (m = 0)'
      };
    },
    examFacts: [
      'दो बिंदुओं (x₁, y₁) और (x₂, y₂) से गुजरने वाली रेखा की ढाल m = (y₂ - y₁) / (x₂ - x₁) होती है।',
      'यदि दो रेखाएं परस्पर लंबवत हैं, तो उनकी ढाल का गुणनफल -1 होता है (m₁ × m₂ = -1)।'
    ]
  },
  // ===================== ADVANCED COMPETITIVE & FUTURE-READY LABS (33–42) =====================
  {
    id: 'photoelectric-decay',
    number: 33,
    category: 'physics',
    categoryLabel: 'भौतिक विज्ञान (Modern Physics)',
    title: 'आधुनिक भौतिकी: प्रकाश-विद्युत प्रभाव एवं रेडियोधर्मी क्षय लैब',
    subtitle: 'Photoelectric Effect (E = hf - Φ) & Radioactive Half-Life Simulator',
    icon: '☢️',
    badge: 'MODERN PHYSICS',
    formula: 'KE_max = hν - Φ₀   |   N(t) = N₀ (1/2)^(t / T₁/₂)',
    param1Label: 'आपतित फोटॉन ऊर्जा (Photon Energy hν)',
    param1Unit: 'eV',
    param1Min: 1.0,
    param1Max: 10.0,
    param1Default: 5.0,
    param2Label: 'धातु का कार्य फलन (Work Function Φ₀)',
    param2Unit: 'eV',
    param2Min: 1.5,
    param2Max: 5.0,
    param2Default: 2.2,
    computeResult: (hv, phi) => {
      const ke = Math.max(0, hv - phi);
      return {
        primaryLabel: 'अधिकतम गतिज ऊर्जा (KE_max)',
        primaryValue: ke > 0 ? `${ke.toFixed(2)} eV (इलेक्ट्रॉन उत्सर्जित)` : '0.00 eV (उत्सर्जन नहीं)',
        secondaryLabel: 'निरोधी विभव (Stopping Potential V₀)',
        secondaryValue: `${ke.toFixed(2)} V`,
        statusText:
          hv >= phi
            ? 'आइंस्टीन समीकरण सत्यापित: आपतित फोटॉन ऊर्जा कार्य फलन से अधिक है, फोटो-इलेक्ट्रॉन उत्सर्जन सक्रिय!'
            : 'देहली आवृत्ति (Threshold Frequency) से कम ऊर्जा: कोई इलेक्ट्रॉन उत्सर्जित नहीं होगा।'
      };
    },
    examFacts: [
      'अल्बर्ट आइंस्टीन को 1921 का नोबेल पुरस्कार "प्रकाश-विद्युत प्रभाव" (Photoelectric Effect) की व्याख्या के लिए मिला था।',
      'सीज़ियम (Cesium) का कार्य फलन सबसे कम (1.9 eV) होता है, इसलिए इसका उपयोग फोटो-सेल में किया जाता है।'
    ]
  },
  {
    id: 'carnot-thermodynamics',
    number: 34,
    category: 'physics',
    categoryLabel: 'भौतिक विज्ञान (Thermodynamics)',
    title: 'ऊष्मागतिकी: कार्नो इंजन दक्षता एवं गैस नियम लैब',
    subtitle: 'Heat Engine, Carnot Cycle Efficiency (η = 1 - T₂/T₁) & Ideal Gas Law',
    icon: '🔥',
    badge: 'THERMODYNAMICS',
    formula: 'η = (1 - T_sink / T_source) × 100%   |   W = Q₁ - Q₂',
    param1Label: 'स्रोत का तापमान (Source Temp T₁)',
    param1Unit: 'K',
    param1Min: 400,
    param1Max: 1200,
    param1Default: 800,
    param2Label: 'सिंक का तापमान (Sink Temp T₂)',
    param2Unit: 'K',
    param2Min: 200,
    param2Max: 500,
    param2Default: 300,
    computeResult: (t1, t2) => {
      const eff = t1 > t2 ? ((t1 - t2) / t1) * 100 : 0;
      return {
        primaryLabel: 'कार्नो इंजन दक्षता (Efficiency η)',
        primaryValue: `${eff.toFixed(1)}%`,
        secondaryLabel: 'तापमान अंतर (ΔT = T₁ - T₂)',
        secondaryValue: `${Math.max(0, t1 - t2)} K`,
        statusText:
          'किसी भी ऊष्मा इंजन की दक्षता 100% नहीं हो सकती क्योंकि T₂ (सिंक तापमान) शून्य केल्विन (0 K) संभव नहीं है।'
      };
    },
    examFacts: [
      'ऊष्मागतिकी का प्रथम नियम "ऊर्जा संरक्षण" (ΔQ = ΔU + ΔW) को दर्शाता है।',
      'कार्नो चक्र (Carnot Cycle) में दो समतापी (Isothermal) और दो रुद्धोष्म (Adiabatic) प्रक्रम होते हैं।'
    ]
  },
  {
    id: 'inorganic-salt-analysis',
    number: 35,
    category: 'chemistry',
    categoryLabel: 'रसायन विज्ञान (Inorganic Chemistry)',
    title: 'अकार्बनिक रसायन: लवण विश्लेषण एवं ज्वाला परीक्षण लैब',
    subtitle: 'Inorganic Salt Analysis, Flame Test & Qualitative Cation/Anion Titration',
    icon: '🧪',
    badge: 'SALT ANALYSIS',
    formula: 'Cu²⁺ + 4NH₃ → [Cu(NH₃)₄]²⁺ (गहरा नीला) | Ba²⁺ (सेब जैसा हरा ज्वाला रंग)',
    param1Label: 'धातु धनायन चयन (1=Cu²⁺, 2=Fe³⁺, 3=Ba²⁺, 4=Na⁺)',
    param1Unit: 'Ion',
    param1Min: 1,
    param1Max: 4,
    param1Default: 1,
    param2Label: 'अभिकर्मक सांद्रता (Reagent Molarity)',
    param2Unit: 'M',
    param2Min: 0.5,
    param2Max: 5.0,
    param2Default: 2.0,
    computeResult: (ionCode, mol) => {
      const code = Math.round(ionCode);
      const map: Record<number, { name: string; flame: string; ppt: string }> = {
        1: { name: 'कॉपर (Cu²⁺)', flame: 'नीला-हरा (Bluish-Green)', ppt: 'गहरा नीला संकुल [Cu(NH₃)₄]²⁺' },
        2: { name: 'फेरिक आयरन (Fe³⁺)', flame: 'सुनहरी चिंगारी', ppt: 'लाल-भूरा अवक्षेप Fe(OH)₃' },
        3: { name: 'बेरियम (Ba²⁺)', flame: 'सेब जैसा हरा (Apple Green)', ppt: 'श्वेत अवक्षेप BaSO₄' },
        4: { name: 'सोडियम (Na⁺)', flame: 'सुनहरा पीला (Golden Yellow)', ppt: 'जल में पूर्णतः विलेय' }
      };
      const item = map[code] || map[1];
      return {
        primaryLabel: `पहचाना गया धनायन: ${item.name}`,
        primaryValue: `ज्वाला रंग: ${item.flame}`,
        secondaryLabel: `अवक्षेप परिणाम (${mol.toFixed(1)} M पर)`,
        secondaryValue: item.ppt,
        statusText: 'बुन्सन बर्नर ज्वाला परीक्षण और समूह अभिकर्मक से लवण के अम्लीय व क्षारीय मूलकों की सटीक पहचान।'
      };
    },
    examFacts: [
      'बेरियम (Ba) के कारण आतिशबाजी में हरा रंग और स्ट्रॉन्शियम (Sr) के कारण गहरा लाल रंग उत्पन्न होता है।',
      'भूरा वलय परीक्षण (Brown Ring Test) नाइट्रेट आयन (NO₃⁻) की पहचान के लिए किया जाता है।'
    ]
  },
  {
    id: 'microbiology-gram-stain',
    number: 36,
    category: 'biology',
    categoryLabel: 'जीव विज्ञान (Microbiology)',
    title: 'सूक्ष्मजीव विज्ञान: ग्राम अभिरंजन एवं जीवाणु वृद्धि लैब',
    subtitle: 'Microbiology Gram Staining (Positive vs Negative) & Bacterial Growth Curve',
    icon: '🦠',
    badge: 'MICROBIOLOGY LAB',
    formula: 'N(t) = N₀ × 2^(t / g)   |   Crystal Violet + Iodine Stain',
    param1Label: 'संवर्धन समय (Incubation Time t)',
    param1Unit: 'hr',
    param1Min: 1,
    param1Max: 12,
    param1Default: 5,
    param2Label: 'जीवाणु प्रकार (1 = Gram +ve बैंगनी, 2 = Gram -ve गुलाबी)',
    param2Unit: 'Type',
    param2Min: 1,
    param2Max: 2,
    param2Default: 1,
    computeResult: (hrs, typeCode) => {
      const isPos = Math.round(typeCode) === 1;
      const colonies = Math.pow(2, hrs);
      return {
        primaryLabel: isPos ? 'ग्राम-पॉजिटिव (Gram +ve Bacteria)' : 'ग्राम-नेगेटिव (Gram -ve Bacteria)',
        primaryValue: isPos ? 'गहरा बैंगनी (Crystal Violet)' : 'गुलाबी-लाल (Safranin Counterstain)',
        secondaryLabel: 'जीवाणु कॉलोनी गुणन (2ⁿ)',
        secondaryValue: `${colonies}x वृद्धि (${hrs} घंटे में)`,
        statusText: isPos
          ? 'मोटी पेप्टिडोग्लाइकन (Peptidoglycan) कोशिका भित्ति के कारण क्रिस्टल वायलेट रंग बना रहता है।'
          : 'पतली पेप्टिडोग्लाइकन व लिपिड परत के कारण अल्कोहल से धोने पर प्राथमिक रंग निकल जाता है।'
      };
    },
    examFacts: [
      'क्रिश्चियन ग्राम (Christian Gram) ने 1884 में जीवाणुओं के वर्गीकरण हेतु ग्राम स्टेनिंग तकनीक विकसित की।',
      'पेनिसिलिन (Penicillin) एंटीबायोटिक जीवाणु की पेप्टिडोग्लाइकन कोशिका भित्ति के निर्माण को रोकता है।'
    ]
  },
  {
    id: 'atmosphere-coriolis',
    number: 37,
    category: 'geography',
    categoryLabel: 'भूगोल एवं अंतरिक्ष (Atmosphere Lab)',
    title: 'वायुमंडलीय परतें, दाब पेटियां एवं कोरिओलिस बल लैब',
    subtitle: 'Atmosphere Layers, Pressure Belts & Coriolis Effect Deflection Simulator',
    icon: '🌪️',
    badge: 'ATMOSPHERE & CLIMATE',
    formula: 'F_coriolis = 2 m v ω sin(φ)   |   Lapse Rate = -6.5°C / km',
    param1Label: 'अक्षांश कोण (Latitude φ)',
    param1Unit: '°',
    param1Min: 0,
    param1Max: 90,
    param1Default: 45,
    param2Label: 'ऊँचाई (Altitude above Sea Level)',
    param2Unit: 'km',
    param2Min: 1,
    param2Max: 85,
    param2Default: 12,
    computeResult: (lat, alt) => {
      const sinLat = Math.sin((lat * Math.PI) / 180);
      const layer =
        alt <= 15
          ? 'क्षोभमंडल (Troposphere)'
          : alt <= 50
          ? 'समतापमंडल (Stratosphere - ओजोन परत)'
          : 'मध्यमंडल (Mesosphere)';
      return {
        primaryLabel: 'सक्रिय वायुमंडलीय परत',
        primaryValue: layer,
        secondaryLabel: 'कोरिओलिस विक्षेपण सूचकांक (sin φ)',
        secondaryValue: `${(sinLat * 100).toFixed(0)}% (ध्रुवों पर अधिकतम, विषुवत पर 0)`,
        statusText:
          'फेरेल के नियम अनुसार कोरिओलिस बल के कारण उत्तरी गोलार्ध में हवाएं अपनी दाईं ओर तथा दक्षिणी गोलार्ध में बाईं ओर मुड़ जाती हैं।'
      };
    },
    examFacts: [
      'विषुवत रेखा (Equator 0°) पर कोरिओलिस बल शून्य होता है, इसलिए वहाँ उष्णकटिबंधीय चक्रवात नहीं बनते।',
      'समतापमंडल (Stratosphere) में 15-35 किमी की ऊँचाई पर ओजोन परत (O₃) पाई जाती है जो UV किरणों को रोकती है।'
    ]
  },
  {
    id: 'math-trigonometry-wave',
    number: 38,
    category: 'mathematics',
    categoryLabel: 'गणित एवं ज्यामिति (Trigonometry)',
    title: 'त्रिकोणमिति: इकाई वृत्त (Unit Circle) एवं साइन/कोसाइन तरंग लैब',
    subtitle: 'Trigonometry Unit Circle, Sine/Cosine Wave Dynamics & sin²θ + cos²θ = 1',
    icon: '〰️',
    badge: 'TRIGONOMETRY LAB',
    formula: 'sin²θ + cos²θ = 1   |   tan θ = sin θ / cos θ',
    param1Label: 'कोण थीटा (Angle θ)',
    param1Unit: '°',
    param1Min: 0,
    param1Max: 360,
    param1Default: 60,
    param2Label: 'तरंग आयाम (Wave Amplitude A)',
    param2Unit: 'units',
    param2Min: 1,
    param2Max: 10,
    param2Default: 5,
    computeResult: (deg, amp) => {
      const rad = (deg * Math.PI) / 180;
      const s = Math.sin(rad);
      const c = Math.cos(rad);
      return {
        primaryLabel: `sin(${deg}°) एवं cos(${deg}°)`,
        primaryValue: `sin = ${s.toFixed(3)} | cos = ${c.toFixed(3)}`,
        secondaryLabel: 'सर्वसमिका सत्यापन (sin²θ + cos²θ)',
        secondaryValue: `${(s * s + c * c).toFixed(2)} (आयाम Y = ${(amp * s).toFixed(2)})`,
        statusText: 'इकाई वृत्त (Unit Circle) पर किसी भी कोण θ के लिए X-निर्देशांक cos θ और Y-निर्देशांक sin θ दर्शाता है।'
      };
    },
    examFacts: [
      'प्रथम चतुर्थांश (0°–90°) में सभी त्रिकोणमितीय अनुपात धनात्मक (All Positive - ASTC Rule) होते हैं।',
      'sin θ और cos θ का मान सदैव -1 और +1 के बीच रहता है।'
    ]
  },
  {
    id: 'math-probability-stats',
    number: 39,
    category: 'mathematics',
    categoryLabel: 'गणित एवं सांख्यिकी (Statistics & Probability)',
    title: 'सांख्यिकी एवं प्रायिकता: पासा, सिक्का वितरण व मानक विचलन लैब',
    subtitle: 'Probability Distribution, Dice/Coin Toss & Standard Deviation Simulator',
    icon: '🎲',
    badge: 'PROBABILITY & STATS',
    formula: 'P(E) = n(E) / n(S)   |   σ = √[ Σ(x - μ)² / N ]',
    param1Label: 'कुल परीक्षण संख्या (Number of Trials N)',
    param1Unit: 'rolls',
    param1Min: 10,
    param1Max: 500,
    param1Default: 120,
    param2Label: 'अनुकूल परिणाम लक्ष्य (Target Sum on 2 Dice)',
    param2Unit: 'sum',
    param2Min: 2,
    param2Max: 12,
    param2Default: 7,
    computeResult: (trials, targetSum) => {
      const s = Math.round(targetSum);
      const ways = 6 - Math.abs(7 - s);
      const prob = ways / 36;
      const expected = Math.round(trials * prob);
      return {
        primaryLabel: `योग ${s} आने की सैद्धांतिक प्रायिकता P(E)`,
        primaryValue: `${ways}/36 (${(prob * 100).toFixed(1)}%)`,
        secondaryLabel: `${trials} उछालों में संभावित सफलता`,
        secondaryValue: `≈ ${expected} बार`,
        statusText:
          s === 7
            ? 'दो पासों को फेंकने पर योग 7 आने की प्रायिकता सर्वाधिक (6/36 = 1/6) होती है!'
            : 'किसी भी घटना की प्रायिकता सदैव 0 और 1 के बीच होती है: 0 ≤ P(E) ≤ 1।'
      };
    },
    examFacts: [
      'दो पासों को एक साथ उछालने पर कुल संभावित परिणाम n(S) = 6² = 36 होते हैं।',
      'प्रसरण (Variance) का धनात्मक वर्गमूल "मानक विचलन" (Standard Deviation σ) कहलाता है।'
    ]
  },
  {
    id: 'quantum-superposition',
    number: 40,
    category: 'future',
    categoryLabel: 'भविष्य की प्रयोगशालाएं (Quantum & AI)',
    title: 'क्वांटम भौतिकी: सुपरपोजिशन (Qubit) एवं एंटैंगलमेंट लैब',
    subtitle: 'Quantum Superposition |ψ⟩ = α|0⟩ + β|1⟩ & Quantum Entanglement Visualizer',
    icon: '⚛️',
    badge: 'QUANTUM LAB',
    formula: '|ψ⟩ = α|0⟩ + β|1⟩   |   |α|² + |β|² = 1',
    param1Label: 'क्यूबिट कला कोण (Bloch Sphere θ)',
    param1Unit: '°',
    param1Min: 0,
    param1Max: 180,
    param1Default: 90,
    param2Label: 'एंटैंगलमेंट सहसंबंध (Entanglement Coherence)',
    param2Unit: '%',
    param2Min: 10,
    param2Max: 100,
    param2Default: 95,
    computeResult: (theta, coh) => {
      const rad = (theta * Math.PI) / 180;
      const p0 = Math.pow(Math.cos(rad / 2), 2) * 100;
      const p1 = Math.pow(Math.sin(rad / 2), 2) * 100;
      return {
        primaryLabel: 'अवस्था प्रायिकता (|0⟩ बनाम |1⟩)',
        primaryValue: `P(|0⟩) = ${p0.toFixed(1)}% | P(|1⟩) = ${p1.toFixed(1)}%`,
        secondaryLabel: 'क्वांटम सुसंगतता (Bell Fidelity)',
        secondaryValue: `${coh}% Entangled`,
        statusText:
          theta === 90
            ? 'आदर्श हैडामार्ड सुपरपोजिशन (50% |0⟩ + 50% |1⟩): क्यूबिट एक साथ दोनों अवस्थाओं में है!'
            : 'मापन (Measurement) करने पर तरंग फलन (Wavefunction) एक निश्चित अवस्था में सिमट जाता है।'
      };
    },
    examFacts: [
      'क्लासिकल कंप्यूटर बिट्स (0 या 1) पर काम करते हैं, जबकि क्वांटम कंप्यूटर क्यूबिट्स (Qubits) पर कार्य करते हैं।',
      'भारत के "नेशनल क्वांटम मिशन" (NQM) का लक्ष्य मध्यवर्ती स्तर के क्वांटम कंप्यूटर विकसित करना है।'
    ]
  },
  {
    id: 'ai-robotics-logic',
    number: 41,
    category: 'future',
    categoryLabel: 'भविष्य की प्रयोगशालाएं (AI & Robotics)',
    title: 'AI एवं रोबोटिक्स: लॉजिक गेट्स (AND, OR, NAND, XOR) सर्किट लैब',
    subtitle: 'Digital Logic Gates, Binary Circuit Routing & Microcontroller Truth Table',
    icon: '🤖',
    badge: 'AI & LOGIC GATES',
    formula: 'AND = A·B  |  OR = A+B  |  NAND = ¬(A·B)  |  XOR = A⊕B',
    param1Label: 'इनपुट A एवं B (0=00, 1=01, 2=10, 3=11)',
    param1Unit: 'Binary',
    param1Min: 0,
    param1Max: 3,
    param1Default: 3,
    param2Label: 'लॉजिक गेट चयन (1=AND, 2=OR, 3=NAND, 4=XOR)',
    param2Unit: 'Gate',
    param2Min: 1,
    param2Max: 4,
    param2Default: 1,
    computeResult: (inCode, gateCode) => {
      const inp = Math.round(inCode);
      const a = (inp >> 1) & 1;
      const b = inp & 1;
      const g = Math.round(gateCode);
      const gates: Record<number, { name: string; out: number }> = {
        1: { name: 'AND Gate (A · B)', out: a & b },
        2: { name: 'OR Gate (A + B)', out: a | b },
        3: { name: 'NAND Gate ¬(A · B)', out: (a & b) === 1 ? 0 : 1 },
        4: { name: 'XOR Gate (A ⊕ B)', out: a ^ b }
      };
      const sel = gates[g] || gates[1];
      return {
        primaryLabel: `${sel.name} [A=${a}, B=${b}]`,
        primaryValue: `आउटपुट Y = ${sel.out} (${sel.out === 1 ? 'HIGH / LED ON' : 'LOW / OFF'})`,
        secondaryLabel: 'सार्वत्रिक गेट (Universal Gates)',
        secondaryValue: 'NAND एवं NOR Gate',
        statusText: 'NAND और NOR गेट को "यूनिवर्सल गेट" कहा जाता है क्योंकि इनसे कोई भी अन्य लॉजिक सर्किट बनाया जा सकता है।'
      };
    },
    examFacts: [
      'NAND और NOR गेट सार्वत्रिक (Universal) लॉजिक गेट्स हैं।',
      'XOR गेट का आउटपुट तभी 1 (HIGH) होता है जब दोनों बाइनरी इनपुट एक-दूसरे से भिन्न हों।'
    ]
  },
  {
    id: 'carbon-global-warming',
    number: 42,
    category: 'future',
    categoryLabel: 'पर्यावरण एवं भविष्य (Environmental Lab)',
    title: 'पर्यावरण एवं कार्बन फुटप्रिंट: ग्लोबल वार्मिंग सिमुलेशन लैब',
    subtitle: 'Carbon Footprint, CO₂ ppm Concentration & Greenhouse Temperature Rise Lab',
    icon: '🌱',
    badge: 'CLIMATE & CARBON LAB',
    formula: 'ΔT = λ × ΔF   |   ΔF = 5.35 × ln(CO₂ / 280)',
    param1Label: 'वायुमंडलीय CO₂ सांद्रता (CO₂ Concentration)',
    param1Unit: 'ppm',
    param1Min: 280,
    param1Max: 700,
    param1Default: 422,
    param2Label: 'हरित ऊर्जा एवं वनीकरण स्तर (Green Mitigation)',
    param2Unit: '%',
    param2Min: 0,
    param2Max: 100,
    param2Default: 35,
    computeResult: (co2, green) => {
      const rawRise = 3.0 * (Math.log(co2 / 280) / Math.log(2));
      const netRise = Math.max(0.4, rawRise * (1 - green * 0.004));
      return {
        primaryLabel: 'अनुमानित वैश्विक तापमान वृद्धि (ΔT)',
        primaryValue: `+${netRise.toFixed(2)} °C`,
        secondaryLabel: 'ग्रीनहाउस विकिरण प्रभाव',
        secondaryValue: `${co2} ppm CO₂ (${green}% हरित नियंत्रण)`,
        statusText:
          netRise > 1.5
            ? 'पेरिस जलवायु समझौते की +1.5°C सीमा पार: ग्लेशियर पिघलने व चरम मौसम का उच्च जोखिम!'
            : 'नियंत्रित कार्बन उत्सर्जन: सतत विकास एवं नेट-ज़ीरो लक्ष्य के अनुकूल।'
      };
    },
    examFacts: [
      'मुख्य ग्रीनहाउस गैसें जलवाष्प (H₂O), कार्बन डाइऑक्साइड (CO₂), मीथेन (CH₄) और नाइट्रस ऑक्साइड (N₂O) हैं।',
      'भारत ने वर्ष 2070 तक "नेट-ज़ीरो" (Net-Zero Carbon Emission) का लक्ष्य निर्धारित किया है।'
    ]
  },

  // ===================== EXPANDED HIGH-YIELD LABS (LABS 43 TO 52) =====================
  {
    id: 'rutherford-scattering',
    number: 43,
    category: 'physics',
    categoryLabel: 'भौतिक विज्ञान (Atomic Physics)',
    title: 'रदरफोर्ड स्वर्ण पत्र अल्फा प्रकीर्णन एवं परमाणु नाभिकीय खोज',
    subtitle: 'Rutherford Alpha Scattering Experiment & Nucleus Discovery Simulator',
    icon: '🎯',
    badge: 'ATOMIC NUCLEUS',
    formula: 'N(θ) ∝ 1 / sin⁴(θ/2)   |   Impact Parameter b = k Ze² cot(θ/2) / E',
    param1Label: 'स्वर्ण पत्र की मोटाई (Foil Thickness)',
    param1Unit: 'nm',
    param1Min: 50,
    param1Max: 600,
    param1Default: 200,
    param2Label: 'अल्फा कण गतिज ऊर्जा (Alpha Kinetic Energy)',
    param2Unit: 'MeV',
    param2Min: 2,
    param2Max: 10,
    param2Default: 5.5,
    computeResult: (thick, energy) => {
      const largeAngleDeflections = Math.max(1, Math.round((thick / 200) * (5.5 / energy) * 8));
      return {
        primaryLabel: 'वृहद कोण (>90°) प्रकीर्णन प्रायिकता',
        primaryValue: `1 इन ${Math.round(20000 / largeAngleDeflections)} अल्फा कण`,
        secondaryLabel: 'नाभिक का अनुमानित आकार (r₀)',
        secondaryValue: '≈ 10⁻¹⁵ m (1 फर्मी)',
        statusText: 'अधिकांश अल्फा कण सीधे निकल जाते हैं, जिससे सिद्ध हुआ कि परमाणु का अधिकांश भाग खोखला है और केंद्र में धनावेशित नाभिक है।'
      };
    },
    examFacts: [
      'अर्नेस्ट रदरफोर्ड ने 1911 में अल्फा कण प्रकीर्णन प्रयोग द्वारा "परमाणु नाभिक" (Nucleus) की खोज की।',
      'परमाणु की त्रिज्या लगभग 10⁻¹⁰ मीटर (1 Ångström) और नाभिक की त्रिज्या लगभग 10⁻¹⁵ मीटर (1 Fermi) होती है।'
    ]
  },
  {
    id: 'dna-double-helix',
    number: 44,
    category: 'biology',
    categoryLabel: 'जीव विज्ञान (Molecular Genetics)',
    title: 'डीएनए द्विकुंडली संरचना एवं वाटसन-क्रिक बेस पेयरिंग लैब',
    subtitle: 'DNA Double Helix, Chargaff Rule (A+G = T+C) & Hydrogen Bond Matrix',
    icon: '🧬',
    badge: 'GENETICS & DNA',
    formula: 'Chargaff Rule: A = T (2 H-Bonds) | G ≡ C (3 H-Bonds) | Pitch = 3.4 nm',
    param1Label: 'गुआनिन-साइटोसिन प्रतिशत (% GC Content)',
    param1Unit: '%',
    param1Min: 20,
    param1Max: 80,
    param1Default: 50,
    param2Label: 'डीएनए हेलिक्स चक्र (Helical Turns)',
    param2Unit: 'turns',
    param2Min: 1,
    param2Max: 8,
    param2Default: 3,
    computeResult: (gc, turns) => {
      const at = 100 - gc;
      const bpPerTurn = 10;
      const totalBp = turns * bpPerTurn;
      const tm = 69.3 + 0.41 * gc;
      return {
        primaryLabel: `डीएनए गलन तापमान (Melting Temp Tm)`,
        primaryValue: `${tm.toFixed(1)} °C (${gc}% GC सांद्रता पर)`,
        secondaryLabel: 'कुल क्षारक युग्म (Base Pairs) व लंबाई',
        secondaryValue: `${totalBp} bp | ${(turns * 3.4).toFixed(1)} nm लंबाई`,
        statusText: gc > 60
          ? 'उच्च GC मात्रा के कारण 3 हाइड्रोजन बंधों से डीएनए अत्यंत स्थिर एवं उच्च तापमान सहनशील है।'
          : 'संतुलित क्षारक युग्मन: A=T में दो तथा G≡C में तीन हाइड्रोजन बंध पाए जाते हैं।'
      };
    },
    examFacts: [
      'जेम्स वाटसन और फ्रांसिस क्रिक ने 1953 में डीएनए के द्विकुंडली मॉडल का प्रतिपादन किया जिसके लिए उन्हें 1962 में नोबेल पुरस्कार मिला।',
      'चारगाफ के नियमानुसार, डीएनए में प्यूरीन (A + G) की मात्रा पिरीमिडीन (T + C) के बराबर होती है।'
    ]
  },
  {
    id: 'photosynthesis-hill',
    number: 45,
    category: 'biology',
    categoryLabel: 'जीव विज्ञान (Plant Physiology)',
    title: 'प्रकाश संश्लेषण दर, प्रकाश तीव्रता एवं CO₂ सांद्रता लैब',
    subtitle: 'Photosynthesis Rate (6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂) & Hill Reaction',
    icon: '🍃',
    badge: 'PLANT PHYSIOLOGY',
    formula: '6CO₂ + 6H₂O + hν → C₆H₁₂O₆ + 6O₂   |   Light & Dark Reactions',
    param1Label: 'प्रकाश तीव्रता (Light Intensity)',
    param1Unit: 'Lux',
    param1Min: 500,
    param1Max: 5000,
    param1Default: 2500,
    param2Label: 'कार्बन डाइऑक्साइड सांद्रता (CO₂ ppm)',
    param2Unit: 'ppm',
    param2Min: 200,
    param2Max: 1000,
    param2Default: 450,
    computeResult: (lux, co2) => {
      const lightFactor = Math.min(1.0, lux / 3000);
      const co2Factor = Math.min(1.0, co2 / 700);
      const rate = lightFactor * co2Factor * 100;
      return {
        primaryLabel: 'प्रकाश संश्लेषण दर (O₂ उत्पादन)',
        primaryValue: `${rate.toFixed(1)}% इष्टतम क्षमता`,
        secondaryLabel: 'सीमाकारी कारक (Blackman Limiting Factor)',
        secondaryValue: lightFactor < co2Factor ? 'प्रकाश तीव्रता सीमाकारी है' : 'CO₂ सांद्रता सीमाकारी है',
        statusText: 'प्रकाश अभिक्रिया क्लोरोप्लास्ट के थाइलाकॉइड (Thylakoid/Grana) में और अप्रकाशीय अभिक्रिया स्ट्रोमा (Stroma) में होती है।'
      };
    },
    examFacts: [
      'प्रकाश संश्लेषण में निर्मुक्त होने वाली ऑक्सीजन (O₂) गैस जल (H₂O) के प्रकाशीय अपघटन (Photolysis) से निकलती है, CO₂ से नहीं।',
      'क्लोरोफिल के केंद्र में मैग्नीशियम (Mg) धातु का परमाणु उपस्थित होता है।'
    ]
  },
  {
    id: 'simple-pendulum',
    number: 46,
    category: 'physics',
    categoryLabel: 'भौतिक विज्ञान (Mechanics & Oscillations)',
    title: 'सरल लोलक आवर्तकाल एवं गुरुत्वीय त्वरण (g) मापन लैब',
    subtitle: 'Simple Pendulum Period T = 2π√(L/g) & Simple Harmonic Motion (SHM)',
    icon: '⏱️',
    badge: 'OSCILLATIONS & g',
    formula: 'T = 2π √(L / g)   |   g = 4π² L / T²',
    param1Label: 'लोलक की प्रभावकारी लंबाई (Length L)',
    param1Unit: 'm',
    param1Min: 0.25,
    param1Max: 2.5,
    param1Default: 1.0,
    param2Label: 'गुरुत्वीय त्वरण (Gravity g)',
    param2Unit: 'm/s²',
    param2Min: 1.62,
    param2Max: 24.8,
    param2Default: 9.8,
    computeResult: (len, gVal) => {
      const t = 2 * Math.PI * Math.sqrt(len / gVal);
      const f = 1 / t;
      return {
        primaryLabel: 'आवर्तकाल (Time Period T)',
        primaryValue: `${t.toFixed(2)} सेकंड`,
        secondaryLabel: 'दोलन आवृत्ति (Frequency f)',
        secondaryValue: `${f.toFixed(2)} Hz (दोलन/सेकंड)`,
        statusText: len === 1.0 && gVal === 9.8
          ? '1 मीटर लंबे लोलक का पृथ्वी पर आवर्तकाल लगभग 2.01 सेकंड (सेकंड्स लोलक) होता है।'
          : `लोलक का आवर्तकाल गोलक के द्रव्यमान पर निर्भर नहीं करता, केवल लंबाई L और गुरुत्व g पर निर्भर करता है।`
      };
    },
    examFacts: [
      'सेकंड लोलक (Seconds Pendulum) का आवर्तकाल ठीक 2 सेकंड होता है और इसकी लंबाई पृथ्वी पर लगभग 99.3 सेमी (1 मीटर) होती है।',
      'गर्मियों में लोलक घड़ी की लंबाई बढ़ने के कारण आवर्तकाल बढ़ जाता है जिससे घड़ी सुस्त (Slow) हो जाती है।'
    ]
  },
  {
    id: 'archimedes-buoyancy',
    number: 47,
    category: 'physics',
    categoryLabel: 'भौतिक विज्ञान (Fluid Mechanics)',
    title: 'आर्किमिडीज का उत्प्लावन बल एवं जहाज प्लवन सिद्धांत लैब',
    subtitle: 'Archimedes Principle F_b = ρ · V · g & Law of Flotation Simulator',
    icon: '🚢',
    badge: 'FLUID MECHANICS',
    formula: 'F_buoyant = ρ_fluid × V_displaced × g   |   Apparent Weight = W - F_b',
    param1Label: 'विस्थापित द्रव का आयतन (Displaced Volume V)',
    param1Unit: 'L',
    param1Min: 2,
    param1Max: 50,
    param1Default: 10,
    param2Label: 'तरल का घनत्व (Fluid Density ρ)',
    param2Unit: 'kg/m³',
    param2Min: 700,
    param2Max: 1350,
    param2Default: 1000,
    computeResult: (volLiters, density) => {
      const volM3 = volLiters / 1000;
      const buoyantForce = density * volM3 * 9.8;
      return {
        primaryLabel: 'ऊर्ध्वमुखी उत्प्लावन बल (Buoyant Force)',
        primaryValue: `${buoyantForce.toFixed(1)} N (न्यूटन)`,
        secondaryLabel: 'तरल प्रकार एवं प्लवन क्षमता',
        secondaryValue: density === 1000 ? 'शुद्ध जल (1000 kg/m³)' : density > 1000 ? 'समुद्री खारा जल (उच्च उत्प्लावन)' : 'अल्कोहल / तेल',
        statusText: 'लोहे की भारी कील पानी में डूब जाती है जबकि लोहे का विशाल जहाज अपने खोखले आकार के कारण अधिक पानी हटाकर तैरता है।'
      };
    },
    examFacts: [
      'आर्किमिडीज के सिद्धांत के अनुसार, जब कोई वस्तु किसी तरल में पूर्णतः या आंशिक रूप से डुबोई जाती है, तो उसके भार में आई आभासी कमी विस्थापित तरल के भार के बराबर होती है।',
      'दूध की शुद्धता मापने वाला लैक्टोमीटर और द्रवों का घनत्व मापने वाला हाइड्रोमीटर प्लवन के सिद्धांत पर कार्य करते हैं।'
    ]
  },
  {
    id: 'eye-optics-defect',
    number: 48,
    category: 'physics',
    categoryLabel: 'भौतिक विज्ञान (Human Eye Optics)',
    title: 'मानव नेत्र दृष्टि दोष (निकट/दूर दृष्टि) एवं लेंस निवारण लैब',
    subtitle: 'Myopia (Concave Lens) & Hypermetropia (Convex Lens) Vision Correction',
    icon: '👁️',
    badge: 'HUMAN EYE OPTICS',
    formula: 'P = 1 / f (in meters)   |   Near Point D = 25 cm',
    param1Label: 'दोष प्रकार (1=निकट दृष्टि Myopia, 2=दूर दृष्टि Hypermetropia)',
    param1Unit: 'Defect',
    param1Min: 1,
    param1Max: 2,
    param1Default: 1,
    param2Label: 'दोषयुक्त दृष्टि बिंदु (Far / Near Distance)',
    param2Unit: 'cm',
    param2Min: 20,
    param2Max: 150,
    param2Default: 50,
    computeResult: (typeCode, distCm) => {
      const isMyopia = Math.round(typeCode) === 1;
      const power = isMyopia ? -(100 / distCm) : (100 / 25) - (100 / distCm);
      return {
        primaryLabel: isMyopia ? 'निकट दृष्टि दोष (Myopia) निवारण' : 'दूर दृष्टि दोष (Hypermetropia) निवारण',
        primaryValue: `${power.toFixed(2)} D (डाइऑप्टर)`,
        secondaryLabel: 'आवश्यक सुधारात्मक लेंस',
        secondaryValue: isMyopia ? 'अवतल लेंस (Concave Lens -ve)' : 'उत्तल लेंस (Convex Lens +ve)',
        statusText: isMyopia
          ? 'मायोपिया में प्रतिबिंब रेटिना से पहले बन जाता है; अवतल लेंस प्रकाश किरणों को अपसारित करके रेटिना पर केंद्रित करता है।'
          : 'हाइपरमेट्रोपिया में प्रतिबिंब रेटिना के पीछे बनता है; उत्तल लेंस किरणों को अभिसरित करके रेटिना पर लाता है।'
      };
    },
    examFacts: [
      'स्वस्थ मानव नेत्र के लिए स्पष्ट दृष्टि की न्यूनतम दूरी (Least Distance of Distinct Vision) 25 सेमी और दूर बिंदु अनंत (∞) होता है।',
      'जरा-दृष्टि दोष (Presbyopia) में द्विफोकसी लेंस (Bifocal Lens) का प्रयोग किया जाता है, जिसका ऊपरी भाग अवतल और निचला भाग उत्तल होता है।'
    ]
  },
  {
    id: 'doppler-acoustic',
    number: 49,
    category: 'physics',
    categoryLabel: 'भौतिक विज्ञान (Wave & Acoustics)',
    title: 'ध्वनि में डॉप्लर प्रभाव: गतिमान स्रोत एवं आभासी आवृत्ति लैब',
    subtitle: 'Doppler Effect Acoustic Shift f’ = f₀ (v / (v ∓ v_s)) Simulator',
    icon: '🚑',
    badge: 'DOPPLER ACOUSTICS',
    formula: 'f’ = f₀ × [v / (v ∓ v_s)]   |   Red Shift & Blue Shift in Astronomy',
    param1Label: 'गतिमान स्रोत का वेग (Source Velocity)',
    param1Unit: 'km/h',
    param1Min: 0,
    param1Max: 160,
    param1Default: 72,
    param2Label: 'मूल सायरन आवृत्ति (Original Frequency f₀)',
    param2Unit: 'Hz',
    param2Min: 200,
    param2Max: 1200,
    param2Default: 500,
    computeResult: (speedKmh, f0) => {
      const vs = (speedKmh * 1000) / 3600;
      const vSound = 340;
      const fApproaching = f0 * (vSound / (vSound - vs));
      const fReceding = f0 * (vSound / (vSound + vs));
      return {
        primaryLabel: 'श्रोता की ओर आते समय आभासी आवृत्ति (Pitch)',
        primaryValue: `${fApproaching.toFixed(1)} Hz (तीखी आवाज)`,
        secondaryLabel: 'दूर जाते समय आभासी आवृत्ति',
        secondaryValue: `${fReceding.toFixed(1)} Hz (मोटी आवाज)`,
        statusText: 'स्रोत जब स्थिर श्रोता की ओर आता है तो तरंगदैर्घ्य दबने से आवृत्ति बढ़ती है, और दूर जाने पर घटती है।'
      };
    },
    examFacts: [
      'डॉप्लर प्रभाव की खोज क्रिश्चियन डॉप्लर ने 1842 में की। यह ध्वनि और प्रकाश दोनों प्रकार की तरंगों में लागू होता है।',
      'खगोल विज्ञान में आकाशगंगाओं से आने वाले प्रकाश का "लाल विस्थापन" (Red Shift) दर्शाता है कि ब्रह्मांड का विस्तार हो रहा है।'
    ]
  },
  {
    id: 'radioactive-half-life',
    number: 50,
    category: 'chemistry',
    categoryLabel: 'रसायन एवं परमाणु विज्ञान (Nuclear Decay)',
    title: 'रेडियोधर्मी क्षय नियम, अर्द्ध-आयु (Half-Life) एवं कार्बन डेटिंग लैब',
    subtitle: 'Radioactive Decay N(t) = N₀ · (1/2)^(t/T) & Carbon-14 Dating Matrix',
    icon: '☢️',
    badge: 'NUCLEAR HALF-LIFE',
    formula: 'N(t) = N₀ × (1/2)^(t / T₁/₂)   |   λ = 0.693 / T₁/₂',
    param1Label: 'बीता हुआ समय (Elapsed Time t)',
    param1Unit: 'years',
    param1Min: 100,
    param1Max: 20000,
    param1Default: 5730,
    param2Label: 'रेडियोधर्मी समस्थानिक (1=C-14, 2=U-238, 3=I-131)',
    param2Unit: 'Isotope',
    param2Min: 1,
    param2Max: 3,
    param2Default: 1,
    computeResult: (timeYrs, isoCode) => {
      const code = Math.round(isoCode);
      const halfLives: Record<number, { name: string; tHalf: number; unit: string }> = {
        1: { name: 'कार्बन-14 (C-14 जीवाश्म डेटिंग)', tHalf: 5730, unit: 'वर्ष' },
        2: { name: 'यूरेनियम-238 (U-238 पृथ्वी आयु)', tHalf: 4468000000, unit: 'वर्ष' },
        3: { name: 'आयोडीन-131 (I-131 थायरॉयड उपचार)', tHalf: 8 / 365.25, unit: 'वर्ष (8 दिन)' }
      };
      const iso = halfLives[code] || halfLives[1];
      const remainingPercent = Math.pow(0.5, timeYrs / iso.tHalf) * 100;
      return {
        primaryLabel: `${iso.name} की शेष मात्रा`,
        primaryValue: `${remainingPercent.toFixed(2)}% अवशेष`,
        secondaryLabel: `अर्द्ध-आयु (T₁/₂)`,
        secondaryValue: `${iso.tHalf} ${iso.unit}`,
        statusText: timeYrs === 5730 && code === 1
          ? 'एक अर्द्ध-आयु (5730 वर्ष) बीतने पर C-14 की ठीक 50% मात्रा क्षय हो जाती है।'
          : 'रेडियोधर्मी क्षय प्रथम कोटि की अभिक्रिया (First Order Kinetics) का पालन करता है।'
      };
    },
    examFacts: [
      'जीवाश्मों एवं प्राचीन काष्ठ की आयु ज्ञात करने के लिए कार्बन डेटिंग (C-14) विधि की खोज विलार्ड लिब्बी ने की थी।',
      'पृथ्वी और प्राचीन चट्टानों की आयु निर्धारण के लिए यूरेनियम-लेड (Uranium-Lead) विधि का उपयोग किया जाता है।'
    ]
  },
  {
    id: 'acid-rain-soil',
    number: 51,
    category: 'chemistry',
    categoryLabel: 'पर्यावरण रसायन (Environmental Chemistry)',
    title: 'अम्लीय वर्षा (Acid Rain) प्रभाव एवं मृदा उदासीनीकरण (Liming) लैब',
    subtitle: 'Acid Rain (pH < 5.6), SO₂/NO₂ Emissions & CaCO₃ Liming Neutralization',
    icon: '🌧️',
    badge: 'ACID RAIN & SOIL',
    formula: 'SO₂ + H₂O → H₂SO₃ | 2NO₂ + H₂O → HNO₂ + HNO₃ | CaCO₃ + 2H⁺ → Ca²⁺ + CO₂ + H₂O',
    param1Label: 'वर्षा जल का pH मान (Rainwater pH)',
    param1Unit: 'pH',
    param1Min: 3.0,
    param1Max: 6.5,
    param1Default: 4.2,
    param2Label: 'चूना उपचार मात्रा (Lime Treatment CaCO₃)',
    param2Unit: 'kg/ha',
    param2Min: 50,
    param2Max: 500,
    param2Default: 200,
    computeResult: (rainPh, limeKg) => {
      const recoveredPh = Math.min(7.2, rainPh + (limeKg / 150));
      return {
        primaryLabel: 'मृदा का अंतिम संतुलित pH',
        primaryValue: `pH ${recoveredPh.toFixed(2)} (${recoveredPh >= 6.0 && recoveredPh <= 7.0 ? 'उत्कृष्ट कृषि योग्य' : 'अम्लीय'})`,
        secondaryLabel: 'अम्लता स्तर एवं संक्षारण प्रभाव',
        secondaryValue: rainPh < 4.5 ? 'तीव्र अम्लीय वर्षा (संगमरमर संक्षारण)' : 'हल्की अम्लता',
        statusText: 'अम्लीय वर्षा के कारण ताजमहल के संगमरमर का पीला पड़ना "स्टोन कैंसर" कहलाता है, जो SO₂ और NO₂ के कारण होता है।'
      };
    },
    examFacts: [
      'जब सामान्य वर्षा जल का pH मान 5.6 से कम हो जाता है, तो उसे "अम्लीय वर्षा" (Acid Rain) कहते हैं।',
      'अम्लीय वर्षा के मुख्य घटक सल्फ्यूरिक अम्ल (H₂SO₄) और नाइट्रिक अम्ल (HNO₃) होते हैं।'
    ]
  },
  {
    id: 'kepler-planetary',
    number: 52,
    category: 'geography',
    categoryLabel: 'भूगोल एवं अंतरिक्ष (Planetary Motion)',
    title: 'केप्लर के ग्रहीय गति के नियम एवं कक्षीय वेग सिमुलेटर लैब',
    subtitle: 'Kepler’s 3rd Law (T² ∝ R³), Orbital Speed v = √(GM/R) & Solar System',
    icon: '🪐',
    badge: 'KEPLER LAWS & ORBITS',
    formula: 'T² = (4π² / GM) × R³   |   v_orbital = √(GM / R)',
    param1Label: 'सूर्य से ग्रह की दूरी (Orbital Radius R)',
    param1Unit: 'AU',
    param1Min: 0.39,
    param1Max: 9.54,
    param1Default: 1.0,
    param2Label: 'कक्षीय उत्केंद्रता (Orbital Eccentricity e)',
    param2Unit: 'e',
    param2Min: 0.0,
    param2Max: 0.25,
    param2Default: 0.017,
    computeResult: (rAu, ecc) => {
      const tYears = Math.sqrt(Math.pow(rAu, 3));
      const vOrbital = 29.8 / Math.sqrt(rAu);
      return {
        primaryLabel: 'सूर्य की परिक्रमा अवधि (Orbital Period T)',
        primaryValue: `${tYears.toFixed(2)} पृथ्वी वर्ष (${(tYears * 365.25).toFixed(0)} दिन)`,
        secondaryLabel: 'कक्षीय चाल (Orbital Velocity)',
        secondaryValue: `${vOrbital.toFixed(1)} km/s (किलोमीटर/सेकंड)`,
        statusText: rAu === 1.0
          ? 'पृथ्वी की कक्षा: सूर्य से 1 AU दूरी पर कक्षीय चाल लगभग 29.8 किमी/सेकंड और आवर्तकाल ठीक 1 वर्ष है।'
          : `केप्लर के तृतीय नियम (T² ∝ R³) के अनुसार सूर्य से दूरी बढ़ने पर ग्रह की चाल घटती है और परिक्रमण काल बढ़ता है।`
      };
    },
    examFacts: [
      'जोहान्स केप्लर ने ग्रहों की गति के 3 नियम दिए: (1) दीर्घवृत्ताकार कक्षाओं का नियम, (2) क्षेत्रीय चाल नियत रहने का नियम, (3) आवर्तकाल का नियम (T² ∝ R³)।',
      'सूर्य के सबसे निकटतम बिंदु को उपसौर (Perihelion - 3 जनवरी) और सबसे दूरस्थ बिंदु को अपसौर (Aphelion - 4 जुलाई) कहते हैं।'
    ]
  }
];

export const ScienceFormulaLabView: React.FC = () => {
  // Dual Mode: 'labs' (52 Virtual Labs) or 'periodic-table' (118 Elements with Block View)
  const [activeLabTab, setActiveLabTab] = useState<'labs' | 'periodic-table'>('labs');
  // View Mode: 'hub' (Grid of all 52 labs) or 'bench' (Full-page interactive lab bench)
  const [viewMode, setViewMode] = useState<'hub' | 'bench'>('hub');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'physics' | 'chemistry' | 'biology' | 'geography' | 'mathematics' | 'future'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLabId, setSelectedLabId] = useState<string>('ohm-circuit');
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [benchTab, setBenchTab] = useState<'sim' | 'photo' | 'table' | 'manual'>('sim');
  const [recordedObservations, setRecordedObservations] = useState<
    Array<{ id: number; p1: number; p2: number; res1: string; res2: string; timestamp: string }>
  >([]);

  const activeLab = ALL_28_SCIENCE_LABS.find(l => l.id === selectedLabId) || ALL_28_SCIENCE_LABS[0];

  const [p1, setP1] = useState<number>(activeLab.param1Default);
  const [p2, setP2] = useState<number>(activeLab.param2Default);

  const openLabBench = (lab: ScienceLabConfig) => {
    setSelectedLabId(lab.id);
    setP1(lab.param1Default);
    setP2(lab.param2Default);
    setBenchTab('sim');
    setViewMode('bench');
    const res = lab.computeResult(lab.param1Default, lab.param2Default);
    recordStudyActivity(
      'science-lab',
      `Lab #${lab.number}: ${lab.title}`,
      `${lab.formula} — ${res.statusText}`,
      100
    );
  };

  const filteredLabs = ALL_28_SCIENCE_LABS.filter(lab => {
    const catMatch = categoryFilter === 'all' || lab.category === categoryFilter;
    const q = searchQuery.toLowerCase();
    const searchMatch =
      !q ||
      lab.title.toLowerCase().includes(q) ||
      lab.subtitle.toLowerCase().includes(q) ||
      lab.formula.toLowerCase().includes(q);
    return catMatch && searchMatch;
  });

  const liveResult = activeLab.computeResult(p1, p2);

  const speakLab = () => {
    const text = `${activeLab.title}। सूत्र: ${activeLab.formula}। ${liveResult.primaryLabel} ${liveResult.primaryValue}। प्रायोगिक निष्कर्ष: ${liveResult.statusText}। मुख्य परीक्षा तथ्य: ${activeLab.examFacts.join('। ')}`;
    playNaturalSpeech(text);
  };

  const handleRecordObservation = () => {
    const newObs = {
      id: Date.now(),
      p1,
      p2,
      res1: liveResult.primaryValue,
      res2: liveResult.secondaryValue,
      timestamp: new Date().toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    setRecordedObservations(prev => [newObs, ...prev.slice(0, 19)]);
  };

  return (
    <div
      className={`${
        isFullScreen
          ? 'fixed inset-0 z-50 bg-[#03060E] overflow-y-auto p-4 sm:p-8'
          : 'w-full space-y-5 pb-12'
      } animate-fade-in`}
    >
      {/* TOP FULL-WIDTH STUDIO HEADER */}
      <div className="bg-gradient-to-r from-cyan-950/70 via-slate-900 to-indigo-950/60 p-5 sm:p-6 rounded-3xl border border-cyan-500/30 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-black uppercase border border-cyan-500/40 mb-1.5">
              <FlaskConical className="w-4 h-4" />
              <span>HANS COMPAIN • 52+ वर्चुअल साइंस लैब सुइट (NCERT, NEET, JEE, SSC &amp; UPSC)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              इंटरएक्टिव साइंस लैब एवं 118 तत्व आवर्त सारणी सुइट 🔬
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              52+ प्रयोगशालाओं में स्लाइडर चलाकर लाइव प्रयोग करें, अथवा 118 तत्वों की आवर्त सारणी में s, p, d, f ब्लॉक व 3D बोहर मॉडल देखें।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {viewMode === 'bench' && activeLabTab === 'labs' && (
              <button
                onClick={() => setViewMode('hub')}
                className="px-4 py-2.5 rounded-2xl bg-slate-950 hover:bg-slate-900 border border-cyan-500/40 text-cyan-300 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>सभी 52 लैब्स देखें (All 52 Labs)</span>
              </button>
            )}
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="px-4 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              <span>{isFullScreen ? 'सामान्य व्यू' : '⛶ फुल-स्क्रीन लैब'}</span>
            </button>
          </div>
        </div>

        {/* Top Dual Switcher: 52 Labs vs Periodic Table */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
          <button
            onClick={() => setActiveLabTab('labs')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 border ${
              activeLabTab === 'labs'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-cyan-400 shadow-md'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <span>🔬</span>
            <span>52+ वर्चुअल साइंस लैब्स (All 52 Science Labs)</span>
            <span className="text-[9px] bg-cyan-400/20 text-cyan-200 px-1.5 py-0.2 rounded font-mono font-bold">52 LABS</span>
          </button>

          <button
            onClick={() => setActiveLabTab('periodic-table')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 border ${
              activeLabTab === 'periodic-table'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400 shadow-md'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <span>🧪</span>
            <span>आधुनिक आवर्त सारणी (118 Elements &amp; s, p, d, f Block Understanding)</span>
            <span className="text-[9px] bg-purple-400/20 text-purple-200 px-1.5 py-0.2 rounded font-mono font-bold">118 ELEMENTS</span>
          </button>
        </div>

        {/* Category Filter Tabs + Search Input (Only when on Labs tab) */}
        {activeLabTab === 'labs' && (
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all' as const, label: '🌐 सभी 52 प्रयोगशालाएं (All 52 Labs)' },
                { id: 'physics' as const, label: '⚡ भौतिक विज्ञान (Physics)' },
                { id: 'chemistry' as const, label: '🧪 रसायन विज्ञान (Chemistry)' },
                { id: 'biology' as const, label: '🧬 जीव विज्ञान (Biology)' },
                { id: 'geography' as const, label: '🌍 भूगोल एवं अंतरिक्ष (Geography)' },
                { id: 'mathematics' as const, label: '📐 गणित एवं ज्यामिति (Math)' },
                { id: 'future' as const, label: '🤖 क्वांटम, AI एवं पर्यावरण (Future Labs)' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setCategoryFilter(tab.id);
                    setViewMode('hub');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                    categoryFilter === tab.id && viewMode === 'hub'
                      ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-lg'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-1.5 min-w-[240px]">
              <Search className="w-4 h-4 text-cyan-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  if (viewMode !== 'hub') setViewMode('hub');
                }}
                placeholder="52+ लैब्स में से कोई भी प्रयोग या सूत्र खोजें..."
                className="bg-transparent border-none outline-none text-xs text-white w-full placeholder:text-slate-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Render Periodic Table Mode directly inside Science Lab */}
      {activeLabTab === 'periodic-table' && (
        <div className="animate-fade-in">
          <InteractivePeriodicTable />
        </div>
      )}

      {/* =====================================================================
          MODE 1: ALL 52 LABS DIRECTORY GRID (FULL-WIDTH WITH REALISTIC PHOTOS)
      ===================================================================== */}
      {activeLabTab === 'labs' && viewMode === 'hub' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in">
          {filteredLabs.map(lab => {
            const detail = SCIENCE_LAB_DETAILS[lab.id];
            return (
              <div
                key={lab.id}
                onClick={() => openLabBench(lab)}
                className="bg-[#091122] border-2 border-slate-800/90 hover:border-cyan-400 rounded-3xl p-4 flex flex-col justify-between gap-3 cursor-pointer transition-all hover:-translate-y-1 shadow-lg group overflow-hidden"
              >
                <div className="space-y-2.5">
                  {/* Scientific Apparatus Technical Vector Card Header (No Photos) */}
                  <div className="relative h-32 w-full rounded-2xl overflow-hidden border border-cyan-500/30 bg-gradient-to-br from-slate-950 via-[#0a1428] to-indigo-950/60 p-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-[10px] font-black text-cyan-300">
                        LAB #{lab.number}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black uppercase">
                        {lab.badge}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-amber-300 font-bold truncate">{lab.categoryLabel}</span>
                      <span className="text-3xl shrink-0 p-2 rounded-xl bg-slate-900/80 border border-slate-800">{lab.icon}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-base font-black text-white group-hover:text-cyan-300 transition-colors leading-snug">
                      {lab.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{lab.subtitle}</p>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-850 font-mono text-[11px] text-emerald-300 truncate">
                    {lab.formula}
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs font-black text-cyan-400 group-hover:text-white">
                  <span>प्रयोगशाला बेंच खोलें (Open Bench)</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =====================================================================
          MODE 2: FULL-PAGE INTERACTIVE VIRTUAL LAB BENCH
      ===================================================================== */}
      {activeLabTab === 'labs' && viewMode === 'bench' && (
        <div className="space-y-5 animate-fade-in">
          {/* Quick Horizontal Lab Switcher Ribbon */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {ALL_28_SCIENCE_LABS.map(lab => (
              <button
                key={lab.id}
                onClick={() => openLabBench(lab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer border transition-all flex items-center gap-1.5 shrink-0 ${
                  lab.id === activeLab.id
                    ? 'bg-cyan-500 text-slate-950 border-cyan-300 font-black shadow'
                    : 'bg-[#091122] border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <span>{lab.icon}</span>
                <span>#{lab.number} {lab.title}</span>
              </button>
            ))}
          </div>

          {/* Main Full-Page Bench Layout (12 Columns) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* LEFT 5 COLS: Interactive Sliders & Formula Readout */}
            <div className="lg:col-span-5 bg-[#091122] border-2 border-cyan-500/40 rounded-3xl p-5 sm:p-7 space-y-6 shadow-2xl">
              <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-2xl shrink-0">
                    {activeLab.icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-amber-400">
                      LAB #{activeLab.number} • {activeLab.categoryLabel}
                    </span>
                    <h2 className="text-base sm:text-lg font-black text-white leading-snug">
                      {activeLab.title}
                    </h2>
                  </div>
                </div>
                <button
                  onClick={speakLab}
                  className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 hover:text-white cursor-pointer shrink-0"
                  title="प्रयोग व्याख्या सुनें"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Formula Box */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-1">
                <span className="text-[10px] font-black uppercase text-amber-400 block">
                  📐 मुख्य वैज्ञानिक सूत्र (Core Formula):
                </span>
                <div className="text-xs sm:text-sm font-mono font-black text-white">
                  {activeLab.formula}
                </div>
              </div>

              {/* Interactive Sliders */}
              <div className="space-y-5">
                {/* Parameter 1 */}
                <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-cyan-300 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5" />
                      <span>1. {activeLab.param1Label}</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono font-black">
                      {p1} {activeLab.param1Unit}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={activeLab.param1Min}
                    max={activeLab.param1Max}
                    step={activeLab.param1Max <= 5 ? 0.1 : 1}
                    value={p1}
                    onChange={e => setP1(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>Min: {activeLab.param1Min} {activeLab.param1Unit}</span>
                    <span>Max: {activeLab.param1Max} {activeLab.param1Unit}</span>
                  </div>
                </div>

                {/* Parameter 2 */}
                <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-emerald-300 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5" />
                      <span>2. {activeLab.param2Label}</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono font-black">
                      {p2} {activeLab.param2Unit}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={activeLab.param2Min}
                    max={activeLab.param2Max}
                    step={activeLab.param2Max <= 5 ? 0.1 : 1}
                    value={p2}
                    onChange={e => setP2(parseFloat(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>Min: {activeLab.param2Min} {activeLab.param2Unit}</span>
                    <span>Max: {activeLab.param2Max} {activeLab.param2Unit}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setP1(activeLab.param1Default);
                  setP2(activeLab.param2Default);
                }}
                className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>मानक रीडिंग रीसेट करें (Reset Apparatus)</span>
              </button>
            </div>

            {/* RIGHT 7 COLS: Live Visual Apparatus Canvas + Live Numeric Output + Exam Viva Facts */}
            <div className="lg:col-span-7 space-y-5">
              {/* Live Simulation Canvas & Digital Meter */}
              <div className="bg-[#091122] border-2 border-indigo-500/40 rounded-3xl p-5 sm:p-7 space-y-5 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-black uppercase tracking-wider text-cyan-400">
                    ⚡ लाइव वर्चुअल उपकरण एवं डिजिटल मीटर (Live Simulation Bench)
                  </span>
                  <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    LIVE ACTIVE
                  </span>
                </div>

                {/* Dynamic Visual Apparatus Simulation Canvas (Dedicated per Lab) */}
                <div className="bg-[#040814] border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[220px]">
                  <ScienceLabApparatusVisualizer
                    activeLab={activeLab}
                    p1={p1}
                    p2={p2}
                    liveResult={liveResult}
                  />
                </div>

                {/* Live Calculated Digital Meters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/40 space-y-1">
                    <span className="text-[10px] font-black uppercase text-cyan-400 block">
                      {liveResult.primaryLabel}
                    </span>
                    <div className="text-base sm:text-lg font-black text-white font-mono">
                      {liveResult.primaryValue}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-1">
                    <span className="text-[10px] font-black uppercase text-emerald-400 block">
                      {liveResult.secondaryLabel}
                    </span>
                    <div className="text-base sm:text-lg font-black text-emerald-300 font-mono">
                      {liveResult.secondaryValue}
                    </div>
                  </div>
                </div>

                {/* Conclusion Observation Box */}
                <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 text-xs sm:text-sm text-indigo-100 leading-relaxed">
                  <strong className="text-amber-300">🔬 प्रायोगिक निष्कर्ष (Lab Observation): </strong>
                  {liveResult.statusText}
                </div>
              </div>

              {/* Exam Viva-Voce & High-Yield Points */}
              <div className="bg-[#091122] border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-3 shadow-xl">
                <div className="flex items-center gap-2 text-amber-400 font-black text-xs sm:text-sm uppercase">
                  <Award className="w-4 h-4" />
                  <span>बोर्ड एवं प्रतियोगी परीक्षा वाइवा प्रश्न (Exam Viva Points)</span>
                </div>
                <div className="space-y-2">
                  {activeLab.examFacts.map((fact, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-950 border border-slate-850 flex items-start gap-2.5 text-xs sm:text-sm text-slate-200 leading-relaxed"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{fact}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
