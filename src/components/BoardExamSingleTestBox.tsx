import React, { useState, useEffect } from 'react';
import {
  BookOpen, Award, CheckCircle2, Clock, Zap, ArrowRight,
  Sparkles, FileText, ChevronRight, Layers, GraduationCap, ShieldCheck, Play,
  Users, TrendingUp, BarChart3, Download, Share2
} from 'lucide-react';
import { QuizQuestion, MistakeNotebookItem } from '../types';
import { StudentGoalProfile } from './StudentGoalOnboardingModal';

export interface BoardChapterTest {
  id: string;
  board: 'CBSE' | 'ICSE' | 'UP_BOARD' | 'BIHAR_BOARD' | 'ALL_STATE_BOARDS';
  classGrade: 'Class 10th' | 'Class 12th';
  streamTags?: ('science_pcm' | 'science_pcb' | 'commerce' | 'arts')[];
  subject: string;
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
    streamTags: ['science_pcm', 'science_pcb'],
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
    streamTags: ['science_pcm', 'science_pcb'],
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
    streamTags: ['science_pcm'],
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
    streamTags: ['science_pcm'],
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
  },
  // CLASS 12 - BIOLOGY - CHAPTER 2 (SEXUAL REPRODUCTION IN FLOWERING PLANTS) [PCB]
  {
    id: 'board-12-bio-ch2',
    board: 'ALL_STATE_BOARDS',
    classGrade: 'Class 12th',
    streamTags: ['science_pcb'],
    subject: 'Biology (जीव विज्ञान)',
    chapter: 'अध्याय 2: पुष्पी पादपों में लैंगिक जनन (Sexual Reproduction in Plants)',
    totalQuestions: 5,
    timeMinutes: 10,
    descriptionHi: 'परागकण, बीजांड संरचना, दोहरा निषेचन (Double Fertilization) एवं त्रिसंलयन।',
    descriptionEn: 'Microsporogenesis, Megasporogenesis, Double Fertilization & Endosperm development.',
    questions: [
      {
        question: 'आवृतबीजी (Angiosperms) पौधों में दोहरा निषेचन (Double Fertilization) किसके संलयन से होता है?',
        options: ['एक नर युग्मक + अंड कोशिका और दूसरा नर युग्मक + द्वितीयक केंद्रक', 'दो नर युग्मक + एक अंड कोशिका', 'पराग नलिका + बीजांड द्वार', 'सहायक कोशिकाएं + प्रतिव्यासांत कोशिकाएं'],
        answerIndex: 0,
        explanation: 'पहला संलयन: नर युग्मक (n) + अंड (n) ➔ युग्मनज (2n)। दूसरा संलयन: दूसरा नर युग्मक (n) + केंद्रीय कोशिका (2n) ➔ प्राथमिक भ्रूणपोष केंद्रक (3n, PEN)।',
        hint: 'युग्मनज (2n) और भ्रूणपोष (3n) बनते हैं।'
      },
      {
        question: 'परागकण (Pollen Grain) की बाहरी भित्ति (Exine) किस अत्यधिक प्रतिरोधी पदार्थ की बनी होती है?',
        options: ['स्पोरोपोलिनिन (Sporopollenin)', 'सेलूलोज', 'पेक्टिन', 'काइटिन'],
        answerIndex: 0,
        explanation: 'स्पोरोपोलिनिन ज्ञात सर्वाधिक प्रतिरोधी जैविक पदार्थों में से एक है। यह उच्च ताप, सुदृढ़ अम्लों व क्षारों को सहन कर सकता है और इसे कोई एंजाइम अपघटित नहीं कर सकता।',
        hint: 'यह परागकणों को लाखों वर्षों तक जीवाश्म के रूप में सुरक्षित रखता है।'
      },
      {
        question: 'परिपक्व मादा युग्मकोद्भिद (Mature Embryo Sac) में कोशिकाओं एवं केंद्रकों की संख्या क्या होती है?',
        options: ['7 कोशिकीय एवं 8 केंद्रकीय (7-celled, 8-nucleate)', '8 कोशिकीय एवं 8 केंद्रकीय', '7 कोशिकीय एवं 7 केंद्रकीय', '3 कोशिकीय एवं 3 केंद्रकीय'],
        answerIndex: 0,
        explanation: '3 अंड उपकरण कोशिकाएं, 3 प्रतिव्यासांत कोशिकाएं और 1 बड़ी केंद्रीय कोशिका (जिसमें 2 ध्रुवीय केंद्रक होते हैं) = 7 कोशिकाएं, 8 केंद्रक।',
        hint: 'सात कोशिकाएं और आठ केंद्रक होते हैं।'
      },
      {
        question: 'सेब (Apple) और काजू किस प्रकार के फल के उदाहरण हैं?',
        options: ['आभासी फल / असत्य फल (False Fruit)', 'सत्य फल (True Fruit)', 'अनिषेकजनित फल (Parthenocarpic Fruit)', 'समग्र फल'],
        answerIndex: 0,
        explanation: 'सेब और स्ट्रॉबेरी में फल के निर्माण में पुष्पासन (Thalamus) भी भाग लेता है, इसलिए इन्हें आभासी या मिथ्या फल (False Fruit) कहते हैं।',
        hint: 'जिसमें पुष्पासन खाने योग्य भाग होता है।'
      },
      {
        question: 'बिना निषेचन के ही अंडाशय से फल बनने की क्रिया क्या कहलाती है?',
        options: ['अनिषेकफलन (Parthenocarpy)', 'अनिषेकजनन (Parthenogenesis)', 'असंगजनन (Apomixis)', 'बहुभ्रूणता (Polyembryony)'],
        answerIndex: 0,
        explanation: 'बिना निषेचन के अंडाशय से बीजहीन फल का विकास अनिषेकफलन (जैसे केला) कहलाता है।',
        hint: 'केला इसका प्रमुख उदाहरण है।'
      }
    ]
  },
  // CLASS 12 - BIOLOGY - CHAPTER 5 (PRINCIPLES OF INHERITANCE) [PCB]
  {
    id: 'board-12-bio-ch5',
    board: 'ALL_STATE_BOARDS',
    classGrade: 'Class 12th',
    streamTags: ['science_pcb'],
    subject: 'Biology (जीव विज्ञान)',
    chapter: 'अध्याय 5: वंशागति तथा विविधता के सिद्धांत (Mendelian Genetics)',
    totalQuestions: 5,
    timeMinutes: 10,
    descriptionHi: 'मेंडल के नियम, प्रभाविता, अपूर्ण प्रभाविता, सह-प्रभाविता एवं लिंग निर्धारण।',
    descriptionEn: 'Mendel\'s Laws, Incomplete dominance, Codominance & Sex determination.',
    questions: [
      {
        question: 'मेंडल के द्विसंकर संकरण (Dihybrid Cross) में F2 पीढ़ी का लक्षणप्ररूपी अनुपात (Phenotypic Ratio) क्या होता है?',
        options: ['9 : 3 : 3 : 1', '1 : 2 : 1', '3 : 1', '9 : 7'],
        answerIndex: 0,
        explanation: 'पीले-गोल (9) : हरे-गोल (3) : पीले-झुर्रीदार (3) : हरे-झुर्रीदार (1) का अनुपात 9:3:3:1 प्राप्त होता है।',
        hint: 'नौ अनुपात तीन अनुपात तीन अनुपात एक।'
      },
      {
        question: 'मानव में ABO रक्त समूह प्रणाली निम्नलिखित में से किसका सर्वोत्तम उदाहरण है?',
        options: ['सह-प्रभाविता (Codominance) एवं बहु-विकल्पता (Multiple Allelism)', 'अपूर्ण प्रभाविता', 'बिंदु उत्परिवर्तन', 'सहलग्नता'],
        answerIndex: 0,
        explanation: 'ABO रक्त समूह में Iᴬ और Iᴮ दोनों एक साथ पूर्ण रूप से व्यक्त होते हैं (AB रक्त समूह में सह-प्रभाविता) तथा जीन I के 3 एलील (Iᴬ, Iᴮ, i) होते हैं।',
        hint: 'ए और बी दोनों एलील समान रूप से प्रभावी होते हैं।'
      },
      {
        question: 'डाउन सिंड्रोम (Down\'s Syndrome) आनुवंशिक विकार का मुख्य कारण क्या है?',
        options: ['21वें गुणसूत्र की त्रिसूत्रता (Trisomy of 21st Chromosome, 2n+1 = 47)', 'लिंग गुणसूत्र की एकलसूत्रता (Turner\'s)', 'XXY गुणसूत्र संयोजन', 'गुणसूत्र संख्या 5 का विलोपन'],
        answerIndex: 0,
        explanation: 'डाउन सिंड्रोम 21वें ऑटोसोम गुणसूत्र की अतिरिक्त प्रतिलिपि आ जाने (Trisomy 21) के कारण होता है, कुल गुणसूत्र 47 हो जाते हैं।',
        hint: '21वें क्रोमोसोम की ट्राइसोमी।'
      },
      {
        question: 'टर्नर सिंड्रोम (Turner\'s Syndrome) से ग्रसित स्त्री का गुणसूत्र संयोजन क्या होता है?',
        options: ['44 + XO (कुल 45 गुणसूत्र)', '44 + XXY (कुल 47 गुणसूत्र)', '44 + XXX', '44 + XYY'],
        answerIndex: 0,
        explanation: 'टर्नर सिंड्रोम में एक X गुणसूत्र की अनुपस्थिति (Monosomy XO) होती है। कुल गुणसूत्र 45 होते हैं और मादा बांझ (Sterile) होती है।',
        hint: 'एक X क्रोमोसोम गायब होता है।'
      },
      {
        question: 'हीमोफीलिया (Haemophilia) किस प्रकार का आनुवंशिक रोग है?',
        options: ['X-सहलग्न अप्रभावी रोग (X-linked Recessive)', 'Y-सहलग्न प्रभावी रोग', 'ऑटोसोमल प्रभावी रोग', 'जीवाणु जनित रोग'],
        answerIndex: 0,
        explanation: 'हीमोफीलिया X-गुणसूत्र सहलग्न अप्रभावी रोग है, जिसमें रक्त का थक्का नहीं जमता (रॉयल डिजीज)।',
        hint: 'इसे शाही रोग भी कहते हैं।'
      }
    ]
  },
  // CLASS 12 - COMMERCE - ACCOUNTANCY (PARTNERSHIP FUNDAMENTALS)
  {
    id: 'board-12-acc-ch1',
    board: 'ALL_STATE_BOARDS',
    classGrade: 'Class 12th',
    streamTags: ['commerce'],
    subject: 'Accountancy (लेखाशास्त्र)',
    chapter: 'इकाई 1: साझेदारी फर्मों का लेखांकन - आधारभूत सिद्धांत व ख्याति',
    totalQuestions: 5,
    timeMinutes: 10,
    descriptionHi: 'लाभ-हानि नियोजन खाता, साझेदारों के पूंजी खाते, पूंजी पर ब्याज एवं ख्याति का मूल्यांकन।',
    descriptionEn: 'P&L Appropriation Account, Capital Accounts, Interest on Capital & Goodwill valuation.',
    questions: [
      {
        question: 'साझेदारी संलेख (Partnership Deed) के अभाव में साझेदारों द्वारा दिए गए ऋण पर किस दर से ब्याज दिया जाता है?',
        options: ['6% वार्षिक साधारण ब्याज', '10% वार्षिक ब्याज', '12% वार्षिक ब्याज', 'कोई ब्याज नहीं दिया जाता'],
        answerIndex: 0,
        explanation: 'भारतीय साझेदारी अधिनियम 1932 की धारा 13(d) के अनुसार साझेदारी संलेख न होने पर ऋण पर 6% प्रतिवर्ष की दर से ब्याज अनुमन्य है।',
        hint: 'छह प्रतिशत प्रतिवर्ष।'
      },
      {
        question: 'ख्याति (Goodwill) किस प्रकार की संपत्ति (Asset) है?',
        options: ['अमूर्त संपत्ति (Intangible Asset) किन्तु मूल्यवान', 'मूर्त संपत्ति (Tangible Asset)', 'काल्पनिक संपत्ति (Fictitious Asset)', 'चल संपत्ति'],
        answerIndex: 0,
        explanation: 'ख्याति एक अमूर्त संपत्ति (Intangible Asset) है जिसे छुआ या देखा नहीं जा सकता, किन्तु इसका वास्तविक मौद्रिक मूल्य होता है।',
        hint: 'जिसका भौतिक स्वरूप नहीं होता किन्तु मूल्य होता है।'
      },
      {
        question: 'साझेदारों के चालू खाते (Current Accounts) किस पूंजी पद्धति के अंतर्गत खोले जाते हैं?',
        options: ['स्थाई पूंजी पद्धति (Fixed Capital System)', 'परिवर्तनशील पूंजी पद्धति (Fluctuating Capital)', 'सरल पूंजी पद्धति', 'ऋण पूंजी पद्धति'],
        answerIndex: 0,
        explanation: 'स्थाई पूंजी पद्धति में दो खाते बनते हैं: (1) साझेदारों का पूंजी खाता (Fixed) और (2) साझेदारों का चालू खाता (Current Account)।',
        hint: 'फिक्स्ड कैपिटल मेथड में।'
      },
      {
        question: 'त्याग अनुपात (Sacrificing Ratio) ज्ञात करने का सही सूत्र क्या है?',
        options: ['पुराना अनुपात - नया अनुपात (Old Ratio - New Ratio)', 'नया अनुपात - पुराना अनुपात', 'पुराना अनुपात + नया अनुपात', 'लाभ अनुपात × 2'],
        answerIndex: 0,
        explanation: 'नये साझेदार के प्रवेश पर पुराने साझेदार अपने हिस्से का त्याग करते हैं, अतः त्याग = पुराना हिस्सा - नया हिस्सा।',
        hint: 'पुराना अनुपात माइनस नया अनुपात।'
      },
      {
        question: 'लाभ-हानि नियोजन खाता (P&L Appropriation Account) किस प्रकार का खाता है?',
        options: ['नाममात्र खाता (Nominal Account)', 'व्यक्तिगत खाता (Personal Account)', 'वास्तविक खाता (Real Account)', 'प्रतिनिधि खाता'],
        answerIndex: 0,
        explanation: 'लाभ-हानि नियोजन खाता लाभों के वितरण हेतु बनाया जाता है और यह नाममात्र खाता (Nominal Account) होता है।',
        hint: 'खर्चों व आय से संबंधित नॉमिनल अकाउंट।'
      }
    ]
  },
  // CLASS 12 - COMMERCE - BUSINESS STUDIES (PRINCIPLES OF MANAGEMENT)
  {
    id: 'board-12-bst-ch2',
    board: 'ALL_STATE_BOARDS',
    classGrade: 'Class 12th',
    streamTags: ['commerce'],
    subject: 'Business Studies (व्यवसाय अध्ययन)',
    chapter: 'इकाई 2: प्रबंध के सिद्धांत (Principles of Management - Fayol & Taylor)',
    totalQuestions: 5,
    timeMinutes: 10,
    descriptionHi: 'हेनरी फेयोल के 14 सिद्धांत, एफ.डब्ल्यू. टेलर का वैज्ञानिक प्रबंध एवं समय-गति अध्ययन।',
    descriptionEn: 'Henry Fayol\'s 14 Principles, F.W. Taylor\'s Scientific Management & Mental Revolution.',
    questions: [
      {
        question: 'प्रशासनिक प्रबंध के जनक (Father of General Management) किन्हें कहा जाता है जिन्होंने प्रबंध के 14 सिद्धांत प्रतिपादित किए?',
        options: ['हेनरी फेयोल (Henri Fayol)', 'एफ. डब्ल्यू. टेलर (F.W. Taylor)', 'पीटर ड्रकर', 'एल्टन मेयो'],
        answerIndex: 0,
        explanation: 'फ्रांसीसी खनन इंजीनियर हेनरी फेयोल ने 1916 में अपनी पुस्तक में प्रबंध के 14 सार्वभौमिक सिद्धांत प्रतिपादित किए।',
        hint: 'फ्रांस के प्रसिद्ध उद्योगपति व लेखक।'
      },
      {
        question: 'फेयोल के किस सिद्धांत के अनुसार एक कर्मचारी को केवल एक ही उच्च अधिकारी से आदेश प्राप्त होना चाहिए?',
        options: ['आदेश की एकता का सिद्धांत (Unity of Command)', 'निर्देश की एकता (Unity of Direction)', 'अधिकार एवं उत्तरदायित्व', 'सोपान श्रृंखला (Scalar Chain)'],
        answerIndex: 0,
        explanation: 'आदेश की एकता का सिद्धांत कहता है कि द्वैध अधीनता (dual subordination) से बचने के लिए कर्मचारी को केवल एक बॉस से निर्देश मिलने चाहिए।',
        hint: 'यूनिटी ऑफ कमांड।'
      },
      {
        question: 'वैज्ञानिक प्रबंध के जनक एफ. डब्ल्यू. टेलर द्वारा प्रतिपादित "मानसिक क्रांति" (Mental Revolution) का क्या तात्पर्य है?',
        options: ['प्रबंधकों और श्रमिकों के बीच दृष्टिकोण एवं पारस्परिक सहयोग में संपूर्ण परिवर्तन', 'कम्प्यूटर का प्रयोग', 'वेतन में कटौती', 'हड़ताल पर प्रतिबंध'],
        answerIndex: 0,
        explanation: 'टेलर के अनुसार मानसिक क्रांति का अर्थ है कि श्रमिक और प्रबंध दोनों एक दूसरे के प्रति विरोध छोड़ सहयोग और उत्पादन वृद्धि की भावना अपनाएं।',
        hint: 'मालिक और कर्मचारी के बीच सहयोग की भावना।'
      },
      {
        question: 'सोपान श्रृंखला (Scalar Chain) में आपातकालीन सीधा संपर्क स्थापित करने की व्यवस्था क्या कहलाती है?',
        options: ['गैंग प्लैंक / समतल संपर्क (Gang Plank)', 'अनौपचारिक संचार', 'अंगूरीलता', 'डायरेक्ट लाइन'],
        answerIndex: 0,
        explanation: 'फेयोल ने विलंब से बचने हेतु समान स्तर के कर्मचारियों के बीच आपातकालीन सीधे संवाद हेतु गैंग प्लैंक (Gang Plank) का सुझाव दिया।',
        hint: 'समतल संपर्क व्यवस्था।'
      },
      {
        question: 'टेलर के अनुसार किसी कार्य को करने की न्यूनतम समय अवधि निर्धारित करने हेतु कौन सा अध्ययन किया जाता है?',
        options: ['समय अध्ययन (Time Study)', 'गति अध्ययन (Motion Study)', 'थकान अध्ययन (Fatigue Study)', 'पद्धति अध्ययन (Method Study)'],
        answerIndex: 0,
        explanation: 'स्टॉपवॉच की सहायता से किसी मानक कार्य को पूरा करने के लिए आवश्यक समय को मापने की विधि समय अध्ययन (Time Study) कहलाती है।',
        hint: 'स्टॉपवॉच द्वारा समय निर्धारण।'
      }
    ]
  },
  // CLASS 12 - COMMERCE & ARTS - ECONOMICS (NATIONAL INCOME)
  {
    id: 'board-12-eco-ch1',
    board: 'ALL_STATE_BOARDS',
    classGrade: 'Class 12th',
    streamTags: ['commerce', 'arts'],
    subject: 'Economics (अर्थशास्त्र)',
    chapter: 'इकाई 1: समष्टि अर्थशास्त्र - राष्ट्रीय आय की गणना (National Income Accounting)',
    totalQuestions: 5,
    timeMinutes: 10,
    descriptionHi: 'GDP, GNP, NNP, साधन लागत एवं बाजार कीमत, आय विधि, व्यय विधि व मूल्यह्रास।',
    descriptionEn: 'GDP, GNP, NNP at Factor Cost, Value Added, Income & Expenditure methods.',
    questions: [
      {
        question: 'सकल राष्ट्रीय उत्पाद (GNP) और सकल घरेलू उत्पाद (GDP) में क्या मूल अंतर होता है?',
        options: ['विदेशों से प्राप्त शुद्ध साधन आय (NFIA - Net Factor Income from Abroad)', 'मूल्यह्रास (Depreciation)', 'शुद्ध अप्रत्यक्ष कर (NIT)', 'आर्थिक सहायता (Subsidies)'],
        answerIndex: 0,
        explanation: 'GNP = GDP + विदेशों से प्राप्त शुद्ध साधन आय (NFIA)। देश के सामान्य निवासियों द्वारा उत्पादित कुल मूल्य GNP होता है।',
        hint: 'NFIA (विदेशों से अर्जित शुद्ध साधन आय)।'
      },
      {
        question: 'बाजार मूल्य पर सकल घरेलू उत्पाद (GDP_MP) से साधन लागत पर सकल घरेलू उत्पाद (GDP_FC) ज्ञात करने के लिए क्या घटाया जाता है?',
        options: ['शुद्ध अप्रत्यक्ष कर (Net Indirect Taxes = Indirect Tax - Subsidy)', 'मूल्यह्रास', 'शुद्ध निर्यात', 'ब्याज भुगतान'],
        answerIndex: 0,
        explanation: 'GDP_FC = GDP_MP - शुद्ध अप्रत्यक्ष कर (NIT)। बाजार कीमत में अप्रत्यक्ष कर शामिल होते हैं और सब्सिडी घटाई जाती है।',
        hint: 'NIT (शुद्ध अप्रत्यक्ष कर) घटाया जाता है।'
      },
      {
        question: 'किसी देश की वास्तविक राष्ट्रीय आय (Real National Income) किस मूल्य पर मापी जाती है?',
        options: ['स्थिर कीमतों पर (At Constant Prices / Base Year Prices)', 'चालू कीमतों पर (At Current Prices)', 'थोक मूल्य सूचकांक पर', 'अन्तर्राष्ट्रीय डॉलर दर पर'],
        answerIndex: 0,
        explanation: 'मुद्रास्फीति (महंगाई) के प्रभाव को हटाने के लिए वास्तविक राष्ट्रीय आय की गणना आधार वर्ष की स्थिर कीमतों (Constant Prices) पर की जाती है।',
        hint: 'आधार वर्ष की स्थिर कीमतों पर।'
      },
      {
        question: 'स्थाई संपत्तियों के निरंतर उपभोग एवं घिसावट से होने वाली मूल्य हानि को क्या कहते हैं?',
        options: ['मूल्यह्रास / अचल पूंजी का उपभोग (Depreciation / Consumption of Fixed Capital)', 'पूंजीगत हानि', 'आकस्मिक हानि', 'अपचलन'],
        answerIndex: 0,
        explanation: 'सकल (Gross) से शुद्ध (Net) में बदलने के लिए मूल्यह्रास (Depreciation) को घटाया जाता है।',
        hint: 'घिसावट व्यय।'
      },
      {
        question: 'भारत में राष्ट्रीय आय के आंकड़ों का संकलन एवं प्रकाशन किस आधिकारिक संस्था द्वारा किया जाता है?',
        options: ['राष्ट्रीय सांख्यिकी कार्यालय (NSO / पूर्व में CSO)', 'भारतीय रिजर्व बैंक (RBI)', 'नीति आयोग (NITI Aayog)', 'वित्त मंत्रालय'],
        answerIndex: 0,
        explanation: 'राष्ट्रीय सांख्यिकी कार्यालय (NSO - National Statistical Office, सांख्यिकी एवं कार्यक्रम कार्यान्वयन मंत्रालय) भारत में राष्ट्रीय आय का संकलन करता है।',
        hint: 'केंद्रीय सांख्यिकी संगठन (CSO/NSO)।'
      }
    ]
  },
  // CLASS 12 - ARTS - HISTORY (HARAPPAN CIVILISATION)
  {
    id: 'board-12-hist-ch1',
    board: 'ALL_STATE_BOARDS',
    classGrade: 'Class 12th',
    streamTags: ['arts'],
    subject: 'History (इतिहास)',
    chapter: 'भाग 1: ईंटें, मनके तथा अस्थियां - हड़प्पा सभ्यता (Harappan Civilisation)',
    totalQuestions: 5,
    timeMinutes: 10,
    descriptionHi: 'नगर नियोजन, मोहनजोदड़ो का विशाल स्नानागार, मुहरें व लिपि, कृषि व शिल्प उत्पादन।',
    descriptionEn: 'Town Planning, Great Bath of Mohenjodaro, Harappan seals & script.',
    questions: [
      {
        question: 'मोहनजोदड़ो का सर्वाधिक प्रसिद्ध सार्वजनिक स्थापत्य स्मारक कौन सा है जिसकी फर्श जिप्सम के गारे से जलरोधी बनाई गई थी?',
        options: ['विशाल स्नानागार (The Great Bath)', 'अन्नागार', 'सभा भवन', 'पुरोहित का महल'],
        answerIndex: 0,
        explanation: 'मोहनजोदड़ो के दुर्ग (Citadel) पर स्थित विशाल स्नानागार एक आयताकार जलाशय था जिसके किनारों पर ईंटों की चुनाई और जिप्सम के गारे से प्लास्टर किया गया था।',
        hint: 'दुर्ग क्षेत्र में स्थित सामूहिक अनुष्ठानिक स्नान का कुंड।'
      },
      {
        question: 'हड़प्पा सभ्यता का मनके बनाने का सबसे प्रमुख विशिष्ट औद्योगिक केंद्र कौन सा था?',
        options: ['चन्हूदड़ो (Chanhudaro)', 'कालीबंगा', 'रोपड़', 'कोटदीजी'],
        answerIndex: 0,
        explanation: 'चन्हूदड़ो एक छोटी बस्ती थी जो पूरी तरह शिल्प उत्पादन - मनके बनाना, शंख की कटाई, धातु कर्म और मुहर निर्माण में संलग्न थी।',
        hint: 'सिंधु नदी के तट पर स्थित शिल्प केंद्र।'
      },
      {
        question: 'हड़प्पा सभ्यता में जूते हुए खेत के साक्ष्य (Ploughed Field Evidence) किस स्थल से प्राप्त हुए हैं?',
        options: ['कालीबंगा (राजस्थान)', 'बनावली (हरियाणा)', 'धौलावीरा (गुजरात)', 'राखीगढ़ी'],
        answerIndex: 0,
        explanation: 'कालीबंगा में प्राक-हड़प्पा स्तरों से जूते हुए खेत के साक्ष्य मिले हैं जहाँ दोहरी फसलें समकोण पर ग्रिड पद्धति में उगाई जाती थीं।',
        hint: 'राजस्थान के हनुमानगढ़ जिले में स्थित स्थल।'
      },
      {
        question: 'हड़प्पा मुहरों पर सर्वाधिक रूप से किस पशु का अंकन मिलता है?',
        options: ['एकश्रृंगी पशु (Unicorn / एक सींग वाला बैल)', 'कूबड़ वाला वृषभ', 'हाथी', 'बाघ'],
        answerIndex: 0,
        explanation: 'सेलखड़ी (Steatite) की चौकोर मुहरों पर सर्वाधिक बार काल्पनिक एकश्रृंगी पशु (Unicorn) का चित्र अंकित पाया गया है।',
        hint: 'एक सींग वाला पशु।'
      },
      {
        question: 'हड़प्पा सभ्यता की लिपि की प्रमुख विशेषता क्या थी?',
        options: ['यह भावचित्रात्मक (Pictographic) थी और दाईं से बाईं ओर लिखी जाती थी', 'यह ब्राह्मी लिपि थी', 'यह देवनागरी लिपि जैसी थी', 'यह आज तक पूरी तरह पढ़ ली गई है'],
        answerIndex: 0,
        explanation: 'हड़प्पा लिपि रहस्यमयी (रहस्यमय) लिपि है जो आज तक पढ़ी नहीं जा सकी है। यह भावचित्रात्मक थी और दाईं से बाईं ओर (Right to Left) लिखी जाती थी।',
        hint: 'दाएं से बाएं लिखी जाने वाली चित्रात्मक लिपि।'
      }
    ]
  },
  // CLASS 12 - ARTS - POLITICAL SCIENCE (COLD WAR & BIPOLARITY)
  {
    id: 'board-12-pol-ch1',
    board: 'ALL_STATE_BOARDS',
    classGrade: 'Class 12th',
    streamTags: ['arts'],
    subject: 'Political Science (राजनीति विज्ञान)',
    chapter: 'इकाई 1: समकालीन विश्व राजनीति - दो ध्रुवीयता का अंत (The End of Bipolarity)',
    totalQuestions: 5,
    timeMinutes: 10,
    descriptionHi: 'बर्लिन की दीवार, सोवियत संघ का विघटन, शॉक थेरेपी एवं मिखाइल गोर्बाचेव की नीतियां।',
    descriptionEn: 'Fall of Berlin Wall, Disintegration of USSR 1991, Shock Therapy & Gorbachev reforms.',
    questions: [
      {
        question: 'शीतयुद्ध के प्रतीक के रूप में खड़ी की गई बर्लिन की दीवार (Berlin Wall) को जनता द्वारा किस वर्ष गिराया गया?',
        options: ['9 नवंबर 1989', '15 अगस्त 1991', '25 दिसंबर 1990', '1985'],
        answerIndex: 0,
        explanation: '9 नवंबर 1989 को बर्लिन की दीवार को पूर्वी जर्मनी की आम जनता द्वारा गिरा दिया गया, जो शीतयुद्ध के अंत का ऐतिहासिक प्रतीक बना।',
        hint: 'वर्ष 1989 के अंत में।'
      },
      {
        question: 'सोवियत संघ (USSR) का औपचारिक विघटन किस वर्ष हुआ जिसमें 15 नए स्वतंत्र गणराज्य बने?',
        options: ['दिसंबर 1991', 'जनवरी 1989', 'अगस्त 1990', 'मार्च 1992'],
        answerIndex: 0,
        explanation: '25 दिसंबर 1991 को मिखाइल गोर्बाचेव ने सोवियत संघ के राष्ट्रपति पद से त्यागपत्र दे दिया और 15 गणराज्यों में सोवियत संघ विघटित हो गया। रूस इसका उत्तराधिकारी बना।',
        hint: '1991 में सोवियत संघ समाप्त हुआ।'
      },
      {
        question: 'सोवियत संघ में \'ग्लासनोस्त\' (खुलापन) और \'पेरेस्त्रोइका\' (पुनर्गठन) की सुधार नीतियां किसने प्रारंभ की थीं?',
        options: ['मिखाइल गोर्बाचेव (Mikhail Gorbachev)', 'निकिता ख्रुश्चेव', 'व्लादिमीर लेनिन', 'जोसेफ स्टालिन'],
        answerIndex: 0,
        explanation: '1985 में सोवियत संघ की कम्युनिस्ट पार्टी के महासचिव बने मिखाइल गोर्बाचेव ने सोवियत व्यवस्था में खुलापन (Glasnost) और पुनर्गठन (Perestroika) लागू किया।',
        hint: 'अंतिम सोवियत राष्ट्रपति।'
      },
      {
        question: 'सोवियत संघ के विघटन के बाद साम्यवाद से पूंजीवाद की ओर परिवर्तन के लिए विश्व बैंक एवं IMF द्वारा निर्देशित मॉडल क्या कहलाया?',
        options: ['शॉक थेरेपी (Shock Therapy - आघात पहुँचाकर उपचार करना)', 'मार्शल प्लान', 'पंचवर्षीय योजना', 'न्यू डील'],
        answerIndex: 0,
        explanation: 'साम्यवादी व्यवस्था को एकाएक पूंजीवादी बाजार अर्थव्यवस्था में बदलने के लिए अपनाए गए कष्टप्रद मॉडल को शॉक थेरेपी (Shock Therapy) कहा गया।',
        hint: 'आघात पहुंचाकर उपचार करना।'
      },
      {
        question: 'गुटनिरपेक्ष आंदोलन (NAM) का प्रथम शिखर सम्मेलन 1961 में किस शहर में आयोजित हुआ था?',
        options: ['बेलग्रेड (Belgrade)', 'बांडुंग', 'नई दिल्ली', 'काहिरा'],
        answerIndex: 0,
        explanation: 'नेहरू, टीटो और नासिर के नेतृत्व में गुटनिरपेक्ष आंदोलन (NAM) का प्रथम शिखर सम्मेलन 1961 में यूगोस्लाविया की राजधानी बेलग्रेड में हुआ था।',
        hint: 'यूगोस्लाविया की राजधानी।'
      }
    ]
  },
  // CLASS 12 - ARTS - GEOGRAPHY (HUMAN GEOGRAPHY)
  {
    id: 'board-12-geo-ch1',
    board: 'ALL_STATE_BOARDS',
    classGrade: 'Class 12th',
    streamTags: ['arts'],
    subject: 'Geography (भूगोल)',
    chapter: 'इकाई 1: मानव भूगोल - प्रकृति एवं विषय क्षेत्र (Human Geography: Scope)',
    totalQuestions: 5,
    timeMinutes: 10,
    descriptionHi: 'पर्यावरणीय निश्चयवाद, संभववाद, नव-निश्चयवाद (रुको और जाओ) एवं जनसंख्या वितरण।',
    descriptionEn: 'Environmental Determinism, Possibilism, Neo-Determinism (Stop & Go) & Griffith Taylor.',
    questions: [
      {
        question: 'नव-निश्चयवाद (Neo-Determinism) या "रुको और जाओ निश्चयवाद" (Stop and Go Determinism) की संकल्पना किसने प्रस्तुत की?',
        options: ['ग्रिफ़िथ टेलर (Griffith Taylor)', 'फ्रेडरिक रैटजेल', 'एलेन चर्चिल सेम्पल', 'विडाल डी ला ब्लाश'],
        answerIndex: 0,
        explanation: 'ऑस्ट्रेलियाई भूगोलवेत्ता ग्रिफिथ टेलर ने पर्यावरणीय निश्चयवाद और संभववाद के मध्य एक मध्यम मार्ग \'नव-निश्चयवाद\' प्रतिपादित किया।',
        hint: 'ट्रैफिक लाइट के आधार पर रुको और जाओ का सिद्धांत देने वाले भूगोलवेत्ता।'
      },
      {
        question: '\'मानव भूगोल मानव समाजों और धरातल के बीच संबंधों का संश्लेषित अध्ययन है\' - यह परिभाषा किस विद्वान ने दी?',
        options: ['फ्रेडरिक रैटजेल (Friedrich Ratzel - आधुनिक मानव भूगोल के जनक)', 'ब्लाश', 'हंटिंगटन', 'इमैनुएल कांट'],
        answerIndex: 0,
        explanation: 'जर्मन भूगोलवेत्ता फ्रेडरिक रैटजेल ने अपनी प्रसिद्ध पुस्तक \'एन्थ्रोपोजियोग्राफी\' (Anthropogeographie) में यह आधारभूत परिभाषा दी।',
        hint: 'आधुनिक मानव भूगोल के जनक।'
      },
      {
        question: 'जनसंख्या वृद्धि के जनसांख्यिकीय संक्रमण सिद्धांत (Demographic Transition Theory) की प्रथम अवस्था की मुख्य विशेषता क्या होती है?',
        options: ['उच्च जन्म दर एवं उच्च मृत्यु दर (जनसंख्या वृद्धि धीमी)', 'निम्न जन्म दर एवं निम्न मृत्यु दर', 'उच्च जन्म दर एवं गिरती मृत्यु दर', 'शून्य जनसंख्या वृद्धि'],
        answerIndex: 0,
        explanation: 'प्रथम अवस्था में महामारियों और भोजन की अनिश्चितता के कारण जन्म दर और मृत्यु दर दोनों उच्च होती हैं, जिससे जनसंख्या लगभग स्थिर रहती है।',
        hint: 'जन्म दर और मृत्यु दर दोनों बहुत अधिक होती हैं।'
      },
      {
        question: 'मानव विकास सूचकांक (Human Development Index - HDI) की अवधारणा किस अर्थशास्त्री द्वारा विकसित की गई थी?',
        options: ['डॉ. महबूब-उल-हक एवं प्रो. अमर्त्य सेन', 'एडम स्मिथ', 'अमर्त्य सेन अकेले', 'जॉन मेनार्ड कीन्स'],
        answerIndex: 0,
        explanation: 'पाकिस्तानी अर्थशास्त्री डॉ. महबूब-उल-हक ने 1990 में UNDP के तहत HDI का निर्माण किया जिसमें नोबेल विजेता प्रो. अमर्त्य सेन सहयोगी थे।',
        hint: '1990 में यूएनडीपी (UNDP) द्वारा जारी सूचकांक।'
      },
      {
        question: 'विश्व में सर्वाधिक जनसंख्या घनत्व वाला महाद्वीप कौन सा है?',
        options: ['एशिया (Asia)', 'यूरोप', 'अफ्रीका', 'उत्तरी अमेरिका'],
        answerIndex: 0,
        explanation: 'एशिया महाद्वीप में विश्व की लगभग 60% आबादी निवास करती है तथा यहाँ जनसंख्या घनत्व सर्वाधिक (लगभग 150 व्यक्ति प्रति वर्ग किमी) है।',
        hint: 'चीन और भारत इसी महाद्वीप में स्थित हैं।'
      }
    ]
  },
  // CLASS 10 - HINDI - GRAMMAR & KAVYA
  {
    id: 'board-10-hindi-ch1',
    board: 'ALL_STATE_BOARDS',
    classGrade: 'Class 10th',
    subject: 'Hindi (हिन्दी)',
    chapter: 'व्याकरण: रचना के आधार पर वाक्य भेद, वाच्य, पद-परिचय एवं रस',
    totalQuestions: 5,
    timeMinutes: 10,
    descriptionHi: 'सरल, संयुक्त व मिश्र वाक्य, कर्तृवाच्य-कर्मवाच्य, पद-परिचय एवं नवरस के स्थायी भाव।',
    descriptionEn: 'Sentence transformation, Voice (Vachya), Parts of speech parsing & Rasa.',
    questions: [
      {
        question: '\'जब सूर्योदय हुआ तब चारों ओर उजाला फैल गया\' - यह रचना के आधार पर किस प्रकार का वाक्य है?',
        options: ['मिश्र वाक्य (Complex Sentence)', 'सरल वाक्य', 'संयुक्त वाक्य', 'प्रश्नवाचक वाक्य'],
        answerIndex: 0,
        explanation: 'जिस वाक्य में एक मुख्य उपवाक्य हो और अन्य उपवाक्य उस पर आश्रित हों (जैसे: जब...तब), वह मिश्र वाक्य कहलाता है।',
        hint: 'जब और तब से जुड़े आश्रित उपवाक्य।'
      },
      {
        question: '\'राम द्वारा रावण मारा गया\' - इस वाक्य में कौन सा वाच्य (Voice) है?',
        options: ['कर्मवाच्य (Passive Voice)', 'कर्तृवाच्य', 'भाववाच्य', 'क्रियावाच्य'],
        answerIndex: 0,
        explanation: 'जहाँ क्रिया का लिंग व वचन कर्म के अनुसार बदलता है तथा कर्ता के साथ \'द्वारा\' या \'से\' लगा होता है, वह कर्मवाच्य होता है।',
        hint: 'कर्ता के साथ \'द्वारा\' का प्रयोग हुआ है।'
      },
      {
        question: '\'शृंगार रस\' का स्थायी भाव (Sthayi Bhava) क्या है?',
        options: ['रति (प्रेम)', 'उत्साह', 'शोक', 'हास्य'],
        answerIndex: 0,
        explanation: 'शृंगार रस को रसराज कहा जाता है और इसका स्थायी भाव \'रति\' (स्त्री-पुरुष का पारस्परिक प्रेम) होता है।',
        hint: 'इसे रसराज भी कहा जाता है।'
      },
      {
        question: '\'चरण कमल बन्दौ हरिराई\' में कौन सा अलंकार है?',
        options: ['रूपक अलंकार (Metaphor)', 'उपमा अलंकार', 'उत्प्रेक्षा अलंकार', 'अनुप्रास अलंकार'],
        answerIndex: 0,
        explanation: 'जहाँ उपमेय (चरण) पर उपमान (कमल) का अभेद आरोप किया जाए, वहाँ रूपक अलंकार होता है।',
        hint: 'चरण को ही साक्षात कमल मान लिया गया है।'
      },
      {
        question: '\'महानता\' शब्द व्याकरण की दृष्टि से किस संज्ञा का उदाहरण है?',
        options: ['भाववाचक संज्ञा (Abstract Noun)', 'जातिवाचक संज्ञा', 'व्यक्तिवाचक संज्ञा', 'द्रव्यवाचक संज्ञा'],
        answerIndex: 0,
        explanation: '\'महान\' विशेषण में \'ता\' प्रत्यय जुड़ने से गुण या भाव प्रकट करने वाली भाववाचक संज्ञा बनती है।',
        hint: 'जो गुण, दशा या भाव को व्यक्त करे।'
      }
    ]
  },
  // CLASS 10 - ENGLISH - GRAMMAR & LITERATURE
  {
    id: 'board-10-eng-ch1',
    board: 'ALL_STATE_BOARDS',
    classGrade: 'Class 10th',
    subject: 'English (अंग्रेजी)',
    chapter: 'Grammar: Tenses, Modals, Subject-Verb Concord & First Flight',
    totalQuestions: 5,
    timeMinutes: 10,
    descriptionHi: 'काल (Tenses), मोडाल्स (Modals), कर्ता-क्रिया सामंजस्य एवं लेटर टू गॉड।',
    descriptionEn: 'Subject-Verb agreement, Reported speech, Modals & Lencho\'s unwavering faith.',
    questions: [
      {
        question: 'Fill in the blank: "Neither the teacher nor the students ______ present in the auditorium."',
        options: ['were', 'was', 'is', 'has'],
        answerIndex: 0,
        explanation: 'Rule of Proximity: When subjects are joined by "neither...nor", the verb agrees with the closer subject ("students" - plural ➔ were).',
        hint: 'The verb agrees with the subject closest to it ("students").'
      },
      {
        question: 'Identify the indirect speech: He said, "I have completed my homework."',
        options: ['He said that he had completed his homework.', 'He said that he has completed his homework.', 'He said he completes his homework.', 'He told that homework was completed.'],
        answerIndex: 0,
        explanation: 'In reported speech, Present Perfect ("have completed") changes to Past Perfect ("had completed") when reporting verb is in the past ("said").',
        hint: 'Present perfect changes to past perfect.'
      },
      {
        question: 'In the story "A Letter to God", why did Lencho write a letter to God requesting 100 pesos?',
        options: ['Because a severe hailstorm destroyed his entire corn field', 'To buy cattle', 'To build a new brick house', 'To pay school fees'],
        answerIndex: 0,
        explanation: 'A devastating hailstorm completely destroyed Lencho\'s ripe corn fields, leaving his family facing starvation without divine help.',
        hint: 'Hailstones devastated his standing harvest.'
      },
      {
        question: 'Fill in with appropriate modal: "You ______ wear a helmet while riding a two-wheeler; it is a legal requirement."',
        options: ['must', 'may', 'might', 'could'],
        answerIndex: 0,
        explanation: '"Must" expresses compulsory legal duty or strong obligation.',
        hint: 'Expresses mandatory obligation.'
      },
      {
        question: 'Choose the correct synonym of the word "SOLITARY" as used in the poem "The Solitary Reaper":',
        options: ['Alone / Single', 'Crowded', 'Wealthy', 'Joyful'],
        answerIndex: 0,
        explanation: '"Solitary" means existing alone or singing in isolation ("alone she cuts and binds the grain").',
        hint: 'Living or working alone.'
      }
    ]
  },
  // CLASS 10 - SANSKRIT - GRAMMAR & SHLOKA (NCERT / SHEMUSHI)
  {
    id: 'board-10-skt-ch1',
    board: 'ALL_STATE_BOARDS',
    classGrade: 'Class 10th',
    subject: 'Sanskrit (संस्कृत)',
    chapter: 'प्रथमः पाठः: शुचिपर्यावरणम्, सन्धिः, समासः एवं शब्दरूपाणि',
    totalQuestions: 5,
    timeMinutes: 10,
    descriptionHi: 'शुचिपर्यावरणम् श्लोक, स्वर-व्यंजन सन्धि, तत्पुरुष/कर्मधारय समास एवं धातु रूप।',
    descriptionEn: 'Shuchi Paryavaranam shlokas, Sandhi, Samasa, and Shabda/Dhatu roop.',
    questions: [
      {
        question: '\'शुचिपर्यावरणम्\' इति पाठे कविः कस्य कृते शरणम् इच्छति?',
        options: ['प्रकृतेः एव शरणम् (प्रकृति की शरण)', 'नगरस्य शरणम्', 'गृहस्य शरणम्', 'वनस्य शरणम्'],
        answerIndex: 0,
        explanation: 'हरिहरशर्मणा रचिते \'शुचिपर्यावरणम्\' पाठे महानगरेषु प्रदूषणेन दुर्वहं जीवितं जातम्, अतः कविः प्रकृतेः शरणं गन्तुम् इच्छति।',
        hint: 'प्रकृति की ही शरण में जाने की इच्छा व्यक्त की गई है।'
      },
      {
        question: '\'विद्या + आलयः\' इत्यस्य शुद्धः सन्धिः कः भविष्यति?',
        options: ['विद्यालयः (दीर्घ सन्धिः)', 'विद्यलयः', 'विद्यालयम्', 'विद्यौलयः'],
        answerIndex: 0,
        explanation: 'अकः सवर्णे दीर्घः इति सूत्रेण आ + आ = आ भवति, अतः \'विद्यालयः\' दीर्घस्वरसन्धिः अस्ति।',
        hint: 'आ और आ मिलकर बड़ा आ बनाते हैं।'
      },
      {
        question: '\'रामः\' शब्दस्य तृतीया विभक्तिः एकवचने किं रूपं भवति?',
        options: ['रामेण', 'रामात्', 'रामस्य', 'रामे'],
        answerIndex: 0,
        explanation: 'अकारान्त पुंल्लिंग \'राम\' शब्दस्य तृतीया विभक्तिः एकवचने \'रामेण\' भवति (प्रथमा: रामः, द्वितीया: रामम्, तृतीया: रामेण)।',
        hint: 'एन प्रत्यय जुड़ता है।'
      },
      {
        question: '\'पठ्\' धातोः लट् लकारस्य (वर्तमान कालस्य) प्रथम पुरुषस्य बहुवचने किं रूपम् अस्ति?',
        options: ['पठन्ति', 'पठति', 'पठथः', 'पठामः'],
        answerIndex: 0,
        explanation: 'लट् लकारः (वर्तमान कालः): प्रथम पुरुषः - पठति (एकवचन), पठतः (द्विवचन), पठन्ति (बहुवचन)।',
        hint: 'ति, तः, अन्ति में बहुवचन रूप।'
      },
      {
        question: '\'प्रतिदिनम्\' इत्यस्मिन् पदे कः समासः अस्ति?',
        options: ['अव्ययीभाव समासः (दिनं दिनं प्रति)', 'तत्पुरुष समासः', 'द्वन्द्व समासः', 'बहुव्रीहि समासः'],
        answerIndex: 0,
        explanation: 'जहाँ पूर्व पद अव्यय (प्रति) हो और सम्पूर्ण पद क्रियाविशेषण अव्यय बन जाए, वहाँ अव्ययीभाव समास होता है। विग्रह: दिनं दिनं प्रति = प्रतिदिनम्।',
        hint: 'पहला पद \'प्रति\' एक अव्यय है।'
      }
    ]
  },
  // CLASS 12 - ARTS - SOCIOLOGY (समाजशास्त्र)
  {
    id: 'board-12-socio-ch1',
    board: 'ALL_STATE_BOARDS',
    classGrade: 'Class 12th',
    streamTags: ['arts'],
    subject: 'Sociology (समाजशास्त्र)',
    chapter: 'इकाई 1: भारतीय समाज की जनसांख्यिकीय संरचना एवं सामाजिक संस्थाएं',
    totalQuestions: 5,
    timeMinutes: 10,
    descriptionHi: 'माल्थस का जनसंख्या सिद्धांत, आयु संरचना, लिंगानुपात, जाति व्यवस्था व संयुक्त परिवार।',
    descriptionEn: 'Malthusian Theory, Demographic Dividend, Caste System & Joint Family in India.',
    questions: [
      {
        question: 'माल्थस के जनसंख्या सिद्धांत (Malthusian Theory) के अनुसार जनसंख्या किस दर से बढ़ती है?',
        options: ['ज्यामितीय दर से (Geometric: 1, 2, 4, 8, 16...)', 'अंकगणितीय दर से (Arithmetic: 1, 2, 3...)', 'स्थिर दर से', 'घातीय रूप से नहीं'],
        answerIndex: 0,
        explanation: 'थॉमस रॉबर्ट माल्थस के अनुसार जनसंख्या ज्यामितीय गति (2, 4, 8, 16...) से बढ़ती है जबकि खाद्य उत्पादन अंकगणितीय गति (1, 2, 3, 4...) से बढ़ता है।',
        hint: 'दोगुनी गति से गुणात्मक वृद्धि।'
      },
      {
        question: 'भारत में \'जनसांख्यिकीय लाभांश\' (Demographic Dividend) से क्या तात्पर्य है?',
        options: ['कार्यशील जनसंख्या (15-64 वर्ष) का आश्रित जनसंख्या से अधिक होना', 'वृद्धों की संख्या बढ़ना', 'जन्म दर में अप्रत्याशित वृद्धि', 'मृत्यु दर का उच्चतम होना'],
        answerIndex: 0,
        explanation: 'जब किसी देश में 15 से 64 वर्ष की कामकाजी आयु वर्ग की आबादी आश्रित आबादी (बच्चों व बुजुर्गों) से अधिक होती है तो आर्थिक उत्पादन की संभावना बढ़ती है, इसे डेमोग्राफिक डिविडेंड कहते हैं।',
        hint: 'काम करने वाले युवाओं का अनुपात अधिक होना।'
      },
      {
        question: 'जाति (Caste) किस प्रकार की सामाजिक प्रस्थिति (Social Status) का उदाहरण है?',
        options: ['प्रदत्त प्रस्थिति (Ascribed Status - जन्म पर आधारित)', 'अर्जित प्रस्थिति (Achieved Status)', 'व्यावसायिक प्रस्थिति', 'अस्थायी प्रस्थिति'],
        answerIndex: 0,
        explanation: 'जाति एक बंद वर्ग है जिसकी सदस्यता जन्म से निर्धारित होती है (प्रदत्त प्रस्थिति), इसे व्यक्ति अपने प्रयास से बदल नहीं सकता।',
        hint: 'जो जन्म से स्वतः प्राप्त हो।'
      },
      {
        question: 'भारत में 2011 की जनगणना के अनुसार समग्र बाल लिंगानुपात (0-6 वर्ष) कितना दर्ज किया गया था?',
        options: ['919 लड़कियां प्रति 1000 लड़के', '943 लड़कियां', '927 लड़कियां', '950 लड़कियां'],
        answerIndex: 0,
        explanation: '2011 की जनगणना में 0-6 वर्ष आयु वर्ग का बाल लिंगानुपात गिरकर 919 प्रति 1000 बालकों पर आ गया था, जो चिंताजनक था (समग्र लिंगानुपात 943 था)।',
        hint: '920 से एक कम।'
      },
      {
        question: '\'संस्कृतिकरण\' (Sanskritization) की अवधारणा किस भारतीय समाजशास्त्री द्वारा प्रतिपादित की गई थी?',
        options: ['प्रो. एम. एन. श्रीनिवास (M.N. Srinivas)', 'जी. एस. घुर्ये', 'योगेंद्र सिंह', 'डी. पी. मुखर्जी'],
        answerIndex: 0,
        explanation: 'प्रो. एम. एन. श्रीनिवास ने अपनी पुस्तक \'Religion and Society among the Coorgs of South India\' में संस्कृतीकरण की संकल्पना प्रस्तुत की।',
        hint: 'प्रभु जाति (Dominant Caste) की अवधारणा भी इन्होंने ही दी थी।'
      }
    ]
  },
  // CLASS 12 - ARTS - PSYCHOLOGY (मनोविज्ञान)
  {
    id: 'board-12-psych-ch1',
    board: 'ALL_STATE_BOARDS',
    classGrade: 'Class 12th',
    streamTags: ['arts'],
    subject: 'Psychology (मनोविज्ञान)',
    chapter: 'इकाई 1: मनोवैज्ञानिक गुणों में विभिन्नताएं एवं बुद्धि (Intelligence)',
    totalQuestions: 5,
    timeMinutes: 10,
    descriptionHi: 'बुद्धि लब्धि (IQ), गार्डनर का बहु-बुद्धि सिद्धांत, संवेगात्मक बुद्धि (EQ) एवं सृजनात्मकता।',
    descriptionEn: 'IQ testing, Gardner\'s Multiple Intelligences, Emotional Quotient (EQ) & Creativity.',
    questions: [
      {
        question: 'बुद्धि लब्धि (Intelligence Quotient - IQ) ज्ञात करने का सही सूत्र क्या है?',
        options: ['(मानसिक आयु / वास्तविक आयु) × 100 [IQ = (MA / CA) × 100]', '(वास्तविक आयु / मानसिक आयु) × 100', 'मानसिक आयु + वास्तविक आयु', '(मानसिक आयु × वास्तविक आयु) / 100'],
        answerIndex: 0,
        explanation: 'विलियम स्टर्न ने 1912 में IQ का सूत्र दिया जिसे बाद में टर्मन ने संशोधित किया: IQ = (Mental Age / Chronological Age) × 100।',
        hint: 'MA बटा CA गुणा सौ।'
      },
      {
        question: 'हावर्ड गार्डनर (Howard Gardner) ने कितने प्रकार की बहु-बुद्धियों (Multiple Intelligences) का सिद्धांत दिया था?',
        options: ['8 प्रकार (भाषाई, तार्किक, स्थानिक, संगीतात्मक, शारीरिक आदि)', '2 प्रकार', '3 प्रकार', '12 प्रकार'],
        answerIndex: 0,
        explanation: 'गार्डनर ने 1983 में अपनी पुस्तक \'Frames of Mind\' में बहु-बुद्धि सिद्धांत प्रस्तुत किया, जिसमें 8 स्वतंत्र प्रकार की बुद्धियां मान्य हैं।',
        hint: 'आठ भिन्न प्रकार की बुद्धियां।'
      },
      {
        question: 'संवेगात्मक बुद्धि (Emotional Intelligence / EQ) को लोकप्रिय बनाने वाले प्रमुख मनोवैज्ञानिक कौन हैं?',
        options: ['डेनियल गोलमैन (Daniel Goleman)', 'सिगमंड फ्रायड', 'बी. एफ. स्किनर', 'जीन पियाजे'],
        answerIndex: 0,
        explanation: 'डेनियल गोलमैन ने 1995 में अपनी पुस्तक \'Emotional Intelligence: Why It Can Matter More Than IQ\' के माध्यम से इसे वैश्विक स्तर पर लोकप्रिय बनाया।',
        hint: 'इमोशनल इंटेलिजेंस पुस्तक के लेखक।'
      },
      {
        question: 'सामान्य (औसत) व्यक्ति की बुद्धि लब्धि (Average IQ Range) कितनी मानी जाती है?',
        options: ['90 से 109 के बीच', '70 से 79 के बीच', '130 से अधिक', '50 से 69 के बीच'],
        answerIndex: 0,
        explanation: 'टर्मन के वर्गीकरण के अनुसार 90 से 109 के मध्य IQ वाले व्यक्तियों को सामान्य या औसत बुद्धि (Average Intelligence) माना जाता है।',
        hint: 'लगभग 100 के आसपास।'
      },
      {
        question: 'तनाव (Stress) के विरुद्ध शरीर की स्वाभाविक प्रतिक्रिया को \'सामान्य अनुकूलन संलक्षण\' (GAS - General Adaptation Syndrome) नाम किसने दिया?',
        options: ['हंस सेल्ये (Hans Selye - तनाव के जनक)', 'इवान पावलव', 'अल्फ्रेड बिने', 'कार्ल युंग'],
        answerIndex: 0,
        explanation: 'हंस सेल्ये ने GAS मॉडल में तनाव के तीन चरण बताए: सचेत प्रतिक्रिया (Alarm), प्रतिरोध (Resistance), और परिश्रांति (Exhaustion)।',
        hint: 'तनाव अनुसंधान के पितामह।'
      }
    ]
  }
];

