import React from 'react';

export interface HansCompainLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showSubtitle?: boolean;
  className?: string;
  animate?: boolean;
  opacity?: string;
  rainbow?: boolean;
}

export const HansCompainLogo: React.FC<HansCompainLogoProps> = ({
  size = 'md',
  className = '',
  opacity = 'opacity-90 hover:opacity-100',
  rainbow = false
}) => {
  const sizeStyles: Record<string, { img: string; pad: string; radius: string }> = {
    xs: { img: 'w-7 h-7 sm:w-8 sm:h-8', pad: 'p-1', radius: 'rounded-xl' },
    sm: { img: 'w-9 h-9 sm:w-11 sm:h-11', pad: 'p-1.5', radius: 'rounded-2xl' },
    md: { img: 'w-14 h-14 sm:w-16 sm:h-16', pad: 'p-2', radius: 'rounded-2xl' },
    lg: { img: 'w-24 h-24 sm:w-28 sm:h-28', pad: 'p-3', radius: 'rounded-3xl' },
    xl: { img: 'w-36 h-36 sm:w-40 sm:h-40', pad: 'p-3.5', radius: 'rounded-3xl' }
  };

  const currentStyle = sizeStyles[size] || sizeStyles.md;

  return (
    <div className={`inline-flex items-center justify-center bg-transparent select-none shrink-0 ${className}`}>
      <div className={`relative flex-shrink-0 ${currentStyle.img} group cursor-pointer transition-all duration-300 hover:scale-105`}>
        <img
          src="/logo.png"
          alt="Hans Compain Logo"
          className={`w-full h-full object-contain bg-transparent ${opacity} transition-all duration-300 filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]`}
          loading="eager"
        />
      </div>
    </div>
  );
};

