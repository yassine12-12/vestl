import React from 'react';

interface DressElegantClockProps {
  size: number;
  hourAngle: number;
  minuteAngle: number;
  secondAngle: number;
}

export const DressElegantClock: React.FC<DressElegantClockProps> = ({
  hourAngle,
  minuteAngle,
  secondAngle,
}) => {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs>
        <radialGradient id="dress-dial-gradient" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#f8f8f8" />
          <stop offset="100%" stopColor="#e8e8e8" />
        </radialGradient>
      </defs>

      {/* Outer ring */}
      <circle cx="100" cy="100" r="98" fill="none" stroke="#d4af37" strokeWidth="2" />
      
      {/* White dial */}
      <circle cx="100" cy="100" r="95" fill="url(#dress-dial-gradient)" />

      {/* Ultra-minimal index markers - just thin lines at 12, 3, 6, 9 */}
      <line x1="100" y1="12" x2="100" y2="20" stroke="#333333" strokeWidth="1" />
      <line x1="188" y1="100" x2="180" y2="100" stroke="#333333" strokeWidth="1" />
      <line x1="100" y1="188" x2="100" y2="180" stroke="#333333" strokeWidth="1" />
      <line x1="12" y1="100" x2="20" y2="100" stroke="#333333" strokeWidth="1" />

      {/* Brand text */}
      <text x="100" y="75" textAnchor="middle" fontSize="8" fill="#333333" fontFamily="serif" fontStyle="italic">
        ÉLÉGANCE
      </text>

      {/* Hour hand - ultra thin leaf shape */}
      <g transform={`rotate(${hourAngle} 100 100)`}>
        <path
          d="M 100 100 L 98 45 Q 100 40 102 45 Z"
          fill="#2c2c2c"
        />
      </g>

      {/* Minute hand - ultra thin leaf shape */}
      <g transform={`rotate(${minuteAngle} 100 100)`}>
        <path
          d="M 100 100 L 99 25 Q 100 22 101 25 Z"
          fill="#2c2c2c"
        />
      </g>

      {/* Second hand - hair-thin */}
      <g transform={`rotate(${secondAngle} 100 100)`}>
        <line x1="100" y1="100" x2="100" y2="20" stroke="#d4af37" strokeWidth="0.5" />
        {/* Counterweight */}
        <line x1="100" y1="100" x2="100" y2="110" stroke="#d4af37" strokeWidth="0.5" />
      </g>

      {/* Center cap */}
      <circle cx="100" cy="100" r="2" fill="#d4af37" />
    </svg>
  );
};
