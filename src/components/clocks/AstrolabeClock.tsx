import React from 'react';

interface AstrolabeClockProps {
  hourAngle: number;
  minuteAngle: number;
  secondAngle: number;
  [key: string]: unknown;
}

export const AstrolabeClock: React.FC<AstrolabeClockProps> = ({
  hourAngle,
  minuteAngle,
  secondAngle,
}) => {
  const brass      = '#d4a84b';
  const brassLight = '#f0d080';
  const brassDark  = '#8b6914';

  const romanNums = ['XII', 'I', 'II', 'III', 'IIII', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
  const zodiac    = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];

  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs>
        <radialGradient id="ast-bg" cx="50%" cy="42%">
          <stop offset="0%" stopColor="#251c0a" />
          <stop offset="60%" stopColor="#1a1208" />
          <stop offset="100%" stopColor="#0d0a04" />
        </radialGradient>
        <linearGradient id="ast-rim" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f0d080" />
          <stop offset="35%" stopColor="#d4a84b" />
          <stop offset="65%" stopColor="#8b6914" />
          <stop offset="100%" stopColor="#f0d080" />
        </linearGradient>
        <filter id="ast-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Mater – main body */}
      <circle cx="100" cy="100" r="98" fill="url(#ast-bg)" />

      {/* Raised outer limb ring */}
      <circle cx="100" cy="100" r="97" fill="none" stroke="url(#ast-rim)" strokeWidth="3" opacity="0.9" />
      <circle cx="100" cy="100" r="93" fill="none" stroke={brassDark} strokeWidth="0.5" opacity="0.8" />
      <circle cx="100" cy="100" r="91" fill="none" stroke={brassLight} strokeWidth="0.3" opacity="0.35" />

      {/* Degree graduation on outer limb (every 5°) */}
      {[...Array(72)].map((_, i) => {
        const a = (i * 5 - 90) * Math.PI / 180;
        const is30 = i % 6 === 0;
        const is15 = i % 3 === 0;
        const r2 = is30 ? 83 : is15 ? 87 : 90;
        return (
          <line key={i}
            x1={100 + 93 * Math.cos(a)} y1={100 + 93 * Math.sin(a)}
            x2={100 + r2 * Math.cos(a)} y2={100 + r2 * Math.sin(a)}
            stroke={is30 ? brassLight : brass}
            strokeWidth={is30 ? 0.8 : is15 ? 0.5 : 0.3}
            opacity={is30 ? 0.9 : 0.6}
          />
        );
      })}

      {/* Zodiac symbols on outer band */}
      {zodiac.map((sym, i) => {
        const a = (i * 30 - 90) * Math.PI / 180;
        const r = 79;
        const cx = 100 + r * Math.cos(a);
        const cy = 100 + r * Math.sin(a);
        return (
          <text key={i} x={cx} y={cy + 3.5} textAnchor="middle"
            fontSize="7.5" fill={brass} fontFamily="serif" opacity="0.65"
            transform={`rotate(${i * 30} ${cx} ${cy})`}
          >{sym}</text>
        );
      })}

      {/* Almucantar altitude circles (tympan) */}
      {[66, 52, 38, 26].map((r, i) => (
        <circle key={i} cx="100" cy="100" r={r} fill="none"
          stroke={brass} strokeWidth="0.35"
          strokeDasharray={i > 1 ? '2,3' : undefined}
          opacity={0.3 - i * 0.04}
        />
      ))}

      {/* Azimuth vertical-circle lines on tympan */}
      {[...Array(6)].map((_, i) => {
        const a = (i * 30 - 90) * Math.PI / 180;
        return (
          <line key={i}
            x1={100 + 28 * Math.cos(a)} y1={100 + 28 * Math.sin(a)}
            x2={100 + 66 * Math.cos(a)} y2={100 + 66 * Math.sin(a)}
            stroke={brass} strokeWidth="0.3" opacity="0.22"
          />
        );
      })}

      {/* ── RETE (star-map overlay) – rotates with hour ── */}
      <g transform={`rotate(${hourAngle * 0.5} 100 100)`}>
        {/* Rete outer frame ring */}
        <circle cx="100" cy="100" r="67" fill="none" stroke={brass} strokeWidth="1.2" opacity="0.7" />
        <circle cx="100" cy="100" r="64" fill="none" stroke={brassDark} strokeWidth="0.4" opacity="0.5" />

        {/* Star-pointer alidades – the rete's signature spiky elements */}
        {[0, 90, 180, 270].map((deg, i) => {
          const rad = (deg - 90) * Math.PI / 180;
          const baseR = 56, tipR = 78;
          const bx = 100 + baseR * Math.cos(rad);
          const by = 100 + baseR * Math.sin(rad);
          const tx = 100 + tipR * Math.cos(rad);
          const ty = 100 + tipR * Math.sin(rad);
          const perp = rad + Math.PI / 2;
          return (
            <path key={i}
              d={`M ${bx + 3.5 * Math.cos(perp)} ${by + 3.5 * Math.sin(perp)} L ${tx} ${ty} L ${bx - 3.5 * Math.cos(perp)} ${by - 3.5 * Math.sin(perp)} Z`}
              fill={brass} opacity="0.88" filter="url(#ast-glow)"
            />
          );
        })}

        {/* Smaller off-axis star pointers */}
        {[45, 135, 225, 315].map((deg, i) => {
          const rad = (deg - 90) * Math.PI / 180;
          const baseR = 58, tipR = 72;
          const bx = 100 + baseR * Math.cos(rad);
          const by = 100 + baseR * Math.sin(rad);
          const tx = 100 + tipR * Math.cos(rad);
          const ty = 100 + tipR * Math.sin(rad);
          const perp = rad + Math.PI / 2;
          return (
            <path key={i}
              d={`M ${bx + 2.5 * Math.cos(perp)} ${by + 2.5 * Math.sin(perp)} L ${tx} ${ty} L ${bx - 2.5 * Math.cos(perp)} ${by - 2.5 * Math.sin(perp)} Z`}
              fill={brassDark} opacity="0.75"
            />
          );
        })}

        {/* Rete crossbar frame */}
        <line x1="100" y1="33" x2="100" y2="67" stroke={brass} strokeWidth="0.9" opacity="0.6" />
        <line x1="33" y1="100" x2="67" y2="100" stroke={brass} strokeWidth="0.9" opacity="0.6" />
        <circle cx="100" cy="100" r="9" fill="none" stroke={brass} strokeWidth="0.9" opacity="0.7" />
      </g>

      {/* ── Roman numeral hour ring ── */}
      {romanNums.map((num, i) => {
        const a = (i * 30 - 90) * Math.PI / 180;
        const r = 71;
        const isCardinal = i % 3 === 0;
        return (
          <text key={i}
            x={100 + r * Math.cos(a)} y={100 + r * Math.sin(a) + 4}
            textAnchor="middle"
            fontSize={isCardinal ? 9 : 7}
            fill={isCardinal ? brassLight : brass}
            fontFamily="'Times New Roman', serif"
            fontStyle="italic"
            opacity={isCardinal ? 0.92 : 0.7}
          >{num}</text>
        );
      })}

      {/* Hour hand – large alidade arm */}
      <g transform={`rotate(${hourAngle} 100 100)`} filter="url(#ast-glow)">
        <path d="M 97 100 L 98.5 56 L 100 50 L 101.5 56 L 103 100 Z" fill={brass} opacity="0.92" />
        <path d="M 97 100 L 103 100 L 104.5 108 L 100 116 L 95.5 108 Z" fill={brassDark} opacity="0.8" />
        <line x1="100" y1="50" x2="100" y2="100" stroke={brassLight} strokeWidth="0.5" opacity="0.45" />
      </g>

      {/* Minute hand – thinner alidade */}
      <g transform={`rotate(${minuteAngle} 100 100)`} filter="url(#ast-glow)">
        <path d="M 98.5 100 L 99.5 30 L 100 24 L 100.5 30 L 101.5 100 Z" fill={brassLight} opacity="0.88" />
        <path d="M 98.5 100 L 101.5 100 L 102.5 109 L 100 116 L 97.5 109 Z" fill={brass} opacity="0.75" />
        <line x1="100" y1="24" x2="100" y2="100" stroke="white" strokeWidth="0.4" opacity="0.28" />
      </g>

      {/* Second hand – thin brass pin */}
      <g transform={`rotate(${secondAngle} 100 100)`}>
        <line x1="100" y1="22" x2="100" y2="108" stroke={brassLight} strokeWidth="0.6" opacity="0.8" />
        <line x1="100" y1="108" x2="100" y2="120" stroke={brassDark} strokeWidth="0.6" opacity="0.55" />
      </g>

      {/* Center pivot – brass cap */}
      <circle cx="100" cy="100" r="8" fill={brassDark} stroke={brass} strokeWidth="1" />
      <circle cx="100" cy="100" r="5" fill={brass} />
      <circle cx="100" cy="100" r="2.5" fill={brassLight} />
      <circle cx="100" cy="100" r="1" fill={brassDark} />
    </svg>
  );
};
