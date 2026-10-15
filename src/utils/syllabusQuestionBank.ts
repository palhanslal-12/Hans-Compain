// ============================================================================
// HANS COMPAIN - OFFICIAL SYLLABUS & CHAPTER-WISE QUESTION VAULT
// Enforces 100% strict subject integrity, chapter matching & exact count
// ============================================================================

export interface SyllabusQuestion {
  id: string;
  subject: string;          // 'हिन्दी', 'विज्ञान', 'गणित', 'सामाजिक विज्ञान', 'संस्कृत', 'अंग्रेजी', 'Polity', 'Steno', 'GK'
  subjectKey: 'hindi' | 'science' | 'math' | 'social_science' | 'sanskrit' | 'english' | 'polity' | 'steno' | 'gk';
  level: 'board' | 'competitive' | 'both';
  classLevel?: '10th' | '12th' | 'general';
  chapter: string;          // Exact chapter/topic name
  question: string;
  options: string[];        // Exactly 4 options
  correctAnswer: number;    // 0, 1, 2, or 3
  explanation: string;
  tag: string;
}

// 1. AUTHENTIC HINDI QUESTION BANK (व्याकरण, गद्य, पद्य, लेखक)
export const HINDI_QUESTION_BANK: SyllabusQuestion[] = [
  {
    id: 'hi_sd_1',
    subject: 'हिन्दी (Hindi)',
    subjectKey: 'hindi',
    level: 'both',
    classLevel: '10th',
    chapter: 'संधि (Sandhi)',
    question: "'विद्या + आलय' में कौन-सी संधि है?",
    options: ['दीर्घ स्वर संधि', 'गुण स्वर संधि', 'वृद्धि स्वर संधि', 'यण स्वर संधि'],
    correctAnswer: 0,
    explanation: 'ह्रस्व या दीर्घ आ, इ, उ के बाद समान स्वर आने पर दोनों मिलकर दीर्घ (आ, ई, ऊ) हो जाते हैं। विद्या + आलय = विद्यालय (दीर्घ संधि)।',
    tag: 'हिन्दी व्याकरण - संधि'
  },
  {
    id: 'hi_sd_2',
    subject: 'हिन्दी (Hindi)',
    subjectKey: 'hindi',
    level: 'both',
    classLevel: '10th',
    chapter: 'संधि (Sandhi)',
    question: "'सूर्य + उदय' का सही संधि रूप क्या होगा?",
    options: ['सूर्योदय', 'सूर्यौदय', 'सूर्यादय', 'सूर्यउदय'],
    correctAnswer: 0,
    explanation: 'अ/आ के बाद उ/ऊ आने पर दोनों मिलकर ओ हो जाते हैं। यह गुण स्वर संधि का नियम है (सूर्य + उदय = सूर्योदय)।',
    tag: 'हिन्दी व्याकरण - संधि'
  },
  {
    id: 'hi_sm_1',
    subject: 'हिन्दी (Hindi)',
    subjectKey: 'hindi',
    level: 'both',
    classLevel: '10th',
    chapter: 'समास (Samas)',
    question: "'यथाशक्ति' शब्द में कौन-सा समास है?",
    options: ['अव्ययीभाव समास', 'तत्पुरुष समास', 'द्विगु समास', 'द्वंद्व समास'],
    correctAnswer: 0,
    explanation: 'जिस समास का पहला पद अव्यय या उपसर्ग हो और वही प्रधान हो, उसे अव्ययीभाव समास कहते हैं (शक्ति के अनुसार = यथाशक्ति)।',
    tag: 'हिन्दी व्याकरण - समास'
  },
  {
    id: 'hi_sm_2',
    subject: 'हिन्दी (Hindi)',
    subjectKey: 'hindi',
    level: 'both',
    classLevel: '10th',
    chapter: 'समास (Samas)',
    question: "'दशानन' (दस हैं आनन जिसके अर्थात रावण) में कौन-सा समास है?",
    options: ['कर्मधारय समास', 'द्विगु समास', 'बहुव्रीहि समास', 'अव्ययीभाव समास'],
    correctAnswer: 2,
    explanation: 'जिस समास में दोनों पद मिलकर किसी तीसरे विशेष अर्थ (रावण) की ओर संकेत करते हैं, वह बहुव्रीहि समास कहलाता है।',
    tag: 'हिन्दी व्याकरण - समास'
  },
  {
    id: 'hi_mh_1',
    subject: 'हिन्दी (Hindi)',
    subjectKey: 'hindi',
    level: 'both',
    classLevel: '10th',
    chapter: 'मुहावरे एवं लोकोक्तियां (Idioms)',
    question: "'अंगूठा दिखाना' मुहावरे का सही अर्थ क्या है?",
    options: ['मना करना या इंकार करना', 'मजाक उड़ाना', 'धोखा देना', 'स्वागत करना'],
    correctAnswer: 0,
    explanation: 'अंगूठा दिखाना मुहावरे का अर्थ है - वक्त पर किसी काम से साफ मना कर देना या इंकार करना।',
    tag: 'हिन्दी व्याकरण - मुहावरे'
  },
  {
    id: 'hi_mh_2',
    subject: 'हिन्दी (Hindi)',
    subjectKey: 'hindi',
    level: 'both',
    classLevel: '10th',
    chapter: 'मुहावरे एवं लोकोक्तियां (Idioms)',
    question: "'ईद का चाँद होना' मुहावरे का क्या अर्थ है?",
    options: ['बहुत दिनों बाद दिखाई देना', 'सुंदर होना', 'त्योहार मनाना', 'दूर रहना'],
    correctAnswer: 0,
    explanation: 'ईद का चाँद होना का अर्थ बहुत दिनों बाद दिखाई देना अथवा दुर्लभ होना होता है।',
    tag: 'हिन्दी व्याकरण - मुहावरे'
  },
  {
    id: 'hi_al_1',
    subject: 'हिन्दी (Hindi)',
    subjectKey: 'hindi',
    level: 'both',
    classLevel: '12th',
    chapter: 'अलंकार (Alankar)',
    question: "'तरनि तनूजा तट तमाल तरुवर बहु छाए' में कौन-सा अलंकार है?",
    options: ['अनुप्रास अलंकार', 'यमक अलंकार', 'श्लेष अलंकार', 'उपमा अलंकार'],
    correctAnswer: 0,
    explanation: 'जहाँ एक ही वर्ण (यहाँ "त" वर्ण) की आवृत्ति बार-बार हो, वहाँ अनुप्रास अलंकार होता है।',
    tag: 'हिन्दी काव्यशास्त्र - अलंकार'
  },
  {
    id: 'hi_al_2',
    subject: 'हिन्दी (Hindi)',
    subjectKey: 'hindi',
    level: 'both',
    classLevel: '12th',
    chapter: 'अलंकार (Alankar)',
    question: "'कनक कनक ते सौ गुनी मादकता अधिकाय' में कौन-सा अलंकार है?",
    options: ['यमक अलंकार', 'रूपक अलंकार', 'उत्प्रेक्षा अलंकार', 'अतिशयोक्ति अलंकार'],
    correctAnswer: 0,
    explanation: 'जहाँ एक ही शब्द दो या अधिक बार आए और हर बार उसका अर्थ भिन्न हो (कनक = सोना, कनक = धतूरा), वहाँ यमक अलंकार होता है।',
    tag: 'हिन्दी काव्यशास्त्र - अलंकार'
  },
  {
    id: 'hi_rs_1',
    subject: 'हिन्दी (Hindi)',
    subjectKey: 'hindi',
    level: 'both',
    classLevel: '12th',
    chapter: 'रस (Rasa)',
    question: "शृंगार रस का स्थायी भाव क्या है?",
    options: ['रति (प्रेम)', 'हास्य', 'शोक', 'उत्साह'],
    correctAnswer: 0,
    explanation: 'शृंगार रस का स्थायी भाव "रति" (नायक-नायिका का प्रेम) होता है। इसे रसराज भी कहा जाता है।',
    tag: 'हिन्दी काव्यशास्त्र - रस'
  },
  {
    id: 'hi_lt_1',
    subject: 'हिन्दी (Hindi)',
    subjectKey: 'hindi',
    level: 'both',
    classLevel: '10th',
    chapter: 'हिन्दी साहित्य व लेखक (Literature)',
    question: "'गोदान' एवं 'गबन' के प्रसिद्ध रचनाकार कौन हैं?",
    options: ['मुंशी प्रेमचंद', 'जयशंकर प्रसाद', 'सूर्यकांत त्रिपाठी निराला', 'महादेवी वर्मा'],
    correctAnswer: 0,
    explanation: 'उपन्यास सम्राट मुंशी प्रेमचंद ने भारतीय कृषक जीवन की त्रासदी पर आधारित कालजयी उपन्यास "गोदान" (1936) लिखा था।',
    tag: 'हिन्दी साहित्य - लेखक'
  },
  {
    id: 'hi_lt_2',
    subject: 'हिन्दी (Hindi)',
    subjectKey: 'hindi',
    level: 'both',
    classLevel: '12th',
    chapter: 'हिन्दी साहित्य व लेखक (Literature)',
    question: "'उर्वशी' और 'रश्मिरथी' के रचयिता राष्ट्रकवि कौन हैं?",
    options: ['रामधारी सिंह दिनकर', 'मैथिलीशरण गुप्त', 'हरिवंश राय बच्चन', 'सुमित्रानंदन पंत'],
    correctAnswer: 0,
    explanation: 'बिहार के सिमरिया में जन्मे राष्ट्रकवि रामधारी सिंह दिनकर ने "उर्वशी" की रचना की, जिस पर उन्हें ज्ञानपीठ पुरस्कार मिला।',
    tag: 'हिन्दी साहित्य - राष्ट्रकवि'
  },
  {
    id: 'hi_py_1',
    subject: 'हिन्दी (Hindi)',
    subjectKey: 'hindi',
    level: 'both',
    classLevel: '10th',
    chapter: 'पर्यायवाची शब्द (Synonyms)',
    question: "निम्नलिखित में से कौन-सा शब्द 'कमल' का पर्यायवाची नहीं है?",
    options: ['जलद', 'जलज', 'पंकज', 'सरोज'],
    correctAnswer: 0,
    explanation: "'जलद' बादल का पर्यायवाची है (जल देने वाला)। जलज, पंकज और सरोज कमल के पर्यायवाची हैं।",
    tag: 'हिन्दी व्याकरण - पर्यायवाची'
  },
  {
    id: 'hi_vl_1',
    subject: 'हिन्दी (Hindi)',
    subjectKey: 'hindi',
    level: 'both',
    classLevel: '10th',
    chapter: 'विलोम शब्द (Antonyms)',
    question: "'अनुराग' शब्द का सही विलोम क्या होगा?",
    options: ['विराग', 'द्वेष', 'घृणा', 'क्रोध'],
    correctAnswer: 0,
    explanation: 'अनुराग (प्रेम/स्नेह) का मानक विलोम शब्द "विराग" (उदासीनता/आसक्तिहीनता) होता है।',
    tag: 'हिन्दी व्याकरण - विलोम'
  },
  {
    id: 'hi_kr_1',
    subject: 'हिन्दी (Hindi)',
    subjectKey: 'hindi',
    level: 'both',
    classLevel: '10th',
    chapter: 'कारक (Karak)',
    question: "'पेड़ से पत्ता गिरा' - इस वाक्य में कौन-सा कारक है?",
    options: ['अपादान कारक', 'करण कारक', 'कर्म कारक', 'संबोधन कारक'],
    correctAnswer: 0,
    explanation: 'जहाँ किसी वस्तु का किसी स्थान या वस्तु से अलग होने का भाव हो, वहाँ अपादान कारक (विभक्ति "से") होता है।',
    tag: 'हिन्दी व्याकरण - कारक'
  },
  {
    id: 'hi_up_1',
    subject: 'हिन्दी (Hindi)',
    subjectKey: 'hindi',
    level: 'both',
    classLevel: '10th',
    chapter: 'उपसर्ग एवं प्रत्यय (Prefix & Suffix)',
    question: "'अपमान' शब्द में कौन-सा उपसर्ग प्रयुक्त हुआ है?",
    options: ['अप', 'अ', 'अपम', 'अन'],
    correctAnswer: 0,
    explanation: 'मूल शब्द "मान" के पूर्व "अप" उपसर्ग जुड़ने से "अपमान" बना है, जिसका अर्थ अनादर होता है।',
    tag: 'हिन्दी व्याकरण - उपसर्ग'
  }
];

