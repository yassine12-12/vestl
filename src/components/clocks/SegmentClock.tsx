import React from 'react';

interface SegmentClockProps {
  centerX: number;
  centerY: number;
  radius: number;
  hours: number;
  minutes: number;
  seconds: number;
  size: number;
}

export const SegmentClock: React.FC<SegmentClockProps> = ({
  centerX,
  centerY,
  radius,
  hours,
  minutes,
  seconds,
  size,
}) => {
  return (
    <>
      <rect x={centerX - radius} y={centerY - radius} width={radius * 2} height={radius * 2} fill="#000" stroke="#333" strokeWidth="2" rx="8" />
      {/* 7-segment display style */}
      <text x={centerX} y={centerY + 15} fill="#ff0000" fontSize={size > 100 ? "56" : "28"} fontFamily="'Digital-7', 'Courier New', monospace" fontWeight="bold" textAnchor="middle" style={{ filter: 'drop-shadow(0 0 8px #ff0000)', letterSpacing: size > 100 ? '8px' : '4px' }}>
        {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </text>
    </>
  );
};
