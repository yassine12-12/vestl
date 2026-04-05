import React from 'react';

interface SkeletonClockProps {
  size: number;
  centerX: number;
  centerY: number;
  radius: number;
  hourAngle: number;
  minuteAngle: number;
  secondAngle: number;
  color: string;
}

export const SkeletonClock: React.FC<SkeletonClockProps> = ({
  size: _size,
  centerX,
  centerY,
  radius,
  hourAngle,
  minuteAngle,
  secondAngle,
  color,
}) => {
  const renderTourbillon = () => {
    const tourX = centerX + radius * 0.6;
    const tourY = centerY - radius * 0.3;
    const rotAngle = secondAngle;
    
    return (
      <g transform={`rotate(${rotAngle} ${tourX} ${tourY})`}>
        <circle cx={tourX} cy={tourY} r={18} fill="none" stroke={color} strokeWidth="0.5" opacity="0.4" />
        <circle cx={tourX} cy={tourY} r={15} fill="none" stroke={color} strokeWidth="0.5" opacity="0.4" />
        <line x1={tourX} y1={tourY - 12} x2={tourX} y2={tourY + 12} stroke={color} strokeWidth="0.5" />
        <line x1={tourX - 12} y1={tourY} x2={tourX + 12} y2={tourY} stroke={color} strokeWidth="0.5" />
        <circle cx={tourX} cy={tourY} r={3} fill={color} opacity="0.6" />
      </g>
    );
  };

  return (
    <>
      {/* No dial - see through */}
      <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke={color} strokeWidth="0.5" opacity="0.3" />
      {/* Visible gear */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30) * Math.PI / 180;
        return (
          <g key={i}>
            <line x1={centerX + 20 * Math.cos(angle)} y1={centerY + 20 * Math.sin(angle)} x2={centerX + 30 * Math.cos(angle)} y2={centerY + 30 * Math.sin(angle)} stroke={color} strokeWidth="2" opacity="0.4" />
          </g>
        );
      })}
      {renderTourbillon()}
      <line x1={centerX} y1={centerY} x2={centerX + (radius * 0.5) * Math.sin((hourAngle * Math.PI) / 180)} y2={centerY - (radius * 0.5) * Math.cos((hourAngle * Math.PI) / 180)} stroke={color} strokeWidth="2" opacity="0.7" />
      <line x1={centerX} y1={centerY} x2={centerX + (radius * 0.75) * Math.sin((minuteAngle * Math.PI) / 180)} y2={centerY - (radius * 0.75) * Math.cos((minuteAngle * Math.PI) / 180)} stroke={color} strokeWidth="1" opacity="0.7" />
    </>
  );
};
