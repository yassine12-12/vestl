import React from 'react';

interface NeonPlasmaClockProps {
  hourAngle: number;
  minuteAngle: number;
  secondAngle: number;
  [key: string]: unknown;
}

export const NeonPlasmaClock: React.FC<NeonPlasmaClockProps> = ({
  hourAngle,
  minuteAngle,
  secondAngle,
}) => {
  const pr = 83;
  const secRad = ((secondAngle - 90) * Math.PI) / 180;
  const secX = 100 + pr * Math.cos(secRad);
  const secY = 100 + pr * Math.sin(secRad);
  const largeArcFlag = secondAngle > 180 ? 1 : 0;

  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs>
        <filter id="npc-glow-c" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="npc-glow-m" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="npc-plasma" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="5" result="blur1" />
          <feGaussianBlur stdDeviation="2" result="blur2" />
          <feMerge>
            <feMergeNode in="blur1" />
            <feMergeNode in="blur2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="npc-bg" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#06001a" />
          <stop offset="70%" stopColor="#020010" />
          <stop offset="100%" stopColor="#000008" />
        </radialGradient>
      </defs>

      {/* Void background */}
      <circle cx="100" cy="100" r="100" fill="url(#npc-bg)" />

      {/* Outer neon ring – cyan */}
      <circle cx="100" cy="100" r="95" fill="none" stroke="#00f5ff" strokeWidth="1.5"
        filter="url(#npc-glow-c)" opacity="0.9" />
      <circle cx="100" cy="100" r="95" fill="none" stroke="#00f5ff" strokeWidth="0.5" opacity="0.3" />

      {/* Middle neon ring – magenta */}
      <circle cx="100" cy="100" r="76" fill="none" stroke="#ff00ff" strokeWidth="0.8"
        filter="url(#npc-glow-m)" opacity="0.75" />

      {/* Inner detail ring */}
      <circle cx="100" cy="100" r="60" fill="none" stroke="#00f5ff" strokeWidth="0.3" opacity="0.2" />

      {/* Second progress arc – green plasma sweep from 12 o'clock */}
      {secondAngle > 1 && (
        <path
          d={`M 100 17 A ${pr} ${pr} 0 ${largeArcFlag} 1 ${secX} ${secY}`}
          fill="none"
          stroke="#39ff14"
          strokeWidth="2.5"
          opacity="0.9"
          filter="url(#npc-plasma)"
          strokeLinecap="round"
        />
      )}

      {/* Hour & minute markers */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30 - 90) * Math.PI / 180;
        const isCardinal = i % 3 === 0;
        const outerR = 87;
        const innerR = isCardinal ? 77 : 83;
        return (
          <line
            key={i}
            x1={100 + outerR * Math.cos(angle)} y1={100 + outerR * Math.sin(angle)}
            x2={100 + innerR * Math.cos(angle)} y2={100 + innerR * Math.sin(angle)}
            stroke={isCardinal ? '#00f5ff' : '#ff00ff'}
            strokeWidth={isCardinal ? 2.5 : 1}
            filter={isCardinal ? 'url(#npc-glow-c)' : undefined}
            opacity={isCardinal ? 0.95 : 0.7}
            strokeLinecap="round"
          />
        );
      })}

      {/* Minute dots */}
      {[...Array(60)].map((_, i) => {
        if (i % 5 === 0) return null;
        const angle = (i * 6 - 90) * Math.PI / 180;
        return (
          <circle key={i}
            cx={100 + 90 * Math.cos(angle)} cy={100 + 90 * Math.sin(angle)}
            r="0.8" fill="#ff00ff" opacity="0.4"
          />
        );
      })}

      {/* Monospace labels */}
      <text x="100" y="52" textAnchor="middle" fontSize="8" fill="#00f5ff"
        fontFamily="'Courier New', monospace" filter="url(#npc-glow-c)" opacity="0.9">12</text>
      <text x="150" y="104" textAnchor="middle" fontSize="8" fill="#00f5ff"
        fontFamily="'Courier New', monospace" filter="url(#npc-glow-c)" opacity="0.9">3</text>
      <text x="100" y="156" textAnchor="middle" fontSize="8" fill="#00f5ff"
        fontFamily="'Courier New', monospace" filter="url(#npc-glow-c)" opacity="0.9">6</text>
      <text x="50" y="104" textAnchor="middle" fontSize="8" fill="#00f5ff"
        fontFamily="'Courier New', monospace" filter="url(#npc-glow-c)" opacity="0.9">9</text>

      {/* Hour hand – cyan neon tube */}
      <g transform={`rotate(${hourAngle} 100 100)`} filter="url(#npc-glow-c)">
        <rect x="97.5" y="48" width="5" height="62" rx="2.5" fill="#00f5ff" opacity="0.9" />
        <rect x="99" y="48" width="2" height="62" rx="1" fill="white" opacity="0.55" />
        <rect x="96" y="98" width="8" height="14" rx="2" fill="#00f5ff" opacity="0.55" />
      </g>

      {/* Minute hand – magenta neon tube */}
      <g transform={`rotate(${minuteAngle} 100 100)`} filter="url(#npc-glow-m)">
        <rect x="98.5" y="26" width="3" height="84" rx="1.5" fill="#ff00ff" opacity="0.9" />
        <rect x="99.2" y="26" width="1.6" height="84" rx="0.8" fill="white" opacity="0.45" />
        <rect x="97" y="96" width="6" height="12" rx="1.5" fill="#ff00ff" opacity="0.55" />
      </g>

      {/* Second hand – green plasma needle */}
      <g transform={`rotate(${secondAngle} 100 100)`} filter="url(#npc-plasma)">
        <line x1="100" y1="20" x2="100" y2="100" stroke="#39ff14" strokeWidth="1.2" opacity="0.95" />
        <line x1="100" y1="100" x2="100" y2="120" stroke="#39ff14" strokeWidth="1.2" opacity="0.5" />
        <circle cx="100" cy="20" r="2" fill="#39ff14" opacity="0.9" />
      </g>

      {/* Center node */}
      <circle cx="100" cy="100" r="7" fill="#020010" stroke="#39ff14" strokeWidth="1.5"
        filter="url(#npc-plasma)" />
      <circle cx="100" cy="100" r="2.5" fill="#39ff14" opacity="0.95" />
    </svg>
  );
};
