export interface GisStateInfo {
  id: string;
  nameHi: string;
  nameEn: string;
  capitalHi: string;
  capitalEn: string;
  highestPeak: string;
  majorRivers: string[];
  keyMineralsOrCrops: string;
  famousPark: string;
  examFactHi: string;
  examFactEn: string;
  color: string;
}

export interface GisLayerItem {
  id: string;
  nameHi: string;
  nameEn: string;
  category: 'river' | 'mountain' | 'monsoon' | 'park' | 'mineral' | 'port' | 'soil';
  location: string;
  coordinates?: { x: number; y: number };
  detailsHi: string;
  detailsEn: string;
  examSignificance: string;
  icon: string;
}

export interface PptSlide {
  id: string;
  slideNumber: number;
  titleHi: string;
  titleEn: string;
  category: 'india_physical' | 'rivers' | 'monsoon' | 'minerals' | 'earth_astronomy' | 'geology' | 'atmosphere' | 'world_geo';
  subtitleHi: string;
  subtitleEn: string;
  keyPointsHi: string[];
  keyPointsEn: string[];
  examQuestions: {
    questionHi: string;
    questionEn: string;
    options: string[];
    correctIndex: number;
    explanationHi: string;
    explanationEn: string;
  }[];
  mapViewType: 'india_map' | 'earth_3d' | 'layers_cutaway' | 'atmosphere_stack' | 'monsoon_flow' | 'plate_collision';
  activeLayerFilter?: string;
  diagramBadges: string[];
}

