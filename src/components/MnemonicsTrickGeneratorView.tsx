import React, { useState } from 'react';
import { 
  Sparkles, Brain, BookOpen, Volume2, VolumeX, Copy, Check, Search, 
  Flame, Award, Zap, RefreshCw, Bookmark, Share2, HelpCircle, FileText
} from 'lucide-react';
import { speakText, stopAllSpeech } from '../utils/speechUtils';

export interface MnemonicItem {
  id: string;
  topic: string;
  subject: 'Polity' | 'History' | 'Science' | 'Geography' | 'Maths' | 'Medical' | 'Teaching' | 'General';
  title: string;
  acronymOrCode: string;
  storyTrickHindi: string;
  explanation: string;
  examUsage: string;
  tags: string[];
}

const PRESET_MNEMONICS: MnemonicItem[] = [
  {
    id: 'medical-cranial-nerves',
    topic: '12 Cranial Nerves in Human Body (12 कपाल तंत्रिकाएं)',
    subject: 'Medical',
    title: '12 कपाल तंत्रिकाओं का क्रम (12 Cranial Nerves)',
    acronymOrCode: 'OOOTTAFVGVAH (Oh Oh Oh To Touch And Feel Very Good Velvet AH)',
    storyTrickHindi: 'ट्रिक: "OOOTTAFVGVAH"\nI - Olfactory (घ्राण - सूंघना)\nII - Optic (दृष्टि - देखना)\nIII - Oculomotor (नेत्र गति)\nIV - Trochlear (ट्रॉक्लियर)\nV - Trigeminal (ट्राइजेमिनल - चेहरा संवेदना)\nVI - Abducens (एब्ड्यूसेंस)\nVII - Facial (चेहरा भाव व स्वाद)\nVIII - Vestibulocochlear (सुनना व संतुलन)\nIX - Glossopharyngeal (जीभ व निगलना)\nX - Vagus (वेगस - हृदय व आंत)\nXI - Accessory (गर्दन व कंधा)\nXII - Hypoglossal (जीभ गति)',
    explanation: 'क्रेनियल नर्व्स का यह क्रम (I से XII) न्यूरो-एनाटॉमी का सबसे महत्वपूर्ण हिस्सा है। 10वीं नर्व "Vagus" सबसे लंबी नर्व है जो हृदय, फेफड़े और पाचन तंत्र को नियंत्रित करती है।',
    examUsage: 'NEET UG, MBBS First Prof Anatomy, AIIMS Nursing & CHO: Trigeminal & Vagus nerve functions.',
    tags: ['Medical', 'Anatomy', 'Cranial Nerves', 'NEET', 'Nursing', 'MBBS']
  },
  {
    id: 'medical-essential-amino-acids',
    topic: '9 Essential Amino Acids (आवश्यक अमीनो अम्ल)',
    subject: 'Medical',
    title: 'आवश्यक अमीनो अम्ल (Essential Amino Acids)',
    acronymOrCode: 'PVT TIM HALL (प्राइवेट टिम हॉल)',
    storyTrickHindi: 'ट्रिक: "PVT TIM HALL"\nP - Phenylalanine (फेनिलएलनिन)\nV - Valine (वेलिन)\nT - Threonine (थ्रिओनिन)\nT - Tryptophan (ट्रिप्टोफैन)\nI - Isoleucine (आइसोल्यूसीन)\nM - Methionine (मेथियोनीन)\nH - Histidine (हिस्टिडीन - बच्चों में आवश्यक)\nA - Arginine (आर्जिनिन - सेमी-एसेंशियल)\nL - Leucine (ल्यूसीन)\nL - Lysine (लाइसिन)',
    explanation: 'ये 9 अमीनो अम्ल हमारा शरीर खुद नहीं बना सकता, इन्हें भोजन के माध्यम से लेना अनिवार्य होता है। "PVT TIM HALL" ट्रिक से इन्हें 5 सेकंड में याद रखें।',
    examUsage: 'NEET Biology, Biochemistry & GPAT: Essential vs Non-essential amino acids categorization.',
    tags: ['Medical', 'Biochemistry', 'NEET', 'Pharma', 'Nutrition']
  },
  {
    id: 'medical-antibiotics-ribosome',
    topic: 'Protein Synthesis Inhibitor Antibiotics (30S vs 50S)',
    subject: 'Medical',
    title: 'एंटीबायोटिक्स प्रोटीन संश्लेषण अवरोधक (30S vs 50S)',
    acronymOrCode: 'Buy AT 30, CELL at 50',
    storyTrickHindi: 'ट्रिक: "Buy AT 30, CELL at 50"\n• 30S Subunit Inhibitors (AT 30):\n  A - Aminoglycosides (Streptomycin, Gentamicin)\n  T - Tetracyclines (Doxycycline)\n\n• 50S Subunit Inhibitors (CELL 50):\n  C - Chloramphenicol\n  E - Erythromycin (Macrolides / Azithromycin)\n  L - Linezolid\n  L - Clindamycin',
    explanation: 'बैक्टीरिया के 70S राइबोसोम के दो सबयूनिट होते हैं: 30S और 50S। "Buy AT 30, CELL at 50" से याद रहता है कि कौन सी एंटीबायोटिक किस सबयूनिट को ब्लॉक करती है।',
    examUsage: 'NEET PG, GPAT Pharmacist, Nursing & Microbiology exams.',
    tags: ['Medical', 'Pharmacology', 'Antibiotics', 'GPAT', 'Nursing']
  },
  {
    id: 'teaching-piaget-stages',
    topic: 'Jean Piaget 4 Cognitive Development Stages (पियाजे के 4 चरण)',
    subject: 'Teaching',
    title: 'जीन पियाजे के संज्ञानात्मक विकास के 4 चरण',
    acronymOrCode: 'SPCF (Some People Can Fly / सं-पू-मू-औ)',
    storyTrickHindi: 'ट्रिक: "SPCF" (संवेदी -> पूर्व -> मूर्त -> औपचारिक)\n1. S (Sensorimotor / संवेदी-गामक): 0 से 2 वर्ष (Object Permanence - वस्तु स्थायित्व)\n2. P (Pre-operational / पूर्व-संक्रियात्मक): 2 से 7 वर्ष (Egocentrism, Animism, Centration)\n3. C (Concrete Operational / मूर्त-संक्रियात्मक): 7 से 11 वर्ष (Conservation, Classification, Reversibility)\n4. F (Formal Operational / औपचारिक-अमूर्त): 11+ वर्ष (Hypothetico-Deductive Logic, Abstract Thinking)',
    explanation: 'जीन पियाजे का संज्ञानात्मक विकास सिद्धांत शिक्षक भर्ती (CTET/TET) का सबसे प्रमुख विषय है। SPCF क्रम से उम्र और विशेषताएं याद रहती हैं।',
    examUsage: 'CTET Paper 1 & 2, UP TET, KVS, B.Ed: Object permanence and conservation stage questions.',
    tags: ['Teaching', 'Pedagogy', 'CDP', 'CTET', 'Piaget']
  },
  {
    id: 'science-taxonomy',
    topic: 'Biological Classification Hierarchy (वर्गीकरण पदानुक्रम)',
    subject: 'Science',
    title: 'जीव विज्ञान वर्गीकरण पदानुक्रम (Taxonomy Hierarchy)',
    acronymOrCode: 'KPCOFGS (Keep Ponds Clean Or Fish Get Sick)',
    storyTrickHindi: 'ट्रिक: "KPCOFGS" (जगत -> संघ -> वर्ग -> गण -> कुल -> वंश -> जाति)\nK - Kingdom (जगत)\nP - Phylum / Division (संघ / प्रभाग)\nC - Class (वर्ग)\nO - Order (गण)\nF - Family (कुल)\nG - Genus (वंश)\nS - Species (जाति - सबसे छोटी मूल इकाई)',
    explanation: 'कार्ल लिनियस द्वारा दिए गए वर्गीकरण का सर्वोच्च स्तर Kingdom और सबसे बुनियादी स्तर Species है।',
    examUsage: 'NEET Biology, 11th Board, State TGT/PGT Biology.',
    tags: ['Science', 'Medical', 'Biology', 'NEET', 'Taxonomy']
  },
  {
    id: 'polity-schedules',
    topic: 'Indian Constitution: 12 Schedules',
    subject: 'Polity',
    title: 'संविधान की 12 अनुसूचियाँ (12 Schedules of Constitution)',
    acronymOrCode: 'TEARS OF OLD PM',
    storyTrickHindi: 'ट्रिक: "TEARS OF OLD PM"\nT - Territories (1st)\nE - Emoluments/Salaries (2nd)\nA - Affirmations/Oaths (3rd)\nR - Rajya Sabha Seats (4th)\nS - Scheduled Areas (5th)\nO - Other Tribal Areas (6th)\nF - Federal List/3 Lists (7th)\nO - Official Languages (8th)\nL - Land Reforms (9th)\nD - Defection Law (10th)\nP - Panchayats (11th)\nM - Municipalities (12th)',
    explanation: 'इस 14-अक्षर के कोड (TEARS OF OLD PM) से संविधान की सभी 12 अनुसूचियाँ क्रम से याद रहती हैं। 9वीं से 12वीं अनुसूची संशोधनों द्वारा जोड़ी गई थीं।',
    examUsage: 'SSC CGL, UPSC Prelims & Railway exams: 10th Schedule (Anti-defection) and 11th/12th Schedule amendments are repeatedly asked.',
    tags: ['Polity', 'Constitution', 'Schedules', 'SSC', 'UPSC']
  },
  {
    id: 'history-mughals',
    topic: 'Mughal Dynasty Chronology (मुगल शासक क्रम)',
    subject: 'History',
    title: 'मुगल सम्राटों का कालानुक्रम (Mughal Emperors Sequence)',
    acronymOrCode: 'B-H-A-J-S-A (भाजसा)',
    storyTrickHindi: 'ट्रिक: "BHAJSA" (भाजसा)\nB - Babur (बाबर - 1526)\nH - Humayun (हुमायूँ - 1530)\nA - Akbar (अकबर - 1556)\nJ - Jahangir (जहाँगीर - 1605)\nS - Shah Jahan (शाहजहाँ - 1627)\nA - Aurangzeb (औरंगज़ेब - 1658)',
    explanation: 'जैसे राजनीतिक पार्टी का नाम BHAJPA होता है, वैसे ही इतिहास के प्रमुख 6 मुगल शासकों का क्रम "BHAJSA" से याद रखें।',
    examUsage: 'History PYQs: Battles fought by Babur, Akbar\'s Mansabdari system, and Shah Jahan\'s architecture period.',
    tags: ['History', 'Mughals', 'Chronology', 'Medieval History']
  },
  {
    id: 'history-delhi-sultanate',
    topic: 'Delhi Sultanate 5 Dynasties (दिल्ली सल्तनत वंश)',
    subject: 'History',
    title: 'दिल्ली सल्तनत के 5 राजवंशों का क्रम',
    acronymOrCode: 'गुड़ खा तू सैय्यद लोदी (Gool Khile To Saiyad Lodi)',
    storyTrickHindi: 'कविता ट्रिक: "गुड़ खा ले तो सांस लोदी"\n1. गुलाम वंश (Slave/Mamluk - 1206)\n2. खिलजी वंश (Khilji - 1290)\n3. तुगलक वंश (Tughlaq - 1320)\n4. सैय्यद वंश (Sayyid - 1414)\n5. लोदी वंश (Lodi - 1451)',
    explanation: 'गुड़ (गुलाम), खा (खिलजी), तू (तुगलक), सैय्यद (सैय्यद), लोदी (लोदी)। सबसे लंबा शासन तुगलक वंश और सबसे छोटा खिलजी वंश का था।',
    examUsage: 'SSC CGL / RRB NTPC: First and last dynasties of Delhi Sultanate and founders of each dynasty.',
    tags: ['History', 'Delhi Sultanate', 'Chronology']
  },
  {
    id: 'science-reactivity',
    topic: 'Reactivity Series of Metals (धातुओं की सक्रियता श्रेणी)',
    subject: 'Science',
    title: 'धातुओं की क्रियाशीलता श्रेणी (Metal Reactivity)',
    acronymOrCode: 'Please Stop Calling Me A Careless Zebra Instead Try Learning How Copper Saves Gold',
    storyTrickHindi: 'ट्रिक: "केदार नाथ का माली आलू जरा फीके पकाता है"\nK - Kedar (Potassium K)\nNa - Nath (Sodium Na)\nCa - Ka (Calcium Ca)\nMg - Mali (Magnesium Mg)\nAl - Aalu (Aluminium Al)\nZn - Zara (Zinc Zn)\nFe - Pheeke (Iron Fe)\nPb - Pakata (Lead Pb)\nH - Hai (Hydrogen H)\nCu - Court (Copper Cu)\nHg - Hai (Mercury Hg)\nAg - Aapka (Silver Ag)\nAu - Aur (Gold Au)',
    explanation: 'इस ट्रिक "केदारनाथ का माली आलू जरा फीके पकाता है" से टॉप से बॉटम तक पूरी मेटल रिएक्टीविटी सीरीज़ याद हो जाती है। सबसे अधिक सक्रिय पोटैशियम (K) है।',
    examUsage: 'Class 10 Board, NEET, Railway Group D: Displacement reaction questions & rusting prevention.',
    tags: ['Science', 'Chemistry', 'Reactivity Series']
  },
  {
    id: 'geography-ganga',
    topic: 'Ganga River Right Bank Tributaries',
    subject: 'Geography',
    title: 'गंगा की दाहिनी तट की सहायक नदियाँ (Right Bank Tributaries)',
    acronymOrCode: 'Y-S-K (यमुना, सोन, कर्मनाशा)',
    storyTrickHindi: 'ट्रिक: "यमुना जी के साथ सोन का संगम"\n1. यमुना (Yamuna - सबसे बड़ी सहायक নদী)\n2. सोन (Son - अमरकंटक से निकलती है)\n3. पुनपुन (Punpun)\n4. कर्मनाशा (Karmanasa)',
    explanation: 'गंगा नदी की दक्षिण/दाहिनी ओर से मिलने वाली मुख्य नदियाँ यमुना और सोन हैं। सोन नदी पटना के पास गंगा में मिलती है।',
    examUsage: 'UPSC & State PCS: Rivers originating from Amarkantak plateau & right vs left bank tributaries.',
    tags: ['Geography', 'Rivers', 'Ganga System']
  },
  {
    id: 'polity-writs',
    topic: 'Article 32: 5 Types of Writs (5 प्रकार की रिट)',
    subject: 'Polity',
    title: 'अनुच्छेद 32 के तहत 5 संवैधानिक रिट',
    acronymOrCode: 'H-M-P-C-Q (Habeas Corpus, Mandamus, Prohibition, Certiorari, Quo-Warranto)',
    storyTrickHindi: 'हिंदी ट्रिक: "हमे प्रो-सर्टिफिकेट क्यों मिला?"\nह (Habeas Corpus - बंदी प्रत्यक्षीकरण: शरीर प्रस्तुत करो)\nमे (Mandamus - परमादेश: हम आदेश देते हैं)\nप्रो (Prohibition - प्रतिषेध: रोक लगाओ)\nसर्टि (Certiorari - उत्प्रेषण: पूर्णतया सूचित करो)\nक्यों (Quo-Warranto - अधिकार-पृच्छा: आपका क्या अधिकार है?)',
    explanation: 'इस ट्रिक से 5 संवैधानिक रिट्स के नाम और उनका अर्थ आसानी से याद रहता है। डॉ. आंबेडकर ने अनुच्छेद 32 को संविधान की आत्मा कहा था।',
    examUsage: 'UPSC & SSC CGL: Match the following writs with their literal Latin meanings.',
    tags: ['Polity', 'Writs', 'Article 32']
  }
];

