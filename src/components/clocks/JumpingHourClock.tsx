import React from 'react';

interface JumpingHourClockProps {
  size: number;
  hourAngle: number;
  minuteAngle: number;
  secondAngle: number;
  hours: number;
}

export const JumpingHourClock: React.FC<JumpingHourClockProps> = ({
  minuteAngle,
  secondAngle,
  hours,
}) => {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs>
        <linearGradient id="jumping-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a1a2e" />
          <stop offset="100%" stopColor="#16213e" />
        </linearGradient>
      </defs>

      {/* Dark dial */}
      <circle cx="100" cy="100" r="98" fill="url(#jumping-bg)" />

      {/* Large digital hour window at 12 o'clock */}
      <g>
        <rect x="70" y="30" width="60" height="40" rx="5" fill="#000000" stroke="#4a90e2" strokeWidth="2" />
        <text
          x="100"
          y="60"
          textAnchor="middle"
          fontSize="32"
          fill="#4a90e2"
          fontFamily="'DS-Digital', 'Courier New', monospace"
          fontWeight="bold"
        >
          {hours.toString().padStart(2, '0')}
        </text>
      </g>

      {/* Minute arc track */}
      <circle cx="100" cy="100" r="85" fill="none" stroke="#333" strokeWidth="4" />
      
      {/* Minute markers */}
      {[...Array(60)].map((_, i) => {
        if (i % 5 === 0) {
          const angle = (i * 6 - 90) * (Math.PI / 180);
          const r = 82;
          const x = 100 + r * Math.cos(angle);
          const y = 100 + r * Math.sin(angle);
          
          return (
            <circle key={i} cx={x} cy={y} r="2" fill="#4a90e2" />
          );
        }
        return null;
      })}

      {/* Minute hand - large pointer */}
      <g transform={`rotate(${minuteAngle} 100 100)`}>
        <path
          d="M 92 100 L 95 25 L 100 18 L 105 25 L 108 100 Z"
          fill="#4a90e2"
        />
      </g>

      {/* Small seconds subdial at 6 o'clock */}
      <g>
        <circle cx="100" cy="155" r="22" fill="#000000" stroke="#4a90e2" strokeWidth="1" />
        {[...Array(12)].map((_, i) => {
          if (i % 3 === 0) {
            const angle = (i * 30 - 90) * (Math.PI / 180);
            const r = 18;
            const x = 100 + r * Math.cos(angle);
            const y = 155 + r * Math.sin(angle);
            return <circle key={i} cx={x} cy={y} r="1" fill="#4a90e2" />;
          }
          return null;
        })}
        
        {/* Small second hand */}
        <g transform={`rotate(${secondAngle} 100 155)`}>
          <line x1="100" y1="155" x2="100" y2="138" stroke="#ff8800" strokeWidth="1" />
        </g>
      </g>

      {/* Text */}
      <text x="100" y="125" textAnchor="middle" fontSize="8" fill="#4a90e2" fontFamily="sans-serif">
        JUMPING HOUR
      </text>

      {/* Center cap */}
      <circle cx="100" cy="100" r="5" fill="#4a90e2" />
    </svg>
  );
};
