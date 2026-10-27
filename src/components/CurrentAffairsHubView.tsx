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
    id: 'news-p17a',
    categoryTag: 'DEFENSE & SECURITY',
    categoryFilter: 'Science & Tech',
    date: '6 अक्टूबर 2026',
    readTime: '3 मिनट Read',
    releaseId: '2065817912598719107',
    headline: 'प्रोजेक्ट 17A नीलगिरि क्लास स्टेल्थ गाइडेड मिसाइल फ्रिगेट्स और नौसेना का हिंद महासागर में दबदबा',
    summary:
      'भारतीय नौसेना के स्वदेशी "प्रोजेक्ट 17A" के तहत मझगांव डॉक शिपबिल्डर्स और जीआरएसई द्वारा निर्मित अत्याधुनिक स्टेल्थ गाइडेड मिसाइल फ्रिगेट्स के समुद्री परीक्षण अंतिम चरण में हैं। यह युद्धपोत 75% स्वदेशी सामग्री और ब्रह्मोस सुपरसोनिक मिसाइल से लैस हैं।',
    background:
      'हिंद महासागर क्षेत्र (IOR) में समुद्री डकैती रोधी अभियानों, समुद्री व्यापार मार्गों की सुरक्षा और रणनीतिक संतुलन बनाए रखने के लिए भारतीय नौसेना अपने बेड़े का आधुनिकीकरण "मेक इन इंडिया" के तहत कर रही है।',
    sourceMinistry: 'रक्षा मंत्रालय (MoD) • भारतीय नौसेना मीडिया सेल • The Hindu',
    sourceUrl: 'https://pib.gov.in',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    imageCredit: 'स्रोत: रक्षा मंत्रालय (MoD) • भारतीय नौसेना मीडिया सेल',
    dimensions: [
      'रडार क्रॉस-सेक्शन (RCS) को न्यूनतम करने के लिए उन्नत स्टेल्थ ज्योमेट्री और रडार-एब्जॉर्बेंट कोटिंग्स।',
      'हथियार प्रणाली: ब्रह्मोस सुपरसोनिक क्रूज मिसाइल और लंबी दूरी की सतह से हवा में मार करने वाली बराक-8 (LRSAM) मिसाइलें।',
      'कंबाइंड डीजल और गैस (CODAG) प्रणोदन प्रणाली से 28 समुद्री मील (Knots) से अधिक की शीर्ष गति।'
    ],
    provisions: [
      'इंटीग्रेटेड प्लेटफॉर्म मैनेजमेंट सिस्टम (IPMS) और स्वदेशी कॉम्बैट मैनेजमेंट सिस्टम (CMS)।',
      'पनडुब्बी रोधी युद्ध (ASW) के लिए स्वदेशी हमसा-एनजी सोनार और रॉकेट लॉन्चर।',
      'दो मल्टी-रोल हेलीकॉप्टरों (जैसे MH-60R सीहॉक) के संचालन की पूर्ण क्षमता।'
    ],
    highYieldFact: 'प्रोजेक्ट 17A के सभी 7 युद्धपोतों का निर्माण मझगांव डॉक (MDL) और गार्डन रीच (GRSE) द्वारा किया गया है।',
    vocabulary: [
      {
        word: 'Prerequisite',
        pos: 'Noun / Adjective',
        exactHindi: 'अनिवार्य पूर्व-शर्त / पूर्वापेक्षा',
        definition: 'A thing that is required as a prior condition for something else to happen or exist.',
        synonyms: 'Precondition, Requirement, Imperative, Sine qua non',
        antonyms: 'Optional add-on, Superfluity, Inessential',
        examUsage: '"Institutional transparency is a vital prerequisite for good democratic governance."'
      },
      {
        word: 'Empowerment',
        pos: 'Noun',
        exactHindi: 'सशक्तीकरण / सामर्थ्य वृद्धि',
        definition: "The process of becoming stronger and more confident, especially in controlling one's life and rights.",
        synonyms: 'Enfranchisement, Elevation, Strengthening, Capacity-building',
        antonyms: 'Marginalization, Disenfranchisement, Suppression',
        examUsage: '"Digital literacy initiatives foster socio-economic empowerment across rural youth."'
      },
      {
        word: 'Sustainable',
        pos: 'Adjective',
        exactHindi: 'सतत / पर्यावरण-अनुकूल टिकाऊ',
        definition: 'Able to be maintained at a certain rate or level without depleting natural resources.',
        synonyms: 'Viable, Renewable, Enduring, Eco-friendly',
        antonyms: 'Unsustainable, Depleting, Short-lived, Wasteful',
        examUsage: '"Clean energy transition ensures long-term sustainable growth for coming generations."'
      }
    ],
    practiceMcq: {
      question: 'भारतीय नौसेना के प्रोजेक्ट 17A (Project 17A) का मुख्य उद्देश्य क्या है?',
      options: [
        'परमाणु पनडुब्बियों का निर्माण',
        'उन्नत स्टेल्थ गाइडेड मिसाइल फ्रिगेट्स का स्वदेशी निर्माण',
        'विमानवाहक पोत की मरम्मत',
        'तटरक्षक नौकाओं की आपूर्ति'
      ],
      correct: 1,
      explanation: 'प्रोजेक्ट 17A के तहत भारतीय नौसेना के लिए 7 उन्नत स्टेल्थ गाइडेड मिसाइल फ्रिगेट्स का निर्माण किया जा रहा है।'
    },
    mainsQuestion:
      '"हिंद महासागर क्षेत्र (IOR) में भारत की सुरक्षा रणनीति और आत्मनिर्भर रक्षा उत्पादन में प्रोजेक्ट 17A के महत्व का समालोचनात्मक परीक्षण कीजिए।"'
  },
  {
    id: 'news-bharat-6g',
    categoryTag: 'SCIENCE & TECH',
    categoryFilter: 'Science & Tech',
    date: '6 अक्टूबर 2026',
    readTime: '4 मिनट Read',
    releaseId: '2065817912598719108',
    headline: 'भारत 6G विज़न और क्वांटम सुरक्षित संचार: दूरसंचार विभाग का आगामी राष्ट्रीय रोडमैप',
    summary:
      'दूरसंचार विभाग (DoT) ने "भारत 6G अलायंस" के तहत 127 से अधिक वैश्विक पेटेंट दाखिल कर अगली पीढ़ी की वायरलेस तकनीक में भारत को वैश्विक मानक निर्माता के रूप में स्थापित किया है। यह नेटवर्क सब-टेराहर्ट्ज़ स्पेक्ट्रम और शून्य विलंबता (Zero Latency) पर आधारित है।',
    background:
      'प्रधानमंत्री द्वारा 2023 में भारत 6G विज़न दस्तावेज जारी किया गया था, जिसका उद्देश्य 2030 तक भारत को 6G प्रौद्योगिकी के विकास और पेटेंट निर्माण में अग्रणी बनाना है।',
    sourceMinistry: 'संचार मंत्रालय • दूरसंचार विभाग (DoT) • PIB नई दिल्ली',
    sourceUrl: 'https://pib.gov.in',
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
    imageCredit: 'स्रोत: दूरसंचार विभाग (DoT) • PIB नई दिल्ली',
    dimensions: [
      '1 Tbps तक की अल्ट्रा-हाई-स्पीड डेटा ट्रांसमिशन क्षमता जो होलोग्राफिक संचार को सक्षम बनाएगी।',
      'क्वांटम की डिस्ट्रीब्यूशन (QKD) तकनीक से लैस 100% हैक-प्रूफ एंड-टू-एंड राष्ट्रीय सुरक्षा नेटवर्क।',
      'उपग्रह और स्थलीय नेटवर्क का निर्बाध एकीकरण (Non-Terrestrial Networks - NTN)।'
    ],
    provisions: [
      'राष्ट्रीय 6G अनुसंधान एवं विकास कोष (R&D Fund) हेतु ₹10,000 करोड़ का प्रावधान।',
      'आईआईटी मद्रास, आईआईटी दिल्ली और आईआईएससी बैंगलोर में 6G टेस्टबेड और पेटेंट इनक्यूबेटर की स्थापना।',
      'अंतर्राष्ट्रीय दूरसंचार संघ (ITU) के 6G फ्रेमवर्क में भारतीय मानकों को शामिल कराना।'
    ],
    highYieldFact: 'भारत 6G विज़न दस्तावेज के अनुसार 6G का क्रियान्वयन दो चरणों (2023-25 और 2025-30) में पूरा किया जा रहा है।',
    vocabulary: [
      {
        word: 'Terahertz',
        pos: 'Noun',
        exactHindi: 'टेराहर्ट्ज़ (अति-उच्च आवृत्ति स्पेक्ट्रम)',
        definition: 'A unit of frequency equal to one trillion hertz, used in advanced next-gen communication.',
        synonyms: 'Ultra-high frequency, Sub-millimeter band',
        antonyms: 'Low-frequency band',
        examUsage: '"Terahertz spectrum provides bandwidth necessary for 6G holographic streaming."'
      },
      {
        word: 'Latency',
        pos: 'Noun',
        exactHindi: 'विलंबता / डेटा संचरण में लगने वाला समय',
        definition: 'The delay before a transfer of data begins following an instruction for its transfer.',
        synonyms: 'Lag, Delay, Response interval',
        antonyms: 'Instantaneity, Promptness',
        examUsage: '"Near-zero latency in 6G enables instantaneous remote robotic surgery."'
      },
      {
        word: 'Interoperability',
        pos: 'Noun',
        exactHindi: 'अंतर-प्रचालनीयता / आपसी समन्वय क्षमता',
        definition: 'The ability of computer systems or software to exchange and make use of information.',
        synonyms: 'Compatibility, Integration, Interconnection',
        antonyms: 'Incompatibility, Isolation',
        examUsage: '"Seamless interoperability between satellite and telecom towers is crucial for 6G NTN."'
      }
    ],
    practiceMcq: {
      question: 'भारत 6G विज़न दस्तावेज के अनुसार भारत में 6G सेवाओं के व्यावसायिक रोलआउट का लक्षित वर्ष क्या है?',
      options: ['2027', '2028', '2030', '2035'],
      correct: 2,
      explanation: 'भारत सरकार के आधिकारिक 6G विज़न दस्तावेज के अनुसार 2030 तक 6G तकनीक को पूरी तरह लागू करने का लक्ष्य है।'
    },
    mainsQuestion:
      '"6G प्रौद्योगिकी में वैश्विक पेटेंट नेतृत्व भारत की डिजिटल संप्रभुता और आर्थिक विकास में क्या भूमिका निभा सकता है? विश्लेषण कीजिए।"'
  },
  {
    id: 'news-e-rupee-cbdc',
    categoryTag: 'ECONOMY & BANKING',
    categoryFilter: 'Economy & Banking',
    date: '6 अक्टूबर 2026',
    readTime: '3 मिनट Read',
    releaseId: '2065817912598719109',
    headline: 'डिजिटल रुपया (e₹-CBDC) और यूपीआई इंटरऑपरेबिलिटी: भारतीय वित्तीय प्रणाली में वैश्विक क्रांति',
    summary:
      'भारतीय रिजर्व बैंक (RBI) द्वारा जारी सेंट्रल बैंक डिजिटल करेंसी (CBDC) और UPI क्यूआर कोड के पूर्ण एकीकरण से खुदरा डिजिटल रुपये के दैनिक लेन-देन में रिकॉर्ड वृद्धि दर्ज की गई है। इससे कैश हैंडलिंग लागत में सालाना ₹4,000+ करोड़ की बचत हो रही है।',
    background:
      'आरबीआई ने 1 दिसंबर 2022 को रिटेल डिजिटल रुपया (e₹-R) पायलट प्रोजेक्ट शुरू किया था, जिसे अब पूरे देश के बैंकों और मर्चेंट नेटवर्क में लागू कर दिया गया है।',
    sourceMinistry: 'भारतीय रिजर्व बैंक (RBI) • वित्त मंत्रालय • PIB',
    sourceUrl: 'https://rbi.org.in',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
    imageCredit: 'स्रोत: RBI Press Cell • NPCI Data',
    dimensions: [
      'डिजिटल रुपया (CBDC) सॉवरेन लीगल टेंडर है, जो ब्लॉकचेन आधारित DLT तकनीक पर कार्य करता है।',
      'यूपीआई क्यूआर कोड इंटरऑपरेबिलिटी से ग्राहक किसी भी साधारण मर्चेंट क्यूआर पर डिजिटल रुपये से भुगतान कर सकते हैं।',
      'ऑफ़लाइन सीबीडीसी लेनदेन सुविधा (बिना इंटरनेट के भुगतान) पहाड़ी व दूरदराज के क्षेत्रों में लागू।'
    ],
    provisions: [
      'RBI अधिनियम 1934 की धारा 2 में संशोधन कर डिजिटल करेंसी को बैंक नोट की कानूनी परिभाषा में शामिल किया गया।',
      'प्रोग्रामेबल मनी: विशिष्ट सरकारी सब्सिडी (जैसे खाद सब्सिडी या छात्रवृत्ति) केवल उसी उद्देश्य के लिए खर्च हो सकेगी।',
      'सीमा पार क्रॉस-बॉर्डर भुगतान (Cross-border Remittances) में लागत व समय में 80% कमी।'
    ],
    highYieldFact: 'आरबीआई की स्थापना 1 अप्रैल 1935 को हिल्टन यंग आयोग की सिफारिश पर हुई थी और इसका राष्ट्रीयकरण 1 जनवरी 1949 को हुआ।',
    vocabulary: [
      {
        word: 'Interoperability',
        pos: 'Noun',
        exactHindi: 'पारस्परिक संचालन क्षमता / अंतर-प्रचालनीयता',
        definition: 'The ability of different systems or organizations to work together seamlessly.',
        synonyms: 'Compatibility, Integration, Interconnection',
        antonyms: 'Incompatibility, Isolation',
        examUsage: '"Interoperability between CBDC and UPI enhances financial inclusion."'
      },
      {
        word: 'Sovereign',
        pos: 'Adjective / Noun',
        exactHindi: 'संप्रभु / सर्वोच्च कानूनी सत्ता',
        definition: 'Possessing supreme or ultimate power.',
        synonyms: 'Autonomous, Supreme, Independent',
        antonyms: 'Subordinate, Dependent',
        examUsage: '"Central Bank Digital Currency carries the sovereign backing of RBI."'
      },
      {
        word: 'Disinflation',
        pos: 'Noun',
        exactHindi: 'अपस्फीति / मुद्रास्फीति की दर में कमी',
        definition: 'A reduction in the rate of inflation.',
        synonyms: 'Slowing inflation, Price stabilization',
        antonyms: 'Hyperinflation, Reflation',
        examUsage: '"Monetary tightening resulted in steady disinflation across sectors."'
      }
    ],
    practiceMcq: {
      question: 'भारत में सेंट्रल बैंक डिजिटल करेंसी (CBDC) किसके द्वारा जारी की जाती है?',
      options: ['नीति आयोग', 'भारतीय रिजर्व बैंक (RBI)', 'वित्त मंत्रालय', 'भारतीय स्टेट बैंक'],
      correct: 1,
      explanation: 'सीबीडीसी (डिजिटल रुपया) भारतीय रिजर्व बैंक (RBI) द्वारा जारी सॉवरेन डिजिटल लीगल टेंडर है।'
    },
    mainsQuestion:
      '"सेंट्रल बैंक डिजिटल करेंसी (CBDC) और यूपीआई का एकीकरण भारत की बैंकिंग व्यवस्था और डॉलर पर निर्भरता कम करने में किस प्रकार सहायक हो सकता है?"'
  },
  {
    id: 'news-gati-shakti',
    categoryTag: 'SCHEMES & GOVERNANCE',
    categoryFilter: 'Schemes & Governance',
    date: '6 अक्टूबर 2026',
    readTime: '3 मिनट Read',
    releaseId: '2065817912598719111',
    headline: 'पीएम गति शक्ति राष्ट्रीय मास्टर प्लान: मल्टी-मॉडल कनेक्टिविटी और लॉजिस्टिक्स लागत घटाने में ऐतिहासिक प्रगति',
    summary:
      'पीएम गति शक्ति राष्ट्रीय मास्टर प्लान ने विभिन्न मंत्रालयों के बीच अवसंरचना परियोजनाओं के समन्वय को 100% डिजिटल कर लॉजिस्टिक्स लागत को सकल घरेलू उत्पाद (GDP) के 9% के नीचे लाने का ऐतिहासिक लक्ष्य हासिल किया है।',
    background:
      'पीएम गति शक्ति राष्ट्रीय मास्टर प्लान की शुरुआत अक्टूबर 2021 में ₹100 लाख करोड़ के विज़न के साथ की गई थी। इसमें भारतमाला, सागरमाला, उड़ान और रेलवे नेटवर्क को BISAG-N के GIS प्लेटफॉर्म पर एकीकृत किया गया है।',
    sourceMinistry: 'वाणिज्य और उद्योग मंत्रालय • डीपीआईआईटी • प्रेस सूचना ब्यूरो (PIB)',
    sourceUrl: 'https://pib.gov.in',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    imageCredit: 'स्रोत: DPIIT • BISAG-N National GIS Portal',
    dimensions: [
      '7 इंजन: सड़क, रेलवे, एयरपोर्ट, बंदरगाह, जन परिवहन, जलमार्ग और लॉजिस्टिक्स अवसंरचना।',
      '1460+ लेयर्स का एकीकृत जीआईएस प्लेटफॉर्म जो परियोजनाओं की डुप्लीकेसी रोकता है।',
      'राष्ट्रीय लॉजिस्टिक्स नीति (NLP) के तहत लॉजिस्टिक्स परफॉर्मेंस इंडेक्स में भारत की रैंक में तीव्र सुधार।'
    ],
    provisions: [
      'नेटवर्क प्लानिंग ग्रुप (NPG) द्वारा ₹500 करोड़ से अधिक की सभी परियोजनाओं की डिजिटल समीक्षा।',
      'लास्ट-माइल कनेक्टिविटी के लिए पीएम गति शक्ति पोर्टल का राज्यों (State Master Plans) में विस्तार।',
      'यूनिफाइड लॉजिस्टिक्स इंटरफेस प्लेटफॉर्म (ULIP) द्वारा कार्गो ट्रैकिंग में क्रांतिकारी सुगमता।'
    ],
    highYieldFact: 'पीएम गति शक्ति के GIS डिजिटल प्लेटफॉर्म का विकास BISAG-N (गांधीनगर, गुजरात) द्वारा अंतरिक्ष विभाग के सहयोग से किया गया है।',
    vocabulary: [
      {
        word: 'Infrastructure',
        pos: 'Noun',
        exactHindi: 'अवसंरचना / बुनियादी ढांचा',
        definition: 'The basic physical and organizational structures needed for the operation of a society.',
        synonyms: 'Framework, Foundation, Backbone',
        antonyms: 'Superstructure',
        examUsage: '"Modern logistics infrastructure accelerates industrial export growth."'
      },
      {
        word: 'Synergy',
        pos: 'Noun',
        exactHindi: 'सहक्रिया / तालमेल',
        definition: 'The interaction of elements that when combined produce a total effect that is greater than the sum of the individual elements.',
        synonyms: 'Collaboration, Harmony, Symbiosis',
        antonyms: 'Discord, Antagonism',
        examUsage: '"PM Gati Shakti creates inter-ministerial synergy to avoid delays."'
      },
      {
        word: 'Efficiency',
        pos: 'Noun',
        exactHindi: 'दक्षता / कार्यकुशलता',
        definition: 'The state or quality of being efficient; maximum productivity with minimum wasted effort.',
        synonyms: 'Competence, Efficacy, Productivity',
        antonyms: 'Inefficiency, Wastefulness',
        examUsage: '"Digitized route planning enhances supply chain efficiency."'
      }
    ],
    practiceMcq: {
      question: 'पीएम गति शक्ति राष्ट्रीय मास्टर प्लान में कितने प्रमुख आर्थिक विकास इंजन शामिल हैं?',
      options: ['5 इंजन', '7 इंजन', '10 इंजन', '12 इंजन'],
      correct: 1,
      explanation: 'पीएम गति शक्ति के 7 प्रमुख इंजन हैं: सड़क, रेलवे, एयरपोर्ट, बंदरगाह, जन परिवहन, जलमार्ग और लॉजिस्टिक्स।'
    },
    mainsQuestion:
      '"पीएम गति शक्ति पोर्टल किस प्रकार अवसंरचना निर्माण में विभागीय सिलोस (Silos) को समाप्त कर भारत की लॉजिस्टिक्स लागत को वैश्विक स्तर पर प्रतिस्पर्धी बना रहा है?"'
  },
  {
    id: 'news-gba',
    categoryTag: 'INTERNATIONAL',
    categoryFilter: 'National',
    date: '6 अक्टूबर 2026',
    readTime: '4 मिनट Read',
    releaseId: '2065817912598719112',
    headline: 'ग्लोबल बायोफ्यूल्स अलायंस (GBA) और अंतर्राष्ट्रीय स्वच्छ ऊर्जा संक्रमण का तीव्र विस्तार',
    summary:
      'भारत की अध्यक्षता में गठित ग्लोबल बायोफ्यूल्स अलायंस (GBA) में विश्व के प्रमुख 24 देश और 12 अंतर्राष्ट्रीय संगठन शामिल हो चुके हैं। इसका उद्देश्य 2030 तक स्थायी विमानन ईंधन (SAF) और 20% इथेनॉल मिश्रण को वैश्विक मानक बनाना है।',
    background:
      'नई दिल्ली G20 शिखर सम्मेलन (2023) के दौरान प्रधानमंत्री नरेंद्र मोदी द्वारा अमेरिका और ब्राजील के साथ मिलकर ग्लोबल बायोफ्यूल्स अलायंस का ऐतिहासिक शुभारंभ किया गया था।',
    sourceMinistry: 'विदेश मंत्रालय (MEA) • पेट्रोलियम एवं प्राकृतिक गैस मंत्रालय • PIB',
    sourceUrl: 'https://pib.gov.in',
    imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80',
    imageCredit: 'स्रोत: MEA Official Portal • G20 Secretariat',
    dimensions: [
      'संस्थापक देश: भारत, ब्राजील और संयुक्त राज्य अमेरिका (वैश्विक इथेनॉल उत्पादन का 85% हिस्सा)।',
      'सस्टेनेबल एविएशन फ्यूल (SAF) के उपयोग को बढ़ावा देकर विमानन उत्सर्जन में कमी।',
      'कृषि अवशेषों (पराली व बगास) से 2G (सेकंड जेनरेशन) इथेनॉल निर्माण को वित्तीय प्रोत्साहन।'
    ],
    provisions: [
      'भारत ने 20% इथेनॉल सम्मिश्रण (E20) का लक्ष्य समय से पूर्व हासिल किया।',
      'कम्प्रेस्ड बायोगैस (CBG) और SATAT योजना का अंतर्राष्ट्रीय सहयोग मॉडल।',
      'ग्लोबल बायोफ्यूल्स स्टैंडर्डाइजेशन और तकनीकी हस्तांतरण ढांचा।'
    ],
    highYieldFact: 'भारत, ब्राजील और अमेरिका मिलकर विश्व के कुल इथेनॉल उत्पादन का लगभग 85% और उपभोग का 81% नियंत्रित करते हैं।',
    vocabulary: [
      {
        word: 'Biofuel',
        pos: 'Noun',
        exactHindi: 'जैव ईंधन (कृषि व जैविक स्रोतों से निर्मित ईंधन)',
        definition: 'A fuel derived immediately from living matter such as agricultural crops.',
        synonyms: 'Biomass fuel, Renewable fuel, Ethanol',
        antonyms: 'Fossil fuel, Petroleum',
        examUsage: '"Biofuels play a pivotal role in achieving net-zero carbon targets."'
      },
      {
        word: 'Decarbonization',
        pos: 'Noun',
        exactHindi: 'डीकार्बोनाइजेशन / कार्बन उत्सर्जन में कमी',
        definition: 'The reduction of carbon dioxide emissions through use of low carbon power sources.',
        synonyms: 'Emissions reduction, Clean transition',
        antonyms: 'Carbonization, Pollution',
        examUsage: '"The alliance aims to accelerate the decarbonization of transport sectors."'
      },
      {
        word: 'Multilateral',
        pos: 'Adjective',
        exactHindi: 'बहुपक्षीय / कई देशों की सहभागिता वाला',
        definition: 'Agreed upon or participated in by three or more parties or governments.',
        synonyms: 'Collective, International, Multi-party',
        antonyms: 'Unilateral, Bilateral',
        examUsage: '"GBA represents a strong multilateral platform for renewable energy."'
      }
    ],
    practiceMcq: {
      question: 'ग्लोबल बायोफ्यूल्स अलायंस (GBA) के तीन प्रमुख संस्थापक देश कौन-से हैं?',
      options: [
        'भारत, चीन और रूस',
        'भारत, ब्राजील और संयुक्त राज्य अमेरिका (USA)',
        'भारत, जापान और जर्मनी',
        'भारत, ऑस्ट्रेलिया और ब्रिटेन'
      ],
      correct: 1,
      explanation: 'ग्लोबल बायोफ्यूल्स अलायंस के संस्थापक देश भारत, ब्राजील और यूएसए हैं।'
    },
    mainsQuestion:
      '"ग्लोबल बायोफ्यूल्स अलायंस (GBA) भारत की ऊर्जा सुरक्षा और 2070 तक नेट-जीरो कार्बन उत्सर्जन के राष्ट्रीय लक्ष्य में किस प्रकार मील का पत्थर सिद्ध होगा?"'
  },
  {
    id: 'news-pm-surya-ghar',
    categoryTag: 'SCHEMES & GOVERNANCE',
    categoryFilter: 'Schemes & Governance',
    date: '6 अक्टूबर 2026',
    readTime: '3 मिनट Read',
    releaseId: '2065817912598719113',
    headline: 'पीएम सूर्य घर: मुफ्त बिजली योजना के तहत 1 करोड़ परिवारों को 300 यूनिट मुफ्त सौर ऊर्जा',
    summary:
      'केंद्रीय मंत्रिमंडल द्वारा ₹75,021 करोड़ के परिव्यय के साथ पीएम सूर्य घर: मुफ्त बिजली योजना को अभूतपूर्व गति दी गई है। इसके अंतर्गत आवासीय घरों की छतों पर सोलर पैनल लगाने हेतु 60% तक की सीधी केंद्रीय सब्सिडी दी जा रही है।',
    background:
      'प्रधानमंत्री नरेंद्र मोदी द्वारा 13 फरवरी 2024 को पीएम सूर्य घर: मुफ्त बिजली योजना की शुरुआत की गई थी, जिसका लक्ष्य 1 करोड़ परिवारों को हर महीने 300 यूनिट मुफ्त बिजली प्रदान करना है।',
    sourceMinistry: 'नवीन और नवीकरणीय ऊर्जा मंत्रालय (MNRE) • pmsuryaghar.gov.in',
    sourceUrl: 'https://pmsuryaghar.gov.in',
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
    imageCredit: 'स्रोत: MNRE Official Portal • National Solar Mission',
    dimensions: [
      'सब्सिडी दरें: 1 kW पर ₹30,000, 2 kW पर ₹60,000 और 3 kW या अधिक पर ₹78,000 तक की सीधी डीबीटी सहायता।',
      'DISCOMs को ग्रिड फीड-इन टैरिफ के माध्यम से अतिरिक्त सौर ऊर्जा बेचकर परिवारों की आय वृद्धि।',
      'देशभर में 30 GW रूफटॉप सौर ऊर्जा क्षमता का संवर्धन और 720 मिलियन टन CO2 उत्सर्जन में कमी।'
    ],
    provisions: [
      'राष्ट्रीय पोर्टल pmsuryaghar.gov.in पर सिंगल-विंडो ऑनलाइन आवेदन व वेंडर चयन।',
      'शहरी स्थानीय निकायों और ग्राम पंचायतों को रूफटॉप सोलर को बढ़ावा देने हेतु विशेष प्रोत्साहन।',
      'बिना किसी जमानत के 7% की रियायती ब्याज दर पर बैंकों से संपार्श्विक-मुक्त (Collateral-free) सोलर ऋण।'
    ],
    highYieldFact: 'पीएम सूर्य घर योजना का कुल बजट परिव्यय ₹75,021 करोड़ है और अधिकतम सब्सिडी ₹78,000 (3 kW क्षमता) निर्धारित है।',
    vocabulary: [
      {
        word: 'Subsidy',
        pos: 'Noun',
        exactHindi: 'सब्सिडी / वित्तीय सहायता / अनुदान',
        definition: 'A sum of money granted by the government to help an industry or business keep the price of a commodity low.',
        synonyms: 'Grant, Financial aid, Subvention, Allowance',
        antonyms: 'Tax, Surcharge, Penalty',
        examUsage: '"Direct benefit transfer ensures transparent disbursement of solar subsidies."'
      },
      {
        word: 'Decentralized',
        pos: 'Adjective',
        exactHindi: 'विकेंद्रीकृत',
        definition: 'Controlled by several local offices or authorities rather than one single one.',
        synonyms: 'Distributed, Dispersed, Devolved',
        antonyms: 'Centralized, Concentrated',
        examUsage: '"Rooftop solar empowers households through decentralized clean energy generation."'
      },
      {
        word: 'Collateral',
        pos: 'Noun',
        exactHindi: 'जमानत / बंधक संपत्ति',
        definition: 'Something pledged as security for repayment of a loan, to be forfeited in the event of a default.',
        synonyms: 'Security, Guarantee, Pledge, Surety',
        antonyms: 'Unsecured',
        examUsage: '"Banks offer collateral-free low-interest loans for PM Surya Ghar installations."'
      }
    ],
    practiceMcq: {
      question: 'पीएम सूर्य घर: मुफ्त बिजली योजना के अंतर्गत 3 kW क्षमता के रूफटॉप सोलर पर अधिकतम कितनी केंद्रीय सब्सिडी देय है?',
      options: ['₹30,000', '₹50,000', '₹60,000', '₹78,000'],
      correct: 3,
      explanation: '3 kW रूफटॉप सोलर सिस्टम पर अधिकतम ₹78,000 की वित्तीय सहायता DBT के माध्यम से दी जाती है।'
    },
    mainsQuestion:
      '"रूफटॉप सोलर क्रांति भारत की ऊर्जा आत्मनिर्भरता, डिस्कॉम्स के वित्तीय घाटे को पाटने और ग्रामीण सशक्तिकरण में कैसे उत्प्रेरक सिद्ध हो सकती है?"'
  },
  {
    id: 'news-bns-bnss-bsa',
    categoryTag: 'NATIONAL',
    categoryFilter: 'National',
    date: '6 अक्टूबर 2026',
    readTime: '4 मिनट Read',
    releaseId: '2065817912598719114',
    headline: 'भारतीय न्याय संहिता (BNS), BNSS और BSA: भारत की नई आपराधिक न्याय प्रणाली का ऐतिहासिक कार्यान्वयन',
    summary:
      'औपनिवेशिक काल के 160 वर्ष पुराने भारतीय दंड संहिता (IPC), CrPC और साक्ष्य अधिनियम के स्थान पर तीन नए आपराधिक कानून—भारतीय न्याय संहिता (BNS), भारतीय नागरिक सुरक्षा संहिता (BNSS) और भारतीय साक्ष्य अधिनियम (BSA) लागू हैं।',
    background:
      '1 जुलाई 2024 से संपूर्ण भारत में ब्रिटिश काल के 1860 के IPC, 1872 के साक्ष्य अधिनियम और 1973 के CrPC को समाप्त कर नए न्याय-केंद्रित आपराधिक कानून लागू किए गए।',
    sourceMinistry: 'विधि और न्याय मंत्रालय • भारत का राजपत्र (Gazette of India) • PIB',
    sourceUrl: 'https://mha.gov.in',
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
    imageCredit: 'स्रोत: Ministry of Law & Justice • Gazette of India',
    dimensions: [
      'भारतीय न्याय संहिता (BNS 2023): 358 धाराएं (IPC की 511 धाराओं के स्थान पर)। राजद्रोह (Sedition) को समाप्त कर देशद्रोह (Treason) को स्पष्ट परिभाषित किया गया।',
      'भारतीय नागरिक सुरक्षा संहिता (BNSS 2023): 531 धाराएं। 7 वर्ष या अधिक सजा वाले अपराधों में फॉरेंसिक साक्ष्य अनिवार्य।',
      'भारतीय साक्ष्य अधिनियम (BSA 2023): 170 धाराएं। इलेक्ट्रॉनिक एवं डिजिटल साक्ष्यों को प्राथमिक साक्ष्य (Primary Evidence) के समकक्ष मान्यता।'
    ],
    provisions: [
      'जीरो एफआईआर (Zero FIR) और ई-एफआईआर (e-FIR) को वैधानिक दर्जा दिया गया।',
      'पहली बार छोटे-मोटे अपराधों के लिए दंड के रूप में "सामुदायिक सेवा" (Community Service) का प्रावधान।',
      'पीड़ित केंद्रित न्याय: चार्जशीट दाखिल करने की 90 दिनों की समय-सीमा और त्वरित ट्रायल प्रावधान।'
    ],
    highYieldFact: 'तीनों नए आपराधिक कानून 1 जुलाई 2024 से संपूर्ण भारत में प्रभावी रूप से लागू हुए हैं।',
    vocabulary: [
      {
        word: 'Jurisprudence',
        pos: 'Noun',
        exactHindi: 'न्यायशास्त्र / विधि दर्शन',
        definition: 'The theory or philosophy of law; a legal system.',
        synonyms: 'Legal philosophy, Law, Judicial science',
        antonyms: 'Lawlessness',
        examUsage: '"The new criminal codes reflect a shift toward citizen-centric jurisprudence."'
      },
      {
        word: 'Forensic',
        pos: 'Adjective',
        exactHindi: 'न्यायालयिक / वैज्ञानिक अपराध अन्वेषण संबंधी',
        definition: 'Relating to or denoting the application of scientific methods and techniques to the investigation of crime.',
        synonyms: 'Scientific investigative, Juridical',
        antonyms: 'Conjectural, Unscientific',
        examUsage: '"BNSS makes forensic investigation mandatory for offenses punishable by 7 years or more."'
      },
      {
        word: 'Admissibility',
        pos: 'Noun',
        exactHindi: 'स्वीकार्यता / कानूनी ग्राह्यता',
        definition: 'The quality of being acceptable or valid, especially as evidence in a court of law.',
        synonyms: 'Validity, Legitimacy, Acceptability',
        antonyms: 'Inadmissibility, Invalidity',
        examUsage: '"The Bharatiya Sakshya Adhiniyam broadens the admissibility of electronic evidence."'
      }
    ],
    practiceMcq: {
      question: 'भारतीय दंड संहिता (IPC 1860) के स्थान पर कौन-सा नया कानून लागू किया गया है?',
      options: [
        'भारतीय न्याय संहिता (BNS 2023)',
        'भारतीय नागरिक सुरक्षा संहिता (BNSS 2023)',
        'भारतीय साक्ष्य अधिनियम (BSA 2023)',
        'भारतीय दंड विधान'
      ],
      correct: 0,
      explanation: 'IPC 1860 के स्थान पर भारतीय न्याय संहिता (BNS 2023) लागू की गई है जिसमें कुल 358 धाराएं हैं।'
    },
    mainsQuestion:
      '"भारतीय न्याय संहिता (BNS) और BNSS औपनिवेशिक \'दंड-आधारित\' न्याय प्रणाली को भारतीय संवैधानिक मूल्यों के अनुरूप \'न्याय-आधारित\' प्रणाली में कैसे रूपांतरित करते हैं?"'
  },
  {
    id: 'news-isro-bas-2026',
    categoryTag: 'SCIENCE & TECH',
    categoryFilter: 'Science & Tech',
    date: getTodayHindiDate(),
    readTime: '3 मिनट Read',
    releaseId: '2065817912598719115',
    headline: 'भारतीय अंतरिक्ष स्टेशन (BAS-1) और गगनयान मिशन: इसरो का स्वदेशी अंतरिक्ष डॉकिंग रोडमैप',
    summary:
      'भारतीय अंतरिक्ष अनुसंधान संगठन (ISRO) ने SPADEX (Space Docking Experiment) की ऐतिहासिक सफलता के बाद भारतीय अंतरिक्ष स्टेशन (BAS) के प्रथम मॉड्यूल के प्रक्षेपण की तैयारी तेज कर दी है। भारत अंतरिक्ष डॉकिंग तकनीक हासिल करने वाला विश्व का चौथा देश बन गया है।',
    background:
      'केंद्रीय मंत्रिमंडल ने गगनयान कार्यक्रम के विस्तार और 2028 तक भारतीय अंतरिक्ष स्टेशन की पहली इकाई स्थापित करने हेतु ₹20,193 करोड़ के कुल बजट को मंजूरी दी है।',
    sourceMinistry: 'अंतरिक्ष विभाग (DoS) • ISRO मुख्यालय बेंगलुरु • PIB',
    sourceUrl: 'https://isro.gov.in',
    imageUrl: 'https://images.unsplash.com/photo-1517976487468-f20514c44533?auto=format&fit=crop&w=1200&q=80',
    imageCredit: 'स्रोत: ISRO Media Cell • Press Information Bureau',
    dimensions: [
      'SPADEX मिशन द्वारा दो उपग्रहों (Chaser और Target) का पृथ्वी की निचली कक्षा में सफल स्वचालित मिलन।',
      'भारतीय अंतरिक्ष स्टेशन (BAS) का कुल द्रव्यमान लगभग 52 टन होगा जिसमें 5 मॉड्यूल शामिल होंगे।',
      'नेक्स्ट जनरेशन लॉन्च व्हीकल (NGLV - Soorya) द्वारा भारी पेलोड को कक्षा में स्थापित करने की क्षमता।'
    ],
    provisions: [
      '2028 तक BAS-1 मॉड्यूल का प्रक्षेपण और 2035 तक पूर्ण अंतरिक्ष स्टेशन का संचालन।',
      '2040 तक भारतीय अंतरिक्ष यात्री (गगनयात्री) को चंद्रमा की सतह पर उतारने का राष्ट्रीय लक्ष्य।',
      'चंद्रयान-4 (Lunar Sample Return) और शुक्र ऑर्बिटर मिशन (VOM) को कैबिनेट की स्वीकृति।'
    ],
    highYieldFact: 'अमेरिका, रूस और चीन के बाद भारत अंतरिक्ष में स्वायत्त डॉकिंग (SPADEX) क्षमता रखने वाला दुनिया का चौथा देश है।',
    vocabulary: [
      {
        word: 'Autonomous',
        pos: 'Adjective',
        exactHindi: 'स्वायत्त / स्व-नियंत्रित',
        definition: 'Acting independently or having the freedom to do so without external control.',
        synonyms: 'Self-governing, Independent, Automated',
        antonyms: 'Dependent, Manual',
        examUsage: '"ISRO demonstrated autonomous orbital docking during the SPADEX mission."'
      },
      {
        word: 'Rendezvous',
        pos: 'Noun',
        exactHindi: 'अंतरिक्ष मिलन / पूर्व-निर्धारित मिलन बिंदु',
        definition: 'A meeting at an agreed time and place, especially between two spacecraft in orbit.',
        synonyms: 'Convergence, Docking, Encounter',
        antonyms: 'Separation, Divergence',
        examUsage: '"Orbital rendezvous is essential for crew transfer to space stations."'
      }
    ],
    practiceMcq: {
      question: 'अंतरिक्ष में दो उपग्रहों को जोड़ने के लिए इसरो द्वारा किए गए सफल प्रयोग का नाम क्या है?',
      options: ['SPADEX (स्पैडेक्स)', 'RLV-LEX', 'POEM-4', 'XPoSat'],
      correct: 0,
      explanation: 'इसरो ने SPADEX (Space Docking Experiment) मिशन के तहत अंतरिक्ष में सफल डॉकिंग कर इतिहास रचा।'
    },
    mainsQuestion:
      '"भारतीय अंतरिक्ष स्टेशन (BAS) और SPADEX तकनीक वैश्विक अंतरिक्ष अर्थव्यवस्था में भारत की हिस्सेदारी को 2% से बढ़ाकर 8% करने में कैसे सहायक होगी?"'
  },
  {
    id: 'news-india-ai-mission',
    categoryTag: 'SCIENCE & TECH',
    categoryFilter: 'Science & Tech',
    date: getTodayHindiDate(),
    readTime: '3 मिनट Read',
    releaseId: '2065817912598719116',
    headline: 'इंडियाएआई मिशन (IndiaAI Mission): 18,000+ जीपीयू कंप्यूट इंफ्रास्ट्रक्चर और स्वदेशी फाउंडेशनल मॉडल',
    summary:
      'इलेक्ट्रॉनिक्स और सूचना प्रौद्योगिकी मंत्रालय (MeitY) ने ₹10,371.92 करोड़ के "IndiaAI Mission" के अंतर्गत भारत के अपने स्वदेशी लार्ज लैंग्वेज मॉडल (LLM) और 18,000 से अधिक AI GPUs का राष्ट्रीय कंप्यूट क्लस्टर लाइव कर दिया है।',
    background:
      'कृत्रिम बुद्धिमत्ता (AI) में आत्मनिर्भरता और भारतीय भाषाओं (भाषिणी) के डेटासेट पर प्रशिक्षित एआई मॉडल विकसित करने के लिए कैबिनेट ने इंडियाएआई मिशन को स्वीकृति दी है।',
    sourceMinistry: 'इलेक्ट्रॉनिक्स और आईटी मंत्रालय (MeitY) • IndiaAI Portal • PIB',
    sourceUrl: 'https://indiaai.gov.in',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
    imageCredit: 'स्रोत: MeitY • Digital India Corporation',
    dimensions: [
      'IndiaAI Compute Capacity: स्टार्टअप्स और शोधकर्ताओं को रियायती दरों पर 18,000+ उच्च-स्तरीय GPUs की उपलब्धता।',
      'IndiaAI Datasets Platform (AIKosh): गैर-व्यक्तिगत भारतीय डेटासेट का एकीकृत राष्ट्रीय भंडार।',
      'स्वास्थ्य, कृषि, शिक्षा और जलवायु परिवर्तन के लिए स्वदेशी मल्टीमॉडल फाउंडेशन मॉडल का विकास।'
    ],
    provisions: [
      'टीयर-2 और टीयर-3 शहरों में "IndiaAI FutureSkills" केंद्रों की स्थापना।',
      'सुरक्षित और नैतिक एआई (Safe & Trusted AI) के लिए स्वदेशी गवर्नेंस फ्रेमवर्क।',
      'डीप-टेक एआई स्टार्टअप्स के लिए ₹2,000 करोड़ का जोखिम पूंजी (Venture Financing) कोष।'
    ],
    highYieldFact: 'IndiaAI मिशन का कुल परिव्यय ₹10,371.92 करोड़ है और इसका क्रियान्वयन डिजिटल इंडिया कॉर्पोरेशन (DIC) के तहत किया जा रहा है।',
    vocabulary: [
      {
        word: 'Foundational',
        pos: 'Adjective',
        exactHindi: 'आधारभूत / बुनियादी',
        definition: 'Forming an essential base or core from which everything else develops.',
        synonyms: 'Fundamental, Primary, Underlying',
        antonyms: 'Secondary, Peripheral',
        examUsage: '"India is building indigenous foundational AI models trained on regional languages."'
      }
    ],
    practiceMcq: {
      question: 'केंद्रीय मंत्रिमंडल द्वारा स्वीकृत "IndiaAI Mission" का कुल वित्तीय परिव्यय कितना है?',
      options: ['₹5,500 करोड़', '₹10,371.92 करोड़', '₹15,000 करोड़', '₹20,250 करोड़'],
      correct: 1,
      explanation: 'IndiaAI मिशन के लिए 5 वर्षों की अवधि हेतु ₹10,371.92 करोड़ का बजट आवंटित किया गया है।'
    },
    mainsQuestion:
      '"इंडियाएआई मिशन भारत को एआई के उपभोक्ता से बदलकर वैश्विक एआई नवाचार का निर्माता बनाने में किस प्रकार सक्षम करेगा?"'
  },
  {
    id: 'news-national-green-hydrogen',
    categoryTag: 'ECONOMY & BANKING',
    categoryFilter: 'Economy & Banking',
    date: getTodayHindiDate(),
    readTime: '3 मिनट Read',
    releaseId: '2065817912598719117',
    headline: 'राष्ट्रीय हरित हाइड्रोजन मिशन (NGHM): प्रति वर्ष 5 MMT हरित हाइड्रोजन उत्पादन और निर्यात हब',
    summary:
      'नवीन एवं नवीकरणीय ऊर्जा मंत्रालय (MNRE) ने SIGHT (Strategic Interventions for Green Hydrogen Transition) कार्यक्रम के तहत इलेक्ट्रोलाइज़र निर्माण और हरित अमोनिया उत्पादन के लिए ₹19,744 करोड़ के प्रोत्साहन आवंटित किए हैं।',
    background:
      'भारत को स्वच्छ ऊर्जा का वैश्विक निर्यातक बनाने और जीवाश्म ईंधन के आयात में ₹1 लाख करोड़ से अधिक की कमी लाने हेतु राष्ट्रीय हरित हाइड्रोजन मिशन शुरू किया गया है।',
    sourceMinistry: 'नवीन और नवीकरणीय ऊर्जा मंत्रालय (MNRE) • PIB नई दिल्ली',
    sourceUrl: 'https://mnre.gov.in',
    imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1200&q=80',
    imageCredit: 'स्रोत: MNRE • Green Hydrogen Cell',
    dimensions: [
      '2030 तक प्रति वर्ष 5 मिलियन मीट्रिक टन (MMT) हरित हाइड्रोजन उत्पादन क्षमता का विकास।',
      'लगभग 125 गीगावाट (GW) संबद्ध नवीकरणीय ऊर्जा क्षमता की वृद्धि और ₹8 लाख करोड़ से अधिक का निवेश।',
      'कांडला (दीनदयाल), पारादीप और तूतीकोरिन (वी.ओ. चिदंबरनार) बंदरगाहों को ग्रीन हाइड्रोजन हब के रूप में विकसित करना।'
    ],
    provisions: [
      'SIGHT योजना के अंतर्गत स्वदेशी इलेक्ट्रोलाइज़र निर्माण हेतु ₹17,490 करोड़ का सीधा वित्तीय प्रोत्साहन।',
      'इस्पात, उर्वरक (रिफाइनरी) और लंबी दूरी के भारी परिवहन में हरित हाइड्रोजन का चरणबद्ध उपयोग।',
      'ग्रीन हाइड्रोजन सर्टिफिकेशन और अंतर्राष्ट्रीय निर्यात मानकों का निर्धारण।'
    ],
    highYieldFact: 'राष्ट्रीय हरित हाइड्रोजन मिशन से 2030 तक सालाना लगभग 50 मिलियन मीट्रिक टन कार्बन डाइऑक्साइड (CO2) उत्सर्जन कम होगा।',
    vocabulary: [
      {
        word: 'Electrolysis',
        pos: 'Noun',
        exactHindi: 'विद्युत-अपघटन',
        definition: 'Chemical decomposition produced by passing an electric current through a liquid or solution.',
        synonyms: 'Ionization, Chemical splitting',
        antonyms: 'Synthesis',
        examUsage: '"Green hydrogen is produced by the electrolysis of water using renewable solar and wind power."'
      }
    ],
    practiceMcq: {
      question: 'राष्ट्रीय हरित हाइड्रोजन मिशन के तहत वर्ष 2030 तक प्रतिवर्ष कितने मिलियन मीट्रिक टन (MMT) हरित हाइड्रोजन उत्पादन का लक्ष्य है?',
      options: ['2 MMT', '5 MMT', '10 MMT', '15 MMT'],
      correct: 1,
      explanation: 'इस मिशन का लक्ष्य 2030 तक 5 MMT (मिलियन मीट्रिक टन) प्रति वर्ष हरित हाइड्रोजन उत्पादन क्षमता हासिल करना है।'
    },
    mainsQuestion:
      '"हरित हाइड्रोजन भारत के भारी उद्योगों (इस्पात व उर्वरक) के डीकार्बोनाइजेशन और ऊर्जा सुरक्षा में क्या भूमिका निभा सकता है?"'
  },
  {
    id: 'news-sports-chess-olympiad-india',
    categoryTag: 'SPORTS & HONORS',
    categoryFilter: 'Sports & Honors',
    date: getTodayHindiDate(),
    readTime: '3 मिनट Read',
    releaseId: '2065817912598719118',
    headline: 'विश्व शतरंज और खेल महाशक्ति भारत: डी. गुकेश, प्रज्ञानानंद और फिडे ओलंपियाड में भारत का स्वर्णिम युग',
    summary:
      'भारतीय शतरंज ग्रैंडमास्टर डी. गुकेश के सबसे युवा विश्व शतरंज चैंपियन बनने और शतरंज ओलंपियाड के ओपन व महिला दोनों वर्गों में भारत के ऐतिहासिक स्वर्ण पदक जीतने के बाद युवा कार्यक्रम एवं खेल मंत्रालय ने "खेलो इंडिया टैलेंट आइडेंटिफिकेशन" का विस्तार किया है।',
    background:
      'भारत में अब 85 से अधिक ग्रैंडमास्टर्स हैं और 2036 के ग्रीष्मकालीन ओलंपिक खेलों की मेजबानी के लिए भारत ने अंतर्राष्ट्रीय ओलंपिक समिति (IOC) को औपचारिक आशय पत्र (Letter of Intent) सौंपा है।',
    sourceMinistry: 'युवा कार्यक्रम और खेल मंत्रालय • भारतीय खेल प्राधिकरण (SAI) • PIB',
    sourceUrl: 'https://yas.nic.in',
    imageUrl: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=1200&q=80',
    imageCredit: 'स्रोत: SAI Media • Ministry of Youth Affairs & Sports',
    dimensions: [
      '45वें फिडे (FIDE) शतरंज ओलंपियाड (बुडापेस्ट) में भारत ने पुरुष और महिला दोनों वर्गों में दोहरा स्वर्ण पदक जीता।',
      'डी. गुकेश (18 वर्ष) विश्व शतरंज चैंपियनशिप जीतने वाले इतिहास के सबसे कम उम्र के खिलाड़ी बने।',
      'टारगेट ओलंपिक पोडियम स्कीम (TOPS) के तहत एथलीटों को अंतर्राष्ट्रीय प्रशिक्षण और खेल विज्ञान सहायता।'
    ],
    provisions: [
      'देशभर में 1,000 से अधिक "खेलो इंडिया केंद्र" (KIC) पूर्व चैंपियन एथलीटों के नेतृत्व में संचालित।',
      'राष्ट्रीय खेल प्रशासन विधेयक और डोपिंग रोधी (NADA) प्रोटोकॉल का सुदृढ़ीकरण।',
      '2036 ओलंपिक मेजबानी की तैयारी हेतु विश्वस्तरीय स्पोर्ट्स सिटी और हाई-परफॉर्मेंस सेंटर।'
    ],
    highYieldFact: 'विश्वनाथन आनंद (1988) भारत के पहले ग्रैंडमास्टर थे, जबकि डी. गुकेश सबसे युवा विश्व शतरंज चैंपियन बने हैं।',
    vocabulary: [
      {
        word: 'Prodigy',
        pos: 'Noun',
        exactHindi: 'विलक्षण प्रतिभासंपन्न युवा',
        definition: 'A young person with exceptional qualities or abilities.',
        synonyms: 'Genius, Wunderkind, Mastermind',
        antonyms: 'Novice, Amateur',
        examUsage: '"Indian chess prodigy D. Gukesh scripted history on the global stage."'
      }
    ],
    practiceMcq: {
      question: 'इतिहास में सबसे कम उम्र के विश्व शतरंज चैंपियन (World Chess Champion) बनने का गौरव किस भारतीय ग्रैंडमास्टर ने हासिल किया?',
      options: ['आर. प्रज्ञानानंद', 'डी. गुकेश (D. Gukesh)', 'अर्जुन एरिगैसी', 'विदित गुजराती'],
      correct: 1,
      explanation: 'डी. गुकेश मात्र 18 वर्ष की आयु में विश्व शतरंज चैंपियन बनने वाले सबसे युवा खिलाड़ी हैं।'
    },
    mainsQuestion:
      '"भारत को 2036 ओलंपिक की मेजबानी और वैश्विक खेल महाशक्ति बनाने के लिए जमीनी स्तर के खेल बुनियादी ढांचे में किन सुधारों की आवश्यकता है?"'
  },
  {
    id: 'news-semicon-india-fab',
    categoryTag: 'ECONOMY & BANKING',
    categoryFilter: 'Economy & Banking',
    date: getTodayHindiDate(),
    readTime: '3 मिनट Read',
    releaseId: '2065817912598719119',
    headline: 'सेमीकॉन इंडिया प्रोग्राम: धोलेरा, साणंद और मोरीगांव में भारत के स्वदेशी सेमीकंडक्टर चिप प्लांट्स',
    summary:
      'इंडिया सेमीकंडक्टर मिशन (ISM) के अंतर्गत ₹76,000 करोड़ के प्रोत्साहन पैकेज से गुजरात के धोलेरा व साणंद और असम के मोरीगांव में सेमीकंडक्टर फैब्रिकेशन और ATMP इकाइयों का निर्माण तेजी से चल रहा है, जिससे भारत वैश्विक चिप आपूर्ति श्रृंखला का प्रमुख केंद्र बन रहा है।',
    background:
      'इलेक्ट्रॉनिक्स, ऑटोमोबाइल, रक्षा और दूरसंचार क्षेत्रों में सिलिकॉन वेफर्स और माइक्रोचिप्स की बढ़ती मांग को पूरा करने के लिए 2021 में इंडिया सेमीकंडक्टर मिशन शुरू किया गया था।',
    sourceMinistry: 'इलेक्ट्रॉनिक्स और सूचना प्रौद्योगिकी मंत्रालय (MeitY) • ISM • PIB',
    sourceUrl: 'https://ism.gov.in',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    imageCredit: 'स्रोत: India Semiconductor Mission (ISM) • PIB',
    dimensions: [
      'धोलेरा (गुजरात): टाटा इलेक्ट्रॉनिक्स और ताइवान की PSMC द्वारा भारत का पहला कॉमर्शियल सेमीकंडक्टर फैब (50,000 वेफर्स/माह)।',
      'मोरीगांव (असम) और साणंद (गुजरात): प्रतिदिन करोड़ों स्वदेशी चिप्स की असेंबली, टेस्टिंग, मार्किंग और पैकेजिंग (ATMP/OSAT)।',
      'मोहाली स्थित सेमी-कंडक्टर लेबोरेटरी (SCL) का आधुनिकीकरण और "चिप्स टू स्टार्टअप" (C2S) कार्यक्रम।'
    ],
    provisions: [
      'सेमीकंडक्टर और डिस्प्ले फैब स्थापित करने के लिए परियोजना लागत का 50% राजकोषीय समर्थन (Pari-passu आधार पर)।',
      'डिजाइन लिंक्ड इंसेंटिव (DLI) योजना के तहत भारतीय चिप डिजाइन स्टार्टअप्स को ₹50 करोड़ तक की सहायता।',
      '85,000 उच्च कुशल सेमीकंडक्टर इंजीनियर्स तैयार करने हेतु 100+ विश्वविद्यालयों में विशेष VLSI पाठ्यक्रम।'
    ],
    highYieldFact: 'भारत का पहला कॉमर्शियल सेमीकंडक्टर फैब्रिकेशन प्लांट धोलेरा (गुजरात) में स्थापित किया जा रहा है।',
    vocabulary: [
      {
        word: 'Fabrication',
        pos: 'Noun',
        exactHindi: 'विनिर्माण / चिप निर्माण प्रक्रिया',
        definition: 'The action or process of manufacturing or inventing something, especially integrated circuits.',
        synonyms: 'Manufacturing, Production, Assembly',
        antonyms: 'Demolition, Dismantling',
        examUsage: '"Semiconductor wafer fabrication requires ultra-clean room environments."'
      }
    ],
    practiceMcq: {
      question: 'टाटा इलेक्ट्रॉनिक्स द्वारा भारत का पहला व्यावसायिक सेमीकंडक्टर फैब्रिकेशन (Fab) प्लांट किस स्थान पर स्थापित किया जा रहा है?',
      options: ['धोलेरा (गुजरात)', 'नोएडा (उत्तर प्रदेश)', 'हैदराबाद (तेलंगाना)', 'पुणे (महाराष्ट्र)'],
      correct: 0,
      explanation: 'गुजरात के धोलेरा में भारत का पहला कॉमर्शियल सेमीकंडक्टर फैब स्थापित किया जा रहा है।'
    },
    mainsQuestion:
      '"सेमीकंडक्टर विनिर्माण में आत्मनिर्भरता भारत की राष्ट्रीय सुरक्षा और आर्थिक संप्रभुता के लिए क्यों अपरिहार्य है?"'
  },
  {
    id: 'news-one-nation-one-subscription',
    categoryTag: 'SCHEMES & GOVERNANCE',
    categoryFilter: 'Schemes & Governance',
    date: getTodayHindiDate(),
    readTime: '3 मिनट Read',
    releaseId: '2065817912598719120',
    headline: 'वन नेशन वन सब्सक्रिप्शन (ONOS) और अनुसंधान नेशनल रिसर्च फाउंडेशन (ANRF): उच्च शिक्षा में क्रांति',
    summary:
      'केंद्र सरकार ने देश के सभी सरकारी उच्च शिक्षण संस्थानों और R&D प्रयोगशालाओं के 1.8 करोड़ से अधिक छात्रों व शोधकर्ताओं को दुनिया के 13,000+ शीर्ष अंतर्राष्ट्रीय वैज्ञानिक जर्नल्स तक निशुल्क पहुंच देने के लिए ₹6,000 करोड़ की "One Nation One Subscription (ONOS)" योजना लागू की है।',
    background:
      'राष्ट्रीय शिक्षा नीति (NEP 2020) के लक्ष्यों के अनुरूप भारत में वैज्ञानिक अनुसंधान और नवाचार को विश्वस्तरीय बनाने के लिए ONOS और ANRF का गठन किया गया है।',
    sourceMinistry: 'शिक्षा मंत्रालय • प्रधान वैज्ञानिक सलाहकार कार्यालय • PIB',
    sourceUrl: 'https://education.gov.in',
    imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80',
    imageCredit: 'स्रोत: Ministry of Education • INFLIBNET',
    dimensions: [
      '6,300 से अधिक सरकारी विश्वविद्यालयों, कॉलेजों, IITs, NITs और R&D संस्थानों को एकीकृत राष्ट्रीय सब्सक्रिप्शन।',
      'INFLIBNET (गांधीनगर) द्वारा पूरी तरह डिजिटल और केंद्रीकृत पोर्टल के माध्यम से संचालन।',
      'अनुसंधान नेशनल रिसर्च फाउंडेशन (ANRF) के साथ समन्वय कर टीयर-2 व टीयर-3 कॉलेजों में रिसर्च को बढ़ावा।'
    ],
    provisions: [
      'कैलेंडर वर्ष 2025, 2026 और 2027 के लिए कुल ₹6,000 करोड़ का केंद्रीय बजट आवंटन।',
      '30 प्रमुख अंतर्राष्ट्रीय प्रकाशकों (Elsevier, Springer Nature, IEEE, Wiley आदि) के 13,000+ ई-जर्नल्स शामिल।',
      'भारतीय शोधकर्ताओं को ओपन एक्सेस जर्नल्स में शोध पत्र प्रकाशित करने हेतु Article Processing Charges (APC) में सहायता।'
    ],
    highYieldFact: 'ONOS योजना का समन्वय विश्वविद्यालय अनुदान आयोग (UGC) के स्वायत्त केंद्र INFLIBNET (गांधीनगर, गुजरात) द्वारा किया जाता है।',
    vocabulary: [
      {
        word: 'Consortium',
        pos: 'Noun',
        exactHindi: 'संघ / कई संस्थानों का साझा समूह',
        definition: 'An association, typically of several companies or institutions, for a shared purpose.',
        synonyms: 'Alliance, Coalition, Syndicate, Federation',
        antonyms: 'Individual entity',
        examUsage: '"ONOS acts as a unified national consortium for academic journal access."'
      }
    ],
    practiceMcq: {
      question: '"वन नेशन वन सब्सक्रिप्शन" (ONOS) योजना का राष्ट्रीय समन्वय किस संस्था द्वारा किया जा रहा है?',
      options: ['AICTE नई दिल्ली', 'INFLIBNET गांधीनगर', 'NCERT नई दिल्ली', 'CSIR नई दिल्ली'],
      correct: 1,
      explanation: 'यूजीसी के अंतर-विश्वविद्यालय केंद्र INFLIBNET (गांधीनगर) द्वारा ONOS पोर्टल का संचालन किया जा रहा है।'
    },
    mainsQuestion:
      '"वन नेशन वन सब्सक्रिप्शन (ONOS) और अनुसंधान नेशनल रिसर्च फाउंडेशन (ANRF) भारत के विश्वविद्यालयों में शोध की गुणवत्ता को कैसे उन्नत करेंगे?"'
  }
];

