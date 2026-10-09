import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Camera,
  Sparkles,
  FileText,
  Volume2,
  Trash2,
  BookOpen,
  Compass,
  Upload,
  CheckCircle2,
  HelpCircle,
  ChevronRight,
  ArrowLeft,
  Layers,
  Zap,
  Check,
  Mic,
  MicOff,
  Flag
} from 'lucide-react';
import { recordStudyActivity } from '../firebase';
import { playNaturalSpeech, stopNaturalSpeech } from '../utils/naturalSpeech';
import { askHansCompainAI } from '../utils/aiClientFallback';
import { LucentTextFormatter } from './LucentTextFormatter';

export interface AttachedFile {
  id: string;
  name: string;
  type: string;
  previewUrl: string;
  base64: string;
  sizeKb: number;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  imagePreview?: string;
  attachedFiles?: AttachedFile[];
  modeTag?: string;
}

interface SampleHandwrittenNote {
  id: string;
  title: string;
  subject: string;
  badge: string;
  extractedText: string;
  keyFormulas: string[];
  flashcards: { q: string; a: string }[];
  quiz: { q: string; options: string[]; ans: number; exp: string }[];
}

const sampleHandwrittenNotes: SampleHandwrittenNote[] = [
  {
    id: 'note-steno',
    title: 'ऋषि प्रणाली आशुलिपि (Steno Hooks & Halving Rules) - हस्तलिखित पन्ना',
    subject: 'आशुलिपि (Shorthand)',
    badge: '80-100 WPM NOTES',
    extractedText:
      '• प्रारंभिक हुक नियम: सरल रेखाक्षरों में बाईं (घड़ी की विपरीत) दिशा से छोटा हुक जोड़ने पर "र" (R) पढ़ा जाता है तथा दाईं दिशा में छोटा हुक जोड़ने पर "ल" (L) पढ़ा जाता है।\n• अर्द्धीकरण सिद्धांत (Halving Principle): किसी भी रेखाक्षर की सामान्य लंबाई को आधा (1/2) कर देने से उसमें "त", "ट" या "द" जुड़ जाता है।\n• द्विगुणन सिद्धांत (Doubling Principle): रेखाक्षर की लंबाई दोगुनी (2x) करने पर उसमें "तर", "दर" या "टर" जुड़ जाता है।',
    keyFormulas: [
      'प्रारंभिक बायां हुक = र (R) हुक',
      'प्रारंभिक दायां हुक = ल (L) हुक',
      'रेखाक्षर × 1/2 लंबाई = + त / ट / द (Halving)',
      'रेखाक्षर × 2 लंबाई = + तर / दर / टर (Doubling)'
    ],
    flashcards: [
      { q: 'सरल रेखाक्षर की लंबाई आधी (1/2) करने पर उसमें क्या जुड़ता है?', a: 'अर्द्धीकरण नियम के अनुसार "त", "ट" या "द" जुड़ जाता है।' },
      { q: 'रेखाक्षर को दोगुना (2x) लंबा करने पर क्या पढ़ा जाता है?', a: 'द्विगुणन नियम से "तर", "दर" या "टर" जुड़ जाता है।' }
    ],
    quiz: [
      {
        q: 'ऋषि प्रणाली में किसी रेखाक्षर को आधा (Half) करने के नियम को क्या कहते हैं?',
        options: ['द्विगुणन सिद्धांत', 'अर्द्धीकरण सिद्धांत (Halving)', 'वृत्त नियम', 'लोप नियम'],
        ans: 1,
        exp: 'रेखाक्षर को आधा करने से त/ट/द जुड़ता है, इसे अर्द्धीकरण सिद्धांत (Halving Principle) कहते हैं।'
      },
      {
        q: 'रेखाक्षर की लंबाई दोगुनी (Double) करने पर कौन-सी ध्वनि जुड़ती है?',
        options: ['क / ख', 'त / द', 'तर / दर / टर', 'प / फ'],
        ans: 2,
        exp: 'द्विगुणन सिद्धांत के अनुसार रेखाक्षर को दोगुना करने पर तर/दर/टर जुड़ता है।'
      }
    ]
  },
  {
    id: 'note-physics',
    title: 'प्रकाशिकी एवं विद्युत धारा (Optics & Electricity) - क्लास नोट्स',
    subject: 'भौतिक विज्ञान (Physics)',
    badge: 'BOARD & SSC SCIENCE',
    extractedText:
      '• दर्पण सूत्र: गोलाकार दर्पण में वस्तु की दूरी (u), प्रतिबिंब की दूरी (v) तथा फोकस दूरी (f) में संबंध: 1/v + 1/u = 1/f होता है।\n• लेंस की क्षमता: P = 1 / f (मीटर में), मात्रक = डाइऑप्टर (D)। उत्तल लेंस की क्षमता धनात्मक (+) और अवतल लेंस की ऋणात्मक (-) होती है।\n• ओम का नियम: नियत ताप पर V = I × R तथा श्रेणीक्रम संयोजन में तुल्य प्रतिरोध R = R₁ + R₂ + R₃ होता है।',
    keyFormulas: [
      'दर्पण सूत्र: 1/v + 1/u = 1/f',
      'लेंस सूत्र: 1/v - 1/u = 1/f',
      'लेंस क्षमता: P = 1/f(m) Dioptre',
      'श्रेणीक्रम प्रतिरोध: R_eq = R₁ + R₂ + R₃'
    ],
    flashcards: [
      { q: 'उत्तल लेंस और अवतल लेंस की क्षमता का चिन्ह क्या होता है?', a: 'उत्तल लेंस की क्षमता धनात्मक (+) और अवतल लेंस की ऋणात्मक (-) होती है।' },
      { q: 'लेंस सूत्र और दर्पण सूत्र में मुख्य अंतर क्या है?', a: 'दर्पण सूत्र में 1/v + 1/u = 1/f (+ चिन्ह) और लेंस सूत्र में 1/v - 1/u = 1/f (- चिन्ह) होता है।' }
    ],
    quiz: [
      {
        q: '50 सेमी फोकस दूरी वाले उत्तल लेंस की क्षमता (Power) कितनी होगी?',
        options: ['+2 D', '-2 D', '+0.5 D', '-0.5 D'],
        ans: 0,
        exp: 'P = 100 / f(cm) = 100 / 50 = +2 डाइऑप्टर (+2 D)।'
      }
    ]
  },
  {
    id: 'note-history',
    title: 'भारतीय राष्ट्रीय आंदोलन (1885–1947) - हस्तलिखित टाइमलाइन',
    subject: 'इतिहास व जीके (History)',
    badge: 'SSC & BPSC GK',
    extractedText:
      '• 1885 ई.: भारतीय राष्ट्रीय कांग्रेस की स्थापना (मुंबई, ए.ओ. ह्यूम द्वारा, प्रथम अध्यक्ष: डब्ल्यू.सी. बनर्जी)।\n• 1905 ई.: बंगाल विभाजन (लॉर्ड कर्जन के समय) एवं स्वदेशी आंदोलन की शुरुआत।\n• 13 अप्रैल 1919: जालियाँवाला बाग हत्याकांड (अमृतसर) एवं रौलेट एक्ट विरोध।\n• 12 मार्च 1930: महात्मा गांधी द्वारा साबरमती आश्रम से दांडी मार्च (सविनय अवज्ञा आंदोलन)।',
    keyFormulas: [
      '1885: कांग्रेस स्थापना (W.C. Bonnerjee)',
      '1905: बंगाल विभाजन (Lord Curzon)',
      '1919: जालियाँवाला बाग व खिलाफत आंदोलन',
      '1930: दांडी मार्च व सविनय अवज्ञा आंदोलन'
    ],
    flashcards: [
      { q: 'भारतीय राष्ट्रीय कांग्रेस के प्रथम अध्यक्ष कौन थे?', a: 'व्योमेश चंद्र बनर्जी (W.C. Bonnerjee) - 1885 मुंबई अधिवेशन।' },
      { q: 'दांडी यात्रा कब और कहाँ से प्रारंभ हुई थी?', a: '12 मार्च 1930 को साबरमती आश्रम (अहमदाबाद) से।' }
    ],
    quiz: [
      {
        q: '1905 में बंगाल विभाजन किस वायसराय के कार्यकाल में हुआ था?',
        options: ['लॉर्ड डलहौजी', 'लॉर्ड कर्जन', 'लॉर्ड रिपन', 'लॉर्ड माउंटबेटन'],
        ans: 1,
        exp: '1905 में बंगाल का विभाजन लॉर्ड कर्जन द्वारा किया गया था।'
      }
    ]
  }
];