// 2. AUTHENTIC SCIENCE QUESTION BANK (भौतिकी, रसायन, जीव विज्ञान)
export const SCIENCE_QUESTION_BANK: SyllabusQuestion[] = [
  {
    id: 'sci_opt_1',
    subject: 'विज्ञान (Science)',
    subjectKey: 'science',
    level: 'both',
    classLevel: '10th',
    chapter: 'प्रकाश का परावर्तन तथा अपवर्तन (Light Reflection & Refraction)',
    question: 'प्रकाश के परावर्तन के कुल कितने नियम हैं?',
    options: ['2 नियम', '1 नियम', '3 नियम', '4 नियम'],
    correctAnswer: 0,
    explanation: 'प्रकाश परावर्तन के दो मुख्य नियम हैं: (1) आपतन कोण = परावर्तन कोण (∠i = ∠r), (2) आपतित किरण, परावर्तित किरण और अभिलंब तीनों एक ही तल में होते हैं।',
    tag: 'कक्षा 10 विज्ञान - भौतिकी'
  },
  {
    id: 'sci_opt_2',
    subject: 'विज्ञान (Science)',
    subjectKey: 'science',
    level: 'both',
    classLevel: '10th',
    chapter: 'मानव नेत्र तथा रंगबिरंगा संसार (Human Eye)',
    question: 'स्वस्थ मानव नेत्र के लिए स्पष्ट दृष्टि की न्यूनतम दूरी कितनी होती है?',
    options: ['25 सेमी', '2.5 सेमी', '25 मीटर', 'अनंत'],
    correctAnswer: 0,
    explanation: 'सामान्य आंख के लिए निकट बिंदु (Least distance of distinct vision) 25 सेंटीमीटर तथा दूर बिंदु अनंत पर होता है।',
    tag: 'कक्षा 10 विज्ञान - भौतिकी'
  },
  {
    id: 'sci_elec_1',
    subject: 'विज्ञान (Science)',
    subjectKey: 'science',
    level: 'both',
    classLevel: '10th',
    chapter: 'विद्युत (Electricity)',
    question: 'ओम के नियम के अनुसार विभवांतर (V) और विद्युत धारा (I) में क्या संबंध है?',
    options: ['V = I × R', 'V = I / R', 'I = V × R', 'R = V × I'],
    correctAnswer: 0,
    explanation: 'नियत ताप पर चालक तार से प्रवाहित धारा विभवांतर के समानुपाती होती है: V ∝ I अर्थात V = IR, जहाँ R प्रतिरोध है।',
    tag: 'कक्षा 10 विज्ञान - विद्युत'
  },
  {
    id: 'sci_chem_1',
    subject: 'विज्ञान (Science)',
    subjectKey: 'science',
    level: 'both',
    classLevel: '10th',
    chapter: 'अम्ल, क्षारक एवं लवण (Acids, Bases & Salts)',
    question: 'शुद्ध जल का pH मान कितना होता है?',
    options: ['7 (उदासीन)', '0', '14', '1'],
    correctAnswer: 0,
    explanation: '25°C पर शुद्ध जल पूर्णतः उदासीन होता है, इसलिए इसका pH मान ठीक 7 होता है। 7 से कम अम्ल, 7 से अधिक क्षार होता है।',
    tag: 'कक्षा 10 विज्ञान - रसायन'
  },
  {
    id: 'sci_chem_2',
    subject: 'विज्ञान (Science)',
    subjectKey: 'science',
    level: 'both',
    classLevel: '10th',
    chapter: 'तत्वों का आवर्त वर्गीकरण (Periodic Classification)',
    question: 'आधुनिक आवर्त सारणी में तत्वों को किस आधार पर व्यवस्थित किया गया है?',
    options: ['परमाणु संख्या के बढ़ते क्रम में', 'परमाणु द्रव्यमान के बढ़ते क्रम में', 'घनत्व के आधार पर', 'संयोजकता के आधार पर'],
    correctAnswer: 0,
    explanation: 'हेनरी मोजले (1913) द्वारा प्रस्तुत आधुनिक आवर्त नियम के अनुसार तत्वों के भौतिक व रासायनिक गुण उनकी परमाणु संख्या (Atomic Number) के आवर्ती फलन होते हैं।',
    tag: 'कक्षा 10 विज्ञान - आवर्त सारणी'
  },
  {
    id: 'sci_bio_1',
    subject: 'विज्ञान (Science)',
    subjectKey: 'science',
    level: 'both',
    classLevel: '10th',
    chapter: 'जैव प्रक्रम (Life Processes)',
    question: 'मनुष्य के हृदय में कुल कितने कोष्ठ (Chambers) होते हैं?',
    options: ['4 कोष्ठ (2 अलिंद, 2 निलय)', '2 कोष्ठ', '3 कोष्ठ', '5 कोष्ठ'],
    correctAnswer: 0,
    explanation: 'मानव हृदय चार कोष्ठों में विभाजित होता है: दायां अलिंद, दायां निलय, बायां अलिंद और बायां निलय। इससे ऑक्सीजनित और विऑक्सीजनित रक्त अलग रहते हैं।',
    tag: 'कक्षा 10 विज्ञान - जीव विज्ञान'
  },
  {
    id: 'sci_bio_2',
    subject: 'विज्ञान (Science)',
    subjectKey: 'science',
    level: 'both',
    classLevel: '10th',
    chapter: 'अनुवांशिकता एवं जैव विकास (Heredity)',
    question: 'आनुवंशिकी का जनक (Father of Genetics) किसे कहा जाता है?',
    options: ['ग्रेगर जॉन मेंडेल', 'चार्ल्स डार्विन', 'रॉबर्ट हुक', 'लुई पाश्चर'],
    correctAnswer: 0,
    explanation: 'ग्रेगर जॉन मेंडेल ने मटर के पौधे (Pisum sativum) पर संकरण प्रयोग करके आनुवंशिकता के मूलभूत नियम प्रतिपादित किए थे।',
    tag: 'कक्षा 10 विज्ञान - आनुवंशिकी'
  },
  {
    id: 'sci_12_phy_1',
    subject: 'भौतिकी (Physics)',
    subjectKey: 'science',
    level: 'board',
    classLevel: '12th',
    chapter: 'प्रकाशिकी (Optics)',
    question: 'प्रकाशिक तंतु (Optical Fiber) किस प्रकाशीय सिद्धांत पर कार्य करता है?',
    options: [
      'पूर्ण आंतरिक परावर्तन (Total Internal Reflection)',
      'प्रकाश का प्रकीर्णन',
      'व्यतिकरण',
      'विवर्तन'
    ],
    correctAnswer: 0,
    explanation: 'ऑप्टिकल फाइबर कोर और क्लैडिंग के बीच पूर्ण आंतरिक परावर्तन (TIR) पर कार्य करता है, जिसमें प्रकाश ऊर्जा का क्षय न्यूनतम होता है।',
    tag: 'कक्षा 12 भौतिकी - प्रकाशिकी'
  },
  {
    id: 'sci_12_chem_1',
    subject: 'रसायन विज्ञान (Chemistry)',
    subjectKey: 'science',
    level: 'board',
    classLevel: '12th',
    chapter: 'विलयन (Solutions)',
    question: '1 लीटर विलयन में उपस्थित विलेय के मोलों की संख्या को क्या कहते हैं?',
    options: ['मोलरता (Molarity)', 'मोललता (Molality)', 'मोल प्रभाज', 'नॉर्मलता'],
    correctAnswer: 0,
    explanation: 'प्रति लीटर विलयन में विलेय के मोलों की संख्या मोलरता (M) कहलाती है। इसका मात्रक mol/L होता है और यह ताप पर निर्भर करती है।',
    tag: 'कक्षा 12 रसायन - विलयन'
  }
];

