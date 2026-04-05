import React from 'react';

interface RetrogradeClockProps {
  size: number;
  hourAngle: number;
  minuteAngle: number;
  secondAngle: number;
}

export const RetrogradeClock: React.FC<RetrogradeClockProps> = ({
  hourAngle,
  minuteAngle,
  secondAngle,
}) => {
  // Convert minute angle to retrograde arc (0-180 degrees)
  const retrogradeMinute = ((minuteAngle + 90) % 360) / 2;

  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs>
        <radialGradient id="retrograde-dial" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#e8e8f0" />
          <stop offset="100%" stopColor="#d0d0e0" />
        </radialGradient>
      </defs>

      {/* Silver dial */}
      <circle cx="100" cy="100" r="98" fill="url(#retrograde-dial)" />

      {/* Retrograde minute arc at top */}
      <g>
        <path
          d="M 30 80 A 70 70 0 0 1 170 80"
          fill="none"
          stroke="#666"
          strokeWidth="2"
        />
        
        {/* Minute markers on arc */}
        {[...Array(13)].map((_, i) => {
          const angle = 180 + (i * 15);
          const rad = (angle * Math.PI) / 180;
          const x1 = 100 + 70 * Math.cos(rad);
          const y1 = 100 + 70 * Math.sin(rad);
          const x2 = 100 + 65 * Math.cos(rad);
          const y2 = 100 + 65 * Math.sin(rad);
          
          return (
            <g key={i}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#666" strokeWidth="1.5" />
              {i % 3 === 0 && (
                <text
                  x={100 + 58 * Math.cos(rad)}
                  y={100 + 58 * Math.sin(rad) + 4}
                  textAnchor="middle"
                  fontSize="8"
                  fill="#333"
                  fontFamily="sans-serif"
                >
                  {i * 5}
                </text>
              )}
            </g>
          );
        })}
        
        {/* Retrograde minute hand (fan-shaped) */}
        <g transform={`rotate(${retrogradeMinute + 180} 100 100)`}>
          <path
            d="M 100 100 L 98 35 L 100 30 L 102 35 Z"
            fill="#cc3333"
          />
        </g>
        
        <text x="100" y="95" textAnchor="middle" fontSize="7" fill="#333" fontFamily="serif">
          RÉTROGRADE
        </text>
      </g>

      {/* Hour markers in center */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const r = 48;
        const x = 100 + r * Math.cos(angle);
        const y = 100 + r * Math.sin(angle);
        
        return (
          <circle key={i} cx={x} cy={y} r="2" fill="#666" />
        );
      })}

      {/* Hour hand - short central */}
      <g transform={`rotate(${hourAngle} 100 100)`}>
        <path
          d="M 97 100 L 99 60 L 100 57 L 101 60 L 103 100 Z"
          fill="#333"
        />
      </g>

      {/* Second hand - thin sweep */}
      <g transform={`rotate(${secondAngle} 100 100)`}>
        <line x1="100" y1="110" x2="100" y2="50" stroke="#4a90e2" strokeWidth="1" />
      </g>

      {/* Center cap */}
      <circle cx="100" cy="100" r="4" fill="#666" />
      <circle cx="100" cy="100" r="2" fill="#cc3333" />
    </svg>
  );
};
