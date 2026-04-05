import React from 'react';

interface DiverClockProps {
  centerX: number;
  centerY: number;
  radius: number;
  hourAngle: number;
  minuteAngle: number;
  color: string;
}

export const DiverClock: React.FC<DiverClockProps> = ({
  centerX,
  centerY,
  radius,
  hourAngle,
  minuteAngle,
  color,
}) => {
  return (
    <>
      {/* Rotating bezel */}
      <circle cx={centerX} cy={centerY} r={radius + 10} fill="none" stroke={color} strokeWidth="8" opacity="0.6" />
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30 - 90) * Math.PI / 180;
        return <circle key={i} cx={centerX + (radius + 10) * Math.cos(angle)} cy={centerY + (radius + 10) * Math.sin(angle)} r="2" fill={color} />;
      })}
      <circle cx={centerX} cy={centerY} r={radius} fill="#001a33" stroke={color} strokeWidth="1" />
      {/* Circle markers */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30 - 90) * Math.PI / 180;
        return (
          <circle key={i}
            cx={centerX + (radius - 15) * Math.cos(angle)}
            cy={centerY + (radius - 15) * Math.sin(angle)}
            r="4"
            fill={color}
            stroke="#000"
            strokeWidth="0.5"
          />
        );
      })}
      {/* Mercedes hands */}
      <line x1={centerX} y1={centerY} x2={centerX + (radius * 0.5) * Math.sin((hourAngle * Math.PI) / 180)} y2={centerY - (radius * 0.5) * Math.cos((hourAngle * Math.PI) / 180)} stroke={color} strokeWidth="5" strokeLinecap="round" />
      <circle cx={centerX + (radius * 0.5) * Math.sin((hourAngle * Math.PI) / 180)} cy={centerY - (radius * 0.5) * Math.cos((hourAngle * Math.PI) / 180)} r="6" fill="none" stroke={color} strokeWidth="2" />
      <line x1={centerX} y1={centerY} x2={centerX + (radius * 0.75) * Math.sin((minuteAngle * Math.PI) / 180)} y2={centerY - (radius * 0.75) * Math.cos((minuteAngle * Math.PI) / 180)} stroke={color} strokeWidth="3" />
    </>
  );
};
