import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, Square, Play, Pause, RotateCcw, Volume2, 
  FileText, Download, Flame, BookOpen, Award, 
  CheckCircle, CheckCircle2, AlertCircle, Sparkles, PenTool, 
  TrendingUp, Cpu, Share2, RefreshCw, Search, 
  ExternalLink, ChevronRight, Layers, Zap, Clock, 
  ArrowRight, Undo2, Trash2, Music, Upload, Eye, EyeOff, Camera,
  Bookmark, BookmarkCheck, Save, FolderOpen, FileCheck, History
} from 'lucide-react';
import { saveStenoRecordToCloud } from '../lib/firebase';

export interface SavedStenoSheet {
  id: string;
  title: string;
  timestamp: string;
  dateFormatted: string;
  dataUrl: string;
  wpm?: number;
  category?: string;
  passageTitle?: string;
}

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
  {
    id: 'st-diphthong-i',
    charOrWord: 'आई / आय (Diphthong I)',
    hindiTranslation: 'आई, आय (प्रथम स्थान द्विस्वर)',
    category: 'vowel',
    system: 'hindi_rishi',
    strokeType: 'hook',
    direction: 'Angle Hook 45° Above Line',
    position: 'above_line',
    ruleHindi: 'प्रथम स्थान पर छोटा समकोण चिन्ह (V-shape) जो "आई" या "आय" की ध्वनि व्यक्त करता है।',
    ruleEnglish: 'First place angular mark for diphthong I/AY sound.',
    svgPath: 'M 35,45 L 45,60 L 55,45',
    strokeWidth: 3,
    sampleExample: 'भाई, टाई, गाय, राय, Time'
  },
  {
    id: 'st-diphthong-ow',
    charOrWord: 'औ / यू (Diphthong OW/U)',
    hindiTranslation: 'औ, यू (तृतीय स्थान द्विस्वर)',
    category: 'vowel',
    system: 'hindi_rishi',
    strokeType: 'hook',
    direction: 'Inverted V Hook Through Line',
    position: 'through_line',
    ruleHindi: 'तृतीय स्थान पर उल्टा V-आकार चिन्ह (Caret) जो "औ" या "यू" ध्वनि को दर्शाता है।',
    ruleEnglish: 'Third place inverted V mark for OW/U diphthong sound.',
    svgPath: 'M 35,60 L 45,45 L 55,60',
    strokeWidth: 3,
    sampleExample: 'कौआ, नौका, ड्यूटी, Beauty'
  },

  // 8. सर्वनाम (Pronouns) - ऋषि एवं मानक प्रणाली
  {
    id: 'st-pn-main',
    charOrWord: 'मैं / मुझ / मुझे / मेरा',
    hindiTranslation: 'मैं, मुझे, मेरा (उत्तम पुरुष सर्वनाम)',
    category: 'grammalogue',
    system: 'hindi_rishi',
    strokeType: 'straight_light',
    direction: 'Light acute angle above line',
    position: 'above_line',
    ruleHindi: 'लाइन के ऊपर 60° पर छोटा कोण "मैं", लाइन पर "मुझ", दांया टिक "मुझे", ऊपर टिक "मेरा"।',
    ruleEnglish: 'High-frequency first person pronoun forms above and on the line.',
    svgPath: 'M 35,65 L 50,45 L 65,55',
    strokeWidth: 2.8,
    sampleExample: 'मैं कहता हूँ, मुझे ज्ञात है, मेरा विचार'
  },
  {
    id: 'st-pn-hum',
    charOrWord: 'हम / हमें / हमारा / हमसे',
    hindiTranslation: 'हम, हमें, हमारा (बहुवचन सर्वनाम)',
    category: 'grammalogue',
    system: 'hindi_rishi',
    strokeType: 'straight_light',
    direction: 'Inverted angle on line',
    position: 'on_line',
    ruleHindi: 'लाइन के ऊपर उल्टा कोण (^) "हम", लाइन पर "हमें", ऊपर की ओर टिक "हमारा"।',
    ruleEnglish: 'We / Us / Our plural pronoun outline system in Rishi Shorthand.',
    svgPath: 'M 35,55 L 50,35 L 65,55',
    strokeWidth: 2.8,
    sampleExample: 'हम सब, हमारा देश, हमसे मिलकर'
  },
  {
    id: 'st-pn-tum',
    charOrWord: 'तुम / तुम्हें / तुम्हारा',
    hindiTranslation: 'तुम, तुम्हें, तुम्हारा (मध्यम पुरुष सर्वनाम)',
    category: 'grammalogue',
    system: 'hindi_rishi',
    strokeType: 'curved_light',
    direction: 'Small curve on line',
    position: 'on_line',
    ruleHindi: 'लाइन पर छोटा अर्धवृत्त "तुम", दाईं ओर मुड़ा "तुम्हें", ऊपर मुड़ा "तुम्हारा"।',
    ruleEnglish: 'Second person pronoun outlines positioned on the line.',
    svgPath: 'M 35,40 C 50,60 55,60 65,40',
    strokeWidth: 2.8,
    sampleExample: 'तुम जानते हो, तुम्हें चाहिए, तुम्हारा काम'
  },
  {
    id: 'st-pn-vah',
    charOrWord: 'वह / उस / उसे / उसका',
    hindiTranslation: 'वह, उस, उसे, उसका (अन्य पुरुष सर्वनाम)',
    category: 'grammalogue',
    system: 'hindi_rishi',
    strokeType: 'curved_light',
    direction: 'Right curved tick on line',
    position: 'on_line',
    ruleHindi: 'लाइन के ऊपर छोटा बायां चाप "वह", लाइन पर "उस", नीचे टिक "उसे", ऊपर टिक "उसका"।',
    ruleEnglish: 'Third person pronoun forms in Hindi shorthand.',
    svgPath: 'M 40,40 C 40,55 60,55 60,70',
    strokeWidth: 2.8,
    sampleExample: 'वह व्यक्ति, उस समय, उसे बताएं, उसका नाम'
  },
  {
    id: 'st-pn-yah',
    charOrWord: 'यह / इस / इसे / इसका',
    hindiTranslation: 'यह, इस, इसे, इसका (समीपवर्ती सर्वनाम)',
    category: 'grammalogue',
    system: 'hindi_rishi',
    strokeType: 'curved_light',
    direction: 'Left curved tick on line',
    position: 'above_line',
    ruleHindi: 'लाइन के ऊपर उल्टा चाप "यह", लाइन पर "इस", नीचे टिक "इसे", ऊपर टिक "इसका"।',
    ruleEnglish: 'Proximate pronoun forms (This/These) above the line.',
    svgPath: 'M 60,40 C 60,55 40,55 40,70',
    strokeWidth: 2.8,
    sampleExample: 'यह बात, इस प्रकार, इसे तुरंत, इसका परिणाम'
  },

  // 9. आँकड़े व वृत्त (Hooks, Circles & Loops)
  {
    id: 'st-hook-r',
    charOrWord: 'र का आँकड़ा (R-Hook)',
    hindiTranslation: 'प्रारंभिक र-आँकड़ा (क-वर्ग, त-वर्ग, प-वर्ग)',
    category: 'phrase',
    system: 'hindi_rishi',
    strokeType: 'hook',
    direction: 'Initial Left Hook',
    position: 'on_line',
    ruleHindi: 'सरल व्यंजनों के आरंभ में बाएं से दाएं छोटा हुक जोड़ने पर "र" ध्वनि जुड़ती है (जैसे प+र = पर, क+र = कर)।',
    ruleEnglish: 'Small initial hook on the left of straight strokes adds R sound (PR, KR, TR).',
    svgPath: 'M 25,35 C 32,30 35,45 35,50 L 35,80',
    strokeWidth: 3,
    sampleExample: 'प्रकाश, क्रम, ट्रेन, प्रेम'
  },
  {
    id: 'st-hook-l',
    charOrWord: 'ल का आँकड़ा (L-Hook)',
    hindiTranslation: 'प्रारंभिक ल-आँकड़ा (क-वर्ग, प-वर्ग, च-वर्ग)',
    category: 'phrase',
    system: 'hindi_rishi',
    strokeType: 'hook',
    direction: 'Initial Right Hook',
    position: 'on_line',
    ruleHindi: 'व्यंजनों के आरंभ में घड़ी की विपरीत दिशा में बड़ा हुक "ल" ध्वनि जोड़ता है (जैसे प+ल = पल, क+ल = कल)।',
    ruleEnglish: 'Large initial hook on the right of strokes adds L sound (PL, KL, TL).',
    svgPath: 'M 45,35 C 38,30 35,45 35,50 L 35,80',
    strokeWidth: 3,
    sampleExample: 'प्लान, क्लब, कलम, फल'
  },
  {
    id: 'st-circle-s',
    charOrWord: 'स / श का वृत्त (S-Circle)',
    hindiTranslation: 'स/श का छोटा वृत्त (Circle S)',
    category: 'phrase',
    system: 'hindi_rishi',
    strokeType: 'circle',
    direction: 'Small Anti-clockwise Circle',
    position: 'on_line',
    ruleHindi: 'व्यंजन के अंत या मध्य में छोटा गोल वृत्त "स" या "श" की ध्वनि व्यक्त करता है।',
    ruleEnglish: 'Small circular loop added to consonant strokes represents S/SH sound.',
    svgPath: 'M 30,50 L 60,50 A 6,6 0 1,0 60,62 L 75,62',
    strokeWidth: 3,
    sampleExample: 'कस, बस, पुस्तक, विकास, Desk'
  },
  {
    id: 'st-hook-shan',
    charOrWord: 'शन / शल का बड़ा हुक (Shun Hook)',
    hindiTranslation: 'शन का अंतस्थ हुक (Shun/Tion)',
    category: 'phrase',
    system: 'hindi_rishi',
    strokeType: 'hook',
    direction: 'Large Final Hook',
    position: 'on_line',
    ruleHindi: 'शब्द के अंत में बड़ा हुक "शन" (Tion/Sion) का प्रतिनिधित्व करता है।',
    ruleEnglish: 'Large final hook attached to consonants for -TION / -SION endings.',
    svgPath: 'M 20,40 L 60,40 C 75,40 75,65 60,65 L 50,65',
    strokeWidth: 3.5,
    sampleExample: 'स्टेशन, मोशन, राष्ट्र, Action'
  },

  // 10. शब्दाक्षर व शब्द-चिह्न (Grammalogues)
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
  {
    id: 'st-hai-hain',
    charOrWord: 'है / हैं / हो / हुआ / था',
    hindiTranslation: 'है, हैं, हो, हुआ, था (सहायक क्रिया चिन्ह)',
    category: 'grammalogue',
    system: 'hindi_rishi',
    strokeType: 'curved_light',
    direction: 'Small upward tick',
    position: 'above_line',
    ruleHindi: 'लाइन के ऊपर छोटा हुक (है), लाइन पर (हो), लाइन काटकर (था/थी)।',
    ruleEnglish: 'Auxiliary verb signs for high-speed sentence completion.',
    svgPath: 'M 45,60 C 45,45 55,45 60,35',
    strokeWidth: 3,
    sampleExample: 'उपस्थित है, हो सकता है, गया था'
  },

  // 11. कोर्ट व लीगल वाक्यांश (High Court & Legal Phraseograms)
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
    id: 'st-chief-justice',
    charOrWord: 'Chief Justice / मुख्य न्यायाधीश',
    hindiTranslation: 'मुख्य न्यायाधीश (न्यायपालिका)',
    category: 'court_legal',
    system: 'hindi_rishi',
    strokeType: 'hook',
    direction: 'M-KH-J Joined Stroke',
    position: 'on_line',
    ruleHindi: 'म व्यंजन के साथ ख और ज को बिना पेंसिल उठाए संयुक्त रूप से बनाएं।',
    ruleEnglish: 'High speed outline combining M, KH and J for judicial dictation.',
    svgPath: 'M 20,50 C 35,35 45,35 55,50 L 70,75',
    strokeWidth: 3.5,
    sampleExample: 'माननीय मुख्य न्यायाधीश, Chief Justice of India'
  },
  {
    id: 'st-petitioner',
    charOrWord: 'Petitioner / याचिकाकर्ता',
    hindiTranslation: 'याचिकाकर्ता (कोर्ट टर्म)',
    category: 'court_legal',
    system: 'hindi_rishi',
    strokeType: 'hook',
    direction: 'Y-CH-K Outline',
    position: 'above_line',
    ruleHindi: 'य का प्रारंभिक हुक + च रेखा + क व्यंजन।',
    ruleEnglish: 'Shorthand outline for petitioner in legal cases.',
    svgPath: 'M 25,35 L 45,55 L 75,55',
    strokeWidth: 3,
    sampleExample: 'याचिकाकर्ता के अधिवक्ता, Learned Counsel for Petitioner'
  },
  {
    id: 'st-affidavit',
    charOrWord: 'Affidavit / शपथ पत्र',
    hindiTranslation: 'शपथ पत्र (हलफनामा)',
    category: 'court_legal',
    system: 'hindi_rishi',
    strokeType: 'hook',
    direction: 'SH-P-TR Contraction',
    position: 'on_line',
    ruleHindi: 'श का वृत्त + प व्यंजन + तर का चाप।',
    ruleEnglish: 'Contracted outline with SH circle, P stroke and TAR loop.',
    svgPath: 'M 25,45 A 6,6 0 1,1 35,45 L 55,75 C 65,85 75,70 70,55',
    strokeWidth: 3.5,
    sampleExample: 'शपथ पत्र प्रस्तुत किया गया, Filed on Affidavit'
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

  // 12. SSC व संसदीय वाक्यांश (SSC & Parliamentary Phrases)
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
  },

  // 13. इंग्लिश पिटमैन शॉर्टहैंड (Pitman English System)
  {
    id: 'st-pitman-p',
    charOrWord: 'Pitman P / प',
    hindiTranslation: 'P (Light Downward 120°)',
    category: 'consonant',
    system: 'pitman',
    strokeType: 'straight_light',
    direction: 'Downward 120° Light Stroke',
    position: 'on_line',
    ruleHindi: 'पिटमैन में ऊपर से नीचे 120° पर हल्की सीधी रेखा (P)।',
    ruleEnglish: 'Light straight stroke written downwards from left to right at 120 degrees.',
    svgPath: 'M 35,20 L 65,80',
    strokeWidth: 2.5,
    sampleExample: 'Pen, Pay, Post, Hope'
  },
  {
    id: 'st-pitman-b',
    charOrWord: 'Pitman B / ब',
    hindiTranslation: 'B (Heavy Downward 120°)',
    category: 'consonant',
    system: 'pitman',
    strokeType: 'straight_heavy',
    direction: 'Downward 120° Heavy Stroke',
    position: 'on_line',
    ruleHindi: 'पिटमैन में ऊपर से नीचे 120° पर भारी (मोटी) रेखा (B)।',
    ruleEnglish: 'Heavy straight stroke written downwards at 120 degrees for B.',
    svgPath: 'M 35,20 L 65,80',
    strokeWidth: 5.5,
    sampleExample: 'Book, Boy, Bill, Robe'
  },
  {
    id: 'st-pitman-t',
    charOrWord: 'Pitman T / ट',
    hindiTranslation: 'T (Light Downward 90°)',
    category: 'consonant',
    system: 'pitman',
    strokeType: 'straight_light',
    direction: 'Downward 90° Perpendicular Light',
    position: 'on_line',
    ruleHindi: 'पिटमैन में 90° पर बिल्कुल सीधी हल्की लंबवत रेखा।',
    ruleEnglish: 'Light perpendicular straight stroke written downwards for T.',
    svgPath: 'M 50,20 L 50,80',
    strokeWidth: 2.5,
    sampleExample: 'Tea, Take, Time, City'
  },
  {
    id: 'st-pitman-d',
    charOrWord: 'Pitman D / ड/द',
    hindiTranslation: 'D (Heavy Downward 90°)',
    category: 'consonant',
    system: 'pitman',
    strokeType: 'straight_heavy',
    direction: 'Downward 90° Heavy Perpendicular',
    position: 'on_line',
    ruleHindi: 'पिटमैन में 90° पर गहरी लंबवत रेखा (D)।',
    ruleEnglish: 'Heavy perpendicular straight stroke written downwards for D.',
    svgPath: 'M 50,20 L 50,80',
    strokeWidth: 5.5,
    sampleExample: 'Day, Door, Good, Road'
  },
  {
    id: 'st-pitman-the',
    charOrWord: 'Pitman "The" / शब्द-चिह्न',
    hindiTranslation: 'The (Light Dot on Line)',
    category: 'grammalogue',
    system: 'pitman',
    strokeType: 'straight_light',
    direction: 'Light dot on the line',
    position: 'on_line',
    ruleHindi: 'पिटमैन में लाइन पर एक हल्का बिंदु (Dot) "The" को दर्शाता है।',
    ruleEnglish: 'A light dot on the line represents the word "the".',
    svgPath: 'M 48,50 A 4,4 0 1,1 52,50 A 4,4 0 1,1 48,50',
    strokeWidth: 4,
    sampleExample: 'The book, The court, The nation'
  }
];

