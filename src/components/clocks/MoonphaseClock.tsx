import React from 'react';

interface MoonphaseClockProps {
  centerX: number;
  centerY: number;
  radius: number;
  hourAngle: number;
  minuteAngle: number;
  day: number;
  color: string;
}

export const MoonphaseClock: React.FC<MoonphaseClockProps> = ({
  centerX,
  centerY,
  radius,
  hourAngle,
  minuteAngle,
  day,
  color,
}) => {
  const moonPhase = ((day % 29.53) / 29.53) * 360;
  const moonX = centerX;
  const moonY = centerY + radius * 0.5;

  return (
    <>
      <circle cx={centerX} cy={centerY} r={radius} fill="#000033" stroke={color} strokeWidth="1" />
      {/* Minimal indices */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30 - 90) * Math.PI / 180;
        return <circle key={i} cx={centerX + (radius - 10) * Math.cos(angle)} cy={centerY + (radius - 10) * Math.sin(angle)} r="1.5" fill={color} />;
      })}
      {/* Large moon phase */}
      <circle cx={moonX} cy={moonY} r={20} fill="#1a1a1a" stroke={color} strokeWidth="1" />
      <circle 
        cx={moonX + Math.cos((moonPhase - 90) * Math.PI / 180) * 10} 
        cy={moonY + Math.sin((moonPhase - 90) * Math.PI / 180) * 10} 
        r={12} 
        fill={color} 
        opacity="0.8"
      />
      {/* Elegant leaf hands */}
      <path d={`M ${centerX},${centerY} Q ${centerX + 3},${centerY - (radius * 0.25)} ${centerX + (radius * 0.5) * Math.sin((hourAngle * Math.PI) / 180)},${centerY - (radius * 0.5) * Math.cos((hourAngle * Math.PI) / 180)}`} fill={color} />
      <path d={`M ${centerX},${centerY} Q ${centerX + 2},${centerY - (radius * 0.35)} ${centerX + (radius * 0.75) * Math.sin((minuteAngle * Math.PI) / 180)},${centerY - (radius * 0.75) * Math.cos((minuteAngle * Math.PI) / 180)}`} fill={color} />
    </>
  );
};
