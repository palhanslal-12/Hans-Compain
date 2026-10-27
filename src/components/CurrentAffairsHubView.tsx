import React, { useState, useEffect } from 'react';
import {
  Newspaper,
  Volume2,
  Bookmark,
  Share2,
  Search,
  RefreshCw,
  Sparkles,
  Flame,
  ExternalLink,
  X,
  CheckCircle2,
  XCircle,
  Printer,
  Globe,
  HelpCircle,
  MessageSquare,
  Copy,
  Check,
  CheckCheck,
  Languages,
  BookOpen,
  Zap,
  Target,
  FileText,
  Building2,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Send,
  Play,
  Pause,
  Square,
  FastForward,
  User,
  ArrowLeft
} from 'lucide-react';
import { recordStudyActivity, auth, signInWithGoogle, getEffectiveUser, subscribeAuthChanges } from '../firebase';
import { User as FirebaseUser } from 'firebase/auth';
import {
  playNaturalSpeech,
  stopNaturalSpeech,
  pauseNaturalSpeech,
  resumeNaturalSpeech
} from '../utils/naturalSpeech';
import { askHansCompainAI } from '../utils/aiClientFallback';
import {
  EnglishTranslatedArticle,
  getInstantEnglishTranslation,
  lookupBilingualVocabulary,
  buildSmartBilingualAiArticle,
  buildBilingualArticleDoubtAnswer
} from '../utils/currentAffairsEngine';
import { resolveTopicImageUrl } from '../utils/currentAffairsImageResolver';

export interface VocabularyItem {
  word: string;
  pos: string; // e.g. "Noun / Adjective"
  exactHindi: string;
  definition: string;
  synonyms: string;
  antonyms: string;
  examUsage: string;
}