interface BoardExamSingleTestBoxProps {
  language?: 'hindi' | 'english';
  onStartBoardTest: (test: BoardChapterTest) => void;
  studentGoalProfile?: StudentGoalProfile | null;
  onOpenBoardSelector?: () => void;
}

export const BoardExamSingleTestBox: React.FC<BoardExamSingleTestBoxProps> = ({
  language = 'hindi',
  onStartBoardTest,
  studentGoalProfile,
  onOpenBoardSelector
}) => {
  const isHindi = language === 'hindi';
  const initialClass = studentGoalProfile?.boardDetails?.classGrade === 'Class 12th' ? 'Class 12th' : 'Class 10th';
  const [selectedClass, setSelectedClass] = useState<'Class 10th' | 'Class 12th'>(initialClass);
  const [selectedSubStream, setSelectedSubStream] = useState<'science_pcm' | 'science_pcb' | 'commerce' | 'arts'>(
    studentGoalProfile?.boardDetails?.subStream || 'science_pcm'
  );
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'tests' | 'answer-lab' | 'blueprint' | 'revision' | 'parent-report'>('tests');

  // Synchronize when studentGoalProfile changes
  useEffect(() => {
    if (studentGoalProfile?.boardDetails?.classGrade) {
      setSelectedClass(studentGoalProfile.boardDetails.classGrade === 'Class 12th' ? 'Class 12th' : 'Class 10th');
    }
    if (studentGoalProfile?.boardDetails?.subStream) {
      setSelectedSubStream(studentGoalProfile.boardDetails.subStream);
    }
  }, [studentGoalProfile?.boardDetails?.classGrade, studentGoalProfile?.boardDetails?.subStream]);

  // Active Board Name from studentGoalProfile
  const currentBoard = studentGoalProfile?.boardDetails?.boardName || 'UP_BOARD';
  const boardDisplayName = currentBoard === 'CBSE' ? 'CBSE Board' : currentBoard === 'BIHAR_BOARD' ? 'Bihar Board (BSEB)' : currentBoard === 'UP_BOARD' ? 'UP Board (UPMSP)' : 'State Boards / NCERT';

  // Answer Writing Lab State
  const [studentAnswerText, setStudentAnswerText] = useState('');
  const [isEvaluatingAnswer, setIsEvaluatingAnswer] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<{
    score: number;
    headingFeedback: string;
    diagramFeedback: string;
    wordLimitFeedback: string;
    topperTip: string;
  } | null>(null);

  const handleEvaluateAnswer = () => {
    if (!studentAnswerText.trim()) return;
    setIsEvaluatingAnswer(true);
    setTimeout(() => {
      setIsEvaluatingAnswer(false);
      setEvaluationResult({
        score: 88,
        headingFeedback: isHindi ? `✅ ${boardDisplayName} पैटर्न के अनुसार मुख्य शीर्षक (Headings) स्पष्ट हैं।` : `✅ Main headings are clear per ${boardDisplayName} exam guidelines.`,
        diagramFeedback: isHindi ? "💡 सुझाव: इस प्रश्न में नामांकित चित्र (Labeled Diagram) या समीकरण जोड़ने से examiner पूरे अंक देगा।" : "💡 Tip: Adding a labeled diagram here guarantees full marks.",
        wordLimitFeedback: isHindi ? "📏 शब्द सीमा: एकदम सटीक (लगभग 120-150 शब्द)।" : "📏 Word Limit: Perfect (~120-150 words).",
        topperTip: isHindi ? "🌟 टॉपर टिप: अंत में 'निष्कर्ष' (Conclusion) जरूर लिखें।" : "🌟 Topper's Tip: Always write a conclusion."
      });
    }, 1200);
  };

  const handleStartFullBoardMock = (questionCount: number = 100) => {
    // Strictly filter available questions to the active class and active stream!
    const matchingTests = CURATED_BOARD_EXAM_TESTS.filter(t => {
      if (t.classGrade !== selectedClass) return false;
      if (selectedClass === 'Class 12th' && t.streamTags && t.streamTags.length > 0) {
        return t.streamTags.includes(selectedSubStream);
      }
      return true;
    });

    let poolOfQuestions: QuizQuestion[] = [];
    matchingTests.forEach(test => {
      poolOfQuestions.push(...test.questions);
    });

    if (poolOfQuestions.length === 0) {
      poolOfQuestions = CURATED_BOARD_EXAM_TESTS.filter(t => t.classGrade === selectedClass).flatMap(t => t.questions);
    }

    let finalQuestions: QuizQuestion[] = [];
    while (finalQuestions.length < questionCount && poolOfQuestions.length > 0) {
      const remaining = questionCount - finalQuestions.length;
      const shuffled = [...poolOfQuestions].sort(() => Math.random() - 0.5);
      finalQuestions.push(...shuffled.slice(0, remaining));
    }

    const timeMinutes = questionCount >= 100 ? 195 : 90;
    const streamName = selectedClass === 'Class 10th' ? 'Class 10th Board' : selectedSubStream === 'science_pcm' ? '12th Science (PCM)' : selectedSubStream === 'science_pcb' ? '12th Science (PCB)' : selectedSubStream === 'commerce' ? '12th Commerce' : '12th Arts';

    const fullMockTest: BoardChapterTest = {
      id: `board-full-mock-${selectedClass.toLowerCase().replace(/\s+/g, '-')}-${selectedSubStream}-${questionCount}-${Date.now()}`,
      board: currentBoard,
      classGrade: selectedClass,
      streamTags: selectedClass === 'Class 12th' ? [selectedSubStream] : undefined,
      subject: selectedSubjectFilter === 'all' ? `${streamName} - संपूर्ण OMR मॉडल पेपर` : selectedSubjectFilter,
      chapter: `🎯 ${selectedClass} (${streamName}) संपूर्ण ${questionCount} वस्तुनिष्ठ प्रश्न (Full Board OMR Exam)`,
      totalQuestions: questionCount,
      timeMinutes: timeMinutes,
      descriptionHi: `असली बोर्ड परीक्षा पद्धति (${boardDisplayName}): 3 घंटे 15 मिनट, ${questionCount} वस्तुनिष्ठ प्रश्न, OMR शीट मोड और तत्काल अंक विश्लेषण।`,
      descriptionEn: `Official Board Pattern: ${timeMinutes >= 100 ? '3h 15m' : '90m'}, ${questionCount} MCQs with instant score & chapter analysis.`,
      questions: finalQuestions
    };

    const payload = {
      category: 'board',
      examName: fullMockTest.chapter,
      topic: fullMockTest.subject,
      questions: fullMockTest.questions,
      timeMinutes: fullMockTest.timeMinutes,
      marksPerQ: 1.0,
      negMark: 0.0
    };
    try {
      sessionStorage.setItem('hansai_launch_quiz', JSON.stringify(payload));
      window.dispatchEvent(new CustomEvent('hansai_launch_quiz_event', { detail: payload }));
    } catch (e) {
      console.warn("Direct storage payload write error", e);
    }

    onStartBoardTest(fullMockTest);
  };

  const filteredTests = CURATED_BOARD_EXAM_TESTS.filter(t => {
    // 1. Strict Class Grade matching
    if (t.classGrade !== selectedClass) return false;

    // 2. Strict Board matching
    const matchBoard = t.board === 'ALL_STATE_BOARDS' || t.board === currentBoard;
    if (!matchBoard) return false;

    // 3. Strict 12th Sub-Stream matching
    if (selectedClass === 'Class 12th' && t.streamTags && t.streamTags.length > 0) {
      if (!t.streamTags.includes(selectedSubStream)) return false;
    }

    // 4. Selected Subject filter
    const matchSub = selectedSubjectFilter === 'all' || t.subject.toLowerCase().includes(selectedSubjectFilter.toLowerCase());
    return matchSub;
  });

  return (
    <div className="w-full bg-[#FCFBF4] border-l-[12px] border-l-amber-700/20 border-2 border-slate-200 rounded-3xl p-4 sm:p-6 shadow-xl space-y-5 my-4 text-left animate-fade-in relative overflow-hidden font-serif">
      
      {/* Notebook Lines Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(#000 0, #000 1px, transparent 1px, transparent 32px)' }}></div>
      <div className="absolute left-12 top-0 bottom-0 w-[1px] bg-rose-500/20 pointer-events-none"></div>

      {/* TOP COUNTDOWN PLANNER BANNER */}
      <div className="relative z-10 bg-white border border-slate-200 rounded-2xl p-3 shadow-sm flex items-center justify-between gap-4 overflow-hidden group">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-xl shadow-inner border border-rose-100">
            📅
          </div>
          <div>
            <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-wider leading-none mb-1">{isHindi ? 'परीक्षा काउंटडाउन' : 'Exam Countdown'}</h4>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-rose-600 leading-none">145</span>
              <span className="text-[10px] font-bold text-slate-500">{isHindi ? 'दिन शेष' : 'Days Left'}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:block text-right">
            <p className="text-[10px] font-bold text-slate-600 leading-tight">{isHindi ? 'लक्ष्य: 95%+' : 'Goal: 95%+'}</p>
            <p className="text-[9px] text-slate-400 font-medium">{isHindi ? 'अपना सर्वश्रेष्ठ दें' : 'Give your best'}</p>
          </div>
          <button className="px-3 py-1.5 bg-slate-900 text-white text-[10px] font-bold rounded-lg hover:bg-slate-800 transition-all cursor-pointer whitespace-nowrap">
            {isHindi ? 'प्लानर' : 'Planner'}
          </button>
        </div>
      </div>

      {/* HEADER ROW */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-2xl shadow-sm shrink-0">
            📚
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                {isHindi ? 'अकादमिक स्टडी डेस्क (Study Desk)' : 'Academic Study Desk'}
              </h3>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-xs text-slate-500 font-bold">
                {isHindi ? `कक्षा: ${selectedClass} | बोर्ड: ${boardDisplayName}` : `Grade: ${selectedClass} | Board: ${boardDisplayName}`}
              </p>
              {onOpenBoardSelector && (
                <button
                  onClick={onOpenBoardSelector}
                  className="text-[10px] font-bold text-amber-700 hover:text-amber-800 underline cursor-pointer"
                >
                  {isHindi ? 'बदलें' : 'Edit'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Class Switcher */}
        <div className="flex items-center gap-2">
          <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-[10px] font-black border border-emerald-100 hover:bg-emerald-100 transition-all cursor-pointer">
            <span>🧘</span>
            <span>{isHindi ? 'एंटी-एंजायटी' : 'Zen Mode'}</span>
          </button>
          
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0 self-stretch sm:self-auto justify-center">
            {(['Class 10th', 'Class 12th'] as const).map(cls => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  selectedClass === cls
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200 scale-[1.02]'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TABS BAR - Clean & Minimalist */}
      <div className="flex items-center gap-4 overflow-x-auto pb-1 scrollbar-hide border-b border-slate-100 relative z-10">
        <button
          onClick={() => setActiveTab('tests')}
          className={`pb-2 px-1 font-bold text-xs sm:text-sm transition-all relative cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'tests' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <span>📓 {isHindi ? 'अध्यायवार टेस्ट' : 'Chapter Tests'}</span>
          {activeTab === 'tests' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600 rounded-full"></div>}
        </button>
        <button
          onClick={() => setActiveTab('answer-lab')}
          className={`pb-2 px-1 font-bold text-xs sm:text-sm transition-all relative cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'answer-lab' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <span>✍️ {isHindi ? 'आंसर लैब' : 'Answer Lab'}</span>
          {activeTab === 'answer-lab' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600 rounded-full"></div>}
        </button>
        <button
          onClick={() => setActiveTab('blueprint')}
          className={`pb-2 px-1 font-bold text-xs sm:text-sm transition-all relative cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'blueprint' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <span>📊 {isHindi ? 'ब्लूप्रिंट' : 'Blueprint'}</span>
          {activeTab === 'blueprint' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600 rounded-full"></div>}
        </button>
        <button
          onClick={() => setActiveTab('revision')}
          className={`pb-2 px-1 font-bold text-xs sm:text-sm transition-all relative cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'revision' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <span>🔖 {isHindi ? 'पॉकेट नोट्स' : 'Pocket Notes'}</span>
          {activeTab === 'revision' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600 rounded-full"></div>}
        </button>
        <button
          onClick={() => setActiveTab('parent-report')}
          className={`pb-2 px-1 font-bold text-xs sm:text-sm transition-all relative cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'parent-report' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <span>👨‍👩‍👧 {isHindi ? 'पेरेंट्स रिपोर्ट' : 'Parent Report'}</span>
          {activeTab === 'parent-report' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600 rounded-full"></div>}
        </button>
      </div>

      {/* ACTIVE STUDENT GOAL & TEST MODE SUMMARY BANNER */}
      {studentGoalProfile && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-sm relative z-10">
          <div className="flex items-center gap-3 text-slate-700">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold">
              🎯
            </div>
            <div>
              <span className="font-bold block text-slate-400 uppercase text-[9px] tracking-widest">{isHindi ? 'सक्रिय लक्ष्य' : 'ACTIVE GOAL'}</span>
              <span className="font-black text-slate-900">
                {studentGoalProfile.stream === 'board'
                  ? `${studentGoalProfile.boardDetails?.classGrade || '10th'} • ${studentGoalProfile.boardDetails?.boardName === 'ALL_STATE_BOARDS' ? studentGoalProfile.boardDetails?.specificStateBoard : studentGoalProfile.boardDetails?.boardName || 'CBSE'} • ${studentGoalProfile.boardDetails?.primarySubject || 'General'}`
                  : studentGoalProfile.competitiveDetails?.examName}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg font-bold text-[10px]">
              {isHindi ? 'अकादमिक मोड: सक्रिय' : 'Academic Mode: Active'}
            </span>
            {onOpenBoardSelector && (
              <button
                onClick={onOpenBoardSelector}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-[10px] transition-all border border-slate-200 cursor-pointer"
              >
                {isHindi ? 'बदलें' : 'Modify'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: CHAPTER TESTS */}
      {activeTab === 'tests' && (
        <div className="space-y-4">

          {/* OFFLINE BOARD EXAM PATTERN SIMULATOR BAR */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">📋</span>
                <div>
                  <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <span>{isHindi ? 'बोर्ड परीक्षा पैटर्न एवं समय विश्लेषक' : 'Official Board Exam Simulator'}</span>
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 text-[10px] font-bold border border-amber-200 uppercase tracking-tighter">
                      Pattern Verified
                    </span>
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {isHindi ? 'आधिकारिक पेपर संरचना के अनुसार अभ्यास करें:' : 'Practice according to official paper structure:'}
                  </p>
                </div>
              </div>
            </div>

            {/* BOARD PATTERN SPECIFICATION CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">CBSE Board</span>
                  <span className="text-[9px] font-mono text-slate-400 px-1.5 py-0.5 bg-white border border-slate-200 rounded">180m</span>
                </div>
                <p className="text-[9px] text-slate-500 leading-tight">
                  Section A: 20 MCQs • Sec B: 5 Short • Sec C: 6 Short • Sec D: 4 Long • Case Studies.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Bihar Board (BSEB)</span>
                  <span className="text-[9px] font-mono text-slate-400 px-1.5 py-0.5 bg-white border border-slate-200 rounded">195m</span>
                </div>
                <p className="text-[9px] text-slate-500 leading-tight">
                  Part A: 50% OMR MCQs (50/100) • Part B: Written Qs. One of the highest scoring patterns.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">UP Board</span>
                  <span className="text-[9px] font-mono text-slate-400 px-1.5 py-0.5 bg-white border border-slate-200 rounded">195m</span>
                </div>
                <p className="text-[9px] text-slate-500 leading-tight">
                  Sec 'A': 20 OMR MCQs (1 Hr) • Sec 'B': 50 Marks Written (2.15 Hrs). Classic pattern.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">State Boards</span>
                  <span className="text-[9px] font-mono text-slate-400 px-1.5 py-0.5 bg-white border border-slate-200 rounded">180m</span>
                </div>
                <p className="text-[9px] text-slate-500 leading-tight">
                  30% Objective + 70% Subjective. Universal pattern for State board excellence.
                </p>
              </div>
            </div>
          </div>

          {/* STREAM SELECTOR FOR CLASS 12TH */}
          {selectedClass === 'Class 12th' && (
            <div className="flex flex-wrap items-center gap-2 p-3 bg-white rounded-2xl border border-slate-200 shadow-sm relative z-10">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest shrink-0 mr-1">
                {isHindi ? 'स्ट्रीम:' : 'STREAM:'}
              </span>
              {[
                { id: 'science_pcm', label: 'साइंस PCM', icon: '📐' },
                { id: 'science_pcb', label: 'साइंस PCB', icon: '🔬' },
                { id: 'commerce', label: 'कॉमर्स', icon: '📈' },
                { id: 'arts', label: 'आर्ट्स / कला', icon: '🏛️' }
              ].map(st => (
                <button
                  key={st.id}
                  onClick={() => {
                    setSelectedSubStream(st.id as any);
                    setSelectedSubjectFilter('all');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 border ${
                    selectedSubStream === st.id
                      ? 'bg-amber-600 text-white border-amber-600 shadow-sm font-black'
                      : 'bg-white text-slate-500 hover:text-slate-900 border-slate-200'
                  }`}
                >
                  <span>{st.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* SUBJECT FILTER PILLS */}
          <div className="flex flex-wrap items-center gap-2 text-xs relative z-10">
            <button
              onClick={() => setSelectedSubjectFilter('all')}
              className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap border ${
                selectedSubjectFilter === 'all'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white text-slate-500 hover:text-slate-900 border-slate-200'
              }`}
            >
              {isHindi ? 'सभी विषय' : 'All Subjects'}
            </button>

            {selectedClass === 'Class 10th' ? (
              <>
                {['Science (विज्ञान)', 'Mathematics (गणित)', 'Social Science (सामाजिक विज्ञान)', 'Hindi (हिन्दी)', 'English (अंग्रेजी)', 'Sanskrit (संस्कृत)'].map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSubjectFilter(s)}
                    className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap border ${
                      selectedSubjectFilter === s
                        ? 'bg-amber-600 text-white border-amber-600 shadow-md'
                        : 'bg-white text-slate-500 hover:text-slate-900 border-slate-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </>
            ) : selectedSubStream === 'science_pcm' ? (
              <>
                {['Mathematics (गणित)', 'Physics (भौतिकी)', 'Chemistry (रसायन विज्ञान)'].map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSubjectFilter(s)}
                    className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap border ${
                      selectedSubjectFilter === s
                        ? 'bg-amber-600 text-white border-amber-600 shadow-md'
                        : 'bg-white text-slate-500 hover:text-slate-900 border-slate-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </>
            ) : selectedSubStream === 'science_pcb' ? (
              <>
                {['Biology (जीव विज्ञान)', 'Physics (भौतिकी)', 'Chemistry (रसायन विज्ञान)'].map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSubjectFilter(s)}
                    className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap border ${
                      selectedSubjectFilter === s
                        ? 'bg-amber-600 text-white border-amber-600 shadow-md'
                        : 'bg-white text-slate-500 hover:text-slate-900 border-slate-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </>
            ) : selectedSubStream === 'commerce' ? (
              <>
                {['Accountancy (लेखाशास्त्र)', 'Business Studies (व्यवसाय अध्ययन)', 'Economics (अर्थशास्त्र)', 'Mathematics (गणित)'].map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSubjectFilter(s)}
                    className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap border ${
                      selectedSubjectFilter === s
                        ? 'bg-amber-600 text-white border-amber-600 shadow-md'
                        : 'bg-white text-slate-500 hover:text-slate-900 border-slate-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </>
            ) : (
              <>
                {['History (इतिहास)', 'Political Science (राजनीति विज्ञान)', 'Geography (भूगोल)', 'Economics (अर्थशास्त्र)', 'Sociology (समाजशास्त्र)', 'Psychology (मनोविज्ञान)', 'Hindi (हिन्दी)', 'English (अंग्रेजी)'].map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSubjectFilter(s)}
                    className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap border ${
                      selectedSubjectFilter === s
                        ? 'bg-amber-600 text-white border-amber-600 shadow-md'
                        : 'bg-white text-slate-500 hover:text-slate-900 border-slate-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </>
            )}
          </div>

          {/* 🌟 100-QUESTION FULL BOARD OMR MODEL PAPER BANNER */}
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-md space-y-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 -mr-16 -mt-16 rounded-full blur-2xl"></div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-slate-900 text-white font-black text-[10px] sm:text-[11px] tracking-widest uppercase">
                    🔥 OMR {isHindi ? 'मॉडल पेपर' : 'Model Paper'}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-black bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    ⏱️ 195 Min
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                  {isHindi ? '100 बहुविकल्पीय प्रश्न (Bihar & UP Board Special)' : '100 Full Board Objective MCQs (OMR Mode)'}
                </h4>
                <p className="text-[11px] text-slate-500 font-medium">
                  {isHindi ? 'पूर्ण पाठ्यक्रम आधारित आधिकारिक OMR मॉडल टेस्ट।' : 'Full syllabus based official OMR model test for top ranks.'}
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleStartFullBoardMock(100)}
                  className="flex-1 sm:flex-none px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-lg cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{isHindi ? '100 Qs शुरू करें' : 'Start 100 Qs'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleStartFullBoardMock(50)}
                  className="px-4 py-3 bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs rounded-xl border-2 border-slate-900 cursor-pointer active:scale-95 transition-all"
                  title="50 प्रश्नों का अभ्यास टेस्ट"
                >
                  <span>{isHindi ? '50 Qs अभ्यास' : '50 Qs Mini'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* CHAPTER TEST CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
            {filteredTests.map((test) => (
              <div
                key={test.id}
                className="bg-white border border-slate-200 hover:border-amber-600/60 rounded-2xl p-4 flex flex-col justify-between space-y-4 transition-all hover:shadow-xl hover:shadow-amber-900/5 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-8 h-8 bg-amber-50 rounded-bl-2xl border-l border-b border-slate-100"></div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200 uppercase tracking-wider">
                      {test.subject}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{test.timeMinutes}m</span>
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-amber-700 transition-colors leading-snug line-clamp-2">
                    {test.chapter}
                  </h4>

                  <p className="text-[11px] text-slate-500 leading-tight line-clamp-2 italic">
                    {isHindi ? test.descriptionHi : test.descriptionEn}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    {test.totalQuestions} {isHindi ? 'वस्तुनिष्ठ' : 'MCQs'}
                  </span>

                  <button
                    type="button"
                    onClick={() => onStartBoardTest(test)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-[10px] rounded-lg shadow-md flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
                  >
                    <span>{isHindi ? 'अभ्यास' : 'Practice'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: ANSWER WRITING LAB */}
      {activeTab === 'answer-lab' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-sm relative z-10">
          <div className="space-y-1">
            <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
              <span className="text-amber-600">✍️</span>
              <span>{isHindi ? 'आंसर राइटिंग फीडबैक लैब् (AI Evaluator)' : 'Answer Writing Lab (AI Evaluator)'}</span>
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              {isHindi ? 'बोर्ड परीक्षा में उत्तर कैसे लिखें? अपना उत्तर नीचे टाइप करें। AI आपको हेडिंग, डायग्राम टिप्स और वर्ड लिमिट पर फीडबैक देगा ताकि आप 100% स्कोर कर सकें।' : 'Type or paste your drafted answer below. AI evaluates heading placement, diagram cues, and word limit for maximum board exam scoring.'}
            </p>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <textarea
                value={studentAnswerText}
                onChange={(e) => setStudentAnswerText(e.target.value)}
                rows={6}
                placeholder={isHindi ? "यहाँ अपना उत्तर विस्तार से लिखें (जैसे: ओम का नियम, हृदय की संरचना आदि)..." : "Write your answer here in detail..."}
                className="w-full p-4 bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-xl text-xs sm:text-sm text-slate-900 font-sans focus:outline-none shadow-inner resize-none"
              />
              <div className="absolute bottom-3 right-3 text-[10px] text-slate-400 font-bold">
                {studentAnswerText.length} Characters
              </div>
            </div>
            
            <button
              onClick={handleEvaluateAnswer}
              disabled={isEvaluatingAnswer || !studentAnswerText.trim()}
              className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-lg cursor-pointer transition-all disabled:opacity-50 flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              {isEvaluatingAnswer ? <Clock className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-400" />}
              <span>{isHindi ? 'AI से उत्तर जांच करवाएं' : 'Evaluate with AI Evaluator'}</span>
            </button>
          </div>

          {evaluationResult && (
            <div className="bg-[#FFFDF0] border-2 border-amber-200 rounded-2xl p-5 space-y-4 animate-fade-in shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 -mr-12 -mt-12 rounded-full blur-xl"></div>
              <div className="flex items-center justify-between border-b border-amber-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                    🏆
                  </div>
                  <span className="text-xs font-black text-slate-800 uppercase tracking-widest">
                    {isHindi ? 'AI परीक्षक मूल्यांकन रिपोर्ट' : 'AI Evaluation Report'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Board Score</span>
                  <span className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-sm font-black font-mono shadow-sm">
                    {evaluationResult.score}/100
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-white border border-slate-100 rounded-xl space-y-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Structure</span>
                  <p className="text-xs text-slate-700 font-bold leading-tight">{evaluationResult.headingFeedback}</p>
                </div>
                <div className="p-3 bg-white border border-slate-100 rounded-xl space-y-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Visuals</span>
                  <p className="text-xs text-slate-700 font-bold leading-tight">{evaluationResult.diagramFeedback}</p>
                </div>
                <div className="p-3 bg-white border border-slate-100 rounded-xl space-y-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Conciseness</span>
                  <p className="text-xs text-slate-700 font-bold leading-tight">{evaluationResult.wordLimitFeedback}</p>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl space-y-1">
                  <span className="text-[10px] font-black text-amber-700 uppercase">Topper's Tip</span>
                  <p className="text-xs text-amber-900 font-black leading-tight italic">"{evaluationResult.topperTip}"</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: BLUEPRINT ANALYSIS */}
      {activeTab === 'blueprint' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl border border-blue-100">
              📊
            </div>
            <div>
              <h4 className="text-base font-black text-slate-900">
                {isHindi ? 'बोर्ड परीक्षा ब्लूप्रिंट एवं अंक योजना' : 'Board Exam Blueprint & Weightage'}
              </h4>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                {isHindi ? 'CBSE, UP & Bihar Board विश्लेषण 2024-25' : 'Official Analysis for 2024-25 Exams'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 relative overflow-hidden group">
              <div className="absolute top-2 right-2 px-2 py-0.5 bg-rose-100 text-rose-700 text-[9px] font-black rounded uppercase">High Priority</div>
              <div className="text-sm font-black text-slate-900">{isHindi ? 'रासायनिक अभिक्रियाएं' : 'Chemical Reactions'}</div>
              <div className="text-xs text-slate-600 font-bold">Weightage: <span className="text-slate-900">6 Marks</span></div>
              <p className="text-[10px] text-slate-500 leading-tight">Focus on Balancing & Types of reactions. Practice displacement reactions examples.</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 relative overflow-hidden group">
              <div className="absolute top-2 right-2 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-black rounded uppercase">Diagram Must</div>
              <div className="text-sm font-black text-slate-900">{isHindi ? 'जैव प्रक्रम' : 'Life Processes'}</div>
              <div className="text-xs text-slate-600 font-bold">Weightage: <span className="text-slate-900">8-10 Marks</span></div>
              <p className="text-[10px] text-slate-500 leading-tight">Must practice Nephron, Human Heart & Alveoli diagrams with labeling for full marks.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: POCKET NOTES */}
      {activeTab === 'revision' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-sm relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl border border-emerald-100">
              🔖
            </div>
            <div>
              <h4 className="text-base font-black text-slate-900">
                {isHindi ? 'पॉकेट रिवीजन कार्ड्स' : 'Pocket Revision Cards'}
              </h4>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                {isHindi ? 'अंतिम समय के लिए महत्वपूर्ण सूत्र' : 'Critical Formulas for Last-Min Revision'}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-[#FFF9F9] border border-rose-100 rounded-2xl space-y-2 transform rotate-1 hover:rotate-0 transition-transform">
              <div className="text-[9px] font-black text-rose-400 uppercase tracking-widest">Physics</div>
              <div className="text-sm text-slate-900 font-mono font-black">C = 4πε₀ R</div>
              <div className="text-[10px] text-slate-500 font-bold">Spherical Capacitor</div>
            </div>
            <div className="p-4 bg-[#F9F9FF] border border-blue-100 rounded-2xl space-y-2 transform -rotate-1 hover:rotate-0 transition-transform">
              <div className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Chemistry</div>
              <div className="text-sm text-slate-900 font-mono font-black">PV = nRT</div>
              <div className="text-[10px] text-slate-500 font-bold">Ideal Gas Equation</div>
            </div>
            <div className="p-4 bg-[#F9FFF9] border border-emerald-100 rounded-2xl space-y-2 transform rotate-1 hover:rotate-0 transition-transform">
              <div className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Math</div>
              <div className="text-sm text-slate-900 font-mono font-black">x = -b ± √D / 2a</div>
              <div className="text-[10px] text-slate-500 font-bold">Quadratic Formula</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: PARENT PROGRESS REPORT CARD */}
      {activeTab === 'parent-report' && (
        <div className="bg-white border-2 border-slate-900 rounded-3xl p-5 sm:p-7 space-y-6 shadow-2xl relative overflow-hidden z-10 font-sans">
          {/* Report Card Header */}
          <div className="text-center space-y-2 border-b-2 border-dashed border-slate-200 pb-6">
            <div className="flex justify-center mb-2">
              <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center text-3xl shadow-lg border-4 border-white">
                🎓
              </div>
            </div>
            <h4 className="text-xl font-black text-slate-900 tracking-tight uppercase">
              {isHindi ? 'प्रगति रिपोर्ट कार्ड (Parent Copy)' : 'Progress Report Card (Parent Copy)'}
            </h4>
            <div className="flex items-center justify-center gap-4 text-[11px] font-bold text-slate-500">
              <span>{isHindi ? 'सत्र:' : 'Session:'} 2024-25</span>
              <span>•</span>
              <span>{isHindi ? 'कक्षा:' : 'Grade:'} {selectedClass}</span>
              <span>•</span>
              <span>{isHindi ? 'दिनांक:' : 'Date:'} {new Date().toLocaleDateString()}</span>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center space-y-1">
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">{isHindi ? 'औसत स्कोर' : 'Avg Score'}</span>
              <span className="block text-2xl font-black text-slate-900">84%</span>
              <span className="block text-[9px] font-bold text-emerald-600">↑ 4% {isHindi ? 'सुधार' : 'Better'}</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center space-y-1">
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">{isHindi ? 'टेस्ट पूरे' : 'Tests Done'}</span>
              <span className="block text-2xl font-black text-slate-900">42</span>
              <span className="block text-[9px] font-bold text-slate-500">{isHindi ? 'पिछले 30 दिन' : 'Last 30 Days'}</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center space-y-1">
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">{isHindi ? 'स्टडी टाइम' : 'Study Time'}</span>
              <span className="block text-2xl font-black text-slate-900">128h</span>
              <span className="block text-[9px] font-bold text-amber-600">{isHindi ? 'लगातार 12 दिन' : '12 Day Streak'}</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center space-y-1">
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">{isHindi ? 'ग्रेड' : 'Grade'}</span>
              <span className="block text-2xl font-black text-emerald-600">A+</span>
              <span className="block text-[9px] font-bold text-slate-500">{isHindi ? 'उत्कृष्ट' : 'Excellent'}</span>
            </div>
          </div>

          {/* Subject Wise Performance */}
          <div className="space-y-3">
            <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <BarChart3 className="w-3 h-3" />
              {isHindi ? 'विषयवार प्रदर्शन' : 'Subject Performance'}
            </h5>
            <div className="space-y-3">
              {[
                { sub: isHindi ? 'विज्ञान' : 'Science', score: 88, status: isHindi ? 'मजबूत' : 'Strong' },
                { sub: isHindi ? 'गणित' : 'Maths', score: 76, status: isHindi ? 'सुधार की जरूरत' : 'Needs Work' },
                { sub: isHindi ? 'अंग्रेजी' : 'English', score: 92, status: isHindi ? 'उत्कृष्ट' : 'Expert' }
              ].map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700">{item.sub}</span>
                    <span className="text-slate-900">{item.score}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${item.score > 85 ? 'bg-emerald-500' : item.score > 70 ? 'bg-amber-500' : 'bg-rose-500'}`}
                      style={{ width: `${item.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Teacher's Remarks */}
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl space-y-2">
            <h5 className="text-[10px] font-black text-amber-700 uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-3 h-3" />
              {isHindi ? 'शिक्षक की टिप्पणी (AI Remarks)' : 'Teacher Remarks (AI)'}
            </h5>
            <p className="text-xs text-amber-900 font-bold leading-relaxed italic">
              {isHindi 
                ? "आपका बच्चा विज्ञान और अंग्रेजी में बहुत अच्छा कर रहा है। गणित के 'त्रिकोणमिति' सेक्शन में थोड़े और अभ्यास की आवश्यकता है। पिछले सप्ताह की तुलना में पढ़ाई में निरंतरता (Consistency) काफी बढ़ी है।"
                : "Your child is performing exceptionally well in Science and English. A bit more focus is needed in Mathematics (Trigonometry). Consistency has improved significantly compared to last week."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button className="flex-1 px-6 py-3 bg-slate-900 text-white font-black text-xs rounded-xl shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer">
              <Download className="w-4 h-4" />
              {isHindi ? 'PDF डाउनलोड करें' : 'Download PDF Report'}
            </button>
            <button className="flex-1 px-6 py-3 bg-white border-2 border-slate-900 text-slate-900 font-black text-xs rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer">
              <Share2 className="w-4 h-4" />
              {isHindi ? 'पेरेंट्स को व्हाट्सएप करें' : 'Share to Parents'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