interface FeatureGuideItem {
  id: string;
  viewId: string;
  location: 'home' | 'drawer' | 'launcher' | 'header';
  name: string;
  badge: string;
  summary: string;
  steps: [string, string, string];
}

const appFeatureDirectory: FeatureGuideItem[] = [
  {
    id: 'f-steno',
    viewId: 'steno-master',
    location: 'home',
    name: '✍️ ALL STENOGRAPHER • सम्पूर्ण आशुलिपि',
    badge: 'HOME BANNER & 3-LINE MENU',
    summary: '80/100 WPM ऑडियो डिक्टेशन, ऋषि प्रणाली शब्द-चिह्न, तथा फुल-स्क्रीन (Full-Screen) ट्रांसक्रिप्शन व सटीकता जांच बोर्ड।',
    steps: [
      'Step 1: होमपेज के नीले कैप्सूल बैनर या 3-लाइन मेनू में "All Stenographer" पर क्लिक करें।',
      'Step 2: गति (60/80/100 WPM), गद्यांश या "⛶ फुल-स्क्रीन प्रैक्टिस बोर्ड" चुनें।',
      'Step 3: ऑडियो सुनकर शॉर्टहैंड लिखें, फिर टाइप करके लाइव WPM और त्रुटि प्रतिशत (Error %) जांचें।'
    ]
  },
  {
    id: 'f-board',
    viewId: 'board-exam',
    location: 'home',
    name: '🎓 बोर्ड परीक्षा (10th & 12th Board Hub)',
    badge: 'HOME GRID CARD #8',
    summary: 'बिहार बोर्ड (BSEB), यूपी बोर्ड (UPMSP) और CBSE के लिए 3-चरण स्मार्ट अध्ययन व सिंगल टेस्ट बॉक्स।',
    steps: [
      'Step 1: अपना बोर्ड (BSEB/UPMSP/CBSE) और कक्षा (10वीं या 12वीं) चुनें।',
      'Step 2: विषय (Science, Maths, Physics, आदि) और रिसोर्स (OMR टेस्ट, टॉपर नोट्स, या सब्जेक्टिव प्रश्न) चुनें।',
      'Step 3: लाइव प्रश्न हल करें, व्याख्या सुनें और स्कोर ट्रैक करें।'
    ]
  },
  {
    id: 'f-ca',
    viewId: 'ca',
    location: 'home',
    name: '📰 करंट अफेयर्स 2026 (Daily 10 Facts & Quiz)',
    badge: 'HOME GRID CARD #1',
    summary: 'डेली 10 गोल्डन वन-लाइनर्स, राष्ट्रीय/अंतर्राष्ट्रीय समाचार विश्लेषण और लाइव करंट अफेयर्स एमसीक्यू टेस्ट।',
    steps: [
      'Step 1: होमपेज पर "करंट अफेयर्स 2026" कार्ड पर क्लिक करें।',
      'Step 2: श्रेणी (राष्ट्रीय, आर्थिक, विज्ञान, खेल) चुनें या डेली 10 गोल्डन फैक्ट्स पढ़ें व सुनें।',
      'Step 3: "लाइव क्विज़ मोड" टैब में जाकर आज के करंट अफेयर्स प्रश्नों का टेस्ट दें।'
    ]
  },
  {
    id: 'f-science',
    viewId: 'science-lab',
    location: 'home',
    name: '🔬 इंटरएक्टिव साइंस लैब (Circuit, Lens & Periodic)',
    badge: 'HOME GRID CARD #4',
    summary: 'ओम का नियम सर्किट सिमुलेटर, उत्तल/अवतल लेंस रे-डायग्राम, pH स्केल और 118 तत्वों का 3D परमाणु मॉडल।',
    steps: [
      'Step 1: साइंस लैब खोलें और 4 प्रयोगशालाओं (सर्किट, ऑप्टिक्स लेंस, pH लैब, आवर्त सारणी) में से एक चुनें।',
      'Step 2: स्लाइडर से वोल्टेज, प्रतिरोध, वस्तु दूरी (u) या pH मान बदलें।',
      'Step 3: लाइव ग्राफ/किरण आरेख देखें और फॉर्मूला कैलकुलेटर से गणना करें।'
    ]
  },
  {
    id: 'f-reels',
    viewId: 'edu-reels',
    location: 'drawer',
    name: '🎬 एजु-रील्स (Auto-Generated Study Shorts)',
    badge: '3-LINE MENU',
    summary: 'आप जो भी पढ़ते हैं या टेस्ट देते हैं, उसकी गतिविधि से अपने आप शॉर्ट रील्स बनती हैं और ऑटो-प्ले होती हैं।',
    steps: [
      'Step 1: 3-लाइन मेनू से "एजु-रील्स (Edu Shorts)" खोलें।',
      'Step 2: अपनी अध्ययन गतिविधि से बनी रील्स या बिल्ट-इन शैक्षणिक रील्स देखें।',
      'Step 3: "Auto-Play ON" रखें जिससे हर 10 सेकंड में अगली रील स्वतः चलती और बोलती रहे।'
    ]
  },
  {
    id: 'f-library',
    viewId: 'book-reader',
    location: 'drawer',
    name: '📖 स्मार्ट लाइब्रेरी (All World Books & Voice Reader)',
    badge: '3-LINE MENU & APPS',
    summary: 'दुनिया की किसी भी पुस्तक (NCERT, लक्ष्मीकांत, लुसेंट, साहित्य) को खोजकर अध्यायवार पढ़ने और सुनने का केंद्र।',
    steps: [
      'Step 1: 3-लाइन मेनू में "स्मार्ट लाइब्रेरी (All World Books)" खोलें।',
      'Step 2: बिल्ट-इन पुस्तक चुनें या सर्च बॉक्स में दुनिया की किसी भी किताब का नाम टाइप करें।',
      'Step 3: "📖 पूरी किताब पढ़ें" पर क्लिक करके सभी अध्याय पढ़ें या "📢 आर्टिकल वाइस रीडर" से सुनें।'
    ]
  },
  {
    id: 'f-bharati',
    viewId: 'bharati-bhawan',
    location: 'launcher',
    name: '📘 भारती भवन बुक्स & के.सी. सिन्हा टेस्ट हब',
    badge: 'APPS LAUNCHER HUB',
    summary: 'कक्षा 9वीं से 12वीं भारती भवन (K.C. Sinha गणित व विज्ञान) के अध्यायवार नोट्स, सूत्र और टेस्ट।',
    steps: [
      'Step 1: होमपेज पर "Apps" आइकन दबाकर "भारती भवन बुक्स" चुनें।',
      'Step 2: कक्षा (9th/10th/11th/12th) और विषय (गणित, भौतिकी, रसायन, जीव विज्ञान) चुनें।',
      'Step 3: अध्याय के मुख्य सूत्र पढ़ें और 5-प्रश्न का त्वरित टेस्ट हल करें।'
    ]
  },
  {
    id: 'f-sarkari',
    viewId: 'sarkari',
    location: 'launcher',
    name: '🏛️ सरकारी रिजल्ट व पात्रता जांच (Eligibility Checker)',
    badge: 'APPS LAUNCHER HUB',
    summary: 'अपनी आयु और योग्यता डालकर जानें कि आप किन-किन सरकारी भर्तियों (SSC, Railway, Police, BPSC) के लिए पात्र हैं।',
    steps: [
      'Step 1: Apps Launcher से "सरकारी रिजल्ट व पात्रता" खोलें।',
      'Step 2: अपनी आयु (Age), शिक्षा (10th/12th/Graduate) और श्रेणी चुनें।',
      'Step 3: पात्र परीक्षाओं की सूची, पद संख्या और आधिकारिक सिलेबस देखें।'
    ]
  }
];

