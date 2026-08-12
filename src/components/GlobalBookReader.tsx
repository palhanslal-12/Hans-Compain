import React, { useState, useEffect, useRef } from 'react';
import { speakText, stopAllSpeech } from '../utils/speechUtils';
import {
  Search, BookOpen, Volume2, VolumeX, Highlighter, Languages, Sparkles, Play,
  Pause, Bookmark, ChevronRight, CheckCircle2, ArrowLeft, RotateCcw, Share2,
  Copy, Plus, Trash2, Edit3, Eye, FileText, Check, AlertCircle, BarChart2,
  Brain, FilePlus, Layers, List, Maximize2, Minimize2, Settings, Zap, X,
  HelpCircle, RefreshCw, BookMarked, Sliders, ChevronDown
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Set PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

interface GlobalBookReaderProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info' | 'warn') => void;
  language: string;
  onBackToChat?: () => void;
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  pageStart?: number;
  pageEnd?: number;
  highlights?: string[];
}

export interface HighlightItem {
  id: string;
  text: string;
  chapterId: string;
  pageNumber: number;
  category: 'important' | 'definition' | 'question' | 'revision';
  timestamp: string;
}

export interface BookmarkItem {
  id: string;
  chapterId: string;
  pageNumber: number;
  title: string;
  note?: string;
  timestamp: string;
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  chapterId: string;
  pageNumber: number;
  timestamp: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  pageRef?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  coverColor: string;
  description: string;
  totalPages: number;
  currentPage: number;
  lastOpenedChapterIndex: number;
  chapters: Chapter[];
  highlights: HighlightItem[];
  bookmarks: BookmarkItem[];
  notes: NoteItem[];
  quizHistory: { date: string; score: number; total: number }[];
  isCustomUploaded?: boolean;
}

