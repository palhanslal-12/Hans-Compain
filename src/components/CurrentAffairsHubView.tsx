import React, { useState, useEffect, useRef } from 'react';
import { 
  Newspaper, Calendar, Sparkles, Zap, Award, Search, BookOpen, 
  Volume2, VolumeX, Share2, ArrowRight, CheckCircle2, Bookmark, 
  Flame, Target, MessageSquare, Send, Mic, MicOff, X, 
  HelpCircle, RefreshCw, ChevronRight, Lightbulb, FileText, Check,
  Printer
} from 'lucide-react';
import { speakText, stopAllSpeech } from '../utils/speechUtils';

interface CurrentAffairsHubViewProps {
  onStartQuiz?: (topic: string) => void;
  showToast: (msg: string, type?: 'info' | 'success' | 'warn' | 'error') => void;
  language?: string;
  user?: any;
  onOpenLogin?: () => void;
}

export interface DetailedArticleItem {
  id: string;
  category: 'National' | 'International' | 'Economy & Banking' | 'Science & Tech' | 'Sports' | 'State Affairs' | 'Schemes & Governance';
  imageUrl?: string;
  titleHi: string;
  titleEn: string;
  summaryHi: string;
  summaryEn: string;
  date: string;
  readTime: string;
  examRelevance: string; // e.g. "UPSC CSE / SSC CGL / BPSC / Railway"
  keyFact: string;
  tag: string;
  
  // Detailed Deep-Dive Article Sections
  backgroundHi: string;
  backgroundEn: string;
  deepAnalysisHi: string[];
  deepAnalysisEn: string[];
  keyProvisionsHi: string[];
  keyProvisionsEn: string[];
  examImpactHi: string;
  examImpactEn: string;

  // Embedded Practice Questions
  mcq: {
    questionHi: string;
    questionEn: string;
    optionsHi: string[];
    optionsEn: string[];
    correctIndex: number;
    explanationHi: string;
    explanationEn: string;
  };
  mainsQuestionHi: string;
  mainsQuestionEn: string;
}

