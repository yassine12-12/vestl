import React, { useEffect, useState } from 'react';

interface AnalogClockProps {
  size?: number;
  color?: string;
  backgroundColor?: string;
  showNumbers?: boolean;
  style?: 'classic' | 'modern' | 'minimal' | 'luxury' | 'california' | 'contour' | 'chronograph' | 'utility';
  showSeconds?: boolean;
}

export const AnalogClock: React.FC<AnalogClockProps> = ({
  size = 300,
  color = '#ffffff',
  backgroundColor = 'transparent',
  showNumbers = true,
  style = 'classic',
  showSeconds = true
}) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourAngle = (hours * 30) + (minutes * 0.5);
  const minuteAngle = minutes * 6;
  const secondAngle = seconds * 6;

  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 20;

  // Generate hour markers based on style
  const markerCount = style === 'california' ? 12 : style === 'chronograph' ? 60 : 12;
  const hourMarkers = Array.from({ length: markerCount }, (_, i) => {
    const angle = (i * (360 / markerCount) - 90) * (Math.PI / 180);
    const isHourMark = i % (markerCount / 12) === 0;
    const markerLength = style === 'luxury' ? 15 : style === 'chronograph' && !isHourMark ? 5 : 10;
    const x1 = centerX + (radius - markerLength) * Math.cos(angle);
    const y1 = centerY + (radius - markerLength) * Math.sin(angle);
    const x2 = centerX + radius * Math.cos(angle);
    const y2 = centerY + radius * Math.sin(angle);
    return { x1, y1, x2, y2, number: isHourMark ? (i / (markerCount / 12) === 0 ? 12 : i / (markerCount / 12)) : null };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Clock Face */}
      <circle
        cx={centerX}
        cy={centerY}
        r={radius + 10}
        fill={backgroundColor}
        stroke={color}
        strokeWidth={style === 'luxury' ? 3 : style === 'minimal' ? 1 : 2}
        opacity={style === 'minimal' ? 0.3 : 0.2}
      />

      {/* Hour Markers */}
      {hourMarkers.map((marker, i) => (
        <g key={i}>
          {style === 'luxury' && (i === 0 || i === 3 || i === 6 || i === 9) ? (
            // Luxury style with diamond markers at 12, 3, 6, 9
            <circle
              cx={marker.x2}
              cy={marker.y2}
              r={4}
              fill={color}
            />
          ) : (
            <line
              x1={marker.x1}
              y1={marker.y1}
              x2={marker.x2}
              y2={marker.y2}
              stroke={color}
              strokeWidth={(i % 3 === 0) ? (style === 'luxury' ? 3 : 2) : 1}
              opacity={(i % 3 === 0) ? 1 : 0.5}
            />
          )}
          
          {/* Numbers */}
          {showNumbers && style !== 'minimal' && (i % 3 === 0 || style === 'classic') && (
            <text
              x={centerX + (radius - (style === 'luxury' ? 35 : 25)) * Math.cos((i * 30 - 90) * (Math.PI / 180))}
              y={centerY + (radius - (style === 'luxury' ? 35 : 25)) * Math.sin((i * 30 - 90) * (Math.PI / 180))}
              fill={color}
              fontSize={style === 'luxury' ? 18 : 16}
              fontWeight={style === 'luxury' ? 'bold' : 'normal'}
              fontFamily={style === 'luxury' ? 'serif' : 'sans-serif'}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {marker.number}
            </text>
          )}
        </g>
      ))}

      {/* Hour Hand */}
      <line
        x1={centerX}
        y1={centerY}
        x2={centerX + (radius * 0.5) * Math.sin((hourAngle * Math.PI) / 180)}
        y2={centerY - (radius * 0.5) * Math.cos((hourAngle * Math.PI) / 180)}
        stroke={color}
        strokeWidth={style === 'minimal' ? 4 : style === 'luxury' ? 6 : 5}
        strokeLinecap="round"
      />

      {/* Minute Hand */}
      <line
        x1={centerX}
        y1={centerY}
        x2={centerX + (radius * 0.75) * Math.sin((minuteAngle * Math.PI) / 180)}
        y2={centerY - (radius * 0.75) * Math.cos((minuteAngle * Math.PI) / 180)}
        stroke={color}
        strokeWidth={style === 'minimal' ? 3 : style === 'luxury' ? 4 : 3}
        strokeLinecap="round"
      />

      {/* Second Hand */}
      {showSeconds && style !== 'luxury' && (
        <line
          x1={centerX}
          y1={centerY}
          x2={centerX + (radius * 0.85) * Math.sin((secondAngle * Math.PI) / 180)}
          y2={centerY - (radius * 0.85) * Math.cos((secondAngle * Math.PI) / 180)}
          stroke={style === 'modern' || style === 'chronograph' ? '#ff0000' : style === 'utility' ? '#ff9500' : color}
          strokeWidth={style === 'chronograph' ? 2 : 1}
          strokeLinecap="round"
          opacity={0.8}
        />
      )}

      {/* Center Dot */}
      <circle
        cx={centerX}
        cy={centerY}
        r={style === 'luxury' ? 8 : 6}
        fill={color}
      />
      {style === 'luxury' && (
        <circle
          cx={centerX}
          cy={centerY}
          r={4}
          fill={backgroundColor || '#000'}
        />
      )}
    </svg>
  );
};