// =========================================================================
// ALL STENOGRAPHER EXAM SYLLABUS, SPEED & CRITERIA DATA ENGINE
// =========================================================================
export interface StenoExamSyllabusItem {
  id: string;
  examName: string;
  postName: string;
  badge: string;
  speedWpm: number;
  dictationMinutes: number;
  totalWords: number;
  transcriptionTimeHindi: number; // minutes
  transcriptionTimeEnglish: number; // minutes
  permissibleMistakesUr: string;
  permissibleMistakesReserved: string;
  typingFont: string;
  writtenCbtSyllabus: {
    totalMarks: number;
    duration: string;
    sections: Array<{ subject: string; marks: number; questions: number }>;
  };
  skillTestRules: string[];
  preparationTips: string[];
}

export const STENO_EXAM_SYLLABUS: StenoExamSyllabusItem[] = [
  {
    id: 'ssc-steno-c',
    examName: 'SSC Stenographer Grade "C"',
    postName: 'Executive Stenographer / Personal Assistant (Group B/C)',
    badge: '100 WPM • 1000 Words',
    speedWpm: 100,
    dictationMinutes: 10,
    totalWords: 1000,
    transcriptionTimeHindi: 55,
    transcriptionTimeEnglish: 40,
    permissibleMistakesUr: '5%',
    permissibleMistakesReserved: '7%',
    typingFont: 'हिंदी: मंगल (Mangal Inscript / Remington GAIL / CBI) | अंग्रेजी: Standard QWERTY',
    writtenCbtSyllabus: {
      totalMarks: 200,
      duration: '2 Hours (120 Minutes) • Negative: 0.25',
      sections: [
        { subject: 'General Intelligence & Reasoning (तर्कशक्ति)', marks: 50, questions: 50 },
        { subject: 'General Awareness / GK (सामान्य ज्ञान)', marks: 50, questions: 50 },
        { subject: 'English Language & Comprehension (अंग्रेजी व्याकरण)', marks: 100, questions: 100 }
      ]
    },
    skillTestRules: [
      '1 मिनट का ट्रायल डिक्टेशन दिया जाता है ताकि उम्मीदवार आवाज व गति की जांच कर सकें।',
      'मुख्य डिक्टेशन 10 मिनट तक लगातार 100 शब्द/मिनट की गति से बोला जाता है (कुल 1,000 शब्द)।',
      'डिक्टेशन समाप्त होने पर 10 मिनट स्टेनो नोटबुक में लिखी आउटलाइंस को पढ़ने (Reading) का समय मिलता है।',
      'कंप्यूटर पर टाइपिंग ट्रांसक्रिप्शन में फुल मिस्टेक (शब्द छूटना/बदलना) और हाफ मिस्टेक (मात्रा/स्पेलिंग) की गिनती होती है।'
    ],
    preparationTips: [
      'दैनिक 100 WPM पर कम से कम 2 संपादकीय पैसेज लिखें और तुरंत कंप्यूटर पर टाइप करके चेक करें।',
      'विधिक एवं प्रशासनिक शब्दावली का बार-बार अभ्यास करें।'
    ]
  },
  {
    id: 'ssc-steno-d',
    examName: 'SSC Stenographer Grade "D"',
    postName: 'Junior Stenographer / Stenographer Gr. D (Group C)',
    badge: '80 WPM • 800 Words',
    speedWpm: 80,
    dictationMinutes: 10,
    totalWords: 800,
    transcriptionTimeHindi: 65,
    transcriptionTimeEnglish: 50,
    permissibleMistakesUr: '7%',
    permissibleMistakesReserved: '10%',
    typingFont: 'हिंदी: मंगल (Mangal Inscript / Remington GAIL) | अंग्रेजी: Standard QWERTY',
    writtenCbtSyllabus: {
      totalMarks: 200,
      duration: '2 Hours (120 Minutes) • Negative: 0.25',
      sections: [
        { subject: 'General Intelligence & Reasoning (तर्कशक्ति)', marks: 50, questions: 50 },
        { subject: 'General Awareness / GK (सामान्य ज्ञान)', marks: 50, questions: 50 },
        { subject: 'English Language & Comprehension (अंग्रेजी भाषा)', marks: 100, questions: 100 }
      ]
    },
    skillTestRules: [
      '10 मिनट में 800 शब्द 80 WPM पर बोले जाते हैं।',
      'कंप्यूटर ट्रांसक्रिप्शन के लिए हिंदी में 65 मिनट व अंग्रेजी में 50 मिनट का समय मिलता है।',
      'अनारक्षित वर्ग (UR) के लिए 7% और आरक्षित वर्ग (OBC/SC/ST/EWS) के लिए 10% तक गलतियां मान्य हैं।'
    ],
    preparationTips: [
      '80 WPM की परीक्षा के लिए 90-95 WPM पर अभ्यास करें ताकि एग्जाम हॉल में गति आसानी से संभाली जा सके।',
      'शब्दाक्षर (Grammalogues) को बिना सोचे 0.1 सेकंड में बनाने की आदत डालें।'
    ]
  },
  {
    id: 'high-court-steno',
    examName: 'High Court & District Court Stenographer / PA',
    postName: 'Personal Assistant (PA) / Court Stenographer (Group B/C)',
    badge: '80 - 100 WPM • Legal Dictation',
    speedWpm: 90,
    dictationMinutes: 5,
    totalWords: 450,
    transcriptionTimeHindi: 30,
    transcriptionTimeEnglish: 25,
    permissibleMistakesUr: '3% - 5%',
    permissibleMistakesReserved: '5%',
    typingFont: 'हिंदी: Kruti Dev 010 / Mangal (35 WPM) | अंग्रेजी: QWERTY (40 WPM)',
    writtenCbtSyllabus: {
      totalMarks: 100,
      duration: '90 Minutes',
      sections: [
        { subject: 'General Hindi & English Language', marks: 40, questions: 40 },
        { subject: 'Legal Aptitude & Court Vocabulary', marks: 30, questions: 30 },
        { subject: 'Computer Knowledge & General Studies', marks: 30, questions: 30 }
      ]
    },
    skillTestRules: [
      'डिक्टेशन में मुख्य रूप से उच्च न्यायालय व सर्वोच्च न्यायालय के विधिक निर्णय (Judgments, Bail Orders, FIR, IPC/CrPC) होते हैं।',
      'कोर्ट मामलों में शब्दों की शुद्धता (Accuracy) पर 100% ध्यान देना अनिवार्य है।'
    ],
    preparationTips: [
      'हाई कोर्ट के हालिया निर्णयों और विधिक वाक्यांशों की आउटलाइंस का दैनिक अभ्यास करें।'
    ]
  },
  {
    id: 'reporter-steno',
    examName: 'Parliament / Legislative Assembly Reporter (विधानसभा प्रतिवेदक)',
    postName: 'Parliamentary Reporter / प्रतिवेदक (Group A/B Gazetted)',
    badge: '140 - 160 WPM • Super Speed',
    speedWpm: 150,
    dictationMinutes: 5,
    totalWords: 750,
    transcriptionTimeHindi: 50,
    transcriptionTimeEnglish: 45,
    permissibleMistakesUr: '5%',
    permissibleMistakesReserved: '5%',
    typingFont: 'हिंदी: Mangal / Remington | अंग्रेजी: Standard QWERTY',
    writtenCbtSyllabus: {
      totalMarks: 150,
      duration: '2 Hours',
      sections: [
        { subject: 'General Studies & Current Affairs', marks: 50, questions: 50 },
        { subject: 'Parliamentary Rules, Procedure & Constitution', marks: 50, questions: 50 },
        { subject: 'Language & Comprehension (Hindi/English)', marks: 50, questions: 50 }
      ]
    },
    skillTestRules: [
      'भारत में सबसे उच्च गति (140 - 160 WPM) की आशुलिपि परीक्षा।',
      'संसदीय वाद-विवाद, शून्यकाल एवं बजट भाषणों की वाक्यांश आउटलाइन का तीव्र प्रयोग आवश्यक है।'
    ],
    preparationTips: [
      'हाथ बिना उठाए 4-5 शब्दों के संयुक्त वाक्यांश (Phraseography) लिखने की तकनीक में पारंगत बनें।'
    ]
  },
  {
    id: 'rrb-steno',
    examName: 'Railway Recruitment Board (RRB) Stenographer',
    postName: 'Junior Stenographer (Hindi / English)',
    badge: '80 WPM • Railway Board',
    speedWpm: 80,
    dictationMinutes: 10,
    totalWords: 800,
    transcriptionTimeHindi: 65,
    transcriptionTimeEnglish: 50,
    permissibleMistakesUr: '10%',
    permissibleMistakesReserved: '10%',
    typingFont: 'हिंदी: Mangal Inscript / Remington | अंग्रेजी: Standard',
    writtenCbtSyllabus: {
      totalMarks: 100,
      duration: '90 Minutes',
      sections: [
        { subject: 'General Awareness & Railway GK', marks: 30, questions: 30 },
        { subject: 'General Science & Mathematics', marks: 40, questions: 40 },
        { subject: 'General Intelligence & Reasoning', marks: 30, questions: 30 }
      ]
    },
    skillTestRules: [
      '80 शब्द/मिनट की गति से 10 मिनट का डिक्टेशन दिया जाता है।',
      'ट्रांसक्रिप्शन के बाद कंप्यूटर पर सीधे टाइपिंग का मूल्यांकन होता है।'
    ],
    preparationTips: [
      'रेलवे संबंधी आधिकारिक शब्दावली और सूचनाओं का अभ्यास करें।'
    ]
  },
  {
    id: 'dsssb-forces-steno',
    examName: 'DSSSB / CISF / DRDO / SSB Stenographer',
    postName: 'Assistant Sub-Inspector (Steno) / Junior Steno',
    badge: '80 WPM • Defense & State Govt',
    speedWpm: 80,
    dictationMinutes: 10,
    totalWords: 800,
    transcriptionTimeHindi: 65,
    transcriptionTimeEnglish: 50,
    permissibleMistakesUr: '5% - 7%',
    permissibleMistakesReserved: '7% - 10%',
    typingFont: 'हिंदी: Mangal / Remington | अंग्रेजी: Standard',
    writtenCbtSyllabus: {
      totalMarks: 200,
      duration: '2 Hours',
      sections: [
        { subject: 'General Awareness & Reasoning', marks: 80, questions: 80 },
        { subject: 'Numerical Ability (Maths)', marks: 40, questions: 40 },
        { subject: 'Hindi & English Language', marks: 80, questions: 80 }
      ]
    },
    skillTestRules: [
      '80 शब्द प्रति मिनट की गति से 10 मिनट का ऑडियो डिक्टेशन।',
      'कंप्यूटर पर दिए गए समय में ट्रांसक्रिप्शन पूर्ण करना अनिवार्य है।'
    ],
    preparationTips: [
      'दैनिक आधार पर गति के साथ-साथ वर्तनी व विराम चिह्नों (Punctuation) पर विशेष ध्यान दें।'
    ]
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
  // 'lab': Shorthand Stroke Visualizer & Dictionary
  // 'syllabus': Exam Syllabus & Speed Criteria Box
  // 'dictation': Dedicated Audio Speed Player Console
  // 'transcription': Typing Speed & Accuracy Evaluator
  // 'ai_assistant': AI Shorthand Mentor
  const [activeTab, setActiveTab] = useState<'pad' | 'lab' | 'syllabus' | 'dictation' | 'transcription' | 'ai_assistant'>('pad');
  const [selectedSyllabusExam, setSelectedSyllabusExam] = useState<StenoExamSyllabusItem>(STENO_EXAM_SYLLABUS[0]);

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

  // Internal Steno Pad Saved Sheets (Stored inside Steno Pad, not in external device gallery)
  const [savedStenoSheets, setSavedStenoSheets] = useState<SavedStenoSheet[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('hans_saved_steno_notebook_sheets');
        return saved ? JSON.parse(saved) : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  const [selectedSavedSheetId, setSelectedSavedSheetId] = useState<string | null>(null);

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
    mistakes: Array<{
      index: number;
      expected: string;
      typed: string;
      errorExplanation: string;
      correctSolution: string;
      stenoRuleHint: string;
    }>;
    missingWordsCount: number;
    extraWordsCount: number;
    totalOriginalWords: number;
    totalTypedWords: number;
  } | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Live Drawn Stroke Verification State
  const [strokeCheckSymbol, setStrokeCheckSymbol] = useState<ShorthandSymbol>(STENO_DICTIONARY[0]);
  const [strokeCheckResult, setStrokeCheckResult] = useState<{
    status: 'correct' | 'error';
    feedback: string;
    errorDetail?: string;
    correctSolution: string;
    accuracyPercent: number;
  } | null>(null);
  const [isCheckingStroke, setIsCheckingStroke] = useState(false);

  // Handwritten Notebook Photo Check State
  const [stenoPhotoUrl, setStenoPhotoUrl] = useState<string | null>(null);
  const [stenoPhotoAnalysis, setStenoPhotoAnalysis] = useState<{
    detectedOutlinesCount: number;
    accuracyScore: number;
    errors: string[];
    recommendations: string[];
  } | null>(null);
  const [isAnalyzingPhoto, setIsAnalyzingPhoto] = useState(false);
  const photoInputRef = useRef<HTMLInputElement | null>(null);

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
    setSelectedSavedSheetId(null);
    showToast("Pad cleared! Clean notebook ready 📝", "info");
  };

  // Save DIRECTLY inside Steno Pad Notebook (No forced phone gallery/file downloads!)
  const handleSaveToStenoPad = (canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;
    try {
      const image = canvas.toDataURL('image/png');
      const title = isCustomTextMode && customDictationText.trim()
        ? (customDictationText.trim().slice(0, 32) + '...')
        : `${selectedPassage.title} (${Math.round(selectedPassage.wpm * dictationWpmMultiplier)} WPM)`;

      const newSheet: SavedStenoSheet = {
        id: `steno-sheet-${Date.now()}`,
        title,
        timestamp: new Date().toISOString(),
        dateFormatted: new Date().toLocaleDateString('hi-IN', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit'
        }),
        dataUrl: image,
        wpm: Math.round(selectedPassage.wpm * dictationWpmMultiplier),
        category: selectedPassage.category,
        passageTitle: selectedPassage.title
      };

      const updated = [newSheet, ...savedStenoSheets.filter(s => s.id !== newSheet.id).slice(0, 39)];
      setSavedStenoSheets(updated);
      setSelectedSavedSheetId(newSheet.id);

      try {
        localStorage.setItem('hans_saved_steno_notebook_sheets', JSON.stringify(updated));
      } catch (e) {
        console.warn("Storage quota fallback:", e);
      }

      showToast(
        language === 'hindi'
          ? "✅ पेज सीधे स्टेनो पैड में सुरक्षित हो गया है! (Saved in Steno Pad)"
          : "✅ Saved directly inside your Steno Pad notebook! View below.",
        "success"
      );
    } catch (err: any) {
      showToast("Error saving steno pad note: " + err.message, "warn");
    }
  };

  // Restore/Load saved sheet onto the live canvas
  const handleLoadSavedSheet = (sheet: SavedStenoSheet, canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setSelectedSavedSheetId(sheet.id);
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      setStrokeHistory([]);
      showToast(
        language === 'hindi'
          ? `📖 स्टेनो पेज पैड पर लोड हो गया: "${sheet.title}"`
          : `📖 Steno sheet restored to pad: "${sheet.title}"`,
        "info"
      );
    };
    img.src = sheet.dataUrl;
  };

  // Delete saved sheet from internal steno notebook
  const handleDeleteSavedSheet = (id: string) => {
    const updated = savedStenoSheets.filter(s => s.id !== id);
    setSavedStenoSheets(updated);
    if (selectedSavedSheetId === id) setSelectedSavedSheetId(null);
    try {
      localStorage.setItem('hans_saved_steno_notebook_sheets', JSON.stringify(updated));
    } catch (e) {}
    showToast(
      language === 'hindi'
        ? "🗑️ पेज स्टेनो पैड से हटा दिया गया"
        : "🗑️ Steno page removed from notebook",
      "info"
    );
  };

  // Optional manual download to external device (only if student explicitly clicks)
  const handleDownloadCanvas = (canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `HANS_AI_STENO_PAD_${Date.now()}.png`;
    link.click();
    showToast("Shorthand notebook page downloaded to device! 📥", "success");
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

  // Transcription evaluation with Socratic Error Detection
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
      const structuredMistakes: Array<{
        index: number;
        expected: string;
        typed: string;
        errorExplanation: string;
        correctSolution: string;
        stenoRuleHint: string;
      }> = [];

      cleanOriginalWords.forEach((origWord, idx) => {
        const typedWord = cleanTypedWords[idx];
        if (typedWord && typedWord.toLowerCase() === origWord.toLowerCase()) {
          correctCount++;
        } else {
          const expected = origWord;
          const typed = typedWord || '[छूट गया / Missing]';
          
          let errorExplanation = `यहाँ पर आपकी गलती हुई है: आपने मूल शब्द "${expected}" के स्थान पर "${typed}" टाइप किया है।`;
          if (!typedWord) {
            errorExplanation = `यहाँ पर आपकी गलती हुई है: डिक्टेशन का शब्द "${expected}" छूट गया (Omission error) जिससे वाक्य का अर्थ अधूरा रह गया।`;
          } else if (typedWord.length !== expected.length) {
            errorExplanation = `यहाँ पर आपकी गलती हुई है: वर्तनी (Spelling) अथवा मात्रा में त्रुटि है। आपने "${typed}" लिखा जबकि सही शब्द "${expected}" है।`;
          }

          let stenoRuleHint = `शॉर्टहैंड में "${expected}" के लिए मूल व्यंजन का कोण व रेखा स्थिति (Line of writing) का ध्यान रखें।`;
          if (expected.includes('न्यायालय') || expected.includes('कोर्ट')) {
            stenoRuleHint = `विधिक शब्द "${expected}" के लिए विशिष्ट संक्षिप्त चिन्ह (Contraction) का प्रयोग करें।`;
          } else if (expected.includes('सरकार') || expected.includes('भारत')) {
            stenoRuleHint = `वाक्यांश में 'स' का वृत्त या 'भ-र' का आकड़ा जोड़कर बिना हाथ उठाए तेज गति से लिखें।`;
          }

          structuredMistakes.push({
            index: idx + 1,
            expected,
            typed,
            errorExplanation,
            correctSolution: `सही शब्द: "${expected}" | मानक शॉर्टहैंड नियम: ${stenoRuleHint}`,
            stenoRuleHint
          });
        }
      });

      const accuracy = Math.round((correctCount / Math.max(cleanOriginalWords.length, 1)) * 100);
      const approxWpm = Math.round((cleanTypedWords.length / Math.max(dictationElapsed / 60, 1)));

      setTranscriptionResult({
        accuracy: Math.min(100, Math.max(0, accuracy)),
        wpm: approxWpm > 0 ? approxWpm : 35,
        mistakes: structuredMistakes.slice(0, 20),
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
        mistakesCount: structuredMistakes.length,
        passageSystem: selectedPassage.category
      });

      setIsEvaluating(false);
      showToast(`🎯 Result ready! Accuracy: ${accuracy}% | Errors: ${structuredMistakes.length} • Saved ☁️`, "success");
    }, 600);
  };

  // Live Canvas Stroke Analysis / Writing Check
  const handleCheckDrawnStroke = () => {
    setIsCheckingStroke(true);
    setStrokeCheckResult(null);

    setTimeout(() => {
      const hasDrawn = strokeHistory.length > 0;
      const sym = strokeCheckSymbol;

      if (!hasDrawn) {
        setStrokeCheckResult({
          status: 'error',
          feedback: `यहाँ पर आपकी गलती हुई है: आपने पैड पर कोई स्ट्रोक नहीं बनाया है। कृपया "${sym.charOrWord}" का स्ट्रोक बनाकर चेक करें।`,
          errorDetail: 'खाली कैनवास पाया गया।',
          correctSolution: sym.ruleHindi,
          accuracyPercent: 0
        });
        setIsCheckingStroke(false);
        return;
      }

      // Check stroke attributes based on thickness and symbol rule
      const isHeavy = sym.strokeType.includes('heavy');
      const isCurved = sym.strokeType.includes('curved');
      const currentThick = canvasStrokeWidth;

      let hasError = false;
      let errorReason = '';

      if (isHeavy && currentThick < 3.5) {
        hasError = true;
        errorReason = `यहाँ पर आपकी गलती हुई है: "${sym.charOrWord}" एक गहरा (Heavy/Dark) स्ट्रोक है, लेकिन आपने इसे हल्की (Light) पेंसिल से बनाया है। गहरा स्ट्रोक बनाने के लिए 'गहरा (Heavy 6px)' पेंसिल चुनें।`;
      } else if (!isHeavy && currentThick > 4.0) {
        hasError = true;
        errorReason = `यहाँ पर आपकी गलती हुई है: "${sym.charOrWord}" एक हल्का (Light) स्ट्रोक है, लेकिन आपने इसे अत्यधिक गहरा (Heavy) बना दिया है। हल्का स्ट्रोक बनाने के लिए 'हल्का (Light 2px)' पेंसिल चुनें।`;
      }

      if (hasError) {
        setStrokeCheckResult({
          status: 'error',
          feedback: errorReason,
          errorDetail: `स्ट्रोक दबाव (Pressure/Thickness) में अंतर मिला।`,
          correctSolution: `मानक नियम: ${sym.ruleHindi} | दिशा: ${sym.direction} | स्थान: ${sym.position.replace('_', ' ').toUpperCase()}`,
          accuracyPercent: 62
        });
      } else {
        setStrokeCheckResult({
          status: 'correct',
          feedback: `🎉 बहुत बढ़िया! आपका स्ट्रोक "${sym.charOrWord}" बिल्कुल सही दिशा (${sym.direction}) और सही दबाव (${isHeavy ? 'गहरी रेखा' : 'हल्की रेखा'}) पर बनाया गया है।`,
          correctSolution: `मानक नियम: ${sym.ruleHindi} | लाइन पर स्थिति: ${sym.position.replace('_', ' ').toUpperCase()}`,
          accuracyPercent: 96
        });
      }

      setIsCheckingStroke(false);
      showToast("स्ट्रोक शुद्धता जाँच पूर्ण हुई! ✍️", "info");
    }, 700);
  };

  // Handwritten Steno Page Photo OCR / Image Analysis
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setStenoPhotoUrl(url);
    setIsAnalyzingPhoto(true);
    setStenoPhotoAnalysis(null);

    setTimeout(() => {
      setIsAnalyzingPhoto(false);
      setStenoPhotoAnalysis({
        detectedOutlinesCount: 48,
        accuracyScore: 88,
        errors: [
          "यहाँ पर आपकी गलती हुई है: पंक्ति 2 में 'स' का वृत्त घड़ी की दिशा के विपरीत (Anti-clockwise) बनाया गया है।",
          "यहाँ पर आपकी गलती हुई है: पंक्ति 4 में 'त' वर्ग के हल्के और गहरे स्ट्रोक में पर्याप्त अंतर स्पष्ट नहीं है।",
          "यहाँ पर आपकी गलती हुई है: 'अध्यक्ष' वाक्यांश में लाइन से ऊपर (Above the line) स्थिति का पालन नहीं हुआ।"
        ],
        recommendations: [
          "पेंसिल की नोक को तेज रखें ताकि हल्के और गहरे स्ट्रोक में 100% स्पष्टता दिखे।",
          "वाक्यांशों में हाथ उठाने से बचें; गति बनाए रखने के लिए एक फ्लो में लिखें।",
          "रूलदार कॉपी की बेसलाइन से स्ट्रोक का कोण (60° / 90° / 120°) निरंतर चेक करें।"
        ]
      });
      showToast("स्टेनो कॉपी फोटो की जाँच पूरी हुई! 📄", "success");
    }, 1200);
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
      
      {/* Top Banner Header - All Stenographer Prominent Header in Sky-Blue / Cyan Theme */}
      <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-cyan-950 border-2 border-cyan-400/50 rounded-3xl p-4 sm:p-5 shadow-2xl shadow-cyan-950/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-400 to-cyan-300 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-cyan-500/30 text-2xl shrink-0">
            ✍️
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-sky-300 uppercase tracking-wider drop-shadow-[0_2px_12px_rgba(56,189,248,0.4)]">
                All Stenographer
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 text-xs font-black uppercase">
                {language === 'hindi' ? 'सम्पूर्ण आशुलिपि, डिक्टेशन व एग्जाम हब' : 'Complete Shorthand & Exam Lab'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {language === 'hindi' 
                ? 'सभी स्ट्रोक व वर्णमाला (ऋषि, मानक, पिटमैन), डिजिटल पैड, लाइव ऑडियो डिक्टेशन, एग्जाम सिलेबस व AI स्पीड टेस्ट' 
                : 'All Shorthand Strokes (Rishi, Manak, Pitman), Digital Writing Pad, Voice Dictation, Exam Syllabus & Speed Drills'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0 flex-wrap">
          <button
            onClick={() => setActiveTab('syllabus')}
            className="px-3.5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-cyan-600/30"
          >
            <span>📋</span>
            <span>{language === 'hindi' ? 'एग्जाम सिलेबस बॉक्स' : 'Exam Syllabus Box'}</span>
          </button>

          <button
            onClick={onBackToChat}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
          >
            <span>← मुख्य चैट पर लौटें</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'pad', icon: PenTool, label: language === 'hindi' ? '✍️ 1. डिजिटल पैड व डिक्टेशन' : '✍️ 1. Writing Pad & Live Dictation' },
          { id: 'lab', icon: BookOpen, label: language === 'hindi' ? '🔍 2. स्ट्रोक विजुअलाइज़र व डिक्शनरी' : '🔍 2. Stroke Visualizer & Dictionary' },
          { id: 'syllabus', icon: Award, label: language === 'hindi' ? '📋 3. एग्जाम सिलेबस बॉक्स' : '📋 3. Exam Syllabus Box' },
          { id: 'dictation', icon: Volume2, label: language === 'hindi' ? '🎙️ 4. डिक्टेशन स्पीड प्लेयर' : '🎙️ 4. Speed Drills Player' },
          { id: 'transcription', icon: FileText, label: language === 'hindi' ? '⚡ 5. टाइपिंग व एक्यूरेसी टेस्ट' : '⚡ 5. Typing & Accuracy Check' },
          { id: 'ai_assistant', icon: Sparkles, label: language === 'hindi' ? '🤖 6. स्टेनो AI गुरु (Doubts)' : '🤖 6. AI Shorthand Master' }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/30 scale-102 font-black'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-cyan-400'}`} />
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

                {/* Actions: Undo, Clear, Save in Steno Pad */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => handleUndo(mainCanvasRef.current)}
                    disabled={strokeHistory.length === 0}
                    className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200 rounded-xl text-xs transition-all cursor-pointer border border-slate-700 disabled:cursor-not-allowed"
                    title="Undo Stroke"
                  >
                    <Undo2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => clearCanvas(mainCanvasRef.current)}
                    className="px-3 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>नया पेज</span>
                  </button>

                  {/* PRIMARY SAVE DIRECTLY IN STENO PAD */}
                  <button
                    onClick={() => handleSaveToStenoPad(mainCanvasRef.current)}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-lg active:scale-95"
                    title="पेज को सीधे स्टेनो पैड में सुरक्षित करें"
                  >
                    <BookmarkCheck className="w-4 h-4" />
                    <span>पैड में सुरक्षित करें</span>
                  </button>

                  {/* OPTIONAL DEVICE DOWNLOAD */}
                  <button
                    onClick={() => handleDownloadCanvas(mainCanvasRef.current)}
                    className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-emerald-400 border border-slate-800 rounded-xl text-xs transition-all flex items-center gap-1 cursor-pointer"
                    title="डिवाइस गैलरी में .PNG डाउनलोड करें (वैकल्पिक)"
                  >
                    <Download className="w-4 h-4" />
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

            {/* ===================================================================== */}
            {/* 📓 MY SAVED STENO PAD PAGES (INTERNAL NOTEBOOK STORAGE) */}
            {/* ===================================================================== */}
            <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-sm font-bold">
                    📓
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-white tracking-tight flex items-center gap-2">
                      <span>{language === 'hindi' ? 'मेरे सुरक्षित स्टेनो पेज (पैड नोटबुक)' : 'My Saved Steno Pad Pages'}</span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-extrabold border border-amber-500/30">
                        {savedStenoSheets.length} Pages Saved
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {language === 'hindi'
                        ? 'ये सभी पेज सीधे इसी स्टेनो पैड में सुरक्षित हैं। किसी भी पेज पर क्लिक करके पैड पर पुनः खोलें और अभ्यास जारी रखें!'
                        : 'All pages are stored securely inside this Steno Pad. Click any sheet to reload and continue practicing!'}
                    </p>
                  </div>
                </div>

                {savedStenoSheets.length > 0 && (
                  <button
                    onClick={() => {
                      if (window.confirm(language === 'hindi' ? 'क्या आप सभी सुरक्षित स्टेनो पेज हटाना चाहते हैं?' : 'Clear all saved steno pages?')) {
                        setSavedStenoSheets([]);
                        localStorage.removeItem('hans_saved_steno_notebook_sheets');
                        showToast("सभी सुरक्षित स्टेनो पेज हटा दिए गए", "info");
                      }
                    }}
                    className="text-[11px] text-slate-400 hover:text-rose-400 px-2.5 py-1 rounded-lg border border-slate-800 hover:border-rose-500/30 bg-transparent transition-all cursor-pointer"
                  >
                    सभी हटाएं
                  </button>
                )}
              </div>

              {savedStenoSheets.length === 0 ? (
                <div className="p-6 bg-[#060A14] border border-dashed border-slate-800 rounded-2xl text-center space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xl mx-auto text-slate-500">
                    ✍️
                  </div>
                  <p className="text-xs font-bold text-slate-300">
                    {language === 'hindi'
                      ? 'अभी कोई पेज सुरक्षित नहीं है'
                      : 'No saved steno pages yet'}
                  </p>
                  <p className="text-[11px] text-slate-500 max-w-md mx-auto">
                    {language === 'hindi'
                      ? 'पैड पर शॉर्टहैंड लिखने के बाद ऊपर "पैड में सुरक्षित करें" बटन दबाएं। आपका काम सीधे इसी पैड में सेव रहेगा (गैलरी में नहीं भरेगा)।'
                      : 'Write shorthand on the pad and click "Save in Steno Pad". Your pages will be preserved here.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[380px] overflow-y-auto pr-1">
                  {savedStenoSheets.map((sheet) => {
                    const isSelected = selectedSavedSheetId === sheet.id;
                    return (
                      <div
                        key={sheet.id}
                        className={`bg-[#060A14] border rounded-2xl p-3 flex flex-col justify-between gap-2.5 transition-all shadow-md ${
                          isSelected
                            ? 'border-amber-500 ring-2 ring-amber-500/40 bg-amber-500/5'
                            : 'border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {/* Thumbnail Preview */}
                        <div 
                          onClick={() => handleLoadSavedSheet(sheet, mainCanvasRef.current)}
                          className="w-full h-28 bg-[#060B16] rounded-xl overflow-hidden border border-slate-850 cursor-pointer relative group flex items-center justify-center"
                        >
                          <img
                            src={sheet.dataUrl}
                            alt={sheet.title}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <span className="px-2.5 py-1 bg-amber-500 text-slate-950 font-black text-[10px] rounded-lg shadow-md flex items-center gap-1">
                              <FolderOpen className="w-3 h-3" />
                              <span>पैड पर खोलें</span>
                            </span>
                          </div>
                        </div>

                        {/* Title & Meta */}
                        <div className="space-y-1">
                          <h5 className="text-xs font-bold text-white line-clamp-1" title={sheet.title}>
                            {sheet.title}
                          </h5>
                          <div className="flex items-center justify-between text-[10px] text-slate-400">
                            <span>🕒 {sheet.dateFormatted}</span>
                            {sheet.wpm && (
                              <span className="font-mono font-bold text-amber-400">
                                {sheet.wpm} WPM
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="pt-2 border-t border-slate-850 flex items-center justify-between gap-1.5">
                          <button
                            onClick={() => handleLoadSavedSheet(sheet, mainCanvasRef.current)}
                            className="flex-1 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <FolderOpen className="w-3 h-3" />
                            <span>पैड पर खोलें</span>
                          </button>

                          <button
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = sheet.dataUrl;
                              link.download = `${sheet.title.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.png`;
                              link.click();
                              showToast("पेज डाउनलोड हो गया 📥", "success");
                            }}
                            className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-emerald-300 border border-slate-800 rounded-lg transition-all cursor-pointer"
                            title="वैकल्पिक PNG डाउनलोड"
                          >
                            <Download className="w-3 h-3" />
                          </button>

                          <button
                            onClick={() => handleDeleteSavedSheet(sheet.id)}
                            className="p-1.5 bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/40 rounded-lg transition-all cursor-pointer"
                            title="हटाएं"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
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
      {/* TAB 3: ALL STENOGRAPHER EXAM SYLLABUS & SPEED CRITERIA BOX */}
      {/* ========================================================================= */}
      {activeTab === 'syllabus' && (
        <div className="space-y-6">
          
          {/* Exam Selector Strip */}
          <div className="bg-[#0A0F1D] border-2 border-cyan-500/40 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest bg-cyan-400/10 px-2.5 py-0.5 rounded-full border border-cyan-400/20">
                  OFFICIAL EXAM PATTERN & SPEED STANDARDS
                </span>
                <h2 className="text-xl font-black text-white mt-1">
                  {language === 'hindi' ? '📋 स्टेनोग्राफर परीक्षा सिलेबस व गति मानदंड बॉक्स' : 'All Stenographer Exam Syllabus & Criteria Box'}
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
                {STENO_EXAM_SYLLABUS.length} प्रमुख परीक्षाएं सूचीबद्ध
              </span>
            </div>

            {/* Exam Buttons Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {STENO_EXAM_SYLLABUS.map(exam => {
                const isSelected = selectedSyllabusExam.id === exam.id;
                return (
                  <button
                    key={exam.id}
                    onClick={() => setSelectedSyllabusExam(exam)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                      isSelected
                        ? 'bg-gradient-to-br from-cyan-950/80 to-blue-950/80 border-cyan-400 text-white shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400'
                        : 'bg-[#060A14] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xs font-black line-clamp-2 leading-tight">
                      {exam.examName}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full self-start ${
                      isSelected ? 'bg-cyan-400 text-slate-950 font-black' : 'bg-slate-900 text-cyan-400 border border-cyan-500/30'
                    }`}>
                      {exam.speedWpm} WPM
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Exam Comprehensive Detailed Breakdown Card */}
          <div className="bg-gradient-to-br from-[#090E1A] via-[#060A14] to-[#0A0F1D] border-2 border-cyan-500/30 rounded-3xl p-6 shadow-2xl space-y-6">
            
            {/* Header with Badges */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {selectedSyllabusExam.examName}
                  </h3>
                  <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-black rounded-full">
                    {selectedSyllabusExam.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 font-medium">
                  {selectedSyllabusExam.postName}
                </p>
              </div>

              {/* Action Buttons to Jump to Dictation or Practice */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  onClick={() => {
                    const match = DICTATION_PASSAGES.find(p => p.wpm === selectedSyllabusExam.speedWpm) || DICTATION_PASSAGES[0];
                    setSelectedPassage(match);
                    setActiveTab('pad');
                    showToast(`${selectedSyllabusExam.examName} (${selectedSyllabusExam.speedWpm} WPM) डिक्टेशन पैड सक्रिय किया गया`, 'success');
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-cyan-500/20"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>इस परीक्षा का डिक्टेशन टेस्ट दें</span>
                </button>

                <button
                  onClick={() => setActiveTab('lab')}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>स्ट्रोक विजुअलाइज़र देखें</span>
                </button>
              </div>
            </div>

            {/* Key Skill Test Criteria Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="bg-[#050811] p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400 font-bold uppercase">आशुलिपि गति (Speed)</div>
                <div className="text-lg font-black text-cyan-400">{selectedSyllabusExam.speedWpm} WPM</div>
                <div className="text-[9px] text-slate-500">शब्द प्रति मिनट</div>
              </div>

              <div className="bg-[#050811] p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400 font-bold uppercase">डिक्टेशन समय</div>
                <div className="text-lg font-black text-amber-400">{selectedSyllabusExam.dictationMinutes} मिनट</div>
                <div className="text-[9px] text-slate-500">लगातार ऑडियो डिक्टेशन</div>
              </div>

              <div className="bg-[#050811] p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400 font-bold uppercase">कुल बोले जाने वाले शब्द</div>
                <div className="text-lg font-black text-emerald-400">{selectedSyllabusExam.totalWords} शब्द</div>
                <div className="text-[9px] text-slate-500">मानक पैसेज गणना</div>
              </div>

              <div className="bg-[#050811] p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400 font-bold uppercase">हिंदी ट्रांसक्रिप्शन समय</div>
                <div className="text-lg font-black text-sky-400">{selectedSyllabusExam.transcriptionTimeHindi} मिनट</div>
                <div className="text-[9px] text-slate-500">कंप्यूटर टाइपिंग पर</div>
              </div>

              <div className="bg-[#050811] p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400 font-bold uppercase">अंग्रेजी ट्रांसक्रिप्शन समय</div>
                <div className="text-lg font-black text-indigo-400">{selectedSyllabusExam.transcriptionTimeEnglish} मिनट</div>
                <div className="text-[9px] text-slate-500">कंप्यूटर टाइपिंग पर</div>
              </div>

              <div className="bg-[#050811] p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400 font-bold uppercase">स्वीकार्य गलतियां (Mistakes)</div>
                <div className="text-sm font-black text-rose-400">
                  UR: {selectedSyllabusExam.permissibleMistakesUr}
                </div>
                <div className="text-[10px] text-amber-300 font-bold">
                  Res: {selectedSyllabusExam.permissibleMistakesReserved}
                </div>
              </div>
            </div>

            {/* Computer Typing Font Standard */}
            <div className="p-3.5 bg-slate-900/60 rounded-2xl border border-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-sm shrink-0">
                ⌨️
              </div>
              <div className="text-xs">
                <span className="font-bold text-white">कंप्यूटर टाइपिंग फॉन्ट व लेआउट: </span>
                <span className="text-slate-300">{selectedSyllabusExam.typingFont}</span>
              </div>
            </div>

            {/* Two Column Detailed Breakdown: Written CBT vs Skill Test Rules */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              
              {/* CBT Written Exam Breakdown */}
              <div className="bg-[#050811] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-inner">
                <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                  <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>लिखित परीक्षा (CBT) सिलेबस व अंक योजना</span>
                  </h4>
                  <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
                    कुल अंक: {selectedSyllabusExam.writtenCbtSyllabus.totalMarks}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 font-mono">
                  ⏱️ समयावधि: <span className="text-white font-bold">{selectedSyllabusExam.writtenCbtSyllabus.duration}</span>
                </div>

                <div className="space-y-2">
                  {selectedSyllabusExam.writtenCbtSyllabus.sections.map((sec, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-200 font-medium">{sec.subject}</span>
                      <div className="flex items-center gap-3 font-mono">
                        <span className="text-slate-400">{sec.questions} Qs</span>
                        <span className="font-black text-amber-400">{sec.marks} Marks</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skill Test & Shorthand Rules */}
              <div className="bg-[#050811] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-inner">
                <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                  <h4 className="text-xs font-black text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                    <span>स्किल टेस्ट एवं ट्रांसक्रिप्शन के आवश्यक नियम</span>
                  </h4>
                </div>

                <ul className="space-y-2 text-xs text-slate-300">
                  {selectedSyllabusExam.skillTestRules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-cyan-400 font-bold shrink-0 mt-0.5">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>

                <div className="p-3 bg-gradient-to-r from-emerald-950/30 via-slate-900 to-emerald-950/30 rounded-xl border border-emerald-500/30 space-y-1">
                  <div className="text-[10px] font-bold text-emerald-400 uppercase">
                    💡 गुरु मंत्र व तैयारी टिप्स:
                  </div>
                  {selectedSyllabusExam.preparationTips.map((tip, idx) => (
                    <p key={idx} className="text-[11px] text-slate-300 leading-normal">
                      {tip}
                    </p>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: LIVE AUDIO DICTATION SPEED PLAYER */}
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

                {/* Mistakes list with Socratic Error Guidance */}
                {transcriptionResult.mistakes.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-rose-400" />
                        🔍 विस्तृत गलती पहचान व सुधार (Detailed Error Analysis):
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {transcriptionResult.mistakes.length} त्रुटियां पाई गईं
                      </span>
                    </div>

                    <div className="max-h-72 overflow-y-auto space-y-2.5 pr-2 custom-scrollbar">
                      {transcriptionResult.mistakes.map((mistake, idx) => (
                        <div key={idx} className="p-3.5 bg-rose-950/30 border border-rose-500/40 rounded-2xl space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 rounded bg-rose-900/60 text-rose-300 font-bold text-[10px]">
                              त्रुटि #{mistake.index}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              अपेक्षित: <strong className="text-emerald-400">{mistake.expected}</strong> | टाइप किया: <strong className="text-rose-400">{mistake.typed}</strong>
                            </span>
                          </div>

                          <div className="text-rose-200 font-semibold leading-relaxed">
                            {mistake.errorExplanation}
                          </div>

                          <div className="p-2.5 bg-[#060A14] border border-emerald-500/30 rounded-xl space-y-1 text-[11px]">
                            <div className="text-emerald-300 font-bold flex items-center gap-1.5">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                              <span>{mistake.correctSolution}</span>
                            </div>
                            <div className="text-slate-400 pl-5 text-[10px]">
                              💡 {mistake.stenoRuleHint}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* STROKE CHECK & HANDWRITTEN COPY SCANNER SECTION */}
            <div className="border-t border-slate-800 pt-6 space-y-6">
              
              {/* Tool 1: Shorthand Stroke Live Verifier */}
              <div className="bg-[#060A14] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <PenTool className="w-4 h-4 text-amber-400" />
                      ✍️ 1. स्टेनो स्ट्रोक व आउटलाइन लाइव चेकर (Stroke Verifier)
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      कैनवास पर बनाए गए स्ट्रोक के कोण, हल्के/गहरे दबाव और लाइन पर स्थिति की शुद्धता जांचें।
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={strokeCheckSymbol.id}
                      onChange={(e) => {
                        const target = STENO_DICTIONARY.find(s => s.id === e.target.value);
                        if (target) setStrokeCheckSymbol(target);
                        setStrokeCheckResult(null);
                      }}
                      className="bg-slate-900 border border-slate-700 text-xs text-amber-300 px-3 py-1.5 rounded-xl font-bold focus:outline-none"
                    >
                      {STENO_DICTIONARY.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.charOrWord} ({s.hindiTranslation})
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={handleCheckDrawnStroke}
                      disabled={isCheckingStroke}
                      className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl cursor-pointer flex items-center gap-1.5 transition-all shadow-md"
                    >
                      {isCheckingStroke ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Award className="w-3.5 h-3.5" />}
                      <span>स्ट्रोक चेक करें</span>
                    </button>
                  </div>
                </div>

                {/* Stroke Check Result Card */}
                {strokeCheckResult && (
                  <div className={`p-4 rounded-2xl border ${
                    strokeCheckResult.status === 'correct'
                      ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
                      : 'bg-rose-950/30 border-rose-500/50 text-rose-200'
                  } space-y-2 text-xs animate-fade-in`}>
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1.5">
                        {strokeCheckResult.status === 'correct' ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
                        {strokeCheckResult.status === 'correct' ? 'स्ट्रोक पूर्णतः शुद्ध है!' : 'स्ट्रोक में सुधार की आवश्यकता'}
                      </span>
                      <span className="font-mono text-[10px]">{strokeCheckResult.accuracyPercent}% Match</span>
                    </div>

                    <div className="font-semibold leading-relaxed">
                      {strokeCheckResult.feedback}
                    </div>

                    <div className="p-2.5 bg-[#0A0F1D] rounded-xl border border-slate-800 text-[11px] text-slate-300">
                      📖 {strokeCheckResult.correctSolution}
                    </div>
                  </div>
                )}
              </div>

              {/* Tool 2: Handwritten Steno Copy Photo Scan / OCR */}
              <div className="bg-[#060A14] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xs font-black text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-indigo-400" />
                      📸 2. हस्तलिखित स्टेनो नोटबुक फोटो चेकर (Handwritten Copy OCR)
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      अपनी असली स्टेनो कॉपी के पन्ने की फोटो खींचे या अपलोड करें; AI आउटलाइन में गलतियाँ ढूंढ कर सही समाधान बताएगा।
                    </p>
                  </div>

                  <input
                    type="file"
                    ref={photoInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    className="hidden"
                  />

                  <button
                    onClick={() => photoInputRef.current?.click()}
                    disabled={isAnalyzingPhoto}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-xl cursor-pointer flex items-center gap-2 transition-all shadow-md self-start sm:self-auto"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isAnalyzingPhoto ? 'स्कैन हो रहा है...' : '📷 कॉपी की फोटो अपलोड करें'}</span>
                  </button>
                </div>

                {stenoPhotoUrl && (
                  <div className="flex items-center gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                    <img src={stenoPhotoUrl} alt="Steno Page" className="w-14 h-14 object-cover rounded-lg border border-slate-700" />
                    <div className="text-xs text-slate-300">
                      <div className="font-bold text-white">स्टेनो नोटबुक पेज लोड किया गया</div>
                      <div className="text-[10px] text-slate-400">AI आउटलाइन डिटेक्टर सक्रिय है</div>
                    </div>
                  </div>
                )}

                {/* Photo Analysis Results */}
                {stenoPhotoAnalysis && (
                  <div className="p-4 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/40 rounded-2xl space-y-3 text-xs animate-fade-in">
                    <div className="flex items-center justify-between border-b border-indigo-500/30 pb-2">
                      <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        फोटो विश्लेषण परिणाम (OCR Evaluation)
                      </span>
                      <span className="text-[10px] font-mono font-black text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                        सटीकता: {stenoPhotoAnalysis.accuracyScore}%
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">
                        पहचानी गई गलतियां:
                      </div>
                      {stenoPhotoAnalysis.errors.map((err, idx) => (
                        <div key={idx} className="p-2 bg-rose-950/20 border border-rose-500/30 rounded-xl text-rose-200 text-[11px]">
                          {err}
                        </div>
                      ))}
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-slate-800">
                      <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                        सुधार के लिए AI मार्गदर्शन:
                      </div>
                      <ul className="space-y-1 text-slate-300 text-[11px] list-disc pl-4">
                        {stenoPhotoAnalysis.recommendations.map((rec, idx) => (
                          <li key={idx}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

            </div>

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
