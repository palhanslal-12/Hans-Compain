import React, { useState, useEffect, useRef } from 'react';
import { 
  Brain, Sparkles, AlertTriangle, CheckCircle2, Zap, RotateCcw, 
  HelpCircle, Volume2, ArrowLeft, Activity, ShieldAlert, Award, Clock, Flame,
  Search, Image as ImageIcon, BookOpen, FileText, Download, Share2, Plus, ArrowRight
} from 'lucide-react';
import { speakText, stopAllSpeech } from '../utils/speechUtils';

interface MemoryNode {
  id: string;
  subject: string;
  category: string;
  retentionScore: number; // 0 - 100
  lastStudiedDaysAgo: number;
  decayRatePerDay: number;
  keyTopics: string[];
  mnemonic: string;
  deepExplanation: string;
  importantHighlights: string[];
  examAlert: string;
  imageUrl: string;
  x: number;
  y: number;
}

const INITIAL_NODES: MemoryNode[] = [
  {
    id: 'polity-1',
    subject: 'Indian Constitution: Fundamental Rights (Art 12-35)',
    category: 'Polity',
    retentionScore: 42, // Critical Decay!
    lastStudiedDaysAgo: 5,
    decayRatePerDay: 11.5,
    keyTopics: ['Right to Equality (Art 14-18)', 'Right to Freedom (Art 19-22)', 'Constitutional Remedies (Art 32)'],
    mnemonic: 'E-F-E-R-C-E: Equality, Freedom, Exploitation, Religion, Culture, Education',
    deepExplanation: `भारतीय संविधान के भाग-3 (अनुच्छेद 12 से 35) को भारत का 'मैग्नाकार्टा' कहा जाता है। यह नागरिकों को 6 मौलिक अधिकार प्रदान करता है।
    
    • अनुच्छेद 14: कानून के समक्ष समानता एवं कानून का समान संरक्षण।
    • अनुच्छेद 19: 6 प्रकार की स्वतंत्रताएँ (वाक् एवं अभिव्यक्ति, सम्मेलन, संघ, संचरण, निवास, व्यापार)।
    • अनुच्छेद 21: प्राण एवं दैहिक स्वतंत्रता का अधिकार (निजता का अधिकार भी शामिल)।
    • अनुच्छेद 32: डॉ. बी.आर. आंबेडकर द्वारा 'संविधान की आत्मा व हृदय'। इसके तहत सर्वोच्च न्यायालय 5 प्रकार की रिट (बंदी प्रत्यक्षीकरण, परमादेश, प्रतिषेध, उत्प्रेषण, अधिकार-पृच्छा) जारी करता है।`,
    importantHighlights: [
      '🔥 अनुच्छेद 32 = संविधान का हृदय व आत्मा (डॉ. आंबेडकर)',
      '⚡ संपत्ति का अधिकार (Art 31) 44वें संशोधन 1978 द्वारा हटाकर Art 300A में कानूनी अधिकार बनाया गया',
      '📌 आपातकाल में केवल Art 20 और 21 निलंबित नहीं होते'
    ],
    examAlert: 'UPSC Prelims & SSC CGL Repeated: Article 32 Writs & Article 21 Privacy Ruling',
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&q=80',
    x: 250,
    y: 180
  },
  {
    id: 'history-1',
    subject: 'Modern History: Indian National Movement (1885-1947)',
    category: 'History',
    retentionScore: 68, // Moderate Fading
    lastStudiedDaysAgo: 3,
    decayRatePerDay: 10,
    keyTopics: ['Partition of Bengal (1905)', 'Non-Cooperation (1920)', 'Quit India (1942)'],
    mnemonic: 'B-N-C-Q: Bengal Partition, Non-Cooperation, Civil Disobedience, Quit India',
    deepExplanation: `भारतीय राष्ट्रीय आंदोलन के तीन प्रमुख चरण रहे हैं: उदारवादी (1885-1905), उग्रवादी (1905-1919) और गांधीवादी युग (1919-1947)।
    
    1. बंगाल विभाजन (1905): लॉर्ड कर्जन द्वारा। इसके विरोध में स्वदेशी आंदोलन शुरू हुआ।
    2. असहयोग आंदोलन (1920-22): चौरी-चौरा कांड (5 फरवरी 1922) के बाद गांधीजी ने वापस लिया।
    3. सविनय अवज्ञा आंदोलन (1930): दांडी मार्च (12 मार्च - 6 अप्रैल 1930) से शुरू होकर नमक कानून तोड़ा गया।
    4. भारत छोड़ो आंदोलन (8 अगस्त 1942): 'करो या मरो' (Do or Die) का नारा दिया गया।`,
    importantHighlights: [
      '🔥 भारतीय राष्ट्रीय कांग्रेस की स्थापना: 28 दिसंबर 1885 (A.O. ह्यूम)',
      '⚡ 1907 सूरत अधिवेशन: कांग्रेस का गरम दल व नरम दल में विभाजन',
      '📌 1929 लाहौर अधिवेशन: जवाहरलाल नेहरू की अध्यक्षता में "पूर्ण स्वराज" का प्रस्ताव'
    ],
    examAlert: 'SSC CGL / Railway PYQ: Dandi March exact dates & Lahore Session 1929 President',
    imageUrl: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=600&q=80',
    x: 520,
    y: 140
  },
  {
    id: 'geo-1',
    subject: 'Indian Geography: Himalayan Rivers & Tributaries',
    category: 'Geography',
    retentionScore: 92, // Strong Synapse
    lastStudiedDaysAgo: 1,
    decayRatePerDay: 8,
    keyTopics: ['Indus Tributaries (JCRBS)', 'Ganga System (Devprayag)', 'Brahmaputra Yarlung Tsangpo'],
    mnemonic: 'JCRBS: Jhelum, Chenab, Ravi, Beas, Sutlej',
    deepExplanation: `हिमालयी नदियाँ पूर्ववर्ती (Antecedent) नदियाँ हैं जो तीन प्रमुख तंत्रों में विभाजित हैं:
    
    1. सिंधु नदी तंत्र: मानसरोवर झील के पास चेमायुंगडुंग हिमनद से निकलती है। बाएँ तट की प्रमुख सहायक नदियाँ: झेलम, चिनाब, रावी, व्यास, सतलुज (JCRBS)।
    2. गंगा नदी तंत्र: भागीरथी और अलकनंदा नदियाँ देवप्रयाग में मिलकर 'गंगा' कहलाती हैं। सबसे बड़ी सहायक नदी यमुनोत्री से निकलने वाली 'यमुना' है।
    3. ब्रह्मपुत्र नदी तंत्र: तिब्बत में 'यारलुंग त्सांगपो', अरुणाचल में 'दिहांग' और असम में 'ब्रह्मपुत्र' कहलाती है। बांग्लादेश में इसे 'जमुना' कहा जाता है।`,
    importantHighlights: [
      '🔥 देवप्रयाग = भागीरथी + अलकनंदा का संगम',
      '⚡ माजुली द्वीप (असम) = विश्व का सबसे बड़ा नदी द्वीप (ब्रह्मपुत्र नदी पर)',
      '📌 सिंधु जल समझौता 1960: भारत को रावी, व्यास व सतलुज का 80% जल अधिकार'
    ],
    examAlert: 'UPSC / State PCS: Panch Prayag Order & Brahmaputra Names in Tibet/Bangladesh',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80',
    x: 380,
    y: 320
  },
  {
    id: 'science-1',
    subject: 'General Science: Human Circulatory System & Blood Types',
    category: 'Science',
    retentionScore: 35, // Critical Decay!
    lastStudiedDaysAgo: 6,
    decayRatePerDay: 12,
    keyTopics: ['Universal Donor (O-)', 'Universal Recipient (AB+)', 'Hemoglobin & RBC lifespan (120 days)'],
    mnemonic: 'O- Donor = Gives to all, AB+ Acceptor = Takes from all',
    deepExplanation: `मानव परिसंचरण तंत्र (Circulatory System) की खोज विलियम हार्वे ने 1628 में की थी।
    
    • रक्त एक तरल संयोजी ऊतक (Fluid Connective Tissue) है जिसका pH मान 7.4 (हल्का क्षारीय) होता है।
    • RBC (लाल रक्त कणिकाएं): जीवनकाल 120 दिन, प्लेहा (Spleen) को RBC का कब्रिस्तान कहा जाता है।
    • WBC (श्वेत रक्त कणिकाएं): शरीर का सैनिक (रोग प्रतिरोधक क्षमता)।
    • रक्त समूह: कार्ल लैंडस्टीनर द्वारा खोजा गया। 'O- negative' सर्वदाता (Universal Donor) और 'AB+ positive' सर्वग्राही (Universal Recipient) है।`,
    importantHighlights: [
      '🔥 RBC का निर्माण = अस्थि मज्जा (Bone Marrow), मृत्यु = प्लीहा (Spleen)',
      '⚡ मानव हृदय में 4 कोष्ठ (2 अलिंद, 2 निलय) होते हैं',
      '📌 सिस्टोलिक/डायस्टोलिक सामान्य रक्तचाप = 120/80 mmHg'
    ],
    examAlert: 'Railway Rallway/SSC CGL: Blood pH value (7.4) & Universal Donor O negative',
    imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&q=80',
    x: 180,
    y: 360
  },
  {
    id: 'econ-1',
    subject: 'Indian Economy: Monetary Policy & RBI Repo Rates',
    category: 'Economy',
    retentionScore: 78,
    lastStudiedDaysAgo: 2,
    decayRatePerDay: 9,
    keyTopics: ['Repo vs Reverse Repo', 'CRR & SLR Ratio', 'Inflation Control Targets (4% ± 2%)'],
    mnemonic: 'Repo = Bank borrows from RBI. Reverse Repo = RBI absorbs liquidity.',
    deepExplanation: `भारतीय रिजर्व बैंक (RBI) भारत का केंद्रीय बैंक है, जिसकी स्थापना 1 अप्रैल 1935 को हिल्टन यंग आयोग की सिफारिश पर हुई थी।
    
    • मौद्रिक नीति समिति (MPC): 6 सदस्य (3 RBI + 3 केंद्र सरकार)। मुद्रास्फीति का लक्ष्य 4% (± 2%) निर्धारित है।
    • रेपो दर (Repo Rate): वह दर जिस पर वाणिज्यिक बैंक RBI से अल्पकालिक ऋण लेते हैं।
    • रिवर्स रेपो दर: वह दर जिस पर RBI वाणिज्यिक बैंकों से अधिशेष जमा स्वीकार करता है।
    • CRR (नकद आरक्षित अनुपात): बैंकों को अपनी जमा का कुछ प्रतिशत नगद रूप में RBI के पास रखना अनिवार्य है।`,
    importantHighlights: [
      '🔥 RBI का राष्ट्रीयकरण: 1 जनवरी 1949 को हुआ',
      '⚡ रेपो रेट बढ़ाने से बाजार में तरलता (Liquidity) कम होती है और महंगाई घटती है',
      '📌 RBI का मुख्यालय: मुंबई में स्थित है'
    ],
    examAlert: 'SSC CGL / Banking Exam: MPC Member Count (6) & Repo Rate inflation impact',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80',
    x: 620,
    y: 340
  },
  {
    id: 'shorthand-1',
    subject: 'Pitman Shorthand: Grammalogues & Diphthongs',
    category: 'Shorthand',
    retentionScore: 28, // High Danger!
    lastStudiedDaysAgo: 7,
    decayRatePerDay: 14,
    keyTopics: ['Light vs Heavy Strokes', 'Positioning on/above/through line', 'Vowel signs'],
    mnemonic: 'Pa-May-We-All-Go-Too (Heavy vowels) vs That-Short-Is-Not-Much-Good (Light vowels)',
    deepExplanation: `पीटमैन आशुलिपि (Pitman Shorthand) ध्वन्यात्मक (Phonetic) प्रणाली पर आधारित है।
    
    • व्यंजन रेखाएं (Strokes): 24 व्यंजन रेखाएं होती हैं (हल्की रेखाएं अघोष/Light consonants, भारी रेखाएं सघोष/Heavy consonants)।
    • स्वर स्थान (Vowel Positions): 1st position (लाइन के ऊपर), 2nd position (लाइन पर), 3rd position (लाइन के पार/Through the line)।
    • द्विस्वर (Diphthongs): चार द्विस्वर - I, OW, OI, U (mnemonic: 'I enjoy now music')।`,
    importantHighlights: [
      '🔥 1st Vowel = Stroke Above the Line',
      '⚡ 2nd Vowel = Stroke On the Line',
      '📌 3rd Vowel = Stroke Through the Line'
    ],
    examAlert: 'SSC Stenographer Grade C & D Skill Test: Core Grammalogues Speed Reference',
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&q=80',
    x: 420,
    y: 480
  }
];

interface NeuralMemoryMapViewProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info' | 'warn') => void;
  language: 'english' | 'hindi' | 'spanish' | 'french' | 'german';
}

export const NeuralMemoryMapView: React.FC<NeuralMemoryMapViewProps> = ({ showToast, language }) => {
  const [nodes, setNodes] = useState<MemoryNode[]>(INITIAL_NODES);
  const [selectedNode, setSelectedNode] = useState<MemoryNode | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchingAI, setIsSearchingAI] = useState<boolean>(false);
  const [activeQuizQuestion, setActiveQuizQuestion] = useState<any | null>(null);
  const [selectedAnswerIdx, setSelectedAnswerIdx] = useState<number | null>(null);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);
  const [isBoosterLoading, setIsBoosterLoading] = useState<boolean>(false);
  const [synapseHealthScore, setSynapseHealthScore] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Calculate Overall Synapse Brain Health
  useEffect(() => {
    if (nodes.length === 0) return;
    const avg = Math.round(nodes.reduce((acc, n) => acc + n.retentionScore, 0) / nodes.length);
    setSynapseHealthScore(avg);
  }, [nodes]);

  // Draw Interactive Neural Synapse Net on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let pulseAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pulseAngle += 0.05;

      // Draw Synapse Connecting Neural Lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];

          const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);
          if (dist < 340) {
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);

            const avgHealth = (n1.retentionScore + n2.retentionScore) / 200;
            ctx.strokeStyle = avgHealth > 0.7 
              ? `rgba(16, 185, 129, ${avgHealth * 0.4})` 
              : avgHealth > 0.4 
                ? `rgba(245, 158, 11, ${avgHealth * 0.4})` 
                : `rgba(239, 68, 68, ${avgHealth * 0.6})`;

            ctx.lineWidth = avgHealth * 2.5;
            ctx.stroke();

            const pulsePos = (Math.sin(pulseAngle + i + j) + 1) / 2;
            const px = n1.x + (n2.x - n1.x) * pulsePos;
            const py = n1.y + (n2.y - n1.y) * pulsePos;

            ctx.beginPath();
            ctx.arc(px, py, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = avgHealth > 0.6 ? '#10B981' : '#EF4444';
            ctx.shadowBlur = 8;
            ctx.shadowColor = ctx.fillStyle;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }

      // Draw Synapse Subject Nodes
      nodes.forEach(node => {
        const isSelected = selectedNode?.id === node.id;
        const color = node.retentionScore >= 75 
          ? '#10B981' // Green
          : node.retentionScore >= 50 
            ? '#F59E0B' // Orange
            : '#EF4444'; // Red Danger

        if (node.retentionScore < 50 || isSelected) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, 22 + Math.sin(pulseAngle * 2) * 4, 0, Math.PI * 2);
          ctx.fillStyle = color + '22';
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, isSelected ? 18 : 14, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.shadowBlur = isSelected ? 15 : 8;
        ctx.shadowColor = color;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${node.category} (${node.retentionScore}%)`, node.x, node.y + 28);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [nodes, selectedNode]);

  // Handle Canvas Node Clicking
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) * (canvas.width / rect.width);
    const clickY = (e.clientY - rect.top) * (canvas.height / rect.height);

    const clicked = nodes.find(node => Math.hypot(node.x - clickX, node.y - clickY) < 28);
    if (clicked) {
      setSelectedNode(clicked);
      setActiveQuizQuestion(null);
      setIsQuizCompleted(false);
    }
  };

  // UNIVERSAL SEARCH & DYNAMIC AI NEURAL NODE GENERATOR
  const handleSearchOrGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;

    // 1. Check if node already exists in local list
    const existing = nodes.find(n => 
      n.subject.toLowerCase().includes(q.toLowerCase()) || 
      n.category.toLowerCase().includes(q.toLowerCase())
    );

    if (existing) {
      setSelectedNode(existing);
      showToast(
        language === 'hindi'
          ? `📍 "${existing.subject}" का न्यूरल मैप मिला!`
          : `📍 Selected existing node for "${existing.subject}"`,
        "success"
      );
      setSearchQuery('');
      return;
    }

    // 2. Otherwise generate dynamic AI node using Gemini / AI Chat backend
    setIsSearchingAI(true);
    showToast(
      language === 'hindi'
        ? `🤖 HansAI "${q}" पर न्यूरल नॉलेज मैप एवं गहन नोट्स तैयार कर रहा है...`
        : `🤖 Generating AI Neural Knowledge Node & Diagram for "${q}"...`,
      "info"
    );

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Generate a comprehensive exam study node for topic: "${q}". Provide in JSON format if possible or structured text with: Category, Key Points, Mnemonic, Deep Explanation in Hindi/English, Exam PYQ Alert, and 3 Highlights.`,
          systemInstruction: `You are HansAI Neural Knowledge System. Generate a detailed study node for "${q}". Keep explanations 100% exam accurate with key articles, formulas, dates, or rules.`
        })
      });

      let aiText = "";
      if (res.ok) {
        const data = await res.json();
        aiText = data.reply || "";
      }

      // Create new dynamic node
      const randomX = Math.floor(Math.random() * 450) + 150;
      const randomY = Math.floor(Math.random() * 320) + 100;

      const newNode: MemoryNode = {
        id: `ai-node-${Date.now()}`,
        subject: q.toUpperCase(),
        category: 'Custom Topic',
        retentionScore: 60,
        lastStudiedDaysAgo: 1,
        decayRatePerDay: 10,
        keyTopics: [
          `Core concept of ${q}`,
          `Exam Relevance & PYQ Points`,
          `Formula / Key Rules & Dates`,
          `Memory retention strategy`
        ],
        mnemonic: `AI Memory Hook for ${q}: Master key terms & practice 2-min booster tests daily.`,
        deepExplanation: aiText || `**${q} का गहन अध्ययन विवरण:**\n\n${q} प्रतियोगी परीक्षाओं (UPSC, SSC, State PCS) के लिए एक महत्वपूर्ण विषय है। इसमें अवधारणात्मक समझ, मुख्य सिद्धांतों और अद्यतन तथ्यों को याद रखना आवश्यक है।\n\n• **मुख्य बिंदु:** इस अवधारणा की नींव मूलभूत सिद्धांतों और प्रासंगिक अनुप्रयोगों पर आधारित है।\n• **परीक्षा प्रासंगिकता:** प्रश्नों में सीधे तौर पर परिभाषाएँ, संबंधित धाराएँ/अनुच्छेद या वैज्ञानिक नियम पूछे जाते हैं।`,
        importantHighlights: [
          `🔥 ${q}: बार-बार पूछे जाने वाले प्रश्न व मुख्य बिंदु`,
          `⚡ परीक्षा में त्वरित उत्तर हेतु शॉर्टकट ट्रिक`,
          `📌 HansAI द्वारा सहेजा गया कस्टम न्यूरल नोड`
        ],
        examAlert: `UPSC / SSC / State PCS Exam High-Yield Core Topic: ${q}`,
        imageUrl: `https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80`,
        x: randomX,
        y: randomY
      };

      setNodes(prev => [...prev, newNode]);
      setSelectedNode(newNode);
      setSearchQuery('');
      showToast(
        language === 'hindi'
          ? `✨ "${q}" का न्यूरल नॉलेज नोड सफलतापूर्वक जोड़ा गया!`
          : `✨ Dynamically generated AI Neural Node for "${q}"!`,
        "success"
      );
    } catch (err) {
      showToast("Unable to reach AI server, generated smart local node instead.", "warn");
    } finally {
      setIsSearchingAI(false);
    }
  };

  // Trigger Instant AI Memory Booster Quiz for Selected Topic
  const generateBoosterQuiz = async (node: MemoryNode) => {
    setIsBoosterLoading(true);
    setSelectedAnswerIdx(null);
    setIsQuizCompleted(false);

    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: node.subject,
          quizLang: language === 'hindi' ? 'Hindi' : 'English'
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.quiz && data.quiz.length > 0) {
          setActiveQuizQuestion(data.quiz[0]);
        } else {
          fallbackLocalQuiz(node);
        }
      } else {
        fallbackLocalQuiz(node);
      }
    } catch (e) {
      fallbackLocalQuiz(node);
    } finally {
      setIsBoosterLoading(false);
    }
  };

  const fallbackLocalQuiz = (node: MemoryNode) => {
    setActiveQuizQuestion({
      question: language === 'hindi'
        ? `${node.subject} से संबंधित मुख्य अवधारणा क्या है?`
        : `Which key concept is most relevant to ${node.subject}?`,
      options: [
        node.keyTopics[0] || 'Primary Rule & Article',
        'Irrelevant Historical Speculation',
        'Outdated Pre-colonial Mandate',
        'None of the above'
      ],
      answerIndex: 0,
      explanation: language === 'hindi'
        ? `सही उत्तर है: ${node.keyTopics[0]}। यह प्रश्न सीधे इस न्यूरल नोड की स्मृति को 100% ताज़ा करता है।`
        : `Correct! ${node.keyTopics[0]} is the core pillar of this concept.`
    });
  };

  const handleAnswerSubmit = (idx: number) => {
    setSelectedAnswerIdx(idx);
    setIsQuizCompleted(true);

    if (activeQuizQuestion && idx === activeQuizQuestion.answerIndex) {
      showToast(
        language === 'hindi' 
          ? "🎉 शानदार! आपकी स्मृति पूरी तरह (100%) ताज़ा हो गई है!" 
          : "🎉 Memory Boosted! Synapse health restored to 100%!", 
        "success"
      );
      
      if (selectedNode) {
        setNodes(prev => prev.map(n => 
          n.id === selectedNode.id 
            ? { ...n, retentionScore: 100, lastStudiedDaysAgo: 0 } 
            : n
        ));
        setSelectedNode(prev => prev ? { ...prev, retentionScore: 100, lastStudiedDaysAgo: 0 } : null);
      }
    } else {
      showToast(
        language === 'hindi'
          ? "व्याख्या पढ़ें और याददाश्त मजबूत करें।"
          : "Review the explanation to reinforce your retention.",
        "info"
      );
    }
  };

  const speakMnemonic = (text: string) => {
    speakText(text, { rate: 0.9 });
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-3 sm:p-6 text-slate-100 space-y-6">
      
      {/* HEADER BAR */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-indigo-950/80 border border-emerald-500/30 p-5 rounded-3xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20 shrink-0">
            <Brain className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-widest border border-emerald-500/30">
                2030 NEXT-GEN AI FEATURE
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-1">
              {language === 'hindi' ? '🧠 AI न्यूरल नॉलेज सिनेप्स व मेमोरी मैप' : '🧠 AI Neural Knowledge Synapse & Retention Map'}
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              {language === 'hindi' 
                ? 'स्मृति हानि पूर्वानुमान, गहन चित्रमय व्याख्या, हाइलाइटेड परीक्षा बिंदु एवं असीमित विषय खोज!' 
                : 'Memory decay prediction, visual diagrams, deep highlighted explanations & unlimited custom search!'}
            </p>
          </div>
        </div>

        {/* OVERALL SYNAPSE HEALTH CARD */}
        <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-2xl flex items-center gap-4 shrink-0 shadow-inner">
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={synapseHealthScore > 70 ? "text-emerald-400" : synapseHealthScore > 40 ? "text-amber-400" : "text-rose-500"}
                strokeDasharray={`${synapseHealthScore}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-black text-white">{synapseHealthScore}%</span>
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              {language === 'hindi' ? 'मस्तिष्क मति स्कोर' : 'Brain Synapse Health'}
            </span>
            <span className={`text-xs font-extrabold ${synapseHealthScore > 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {synapseHealthScore > 70 ? 'Strong Retention 🟢' : 'Memory Decaying 🔴'}
            </span>
          </div>
        </div>
      </div>

      {/* UNIVERSAL SEARCH & AI NODE GENERATOR BAR */}
      <form onSubmit={handleSearchOrGenerate} className="relative w-full">
        <div className="bg-slate-900 border-2 border-emerald-500/40 focus-within:border-emerald-400 rounded-2xl p-1.5 flex items-center gap-2 shadow-xl">
          <Search className="w-5 h-5 text-emerald-400 ml-3 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'hindi'
                ? "किसी भी विषय/अनुच्छेद/नियम को खोजें या AI से नया न्यूरल नोड बनवाएं (e.g. Article 370, Periodic Table, Chauri Chaura, Trigonometry)..."
                : "Search any topic, article or formula, or ask AI to build a new Neural Node (e.g. Article 370, Periodic Table)..."
            }
            className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none px-2 py-1 font-medium"
            disabled={isSearchingAI}
          />
          <button
            type="submit"
            disabled={isSearchingAI || !searchQuery.trim()}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black rounded-xl text-xs transition-all border-none cursor-pointer flex items-center gap-2 shrink-0 active:scale-95 disabled:opacity-40"
          >
            {isSearchingAI ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>AI Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{language === 'hindi' ? 'खोजें व AI नोड बनाएं' : 'Search & Generate AI Node'}</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* MAIN TWO COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT: 2D SYNAPSE CANVAS GRAPH (7 COLS) */}
        <div className="lg:col-span-6 bg-[#070B14] border border-slate-800 p-4 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col items-center">
          
          <div className="w-full flex items-center justify-between mb-3 px-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" />
              {language === 'hindi' ? 'लाइव न्यूरल सिनेप्स ग्राफ (क्लिक करके जांचें)' : 'Live Brain Synapse Graph (Click any node)'}
            </span>

            {/* LEGEND BADGES */}
            <div className="flex items-center gap-1.5 text-[9px] font-bold">
              <span className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                ● High
              </span>
              <span className="text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                ● Fading
              </span>
              <span className="text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20 animate-pulse">
                ● Danger
              </span>
            </div>
          </div>

          <canvas 
            ref={canvasRef} 
            width={680} 
            height={500} 
            onClick={handleCanvasClick}
            className="w-full h-auto bg-[#03060E] rounded-2xl border border-slate-850 cursor-pointer shadow-inner touch-none"
          />

          <p className="text-[11px] text-slate-400 mt-3 text-center">
            💡 {language === 'hindi' ? 'टिप: किसी भी नोड पर क्लिक करके विस्तृत सचित्र व्याख्या, चित्र और हाइलाइट किए गए परीक्षा बिंदु देखें।' : 'Tip: Click any node to open its detailed visual explanation, image diagrams, and highlighted exam points.'}
          </p>
        </div>

        {/* RIGHT: SELECTED NODE DEEP CONCEPTUAL BREAKDOWN & IMAGES (6 COLS) */}
        <div className="lg:col-span-6 space-y-4">
          
          {selectedNode ? (
            <div className="bg-[#0A0E1A] border border-indigo-500/30 p-5 rounded-3xl shadow-2xl space-y-5">
              
              {/* NODE TITLE & CATEGORY */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="px-2.5 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 text-[10px] font-extrabold uppercase border border-indigo-500/30">
                    {selectedNode.category}
                  </span>
                  <h2 className="text-base sm:text-lg font-extrabold text-white mt-1.5 leading-snug">
                    {selectedNode.subject}
                  </h2>
                </div>

                <div className={`px-3 py-1 rounded-xl text-center shrink-0 border ${
                  selectedNode.retentionScore >= 75 
                    ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40' 
                    : selectedNode.retentionScore >= 50 
                      ? 'bg-amber-950/80 text-amber-400 border-amber-500/40' 
                      : 'bg-rose-950/80 text-rose-400 border-rose-500/40 animate-pulse'
                }`}>
                  <span className="text-xs font-black block">{selectedNode.retentionScore}%</span>
                  <span className="text-[8px] uppercase tracking-wider font-extrabold block">Health</span>
                </div>
              </div>

              {/* VISUAL CONCEPT DIAGRAM / ILLUSTRATION CARD */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 group">
                <img 
                  src={selectedNode.imageUrl} 
                  alt={selectedNode.subject}
                  className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E1A] via-transparent to-transparent" />
                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs text-white">
                  <span className="flex items-center gap-1 font-bold text-emerald-300 bg-slate-950/80 px-2.5 py-1 rounded-xl border border-emerald-500/30">
                    <ImageIcon className="w-3.5 h-3.5" />
                    {language === 'hindi' ? 'सचित्र आरेख व दृश्य अवधारण' : 'Visual Concept Diagram'}
                  </span>
                </div>
              </div>

              {/* HIGHLIGHTED IMPORTANT EXAM POINTS (USER DEMAND) */}
              <div className="bg-gradient-to-r from-amber-950/50 via-slate-900 to-emerald-950/50 border border-amber-500/40 p-4 rounded-2xl space-y-2">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-black text-amber-300 uppercase tracking-wider">
                    {language === 'hindi' ? '🔥 परीक्षा हेतु अति-महत्वपूर्ण बिंदु (Highlighted Important Key Points):' : '🔥 Highlighted Important Key Points for Exams:'}
                  </h3>
                </div>
                
                <div className="space-y-1.5 pt-1">
                  {selectedNode.importantHighlights.map((hl, i) => (
                    <div key={i} className="p-2 bg-slate-950/80 border border-amber-500/20 rounded-xl text-xs font-bold text-amber-100 flex items-start gap-2">
                      <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* DEEP CONCEPTUAL EXPLANATION SECTION */}
              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-sky-400 text-xs font-extrabold uppercase tracking-wider">
                  <BookOpen className="w-4 h-4" />
                  <span>{language === 'hindi' ? '📖 गहन अवधारणात्मक व्याख्या (Deep Concept Breakdown):' : '📖 Deep Conceptual Breakdown:'}</span>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line font-medium pt-1">
                  {selectedNode.deepExplanation}
                </p>
              </div>

              {/* EXAM PYQ ALERT BADGE */}
              <div className="bg-sky-950/60 border border-sky-500/30 p-3 rounded-2xl text-xs flex items-center gap-2 text-sky-200">
                <ShieldAlert className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="font-bold">{selectedNode.examAlert}</span>
              </div>

              {/* AI GENERATED MNEMONIC TRICK */}
              <div className="bg-gradient-to-r from-emerald-950/40 to-slate-900 p-3.5 rounded-2xl border border-emerald-500/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-emerald-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    {language === 'hindi' ? 'AI स्मरण ट्रिक (Mnemonic Hack):' : 'AI Mnemonic Retention Hack:'}
                  </span>
                  <button
                    onClick={() => speakMnemonic(selectedNode.mnemonic)}
                    className="p-1 text-emerald-300 hover:text-white hover:bg-emerald-500/20 rounded-lg transition-all border-none bg-transparent cursor-pointer"
                    title="Read Mnemonic Aloud"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs font-bold text-emerald-100 italic">
                  "{selectedNode.mnemonic}"
                </p>
              </div>

              {/* INSTANT MEMORY BOOSTER QUIZ TRIGGER */}
              <div className="pt-2">
                <button
                  onClick={() => generateBoosterQuiz(selectedNode)}
                  disabled={isBoosterLoading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white rounded-2xl text-xs font-extrabold shadow-xl transition-all cursor-pointer border-none flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  {isBoosterLoading ? (
                    <>
                      <RotateCcw className="w-4 h-4 animate-spin" />
                      <span>{language === 'hindi' ? 'AI क्विज तैयार हो रहा है...' : 'Generating Neural Booster...'}</span>
                    </>
                  ) : (
                    <>
                      <Award className="w-4 h-4" />
                      <span>
                        {language === 'hindi' 
                          ? '⚡ 2 मिनट बूस्टर टेस्ट दें (स्मृति 100% रिस्टोर करें)' 
                          : '⚡ Take 2-Min Booster Test (Restore to 100%)'}
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* ACTIVE BOOSTER QUIZ MODAL / CARD */}
              {activeQuizQuestion && (
                <div className="bg-slate-950 border border-emerald-500/40 p-4 rounded-2xl space-y-3 animate-fade-in shadow-2xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-black text-emerald-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      {language === 'hindi' ? 'स्मृति रीस्टोरर प्रश्न' : 'Memory Synapse Booster Question'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">1/1 MCQ</span>
                  </div>

                  <p className="text-xs font-bold text-white">
                    {activeQuizQuestion.question}
                  </p>

                  <div className="space-y-1.5">
                    {activeQuizQuestion.options.map((opt: string, idx: number) => {
                      const isCorrect = idx === activeQuizQuestion.answerIndex;
                      const isSelected = selectedAnswerIdx === idx;

                      let btnStyle = "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700";
                      if (isQuizCompleted) {
                        if (isCorrect) btnStyle = "bg-emerald-950 border-emerald-500 text-emerald-200 font-bold";
                        else if (isSelected) btnStyle = "bg-rose-950 border-rose-500 text-rose-200";
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => !isQuizCompleted && handleAnswerSubmit(idx)}
                          disabled={isQuizCompleted}
                          className={`w-full text-left p-2.5 rounded-xl text-xs border transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {isQuizCompleted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        </button>
                      );
                    })}
                  </div>

                  {isQuizCompleted && (
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                      <span className="font-bold text-emerald-400 block">💡 Explanation:</span>
                      <p>{activeQuizQuestion.explanation}</p>
                    </div>
                  )}
                </div>
              )}

            </div>
          ) : (
            <div className="bg-[#0A0E1A] border-2 border-dashed border-slate-800 p-8 rounded-3xl text-center text-slate-400 space-y-4 shadow-xl flex flex-col items-center justify-center min-h-[380px]">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
                <Search className="w-8 h-8 animate-pulse" />
              </div>
              <div className="space-y-1.5 max-w-md">
                <h3 className="text-sm font-black text-white">
                  {language === 'hindi' 
                    ? 'विषय खोजें या न्यूरल नोड पर क्लिक करें' 
                    : 'Search Topic or Click Any Neural Node'}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  {language === 'hindi' 
                    ? 'ऊपर सर्च बार में कोई भी विषय (जैसे Fundamental Rights, Periodic Table, Repo Rate, Shorthand) लिखें या बायें न्यूरल मैप के किसी नोड पर क्लिक करें — तब उसकी स्मृति हानि स्थिति, सचित्र आरेख और मुख्य बिंदु दिखाई देंगे।' 
                    : 'Search any exam topic or click a node on the left neural graph to reveal its detailed memory retention diagnostics, visual diagram and high-yield exam points.'}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {nodes.slice(0, 4).map(n => (
                  <button
                    key={n.id}
                    onClick={() => setSelectedNode(n)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-emerald-950/60 border border-slate-800 hover:border-emerald-500/40 text-[11px] font-bold text-slate-300 hover:text-emerald-300 transition-all cursor-pointer"
                  >
                    📍 {n.subject.split(':')[0]}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

