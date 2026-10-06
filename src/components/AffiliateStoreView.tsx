import React, { useState } from 'react';
import { ShoppingBag, Star, ExternalLink, Check, Tag } from 'lucide-react';

interface StoreProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  description: string;
  tag?: string;
  icon: string;
}

export const AffiliateStoreView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [orderedItem, setOrderedItem] = useState<StoreProduct | null>(null);

  const products: StoreProduct[] = [
    {
      id: 'p1',
      name: 'ऋषि प्रणाली हिन्दी आशुलिपि अभ्यास पुस्तिका (2 लाइन स्टेनो पैड)',
      category: 'steno',
      price: 180,
      originalPrice: 250,
      rating: 4.9,
      reviewsCount: 1420,
      description: 'मानक दूरी वाली रेखाएं जो हल्के और गहरे रेखाक्षरों को स्पष्ट बनाए रखने में मदद करती हैं (पैकेट में 4 नोटबुक)।',
      tag: 'BESTSELLER',
      icon: '📓'
    },
    {
      id: 'p2',
      name: 'अप्सरा स्टेनो पेंसिल पैक (10 पेंसिल + 1 शार्पनर)',
      category: 'steno',
      price: 95,
      originalPrice: 120,
      rating: 4.8,
      reviewsCount: 890,
      description: 'विशेष रूप से आशुलिपिकों के लिए निर्मित डार्क और स्मूथ लेड, जो 100 WPM की गति पर भी नहीं टूटती।',
      tag: 'ESSENTIAL',
      icon: '✏️'
    },
    {
      id: 'p3',
      name: 'भारती भवन गणित कक्षा 10 (डॉ. के.सी. सिन्हा - संपूर्ण गाइड)',
      category: 'board',
      price: 420,
      originalPrice: 495,
      rating: 4.9,
      reviewsCount: 2310,
      description: 'बिहार और यूपी बोर्ड के लिए सर्वाधिक प्रामाणिक गणित पुस्तक, प्रत्येक अध्याय के 100% विस्तृत हल सहित।',
      tag: 'TOP RECOMMENDED',
      icon: '📚'
    },
    {
      id: 'p4',
      name: 'NCERT विज्ञान व सामाजिक विज्ञान कॉम्बो (नवीनतम संस्करण 2026)',
      category: 'board',
      price: 350,
      originalPrice: 410,
      rating: 4.7,
      reviewsCount: 1650,
      description: 'सीबीएसई और सभी राज्य बोर्डों के संशोधित सिलेबस पर आधारित आधिकारिक NCERT पुस्तकें।',
      icon: '🔬'
    },
    {
      id: 'p5',
      name: 'SSC 25 इयर्स प्रीवियस पेपर्स (तर्कशक्ति, गणित, सामान्य ज्ञान)',
      category: 'competitive',
      price: 540,
      originalPrice: 650,
      rating: 4.8,
      reviewsCount: 3100,
      description: 'TCS परीक्षा पैटर्न पर आधारित अध्यायवार हल किए गए प्रश्न पत्र व्याख्या सहित।',
      tag: 'EXAM HIT',
      icon: '🏆'
    }
  ];

  const filtered = products.filter(p => selectedCategory === 'all' || p.category === selectedCategory);

  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-pink-950/60 via-slate-900 to-indigo-950/40 p-5 sm:p-6 rounded-3xl border border-pink-500/30 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-bold uppercase border border-pink-500/30 mb-2">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>हंस कॉम्पैन अनुशंसित बुकस्टोर</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              पुस्तकें व अध्ययन सामग्री केंद्र (Student Store)
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              आशुलिपि पैड, विशेष स्टेनो पेंसिल, के.सी. सिन्हा गणित गाइड और बोर्ड परीक्षा की मानक पुस्तकें।
            </p>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-800">
          {[
            { id: 'all', label: 'सभी उत्पाद' },
            { id: 'steno', label: 'आशुलिपि व स्टेनो किट' },
            { id: 'board', label: '10वीं / 12वीं बोर्ड पुस्तकें' },
            { id: 'competitive', label: 'प्रतियोगी परीक्षा PYQ बुक्स' }
          ].map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-pink-500 text-slate-950 shadow'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filtered.map(item => (
          <div
            key={item.id}
            className="bg-[#091122] border border-slate-800 hover:border-pink-500/50 rounded-3xl p-5 space-y-3 transition-all shadow-md flex flex-col justify-between group"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-2xl">
                  {item.icon}
                </div>
                {item.tag && (
                  <span className="text-[9px] font-black uppercase bg-pink-500/20 text-pink-300 border border-pink-500/30 px-2 py-0.5 rounded-full">
                    {item.tag}
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-pink-300 transition-colors line-clamp-2">
                  {item.name}
                </h3>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span className="font-bold">{item.rating}</span>
                  <span className="text-slate-500 text-[10px]">({item.reviewsCount} समीक्षाएं)</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                {item.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-850 flex items-center justify-between">
              <div>
                <span className="text-sm sm:text-base font-black text-white">₹{item.price}</span>
                <span className="text-[11px] text-slate-500 line-through ml-1.5">₹{item.originalPrice}</span>
              </div>
              <button
                onClick={() => setOrderedItem(item)}
                className="px-3 py-1.5 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-xs font-bold transition-all shadow cursor-pointer flex items-center gap-1"
              >
                <span>ऑर्डर करें</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {orderedItem && (
        <div className="p-5 rounded-3xl bg-emerald-950/60 border-2 border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
          <div className="space-y-1">
            <div className="text-xs font-black text-emerald-400 uppercase flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              <span>छात्र रियायती ऑर्डर चयनित (Student Store Checkout)</span>
            </div>
            <h4 className="text-sm sm:text-base font-black text-white">{orderedItem.name}</h4>
            <p className="text-xs text-slate-300">
              विशेष छात्र मूल्य: <strong className="text-emerald-300">₹{orderedItem.price}</strong> (बचत: ₹{orderedItem.originalPrice - orderedItem.price})
            </p>
          </div>
          <button
            onClick={() => setOrderedItem(null)}
            className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs cursor-pointer shrink-0"
          >
            ✓ पुष्टि करें (Confirm)
          </button>
        </div>
      )}
    </div>
  );
};
