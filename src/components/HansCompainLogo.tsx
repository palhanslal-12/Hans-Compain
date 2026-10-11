import React from 'react';

export const OfficialHansCompainLogoSVG = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="hcBgGrad" cx="50%" cy="42%" r="65%">
        <stop offset="0%" stopColor="#12243d" />
        <stop offset="60%" stopColor="#0a1423" />
        <stop offset="100%" stopColor="#060c16" />
      </radialGradient>
      <radialGradient id="hcCircleBg" cx="50%" cy="45%" r="55%">
        <stop offset="0%" stopColor="#163254" />
        <stop offset="70%" stopColor="#0b192e" />
        <stop offset="100%" stopColor="#071120" />
      </radialGradient>
      <linearGradient id="hcGreenRing" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#BEF264" />
        <stop offset="50%" stopColor="#84CC16" />
        <stop offset="100%" stopColor="#4D7C0F" />
      </linearGradient>
      <linearGradient id="hcHLeftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="50%" stopColor="#2563EB" />
        <stop offset="100%" stopColor="#1D4ED8" />
      </linearGradient>
      <linearGradient id="hcHRightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#22C55E" />
        <stop offset="50%" stopColor="#16A34A" />
        <stop offset="100%" stopColor="#15803D" />
      </linearGradient>
      <linearGradient id="hcHSide3D" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#365314" />
        <stop offset="100%" stopColor="#1a2e05" />
      </linearGradient>
      <linearGradient id="hcRobotHeadGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="70%" stopColor="#e2e8f0" />
        <stop offset="100%" stopColor="#94a3b8" />
      </linearGradient>
      <linearGradient id="hcCapTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1e3a5f" />
        <stop offset="100%" stopColor="#0d1f38" />
      </linearGradient>
      <linearGradient id="hcGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fde047" />
        <stop offset="50%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
    </defs>

    {/* Background */}
    <rect width="512" height="512" rx="64" fill="url(#hcBgGrad)" />

    {/* Outer Cyan Ring */}
    <circle cx="256" cy="200" r="148" fill="#081220" stroke="#00d2ff" strokeWidth="7.5" />

    {/* Inner Lime-Green Ring */}
    <circle cx="256" cy="200" r="134" fill="url(#hcCircleBg)" stroke="url(#hcGreenRing)" strokeWidth="6.5" />

    {/* AI ROBOT WITH GRADUATION CAP */}
    <g>
      <path d="M 212,162 C 212,144 230,138 256,138 C 282,138 300,144 300,162 L 306,178 L 206,178 Z" fill="url(#hcRobotHeadGrad)" stroke="#38bdf8" strokeWidth="2" />
      <path d="M 234,148 L 278,148 L 272,166 L 240,166 Z" fill="#0c1e36" stroke="#00d2ff" strokeWidth="1.5" />

      <line x1="198" y1="115" x2="194" y2="88" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
      <circle cx="194" cy="86" r="5" fill="#00e5ff" />
      <line x1="314" y1="115" x2="318" y2="88" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
      <circle cx="318" cy="86" r="5" fill="#00e5ff" />

      <rect x="195" y="108" width="12" height="24" rx="6" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
      <rect x="305" y="108" width="12" height="24" rx="6" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />

      <rect x="204" y="88" width="104" height="62" rx="28" fill="url(#hcRobotHeadGrad)" stroke="#bae6fd" strokeWidth="2" />
      <rect x="216" y="100" width="80" height="40" rx="16" fill="#071324" stroke="#00d2ff" strokeWidth="2" />

      <circle cx="238" cy="118" r="8.5" fill="#00e5ff" />
      <circle cx="236" cy="115" r="2.5" fill="#ffffff" />
      <circle cx="274" cy="118" r="8.5" fill="#00e5ff" />
      <circle cx="272" cy="115" r="2.5" fill="#ffffff" />

      <path d="M 248,130 Q 256,136 264,130" fill="none" stroke="#00e5ff" strokeWidth="3" strokeLinecap="round" />

      <path d="M 220,82 Q 256,95 292,82 L 288,96 Q 256,106 224,96 Z" fill="#0f233f" stroke="#38bdf8" strokeWidth="2" />
      <polygon points="256,48 328,72 256,94 184,72" fill="url(#hcCapTopGrad)" stroke="#38bdf8" strokeWidth="2.5" strokeLinejoin="round" />
      <ellipse cx="256" cy="71" rx="6" ry="3.5" fill="#fbbf24" />
      <path d="M 256,71 Q 216,75 198,94 L 195,116" fill="none" stroke="url(#hcGoldGrad)" strokeWidth="4" strokeLinecap="round" />
      <polygon points="189,115 201,115 204,132 186,132" fill="url(#hcGoldGrad)" />
    </g>

    {/* 3D GREEN LETTER "H" */}
    <g>
      <path d="M 167,156 L 219,156 L 219,212 L 279,212 L 279,156 L 331,156 L 331,302 L 279,302 L 279,248 L 219,248 L 219,302 L 167,302 Z" fill="url(#hcHSide3D)" stroke="#14532d" strokeWidth="2" strokeLinejoin="round" />
      <polygon points="167,156 176,148 228,148 219,156" fill="#4d7c0f" />
      <polygon points="279,156 288,148 340,148 331,156" fill="#4d7c0f" />
      <rect x="176" y="148" width="52" height="146" rx="4" fill="url(#hcHLeftGrad)" />
      <rect x="220" y="202" width="72" height="38" fill="url(#hcHRightGrad)" />
      <rect x="288" y="148" width="52" height="146" rx="4" fill="url(#hcHRightGrad)" />
      <path d="M 180,290 L 180,152 L 224,152" fill="none" stroke="#ecfccb" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
      <path d="M 292,290 L 292,152 L 336,152" fill="none" stroke="#d9f99d" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
      <line x1="224" y1="205" x2="288" y2="205" stroke="#d9f99d" strokeWidth="2.5" opacity="0.7" />
    </g>

    {/* GOLDEN LAUREL WREATH */}
    <g fill="url(#hcGoldGrad)">
      <path d="M 272,324 C 230,318 175,292 152,238" fill="none" stroke="url(#hcGoldGrad)" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M 240,324 C 282,318 337,292 360,238" fill="none" stroke="url(#hcGoldGrad)" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M 152,236 C 145,222 154,210 164,224 C 162,234 156,238 152,236 Z" />
      <path d="M 158,254 C 142,246 144,232 160,240 C 164,246 162,252 158,254 Z" />
      <path d="M 164,252 C 170,238 182,238 176,252 C 172,256 166,256 164,252 Z" />
      <path d="M 172,274 C 154,268 154,254 172,260 C 176,266 176,272 172,274 Z" />
      <path d="M 178,270 C 184,256 196,256 190,270 C 186,274 180,274 178,270 Z" />
      <path d="M 192,292 C 174,288 172,274 190,278 C 194,284 196,290 192,292 Z" />
      <path d="M 198,288 C 204,274 216,274 210,288 C 206,292 200,292 198,288 Z" />
      <path d="M 216,306 C 198,306 196,292 214,294 C 218,298 220,304 216,306 Z" />
      <path d="M 222,302 C 228,288 240,290 234,302 C 230,306 224,306 222,302 Z" />
      <path d="M 244,316 C 228,318 224,306 240,306 C 246,308 248,314 244,316 Z" />

      <path d="M 360,236 C 367,222 358,210 348,224 C 350,234 356,238 360,236 Z" />
      <path d="M 354,254 C 370,246 368,232 352,240 C 348,246 350,252 354,254 Z" />
      <path d="M 348,252 C 342,238 330,238 336,252 C 340,256 346,256 348,252 Z" />
      <path d="M 340,274 C 358,268 358,254 340,260 C 336,266 336,272 340,274 Z" />
      <path d="M 334,270 C 328,256 316,256 322,270 C 326,274 332,274 334,270 Z" />
      <path d="M 320,292 C 338,288 340,274 322,278 C 318,284 316,290 320,292 Z" />
      <path d="M 314,288 C 308,274 296,274 302,288 C 306,292 312,292 314,288 Z" />
      <path d="M 296,306 C 314,306 316,292 298,294 C 294,298 292,304 296,306 Z" />
      <path d="M 290,302 C 284,288 272,290 278,302 C 282,306 288,306 290,302 Z" />
      <path d="M 268,316 C 284,318 288,306 272,306 C 266,308 264,314 268,316 Z" />
    </g>

    {/* BRAND TITLE: HansCompain */}
    <text x="256" y="418" textAnchor="middle" fontFamily="'Plus Jakarta Sans', Arial, sans-serif" fontWeight="900" fontSize="54" letterSpacing="-0.5">
      <tspan fill="#ffffff">Hans</tspan>
      <tspan fill="#76c843">Compain</tspan>
    </text>

    {/* SUBTITLE: — STUDY COMPANION — */}
    <g opacity="0.95">
      <line x1="68" y1="452" x2="102" y2="452" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
      <text x="256" y="458" textAnchor="middle" fontFamily="'Plus Jakarta Sans', Arial, sans-serif" fontWeight="800" fontSize="18.5" fill="#f1f5f9" letterSpacing="3.2">
        STUDY COMPANION
      </text>
      <line x1="410" y1="452" x2="444" y2="452" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
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
    <div className="flex items-center gap-2 cursor-pointer select-none group shrink-0">
      <div className="relative inline-flex items-center justify-center bg-[#081220] border border-cyan-500/50 rounded-xl shadow-md transition-transform duration-300 group-hover:scale-105 shrink-0 overflow-hidden">
        <OfficialHansCompainLogoSVG className={className} />
      </div>
      <div className="flex flex-col text-left leading-tight shrink-0">
        <div className="font-black text-sm sm:text-base tracking-wide group-hover:text-cyan-200 transition-colors font-brand whitespace-nowrap">
          <span className="text-white">Hans</span><span className="text-[#76c843]">Compain</span>
        </div>
        {showSubtitle && (
          <span className="text-[8px] sm:text-[9px] text-cyan-400 font-extrabold tracking-wider uppercase mt-0.5 whitespace-nowrap">
            STUDY COMPANION
          </span>
        )}
      </div>
    </div>
  );
};

export default HansCompainLogo;
