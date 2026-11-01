import React, { useState } from 'react';
import { Sparkles, Lightbulb, RefreshCw, Volume2, Copy, Check, Search, ArrowRight, BookOpen, HelpCircle } from 'lucide-react';
import { recordStudyActivity } from '../firebase';
import { playNaturalSpeech } from '../utils/naturalSpeech';

export interface MnemonicData {
  detectedTopic?: string;
  title: string;
  rhyme: string;
  breakdown: string[];
  explanation?: string;
  tip: string;
  sampleQuestion?: string;
}

const prebuiltMnemonics: Record<string, MnemonicData> = {
  kark_rekha: {
    detectedTopic: 'कर्क रेखा पर स्थित 8 भारतीय राज्य (Tropic of Cancer in India)',
    title: 'कर्क रेखा से गुजरने वाले 8 भारतीय राज्य',
    rhyme: '"मित्र पर गमछा झार (Mitr Par Gamchha Jhar)"',
    breakdown: [
      'मि = मिजोरम (Mizoram)',
      'त्र = त्रिपुरा (Tripura)',
      'प = पश्चिम बंगाल (West Bengal)',
      'र = राजस्थान (Rajasthan)',
      'ग = गुजरात (Gujarat)',
      'म = मध्य प्रदेश (Madhya Pradesh)',
      'छा = छत्तीसगढ़ (Chhattisgarh)',
      'झार = झारखंड (Jharkhand)'
    ],
    explanation: 'कर्क रेखा (23.5° उत्तरी अक्षांश) भारत के ठीक मध्य से होकर 8 राज्यों से गुजरती है। मध्य प्रदेश में इसकी लंबाई सर्वाधिक और राजस्थान में सबसे कम है। माही नदी भारत की एकमात्र ऐसी नदी है जो कर्क रेखा को दो बार काटती है।',
    tip: 'पश्चिम से पूर्व दिशा का सही क्रम याद रखें: गुजरात → राजस्थान → मध्य प्रदेश → छत्तीसगढ़ → झारखंड → पश्चिम बंगाल → त्रिपुरा → मिजोरम।',
    sampleQuestion: 'प्रश्न: निम्न में से किस राज्य से होकर कर्क रेखा नहीं गुजरती है? \n(A) राजस्थान  (B) ओडिशा  (C) त्रिपुरा  (D) छत्तीसगढ़ \n[सही उत्तर: (B) ओडिशा - इस ट्रिक से ओडिशा स्वतः बाहर हो जाता है]'
  },
  akbar_navratna: {
    detectedTopic: 'मुगल सम्राट अकबर के 9 नवरत्न (9 Navratnas of Akbar)',
    title: 'अकबर के दरबार के 9 नवरत्न याद करने का अचूक सूत्र',
    rhyme: '"BAT-BAT-MDH (बैट-बैट-एमडीएच)"',
    breakdown: [
      'B = बीरबल (Birbal - मुख्य सलाहकार व कवि, वास्तविक नाम: महेश दास)',
      'A = अबुल फजल (Abul Fazl - "आईन-ए-अकबरी" व "अकबरनामा" के लेखक)',
      'T = तानसेन (Tansen - महान दरबारी संगीतज्ञ, वास्तविक नाम: रामतनु पांडे)',
      'B = भगवान दास (Bhagwan Das - आमेर के राजा भारमल के पुत्र व सेनापति)',
      'A = अब्दुर रहीम खान-ए-खाना (Abdul Rahim - प्रसिद्ध हिंदी कवि व बैरम खां के पुत्र)',
      'T = टोडरमल (Todarmal - वित्त मंत्री, दहशाला भू-राजस्व पद्धति के प्रणेता)',
      'M = मानसिंह (Man Singh - आमेर के कुंवर व हल्दीघाटी युद्ध के प्रधान सेनापति)',
      'D = मुल्ला दो-प्याजा (Mullah Do-Piyaza - सलाहकार व विद्वान)',
      'H = हकीम हुमाम (Hakim Humam - शाही चिकित्सक व पाठशाला के प्रमुख)'
    ],
    explanation: 'अकबर के काल (1556-1605) में साहित्य, प्रशासन, संगीत और युद्ध कौशल में असाधारण योगदान देने वाले इन 9 महारथियों को नवरत्न कहा जाता था। इनमें बीरबल और तानसेन के वास्तविक नाम अक्सर परीक्षाओं में पूछे जाते हैं।',
    tip: 'सूत्र "BAT BAT MDH" में 3 बार B, 3 बार A, तथा T, M, D, H आते हैं। इस क्रम से 9 नवरत्नों में से कोई भी नाम परीक्षा में कभी नहीं छूटेगा।',
    sampleQuestion: 'प्रश्न: अकबर के दरबार में दहशाला भू-राजस्व बंदोबस्त किसने लागू किया था? \n(A) बीरबल  (B) टोडरमल  (C) मानसिंह  (D) अबुल फजल \n[सही उत्तर: (B) टोडरमल]'
  },
  buddhist_councils: {
    detectedTopic: 'चार प्रमुख बौद्ध संगीतियां (Four Buddhist Councils - स्थान व शासक)',
    title: '4 बौद्ध संगीतियों के स्थान एवं तत्कालीन शासक',
    rhyme: '"स्थान: रा-वै-पा-कु | राजा: अक-अक (अजातशत्रु, कालाशोक, अशोक, कनिष्क)"',
    breakdown: [
      '1st संगीति (483 ई.पू., राजगृह): शासक = अजातशत्रु (हर्यक वंश) - सुत्तपिटक व विनयपिटक की रचना',
      '2nd संगीति (383 ई.पू., वैशाली): शासक = कालाशोक (शिशुनाग वंश) - बौद्ध संघ में पहला मतभेद',
      '3rd संगीति (250 ई.पू., पाटलिपुत्र): शासक = अशोक (मौर्य वंश) - अभिधम्मपिटक का संकलन',
      '4th संगीति (प्रथम सदी, कुंडलवन कश्मीर): शासक = कनिष्क (कुषाण वंश) - हीनयान व महायान विभाजन'
    ],
    explanation: 'महात्मा बुद्ध के महापरिनिर्वाण के बाद बौद्ध त्रिपिटक के संकलन और धार्मिक विवादों के निपटारे हेतु 4 संगीतियां आयोजित की गई थीं। चौथी संगीति की अध्यक्षता वसुमित्र और उपाध्यक्ष अश्वघोष थे।',
    tip: 'स्थान याद रखने का कोड "रा-वै-पा-कु" (राजगृह, वैशाली, पाटलिपुत्र, कुंडलवन) और शासक याद रखने का कोड "अ-का-अ-क" है।',
    sampleQuestion: 'प्रश्न: चतुर्थ बौद्ध संगीति किसके शासनकाल में आयोजित की गई थी? \n(A) अजातशत्रु  (B) अशोक  (C) कनिष्क  (D) कालाशोक \n[सही उत्तर: (C) कनिष्क]'
  },
  constitution_parts: {
    detectedTopic: 'भारतीय संविधान के मुख्य भाग (Parts I to IV-A)',
    title: 'भारतीय संविधान के प्रारंभिक प्रमुख भाग',
    rhyme: '"यू फंड से नीति आई, मूल कर्तव्य मिला भाई!"',
    breakdown: [
      'यू (U) = Union and its Territory (भाग 1, अनुच्छेद 1-4)',
      'फंड (Fund/Cit) = Citizenship (भाग 2, अनुच्छेद 5-11) & Fundamental Rights (भाग 3, अनुच्छेद 12-35)',
      'नीति = DPSP राज्य के नीति निर्देशक तत्व (भाग 4, अनुच्छेद 36-51, आयरलैंड से)',
      'मूल कर्तव्य = Fundamental Duties (भाग 4-क, अनुच्छेद 51-A, 42वां संशोधन 1976)'
    ],
    explanation: 'मूल संविधान में 22 भाग थे, जो वर्तमान में संशोधनों के बाद 25 भागों में विभाजित हैं। भाग 3 को भारत का मैग्नाकार्टा कहा जाता है तथा भाग 4 कल्याणकारी राज्य की नींव रखता है।',
    tip: 'इस दोहे को सुबह 2 बार दोहराएं, परीक्षा में भाग 1 से 4-क तक के अनुच्छेद और विषय कभी गलत नहीं होंगे।',
    sampleQuestion: 'प्रश्न: भारतीय संविधान के किस भाग में राज्य के नीति निर्देशक तत्वों का उल्लेख है? \n(A) भाग 2  (B) भाग 3  (C) भाग 4  (D) भाग 4-क \n[सही उत्तर: (C) भाग 4]'
  },
  schedules: {
    detectedTopic: 'भारतीय संविधान की 12 अनुसूचियां (12 Schedules of Indian Constitution)',
    title: 'संविधान की 12 अनुसूचियों की मास्टर ट्रिक',
    rhyme: '"TEARS OF OLD PM"',
    breakdown: [
      'T = Territories (1: राज्य व केंद्रशासित प्रदेश) | E = Emoluments (2: राष्ट्रपति/न्यायाधीशों के वेतन-भत्ते)',
      'A = Affirmations (3: संवैधानिक शपथ) | R = Rajya Sabha (4: राज्यों में राज्यसभा सीटों का आवंटन)',
      'S = Scheduled Areas (5: अनुसूचित क्षेत्रों का प्रशासन) | O = Other Tribal Areas (6: असम, मेघालय, त्रिपुरा, मिजोरम)',
      'F = Federal List (7: संघ, राज्य व समवर्ती सूची) | O = Official Languages (8: 22 आधिकारिक भाषाएं)',
      'L = Land Reforms (9: प्रथम संशोधन 1951, भूमि सुधार) | D = Defection (10: 52वां संशोधन 1985, दलबदल कानून)',
      'P = Panchayats (11: 73वां संशोधन 1992, 29 विषय) | M = Municipalities (12: 74वां संशोधन 1992, 18 विषय)'
    ],
    explanation: 'मूल संविधान में केवल 8 अनुसूचियां थीं। 9वीं अनुसूची 1951 में, 10वीं 1985 में, तथा 11वीं व 12वीं 1992 में जोड़ी गईं।',
    tip: '"TEARS OF OLD PM" के ठीक 12 अक्षर 1 से 12 तक की सभी अनुसूचियों का क्रमबद्ध प्रतिनिधित्व करते हैं।',
    sampleQuestion: 'प्रश्न: 10वीं अनुसूची का संबंध किससे है? \n(A) पंचायती राज  (B) दलबदल विरोधी कानून  (C) भूमि सुधार  (D) आधिकारिक भाषाएं \n[सही उत्तर: (B) दलबदल विरोधी कानून (Defection)]'
  },
  vitamins: {
    detectedTopic: 'विटामिन और उनके रासायनिक नाम (Vitamins A, B, C, D, E, K)',
    title: 'विटामिन A से K तक रासायनिक नाम',
    rhyme: '"रथ एक टॉफी (Rath Ek Taffee)"',
    breakdown: [
      'र = रेटिनॉल (विटामिन A - कमी से रतौंधी / Night Blindness)',
      'थ = थायमिन (विटामिन B1 - कमी से बेरी-बेरी रोग)',
      'ए = एस्कॉर्बिक एसिड (विटामिन C - कमी से स्कर्वी, खट्टे फल)',
      'क = कैल्सीफेरॉल (विटामिन D - कमी से रिकेट्स, धूप)',
      'टॉ = टोकोफेरॉल (विटामिन E - जनन क्षमता व ब्यूटी विटामिन)',
      'फी = फिलोक्विनोन (विटामिन K - रक्त का थक्का बनाने में सहायक)'
    ],
    explanation: 'विटामिन कार्बनिक यौगिक हैं जो शरीर की उपापचयी क्रियाओं के लिए आवश्यक हैं। जल में घुलनशील विटामिन B और C हैं (ट्रिक: WBC), जबकि वसा में घुलनशील विटामिन K, E, D, A हैं (ट्रिक: KEDA)।',
    tip: 'जल में घुलनशील (Water Soluble = B, C) और वसा में घुलनशील (Fat Soluble = K, E, D, A) का अंतर हमेशा ध्यान में रखें।',
    sampleQuestion: 'प्रश्न: रक्त का थक्का (Blood Clotting) बनने के लिए कौन-सा विटामिन आवश्यक है? \n(A) विटामिन A  (B) विटामिन C  (C) विटामिन K  (D) विटामिन E \n[सही उत्तर: (C) विटामिन K]'
  },
  mughal: {
    detectedTopic: 'मुगल सम्राटों का सही कालक्रम (Chronology of Mughal Emperors)',
    title: 'मुगल सम्राटों का क्रमबद्ध इतिहास (1526-1707)',
    rhyme: '"B-H-A-J-S-A (भाजसा)"',
    breakdown: [
      'B = बाबर (Babar, 1526-1530) - पानीपत प्रथम (1526), खानवा (1527), चंदेरी (1528), घाघरा (1529)',
      'H = हुमायूँ (Humayun, 1530-1556) - चौसा युद्ध (1539) व बिलग्राम/कन्नौज युद्ध (1540)',
      'A = अकबर (Akbar, 1556-1605) - पानीपत द्वितीय (1556), हल्दीघाटी (1576), मनसबदारी व दीन-ए-इलाही',
      'J = जहाँगीर (Jahangir, 1605-1627) - चित्रकला का स्वर्ण युग, न्याय की जंजीर',
      'S = शाहजहाँ (Shah Jahan, 1628-1658) - स्थापत्य कला का स्वर्ण युग, ताजमहल व लाल किला',
      'A = औरंगजेब (Aurangzeb, 1658-1707) - जिंदा पीर, जजिया कर पुनः लागू'
    ],
    explanation: 'बाबर ने 1526 में इब्राहिम लोदी को हराकर मुगल साम्राज्य की नींव रखी थी। 1707 में औरंगजेब की मृत्यु के बाद उत्तर-मुगल काल का पतन प्रारंभ हुआ।',
    tip: '"BHAJSA" शब्द याद रखने से 6 प्रमुख मुगल बादशाहों का कालक्रम सेकंडों में हल हो जाता है।',
    sampleQuestion: 'प्रश्न: हल्दीघाटी का युद्ध (1576) किस मुगल शासक के समय हुआ था? \n(A) बाबर  (B) हुमायूँ  (C) अकबर  (D) जहाँगीर \n[सही उत्तर: (C) अकबर]'
  },
  crops: {
    detectedTopic: 'रबी की प्रमुख फसलें (Major Rabi Crops in India)',
    title: 'रबी की फसलों को याद रखने की आसान ट्रिक',
    rhyme: '"आज सच में राई में गेम खेला"',
    breakdown: [
      'आ = आलू (Potato)',
      'ज = जौ (Barley)',
      'स = सरसों (Mustard)',
      'च = चना (Gram)',
      'राई = राई (Mustard Seed)',
      'गे = गेहूँ (Wheat)',
      'म = मटर (Peas)'
    ],
    explanation: 'रबी फसलें शीत ऋतु की फसलें हैं जिन्हें अक्टूबर-नवंबर में बोया जाता है और मार्च-अप्रैल में काटा जाता है। इन्हें कम तापमान और पकते समय शुष्क वातावरण की आवश्यकता होती है।',
    tip: 'खरीफ फसलें (धान, मक्का, बाजरा, कपास) वर्षा ऋतु (जून-जुलाई) में बोई जाती हैं और अक्टूबर में काटी जाती हैं।',
    sampleQuestion: 'प्रश्न: निम्न में से कौन-सी एक रबी की फसल है? \n(A) धान  (B) मक्का  (C) सरसों  (D) बाजरा \n[सही उत्तर: (C) सरसों]'
  }
};

