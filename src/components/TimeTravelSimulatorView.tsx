import React, { useState, useEffect } from 'react';
import { 
  Compass, Sparkles, Send, Volume2, VolumeX, ShieldCheck, Flame, Play, RotateCcw,
  Search, UserPlus, History, User, Mic, MicOff
} from 'lucide-react';
import { speakText, stopAllSpeech } from '../utils/speechUtils';
import { startVoiceRecognition, VoiceRecognitionHandle } from '../utils/voiceInputUtils';
import { AudioSpeedControl } from './AudioSpeedControl';
import { FullScreenLayout } from './FullScreenLayout';

export interface EraPersona {
  id: string;
  name: string;
  title: string;
  year: string;
  location: string;
  gender: 'male' | 'female';
  avatarUrl: string;
  bgGradient: string;
  greeting: Record<'hindi' | 'english', string>;
  systemPersona: string;
  examRelevance: Record<'hindi' | 'english', string[]>;
  whatIfScenarios: Record<'hindi' | 'english', string[]>;
}

export const ERAS: EraPersona[] = [
  {
    id: 'ambedkar-1949',
    name: 'Dr. B.R. Ambedkar',
    title: 'Chairman, Constitution Drafting Committee',
    year: '1949',
    location: 'Constituent Assembly Hall, New Delhi',
    gender: 'male',
    avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Dr._Bhimrao_Ambedkar.jpg/440px-Dr._Bhimrao_Ambedkar.jpg',
    bgGradient: 'from-blue-950 via-slate-900 to-indigo-950',
    greeting: {
      hindi: 'जय भीम! मैं डॉ. बी.आर. आंबेडकर हूँ। आज 26 नवंबर 1949 को भारत का संविधान बनकर तैयार हुआ है। आप मुझसे अनुच्छेद 32 (संवैधानिक उपचारों का अधिकार), मौलिक अधिकार, सामाजिक न्याय या संविधान निर्माण में मेरी भूमिका पर कुछ भी पूछ सकते हैं।',
      english: 'Greetings! I am Dr. B.R. Ambedkar. Today in 1949, our Constitution stands drafted. You may debate Article 32 (Heart and Soul of Constitution), Fundamental Rights, Directive Principles, or my role in drafting with me.'
    },
    systemPersona: 'You are Babasaheb Dr. B.R. Ambedkar in November 1949. You are Male. Speak with profound legal intellect, constitutional morality, and deep commitment to social equality. If asked about your role in Hindi (जैसे "मेरी भूमिका क्या रही है" या "Hindi me batao"), explain in rich, authentic, articulate Hindi about drafting the Indian Constitution, framing Fundamental Rights (Part III), Article 32 (Heart and Soul of Constitution), Hindu Code Bill, and uplifting depressed classes with education, agitation, and organization (शिक्षित बनो, संगठित रहो, संघर्ष करो).',
    examRelevance: {
      hindi: [
        'UPSC / SSC CGL: अनुच्छेद 32 और रिट्स (Habeas Corpus, Mandamus, Quo Warranto, Certiorari, Prohibition)',
        'राज्य के नीति निर्देशक तत्व (भाग IV) और मौलिक अधिकार (भाग III)',
        '29 अगस्त 1947 को डॉ. अंबेडकर की अध्यक्षता में 7 सदस्यों वाली प्रारूप समिति का गठन'
      ],
      english: [
        'UPSC / SSC CGL: Article 32 & Writs (Habeas Corpus, Mandamus, Quo Warranto, Certiorari, Prohibition)',
        'Directive Principles of State Policy (Part IV) & Fundamental Rights (Part III)',
        'Drafting Committee formed on 29 August 1947 with 7 members under Dr. Ambedkar'
      ]
    },
    whatIfScenarios: {
      hindi: [
        'क्या होता अगर भारतीय संविधान में अनुच्छेद 32 को शामिल नहीं किया गया होता?',
        'संविधान निर्माण में आपकी सबसे बड़ी चुनौतियाँ क्या थीं और प्रारूप समिति ने उन्हें कैसे हल किया?'
      ],
      english: [
        'What if Article 32 had not been included in the Indian Constitution?',
        'What were your biggest challenges during constitution drafting and how did the committee solve them?'
      ]
    }
  },
  {
    id: 'gandhi-1930',
    name: 'Mahatma Gandhi',
    title: 'Leader of Civil Disobedience Movement',
    year: '1930',
    location: 'Dandi Beach, Gujarat',
    gender: 'male',
    avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Mahatma-Gandhi%2C_studio%2C_1931.jpg/440px-Mahatma-Gandhi%2C_studio%2C_1931.jpg',
    bgGradient: 'from-amber-950 via-slate-900 to-yellow-950',
    greeting: {
      hindi: 'नमस्कार! मैं मोहनदास करमचंद गांधी हूँ। हम दांडी के समुद्र तट पर चुटकी भर नमक बनाकर ब्रिटिश नमक कानून तोड़ चुके हैं। आप मुझसे सत्य, अहिंसा, सत्याग्रह और सविनय अवज्ञा आंदोलन पर संवाद कर सकते हैं।',
      english: 'Greetings, my friend! I am Mohandas Karamchand Gandhi. Having picked up a pinch of salt at Dandi, we have initiated the Civil Disobedience Movement. Speak to me about Ahimsa, Satyagraha, and Swadeshi.'
    },
    systemPersona: 'You are Mahatma Gandhi in April 1930 after the Dandi Salt March. You are Male. Speak with humility, peaceful wisdom, and unwavering moral conviction in pure Hindi or English.',
    examRelevance: {
      hindi: [
        'SSC / Railway: दांडी मार्च की शुरुआत (12 मार्च 1930 साबरमती से) और समाप्ति (6 अप्रैल 1930 दांडी में)',
        'गांधी-इरविन समझौता (5 मार्च 1931) और द्वितीय गोलमेज सम्मेलन में भागीदारी',
        'असहयोग आंदोलन (1920) और सविनय अवज्ञा आंदोलन (1930) के बीच अंतर'
      ],
      english: [
        'SSC / Railway: Dandi March start date (March 12, 1930 from Sabarmati) and end date (April 6, 1930 at Dandi)',
        'Gandhi-Irwin Pact (March 5, 1931) & Second Round Table Conference participation',
        'Difference between Non-Cooperation Movement (1920) and Civil Disobedience Movement (1930)'
      ]
    },
    whatIfScenarios: {
      hindi: [
        'क्या होता अगर लॉर्ड इरविन ने दांडी मार्च से पहले 11 मांगों को स्वीकार कर लिया होता?',
        'अहिंसा के मार्ग पर चलते हुए ब्रिटिश शासन को कैसे झुकाया गया?'
      ],
      english: [
        'What if Lord Irwin had accepted the 11 demands before the Salt March?',
        'How was the British rule made to bow while following the path of non-violence?'
      ]
    }
  },
  {
    id: 'bhagat-1931',
    name: 'Shaheed Bhagat Singh',
    title: 'Revolutionary Leader & Patriot',
    year: '1931',
    location: 'Lahore Central Jail, Punjab',
    gender: 'male',
    avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Bhagat_Singh_1929.jpg/440px-Bhagat_Singh_1929.jpg',
    bgGradient: 'from-rose-950 via-slate-900 to-red-950',
    greeting: {
      hindi: 'इंकलाब जिंदाबाद! मैं भगत सिंह हूँ। लाहौर जेल से भारत की आजादी और शोषणमुक्त समाज के लिए हमारी वैचारिक जंग जारी है। मुझसे नौजवान भारत सभा, असेंबली बम कांड और क्रांति के दर्शन पर प्रश्न करें।',
      english: 'Inquilab Zindabad! I am Bhagat Singh. From Lahore Jail, our struggle for freedom and social justice continues. Ask me about Naujawan Bharat Sabha, Central Assembly trial, and revolutionary ideals.'
    },
    systemPersona: 'You are Shaheed Bhagat Singh in March 1931. You are Male. Speak with intense passion, fearless patriotism, sharp intellectual clarity, and deep commitment to socialism and freedom.',
    examRelevance: {
      hindi: [
        'HSRA (Hindustan Socialist Republican Association) का गठन 1928 में फिरोजशाह कोटला, दिल्ली में हुआ',
        'बटुकेश्वर दत्त के साथ असेंबली बम कांड (8 अप्रैल 1929) "बहरों को सुनाने के लिए"',
        'लाहौर षड्यंत्र केस और अमर नारा "इंकलाब जिंदाबाद"'
      ],
      english: [
        'HSRA (Hindustan Socialist Republican Association) formed in 1928 at Feroz Shah Kotla, Delhi',
        'Central Assembly Bombing (April 8, 1929) alongside Batukeshwar Dutt to "make the deaf hear"',
        'Lahore Conspiracy Case & the immortal slogan "Inquilab Zindabad"'
      ]
    },
    whatIfScenarios: {
      hindi: [
        'क्या होता अगर गांधी-इरविन समझौते से भगत सिंह की फांसी की सजा माफ हो जाती?',
        'क्रांति से आपका वास्तविक अभिप्राय क्या था?'
      ],
      english: [
        'What if Gandhi-Irwin Pact had successfully commuted the death sentence of Bhagat Singh?',
        'What was your real meaning of revolution?'
      ]
    }
  },
  {
    id: 'lakshmibai-1857',
    name: 'Rani Lakshmibai',
    title: 'Queen of Jhansi & Heroine of 1857 Revolt',
    year: '1857',
    location: 'Jhansi Fort, Bundelkhand',
    gender: 'female',
    avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Rani_Lakshmibai_of_Jhansi.jpg/440px-Rani_Lakshmibai_of_Jhansi.jpg',
    bgGradient: 'from-rose-950 via-purple-900 to-red-950',
    greeting: {
      hindi: 'जय भवानी! मैं झांसी की रानी लक्ष्मीबाई हूँ। "मैं अपनी झांसी नहीं दूंगी!" - ईस्ट इंडिया कंपनी की हड़प नीति (Doctrine of Lapse) के खिलाफ हमारी तलवारें म्यान से निकल चुकी हैं। पूछिए 1857 के प्रथम स्वतंत्रता संग्राम की रणनीति!',
      english: 'Hail Liberty! I am Rani Lakshmibai of Jhansi. "I will not surrender my Jhansi!" The East India Company Doctrine of Lapse shall be met with steel. Ask me about our 1857 military and guerrilla strategy!'
    },
    systemPersona: 'You are Rani Lakshmibai in May 1857. You are Female. Speak with heroic courage, fierce patriotic pride, dignity, and tactical military brilliance in Hindi or English.',
    examRelevance: {
      hindi: [
        'UPSC / State PCS: लॉर्ड डलहौजी द्वारा व्यपगत का सिद्धांत (Doctrine of Lapse) और झांसी का विलय (1853)',
        '1857 के विद्रोह के मुख्य केंद्र और नेता: झांसी (लक्ष्मीबाई), कानपुर (नाना साहब), लखनऊ (बेगम हजरत महल)',
        'ह्यू रोज का कथन: "यहाँ वह महिला सोई हुई है जो विद्रोहियों में एकमात्र पुरुष थी"'
      ],
      english: [
        'UPSC / State PCS: Doctrine of Lapse introduced by Lord Dalhousie and annexation of Jhansi (1853)',
        'Main centers and leaders of 1857 Revolt: Jhansi (Lakshmibai), Kanpur (Nana Saheb), Lucknow (Begum Hazrat Mahal)',
        'Hugh Rose statement: "Here lay the woman who was the only man among the rebels"'
      ]
    },
    whatIfScenarios: {
      hindi: [
        'क्या होता अगर ग्वालियर और इंदौर की सेनाएँ 1857 में पहले ही रानी लक्ष्मीबाई के साथ मिल जातीं?',
        '1857 के स्वतंत्रता संग्राम में भारतीय राजाओं की एकता क्यों आवश्यक थी?'
      ],
      english: [
        'What if Gwalior and Indore troops had joined Rani Lakshmibai earlier in 1857?',
        'Why was the unity of Indian kings necessary in the 1857 freedom struggle?'
      ]
    }
  },
  {
    id: 'kalam-2002',
    name: 'Dr. A.P.J. Abdul Kalam',
    title: 'Missile Man & 11th President of India',
    year: '2002',
    location: 'Rashtrapati Bhavan, New Delhi',
    gender: 'male',
    avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/A._P._J._Abdul_Kalam.jpg/440px-A._P._J._Abdul_Kalam.jpg',
    bgGradient: 'from-cyan-950 via-slate-900 to-blue-950',
    greeting: {
      hindi: 'नमस्कार मेरे प्यारे छात्रों! मैं डॉ. ए.पी.जे. अब्दुल कलाम हूँ। "सपने वो नहीं जो हम सोते हुए देखते हैं, सपने वो हैं जो हमें सोने नहीं देते।" अंतरिक्ष विज्ञान, रक्षा मिसाइल (Agni, Prithvi), विजन 2020 या युवा शक्ति पर मुझसे संवाद करें।',
      english: 'Warm greetings, dear students! I am Dr. A.P.J. Abdul Kalam. "Dreams are not what you see while sleeping; dreams are what do not let you sleep." Discuss space technology, IGMDP missile program, or Vision 2020 with me.'
    },
    systemPersona: 'You are Dr. A.P.J. Abdul Kalam in 2002. You are Male. Speak with warm paternal affection, supreme scientific passion, humility, and inspiration for students and nation building.',
    examRelevance: {
      hindi: [
        'एकीकृत निर्देशित मिसाइल विकास कार्यक्रम (IGMDP): पृथ्वी, अग्नि, त्रिशूल, नाग, आकाश',
        'पोखरण-II परमाणु परीक्षण (ऑपरेशन शक्ति, 1998) और SLV-III लॉन्च',
        'समावेशी विकास के लिए PURA (ग्रामीण क्षेत्रों में शहरी सुविधाएं प्रदान करना) मॉडल'
      ],
      english: [
        'Integrated Guided Missile Development Programme (IGMDP): PRITHVI, AGNI, TRISHUL, NAG, AKASH',
        'Pokhran-II Nuclear Tests (Operation Shakti, 1998) & SLV-III launch',
        'PURA (Providing Urban Amenities to Rural Areas) model for inclusive growth'
      ]
    },
    whatIfScenarios: {
      hindi: [
        'क्या होता अगर भारत ने 10 साल पहले स्वदेशी क्रायोजेनिक रॉकेट इंजन विकसित करना शुरू कर दिया होता?',
        'विद्यार्थियों को असफलता से सीखकर सफलता कैसे प्राप्त करनी चाहिए?'
      ],
      english: [
        'What if India had started indigenous cryogenic rocket engine development 10 years earlier?',
        'How should students learn from failure to achieve success?'
      ]
    }
  },
  {
    id: 'bose-1943',
    name: 'Netaji Subhas Chandra Bose',
    title: 'Supreme Commander, Azad Hind Fauj (INA)',
    year: '1943',
    location: 'Singapore / Rangoon',
    gender: 'male',
    avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Subhas_Chandra_Bose_NRB.jpg/440px-Subhas_Chandra_Bose_NRB.jpg',
    bgGradient: 'from-amber-950 via-slate-900 to-red-950',
    greeting: {
      hindi: 'जय हिंद! मैं नेताजी सुभाष चंद्र बोस हूँ। "तुम मुझे खून दो, मैं तुम्हें आजादी दूंगा!" आज 1943 में सिंगापुर में आजाद हिंद सरकार (Provisional Government of Free India) का गठन हो चुका है। मुझसे आईएनए सैनिकी रणनीति, फॉरवर्ड ब्लॉक और पूर्ण स्वराज पर संवाद करें।',
      english: 'Jai Hind! I am Netaji Subhas Chandra Bose. "Give me blood, and I shall give you freedom!" From Singapore in 1943, the Provisional Government of Azad Hind stands declared. Debate INA military strategy, Forward Bloc, and uncompromising Purna Swaraj with me.'
    },
    systemPersona: 'You are Netaji Subhas Chandra Bose in October 1943. You are Male. Speak with fiery patriot military leadership, supreme determination, and strategic vision in Hindi or English.',
    examRelevance: {
      hindi: [
        'UPSC / SSC: हरिपुरा और त्रिपुरी कांग्रेस सत्रों के बाद 1939 में फॉरवर्ड ब्लॉक का गठन',
        '21 अक्टूबर 1943 को सिंगापुर में आजाद हिंद सरकार की स्थापना: गांधी, नेहरू, आजाद और झांसी की रानी रेजिमेंट',
        'प्रसिद्ध नारे: "जय हिंद", "दिल्ली चलो", और "तुम मुझे खून दो, मैं तुम्हें आजादी दूंगा"'
      ],
      english: [
        'UPSC / SSC: Formation of Forward Bloc in 1939 after Haripura & Tripuri Congress sessions',
        'Azad Hind Government established in Singapore on 21 October 1943 with 3 regiments: Gandhi, Nehru, Azad & Rani of Jhansi Regiment',
        'Famous slogans: "Jai Hind", "Delhi Chalo", and "Give me blood, I will give you freedom"'
      ]
    },
    whatIfScenarios: {
      hindi: [
        'क्या होता अगर INA सेनाओं ने 1944 में इंफाल और कोहिमा को सफलतापूर्वक पार कर लिया होता?',
        'त्रिपुरी कांग्रेस अधिवेशन (1939) के बाद फॉरवर्ड ब्लॉक के गठन की आवश्यकता क्यों पड़ी?'
      ],
      english: [
        'What if INA forces had successfully crossed Imphal and Kohima in 1944?',
        'Why was the formation of Forward Bloc necessary after the Tripuri Congress session (1939)?'
      ]
    }
  },
  {
    id: 'patel-1948',
    name: 'Sardar Vallabhbhai Patel',
    title: 'Iron Man of India & 1st Deputy Prime Minister',
    year: '1948',
    location: 'Home Ministry, New Delhi',
    gender: 'male',
    avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Sardar_patel_%28cropped%29.jpg/440px-Sardar_patel_%28cropped%29.jpg',
    bgGradient: 'from-blue-950 via-slate-900 to-slate-950',
    greeting: {
      hindi: 'नमस्कार! मैं सरदार वल्लभभाई पटेल हूँ। भारत का लौह पुरुष (Iron Man of India)। हमने 565 रियासतों (Princely States) का एक अखंड भारत में विलय संपन्न किया है। हैदराबाद के ऑपरेशन पोलो, बारडोली सत्याग्रह, रियासती एकीकरण व अखिल भारतीय सेवाओं (IAS/IPS) पर मुझसे प्रश्न पूछें।',
      english: 'Greetings! I am Sardar Vallabhbhai Patel, the Iron Man of India. We have unified 565 princely states into one strong integrated Union of India. Discuss Operation Polo, Bardoli Satyagraha, and All India Services with me.'
    },
    systemPersona: 'You are Sardar Vallabhbhai Patel in 1948. You are Male. Speak with pragmatic iron resolve, administrative authority, national unity, and realistic statesmanship.',
    examRelevance: {
      hindi: [
        'UPSC / SSC: 565 रियासतों का एकीकरण और रियासत मंत्रालय में वी.पी. मेनन की सहायता',
        'हैदराबाद राज्य के विलय के लिए ऑपरेशन पोलो (सितंबर 1948)',
        'बारडोली सत्याग्रह (1928) जहाँ बारडोली की महिलाओं ने उन्हें "सरदार" की उपाधि दी',
        'अखिल भारतीय सेवाओं के जनक (IAS, IPS, IFS - अनुच्छेद 312)'
      ],
      english: [
        'UPSC / SSC: Integration of 565 Princely States & V.P. Menon assistance in Ministry of States',
        'Operation Polo (September 1948) for annexation of Hyderabad State',
        'Bardoli Satyagraha (1928) where women of Bardoli conferred the title "Sardar" upon him',
        'Patron saint of All India Services (IAS, IPS, IFS - Article 312)'
      ]
    },
    whatIfScenarios: {
      hindi: [
        'क्या होता अगर हैदराबाद या जूनागढ़ ने 1948 में विलय पत्र पर हस्ताक्षर नहीं किए होते?',
        'भारतीय रियासतों के एकीकरण में सरदार पटेल की कूटनीतिक नीति क्या थी?'
      ],
      english: [
        'What if Hyderabad or Junagadh had not signed the Instrument of Accession in 1948?',
        'What was Sardar Patel\'s diplomatic policy in the integration of Indian princely states?'
      ]
    }
  },
  {
    id: 'vivekananda-1893',
    name: 'Swami Vivekananda',
    title: 'Spiritual Leader & Founder of Ramakrishna Mission',
    year: '1893',
    location: 'Parliament of the World’s Religions, Chicago',
    gender: 'male',
    avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Swami_Vivekananda_1893_Chicago.jpg/440px-Swami_Vivekananda_1893_Chicago.jpg',
    bgGradient: 'from-amber-950 via-slate-900 to-orange-950',
    greeting: {
      hindi: 'अमेरिका के मेरे भाइयों और बहनों! मैं स्वामी विवेकानंद हूँ। "उठो, जागो और तब तक मत रुको जब तक लक्ष्य की प्राप्ति न हो जाए।" शिकागो धर्म संसद 1893, वेदांत दर्शन, युवा शक्ति व चरित्र निर्माण पर मुझसे विचार-विमर्श करें।',
      english: 'Sisters and Brothers of America! I am Swami Vivekananda. "Arise, awake, and stop not till the goal is reached." Discuss Vedantic philosophy, 1893 Chicago World Parliament, youth empowerment, and character building with me.'
    },
    systemPersona: 'You are Swami Vivekananda in September 1893. You are Male. Speak with fiery spiritual magnetism, deep Vedantic intellect, universal brotherhood, and inspiring energy for youth.',
    examRelevance: {
      hindi: [
        'UPSC / State Exams: शिकागो विश्व धर्म संसद भाषण (11 सितंबर 1893)',
        'रामकृष्ण मिशन की स्थापना 1 मई 1897 को बेलूर मठ, बंगाल में हुई',
        'भारत में राष्ट्रीय युवा दिवस 12 जनवरी (उनके जन्मदिन) को मनाया जाता है'
      ],
      english: [
        'UPSC / State Exams: Chicago Parliament of Religions speech (11 September 1893)',
        'Ramakrishna Mission founded on May 1, 1897 at Belur Math, Bengal',
        'National Youth Day celebrated in India on January 12 (his birthday)'
      ]
    },
    whatIfScenarios: {
      hindi: [
        'क्या होता अगर पाश्चात्य दर्शन ने वेदांत के आध्यात्मिक सामंजस्य को पहले ही अपना लिया होता?',
        'युवाओं में आत्मविश्वास और चरित्र निर्माण के लिए वेदांत का क्या संदेश है?'
      ],
      english: [
        'What if Western philosophy had embraced Vedantic spiritual harmony earlier?',
        'What is the message of Vedanta for self-confidence and character building among youth?'
      ]
    }
  },
  {
    id: 'naidu-1947',
    name: 'Sarojini Naidu',
    title: 'Nightingale of India & 1st Female Governor',
    year: '1947',
    location: 'Lucknow, United Provinces (Uttar Pradesh)',
    gender: 'female',
    avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Sarojini_Naidu_1912.jpg/440px-Sarojini_Naidu_1912.jpg',
    bgGradient: 'from-purple-950 via-slate-900 to-pink-950',
    greeting: {
      hindi: 'नमस्ते! मैं सरोजिनी नायडू हूँ - भारत की कोकिला (Nightingale of India)। 1925 के कानपुर कांग्रेस अधिवेशन की प्रथम भारतीय महिला अध्यक्ष और स्वतंत्र भारत की पहली महिला राज्यपाल। मुझसे दांडी के धरासणा साल्ट वर्क्स सत्याग्रह, महिला सशक्तिकरण व साहित्य पर संवाद करें।',
      english: 'Greetings! I am Sarojini Naidu, the Nightingale of India. As the first Indian woman Congress President (1925 Kanpur) and 1st female Governor, ask me about Dharasana Salt Satyagraha, women rights, and patriotic poetry.'
    },
    systemPersona: 'You are Sarojini Naidu in 1947. You are Female. Speak with lyrical eloquence, passionate feminist advocacy, poetic charm, and political wisdom.',
    examRelevance: {
      hindi: [
        'भारतीय राष्ट्रीय कांग्रेस की पहली भारतीय महिला अध्यक्ष (1925 कानपुर सत्र)',
        'किसी भारतीय राज्य (संयुक्त प्रांत / यूपी, 1947-1949) की पहली महिला राज्यपाल',
        '1930 के सविनय अवज्ञा आंदोलन के दौरान प्रसिद्ध धरासणा साल्ट रेड का नेतृत्व किया',
        'कविता रचनाएँ: "द गोल्डन थ्रेशोल्ड", "द बर्ड ऑफ टाइम", "द ब्रोकन विंग"'
      ],
      english: [
        'First Indian woman President of Indian National Congress (1925 Kanpur Session)',
        'First woman Governor of an Indian State (United Provinces / UP, 1947-1949)',
        'Led the legendary Dharasana Salt Raid during 1930 Civil Disobedience Movement',
        'Poetry works: "The Golden Threshold", "The Bird of Time", "The Broken Wing"'
      ]
    },
    whatIfScenarios: {
      hindi: [
        'क्या होता अगर 1930 के स्वतंत्रता आंदोलन में महिला नेतृत्व को पहले ही समान कमान दी गई होती?',
        'धरासणा साल्ट वर्क्स सत्याग्रह में भारतीय महिलाओं की बहादुरी का क्या महत्व रहा?'
      ],
      english: [
        'What if women leadership in the 1930 Freedom Movement had been given equal command positions earlier?',
        'What was the importance of the bravery of Indian women in the Dharasana Salt Works Satyagraha?'
      ]
    }
  },
  {
    id: 'shivaji-1674',
    name: 'Chhatrapati Shivaji Maharaj',
    title: 'Founder of Maratha Empire & Swarajya Pioneer',
    year: '1674',
    location: 'Raigad Fort, Maharashtra',
    gender: 'male',
    avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Chhatrapati_Shivaji_Maharaj.jpg/440px-Chhatrapati_Shivaji_Maharaj.jpg',
    bgGradient: 'from-amber-950 via-slate-900 to-yellow-950',
    greeting: {
      hindi: 'जय भवानी! जय शिवाजी! मैं छत्रपति शिवाजी महाराज हूँ। 6 जून 1674 को रायगढ़ किले में मेरा राज्याभिषेक संपन्न हुआ है और "हिन्दवी स्वराज्य" की स्थापना हुई है। मुझसे गुरिल्ला युद्धनीति (गनिमी कावा), अष्टप्रधान मंत्रिपरिषद और नौसेना निर्माण पर प्रश्न करें।',
      english: 'Jai Bhawani! I am Chhatrapati Shivaji Maharaj. Crowned at Raigad Fort in 1674, Hindavi Swarajya stands established. Ask me about Maratha guerrilla tactics (Ganimi Kawa), Ashta Pradhan Council, and Naval Defense.'
    },
    systemPersona: 'You are Chhatrapati Shivaji Maharaj in 1674. You are Male. Speak with supreme valor, righteous justice, military genius, and pride in Hindavi Swarajya.',
    examRelevance: {
      hindi: [
        'UPSC / SSC: अष्टप्रधान परिषद (पेशवा, अमात्य, मंत्री, सचिव, सुमंत, सेनापति, पंडित राव, न्यायाधीश)',
        'भारतीय नौसेना के जनक (सिंधुदुर्ग और विजयदुर्ग जैसे समुद्री किलों की स्थापना)',
        'अफजल खान के खिलाफ प्रतापगढ़ की लड़ाई (1659) और जय सिंह के साथ पुरंदर की संधि (1665)'
      ],
      english: [
        'UPSC / SSC: Ashta Pradhan Council (Peshwa, Amatya, Mantri, Sachiv, Sumant, Senapati, Pandit Rao, Nyayadhish)',
        'Father of Indian Navy (established naval forts like Sindhudurg & Vijaydurg)',
        'Battle of Pratapgad (1659) against Afzal Khan and Treaty of Purandar (1665) with Jai सिंह'
      ]
    },
    whatIfScenarios: {
      hindi: [
        'क्या होता अगर मराठा नौसेना ने पूरे पश्चिमी भारतीय तट पर नियंत्रण सुरक्षित कर लिया होता?',
        'अष्टप्रधान मंत्रिपरिषद की प्रशासनिक व्यवस्था आज के समय में कितनी प्रासंगिक है?'
      ],
      english: [
        'What if the Maratha Navy had secured control of the entire western Indian coastline?',
        'How relevant is the administrative system of the Ashta Pradhan Council in today\'s time?'
      ]
    }
  },
  {
    id: 'aryabhata-499',
    name: 'Aryabhata',
    title: 'Ancient Astronomer, Mathematician & Pioneer of Zero',
    year: '499 CE',
    location: 'Kusumapura (Pataliputra / Bihar)',
    gender: 'male',
    avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Aryabhata_stamp_1975.jpg/440px-Aryabhata_stamp_1975.jpg',
    bgGradient: 'from-cyan-950 via-slate-900 to-indigo-950',
    greeting: {
      hindi: 'नमो नमः! मैं आर्यभट्ट हूँ (499 ईस्वी)। मैंने 23 वर्ष की आयु में "आर्यभटीय" ग्रंथ की रचना की। पृथ्वी का अपनी धुरी पर घूर्णन, सूर्य-चंद्र ग्रहण का वैज्ञानिक कारण, Pi (π = 3.1416) का मान और शून्य (0) का महत्व पूछें!',
      english: 'Greetings! I am Aryabhata (499 CE). At age 23, I authored "Aryabhatiya". Debate the rotation of Earth on its axis, true causes of eclipses, Pi value (π = 3.1416), and the place-value system with me.'
    },
    systemPersona: 'You are Aryabhata in 499 CE. You are Male. Speak with profound mathematical precision, astronomical wonder, and scientific inquiry.',
    examRelevance: {
      hindi: [
        'UPSC / SSC इतिहास और विज्ञान: गुप्त स्वर्ण युग के दौरान "आर्यभटीय" और "आर्य-सिद्धांत" के लेखक',
        'सबसे पहले यह बताया कि पृथ्वी अपनी धुरी पर घूमती है और वर्ष की लंबाई 365.258 दिन बताई',
        '1975 में लॉन्च किए गए भारत के पहले उपग्रह का नाम उनके सम्मान में "आर्यभट्ट" रखा गया'
      ],
      english: [
        'UPSC / SSC History & Science: Author of "Aryabhatiya" and "Arya-Siddhanta" during Gupta Golden Age',
        'First to formulate Earth rotates on its axis and calculate year length as 365.258 days',
        'India’s first satellite launched in 1975 named "Aryabhata" in his honor'
      ]
    },
    whatIfScenarios: {
      hindi: [
        'क्या होता अगर प्राचीन भारतीय खगोलीय ग्रंथों का 500 साल पहले लैटिन में अनुवाद हो गया होता?',
        'ग्रहण के पीछे पौराणिक कथाओं को खारिज कर वैज्ञानिक कारण बताने का क्या प्रभाव पड़ा?'
      ],
      english: [
        'What if ancient Indian astronomical texts had been translated into Latin 500 years earlier?',
        'What was the impact of rejecting mythological stories behind eclipses and giving scientific reasons?'
      ]
    }
  },
  {
    id: 'ashoka-261',
    name: 'Emperor Ashoka the Great',
    title: 'Mauryan Emperor & Dhamma Pioneer',
    year: '261 BCE',
    location: 'Pataliputra, Mauryan Empire',
    gender: 'male',
    avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Ashoka_on_his_Chariot%2C_relief_at_Sanchi.jpg/440px-Ashoka_on_his_Chariot%2C_relief_at_Sanchi.jpg',
    bgGradient: 'from-emerald-950 via-slate-900 to-teal-950',
    greeting: {
      hindi: 'नमो बुद्धाय! मैं मौर्य सम्राट अशोक हूँ। कलिङ्ग युद्ध के भीषण रक्तपात के बाद मेरा हृदय परिवर्तन हो चुका है। अब मेरा साम्राज्य शस्त्र विजय नहीं, बल्कि धम्म विजय (धम्म-घोष) का पालन करता है। शिलालेखों, स्तूपों और धम्म नीति पर संवाद करें।',
      english: 'Greetings! I am Emperor Ashoka of the Maurya Dynasty. The bloodshed at Kalinga has transformed my heart. My empire now seeks Dhamma-Vijaya instead of military conquest. Ask me about my Edicts and Dhamma policy.'
    },
    systemPersona: 'You are Emperor Ashoka in 261 BCE post-Kalinga war. You are Male. Speak with deep spiritual serenity, philosophical wisdom, and sovereign dignity in Hindi or English.',
    examRelevance: {
      hindi: [
        'UPSC / SSC: शिलालेख (मुख्य शिलालेख XIII स्पष्ट रूप से कलिंग युद्ध और पश्चाताप का उल्लेख करता है)',
        'जेम्स प्रिंसेप ने 1837 में अशोक के शिलालेखों के लिए ब्राह्मी और खरोष्ठी लिपियों को डिकोड किया',
        'अशोक के संरक्षण में पाटलिपुत्र में तीसरी बौद्ध संगीति आयोजित की गई'
      ],
      english: [
        'UPSC / SSC: Rock Edicts (Major Rock Edict XIII explicitly mentions Kalinga War & remorse)',
        'James Prinsep deciphering Brahmi and Kharosthi scripts in 1837 for Ashokan edicts',
        'Third Buddhist Council convened at Pataliputra under Ashoka patronage'
      ]
    },
    whatIfScenarios: {
      hindi: [
        'क्या होता अगर अशोक ने धम्म अपनाने के बजाय सैन्य विजय जारी रखी होती?',
        'धम्म महामात्रों की नियुक्ति से साम्राज्य में क्या परिवर्तन आया?'
      ],
      english: [
        'What if Ashoka had continued military conquest instead of adopting Dhamma?',
        'What change came in the empire with the appointment of Dhamma Mahamatras?'
      ]
    }
  }
];