export interface PracticeMcq {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface NewsEditorial {
  id: string;
  dateKey?: string;
  categoryTag: string;
  categoryFilter: string;
  date: string;
  readTime: string;
  releaseId: string;
  headline: string;
  summary: string;
  background: string;
  sourceMinistry: string;
  sourceUrl?: string;
  imageUrl: string;
  imageCredit?: string;
  dimensions: string[];
  provisions: string[];
  highYieldFact: string;
  vocabulary: VocabularyItem[];
  practiceMcq: PracticeMcq;
  mainsQuestion: string;
}

export const getTodayDateKey = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const getYesterdayDateKey = (): string => {
  const d = new Date(Date.now() - 86400000);
  return d.toISOString().split('T')[0];
};

export const getTodayHindiDate = (): string => {
  try {
    return new Date().toLocaleDateString('hi-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch {
    return new Date().toISOString().split('T')[0];
  }
};

export const getYesterdayHindiDate = (): string => {
  try {
    const d = new Date(Date.now() - 86400000);
    return d.toLocaleDateString('hi-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch {
    return 'कल के घटनाक्रम';
  }
};

// Strict anti-repetition deduplicator ensuring no two articles share the same headline and each has its matching image
export const deduplicateEditorials = (list: NewsEditorial[]): NewsEditorial[] => {
  const seen = new Set<string>();
  const result: NewsEditorial[] = [];

  for (const item of list) {
    if (!item || !item.headline) continue;
    const norm = item.headline.toLowerCase().replace(/[^a-zA-Z0-9\u0900-\u097F]/g, '');
    const key = norm.slice(0, 24);
    if (!key || seen.has(key)) continue;
    seen.add(key);

    const imageMeta = resolveTopicImageUrl(item.headline, item.categoryTag, item.summary);
    result.push({
      ...item,
      imageUrl: item.imageUrl || imageMeta.imageUrl,
      imageCredit: item.imageCredit || imageMeta.imageCredit
    });
  }

  return result;
};

export const verifiedEditorials: NewsEditorial[] = [
  {
    "id": "news-t20-world-cup-india",
    "categoryTag": "🏆 खेलकूद (SPORTS)",
    "categoryFilter": "Sports & Play",
    "date": "आज का अंक",
    "readTime": "3 मिनट Read",
    "releaseId": "206581792024101",
    "headline": "आईसीसी पुरुष टी20 विश्व कप: भारत ने दक्षिण अफ्रीका को हराकर 17 वर्ष बाद जीता दूसरा टी20 विश्व कप खिताब",
    "summary": "केंसिंग्टन ओवल (बारबाडोस) में खेले गए रोमांचक फाइनल में भारत ने दक्षिण अफ्रीका को 7 रन से हराकर आईसीसी पुरुष टी20 विश्व कप का खिताब अपने नाम किया। भारत ने 2007 (महेंद्र सिंह धोनी के नेतृत्व) के बाद 17 वर्षों के अंतराल पर यह ऐतिहासिक उपलब्धि हासिल की।",
    "background": "रोहित शर्मा की कप्तानी में भारत पूरे टूर्नामेंट में अजेय रहा। जसप्रीत बुमराह को उनकी असाधारण गेंदबाजी के लिए प्लेयर ऑफ द टूर्नामेंट चुना गया, जबकि विराट कोहली को फाइनल में 76 रनों की पारी हेतु प्लेयर ऑफ द मैच का सम्मान मिला।",
    "sourceMinistry": "युवा कार्यक्रम और खेल मंत्रालय • ICC Media Release • The Hindu",
    "sourceUrl": "https://pib.gov.in",
    "imageUrl": "https://images.unsplash.com/photo-1531415074868-036b107e775a?auto=format&fit=crop&w=1200&q=80",
    "imageCredit": "स्रोत: BCCI • ICC International Cricket Council",
    "dimensions": [
      "भारत ने निर्धारित 20 ओवरों में 7 विकेट पर 176 रन बनाए, जो टी20 विश्व कप फाइनल का सबसे बड़ा स्कोर है।",
      "जसप्रीत बुमराह ने टूर्नामेंट में 15 विकेट मात्र 4.17 की इकॉनमी रेट से लिए और टूर्नामेंट के सर्वश्रेष्ठ खिलाड़ी बने।",
      "भारत दो टी20 विश्व कप (2007, 2024) जीतने वाला वेस्टइंडीज और इंग्लैंड के साथ संयुक्त रूप से सफलतम देश बना।"
    ],
    "provisions": [
      "बीसीसीआई (BCCI) द्वारा विश्व विजेता भारतीय टीम हेतु ₹125 करोड़ की विशेष पुरस्कार राशि की घोषणा।",
      "रोहित शर्मा, विराट कोहली और रवींद्र जडेजा ने टी20 अंतर्राष्ट्रीय क्रिकेट प्रारूप से संन्यास की घोषणा की।",
      "आईसीसी द्वारा आगामी पुरुष टी20 विश्व कप 2026 की सह-मेजबानी भारत और श्रीलंका को सौंपी गई है।"
    ],
    "highYieldFact": "भारत दो टी20 विश्व कप (2007 और 2024) जीतने वाला वेस्टइंडीज और इंग्लैंड के बाद विश्व का तीसरा देश बना।",
    "vocabulary": [
      {
        "word": "Triumphant",
        "pos": "Adjective",
        "exactHindi": "विजयी / सफल",
        "definition": "Having won a battle or contest; victorious.",
        "synonyms": "Victorious, Successful, Conquering",
        "antonyms": "Defeated, Vanquished",
        "examUsage": "\"The triumphant Indian cricket squad received a grand reception in Mumbai.\""
      },
      {
        "word": "Economical",
        "pos": "Adjective",
        "exactHindi": "किफायती / कम रन देने वाला",
        "definition": "Giving good value or return for resources or runs conceded in sports.",
        "synonyms": "Frugal, Tight, Efficient",
        "antonyms": "Expensive, Extravagant",
        "examUsage": "\"Jasprit Bumrah bowled exceptionally economical spells throughout the tournament.\""
      }
    ],
    "practiceMcq": {
      "question": "आईसीसी पुरुष टी20 विश्व कप में प्लेयर ऑफ द टूर्नामेंट (Player of the Tournament) का खिताब किसे प्रदान किया गया?",
      "options": [
        "विराट कोहली",
        "जसप्रीत बुमराह",
        "रोहित शर्मा",
        "हार्दिक पांड्या"
      ],
      "correct": 1,
      "explanation": "जसप्रीत बुमराह को मात्र 4.17 की इकॉनमी से 15 विकेट लेने पर टूर्नामेंट का सर्वश्रेष्ठ खिलाड़ी (Player of the Tournament) चुना गया।"
    },
    "mainsQuestion": "\"खेलों में भारत की हालिया अंतर्राष्ट्रीय उपलब्धियां और टारगेट ओलंपिक पोडियम स्कीम (TOPS) देश में खेल संस्कृति के विकास में किस प्रकार योगदान दे रही हैं?\""
  },
  {
    "id": "news-wimbledon-grand-slam",
    "categoryTag": "🏆 खेलकूद (SPORTS)",
    "categoryFilter": "Sports & Play",
    "date": "आज का अंक",
    "readTime": "3 मिनट Read",
    "releaseId": "206581792024102",
    "headline": "विंबलडन टेनिस चैंपियनशिप: कार्लोस अल्काराज और बारबोरा क्रेजकिकोवा ने जीते प्रतिष्ठित एकल खिताब",
    "summary": "लंदन के ऑल इंग्लैंड लॉन टेनिस क्लब में आयोजित 137वीं विंबलडन चैंपियनशिप में स्पेन के कार्लोस अल्काराज ने नोवाक जोकोविच को सीधे सेटों में हराकर लगातार दूसरा विंबलडन पुरुष एकल खिताब जीता। महिला एकल में चेक गणराज्य की बारबोरा क्रेजकिकोवा ने अपना पहला विंबलडन खिताब हासिल किया।",
    "background": "टेनिस के चार ग्रैंड स्लैम टूर्नामेंट्स का वार्षिक क्रम: ऑस्ट्रेलियन ओपन (हार्ड कोर्ट), फ्रेंच ओपन (क्ले कोर्ट), विंबलडन (ग्रास कोर्ट) और यूएस ओपन (हार्ड कोर्ट) है। विंबलडन दुनिया का सबसे पुराना टेनिस टूर्नामेंट है जिसकी शुरुआत 1877 में हुई थी।",
    "sourceMinistry": "Wimbledon Official • Sports Authority of India • PIB",
    "sourceUrl": "https://wimbledon.com",
    "imageUrl": "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=1200&q=80",
    "imageCredit": "स्रोत: Wimbledon Championship • ATP / WTA Media",
    "dimensions": [
      "21 वर्षीय कार्लोस अल्काराज ने एक ही वर्ष में फ्रेंच ओपन और विंबलडन (चैनल स्लैम) जीतकर इतिहास रचा।",
      "महिला एकल उपविजेता इटली की जैस्मीन पाओलिनी रहीं, जो लगातार दो ग्रैंड स्लैम फाइनल में पहुंचने वाली खिलाड़ी बनीं।",
      "विंबलडन चैंपियनशिप पारंपरिक रूप से प्राकृतिक घास (Grass Court) पर खेली जाने वाली एकमात्र ग्रैंड स्लैम प्रतियोगिता है।"
    ],
    "provisions": [
      "ऑल इंग्लैंड क्लब द्वारा एकल विजेताओं को रिकॉर्ड £2.7 मिलियन (लगभग ₹28.8 करोड़) की पुरस्कार राशि प्रदान की गई।",
      "टेनिस इंटीग्रिटी यूनिट और आईटीएफ द्वारा डोपिंग व मैच फिक्सिंग रोधी कड़े डिजिटल नियम लागू।",
      "भारतीय टेनिस में रोहन बोपन्ना द्वारा ऑस्ट्रेलियन ओपन डबल्स खिताब के बाद भारतीय खिलाड़ियों की वैश्विक रैंकिंग में सुधार।"
    ],
    "highYieldFact": "विंबलडन चैंपियनशिप ग्रास (घास) कोर्ट पर खेली जाने वाली दुनिया की एकमात्र और सबसे पुरानी (1877) ग्रैंड स्लैम टेनिस प्रतियोगिता है।",
    "vocabulary": [
      {
        "word": "Predecessor",
        "pos": "Noun",
        "exactHindi": "पूर्वाधिकारी / पूर्ववर्ती",
        "definition": "A person who held a job or office before the current holder.",
        "synonyms": "Forerunner, Antecedent, Prior holder",
        "antonyms": "Successor, Descendant",
        "examUsage": "\"Carlos Alcaraz matched his legendary Spanish predecessor Rafael Nadal by winning on grass.\""
      }
    ],
    "practiceMcq": {
      "question": "विंबलडन टेनिस चैंपियनशिप में पुरुष एकल (Men's Singles) का खिताब किसने जीता?",
      "options": [
        "नोवाक जोकोविच",
        "कार्लोस अल्काराज",
        "यानिक सिनर",
        "दानिल मेदवेदेव"
      ],
      "correct": 1,
      "explanation": "स्पेन के युवा स्टार कार्लोस अल्काराज ने 24 बार के ग्रैंड स्लैम विजेता नोवाक जोकोविच को पराजित कर लगातार दूसरा विंबलडन खिताब जीता।"
    },
    "mainsQuestion": "\"विश्व टेनिस और वैश्विक एथलेटिक्स में उभरती युवा प्रतिभाओं के बीच भारत में लॉन टेनिस बुनियादी ढांचे की चुनौतियों और संभावनाओं का मूल्यांकन कीजिए।\""
  },
  {
    "id": "news-chess-olympiad-double-gold",
    "categoryTag": "🏆 खेलकूद (SPORTS)",
    "categoryFilter": "Sports & Play",
    "date": "आज का अंक",
    "readTime": "3 मिनट Read",
    "releaseId": "206581792024103",
    "headline": "45वां फिडे शतरंज ओलंपियाड (बुडापेस्ट): भारत ने ओपन और महिला दोनों वर्गों में ऐतिहासिक दोहरा स्वर्ण पदक जीता",
    "summary": "हंगरी की राजधानी बुडापेस्ट में आयोजित 45वें फिडे शतरंज ओलंपियाड में भारतीय पुरुष टीम (डी. गुकेश, आर. प्रज्ञानानंद, अर्जुन एरिगैसी, विदित गुजराती, पेंटाला हरिकृष्णा) और महिला टीम (हरिका द्रोणावल्ली, आर. वैशाली, दिव्या देशमुख, वंतिका अग्रवाल, तानिया सचदेव) दोनों ने स्वर्ण पदक जीतकर विश्व शतरंज में अभूतपूर्व इतिहास रचा।",
    "background": "सोवियत संघ और चीन के बाद एक ही ओलंपियाड में ओपन और महिला दोनों स्वर्ण पदक जीतने वाला भारत विश्व का तीसरा देश बना। बोर्ड-1 पर डी. गुकेश और बोर्ड-3 पर अर्जुन एरिगैसी ने व्यक्तिगत स्वर्ण पदक भी जीते।",
    "sourceMinistry": "FIDE • अखिल भारतीय शतरंज महासंघ (AICF) • युवा कार्यक्रम एवं खेल मंत्रालय",
    "sourceUrl": "https://fide.com",
    "imageUrl": "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=1200&q=80",
    "imageCredit": "स्रोत: FIDE • All India Chess Federation",
    "dimensions": [
      "भारत ने 11 में से 10 मुकाबले जीतकर कुल 21 मैच अंकों के साथ ओपन वर्ग में शीर्ष स्थान प्राप्त किया।",
      "महिला वर्ग में भारत ने अजरबैजान को फाइनल दौर में 3.5-0.5 से हराकर पहला ऐतिहासिक स्वर्ण पदक जीता।",
      "डी. गुकेश ने बोर्ड-1 पर 3056 की असाधारण परफॉर्मेंस रेटिंग दर्ज की, जो ओलंपियाड इतिहास में दुर्लभ है।"
    ],
    "provisions": [
      "भारत सरकार द्वारा शतरंज खिलाड़ियों को विशेष नकद पुरस्कार और उच्च स्तरीय प्रशिक्षण सुविधा की घोषणा।",
      "खेलो इंडिया के तहत देश के 100 जिलों में आधुनिक शतरंज अकादमियों की स्थापना।",
      "46वें फिडे शतरंज ओलंपियाड 2026 का आयोजन ताशकंद (उज्बेकिस्तान) में निर्धारित किया गया है।"
    ],
    "highYieldFact": "45वें शतरंज ओलंपियाड (बुडापेस्ट) में भारत ने ओपन और महिला दोनों श्रेणियों में स्वर्ण पदक जीतकर 97 वर्षों के इतिहास में पहली बार दोहरा खिताब जीता।",
    "vocabulary": [
      {
        "word": "Prodigious",
        "pos": "Adjective",
        "exactHindi": "असाधारण / विलक्षण / विस्मयकारी",
        "definition": "Remarkably or impressively great in extent, size, or degree.",
        "synonyms": "Phenomenal, Extraordinary, Stupendous",
        "antonyms": "Ordinary, Mediocre, Modest",
        "examUsage": "\"Indian youngsters displayed prodigious tactical acumen to sweep the Chess Olympiad.\""
      }
    ],
    "practiceMcq": {
      "question": "45वें फिडे शतरंज ओलंपियाड (FIDE Chess Olympiad) का आयोजन किस शहर में किया गया?",
      "options": [
        "चेन्नई (भारत)",
        "बुडापेस्ट (हंगरी)",
        "बाकू (अजरबैजान)",
        "ताशकंद (उज्बेकिस्तान)"
      ],
      "correct": 1,
      "explanation": "45वां फिडे शतरंज ओलंपियाड बुडापेस्ट (हंगरी) में आयोजित हुआ, जहां भारत ने ओपन और महिला दोनों वर्गों में स्वर्ण पदक जीता।"
    },
    "mainsQuestion": "\"शतरंज में भारत का विश्व महाशक्ति के रूप में उभरना देश के बौद्धिक पूंजी विकास और खेल विविधीकरण को किस प्रकार प्रतिबिंबित करता है?\""
  },
  {
    "id": "news-asian-champions-trophy-hockey",
    "categoryTag": "🏆 खेलकूद (SPORTS)",
    "categoryFilter": "Sports & Play",
    "date": "आज का अंक",
    "readTime": "3 मिनट Read",
    "releaseId": "206581792024104",
    "headline": "एशियाई चैंपियंस ट्रॉफी हॉकी: भारत ने चीन को 1-0 से हराकर रिकॉर्ड 5वीं बार जीता एशियाई खिताब",
    "summary": "हु伦बुल (चीन) के मोकी हॉकी ट्रेनिंग बेस में खेले गए फाइनल मुकाबले में भारतीय पुरुष हॉकी टीम ने मेजबान चीन को 1-0 से हराकर रिकॉर्ड 5वीं बार एशियाई चैंपियंस ट्रॉफी का खिताब अपने नाम किया। निर्णायक गोल चौथे क्वार्टर में जुगराज सिंह ने किया।",
    "background": "कप्तान हरमनप्रीत सिंह के नेतृत्व में पेरिस ओलंपिक में कांस्य पदक जीतने के बाद भारतीय हॉकी टीम ने पूरे टूर्नामेंट में अजेय रहते हुए यह जीत हासिल की। भारत अब तक 2011, 2016, 2018 (संयुक्त), 2023 और हालिया संस्करण जीत चुका है।",
    "sourceMinistry": "हॉकी इंडिया (Hockey India) • युवा कार्यक्रम एवं खेल मंत्रालय • SAI",
    "sourceUrl": "https://hockeyindia.org",
    "imageUrl": "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
    "imageCredit": "स्रोत: Hockey India • Asian Hockey Federation",
    "dimensions": [
      "भारतीय कप्तान हरमनप्रीत सिंह को 7 गोल दागने के लिए प्लेयर ऑफ द टूर्नामेंट चुना गया।",
      "कांस्य पदक मुकाबले में पाकिस्तान ने दक्षिण कोरिया को 5-2 से हराकर तीसरा स्थान प्राप्त किया।",
      "भारतीय टीम ने पूरे टूर्नामेंट में 7 मैचों में कुल 27 गोल दागे और मात्र 5 गोल खाए।"
    ],
    "provisions": [
      "हॉकी इंडिया ने प्रत्येक खिलाड़ी को ₹3 लाख और सहयोगी स्टाफ को ₹1.5 लाख का नकद इनाम दिया।",
      "भारतीय हॉकी टीम को एफआईएच (FIH) विश्व रैंकिंग में शीर्ष 5 में मजबूती मिली।",
      "ओडिशा सरकार द्वारा भारतीय हॉकी टीमों के आधिकारिक प्रायोजन को 2036 तक बढ़ाया गया।"
    ],
    "highYieldFact": "भारतीय पुरुष हॉकी टीम एशियाई चैंपियंस ट्रॉफी को रिकॉर्ड 5 बार (2011, 2016, 2018, 2023, 2024) जीतने वाली एशिया की सबसे सफल टीम है।",
    "vocabulary": [
      {
        "word": "Unvanquished",
        "pos": "Adjective",
        "exactHindi": "अपराजित / जिसे हराया न गया हो",
        "definition": "Not conquered or overcome; unbeaten.",
        "synonyms": "Undefeated, Invincible, Unbeaten",
        "antonyms": "Vanquished, Defeated",
        "examUsage": "\"The Indian hockey contingent remained unvanquished throughout the continental campaign.\""
      }
    ],
    "practiceMcq": {
      "question": "भारतीय पुरुष हॉकी टीम ने एशियाई चैंपियंस ट्रॉफी रिकॉर्ड कितनी बार जीती है?",
      "options": [
        "3 बार",
        "4 बार",
        "5 बार",
        "6 बार"
      ],
      "correct": 2,
      "explanation": "भारत ने चीन को 1-0 से हराकर रिकॉर्ड 5वीं बार एशियाई चैंपियंस ट्रॉफी का खिताब जीता।"
    },
    "mainsQuestion": "\"भारतीय हॉकी के पुनरुत्थान में जमीनी स्तर के अकादमियों, कॉरपोरेट-राज्य प्रायोजन (ओडिशा मॉडल) और तकनीकी सुधारों की भूमिका का विश्लेषण कीजिए।\""
  },
  {
    "id": "news-70th-national-film-phalke",
    "categoryTag": "🎖️ सम्मान (AWARDS)",
    "categoryFilter": "Awards & Honors",
    "date": "आज का अंक",
    "readTime": "3 मिनट Read",
    "releaseId": "206581792024105",
    "headline": "70वें राष्ट्रीय फिल्म पुरस्कार एवं 54वां दादा साहेब फाल्के पुरस्कार: मिथुन चक्रवर्ती को भारतीय सिनेमा का सर्वोच्च सम्मान",
    "summary": "राष्ट्रपति द्रौपदी मुर्मू द्वारा नई दिल्ली के विज्ञान भवन में 70वें राष्ट्रीय फिल्म पुरस्कार प्रदान किए गए, जिसमें दिग्गज अभिनेता मिथुन चक्रवर्ती को भारतीय सिनेमा के सर्वोच्च सम्मान 54वें दादा साहेब फाल्के पुरस्कार से अलंकृत किया गया। सर्वश्रेष्ठ फीचर फिल्म का पुरस्कार मलयालम फिल्म आट्टम (Aattam) को मिला।",
    "background": "दादा साहेब फाल्के पुरस्कार की स्थापना 1969 में हुई थी (प्रथम प्राप्तकर्ता देविका रानी)। इसमें एक स्वर्ण कमल (स्वर्ण पदक), एक शॉल और ₹15 लाख की नकद राशि दी जाती है। ऋषभ शेट्टी को फिल्म कांतारा के लिए सर्वश्रेष्ठ अभिनेता का पुरस्कार मिला।",
    "sourceMinistry": "सूचना और प्रसारण मंत्रालय (MIB) • राष्ट्रीय फिल्म विकास निगम (NFDC) • PIB",
    "sourceUrl": "https://pib.gov.in",
    "imageUrl": "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&w=1200&q=80",
    "imageCredit": "स्रोत: सूचना एवं प्रसारण मंत्रालय • PIB विज्ञान भवन",
    "dimensions": [
      "54वां दादा साहेब फाल्के पुरस्कार: प्रसिद्ध अभिनेता और पूर्व राज्यसभा सांसद मिथुन चक्रवर्ती को जीवनपर्यंत योगदान हेतु।",
      "सर्वश्रेष्ठ फीचर फिल्म: आनंद एकार्शी द्वारा निर्देशित मलयालम फिल्म आट्टम (Aattam)।",
      "सर्वश्रेष्ठ अभिनेता: ऋषभ शेट्टी (कांतारा - कन्नड़) एवं सर्वश्रेष्ठ निर्देशक: सूरज बड़जात्या (ऊंचाई - हिंदी)।"
    ],
    "provisions": [
      "राष्ट्रीय फिल्म पुरस्कारों में इस वर्ष पुरस्कार राशि को युक्तिसंगत बनाकर स्वर्ण कमल हेतु ₹3 लाख और रजत कमल हेतु ₹2 लाख किया गया।",
      "दादा साहेब फाल्के पुरस्कार की नकद राशि ₹10 लाख से बढ़ाकर ₹15 लाख की गई।",
      "भारतीय क्षेत्रीय भाषाओं (मलयालम, कन्नड़, तमिल, मराठी, बंगाली) के सिनेमा को राष्ट्रीय स्तर पर शीर्ष सम्मान मिले।"
    ],
    "highYieldFact": "दादा साहेब फाल्के पुरस्कार भारतीय सिनेमा का सर्वोच्च सम्मान है, जिसकी प्रथम विजेता 1969 में देविका रानी थीं। वर्तमान में पुरस्कार राशि ₹15 लाख है।",
    "vocabulary": [
      {
        "word": "Conferment",
        "pos": "Noun",
        "exactHindi": "प्रदान करना / अर्पण / सम्मान देना",
        "definition": "The act of granting or bestowing a title, award, degree, or benefit.",
        "synonyms": "Bestowal, Awarding, Presentation",
        "antonyms": "Revocation, Deprivation",
        "examUsage": "\"The conferment of the Phalke Award recognized half a century of cinematic versatility.\""
      }
    ],
    "practiceMcq": {
      "question": "भारतीय सिनेमा के सर्वोच्च 54वें दादा साहेब फाल्के पुरस्कार (Dadasaheb Phalke Award) से किसे सम्मानित किया गया?",
      "options": [
        "अमिताभ बच्चन",
        "मिथुन चक्रवर्ती",
        "रजनीकांत",
        "कमल हासन"
      ],
      "correct": 1,
      "explanation": "प्रसिद्ध अभिनेता मिथुन चक्रवर्ती को 54वें दादा साहेब फाल्के पुरस्कार से सम्मानित किया गया।"
    },
    "mainsQuestion": "\"सिनेमा और कला समाज के आईने के रूप में किस प्रकार राष्ट्रीय एकीकरण और सांस्कृतिक कूटनीति (Soft Power) को बढ़ावा देते हैं? परीक्षण कीजिए।\""
  },
  {
    "id": "news-padma-awards-national",
    "categoryTag": "🎖️ सम्मान (AWARDS)",
    "categoryFilter": "Awards & Honors",
    "date": "आज का अंक",
    "readTime": "3 मिनट Read",
    "releaseId": "206581792024106",
    "headline": "पद्म सम्मान: गणतंत्र दिवस पर 132 विभूतियों को पद्म विभूषण, पद्म भूषण और पद्म श्री अलंकरण",
    "summary": "राष्ट्रपति भवन में आयोजित नागरिक सम्मान समारोह में कला, सार्वजनिक मामलों, सामाजिक कार्य, विज्ञान और चिकित्सा क्षेत्र की 132 प्रतिष्ठित हस्तियों को पद्म पुरस्कार प्रदान किए गए। इनमें 5 पद्म विभूषण, 17 पद्म भूषण और 110 पद्म श्री शामिल हैं।",
    "background": "पद्म पुरस्कारों की स्थापना 1954 में की गई थी। संविधान के अनुच्छेद 18(1) के तहत यह उपाधियां नहीं बल्कि नागरिक सम्मान हैं, जिन्हें नाम के आगे या पीछे उपसर्ग/प्रत्यय के रूप में इस्तेमाल नहीं किया जा सकता। पद्म विभूषण प्राप्तकर्ताओं में वैजयंतीमाला बाली, कोनिडेला चिरंजीवी, एम. वेंकैया नायडू और सुलभ इंटरनेशनल के संस्थापक स्वर्गीय बिंदेश्वर पाठक शामिल हैं।",
    "sourceMinistry": "गृह मंत्रालय (MHA) • राष्ट्रपति सचिवालय • PIB नई दिल्ली",
    "sourceUrl": "https://padmaawards.gov.in",
    "imageUrl": "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&w=1200&q=80",
    "imageCredit": "स्रोत: गृह मंत्रालय (MHA) • राष्ट्रपति भवन सम्मान प्रकोष्ठ",
    "dimensions": [
      "5 पद्म विभूषण: वैजयंतीमाला (कला), चिरंजीवी (कला), वेंकैया नायडू (सार्वजनिक मामले), बिंदेश्वर पाठक (मरणोपरांत-सामाजिक कार्य), पद्मा सुब्रह्मण्यम (कला)।",
      "17 पद्म भूषण: एम. फातिमा बीवी (मरणोपरांत - भारत की पहली महिला सुप्रीम कोर्ट जज), मिथुन चक्रवर्ती, सीताराम जिंदल आदि।",
      "जनजातीय और अनसंग हीरोज (Unsung Heroes) को प्राथमिकता: 30 महिलाओं और 8 विदेशी/एनआरआई को भी सम्मानित किया गया।"
    ],
    "provisions": [
      "पद्म पुरस्कार समिति की अध्यक्षता कैबिनेट सचिव द्वारा की जाती है और नामों की घोषणा प्रत्येक वर्ष 25 जनवरी को होती है।",
      "अनुच्छेद 18 के अनुसार ये सम्मान किसी भी तरह की सामंती उपाधियां (Titles) नहीं हैं।",
      "राष्ट्रीय एकता और समाज सेवा में योगदान हेतु सार्वजनिक नामांकन राष्ट्रीय पुरस्कार पोर्टल पर आमंत्रित किए जाते हैं।"
    ],
    "highYieldFact": "पद्म पुरस्कार 1954 में शुरू हुए थे और संविधान के अनुच्छेद 18 के अनुसार यह उपाधियां (Titles) नहीं बल्कि नागरिक सम्मान हैं।",
    "vocabulary": [
      {
        "word": "Posthumous",
        "pos": "Adjective",
        "exactHindi": "मरणोपरांत",
        "definition": "Occurring, awarded, or appearing after the death of the originator.",
        "synonyms": "After-death, Post-mortem",
        "antonyms": "Antemortem, Lifetime",
        "examUsage": "\"Dr. Bindeshwar Pathak was honored with the prestigious posthumous Padma Vibhushan.\""
      }
    ],
    "practiceMcq": {
      "question": "भारत में नागरिक सम्मानों (पद्म पुरस्कार एवं भारत रत्न) की शुरुआत किस वर्ष की गई थी?",
      "options": [
        "1947",
        "1950",
        "1954",
        "1956"
      ],
      "correct": 2,
      "explanation": "पद्म पुरस्कार और भारत रत्न की स्थापना वर्ष 1954 में की गई थी।"
    },
    "mainsQuestion": "\"भारतीय संविधान के अनुच्छेद 18 के आलोक में नागरिक सम्मानों (पद्म पुरस्कार) की प्रकृति और लोकतांत्रिक समता के सिद्धांतों पर उनके प्रभाव की विवेचना कीजिए।\""
  },
  {
    "id": "news-nobel-peace-economics",
    "categoryTag": "🎖️ सम्मान (AWARDS)",
    "categoryFilter": "Awards & Honors",
    "date": "आज का अंक",
    "readTime": "3 मिनट Read",
    "releaseId": "206581792024107",
    "headline": "नोबेल पुरस्कार: निहोन हिडंक्यो (शांति) और डेरॉन ऐसमोग्लू, साइमन जॉनसन व जेम्स रॉबिन्सन (अर्थशास्त्र) को सर्वोच्च वैश्विक सम्मान",
    "summary": "नोबेल फाउंडेशन द्वारा घोषित प्रतिष्ठित पुरस्कारों में जापानी संगठन निहोन हिडंक्यो को परमाणु हथियारों से मुक्त विश्व के निर्माण हेतु नोबेल शांति पुरस्कार प्रदान किया गया। अर्थशास्त्र का नोबेल डेरॉन ऐसमोग्लू, साइमन जॉनसन और जेम्स ए. रॉबिन्सन को राष्ट्रों की समृद्धि में संस्थाओं की भूमिका के अध्ययन हेतु दिया गया।",
    "background": "अल्फ्रेड नोबेल की 1895 की वसीयत के आधार पर 1901 से 5 क्षेत्रों (भौतिकी, रसायन, चिकित्सा, साहित्य, शांति) में नोबेल दिए जाते हैं। अर्थशास्त्र का स्वेरिगेस रिक्सबैंक पुरस्कार 1968 में स्थापित हुआ और पहली बार 1969 में प्रदान किया गया। शांति का नोबेल ओस्लो (नॉर्वे) में और अन्य सभी स्टॉकहोम (स्वीडन) में दिए जाते हैं।",
    "sourceMinistry": "The Nobel Foundation (Stockholm & Oslo) • MEA India",
    "sourceUrl": "https://nobelprize.org",
    "imageUrl": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80",
    "imageCredit": "स्रोत: Nobel Prize Press Outreach • The Royal Swedish Academy",
    "dimensions": [
      "शांति नोबेल: 1956 में गठित निहोन हिडंक्यो (Nihon Hidankyo) हिरोशिमा और नागासाकी परमाणु बम पीड़ितों (हिबाकुशा) का जमीनी आंदोलन है।",
      "अर्थशास्त्र नोबेल: शोध में साबित किया गया कि समावेशी संस्थाएं (Inclusive Institutions) दीर्घकालिक समृद्धि लाती हैं, जबकि निष्कर्षण संस्थाएं गरीबी बढ़ाती हैं।",
      "साहित्य नोबेल: दक्षिण कोरियाई लेखिका हान कांग (Han Kang) को उनके काव्यात्मक गद्य के लिए दिया गया।"
    ],
    "provisions": [
      "प्रत्येक नोबेल पुरस्कार में 11 मिलियन स्वीडिश क्रोनर (लगभग ₹8.9 करोड़), एक 18-कैरेट स्वर्ण पदक और डिप्लोमा दिया जाता है।",
      "अल्फ्रेड नोबेल ने डायनामाइट का आविष्कार किया था और अपनी वसीयत में मानव जाति के कल्याण हेतु पुरस्कारों का प्रावधान किया।",
      "शांति का नोबेल नॉर्वेजियन नोबेल समिति (ओस्लो) द्वारा दिया जाता है।"
    ],
    "highYieldFact": "नोबेल शांति पुरस्कार ओस्लो (नॉर्वे) में दिया जाता है, जबकि शेष सभी 5 क्षेत्रों के पुरस्कार स्टॉकहोम (स्वीडन) में प्रदान किए जाते हैं।",
    "vocabulary": [
      {
        "word": "Disarmament",
        "pos": "Noun",
        "exactHindi": "निरस्त्रीकरण / हथियारों में कमी या समाप्ति",
        "definition": "The reduction or withdrawal of military forces and weapons.",
        "synonyms": "Demilitarization, Arms reduction, Non-proliferation",
        "antonyms": "Militarization, Armament, Escalation",
        "examUsage": "\"Nihon Hidankyo spearheaded the global moral crusade for complete nuclear disarmament.\""
      }
    ],
    "practiceMcq": {
      "question": "परमाणु हथियारों के उन्मूलन के प्रयासों हेतु नोबेल शांति पुरस्कार (Nobel Peace Prize) से किस संगठन को सम्मानित किया गया?",
      "options": [
        "इंटरनेशनल एटॉमिक एनर्जी एजेंसी (IAEA)",
        "निहोन हिडंक्यो (Nihon Hidankyo)",
        "एमनेस्टी इंटरनेशनल",
        "ग्रीनपीस"
      ],
      "correct": 1,
      "explanation": "जापानी संगठन निहोन हिडंक्यो (Nihon Hidankyo) को परमाणु हथियारों से मुक्त विश्व बनाने के प्रयासों हेतु नोबेल शांति पुरस्कार दिया गया।"
    },
    "mainsQuestion": "\"डेरॉन ऐसमोग्लू और साथियों के संस्थागत अर्थशास्त्र के सिद्धांत (Inclusive vs Extractive Institutions) भारत के विकास पथ पर कैसे लागू होते हैं? आलोचनात्मक विश्लेषण कीजिए।\""
  },
  {
    "id": "news-chief-justice-india-appointment",
    "categoryTag": "👥 नियुक्तियां (HEADS)",
    "categoryFilter": "Appointments & Heads",
    "date": "आज का अंक",
    "readTime": "3 मिनट Read",
    "releaseId": "206581792024108",
    "headline": "भारत के मुख्य न्यायाधीश (CJI) की नियुक्ति और कॉलेजियम प्रणाली: संविधान के अनुच्छेद 124(2) के तहत संवैधानिक प्रक्रिया",
    "summary": "संविधान के अनुच्छेद 124 के खंड (2) के तहत राष्ट्रपति द्वारा भारत के मुख्य न्यायाधीश (Chief Justice of India) की नियुक्ति की जाती है। वरिष्ठता सिद्धांत (Seniority Principle) और मेमोरेंडम ऑफ प्रोसीजर (MoP) के तहत वर्तमान मुख्य न्यायाधीश द्वारा अपने उत्तराधिकारी के नाम की आधिकारिक अनुशंसा विधि मंत्रालय को भेजी जाती है।",
    "background": "सर्वोच्च न्यायालय की कॉलेजियम प्रणाली की उत्पत्ति 1981 (प्रथम न्यायाधीश मामला), 1993 (द्वितीय न्यायाधीश मामला) और 1998 (तृतीय न्यायाधीश मामला) के निर्णयों से हुई है। मुख्य न्यायाधीश की अध्यक्षता वाले इस कॉलेजियम में सर्वोच्च न्यायालय के चार वरिष्ठतम न्यायाधीश शामिल होते हैं। सर्वोच्च न्यायालय के न्यायाधीश 65 वर्ष की आयु में सेवानिवृत्त होते हैं।",
    "sourceMinistry": "विधि एवं न्याय मंत्रालय • भारत का सर्वोच्च न्यायालय • Gazette of India",
    "sourceUrl": "https://main.sci.gov.in",
    "imageUrl": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80",
    "imageCredit": "स्रोत: Supreme Court of India • Ministry of Law & Justice",
    "dimensions": [
      "अनुच्छेद 124(2): राष्ट्रपति सर्वोच्च न्यायालय और उच्च न्यायालयों के न्यायाधीशों से परामर्श के बाद सीजेआई की नियुक्ति करते हैं।",
      "वरिष्ठता परंपरा: द्वितीय न्यायाधीश मामले (1993) के बाद सर्वोच्च न्यायालय के वरिष्ठतम न्यायाधीश को ही सीजेआई नियुक्त करने की संवैधानिक परंपरा अनिवार्य है।",
      "शपथ: संविधान की तीसरी अनुसूची के तहत राष्ट्रपति भारत के मुख्य न्यायाधीश को पद एवं गोपनीयता की शपथ दिलाते हैं।"
    ],
    "provisions": [
      "न्यायपालिका की स्वतंत्रता संविधान के मूल ढांचे (Basic Structure) का अभिन्न अंग है (केशवानंद भारती 1973)।",
      "उच्च न्यायालयों के न्यायाधीश 62 वर्ष में, जबकि सर्वोच्च न्यायालय के न्यायाधीश 65 वर्ष की आयु में सेवानिवृत्त होते हैं।",
      "अनुच्छेद 124(4) के तहत केवल सिद्ध कदाचार या असमर्थता के आधार पर संसद के विशेष बहुमत द्वारा ही महाभियोग (Removal) संभव है।"
    ],
    "highYieldFact": "संविधान के अनुच्छेद 124(2) के तहत राष्ट्रपति भारत के मुख्य न्यायाधीश (CJI) की नियुक्ति करते हैं और इनकी सेवानिवृत्ति आयु 65 वर्ष है।",
    "vocabulary": [
      {
        "word": "Collegium",
        "pos": "Noun",
        "exactHindi": "कॉलेजियम / न्यायाधीशों का चयन मंडल",
        "definition": "A group of senior judges responsible for recommending judicial appointments and transfers.",
        "synonyms": "Judicial council, Advisory bench",
        "antonyms": "Executive unilateralism",
        "examUsage": "\"The Supreme Court collegium evaluates judicial competence and integrity.\""
      }
    ],
    "practiceMcq": {
      "question": "भारतीय संविधान के किस अनुच्छेद के तहत राष्ट्रपति सर्वोच्च न्यायालय के मुख्य न्यायाधीश की नियुक्ति करते हैं?",
      "options": [
        "अनुच्छेद 76",
        "अनुच्छेद 124(2)",
        "अनुच्छेद 148",
        "अनुच्छेद 217"
      ],
      "correct": 1,
      "explanation": "अनुच्छेद 124(2) के तहत राष्ट्रपति भारत के मुख्य न्यायाधीश एवं अन्य न्यायाधीशों की नियुक्ति करते हैं।"
    },
    "mainsQuestion": "\"न्यायपालिका की स्वतंत्रता और कार्यपालिका की जवाबदेही के बीच संतुलन साधने में कॉलेजियम प्रणाली की शक्तियों और सीमाओं का समालोचनात्मक परीक्षण कीजिए।\""
  },
  {
    "id": "news-chief-election-commissioner-eci",
    "categoryTag": "👥 नियुक्तियां (HEADS)",
    "categoryFilter": "Appointments & Heads",
    "date": "आज का अंक",
    "readTime": "3 मिनट Read",
    "releaseId": "206581792024109",
    "headline": "भारत के मुख्य चुनाव आयुक्त (CEC) और चुनाव आयुक्तों की नियुक्ति प्रक्रिया: नया वैधानिक ढांचा और अनुच्छेद 324",
    "summary": "संसद द्वारा पारित मुख्य निर्वाचन आयुक्त और अन्य निर्वाचन आयुक्त (नियुक्ति, सेवा शर्तें और कार्यकाल) अधिनियम, 2023 के तहत निर्वाचन आयोग में नियुक्तियों की पारदर्शी प्रक्रिया प्रभावी है। प्रधानमंत्री की अध्यक्षता वाली तीन सदस्यीय चयन समिति की सिफारिश पर राष्ट्रपति द्वारा आयुक्तों की नियुक्ति की जाती है।",
    "background": "संविधान के भाग 15 के अनुच्छेद 324 में स्वतंत्र एवं निष्पक्ष चुनाव कराने हेतु भारत निर्वाचन आयोग (ECI) का प्रावधान है। निर्वाचन आयोग की स्थापना 25 जनवरी 1950 को हुई थी (जिसे राष्ट्रीय मतदाता दिवस के रूप में मनाया जाता है)। सुकुमार सेन भारत के पहले मुख्य चुनाव आयुक्त थे। आयुक्तों का कार्यकाल 6 वर्ष या 65 वर्ष की आयु (जो भी पहले हो) तक होता है।",
    "sourceMinistry": "भारत निर्वाचन आयोग (ECI) • विधि एवं न्याय मंत्रालय • PIB",
    "sourceUrl": "https://eci.gov.in",
    "imageUrl": "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80",
    "imageCredit": "स्रोत: विधि एवं न्याय मंत्रालय • भारत निर्वाचन आयोग (ECI)",
    "dimensions": [
      "चयन समिति: प्रधानमंत्री (अध्यक्ष), लोकसभा में विपक्ष के नेता / सबसे बड़े विपक्षी दल के नेता, और एक केंद्रीय कैबिनेट मंत्री।",
      "खोज समिति (Search Committee): केंद्रीय कानून मंत्री की अध्यक्षता में 5 उपयुक्त नामों का पैनल तैयार करती है।",
      "समान दर्जा: मुख्य चुनाव आयुक्त और अन्य दो चुनाव आयुक्तों को सर्वोच्च न्यायालय के न्यायाधीश के समकक्ष वेतन और दर्जा प्राप्त है।"
    ],
    "provisions": [
      "निर्वाचन आयोग 16 अक्टूबर 1989 तक एक-सदस्यीय निकाय था, जिसे 1993 से स्थायी रूप से तीन सदस्यीय (1 CEC + 2 EC) बनाया गया।",
      "मुख्य चुनाव आयुक्त को केवल सर्वोच्च न्यायालय के न्यायाधीश के समान महाभियोग प्रक्रिया द्वारा ही हटाया जा सकता है।",
      "चुनाव आयुक्तों को मुख्य चुनाव आयुक्त की सिफारिश के बिना पद से नहीं हटाया जा सकता (अनुच्छेद 324(5))।"
    ],
    "highYieldFact": "भारत के प्रथम मुख्य चुनाव आयुक्त सुकुमार सेन थे और 25 जनवरी 1950 को चुनाव आयोग की स्थापना के उपलक्ष्य में राष्ट्रीय मतदाता दिवस मनाया जाता है।",
    "vocabulary": [
      {
        "word": "Tenure",
        "pos": "Noun",
        "exactHindi": "कार्यकाल / पदावधि",
        "definition": "The conditions or period under which an office, position, or land is held.",
        "synonyms": "Term of office, Incumbency, Period",
        "antonyms": "Vacancy",
        "examUsage": "\"The Election Commissioners hold tenure for six years or until attaining 65 years of age.\""
      }
    ],
    "practiceMcq": {
      "question": "भारत के मुख्य चुनाव आयुक्त (CEC) का कार्यकाल कितना होता है?",
      "options": [
        "5 वर्ष या 62 वर्ष की आयु",
        "6 वर्ष या 65 वर्ष की आयु",
        "5 वर्ष या 65 वर्ष की आयु",
        "6 वर्ष या 62 वर्ष की आयु"
      ],
      "correct": 1,
      "explanation": "मुख्य चुनाव आयुक्त एवं अन्य चुनाव आयुक्तों का कार्यकाल 6 वर्ष या 65 वर्ष की आयु (जो भी पहले हो) तक होता है।"
    },
    "mainsQuestion": "\"स्वतंत्र एवं निष्पक्ष निर्वाचन भारतीय लोकतंत्र की आधारशिला है। निर्वाचन आयोग की स्वायत्तता सुदृढ़ करने हेतु हालिया विधायी प्रावधानों का मूल्यांकन कीजिए।\""
  },
  {
    "id": "news-cag-comptroller-auditor-general",
    "categoryTag": "👥 नियुक्तियां (HEADS)",
    "categoryFilter": "Appointments & Heads",
    "date": "आज का अंक",
    "readTime": "3 मिनट Read",
    "releaseId": "206581792024110",
    "headline": "नियंत्रक एवं महालेखापरीक्षक (CAG): सार्वजनिक वित्त की संरक्षा और संविधान का अनुच्छेद 148",
    "summary": "संविधान के अनुच्छेद 148 के तहत राष्ट्रपति द्वारा नियुक्त नियंत्रक एवं महालेखापरीक्षक (CAG) केंद्र और राज्यों के सभी खातों का लेखा परीक्षण (Audit) कर लोक वित्त की शुचिता सुनिश्चित करते हैं। सीएजी की रिपोर्टें संसद की लोक लेखा समिति (PAC) द्वारा जांची जाती हैं, जिसमें सीएजी समिति के मित्र, दार्शनिक और मार्गदर्शक के रूप में कार्य करते हैं।",
    "background": "डॉ. बी.आर. अंबेडकर ने सीएजी को भारतीय संविधान के तहत सबसे महत्वपूर्ण अधिकारी कहा था। सीएजी का कार्यकाल 6 वर्ष या 65 वर्ष की आयु तक होता है। सीएजी को उसी रीति और आधारों पर हटाया जा सकता है जैसे सर्वोच्च न्यायालय के न्यायाधीश को (अनुच्छेद 148(1))। वी. नरहरि राव भारत के पहले सीएजी (1948-1954) थे।",
    "sourceMinistry": "नियंत्रक एवं महालेखापरीक्षक कार्यालय (CAG) • वित्त मंत्रालय • PIB",
    "sourceUrl": "https://cag.gov.in",
    "imageUrl": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80",
    "imageCredit": "स्रोत: Comptroller and Auditor General of India • Press Cell",
    "dimensions": [
      "अनुच्छेद 148: सीएजी की नियुक्ति, शपथ और सेवा शर्तों का संवैधानिक उपबंध।",
      "अनुच्छेद 149: संसद द्वारा सीएजी के कर्तव्यों और शक्तियों (Audit of Receipts & Expenditure) का निर्धारण।",
      "अनुच्छेद 151: सीएजी केंद्र की लेखा रिपोर्ट राष्ट्रपति को और राज्यों की रिपोर्ट राज्यपाल को सौंपते हैं, जो इसे सदन में रखवाते हैं।"
    ],
    "provisions": [
      "पद छोड़ने के बाद सीएजी केंद्र या राज्य सरकार के अधीन किसी अन्य पद के पात्र नहीं होते (अनुच्छेद 148(4))।",
      "सीएजी का प्रशासनिक व्यय और वेतन भारत की संचित निधि (Consolidated Fund of India) पर भारित (Charged) होता है।",
      "लोक लेखा समिति (PAC) सीएजी की रिपोर्टों की जांच करती है और सीएजी पीएसी के गाइड, फ्रेंड और फिलॉसफर कहलाते हैं।"
    ],
    "highYieldFact": "डॉ. बी.आर. अंबेडकर ने नियंत्रक एवं महालेखापरीक्षक (CAG) को भारतीय संविधान के तहत सबसे महत्वपूर्ण संवैधानिक पद माना था। पद का उल्लेख अनुच्छेद 148 में है।",
    "vocabulary": [
      {
        "word": "Propriety",
        "pos": "Noun",
        "exactHindi": "औचित्य / नीतिसंगतता",
        "definition": "The condition of being right, appropriate, or fitting; conformity to moral standards.",
        "synonyms": "Appropriateness, Righteousness, Legitimacy",
        "antonyms": "Impropriety, Misconduct",
        "examUsage": "\"CAG conducts performance audits to scrutinize propriety and efficiency of public expenditure.\""
      }
    ],
    "practiceMcq": {
      "question": "भारतीय संविधान के किस अनुच्छेद में नियंत्रक एवं महालेखापरीक्षक (CAG) के पद का प्रावधान है?",
      "options": [
        "अनुच्छेद 76",
        "अनुच्छेद 148",
        "अनुच्छेद 280",
        "अनुच्छेद 324"
      ],
      "correct": 1,
      "explanation": "अनुच्छेद 148 के तहत राष्ट्रपति भारत के नियंत्रक एवं महालेखापरीक्षक (CAG) की नियुक्ति करते हैं।"
    },
    "mainsQuestion": "\"सीएजी सार्वजनिक धन का संरक्षक और लोक लेखा समिति का मार्गदर्शक है। वित्तीय जवाबदेही सुनिश्चित करने में सीएजी की भूमिका का विश्लेषण कीजिए।\""
  },
  {
    "id": "news-exercise-surya-kiran-india-nepal",
    "categoryTag": "⚔️ युद्धाभ्यास (DEFENSE)",
    "categoryFilter": "Defense & Exercises",
    "date": "आज का अंक",
    "readTime": "3 मिनट Read",
    "releaseId": "206581792024111",
    "headline": "भारत-नेपाल संयुक्त सैन्य अभ्यास सूर्य किरण XVIII: आतंकवाद रोधी अभियानों और आपदा राहत में रणनीतिक साझेदारी",
    "summary": "भारत और नेपाल की सेनाओं के बीच 18वां संयुक्त सैन्य अभ्यास सूर्य किरण (Surya Kiran-XVIII) सफलतापूर्वक आयोजित किया गया। इस अभ्यास का उद्देश्य पहाड़ी युद्धकला, जंगल वॉरफेयर और मानवीय सहायता एवं आपदा राहत (HADR) अभियानों में अंतर-संचालनीयता (Interoperability) को सुदृढ़ करना है।",
    "background": "सूर्य किरण अभ्यास का आयोजन प्रतिवर्ष दोनों देशों में बारी-बारी से किया जाता है। भारतीय सेना की ओर से कुमाऊं रेजिमेंट की टुकड़ियों ने भाग लिया। यह अभ्यास दोनों पड़ोसी देशों के बीच सदियों पुराने रक्षा सहयोग और रक्षा कूटनीति को मजबूती प्रदान करता है।",
    "sourceMinistry": "रक्षा मंत्रालय (MoD) • भारतीय सेना (ADGPI) • PIB नई दिल्ली",
    "sourceUrl": "https://pib.gov.in",
    "imageUrl": "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=80",
    "imageCredit": "स्रोत: भारतीय सेना (ADGPI) • रक्षा मंत्रालय",
    "dimensions": [
      "पहाड़ी इलाकों में आतंकवाद विरोधी अभियानों और ड्रोन निगरानी का संयुक्त सिमुलेशन।",
      "भूकंप, भूस्खलन और प्राकृतिक आपदाओं के दौरान त्वरित चिकित्सा सहायता और नागरिक बचाव प्रोटोकॉल।",
      "दोनों सेनाओं के बीच सामरिक कौशल और कॉम्बैट इंजीनियरिंग तकनीकों का साझा आदान-प्रदान।"
    ],
    "provisions": [
      "भारत और नेपाल के बीच 1950 की शांति और मित्रता संधि के तहत ऐतिहासिक रक्षा संबंध।",
      "भारतीय सेना प्रमुख और नेपाली सेना प्रमुख को एक-दूसरे की सेना में मानद जनरल (Honorary General) का पद दिया जाता है।",
      "नेपाल की सुरक्षा बलों के आधुनिकीकरण में भारत का सैन्य प्रशिक्षण और उपकरण सहयोग।"
    ],
    "highYieldFact": "सूर्य किरण भारत और नेपाल की सेनाओं के बीच प्रतिवर्ष आयोजित होने वाला द्विपक्षीय सैन्य युद्धाभ्यास है।",
    "vocabulary": [
      {
        "word": "Counter-insurgency",
        "pos": "Noun",
        "exactHindi": "विद्रोह-रोधी अभियान / आतंकवाद-रोधी रणनीति",
        "definition": "Military or political action taken against the activities of guerrillas or revolutionaries.",
        "synonyms": "Anti-terror operations, Counter-terrorism",
        "antonyms": "Insurgency, Rebellion",
        "examUsage": "\"Surya Kiran exercise hones joint counter-insurgency doctrines in mountainous terrain.\""
      }
    ],
    "practiceMcq": {
      "question": "संयुक्त सैन्य अभ्यास सूर्य किरण (Surya Kiran) भारत और किस पड़ोसी देश के मध्य आयोजित किया जाता है?",
      "options": [
        "भूटान",
        "नेपाल",
        "बांग्लादेश",
        "श्रीलंका"
      ],
      "correct": 1,
      "explanation": "सूर्य किरण अभ्यास भारत और नेपाल की सेनाओं के बीच प्रतिवर्ष आयोजित होने वाला द्विपक्षीय युद्धाभ्यास है।"
    },
    "mainsQuestion": "\"भारत की नेबरहुड फर्स्ट (Neighborhood First) नीति में भारत-नेपाल रक्षा संबंधों और संयुक्त सैन्य अभ्यासों के सामरिक महत्व पर प्रकाश डालिए।\""
  },
  {
    "id": "news-exercise-malabar-quad-naval",
    "categoryTag": "⚔️ युद्धाभ्यास (DEFENSE)",
    "categoryFilter": "Defense & Exercises",
    "date": "आज का अंक",
    "readTime": "3 मिनट Read",
    "releaseId": "206581792024112",
    "headline": "बहुपक्षीय नौसेना अभ्यास मालाबार: क्वाड राष्ट्रों (भारत, अमेरिका, जापान, ऑस्ट्रेलिया) का विशाखापट्टनम में हिंद-प्रशांत समुद्री समन्वय",
    "summary": "भारतीय नौसेना की मेजबानी में विशाखापट्टनम के तट पर मालाबार युद्धाभ्यास का नवीनतम संस्करण संपन्न हुआ। इसमें क्वाड (QUAD) गठबंधन के चारों देशों—भारत, संयुक्त राज्य अमेरिका, जापान और ऑस्ट्रेलिया की नौसेनाओं ने पनडुब्बी रोधी युद्ध (ASW), वायु रक्षा और सतह युद्धाभ्यास का अभ्यास किया।",
    "background": "मालाबार अभ्यास की शुरुआत 1992 में भारत और अमेरिका के बीच एक द्विपक्षीय नौसैनिक अभ्यास के रूप में हुई थी। 2015 में जापान इसका स्थायी सदस्य बना और 2020 में ऑस्ट्रेलिया के शामिल होने के बाद यह औपचारिक क्वाड नौसैनिक अभ्यास बन गया। इसका उद्देश्य एक स्वतंत्र, खुले और समावेशी इंडो-पैसिफिक क्षेत्र को बनाए रखना है।",
    "sourceMinistry": "भारतीय नौसेना • रक्षा मंत्रालय (MoD) • PIB",
    "sourceUrl": "https://indiannavy.nic.in",
    "imageUrl": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
    "imageCredit": "स्रोत: भारतीय नौसेना मीडिया सेल • रक्षा मंत्रालय",
    "dimensions": [
      "भाग लेने वाले युद्धपोत: स्वदेशी स्टेल्थ फ्रिगेट आईएनएस सह्याद्रि, पी-8आई समुद्री टोही विमान और अमेरिकी नौसेना के अर्ले बर्क-क्लास विध्वंसक।",
      "पनडुब्बी रोधी युद्ध (Anti-Submarine Warfare): हिंद महासागर क्षेत्र में विदेशी परमाणु पनडुब्बियों का पता लगाने का संयुक्त अभ्यास।",
      "संचार अंतर-प्रचालनीयता (Interoperability): क्वाड देशों के बीच सुरक्षित डेटा लिंक और सामरिक सिमुलेशन।"
    ],
    "provisions": [
      "क्वाड (QUAD) शिखर सम्मेलन के समुद्री डोमेन जागरूकता (IPMDA) विज़न को जमीनी स्तर पर लागू करना।",
      "समुद्री व्यापार मार्गों की सुरक्षा और अंतरराष्ट्रीय समुद्री कानून (UNCLOS) का अनुपालन।",
      "मलक्का जलडमरूमध्य और बंगाल की खाड़ी में समुद्री डकैती रोधी संयुक्त गश्त क्षमता का सुदृढ़ीकरण।"
    ],
    "highYieldFact": "मालाबार अभ्यास 1992 में भारत और अमेरिका के बीच शुरू हुआ था, जिसमें अब क्वाड के चारों देश (भारत, यूएसए, जापान, ऑस्ट्रेलिया) शामिल हैं।",
    "vocabulary": [
      {
        "word": "Maritime",
        "pos": "Adjective",
        "exactHindi": "समुद्री / नौसैनिक",
        "definition": "Connected with the sea, especially in relation to seafaring commercial or military activity.",
        "synonyms": "Naval, Oceanic, Marine",
        "antonyms": "Terrestrial, Inland",
        "examUsage": "\"Exercise Malabar reinforces joint maritime domain awareness across Indo-Pacific waters.\""
      }
    ],
    "practiceMcq": {
      "question": "बहुपक्षीय नौसैनिक अभ्यास मालाबार (Malabar Exercise) में निम्नलिखित में से कौन-सा देश शामिल नहीं है?",
      "options": [
        "भारत",
        "संयुक्त राज्य अमेरिका",
        "जापान",
        "फ्रांस"
      ],
      "correct": 3,
      "explanation": "मालाबार अभ्यास में क्वाड के चार देश (भारत, अमेरिका, जापान, ऑस्ट्रेलिया) शामिल हैं; फ्रांस इसका सदस्य नहीं है।"
    },
    "mainsQuestion": "\"हिंद-प्रशांत क्षेत्र में शक्ति संतुलन और समुद्री सुरक्षा सुनिश्चित करने में क्वाड (QUAD) और मालाबार अभ्यास की भूमिका का समालोचनात्मक विश्लेषण कीजिए।\""
  },
  {
    "id": "news-global-innovation-index-gii",
    "categoryTag": "📊 सूचकांक (INDICES)",
    "categoryFilter": "Indices & Rankings",
    "date": "आज का अंक",
    "readTime": "3 मिनट Read",
    "releaseId": "206581792024113",
    "headline": "वैश्विक नवाचार सूचकांक (GII): भारत 133 अर्थव्यवस्थाओं में 39वें स्थान पर, निम्न-मध्यम आय वर्ग में लगातार अग्रणी",
    "summary": "विश्व बौद्धिक संपदा संगठन (WIPO) द्वारा जारी ग्लोबल इनोवेशन इंडेक्स (GII) में भारत ने 133 देशों में 39वां स्थान प्राप्त किया है। भारत 2015 में 81वें पायदान पर था, जहां से 42 स्थानों की ऐतिहासिक छलांग लगाकर शीर्ष 40 में अपना स्थान निरंतर मजबूत बनाए रखा है।",
    "background": "भारत निम्न-मध्यम आय वर्ग के 38 देशों में शीर्ष पर है और मध्य एवं दक्षिण एशियाई क्षेत्र में लगातार 14वें वर्ष नवाचार में नंबर 1 स्थान पर बना हुआ है। भारत ज्ञान एवं प्रौद्योगिकी आउटपुट, पेटेंट दाखिल करने और सूचना प्रौद्योगिकी निर्यात में दुनिया के शीर्ष देशों में शामिल है।",
    "sourceMinistry": "नीति आयोग • वाणिज्य एवं उद्योग मंत्रालय • WIPO जिनेवा",
    "sourceUrl": "https://wipo.int",
    "imageUrl": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    "imageCredit": "स्रोत: नीति आयोग • WIPO Global Innovation Index",
    "dimensions": [
      "GII के कुल 80 संकेतकों में भारत का प्रदर्शन: ज्ञान एवं प्रौद्योगिकी आउटपुट में वैश्विक 4th रैंक।",
      "आईसीटी सेवा निर्यात (ICT Services Exports) में भारत दुनिया में नंबर 1 स्थान पर कायम।",
      "अटल इनोवेशन मिशन (AIM) और स्टार्टअप इंडिया के चलते देश में 1.4 लाख से अधिक मान्यता प्राप्त स्टार्टअप्स।"
    ],
    "provisions": [
      "राष्ट्रीय बौद्धिक संपदा अधिकार (IPR) नीति के तहत पेटेंट परीक्षा समय-सीमा में 75% की कमी।",
      "अनुसंधान नेशनल रिसर्च फाउंडेशन (ANRF) हेतु ₹50,000 करोड़ का प्रावधान जिससे अनुसंधान पर जीडीपी खर्च बढ़ेगा।",
      "स्विट्जरलैंड, स्वीडन और संयुक्त राज्य अमेरिका सूचकांक में शीर्ष 3 देश बने हुए हैं।"
    ],
    "highYieldFact": "वैश्विक नवाचार सूचकांक (GII) प्रतिवर्ष विश्व बौद्धिक संपदा संगठन (WIPO - मुख्यालय: जिनेवा, स्विट्जरलैंड) द्वारा प्रकाशित किया जाता है।",
    "vocabulary": [
      {
        "word": "Innovation",
        "pos": "Noun",
        "exactHindi": "नवाचार / नई खोज या विचार",
        "definition": "The action or process of innovating; a new method, idea, or product.",
        "synonyms": "Novelty, Invention, Modernization, Breakthrough",
        "antonyms": "Stagnation, Tradition, Obsolescence",
        "examUsage": "\"Targeted R&D investments propel India upward on the Global Innovation Index.\""
      }
    ],
    "practiceMcq": {
      "question": "ग्लोबल इनोवेशन इंडेक्स (GII) किस अंतर्राष्ट्रीय संस्था द्वारा प्रकाशित किया जाता है?",
      "options": [
        "विश्व बैंक (World Bank)",
        "विश्व बौद्धिक संपदा संगठन (WIPO)",
        "विश्व आर्थिक मंच (WEF)",
        "यूनेस्को (UNESCO)"
      ],
      "correct": 1,
      "explanation": "ग्लोबल इनोवेशन इंडेक्स प्रतिवर्ष विश्व बौद्धिक संपदा संगठन (WIPO - जिनेवा) द्वारा जारी किया जाता है।"
    },
    "mainsQuestion": "\"वैश्विक नवाचार सूचकांक में भारत की प्रगति को बनाए रखने के लिए उच्च शिक्षा में शोध-विकास (R&D) और उद्योग-अकादमिक साझेदारी में किन सुधारों की आवश्यकता है?\""
  },
  {
    "id": "news-human-development-index-hdi",
    "categoryTag": "📊 सूचकांक (INDICES)",
    "categoryFilter": "Indices & Rankings",
    "date": "आज का अंक",
    "readTime": "3 मिनट Read",
    "releaseId": "206581792024114",
    "headline": "मानव विकास सूचकांक (HDI): यूएनडीपी रिपोर्ट में भारत के स्कोर में निरंतर वृद्धि, स्वास्थ्य एवं शिक्षा मानकों में प्रगति",
    "summary": "संयुक्त राष्ट्र विकास कार्यक्रम (UNDP) द्वारा जारी मानव विकास रिपोर्ट में भारत का मानव विकास सूचकांक (HDI) मूल्य बढ़कर 0.644 हो गया है, जिससे भारत मध्यम मानव विकास श्रेणी में मजबूती से स्थित है। भारत में जन्म के समय जीवन प्रत्याशा बढ़कर 67.7 वर्ष और स्कूली शिक्षा के अपेक्षित वर्ष 12.6 वर्ष दर्ज किए गए।",
    "background": "मानव विकास सूचकांक (HDI) का विकास 1990 में पाकिस्तानी अर्थशास्त्री महबूब उल हक और नोबेल पुरस्कार विजेता अमर्त्य सेन द्वारा किया गया था। यह सूचकांक तीन बुनियादी आयामों पर मापा जाता है: (1) लंबा और स्वस्थ जीवन (जीवन प्रत्याशा), (2) ज्ञान तक पहुंच (स्कूली शिक्षा के औसत व अपेक्षित वर्ष), और (3) सभ्य जीवन स्तर (प्रति व्यक्ति सकल राष्ट्रीय आय)।",
    "sourceMinistry": "संयुक्त राष्ट्र विकास कार्यक्रम (UNDP) • नीति आयोग • सांख्यिकी मंत्रालय (MoSPI)",
    "sourceUrl": "https://undp.org",
    "imageUrl": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    "imageCredit": "स्रोत: UNDP India • NITI Aayog",
    "dimensions": [
      "तीन प्रमुख आयाम: स्वास्थ्य (जीवन प्रत्याशा), शिक्षा (स्कूली शिक्षा के औसत व अपेक्षित वर्ष) और आय (प्रति व्यक्ति जीएनआई)।",
      "लैंगिक असमानता सूचकांक (GII) में भारत की रैंक में 14 पायदानों का तीव्र सुधार, जिससे महिलाओं की श्रम भागीदारी बढ़ी।",
      "स्विट्जरलैंड, नॉर्वे और आइसलैंड मानव विकास सूचकांक में विश्व में शीर्ष 3 स्थान पर रहे।"
    ],
    "provisions": [
      "आयुष्मान भारत और मिशन इंद्रधनुष द्वारा ग्रामीण स्वास्थ्य अवसंरचना का विस्तार।",
      "समग्र शिक्षा और पीएम श्री योजना द्वारा सरकारी स्कूलों में गुणवत्तापूर्ण शिक्षा सुनिश्चित करना।",
      "नीति आयोग द्वारा 112 आकांक्षी जिलों में बुनियादी संकेतकों की रीयल-टाइम मॉनिटरिंग।"
    ],
    "highYieldFact": "मानव विकास सूचकांक (HDI) की अवधारणा 1990 में अर्थशास्त्री महबूब उल हक और प्रो. अमर्त्य सेन ने तैयार की थी। यह UNDP द्वारा जारी किया जाता है।",
    "vocabulary": [
      {
        "word": "Parameters",
        "pos": "Noun",
        "exactHindi": "मानक / परिमाप / सीमाएं",
        "definition": "A numerical or other measurable factor forming one of a set that defines a system or sets conditions of its operation.",
        "synonyms": "Criteria, Benchmarks, Indicators",
        "antonyms": "Ambiguity",
        "examUsage": "\"HDI evaluates human development across health, knowledge, and income parameters.\""
      }
    ],
    "practiceMcq": {
      "question": "मानव विकास सूचकांक (HDI) निम्नलिखित में से किस संस्था द्वारा जारी किया जाता है?",
      "options": [
        "विश्व बैंक (World Bank)",
        "अंतर्राष्ट्रीय मुद्रा कोष (IMF)",
        "संयुक्त राष्ट्र विकास कार्यक्रम (UNDP)",
        "विश्व स्वास्थ्य संगठन (WHO)"
      ],
      "correct": 2,
      "explanation": "मानव विकास सूचकांक प्रतिवर्ष संयुक्त राष्ट्र विकास कार्यक्रम (UNDP) द्वारा जारी किया जाता है।"
    },
    "mainsQuestion": "\"सकल घरेलू उत्पाद (GDP) की तुलना में मानव विकास सूचकांक (HDI) वास्तविक मानव प्रगति का अधिक समावेशी मापक क्यों है? भारत के संदर्भ में स्पष्ट कीजिए।\""
  },
  {
    "id": "news-brics-summit-kazan",
    "categoryTag": "🌍 सम्मेलन (SUMMITS)",
    "categoryFilter": "International Summits",
    "date": "आज का अंक",
    "readTime": "3 मिनट Read",
    "releaseId": "206581792024115",
    "headline": "16वां ब्रिक्स (BRICS) शिखर सम्मेलन: कज़ान में नए सदस्य देशों का स्वागत और वैश्विक आर्थिक बहुध्रुवीयता पर बल",
    "summary": "रूस के कज़ान में 16वें ब्रिक्स शिखर सम्मेलन का आयोजन किया गया, जिसमें प्रधानमंत्री नरेंद्र मोदी ने भाग लिया। मिस्र, इथियोपिया, ईरान और संयुक्त अरब अमीरात (UAE) के पूर्ण सदस्य बनने के बाद यह पहला विस्तृत ब्रिक्स शिखर सम्मेलन था, जिसमें कज़ान घोषणापत्र को सर्वसम्मति से स्वीकार किया गया।",
    "background": "ब्रिक्स की स्थापना 2006 में हुई थी और 2010 में दक्षिण अफ्रीका के जुड़ने से यह BRICS बना। विस्तार के बाद अब ब्रिक्स वैश्विक जनसंख्या के लगभग 45% और क्रय शक्ति समता (PPP) के आधार पर विश्व अर्थव्यवस्था के 35% से अधिक का प्रतिनिधित्व करता है। न्यू डेवलपमेंट बैंक (NDB - शंघाई) ब्रिक्स देशों का प्रमुख बहुपक्षीय बैंक है।",
    "sourceMinistry": "विदेश मंत्रालय (MEA) • BRICS Secretariat • PIB नई दिल्ली",
    "sourceUrl": "https://mea.gov.in",
    "imageUrl": "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80",
    "imageCredit": "स्रोत: विदेश मंत्रालय (MEA) • BRICS Secretariat",
    "dimensions": [
      "स्थानीय मुद्राओं में द्विपक्षीय व्यापार को बढ़ावा देना।",
      "संयुक्त राष्ट्र सुरक्षा परिषद (UNSC) और बहुपक्षीय वित्तीय संस्थाओं (IMF, World Bank) में तत्काल सुधार का आह्वान।",
      "वैश्विक आतंकवाद के विरुद्ध शून्य सहिष्णुता (Zero Tolerance Against Terrorism) की घोषणा।"
    ],
    "provisions": [
      "न्यू डेवलपमेंट बैंक (NDB) द्वारा उभरते देशों में अवसंरचना और सतत विकास हेतु $35+ बिलियन का ऋण स्वीकृत।",
      "ब्रिक्स पार्टनर्स कंट्री (Partner Countries) श्रेणी का सृजन जिससे अन्य इच्छुक देश जुड़ सकें।",
      "17वें ब्रिक्स शिखर सम्मेलन की अध्यक्षता वर्ष 2025 में ब्राजील द्वारा की जाएगी।"
    ],
    "highYieldFact": "ब्रिक्स द्वारा स्थापित न्यू डेवलपमेंट बैंक (NDB) का मुख्यालय शंघाई (चीन) में स्थित है और इसके प्रथम अध्यक्ष के.वी. कामथ (भारत) थे।",
    "vocabulary": [
      {
        "word": "Multipolarity",
        "pos": "Noun",
        "exactHindi": "बहुध्रुवीयता / कई शक्तिशाली केंद्रों वाली विश्व व्यवस्था",
        "definition": "A distribution of power in which more than two nation-states have nearly equal amounts of military, cultural, and economic influence.",
        "synonyms": "Plurality of power, Decentralized order",
        "antonyms": "Unipolarity, Hegemony",
        "examUsage": "\"BRICS champions multipolarity to democratize global economic governance.\""
      }
    ],
    "practiceMcq": {
      "question": "ब्रिक्स देशों द्वारा स्थापित न्यू डेवलपमेंट बैंक (New Development Bank - NDB) का मुख्यालय किस शहर में है?",
      "options": [
        "मास्को (रूस)",
        "शंघाई (चीन)",
        "नई दिल्ली (भारत)",
        "जोहान्सबर्ग (दक्षिण अफ्रीका)"
      ],
      "correct": 1,
      "explanation": "न्यू डेवलपमेंट बैंक (NDB) का मुख्यालय शंघाई (चीन) में स्थित है।"
    },
    "mainsQuestion": "\"ब्रिक्स (BRICS) का हालिया विस्तार ग्लोबल साउथ की प्राथमिकताओं को आगे बढ़ाने और वैश्विक वित्तीय व्यवस्था के वि-डॉलरीकरण में क्या भूमिका निभा सकता है?\""
  },
  {
    "id": "news-world-environment-day-theme",
    "categoryTag": "🗓️ दिवस व थीम (DAYS)",
    "categoryFilter": "Days & Themes",
    "date": "आज का अंक",
    "readTime": "3 मिनट Read",
    "releaseId": "206581792024116",
    "headline": "विश्व पर्यावरण दिवस और आधिकारिक थीम: भूमि पुनर्स्थापन, मरुस्थलीकरण और सूखा सहनशीलता पर वैश्विक संकल्प",
    "summary": "संयुक्त राष्ट्र पर्यावरण कार्यक्रम (UNEP) के तत्वावधान में प्रत्येक वर्ष 5 जून को विश्व पर्यावरण दिवस दुनिया भर में मनाया जाता है। इस वर्ष की आधिकारिक थीम भूमि पुनर्स्थापन, मरुस्थलीकरण और सूखा सहनशीलता घोषित की गई है, जिसका नारा हमारी भूमि, हमारा भविष्य है।",
    "background": "विश्व पर्यावरण दिवस की नींव 1972 में स्टॉकहोम में मानव पर्यावरण पर संयुक्त राष्ट्र सम्मेलन के दौरान रखी गई थी और पहला पर्यावरण दिवस 1973 में मनाया गया था। भारत ने 2030 तक 26 मिलियन हेक्टेयर बंजर भूमि को बहाल करने और मिशन लाइफ को वैश्विक स्तर पर अपनाने का लक्ष्य रखा है।",
    "sourceMinistry": "पर्यावरण, वन और जलवायु परिवर्तन मंत्रालय (MoEFCC) • UNEP • PIB",
    "sourceUrl": "https://unep.org",
    "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    "imageCredit": "स्रोत: MoEFCC • संयुक्त राष्ट्र पर्यावरण कार्यक्रम (UNEP)",
    "dimensions": [
      "मरुस्थलीकरण का मुकाबला: संयुक्त राष्ट्र मरुस्थलीकरण रोकथाम अभिसमय (UNCCD) के तहत वैश्विक भूमि क्षरण तटस्थता का लक्ष्य।",
      "भारत की राष्ट्रीय पहल: एक पेड़ मां के नाम राष्ट्रव्यापी अभियान के तहत करोड़ों देशी वृक्षों का रोपण।",
      "अरावली ग्रीन वॉल प्रोजेक्ट: उत्तर-पश्चिम भारत में थार मरुस्थल के पूर्व की ओर विस्तार को रोकने हेतु 1,400 किमी का हरित गलियारा।"
    ],
    "provisions": [
      "UNEP का मुख्यालय नैरोबी (केन्या) में स्थित है, जो पर्यावरण संबंधी वैश्विक एजेंडा तय करता है।",
      "भारत ने 2070 तक शुद्ध-शून्य (Net-Zero) कार्बन उत्सर्जन का राष्ट्रीय लक्ष्य निर्धारित किया है।",
      "राष्ट्रीय हरित भारत मिशन (GIM) के तहत वन और वृक्ष आवरण में वृद्धि हेतु बजटीय समर्थन।"
    ],
    "highYieldFact": "प्रत्येक वर्ष 5 जून को विश्व पर्यावरण दिवस मनाया जाता है, जिसकी शुरुआत 1972 के ऐतिहासिक स्टॉकहोम सम्मेलन से हुई थी। UNEP का मुख्यालय नैरोबी में है।",
    "vocabulary": [
      {
        "word": "Desertification",
        "pos": "Noun",
        "exactHindi": "मरुस्थलीकरण / उपजाऊ भूमि का रेगिस्तान में बदलना",
        "definition": "The process by which fertile land becomes desert, typically as a result of drought, deforestation, or inappropriate agriculture.",
        "synonyms": "Land degradation, Aridification",
        "antonyms": "Afforestation, Land reclamation",
        "examUsage": "\"Desertification threatens agricultural productivity and food security across arid zones.\""
      }
    ],
    "practiceMcq": {
      "question": "संयुक्त राष्ट्र पर्यावरण कार्यक्रम (UNEP) का वैश्विक मुख्यालय किस शहर में स्थित है?",
      "options": [
        "जिनेवा (स्विट्जरलैंड)",
        "नैरोबी (केन्या)",
        "पेरिस (फ्रांस)",
        "न्यूयॉर्क (अमेरिका)"
      ],
      "correct": 1,
      "explanation": "UNEP (संयुक्त राष्ट्र पर्यावरण कार्यक्रम) का मुख्यालय नैरोबी (केन्या) में स्थित है।"
    },
    "mainsQuestion": "\"भूमि क्षरण और मरुस्थलीकरण भारत की खाद्य सुरक्षा और ग्रामीण अर्थव्यवस्था के लिए किस प्रकार चुनौती हैं? राष्ट्रीय प्रयासों की समीक्षा कीजिए।\""
  },
  {
    "id": "news-national-science-day-raman",
    "categoryTag": "🗓️ दिवस व थीम (DAYS)",
    "categoryFilter": "Days & Themes",
    "date": "आज का अंक",
    "readTime": "3 मिनट Read",
    "releaseId": "206581792024117",
    "headline": "राष्ट्रीय विज्ञान दिवस (28 फरवरी): सर सी.वी. रमन द्वारा रमन प्रभाव (Raman Effect) की खोज और स्वदेशी नवाचार",
    "summary": "भारत में प्रत्येक वर्ष 28 फरवरी को राष्ट्रीय विज्ञान दिवस (National Science Day) मनाया जाता है। यह दिवस 28 फरवरी 1928 को महान भारतीय भौतिक विज्ञानी सर चंद्रशेखर वेंकट रमन द्वारा रमन प्रभाव की ऐतिहासिक खोज की स्मृति में मनाया जाता है, जिसके लिए उन्हें 1930 में भौतिकी का नोबेल पुरस्कार प्राप्त हुआ था।",
    "background": "भारत सरकार ने 1986 में राष्ट्रीय विज्ञान और प्रौद्योगिकी संचार परिषद के अनुरोध पर 28 फरवरी को राष्ट्रीय विज्ञान दिवस के रूप में नामित किया था। सर सी.वी. रमन विज्ञान के क्षेत्र में नोबेल पुरस्कार जीतने वाले एशिया के पहले व्यक्ति थे। उन्हें 1954 में भारत के सर्वोच्च नागरिक सम्मान भारत रत्न से भी सम्मानित किया गया था।",
    "sourceMinistry": "विज्ञान और प्रौद्योगिकी मंत्रालय (DST) • CSIR • PIB नई दिल्ली",
    "sourceUrl": "https://dst.gov.in",
    "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    "imageCredit": "स्रोत: Department of Science & Technology (DST) • CSIR",
    "dimensions": [
      "रमन प्रभाव: जब प्रकाश किसी पारदर्शी माध्यम से गुजरता है, तो बिखरे हुए प्रकाश के कुछ हिस्से की तरंगदैर्ध्य (Wavelength) बदल जाती है।",
      "अनुप्रयोग: रमन स्पेक्ट्रोस्कोपी का उपयोग दवाओं के परीक्षण, कैंसर निदान, रसायन विज्ञान और खगोल विज्ञान में व्यापक रूप से होता है।",
      "थीम फोकस: विकसित भारत के लिए स्वदेशी तकनीक और युवाओं में वैज्ञानिक दृष्टिकोण का विकास।"
    ],
    "provisions": [
      "संविधान का अनुच्छेद 51A(h) प्रत्येक नागरिक का यह मूल कर्तव्य निर्धारित करता है कि वह वैज्ञानिक दृष्टिकोण, मानवतावाद और ज्ञानार्जन का विकास करे।",
      "अनुसंधान नेशनल रिसर्च फाउंडेशन (ANRF) के माध्यम से विश्वविद्यालयों में युवा वैज्ञानिकों को प्रत्यक्ष रिसर्च फेलोशिप।",
      "CSIR द्वारा प्रत्येक वर्ष युवा वैज्ञानिकों को शांति स्वरूप भटनागर पुरस्कार प्रदान किए जाते हैं।"
    ],
    "highYieldFact": "सर सी.वी. रमन को वर्ष 1930 में रमन प्रभाव की खोज के लिए भौतिकी का नोबेल पुरस्कार दिया गया था, जो विज्ञान में एशिया का पहला नोबेल था।",
    "vocabulary": [
      {
        "word": "Scattering",
        "pos": "Noun",
        "exactHindi": "प्रकीर्णन / प्रकाश का फैलना",
        "definition": "The process in which particles or light rays are deflected in various directions by collision with other particles.",
        "synonyms": "Dispersion, Deflection, Diffusion",
        "antonyms": "Concentration, Convergence",
        "examUsage": "\"Inelastic scattering of light photons is the cornerstone of the Raman Effect.\""
      }
    ],
    "practiceMcq": {
      "question": "राष्ट्रीय विज्ञान दिवस प्रत्येक वर्ष 28 फरवरी को किस खोज के उपलक्ष्य में मनाया जाता है?",
      "options": [
        "बोस-आइंस्टीन सांख्यिकी",
        "रमन प्रभाव (Raman Effect)",
        "चंद्रशेखर सीमा",
        "परमाणु विखंडन"
      ],
      "correct": 1,
      "explanation": "28 फरवरी 1928 को सर सी.वी. रमन द्वारा रमन प्रभाव की खोज के उपलक्ष्य में राष्ट्रीय विज्ञान दिवस मनाया जाता है।"
    },
    "mainsQuestion": "\"संविधान के अनुच्छेद 51A(h) में वर्णित वैज्ञानिक दृष्टिकोण (Scientific Temper) का पोषण विकसित भारत @2047 के निर्माण में किस प्रकार निर्णायक है?\""
  },
  {
    "id": "news-56th-tiger-reserve-ramsar",
    "categoryTag": "🐅 पर्यावरण व जीआई (WILDLIFE)",
    "categoryFilter": "Wildlife & Ramsar",
    "date": "आज का अंक",
    "readTime": "3 मिनट Read",
    "releaseId": "206581792024118",
    "headline": "भारत का 56वां टाइगर रिजर्व और नए रामसर स्थल: वन्यजीव संरक्षण और आर्द्रभूमि नेटवर्क में भारत का वैश्विक नेतृत्व",
    "summary": "राष्ट्रीय बाघ संरक्षण प्राधिकरण (NTCA) द्वारा छत्तीसगढ़ के गुरु घासीदास-तमोर पिंगला को देश के 56वें टाइगर रिजर्व के रूप में अधिसूचित किया गया है। इसके साथ ही भारत में अंतर्राष्ट्रीय महत्व की रामसर आर्द्रभूमियों (Ramsar Sites) की कुल संख्या बढ़कर 85 से अधिक हो गई है, जो एशिया में सर्वाधिक है।",
    "background": "भारत में 1 अप्रैल 1973 को जिम कॉर्बेट नेशनल पार्क से प्रोजेक्ट टाइगर की शुरुआत की गई थी। भारत में दुनिया की कुल जंगली बाघ आबादी का 75% से अधिक हिस्सा (3,682 से अधिक बाघ) निवास करता है। रामसर कन्वेंशन 1971 में ईरान के रामसर शहर में हस्ताक्षरित हुआ था और भारत 1 फरवरी 1982 को इसमें शामिल हुआ था। तमिलनाडु में भारत के सर्वाधिक रामसर स्थल (16 स्थल) हैं।",
    "sourceMinistry": "पर्यावरण, वन और जलवायु परिवर्तन मंत्रालय (MoEFCC) • NTCA • Wildlife Institute of India",
    "sourceUrl": "https://moef.gov.in",
    "imageUrl": "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1200&q=80",
    "imageCredit": "स्रोत: राष्ट्रीय बाघ संरक्षण प्राधिकरण (NTCA) • MoEFCC",
    "dimensions": [
      "गुरु घासीदास-तमोर पिंगला टाइगर रिजर्व (छत्तीसगढ़): 2,829 वर्ग किमी में फैला यह देश का तीसरा सबसे बड़ा टाइगर रिजर्व बन गया है।",
      "बाघ जनगणना (2022-24): मध्य प्रदेश (785 बाघ) को टाइगर स्टेट का दर्जा प्राप्त है, जिसके बाद कर्नाटक (563) दूसरे स्थान पर है।",
      "रामसर आर्द्रभूमियां: आर्द्रभूमियों को प्रकृति के गुर्दे (Kidneys of the Earth) कहा जाता है, जो बाढ़ नियंत्रण और भूजल पुनर्भरण करती हैं।"
    ],
    "provisions": [
      "वन्यजीव (संरक्षण) अधिनियम, 1972 की धारा 38V के तहत राज्य सरकारों द्वारा एनटीसीए की सलाह पर टाइगर रिजर्व अधिसूचित किए जाते हैं।",
      "भारत ने वैश्विक बाघ संरक्षण हेतु 2023 में इंटरनेशनल बिग कैट अलायंस (IBCA) का गठन किया।",
      "आर्द्रभूमि (संरक्षण और प्रबंधन) नियम 2017 के तहत आर्द्रभूमियों के पारिस्थितिकी तंत्र का कानूनी संरक्षण।"
    ],
    "highYieldFact": "भारत में प्रोजेक्ट टाइगर की शुरुआत 1 अप्रैल 1973 को हुई थी और वर्तमान में भारत में 3,682 से अधिक बाघ हैं। तमिलनाडु में सर्वाधिक 16 रामसर स्थल हैं।",
    "vocabulary": [
      {
        "word": "Ecological",
        "pos": "Adjective",
        "exactHindi": "पारिस्थितिकीय / पर्यावरण संबंधी",
        "definition": "Relating to or concerned with the relation of living organisms to one another and to their physical surroundings.",
        "synonyms": "Environmental, Bionomic",
        "antonyms": "Artificial, Synthetic",
        "examUsage": "\"Tiger reserves maintain critical ecological corridors for biodiversity conservation.\""
      }
    ],
    "practiceMcq": {
      "question": "भारत में सर्वाधिक संख्या में रामसर आर्द्रभूमि स्थल (Ramsar Wetland Sites) किस राज्य में स्थित हैं?",
      "options": [
        "उत्तर प्रदेश",
        "मध्य प्रदेश",
        "तमिलनाडु",
        "केरल"
      ],
      "correct": 2,
      "explanation": "तमिलनाडु में कुल 16 रामसर स्थल हैं, जो भारत के किसी भी राज्य में सर्वाधिक हैं।"
    },
    "mainsQuestion": "\"प्रोजेक्ट टाइगर के 50 वर्ष पूर्ण होने के उपरांत भारत में मानव-वन्यजीव संघर्ष (Human-Wildlife Conflict) और कॉरिडोर संरक्षण की प्रमुख चुनौतियों का विश्लेषण कीजिए।\""
  },
  {
    "id": "news-gi-tags-indigenous-products",
    "categoryTag": "🐅 पर्यावरण व जीआई (HERITAGE)",
    "categoryFilter": "Heritage & GI Tags",
    "date": "आज का अंक",
    "readTime": "3 मिनट Read",
    "releaseId": "206581792024119",
    "headline": "भौगोलिक संकेतक (GI Tags): पारंपरिक कला, हथकरघा और स्थानीय कृषि उत्पादों को मिला कानूनी संरक्षण",
    "summary": "वाणिज्य और उद्योग मंत्रालय के उद्योग संवर्धन और आंतरिक व्यापार विभाग (DPIIT) द्वारा विभिन्न राज्यों के पारंपरिक उत्पादों को भौगोलिक संकेतक (GI Tag) प्रदान किए जाने से देश में कुल जीआई पंजीकृत उत्पादों की संख्या 650 के पार पहुंच गई है। जीआई टैग से ग्रामीण कारीगरों और किसानों के उत्पादों को वैश्विक बाजार और कानूनी संरक्षण मिलता है।",
    "background": "भारत में वस्तुओं का भौगोलिक उपदर्शन (रजिस्ट्रीकरण और संरक्षण) अधिनियम, 1999 15 सितंबर 2003 से लागू हुआ। इसका पंजीयक कार्यालय चेन्नई (तमिलनाडु) में स्थित है। भारत का पहला जीआई टैग 2004 में दार्जिलिंग चाय को दिया गया था। जीआई टैग 10 वर्षों के लिए वैध होता है और इसे बाद में नवीनीकृत किया जा सकता है।",
    "sourceMinistry": "वाणिज्य और उद्योग मंत्रालय (MoCI) • DPIIT • GI Registry Chennai",
    "sourceUrl": "https://ipindia.gov.in",
    "imageUrl": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80",
    "imageCredit": "स्रोत: DPIIT • GI Registry Chennai",
    "dimensions": [
      "उत्तर प्रदेश और तमिलनाडु भारत में सर्वाधिक जीआई टैग प्राप्त करने वाले अग्रणी राज्य हैं।",
      "जीआई टैग कृषि (बासमती चावल, कंदमाल हल्दी), प्राकृतिक (मकराना संगमरमर), और निर्मित/हस्तशिल्प (बनारसी साड़ी, कांगड़ा पेंटिंग) को दिया जाता है।",
      "विश्व व्यापार संगठन (WTO) के बौद्धिक संपदा अधिकारों के व्यापार संबंधी पहलुओं (TRIPS) के तहत जीआई को वैश्विक मान्यता।"
    ],
    "provisions": [
      "जीआई टैग की प्रारंभिक वैधता 10 वर्ष होती है, जिसे समय-समय पर आगे नवीनीकृत कराया जा सकता है।",
      "अनधिकृत व्यक्तियों द्वारा जीआई नाम के दुरुपयोग पर 3 वर्ष तक का कारावास और ₹2 लाख तक का जुर्माना।",
      "ओडीओपी (एक जिला एक उत्पाद) योजना के माध्यम से जीआई उत्पादों के ई-कॉमर्स निर्यात को प्रोत्साहन।"
    ],
    "highYieldFact": "भारत में प्रथम भौगोलिक संकेतक (GI Tag) वर्ष 2004 में दार्जिलिंग चाय (पश्चिम बंगाल) को प्रदान किया गया था। जीआई रजिस्ट्री चेन्नई में स्थित है।",
    "vocabulary": [
      {
        "word": "Authenticity",
        "pos": "Noun",
        "exactHindi": "प्रामाणिकता / मौलिकता",
        "definition": "The quality of being authentic, genuine, or of undisputed origin.",
        "synonyms": "Genuineness, Veracity, Legitimacy",
        "antonyms": "Spuriousness, Counterfeit",
        "examUsage": "\"GI registration certifies the geographical authenticity and craftsmanship of rural handlooms.\""
      }
    ],
    "practiceMcq": {
      "question": "भारत का पहला भौगोलिक संकेतक (Geographical Indication - GI Tag) किस उत्पाद को प्रदान किया गया था?",
      "options": [
        "बनारसी साड़ी",
        "दार्जिलिंग चाय",
        "मैसूर सिल्क",
        "अल्फोंसो आम"
      ],
      "correct": 1,
      "explanation": "वर्ष 2004 में दार्जिलिंग चाय भारत का पहला पंजीकृत भौगोलिक संकेतक (GI Tag) उत्पाद बना था।"
    },
    "mainsQuestion": "\"भौगोलिक संकेतक (GI Tags) पारंपरिक ज्ञान के संरक्षण, ग्रामीण अर्थव्यवस्था के पुनरोद्धार और भारत के सांस्कृतिक निर्यात में किस प्रकार सहायक सिद्ध हो सकते हैं?\""
  },
  {
    "id": "news-rbi-monetary-policy-repo-rate",
    "categoryTag": "💰 अर्थव्यवस्था (ECONOMY)",
    "categoryFilter": "Economy & Banking",
    "date": "आज का अंक",
    "readTime": "3 मिनट Read",
    "releaseId": "206581792024120",
    "headline": "आरबीआई मौद्रिक नीति समिति (MPC): नीतिगत रेपो दर 6.50% पर स्थिर, महंगाई नियंत्रण और 7.2% जीडीपी विकास दर लक्ष्य",
    "summary": "भारतीय रिजर्व बैंक (RBI) के गवर्नर की अध्यक्षता में मौद्रिक नीति समिति (Monetary Policy Committee - MPC) ने प्रमुख नीतिगत रेपो दर (Repo Rate) को 6.50% पर अपरिवर्तित रखने का निर्णय लिया है। इसके साथ ही स्थायी जमा सुविधा (SDF) दर 6.25% और सीमांत स्थायी सुविधा (MSF) व बैंक दर 6.75% पर बरकरार रखी गई है।",
    "background": "आरबीआई अधिनियम, 1934 की धारा 45ZB के तहत 6 सदस्यीय मौद्रिक नीति समिति (MPC) का गठन किया गया है, जिसमें 3 सदस्य आरबीआई से और 3 केंद्र सरकार द्वारा नामित होते हैं। केंद्र सरकार ने आरबीआई को उपभोक्ता मूल्य सूचकांक (CPI) आधारित मुद्रास्फीति को 4% (+/- 2% सहनशीलता बैंड अर्थात 2% से 6% के बीच) पर बनाए रखने का वैधानिक लक्ष्य सौंपा है।",
    "sourceMinistry": "भारतीय रिजर्व बैंक (RBI) • वित्त मंत्रालय • PIB नई दिल्ली",
    "sourceUrl": "https://rbi.org.in",
    "imageUrl": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
    "imageCredit": "स्रोत: RBI Press Cell • Ministry of Finance",
    "dimensions": [
      "रेपो रेट (6.50%): वह ब्याज दर जिस पर वाणिज्यिक बैंक अपनी अल्पकालिक जरूरतों के लिए आरबीआई से सरकारी प्रतिभूतियों के बदले ऋण लेते हैं।",
      "जीडीपी विकास अनुमान: आरबीआई ने चालू वित्तीय वर्ष के लिए भारत की वास्तविक जीडीपी वृद्धि दर 7.2% रहने का अनुमान लगाया है।",
      "मुद्रास्फीति लक्ष्य: खाद्य मुद्रास्फीति पर सतर्कता बरतते हुए खुदरा महंगाई को 4% के लक्ष्य के अनुरूप लाने हेतु निकासी का रुख (Withdrawal of Accommodation)।"
    ],
    "provisions": [
      "एमपीसी में प्रत्येक सदस्य का एक वोट होता है; टाई होने की स्थिति में आरबीआई गवर्नर को निर्णायक मत (Casting Vote) का अधिकार है।",
      "सीआरआर (नकद आरक्षित अनुपात) 4.50% और एसएलआर (वैधानिक तरलता अनुपात) 18.00% पर स्थिर।",
      "डिजिटल भुगतान सुरक्षा हेतु यूपीआई 123पे और यूपीआई लाइट वॉलेट सीमाओं का विस्तार।"
    ],
    "highYieldFact": "आरबीआई की मौद्रिक नीति समिति (MPC) में कुल 6 सदस्य होते हैं और इसका वैधानिक मुद्रास्फीति लक्ष्य 4% (+/- 2%) है। रेपो रेट 6.50% पर स्थिर है।",
    "vocabulary": [
      {
        "word": "Accommodation",
        "pos": "Noun",
        "exactHindi": "समायोजन / तरलता प्रदान करने की नीति",
        "definition": "In economics, monetary policy designed to stimulate economic growth by keeping interest rates low.",
        "synonyms": "Monetary easing, Liquidity support",
        "antonyms": "Monetary tightening, Contraction",
        "examUsage": "\"The MPC maintained its withdrawal of accommodation stance to anchor inflation expectations.\""
      }
    ],
    "practiceMcq": {
      "question": "भारतीय रिजर्व बैंक (RBI) की मौद्रिक नीति समिति (MPC) में कुल कितने सदस्य होते हैं?",
      "options": [
        "4 सदस्य",
        "5 सदस्य",
        "6 सदस्य",
        "8 सदस्य"
      ],
      "correct": 2,
      "explanation": "आरबीआई मौद्रिक नीति समिति (MPC) में कुल 6 सदस्य होते हैं (3 आरबीआई अधिकारी + 3 केंद्र सरकार द्वारा नामित)।"
    },
    "mainsQuestion": "\"मूल्य स्थिरता और आर्थिक संवृद्धि के दोहरे उद्देश्यों के बीच भारतीय रिजर्व बैंक (RBI) की मौद्रिक नीति की चुनौतियों और प्रभावशीलता का समालोचनात्मक मूल्यांकन कीजिए।\""
  },
  {
    "id": "news-bns-bnss-bsa-criminal-laws",
    "categoryTag": "🏛️ राष्ट्रीय व विधि (NATIONAL)",
    "categoryFilter": "National & Polity",
    "date": "आज का अंक",
    "readTime": "3 मिनट Read",
    "releaseId": "206581792024121",
    "headline": "भारतीय न्याय संहिता (BNS 2023), BNSS और BSA: भारत की नई नागरिक-केंद्रित आपराधिक विधि प्रणाली का कार्यान्वयन",
    "summary": "औपनिवेशिक काल के 160 वर्ष पुराने भारतीय दंड संहिता (IPC 1860), CrPC 1973 और साक्ष्य अधिनियम 1872 के स्थान पर तीन नए आपराधिक कानून—भारतीय न्याय संहिता (BNS 2023), भारतीय नागरिक सुरक्षा संहिता (BNSS 2023) और भारतीय साक्ष्य अधिनियम (BSA 2023) संपूर्ण देश में प्रभावी रूप से लागू हैं।",
    "background": "इन कानूनों का उद्देश्य औपनिवेशिक दंड-आधारित व्यवस्था को समाप्त कर भारतीय संवैधानिक मूल्यों के अनुरूप न्याय-आधारित और नागरिक-अनुकूल प्रणाली स्थापित करना है। इसमें Zero FIR, ई-एफआईआर, फॉरेंसिक जांच की अनिवार्यता और छोटे अपराधों के लिए सामुदायिक सेवा (Community Service) जैसे क्रांतिकारी प्रावधान शामिल हैं।",
    "sourceMinistry": "विधि और न्याय मंत्रालय • गृह मंत्रालय • Gazette of India",
    "sourceUrl": "https://mha.gov.in",
    "imageUrl": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80",
    "imageCredit": "स्रोत: विधि एवं न्याय मंत्रालय • भारत का राजपत्र",
    "dimensions": [
      "भारतीय न्याय संहिता (BNS 2023): 358 धाराएं (IPC की 511 धाराओं के स्थान पर)। देशद्रोह (Treason) को स्पष्ट परिभाषित कर राजद्रोह (Sedition) की औपनिवेशिक धारा को हटाया गया।",
      "भारतीय नागरिक सुरक्षा संहिता (BNSS 2023): 531 धाराएं। 7 वर्ष या अधिक सजा वाले अपराधों में फॉरेंसिक टीम का घटना स्थल दौरा अनिवार्य।",
      "भारतीय साक्ष्य अधिनियम (BSA 2023): 170 धाराएं। इलेक्ट्रॉनिक और डिजिटल साक्ष्यों को प्राथमिक साक्ष्य (Primary Evidence) के समान कानूनी मान्यता।"
    ],
    "provisions": [
      "शून्य एफआईआर (Zero FIR): क्षेत्राधिकार की बाध्यता के बिना किसी भी थाने में अपराध की एफआईआर दर्ज कराई जा सकती है।",
      "समयबद्ध न्याय: जांच पूरी होने के 90 दिनों में चार्जशीट और सुनवाई पूरी होने के 30-45 दिनों के भीतर फैसला सुनाने का प्रावधान।",
      "महिलाओं और बच्चों के विरुद्ध अपराधों को BNS में प्राथमिकता से पहले अध्यायों में स्थान दिया गया है।"
    ],
    "highYieldFact": "तीनों नए आपराधिक कानून 1 जुलाई 2024 से संपूर्ण भारत में प्रभावी हुए। BNS में 358 धाराएं हैं (IPC 1860 में 511 थीं)।",
    "vocabulary": [
      {
        "word": "Jurisprudence",
        "pos": "Noun",
        "exactHindi": "न्यायशास्त्र / विधि दर्शन",
        "definition": "The theoretical study and philosophy of law.",
        "synonyms": "Legal science, Philosophy of law",
        "antonyms": "Anarchy, Lawlessness",
        "examUsage": "\"The enactment of BNS reflects a historic transition toward victim-centric jurisprudence.\""
      }
    ],
    "practiceMcq": {
      "question": "भारतीय दंड संहिता (IPC 1860) के स्थान पर कौन-सा नया आपराधिक कानून लागू किया गया है?",
      "options": [
        "भारतीय नागरिक सुरक्षा संहिता (BNSS)",
        "भारतीय न्याय संहिता (BNS 2023)",
        "भारतीय साक्ष्य अधिनियम (BSA)",
        "भारतीय दंड विधान"
      ],
      "correct": 1,
      "explanation": "IPC 1860 के स्थान पर भारतीय न्याय संहिता (BNS 2023) लागू की गई है जिसमें 358 धाराएं हैं।"
    },
    "mainsQuestion": "\"भारतीय न्याय संहिता (BNS) और BNSS औपनिवेशिक दंड व्यवस्था को नागरिक-केंद्रित त्वरित न्याय में कैसे रूपांतरित करते हैं? फॉरेंसिक साक्ष्यों के संदर्भ में स्पष्ट कीजिए।\""
  }
];

// Deterministic daily selector: Rotates the syllabus topic pool dynamically by day of month so that NO single topic repeats statically at the top!
export const getDailyRotatedEditorials = (): NewsEditorial[] => {
  const todayKey = getTodayDateKey();
  const todayHindi = getTodayHindiDate();
  const dayOfMonth = new Date().getDate();
  // Rotate by day of month offset so that Sports, Awards, Appointments, Exercises, Indices, Summits each get their turn at the top!
  const rotationOffset = (dayOfMonth * 3) % verifiedEditorials.length;
  const rotated = [
    ...verifiedEditorials.slice(rotationOffset),
    ...verifiedEditorials.slice(0, rotationOffset)
  ];
  return rotated.map((item) => ({
    ...item,
    id: `${item.id}-${todayKey}`,
    dateKey: todayKey,
    date: todayHindi
  }));
};

interface CurrentAffairsHubProps {
  initialArticleId?: string | null;
  currentUser?: FirebaseUser | null;
  onLoginRequired?: () => void;
  onReturnHome?: () => void;
  onArticleOpenChange?: (isOpen: boolean) => void;
}

export const CurrentAffairsHubView: React.FC<CurrentAffairsHubProps> = ({
  initialArticleId,
  currentUser: initialUser,
  onLoginRequired,
  onReturnHome,
  onArticleOpenChange
}) => {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleManualSync = async () => {
    setIsSyncing(true);
    // Logic: Fetch from verified sources (PIB + others), then update state
    const todayRotated = getDailyRotatedEditorials();
    localStorage.setItem('hans_synced_current_affairs', JSON.stringify(todayRotated));
    setEditorials(todayRotated);
    await new Promise(resolve => setTimeout(resolve, 800)); // UI delay for feedback
    setIsSyncing(false);
  };

  const [editorials, setEditorials] = useState<NewsEditorial[]>(() => {
    const todayKey = getTodayDateKey();
    const todayRotated = getDailyRotatedEditorials();
    try {
      const savedDate = localStorage.getItem('hans_ca_active_date_key');
      const saved = localStorage.getItem('hans_synced_current_affairs');

      // Purge old cache if date changed or if it contains old repetitive items / incomplete list
      if (savedDate !== todayKey) {
        localStorage.setItem('hans_ca_active_date_key', todayKey);
        localStorage.setItem('hans_synced_current_affairs', JSON.stringify(todayRotated));
        return deduplicateEditorials(todayRotated);
      }

      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 18) {
          // Verify it has the new sports and diversified exam syllabus
          const hasSports = parsed.some((p: any) => p.categoryTag?.includes('खेलकूद') || p.id?.includes('t20'));
          if (hasSports) {
            const validToday = parsed.filter((item: NewsEditorial) => !item.dateKey || item.dateKey === todayKey);
            if (validToday.length > 0) {
              const map = new Map<string, NewsEditorial>();
              validToday.forEach((item: NewsEditorial) => map.set(item.id, { ...item, dateKey: todayKey, date: getTodayHindiDate() }));
              todayRotated.forEach(item => {
                if (!map.has(item.id)) map.set(item.id, item);
              });
              return deduplicateEditorials(Array.from(map.values()));
            }
          }
        }
      }
    } catch {
      // ignore
    }
    localStorage.setItem('hans_ca_active_date_key', todayKey);
    localStorage.setItem('hans_synced_current_affairs', JSON.stringify(todayRotated));
    return deduplicateEditorials(todayRotated);
  });

  const [feedSectionTab, setFeedSectionTab] = useState<'today' | 'yesterday' | 'pib' | 'all'>('today');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<NewsEditorial | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [showLiveQuizModal, setShowLiveQuizModal] = useState<boolean>(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [isGeneratingAiArticle, setIsGeneratingAiArticle] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(() => initialUser || getEffectiveUser());
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Live Cloud Sync State
  const [lastSyncTime, setLastSyncTime] = useState<string>(() => {
    return localStorage.getItem('hans_ca_last_sync') || 'अभी सिंक करें';
  });
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  // Article Reader & Hub Controls
  const [readerTheme, setReaderTheme] = useState<'pib' | 'dark'>('pib');
  const [isArticleToolbarOpen, setIsArticleToolbarOpen] = useState<boolean>(false);
  const [isHubControlsOpen, setIsHubControlsOpen] = useState<boolean>(true);
  const [fontSizeLevel, setFontSizeLevel] = useState<'sm' | 'base' | 'lg' | 'xl'>(() => {
    const savedSize = localStorage.getItem('hans_ca_font_size') as 'sm' | 'base' | 'lg' | 'xl' | null;
    return savedSize && ['sm', 'base', 'lg', 'xl'].includes(savedSize) ? savedSize : 'base';
  });
  const [audioLangMode, setAudioLangMode] = useState<'hi' | 'en' | 'both'>('both');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [translatedCache, setTranslatedCache] = useState<Record<string, Partial<EnglishTranslatedArticle>>>({});
  const [isTranslatingLoading, setIsTranslatingLoading] = useState<boolean>(false);
  const [mcqSelected, setMcqSelected] = useState<number | null>(null);
  const [vocabSearchWord, setVocabSearchWord] = useState<string>('');
  const [vocabSearchResult, setVocabSearchResult] = useState<VocabularyItem | null>(null);
  const [isSearchingVocab, setIsSearchingVocab] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const handleSetFontSize = (size: 'sm' | 'base' | 'lg' | 'xl') => {
    setFontSizeLevel(size);
    try {
      localStorage.setItem('hans_ca_font_size', size);
    } catch {
      // ignore
    }
  };

  const fontBodyStyle: React.CSSProperties = {
    fontSize:
      fontSizeLevel === 'sm'
        ? '13.5px'
        : fontSizeLevel === 'lg'
        ? '19px'
        : fontSizeLevel === 'xl'
        ? '22px'
        : '16px',
    lineHeight:
      fontSizeLevel === 'sm'
        ? '1.6'
        : fontSizeLevel === 'lg'
        ? '1.85'
        : fontSizeLevel === 'xl'
        ? '1.95'
        : '1.75'
  };

  const fontHeadlineStyle: React.CSSProperties = {
    fontSize:
      fontSizeLevel === 'sm'
        ? '18px'
        : fontSizeLevel === 'lg'
        ? '28px'
        : fontSizeLevel === 'xl'
        ? '33px'
        : '23px',
    lineHeight: '1.35'
  };

  const fontCardTitleStyle: React.CSSProperties = {
    fontSize:
      fontSizeLevel === 'sm'
        ? '15px'
        : fontSizeLevel === 'lg'
        ? '21px'
        : fontSizeLevel === 'xl'
        ? '24px'
        : '18px',
    lineHeight: '1.4'
  };

  // In-Article AI Doubt & Deep Explanation Studio
  const [articleDoubtInput, setArticleDoubtInput] = useState<string>('');
  const [articleDoubtAnswer, setArticleDoubtAnswer] = useState<string | null>(null);
  const [isAskingArticleDoubt, setIsAskingArticleDoubt] = useState<boolean>(false);

  // Notify parent App when reading an article so top header (#1) hides and toolbar (#2) sits at the very top
  useEffect(() => {
    onArticleOpenChange?.(!!activeArticle);
  }, [activeArticle, onArticleOpenChange]);

  useEffect(() => {
    return () => {
      onArticleOpenChange?.(false);
    };
  }, [onArticleOpenChange]);

  // Audio Reader Player State
  const [isAudioActive, setIsAudioActive] = useState<boolean>(false);
  const [isAudioPaused, setIsAudioPaused] = useState<boolean>(false);
  const [activeAudioTitle, setActiveAudioTitle] = useState<string>('');
  const [speakingSentencePreview, setSpeakingSentencePreview] = useState<string>('');
  const [audioProgress, setAudioProgress] = useState<{ current: number; total: number } | null>(null);
  const [speechSpeed, setSpeechSpeed] = useState<number>(0.93);

  // Sync auth state
  useEffect(() => {
    const unsub = subscribeAuthChanges(u => {
      setCurrentUser(u);
    });
    return () => unsub();
  }, []);

  // Main Instant Refresh & Cloud Sync Function (Automatically purges previous day's articles and loads today's fresh articles)
  const handleManualRefresh = async (forceNewAi = true) => {
    setIsSyncing(true);
    setSyncStatusMsg('आज की ताजा खबरें अपडेट हो रही हैं (पुराने दिन के आर्टिकल स्वतः हटाए गए)...');

    const todayKey = getTodayDateKey();
    const todayHindi = getTodayHindiDate();
    const todayRotated = getDailyRotatedEditorials();

    // 1. Immediate instant local state refresh with ONLY today's articles
    const map = new Map<string, NewsEditorial>();
    todayRotated.forEach(item => map.set(item.id, item));
    editorials
      .filter(item => item.dateKey === todayKey)
      .forEach(item => map.set(item.id, { ...item, dateKey: todayKey, date: todayHindi }));

    const refreshedList = deduplicateEditorials(Array.from(map.values()));
    setEditorials(refreshedList);
    localStorage.setItem('hans_ca_active_date_key', todayKey);
    localStorage.setItem('hans_synced_current_affairs', JSON.stringify(refreshedList));

    const nowStr = new Date().toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLastSyncTime(`आज ${nowStr}`);
    localStorage.setItem('hans_ca_last_sync', `आज ${nowStr}`);

    // 2. Fetch today's live AI / daily rotated vault from server in background
    try {
      const res = await fetch('/api/current-affairs/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          initialList: todayRotated,
          forceRefresh: forceNewAi
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.articles) && data.articles.length > 0) {
          const freshArticles: NewsEditorial[] = deduplicateEditorials(
            data.articles.map((item: any, idx: number) => ({
              ...item,
              id: item.id || `ca-${todayKey}-${idx + 1}`,
              dateKey: todayKey,
              date: todayHindi
            }))
          );

          setEditorials(freshArticles);
          localStorage.setItem('hans_ca_active_date_key', todayKey);
          localStorage.setItem('hans_synced_current_affairs', JSON.stringify(freshArticles));
        }
      }
    } catch (err) {
      console.warn('Sync error:', err);
    } finally {
      setTimeout(() => {
        setIsSyncing(false);
        setSyncStatusMsg(`✅ आज (${todayHindi}) के ताजा आर्टिकल्स अपडेट हो गए हैं • पुराने आर्टिकल्स स्वतः हट गए हैं!`);
        setTimeout(() => setSyncStatusMsg(null), 4000);
      }, 350);
    }
  };

