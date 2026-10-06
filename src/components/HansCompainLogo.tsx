import React from 'react';

export const OfficialHansCompainLogoSVG = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      {/* Gradients matching the uploaded official logo */}
      <linearGradient id="bluePillarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0052D4" />
        <stop offset="50%" stopColor="#2575FC" />
        <stop offset="100%" stopColor="#00C9FF" />
      </linearGradient>

      <linearGradient id="greenPillarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0575E6" />
        <stop offset="30%" stopColor="#00B4DB" />
        <stop offset="100%" stopColor="#00F260" />
      </linearGradient>

      <linearGradient id="swooshGrad" x1="0%" y1="0%" x2="100%" y2="50%">
        <stop offset="0%" stopColor="#00F2FE" />
        <stop offset="60%" stopColor="#4FACFE" />
        <stop offset="100%" stopColor="#00F260" />
      </linearGradient>

      <linearGradient id="capGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1E3C72" />
        <stop offset="100%" stopColor="#2A5298" />
      </linearGradient>

      <linearGradient id="robotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00D2FF" />
        <stop offset="100%" stopColor="#0072FF" />
      </linearGradient>

      <linearGradient id="bookLeftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0052D4" />
        <stop offset="100%" stopColor="#00C9FF" />
      </linearGradient>

      <linearGradient id="bookRightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00B4DB" />
        <stop offset="100%" stopColor="#00F260" />
      </linearGradient>

      <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="6" stdDeviation="6" floodOpacity="0.25" />
      </filter>
    </defs>

    {/* Background Glow */}
    <ellipse cx="250" cy="240" rx="190" ry="180" fill="#00D2FF" opacity="0.08" />

    {/* Swoosh Behind */}
    <path d="M 120,240 C 90,200 130,170 200,165" stroke="url(#swooshGrad)" strokeWidth="16" strokeLinecap="round" opacity="0.9" />
    <path d="M 370,175 C 410,210 380,250 330,260" stroke="url(#swooshGrad)" strokeWidth="14" strokeLinecap="round" opacity="0.9" />

    {/* LEFT PILLAR OF "H" */}
    <path d="M 145,120 C 145,100 170,80 200,75 L 205,255 L 145,265 Z" fill="url(#bluePillarGrad)" filter="url(#softShadow)" />

    {/* RIGHT PILLAR OF "H" */}
    <path d="M 285,105 L 360,95 L 355,270 L 285,260 Z" fill="url(#greenPillarGrad)" filter="url(#softShadow)" />

    {/* CENTER S-CURVE SWOOSH / CROSSBAR */}
    <path d="M 130,240 C 200,180 320,180 380,160 C 370,195 270,225 155,270 Z" fill="url(#swooshGrad)" filter="url(#softShadow)" />

    {/* ROBOT HEAD IN THE CENTER */}
    <g transform="translate(205, 88)">
      {/* Antenna */}
      <circle cx="45" cy="5" r="7" fill="#00D2FF" />
      <rect x="42" y="10" width="6" height="12" rx="3" fill="#0072FF" />

      {/* Head Outer */}
      <rect x="8" y="20" width="74" height="54" rx="24" fill="url(#robotGrad)" filter="url(#softShadow)" />
      
      {/* Ears */}
      <rect x="0" y="32" width="10" height="30" rx="5" fill="#0052D4" />
      <rect x="80" y="32" width="10" height="30" rx="5" fill="#0052D4" />

      {/* Face Screen */}
      <rect x="16" y="27" width="58" height="40" rx="16" fill="#08142C" />

      {/* Cute Smiling Eyes */}
      <path d="M 27,45 Q 33,37 39,45" fill="none" stroke="#00F2FE" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M 51,45 Q 57,37 63,45" fill="none" stroke="#00F2FE" strokeWidth="4.5" strokeLinecap="round" />

      {/* Small Smile */}
      <path d="M 41,54 Q 45,58 49,54" fill="none" stroke="#00F2FE" strokeWidth="3" strokeLinecap="round" />
    </g>

    {/* GRADUATION CAP ON RIGHT PILLAR */}
    <g transform="translate(250, 35)">
      {/* Mortarboard Diamond */}
      <polygon points="70,5 140,28 70,52 0,28" fill="url(#capGrad)" filter="url(#softShadow)" stroke="#00C9FF" strokeWidth="2" />
      {/* Cap Skull Base */}
      <polygon points="35,39 70,52 105,39 105,52 70,66 35,52" fill="#13274F" />
      {/* Button & Tassel */}
      <circle cx="70" cy="28" r="4.5" fill="#00F260" />
      <path d="M 70,28 Q 110,35 125,60 L 126,85" fill="none" stroke="#00F260" strokeWidth="4" strokeLinecap="round" />
      <polygon points="120,83 132,83 126,102" fill="#00F260" />
    </g>

    {/* OPEN BOOK AT BASE */}
    <g transform="translate(90, 270)">
      {/* Left Page (Blue) */}
      <path d="M 160,55 C 90,65 30,55 0,40 C 25,68 85,85 160,68 Z" fill="url(#bookLeftGrad)" />
      <path d="M 160,40 C 90,50 30,42 0,28 C 25,52 85,68 160,53 Z" fill="url(#bookLeftGrad)" opacity="0.8" />

      {/* Right Page (Green) */}
      <path d="M 160,55 C 230,65 290,55 320,40 C 295,68 235,85 160,68 Z" fill="url(#bookRightGrad)" />
      <path d="M 160,40 C 230,50 290,42 320,28 C 295,52 235,68 160,53 Z" fill="url(#bookRightGrad)" opacity="0.8" />

      {/* Book Spine Center */}
      <polygon points="156,38 164,38 162,70 158,70" fill="#0E2246" />
    </g>

    {/* TYPOGRAPHY: HansCompain */}
    <text x="250" y="415" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="48" letterSpacing="-0.5">
      <tspan fill="#1A56DB">Hans</tspan>
      <tspan fill="#059669">Compain</tspan>
    </text>

    {/* SUBTITLE: — AI STUDY COMPANION — */}
    <g transform="translate(75, 435)">
      {/* Left Blue Bar */}
      <line x1="20" y1="9" x2="65" y2="9" stroke="#1A56DB" strokeWidth="3.5" strokeLinecap="round" />
      
      {/* Text */}
      <text x="175" y="14" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontWeight="800" fontSize="17" fill="#1E293B" letterSpacing="3.5">
        AI STUDY COMPANION
      </text>

      {/* Right Green Bar */}
      <line x1="285" y1="9" x2="330" y2="9" stroke="#059669" strokeWidth="3.5" strokeLinecap="round" />
    </g>
  </svg>
);

