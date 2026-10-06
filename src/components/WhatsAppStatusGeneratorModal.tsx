import React, { useState } from 'react';
import { X, Sparkles, Share2, Copy, Check, RefreshCw, Smartphone, Image as ImageIcon } from 'lucide-react';
import { HansCompainLogo } from './HansCompainLogo';

interface WhatsAppStatusGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const defaultSuvichars = [
  {
    quote: "हर सपने को मिलेगी उड़ान, जब साथ हो Hans Compain का सच्चा ज्ञान!",
    author: "— Hanslal Pal (संस्थापक, Hans Compain)"
  },
  {
    quote: "सफलता का कोई शॉर्टकट नहीं होता, निरंतर अभ्यास और दृढ़ संकल्प ही 100 WPM गति की कुंजी है।",
    author: "— आशुलिपि सफलता मंत्र"
  },
  {
    quote: "कठिन परिश्रम और सही दिशा का मेल, बदल देगा हर प्रतियोगी परीक्षा का खेल!",
    author: "— Hans Compain Study Slogan"
  },
  {
    quote: "सपने वो नहीं जो हम सोते हुए देखते हैं, सपने वो हैं जो हमें सोने नहीं देते।",
    author: "— डॉ. एपीजे अब्दुल कलाम"
  },
  {
    quote: "ज्ञान वह सबसे शक्तिशाली हथियार है जिसका उपयोग आप दुनिया को बदलने के लिए कर सकते हैं।",
    author: "— नेल्सन मंडेला"
  }
];

export const WhatsAppStatusGeneratorModal: React.FC<WhatsAppStatusGeneratorModalProps> = ({
  isOpen,
  onClose
}) => {
  const [suvicharIndex, setSuvicharIndex] = useState(0);
  const [customQuote, setCustomQuote] = useState('');
  const [cardTheme, setCardTheme] = useState<'midnight' | 'gold' | 'emerald'>('midnight');
  const [copiedStatus, setCopiedStatus] = useState(false);

  if (!isOpen) return null;

  const currentSuvichar = customQuote.trim()
    ? { quote: customQuote.trim(), author: "— Hans Compain User Special" }
    : defaultSuvichars[suvicharIndex];

  const handleNextSuvichar = () => {
    setCustomQuote('');
    setSuvicharIndex(prev => (prev + 1) % defaultSuvichars.length);
  };

  const handleShareToWhatsAppStatus = () => {
    const appUrl = 'https://hans-compain.onrender.com/';
    const statusText = `🌟 *HANS COMPAIN - आज का सुविचार (Daily Status)* 🌟\n\n"${currentSuvichar.quote}"\n\n${currentSuvichar.author}\n\n👉 *ऐप खोलें व अभ्यास करें:*\n${appUrl}\n\n#HansCompain #StudyMotivation #SSCSteno #BoardExams`;
    
    navigator.clipboard?.writeText(statusText);
    setCopiedStatus(true);
    setTimeout(() => setCopiedStatus(false), 2500);

    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(statusText)}`;
    window.open(waUrl, '_blank');
  };

  const themeStyles = {
    midnight: 'from-[#03060E] via-[#091122] to-[#0A162B] border-cyan-500/50 text-white',
    gold: 'from-[#1A1203] via-[#2A1D05] to-[#091122] border-amber-500/60 text-amber-100',
    emerald: 'from-[#021810] via-[#06281B] to-[#091122] border-emerald-500/60 text-emerald-100'
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-[#091122] border-2 border-slate-800 rounded-3xl p-5 sm:p-7 max-w-lg w-full space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar text-white">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xl shrink-0">
              📲
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                व्हाट्सएप स्टेटस पोस्टर जनरेटर (WhatsApp Status Maker)
              </h3>
              <p className="text-[11px] text-slate-400">
                सुविचार व स्टडी स्लोगन का स्टाइलिस्ट स्टेटस बनाएं (ऑफ़िशियल लोगो व वॉटरमार्क सहित)।
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-950 border border-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Selectors */}
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="font-bold text-slate-400">पोस्टर रंग थीम:</span>
          <div className="flex items-center gap-1.5">
            {[
              { id: 'midnight', name: '🌙 Midnight', color: 'bg-cyan-500' },
              { id: 'gold', name: '☀️ Gold', color: 'bg-amber-500' },
              { id: 'emerald', name: '🌿 Emerald', color: 'bg-emerald-500' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setCardTheme(t.id as any)}
                className={`px-2.5 py-1 rounded-xl border text-[11px] font-bold cursor-pointer transition-all ${
                  cardTheme === t.id ? 'bg-slate-800 text-white border-white' : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        {/* 9:16 Portrait Status Card Preview */}
        <div className={`p-6 sm:p-8 rounded-3xl border-2 bg-gradient-to-b ${themeStyles[cardTheme]} shadow-2xl relative flex flex-col justify-between min-h-[360px] text-center overflow-hidden group select-none`}>
          
          {/* Top Header inside Card */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 z-10">
            <div className="flex items-center gap-2">
              <HansCompainLogo className="w-7 h-7" />
              <span className="font-black text-xs tracking-wider text-white">HANS COMPAIN</span>
            </div>
            <span className="text-[9px] bg-white/10 px-2 py-0.5 rounded-full font-mono font-bold text-cyan-300 border border-white/10">
              DAILY STATUS
            </span>
          </div>

          {/* Central Suvichar Text */}
          <div className="my-6 space-y-3 z-10">
            <span className="text-3xl block">✨</span>
            <h2 className="text-base sm:text-xl font-black leading-relaxed font-hindi-title tracking-wide px-2">
              "{currentSuvichar.quote}"
            </h2>
            <p className="text-xs font-bold text-cyan-300 font-mono italic">
              {currentSuvichar.author}
            </p>
          </div>

          {/* Bottom Watermark inside Card */}
          <div className="border-t border-white/10 pt-3 flex items-center justify-between text-[10px] font-mono text-slate-400 z-10">
            <span className="font-bold text-white">Created by Hanslal Pal</span>
            <span>https://hans-compain.onrender.com/</span>
          </div>

          {/* Ambient Glow */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>
        </div>

        {/* Custom Suvichar Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 block">
            अपना सुविचार या संदेश लिखें (Custom Suvichar):
          </label>
          <input
            type="text"
            value={customQuote}
            onChange={e => setCustomQuote(e.target.value)}
            placeholder="उदा. मेहनत करो, सफलता जरूर मिलेगी..."
            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-cyan-400"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-800">
          <button
            onClick={handleNextSuvichar}
            className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>सुविचार बदलें</span>
          </button>

          <button
            onClick={handleShareToWhatsAppStatus}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <Share2 className="w-4 h-4" />
            <span>{copiedStatus ? '✅ लिंक कॉपी हो गया!' : '📲 व्हाट्सएप स्टेटस पर शेयर करें'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default WhatsAppStatusGeneratorModal;
