import React, { useState } from 'react';
import {
  BookOpen,
  Volume2,
  Sun,
  Moon,
  Play,
  Pause,
  Search,
  Globe,
  RefreshCw,
  Sparkles,
  FileText,
  ChevronLeft,
  ChevronRight,
  Book,
  Bookmark
} from 'lucide-react';
import { recordStudyActivity } from '../firebase';
import { playNaturalSpeech, stopNaturalSpeech } from '../utils/naturalSpeech';

export interface BookChapter {
  id: string;
  bookTitle: string;
  chapterTitle: string;
  author: string;
  category: string;
  chapterNum: number;
  content: string[];
}

// Built-in Authoritative Multipage Multi-chapter Library
const curatedLibrary: Record<string, BookChapter[]> = {
  'steno': [
    {
      id: 'steno_ch1',
      bookTitle: 'ऋषि प्रणाली हिन्दी आशुलिपि (Rishi Pranali Shorthand)',
      chapterTitle: 'अध्याय 1: वर्णमाला, रेखाक्षरों की बनावट व दिशा नियम',
      author: 'ऋषि लाल अग्रवाल (मानक संस्करण)',
      category: 'Shorthand',
      chapterNum: 1,
      content: [
        'हिन्दी आशुलिपि (Stenography) ध्वनि पर आधारित एक अत्यंत वैज्ञानिक कला है। इसमें प्रत्येक उच्चारित ध्वनि को ज्यामितीय सरल रेखाओं (Straight Lines), वक्र रेखाओं (Curves) और वृत्तों (Circles) द्वारा निरूपित किया जाता है।',
        'क-वर्ग रेखाक्षर (क, ख, ग, घ): ये सभी बाएं से दाएं (Left to Right) सीधी क्षैतिज रेखाएं हैं। क हल्की रेखा है, ख हल्की कटी हुई, ग गहरी रेखा और घ गहरी कटी हुई रेखा है। सभी की लंबाई लगभग 0.75 सेमी (3/4 इंच) रखी जाती है।',
        'च-वर्ग एवं ट-वर्ग रेखाक्षर: च-वर्ग (च, छ, ज, झ) ऊपर से नीचे 60 डिग्री के कोण पर झुकी अधोमुखी रेखाएं हैं, जबकि ट-वर्ग (ट, ठ, ड, ढ) 90 डिग्री के समकोण पर बिल्कुल लंबवत नीचे की ओर लिखी जाती हैं।',
        'प-वर्ग एवं त-वर्ग रेखाक्षर: प-वर्ग 120 डिग्री के कोण पर अधोमुखी लिखा जाता है। त-वर्ग कोष्ठक के आकार में वक्र रेखा के रूप में बाएं और दाएं दोनों पक्षों में लिखा जाता है ताकि आगे के रेखाक्षर आसानी से जुड़ सकें।',
        'हल्के और गहरे का नियम (Light & Heavy Strokes): अघोष ध्वनियां (क, च, ट, त, प) हल्की पेंसिल से लिखी जाती हैं, जबकि सघोष ध्वनियां (ग, ज, ड, द, ब) पेंसिल पर हल्का दबाव देकर गहरी लिखी जाती हैं।',
        'अध्याय 1 अभ्यास निर्देश: रेखाक्षरों का कोण और लंबाई हमेशा एकसमान होनी चाहिए। पेंसिल को ढीली पकड़ें और बिना रुके एक प्रवाह (Flow) में लिखने का अभ्यास प्रतिदिन कम से कम 30 मिनट करें।'
      ]
    },
    {
      id: 'steno_ch2',
      bookTitle: 'ऋषि प्रणाली हिन्दी आशुलिपि (Rishi Pranali Shorthand)',
      chapterTitle: 'अध्याय 2: स्वरों के स्थान, मात्राएं व बिंदु-डैश प्रणाली',
      author: 'ऋषि लाल अग्रवाल (मानक संस्करण)',
      category: 'Shorthand',
      chapterNum: 2,
      content: [
        'स्वरों का त्रिविध स्थान नियम (Three Places of Vowels): प्रत्येक रेखाक्षर के तीन स्थान होते हैं—प्रथम स्थान (रेखाक्षर के आरंभ में), द्वितीय स्थान (मध्य में) और तृतीय स्थान (अंत में)।',
        'प्रथम स्थान के स्वर: आ (गहरा बिंदु) और ऐ/ऑ (गहरा डैश) प्रथम स्थान के स्वर हैं। जब किसी शब्द का पहला स्वर प्रथम स्थान का हो, तो पूरे रेखाक्षर को कॉपी की लाइन से ऊपर (Above the Line) लिखा जाता है।',
        'द्वितीय स्थान के स्वर: ए (गहरा बिंदु) और ओ (गहरा डैश) द्वितीय स्थान के स्वर हैं। द्वितीय स्थान का स्वर होने पर रेखाक्षर को कॉपी की लाइन पर (On the Line) टिकाकर लिखा जाता है।',
        'तृतीय स्थान के स्वर: ई (गहरा बिंदु) और ऊ (गहरा डैश) तृतीय स्थान के स्वर हैं। इस स्थिति में रेखाक्षर को लाइन काटते हुए (Through the Line) लिखा जाता है।',
        'अग्रगामी रेखाक्षरों पर तीसरे स्थान का नियम: क्षैतिज रेखाक्षर (क, म, न) लाइन नहीं काट सकते, अतः उनके लिए लाइन पर ही लिखा जाता है और स्वर के अनुसार स्थिति तय होती है।',
        'स्वर लगाने का क्रम: यदि स्वर रेखाक्षर से पहले उच्चारित हो, तो उसे रेखाक्षर के बाईं या ऊपर लगाएं। यदि स्वर रेखाक्षर के बाद उच्चारित हो, तो उसे दाईं या नीचे लगाएं।'
      ]
    },
    {
      id: 'steno_ch3',
      bookTitle: 'ऋषि प्रणाली हिन्दी आशुलिपि (Rishi Pranali Shorthand)',
      chapterTitle: 'अध्याय 3: स-वृत्त, प्रारंभिक र/ल आंकड़े व गति संवर्धन',
      author: 'ऋषि लाल अग्रवाल (मानक संस्करण)',
      category: 'Shorthand',
      chapterNum: 3,
      content: [
        'स/श का छोटा वृत्त: किसी भी सरल रेखाक्षर के अंत या प्रारंभ में घड़ी की विपरीत दिशा (Anti-Clockwise) में छोटा वृत्त लगाने से स या श की ध्वनि जुड़ती है। इससे पेंसिल उठाने की आवश्यकता समाप्त हो जाती है।',
        'र का प्रारंभिक आंकड़ा: सरल रेखाक्षर के आरंभ में घड़ी की सुई की दिशा (Clockwise) में छोटा हुक लगाने पर "र" पढ़ा जाता है। जैसे: प में हुक लगाने पर "प्र", क में हुक लगाने पर "क्र"।',
        'ल का प्रारंभिक आंकड़ा: सरल रेखाक्षर के आरंभ में घड़ी की विपरीत दिशा में बड़ा हुक लगाने पर "ल" पढ़ा जाता है। जैसे: प में लगाने पर "प्ल", क में लगाने पर "क्ल"।',
        'वक्र रेखाक्षरों में आंकड़ा नियम: वक्र रेखाक्षरों (त, म, न) में वृत्त और हुक हमेशा वक्र के अंदर की ओर ही लगाए जाते हैं ताकि रेखा का संतुलन न बिगड़े।',
        'गति संवर्धन की पहली कुंजी: इन आंकड़ों के प्रयोग से शब्दों की लंबाई 70% तक घट जाती है, जिससे 80 से 100 WPM की गति आसानी से हासिल की जा सकती है।',
        'डिक्टेशन टिप: आंकड़े लगाते समय कोण न बदलें। निरंतर 5-5 पंक्तियां लिखकर अपनी गति को मापें।'
      ]
    },
    {
      id: 'steno_ch4',
      bookTitle: 'ऋषि प्रणाली हिन्दी आशुलिपि (Rishi Pranali Shorthand)',
      chapterTitle: 'अध्याय 4: अर्द्धीकरण व द्विगुणन सिद्धांत (Halving & Doubling)',
      author: 'ऋषि लाल अग्रवाल (मानक संस्करण)',
      category: 'Shorthand',
      chapterNum: 4,
      content: [
        'अर्द्धीकरण सिद्धांत (Halving Principle): जब किसी भी रेखाक्षर की सामान्य लंबाई को आधा (1/2) कर दिया जाता है, तो उसमें "त", "ट" या "द" स्वतः जुड़ जाता है।',
        'अर्द्धीकरण के व्यावहारिक उदाहरण: "क" को आधा करने पर "कत" या "कद", "प" को आधा करने पर "पत" या "पद" पढ़ा जाता है। यह सिद्धांत कोर्ट व संसद रिपोर्टिंग में अत्यंत तीव्र गति देता है।',
        'द्विगुणन सिद्धांत (Doubling Principle): जब किसी रेखाक्षर की लंबाई को सामान्य से दोगुना (2x) लंबा कर दिया जाता है, तो उसमें "तर", "दर", "टर" या "डर" जुड़ जाता है।',
        'द्विगुणन के उदाहरण: "म" को दोगुना करने पर "मातर" या "मदर", "न" को दोगुना करने पर "अंतर" या "अंदर" पढ़ा जाता है।',
        'अपवाद और सावधानियां: यदि शब्द के अंत में कोई तृतीय स्थान का स्वर आ रहा हो, तो अर्द्धीकरण का प्रयोग न करके पूर्ण रेखाक्षर लिखना चाहिए ताकि पढ़ने में भ्रम न हो।',
        'परीक्षा मानक: SSC Stenographer ग्रेड C (100 WPM) और ग्रेड D (80 WPM) के लिए इन दोनों सिद्धांतों का शत-प्रतिशत अभ्यास अनिवार्य है।'
      ]
    },
    {
      id: 'steno_ch5',
      bookTitle: 'ऋषि प्रणाली हिन्दी आशुलिपि (Rishi Pranali Shorthand)',
      chapterTitle: 'अध्याय 5: वाक्यांश, सर्वनाम संक्षेप व 100+ WPM मास्टर डिक्टेशन',
      author: 'ऋषि लाल अग्रवाल (मानक संस्करण)',
      category: 'Shorthand',
      chapterNum: 5,
      content: [
        'वाक्यांश निर्माण (Phraseography): जब दो, तीन या चार शब्दों को बिना पेंसिल उठाए एक साथ जोड़कर एक ही संकेत में लिखा जाता है, उसे वाक्यांश कहते हैं।',
        'संसदीय व कानूनी वाक्यांश: "माननीय अध्यक्ष महोदय", "इस सदन में", "मुझे यह कहना है कि", "अतः प्रार्थना है कि"—इन सभी के निश्चित वाक्यांश चिह्न हैं।',
        'सर्वनामों का संक्षेपण: "मैं", "तुम", "हम", "आप", "वह", "वे" के साथ विभक्ति चिह्न (ने, को, से, का, में, पर) जोड़कर त्वरित संकेत बनाए जाते हैं।',
        'संक्षिप्त रूप (Contractions): लंबे शब्दों जैसे "विश्वविद्यालय", "प्रजातंत्र", "सहानुभूति", "अंतर्राष्ट्रीय" के संक्षिप्त अक्षरों का प्रयोग गति को 120 WPM तक पहुंचाता है।',
        'ट्रांसक्रिप्शन की सटीकता (Transcription Accuracy): डिक्टेशन लिखने के बाद उसे टाइप करते समय वर्तनी (Spelling) और पूर्णविराम का विशेष ध्यान रखें, क्योंकि परीक्षा में इसी के अंक काटे जाते हैं।',
        'मास्टर अभ्यास संकल्प: प्रतिदिन एक संपादकीय या लोकसभा डिबेट को 80 से 100 WPM पर लिखें और तुरंत कंप्यूटर पर टाइप करके गलतियों का मिलान करें।'
      ]
    }
  ],
  'polity': [
    {
      id: 'polity_ch1',
      bookTitle: 'भारतीय राजव्यवस्था (Indian Polity - M. Laxmikanth)',
      chapterTitle: 'अध्याय 1: ऐतिहासिक पृष्ठभूमि, संविधान सभा व प्रस्तावना',
      author: 'एम. लक्ष्मीकांत (मानक सिविल सेवा संस्करण)',
      category: 'Polity',
      chapterNum: 1,
      content: [
        'कंपनी का शासन (1773-1858): 1773 का रेगुलेटिंग एक्ट भारत में ईस्ट इंडिया कंपनी के कार्यों को नियमित करने की दिशा में ब्रिटिश सरकार का पहला कदम था। इसके द्वारा बंगाल के गवर्नर को "बंगाल का गवर्नर जनरल" बनाया गया (लॉर्ड वारेन हेस्टिंग्स)।',
        '1935 का भारत शासन अधिनियम: यह भारतीय संविधान का सबसे बड़ा एकाकी स्रोत है। इसके द्वारा केंद्र में द्वैध शासन, प्रांतीय स्वायत्तता, और एक संघीय न्यायालय (Federal Court) की स्थापना की गई।',
        'संविधान सभा का गठन (नवंबर 1946): कैबिनेट मिशन योजना के तहत संविधान सभा का गठन हुआ। 9 दिसंबर 1946 को पहली बैठक हुई जिसमें डॉ. सच्चिदानंद सिन्हा अस्थायी अध्यक्ष बने और 11 दिसंबर को डॉ. राजेंद्र प्रसाद स्थायी अध्यक्ष चुने गए।',
        'प्रारूप समिति (Drafting Committee): 29 अगस्त 1947 को डॉ. बी.आर. आंबेडकर की अध्यक्षता में 7 सदस्यीय प्रारूप समिति का गठन हुआ, जिसने संविधान का अंतिम मसौदा तैयार किया।',
        'संविधान की प्रस्तावना (Preamble): 13 दिसंबर 1946 को जवाहरलाल नेहरू द्वारा पेश "उद्देश्य प्रस्ताव" पर आधारित है। 42वें संविधान संशोधन 1976 द्वारा इसमें तीन शब्द जोड़े गए: "समाजवादी", "धर्मनिरपेक्ष" और "अखंडता"।',
        'केशवानंद भारती वाद (1973): सर्वोच्च न्यायालय ने स्पष्ट किया कि प्रस्तावना संविधान का अभिन्न अंग है और इसमें अनुच्छेद 368 के तहत संशोधन किया जा सकता है, बशर्ते मूल ढांचे (Basic Structure) को नुकसान न पहुंचे।'
      ]
    },
    {
      id: 'polity_ch2',
      bookTitle: 'भारतीय राजव्यवस्था (Indian Polity - M. Laxmikanth)',
      chapterTitle: 'अध्याय 2: मूल अधिकार (Fundamental Rights - Art 12 to 35)',
      author: 'एम. लक्ष्मीकांत (मानक सिविल सेवा संस्करण)',
      category: 'Polity',
      chapterNum: 2,
      content: [
        'भाग 3 को भारत का मैग्नाकार्टा कहा जाता है। मूल संविधान में 7 मौलिक अधिकार थे, परंतु 44वें संविधान संशोधन 1978 द्वारा संपत्ति के अधिकार (अनुच्छेद 31) को हटाकर अनुच्छेद 300A के तहत विधिक अधिकार बना दिया गया।',
        'समानता का अधिकार (अनुच्छेद 14-18): अनुच्छेद 14 विधि के समक्ष समता, अनुच्छेद 15 धर्म-जाति-लिंग आधारित विभेद का प्रतिषेध, अनुच्छेद 16 लोक नियोजन में अवसर की समानता, अनुच्छेद 17 अस्पृश्यता का अंत और अनुच्छेद 18 उपाधियों का अंत करता है।',
        'स्वतंत्रता का अधिकार (अनुच्छेद 19-22): अनुच्छेद 19(1) नागरिकों को 6 लोकतांत्रिक स्वतंत्रताओं की गारंटी देता है। अनुच्छेद 21 प्राण एवं दैहिक स्वतंत्रता का संरक्षण करता है, जिसमें निजता का अधिकार (Right to Privacy - पुट्टास्वामी वाद) भी शामिल है।',
        'शोषण के विरुद्ध एवं धार्मिक स्वतंत्रता (अनुच्छेद 23-28): अनुच्छेद 23 मानव दुर्व्यापार व बंधुआ मजदूरी पर रोक लगाता है, जबकि अनुच्छेद 24 चौदह वर्ष से कम आयु के बच्चों को खतरनाक कारखानों में काम कराने पर प्रतिबंध लगाता है।',
        'संवैधानिक उपचारों का अधिकार (अनुच्छेद 32): डॉ. आंबेडकर ने इसे "संविधान का हृदय और आत्मा" कहा। इसके तहत सर्वोच्च न्यायालय 5 प्रकार की रिटें (बंदी प्रत्यक्षीकरण, परमादेश, प्रतिषेध, उत्प्रेषण, अधिकार-पृच्छा) जारी कर सकता है।',
        'राष्ट्रीय आपातकाल और मूल अधिकार: अनुच्छेद 352 लागू होने पर अनुच्छेद 20 (दोषसिद्धि के संबंध में संरक्षण) और अनुच्छेद 21 किसी भी परिस्थिति में निलंबित नहीं किए जा सकते।'
      ]
    },
    {
      id: 'polity_ch3',
      bookTitle: 'भारतीय राजव्यवस्था (Indian Polity - M. Laxmikanth)',
      chapterTitle: 'अध्याय 3: राज्य के नीति निर्देशक तत्व एवं मूल कर्तव्य (DPSP & Duties)',
      author: 'एम. लक्ष्मीकांत (मानक सिविल सेवा संस्करण)',
      category: 'Polity',
      chapterNum: 3,
      content: [
        'नीति निर्देशक तत्व (भाग 4, अनुच्छेद 36-51): ये आयरलैंड के संविधान से लिए गए हैं। इनका उद्देश्य भारत में एक कल्याणकारी राज्य (Welfare State) की स्थापना करना और सामाजिक-आर्थिक लोकतंत्र को बढ़ावा देना है।',
        'गांधीवादी सिद्धांत: अनुच्छेद 40 ग्राम पंचायतों के गठन की बात करता है, अनुच्छेद 43 कुटीर उद्योगों को बढ़ावा देता है, और अनुच्छेद 47 नशीले पेय पदार्थों व हानिकारक औषधियों पर रोक लगाने का निर्देश देता है।',
        'समान नागरिक संहिता (UCC - अनुच्छेद 44): राज्य भारत के पूरे क्षेत्र में नागरिकों के लिए एक समान नागरिक संहिता सुनिश्चित करने का प्रयास करेगा। वर्तमान में गोवा ऐसा पहला राज्य है जहां समान आचार संहिता लागू है।',
        'कार्यपालिका व न्यायपालिका का पृथक्करण (अनुच्छेद 50): लोक सेवाओं में न्यायपालिका को कार्यपालिका से पृथक रखने का प्रावधान करता है ताकि न्यायिक स्वतंत्रता अक्षुण्ण रहे।',
        'मूल कर्तव्य (भाग 4A, अनुच्छेद 51A): 42वें संविधान संशोधन 1976 द्वारा स्वर्ण सिंह समिति की सिफारिश पर 10 मूल कर्तव्य सोवियत संघ (USSR) से प्रेरित होकर जोड़े गए थे।',
        '86वां संविधान संशोधन (2002): इसके द्वारा 11वां मूल कर्तव्य जोड़ा गया, जिसके अनुसार 6 से 14 वर्ष तक के बच्चों को शिक्षा के अवसर उपलब्ध कराना माता-पिता या अभिभावक का कर्तव्य है।'
      ]
    }
  ],
  'gk': [
    {
      id: 'gk_ch1',
      bookTitle: 'सामान्य ज्ञान दिग्दर्शिका (Lucent & NCERT GK Essence)',
      chapterTitle: 'अध्याय 1: प्राचीन भारत - सिंधु सभ्यता से मौर्य साम्राज्य तक',
      author: 'राष्ट्रीय प्रतियोगी परीक्षा संकलन',
      category: 'GK & GS',
      chapterNum: 1,
      content: [
        'सिंधु घाटी सभ्यता (Indus Valley): यह एक कांस्य युगीन एवं सुनियोजित नगरीय सभ्यता थी। 1921 में रायबहादुर दयाराम साहनी ने हड़प्पा (रावी नदी) और 1922 में राखालदास बनर्जी ने मोहनजोदड़ो (सिंधु नदी) की खोज की थी।',
        'नगर योजना व मुख्य साक्ष्य: सड़कें समकोण पर काटती थीं। मोहनजोदड़ो से विशाल स्नानागार (Great Bath) व नर्तकी की कांस्य मूर्ति मिली। लोथल (गुजरात) इसका प्रमुख बंदरगाह था, जहां गोदीबाड़ा (Dockyard) के प्रमाण मिले।',
        'वैदिक सभ्यता (1500-600 ई.पू.): ऋग्वेद सबसे प्राचीन वेद है जिसमें 10 मंडल, 1028 सूक्त और 10,462 ऋचाएं हैं। प्रसिद्ध गायत्री मंत्र ऋग्वेद के तीसरे मंडल में सूर्य देवता (सविता) को समर्पित है।',
        'जैन एवं बौद्ध धर्म का उदय: महावीर स्वामी जैन धर्म के 24वें तीर्थंकर थे। गौतम बुद्ध को बोधगया में पीपल वृक्ष के नीचे ज्ञान प्राप्त हुआ और उन्होंने सारनाथ में पहला उपदेश (धर्मचक्र प्रवर्तन) पाली भाषा में दिया।',
        'मौर्य साम्राज्य (322-185 ई.पू.): चंद्रगुप्त मौर्य ने चाणक्य (विष्णुगुप्त) की सहायता से धनानंद को हराकर मौर्य वंश की नींव रखी। मेगस्थनीज की पुस्तक "इंडिका" और कौटिल्य का "अर्थशास्त्र" इस काल के प्रमुख स्रोत हैं।',
        'सम्राट अशोक एवं कलिंग युद्ध: 261 ई.पू. में कलिंग युद्ध के भारी नरसंहार के बाद अशोक ने भेरीघोष त्यागकर धम्मघोष अपनाया और बौद्ध भिक्षु उपगुप्त से बौद्ध धर्म की दीक्षा ली। अशोक के अभिलेख ब्राह्मी, खरोष्ठी और ग्रीक-अरामी लिपि में हैं।'
      ]
    },
    {
      id: 'gk_ch2',
      bookTitle: 'सामान्य ज्ञान दिग्दर्शिका (Lucent & NCERT GK Essence)',
      chapterTitle: 'अध्याय 2: मध्यकालीन भारत - दिल्ली सल्तनत व मुगल काल',
      author: 'राष्ट्रीय प्रतियोगी परीक्षा संकलन',
      category: 'GK & GS',
      chapterNum: 2,
      content: [
        'गुलाम वंश (1206-1290): कुतुबुद्दीन ऐबक ने 1206 में दिल्ली सल्तनत की स्थापना की। उसे "लाखबख्श" कहा जाता था। इल्तुतमिश ने कुतुबमीनार का निर्माण पूर्ण कराया और चांदी का टंका व तांबे का जीतल चलाया।',
        'खिलजी वंश एवं बाजार नियंत्रण: अलाउद्दीन खिलजी (1296-1316) ने घोड़ों को दागने, सैनिकों का हुलिया लिखने और मूल्य नियंत्रण (Market Regulations) की कठोर प्रणाली लागू की। उसने सीरी का किला और अलाई दरवाजा बनवाया।',
        'तुगलक वंश: मुहम्मद बिन तुगलक (1325-1351) ने राजधानी दिल्ली से दौलताबाद स्थानांतरित की और सांकेतिक मुद्रा (Token Currency) चलाई। मोरक्को का प्रसिद्ध यात्री इब्नबतूता उसी के शासनकाल में 1333 में भारत आया था (पुस्तक: रेहला)।',
        'मुगल साम्राज्य की स्थापना: बाबर ने 21 अप्रैल 1526 को पानीपत के प्रथम युद्ध में इब्राहिम लोदी को हराकर मुगल वंश की नींव रखी। बाबर ने इस युद्ध में प्रसिद्ध तुलगुमा युद्ध नीति और तोपखाने का प्रयोग किया था।',
        'अकबर का शासनकाल (1556-1605): 1556 में पानीपत के द्वितीय युद्ध में अकबर ने हेमु को पराजित किया। 1564 में जजिया कर समाप्त किया, 1582 में "दीन-ए-इलाही" की घोषणा की और मनसबदारी व्यवस्था प्रारंभ की।',
        'मुगल स्थापत्य व चित्रकला: जहांगीर का काल चित्रकला का स्वर्णकाल था, जबकि शाहजहां का काल स्थापत्य कला का स्वर्णकाल था जिसने ताजमहल, दिल्ली का लाल किला और जामा मस्जिद का निर्माण कराया।'
      ]
    }
  ],
  'science': [
    {
      id: 'sci_ch1',
      bookTitle: 'NCERT विज्ञान एवं भौतिकी (Class 10 & 12 Complete)',
      chapterTitle: 'अध्याय 1: प्रकाशिकी - परावर्तन, अपवर्तन एवं लेंस सूत्र',
      author: 'NCERT / मानक भौतिकी परिषद',
      category: 'Science',
      chapterNum: 1,
      content: [
        'प्रकाश का परावर्तन (Reflection of Light): आपतन कोण (i) हमेशा परावर्तन कोण (r) के बराबर होता है (∠i = ∠r)। आपतित किरण, परावर्तित किरण तथा आपतन बिंदु पर अभिलंब तीनों एक ही तल में होते हैं।',
        'गोलाकार दर्पण एवं फोकस दूरी: अवतल दर्पण (Concave Mirror) वास्तविक व उल्टे प्रतिबिंब बनाता है (केवल ध्रुव व फोकस के बीच सीधा आभासी)। दर्पण सूत्र: 1/f = 1/v + 1/u, जहां f = R/2 (वक्रता त्रिज्या की आधी)।',
        'अपवर्तन एवं स्नेल का नियम (Refraction & Snell’s Law): जब प्रकाश विरल माध्यम से सघन माध्यम में प्रवेश करता है, तो अभिलंब की ओर झुक जाता है। स्नेल का नियम: sin i / sin r = स्थिरांक (माध्यम का अपवर्तनांक μ)।',
        'पूर्ण आंतरिक परावर्तन (Total Internal Reflection): जब आपतन कोण का मान क्रांतिक कोण (Critical Angle) से अधिक हो जाता है, तो प्रकाश उसी माध्यम में पूर्ण परावर्तित हो जाता है। ऑप्टिकल फाइबर, हीरे का चमकना और मरीचिका इसी पर आधारित हैं।',
        'लेंस सूत्र एवं क्षमता (Lens Formula & Power): लेंस सूत्र: 1/f = 1/v - 1/u। लेंस की क्षमता P = 1 / f (मीटर में), इसका SI मात्रक डाइऑप्टर (Dioptre - D) होता है। उत्तल लेंस की क्षमता धनात्मक (+) और अवतल की ऋणात्मक (-) होती है।',
        'दृष्टि दोष एवं निवारण: निकट दृष्टि दोष (Myopia) में दूर की वस्तुएं नहीं दिखतीं—इसके निवारण हेतु अवतल लेंस (Concave) का चश्मा लगता है। दूर दृष्टि दोष (Hypermetropia) में उत्तल लेंस (Convex) का प्रयोग होता है।'
      ]
    },
    {
      id: 'sci_ch2',
      bookTitle: 'NCERT विज्ञान एवं भौतिकी (Class 10 & 12 Complete)',
      chapterTitle: 'अध्याय 2: विद्युत धारा, ओम का नियम व प्रतिरोधों का संयोजन',
      author: 'NCERT / मानक भौतिकी परिषद',
      category: 'Science',
      chapterNum: 2,
      content: [
        'विद्युत धारा (Electric Current): आवेश के प्रवाह की दर को विद्युत धारा कहते हैं (I = Q / t)। इसका SI मात्रक एम्पीयर (Ampere) है। विद्युत धारा एक अदिश राशि है और इसे एमीटर (Ammeter) द्वारा श्रेणीक्रम में मापा जाता है।',
        'विद्युत विभव एवं विभवांतर: एकांक धन आवेश को अनंत से किसी बिंदु तक लाने में किया गया कार्य विभव कहलाता है (V = W / Q)। इसका SI मात्रक वोल्ट (Volt) है और इसे वोल्टमीटर द्वारा समानांतर क्रम में मापा जाता है।',
        'ओम का नियम (Ohm’s Law, 1827): यदि किसी चालक की भौतिक अवस्थाएं (ताप, दाब) स्थिर रहें, तो उसके सिरों के बीच का विभवांतर उसमें प्रवाहित धारा के समानुपाती होता है: V = I × R, जहां R चालक का प्रतिरोध (Resistance) है।',
        'प्रतिरोध को प्रभावित करने वाले कारक: चालक का प्रतिरोध उसकी लंबाई (l) के समानुपाती, अनुप्रस्थ काट के क्षेत्रफल (A) के व्युत्क्रमानुपाती तथा पदार्थ की प्रकृति और ताप पर निर्भर करता है (R = ρ × l / A)।',
        'प्रतिरोधों का श्रेणीक्रम व समानांतर क्रम: श्रेणीक्रम (Series) में तुल्य प्रतिरोध R = R₁ + R₂ + R₃ होता है (धारा समान रहती है)। समानांतर क्रम (Parallel) में 1/R = 1/R₁ + 1/R₂ + 1/R₃ होता है (विभवांतर समान रहता है)।',
        'विद्युत धारा का तापीय प्रभाव (Joule’s Law): किसी चालक में उत्पन्न ऊष्मा H = I² × R × t होती है। विद्युत हीटर, गीजर और फ्यूज तार (टिन व सीसे का मिश्रधातु - निम्न गलनांक) इसी सिद्धांत पर कार्य करते हैं।'
      ]
    }
  ]
};