// Pre-loaded NCERT & Standard Textbooks
const FEATURED_BOOKS: Book[] = [
  {
    id: 'ncert-polity',
    title: 'Indian Polity & Constitution (भारतीय राजव्यवस्था)',
    author: 'NCERT & M. Laxmikanth Series',
    category: 'Civics & Law',
    coverColor: 'from-amber-600 to-red-700',
    description: 'Complete breakdown of Indian Constitutional Assembly, Fundamental Rights, Preamble, Parliament & Judiciary.',
    totalPages: 384,
    currentPage: 12,
    lastOpenedChapterIndex: 0,
    highlights: [],
    bookmarks: [],
    notes: [],
    quizHistory: [],
    chapters: [
      {
        id: 'polity-ch1',
        title: 'Chapter 1: Preamble & Preamble Objectives (प्रस्तावना)',
        pageStart: 1,
        pageEnd: 15,
        content: `WE, THE PEOPLE OF INDIA, having solemnly resolved to constitute India into a SOVEREIGN SOCIALIST SECULAR DEMOCRATIC REPUBLIC and to secure to all its citizens:
JUSTICE, social, economic and political;
LIBERTY of thought, expression, belief, faith and worship;
EQUALITY of status and of opportunity; and to promote among them all
FRATERNITY assuring the dignity of the individual and the unity and integrity of the Nation.

Key Notes & Exam Highlights:
1. Sovereign (संप्रभु): India is internally supreme and externally independent. No foreign power can dictate terms to India.
2. Socialist (समाजवादी): Added by 42nd Constitutional Amendment Act, 1976. Refers to democratic socialism aiming to end poverty, ignorance, disease, and inequality of opportunity.
3. Secular (धर्मनिरपेक्ष): Equal respect and status to all religions in India without state sponsorship of any single religion.
4. Democratic (लोकतांत्रिक): Supreme power rests with the citizens who exercise their franchise through universal adult suffrage.
5. Republic (गणराज्य): The head of state (President of India) is elected by the people, not a hereditary monarch.`,
        highlights: ['SOVEREIGN SOCIALIST SECULAR DEMOCRATIC REPUBLIC', '42nd Constitutional Amendment Act, 1976', 'head of state is elected']
      },
      {
        id: 'polity-ch2',
        title: 'Chapter 2: Fundamental Rights (मौलिक अधिकार - Art. 12-35)',
        pageStart: 16,
        pageEnd: 45,
        content: `Fundamental Rights are enshrined in Part III of the Constitution from Articles 12 to 35. They guarantee civil liberties to all citizens and act as a limitation on executive and legislative actions.

6 Categories of Fundamental Rights:
1. Right to Equality (Articles 14-18) - Equality before law & prohibition of discrimination on grounds of religion, race, caste, sex, or place of birth.
2. Right to Freedom (Articles 19-22) - Freedom of speech, assembly, association, movement, residence, and profession.
3. Right against Exploitation (Articles 23-24) - Prohibition of human trafficking and forced labor.
4. Right to Freedom of Religion (Articles 25-28) - Freedom of conscience and free profession, practice, and propagation of religion.
5. Cultural and Educational Rights (Articles 29-30) - Protection of interests of minorities.
6. Right to Constitutional Remedies (Article 32) - Dr. B.R. Ambedkar termed Article 32 as the 'Heart and Soul of the Constitution' as it allows citizens to move Supreme Court for enforcement of rights via Writs (Habeas Corpus, Mandamus, Prohibition, Quo-Warranto, Certiorari).`,
        highlights: ['Part III of the Constitution', 'Dr. B.R. Ambedkar termed Article 32 as the Heart and Soul', 'Writs (Habeas Corpus, Mandamus)']
      }
    ]
  },
  {
    id: 'ncert-geography',
    title: 'Physical & Human Geography (भौतिक व मानव भूगोल)',
    author: 'NCERT & Majjid Husain',
    category: 'Geography & Earth Sciences',
    coverColor: 'from-blue-600 to-indigo-800',
    description: 'Earth crust dynamics, plate tectonics, solar system, atmosphere, ocean currents, and Indian physical divisions.',
    totalPages: 290,
    currentPage: 1,
    lastOpenedChapterIndex: 0,
    highlights: [],
    bookmarks: [],
    notes: [],
    quizHistory: [],
    chapters: [
      {
        id: 'geo-ch1',
        title: 'Chapter 1: The Solar System & Earth Motion (सौरमंडल व पृथ्वी की गतियाँ)',
        pageStart: 1,
        pageEnd: 20,
        content: `The Earth is the third planet from the Sun and the only astronomical object known to harbor life.

1. Earth Rotational Motion (परिभ्रमण): Earth rotates on its tilted axis (23.5°) from West to East in 23 hours 56 minutes and 4 seconds. Rotation causes Day and Night.
2. Earth Revolution Motion (परिक्रमण): Earth revolves around the Sun in an elliptical orbit in 365.25 days. Revolution along with axial inclination causes Seasons (Summer, Winter, Autumn, Spring).
3. Equinox (विषुव): On March 21 and September 23, direct sun rays fall on the Equator, resulting in equal day and night across the globe.
4. Solstice (अयानांत): Summer Solstice occurs on June 21 (longest day in Northern Hemisphere), and Winter Solstice occurs on December 22 (longest night in Northern Hemisphere).

Mnemonics & Memory Hacks:
- Tropic of Cancer (23.5° N) passes through 8 Indian States: Gujarat, Rajasthan, Madhya Pradesh, Chhattisgarh, Jharkhand, West Bengal, Tripura, Mizoram.`,
        highlights: ['Rotates on its tilted axis (23.5°)', 'Rotation causes Day and Night', 'Tropic of Cancer passes through 8 Indian States']
      }
    ]
  },
  {
    id: 'general-science',
    title: 'General Science & Physics (सामान्य विज्ञान व भौतिकी)',
    author: 'NCERT & Lucent Science Core',
    category: 'Science & Technology',
    coverColor: 'from-emerald-600 to-teal-800',
    description: 'Fundamental concepts of Physics, Chemistry, Biology, Optics, Thermodynamics, Cell Biology and Genetics.',
    totalPages: 240,
    currentPage: 1,
    lastOpenedChapterIndex: 0,
    highlights: [],
    bookmarks: [],
    notes: [],
    quizHistory: [],
    chapters: [
      {
        id: 'sci-ch1',
        title: 'Chapter 1: Newton Laws of Motion & Energy (न्यूटन के नियम व ऊर्जा)',
        pageStart: 1,
        pageEnd: 18,
        content: `Physics is the natural science that studies matter, its fundamental constituents, its motion and behavior through space and time, and the related entities of energy and force.

Newton's Three Laws of Motion:
1. First Law (Law of Inertia / जड़त्व का नियम): An object remains at rest or continues in uniform motion in a straight line unless acted upon by a net external force. (Example: Passengers jerk backward when a stationary bus suddenly starts).
2. Second Law (Force Formula F = m * a): The rate of change of momentum of a body is directly proportional to the applied force. (Example: A cricketer pulls his hands backward while catching a fast ball to reduce impact force).
3. Third Law (Action & Reaction / क्रिया-प्रतिक्रिया): For every action force, there is an equal and opposite reaction force. (Example: Rocket propulsion, swimming in water, recoil of a gun).

Work, Energy & Power Formulas:
- Work (W) = Force * Displacement * cos(θ)
- Kinetic Energy (KE) = 1/2 * m * v²
- Potential Energy (PE) = m * g * h
- Power (P) = Work / Time (Unit: Watt / Joule per second).`,
        highlights: ['F = m * a', 'Law of Inertia', 'Action & Reaction', 'Kinetic Energy = 1/2 * m * v²']
      }
    ]
  },
  {
    id: 'modern-history',
    title: 'Modern Indian History & Freedom Struggle (आधुनिक भारत का इतिहास)',
    author: 'Spectrum & Bipan Chandra',
    category: 'History',
    coverColor: 'from-amber-700 to-yellow-900',
    description: 'Chronological events from the arrival of European traders to Revolt of 1857, Indian National Congress, and Independence 1947.',
    totalPages: 310,
    currentPage: 1,
    lastOpenedChapterIndex: 0,
    highlights: [],
    bookmarks: [],
    notes: [],
    quizHistory: [],
    chapters: [
      {
        id: 'hist-ch1',
        title: 'Chapter 1: The Great Revolt of 1857 (1857 का प्रथम स्वतंत्रता संग्राम)',
        pageStart: 1,
        pageEnd: 22,
        content: `The Indian Rebellion of 1857 was a major uprising against the British East India Company rule, often termed the First War of Indian Independence.

Causes of 1857 Revolt:
1. Political Causes: Lord Dalhousie's Doctrine of Lapse (सतारा, झाँसी, नागपुर का विलय) and annexation of Awadh (1856) on grounds of misgovernance.
2. Military & Social Causes: Discrimination in salary, refusal of overseas allowance, introduction of Enfield Greased Cartridges (greased with pig and cow fat) which offended both Hindu and Muslim sepoys.
3. Key Leaders & Centers:
   - Delhi: Bahadur Shah Zafar & General Bakht Khan
   - Kanpur: Nana Sahib & Tantia Tope
   - Lucknow: Begum Hazrat Mahal
   - Jhansi: Rani Lakshmibai ("Khoob Ladi Mardaani, Woh Toh Jhansi Wali Rani Thi")
   - Bihar (Jagdishpur): Veer Kunwar Singh

Outcome & Significance:
- End of East India Company Rule; Government of India Act 1858 transferred direct administration to the British Crown via Queen Victoria's Proclamation.`,
        highlights: ['Doctrine of Lapse', 'Enfield Greased Cartridges', 'Veer Kunwar Singh', 'Government of India Act 1858']
      }
    ]
  },
  {
    id: 'computer-programming',
    title: 'Computer Science, Coding & AI (कंप्यूटर साइंस व कोडिंग)',
    author: 'HansAI Tech & Computer Science Series',
    category: 'Technology & Coding',
    coverColor: 'from-purple-600 to-indigo-900',
    description: 'Python, JavaScript, Data Structures, Web Development, Cloud Computing, and Artificial Intelligence fundamentals.',
    totalPages: 180,
    currentPage: 1,
    lastOpenedChapterIndex: 0,
    highlights: [],
    bookmarks: [],
    notes: [],
    quizHistory: [],
    chapters: [
      {
        id: 'cs-ch1',
        title: 'Chapter 1: Introduction to Programming & Algorithms',
        pageStart: 1,
        pageEnd: 25,
        content: `Programming is the process of creating a set of instructions that tell a computer how to perform a task.

Core Concepts of Software Engineering:
1. Variables & Data Types: Integer, Float, String, Boolean, Array, and Object.
2. Control Structures: If-Else Statements, Loops (For, While), and Switch Cases.
3. Functions & Methods: Reusable blocks of code that take inputs (arguments) and return outputs.
4. Algorithms & Time Complexity: Big-O Notation measures algorithmic efficiency.
   - O(1): Constant Time (Direct array lookup)
   - O(log n): Logarithmic Time (Binary Search)
   - O(n): Linear Time (Iterating through array)
   - O(n²): Quadratic Time (Nested loops / Bubble sort).

Sample Python Code:
def calculate_factorial(n):
    if n == 0 or n == 1:
        return 1
    return n * calculate_factorial(n - 1)

print("Factorial of 5 is:", calculate_factorial(5)) # Output: 120`,
        highlights: ['Big-O Notation', 'O(log n): Binary Search', 'Functions & Methods']
      }
    ]
  },
  {
    id: 'wings-of-fire',
    title: 'Wings of Fire: Autobiography (अग्नि की उड़ान)',
    author: 'Dr. A.P.J. Abdul Kalam & Arun Tiwari',
    category: 'Autobiography & Inspiration',
    coverColor: 'from-amber-600 to-amber-900',
    description: 'An inspirational journey of Dr. APJ Abdul Kalam from Rameswaram to becoming India’s Missile Man and 11th President.',
    totalPages: 220,
    currentPage: 1,
    lastOpenedChapterIndex: 0,
    highlights: [],
    bookmarks: [],
    notes: [],
    quizHistory: [],
    chapters: [
      {
        id: 'kalam-ch1',
        title: 'Chapter 1: Orientation & Early Life in Rameswaram (प्रारंभिक जीवन)',
        pageStart: 1,
        pageEnd: 30,
        content: `I was born into a middle-class Tamil family in the island town of Rameswaram in the erstwhile Madras State. My father, Jainulabdeen, had neither much formal education nor much wealth; despite these disadvantages, he possessed great innate wisdom and a true generosity of spirit.
        
My mother, Ashiamma, was an ideal helpmate to him. I was one of many children—a short boy with rather undistinguished looks, born to tall and handsome parents. We lived in our ancestral house, which was built in the middle of the 19th century.

Key Insights & Inspirations:
1. Hard Work & Faith: My father taught me that adverse situations always present opportunities for introspection.
2. The Power of Knowledge: Books were my early treasures, and learning fueled my ambition to serve India in science and technology.`,
        highlights: ['Adverse situations always present opportunities for introspection', 'Learning fueled my ambition']
      }
    ]
  },
  {
    id: 'godan-premchand',
    title: 'Godan (गोदान - मुंशी प्रेमचंद का महान उपन्यास)',
    author: 'Munshi Premchand (मुंशी प्रेमचंद)',
    category: 'Classic Hindi Literature & Novel',
    coverColor: 'from-rose-700 to-red-950',
    description: 'The epic story of Hori, Dhania, and rural Indian agrarian life, showcasing resilience, morality, and social realism.',
    totalPages: 340,
    currentPage: 1,
    lastOpenedChapterIndex: 0,
    highlights: [],
    bookmarks: [],
    notes: [],
    quizHistory: [],
    chapters: [
      {
        id: 'godan-ch1',
        title: 'अध्याय 1: होरी की अभिलाषा व गाय की लालसा',
        pageStart: 1,
        pageEnd: 25,
        content: `होरी महतो ने दोनों बैलों को सानी-पानी देकर अपनी स्त्री धनिया से कहा—"अपनी लठिया दे दे, ज़रा भोला की ओर हो आऊँ।"
धनिया ने लठिया ला कर हाथ में दे दी और बोली—"तो आज खेत पर न जाओगे?"

होरी के मन में एक गाय पाने की अगाध लालसा थी। गाय ग्रामीण जीवन में केवल धन नहीं, बल्कि प्रतिष्ठा और धर्म का प्रतीक थी। होरी के जीवन का सबसे बड़ा सपना अपने द्वार पर एक सुंदर गाय बाँधना था।

मुख्य पात्र व सामाजिक संदर्भ:
1. होरी: एक सीधा, धर्मपरायण और स्वाभिमानी किसान जो हर विपत्ति में भी अपनी मर्यादा नहीं खोता।
2. धनिया: होरी की पत्नी जो यथार्थवादी, साहसी और अन्याय के विरुद्ध आवाज़ उठाने वाली नारी है।
3. भोला: पास के गाँव का ग्वाला जिससे होरी गाय उधार मांगता है।`,
        highlights: ['होरी के मन में गाय पाने की अगाध लालसा', 'धनिया यथार्थवादी और साहसी नारी है']
      }
    ]
  },
  {
    id: 'atomic-habits',
    title: 'Atomic Habits (आदतों की ताकत)',
    author: 'James Clear',
    category: 'Self-Help & Productivity',
    coverColor: 'from-cyan-600 to-blue-900',
    description: 'An easy and proven framework for building good habits and breaking bad ones using 1% daily compounding improvements.',
    totalPages: 270,
    currentPage: 1,
    lastOpenedChapterIndex: 0,
    highlights: [],
    bookmarks: [],
    notes: [],
    quizHistory: [],
    chapters: [
      {
        id: 'habits-ch1',
        title: 'Chapter 1: The Surprising Power of Atomic Habits (1% प्रतिदिन सुधार)',
        pageStart: 1,
        pageEnd: 22,
        content: `Small habits don't add up; they compound. If you can get 1 percent better each day for one year, you'll end up thirty-seven times better by the time you're done. Conversely, if you get 1 percent worse each day for one year, you'll decline nearly down to zero.

The 4 Laws of Behavior Change:
1. Make it Obvious (स्पष्ट बनाएं)
2. Make it Attractive (आकर्षक बनाएं)
3. Make it Easy (सरल बनाएं)
4. Make it Satisfying (संतोषजनक बनाएं)

System Over Goals:
You do not rise to the level of your goals. You fall to the level of your systems. Focus on building habits that support your true identity.`,
        highlights: ['1 percent better each day', 'You fall to the level of your systems', '4 Laws of Behavior Change']
      }
    ]
  }
];