const ARTICLES_DATABASE: DetailedArticleItem[] = [
  {
    id: 'ca-1',
    category: 'National',
    titleHi: 'भारत ने 6G मिशन और सेमीकंडक्टर फैब्रिकेशन इकोसिस्टम का किया ऐतिहासिक विस्तार',
    titleEn: 'India Expands Indigenous 6G Mission & Semiconductor Fab Ecosystem',
    summaryHi: 'केंद्रीय इलेक्ट्रॉनिक्स और आईटी मंत्रालय ने राष्ट्रीय 6G विज़न डॉक्यूमेंट 2.0 और स्वदेशी सेमीकंडक्टर निर्माण हब के नए चरण को मंजूरी दी, जिससे भारत इलेक्ट्रॉनिक्स विनिर्माण में पूर्ण आत्मनिर्भरता की ओर अग्रसर है।',
    summaryEn: 'Ministry of Electronics & IT approved Phase 2.0 of National 6G Vision Document and indigenous Semiconductor Fab hubs, aiming for complete hardware supply chain autonomy.',
    date: '26 अगस्त 2026',
    readTime: '4 मिनट',
    examRelevance: 'UPSC CSE (GS-3 Science & Tech), SSC CGL Mains, BPSC, Railway RRB',
    keyFact: 'भारत सेमीकंडक्टर मिशन (ISM 2.0) का कुल वित्तीय परिव्यय ₹76,000 करोड़ से अधिक है।',
    tag: 'Technology & Economy',

    backgroundHi: 'वैश्विक चिप संकट और आपूर्ति श्रृंखला की बाधाओं को देखते हुए भारत ने 2021 में इंडिया सेमीकंडक्टर मिशन (ISM) शुरू किया था। अब 6G तकनीक और AI चिप्स की बढ़ती मांग के साथ भारत ने गुजरात (धोलेरा) और असम (मोरीगांव) में बड़े पैमाने पर फैब और OSAT संयंत्र स्थापित करने का काम तेज किया है।',
    backgroundEn: 'In response to global supply disruptions, India launched the ISM in 2021. Now, driven by 6G architecture and generative AI demands, India has accelerated commercial-scale chip foundries in Dholera (Gujarat) and Morigaon (Assam).',

    deepAnalysisHi: [
      '6G तकनीक 5G की तुलना में 100 गुना अधिक गति (1 Terabit per second तक) और अल्ट्रा-लो लेटेंसी (<0.1 ms) प्रदान करेगी।',
      'स्वदेशी बौद्धिक संपदा (IP) और पेटेंट विकास पर विशेष जोर दिया गया है, जिसमें IIT मद्रास और C-DOT मुख्य अनुसंधान केंद्र हैं।',
      'सेमीकंडक्टर चिप्स मोबाइल, रक्षा उपकरण, ऑटोमोबाइल और अंतरिक्ष प्रौद्योगिकियों की रीढ़ हैं।',
      'विश्व बैंक और संयुक्त राष्ट्र की रिपोर्टों के अनुसार, 2030 तक भारत का सेमीकंडक्टर बाजार $100 बिलियन पार कर जाएगा।'
    ],
    deepAnalysisEn: [
      '6G technology delivers up to 100x faster bandwidth (up to 1 Tbps) and ultra-low latency (<0.1ms) compared to 5G.',
      'Significant focus placed on indigenous IP rights and patents led by IIT Madras and C-DOT research consortia.',
      'Semiconductor chips form the critical backbone of defense avionics, electric vehicles, mobile telecom, and space satellites.',
      'Global market forecasts project India’s domestic semiconductor consumption to exceed $100 Billion by 2030.'
    ],

    keyProvisionsHi: [
      'राज्यों के सहयोग से 50% वित्तीय सहायता (Fiscal Support) केंद्र सरकार द्वारा प्रदान की जा रही है।',
      'टैलेंट पूल निर्माण: 85,000 से अधिक बी.टेक और एम.टेक छात्रों को चिप डिजाइनिंग टूल्स में प्रशिक्षित किया जा रहा है।',
      'कंपाउंड सेमीकंडक्टर्स (SiC & GaN) और डिस्प्ले फैब के लिए विशेष प्रोत्साहन पैकेज।'
    ],
    keyProvisionsEn: [
      '50% capital expenditure support on pari-passu basis by Central Government.',
      'Comprehensive Talent Pipeline: Training over 85,000 engineers in modern EDA design workflows.',
      'Specialized incentive brackets for Compound Semiconductors (Silicon Carbide & Gallium Nitride).'
    ],

    examImpactHi: 'प्रारंभिक परीक्षा के लिए ISM के घटक, नोडल मंत्रालय, और 6G व 5G में अंतर महत्वपूर्ण हैं। मुख्य परीक्षा (GS-3) में "भारत में सेमीकंडक्टर निर्माण की चुनौतियां और संभावनाएं" पर सीधा प्रश्न पूछा जा सकता है।',
    examImpactEn: 'Prelims focus: Nodal agencies, incentive percentages, Terahertz spectrum band. Mains focus: Geopolitics of semiconductor supply chain and self-reliance challenges.',

    mcq: {
      questionHi: 'भारत सेमीकंडक्टर मिशन (ISM) का कार्यान्वयन किस नोडल एजेंसी द्वारा किया जा रहा है?',
      questionEn: 'Which nodal agency implements the India Semiconductor Mission (ISM)?',
      optionsHi: ['नीति आयोग (NITI Aayog)', 'डिजिटल इंडिया कॉर्पोरेशन (DIC / MeitY)', 'इसरो (ISRO)', 'डीआरडीओ (DRDO)'],
      optionsEn: ['NITI Aayog', 'Digital India Corporation (MeitY)', 'ISRO', 'DRDO'],
      correctIndex: 1,
      explanationHi: 'ISM को इलेक्ट्रॉनिक्स और सूचना प्रौद्योगिकी मंत्रालय (MeitY) के तहत डिजिटल इंडिया कॉर्पोरेशन (DIC) में एक स्वतंत्र व्यापार प्रभाग के रूप में स्थापित किया गया है।',
      explanationEn: 'ISM is designated as an independent business division within Digital India Corporation under the Ministry of Electronics & IT.'
    },
    mainsQuestionHi: 'प्रश्न: भारत के डिजिटल संप्रभुता (Digital Sovereignty) और 6G विकास में सेमीकंडक्टर विनिर्माण की क्या भूमिका है? परीक्षण कीजिए। (250 शब्द)',
    mainsQuestionEn: 'Question: Examine the role of indigenous semiconductor fabrication in securing India\'s digital sovereignty and leadership in 6G technology. (250 words)'
  },
  {
    id: 'ca-2',
    category: 'Science & Tech',
    titleHi: 'इसरो (ISRO) का शुक्रयान-1 (Shukrayaan-1) मिशन: उन्नत सिंथेटिक एपर्चर रडार का सफल परीक्षण',
    titleEn: 'ISRO Shukrayaan-1 Venus Mission: Synthetic Aperture Radar Payload Validated',
    summaryHi: 'भारतीय अंतरिक्ष अनुसंधान संगठन (ISRO) ने वीनस ऑर्बिटर मिशन (शुक्रयान-1) के लिए विशेष वायुमंडलीय स्पेक्ट्रोमीटर और सिंथेटिक एपर्चर रडार (SAR) का सफल परीक्षण पूरा किया।',
    summaryEn: 'ISRO completed payload testing for Venus Orbiter Mission (Shukrayaan-1) featuring Synthetic Aperture Radar and high-resolution atmospheric infrared spectrometers.',
    date: '25 अगस्त 2026',
    readTime: '3.5 मिनट',
    examRelevance: 'UPSC CSE (GS-3 Science & Tech), CDS, NDA, SSC CGL, State PSCs',
    keyFact: 'शुक्र को "पृथ्वी की जुड़वां बहन" (Earth\'s Twin) कहा जाता है क्योंकि इसका आकार व द्रव्यमान लगभग पृथ्वी के समान है।',
    tag: 'Space Exploration',

    backgroundHi: 'शुक्र ग्रह का वायुमंडल अत्यधिक घना और 96% कार्बन डाइऑक्साइड ($CO_2$) से युक्त है, जहाँ सतह का तापमान 465°C तक रहता है। यह अत्यधिक ग्रीनहाउस प्रभाव (Runaway Greenhouse Effect) का सबसे बड़ा उदाहरण है। इसरो का यह मिशन शुक्र की सतह के नीचे ज्वालामुखी गतिविधि और बादलों में सल्फ्यूरिक एसिड का अध्ययन करेगा।',
    backgroundEn: 'Venus has an extreme runaway greenhouse atmosphere with 96% CO2 and surface temperatures near 465°C. ISRO’s orbiter will pierce the thick sulfuric acid cloud layers to map subterranean volcanic geology and atmospheric chemistry.',

    deepAnalysisHi: [
      'सिंथेटिक एपर्चर रडार (SAR): घने सल्फ्यूरिक एसिड बादलों के आर-पार देखकर सतह का 3D स्थलाकृतिक मानचित्र बनाएगा।',
      'शुक्र के वायुमंडल में संभावित फॉस्फीन ($PH_3$) गैस के अणुओं की खोज की जाएगी जो बायो-सिग्नेचर का संकेत हो सकते हैं।',
      'सौर पवन और शुक्र के आयनमंडल के बीच की पारस्परिक क्रिया (Ionosphere interaction) का अध्ययन।'
    ],
    deepAnalysisEn: [
      'Synthetic Aperture Radar (SAR) can penetrate dense sulfuric acid hazes to construct sub-meter resolution 3D surface elevation models.',
      'Exploration of trace phosphine (PH3) molecules and atmospheric chemical disequilibrium.',
      'Analysis of solar wind interaction with Venusian unmagnetized ionosphere.'
    ],

    keyProvisionsHi: [
      'प्रक्षेपण यान: एलवीएम-3 (LVM3 / GSLV Mk III) का उपयोग किए जाने की योजना है।',
      'मिशन अवधि: 4 वर्ष का ऑर्बिटल जीवनकाल।',
      'अंतर्राष्ट्रीय सहयोग: स्वीडन, फ्रांस, रूस और जर्मनी के वैज्ञानिक उपकरणों को भी शामिल किया गया है।'
    ],
    keyProvisionsEn: [
      'Launch Vehicle: Heavy-lift LVM3 (Geosynchronous Launch Vehicle).',
      'Mission Lifetime: 4 years nominal orbital lifecycle.',
      'International payloads onboard from collaborative institutes in France, Sweden, and Germany.'
    ],

    examImpactHi: 'ग्रहों की गति, सौरमंडल के नियम, वीनस का ग्रीनहाउस प्रभाव और ISRO के आगामी मिशन (गगनयान, निसार, शुक्रयान) सीधे पूछे जाते हैं।',
    examImpactEn: 'Core topic for Space Technology, planetary thermodynamics, ISRO roadmap and radar payloads.',

    mcq: {
      questionHi: 'शुक्र ग्रह (Venus) के संदर्भ में निम्नलिखित में से कौन सा कथन सही है?',
      questionEn: 'Which of the following statements regarding Planet Venus is correct?',
      optionsHi: [
        'यह सौरमंडल का सबसे ठंडा ग्रह है',
        'यह पूर्व से पश्चिम (दक्षिणावर्त) दिशा में घूर्णन करता है',
        'इसके 2 प्राकृतिक उपग्रह (चाँद) हैं',
        'इसकी सतह पर जल के विशाल महासागर हैं'
      ],
      optionsEn: [
        'It is the coldest planet in the Solar System',
        'It rotates in a retrograde (East to West) clockwise direction',
        'It has 2 natural moons',
        'It possesses vast liquid oceans on its surface'
      ],
      correctIndex: 1,
      explanationHi: 'शुक्र और यूरेनस दो ऐसे ग्रह हैं जो अन्य ग्रहों के विपरीत पूर्व से पश्चिम (Retrograde Rotation) दिशा में घूमते हैं। शुक्र का कोई प्राकृतिक उपग्रह नहीं है।',
      explanationEn: 'Venus and Uranus rotate clockwise (East to West / retrograde), unlike most other planets. Venus has zero natural moons.'
    },
    mainsQuestionHi: 'प्रश्न: अंतरिक्ष अन्वेषण में शुक्र मिशन जलवायु परिवर्तन और पृथ्वी के भविष्य को समझने में कैसे सहायक हो सकते हैं? (150 शब्द)',
    mainsQuestionEn: 'Question: How can Venus exploration missions assist scientists in understanding planetary climate evolution and Earth\'s future? (150 words)'
  },
  {
    id: 'ca-3',
    category: 'Economy & Banking',
    titleHi: 'RBI ने डिजिटल रुपया (CBDC) में ऑफलाइन पीयर-टू-पीयर (P2P) लेनदेन प्रणाली को दी अंतिम मंजूरी',
    titleEn: 'RBI Grants Full Regulatory Approval for Offline P2P CBDC Digital Rupee Transactions',
    summaryHi: 'भारतीय रिजर्व बैंक (RBI) ने बिना इंटरनेट और टेलीकॉम नेटवर्क वाले दूरदराज के क्षेत्रों में केंद्रीय बैंक डिजिटल मुद्रा (CBDC-R) के सुरक्षित ऑफलाइन लेनदेन को सक्षम किया।',
    summaryEn: 'RBI enabled Near-Field Communication (NFC) and soundwave-based offline peer-to-peer (P2P) settlements for Central Bank Digital Currency in low-connectivity areas.',
    date: '25 अगस्त 2026',
    readTime: '3 मिनट',
    examRelevance: 'RBI Grade B, IBPS PO, SBI PO, UPSC GS-3 Economy, SSC CGL',
    keyFact: 'CBDC एक सॉवरेन डिजिटल मुद्रा है, जो RBI की देनदारी (Liability) होती है और लीगल टेंडर है।',
    tag: 'Banking & Digital Currency',

    backgroundHi: 'आरबीआई ने दिसंबर 2022 में खुदरा डिजिटल रुपया (e₹-R) का पायलट प्रोजेक्ट शुरू किया था। भारत के पहाड़ी, जनजातीय और दूरदराज के क्षेत्रों में इंटरनेट कनेक्टिविटी सीमित होने के कारण ऑफलाइन समाधान की आवश्यकता महसूस की गई।',
    backgroundEn: 'RBI commenced the retail e-Rupee pilot in December 2022. To bridge financial exclusion in remote terrains lacking continuous telecom cellular data, offline cryptographic settlement protocols were created.',

    deepAnalysisHi: [
      'NFC और BLE (ब्लूटूथ लो एनर्जी) तकनीक के माध्यम से दो फोन एक-दूसरे के संपर्क में आकर बिना इंटरनेट पैसे ट्रांसफर कर सकते हैं।',
      'डबल-स्पेंडिंग रोकथाम: हार्डवेयर सिक्योर एलीमेंट (SE) और इन-बिल्ट क्रिप्टोग्राफिक टोकन का उपयोग किया गया है।',
      'UPI और CBDC में अंतर: UPI बैंक खातों के बीच पैसे ट्रांसफर करने का माध्यम है, जबकि CBDC स्वयं मुद्रा (डिजिटल कैश) है।'
    ],
    deepAnalysisEn: [
      'Proximity settlement via NFC and BLE tokens enables seamless transactions in zero-connectivity environments.',
      'Double-spending security guaranteed by cryptographic secure elements within smartphone microchips.',
      'UPI vs CBDC: UPI is a payment rails interface transferring commercial bank deposits, while CBDC is legal tender digital sovereign cash issued directly by RBI.'
    ],

    keyProvisionsHi: [
      'प्रति लेनदेन सीमा: सुरक्षा कारणों से ऑफलाइन लेनदेन की अधिकतम सीमा ₹2,000 प्रति ट्रांसफर रखी गई है।',
      'शून्य लेनदेन शुल्क: उपयोगकर्ताओं या व्यापारियों पर कोई अतिरिक्त एमडीआर (MDR) शुल्क नहीं लगेगा।',
      'एनालॉग व फीचर फोन के लिए सिम-ओवरले और साउंड-वेव तकनीक का भी प्रावधान।'
    ],
    keyProvisionsEn: [
      'Transaction Cap: ₹2,000 per offline single transfer to mitigate fraud and device theft risks.',
      'Zero MDR or transaction commission on merchant/user touchpoints.',
      'Sim-overlay and ultrasonic soundwave compatibility for basic feature phones.'
    ],

    examImpactHi: 'बैंकिंग और मौद्रिक नीति, डिजिटल भुगतान सुरक्षा, तथा फिएट करेंसी बनाम क्रिप्टोकरेंसी का अंतर सबसे पसंदीदा प्रश्न क्षेत्र है।',
    examImpactEn: 'Essential for Monetary Economics, digital public infrastructure, and legal tender definitions.',

    mcq: {
      questionHi: 'केंद्रीय बैंक डिजिटल मुद्रा (CBDC) के संबंध में निम्नलिखित में से कौन सा कथन सही है?',
      questionEn: 'Which of the following statements is true regarding Central Bank Digital Currency (CBDC)?',
      optionsHi: [
        'यह वाणिज्यिक बैंकों (Commercial Banks) की देनदारी है',
        'यह केंद्रीय बैंक (RBI) द्वारा जारी की गई सॉवरेन मुद्रा और कानूनी निविदा (Legal Tender) है',
        'यह एक अनियंत्रित क्रिप्टोकरेंसी है जैसे बिटकॉइन',
        'इसके लिए हमेशा हाई-स्पीड इंटरनेट अनिवार्य है'
      ],
      optionsEn: [
        'It is a liability of Commercial Banks',
        'It is a sovereign currency and legal tender issued directly by the Central Bank (RBI)',
        'It is a decentralized cryptocurrency like Bitcoin',
        'It strictly requires high-speed internet connectivity for every micro-transaction'
      ],
      correctIndex: 1,
      explanationHi: 'CBDC केंद्रीय बैंक (RBI) की सीधी देनदारी है और यह भौतिक नोटों (Paper Currency) का डिजिटल रूप है जो 100% लीगल टेंडर है।',
      explanationEn: 'CBDC is a direct sovereign liability of the central bank, functioning as digital cash with statutory legal tender status.'
    },
    mainsQuestionHi: 'प्रश्न: भारत के वित्तीय समावेशन और सीमा-पार प्रेषण (Cross-border Remittances) में ऑफलाइन डिजिटल रुपया किस प्रकार क्रांतिकारी परिवर्तन ला सकता है? (200 शब्द)',
    mainsQuestionEn: 'Question: How can an offline digital rupee transform financial inclusion and cross-border payment efficiency in India? (200 words)'
  },
  {
    id: 'ca-4',
    category: 'Sports',
    titleHi: 'विश्व एथलेटिक्स चैंपियनशिप 2026: भारत ने भाला फेंक में जीता ऐतिहासिक स्वर्ण पदक',
    titleEn: 'World Athletics Championships 2026: India Secures Historic Gold in Javelin Throw',
    summaryHi: 'भारतीय एथलीट ने 90.15 मीटर के अभूतपूर्व थ्रो के साथ विश्व एथलेटिक्स चैंपियनशिप 2026 में शीर्ष स्थान हासिल कर इतिहास रचा।',
    summaryEn: 'Indian javelin star registered an iconic 90.15m throw to capture Gold at the World Athletics Championships 2026.',
    date: '24 अगस्त 2026',
    readTime: '2.5 मिनट',
    examRelevance: 'SSC GD, UP Police, Railway NTPC, State SI, BPSC',
    keyFact: 'राष्ट्रीय खेल दिवस हर वर्ष 29 अगस्त को हॉकी के जादूगर मेजर ध्यानचंद की जयंती पर मनाया जाता है।',
    tag: 'Sports & Honors',

    backgroundHi: 'टोक्यो और पेरिस ओलंपिक के बाद भारत ने फील्ड एथलेटिक्स में अपनी वैश्विक धाक जमाई है। 90 मीटर के प्रतिष्ठित क्लब में प्रवेश करने वाले भारत के पहले एथलीट बनकर नया राष्ट्रीय कीर्तिमान स्थापित किया गया।',
    backgroundEn: 'Following podium finishes at Tokyo and Paris Olympics, Indian track-and-field athletes cemented global supremacy, crossing the prestigious 90m barrier.',

    deepAnalysisHi: [
      'प्रतियोगिता का आयोजन टोक्यो, जापान के नेशनल स्टेडियम में किया गया।',
      'फाइनल राउंड में 90.15 मीटर का थ्रो कर एशियाई रिकॉर्ड भी तोड़ा।',
      'भारत सरकार की "टारगेट ओलंपिक पोडियम स्कीम" (TOPS) और "खेलो इंडिया" योजना के एथलीटों को विश्व स्तरीय कोचिंग का सीधा लाभ मिला।'
    ],
    deepAnalysisEn: [
      'Event hosted at the National Olympic Stadium in Tokyo, Japan.',
      'Set a new Asian Record with the 90.15m winning mark in the 4th attempt.',
      'Demonstrates success of Target Olympic Podium Scheme (TOPS) and Khelo India infrastructure.'
    ],

    keyProvisionsHi: [
      'विश्व एथलेटिक्स (World Athletics) का मुख्यालय मोनाको में स्थित है।',
      'मेजर ध्यानचंद खेल रत्न पुरस्कार भारत का सर्वोच्च खेल सम्मान है।',
      'अर्जुन पुरस्कार उत्कृष्ट प्रदर्शन और द्रोणाचार्य पुरस्कार कोचों को दिया जाता है।'
    ],
    keyProvisionsEn: [
      'World Athletics headquarters is located in Monaco.',
      'Major Dhyan Chand Khel Ratna is India’s highest sporting honor.',
      'Arjuna Award honors consistent athletic excellence; Dronacharya Award honors elite coaches.'
    ],

    examImpactHi: 'खेल पुरस्कार, आयोजन स्थल, भारतीय खिलाड़ियों के रिकॉर्ड और राष्ट्रीय खेल दिवस की थीम SSC व स्टेट पुलिस परीक्षाओं के सबसे सामान्य प्रश्न हैं।',
    examImpactEn: 'Common questions in SSC/State SI exams regarding sports venues, national awards, and records.',

    mcq: {
      questionHi: 'भारत में सर्वोच्च खेल सम्मान "मेजर ध्यानचंद खेल रत्न पुरस्कार" की स्थापना किस वर्ष हुई थी?',
      questionEn: 'In which year was India\'s highest sporting honor, the Rajiv Gandhi (now Major Dhyan Chand) Khel Ratna Award, instituted?',
      optionsHi: ['1961', '1985', '1991-92', '2000'],
      optionsEn: ['1961', '1985', '1991-92', '2000'],
      correctIndex: 2,
      explanationHi: 'इसकी शुरुआत 1991-92 में हुई थी और इसके पहले प्राप्तकर्ता शतरंज ग्रैंडमास्टर विश्वनाथन आनंद थे। 2021 में इसका नाम बदलकर मेजर ध्यानचंद खेल रत्न किया गया।',
      explanationEn: 'Instituted in 1991-92 with Grandmaster Viswanathan Anand as its first recipient. Renamed after Major Dhyan Chand in 2021.'
    },
    mainsQuestionHi: 'प्रश्न: भारत में ग्रामीण स्तर पर खेल प्रतिभाओं की पहचान और उन्हें अंतरराष्ट्रीय पोडियम तक पहुँचाने में खेलो इंडिया योजना की उपलब्धियों का मूल्यांकन कीजिए। (150 शब्द)',
    mainsQuestionEn: 'Question: Evaluate the role of Khelo India in grassroots talent scouting and Olympic podium preparation. (150 words)'
  },
  {
    id: 'ca-5',
    category: 'International',
    titleHi: 'अंतर्राष्ट्रीय सौर गठबंधन (ISA) में 120वां सदस्य देश शामिल, वैश्विक सौर ग्रिड पर हुआ समझौता',
    titleEn: '120th Country Joins International Solar Alliance (ISA); Pact on One Sun One World One Grid',
    summaryHi: 'भारत और फ्रांस द्वारा 2015 के पेरिस जलवायु समझौते (COP21) के दौरान स्थापित अंतर्राष्ट्रीय सौर गठबंधन (ISA) का विस्तार 120 देशों तक पहुँच गया।',
    summaryEn: 'International Solar Alliance (ISA), founded by India & France during COP21, expanded to 120 member states with a comprehensive pact on cross-border green power transmission.',
    date: '24 अगस्त 2026',
    readTime: '3.5 मिनट',
    examRelevance: 'UPSC CSE (GS-2 International Relations & GS-3 Environment), State PSCs, CDS',
    keyFact: 'ISA का वैश्विक मुख्यालय राष्ट्रीय सौर ऊर्जा संस्थान (NISE), गुरुग्राम, हरियाणा (भारत) में स्थित है।',
    tag: 'International Treaties & Climate',

    backgroundHi: 'कर्क रेखा (Tropic of Cancer) और मकर रेखा (Tropic of Capricorn) के बीच स्थित धूप संपन्न देशों (Suryaputras) को स्वच्छ ऊर्जा समाधान प्रदान करने के लिए प्रधानमंत्री नरेंद्र मोदी और फ्रांस के राष्ट्रपति द्वारा इसकी नींव रखी गई थी।',
    backgroundEn: 'Founded jointly by India and France to pool technological and financial resources across sunshine-rich nations situated between the Tropics of Cancer and Capricorn.',

    deepAnalysisHi: [
      '"वन सन, वन वर्ल्ड, वन ग्रिड" (OSOWOG): सूर्य कभी अस्त नहीं होता - इस विचार पर आधारित एक वैश्विक ग्रिड जो दिन वाले क्षेत्रों से रात वाले क्षेत्रों में सौर ऊर्जा स्थानांतरित करेगी।',
      'सौर ऊर्जा परियोजनाओं के लिए $1000 बिलियन का वैश्विक निवेश जुटाने का लक्ष्य।',
      'अफ्रीकी और प्रशांत द्वीपीय देशों में सौर जल पंप और सोलर मिनी-ग्रिड की स्थापना।'
    ],
    deepAnalysisEn: [
      '"One Sun, One World, One Grid" (OSOWOG): Cross-continental grid connecting time-zones so solar power generated in daylight reaches night regions seamlessly.',
      'Target to mobilize over $1,000 Billion in solar investment deployments by 2030.',
      'Solar irrigation water pumps and resilient mini-grids across African and Pacific Island developing nations.'
    ],

    keyProvisionsHi: [
      'मुख्यालय: गुरुग्राम (हरियाणा, भारत) - यह भारत में स्थित पहला प्रमुख अंतर-सरकारी वैश्विक संगठन है।',
      'निदेशक मंडल और सभा (Assembly): सभी सदस्य देशों का वार्षिक सम्मेलन नई दिल्ली में आयोजित होता है।',
      'संशोधन: 2020 में संधि में संशोधन कर संयुक्त राष्ट्र के सभी सदस्य देशों के लिए सदस्यता खोल दी गई।'
    ],
    keyProvisionsEn: [
      'Headquarters: Gurugram, Haryana (India) - First treaty-based intergovernmental organization headquartered in India.',
      'Universal Membership: Treaty amended in 2020 to open membership to all UN member states beyond the tropics.',
      'Flagship programs in solar rooftop financing, cold storage, and e-mobility charging.'
    ],

    examImpactHi: 'अंतर्राष्ट्रीय संगठन, COP जलवायु शिखर सम्मेलन, भारत की नवीकरणीय ऊर्जा नीति और पंचामृत लक्ष्य (500 GW Non-Fossil by 2030) पर अनिवार्य प्रश्न पूछे जाते हैं।',
    examImpactEn: 'Core topic for multilateral environmental governance, Paris Agreement milestones, and India\'s leadership in South-South cooperation.',

    mcq: {
      questionHi: 'अंतर्राष्ट्रीय सौर गठबंधन (ISA) का स्थायी सचिवालय (मुख्यालय) कहाँ स्थित है?',
      questionEn: 'Where is the permanent headquarters of the International Solar Alliance (ISA) located?',
      optionsHi: ['पेरिस, फ्रांस', 'जिनेवा, स्विट्जरलैंड', 'गुरुग्राम, हरियाणा (भारत)', 'नैरोबी, केन्या'],
      optionsEn: ['Paris, France', 'Geneva, Switzerland', 'Gurugram, Haryana (India)', 'Nairobi, Kenya'],
      correctIndex: 2,
      explanationHi: 'ISA का मुख्यालय गुरुग्राम (हरियाणा, भारत) में स्थित राष्ट्रीय सौर ऊर्जा संस्थान (NISE) परिसर में है।',
      explanationEn: 'ISA is headquartered at the National Institute of Solar Energy (NISE) campus in Gurugram, Haryana, India.'
    },
    mainsQuestionHi: 'प्रश्न: "वन सन, वन वर्ल्ड, वन ग्रिड" (OSOWOG) पहल ऊर्जा सुरक्षा और भू-राजनीतिक सहयोग में क्या भूमिका निभा सकती है? समीक्षा कीजिए। (250 शब्द)',
    mainsQuestionEn: 'Question: "The Sun Never Sets" - Critically evaluate the geopolitical and technological challenges of the One Sun One World One Grid initiative. (250 words)'
  },
  {
    id: 'ca-6',
    category: 'Schemes & Governance',
    titleHi: 'प्रधानमंत्री सूर्य घर: मुफ्त बिजली योजना का विस्तार, 1 करोड़ घरों में सोलर रूफटॉप लक्ष्य',
    titleEn: 'PM Surya Ghar Muft Bijli Yojana: Fast-Tracking 10 Million Rooftop Solar Homes',
    summaryHi: 'केंद्र सरकार ने हर महीने 300 यूनिट तक मुफ्त बिजली उपलब्ध कराने और ग्रिड को अतिरिक्त बिजली बेचकर परिवारों को आय अर्जित कराने हेतु सब्सिडी पोर्टल को तेज किया।',
    summaryEn: 'Government fast-tracked direct financial subsidies for rooftop solar systems providing up to 300 units of free power monthly for 10 million households.',
    date: '23 अगस्त 2026',
    readTime: '3 मिनट',
    examRelevance: 'UPSC CSE (GS-2 Schemes & GS-3 Energy), SSC CGL, BPSC, UPPSC',
    keyFact: 'योजना के तहत 1 kW सिस्टम पर ₹30,000, 2 kW पर ₹60,000 और 3 kW या अधिक पर ₹78,000 की सीधी सब्सिडी दी जाती है।',
    tag: 'Government Schemes',

    backgroundHi: 'पारंपरिक ग्रिड बिजली पर कोयला आधारित निर्भरता को कम करने और गरीब व मध्यम वर्गीय परिवारों के बिजली बिल को शून्य करने के उद्देश्य से फरवरी 2024 में ₹75,000 करोड़ के परिव्यय के साथ यह योजना शुरू की गई थी।',
    backgroundEn: 'Launched with an outlay of ₹75,000 crore to eliminate household electricity bills, reduce thermal coal stress, and accelerate domestic manufacturing of solar PV modules.',

    deepAnalysisHi: [
      'सीधा बैंक ट्रांसफर (DBT): सोलर पैनल लगते ही 30 दिनों के भीतर सब्सिडी सीधे लाभार्थी के बैंक खाते में जमा होती है।',
      'डिस्कॉम (DISCOMs) को नुकसान नहीं, बल्कि पीक लोड डिमांड में स्थानीय सौर ऊर्जा उत्पादन से ग्रिड को स्थिरता मिलती है।',
      'ई-वाहन (EV) चार्जिंग और 1 लाख से अधिक स्थानीय सोलर तकनीशियनों (सूर्य मित्र) को रोजगार सृजन।'
    ],
    deepAnalysisEn: [
      'Direct Benefit Transfer (DBT) directly credited to beneficiary bank accounts within 30 days of net-meter commissioning.',
      'Enhances distribution company (DISCOM) financial health by supplying clean energy directly at load centers.',
      'Spurs decentralized employment for over 100,000 certified solar technicians (Surya Mitras).'
    ],

    keyProvisionsHi: [
      'नोडल मंत्रालय: नवीन और नवीकरणीय ऊर्जा मंत्रालय (MNRE)।',
      'पात्रता: भारतीय नागरिक, जिनके पास उपयुक्त छत वाला पक्का मकान और वैध बिजली कनेक्शन हो।',
      'कम ब्याज दर पर बैंक ऋण: 7% के रियायती ब्याज दर पर कोलेटरल-मुक्त बैंक ऋण उपलब्ध।'
    ],
    keyProvisionsEn: [
      'Nodal Ministry: Ministry of New and Renewable Energy (MNRE).',
      'Eligibility: Indian resident households with suitable roof ownership and active DISCOM metered connection.',
      'Collateral-free low interest bank loans at concessional 7% rate.'
    ],

    examImpactHi: 'सरकारी कल्याणकारी योजनाओं के उद्देश्य, पात्रता, सब्सिडी राशि और ऊर्जा परिवर्तन लक्ष्यों से जुड़े प्रश्न लगातार पूछे जाते हैं।',
    examImpactEn: 'High-frequency topic for Welfare Schemes, renewable energy targets, and DBT public administration.',

    mcq: {
      questionHi: 'पीएम सूर्य घर मुफ्त बिजली योजना के तहत 3 kW क्षमता के रूफटॉप सोलर सिस्टम के लिए अधिकतम कितनी केंद्रीय वित्तीय सहायता (सब्सिडी) प्रदान की जाती है?',
      questionEn: 'What is the maximum central financial assistance (subsidy) provided under PM Surya Ghar Muft Bijli Yojana for a 3 kW rooftop solar system?',
      optionsHi: ['₹30,000', '₹50,000', '₹78,000', '₹1,00,000'],
      optionsEn: ['₹30,000', '₹50,000', '₹78,000', '₹1,00,000'],
      correctIndex: 2,
      explanationHi: '3 kW या उससे अधिक क्षमता के घरेलू रूफटॉप सोलर प्लांट के लिए अधिकतम ₹78,000 की सब्सिडी निर्धारित की गई है।',
      explanationEn: 'Under the scheme, ₹78,000 is the benchmark maximum capital subsidy for 3 kW and higher residential installations.'
    },
    mainsQuestionHi: 'प्रश्न: पीएम सूर्य घर योजना भारत के ऊर्जा सुरक्षा और शुद्ध शून्य उत्सर्जन (Net Zero 2070) लक्ष्य को प्राप्त करने में किस प्रकार मददगार हो सकती है? चर्चा कीजिए। (200 शब्द)',
    mainsQuestionEn: 'Question: Discuss the significance of PM Surya Ghar Yojana in fostering energy self-reliance and achieving India\'s Net Zero 2070 climate commitments. (200 words)'
  },
  {
    id: 'ca-7',
    category: 'Science & Tech',
    titleHi: 'इसरो (ISRO) का आदित्य-L1 (Aditya-L1) सूर्य मिशन: हेलो ऑर्बिट और सौर तूफानों का सफल वैज्ञानिक विश्लेषण',
    titleEn: 'ISRO Aditya-L1 Solar Mission: Continuous Corona & Solar Wind Profiling at Lagrange Point L1',
    summaryHi: 'भारतीय अंतरिक्ष अनुसंधान संगठन (ISRO) के पहले समर्पित सौर मिशन "आदित्य-L1" ने सूर्य-पृथ्वी प्रणाली के प्रथम लैग्रेंजियन बिंदु (L1) के चारों ओर अपनी हेलो कक्षा (Halo Orbit) में रहते हुए कोरोनल मास इजेक्शन (CME) और सौर ज्वालाओं का ऐतिहासिक डेटा जारी किया है।',
    summaryEn: 'ISRO’s premiere solar observatory, Aditya-L1, stationed in a halo orbit around the Sun-Earth Lagrangian Point L1 (1.5 million km from Earth), has transmitted crucial raw datasets analyzing solar magnetic storms and Coronal Mass Ejections (CMEs).',
    date: '20 सितम्बर 2026',
    readTime: '5 मिनट',
    examRelevance: 'UPSC CSE (GS-3 Space Technology), SSC CGL, NDA/CDS, State PSCs, Railway Exams',
    keyFact: 'सूर्य-पृथ्वी प्रणाली में कुल 5 लैग्रेंज बिंदु (L1 से L5) हैं, जहाँ गुरुत्वाकर्षण और सेंट्रीफ्यूगल बल संतुलित होते हैं।',
    tag: 'Space & Solar Science',

    backgroundHi: 'आदित्य-L1 को पीएसएलवी-C57 (PSLV-C57) रॉकेट द्वारा 2 सितंबर 2023 को प्रक्षेपित किया गया था। यह पृथ्वी से लगभग 15 लाख किलोमीटर दूर L1 बिंदु पर स्थित है। इस बिंदु का मुख्य लाभ यह है कि यहाँ से बिना किसी ग्रहण या बाधा के सूर्य पर लगातार चौबीसों घंटे नजर रखी जा सकती है।',
    backgroundEn: 'Launched on September 2, 2023, aboard the PSLV-C57 workhorse, Aditya-L1 was inserted into a periodic halo orbit around Lagrange Point 1 (L1). Stationing at L1 grants an uninterrupted, continuous view of the solar disc without any planetary occultation or eclipses.',

    deepAnalysisHi: [
      'L1 बिंदु क्या है?: यह अंतरिक्ष में वह स्थान है जहाँ दो विशाल खगोलीय पिंडों (सूर्य और पृथ्वी) के गुरुत्वाकर्षण बल आपस में संतुलित हो जाते हैं, जिससे उपग्रह को अपनी स्थिति बनाए रखने के लिए न्यूनतम ईंधन की आवश्यकता होती है।',
      'प्रमुख पेलोड (Payloads): मिशन में 7 मुख्य वैज्ञानिक उपकरण हैं, जिनमें VELC (विजिबल एमिशन लाइन coronaग्राफ) और SUIT (सोलर अल्ट्रावायलेट इमेजिंग टेलीस्कोप) प्रमुख हैं।',
      'कोरोना हीटिंग समस्या: सूर्य की बाहरी सतह का तापमान केवल 6,000°C है, जबकि उसके बाहरी वायुमंडल (Corona) का तापमान लाखों डिग्री सेल्सियस तक पहुँच जाता है। आदित्य-L1 इस अनसुलझे रहस्य का अध्ययन कर रहा है।'
    ],
    deepAnalysisEn: [
      'What is L1 Point?: A gravitationally stable parking spot in space where the combined gravitational pull of the Sun and Earth matches the centrifugal force required for a spacecraft to move with them, minimizing orbit-maintenance fuel consumption.',
      'Scientific Payloads: Carries 7 specialized payloads; 4 are remote sensing instruments (e.g. VELC, SUIT) mapping the solar disc, and 3 are in-situ instruments (e.g., ASPEX, PAPA) tracking local solar winds.',
      'The Coronal Heating Paradox: The sun’s surface (photosphere) sits at ~6,000 K, yet its outermost atmosphere (corona) mysteriously surges to over 1,000,000 K. Aditya-L1 is collecting spectroscopic telemetry to resolve this thermodynamic anomaly.'
    ],

    keyProvisionsHi: [
      'VELC पेलोड: यह प्रतिदिन सूर्य की 1,440 से अधिक तस्वीरें भेजकर सूर्य के चुंबकीय क्षेत्र और कोरोनल हीटिंग का विश्लेषण करता है।',
      'सौर पवनें और अंतरिक्ष मौसम: सौर फ्लेयर्स पृथ्वी पर उपग्रह संचार, जीपीएस ग्रिड, और बिजली प्रणालियों को बाधित कर सकती हैं। आदित्य-L1 सौर तूफानों की सटीक पूर्व-चेतावनी देने में सक्षम है।',
      'हेलो ऑर्बिट की स्थिरता: अंतरिक्ष यान को पृथ्वी से लगभग 110 दिनों की यात्रा के बाद L1 हेलो ऑर्बिट में सुरक्षित रूप से स्थापित किया गया था।'
    ],
    keyProvisionsEn: [
      'VELC Payload: Operates at sub-angstrom resolution, transmitting over 1,440 images daily to inspect magnetized plasma and CME initiation vectors.',
      'Solar Wind & Space Weather: High-energy solar flares can disable global communications, electrical power grids, and GPS satellites. Aditya-L1 provides crucial real-time space weather warning telemetry.',
      'Halo Orbit Insertion: Executed flawlessly after a 110-day deep space cruise spanning roughly 1.5 million kilometers.'
    ],

    examImpactHi: 'लैग्रेंज बिंदु (Lagrange Points), सूर्य की संरचना (Photosphere, Chromosphere, Corona), पेलोड के नाम, प्रक्षेपण रॉकेट (PSLV-C57) और भारत के प्रथम सौर मिशन से जुड़े प्रश्न सभी प्रतियोगी परीक्षाओं में पूछे जाते हैं।',
    examImpactEn: 'High-yield prelims concept: Lagrange points dynamics, solar layers, PSLV flight numbers, and electromagnetic spectrum bands. Mains focus: India’s space infrastructure safety and solar physics milestones.',

    mcq: {
      questionHi: 'इसरो द्वारा प्रक्षेपित "आदित्य-L1" मिशन को सूर्य-पृथ्वी प्रणाली के प्रथम लैग्रेंज बिंदु पर स्थापित किया गया है। यह बिंदु पृथ्वी से लगभग कितनी दूरी पर स्थित है?',
      questionEn: 'The Sun-Earth Lagrangian Point 1 (L1), where ISRO\'s Aditya-L1 spacecraft is stationed, is located at approximately what distance from the Earth?',
      optionsHi: ['3,84,000 किलोमीटर', '15 लाख किलोमीटर (1.5 Million km)', '1.5 करोड़ किलोमीटर', '150 लाख किलोमीटर'],
      optionsEn: ['3,84,000 kilometers', '1.5 Million kilometers (15 Lakh km)', '15 Million kilometers', '150 Million kilometers'],
      correctIndex: 1,
      explanationHi: 'लैग्रेंज बिंदु 1 (L1) पृथ्वी से लगभग 15 लाख किलोमीटर (1.5 मिलियन किमी) की दूरी पर स्थित है, जो पृथ्वी-सूर्य की कुल दूरी का लगभग 1% है।',
      explanationEn: 'The L1 point is located approximately 1.5 million kilometers from Earth, which represents roughly 1% of the total distance between the Earth and the Sun.'
    },
    mainsQuestionHi: 'प्रश्न: लैग्रेंज बिंदु (Lagrange Points) से आप क्या समझते हैं? आदित्य-L1 मिशन के वैज्ञानिक उद्देश्यों और इसके महत्व पर प्रकाश डालिए। (250 शब्द)',
    mainsQuestionEn: 'Question: What do you understand by Lagrangian Points? Discuss the primary scientific objectives and strategic significance of India\'s Aditya-L1 mission. (250 words)'
  },
  {
    id: 'ca-8',
    category: 'Economy & Banking',
    titleHi: 'e-RUPI वाउचर और सेंट्रल बैंक डिजिटल करेंसी (CBDC) में अंतर: भारत में डिजिटल भुगतान का नया युग',
    titleEn: 'e-RUPI Digital Voucher vs CBDC Digital Rupee: High-Yield Functional Comparison & Monetary Impact',
    summaryHi: 'वित्तीय समावेशन को बढ़ावा देने के लिए भारत सरकार की दो प्रमुख डिजिटल पहल - "e-RUPI" कूपन वाउचर प्रणाली और भारतीय रिजर्व बैंक (RBI) द्वारा जारी "डिजिटल रुपया (CBDC)" दोनों देश की कैशलेस अर्थव्यवस्था को नई गति दे रहे हैं।',
    summaryEn: 'An essential conceptual guide highlighting the structural and regulatory differences between National Payments Corporation of India’s (NPCI) beneficiary-targeted e-RUPI voucher and Reserve Bank of India’s (RBI) sovereign digital currency (CBDC-R).',
    date: '19 सितम्बर 2026',
    readTime: '4.5 मिनट',
    examRelevance: 'UPSC CSE (GS-3 Indian Economy), RBI Grade B, SBI PO, IBPS, SSC CGL',
    keyFact: 'e-RUPI एक उद्देश्य-विशिष्ट (Purpose-Specific) डिजिटल कूपन है, जबकि CBDC एक पूर्ण सॉवरेन कानूनी निविदा (Legal Tender) है।',
    tag: 'Financial Technology',

    backgroundHi: 'e-RUPI को अगस्त 2021 में राष्ट्रीय भुगतान निगम (NPCI) द्वारा वित्तीय सेवाओं के रिसाव-मुक्त (Leakage-proof) वितरण के लिए लॉन्च किया गया था। दूसरी ओर, RBI ने 2022 में डिजिटल रुपया (Central Bank Digital Currency) लॉन्च किया, जो भौतिक मुद्रा का डिजिटल प्रतिरूप है।',
    backgroundEn: 'Developed by NPCI, e-RUPI was launched in August 2021 as a cashless, contactless, target-oriented voucher system. In contrast, RBI’s retail Central Bank Digital Currency (e₹-R) represents the digital form of paper notes, acting as direct fiat currency.',

    deepAnalysisHi: [
      'e-RUPI क्या है?: यह एक पूर्व-भुगतान (Pre-paid) डिजिटल वाउचर है जो एसएमएस (SMS) या क्यूआर कोड (QR Code) के रूप में लाभार्थी को मिलता है। इसके लिए बैंक खाते या स्मार्टफोन की आवश्यकता नहीं होती। इसका उपयोग केवल उसी कार्य के लिए हो सकता है जिसके लिए इसे जारी किया गया है (जैसे उर्वरक सब्सिडी या कोविड टीकाकरण)।',
      'CBDC (डिजिटल रुपया) क्या है?: यह भारत की आधिकारिक डिजिटल मुद्रा है। यह ब्लॉकचेन या डिस्ट्रीब्यूटेड लेजर तकनीक (DLT) पर आधारित है। इसे आप किसी भी लेन-देन के लिए डिजिटल कैश के रूप में खर्च कर सकते हैं (यह उद्देश्य-विशिष्ट नहीं है)।',
      'वित्तीय संसंपन्नता और सुरक्षा: CBDC केंद्रीय बैंक की सीधी देनदारी है, जिससे वाणिज्यिक बैंकों की विफलता की स्थिति में भी पैसा सुरक्षित रहता है।'
    ],
    deepAnalysisEn: [
      'Understanding e-RUPI: It is a purpose-specific prepaid SMS/QR-based electronic voucher. It does not require a bank account, internet banking, or a smartphone to redeem. The fund is tied directly to the service (e.g., vaccine drive, fertilizer subsidy, school fees).',
      'Understanding CBDC (Central Bank Digital Currency): It is a broad-use digital fiat currency backed by Distributed Ledger Technology (DLT). It operates exactly like physical paper cash, allowing peer-to-peer and peer-to-merchant transfers for any purpose.',
      'Sovereign Protection: CBDC is a direct claim on the central bank, insulating the public from commercial bank credit and insolvency risks.'
    ],

    keyProvisionsHi: [
      'e-RUPI का संचालन: NPCI द्वारा यूपीआई (UPI) प्लेटफॉर्म के माध्यम से किया जाता है।',
      'e-RUPI की सीमा: प्रति वाउचर अधिकतम सीमा ₹1,00,000 है और इसे एक से अधिक बार भुनाया जा सकता है (मल्टी-रिडेम्पशन)।',
      'CBDC की विशेषताएं: इसमें ब्याज नहीं मिलता (Non-interest bearing), जिससे पारंपरिक बैंक जमा प्रभावित न हों।'
    ],
    keyProvisionsEn: [
      'e-RUPI Infrastructure: Powered by the National Payments Corporation of India (NPCI) on the robust UPI payment rails.',
      'e-RUPI Cap limits: The monetary cap per voucher was elevated to ₹1,00,000, supporting multi-time redemptions.',
      'CBDC Operational design: Designed as non-interest bearing to prevent bank disintermediation and panic outflows during financial stress.'
    ],

    examImpactHi: 'प्रतियोगी परीक्षाओं में फिएट मनी, लीगल टेंडर, e-RUPI की कार्यप्रणाली, और ब्लॉकचेन आधारित केंद्रीय बैंक डिजिटल मुद्रा (CBDC) के आर्थिक प्रभावों पर बहुत प्रश्न आ रहे हैं।',
    examImpactEn: 'Frequent topic in Financial Markets, RBI monetary systems, digital public infrastructure, and direct benefit transfers (DBT).',

    mcq: {
      questionHi: 'e-RUPI डिजिटल भुगतान समाधान के संदर्भ में निम्नलिखित में से कौन सा कथन सही है?',
      questionEn: 'With reference to the e-RUPI digital payment solution, which of the following statements is correct?',
      optionsHi: [
        'यह एक क्रिप्टोकरेंसी है जिसे कोई भी माइन कर सकता है',
        'यह एक उद्देश्य-विशिष्ट (Purpose-specific) और लाभार्थी-विशिष्ट डिजिटल वाउचर प्रणाली है',
        'इसे केवल क्रेडिट कार्ड धारक ही उपयोग कर सकते हैं',
        'इसके लिए हाई-स्पीड इंटरनेट और स्मार्टफोन अनिवार्य है'
      ],
      optionsEn: [
        'It is a decentralized cryptocurrency that can be mined globally',
        'It is a purpose-specific and beneficiary-specific contactless prepaid digital voucher system',
        'It is strictly limited to commercial credit card holders',
        'It mandatory requires high-speed internet and high-end smartphones'
      ],
      correctIndex: 1,
      explanationHi: 'e-RUPI एक प्रीपेड संपर्क रहित वाउचर है जिसे केवल उस विशिष्ट कार्य के लिए ही भुनाया जा सकता है जिसके लिए इसे जारी किया गया है। इसके लिए इंटरनेट या बैंक खाता अनिवार्य नहीं है।',
      explanationEn: 'e-RUPI is a target-specific and purpose-specific digital voucher requiring zero internet or bank account access for redemption.'
    },
    mainsQuestionHi: 'प्रश्न: e-RUPI और केंद्रीय बैंक डिजिटल मुद्रा (CBDC) किस प्रकार सरकारी कल्याणकारी योजनाओं में लीकेज को रोकने और भारत को डिजिटल अर्थव्यवस्था बनाने में सहायक हैं? विश्लेषण कीजिए। (250 शब्द)',
    mainsQuestionEn: 'Question: Analyze how e-RUPI vouchers and CBDC (Digital Rupee) can optimize the leakproof delivery of welfare subsidies while shaping India\'s sovereign digital currency leadership. (250 words)'
  },
  {
    id: 'ca-9',
    category: 'Science & Tech',
    titleHi: 'इसरो (ISRO) गगनयान (Gaganyaan) और चंद्रयान-4 (Chandrayaan-4) मिशन: भारत का महत्वाकांक्षी अंतरिक्ष रोडमैप',
    titleEn: 'ISRO Future Space Roadmap: Accelerating Gaganyaan Human Spaceflight & Chandrayaan-4 Sample Return Mission',
    summaryHi: 'केंद्रीय मंत्रिमंडल ने भारतीय अंतरिक्ष अनुसंधान संगठन (ISRO) के दो सबसे बड़े आगामी मिशनों - गगनयान (मानवयुक्त अंतरिक्ष उड़ान) और चंद्रयान-4 (चंद्रमा से मिट्टी के नमूने वापस लाने का मिशन) के लिए अतिरिक्त बजटीय आवंटन और कड़े समय-सारणी को मंजूरी दी है।',
    summaryEn: 'Union Cabinet has expanded structural funding for ISRO\'s dual flagship space endeavors: the Gaganyaan Human Spaceflight program (sending Indian astronauts to a 400km Low Earth Orbit) and the complex multi-module Chandrayaan-4 lunar sample return mission.',
    date: '18 सितम्बर 2026',
    readTime: '5.5 मिनट',
    examRelevance: 'UPSC CSE (GS-3 Space & Tech), Defense Services CDS/NDA, SSC CGL Mains, State SI',
    keyFact: 'गगनयान भारत का पहला मानवयुक्त अंतरिक्ष मिशन है। चंद्रयान-4 का लक्ष्य चंद्रमा की सतह से 2-3 किलोग्राम मिट्टी वापस पृथ्वी पर सुरक्षित लाना है।',
    tag: 'Space Exploration Technology',

    backgroundHi: 'चंद्रयान-3 की ऐतिहासिक सफलता (चंद्रमा के दक्षिणी ध्रुव पर सॉफ्ट लैंडिंग) के बाद भारत अब अंतरिक्ष अन्वेषण के अगले चरण में है। भारत ने 2035 तक अपना खुद का "भारतीय अंतरिक्ष स्टेशन" (BAS) स्थापित करने और 2040 तक चंद्रमा पर भारतीय अंतरिक्ष यात्री को उतारने का लक्ष्य रखा है।',
    backgroundEn: 'Building on the historic soft-landing success of Chandrayaan-3, ISRO is executing a progressive deep space roadmap, which targets establishing the Bharatiya Antariksha Station (BAS) by 2035 and putting an Indian on the moon by 2040.',

    deepAnalysisHi: [
      'गगनयान मिशन: इसके तहत 3 अंतरिक्ष यात्रियों (गगननॉट्स) के दल को 3 दिनों के लिए 400 किमी की पृथ्वी की निचली कक्षा (LEO) में भेजा जाएगा और हिंद महासागर में सुरक्षित वापस उतारा जाएगा। मिशन के लिए LVM3 रॉकेट को मानव-रेटेड (Human-Rated LVM3) बनाया गया है।',
      'व्योममित्र (Vyommitra): यह इसरो द्वारा विकसित एक महिला हाफ-ह्यूमनॉइड रोबोट (Half-Humanoid Robot) है, जो वास्तविक मानव मिशन से पहले मानवरहित गगनयान उड़ानों में प्रणालियों की निगरानी के लिए भेजी जाएगी।',
      'चंद्रयान-4 (चंद्र नमूना वापसी): यह एक अत्यधिक जटिल मिशन होगा जिसमें डॉकिंग और अनडॉकिंग (अंतरिक्ष में दो यानों का आपस में जुड़ना और अलग होना) शामिल है। इसमें कुल 5 मॉड्यूल होंगे।'
    ],
    deepAnalysisEn: [
      'Gaganyaan Architecture: Designed to carry a 3-member crew to a 400 km Low Earth Orbit (LEO) for a 3-day duration, followed by a precision splashdown in the Indian Ocean. Launching on a human-rated LVM3 (HLVM3) rocket.',
      'Vyommitra Humanoid: A female half-humanoid robot engineered by ISRO to fly onboard uncrewed test flights. She will mimic crew duties, monitor capsule environment parameters, and read life support gauges.',
      'Chandrayaan-4 Sample Return: A highly intricate multi-stage launch involving orbital docking and undocking maneuvers. It will comprise five structural modules (Ascender, Descender, Transfer, Re-entry, and Propulsion) to retrieve 2-3 kg of lunar soil.'
    ],

    keyProvisionsHi: [
      'गगननॉट्स का प्रशिक्षण: अंतरिक्ष यात्रियों (विंग कमांडर प्रशांत नायर, अजीत कृष्णन, अंगद प्रताप और विंग कमांडर शुभांशु शुक्ला) का प्रशिक्षण रूस के यूरी गागरिन कॉस्मोनॉट ट्रेनिंग सेंटर और नासा (NASA) के सहयोग से हुआ है।',
      'चंद्रयान-4 के चरण: 1) प्रक्षेपण और चंद्रमा पर लैंडिंग, 2) नमूने एकत्र करना, 3) चंद्र सतह से लिफ्ट-ऑफ (Ascender द्वारा), 4) चंद्र कक्षा में ट्रांसफर मॉड्यूल से डॉकिंग, 5) पृथ्वी पर सुरक्षित वापसी।',
      'अंतरिक्ष मलबे की रोकथाम: मिशनों में मलबे को न्यूनतम करने के लिए डिकॉमिशनिंग मानकों का पालन किया जा रहा है।'
    ],
    keyProvisionsEn: [
      'Gagannaut Training: Chosen Indian Air Force test pilots (Prashanth Nair, Ajit Krishnan, Angad Pratap, Shubhanshu Shukla) completed rigorous aerospace training at Yuri Gagarin Center (Russia) and NASA’s Johnson Space Center.',
      'Chandrayaan-4 Stages: 1) Precision lunar landing, 2) Sample collection via robotic arm, 3) Lunar liftoff via ascent vehicle, 4) Autonomous docking with transfer module in lunar orbit, 5) Safe Earth atmospheric reentry.',
      'Orbital Debris Mitigation: Designing upper stages to cleanly de-orbit, complying with Inter-Agency Space Debris Coordination Committee guidelines.'
    ],

    examImpactHi: 'गगनयान के क्रू मॉड्यूल, एस्केप सिस्टम, हाफ-ह्यूमनॉइड व्योममित्र, चंद्रयान-4 की कार्यप्रणाली, और भारत के दीर्घकालिक अंतरिक्ष स्टेशन (BAS) के लक्ष्यों पर आधारित प्रश्न रक्षा एवं विज्ञान खंडों के लिए अत्यंत महत्वपूर्ण हैं।',
    examImpactEn: 'Crucial for Aerospace Engineering topics, space agency collaboration, launcher classifications, and lunar sample return stages.',

    mcq: {
      questionHi: 'इसरो के "गगनयान" मिशन के अंतर्गत अंतरिक्ष में भेजी जाने वाली अर्ध-मानवरूपी (Half-humanoid) रोबोट का नाम क्या है?',
      questionEn: 'What is the name of the female half-humanoid robot developed by ISRO for the uncrewed flight test under the Gaganyaan mission?',
      optionsHi: ['मित्र (Mitra)', 'व्योममित्र (Vyommitra)', 'गगनचित्रा (Gaganchitra)', 'शारदा (Sharda)'],
      optionsEn: ['Mitra', 'Vyommitra', 'Gaganchitra', 'Sharda'],
      correctIndex: 1,
      explanationHi: 'इसरो ने "व्योममित्र" नामक एक हाफ-ह्यूमनॉइड रोबोट विकसित किया है। यह अंतरिक्ष यात्रियों की तरह केबिन पर्यावरण की निगरानी करने और जमीन पर वैज्ञानिकों से बात करने में सक्षम है।',
      explanationEn: 'ISRO developed "Vyommitra" (literally friend in space), a female-looking half-humanoid robot designed to validate crew safety and environment controls before the crewed mission.'
    },
    mainsQuestionHi: 'प्रश्न: चंद्रयान-4 मिशन चंद्रयान-3 की तुलना में तकनीकी रूप से किस प्रकार अधिक जटिल और चुनौतीपूर्ण है? समझाइए। (200 शब्द)',
    mainsQuestionEn: 'Question: How is the Chandrayaan-4 sample return mission technologically more complex and challenging than the Chandrayaan-3 landing mission? Elaborate. (200 words)'
  }
];

