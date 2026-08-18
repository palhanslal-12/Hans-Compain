import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, Square, Play, Pause, RotateCcw, Volume2, 
  FileText, Download, Flame, BookOpen, Award, 
  CheckCircle2, AlertCircle, Sparkles, PenTool, 
  TrendingUp, Cpu, Share2, RefreshCw, Search, 
  ExternalLink, ChevronRight, Layers, Zap, Clock, 
  ArrowRight, Undo2, Trash2, Music, Upload, Eye, EyeOff
} from 'lucide-react';
import { saveStenoRecordToCloud } from '../lib/firebase';

interface DedicatedStenoMasterStudioProps {
  showToast: (msg: string, type: 'info' | 'success' | 'warn') => void;
  language: 'english' | 'hindi';
  onBackToChat: () => void;
}

// Comprehensive shorthand symbols dictionary with SVG stroke paths & outlines
interface ShorthandSymbol {
  id: string;
  charOrWord: string;
  hindiTranslation: string;
  category: 'consonant' | 'vowel' | 'grammalogue' | 'phrase' | 'court_legal' | 'ssc_special';
  system: 'pitman' | 'hindi_rishi' | 'hindi_manak' | 'gregg';
  strokeType: 'straight_light' | 'straight_heavy' | 'curved_light' | 'curved_heavy' | 'circle' | 'hook' | 'loop';
  direction: string;
  position: 'above_line' | 'on_line' | 'through_line';
  ruleHindi: string;
  ruleEnglish: string;
  svgPath: string;
  strokeWidth: number;
  sampleExample: string;
}

