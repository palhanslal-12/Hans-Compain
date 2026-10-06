import { MockTest, ChallengeQuestion } from '../types';

export const SAMPLE_CHALLENGES: ChallengeQuestion[] = [
  {
    id: 'c1',
    question: 'If A is twice as fast as B and B is thrice as fast as C, what is the ratio of time taken by A, B and C to cover the same distance?',
    questionHi: 'यदि A, B से दोगुना तेज है और B, C से तीन गुना तेज है, तो समान दूरी तय करने में A, B और C द्वारा लिए गए समय का अनुपात क्या होगा?',
    options: ['1 : 2 : 6', '6 : 3 : 1', '3 : 2 : 1', '1 : 3 : 6'],
    optionsHi: ['1 : 2 : 6', '6 : 3 : 1', '3 : 2 : 1', '1 : 3 : 6'],
    correctIndex: 0,
    explanation: 'Speed ratio A:B:C = 6:3:1. Since Time = Distance/Speed, Time ratio = 1/6 : 1/3 : 1/1 = 1 : 2 : 6.',
    explanationHi: 'चाल का अनुपात A:B:C = 6:3:1 है। समय = दूरी/चाल, अतः समय का अनुपात = 1/6 : 1/3 : 1/1 = 1 : 2 : 6।'
  },
  {
    id: 'c2',
    question: 'Which constitutional amendment introduced the Goods and Services Tax (GST) in India?',
    questionHi: 'भारत में वस्तु एवं सेवा कर (GST) किस संविधान संशोधन अधिनियम द्वारा लागू किया गया था?',
    options: ['99th Amendment', '101st Amendment', '103rd Amendment', '105th Amendment'],
    optionsHi: ['99वां संशोधन', '101वां संशोधन', '103वां संशोधन', '105वां संशोधन'],
    correctIndex: 1,
    explanation: 'The 101st Constitutional Amendment Act, 2016 introduced the unified GST framework in India on 1st July 2017.',
    explanationHi: '101वें संविधान संशोधन अधिनियम, 2016 के माध्यम से 1 जुलाई 2017 को भारत में एकल जीएसटी प्रणाली लागू की गई।'
  },
  {
    id: 'c3',
    question: 'In a code language, if STUDY is written as TUVFZ, how will WINNER be written?',
    questionHi: 'यदि किसी सांकेतिक भाषा में STUDY को TUVFZ लिखा जाता है, तो WINNER को कैसे लिखा जाएगा?',
    options: ['XJOOFS', 'XKOOGS', 'WJOOFR', 'YKPPHS'],
    optionsHi: ['XJOOFS', 'XKOOGS', 'WJOOFR', 'YKPPHS'],
    correctIndex: 0,
    explanation: 'Each letter is shifted by +1: S(+1)=T, T(+1)=U, U(+1)=V, D(+1)=F (wait D+2=F, Y+1=Z). WINNER -> W(+1) I(+1) N(+1) N(+1) E(+1) R(+1) = XJOOFS.',
    explanationHi: 'प्रत्येक वर्ण में +1 की वृद्धि की गई है: W->X, I->J, N->O, N->O, E->F, R->S = XJOOFS।'
  },
  {
    id: 'c4',
    question: 'What is the SI unit of Magnetic Flux?',
    questionHi: 'चुंबकीय प्रवाह (Magnetic Flux) का SI मात्रक क्या है?',
    options: ['Tesla', 'Weber', 'Henry', 'Gauss'],
    optionsHi: ['टेस्ला (Tesla)', 'वेबर (Weber)', 'हेनरी (Henry)', 'गॉस (Gauss)'],
    correctIndex: 1,
    explanation: 'The SI unit of magnetic flux is Weber (Wb), whereas magnetic flux density is measured in Tesla (T).',
    explanationHi: 'चुंबकीय प्रवाह का SI मात्रक वेबर (Wb) है, जबकि चुंबकीय क्षेत्र घनत्व का मात्रक टेस्ला (T) है।'
  },
  {
    id: 'c5',
    question: 'Which of the following is NOT an operating system component or scheduling algorithm?',
    questionHi: 'निम्नलिखित में से कौन सा ऑपरेटिंग सिस्टम का शेड्यूलिंग एल्गोरिदम नहीं है?',
    options: ['Round Robin', 'Shortest Job First', 'QuickSort', 'First Come First Served'],
    optionsHi: ['राउंड रॉबिन (Round Robin)', 'शॉर्टेस्ट जॉब फर्स्ट (SJF)', 'क्विकसॉर्ट (QuickSort)', 'फर्स्ट कम फर्स्ट सर्व्ड (FCFS)'],
    correctIndex: 2,
    explanation: 'QuickSort is a sorting algorithm for arrays/lists, not a CPU scheduling algorithm.',
    explanationHi: 'QuickSort एक डेटा सॉर्टिंग एल्गोरिदम है, CPU प्रोसेस शेड्यूलिंग नहीं।'
  }
];

