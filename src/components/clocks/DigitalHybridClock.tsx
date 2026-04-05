import React from 'react';

interface DigitalHybridClockProps {
  size: number;
  hourAngle: number;
  minuteAngle: number;
  secondAngle: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const DigitalHybridClock: React.FC<DigitalHybridClockProps> = ({
  hourAngle,
  minuteAngle,
  secondAngle,
  hours,
  minutes,
}) => {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs>
        <linearGradient id="hybrid-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0a0a0a" />
          <stop offset="50%" stopColor="#1a1a1a" />
          <stop offset="100%" stopColor="#0a0a0a" />
        </linearGradient>
      </defs>

      {/* Black dial */}
      <circle cx="100" cy="100" r="98" fill="url(#hybrid-bg)" />

      {/* Digital display at top */}
      <g>
        <rect x="50" y="35" width="100" height="35" rx="5" fill="#000000" stroke="#00ff88" strokeWidth="1.5" />
        <text
          x="100"
          y="62"
          textAnchor="middle"
          fontSize="26"
          fill="#00ff88"
          fontFamily="'Orbitron', 'Courier New', monospace"
          fontWeight="bold"
        >
          {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}
        </text>
      </g>

      {/* Analog components below */}
      {/* Minimalist hour markers */}
      {[0, 3, 6, 9].map((i) => {
        const angle = (i * 90 - 90) * (Math.PI / 180);
        const r = 85;
        const x = 100 + r * Math.cos(angle);
        const y = 100 + r * Math.sin(angle);
        
        return (
          <circle key={i} cx={x} cy={y} r="3" fill="#00ff88" />
        );
      })}

      {/* Circular minute track */}
      <circle cx="100" cy="100" r="85" fill="none" stroke="#00ff88" strokeWidth="1" opacity="0.3" />

      {/* Hour hand - neon style */}
      <g transform={`rotate(${hourAngle} 100 100)`}>
        <line x1="100" y1="100" x2="100" y2="55" stroke="#00ff88" strokeWidth="4" />
        <line x1="100" y1="100" x2="100" y2="55" stroke="#00ff88" strokeWidth="2" opacity="0.5" filter="blur(2px)" />
      </g>

      {/* Minute hand - neon style */}
      <g transform={`rotate(${minuteAngle} 100 100)`}>
        <line x1="100" y1="100" x2="100" y2="30" stroke="#00d4ff" strokeWidth="3" />
        <line x1="100" y1="100" x2="100" y2="30" stroke="#00d4ff" strokeWidth="2" opacity="0.5" filter="blur(2px)" />
      </g>

      {/* Second hand - thin neon */}
      <g transform={`rotate(${secondAngle} 100 100)`}>
        <line x1="100" y1="110" x2="100" y2="25" stroke="#ff00aa" strokeWidth="1.5" />
        <line x1="100" y1="110" x2="100" y2="25" stroke="#ff00aa" strokeWidth="1" opacity="0.5" filter="blur(2px)" />
      </g>

      {/* Text */}
      <text x="100" y="175" textAnchor="middle" fontSize="8" fill="#00ff88" fontFamily="'Orbitron', sans-serif">
        HYBRID
      </text>

      {/* Center glow */}
      <circle cx="100" cy="100" r="5" fill="#00ff88" />
      <circle cx="100" cy="100" r="8" fill="#00ff88" opacity="0.3" />
    </svg>
  );
};
