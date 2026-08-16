import React from 'react';
import { CheckCircle2, ShieldCheck, MessageSquare, ExternalLink } from 'lucide-react';

export default function AboutCreator() {
  const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/F0EfHMyUK6KJYedVpZqgXR?s=sh&p=a&mlu=4";

  return (
    <div 
      id="about-creator" 
      className="relative p-3 text-center max-w-md mx-auto w-full my-1 animate-fade-in space-y-3"
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
            FOUNDER & CREATOR
          </span>
          <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center justify-center gap-1.5 notranslate" translate="no">
            <span>हंसलाल पाल (Hanslal Pal) जी</span>
            <span title="Verified Founder">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 fill-indigo-400/20 flex-shrink-0" />
            </span>
          </h2>
          <p className="text-[11px] text-slate-400">
            National Academic Ecosystem & Steno Learning Platform
          </p>
        </div>
      </div>

      {/* Official WhatsApp Group Quick Join */}
      <a
        href={WHATSAPP_GROUP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all no-underline cursor-pointer"
      >
        <MessageSquare className="w-4 h-4" />
        <span>Join Official WhatsApp Group 💬</span>
        <ExternalLink className="w-3.5 h-3.5 opacity-80" />
      </a>
    </div>
  );
}


