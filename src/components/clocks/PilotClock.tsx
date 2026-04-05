import React from 'react';

interface PilotClockProps {
  centerX: number;
  centerY: number;
  radius: number;
  hourAngle: number;
  minuteAngle: number;
  color: string;
}

export const PilotClock: React.FC<PilotClockProps> = ({
  centerX,
  centerY,
  radius,
  hourAngle,
  minuteAngle,
  color,
}) => {
  return (
    <>
      <circle cx={centerX} cy={centerY} r={radius} fill="#0a0a0a" stroke={color} strokeWidth="2" />
      {/* Large triangle at 12 */}
      <polygon points={`${centerX},${centerY - radius + 8} ${centerX - 6},${centerY - radius + 18} ${centerX + 6},${centerY - radius + 18}`} fill={color} />
      {/* Big luminous markers */}
      {[1,2,4,5,7,8,10,11].map(i => {
        const angle = (i * 30 - 90) * Math.PI / 180;
        return (
          <rect key={i}
            x={centerX + (radius - 15) * Math.cos(angle) - 3}
            y={centerY + (radius - 15) * Math.sin(angle) - 6}
            width="6" height="12"
            fill={color}
            transform={`rotate(${i * 30} ${centerX + (radius - 15) * Math.cos(angle)} ${centerY + (radius - 15) * Math.sin(angle)})`}
          />
        );
      })}
      {/* Sword hands */}
      <polygon points={`${centerX},${centerY} ${centerX + 3},${centerY - 5} ${centerX + (radius * 0.5) * Math.sin((hourAngle * Math.PI) / 180)},${centerY - (radius * 0.5) * Math.cos((hourAngle * Math.PI) / 180)} ${centerX - 3},${centerY - 5}`} fill={color} />
      <polygon points={`${centerX},${centerY} ${centerX + 2},${centerY - 3} ${centerX + (radius * 0.75) * Math.sin((minuteAngle * Math.PI) / 180)},${centerY - (radius * 0.75) * Math.cos((minuteAngle * Math.PI) / 180)} ${centerX - 2},${centerY - 3}`} fill={color} />
      <circle cx={centerX} cy={centerY} r="5" fill={color} />
    </>
  );
};
