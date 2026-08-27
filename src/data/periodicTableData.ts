export interface ElementData {
  number: number;
  symbol: string;
  name: string;
  hindiName: string;
  mass: number | string;
  category: 
    | 'alkali-metal' 
    | 'alkaline-earth' 
    | 'transition-metal' 
    | 'post-transition' 
    | 'metalloid' 
    | 'reactive-nonmetal' 
    | 'noble-gas' 
    | 'halogen'
    | 'lanthanide' 
    | 'actinide'
    | 'unknown';
  period: number;
  group: number; // 1 to 18 (for lanthanides/actinides, group is 3 or special)
  block: 's' | 'p' | 'd' | 'f';
  state: 'solid' | 'liquid' | 'gas' | 'synthetic';
  electronConfig: string;
  shells: number[]; // e.g. [2, 8, 18, 32...]
  electronegativity?: number; // Pauling scale
  valency?: string;
  oxidationStates?: string;
  meltingPointK?: number;
  boilingPointK?: number;
  densityGPerCm3?: number;
  discoveredBy?: string;
  year?: string | number;
  usesHindi: string;
  usesEnglish: string;
  examHighlightHindi?: string;
  mnemonicHindi?: string;
}

export const CATEGORY_COLORS: Record<ElementData['category'], {
  bg: string;
  border: string;
  text: string;
  badge: string;
  hindiLabel: string;
  enLabel: string;
}> = {
  'alkali-metal': {
    bg: 'bg-rose-950/60 hover:bg-rose-900/80',
    border: 'border-rose-500/60',
    text: 'text-rose-300',
    badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    hindiLabel: 'क्षार धातु (Alkali Metals)',
    enLabel: 'Alkali Metals'
  },
  'alkaline-earth': {
    bg: 'bg-amber-950/60 hover:bg-amber-900/80',
    border: 'border-amber-500/60',
    text: 'text-amber-300',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    hindiLabel: 'क्षारीय मृदा धातु (Alkaline Earth)',
    enLabel: 'Alkaline Earth Metals'
  },
  'transition-metal': {
    bg: 'bg-blue-950/60 hover:bg-blue-900/80',
    border: 'border-blue-500/60',
    text: 'text-blue-300',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    hindiLabel: 'संक्रमण धातु (Transition Metals)',
    enLabel: 'Transition Metals'
  },
  'post-transition': {
    bg: 'bg-teal-950/60 hover:bg-teal-900/80',
    border: 'border-teal-500/60',
    text: 'text-teal-300',
    badge: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
    hindiLabel: 'उत्तर-संक्रमण धातु (Post-Transition)',
    enLabel: 'Post-Transition Metals'
  },
  'metalloid': {
    bg: 'bg-emerald-950/60 hover:bg-emerald-900/80',
    border: 'border-emerald-500/60',
    text: 'text-emerald-300',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    hindiLabel: 'उपधातु (Metalloids)',
    enLabel: 'Metalloids'
  },
  'reactive-nonmetal': {
    bg: 'bg-cyan-950/60 hover:bg-cyan-900/80',
    border: 'border-cyan-500/60',
    text: 'text-cyan-300',
    badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    hindiLabel: 'क्रियाशील अधातु (Reactive Nonmetals)',
    enLabel: 'Reactive Nonmetals'
  },
  'halogen': {
    bg: 'bg-yellow-950/60 hover:bg-yellow-900/80',
    border: 'border-yellow-500/60',
    text: 'text-yellow-300',
    badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
    hindiLabel: 'हैलोजन (Halogens - Group 17)',
    enLabel: 'Halogens'
  },
  'noble-gas': {
    bg: 'bg-purple-950/60 hover:bg-purple-900/80',
    border: 'border-purple-500/60',
    text: 'text-purple-300',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    hindiLabel: 'अक्रिय गैसें (Noble Gases - Group 18)',
    enLabel: 'Noble Gases'
  },
  'lanthanide': {
    bg: 'bg-pink-950/60 hover:bg-pink-900/80',
    border: 'border-pink-500/60',
    text: 'text-pink-300',
    badge: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
    hindiLabel: 'लैन्थेनाइड (Lanthanides 4f)',
    enLabel: 'Lanthanides'
  },
  'actinide': {
    bg: 'bg-orange-950/60 hover:bg-orange-900/80',
    border: 'border-orange-500/60',
    text: 'text-orange-300',
    badge: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    hindiLabel: 'एक्टिनाइड (Actinides 5f - रेडियोधर्मी)',
    enLabel: 'Actinides'
  },
  'unknown': {
    bg: 'bg-slate-900 hover:bg-slate-850',
    border: 'border-slate-700',
    text: 'text-slate-400',
    badge: 'bg-slate-800 text-slate-400 border-slate-700',
    hindiLabel: 'अज्ञात गुणधर्म (Synthetic Superheavy)',
    enLabel: 'Unknown / Superheavy'
  }
};

export const PERIODIC_MNEMONICS = [
  {
    titleHindi: 'Group 1 (क्षार धातु): H, Li, Na, K, Rb, Cs, Fr',
    mnemonic: 'हे ली ना की रब से फरियाद (H, Li, Na, K, Rb, Cs, Fr)',
    importance: 'प्रथम वर्ग की धातुएं बहुत मुलायम होती हैं और इन्हें चाकू से काटा जा सकता है (Na, K)।'
  },
  {
    titleHindi: 'Group 2 (क्षारीय मृदा धातु): Be, Mg, Ca, Sr, Ba, Ra',
    mnemonic: 'बेटा मांगे कार स्कूटर बाप राजी (Be, Mg, Ca, Sr, Ba, Ra)',
    importance: 'मैग्नीशियम क्लोरोफिल में केंद्रक धातु है, कैल्शियम हड्डियों और दांतों का मुख्य घटक है।'
  },
  {
    titleHindi: 'Group 13 (बोरॉन परिवार): B, Al, Ga, In, Tl',
    mnemonic: 'बैंगन आलू गाजर इन थैला (B, Al, Ga, In, Tl)',
    importance: 'गैलियम (Ga) कमरे के तापमान से जरा ऊपर हथेली पर रखते ही पिघल जाता है (गलनांक 29.8°C)।'
  },
  {
    titleHindi: 'Group 14 (कार्बन परिवार): C, Si, Ge, Sn, Pb',
    mnemonic: 'कहे सीता जी सुनो प्रभु (C, Si, Ge, Sn, Pb)',
    importance: 'सिलिकॉन (Si) और जर्मेनियम (Ge) आधुनिक सेमीकंडक्टर और माइक्रोचिप्स की रीढ़ हैं।'
  },
  {
    titleHindi: 'Group 15 (नाइट्रोजन परिवार / Pnictogens): N, P, As, Sb, Bi',
    mnemonic: 'नाना पाटेकर ऐश्वर्या सब बिंदास (N, P, As, Sb, Bi)',
    importance: 'नाइट्रोजन वायुमंडल में 78% है, फॉस्फोरस DNA/RNA और ATP ऊर्जा अणुओं का मुख्य घटक है।'
  },
  {
    titleHindi: 'Group 16 (ऑक्सीजन परिवार / Chalcogens): O, S, Se, Te, Po',
    mnemonic: 'ओल्ड स्टाइल से टी पो (O, S, Se, Te, Po)',
    importance: 'पोलोनियम (Po) के सर्वाधिक समस्थानिक (Isotopes) होते हैं और यह तीव्र रेडियोएक्टिव है।'
  },
  {
    titleHindi: 'Group 17 (हैलोजन लवण उत्पादक): F, Cl, Br, I, At',
    mnemonic: 'फिर कल बाहर आई आंटी (F, Cl, Br, I, At)',
    importance: 'फ्लोरीन (F) पूरे आवर्त सारणी में सर्वाधिक विद्युत-ऋणात्मक तत्व (3.98) है; ब्रोमीन (Br) एकमात्र द्रव अधातु है।'
  },
  {
    titleHindi: 'Group 18 (अक्रिय/उत्कृष्ट गैसें): He, Ne, Ar, Kr, Xe, Rn',
    mnemonic: 'हे नेहा और करीना की ज़ेरॉक्स रंगीन (He, Ne, Ar, Kr, Xe, Rn)',
    importance: 'हीलियम ब्रह्मांड में दूसरा सर्वाधिक पाया जाने वाला तत्व है, आर्गन बल्बों में भरी जाती है, रेडॉन कैंसर रेडियोथेरेपी में प्रयुक्त होती है।'
  },
  {
    titleHindi: '3d Transition Series (Sc to Zn):',
    mnemonic: 'सुनो तुम विवाह कर लो मुझसे, फिर कोई नहीं कहेगा जानू (Sc, Ti, V, Cr, Mn, Fe, Co, Ni, Cu, Zn)',
    importance: 'लोहा (Fe) हीमोग्लोबिन में, कोबाल्ट (Co) विटामिन B12 में, और तांबा (Cu) विद्युत तारों में प्रयुक्त होता है।'
  }
];