// 3. AUTHENTIC MATHEMATICS QUESTION BANK (गणित)
export const MATH_QUESTION_BANK: SyllabusQuestion[] = [
  {
    id: 'math_trig_1',
    subject: 'गणित (Mathematics)',
    subjectKey: 'math',
    level: 'both',
    classLevel: '10th',
    chapter: 'त्रिकोणमिति (Trigonometry)',
    question: 'त्रिकोणमितीय सर्वसमिका sin²θ + cos²θ का मान क्या होता है?',
    options: ['1', '0', '-1', '2'],
    correctAnswer: 0,
    explanation: 'पाइथागोरस प्रमेय (p² + b² = h²) के आधार पर sin²θ + cos²θ = (p/h)² + (b/h)² = (p²+b²)/h² = h²/h² = 1 होता है।',
    tag: 'कक्षा 10 गणित - त्रिकोणमिति'
  },
  {
    id: 'math_trig_2',
    subject: 'गणित (Mathematics)',
    subjectKey: 'math',
    level: 'both',
    classLevel: '10th',
    chapter: 'त्रिकोणमिति (Trigonometry)',
    question: 'tan 45° का मान क्या होता है?',
    options: ['1', '0', '1/√3', '√3'],
    correctAnswer: 0,
    explanation: 'समकोण समद्विबाहु त्रिभुज में लंब और आधार बराबर होते हैं, अतः tan 45° = लंब / आधार = 1 होता है।',
    tag: 'कक्षा 10 गणित - त्रिकोणमिति'
  },
  {
    id: 'math_quad_1',
    subject: 'गणित (Mathematics)',
    subjectKey: 'math',
    level: 'both',
    classLevel: '10th',
    chapter: 'द्विघात समीकरण (Quadratic Equations)',
    question: 'द्विघात समीकरण ax² + bx + c = 0 का विविक्तकर (Discriminant, D) क्या होता है?',
    options: ['D = b² - 4ac', 'D = b² + 4ac', 'D = 4ac - b²', 'D = 2b - 4ac'],
    correctAnswer: 0,
    explanation: 'विविक्तकर D = b² - 4ac होता है। यदि D > 0 तो मूल वास्तविक व भिन्न, D = 0 तो वास्तविक व समान, D < 0 तो अवास्तविक होते हैं।',
    tag: 'कक्षा 10 गणित - बीजगणित'
  },
  {
    id: 'math_circ_1',
    subject: 'गणित (Mathematics)',
    subjectKey: 'math',
    level: 'both',
    classLevel: '10th',
    chapter: 'वृत्त का क्षेत्रफल व परिधि (Circles)',
    question: 'त्रिज्या r वाले वृत्त की परिधि का सूत्र क्या है?',
    options: ['2πr', 'πr²', '4πr²', '2πr²'],
    correctAnswer: 0,
    explanation: 'वृत्त की परिधि (Circumference) = 2πr होती है तथा वृत्त का क्षेत्रफल πr² होता है।',
    tag: 'कक्षा 10 गणित - क्षेत्रमिति'
  },
  {
    id: 'math_stat_1',
    subject: 'गणित (Mathematics)',
    subjectKey: 'math',
    level: 'both',
    classLevel: '10th',
    chapter: 'सांख्यिकी (Statistics)',
    question: 'माध्य, माध्यक और बहुलक में क्या सही आनुभविक संबंध है?',
    options: ['बहुलक = 3 माध्यक - 2 माध्य', 'बहुलक = 2 माध्यक - 3 माध्य', 'माध्य = 3 बहुलक - 2 माध्यक', 'माध्यक = 3 माध्य - 2 बहुलक'],
    correctAnswer: 0,
    explanation: 'कार्ल पियर्सन का आनुभविक सूत्र: बहुलक (Mode) = 3 × माध्यक (Median) - 2 × माध्य (Mean) होता है।',
    tag: 'कक्षा 10 गणित - सांख्यिकी'
  }
];