interface ArticleDetailModalProps {
  article: DetailedArticleItem;
  isHindi: boolean;
  lang: 'hi' | 'en';
  setLang: React.Dispatch<React.SetStateAction<'hi' | 'en'>>;
  pibMode: boolean;
  setPibMode: React.Dispatch<React.SetStateAction<boolean>>;
  fontSizeLevel: 'normal' | 'large' | 'xlarge';
  setFontSizeLevel: React.Dispatch<React.SetStateAction<'normal' | 'large' | 'xlarge'>>;
  isDoubtDrawerOpen: boolean;
  setIsDoubtDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isPlayingAudio: string | null;
  handleSpeak: (text: string, id: string) => void;
  toggleBookmark: (id: string) => void;
  bookmarkedIds: string[];
  user?: any;
  onOpenLogin?: () => void;
  onClose: () => void;
  showToast: (msg: string, type?: 'info' | 'success' | 'warn' | 'error') => void;
  articleDoubtMessages: Array<{ sender: 'user' | 'ai'; text: string; time: string }>;
  setArticleDoubtMessages: React.Dispatch<React.SetStateAction<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>>;
  userDoubtInput: string;
  setUserDoubtInput: React.Dispatch<React.SetStateAction<string>>;
  isAiDoubtLoading: boolean;
  handleSendArticleDoubt: (text?: string) => void;
  handleToggleVoiceDoubt: () => void;
  isListeningDoubtVoice: boolean;
  doubtEndRef: React.RefObject<HTMLDivElement | null>;
}