export const PERIODIC_TABLE_ELEMENTS: ElementData[] = [
  // Period 1
  {
    number: 1, symbol: 'H', name: 'Hydrogen', hindiName: 'हाइड्रोजन', mass: 1.008,
    category: 'reactive-nonmetal', period: 1, group: 1, block: 's', state: 'gas',
    electronConfig: '1s¹', shells: [1], electronegativity: 2.20, valency: '1', oxidationStates: '+1, -1',
    meltingPointK: 14.01, boilingPointK: 20.28, densityGPerCm3: 0.00008988,
    discoveredBy: 'Henry Cavendish', year: 1766,
    usesHindi: 'रॉकेट ईंधन, अमोनिया उर्वरक निर्माण (Haber Process), भविष्य का हरित ऊर्जा वाहक।',
    usesEnglish: 'Rocket fuel, Haber process for ammonia, clean hydrogen fuel cells.',
    examHighlightHindi: 'ब्रह्मांड में सर्वाधिक मात्रा में पाया जाने वाला तत्व (~75% द्रव्यमान)। कोई न्यूट्रॉन नहीं (¹H प्रोटियम)।',
    mnemonicHindi: 'आवर्त सारणी का पहला तत्व, आवारा तत्व भी कहलाता है।'
  },
  {
    number: 2, symbol: 'He', name: 'Helium', hindiName: 'हीलियम', mass: 4.0026,
    category: 'noble-gas', period: 1, group: 18, block: 's', state: 'gas',
    electronConfig: '1s²', shells: [2], electronegativity: undefined, valency: '0', oxidationStates: '0',
    meltingPointK: 0.95, boilingPointK: 4.22, densityGPerCm3: 0.0001785,
    discoveredBy: 'Pierre Janssen, Norman Lockyer', year: 1868,
    usesHindi: 'मौसम गुब्बारे, MRI सुपरकंडक्टिंग मैग्नेट कूलिंग, गहरे समुद्र में गोताखोरी सांस मिश्रण।',
    usesEnglish: 'Weather balloons, cryogenics for MRI machines, deep-sea diving gas.',
    examHighlightHindi: 'सूर्य में नाभिकीय संलयन (Nuclear Fusion) का मुख्य उत्पाद। सबसे कम क्वथनांक (4.22 K)।'
  },

  // Period 2
  {
    number: 3, symbol: 'Li', name: 'Lithium', hindiName: 'लिथियम', mass: 6.94,
    category: 'alkali-metal', period: 2, group: 1, block: 's', state: 'solid',
    electronConfig: '[He] 2s¹', shells: [2, 1], electronegativity: 0.98, valency: '1', oxidationStates: '+1',
    meltingPointK: 453.69, boilingPointK: 1603, densityGPerCm3: 0.534,
    discoveredBy: 'Johan August Arfwedson', year: 1817,
    usesHindi: 'इलेक्ट्रिक वाहन (EV) व स्मार्टफोन ली-आयन बैटरी, बाइपोलर डिसऑर्डर मनोरोग दवाएं।',
    usesEnglish: 'Lithium-ion batteries for EVs & smartphones, psychiatric medicine.',
    examHighlightHindi: 'सबसे हल्की धातु एवं सबसे प्रबल अपचायक (Strongest Reducing Agent in water)।'
  },
  {
    number: 4, symbol: 'Be', name: 'Beryllium', hindiName: 'बेरिलियम', mass: 9.0122,
    category: 'alkaline-earth', period: 2, group: 2, block: 's', state: 'solid',
    electronConfig: '[He] 2s²', shells: [2, 2], electronegativity: 1.57, valency: '2', oxidationStates: '+2',
    meltingPointK: 1560, boilingPointK: 2742, densityGPerCm3: 1.85,
    discoveredBy: 'Louis-Nicolas Vauquelin', year: 1798,
    usesHindi: 'जेम्स वेब स्पेस टेलीस्कोप (JWST) के सोने की परत चढ़े दर्पण, एयरोस्पेस मिश्र धातु।',
    usesEnglish: 'James Webb Space Telescope mirrors, aerospace X-ray windows.',
    examHighlightHindi: 'एल्युमिनियम (Al) के साथ विकर्ण संबंध (Diagonal Relationship) दर्शाता है।'
  },
  {
    number: 5, symbol: 'B', name: 'Boron', hindiName: 'बोरॉन', mass: 10.81,
    category: 'metalloid', period: 2, group: 13, block: 'p', state: 'solid',
    electronConfig: '[He] 2s² 2p¹', shells: [2, 3], electronegativity: 2.04, valency: '3', oxidationStates: '+3',
    meltingPointK: 2349, boilingPointK: 4200, densityGPerCm3: 2.34,
    discoveredBy: 'Joseph Louis Gay-Lussac, Louis Jacques Thénard', year: 1808,
    usesHindi: 'बोरोसिलिकेट तापरोधी कांच (Pyrex), परमाणु रिएक्टर में न्यूट्रॉन अवशोषक छड़ें।',
    usesEnglish: 'Borosilicate glassware, control rods in nuclear reactors, semiconductors.',
    examHighlightHindi: 'बोरॉन के यौगिक (जैसे B₂H₆ डाइबोरेन) में केले के आकार का 3-center-2-electron बंध पाया जाता है।'
  },
  {
    number: 6, symbol: 'C', name: 'Carbon', hindiName: 'कार्बन', mass: 12.011,
    category: 'reactive-nonmetal', period: 2, group: 14, block: 'p', state: 'solid',
    electronConfig: '[He] 2s² 2p²', shells: [2, 4], electronegativity: 2.55, valency: '4', oxidationStates: '+4, +2, -4',
    meltingPointK: 3823, boilingPointK: 4300, densityGPerCm3: 2.267,
    discoveredBy: 'Ancient civilizations', year: 'Ancient',
    usesHindi: 'समस्त जैविक जीवन का आधार (Organic Chemistry), हीरा (आभूषण/कटर), ग्रेफाइट (पेंसिल/इलेक्ट्रोड), कार्बन नैनोट्यूब।',
    usesEnglish: 'Basis of all organic life, diamond, graphite electrodes, graphene.',
    examHighlightHindi: 'श्रृंखलन गुण (Catenation) और चतुःसंयोजकता (Tetravalency) के कारण लाखों यौगिक बनाता है। C-14 कार्बन डेटिंग में प्रयुक्त।'
  },
  {
    number: 7, symbol: 'N', name: 'Nitrogen', hindiName: 'नाइट्रोजन', mass: 14.007,
    category: 'reactive-nonmetal', period: 2, group: 15, block: 'p', state: 'gas',
    electronConfig: '[He] 2s² 2p³', shells: [2, 5], electronegativity: 3.04, valency: '3', oxidationStates: '-3, +3, +5',
    meltingPointK: 63.15, boilingPointK: 77.36, densityGPerCm3: 0.0012506,
    discoveredBy: 'Daniel Rutherford', year: 1772,
    usesHindi: 'यूरिया उर्वरक, चिप्स के पैकेट में अक्रिय गैस, क्रायोजेनिक प्रशीतक (Liquid Nitrogen)।',
    usesEnglish: 'Fertilizers (Urea), food packaging inert flush, liquid nitrogen cryogenics.',
    examHighlightHindi: 'N≡N त्रिबंध (Triple Bond) की उच्च वियोजन ऊर्जा (945 kJ/mol) के कारण कमरे के ताप पर अत्यधिक अक्रिय है।'
  },
  {
    number: 8, symbol: 'O', name: 'Oxygen', hindiName: 'ऑक्सीजन', mass: 15.999,
    category: 'reactive-nonmetal', period: 2, group: 16, block: 'p', state: 'gas',
    electronConfig: '[He] 2s² 2p⁴', shells: [2, 6], electronegativity: 3.44, valency: '2', oxidationStates: '-2, -1, +2',
    meltingPointK: 54.36, boilingPointK: 90.20, densityGPerCm3: 0.001429,
    discoveredBy: 'Carl Wilhelm Scheele, Joseph Priestley', year: 1774,
    usesHindi: 'श्वसन (Respiration), दहन (Combustion), स्टील निर्माण में ब्लास्ट फर्नेस, रॉकेट प्रणोदक।',
    usesEnglish: 'Cellular respiration, steelmaking, medical oxygen, rocket oxidizer.',
    examHighlightHindi: 'पृथ्वी की भूपर्पटी (Crust) में सर्वाधिक मात्रा में पाया जाने वाला तत्व (~46.6%)। O₃ ओजोन पराबैंगनी किरणों को रोकती है।'
  },
  {
    number: 9, symbol: 'F', name: 'Fluorine', hindiName: 'फ्लोरीन', mass: 18.998,
    category: 'halogen', period: 2, group: 17, block: 'p', state: 'gas',
    electronConfig: '[He] 2s² 2p⁵', shells: [2, 7], electronegativity: 3.98, valency: '1', oxidationStates: '-1',
    meltingPointK: 53.53, boilingPointK: 85.03, densityGPerCm3: 0.001696,
    discoveredBy: 'Henri Moissan', year: 1886,
    usesHindi: 'टूथपेस्ट (दांतों में कैविटी रोकथाम), नॉन-स्टिक कुकवेयर (Teflon PTFE), यूरेनियम संवर्धन (UF₆)।',
    usesEnglish: 'Toothpaste cavity prevention, Teflon non-stick coating, uranium enrichment.',
    examHighlightHindi: 'आवर्त सारणी का सर्वाधिक विद्युत-ऋणात्मक (Most Electronegative) तत्व (3.98)। सबसे प्रबल ऑक्सीकारक।'
  },
  {
    number: 10, symbol: 'Ne', name: 'Neon', hindiName: 'नियॉन', mass: 20.180,
    category: 'noble-gas', period: 2, group: 18, block: 'p', state: 'gas',
    electronConfig: '[He] 2s² 2p⁶', shells: [2, 8], electronegativity: undefined, valency: '0', oxidationStates: '0',
    meltingPointK: 24.56, boilingPointK: 27.07, densityGPerCm3: 0.0008999,
    discoveredBy: 'William Ramsay, Morris Travers', year: 1898,
    usesHindi: 'लाल-नारंगी चमक वाले नियॉन विज्ञापन साइनबोर्ड, हाई-वोल्टेज इंडिकेटर्स।',
    usesEnglish: 'Red-orange neon advertising signs, high-voltage test indicators.',
    examHighlightHindi: 'उत्कृष्ट अष्टक विन्यास (Stable Octet) के कारण कोई स्थायी रासायनिक यौगिक नहीं बनाता।'
  },

  // Period 3
  {
    number: 11, symbol: 'Na', name: 'Sodium', hindiName: 'सोडियम (Natrium)', mass: 22.990,
    category: 'alkali-metal', period: 3, group: 1, block: 's', state: 'solid',
    electronConfig: '[Ne] 3s¹', shells: [2, 8, 1], electronegativity: 0.93, valency: '1', oxidationStates: '+1',
    meltingPointK: 370.87, boilingPointK: 1156, densityGPerCm3: 0.968,
    discoveredBy: 'Humphry Davy', year: 1807,
    usesHindi: 'साधारण नमक (NaCl), बेकिंग सोडा (NaHCO₃), कास्टिक सोडा (NaOH), सोडियम वेपर लैंप।',
    usesEnglish: 'Table salt (NaCl), sodium vapor streetlights, chemical manufacturing.',
    examHighlightHindi: 'इतना मुलायम कि चाकू से काटा जा सकता है। हवा व पानी से तीव्र विस्फोट से बचाने हेतु मिट्टी के तेल (Kerosene) में रखते हैं।'
  },
  {
    number: 12, symbol: 'Mg', name: 'Magnesium', hindiName: 'मैग्नीशियम', mass: 24.305,
    category: 'alkaline-earth', period: 3, group: 2, block: 's', state: 'solid',
    electronConfig: '[Ne] 3s²', shells: [2, 8, 2], electronegativity: 1.31, valency: '2', oxidationStates: '+2',
    meltingPointK: 923, boilingPointK: 1363, densityGPerCm3: 1.738,
    discoveredBy: 'Joseph Black', year: 1755,
    usesHindi: 'क्लोरोफिल वर्णक, आतिशबाजी में सफेद रोशनी, मिल्क ऑफ मैग्नेशिया (Mg(OH)₂ एंटासिड)।',
    usesEnglish: 'Central atom in chlorophyll, fireworks white flash, Milk of Magnesia antacid.',
    examHighlightHindi: 'पौधों के क्लोरोफिल में केंद्रीय धातु परमाणु Mg²⁺ होता है जो प्रकाश संश्लेषण में प्रकाश अवशोषित करता है।'
  },
  {
    number: 13, symbol: 'Al', name: 'Aluminium', hindiName: 'एल्युमिनियम', mass: 26.982,
    category: 'post-transition', period: 3, group: 13, block: 'p', state: 'solid',
    electronConfig: '[Ne] 3s² 3p¹', shells: [2, 8, 3], electronegativity: 1.61, valency: '3', oxidationStates: '+3',
    meltingPointK: 933.47, boilingPointK: 2792, densityGPerCm3: 2.70,
    discoveredBy: 'Hans Christian Ørsted', year: 1825,
    usesHindi: 'हवाई जहाज का ढांचा (Duralumin मिश्र धातु), बिजली के तार (ACSR), खाद्य पैकेजिंग फॉयल।',
    usesEnglish: 'Aircraft bodies, high-voltage power transmission cables, beverage cans.',
    examHighlightHindi: 'पृथ्वी की भूपर्पटी में सर्वाधिक मात्रा में पाई जाने वाली धातु (~8.1%)। इसका मुख्य अयस्क बॉक्साइट (Al₂O₃·2H₂O) है।'
  },
  {
    number: 14, symbol: 'Si', name: 'Silicon', hindiName: 'सिलिकॉन', mass: 28.085,
    category: 'metalloid', period: 3, group: 14, block: 'p', state: 'solid',
    electronConfig: '[Ne] 3s² 3p²', shells: [2, 8, 4], electronegativity: 1.90, valency: '4', oxidationStates: '+4, -4',
    meltingPointK: 1687, boilingPointK: 3538, densityGPerCm3: 2.3290,
    discoveredBy: 'Jöns Jacob Berzelius', year: 1824,
    usesHindi: 'कंप्यूटर माइक्रोचिप्स (Silicon Valley), सोलर सेल फोटोवोल्टिक पैनल, सिलिकॉन सीलेंट।',
    usesEnglish: 'Semiconductor microprocessors, photovoltaic solar panels, silicone polymers.',
    examHighlightHindi: 'भूपर्पटी में ऑक्सीजन के बाद दूसरा सर्वाधिक पाया जाने वाला तत्व (~27.7%)। रेत (SiO₂) इसका रूप है।'
  },
  {
    number: 15, symbol: 'P', name: 'Phosphorus', hindiName: 'फॉस्फोरस', mass: 30.974,
    category: 'reactive-nonmetal', period: 3, group: 15, block: 'p', state: 'solid',
    electronConfig: '[Ne] 3s² 3p³', shells: [2, 8, 5], electronegativity: 2.19, valency: '3, 5', oxidationStates: '-3, +3, +5',
    meltingPointK: 317.30, boilingPointK: 553.65, densityGPerCm3: 1.823,
    discoveredBy: 'Hennig Brand', year: 1669,
    usesHindi: 'माचिस की तीली व डिब्बी (Red Phosphorus), NPK उर्वरक, हड्डियों व DNA/ATP ऊर्जा अणु।',
    usesEnglish: 'Safety matches, phosphate agricultural fertilizers, DNA/RNA backbone & ATP.',
    examHighlightHindi: 'सफेद फॉस्फोरस (White P₄) हवा में स्वतः जल उठता है, इसलिए इसे जल के अंदर डुबोकर रखते हैं।'
  },
  {
    number: 16, symbol: 'S', name: 'Sulfur', hindiName: 'सल्फर (गंधक)', mass: 32.06,
    category: 'reactive-nonmetal', period: 3, group: 16, block: 'p', state: 'solid',
    electronConfig: '[Ne] 3s² 3p⁴', shells: [2, 8, 6], electronegativity: 2.58, valency: '2, 4, 6', oxidationStates: '-2, +4, +6',
    meltingPointK: 388.36, boilingPointK: 717.87, densityGPerCm3: 2.07,
    discoveredBy: 'Ancient civilizations', year: 'Ancient',
    usesHindi: 'सल्फ्यूरिक अम्ल (H₂SO₄ - रसायनों का राजा), रबर का वल्कनीकरण (Vulcanization), बारूद।',
    usesEnglish: 'Sulfuric acid manufacturing, rubber vulcanization, gunpowder, fungicides.',
    examHighlightHindi: 'सल्फ्यूरिक एसिड को "King of Chemicals" कहा जाता है। S₈ रूप में मुकुट जैसी (Crown-shaped) संरचना होती है।'
  },
  {
    number: 17, symbol: 'Cl', name: 'Chlorine', hindiName: 'क्लोरीन', mass: 35.45,
    category: 'halogen', period: 3, group: 17, block: 'p', state: 'gas',
    electronConfig: '[Ne] 3s² 3p⁵', shells: [2, 8, 7], electronegativity: 3.16, valency: '1', oxidationStates: '-1, +1, +3, +5, +7',
    meltingPointK: 171.6, boilingPointK: 239.11, densityGPerCm3: 0.0032,
    discoveredBy: 'Carl Wilhelm Scheele', year: 1774,
    usesHindi: 'पेयजल शुद्धिकरण (Disinfectant), ब्लीचिंग पाउडर (CaOCl₂), PVC प्लास्टिक पाइप।',
    usesEnglish: 'Drinking water purification, PVC pipes, bleaching powder, solvents.',
    examHighlightHindi: 'पूरी आवर्त सारणी में सर्वाधिक इलेक्ट्रॉन बंधुता (Highest Electron Affinity = -349 kJ/mol) क्लोरीन की है।'
  },
  {
    number: 18, symbol: 'Ar', name: 'Argon', hindiName: 'आर्गन', mass: 39.948,
    category: 'noble-gas', period: 3, group: 18, block: 'p', state: 'gas',
    electronConfig: '[Ne] 3s² 3p⁶', shells: [2, 8, 8], electronegativity: undefined, valency: '0', oxidationStates: '0',
    meltingPointK: 83.81, boilingPointK: 87.30, densityGPerCm3: 0.001784,
    discoveredBy: 'Lord Rayleigh, William Ramsay', year: 1894,
    usesHindi: 'विद्युत फिलामेंट बल्ब, TIG/MIG आर्क वेल्डिंग में अक्रिय ढाल गैस, डबल-ग्लेज़िंग खिड़कियां।',
    usesEnglish: 'Incandescent light bulbs, TIG arc welding shield gas, double-pane windows.',
    examHighlightHindi: 'पृथ्वी के वायुमंडल में तीसरी सबसे प्रचुर गैस (~0.93% आयतन, अक्रिय गैसों में सबसे ज्यादा)।'
  },

  // Period 4 Key Elements
  {
    number: 19, symbol: 'K', name: 'Potassium', hindiName: 'पोटैशियम (Kalium)', mass: 39.098,
    category: 'alkali-metal', period: 4, group: 1, block: 's', state: 'solid',
    electronConfig: '[Ar] 4s¹', shells: [2, 8, 8, 1], electronegativity: 0.82, valency: '1', oxidationStates: '+1',
    meltingPointK: 336.53, boilingPointK: 1032, densityGPerCm3: 0.89,
    discoveredBy: 'Humphry Davy', year: 1807,
    usesHindi: 'NPK पोटाश उर्वरक, तंत्रिका आवेग संचरण (Na⁺/K⁺ ATPase पंप), साबुन।',
    usesEnglish: 'NPK fertilizers, nervous system sodium-potassium ion pumps, soft soaps.',
    examHighlightHindi: 'पानी पर तैरती है और बैंगनी/बैंगनी (Lilac) ज्वाला के साथ आग पकड़ लेती है।'
  },
  {
    number: 20, symbol: 'Ca', name: 'Calcium', hindiName: 'कैल्शियम', mass: 40.078,
    category: 'alkaline-earth', period: 4, group: 2, block: 's', state: 'solid',
    electronConfig: '[Ar] 4s²', shells: [2, 8, 8, 2], electronegativity: 1.00, valency: '2', oxidationStates: '+2',
    meltingPointK: 1115, boilingPointK: 1757, densityGPerCm3: 1.55,
    discoveredBy: 'Humphry Davy', year: 1808,
    usesHindi: 'हड्डियां व दांत (हाइड्रॉक्सीएपेटाइट), सीमेंट व कंक्रीट (CaO), प्लास्टर ऑफ पेरिस (CaSO₄·½H₂O)।',
    usesEnglish: 'Bone & tooth structure, Portland cement, Plaster of Paris, limestone.',
    examHighlightHindi: 'रक्त का थक्का जमने (Blood Clotting) और मांसपेशियों के संकुचन में अनिवार्य आयन Ca²⁺ है।'
  },
  {
    number: 21, symbol: 'Sc', name: 'Scandium', hindiName: 'स्कैंडियम', mass: 44.956,
    category: 'transition-metal', period: 4, group: 3, block: 'd', state: 'solid',
    electronConfig: '[Ar] 3d¹ 4s²', shells: [2, 8, 9, 2], electronegativity: 1.36, valency: '3', oxidationStates: '+3',
    meltingPointK: 1814, boilingPointK: 3109, densityGPerCm3: 2.985,
    discoveredBy: 'Lars Fredrik Nilson', year: 1879,
    usesHindi: 'रूसी मिग लड़ाकू विमानों के लिए हल्के और मजबूत एल्युमिनियम-स्कैंडियम मिश्र धातु।',
    usesEnglish: 'Aerospace high-strength aluminium alloys (MiG jets), stadium halide lighting.',
    examHighlightHindi: 'मेंडेलीव द्वारा भविष्यवाणी किया गया "एका-बोरॉन" (Eka-boron) बाद में स्कैंडियम निकला।'
  },
  {
    number: 22, symbol: 'Ti', name: 'Titanium', hindiName: 'टाइटेनियम', mass: 47.867,
    category: 'transition-metal', period: 4, group: 4, block: 'd', state: 'solid',
    electronConfig: '[Ar] 3d² 4s²', shells: [2, 8, 10, 2], electronegativity: 1.54, valency: '4', oxidationStates: '+4',
    meltingPointK: 1941, boilingPointK: 3560, densityGPerCm3: 4.506,
    discoveredBy: 'William Gregor', year: 1791,
    usesHindi: 'अंतरिक्ष यान, मिसाइल, कृत्रिम हड्डी प्रत्यारोपण (Dental/Joint Implants), TiO₂ सफेद पेंट वर्णक।',
    usesEnglish: 'Aerospace structures, medical joint & dental implants, TiO2 white paint pigment.',
    examHighlightHindi: '"रणनीतिक धातु" (Space Age Metal) - स्टील जैसी ताकत परंतु वजन में 45% हल्की और कभी जंग नहीं लगती।'
  },
  {
    number: 24, symbol: 'Cr', name: 'Chromium', hindiName: 'क्रोमियम', mass: 51.996,
    category: 'transition-metal', period: 4, group: 6, block: 'd', state: 'solid',
    electronConfig: '[Ar] 3d⁵ 4s¹', shells: [2, 8, 13, 1], electronegativity: 1.66, valency: '3, 6', oxidationStates: '+3, +6',
    meltingPointK: 2180, boilingPointK: 2944, densityGPerCm3: 7.19,
    discoveredBy: 'Louis-Nicolas Vauquelin', year: 1797,
    usesHindi: 'स्टेनलेस स्टील (18% Cr), वाहनों पर चमकदार क्रोम प्लेटिंग, K₂Cr₂O₇ प्रबल ऑक्सीकारक।',
    usesEnglish: 'Stainless steel manufacturing, shiny electroplating, ruby laser crystals.',
    examHighlightHindi: 'अर्ध-पूरित d⁵ कक्षक के अतिरिक्त स्थायित्व के कारण इसका विन्यास 3d⁵ 4s¹ होता है (अपवाद)।'
  },
  {
    number: 25, symbol: 'Mn', name: 'Manganese', hindiName: 'मैंगनीज', mass: 54.938,
    category: 'transition-metal', period: 4, group: 7, block: 'd', state: 'solid',
    electronConfig: '[Ar] 3d⁵ 4s²', shells: [2, 8, 13, 2], electronegativity: 1.55, valency: '2 to 7', oxidationStates: '+2, +4, +7',
    meltingPointK: 1519, boilingPointK: 2334, densityGPerCm3: 7.21,
    discoveredBy: 'Johan Gottlieb Gahn', year: 1774,
    usesHindi: 'स्टील को कठोर बनाना (Ferromanganese), KMnO₄ लाल दवा (कीटाणुनाशक), शुष्क बैटरी।',
    usesEnglish: 'High-strength steel alloys, KMnO4 disinfectant antiseptic, alkaline batteries.',
    examHighlightHindi: '3d संक्रमण श्रेणी में सर्वाधिक ऑक्सीकरण अवस्थाएं (+2 से +7 तक) प्रदर्शित करता है।'
  },
  {
    number: 26, symbol: 'Fe', name: 'Iron', hindiName: 'आयरन (लोहा - Ferrum)', mass: 55.845,
    category: 'transition-metal', period: 4, group: 8, block: 'd', state: 'solid',
    electronConfig: '[Ar] 3d⁶ 4s²', shells: [2, 8, 14, 2], electronegativity: 1.83, valency: '2, 3', oxidationStates: '+2, +3',
    meltingPointK: 1811, boilingPointK: 3134, densityGPerCm3: 7.874,
    discoveredBy: 'Ancient civilizations', year: 'Ancient',
    usesHindi: 'पूरी दुनिया का ढांचा (स्टील, रेलवे, पुल, भवन), हीमोग्लोबिन में ऑक्सीजन संवहन।',
    usesEnglish: 'Global civil infrastructure (Steel), oxygen transport in hemoglobin, magnets.',
    examHighlightHindi: 'समग्र पृथ्वी (द्रव्यमान अनुसार) में सर्वाधिक पाया जाने वाला तत्व (~32.1%)। पृथ्वी का कोर पिघले लोहे और निकल से बना है।'
  },
  {
    number: 27, symbol: 'Co', name: 'Cobalt', hindiName: 'कोबाल्ट', mass: 58.933,
    category: 'transition-metal', period: 4, group: 9, block: 'd', state: 'solid',
    electronConfig: '[Ar] 3d⁷ 4s²', shells: [2, 8, 15, 2], electronegativity: 1.88, valency: '2, 3', oxidationStates: '+2, +3',
    meltingPointK: 1768, boilingPointK: 3200, densityGPerCm3: 8.90,
    discoveredBy: 'Georg Brandt', year: 1735,
    usesHindi: 'विटामिन B12 (सायनोकोबालामिन), लिथियम बैटरी कैथोड, कोबाल्ट-60 कैंसर रेडिएशन थेरेपी।',
    usesEnglish: 'Vitamin B12 core, EV lithium battery cathodes, Cobalt-60 radiation therapy.',
    examHighlightHindi: 'विटामिन B12 का रासायनिक नाम साइनोकोबालामिन है और इसमें कोबाल्ट धातु पाई जाती है।'
  },
  {
    number: 28, symbol: 'Ni', name: 'Nickel', hindiName: 'निकल', mass: 58.693,
    category: 'transition-metal', period: 4, group: 10, block: 'd', state: 'solid',
    electronConfig: '[Ar] 3d⁸ 4s²', shells: [2, 8, 16, 2], electronegativity: 1.91, valency: '2', oxidationStates: '+2',
    meltingPointK: 1728, boilingPointK: 3003, densityGPerCm3: 8.908,
    discoveredBy: 'Axel Fredrik Cronstedt', year: 1751,
    usesHindi: 'वनस्पति तेलों का हाइड्रोजनीकरण (घी बनाना - उत्प्रेरक Raney Nickel), सिक्के, निक्रोम हीटर तार।',
    usesEnglish: 'Hydrogenation catalyst for vegetable oils, Nichrome heating elements, coins.',
    examHighlightHindi: 'सबातीयर-सेंडेरेंस अभिक्रिया में वनस्पति तेल से वनस्पति घी बनाने में निकल उत्प्रेरक का काम करता है।'
  },
  {
    number: 29, symbol: 'Cu', name: 'Copper', hindiName: 'कॉपर (तांबा - Cuprum)', mass: 63.546,
    category: 'transition-metal', period: 4, group: 11, block: 'd', state: 'solid',
    electronConfig: '[Ar] 3d¹⁰ 4s¹', shells: [2, 8, 18, 1], electronegativity: 1.90, valency: '1, 2', oxidationStates: '+1, +2',
    meltingPointK: 1357.77, boilingPointK: 2835, densityGPerCm3: 8.96,
    discoveredBy: 'Ancient civilizations', year: 'Ancient (~9000 BC)',
    usesHindi: 'विद्युत तार, पीतल (Brass = Cu+Zn), कांसा (Bronze = Cu+Sn), कॉपर सल्फेट (नीला थोथा CuSO₄·5H₂O)।',
    usesEnglish: 'Electrical wiring, Brass (Cu+Zn), Bronze (Cu+Sn), Blue Vitriol (CuSO4).',
    examHighlightHindi: 'मानव द्वारा खोजी व प्रयुक्त की गई सबसे पहली धातु (ताम्रपाषाण काल)। इसका इलेक्ट्रॉनिक विन्यास 3d¹⁰ 4s¹ है।'
  },
  {
    number: 30, symbol: 'Zn', name: 'Zinc', hindiName: 'जिंक (जस्ता)', mass: 65.38,
    category: 'transition-metal', period: 4, group: 12, block: 'd', state: 'solid',
    electronConfig: '[Ar] 3d¹⁰ 4s²', shells: [2, 8, 18, 2], electronegativity: 1.65, valency: '2', oxidationStates: '+2',
    meltingPointK: 692.68, boilingPointK: 1180, densityGPerCm3: 7.14,
    discoveredBy: 'Indian metallurgists (Ancient Zawar mines)', year: 'Ancient (1000 BC)',
    usesHindi: 'लोहे को जंग से बचाने हेतु गैल्वनीकरण (Galvanization), इंसुलिन हार्मोन, ड्राई सेल कैथोड।',
    usesEnglish: 'Galvanization of iron against rust, human insulin hormone cofactor, batteries.',
    examHighlightHindi: 'लोहे पर जस्ते की परत चढ़ाने को गैल्वनीकरण (Galvanizing) कहते हैं। इंसुलिन हार्मोन में जिंक उपस्थित होता है।'
  },
  {
    number: 35, symbol: 'Br', name: 'Bromine', hindiName: 'ब्रोमीन', mass: 79.904,
    category: 'halogen', period: 4, group: 17, block: 'p', state: 'liquid',
    electronConfig: '[Ar] 3d¹⁰ 4s² 4p⁵', shells: [2, 8, 18, 7], electronegativity: 2.96, valency: '1', oxidationStates: '-1, +1, +5',
    meltingPointK: 265.8, boilingPointK: 332.0, densityGPerCm3: 3.1028,
    discoveredBy: 'Antoine Jérôme Balard', year: 1826,
    usesHindi: 'फोटोग्राफी में सिल्वर ब्रोमाइड (AgBr), अग्नि रोधक (Flame Retardants), शामक दवाएं।',
    usesEnglish: 'Silver Bromide (AgBr) in photography, fire retardants, pharmaceuticals.',
    examHighlightHindi: 'कमरे के तापमान (25°C) पर पाई जाने वाली एकमात्र द्रव अधातु (Liquid Non-metal) है (लाल-भूरा द्रव)।'
  },
  {
    number: 36, symbol: 'Kr', name: 'Krypton', hindiName: 'क्रिप्टॉन', mass: 83.798,
    category: 'noble-gas', period: 4, group: 18, block: 'p', state: 'gas',
    electronConfig: '[Ar] 3d¹⁰ 4s² 4p⁶', shells: [2, 8, 18, 8], electronegativity: 3.00, valency: '0', oxidationStates: '+2',
    meltingPointK: 115.79, boilingPointK: 119.93, densityGPerCm3: 0.003733,
    discoveredBy: 'William Ramsay, Morris Travers', year: 1898,
    usesHindi: 'हवाई अड्डे के रनवे की हाई-स्पीड फ्लैश लाइट, लेजर सर्जरी।',
    usesEnglish: 'Airport runway strobe lights, high-speed photography flash, gas lasers.',
    examHighlightHindi: '1960 से 1983 तक मानक "मीटर" की अंतरराष्ट्रीय परिभाषा क्रिप्टॉन-86 के नारंगी स्पेक्ट्रम से की जाती थी।'
  },

  // Key Precious & Heavy Elements
  {
    number: 47, symbol: 'Ag', name: 'Silver', hindiName: 'सिल्वर (चांदी - Argentum)', mass: 107.87,
    category: 'transition-metal', period: 5, group: 11, block: 'd', state: 'solid',
    electronConfig: '[Kr] 4d¹⁰ 5s¹', shells: [2, 8, 18, 18, 1], electronegativity: 1.93, valency: '1', oxidationStates: '+1',
    meltingPointK: 1234.93, boilingPointK: 2435, densityGPerCm3: 10.49,
    discoveredBy: 'Ancient civilizations', year: 'Ancient',
    usesHindi: 'सर्वोत्तम विद्युत व ऊष्मा चालक, आभूषण, मतदान स्याही (AgNO₃ सिल्वर नाइट्रेट), कृत्रिम वर्षा (AgI)।',
    usesEnglish: 'Best electrical & thermal conductor, jewelry, voter ink (AgNO3), cloud seeding (AgI).',
    examHighlightHindi: 'पूरी दुनिया में विद्युत एवं ऊष्मा की सर्वाधिक चालक (Best Conductor) धातु है। सिल्वर आयोडाइड (AgI) से कृत्रिम वर्षा कराई जाती है।'
  },
  {
    number: 50, symbol: 'Sn', name: 'Tin', hindiName: 'टिन (Stannum)', mass: 118.71,
    category: 'post-transition', period: 5, group: 14, block: 'p', state: 'solid',
    electronConfig: '[Kr] 4d¹⁰ 5s² 5p²', shells: [2, 8, 18, 18, 4], electronegativity: 1.96, valency: '2, 4', oxidationStates: '+2, +4',
    meltingPointK: 505.08, boilingPointK: 2875, densityGPerCm3: 7.265,
    discoveredBy: 'Ancient civilizations', year: 'Ancient',
    usesHindi: 'खाद्य डिब्बों पर टिनिंग (Tin Plating), सोल्डर तार (Solder = Pb+Sn), कांसा (Bronze = Cu+Sn)।',
    usesEnglish: 'Food tin cans corrosion prevention, electronics solder wire, bronze alloy.',
    examHighlightHindi: 'टिन के सर्वाधिक 10 प्राकृतिक स्थिर समस्थानिक (Stable Isotopes) होते हैं।'
  },
  {
    number: 53, symbol: 'I', name: 'Iodine', hindiName: 'आयोडीन', mass: 126.90,
    category: 'halogen', period: 5, group: 17, block: 'p', state: 'solid',
    electronConfig: '[Kr] 4d¹⁰ 5s² 5p⁵', shells: [2, 8, 18, 18, 7], electronegativity: 2.66, valency: '1', oxidationStates: '-1, +1, +5, +7',
    meltingPointK: 386.85, boilingPointK: 457.4, densityGPerCm3: 4.933,
    discoveredBy: 'Bernard Courtois', year: 1811,
    usesHindi: 'थायरॉयड ग्रंथि (थायरोक्सिन हार्मोन), टिंचर आयोडीन एंटीसेप्टिक, आयोडीन युक्त नमक (KI/KIO₃)।',
    usesEnglish: 'Thyroid hormone synthesis, Tincture of Iodine antiseptic, iodized table salt.',
    examHighlightHindi: 'चमकदार बैंगनी-काले क्रिस्टल वाली अधातु जो गर्म करने पर सीधे गैस में बदल जाती है (ऊर्ध्वपातन / Sublimation)।'
  },
  {
    number: 54, symbol: 'Xe', name: 'Xenon', hindiName: 'क्सीनॉन', mass: 131.29,
    category: 'noble-gas', period: 5, group: 18, block: 'p', state: 'gas',
    electronConfig: '[Kr] 4d¹⁰ 5s² 5p⁶', shells: [2, 8, 18, 18, 8], electronegativity: 2.60, valency: '0', oxidationStates: '+2, +4, +6, +8',
    meltingPointK: 161.4, boilingPointK: 165.03, densityGPerCm3: 0.005887,
    discoveredBy: 'William Ramsay, Morris Travers', year: 1898,
    usesHindi: 'उपग्रहों में आयन थ्रस्टर प्रणोदक (Ion Propulsion), सिनेमा प्रोजेक्टर आर्क लैंप, एनेस्थीसिया।',
    usesEnglish: 'Satellite ion propulsion thrusters, IMAX cinema xenon lamps, general anesthesia.',
    examHighlightHindi: 'इसे "स्ट्रेंजर गैस" (Stranger Gas) कहते हैं। अक्रिय होने के बावजूद नील बार्टलेट ने 1962 में इसका पहला यौगिक (XePtF₆) बनाया।'
  },
  {
    number: 74, symbol: 'W', name: 'Tungsten', hindiName: 'टंगस्टन (Wolfram)', mass: 183.84,
    category: 'transition-metal', period: 6, group: 6, block: 'd', state: 'solid',
    electronConfig: '[Xe] 4f¹⁴ 5d⁴ 6s²', shells: [2, 8, 18, 32, 12, 2], electronegativity: 2.36, valency: '6', oxidationStates: '+6',
    meltingPointK: 3695, boilingPointK: 5828, densityGPerCm3: 19.25,
    discoveredBy: 'Carl Wilhelm Scheele, Juan José and Fausto Elhuyar', year: 1781,
    usesHindi: 'पारंपरिक बिजली के बल्ब का फिलामेंट, भारी तोपखाने और आर्मर-पियर्सिंग मिसाइल नोक।',
    usesEnglish: 'Incandescent bulb filaments, rocket nozzles, armor-piercing anti-tank penetrators.',
    examHighlightHindi: 'सभी ज्ञात धातुओं में सर्वाधिक गलनांक (Highest Melting Point = 3422°C / 3695 K) टंगस्टन का है।'
  },
  {
    number: 76, symbol: 'Os', name: 'Osmium', hindiName: 'ओस्मियम', mass: 190.23,
    category: 'transition-metal', period: 6, group: 8, block: 'd', state: 'solid',
    electronConfig: '[Xe] 4f¹⁴ 5d⁶ 6s²', shells: [2, 8, 18, 32, 14, 2], electronegativity: 2.20, valency: '4, 8', oxidationStates: '+4, +8',
    meltingPointK: 3306, boilingPointK: 5285, densityGPerCm3: 22.59,
    discoveredBy: 'Smithson Tennant', year: 1803,
    usesHindi: 'फाउंटेन पेन की निब, विद्युत संपर्क बिंदु, फिंगरप्रिंट डिटेक्शन (OsO₄)।',
    usesEnglish: 'Fountain pen nib tips, instrument pivots, OsO4 fingerprint detection.',
    examHighlightHindi: 'पूरी आवर्त सारणी में सर्वाधिक घनत्व (Highest Density = 22.59 g/cm³) वाला तत्व है (सीसे से दोगुना भारी)।'
  },
  {
    number: 78, symbol: 'Pt', name: 'Platinum', hindiName: 'प्लैटिनम (श्वेत स्वर्ण)', mass: 195.08,
    category: 'transition-metal', period: 6, group: 10, block: 'd', state: 'solid',
    electronConfig: '[Xe] 4f¹⁴ 5d⁹ 6s¹', shells: [2, 8, 18, 32, 17, 1], electronegativity: 2.28, valency: '2, 4', oxidationStates: '+2, +4',
    meltingPointK: 2041.4, boilingPointK: 4098, densityGPerCm3: 21.45,
    discoveredBy: 'Antonio de Ulloa', year: 1735,
    usesHindi: 'कारों में उत्प्रेरक परिवर्तक (Catalytic Converter), कैंसर रोधी दवा (Cisplatin), लग्जरी आभूषण।',
    usesEnglish: 'Automotive catalytic converters, Cisplatin chemotherapy medicine, luxury jewelry.',
    examHighlightHindi: 'इसे "सफेद सोना" (White Gold / Adamantine) कहा जाता है। अम्लराज (Aqua Regia) में घुल जाता है।'
  },
  {
    number: 79, symbol: 'Au', name: 'Gold', hindiName: 'गोल्ड (सोना - Aurum)', mass: 196.97,
    category: 'transition-metal', period: 6, group: 11, block: 'd', state: 'solid',
    electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s¹', shells: [2, 8, 18, 32, 18, 1], electronegativity: 2.54, valency: '1, 3', oxidationStates: '+1, +3',
    meltingPointK: 1337.33, boilingPointK: 3129, densityGPerCm3: 19.30,
    discoveredBy: 'Ancient civilizations', year: 'Ancient (~4000 BC)',
    usesHindi: 'सर्वाधिक आघातवर्धनीय आभूषण, अंतरिक्ष हेलमेट वाइजर पर सौर विकिरण परावर्तक परत, सुपरकंप्यूटर चिप्स।',
    usesEnglish: 'Jewelry, astronaut helmet gold visor radiation shield, corrosion-free electronics pins.',
    examHighlightHindi: 'सर्वाधिक आघातवर्धनीय (Most Malleable) और तन्य (Ductile) धातु — मात्र 1 ग्राम सोने से 2 किलोमीटर लंबा महीन तार खींचा जा सकता है!'
  },
  {
    number: 80, symbol: 'Hg', name: 'Mercury', hindiName: 'मर्करी (पारा - Hydrargyrum)', mass: 200.59,
    category: 'transition-metal', period: 6, group: 12, block: 'd', state: 'liquid',
    electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s²', shells: [2, 8, 18, 32, 18, 2], electronegativity: 2.00, valency: '1, 2', oxidationStates: '+1, +2',
    meltingPointK: 234.32, boilingPointK: 629.88, densityGPerCm3: 13.534,
    discoveredBy: 'Ancient civilizations', year: 'Ancient (1500 BC)',
    usesHindi: 'थर्मामीटर, बैरोमीटर (वायुदाब मापी), दंत अमलगम (Dental Amalgam), फ्लोरोसेंट ट्यूबलाइट।',
    usesEnglish: 'Clinical thermometers, barometers, dental filling amalgams, fluorescent lamps.',
    examHighlightHindi: 'कमरे के तापमान (25°C) पर पाई जाने वाली एकमात्र द्रव धातु (Liquid Metal)। इसका प्रमुख अयस्क सिनाबार (HgS) है। पारे के प्रदूषण से मिनामाता रोग होता है।'
  },
  {
    number: 82, symbol: 'Pb', name: 'Lead', hindiName: 'लेड (सीसा - Plumbum)', mass: 207.2,
    category: 'post-transition', period: 6, group: 14, block: 'p', state: 'solid',
    electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²', shells: [2, 8, 18, 32, 18, 4], electronegativity: 2.33, valency: '2, 4', oxidationStates: '+2, +4',
    meltingPointK: 600.61, boilingPointK: 2022, densityGPerCm3: 11.34,
    discoveredBy: 'Ancient civilizations', year: 'Ancient',
    usesHindi: 'कार लेड-एसिड बैटरी, एक्स-रे व परमाणु विकिरण सुरक्षा शील्ड, सोल्डर धातु।',
    usesEnglish: 'Lead-acid car starter batteries, X-ray & gamma radiation shielding, ammunition.',
    examHighlightHindi: 'प्राकृतिक रेडियोधर्मी विघटन श्रृंखलाओं (Uranium, Thorium) का अंतिम स्थायी स्थिर उत्पाद सीसा (Pb) ही होता है।'
  },
  {
    number: 88, symbol: 'Ra', name: 'Radium', hindiName: 'रेडियम', mass: 226,
    category: 'alkaline-earth', period: 7, group: 2, block: 's', state: 'solid',
    electronConfig: '[Rn] 7s²', shells: [2, 8, 18, 32, 18, 8, 2], electronegativity: 0.90, valency: '2', oxidationStates: '+2',
    meltingPointK: 973, boilingPointK: 2010, densityGPerCm3: 5.5,
    discoveredBy: 'Marie Curie, Pierre Curie', year: 1898,
    usesHindi: 'ऐतिहासिक रूप से अंधेरे में चमकने वाली घड़ियां (Glow-in-the-dark), कैंसर का ब्राचीथेरेपी उपचार।',
    usesEnglish: 'Historical self-luminous watch dials, cancer brachytherapy.',
    examHighlightHindi: 'मैडम मैरी क्यूरी और पियरे क्यूरी ने पिचब्लेंड (Pitchblende) से खोजा था, जिसके लिए उन्हें नोबेल पुरस्कार मिला।'
  },
  {
    number: 92, symbol: 'U', name: 'Uranium', hindiName: 'यूरेनियम', mass: 238.03,
    category: 'actinide', period: 7, group: 3, block: 'f', state: 'solid',
    electronConfig: '[Rn] 5f³ 6d¹ 7s²', shells: [2, 8, 18, 32, 21, 9, 2], electronegativity: 1.38, valency: '3, 4, 5, 6', oxidationStates: '+3, +4, +5, +6',
    meltingPointK: 1405.3, boilingPointK: 4404, densityGPerCm3: 19.1,
    discoveredBy: 'Martin Heinrich Klaproth', year: 1789,
    usesHindi: 'परमाणु ऊर्जा संयंत्रों में विद्युत उत्पादन (Nuclear Fission), परमाणु पनडुब्बियां व परमाणु हथियार।',
    usesEnglish: 'Nuclear power reactors electricity generation, atomic submarines, medical isotopes.',
    examHighlightHindi: 'यूरेनियम-235 प्राकृतिक रूप से विखंडनीय (Fissile) समस्थानिक है। 1 kg यूरेनियम से 30 लाख kg कोयले जितनी ऊर्जा निकलती है!'
  },
  {
    number: 94, symbol: 'Pu', name: 'Plutonium', hindiName: 'प्लूटोनियम', mass: 244,
    category: 'actinide', period: 7, group: 3, block: 'f', state: 'solid',
    electronConfig: '[Rn] 5f⁶ 7s²', shells: [2, 8, 18, 32, 24, 8, 2], electronegativity: 1.28, valency: '3, 4, 5, 6', oxidationStates: '+4',
    meltingPointK: 912.5, boilingPointK: 3505, densityGPerCm3: 19.816,
    discoveredBy: 'Glenn T. Seaborg et al.', year: 1940,
    usesHindi: 'नासा वॉयेजर और क्यूरियोसिटी मार्स रोवर के रेडियोआइसोटोप थर्मोइलेक्ट्रिक जनरेटर (RTG), परमाणु हथियार।',
    usesEnglish: 'NASA Voyager & Mars Curiosity RTG nuclear batteries, fast breeder reactors.',
    examHighlightHindi: 'प्लूटोनियम-238 स्वतः ऊष्मा उत्सर्जित करता है जिससे गहरे अंतरिक्ष अभियानों (Deep Space) में बैटरियां दशकों तक काम करती हैं।'
  },
  {
    number: 118, symbol: 'Og', name: 'Oganesson', hindiName: 'ओगनेसन', mass: 294,
    category: 'noble-gas', period: 7, group: 18, block: 'p', state: 'synthetic',
    electronConfig: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶', shells: [2, 8, 18, 32, 32, 18, 8], electronegativity: undefined, valency: '0', oxidationStates: '0',
    meltingPointK: undefined, boilingPointK: 350, densityGPerCm3: 4.9,
    discoveredBy: 'Yuri Oganessian et al. (Dubna, Russia & LLNL)', year: 2002,
    usesHindi: 'सुपरहेवी तत्वों की स्थिरता के द्वीप (Island of Stability) पर वैज्ञानिक परमाणु भौतिकी अनुसंधान।',
    usesEnglish: 'Nuclear physics research into the superheavy Island of Stability.',
    examHighlightHindi: 'आवर्त सारणी का 118वां और अंतिम ज्ञात तत्व। किसी जीवित वैज्ञानिक (यूरी ओगनेसियन) के नाम पर रखा गया दूसरा तत्व।'
  }
];

