import React from 'react';

interface PowerReserveClockProps {
  size: number;
  hourAngle: number;
  minuteAngle: number;
  secondAngle: number;
}

export const PowerReserveClock: React.FC<PowerReserveClockProps> = ({
  hourAngle,
  minuteAngle,
  secondAngle,
}) => {
  // Simulate power reserve (48 hours) - use seconds as animation
  const powerLevel = 35 + (secondAngle / 360) * 10; // Varies between 35-45 hours

  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs>
        <linearGradient id="power-dial" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f5f5dc" />
          <stop offset="100%" stopColor="#e8e8d0" />
        </linearGradient>
      </defs>

      {/* Cream dial */}
      <circle cx="100" cy="100" r="98" fill="url(#power-dial)" />
      
      {/* Outer ring */}
      <circle cx="100" cy="100" r="98" fill="none" stroke="#8b7355" strokeWidth="2" />

      {/* Hour markers - simple batons */}
      {[...Array(12)].map((_, i) => (
        <g key={i} transform={`rotate(${i * 30} 100 100)`}>
          <rect x="98" y="15" width="4" height="10" fill="#3d3d3d" />
        </g>
      ))}

      {/* Power reserve indicator at 12 o'clock */}
      <g>
        {/* Arc background */}
        <path
          d="M 60 45 A 40 40 0 0 1 140 45"
          fill="none"
          stroke="#d0d0d0"
          strokeWidth="6"
        />
        
        {/* Animated power level arc */}
        <path
          d="M 60 45 A 40 40 0 0 1 140 45"
          fill="none"
          stroke="#4a90e2"
          strokeWidth="6"
          strokeDasharray={`${(powerLevel / 48) * 125} 125`}
        />
        
        {/* Text labels */}
        <text x="55" y="52" fontSize="6" fill="#666" fontFamily="sans-serif">0</text>
        <text x="100" y="35" textAnchor="middle" fontSize="6" fill="#666" fontFamily="sans-serif">24</text>
        <text x="140" y="52" fontSize="6" fill="#666" fontFamily="sans-serif">48</text>
        
        <text x="100" y="62" textAnchor="middle" fontSize="7" fill="#3d3d3d" fontFamily="serif">
          POWER RESERVE
        </text>
      </g>

      {/* Date window at 6 o'clock */}
      <g>
        <rect x="85" y="145" width="30" height="18" fill="#ffffff" stroke="#3d3d3d" strokeWidth="1" />
        <text x="100" y="158" textAnchor="middle" fontSize="14" fill="#3d3d3d" fontFamily="sans-serif" fontWeight="bold">
          15
        </text>
      </g>

      {/* Brand text */}
      <text x="100" y="130" textAnchor="middle" fontSize="8" fill="#8b7355" fontFamily="serif" fontStyle="italic">
        Automatic
      </text>

      {/* Hour hand - classic style */}
      <g transform={`rotate(${hourAngle} 100 100)`}>
        <path
          d="M 95 100 L 97 52 L 100 48 L 103 52 L 105 100 Z"
          fill="#3d3d3d"
        />
      </g>

      {/* Minute hand - classic style */}
      <g transform={`rotate(${minuteAngle} 100 100)`}>
        <path
          d="M 96 100 L 98 30 L 100 26 L 102 30 L 104 100 Z"
          fill="#3d3d3d"
        />
      </g>

      {/* Second hand - blue steel */}
      <g transform={`rotate(${secondAngle} 100 100)`}>
        <line x1="100" y1="110" x2="100" y2="28" stroke="#2c5f8d" strokeWidth="1.5" />
        <circle cx="100" cy="28" r="2" fill="#2c5f8d" />
      </g>

      {/* Center cap */}
      <circle cx="100" cy="100" r="4" fill="#8b7355" />
      <circle cx="100" cy="100" r="2" fill="#3d3d3d" />
    </svg>
  );
};
