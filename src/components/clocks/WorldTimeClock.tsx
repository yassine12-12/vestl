import React from 'react';

interface WorldTimeClockProps {
  size: number;
  hourAngle: number;
  minuteAngle: number;
  secondAngle: number;
}

export const WorldTimeClock: React.FC<WorldTimeClockProps> = ({
  hourAngle,
  minuteAngle,
  secondAngle,
}) => {
  const cities = ['NYC', 'LON', 'TKY', 'SYD'];
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs>
        <radialGradient id="world-dial" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#1a2332" />
          <stop offset="100%" stopColor="#0d1117" />
        </radialGradient>
      </defs>

      {/* Dark blue dial */}
      <circle cx="100" cy="100" r="98" fill="url(#world-dial)" />

      {/* World map silhouette (simplified continents) */}
      <g opacity="0.2" fill="#4a90e2">
        {/* Simplified world map shapes */}
        <ellipse cx="100" cy="100" rx="85" ry="40" fill="none" stroke="#4a90e2" strokeWidth="1" strokeDasharray="2,2" />
        <line x1="15" y1="100" x2="185" y2="100" stroke="#4a90e2" strokeWidth="0.5" />
      </g>

      {/* Hour markers */}
      {[...Array(12)].map((_, i) => (
        <g key={i} transform={`rotate(${i * 30} 100 100)`}>
          <circle cx="100" cy="20" r="2" fill="#4a90e2" />
        </g>
      ))}

      {/* City time zones around the dial */}
      {cities.map((city, i) => {
        const angle = (i * 90 - 90) * (Math.PI / 180);
        const r = 70;
        const x = 100 + r * Math.cos(angle);
        const y = 100 + r * Math.sin(angle);
        
        return (
          <g key={city}>
            <text
              x={x}
              y={y}
              textAnchor="middle"
              fontSize="10"
              fill="#4a90e2"
              fontFamily="sans-serif"
              fontWeight="bold"
            >
              {city}
            </text>
          </g>
        );
      })}

      {/* Brand text */}
      <text x="100" y="140" textAnchor="middle" fontSize="8" fill="#4a90e2" fontFamily="sans-serif">
        WORLD TIME
      </text>

      {/* 24-hour subdial (small inner circle) */}
      <circle cx="100" cy="100" r="35" fill="none" stroke="#4a90e2" strokeWidth="1" />
      {[...Array(24)].map((_, i) => {
        if (i % 6 === 0) {
          const angle = (i * 15 - 90) * (Math.PI / 180);
          const r = 28;
          const x = 100 + r * Math.cos(angle);
          const y = 100 + r * Math.sin(angle);
          return (
            <text
              key={i}
              x={x}
              y={y + 3}
              textAnchor="middle"
              fontSize="6"
              fill="#4a90e2"
              fontFamily="sans-serif"
            >
              {i}
            </text>
          );
        }
        return null;
      })}

      {/* Hour hand - blue */}
      <g transform={`rotate(${hourAngle} 100 100)`}>
        <path
          d="M 96 100 L 98 50 L 100 45 L 102 50 L 104 100 Z"
          fill="#4a90e2"
        />
      </g>

      {/* Minute hand - blue */}
      <g transform={`rotate(${minuteAngle} 100 100)`}>
        <path
          d="M 97 100 L 99 28 L 100 25 L 101 28 L 103 100 Z"
          fill="#4a90e2"
        />
      </g>

      {/* Second hand - orange */}
      <g transform={`rotate(${secondAngle} 100 100)`}>
        <line x1="100" y1="100" x2="100" y2="25" stroke="#ff8800" strokeWidth="1.5" />
        <line x1="100" y1="100" x2="100" y2="110" stroke="#ff8800" strokeWidth="1.5" />
      </g>

      {/* Center cap */}
      <circle cx="100" cy="100" r="3" fill="#ff8800" />
    </svg>
  );
};
