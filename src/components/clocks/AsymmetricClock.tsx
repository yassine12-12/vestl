import React from 'react';

interface AsymmetricClockProps {
  size: number;
  hourAngle: number;
  minuteAngle: number;
  secondAngle: number;
}

export const AsymmetricClock: React.FC<AsymmetricClockProps> = ({
  hourAngle,
  minuteAngle,
  secondAngle,
}) => {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs>
        <radialGradient id="asym-dial" cx="40%" cy="40%">
          <stop offset="0%" stopColor="#2d2d2d" />
          <stop offset="100%" stopColor="#1a1a1a" />
        </radialGradient>
      </defs>

      {/* Off-center dial */}
      <circle cx="100" cy="100" r="98" fill="url(#asym-dial)" />

      {/* Asymmetric design elements */}
      <g>
        {/* Large arc on right side */}
        <path
          d="M 150 60 A 60 60 0 0 1 150 140"
          fill="none"
          stroke="#ff6b00"
          strokeWidth="3"
        />
        
        {/* Small subdial on left */}
        <circle cx="55" cy="100" r="30" fill="#000000" stroke="#4a90e2" strokeWidth="2" />
        
        {/* Seconds in subdial */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const r = 26;
          const x = 55 + r * Math.cos(angle);
          const y = 100 + r * Math.sin(angle);
          
          if (i % 3 === 0) {
            return <circle key={i} cx={x} cy={y} r="1.5" fill="#4a90e2" />;
          }
          return null;
        })}
        
        {/* Second hand in subdial */}
        <g transform={`rotate(${secondAngle} 55 100)`}>
          <line x1="55" y1="100" x2="55" y2="76" stroke="#4a90e2" strokeWidth="1" />
        </g>
      </g>

      {/* Main time display - offset to right */}
      <g transform="translate(15, 0)">
        {/* Hour markers - only on right half */}
        {[12, 1, 2, 3, 4, 5, 6].map((num) => {
          const angle = ((num - 3) * 30) * (Math.PI / 180);
          const r = 65;
          const x = 100 + r * Math.cos(angle);
          const y = 100 + r * Math.sin(angle);
          
          return (
            <text
              key={num}
              x={x}
              y={y + 4}
              textAnchor="middle"
              fontSize="14"
              fill="#ffffff"
              fontFamily="sans-serif"
              fontWeight="300"
            >
              {num}
            </text>
          );
        })}

        {/* Hour hand */}
        <g transform={`rotate(${hourAngle} 100 100)`}>
          <path
            d="M 96 100 L 98 55 L 100 52 L 102 55 L 104 100 Z"
            fill="#ff6b00"
          />
        </g>

        {/* Minute hand */}
        <g transform={`rotate(${minuteAngle} 100 100)`}>
          <path
            d="M 97 100 L 99 32 L 100 28 L 101 32 L 103 100 Z"
            fill="#ff6b00"
          />
        </g>

        {/* Center cap */}
        <circle cx="100" cy="100" r="4" fill="#ff6b00" />
      </g>

      {/* Brand text */}
      <text x="130" y="175" textAnchor="middle" fontSize="8" fill="#ffffff" fontFamily="sans-serif" fontStyle="italic">
        ASYMÉTRIQUE
      </text>
    </svg>
  );
};