// Helper to fill in any placeholder grid elements for full 1-118 modern periodic table
export const ALL_118_ELEMENTS_SUMMARY: { number: number; symbol: string; name: string; hindiName: string; mass: number | string; category: ElementData['category']; period: number; group: number; block: 's' | 'p' | 'd' | 'f' }[] = [
  { number: 1, symbol: 'H', name: 'Hydrogen', hindiName: 'हाइड्रोजन', mass: 1.008, category: 'reactive-nonmetal', period: 1, group: 1, block: 's' },
  { number: 2, symbol: 'He', name: 'Helium', hindiName: 'हीलियम', mass: 4.003, category: 'noble-gas', period: 1, group: 18, block: 's' },
  { number: 3, symbol: 'Li', name: 'Lithium', hindiName: 'लिथियम', mass: 6.94, category: 'alkali-metal', period: 2, group: 1, block: 's' },
  { number: 4, symbol: 'Be', name: 'Beryllium', hindiName: 'बेरिलियम', mass: 9.012, category: 'alkaline-earth', period: 2, group: 2, block: 's' },
  { number: 5, symbol: 'B', name: 'Boron', hindiName: 'बोरॉन', mass: 10.81, category: 'metalloid', period: 2, group: 13, block: 'p' },
  { number: 6, symbol: 'C', name: 'Carbon', hindiName: 'कार्बन', mass: 12.011, category: 'reactive-nonmetal', period: 2, group: 14, block: 'p' },
  { number: 7, symbol: 'N', name: 'Nitrogen', hindiName: 'नाइट्रोजन', mass: 14.007, category: 'reactive-nonmetal', period: 2, group: 15, block: 'p' },
  { number: 8, symbol: 'O', name: 'Oxygen', hindiName: 'ऑक्सीजन', mass: 15.999, category: 'reactive-nonmetal', period: 2, group: 16, block: 'p' },
  { number: 9, symbol: 'F', name: 'Fluorine', hindiName: 'फ्लोरीन', mass: 18.998, category: 'halogen', period: 2, group: 17, block: 'p' },
  { number: 10, symbol: 'Ne', name: 'Neon', hindiName: 'नियॉन', mass: 20.18, category: 'noble-gas', period: 2, group: 18, block: 'p' },
  { number: 11, symbol: 'Na', name: 'Sodium', hindiName: 'सोडियम', mass: 22.99, category: 'alkali-metal', period: 3, group: 1, block: 's' },
  { number: 12, symbol: 'Mg', name: 'Magnesium', hindiName: 'मैग्नीशियम', mass: 24.305, category: 'alkaline-earth', period: 3, group: 2, block: 's' },
  { number: 13, symbol: 'Al', name: 'Aluminium', hindiName: 'एल्युमिनियम', mass: 26.982, category: 'post-transition', period: 3, group: 13, block: 'p' },
  { number: 14, symbol: 'Si', name: 'Silicon', hindiName: 'सिलिकॉन', mass: 28.085, category: 'metalloid', period: 3, group: 14, block: 'p' },
  { number: 15, symbol: 'P', name: 'Phosphorus', hindiName: 'फॉस्फोरस', mass: 30.974, category: 'reactive-nonmetal', period: 3, group: 15, block: 'p' },
  { number: 16, symbol: 'S', name: 'Sulfur', hindiName: 'सल्फर', mass: 32.06, category: 'reactive-nonmetal', period: 3, group: 16, block: 'p' },
  { number: 17, symbol: 'Cl', name: 'Chlorine', hindiName: 'क्लोरीन', mass: 35.45, category: 'halogen', period: 3, group: 17, block: 'p' },
  { number: 18, symbol: 'Ar', name: 'Argon', hindiName: 'आर्गन', mass: 39.95, category: 'noble-gas', period: 3, group: 18, block: 'p' },
  { number: 19, symbol: 'K', name: 'Potassium', hindiName: 'पोटैशियम', mass: 39.098, category: 'alkali-metal', period: 4, group: 1, block: 's' },
  { number: 20, symbol: 'Ca', name: 'Calcium', hindiName: 'कैल्शियम', mass: 40.078, category: 'alkaline-earth', period: 4, group: 2, block: 's' },
  { number: 21, symbol: 'Sc', name: 'Scandium', hindiName: 'स्कैंडियम', mass: 44.956, category: 'transition-metal', period: 4, group: 3, block: 'd' },
  { number: 22, symbol: 'Ti', name: 'Titanium', hindiName: 'टाइटेनियम', mass: 47.867, category: 'transition-metal', period: 4, group: 4, block: 'd' },
  { number: 23, symbol: 'V', name: 'Vanadium', hindiName: 'वैनेडियम', mass: 50.942, category: 'transition-metal', period: 4, group: 5, block: 'd' },
  { number: 24, symbol: 'Cr', name: 'Chromium', hindiName: 'क्रोमियम', mass: 51.996, category: 'transition-metal', period: 4, group: 6, block: 'd' },
  { number: 25, symbol: 'Mn', name: 'Manganese', hindiName: 'मैंगनीज', mass: 54.938, category: 'transition-metal', period: 4, group: 7, block: 'd' },
  { number: 26, symbol: 'Fe', name: 'Iron', hindiName: 'लोहा', mass: 55.845, category: 'transition-metal', period: 4, group: 8, block: 'd' },
  { number: 27, symbol: 'Co', name: 'Cobalt', hindiName: 'कोबाल्ट', mass: 58.933, category: 'transition-metal', period: 4, group: 9, block: 'd' },
  { number: 28, symbol: 'Ni', name: 'Nickel', hindiName: 'निकल', mass: 58.693, category: 'transition-metal', period: 4, group: 10, block: 'd' },
  { number: 29, symbol: 'Cu', name: 'Copper', hindiName: 'तांबा', mass: 63.546, category: 'transition-metal', period: 4, group: 11, block: 'd' },
  { number: 30, symbol: 'Zn', name: 'Zinc', hindiName: 'जस्ता', mass: 65.38, category: 'transition-metal', period: 4, group: 12, block: 'd' },
  { number: 31, symbol: 'Ga', name: 'Gallium', hindiName: 'गैलियम', mass: 69.723, category: 'post-transition', period: 4, group: 13, block: 'p' },
  { number: 32, symbol: 'Ge', name: 'Germanium', hindiName: 'जर्मेनियम', mass: 72.63, category: 'metalloid', period: 4, group: 14, block: 'p' },
  { number: 33, symbol: 'As', name: 'Arsenic', hindiName: 'आर्सेनिक', mass: 74.922, category: 'metalloid', period: 4, group: 15, block: 'p' },
  { number: 34, symbol: 'Se', name: 'Selenium', hindiName: 'सेलेनियम', mass: 78.971, category: 'reactive-nonmetal', period: 4, group: 16, block: 'p' },
  { number: 35, symbol: 'Br', name: 'Bromine', hindiName: 'ब्रोमीन', mass: 79.904, category: 'halogen', period: 4, group: 17, block: 'p' },
  { number: 36, symbol: 'Kr', name: 'Krypton', hindiName: 'क्रिप्टॉन', mass: 83.798, category: 'noble-gas', period: 4, group: 18, block: 'p' },
  { number: 37, symbol: 'Rb', name: 'Rubidium', hindiName: 'रूबिडियम', mass: 85.468, category: 'alkali-metal', period: 5, group: 1, block: 's' },
  { number: 38, symbol: 'Sr', name: 'Strontium', hindiName: 'स्ट्रोंटियम', mass: 87.62, category: 'alkaline-earth', period: 5, group: 2, block: 's' },
  { number: 39, symbol: 'Y', name: 'Yttrium', hindiName: 'इत्रियम', mass: 88.906, category: 'transition-metal', period: 5, group: 3, block: 'd' },
  { number: 40, symbol: 'Zr', name: 'Zirconium', hindiName: 'ज़िरकोनियम', mass: 91.224, category: 'transition-metal', period: 5, group: 4, block: 'd' },
  { number: 41, symbol: 'Nb', name: 'Niobium', hindiName: 'नायोबियम', mass: 92.906, category: 'transition-metal', period: 5, group: 5, block: 'd' },
  { number: 42, symbol: 'Mo', name: 'Molybdenum', hindiName: 'मोलिब्डेनम', mass: 95.95, category: 'transition-metal', period: 5, group: 6, block: 'd' },
  { number: 43, symbol: 'Tc', name: 'Technetium', hindiName: 'टेक्नेटियम', mass: 98, category: 'transition-metal', period: 5, group: 7, block: 'd' },
  { number: 44, symbol: 'Ru', name: 'Ruthenium', hindiName: 'रूथेनियम', mass: 101.07, category: 'transition-metal', period: 5, group: 8, block: 'd' },
  { number: 45, symbol: 'Rh', name: 'Rhodium', hindiName: 'रोडियम', mass: 102.91, category: 'transition-metal', period: 5, group: 9, block: 'd' },
  { number: 46, symbol: 'Pd', name: 'Palladium', hindiName: 'पैलेडियम', mass: 106.42, category: 'transition-metal', period: 5, group: 10, block: 'd' },
  { number: 47, symbol: 'Ag', name: 'Silver', hindiName: 'चांदी', mass: 107.87, category: 'transition-metal', period: 5, group: 11, block: 'd' },
  { number: 48, symbol: 'Cd', name: 'Cadmium', hindiName: 'कैडमियम', mass: 112.41, category: 'transition-metal', period: 5, group: 12, block: 'd' },
  { number: 49, symbol: 'In', name: 'Indium', hindiName: 'इंडियम', mass: 114.82, category: 'post-transition', period: 5, group: 13, block: 'p' },
  { number: 50, symbol: 'Sn', name: 'Tin', hindiName: 'टिन', mass: 118.71, category: 'post-transition', period: 5, group: 14, block: 'p' },
  { number: 51, symbol: 'Sb', name: 'Antimony', hindiName: 'एंटीमनी', mass: 121.76, category: 'metalloid', period: 5, group: 15, block: 'p' },
  { number: 52, symbol: 'Te', name: 'Tellurium', hindiName: 'टेल्यूरियम', mass: 127.60, category: 'metalloid', period: 5, group: 16, block: 'p' },
  { number: 53, symbol: 'I', name: 'Iodine', hindiName: 'आयोडीन', mass: 126.90, category: 'halogen', period: 5, group: 17, block: 'p' },
  { number: 54, symbol: 'Xe', name: 'Xenon', hindiName: 'क्सीनॉन', mass: 131.29, category: 'noble-gas', period: 5, group: 18, block: 'p' },
  { number: 55, symbol: 'Cs', name: 'Caesium', hindiName: 'सीज़ियम', mass: 132.91, category: 'alkali-metal', period: 6, group: 1, block: 's' },
  { number: 56, symbol: 'Ba', name: 'Barium', hindiName: 'बेरियम', mass: 137.33, category: 'alkaline-earth', period: 6, group: 2, block: 's' },
  { number: 57, symbol: 'La', name: 'Lanthanum', hindiName: 'लैन्थेनम', mass: 138.91, category: 'lanthanide', period: 6, group: 3, block: 'f' },
  { number: 58, symbol: 'Ce', name: 'Cerium', hindiName: 'सीरियम', mass: 140.12, category: 'lanthanide', period: 6, group: 3, block: 'f' },
  { number: 59, symbol: 'Pr', name: 'Praseodymium', hindiName: 'प्रेजोडिमियम', mass: 140.91, category: 'lanthanide', period: 6, group: 3, block: 'f' },
  { number: 60, symbol: 'Nd', name: 'Neodymium', hindiName: 'नियोडिमियम', mass: 144.24, category: 'lanthanide', period: 6, group: 3, block: 'f' },
  { number: 61, symbol: 'Pm', name: 'Promethium', hindiName: 'प्रोमेथियम', mass: 145, category: 'lanthanide', period: 6, group: 3, block: 'f' },
  { number: 62, symbol: 'Sm', name: 'Samarium', hindiName: 'सैमरियम', mass: 150.36, category: 'lanthanide', period: 6, group: 3, block: 'f' },
  { number: 63, symbol: 'Eu', name: 'Europium', hindiName: 'यूरोपियम', mass: 151.96, category: 'lanthanide', period: 6, group: 3, block: 'f' },
  { number: 64, symbol: 'Gd', name: 'Gadolinium', hindiName: 'गैडोलिनियम', mass: 157.25, category: 'lanthanide', period: 6, group: 3, block: 'f' },
  { number: 65, symbol: 'Tb', name: 'Terbium', hindiName: 'टर्बियम', mass: 158.93, category: 'lanthanide', period: 6, group: 3, block: 'f' },
  { number: 66, symbol: 'Dy', name: 'Dysprosium', hindiName: 'डिस्प्रोसियम', mass: 162.50, category: 'lanthanide', period: 6, group: 3, block: 'f' },
  { number: 67, symbol: 'Ho', name: 'Holmium', hindiName: 'होल्मियम', mass: 164.93, category: 'lanthanide', period: 6, group: 3, block: 'f' },
  { number: 68, symbol: 'Er', name: 'Erbium', hindiName: 'अर्बियम', mass: 167.26, category: 'lanthanide', period: 6, group: 3, block: 'f' },
  { number: 69, symbol: 'Tm', name: 'Thulium', hindiName: 'थ्यूलियम', mass: 168.93, category: 'lanthanide', period: 6, group: 3, block: 'f' },
  { number: 70, symbol: 'Yb', name: 'Ytterbium', hindiName: 'इटर्बियम', mass: 173.05, category: 'lanthanide', period: 6, group: 3, block: 'f' },
  { number: 71, symbol: 'Lu', name: 'Lutetium', hindiName: 'ल्यूटीशियम', mass: 174.97, category: 'lanthanide', period: 6, group: 3, block: 'd' },
  { number: 72, symbol: 'Hf', name: 'Hafnium', hindiName: 'हैफ्नियम', mass: 178.49, category: 'transition-metal', period: 6, group: 4, block: 'd' },
  { number: 73, symbol: 'Ta', name: 'Tantalum', hindiName: 'टैंटालम', mass: 180.95, category: 'transition-metal', period: 6, group: 5, block: 'd' },
  { number: 74, symbol: 'W', name: 'Tungsten', hindiName: 'टंगस्टन', mass: 183.84, category: 'transition-metal', period: 6, group: 6, block: 'd' },
  { number: 75, symbol: 'Re', name: 'Rhenium', hindiName: 'रेनियम', mass: 186.21, category: 'transition-metal', period: 6, group: 7, block: 'd' },
  { number: 76, symbol: 'Os', name: 'Osmium', hindiName: 'ओस्मियम', mass: 190.23, category: 'transition-metal', period: 6, group: 8, block: 'd' },
  { number: 77, symbol: 'Ir', name: 'Iridium', hindiName: 'इरिडियम', mass: 192.22, category: 'transition-metal', period: 6, group: 9, block: 'd' },
  { number: 78, symbol: 'Pt', name: 'Platinum', hindiName: 'प्लैटिनम', mass: 195.08, category: 'transition-metal', period: 6, group: 10, block: 'd' },
  { number: 79, symbol: 'Au', name: 'Gold', hindiName: 'सोना', mass: 196.97, category: 'transition-metal', period: 6, group: 11, block: 'd' },
  { number: 80, symbol: 'Hg', name: 'Mercury', hindiName: 'पारा', mass: 200.59, category: 'transition-metal', period: 6, group: 12, block: 'd' },
  { number: 81, symbol: 'Tl', name: 'Thallium', hindiName: 'थैलियम', mass: 204.38, category: 'post-transition', period: 6, group: 13, block: 'p' },
  { number: 82, symbol: 'Pb', name: 'Lead', hindiName: 'सीसा', mass: 207.2, category: 'post-transition', period: 6, group: 14, block: 'p' },
  { number: 83, symbol: 'Bi', name: 'Bismuth', hindiName: 'बिस्मथ', mass: 208.98, category: 'post-transition', period: 6, group: 15, block: 'p' },
  { number: 84, symbol: 'Po', name: 'Polonium', hindiName: 'पोलोनियम', mass: 209, category: 'post-transition', period: 6, group: 16, block: 'p' },
  { number: 85, symbol: 'At', name: 'Astatine', hindiName: 'एस्टाटीन', mass: 210, category: 'halogen', period: 6, group: 17, block: 'p' },
  { number: 86, symbol: 'Rn', name: 'Radon', hindiName: 'रेडॉन', mass: 222, category: 'noble-gas', period: 6, group: 18, block: 'p' },
  { number: 87, symbol: 'Fr', name: 'Francium', hindiName: 'फ्रांसियम', mass: 223, category: 'alkali-metal', period: 7, group: 1, block: 's' },
  { number: 88, symbol: 'Ra', name: 'Radium', hindiName: 'रेडियम', mass: 226, category: 'alkaline-earth', period: 7, group: 2, block: 's' },
  { number: 89, symbol: 'Ac', name: 'Actinium', hindiName: 'एक्टिनियम', mass: 227, category: 'actinide', period: 7, group: 3, block: 'f' },
  { number: 90, symbol: 'Th', name: 'Thorium', hindiName: 'थोरियम', mass: 232.04, category: 'actinide', period: 7, group: 3, block: 'f' },
  { number: 91, symbol: 'Pa', name: 'Protactinium', hindiName: 'प्रोटेक्टिनियम', mass: 231.04, category: 'actinide', period: 7, group: 3, block: 'f' },
  { number: 92, symbol: 'U', name: 'Uranium', hindiName: 'यूरेनियम', mass: 238.03, category: 'actinide', period: 7, group: 3, block: 'f' },
  { number: 93, symbol: 'Np', name: 'Neptunium', hindiName: 'नेप्च्यूनियम', mass: 237, category: 'actinide', period: 7, group: 3, block: 'f' },
  { number: 94, symbol: 'Pu', name: 'Plutonium', hindiName: 'प्लूटोनियम', mass: 244, category: 'actinide', period: 7, group: 3, block: 'f' },
  { number: 95, symbol: 'Am', name: 'Americium', hindiName: 'अमेरिकियम', mass: 243, category: 'actinide', period: 7, group: 3, block: 'f' },
  { number: 96, symbol: 'Cm', name: 'Curium', hindiName: 'क्यूरियम', mass: 247, category: 'actinide', period: 7, group: 3, block: 'f' },
  { number: 97, symbol: 'Bk', name: 'Berkelium', hindiName: 'बर्केलियम', mass: 247, category: 'actinide', period: 7, group: 3, block: 'f' },
  { number: 98, symbol: 'Cf', name: 'Californium', hindiName: 'कैलिफ़ोर्नियम', mass: 251, category: 'actinide', period: 7, group: 3, block: 'f' },
  { number: 99, symbol: 'Es', name: 'Einsteinium', hindiName: 'आइंस्टीनियम', mass: 252, category: 'actinide', period: 7, group: 3, block: 'f' },
  { number: 100, symbol: 'Fm', name: 'Fermium', hindiName: 'फर्मियम', mass: 257, category: 'actinide', period: 7, group: 3, block: 'f' },
  { number: 101, symbol: 'Md', name: 'Mendelevium', hindiName: 'मेंडेलीवियम', mass: 258, category: 'actinide', period: 7, group: 3, block: 'f' },
  { number: 102, symbol: 'No', name: 'Nobelium', hindiName: 'नोबेलियम', mass: 259, category: 'actinide', period: 7, group: 3, block: 'f' },
  { number: 103, symbol: 'Lr', name: 'Lawrencium', hindiName: 'लॉरेंसियम', mass: 266, category: 'actinide', period: 7, group: 3, block: 'd' },
  { number: 104, symbol: 'Rf', name: 'Rutherfordium', hindiName: 'रदरफोर्डियम', mass: 267, category: 'transition-metal', period: 7, group: 4, block: 'd' },
  { number: 105, symbol: 'Db', name: 'Dubnium', hindiName: 'डब्नियम', mass: 268, category: 'transition-metal', period: 7, group: 5, block: 'd' },
  { number: 106, symbol: 'Sg', name: 'Seaborgium', hindiName: 'सीबोर्गियम', mass: 269, category: 'transition-metal', period: 7, group: 6, block: 'd' },
  { number: 107, symbol: 'Bh', name: 'Bohrium', hindiName: 'बोरियम', mass: 270, category: 'transition-metal', period: 7, group: 7, block: 'd' },
  { number: 108, symbol: 'Hs', name: 'Hassium', hindiName: 'हैसियम', mass: 277, category: 'transition-metal', period: 7, group: 8, block: 'd' },
  { number: 109, symbol: 'Mt', name: 'Meitnerium', hindiName: 'माइटनेरियम', mass: 278, category: 'transition-metal', period: 7, group: 9, block: 'd' },
  { number: 110, symbol: 'Ds', name: 'Darmstadtium', hindiName: 'डार्मस्टैडियम', mass: 281, category: 'transition-metal', period: 7, group: 10, block: 'd' },
  { number: 111, symbol: 'Rg', name: 'Roentgenium', hindiName: 'रॉन्टजेनियम', mass: 282, category: 'transition-metal', period: 7, group: 11, block: 'd' },
  { number: 112, symbol: 'Cn', name: 'Copernicium', hindiName: 'कोपरनिसियम', mass: 285, category: 'transition-metal', period: 7, group: 12, block: 'd' },
  { number: 113, symbol: 'Nh', name: 'Nihonium', hindiName: 'निहोनियम', mass: 286, category: 'post-transition', period: 7, group: 13, block: 'p' },
  { number: 114, symbol: 'Fl', name: 'Flerovium', hindiName: 'फ्लेरोवियम', mass: 289, category: 'post-transition', period: 7, group: 14, block: 'p' },
  { number: 115, symbol: 'Mc', name: 'Moscovium', hindiName: 'मॉस्कोवियम', mass: 290, category: 'post-transition', period: 7, group: 15, block: 'p' },
  { number: 116, symbol: 'Lv', name: 'Livermorium', hindiName: 'लिवरमोरियम', mass: 293, category: 'post-transition', period: 7, group: 16, block: 'p' },
  { number: 117, symbol: 'Ts', name: 'Tennessine', hindiName: 'टेनेसिन', mass: 294, category: 'halogen', period: 7, group: 17, block: 'p' },
  { number: 118, symbol: 'Og', name: 'Oganesson', hindiName: 'ओगनेसन', mass: 294, category: 'noble-gas', period: 7, group: 18, block: 'p' }
];

