const fs = require('fs');

let code = fs.readFileSync('src/components/HansAiHelpGuideModal.tsx', 'utf8');

const targetOldHandler = `  const handleSendCustomQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const query = inputQuery.trim();
    setInputQuery('');

    const userMsg: ChatMessage = {
      id: \`user-\${Date.now()}\`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Intelligent local matching & response generator
    let replyText = '';
    let targetView: string | undefined = undefined;
    const lower = query.toLowerCase();

    // 🛡️ STRICT SECURITY GUARD - Block requests for admin passwords, owner PINs or internal secrets
    if (lower.includes("admin") || lower.includes("एडमिन") || lower.includes("password") || lower.includes("पासवर्ड") || lower.includes("pin") || lower.includes("पिन") || lower.includes("secret") || lower.includes("सीक्रेट") || lower.includes("owner pin")) {
      replyText = \`🛡️ **गोपनीयता एवं सुरक्षा नीति (Privacy & Security Notice):**\\n\\nयह एआई गाइड केवल **HANS COMPAIN** के छात्रों की सहायता और ऐप के शैक्षणिक फ़ीचर्स (अध्ययन, क्विज़, शॉर्टहैंड, नोट्स व कॉइन्स) का उपयोग सिखाने के लिए है।\\n\\n⚠️ **प्रशासकीय (Admin) पासवर्ड, ओनर पिन अथवा सर्वर क्रेडेंशियल्स गोपनीय हैं और शेयर नहीं किए जा सकते।**\\n\\nयदि आपको ऐप के किसी फ़ीचर या समस्या से जुड़ा कोई सवाल पूछना है, तो कृपया बेझिझक टाइप करें!\`;
    } else if (lower.includes("steno") || lower.includes("स्टेनो") || lower.includes("डिक्टेशन") || lower.includes("dictat") || lower.includes("shorthand") || lower.includes("pad")) {
      replyText = \`✍️ **स्टेनो व डिक्टेशन समाधान:**\\n\\n1. स्टेनो स्टूडियो में आपके लिए **फुल-साइज डिजिटल पैड** दिया गया है जहां आप बिना रुकावट पूरा पेज लिख सकते हैं।\\n2. 'लाइव ऑडियो डिक्टेशन' में 60, 80, 100, 120 WPM पर आवाज में डिक्टेशन सुनकर साथ-साथ लिख सकते हैं।\\n3. आप अपना कोई भी ऑडियो फाइल (.mp3) या कस्टम टेक्स्ट भी अपलोड करके अभ्यास कर सकते हैं।\`;
      targetView = 'steno';
    } else if (lower.includes('pdf') || lower.includes('पीडीएफ') || lower.includes('download') || lower.includes('डाउनलोड')) {
      replyText = \`📥 **PDF डाउनलोड करने का तरीका:**\\n\\nचैट में किसी भी AI जवाब के नीचे **'📥 PDF डाउनलोड'** बटन दिया गया है। उसपर क्लिक करते ही रंगीन अध्ययन नोट्स तुरंत आपके मोबाइल या कंप्यूटर में डाउनलोड हो जाएंगे।\`;
      targetView = 'chat';
    } else if (lower.includes('quiz') || lower.includes('क्विज') || lower.includes('test') || lower.includes('mistake') || lower.includes('गलती')) {
      replyText = \`🎯 **क्विज व मिस्टेक नोटबुक:**\\n\\nक्विज मेनू में हर विषय के लाइव MCQ टेस्ट उपलब्ध हैं। जो सवाल गलत होते हैं वे अपने आप 'Mistake Notebook' में सेव हो जाते हैं जिनका आप कभी भी दोबारा टेस्ट दे सकते हैं।\`;
      targetView = 'quiz';
    } else if (lower.includes('voice') || lower.includes('आवाज') || lower.includes('audio') || lower.includes('sound') || lower.includes('बोल')) {
      replyText = \`🎙️ **वॉइस व ऑडियो फीचर्स:**\\n\\n1. चैट में माइक बटन दबाकर बोलकर सवाल पूछ सकते हैं।\\n2. हर जवाब के ऊपर '🔊' बटन दबाकर पूरा उत्तर सुन सकते हैं।\\n3. 'ऑडियो बुक्स / वॉइस रीडर' में कोई भी लेख पेस्ट करके स्पष्ट आवाज में सुनकर याद कर सकते हैं।\`;
      targetView = 'book-reader';
    } else if (lower.includes('science') || lower.includes('विज्ञान') || lower.includes('formula') || lower.includes('लैब')) {
      replyText = \`🔬 **साइंस लैब:**\\n\\nसाइंस लैब में ओहम का नियम, दर्पण/लेंस, पेंडुलम, और फॉर्मूला कैलकुलेटर इंटरएक्टिव 3D सिमुलेशन के साथ उपलब्ध हैं।\`;
      targetView = 'science-lab';
    } else {
      replyText = \`🤖 **HansAI समाधान:**\\n\\nआपके प्रश्न **"\${query}"** के लिए:\\nHansAI के सभी फीचर्स (चैट, स्टेनो, क्विज, नोट्स, पीडीएफ, साइंस लैब, टाइम-ट्रैवल) पूरी तरह सक्रिय हैं। आप साइडबार मेनू से कभी भी किसी भी फीचर पर जा सकते हैं।\\n\\nक्या आप चाहते हैं कि मैं आपको मुख्य चैट या स्टेनो स्टूडियो पर ले चलूँ?\`;
    }

    const botMsg: ChatMessage = {
      id: \`bot-\${Date.now() + 1}\`,
      sender: 'bot',
      text: replyText,
      suggestedAction: targetView ? {
        label: \`👉 \${targetView.toUpperCase()} फीचर खोलें\`,
        viewName: targetView
      } : undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg, botMsg]);
  };`;

