import React from 'react';

interface BauhausClockProps {
  size: number;
  centerX: number;
  centerY: number;
  radius: number;
  hourAngle: number;
  minuteAngle: number;
  color: string;
}

export const BauhausClock: React.FC<BauhausClockProps> = ({
  size: _size,
  centerX,
  centerY,
  radius,
  hourAngle,
  minuteAngle,
  color: _color,
}) => {
  return (
    <>
      <circle cx={centerX} cy={centerY} r={radius} fill="#fafafa" stroke="#000" strokeWidth="2" />
      {/* Bauhaus markers - simple lines */}
      {[12, 3, 6, 9].map(i => {
        const angle = (i * 30 - 90) * Math.PI / 180;
        return (
          <line key={i}
            x1={centerX + (radius - 15) * Math.cos(angle)}
            y1={centerY + (radius - 15) * Math.sin(angle)}
            x2={centerX + radius * Math.cos(angle)}
            y2={centerY + radius * Math.sin(angle)}
            stroke="#000" strokeWidth="3"
          />
        );
      })}
      {/* Thin stick hands */}
      <line x1={centerX} y1={centerY} x2={centerX + (radius * 0.5) * Math.sin((hourAngle * Math.PI) / 180)} y2={centerY - (radius * 0.5) * Math.cos((hourAngle * Math.PI) / 180)} stroke="#000" strokeWidth="2.5" />
      <line x1={centerX} y1={centerY} x2={centerX + (radius * 0.75) * Math.sin((minuteAngle * Math.PI) / 180)} y2={centerY - (radius * 0.75) * Math.cos((minuteAngle * Math.PI) / 180)} stroke="#000" strokeWidth="1.5" />
      <circle cx={centerX} cy={centerY} r="4" fill="#000" />
    </>
  );
};
