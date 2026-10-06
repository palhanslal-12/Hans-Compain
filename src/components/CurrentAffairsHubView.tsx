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
  Send,
  Play,
  Pause,
  Square,
  FastForward,
  Lock,
  Unlock,
  LogIn,
  User,
  Share,
  ArrowLeft
} from 'lucide-react';
import { recordStudyActivity, auth, signInWithGoogle } from '../firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import {
  playNaturalSpeech,
  stopNaturalSpeech,
  pauseNaturalSpeech,
  resumeNaturalSpeech
} from '../utils/naturalSpeech';
import { askHansCompainAI } from '../utils/aiClientFallback';

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
  }
];

interface CurrentAffairsHubProps {
  initialArticleId?: string | null;
  currentUser?: FirebaseUser | null;
  onLoginRequired?: () => void;
  onReturnHome?: () => void;
}

export const CurrentAffairsHubView: React.FC<CurrentAffairsHubProps> = ({
  initialArticleId,
  currentUser: initialUser,
  onLoginRequired,
  onReturnHome
}) => {
  const [editorials, setEditorials] = useState<NewsEditorial[]>(verifiedEditorials);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<NewsEditorial | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [showLiveQuizModal, setShowLiveQuizModal] = useState<boolean>(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [isGeneratingAiArticle, setIsGeneratingAiArticle] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(initialUser || auth.currentUser);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Article Reader Detail Page Controls
  const [readerTheme, setReaderTheme] = useState<'pib' | 'dark'>('pib');
  const [fontSizeLevel, setFontSizeLevel] = useState<'sm' | 'base' | 'lg'>('base');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [mcqSelected, setMcqSelected] = useState<number | null>(null);
  const [vocabSearchWord, setVocabSearchWord] = useState<string>('');
  const [vocabSearchResult, setVocabSearchResult] = useState<any | null>(null);
  const [isSearchingVocab, setIsSearchingVocab] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Audio Reader Player State
  const [isAudioActive, setIsAudioActive] = useState<boolean>(false);
  const [isAudioPaused, setIsAudioPaused] = useState<boolean>(false);
  const [activeAudioTitle, setActiveAudioTitle] = useState<string>('');
  const [speakingSentencePreview, setSpeakingSentencePreview] = useState<string>('');
  const [audioProgress, setAudioProgress] = useState<{ current: number; total: number } | null>(null);
  const [speechSpeed, setSpeechSpeed] = useState<number>(0.93);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3500);
  };

  // Sync auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      setCurrentUser(u);
    });
    return () => unsub();
  }, []);

  // Direct Article Deep Linking check on mount & hash/query change
  useEffect(() => {
    const checkDirectArticleLink = () => {
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
          const found = editorials.find(item => item.id === targetId || item.id.toLowerCase() === targetId.toLowerCase());
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
        showToast(`🎉 नमस्ते ${u.displayName || 'साथी'}! पूरा आर्टिकल व परीक्षा नोट्स अनलॉक हो गए हैं।`);
      }
    } catch (e) {
      console.warn('Login error:', e);
      if (onLoginRequired) {
        onLoginRequired();
      } else {
        showToast('लॉगिन विफल रहा। कृपया पुनः प्रयास करें।');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const filtered = editorials.filter(item => {
    const catMatch = selectedCategory === 'All' || item.categoryFilter === selectedCategory;
    const q = searchQuery.toLowerCase();
    const searchMatch =
      !q ||
      item.headline.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.categoryTag.toLowerCase().includes(q);
    return catMatch && searchMatch;
  });

  const handleReadFullArticle = (item: NewsEditorial) => {
    if (isAudioActive) {
      stopNaturalSpeech();
      setIsAudioActive(false);
      setIsAudioPaused(false);
      setAudioProgress(null);
      setSpeakingSentencePreview('');
      setActiveAudioTitle('');
      return;
    }

    const fullNarrative = [
      `संपादकीय शीर्षक: ${item.headline}।`,
      `दिनांक: ${item.date}। स्रोत: ${item.sourceMinistry}।`,
      `भाग 1: मुख्य सारांश। ${item.summary}`,
      item.background ? `भाग 2: पृष्ठभूमि व ऐतिहासिक संदर्भ। ${item.background}` : '',
      item.dimensions && item.dimensions.length > 0 ? `भाग 3: विस्तृत आयाम व मुख्य बिंदु। ${item.dimensions.join('। ')}` : '',
      item.provisions && item.provisions.length > 0 ? `भाग 4: प्रमुख नीतिगत प्रावधान। ${item.provisions.join('। ')}` : '',
      item.highYieldFact ? `विशेष परीक्षा तथ्य: ${item.highYieldFact}` : '',
      item.practiceMcq
        ? `अभ्यास प्रश्न: ${item.practiceMcq.question}। सही उत्तर है विकल्प ${String.fromCharCode(65 + item.practiceMcq.correct)}, ${item.practiceMcq.options[item.practiceMcq.correct]}। व्याख्या: ${item.practiceMcq.explanation}`
        : ''
    ]
      .filter(Boolean)
      .join('। ');

    setIsAudioActive(true);
    setIsAudioPaused(false);
    setActiveAudioTitle(item.headline);

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
    const shareText = `📰 *HANS COMPAIN PIB NEWS HUB*\n\n📌 *${item.headline}*\n\n👉 *सीधे यह पूरा आर्टिकल पढ़ने के लिए लिंक पर क्लिक करें:*\n🔗 ${directUrl}\n\n📝 *मुख्य सारांश (Quick Summary):*\n${item.summary.slice(0, 160)}...\n\n🏛️ *स्रोत:* ${item.sourceMinistry}\n_HANS COMPAIN - Official Competitive Exams & Steno Hub_`;

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
          setTimeout(() => setCopiedLink(false), 2500);
          showToast('🔗 डायरेक्ट आर्टिकल लिंक कॉपी हो गया है!');
        });
    } else {
      navigator.clipboard?.writeText(shareText);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
      showToast('🔗 डायरेक्ट आर्टिकल लिंक कॉपी हो गया है! अब आप इसे सीधे व्हाट्सएप स्टेटस या सोशल मीडिया पर शेयर कर सकते हैं।');
      const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
      window.open(waUrl, '_blank');
    }
  };

  const handleShareToPlatform = (platform: 'wa' | 'insta' | 'tele') => {
    if (!activeArticle) return;
    const directUrl = getDirectArticleUrl(activeArticle);
    const shareText = `📰 *HANS COMPAIN PIB NEWS HUB*\n\n📌 *${activeArticle.headline}*\n\n👉 *सीधे यह पूरा आर्टिकल पढ़ने के लिए लिंक पर टैप करें:*\n🔗 ${directUrl}\n\n📝 *मुख्य सारांश (Quick Summary):*\n${activeArticle.summary.slice(0, 160)}...\n\n🏛️ *स्रोत:* ${activeArticle.sourceMinistry}\n_HANS COMPAIN - Official Competitive Exams & Steno Hub_`;

    if (platform === 'wa') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
    } else if (platform === 'tele') {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(directUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
    } else {
      navigator.clipboard?.writeText(shareText);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
      showToast('📋 पूरा डायरेक्ट लिंक और सारांश कॉपी हो गया है! अब आप इसे सीधे व्हाट्सएप स्टेटस या इंस्टाग्राम पर पेस्ट कर सकते हैं।');
    }
  };

  // Live AI Vocabulary & Anto-Syno search
  const handleVocabSearch = async () => {
    if (!vocabSearchWord.trim()) return;
    setIsSearchingVocab(true);
    try {
      const prompt = `Give the dictionary definition, exact Hindi meaning, parts of speech, 4 Synonyms, 3 Antonyms, and 1 exam-relevant example sentence for the word "${vocabSearchWord}". 
Format response in JSON with keys: word, pos, exactHindi, definition, synonyms, antonyms, examUsage.`;
      const response = await askHansCompainAI(prompt, null, 'chat');
      let parsed: any = null;
      try {
        const cleaned = response.replace(/```json/g, '').replace(/```/g, '').trim();
        const start = cleaned.indexOf('{');
        const end = cleaned.lastIndexOf('}');
        if (start !== -1 && end !== -1) {
          parsed = JSON.parse(cleaned.substring(start, end + 1));
        }
      } catch {
        // fallback
      }

      if (parsed) {
        setVocabSearchResult(parsed);
      } else {
        setVocabSearchResult({
          word: vocabSearchWord,
          pos: 'Noun / Term',
          exactHindi: 'महत्वपूर्ण शब्दावली',
          definition: response.slice(0, 150),
          synonyms: 'Relevant, Key, Vital',
          antonyms: 'Irrelevant, Minor',
          examUsage: `The concept of ${vocabSearchWord} is frequently tested in competitive examinations.`
        });
      }
    } catch {
      setVocabSearchResult({
        word: vocabSearchWord,
        pos: 'Noun',
        exactHindi: 'महत्वपूर्ण परीक्षा शब्द',
        definition: 'Competitive examination vocabulary term.',
        synonyms: 'Vital, Essential',
        antonyms: 'Trivial',
        examUsage: 'Important for editorial reading comprehension.'
      });
    } finally {
      setIsSearchingVocab(false);
    }
  };

  const handleGenerateAiArticle = async () => {
    setIsGeneratingAiArticle(true);
    try {
      const topic = searchQuery.trim() || 'ISRO Gaganyaan & Bharatiya Antariksh Station 2026';
      const prompt = `Write a comprehensive PIB & The Hindu editorial style news article on "${topic}" in Hindi. Include executive summary, background, 3 dimensions, high-yield facts, and 1 practice MCQ.`;
      const response = await askHansCompainAI(prompt, null, 'chat');

      const newEd: NewsEditorial = {
        id: `news-${Date.now()}`,
        categoryTag: 'AI PIB EDITORIAL',
        categoryFilter: 'Science & Tech',
        date: '6 अक्टूबर 2026',
        readTime: '3 मिनट Read',
        releaseId: `20658179125${Math.floor(10000000 + Math.random() * 90000000)}`,
        headline: `${topic}: परीक्षा विशेष समसामयिक विश्लेषण`,
        summary: response.slice(0, 240) + '...',
        background: `अंतरिक्ष विज्ञान और भारत की तकनीकी आत्मनिर्भरता में यह विकास मील का पत्थर है।`,
        sourceMinistry: 'प्रेस सूचना ब्यूरो (PIB) • HANS COMPAIN AI Editorial Desk',
        sourceUrl: 'https://pib.gov.in',
        imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
        imageCredit: 'स्रोत: ISRO Media • Press Information Bureau',
        dimensions: [
          'मानवयुक्त अंतरिक्ष उड़ान और स्वदेशी लाइफ सपोर्ट सिस्टम का सफल परीक्षण।',
          'भारतीय अंतरिक्ष स्टेशन (BAS) का प्रथम मॉड्यूल 2028 तक प्रक्षेपित करने की समय-सीमा।',
          'गगनयात्री प्रशिक्षण और क्रू मॉड्यूल रिकवरी प्रणाली का सुदृढ़ीकरण।'
        ],
        provisions: [
          'अंतरिक्ष विभाग (DoS) और इन-स्पेस (IN-SPACe) का सार्वजनिक-निजी सहयोग ढांचा।',
          'राष्ट्रीय अंतरिक्ष नीति 2023 के तहत गैर-सरकारी संस्थाओं की भागीदारी।',
          'मिशन गगनयान के लिए ₹20,000+ करोड़ का समग्र वित्तीय आवंटन।'
        ],
        highYieldFact: 'भारत 2035 तक अपना अंतरिक्ष स्टेशन और 2040 तक चंद्रमा पर मानव उतारने का लक्ष्य लेकर चल रहा है।',
        vocabulary: [
          {
            word: 'Indigenous',
            pos: 'Adjective',
            exactHindi: 'स्वदेशी / स्थानीय रूप से निर्मित',
            definition: 'Originating or occurring naturally in a particular place; native.',
            synonyms: 'Native, Domestic, Homegrown',
            antonyms: 'Foreign, Imported, Alien',
            examUsage: '"Indigenous cryogenic engine powers India\'s heavy rocket launches."'
          },
          {
            word: 'Payload',
            pos: 'Noun',
            exactHindi: 'पेलोड / वहन भार / उपयोगी वैज्ञानिक उपकरण',
            definition: 'The part of a vehicle\'s load, especially an aircraft or rocket, from which revenue is derived.',
            synonyms: 'Cargo, Load, Instrumentation',
            antonyms: 'Ballast',
            examUsage: '"The rocket carried scientific observation payloads into geostationary orbit."'
          },
          {
            word: 'Trajectory',
            pos: 'Noun',
            exactHindi: 'प्रक्षेप पथ / मार्ग',
            definition: 'The path followed by a projectile flying or an object moving under the action of given forces.',
            synonyms: 'Path, Orbit, Course, Flight path',
            antonyms: 'Deviation',
            examUsage: '"The spacecraft maintained a nominal trajectory toward lunar orbit."'
          }
        ],
        practiceMcq: {
          question: 'भारत के पहले मानवयुक्त अंतरिक्ष मिशन का आधिकारिक नाम क्या है?',
          options: ['आदित्य-L1', 'चंद्रयान-3', 'गगनयान', 'शुक्रयान-1'],
          correct: 2,
          explanation: 'गगनयान भारत का पहला मानवयुक्त अंतरिक्ष मिशन है।'
        },
        mainsQuestion:
          '"अंतरिक्ष क्षेत्र में वाणिज्यिक निवेश और स्वदेशी तकनीकी क्षमता भारत की वैश्विक भू-राजनीतिक स्थिति को कैसे सुदृढ़ करती है?"'
      };

      setEditorials(prev => [newEd, ...prev]);
      handleOpenArticle(newEd);
    } catch {
      // fallback
    } finally {
      setIsGeneratingAiArticle(false);
    }
  };

  const isUserAuthenticated = !!currentUser;

  return (
    <div className="w-full space-y-5 animate-fade-in pb-16">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#0F172A] border border-cyan-500 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 animate-fade-in">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* -------------------------------------------------------------
          VIEW A: FULL ARTICLE PIB DETAIL VIEW (EXACT MATCH TO SCREENSHOTS 2 & 3)
          ------------------------------------------------------------- */}
      {activeArticle ? (
        <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in">
          {/* 1. TOP ACTION TOOLBAR MATCHING SCREENSHOT 2 */}
          <div className="bg-[#091122] border border-slate-800 rounded-2xl p-2.5 sm:p-3 flex flex-wrap items-center justify-between gap-2.5 shadow-xl sticky top-2 z-30 backdrop-blur-md">
            {/* PIB vs Dark Theme Switcher */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setReaderTheme('pib')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                  readerTheme === 'pib'
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>📰 PIB Release View</span>
              </button>
              <button
                onClick={() => setReaderTheme('dark')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                  readerTheme === 'dark'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>📱 Dark App View</span>
              </button>
            </div>

            {/* Middle Tools: Print, Font-size, AI Doubt, Audio, Bookmark, Share */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => window.print()}
                className="p-2 rounded-xl bg-slate-900 border border-slate-750 text-slate-300 hover:text-white cursor-pointer"
                title="प्रिंट करें / PDF सेव करें"
              >
                <Printer className="w-3.5 h-3.5" />
              </button>

              {/* Font Size A- / A / A+ */}
              <div className="flex items-center bg-slate-900 border border-slate-750 rounded-xl p-0.5 text-xs font-bold">
                <button
                  onClick={() => setFontSizeLevel('sm')}
                  className={`px-2 py-1 rounded-lg ${fontSizeLevel === 'sm' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}
                >
                  A-
                </button>
                <button
                  onClick={() => setFontSizeLevel('base')}
                  className={`px-2 py-1 rounded-lg ${fontSizeLevel === 'base' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}
                >
                  A
                </button>
                <button
                  onClick={() => setFontSizeLevel('lg')}
                  className={`px-2 py-1 rounded-lg ${fontSizeLevel === 'lg' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}
                >
                  A+
                </button>
              </div>

              {/* AI Doubt */}
              <button
                onClick={() => {
                  speakText(activeArticle.headline + '. ' + activeArticle.summary);
                }}
                className="px-3 py-1.5 rounded-xl bg-[#0F172A] border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center gap-1 cursor-pointer hover:bg-slate-800"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>AI डाउट</span>
              </button>

              {/* Full Audio Listen */}
              <button
                onClick={() => handleReadFullArticle(activeArticle)}
                className={`px-3 py-1.5 rounded-xl border font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
                  isAudioActive
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-md animate-pulse'
                    : 'bg-slate-900 border-slate-750 text-slate-200 hover:text-white'
                }`}
                title="पूरी खबर और परीक्षा नोट्स आवाज में सुनें"
              >
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isAudioActive ? 'ऑडियो बंद करें' : 'पूरी खबर सुनें'}</span>
              </button>

              {/* Bookmark */}
              <button
                onClick={() =>
                  setBookmarkedIds(prev =>
                    prev.includes(activeArticle.id) ? prev.filter(x => x !== activeArticle.id) : [...prev, activeArticle.id]
                  )
                }
                className={`p-2 rounded-xl border cursor-pointer ${
                  bookmarkedIds.includes(activeArticle.id)
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-slate-900 border-slate-750 text-slate-300'
                }`}
                title="बुकमार्क"
              >
                <Bookmark className="w-3.5 h-3.5" />
              </button>

              {/* Direct Share Link */}
              <button
                onClick={() => handleShareArticle(activeArticle)}
                className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center gap-1 cursor-pointer hover:bg-amber-500 hover:text-slate-950 transition-all"
                title="डायरेक्ट आर्टिकल लिंक शेयर करें"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>डायरेक्ट लिंक शेयर</span>
              </button>

              {/* English Translate */}
              <button
                onClick={() => setIsTranslating(!isTranslating)}
                className="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 font-bold text-xs flex items-center gap-1 cursor-pointer hover:bg-amber-200"
              >
                <Languages className="w-3.5 h-3.5" />
                <span>English Translate</span>
              </button>

              {/* Close Button */}
              <button
                onClick={handleCloseArticle}
                className="p-1.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500 hover:text-white cursor-pointer ml-1"
                title="आर्टिकल बंद करें व वापस जाएं"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Direct Link Banner */}
          <div className="p-3 bg-[#0B1426] border border-cyan-500/30 rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-cyan-300 font-bold min-w-0">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="truncate">🔗 यह डायरेक्ट आर्टिकल लिंक है जिसे कहीं भी साझा किया जा सकता है</span>
            </div>
            <button
              onClick={() => handleShareArticle(activeArticle)}
              className="px-3 py-1 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs flex items-center gap-1 cursor-pointer shadow shrink-0"
            >
              <Copy className="w-3 h-3" />
              <span>{copiedLink ? 'लिंक कॉपी हो गया!' : 'डायरेक्ट लिंक कॉपी करें'}</span>
            </button>
          </div>

          {/* 2. OFFICIAL PIB EMBLEM ARTICLE CONTAINER (EXACT MATCH TO SCREENSHOTS 2 & 3) */}
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

            <div className="p-5 sm:p-8 space-y-6">
              {/* PIB Official Header */}
              <div className="text-center space-y-1 border-b border-slate-200/80 pb-4">
                <div className="text-[11px] font-black text-[#A16207] tracking-widest uppercase">
                  सत्यमेव जयते
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  पत्र सूचना कार्यालय
                </h2>
                <div className="text-xs font-bold text-slate-600">भारत सरकार</div>
              </div>

              {/* Meta details bar: Ministry & Release ID */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border-b border-slate-200/80 pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className="font-bold text-slate-700">{activeArticle.sourceMinistry}</span>
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
              <div className="space-y-2">
                <h1 className="text-xl sm:text-3xl font-black text-slate-950 leading-tight font-hindi-title">
                  {activeArticle.headline}
                </h1>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                  <span>🎯 विशेष परीक्षा विश्लेषण सामग्री (IAS/SSC हेतु उपयोगी)</span>
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

              {/* Certified Source Card Matching Screenshot 2 */}
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
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

              {/* Social Share Bar Matching Screenshot 2 */}
              <div className="p-3.5 rounded-2xl bg-slate-100/90 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>दोस्तों व स्टडी ग्रुप्स के साथ डायरेक्ट आर्टिकल लिंक साझा करें:</span>
                </span>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleShareToPlatform('wa')}
                    className="px-3 py-1.5 rounded-xl bg-[#25D366] text-white font-black text-xs flex items-center gap-1 cursor-pointer shadow-sm hover:opacity-90"
                    title="व्हाट्सएप स्टेटस / चैट पर भेजें"
                  >
                    <span>WhatsApp</span>
                  </button>
                  <button
                    onClick={() => handleShareToPlatform('insta')}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white font-black text-xs flex items-center gap-1 cursor-pointer shadow-sm hover:opacity-90"
                    title="इंस्टाग्राम पर शेयर करें"
                  >
                    <span>Instagram</span>
                  </button>
                  <button
                    onClick={() => handleShareToPlatform('tele')}
                    className="px-3 py-1.5 rounded-xl bg-[#0088cc] text-white font-black text-xs flex items-center gap-1 cursor-pointer shadow-sm hover:opacity-90"
                    title="टेलीग्राम पर भेजें"
                  >
                    <span>Telegram</span>
                  </button>
                  <button
                    onClick={() => handleShareToPlatform('insta')}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-black text-xs flex items-center gap-1 cursor-pointer shadow-sm hover:bg-slate-800"
                    title="लिंक कॉपी करें"
                  >
                    {copiedLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedLink ? 'Copied' : 'लिंक कॉपी'}</span>
                  </button>
                </div>
              </div>

              {/* Verified Official Source Callout Matching Screenshot 2 */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCheck className="w-4 h-4 text-emerald-600" />
                    <span>सत्यापित आधिकारिक स्रोत • 📅 {activeArticle.date}</span>
                  </div>
                  <div className="text-slate-800 font-bold">{activeArticle.sourceMinistry}</div>
                  <p className="text-[11px] text-slate-600">
                    यह विश्लेषण आधिकारिक सरकारी विज्ञप्ति, संबंधित मंत्रालय एवं प्रमुख राष्ट्रीय दैनिकों द्वारा जारी सूचना पर आधारित है।
                  </p>
                </div>

                <a
                  href={activeArticle.sourceUrl || 'https://pib.gov.in'}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs flex items-center gap-1 shrink-0"
                >
                  <Globe className="w-3 h-3 text-cyan-400" />
                  <span>मूल स्रोत देखें</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* 1. मुख्य सारांश (EXECUTIVE SUMMARY) - PREVIEW 2-4 LINES ALWAYS VISIBLE */}
              <div className="p-5 rounded-2xl bg-amber-50/80 border-l-4 border-amber-500 shadow-sm space-y-2">
                <h3 className="text-xs font-black uppercase text-amber-900 tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-700" />
                  <span>1. मुख्य सारांश (EXECUTIVE SUMMARY)</span>
                </h3>
                <p className={`text-slate-900 leading-relaxed font-medium ${fontSizeLevel === 'sm' ? 'text-xs' : fontSizeLevel === 'lg' ? 'text-base' : 'text-sm'}`}>
                  {activeArticle.summary}
                </p>
              </div>

              {/* -----------------------------------------------------------
                  ACCESS CONTROL GATE: IF USER NOT LOGGED IN, SHOW LOGIN GATE
                  ----------------------------------------------------------- */}
              {!isUserAuthenticated ? (
                <div className="relative mt-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-950 via-[#091122] to-slate-950 border-2 border-amber-500/60 shadow-2xl text-center space-y-5 text-white overflow-hidden">
                  <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="absolute bottom-0 left-0 transform -translate-x-4 translate-y-4 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

                  <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-lg">
                    <Lock className="w-7 h-7" />
                  </div>

                  <div className="space-y-2 max-w-lg mx-auto">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-black uppercase">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>HANS COMPAIN 100% FREE ACCESS</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
                      🔐 पूरा आर्टिकल, विस्तृत आयाम व परीक्षा नोट्स अनलॉक करें
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      आपने प्रारंभिक 2-4 लाइन सारांश पढ़ लिया है। आगे के सभी महत्वपूर्ण अनुभाग (पृष्ठभूमि, नीतिगत प्रावधान, परीक्षा फैक्ट्स, वोकैबुलरी और Prelims MCQ) 100% निःशुल्क अनलॉक करने के लिए कृपया 1-क्लिक लॉगिन करें।
                    </p>
                  </div>

                  {/* Feature Checklist inside Unlock Card */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md mx-auto text-left text-xs text-slate-300">
                    <div className="flex items-center gap-2 bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>विस्तृत आयाम (In-depth Dimensions)</span>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>नीतिगत प्रावधान (Key Provisions)</span>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>संपादकीय Anto-Syno वोकैबुलरी</span>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>इंटरएक्टिव Prelims MCQ & मुख्य प्रश्न</span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                    <button
                      onClick={handleGoogleLogin}
                      disabled={isLoggingIn}
                      className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2.5 shadow-xl hover:scale-[1.02] transition-all cursor-pointer"
                    >
                      <User className="w-4 h-4" />
                      <span>{isLoggingIn ? 'लॉगिन हो रहा है...' : 'Google से 1-क्लिक लॉगिन करें (100% Free)'}</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>100% सुरक्षित • कोई क्रेडिट कार्ड या भुगतान नहीं</span>
                  </p>
                </div>
              ) : (
                /* -----------------------------------------------------------
                   FULL UNLOCKED ARTICLE CONTENT (FOR AUTHENTICATED USERS)
                   ----------------------------------------------------------- */
                <div className="space-y-6 animate-fade-in">
                  {/* 2. पृष्ठभूमि व ऐतिहासिक संदर्भ (BACKGROUND & GENESIS) Matching Screenshot 2 */}
                  <div className="p-5 rounded-2xl bg-sky-50/70 border-l-4 border-sky-500 shadow-sm space-y-2">
                    <h3 className="text-xs font-black uppercase text-sky-900 tracking-wider flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-sky-700" />
                      <span>2. पृष्ठभूमि व ऐतिहासिक संदर्भ (BACKGROUND &amp; GENESIS)</span>
                    </h3>
                    <p className={`text-slate-900 leading-relaxed font-medium ${fontSizeLevel === 'sm' ? 'text-xs' : fontSizeLevel === 'lg' ? 'text-base' : 'text-sm'}`}>
                      {activeArticle.background}
                    </p>
                  </div>

                  {/* VOCABULARY, SYNONYMS & ANTONYMS STUDIO Matching Screenshot 2 & 3 */}
                  <div className="p-5 sm:p-6 rounded-3xl bg-slate-100/90 border border-slate-300 space-y-4 shadow-sm">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wider">
                        <BookOpen className="w-4 h-4 text-indigo-600" />
                        <span>संपादकीय शब्दावली, पर्यायवाची व विलोम शब्द (VOCABULARY, SYNONYMS &amp; ANTONYMS)</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        द हिन्दू व PIB संपादकीय में प्रयुक्त कठिन शब्दों का परीक्षा विश्लेषण
                      </p>
                    </div>

                    {/* 3 Dark Vocabulary Cards Matching Screenshot 2 */}
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
                                  onClick={() => speakText(`${vocab.word}. ${vocab.exactHindi}. ${vocab.definition}`)}
                                  className="p-1 text-slate-400 hover:text-white cursor-pointer"
                                  title="सुनें"
                                >
                                  <Volume2 className="w-3 h-3" />
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

                    {/* AI WORD DETECTOR & VOCABULARY SEARCH (ANTO-SYNO EXPLORER) Matching Screenshot 3 */}
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-black text-slate-800 uppercase flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>AI वर्ड डिटेक्टर व वोकैबुलरी खोज (ANTO-SYNO EXPLORER)</span>
                        </span>
                        <span className="text-slate-400 text-[10px]">आर्टिकल का कोई भी शब्द लिखें</span>
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={vocabSearchWord}
                          onChange={e => setVocabSearchWord(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleVocabSearch()}
                          placeholder="उदा. Autonomous, Sovereign, Disinflation..."
                          className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-indigo-500"
                        />
                        <button
                          onClick={handleVocabSearch}
                          disabled={isSearchingVocab}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs flex items-center gap-1 cursor-pointer shadow hover:opacity-95 shrink-0"
                        >
                          <Sparkles className="w-3 h-3 text-amber-300" />
                          <span>{isSearchingVocab ? 'खोज रहे हैं...' : 'अर्थ व Anto-Syno'}</span>
                        </button>
                      </div>

                      {vocabSearchResult && (
                        <div className="p-3 bg-slate-900 text-white rounded-xl text-xs space-y-1 animate-fade-in border border-indigo-500/40">
                          <div className="flex items-center justify-between">
                            <span className="font-black text-cyan-300 text-sm">
                              {vocabSearchResult.word} ({vocabSearchResult.pos})
                            </span>
                            <span className="text-amber-300 font-bold">{vocabSearchResult.exactHindi}</span>
                          </div>
                          <p className="text-slate-300 text-[11px]">{vocabSearchResult.definition}</p>
                          <div className="text-[10px] text-slate-300">
                            <strong className="text-emerald-400">Synonyms:</strong> {vocabSearchResult.synonyms} |{' '}
                            <strong className="text-rose-400">Antonyms:</strong> {vocabSearchResult.antonyms}
                          </div>
                          <p className="text-[10px] text-slate-400 italic">
                            <strong>Exam Usage:</strong> {vocabSearchResult.examUsage}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 3. विस्तृत आयाम व मुख्य बिंदु (IN-DEPTH DIMENSIONS) Matching Screenshot 3 */}
                  <div className="p-5 rounded-2xl bg-emerald-50/80 border-l-4 border-emerald-500 shadow-sm space-y-3">
                    <h3 className="text-xs font-black uppercase text-emerald-950 tracking-wider flex items-center gap-2">
                      <Zap className="w-4 h-4 text-emerald-700" />
                      <span>3. विस्तृत आयाम व मुख्य बिंदु (IN-DEPTH DIMENSIONS)</span>
                    </h3>
                    <div className="space-y-2">
                      {activeArticle.dimensions.map((dim, dIdx) => (
                        <div key={dIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-900 font-medium">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 font-black" />
                          <span>{dim}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 4. प्रमुख नीतिगत प्रावधान (KEY PROVISIONS & DATA) Matching Screenshot 3 */}
                  <div className="p-5 rounded-2xl bg-indigo-50/70 border-l-4 border-indigo-500 shadow-sm space-y-3">
                    <h3 className="text-xs font-black uppercase text-indigo-950 tracking-wider flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-indigo-700" />
                      <span>4. प्रमुख नीतिगत प्रावधान (KEY PROVISIONS &amp; DATA)</span>
                    </h3>
                    <div className="space-y-2">
                      {activeArticle.provisions.map((prov, pIdx) => (
                        <div key={pIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-900 font-medium">
                          <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 mt-1.5" />
                          <span>{prov}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* HIGH-YIELD EXAM FACT CALLOUT Matching Screenshot 3 */}
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 shadow-sm space-y-1.5">
                    <div className="text-xs font-black text-amber-900 uppercase flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-amber-600" />
                      <span>हाई-यील्ड एग्जाम फैक्ट (HIGH-YIELD EXAM FACT):</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-900 font-bold leading-relaxed">
                      {activeArticle.highYieldFact}
                    </p>
                  </div>

                  {/* INTERACTIVE PRACTICE MCQ Matching Screenshot 3 */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-md space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="text-xs font-black text-slate-900 uppercase flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4 text-cyan-600" />
                        <span>अभ्यास प्रश्न (INTERACTIVE PRACTICE MCQ)</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                        Prelims Level
                      </span>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs sm:text-sm font-black text-slate-900">
                        {activeArticle.practiceMcq.question}
                      </h4>

                      <div className="space-y-2">
                        {activeArticle.practiceMcq.options.map((opt, oIdx) => {
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
                              className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm font-semibold flex items-center justify-between cursor-pointer transition-all ${btnStyle}`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 text-slate-600 text-xs font-bold flex items-center justify-center">
                                  {String.fromCharCode(65 + oIdx)}
                                </span>
                                <span>{opt}</span>
                              </div>
                              {mcqSelected !== null && isRight && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                              {mcqSelected !== null && isPicked && !isRight && <XCircle className="w-4 h-4 text-rose-600" />}
                            </button>
                          );
                        })}
                      </div>

                      {mcqSelected !== null && (
                        <div className="p-3.5 bg-indigo-50 rounded-xl border border-indigo-200 text-xs text-indigo-950 animate-fade-in">
                          <strong className="text-indigo-900">उत्तर व्याख्या:</strong> {activeArticle.practiceMcq.explanation}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* MAINS ANALYTICAL QUESTION Matching Screenshot 3 */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm space-y-1.5">
                    <div className="text-xs font-black text-slate-800 uppercase flex items-center gap-1.5">
                      <span>✍️ मुख्य परीक्षा संभावित प्रश्न (MAINS ANALYTICAL QUESTION):</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 italic leading-relaxed font-medium">
                      {activeArticle.mainsQuestion}
                    </p>
                  </div>
                </div>
              )}

              {/* Bottom Actions Matching Screenshot 3 */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => {
                    speakText(activeArticle.headline);
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:opacity-95"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>इस आर्टिकल पर Hans Compain से डाउट पूछें</span>
                </button>

                <button
                  onClick={handleCloseArticle}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs sm:text-sm cursor-pointer"
                >
                  वापस करंट अफेयर्स सूची पर जाएं
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
          {/* 1. WHITE HEADER BANNER EXACTLY MATCHING SCREENSHOT 1 */}
          <div className="bg-white text-slate-900 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 border border-slate-200">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shrink-0">
                <Newspaper className="w-7 h-7" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight uppercase">
                    HANS COMPAIN NEWS HUB
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-lg bg-amber-100 border border-amber-300 text-amber-800 text-[10px] font-black uppercase">
                    PIB INTEGRATED
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  हर सपने को मिलेगी उड़ान, जब साथ हो Hans Compain का सच्चा ज्ञान!
                </p>
              </div>
            </div>

            {/* 3 Action Buttons Matching Screenshot 1 */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setEditorials([...verifiedEditorials])}
                className="px-4 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>ताजा खबरें रिफ्रेश</span>
              </button>

              <button
                onClick={handleGenerateAiArticle}
                disabled={isGeneratingAiArticle}
                className="px-4 py-2 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{isGeneratingAiArticle ? 'जनरेट हो रहा है...' : 'AI आर्टिकल जनरेटर'}</span>
              </button>

              <button
                onClick={() => setShowLiveQuizModal(true)}
                className="px-4 py-2 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow"
              >
                <Flame className="w-3.5 h-3.5 text-amber-300" />
                <span>आज का लाइव टेस्ट</span>
              </button>
            </div>
          </div>

          {/* 2. CATEGORY FILTER PILLS + SEARCH INPUT MATCHING SCREENSHOT 1 */}
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

          {/* 3. 2-COLUMN WHITE EDITORIAL CARDS GRID (EXACT MATCH TO SCREENSHOT 1) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map(item => {
              const isSaved = bookmarkedIds.includes(item.id);
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
                          title="डायरेक्ट आर्टिकल लिंक शेयर करें"
                        >
                          <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                        </button>
                      </div>
                    </div>

                    {/* Bold Hindi Editorial Headline */}
                    <h2
                      className="text-base sm:text-lg font-black text-slate-900 leading-snug hover:text-blue-600 transition-colors cursor-pointer"
                      onClick={() => handleOpenArticle(item)}
                    >
                      {item.headline}
                    </h2>

                    {/* Summary Excerpt (2 to 4 lines) */}
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
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