export const HansCompainLogo = ({
  className = "w-9 h-9",
  showSubtitle = false,
  variant = "header"
}: {
  className?: string;
  showSubtitle?: boolean;
  variant?: "header" | "center";
}) => {
  if (variant === "center") {
    return (
      <div className="flex flex-col items-center justify-center cursor-pointer select-none group animate-fade-in shrink-0">
        <div className="relative inline-flex items-center justify-center transition-transform duration-300 group-hover:scale-103">
          <OfficialHansCompainLogoSVG className={className.includes("w-") ? className : "w-14 h-14 sm:w-16 sm:h-16 drop-shadow-[0_8px_20px_rgba(0,180,216,0.3)]"} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 cursor-pointer select-none group">
      <div className="relative inline-flex items-center justify-center p-0.5 bg-[#0C1527] border border-cyan-500/40 rounded-xl shadow-md transition-transform duration-300 group-hover:scale-105 shrink-0 overflow-hidden">
        <OfficialHansCompainLogoSVG className={className} />
      </div>
      <div className="flex flex-col text-left leading-tight min-w-0">
        <div className="font-black text-xs sm:text-sm tracking-wide group-hover:text-cyan-200 transition-colors uppercase font-brand truncate">
          <span className="text-[#3B82F6]">HANS</span> <span className="text-[#10B981]">COMPAIN</span>
        </div>
        {showSubtitle && (
          <span className="text-[8px] sm:text-[9px] text-cyan-400 font-extrabold tracking-wider uppercase mt-0.5 truncate">
            हर सपने को मिलेगी उड़ान!
          </span>
        )}
      </div>
    </div>
  );
};

export default HansCompainLogo;