export const getFullElementData = (atomicNumber: number): ElementData => {
  const found = PERIODIC_TABLE_ELEMENTS.find(e => e.number === atomicNumber);
  if (found) return found;

  const basic = ALL_118_ELEMENTS_SUMMARY.find(e => e.number === atomicNumber);
  if (basic) {
    return {
      number: basic.number,
      symbol: basic.symbol,
      name: basic.name,
      hindiName: basic.hindiName,
      mass: basic.mass,
      category: basic.category,
      period: basic.period,
      group: basic.group,
      block: basic.block,
      state: basic.number > 94 ? 'synthetic' : 'solid',
      electronConfig: `Element #${basic.number} config`,
      shells: [2, 8, 18],
      usesHindi: `${basic.hindiName} (${basic.symbol}) आधुनिक रसायन विज्ञान व अनुसंधान में प्रयुक्त होता है।`,
      usesEnglish: `${basic.name} is studied in advanced chemical & material science research.`,
      examHighlightHindi: `परमाणु क्रमांक: ${basic.number} | आवर्त: ${basic.period} | ब्लॉक: ${basic.block}-ब्लॉक`
    };
  }

  return {
    number: atomicNumber,
    symbol: '?',
    name: 'Unknown',
    hindiName: 'अज्ञात',
    mass: '-',
    category: 'unknown',
    period: 1,
    group: 1,
    block: 's',
    state: 'synthetic',
    electronConfig: '-',
    shells: [1],
    usesHindi: 'अनुसंधान जारी है।',
    usesEnglish: 'Research ongoing.',
  };
};
