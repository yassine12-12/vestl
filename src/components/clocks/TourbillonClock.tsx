import React from 'react';

interface TourbillonClockProps {
  size: number;
  hourAngle: number;
  minuteAngle: number;
  secondAngle: number;
}

export const TourbillonClock: React.FC<TourbillonClockProps> = ({
  hourAngle,
  minuteAngle,
  secondAngle,
}) => {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs>
        <radialGradient id="tourbillon-dial" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#2d2d2d" />
          <stop offset="100%" stopColor="#1a1a1a" />
        </radialGradient>
        <linearGradient id="tourbillon-cage" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c0c0c0" />
          <stop offset="100%" stopColor="#808080" />
        </linearGradient>
      </defs>

      {/* Dark dial */}
      <circle cx="100" cy="100" r="98" fill="url(#tourbillon-dial)" />

      {/* Roman numerals */}
      <text x="100" y="30" textAnchor="middle" fontSize="16" fill="#d4af37" fontFamily="serif">XII</text>
      <text x="170" y="107" textAnchor="middle" fontSize="16" fill="#d4af37" fontFamily="serif">III</text>
      <text x="100" y="178" textAnchor="middle" fontSize="16" fill="#d4af37" fontFamily="serif">VI</text>
      <text x="30" y="107" textAnchor="middle" fontSize="16" fill="#d4af37" fontFamily="serif">IX</text>

      {/* Minute markers */}
      {[...Array(60)].map((_, i) => {
        if (i % 5 !== 0) {
          const angle = (i * 6 - 90) * (Math.PI / 180);
          const x1 = 100 + 92 * Math.cos(angle);
          const y1 = 100 + 92 * Math.sin(angle);
          const x2 = 100 + 88 * Math.cos(angle);
          const y2 = 100 + 88 * Math.sin(angle);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#666" strokeWidth="0.5" />;
        }
        return null;
      })}

      {/* Tourbillon cage at 6 o'clock position */}
      <g transform={`rotate(${secondAngle} 100 150)`}>
        {/* Outer cage ring */}
        <circle cx="100" cy="150" r="25" fill="none" stroke="url(#tourbillon-cage)" strokeWidth="2" />
        
        {/* Inner cage structure */}
        <circle cx="100" cy="150" r="20" fill="none" stroke="#808080" strokeWidth="1" />
        
        {/* Cage spokes */}
        <line x1="100" y1="125" x2="100" y2="175" stroke="#808080" strokeWidth="1" />
        <line x1="75" y1="150" x2="125" y2="150" stroke="#808080" strokeWidth="1" />
        
        {/* Balance wheel */}
        <circle cx="100" cy="150" r="8" fill="none" stroke="#c0c0c0" strokeWidth="1.5" />
        <circle cx="100" cy="150" r="3" fill="#d4af37" />
        
        {/* Escapement lever */}
        <line x1="100" y1="150" x2="110" y2="145" stroke="#c0c0c0" strokeWidth="1" />
      </g>

      {/* "TOURBILLON" text */}
      <text x="100" y="115" textAnchor="middle" fontSize="7" fill="#d4af37" fontFamily="serif">
        TOURBILLON
      </text>

      {/* Hour hand - blue steel */}
      <g transform={`rotate(${hourAngle} 100 100)`}>
        <path
          d="M 96 100 L 98 55 L 100 50 L 102 55 L 104 100 Z"
          fill="#2c5f8d"
        />
      </g>

      {/* Minute hand - blue steel */}
      <g transform={`rotate(${minuteAngle} 100 100)`}>
        <path
          d="M 97 100 L 99 30 L 100 25 L 101 30 L 103 100 Z"
          fill="#2c5f8d"
        />
      </g>

      {/* Center cap */}
      <circle cx="100" cy="100" r="3" fill="#d4af37" />
      <circle cx="100" cy="100" r="5" fill="none" stroke="#d4af37" strokeWidth="1" />
    </svg>
  );
};