export const AIDoubtSolverView: React.FC<{
  initialMode?: 'chat' | 'ocr' | 'app-guide';
  initialQuery?: string;
  onNavigate?: (viewId: string) => void;
}> = ({ initialMode = 'chat', initialQuery = '', onNavigate }) => {
  // Dedicated OCR Multi-Step State
  const [ocrStep, setOcrStep] = useState<1 | 2 | 3>(1);
  const [selectedNote, setSelectedNote] = useState<SampleHandwrittenNote>(sampleHandwrittenNotes[0]);
  const [customScannedText, setCustomScannedText] = useState<string>('');
  const [customImagePreview, setCustomImagePreview] = useState<string | null>(null);
  const [isScanningImage, setIsScanningImage] = useState<boolean>(false);
  const [ocrToolTab, setOcrToolTab] = useState<'flashcards' | 'quiz'>('flashcards');
  const [ocrQuizAnswers, setOcrQuizAnswers] = useState<Record<number, number>>({});

  // Dedicated App Guide Multi-Step State
  const [guideStep, setGuideStep] = useState<1 | 2 | 3>(1);
  const [guideLocationFilter, setGuideLocationFilter] = useState<'all' | 'home' | 'drawer' | 'launcher'>('all');
  const [selectedGuideFeature, setSelectedGuideFeature] = useState<FeatureGuideItem>(appFeatureDirectory[0]);

  // Dedicated Chat State (Only used when in Chat mode)
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const ocrFileInputRef = useRef<HTMLInputElement | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'नमस्ते! मैं HANS COMPAIN AI ट्यूटर हूँ। आप मुझसे गणित, विज्ञान, जीके, इंग्लिश ग्रामर या आशुलिपि (Shorthand) का कोई भी प्रश्न पूछ सकते हैं।'
    }
  ]);

  useEffect(() => {
    if (initialQuery && initialQuery.trim() && initialMode === 'chat') {
      handleSendQuery(initialQuery.trim());
    }
  }, [initialQuery]);

  const speakText = (text: string) => {
    playNaturalSpeech(text);
  };

  // Handle Photo Upload in Dedicated OCR Studio
  const handleOcrFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setCustomImagePreview(dataUrl);
      setIsScanningImage(true);
      setOcrStep(2);

      try {
        const res = await fetch('/api/ai/solve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: 'इस फोटो/हस्तलिखित नोट्स में लिखे सभी शब्दों, सूत्रों और बिंदुओं को साफ-साफ डिजिटल हिंदी/अंग्रेजी टेक्स्ट में बदलें (OCR) और मुख्य परीक्षा बिंदु बताएं।',
            imageBase64: dataUrl,
            mode: 'ocr'
          })
        });
        const data = await res.json();
        const extracted = data.answer || data.solution || '';
        const structured = data.structuredOcr;
        
        if (structured && structured.extractedText) {
          const dynamicNote: SampleHandwrittenNote = {
            id: `custom-${Date.now()}`,
            title: structured.title || 'सफलतापूर्वक स्कैन किया गया पन्ना (My Analyzed Page)',
            subject: structured.subject || 'हस्तलिखित नोट्स / स्कैन दस्तावेज',
            badge: 'LIVE AI ANALYSIS',
            extractedText: structured.extractedText,
            keyFormulas: Array.isArray(structured.keyFormulas) && structured.keyFormulas.length > 0
              ? structured.keyFormulas
              : ['स्कैन किए गए पन्ने के मुख्य बिंदु व सूत्र'],
            flashcards: Array.isArray(structured.flashcards) && structured.flashcards.length > 0
              ? structured.flashcards
              : [
                  {
                    q: 'स्कैन किए गए पन्ने की मुख्य अवधारणा क्या है?',
                    a: structured.extractedText.slice(0, 150) + '...'
                  }
                ],
            quiz: Array.isArray(structured.quiz) && structured.quiz.length > 0
              ? structured.quiz
              : [
                  {
                    q: 'उपरोक्त स्कैन किए गए पन्ने में प्रस्तुत मुख्य विषय-वस्तु क्या है?',
                    options: ['शैक्षणिक सूत्र व सिद्धांत', 'अन्य सामान्य ज्ञान', 'अपठनीय मुद्रण', 'रफ लेखन'],
                    ans: 0,
                    exp: 'AI विज़न स्कैनर ने आपकी फोटो का सटीक विश्लेषण किया है।'
                  }
                ]
          };
          setSelectedNote(dynamicNote);
          setCustomScannedText(structured.extractedText);
        } else if (extracted) {
          const cleanLines = extracted.split('\n').map((l: string) => l.trim()).filter(Boolean);
          const dynamicNote: SampleHandwrittenNote = {
            id: `custom-${Date.now()}`,
            title: 'सफलतापूर्वक स्कैन किया गया पन्ना (My Analyzed Page)',
            subject: 'हस्तलिखित नोट्स / स्कैन दस्तावेज',
            badge: 'LIVE AI ANALYSIS',
            extractedText: extracted,
            keyFormulas: [
              cleanLines[0] ? cleanLines[0].slice(0, 70) : 'विशेष सूत्र/सिद्धांत बिंदु 1',
              cleanLines[1] ? cleanLines[1].slice(0, 70) : 'विशेष सूत्र/सिद्धांत बिंदु 2',
              'पिटमैन शॉर्टहैंड व परीक्षा की दृष्टि से अति-महत्वपूर्ण अवधारणा'
            ],
            flashcards: [
              {
                q: 'अपलोड किए गए नोट्स का मुख्य सारांश क्या है?',
                a: extracted.slice(0, 180) + '...'
              }
            ],
            quiz: [
              {
                q: 'स्कैन किए गए डिजिटल टेक्स्ट में मुख्य विषय क्या है?',
                options: [
                  cleanLines[0] ? cleanLines[0].slice(0, 40) : 'शैक्षणिक सूत्र व सिद्धांत',
                  'अन्य विषय',
                  'अपठनीय',
                  'रफ लेखन'
                ],
                ans: 0,
                exp: 'AI विज़न स्कैनर द्वारा विश्लेषण किया गया।'
              }
            ]
          };
          setSelectedNote(dynamicNote);
          setCustomScannedText(extracted);
        } else {
          setCustomScannedText('फोटो का विश्लेषण पूर्ण हुआ। कृपया अधिक स्पष्ट फोटो अपलोड करें।');
        }
        
        recordStudyActivity(
          'ocr',
          'हस्तलिखित नोट्स फोटो स्कैन (OCR)',
          extracted.slice(0, 220) || 'Uploaded Image',
          100
        );
      } catch (err) {
        console.warn('Ocr upload scan error:', err);
        setCustomScannedText(selectedNote.extractedText);
      } finally {
        setIsScanningImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Chat Mode Multi-Image & PDF Upload
  const handleFilesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
        const newFile: AttachedFile = {
          id: `file_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          name: file.name,
          type: isPdf ? 'application/pdf' : file.type || 'image/png',
          previewUrl: isPdf ? '' : base64,
          base64: base64,
          sizeKb: Math.max(1, Math.round(file.size / 1024))
        };
        setAttachedFiles(prev => [...prev, newFile]);
      };
      reader.readAsDataURL(file);
    });
    if (e.target) e.target.value = '';
  };

  const removeAttachedFile = (fileId: string) => {
    setAttachedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleSendQuery = async (customText?: string) => {
    const queryText = customText !== undefined ? customText : input.trim();
    if (!queryText && attachedFiles.length === 0 && !selectedImage) return;

    const currentFiles = [...attachedFiles];
    if (selectedImage && !currentFiles.some(f => f.base64 === selectedImage)) {
      currentFiles.push({
        id: `img_${Date.now()}`,
        name: 'Photo_Query.png',
        type: 'image/png',
        previewUrl: selectedImage,
        base64: selectedImage,
        sizeKb: 50
      });
    }

    const hasPdf = currentFiles.some(f => f.type === 'application/pdf');
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: queryText || (hasPdf ? 'संलग्न PDF दस्तावेज़ का विश्लेषण व हल बताएं' : 'संलग्न फोटो प्रश्न का हल बताएं'),
      imagePreview: currentFiles.find(f => f.previewUrl)?.previewUrl,
      attachedFiles: currentFiles.length > 0 ? currentFiles : undefined
    };

    setMessages(prev => [...prev, userMsg]);
    if (customText === undefined) setInput('');
    setAttachedFiles([]);
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const answerText = await askHansCompainAI(
        queryText,
        currentFiles.find(f => f.type.startsWith('image/'))?.base64,
        'chat',
        currentFiles.map(f => ({ name: f.name, type: f.type, base64: f.base64 }))
      );

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: answerText
      };
      setMessages(prev => [...prev, aiMsg]);

      // Save to localStorage chat history
      try {
        const existing = JSON.parse(localStorage.getItem('hans_chat_history') || '[]');
        const updated = [
          { id: Date.now(), query: queryText || (hasPdf ? 'PDF Doubt' : 'Photo Doubt'), answer: answerText.slice(0, 120), time: 'अभी' },
          ...existing.slice(0, 9)
        ];
        localStorage.setItem('hans_chat_history', JSON.stringify(updated));
      } catch {
        // ignore storage errors
      }

      recordStudyActivity(
        'doubt',
        queryText ? queryText.slice(0, 50) : (hasPdf ? 'PDF Document Solved' : 'AI Doubt Solved'),
        answerText.slice(0, 220),
        100
      );
    } catch {
      const fallbackAns = await askHansCompainAI(
        queryText,
        currentFiles.find(f => f.type.startsWith('image/'))?.base64,
        'chat',
        currentFiles.map(f => ({ name: f.name, type: f.type, base64: f.base64 }))
      );
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: fallbackAns
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // 1. DEDICATED HANDWRITTEN NOTES & PHOTO OCR SCANNER STUDIO (3-STEP WORKFLOW)
  // ============================================================================
  if (initialMode === 'ocr') {
    const activeExtractedText = customScannedText || selectedNote.extractedText;

    return (
      <div className="max-w-4xl mx-auto space-y-5 animate-fade-in pb-12">
        {/* Top Studio Banner + 3-Step Indicator */}
        <div className="bg-gradient-to-r from-cyan-950/70 via-slate-900 to-blue-950/60 p-5 sm:p-6 rounded-3xl border border-cyan-500/30 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-black uppercase border border-cyan-500/30 mb-1.5">
                <Camera className="w-3.5 h-3.5" />
                <span>AI विज़न ओसीआर स्टूडियो (Handwritten Notes Scanner)</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                हस्तलिखित नोट्स फोटो स्कैनर एवं स्मार्ट कन्वर्टर 📷
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                चरण 1: कॉपी के पन्ने का फोटो अपलोड करें या सैंपल चुनें → चरण 2: डिजिटल टेक्स्ट व सूत्र देखें → चरण 3: फ्लैशकार्ड्स व क्विज़ अभ्यास।
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80">
            {[
              { num: 1 as const, title: 'Step 1: फोटो अपलोड / चयन', sub: 'कैमरा या सैंपल नोट्स' },
              { num: 2 as const, title: 'Step 2: डिजिटल OCR टेक्स्ट', sub: 'सूत्र व संपादन हब' },
              { num: 3 as const, title: 'Step 3: स्मार्ट अभ्यास टूल्स', sub: 'फ्लैशकार्ड्स व क्विज़' }
            ].map(s => (
              <button
                key={s.num}
                onClick={() => setOcrStep(s.num)}
                className={`p-2.5 sm:p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  ocrStep === s.num
                    ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-md'
                    : ocrStep > s.num
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="min-w-0">
                  <div className="text-[10px] sm:text-xs font-black truncate">{s.title}</div>
                  <div className="text-[9px] sm:text-[10px] opacity-80 truncate">{s.sub}</div>
                </div>
                <span className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center shrink-0 ${
                  ocrStep === s.num ? 'bg-cyan-400 text-slate-950' : ocrStep > s.num ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  {ocrStep > s.num ? <Check className="w-3 h-3" /> : s.num}
                </span>
              </button>
            ))}
          </div>
        </div>

        <input
          type="file"
          accept="image/*"
          ref={ocrFileInputRef}
          onChange={handleOcrFileUpload}
          className="hidden"
        />

        {/* OCR STEP 1: UPLOAD PHOTO OR SELECT SAMPLE HANDWRITTEN NOTE */}
        {ocrStep === 1 && (
          <div className="bg-[#091122] border-2 border-cyan-500/30 rounded-3xl p-5 sm:p-7 space-y-6 shadow-2xl animate-fade-in">
            <div
              onClick={() => ocrFileInputRef.current?.click()}
              className="p-6 sm:p-8 rounded-3xl border-2 border-dashed border-cyan-500/50 bg-cyan-950/20 hover:bg-cyan-950/40 transition-all cursor-pointer text-center space-y-3"
            >
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center mx-auto text-cyan-300">
                <Upload className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-white">
                  अपनी कॉपी / हस्तलिखित नोट्स की फोटो अपलोड करें (Upload or Capture Photo)
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  JPG, PNG या कैमरा फोटो चुनें — AI तुरंत लिखावट को पढ़कर साफ डिजिटल नोट्स और टेस्ट में बदल देगा।
                </p>
              </div>
              <button className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-black text-xs inline-flex items-center gap-2 shadow-lg pointer-events-none">
                <Camera className="w-4 h-4" />
                <span>गैलरी / कैमरा से फोटो चुनें</span>
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-amber-300 uppercase tracking-wider block">
                या बिल्ट-इन हस्तलिखित नोट्स टेम्पलेट चुनकर तुरंत डेमो देखें (Step 1 → Step 2):
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {sampleHandwrittenNotes.map(item => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedNote(item);
                      setCustomScannedText('');
                      setCustomImagePreview(null);
                      setOcrStep(2);
                    }}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                      selectedNote.id === item.id
                        ? 'bg-cyan-500/15 border-cyan-400'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-2">
                      <span className="text-[9px] font-black px-2 py-0.5 rounded bg-cyan-500 text-slate-950">
                        {item.badge}
                      </span>
                      <h3 className="text-xs sm:text-sm font-black text-white leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-slate-400">{item.subject}</p>
                    </div>
                    <div className="text-xs font-bold text-cyan-400 flex items-center justify-between pt-2 border-t border-slate-900">
                      <span>स्कैन परिणाम खोलें</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* OCR STEP 2: EXTRACTED DIGITAL TEXT & RESOURCE HUB */}
        {ocrStep === 2 && (
          <div className="bg-[#091122] border-2 border-cyan-500/30 rounded-3xl p-5 sm:p-7 space-y-5 shadow-2xl animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-cyan-400">
                  चरण 2 / 3 (EXTRACTED DIGITAL NOTES &amp; FORMULAS)
                </span>
                <h2 className="text-base sm:text-lg font-black text-white">
                  {customImagePreview ? 'आपकी अपलोड की गई फोटो का डिजिटल पाठ' : selectedNote.title}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => speakText(activeExtractedText)}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>ऑडियो में सुनें</span>
                </button>
                <button
                  onClick={() => setOcrStep(1)}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>दूसरा पन्ना चुनें</span>
                </button>
              </div>
            </div>

            {customImagePreview && (
              <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <img src={customImagePreview} alt="Scanned Note" className="h-20 w-28 object-cover rounded-xl border border-cyan-500/40" />
                <div className="text-xs text-slate-300">
                  <div className="font-black text-emerald-400">✓ फोटो सफलतापूर्वक स्कैन की गई</div>
                  <p className="text-[11px] text-slate-400 mt-0.5">नीचे निकाले गए डिजिटल टेक्स्ट को पढ़ें या संपादित करें।</p>
                </div>
              </div>
            )}

            {isScanningImage ? (
              <div className="p-8 text-center space-y-2 bg-slate-950 rounded-2xl border border-slate-800">
                <Sparkles className="w-6 h-6 text-cyan-400 animate-spin mx-auto" />
                <p className="text-xs font-bold text-cyan-300">AI विज़न इंजन हस्तलिखित शब्दों को डिजिटल टेक्स्ट में बदल रहा है...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-black uppercase text-emerald-400 block">
                    📄 डिजिटल ओसीआर पाठ (Extracted Clean Text):
                  </span>
                  <p className="text-xs sm:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {activeExtractedText}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-black text-amber-400 uppercase block">
                    ⚡ प्रमुख सूत्र एवं हाइलाइट्स (Extracted Key Points):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedNote.keyFormulas.map((kf, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-amber-500/30 text-xs font-bold text-amber-200 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{kf}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                इस नोट्स से बने इंटरएक्टिव फ्लैशकार्ड्स और एमसीक्यू क्विज़ का अभ्यास करें:
              </span>
              <button
                onClick={() => setOcrStep(3)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-lg cursor-pointer"
              >
                <span>Step 3: फ्लैशकार्ड्स व क्विज़ खोलें</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* OCR STEP 3: INTERACTIVE FLASHCARDS & QUIZ FROM SCANNED NOTE */}
        {ocrStep === 3 && (
          <div className="bg-[#091122] border-2 border-emerald-500/30 rounded-3xl p-5 sm:p-7 space-y-5 shadow-2xl animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOcrToolTab('flashcards')}
                  className={`px-4 py-2 rounded-xl text-xs font-black cursor-pointer transition-all ${
                    ocrToolTab === 'flashcards'
                      ? 'bg-emerald-500 text-slate-950 shadow'
                      : 'bg-slate-950 text-slate-300 border border-slate-800'
                  }`}
                >
                  ⚡ स्मार्ट फ्लैशकार्ड्स ({selectedNote.flashcards.length})
                </button>
                <button
                  onClick={() => setOcrToolTab('quiz')}
                  className={`px-4 py-2 rounded-xl text-xs font-black cursor-pointer transition-all ${
                    ocrToolTab === 'quiz'
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'bg-slate-950 text-slate-300 border border-slate-800'
                  }`}
                >
                  🎯 नोट्स एमसीक्यू टेस्ट ({selectedNote.quiz.length})
                </button>
              </div>
              <button
                onClick={() => setOcrStep(2)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-cyan-300 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>नोट्स पाठ पर लौटें (Step 2)</span>
              </button>
            </div>

            {ocrToolTab === 'flashcards' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedNote.flashcards.map((fc, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-3">
                    <span className="text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded">
                      फ्लैशकार्ड #{i + 1}
                    </span>
                    <h3 className="text-xs sm:text-sm font-black text-white">{fc.q}</h3>
                    <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-200">
                      <strong>उत्तर:</strong> {fc.a}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {selectedNote.quiz.map((qItem, qIdx) => {
                  const picked = ocrQuizAnswers[qIdx];
                  return (
                    <div key={qIdx} className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                      <h4 className="text-xs sm:text-sm font-black text-white">
                        प्रश्न {qIdx + 1}: {qItem.q}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {qItem.options.map((opt, oIdx) => {
                          const isPicked = picked === oIdx;
                          const isRight = oIdx === qItem.ans;
                          let style = 'bg-slate-900 border-slate-800 text-slate-200 hover:border-amber-500/40';
                          if (picked !== undefined) {
                            if (isRight) style = 'bg-emerald-950 border-emerald-500 text-emerald-200 font-bold';
                            else if (isPicked) style = 'bg-rose-950 border-rose-500 text-rose-200';
                          }
                          return (
                            <button
                              key={oIdx}
                              onClick={() => setOcrQuizAnswers(prev => ({ ...prev, [qIdx]: oIdx }))}
                              className={`p-3 rounded-xl border text-left text-xs cursor-pointer transition-all ${style}`}
                            >
                              {String.fromCharCode(65 + oIdx)}. {opt}
                            </button>
                          );
                        })}
                      </div>
                      {picked !== undefined && (
                        <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-slate-200">
                          <strong>व्याख्या:</strong> {qItem.exp}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ============================================================================
  // 2. DEDICATED APP GUIDE & FEATURE MAP EXPLORER (3-STEP WORKFLOW)
  // ============================================================================
  if (initialMode === 'app-guide') {
    const filteredFeatures = appFeatureDirectory.filter(
      f => guideLocationFilter === 'all' || f.location === guideLocationFilter
    );

    return (
      <div className="max-w-4xl mx-auto space-y-5 animate-fade-in pb-12">
        <div className="bg-gradient-to-r from-indigo-950/70 via-slate-900 to-cyan-950/60 p-5 sm:p-6 rounded-3xl border border-indigo-500/30 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-black uppercase border border-indigo-500/30 mb-1.5">
                <Compass className="w-3.5 h-3.5" />
                <span>HANS COMPAIN • आधिकारिक फीचर मैप व गाइड हब</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                ऐप इंस्ट्रक्शन व गाइड असिस्टेंट (Feature Map &amp; Workflow) 🧭
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                जानें कौन-सा फीचर कहाँ स्थित है (Home Dashboard, 3-Line Menu, Apps Launcher) और प्रत्येक टूल 3 चरणों में कैसे काम करता है।
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80">
            {[
              { num: 1 as const, title: 'Step 1: स्थान (Location) चुनें', sub: 'Home / 3-Line / Apps' },
              { num: 2 as const, title: 'Step 2: फीचर डायरेक्टरी हब', sub: `${filteredFeatures.length} प्रमुख टूल्स` },
              { num: 3 as const, title: 'Step 3: कार्यप्रणाली व सीधा लॉन्च', sub: selectedGuideFeature.name.slice(0, 20) }
            ].map(s => (
              <button
                key={s.num}
                onClick={() => setGuideStep(s.num)}
                className={`p-2.5 sm:p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  guideStep === s.num
                    ? 'bg-indigo-500/20 border-indigo-400 text-white shadow-md'
                    : guideStep > s.num
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="min-w-0">
                  <div className="text-[10px] sm:text-xs font-black truncate">{s.title}</div>
                  <div className="text-[9px] sm:text-[10px] opacity-80 truncate">{s.sub}</div>
                </div>
                <span className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center shrink-0 ${
                  guideStep === s.num ? 'bg-indigo-400 text-slate-950' : guideStep > s.num ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  {guideStep > s.num ? <Check className="w-3 h-3" /> : s.num}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* GUIDE STEP 1: CHOOSE APP LOCATION */}
        {guideStep === 1 && (
          <div className="bg-[#091122] border-2 border-indigo-500/30 rounded-3xl p-5 sm:p-7 space-y-5 shadow-2xl animate-fade-in">
            <h2 className="text-base sm:text-lg font-black text-white">
              चरण 1: आप ऐप के किस हिस्से (Location) के फीचर्स देखना चाहते हैं?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[
                { id: 'all' as const, title: '🌐 सम्पूर्ण ऐप फीचर मैप (All Locations)', desc: 'होम डैशबोर्ड, 3-लाइन मेनू और ऐप्स लॉन्चर के सभी प्रमुख फीचर्स एक साथ।' },
                { id: 'home' as const, title: '🏠 मुख्य होम डैशबोर्ड (Home Dashboard)', desc: 'All Stenographer बैनर, 8 मुख्य स्टडी कार्ड्स और 4 क्विक टाइल्स (Syllabus, Apps, Interview, Analytics)।' },
                { id: 'drawer' as const, title: '☰ 3-लाइन साइडबार मेनू (Left Drawer)', desc: 'एजु-रील्स, स्मार्ट लाइब्रेरी, स्टडी प्लानर, न्यूरल मैप, फ्लैशकार्ड्स, ओसीआर स्कैनर व एडमिन कंसोल।' },
                { id: 'launcher' as const, title: '🚀 ऐप्स लॉन्चर हब (Apps Launcher Modal)', desc: 'भारती भवन बुक्स, अनलिमिटेड PYQ वॉल्ट, सरकारी रिजल्ट पात्रता, पीयर चैलेंज, म्यूजिक स्टूडियो व स्टोर।' }
              ].map(loc => (
                <div
                  key={loc.id}
                  onClick={() => {
                    setGuideLocationFilter(loc.id);
                    setGuideStep(2);
                  }}
                  className="p-5 rounded-2xl bg-slate-950 border-2 border-slate-800 hover:border-indigo-400 cursor-pointer transition-all flex flex-col justify-between gap-3 group"
                >
                  <div className="space-y-1.5">
                    <h3 className="text-sm sm:text-base font-black text-white group-hover:text-indigo-300">
                      {loc.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{loc.desc}</p>
                  </div>
                  <div className="text-xs font-black text-indigo-400 flex items-center justify-between pt-2 border-t border-slate-900">
                    <span>इस सेक्शन के फीचर्स देखें (Step 2)</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GUIDE STEP 2: FEATURE DIRECTORY HUB */}
        {guideStep === 2 && (
          <div className="bg-[#091122] border-2 border-indigo-500/30 rounded-3xl p-5 sm:p-7 space-y-5 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base sm:text-lg font-black text-white">
                चरण 2: फीचर चुनें और उसका 3-चरण वर्कफ़्लो देखें
              </h2>
              <button
                onClick={() => setGuideStep(1)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>लोकेशन बदलें</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredFeatures.map(feat => (
                <div
                  key={feat.id}
                  onClick={() => {
                    setSelectedGuideFeature(feat);
                    setGuideStep(3);
                  }}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-400 cursor-pointer transition-all flex flex-col justify-between gap-3 group"
                >
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-black px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {feat.badge}
                    </span>
                    <h3 className="text-sm font-black text-white group-hover:text-cyan-300">
                      {feat.name}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{feat.summary}</p>
                  </div>
                  <div className="text-xs font-bold text-cyan-400 flex items-center justify-between pt-2 border-t border-slate-900">
                    <span>स्टेप-बाय-स्टेप गाइड व ओपन करें</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GUIDE STEP 3: STEP-BY-STEP WORKFLOW & DIRECT LAUNCH */}
        {guideStep === 3 && (
          <div className="bg-[#091122] border-2 border-cyan-500/40 rounded-3xl p-5 sm:p-7 space-y-5 shadow-2xl animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-cyan-400">
                  {selectedGuideFeature.badge}
                </span>
                <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
                  {selectedGuideFeature.name}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    speakText(
                      `${selectedGuideFeature.name}. ${selectedGuideFeature.summary}. ${selectedGuideFeature.steps.join(' ')}`
                    )
                  }
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>गाइड सुनें</span>
                </button>
                <button
                  onClick={() => setGuideStep(2)}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>सभी फीचर्स</span>
                </button>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-850">
              {selectedGuideFeature.summary}
            </p>

            <div className="space-y-2.5">
              <h3 className="text-xs font-black uppercase text-amber-400">
                ⚡ यह फीचर कैसे काम करता है (3-Step Operational Flow):
              </h3>
              {selectedGuideFeature.steps.map((st, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3 text-xs sm:text-sm text-slate-200"
                >
                  <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-300 font-black flex items-center justify-center shrink-0 text-xs">
                    {idx + 1}
                  </span>
                  <span>{st}</span>
                </div>
              ))}
            </div>

            {onNavigate && (
              <div className="pt-3 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => onNavigate(selectedGuideFeature.viewId)}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl cursor-pointer transition-all"
                >
                  <span>अभी यह फीचर खोलें (Open Dedicated UI Page)</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ============================================================================
  // 3. DEDICATED AI DOUBT SOLVER & CHAT ASSISTANT (FULL PAGE CHAT VIEW)
  // ============================================================================
  return (
    <div className="max-w-5xl mx-auto flex flex-col h-[calc(100vh-80px)] w-full bg-[#091122] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl animate-fade-in">
      {/* Top Studio Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-950/80 via-slate-900 to-cyan-950/60 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black text-white">
              HANS COMPAIN • AI डाउट सॉल्वर एवं स्मार्ट चैट सहायक
            </h1>
            <p className="text-[11px] text-slate-300">
              गणित, विज्ञान, जीके, इंग्लिश और आशुलिपि (Steno) के किसी भी प्रश्न का विस्तृत समाधान।
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                id: Date.now().toString(),
                role: 'assistant',
                text: 'चैट इतिहास साफ़ कर दिया गया है। अपना नया प्रश्न पूछें!'
              }
            ])
          }
          className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 text-xs font-bold flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          title="चैट साफ़ करें"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>साफ़ करें</span>
        </button>
      </div>

      {/* Quick Prompt Chips */}
      <div className="px-4 py-2.5 bg-slate-950/80 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto shrink-0">
        {[
          'ओम का नियम और सूत्र उदाहरण सहित समझाएं',
          'ऋषि प्रणाली में स-वृत्त और श-वृत्त का अंतर',
          'SSC Steno में क्लोज टेस्ट हल करने की ट्रिक',
          '1857 की क्रांति के मुख्य केंद्र और नेतृत्वकर्ता'
        ].map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSendQuery(chip)}
            className="px-3 py-1 rounded-full bg-slate-900 hover:bg-indigo-950/80 border border-slate-800 hover:border-indigo-500/40 text-[11px] text-slate-300 hover:text-white whitespace-nowrap cursor-pointer transition-all"
          >
            ✨ {chip}
          </button>
        ))}
      </div>

      {/* Chat Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[88%] sm:max-w-[78%] rounded-2xl p-4 space-y-2.5 ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none shadow-lg'
                  : 'bg-slate-950 border border-slate-800 text-slate-100 rounded-bl-none shadow-md'
              }`}
            >
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300">
                  {msg.role === 'user' ? '👤 आपका प्रश्न' : '🤖 HANS COMPAIN AI'}
                </span>
                {msg.role === 'assistant' && (
                  <button
                    onClick={() => speakText(msg.text)}
                    className="text-[10px] font-bold text-amber-300 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>सुनें</span>
                  </button>
                )}
              </div>

              {/* Render Attached Images & PDF Files in Message Bubble */}
              {msg.attachedFiles && msg.attachedFiles.length > 0 ? (
                <div className="space-y-2 pt-1">
                  {/* Images Gallery */}
                  {msg.attachedFiles.some(f => f.type.startsWith('image/')) && (
                    <div className="flex flex-wrap gap-2">
                      {msg.attachedFiles
                        .filter(f => f.type.startsWith('image/'))
                        .map(img => (
                          <img
                            key={img.id}
                            src={img.previewUrl || img.base64}
                            alt={img.name}
                            className="max-h-48 max-w-xs rounded-xl border border-white/20 object-contain bg-black/40"
                          />
                        ))}
                    </div>
                  )}

                  {/* PDF Document Cards */}
                  {msg.attachedFiles
                    .filter(f => f.type === 'application/pdf')
                    .map(pdf => (
                      <div
                        key={pdf.id}
                        className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/40 flex items-center gap-2.5 max-w-sm text-xs"
                      >
                        <div className="w-8 h-8 rounded-lg bg-red-600/30 text-red-400 border border-red-500/40 flex items-center justify-center font-black text-xs shrink-0">
                          PDF
                        </div>
                        <div className="truncate">
                          <span className="font-bold text-white block truncate">{pdf.name}</span>
                          <span className="text-[10px] text-red-300 font-mono">{pdf.sizeKb} KB • दस्तावेज़ संलग्न</span>
                        </div>
                      </div>
                    ))}
                </div>
              ) : msg.imagePreview ? (
                <img
                  src={msg.imagePreview}
                  alt="Uploaded note"
                  className="max-h-48 rounded-xl border border-white/20 object-contain bg-black/40"
                />
              ) : null}

              <div className="text-xs sm:text-sm leading-relaxed">
                {msg.role === 'assistant' ? (
                  <LucentTextFormatter text={msg.text} />
                ) : (
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                )}
              </div>

              {msg.role === 'assistant' && (
                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                  <button
                    onClick={() => handleSendQuery(`"${msg.text.slice(0, 60)}" पर आधारित 5 परीक्षा MCQ क्विज़ प्रश्न दें`)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] font-semibold text-cyan-300 border border-slate-750 cursor-pointer flex items-center gap-1"
                  >
                    📝 5 Live MCQs
                  </button>
                  <button
                    onClick={() => handleSendQuery(`इस विषय की आसान मेमोरी ट्रिक या शॉर्टकट निमोनिक (Mnemonic rhyme) बताएं: "${msg.text.slice(0, 60)}"`)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] font-semibold text-amber-300 border border-slate-750 cursor-pointer flex items-center gap-1"
                  >
                    🎯 शॉर्ट ट्रिक
                  </button>
                  <button
                    onClick={() => handleSendQuery(`इस विषय के 1-पेज त्वरित रिवीजन बुलेट पॉइंट्स बताएं: "${msg.text.slice(0, 60)}"`)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] font-semibold text-emerald-300 border border-slate-750 cursor-pointer flex items-center gap-1"
                  >
                    ⚡ की-पॉइंट्स
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-950 border border-cyan-500/30 rounded-2xl p-4 text-xs text-cyan-300 flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
              <span>HANS COMPAIN AI आपके प्रश्न का सटीक समाधान तैयार कर रहा है...</span>
            </div>
          </div>
        )}
      </div>

      {/* Attached Files (Multi-Image & PDF) Preview Banner */}
      {attachedFiles.length > 0 && (
        <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {attachedFiles.map(file => (
              <div
                key={file.id}
                className="flex items-center gap-2 bg-[#091122] border border-cyan-500/40 rounded-xl px-2.5 py-1.5 shrink-0 text-xs"
              >
                {file.type === 'application/pdf' ? (
                  <div className="w-6 h-6 rounded bg-red-600/30 text-red-400 border border-red-500/40 flex items-center justify-center font-bold text-[10px]">
                    PDF
                  </div>
                ) : (
                  <img src={file.previewUrl || file.base64} alt={file.name} className="w-6 h-6 object-cover rounded border border-white/20" />
                )}
                <div className="max-w-[120px] truncate">
                  <span className="font-bold text-white block truncate text-[11px]">{file.name}</span>
                  <span className="text-[9px] text-slate-400">{file.sizeKb} KB</span>
                </div>
                <button
                  onClick={() => removeAttachedFile(file.id)}
                  className="p-1 text-slate-400 hover:text-rose-400 cursor-pointer font-bold"
                  title="हटाएं"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => setAttachedFiles([])}
            className="text-[11px] text-rose-400 hover:underline shrink-0 font-bold cursor-pointer"
          >
            सभी हटाएं
          </button>
        </div>
      )}

      {/* Bottom Input Area */}
      <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 shrink-0">
        <input
          type="file"
          accept="image/*,application/pdf"
          multiple
          ref={fileInputRef}
          onChange={handleFilesUpload}
          className="hidden"
        />
        <div className="flex items-center gap-2 bg-[#091122] border border-slate-800 focus-within:border-cyan-500 rounded-2xl p-2 px-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 flex items-center gap-1.5 text-xs font-bold cursor-pointer shrink-0"
            title="फोटो या PDF फाइल संलग्न करें (Multiple Images & PDF Supported)"
          >
            <Camera className="w-4 h-4" />
            <span className="hidden sm:inline">फोटो / PDF जोड़ें</span>
          </button>

          <button
            onClick={() => {
              const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
              if (!SpeechRecognition) {
                alert('आपके ब्राउज़र में वॉइस स्पीच उपलब्ध नहीं है। कृपया टाइप करें।');
                return;
              }
              if (isListening) {
                setIsListening(false);
                return;
              }
              try {
                const recognition = new SpeechRecognition();
                recognition.lang = 'hi-IN';
                recognition.interimResults = false;
                recognition.onstart = () => setIsListening(true);
                recognition.onresult = (event: any) => {
                  const transcript = event.results[0][0].transcript;
                  if (transcript) setInput(prev => (prev ? `${prev} ${transcript}` : transcript));
                };
                recognition.onend = () => setIsListening(false);
                recognition.onerror = () => setIsListening(false);
                recognition.start();
              } catch {
                setIsListening(false);
              }
            }}
            className={`p-2 rounded-xl border flex items-center gap-1 text-xs font-bold cursor-pointer shrink-0 transition-colors ${
              isListening ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse' : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
            }`}
            title="बोलकर प्रश्न पूछें (Voice Input)"
          >
            {isListening ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4 text-cyan-400" />}
          </button>

          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendQuery()}
            placeholder="अपना सवाल यहाँ लिखें या बोलें..."
            className="flex-1 bg-transparent border-none outline-none text-white text-xs sm:text-sm px-2"
          />

          <button
            onClick={() => handleSendQuery()}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shrink-0"
          >
            <span>पूछें</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