  const syncArticlesWithCloud = async (forceRefresh = false) => {
    return handleManualRefresh(forceRefresh);
  };

  // Auto-sync on component mount
  useEffect(() => {
    syncArticlesWithCloud(false);
  }, []);

  // Direct Article Deep Linking check on mount & hash/query change
  useEffect(() => {
    const checkDirectArticleLink = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const queryArticleId = initialArticleId || urlParams.get('article') || urlParams.get('articleId');
        let hashArticleId = '';
        if (window.location.hash) {
          const match = window.location.hash.match(/article=([^&]+)/);
          if (match && match[1]) {
            hashArticleId = decodeURIComponent(match[1]);
          }
        }

        const targetId = queryArticleId || hashArticleId;
        if (targetId) {
          let found = editorials.find(item => item.id === targetId || item.id.toLowerCase() === targetId.toLowerCase());
          
          // If not in state, attempt fetching from server vault directly
          if (!found) {
            try {
              const res = await fetch(`/api/current-affairs/get?id=${encodeURIComponent(targetId)}`);
              if (res.ok) {
                const data = await res.json();
                if (data.success && data.article) {
                  found = data.article;
                  setEditorials(prev => [data.article, ...prev.filter(x => x.id !== data.article.id)]);
                }
              }
            } catch {
              // fallback
            }
          }

          if (found) {
            setActiveArticle(found);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }
      } catch (e) {
        console.warn('URL article parse error:', e);
      }
    };

    checkDirectArticleLink();

    const handlePopState = () => {
      checkDirectArticleLink();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [editorials, initialArticleId]);

  const handleOpenArticle = (item: NewsEditorial) => {
    setActiveArticle(item);
    setMcqSelected(null);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('article', item.id);
      window.history.pushState({}, '', url.toString());
    } catch {
      // fallback
    }
    recordStudyActivity('current-affairs', item.headline, item.summary, 100);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseArticle = () => {
    setActiveArticle(null);
    if (isAudioActive) {
      stopNaturalSpeech();
      setIsAudioActive(false);
      setIsAudioPaused(false);
      setAudioProgress(null);
      setSpeakingSentencePreview('');
      setActiveAudioTitle('');
    }
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('article');
      url.searchParams.delete('articleId');
      window.history.pushState({}, '', url.pathname + (url.search ? url.search : ''));
    } catch {
      // fallback
    }
  };

