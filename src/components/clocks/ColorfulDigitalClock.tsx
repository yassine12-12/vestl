import React from 'react';

interface ColorfulDigitalClockProps {
  centerX: number;
  centerY: number;
  radius: number;
  time: Date;
  size: number;
}

export const ColorfulDigitalClock: React.FC<ColorfulDigitalClockProps> = ({
  centerX,
  centerY,
  radius,
  time,
  size,
}) => {
  return (
    <>
      {/* Colorful gradient background */}
      <defs>
        <linearGradient id="colorfulGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#ff0080', stopOpacity: 1 }} />
          <stop offset="25%" style={{ stopColor: '#7928ca', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#ff0080', stopOpacity: 1 }} />
          <stop offset="75%" style={{ stopColor: '#00d4ff', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#7928ca', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <rect x={centerX - radius} y={centerY - radius} width={radius * 2} height={radius * 2} fill="url(#colorfulGrad)" rx="15" />
      {/* Digital time display with pixel effect */}
      <text x={centerX} y={centerY + 10} fill="#fff" fontSize={size > 100 ? "48" : "24"} fontFamily="'Courier New', monospace" fontWeight="bold" textAnchor="middle" style={{ filter: 'drop-shadow(0 0 10px #fff)' }}>
        {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
      </text>
    </>
  );
};
