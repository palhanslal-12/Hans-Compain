import React from 'react';

interface LucentTextFormatterProps {
  text: string;
  className?: string;
}

export const LucentTextFormatter: React.FC<LucentTextFormatterProps> = ({ text, className = '' }) => {
  if (!text) return null;

  // Split text into lines
  const lines = text.split('\n');

  return (
    <div className={`space-y-2 text-xs sm:text-sm leading-relaxed ${className}`}>
      {lines.map((line, lineIdx) => {
        if (!line.trim()) return <div key={lineIdx} className="h-1" />;

        // Parse formatted line with highlights
        const formattedTokens = parseLucentLine(line);

        // Header lines or bullet lines
        if (line.startsWith('#') || line.startsWith('✍️') || line.startsWith('🔬') || line.startsWith('📚') || line.startsWith('💡')) {
          return (
            <div key={lineIdx} className="font-black text-sm sm:text-base text-cyan-300 pt-1 pb-0.5 flex items-start gap-1.5">
              <span>{formattedTokens}</span>
            </div>
          );
        }

        return (
          <div key={lineIdx} className="text-slate-200 font-medium leading-snug">
            {formattedTokens}
          </div>
        );
      })}
    </div>
  );
};

function parseLucentLine(line: string): React.ReactNode[] {
  // Pattern regex for Lucent highlights:
  // 1. Emerald Green: Formulas / Laws / Rules / Articles e.g. [[G: formula or law]] or V = IR or Article XX
  // 2. Soft Pink / Light Red: Warnings / Exceptions / Negative Marking e.g. [[R: warning text]] or ⚠️ text
  // 3. Light Yellow: **bold text**, dates/years, key terms, numbers

  // Replace markdown bold **text** with Light Yellow Lucent highlight
  const parts = line.split(/(\*\*[^*]+\*\*|\[\[G:[^\]]+\]\]|\[\[R:[^\]]+\]\]|\[\[Y:[^\]]+\]\])/g);

  return parts.map((part, idx) => {
    if (!part) return null;

    if (part.startsWith('**') && part.endsWith('**')) {
      const clean = part.slice(2, -2);
      // Determine highlight color based on content keywords
      const lower = clean.toLowerCase();
      if (lower.includes('सूत्र') || lower.includes('नियम') || lower.includes('formula') || lower.includes('law') || lower.includes('धारा') || lower.includes('अनुच्छेद')) {
        // Emerald Green Highlight
        return (
          <span key={idx} className="bg-emerald-500/25 text-emerald-300 border-b-2 border-emerald-400/60 px-1 py-0.5 rounded font-black mx-0.5">
            {clean}
          </span>
        );
      }
      if (lower.includes('अपवाद') || lower.includes('⚠️') || lower.includes('गलत') || lower.includes('नेगेटिव') || lower.includes('सावधानी') || lower.includes('warning')) {
        // Soft Pink / Light Red Highlight
        return (
          <span key={idx} className="bg-rose-500/25 text-rose-300 border-b-2 border-rose-400/60 px-1 py-0.5 rounded font-black mx-0.5">
            {clean}
          </span>
        );
      }
      // Light Yellow Highlight (Lucent Standard)
      return (
        <span key={idx} className="bg-amber-300/25 text-amber-200 border-b-2 border-amber-400/60 px-1.5 py-0.5 rounded font-black mx-0.5 shadow-sm">
          {clean}
        </span>
      );
    }

    if (part.startsWith('[[G:') && part.endsWith(']]')) {
      const clean = part.slice(4, -2);
      return (
        <span key={idx} className="bg-emerald-500/25 text-emerald-300 border-b-2 border-emerald-400/60 px-1.5 py-0.5 rounded font-black mx-0.5">
          {clean}
        </span>
      );
    }

    if (part.startsWith('[[R:') && part.endsWith(']]')) {
      const clean = part.slice(4, -2);
      return (
        <span key={idx} className="bg-rose-500/25 text-rose-300 border-b-2 border-rose-400/60 px-1.5 py-0.5 rounded font-black mx-0.5">
          {clean}
        </span>
      );
    }

    if (part.startsWith('[[Y:') && part.endsWith(']]')) {
      const clean = part.slice(4, -2);
      return (
        <span key={idx} className="bg-amber-300/25 text-amber-200 border-b-2 border-amber-400/60 px-1.5 py-0.5 rounded font-black mx-0.5">
          {clean}
        </span>
      );
    }

    return <span key={idx}>{part}</span>;
  });
}