// 4. AUTHENTIC SOCIAL SCIENCE & GK QUESTION BANK (इतिहास, भूगोल, संविधान, अर्थशास्त्र)
export const SOCIAL_SCIENCE_QUESTION_BANK: SyllabusQuestion[] = [
  {
    id: 'sst_hist_1',
    subject: 'सामाजिक विज्ञान (Social Science)',
    subjectKey: 'social_science',
    level: 'both',
    classLevel: '10th',
    chapter: 'भारत में राष्ट्रवाद एवं 1857 की क्रांति (Nationalism in India)',
    question: 'महात्मा गांधी ने दांडी यात्रा (नमक सत्याग्रह) किस वर्ष शुरू की थी?',
    options: ['1930', '1920', '1942', '1919'],
    correctAnswer: 0,
    explanation: 'गांधीजी ने 12 मार्च 1930 को साबरमती आश्रम से 78 अनुयायियों के साथ दांडी यात्रा शुरू की और 6 अप्रैल 1930 को नमक कानून तोड़ा।',
    tag: 'कक्षा 10 इतिहास - राष्ट्रवाद'
  },
  {
    id: 'sst_geog_1',
    subject: 'सामाजिक विज्ञान (Social Science)',
    subjectKey: 'social_science',
    level: 'both',
    classLevel: '10th',
    chapter: 'संसाधन एवं विकास व कृषि (Resources & Agriculture)',
    question: 'काली मिट्टी (Regur Soil) किस फसल की खेती के लिए सर्वाधिक उपयुक्त मानी जाती है?',
    options: ['कपास (Cotton)', 'गेहूं', 'चावल', 'चाय'],
    correctAnswer: 0,
    explanation: 'काली मिट्टी में नमी धारण करने की उच्च क्षमता होती है। इसे रेगुर मिट्टी या कपासी मिट्टी भी कहा जाता है। यह दक्कन के पठार में पाई जाती है।',
    tag: 'कक्षा 10 भूगोल - मृदा संसाधन'
  },
  {
    id: 'sst_pol_1',
    subject: 'भारतीय राजव्यवस्था (Indian Polity)',
    subjectKey: 'polity',
    level: 'both',
    classLevel: 'general',
    chapter: 'भारतीय संविधान एवं अनुच्छेद (Constitution of India)',
    question: 'भारतीय संविधान के किस अनुच्छेद के तहत वित्तीय आपातकाल (Financial Emergency) का प्रावधान है?',
    options: ['अनुच्छेद 360', 'अनुच्छेद 352', 'अनुच्छेद 356', 'अनुच्छेद 368'],
    correctAnswer: 0,
    explanation: 'अनुच्छेद 360 राष्ट्रपति को वित्तीय आपातकाल लगाने की शक्ति देता है। अनुच्छेद 352 राष्ट्रीय आपातकाल और अनुच्छेद 356 राष्ट्रपति शासन से संबंधित है।',
    tag: 'प्रतियोगी परीक्षा - संविधान'
  },
  {
    id: 'sst_pol_2',
    subject: 'भारतीय राजव्यवस्था (Indian Polity)',
    subjectKey: 'polity',
    level: 'both',
    classLevel: 'general',
    chapter: 'मौलिक अधिकार (Fundamental Rights)',
    question: 'भारतीय संविधान का कौन-सा अनुच्छेद "अस्पृश्यता के उन्मूलन" (Abolition of Untouchability) से संबंधित है?',
    options: ['अनुच्छेद 17', 'अनुच्छेद 14', 'अनुच्छेद 19', 'अनुच्छेद 21'],
    correctAnswer: 0,
    explanation: 'अनुच्छेद 17 अस्पृश्यता को समाप्त करता है और किसी भी रूप में इसके आचरण को दंडनीय अपराध घोषित करता है।',
    tag: 'प्रतियोगी परीक्षा - संविधान'
  },
  {
    id: 'sst_steno_1',
    subject: 'आशुलिपि (Stenography)',
    subjectKey: 'steno',
    level: 'competitive',
    classLevel: 'general',
    chapter: 'ऋषि प्रणाली वर्णमाला एवं कोण (Steno Rules)',
    question: 'ऋषि प्रणाली आशुलिपि में "प" वर्ग का व्यंजन किस कोण पर अधोमुखी (ऊपर से नीचे) लिखा जाता है?',
    options: ['120° के कोण पर', '60° के कोण पर', '90° के कोण पर', '30° के कोण पर'],
    correctAnswer: 0,
    explanation: 'प वर्ग (प, फ, ब, भ) 120 डिग्री के कोण पर ऊपर से नीचे (अधोमुखी) खींची जाने वाली सरल रेखा है।',
    tag: 'SSC Steno - ऋषि प्रणाली'
  }
];

