import React from 'react';

interface RacingClockProps {
  centerX: number;
  centerY: number;
  radius: number;
  hourAngle: number;
  minuteAngle: number;
  secondAngle: number;
  color: string;
}

export const RacingClock: React.FC<RacingClockProps> = ({
  centerX,
  centerY,
  radius,
  hourAngle,
  minuteAngle,
  secondAngle,
  color,
}) => {
  const renderSubDials = () => {
    const subdialRadius = 15;
    const positions = [
      { x: centerX, y: centerY - radius * 0.5 },
      { x: centerX - radius * 0.5, y: centerY + radius * 0.4 },
      { x: centerX + radius * 0.5, y: centerY + radius * 0.4 },
    ];

    return positions.map((pos, i) => (
      <g key={i}>
        <circle cx={pos.x} cy={pos.y} r={subdialRadius} fill="none" stroke={color} strokeWidth="0.5" opacity="0.3" />
        {[...Array(12)].map((_, j) => {
          const angle = (j * 30 - 90) * Math.PI / 180;
          return (
            <line
              key={j}
              x1={pos.x + (subdialRadius - 2) * Math.cos(angle)}
              y1={pos.y + (subdialRadius - 2) * Math.sin(angle)}
              x2={pos.x + subdialRadius * Math.cos(angle)}
              y2={pos.y + subdialRadius * Math.sin(angle)}
              stroke={color}
              strokeWidth="0.3"
              opacity="0.4"
            />
          );
        })}
      </g>
    ));
  };

  return (
    <>
      <circle cx={centerX} cy={centerY} r={radius} fill="#1a1a1a" stroke="#ff0000" strokeWidth="2" />
      {/* Tachymeter scale */}
      {[...Array(60)].map((_, i) => {
        const angle = (i * 6 - 90) * Math.PI / 180;
        return (
          <line key={i}
            x1={centerX + (radius + 5) * Math.cos(angle)}
            y1={centerY + (radius + 5) * Math.sin(angle)}
            x2={centerX + (radius + 10) * Math.cos(angle)}
            y2={centerY + (radius + 10) * Math.sin(angle)}
            stroke="#ff0000"
            strokeWidth={i % 5 === 0 ? "1" : "0.3"}
          />
        );
      })}
      {renderSubDials()}
      {/* Sport hands */}
      <line x1={centerX} y1={centerY} x2={centerX + (radius * 0.5) * Math.sin((hourAngle * Math.PI) / 180)} y2={centerY - (radius * 0.5) * Math.cos((hourAngle * Math.PI) / 180)} stroke={color} strokeWidth="4" />
      <line x1={centerX} y1={centerY} x2={centerX + (radius * 0.75) * Math.sin((minuteAngle * Math.PI) / 180)} y2={centerY - (radius * 0.75) * Math.cos((minuteAngle * Math.PI) / 180)} stroke={color} strokeWidth="2.5" />
      <line x1={centerX} y1={centerY} x2={centerX + (radius * 0.85) * Math.sin((secondAngle * Math.PI) / 180)} y2={centerY - (radius * 0.85) * Math.cos((secondAngle * Math.PI) / 180)} stroke="#ff0000" strokeWidth="1" />
    </>
  );
};
