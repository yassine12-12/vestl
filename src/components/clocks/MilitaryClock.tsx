import React from 'react';

interface MilitaryClockProps {
  size: number;
  hourAngle: number;
  minuteAngle: number;
  secondAngle: number;
}

export const MilitaryClock: React.FC<MilitaryClockProps> = ({
  hourAngle,
  minuteAngle,
  secondAngle,
}) => {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Olive drab dial */}
      <circle cx="100" cy="100" r="98" fill="#4a5240" />
      
      {/* Dark outer ring */}
      <circle cx="100" cy="100" r="98" fill="none" stroke="#2d3326" strokeWidth="3" />

      {/* 24-hour markers (military time) */}
      {[...Array(24)].map((_, i) => {
        const angle = (i * 15 - 90) * (Math.PI / 180);
        const outerR = 92;
        const innerR = i % 6 === 0 ? 78 : 85;
        const x1 = 100 + outerR * Math.cos(angle);
        const y1 = 100 + outerR * Math.sin(angle);
        const x2 = 100 + innerR * Math.cos(angle);
        const y2 = 100 + innerR * Math.sin(angle);
        
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#d4d4d4"
            strokeWidth={i % 6 === 0 ? "2" : "1"}
          />
        );
      })}

      {/* 24-hour numerals */}
      {[0, 6, 12, 18].map((hour) => {
        const angle = (hour * 15 - 90) * (Math.PI / 180);
        const r = 68;
        const x = 100 + r * Math.cos(angle);
        const y = 100 + r * Math.sin(angle);
        
        return (
          <text
            key={hour}
            x={x}
            y={y + 5}
            textAnchor="middle"
            fontSize="14"
            fill="#d4d4d4"
            fontFamily="monospace"
            fontWeight="bold"
          >
            {hour.toString().padStart(2, '0')}
          </text>
        );
      })}

      {/* Crosshairs in center */}
      <line x1="100" y1="90" x2="100" y2="110" stroke="#d4d4d4" strokeWidth="1" opacity="0.5" />
      <line x1="90" y1="100" x2="110" y2="100" stroke="#d4d4d4" strokeWidth="1" opacity="0.5" />
      <circle cx="100" cy="100" r="8" fill="none" stroke="#d4d4d4" strokeWidth="1" opacity="0.5" />

      {/* "MILITARY" text */}
      <text x="100" y="140" textAnchor="middle" fontSize="8" fill="#d4d4d4" fontFamily="monospace" fontWeight="bold">
        MILITARY
      </text>
      <text x="100" y="150" textAnchor="middle" fontSize="6" fill="#d4d4d4" fontFamily="monospace">
        24H FORMAT
      </text>

      {/* Hour hand - thick arrow */}
      <g transform={`rotate(${hourAngle} 100 100)`}>
        <path
          d="M 94 100 L 96 48 L 100 42 L 104 48 L 106 100 Z"
          fill="#d4d4d4"
        />
      </g>

      {/* Minute hand - thick arrow */}
      <g transform={`rotate(${minuteAngle} 100 100)`}>
        <path
          d="M 95 100 L 97 28 L 100 22 L 103 28 L 105 100 Z"
          fill="#d4d4d4"
        />
      </g>

      {/* Second hand - red military style */}
      <g transform={`rotate(${secondAngle} 100 100)`}>
        <line x1="100" y1="110" x2="100" y2="25" stroke="#cc3333" strokeWidth="2" />
        {/* Arrow tip */}
        <path d="M 100 25 L 97 30 L 103 30 Z" fill="#cc3333" />
      </g>

      {/* Center circle */}
      <circle cx="100" cy="100" r="4" fill="#2d3326" />
    </svg>
  );
};
