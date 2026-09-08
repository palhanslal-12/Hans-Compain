import React, { useState } from 'react';
import {
  BookOpen, Award, CheckCircle2, Clock, Zap, ArrowRight,
  Sparkles, FileText, ChevronRight, Layers, GraduationCap, ShieldCheck
} from 'lucide-react';
import { QuizQuestion, MistakeNotebookItem } from '../types';

export interface BoardChapterTest {
  id: string;
  board: 'CBSE' | 'UP_BOARD' | 'BIHAR_BOARD' | 'ALL_STATE_BOARDS';
  classGrade: 'Class 10th' | 'Class 12th';
  subject: 'Science (विज्ञान)' | 'Mathematics (गणित)' | 'Social Science (सामाजिक विज्ञान)' | 'Physics (भौतिकी)' | 'Chemistry (रसायन विज्ञान)' | 'Biology (जीव विज्ञान)';
  chapter: string;
  totalQuestions: number;
  timeMinutes: number;
  descriptionHi: string;
  descriptionEn: string;
  questions: QuizQuestion[];
}

export const CURATED_BOARD_EXAM_TESTS: BoardChapterTest[] = [
  // CLASS 10 - SCIENCE - CHAPTER 1
  {
    id: 'board-10-sci-ch1',
    board: 'ALL_STATE_BOARDS',
    classGrade: 'Class 10th',
    subject: 'Science (विज्ञान)',
    chapter: 'अध्याय 1: रासायनिक अभिक्रियाएं एवं समीकरण (Chemical Reactions)',
    totalQuestions: 5,
    timeMinutes: 10,
    descriptionHi: 'संयोजन, वियोजन, विस्थापन एवं द्विविस्थापन अभिक्रियाएं, संक्षारण व विकृतगंधिता।',
    descriptionEn: 'Combination, Decomposition, Displacement reactions, Corrosion & Rancidity.',
    questions: [
      {
        question: 'जब मैग्नीशियम रिबन को वायु में जलाया जाता है, तो चमकदार श्वेत ज्वाला के साथ कौन सा उत्पाद बनता है?',
        options: ['मैग्नीशियम ऑक्साइड (MgO)', 'मैग्नीशियम नाइट्राइड (Mg3N2)', 'मैग्नीशियम कार्बोनेट (MgCO3)', 'मैग्नीशियम हाइड्रॉक्साइड (Mg(OH)2)'],
        answerIndex: 0,
        explanation: '2Mg + O₂ ➔ 2MgO (मैग्नीशियम ऑक्साइड का श्वेत चूर्ण प्राप्त होता है)। यह एक संयोजन एवं दहन अभिक्रिया है।',
        hint: 'सफेद पाउडर बनता है जो क्षारीय प्रकृति का होता है।'
      },
      {
        question: 'फेरस सल्फेट (FeSO₄·7H₂O) के क्रिस्टल को गर्म करने पर इसका हरा रंग क्यों बदल जाता है?',
        options: ['क्रिस्टलन जल समाप्त होने के कारण', 'ऑक्सीजन अवशोषित करने के कारण', 'हाइड्रोजन गैस निकलने के कारण', 'नाइट्रोजन से क्रिया के कारण'],
        answerIndex: 0,
        explanation: 'गर्म करने पर फेरस सल्फेट क्रिस्टल पहले जल त्यागते हैं (FeSO₄ बनता है) जिससे रंग बदल जाता है, फिर यह Fe₂O₃, SO₂ और SO₃ में वियोजित होता है।',
        hint: 'क्रिस्टलीय जल (Water of crystallization) का वाष्पीकरण होता है।'
      },
      {
        question: 'चूने के पानी में कार्बन डाइऑक्साइड गैस प्रवाहित करने पर चूने का पानी दूधिया क्यों हो जाता है?',
        options: ['कैल्शियम कार्बोनेट (CaCO₃) के बनने से', 'कैल्शियम बाइकार्बोनेट बनने से', 'कैल्शियम ऑक्साइड बनने से', 'कैल्शियम सल्फेट बनने से'],
        answerIndex: 0,
        explanation: 'Ca(OH)₂ + CO₂ ➔ CaCO₃ (अघुलनशील श्वेत अवक्षेप) + H₂O। इसी अघुलनशील अवक्षेप के कारण पानी दूधिया दिखता है।',
        hint: 'सफेद अवक्षेप (Precipitate) बनता है।'
      },
      {
        question: 'श्वसन (Respiration) किस प्रकार की रासायनिक अभिक्रिया है?',
        options: ['ऊष्माक्षेपी अभिक्रिया (Exothermic)', 'ऊष्माशोषी अभिक्रिया (Endothermic)', 'संयोजन अभिक्रिया', 'अपचयन अभिक्रिया'],
        answerIndex: 0,
        explanation: 'श्वसन में ग्लूकोज का ऑक्सीकरण होता है और ऊर्जा (ATP) मुक्त होती है: C₆H₁₂O₆ + 6O₂ ➔ 6CO₂ + 6H₂O + ऊर्जा। अतः यह ऊष्माक्षेपी अभिक्रिया है।',
        hint: 'इसमें ऊर्जा बाहर निकलती है।'
      },
      {
        question: 'चिप्स की थैली में कौन सी अक्रिय गैस भरी जाती है ताकि उनका उपचयन (Rancidity) न हो?',
        options: ['नाइट्रोजन गैस (N₂)', 'ऑक्सीजन गैस (O₂)', 'क्लोरीन गैस (Cl₂)', 'कार्बन डाइऑक्साइड (CO₂)'],
        answerIndex: 0,
        explanation: 'वसा और तेलयुक्त खाद्य पदार्थों को विकृतगंधिता (Rancidity) से बचाने के लिए चिप्स के पैकेट में कम सक्रिय गैस जैसे नाइट्रोजन भरी जाती है।',
        hint: 'यह गैस वायुमंडल में 78% पाई जाती है।'
      }
    ]
  },
  // CLASS 10 - SCIENCE - CHAPTER 6 (LIFE PROCESSES)
  {
    id: 'board-10-sci-ch6',
    board: 'ALL_STATE_BOARDS',
    classGrade: 'Class 10th',
    subject: 'Science (विज्ञान)',
    chapter: 'अध्याय 6: जैव प्रक्रम (Life Processes - पोषण, श्वसन, उत्सर्जन)',
    totalQuestions: 5,
    timeMinutes: 10,
    descriptionHi: 'पादप पोषण, मानव पाचन तंत्र, हृदय व वृक्क (किडनी) का उत्सर्जन तंत्र।',
    descriptionEn: 'Autotrophic nutrition, Human digestion, Heart & Nephron filtration.',
    questions: [
      {
        question: 'मानव पाचन तंत्र में प्रोटीन का पाचन सर्वप्रथम किस अंग में प्रारंभ होता है?',
        options: ['आमाशय (Stomach)', 'मुखगुहा (Mouth)', 'छोटी आंत (Small Intestine)', 'यकृत (Liver)'],
        answerIndex: 0,
        explanation: 'आमाशय में जठर रस से पेप्सिन (Pepsin) एंजाइम स्रावित होता है जो हाइड्रोक्लोरिक अम्ल की उपस्थिति में प्रोटीन को पचाना शुरू करता है।',
        hint: 'पेप्सिन एंजाइम अम्लीय माध्यम में कार्य करता है।'
      },
      {
        question: 'प्रकाश संश्लेषण प्रक्रिया में ऑक्सीजन गैस किस घटक के अपघटन से मुक्त होती है?',
        options: ['जल (H₂O) से', 'कार्बन डाइऑक्साइड (CO₂) से', 'ग्लूकोज से', 'क्लोरोफिल से'],
        answerIndex: 0,
        explanation: 'प्रकाश संश्लेषण के प्रकाशिक चरण में प्रकाश ऊर्जा द्वारा जल के अणुओं का विखंडन (Photolysis of Water) होता है जिससे O₂ मुक्त होती है।',
        hint: 'पानी के अणु का टूटना।'
      },
      {
        question: 'वृक्क (Kidney) की संरचनात्मक एवं क्रियात्मक इकाई क्या कहलाती है?',
        options: ['नेफ्रॉन (वृक्काणु / Nephron)', 'न्यूरॉन (Neuron)', 'एल्वियोली (Alveoli)', 'ग्लोमेरुलस'],
        answerIndex: 0,
        explanation: 'वृक्क की निस्यंदन (Filtration) इकाई नेफ्रॉन कहलाती है। प्रत्येक वृक्क में लगभग 10-12 लाख नेफ्रॉन होते हैं।',
        hint: 'यह मूत्र निर्माण की बुनियादी इकाई है।'
      },
      {
        question: 'मानव हृदय में अशुद्ध (वि-ऑक्सीजनित) रक्त शरीर से किस कक्ष में प्रवेश करता है?',
        options: ['दायां अलिंद (Right Atrium)', 'बायां अलिंद (Left Atrium)', 'दायां निलय (Right Ventricle)', 'बायां निलय (Left Ventricle)'],
        answerIndex: 0,
        explanation: 'महाशिरा (Vena Cava) द्वारा पूरे शरीर का वि-ऑक्सीजनित रक्त सर्वप्रथम दाएं अलिंद (Right Atrium) में आता है।',
        hint: 'हृदय का ऊपरी दायां कोष्ठ।'
      },
      {
        question: 'पौधों में तैयार भोजन (सुक्रोज) का संवहन किस ऊतक द्वारा होता है?',
        options: ['फ्लोएम (Phloem)', 'जाइलम (Xylem)', 'कैम्बियम', 'पैरेन्काइमा'],
        answerIndex: 0,
        explanation: 'जाइलम जल एवं खनिजों का संवहन करता है जबकि फ्लोएम पत्तियों द्वारा निर्मित भोजन का संवहन पौधों के विभिन्न भागों तक करता है।',
        hint: 'फ से फूड, फ से फ्लोएम।'
      }
    ]
  },
  // CLASS 10 - SOCIAL SCIENCE - HISTORY & CIVICS
  {
    id: 'board-10-sst-ch1',
    board: 'ALL_STATE_BOARDS',
    classGrade: 'Class 10th',
    subject: 'Social Science (सामाजिक विज्ञान)',
    chapter: 'इतिहास: भारत में राष्ट्रवाद एवं सत्याग्रह आंदोलन',
    totalQuestions: 5,
    timeMinutes: 8,
    descriptionHi: 'रोलेट एक्ट, जलियांवाला बाग, असहयोग व सविनय अवज्ञा आंदोलन।',
    descriptionEn: 'Nationalism in India, Non-Cooperation and Civil Disobedience movements.',
    questions: [
      {
        question: 'महात्मा गांधी ने 1917 में बिहार के किस जिले से अपना प्रथम सफल सत्याग्रह शुरू किया था?',
        options: ['चंपारण (नील की खेती के विरुद्ध)', 'खेड़ा', 'अहमदाबाद', 'पटना'],
        answerIndex: 0,
        explanation: 'गांधीजी ने 1917 में चंपारण में तीनकठिया प्रथा (नील की खेती) के विरोध में भारत में अपना पहला सत्याग्रह किया था।',
        hint: 'राजकुमार शुक्ल के आग्रह पर गांधीजी वहां गए थे।'
      },
      {
        question: 'जलियांवाला बाग हत्याकांड किस तिथि को हुआ था?',
        options: ['13 अप्रैल 1919 (बैसाखी का दिन)', '15 अगस्त 1919', '26 जनवरी 1920', '10 मई 1857'],
        answerIndex: 0,
        explanation: '13 अप्रैल 1919 को अमृतसर के जलियांवाला बाग में रोलेट एक्ट तथा डॉ. सैफुद्दीन किचलू और डॉ. सत्यपाल की गिरफ्तारी के विरोध में शांतिपूर्ण सभा पर जनरल डायर ने गोलियां चलवाई थीं।',
        hint: 'बैसाखी का पावन पर्व।'
      },
      {
        question: 'गांधीजी ने ऐतिहासिक दांडी यात्रा (नमक सत्याग्रह) साबरमती आश्रम से कब प्रारंभ की थी?',
        options: ['12 मार्च 1930', '6 अप्रैल 1930', '1 अगस्त 1920', '8 अगस्त 1942'],
        answerIndex: 0,
        explanation: 'गांधीजी ने 12 मार्च 1930 को 78 अनुयायियों के साथ दांडी मार्च शुरू किया और 6 अप्रैल 1930 को दांडी पहुंचकर नमक कानून तोड़ा।',
        hint: 'मार्च 1930 में शुरुआत।'
      },
      {
        question: 'असहयोग आंदोलन को 1922 में किस हिंसक घटना के कारण वापस ले लिया गया था?',
        options: ['चौरी-चौरा कांड (गोरखपुर)', 'काकोरी ट्रेन एक्शन', 'लाहौर षड्यंत्र', 'मेरठ षड्यंत्र'],
        answerIndex: 0,
        explanation: '4 फरवरी 1922 को गोरखपुर के चौरी-चौरा में भीड़ द्वारा थाने में आग लगाने की घटना से दुखी होकर गांधीजी ने 12 फरवरी 1922 को असहयोग आंदोलन स्थगित कर दिया।',
        hint: 'उत्तर प्रदेश के गोरखपुर जिले की घटना।'
      },
      {
        question: 'भारतीय संविधान में समवर्ती सूची (Concurrent List) का प्रावधान किस देश के संविधान से प्रेरित है?',
        options: ['ऑस्ट्रेलिया', 'अमेरिका', 'ब्रिटेन', 'कनाडा'],
        answerIndex: 0,
        explanation: 'समवर्ती सूची तथा संसद के दोनों सदनों की संयुक्त बैठक का प्रावधान ऑस्ट्रेलिया के संविधान से लिया गया है।',
        hint: 'कंगारुओं का देश।'
      }
    ]
  },
  // CLASS 10 - SOCIAL SCIENCE - GEOGRAPHY (समकालीन भारत - भूगोल)
  {
    id: 'board-10-sst-geo-ch1',
    board: 'ALL_STATE_BOARDS',
    classGrade: 'Class 10th',
    subject: 'Social Science (सामाजिक विज्ञान)',
    chapter: 'भूगोल: संसाधन एवं विकास, मृदा, वन एवं जल संरक्षण (NCERT)',
    totalQuestions: 5,
    timeMinutes: 8,
    descriptionHi: 'संसाधनों का वर्गीकरण, काली/जलोढ़ मृदा, जल संचयन एवं चिपको आंदोलन।',
    descriptionEn: 'Resources and development, soil types, water conservation and forests.',
    questions: [
      {
        question: 'लौह अयस्क किस प्रकार का प्राकृतिक संसाधन है?',
        options: ['अनवीकरण योग्य (Non-renewable)', 'नवीकरण योग्य (Renewable)', 'जैव संसाधन', 'प्रवाह संसाधन'],
        answerIndex: 0,
        explanation: 'लौह अयस्क एक खनिज संसाधन है जिसका निर्माण भूगर्भ में लाखों वर्षों के भूवैज्ञानिक प्रक्रम से होता है। यह एक बार समाप्त होने पर पुनः तुरंत नहीं बनता, अतः यह अनवीकरण योग्य संसाधन है।',
        hint: 'जिसका भण्डार सीमित होता है।'
      },
      {
        question: 'पंजाब और हरियाणा में अत्यधिक कृषि विस्तार के कारण भूमि निम्नीकरण (Land Degradation) का मुख्य कारण क्या है?',
        options: ['अति सिंचाई (Over-irrigation से लवणीयता)', 'अति पशुचारण', 'गहन खनन कार्य', 'वनों की कटाई'],
        answerIndex: 0,
        explanation: 'पंजाब, हरियाणा और पश्चिमी उत्तर प्रदेश में नलकूपों द्वारा अत्यधिक सिंचाई (Over-irrigation) के कारण जलक्रांतता (Waterlogging) उत्पन्न होती है, जिससे मिट्टी में लवणता और क्षारीयता बढ़ जाती है।',
        hint: 'हरित क्रांति के दौरान ट्यूबवेल से अधिक पानी देना।'
      },
      {
        question: 'कपास (Cotton) की उत्तम पैदावार के लिए सर्वाधिक उपयुक्त "काली मृदा" (Black Soil) भारत के किस क्षेत्र में पाई जाती है?',
        options: ['दक्कन ट्रैप (महाराष्ट्र एवं गुजरात)', 'थार मरुस्थल (राजस्थान)', 'गंगा का मैदान (उत्तर प्रदेश)', 'ब्रह्मपुत्र घाटी (असम)'],
        answerIndex: 0,
        explanation: 'काली मृदा बेसाल्ट लावा चट्टानों के टूटने से बनती है और मुख्य रूप से महाराष्ट्र, गुजरात तथा पश्चिमी मध्य प्रदेश (दक्कन पठार) में पाई जाती है। इसे रेगुर मृदा भी कहते हैं।',
        hint: 'कपास उत्पादन के लिए अग्रणी राज्य।'
      },
      {
        question: 'भारत में सदियों पुरानी प्रसिद्ध "बांस ड्रिप सिंचाई प्रणाली" (Bamboo Drip Irrigation) किस पूर्वोत्तर राज्य में प्रचलित है?',
        options: ['मेघालय', 'असम', 'त्रिपुरा', 'मणिपुर'],
        answerIndex: 0,
        explanation: 'मेघालय में किसान बांस के पाइपों की सहायता से झरनों के पानी को गुरुत्वाकर्षण द्वारा नीचे खेतों तक लाते हैं और पौधों की जड़ों पर बूंद-बूंद टपकाते हैं।',
        hint: 'पूर्वोत्तर का बादलों का घर।'
      },
      {
        question: 'उत्तराखंड के चमोली जिले में 1970 के दशक में हिमालयी वनों को कटने से बचाने के लिए प्रसिद्ध "चिपको आंदोलन" का नेतृत्व किसने किया था?',
        options: ['सुंदरलाल बहुगुणा एवं गौरा देवी', 'मेधा पाटकर', 'डॉ. वर्गीज कुरियन', 'सलीम अली'],
        answerIndex: 0,
        explanation: 'सुंदरलाल बहुगुणा, चंडी प्रसाद भट्ट और गौरा देवी के नेतृत्व में ग्रामीणों (विशेषकर महिलाओं) ने पेड़ों को गले लगाकर उन्हें कुल्हाड़ियों से कटने से बचाया था।',
        hint: 'प्रसिद्ध पर्यावरणविद जिन्होंने हिमालय के जंगलों की रक्षा की।'
      }
    ]
  },
  // CLASS 12 - PHYSICS - ELECTROSTATICS & CURRENT
  {
    id: 'board-12-phy-ch1',
    board: 'ALL_STATE_BOARDS',
    classGrade: 'Class 12th',
    subject: 'Physics (भौतिकी)',
    chapter: 'इकाई 1: स्थिर विद्युत विभव, गॉस नियम एवं धारिता (Electrostatics)',
    totalQuestions: 5,
    timeMinutes: 10,
    descriptionHi: 'कूलॉम का नियम, विद्युत द्विध्रुव, गॉस प्रमेय एवं समांतर पट्ट संधारित्र।',
    descriptionEn: 'Coulomb\'s Law, Electric Dipole, Gauss Theorem and Capacitance.',
    questions: [
      {
        question: 'वायु या निर्वात में विद्युतशीलता (Permittivity of Free Space, ε₀) का SI मात्रक क्या है?',
        options: ['C² N⁻¹ m⁻²', 'N m² C⁻²', 'N C⁻¹', 'Farad meter'],
        answerIndex: 0,
        explanation: 'कूलॉम नियम F = (1 / 4πε₀) · (q₁q₂ / r²) से ε₀ = q₁q₂ / (4πF r²) ➔ C² / (N·m²) = C² N⁻¹ m⁻²।',
        hint: 'कूलॉम स्क्वायर प्रति न्यूटन-मीटर स्क्वायर।'
      },
      {
        question: 'एक समान विद्युत क्षेत्र E में रखे विद्युत द्विध्रुव (Dipole Moment P) पर लगने वाला बल आघूर्ण (Torque τ) क्या होता है?',
        options: ['τ = P × E (P E sinθ)', 'τ = P · E', 'τ = P / E', 'τ = 0 हमेशा'],
        answerIndex: 0,
        explanation: 'विद्युत क्षेत्र में द्विध्रुव पर नेट बल शून्य होता है किन्तु बल आघूर्ण τ = P × E = P E sinθ कार्य करता है।',
        hint: 'सदिश गुणनफल (Cross Product)।'
      },
      {
        question: 'गॉस के नियम के अनुसार किसी बंद पृष्ठ से गुजरने वाला कुल विद्युत फ्लक्स (Φ) किसके बराबर होता है?',
        options: ['Φ = q_enclosed / ε₀', 'Φ = q · ε₀', 'Φ = ε₀ / q', 'Φ = E · A / 2'],
        answerIndex: 0,
        explanation: 'गॉस प्रमेय के अनुसार किसी बंद पृष्ठ से बद्ध कुल फ्लक्स उस पृष्ठ द्वारा परिबद्ध कुल आवेश का 1/ε₀ गुना होता है।',
        hint: 'कुल आवेश भागे एप्सीलन नॉट।'
      },
      {
        question: 'यदि किसी समांतर पट्ट संधारित्र की प्लेटों के बीच K परावैद्युतांक (Dielectric) की पट्टी रख दी जाए तो धारिता पर क्या प्रभाव पड़ेगा?',
        options: ['धारिता K गुना बढ़ जाएगी (C = K·C₀)', 'धारिता K गुना घट जाएगी', 'अपरिवर्तित रहेगी', 'शून्य हो जाएगी'],
        answerIndex: 0,
        explanation: 'परावैद्युत माध्यम रखने पर प्लेटों के मध्य विद्युत क्षेत्र कम हो जाता है जिससे विभव घटता है और धारिता C = K·C₀ हो जाती है।',
        hint: 'कैपेसिटेंस बढ़ जाती है।'
      },
      {
        question: 'किसी गोलीय चालक की धारिता C उसकी त्रिज्या R के किस प्रकार समानुपाती होती है?',
        options: ['C = 4πε₀ R (C ∝ R)', 'C ∝ R²', 'C ∝ 1/R', 'C ∝ √R'],
        answerIndex: 0,
        explanation: 'विलगित गोलीय चालक की धारिता C = 4πε₀·R होती है, अर्थात यह पूर्णतः त्रिज्या पर निर्भर करती है।',
        hint: 'धारिता सीधे त्रिज्या के समानुपाती होती है।'
      }
    ]
  },
  // CLASS 12 - CHEMISTRY - ORGANIC & SOLUTIONS
  {
    id: 'board-12-chem-ch1',
    board: 'ALL_STATE_BOARDS',
    classGrade: 'Class 12th',
    subject: 'Chemistry (रसायन विज्ञान)',
    chapter: 'इकाई 2: विलयन एवं अणुसंख्य गुणधर्म (Solutions & Colligative Properties)',
    totalQuestions: 5,
    timeMinutes: 10,
    descriptionHi: 'मोलरता, मोललता, राउल्ट का नियम, परासरण दाब एवं वांट हॉफ गुणांक।',
    descriptionEn: 'Molarity, Raoult\'s Law, Osmotic Pressure & Van\'t Hoff factor.',
    questions: [
      {
        question: 'तापमान में परिवर्तन होने पर निम्नलिखित में से कौन सी सांद्रता इकाई अपरिवर्तित रहती है?',
        options: ['मोललता (Molality - m)', 'मोलरता (Molarity - M)', 'नॉर्मलता (Normality - N)', 'आयतन प्रतिशत (% v/v)'],
        answerIndex: 0,
        explanation: 'मोललता विलायक के द्रव्यमान (kg) पर निर्भर करती है, आयतन पर नहीं। चूंकि द्रव्यमान ताप से स्वतंत्र होता है, अतः मोललता ताप से नहीं बदलती।',
        hint: 'जो प्रति किलोग्राम विलायक में मापी जाती है।'
      },
      {
        question: 'राउल्ट के नियमानुसार किसी अवाष्पशील विलेय युक्त विलयन के वाष्प दाब का आपेक्षिक अवनमन किसके बराबर होता है?',
        options: ['विलेय के मोल प्रभाज (Mole Fraction of Solute, X_B)', 'विलायक के मोल प्रभाज', 'मोलरता के', 'मोललता के'],
        answerIndex: 0,
        explanation: '(P₀ - P_s) / P₀ = X_B (विलेय का मोल अंश)। यह एक अणुसंख्य गुणधर्म (Colligative Property) है।',
        hint: 'सॉल्यूट के मोल प्रभाज के बराबर।'
      },
      {
        question: 'अणुसंख्य गुणधर्मों (Colligative Properties) द्वारा बहुलकों (Polymers) एवं प्रोटीनों का आण्विक द्रव्यमान ज्ञात करने की सर्वोत्तम विधि कौन सी है?',
        options: ['परासरण दाब विधि (Osmotic Pressure Method - π = CRT)', 'क्वथनांक उन्नयन', 'हिमांक अवनमन', 'वाष्प दाब अवनमन'],
        answerIndex: 0,
        explanation: 'परासरण दाब कमरे के तापमान पर मापा जाता है तथा इसके मान पर्याप्त बड़े होते हैं, इसलिए बायोमोलीक्यूल्स के लिए यह सर्वोत्तम है।',
        hint: 'π = CRT समीकरण पर आधारित।'
      },
      {
        question: 'NaCl के लिए पूर्ण वियोजन की स्थिति में वांट हॉफ गुणांक (Van\'t Hoff Factor, i) का मान क्या होगा?',
        options: ['i = 2 (Na⁺ + Cl⁻)', 'i = 1', 'i = 3', 'i = 0.5'],
        answerIndex: 0,
        explanation: 'NaCl जल में वियोजित होकर 1 Na⁺ और 1 Cl⁻ आयन बनाता है। 100% वियोजन पर i = 1 + (2 - 1)·1 = 2 होता है।',
        hint: 'दो आयन बनते हैं।'
      },
      {
        question: 'हेनरी का नियम (Henry\'s Law) किस पर लागू होता है?',
        options: ['द्रवों में गैसों की विलेयता एवं आंशिक दाब (p = K_H · x)', 'ठोसों की विलेयता पर', 'आदर्श गैसों के प्रसार पर', 'इलेक्ट्रोड विभव पर'],
        answerIndex: 0,
        explanation: 'हेनरी नियम के अनुसार स्थिर ताप पर किसी द्रव में गैस की विलेयता गैस के आंशिक दाब के समानुपाती होती है (सोडा वाटर बोतल का सिद्धांत)।',
        hint: 'सोडा वाटर एवं गोताखोरों की ऑक्सीजन सिलेंडर की कार्यविधि।'
      }
    ]
  },
  // CLASS 10 - MATHEMATICS - CHAPTER 1 (REAL NUMBERS)
  {
    id: 'board-10-math-ch1',
    board: 'ALL_STATE_BOARDS',
    classGrade: 'Class 10th',
    subject: 'Mathematics (गणित)',
    chapter: 'अध्याय 1: वास्तविक संख्याएं (Real Numbers)',
    totalQuestions: 5,
    timeMinutes: 10,
    descriptionHi: 'अंकगणित की आधारभूत प्रमेय, HCF × LCM = a × b, अभाज्य गुणनखंडन एवं अपरिमेय संख्याएं।',
    descriptionEn: 'Fundamental Theorem of Arithmetic, HCF-LCM relation, irrationality proof & prime factorization.',
    questions: [
      {
        question: 'यदि दो धनात्मक पूर्णांकों a और b के लिए HCF(a, b) = 12 और a × b = 1800 है, तो उनका LCM(a, b) क्या होगा?',
        options: ['150', '120', '180', '200'],
        answerIndex: 0,
        explanation: 'सूत्र: HCF(a, b) × LCM(a, b) = a × b। इसलिए LCM = 1800 / 12 = 150।',
        hint: 'दो संख्याओं का गुणनफल = म.स. × ल.स.'
      },
      {
        question: 'निम्नलिखित में से कौन सी संख्या एक अपरिमेय संख्या (Irrational Number) है?',
        options: ['√3 + 2', '√16', '3.141414...', '22/7'],
        answerIndex: 0,
        explanation: '√3 एक अपरिमेय संख्या है, अतः किसी अपरिमेय संख्या में परिमेय संख्या जोड़ने पर प्राप्त योग (√3 + 2) भी अपरिमेय होता है। √16 = 4 परिमेय है, 22/7 परिमेय है, तथा 3.1414... आवर्ती दशमलव (परिमेय) है।',
        hint: 'अपरिमेय + परिमेय = अपरिमेय।'
      },
      {
        question: 'संख्या 144 के अभाज्य गुणनखंड (Prime Factorization) में 2 की घात (Exponent of 2) कितनी होगी?',
        options: ['4 (2⁴ × 3²)', '2', '3', '5'],
        answerIndex: 0,
        explanation: '144 = 2 × 2 × 2 × 2 × 3 × 3 = 2⁴ × 3²। अतः 2 की घात 4 है।',
        hint: '144 = 16 × 9 = 2⁴ × 3²।'
      },
      {
        question: 'किसी परिमेय संख्या p/q का दशमलव प्रसार सांत (Terminating) होने के लिए q के अभाज्य गुणनखंड का रूप कैसा होना चाहिए?',
        options: ['2ⁿ · 5ᵐ (जहाँ n, m ऋणेतर पूर्णांक हैं)', 'केवल 3ⁿ के रूप का', '2ⁿ · 7ᵐ के रूप का', 'केवल 10ⁿ के रूप का'],
        answerIndex: 0,
        explanation: 'प्रमेय के अनुसार किसी परिमेय संख्या p/q का दशमलव प्रसार तभी सांत होता है जब हर q का अभाज्य गुणनखंड केवल 2 और 5 की घातों (2ⁿ · 5ᵐ) के रूप में हो।',
        hint: 'हर में केवल 2 या 5 अथवा दोनों के गुणनखंड होने चाहिए।'
      },
      {
        question: 'यदि n एक प्राकृतिक संख्या है, तो 6ⁿ का अंतिम अंक (Unit Digit) कभी भी किस अंक पर समाप्त नहीं हो सकता?',
        options: ['0 (शून्य)', '6', '1', '2'],
        answerIndex: 0,
        explanation: 'शून्य पर समाप्त होने के लिए संख्या के अभाज्य गुणनखंड में 2 और 5 दोनों का होना अनिवार्य है। चूंकि 6ⁿ = (2 × 3)ⁿ में 5 का कोई गुणनखंड नहीं है, अतः यह कभी 0 पर समाप्त नहीं हो सकती।',
        hint: '6 की किसी भी घात का इकाई अंक हमेशा 6 होता है, कभी 0 नहीं हो सकता।'
      }
    ]
  },
  // CLASS 10 - MATHEMATICS - CHAPTER 4 (QUADRATIC EQUATIONS)
  {
    id: 'board-10-math-ch4',
    board: 'ALL_STATE_BOARDS',
    classGrade: 'Class 10th',
    subject: 'Mathematics (गणित)',
    chapter: 'अध्याय 4: द्विघात समीकरण (Quadratic Equations)',
    totalQuestions: 5,
    timeMinutes: 10,
    descriptionHi: 'विविक्तकर (Discriminant), मूलों की प्रकृति (Nature of Roots), द्विघाती सूत्र एवं गुणनखंड विधि।',
    descriptionEn: 'Discriminant D = b² - 4ac, Nature of roots, Quadratic formula & factorization.',
    questions: [
      {
        question: 'द्विघात समीकरण 2x² - 4x + 3 = 0 का विविक्तकर (Discriminant, D) क्या होगा और इसके मूलों की प्रकृति क्या होगी?',
        options: ['D = -8 (कोई वास्तविक मूल नहीं)', 'D = 8 (दो भिन्न वास्तविक मूल)', 'D = 0 (दो बराबर मूल)', 'D = -16 (काल्पनिक)'],
        answerIndex: 0,
        explanation: 'D = b² - 4ac = (-4)² - 4(2)(3) = 16 - 24 = -8। चूंकि D < 0 है, अतः समीकरण का कोई वास्तविक मूल अस्तित्व में नहीं है।',
        hint: 'D = b² - 4ac में मान रखें।'
      },
      {
        question: 'यदि समीकरण kx² - 6x + 1 = 0 के दोनों मूल बराबर (Equal Roots) हैं, तो k का मान क्या होगा?',
        options: ['k = 9', 'k = 6', 'k = 3', 'k = 12'],
        answerIndex: 0,
        explanation: 'बराबर मूलों के लिए D = b² - 4ac = 0 होता है। (-6)² - 4(k)(1) = 0 ➔ 36 - 4k = 0 ➔ 4k = 36 ➔ k = 9।',
        hint: 'D = 0 रखें।'
      },
      {
        question: 'द्विघात समीकरण ax² + bx + c = 0 के मूलों का योगफल (Sum of Roots) किसके बराबर होता है?',
        options: ['-b / a', 'c / a', 'b / a', '-c / a'],
        answerIndex: 0,
        explanation: 'यदि मूल α और β हैं, तो मूलों का योगफल α + β = -b/a तथा गुणनफल α·β = c/a होता है।',
        hint: 'ऋण x का गुणांक / x² का गुणांक।'
      },
      {
        question: 'समीकरण x² - 5x + 6 = 0 के मूल (Roots) क्या होंगे?',
        options: ['2 और 3', '-2 और -3', '1 और 6', '-1 और -6'],
        answerIndex: 0,
        explanation: 'x² - 5x + 6 = (x - 2)(x - 3) = 0 ➔ x = 2 अथवा x = 3। दोनों मूल धनात्मक हैं।',
        hint: 'गुणा करने पर 6 और जोड़ने पर -5 आना चाहिए।'
      },
      {
        question: 'द्विघाती सूत्र (श्रीधराचार्य सूत्र) निम्नलिखित में से कौन सा है?',
        options: ['x = (-b ± √(b² - 4ac)) / (2a)', 'x = (-b ± √(b² + 4ac)) / (2a)', 'x = (b ± √(b² - 4ac)) / (2a)', 'x = (-b ± √(b² - 4ac)) / a'],
        answerIndex: 0,
        explanation: 'श्रीधराचार्य द्विघाती सूत्र: x = [-b ± √(b² - 4ac)] / (2a) होता है।',
        hint: 'हर में 2a और अंश में -b ± √D।'
      }
    ]
  },
  // CLASS 10 - MATHEMATICS - CHAPTER 8 (TRIGONOMETRY)
  {
    id: 'board-10-math-ch8',
    board: 'ALL_STATE_BOARDS',
    classGrade: 'Class 10th',
    subject: 'Mathematics (गणित)',
    chapter: 'अध्याय 8: त्रिकोणमिति का परिचय (Introduction to Trigonometry)',
    totalQuestions: 5,
    timeMinutes: 10,
    descriptionHi: 'त्रिकोणमितीय अनुपात, विशिष्ट कोणों के मान (0°, 30°, 45°, 60°, 90°) एवं सर्वसमिकाएं।',
    descriptionEn: 'Trigonometric ratios, values of standard angles & Pythagorean identities.',
    questions: [
      {
        question: 'यदि sin θ = 3/5 है, तो tan θ का मान क्या होगा?',
        options: ['3/4', '4/3', '4/5', '5/3'],
        answerIndex: 0,
        explanation: 'लम्ब = 3, कर्ण = 5 ➔ आधार = √(5² - 3²) = √16 = 4। अतः tan θ = लम्ब / आधार = 3/4।',
        hint: 'पाइथागोरस त्रिक (3, 4, 5)।'
      },
      {
        question: 'त्रिकोणमितीय व्यंजक (sin² 30° + cos² 30°) का मान किसके बराबर होता है?',
        options: ['1', '0', '1/2', '2'],
        answerIndex: 0,
        explanation: 'सर्वसमिका sin² θ + cos² θ = 1 प्रत्येक θ के लिए सत्य है। (1/2)² + (√3/2)² = 1/4 + 3/4 = 4/4 = 1।',
        hint: 'मूलभूत पाइथागोरस सर्वसमिका।'
      },
      {
        question: 'व्यंजक (sec² θ - tan² θ) का मान क्या होगा?',
        options: ['1', '-1', '0', 'sec θ'],
        answerIndex: 0,
        explanation: 'त्रिकोणमितीय सर्वसमिका: 1 + tan² θ = sec² θ ➔ sec² θ - tan² θ = 1।',
        hint: '1 + tan² θ = sec² θ।'
      },
      {
        question: 'यदि tan 2A = cot (A - 18°) है जहाँ 2A एक न्यून कोण है, तो A का मान क्या होगा?',
        options: ['36°', '24°', '18°', '45°'],
        answerIndex: 0,
        explanation: 'tan 2A = cot (90° - 2A) ➔ 90° - 2A = A - 18° ➔ 3A = 108° ➔ A = 36°।',
        hint: 'tan θ = cot (90° - θ)।'
      },
      {
        question: 'cos 60° और sin 30° के मानों का गुणनफल क्या होगा?',
        options: ['1/4', '1/2', '3/4', '1'],
        answerIndex: 0,
        explanation: 'cos 60° = 1/2 और sin 30° = 1/2। गुणनफल = 1/2 × 1/2 = 1/4।',
        hint: 'दोनों का मान 1/2 होता है।'
      }
    ]
  },
  // CLASS 12 - MATHEMATICS - UNIT 3 (MATRICES & DETERMINANTS)
  {
    id: 'board-12-math-ch3',
    board: 'ALL_STATE_BOARDS',
    classGrade: 'Class 12th',
    subject: 'Mathematics (गणित)',
    chapter: 'इकाई 3: आव्यूह एवं सारणिक (Matrices & Determinants)',
    totalQuestions: 5,
    timeMinutes: 10,
    descriptionHi: 'सममित व विषम-सममित आव्यूह, सारणिक के प्रगुण, सहखंडज (Adjoint) एवं व्युत्क्रम आव्यूह।',
    descriptionEn: 'Symmetric/Skew-symmetric matrices, Adjoint, Inverses A⁻¹ = adj(A)/|A| & Determinant properties.',
    questions: [
      {
        question: 'यदि A एक 3 × 3 कोटि का वर्ग आव्यूह है और |A| = 5 है, तो |adj(A)| का मान क्या होगा?',
        options: ['25 (|A|ⁿ⁻¹ = 5² = 25)', '5', '125', '1/5'],
        answerIndex: 0,
        explanation: 'प्रमेय के अनुसार यदि A कोटि n का वर्ग आव्यूह है, तो |adj(A)| = |A|ⁿ⁻¹। यहाँ n = 3, अतः |adj(A)| = |A|³⁻¹ = 5² = 25।',
        hint: '|adj(A)| = |A|ⁿ⁻¹।'
      },
      {
        question: 'एक विषम-सममित आव्यूह (Skew-Symmetric Matrix) के मुख्य विकर्ण (Principal Diagonal) के सभी अवयव सदैव क्या होते हैं?',
        options: ['शून्य (Zero)', '1 (इकाई)', 'समान धनात्मक', 'अपरिभाषित'],
        answerIndex: 0,
        explanation: 'विषम-सममित आव्यूह में a_ij = -a_ji होता है। विकर्ण अवयवों के लिए i = j ➔ a_ii = -a_ii ➔ 2a_ii = 0 ➔ a_ii = 0।',
        hint: 'मुख्य विकर्ण के सारे तत्व हमेशा 0 होते हैं।'
      },
      {
        question: 'किसी व्युत्क्रमणीय वर्ग आव्यूह A के लिए इसका व्युत्क्रम A⁻¹ ज्ञात करने का सही सूत्र क्या है?',
        options: ['A⁻¹ = adj(A) / |A| (जहाँ |A| ≠ 0)', 'A⁻¹ = |A| · adj(A)', 'A⁻¹ = adj(A) / |A|²', 'A⁻¹ = Aᵀ / |A|'],
        answerIndex: 0,
        explanation: 'A · adj(A) = |A| · I ➔ A⁻¹ = [1 / |A|] · adj(A), बशर्ते |A| ≠ 0 (अव्युत्क्रमणीय न हो)।',
        hint: 'एडजॉइंट भागे डिटरमिनेंट।'
      },
      {
        question: 'यदि A और B समान कोटि के व्युत्क्रमणीय आव्यूह हैं, तो (AB)⁻¹ किसके बराबर होता है?',
        options: ['B⁻¹ A⁻¹ (रिवर्सल लॉ)', 'A⁻¹ B⁻¹', 'AB', 'B A'],
        answerIndex: 0,
        explanation: 'आव्यूह व्युत्क्रम में रिवर्सल नियम (Reversal Law) लागू होता है: (AB)⁻¹ = B⁻¹ · A⁻¹।',
        hint: 'उलटे क्रम में खुलता है।'
      },
      {
        question: 'यदि सारणिक की किसी पंक्ति या स्तंभ के सभी अवयव शून्य हों, तो उस सारणिक का मान क्या होगा?',
        options: ['0 (शून्य)', '1', 'अपरिभाषित', 'अपरिवर्तित'],
        answerIndex: 0,
        explanation: 'यदि किसी सारणिक की किसी भी एक पंक्ति या स्तंभ के सभी अवयव शून्य हों, तो उसका प्रसरण (expansion) करने पर मान सदैव शून्य प्राप्त होता है।',
        hint: 'शून्य पंक्ति होने पर मान शून्य होता है।'
      }
    ]
  },
  // CLASS 12 - MATHEMATICS - UNIT 5 (CONTINUITY & DIFFERENTIATION)
  {
    id: 'board-12-math-ch5',
    board: 'ALL_STATE_BOARDS',
    classGrade: 'Class 12th',
    subject: 'Mathematics (गणित)',
    chapter: 'इकाई 5: सांतत्य तथा अवकलनीयता (Continuity & Differentiability)',
    totalQuestions: 5,
    timeMinutes: 10,
    descriptionHi: 'फलन का सांतत्य (Continuity), श्रृंखला नियम (Chain Rule), लॉगरिदमिक अवकलन एवं द्वितीय कोटि अवकलज।',
    descriptionEn: 'Continuity test, Chain rule, Logarithmic differentiation & Second order derivatives.',
    questions: [
      {
        question: 'd/dx [sin(x²)] का अवकलज (Derivative) क्या होगा?',
        options: ['2x cos(x²)', 'cos(x²)', '2x sin(x²)', '-2x cos(x²)'],
        answerIndex: 0,
        explanation: 'श्रृंखला नियम (Chain rule) द्वारा: d/dx [sin(u)] = cos(u) · du/dx। यहाँ u = x², अतः cos(x²) · 2x = 2x cos(x²)।',
        hint: 'पहले sin का फिर अंदर वाले x² का अवकलन।'
      },
      {
        question: 'फलन f(x) = |x| बिन्दु x = 0 पर:',
        options: ['सतत है किन्तु अवकलनीय नहीं है (Continuous but not differentiable)', 'सतत एवं अवकलनीय दोनों है', 'न सतत है न अवकलनीय', 'अपरिभाषित है'],
        answerIndex: 0,
        explanation: 'x = 0 पर LHL = RHL = f(0) = 0 है, अतः यह सतत है। किन्तु वाम हस्त अवकलज (-1) और दक्षिण हस्त अवकलज (+1) बराबर नहीं हैं, अतः यह अवकलनीय नहीं है (नोकदार बिन्दु)।',
        hint: 'मोड फंक्शन 0 पर सतत होता है लेकिन कोना बनने के कारण अवकलनीय नहीं होता।'
      },
      {
        question: 'यदि y = e^(ax) है, तो इसका n-वां अवकलज (n-th Derivative, y_n) क्या होगा?',
        options: ['aⁿ e^(ax)', 'a e^(ax)', 'n a e^(ax)', 'e^(aⁿx)'],
        answerIndex: 0,
        explanation: 'y₁ = a e^(ax), y₂ = a² e^(ax), ..., y_n = aⁿ e^(ax)।',
        hint: 'प्रत्येक अवकलन पर a गुणांक बाहर आता है।'
      },
      {
        question: 'd/dx [log(sec x + tan x)] का मान किसके बराबर होता है?',
        options: ['sec x', 'tan x', 'sec² x', 'sec x + tan x'],
        answerIndex: 0,
        explanation: '1/(sec x + tan x) · (sec x tan x + sec² x) = [sec x (tan x + sec x)] / (sec x + tan x) = sec x।',
        hint: 'मानक अवकलन सूत्र।'
      },
      {
        question: 'फलन f(x) के बिन्दु x = c पर सतत (Continuous) होने की आवश्यक शर्त क्या है?',
        options: ['lim (x➔c) f(x) = f(c)', 'lim (x➔c) f(x) = 0', 'f\'(c) = 0', 'f(c) > 0'],
        answerIndex: 0,
        explanation: 'सांतत्य की परिभाषा: LHL = RHL = f(c) अर्थात् सीमा का मान उस बिन्दु पर फलन के मान के बराबर होना चाहिए।',
        hint: 'लिमिट = फलन का मान।'
      }
    ]
  }
];