export const INDIAN_STATES_DATA: GisStateInfo[] = [
  {
    id: 'JK_LADAKH',
    nameHi: 'लद्दाख व जम्मू-कश्मीर',
    nameEn: 'Ladakh & Jammu & Kashmir',
    capitalHi: 'लेह / श्रीनगर',
    capitalEn: 'Leh / Srinagar',
    highestPeak: 'K2 (गॉडविन ऑस्टिन - 8611m) & काराकोरम',
    majorRivers: ['सिंधु (Indus)', 'झेलम (Jhelum)', 'चिनाब (Chenab)'],
    keyMineralsOrCrops: 'केसर (Saffron - GI Tag), सेब, अखरोट',
    famousPark: 'हेमिस राष्ट्रीय उद्यान (भारत का सबसे बड़ा National Park)',
    examFactHi: 'केसर की खेती के लिए प्रसिद्ध जाफरान मिट्टी (करेवा / Karewa) कश्मीर घाटी में पाई जाती है।',
    examFactEn: 'Karewa soil formation in Kashmir valley is world-famous for Saffron (Zaffron) cultivation.',
    color: '#38bdf8'
  },
  {
    id: 'HP_UK',
    nameHi: 'हिमाचल प्रदेश व उत्तराखण्ड',
    nameEn: 'Himachal Pradesh & Uttarakhand',
    capitalHi: 'शिमला / देहरादून',
    capitalEn: 'Shimla / Dehradun',
    highestPeak: 'नंदा देवी (7816m) & कामेट',
    majorRivers: ['गंगा', 'यमुना', 'सतलुज', 'व्यास', 'रावी'],
    keyMineralsOrCrops: 'जलविद्युत ऊर्जा, सेब, चाय (कांगड़ा)',
    famousPark: 'जिम कॉर्बेट (पहला National Park - 1936), फूलों की घाटी (Valley of Flowers)',
    examFactHi: 'भागीरथी और अलकनंदा का संगम देवप्रयाग में होता है, जहाँ से इसे "गंगा" कहा जाता है।',
    examFactEn: 'Confluence of Bhagirathi and Alaknanda at Devprayag forms the sacred Ganga river.',
    color: '#60a5fa'
  },
  {
    id: 'PUNJAB_HARYANA',
    nameHi: 'पंजाब व हरियाणा',
    nameEn: 'Punjab & Haryana',
    capitalHi: 'चंडीगढ़',
    capitalEn: 'Chandigarh',
    highestPeak: 'करोह पीक (मोरनी हिल्स)',
    majorRivers: ['सतलुज', 'ब्यास', 'घग्घर'],
    keyMineralsOrCrops: 'गेहूं (Wheat Bowl), बासमती चावल, सरसों',
    famousPark: 'सुल्तानपुर राष्ट्रीय उद्यान, कालेसर',
    examFactHi: 'हरित क्रांति (Green Revolution - 1966-67) का सर्वाधिक प्रभाव पंजाब-हरियाणा के गेहूं उत्पादन पर पड़ा।',
    examFactEn: 'The Green Revolution (1966-67) had its most massive transformative impact on Punjab & Haryana.',
    color: '#34d399'
  },
  {
    id: 'RAJASTHAN',
    nameHi: 'राजस्थान',
    nameEn: 'Rajasthan',
    capitalHi: 'जयपुर (Pink City)',
    capitalEn: 'Jaipur',
    highestPeak: 'गुरु शिखर (अरावली - 1722m)',
    majorRivers: ['चंबल', 'लूनी (अंतःस्थलीय)', 'बनास', 'माही'],
    keyMineralsOrCrops: 'जस्ता (Lead-Zinc - जावर), तांबा (खेतड़ी), संगमरमर (मकराना), बाजरा, सरसों',
    famousPark: 'रणथंभौर, केवलादेव घाना (UNESCO बर्ड सैंक्चुअरी), सरिस्का',
    examFactHi: 'अरावली पर्वतमाला विश्व की सबसे प्राचीनतम वलित अवशिष्ट (Residual Fold) पर्वत श्रृंखला है। लूनी नदी कच्छ के रण में विलीन होती है।',
    examFactEn: 'Aravalli is one of the oldest fold mountain systems in the world. River Luni drains into Rann of Kutch.',
    color: '#fbbf24'
  },
  {
    id: 'UP_BIHAR',
    nameHi: 'उत्तर प्रदेश व बिहार',
    nameEn: 'Uttar Pradesh & Bihar',
    capitalHi: 'लखनऊ / पटना',
    capitalEn: 'Lucknow / Patna',
    highestPeak: 'सोमेश्वर किला (बिहार) / शिवालिक पहाड़ियाँ',
    majorRivers: ['गंगा', 'यमुना', 'घाघरा', 'गंडक', 'कोसी (बिहार का शोक)', 'सोन'],
    keyMineralsOrCrops: 'गन्ना (Sugarcane), गेहूं, चावल, आलू, जूट',
    famousPark: 'दुधवा राष्ट्रीय उद्यान (UP), वाल्मीकि राष्ट्रीय उद्यान (Bihar)',
    examFactHi: 'गंगा का मैदान सर्वाधिक उपजाऊ जलोढ़ मृदा (खादर - नवीन व बांगर - पुरानी) से बना है। सोन नदी दक्षिण से उत्तर की ओर बहकर गंगा में मिलती है।',
    examFactEn: 'The Gangetic plain features ultra-fertile Alluvial soil (Khadar & Bhangar). River Son flows south-to-north into Ganga.',
    color: '#4ade80'
  },
  {
    id: 'GUJARAT',
    nameHi: 'गुजरात',
    nameEn: 'Gujarat',
    capitalHi: 'गांधीनगर',
    capitalEn: 'Gandhinagar',
    highestPeak: 'गिरनार (1117m)',
    majorRivers: ['नर्मदा', 'तापी', 'साबरमती', 'माही (कर्क रेखा को दो बार काटती है)'],
    keyMineralsOrCrops: 'कपास (Black Soil), मूंगफली, नमक (कांडला), पेट्रोलियम (अंकलेश्वर)',
    famousPark: 'गिर राष्ट्रीय उद्यान (एशियाई शेरों का एकमात्र प्राकृतिक आवास), ब्लैकबक',
    examFactHi: 'गुजरात की तटरेखा (1214 किमी) भारत में सबसे लंबी है। माही नदी कर्क रेखा (Tropic of Cancer) को दो बार पार करती है।',
    examFactEn: 'Gujarat has the longest coastline in India (1214 km). River Mahi crosses the Tropic of Cancer twice.',
    color: '#f59e0b'
  },
  {
    id: 'MP_CG',
    nameHi: 'मध्य प्रदेश व छत्तीसगढ़',
    nameEn: 'Madhya Pradesh & Chhattisgarh',
    capitalHi: 'भोपाल / रायपुर',
    capitalEn: 'Bhopal / Raipur',
    highestPeak: 'धूपगढ़ (महादेव पहाड़ियाँ - 1350m)',
    majorRivers: ['नर्मदा (धुआंधार जलप्रपात)', 'तापी', 'चंबल', 'महानदी', 'बेतवा'],
    keyMineralsOrCrops: 'हीरा (पन्ना), तांबा (मलांजखंड), कोयला (कोरबा), सोयाबीन (Soy State), दलहन',
    famousPark: 'कान्हा, बांधवगढ़, कुनो (चीता प्रोजेक्ट), इंद्रावती',
    examFactHi: 'मध्य प्रदेश को "टाइगर स्टेट" और "नदियों का मायका" कहा जाता है। नर्मदा व तापी भ्रंश घाटी (Rift Valley) में बहती हैं और एश्चुअरी बनाती हैं।',
    examFactEn: 'MP is known as Tiger State. Narmada & Tapi flow through Rift Valleys into the Arabian Sea forming estuaries.',
    color: '#fb7185'
  },
  {
    id: 'WB_NE',
    nameHi: 'पश्चिम बंगाल व पूर्वोत्तर राज्य (Seven Sisters)',
    nameEn: 'West Bengal & North-East States',
    capitalHi: 'कोलकाता / गुवाहाटी / शिलांग / अगरतला',
    capitalEn: 'Kolkata / Guwahati / Shillong',
    highestPeak: 'कंचनजंगा (सिक्किम - 8586m), सारामती (नागालैंड)',
    majorRivers: ['ब्रह्मपुत्र (दिहांग/सांगपो)', 'हुगली', 'तीस्ता', 'बराक'],
    keyMineralsOrCrops: 'चाय (दार्जिलिंग/असम), जूट (Golden Fibre), खनिज तेल (डिगबोई - भारत का पहला तेल कुआं)',
    famousPark: 'काजीरंगा (एक सींग वाला गैंडा), सुंदरबन (रॉयल बंगाल टाइगर, मैंग्रोव डेल्टा), केइबुल लामजाओ (तैरता हुआ पार्क - मणिपुर)',
    examFactHi: 'माजुली द्वीप (ब्रह्मपुत्र नदी, असम) विश्व का सबसे बड़ा नदी द्वीप (River Island) है। मौसिनराम (मेघालय) विश्व में सर्वाधिक वर्षा वाला स्थान है।',
    examFactEn: 'Majuli on Brahmaputra is the world\'s largest river island. Mawsynram (Meghalaya) receives highest global rainfall.',
    color: '#a78bfa'
  },
  {
    id: 'MAHARASHTRA',
    nameHi: 'महाराष्ट्र',
    nameEn: 'Maharashtra',
    capitalHi: 'मुंबई (वित्तीय राजधानी)',
    capitalEn: 'Mumbai',
    highestPeak: 'कलसूबाई (1646m - पश्चिमी घाट)',
    majorRivers: ['गोदावरी (दक्षिण गंगा - त्र्यंबकेश्वर)', 'कृष्णा (महाबलेश्वर)', 'भीमा'],
    keyMineralsOrCrops: 'कपास (रेगुर मिट्टी), गन्ना, प्याज, बॉक्साइट, पेट्रोलियम (बॉम्बे हाई)',
    famousPark: 'ताडोबा-अंधारी, संजय गांधी राष्ट्रीय उद्यान',
    examFactHi: 'दक्कन का पठार (Deccan Trap) बेसाल्टिक लावा के उद्भेदन से बना है, जिस पर कपास हेतु सर्वोत्तम काली मिट्टी (Regur) पाई जाती है।',
    examFactEn: 'The Deccan Trap is formed of basaltic volcanic lava, creating mineral-rich black cotton soil (Regur).',
    color: '#f97316'
  },
  {
    id: 'ODISHA_JHARKHAND',
    nameHi: 'ओडिशा व झारखण्ड (छोटा नागपुर)',
    nameEn: 'Odisha & Jharkhand (Chota Nagpur)',
    capitalHi: 'भुवनेश्वर / रांची',
    capitalEn: 'Bhubaneswar / Ranchi',
    highestPeak: 'पारसनाथ (झारखण्ड) / देओमाली (ओडिशा)',
    majorRivers: ['महानदी (हीराकुंड बांध - सबसे लंबा बांध)', 'दामोदर (बंगाल का शोक)', 'सुवर्णरेखा'],
    keyMineralsOrCrops: 'लौह अयस्क (मयूरभंज/नोआमुंडी), कोयला (झरिया/रानीगंज), यूरेनियम (जादूगोड़ा), बॉक्साइट',
    famousPark: 'सिमलीपाल, भितरकनिका (ऑलिव रिडले कछुए), बेतला',
    examFactHi: 'छोटा नागपुर पठार को "भारत का रूर (Ruhr of India)" कहा जाता है क्योंकि यह देश के खनिज संसाधनों का हृदय स्थल है।',
    examFactEn: 'Chota Nagpur plateau is called the "Ruhr of India" due to immense coal and iron ore mineral concentration.',
    color: '#c084fc'
  },
  {
    id: 'SOUTH_INDIA',
    nameHi: 'दक्षिण भारत (कर्नाटक, TN, केरल, AP, तेलंगाना)',
    nameEn: 'South Indian States (KA, TN, KL, AP, TS)',
    capitalHi: 'बेंगलुरु / चेन्नई / तिरुवनंतपुरम / हैदराबाद',
    capitalEn: 'Bengaluru / Chennai / Thiruvananthapuram',
    highestPeak: 'अनाइमुडी (2695m - दक्षिण भारत की सर्वोच्च चोटी - केरल)',
    majorRivers: ['कावेरी (शिवसमुद्रम जलप्रपात)', 'तुंगभद्रा', 'पेरियार', 'वैगई'],
    keyMineralsOrCrops: 'कॉफी (बाबा बूदन हिल्स), चाय (नीलगिरि), रबड़, मसाले (केरल - Spices Garden), सोना (कोलार KGF), थोरियम (मोनाजाइट बालू)',
    famousPark: 'बांदीपुर, नागरहोल, पेरियार (हाथी अभयारण्य), साइलेंट वैली (शांत घाटी)',
    examFactHi: 'नीलगिरि पर्वत पर पश्चिमी घाट और पूर्वी घाट का मिलन होता है। अनाइमुडी दक्षिण भारत व पश्चिमी घाट की सबसे ऊंची चोटी है।',
    examFactEn: 'Nilgiri Hills mark the meeting point of Western and Eastern Ghats. Anamudi (2695m) is South India\'s highest peak.',
    color: '#2dd4bf'
  }
];

