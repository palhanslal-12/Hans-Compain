import React, { useRef, useEffect, useState, useCallback } from 'react';

interface StenographerCanvasProps {
  strokeColor?: string;
  baseStrokeWidth?: number;
  onSave?: (dataUrl: string) => void;
  className?: string;
}

export const StenographerCanvas: React.FC<StenographerCanvasProps> = ({
  strokeColor = '#FACC15',
  baseStrokeWidth = 3.5,
  onSave,
  className = ""
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Refs for tracking movement speed and smoothing
  const lastPoint = useRef<{ x: number; y: number; pressure: number; timestamp: number } | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  // Initialize and scale canvas for High DPI displays
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // Set logical size
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    // Set display size
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext('2d', { desynchronized: true });
    if (ctx) {
      ctx.scale(dpr, dpr);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctxRef.current = ctx;
      
      // Draw background lines (Steno Notebook Style)
      drawBackground(ctx, rect.width, rect.height);
    }
  }, []);

  const drawBackground = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.fillStyle = '#050914';
    ctx.fillRect(0, 0, w, h);

    // Horizontal ruled lines
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 1;
    for (let y = 45; y < h; y += 42) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Vertical red margin
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(48, 0);
    ctx.lineTo(48, h);
    ctx.stroke();

    // Center divider
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w / 2, h);
    ctx.stroke();
  };

  useEffect(() => {
    initCanvas();
    window.addEventListener('resize', initCanvas);
    return () => window.removeEventListener('resize', initCanvas);
  }, [initCanvas]);

  const getPointerData = (e: React.PointerEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      pressure: e.pressure > 0 ? e.pressure : 0.5,
      timestamp: Date.now()
    };
  };

  const startDrawing = (e: React.PointerEvent) => {
    const data = getPointerData(e);
    if (!data) return;
    
    setIsDrawing(true);
    lastPoint.current = data;
    
    const ctx = ctxRef.current;
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(data.x, data.y);
    }
    
    // Prevent scrolling while drawing on mobile
    if (canvasRef.current) {
      canvasRef.current.setPointerCapture(e.pointerId);
    }
  };

  const draw = (e: React.PointerEvent) => {
    if (!isDrawing || !lastPoint.current) return;
    const currentPoint = getPointerData(e);
    if (!currentPoint) return;

    const ctx = ctxRef.current;
    if (!ctx) return;

    // Calculate distance and velocity for speed-sensitive width
    const dx = currentPoint.x - lastPoint.current.x;
    const dy = currentPoint.y - lastPoint.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const dt = currentPoint.timestamp - lastPoint.current.timestamp || 1;
    const velocity = distance / dt;

    // Logic: Faster = Thinner, Slower = Thicker (Mimics real pen behavior)
    // Combined with pressure if available
    const speedFactor = Math.max(0.3, Math.min(1.5, 1.5 - (velocity / 4)));
    const pressureFactor = 0.5 + currentPoint.pressure;
    const dynamicWidth = baseStrokeWidth * speedFactor * pressureFactor;

    ctx.lineWidth = dynamicWidth;
    ctx.strokeStyle = strokeColor;
    
    ctx.lineTo(currentPoint.x, currentPoint.y);
    ctx.stroke();

    lastPoint.current = currentPoint;
  };

  const stopDrawing = (e: React.PointerEvent) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    lastPoint.current = null;
    
    if (onSave && canvasRef.current) {
      onSave(canvasRef.current.toDataURL());
    }

    if (canvasRef.current) {
      canvasRef.current.releasePointerCapture(e.pointerId);
    }
  };

  const clearCanvas = () => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (ctx && canvas) {
      drawBackground(ctx, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1));
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full h-full min-h-[300px] rounded-2xl overflow-hidden shadow-inner border-2 border-slate-800/50 bg-[#050914] ${className}`}>
      <canvas
        ref={canvasRef}
        onPointerDown={startDrawing}
        onPointerMove={draw}
        onPointerUp={stopDrawing}
        onPointerCancel={stopDrawing}
        onPointerLeave={stopDrawing}
        className="touch-none cursor-crosshair block"
      />
      
      <div className="absolute top-2 right-2 flex gap-2">
         <button 
           onClick={clearCanvas}
           className="p-1.5 px-3 rounded-lg bg-slate-900/80 border border-slate-700 text-slate-300 text-[10px] font-bold hover:bg-rose-900/40 transition-colors"
         >
           Clear Pad
         </button>
      </div>

      <div className="absolute bottom-2 left-4 pointer-events-none">
        <span className="text-[9px] font-black text-amber-500/50 uppercase tracking-widest">
          Precision Steno Vector Canvas
        </span>
      </div>
    </div>
  );
};

export default StenographerCanvas;