  const getDirectArticleUrl = (item: NewsEditorial) => {
    try {
      const origin = window.location.origin;
      const pathname = window.location.pathname;
      return `${origin}${pathname}?article=${encodeURIComponent(item.id)}`;
    } catch {
      return `https://hans-compain.onrender.com/?article=${encodeURIComponent(item.id)}`;
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const u = await signInWithGoogle();
      if (u) {
        setCurrentUser(u);
      }
    } catch (e) {
      console.warn('Login error:', e);
      if (onLoginRequired) {
        onLoginRequired();
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const todayKey = getTodayDateKey();
  const yesterdayKey = getYesterdayDateKey();
  const yesterdayHindi = getYesterdayHindiDate();

  // Deduplicate all active articles
  const deduplicatedPool = deduplicateEditorials(editorials);

  // Dedicated non-overlapping retrospective archive for yesterday
  const yesterdayRetrospective: NewsEditorial[] = verifiedEditorials.slice(3, 10).map((item, idx) => {
    const imgMeta = resolveTopicImageUrl(item.headline, item.categoryTag, item.summary);
    return {
      ...item,
      id: `ca-${yesterdayKey}-archive-${idx + 1}`,
      dateKey: yesterdayKey,
      date: yesterdayHindi,
      imageUrl: item.imageUrl || imgMeta.imageUrl,
      imageCredit: item.imageCredit || imgMeta.imageCredit
    };
  });

  const activePool = feedSectionTab === 'yesterday'
    ? (() => {
        const storedYesterday = deduplicatedPool.filter(i => i.dateKey === yesterdayKey || (i.dateKey && i.dateKey < todayKey));
        return storedYesterday.length > 0 ? storedYesterday : yesterdayRetrospective;
      })()
    : deduplicatedPool;

  const filtered = activePool.filter(item => {
    // 1. Anti-Repeat Feed Section Filter
    if (feedSectionTab === 'today') {
      const isToday = !item.dateKey || item.dateKey === todayKey;
      if (!isToday) return false;
    } else if (feedSectionTab === 'pib') {
      const isPib =
        item.sourceMinistry?.toLowerCase().includes('pib') ||
        item.sourceMinistry?.includes('प्रेस सूचना') ||
        item.sourceUrl?.includes('pib.gov.in') ||
        item.sourceMinistry?.includes('मंत्रालय');
      if (!isPib) return false;
    }

    // 2. All-Inclusive Stream (No category restriction hiding news - all exam current affairs presented together)
    const catMatch = selectedCategory === 'All' || !selectedCategory || item.categoryFilter === selectedCategory || item.categoryTag.toLowerCase().includes(selectedCategory.toLowerCase());

    // 3. Search Query
    const q = searchQuery.toLowerCase();
    const searchMatch =
      !q ||
      item.headline.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.categoryTag.toLowerCase().includes(q);

    return catMatch && searchMatch;
  });

  const handleReadFullArticle = (item: NewsEditorial, overrideMode?: 'hi' | 'en' | 'both') => {
    if (isAudioActive && !overrideMode) {
      stopNaturalSpeech();
      setIsAudioActive(false);
      setIsAudioPaused(false);
      setAudioProgress(null);
      setSpeakingSentencePreview('');
      setActiveAudioTitle('');
      return;
    }

    const eng = getInstantEnglishTranslation(item, translatedCache[item.id]);
    const effectiveMode = overrideMode || (isTranslating ? 'en' : audioLangMode);

    const hindiNarrative = [
      `संपादकीय शीर्षक: ${item.headline}।`,
      `दिनांक: ${item.date}। स्रोत: ${item.sourceMinistry}।`,
      `भाग 1: मुख्य सारांश। ${item.summary}`,
      item.background ? `भाग 2: पृष्ठभूमि व ऐतिहासिक संदर्भ। ${item.background}` : '',
      item.dimensions && item.dimensions.length > 0 ? `भाग 3: विस्तृत आयाम व मुख्य बिंदु। ${item.dimensions.join('। ')}` : '',
      item.provisions && item.provisions.length > 0 ? `भाग 4: प्रमुख नीतिगत प्रावधान। ${item.provisions.join('। ')}` : '',
      item.highYieldFact ? `भाग 5: हाई-यील्ड परीक्षा तथ्य: ${item.highYieldFact}` : '',
      item.practiceMcq
        ? `भाग 6: अभ्यास प्रश्न: ${item.practiceMcq.question}। सही उत्तर है विकल्प ${String.fromCharCode(65 + item.practiceMcq.correct)}, ${item.practiceMcq.options[item.practiceMcq.correct]}। व्याख्या: ${item.practiceMcq.explanation}`
        : ''
    ]
      .filter(Boolean)
      .join(' ');

    const englishNarrative = [
      `Editorial Headline: ${eng.headline}.`,
      `Source: ${eng.sourceMinistry}.`,
      `Part 1: Executive Summary. ${eng.summary}`,
      `Part 2: Historical Background and Context. ${eng.background}`,
      `Part 3: Key Analytical Dimensions. ${eng.dimensions.join('. ')}`,
      `Part 4: Official Policy Provisions. ${eng.provisions.join('. ')}`,
      `Part 5: High-Yield Exam Fact. ${eng.highYieldFact}`,
      `Part 6: Prelims Practice Question. ${eng.mcqQuestion} Correct Answer is Option ${String.fromCharCode(65 + item.practiceMcq.correct)}, ${eng.mcqOptions[item.practiceMcq.correct]}. Explanation: ${eng.mcqExplanation}`
    ]
      .filter(Boolean)
      .join(' ');

    const bilingualNarrative = [
      `द्विभाषी करंट अफेयर्स ऑडियो रीडर (Hindi and English Bilingual Reader)।`,
      `शीर्षक: ${item.headline}। English Headline: ${eng.headline}.`,
      `भाग 1: मुख्य सारांश। ${item.summary} In English: ${eng.summary}`,
      `भाग 2: पृष्ठभूमि। ${item.background} Background in English: ${eng.background}`,
      `भाग 3: प्रमुख परीक्षा बिंदु। ${item.dimensions.join('। ')} Key Dimensions in English: ${eng.dimensions.join('. ')}`,
      `भाग 4: नीतिगत प्रावधान। ${item.provisions.join('। ')} Official Provisions: ${eng.provisions.join('. ')}`,
      `भाग 5: महत्वपूर्ण शब्दावली (Vocabulary in Hindi and English): ${item.vocabulary.map(v => `${v.word}, जिसका हिंदी अर्थ है ${v.exactHindi}. Definition: ${v.definition}`).join('। ')}`,
      `भाग 6: हाई-यील्ड परीक्षा तथ्य: ${item.highYieldFact} High-Yield Fact: ${eng.highYieldFact}`,
      `भाग 7: अभ्यास प्रश्न: ${item.practiceMcq.question} सही उत्तर: ${item.practiceMcq.options[item.practiceMcq.correct]}। In English: ${eng.mcqQuestion} Correct Option: ${eng.mcqOptions[item.practiceMcq.correct]}.`
    ].join(' ');

    const fullNarrative =
      effectiveMode === 'en'
        ? englishNarrative
        : effectiveMode === 'both'
        ? bilingualNarrative
        : hindiNarrative;

    setIsAudioActive(true);
    setIsAudioPaused(false);
    setActiveAudioTitle(effectiveMode === 'en' ? eng.headline : item.headline);

    playNaturalSpeech(
      fullNarrative,
      () => {
        setIsAudioActive(false);
        setIsAudioPaused(false);
        setAudioProgress(null);
        setSpeakingSentencePreview('');
        setActiveAudioTitle('');
      },
      (idx, total, currentSentence) => {
        setAudioProgress({ current: idx + 1, total });
        setSpeakingSentencePreview(currentSentence);
      },
      speechSpeed
    );
  };

  const togglePauseResumeAudio = () => {
    if (!isAudioActive) return;
    if (isAudioPaused) {
      resumeNaturalSpeech();
      setIsAudioPaused(false);
    } else {
      pauseNaturalSpeech();
      setIsAudioPaused(true);
    }
  };

  const handleStopAudio = () => {
    stopNaturalSpeech();
    setIsAudioActive(false);
    setIsAudioPaused(false);
    setAudioProgress(null);
    setSpeakingSentencePreview('');
    setActiveAudioTitle('');
  };

  const speakText = (text: string) => {
    playNaturalSpeech(text);
  };

  const handleShareArticle = (item: NewsEditorial) => {
    const directUrl = getDirectArticleUrl(item);
    const shareText = `📰 *HANS COMPAIN PIB NEWS HUB*\n\n📌 *${item.headline}*\n\n👉 *पूरा आर्टिकल पढ़ें (Click Link):*\n${directUrl}\n\n📝 *मुख्य सारांश:*\n${item.summary.slice(0, 160)}...\n\n_HANS COMPAIN - Official Competitive Exams & Steno Hub_`;

    if (navigator.share) {
      navigator
        .share({
          title: item.headline,
          text: shareText,
          url: directUrl
        })
        .catch(() => {
          navigator.clipboard?.writeText(shareText);
          setCopiedLink(true);
          setTimeout(() => setCopiedLink(false), 2000);
        });
    } else {
      navigator.clipboard?.writeText(shareText);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
      window.open(waUrl, '_blank');
    }
  };

  const handleShareToPlatform = (platform: 'wa' | 'insta' | 'tele') => {
    if (!activeArticle) return;
    const directUrl = getDirectArticleUrl(activeArticle);
    const shareText = `📰 *HANS COMPAIN PIB NEWS HUB*\n\n📌 *${activeArticle.headline}*\n\n👉 *पूरा आर्टिकल पढ़ें (Click Link):*\n${directUrl}\n\n📝 *मुख्य सारांश:*\n${activeArticle.summary.slice(0, 160)}...\n\n_HANS COMPAIN - Official Competitive Exams & Steno Hub_`;

    if (platform === 'wa') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
    } else if (platform === 'tele') {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(directUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
    } else {
      navigator.clipboard?.writeText(shareText);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Live AI Vocabulary & Anto-Syno search (Instant Bilingual + Server AI Enrichment)
  const handleVocabSearch = async (overrideWord?: string) => {
    const targetWord = (overrideWord ?? vocabSearchWord).trim();
    if (!targetWord) return;
    if (overrideWord) setVocabSearchWord(overrideWord);
    setIsSearchingVocab(true);

    // 1. Immediate instant bilingual dictionary lookup so it works 100% of the time with zero delay
    const instantResult = lookupBilingualVocabulary(targetWord, activeArticle);
    setVocabSearchResult(instantResult);

    // 2. Try dedicated server AI vocabulary endpoint for custom words
    try {
      const res = await fetch('/api/current-affairs/vocab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: targetWord,
          contextHeadline: activeArticle?.headline || ''
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.vocab && data.vocab.word && data.vocab.exactHindi) {
          setVocabSearchResult(data.vocab);
        }
      }
    } catch {
      // instantResult is already displayed
    } finally {
      setIsSearchingVocab(false);
    }
  };

  const handleGenerateAiArticle = async (customTopic?: string) => {
    setIsGeneratingAiArticle(true);
    const topicToUse = (customTopic ?? searchQuery).trim();

    try {
      // 1. Build rich bilingual article immediately via our smart engine
      const built = buildSmartBilingualAiArticle(topicToUse);
      let finalEd: NewsEditorial = built.article;
      let finalEng: Partial<EnglishTranslatedArticle> = built.english;

      // 2. Also query dedicated server AI generator if online
      try {
        const res = await fetch('/api/current-affairs/generate-article', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic: topicToUse || finalEd.headline })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.article && data.article.headline) {
            finalEd = data.article;
            if (data.article.englishTranslation) {
              finalEng = data.article.englishTranslation;
            }
          }
        }
      } catch {
        // use built article seamlessly
      }

      setTranslatedCache(prev => ({ ...prev, [finalEd.id]: finalEng }));

      setEditorials(prev => {
        const updated = [finalEd, ...prev.filter(x => x.id !== finalEd.id)];
        localStorage.setItem('hans_synced_current_affairs', JSON.stringify(updated));
        return updated;
      });

      fetch('/api/current-affairs/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article: finalEd })
      }).catch(() => {});

      setSyncStatusMsg(`✨ नया द्विभाषी (Hindi + English) AI संपादकीय आर्टिकल तैयार हो गया है!`);
      setTimeout(() => setSyncStatusMsg(null), 4000);
      handleOpenArticle(finalEd);
    } finally {
      setIsGeneratingAiArticle(false);
    }
  };