export const PPT_GEOGRAPHY_SLIDES: PptSlide[] = [
  {
    id: 'slide-india-physiography',
    slideNumber: 1,
    titleHi: 'स्लाइड 1: भारत का भू-आकृतिक विभाजन (Physiographic Divisions)',
    titleEn: 'Slide 1: Physiographic Divisions of India',
    category: 'india_physical',
    subtitleHi: 'हिमालय, उत्तरी मैदान, प्रायद्वीपीय पठार, तटीय मैदान व द्वीप समूह',
    subtitleEn: 'Himalayas, Northern Plains, Peninsular Plateau, Coastal Plains & Islands',
    keyPointsHi: [
      '🏔️ **उत्तरी पर्वतमाला (Himalayas)**: नवीन वलित पर्वत (Young Fold Mountains)। 3 समानांतर श्रेणियां - हिमाद्रि (महान), हिमाचल (मध्य), और शिवालिक (बाह्य)।',
      '🌾 **उत्तरी मैदान (Indo-Gangetic Plain)**: सिंधु, गंगा और ब्रह्मपुत्र की जलोढ़ मृदा से निर्मित। भाभर (कंकड़-पत्थर), तराई (दलदली), बांगर (पुरानी मिट्टी), खादर (नई उपजाऊ मिट्टी)।',
      '🌋 **प्रायद्वीपीय पठार (Peninsular Plateau)**: भारत का सबसे प्राचीन एवं स्थिर भूखंड। त्रिभुजाकार दक्कन ट्रैप और छोटा नागपुर पठार।',
      '🌊 **तटीय मैदान (Coastal Plains)**: पश्चिमी तटीय मैदान (संकीर्ण, एश्चुअरी) व पूर्वी तटीय मैदान (चौड़ा, उपजाऊ डेल्टा)।'
    ],
    keyPointsEn: [
      '🏔️ **Himalayan Mountain Wall**: Young fold mountain belt spanning 2400 km in an arc from Indus to Brahmaputra.',
      '🌾 **Indo-Gangetic-Brahmaputra Plains**: World\'s densest alluvial plain characterized by Bhabar, Terai, Bhangar, and Khadar zones.',
      '🌋 **Peninsular Plateau**: Ancient Gondwanaland shield block of hard crystalline rocks with rich mineral wealth.',
      '🌊 **Coastal Strips**: West coast (Konkan, Malabar with lagoons/Kayals) and East coast (Coromandel, Northern Circars with deltas).'
    ],
    examQuestions: [
      {
        questionHi: 'नवीनतम जलोढ़ मृदा (New Alluvial Soil) को क्या कहा जाता है?',
        questionEn: 'What is the new alluvial soil deposited by floodplains called?',
        options: ['खादर (Khadar)', 'बांगर (Bhangar)', 'भाभर (Bhabar)', 'रेगुर (Regur)'],
        correctIndex: 0,
        explanationHi: 'खादर प्रतिवर्ष बाढ़ द्वारा लाई गई नई अत्यंत उपजाऊ जलोढ़ मिट्टी होती है, जबकि पुरानी मिट्टी को बांगर कहते हैं।',
        explanationEn: 'Khadar is the newly deposited fertile alluvium on active floodplains, while Bhangar is older elevated alluvium.'
      }
    ],
    mapViewType: 'india_map',
    activeLayerFilter: 'all',
    diagramBadges: ['Himalayan Arc 2400km', 'Gondwana Shield', 'Indo-Gangetic Basin', 'Western & Eastern Ghats']
  },
  {
    id: 'slide-rivers-drainage',
    slideNumber: 2,
    titleHi: 'स्लाइड 2: भारत का अपवाह तंत्र व नदियाँ (Drainage & River Systems)',
    titleEn: 'Slide 2: Drainage & Major River Systems of India',
    category: 'rivers',
    subtitleHi: 'हिमालयी नदियाँ (सदा नीरा) बनाम प्रायद्वीपीय नदियाँ (मौसमी)',
    subtitleEn: 'Himalayan Perennial Rivers vs Peninsular Seasonal Rivers',
    keyPointsHi: [
      '🌊 **सिंधु नदी तंत्र (Indus System)**: उद्गम मानसरोवर के पास बोखर चू। 1960 सिंधु जल संधि (Indus Waters Treaty) - रावी, व्यास, सतलुज का 80% जल भारत को।',
      '🕉️ **गंगा नदी तंत्र (Ganga System)**: उद्गम गंगोत्री हिमनद (भागीरथी)। देवप्रयाग में अलकनंदा से मिलकर गंगा बनती है। भारत की सबसे लंबी नदी (2525 किमी)।',
      '⚡ **ब्रह्मपुत्र तंत्र (Brahmaputra System)**: तिब्बत में सांगपो (Tsangpo), अरुणाचल में दिहांग, असम में ब्रह्मपुत्र। विश्व का सबसे बड़ा नदी द्वीप "माजुली" बनाती है।',
      '🧭 **पश्चिम वाहिनी नदियाँ**: नर्मदा (अमरकंटक) और तापी (मुलताई) भ्रंश घाटी में बहकर खंभात की खाड़ी में एश्चुअरी (Estuary) बनाती हैं।'
    ],
    keyPointsEn: [
      '🌊 **Indus Basin**: Originates near Lake Mansarovar. Major tributaries: Jhelum, Chenab (largest), Ravi, Beas, Sutlej.',
      '🕉️ **Ganga Basin**: Originates as Bhagirathi from Gangotri glacier. Merges with Alaknanda at Devprayag. Longest river in India (2525 km).',
      '⚡ **Brahmaputra**: Originates from Chemayungdung glacier. Enters India via Namcha Barwa gorge as Dihang; hosts Majuli river island.',
      '🧭 **West-Flowing Peninsular**: Narmada & Tapi flow in rift valleys between Vindhya-Satpura ranges into Arabian Sea without forming deltas.'
    ],
    examQuestions: [
      {
        questionHi: 'निम्नलिखित में से कौन सी नदी भ्रंश घाटी (Rift Valley) में बहती है और एश्चुअरी बनाती है?',
        questionEn: 'Which of the following rivers flows through a rift valley and forms an estuary?',
        options: ['नर्मदा (Narmada)', 'गोदावरी (Godavari)', 'महानदी (Mahanadi)', 'कावेरी (Cauvery)'],
        correctIndex: 0,
        explanationHi: 'नर्मदा और तापी दोनों नदियाँ विंध्याचल व सतपुड़ा के बीच भ्रंश घाटी (Rift Valley) से बहती हैं और डेल्टा न बनाकर ज्वारनदमुख (Estuary) बनाती हैं।',
        explanationEn: 'Narmada and Tapi flow through structural rift valleys and empty into the Arabian Sea without forming deltas.'
      }
    ],
    mapViewType: 'india_map',
    activeLayerFilter: 'river',
    diagramBadges: ['Ganga 2525 km', 'Godavari (Dakshin Ganga)', 'Narmada Rift Valley', 'Majuli River Island']
  },
  {
    id: 'slide-mountains-passes',
    slideNumber: 3,
    titleHi: 'स्लाइड 3: पर्वत श्रृंखलाएं एवं प्रमुख दर्रे (Mountain Ranges & Strategic Passes)',
    titleEn: 'Slide 3: Mountain Ranges & Strategic Mountain Passes',
    category: 'india_physical',
    subtitleHi: 'काराकोरम, जोजिला, नाथुला, बोमडिला, पश्चिमी व पूर्वी घाट',
    subtitleEn: 'Karakoram, Zoji La, Shipki La, Nathu La, Western & Eastern Ghats',
    keyPointsHi: [
      '🏔️ **काराकोरम श्रेणी (Karakoram Range)**: भारत की सर्वोच्च चोटी K2 (8611m - गॉडविन ऑस्टिन) और सियाचिन ग्लेशियर (76 किमी) इसी में स्थित हैं।',
      '🚪 **उत्तर के प्रमुख दर्रे (Key Northern Passes)**: जोजिला (श्रीनगर-लेह), बनिहाल/जवाहर टनल (जम्मू-श्रीनगर), शिपकी ला (हिमाचल - सतलुज नदी का प्रवेश), रोहतांग/अटल टनल।',
      '🌿 **पूर्वोत्तर के दर्रे**: नाथु ला व जेलेप ला (सिक्किम - प्राचीन सिल्क रूट), बोमडिला (अरुणाचल प्रदेश), दीफू दर्रा।',
      '⛰️ **पश्चिमी घाट के दर्रे (Western Ghats Gaps)**: थाल घाट (मुंबई-नासिक), भोर घाट (मुंबई-पुणे), पाल घाट (कोच्चि-चेन्नई / नीलगिरि व अन्नामलाई के बीच)।'
    ],
    keyPointsEn: [
      '🏔️ **Karakoram & Trans-Himalayas**: Hosts K2 (Godwin Austen, 8611m) and Siachen Glacier, world\'s highest battlefield.',
      '🚪 **Himalayan Passes**: Zoji La (connects Srinagar to Leh), Shipki La (Sutlej enters India), Lipulekh (Kailash Mansarovar yatra).',
      '🌿 **North-East Passes**: Nathu La & Jelep La (Sikkim Tibet trade routes), Bomdi La (Arunachal Pradesh).',
      '⛰️ **Peninsular Gaps**: Thal Ghat (Mumbai-Nashik), Bhor Ghat (Mumbai-Pune), Pal Ghat (between Nilgiri & Annamalai hills).'
    ],
    examQuestions: [
      {
        questionHi: 'सतलुज नदी किस दर्रे से होकर भारत में प्रवेश करती है?',
        questionEn: 'Through which mountain pass does the Sutlej river enter India from Tibet?',
        options: ['शिपकी ला (Shipki La)', 'जोजिला (Zoji La)', 'नाथु ला (Nathu La)', 'माना दर्रा (Mana Pass)'],
        correctIndex: 0,
        explanationHi: 'सतलुज नदी हिमाचल प्रदेश के किन्नौर जिले में शिपकी ला (Shipki La) दर्रे से होकर भारत में प्रवेश करती है।',
        explanationEn: 'River Sutlej enters India through Shipki La pass in Kinnaur district of Himachal Pradesh.'
      }
    ],
    mapViewType: 'india_map',
    activeLayerFilter: 'mountain',
    diagramBadges: ['K2 Godwin Austen', 'Shipki La & Zoji La', 'Nathu La Silk Route', 'Palghat Gap']
  },
  {
    id: 'slide-monsoon-climate',
    slideNumber: 4,
    titleHi: 'स्लाइड 4: भारतीय मानसून एवं वर्षा का वितरण (Indian Monsoon & Precipitation)',
    titleEn: 'Slide 4: Indian Monsoon Mechanism & Annual Rainfall',
    category: 'monsoon',
    subtitleHi: 'दक्षिण-पश्चिम मानसून (अरब सागर + बंगाल खाड़ी शाखा) व लौटता मानसून',
    subtitleEn: 'South-West Monsoon (Arabian & Bay of Bengal Branches) & ITCZ Shift',
    keyPointsHi: [
      '🌧️ **मानसून का आगमन**: लगभग 1 जून को केरल तट पर (विस्फोट / Monsoon Burst)। यह दो शाखाओं में बंटता है - अरब सागर शाखा व बंगाल की खाड़ी शाखा।',
      '🏔️ **पर्वतीय वर्षा (Orographic Rainfall)**: पश्चिमी घाट की पवनाभिमुख ढाल (Windward slope) पर 250-400 सेमी भारी वर्षा होती है, जबकि वृष्टि छाया क्षेत्र (Rain-shadow) सूखा रहता है।',
      '🍂 **उत्तर-पूर्वी लौटता मानसून (Retreating Monsoon)**: अक्टूबर-नवंबर में बंगाल की खाड़ी से नमी लेकर तमिलनाडु के कोरोमंडल तट पर भारी शीतकालीन वर्षा करता है।',
      '❄️ **पश्चिमी विक्षोभ (Western Disturbances)**: भूमध्य सागर से आने वाले चक्रवात उत्तर-पश्चिम भारत (पंजाब, हरियाणा, पश्चिमी UP) में रबी फसल (गेहूं) हेतु लाभदायक वर्षा करते हैं।'
    ],
    keyPointsEn: [
      '🌧️ **Onset of SW Monsoon**: Hits Kerala coast around June 1st, splitting into the powerful Arabian Sea and Bay of Bengal branches.',
      '🏔️ **Orographic Mechanism**: Heavy precipitation on windward Western Ghats (>300cm), while Deccan interior lies in rain shadow.',
      '🍂 **North-East Retreating Monsoon**: Causes vital winter rainfall on the Coromandel coast (Tamil Nadu) during Oct-Nov.',
      '❄️ **Western Disturbances**: Temperate Mediterranean cyclones bring winter rains to NW plains, crucial for the wheat crop.'
    ],
    examQuestions: [
      {
        questionHi: 'सर्दियों में तमिलनाडु के कोरोमंडल तट पर वर्षा किस कारण से होती है?',
        questionEn: 'Winter rainfall in Coromandel Coast (Tamil Nadu) is caused by which winds?',
        options: ['उत्तर-पूर्वी मानसून (North-East Monsoon)', 'दक्षिण-पश्चिम मानसून', 'पश्चिमी विक्षोभ', 'स्थानीय संवहन'],
        correctIndex: 0,
        explanationHi: 'अक्टूबर-नवंबर में उत्तर-पूर्वी लौटता मानसून बंगाल की खाड़ी से आर्द्रता ग्रहण कर कोरोमंडल तट पर भारी वर्षा करता है।',
        explanationEn: 'The retreating North-East monsoon picks up moisture across the Bay of Bengal and precipitates over Tamil Nadu.'
      }
    ],
    mapViewType: 'india_map',
    activeLayerFilter: 'monsoon',
    diagramBadges: ['Onset June 1 (Kerala)', 'ITCZ Thermal Low', 'Mawsynram 1187cm', 'Tamil Nadu Winter Rain']
  },
  {
    id: 'slide-earth-rotation-seasons',
    slideNumber: 5,
    titleHi: 'स्लाइड 5: पृथ्वी का घूर्णन, परिक्रमण व ऋतु चक्र (Earth Motions & Seasons)',
    titleEn: 'Slide 5: Earth Rotation, Revolution & 4 Seasons PPT',
    category: 'earth_astronomy',
    subtitleHi: '23.5° अक्षीय झुकाव, संक्रांति (Solstices) व विषुव (Equinoxes)',
    subtitleEn: '23.5° Axial Tilt, Summer/Winter Solstices & Equinoxes',
    keyPointsHi: [
      '🌐 **दैनिक गति (घूर्णन)**: पश्चिम से पूर्व 23 घंटे 56 मिनट में। दिन और रात का बनना। कोरिओलिस बल द्वारा पवनों की दिशा में परिवर्तन (फेरेल नियम)।',
      '☀️ **वार्षिक गति (परिक्रमण)**: 365 दिन 6 घंटे में सूर्य के चारों ओर अंडाकार कक्षा में। ऋतु परिवर्तन (Seasons)।',
      '🔥 **21 जून (कर्क संक्रांति / Summer Solstice)**: सूर्य कर्क रेखा (23.5°N) पर लंबवत चमकता है। उत्तरी गोलार्ध का सबसे बड़ा दिन।',
      '❄️ **22 दिसंबर (मकर संक्रांति / Winter Solstice)**: सूर्य मकर रेखा (23.5°S) पर लंबवत। दक्षिणी गोलार्ध में सबसे बड़ा दिन (ऑस्ट्रेलिया में ग्रीष्म)।',
      '⚖️ **21 मार्च & 23 सितंबर (विषुव / Equinox)**: सूर्य भूमध्य रेखा पर लंबवत। संपूर्ण पृथ्वी पर 12 घंटे दिन व 12 घंटे रात।'
    ],
    keyPointsEn: [
      '🌐 **Axial Rotation**: West-to-East in 23h 56m; produces diurnal cycle and Coriolis deflection force.',
      '☀️ **Orbital Revolution**: 365.25 days elliptical trajectory coupled with 23.5° axial tilt creates 4 distinct seasons.',
      '🔥 **June 21 (Summer Solstice)**: Direct solar rays on Tropic of Cancer (23.5°N); longest day in Northern Hemisphere.',
      '❄️ **Dec 22 (Winter Solstice)**: Direct solar rays on Tropic of Capricorn (23.5°S); longest day in Southern Hemisphere.',
      '⚖️ **March 21 & Sept 23 (Equinoxes)**: Sun over Equator (0°); equal 12-hour day and night worldwide.'
    ],
    examQuestions: [
      {
        questionHi: 'किस तिथि को संपूर्ण पृथ्वी पर दिन और रात की अवधि बराबर (विषुव / Equinox) होती है?',
        questionEn: 'On which dates are day and night of equal duration globally (Equinox)?',
        options: ['21 मार्च व 23 सितंबर', '21 जून व 22 दिसंबर', '4 जुलाई व 3 जनवरी', '1 जनवरी व 1 जुलाई'],
        correctIndex: 0,
        explanationHi: '21 मार्च (वसंत विषुव) और 23 सितंबर (शरद विषुव) को सूर्य की किरणें भूमध्य रेखा पर लंबवत पड़ती हैं, जिससे दोनों गोलार्धों में दिन-रात बराबर होते हैं।',
        explanationEn: 'On March 21 (Vernal Equinox) and September 23 (Autumnal Equinox), sun rays fall vertically on the Equator.'
      }
    ],
    mapViewType: 'earth_3d',
    diagramBadges: ['23.44° Axial Tilt', 'June 21 Solstice', 'Dec 22 Solstice', 'March/Sept Equinox']
  },
  {
    id: 'slide-earth-interior-layers',
    slideNumber: 6,
    titleHi: 'स्लाइड 6: पृथ्वी की आंतरिक संरचना (Interior Layers: Crust, Mantle, Core)',
    titleEn: 'Slide 6: Earth Interior Structure (SIAL, SIMA, NIFE)',
    category: 'geology',
    subtitleHi: 'क्रस्ट (भू-पर्पटी), मैंटल (एस्थेनोस्फीयर) व कोर (तरल बाह्य + ठोस आंतरिक क्रोड)',
    subtitleEn: 'Lithosphere Crust, Asthenospheric Mantle & Dynamo NIFE Core',
    keyPointsHi: [
      '🪨 **क्रस्ट (Crust / भू-पर्पटी)**: 0-35 किमी। महाद्वीपीय क्रस्ट SIAL (सिलिका + एल्युमिनियम) व महासागरीय क्रस्ट SIMA (सिलिका + मैग्नीशियम) से बना है।',
      '🌋 **मैंटल (Mantle / प्रवार)**: 35-2900 किमी। पृथ्वी के कुल आयतन का 84%। ऊपरी भाग "एस्थेनोस्फीयर (Asthenosphere)" अर्ध-तरल मैग्मा का स्रोत है जो प्लेटों को चलाता है।',
      '🧲 **कोर (Core / क्रोड - NIFE)**: 2900-6371 किमी। निकल (Ni) और फेरस/लोहा (Fe)। बाह्य कोर तरल अवस्था में होने के कारण भू-चुंबकीय क्षेत्र (Magnetic Dynamo) उत्पन्न करता है।',
      '📏 **प्रमुख असंबद्धताएं (Discontinuities)**: मोहो असंबद्धता (क्रस्ट व मैंटल के बीच), गुटेनबर्ग असंबद्धता (मैंटल व कोर के बीच), लेहमेन असंबद्धता (बाह्य व आंतरिक कोर के बीच)।'
    ],
    keyPointsEn: [
      '🪨 **Crust**: 0-35km depth. Continental crust composed of SIAL (granitic) & oceanic of SIMA (basaltic).',
      '🌋 **Mantle**: 35-2900km depth; forms 84% volume. Upper Asthenosphere provides plastic medium for tectonic convection.',
      '🧲 **Core (NIFE)**: Outer Core is molten liquid creating geomagnetic field; Inner Core is ultra-dense solid iron-nickel under extreme pressure.',
      '📏 **Discontinuities**: Moho (Crust-Mantle boundary), Gutenberg (Mantle-Core boundary), Lehmann (Outer-Inner Core boundary).'
    ],
    examQuestions: [
      {
        questionHi: 'क्रस्ट (भू-पर्पटी) और मैंटल के बीच की सीमा को क्या कहा जाता है?',
        questionEn: 'What is the boundary between Earth\'s crust and mantle called?',
        options: ['मोहोरोविकिक असंबद्धता (Moho Discontinuity)', 'गुटेनबर्ग असंबद्धता', 'लेहमेन असंबद्धता', 'कॉनराड असंबद्धता'],
        correctIndex: 0,
        explanationHi: 'मोहो असंबद्धता (Mohorovicic Discontinuity) क्रस्ट और ऊपरी मैंटल के बीच पाई जाती है, जहाँ भूकंपीय तरंगों (P & S waves) की गति अचानक बढ़ जाती है।',
        explanationEn: 'The Moho discontinuity marks the seismic boundary separating the crust from the mantle.'
      }
    ],
    mapViewType: 'layers_cutaway',
    diagramBadges: ['Crust SIAL/SIMA', 'Asthenosphere Magma', 'Moho & Gutenberg Boundary', 'Liquid Outer Core Dynamo']
  },
  {
    id: 'slide-atmosphere-structure',
    slideNumber: 7,
    titleHi: 'स्लाइड 7: वायुमंडल की परतें (Atmospheric Layers & Thermal Structure)',
    titleEn: 'Slide 7: Atmospheric Layers & Temperature Profiles',
    category: 'atmosphere',
    subtitleHi: 'क्षोभमंडल, समतापमंडल (ओजोन), मध्यमंडल, आयनमंडल व बहिर्मंडल',
    subtitleEn: 'Troposphere, Stratosphere (Ozone), Mesosphere, Thermosphere & Exosphere',
    keyPointsHi: [
      '🌧️ **क्षोभमंडल (Troposphere - 0-18 किमी)**: सभी मौसमी घटनाएं (बादल, वर्षा, आंधी) यहीं होती हैं। सामान्य ह्रास दर (Normal Lapse Rate): प्रत्येक 165 मीटर ऊंचाई पर तापमान में 1°C की कमी (6.5°C/किमी)।',
      '🛡️ **समतापमंडल (Stratosphere - 18-50 किमी)**: ओजोन परत (O₃) सूर्य की हानिकारक पराबैंगनी किरणों (UV-B) को अवशोषित करती है। बादलों व मौसमी हलचल से मुक्त होने के कारण जेट विमानों के उड़ने के लिए आदर्श।',
      '☄️ **मध्यमंडल (Mesosphere - 50-80 किमी)**: वायुमंडल की सबसे ठंडी परत (तापमान -100°C तक गिरता है)। अंतरिक्ष से आने वाले उल्कापिंड (Meteors) इसी परत में जलकर नष्ट होते हैं।',
      '📡 **आयनमंडल / थर्मोस्फीयर (Ionosphere - 80-640 किमी)**: रेडियो तरंगों को परावर्तित कर बेतार संचार (Radio Communication) संभव बनाता है। ऑरोरा (Aurora Borealis & Australis) यहीं बनते हैं।'
    ],
    keyPointsEn: [
      '🌧️ **Troposphere (0-18km)**: Densest layer hosting all meteorology. Normal Lapse Rate: 6.5°C drop per kilometer.',
      '🛡️ **Stratosphere (18-50km)**: Contains protective Ozone layer (O₃); isothermal calm conditions make it ideal for supersonic jet flight.',
      '☄️ **Mesosphere (50-80km)**: Coldest atmospheric layer (-100°C); burns meteoroids on entry due to atmospheric friction.',
      '📡 **Thermosphere/Ionosphere (80-640km)**: Electrically charged ion layer that reflects terrestrial radio communication signals back to Earth.'
    ],
    examQuestions: [
      {
        questionHi: 'रेडियो तरंगों को पृथ्वी की ओर परावर्तित करने वाली वायुमंडलीय परत कौन सी है?',
        questionEn: 'Which atmospheric layer reflects radio waves back to the Earth\'s surface?',
        options: ['आयनमंडल (Ionosphere)', 'क्षोभमंडल (Troposphere)', 'समतापमंडल (Stratosphere)', 'मध्यमंडल (Mesosphere)'],
        correctIndex: 0,
        explanationHi: 'आयनमंडल (थर्मोस्फीयर) में आवेशित कण (इलेक्ट्रॉन व आयन) होते हैं जो लंबी रेडियो तरंगों को परावर्तित कर संचार संभव बनाते हैं।',
        explanationEn: 'The Ionosphere contains ionized gases that reflect short and medium radio waves for long-distance telecommunication.'
      }
    ],
    mapViewType: 'atmosphere_stack',
    diagramBadges: ['Normal Lapse Rate 6.5°C/km', 'Ozone Layer (15-35km)', 'Meteorite Burn Zone', 'Ionospheric Radio Bounce']
  },
  {
    id: 'slide-minerals-resources',
    slideNumber: 8,
    titleHi: 'स्लाइड 8: भारत के प्रमुख खनिज, ऊर्जा एवं बंदरगाह (Minerals & Energy Resources)',
    titleEn: 'Slide 8: Mineral Belts, Nuclear Plants & Major Ports of India',
    category: 'minerals',
    subtitleHi: 'छोटा नागपुर, कुद्रेमुख, बॉम्बे हाई, जावर, डिगबोई व 13 प्रमुख महापत्तन',
    subtitleEn: 'Chota Nagpur Ruhr, Kudremukh, Bombay High, Digboi & 13 Major Ports',
    keyPointsHi: [
      '⛏️ **छोटा नागपुर पठार (Ruhr of India)**: भारत का 80% कोयला (झरिया, रानीगंज, बोकारो) और उच्च कोटि का हेमेटाइट लौह अयस्क।',
      '🛢️ **पेट्रोलियम भंडार**: बॉम्बे हाई (अरब सागर - भारत का सबसे बड़ा अपतटीय क्षेत्र), डिगबोई (असम - एशिया का प्रथम तेल कुआं - 1889), अंकलेश्वर (गुजरात)।',
      '⚛️ **परमाणु ऊर्जा संयंत्र**: तारापुर (महाराष्ट्र - प्रथम 1969), कुडनकुलम (तमिलनाडु - रूस सहयोग), रावतभाटा (राजस्थान), नरोरा (UP), कैगा (कर्नाटक)।',
      '⚓ **प्रमुख बंदरगाह**: कांडला (दीनदयाल पोर्ट - ज्वारीय/कर-मुक्त), जेएनपीटी (न्हावा शेवा - सबसे बड़ा कंटेनर पोर्ट), विशाखापट्टनम (सबसे गहरा प्राकृतिक बंदरगाह), पारादीप (ओडिशा - लौह निर्यात)।'
    ],
    keyPointsEn: [
      '⛏️ **Chota Nagpur Belt**: Heart of Indian heavy industry; supplies 80% prime coking coal (Jharia, Raniganj) and high-grade hematite iron ore.',
      '🛢️ **Hydrocarbon Hubs**: Bombay High offshore field, Digboi (Asia\'s oldest oil refinery established in 1889), and Krishna-Godavari basin.',
      '⚛️ **Nuclear Power Stations**: Tarapur (MH, oldest 1969), Kudankulam (TN, largest capacity), Rawatbhata (RJ), Narora (UP), Kaiga (KA).',
      '⚓ **Strategic Major Ports**: Kandla (Tidal port), JNPT (Largest container terminal), Visakhapatnam (Deepest landlocked harbor), Paradip (Iron ore export).'
    ],
    examQuestions: [
      {
        questionHi: 'भारत का पहला और सबसे पुराना तेल परिष्करण शाला (Oil Refinery) कहाँ स्थित है?',
        questionEn: 'Where is India\'s first and oldest oil refinery located?',
        options: ['डिगबोई (असम)', 'बरौनी (बिहार)', 'ट्रॉम्बे (मुंबई)', 'पानीपत (हरियाणा)'],
        correctIndex: 0,
        explanationHi: 'असम के डिगबोई में 1889 में पहला तेल कुआं खोदा गया और 1901 में एशिया की पहली रिफाइनरी स्थापित की गई।',
        explanationEn: 'Digboi in Assam was commissioned in 1901 as India\'s and Asia\'s first operational petroleum refinery.'
      }
    ],
    mapViewType: 'india_map',
    activeLayerFilter: 'mineral',
    diagramBadges: ['Chota Nagpur Ruhr', 'Bombay High Crude', '13 Major Commercial Ports', 'Tarapur & Kudankulam Nuclear']
  }
];
