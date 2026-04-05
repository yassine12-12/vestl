import React from 'react';

interface FlipClockProps {
  centerX: number;
  centerY: number;
  radius: number;
  hours: number;
  minutes: number;
  seconds: number;
  color: string;
  size: number;
}

export const FlipClock: React.FC<FlipClockProps> = ({
  centerX,
  centerY,
  radius,
  hours,
  minutes,
  seconds,
  color,
  size,
}) => {
  return (
    <>
      <rect x={centerX - radius} y={centerY - radius} width={radius * 2} height={radius * 2} fill="#1a1a1a" rx="8" />
      {/* Flip clock style - airport departure board */}
      {[hours, minutes].map((value, idx) => {
        const x = centerX - radius * 0.4 + idx * radius * 0.85;
        const displayValue = String(value).padStart(2, '0');
        return (
          <g key={idx}>
            {/* Top half */}
            <rect x={x - 25} y={centerY - radius * 0.5} width="50" height="35" fill="#2a2a2a" stroke="#444" strokeWidth="1" rx="3" />
            <line x1={x - 25} y1={centerY - radius * 0.5 + 17.5} x2={x + 25} y2={centerY - radius * 0.5 + 17.5} stroke="#000" strokeWidth="0.5" />
            {/* Bottom half */}
            <rect x={x - 25} y={centerY - radius * 0.5 + 35} width="50" height="35" fill="#2a2a2a" stroke="#444" strokeWidth="1" rx="3" />
            {/* Number */}
            <text x={x} y={centerY - radius * 0.5 + 45} fill="#f0f0f0" fontSize={size > 100 ? "42" : "22"} fontFamily="Arial, sans-serif" fontWeight="bold" textAnchor="middle">{displayValue}</text>
          </g>
        );
      })}
      {/* Colon */}
      <text x={centerX} y={centerY - radius * 0.2} fill="#f0f0f0" fontSize={size > 100 ? "36" : "18"} fontWeight="bold" textAnchor="middle">:</text>
      {/* Seconds display */}
      <text x={centerX} y={centerY + radius * 0.6} fill={color} fontSize="14" textAnchor="middle">{String(seconds).padStart(2, '0')}</text>
    </>
  );
};