const STENO_DICTIONARY: ShorthandSymbol[] = [
  // 1. कवर्ग (K-Group: क, ख, ग, घ)
  {
    id: 'st-k',
    charOrWord: 'K / क',
    hindiTranslation: 'क (हल्की क्षैतिज रेखा)',
    category: 'consonant',
    system: 'hindi_rishi',
    strokeType: 'straight_light',
    direction: 'Horizontal Left to Right (बाएं से दाएं 180°)',
    position: 'on_line',
    ruleHindi: 'कॉपी की रेखा पर बाएं से दाएं हल्की सीधी 180° क्षैतिज रेखा।',
    ruleEnglish: 'Light horizontal straight stroke from left to right on the line.',
    svgPath: 'M 20,50 L 80,50',
    strokeWidth: 2.5,
    sampleExample: 'कलम, कमल, काम, कर्म, King'
  },
  {
    id: 'st-kh',
    charOrWord: 'KH / ख',
    hindiTranslation: 'ख (हल्की कटी क्षैतिज रेखा)',
    category: 'consonant',
    system: 'hindi_rishi',
    strokeType: 'straight_light',
    direction: 'Horizontal Cut (बाएं से दाएं 180° बीच में कट)',
    position: 'on_line',
    ruleHindi: 'बाएं से दाएं हल्की क्षैतिज रेखा जिसके आरंभ या मध्य में छोटा कट लगाया जाता है।',
    ruleEnglish: 'Light horizontal stroke with an initial or central tick mark.',
    svgPath: 'M 20,50 L 80,50 M 48,42 L 52,58',
    strokeWidth: 2.5,
    sampleExample: 'खबर, खेल, खाट, खत'
  },
  {
    id: 'st-g',
    charOrWord: 'G / ग',
    hindiTranslation: 'ग (गहरी क्षैतिज रेखा)',
    category: 'consonant',
    system: 'hindi_rishi',
    strokeType: 'straight_heavy',
    direction: 'Horizontal Heavy (बाएं से दाएं मोटी रेखा)',
    position: 'on_line',
    ruleHindi: 'कॉपी की रेखा पर बाएं से दाएं गहरी (मोटी) 180° क्षैतिज रेखा।',
    ruleEnglish: 'Heavy horizontal straight stroke from left to right on the line.',
    svgPath: 'M 20,50 L 80,50',
    strokeWidth: 5.5,
    sampleExample: 'गगन, गति, गरम, Give, Go'
  },
  {
    id: 'st-gh',
    charOrWord: 'GH / घ',
    hindiTranslation: 'घ (गहरी कटी क्षैतिज रेखा)',
    category: 'consonant',
    system: 'hindi_rishi',
    strokeType: 'straight_heavy',
    direction: 'Horizontal Heavy Cut (मोटी रेखा बीच में कट)',
    position: 'on_line',
    ruleHindi: 'बाएं से दाएं गहरी (मोटी) क्षैतिज रेखा जिसके मध्य में छोटा कट होता है।',
    ruleEnglish: 'Heavy horizontal stroke with a center tick mark.',
    svgPath: 'M 20,50 L 80,50 M 48,42 L 52,58',
    strokeWidth: 5.5,
    sampleExample: 'घर, घट, घंटी, घोष'
  },

  // 2. चवर्ग (CH-Group: च, छ, ज, झ)
  {
    id: 'st-ch',
    charOrWord: 'CH / च',
    hindiTranslation: 'च (हल्की तिरछी 60°)',
    category: 'consonant',
    system: 'hindi_rishi',
    strokeType: 'straight_light',
    direction: 'Downward 60° (ऊपर-बाएं से नीचे-दाएं)',
    position: 'on_line',
    ruleHindi: 'ऊपर से नीचे 60° के कोण पर हल्की सीधी तिरछी रेखा।',
    ruleEnglish: 'Light downward straight stroke inclined at 60 degrees.',
    svgPath: 'M 65,20 L 35,80',
    strokeWidth: 2.5,
    sampleExample: 'चल, चमक, चार, Chair'
  },
  {
    id: 'st-chh',
    charOrWord: 'CHH / छ',
    hindiTranslation: 'छ (हल्की कटी तिरछी 60°)',
    category: 'consonant',
    system: 'hindi_rishi',
    strokeType: 'straight_light',
    direction: 'Downward 60° Cut',
    position: 'on_line',
    ruleHindi: 'ऊपर से नीचे 60° कोण पर हल्की रेखा जिसके बीच में छोटा कट लगाया जाता है।',
    ruleEnglish: 'Light downward 60° stroke with a middle dash/cut.',
    svgPath: 'M 65,20 L 35,80 M 45,46 L 55,54',
    strokeWidth: 2.5,
    sampleExample: 'छत, छात्र, छाया, छल'
  },
  {
    id: 'st-j',
    charOrWord: 'J / ज',
    hindiTranslation: 'ज (गहरी तिरछी 60°)',
    category: 'consonant',
    system: 'hindi_rishi',
    strokeType: 'straight_heavy',
    direction: 'Downward 60° Heavy',
    position: 'on_line',
    ruleHindi: 'ऊपर से नीचे 60° कोण पर भारी (गहरी) तिरछी रेखा।',
    ruleEnglish: 'Heavy downward straight stroke at 60 degrees.',
    svgPath: 'M 65,20 L 35,80',
    strokeWidth: 5.5,
    sampleExample: 'जल, जीवन, जज, Judge, Join'
  },
  {
    id: 'st-jh',
    charOrWord: 'JH / झ',
    hindiTranslation: 'झ (गहरी कटी तिरछी 60°)',
    category: 'consonant',
    system: 'hindi_rishi',
    strokeType: 'straight_heavy',
    direction: 'Downward 60° Heavy Cut',
    position: 'on_line',
    ruleHindi: 'ऊपर से नीचे 60° कोण पर गहरी रेखा जिसके मध्य में छोटा कट होता है।',
    ruleEnglish: 'Heavy downward 60° stroke with a central cut.',
    svgPath: 'M 65,20 L 35,80 M 45,46 L 55,54',
    strokeWidth: 5.5,
    sampleExample: 'झंडा, झरना, झील'
  },

  // 3. टवर्ग (T-Group: ट, ठ, ड, ढ)
  {
    id: 'st-t',
    charOrWord: 'T / ट',
    hindiTranslation: 'ट (हल्की लंबवत 90°)',
    category: 'consonant',
    system: 'hindi_rishi',
    strokeType: 'straight_light',
    direction: 'Downward 90° (सीधा नीचे)',
    position: 'on_line',
    ruleHindi: 'ऊपर से नीचे की ओर 90 अंश पर लंबवत हल्की सीधी रेखा।',
    ruleEnglish: 'Light downward perpendicular straight stroke at 90 degrees.',
    svgPath: 'M 50,20 L 50,80',
    strokeWidth: 2.5,
    sampleExample: 'टमटम, टमाटर, टोकन, Top'
  },
  {
    id: 'st-th-dot',
    charOrWord: 'TH / ठ',
    hindiTranslation: 'ठ (हल्की कटी लंबवत 90°)',
    category: 'consonant',
    system: 'hindi_rishi',
    strokeType: 'straight_light',
    direction: 'Downward 90° Cut',
    position: 'on_line',
    ruleHindi: 'ऊपर से नीचे 90° लंबवत हल्की रेखा जिसके मध्य में छोटा कट होता है।',
    ruleEnglish: 'Light perpendicular stroke at 90° with a center tick.',
    svgPath: 'M 50,20 L 50,80 M 42,50 L 58,50',
    strokeWidth: 2.5,
    sampleExample: 'ठहर, ठीक, ठग'
  },
  {
    id: 'st-d-hard',
    charOrWord: 'D / ड',
    hindiTranslation: 'ड (गहरी लंबवत 90°)',
    category: 'consonant',
    system: 'hindi_rishi',
    strokeType: 'straight_heavy',
    direction: 'Downward 90° Heavy',
    position: 'on_line',
    ruleHindi: 'ऊपर से नीचे की ओर 90° पर गहरी (मोटी) लंबवत रेखा।',
    ruleEnglish: 'Heavy downward perpendicular stroke at 90 degrees.',
    svgPath: 'M 50,20 L 50,80',
    strokeWidth: 5.5,
    sampleExample: 'डर, डमरू, डाक, Day'
  },
  {
    id: 'st-dh-hard',
    charOrWord: 'DH / ढ',
    hindiTranslation: 'ढ (गहरी कटी लंबवत 90°)',
    category: 'consonant',
    system: 'hindi_rishi',
    strokeType: 'straight_heavy',
    direction: 'Downward 90° Heavy Cut',
    position: 'on_line',
    ruleHindi: 'ऊपर से नीचे 90° पर गहरी रेखा जिसके मध्य में छोटा कट होता है।',
    ruleEnglish: 'Heavy perpendicular stroke at 90° with center dash.',
    svgPath: 'M 50,20 L 50,80 M 42,50 L 58,50',
    strokeWidth: 5.5,
    sampleExample: 'ढोलक, ढक्कन, ढलान'
  },

  // 4. तवर्ग (T-Soft: त, थ, द, ध)
  {
    id: 'st-ta-soft',
    charOrWord: 'T (Soft) / त',
    hindiTranslation: 'त (हल्का वक्र चाप)',
    category: 'consonant',
    system: 'hindi_rishi',
    strokeType: 'curved_light',
    direction: 'Downward Curve (बायां/दायां चाप)',
    position: 'on_line',
    ruleHindi: 'ऊपर से नीचे की ओर अर्धचंद्राकार हल्का वक्र (बायां या दायां त)।',
    ruleEnglish: 'Light downward shallow curve (left or right arc).',
    svgPath: 'M 45,20 C 32,38 32,62 45,80',
    strokeWidth: 2.5,
    sampleExample: 'तरंग, तब, तारा'
  },
  {
    id: 'st-tha-soft',
    charOrWord: 'TH (Soft) / थ',
    hindiTranslation: 'थ (हल्का कटा वक्र चाप)',
    category: 'consonant',
    system: 'hindi_rishi',
    strokeType: 'curved_light',
    direction: 'Downward Curve Cut',
    position: 'on_line',
    ruleHindi: 'ऊपर से नीचे हल्का वक्र चाप जिसके बीच में छोटा कट लगाया जाता है।',
    ruleEnglish: 'Light downward curved stroke with middle tick.',
    svgPath: 'M 45,20 C 32,38 32,62 45,80 M 30,50 L 42,50',
    strokeWidth: 2.5,
    sampleExample: 'थाली, थोड़ा, थल'
  },
  {
    id: 'st-da-soft',
    charOrWord: 'D (Soft) / द',
    hindiTranslation: 'द (गहरा वक्र चाप)',
    category: 'consonant',
    system: 'hindi_rishi',
    strokeType: 'curved_heavy',
    direction: 'Downward Curve Heavy',
    position: 'on_line',
    ruleHindi: 'ऊपर से नीचे की ओर गहरा (मोटा) अर्धचंद्राकार वक्र रेखा।',
    ruleEnglish: 'Heavy downward shallow curved arc.',
    svgPath: 'M 45,20 C 32,38 32,62 45,80',
    strokeWidth: 5.5,
    sampleExample: 'देश, दीपक, दल, Door'
  },
  {
    id: 'st-dha-soft',
    charOrWord: 'DH (Soft) / ध',
    hindiTranslation: 'ध (गहरा कटा वक्र चाप)',
    category: 'consonant',
    system: 'hindi_rishi',
    strokeType: 'curved_heavy',
    direction: 'Downward Curve Heavy Cut',
    position: 'on_line',
    ruleHindi: 'ऊपर से नीचे गहरा वक्र चाप जिसके मध्य में छोटा कट लगाया जाता है।',
    ruleEnglish: 'Heavy downward curve with central tick.',
    svgPath: 'M 45,20 C 32,38 32,62 45,80 M 30,50 L 42,50',
    strokeWidth: 5.5,
    sampleExample: 'धर्म, धन, धारा'
  },

  // 5. पवर्ग (P-Group: प, फ, ब, भ)
  {
    id: 'st-p',
    charOrWord: 'P / प',
    hindiTranslation: 'प (हल्की तिरछी 120°)',
    category: 'consonant',
    system: 'hindi_rishi',
    strokeType: 'straight_light',
    direction: 'Downward 120° (ऊपर से नीचे)',
    position: 'on_line',
    ruleHindi: 'ऊपर से नीचे की ओर 120 अंश के कोण पर हल्की सीधी रेखा खींची जाती है।',
    ruleEnglish: 'Light downward straight stroke at 120 degrees angle.',
    svgPath: 'M 35,20 L 65,80',
    strokeWidth: 2.5,
    sampleExample: 'Pay, Pen, पल, पत्र, पानी'
  },
  {
    id: 'st-ph',
    charOrWord: 'PH / F / फ',
    hindiTranslation: 'फ (हल्की कटी तिरछी 120°)',
    category: 'consonant',
    system: 'hindi_rishi',
    strokeType: 'straight_light',
    direction: 'Downward 120° Cut',
    position: 'on_line',
    ruleHindi: 'ऊपर से नीचे 120° कोण पर हल्की रेखा जिसके मध्य में छोटा कट होता है।',
    ruleEnglish: 'Light downward stroke at 120° with central tick.',
    svgPath: 'M 35,20 L 65,80 M 45,46 L 55,54',
    strokeWidth: 2.5,
    sampleExample: 'फल, फूल, फोन, Free'
  },
  {
    id: 'st-b',
    charOrWord: 'B / ब',
    hindiTranslation: 'ब (गहरी तिरछी 120°)',
    category: 'consonant',
    system: 'hindi_rishi',
    strokeType: 'straight_heavy',
    direction: 'Downward 120° Heavy',
    position: 'on_line',
    ruleHindi: 'ऊपर से नीचे की ओर 120 अंश के कोण पर भारी (मोटी) सीधी रेखा।',
    ruleEnglish: 'Heavy downward straight stroke at 120 degrees angle.',
    svgPath: 'M 35,20 L 65,80',
    strokeWidth: 5.5,
    sampleExample: 'Boy, Book, बल, बालक, बस'
  },
  {
    id: 'st-bh',
    charOrWord: 'BH / भ',
    hindiTranslation: 'भ (गहरी कटी तिरछी 120°)',
    category: 'consonant',
    system: 'hindi_rishi',
    strokeType: 'straight_heavy',
    direction: 'Downward 120° Heavy Cut',
    position: 'on_line',
    ruleHindi: 'ऊपर से नीचे 120° कोण पर भारी रेखा जिसके मध्य में छोटा कट होता है।',
    ruleEnglish: 'Heavy downward 120° stroke with central tick.',
    svgPath: 'M 35,20 L 65,80 M 45,46 L 55,54',
    strokeWidth: 5.5,
    sampleExample: 'भारत, भवन, भाई, भाषा'
  },

  // 6. अनुनासिक व अन्तःस्थ (म, न, य, र, ल, व, श, स, ह)
  {
    id: 'st-m',
    charOrWord: 'M / म',
    hindiTranslation: 'म (उत्तल क्षैतिज चाप)',
    category: 'consonant',
    system: 'hindi_rishi',
    strokeType: 'curved_light',
    direction: 'Horizontal Arc (बाएं से दाएं ऊपर का चाप)',
    position: 'on_line',
    ruleHindi: 'बाएं से दाएं की ओर ऊपर की तरफ मुड़ा हुआ हल्का क्षैतिज चाप।',
    ruleEnglish: 'Light horizontal upward curve from left to right.',
    svgPath: 'M 20,60 C 35,40 65,40 80,60',
    strokeWidth: 2.5,
    sampleExample: 'मन, माता, मंदिर, Make, Man'
  },
  {
    id: 'st-n',
    charOrWord: 'N / न / ङ / ण',
    hindiTranslation: 'न (अवतल क्षैतिज चाप)',
    category: 'consonant',
    system: 'hindi_rishi',
    strokeType: 'curved_light',
    direction: 'Horizontal Arc (बाएं से दाएं नीचे का चाप)',
    position: 'on_line',
    ruleHindi: 'बाएं से दाएं की ओर नीचे की तरफ मुड़ा हुआ हल्का क्षैतिज चाप।',
    ruleEnglish: 'Light horizontal downward shallow curve.',
    svgPath: 'M 20,40 C 35,60 65,60 80,40',
    strokeWidth: 2.5,
    sampleExample: 'नगर, नाम, नियम, Name'
  },
  {
    id: 'st-y',
    charOrWord: 'Y / य',
    hindiTranslation: 'य (आरंभिक हुक + ऊर्ध्वगामी 30°)',
    category: 'consonant',
    system: 'hindi_rishi',
    strokeType: 'hook',
    direction: 'Upward 30° with initial hook',
    position: 'on_line',
    ruleHindi: 'शुरू में छोटा हुक बनाकर ऊपर की ओर 30 अंश की हल्की सीधी रेखा।',
    ruleEnglish: 'Small initial hook curving into an upward 30° ray.',
    svgPath: 'M 25,75 C 28,70 32,70 34,73 L 75,30',
    strokeWidth: 2.5,
    sampleExample: 'यज्ञ, योग, युवा, Yes'
  },
  {
    id: 'st-r-up',
    charOrWord: 'R (Upward) / र',
    hindiTranslation: 'र (ऊर्ध्वगामी 30°)',
    category: 'consonant',
    system: 'hindi_rishi',
    strokeType: 'straight_light',
    direction: 'Upward 30° (नीचे से ऊपर 30°)',
    position: 'on_line',
    ruleHindi: 'नीचे से ऊपर की ओर 30 अंश के कोण पर हल्की सीधी किरण रेखा।',
    ruleEnglish: 'Light straight ray drawn upwards at 30 degrees.',
    svgPath: 'M 25,75 L 75,25',
    strokeWidth: 2.5,
    sampleExample: 'रक्षा, राष्ट्र, रात, Ray'
  },
  {
    id: 'st-l',
    charOrWord: 'L / ल',
    hindiTranslation: 'ल (ऊर्ध्वगामी वक्र)',
    category: 'consonant',
    system: 'hindi_rishi',
    strokeType: 'curved_light',
    direction: 'Upward Curve (नीचे से ऊपर चाप)',
    position: 'on_line',
    ruleHindi: 'नीचे से ऊपर की ओर अर्धचंद्राकार हल्का वक्र चाप।',
    ruleEnglish: 'Light upward curved arc from bottom-left to top-right.',
    svgPath: 'M 25,75 C 35,65 55,45 70,25',
    strokeWidth: 2.5,
    sampleExample: 'लाल, लोग, लाख, Line'
  },
  {
    id: 'st-v',
    charOrWord: 'V / W / व',
    hindiTranslation: 'व (उल्टा हुक + ऊर्ध्वगामी 30°)',
    category: 'consonant',
    system: 'hindi_rishi',
    strokeType: 'hook',
    direction: 'Upward 30° with outer hook',
    position: 'on_line',
    ruleHindi: 'शुरू में दायां हुक बनाकर ऊपर की ओर 30 अंश पर हल्की रेखा।',
    ruleEnglish: 'Small clockwise hook rising upward at 30 degrees.',
    svgPath: 'M 25,75 C 22,70 26,67 30,70 L 75,30',
    strokeWidth: 2.5,
    sampleExample: 'विकास, विचार, वन, Vote'
  },
  {
    id: 'st-s',
    charOrWord: 'S / SH / स / श / ष',
    hindiTranslation: 'स या श (हल्का वक्र चाप)',
    category: 'consonant',
    system: 'hindi_rishi',
    strokeType: 'curved_light',
    direction: 'Downward Curve (बायां/दायां चाप)',
    position: 'on_line',
    ruleHindi: 'ऊपर से नीचे की ओर हल्का अर्धचंद्राकार वक्र रेखा या वृत्त (सर्किल)।',
    ruleEnglish: 'Light downward curve or small circle attachment.',
    svgPath: 'M 45,20 C 30,40 30,60 45,80',
    strokeWidth: 2.5,
    sampleExample: 'समय, सत्य, शासन, See, Shall'
  },
  {
    id: 'st-h',
    charOrWord: 'H / ह',
    hindiTranslation: 'ह (वृत्त + ऊर्ध्वगामी/अधोगामी रेखा)',
    category: 'consonant',
    system: 'hindi_rishi',
    strokeType: 'circle',
    direction: 'Upward 30° with initial circle',
    position: 'on_line',
    ruleHindi: 'प्रारंभ में छोटा वृत्त (Circle) बनाकर 30° ऊपर या नीचे खींची जाने वाली रेखा।',
    ruleEnglish: 'Small initial circle flowing into a 30° straight stroke.',
    svgPath: 'M 30,72 A 5,5 0 1,1 30,62 L 75,25',
    strokeWidth: 2.5,
    sampleExample: 'हाथ, हम, हंस, Hope, He'
  },

  // 7. स्वर व मात्राएं (Vowels)
  {
    id: 'st-vowel-a',
    charOrWord: 'अ / आ (First Place Vowel)',
    hindiTranslation: 'आ की मात्रा (प्रथम स्थान)',
    category: 'vowel',
    system: 'hindi_rishi',
    strokeType: 'straight_light',
    direction: 'Heavy Dot/Dash above the line',
    position: 'above_line',
    ruleHindi: 'प्रथम स्थान: व्यंजन रेखा के आरंभ में गहरा बिंदु (Heavy Dot) या गहरा डैश।',
    ruleEnglish: 'Heavy dot or dash at first place (stroke kept above the line).',
    svgPath: 'M 20,60 L 80,60 M 35,45 A 3,3 0 1,1 35,46',
    strokeWidth: 4,
    sampleExample: 'आम, आज, काम, नाम'
  },
  {
    id: 'st-vowel-e',
    charOrWord: 'ए / ओ (Second Place Vowel)',
    hindiTranslation: 'ए / ओ की मात्रा (द्वितीय स्थान)',
    category: 'vowel',
    system: 'hindi_rishi',
    strokeType: 'straight_light',
    direction: 'Middle Dot/Dash on the line',
    position: 'on_line',
    ruleHindi: 'द्वितीय स्थान: व्यंजन रेखा के मध्य में गहरा बिंदु (ए) या गहरा डैश (ओ)।',
    ruleEnglish: 'Heavy dot (E) or dash (O) at the middle of the stroke on the line.',
    svgPath: 'M 20,60 L 80,60 M 50,45 A 3,3 0 1,1 50,46',
    strokeWidth: 4,
    sampleExample: 'एक, सेब, लोग, मोर'
  },
  {
    id: 'st-vowel-ee',
    charOrWord: 'इ / ई / उ / ऊ (Third Place Vowel)',
    hindiTranslation: 'ई / ऊ की मात्रा (तृतीय स्थान)',
    category: 'vowel',
    system: 'hindi_rishi',
    strokeType: 'straight_light',
    direction: 'End Dot/Dash through the line',
    position: 'through_line',
    ruleHindi: 'तृतीय स्थान: व्यंजन रेखा के अंत में बिंदु/डैश तथा रेखा लाइन काटकर लिखी जाती है।',
    ruleEnglish: 'Third place dot/dash; outline cuts through the line.',
    svgPath: 'M 20,60 L 80,60 M 65,45 A 3,3 0 1,1 65,46',
    strokeWidth: 4,
    sampleExample: 'ईख, गीत, रूप, मूल'
  },

  // 8. शब्दाक्षर व शब्द-चिह्न (Grammalogues)
  {
    id: 'st-ka-ki',
    charOrWord: 'का / की / के / The',
    hindiTranslation: 'का, की, के (शब्द-चिह्न)',
    category: 'grammalogue',
    system: 'hindi_rishi',
    strokeType: 'straight_light',
    direction: 'Short light tick on line',
    position: 'on_line',
    ruleHindi: 'लाइन के ऊपर छोटी तिरछी टिक (का) या लाइन पर (की/के)।',
    ruleEnglish: 'Light upward/downward tick placed on or above the line.',
    svgPath: 'M 40,40 L 60,60',
    strokeWidth: 2.5,
    sampleExample: 'भारत का, सदन की, सदस्यों के'
  },
  {
    id: 'st-ne-se',
    charOrWord: 'ने / से / में / पर',
    hindiTranslation: 'ने, से, में, पर (विभक्ति चिन्ह)',
    category: 'grammalogue',
    system: 'hindi_rishi',
    strokeType: 'straight_light',
    direction: 'Perpendicular small tick',
    position: 'on_line',
    ruleHindi: 'लाइन के ऊपर छोटा लंबवत टिक (ने), लाइन पर (से), लाइन के बीच (में/पर)।',
    ruleEnglish: 'Grammalogue ticks representing post-positions in Hindi shorthand.',
    svgPath: 'M 50,35 L 50,65',
    strokeWidth: 3,
    sampleExample: 'सरकार ने, न्यायालय से, देश में, मंच पर'
  },

  // 9. कोर्ट व लीगल वाक्यांश (High Court & Legal Phraseograms)
  {
    id: 'st-court',
    charOrWord: 'High Court / माननीय उच्च न्यायालय',
    hindiTranslation: 'उच्च न्यायालय (कोर्ट वाक्यांश)',
    category: 'court_legal',
    system: 'hindi_rishi',
    strokeType: 'hook',
    direction: 'Interlocking H-C symbol',
    position: 'above_line',
    ruleHindi: 'न्यायालय के फैसलों में त्वरित डिक्टेशन के लिए लाइन के ऊपर एच+सी संयुक्त चिन्ह।',
    ruleEnglish: 'Interlocking high-speed legal phraseogram for courtroom records.',
    svgPath: 'M 30,30 L 30,70 M 30,50 L 55,50 M 55,30 L 55,70 M 60,40 C 75,35 75,65 60,65',
    strokeWidth: 3,
    sampleExample: 'Honorable High Court, न्यायपीठ, रिट याचिका'
  },
  {
    id: 'st-supreme-court',
    charOrWord: 'Supreme Court / माननीय उच्चतम न्यायालय',
    hindiTranslation: 'उच्चतम न्यायालय (सर्वोच्च अदालत)',
    category: 'court_legal',
    system: 'hindi_rishi',
    strokeType: 'hook',
    direction: 'S-C loop above the line',
    position: 'above_line',
    ruleHindi: 'स का बड़ा वृत्त बनाकर च व्यंजन को लाइन के ऊपर तीव्र गति से लिखा जाता है।',
    ruleEnglish: 'Large S-circle connected to CH stroke above the line.',
    svgPath: 'M 35,40 A 8,8 0 1,1 35,56 L 65,75',
    strokeWidth: 3.5,
    sampleExample: 'माननीय उच्चतम न्यायालय, Supreme Court Ruling'
  },
  {
    id: 'st-crpc',
    charOrWord: 'CrPC / दंड प्रक्रिया संहिता',
    hindiTranslation: 'दंड प्रक्रिया संहिता (धारा 482/302)',
    category: 'court_legal',
    system: 'hindi_rishi',
    strokeType: 'hook',
    direction: 'D-P-S Triple Contraction',
    position: 'through_line',
    ruleHindi: 'द व्यंजन को प और स के साथ मिलाकर लाइन काटकर तीव्र गति में लिखते हैं।',
    ruleEnglish: 'Triple contracted outline cutting the line for high-speed legal transcript.',
    svgPath: 'M 30,30 L 50,55 L 70,45 L 80,70',
    strokeWidth: 3,
    sampleExample: 'दंड प्रक्रिया संहिता, भारतीय दंड संहिता'
  },

  // 10. SSC व संसदीय वाक्यांश (SSC & Parliamentary Phrases)
  {
    id: 'st-ssc-govt',
    charOrWord: 'Government of India / भारत सरकार',
    hindiTranslation: 'भारत सरकार (SSC स्पेशल वाक्यांश)',
    category: 'ssc_special',
    system: 'hindi_rishi',
    strokeType: 'hook',
    direction: 'G-V-T contracted outline',
    position: 'on_line',
    ruleHindi: 'भ+स का संक्षिप्त संयुक्त रूप बनाकर "भारत सरकार" का त्वरित वाक्यांश।',
    ruleEnglish: 'Contracted fast phraseogram for administrative dictation.',
    svgPath: 'M 25,60 C 25,35 50,35 50,60 C 50,85 75,85 75,60',
    strokeWidth: 3.5,
    sampleExample: 'भारत सरकार, Gazette of India, राजपत्र'
  },
  {
    id: 'st-speaker',
    charOrWord: 'अध्यक्ष महोदय / Mr. Speaker Sir',
    hindiTranslation: 'अध्यक्ष महोदय (संसदीय वाक्यांश)',
    category: 'ssc_special',
    system: 'hindi_rishi',
    strokeType: 'hook',
    direction: 'Adhyaksh + Mahoday joined symbol',
    position: 'above_line',
    ruleHindi: 'अ स्वर के साथ ध व्यंजन और म लूप को बिना पेंसिल उठाए एक साथ जोड़कर लिखें।',
    ruleEnglish: 'Joined outline combining initial vowel with DH and M loop.',
    svgPath: 'M 25,35 L 50,65 C 58,75 70,60 65,45',
    strokeWidth: 3.5,
    sampleExample: 'अध्यक्ष महोदय, उपाध्यक्ष महोदय, सभापति महोदय'
  },
  {
    id: 'st-constitution',
    charOrWord: 'संविधान / Constitution of India',
    hindiTranslation: 'संविधान / संवैधानिक पीठ',
    category: 'ssc_special',
    system: 'hindi_rishi',
    strokeType: 'hook',
    direction: 'S-V-DH-N Outline',
    position: 'on_line',
    ruleHindi: 'स का वृत्त + व का हुक + ध रेखा + न का अंतिम हुक।',
    ruleEnglish: 'High speed outline with S-circle, V-hook and final N-hook.',
    svgPath: 'M 25,50 A 6,6 0 1,1 35,50 L 55,35 L 75,65',
    strokeWidth: 3.5,
    sampleExample: 'भारतीय संविधान, संविधान सभा, अनुच्छेद'
  }
];

