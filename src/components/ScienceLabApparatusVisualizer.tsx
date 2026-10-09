import React from 'react';
import { ScienceLabConfig } from './ScienceFormulaLabView';

interface VisualizerProps {
  activeLab: ScienceLabConfig;
  p1: number;
  p2: number;
  liveResult: {
    primaryLabel: string;
    primaryValue: string;
    secondaryLabel: string;
    secondaryValue: string;
    statusText: string;
  };
}

export const ScienceLabApparatusVisualizer: React.FC<VisualizerProps> = ({
  activeLab,
  p1,
  p2,
  liveResult
}) => {
  const labId = activeLab.id;

  // =========================================================================
  // 1. OHM'S LAW & ELECTRIC CIRCUIT (PHYSICS #1)
  // =========================================================================
  if (labId === 'ohm-circuit') {
    const voltage = p1;
    const resistance = p2;
    const current = voltage / resistance;
    const bulbBrightness = Math.min(1.0, Math.max(0.2, current / 4.0));
    const glowRadius = Math.min(50, Math.max(14, current * 10));

    return (
      <svg viewBox="0 0 540 220" className="w-full h-56 select-none">
        <defs>
          <radialGradient id="bulbGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FEF08A" stopOpacity={bulbBrightness} />
            <stop offset="60%" stopColor="#FACC15" stopOpacity={bulbBrightness * 0.5} />
            <stop offset="100%" stopColor="#EAB308" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="batteryGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#0369A1" />
          </linearGradient>
        </defs>

        {/* Circuit Loop Wires */}
        <rect x="60" y="40" width="420" height="140" fill="none" stroke="#38BDF8" strokeWidth="4" rx="8" />

        {/* Animated Moving Electron Dots along the wire */}
        <circle cx="160" cy="40" r="3" fill="#67E8F9" className="animate-pulse" />
        <circle cx="280" cy="40" r="3" fill="#67E8F9" className="animate-pulse" />
        <circle cx="480" cy="110" r="3" fill="#67E8F9" className="animate-pulse" />
        <circle cx="340" cy="180" r="3" fill="#67E8F9" className="animate-pulse" />
        <circle cx="180" cy="180" r="3" fill="#67E8F9" className="animate-pulse" />
        <circle cx="60" cy="110" r="3" fill="#67E8F9" className="animate-pulse" />

        {/* Battery DC Source on Left (x=60) */}
        <g transform="translate(42, 85)">
          <rect x="0" y="0" width="36" height="50" rx="4" fill="url(#batteryGrad)" stroke="#38BDF8" strokeWidth="1.5" />
          <rect x="12" y="-6" width="12" height="6" fill="#F8FAFC" rx="2" />
          <text x="18" y="24" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">{voltage}V</text>
          <text x="18" y="38" fill="#BAE6FD" fontSize="8" fontWeight="bold" textAnchor="middle">बैटरी DC</text>
          <text x="4" y="-8" fill="#F43F5E" fontSize="12" fontWeight="bold">+</text>
          <text x="4" y="62" fill="#38BDF8" fontSize="14" fontWeight="bold">-</text>
        </g>

        {/* Switch on Top Wire (x=160) */}
        <g transform="translate(160, 30)">
          <circle cx="0" cy="10" r="4" fill="#38BDF8" />
          <circle cx="35" cy="10" r="4" fill="#38BDF8" />
          <line x1="0" y1="10" x2="35" y2="10" stroke="#10B981" strokeWidth="3" />
          <text x="17" y="-2" fill="#10B981" fontSize="9" fontWeight="bold" textAnchor="middle">कुंजी [ON]</text>
        </g>

        {/* Resistor Component on Top Wire (x=270) */}
        <g transform="translate(255, 22)">
          <rect x="0" y="5" width="80" height="26" fill="#0F172A" stroke="#F59E0B" strokeWidth="2" rx="4" />
          <path d="M 8 18 L 16 10 L 24 26 L 32 10 L 40 26 L 48 10 L 56 26 L 64 18" fill="none" stroke="#F59E0B" strokeWidth="2.5" />
          <text x="40" y="44" fill="#FBBF24" fontSize="10" fontWeight="bold" textAnchor="middle">R = {resistance} Ω</text>
        </g>

        {/* Glowing Electric Bulb on Right Wire (x=480, y=110) */}
        <g transform="translate(480, 110)">
          <circle cx="0" cy="0" r={glowRadius} fill="url(#bulbGlow)" />
          <circle cx="0" cy="0" r="20" fill={current > 0.5 ? '#FEF08A' : '#334155'} stroke="#FACC15" strokeWidth="2" />
          <path d="M -7 8 L -4 -6 L 0 0 L 4 -6 L 7 8" fill="none" stroke={current > 1 ? '#EF4444' : '#E2E8F0'} strokeWidth="2" />
          <rect x="-8" y="16" width="16" height="8" fill="#64748B" rx="1" />
          <text x="0" y="36" fill="#FDE047" fontSize="10" fontWeight="bold" textAnchor="middle">बल्ब (Bulb)</text>
        </g>

        {/* Ammeter in Series on Bottom Wire (x=190, y=180) */}
        <g transform="translate(190, 180)">
          <circle cx="0" cy="0" r="20" fill="#0F172A" stroke="#06B6D4" strokeWidth="2" />
          <text x="0" y="5" fill="#06B6D4" fontSize="13" fontWeight="black" textAnchor="middle">A</text>
          <text x="0" y="32" fill="#67E8F9" fontSize="9" fontWeight="bold" textAnchor="middle">अमीटर: {current.toFixed(2)} A</text>
        </g>

        {/* Voltmeter in Parallel (x=350, y=180) */}
        <g transform="translate(350, 180)">
          <circle cx="0" cy="0" r="20" fill="#0F172A" stroke="#A855F7" strokeWidth="2" />
          <text x="0" y="5" fill="#A855F7" fontSize="13" fontWeight="black" textAnchor="middle">V</text>
          <text x="0" y="32" fill="#D8B4FE" fontSize="9" fontWeight="bold" textAnchor="middle">वोल्टमीटर: {voltage} V</text>
        </g>

        {/* Center Current Flow Indicator */}
        <g transform="translate(270, 110)">
          <rect x="-105" y="-18" width="210" height="36" fill="#091122" rx="10" stroke="#38BDF8" strokeWidth="1.5" />
          <text x="0" y="-1" fill="#38BDF8" fontSize="11" fontWeight="bold" textAnchor="middle">
            I = V / R = {voltage}V / {resistance}Ω
          </text>
          <text x="0" y="14" fill="#34D399" fontSize="11" fontWeight="extrabold" textAnchor="middle">
            प्रवाहित धारा = {current.toFixed(2)} A (एम्पियर)
          </text>
        </g>
      </svg>
    );
  }

  // =========================================================================
  // 2. CONVEX LENS OPTICS RAY DIAGRAM (PHYSICS #2)
  // =========================================================================
  if (labId === 'convex-lens') {
    const uAbs = p1;
    const f = p2;
    const u = -uAbs;
    const invV = 1 / f + 1 / u;
    const v = Math.abs(invV) < 0.0001 ? 999 : 1 / invV;
    const m = v / u;
    const lensX = 270;
    const axisY = 105;
    const scale = 2.4;
    const objX = Math.max(30, lensX - uAbs * scale);
    const objH = 40;
    const imgX = Math.min(500, Math.max(40, lensX + v * scale));
    const imgH = Math.min(75, Math.max(-75, -objH * m));
    const f1X = lensX - f * scale;
    const f2X = lensX + f * scale;

    return (
      <svg viewBox="0 0 540 220" className="w-full h-56 select-none">
        <defs>
          <marker id="arrowHead" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
            <polygon points="0 0, 6 3, 0 6" fill="#38BDF8" />
          </marker>
          <marker id="arrowHeadRed" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
            <polygon points="0 0, 6 3, 0 6" fill="#F43F5E" />
          </marker>
        </defs>

        <line x1="20" y1={axisY} x2="520" y2={axisY} stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />
        <line x1={lensX} y1="20" x2={lensX} y2="190" stroke="#38BDF8" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />

        <path
          d={`M ${lensX} 25 Q ${lensX + 16} 105 ${lensX} 185 Q ${lensX - 16} 105 ${lensX} 25`}
          fill="rgba(56, 189, 248, 0.2)"
          stroke="#38BDF8"
          strokeWidth="2.5"
        />
        <text x={lensX} y="18" fill="#38BDF8" fontSize="10" fontWeight="bold" textAnchor="middle">उत्तल लेंस (f = {f}cm)</text>

        {/* F1, 2F1, F2, 2F2 */}
        <circle cx={f1X} cy={axisY} r="3" fill="#FBBF24" />
        <text x={f1X} y={axisY + 14} fill="#FBBF24" fontSize="9" fontWeight="bold" textAnchor="middle">F₁</text>
        <circle cx={lensX - 2 * f * scale} cy={axisY} r="3" fill="#F59E0B" />
        <text x={lensX - 2 * f * scale} y={axisY + 14} fill="#F59E0B" fontSize="9" fontWeight="bold" textAnchor="middle">2F₁</text>
        <circle cx={f2X} cy={axisY} r="3" fill="#FBBF24" />
        <text x={f2X} y={axisY + 14} fill="#FBBF24" fontSize="9" fontWeight="bold" textAnchor="middle">F₂</text>
        <circle cx={lensX + 2 * f * scale} cy={axisY} r="3" fill="#F59E0B" />
        <text x={lensX + 2 * f * scale} y={axisY + 14} fill="#F59E0B" fontSize="9" fontWeight="bold" textAnchor="middle">2F₂</text>

        {/* Object Arrow */}
        <line x1={objX} y1={axisY} x2={objX} y2={axisY - objH} stroke="#22C55E" strokeWidth="3.5" markerEnd="url(#arrowHead)" />
        <text x={objX} y={axisY - objH - 6} fill="#4ADE80" fontSize="10" fontWeight="bold" textAnchor="middle">वस्तु (|u|={uAbs})</text>

        {/* Ray 1 */}
        <line x1={objX} y1={axisY - objH} x2={lensX} y2={axisY - objH} stroke="#38BDF8" strokeWidth="1.5" />
        <line x1={lensX} y1={axisY - objH} x2={imgX} y2={axisY + imgH} stroke="#38BDF8" strokeWidth="1.5" />

        {/* Ray 2 */}
        <line x1={objX} y1={axisY - objH} x2={imgX} y2={axisY + imgH} stroke="#F43F5E" strokeWidth="1.5" strokeDasharray="3 2" />

        {/* Image */}
        {Math.abs(v) < 300 && (
          <g>
            <line
              x1={imgX}
              y1={axisY}
              x2={imgX}
              y2={axisY + imgH}
              stroke={v > 0 ? '#F43F5E' : '#A855F7'}
              strokeWidth="3.5"
              markerEnd={v > 0 ? 'url(#arrowHeadRed)' : 'url(#arrowHead)'}
            />
            <text x={imgX} y={imgH > 0 ? axisY + imgH + 14 : axisY + imgH - 6} fill={v > 0 ? '#FB7185' : '#C084FC'} fontSize="10" fontWeight="bold" textAnchor="middle">
              प्रतिबिंब (v={v.toFixed(1)}cm)
            </text>
          </g>
        )}

        <rect x="20" y="180" width="500" height="30" rx="8" fill="#091122" stroke="#334155" strokeWidth="1" />
        <text x="270" y="200" fill="#E2E8F0" fontSize="10" fontWeight="bold" textAnchor="middle">
          {v > 0 ? `वास्तविक तथा उल्टा (Real & Inverted) | आवर्धन m = ${m.toFixed(2)}x` : `आभासी तथा सीधा (Virtual & Erect) | आवर्धन m = ${m.toFixed(2)}x`}
        </text>
      </svg>
    );
  }

  // =========================================================================
  // 3. SPHERICAL MIRROR REFLECTION (PHYSICS #3)
  // =========================================================================
  if (labId === 'spherical-mirror') {
    const uAbs = p1; // 10 to 80 cm
    const r = p2;    // Radius R = 2f (20 to 60 cm)
    const f = r / 2;
    const u = -uAbs;
    const fVal = -f; // Concave mirror
    const invV = 1 / fVal - 1 / u;
    const v = Math.abs(invV) < 0.001 ? -999 : 1 / invV;
    const m = -v / u;
    const mirrorX = 400;
    const axisY = 105;
    const scale = 3.5;
    const objX = Math.max(40, mirrorX - uAbs * scale);
    const objH = 40;
    const imgX = Math.min(500, Math.max(40, mirrorX + v * scale));
    const imgH = -objH * m;

    return (
      <svg viewBox="0 0 540 220" className="w-full h-56 select-none">
        {/* Principal Axis */}
        <line x1="20" y1={axisY} x2="520" y2={axisY} stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />

        {/* Concave Mirror Curve */}
        <path
          d={`M ${mirrorX} 25 Q ${mirrorX - 25} 105 ${mirrorX} 185`}
          fill="none"
          stroke="#38BDF8"
          strokeWidth="3.5"
        />
        {/* Silvered Back Hatches */}
        {[35, 55, 75, 95, 115, 135, 155, 175].map((y, i) => (
          <line key={i} x1={mirrorX + 2} y1={y} x2={mirrorX + 12} y2={y - 8} stroke="#64748B" strokeWidth="1.5" />
        ))}
        <text x={mirrorX} y="18" fill="#38BDF8" fontSize="10" fontWeight="bold" textAnchor="middle">अवतल दर्पण (Concave)</text>

        {/* Pole P, Focus F, Center C */}
        <circle cx={mirrorX} cy={axisY} r="3" fill="#38BDF8" />
        <text x={mirrorX - 10} y={axisY + 15} fill="#38BDF8" fontSize="9" fontWeight="bold">ध्रुव P</text>
        <circle cx={mirrorX - f * scale} cy={axisY} r="3" fill="#FBBF24" />
        <text x={mirrorX - f * scale} y={axisY + 15} fill="#FBBF24" fontSize="9" fontWeight="bold" textAnchor="middle">F ({f}cm)</text>
        <circle cx={mirrorX - r * scale} cy={axisY} r="3" fill="#F59E0B" />
        <text x={mirrorX - r * scale} y={axisY + 15} fill="#F59E0B" fontSize="9" fontWeight="bold" textAnchor="middle">C ({r}cm)</text>

        {/* Object Arrow */}
        <line x1={objX} y1={axisY} x2={objX} y2={axisY - objH} stroke="#22C55E" strokeWidth="3" />
        <polygon points={`${objX},${axisY - objH - 6} ${objX - 4},${axisY - objH} ${objX + 4},${axisY - objH}`} fill="#22C55E" />
        <text x={objX} y={axisY - objH - 10} fill="#4ADE80" fontSize="9" fontWeight="bold" textAnchor="middle">वस्तु (u=-{uAbs}cm)</text>

        {/* Reflected Image Arrow */}
        {Math.abs(v) < 300 && (
          <g>
            <line x1={imgX} y1={axisY} x2={imgX} y2={axisY + imgH} stroke="#F43F5E" strokeWidth="3" />
            <polygon points={`${imgX},${axisY + imgH + (imgH > 0 ? 6 : -6)} ${imgX - 4},${axisY + imgH} ${imgX + 4},${axisY + imgH}`} fill="#F43F5E" />
            <text x={imgX} y={axisY + imgH + (imgH > 0 ? 18 : -10)} fill="#FB7185" fontSize="9" fontWeight="bold" textAnchor="middle">
              प्रतिबिंब (v={v.toFixed(1)}cm)
            </text>
          </g>
        )}

        {/* Reflection Rays */}
        <line x1={objX} y1={axisY - objH} x2={mirrorX - 8} y2={axisY - objH} stroke="#38BDF8" strokeWidth="1.5" />
        <line x1={mirrorX - 8} y1={axisY - objH} x2={imgX} y2={axisY + imgH} stroke="#38BDF8" strokeWidth="1.5" />

        <rect x="20" y="185" width="500" height="26" rx="6" fill="#091122" stroke="#334155" strokeWidth="1" />
        <text x="270" y="202" fill="#E2E8F0" fontSize="10" fontWeight="bold" textAnchor="middle">
          दर्पण सूत्र: 1/v + 1/u = 1/f | वक्रता त्रिज्या R = 2f = {r} cm | आवर्धन m = -v/u = {m.toFixed(2)}
        </text>
      </svg>
    );
  }

  // =========================================================================
  // 4. PRISM & SNELL'S LAW VIBGYOR (PHYSICS #4)
  // =========================================================================
  if (labId === 'prism-snell') {
    const angleI = p1; // 30 to 65 deg
    const prismAngle = p2; // 60 deg
    const vibgyorColors = [
      { name: 'Red', col: '#EF4444', dev: 28 },
      { name: 'Orange', col: '#F97316', dev: 31 },
      { name: 'Yellow', col: '#EAB308', dev: 34 },
      { name: 'Green', col: '#22C55E', dev: 37 },
      { name: 'Blue', col: '#06B6D4', dev: 40 },
      { name: 'Indigo', col: '#3B82F6', dev: 43 },
      { name: 'Violet', col: '#8B5CF6', dev: 46 }
    ];

    return (
      <svg viewBox="0 0 540 220" className="w-full h-56 select-none">
        {/* Glass Prism Body */}
        <polygon points="260,30 150,180 370,180" fill="rgba(14, 165, 233, 0.18)" stroke="#38BDF8" strokeWidth="2.5" />
        <text x="260" y="22" fill="#38BDF8" fontSize="11" fontWeight="bold" textAnchor="middle">प्रिज्म कोण A = {prismAngle}°</text>

        {/* White Incident Beam */}
        <line x1="30" y1="140" x2="195" y2="120" stroke="#FFFFFF" strokeWidth="3" />
        <text x="90" y="125" fill="#FFFFFF" fontSize="10" fontWeight="bold">श्वेत प्रकाश (White Light)</text>
        <text x="90" y="152" fill="#BAE6FD" fontSize="8">आपतन कोण i = {angleI}°</text>

        {/* Refracted Dispersion Rays inside & exiting into VIBGYOR */}
        {vibgyorColors.map((ray, i) => {
          const exitY = 110 + i * 8;
          const screenY = 60 + i * 16;
          return (
            <g key={i}>
              <line x1="195" y1="120" x2="320" y2={exitY} stroke={ray.col} strokeWidth="1.8" opacity="0.9" />
              <line x1="320" y1={exitY} x2="480" y2={screenY} stroke={ray.col} strokeWidth="2.5" />
              <circle cx="480" cy={screenY} r="3" fill={ray.col} />
              <text x="490" y={screenY + 4} fill={ray.col} fontSize="9" fontWeight="bold">{ray.name}</text>
            </g>
          );
        })}

        {/* Observation Screen on Right */}
        <rect x="475" y="45" width="8" height="135" rx="3" fill="#E2E8F0" />
        <text x="478" y="38" fill="#E2E8F0" fontSize="8" fontWeight="bold" textAnchor="middle">सफेद पर्दा</text>

        <rect x="30" y="185" width="480" height="26" rx="6" fill="#091122" stroke="#334155" strokeWidth="1" />
        <text x="270" y="202" fill="#FBBF24" fontSize="10" fontWeight="bold" textAnchor="middle">
          वर्ण-विक्षेपण: बैंगनी (Violet) का विचलन अधिकतम तथा लाल (Red) का विचलन न्यूनतम होता है
        </text>
      </svg>
    );
  }

  // =========================================================================
  // 5. SIMPLE PENDULUM OSCILLATION (PHYSICS #5)
  // =========================================================================
  if (labId === 'pendulum-gravity') {
    const lengthCm = p1;
    const g = p2;
    const lengthM = lengthCm / 100;
    const period = 2 * Math.PI * Math.sqrt(lengthM / g);
    const bobX = 270 + Math.sin(0.35) * (lengthCm * 0.65);
    const bobY = 30 + Math.cos(0.35) * (lengthCm * 0.65);

    return (
      <svg viewBox="0 0 540 220" className="w-full h-56 select-none">
        {/* Rigid Support Stand */}
        <rect x="200" y="18" width="140" height="10" fill="#64748B" rx="2" />
        <circle cx="270" cy="23" r="4" fill="#E2E8F0" />

        {/* Central Vertical Equilibrium Line */}
        <line x1="270" y1="23" x2="270" y2="180" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />

        {/* Pendulum Thread */}
        <line x1="270" y1="23" x2={bobX} y2={bobY} stroke="#38BDF8" strokeWidth="2" />

        {/* Metallic Bob */}
        <circle cx={bobX} cy={bobY} r="16" fill="#F59E0B" stroke="#D97706" strokeWidth="2.5" />
        <text x={bobX} y={bobY + 4} fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle">m</text>

        {/* Oscillation Arc Trail */}
        <path
          d={`M ${270 - (bobX - 270)} ${bobY} Q 270 ${bobY + 10} ${bobX} ${bobY}`}
          fill="none"
          stroke="#06B6D4"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />

        {/* Measurement Box on Left */}
        <g transform="translate(40, 60)">
          <rect x="0" y="0" width="130" height="65" rx="8" fill="#091122" stroke="#38BDF8" strokeWidth="1" />
          <text x="12" y="20" fill="#38BDF8" fontSize="9" fontWeight="bold">प्रभावी लंबाई L:</text>
          <text x="12" y="38" fill="#FFFFFF" fontSize="13" fontWeight="black">{lengthCm} cm ({lengthM.toFixed(2)} m)</text>
          <text x="12" y="54" fill="#34D399" fontSize="8">गुरुत्व g = {g} m/s²</text>
        </g>

        {/* Period Readout on Right */}
        <g transform="translate(370, 60)">
          <rect x="0" y="0" width="130" height="65" rx="8" fill="#091122" stroke="#10B981" strokeWidth="1" />
          <text x="12" y="20" fill="#10B981" fontSize="9" fontWeight="bold">आवर्तकाल T = 2π√(L/g):</text>
          <text x="12" y="42" fill="#FBBF24" fontSize="16" fontWeight="black">{period.toFixed(2)} s</text>
          <text x="12" y="56" fill="#CBD5E1" fontSize="8">f = {(1 / period).toFixed(2)} Hz</text>
        </g>

        <rect x="40" y="185" width="460" height="26" rx="6" fill="#091122" stroke="#334155" strokeWidth="1" />
        <text x="270" y="202" fill="#E2E8F0" fontSize="10" fontWeight="bold" textAnchor="middle">
          T केवल लंबाई (L) और गुरुत्व (g) पर निर्भर करता है, गोलक के द्रव्यमान (m) पर नहीं
        </text>
      </svg>
    );
  }

  // =========================================================================
  // 6. PROJECTILE MOTION (PHYSICS #6)
  // =========================================================================
  if (labId === 'projectile-motion') {
    const speed = p1; // 10 to 60 m/s
    const angleDeg = p2; // 15 to 75 deg
    const angleRad = (angleDeg * Math.PI) / 180;
    const g = 9.8;
    const timeFlight = (2 * speed * Math.sin(angleRad)) / g;
    const maxHeight = (Math.pow(speed * Math.sin(angleRad), 2)) / (2 * g);
    const range = (Math.pow(speed, 2) * Math.sin(2 * angleRad)) / g;

    // SVG path mapping
    const startX = 60;
    const startY = 170;
    const apexX = 260;
    const apexY = Math.max(30, startY - Math.min(130, maxHeight * 1.2));
    const endX = 460;

    return (
      <svg viewBox="0 0 540 220" className="w-full h-56 select-none">
        {/* Ground */}
        <line x1="30" y1={startY} x2="510" y2={startY} stroke="#475569" strokeWidth="3" />
        <polygon points="505,170 495,165 495,175" fill="#475569" />

        {/* Cannon on ground */}
        <g transform={`translate(${startX}, ${startY}) rotate(-${angleDeg})`}>
          <rect x="-10" y="-8" width="35" height="16" fill="#64748B" rx="3" stroke="#94A3B8" />
          <circle cx="0" cy="0" r="10" fill="#334155" />
        </g>

        {/* Parabolic Trajectory Path */}
        <path
          d={`M ${startX} ${startY} Q ${apexX} ${apexY * 0.3} ${endX} ${startY}`}
          fill="none"
          stroke="#F59E0B"
          strokeWidth="2.5"
          strokeDasharray="6 4"
        />

        {/* Flying Cannonball near Apex */}
        <circle cx={apexX} cy={apexY} r="7" fill="#EF4444" stroke="#FCA5A5" strokeWidth="2" className="animate-pulse" />

        {/* Max Height Indicator */}
        <line x1={apexX} y1={startY} x2={apexX} y2={apexY} stroke="#06B6D4" strokeWidth="1.5" strokeDasharray="3 3" />
        <text x={apexX} y={apexY - 8} fill="#22D3EE" fontSize="9" fontWeight="bold" textAnchor="middle">
          H_max = {maxHeight.toFixed(1)} m
        </text>

        {/* Range Indicator */}
        <text x={(startX + endX) / 2} y={startY + 16} fill="#FBBF24" fontSize="10" fontWeight="bold" textAnchor="middle">
          क्षैतिज परास R = {range.toFixed(1)} m (उड्डयन काल T = {timeFlight.toFixed(1)} s)
        </text>

        <rect x="30" y="185" width="480" height="26" rx="6" fill="#091122" stroke="#334155" strokeWidth="1" />
        <text x="270" y="202" fill="#E2E8F0" fontSize="10" fontWeight="bold" textAnchor="middle">
          प्रक्षेप्य पथ सदैव परवलयाकार (Parabola) होता है | 45° कोण पर परास अधिकतम (R_max) होती है
        </text>
      </svg>
    );
  }

  // =========================================================================
  // 7. NEWTON'S 2ND LAW & FRICTION (PHYSICS #7)
  // =========================================================================
  if (labId === 'newton-friction') {
    const mass = p1; // 1 to 20 kg
    const pullForce = p2; // 5 to 100 N
    const mu = 0.25; // friction coefficient
    const frictionForce = mass * 9.8 * mu;
    const netForce = Math.max(0, pullForce - frictionForce);
    const accel = netForce / mass;

    return (
      <svg viewBox="0 0 540 220" className="w-full h-56 select-none">
        {/* Horizontal Surface Track */}
        <line x1="40" y1="140" x2="500" y2="140" stroke="#64748B" strokeWidth="4" />
        {[60, 100, 140, 180, 220, 260, 300, 340, 380, 420, 460].map((x, i) => (
          <line key={i} x1={x} y1="140" x2={x - 12} y2="152" stroke="#334155" strokeWidth="2" />
        ))}

        {/* Block with Mass m */}
        <g transform="translate(180, 70)">
          <rect x="0" y="0" width="110" height="70" rx="6" fill="#1E293B" stroke="#38BDF8" strokeWidth="2.5" />
          <text x="55" y="32" fill="#FFFFFF" fontSize="14" fontWeight="black" textAnchor="middle">द्रव्यमान m</text>
          <text x="55" y="52" fill="#38BDF8" fontSize="12" fontWeight="bold" textAnchor="middle">{mass} kg</text>
        </g>

        {/* Pulling Force Vector (Right) */}
        <g transform="translate(290, 105)">
          <line x1="0" y1="0" x2="110" y2="0" stroke="#10B981" strokeWidth="3.5" />
          <polygon points="110,0 98,-6 98,6" fill="#10B981" />
          <text x="55" y="-8" fill="#34D399" fontSize="10" fontWeight="bold" textAnchor="middle">खिंचाव बल F = {pullForce} N</text>
        </g>

        {/* Friction Force Vector (Left) */}
        <g transform="translate(180, 138)">
          <line x1="0" y1="0" x2="-80" y2="0" stroke="#EF4444" strokeWidth="3" />
          <polygon points="-80,0 -68,-5 -68,5" fill="#EF4444" />
          <text x="-40" y="-6" fill="#F87171" fontSize="9" fontWeight="bold" textAnchor="middle">घर्षण f_s = {frictionForce.toFixed(1)} N</text>
        </g>

        {/* Normal Reaction & Weight mg */}
        <line x1="235" y1="70" x2="235" y2="25" stroke="#F59E0B" strokeWidth="2" />
        <polygon points="235,25 231,35 239,35" fill="#F59E0B" />
        <text x="235" y="18" fill="#FBBF24" fontSize="9" fontWeight="bold" textAnchor="middle">N = mg</text>

        <rect x="30" y="185" width="480" height="26" rx="6" fill="#091122" stroke="#334155" strokeWidth="1" />
        <text x="270" y="202" fill="#E2E8F0" fontSize="10" fontWeight="bold" textAnchor="middle">
          {pullForce > frictionForce
            ? `गुटका गतिमान है! परिणामी त्वरण a = (F - f) / m = ${accel.toFixed(2)} m/s²`
            : `गुटका स्थिर है (स्थैतिक घर्षण): F (${pullForce}N) ≤ सीमांत घर्षण (${frictionForce.toFixed(1)}N)`}
        </text>
      </svg>
    );
  }

  // =========================================================================
  // 8. RESISTOR NETWORK SERIES & PARALLEL (PHYSICS #8)
  // =========================================================================
  if (labId === 'resistor-network') {
    const r1 = p1; // 1 to 20 ohm
    const r2 = p2; // 1 to 20 ohm
    const rSeries = r1 + r2;
    const rParallel = (r1 * r2) / (r1 + r2);

    return (
      <svg viewBox="0 0 540 220" className="w-full h-56 select-none">
        {/* Left Half: Series Circuit */}
        <g transform="translate(30, 25)">
          <rect x="0" y="0" width="225" height="150" rx="8" fill="#091122" stroke="#38BDF8" strokeWidth="1.5" />
          <text x="112" y="20" fill="#38BDF8" fontSize="10" fontWeight="bold" textAnchor="middle">श्रेणीक्रम (Series)</text>

          {/* Series Resistors */}
          <line x1="25" y1="75" x2="55" y2="75" stroke="#38BDF8" strokeWidth="2.5" />
          <rect x="55" y="60" width="50" height="30" fill="#1E293B" stroke="#F59E0B" strokeWidth="1.5" rx="3" />
          <text x="80" y="79" fill="#FBBF24" fontSize="9" fontWeight="bold" textAnchor="middle">{r1}Ω</text>

          <line x1="105" y1="75" x2="120" y2="75" stroke="#38BDF8" strokeWidth="2.5" />
          <rect x="120" y="60" width="50" height="30" fill="#1E293B" stroke="#10B981" strokeWidth="1.5" rx="3" />
          <text x="145" y="79" fill="#34D399" fontSize="9" fontWeight="bold" textAnchor="middle">{r2}Ω</text>
          <line x1="170" y1="75" x2="200" y2="75" stroke="#38BDF8" strokeWidth="2.5" />

          <text x="112" y="125" fill="#FFFFFF" fontSize="11" fontWeight="extrabold" textAnchor="middle">
            R_s = R₁ + R₂ = {rSeries.toFixed(1)} Ω
          </text>
          <text x="112" y="140" fill="#94A3B8" fontSize="8" textAnchor="middle">समान धारा प्रवाहित होती है</text>
        </g>

        {/* Right Half: Parallel Circuit */}
        <g transform="translate(285, 25)">
          <rect x="0" y="0" width="225" height="150" rx="8" fill="#091122" stroke="#10B981" strokeWidth="1.5" />
          <text x="112" y="20" fill="#10B981" fontSize="10" fontWeight="bold" textAnchor="middle">समांतर क्रम (Parallel)</text>

          {/* Parallel Branches */}
          <line x1="25" y1="75" x2="55" y2="75" stroke="#10B981" strokeWidth="2.5" />
          <line x1="55" y1="45" x2="55" y2="105" stroke="#10B981" strokeWidth="2.5" />

          {/* Top branch */}
          <line x1="55" y1="45" x2="80" y2="45" stroke="#10B981" strokeWidth="2" />
          <rect x="80" y="32" width="65" height="26" fill="#1E293B" stroke="#F59E0B" strokeWidth="1.5" rx="3" />
          <text x="112" y="49" fill="#FBBF24" fontSize="9" fontWeight="bold" textAnchor="middle">R₁ = {r1}Ω</text>
          <line x1="145" y1="45" x2="170" y2="45" stroke="#10B981" strokeWidth="2" />

          {/* Bottom branch */}
          <line x1="55" y1="105" x2="80" y2="105" stroke="#10B981" strokeWidth="2" />
          <rect x="80" y="92" width="65" height="26" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" rx="3" />
          <text x="112" y="109" fill="#38BDF8" fontSize="9" fontWeight="bold" textAnchor="middle">R₂ = {r2}Ω</text>
          <line x1="145" y1="105" x2="170" y2="105" stroke="#10B981" strokeWidth="2" />

          <line x1="170" y1="45" x2="170" y2="105" stroke="#10B981" strokeWidth="2.5" />
          <line x1="170" y1="75" x2="200" y2="75" stroke="#10B981" strokeWidth="2.5" />

          <text x="112" y="138" fill="#FBBF24" fontSize="11" fontWeight="extrabold" textAnchor="middle">
            R_p = (R₁×R₂)/(R₁+R₂) = {rParallel.toFixed(2)} Ω
          </text>
        </g>

        <rect x="30" y="185" width="480" height="26" rx="6" fill="#091122" stroke="#334155" strokeWidth="1" />
        <text x="270" y="202" fill="#E2E8F0" fontSize="10" fontWeight="bold" textAnchor="middle">
          घरेलू परिपथों में सभी उपकरण समांतर क्रम में जोड़े जाते हैं ताकि प्रत्येक को 220V मिले
        </text>
      </svg>
    );
  }

  // =========================================================================
  // 9. FARADAY'S INDUCTION & TRANSFORMER (PHYSICS #9)
  // =========================================================================
  if (labId === 'faraday-transformer') {
    const np = p1; // Primary turns (e.g. 50 to 500)
    const ns = p2; // Secondary turns (e.g. 50 to 1000)
    const vp = 220;
    const vs = (vp * ns) / np;
    const isStepUp = ns > np;

    return (
      <svg viewBox="0 0 540 220" className="w-full h-56 select-none">
        {/* Soft Iron Core Square Frame */}
        <rect x="180" y="30" width="180" height="135" rx="8" fill="none" stroke="#64748B" strokeWidth="26" />
        <rect x="193" y="43" width="154" height="109" rx="4" fill="#040814" />

        {/* Primary Coil on Left Leg */}
        <g transform="translate(160, 45)">
          {[0, 15, 30, 45, 60, 75, 90].map((y, i) => (
            <ellipse key={i} cx="12" cy={y} rx="18" ry="6" fill="none" stroke="#F59E0B" strokeWidth="3" />
          ))}
          <text x="-15" y="50" fill="#FBBF24" fontSize="10" fontWeight="bold" textAnchor="middle">Np = {np}</text>
          <text x="-15" y="65" fill="#FFFFFF" fontSize="9" textAnchor="middle">{vp}V AC</text>
        </g>

        {/* Secondary Coil on Right Leg */}
        <g transform="translate(365, 45)">
          {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((y, i) => (
            <ellipse key={i} cx="12" cy={y} rx="18" ry="5" fill="none" stroke="#06B6D4" strokeWidth="2.5" />
          ))}
          <text x="45" y="50" fill="#67E8F9" fontSize="10" fontWeight="bold" textAnchor="middle">Ns = {ns}</text>
          <text x="45" y="68" fill="#FDE047" fontSize="12" fontWeight="black" textAnchor="middle">{vs.toFixed(1)}V</text>
        </g>

        {/* Magnetic Flux Lines in Core */}
        <rect x="200" y="50" width="140" height="95" fill="none" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="6 4" rx="4" />
        <text x="270" y="100" fill="#38BDF8" fontSize="10" fontWeight="bold" textAnchor="middle">
          चुंबकीय फ्लक्स Φ
        </text>

        <rect x="30" y="180" width="480" height="30" rx="8" fill="#091122" stroke="#334155" strokeWidth="1" />
        <text x="270" y="200" fill="#E2E8F0" fontSize="10" fontWeight="bold" textAnchor="middle">
          {isStepUp
            ? `ऊंचाई ट्रांसफार्मर (Step-Up): Vs (${vs.toFixed(1)}V) > Vp (${vp}V) | वोल्टेज बढ़ता है, धारा घटती है`
            : `अपचाई ट्रांसफार्मर (Step-Down): Vs (${vs.toFixed(1)}V) < Vp (${vp}V) | वोल्टेज घटता है, धारा बढ़ती है`}
        </text>
      </svg>
    );
  }

  // =========================================================================
  // 10. SOUND WAVES & RESONANCE TUBE (PHYSICS #10)
  // =========================================================================
  if (labId === 'sound-wave-echo') {
    const freq = p1; // 200 to 1000 Hz
    const tubeLenCm = p2; // 10 to 100 cm
    const vSound = 340; // m/s
    const lambda = (vSound / freq) * 100; // cm

    return (
      <svg viewBox="0 0 540 220" className="w-full h-56 select-none">
        {/* Vibrating Tuning Fork on Left */}
        <g transform="translate(60, 65)">
          <rect x="20" y="30" width="8" height="40" fill="#94A3B8" rx="2" />
          <path d="M 10 30 L 10 0 M 38 30 L 38 0" stroke="#E2E8F0" strokeWidth="4" fill="none" />
          <circle cx="10" cy="0" r="3" fill="#38BDF8" className="animate-ping" />
          <circle cx="38" cy="0" r="3" fill="#38BDF8" className="animate-ping" />
          <text x="24" y="90" fill="#38BDF8" fontSize="9" fontWeight="bold" textAnchor="middle">स्वरित्र {freq} Hz</text>
        </g>

        {/* Resonance Glass Tube */}
        <g transform="translate(130, 45)">
          <rect x="0" y="0" width="280" height="70" fill="rgba(14, 165, 233, 0.08)" stroke="#CBD5E1" strokeWidth="2.5" rx="4" />

          {/* Water Column inside Tube (Closed End on Right) */}
          <rect x="180" y="2" width="98" height="66" fill="#0284C7" opacity="0.6" rx="2" />
          <text x="230" y="38" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">जल स्तंभ</text>

          {/* Longitudinal Sound Waveform Standing Nodes */}
          <path
            d="M 10 35 Q 50 10 90 35 Q 135 60 180 35"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="2.5"
          />
          <path
            d="M 10 35 Q 50 60 90 35 Q 135 10 180 35"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="2.5"
            strokeDasharray="4 2"
          />
          <text x="10" y="20" fill="#34D399" fontSize="8">प्रस्पंद (Antinode)</text>
          <text x="180" y="20" fill="#F87171" fontSize="8" textAnchor="end">निस्पंद (Node)</text>
        </g>

        {/* Readout Panels */}
        <g transform="translate(430, 50)">
          <rect x="0" y="0" width="90" height="60" rx="6" fill="#091122" stroke="#38BDF8" strokeWidth="1" />
          <text x="45" y="18" fill="#38BDF8" fontSize="8" fontWeight="bold" textAnchor="middle">तरंगदैर्ध्य λ</text>
          <text x="45" y="38" fill="#FBBF24" fontSize="13" fontWeight="black" textAnchor="middle">{lambda.toFixed(1)} cm</text>
          <text x="45" y="52" fill="#CBD5E1" fontSize="8" textAnchor="middle">v = {vSound} m/s</text>
        </g>

        <rect x="30" y="180" width="480" height="30" rx="8" fill="#091122" stroke="#334155" strokeWidth="1" />
        <text x="270" y="200" fill="#E2E8F0" fontSize="10" fontWeight="bold" textAnchor="middle">
          अनुनाद शर्त: बंद नली में प्रथम अनुनाद लंबाई l₁ = λ/4 = {(lambda / 4).toFixed(1)} cm | v = 2f(l₂ - l₁)
        </text>
      </svg>
    );
  }

  // =========================================================================
  // 11. pH SCALE & INDICATORS (CHEMISTRY #11)
  // =========================================================================
  if (labId === 'ph-scale-indicator') {
    const ph = p1;
    const getPhColor = (val: number) => {
      if (val <= 2) return '#DC2626';
      if (val <= 4) return '#EA580C';
      if (val <= 6) return '#CA8A04';
      if (val <= 8) return '#16A34A';
      if (val <= 10) return '#0284C7';
      if (val <= 12) return '#4F46E5';
      return '#7E22CE';
    };
    const liquidColor = getPhColor(ph);

    return (
      <svg viewBox="0 0 540 220" className="w-full h-56 select-none">
        {/* Burette Setup on Left */}
        <g transform="translate(90, 15)">
          <line x1="10" y1="5" x2="10" y2="180" stroke="#64748B" strokeWidth="5" />
          <line x1="-15" y1="180" x2="35" y2="180" stroke="#64748B" strokeWidth="6" />
          <rect x="35" y="5" width="14" height="120" fill="rgba(255,255,255,0.08)" stroke="#94A3B8" strokeWidth="1.5" rx="2" />
          <rect x="37" y="35" width="10" height="88" fill="#38BDF8" opacity="0.75" />
          <circle cx="42" cy="150" r="2.5" fill="#38BDF8" className="animate-bounce" />
          <text x="42" y="-2" fill="#94A3B8" fontSize="8" textAnchor="middle">ब्यूरेट</text>
        </g>

        {/* Conical Flask with pH Liquid */}
        <g transform="translate(160, 40)">
          <path
            d="M 40 10 L 40 40 L 5 125 Q 0 135 15 135 L 85 135 Q 100 135 95 125 L 60 40 L 60 10 Z"
            fill="none"
            stroke="#CBD5E1"
            strokeWidth="2.5"
          />
          <path
            d="M 20 105 Q 50 100 80 105 L 87 132 Q 95 135 80 135 L 20 135 Q 5 135 13 132 Z"
            fill={liquidColor}
            opacity="0.85"
          />
          <circle cx="35" cy="115" r="2" fill="#FFFFFF" opacity="0.8" className="animate-pulse" />
          <circle cx="55" cy="122" r="3" fill="#FFFFFF" opacity="0.6" className="animate-pulse" />
          <text x="50" y="152" fill={liquidColor} fontSize="12" fontWeight="extrabold" textAnchor="middle">
            pH = {ph}
          </text>
        </g>

        {/* Universal Indicator Color Bar on Right */}
        <g transform="translate(320, 30)">
          <text x="90" y="5" fill="#F8FAFC" fontSize="11" fontWeight="bold" textAnchor="middle">
            सार्वत्रिक सूचक pH पैमाना (0 - 14)
          </text>

          <g transform="translate(0, 18)">
            {[
              { val: 1, c: '#DC2626', lbl: '1 अम्ल' },
              { val: 3, c: '#EA580C', lbl: '3' },
              { val: 5, c: '#EAB308', lbl: '5' },
              { val: 7, c: '#16A34A', lbl: '7 उदासीन' },
              { val: 9, c: '#0284C7', lbl: '9' },
              { val: 11, c: '#4F46E5', lbl: '11' },
              { val: 13, c: '#7E22CE', lbl: '13 क्षार' }
            ].map((block, idx) => (
              <g key={idx} transform={`translate(${idx * 26}, 0)`}>
                <rect
                  x="0"
                  y="0"
                  width="22"
                  height="34"
                  rx="3"
                  fill={block.c}
                  stroke={Math.abs(ph - block.val) <= 1 ? '#FFFFFF' : 'none'}
                  strokeWidth="2.5"
                />
                <text x="11" y="48" fill="#94A3B8" fontSize="8" fontWeight="bold" textAnchor="middle">
                  {block.lbl}
                </text>
              </g>
            ))}
          </g>

          <g transform={`translate(${Math.min(160, Math.max(0, (ph / 14) * 160))}, 14)`}>
            <polygon points="11, -6 6, -14 16, -14" fill="#FACC15" />
          </g>

          {/* Litmus Paper Result */}
          <g transform="translate(0, 85)">
            <rect x="0" y="0" width="180" height="55" rx="8" fill="#091122" stroke="#334155" strokeWidth="1" />
            <text x="10" y="18" fill="#38BDF8" fontSize="9" fontWeight="bold">लिटमस पत्र प्रभाव:</text>
            <text x="10" y="34" fill={ph < 7 ? '#F87171' : ph > 7 ? '#60A5FA' : '#4ADE80'} fontSize="10" fontWeight="extrabold">
              {ph < 7 ? '• नीला लिटमस लाल हुआ' : ph > 7 ? '• लाल लिटमस नीला हुआ' : '• कोई रंग परिवर्तन नहीं (उदासीन)'}
            </text>
          </g>
        </g>
      </svg>
    );
  }

  // =========================================================================
  // 12. BOHR ATOMIC MODEL & ELECTRON SHELLS (CHEMISTRY #12)
  // =========================================================================
  if (labId === 'bohr-periodic-118') {
    const atomicNum = Math.min(20, Math.max(1, Math.round(p1)));
    const elementSymbols = [
      '', 'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne',
      'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca'
    ];
    const symb = elementSymbols[atomicNum] || 'X';

    // Shell distribution
    const kElectrons = Math.min(2, atomicNum);
    const lElectrons = Math.min(8, Math.max(0, atomicNum - 2));
    const mElectrons = Math.min(8, Math.max(0, atomicNum - 10));
    const nElectrons = Math.max(0, atomicNum - 18);

    return (
      <svg viewBox="0 0 540 220" className="w-full h-56 select-none">
        {/* Central Bohr Atom Shells */}
        <g transform="translate(200, 110)">
          {/* Nucleus */}
          <circle cx="0" cy="0" r="16" fill="#DC2626" stroke="#FCA5A5" strokeWidth="2" />
          <text x="0" y="4" fill="#FFFFFF" fontSize="10" fontWeight="black" textAnchor="middle">
            {symb} ({atomicNum}p)
          </text>

          {/* K Shell (r=35) */}
          <circle cx="0" cy="0" r="35" fill="none" stroke="#38BDF8" strokeWidth="1.2" strokeDasharray="3 3" />
          <text x="0" y="-38" fill="#38BDF8" fontSize="8">K</text>
          {Array.from({ length: kElectrons }).map((_, i) => (
            <circle
              key={`k-${i}`}
              cx={Math.cos((i * Math.PI * 2) / 2) * 35}
              cy={Math.sin((i * Math.PI * 2) / 2) * 35}
              r="4"
              fill="#22D3EE"
            />
          ))}

          {/* L Shell (r=55) */}
          {lElectrons > 0 && (
            <>
              <circle cx="0" cy="0" r="55" fill="none" stroke="#10B981" strokeWidth="1.2" strokeDasharray="3 3" />
              <text x="0" y="-58" fill="#10B981" fontSize="8">L</text>
              {Array.from({ length: lElectrons }).map((_, i) => (
                <circle
                  key={`l-${i}`}
                  cx={Math.cos((i * Math.PI * 2) / lElectrons) * 55}
                  cy={Math.sin((i * Math.PI * 2) / lElectrons) * 55}
                  r="3.5"
                  fill="#34D399"
                />
              ))}
            </>
          )}

          {/* M Shell (r=75) */}
          {mElectrons > 0 && (
            <>
              <circle cx="0" cy="0" r="75" fill="none" stroke="#F59E0B" strokeWidth="1.2" strokeDasharray="3 3" />
              <text x="0" y="-78" fill="#F59E0B" fontSize="8">M</text>
              {Array.from({ length: mElectrons }).map((_, i) => (
                <circle
                  key={`m-${i}`}
                  cx={Math.cos((i * Math.PI * 2) / mElectrons) * 75}
                  cy={Math.sin((i * Math.PI * 2) / mElectrons) * 75}
                  r="3.5"
                  fill="#FBBF24"
                />
              ))}
            </>
          )}

          {/* N Shell (r=92) */}
          {nElectrons > 0 && (
            <>
              <circle cx="0" cy="0" r="92" fill="none" stroke="#A855F7" strokeWidth="1.2" strokeDasharray="3 3" />
              <circle cx="0" cy="92" r="3.5" fill="#C084FC" />
              {nElectrons > 1 && <circle cx="0" cy="-92" r="3.5" fill="#C084FC" />}
            </>
          )}
        </g>

        {/* Configuration Data Panel on Right */}
        <g transform="translate(340, 45)">
          <rect x="0" y="0" width="170" height="130" rx="10" fill="#091122" stroke="#38BDF8" strokeWidth="1.5" />
          <text x="15" y="24" fill="#38BDF8" fontSize="12" fontWeight="bold">तत्व: {symb} (Z = {atomicNum})</text>
          <text x="15" y="46" fill="#F8FAFC" fontSize="10">इलेक्ट्रॉनिक विन्यास:</text>
          <text x="15" y="68" fill="#FDE047" fontSize="15" fontWeight="black">
            {kElectrons} {lElectrons > 0 ? `, ${lElectrons}` : ''} {mElectrons > 0 ? `, ${mElectrons}` : ''} {nElectrons > 0 ? `, ${nElectrons}` : ''}
          </text>
          <text x="15" y="92" fill="#34D399" fontSize="10">कोश नियम: 2n² (K=2, L=8, M=18)</text>
          <text x="15" y="112" fill="#CBD5E1" fontSize="9">संयोजी इलेक्ट्रॉन: {nElectrons > 0 ? nElectrons : mElectrons > 0 ? mElectrons : lElectrons > 0 ? lElectrons : kElectrons}</text>
        </g>
      </svg>
    );
  }

  // =========================================================================
  // 13. ACID-BASE TITRATION (CHEMISTRY #13)
  // =========================================================================
  if (labId === 'acid-base-titration') {
    const vBaseUsed = p1; // mL of base added
    const isNeutralized = vBaseUsed >= 20;

    return (
      <svg viewBox="0 0 540 220" className="w-full h-56 select-none">
        {/* Burette Setup */}
        <g transform="translate(120, 20)">
          <line x1="10" y1="5" x2="10" y2="175" stroke="#64748B" strokeWidth="5" />
          <line x1="-15" y1="175" x2="35" y2="175" stroke="#64748B" strokeWidth="6" />
          {/* Glass tube */}
          <rect x="35" y="5" width="14" height="110" fill="rgba(255,255,255,0.08)" stroke="#94A3B8" strokeWidth="1.5" rx="2" />
          <rect x="37" y={Math.min(95, 20 + vBaseUsed * 3)} width="10" height={Math.max(5, 95 - vBaseUsed * 3)} fill="#38BDF8" opacity="0.8" />
          {/* Falling drop */}
          <circle cx="42" cy="138" r="2.5" fill="#38BDF8" className="animate-bounce" />
          <text x="42" y="-2" fill="#38BDF8" fontSize="9" fontWeight="bold" textAnchor="middle">ब्यूरेट (0.1M NaOH)</text>
        </g>

        {/* Titration Flask with Phenolphthalein Indicator */}
        <g transform="translate(190, 45)">
          <path
            d="M 40 10 L 40 40 L 5 125 Q 0 135 15 135 L 85 135 Q 100 135 95 125 L 60 40 L 60 10 Z"
            fill="none"
            stroke="#CBD5E1"
            strokeWidth="2.5"
          />
          {/* Liquid Color: colorless if acid, turns pink at endpoint */}
          <path
            d="M 20 105 Q 50 100 80 105 L 87 132 Q 95 135 80 135 L 20 135 Q 5 135 13 132 Z"
            fill={isNeutralized ? '#F43F5E' : 'rgba(255,255,255,0.2)'}
            opacity={isNeutralized ? 0.75 : 0.4}
          />
          <text x="50" y="152" fill={isNeutralized ? '#FB7185' : '#94A3B8'} fontSize="10" fontWeight="bold" textAnchor="middle">
            {isNeutralized ? 'अंत बिंदु: गुलाबी रंग' : 'अम्लीय माध्यम: रंगहीन'}
          </text>
        </g>

        {/* Observation Meter on Right */}
        <g transform="translate(320, 40)">
          <rect x="0" y="0" width="190" height="120" rx="10" fill="#091122" stroke={isNeutralized ? '#F43F5E' : '#38BDF8'} strokeWidth="1.5" />
          <text x="15" y="24" fill="#38BDF8" fontSize="10" fontWeight="bold">NaOH प्रयुक्त आयतन:</text>
          <text x="15" y="48" fill="#FBBF24" fontSize="16" fontWeight="black">{vBaseUsed} mL</text>
          <text x="15" y="70" fill="#E2E8F0" fontSize="10">
            {isNeutralized ? '✓ उदासीनीकरण पूर्ण (Neutralized)' : '⏳ अनुमापन प्रगति पर है...'}
          </text>
          <text x="15" y="92" fill="#34D399" fontSize="9">सूत्र: M₁V₁ (अम्ल) = M₂V₂ (क्षार)</text>
        </g>
      </svg>
    );
  }

  // =========================================================================
  // 14. GAS LAWS (BOYLE & CHARLES) (CHEMISTRY #14)
  // =========================================================================
  if (labId === 'ideal-gas-laws') {
    const pressureAtm = p1; // 1 to 10 atm
    const tempK = p2; // 200 to 600 K
    const pistonY = Math.min(125, Math.max(45, 135 - (tempK / 600) * 75 + (pressureAtm / 10) * 45));

    return (
      <svg viewBox="0 0 540 220" className="w-full h-56 select-none">
        {/* Gas Cylinder */}
        <g transform="translate(190, 20)">
          <rect x="0" y="10" width="160" height="150" rx="4" fill="none" stroke="#94A3B8" strokeWidth="3" />
          <rect x="-10" y="160" width="180" height="12" fill="#334155" rx="3" />

          {/* Movable Piston */}
          <rect x="2" y={pistonY} width="156" height="18" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" rx="2" />
          <rect x="73" y={Math.max(0, pistonY - 40)} width="14" height={40} fill="#64748B" />
          <rect x="50" y={Math.max(-10, pistonY - 50)} width="60" height="12" fill="#DC2626" rx="3" />
          <text x="80" y={Math.max(-1, pistonY - 41)} fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle">
            दाब {pressureAtm} atm
          </text>

          {/* Gas chamber with bouncing molecules */}
          <rect x="2" y={pistonY + 18} width="156" height={142 - pistonY} fill="rgba(6, 182, 212, 0.12)" />

          {[
            { cx: 30, cy: pistonY + 30 }, { cx: 70, cy: pistonY + 45 }, { cx: 120, cy: pistonY + 35 },
            { cx: 50, cy: pistonY + 70 }, { cx: 90, cy: pistonY + 65 }, { cx: 135, cy: pistonY + 75 },
            { cx: 25, cy: pistonY + 95 }, { cx: 65, cy: pistonY + 105 }, { cx: 115, cy: pistonY + 100 }
          ].map((m, idx) => (
            <circle key={idx} cx={m.cx} cy={Math.min(150, m.cy)} r="3.5" fill="#38BDF8" className="animate-pulse" />
          ))}
        </g>

        {/* Pressure Gauge Dial on Left */}
        <g transform="translate(60, 45)">
          <circle cx="50" cy="50" r="42" fill="#091122" stroke="#F59E0B" strokeWidth="3" />
          <text x="50" y="38" fill="#F59E0B" fontSize="9" fontWeight="bold" textAnchor="middle">दाब P</text>
          <text x="50" y="60" fill="#FDE047" fontSize="14" fontWeight="black" textAnchor="middle">{pressureAtm} atm</text>
        </g>

        {/* Temperature Gauge on Right */}
        <g transform="translate(410, 45)">
          <circle cx="50" cy="50" r="42" fill="#091122" stroke="#EF4444" strokeWidth="3" />
          <text x="50" y="38" fill="#EF4444" fontSize="9" fontWeight="bold" textAnchor="middle">तापमान T</text>
          <text x="50" y="60" fill="#FCA5A5" fontSize="14" fontWeight="black" textAnchor="middle">{tempK} K</text>
          <text x="50" y="76" fill="#94A3B8" fontSize="8" textAnchor="middle">({(tempK - 273).toFixed(0)} °C)</text>
        </g>

        <rect x="30" y="185" width="480" height="26" rx="6" fill="#091122" stroke="#334155" strokeWidth="1" />
        <text x="270" y="202" fill="#E2E8F0" fontSize="10" fontWeight="bold" textAnchor="middle">
          आदर्श गैस समीकरण: P × V = n × R × T (दाब बढ़ने पर आयतन घटता है)
        </text>
      </svg>
    );
  }

  // =========================================================================
  // 15. ELECTROLYSIS OF WATER (CHEMISTRY #15)
  // =========================================================================
  if (labId === 'electrolysis-cell') {
    return (
      <svg viewBox="0 0 540 220" className="w-full h-56 select-none">
        {/* Glass Water Tank */}
        <rect x="140" y="45" width="260" height="135" rx="8" fill="rgba(14, 165, 233, 0.15)" stroke="#38BDF8" strokeWidth="2.5" />
        <rect x="142" y="70" width="256" height="108" fill="#0284C7" opacity="0.25" />
        <text x="270" y="40" fill="#7DD3FC" fontSize="10" fontWeight="bold" textAnchor="middle">जल का विद्युत अपघटन (2H₂O → 2H₂ + O₂)</text>

        {/* Cathode Test Tube (Hydrogen 2 Volumes on Left) */}
        <g transform="translate(195, 25)">
          <rect x="0" y="0" width="30" height="120" rx="4" fill="none" stroke="#E2E8F0" strokeWidth="2" />
          <rect x="2" y="2" width="26" height="50" fill="#F43F5E" opacity="0.3" rx="2" />
          <circle cx="10" cy="70" r="2.5" fill="#FFF" className="animate-bounce" />
          <circle cx="18" cy="85" r="2" fill="#FFF" className="animate-bounce" />
          <circle cx="22" cy="100" r="3" fill="#FFF" className="animate-bounce" />
          <rect x="12" y="90" width="6" height="55" fill="#475569" />
          <text x="15" y="-6" fill="#F43F5E" fontSize="9" fontWeight="black" textAnchor="middle">H₂ (कैथोड - 2V)</text>
        </g>

        {/* Anode Test Tube (Oxygen 1 Volume on Right) */}
        <g transform="translate(315, 25)">
          <rect x="0" y="0" width="30" height="120" rx="4" fill="none" stroke="#E2E8F0" strokeWidth="2" />
          <rect x="2" y="2" width="26" height="25" fill="#38BDF8" opacity="0.3" rx="2" />
          <circle cx="15" cy="80" r="2" fill="#FFF" className="animate-bounce" />
          <circle cx="20" cy="95" r="2.5" fill="#FFF" className="animate-bounce" />
          <rect x="12" y="90" width="6" height="55" fill="#475569" />
          <text x="15" y="-6" fill="#38BDF8" fontSize="9" fontWeight="black" textAnchor="middle">O₂ (एनोड - 1V)</text>
        </g>

        {/* DC Battery Connected at Bottom */}
        <g transform="translate(225, 185)">
          <rect x="0" y="0" width="90" height="25" rx="4" fill="#091122" stroke="#F59E0B" strokeWidth="1.5" />
          <text x="45" y="16" fill="#FBBF24" fontSize="10" fontWeight="bold" textAnchor="middle">12V DC बैटरी</text>
          <line x1="-18" y1="-15" x2="0" y2="12" stroke="#F43F5E" strokeWidth="2" />
          <line x1="108" y1="-15" x2="90" y2="12" stroke="#38BDF8" strokeWidth="2" />
        </g>
      </svg>
    );
  }

  // =========================================================================
  // 16. EXOTHERMIC & ENDOTHERMIC REACTIONS (CHEMISTRY #16)
  // =========================================================================
  if (labId === 'thermo-reactions') {
    const tempChange = p1; // e.g. -15 to +40 deg C
    const isExo = tempChange >= 0;

    return (
      <svg viewBox="0 0 540 220" className="w-full h-56 select-none">
        {/* Reaction Beaker in Center */}
        <g transform="translate(190, 35)">
          <path d="M 10 10 L 10 120 Q 10 135 25 135 L 115 135 Q 130 135 130 120 L 130 10" fill="none" stroke="#CBD5E1" strokeWidth="3" />
          {/* Reaction Liquid */}
          <rect x="13" y="55" width="114" height="78" rx="2" fill={isExo ? '#EA580C' : '#0284C7'} opacity="0.65" />
          {/* Bubbling / Steam */}
          {isExo ? (
            <>
              <circle cx="45" cy="80" r="3" fill="#FBBF24" className="animate-ping" />
              <circle cx="85" cy="70" r="4" fill="#FBBF24" className="animate-ping" />
              <text x="70" y="40" fill="#F97316" fontSize="10" fontWeight="black" textAnchor="middle">🔥 ऊष्मा मुक्त (Exothermic)</text>
            </>
          ) : (
            <>
              <text x="70" y="40" fill="#38BDF8" fontSize="10" fontWeight="black" textAnchor="middle">❄️ ऊष्मा अवशोषित (Endothermic)</text>
            </>
          )}

          {/* Thermometer inserted into Beaker */}
          <rect x="65" y="-15" width="10" height="110" rx="4" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1" />
          <rect x="67" y={isExo ? 15 : 45} width="6" height={isExo ? 75 : 45} rx="2" fill="#EF4444" />
          <circle cx="70" cy="92" r="7" fill="#EF4444" />
        </g>

        {/* Readout Panels */}
        <g transform="translate(360, 45)">
          <rect x="0" y="0" width="150" height="100" rx="8" fill="#091122" stroke={isExo ? '#F97316' : '#38BDF8'} strokeWidth="1.5" />
          <text x="12" y="24" fill={isExo ? '#F97316' : '#38BDF8'} fontSize="10" fontWeight="bold">
            {isExo ? 'ऊष्माक्षेपी अभिक्रिया' : 'ऊष्माशोषी अभिक्रिया'}
          </text>
          <text x="12" y="52" fill="#FFFFFF" fontSize="18" fontWeight="black">
            ΔT = {tempChange > 0 ? `+${tempChange}` : tempChange} °C
          </text>
          <text x="12" y="74" fill={isExo ? '#FCA5A5' : '#BAE6FD'} fontSize="9">
            {isExo ? 'ΔH < 0 (CaO + H₂O)' : 'ΔH > 0 (NH₄Cl + H₂O)'}
          </text>
        </g>
      </svg>
    );
  }

  // =========================================================================
  // 17. ORGANIC HYDROCARBONS & BENZENE (CHEMISTRY #17)
  // =========================================================================
  if (labId === 'organic-hydrocarbons') {
    return (
      <svg viewBox="0 0 540 220" className="w-full h-56 select-none">
        {/* Left: Methane CH4 Tetrahedron */}
        <g transform="translate(100, 105)">
          <circle cx="0" cy="0" r="14" fill="#0F172A" stroke="#38BDF8" strokeWidth="2.5" />
          <text x="0" y="4" fill="#38BDF8" fontSize="10" fontWeight="black" textAnchor="middle">C</text>

          {/* 4 H atoms at 109.5 deg */}
          {[
            { x: 0, y: -45 }, { x: 40, y: 25 }, { x: -40, y: 25 }, { x: 0, y: 40 }
          ].map((h, i) => (
            <g key={i}>
              <line x1="0" y1="0" x2={h.x} y2={h.y} stroke="#94A3B8" strokeWidth="2" />
              <circle cx={h.x} cy={h.y} r="8" fill="#E2E8F0" />
              <text x={h.x} y={h.y + 3} fill="#0F172A" fontSize="8" fontWeight="bold" textAnchor="middle">H</text>
            </g>
          ))}
          <text x="0" y="65" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">मीथेन (CH₄, sp³ 109.5°)</text>
        </g>

        {/* Right: Benzene Ring C6H6 */}
        <g transform="translate(360, 105)">
          {/* Hexagon alternating double bonds */}
          <polygon points="0,-48 42,-24 42,24 0,48 -42,24 -42,-24" fill="none" stroke="#F59E0B" strokeWidth="3" />
          {/* Inner Resonance Circle */}
          <circle cx="0" cy="0" r="26" fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="5 3" />
          <text x="0" y="4" fill="#FBBF24" fontSize="11" fontWeight="black" textAnchor="middle">C₆H₆</text>
          <text x="0" y="68" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">बेंजीन वलय (sp², एरोमैटिक 6π)</text>
        </g>
      </svg>
    );
  }

  // =========================================================================
  // 18. MOLARITY & CONCENTRATION (CHEMISTRY #18)
  // =========================================================================
  if (labId === 'molarity-solution') {
    const moles = p1; // e.g. 0.1 to 2.0 mol
    const volL = p2; // e.g. 0.25 to 2.0 L
    const molarity = moles / volL;
    const colorOpacity = Math.min(0.9, Math.max(0.15, molarity / 2.0));

    return (
      <svg viewBox="0 0 540 220" className="w-full h-56 select-none">
        {/* Volumetric Flask in Center */}
        <g transform="translate(190, 25)">
          <path
            d="M 45 5 L 45 60 L 5 130 Q 0 145 20 145 L 80 145 Q 100 145 95 130 L 55 60 L 55 5 Z"
            fill="none"
            stroke="#CBD5E1"
            strokeWidth="3"
          />
          {/* Graduation Line */}
          <line x1="42" y1="35" x2="58" y2="35" stroke="#EF4444" strokeWidth="2" />
          <text x="75" y="38" fill="#FCA5A5" fontSize="8">निशान (Mark)</text>

          {/* Solution Body with Color Depth */}
          <path
            d="M 22 105 Q 50 100 78 105 L 88 142 L 12 142 Z"
            fill="#0284C7"
            opacity={colorOpacity}
          />
          <text x="50" y="125" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">विलयन</text>
        </g>

        {/* Readout Panels */}
        <g transform="translate(320, 50)">
          <rect x="0" y="0" width="180" height="95" rx="8" fill="#091122" stroke="#0284C7" strokeWidth="1.5" />
          <text x="14" y="22" fill="#38BDF8" fontSize="10" fontWeight="bold">मोलरता M = मोल / लीटर:</text>
          <text x="14" y="50" fill="#FDE047" fontSize="18" fontWeight="black">{molarity.toFixed(2)} M (mol/L)</text>
          <text x="14" y="72" fill="#A7F3D0" fontSize="9">विलेय मोल: {moles} mol | आयतन: {volL} L</text>
        </g>
      </svg>
    );
  }

  // =========================================================================
  // 19. RADIOACTIVITY & HALF-LIFE (CHEMISTRY #19)
  // =========================================================================
  if (labId === 'radioactivity-halflife') {
    const halfLifeYears = p1; // e.g. 5 to 50
    const timeElapsed = p2; // e.g. 10 to 100
    const remainingFraction = Math.pow(0.5, timeElapsed / halfLifeYears);

    return (
      <svg viewBox="0 0 540 220" className="w-full h-56 select-none">
        {/* Geiger-Müller Counter Tube on Left */}
        <g transform="translate(80, 55)">
          <rect x="0" y="15" width="110" height="40" rx="6" fill="#1E293B" stroke="#94A3B8" strokeWidth="2" />
          <circle cx="100" cy="35" r="10" fill="#DC2626" className="animate-pulse" />
          <text x="55" y="40" fill="#F8FAFC" fontSize="9" fontWeight="bold" textAnchor="middle">GM डिटेक्टर</text>
          {/* Emitted particles rays */}
          <line x1="110" y1="35" x2="160" y2="20" stroke="#FBBF24" strokeWidth="2" strokeDasharray="3 3" />
          <line x1="110" y1="35" x2="160" y2="35" stroke="#34D399" strokeWidth="2" strokeDasharray="3 3" />
          <line x1="110" y1="35" x2="160" y2="50" stroke="#F43F5E" strokeWidth="2" strokeDasharray="3 3" />
        </g>

        {/* Radioactive Source in Lead Shield */}
        <g transform="translate(200, 55)">
          <rect x="0" y="5" width="55" height="60" rx="6" fill="#0F172A" stroke="#EF4444" strokeWidth="2" />
          <circle cx="27" cy="35" r="12" fill="#F59E0B" className="animate-ping" />
          <text x="27" y="39" fill="#000" fontSize="8" fontWeight="bold" textAnchor="middle">☢</text>
          <text x="27" y="80" fill="#FCA5A5" fontSize="8" textAnchor="middle">स्रोत</text>
        </g>

        {/* Decay Curve and Percent Readout */}
        <g transform="translate(290, 45)">
          <rect x="0" y="0" width="220" height="110" rx="8" fill="#091122" stroke="#EF4444" strokeWidth="1.5" />
          <text x="14" y="24" fill="#FCA5A5" fontSize="10" fontWeight="bold">रेडियोएक्टिव क्षय (N = N₀ e⁻ᵞᵗ):</text>
          <text x="14" y="52" fill="#FDE047" fontSize="18" fontWeight="black">
            शेष नाभिक: {(remainingFraction * 100).toFixed(1)}%
          </text>
          <text x="14" y="74" fill="#CBD5E1" fontSize="9">अर्ध-आयु T½ = {halfLifeYears} वर्ष | व्यतीत समय = {timeElapsed} वर्ष</text>
          <text x="14" y="94" fill="#34D399" fontSize="9">विघटित प्रतिशत = {((1 - remainingFraction) * 100).toFixed(1)}%</text>
        </g>
      </svg>
    );
  }

  // =========================================================================
  // 20. PHOTOSYNTHESIS RATE (BIOLOGY #20)
  // =========================================================================
  if (labId === 'photosynthesis-rate') {
    return (
      <svg viewBox="0 0 540 220" className="w-full h-56 select-none">
        {/* Beaker with Water */}
        <g transform="translate(180, 25)">
          <rect x="0" y="10" width="160" height="145" rx="6" fill="rgba(14, 165, 233, 0.12)" stroke="#38BDF8" strokeWidth="2.5" />
          <rect x="2" y="30" width="156" height="123" fill="#0284C7" opacity="0.2" />

          {/* Inverted Glass Funnel */}
          <polygon points="80,40 15,140 145,140" fill="none" stroke="#E2E8F0" strokeWidth="2" />
          <line x1="80" y1="40" x2="80" y2="10" stroke="#E2E8F0" strokeWidth="3" />

          {/* Inverted Test Tube collecting Oxygen */}
          <rect x="70" y="0" width="20" height="50" rx="3" fill="none" stroke="#E2E8F0" strokeWidth="2" />
          <rect x="72" y="2" width="16" height="18" fill="#FBBF24" opacity="0.4" />
          <text x="80" y="-4" fill="#FDE047" fontSize="8" fontWeight="bold" textAnchor="middle">O₂ गैस</text>

          {/* Hydrilla Green Plant inside Funnel */}
          <path d="M 80 140 Q 60 110 50 125 Q 70 95 80 135" stroke="#22C55E" strokeWidth="3" fill="none" />
          <path d="M 80 140 Q 100 110 110 125 Q 90 95 80 135" stroke="#22C55E" strokeWidth="3" fill="none" />

          {/* Rising Oxygen Bubbles */}
          <circle cx="80" cy="55" r="2.5" fill="#FFF" className="animate-bounce" />
          <circle cx="78" cy="75" r="3" fill="#FFF" className="animate-bounce" />
          <circle cx="82" cy="95" r="2" fill="#FFF" className="animate-bounce" />
        </g>

        {/* Sunlight Lamp on Left */}
        <g transform="translate(50, 70)">
          <circle cx="30" cy="30" r="22" fill="#F59E0B" stroke="#FDE047" strokeWidth="3" className="animate-pulse" />
          <text x="30" y="34" fill="#000" fontSize="14" textAnchor="middle">☀️</text>
          <text x="30" y="70" fill="#FBBF24" fontSize="10" fontWeight="bold" textAnchor="middle">प्रकाश लैंप</text>
        </g>

        <g transform="translate(365, 55)">
          <rect x="0" y="0" width="150" height="85" rx="8" fill="#091122" stroke="#10B981" strokeWidth="1.5" />
          <text x="14" y="22" fill="#34D399" fontSize="10" fontWeight="bold">प्रकाश संश्लेषण दर:</text>
          <text x="14" y="44" fill="#FDE047" fontSize="14" fontWeight="black">ऑक्सीजन (O₂) उत्सर्जन</text>
          <text x="14" y="66" fill="#CBD5E1" fontSize="9">6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂</text>
        </g>
      </svg>
    );
  }

  // =========================================================================
  // 21. HUMAN HEART, ECG & BLOOD PRESSURE (BIOLOGY #21)
  // =========================================================================
  if (labId === 'heart-ecg-bp') {
    return (
      <svg viewBox="0 0 540 220" className="w-full h-56 select-none">
        {/* ECG Monitor Screen Background */}
        <rect x="30" y="20" width="480" height="175" rx="14" fill="#020817" stroke="#1E293B" strokeWidth="2" />

        {/* ECG Grid Lines */}
        {[0, 1, 2, 3, 4, 5, 6].map(i => (
          <line key={i} x1="30" y1={30 + i * 25} x2="510" y2={30 + i * 25} stroke="#0F172A" strokeWidth="1" strokeDasharray="2 2" />
        ))}

        {/* Pulsating Heart Graphic on Left */}
        <g transform="translate(90, 80)">
          <path
            d="M 0 10 C -25 -25 -50 0 0 45 C 50 0 25 -25 0 10"
            fill="#EF4444"
            stroke="#FCA5A5"
            strokeWidth="2.5"
            className="animate-pulse"
          />
          <text x="0" y="70" fill="#FCA5A5" fontSize="10" fontWeight="bold" textAnchor="middle">हृदय स्पंदन (72 BPM)</text>
        </g>

        {/* Continuous Dynamic ECG Wave Trace (P-QRS-T) */}
        <g transform="translate(160, 95)">
          <path
            d="M 0 0 L 25 0 Q 35 -12 45 0 L 60 0 L 65 6 L 75 -45 L 85 18 L 90 0 L 115 0 Q 130 -18 145 0 L 180 0 L 195 0 Q 205 -12 215 0 L 230 0 L 235 6 L 245 -45 L 255 18 L 260 0 L 285 0 Q 300 -18 315 0 L 330 0"
            fill="none"
            stroke="#10B981"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* P-QRS-T Labels */}
          <text x="35" y="-18" fill="#34D399" fontSize="8" fontWeight="bold">P</text>
          <text x="75" y="-50" fill="#FBBF24" fontSize="10" fontWeight="extrabold">QRS</text>
          <text x="130" y="-24" fill="#34D399" fontSize="8" fontWeight="bold">T</text>
        </g>

        {/* BP & Heart Stats Panel */}
        <g transform="translate(370, 35)">
          <rect x="0" y="0" width="125" height="55" rx="6" fill="#091122" stroke="#EF4444" strokeWidth="1.5" />
          <text x="12" y="18" fill="#FCA5A5" fontSize="9" fontWeight="bold">रक्तदाब (BP):</text>
          <text x="12" y="38" fill="#FFFFFF" fontSize="14" fontWeight="black">120 / 80 mmHg</text>
        </g>
      </svg>
    );
  }

  // =========================================================================
  // 22. BLOOD GROUP ABO & Rh TYPING (BIOLOGY #22)
  // =========================================================================
  if (labId === 'blood-group-typing') {
    const selectedGroup = p1 <= 1 ? 'A+' : p1 <= 2 ? 'B+' : p1 <= 3 ? 'AB+' : 'O+';
    const isClumpA = selectedGroup.includes('A');
    const isClumpB = selectedGroup.includes('B');

    return (
      <svg viewBox="0 0 540 220" className="w-full h-56 select-none">
        {/* Porcelain White Testing Slide */}
        <rect x="60" y="35" width="420" height="130" rx="14" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="3" />

        {/* Well 1: Anti-A (Blue) */}
        <g transform="translate(130, 95)">
          <circle cx="0" cy="0" r="32" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2" />
          {/* Blood drop / agglutination */}
          <circle cx="0" cy="0" r="18" fill="#DC2626" opacity="0.85" />
          {isClumpA && (
            <text x="0" y="4" fill="#FFF" fontSize="8" fontWeight="bold" textAnchor="middle">थक्का (Clump)</text>
          )}
          <text x="0" y="48" fill="#0284C7" fontSize="10" fontWeight="bold" textAnchor="middle">Anti-A (नीला)</text>
        </g>

        {/* Well 2: Anti-B (Yellow) */}
        <g transform="translate(270, 95)">
          <circle cx="0" cy="0" r="32" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
          <circle cx="0" cy="0" r="18" fill="#DC2626" opacity="0.85" />
          {isClumpB && (
            <text x="0" y="4" fill="#FFF" fontSize="8" fontWeight="bold" textAnchor="middle">थक्का (Clump)</text>
          )}
          <text x="0" y="48" fill="#D97706" fontSize="10" fontWeight="bold" textAnchor="middle">Anti-B (पीला)</text>
        </g>

        {/* Well 3: Anti-D / Rh (Colorless) */}
        <g transform="translate(410, 95)">
          <circle cx="0" cy="0" r="32" fill="#F1F5F9" stroke="#64748B" strokeWidth="2" />
          <circle cx="0" cy="0" r="18" fill="#DC2626" opacity="0.85" />
          <text x="0" y="4" fill="#FFF" fontSize="8" fontWeight="bold" textAnchor="middle">थक्का (Rh+)</text>
          <text x="0" y="48" fill="#475569" fontSize="10" fontWeight="bold" textAnchor="middle">Anti-D (Rh)</text>
        </g>

        <rect x="30" y="180" width="480" height="30" rx="8" fill="#091122" stroke="#334155" strokeWidth="1" />
        <text x="270" y="200" fill="#FDE047" fontSize="11" fontWeight="extrabold" textAnchor="middle">
          परीक्षित रक्त समूह: {selectedGroup} (O- सर्वदाता, AB+ सर्वग्राही)
        </text>
      </svg>
    );
  }

  // =========================================================================
  // 23. MENDEL'S GENETICS & PUNNETT SQUARE (BIOLOGY #23)
  // =========================================================================
  if (labId === 'mendel-genetics') {
    return (
      <svg viewBox="0 0 540 220" className="w-full h-56 select-none">
        {/* Punnett Square 2x2 Grid */}
        <g transform="translate(140, 30)">
          <rect x="0" y="0" width="160" height="130" fill="#091122" stroke="#38BDF8" strokeWidth="2" rx="6" />
          <line x1="80" y1="0" x2="80" y2="130" stroke="#38BDF8" strokeWidth="2" />
          <line x1="0" y1="65" x2="160" y2="65" stroke="#38BDF8" strokeWidth="2" />

          {/* Gametes Header */}
          <text x="40" y="-8" fill="#FBBF24" fontSize="12" fontWeight="black" textAnchor="middle">T</text>
          <text x="120" y="-8" fill="#FBBF24" fontSize="12" fontWeight="black" textAnchor="middle">t</text>
          <text x="-12" y="38" fill="#FBBF24" fontSize="12" fontWeight="black" textAnchor="middle">T</text>
          <text x="-12" y="102" fill="#FBBF24" fontSize="12" fontWeight="black" textAnchor="middle">t</text>

          {/* 4 Cells */}
          <g transform="translate(40, 38)">
            <text x="0" y="0" fill="#22C55E" fontSize="14" fontWeight="black" textAnchor="middle">TT</text>
            <text x="0" y="14" fill="#94A3B8" fontSize="8" textAnchor="middle">(शुद्ध लंबा)</text>
          </g>
          <g transform="translate(120, 38)">
            <text x="0" y="0" fill="#22C55E" fontSize="14" fontWeight="black" textAnchor="middle">Tt</text>
            <text x="0" y="14" fill="#94A3B8" fontSize="8" textAnchor="middle">(संकर लंबा)</text>
          </g>
          <g transform="translate(40, 102)">
            <text x="0" y="0" fill="#22C55E" fontSize="14" fontWeight="black" textAnchor="middle">Tt</text>
            <text x="0" y="14" fill="#94A3B8" fontSize="8" textAnchor="middle">(संकर लंबा)</text>
          </g>
          <g transform="translate(120, 102)">
            <text x="0" y="0" fill="#EF4444" fontSize="14" fontWeight="black" textAnchor="middle">tt</text>
            <text x="0" y="14" fill="#94A3B8" fontSize="8" textAnchor="middle">(बौना)</text>
          </g>
        </g>

        {/* Ratio Stats Panel on Right */}
        <g transform="translate(340, 35)">
          <rect x="0" y="0" width="160" height="120" rx="8" fill="#091122" stroke="#22C55E" strokeWidth="1.5" />
          <text x="14" y="24" fill="#34D399" fontSize="10" fontWeight="bold">मेंडल F2 पीढ़ी अनुपात:</text>
          <text x="14" y="50" fill="#FFFFFF" fontSize="12" fontWeight="black">फीनोटाइप: 3 लंबा : 1 बौना</text>
          <text x="14" y="74" fill="#FDE047" fontSize="12" fontWeight="bold">जीनोटाइप: 1 TT : 2 Tt : 1 tt</text>
          <text x="14" y="98" fill="#CBD5E1" fontSize="9">प्रभाविता व पृथक्करण नियम</text>
        </g>
      </svg>
    );
  }

  // =========================================================================
  // 24. COMPOUND MICROSCOPE & CYTOLOGY (BIOLOGY #24)
  // =========================================================================
  if (labId === 'microscope-cell') {
    const objMag = p1; // 10 to 100x
    const eyeMag = p2; // 5 to 20x
    const totalMag = objMag * eyeMag;

    return (
      <svg viewBox="0 0 540 220" className="w-full h-56 select-none">
        {/* Microscope Body on Left */}
        <g transform="translate(80, 20)">
          {/* Eyepiece */}
          <rect x="35" y="0" width="16" height="25" fill="#64748B" rx="2" />
          <rect x="30" y="25" width="26" height="65" fill="#334155" rx="3" />
          {/* Objective */}
          <polygon points="35,90 51,90 47,110 39,110" fill="#F59E0B" />
          {/* Stage */}
          <rect x="15" y="112" width="75" height="8" fill="#1E293B" rx="1" />
          {/* Glass Slide on Stage */}
          <rect x="30" y="108" width="45" height="4" fill="#38BDF8" opacity="0.8" />
          {/* Arm and Base */}
          <path d="M 56 45 Q 85 80 75 145 L 10 145 L 95 145" stroke="#475569" strokeWidth="6" fill="none" />
          <text x="43" y="165" fill="#94A3B8" fontSize="9" fontWeight="bold" textAnchor="middle">सूक्ष्मदर्शी</text>
        </g>

        {/* Circular Magnified Field of View on Right */}
        <g transform="translate(320, 105)">
          <circle cx="0" cy="0" r="65" fill="#020817" stroke="#38BDF8" strokeWidth="3" />

          {/* Plant Cells (Onion Peel Pattern) */}
          {[-40, 0, 40].map((y, i) => (
            <g key={i}>
              <rect x="-50" y={y - 15} width="45" height="28" fill="rgba(34, 197, 94, 0.15)" stroke="#22C55E" strokeWidth="1.5" />
              <circle cx="-25" cy={y - 1} r="3" fill="#EF4444" />
              <rect x="0" y={y - 15} width="45" height="28" fill="rgba(34, 197, 94, 0.15)" stroke="#22C55E" strokeWidth="1.5" />
              <circle cx="22" cy={y - 1} r="3" fill="#EF4444" />
            </g>
          ))}
          <text x="0" y="80" fill="#22D3EE" fontSize="10" fontWeight="bold" textAnchor="middle">
            प्याज की झिल्ली ({totalMag}x आवर्धन)
          </text>
        </g>

        {/* Magnification Stats Box */}
        <g transform="translate(420, 30)">
          <rect x="0" y="0" width="105" height="50" rx="6" fill="#091122" stroke="#10B981" strokeWidth="1" />
          <text x="10" y="18" fill="#10B981" fontSize="8" fontWeight="bold">कुल आवर्धन:</text>
          <text x="10" y="38" fill="#FBBF24" fontSize="14" fontWeight="black">{totalMag}x</text>
        </g>
      </svg>
    );
  }

  // =========================================================================
  // 25. RESPIRATORY SYSTEM & LUNGS (BIOLOGY #25)
  // =========================================================================
  if (labId === 'respiration-lungs') {
    const breathRate = p1; // breaths/min (10 to 40)
    const tv = p2; // Tidal volume (300 to 1200 mL)
    const minuteVol = (breathRate * tv) / 1000;

    return (
      <svg viewBox="0 0 540 220" className="w-full h-56 select-none">
        {/* Trachea & Lungs Diagram */}
        <g transform="translate(180, 25)">
          {/* Trachea Windpipe */}
          <rect x="52" y="10" width="16" height="40" rx="4" fill="#475569" stroke="#94A3B8" strokeWidth="1.5" />
          {/* Bronchi split */}
          <line x1="52" y1="50" x2="25" y2="70" stroke="#475569" strokeWidth="5" />
          <line x1="68" y1="50" x2="95" y2="70" stroke="#475569" strokeWidth="5" />

          {/* Left Lung */}
          <path
            d="M 25 70 Q -15 85 -10 135 Q 20 150 40 130 Z"
            fill="#F43F5E"
            opacity="0.75"
            stroke="#FDA4AF"
            strokeWidth="2"
            className="animate-pulse"
          />
          {/* Right Lung */}
          <path
            d="M 95 70 Q 135 85 130 135 Q 100 150 80 130 Z"
            fill="#F43F5E"
            opacity="0.75"
            stroke="#FDA4AF"
            strokeWidth="2"
            className="animate-pulse"
          />
          <text x="60" y="165" fill="#FDA4AF" fontSize="10" fontWeight="bold" textAnchor="middle">फेफड़े (Lungs & Alveoli)</text>
        </g>

        {/* Spirometry Stats Panel on Right */}
        <g transform="translate(340, 40)">
          <rect x="0" y="0" width="165" height="110" rx="8" fill="#091122" stroke="#38BDF8" strokeWidth="1.5" />
          <text x="14" y="24" fill="#38BDF8" fontSize="10" fontWeight="bold">मिनट श्वसन आयतन (MRV):</text>
          <text x="14" y="52" fill="#FDE047" fontSize="18" fontWeight="black">{minuteVol.toFixed(1)} L/min</text>
          <text x="14" y="74" fill="#CBD5E1" fontSize="9">श्वसन दर = {breathRate} बार/मिनट</text>
          <text x="14" y="94" fill="#34D399" fontSize="9">ज्वारीय आयतन (TV) = {tv} mL</text>
        </g>
      </svg>
    );
  }

  // =========================================================================
  // 26. OSMOSIS & PLASMOLYSIS (BIOLOGY #26)
  // =========================================================================
  if (labId === 'osmosis-cell') {
    const nacl = p1; // % NaCl (0.1 to 3.0)
    const isIso = Math.abs(nacl - 0.9) < 0.2;
    const isHypo = nacl < 0.7;

    return (
      <svg viewBox="0 0 540 220" className="w-full h-56 select-none">
        {/* Beaker with solution */}
        <g transform="translate(110, 30)">
          <rect x="0" y="10" width="150" height="130" rx="6" fill="rgba(14, 165, 233, 0.12)" stroke="#38BDF8" strokeWidth="2.5" />
          <rect x="2" y="40" width="146" height="98" fill="#0284C7" opacity={isHypo ? 0.2 : 0.6} />

          {/* RBC Cell inside */}
          <g transform="translate(75, 90)">
            {isHypo ? (
              // Swollen RBC
              <circle cx="0" cy="0" r="28" fill="#DC2626" stroke="#FCA5A5" strokeWidth="2" className="animate-pulse" />
            ) : isIso ? (
              // Normal Biconcave RBC
              <ellipse cx="0" cy="0" rx="22" ry="16" fill="#DC2626" stroke="#FCA5A5" strokeWidth="2" />
            ) : (
              // Crenated / Plasmolyzed RBC
              <path d="M 0 -15 L 12 -5 L 15 10 L 0 16 L -14 8 L -12 -8 Z" fill="#991B1B" stroke="#DC2626" strokeWidth="1.5" />
            )}
            <text x="0" y="4" fill="#FFF" fontSize="8" fontWeight="bold" textAnchor="middle">RBC</text>
          </g>
          <text x="75" y="160" fill="#BAE6FD" fontSize="9" fontWeight="bold" textAnchor="middle">
            {nacl}% NaCl घोल
          </text>
        </g>

        {/* Status Explanation Box */}
        <g transform="translate(290, 45)">
          <rect x="0" y="0" width="210" height="110" rx="8" fill="#091122" stroke={isIso ? '#10B981' : '#F59E0B'} strokeWidth="1.5" />
          <text x="14" y="24" fill={isIso ? '#34D399' : '#FBBF24'} fontSize="11" fontWeight="bold">
            {isHypo ? 'अल्पपरासारी (Hypotonic):' : isIso ? 'समपरासारी (Isotonic 0.9%):' : 'अतिपरासारी (Hypertonic):'}
          </text>
          <text x="14" y="52" fill="#FFFFFF" fontSize="13" fontWeight="black">
            {isHypo ? 'अंतःपरासरण (RBC फूलेगी)' : isIso ? 'संतुलित प्रवाह (सामान्य आकार)' : 'बहिःपरासरण (जीवद्रव्यकुंचन)'}
          </text>
          <text x="14" y="76" fill="#CBD5E1" fontSize="9">
            {isHypo ? 'जल कोशिका के अंदर प्रवेश करता है' : isIso ? 'अंतःप्रवाह = बहिःप्रवाह' : 'जल कोशिका से बाहर निकल जाता है'}
          </text>
        </g>
      </svg>
    );
  }

  // =========================================================================
  // 27. HUMAN EYE DEFECTS & CORRECTION (BIOLOGY #27)
  // =========================================================================
  if (labId === 'human-eye-defects') {
    const defect = p1; // -5 to +5 D
    const isMyopia = defect < 0;
    const isHyper = defect > 0;
    const focusX = isMyopia ? 310 : isHyper ? 390 : 350; // Retina is at 350

    return (
      <svg viewBox="0 0 540 220" className="w-full h-56 select-none">
        {/* Eyeball Outline */}
        <g transform="translate(280, 105)">
          {/* Eyeball Circle */}
          <circle cx="0" cy="0" r="70" fill="none" stroke="#CBD5E1" strokeWidth="2.5" />
          {/* Cornea bulge on Left */}
          <path d="M -45 -55 Q -75 0 -45 55" fill="none" stroke="#38BDF8" strokeWidth="3" />
          {/* Crystalline Lens */}
          <ellipse cx="-45" cy="0" rx="8" ry="32" fill="rgba(56, 189, 248, 0.3)" stroke="#38BDF8" strokeWidth="2" />
          {/* Retina Wall on Right */}
          <path d="M 50 -50 Q 70 0 50 50" fill="none" stroke="#F43F5E" strokeWidth="4" />
          <text x="65" y="4" fill="#FDA4AF" fontSize="9" fontWeight="bold">रेटिना</text>
        </g>

        {/* Incoming Parallel Rays */}
        <line x1="50" y1="85" x2="235" y2="85" stroke="#FBBF24" strokeWidth="2" />
        <line x1="50" y1="125" x2="235" y2="125" stroke="#FBBF24" strokeWidth="2" />

        {/* Refracted Rays converging at focusX */}
        <line x1="235" y1="85" x2={focusX} y2="105" stroke="#FBBF24" strokeWidth="2" />
        <line x1="235" y1="125" x2={focusX} y2="105" stroke="#FBBF24" strokeWidth="2" />
        <circle cx={focusX} cy="105" r="4" fill="#EF4444" className="animate-ping" />

        {/* Corrective Spectacle Lens in front of eye */}
        {isMyopia && (
          <g transform="translate(180, 75)">
            <path d="M 8 0 Q 0 30 8 60 L 14 60 Q 6 30 14 0 Z" fill="rgba(168, 85, 247, 0.4)" stroke="#A855F7" strokeWidth="2" />
            <text x="11" y="-6" fill="#C084FC" fontSize="8" fontWeight="bold" textAnchor="middle">अवतल लेंस</text>
          </g>
        )}
        {isHyper && (
          <g transform="translate(180, 75)">
            <path d="M 0 0 Q 14 30 0 60 Q -14 30 0 0 Z" fill="rgba(16, 185, 129, 0.4)" stroke="#10B981" strokeWidth="2" />
            <text x="0" y="-6" fill="#34D399" fontSize="8" fontWeight="bold" textAnchor="middle">उत्तल लेंस</text>
          </g>
        )}

        <rect x="30" y="185" width="480" height="26" rx="6" fill="#091122" stroke="#334155" strokeWidth="1" />
        <text x="270" y="202" fill="#E2E8F0" fontSize="10" fontWeight="bold" textAnchor="middle">
          {isMyopia
            ? 'निकट दृष्टि दोष (Myopia): प्रतिबिंब रेटिना से पहले बना → निवारण: अवतल लेंस'
            : isHyper
            ? 'दूर दृष्टि दोष (Hypermetropia): प्रतिबिंब रेटिना के पीछे बना → निवारण: उत्तल लेंस'
            : 'सामान्य दृष्टि (Normal): प्रतिबिंब ठीक रेटिना पर केंद्रित (25 cm न्यूनतम दूरी)'}
        </text>
      </svg>
    );
  }

  // =========================================================================
  // 28. SOLAR ESCAPE VELOCITY & ROCKET (PHYSICS #28)
  // =========================================================================
  if (labId === 'solar-escape-velocity') {
    const launchSpeed = p1; // e.g. 5 to 15 km/s
    const isEscaped = launchSpeed >= 11.2;

    return (
      <svg viewBox="0 0 540 220" className="w-full h-56 select-none">
        {/* Planet Earth Globe on Left */}
        <g transform="translate(110, 110)">
          <circle cx="0" cy="0" r="55" fill="#0284C7" stroke="#38BDF8" strokeWidth="2.5" />
          <circle cx="0" cy="0" r="70" fill="none" stroke="#67E8F9" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
          <text x="0" y="4" fill="#FFFFFF" fontSize="12" fontWeight="black" textAnchor="middle">पृथ्वी (Earth)</text>
          <text x="0" y="18" fill="#BAE6FD" fontSize="8" textAnchor="middle">R = 6400 km</text>
        </g>

        {/* Rocket Trajectory Path */}
        <path
          d={isEscaped ? "M 165 95 Q 260 50 480 30" : "M 165 95 Q 240 40 280 120 Q 230 180 165 140"}
          fill="none"
          stroke={isEscaped ? '#10B981' : '#F59E0B'}
          strokeWidth="2.5"
          strokeDasharray={isEscaped ? 'none' : '4 3'}
        />

        {/* Rocket Graphic */}
        <g transform={`translate(${isEscaped ? 450 : 260}, ${isEscaped ? 35 : 55}) rotate(-35)`}>
          <polygon points="0,-12 6,8 -6,8" fill="#EF4444" />
          <polygon points="-4,8 0,16 4,8" fill="#FBBF24" className="animate-pulse" />
        </g>

        {/* Readout Panels */}
        <g transform="translate(320, 50)">
          <rect x="0" y="0" width="190" height="95" rx="8" fill="#091122" stroke={isEscaped ? '#10B981' : '#F59E0B'} strokeWidth="1.5" />
          <text x="14" y="22" fill={isEscaped ? '#34D399' : '#FBBF24'} fontSize="10" fontWeight="bold">
            प्रक्षेपण वेग: {launchSpeed} km/s
          </text>
          <text x="14" y="48" fill="#FFFFFF" fontSize="13" fontWeight="black">
            {isEscaped ? '🚀 पलायन सफल (Escaped Orbit)!' : '🛰️ उपग्रह कक्षा में अथवा गिरेगा'}
          </text>
          <text x="14" y="70" fill="#FDE047" fontSize="10">पृथ्वी का पलायन वेग v_e = 11.2 km/s</text>
          <text x="14" y="86" fill="#94A3B8" fontSize="8">कक्षीय वेग v_o = 7.9 km/s</text>
        </g>
      </svg>
    );
  }

  // Default fallback for any unexpected ID
  return (
    <div className="p-8 text-center text-slate-400">
      प्रयोगशाला सिमुलेशन लोड हो रहा है...
    </div>
  );
};
