import React from 'react';

interface RailroadClockProps {
  size: number;
  hourAngle: number;
  minuteAngle: number;
  secondAngle: number;
}

export const RailroadClock: React.FC<RailroadClockProps> = ({
  hourAngle,
  minuteAngle,
  secondAngle,
}) => {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* White dial - high contrast for visibility */}
      <circle cx="100" cy="100" r="98" fill="#ffffff" />
      
      {/* Black outer ring */}
      <circle cx="100" cy="100" r="98" fill="none" stroke="#000000" strokeWidth="4" />

      {/* Bold Arabic numerals - all 12 hours */}
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => {
        const angle = ((num - 3) * 30) * (Math.PI / 180);
        const r = 75;
        const x = 100 + r * Math.cos(angle);
        const y = 100 + r * Math.sin(angle);
        
        return (
          <text
            key={num}
            x={x}
            y={y + 6}
            textAnchor="middle"
            fontSize="20"
            fill="#000000"
            fontFamily="Arial, sans-serif"
            fontWeight="900"
          >
            {num}
          </text>
        );
      })}

      {/* Minute markers - thick black lines */}
      {[...Array(60)].map((_, i) => {
        if (i % 5 !== 0) {
          const angle = (i * 6 - 90) * (Math.PI / 180);
          const r1 = 90;
          const r2 = 85;
          const x1 = 100 + r1 * Math.cos(angle);
          const y1 = 100 + r1 * Math.sin(angle);
          const x2 = 100 + r2 * Math.cos(angle);
          const y2 = 100 + r2 * Math.sin(angle);
          
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#000000"
              strokeWidth="2"
            />
          );
        }
        return null;
      })}

      {/* "RAILROAD" text */}
      <text x="100" y="135" textAnchor="middle" fontSize="10" fill="#000000" fontFamily="Arial, sans-serif" fontWeight="bold">
        RAILROAD
      </text>

      {/* Hour hand - spade shape (classic railroad style) */}
      <g transform={`rotate(${hourAngle} 100 100)`}>
        <path
          d="M 92 100 L 94 55 Q 94 48 100 45 Q 106 48 106 55 L 108 100 Z"
          fill="#000000"
          stroke="#000000"
          strokeWidth="1"
        />
      </g>

      {/* Minute hand - spade shape */}
      <g transform={`rotate(${minuteAngle} 100 100)`}>
        <path
          d="M 94 100 L 96 30 Q 96 25 100 22 Q 104 25 104 30 L 106 100 Z"
          fill="#000000"
          stroke="#000000"
          strokeWidth="1"
        />
      </g>

      {/* Second hand - red lollipop (railroad standard) */}
      <g transform={`rotate(${secondAngle} 100 100)`}>
        <line x1="100" y1="100" x2="100" y2="28" stroke="#cc0000" strokeWidth="2" />
        <circle cx="100" cy="22" r="6" fill="#cc0000" />
        {/* Counterweight */}
        <line x1="100" y1="100" x2="100" y2="115" stroke="#cc0000" strokeWidth="2" />
      </g>

      {/* Center cap - large and visible */}
      <circle cx="100" cy="100" r="8" fill="#000000" />
      <circle cx="100" cy="100" r="4" fill="#ffffff" />
    </svg>
  );
};