// Curated Dictation Drills by WPM Speed
interface DictationPassage {
  id: string;
  title: string;
  wpm: number;
  durationSeconds: number;
  wordCount: number;
  category: 'SSC Grade C' | 'SSC Grade D' | 'High Court' | 'Parliamentary / विधानसभा' | 'Beginner Drills';
  textHindi: string;
  textEnglish: string;
  shorthandTips: string[];
}

const DICTATION_PASSAGES: DictationPassage[] = [
  {
    id: 'dict-1',
    title: 'SSC Stenographer Grade D Mock Test (80 WPM)',
    wpm: 80,
    durationSeconds: 120,
    wordCount: 160,
    category: 'SSC Grade D',
    textHindi: 'महोदय, इस वर्ष हमारे देश में औद्योगिक विकास की गति में तीव्र वृद्धि देखी गई है। ग्रामीण क्षेत्रों में रोजगार के नए अवसर पैदा करने के लिए सरकार ने अनेक कल्याणकारी योजनाओं की शुरुआत की है। कृषि क्षेत्र में आधुनिक तकनीकों का समावेश कर किसानों की आय दोगुनी करने का लक्ष्य रखा गया है। इसके साथ ही देश की अर्थव्यवस्था को नई ऊर्जा देने के लिए लघु एवं मध्यम उद्योगों को विशेष वित्तीय सहायता दी जा रही है। हमें अपने संकल्प पर अडिग रहकर देश को आत्मनिर्भर बनाना होगा।',
    textEnglish: 'Sir, during this financial year, a remarkable growth in industrial development has been observed in our country. The government has initiated several welfare schemes to create employment opportunities in rural areas. Advanced agricultural techniques have been introduced to empower farmers. Small and medium enterprises are receiving dedicated capital support to boost the national economy.',
    shorthandTips: [
      'महोदय के लिए "म" व्यंजन को लाइन के ऊपर रखें।',
      '"औद्योगिक विकास" को एक साथ संयुक्त वाक्यांश (Phraseogram) बनाकर लिखें।',
      'लाइन पर "सरकार" के लिए "स-र" का संक्षिप्त रूप प्रयुक्त करें।'
    ]
  },
  {
    id: 'dict-2',
    title: 'SSC Stenographer Grade C Speed Drill (100 WPM)',
    wpm: 100,
    durationSeconds: 120,
    wordCount: 200,
    category: 'SSC Grade C',
    textHindi: 'अध्यक्ष महोदय, मैं आपका ध्यान देश की शिक्षा प्रणाली और युवाओं के भविष्य की ओर आकर्षित करना चाहता हूँ। आज विश्वभर में सूचना प्रौद्योगिकी और डिजिटल कौशल का महत्व लगातार बढ़ रहा है। हमारे नौजवानों को समय की मांग के अनुसार तकनीकी रूप से दक्ष बनाना हमारी पहली प्राथमिकता होनी चाहिए। जब तक हमारी शिक्षण संस्थाओं में अनुसंधान और नवाचार को बढ़ावा नहीं मिलेगा, तब तक हम वैश्विक स्तर पर अग्रणी स्थान प्राप्त नहीं कर पाएंगे। अतः इस दिशा में ठोस नीतियां बनाई जाएं।',
    textEnglish: 'Mr. Chairman, I wish to draw your attention towards the national education policy and youth empowerment. Information technology and digital literacy are expanding rapidly across the globe. Our top priority must be preparing young minds with modern industrial skills through rigorous scientific research and continuous innovation.',
    shorthandTips: [
      '"अध्यक्ष महोदय" को अधोगामी "ध" के साथ "म" लूप लगाकर एक बार में लिखें।',
      '"सूचना प्रौद्योगिकी" के लिए स-न + प्र-द का संक्षिप्त कट-स्ट्रोक लगाएं।',
      '100 WPM में हाथ को कॉपी से कम से कम उठाएं।'
    ]
  },
  {
    id: 'dict-3',
    title: 'High Court & District Court Legal Shorthand (110 WPM)',
    wpm: 110,
    durationSeconds: 120,
    wordCount: 220,
    category: 'High Court',
    textHindi: 'माननीय उच्च न्यायालय के समक्ष यह याचिका दंड प्रक्रिया संहिता की धारा 482 के अंतर्गत दायर की गई है। अभियोजन पक्ष द्वारा प्रस्तुत साक्ष्यों एवं गवाहों के बयानों का सूक्ष्म परीक्षण करने के उपरांत यह स्पष्ट होता है कि प्रथम सूचना रिपोर्ट में लगाए गए आरोप निराधार एवं दुर्भावनापूर्ण हैं। न्याय के हित में तथा कानून की प्रक्रिया के दुरुपयोग को रोकने के लिए इस न्यायालय द्वारा हस्तक्षेप किया जाना सर्वथा उचित एवं न्यायोचित प्रतीत होता है। अतः याचिका स्वीकार की जाती है।',
    textEnglish: 'This petition has been instituted before the Honorable High Court under Section 482 of the Code of Criminal Procedure. Upon thorough scrutiny of the testimonies and depositions produced by the prosecution, the allegations raised in the First Information Report appear unsubstantiated and malicious.',
    shorthandTips: [
      '"माननीय उच्च न्यायालय" = म + उ + न लाइन काटकर।',
      '"दंड प्रक्रिया संहिता" = द-प्र-स का ट्रिपल कॉन्ट्रैक्शन।',
      'लीगल टर्म्स में पूर्ण विराम के लिए हमेशा छोटा क्रॉस (x) बनाएं।'
    ]
  },
  {
    id: 'dict-4',
    title: 'Parliamentary Debate Speed Master (120+ WPM)',
    wpm: 120,
    durationSeconds: 120,
    wordCount: 240,
    category: 'Parliamentary / विधानसभा',
    textHindi: 'उपाध्यक्ष महोदय, सदन में प्रस्तुत इस महत्वपूर्ण विधेयक पर चर्चा के दौरान पक्ष और विपक्ष दोनों ही पक्षों ने अपने विचार रखे हैं। देश की संप्रभुता, एकता और अखंडता को बनाए रखने के लिए सभी दलों का एकजुट होना आवश्यक है। राष्ट्रीय सुरक्षा के मुद्दे पर किसी भी प्रकार का राजनीतिक मतभेद देशहित में उचित नहीं है। हमें अपनी सीमाओं की सुरक्षा हेतु आधुनिकतम रक्षा उपकरणों से सेना को सुसज्जित करना होगा और विकास की गति को और तेज करना होगा।',
    textEnglish: 'Honorable Deputy Speaker Sir, both treasury and opposition benches have expressed their perspectives on this vital bill. Safeguarding national sovereignty, unity, and border infrastructure necessitates bipartisan commitment without political divergence.',
    shorthandTips: [
      '"उपाध्यक्ष महोदय" = उ + प + म का इंटरलॉकिंग चिन्ह।',
      '"एकता और अखंडता" = ए + ख संयुक्त टिक।',
      '120 WPM पर केवल आउटलाइन के फ्लो पर ध्यान दें, स्पेलिंग दिमाग में ट्रांसक्राइब करते वक्त सोचें।'
    ]
  }
];