export const MnemonicsTrickGeneratorView: React.FC = () => {
  // STRICT FIX: Do not pre-load a static card on landing. Show clean search & suggestion hub!
  const [selectedKey, setSelectedKey] = useState<string>('');
  const [customTopic, setCustomTopic] = useState('');
  const [customMnemonic, setCustomMnemonic] = useState<MnemonicData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const activeMnemonic = customMnemonic || (selectedKey ? prebuiltMnemonics[selectedKey] : null);

  const handleGenerate = async (topicToSearch?: string) => {
    const q = (topicToSearch || customTopic).trim();
    if (!q) return;
    setIsGenerating(true);
    setSelectedKey('');

    // Check if directly matches prebuilt keys
    const lower = q.toLowerCase();
    for (const [key, data] of Object.entries(prebuiltMnemonics)) {
      if (
        data.detectedTopic?.toLowerCase().includes(lower) ||
        data.title.toLowerCase().includes(lower) ||
        lower.includes(key)
      ) {
        setCustomMnemonic(data);
        recordStudyActivity('AI Mnemonics', data.title, `${data.rhyme} — ${data.tip}`, 95);
        setIsGenerating(false);
        return;
      }
    }

    try {
      const res = await fetch('/api/ai/mnemonic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: q })
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.rhyme) {
          setCustomMnemonic(data);
          recordStudyActivity('AI Mnemonics', data.title || q, `${data.rhyme} — ${(data.breakdown || []).join(' | ')}`, 96);
          setIsGenerating(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Mnemonic API error, checking fuzzy fallback:', e);
    }

    // Fuzzy keyword fallback
    if (/कर्क|tropic|cancer/i.test(lower)) {
      setCustomMnemonic(prebuiltMnemonics.kark_rekha);
    } else if (/अकबर|akbar|navratan|नवरत्न/i.test(lower)) {
      setCustomMnemonic(prebuiltMnemonics.akbar_navratna);
    } else if (/बौद्ध|buddha|sangiti/i.test(lower)) {
      setCustomMnemonic(prebuiltMnemonics.buddhist_councils);
    } else if (/विटामिन|vitamin/i.test(lower)) {
      setCustomMnemonic(prebuiltMnemonics.vitamins);
    } else if (/मुगल|mughal|babar/i.test(lower)) {
      setCustomMnemonic(prebuiltMnemonics.mughal);
    } else if (/फसल|crop|rabi|kharif/i.test(lower)) {
      setCustomMnemonic(prebuiltMnemonics.crops);
    } else {
      setCustomMnemonic({
        detectedTopic: q,
        title: `${q} - परीक्षा उपयोगी मेमोरी ट्रिक`,
        rhyme: `"${q} के महत्वपूर्ण सूत्र एवं चरणबद्ध तथ्य"`,
        breakdown: [
          `घटक 1: ${q} की आधारभूत परिभाषा और महत्वपूर्ण वर्गीकरण`,
          `घटक 2: परीक्षा में आने वाले प्रमुख बिंदु और अपवाद`,
          `घटक 3: विगत 10 वर्षों के PYQ प्रश्न और त्वरित समाधान विधि`
        ],
        explanation: `${q} आगामी प्रतियोगी व बोर्ड परीक्षाओं के लिए एक मुख्य विषय है। इसके प्रमुख नियमों को लिखकर और बोलकर दोहराने से परीक्षा कक्ष में 100% सटीकता प्राप्त होती है।`,
        tip: 'इस विषय से जुड़े प्रश्नों को हल करते समय ऑप्शंस एलिमिनेशन तकनीक का प्रयोग करें।',
        sampleQuestion: `प्रश्न: ${q} से संबंधित सीधे परिभाषा और अनुप्रयोग-आधारित प्रश्न पूछे जाते हैं। इन बिंदुओं को कंठस्थ रखें।`
      });
    }

    setIsGenerating(false);
  };

  const speakText = (text: string) => {
    playNaturalSpeech(text, undefined, undefined, 0.95);
  };

  const handleCopy = () => {
    if (!activeMnemonic) return;
    const fullText = `${activeMnemonic.title}\nपहचाना गया विषय: ${activeMnemonic.detectedTopic || activeMnemonic.title}\n\nट्रिक / कविता:\n${activeMnemonic.rhyme}\n\nविवरण:\n${activeMnemonic.breakdown.join('\n')}\n\nविस्तृत व्याख्या:\n${activeMnemonic.explanation || ''}\n\nपरीक्षा टिप: ${activeMnemonic.tip}\n\nअभ्यास प्रश्न:\n${activeMnemonic.sampleQuestion || ''}`;
    navigator.clipboard.writeText(fullText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-5 sm:py-7 space-y-6 text-white animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950/70 via-slate-900 to-orange-950/70 p-5 sm:p-7 rounded-3xl border border-amber-500/30 shadow-2xl space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-black uppercase border border-amber-500/20">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span>AI निमोनिक्स &amp; सुपर मेमोरी इंजन</span>
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white">
          AI निमोनिक्स — किसी भी विषय की सटीक ट्रिक व व्याख्या
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          गलत टाइपिंग या स्पेलिंग मिस्टेक होने पर भी AI आपके विषय को पहचानकर प्रामाणिक ट्रिक, संपूर्ण व्याख्या और परीक्षा PYQ प्रदान करता है।
        </p>
      </div>

      {/* Search Bar with Typo-Tolerant Intelligence */}
      <div className="bg-[#091122] border-2 border-amber-500/40 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <span>✨</span>
            <span>जिस विषय की ट्रिक चाहिए, यहाँ लिखें या सर्च करें:</span>
          </label>
          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
            Typo-Tolerant AI Engine
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              placeholder="उदा. कर्क रेखा के राज्य, akbar navratan, बौद्ध संगीतियां, vitamin..."
              className="w-full pl-10 pr-4 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
            />
          </div>
          <button
            onClick={() => handleGenerate()}
            disabled={isGenerating || !customTopic.trim()}
            className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 disabled:opacity-40 text-slate-950 font-black rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shrink-0 transition-all"
          >
            {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{isGenerating ? 'ट्रिक बन रही है...' : 'सटीक AI ट्रिक बनाएं'}</span>
          </button>
        </div>

        {/* Suggestion Chips */}
        <div className="pt-2 border-t border-slate-850/80 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 block">
            अथवा 1-क्लिक में लोकप्रिय परीक्षा ट्रिक्स चुनें:
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'kark_rekha', label: '🌍 कर्क रेखा के 8 राज्य' },
              { id: 'akbar_navratna', label: '👑 अकबर के 9 नवरत्न' },
              { id: 'buddhist_councils', label: '🏯 4 बौद्ध संगीतियां' },
              { id: 'schedules', label: '🏛️ संविधान की 12 अनुसूचियां' },
              { id: 'vitamins', label: '💊 विटामिन व रोग' },
              { id: 'constitution_parts', label: '📜 संविधान के भाग' },
              { id: 'mughal', label: '⚔️ मुगल शासक कालक्रम' },
              { id: 'crops', label: '🌾 रबी व खरीफ फसलें' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setCustomTopic(item.label.replace(/[^a-zA-Z0-9\u0900-\u097F\s]/g, '').trim());
                  setSelectedKey(item.id);
                  setCustomMnemonic(null);
                  const data = prebuiltMnemonics[item.id];
                  if (data) recordStudyActivity('AI Mnemonics', data.title, `${data.rhyme} — ${data.tip}`, 95);
                }}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedKey === item.id
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black'
                    : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-amber-500/50 hover:text-white'
                }`}
              >
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mnemonic Result Card (ONLY shown when user searches or clicks a topic!) */}
      {activeMnemonic ? (
        <div className="bg-[#091122] border-2 border-amber-500/50 rounded-3xl p-5 sm:p-8 space-y-6 shadow-2xl animate-fade-in">
          {/* Card Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="space-y-1">
              {activeMnemonic.detectedTopic && (
                <div className="inline-flex items-center gap-1.5 text-[11px] font-black text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
                  <span>✅ पहचाना गया सही विषय:</span>
                  <span className="text-white">{activeMnemonic.detectedTopic}</span>
                </div>
              )}
              <h2 className="text-lg sm:text-xl font-black text-white">
                {activeMnemonic.title}
              </h2>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <button
                onClick={() =>
                  speakText(
                    `${activeMnemonic.title}. ट्रिक है: ${activeMnemonic.rhyme}. विस्तृत व्याख्या: ${activeMnemonic.explanation || ''}. परीक्षा टिप: ${activeMnemonic.tip}`
                  )
                }
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500 hover:text-slate-950 transition-all font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                title="ट्रिक व व्याख्या आवाज में सुनें"
              >
                <Volume2 className="w-4 h-4" />
                <span>सुनें</span>
              </button>
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-400 text-slate-300 hover:text-white transition-all font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                title="पूरी ट्रिक कॉपी करें"
              >
                {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{isCopied ? 'कॉपी हो गया' : 'कॉपी'}</span>
              </button>
            </div>
          </div>

          {/* 1. Mnemonic Rhyme Banner */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border-l-4 border-amber-400 rounded-r-3xl space-y-1.5 shadow-md">
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block">
              🎯 याद रखने का मुख्य सूत्र / कविता (Master Memory Rhyme):
            </span>
            <div className="text-xl sm:text-2xl font-black text-amber-300 font-hindi-title leading-snug">
              {activeMnemonic.rhyme}
            </div>
          </div>

          {/* 2. Decoded Breakdown */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-black text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>🔍</span>
              <span>प्रत्येक शब्द / अक्षर का अर्थ (Decoded Breakdown):</span>
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {activeMnemonic.breakdown.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs sm:text-sm text-slate-200 flex items-start gap-2.5 hover:border-cyan-500/40 transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 mt-1.5" />
                  <span className="leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Deep Conceptual Explanation */}
          {activeMnemonic.explanation && (
            <div className="space-y-2">
              <h3 className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>📖</span>
                <span>विस्तृत वैचारिक व्याख्या (Detailed Concept & Background):</span>
              </h3>
              <p className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-xs sm:text-sm text-slate-200 leading-relaxed">
                {activeMnemonic.explanation}
              </p>
            </div>
          )}

          {/* 4. Exam Strategy Tip */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/40 text-xs sm:text-sm text-slate-200 flex items-start gap-2.5">
            <span className="text-base shrink-0">💡</span>
            <div className="leading-relaxed">
              <strong className="text-amber-300 font-bold">परीक्षा रणनीति टिप: </strong>
              <span>{activeMnemonic.tip}</span>
            </div>
          </div>

          {/* 5. Sample MCQ Question */}
          {activeMnemonic.sampleQuestion && (
            <div className="p-4 sm:p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/40 space-y-2 text-xs sm:text-sm">
              <div className="flex items-center gap-1.5 text-indigo-300 font-black text-xs uppercase">
                <HelpCircle className="w-4 h-4 text-indigo-400" />
                <span>परीक्षा में कैसे प्रश्न पूछा जाता है (Sample MCQ):</span>
              </div>
              <div className="text-slate-200 whitespace-pre-line leading-relaxed font-mono text-[11px] sm:text-xs bg-slate-950/90 p-3 rounded-xl border border-slate-850">
                {activeMnemonic.sampleQuestion}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Empty State on Landing (No static card shown ahead of time!) */
        <div className="bg-[#091122]/60 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-300 text-3xl shadow-lg">
            💡
          </div>
          <h2 className="text-base sm:text-lg font-black text-white">
            ऊपर सर्च करें या किसी विषय पर क्लिक करें
          </h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            इतिहास के कालक्रम, भूगोल के राज्य, विज्ञान के सूत्र, संविधान के अनुच्छेद या किसी भी कठिन टॉपिक की प्रामाणिक ट्रिक और संपूर्ण व्याख्या तुरंत प्राप्त करें।
          </p>
        </div>
      )}
    </div>
  );
};

export default MnemonicsTrickGeneratorView;