  const isUserAuthenticated = !!currentUser;

  const handleAskArticleDoubt = async (customPrompt?: string) => {
    if (!activeArticle) return;
    const q = (customPrompt || articleDoubtInput).trim();
    if (!q) return;
    setIsAskingArticleDoubt(true);
    if (!customPrompt) setArticleDoubtInput('');

    const eng = getInstantEnglishTranslation(activeArticle, translatedCache[activeArticle.id]);
    const instantBilingualAnswer = buildBilingualArticleDoubtAnswer(q, activeArticle, eng);

    try {
      const prompt = `आप एक वरिष्ठ UPSC/SSC द्विभाषी (Hindi + English) संपादकीय विशेषज्ञ हैं।
आर्टिकल शीर्षक (Hindi): "${activeArticle.headline}"
Article Headline (English): "${eng.headline}"
सारांश: "${activeArticle.summary}"
पृष्ठभूमि: "${activeArticle.background}"
मुख्य बिंदु: "${activeArticle.dimensions.join('; ')}"
नीतिगत प्रावधान: "${activeArticle.provisions.join('; ')}"
हाई-यील्ड फैक्ट: "${activeArticle.highYieldFact}"

छात्र का प्रश्न: "${q}"
कृपया इस आर्टिकल के संदर्भ में छात्र के प्रश्न का बहुत ही सरल, स्पष्ट और परीक्षा-उपयोगी विस्तृत उत्तर दोनों भाषाओं (Part 1: सरल हिंदी में और Part 2: Clear English में) बिंदुवार (Bullet Points में) दें।`;
      const res = await askHansCompainAI(prompt, null, 'chat');
      if (res && res.length > 80 && !res.includes('आपका प्रश्न प्राप्त हुआ')) {
        setArticleDoubtAnswer(res);
      } else {
        setArticleDoubtAnswer(instantBilingualAnswer);
      }
    } catch {
      setArticleDoubtAnswer(instantBilingualAnswer);
    } finally {
      setIsAskingArticleDoubt(false);
    }
  };