export const MOCK_TESTS: MockTest[] = [
  {
    id: 'ssc-cgl-tier1-full',
    title: 'SSC CGL / CHSL Tier-1 Maha Mock 2026',
    titleHi: 'एसएससी सीजीएल/सीएचएसएल टियर-1 महा मॉक टेस्ट 2026',
    examCategory: 'SSC',
    durationMinutes: 20,
    totalMarks: 50,
    negativeMarking: 0.5,
    questions: [
      {
        id: 'q1',
        subject: 'General Intelligence & Reasoning',
        subjectHi: 'तर्कशक्ति (Reasoning)',
        questionEn: 'Select the related word from given alternatives: Thermometer : Temperature :: Hygrometer : ?',
        questionHi: 'दिए गए विकल्पों में से संबंधित शब्द चुनिए: थर्मामीटर : तापमान :: हाइग्रोमीटर : ?',
        optionsEn: ['Atmospheric Pressure', 'Humidity', 'Rainfall', 'Specific Gravity'],
        optionsHi: ['वायुमंडलीय दबाव', 'आर्द्रता (Humidity)', 'वर्षा', 'विशिष्ट गुरुत्व'],
        correctIndex: 1,
        explanationEn: 'Thermometer measures temperature; Hygrometer measures humidity in the atmosphere.',
        explanationHi: 'थर्मामीटर से तापमान नापा जाता है, जबकि हाइग्रोमीटर से वायुमंडलीय आर्द्रता मापी जाती है।'
      },
      {
        id: 'q2',
        subject: 'Quantitative Aptitude',
        subjectHi: 'गणित (Maths)',
        questionEn: 'A sum of money amounts to ₹9,680 in 2 years and to ₹10,648 in 3 years at compound interest compounded annually. Find the rate of interest per annum.',
        questionHi: 'कोई धनराशि वार्षिक चक्रवृद्धि ब्याज पर 2 वर्ष में ₹9,680 और 3 वर्ष में ₹10,648 हो जाती है। वार्षिक ब्याज दर ज्ञात कीजिए।',
        optionsEn: ['8%', '10%', '12%', '15%'],
        optionsHi: ['8%', '10%', '12%', '15%'],
        correctIndex: 1,
        explanationEn: 'Interest in 3rd year = 10,648 - 9,680 = ₹968. Rate = (968 / 9680) * 100 = 10%.',
        explanationHi: 'तीसरे वर्ष का ब्याज = 10,648 - 9,680 = ₹968। दर = (968 / 9680) × 100 = 10% वार्षिक।'
      },
      {
        id: 'q3',
        subject: 'General Awareness',
        subjectHi: 'सामान्य ज्ञान (GK)',
        questionEn: 'Who is known as the "Father of the Indian Constitution"?',
        questionHi: 'भारतीय संविधान का जनक किन्हें कहा जाता है?',
        optionsEn: ['Dr. Rajendra Prasad', 'Dr. B. R. Ambedkar', 'Jawaharlal Nehru', 'Sardar Vallabhbhai Patel'],
        optionsHi: ['डॉ. राजेंद्र प्रसाद', 'डॉ. भीमराव रामजी अंबेडकर', 'जवाहरलाल नेहरू', 'सरदार वल्लभभाई पटेल'],
        correctIndex: 1,
        explanationEn: 'Dr. B. R. Ambedkar, as the Chairman of the Drafting Committee, is revered as the Father of the Indian Constitution.',
        explanationHi: 'प्रारूप समिति के अध्यक्ष डॉ. भीमराव अंबेडकर को भारतीय संविधान का जनक और मुख्य शिल्पकार कहा जाता है।'
      },
      {
        id: 'q4',
        subject: 'English Comprehension',
        subjectHi: 'अंग्रेजी (English)',
        questionEn: 'Identify the synonym of the word "DILIGENT":',
        questionHi: '"DILIGENT" शब्द का सही समानार्थी (Synonym) चुनिए:',
        optionsEn: ['Lazy', 'Industrious', 'Careless', 'Arrogant'],
        optionsHi: ['Lazy (आलसी)', 'Industrious (मेहनती)', 'Careless (लापरवाह)', 'Arrogant (घमंडी)'],
        correctIndex: 1,
        explanationEn: 'Diligent means showing care and conscientiousness in one\'s work or duties; Industrious has the same meaning.',
        explanationHi: 'Diligent का अर्थ होता है लगनशील और परिश्रमी, जिसका सटीक समानार्थी Industrious है।'
      }
    ]
  },
  {
    id: 'railway-rrb-ntpc-express',
    title: 'RRB NTPC & Group D Super Speed Mock',
    titleHi: 'रेलवे आरआरबी एनटीपीसी व ग्रुप डी सुपर स्पीड मॉक 2026',
    examCategory: 'RAILWAY',
    durationMinutes: 15,
    totalMarks: 30,
    negativeMarking: 0.33,
    questions: [
      {
        id: 'rq1',
        subject: 'General Science',
        subjectHi: 'सामान्य विज्ञान (Science)',
        questionEn: 'Which vitamin is essential for blood clotting in human body?',
        questionHi: 'मानव शरीर में रक्त का थक्का जमने के लिए कौन सा विटामिन आवश्यक है?',
        optionsEn: ['Vitamin A', 'Vitamin C', 'Vitamin K', 'Vitamin D'],
        optionsHi: ['विटामिन A', 'विटामिन C', 'विटामिन K', 'विटामिन D'],
        correctIndex: 2,
        explanationEn: 'Vitamin K (Phylloquinone) plays a key role in synthesizing prothrombin for blood coagulation.',
        explanationHi: 'विटामिन K रक्त में प्रोथ्रोम्बिन के निर्माण और रक्त का थक्का जमने में अनिवार्य भूमिका निभाता है।'
      },
      {
        id: 'rq2',
        subject: 'Mathematics',
        subjectHi: 'गणित',
        questionEn: 'A train 180 m long is running at a speed of 72 km/h. How much time will it take to cross an electric pole?',
        questionHi: '180 मीटर लंबी एक ट्रेन 72 किमी/घंटा की चाल से चल रही है। यह एक बिजली के खंभे को कितने समय में पार करेगी?',
        optionsEn: ['6 seconds', '9 seconds', '12 seconds', '15 seconds'],
        optionsHi: ['6 सेकंड', '9 सेकंड', '12 सेकंड', '15 सेकंड'],
        correctIndex: 1,
        explanationEn: 'Speed in m/s = 72 * (5/18) = 20 m/s. Time = Distance / Speed = 180 / 20 = 9 seconds.',
        explanationHi: 'ट्रेन की चाल = 72 × (5/18) = 20 मीटर/सेकंड। समय = 180 / 20 = 9 सेकंड।'
      }
    ]
  },
  {
    id: 'board-10-12-academic',
    title: 'Class 10th & 12th Board Target 95%+ Booster',
    titleHi: 'कक्षा 10वीं और 12वीं बोर्ड परीक्षा 95%+ टॉपर बूस्टर',
    examCategory: 'BOARD_10',
    durationMinutes: 25,
    totalMarks: 40,
    negativeMarking: 0,
    questions: [
      {
        id: 'bq1',
        subject: 'Physics / Science',
        subjectHi: 'भौतिक विज्ञान (Physics)',
        questionEn: 'What is the focal length of a concave mirror having a radius of curvature of 30 cm?',
        questionHi: '30 सेमी वक्रता त्रिज्या वाले अवतल दर्पण की फोकस दूरी क्या होगी?',
        optionsEn: ['+15 cm', '-15 cm', '+30 cm', '-60 cm'],
        optionsHi: ['+15 सेमी', '-15 सेमी', '+30 सेमी', '-60 सेमी'],
        correctIndex: 1,
        explanationEn: 'For concave mirror, f = -R/2 = -30/2 = -15 cm according to Cartesian sign convention.',
        explanationHi: 'अवतल दर्पण के लिए चिन्ह परिपाटी के अनुसार फोकस दूरी f = -R/2 = -30/2 = -15 सेमी होती है।'
      }
    ]
  }
];
