import React from 'react';

interface GrandComplicationClockProps {
  centerX: number;
  centerY: number;
  radius: number;
  hourAngle: number;
  minuteAngle: number;
  secondAngle: number;
  day: number;
}

export const GrandComplicationClock: React.FC<GrandComplicationClockProps> = ({
  centerX,
  centerY,
  radius,
  hourAngle,
  minuteAngle,
  secondAngle: _secondAngle,
  day,
}) => {
  const renderMoonPhase = () => {
    const moonX = centerX;
    const moonY = centerY + radius * 0.5;
    const moonPhase = ((day % 29.53) / 29.53) * 360;
    return (
      <g>
        <circle cx={moonX} cy={moonY} r={15} fill="#1a1a1a" stroke="#d4af37" strokeWidth="1" />
        <circle 
          cx={moonX + Math.cos((moonPhase - 90) * Math.PI / 180) * 7} 
          cy={moonY + Math.sin((moonPhase - 90) * Math.PI / 180) * 7} 
          r={8} 
          fill="#d4af37" 
          opacity="0.8"
        />
      </g>
    );
  };

  const renderPowerReserve = () => {
    const prX = centerX - radius * 0.6;
    const prY = centerY - radius * 0.3;
    const arcRadius = 20;
    const startAngle = 210;
    const endAngle = 330;
    const currentAngle = startAngle + (endAngle - startAngle) * 0.75;
    
    return (
      <g>
        <path
          d={`M ${prX + arcRadius * Math.cos(startAngle * Math.PI / 180)} ${prY + arcRadius * Math.sin(startAngle * Math.PI / 180)} 
              A ${arcRadius} ${arcRadius} 0 0 1 ${prX + arcRadius * Math.cos(endAngle * Math.PI / 180)} ${prY + arcRadius * Math.sin(endAngle * Math.PI / 180)}`}
          fill="none"
          stroke="#d4af37"
          strokeWidth="1"
          opacity="0.3"
        />
        <line
          x1={prX}
          y1={prY}
          x2={prX + arcRadius * Math.cos(currentAngle * Math.PI / 180)}
          y2={prY + arcRadius * Math.sin(currentAngle * Math.PI / 180)}
          stroke="#d4af37"
          strokeWidth="1.5"
        />
      </g>
    );
  };

  const renderSubDials = () => {
    const subdialRadius = 15;
    const positions = [
      { x: centerX, y: centerY - radius * 0.5 },
      { x: centerX - radius * 0.5, y: centerY + radius * 0.4 },
      { x: centerX + radius * 0.5, y: centerY + radius * 0.4 },
    ];

    return positions.map((pos, i) => (
      <g key={i}>
        <circle cx={pos.x} cy={pos.y} r={subdialRadius} fill="none" stroke="#d4af37" strokeWidth="0.5" opacity="0.3" />
        {[...Array(12)].map((_, j) => {
          const angle = (j * 30 - 90) * Math.PI / 180;
          return (
            <line
              key={j}
              x1={pos.x + (subdialRadius - 2) * Math.cos(angle)}
              y1={pos.y + (subdialRadius - 2) * Math.sin(angle)}
              x2={pos.x + subdialRadius * Math.cos(angle)}
              y2={pos.y + subdialRadius * Math.sin(angle)}
              stroke="#d4af37"
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
      <circle cx={centerX} cy={centerY} r={radius} fill="#1a1a2e" stroke="#d4af37" strokeWidth="2" />
      {/* Roman numerals */}
      {['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'].map((num, i) => {
        const angle = (i * 30 - 90) * Math.PI / 180;
        return (
          <text key={i}
            x={centerX + (radius - 20) * Math.cos(angle)}
            y={centerY + (radius - 20) * Math.sin(angle) + 5}
            fill="#d4af37"
            fontSize="12"
            fontFamily="serif"
            textAnchor="middle"
          >{num}</text>
        );
      })}
      {renderMoonPhase()}
      {renderPowerReserve()}
      {renderSubDials()}
      {/* Dauphine hands */}
      <polygon points={`${centerX},${centerY} ${centerX + 3},${centerY - 5} ${centerX + (radius * 0.5) * Math.sin((hourAngle * Math.PI) / 180)},${centerY - (radius * 0.5) * Math.cos((hourAngle * Math.PI) / 180)} ${centerX - 3},${centerY - 5}`} fill="#d4af37" />
      <polygon points={`${centerX},${centerY} ${centerX + 2},${centerY - 3} ${centerX + (radius * 0.75) * Math.sin((minuteAngle * Math.PI) / 180)},${centerY - (radius * 0.75) * Math.cos((minuteAngle * Math.PI) / 180)} ${centerX - 2},${centerY - 3}`} fill="#d4af37" />
    </>
  );
};
