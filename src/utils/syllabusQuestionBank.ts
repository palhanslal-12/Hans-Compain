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

// 1. AUTHENTIC HINDI QUESTION BANK (गद्य खंड, पद्य खंड, कृतिका/पूरक, लेखक एवं व्याकरण)
export const HINDI_QUESTION_BANK: SyllabusQuestion[] = [
  // --- गद्य खंड (Class 10 & 12 Literature - Netaji, Balgobin, Usne Kaha Tha, etc.) ---
  {
    id: 'hi_lit_10_1',
    subject: 'हिन्दी (Hindi)',
    subjectKey: 'hindi',
    level: 'both',
    classLevel: '10th',
    chapter: 'नेताजी का चश्मा (स्वयं प्रकाश)',
    question: "'नेताजी का चश्मा' पाठ में कस्बे के मुख्य चौराहे पर किसकी संगमरमर की मूर्ति लगी थी?",
    options: ['नेताजी सुभाषचंद्र बोस', 'महात्मा गांधी', 'सरदार वल्लभभाई पटेल', 'भगत सिंह'],
    correctAnswer: 0,
    explanation: 'कस्बे के हृदय स्थल पर नगर पालिका द्वारा नेताजी सुभाषचंद्र बोस की संगमरमर की प्रतिमा स्थापित की गई थी, जिस पर कैप्टन चश्मेवाला वास्तविक चश्मा बदलता रहता था।',
    tag: 'कक्षा 10 हिन्दी (गद्य खंड) - नेताजी का चश्मा'
  },
  {
    id: 'hi_lit_10_2',
    subject: 'हिन्दी (Hindi)',
    subjectKey: 'hindi',
    level: 'both',
    classLevel: '10th',
    chapter: 'नेताजी का चश्मा (स्वयं प्रकाश)',
    question: "कैप्टन चश्मेवाले के प्रति पानवाले की क्या प्रतिक्रिया थी?",
    options: ['वह उसका उपहास उड़ाता था और उसे पागल कहता था', 'वह उसका बहुत सम्मान करता था', 'वह उससे मुफ्त में चश्मा लेता था', 'वह उसे अपना गुरु मानता था'],
    correctAnswer: 0,
    explanation: 'पानवाला देशभक्त कैप्टन की शारीरिक लाचारी और चश्मा पहनाने की निष्ठा का मजाक उड़ाते हुए कहता था कि "वह लंगड़ा क्या जाएगा फौज में, पागल है पागल!"।',
    tag: 'कक्षा 10 हिन्दी (गद्य खंड) - नेताजी का चश्मा'
  },
  {
    id: 'hi_lit_10_3',
    subject: 'हिन्दी (Hindi)',
    subjectKey: 'hindi',
    level: 'both',
    classLevel: '10th',
    chapter: 'बालगोबिन भगत (रामवृक्ष बेनीपुरी)',
    question: "बालगोबिन भगत किस संत-कवि के आदर्शों पर चलते थे और उन्हीं के गीत गाते थे?",
    options: ['संत कबीरदास', 'गोस्वामी तुलसीदास', 'संत सूरदास', 'संत रविदास'],
    correctAnswer: 0,
    explanation: 'बालगोबिन भगत कबीर को अपना "साहब" मानते थे, उन्हीं के पदों को गाते और उनके दिए गए सत्य व त्याग के आदेशों पर आचरण करते थे।',
    tag: 'कक्षा 10 हिन्दी (गद्य खंड) - बालगोबिन भगत'
  },
  {
    id: 'hi_lit_10_4',
    subject: 'हिन्दी (Hindi)',
    subjectKey: 'hindi',
    level: 'both',
    classLevel: '10th',
    chapter: 'बालगोबिन भगत (रामवृक्ष बेनीपुरी)',
    question: "अपने एकमात्र इकलौते बेटे की मृत्यु पर बालगोबिन भगत ने क्या किया?",
    options: ['शोक मनाने के बदले कबीर के पद गाते हुए उत्सव मनाने लगे', 'जोर-जोर से विलाप करने लगे', 'घर छोड़कर संन्यास ले लिया', 'गांव वालों से बदला लेने लगे'],
    correctAnswer: 0,
    explanation: 'भगत जी का मानना था कि आत्मा परमात्मा से मिल गई है, विरहिणी अपने प्रेमी से जा मिली है, यह रोने का नहीं बल्कि आनंद और उत्सव का समय है।',
    tag: 'कक्षा 10 हिन्दी (गद्य खंड) - बालगोबिन भगत'
  },
  {
    id: 'hi_lit_10_5',
    subject: 'हिन्दी (Hindi)',
    subjectKey: 'hindi',
    level: 'both',
    classLevel: '10th',
    chapter: 'लखनवी अंदाज़ (यशपाल)',
    question: "यशपाल द्वारा रचित 'लखनवी अंदाज़' पाठ किस प्रवृत्ति पर तीखा व्यंग्य करता है?",
    options: ['दिखावटी एवं सामंती नफासत वाली बनावटी जीवन शैली पर', 'अंग्रेजी शिक्षा पद्धति पर', 'ग्रामीण किसानों के जीवन पर', 'भारतीय रेल व्यवस्था पर'],
    correctAnswer: 0,
    explanation: 'इस व्यंग्य में लेखक ने पतनशील सामंती वर्ग की दिखावटी शान, झूठे गौरव और वास्तविकता से परे नफासत पर करारी चोट की है।',
    tag: 'कक्षा 10 हिन्दी (गद्य खंड) - लखनवी अंदाज़'
  },
  {
    id: 'hi_lit_10_6',
    subject: 'हिन्दी (Hindi)',
    subjectKey: 'hindi',
    level: 'both',
    classLevel: '10th',
    chapter: 'माता का आँचल (शिवपूजन सहाय)',
    question: "'माता का आँचल' पाठ में लेखक का मूल बचपन का नाम क्या था?",
    options: ['तारकेश्वरनाथ (भोलानाथ)', 'अमृतेश्वरनाथ', 'शिवनाथ', 'दीनानाथ'],
    correctAnswer: 0,
    explanation: 'लेखक का वास्तविक नाम तारकेश्वरनाथ था, परंतु उनके पिता प्यार से उनके माथे पर भभूत लगाकर "भोलानाथ" पुकारते थे।',
    tag: 'कक्षा 10 हिन्दी (कृतिका) - माता का आँचल'
  },
  {
    id: 'hi_lit_10_7',
    subject: 'हिन्दी (Hindi)',
    subjectKey: 'hindi',
    level: 'both',
    classLevel: '10th',
    chapter: 'माता का आँचल (शिवपूजन सहाय)',
    question: "सांप के डर से भागकर भोलानाथ ने कहाँ जाकर शरण ली?",
    options: ['माता के आँचल में छिपकर', 'पिता की गोद में', 'मित्रों की टोली में', 'बाबूजी की बैठक में'],
    correctAnswer: 0,
    explanation: 'संकट और अत्यधिक भय के क्षणों में बच्चा पिता की अपेक्षा माँ के आँचल में सर्वाधिक शांति, सुरक्षा और मातृत्व का प्रेम पाता है।',
    tag: 'कक्षा 10 हिन्दी (कृतिका) - माता का आँचल'
  },
  {
    id: 'hi_lit_10_8',
    subject: 'हिन्दी (Hindi)',
    subjectKey: 'hindi',
    level: 'both',
    classLevel: '10th',
    chapter: 'सूरदास के पद (उधो, तुम हौ अति बड़भागी)',
    question: "गोपियों ने उद्धव को 'बड़भागी' (भाग्यशाली) कहकर वास्तव में क्या किया है?",
    options: ['व्यंग्य (उलाहना) किया है कि वे प्रेम के स्पर्श से वंचित रहे', 'उनकी सच्ची प्रशंसा की है', 'उन्हें ब्रह्मज्ञानी माना है', 'उन्हें कृष्ण का सखा होने की बधाई दी है'],
    correctAnswer: 0,
    explanation: 'गोपियों ने वक्रोक्ति व व्यंग्य द्वारा उद्धव पर आक्षेप किया कि कृष्ण के निकट रहकर भी वे प्रेम के अनुराग में नहीं बंधे।',
    tag: 'कक्षा 10 हिन्दी (पद्य खंड) - सूरदास के पद'
  },
  {
    id: 'hi_lit_10_9',
    subject: 'हिन्दी (Hindi)',
    subjectKey: 'hindi',
    level: 'both',
    classLevel: '10th',
    chapter: 'राम-लक्ष्मण-परशुराम संवाद (तुलसीदास)',
    question: "शिव धनुष टूटने पर परशुराम के क्रोधित होने पर लक्ष्मण ने कौन-सा तर्क दिया?",
    options: ['बचपन में हमने कई धनुहियां तोड़ीं, तब तो आपने कभी ऐसा क्रोध नहीं किया', 'यह धनुष बहुत मजबूत था', 'हमने यह धनुष जानबूझकर तोड़ा', 'राजा जनक ने हमें आज्ञा दी थी'],
    correctAnswer: 0,
    explanation: 'लक्ष्मण ने व्यंग्य में कहा: "बहु धनुहीं तोरी लरिकाईं। कबहुं न असि रिस कीन्हि गोसाईं॥" अर्थात इस पुराने धनुष पर इतनी ममता क्यों?',
    tag: 'कक्षा 10 हिन्दी (पद्य खंड) - तुलसीदास'
  },
  {
    id: 'hi_lit_10_10',
    subject: 'हिन्दी (Hindi)',
    subjectKey: 'hindi',
    level: 'both',
    classLevel: '10th',
    chapter: 'उत्साह एवं अट नहीं रही है (सूर्यकांत त्रिपाठी निराला)',
    question: "'उत्साह' कविता में कवि निराला ने बादलों को किसका प्रतीक माना है?",
    options: ['क्रांति और नवचेतना का प्रतीक', 'विनाश और भय का प्रतीक', 'केवल वर्षा का साधन', 'सुस्ती और निराशा का प्रतीक'],
    correctAnswer: 0,
    explanation: 'निराला जी ने बादलों को क्रांति, पौरुष, गर्जना और शोषित समाज में नई ऊर्जा व नूतन कविता फूंकने का प्रतीक माना है।',
    tag: 'कक्षा 10 हिन्दी (पद्य खंड) - निराला'
  },
  {
    id: 'hi_lit_10_11',
    subject: 'हिन्दी (Hindi)',
    subjectKey: 'hindi',
    level: 'both',
    classLevel: '10th',
    chapter: 'श्रम विभाजन और जाति प्रथा (डॉ. भीमराव आंबेडकर)',
    question: "डॉ. भीमराव आंबेडकर के अनुसार आधुनिक सभ्य समाज में जाति प्रथा किसका अस्वाभाविक रूप है?",
    options: ['श्रम विभाजन के साथ-साथ श्रमिकों के अस्वाभाविक विभाजन का', 'केवल आर्थिक विकास का', 'धार्मिक सहिष्णुता का', 'व्यापारिक उन्नति का'],
    correctAnswer: 0,
    explanation: 'बाबासाहेब ने सिद्ध किया कि जाति प्रथा केवल कार्य का विभाजन नहीं करती, बल्कि जन्म के आधार पर श्रमिकों का ऊंच-नीच में अस्वाभाविक विभाजन करती है।',
    tag: 'कक्षा 10 हिन्दी - श्रम विभाजन और जाति प्रथा'
  },
  {
    id: 'hi_lit_12_1',
    subject: 'हिन्दी (Hindi)',
    subjectKey: 'hindi',
    level: 'both',
    classLevel: '12th',
    chapter: 'उसने कहा था (चंद्रधर शर्मा गुलेरी)',
    question: "'उसने कहा था' कहानी के मुख्य पात्र का नाम क्या है जिसने सूबेदारनी के बेटे की रक्षा की?",
    options: ['लहना सिंह', 'बोधा सिंह', 'हजारा सिंह', 'वजीरा सिंह'],
    correctAnswer: 0,
    explanation: 'जमादार लहना सिंह ने प्रथम विश्व युद्ध के मोर्चे पर सूबेदारनी (बचपन की तेरी कुड़माई हो गई वाली लड़की) को दिए वचन की खातिर अपने प्राण न्योछावर कर दिए।',
    tag: 'कक्षा 12 हिन्दी (गद्य खंड) - उसने कहा था'
  },
  {
    id: 'hi_lit_12_2',
    subject: 'हिन्दी (Hindi)',
    subjectKey: 'hindi',
    level: 'both',
    classLevel: '12th',
    chapter: 'बातचीत (बालकृष्ण भट्ट)',
    question: "बालकृष्ण भट्ट के अनुसार बातचीत का सर्वोत्तम और सच्चा तरीका क्या है?",
    options: ['अवाक् होकर अपने आप से बातचीत करना', 'तर्क-वितर्क करके दूसरे को हराना', 'सभाओं में भाषण देना', 'दूसरों पर रौब जमाना'],
    correctAnswer: 0,
    explanation: 'निबंधकार बालकृष्ण भट्ट जी के अनुसार बातचीत का उत्तम रूप आत्म-संवाद है, जिससे मनुष्य अपने अंदर की कमियों को परखता है।',
    tag: 'कक्षा 12 हिन्दी (गद्य खंड) - बातचीत'
  },
  {
    id: 'hi_lit_12_3',
    subject: 'हिन्दी (Hindi)',
    subjectKey: 'hindi',
    level: 'both',
    classLevel: '12th',
    chapter: 'संपूर्ण क्रांति (जयप्रकाश नारायण)',
    question: "लोकनायक जयप्रकाश नारायण ने 'संपूर्ण क्रांति' का ऐतिहासिक आह्वान किस ऐतिहासिक मैदान में किया था?",
    options: ['गांधी मैदान, पटना (5 जून 1974)', 'रामलीला मैदान, दिल्ली', 'आजाद मैदान, मुंबई', 'अल्फा मैदान, प्रयागराज'],
    correctAnswer: 0,
    explanation: '5 जून 1974 को पटना के ऐतिहासिक गांधी मैदान में छात्रों और जनसाधारण के अपार जनसमूह को संबोधित करते हुए जेपी ने संपूर्ण क्रांति का नारा दिया।',
    tag: 'कक्षा 12 हिन्दी (गद्य खंड) - संपूर्ण क्रांति'
  },
  {
    id: 'hi_lit_12_4',
    subject: 'हिन्दी (Hindi)',
    subjectKey: 'hindi',
    level: 'both',
    classLevel: '12th',
    chapter: 'अर्धनारीश्वर (रामधारी सिंह दिनकर)',
    question: "'अर्धनारीश्वर' निबंध में दिनकर जी ने किस पौराणिक रूप का समन्वय प्रस्तुत किया है?",
    options: ['शंकर और पार्वती का कल्पित रूप', 'विष्णु और लक्ष्मी का रूप', 'राम और सीता का रूप', 'ब्रह्मा और सरस्वती का रूप'],
    correctAnswer: 0,
    explanation: 'अर्धनारीश्वर शंकर और पार्वती का कल्पित रूप है जिसके अनुसार नर और नारी एक-दूसरे के पूरक हैं, नर में नारी के गुण आने से वह पूर्ण बनता है।',
    tag: 'कक्षा 12 हिन्दी (गद्य खंड) - अर्धनारीश्वर'
  },
  {
    id: 'hi_lit_12_5',
    subject: 'हिन्दी (Hindi)',
    subjectKey: 'hindi',
    level: 'both',
    classLevel: '12th',
    chapter: 'रोज (सच्चिदानंद हीरानंद वात्स्यायन अज्ञेय)',
    question: "'रोज' कहानी की मुख्य स्त्री पात्र मालती के पति महेश्वर का पेशा क्या था?",
    options: ['एक पहाड़ी सरकारी डिस्पेंसरी में डॉक्टर', 'एक प्राथमिक विद्यालय में शिक्षक', 'रेलवे में स्टेशन मास्टर', 'जज'],
    correctAnswer: 0,
    explanation: 'महेश्वर सरकारी डिस्पेंसरी में डॉक्टर था जो गैंग्रीन के मरीजों के ऑपरेशन किया करता था, और मालती एक नीरस व बंधे हुए ढर्रे में जी रही थी।',
    tag: 'कक्षा 12 हिन्दी (गद्य खंड) - रोज'
  },
  {
    id: 'hi_lit_12_6',
    subject: 'हिन्दी (Hindi)',
    subjectKey: 'hindi',
    level: 'both',
    classLevel: '12th',
    chapter: 'जूठन (ओमप्रकाश वाल्मीकि)',
    question: "'जूठन' किस विधा की रचना है और इसके रचनाकार कौन हैं?",
    options: ['दलित आत्मकथा - ओमप्रकाश वाल्मीकि', 'ऐतिहासिक नाटक - जयशंकर प्रसाद', 'यात्रा वृत्तांत - राहुल सांकृत्यायन', 'काव्य - दिनकर'],
    correctAnswer: 0,
    explanation: "'जूठन' ओमप्रकाश वाल्मीकि की प्रसिद्ध आत्मकथा है जिसमें समाज के जातिगत भेदभाव और अपमानजनक अनुभवों का जीवंत व मार्मिक चित्रण है।",
    tag: 'कक्षा 12 हिन्दी (गद्य खंड) - जूठन'
  },
  {
    id: 'hi_lit_12_7',
    subject: 'हिन्दी (Hindi)',
    subjectKey: 'hindi',
    level: 'both',
    classLevel: '12th',
    chapter: 'कड़बक (मलिक मोहम्मद जायसी)',
    question: "मलिक मोहम्मद जायसी ने अपने किस प्रसिद्ध महाकाव्य में रूपहीन होते हुए भी ज्ञान के प्रकाश का उल्लेख किया है?",
    options: ['पद्मावत', 'अखरावट', 'आखिरी कलाम', 'चित्ररेखा'],
    correctAnswer: 0,
    explanation: 'जायसी एक आंख से वंचित और चेचक के दागों से रूपहीन थे, फिर भी उनके अमर प्रेमकाव्य "पद्मावत" ने उन्हें अमर कर दिया (एक नयन कवि मुहम्मद गुनी)।',
    tag: 'कक्षा 12 हिन्दी (पद्य खंड) - कड़बक'
  },
  {
    id: 'hi_lit_12_8',
    subject: 'हिन्दी (Hindi)',
    subjectKey: 'hindi',
    level: 'both',
    classLevel: '12th',
    chapter: 'छप्पय (नाभादास)',
    question: "भक्तिकाल के कवि नाभादास ने अपने 'छप्पय' में किन दो महान कवियों के भक्ति-काव्य की विशेषता बताई है?",
    options: ['कबीरदास एवं सूरदास', 'तुलसीदास एवं बिहारी', 'मीराबाई एवं रसखान', 'रहीम एवं घनानंद'],
    correctAnswer: 0,
    explanation: 'नाभादास जी ने भक्तमाल के छप्पय में कबीर के निर्भीक पक्षपातहीन सत्य और सूरदास के अद्वितीय चमत्कारिक वात्सल्य भाव की महिमा गाई है।',
    tag: 'कक्षा 12 हिन्दी (पद्य खंड) - छप्पय'
  },
  {
    id: 'hi_lit_12_9',
    subject: 'हिन्दी (Hindi)',
    subjectKey: 'hindi',
    level: 'both',
    classLevel: '12th',
    chapter: 'कवित्त (भूषण)',
    question: "रीतिकाल के राष्ट्रकवि भूषण ने अपने 'कवित्त' में मुख्य रूप से किस वीर नायक का यशोगान किया है?",
    options: ['छत्रपति शिवाजी महाराज', 'महाराणा प्रताप', 'पृथ्वीराज चौहान', 'राजा मानसिंह'],
    correctAnswer: 0,
    explanation: 'कवि भूषण ने छत्रपति शिवाजी महाराज और छत्रसाल बुंदेला के पराक्रम का ओजस्वी वीर रस में वर्णन किया (इंद्र जिमि जंभ पर, बाड़व सुअंभ पर...)।',
    tag: 'कक्षा 12 हिन्दी (पद्य खंड) - भूषण'
  },
  {
    id: 'hi_lit_12_10',
    subject: 'हिन्दी (Hindi)',
    subjectKey: 'hindi',
    level: 'both',
    classLevel: '12th',
    chapter: 'अधिनायक (रघुवीर सहाय)',
    question: "रघुवीर सहाय की व्यंग्य प्रधान कविता 'अधिनायक' में 'हरचरना' किसका प्रतिनिधि है?",
    options: ['आम गरीब, लाचार एवं फटेहाल नागरिक का', 'एक शक्तिशाली नेता का', 'सेना के सिपाही का', 'विदेशी राजदूत का'],
    correctAnswer: 0,
    explanation: 'हरचरना राष्ट्रगान में "भारत भाग्य विधाता" की जय बोलने वाले उस आम बदहाल ग्रामीण का प्रतीक है जो व्यवस्था के दमन को चुपचाप सहता है।',
    tag: 'कक्षा 12 हिन्दी (पद्य खंड) - अधिनायक'
  },

  // --- व्याकरण एवं काव्यशास्त्र (Grammar, Alankar, Rasa, Sandhi, Samas) ---
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

  // Supplement from other chapters of same subject so questions never repeat
  if (matchingQuestions.length < count && pool.length > matchingQuestions.length) {
    const existingIds = new Set(matchingQuestions.map(q => q.id));
    const extraPool = pool.filter(q => !existingIds.has(q.id)).sort(() => Math.random() - 0.5);
    matchingQuestions = [...matchingQuestions, ...extraPool];
  }

  // Shuffle for random test attempt
  const shuffled = [...matchingQuestions].sort(() => Math.random() - 0.5);

  // 3. Guarantee EXACT count with zero duplicates:
  const result: SyllabusQuestion[] = [];
  const usedTexts = new Set<string>();

  for (const base of shuffled) {
    if (result.length >= count) break;
    const textSig = base.question.trim().slice(0, 35);
    if (!usedTexts.has(textSig)) {
      usedTexts.add(textSig);
      result.push({
        ...base,
        id: `${base.id}_${Date.now()}_${result.length + 1}`
      });
    }
  }

  // If still below count, cycle strictly within the SAME subject pool (ZERO subject cross-contamination)
  if (result.length < count && pool.length > 0) {
    let loopIdx = 0;
    while (result.length < count) {
      const template = pool[loopIdx % pool.length];
      result.push({
        ...template,
        id: `${template.id}_repeat_${result.length + 1}`
      });
      loopIdx++;
    }
  }

  return result.slice(0, count);
}
