import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, BookOpen, ExternalLink, Award, Search, Sparkles, Star, Tag, Check, Filter } from 'lucide-react';

export interface AffiliateProduct {
  id: string;
  title: string;
  category: 'books' | 'gadgets' | 'shorthand' | 'stationary';
  examTag: string;
  price: string;
  rating: number;
  imageUrl: string;
  description: string;
  affiliateUrl: string;
  isPopular?: boolean;
}

const DEFAULT_PRODUCTS: AffiliateProduct[] = [
  {
    id: 'p1',
    title: 'Lucent General Knowledge 2026 Edition (Hindi/English)',
    category: 'books',
    examTag: 'SSC / RRB / All Competitive',
    price: '₹240',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80',
    description: 'The bible for Indian competitive exams. Covers History, Polity, Geography, Economics, and General Science.',
    affiliateUrl: 'https://www.amazon.in/dp/9384761540',
    isPopular: true
  },
  {
    id: 'p2',
    title: 'RS Aggarwal Quantitative Aptitude for Competitive Exams',
    category: 'books',
    examTag: 'SSC CGL / IBPS / Railway',
    price: '₹495',
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&auto=format&fit=crop&q=80',
    description: 'Complete mathematical shortcuts, formulas, and topic-wise solved questions with detailed step-by-step solutions.',
    affiliateUrl: 'https://www.amazon.in/dp/9352530168',
    isPopular: true
  },
  {
    id: 'p3',
    title: 'Plinth to Paramount English Vol 1 by Neetu Singh',
    category: 'books',
    examTag: 'SSC CGL / CHSL / Stenographer',
    price: '₹310',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&auto=format&fit=crop&q=80',
    description: 'Essential grammar rules, idiom & phrases, spot the error exercises specifically curated for SSC aspirants.',
    affiliateUrl: 'https://www.amazon.in/dp/9383454008',
    isPopular: true
  },
  {
    id: 'p4',
    title: 'Pitman Shorthand Pocket Dictionary (English Shorthand Strokes)',
    category: 'shorthand',
    examTag: 'SSC Stenographer / High Court',
    price: '₹280',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400&auto=format&fit=crop&q=80',
    description: 'Comprehensive outline dictionary containing over 20,000 pitman shorthand grammalogues and phrases.',
    affiliateUrl: 'https://www.amazon.in/dp/027370805X',
    isPopular: true
  },
  {
    id: 'p5',
    title: 'Digital LCD Visual Pomodoro Timer for Deep Study Focus',
    category: 'gadgets',
    examTag: 'All Students & Shorthand Practice',
    price: '₹599',
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?w=400&auto=format&fit=crop&q=80',
    description: 'Silent countdown clock with visual progress ring. Boost study focus and time management for exam sprints.',
    affiliateUrl: 'https://www.amazon.in/s?k=pomodoro+timer+study',
    isPopular: false
  },
  {
    id: 'p6',
    title: 'Noise Isolating Earphones with HD Audio for Shorthand Dictation',
    category: 'shorthand',
    examTag: 'Steno Dictation / Audio Books',
    price: '₹449',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80',
    description: 'Crystal clear voice clarity for practicing 80 wpm / 100 wpm stenographer audio dictation passages.',
    affiliateUrl: 'https://www.amazon.in/s?k=in+ear+headphones',
    isPopular: false
  }
];

interface Props {
  user: { name: string; email: string; role?: string } | null;
  showToast: (msg: string, type?: 'info' | 'success' | 'warn') => void;
}