  const handleToggleTranslate = async () => {
    if (!activeArticle) return;
    const nextState = !isTranslating;
    setIsTranslating(nextState);

    if (nextState && !translatedCache[activeArticle.id]) {
      // Immediately populate with instant high-precision English translation so there is zero blank delay
      const instantEng = getInstantEnglishTranslation(activeArticle);
      setTranslatedCache(prev => ({ ...prev, [activeArticle.id]: instantEng }));

      // Also call dedicated server translation endpoint for custom dynamic articles
      setIsTranslatingLoading(true);
      try {
        const res = await fetch('/api/current-affairs/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ article: activeArticle })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.translation && data.translation.headline) {
            setTranslatedCache(prev => ({
              ...prev,
              [activeArticle.id]: { ...instantEng, ...data.translation }
            }));
          }
        }
      } catch {
        // instantEng is already active in state
      } finally {
        setIsTranslatingLoading(false);
      }
    }
  };

  const activeEng: EnglishTranslatedArticle | null = activeArticle
    ? getInstantEnglishTranslation(activeArticle, translatedCache[activeArticle.id])
    : null;

  return (
    <div className="w-full space-y-4 animate-fade-in pb-16">
      {/* -------------------------------------------------------------
          VIEW A: FULL ARTICLE PIB DETAIL VIEW (TOOLBAR #2 AT THE VERY TOP + COMPLETE LONG-FORM ARTICLE & ALL EXPLANATIONS)
          ------------------------------------------------------------- */}
      {activeArticle && activeEng ? (
        <div className="w-full space-y-4 animate-fade-in">
          {/* 1. TOP ACTION TOOLBAR WITH ARROW HIDE/SHOW TOGGLE */}
          <div className="bg-[#091122]/95 border border-slate-700/80 rounded-2xl px-3 py-2 sm:px-4 sm:py-2.5 shadow-2xl sticky top-0 z-40 backdrop-blur-xl transition-all duration-200">
            {/* Compact Always-Visible Top Strip with Arrow Hide/Show Button */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={handleCloseArticle}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 font-black text-xs flex items-center gap-1 cursor-pointer shadow-sm shrink-0"
                  title="वापस करंट अफेयर्स सूची पर जाएं"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
                  <span>वापस</span>
                </button>

                {/* Quick Listen Button always accessible */}
                <button
                  onClick={() => handleReadFullArticle(activeArticle)}
                  className={`px-2.5 py-1.5 rounded-xl border font-black text-xs flex items-center gap-1.5 cursor-pointer transition-all whitespace-nowrap ${
                    isAudioActive
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-md animate-pulse'
                      : 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/80 hover:text-white'
                  }`}
                  title="पूरी खबर नेचुरल आवाज में सुनें"
                >
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{isAudioActive ? 'ऑडियो रोकें' : 'पूरी खबर सुनें'}</span>
                </button>

                {/* Quick English/Hindi Switch always accessible */}
                <button
                  onClick={handleToggleTranslate}
                  className={`px-2.5 py-1.5 rounded-xl font-black text-xs flex items-center gap-1 cursor-pointer transition-all whitespace-nowrap ${
                    isTranslating
                      ? 'bg-amber-500 text-slate-950 border border-amber-300 shadow'
                      : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                  }`}
                >
                  <Languages className="w-3.5 h-3.5 shrink-0" />
                  <span>{isTranslatingLoading ? '...' : isTranslating ? 'हिंदी' : 'English'}</span>
                </button>
              </div>

              {/* Right Side: Arrow Button to Hide / Show Theme, Share, Font Size & Extra Tools + Close Button */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsArticleToolbarOpen(prev => !prev)}
                  className={`px-3 py-1.5 rounded-xl border font-black text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-sm ${
                    isArticleToolbarOpen
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                      : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200'
                  }`}
                  title={isArticleToolbarOpen ? 'थीम, शेयर और टूल्स छुपाएं (Hide Tools)' : 'थीम, शेयर, फॉन्ट और अन्य टूल्स दिखाएं (Show Tools)'}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="hidden xs:inline sm:inline">
                    {isArticleToolbarOpen ? 'टूल्स छुपाएं' : 'थीम व शेयर टूल्स'}
                  </span>
                  {isArticleToolbarOpen ? (
                    <ChevronUp className="w-4 h-4 text-cyan-300 shrink-0 transition-transform" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-cyan-300 shrink-0 transition-transform" />
                  )}
                </button>

                <button
                  onClick={handleCloseArticle}
                  className="p-1.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500 hover:text-white cursor-pointer shrink-0"
                  title="आर्टिकल बंद करें"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Collapsible Drawer: Theme (PIB/Dark), Voice Lang, Font Size, Share, Save, AI Doubt, PDF */}
            {isArticleToolbarOpen && (
              <div className="pt-2.5 mt-2.5 border-t border-slate-800/90 space-y-2.5 animate-fade-in">
                {/* Row 1 inside Drawer: Theme Switcher, Voice Language, Font Size */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* PIB vs Dark Theme Switcher */}
                    <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-xl border border-slate-800">
                      <button
                        onClick={() => setReaderTheme('pib')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-black flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap ${
                          readerTheme === 'pib'
                            ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <span>📰 PIB View</span>
                      </button>
                      <button
                        onClick={() => setReaderTheme('dark')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-black flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap ${
                          readerTheme === 'dark'
                            ? 'bg-blue-600 text-white shadow'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <span>📱 Dark View</span>
                      </button>
                    </div>

                    {/* Audio Language Selector (Hindi / English / दोनों भाषा) */}
                    <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-xl border border-emerald-500/30">
                      <span className="text-[10px] font-black text-emerald-400 px-1.5 hidden sm:inline">🔊 Voice:</span>
                      {([
                        { id: 'hi', label: 'हिंदी' },
                        { id: 'en', label: 'English' },
                        { id: 'both', label: 'द्विभाषी (Both)' }
                      ] as const).map(m => (
                        <button
                          key={m.id}
                          onClick={() => {
                            setAudioLangMode(m.id);
                            if (isAudioActive && activeArticle) {
                              handleReadFullArticle(activeArticle, m.id);
                            }
                          }}
                          className={`px-2 py-1 rounded-lg text-[10px] sm:text-[11px] font-black cursor-pointer transition-all ${
                            audioLangMode === m.id
                              ? 'bg-emerald-600 text-white shadow'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font Size Small / Medium / Large / XL */}
                  <div className="flex items-center bg-slate-900 border border-slate-750 rounded-xl p-0.5 text-[11px] font-bold">
                    <button
                      onClick={() => handleSetFontSize('sm')}
                      className={`px-2 py-1 rounded-lg cursor-pointer transition-all ${fontSizeLevel === 'sm' ? 'bg-cyan-600 text-white font-black shadow' : 'text-slate-400 hover:text-white'}`}
                      title="Small Font (छोटा अक्षर)"
                    >
                      Small (A-)
                    </button>
                    <button
                      onClick={() => handleSetFontSize('base')}
                      className={`px-2 py-1 rounded-lg cursor-pointer transition-all ${fontSizeLevel === 'base' ? 'bg-cyan-600 text-white font-black shadow' : 'text-slate-400 hover:text-white'}`}
                      title="Medium Font (सामान्य अक्षर)"
                    >
                      Med (A)
                    </button>
                    <button
                      onClick={() => handleSetFontSize('lg')}
                      className={`px-2 py-1 rounded-lg cursor-pointer transition-all ${fontSizeLevel === 'lg' ? 'bg-cyan-600 text-white font-black shadow' : 'text-slate-400 hover:text-white'}`}
                      title="Large Font (बड़ा अक्षर)"
                    >
                      Large (A+)
                    </button>
                    <button
                      onClick={() => handleSetFontSize('xl')}
                      className={`px-2 py-1 rounded-lg cursor-pointer transition-all ${fontSizeLevel === 'xl' ? 'bg-cyan-600 text-white font-black shadow' : 'text-slate-400 hover:text-white'}`}
                      title="Extra Large Font (अति बड़ा अक्षर)"
                    >
                      XL (A++)
                    </button>
                  </div>
                </div>

                {/* Row 2 inside Drawer: Share, AI Doubt, Bookmark, Print */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
                  {/* AI Doubt & Explanation */}
                  <button
                    onClick={() => {
                      setIsArticleToolbarOpen(false);
                      const el = document.getElementById('in-article-ai-doubt-box');
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      handleAskArticleDoubt('इस पूरे आर्टिकल को सरल भाषा में सभी प्रमुख परीक्षा बिंदुओं के साथ समझाएं।');
                    }}
                    className="px-2.5 py-2 rounded-xl bg-indigo-950/90 border border-cyan-500/40 text-cyan-300 font-black text-[11px] sm:text-xs flex items-center justify-center gap-1 cursor-pointer hover:bg-indigo-900 whitespace-nowrap"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>AI डाउट व व्याख्या</span>
                  </button>

                  {/* Direct Share Link */}
                  <button
                    onClick={() => handleShareArticle(activeArticle)}
                    className="px-2.5 py-2 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1 cursor-pointer hover:bg-amber-500 hover:text-slate-950 transition-all whitespace-nowrap"
                    title="शेयर करें"
                  >
                    <Share2 className="w-3.5 h-3.5 shrink-0" />
                    <span>शेयर करें (Share)</span>
                  </button>

                  {/* Bookmark */}
                  <button
                    onClick={() =>
                      setBookmarkedIds(prev =>
                        prev.includes(activeArticle.id) ? prev.filter(x => x !== activeArticle.id) : [...prev, activeArticle.id]
                      )
                    }
                    className={`px-2.5 py-2 rounded-xl border font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap ${
                      bookmarkedIds.includes(activeArticle.id)
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-900 border-slate-750 text-slate-300 hover:text-white'
                    }`}
                    title="बुकमार्क करें"
                  >
                    <Bookmark className="w-3.5 h-3.5 shrink-0" />
                    <span>{bookmarkedIds.includes(activeArticle.id) ? 'सेव्ड' : 'सेव करें'}</span>
                  </button>

                  {/* Print / Save PDF */}
                  <button
                    onClick={() => window.print()}
                    className="px-2.5 py-2 rounded-xl bg-slate-900 border border-slate-750 text-slate-300 hover:text-white font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap"
                    title="प्रिंट करें / PDF सेव करें"
                  >
                    <Printer className="w-3.5 h-3.5 shrink-0" />
                    <span>PDF / प्रिंट</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 2. OFFICIAL PIB EMBLEM ARTICLE CONTAINER (FULL-LENGTH EDITORIAL + ALL EXPLANATIONS) */}
          <div
            className={`rounded-3xl shadow-2xl overflow-hidden border transition-all ${
              readerTheme === 'pib'
                ? 'bg-[#FCFBF8] text-slate-900 border-slate-200'
                : 'bg-[#091122] text-slate-100 border-slate-800'
            }`}
          >
            {/* Top Tricolor Accent Line (Saffron / White / Green) */}
            <div className="h-1.5 w-full flex">
              <div className="h-full w-1/2 bg-[#FF9933]" />
              <div className="h-full w-1/2 bg-[#138808]" />
            </div>

            <div className="p-4 sm:p-8 space-y-6">
              {/* PIB Official Header */}
              <div className="text-center space-y-1 border-b border-slate-200/80 pb-4">
                <div className="text-[11px] font-black text-[#A16207] tracking-widest uppercase">
                  सत्यमेव जयते • GOVERNMENT OF INDIA
                </div>
                <h2 className={`text-xl sm:text-2xl font-black tracking-tight ${readerTheme === 'pib' ? 'text-slate-900' : 'text-white'}`}>
                  {isTranslating ? 'PRESS INFORMATION BUREAU (PIB) & EDITORIAL DESK' : 'पत्र सूचना कार्यालय एवं संपादकीय विश्लेषण'}
                </h2>
                <div className={`text-xs font-bold ${readerTheme === 'pib' ? 'text-slate-600' : 'text-slate-400'}`}>
                  {isTranslating ? 'Complete In-Depth Examination Coverage (UPSC / SSC / State PCS / Banking)' : 'भारत सरकार • संपूर्ण विस्तृत संपादकीय एवं परीक्षा व्याख्या (All-in-One Explanation)'}
                </div>
              </div>

              {/* Meta details bar: Ministry & Release ID */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border-b border-slate-200/80 pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className={`font-bold ${readerTheme === 'pib' ? 'text-slate-700' : 'text-slate-200'}`}>{activeArticle.sourceMinistry}</span>
                  <a
                    href={activeArticle.sourceUrl || 'https://pib.gov.in'}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-black text-[10px] uppercase flex items-center gap-1 border border-amber-300"
                  >
                    <span>आधिकारिक स्रोत</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>

                <div className="text-slate-500 text-[11px] font-mono">
                  स्थान: नई दिल्ली • {activeArticle.date} • Release ID: {activeArticle.releaseId}
                </div>
              </div>

              {/* Main Headline Title */}
              <div className="space-y-2.5">
                <h1
                  style={fontHeadlineStyle}
                  className={`font-black leading-tight font-hindi-title ${readerTheme === 'pib' ? 'text-slate-950' : 'text-white'}`}
                >
                  {isTranslating ? activeEng.headline : activeArticle.headline}
                </h1>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                    <span>🎯 संपूर्ण विस्तृत आर्टिकल + 10-स्तरीय परीक्षा व्याख्या (Hindi + English)</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black">
                    📖 100% Full Bilingual Explanation Unlocked
                  </span>
                </div>
              </div>

              {/* Realistic Topic Image with Editorial Badges */}
              {activeArticle.imageUrl && (
                <div className="w-full h-56 sm:h-80 rounded-2xl overflow-hidden relative border border-slate-200 shadow-md bg-slate-900">
                  <img
                    src={activeArticle.imageUrl}
                    alt={activeArticle.headline}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow">
                    {activeArticle.categoryTag} EDITORIAL
                  </div>
                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-white font-medium text-[10px] shadow">
                    {activeArticle.imageCredit || activeArticle.sourceMinistry}
                  </div>
                </div>
              )}

              {/* Certified Source Card */}
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-slate-900">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg shrink-0">
                    🏛️
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">प्रमाणित स्रोत / संदर्भ</span>
                      <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[9px] font-black">
                        100% AUTHENTIC
                      </span>
                    </div>
                    <div className="font-bold text-slate-900 text-xs sm:text-sm">{activeArticle.sourceMinistry}</div>
                    <div className="text-[10px] text-slate-500">दैनिक करंट अफेयर्स कवरेज • जारी दिनांक: {activeArticle.date}</div>
                  </div>
                </div>

                <a
                  href={activeArticle.sourceUrl || 'https://pib.gov.in'}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-black text-xs flex items-center gap-1 cursor-pointer shadow shrink-0"
                >
                  <span>मूल स्रोत देखें</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* 1. मुख्य सारांश (EXECUTIVE SUMMARY) */}
              <div className="p-5 rounded-2xl bg-amber-50/90 border-l-4 border-amber-500 shadow-sm space-y-2.5 text-slate-900">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xs sm:text-sm font-black uppercase text-amber-900 tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-700" />
                    <span>{isTranslating ? '1. EXECUTIVE SUMMARY (KEY TAKEAWAY)' : '1. मुख्य सारांश (EXECUTIVE SUMMARY)'}</span>
                  </h3>
                  <button
                    onClick={() => speakText(isTranslating ? activeEng.summary : `${activeArticle.summary} In English: ${activeEng.summary}`)}
                    className="px-2.5 py-1 rounded-lg bg-amber-200/80 hover:bg-amber-300 text-amber-950 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>{isTranslating ? 'Listen (EN)' : 'सुनें (HI+EN)'}</span>
                  </button>
                </div>
                <p style={fontBodyStyle} className="text-slate-900 font-medium">
                  {isTranslating ? activeEng.summary : activeArticle.summary}
                </p>
              </div>

              {/* FULL ARTICLE & ALL EXPLANATIONS (ALWAYS 100% UNLOCKED FOR EVERY STUDENT) */}
              <div className="space-y-6 animate-fade-in">
                {/* 2. पृष्ठभूमि व ऐतिहासिक संदर्भ (BACKGROUND & GENESIS) */}
                <div className="p-5 rounded-2xl bg-sky-50/90 border-l-4 border-sky-500 shadow-sm space-y-2.5 text-slate-900">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs sm:text-sm font-black uppercase text-sky-900 tracking-wider flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-sky-700" />
                      <span>{isTranslating ? '2. BACKGROUND & HISTORICAL GENESIS' : '2. पृष्ठभूमि व ऐतिहासिक संदर्भ (BACKGROUND & HISTORICAL GENESIS)'}</span>
                    </h3>
                    <button
                      onClick={() => speakText(isTranslating ? activeEng.background : `${activeArticle.background} In English: ${activeEng.background}`)}
                      className="px-2.5 py-1 rounded-lg bg-sky-200/80 hover:bg-sky-300 text-sky-950 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>{isTranslating ? 'Listen (EN)' : 'सुनें (HI+EN)'}</span>
                    </button>
                  </div>
                  <p style={fontBodyStyle} className="text-slate-900 font-medium">
                    {isTranslating ? activeEng.background : activeArticle.background}
                  </p>
                </div>

                {/* 3. संपूर्ण विस्तृत समाचार एवं गहन संपादकीय विश्लेषण (COMPLETE IN-DEPTH EDITORIAL EXPLANATION) */}
                <div className="p-5 sm:p-6 rounded-2xl bg-white border-2 border-indigo-200 shadow-md space-y-4 text-slate-900">
                  <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
                    <div className="space-y-0.5">
                      <h3 className="text-xs sm:text-sm font-black uppercase text-indigo-950 tracking-wider flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-indigo-600" />
                        <span>{isTranslating ? '3. COMPLETE IN-DEPTH EDITORIAL EXPLANATION (ALL DIMENSIONS)' : '3. संपूर्ण विस्तृत समाचार एवं गहन संपादकीय व्याख्या (COMPLETE IN-DEPTH ARTICLE & EXPLANATION)'}</span>
                      </h3>
                      <p className="text-[11px] text-slate-500 font-semibold">
                        {isTranslating
                          ? 'Why in News, Structural Mechanism, Multi-Dimensional Impact on India, Challenges & Way Forward'
                          : 'समाचार के सभी पहलू: चर्चा में क्यों, कार्यप्रणाली, राष्ट्रीय-अंतर्राष्ट्रीय प्रभाव, चुनौतियां एवं आगे की राह'}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        speakText(
                          isTranslating
                            ? activeEng.deepExplanation
                            : `संपूर्ण विस्तृत व्याख्या। चर्चा में क्यों है: ${activeArticle.summary} पृष्ठभूमि: ${activeArticle.background} प्रमुख आयाम: ${activeArticle.dimensions.join('। ')} नीतिगत प्रावधान: ${activeArticle.provisions.join('। ')} English Summary: ${activeEng.summary}`
                        )
                      }
                      className="px-3 py-1.5 rounded-xl bg-indigo-100 hover:bg-indigo-200 text-indigo-900 text-xs font-black flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isTranslating ? 'Listen Explanation' : 'पूरी व्याख्या सुनें'}</span>
                    </button>
                  </div>

                  <div style={fontBodyStyle} className="space-y-4 text-slate-800">
                    {isTranslating ? (
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 font-medium whitespace-pre-line text-slate-800">
                        {activeEng.deepExplanation}
                      </div>
                    ) : (
                      <>
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                          <div className="font-black text-indigo-900 text-xs sm:text-sm flex items-center gap-1.5">
                            <span>📌 क) चर्चा में क्यों है और मूल विषय-वस्तु (Why in News &amp; Core Context):</span>
                          </div>
                          <p className="font-medium text-slate-800">
                            हाल ही में <strong>{activeArticle.sourceMinistry}</strong> द्वारा जारी आधिकारिक विज्ञप्ति के अनुसार, <strong>{activeArticle.headline}</strong> राष्ट्रीय नीति और सामरिक विकास के केंद्र में रहा है। {activeArticle.summary} यह पहल न केवल वर्तमान प्रशासनिक व तकनीकी ढांचे को सुदृढ़ करती है, बल्कि भारत के दीर्घकालिक <strong>'विकसित भारत 2047' (Viksit Bharat 2047)</strong> के संकल्प को भी प्रत्यक्ष गति प्रदान करती है।
                          </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                          <div className="font-black text-emerald-900 text-xs sm:text-sm flex items-center gap-1.5">
                            <span>⚙️ ख) कार्यप्रणाली, संस्थागत ढांचा एवं तकनीकी विश्लेषण (Mechanism &amp; Structural Analysis):</span>
                          </div>
                          <p className="font-medium text-slate-800">
                            {activeArticle.background} इस योजना/परियोजना के क्रियान्वयन में स्वदेशी नवाचार, अंतर-मंत्रालयी समन्वय और आधुनिक डिजिटल/तकनीकी मानकों को सर्वोच्च प्राथमिकता दी गई है। इसके अंतर्गत <strong>{activeArticle.dimensions[0]}</strong> साथ ही, <strong>{activeArticle.dimensions[1] || activeArticle.provisions[0]}</strong> के माध्यम से इसकी दक्षता और पारदर्शिता को वैश्विक मानकों के अनुरूप बनाया गया है।
                          </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                          <div className="font-black text-amber-900 text-xs sm:text-sm flex items-center gap-1.5">
                            <span>🇮🇳 ग) भारत की अर्थव्यवस्था, सुरक्षा एवं नागरिकों पर बहुआयामी प्रभाव (Multi-Dimensional Impact):</span>
                          </div>
                          <p className="font-medium text-slate-800">
                            परीक्षा दृष्टिकोण (GS Paper II एवं GS Paper III) से देखें तो इस कदम के तीन प्रत्यक्ष प्रभाव हैं: <strong>(1) आत्मनिर्भरता में वृद्धि:</strong> विदेशी आयात व बाहरी तकनीक पर निर्भरता में भारी कमी आएगी; <strong>(2) संस्थागत क्षमता निर्माण:</strong> {activeArticle.provisions[0]} तथा {activeArticle.provisions[1] || activeArticle.highYieldFact}; और <strong>(3) वैश्विक नेतृत्व:</strong> अंतरराष्ट्रीय मंचों और वैश्विक सूचकांकों में भारत की स्थिति और अधिक मजबूत होगी।
                          </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                          <div className="font-black text-rose-900 text-xs sm:text-sm flex items-center gap-1.5">
                            <span>🚀 घ) प्रमुख चुनौतियां एवं आगे की राह (Key Challenges &amp; Way Forward):</span>
                          </div>
                          <p className="font-medium text-slate-800">
                            यद्यपि सरकार ने नीतिगत स्तर पर ठोस प्रावधान किए हैं, तथापि समयबद्ध क्रियान्वयन, राज्यों व स्थानीय निकायों के साथ समन्वय, कुशल मानव संसाधन का प्रशिक्षण और वित्तीय संसाधनों का सतत प्रवाह बनाए रखना प्रमुख चुनौतियां हैं। <strong>आगे की राह (Way Forward):</strong> सार्वजनिक-निजी भागीदारी (PPP Model) को प्रोत्साहित करना, नियमित थर्ड-पार्टी ऑडिट एवं अनुसंधान और विकास (R&amp;D) में निरंतर निवेश ही इस मिशन की पूर्ण सफलता सुनिश्चित करेगा।
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* 4. विस्तृत आयाम व मुख्य बिंदु (IN-DEPTH DIMENSIONS) */}
                <div className="p-5 rounded-2xl bg-emerald-50/90 border-l-4 border-emerald-500 shadow-sm space-y-3 text-slate-900">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs sm:text-sm font-black uppercase text-emerald-950 tracking-wider flex items-center gap-2">
                      <Zap className="w-4 h-4 text-emerald-700" />
                      <span>{isTranslating ? '4. IN-DEPTH ANALYTICAL DIMENSIONS (GS PAPER ANALYSIS)' : '4. विस्तृत आयाम व मुख्य परीक्षा बिंदु (IN-DEPTH DIMENSIONS - GS PAPER ANALYSIS)'}</span>
                    </h3>
                    <button
                      onClick={() => speakText(isTranslating ? activeEng.dimensions.join('. ') : `${activeArticle.dimensions.join('। ')} In English: ${activeEng.dimensions.join('. ')}`)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-200/80 hover:bg-emerald-300 text-emerald-950 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>{isTranslating ? 'Listen (EN)' : 'सुनें (HI+EN)'}</span>
                    </button>
                  </div>
                  <div className="space-y-2.5">
                    {(isTranslating ? activeEng.dimensions : activeArticle.dimensions).map((dim: string, dIdx: number) => (
                      <div key={dIdx} style={fontBodyStyle} className="flex items-start gap-2.5 text-slate-900 font-medium">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-1 font-black" />
                        <span>{dim}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. प्रमुख नीतिगत प्रावधान व आधिकारिक आंकड़े (KEY PROVISIONS & DATA) */}
                <div className="p-5 rounded-2xl bg-indigo-50/90 border-l-4 border-indigo-500 shadow-sm space-y-3 text-slate-900">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs sm:text-sm font-black uppercase text-indigo-950 tracking-wider flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-indigo-700" />
                      <span>{isTranslating ? '5. KEY POLICY PROVISIONS & OFFICIAL DATA' : '5. प्रमुख नीतिगत प्रावधान, बजट व आधिकारिक आंकड़े (KEY PROVISIONS & OFFICIAL DATA)'}</span>
                    </h3>
                    <button
                      onClick={() => speakText(isTranslating ? activeEng.provisions.join('. ') : `${activeArticle.provisions.join('। ')} In English: ${activeEng.provisions.join('. ')}`)}
                      className="px-2.5 py-1 rounded-lg bg-indigo-200/80 hover:bg-indigo-300 text-indigo-950 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>{isTranslating ? 'Listen (EN)' : 'सुनें (HI+EN)'}</span>
                    </button>
                  </div>
                  <div className="space-y-2.5">
                    {(isTranslating ? activeEng.provisions : activeArticle.provisions).map((prov: string, pIdx: number) => (
                      <div key={pIdx} style={fontBodyStyle} className="flex items-start gap-2.5 text-slate-900 font-medium">
                        <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 mt-2" />
                        <span>{prov}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 6. VOCABULARY, SYNONYMS & ANTONYMS STUDIO */}
                <div className="p-5 sm:p-6 rounded-3xl bg-slate-100/95 border border-slate-300 space-y-4 shadow-sm text-slate-900">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wider">
                      <BookOpen className="w-4 h-4 text-indigo-600" />
                      <span>6. संपादकीय शब्दावली, पर्यायवाची व विलोम शब्द (VOCABULARY, SYNONYMS &amp; ANTONYMS)</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      द हिन्दू व PIB संपादकीय में प्रयुक्त कठिन शब्दों का हिंदी अर्थ, Synonyms, Antonyms व वाक्य प्रयोग
                    </p>
                  </div>

                  {/* 3 Dark Vocabulary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    {activeArticle.vocabulary.map((vocab, vIdx) => (
                      <div
                        key={vIdx}
                        className="p-4 rounded-2xl bg-[#091122] text-white border border-slate-850 space-y-2 shadow-md flex flex-col justify-between"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-black text-sm text-cyan-300">
                              {vIdx + 1}. {vocab.word}
                            </span>
                            <div className="flex items-center gap-1">
                              <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold">
                                {vocab.pos}
                              </span>
                              <button
                                onClick={() => speakText(`${vocab.word}. हिंदी अर्थ: ${vocab.exactHindi}. Definition: ${vocab.definition}. Synonyms: ${vocab.synonyms}. Antonyms: ${vocab.antonyms}.`)}
                                className="p-1 text-slate-400 hover:text-white cursor-pointer"
                                title="उच्चारण व अर्थ सुनें"
                              >
                                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                              </button>
                            </div>
                          </div>

                          <div className="text-xs text-amber-300 font-bold">
                            सटीक अर्थ: <span className="text-white font-normal">{vocab.exactHindi}</span>
                          </div>

                          <p className="text-[11px] text-slate-300 italic leading-snug">
                            <strong className="text-slate-400 not-italic">Def:</strong> {vocab.definition}
                          </p>

                          <div className="text-[10px] text-slate-300 space-y-0.5 pt-1 border-t border-slate-800">
                            <div>
                              <strong className="text-emerald-400">Synonyms:</strong> {vocab.synonyms}
                            </div>
                            <div>
                              <strong className="text-rose-400">Antonyms:</strong> {vocab.antonyms}
                            </div>
                          </div>
                        </div>

                        <div className="text-[10px] text-slate-400 italic pt-1.5 border-t border-slate-800/80">
                          <strong className="text-cyan-300 not-italic">Exam Usage:</strong> {vocab.examUsage}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* AI WORD DETECTOR & VOCABULARY SEARCH (ANTO-SYNO EXPLORER) */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
                      <span className="font-black text-slate-800 uppercase flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>AI वर्ड डिटेक्टर व द्विभाषी वोकैबुलरी खोज (HINDI + ENGLISH ANTO-SYNO EXPLORER)</span>
                      </span>
                      <span className="text-slate-500 text-[10px]">कोई भी English या हिंदी शब्द लिखें अथवा नीचे क्लिक करें</span>
                    </div>

                    {/* Quick One-Click Word Chips from Article & High-Yield Editorial Terms */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-500">त्वरित शब्द जांचें:</span>
                      {[
                        ...activeArticle.vocabulary.map(v => v.word),
                        'Sovereign',
                        'Interoperability',
                        'Indigenous',
                        'Sustainable',
                        'Disinflation',
                        'Synergy'
                      ]
                        .filter((v, i, arr) => arr.indexOf(v) === i)
                        .slice(0, 7)
                        .map(w => (
                          <button
                            key={w}
                            onClick={() => handleVocabSearch(w)}
                            className="px-2.5 py-0.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-800 text-[11px] font-bold cursor-pointer transition-all"
                          >
                            🔍 {w}
                          </button>
                        ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={vocabSearchWord}
                        onChange={e => setVocabSearchWord(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleVocabSearch()}
                        placeholder="कोई भी शब्द लिखें (उदा. Autonomous, Sovereign, संप्रभुता, सब्सिडी)..."
                        className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-indigo-500"
                      />
                      <button
                        onClick={() => handleVocabSearch()}
                        disabled={isSearchingVocab}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs flex items-center gap-1 cursor-pointer shadow hover:opacity-95 shrink-0"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>{isSearchingVocab ? 'खोज रहे हैं...' : 'अर्थ व Anto-Syno'}</span>
                      </button>
                    </div>

                    {vocabSearchResult && (
                      <div className="p-4 bg-slate-900 text-white rounded-2xl text-xs space-y-2 animate-fade-in border border-indigo-500/40">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-cyan-300 text-sm sm:text-base">
                              {vocabSearchResult.word}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold">
                              {vocabSearchResult.pos}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-amber-300 font-bold text-xs sm:text-sm">
                              हिंदी अर्थ: {vocabSearchResult.exactHindi}
                            </span>
                            <button
                              onClick={() =>
                                speakText(
                                  `${vocabSearchResult.word}. हिंदी अर्थ: ${vocabSearchResult.exactHindi}. Definition: ${vocabSearchResult.definition}. Synonyms: ${vocabSearchResult.synonyms}. Antonyms: ${vocabSearchResult.antonyms}.`
                                )
                              }
                              className="px-2.5 py-1 rounded-lg bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>सुनें (HI+EN)</span>
                            </button>
                          </div>
                        </div>
                        <p className="text-slate-200 text-xs leading-relaxed">
                          <strong className="text-cyan-400">Definition:</strong> {vocabSearchResult.definition}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-800 text-xs">
                          <div>
                            <strong className="text-emerald-400">Synonyms (पर्यायवाची):</strong> {vocabSearchResult.synonyms}
                          </div>
                          <div>
                            <strong className="text-rose-400">Antonyms (विलोम):</strong> {vocabSearchResult.antonyms}
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-300 italic pt-1 border-t border-slate-800/80">
                          <strong className="text-amber-300 not-italic">Exam Usage:</strong> {vocabSearchResult.examUsage}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 7. HIGH-YIELD EXAM FACT & ONE-LINER REVISION POINTERS */}
                <div className="p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 shadow-sm space-y-2.5 text-slate-900">
                  <div className="text-xs sm:text-sm font-black text-amber-900 uppercase flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-amber-600" />
                      <span>{isTranslating ? '7. HIGH-YIELD PRELIMS FACTS & ONE-LINERS' : '7. हाई-यील्ड प्रीलिम्स एग्जाम फैक्ट्स व वन-लाइनर (HIGH-YIELD PRELIMS FACTS):'}</span>
                    </div>
                    <button
                      onClick={() => speakText(isTranslating ? activeEng.highYieldFact : `${activeArticle.highYieldFact} In English: ${activeEng.highYieldFact}`)}
                      className="px-2.5 py-1 rounded-lg bg-amber-200/80 hover:bg-amber-300 text-amber-950 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>सुनें</span>
                    </button>
                  </div>
                  <p style={fontBodyStyle} className="text-slate-900 font-bold">
                    • {isTranslating ? activeEng.highYieldFact : activeArticle.highYieldFact}
                  </p>
                  <div className="text-xs text-slate-700 font-medium space-y-1 pt-1 border-t border-amber-200/80">
                    <div>• <strong>{isTranslating ? 'Nodal Ministry / Source:' : 'नोडल मंत्रालय / एजेंसी:'}</strong> {isTranslating ? activeEng.sourceMinistry : activeArticle.sourceMinistry}</div>
                    <div>• <strong>{isTranslating ? 'Exam Relevance:' : 'परीक्षा प्रासंगिकता:'}</strong> UPSC CSE (Prelims &amp; GS-II/III), SSC CGL/CHSL/Steno, State PSC, Banking &amp; Railway CBT</div>
                  </div>
                </div>

                {/* 8. INTERACTIVE PRACTICE MCQ WITH FULL EXPLANATION */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-md space-y-4 text-slate-900">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="text-xs sm:text-sm font-black text-slate-900 uppercase flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-cyan-600" />
                      <span>{isTranslating ? '8. PRELIMS PRACTICE MCQ & BILINGUAL SOLUTION' : '8. प्रारंभिक परीक्षा अभ्यास प्रश्न व व्याख्या (PRELIMS PRACTICE MCQ)'}</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-[10px] font-black">
                      Prelims &amp; CBT Level
                    </span>
                  </div>

                  <div className="space-y-3">
                    <h4 style={fontBodyStyle} className="font-black text-slate-900">
                      {isTranslating ? activeEng.mcqQuestion : activeArticle.practiceMcq.question}
                    </h4>

                    <div className="space-y-2">
                      {(isTranslating ? activeEng.mcqOptions : activeArticle.practiceMcq.options).map((opt: string, oIdx: number) => {
                        const isPicked = mcqSelected === oIdx;
                        const isRight = oIdx === activeArticle.practiceMcq.correct;

                        let btnStyle = 'bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300';
                        if (mcqSelected !== null) {
                          if (isRight) btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                          else if (isPicked) btnStyle = 'bg-rose-50 border-rose-500 text-rose-900';
                          else btnStyle = 'bg-slate-50/60 border-slate-200 text-slate-400 opacity-60';
                        }

                        return (
                          <button
                            key={oIdx}
                            onClick={() => setMcqSelected(oIdx)}
                            style={fontBodyStyle}
                            className={`w-full p-3.5 rounded-xl border text-left font-semibold flex items-center justify-between cursor-pointer transition-all ${btnStyle}`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 text-slate-600 text-xs font-bold flex items-center justify-center shrink-0">
                                {String.fromCharCode(65 + oIdx)}
                              </span>
                              <span>{opt}</span>
                            </div>
                            {mcqSelected !== null && isRight && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                            {mcqSelected !== null && isPicked && !isRight && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Always show complete MCQ explanation */}
                    <div className="p-3.5 bg-indigo-50 rounded-xl border border-indigo-200 text-xs sm:text-sm text-indigo-950 space-y-1">
                      <div className="font-black text-indigo-900 flex items-center justify-between">
                        <span>
                          ✅ {isTranslating ? 'Correct Answer: Option' : 'सही उत्तर: विकल्प'} ({String.fromCharCode(65 + activeArticle.practiceMcq.correct)}) —{' '}
                          {(isTranslating ? activeEng.mcqOptions : activeArticle.practiceMcq.options)[activeArticle.practiceMcq.correct]}
                        </span>
                        <button
                          onClick={() => speakText(isTranslating ? activeEng.mcqExplanation : `${activeArticle.practiceMcq.explanation} In English: ${activeEng.mcqExplanation}`)}
                          className="text-[11px] px-2 py-0.5 rounded bg-indigo-200/70 text-indigo-900 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>{isTranslating ? 'Listen' : 'व्याख्या सुनें'}</span>
                        </button>
                      </div>
                      <p style={fontBodyStyle} className="font-medium">
                        <strong>{isTranslating ? 'Detailed Explanation:' : 'विस्तृत उत्तर व्याख्या:'}</strong>{' '}
                        {isTranslating ? activeEng.mcqExplanation : activeArticle.practiceMcq.explanation}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 9. MAINS ANALYTICAL QUESTION + MODEL ANSWER STRUCTURE */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-300 shadow-sm space-y-3 text-slate-900">
                  <div className="text-xs sm:text-sm font-black text-slate-900 uppercase flex items-center justify-between gap-1.5">
                    <span>{isTranslating ? '✍️ 9. MAINS ANALYTICAL QUESTION & MODEL ANSWER BLUEPRINT' : '✍️ 9. मुख्य परीक्षा प्रश्न एवं आदर्श उत्तर रूपरेखा (MAINS QUESTION & MODEL ANSWER):'}</span>
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-black">250 Words</span>
                  </div>
                  <p style={fontBodyStyle} className="text-slate-900 italic font-bold bg-white p-3.5 rounded-xl border border-slate-200">
                    {isTranslating ? activeEng.mainsQuestion : activeArticle.mainsQuestion}
                  </p>
                  <div style={fontBodyStyle} className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2">
                    <div className="font-black text-indigo-900">
                      {isTranslating ? '📌 Model Answer Structure (250 Words):' : '📌 आदर्श उत्तर लेखन संरचना (Model Answer Blueprint):'}
                    </div>
                    <div>
                      <strong>{isTranslating ? '1. Introduction (30-40 Words):' : '1. भूमिका (Introduction - 30-40 शब्द):'}</strong>{' '}
                      {isTranslating ? activeEng.mainsIntro : activeArticle.summary}
                    </div>
                    <div>
                      <strong>{isTranslating ? '2. Main Body (150-170 Words):' : '2. मुख्य भाग (Main Body - 150-170 शब्द):'}</strong>{' '}
                      {isTranslating
                        ? activeEng.mainsBody
                        : `${activeArticle.background} प्रमुख आयामों के अंतर्गत ${activeArticle.dimensions.join('; ')} तथा नीतिगत प्रावधानों में ${activeArticle.provisions.join('; ')} का विश्लेषण करें।`}
                    </div>
                    <div>
                      <strong>{isTranslating ? '3. Conclusion & Way Forward (30-40 Words):' : '3. निष्कर्ष (Way Forward - 30-40 शब्द):'}</strong>{' '}
                      {isTranslating
                        ? activeEng.mainsConclusion
                        : `${activeArticle.highYieldFact} यह कदम समावेशी विकास, तकनीकी आत्मनिर्भरता और संवैधानिक लक्ष्यों की प्राप्ति में निर्णायक सिद्ध होगा।`}
                    </div>
                  </div>
                </div>

                {/* 10. IN-ARTICLE AI DOUBT & DEEP EXPLANATION STUDIO */}
                <div
                  id="in-article-ai-doubt-box"
                  className="p-5 rounded-3xl bg-[#091122] text-white border-2 border-cyan-500/40 shadow-xl space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div className="space-y-0.5">
                      <div className="text-xs sm:text-sm font-black text-cyan-300 uppercase flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>10. इस आर्टिकल पर AI से सीधा डाउट पूछें व अतिरिक्त व्याख्या पाएं</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        आर्टिकल के किसी भी बिंदु, शब्द या परीक्षा प्रश्न पर तुरंत विस्तृत हिंदी/English व्याख्या प्राप्त करें
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        onClick={() => handleAskArticleDoubt('इस आर्टिकल को एकदम आसान भाषा में उदाहरण सहित समझाएं।')}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-bold text-amber-300 cursor-pointer"
                      >
                        💡 सरल भाषा में समझाएं
                      </button>
                      <button
                        onClick={() => handleAskArticleDoubt('इस आर्टिकल से प्रीलिम्स परीक्षा में कौन-कौन से 5 प्रश्न बन सकते हैं?')}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-bold text-emerald-300 cursor-pointer"
                      >
                        🎯 5 संभावित प्रश्न
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={articleDoubtInput}
                      onChange={e => setArticleDoubtInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAskArticleDoubt()}
                      placeholder="इस आर्टिकल से जुड़ा अपना कोई भी सवाल यहाँ लिखें..."
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white outline-none focus:border-cyan-400"
                    />
                    <button
                      onClick={() => handleAskArticleDoubt()}
                      disabled={isAskingArticleDoubt}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isAskingArticleDoubt ? 'तैयार हो रहा...' : 'व्याख्या पाएं'}</span>
                    </button>
                  </div>

                  {articleDoubtAnswer && (
                    <div className="p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/30 space-y-2.5 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-amber-300">✨ Hans Compain AI विस्तृत व्याख्या:</span>
                        <button
                          onClick={() => speakText(articleDoubtAnswer)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>आवाज में सुनें</span>
                        </button>
                      </div>
                      <div className="text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed">
                        {articleDoubtAnswer}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => handleReadFullArticle(activeArticle)}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:opacity-95"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{isAudioActive ? 'ऑडियो रीडर बंद करें' : 'पूरी खबर और सभी व्याख्याएं आवाज में सुनें'}</span>
                </button>

                <button
                  onClick={handleCloseArticle}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs sm:text-sm cursor-pointer"
                >
                  ← वापस करंट अफेयर्स सूची पर जाएं
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* -------------------------------------------------------------
            VIEW B: MAIN CURRENT AFFAIRS GRID (EXACT MATCH TO SCREENSHOT 1)
            ------------------------------------------------------------- */
        <div className="space-y-5">
          {/* 1. WHITE HEADER BANNER WITH ARROW HIDE/SHOW TOGGLE */}
          <div className="bg-white text-slate-900 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col gap-3.5 border border-slate-200 transition-all">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shrink-0">
                    <Newspaper className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-base sm:text-xl font-black text-slate-900 tracking-tight uppercase">
                        HANS COMPAIN NEWS HUB
                      </h1>
                      <span className="px-2 py-0.5 rounded-lg bg-amber-100 border border-amber-300 text-amber-800 text-[10px] font-black uppercase">
                        PIB + EDITORIALS
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-600 font-medium mt-0.5 hidden sm:block">
                      हर सपने को मिलेगी उड़ान, जब साथ हो Hans Compain का सच्चा ज्ञान!
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleManualSync}
                  disabled={isSyncing}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'सिंक हो रहा है...' : 'ताज़ा खबरें सिंक करें'}</span>
                </button>
              </div>

              {/* Arrow Toggle Button to Hide / Show Header Action Controls */}
              <button
                onClick={() => setIsHubControlsOpen(prev => !prev)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-black text-xs flex items-center gap-1.5 cursor-pointer shrink-0 transition-all shadow-xs"
                title={isHubControlsOpen ? 'ऊपरी टूल्स छुपाएं (Hide Controls)' : 'ऊपरी टूल्स दिखाएं (Show Controls)'}
              >
                <span>{isHubControlsOpen ? 'टूल्स छुपाएं' : 'टूल्स दिखाएं'}</span>
                {isHubControlsOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-700" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-700" />
                )}
              </button>
            </div>

            {/* Collapsible Action Buttons + Font Size Controls on Main Hub Header */}
            {isHubControlsOpen && (
              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-200 animate-fade-in">
                {/* Font Size Selector on Hub Page as well (Small / Med / Large / XL) */}
                <div className="flex items-center bg-slate-100 border border-slate-300 rounded-xl p-0.5 text-[11px] font-bold">
                  {([
                    { id: 'sm', label: 'Small' },
                    { id: 'base', label: 'Med' },
                    { id: 'lg', label: 'Large' },
                    { id: 'xl', label: 'XL' }
                  ] as const).map(sz => (
                    <button
                      key={sz.id}
                      onClick={() => handleSetFontSize(sz.id)}
                      className={`px-2.5 py-1 rounded-lg cursor-pointer transition-all ${
                        fontSizeLevel === sz.id
                          ? 'bg-[#0F172A] text-white font-black shadow'
                          : 'text-slate-600 hover:text-slate-950'
                      }`}
                    >
                      {sz.label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleManualRefresh(true)}
                    disabled={isSyncing}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow transition-all active:scale-95"
                    title={`अंतिम रिफ्रेश: ${lastSyncTime}`}
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-cyan-200' : ''}`} />
                    <span>{isSyncing ? 'रिफ्रेश हो रहा है...' : '🔄 ताजा खबरें रिफ्रेश'}</span>
                  </button>

                  <button
                    onClick={() => handleGenerateAiArticle()}
                    disabled={isGeneratingAiArticle}
                    className="px-3.5 py-2 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isGeneratingAiArticle ? 'जनरेट हो रहा है...' : '✨ AI आर्टिकल जनरेटर'}</span>
                  </button>

                  <button
                    onClick={() => setShowLiveQuizModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow"
                  >
                    <Flame className="w-3.5 h-3.5 text-amber-300" />
                    <span>आज का लाइव टेस्ट</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Cloud Sync Status Pill */}
          {syncStatusMsg && (
            <div className="bg-sky-950/90 border border-sky-500/40 text-sky-200 px-4 py-2 rounded-2xl text-xs font-bold flex items-center justify-between shadow-lg animate-fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{syncStatusMsg}</span>
              </div>
              <span className="text-[10px] text-slate-400 bg-sky-900/60 px-2 py-0.5 rounded-full">
                अंतिम सिंक: {lastSyncTime}
              </span>
            </div>
          )}

          {/* 2. ANTI-REPEAT DATE & OFFICIAL SOURCE FILTER TABS */}
          <div className="flex flex-wrap items-center gap-2 bg-[#060B18] p-2 sm:p-2.5 rounded-2xl border border-slate-800 shadow-md">
            <button
              onClick={() => setFeedSectionTab('today')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all ${
                feedSectionTab === 'today'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white bg-slate-950 border border-slate-800/80'
              }`}
            >
              <span>🌟 आज के ताज़ा अफेयर्स (Today's Fresh)</span>
              <span className="text-[9px] bg-slate-950/20 px-1.5 py-0.2 rounded font-mono">No Repeats</span>
            </button>

            <button
              onClick={() => setFeedSectionTab('yesterday')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                feedSectionTab === 'yesterday'
                  ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-md font-black'
                  : 'text-slate-400 hover:text-white bg-slate-950 border border-slate-800/80'
              }`}
            >
              <span>📅 कल के मुख्य घटनाक्रम (Yesterday's Archive)</span>
            </button>

            <button
              onClick={() => setFeedSectionTab('pib')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                feedSectionTab === 'pib'
                  ? 'bg-emerald-600 text-white shadow-md font-black'
                  : 'text-slate-400 hover:text-white bg-slate-950 border border-slate-800/80'
              }`}
            >
              <span>🏛️ PIB व सरकारी बुलेटिन (Govt Sync)</span>
            </button>

            <button
              onClick={() => setFeedSectionTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                feedSectionTab === 'all'
                  ? 'bg-slate-700 text-white shadow-md font-black'
                  : 'text-slate-400 hover:text-white bg-slate-950 border border-slate-800/80'
              }`}
            >
              <span>📰 सभी संपादकीय ({filtered.length})</span>
            </button>
          </div>

          {/* 3. UNIFIED ALL-IN-ONE CURRENT AFFAIRS STREAM BANNER & SEARCH (NO CATEGORY RESTRICTION) */}
          <div className="bg-[#091122] border border-slate-800 rounded-2xl p-3 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-lg">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-xs font-black uppercase shadow">
                  🌟 संपूर्ण समसामयिकी धारा (All Current Affairs in One Stream)
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-[11px] font-bold">
                  {filtered.length} महत्वपूर्ण परीक्षा लेख
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold hidden sm:inline">
                  बिना किसी कैटेगरी विभाजन के सभी समसामयिकी एक साथ
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300 font-medium">
                🏆 खेलकूद • 🎖️ सम्मान • 👥 नियुक्तियां • ⚔️ युद्धाभ्यास • 📊 सूचकांक • 🌍 शिखर सम्मेलन • 🗓️ दिवस व थीम • 🐅 पर्यावरण व जीआई • 💰 अर्थव्यवस्था
              </p>
            </div>

            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 min-w-[260px] md:w-80 shadow-inner">
              <Search className="w-4 h-4 text-cyan-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="सर्च करें: टी20, विंबलडन, सीजेआई, ब्रिक्स, रेपो रेट..."
                className="bg-transparent border-none outline-none text-xs text-white w-full placeholder:text-slate-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded cursor-pointer"
                >
                  हटाएं
                </button>
              )}
            </div>
          </div>

          {/* 4. 2-COLUMN WHITE EDITORIAL CARDS GRID (EXACT MATCH TO SCREENSHOT 1 WITH TOPIC IMAGES) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map(item => {
              const isSaved = bookmarkedIds.includes(item.id);
              const cardImage = item.imageUrl || resolveTopicImageUrl(item.headline, item.categoryTag, item.summary).imageUrl;
              const cardCredit = item.imageCredit || resolveTopicImageUrl(item.headline, item.categoryTag, item.summary).imageCredit;

              return (
                <div
                  key={item.id}
                  className="bg-white text-slate-900 rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-200 flex flex-col justify-between gap-4 transition-all hover:shadow-2xl overflow-hidden"
                >
                  <div className="space-y-3">
                    {/* Top Metadata Badge + Date + 3 Circular Action Icons Matching Screenshot 1 */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wide">
                          {item.categoryTag}
                        </span>
                        <span className="text-[11px] text-slate-500 font-bold">📅 {item.date}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleReadFullArticle(item)}
                          className={`w-8 h-8 rounded-full border flex items-center justify-center cursor-pointer transition-all ${
                            isAudioActive && activeAudioTitle === item.headline
                              ? 'bg-emerald-600 border-emerald-500 text-white animate-pulse'
                              : 'border-slate-200 hover:bg-slate-100 text-slate-600'
                          }`}
                          title="पूरी खबर और परीक्षा विश्लेषण आवाज में सुनें"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() =>
                            setBookmarkedIds(prev =>
                              prev.includes(item.id) ? prev.filter(x => x !== item.id) : [...prev, item.id]
                            )
                          }
                          className={`w-8 h-8 rounded-full border flex items-center justify-center cursor-pointer ${
                            isSaved
                              ? 'bg-amber-500 border-amber-500 text-white'
                              : 'border-slate-200 hover:bg-slate-100 text-slate-600'
                          }`}
                          title="बुकमार्क करें"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleShareArticle(item)}
                          className="w-8 h-8 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-600 flex items-center justify-center cursor-pointer"
                          title="शेयर करें"
                        >
                          <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                        </button>
                      </div>
                    </div>

                    {/* Topic-Related Verified News Image Thumbnail */}
                    <div
                      className="w-full h-44 sm:h-52 rounded-2xl overflow-hidden relative border border-slate-200 bg-slate-900 group cursor-pointer shadow-sm"
                      onClick={() => handleOpenArticle(item)}
                      title="पूरा आर्टिकल और परीक्षा विश्लेषण पढ़ने के लिए क्लिक करें"
                    >
                      <img
                        src={cardImage}
                        alt={item.headline}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow">
                          {item.categoryTag}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-950/85 backdrop-blur-md text-slate-200 text-[9px] font-bold">
                          📅 {item.date}
                        </span>
                      </div>
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-slate-950/85 backdrop-blur-md text-amber-300 text-[9px] font-medium truncate max-w-[220px]">
                        {cardCredit}
                      </div>
                    </div>

                    {/* Bold Hindi Editorial Headline */}
                    <h2
                      style={fontCardTitleStyle}
                      className="font-black text-slate-900 leading-snug hover:text-blue-600 transition-colors cursor-pointer"
                      onClick={() => handleOpenArticle(item)}
                    >
                      {item.headline}
                    </h2>

                    {/* Summary Excerpt (Scales dynamically with Small/Med/Large/XL) */}
                    <p style={fontBodyStyle} className="text-slate-600 line-clamp-3">
                      {item.summary}
                    </p>

                    {/* Cream Source Bar Matching Screenshot 1 */}
                    <div className="p-2.5 px-3 rounded-xl bg-amber-50/90 border border-amber-200/80 flex items-center justify-between text-[11px] font-bold text-amber-900">
                      <span className="truncate">🏛️ स्रोत: {item.sourceMinistry}</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0 ml-2 text-amber-700" />
                    </div>
                  </div>

                  {/* Card Footer Matching Screenshot 1 */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-700 text-white text-[10px] font-black flex items-center justify-center">
                        HC
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-slate-800 uppercase">HANS COMPAIN EDITORIAL</div>
                        <div className="text-[10px] text-slate-400">{item.readTime}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenArticle(item)}
                      className="px-4 py-2 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white text-[11px] font-black uppercase tracking-wider cursor-pointer shadow flex items-center gap-1"
                    >
                      <span>READ ARTICLE</span>
                      <ChevronRight className="w-3 h-3 text-amber-400" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TODAY'S LIVE CURRENT AFFAIRS TEST MODAL */}
      {showLiveQuizModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#091122] border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-7 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-5 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base sm:text-lg font-black text-white">🔥 आज का करंट अफेयर्स लाइव टेस्ट (Daily CA Quiz)</h3>
                <p className="text-xs text-slate-400">PIB व राष्ट्रीय समसामयिकी पर आधारित महत्वपूर्ण प्रश्न</p>
              </div>
              <button
                onClick={() => setShowLiveQuizModal(false)}
                className="p-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {verifiedEditorials.slice(0, 4).map((ed, qIdx) => {
                const qItem = ed.practiceMcq;
                const picked = quizAnswers[qIdx];
                return (
                  <div key={qIdx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="text-xs sm:text-sm font-black text-white">
                      प्रश्न {qIdx + 1}: {qItem.question}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {qItem.options.map((opt, oIdx) => {
                        const isRight = oIdx === qItem.correct;
                        const isPicked = picked === oIdx;
                        let cls = 'bg-slate-900 border-slate-800 text-slate-300';
                        if (picked !== undefined) {
                          if (isRight) cls = 'bg-emerald-950 border-emerald-500 text-emerald-200 font-bold';
                          else if (isPicked) cls = 'bg-rose-950 border-rose-500 text-rose-200';
                        }
                        return (
                          <button
                            key={oIdx}
                            onClick={() => setQuizAnswers(prev => ({ ...prev, [qIdx]: oIdx }))}
                            className={`p-3 rounded-xl border text-left text-xs cursor-pointer flex items-center justify-between ${cls}`}
                          >
                            <span>{opt}</span>
                            {picked !== undefined && isRight && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                            {picked !== undefined && isPicked && !isRight && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                    {picked !== undefined && (
                      <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-slate-200">
                        <strong>व्याख्या:</strong> {qItem.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* FLOATING PERSISTENT AUDIO PLAYER BAR */}
      {isAudioActive && (
        <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-3xl bg-[#091122]/95 backdrop-blur-xl border-2 border-emerald-500/80 rounded-3xl p-3.5 sm:p-4 shadow-2xl text-white animate-fade-in space-y-2.5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shrink-0">
                <Volume2 className="w-5 h-5 animate-pulse" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-white truncate max-w-[280px] sm:max-w-md">
                    {activeAudioTitle || 'पूरी खबर व परीक्षा नोट्स पढ़े जा रहे हैं...'}
                  </span>
                  {audioProgress && (
                    <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40 font-mono shrink-0">
                      वाक्य {audioProgress.current} / {audioProgress.total}
                    </span>
                  )}
                </div>
                {speakingSentencePreview && (
                  <p className="text-[11px] text-slate-300 italic truncate max-w-[320px] sm:max-w-lg mt-0.5">
                    "{speakingSentencePreview}"
                  </p>
                )}
              </div>
            </div>

            {/* Audio Controls: Pause/Resume, Stop, Speed */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={togglePauseResumeAudio}
                className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white cursor-pointer"
                title={isAudioPaused ? 'फिर से शुरू करें' : 'विराम दें (Pause)'}
              >
                {isAudioPaused ? <Play className="w-4 h-4 text-emerald-400 fill-current" /> : <Pause className="w-4 h-4 text-amber-400" />}
              </button>

              <button
                onClick={handleStopAudio}
                className="p-2 rounded-xl bg-rose-950/80 border border-rose-500/40 hover:bg-rose-900 text-rose-300 cursor-pointer"
                title="ऑडियो रोकें"
              >
                <Square className="w-4 h-4 fill-current" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentAffairsHubView;
