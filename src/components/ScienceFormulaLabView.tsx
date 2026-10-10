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

export interface ScienceLabConfig {
  id: string;
  number: number;
  category: 'physics' | 'chemistry' | 'biology' | 'geography' | 'mathematics';
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
  }
];

export const ScienceFormulaLabView: React.FC = () => {
  // View Mode: 'hub' (Grid of all 28 labs) or 'bench' (Full-page interactive lab bench)
  const [viewMode, setViewMode] = useState<'hub' | 'bench'>('hub');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'physics' | 'chemistry' | 'biology' | 'geography' | 'mathematics'>('all');
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
              <span>HANS COMPAIN • 28+ वर्चुअल साइंस लैब सुइट (NCERT &amp; Competitive)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              इंटरएक्टिव साइंस लैब (28 लाइव भौतिकी, रसायन, जीव विज्ञान व अंतरिक्ष प्रयोगशालाएं) 🔬
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              किसी भी प्रयोगशाला पर क्लिक करें और फुल-पेज वर्चुअल लैब बेंच पर स्लाइडर चलाकर लाइव प्रयोग करें।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {viewMode === 'bench' && (
              <button
                onClick={() => setViewMode('hub')}
                className="px-4 py-2.5 rounded-2xl bg-slate-950 hover:bg-slate-900 border border-cyan-500/40 text-cyan-300 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>सभी 28 लैब्स देखें (All 28 Labs)</span>
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

        {/* Category Filter Tabs + Search Input */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all' as const, label: '🌐 सभी 32 प्रयोगशालाएं (All 32 Labs)' },
              { id: 'physics' as const, label: '⚡ भौतिक विज्ञान (Physics)' },
              { id: 'chemistry' as const, label: '🧪 रसायन विज्ञान (Chemistry)' },
              { id: 'biology' as const, label: '🧬 जीव विज्ञान (Biology)' },
              { id: 'geography' as const, label: '🌍 भूगोल एवं अंतरिक्ष (Geography)' },
              { id: 'mathematics' as const, label: '📐 गणित एवं ज्यामिति (Math)' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setCategoryFilter(tab.id);
                  setViewMode('hub');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                  categoryFilter === tab.id && viewMode === 'hub'
                    ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-lg'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 min-w-[240px]">
            <Search className="w-4 h-4 text-cyan-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                if (viewMode !== 'hub') setViewMode('hub');
              }}
              placeholder="28 लैब्स में से कोई भी प्रयोग या सूत्र खोजें..."
              className="bg-transparent border-none outline-none text-xs text-white w-full placeholder:text-slate-500"
            />
          </div>
        </div>
      </div>

      {/* =====================================================================
          MODE 1: ALL 28 LABS DIRECTORY GRID (FULL-WIDTH WITH REALISTIC PHOTOS)
      ===================================================================== */}
      {viewMode === 'hub' && (
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
      {viewMode === 'bench' && (
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
