import React from 'react';

interface ArtDecoClockProps {
  size: number;
  hourAngle: number;
  minuteAngle: number;
  secondAngle: number;
}

export const ArtDecoClock: React.FC<ArtDecoClockProps> = ({
  hourAngle,
  minuteAngle,
  secondAngle,
}) => {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs>
        <linearGradient id="art-deco-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a1a1a" />
          <stop offset="100%" stopColor="#2d2d2d" />
        </linearGradient>
      </defs>

      {/* Black dial */}
      <circle cx="100" cy="100" r="98" fill="url(#art-deco-bg)" />

      {/* Art Deco geometric pattern - stepped circles */}
      <circle cx="100" cy="100" r="92" fill="none" stroke="#d4af37" strokeWidth="1" />
      <circle cx="100" cy="100" r="88" fill="none" stroke="#d4af37" strokeWidth="0.5" />
      <circle cx="100" cy="100" r="84" fill="none" stroke="#d4af37" strokeWidth="0.5" />

      {/* Stylized Art Deco hour markers - geometric shapes */}
      {[...Array(12)].map((_, i) => {
        // Main markers at 12, 3, 6, 9 are larger trapezoids
        if (i % 3 === 0) {
          return (
            <g key={i} transform={`rotate(${i * 30} 100 100)`}>
              <path
                d="M 100 15 L 97 25 L 103 25 Z"
                fill="#d4af37"
              />
            </g>
          );
        }
        
        // Other markers are smaller rectangles
        return (
          <g key={i} transform={`rotate(${i * 30} 100 100)`}>
            <rect
              x="98"
              y="20"
              width="4"
              height="8"
              fill="#d4af37"
            />
          </g>
        );
      })}

      {/* Art Deco numerals at cardinal positions */}
      <text x="100" y="35" textAnchor="middle" fontSize="18" fill="#d4af37" fontFamily="serif" fontWeight="bold">12</text>
      <text x="175" y="105" textAnchor="middle" fontSize="18" fill="#d4af37" fontFamily="serif" fontWeight="bold">3</text>
      <text x="100" y="180" textAnchor="middle" fontSize="18" fill="#d4af37" fontFamily="serif" fontWeight="bold">6</text>
      <text x="25" y="105" textAnchor="middle" fontSize="18" fill="#d4af37" fontFamily="serif" fontWeight="bold">9</text>

      {/* Hour hand - geometric angular shape */}
      <g transform={`rotate(${hourAngle} 100 100)`}>
        <path
          d="M 95 100 L 97 50 L 100 45 L 103 50 L 105 100 Z"
          fill="#d4af37"
        />
      </g>

      {/* Minute hand - geometric angular shape */}
      <g transform={`rotate(${minuteAngle} 100 100)`}>
        <path
          d="M 96 100 L 98 30 L 100 25 L 102 30 L 104 100 Z"
          fill="#d4af37"
        />
      </g>

      {/* Second hand - thin gold line */}
      <g transform={`rotate(${secondAngle} 100 100)`}>
        <line x1="100" y1="100" x2="100" y2="22" stroke="#ffd700" strokeWidth="1" />
        <line x1="100" y1="100" x2="100" y2="112" stroke="#ffd700" strokeWidth="1" />
      </g>

      {/* Center hexagon cap - Art Deco style */}
      <path
        d="M 100 90 L 107 95 L 107 105 L 100 110 L 93 105 L 93 95 Z"
        fill="#d4af37"
      />
    </svg>
  );
};