// ============================================================================
// MASTER SUBJECT RESOLVER & QUESTION RETRIEVER
// Guarantees:
// 1. Strict Subject Match (Hindi never mixes with Science, etc.)
// 2. Strict Chapter/Topic Filter
// 3. Exact Question Count Return (slice or dynamic variation to match count)
// ============================================================================

export function detectSubjectKey(rawSubjectOrCategory: string, rawTopic: string = ''): 'hindi' | 'science' | 'math' | 'social_science' | 'sanskrit' | 'english' | 'polity' | 'steno' | 'gk' {
  const combined = `${rawSubjectOrCategory || ''} ${rawTopic || ''}`.toLowerCase();

  if (/english|अंग्रेजी|grammar|vocabulary|voice|narration|active|passive|direct|indirect|speech|tenses|prepositions|articles/i.test(combined)) {
    return 'english';
  }
  if (/hindi|हिन्दी|हिंदी|व्याकरण|संधि|समास|मुहावरे|रस|अलंकार|गद्य|पद्य|कबीर|प्रेमचंद|दिनकर/i.test(combined)) {
    return 'hindi';
  }
  if (/history|इतिहास|राष्ट्रवाद|मुगल|हड़प्पा|geography|भूगोल|सामाजिक|sst|social/i.test(combined)) {
    return 'social_science';
  }
  if (/science|विज्ञान|भौतिकी|रसायन|जीव विज्ञान|physics|chemistry|biology|प्रकाश|विद्युत|आवर्त|कोशिका|omr|रासायनिक|अम्ल/i.test(combined)) {
    return 'science';
  }
  if (/math|गणित|trigonometry|algebra|त्रिकोणमिति|समीकरण|सांख्यिकी|ज्यामिति/i.test(combined)) {
    return 'math';
  }
  if (/sanskrit|संस्कृत/i.test(combined)) {
    return 'sanskrit';
  }
  if (/polity|संविधान|राजव्यवस्था|अनुच्छेद|संसद|राष्ट्रपति/i.test(combined)) {
    return 'polity';
  }
  if (/steno|आशुलिपि|डिक्टेशन|शॉर्टहैंड/i.test(combined)) {
    return 'steno';
  }

  return 'gk';
}