const newHandler = `  const handleSendCustomQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const query = inputQuery.trim();
    setInputQuery('');

    const userMsg: ChatMessage = {
      id: \`user-\${Date.now()}\`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    let replyText = '';
    let targetView: string | undefined = undefined;
    const lower = query.toLowerCase();

    // 🛡️ STRICT SECURITY GUARD - Block requests for admin passwords, owner PINs or internal secrets
    if (lower.includes("admin") || lower.includes("एडमिन") || lower.includes("password") || lower.includes("पासवर्ड") || lower.includes("pin") || lower.includes("पिन") || lower.includes("secret") || lower.includes("सीक्रेट") || lower.includes("owner pin")) {
      replyText = \`🛡️ **गोपनीयता एवं सुरक्षा नीति (Security Policy):**\\n\\nयह एआई केवल **HANS COMPAIN** ऐप के उपयोग, फ़ीचर्स (अध्ययन टूल्स, स्टेनो, क्विज़, कॉइन्स व सेटिंग्स) को समझाने के लिए है।\\n\\n⚠️ **प्रशासकीय (Admin) पासवर्ड, ओनर पिन अथवा सर्वर क्रेडेंशियल्स गोपनीय हैं और शेयर नहीं किए जा सकते।**\`;
    } 
    // 📚 REDIRECT GENERAL ACADEMIC STUDY QUESTIONS TO HOME PAGE CHAT
    else if (
      lower.includes("what is") || lower.includes("क्या है") || lower.includes("solve") || lower.includes("हल") || 
      lower.includes("question") || lower.includes("math") || lower.includes("science") || lower.includes("history") || 
      lower.includes("formula") && !lower.includes("lab") || lower.includes("gk") || lower.includes("homework")
    ) {
      replyText = \`ℹ️ **ऐप सहायता निर्देशिका:**\\n\\nयह एआई असिस्टेंट **केवल HANS COMPAIN ऐप के फ़ीचर्स व इस्तेमाल** को समझाने के लिए है।\\n\\n📚 **पढ़ाई, होमवर्क या किसी प्रश्न का उत्तर पाने के लिए:**\\nकृपया होम स्क्रीन पर जाएं और **Main AI Chat (Home Page)** में अपना सवाल पूछें! वहां एआई आपके हर सवाल का हल प्रदान करेगा।\`;
      targetView = 'chat';
    }
    // ✍️ STENO STUDIO HELP
    else if (lower.includes("steno") || lower.includes("स्टेनो") || lower.includes("डिक्टेशन") || lower.includes("dictat") || lower.includes("shorthand") || lower.includes("pad")) {
      replyText = \`✍️ **स्टेनो व डिक्टेशन स्टूडियो गाइड:**\\n\\n1. **फुल-साइज डिजिटल पैड:** स्टेनो मेनू में डिजिटल पैड दिया गया है जहां आप उंगली/स्टाइलस से अभ्यास कर सकते हैं।\\n2. **वॉइस डिक्टेशन:** 60, 80, 100, 120 WPM पर ऑडियो सुनकर लिख सकते हैं।\\n3. **ऑडियो अपलोड:** अपनी ऑडियो (.mp3) या टेक्स्ट अपलोड करके भी डिक्टेशन चला सकते हैं।\`;
      targetView = 'steno';
    } 
    // 🪙 COINS & REWARDS HELP
    else if (lower.includes("coin") || lower.includes("कॉइन") || lower.includes("reward") || lower.includes("रिवॉर्ड") || lower.includes("share") || lower.includes("शेयर")) {
      replyText = \`🪙 **हंस कॉइन्स व रिवॉर्ड्स गाइड:**\\n\\n1. **कॉइन्स कैसे कमाएं:** लाइव क्विज़ जीतने, डेली स्टडी स्ट्राइक बनाए रखने और दोस्तों को ऐप शेयर करने पर **+50 कॉइन्स** मिलते हैं।\\n2. **बैलेंस देखें:** अपनी प्रोफ़ाइल (Avatar) पर क्लिक करके अपना कॉइन बैलेंस व बैडजेस देख सकते हैं।\`;
      targetView = 'profile';
    } 
    // ⚙️ THEME & SETTINGS HELP
    else if (lower.includes("theme") || lower.includes("थीम") || lower.includes("color") || lower.includes("रंग") || lower.includes("font") || lower.includes("फॉन्ट") || lower.includes("lang") || lower.includes("भाषा")) {
      replyText = \`⚙️ **थीम, फॉन्ट व भाषा बदलने का तरीका:**\\n\\n1. टॉप-राइट कॉर्नर में **⚙️ सेटिंग्स** बटन पर क्लिक करें।\\n2. **स्क्रीन थीम:** Blue-Green Light Mode, Midnight Dark, Warm Yellow चुन सकते हैं।\\n3. **सिस्टम भाषा:** हिंदी या English चुन सकते हैं।\\n4. **फॉन्ट साइज़:** चैट का टेक्स्ट साइज़ Normal से Huge तक कर सकते हैं।\`;
    } 
    // 🎯 CLASS & EXAM TARGET HELP
    else if (lower.includes("class") || lower.includes("कक्षा") || lower.includes("board") || lower.includes("बोर्ड") || lower.includes("exam") || lower.includes("परीक्षा") || lower.includes("target")) {
      replyText = \`🎯 **कक्षा व परीक्षा टारगेट बदलने का तरीका:**\\n\\n1. **⚙️ सेटिंग्स** खोलें।\\n2. सबसे ऊपर **'कक्षा, सेक्शन व परीक्षा चुनें'** बटन पर क्लिक करें।\\n3. अपनी बोर्ड कक्षा (10th/12th) या प्रतियोगी परीक्षा (SSC Steno, Railway, CGL) चुनें।\`;
    } 
    // 📥 PDF DOWNLOAD HELP
    else if (lower.includes("pdf") || lower.includes("पीडीएफ") || lower.includes("download") || lower.includes("डाउनलोड")) {
      replyText = \`📥 **PDF नोट्स डाउनलोड गाइड:**\\n\\nचैट में किसी भी AI जवाब के नीचे **'📥 PDF डाउनलोड'** बटन पर क्लिक करें। रंगीन व प्रिंट-रेडी PDF फाइल तुरंत डाउनलोड हो जाएगी।\`;
      targetView = 'chat';
    } 
    // 🎯 QUIZ & MISTAKE NOTEBOOK HELP
    else if (lower.includes("quiz") || lower.includes("क्विज") || lower.includes("test") || lower.includes("मिस्टेक") || lower.includes("mistake")) {
      replyText = \`🎯 **क्विज व मिस्टेक नोटबुक गाइड:**\\n\\n1. साइडबार मेनू से **'क्विज (MCQ Test)'** खोलें।\\n2. गलत हुए सवाल अपने आप **Mistake Notebook** में सेव हो जाते हैं जिनका आप कभी भी रिटेस्ट दे सकते हैं।\`;
      targetView = 'quiz';
    } 
    // 🔬 SCIENCE LAB HELP
    else if (lower.includes("lab") || lower.includes("लैब") || lower.includes("science") || lower.includes("विज्ञान") || lower.includes("gis") || lower.includes("earth")) {
      replyText = \`🔬 **3D साइंस लैब व GIS अर्थ गाइड:**\\n\\nसाइडबार मेनू से **3D Science Lab** या **GIS Interactive Earth** खोलकर फिजिक्स, केमिस्ट्री सिमुलेशन और 3D मैप्स देख सकते हैं।\`;
      targetView = 'science-lab';
    } 
    // 📱 GENERAL APP HOW-TO
    else {
      replyText = \`📱 **HANS COMPAIN ऐप सहायता गाइड:**\\n\\nयह एआई असिस्टेंट केवल **HANS COMPAIN ऐप के फ़ीचर्स व उपयोग** (जैसे: स्टेनो पैड, ऑनलाइन टेस्ट, कॉइन्स, सेटिंग्स, पीडीएफ) को समझाने के लिए है।\\n\\n👉 यदि आपको ऐप चलाने में कोई समस्या आ रही है तो नीचे लिखे विकल्प चुनें या सवाल टाइप करें! (पढ़ाई/होमवर्क के लिए Home Page Chat का उपयोग करें)\`;
    }

    const botMsg: ChatMessage = {
      id: \`bot-\${Date.now() + 1}\`,
      sender: 'bot',
      text: replyText,
      suggestedAction: targetView ? {
        label: \`👉 \${targetView.toUpperCase()} फीचर खोलें\`,
        viewName: targetView
      } : undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg, botMsg]);
  };`;

if (code.includes(targetOldHandler)) {
  code = code.replace(targetOldHandler, newHandler);
  fs.writeFileSync('src/components/HansAiHelpGuideModal.tsx', code);
  console.log("Successfully updated HansAiHelpGuideModal with App Support & Feature ONLY logic!");
} else {
  console.log("Target old handler not found exactly.");
}
