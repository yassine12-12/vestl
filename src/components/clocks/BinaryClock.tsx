import React from 'react';

interface BinaryClockProps {
  centerX: number;
  centerY: number;
  radius: number;
  hours: number;
  minutes: number;
  seconds: number;
  color: string;
  size: number;
}

export const BinaryClock: React.FC<BinaryClockProps> = ({
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
      <rect x={centerX - radius} y={centerY - radius} width={radius * 2} height={radius * 2} fill="#0a0a0a" stroke={color} strokeWidth="2" rx="5" />
      {/* Binary clock - 6 columns for HH:MM:SS */}
      {[hours, minutes, seconds].map((value, colGroup) => {
        const tens = Math.floor(value / 10);
        const ones = value % 10;
        return [tens, ones].map((digit, digitIdx) => {
          const col = colGroup * 2 + digitIdx;
          return [...Array(4)].map((_, row) => {
            const bit = (digit >> (3 - row)) & 1;
            const x = centerX - radius * 0.7 + col * (radius * 0.25);
            const y = centerY - radius * 0.5 + row * (radius * 0.3);
            return <circle key={`${col}-${row}`} cx={x} cy={y} r={size > 100 ? "8" : "4"} fill={bit ? color : 'rgba(255,255,255,0.1)'} />;
          });
        });
      })}
      {/* Labels */}
      <text x={centerX - radius * 0.6} y={centerY + radius * 0.7} fill={color} fontSize="10" textAnchor="middle">H</text>
      <text x={centerX} y={centerY + radius * 0.7} fill={color} fontSize="10" textAnchor="middle">M</text>
      <text x={centerX + radius * 0.6} y={centerY + radius * 0.7} fill={color} fontSize="10" textAnchor="middle">S</text>
    </>
  );
};