export const GlobalBookReader: React.FC<{ initialTab?: 'library' | 'voice-reader' }> = ({ initialTab = 'library' }) => {
  const [activeTab, setActiveTab] = useState<'library' | 'voice-reader'>(initialTab);
  const [selectedBookKey, setSelectedBookKey] = useState<string>('steno');
  const [currentChapterIdx, setCurrentChapterIdx] = useState<number>(0);
  const [currentPageIdx, setCurrentPageIdx] = useState<number>(0); // 0 = first 2 paras, 1 = next 2 paras, etc.
  
  // Dynamic World Books loaded from server
  const [dynamicChapters, setDynamicChapters] = useState<Record<string, BookChapter[]>>({});
  const [worldSearchQuery, setWorldSearchQuery] = useState('');
  const [isSearchingWorld, setIsSearchingWorld] = useState(false);
  const [searchStatus, setSearchStatus] = useState<string | null>(null);

  const [fontSize, setFontSize] = useState<number>(17);
  const [theme, setTheme] = useState<'dark' | 'sepia' | 'oled'>('dark');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);

  // Article Voice Reader custom text
  const [customArticleText, setCustomArticleText] = useState(
    'यहाँ कोई भी समाचार, संपादकीय लेख, या पुस्तक का अंश पेस्ट करें और "आर्टिकल वॉइस रीडर" बटन दबाकर स्पष्ट हिन्दी या अंग्रेजी आवाज में सुनें। यह फीचर आशुलिपि (Steno) डिक्टेशन और रिवीजन दोनों के लिए अत्यंत उपयोगी है।'
  );

  // Determine current active chapters list
  const activeBookChapters: BookChapter[] = dynamicChapters[selectedBookKey] || curatedLibrary[selectedBookKey] || curatedLibrary['steno'];
  const activeChapter: BookChapter = activeBookChapters[currentChapterIdx] || activeBookChapters[0] || {
    id: 'default',
    bookTitle: 'Hans Compain Digital Library',
    chapterTitle: 'अध्याय 1: अध्ययन सामग्री',
    author: 'Hans Compain Press',
    category: 'Study',
    chapterNum: 1,
    content: ['अध्ययन सामग्री लोड हो रही है...']
  };

  // Pagination within the chapter: 2 paragraphs per page
  const PARAS_PER_PAGE = 2;
  const totalPages = Math.max(1, Math.ceil(activeChapter.content.length / PARAS_PER_PAGE));
  const effectivePageIdx = Math.min(currentPageIdx, totalPages - 1);
  const visibleParagraphs = activeChapter.content.slice(
    effectivePageIdx * PARAS_PER_PAGE,
    (effectivePageIdx + 1) * PARAS_PER_PAGE
  );

  const handleSearchWorldBooks = async (queryText?: string, targetChapter = 1) => {
    const q = (queryText || worldSearchQuery).trim();
    if (!q) return;
    setIsSearchingWorld(true);
    setSearchStatus(`"${q}" का अध्याय ${targetChapter} तैयार किया जा रहा है...`);

    try {
      const res = await fetch('/api/books/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, chapter: targetChapter })
      });

      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.content) && data.content.length > 0) {
          const fetchedChapter: BookChapter = {
            id: `dyn_${Date.now()}_${targetChapter}`,
            bookTitle: data.bookTitle || q,
            chapterTitle: data.chapterTitle || `अध्याय ${targetChapter}: विस्तृत विश्लेषण`,
            author: data.author || 'Hans Compain Open Library Edition',
            category: data.category || 'Global Book',
            chapterNum: targetChapter,
            content: data.content
          };

          const key = `world_${q.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
          setDynamicChapters(prev => {
            const existing = prev[key] || [];
            // Replace or append chapter
            const filtered = existing.filter(c => c.chapterNum !== targetChapter);
            const updated = [...filtered, fetchedChapter].sort((a, b) => a.chapterNum - b.chapterNum);
            return { ...prev, [key]: updated };
          });

          setSelectedBookKey(key);
          const updatedList = (dynamicChapters[key] || []).filter(c => c.chapterNum !== targetChapter);
          const newIdx = [...updatedList, fetchedChapter].sort((a, b) => a.chapterNum - b.chapterNum).findIndex(c => c.chapterNum === targetChapter);
          setCurrentChapterIdx(newIdx !== -1 ? newIdx : 0);
          setCurrentPageIdx(0);
          setSearchStatus(null);
          setIsSearchingWorld(false);
          recordStudyActivity('Smart Library', fetchedChapter.bookTitle, fetchedChapter.chapterTitle, 95);
          return;
        }
      }
    } catch (e) {
      console.warn('World book synthesis error:', e);
    }

    setSearchStatus('ऑफलाइन मोड: मानक संस्करण प्रदर्शित किया जा रहा है।');
    setIsSearchingWorld(false);
    setTimeout(() => setSearchStatus(null), 3000);
  };

  const handleNextPage = () => {
    if (effectivePageIdx < totalPages - 1) {
      // Turn to next page in same chapter
      setCurrentPageIdx(effectivePageIdx + 1);
      if (isPlayingAudio) {
        stopNaturalSpeech();
        setIsPlayingAudio(false);
      }
    } else if (currentChapterIdx < activeBookChapters.length - 1) {
      // Turn to next chapter
      setCurrentChapterIdx(currentChapterIdx + 1);
      setCurrentPageIdx(0);
      if (isPlayingAudio) {
        stopNaturalSpeech();
        setIsPlayingAudio(false);
      }
    } else {
      // Need next chapter from server
      const nextChNum = (activeChapter.chapterNum || activeBookChapters.length) + 1;
      handleSearchWorldBooks(activeChapter.bookTitle, nextChNum);
    }
  };

  const handlePrevPage = () => {
    if (effectivePageIdx > 0) {
      setCurrentPageIdx(effectivePageIdx - 1);
      if (isPlayingAudio) {
        stopNaturalSpeech();
        setIsPlayingAudio(false);
      }
    } else if (currentChapterIdx > 0) {
      const prevChIdx = currentChapterIdx - 1;
      setCurrentChapterIdx(prevChIdx);
      const prevCh = activeBookChapters[prevChIdx];
      const prevTotalPages = Math.ceil(prevCh.content.length / PARAS_PER_PAGE);
      setCurrentPageIdx(Math.max(0, prevTotalPages - 1));
      if (isPlayingAudio) {
        stopNaturalSpeech();
        setIsPlayingAudio(false);
      }
    }
  };

  const toggleSpeech = (textToSpeak?: string) => {
    if (isPlayingAudio) {
      stopNaturalSpeech();
      setIsPlayingAudio(false);
    } else {
      const text = textToSpeak || `${activeChapter.chapterTitle}. ${visibleParagraphs.join(' ')}`;
      setIsPlayingAudio(true);
      playNaturalSpeech(text, () => setIsPlayingAudio(false));
    }
  };

  const themeClasses = {
    dark: 'bg-[#091122] text-slate-100 border-slate-800',
    sepia: 'bg-[#1E1B18] text-[#E0D7C6] border-[#38332C]',
    oled: 'bg-[#000000] text-slate-100 border-slate-900'
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4 animate-fade-in pb-12 text-white">
      {/* Search Bar & Mode Switcher */}
      <div className="bg-[#091122] border-2 border-emerald-500/40 rounded-3xl p-4 sm:p-6 space-y-4 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-400" />
            <h1 className="text-lg sm:text-2xl font-black font-hindi-title text-white">
              स्मार्ट ग्लोबल लाइब्रेरी (Full-Page Book Reader)
            </h1>
          </div>

          <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0">
            <button
              onClick={() => setActiveTab('library')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'library' ? 'bg-emerald-600 text-slate-950 font-black shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              📚 ऑल बुक्स फुल-पेज
            </button>
            <button
              onClick={() => setActiveTab('voice-reader')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'voice-reader' ? 'bg-amber-500 text-slate-950 font-black shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              📢 आर्टिकल वाइस रीडर
            </button>
          </div>
        </div>

        {activeTab === 'library' && (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={worldSearchQuery}
                  onChange={(e) => setWorldSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearchWorldBooks();
                  }}
                  placeholder="दुनिया की कोई भी पुस्तक खोजें (उदा: ऋषि प्रणाली, M. Laxmikanth, Lucent GK, NCERT Science, गोदान)..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-850 rounded-2xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                onClick={() => handleSearchWorldBooks()}
                disabled={isSearchingWorld || !worldSearchQuery.trim()}
                className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-950 font-black text-xs sm:text-sm cursor-pointer shadow-lg flex items-center justify-center gap-1.5 shrink-0"
              >
                {isSearchingWorld ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                <span>{isSearchingWorld ? 'लोड हो रहा है...' : 'खोजें व पढ़ें'}</span>
              </button>
            </div>

            {searchStatus && (
              <div className="p-2.5 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs text-emerald-200 text-center font-bold">
                {searchStatus}
              </div>
            )}
          </div>
        )}
      </div>

      {activeTab === 'library' ? (
        <>
          {/* Quick Book Category Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { key: 'steno', title: 'ऋषि प्रणाली आशुलिपि', category: 'Shorthand', author: 'ऋषि लाल अग्रवाल' },
              { key: 'polity', title: 'भारतीय राजव्यवस्था', category: 'Polity', author: 'एम. लक्ष्मीकांत' },
              { key: 'gk', title: 'सामान्य ज्ञान दिग्दर्शिका', category: 'GK & GS', author: 'Lucent & NCERT' },
              { key: 'science', title: 'NCERT विज्ञान व भौतिकी', category: 'Science', author: 'NCERT मानक' }
            ].map((b) => (
              <button
                key={b.key}
                onClick={() => {
                  if (isPlayingAudio) {
                    stopNaturalSpeech();
                    setIsPlayingAudio(false);
                  }
                  setSelectedBookKey(b.key);
                  setCurrentChapterIdx(0);
                  setCurrentPageIdx(0);
                }}
                className={`p-3 rounded-2xl border text-left text-xs transition-all cursor-pointer ${
                  selectedBookKey === b.key
                    ? 'bg-emerald-600/20 border-emerald-400 text-white font-bold shadow-lg ring-1 ring-emerald-400/40'
                    : 'bg-slate-950 border-slate-850 text-slate-400 hover:bg-slate-900'
                }`}
              >
                <div className="text-[10px] text-cyan-400 uppercase tracking-wider mb-0.5 truncate">{b.category} • {b.author}</div>
                <div className="line-clamp-1 font-bold">{b.title}</div>
              </button>
            ))}
          </div>

          {/* Chapter Selector Tabs for Current Book */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            <span className="text-[11px] font-bold text-slate-400 shrink-0 mr-1 flex items-center gap-1">
              <Bookmark className="w-3.5 h-3.5 text-emerald-400" />
              <span>अध्याय सूची:</span>
            </span>
            {activeBookChapters.map((ch, idx) => (
              <button
                key={ch.id || idx}
                onClick={() => {
                  setCurrentChapterIdx(idx);
                  setCurrentPageIdx(0);
                  if (isPlayingAudio) {
                    stopNaturalSpeech();
                    setIsPlayingAudio(false);
                  }
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  currentChapterIdx === idx
                    ? 'bg-emerald-500 text-slate-950 font-black shadow'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-850 border border-slate-800'
                }`}
              >
                अध्याय {ch.chapterNum || idx + 1}
              </button>
            ))}
          </div>

          {/* Full-Page Book Reader Display with Page-by-Page Reading */}
          <div className={`p-5 sm:p-8 rounded-3xl border-2 shadow-2xl transition-all space-y-5 min-h-[520px] flex flex-col justify-between ${themeClasses[theme]}`}>
            
            {/* Top Toolbar */}
            <div className="border-b border-slate-800 pb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400">
                  {activeChapter.bookTitle} • {activeChapter.author}
                </span>
                <h2 className="text-base sm:text-xl font-black mt-1 leading-snug">
                  {activeChapter.chapterTitle}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFontSize(Math.max(14, fontSize - 1))}
                  className="p-1.5 px-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 cursor-pointer hover:bg-slate-800"
                  title="फॉन्ट छोटा करें"
                >
                  A-
                </button>
                <button
                  onClick={() => setFontSize(Math.min(26, fontSize + 1))}
                  className="p-1.5 px-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 cursor-pointer hover:bg-slate-800"
                  title="फॉन्ट बड़ा करें"
                >
                  A+
                </button>
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'sepia' : theme === 'sepia' ? 'oled' : 'dark')}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 cursor-pointer hover:bg-slate-800"
                  title="थीम बदलें (Dark / Sepia / OLED)"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => toggleSpeech()}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-lg ${
                    isPlayingAudio
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black'
                  }`}
                >
                  {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isPlayingAudio ? 'रोकें' : 'बोलकर सुनें 📢'}</span>
                </button>
              </div>
            </div>

            {/* Distinct Paragraph Content for the current Page */}
            <div className="space-y-5 leading-relaxed font-sans flex-1" style={{ fontSize: `${fontSize}px` }}>
              {visibleParagraphs.map((para, pIdx) => (
                <p key={pIdx} className="leading-loose text-justify">
                  {para}
                </p>
              ))}
            </div>

            {/* Page & Chapter Navigation Bar */}
            <div className="border-t border-slate-850 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
              
              {/* Previous Page Button */}
              <button
                onClick={handlePrevPage}
                disabled={effectivePageIdx === 0 && currentChapterIdx === 0}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 disabled:opacity-30 border border-slate-700 text-slate-200 font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <ChevronLeft className="w-4 h-4 text-emerald-400" />
                <span>पिछला पेज (Previous)</span>
              </button>

              {/* Exact Page Indicator */}
              <div className="flex items-center gap-2 bg-slate-950 px-4 py-1.5 rounded-full border border-slate-800 font-bold text-slate-300">
                <span className="text-emerald-400 font-black">पेज {effectivePageIdx + 1} / {totalPages}</span>
                <span className="text-slate-600">•</span>
                <span className="text-cyan-400 font-black">अध्याय {activeChapter.chapterNum || currentChapterIdx + 1}</span>
              </div>

              {/* Next Page / Next Chapter Button */}
              <button
                onClick={handleNextPage}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black flex items-center justify-center gap-1.5 cursor-pointer shadow-lg transition-all"
              >
                <span>
                  {effectivePageIdx < totalPages - 1
                    ? 'अगला पेज (Next Page →)'
                    : `अगला अध्याय (Chapter ${(activeChapter.chapterNum || currentChapterIdx + 1) + 1} →)`}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      ) : (
        /* ARTICLE VOICE READER 📢 */
        <div className="bg-[#091122] border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-amber-400" />
                <span>आर्टिकल वाइस रीडर 📢 (Smart Editorial Voice Reader)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                कोई भी समाचार, संपादकीय लेख या नोट्स यहाँ पेस्ट करें और पसंदीदा गति पर सुनें।
              </p>
            </div>

            <div className="flex items-center gap-2">
              {[0.8, 1.0, 1.2, 1.4].map(r => (
                <button
                  key={r}
                  onClick={() => setSpeechRate(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                    speechRate === r ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-950 text-slate-400'
                  }`}
                >
                  {r}x
                </button>
              ))}
            </div>
          </div>

          <textarea
            rows={8}
            value={customArticleText}
            onChange={(e) => setCustomArticleText(e.target.value)}
            placeholder="सुनने के लिए यहाँ कोई भी आर्टिकल या पैराग्राफ पेस्ट करें..."
            className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-sm sm:text-base text-white focus:outline-none focus:border-amber-500 leading-relaxed"
          />

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setCustomArticleText('')}
              className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
            >
              साफ़ करें (Clear)
            </button>
            <button
              onClick={() => toggleSpeech(customArticleText)}
              className={`px-6 py-3 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 cursor-pointer shadow-xl ${
                isPlayingAudio ? 'bg-rose-600 text-white animate-pulse' : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              }`}
            >
              {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlayingAudio ? 'आर्टिकल वाचन रोकें' : 'आर्टिकल बोलकर सुनाएं 📢'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalBookReader;