export const GlobalBookReader: React.FC<GlobalBookReaderProps> = ({
  showToast,
  language,
  onBackToChat
}) => {
  // Books Library & Storage
  const [books, setBooks] = useState<Book[]>(() => {
    try {
      const saved = localStorage.getItem('hansai-my-books-library');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Error reading saved books", e);
    }
    return FEATURED_BOOKS;
  });

  // Save books to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('hansai-my-books-library', JSON.stringify(books));
    } catch (e) {
      console.error("Failed to store books locally", e);
    }
  }, [books]);

  // Selected state
  const [selectedBook, setSelectedBook] = useState<Book | null>(() => books[0] || FEATURED_BOOKS[0]);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState<number>(() => selectedBook?.lastOpenedChapterIndex || 0);

  // Active View Tabs inside Book Study Mode: 'library' | 'reader' | 'ai-assistant' | 'recall' | 'quiz' | 'revision' | 'notes' | 'analytics'
  const [activeTab, setActiveTab] = useState<'library' | 'reader' | 'ai-assistant' | 'recall' | 'quiz' | 'revision' | 'notes' | 'analytics'>('reader');

  // Search & Filter state for Library
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'in-progress' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'progress'>('recent');

  // Reader Preferences
  const [readerTheme, setReaderTheme] = useState<'dark' | 'cream' | 'white'>('dark');
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const [fontFamily, setFontFamily] = useState<'sans' | 'serif' | 'mono'>('sans');
  const [lineSpacing, setLineSpacing] = useState<'normal' | 'relaxed' | 'loose'>('relaxed');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Reader Drawers / Overlays
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [isSearchInsideOpen, setIsSearchInsideOpen] = useState(false);
  const [insideSearchQuery, setInsideSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ chapterIdx: number; title: string; excerpt: string }[]>([]);

  // Text-To-Speech
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);

  // Text Selection Popup & Highlight
  const [selectedText, setSelectedText] = useState('');
  const [selectionPosition, setSelectionPosition] = useState<{ x: number; y: number } | null>(null);

  // File Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingAiBook, setIsGeneratingAiBook] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Universal AI Book Generator for searching ANY book across all genres (fiction, novels, non-fiction, literature, philosophy)
  const handleGenerateBookWithAI = async (queryText?: string) => {
    const titleToSearch = (queryText || searchQuery || "").trim();
    if (!titleToSearch) {
      showToast("Please enter a book title or author name to search/generate.", "warn");
      return;
    }

    setIsGeneratingAiBook(true);
    showToast(`Searching & generating book: "${titleToSearch}"...`, "info");

    try {
      const res = await fetch('/api/book/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookTitle: titleToSearch })
      });

      if (!res.ok) throw new Error("Failed to search book");

      const data = await res.json();
      if (data.book) {
        setBooks(prev => {
          const exists = prev.some(b => b.id === data.book.id || b.title.toLowerCase() === data.book.title.toLowerCase());
          if (exists) return prev;
          return [data.book, ...prev];
        });
        setSelectedBook(data.book);
        setSelectedChapterIndex(0);
        setActiveTab('reader');
        showToast(`📖 Loaded Book: "${data.book.title}"! Enjoy reading!`, "success");
      }
    } catch (err: any) {
      showToast("Error searching book. Generating standard edition...", "error");
    } finally {
      setIsGeneratingAiBook(false);
    }
  };

  // AI Assistant State
  const [aiMessages, setAiMessages] = useState<{ role: 'user' | 'assistant'; content: string; sourceRef?: string }[]>([
    {
      role: 'assistant',
      content: 'नमस्ते! मैं आपका HansAI Book Study Assistant हूँ। अपनी चुनी हुई किताब से कोई भी सवाल पूछें, या दिए गए Study Tools का उपयोग करें।'
    }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiExplanationMode, setAiExplanationMode] = useState<'simple' | 'normal' | 'detailed'>('simple');
  const [aiSummaryType, setAiSummaryType] = useState<'3-line' | 'short' | 'detailed'>('short');

  // Active Recall State
  const [recallQuestion, setRecallQuestion] = useState<string | null>(null);
  const [recallUserAnswer, setRecallUserAnswer] = useState('');
  const [recallFeedback, setRecallFeedback] = useState<string | null>(null);
  const [isRecallLoading, setIsRecallLoading] = useState(false);

  // Quiz State
  const [quizNumQuestions, setQuizNumQuestions] = useState<5 | 10 | 20>(5);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);

  // Smart Revision Sheet
  const [revisionSheet, setRevisionSheet] = useState<string | null>(null);
  const [isGeneratingRevision, setIsGeneratingRevision] = useState(false);

  // New Note Modal / Input
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);

  // Active Chapter helper
  const activeChapter = selectedBook?.chapters[selectedChapterIndex] || null;

  // Sync reading position when chapter changes
  const handleSelectChapter = (index: number) => {
    if (!selectedBook) return;
    setSelectedChapterIndex(index);
    setTranslatedText(null);
    if (isPlayingAudio) window.speechSynthesis.cancel();
    setIsPlayingAudio(false);

    // Calculate progress
    const totalCh = selectedBook.chapters.length || 1;
    const progress = Math.round(((index + 1) / totalCh) * 100);

    // Update book in state & local storage
    const updatedBooks = books.map(b => {
      if (b.id === selectedBook.id) {
        return {
          ...b,
          lastOpenedChapterIndex: index,
          currentPage: (b.chapters[index]?.pageStart || index + 1)
        };
      }
      return b;
    });

    setBooks(updatedBooks);
    setSelectedBook(prev => prev ? { ...prev, lastOpenedChapterIndex: index, currentPage: (prev.chapters[index]?.pageStart || index + 1) } : null);
  };

  // Translation State for Active Chapter
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [targetLanguage, setTargetLanguage] = useState<'original' | 'hindi' | 'english' | 'sanskrit' | 'hinglish'>('original');
  const [isTranslating, setIsTranslating] = useState(false);

  // Translate active chapter using backend chat route
  const handleTranslateChapter = async (lang: 'original' | 'hindi' | 'english' | 'sanskrit' | 'hinglish') => {
    setTargetLanguage(lang);
    if (lang === 'original') {
      setTranslatedText(null);
      showToast("Restored original language.", "info");
      return;
    }

    if (!activeChapter) return;
    setIsTranslating(true);
    showToast(`Translating into ${lang.toUpperCase()}...`, "info");

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `Translate the following book content into ${lang} language accurately with clear headings and bullet points:\n\n${activeChapter.content}`
            }
          ]
        })
      });

      const data = await res.json();
      if (data.reply) {
        setTranslatedText(data.reply);
        showToast(`Chapter translated into ${lang.toUpperCase()}! 🌐`, "success");
      } else {
        showToast("Translation failed. Try again.", "error");
      }
    } catch (err) {
      showToast("Translation error.", "error");
    } finally {
      setIsTranslating(false);
    }
  };

  // Text Selection Event Listener for Floating Menu
  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 3) {
      const text = selection.toString().trim();
      setSelectedText(text);
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelectionPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      });
    } else {
      setSelectedText('');
      setSelectionPosition(null);
    }
  };

  // Handle PDF/EPUB/TXT File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    showToast(`Processing & Extracting "${file.name}"... 📖`, "info");

    try {
      let extractedChapters: Chapter[] = [];
      const fileNameClean = file.name.replace(/\.[^/.]+$/, "");

      if (file.name.endsWith('.pdf')) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const totalPages = pdf.numPages;

        let fullText = '';
        let chapterList: Chapter[] = [];
        let currentChapterContent = '';
        let currentChapterTitle = 'Chapter 1: Initial Reading';
        let pageStart = 1;

        for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(' ');
          
          fullText += `\n--- Page ${pageNum} ---\n` + pageText;

          // Check if page looks like a new chapter heading
          if (pageText.match(/chapter|भाग|अध्याय|unit|section|lesson/i) && currentChapterContent.length > 200) {
            chapterList.push({
              id: `ch-${chapterList.length + 1}`,
              title: currentChapterTitle,
              content: currentChapterContent,
              pageStart,
              pageEnd: pageNum - 1
            });
            currentChapterTitle = `Chapter ${chapterList.length + 1}: ${pageText.slice(0, 40)}...`;
            currentChapterContent = pageText;
            pageStart = pageNum;
          } else {
            currentChapterContent += `\n${pageText}`;
          }
        }

        if (currentChapterContent) {
          chapterList.push({
            id: `ch-${chapterList.length + 1}`,
            title: currentChapterTitle,
            content: currentChapterContent,
            pageStart,
            pageEnd: totalPages
          });
        }

        extractedChapters = chapterList.length > 0 ? chapterList : [
          {
            id: 'ch-1',
            title: 'Complete Document Content',
            content: fullText,
            pageStart: 1,
            pageEnd: totalPages
          }
        ];

      } else {
        // Text / EPUB / Markdown file
        const text = await file.text();
        const paragraphs = text.split(/\n\s*\n/);
        
        extractedChapters = [
          {
            id: 'ch-1',
            title: `${fileNameClean} - Section 1`,
            content: text.slice(0, 5000),
            pageStart: 1,
            pageEnd: 10
          }
        ];

        if (text.length > 5000) {
          extractedChapters.push({
            id: 'ch-2',
            title: `${fileNameClean} - Section 2`,
            content: text.slice(5000, 10000),
            pageStart: 11,
            pageEnd: 20
          });
        }
      }

      const newBookObj: Book = {
        id: `user-book-${Date.now()}`,
        title: fileNameClean,
        author: 'Uploaded Document',
        category: 'My Study Files',
        coverColor: 'from-emerald-600 to-teal-800',
        description: `Custom textbook processed locally for offline & AI study.`,
        totalPages: extractedChapters.length * 15,
        currentPage: 1,
        lastOpenedChapterIndex: 0,
        chapters: extractedChapters,
        highlights: [],
        bookmarks: [],
        notes: [],
        quizHistory: [],
        isCustomUploaded: true
      };

      setBooks(prev => [newBookObj, ...prev]);
      setSelectedBook(newBookObj);
      setSelectedChapterIndex(0);
      setActiveTab('reader');
      showToast(`Successfully uploaded "${fileNameClean}"! Ready for AI Study. 📚`, "success");

    } catch (err) {
      console.error(err);
      showToast("Error extracting book content. Please try another PDF or TXT file.", "error");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Search inside current book
  const handleSearchInsideBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!insideSearchQuery.trim() || !selectedBook) return;

    const queryLower = insideSearchQuery.trim().toLowerCase();
    const results: { chapterIdx: number; title: string; excerpt: string }[] = [];

    selectedBook.chapters.forEach((ch, idx) => {
      if (ch.content.toLowerCase().includes(queryLower)) {
        const matchIdx = ch.content.toLowerCase().indexOf(queryLower);
        const start = Math.max(0, matchIdx - 40);
        const end = Math.min(ch.content.length, matchIdx + 80);
        const excerpt = "..." + ch.content.slice(start, end) + "...";
        results.push({
          chapterIdx: idx,
          title: ch.title,
          excerpt
        });
      }
    });

    setSearchResults(results);
    if (results.length === 0) {
      showToast(`No matches found for "${insideSearchQuery}".`, "warn");
    }
  };

  // Add Bookmark
  const handleToggleBookmark = () => {
    if (!selectedBook || !activeChapter) return;

    const existingIdx = selectedBook.bookmarks.findIndex(bm => bm.chapterId === activeChapter.id);
    let updatedBookmarks: BookmarkItem[] = [];

    if (existingIdx >= 0) {
      updatedBookmarks = selectedBook.bookmarks.filter(bm => bm.chapterId !== activeChapter.id);
      showToast("Bookmark removed.", "info");
    } else {
      const newBookmark: BookmarkItem = {
        id: `bm-${Date.now()}`,
        chapterId: activeChapter.id,
        pageNumber: activeChapter.pageStart || selectedChapterIndex + 1,
        title: activeChapter.title,
        timestamp: new Date().toLocaleDateString()
      };
      updatedBookmarks = [newBookmark, ...selectedBook.bookmarks];
      showToast("Page bookmarked! 🔖", "success");
    }

    const updatedBooks = books.map(b => b.id === selectedBook.id ? { ...b, bookmarks: updatedBookmarks } : b);
    setBooks(updatedBooks);
    setSelectedBook(prev => prev ? { ...prev, bookmarks: updatedBookmarks } : null);
  };

  // Add Highlight
  const handleAddHighlight = (category: 'important' | 'definition' | 'question' | 'revision') => {
    if (!selectedBook || !activeChapter || !selectedText) return;

    const newHighlight: HighlightItem = {
      id: `hl-${Date.now()}`,
      text: selectedText,
      chapterId: activeChapter.id,
      pageNumber: activeChapter.pageStart || selectedChapterIndex + 1,
      category,
      timestamp: new Date().toLocaleDateString()
    };

    const updatedHighlights = [newHighlight, ...selectedBook.highlights];
    const updatedBooks = books.map(b => b.id === selectedBook.id ? { ...b, highlights: updatedHighlights } : b);
    setBooks(updatedBooks);
    setSelectedBook(prev => prev ? { ...prev, highlights: updatedHighlights } : null);
    setSelectedText('');
    setSelectionPosition(null);
    showToast(`Saved highlight under ${category.toUpperCase()}! ✨`, "success");
  };

  // Add Note
  const handleSaveNote = () => {
    if (!selectedBook || !activeChapter || !newNoteContent.trim()) return;

    const newNote: NoteItem = {
      id: `note-${Date.now()}`,
      title: newNoteTitle.trim() || `Notes on ${activeChapter.title.slice(0, 25)}...`,
      content: newNoteContent,
      chapterId: activeChapter.id,
      pageNumber: activeChapter.pageStart || selectedChapterIndex + 1,
      timestamp: new Date().toLocaleDateString()
    };

    const updatedNotes = [newNote, ...selectedBook.notes];
    const updatedBooks = books.map(b => b.id === selectedBook.id ? { ...b, notes: updatedNotes } : b);
    setBooks(updatedBooks);
    setSelectedBook(prev => prev ? { ...prev, notes: updatedNotes } : null);
    setNewNoteTitle('');
    setNewNoteContent('');
    setIsAddNoteModalOpen(false);
    showToast("Personal Study Note Saved! 📝", "success");
  };

  // Text-To-Speech with full Hindi Devanagari & Universal Fallback Support
  const togglePlaySpeech = () => {
    if (isPlayingAudio) {
      stopAllSpeech();
      setIsPlayingAudio(false);
      showToast("Audio paused.", "info");
      return;
    }

    const rawText = translatedText || activeChapter?.content || "";
    if (!rawText.trim()) {
      showToast("No text content available to read.", "warn");
      return;
    }

    stopAllSpeech();
    setIsPlayingAudio(true);
    showToast(`Reading Hindi/English Aloud (${speechRate}x)... 🔊`, "success");

    speakText(rawText, {
      rate: speechRate,
      onEnd: () => setIsPlayingAudio(false),
      onError: () => setIsPlayingAudio(false)
    });
  };

  // AI Chat Assistant Handler
  const handleAskBookAi = async (customPrompt?: string) => {
    const promptToUse = customPrompt || aiInput.trim();
    if (!promptToUse || !selectedBook || !activeChapter) return;

    if (!customPrompt) {
      setAiMessages(prev => [...prev, { role: 'user', content: promptToUse }]);
      setAiInput('');
    } else {
      setAiMessages(prev => [...prev, { role: 'user', content: customPrompt }]);
    }

    setIsAiLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `Context from Book: "${selectedBook.title}", Chapter: "${activeChapter.title}"\n\nContent Excerpt:\n${activeChapter.content.slice(0, 3000)}\n\nQuestion/Task: ${promptToUse}\n\nProvide a clear, easy-to-understand response for a student in simple language with bullet points and page/chapter references where relevant.`
            }
          ]
        })
      });

      const data = await res.json();
      const reply = data.reply || data.text || "AI study response generated.";

      setAiMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: reply,
          sourceRef: `📖 ${selectedBook.title} — ${activeChapter.title}`
        }
      ]);
    } catch (err) {
      showToast("AI Assistant error. Check connection.", "error");
    } finally {
      setIsAiLoading(false);
    }
  };

  // AI Quick Actions (Explain, Summarize, Key Points)
  const handleQuickAiAction = (action: 'explain' | 'summarize' | 'keypoints') => {
    if (!activeChapter) return;
    setActiveTab('ai-assistant');

    let prompt = '';
    if (action === 'explain') {
      prompt = `Explain this chapter (${activeChapter.title}) in very simple ${language === 'hindi' ? 'Hindi' : 'English'} for a student. Break down tricky concepts with real-world examples.`;
    } else if (action === 'summarize') {
      prompt = `Generate a ${aiSummaryType} summary of this chapter (${activeChapter.title}) focusing on core takeaways and exam points.`;
    } else {
      prompt = `Extract top 5-7 High-Yield Key Exam Points from this chapter (${activeChapter.title}) as bullet points with formulas or dates if any.`;
    }

    handleAskBookAi(prompt);
  };

  // Generate Active Recall Question
  const handleGenerateActiveRecall = async () => {
    if (!activeChapter) return;

    setIsRecallLoading(true);
    setRecallFeedback(null);
    setRecallUserAnswer('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `Based on this textbook chapter: "${activeChapter.title}"\n\nContent:\n${activeChapter.content.slice(0, 2000)}\n\nGenerate ONE challenging conceptual Active Recall question to test student memory and understanding. Ask the question directly without giving away the answer.`
            }
          ]
        })
      });

      const data = await res.json();
      setRecallQuestion(data.reply || "What is the primary significance of the concepts discussed in this chapter?");
    } catch (err) {
      showToast("Failed to generate recall question.", "error");
    } finally {
      setIsRecallLoading(false);
    }
  };

  // Submit Active Recall Answer for Evaluation
  const handleSubmitRecallAnswer = async () => {
    if (!recallQuestion || !recallUserAnswer.trim() || !activeChapter) return;

    setIsRecallLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `Chapter Content:\n${activeChapter.content.slice(0, 2000)}\n\nActive Recall Question:\n${recallQuestion}\n\nStudent Answer:\n${recallUserAnswer}\n\nEvaluate the student answer. State clearly if it is Correct, Partially Correct, or Incorrect. Provide a short breakdown and constructive advice on what to review.`
            }
          ]
        })
      });

      const data = await res.json();
      setRecallFeedback(data.reply || "Evaluation completed.");
    } catch (err) {
      showToast("Evaluation failed.", "error");
    } finally {
      setIsRecallLoading(false);
    }
  };

  // Generate Quiz
  const handleGenerateQuiz = async () => {
    if (!activeChapter) return;

    setIsGeneratingQuiz(true);
    setIsQuizCompleted(false);
    setCurrentQuizIdx(0);
    setQuizAnswers([]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `Generate ${quizNumQuestions} Multiple Choice Questions (MCQ) for the textbook chapter: "${activeChapter.title}".
Chapter Excerpt:
${activeChapter.content.slice(0, 3000)}

Return ONLY valid JSON array with format:
[
  {
    "id": "q1",
    "question": "Question text...",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Why Option A is correct...",
    "pageRef": "Chapter 1"
  }
]`
            }
          ]
        })
      });

      const data = await res.json();
      const rawText = data.reply || "";
      const jsonStart = rawText.indexOf('[');
      const jsonEnd = rawText.lastIndexOf(']');

      if (jsonStart >= 0 && jsonEnd > jsonStart) {
        const jsonStr = rawText.slice(jsonStart, jsonEnd + 1);
        const parsed = JSON.parse(jsonStr);
        setQuizQuestions(parsed);
        showToast(`Generated ${parsed.length} Quiz Questions! 🎯`, "success");
      } else {
        // Fallback quiz if AI JSON parsing fails
        setQuizQuestions([
          {
            id: 'fallback-1',
            question: `What is the core theme of ${activeChapter.title}?`,
            options: ['Fundamental Principles', 'Historical Background', 'Legal Provisions', 'All of the above'],
            correctAnswer: 3,
            explanation: 'The chapter covers fundamental principles, historical context, and provisions.',
            pageRef: activeChapter.title
          }
        ]);
      }
    } catch (err) {
      showToast("Quiz generation error. Loaded practice quiz.", "warn");
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  // Submit Option in Quiz
  const handleSelectQuizOption = (optionIdx: number) => {
    setSelectedOption(optionIdx);
  };

  const handleNextQuizQuestion = () => {
    if (selectedOption === null) return;
    const newAnswers = [...quizAnswers, selectedOption];
    setQuizAnswers(newAnswers);
    setSelectedOption(null);

    if (currentQuizIdx < quizQuestions.length - 1) {
      setCurrentQuizIdx(prev => prev + 1);
    } else {
      setIsQuizCompleted(true);
      // Save to history
      const correctCount = newAnswers.reduce((acc, ans, i) => ans === quizQuestions[i]?.correctAnswer ? acc + 1 : acc, 0);
      if (selectedBook) {
        const updatedHistory = [...(selectedBook.quizHistory || []), { date: new Date().toLocaleDateString(), score: correctCount, total: quizQuestions.length }];
        const updatedBooks = books.map(b => b.id === selectedBook.id ? { ...b, quizHistory: updatedHistory } : b);
        setBooks(updatedBooks);
      }
    }
  };

  // Generate Smart Revision Sheet
  const handleGenerateSmartRevision = async () => {
    if (!activeChapter) return;

    setIsGeneratingRevision(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `Create a "Smart Revision Sheet" for chapter: "${activeChapter.title}".
Excerpt:
${activeChapter.content.slice(0, 3000)}

Structure the response into:
1. 🎯 30-Second Chapter Core Concept
2. ⚡ High-Yield Key Formulas / Dates / Terms
3. ⚠️ Common Exam Traps & Pitfalls to Avoid
4. 🧠 Quick Memory Mnemonics & Tricks`
            }
          ]
        })
      });

      const data = await res.json();
      setRevisionSheet(data.reply || "Revision sheet generated.");
      showToast("Smart Revision Sheet Ready! 🧠", "success");
    } catch (err) {
      showToast("Failed to generate revision sheet.", "error");
    } finally {
      setIsGeneratingRevision(false);
    }
  };

  // Filtered & Sorted books for Library
  const filteredBooks = books.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (filterCategory === 'in-progress') return b.currentPage > 1 && b.currentPage < b.totalPages;
    if (filterCategory === 'completed') return b.currentPage >= b.totalPages;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'name') return a.title.localeCompare(b.title);
    if (sortBy === 'progress') {
      const progA = (a.currentPage / a.totalPages);
      const progB = (b.currentPage / b.totalPages);
      return progB - progA;
    }
    return 0; // default recent order
  });

  // Calculate Bookmark & Note indicators
  const isCurrentPageBookmarked = selectedBook?.bookmarks.some(bm => bm.chapterId === activeChapter?.id) || false;

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 space-y-6 animate-fade-in text-left min-h-screen text-slate-100 font-sans select-text" onMouseUp={handleMouseUp}>
      
      {/* 1. TOP HEADER & NAVIGATION BAR */}
      <div className="bg-[#0A0E1A]/95 border border-indigo-500/30 p-4 sm:p-5 rounded-3xl shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black rounded-full uppercase tracking-wider">
                📚 HANSAI BOOK STUDY MODE
              </span>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-mono rounded-md flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                AI Tutor Active
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-black text-white mt-0.5">
              डिजिटल बुक स्टडी एवं पर्सनल लाइब्रेरी
            </h1>
          </div>
        </div>

        {/* TOP TAB CONTROLS */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setActiveTab('library')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'library' ? 'bg-amber-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <BookMarked className="w-4 h-4" />
            <span>My Books ({books.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reader')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'reader' ? 'bg-indigo-600 text-white font-black shadow-md' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Book Reader</span>
          </button>

          <button
            onClick={() => setActiveTab('ai-assistant')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'ai-assistant' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-black' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Brain className="w-4 h-4 text-amber-400" />
            <span>AI Assistant</span>
          </button>

          <button
            onClick={() => setActiveTab('recall')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'recall' ? 'bg-emerald-600 text-white font-black' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Active Recall</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'quiz' ? 'bg-purple-600 text-white font-black' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Auto Quiz</span>
          </button>

          <button
            onClick={() => setActiveTab('revision')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'revision' ? 'bg-pink-600 text-white font-black' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Smart Revision</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'notes' ? 'bg-slate-800 text-amber-300 font-black' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Notes & Highlights</span>
          </button>

          {onBackToChat && (
            <button
              onClick={onBackToChat}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ml-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exit</span>
            </button>
          )}
        </div>
      </div>

      {/* FLOATING TEXT SELECTION ACTION POPUP */}
      {selectionPosition && selectedText && (
        <div
          style={{ top: `${selectionPosition.y - 50}px`, left: `${selectionPosition.x - 140}px` }}
          className="fixed z-50 bg-[#0D121F] border-2 border-amber-500/80 rounded-2xl shadow-2xl p-1.5 flex items-center gap-1 text-xs animate-fade-in backdrop-blur-xl"
        >
          <button
            onClick={() => handleAskBookAi(`Explain this text in detail: "${selectedText}"`)}
            className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex items-center gap-1 text-[11px] cursor-pointer"
          >
            <Brain className="w-3 h-3" />
            <span>Ask AI</span>
          </button>

          <button
            onClick={() => handleAddHighlight('important')}
            className="px-2 py-1 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 rounded-xl font-bold text-[11px] cursor-pointer"
          >
            🟡 Highlight
          </button>

          <button
            onClick={() => {
              setNewNoteTitle(`Note on: "${selectedText.slice(0, 20)}..."`);
              setNewNoteContent(`"${selectedText}"`);
              setIsAddNoteModalOpen(true);
            }}
            className="px-2 py-1 bg-slate-800 text-slate-200 hover:bg-slate-700 rounded-xl font-bold text-[11px] cursor-pointer"
          >
            📌 Note
          </button>

          <button
            onClick={() => setSelectedText('')}
            className="p-1 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ==================== TAB 1: MY BOOKS LIBRARY ==================== */}
      {activeTab === 'library' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* CONTINUE READING HERO BANNER */}
          {selectedBook && (
            <div className="bg-gradient-to-r from-indigo-950/80 via-[#0A0E1A] to-slate-900 border-2 border-amber-500/40 p-5 sm:p-6 rounded-3xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
              <div className="space-y-2 z-10">
                <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black rounded-full uppercase tracking-wider inline-flex items-center gap-1">
                  📖 Continue Reading
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">{selectedBook.title}</h2>
                <p className="text-xs text-slate-300">{selectedBook.author} • {selectedBook.category}</p>
                
                {/* Progress bar */}
                <div className="w-full max-w-md space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Chapter {selectedChapterIndex + 1} of {selectedBook.chapters.length}</span>
                    <span className="text-amber-400 font-bold">{Math.round(((selectedChapterIndex + 1) / selectedBook.chapters.length) * 100)}% Complete</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-indigo-500 transition-all"
                      style={{ width: `${((selectedChapterIndex + 1) / selectedBook.chapters.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 z-10 w-full md:w-auto">
                <button
                  onClick={() => setActiveTab('reader')}
                  className="w-full md:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Continue Reading →</span>
                </button>
              </div>
            </div>
          )}

          {/* SEARCH, SORT & UPLOAD TOOLBAR */}
          <div className="bg-[#0F172A] border border-slate-800 p-4 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-indigo-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search titles, authors, subjects..."
                className="w-full pl-10 pr-4 py-2 bg-[#050811] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Filter & Sort Controls */}
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              <select
                value={filterCategory}
                onChange={(e: any) => setFilterCategory(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none"
              >
                <option value="all">All Books</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none"
              >
                <option value="recent">Sort by Recent</option>
                <option value="name">Sort by Title</option>
                <option value="progress">Sort by Progress</option>
              </select>

              {/* Upload Book Button */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".pdf,.txt,.epub,.md"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                {isUploading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                <span>+ Upload Book (PDF/TXT)</span>
              </button>
            </div>

          </div>

          {/* BOOKS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredBooks.map((book) => {
              const isSelected = selectedBook?.id === book.id;
              const progressPct = Math.round(((book.lastOpenedChapterIndex + 1) / (book.chapters.length || 1)) * 100);

              return (
                <div
                  key={book.id}
                  className={`p-4 rounded-3xl border text-left flex flex-col justify-between transition-all relative overflow-hidden group ${
                    isSelected
                      ? 'bg-[#0F172A] border-amber-400 shadow-xl ring-2 ring-amber-400/30'
                      : 'bg-[#0A0E1A]/90 border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/90'
                  }`}
                >
                  {/* Book Cover Top Banner */}
                  <div className={`w-full h-24 rounded-2xl bg-gradient-to-tr ${book.coverColor} p-3 flex flex-col justify-between shadow-inner relative`}>
                    <div className="flex items-center justify-between">
                      <BookOpen className="w-6 h-6 text-white/90" />
                      <span className="text-[9px] font-black uppercase text-white/90 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm">
                        {book.category.split(' ')[0]}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-white/80">{book.chapters.length} Chapters</span>
                  </div>

                  {/* Book Info */}
                  <div className="mt-3 space-y-1.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-extrabold text-white line-clamp-2 group-hover:text-amber-300 transition-colors">
                        {book.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">{book.author}</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="pt-2 space-y-1 border-t border-slate-800/80">
                      <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                        <span>Progress</span>
                        <span className="font-bold text-amber-400">{progressPct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400" style={{ width: `${progressPct}%` }}></div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedBook(book);
                          setSelectedChapterIndex(book.lastOpenedChapterIndex || 0);
                          setActiveTab('reader');
                          showToast(`Opened: ${book.title}`, "info");
                        }}
                        className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl transition-all cursor-pointer text-center"
                      >
                        Read Book 📖
                      </button>

                      {book.isCustomUploaded && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete "${book.title}" from library?`)) {
                              setBooks(prev => prev.filter(b => b.id !== book.id));
                              showToast("Book deleted.", "info");
                            }
                          }}
                          className="p-2 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700 rounded-xl transition-all cursor-pointer"
                          title="Delete book"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}

            {/* UNIVERSAL AI BOOK GENERATOR CARD (FOR SEARCHING ANY NOVEL, FICTION, CLASSIC, OR NON-FICTION BOOK) */}
            {searchQuery.trim() !== '' && (
              <div className="col-span-full p-6 bg-gradient-to-r from-indigo-950/90 via-[#0D1527] to-purple-950/90 border-2 border-indigo-500/50 rounded-3xl text-left space-y-3 shadow-2xl my-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                  <span className="text-[11px] font-black text-amber-400 uppercase tracking-wider">Universal AI Book Finder (संसार की कोई भी पुस्तक खोजें व पढ़ें)</span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-black text-white">
                    "{searchQuery}" पुस्तक खोज रहे हैं?
                  </h3>
                  <p className="text-xs text-slate-300 max-w-xl">
                    HansAI AI Book Engine हिंदी या अंग्रेजी की किसी भी उपन्यास, कहानी, जीवनी, विज्ञान या साहित्य पुस्तक "{searchQuery}" के सभी अध्याय, सारांश व मुख्य बिंदु तुरंत तैयार कर देगा।
                  </p>
                </div>
                <button
                  onClick={() => handleGenerateBookWithAI(searchQuery)}
                  disabled={isGeneratingAiBook}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isGeneratingAiBook ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Generating Book & Chapters...</span>
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-4 h-4" />
                      <span>📖 Generate & Read "{searchQuery}" Now</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ==================== TAB 2: ADVANCED BOOK READER ==================== */}
      {activeTab === 'reader' && selectedBook && activeChapter && (
        <div className="space-y-4 animate-fade-in">
          
          {/* READER TOP CONTROL TOOLBAR */}
          <div className="bg-[#0F172A] border border-slate-800 p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
            
            {/* Book & Chapter Selector */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsTocOpen(!isTocOpen)}
                className="px-3 py-1.5 bg-slate-900 border border-slate-700 hover:border-indigo-500 text-slate-200 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <List className="w-4 h-4 text-indigo-400" />
                <span className="hidden sm:inline">Table of Contents</span>
              </button>

              <span className="text-slate-600">|</span>

              <span className="font-extrabold text-white line-clamp-1 max-w-[200px] sm:max-w-xs">
                {activeChapter.title}
              </span>
            </div>

            {/* Read Aloud & Speed */}
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlaySpeech}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isPlayingAudio
                    ? 'bg-amber-500 text-slate-950 animate-pulse'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span>{isPlayingAudio ? 'Pause' : 'Listen (सुनें)'}</span>
              </button>

              <select
                value={speechRate}
                onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-xl px-2 py-1 focus:outline-none"
              >
                <option value={0.8}>0.8x</option>
                <option value={1.0}>1.0x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
              </select>
            </div>

            {/* Multi-language Translator */}
            <div className="flex items-center gap-1.5">
              <Languages className="w-4 h-4 text-emerald-400 shrink-0" />
              {(['original', 'hindi', 'english', 'sanskrit', 'hinglish'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleTranslateChapter(lang)}
                  disabled={isTranslating}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase cursor-pointer ${
                    targetLanguage === lang ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Customization Options (Theme & Font Size) */}
            <div className="flex items-center gap-2">
              {/* Bookmark Toggle */}
              <button
                onClick={handleToggleBookmark}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  isCurrentPageBookmarked
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
                title="Bookmark chapter"
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>

              {/* Reader Theme Switcher */}
              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5">
                <button
                  onClick={() => setReaderTheme('dark')}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${readerTheme === 'dark' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
                >
                  Dark
                </button>
                <button
                  onClick={() => setReaderTheme('cream')}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${readerTheme === 'cream' ? 'bg-amber-200 text-slate-950' : 'text-slate-400'}`}
                >
                  Warm
                </button>
                <button
                  onClick={() => setReaderTheme('white')}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${readerTheme === 'white' ? 'bg-white text-slate-950' : 'text-slate-400'}`}
                >
                  White
                </button>
              </div>

              {/* Font Size Selector */}
              <select
                value={fontSize}
                onChange={(e: any) => setFontSize(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-xl px-2 py-1 focus:outline-none"
              >
                <option value="sm">Small Text</option>
                <option value="md">Normal Text</option>
                <option value="lg">Large Text</option>
                <option value="xl">XL Text</option>
              </select>
            </div>

          </div>

          {/* TABLE OF CONTENTS DRAWER OVERLAY */}
          {isTocOpen && (
            <div className="bg-[#0A0E1A] border-2 border-indigo-500/40 p-4 rounded-3xl space-y-3 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-black uppercase text-amber-400">📖 Table of Contents Index</span>
                <button onClick={() => setIsTocOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                {selectedBook.chapters.map((ch, idx) => (
                  <button
                    key={ch.id}
                    onClick={() => {
                      handleSelectChapter(idx);
                      setIsTocOpen(false);
                    }}
                    className={`p-2.5 rounded-xl border text-xs text-left font-bold transition-all cursor-pointer flex items-center justify-between ${
                      selectedChapterIndex === idx
                        ? 'bg-indigo-600/30 text-amber-300 border-indigo-500'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <span className="line-clamp-1">{ch.title}</span>
                    <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-60" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* READER CANVAS DISPLAY */}
          <div
            className={`p-6 sm:p-10 rounded-3xl border transition-all space-y-6 shadow-2xl relative min-h-[500px] ${
              readerTheme === 'dark'
                ? 'bg-[#0B0F1A] border-slate-800 text-slate-100'
                : readerTheme === 'cream'
                ? 'bg-[#FDF6E3] border-amber-300/80 text-[#2B2B2B]'
                : 'bg-white border-slate-300 text-slate-900'
            }`}
          >
            {/* Chapter Header */}
            <div className="border-b pb-4 space-y-1" style={{ borderColor: readerTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-amber-500">
                  {selectedBook.title}
                </span>
                <span className="text-xs font-mono font-bold opacity-60">
                  Chapter {selectedChapterIndex + 1} of {selectedBook.chapters.length}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black leading-tight">
                {activeChapter.title}
              </h2>
            </div>

            {/* Chapter Text Body */}
            <div
              className={`prose max-w-none whitespace-pre-wrap leading-relaxed ${
                fontFamily === 'serif' ? 'font-serif' : fontFamily === 'mono' ? 'font-mono' : 'font-sans'
              } ${
                fontSize === 'sm' ? 'text-xs' : fontSize === 'lg' ? 'text-base' : fontSize === 'xl' ? 'text-lg' : 'text-sm'
              }`}
            >
              {isTranslating ? (
                <div className="py-16 text-center space-y-3">
                  <Sparkles className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
                  <p className="text-sm font-bold">Translating book chapter into selected language...</p>
                </div>
              ) : (
                translatedText || activeChapter.content
              )}
            </div>

            {/* Chapter Footer Navigation */}
            <div className="flex items-center justify-between pt-6 border-t" style={{ borderColor: readerTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
              <button
                disabled={selectedChapterIndex === 0}
                onClick={() => handleSelectChapter(selectedChapterIndex - 1)}
                className="px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 disabled:opacity-40 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                ← Previous Chapter
              </button>

              {/* Study Action Quick Launch */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleQuickAiAction('explain')}
                  className="px-3 py-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl font-bold text-xs hover:bg-amber-500/30 cursor-pointer"
                >
                  💡 Explain Chapter
                </button>
                <button
                  onClick={() => handleQuickAiAction('keypoints')}
                  className="px-3 py-1.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-xl font-bold text-xs hover:bg-indigo-500/30 cursor-pointer"
                >
                  🔑 Key Points
                </button>
              </div>

              <button
                disabled={selectedChapterIndex === selectedBook.chapters.length - 1}
                onClick={() => handleSelectChapter(selectedChapterIndex + 1)}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Next Chapter →
              </button>
            </div>

          </div>

        </div>
      )}

      {/* ==================== TAB 3: AI STUDY ASSISTANT ==================== */}
      {activeTab === 'ai-assistant' && selectedBook && activeChapter && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          
          {/* LEFT: QUICK AI TOOLS PANEL */}
          <div className="lg:col-span-1 bg-[#0A0E1A] border border-slate-800 p-5 rounded-3xl space-y-4 h-fit">
            <div className="space-y-1 border-b border-slate-800 pb-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">Context Source</span>
              <h3 className="text-sm font-extrabold text-white">{selectedBook.title}</h3>
              <p className="text-xs text-indigo-300 font-mono">{activeChapter.title}</p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">1-Click Study Actions:</span>
              
              <button
                onClick={() => handleQuickAiAction('explain')}
                className="w-full p-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/50 rounded-2xl text-left transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-black text-amber-300">💡 Explain Simply (सरल व्याख्या)</div>
                  <div className="text-[10px] text-slate-400">Tricky concepts in easy language</div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>

              <button
                onClick={() => handleQuickAiAction('summarize')}
                className="w-full p-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500/50 rounded-2xl text-left transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-black text-indigo-300">📝 Chapter Summary (अध्याय सारांश)</div>
                  <div className="text-[10px] text-slate-400">Core takeaways & exam highlights</div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>

              <button
                onClick={() => handleQuickAiAction('keypoints')}
                className="w-full p-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 rounded-2xl text-left transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-black text-emerald-300">🔑 High-Yield Key Points</div>
                  <div className="text-[10px] text-slate-400">Important formulas, dates & facts</div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          </div>

          {/* RIGHT: AI CHAT WINDOW */}
          <div className="lg:col-span-2 bg-[#0A0E1A] border border-slate-800 rounded-3xl p-5 flex flex-col justify-between min-h-[500px]">
            
            {/* Messages Thread */}
            <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
              {aiMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border text-xs space-y-2 ${
                    msg.role === 'user'
                      ? 'bg-indigo-600/20 border-indigo-500/40 text-slate-100 ml-auto max-w-xl'
                      : 'bg-slate-900/90 border-slate-800 text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-bold opacity-70">
                    <span>{msg.role === 'user' ? '👤 Student' : '🤖 HansAI Study Assistant'}</span>
                    {msg.sourceRef && <span className="text-amber-400 font-mono">{msg.sourceRef}</span>}
                  </div>
                  <div className="prose prose-invert max-w-none text-xs whitespace-pre-wrap leading-relaxed">
                    {msg.content}
                  </div>
                </div>
              ))}

              {isAiLoading && (
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-xs flex items-center gap-2 text-amber-400 font-bold animate-pulse">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Analyzing book content and generating explanation...</span>
                </div>
              )}
            </div>

            {/* Input Form */}
            <div className="pt-4 border-t border-slate-800 mt-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAskBookAi();
                }}
                className="relative flex items-center"
              >
                <input
                  type="text"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  placeholder={`Ask HansAI anything about "${activeChapter.title.slice(0, 30)}..."`}
                  className="w-full pl-4 pr-24 py-3 bg-[#050811] border border-slate-800 rounded-2xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  disabled={isAiLoading || !aiInput.trim()}
                  className="absolute right-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-slate-950 font-black text-xs rounded-xl transition-all cursor-pointer disabled:opacity-40"
                >
                  Ask AI 🚀
                </button>
              </form>
            </div>

          </div>

        </div>
      )}

      {/* ==================== TAB 4: ACTIVE RECALL SYSTEM ==================== */}
      {activeTab === 'recall' && activeChapter && (
        <div className="max-w-3xl mx-auto bg-[#0A0E1A] border-2 border-emerald-500/40 p-6 sm:p-8 rounded-3xl space-y-6 animate-fade-in">
          <div className="border-b border-slate-800 pb-4 space-y-1">
            <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black rounded-full uppercase">
              🧠 ACTIVE RECALL MEMORY TEST
            </span>
            <h2 className="text-xl font-black text-white">Active Recall & Self-Testing Engine</h2>
            <p className="text-xs text-slate-400">
              Test your conceptual understanding without looking at the textbook. HansAI will evaluate your answer.
            </p>
          </div>

          {!recallQuestion ? (
            <div className="py-12 text-center space-y-4">
              <Zap className="w-12 h-12 text-emerald-400 mx-auto" />
              <div>
                <h3 className="text-base font-bold text-white">Ready for Active Recall on {activeChapter.title}?</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  Click below to generate a tailored challenge question from your current reading section.
                </p>
              </div>
              <button
                onClick={handleGenerateActiveRecall}
                disabled={isRecallLoading}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-2xl shadow-xl transition-all cursor-pointer flex items-center gap-2 mx-auto"
              >
                {isRecallLoading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                <span>Generate Active Recall Question</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Question Banner */}
              <div className="p-5 bg-slate-900 border border-emerald-500/30 rounded-2xl space-y-2">
                <span className="text-[10px] font-black uppercase text-emerald-400">Recall Challenge Question:</span>
                <p className="text-sm font-extrabold text-white leading-relaxed">{recallQuestion}</p>
              </div>

              {/* Student Answer Area */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Your Answer (अपनी समझ के अनुसार उत्तर लिखें):</label>
                <textarea
                  value={recallUserAnswer}
                  onChange={(e) => setRecallUserAnswer(e.target.value)}
                  rows={4}
                  placeholder="Explain what you remember in your own words..."
                  className="w-full p-4 bg-[#050811] border border-slate-800 rounded-2xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Submit & Next Controls */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handleGenerateActiveRecall}
                  className="px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Skip / Next Question ↺
                </button>

                <button
                  onClick={handleSubmitRecallAnswer}
                  disabled={isRecallLoading || !recallUserAnswer.trim()}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg cursor-pointer disabled:opacity-40 flex items-center gap-2"
                >
                  {isRecallLoading ? <Sparkles className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>Evaluate My Answer</span>
                </button>
              </div>

              {/* Evaluation Feedback */}
              {recallFeedback && (
                <div className="p-5 bg-slate-900/90 border border-amber-500/40 rounded-2xl space-y-2 animate-fade-in">
                  <span className="text-xs font-black uppercase text-amber-400 flex items-center gap-1">
                    <Brain className="w-4 h-4" />
                    HansAI Evaluation & Feedback:
                  </span>
                  <div className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {recallFeedback}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      )}

      {/* ==================== TAB 5: AUTOMATIC QUIZ GENERATOR ==================== */}
      {activeTab === 'quiz' && activeChapter && (
        <div className="max-w-3xl mx-auto bg-[#0A0E1A] border-2 border-purple-500/40 p-6 sm:p-8 rounded-3xl space-y-6 animate-fade-in">
          <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
            <div>
              <span className="px-2.5 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-black rounded-full uppercase">
                🎯 AUTOMATIC QUIZ GENERATOR
              </span>
              <h2 className="text-xl font-black text-white mt-1">Quiz on {activeChapter.title}</h2>
            </div>

            {/* Questions selector */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 border border-slate-800 rounded-xl">
              {([5, 10, 20] as const).map((num) => (
                <button
                  key={num}
                  onClick={() => setQuizNumQuestions(num)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer ${
                    quizNumQuestions === num ? 'bg-purple-600 text-white' : 'text-slate-400'
                  }`}
                >
                  {num} Qs
                </button>
              ))}
            </div>
          </div>

          {quizQuestions.length === 0 ? (
            <div className="py-12 text-center space-y-4">
              <HelpCircle className="w-12 h-12 text-purple-400 mx-auto" />
              <div>
                <h3 className="text-base font-bold text-white">Generate Chapter Quiz</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  Test your knowledge with AI-generated Multiple Choice Questions based on this chapter.
                </p>
              </div>
              <button
                onClick={handleGenerateQuiz}
                disabled={isGeneratingQuiz}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs rounded-2xl shadow-xl transition-all cursor-pointer flex items-center gap-2 mx-auto"
              >
                {isGeneratingQuiz ? <Sparkles className="w-4 h-4 animate-spin" /> : <HelpCircle className="w-4 h-4" />}
                <span>Start {quizNumQuestions} Question Quiz</span>
              </button>
            </div>
          ) : !isQuizCompleted ? (
            <div className="space-y-6">
              
              {/* Question Header */}
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Question {currentQuizIdx + 1} of {quizQuestions.length}</span>
                <span className="text-purple-400 font-bold">{Math.round(((currentQuizIdx + 1) / quizQuestions.length) * 100)}%</span>
              </div>

              {/* Active Question */}
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
                <p className="text-sm font-extrabold text-white leading-relaxed">
                  {quizQuestions[currentQuizIdx]?.question}
                </p>

                {/* Options List */}
                <div className="space-y-2">
                  {quizQuestions[currentQuizIdx]?.options.map((opt, optIdx) => (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectQuizOption(optIdx)}
                      className={`w-full p-3 rounded-xl border text-xs text-left font-bold transition-all cursor-pointer flex items-center gap-3 ${
                        selectedOption === optIdx
                          ? 'bg-purple-600/30 text-amber-300 border-purple-500'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      <span className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-[10px] font-mono shrink-0">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleNextQuizQuestion}
                  disabled={selectedOption === null}
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs rounded-xl shadow-lg cursor-pointer disabled:opacity-40"
                >
                  {currentQuizIdx === quizQuestions.length - 1 ? 'Finish Quiz →' : 'Next Question →'}
                </button>
              </div>

            </div>
          ) : (
            /* Quiz Completed Score Breakdown */
            <div className="py-8 text-center space-y-6 animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-purple-600/20 border-2 border-purple-500 flex items-center justify-center text-3xl mx-auto">
                🏆
              </div>

              <div>
                <h3 className="text-2xl font-black text-white">Quiz Completed!</h3>
                <p className="text-sm text-slate-400 mt-1">
                  You scored <span className="text-amber-400 font-bold">{quizAnswers.reduce((acc, ans, i) => ans === quizQuestions[i]?.correctAnswer ? acc + 1 : acc, 0)}</span> out of <span className="text-white font-bold">{quizQuestions.length}</span>
                </p>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl max-w-md mx-auto space-y-2 text-left">
                <span className="text-xs font-bold uppercase text-purple-400">Performance Summary:</span>
                <p className="text-xs text-slate-300">
                  {quizAnswers.reduce((acc, ans, i) => ans === quizQuestions[i]?.correctAnswer ? acc + 1 : acc, 0) / quizQuestions.length >= 0.7
                    ? "Great job! You have a solid grasp of this chapter's key concepts."
                    : "Review recommended: Try reading the chapter highlights again before re-testing."}
                </p>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={handleGenerateQuiz}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Retake Quiz ↺
                </button>
                <button
                  onClick={() => setActiveTab('revision')}
                  className="px-5 py-2.5 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Smart Revision Sheet →
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ==================== TAB 6: SMART REVISION SHEET ==================== */}
      {activeTab === 'revision' && activeChapter && (
        <div className="max-w-4xl mx-auto bg-[#0A0E1A] border-2 border-pink-500/40 p-6 sm:p-8 rounded-3xl space-y-6 animate-fade-in">
          <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
            <div>
              <span className="px-2.5 py-1 bg-pink-500/20 text-pink-300 border border-pink-500/30 text-[10px] font-black rounded-full uppercase">
                🧠 SMART REVISION SHEET
              </span>
              <h2 className="text-xl font-black text-white mt-1">Revision Guide: {activeChapter.title}</h2>
            </div>

            <button
              onClick={handleGenerateSmartRevision}
              disabled={isGeneratingRevision}
              className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
            >
              {isGeneratingRevision ? <Sparkles className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              <span>Generate Fresh Revision</span>
            </button>
          </div>

          {!revisionSheet ? (
            <div className="py-12 text-center space-y-4">
              <RefreshCw className="w-12 h-12 text-pink-400 mx-auto" />
              <div>
                <h3 className="text-base font-bold text-white">Generate 1-Click Revision Sheet</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  Automatically extracts core concepts, exam traps, and memory formulas from this chapter for quick revision.
                </p>
              </div>
              <button
                onClick={handleGenerateSmartRevision}
                disabled={isGeneratingRevision}
                className="px-6 py-3 bg-pink-600 hover:bg-pink-500 text-white font-extrabold text-xs rounded-2xl shadow-xl cursor-pointer flex items-center gap-2 mx-auto"
              >
                {isGeneratingRevision ? <Sparkles className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                <span>Generate Revision Sheet</span>
              </button>
            </div>
          ) : (
            <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl prose prose-invert max-w-none text-xs leading-relaxed whitespace-pre-wrap">
              {revisionSheet}
            </div>
          )}

        </div>
      )}

      {/* ==================== TAB 7: NOTES & HIGHLIGHTS ==================== */}
      {activeTab === 'notes' && selectedBook && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="flex items-center justify-between bg-[#0F172A] p-4 rounded-3xl border border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white">Notes & Highlights for {selectedBook.title}</h2>
              <p className="text-xs text-slate-400">{selectedBook.notes.length} Personal Notes • {selectedBook.highlights.length} Saved Highlights</p>
            </div>

            <button
              onClick={() => setIsAddNoteModalOpen(true)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Personal Note</span>
            </button>
          </div>

          {/* Notes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Personal Notes List */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase text-amber-400 block">📝 Personal Study Notes:</span>
              {selectedBook.notes.length === 0 ? (
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl text-center text-xs text-slate-500">
                  No personal notes added yet. Click "+ Add Personal Note" or select text while reading!
                </div>
              ) : (
                selectedBook.notes.map((note) => (
                  <div key={note.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-white">
                      <span>{note.title}</span>
                      <span className="text-[10px] text-slate-500">{note.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{note.content}</p>
                  </div>
                ))
              )}
            </div>

            {/* Saved Highlights List */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase text-indigo-400 block">🟡 Saved Textbook Highlights:</span>
              {selectedBook.highlights.length === 0 ? (
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl text-center text-xs text-slate-500">
                  No text highlighted yet. Select text while reading to highlight!
                </div>
              ) : (
                selectedBook.highlights.map((hl) => (
                  <div key={hl.id} className="p-3 bg-slate-900 border border-amber-500/20 rounded-2xl space-y-1">
                    <span className="text-[9px] font-black uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                      {hl.category}
                    </span>
                    <p className="text-xs text-slate-200 italic">"{hl.text}"</p>
                  </div>
                ))
              )}
            </div>

          </div>

          {/* Add Note Modal */}
          {isAddNoteModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-[#0D121F] border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-left">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-base font-bold text-white">Add Personal Study Note</h3>
                  <button onClick={() => setIsAddNoteModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <input
                    type="text"
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                    placeholder="Note Title (e.g. Fundamental Rights Article 21 key case)"
                    className="w-full text-xs p-3 bg-[#050811] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                  <textarea
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    rows={4}
                    placeholder="Write your note, summary, or exam reminder..."
                    className="w-full text-xs p-3 bg-[#050811] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  onClick={handleSaveNote}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer transition-all"
                >
                  Save Note 📝
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