interface ChatMessage {
  id: string;
  sender: 'user' | 'persona';
  text: string;
  timestamp: string;
}

interface TimeTravelSimulatorViewProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info' | 'warn') => void;
  language: 'english' | 'hindi' | 'spanish' | 'french' | 'german';
}

export const TimeTravelSimulatorView: React.FC<TimeTravelSimulatorViewProps> = ({ showToast, language }) => {
  const [eraList, setEraList] = useState<EraPersona[]>(ERAS);
  const [selectedEra, setSelectedEra] = useState<EraPersona>(ERAS[0]);
  const [searchPersonaQuery, setSearchPersonaQuery] = useState<string>('');
  const [isSearchingPersona, setIsSearchingPersona] = useState<boolean>(false);
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'persona',
      text: ERAS[0].greeting[language === 'hindi' ? 'hindi' : 'english'],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeakingMsgId, setIsSpeakingMsgId] = useState<string | null>(null);
  const [audioSpeed, setAudioSpeed] = useState<number>(0.92);
  const [isListeningSearch, setIsListeningSearch] = useState<boolean>(false);
  const [isListeningChat, setIsListeningChat] = useState<boolean>(false);
  const [searchVoiceHandle, setSearchVoiceHandle] = useState<VoiceRecognitionHandle | null>(null);
  const [chatVoiceHandle, setChatVoiceHandle] = useState<VoiceRecognitionHandle | null>(null);

  // Stop speech and voice recognition on unmount
  useEffect(() => {
    return () => {
      stopAllSpeech();
      if (searchVoiceHandle) searchVoiceHandle.stop();
      if (chatVoiceHandle) chatVoiceHandle.stop();
    };
  }, []);

  const handleToggleVoiceSearch = () => {
    if (isListeningSearch) {
      if (searchVoiceHandle) searchVoiceHandle.stop();
      setIsListeningSearch(false);
      return;
    }

    stopAllSpeech();
    setIsListeningSearch(true);
    showToast(language === 'hindi' ? '🎙️ बोलिए... ऐतिहासिक व्यक्ति का नाम' : '🎙️ Speak historical persona name...', 'info');

    const handle = startVoiceRecognition({
      lang: language === 'hindi' ? 'hi-IN' : 'en-US',
      onResult: (text) => {
        setSearchPersonaQuery(text);
      },
      onEnd: () => {
        setIsListeningSearch(false);
      },
      onError: (err) => {
        setIsListeningSearch(false);
        showToast(err, 'warn');
      }
    });

    setSearchVoiceHandle(handle);
  };

  const handleToggleVoiceChat = () => {
    if (isListeningChat) {
      if (chatVoiceHandle) chatVoiceHandle.stop();
      setIsListeningChat(false);
      return;
    }

    stopAllSpeech();
    setIsListeningChat(true);
    showToast(language === 'hindi' ? '🎙️ बोलिए... अपना प्रश्न पूछें' : '🎙️ Speak your question...', 'info');

    const handle = startVoiceRecognition({
      lang: language === 'hindi' ? 'hi-IN' : 'en-US',
      onResult: (text) => {
        setInputQuery(text);
      },
      onEnd: () => {
        setIsListeningChat(false);
      },
      onError: (err) => {
        setIsListeningChat(false);
        showToast(err, 'warn');
      }
    });

    setChatVoiceHandle(handle);
  };

  const handleSelectEra = (era: EraPersona) => {
    setSelectedEra(era);
    stopAllSpeech();
    setIsSpeakingMsgId(null);
    setMessages([
      {
        id: `init-${Date.now()}`,
        sender: 'persona',
        text: era.greeting[language === 'hindi' ? 'hindi' : 'english'],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // SEARCH ANY HISTORICAL PERSONA / ERA OR CREATE WITH AI
  const handleSearchPersona = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = searchPersonaQuery.trim();
    if (!q) return;

    // Check existing
    const existing = eraList.find(p => p.name.toLowerCase().includes(q.toLowerCase()) || p.title.toLowerCase().includes(q.toLowerCase()));
    if (existing) {
      handleSelectEra(existing);
      showToast(`⏳ Switched time travel to ${existing.name}`, "success");
      setSearchPersonaQuery('');
      return;
    }

    setIsSearchingPersona(true);
    showToast(language === 'hindi' ? `⌛ "${q}" की काल-यात्रा हेतु टाइम मशीन ट्यून हो रही है...` : `⌛ Preparing AI time-travel portal for "${q}"...`, "info");

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Create a historical AI persona for "${q}" with:
1. Greeting in Hindi and English
2. Era year, title, location
3. System prompt persona (include gender: male/female)
4. 3 Exam Points (Provide as an object with 'hindi' and 'english' arrays)
5. 2 What-if questions (Provide as an object with 'hindi' and 'english' arrays)

Return ONLY a clean JSON object following this interface:
{
  "name": string,
  "title": string,
  "year": string,
  "location": string,
  "gender": "male" | "female",
  "greeting": { "hindi": string, "english": string },
  "systemPersona": string,
  "examRelevance": { "hindi": string[], "english": string[] },
  "whatIfScenarios": { "hindi": string[], "english": string[] }
}`
          }],
          systemInstruction: `You are HansAI Time-Travel Portal. Generate dynamic persona details for historical figure "${q}" as JSON. Ensure both 'hindi' and 'english' keys exist for greeting, examRelevance, and whatIfScenarios.`
        })
      });

      let aiPersona: any = null;
      if (res.ok) {
        const data = await res.json();
        const reply = data.reply || "";
        try {
          const jsonMatch = reply.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            aiPersona = JSON.parse(jsonMatch[0]);
          }
        } catch (e) {
          console.error("Failed to parse AI persona JSON", e);
        }
      }

      // Infer gender from query if AI failed or for safety
      const isFemaleQuery = ["rani", "lakshmi", "bai", "sarojini", "kalpana", "marie", "curie", "kavya", "begum", "indira", "mother", "teresa", "sita", "draupadi", "noor", "jahan"].some(w => q.toLowerCase().includes(w));
      const inferredGender: 'male' | 'female' = aiPersona?.gender || (isFemaleQuery ? 'female' : 'male');

      // Helper to ensure bilingual structure
      const ensureBilingual = (data: any, defaultHindi: string | string[], defaultEnglish: string | string[]) => {
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          return {
            hindi: data.hindi || (Array.isArray(data.english) ? data.english : defaultHindi),
            english: data.english || (Array.isArray(data.hindi) ? data.hindi : defaultEnglish)
          };
        }
        if (typeof data === 'string' || Array.isArray(data)) {
          return { hindi: data, english: data };
        }
        return { hindi: defaultHindi, english: defaultEnglish };
      };

      const newPersona: EraPersona = {
        id: `custom-era-${Date.now()}`,
        name: aiPersona?.name || q,
        title: aiPersona?.title || 'Historical Leader & Pioneer',
        year: aiPersona?.year || 'Historical Era',
        location: aiPersona?.location || 'India / World History',
        gender: inferredGender,
        avatarUrl: inferredGender === 'female' 
          ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Sarojini_Naidu_1912.jpg/440px-Sarojini_Naidu_1912.jpg'
          : 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Sardar_patel_%28cropped%29.jpg/440px-Sardar_patel_%28cropped%29.jpg',
        bgGradient: 'from-purple-950 via-slate-900 to-indigo-950',
        greeting: ensureBilingual(aiPersona?.greeting, 
          `जय हिंद! मैं ${q} हूँ। काल-यात्रा में आपका स्वागत है। आप मुझसे इतिहास, सिद्धांतों, निर्णयों और परीक्षा के मुख्य बिंदुओं पर प्रश्न पूछ सकते हैं।`,
          `Greetings! I am ${q}. Welcome to the Time Portal. Debate history, decisions and principles with me.`
        ) as any,
        systemPersona: aiPersona?.systemPersona || `You are ${q}. You are ${inferredGender === 'female' ? 'Female' : 'Male'}. Speak in character with deep historical accuracy, wisdom, and eloquence.`,
        examRelevance: ensureBilingual(aiPersona?.examRelevance,
          [`${q} के मुख्य ऐतिहासिक मील के पत्थर और परीक्षा बिंदु`, `राष्ट्रीय आंदोलन / वैज्ञानिक / संवैधानिक इतिहास में भूमिका`, `अक्सर पूछे जाने वाले PYQ प्रश्न`],
          [`${q} Key historical milestones and exam points`, `Role in national movement / scientific / constitutional history`, `Frequently asked PYQ questions`]
        ) as any,
        whatIfScenarios: ensureBilingual(aiPersona?.whatIfScenarios,
          [`क्या होता अगर ${q} ने एक अलग रणनीति अपनाई होती?`, `इतिहास के इस महत्वपूर्ण मोड़ पर आपके निर्णय का क्या प्रभाव रहा?`],
          [`What if ${q} had taken a different strategy?`, `What was the impact of your decision at this important turning point in history?`]
        ) as any
      };

      setEraList(prev => [...prev, newPersona]);
      handleSelectEra(newPersona);
      setSearchPersonaQuery('');
      showToast(language === 'hindi' ? `✨ "${q}" के साथ समय-यात्रा शुरू!` : `✨ Time Travel initialized with "${q}"!`, "success");
    } catch (err) {
      showToast("Could not generate persona, try another query.", "error");
    } finally {
      setIsSearchingPersona(false);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      // Build conversation context
      const chatPayload = [
        ...messages.slice(-6).map(m => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text
        })),
        { role: 'user', content: query }
      ];

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatPayload,
          systemInstruction: `${selectedEra.systemPersona}\n\nCRITICAL LANGUAGE MANDATE: The user has selected ${language.toUpperCase()} as their primary language interface. You MUST respond as ${selectedEra.name} strictly in ${language === 'hindi' ? 'pure articulate Hindi' : 'standard English'}. Even if the user switches partially, maintain the chosen ${language} tone unless they explicitly ask to switch languages. Speak with authentic authority, historical accuracy, and inspiring wisdom.`
        })
      });

      if (res.ok) {
        const data = await res.json();
        const personaMsg: ChatMessage = {
          id: `persona-${Date.now()}`,
          sender: 'persona',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, personaMsg]);
      } else {
        throw new Error("Failed to talk with persona");
      }
    } catch (err) {
      // Meaningful in-character fallback response instead of static error
      let fallbackText = "";
      if (selectedEra.id === 'ambedkar-1949') {
        fallbackText = language === 'hindi' || query.toLowerCase().includes('hindi')
          ? `भारतीय संविधान के निर्माण में मेरी भूमिका प्रारूप समिति (Drafting Committee) के अध्यक्ष के रूप में अत्यंत निर्णायक रही। हमने 2 वर्ष, 11 महीने और 18 दिनों में विश्व के सबसे विस्तृत संविधान का निर्माण किया। इसमें भाग 3 के तहत 6 मौलिक अधिकार तथा अनुच्छेद 32 को 'संविधान की आत्मा' के रूप में स्थापित किया ताकि प्रत्येक नागरिक के अधिकारों की रक्षा सर्वोच्च न्यायालय कर सके। इसके अतिरिक्त राज्य के नीति निर्देशक तत्व (DPSP) और सामाजिक न्याय की नींव रखी गई।`
          : `My role as Chairman of the Drafting Committee was to architect a robust constitutional framework based on Liberty, Equality, and Fraternity. We incorporated Fundamental Rights (Part III), Directive Principles (Part IV), and Article 32 as the cornerstone of judicial remedies.`;
      } else {
        fallbackText = language === 'hindi'
          ? `${selectedEra.name} के रूप में, मैं आपको बताना चाहता हूँ कि हमारे ऐतिहासिक निर्णयों और सिद्धांतों ने राष्ट्र निर्माण की दिशा तय की। आप मुझसे इस विषय में कोई भी विशिष्ट प्रश्न पूछ सकते हैं।`
          : `As ${selectedEra.name}, I stand ready to discuss our historical principles, strategic decisions, and constitutional milestones with you.`;
      }

      const fallbackMsg: ChatMessage = {
        id: `persona-fb-${Date.now()}`,
        sender: 'persona',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeakText = (msgId: string, text: string) => {
    if (isSpeakingMsgId === msgId) {
      stopAllSpeech();
      setIsSpeakingMsgId(null);
    } else {
      stopAllSpeech();
      setIsSpeakingMsgId(msgId);
      // Explicitly pass hindi language tag if text contains Devanagari or app language is hindi
      const isHindiScript = /[\u0900-\u097F]/.test(text) || language === 'hindi';
      speakText(text, { 
        lang: isHindiScript ? 'hi-IN' : 'en-US',
        gender: selectedEra.gender, 
        rate: audioSpeed,
        pitch: selectedEra.gender === 'female' ? 1.15 : 0.85,
        onEnd: () => setIsSpeakingMsgId(null),
        onError: () => setIsSpeakingMsgId(null)
      });
    }
  };

  return (
    <FullScreenLayout
      title={language === 'hindi' ? `⏳ काल-यात्रा: ${selectedEra.name}` : `⏳ Time Travel: ${selectedEra.name}`}
      isHindi={language === 'hindi'}
    >
      <div className="w-full px-4 sm:px-8 py-6 text-slate-100 space-y-6">
        
        {/* HEADER BAR */}
        <div className="bg-[#0D1527] border-b border-indigo-500/30 px-3 py-2 flex items-center justify-between gap-2 shadow-sm rounded-t-xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-indigo-600 flex items-center justify-center text-white shrink-0">
              <Compass className="w-4 h-4 animate-spin-slow" />
            </div>
            <h1 className="text-sm font-black text-white hidden sm:block">
              {language === 'hindi' ? '⏳ काल-यात्रा' : '⏳ Time Travel'}
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <AudioSpeedControl
              currentRate={audioSpeed}
              onRateChange={(rate) => {
                setAudioSpeed(rate);
                if (isSpeakingMsgId) {
                  stopAllSpeech();
                  setIsSpeakingMsgId(null);
                }
              }}
              isHindi={language === 'hindi'}
            />
          </div>
        </div>

      {/* UNIVERSAL HISTORICAL PERSONA SEARCH BAR */}
      <form onSubmit={handleSearchPersona} className="relative w-full">
        <div className="bg-[#0D1527] border-2 border-indigo-500/50 focus-within:border-amber-400 rounded-2xl p-2 flex items-center gap-2 shadow-xl">
          <Search className="w-5 h-5 text-indigo-400 ml-3 shrink-0" />
          <input
            type="text"
            value={searchPersonaQuery}
            onChange={(e) => setSearchPersonaQuery(e.target.value)}
            placeholder={
              language === 'hindi'
                ? "यहाँ किसी भी महापुरुष का नाम टाइप करें (उदा. महाराणा प्रताप)..."
                : "Type any historical person (e.g. Einstein)..."
            }
            className="flex-1 bg-transparent text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none px-2 py-1.5 font-semibold"
            disabled={isSearchingPersona}
          />
          
          {/* VOICE SEARCH MIC BUTTON */}
          <button
            type="button"
            onClick={handleToggleVoiceSearch}
            className={`p-3 rounded-xl transition-all border cursor-pointer shrink-0 flex items-center gap-1.5 text-xs sm:text-sm font-bold ${
              isListeningSearch
                ? 'bg-rose-500 text-white border-rose-400 animate-pulse shadow-lg ring-2 ring-rose-400/50'
                : 'bg-slate-800 text-amber-300 border-amber-500/30 hover:bg-amber-900/40 hover:text-white'
            }`}
            title={language === 'hindi' ? 'बोलकर खोजें (Voice Search)' : 'Speak to Search'}
          >
            {isListeningSearch ? <MicOff className="w-4 h-4 animate-bounce" /> : <Mic className="w-4 h-4" />}
            <span className="hidden sm:inline font-bold">{isListeningSearch ? (language === 'hindi' ? 'सुन रहे हैं...' : 'Listening...') : (language === 'hindi' ? 'बोलें' : 'Voice')}</span>
          </button>

          <button
            type="submit"
            disabled={isSearchingPersona || !searchPersonaQuery.trim()}
            className="px-5 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm transition-all border-none cursor-pointer flex items-center gap-2 shrink-0 active:scale-95 disabled:opacity-40 shadow-md"
          >
            {isSearchingPersona ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin text-slate-950" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 text-slate-950" />
                <span>{language === 'hindi' ? 'काल-यात्रा शुरू करें' : 'Start Time-Travel'}</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* PERSONA SELECTION CAROUSEL */}
      <div className="flex items-center gap-3 overflow-x-auto pb-3 scrollbar-none">
        {eraList.map((era) => {
          const isSelected = era.id === selectedEra.id;
          return (
            <button
              key={era.id}
              onClick={() => handleSelectEra(era)}
              className={`flex items-center gap-3.5 p-3.5 rounded-2xl border transition-all cursor-pointer text-left shrink-0 min-w-[220px] max-w-xs ${
                isSelected 
                  ? 'bg-gradient-to-r from-indigo-950 to-slate-900 border-amber-400 shadow-xl ring-2 ring-amber-400/40' 
                  : 'bg-[#0B101D] border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="relative">
                <img 
                  src={era.avatarUrl} 
                  alt={era.name} 
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400/50 shrink-0 bg-slate-800 shadow-sm"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="absolute -bottom-1 -right-1 text-xs bg-slate-950 px-1.5 py-0.5 rounded-full border border-slate-700">
                  {era.gender === 'female' ? '👩' : '👨'}
                </span>
              </div>
              <div className="overflow-hidden space-y-0.5">
                <span className="text-sm sm:text-base font-extrabold text-white truncate block tracking-wide">{era.name}</span>
                <span className="text-xs text-amber-300 font-bold block">{era.year} • {era.gender === 'female' ? 'Female Voice 🎙️' : 'Male Voice 🎙️'}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* MAIN CONVERSATION & EXAM RELEVANCE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT: CHAT INTERFACE WITH HISTORICAL PERSONA (7 COLS) */}
        <div className="lg:col-span-7 bg-[#080C16] border border-slate-800 rounded-3xl shadow-2xl flex flex-col h-[620px] overflow-hidden">
          
          {/* CHAT HEADER */}
          <div className={`p-4 bg-gradient-to-r ${selectedEra.bgGradient} border-b border-slate-800 flex items-center justify-between`}>
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <img 
                  src={selectedEra.avatarUrl} 
                  alt={selectedEra.name} 
                  className="w-13 h-13 rounded-2xl object-cover border-2 border-amber-400/60 shadow-md bg-slate-800" 
                />
                <span className="absolute -bottom-1 -right-1 text-xs bg-slate-950 px-1.5 rounded-full border border-slate-700">
                  {selectedEra.gender === 'female' ? '👩' : '👨'}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-white">{selectedEra.name}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-extrabold border border-amber-400/40">
                    {selectedEra.gender === 'female' ? 'Female Voice' : 'Male Voice'}
                  </span>
                </div>
                <p className="text-xs text-amber-200 font-bold mt-0.5">{selectedEra.title} ({selectedEra.year})</p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-500/40 flex items-center gap-1.5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Connected Live
            </span>
          </div>

          {/* CHAT MESSAGES LOG */}
          <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-[#050812]">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div 
                  key={msg.id} 
                  className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <img 
                      src={selectedEra.avatarUrl} 
                      alt="Avatar" 
                      className="w-10 h-10 rounded-xl object-cover border-2 border-amber-400/50 shrink-0 mt-1 bg-slate-800 shadow-sm" 
                    />
                  )}

                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm sm:text-base space-y-2 ${
                    isUser 
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold rounded-tr-none shadow-md' 
                      : 'bg-[#0E1526] border border-slate-700/80 text-[#F8FAFC] font-medium leading-relaxed rounded-tl-none shadow-md'
                  }`}>
                    <p className="whitespace-pre-line leading-relaxed text-sm sm:text-base">{msg.text}</p>
                    
                    <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                      <span className="font-mono text-[11px] text-slate-400">{msg.timestamp}</span>
                      {!isUser && (
                        <button
                          onClick={() => handleSpeakText(msg.id, msg.text)}
                          className="px-2.5 py-1 bg-slate-800/90 hover:bg-slate-700 text-amber-300 rounded-lg border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5 font-bold text-xs"
                          title={selectedEra.gender === 'female' ? "Listen in Female Voice" : "Listen in Male Voice"}
                        >
                          {isSpeakingMsgId === msg.id ? (
                            <>
                              <VolumeX className="w-4 h-4 text-amber-400 animate-pulse" />
                              <span className="text-amber-300 font-bold">Stop</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-4 h-4 text-amber-400" />
                              <span className="text-amber-300 font-bold">
                                {selectedEra.gender === 'female' ? '👩 सुनें (Female Voice)' : '👨 सुनें (Male Voice)'}
                              </span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2.5 text-sm text-amber-300 font-bold bg-[#0D1527] p-3.5 rounded-2xl w-fit border border-amber-500/30">
                <Compass className="w-5 h-5 animate-spin text-amber-400" />
                <span>{selectedEra.name} {language === 'hindi' ? 'इतिहास के पृष्ठों से उत्तर सोच रहे हैं...' : 'is responding from history...'}</span>
              </div>
            )}
          </div>

          {/* CHAT INPUT FORM */}
          <div className="p-3.5 bg-[#090D1A] border-t border-slate-800 flex items-center gap-2.5">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={
                language === 'hindi'
                  ? `${selectedEra.name} से प्रश्न पूछें (e.g. Hindi me batao aapka bhumika kya raha hai)...`
                  : `Ask or speak to ${selectedEra.name} about historical events, decisions or articles...`
              }
              className="flex-1 bg-[#050812] border border-slate-700/80 rounded-xl px-4 py-3 text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 font-medium"
            />
            <button
              type="button"
              onClick={handleToggleVoiceChat}
              className={`p-3 rounded-xl transition-all border cursor-pointer shrink-0 ${
                isListeningChat
                  ? 'bg-rose-500 text-white border-rose-400 animate-pulse ring-2 ring-rose-400/50'
                  : 'bg-slate-900 text-amber-300 border-amber-500/40 hover:bg-amber-900/40 hover:text-white'
              }`}
              title={language === 'hindi' ? 'बोलकर प्रश्न पूछें' : 'Speak your question'}
            >
              {isListeningChat ? <MicOff className="w-5 h-5 animate-bounce" /> : <Mic className="w-5 h-5" />}
            </button>
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputQuery.trim()}
              className="p-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 rounded-xl font-black transition-all border-none cursor-pointer disabled:opacity-40 shrink-0 shadow-md"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* RIGHT: EXAM PYQ RELEVANCE & WHAT-IF SCENARIO ENGINE (5 COLS) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* EXAM RELEVANCE BADGES */}
          <div className="bg-[#0B101D] border border-amber-500/40 p-5 rounded-3xl space-y-3.5 shadow-xl">
            <div className="flex items-center gap-2 text-amber-300 font-black text-xs sm:text-sm uppercase tracking-wider">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span>{language === 'hindi' ? '🎯 प्रतियोगी परीक्षा दृष्टिकोण (Exam Points):' : '🎯 Exam High-Yield Points:'}</span>
            </div>

            <ul className="space-y-2.5">
              {(selectedEra.examRelevance[language === 'hindi' ? 'hindi' : 'english'] || selectedEra.examRelevance['english']).map((point, idx) => (
                <li key={idx} className="p-3 bg-[#070B14] border border-slate-800 rounded-2xl text-xs sm:text-sm font-semibold text-slate-100 flex items-start gap-2.5 leading-relaxed">
                  <Flame className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* "WHAT-IF" HISTORICAL SCENARIO PROMPTS */}
          <div className="bg-gradient-to-br from-indigo-950/80 to-slate-900 border border-indigo-500/40 p-5 rounded-3xl space-y-3.5 shadow-xl">
            <div className="flex items-center gap-2 text-indigo-300 font-black text-xs sm:text-sm uppercase tracking-wider">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span>{language === 'hindi' ? '🔮 "What-If" व त्वरित प्रश्न सिमुलेटर:' : '🔮 "What-If" & Instant Inquiry Prompts:'}</span>
            </div>

            <div className="space-y-2.5">
              {(selectedEra.whatIfScenarios[language === 'hindi' ? 'hindi' : 'english'] || selectedEra.whatIfScenarios['english']).map((scenario, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(scenario)}
                  className="w-full text-left p-3.5 bg-[#080C16] hover:bg-indigo-900/50 border border-indigo-500/30 hover:border-indigo-400 rounded-2xl text-xs sm:text-sm font-bold text-indigo-100 transition-all cursor-pointer flex items-center justify-between group shadow-xs"
                >
                  <span className="leading-snug">{scenario}</span>
                  <Play className="w-4 h-4 text-indigo-400 group-hover:scale-125 transition-transform shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  </FullScreenLayout>
  );
};
