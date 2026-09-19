const fs = require('fs');

let code = fs.readFileSync('src/components/HansAiHelpGuideModal.tsx', 'utf8');

// Replace handleSendCustomQuery
const oldStart = `// 🛡️ STRICT SECURITY GUARD - Block requests for admin passwords, owner PINs or internal secrets`;

const newHandlerLogic = `// 🛡️ STRICT SECURITY GUARD - Block requests for admin passwords, owner PINs or internal secrets
    if (lower.includes("admin") || lower.includes("एडमिन") || lower.includes("password") || lower.includes("पासवर्ड") || lower.includes("pin") || lower.includes("पिन") || lower.includes("secret") || lower.includes("सीक्रेट") || lower.includes("owner pin")) {
      replyText = \`🛡️ **गोपनीयता एवं सुरक्षा नीति (Security Policy):**\\n\\nयह एआई असिस्टेंट केवल **HANS COMPAIN** ऐप के उपयोग, फ़ीचर्स (अध्ययन टूल्स, स्टेनो, क्विज़, कॉइन्स व सेटिंग्स) को समझाने के लिए है।\\n\\n⚠️ **प्रशासकीय (Admin) पासवर्ड, ओनर पिन अथवा सर्वर क्रेडेंशियल्स गोपनीय हैं और शेयर नहीं किए जा सकते।**\`;
    } else if (lower.includes("steno") || lower.includes("स्टेनो") || lower.includes("डिक्टेशन") || lower.includes("shorthand") || lower.includes("pad")) {
      replyText = \`✍️ **स्टेनो व डिक्टेशन स्टूडियो गाइड:**\\n\\n1. **फुल-साइज डिजिटल पैड:** स्टेनो मेनू में डिजिटल पैड दिया गया है जहां आप उंगली/स्टाइलस से अभ्यास कर सकते हैं।\\n2. **वॉइस डिक्टेशन:** 60, 80, 100, 120 WPM पर ऑडियो सुनकर लिख सकते हैं।\\n3. **ऑडियो अपलोड:** अपनी ऑडियो (.mp3) या टेक्स्ट अपलोड करके भी डिक्टेशन चला सकते हैं।\`;
      targetView = "steno";
    } else if (lower.includes("coin") || lower.includes("कॉइन") || lower.includes("reward") || lower.includes("रिवॉर्ड") || lower.includes("share") || lower.includes("शेयर")) {
      replyText = \`🪙 **हंस कॉइन्स व रिवॉर्ड्स गाइड:**\\n\\n1. **कॉइन्स कैसे कमाएं:** लाइव क्विज़ जीतने, डेली स्टडी स्ट्राइक बनाए रखने और दोस्तों को ऐप शेयर करने पर **+50 कॉइन्स** मिलते हैं।\\n2. **बैलेंस देखें:** अपनी प्रोफ़ाइल (Avatar) पर क्लिक करके अपना कॉइन बैलेंस व बैडजेस देख सकते हैं।\`;
      targetView = "profile";
    } else if (lower.includes("theme") || lower.includes("थीम") || lower.includes("color") || lower.includes("रंग") || lower.includes("font") || lower.includes("फॉन्ट") || lower.includes("lang") || lower.includes("भाषा")) {
      replyText = \`⚙️ **थीम, फॉन्ट व भाषा बदलने का तरीका:**\\n\\n1. टॉप-राइट कॉर्नर में **⚙️ सेटिंग्स** बटन पर क्लिक करें।\\n2. **स्क्रीन थीम:** Blue-Green Light Mode, Midnight Dark, Warm Yellow चुन सकते हैं।\\n3. **सिस्टम भाषा:** हिंदी या English चुन सकते हैं।\\n4. **फॉन्ट साइज़:** चैट का टेक्स्ट साइज़ Normal से Huge तक कर सकते हैं।\`;
    } else if (lower.includes("class") || lower.includes("कक्षा") || lower.includes("board") || lower.includes("बोर्ड") || lower.includes("exam") || lower.includes("परीक्षा") || lower.includes("target")) {
      replyText = \`🎯 **कक्षा व परीक्षा टारगेट बदलने का तरीका:**\\n\\n1. **⚙️ सेटिंग्स** खोलें।\\n2. सबसे ऊपर **'कक्षा, सेक्शन व परीक्षा चुनें'** बटन पर क्लिक करें।\\n3. अपनी बोर्ड कक्षा (10th/12th) या प्रतियोगी परीक्षा (SSC Steno, Railway, CGL) चुनें।\`;
    } else if (lower.includes("pdf") || lower.includes("पीडीएफ") || lower.includes("download") || lower.includes("डाउनलोड")) {
      replyText = \`📥 **PDF नोट्स डाउनलोड गाइड:**\\n\\nचैट में किसी भी AI जवाब के नीचे **'📥 PDF डाउनलोड'** बटन पर क्लिक करें। रंगीन व प्रिंट-रेडी PDF फाइल तुरंत डाउनलोड हो जाएगी।\`;
      targetView = "chat";
    } else if (lower.includes("quiz") || lower.includes("क्विज") || lower.includes("test") || lower.includes("मिस्टेक") || lower.includes("mistake")) {
      replyText = \`🎯 **क्विज व मिस्टेक नोटबुक गाइड:**\\n\\n1. साइडबार मेनू से **'क्विज (MCQ Test)'** खोलें।\\n2. गलत हुए सवाल अपने आप **Mistake Notebook** में सेव हो जाते हैं जिनका आप कभी भी रिटेस्ट दे सकते हैं।\`;
      targetView = "quiz";
    } else if (lower.includes("lab") || lower.includes("लैब") || lower.includes("science") || lower.includes("विज्ञान") || lower.includes("gis") || lower.includes("earth")) {
      replyText = \`🔬 **3D साइंस लैब व GIS अर्थ गाइड:**\\n\\nसाइडबार मेनू से **3D Science Lab** या **GIS Interactive Earth** खोलकर फिजिक्स, केमिस्ट्री सिमुलेशन और 3D मैप्स देख सकते हैं।\`;
      targetView = "science-lab";
    } else if (lower.includes("how to use") || lower.includes("कैसे चलाएं") || lower.includes("इस्तेमाल") || lower.includes("उपयोग") || lower.includes("feature") || lower.includes("फीचर")) {
      replyText = \`📱 **HANS COMPAIN ऐप का उपयोग कैसे करें:**\\n\\n1. **मुख्य होम पेज (AI Chat):** पढ़ाई के सवाल पूछें व नोट्स बनाएं।\\n2. **स्टेनो स्टूडियो:** शॉर्टहैंड डिक्टेशन व राइटिंग पैड का उपयोग करें।\\n3. **क्विज व PYQ Vault:** ऑनलाइन टेस्ट दें और पिछले 10 वर्षों के पेपर हल करें।\\n4. **⚙️ सेटिंग्स:** थीम, भाषा, फॉन्ट और व्हाट्सएप स्टेटस डिज़ाइनर का उपयोग करें।\`;
    } else if (lower.includes("what is") || lower.includes("क्या है") || lower.includes("solve") || lower.includes("हल") || lower.includes("question") || lower.includes("सवाल") || lower.includes("math") || lower.includes("science") || lower.includes("history")) {
      replyText = \`ℹ️ **ऐप सहायता निर्देशिका:**\\n\\nयह एआई केवल **HANS COMPAIN ऐप के फ़ीचर्स व उपयोग** को समझाने के लिए है।\\n\\n📚 **पढ़ाई, होमवर्क या प्रश्न का उत्तर पाने के लिए:**\\nकृपया होम स्क्रीन पर जाएं और **Main AI Chat** में अपना सवाल पूछें!\`;
      targetView = "chat";
    } else {
      replyText = \`📱 **HANS COMPAIN ऐप सहायता एआई:**\\n\\nआपके प्रश्न **"\${query}"** के लिए:\\nयह एआई केवल ऐप के उपयोग व फ़ीचर्स (जैसे: स्टेनो पैड, टेस्ट, कॉइन्स, सेटिंग्स, पीडीएफ डाउनलोड) की जानकारी देता है।\\n\\nयदि आप पढ़ाई का सवाल पूछना चाहते हैं, तो कृपया होम पेज एआई चैट का उपयोग करें!\`;
    }`;

const handleSendCustomQueryFull = `const handleSendCustomQuery = (e: React.FormEvent) => {
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

    ${newHandlerLogic}

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

// Replace handleSendCustomQuery block
const customQueryRegex = /const handleSendCustomQuery = \([s\S]*?\n  \};/;
if (customQueryRegex.test(code)) {
  code = code.replace(customQueryRegex, handleSendCustomQueryFull);
  fs.writeFileSync('src/components/HansAiHelpGuideModal.tsx', code);
  console.log("HansAiHelpGuideModal updated successfully with pure App Guide logic!");
} else {
  console.log("Could not find handleSendCustomQuery pattern");
}
