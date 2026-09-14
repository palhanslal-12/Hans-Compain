const fs = require('fs');
let code = `import React from 'react';

export interface HansCompainLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showSubtitle?: boolean;
  className?: string;
  animate?: boolean;
}

export const HansCompainLogo: React.FC<HansCompainLogoProps> = ({
  size = 'md',
  showText = true, // Ignored now since image has text
  showSubtitle = true, // Ignored now since image has text
  className = '',
  animate = false
}) => {
  const sizeStyles: Record<string, { img: string }> = {
    xs: { img: 'w-16 h-16' },
    sm: { img: 'w-24 h-24' },
    md: { img: 'w-32 h-32' },
    lg: { img: 'w-48 h-48' },
    xl: { img: 'w-64 h-64' }
  };

  const currentStyle = sizeStyles[size] || sizeStyles.md;

  return (
    <div className={\`inline-flex items-center justify-center \${className}\`}>
      <div className={\`relative flex-shrink-0 \${currentStyle.img} group cursor-pointer transition-all duration-300 hover:scale-[1.05]\`}>
        <img
          src="/logo.png"
          alt="Hans Compain Logo"
          className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition-transform duration-500"
        />
      </div>
    </div>
  );
};
`;
fs.writeFileSync('src/components/HansCompainLogo.tsx', code);
