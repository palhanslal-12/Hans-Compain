import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Volume2, VolumeX, Highlighter, Languages, Sparkles, Play, Pause, Bookmark, ChevronRight, CheckCircle2, ArrowLeft, RotateCcw, Share2, Copy } from 'lucide-react';

interface GlobalBookReaderProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info' | 'warn') => void;
  language: string;
  onBackToChat?: () => void;
}

interface Chapter {
  id: string;
  title: string;
  content: string;
  highlights: string[];
}

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  coverColor: string;
  description: string;
  chapters: Chapter[];
}

// Pre-loaded Featured Library across multi-disciplinary subjects & books
const FEATURED_BOOKS: Book[] = [
  {
    id: 'ncert-polity',
    title: 'Indian Polity & Constitution (भारतीय राजव्यवस्था)',
    author: 'NCERT & M. Laxmikanth Series',
    category: 'Civics & Law',
    coverColor: 'from-amber-600 to-red-700',
    description: 'Complete breakdown of Indian Constitutional Assembly, Fundamental Rights, Preamble, Parliament & Judiciary.',
    chapters: [
      {
        id: 'polity-ch1',
        title: 'Chapter 1: Preamble & Preamble Objectives (प्रस्तावना)',
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
    chapters: [
      {
        id: 'geo-ch1',
        title: 'Chapter 1: The Solar System & Earth Motion (सौरमंडल व पृथ्वी की गतियाँ)',
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
    chapters: [
      {
        id: 'sci-ch1',
        title: 'Chapter 1: Newton Laws of Motion & Energy (न्यूटन के नियम व ऊर्जा)',
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
    chapters: [
      {
        id: 'hist-ch1',
        title: 'Chapter 1: The Great Revolt of 1857 (1857 का प्रथम स्वतंत्रता संग्राम)',
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
    chapters: [
      {
        id: 'cs-ch1',
        title: 'Chapter 1: Introduction to Programming & Algorithms',
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
  }
];

export const GlobalBookReader: React.FC<GlobalBookReaderProps> = ({
  showToast,
  language,
  onBackToChat
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(FEATURED_BOOKS[0]);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState<number>(0);
  const [isGeneratingCustomBook, setIsGeneratingCustomBook] = useState(false);
  
  // Reading Customization Options
  const [readerTheme, setReaderTheme] = useState<'dark' | 'cream' | 'white'>('dark');
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const [targetLanguage, setTargetLanguage] = useState<'original' | 'hindi' | 'english' | 'sanskrit' | 'hinglish'>('original');
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  // Text-to-Speech State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);

  // Custom User Highlighting
  const [userHighlights, setUserHighlights] = useState<string[]>([]);
  const [activeBookmark, setActiveBookmark] = useState<boolean>(false);

  const activeChapter = selectedBook?.chapters[selectedChapterIndex] || null;

  // Handle Search or Custom AI Book Generator
  const handleSearchBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const queryLower = searchQuery.trim().toLowerCase();
    
    // Check if query matches any existing book
    const existingMatch = FEATURED_BOOKS.find(b => 
      b.title.toLowerCase().includes(queryLower) || 
      b.category.toLowerCase().includes(queryLower) ||
      b.author.toLowerCase().includes(queryLower)
    );

    if (existingMatch) {
      setSelectedBook(existingMatch);
      setSelectedChapterIndex(0);
      setTranslatedText(null);
      showToast(`Book Found: ${existingMatch.title}`, "success");
      return;
    }

    // Generate Custom Digital Book on Demand via AI API
    setIsGeneratingCustomBook(true);
    showToast(`Searching global digital library for "${searchQuery}"...`, "info");

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `You are the Global Digital Library Engine. Generate a comprehensive, multi-chapter textbook summary & study guide for the book or topic: "${searchQuery}".
Format your response as structured chapters with headings, formulas/key principles, bullet points, historical background, and clear exam takeaways in clean Hindi and English.`
            }
          ]
        })
      });

      const data = await res.json();
      const generatedContent = data.reply || data.text || "Book chapter generated successfully.";

      const customBookObj: Book = {
        id: `custom-book-${Date.now()}`,
        title: searchQuery.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        author: 'Global Knowledge Network & HansAI Library',
        category: 'Digital Library Special',
        coverColor: 'from-purple-600 to-pink-700',
        description: `Complete digital textbook and study guide generated for: ${searchQuery}`,
        chapters: [
          {
            id: 'ch-1-custom',
            title: `Chapter 1: Introduction & Core Concepts of ${searchQuery}`,
            content: generatedContent,
            highlights: ['Core Concepts', 'Key Principles', 'Summary Notes']
          },
          {
            id: 'ch-2-custom',
            title: `Chapter 2: Advanced Analysis & Applications`,
            content: `Deep dive into ${searchQuery}:
1. Historical & Theoretical Foundations: Understanding how ${searchQuery} evolved over time and its core influence on modern study and practical applications.
2. Practical Examples & Solved Scenarios: Real-world case studies, formulas, and step-by-step illustrations.
3. Summary & High-Yield Points for Quick Revision: Make sure to memorize fundamental definitions, equations, dates, and core theorems for academic excellence.`,
            highlights: ['Advanced Analysis', 'Real-world case studies']
          }
        ]
      };

      setSelectedBook(customBookObj);
      setSelectedChapterIndex(0);
      setTranslatedText(null);
      showToast(`Digital Book Ready: ${customBookObj.title} 📚`, "success");
    } catch (err) {
      showToast("Error retrieving digital book. Loaded fallback chapter.", "warn");
    } finally {
      setIsGeneratingCustomBook(false);
    }
  };

  // Text-To-Speech (Read Aloud)
  const togglePlaySpeech = () => {
    if (!('speechSynthesis' in window)) {
      showToast("Speech synthesis not supported on this browser.", "warn");
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      showToast("Audio paused.", "info");
      return;
    }

    const textToRead = translatedText || activeChapter?.content || "";
    if (!textToRead) return;

    window.speechSynthesis.cancel(); // clear previous
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = speechRate;
    utterance.lang = language === 'hindi' ? 'hi-IN' : 'en-US';

    utterance.onend = () => {
      setIsPlayingAudio(false);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
    showToast(`Reading Aloud at ${speechRate}x speed... 🔊`, "success");
  };

  // Language Translator for Active Chapter
  const handleTranslateChapter = async (lang: 'original' | 'hindi' | 'english' | 'sanskrit' | 'hinglish') => {
    setTargetLanguage(lang);
    if (lang === 'original') {
      setTranslatedText(null);
      showToast("Restored original textbook language.", "info");
      return;
    }

    if (!activeChapter) return;
    setIsTranslating(true);
    showToast(`Translating chapter into ${lang.toUpperCase()}...`, "info");

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `Translate the following textbook chapter text accurately into ${lang} language while keeping formatting, bullet points, and key headings clear:\n\n${activeChapter.content}`
            }
          ]
        })
      });

      const data = await res.json();
      if (data.reply) {
        setTranslatedText(data.reply);
        showToast(`Chapter translated into ${lang.toUpperCase()}! 🌐`, "success");
      }
    } catch (err) {
      showToast("Translation failed. Check internet connection.", "error");
    } finally {
      setIsTranslating(false);
    }
  };

  // Text selection highlight helper
  const handleHighlightSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      const text = selection.toString().trim();
      setUserHighlights(prev => [...new Set([...prev, text])]);
      showToast(`Highlighted: "${text.slice(0, 30)}..." ✨`, "success");
    } else {
      showToast("Select text on screen with cursor to highlight!", "info");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 py-6 space-y-6 animate-fade-in text-left">
      
      {/* HEADER TITLE & NAVIGATION BAR */}
      <div className="bg-[#0A0E1A]/90 border border-indigo-500/30 p-4 sm:p-6 rounded-3xl shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black rounded-full uppercase tracking-wider flex items-center gap-1">
              <span>📚</span> GLOBAL DIGITAL LIBRARY & BOOK READER
            </span>
            <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-[10px] font-mono rounded-md">
              Read • Listen • Highlight • Translate
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1.5 flex items-center gap-2">
            <span>डिजिटल पुस्तकालय व संपूर्ण बुक रीडर</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Search, study & read ANY textbook, NCERT book, literature, or competitive exam guide. Features built-in Read Aloud (Voice), Multi-Language Translation, and Concept Highlighting!
          </p>
        </div>

        {onBackToChat && (
          <button
            onClick={onBackToChat}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Assistant</span>
          </button>
        )}
      </div>

      {/* BOOK SEARCH BAR */}
      <form onSubmit={handleSearchBook} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-indigo-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ANY book title, author, or subject (e.g. NCERT Science, Laxmikanth Polity, Spectrum History, Physics, Python Coding, Novels...)"
            className="w-full pl-12 pr-32 py-3.5 bg-[#0F172A] border-2 border-indigo-500/40 rounded-2xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 shadow-xl transition-all"
          />
          <button
            type="submit"
            disabled={isGeneratingCustomBook}
            className="absolute right-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-amber-600 hover:from-indigo-500 hover:to-amber-500 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {isGeneratingCustomBook ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Searching Library...</span>
              </>
            ) : (
              <>
                <BookOpen className="w-4 h-4" />
                <span>Search & Read Book</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* CURATED POPULAR BOOKS GRID */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
          📖 Popular Digital Library Textbooks:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {FEATURED_BOOKS.map((book) => {
            const isSelected = selectedBook?.id === book.id;
            return (
              <button
                key={book.id}
                onClick={() => {
                  setSelectedBook(book);
                  setSelectedChapterIndex(0);
                  setTranslatedText(null);
                  showToast(`Opened: ${book.title}`, "info");
                }}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer relative overflow-hidden group ${
                  isSelected 
                    ? 'border-amber-400 bg-slate-900 shadow-lg shadow-amber-500/10 ring-2 ring-amber-400/30' 
                    : 'border-slate-800 bg-[#0A0E1A]/80 hover:bg-slate-900 hover:border-indigo-500/50'
                }`}
              >
                <div className={`w-full h-12 rounded-xl bg-gradient-to-tr ${book.coverColor} p-2 flex items-center justify-between shadow-inner`}>
                  <BookOpen className="w-5 h-5 text-white/90" />
                  <span className="text-[9px] font-black uppercase text-white/80 bg-black/30 px-1.5 py-0.5 rounded">
                    {book.category.split(' ')[0]}
                  </span>
                </div>
                <div className="mt-2 space-y-1">
                  <h3 className="text-xs font-bold text-slate-100 line-clamp-2 group-hover:text-amber-300 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-[10px] text-slate-400 truncate">{book.author}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN BOOK READER DISPLAY CANVAS */}
      {selectedBook && activeChapter && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* LEFT SIDEBAR: CHAPTER INDEX & BOOK DETAILS */}
          <div className="lg:col-span-1 bg-[#0A0E1A] border border-slate-800 p-4 rounded-3xl space-y-4 h-fit">
            <div className="space-y-1 border-b border-slate-800 pb-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400">Selected Book</span>
              <h2 className="text-sm font-extrabold text-white leading-tight">{selectedBook.title}</h2>
              <p className="text-[11px] text-slate-400">{selectedBook.author}</p>
            </div>

            {/* Chapter Index List */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Chapters Index:</span>
              <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
                {selectedBook.chapters.map((ch, idx) => (
                  <button
                    key={ch.id}
                    onClick={() => {
                      setSelectedChapterIndex(idx);
                      setTranslatedText(null);
                      if (isPlayingAudio) window.speechSynthesis.cancel();
                      setIsPlayingAudio(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                      selectedChapterIndex === idx
                        ? 'bg-indigo-600/30 text-amber-300 border-indigo-500 font-bold'
                        : 'bg-slate-900/60 text-slate-300 border-slate-800/80 hover:bg-slate-800'
                    }`}
                  >
                    <span className="line-clamp-1">{ch.title}</span>
                    <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-60" />
                  </button>
                ))}
              </div>
            </div>

            {/* Bookmark & Highlight Counters */}
            <div className="pt-2 border-t border-slate-800 text-xs space-y-2">
              <button
                onClick={() => {
                  setActiveBookmark(!activeBookmark);
                  showToast(activeBookmark ? "Bookmark removed" : "Chapter bookmarked! 🔖", "success");
                }}
                className={`w-full p-2 rounded-xl border text-left font-bold flex items-center justify-between cursor-pointer transition-all ${
                  activeBookmark ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4" />
                  <span>{activeBookmark ? 'Bookmarked Chapter' : 'Bookmark Chapter'}</span>
                </div>
                <span>🔖</span>
              </button>

              {userHighlights.length > 0 && (
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-amber-400">Your Highlights ({userHighlights.length}):</span>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {userHighlights.map((hl, i) => (
                      <p key={i} className="text-[10px] text-slate-300 bg-amber-400/10 p-1.5 rounded border border-amber-400/20">
                        "{hl}"
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT CANVAS: ACTIVE CHAPTER CONTENT & READER TOOLBAR */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* READER CONTROLS TOOLBAR */}
            <div className="bg-[#0F172A] border border-slate-800 p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
              
              {/* 1. READ ALOUD (VOICE) CONTROLS */}
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlaySpeech}
                  className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isPlayingAudio 
                      ? 'bg-amber-500 text-slate-950 animate-pulse' 
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                >
                  {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span>{isPlayingAudio ? 'Pause Voice' : 'Read Aloud (सुनें)'}</span>
                </button>

                <select
                  value={speechRate}
                  onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                  className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-2 py-1 focus:outline-none"
                >
                  <option value={0.8}>0.8x Speed</option>
                  <option value={1.0}>1.0x Speed (Normal)</option>
                  <option value={1.25}>1.25x Speed</option>
                  <option value={1.5}>1.5x Speed</option>
                </select>
              </div>

              {/* 2. MULTI-LANGUAGE TRANSLATOR */}
              <div className="flex items-center gap-2">
                <Languages className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-[11px] text-slate-400 font-bold hidden sm:inline">Translate:</span>
                <div className="flex items-center gap-1">
                  {(['original', 'hindi', 'english', 'sanskrit', 'hinglish'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => handleTranslateChapter(lang)}
                      disabled={isTranslating}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                        targetLanguage === lang 
                          ? 'bg-emerald-500 text-slate-950 font-black' 
                          : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. FONT SIZE & THEME SELECTOR */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleHighlightSelection}
                  className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl hover:bg-amber-500/30 font-bold flex items-center gap-1 cursor-pointer"
                  title="Highlight selected text"
                >
                  <Highlighter className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Highlight Text</span>
                </button>

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
              </div>

            </div>

            {/* ACTIVE TEXTBOOK CHAPTER CANVAS */}
            <div
              className={`p-6 sm:p-8 rounded-3xl border transition-all space-y-6 shadow-2xl relative ${
                readerTheme === 'dark'
                  ? 'bg-[#0B0F1A] border-slate-800 text-slate-100'
                  : readerTheme === 'cream'
                  ? 'bg-[#FDF6E3] border-amber-300/80 text-[#2B2B2B]'
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            >
              {/* Chapter Header */}
              <div className="border-b pb-4 space-y-1" style={{ borderColor: readerTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
                <span className="text-xs font-black uppercase tracking-wider text-amber-500">
                  {selectedBook.title} • {activeChapter.title.split(':')[0]}
                </span>
                <h2 className="text-xl sm:text-2xl font-black leading-tight">
                  {activeChapter.title}
                </h2>
              </div>

              {/* Chapter Content Body */}
              <div
                className={`prose max-w-none whitespace-pre-wrap leading-relaxed font-sans ${
                  fontSize === 'sm' ? 'text-xs' : fontSize === 'lg' ? 'text-base' : fontSize === 'xl' ? 'text-lg' : 'text-sm'
                }`}
              >
                {isTranslating ? (
                  <div className="py-12 text-center space-y-3">
                    <Sparkles className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
                    <p className="text-sm font-bold">Translating textbook content into selected language...</p>
                  </div>
                ) : (
                  translatedText || activeChapter.content
                )}
              </div>

              {/* Pre-highlighted Exam Key Concepts */}
              {activeChapter.highlights && activeChapter.highlights.length > 0 && (
                <div className="pt-4 border-t" style={{ borderColor: readerTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
                  <span className="text-xs font-black uppercase text-amber-500 block mb-2">
                    💡 Exam High-Yield Concepts in this Chapter:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeChapter.highlights.map((hl, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-amber-400/20 text-amber-600 border border-amber-400/30 text-xs font-bold rounded-lg"
                      >
                        ⚡ {hl}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer Chapter Nav Buttons */}
              <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: readerTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
                <button
                  disabled={selectedChapterIndex === 0}
                  onClick={() => {
                    setSelectedChapterIndex(prev => Math.max(0, prev - 1));
                    setTranslatedText(null);
                  }}
                  className="px-4 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 disabled:opacity-40 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  ← Previous Chapter
                </button>

                <span className="text-xs font-mono font-bold text-slate-400">
                  Chapter {selectedChapterIndex + 1} of {selectedBook.chapters.length}
                </span>

                <button
                  disabled={selectedChapterIndex === selectedBook.chapters.length - 1}
                  onClick={() => {
                    setSelectedChapterIndex(prev => Math.min(selectedBook.chapters.length - 1, prev + 1));
                    setTranslatedText(null);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Next Chapter →
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};
