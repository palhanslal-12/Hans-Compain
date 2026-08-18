import React from 'react';

export interface HansCompainLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showSubtitle?: boolean;
  className?: string;
  animate?: boolean;
}

export const HansCompainLogo: React.FC<HansCompainLogoProps> = ({
  size = 'md',
  showText = true,
  showSubtitle = true,
  className = '',
  animate = false
}) => {
  const sizeStyles: Record<string, { icon: string; title: string; sub: string }> = {
    xs: { icon: 'w-5 h-5', title: 'text-xs', sub: 'text-[7px]' },
    sm: { icon: 'w-7 h-7', title: 'text-sm', sub: 'text-[9px]' },
    md: { icon: 'w-9 h-9', title: 'text-base', sub: 'text-[10px]' },
    lg: { icon: 'w-14 h-14', title: 'text-xl', sub: 'text-xs' },
    xl: { icon: 'w-24 h-24', title: 'text-3xl', sub: 'text-sm' }
  };

  const currentStyle = sizeStyles[size] || sizeStyles.md;

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Dynamic Vector Icon with subtle rotating animation and +20% hover scale */}
      <div className={`relative flex-shrink-0 ${currentStyle.icon} group cursor-pointer transition-all duration-300 hover:scale-[1.20] hover:rotate-6`}>
        <img
          src="/logo.svg"
          alt="Hans Compain"
          className="w-full h-full object-contain filter drop-shadow-[0_2px_10px_rgba(34,197,94,0.25)] transition-transform duration-500 group-hover:rotate-12"
        />
      </div>

      {/* Typography */}
      {showText && (
        <div className="flex flex-col text-left select-none leading-none">
          <div className={`font-black tracking-wider flex items-center gap-1 ${currentStyle.title}`}>
            <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent font-extrabold">
              HANS
            </span>
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent font-extrabold">
              COMPAIN
            </span>
          </div>
          {showSubtitle && (
            <div className={`font-bold tracking-widest text-slate-400 mt-1 flex items-center gap-1 ${currentStyle.sub}`}>
              <span className="text-emerald-400">LEARN</span>
              <span className="text-slate-600 text-[8px]">•</span>
              <span className="text-cyan-400">ASK</span>
              <span className="text-slate-600 text-[8px]">•</span>
              <span className="text-blue-400">GROW</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