export const DedicatedStenoMasterStudio: React.FC<DedicatedStenoMasterStudioProps> = ({
  showToast,
  language,
  onBackToChat
}) => {
  // Tabs:
  // 'pad': Full-size Digital Notepad with Integrated Live Audio Dictation Player & Audio File Upload
  // 'lab': Shorthand Stroke Dictionary & Rules with mini pad
  // 'dictation': Dedicated Audio Speed Player Console
  // 'transcription': Typing Speed & Accuracy Evaluator
  // 'ai_assistant': AI Shorthand Mentor
  const [activeTab, setActiveTab] = useState<'pad' | 'lab' | 'dictation' | 'transcription' | 'ai_assistant'>('pad');

  // Search and Filters for Shorthand Symbols
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSystem, setSelectedSystem] = useState<'all' | 'pitman' | 'hindi_rishi'>('all');
  const [selectedSymbol, setSelectedSymbol] = useState<ShorthandSymbol>(STENO_DICTIONARY[0]);

  // Main Notepad Canvas Refs & State
  const mainCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const miniCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeColor, setStrokeColor] = useState('#F59E0B');
  const [canvasStrokeWidth, setCanvasStrokeWidth] = useState(3.5);
  const [isEraser, setIsEraser] = useState(false);
  const [strokeHistory, setStrokeHistory] = useState<ImageData[]>([]);

  // Dictation Player & Audio Synthesizer State
  const [selectedPassage, setSelectedPassage] = useState<DictationPassage>(DICTATION_PASSAGES[0]);
  const [isPlayingDictation, setIsPlayingDictation] = useState(false);
  const [dictationWpmMultiplier, setDictationWpmMultiplier] = useState<number>(1.0); // 0.8x, 1.0x, 1.2x
  const [dictationElapsed, setDictationElapsed] = useState<number>(0);
  const [showPassageText, setShowPassageText] = useState(false);
  const [customDictationText, setCustomDictationText] = useState('');
  const [isCustomTextMode, setIsCustomTextMode] = useState(false);

  // Custom Audio File Upload State (.mp3 / .wav / .m4a)
  const [uploadedAudioSrc, setUploadedAudioSrc] = useState<string | null>(null);
  const [uploadedAudioName, setUploadedAudioName] = useState<string>('');
  const [isAudioFilePlaying, setIsAudioFilePlaying] = useState(false);
  const [audioFileDuration, setAudioFileDuration] = useState(0);
  const [audioFileCurrentTime, setAudioFileCurrentTime] = useState(0);
  const [audioFilePlaybackRate, setAudioFilePlaybackRate] = useState(1.0);
  const customAudioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timerIntervalRef = useRef<any>(null);

  // Transcription Test & Evaluation State
  const [typedTranscription, setTypedTranscription] = useState('');
  const [transcriptionResult, setTranscriptionResult] = useState<{
    accuracy: number;
    wpm: number;
    mistakes: string[];
    missingWordsCount: number;
    extraWordsCount: number;
    totalOriginalWords: number;
    totalTypedWords: number;
  } | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // AI Steno Assistant
  const [stenoAiInput, setStenoAiInput] = useState('');
  const [stenoAiLoading, setStenoAiLoading] = useState(false);
  const [stenoAiResponses, setStenoAiResponses] = useState<Array<{ q: string; a: string; timestamp: string }>>([
    {
      q: 'हिंदी ऋषि प्रणाली में "भारत सरकार" और "उच्च न्यायालय" को तेजी से कैसे लिखें?',
      a: '📌 **शॉर्टहैंड वाक्यांश नियम (Fast Shorthand Rules):**\n\n1. **भारत सरकार:** "भ" व्यंजन को लाइन के ऊपर थोड़ा लंबा खींचकर उसके अंत में "स" का छोटा वृत्त (Circle) जोड़ें। यह 120 WPM पर बिना हाथ उठाए 0.3 सेकंड में बन जाता है।\n\n2. **उच्च न्यायालय:** "च" को लाइन काटकर (Through the line) बनाएं और उसके साथ "न" का हल्का हुक लगाएं।\n\n💡 **प्रो टिप:** एसएससी स्टेनोग्राफर स्किल टेस्ट में इन वाक्यांशों का अभ्यास रोजाना 20 बार करने से गति में 15 WPM की तुरंत वृद्धि होती है।',
      timestamp: 'Just now'
    }
  ]);

  // Helper to draw authentic notebook steno lines
  const drawNotebookLines = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#060B16';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Horizontal notebook ruled lines
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 1.2;
    for (let y = 34; y < canvas.height; y += 34) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Red left margin line
    ctx.strokeStyle = '#EF444450';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, 0);
    ctx.lineTo(40, canvas.height);
    ctx.stroke();
  };

  // Resize and initialize canvas on mount or tab change
  useEffect(() => {
    const targetCanvas = activeTab === 'pad' ? mainCanvasRef.current : miniCanvasRef.current;
    if (!targetCanvas) return;

    // Set internal resolution based on parent container width
    const parentWidth = targetCanvas.parentElement?.clientWidth || 900;
    targetCanvas.width = Math.max(parentWidth, 600);
    targetCanvas.height = activeTab === 'pad' ? 520 : 220;

    drawNotebookLines(targetCanvas);
    setStrokeHistory([]);
  }, [activeTab]);

  // EXACT Coordinate Mapping to prevent cursor/drawing offset anywhere across full canvas width
  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = ('touches' in e) ? (e.touches[0] ? e.touches[0].clientX : 0) : e.clientX;
    const clientY = ('touches' in e) ? (e.touches[0] ? e.touches[0].clientY : 0) : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const handleStartDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
    canvas: HTMLCanvasElement | null
  ) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Save snapshot for Undo
    if (activeTab === 'pad') {
      try {
        const snap = ctx.getImageData(0, 0, canvas.width, canvas.height);
        setStrokeHistory(prev => [...prev.slice(-15), snap]);
      } catch (err) {
        // ignore
      }
    }

    const { x, y } = getCanvasCoords(e, canvas);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = isEraser ? '#060B16' : strokeColor;
    ctx.lineWidth = isEraser ? 18 : canvasStrokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setIsDrawing(true);
  };

  const handleDraw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
    canvas: HTMLCanvasElement | null
  ) => {
    if (!isDrawing || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoords(e, canvas);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleStopDrawing = () => {
    setIsDrawing(false);
  };

  const handleUndo = (canvas: HTMLCanvasElement | null) => {
    if (!canvas || strokeHistory.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prevSnap = strokeHistory[strokeHistory.length - 1];
    ctx.putImageData(prevSnap, 0, 0);
    setStrokeHistory(prev => prev.slice(0, -1));
    showToast("Last stroke undone ↩️", "info");
  };

  const clearCanvas = (canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;
    drawNotebookLines(canvas);
    setStrokeHistory([]);
    showToast("Pad cleared! Clean notebook ready 📝", "info");
  };

  const handleDownloadCanvas = (canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `HANS_AI_STENO_PAD_${Date.now()}.png`;
    link.click();
    showToast("Shorthand notebook page saved to device! 📥", "success");
  };

  // Audio Speech Dictation Synthesizer
  const handleToggleDictation = () => {
    if (isPlayingDictation) {
      window.speechSynthesis.cancel();
      setIsPlayingDictation(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      showToast("Dictation paused ⏸️", "info");
      return;
    }

    if (!('speechSynthesis' in window)) {
      showToast("Speech synthesis not supported in this browser.", "warn");
      return;
    }

    window.speechSynthesis.cancel();

    const textToSpeak = isCustomTextMode && customDictationText.trim()
      ? customDictationText.trim()
      : (language === 'hindi' ? selectedPassage.textHindi : selectedPassage.textEnglish);

    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    // Calculate speech rate based on WPM
    const currentWpm = isCustomTextMode ? 80 * dictationWpmMultiplier : selectedPassage.wpm * dictationWpmMultiplier;
    const baseRate = currentWpm / 110;
    utterance.rate = Math.min(2.0, Math.max(0.5, baseRate));
    utterance.pitch = 1.0;
    utterance.lang = language === 'hindi' ? 'hi-IN' : 'en-US';

    utterance.onstart = () => {
      setIsPlayingDictation(true);
      setDictationElapsed(0);
      timerIntervalRef.current = setInterval(() => {
        setDictationElapsed(prev => prev + 1);
      }, 1000);
      showToast(`🎙️ Dictation active at ~${Math.round(currentWpm)} WPM! Keep writing!`, "success");
    };

    utterance.onend = () => {
      setIsPlayingDictation(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      showToast("✅ Dictation completed! Proceed to transcribe on pad or test tab.", "success");
    };

    utterance.onerror = () => {
      setIsPlayingDictation(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };

    speechUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handleStopDictation = () => {
    window.speechSynthesis.cancel();
    setIsPlayingDictation(false);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setDictationElapsed(0);
  };

  // Custom Audio File Upload (.mp3, .wav, .m4a)
  const handleAudioFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setUploadedAudioSrc(url);
    setUploadedAudioName(file.name);
    setIsAudioFilePlaying(false);
    setAudioFileCurrentTime(0);

    showToast(`🎵 Audio File Loaded: ${file.name}`, "success");
  };

  const toggleCustomAudioPlay = () => {
    const audio = customAudioRef.current;
    if (!audio) return;

    if (isAudioFilePlaying) {
      audio.pause();
      setIsAudioFilePlaying(false);
    } else {
      audio.playbackRate = audioFilePlaybackRate;
      audio.play().then(() => {
        setIsAudioFilePlaying(true);
      }).catch(err => {
        showToast("Error playing audio file: " + err.message, "warn");
      });
    }
  };

  // Transcription evaluation
  const handleEvaluateTranscription = () => {
    if (!typedTranscription.trim()) {
      showToast("Please type your transcription before submitting.", "warn");
      return;
    }

    setIsEvaluating(true);

    setTimeout(() => {
      const originalText = isCustomTextMode && customDictationText.trim()
        ? customDictationText.trim()
        : (language === 'hindi' ? selectedPassage.textHindi : selectedPassage.textEnglish);
      
      const cleanOriginalWords = originalText.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim().split(/\s+/);
      const cleanTypedWords = typedTranscription.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim().split(/\s+/);

      let correctCount = 0;
      const mistakesFound: string[] = [];

      cleanOriginalWords.forEach((origWord, idx) => {
        const typedWord = cleanTypedWords[idx];
        if (typedWord && typedWord.toLowerCase() === origWord.toLowerCase()) {
          correctCount++;
        } else {
          mistakesFound.push(`Word #${idx + 1}: Expected "${origWord}", but typed "${typedWord || '[MISSING]'}"`);
        }
      });

      const accuracy = Math.round((correctCount / Math.max(cleanOriginalWords.length, 1)) * 100);
      const approxWpm = Math.round((cleanTypedWords.length / Math.max(dictationElapsed / 60, 1)));

      setTranscriptionResult({
        accuracy: Math.min(100, Math.max(0, accuracy)),
        wpm: approxWpm > 0 ? approxWpm : 35,
        mistakes: mistakesFound.slice(0, 15),
        missingWordsCount: Math.max(0, cleanOriginalWords.length - cleanTypedWords.length),
        extraWordsCount: Math.max(0, cleanTypedWords.length - cleanOriginalWords.length),
        totalOriginalWords: cleanOriginalWords.length,
        totalTypedWords: cleanTypedWords.length
      });

      saveStenoRecordToCloud("guest_student", {
        title: selectedPassage.title,
        wpm: approxWpm > 0 ? approxWpm : 35,
        accuracy: Math.min(100, Math.max(0, accuracy)),
        totalWords: cleanTypedWords.length,
        mistakesCount: mistakesFound.length,
        passageSystem: selectedPassage.category
      });

      setIsEvaluating(false);
      showToast(`🎯 Result ready! Accuracy: ${accuracy}% | Errors: ${mistakesFound.length} • Saved ☁️`, "success");
    }, 600);
  };

  const handleAskStenoAi = async () => {
    if (!stenoAiInput.trim()) return;

    const query = stenoAiInput.trim();
    setStenoAiInput('');
    setStenoAiLoading(true);

    setTimeout(() => {
      let reply = `✍️ **शॉर्टहैंड नियम व समाधान:**\n\nआपके प्रश्न **"${query}"** के लिए:\n1. हमेशा पहले मुख्य व्यंजन (Consonant) की दिशा व कोण पर ध्यान दें।\n2. स्वर (Vowels) को शब्द समाप्त होने के बाद लाइट डॉट या डैश से इंगित करें।\n3. वाक्यांशों (Phrases) में दोनों शब्दों को बिना पेंसिल उठाए एक साथ जोड़ें।`;
      
      if (query.toLowerCase().includes('court') || query.includes('कोर्ट') || query.includes('न्यायालय')) {
        reply = `⚖️ **कोर्ट व लीगल शॉर्टहैंड टिप्स:**\n\n1. "माननीय उच्च न्यायालय" = 'म' को लाइन के ऊपर रखकर 'उ' का हुक लगाएं।\n2. "दंड प्रक्रिया संहिता" = 'द-प्र-स' का तीव्र कॉन्ट्रैक्शन प्रयोग करें।\n3. गवाहों के बयानों में फुलस्टॉप के लिए छोटा क्रॉस (x) बनाएं।`;
      } else if (query.toLowerCase().includes('speed') || query.includes('गति') || query.includes('wpm') || query.includes('100')) {
        reply = `🚀 **100+ WPM गति बढ़ाने के 3 अचूक नियम:**\n\n1. कभी भी आउटलाइन बनाने में संकोच न करें; फ्लो बनाए रखें।\n2. रोजाना कम से कम 400 शब्दों की 3 डिक्टेशन 1.1x स्पीड पर सुनें।\n3. शब्दों के बजाय पूरे वाक्यांशों (Phraseography) को एक स्ट्रोक में लिखने का अभ्यास करें।`;
      }

      setStenoAiResponses(prev => [{ q: query, a: reply, timestamp: 'Just now' }, ...prev]);
      setStenoAiLoading(false);
    }, 700);
  };

  // Filtered dictionary
  const filteredSymbols = STENO_DICTIONARY.filter(item => {
    const matchesQuery = item.charOrWord.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.hindiTranslation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.sampleExample.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSystem = selectedSystem === 'all' || item.system === selectedSystem;
    return matchesQuery && matchesCategory && matchesSystem;
  });

  return (
    <div className="space-y-5 animate-fade-in text-slate-200">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-[#0C1220] via-[#090D18] to-[#0A0F1D] border-2 border-amber-500/40 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-400 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-cyan-500/20 text-2xl shrink-0">
            ✍️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-xl font-black text-white uppercase tracking-wider">
                {language === 'hindi' ? 'All Stenographer • सम्पूर्ण आशुलिपि एवं डिक्टेशन लैब' : 'All Stenographer • Shorthand & Dictation Studio'}
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-black uppercase">
                60 - 140 WPM Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === 'hindi' 
                ? 'सभी स्ट्रोक व वर्णमाला (ऋषि, मानक, पिटमैन), डिजिटल पैड, लाइव ऑडियो डिक्टेशन व स्पीड टेस्ट' 
                : 'All Shorthand Strokes (Rishi, Manak, Pitman), Digital Writing Pad, Voice Dictation & Speed Drills'}
            </p>
          </div>
        </div>

        <button
          onClick={onBackToChat}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 self-start md:self-auto shrink-0"
        >
          <span>← मुख्य चैट पर लौटें</span>
        </button>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'pad', icon: PenTool, label: language === 'hindi' ? '✍️ 1. डिजिटल पैड व वॉइस डिक्टेशन' : '✍️ 1. Writing Pad & Live Dictation' },
          { id: 'lab', icon: BookOpen, label: language === 'hindi' ? '2. स्टेनो वर्णमाला व नियम' : '2. Shorthand Dictionary' },
          { id: 'dictation', icon: Volume2, label: language === 'hindi' ? '3. डिक्टेशन स्पीड प्लेयर' : '3. Speed Drills Player' },
          { id: 'transcription', icon: FileText, label: language === 'hindi' ? '4. टाइपिंग व एक्यूरेसी टेस्ट' : '4. Typing & Accuracy Check' },
          { id: 'ai_assistant', icon: Sparkles, label: language === 'hindi' ? '5. स्टेनो AI गुरु (Doubts)' : '5. AI Shorthand Master' }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20 scale-102 font-black'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: FULL-SIZE DIGITAL NOTEPAD & INTEGRATED LIVE AUDIO DICTATION */}
      {/* ========================================================================= */}
      {activeTab === 'pad' && (
        <div className="space-y-4">
          
          {/* Top Audio Dictation & File Upload Control Console */}
          <div className="bg-[#0A0F1D] border-2 border-amber-500/40 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4">
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              
              {/* Dictation Mode Selector */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsCustomTextMode(false)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    !isCustomTextMode 
                      ? 'bg-amber-500 text-slate-950 shadow-sm' 
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>SSC/कोर्ट डिक्टेशन पैसेज</span>
                </button>

                <button
                  onClick={() => setIsCustomTextMode(true)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isCustomTextMode 
                      ? 'bg-amber-500 text-slate-950 shadow-sm' 
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>कस्टम टेक्स्ट पेस्ट करें</span>
                </button>

                {/* Upload Any Audio File Button */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAudioFileUpload}
                  accept="audio/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-indigo-950/70 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/40 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>📁 डिवाइस से ऑडियो (.MP3/.WAV) चुनें</span>
                </button>
              </div>

              {/* Speed Multipliers (WPM) */}
              <div className="flex items-center gap-1 bg-[#060A14] p-1.5 rounded-2xl border border-slate-800 self-start lg:self-auto">
                <span className="text-[10px] font-bold text-slate-400 px-2">गति:</span>
                {[
                  { mult: 0.75, label: '60 WPM (धीमी)' },
                  { mult: 1.0, label: '80-100 WPM (सामान्य)' },
                  { mult: 1.25, label: '120 WPM (तेज)' },
                  { mult: 1.4, label: '140 WPM (सुपर स्पीड)' }
                ].map(spd => (
                  <button
                    key={spd.mult}
                    onClick={() => {
                      setDictationWpmMultiplier(spd.mult);
                      showToast(`डिक्टेशन गति: ${spd.label}`, "info");
                    }}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold transition-all cursor-pointer ${
                      dictationWpmMultiplier === spd.mult
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {spd.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Audio File Player (If Uploaded) */}
            {uploadedAudioSrc && (
              <div className="p-3.5 bg-gradient-to-r from-indigo-950/80 via-slate-900 to-indigo-950/80 border border-indigo-500/50 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                    <Music className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-black text-white truncate">{uploadedAudioName}</div>
                    <div className="text-[10px] text-indigo-300">कस्टम ऑडियो डिक्टेशन एक्टिव है</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <audio
                    ref={customAudioRef}
                    src={uploadedAudioSrc}
                    onEnded={() => setIsAudioFilePlaying(false)}
                    onTimeUpdate={(e) => setAudioFileCurrentTime(e.currentTarget.currentTime)}
                    onLoadedMetadata={(e) => setAudioFileDuration(e.currentTarget.duration)}
                  />

                  <button
                    onClick={toggleCustomAudioPlay}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-black rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md"
                  >
                    {isAudioFilePlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                    <span>{isAudioFilePlaying ? 'ऑडियो रोकें' : 'ऑडियो चलाएं'}</span>
                  </button>

                  <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 text-[10px] font-mono text-slate-300">
                    <span>{Math.floor(audioFileCurrentTime)}s</span> / <span>{Math.floor(audioFileDuration)}s</span>
                  </div>

                  <button
                    onClick={() => {
                      setUploadedAudioSrc(null);
                      setUploadedAudioName('');
                    }}
                    className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg border-none bg-transparent cursor-pointer"
                    title="Remove Audio File"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Passage Selection or Custom Text Input */}
            {!isCustomTextMode ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                {DICTATION_PASSAGES.map(passage => {
                  const isSelected = selectedPassage.id === passage.id;
                  return (
                    <button
                      key={passage.id}
                      onClick={() => {
                        if (isPlayingDictation) handleStopDictation();
                        setSelectedPassage(passage);
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                        isSelected
                          ? 'bg-gradient-to-br from-amber-500/20 to-orange-950/30 border-amber-500 ring-2 ring-amber-500/30 shadow-md'
                          : 'bg-[#060A14] border-slate-850 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
                          {passage.category}
                        </span>
                        <span className="text-xs font-black text-amber-300">
                          {Math.round(passage.wpm * dictationWpmMultiplier)} WPM
                        </span>
                      </div>
                      <div className="text-xs font-bold text-white line-clamp-1">{passage.title}</div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2">
                <textarea
                  value={customDictationText}
                  onChange={(e) => setCustomDictationText(e.target.value)}
                  placeholder="अपना कोई भी स्टेनो डिक्टेशन पैराग्राफ यहाँ पेस्ट करें जिसे आप आवाज में सुनकर पैड पर लिखना चाहते हैं..."
                  className="w-full h-20 p-3 bg-[#060A14] border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>
            )}

            {/* Dictation Controller Play/Pause/Timer Bar */}
            <div className="p-3 bg-[#060914] border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-3">
              
              <div className="flex items-center gap-3">
                <button
                  onClick={handleToggleDictation}
                  className={`px-5 py-2.5 rounded-xl font-black text-xs transition-all shadow-lg flex items-center gap-2 cursor-pointer ${
                    isPlayingDictation
                      ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                      : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 hover:scale-102'
                  }`}
                >
                  {isPlayingDictation ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>डिक्टेशन रोकें (Pause)</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>डिक्टेशन सुनें व पैड पर लिखें (Play) 🎙️</span>
                    </>
                  )}
                </button>

                {isPlayingDictation && (
                  <button
                    onClick={handleStopDictation}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
                    title="Stop"
                  >
                    <Square className="w-4 h-4 fill-current" />
                  </button>
                )}

                <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                  <span>⏱️ समय: <strong className="text-emerald-400">{dictationElapsed}s</strong></span>
                  <span>•</span>
                  <span>गति: <strong className="text-amber-400">{Math.round(selectedPassage.wpm * dictationWpmMultiplier)} WPM</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPassageText(!showPassageText)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  {showPassageText ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPassageText ? 'टेक्स्ट छिपाएं' : 'टेक्स्ट देखें'}</span>
                </button>
              </div>

            </div>

            {/* Revealed Text Guide */}
            {showPassageText && (
              <div className="p-4 bg-[#050811] border border-amber-500/30 rounded-2xl text-xs text-slate-300 leading-relaxed font-medium">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                  📄 डिक्टेशन पैसेज टेक्स्ट:
                </span>
                {isCustomTextMode ? customDictationText : (language === 'hindi' ? selectedPassage.textHindi : selectedPassage.textEnglish)}
              </div>
            )}

          </div>

          {/* ===================================================================== */}
          {/* THE BIG FULL-SIZE DIGITAL WRITING NOTEPAD CANVAS */}
          {/* ===================================================================== */}
          <div className="bg-[#0A0F1D] border-2 border-slate-800 rounded-3xl p-4 sm:p-5 space-y-3 shadow-2xl">
            
            {/* Notepad Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              
              <div className="flex items-center gap-2">
                <PenTool className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-black text-white uppercase tracking-wider">
                  पूर्ण डिजिटल स्टेनो कॉपी (1:1 Accurate Shorthand Pad)
                </h3>
              </div>

              {/* Stroke & Tool Controls */}
              <div className="flex flex-wrap items-center gap-2">
                
                {/* Pen Thickness */}
                <div className="flex items-center gap-1 bg-[#060A14] p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => { setIsEraser(false); setCanvasStrokeWidth(2.0); }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      !isEraser && canvasStrokeWidth === 2.0 ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400'
                    }`}
                  >
                    हल्का (Light 2px)
                  </button>
                  <button
                    onClick={() => { setIsEraser(false); setCanvasStrokeWidth(3.5); }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      !isEraser && canvasStrokeWidth === 3.5 ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400'
                    }`}
                  >
                    सामान्य (3.5px)
                  </button>
                  <button
                    onClick={() => { setIsEraser(false); setCanvasStrokeWidth(6.0); }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      !isEraser && canvasStrokeWidth === 6.0 ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400'
                    }`}
                  >
                    गहरा (Heavy 6px)
                  </button>
                  <button
                    onClick={() => setIsEraser(true)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      isEraser ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-400'
                    }`}
                  >
                    रबर (Eraser)
                  </button>
                </div>

                {/* Color Selector */}
                <div className="flex items-center gap-1 bg-[#060A14] p-1 rounded-xl border border-slate-800">
                  {[
                    { color: '#F59E0B', label: 'Amber' },
                    { color: '#10B981', label: 'Neon Green' },
                    { color: '#38BDF8', label: 'Cyan' },
                    { color: '#F8FAFC', label: 'White' },
                    { color: '#EC4899', label: 'Pink' }
                  ].map(c => (
                    <button
                      key={c.color}
                      onClick={() => { setIsEraser(false); setStrokeColor(c.color); }}
                      style={{ backgroundColor: c.color }}
                      className={`w-5 h-5 rounded-full transition-transform cursor-pointer border ${
                        strokeColor === c.color && !isEraser ? 'scale-125 border-white shadow-md' : 'border-transparent opacity-80 hover:opacity-100'
                      }`}
                      title={c.label}
                    />
                  ))}
                </div>

                {/* Actions: Undo, Clear, Save Image */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleUndo(mainCanvasRef.current)}
                    disabled={strokeHistory.length === 0}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200 rounded-lg text-xs transition-all cursor-pointer border border-slate-700 disabled:cursor-not-allowed"
                    title="Undo Stroke"
                  >
                    <Undo2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => clearCanvas(mainCanvasRef.current)}
                    className="px-2.5 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>साफ करें</span>
                  </button>

                  <button
                    onClick={() => handleDownloadCanvas(mainCanvasRef.current)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-md"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>कॉपी सेव करें (.PNG)</span>
                  </button>
                </div>

              </div>
            </div>

            {/* High Precision Full-Canvas Element */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-slate-800 shadow-2xl bg-[#060B16]">
              <canvas
                ref={mainCanvasRef}
                onMouseDown={(e) => handleStartDrawing(e, mainCanvasRef.current)}
                onMouseMove={(e) => handleDraw(e, mainCanvasRef.current)}
                onMouseUp={handleStopDrawing}
                onMouseLeave={handleStopDrawing}
                onTouchStart={(e) => handleStartDrawing(e, mainCanvasRef.current)}
                onTouchMove={(e) => handleDraw(e, mainCanvasRef.current)}
                onTouchEnd={handleStopDrawing}
                className="w-full h-[520px] cursor-crosshair touch-none"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 px-1 pt-1">
              <span>✍️ पूरे पेज पर कहीं भी लिखें (बाएं से दाएं बिना किसी ऑफसेट के)। उंगली या स्टाइलस पेन समर्थित है।</span>
              <span className="font-mono text-amber-400">1:1 High-Precision Vector Mapping</span>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SHORTHAND STROKE DICTIONARY & RULES */}
      {/* ========================================================================= */}
      {activeTab === 'lab' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Search & Symbol List (5 Cols) */}
          <div className="lg:col-span-5 bg-[#0A0F1D] border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl flex flex-col h-[680px]">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-400" />
                {language === 'hindi' ? 'शॉर्टहैंड स्ट्रोक डायरेक्टरी' : 'Shorthand Strokes Directory'}
              </h3>
              <span className="text-[10px] text-slate-500 font-mono font-bold">
                {filteredSymbols.length} Outlines
              </span>
            </div>

            {/* Search and Filters */}
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'hindi' ? 'खोजें: प, ब, ट, Court, SSC...' : 'Search letters, words, legal terms...'}
                  className="w-full text-xs py-2 pl-8 pr-3 bg-[#060A14] border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-1">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'consonant', label: 'Consonants (व्यंजन)' },
                  { id: 'grammalogue', label: 'Word-Signs (शब्दचिह्न)' },
                  { id: 'court_legal', label: 'Court Legal (कोर्ट)' },
                  { id: 'ssc_special', label: 'SSC Special' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-900 text-slate-400 border border-slate-850 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable Symbols Grid */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {filteredSymbols.length > 0 ? (
                filteredSymbols.map(sym => {
                  const isSelected = selectedSymbol.id === sym.id;
                  return (
                    <div
                      key={sym.id}
                      onClick={() => setSelectedSymbol(sym)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-transparent border-amber-500/60 ring-1 ring-amber-500/40'
                          : 'bg-[#060A14] border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 relative overflow-hidden">
                          <div className="absolute inset-x-0 top-1/2 border-b border-slate-800" />
                          <svg viewBox="0 0 100 100" className="w-10 h-10">
                            <path
                              d={sym.svgPath}
                              fill="none"
                              stroke={isSelected ? '#F59E0B' : '#38BDF8'}
                              strokeWidth={sym.strokeWidth}
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-white">{sym.charOrWord}</h4>
                            <span className={`text-[8px] font-mono font-bold px-1.5 py-0.2 rounded ${
                              sym.strokeType.includes('heavy') ? 'bg-amber-500/20 text-amber-300' : 'bg-sky-500/20 text-sky-300'
                            }`}>
                              {sym.strokeType.includes('heavy') ? 'HEAVY' : 'LIGHT'}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{sym.hindiTranslation}</p>
                        </div>
                      </div>

                      <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'text-amber-400 translate-x-0.5' : 'text-slate-600'}`} />
                    </div>
                  );
                })
              ) : (
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/30 text-center space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 mx-auto flex items-center justify-center text-xl">
                    ✍️
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">"{searchQuery}" का लाइव स्ट्रोक नियम</h4>
                    <p className="text-[10px] text-slate-400 mt-1">
                      शब्द के प्रत्येक व्यंजन (क, ख, ग, म, र, ल आदि) की दिशा व कोण को मिलाकर संयुक्त आउटलाइन (Outline) बनाएं।
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const dynamicSym: ShorthandSymbol = {
                        id: `st-dyn-${Date.now()}`,
                        charOrWord: searchQuery,
                        hindiTranslation: `${searchQuery} (कस्टम शॉर्टहैंड स्ट्रोक)`,
                        category: 'consonant',
                        system: 'hindi_rishi',
                        strokeType: 'straight_light',
                        direction: 'Phonetic Sequential Flow',
                        position: 'on_line',
                        ruleHindi: `"${searchQuery}" के लिए पहले व्यंजन की दिशा का पालन करें, पेंसिल बिना उठाए अगले व्यंजन की रेखा जोड़ें तथा स्वर का बिंदु/डैश अंत में लगाएं।`,
                        ruleEnglish: `For "${searchQuery}", join the constituent phonetic consonant strokes seamlessly on or through the line.`,
                        svgPath: 'M 20,50 L 50,50 L 75,25',
                        strokeWidth: 3,
                        sampleExample: searchQuery
                      };
                      setSelectedSymbol(dynamicSym);
                    }}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md"
                  >
                    इस शब्द का चिन्ह बनाएं
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Detailed Interactive Stroke Viewer & Practice Canvas (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* STROKE MASTER DETAILS CARD */}
            <div className="bg-gradient-to-br from-[#0B1222] via-[#090D16] to-[#0A0E1A] border-2 border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-5">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                    {selectedSymbol.category.toUpperCase()} • {selectedSymbol.system.toUpperCase()} SYSTEM
                  </span>
                  <h2 className="text-xl font-black text-white mt-1">
                    {selectedSymbol.charOrWord} ({selectedSymbol.hindiTranslation})
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono">
                    📐 {selectedSymbol.direction}
                  </span>
                </div>
              </div>

              {/* Visual Stroke Diagram Display */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                
                {/* Visual SVG Blueprint */}
                <div className="relative h-44 rounded-2xl bg-[#03060E] border border-amber-500/30 flex flex-col items-center justify-center overflow-hidden p-4 shadow-inner">
                  <div className="absolute inset-x-0 top-1/2 border-b-2 border-amber-500/40" />
                  <span className="absolute right-2 top-[48%] text-[8px] font-mono text-amber-400/60 uppercase">Line of Writing (कॉपी की लाइन)</span>

                  <svg viewBox="0 0 100 100" className="w-28 h-28 relative z-10 filter drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">
                    <path
                      d={selectedSymbol.svgPath}
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth={selectedSymbol.strokeWidth}
                      strokeLinecap="round"
                    />
                  </svg>

                  <div className="absolute bottom-2 left-3 text-[10px] text-slate-400 font-mono">
                    Type: <span className="text-amber-300 font-bold">{selectedSymbol.strokeType.replace('_', ' ')}</span>
                  </div>
                </div>

                {/* Rules & Examples */}
                <div className="space-y-3 bg-[#060A14] border border-slate-800/80 rounded-2xl p-4 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                      📖 नियम (Rules of Formation):
                    </span>
                    <p className="text-slate-200 leading-relaxed font-medium">
                      {selectedSymbol.ruleHindi}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-850">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                      ✨ उदाहरण शब्द (Example Words):
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-200 font-bold inline-block">
                      {selectedSymbol.sampleExample}
                    </span>
                  </div>
                </div>

              </div>

            </div>

            {/* MINI DIGITAL PRACTICE PAD (CANVAS) */}
            <div className="bg-[#0A0F1D] border border-slate-800 rounded-3xl p-5 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">
                    {language === 'hindi' ? 'डिजिटल स्टेनो अभ्यास पैड (Live Practice Pad)' : 'Digital Shorthand Practice Canvas'}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => clearCanvas(miniCanvasRef.current)}
                    className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-inner bg-[#060B16]">
                <canvas
                  ref={miniCanvasRef}
                  onMouseDown={(e) => handleStartDrawing(e, miniCanvasRef.current)}
                  onMouseMove={(e) => handleDraw(e, miniCanvasRef.current)}
                  onMouseUp={handleStopDrawing}
                  onMouseLeave={handleStopDrawing}
                  onTouchStart={(e) => handleStartDrawing(e, miniCanvasRef.current)}
                  onTouchMove={(e) => handleDraw(e, miniCanvasRef.current)}
                  onTouchEnd={handleStopDrawing}
                  className="w-full h-[220px] cursor-crosshair touch-none"
                />
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: LIVE AUDIO DICTATION SPEED PLAYER */}
      {/* ========================================================================= */}
      {activeTab === 'dictation' && (
        <div className="max-w-4xl mx-auto space-y-6">
          
          <div className="bg-[#0A0F1D] border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                  EXAM DICTATION DRILLS
                </span>
                <h2 className="text-xl font-black text-white mt-1">
                  {language === 'hindi' ? 'लाइव ऑडियो डिक्टेशन प्लेयर (60 to 140 WPM)' : 'Live Audio Speed Dictation Engine'}
                </h2>
              </div>
            </div>

            {/* Passage Selection Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DICTATION_PASSAGES.map(passage => {
                const isSelected = selectedPassage.id === passage.id;
                return (
                  <div
                    key={passage.id}
                    onClick={() => {
                      if (isPlayingDictation) handleStopDictation();
                      setSelectedPassage(passage);
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                      isSelected
                        ? 'bg-gradient-to-br from-amber-500/20 via-orange-950/30 to-slate-900 border-amber-500 ring-2 ring-amber-500/30 shadow-lg'
                        : 'bg-[#060A14] border-slate-850 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-mono text-[9px] font-black uppercase">
                        {passage.category}
                      </span>
                      <span className="text-xs font-black text-amber-400 flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-amber-500" />
                        {Math.round(passage.wpm * dictationWpmMultiplier)} WPM
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{passage.title}</h4>
                      <p className="text-[10px] text-slate-400 line-clamp-2 mt-1">
                        {language === 'hindi' ? passage.textHindi : passage.textEnglish}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[9px] text-slate-500 pt-2 border-t border-slate-850">
                      <span>⏱️ {passage.durationSeconds}s Duration</span>
                      <span>📝 {passage.wordCount} Words</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ACTIVE DICTATION AUDIO CONTROLLER CONSOLE */}
            <div className="bg-gradient-to-br from-[#060A14] via-[#090D18] to-[#040810] border-2 border-amber-500/40 rounded-3xl p-6 text-center space-y-6 shadow-2xl">
              
              <div className="space-y-1.5">
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">
                  NOW LOADED PASSAGE
                </span>
                <h3 className="text-lg font-black text-white">{selectedPassage.title}</h3>
                <div className="flex items-center justify-center gap-3 text-xs font-mono text-slate-400">
                  <span>Speed: <strong className="text-amber-400">{Math.round(selectedPassage.wpm * dictationWpmMultiplier)} WPM</strong></span>
                  <span>•</span>
                  <span>Timer: <strong className="text-emerald-400">{dictationElapsed}s</strong></span>
                </div>
              </div>

              {/* Main Play / Pause Giant Button */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={handleToggleDictation}
                  className={`px-8 py-4 rounded-2xl font-black text-sm transition-all shadow-xl flex items-center gap-3 cursor-pointer ${
                    isPlayingDictation
                      ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                      : 'bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 hover:scale-105'
                  }`}
                >
                  {isPlayingDictation ? (
                    <>
                      <Pause className="w-5 h-5" />
                      <span>Pause Dictation / रोकें</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 fill-current" />
                      <span>Start Live Audio Dictation (डिक्टेशन शुरू करें) 🎙️</span>
                    </>
                  )}
                </button>

                {isPlayingDictation && (
                  <button
                    onClick={handleStopDictation}
                    className="p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
                    title="Stop & Reset"
                  >
                    <Square className="w-5 h-5 fill-current" />
                  </button>
                )}
              </div>

              {/* Pro Shorthand Speed Tips */}
              <div className="bg-[#0B1222] border border-slate-800 rounded-2xl p-4 text-left space-y-2">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  इस डिक्टेशन के लिए खास शॉर्टहैंड ट्रिक्स:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {selectedPassage.shorthandTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: TRANSCRIPTION TYPING & ERROR EVALUATION ENGINE */}
      {/* ========================================================================= */}
      {activeTab === 'transcription' && (
        <div className="max-w-4xl mx-auto space-y-6">
          
          <div className="bg-[#0A0F1D] border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-2.5 py-0.5 rounded-full border border-emerald-400/20">
                  EXACT EXAM EVALUATION
                </span>
                <h2 className="text-xl font-black text-white mt-1">
                  {language === 'hindi' ? 'शॉर्टहैंड ट्रांसक्रिप्शन व टाइपिंग टेस्ट' : 'Transcription & Typing Accuracy Evaluator'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  डिक्टेशन सुनने के बाद अपनी कॉपी से देखकर यहाँ टाइप करें। AI सिस्टम 1-1 शब्द का मिलान करके गलतियों की गणना करेगा।
                </p>
              </div>
            </div>

            {/* Typing Textarea */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Type your transcription here (यहाँ टाइप करें):</span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {typedTranscription.trim().split(/\s+/).filter(Boolean).length} Words Typed
                </span>
              </label>
              <textarea
                value={typedTranscription}
                onChange={(e) => setTypedTranscription(e.target.value)}
                placeholder="अपनी शॉर्टहैंड नोटबुक से देखकर पूरा गद्यांश यहाँ टाइप करें..."
                className="w-full h-44 p-4 bg-[#060A14] border border-slate-800 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 leading-relaxed font-sans"
              />
            </div>

            {/* Evaluate Button */}
            <button
              onClick={handleEvaluateTranscription}
              disabled={isEvaluating || !typedTranscription.trim()}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white font-black rounded-2xl text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              {isEvaluating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>AI सटीकता व गलतियों का विश्लेषण कर रहा है...</span>
                </>
              ) : (
                <>
                  <Award className="w-4 h-4" />
                  <span>गलतियों व स्पीड का मूल्यांकन करें (Evaluate Accuracy)</span>
                </>
              )}
            </button>

            {/* Evaluation Scorecard Results */}
            {transcriptionResult && (
              <div className="bg-gradient-to-br from-[#060A14] via-[#090E18] to-[#040810] border-2 border-emerald-500/40 rounded-3xl p-6 space-y-6 shadow-2xl animate-fade-in">
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 bg-[#0B1222] border border-emerald-500/30 rounded-2xl text-center">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Accuracy Score</div>
                    <div className="text-2xl font-black text-emerald-400 mt-1">{transcriptionResult.accuracy}%</div>
                  </div>
                  <div className="p-4 bg-[#0B1222] border border-amber-500/30 rounded-2xl text-center">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Approx Speed</div>
                    <div className="text-2xl font-black text-amber-400 mt-1">{transcriptionResult.wpm} WPM</div>
                  </div>
                  <div className="p-4 bg-[#0B1222] border border-rose-500/30 rounded-2xl text-center">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Mistakes Found</div>
                    <div className="text-2xl font-black text-rose-400 mt-1">{transcriptionResult.mistakes.length}</div>
                  </div>
                  <div className="p-4 bg-[#0B1222] border border-indigo-500/30 rounded-2xl text-center">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Total Words</div>
                    <div className="text-2xl font-black text-indigo-400 mt-1">{transcriptionResult.totalTypedWords} / {transcriptionResult.totalOriginalWords}</div>
                  </div>
                </div>

                {/* Mistakes list */}
                {transcriptionResult.mistakes.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                      🔍 पहचानी गई गलतियाँ (Identified Mistakes):
                    </h4>
                    <div className="max-h-40 overflow-y-auto space-y-1.5 pr-2 custom-scrollbar">
                      {transcriptionResult.mistakes.map((mistake, idx) => (
                        <div key={idx} className="p-2.5 bg-rose-950/20 border border-rose-500/30 rounded-xl text-xs text-rose-200">
                          {mistake}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: AI SHORTHAND MASTER (ASK DOUBTS) */}
      {/* ========================================================================= */}
      {activeTab === 'ai_assistant' && (
        <div className="max-w-4xl mx-auto space-y-6">
          
          <div className="bg-[#0A0F1D] border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
            
            <div className="border-b border-slate-800 pb-4">
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                AI STENO MENTOR
              </span>
              <h2 className="text-xl font-black text-white mt-1">
                {language === 'hindi' ? 'स्टेनो AI गुरु (शॉर्टहैंड नियम व वाक्यांश समाधान)' : 'AI Shorthand Mentor & Outlines Helper'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                हिंदी ऋषि प्रणाली, विशिष्ट प्रणाली या पिटमैन के किसी भी कठिन शब्द या वाक्यांश की आउटलाइन पूछें।
              </p>
            </div>

            {/* Input Prompt Box */}
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  value={stenoAiInput}
                  onChange={(e) => setStenoAiInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAskStenoAi()}
                  placeholder="उदा: 'उच्च न्यायालय' की आउटलाइन कैसे बनेगी? या 120 WPM पर हाथ कैसे तेज चलाएं?"
                  className="w-full py-3 pl-4 pr-24 bg-[#060A14] border border-slate-800 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={handleAskStenoAi}
                  disabled={stenoAiLoading || !stenoAiInput.trim()}
                  className="absolute right-2 top-2 px-4 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black rounded-xl text-xs cursor-pointer disabled:opacity-40"
                >
                  {stenoAiLoading ? '...' : 'पूछें'}
                </button>
              </div>
            </div>

            {/* Responses Stream */}
            <div className="space-y-3">
              {stenoAiResponses.map((item, idx) => (
                <div key={idx} className="p-4 bg-[#060A14] border border-slate-800 rounded-2xl space-y-2 text-xs">
                  <div className="font-bold text-amber-400 flex items-center justify-between">
                    <span>Q: {item.q}</span>
                    <span className="text-[10px] text-slate-500">{item.timestamp}</span>
                  </div>
                  <div className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {item.a}
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