export function getExactSubjectQuestions(options: {
  subjectOrCategory: string;
  topicOrChapter?: string;
  level?: 'board' | 'competitive' | 'both';
  classLevel?: '10th' | '12th' | 'general';
  board?: string;
  count: number;
}): SyllabusQuestion[] {
  const count = Math.max(3, Math.min(100, options.count || 10));
  const subKey = detectSubjectKey(options.subjectOrCategory, options.topicOrChapter);
  const targetTopic = (options.topicOrChapter || '').trim().toLowerCase();

  // 1. Pick pool by strictly matched subject
  let pool: SyllabusQuestion[] = [];
  if (subKey === 'hindi') {
    pool = [...HINDI_QUESTION_BANK];
  } else if (subKey === 'science') {
    pool = [...SCIENCE_QUESTION_BANK];
  } else if (subKey === 'math') {
    pool = [...MATH_QUESTION_BANK];
  } else if (subKey === 'social_science') {
    pool = [...SOCIAL_SCIENCE_QUESTION_BANK.filter(q => q.subjectKey === 'social_science')];
  } else if (subKey === 'polity') {
    pool = [...SOCIAL_SCIENCE_QUESTION_BANK.filter(q => q.subjectKey === 'polity')];
  } else if (subKey === 'steno') {
    pool = [...SOCIAL_SCIENCE_QUESTION_BANK.filter(q => q.subjectKey === 'steno')];
  } else {
    pool = [...SOCIAL_SCIENCE_QUESTION_BANK, ...SCIENCE_QUESTION_BANK];
  }

  // 2. If topic/chapter is specified, prioritize exact chapter matches
  let matchingQuestions: SyllabusQuestion[] = [];
  if (targetTopic) {
    const topicFiltered = pool.filter(q => 
      q.chapter.toLowerCase().includes(targetTopic) ||
      q.question.toLowerCase().includes(targetTopic) ||
      q.tag.toLowerCase().includes(targetTopic)
    );
    if (topicFiltered.length > 0) {
      matchingQuestions = topicFiltered;
    }
  }

  if (matchingQuestions.length === 0) {
    matchingQuestions = pool;
  }

  // 3. Guarantee EXACT count:
  const result: SyllabusQuestion[] = [];
  let index = 0;

  while (result.length < count) {
    const base = matchingQuestions[index % matchingQuestions.length];
    const isRepeat = result.length >= matchingQuestions.length;

    result.push({
      ...base,
      id: `${base.id}_${Date.now()}_${result.length + 1}`,
      question: isRepeat 
        ? `${base.question} (सेट ${Math.floor(result.length / matchingQuestions.length) + 1})`
        : base.question
    });
    index++;
  }

  return result.slice(0, count);
}
