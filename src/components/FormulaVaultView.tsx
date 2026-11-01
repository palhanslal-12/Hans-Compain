import React, { useState, useEffect } from 'react';
import { X, Search, Sparkles, BookOpen, Volume2, CheckCircle2, Play, Pause, RotateCcw, Clock, Zap, Copy, Check, Filter } from 'lucide-react';
import { playNaturalSpeech } from '../utils/naturalSpeech';

interface FormulaVaultViewProps {
  isOpen: boolean;
  onClose: () => void;
}

export type SubjectKey = 'all' | 'physics' | 'chemistry' | 'math' | 'biology' | 'steno' | 'english' | 'polity';

export interface VaultFormula {
  id: string;
  subject: SubjectKey;
  subjectLabel: string;
  topicCategory: string; // Sub-topic e.g. "प्रकाशिकी (Optics)", "त्रिकोणमिति (Trigonometry)"
  title: string;
  formulaOrRule: string;
  variables: string; // What symbols mean
  exampleOrApplication: string; // Real application
  examTip: string; // Shortcut or common mistake
}

export const vaultFormulasDatabase: VaultFormula[] = [
  // ==================== 1. PHYSICS (भौतिकी) ====================
  {
    id: 'phy_1',
    subject: 'physics',
    subjectLabel: 'भौतिकी (Physics)',
    topicCategory: 'प्रकाशिकी (Optics)',
    title: 'गोलीय दर्पण सूत्र एवं आवर्धन (Mirror Formula & Magnification)',
    formulaOrRule: '1/f = 1/v + 1/u   |   m = -v/u = h₂/h₁',
    variables: 'f = फोकस दूरी, v = प्रतिबिंब की दूरी, u = वस्तु की दूरी, m = रेखीय आवर्धन, h₁ = वस्तु ऊंचाई, h₂ = प्रतिबिंब ऊंचाई',
    exampleOrApplication: 'यदि u = -20 cm, f = -10 cm (अवतल दर्पण) तो 1/v = 1/(-10) - 1/(-20) = -1/20 ⇒ v = -20 cm (वास्तविक प्रतिबिंब)',
    examTip: 'चिह्न परिपाटी (Sign Convention): आपतित प्रकाश की दिशा धनात्मक (+), विपरीत ऋणात्मक (-)। अवतल दर्पण में f हमेशा ऋणात्मक (-) होता है।'
  },
  {
    id: 'phy_2',
    subject: 'physics',
    subjectLabel: 'भौतिकी (Physics)',
    topicCategory: 'प्रकाशिकी (Optics)',
    title: 'लेंस सूत्र एवं लेंस की क्षमता (Lens Formula & Power)',
    formulaOrRule: '1/f = 1/v - 1/u   |   P = 1/f (मीटर में) [मात्रक: डाइऑप्टर (D)]',
    variables: 'f = फोकस दूरी, v = प्रतिबिंब दूरी, u = वस्तु दूरी, P = लेंस क्षमता (Dioptre)',
    exampleOrApplication: 'उत्तल लेंस की फोकस दूरी f = +50 cm = +0.5 m, तो क्षमता P = 1 / 0.5 = +2 D (धनात्मक क्षमता)',
    examTip: 'दर्पण में 1/v + 1/u होता है, जबकि लेंस में 1/v - 1/u होता है। उत्तल लेंस की क्षमता (+) तथा अवतल लेंस की क्षमता (-) होती है।'
  },
  {
    id: 'phy_3',
    subject: 'physics',
    subjectLabel: 'भौतिकी (Physics)',
    topicCategory: 'विद्युत (Electricity)',
    title: 'ओम का नियम एवं प्रतिरोधकता (Ohm’s Law & Resistivity)',
    formulaOrRule: 'V = I × R   |   R = ρ × (L / A)',
    variables: 'V = विभवांतर (Volt), I = धारा (Ampere), R = प्रतिरोध (Ohm, Ω), ρ = विशिष्ट प्रतिरोध/प्रतिरोधकता (Ω·m), L = तार की लंबाई, A = अनुप्रस्थ काट क्षेत्रफल',
    exampleOrApplication: 'तार की लंबाई दोगुनी (2L) करने पर उसका प्रतिरोध भी दोगुना (2R) हो जाता है, यदि आयतन समान रखकर खींचा जाए तो R चार गुना (4R) होगा।',
    examTip: 'तापमान बढ़ाने पर धातुओं का प्रतिरोध बढ़ता है, जबकि अर्धचालकों (Semiconductors: Si, Ge) का प्रतिरोध घटता है।'
  },
  {
    id: 'phy_4',
    subject: 'physics',
    subjectLabel: 'भौतिकी (Physics)',
    topicCategory: 'विद्युत (Electricity)',
    title: 'विद्युत ऊर्जा, शक्ति व जूल का ऊष्मा नियम (Electric Power & Heating)',
    formulaOrRule: 'P = V × I = I²R = V²/R   |   H = I²Rt (जूल)',
    variables: 'P = शक्ति (Watt, W), H = उत्पन्न ऊष्मा (Joule), t = समय (सेकंड), 1 kWh (1 यूनिट) = 3.6 × 10⁶ Joule',
    exampleOrApplication: '100W का बल्ब 220V पर जलने पर धारा I = 100/220 = 0.45A तथा प्रतिरोध R = V²/P = 484 Ω होगा।',
    examTip: 'विद्युत हीटर का तार नाइक्रोम (उच्च गलनांक व उच्च प्रतिरोधकता) तथा बल्ब का फिलामेंट टंगस्टन (उच्चतम गलनांक ~3422°C) का बना होता है।'
  },
  {
    id: 'phy_5',
    subject: 'physics',
    subjectLabel: 'भौतिकी (Physics)',
    topicCategory: 'यांत्रिकी व गति (Mechanics)',
    title: 'न्यूटन के गति समीकरण (Newton’s Equations of Motion)',
    formulaOrRule: 'v = u + at   |   s = ut + ½at²   |   v² = u² + 2as',
    variables: 'u = प्रारंभिक वेग, v = अंतिम वेग, a = त्वरण, t = समय, s = विस्थापन/दूरी',
    exampleOrApplication: 'विरामावस्था (u=0) से 2 m/s² के त्वरण से 5 सेकंड में चली गई दूरी s = 0 + ½(2)(5²) = 25 मीटर होगी।',
    examTip: 'ऊपर फेंकी गई वस्तु के लिए उच्चतम बिंदु पर v = 0 और त्वरण a = -g (-9.8 m/s²) लिया जाता है।'
  },
  {
    id: 'phy_6',
    subject: 'physics',
    subjectLabel: 'भौतिकी (Physics)',
    topicCategory: 'यांत्रिकी व गति (Mechanics)',
    title: 'गुरुत्वाकर्षण एवं पलायन वेग (Gravitation & Escape Velocity)',
    formulaOrRule: 'F = G·(m₁m₂)/r²   |   g = GM/R²   |   v_e = √(2gR) = 11.2 km/s',
    variables: 'G = सार्वत्रिक नियतांक (6.67 × 10⁻¹¹ N·m²/kg²), g = गुरुत्वीय त्वरण (9.8 m/s²), v_e = पृथ्वी पर पलायन वेग (11.2 km/s)',
    exampleOrApplication: 'चंद्रमा पर g का मान पृथ्वी का 1/6 भाग (1.62 m/s²) होता है, इसलिए वहाँ वस्तु का भार 1/6 रह जाता है परंतु द्रव्यमान अपरिवर्तित रहता है।',
    examTip: 'द्रव्यमान (Mass) हर जगह समान रहता है, केवल भार (Weight = mg) गुरुत्वीय त्वरण बदलने पर बदलता है।'
  },

  // ==================== 2. CHEMISTRY (रसायन विज्ञान) ====================
  {
    id: 'chm_1',
    subject: 'chemistry',
    subjectLabel: 'रसायन विज्ञान (Chemistry)',
    topicCategory: 'अम्ल, क्षार व लवण (Acids & Bases)',
    title: 'pH मान पैमाना एवं आयनिक गुणनफल (pH Scale Formula)',
    formulaOrRule: 'pH = -log₁₀[H⁺]   |   pOH = -log₁₀[OH⁻]   |   pH + pOH = 14',
    variables: '[H⁺] = हाइड्रोजन आयन सांद्रता (mol/L)। pH < 7 अम्लीय, pH = 7 उदासीन, pH > 7 क्षारीय',
    exampleOrApplication: 'यदि [H⁺] = 10⁻⁴ M, तो pH = -log(10⁻⁴) = 4 (प्रबल अम्लीय विलयन)। रक्त का सामान्य pH = 7.35 से 7.45 होता है।',
    examTip: 'तापमान बढ़ाने पर जल का आयनिक गुणनफल (Kw) बढ़ता है। लिटमस पत्र अम्ल में नीला से लाल और क्षार में लाल से नीला होता है।'
  },
  {
    id: 'chm_2',
    subject: 'chemistry',
    subjectLabel: 'रसायन विज्ञान (Chemistry)',
    topicCategory: 'मोल संकल्पना व गैस नियम (Mole Concept & Gas Laws)',
    title: 'मोल संकल्पना एवं आदर्श गैस समीकरण (Mole & Ideal Gas Equation)',
    formulaOrRule: 'n = m / M = N / N_A   |   P·V = n·R·T',
    variables: 'm = दिया गया द्रव्यमान, M = मोलर द्रव्यमान, N_A = आवोगाद्रो संख्या (6.022 × 10²³), R = 8.314 J/(mol·K) या 0.0821 L·atm/(mol·K)',
    exampleOrApplication: 'NTP पर 1 मोल किसी भी गैस का आयतन 22.4 लीटर होता है। 44g CO₂ में 1 मोल CO₂ अणु होते हैं।',
    examTip: 'बॉयल का नियम (T स्थिर): P ∝ 1/V | चार्ल्स का नियम (P स्थिर): V ∝ T | गे-लुसाक नियम (V स्थिर): P ∝ T।'
  },
  {
    id: 'chm_3',
    subject: 'chemistry',
    subjectLabel: 'रसायन विज्ञान (Chemistry)',
    topicCategory: 'रासायनिक सूत्र व आवर्त नियम (Periodic Trends)',
    title: 'महत्वपूर्ण लवणों के व्यापारिक व रासायनिक सूत्र',
    formulaOrRule: 'प्लास्टर ऑफ पेरिस: CaSO₄·½H₂O  |  जिप्सम: CaSO₄·2H₂O  |  बेकिंग सोडा: NaHCO₃  |  धावन सोडा: Na₂CO₃·10H₂O',
    variables: 'ब्लीचिंग पाउडर: CaOCl₂  |  कास्टिक सोडा: NaOH  |  नीला थोथा: CuSO₄·5H₂O',
    exampleOrApplication: 'जिप्सम को 373 K पर गर्म करने पर वह जल के अणुओं का त्याग कर प्लास्टर ऑफ पेरिस (POP) बनाता है।',
    examTip: 'POP और जिप्सम के क्रिस्टलन जल के अणुओं की संख्या (½ vs 2) परीक्षा में सर्वाधिक पूछा जाने वाला प्रश्न है।'
  },
  {
    id: 'chm_4',
    subject: 'chemistry',
    subjectLabel: 'रसायन विज्ञान (Chemistry)',
    topicCategory: 'कार्बनिक रसायन (Organic Chemistry)',
    title: 'हाइड्रोकार्बन सामान्य सूत्र (Alkane, Alkene & Alkyne)',
    formulaOrRule: 'एल्केन: C_n H_(2n+2)  |  एल्कीन: C_n H_(2n)  |  एल्काइन: C_n H_(2n-2)',
    variables: 'n = कार्बन परमाणुओं की संख्या (n=1 मेथेन CH₄, n=2 एथेन C₂H₆/एथीन C₂H₄/एथाइन C₂H₂)',
    exampleOrApplication: 'n = 2: एल्केन (एथेन C₂H₆ - एकल बंध), एल्कीन (एथिलीन C₂H₄ - द्विबंध), एल्काइन (एसिटिलीन C₂H₂ - त्रिबंध)',
    examTip: 'एसिटिलीन (C₂H₂) का प्रयोग गैस वेल्डिंग और कच्चे फलों को पकाने में किया जाता है। फल पकाने वाला प्राकृतिक हार्मोन एथिलीन है।'
  },

  // ==================== 3. MATHEMATICS (गणित) ====================
  {
    id: 'mat_1',
    subject: 'math',
    subjectLabel: 'गणित (Mathematics)',
    topicCategory: 'बीजगणित व द्विघात समीकरण (Algebra & Quadratic)',
    title: 'द्विघात समीकरण एवं श्रीधराचार्य सूत्र (Quadratic Formula)',
    formulaOrRule: 'x = [-b ± √(b² - 4ac)] / 2a   |   विविक्तकर (Discriminant) D = b² - 4ac',
    variables: 'ax² + bx + c = 0 में मूल α, β: α + β = -b/a  |  α × β = c/a',
    exampleOrApplication: 'यदि D > 0 तो मूल वास्तविक व भिन्न; D = 0 तो मूल वास्तविक व समान; D < 0 तो कोई वास्तविक मूल नहीं।',
    examTip: 'यदि परीक्षा में दिया हो कि मूल "समान" हैं, तो सीधे b² - 4ac = 0 रखकर अज्ञात अचर (k) का मान ज्ञात करें।'
  },
  {
    id: 'mat_2',
    subject: 'math',
    subjectLabel: 'गणित (Mathematics)',
    topicCategory: 'समांतर श्रेढ़ी व सांख्यिकी (AP & Statistics)',
    title: 'समांतर श्रेढ़ी (AP) n-वां पद व योगफल (Arithmetic Progression)',
    formulaOrRule: 'a_n = a + (n - 1)d   |   S_n = n/2 [2a + (n - 1)d] = n/2 [a + l]',
    variables: 'a = प्रथम पद, d = सार्व अंतर (Common Difference = a₂ - a₁), n = पदों की संख्या, l = अंतिम पद',
    exampleOrApplication: 'AP: 2, 7, 12... का 10वां पद a₁₀ = 2 + (10-1)×5 = 2 + 45 = 47। प्रथम n प्राकृत संख्याओं का योग = n(n+1)/2।',
    examTip: 'सांख्यिकी में बहुलक संबंध (Empirical Mode): बहुलक (Mode) = 3 माध्यिका (Median) - 2 माध्य (Mean)।'
  },
  {
    id: 'mat_3',
    subject: 'math',
    subjectLabel: 'गणित (Mathematics)',
    topicCategory: 'त्रिकोणमिति सर्वसमिकाएं (Trigonometry Identities)',
    title: 'त्रिकोणमितीय सर्वसमिकाएं एवं पूरक कोण (Trigonometry Identities)',
    formulaOrRule: 'sin²θ + cos²θ = 1   |   1 + tan²θ = sec²θ   |   1 + cot²θ = cosec²θ',
    variables: 'sin(90° - θ) = cosθ  |  cos(90° - θ) = sinθ  |  tan(90° - θ) = cotθ  |  sec²θ - tan²θ = 1',
    exampleOrApplication: 'sin 30° = 1/2, cos 30° = √3/2, tan 45° = 1, sin 60° = √3/2, cos 60° = 1/2, tan 60° = √3',
    examTip: 'सिद्ध करने वाले प्रश्नों में यदि कुछ समझ न आए तो सभी अनुपातों (tan, cot, sec, cosec) को sin और cos में तोड़ लें।'
  },
  {
    id: 'mat_4',
    subject: 'math',
    subjectLabel: 'गणित (Mathematics)',
    topicCategory: 'ज्यामिति व क्षेत्रमिति (Mensuration & Circles)',
    title: 'ठोस आकृतियों के आयतन व वक्रपृष्ठ (Mensuration 3D Formulas)',
    formulaOrRule: 'बेलन आयतन = πr²h  |  शंकु आयतन = ⅓πr²h  |  गोला आयतन = ⁴⁄₃πr³  |  गोला पृष्ठीय = 4πr²',
    variables: 'r = त्रिज्या, h = ऊंचाई, l = शंकु की तिर्यक ऊंचाई = √(r² + h²), अर्धगोले का कुल पृष्ठ = 3πr²',
    exampleOrApplication: 'यदि एक ठोस गोले को पिघलाकर तार या छोटे शंकु बनाए जाएं, तो दोनों का कुल आयतन सदैव बराबर (Volume Conservation) रहेगा।',
    examTip: 'वृत्त का क्षेत्रफल = πr², परिधि = 2πr। त्रिज्याखंड (Sector) का क्षेत्रफल = (θ/360°) × πr²।'
  },
  {
    id: 'mat_5',
    subject: 'math',
    subjectLabel: 'गणित (Mathematics)',
    topicCategory: 'अंकगणित व प्रतिशत (Arithmetic & Commercial Math)',
    title: 'प्रतिशत, लाभ-हानि व साधारण/चक्रवृद्धि ब्याज (Percentage & CI/SI)',
    formulaOrRule: 'SI = (P × R × T) / 100   |   A = P(1 + R/100)ⁿ   |   2 वर्ष का CI - SI = P(R/100)²',
    variables: 'P = मूलधन, R = वार्षिक ब्याज दर %, T/n = समय वर्ष, A = मिश्रधन',
    exampleOrApplication: 'यदि कोई धन 5 वर्ष में दोगुना हो जाता है, तो SI की दर R = (2-1)×100 / 5 = 20% वार्षिक होगी।',
    examTip: '2 वर्ष के लिए CI और SI के अंतर का सीधा सूत्र d = P(R/100)² हर SSC और रेलवे परीक्षा में आता है।'
  },

  // ==================== 4. BIOLOGY (जीव विज्ञान) ====================
  {
    id: 'bio_1',
    subject: 'biology',
    subjectLabel: 'जीव विज्ञान (Biology)',
    topicCategory: 'कोशिका व आनुवंशिकी (Cell & Genetics)',
    title: 'कोशिकांग एवं उनके उपनाम (Cell Organelles & Powerhouses)',
    formulaOrRule: 'माइटोकॉन्ड्रिया = कोशिका का पावरहाउस (ATP निर्माण)  |  राइबोसोम = प्रोटीन फैक्ट्री  |  लाइसोसोम = आत्मघाती थैली (Suicide Bag)',
    variables: 'ATP = एडेनोसिन ट्राइफॉस्फेट (ऊर्जा मुद्रा), DNA = डीऑक्सीराइबोन्यूक्लिक एसिड (आनुवंशिक पदार्थ)',
    exampleOrApplication: 'श्वसन क्रिया में 1 ग्लूकोज अणु के पूर्ण ऑक्सीकरण से 38 ATP अणु ऊर्जा (क्रेब्स चक्र माइटोकॉन्ड्रिया में) बनती है।',
    examTip: 'पादप कोशिका में कोशिका भित्ति (सेलुलोज) व लवक (क्लोरोप्लास्ट) पाए जाते हैं, जो जंतु कोशिका में अनुपस्थित होते हैं।'
  },
  {
    id: 'bio_2',
    subject: 'biology',
    subjectLabel: 'जीव विज्ञान (Biology)',
    topicCategory: 'मानव शरीर तंत्र (Human Physiology)',
    title: 'रक्त समूह, परिसंचरण व हृदय धड़कन (Blood Groups & Circulation)',
    formulaOrRule: 'सर्वदाता (Universal Donor) = O-negative  |  सर्वग्राही (Universal Acceptor) = AB-positive  |  रक्तचाप = 120/80 mmHg',
    variables: 'RBC जीवनकाल = 120 दिन, WBC = 2-4 दिन। रक्त का थक्का बनाने वाली कोशिका = प्लेटलेट्स (थ्रॉम्बोसाइट्स)',
    exampleOrApplication: 'हृदय में 4 कोष्ठक होते हैं (2 अलिंद, 2 निलय)। दायां भाग अशुद्ध रक्त (CO₂) और बायां भाग शुद्ध रक्त (O₂) पंप करता है।',
    examTip: 'पल्मोनरी धमनी (फुफ्फुस धमनी) एकमात्र ऐसी धमनी है जिसमें अशुद्ध रक्त बहता है, और पल्मोनरी शिरा में शुद्ध रक्त बहता है।'
  },

  // ==================== 5. STENOGRAPHY (आशुलिपि) ====================
  {
    id: 'stn_1',
    subject: 'steno',
    subjectLabel: 'आशुलिपि (Stenography)',
    topicCategory: 'वर्णमाला व दिशा नियम (Consonants & Rules)',
    title: 'ऋषि प्रणाली रेखाक्षरों की दिशा व हल्के/गहरे का नियम',
    formulaOrRule: 'क-वर्ग (क,ख,ग,घ) = क्षैतिज बाएं से दाएं  |  च-वर्ग = 60° अधोमुखी  |  ट-वर्ग = 90° लंबवत अधोमुखी  |  प-वर्ग = 120° अधोमुखी',
    variables: 'अघोष (क, च, ट, त, प) = हल्की रेखा | सघोष (ग, ज, ड, द, ब) = गहरी रेखा | ख, घ, छ, झ, ठ, ढ, थ, ध, फ, भ = कटे हुए रेखाक्षर',
    exampleOrApplication: 'रेखाक्षर की मानक लंबाई 0.75 सेमी (3/4 इंच) रखी जाती है ताकि अनुपातिक संतुलन बना रहे।',
    examTip: 'लिखते समय पेंसिल का कोण 45° रखें और पेंसिल को कॉपी पर घसीटने के बजाय एक हल्के प्रवाह में चलाएं।'
  },
  {
    id: 'stn_2',
    subject: 'steno',
    subjectLabel: 'आशुलिपि (Stenography)',
    topicCategory: 'स्वर व मात्राएं (Vowels & Places)',
    title: 'स्वरों के तीन स्थान एवं लाइन नियम (Vowel Places & Line Rule)',
    formulaOrRule: '1st स्थान (आ, ऐ, ऑ) = लाइन के ऊपर (Above the Line)  |  2nd स्थान (ए, ओ) = लाइन पर (On the Line)  |  3rd स्थान (ई, ऊ) = लाइन काटकर (Through the Line)',
    variables: 'गहरा बिंदु = आ (1st), ए (2nd), ई (3rd)  |  गहरा डैश = ऑ (1st), ओ (2nd), ऊ (3rd)',
    exampleOrApplication: '"काम" में 1st स्थान का स्वर (आ) है, अतः क रेखाक्षर लाइन से ऊपर लिखा जाएगा। "दिन" में 3rd स्थान का स्वर (ई) है, अतः द लाइन काटेगा।',
    examTip: 'अग्रगामी रेखाक्षर (क, म, न) लाइन नहीं काट सकते, अतः उनके लिए अगला अधोमुखी रेखाक्षर लाइन काटता है।'
  },
  {
    id: 'stn_3',
    subject: 'steno',
    subjectLabel: 'आशुलिपि (Stenography)',
    topicCategory: 'अर्द्धीकरण व द्विगुणन (Halving & Doubling)',
    title: 'अर्द्धीकरण व द्विगुणन सिद्धांत (Halving & Doubling Principles)',
    formulaOrRule: 'आधा रेखाक्षर (½ Length) = + त / ट / द   |   दोगुना रेखाक्षर (2x Length) = + तर / दर / टर / डर',
    variables: 'क को आधा = कत/कद | प को आधा = पत/पद | म को दोगुना = मातर/मदर | न को दोगुना = अंतर/अंदर',
    exampleOrApplication: 'कोर्ट रिपोर्टिंग व संसद डिबेट में "अध्यक्ष महोदय", "इस संबंध में" जैसे लंबे शब्दों में यह सिद्धांत 100+ WPM गति दिलाता है।',
    examTip: 'यदि शब्द के अंत में कोई तृतीय स्थान का स्वर आ रहा हो, तो अर्द्धीकरण न करके पूरा रेखाक्षर लिखें ताकि पढ़ने में भ्रम न हो।'
  },

  // ==================== 6. ENGLISH GRAMMAR (अंग्रेजी व्याकरण) ====================
  {
    id: 'eng_1',
    subject: 'english',
    subjectLabel: 'अंग्रेजी (English Grammar)',
    topicCategory: 'Active & Passive Voice',
    title: 'Active to Passive Voice Transformation Rules',
    formulaOrRule: 'Present Simple: is/am/are + V₃  |  Past Simple: was/were + V₃  |  Continuous: being + V₃  |  Perfect: been + V₃',
    variables: 'Active: Subject + Verb + Object  ⇒  Passive: Object + Helping Verb + V₃ + by + Subject',
    exampleOrApplication: 'Active: "She wrote a letter."  ⇒  Passive: "A letter was written by her." (Past Indefinite: was + written)',
    examTip: 'Passive voice में हमेशा मुख्य क्रिया की 3rd Form (Past Participle) ही आती है। Future Continuous का पैसिव नहीं बनता।'
  },
  {
    id: 'eng_2',
    subject: 'english',
    subjectLabel: 'अंग्रेजी (English Grammar)',
    topicCategory: 'Direct & Indirect Speech',
    title: 'Narration (Direct to Indirect Speech Rules)',
    formulaOrRule: 'Present Indefinite → Past Indefinite  |  Present Cont. → Past Cont.  |  Past Indefinite → Past Perfect (had + V₃)',
    variables: 'Said to → Told  |  Will → Would  |  Can → Could  |  May → Might  |  Today → That day  |  Yesterday → The previous day',
    exampleOrApplication: 'Direct: He said, "I have passed."  ⇒  Indirect: He said that he had passed.',
    examTip: 'यदि Reporting Verb Present या Future में हो (जैसे: He says), तो अंदर के Tense में कोई परिवर्तन नहीं होता।'
  },
  {
    id: 'eng_3',
    subject: 'english',
    subjectLabel: 'अंग्रेजी (English Grammar)',
    topicCategory: 'Subject-Verb Agreement',
    title: 'Subject-Verb Agreement Key Rules',
    formulaOrRule: 'Neither...nor / Either...or ⇒ Verb agrees with nearest subject | Each/Every/One of + Plural Noun + Singular Verb',
    variables: '"Along with", "As well as", "Together with" ⇒ Verb agrees with the FIRST subject',
    exampleOrApplication: '"One of the students IS absent." (Not "are")  |  "Neither the teacher nor the students WERE present."',
    examTip: '"One of the..." के बाद संज्ञा हमेशा Plural आती है, लेकिन क्रिया (Verb) हमेशा Singular आती है।'
  },

  // ==================== 7. POLITY & GK (संविधान व सामान्य ज्ञान) ====================
  {
    id: 'pol_1',
    subject: 'polity',
    subjectLabel: 'संविधान व राजव्यवस्था (Polity)',
    topicCategory: 'मौलिक अधिकार व अनुच्छेद (Articles 12-35)',
    title: 'संविधान के 6 मौलिक अधिकार एवं अनुच्छेद',
    formulaOrRule: 'समानता (14-18) | स्वतंत्रता (19-22) | शोषण विरुद्ध (23-24) | धार्मिक स्वतंत्रता (25-28) | संस्कृति-शिक्षा (29-30) | संवैधानिक उपचार (Art 32)',
    variables: 'अनुच्छेद 32 = डॉ. आंबेडकर द्वारा "संविधान का हृदय व आत्मा"। सर्वोच्च न्यायालय 5 रिटें जारी करता है।',
    exampleOrApplication: 'आपातकाल (Art 352) में भी अनुच्छेद 20 (दोषसिद्धि से संरक्षण) और अनुच्छेद 21 (प्राण व दैहिक स्वतंत्रता) निलंबित नहीं किए जा सकते।',
    examTip: 'अनुच्छेद 17 अस्पृश्यता का अंत करता है। अनुच्छेद 21-A (86वां संशोधन 2002) 6 से 14 वर्ष के बच्चों को निशुल्क शिक्षा का अधिकार देता है।'
  },
  {
    id: 'pol_2',
    subject: 'polity',
    subjectLabel: 'संविधान व राजव्यवस्था (Polity)',
    topicCategory: 'आपातकाल व राष्ट्रपति (President & Emergency)',
    title: 'तीनों आपातकालीन उपबंध एवं राष्ट्रपति शक्तियां',
    formulaOrRule: 'राष्ट्रीय आपातकाल = Art 352 (युद्ध/सशस्त्र विद्रोह)  |  राष्ट्रपति शासन = Art 356 (संवैधानिक तंत्र विफलता)  |  वित्तीय आपातकाल = Art 360',
    variables: 'राष्ट्रपति पर महाभियोग = अनुच्छेद 61  |  राष्ट्रपति की क्षमादान शक्ति = अनुच्छेद 72  |  अध्यादेश जारी करने की शक्ति = अनुच्छेद 123',
    exampleOrApplication: 'भारत में अब तक वित्तीय आपातकाल (Art 360) एक बार भी लागू नहीं किया गया है।',
    examTip: 'राज्यपाल की क्षमादान शक्ति अनुच्छेद 161 और अध्यादेश शक्ति अनुच्छेद 213 में निहित है।'
  }
];