const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({
  article,
  isHindi,
  lang,
  setLang,
  pibMode,
  setPibMode,
  fontSizeLevel,
  setFontSizeLevel,
  isDoubtDrawerOpen,
  setIsDoubtDrawerOpen,
  isPlayingAudio,
  handleSpeak,
  toggleBookmark,
  bookmarkedIds,
  user,
  onOpenLogin,
  onClose,
  showToast,
  articleDoubtMessages,
  setArticleDoubtMessages,
  userDoubtInput,
  setUserDoubtInput,
  isAiDoubtLoading,
  handleSendArticleDoubt,
  handleToggleVoiceDoubt,
  isListeningDoubtVoice,
  doubtEndRef
}) => {
  const [selectedMcqAnswer, setSelectedMcqAnswer] = useState<number | null>(null);
  const [showMcqExplanation, setShowMcqExplanation] = useState<boolean>(false);

  const getMinistryLabel = (category: string, isHi: boolean) => {
    switch (category) {
      case 'Science & Tech':
        return isHi ? 'विज्ञान और प्रौद्योगिकी मंत्रालय' : 'Ministry of Science & Technology';
      case 'Economy & Banking':
        return isHi ? 'वित्त मंत्रालय' : 'Ministry of Finance';
      case 'Schemes & Governance':
        return isHi ? 'नवीन और नवीकरणीय ऊर्जा मंत्रालय / योजना मंत्रालय' : 'Ministry of New & Renewable Energy / Ministry of Planning';
      case 'National':
        return isHi ? 'गृह मंत्रालय' : 'Ministry of Home Affairs';
      case 'International':
        return isHi ? 'विदेश मंत्रालय' : 'Ministry of External Affairs';
      default:
        return isHi ? 'पत्र सूचना कार्यालय (PIB)' : 'Press Information Bureau (PIB)';
    }
  };

  const ministryName = getMinistryLabel(article.category, lang === 'hi');
  const releaseId = `20658${article.id.replace(/\D/g, '') || '9'}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fade-in text-left">
      <div className={`w-full max-w-5xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
        pibMode 
          ? 'bg-[#fcfbf9] text-slate-900 border border-amber-800/20' 
          : 'bg-[#0b101e] text-slate-100 border border-slate-700'
      }`}>
        
        {/* Modal Top Bar - Houses Toolbar & Mode Switcher */}
        <div className={`px-4 sm:px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b transition-all duration-300 ${
          pibMode ? 'bg-[#f4f1ea] border-slate-300' : 'bg-slate-900 border-slate-800'
        }`}>
          {/* Mode Switcher: Standard vs PIB Style */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPibMode(true)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                pibMode
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <span>🇮🇳 PIB Release View</span>
            </button>
            <button
              type="button"
              onClick={() => setPibMode(false)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                !pibMode
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
              }`}
            >
              <span>💻 Dark App View</span>
            </button>
          </div>

          {/* Toolbar Controls: Font Size Scaler, Audio, Doubt Drawer Toggle, Bookmark, Close */}
          <div className="flex items-center gap-2 flex-wrap ml-auto md:ml-0">
            {/* Print Release button */}
            <button
              onClick={() => window.print()}
              className={`p-2 rounded-xl border cursor-pointer transition-all ${
                pibMode 
                  ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title={isHindi ? "प्रिंट / PDF सेव करें" : "Print PIB Release"}
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Dynamic Font Size Scaler */}
            <div className={`flex items-center border rounded-xl p-1 gap-1 ${
              pibMode ? 'bg-white border-slate-300' : 'bg-slate-950 border-slate-800'
            }`}>
              <span className={`text-[10px] font-bold px-1 hidden sm:inline ${pibMode ? 'text-slate-500' : 'text-slate-400'}`}>
                {isHindi ? 'फॉन्ट:' : 'Size:'}
              </span>
              <button
                type="button"
                onClick={() => setFontSizeLevel('normal')}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  fontSizeLevel === 'normal'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : pibMode ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
                title="Normal Font"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => setFontSizeLevel('large')}
                className={`px-2.5 py-1 rounded-lg text-sm font-black transition-all cursor-pointer ${
                  fontSizeLevel === 'large'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : pibMode ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
                title="Large Font"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setFontSizeLevel('xlarge')}
                className={`px-2.5 py-1 rounded-lg text-base font-black transition-all cursor-pointer ${
                  fontSizeLevel === 'xlarge'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : pibMode ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
                title="Extra Large Font"
              >
                A+
              </button>
            </div>

            {/* AI Doubt Toggle Button */}
            <button
              type="button"
              onClick={() => setIsDoubtDrawerOpen(!isDoubtDrawerOpen)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
                isDoubtDrawerOpen
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                  : 'bg-gradient-to-r from-cyan-950 to-blue-950 text-cyan-300 border-cyan-500/50 hover:from-cyan-900 hover:to-blue-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>{isDoubtDrawerOpen ? (isHindi ? 'डाउट बंद' : 'Close Doubt') : (isHindi ? '💬 AI डाउट' : '💬 Ask AI')}</span>
            </button>

            {/* Audio Reader */}
            <button
              onClick={() => handleSpeak(
                lang === 'hi' 
                  ? `${article.titleHi}. मुख्य सारांश: ${article.summaryHi}. पृष्ठभूमि: ${article.backgroundHi}. परीक्षा महत्व: ${article.examImpactHi}`
                  : `${article.titleEn}. Summary: ${article.summaryEn}. Background: ${article.backgroundEn}. Exam Significance: ${article.examImpactEn}`,
                article.id
              )}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isPlayingAudio === article.id
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : pibMode ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{isPlayingAudio === article.id ? (isHindi ? 'रोकें' : 'Stop') : (isHindi ? 'सुनें' : 'Listen')}</span>
            </button>

            <button
              onClick={() => toggleBookmark(article.id)}
              className={`p-2 border rounded-xl cursor-pointer transition-colors ${
                pibMode ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
              }`}
              title="Bookmark"
            >
              <Bookmark className={`w-4 h-4 ${bookmarkedIds.includes(article.id) ? 'fill-cyan-500 text-cyan-500' : ''}`} />
            </button>

            {/* Toggle Bilingual Language (English/Hindi) inside the modal */}
            <button
              onClick={() => setLang(prev => prev === 'hi' ? 'en' : 'hi')}
              className={`px-2.5 py-1.5 border rounded-xl font-bold text-xs cursor-pointer ${
                pibMode ? 'bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-900' : 'bg-indigo-950/80 hover:bg-indigo-900 border-indigo-500/40 text-indigo-200'
              }`}
              title="Toggle Language"
            >
              {lang === 'hi' ? 'English Translate' : 'हिन्दी अनुवाद'}
            </button>

            <button
              onClick={onClose}
              className="p-2 bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-500 border border-rose-500/30 rounded-xl cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body - Dynamic Styles based on pibMode */}
        <div className={`flex-1 overflow-y-auto p-4 sm:p-8 relative transition-colors duration-300 ${
          pibMode ? 'bg-[#fcfbf9] text-slate-900' : 'bg-[#0a0f1d] text-slate-100'
        }`}>
          <div className={`mx-auto transition-all duration-300 ${isDoubtDrawerOpen ? 'max-w-3xl' : 'max-w-4xl'} space-y-6`}>
            
            {/* AUTHENTIC PIB BANNER WRAPPER */}
            {pibMode && (
              <div className="border-b-2 border-slate-900/15 pb-4 space-y-3 print:block">
                {/* Tricolor Accent Ribbon */}
                <div className="flex h-1.5 w-full">
                  <div className="bg-[#FF9933] flex-1"></div>
                  <div className="bg-white flex-1"></div>
                  <div className="bg-[#138808] flex-1"></div>
                </div>
                
                {/* PIB Delhi Header Title */}
                <div className="flex flex-col items-center text-center py-2">
                  <div className="text-xs font-bold tracking-widest text-[#FF9933] font-sans">
                    सत्यमेव जयते
                  </div>
                  <h1 className="font-serif text-lg sm:text-2xl font-extrabold tracking-tight text-slate-900 mt-1 uppercase">
                    {lang === 'hi' ? 'पत्र सूचना कार्यालय' : 'Press Information Bureau'}
                  </h1>
                  <p className="text-[10px] sm:text-xs font-sans tracking-widest text-slate-600 font-semibold uppercase">
                    {lang === 'hi' ? 'भारत सरकार' : 'Government of India'}
                  </p>
                </div>

                {/* Ministry and Post Details */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] sm:text-xs font-mono text-slate-700 bg-slate-100/80 p-3 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block"></span>
                    <span className="font-bold">{ministryName}</span>
                  </div>
                  <div className="flex flex-col sm:items-end">
                    <span>{isHindi ? 'स्थान: नई दिल्ली' : 'Posted On: Delhi'}</span>
                    <span className="text-slate-500">{article.date}</span>
                    <span className="text-amber-700 font-bold">Release ID: {releaseId}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Standard Non-PIB Header Banner */}
            {!pibMode && (
              <div className="space-y-3 border-b border-slate-800 pb-5">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-full text-xs font-bold">
                    {article.category}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Posted on: {article.date}</span>
                </div>
                <div className="text-xs sm:text-sm font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 p-3 rounded-2xl flex items-center gap-2">
                  🎯 <strong>{isHindi ? 'परीक्षा उपयोगिता (Target Exams):' : 'Exam Focus:'}</strong> {article.examRelevance}
                </div>
              </div>
            )}

            {/* Article Main Headline (Serif style for PIB, Bold Sans for App style) */}
            <div className="space-y-3">
              <h2 className={`leading-snug tracking-tight text-slate-900 ${
                pibMode 
                  ? 'font-serif font-black text-[#111c24]' 
                  : 'font-black text-white'
              } ${
                fontSizeLevel === 'normal' ? 'text-xl sm:text-2xl' : fontSizeLevel === 'xlarge' ? 'text-2xl sm:text-4xl' : 'text-2xl sm:text-3xl'
              }`}>
                {lang === 'hi' ? article.titleHi : article.titleEn}
              </h2>
              {pibMode && (
                <div className="text-xs font-sans text-slate-600 italic">
                  🎯 {isHindi ? 'विशेष परीक्षा विश्लेषण सामग्री (IAS/SSC हेतु उपयोगी)' : 'Optimized Exam Brief for IAS, SSC & State Services'}
                </div>
              )}
            </div>

            {/* Editorial Header Image (The Hindu & PIB Style) */}
            <div className="rounded-2xl overflow-hidden border border-slate-700/60 shadow-lg relative bg-slate-900">
              <img 
                src={article.imageUrl || "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80"} 
                alt={article.titleEn} 
                className="w-full h-56 sm:h-72 object-cover hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 sm:p-4 flex items-center justify-between">
                <span className="px-2.5 py-1 bg-amber-500 text-slate-950 font-black text-[10px] uppercase rounded-md tracking-wider">
                  {article.category} Editorial
                </span>
                <span className="text-[11px] font-mono text-slate-300 font-bold">
                  {isHindi ? 'द हिन्दू / पीआईबी विशेष विश्लेषण' : 'The Hindu & PIB Curated'}
                </span>
              </div>
            </div>

            {/* Section 1: Executive Summary */}
            <div className="space-y-2.5">
              <h3 className={`text-sm sm:text-base font-black flex items-center gap-2 uppercase tracking-wider ${
                pibMode ? 'text-amber-800' : 'text-amber-400'
              }`}>
                <FileText className="w-4 h-4" />
                {isHindi ? '1. मुख्य सारांश (Executive Summary)' : '1. Executive Summary'}
              </h3>
              <p className={`font-normal rounded-2xl shadow-sm border ${
                pibMode 
                  ? 'text-slate-800 bg-amber-500/5 border-amber-900/10 p-5 font-serif' 
                  : 'text-slate-100 bg-[#0e1628] border-slate-800 p-5 shadow-inner'
              } ${
                fontSizeLevel === 'normal' ? 'text-sm leading-relaxed' : fontSizeLevel === 'xlarge' ? 'text-lg sm:text-xl leading-loose' : 'text-base sm:text-lg leading-relaxed'
              }`}>
                {lang === 'hi' ? article.summaryHi : article.summaryEn}
              </p>
            </div>

            {/* Section 2: Genesis & Historical Background */}
            <div className="space-y-2.5">
              <h3 className={`text-sm sm:text-base font-black flex items-center gap-2 uppercase tracking-wider ${
                pibMode ? 'text-blue-800' : 'text-cyan-400'
              }`}>
                <Lightbulb className="w-4 h-4" />
                {isHindi ? '2. पृष्ठभूमि व ऐतिहासिक संदर्भ (Background & Genesis)' : '2. Background & Genesis'}
              </h3>
              <p className={`font-normal rounded-2xl border ${
                pibMode 
                  ? 'text-slate-800 bg-[#f4f3ef] border-slate-300 p-5 font-serif' 
                  : 'text-slate-200 bg-slate-900/60 border-slate-800 p-5'
              } ${
                fontSizeLevel === 'normal' ? 'text-sm leading-relaxed' : fontSizeLevel === 'xlarge' ? 'text-lg sm:text-xl leading-loose' : 'text-base sm:text-lg leading-relaxed'
              }`}>
                {lang === 'hi' ? article.backgroundHi : article.backgroundEn}
              </p>
            </div>

            {/* Vocabulary & Anto-Synonyms Widget */}
            <div className={`border rounded-2xl p-4 sm:p-5 space-y-3 shadow-md ${
              pibMode ? 'bg-[#f4f1ea] border-amber-800/20 text-slate-900' : 'bg-[#0e1424] border-indigo-500/30 text-slate-100'
            }`}>
              <div className="flex items-center gap-2">
                <span className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl">
                  📖
                </span>
                <div>
                  <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-indigo-300">
                    {isHindi ? 'महत्वपूर्ण शब्दावली, पर्यायवाची व विलोम शब्द (Vocabulary & Anto-Synonyms)' : 'Key Exam Vocabulary & Anto-Synonyms'}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {isHindi ? 'आर्टिकल में प्रयुक्त कठिन शब्दों का परीक्षा-उन्मुख विश्लेषण' : 'Exam-grade word meanings & synonyms extracted from this editorial'}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
                  <div className="font-extrabold text-xs text-cyan-300">1. Interoperability (इंटरऑपरेबिलिटी)</div>
                  <div className="text-[11px] text-slate-300"><strong>अर्थ:</strong> विभिन्न प्रणालियों का आपस में डेटा आदान-प्रदान करना।</div>
                  <div className="text-[10px] text-emerald-400"><strong>Synonyms:</strong> Compatibility, Integration</div>
                  <div className="text-[10px] text-rose-400"><strong>Antonyms:</strong> Isolation, Segregation</div>
                </div>
                <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
                  <div className="font-extrabold text-xs text-amber-300">2. Sovereign (संप्रभु / सॉवरेन)</div>
                  <div className="text-[11px] text-slate-300"><strong>अर्थ:</strong> सर्वोच्च सत्ता संपन्न जो बाहरी नियंत्रण से मुक्त हो।</div>
                  <div className="text-[10px] text-emerald-400"><strong>Synonyms:</strong> Autonomous, Independent</div>
                  <div className="text-[10px] text-rose-400"><strong>Antonyms:</strong> Dependent, Subordinate</div>
                </div>
              </div>
            </div>

            {/* SOFT LOGIN WALL IF !user */}
            {!user ? (
              <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-rose-500/20 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 text-center space-y-4 my-8 shadow-2xl backdrop-blur-md">
                <div className="w-12 h-12 bg-amber-500/20 border border-amber-500/40 rounded-2xl flex items-center justify-center mx-auto text-amber-400 font-black text-xl">
                  🔒
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg sm:text-xl font-black text-white">
                    {isHindi ? 'पूरा आर्टिकल, इन-डेप्थ विश्लेषण और प्रैक्टिस MCQs अनलॉक करें!' : 'Unlock Full Article, In-Depth Analysis & MCQs!'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
                    {isHindi 
                      ? 'आपने मुख्य सारांश और शब्दावली पढ़ ली है। आगे के सभी विस्तृत आयाम, नीतिगत प्रावधान, प्रैक्टिस प्रश्न और AI डाउट असिस्टेंट का लाभ उठाने के लिए मुफ्त लॉगिन करें।' 
                      : 'You have read the executive summary. Sign in for free to access full in-depth dimensions, policy provisions, practice MCQs, and AI tutor.'}
                  </p>
                </div>
                <button
                  onClick={() => onOpenLogin?.()}
                  className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-sm rounded-2xl shadow-xl transition-all cursor-pointer active:scale-95 inline-flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>{isHindi ? '🔑 मुफ्त लॉगिन करें (Login / Register)' : '🔑 Sign In / Register Free'}</span>
                </button>
              </div>
            ) : (
              <>
                {/* Section 3: Deep Technical Analysis */}
                <div className="space-y-2.5">
                  <h3 className={`text-sm sm:text-base font-black flex items-center gap-2 uppercase tracking-wider ${
                    pibMode ? 'text-emerald-800' : 'text-emerald-400'
                  }`}>
                    <Zap className="w-4 h-4" />
                    {isHindi ? '3. विस्तृत आयाम व मुख्य बिंदु (In-Depth Dimensions)' : '3. In-Depth Dimensions'}
                  </h3>
                  <div className={`space-y-3 rounded-2xl border ${
                    pibMode ? 'bg-[#f6fbf8] border-emerald-900/10 p-5' : 'bg-slate-900/80 border-slate-800 p-5'
                  }`}>
                    {(lang === 'hi' ? article.deepAnalysisHi : article.deepAnalysisEn).map((pt, i) => (
                      <div key={i} className={`flex items-start gap-3 ${
                        pibMode ? 'text-slate-800' : 'text-slate-100'
                      } ${
                        fontSizeLevel === 'normal' ? 'text-sm' : fontSizeLevel === 'xlarge' ? 'text-lg leading-relaxed' : 'text-base leading-relaxed'
                      }`}>
                        <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className={pibMode ? 'font-serif' : ''}>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 4: Key Policy Provisions */}
                <div className="space-y-2.5">
                  <h3 className={`text-sm sm:text-base font-black flex items-center gap-2 uppercase tracking-wider ${
                    pibMode ? 'text-indigo-800' : 'text-indigo-400'
                  }`}>
                    <Award className="w-4 h-4" />
                    {isHindi ? '4. प्रमुख नीतिगत प्रावधान (Key Provisions & Data)' : '4. Key Provisions & Data'}
                  </h3>
                  <div className={`space-y-3 rounded-2xl border ${
                    pibMode ? 'bg-[#f7f6fc] border-indigo-900/10 p-5' : 'bg-slate-900/80 border-slate-800 p-5'
                  }`}>
                    {(lang === 'hi' ? article.keyProvisionsHi : article.keyProvisionsEn).map((prov, i) => (
                      <div key={i} className={`flex items-start gap-3 ${
                        pibMode ? 'text-slate-800' : 'text-slate-200'
                      } ${
                        fontSizeLevel === 'normal' ? 'text-sm' : fontSizeLevel === 'xlarge' ? 'text-lg leading-relaxed' : 'text-base leading-relaxed'
                      }`}>
                        <span className={`w-2.5 h-2.5 rounded-full shrink-0 mt-2 ${pibMode ? 'bg-indigo-600' : 'bg-indigo-400'}`} />
                        <span className={pibMode ? 'font-serif' : ''}>{prov}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 5: High-Yield Fact Box */}
                <div className={`border-2 p-5 rounded-2xl space-y-2 shadow-sm ${
                  pibMode 
                    ? 'bg-[#fffbeb] border-amber-500/40 text-amber-900' 
                    : 'bg-[#18120c] border-amber-500/50 text-white'
                }`}>
                  <div className={`text-xs sm:text-sm font-black flex items-center gap-2 uppercase tracking-wider ${
                    pibMode ? 'text-amber-800' : 'text-amber-300'
                  }`}>
                    <Target className="w-5 h-5 text-amber-500" />
                    <span>{isHindi ? 'हाई-यील्ड एग्जाम फैक्ट (High-Yield Exam Fact):' : 'High-Yield Exam Fact:'}</span>
                  </div>
                  <p className={`font-bold ${
                    fontSizeLevel === 'normal' ? 'text-sm' : fontSizeLevel === 'xlarge' ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'
                  } ${pibMode ? 'font-serif' : ''}`}>{article.keyFact}</p>
                </div>

                {/* Section 6: Interactive Practice MCQ */}
                <div className={`border p-6 rounded-2xl space-y-4 shadow-md ${
                  pibMode ? 'bg-white border-slate-300 text-slate-800' : 'bg-[#0f1524] border-slate-800 text-white'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-1.5 ${
                      pibMode ? 'text-cyan-800' : 'text-cyan-400'
                    }`}>
                      <HelpCircle className="w-4 h-4" />
                      {isHindi ? 'अभ्यास प्रश्न (Interactive Practice MCQ)' : 'Practice MCQ'}
                    </span>
                    <span className={`text-xs px-2.5 py-1 rounded-md font-bold ${
                      pibMode ? 'bg-slate-100 text-slate-700 border border-slate-200' : 'bg-slate-800 text-slate-300'
                    }`}>Prelims Level</span>
                  </div>

                  <p className={`font-bold ${
                    fontSizeLevel === 'normal' ? 'text-sm' : fontSizeLevel === 'xlarge' ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'
                  } ${pibMode ? 'font-serif' : ''}`}>
                    {lang === 'hi' ? article.mcq.questionHi : article.mcq.questionEn}
                  </p>

                  <div className="space-y-2.5">
                    {(lang === 'hi' ? article.mcq.optionsHi : article.mcq.optionsEn).map((opt, idx) => {
                      const isSelected = selectedMcqAnswer === idx;
                      const isCorrect = idx === article.mcq.correctIndex;
                      let btnClass = pibMode 
                        ? "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100" 
                        : "bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700";
                      
                      if (selectedMcqAnswer !== null) {
                        if (isCorrect) {
                          btnClass = pibMode
                            ? "bg-emerald-50 border-emerald-500 text-emerald-800 font-bold"
                            : "bg-emerald-950/80 border-emerald-500 text-emerald-100 font-bold shadow-md shadow-emerald-950/50";
                        } else if (isSelected) {
                          btnClass = pibMode
                            ? "bg-rose-50 border-rose-400 text-rose-800"
                            : "bg-rose-950/80 border-rose-500 text-rose-100";
                        }
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setSelectedMcqAnswer(idx);
                            setShowMcqExplanation(true);
                            if (idx === article.mcq.correctIndex) {
                              showToast(isHindi ? "सही उत्तर! 🎉 शाबाश!" : "Correct Answer! 🎉", "success");
                            } else {
                              showToast(isHindi ? "गलत उत्तर! व्याख्या देखें।" : "Incorrect! Check explanation.", "warn");
                            }
                          }}
                          className={`w-full text-left p-3.5 rounded-xl border text-sm sm:text-base transition-all flex items-center justify-between cursor-pointer ${btnClass}`}
                        >
                          <span className={pibMode ? 'font-serif' : ''}>{String.fromCharCode(65 + idx)}. {opt}</span>
                          {selectedMcqAnswer !== null && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {showMcqExplanation && (
                    <div className={`p-4 rounded-xl text-sm sm:text-base space-y-1.5 animate-fade-in border ${
                      pibMode 
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                        : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100'
                    }`}>
                      <strong className="block text-emerald-700 font-bold">{isHindi ? 'सटीक व्याख्या (Detailed Solution):' : 'Explanation:'}</strong>
                      <p className={pibMode ? 'font-serif' : ''}>{lang === 'hi' ? article.mcq.explanationHi : article.mcq.explanationEn}</p>
                    </div>
                  )}
                </div>

                {/* Section 7: Mains Descriptive Model Question */}
                <div className={`border p-5 rounded-2xl space-y-2.5 ${
                  pibMode ? 'bg-[#f5f7fa] border-slate-300 text-slate-800' : 'bg-indigo-950/40 border-indigo-500/40 text-slate-100'
                }`}>
                  <span className={`text-xs sm:text-sm font-black uppercase tracking-wider block ${
                    pibMode ? 'text-indigo-800' : 'text-indigo-300'
                  }`}>
                    ✍️ {isHindi ? 'मुख्य परीक्षा संभावित प्रश्न (Mains Analytical Question):' : 'Mains Analytical Question:'}
                  </span>
                  <p className={`font-medium leading-relaxed italic ${
                    fontSizeLevel === 'normal' ? 'text-sm' : fontSizeLevel === 'xlarge' ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'
                  } ${pibMode ? 'font-serif' : ''}`}>
                    "{lang === 'hi' ? article.mainsQuestionHi : article.mainsQuestionEn}"
                  </p>
                </div>
              </>
            )}

            {/* Footer Action Bar: Trigger AI Doubt or Return */}
            <div className={`pt-6 pb-8 flex flex-col sm:flex-row items-center justify-between gap-3 border-t ${
              pibMode ? 'border-slate-300' : 'border-slate-800'
            }`}>
              <button
                type="button"
                onClick={() => setIsDoubtDrawerOpen(true)}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-black text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isHindi ? '💬 इस आर्टिकल पर Hans Compain से डाउट पूछें' : '💬 Ask Hans Compain Doubt on this Article'}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className={`w-full sm:w-auto px-5 py-3 font-bold text-sm rounded-2xl cursor-pointer ${
                  pibMode ? 'bg-slate-200 hover:bg-slate-300 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {isHindi ? 'वापस करंट अफेयर्स सूची पर जाएं' : 'Back to Current Affairs List'}
              </button>
            </div>

          </div>
        </div>

        {/* ON-DEMAND SLIDE-OVER AI DOUBT DRAWER */}
        {isDoubtDrawerOpen && (
          <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-slate-950/98 border-l border-cyan-500/40 p-4 sm:p-5 shadow-2xl flex flex-col animate-fade-in backdrop-blur-xl">
            
            {/* Drawer Header */}
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">Hans Compain Article Tutor</h4>
                  <p className="text-[11px] text-slate-400">{isHindi ? 'लाइव 2026 करंट अफेयर्स डाउट सॉल्वर' : 'Live Doubt Clarification'}</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setArticleDoubtMessages([
                      {
                        sender: 'ai',
                        text: isHindi ? 'डाउट चैट रीसेट हुआ। आप इस आर्टिकल के बारे में कुछ भी पूछ सकते हैं!' : 'Chat reset. Ask anything about this article!',
                        time: 'Now'
                      }
                    ]);
                  }}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
                  title="Clear chat"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsDoubtDrawerOpen(false)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer"
                  title="Close Drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Prompts Chips */}
            <div className="py-2.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {[
                isHindi ? 'सरल भाषा में समझाएं' : 'Explain simply',
                isHindi ? 'भारत पर क्या प्रभाव?' : 'Impact on India',
                isHindi ? 'एग्जाम में क्या प्रश्न आएगा?' : 'Exam questions',
                isHindi ? 'मुख्य शब्दावली स्पष्ट करें' : 'Key terms'
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendArticleDoubt(chip)}
                  className="px-3 py-1 bg-slate-900 hover:bg-cyan-500/20 hover:text-cyan-300 border border-slate-700 rounded-xl text-xs font-bold text-slate-300 whitespace-nowrap cursor-pointer transition-all"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-sm py-2">
              {articleDoubtMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1 animate-fade-in`}
                >
                  <div
                    className={`p-3.5 rounded-2xl max-w-[90%] leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-cyan-500 text-slate-950 font-bold rounded-tr-none'
                        : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-none font-medium'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 px-1">{msg.time}</span>
                </div>
              ))}

              {isAiDoubtLoading && (
                <div className="flex items-center gap-2 text-cyan-400 text-xs p-3 bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none animate-pulse">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>{isHindi ? 'Hans Compain सोच रहा है और सटीक व्याख्या लिख रहा है...' : 'Hans Compain is drafting explanation...'}</span>
                </div>
              )}
              <div ref={doubtEndRef} />
            </div>

            {/* Chat Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendArticleDoubt();
              }}
              className="pt-3 border-t border-slate-800 flex items-center gap-2"
            >
              <button
                type="button"
                onClick={handleToggleVoiceDoubt}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isListeningDoubtVoice
                    ? 'bg-rose-600 text-white border-rose-400 animate-ping'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                }`}
                title="Speak Doubt"
              >
                {isListeningDoubtVoice ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                value={userDoubtInput}
                onChange={(e) => setUserDoubtInput(e.target.value)}
                placeholder={isHindi ? "आर्टिकल पर डाउट या सवाल पूछें..." : "Type your doubt or question..."}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 outline-none focus:border-cyan-500 transition-colors"
              />

              <button
                type="submit"
                disabled={!userDoubtInput.trim() || isAiDoubtLoading}
                className="p-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 rounded-xl font-bold transition-all cursor-pointer border-none"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>
        )}

      </div>
    </div>
  );
};

export const CurrentAffairsHubView: React.FC<CurrentAffairsHubViewProps> = ({ onStartQuiz, showToast, language = 'hindi', user, onOpenLogin }) => {
  const isHindi = language === 'hindi';
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [lang, setLang] = useState<'hi' | 'en'>(isHindi ? 'hi' : 'en');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);

  // Live Auto-Updating Articles State
  const [articles, setArticles] = useState<DetailedArticleItem[]>([]);
  const [isLoadingLive, setIsLoadingLive] = useState<boolean>(false);

  // Deep Article Reader Modal States
  const [selectedArticle, setSelectedArticle] = useState<DetailedArticleItem | null>(null);

  // Auto-open article if shared URL contains ?article=id
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const articleId = params.get('article');
      if (articleId) {
        const found = articles.find(a => a.id === articleId) || ARTICLES_DATABASE.find(a => a.id === articleId);
        if (found) {
          setSelectedArticle(found);
        }
      }
    } catch (e) {}
  }, [articles]);
  const [selectedMcqAnswer, setSelectedMcqAnswer] = useState<number | null>(null);
  const [showMcqExplanation, setShowMcqExplanation] = useState<boolean>(false);

  // Article Reader UX: Dynamic Font Scaling, On-Demand AI Doubt Drawer, and PIB Official Page Mode
  const [fontSizeLevel, setFontSizeLevel] = useState<'normal' | 'large' | 'xlarge'>('large');
  const [isDoubtDrawerOpen, setIsDoubtDrawerOpen] = useState<boolean>(false);
  const [pibMode, setPibMode] = useState<boolean>(true); // Let's default to true since they requested it!

  // In-line AI Doubt / Chat inside the Article Modal
  const [articleDoubtMessages, setArticleDoubtMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([]);
  const [userDoubtInput, setUserDoubtInput] = useState<string>('');
  const [isAiDoubtLoading, setIsAiDoubtLoading] = useState<boolean>(false);
  const [isListeningDoubtVoice, setIsListeningDoubtVoice] = useState<boolean>(false);
  const doubtEndRef = useRef<HTMLDivElement | null>(null);

  // Custom Topic Generator
  const [customTopicModalOpen, setCustomTopicModalOpen] = useState(false);
  const [customTopicQuery, setCustomTopicQuery] = useState('');
  const [isGeneratingCustomTopic, setIsGeneratingCustomTopic] = useState(false);

  // Helper to calculate dynamic auto-updating dates relative to today
  const getRelativeDateString = (daysOffset: number, isHi: boolean): string => {
    const d = new Date();
    d.setDate(d.getDate() - daysOffset);
    const day = d.getDate();
    const year = d.getFullYear();
    const monthsHi = ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];
    const monthsEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthStr = isHi ? monthsHi[d.getMonth()] : monthsEn[d.getMonth()];
    return `${day} ${monthStr} ${year}`;
  };

  const getFallbackArticles = (isHi: boolean): DetailedArticleItem[] => {
    return ARTICLES_DATABASE.map((item, idx) => {
      const offset = Math.min(Math.floor(idx / 2), 4);
      return {
        ...item,
        date: getRelativeDateString(offset, isHi)
      };
    });
  };

  useEffect(() => {
    setLang(isHindi ? 'hi' : 'en');
  }, [language]);

  useEffect(() => {
    if (doubtEndRef.current) {
      doubtEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [articleDoubtMessages]);

  // Handle Dynamic Auto-Updating and Syncing Live Current Affairs
  useEffect(() => {
    // 1. Instantly display dynamic date-shifted fallback articles so dates are always 100% updated to today/yesterday/etc.
    const initialLocal = getFallbackArticles(isHindi);
    setArticles(initialLocal);

    // 2. Fetch the real-world, search-grounded daily current affairs live from Gemini
    const fetchDailyArticlesLive = async () => {
      setIsLoadingLive(true);
      try {
        const response = await fetch('/api/current-affairs/daily', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ language: isHindi ? 'hindi' : 'english' })
        });
        if (response.ok) {
          const data = await response.json();
          if (data.articles && Array.isArray(data.articles) && data.articles.length > 0) {
            setArticles(data.articles);
            showToast(isHindi ? "✨ दैनिक करंट अफेयर्स लाइव अपडेट हो गए हैं!" : "✨ Daily Current affairs synchronized live!", "success");
          }
        }
      } catch (err) {
        console.error("Failed to load live daily news", err);
      } finally {
        setIsLoadingLive(false);
      }
    };

    fetchDailyArticlesLive();
  }, [language]);

  const categories = ['All', 'National', 'International', 'Economy & Banking', 'Science & Tech', 'Sports', 'Schemes & Governance'];

  const filteredArticles = articles.filter(item => {
    const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchSearch = item.titleHi.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.keyFact.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(bookmarkedIds.filter(b => b !== id));
      showToast(isHindi ? "बुकमार्क से हटाया गया" : "Removed from bookmarks", "info");
    } else {
      setBookmarkedIds([...bookmarkedIds, id]);
      showToast(isHindi ? "करंट अफेयर्स सेव किया गया! 📌" : "Article bookmarked! 📌", "success");
    }
  };

  const handleSpeak = (text: string, id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isPlayingAudio === id) {
      stopAllSpeech();
      setIsPlayingAudio(null);
      return;
    }
    stopAllSpeech();
    setIsPlayingAudio(id);
    speakText(text, {
      lang: lang === 'hi' ? 'hi-IN' : 'en-IN',
      rate: 1.0,
      onEnd: () => setIsPlayingAudio(null),
      onError: () => setIsPlayingAudio(null)
    });
  };

  const handleOpenArticle = (article: DetailedArticleItem) => {
    stopAllSpeech();
    setSelectedArticle(article);
    setSelectedMcqAnswer(null);
    setShowMcqExplanation(false);

    // Save to user reading history
    try {
      const existing = JSON.parse(localStorage.getItem('hans-compain-read-articles') || '[]');
      const filtered = existing.filter((item: any) => item.id !== article.id);
      const updated = [{
        id: article.id,
        category: article.category,
        titleHi: article.titleHi,
        titleEn: article.titleEn,
        date: article.date,
        imageUrl: article.imageUrl,
        readAt: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }, ...filtered].slice(0, 50);
      localStorage.setItem('hans-compain-read-articles', JSON.stringify(updated));
    } catch (e) {}

    setArticleDoubtMessages([
      {
        sender: 'ai',
        text: isHindi 
          ? `नमस्ते! मैं आपका Hans Compain स्टडी ट्यूटर हूँ। "${article.titleHi}" के संबंध में आपका कोई भी डाउट, सवाल या परीक्षा संबंधित विश्लेषण हो तो मुझसे यहीं पूछें!`
          : `Hello! I am your Hans Compain Study Tutor. If you have any doubt, query, or exam question regarding "${article.titleEn}", feel free to ask me right here!`,
        time: 'Just now'
      }
    ]);
  };

  const handleSendArticleDoubt = async (queryText?: string) => {
    const textToSend = queryText || userDoubtInput.trim();
    if (!textToSend || !selectedArticle) return;

    const userMsg = { sender: 'user' as const, text: textToSend, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setArticleDoubtMessages(prev => [...prev, userMsg]);
    setUserDoubtInput('');
    setIsAiDoubtLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `The student is reading this current affairs article:\nTitle: ${selectedArticle.titleHi} / ${selectedArticle.titleEn}\nKey Fact: ${selectedArticle.keyFact}\nExam Relevance: ${selectedArticle.examRelevance}\n\nStudent Doubt/Question: "${textToSend}"\n\nPlease provide a crystal-clear, deep, structured, and easy-to-understand explanation in ${isHindi ? 'Hindi (हिन्दी)' : 'English'}. Include real-life analogies, bullet points, and exam context.`,
          systemInstruction: `You are Hans Compain Current Affairs Tutor. Explain news topics, policies, economics, science, and constitution in simple, friendly, and comprehensive student-friendly language.`
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiMsg = { 
          sender: 'ai' as const, 
          text: data.reply || (isHindi ? 'व्याख्या प्राप्त हुई।' : 'Explanation generated.'), 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        };
        setArticleDoubtMessages(prev => [...prev, aiMsg]);
        // Speak AI reply briefly if desired
        speakText(aiMsg.text.slice(0, 160), { lang: isHindi ? 'hi-IN' : 'en-IN' });
      } else {
        throw new Error("Server error");
      }
    } catch (e) {
      setArticleDoubtMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: isHindi ? 'माफ़ कीजिए, उत्तर प्राप्त करने में समस्या हुई। कृपया पुनः प्रयास करें।' : 'Sorry, could not fetch answer right now. Please retry.',
          time: 'Now'
        }
      ]);
    } finally {
      setIsAiDoubtLoading(false);
    }
  };

  const handleToggleVoiceDoubt = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast(isHindi ? "वॉयस इनपुट इस ब्राउज़र में समर्थित नहीं है।" : "Voice recognition not supported in browser.", "warn");
      return;
    }

    if (isListeningDoubtVoice) {
      setIsListeningDoubtVoice(false);
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = isHindi ? 'hi-IN' : 'en-US';

      rec.onstart = () => {
        setIsListeningDoubtVoice(true);
        showToast(isHindi ? "🎙️ अपना सवाल बोलिए..." : "🎙️ Speak your question...", "info");
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0]?.transcript || "";
        if (transcript) {
          setUserDoubtInput(transcript);
          handleSendArticleDoubt(transcript);
        }
      };

      rec.onerror = () => setIsListeningDoubtVoice(false);
      rec.onend = () => setIsListeningDoubtVoice(false);

      rec.start();
    } catch (e) {
      setIsListeningDoubtVoice(false);
    }
  };

  const handleGenerateCustomArticle = async () => {
    const topic = customTopicQuery.trim();
    if (!topic) return;

    setIsGeneratingCustomTopic(true);
    showToast(isHindi ? `🔍 "${topic}" का संपूर्ण आर्टिकल व विश्लेषण तैयार हो रहा है...` : `🔍 Generating comprehensive article for "${topic}"...`, "info");

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Generate a structured, high-yield, comprehensive Current Affairs Article for competitive exams on topic: "${topic}".
Include:
1. Title in Hindi & English
2. Summary in Hindi & English
3. Detailed Background & Genesis
4. 4 In-depth analysis bullet points
5. 3 Key provisions/points
6. Exam relevance & high-yield fact
7. 1 MCQ with 4 options, correct answer index, and explanation
8. 1 Mains Analytical question`,
          systemInstruction: `You are Hans Compain Master Academic Editor. Respond with rich, well-formatted current affairs content.`
        })
      });

      if (response.ok) {
        const data = await response.json();
        const generatedText = data.reply;
        
        // Create an on-the-fly article item
        const newArt: DetailedArticleItem = {
          id: `custom-${Date.now()}`,
          category: 'National',
          titleHi: `${topic} - विशेष विश्लेषण व सम्पूर्ण जानकारी`,
          titleEn: `${topic} - In-Depth Article & Policy Analysis`,
          summaryHi: generatedText.slice(0, 200) + '...',
          summaryEn: generatedText.slice(0, 200) + '...',
          date: '27 अगस्त 2026 (Live AI)',
          readTime: '4 मिनट',
          examRelevance: 'UPSC CSE, SSC CGL, State PCS, Railway',
          keyFact: `विशेष परीक्षा नोट्स: ${topic} पर विस्तृत विश्लेषण।`,
          tag: 'AI Generated Deep Analysis',
          backgroundHi: generatedText.slice(0, 400),
          backgroundEn: generatedText.slice(0, 400),
          deepAnalysisHi: [
            'प्रमुख अवधारणाएं और राष्ट्रीय परिप्रेक्ष्य',
            'नीतिगत प्रभाव और आर्थिक आयाम',
            'वैश्विक तुलना और भविष्य का मार्ग'
          ],
          deepAnalysisEn: [
            'Core conceptual framework & national perspective',
            'Policy impact and socio-economic dimensions',
            'Global comparison and roadmap ahead'
          ],
          keyProvisionsHi: [
            'महत्वपूर्ण सांविधिक व प्रशासनिक प्रावधान',
            'वित्तीय आवंटन और कार्यान्वयन एजेंसियां'
          ],
          keyProvisionsEn: [
            'Statutory and administrative guidelines',
            'Fiscal allocation and implementing nodes'
          ],
          examImpactHi: generatedText.slice(200, 450),
          examImpactEn: generatedText.slice(200, 450),
          mcq: {
            questionHi: `${topic} के संदर्भ में सबसे उपयुक्त विकल्प कौन सा है?`,
            questionEn: `Which of the following is most accurate regarding ${topic}?`,
            optionsHi: ['यह भारत के सतत विकास का प्रमुख हिस्सा है', 'यह केवल सीमित क्षेत्रों में लागू है', 'यह अप्रचलित नीति है', 'इनमें से कोई नहीं'],
            optionsEn: ['It is a key pillar of sustainable growth', 'Applicable only to limited zones', 'Outdated policy', 'None of the above'],
            correctIndex: 0,
            explanationHi: `${topic} भारत के आर्थिक व तकनीकी विकास का महत्वपूर्ण घटक है।`,
            explanationEn: `${topic} forms an essential pillar of technological and economic advancement.`
          },
          mainsQuestionHi: `प्रश्न: ${topic} के महत्व और चुनौतियों की समीक्षा कीजिए। (200 शब्द)`,
          mainsQuestionEn: `Question: Critically analyze the importance and challenges associated with ${topic}. (200 words)`
        };

        setArticles(prev => [newArt, ...prev]);
        setCustomTopicModalOpen(false);
        setCustomTopicQuery('');
        handleOpenArticle(newArt);
        showToast(isHindi ? "✨ नया विस्तृत आर्टिकल तैयार है!" : "✨ Custom article generated!", "success");
      }
    } catch (e) {
      showToast(isHindi ? "आर्टिकल जनरेट करने में असमर्थ। पुनः प्रयास करें।" : "Failed to generate custom article.", "error");
    } finally {
      setIsGeneratingCustomTopic(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-3 sm:p-6 md:p-8 bg-[#0a0f1d] text-slate-100 space-y-6">
      
      {/* Minimal Clean Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-600 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
            <Newspaper className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>HANS COMPAIN NEWS HUB</span>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] rounded border border-amber-200 uppercase font-bold">PIB Integrated</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium italic">
              {isHindi ? 'हर सपने को मिलेगी उड़ान, जब साथ हो Hans Compain का सच्चा ज्ञान!' : 'Empowering every student with authentic current affairs knowledge.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setCustomTopicModalOpen(true)}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2 border-none active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{isHindi ? 'AI आर्टिकल जनरेटर' : 'AI Article Generator'}</span>
          </button>
          <button
            onClick={() => {
              if (onStartQuiz) onStartQuiz("Current Affairs 2026 Daily Master Quiz");
              else showToast(isHindi ? "क्विज़ लोड किया जा रहा है..." : "Loading quiz...", "info");
            }}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2 border-none active:scale-95"
          >
            <Flame className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span>{isHindi ? 'आज का लाइव टेस्ट' : 'Daily Live Test'}</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border-none ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isHindi ? "सर्च करें: 6G, ISRO, RBI, खेल..." : "Search topics, exams..."}
            className="bg-transparent border-none outline-none text-xs text-slate-200 placeholder:text-slate-500 w-full"
          />
        </div>
      </div>

      {/* Articles Grid - News Portal Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 text-left">
        {filteredArticles.map(item => {
          const isSaved = bookmarkedIds.includes(item.id);
          const isPlaying = isPlayingAudio === item.id;

          return (
            <div
              key={item.id}
              onClick={() => handleOpenArticle(item)}
              className="bg-white border border-slate-200 hover:border-amber-500/50 rounded-3xl p-6 transition-all hover:shadow-2xl flex flex-col md:flex-row gap-6 cursor-pointer group relative overflow-hidden"
            >
              {/* Category Vertical Label Accent */}
              <div className={`absolute top-0 left-0 w-1.5 h-full ${
                item.category === 'National' ? 'bg-amber-600' : 
                item.category === 'Economy & Banking' ? 'bg-emerald-600' :
                item.category === 'Science & Tech' ? 'bg-indigo-600' : 'bg-cyan-600'
              }`} />

              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                      {item.category}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.date}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleSpeak(lang === 'hi' ? `${item.titleHi}. ${item.summaryHi}` : `${item.titleEn}. ${item.summaryEn}`, item.id, e)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        isPlaying
                          ? 'bg-amber-500 text-white border-amber-400 animate-pulse'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={(e) => toggleBookmark(item.id, e)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        isSaved
                          ? 'bg-rose-100 text-rose-600 border-rose-200'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-400 border-slate-200'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-rose-600' : ''}`} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-black text-slate-900 text-lg sm:text-xl leading-tight group-hover:text-amber-700 transition-colors">
                    {lang === 'hi' ? item.titleHi : item.titleEn}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 font-medium">
                    {lang === 'hi' ? item.summaryHi : item.summaryEn}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                      HC
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-slate-900 uppercase">Hans Compain Editorial</div>
                      <div className="text-[9px] font-bold text-slate-400 italic">{item.readTime} Read</div>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-slate-900 text-white text-[11px] font-black rounded-lg group-hover:bg-amber-600 transition-colors">
                    READ ARTICLE
                  </span>
                </div>
              </div>

              {/* Sidebar Info Card inside card for PIB style feel */}
              <div className="md:w-56 bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 shrink-0">
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-amber-800 uppercase tracking-wider block flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    EXAM FOCUS
                  </span>
                  <div className="text-[11px] font-bold text-slate-700 line-clamp-2">{item.examRelevance}</div>
                </div>
                
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-emerald-800 uppercase tracking-wider block flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    KEY DATA
                  </span>
                  <div className="text-[11px] font-bold text-slate-600 italic line-clamp-3">"{item.keyFact}"</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    {/* FULL DEEP-DIVE ARTICLE MODAL & IN-LINE AI DOUBT TUTOR */}
      {selectedArticle && (
        <ArticleDetailModal
          article={selectedArticle}
          isHindi={isHindi}
          lang={lang}
          setLang={setLang}
          pibMode={pibMode}
          setPibMode={setPibMode}
          fontSizeLevel={fontSizeLevel}
          setFontSizeLevel={setFontSizeLevel}
          isDoubtDrawerOpen={isDoubtDrawerOpen}
          setIsDoubtDrawerOpen={setIsDoubtDrawerOpen}
          isPlayingAudio={isPlayingAudio}
          handleSpeak={handleSpeak}
          toggleBookmark={toggleBookmark}
          bookmarkedIds={bookmarkedIds}
          user={user}
          onOpenLogin={onOpenLogin}
          onClose={() => {
            stopAllSpeech();
            setSelectedArticle(null);
            setIsDoubtDrawerOpen(false);
          }}
          showToast={showToast}
          articleDoubtMessages={articleDoubtMessages}
          setArticleDoubtMessages={setArticleDoubtMessages}
          userDoubtInput={userDoubtInput}
          setUserDoubtInput={setUserDoubtInput}
          isAiDoubtLoading={isAiDoubtLoading}
          handleSendArticleDoubt={handleSendArticleDoubt}
          handleToggleVoiceDoubt={handleToggleVoiceDoubt}
          isListeningDoubtVoice={isListeningDoubtVoice}
          doubtEndRef={doubtEndRef}
        />
      )}

      {/* CUSTOM TOPIC GENERATOR MODAL */}
      {customTopicModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/40 w-full max-w-lg rounded-3xl p-6 space-y-4 shadow-2xl text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="font-black text-white text-base">
                  {isHindi ? 'कस्टम करंट अफेयर्स आर्टिकल जनरेटर' : 'AI Topic Article Generator'}
                </h3>
              </div>
              <button
                onClick={() => setCustomTopicModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              {isHindi 
                ? 'जिस भी ट्रेंडिंग टॉपिक पर आप विस्तार से पढ़ना चाहते हैं (उदा: "G20 Summit 2026", "Unified Pension Scheme", "Gaganyaan Mission"), यहाँ लिखें:'
                : 'Enter any current affairs keyword or news event to generate a full article with practice MCQs & doubt assistant:'}
            </p>

            <input
              type="text"
              value={customTopicQuery}
              onChange={(e) => setCustomTopicQuery(e.target.value)}
              placeholder="e.g. India Semiconductor Mission 2.0 / PM E-DRIVE Scheme"
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-3.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-cyan-400"
              autoFocus
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setCustomTopicModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl"
              >
                {isHindi ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                onClick={handleGenerateCustomArticle}
                disabled={!customTopicQuery.trim() || isGeneratingCustomTopic}
                className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                {isGeneratingCustomTopic ? (isHindi ? 'आर्टिकल तैयार हो रहा है...' : 'Generating...') : (isHindi ? '✨ संपूर्ण आर्टिकल बनाएं' : '✨ Generate Deep Article')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
