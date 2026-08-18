import React from 'react';
import { Gauge } from 'lucide-react';

interface AudioSpeedControlProps {
  currentRate: number;
  onRateChange: (newRate: number) => void;
  className?: string;
  isHindi?: boolean;
}

const SPEED_OPTIONS = [0.5, 0.75, 0.9, 1.0, 1.25, 1.5, 1.75, 2.0];

export const AudioSpeedControl: React.FC<AudioSpeedControlProps> = ({
  currentRate,
  onRateChange,
  className = "",
  isHindi = true
}) => {
  return (
    <div className={`flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/70 px-2 py-1 rounded-xl shadow-inner ${className}`}>
      <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400 shrink-0">
        <Gauge className="w-3.5 h-3.5" />
        <span>{isHindi ? "गति:" : "Speed:"}</span>
      </div>
      <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-none py-0.5">
        {SPEED_OPTIONS.map((rate) => {
          const isSelected = Math.abs(currentRate - rate) < 0.05;
          return (
            <button
              key={rate}
              type="button"
              onClick={() => onRateChange(rate)}
              title={`${rate}x audio speed`}
              className={`px-1.5 py-0.5 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 shadow-sm scale-105'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {rate}x
            </button>
          );
        })}
      </div>
    </div>
  );
};
