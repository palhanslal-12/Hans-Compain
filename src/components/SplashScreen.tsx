import React from 'react';
import { OfficialHansCompainLogoSVG } from './HansCompainLogo';

export const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  React.useEffect(() => {
    const timer = setTimeout(onComplete, 2500); // Animation duration
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[1000] bg-[#060c16] flex flex-col items-center justify-center">
      <div className="animate-scale-up-fade">
        <OfficialHansCompainLogoSVG className="w-40 h-40" />
      </div>
      <div className="mt-6 text-center animate-fade-in-text">
        <h1 className="text-white text-2xl font-black tracking-wider">
          <span className="text-white">Hans</span>
          <span className="text-[#76c843]">Compain</span>
        </h1>
        <p className="text-cyan-400 font-extrabold tracking-widest uppercase text-xs mt-1">
          STUDY COMPANION
        </p>
      </div>
    </div>
  );
};