interface BoardExamSingleTestBoxProps {
  language?: 'hindi' | 'english';
  onStartBoardTest: (test: BoardChapterTest) => void;
}

export const BoardExamSingleTestBox: React.FC<BoardExamSingleTestBoxProps> = ({
  language = 'hindi',
  onStartBoardTest
}) => {
  const isHindi = language === 'hindi';
  const [selectedClass, setSelectedClass] = useState<'Class 10th' | 'Class 12th'>('Class 10th');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');

  const filteredTests = CURATED_BOARD_EXAM_TESTS.filter(t => {
    const matchClass = t.classGrade === selectedClass;
    const matchSub = selectedSubjectFilter === 'all' || t.subject.includes(selectedSubjectFilter);
    return matchClass && matchSub;
  });

  return (
    <div className="w-full bg-gradient-to-r from-[#0d1527] via-[#0a0f1d] to-[#0d1527] border-2 border-amber-500/50 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4 my-2 text-left animate-fade-in relative overflow-hidden">
      
      {/* Background Accent Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER ROW */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-xl shadow-lg shadow-amber-500/30 shrink-0 font-bold">
            🎓
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                {isHindi ? 'बोर्ड परीक्षा: अध्यायवार सिंगल टेस्ट (Chapter-wise Test)' : 'Board Exam: Chapter-wise Single Test'}
              </h3>
              <span className="text-[10px] font-black bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full uppercase">
                CBSE • UP • BIHAR
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              {isHindi
                ? '10वीं व 12वीं बोर्ड परीक्षा के लिए विषय व अध्यायवार सिंगल टेस्ट — 100% फ्री टाइमर आधारित'
                : 'Subject & chapter-wise timed tests for 10th & 12th Board examinations'}
            </p>
          </div>
        </div>

        {/* Class Switcher (10th vs 12th) */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800 shrink-0 self-stretch sm:self-auto justify-center">
          {(['Class 10th', 'Class 12th'] as const).map(cls => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                selectedClass === cls
                  ? 'bg-amber-500 text-slate-950 shadow-md scale-[1.02]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cls}
            </button>
          ))}
        </div>
      </div>

      {/* SUBJECT FILTER PILLS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <button
          onClick={() => setSelectedSubjectFilter('all')}
          className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            selectedSubjectFilter === 'all'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          {isHindi ? 'सभी विषय' : 'All Subjects'}
        </button>

        {selectedClass === 'Class 10th' ? (
          <>
            {['Science', 'Social Science', 'Mathematics'].map(s => (
              <button
                key={s}
                onClick={() => setSelectedSubjectFilter(s)}
                className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedSubjectFilter === s
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {s}
              </button>
            ))}
          </>
        ) : (
          <>
            {['Mathematics', 'Physics', 'Chemistry', 'Biology'].map(s => (
              <button
                key={s}
                onClick={() => setSelectedSubjectFilter(s)}
                className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedSubjectFilter === s
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {s}
              </button>
            ))}
          </>
        )}
      </div>

      {/* CHAPTER TEST CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 relative z-10">
        {filteredTests.map((test) => (
          <div
            key={test.id}
            className="bg-[#070b14] border border-slate-800 hover:border-amber-500/60 rounded-2xl p-3.5 flex flex-col justify-between space-y-3 transition-all hover:shadow-lg hover:shadow-amber-500/10 group"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">
                  {test.subject}
                </span>
                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>{test.timeMinutes} Min</span>
                </span>
              </div>

              <h4 className="text-xs font-black text-white group-hover:text-amber-300 transition-colors leading-snug line-clamp-2">
                {test.chapter}
              </h4>

              <p className="text-[11px] text-slate-400 leading-tight line-clamp-2">
                {isHindi ? test.descriptionHi : test.descriptionEn}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-900 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400">
                {test.totalQuestions} {isHindi ? 'वस्तुनिष्ठ प्रश्न' : 'MCQs'}
              </span>

              <button
                type="button"
                onClick={() => onStartBoardTest(test)}
                className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
              >
                <span>{isHindi ? 'सिंगल टेस्ट शुरू करें' : 'Start Test'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