interface MnemonicsTrickGeneratorViewProps {
  showToast: (msg: string, type: 'success' | 'error' | 'info' | 'warn') => void;
  language: 'hindi' | 'english';
}

export const MnemonicsTrickGeneratorView: React.FC<MnemonicsTrickGeneratorViewProps> = ({ showToast, language }) => {
  const [mnemonicList, setMnemonicList] = useState<MnemonicItem[]>(PRESET_MNEMONICS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMnemonic, setActiveMnemonic] = useState<MnemonicItem>(PRESET_MNEMONICS[0]);
  
  const [customTopicInput, setCustomTopicInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  // Generate Custom Mnemonic with AI
  const handleGenerateCustomMnemonic = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = (customTopicInput || searchQuery).trim();
    if (!query) return;

    setIsGenerating(true);
    showToast(
      language === 'hindi'
        ? `✨ "${query}" के लिए जादुई ट्रिक व कहानी तैयार हो रही है...`
        : `✨ Creating AI mnemonic trick for "${query}"...`,
      'info'
    );

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Create a super memorable Hindi & English mnemonic/trick, acronym, rhyme story, explanation and exam usage for topic: "${query}". Format response in clear structured sections.`,
          systemInstruction: `You are HansAI Memory Trick Architect. Generate clever, funny, and 100% memorable mnemonics in Hindi and English for student exam preparation.`
        })
      });

      let aiText = '';
      if (res.ok) {
        const data = await res.json();
        aiText = data.reply || '';
      }

      const newItem: MnemonicItem = {
        id: `custom-mnemonic-${Date.now()}`,
        topic: query,
        subject: 'General',
        title: `AI Memory Trick: ${query}`,
        acronymOrCode: `MAGIC CODE: ${query.toUpperCase().slice(0, 6)}`,
        storyTrickHindi: aiText || `ट्रिक: "${query}" को याद रखने का आसान तरीका।\n• बिंदु 1: क्रम से याद रखें\n• बिंदु 2: मजेदार कहानी से जोड़ें।`,
        explanation: `AI द्वारा निर्मित विस्तृत विश्लेषण: ${query} के मुख्य अवधारणाओं को आसानी से याद रखने हेतु।`,
        examUsage: `Exam Point: Frequently tested in SSC, Railway & Competitive exams regarding ${query}.`,
        tags: ['Custom AI', 'Memory Trick', query]
      };

      setMnemonicList(prev => [newItem, ...prev]);
      setActiveMnemonic(newItem);
      setCustomTopicInput('');
      setSearchQuery('');
      showToast(
        language === 'hindi' ? `🎉 "${query}" की जादुई ट्रिक बन कर तैयार है!` : `🎉 Mnemonic created for "${query}"!`,
        'success'
      );
    } catch (err) {
      showToast('Could not generate mnemonic, try another topic.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast(language === 'hindi' ? '📋 ट्रिक कॉपी हो गई!' : '📋 Trick copied to clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeech = (id: string, text: string) => {
    if (speakingId === id) {
      stopAllSpeech();
      setSpeakingId(null);
    } else {
      stopAllSpeech();
      setSpeakingId(id);
      speakText(text, { rate: 0.95 });
    }
  };

  const filteredMnemonics = mnemonicList.filter(item => {
    const q = (searchQuery || customTopicInput).toLowerCase().trim();
    if (!q) return true;
    return item.topic.toLowerCase().includes(q) || 
      item.title.toLowerCase().includes(q) ||
      item.acronymOrCode.toLowerCase().includes(q) ||
      item.storyTrickHindi.toLowerCase().includes(q);
  });

  return (
    <div className="w-full max-w-7xl mx-auto p-3 sm:p-6 text-slate-100 space-y-6 animate-fade-in text-left">
      
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-amber-950/90 via-purple-950/80 to-slate-900 border-2 border-amber-500/40 p-5 rounded-3xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-xl shadow-amber-500/10 shrink-0">
            <Brain className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-widest border border-amber-500/30">
                10X MEMORY POWER
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-1">
              {language === 'hindi' ? '🧠 AI स्मार्ट निमोनिक्स व याद रखने की जादुई ट्रिक्स' : '🧠 AI Smart Mnemonics & Memory Trick Generator'}
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              {language === 'hindi'
                ? 'कठिन तारीखें, अनुच्छेद, सूत्र, नदियाँ व वैज्ञानिक नियम याद रखें — सीधा विषय लिखें और तुरंत ट्रिक पाएं!'
                : 'Instantly master tough formulas, historical dates, constitutional articles & science rules with AI tricks!'}
            </p>
          </div>
        </div>
      </div>

      {/* SEARCH OR GENERATE CUSTOM MNEMONIC */}
      <form onSubmit={handleGenerateCustomMnemonic} className="relative w-full">
        <div className="bg-slate-900 border-2 border-amber-500/50 focus-within:border-amber-400 rounded-2xl p-2 flex items-center gap-2 shadow-2xl">
          <Sparkles className="w-5 h-5 text-amber-400 ml-3 shrink-0 animate-bounce" />
          <input
            type="text"
            value={customTopicInput}
            onChange={(e) => {
              setCustomTopicInput(e.target.value);
              setSearchQuery(e.target.value);
            }}
            placeholder={
              language === 'hindi'
                ? "किसी भी टॉपिक का नाम लिखें (जैसे: Fundamental Rights, Periodic Table, Oceans, Akbar Battles, Trigonometry)..."
                : "Type any topic to get or generate memory trick (e.g. Fundamental Rights, Periodic Table, Rivers)..."
            }
            className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none px-2 py-1 font-semibold"
            disabled={isGenerating}
          />
          <button
            type="submit"
            disabled={isGenerating || !customTopicInput.trim()}
            className="px-5 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-xl text-xs transition-all border-none cursor-pointer flex items-center gap-2 shrink-0 active:scale-95 disabled:opacity-40 shadow-lg"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Creating Trick...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>{language === 'hindi' ? 'जादुई ट्रिक बनाएं' : 'Generate AI Trick'}</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT: LIST OF MNEMONICS (5 COLS) */}
        <div className="lg:col-span-5 space-y-3 max-h-[640px] overflow-y-auto pr-1 scrollbar-thin">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black uppercase text-amber-400 tracking-wider">
              {language === 'hindi' ? '📚 उपलब्ध मेमोरी ट्रिक्स लाइब्रेरी' : '📚 Memory Tricks Library'}
            </span>
            <span className="text-[10px] text-slate-400 font-bold">
              {filteredMnemonics.length} Tricks
            </span>
          </div>

          {filteredMnemonics.map(item => {
            const isSelected = activeMnemonic.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setActiveMnemonic(item)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 text-left active:scale-98 ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-950/80 to-purple-950/80 border-amber-400 text-white shadow-xl ring-2 ring-amber-400/30'
                    : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase border border-amber-500/30">
                    {item.subject}
                  </span>
                  <span className="text-[10px] font-mono text-amber-400 font-bold">{item.acronymOrCode}</span>
                </div>

                <h3 className="text-xs sm:text-sm font-black text-white leading-snug">
                  {item.title}
                </h3>

                <p className="text-[11px] text-slate-300 line-clamp-2 font-medium">
                  {item.storyTrickHindi}
                </p>
              </div>
            );
          })}
        </div>

        {/* RIGHT: ACTIVE MNEMONIC DETAILED BOARD (7 COLS) */}
        <div className="lg:col-span-7 bg-[#090D16] border-2 border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-5 text-left">
          
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase border border-amber-500/30">
                  {activeMnemonic.subject}
                </span>
                <span className="text-xs font-black text-slate-400">{activeMnemonic.topic}</span>
              </div>
              <h2 className="text-lg font-black text-white mt-1">
                {activeMnemonic.title}
              </h2>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleSpeech(activeMnemonic.id, `${activeMnemonic.title}. ${activeMnemonic.storyTrickHindi}. ${activeMnemonic.explanation}`)}
                className="p-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                title="Speak Trick"
              >
                {speakingId === activeMnemonic.id ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                <span>{speakingId === activeMnemonic.id ? 'Stop' : 'Hear Voice 🎙️'}</span>
              </button>

              <button
                onClick={() => handleCopyText(activeMnemonic.id, `${activeMnemonic.title}\n${activeMnemonic.storyTrickHindi}\n${activeMnemonic.explanation}`)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              >
                {copiedId === activeMnemonic.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedId === activeMnemonic.id ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* MNEMONIC ACRONYM BANNER */}
          <div className="p-4 bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-indigo-500/20 border-2 border-amber-400/50 rounded-2xl text-center space-y-1 shadow-inner">
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block">
              ⚡ KEYWORD & ACRONYM CODE
            </span>
            <span className="text-lg sm:text-xl font-black text-amber-300 font-mono tracking-wider">
              {activeMnemonic.acronymOrCode}
            </span>
          </div>

          {/* STORY / RHYME TRICK (हिंदी जादुई कहानी) */}
          <div className="bg-[#060A12] border border-slate-800 p-4.5 rounded-2xl space-y-2">
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider block flex items-center gap-1">
              <span>🎭</span>
              <span>{language === 'hindi' ? 'हिंदी जादुई ट्रिक व राइम (Mnemonics Story):' : 'Rhyme & Story Mnemonic:'}</span>
            </span>
            <p className="text-xs sm:text-sm text-slate-100 font-semibold leading-relaxed whitespace-pre-line">
              {activeMnemonic.storyTrickHindi}
            </p>
          </div>

          {/* EXPLANATION */}
          <div className="bg-[#060A12] border border-slate-800 p-4.5 rounded-2xl space-y-2">
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-wider block flex items-center gap-1">
              <span>📖</span>
              <span>{language === 'hindi' ? 'संपूर्ण व्याख्या व समझ (Concept Explanation):' : 'Concept Explanation:'}</span>
            </span>
            <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
              {activeMnemonic.explanation}
            </p>
          </div>

          {/* EXAM PYQ APPLICATION */}
          <div className="p-4 bg-amber-950/40 border border-amber-500/30 rounded-2xl space-y-1.5">
            <span className="text-[10px] font-black text-amber-300 uppercase tracking-wider flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'hindi' ? '🎯 प्रतियोगी परीक्षा प्रश्न (Exam Application):' : '🎯 Competitive Exam Application:'}</span>
            </span>
            <p className="text-xs text-amber-100 font-semibold leading-relaxed">
              {activeMnemonic.examUsage}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