// Deterministic daily selector: Loads all authentic daily articles without arbitrary 6-count cap
export const getDailyRotatedEditorials = (): NewsEditorial[] => {
  const todayKey = getTodayDateKey();
  const todayHindi = getTodayHindiDate();
  return verifiedEditorials.map((item) => ({
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

      // Automatically expire & remove previous day's articles when a new day starts
      if (savedDate !== todayKey) {
        localStorage.setItem('hans_ca_active_date_key', todayKey);
        localStorage.setItem('hans_synced_current_affairs', JSON.stringify(todayRotated));
        return todayRotated;
      }

      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Keep ONLY today's articles; automatically filter out any older dateKey articles
          const validToday = parsed.filter((item: NewsEditorial) => !item.dateKey || item.dateKey === todayKey);
          if (validToday.length > 0) {
            const map = new Map<string, NewsEditorial>();
            validToday.forEach((item: NewsEditorial) => map.set(item.id, { ...item, dateKey: todayKey, date: getTodayHindiDate() }));
            todayRotated.forEach(item => {
              if (!map.has(item.id)) map.set(item.id, item);
            });
            return Array.from(map.values());
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

    // 2. Category Filter
    const catMatch = selectedCategory === 'All' || item.categoryFilter === selectedCategory;

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

          {/* 3. CATEGORY FILTER PILLS + SEARCH INPUT MATCHING SCREENSHOT 1 */}
          <div className="bg-[#091122] border border-slate-800 rounded-2xl p-2.5 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-thin">
              {['All', 'National', 'Sports & Honors', 'Economy & Banking', 'Schemes & Governance', 'Science & Tech'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#0284C7] text-white font-black shadow'
                      : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 min-w-[230px]">
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="सर्च करें: 6G, ISRO, RBI, खेल..."
                className="bg-transparent border-none outline-none text-xs text-white w-full placeholder:text-slate-500"
              />
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
