import React, { useState, useEffect } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

interface FullScreenLayoutProps {
  children: React.ReactNode;
  title?: string;
  isHindi?: boolean;
  className?: string;
  defaultFullScreen?: boolean;
  onToggleFullScreen?: (isFs: boolean) => void;
}

export const FullScreenLayout: React.FC<FullScreenLayoutProps> = ({
  children,
  title,
  isHindi = true,
  className = "",
  defaultFullScreen = false,
  onToggleFullScreen
}) => {
  const [isFullScreen, setIsFullScreen] = useState(defaultFullScreen);

  const toggle = () => {
    setIsFullScreen(prev => {
      const next = !prev;
      if (onToggleFullScreen) onToggleFullScreen(next);
      return next;
    });
  };

  // Keyboard shortcut Esc to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullScreen) {
        setIsFullScreen(false);
        if (onToggleFullScreen) onToggleFullScreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreen, onToggleFullScreen]);

  if (isFullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-[#03060E] text-slate-100 flex flex-col overflow-hidden animate-in fade-in duration-200">
        {/* Fullscreen Floating Top Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#0B0F19]/95 border-b border-cyan-500/30 backdrop-blur-md shrink-0 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-black tracking-wide text-cyan-300 uppercase">
              {isHindi ? "फुल स्क्रीन मोड (Full Screen Reading)" : "Full Screen Reading Mode"}
            </span>
            {title && (
              <span className="text-xs font-semibold text-slate-300 hidden sm:inline border-l border-slate-700 pl-2">
                {title}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              {isHindi ? "बाहर आने के लिए Esc दबाएँ या क्लिक करें" : "Press Esc or Click"}
            </span>
            <button
              onClick={toggle}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95"
              title="Exit Full Screen (Esc)"
            >
              <Minimize2 className="w-4 h-4" />
              <span>{isHindi ? "फुल स्क्रीन बंद करें" : "Exit Full Screen"}</span>
            </button>
          </div>
        </div>

        {/* Fullscreen Body Content */}
        <div className={`flex-1 overflow-y-auto p-3 sm:p-6 text-base sm:text-lg leading-relaxed ${className}`}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Floating Toggle Button on normal view */}
      <div className="flex justify-end mb-2">
        <button
          onClick={toggle}
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500 text-cyan-300 hover:text-cyan-200 text-xs font-bold transition-all shadow-sm cursor-pointer"
          title="Open Full Screen Reading Mode"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>{isHindi ? "फुल स्क्रीन रीडिंग मोड" : "Full Screen Mode"}</span>
        </button>
      </div>

      <div className={className}>
        {children}
      </div>
    </div>
  );
};
