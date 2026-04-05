import React from 'react';

interface CrystalPrismClockProps {
  hourAngle: number;
  minuteAngle: number;
  secondAngle: number;
  [key: string]: unknown;
}

export const CrystalPrismClock: React.FC<CrystalPrismClockProps> = ({
  hourAngle,
  minuteAngle,
  secondAngle,
}) => {
  const hexPoints = [...Array(6)].map((_, i) => {
    const a = (i * 60 - 30) * Math.PI / 180;
    return `${100 + 96 * Math.cos(a)},${100 + 96 * Math.sin(a)}`;
  }).join(' ');

  const facetColors = [
    '#ff8fb0', '#ffb347', '#ffe066', '#b8ff66',
    '#66ffcc', '#66ccff', '#6699ff', '#9966ff',
    '#ff66ff', '#ff6699', '#ff9933', '#99ff66',
  ];

  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs>
        <clipPath id="cprc-hex">
          <polygon points={hexPoints} />
        </clipPath>
        <filter id="cprc-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="cprc-shimmer" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="cprc-bg" cx="45%" cy="40%">
          <stop offset="0%" stopColor="#0a0a1e" />
          <stop offset="100%" stopColor="#000008" />
        </radialGradient>
        {facetColors.map((color, i) => (
          <linearGradient
            key={i}
            id={`cprc-f${i}`}
            gradientUnits="userSpaceOnUse"
            x1="100" y1="100"
            x2={100 + 96 * Math.cos((i * 30 - 90) * Math.PI / 180)}
            y2={100 + 96 * Math.sin((i * 30 - 90) * Math.PI / 180)}
          >
            <stop offset="20%" stopColor={color} stopOpacity="0" />
            <stop offset="100%" stopColor={color} stopOpacity="0.22" />
          </linearGradient>
        ))}
        <linearGradient id="cprc-hand-h" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8ab4e8" stopOpacity="0.7" />
          <stop offset="50%" stopColor="#e8f4ff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#8ab4e8" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="cprc-hand-m" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#88bbdd" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#ccecff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#88bbdd" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      {/* Background */}
      <polygon points={hexPoints} fill="url(#cprc-bg)" />

      {/* Prismatic facet color washes */}
      {facetColors.map((_, i) => {
        const a1 = (i * 30 - 90) * Math.PI / 180;
        const a2 = ((i + 1) * 30 - 90) * Math.PI / 180;
        const r = 96;
        return (
          <path
            key={i}
            d={`M 100 100 L ${100 + r * Math.cos(a1)} ${100 + r * Math.sin(a1)} L ${100 + r * Math.cos(a2)} ${100 + r * Math.sin(a2)} Z`}
            fill={`url(#cprc-f${i})`}
            clipPath="url(#cprc-hex)"
          />
        );
      })}

      {/* Inner hexagon rings – gem table/bezel cuts */}
      {[0.82, 0.64, 0.46].map((scale, si) => {
        const pts = [...Array(6)].map((_, i) => {
          const a = (i * 60 - 30) * Math.PI / 180;
          return `${100 + 96 * scale * Math.cos(a)},${100 + 96 * scale * Math.sin(a)}`;
        }).join(' ');
        return (
          <polygon key={si} points={pts} fill="none" stroke="#c8dcff"
            strokeWidth="0.4" opacity={0.4 - si * 0.08} />
        );
      })}

      {/* Radial facet lines */}
      {[...Array(12)].map((_, i) => {
        const a = (i * 30 - 90) * Math.PI / 180;
        return (
          <line key={i}
            x1={100 + 22 * Math.cos(a)} y1={100 + 22 * Math.sin(a)}
            x2={100 + 96 * Math.cos(a)} y2={100 + 96 * Math.sin(a)}
            stroke="#b0c8e8" strokeWidth="0.25" opacity="0.5"
          />
        );
      })}

      {/* Outer hex outline */}
      <polygon points={hexPoints} fill="none" stroke="#d8ecff" strokeWidth="1.2" opacity="0.85" />

      {/* Hour markers – cut-gem diamond shapes */}
      {[...Array(12)].map((_, i) => {
        const a = (i * 30 - 90) * Math.PI / 180;
        const isCardinal = i % 3 === 0;
        const r = 80;
        const x = 100 + r * Math.cos(a);
        const y = 100 + r * Math.sin(a);
        const s = isCardinal ? 4.5 : 2.5;
        return (
          <path key={i}
            d={`M ${x} ${y - s} L ${x + s * 0.55} ${y} L ${x} ${y + s} L ${x - s * 0.55} ${y} Z`}
            fill={isCardinal ? '#ffffff' : '#b8d4f0'}
            opacity={isCardinal ? 0.95 : 0.7}
            filter="url(#cprc-shimmer)"
          />
        );
      })}

      {/* Hour hand – crystal shard */}
      <g transform={`rotate(${hourAngle} 100 100)`} filter="url(#cprc-glow)">
        <path d="M 97.5 100 L 99 48 L 100 42 L 101 48 L 102.5 100 Z" fill="url(#cprc-hand-h)" />
        <path d="M 99.5 100 L 100 42 L 100.5 100 Z" fill="white" opacity="0.5" />
        <path d="M 97.5 100 L 102.5 100 L 103.5 110 L 100 115 L 96.5 110 Z" fill="url(#cprc-hand-h)" opacity="0.6" />
      </g>

      {/* Minute hand – thinner crystal shard */}
      <g transform={`rotate(${minuteAngle} 100 100)`} filter="url(#cprc-glow)">
        <path d="M 98.5 100 L 99.5 26 L 100 20 L 100.5 26 L 101.5 100 Z" fill="url(#cprc-hand-m)" />
        <path d="M 99.7 100 L 100 20 L 100.3 100 Z" fill="white" opacity="0.45" />
        <path d="M 98.5 100 L 101.5 100 L 102.5 110 L 100 116 L 97.5 110 Z" fill="url(#cprc-hand-m)" opacity="0.55" />
      </g>

      {/* Second hand – spectral needle */}
      <g transform={`rotate(${secondAngle} 100 100)`} filter="url(#cprc-shimmer)">
        <line x1="100" y1="22" x2="100" y2="100" stroke="#ff8fcc" strokeWidth="0.9" opacity="0.9" />
        <line x1="100" y1="100" x2="100" y2="118" stroke="#ff8fcc" strokeWidth="0.9" opacity="0.45" />
        <circle cx="100" cy="22" r="1.8" fill="#ff8fcc" opacity="0.9" />
      </g>

      {/* Center gem */}
      <circle cx="100" cy="100" r="8" fill="#000014" stroke="#c0d8f8" strokeWidth="0.8" opacity="0.9" />
      <path d="M 100 93 L 107 100 L 100 107 L 93 100 Z"
        fill="#c8dcff" opacity="0.85" filter="url(#cprc-shimmer)" />
      <circle cx="100" cy="100" r="2" fill="white" opacity="0.9" />
    </svg>
  );
};