export const FormulaVaultView: React.FC<FormulaVaultViewProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'vault' | 'pomodoro'>('vault');
  const [selectedSubject, setSelectedSubject] = useState<SubjectKey>('all');
  const [selectedSubTopic, setSelectedSubTopic] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Pomodoro Timer State
  const [pomodoroMinutes, setPomodoroMinutes] = useState(25);
  const [pomodoroSeconds, setPomodoroSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState<'study' | 'break'>('study');
  const [completedSessions, setCompletedSessions] = useState(0);

  useEffect(() => {
    let timer: any = null;
    if (isTimerRunning) {
      timer = setInterval(() => {
        if (pomodoroSeconds > 0) {
          setPomodoroSeconds(prev => prev - 1);
        } else if (pomodoroMinutes > 0) {
          setPomodoroMinutes(prev => prev - 1);
          setPomodoroSeconds(59);
        } else {
          // Timer finished
          setIsTimerRunning(false);
          if (timerMode === 'study') {
            setCompletedSessions(prev => prev + 1);
            setTimerMode('break');
            setPomodoroMinutes(5);
            setPomodoroSeconds(0);
            playNaturalSpeech('शानदार पढ़ाई! 25 मिनट का फोकस सत्र पूरा हुआ। अब 5 मिनट का छोटा ब्रेक लें।');
          } else {
            setTimerMode('study');
            setPomodoroMinutes(25);
            setPomodoroSeconds(0);
            playNaturalSpeech('ब्रेक समाप्त! आइए फिर से अपनी परीक्षा की तैयारी शुरू करें।');
          }
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, pomodoroMinutes, pomodoroSeconds, timerMode]);

  if (!isOpen) return null;

  // Extract unique subtopics for the currently selected subject
  const availableSubTopics = Array.from(
    new Set(
      vaultFormulasDatabase
        .filter(item => selectedSubject === 'all' || item.subject === selectedSubject)
        .map(item => item.topicCategory)
    )
  );

  const filteredVault = vaultFormulasDatabase.filter(item => {
    const matchesSubject = selectedSubject === 'all' || item.subject === selectedSubject;
    const matchesSubTopic = selectedSubTopic === 'all' || item.topicCategory === selectedSubTopic;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.formulaOrRule.toLowerCase().includes(q) ||
      item.topicCategory.toLowerCase().includes(q) ||
      item.variables.toLowerCase().includes(q) ||
      item.examTip.toLowerCase().includes(q);
    return matchesSubject && matchesSubTopic && matchesQuery;
  });

  const handleCopy = (item: VaultFormula) => {
    const text = `${item.title} [${item.subjectLabel} • ${item.topicCategory}]\nसूत्र / नियम: ${item.formulaOrRule}\nघटक / संकेत: ${item.variables}\nउदाहरण / अनुप्रयोग: ${item.exampleOrApplication}\nपरीक्षा टिप: ${item.examTip}`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-4 animate-fade-in">
      <div className="bg-[#091122] border-2 border-cyan-500/40 rounded-3xl p-4 sm:p-6 max-w-4xl w-full space-y-4 shadow-2xl relative max-h-[92vh] flex flex-col text-white overflow-hidden">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 text-xl sm:text-2xl shrink-0 shadow-md">
              ⚡
            </div>
            <div>
              <h3 className="text-sm sm:text-base md:text-lg font-black text-white flex items-center gap-2">
                <span>पॉकेट फॉर्मूला डायरी व फोकस टाइमर</span>
                <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-mono uppercase">
                  SUBJECT &amp; TOPIC WISE
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                भौतिकी, रसायन, गणित, जीव विज्ञान, आशुलिपि, अंग्रेजी व संविधान के प्रामाणिक सूत्र एवं 25-मिनट पोमोडोरो।
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-950 border border-slate-800 cursor-pointer transition-colors"
            title="बंद करें"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher (Vault vs Pomodoro) */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-850 shrink-0">
          <button
            onClick={() => setActiveTab('vault')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'vault' ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 font-black shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>📚</span>
            <span>सब्जेक्ट व टॉपिक-वार फॉर्मूला डायरी ({filteredVault.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('pomodoro')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'pomodoro' ? 'bg-emerald-600 text-white font-black shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>⏱️</span>
            <span>25-मिनट पोमोडोरो फोकस टाइमर</span>
          </button>
        </div>

        {activeTab === 'vault' ? (
          <div className="space-y-3.5 flex-1 overflow-hidden flex flex-col min-h-0">
            {/* Search Bar */}
            <div className="relative shrink-0">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="फॉर्मूला, नियम, संकेत या टॉपिक खोजें (उदा. Mirror, Ohm, Quadratic, AP, Active Voice, pH, POP)..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs sm:text-sm text-white outline-none focus:border-amber-400 placeholder:text-slate-500"
              />
            </div>

            {/* Level 1: Subject Category Switcher */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 shrink-0 custom-scrollbar">
              {[
                { id: 'all' as const, label: '🌐 सभी विषय' },
                { id: 'physics' as const, label: '⚡ भौतिकी (Physics)' },
                { id: 'chemistry' as const, label: '🧪 रसायन (Chemistry)' },
                { id: 'math' as const, label: '📐 गणित (Math)' },
                { id: 'biology' as const, label: '🧬 जीव विज्ञान (Biology)' },
                { id: 'steno' as const, label: '✍️ आशुलिपि (Stenography)' },
                { id: 'english' as const, label: '📝 अंग्रेजी (Grammar)' },
                { id: 'polity' as const, label: '🏛️ संविधान (Polity)' }
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => {
                    setSelectedSubject(sub.id);
                    setSelectedSubTopic('all'); // Reset subtopic when subject changes
                  }}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer whitespace-nowrap transition-all shrink-0 ${
                    selectedSubject === sub.id
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-md'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* Level 2: Sub-Topic Category Chips */}
            {availableSubTopics.length > 0 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 shrink-0 text-[11px] custom-scrollbar">
                <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0 flex items-center gap-1 px-1">
                  <Filter className="w-3 h-3 text-cyan-400" />
                  <span>टॉपिक:</span>
                </span>
                <button
                  onClick={() => setSelectedSubTopic('all')}
                  className={`px-2.5 py-1 rounded-lg border cursor-pointer whitespace-nowrap transition-all font-semibold ${
                    selectedSubTopic === 'all'
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  सभी टॉपिक्स
                </button>
                {availableSubTopics.map(topic => (
                  <button
                    key={topic}
                    onClick={() => setSelectedSubTopic(topic)}
                    className={`px-2.5 py-1 rounded-lg border cursor-pointer whitespace-nowrap transition-all font-semibold ${
                      selectedSubTopic === topic
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            )}

            {/* Vault Formula Cards (Scrollable) */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
              {filteredVault.map(item => (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 rounded-2xl bg-[#080E1E] border border-slate-800 hover:border-amber-500/40 transition-all space-y-3 group shadow-md"
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-850 pb-2.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        {item.subjectLabel}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                        📁 {item.topicCategory}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      <button
                        onClick={() =>
                          playNaturalSpeech(
                            `${item.title}. सूत्र या नियम है: ${item.formulaOrRule}. विवरण: ${item.variables}. परीक्षा टिप: ${item.examTip}`
                          )
                        }
                        className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-400 text-cyan-300 hover:text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                        title="भारी आवाज में सुनें"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                        <span>सुनें</span>
                      </button>
                      <button
                        onClick={() => handleCopy(item)}
                        className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-400 text-slate-300 hover:text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                        title="फॉर्मूला कॉपी करें"
                      >
                        {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                        <span>{copiedId === item.id ? 'कॉपी हो गया' : 'कॉपी'}</span>
                      </button>
                    </div>
                  </div>

                  <h4 className="text-sm sm:text-base font-black text-white group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </h4>

                  {/* Highlighted Formula / Rule Box */}
                  <div className="p-3 sm:p-3.5 rounded-xl bg-slate-950 border-l-4 border-amber-400 font-mono text-xs sm:text-sm text-amber-300 font-bold overflow-x-auto shadow-inner leading-relaxed">
                    {item.formulaOrRule}
                  </div>

                  {/* Variables & Components Explained */}
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-850 text-xs text-slate-300 space-y-1">
                    <span className="text-[10px] font-black uppercase text-cyan-400 block tracking-wider">
                      🔍 घटक व संकेत (Variables &amp; Symbols):
                    </span>
                    <p className="leading-relaxed text-[11px] sm:text-xs text-slate-300">{item.variables}</p>
                  </div>

                  {/* Application / Example & Exam Tip */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-850 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 block">📊 प्रायोगिक अनुप्रयोग / उदाहरण:</span>
                      <p className="text-[11px] text-slate-300 leading-relaxed">{item.exampleOrApplication}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                      <span className="text-[10px] font-bold text-emerald-400 block flex items-center gap-1">
                        <span>💡</span>
                        <span>परीक्षा रणनीति व शॉर्ट टिप:</span>
                      </span>
                      <p className="text-[11px] text-emerald-300 leading-relaxed">{item.examTip}</p>
                    </div>
                  </div>
                </div>
              ))}

              {filteredVault.length === 0 && (
                <div className="py-12 text-center text-slate-400 text-xs sm:text-sm bg-slate-950/60 rounded-2xl border border-slate-850 space-y-2">
                  <div className="text-2xl">🔍</div>
                  <div className="font-bold text-white">कोई फॉर्मूला नहीं मिला</div>
                  <p className="text-slate-500 text-xs">कृपया दूसरा कीवर्ड सर्च करें या विषय बदलकर देखें।</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Pomodoro Timer View */
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 text-center space-y-6 flex-1 flex flex-col justify-center items-center">
            <div className="space-y-1.5">
              <span className={`inline-block text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                timerMode === 'study' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}>
                {timerMode === 'study' ? '🎯 25-मिनट गहन अध्ययन सत्र (Deep Study)' : '☕ 5-मिनट रीफ्रेश ब्रेक (Short Break)'}
              </span>
              <h4 className="text-base font-black text-white">पोमोडोरो अध्ययन तकनीक (Pomodoro Technique)</h4>
            </div>

            {/* Giant Timer Display */}
            <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full border-4 border-amber-400/40 bg-gradient-to-b from-amber-500/10 to-transparent flex flex-col items-center justify-center shadow-2xl space-y-1">
              <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white">
                {String(pomodoroMinutes).padStart(2, '0')}:{String(pomodoroSeconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">
                {isTimerRunning ? 'टाइमर चल रहा है' : 'रोक दिया गया है'}
              </span>
            </div>

            {/* Timer Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsTimerRunning(prev => !prev)}
                className={`px-6 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl cursor-pointer transition-all ${
                  isTimerRunning ? 'bg-rose-600 hover:bg-rose-500 text-white' : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                }`}
              >
                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isTimerRunning ? 'पॉज करें (Pause)' : 'सत्र शुरू करें (Start)'}</span>
              </button>

              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerMode('study');
                  setPomodoroMinutes(25);
                  setPomodoroSeconds(0);
                }}
                className="px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                title="रीसेट करें"
              >
                <RotateCcw className="w-4 h-4" />
                <span>रीसेट</span>
              </button>
            </div>

            <div className="text-xs text-slate-400">
              पूर्ण किए गए अध्ययन चक्र: <strong className="text-amber-400 font-black">{completedSessions}</strong> सत्र
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
