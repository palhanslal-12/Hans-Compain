import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function AboutCreator() {
  return (
    <div 
      id="about-creator" 
      className="relative overflow-hidden bg-slate-900/80 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 sm:p-7 shadow-2xl transition-all duration-300 hover:border-indigo-500/40 hover:shadow-indigo-500/5 group text-center max-w-md mx-auto w-full"
    >
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col items-center justify-center space-y-4 relative z-10">
        <div className="relative inline-block">
          {/* Glowing Ring Effect */}
          <div className="absolute inset-x-0 inset-y-0 bg-gradient-to-tr from-indigo-500 to-amber-500 rounded-full blur-md opacity-35 animate-pulse" />
          <div className="relative w-14 h-14 mx-auto bg-gradient-to-tr from-indigo-600 via-slate-900 to-amber-500 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-slate-900">
            <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
          </div>
        </div>

        <div className="space-y-1 text-center">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block">
            Founder / संस्थापक
          </span>
          <h2 className="text-lg sm:text-2xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2 notranslate" translate="no">
            हंसलाल पाल (Hanslal Pal) जी
            <CheckCircle2 className="w-5 h-5 text-indigo-400 fill-indigo-400/20 flex-shrink-0" title="Verified Founder" />
          </h2>
        </div>
      </div>
    </div>
  );
}

