import React from 'react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

export default function AboutCreator() {
  return (
    <div 
      id="about-creator" 
      className="relative p-2 text-center max-w-md mx-auto w-full my-1 animate-fade-in"
    >
      <div className="flex flex-col items-center justify-center space-y-2 relative z-10">
        <div className="relative inline-block">
          {/* Glowing Ring Effect */}
          <div className="absolute inset-x-0 inset-y-0 bg-gradient-to-tr from-indigo-500 to-cyan-500 rounded-full blur-md opacity-30 animate-pulse" />
          <div className="relative w-12 h-12 mx-auto bg-gradient-to-tr from-indigo-600 via-slate-900 to-cyan-600 rounded-full flex items-center justify-center text-white shadow-lg border border-indigo-400/30">
            <ShieldCheck className="w-6 h-6 text-cyan-300" />
          </div>
        </div>

        <div className="space-y-0.5 text-center">
          <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest block">
            FOUNDER / संस्थापक
          </span>
          <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center justify-center gap-1.5 notranslate" translate="no">
            <span>हंसलाल पाल (Hanslal Pal) जी</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-400 fill-indigo-400/20 flex-shrink-0" title="Verified Founder" />
          </h2>
        </div>
      </div>
    </div>
  );
}