export const AffiliateStoreView: React.FC<Props> = ({ user, showToast }) => {
  const isAdmin = user?.role === 'owner';

  const [products, setProducts] = useState<AffiliateProduct[]>(() => {
    const saved = localStorage.getItem('hansai-affiliate-products');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return DEFAULT_PRODUCTS;
  });

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Product Form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'books' | 'gadgets' | 'shorthand' | 'stationary'>('books');
  const [newExamTag, setNewExamTag] = useState('SSC / Railway / 10th & 12th');
  const [newPrice, setNewPrice] = useState('₹299');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newAffiliateUrl, setNewAffiliateUrl] = useState('');

  useEffect(() => {
    localStorage.setItem('hansai-affiliate-products', JSON.stringify(products));
  }, [products]);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAffiliateUrl.trim()) {
      showToast("Please enter Product Title and Affiliate Link.", "warn");
      return;
    }

    const item: AffiliateProduct = {
      id: 'prod_' + Date.now(),
      title: newTitle.trim(),
      category: newCategory,
      examTag: newExamTag.trim() || 'General Exam',
      price: newPrice.trim() || '₹199',
      rating: 4.8,
      imageUrl: newImageUrl.trim() || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80',
      description: newDescription.trim() || 'Recommended study material for exam preparation.',
      affiliateUrl: newAffiliateUrl.trim().startsWith('http') ? newAffiliateUrl.trim() : `https://${newAffiliateUrl.trim()}`,
      isPopular: true
    };

    setProducts(prev => [item, ...prev]);
    setIsAddModalOpen(false);
    showToast(`Product "${item.title}" added to Affiliate Store! 🛍️`, "success");

    // Reset Form
    setNewTitle('');
    setNewDescription('');
    setNewAffiliateUrl('');
    setNewImageUrl('');
  };

  const filteredProducts = products.filter(p => {
    const matchesCat = filterCategory === 'all' || p.category === filterCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.examTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#03060E] text-slate-100 min-h-full">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-emerald-900/60 via-indigo-900/50 to-slate-900 border border-emerald-500/30 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs uppercase tracking-wider mb-1">
              <ShoppingBag className="w-4 h-4" />
              <span>Affiliate & Recommended Store / पुस्तक व सामग्री दुकान</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Sarkari Exam Books & Essential Study Store 📚
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Top curated books, pitman shorthand dictionaries, and focus tools recommended by toppers for SSC, Railway, Banking, 10th & 12th Board Exams.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer border-none shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product / लिस्ट करें</span>
            </button>
          )}
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-[#0A0E1A] border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search books, Lucent, Shorthand..."
              className="w-full pl-9 pr-3 py-2 bg-[#03060E] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'books', label: '📖 Standard Books' },
              { id: 'shorthand', label: '🎙️ Shorthand Notes' },
              { id: 'gadgets', label: '⏱️ Study Tools' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shrink-0 cursor-pointer ${
                  filterCategory === cat.id
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                    : 'bg-[#03060E] text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((prod) => (
            <div 
              key={prod.id} 
              className="bg-[#0A0E1A] border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-4 flex flex-col justify-between transition-all group shadow-md"
            >
              <div className="space-y-3">
                <div className="relative h-44 rounded-xl overflow-hidden bg-slate-900 border border-slate-850">
                  <img 
                    src={prod.imageUrl} 
                    alt={prod.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  {prod.isPopular && (
                    <span className="absolute top-2 left-2 bg-amber-500 text-slate-950 font-black text-[9px] uppercase px-2 py-0.5 rounded-md shadow-md flex items-center gap-1">
                      <Star className="w-3 h-3 fill-slate-950" />
                      Top Recommended
                    </span>
                  )}
                  <span className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-md text-emerald-400 font-extrabold text-xs px-2.5 py-1 rounded-lg border border-emerald-500/30">
                    {prod.price}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-[10px] text-indigo-400 font-bold uppercase tracking-wider mb-1">
                    <Tag className="w-3 h-3 text-indigo-400" />
                    <span>{prod.examTag}</span>
                  </div>
                  <h3 className="text-sm font-extrabold text-white group-hover:text-indigo-300 transition-colors line-clamp-2">
                    {prod.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 line-clamp-3 leading-relaxed">
                    {prod.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{prod.rating} / 5.0</span>
                </div>

                <a
                  href={prod.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold rounded-xl transition-all shadow-md flex items-center gap-1.5 no-underline cursor-pointer"
                >
                  <span>Buy / Check Price</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="bg-[#0A0E1A] border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-3">
            <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold">No products found matching your filter.</p>
            <button
              onClick={() => { setFilterCategory('all'); setSearchQuery(''); }}
              className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>

      {/* Add Custom Product / Affiliate Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0A0E1A] border border-emerald-500/40 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative animate-fade-in text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-sm uppercase tracking-wider">
                <ShoppingBag className="w-4 h-4" />
                <span>Add Product / Affiliate Link</span>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-transparent border-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Product Title / नाम</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Lucent GK Hindi 2026 or Pitman Shorthand Dictionary"
                  className="w-full p-3 bg-[#03060E] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Category / वर्ग</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full p-3 bg-[#03060E] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="books">📖 Books & Practice Sets</option>
                    <option value="shorthand">🎙️ Shorthand Notebooks</option>
                    <option value="gadgets">⏱️ Focus Study Gadgets</option>
                    <option value="stationary">📝 Stationary Items</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Price / मूल्य</label>
                  <input
                    type="text"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="e.g. ₹299"
                    className="w-full p-3 bg-[#03060E] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Target Exam Tag / परीक्षा टैग</label>
                <input
                  type="text"
                  value={newExamTag}
                  onChange={(e) => setNewExamTag(e.target.value)}
                  placeholder="e.g. 10th, 12th, SSC CGL, RRB, Banking"
                  className="w-full p-3 bg-[#03060E] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Affiliate Link / Buy URL</label>
                <input
                  type="url"
                  value={newAffiliateUrl}
                  onChange={(e) => setNewAffiliateUrl(e.target.value)}
                  placeholder="https://amazon.in/dp/example or affiliate link"
                  className="w-full p-3 bg-[#03060E] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Image URL (Optional)</label>
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... or image link"
                  className="w-full p-3 bg-[#03060E] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Description / संक्षिप्त विवरण</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Explain why this book or tool helps students prepare..."
                  className="w-full p-3 bg-[#03060E] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 h-20"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-lg cursor-pointer border-none"
              >
                Publish Product to Affiliate Store 🚀
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
