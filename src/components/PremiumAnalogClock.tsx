import React, { useEffect, useState } from 'react';

interface PremiumAnalogClockProps {
  size?: number;
  color?: string;
  backgroundColor?: string;
  style: string;
  showSeconds?: boolean;
  showComplications?: boolean;
}

export const PremiumAnalogClock: React.FC<PremiumAnalogClockProps> = ({
  size = 300,
  color = '#ffffff',
  backgroundColor = 'transparent',
  style,
  showSeconds = true,
  showComplications = true,
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
  const day = time.getDate();
  const month = time.getMonth();
  const year = time.getFullYear();

  const hourAngle = (hours * 30) + (minutes * 0.5);
  const minuteAngle = minutes * 6;
  const secondAngle = seconds * 6;

  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 30;

  // Moon phase calculation (simplified)
  const moonPhase = ((year - 2000) * 12.3685 + month + day / 30) % 29.53;
  const moonAngle = (moonPhase / 29.53) * 360;

  // Power reserve (simulated - would be 40 hours for mechanical watch)
  const powerReserve = 75; // percentage

  const renderMoonPhase = () => {
    if (!showComplications) return null;
    const moonX = centerX;
    const moonY = centerY + radius * 0.5;
    return (
      <g>
        <circle cx={moonX} cy={moonY} r={15} fill="#1a1a1a" stroke={color} strokeWidth="1" />
        <circle 
          cx={moonX + Math.cos((moonAngle - 90) * Math.PI / 180) * 7} 
          cy={moonY + Math.sin((moonAngle - 90) * Math.PI / 180) * 7} 
          r={8} 
          fill={color} 
          opacity="0.8"
        />
        <text x={moonX} y={moonY + 25} fill={color} fontSize="8" textAnchor="middle" opacity="0.6">
          MOON
        </text>
      </g>
    );
  };

  const renderPowerReserve = () => {
    if (!showComplications) return null;
    const prX = centerX - radius * 0.6;
    const prY = centerY - radius * 0.3;
    const arcRadius = 20;
    const startAngle = 210;
    const endAngle = 330;
    const currentAngle = startAngle + (endAngle - startAngle) * (powerReserve / 100);
    
    return (
      <g>
        <path
          d={`M ${prX + arcRadius * Math.cos(startAngle * Math.PI / 180)} ${prY + arcRadius * Math.sin(startAngle * Math.PI / 180)} 
              A ${arcRadius} ${arcRadius} 0 0 1 ${prX + arcRadius * Math.cos(endAngle * Math.PI / 180)} ${prY + arcRadius * Math.sin(endAngle * Math.PI / 180)}`}
          fill="none"
          stroke={color}
          strokeWidth="1"
          opacity="0.3"
        />
        <line
          x1={prX}
          y1={prY}
          x2={prX + arcRadius * Math.cos(currentAngle * Math.PI / 180)}
          y2={prY + arcRadius * Math.sin(currentAngle * Math.PI / 180)}
          stroke={color}
          strokeWidth="1.5"
        />
        <text x={prX} y={prY + 30} fill={color} fontSize="7" textAnchor="middle" opacity="0.6">
          POWER RESERVE
        </text>
      </g>
    );
  };

  const renderTourbillon = () => {
    if (!showComplications) return null;
    const tourX = centerX + radius * 0.6;
    const tourY = centerY - radius * 0.3;
    const rotAngle = (time.getSeconds() * 6);
    
    return (
      <g transform={`rotate(${rotAngle} ${tourX} ${tourY})`}>
        <circle cx={tourX} cy={tourY} r={18} fill="none" stroke={color} strokeWidth="0.5" opacity="0.4" />
        <circle cx={tourX} cy={tourY} r={15} fill="none" stroke={color} strokeWidth="0.5" opacity="0.4" />
        <line x1={tourX} y1={tourY - 12} x2={tourX} y2={tourY + 12} stroke={color} strokeWidth="0.5" />
        <line x1={tourX - 12} y1={tourY} x2={tourX + 12} y2={tourY} stroke={color} strokeWidth="0.5" />
        <circle cx={tourX} cy={tourY} r={3} fill={color} opacity="0.6" />
        <text x={tourX} y={tourY + 30} fill={color} fontSize="7" textAnchor="middle" opacity="0.6">
          TOURBILLON
        </text>
      </g>
    );
  };

  const renderSubDials = () => {
    // Three subdials for chronograph
    const subdialRadius = 15;
    const positions = [
      { x: centerX, y: centerY - radius * 0.5, label: '1/10 SEC' },
      { x: centerX - radius * 0.5, y: centerY + radius * 0.4, label: 'MINUTES' },
      { x: centerX + radius * 0.5, y: centerY + radius * 0.4, label: 'HOURS' },
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
        <text x={pos.x} y={pos.y + subdialRadius + 10} fill={color} fontSize="6" textAnchor="middle" opacity="0.5">
          {pos.label}
        </text>
      </g>
    ));
  };

  const getStyleConfig = () => {
    const configs: Record<string, any> = {
      'grand-complication': {
        dialColor: '#1a1a2e',
        bezelStyle: 'fluted',
        numeralStyle: 'roman-gold',
        handStyle: 'dauphine-gold',
        complications: ['moon', 'power', 'subdials'],
        luxuryLevel: 10,
      },
      'perpetual-calendar': {
        dialColor: '#f5f5dc',
        bezelStyle: 'smooth',
        numeralStyle: 'roman-black',
        handStyle: 'blued-steel',
        complications: ['date', 'month', 'day'],
        classicElegance: true,
      },
      'moonphase': {
        dialColor: '#000033',
        bezelStyle: 'thin',
        numeralStyle: 'applied-indices',
        handStyle: 'leaf',
        complications: ['moon-large'],
        celestial: true,
      },
      'tourbillon': {
        dialColor: 'transparent',
        bezelStyle: 'exhibition',
        numeralStyle: 'minimal-applied',
        handStyle: 'skeleton-breguet',
        complications: ['tourbillon-visible'],
        mechanical: true,
      },
      'worldtime': {
        dialColor: '#2c3e50',
        bezelStyle: 'city-ring',
        numeralStyle: '24-hour',
        handStyle: 'gmt-arrow',
        complications: ['timezone-cities'],
        traveler: true,
      },
      'power-reserve': {
        dialColor: '#ffffff',
        bezelStyle: 'polished',
        numeralStyle: 'arabic-applied',
        handStyle: 'feuille',
        complications: ['power-arc'],
        technical: true,
      },
      'bauhaus': {
        dialColor: '#f8f8f8',
        bezelStyle: 'none',
        numeralStyle: 'bauhaus-sans',
        handStyle: 'stick-black',
        minimal: true,
        german: true,
      },
      'dress-elegant': {
        dialColor: '#faf0e6',
        bezelStyle: 'ultra-thin',
        numeralStyle: 'roman-slim',
        handStyle: 'dauphine-slim',
        refined: true,
        subtle: true,
      },
      'skeleton': {
        dialColor: 'none',
        bezelStyle: 'see-through',
        numeralStyle: 'bridge-mounted',
        handStyle: 'openwork',
        mechanical: true,
        transparent: true,
      },
      'art-deco': {
        dialColor: '#2a2a2a',
        bezelStyle: 'geometric',
        numeralStyle: 'deco-font',
        handStyle: 'cathedral',
        vintage: true,
        twenties: true,
      },
      'pilot': {
        dialColor: '#0a0a0a',
        bezelStyle: 'bidirectional',
        numeralStyle: 'large-lume',
        handStyle: 'sword-lume',
        aviation: true,
        legible: true,
      },
      'diver': {
        dialColor: '#001a33',
        bezelStyle: 'unidirectional',
        numeralStyle: 'applied-lume',
        handStyle: 'mercedes',
        waterproof: true,
        robust: true,
      },
      'racing': {
        dialColor: '#1a1a1a',
        bezelStyle: 'tachymeter',
        numeralStyle: 'racing-stripes',
        handStyle: 'alpha-racing',
        sporty: true,
        chronograph: true,
      },
      'military': {
        dialColor: '#2d2d2d',
        bezelStyle: 'tactical',
        numeralStyle: 'military-stencil',
        handStyle: 'sword-tritium',
        tactical: true,
        nato: true,
      },
      'asymmetric': {
        dialColor: '#34495e',
        bezelStyle: 'offset',
        numeralStyle: 'unconventional',
        handStyle: 'modern-asymmetric',
        unique: true,
        avantgarde: true,
      },
      'retrograde': {
        dialColor: '#ecf0f1',
        bezelStyle: 'double',
        numeralStyle: 'arc-scale',
        handStyle: 'pointer-retrograde',
        innovative: true,
        sweeping: true,
      },
      'digital-hybrid': {
        dialColor: '#16213e',
        bezelStyle: 'tech',
        numeralStyle: 'lcd-analog-mix',
        handStyle: 'modern-tech',
        hybrid: true,
        futuristic: true,
      },
      'jumping-hour': {
        dialColor: '#f4f4f4',
        bezelStyle: 'clean',
        numeralStyle: 'window-display',
        handStyle: 'minute-only',
        jumping: true,
        unique: true,
      },
      'railroad': {
        dialColor: '#fffef0',
        bezelStyle: 'railroad-standard',
        numeralStyle: 'bold-arabic',
        handStyle: 'spade-blued',
        vintage: true,
        precision: true,
      },
      'pocket-watch': {
        dialColor: '#fefefe',
        bezelStyle: 'hunter-case',
        numeralStyle: 'roman-enamel',
        handStyle: 'breguet-classic',
        classic: true,
        subseconds: true,
      },
      'marine-chronometer': {
        dialColor: '#e8e8e8',
        bezelStyle: 'gimbal',
        numeralStyle: 'nautical',
        handStyle: 'marine-blued',
        maritime: true,
        accurate: true,
      },
      'observatoire': {
        dialColor: '#f5f5f5',
        bezelStyle: 'precision',
        numeralStyle: 'railway-minute',
        handStyle: 'regulator-three',
        scientific: true,
        observatory: true,
      },
    };
    return configs[style] || {};
  };

  const config = getStyleConfig();

  // Unique render function for each style
  const renderWatch = () => {
    // Common dial background
    const dialBg = config.dialColor !== 'none' && config.dialColor !== 'transparent' ? (
      <circle cx={centerX} cy={centerY} r={radius} fill={config.dialColor || backgroundColor} stroke={color} strokeWidth="1" opacity="0.9" />
    ) : null;

    switch(style) {
      case 'bauhaus':
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

      case 'skeleton':
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

      case 'pilot':
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

      case 'diver':
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

      case 'moonphase':
        return (
          <>
            <circle cx={centerX} cy={centerY} r={radius} fill="#000033" stroke={color} strokeWidth="1" />
            {/* Minimal indices */}
            {[...Array(12)].map((_, i) => {
              const angle = (i * 30 - 90) * Math.PI / 180;
              return <circle key={i} cx={centerX + (radius - 10) * Math.cos(angle)} cy={centerY + (radius - 10) * Math.sin(angle)} r="1.5" fill={color} />;
            })}
            {/* Large moon phase */}
            {renderMoonPhase()}
            {/* Elegant leaf hands */}
            <path d={`M ${centerX},${centerY} Q ${centerX + 3},${centerY - (radius * 0.25)} ${centerX + (radius * 0.5) * Math.sin((hourAngle * Math.PI) / 180)},${centerY - (radius * 0.5) * Math.cos((hourAngle * Math.PI) / 180)}`} fill={color} />
            <path d={`M ${centerX},${centerY} Q ${centerX + 2},${centerY - (radius * 0.35)} ${centerX + (radius * 0.75) * Math.sin((minuteAngle * Math.PI) / 180)},${centerY - (radius * 0.75) * Math.cos((minuteAngle * Math.PI) / 180)}`} fill={color} />
          </>
        );

      case 'racing':
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

      case 'art-deco':
        return (
          <>
            <circle cx={centerX} cy={centerY} r={radius} fill="#2a2a2a" stroke="#d4af37" strokeWidth="2" />
            {/* Art Deco stepped markers */}
            {[12, 3, 6, 9].map(i => {
              const angle = (i * 30 - 90) * Math.PI / 180;
              return (
                <g key={i}>
                  <rect
                    x={centerX + (radius - 20) * Math.cos(angle) - 4}
                    y={centerY + (radius - 20) * Math.sin(angle) - 8}
                    width="8"
                    height="16"
                    fill="#d4af37"
                    transform={`rotate(${i * 30} ${centerX + (radius - 20) * Math.cos(angle)} ${centerY + (radius - 20) * Math.sin(angle)})`}
                  />
                </g>
              );
            })}
            {/* Cathedral hands */}
            <polygon points={`${centerX},${centerY} ${centerX + 4},${centerY - 8} ${centerX + (radius * 0.5) * Math.sin((hourAngle * Math.PI) / 180)},${centerY - (radius * 0.5) * Math.cos((hourAngle * Math.PI) / 180)} ${centerX - 4},${centerY - 8}`} fill="#d4af37" />
            <polygon points={`${centerX},${centerY} ${centerX + 3},${centerY - 6} ${centerX + (radius * 0.75) * Math.sin((minuteAngle * Math.PI) / 180)},${centerY - (radius * 0.75) * Math.cos((minuteAngle * Math.PI) / 180)} ${centerX - 3},${centerY - 6}`} fill="#d4af37" />
          </>
        );

      case 'grand-complication':
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

      case 'perpetual-calendar':
        return (
          <>
            <circle cx={centerX} cy={centerY} r={radius} fill="#f5f5dc" stroke="#8b4513" strokeWidth="1.5" />
            {/* Elegant Roman numerals */}
            {['XII', 'III', 'VI', 'IX'].map((num, i) => {
              const angle = ([0, 3, 6, 9][i] * 30 - 90) * Math.PI / 180;
              return (
                <text key={i} x={centerX + (radius - 20) * Math.cos(angle)} y={centerY + (radius - 20) * Math.sin(angle) + 5} fill="#4a4a4a" fontSize="14" fontFamily="Georgia, serif" textAnchor="middle">{num}</text>
              );
            })}
            {/* Date windows */}
            <rect x={centerX + 30} y={centerY - 8} width="16" height="16" fill="#fff" stroke="#4a4a4a" strokeWidth="0.5" />
            <text x={centerX + 38} y={centerY + 4} fill="#000" fontSize="10" textAnchor="middle" fontWeight="bold">{day}</text>
            {/* Blued steel hands */}
            <line x1={centerX} y1={centerY} x2={centerX + (radius * 0.5) * Math.sin((hourAngle * Math.PI) / 180)} y2={centerY - (radius * 0.5) * Math.cos((hourAngle * Math.PI) / 180)} stroke="#0047ab" strokeWidth="3" />
            <line x1={centerX} y1={centerY} x2={centerX + (radius * 0.75) * Math.sin((minuteAngle * Math.PI) / 180)} y2={centerY - (radius * 0.75) * Math.cos((minuteAngle * Math.PI) / 180)} stroke="#0047ab" strokeWidth="2" />
          </>
        );

      case 'tourbillon':
        return (
          <>
            <circle cx={centerX} cy={centerY} r={radius} fill="rgba(20,20,20,0.3)" stroke={color} strokeWidth="1" opacity="0.8" />
            {/* Bridges visible */}
            <rect x={centerX - 40} y={centerY - 3} width="80" height="6" fill="none" stroke={color} strokeWidth="1" opacity="0.4" />
            <rect x={centerX - 3} y={centerY - 40} width="6" height="80" fill="none" stroke={color} strokeWidth="1" opacity="0.4" />
            {/* Applied indices */}
            {[12, 3, 6, 9].map(i => {
              const angle = (i * 30 - 90) * Math.PI / 180;
              return <rect key={i} x={centerX + (radius - 12) * Math.cos(angle) - 1.5} y={centerY + (radius - 12) * Math.sin(angle) - 4} width="3" height="8" fill={color} transform={`rotate(${i * 30} ${centerX + (radius - 12) * Math.cos(angle)} ${centerY + (radius - 12) * Math.sin(angle)})`} />;
            })}
            {renderTourbillon()}
            {/* Breguet hands */}
            <path d={`M ${centerX},${centerY} L ${centerX + 2},${centerY - 5} L ${centerX + (radius * 0.5) * Math.sin((hourAngle * Math.PI) / 180)},${centerY - (radius * 0.5) * Math.cos((hourAngle * Math.PI) / 180) + 8} L ${centerX + (radius * 0.5) * Math.sin((hourAngle * Math.PI) / 180)},${centerY - (radius * 0.5) * Math.cos((hourAngle * Math.PI) / 180)} L ${centerX - 2},${centerY - 5} Z`} fill={color} stroke="none" />
            <circle cx={centerX + (radius * 0.5) * Math.sin((hourAngle * Math.PI) / 180)} cy={centerY - (radius * 0.5) * Math.cos((hourAngle * Math.PI) / 180) + 5} r="3" fill="none" stroke={color} strokeWidth="0.5" />
          </>
        );

      case 'worldtime':
        return (
          <>
            <circle cx={centerX} cy={centerY} r={radius} fill="#2c3e50" stroke={color} strokeWidth="2" />
            {/* City ring */}
            {['NYC', 'LON', 'PAR', 'DXB', 'TOK', 'SYD'].map((city, i) => {
              const angle = (i * 60 - 90) * Math.PI / 180;
              return <text key={i} x={centerX + (radius - 15) * Math.cos(angle)} y={centerY + (radius - 15) * Math.sin(angle) + 3} fill={color} fontSize="8" textAnchor="middle">{city}</text>;
            })}
            {/* 24-hour ring */}
            <circle cx={centerX} cy={centerY} r={radius * 0.6} fill="none" stroke={color} strokeWidth="0.5" opacity="0.5" />
            {[...Array(24)].map((_, i) => {
              const angle = (i * 15 - 90) * Math.PI / 180;
              return <text key={i} x={centerX + (radius * 0.6) * Math.cos(angle)} y={centerY + (radius * 0.6) * Math.sin(angle) + 3} fill={color} fontSize="7" textAnchor="middle">{i}</text>;
            })}
            {/* GMT arrow hand */}
            <polygon points={`${centerX},${centerY} ${centerX + 2},${centerY - 10} ${centerX + (radius * 0.8) * Math.sin((hourAngle * Math.PI) / 180)},${centerY - (radius * 0.8) * Math.cos((hourAngle * Math.PI) / 180)} ${centerX - 2},${centerY - 10}`} fill="#ff4444" />
            <line x1={centerX} y1={centerY} x2={centerX + (radius * 0.7) * Math.sin((minuteAngle * Math.PI) / 180)} y2={centerY - (radius * 0.7) * Math.cos((minuteAngle * Math.PI) / 180)} stroke={color} strokeWidth="2" />
          </>
        );

      case 'power-reserve':
        return (
          <>
            <circle cx={centerX} cy={centerY} r={radius} fill="#ffffff" stroke="#333" strokeWidth="1.5" />
            {/* Applied Arabic numerals */}
            {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, i) => {
              const angle = (i * 30 - 90) * Math.PI / 180;
              return <text key={i} x={centerX + (radius - 18) * Math.cos(angle)} y={centerY + (radius - 18) * Math.sin(angle) + 4} fill="#000" fontSize="11" fontWeight="500" textAnchor="middle">{num === 0 ? 12 : num}</text>;
            })}
            {renderPowerReserve()}
            {/* Feuille hands */}
            <path d={`M ${centerX},${centerY} Q ${centerX + 4},${centerY - (radius * 0.2)} ${centerX + (radius * 0.5) * Math.sin((hourAngle * Math.PI) / 180)},${centerY - (radius * 0.5) * Math.cos((hourAngle * Math.PI) / 180)}`} stroke="#000" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d={`M ${centerX},${centerY} Q ${centerX + 3},${centerY - (radius * 0.3)} ${centerX + (radius * 0.75) * Math.sin((minuteAngle * Math.PI) / 180)},${centerY - (radius * 0.75) * Math.cos((minuteAngle * Math.PI) / 180)}`} stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round" />
          </>
        );

      case 'dress-elegant':
        return (
          <>
            <circle cx={centerX} cy={centerY} r={radius} fill="#faf0e6" stroke="#c0c0c0" strokeWidth="0.5" />
            {/* Ultra-thin Roman numerals */}
            {['XII', 'III', 'VI', 'IX'].map((num, i) => {
              const angle = ([0, 3, 6, 9][i] * 30 - 90) * Math.PI / 180;
              return <text key={i} x={centerX + (radius - 18) * Math.cos(angle)} y={centerY + (radius - 18) * Math.sin(angle) + 4} fill="#555" fontSize="11" fontFamily="Garamond, serif" fontWeight="300" textAnchor="middle">{num}</text>;
            })}
            {/* Slim minute track */}
            {[...Array(60)].map((_, i) => {
              const angle = (i * 6 - 90) * Math.PI / 180;
              return <line key={i} x1={centerX + (radius - 5) * Math.cos(angle)} y1={centerY + (radius - 5) * Math.sin(angle)} x2={centerX + radius * Math.cos(angle)} y2={centerY + radius * Math.sin(angle)} stroke="#999" strokeWidth={i % 5 === 0 ? "0.5" : "0.2"} />;
            })}
            {/* Dauphine slim hands */}
            <line x1={centerX} y1={centerY} x2={centerX + (radius * 0.5) * Math.sin((hourAngle * Math.PI) / 180)} y2={centerY - (radius * 0.5) * Math.cos((hourAngle * Math.PI) / 180)} stroke="#333" strokeWidth="2" />
            <line x1={centerX} y1={centerY} x2={centerX + (radius * 0.75) * Math.sin((minuteAngle * Math.PI) / 180)} y2={centerY - (radius * 0.75) * Math.cos((minuteAngle * Math.PI) / 180)} stroke="#333" strokeWidth="1.5" />
          </>
        );

      case 'military':
        return (
          <>
            <circle cx={centerX} cy={centerY} r={radius} fill="#2d2d2d" stroke={color} strokeWidth="2" />
            {/* Triangle at 12 */}
            <polygon points={`${centerX},${centerY - radius + 5} ${centerX - 5},${centerY - radius + 12} ${centerX + 5},${centerY - radius + 12}`} fill={color} />
            {/* Stencil numerals */}
            {[3, 6, 9, 12].map((num, i) => {
              const angle = ([3, 6, 9, 0][i] * 30 - 90) * Math.PI / 180;
              return <text key={i} x={centerX + (radius - 20) * Math.cos(angle)} y={centerY + (radius - 20) * Math.sin(angle) + 5} fill={color} fontSize="16" fontFamily="Arial, sans-serif" fontWeight="bold" textAnchor="middle">{num}</text>;
            })}
            {/* Tritium dots */}
            {[1, 2, 4, 5, 7, 8, 10, 11].map(i => {
              const angle = (i * 30 - 90) * Math.PI / 180;
              return <circle key={i} cx={centerX + (radius - 15) * Math.cos(angle)} cy={centerY + (radius - 15) * Math.sin(angle)} r="3" fill={color} />;
            })}
            {/* Sword hands */}
            <polygon points={`${centerX},${centerY} ${centerX + 3},${centerY - 8} ${centerX + (radius * 0.5) * Math.sin((hourAngle * Math.PI) / 180)},${centerY - (radius * 0.5) * Math.cos((hourAngle * Math.PI) / 180)} ${centerX - 3},${centerY - 8}`} fill={color} />
            <polygon points={`${centerX},${centerY} ${centerX + 2},${centerY - 5} ${centerX + (radius * 0.75) * Math.sin((minuteAngle * Math.PI) / 180)},${centerY - (radius * 0.75) * Math.cos((minuteAngle * Math.PI) / 180)} ${centerX - 2},${centerY - 5}`} fill={color} />
          </>
        );

      case 'asymmetric':
        return (
          <>
            <circle cx={centerX} cy={centerY} r={radius} fill="#34495e" stroke={color} strokeWidth="1" />
            {/* Off-center dial */}
            <circle cx={centerX + 20} cy={centerY - 15} r={radius * 0.7} fill="none" stroke={color} strokeWidth="1" opacity="0.4" />
            {/* Unconventional markers */}
            {[1, 2, 4, 5, 7, 8, 10, 11].map(i => {
              const angle = (i * 30 - 90) * Math.PI / 180;
              const length = i % 3 === 0 ? 10 : 5;
              return <line key={i} x1={centerX + (radius - length) * Math.cos(angle)} y1={centerY + (radius - length) * Math.sin(angle)} x2={centerX + radius * Math.cos(angle)} y2={centerY + radius * Math.sin(angle)} stroke={color} strokeWidth={i % 3 === 0 ? "2" : "1"} />;
            })}
            {/* Modern asymmetric hands */}
            <line x1={centerX} y1={centerY} x2={centerX + (radius * 0.45) * Math.sin((hourAngle * Math.PI) / 180)} y2={centerY - (radius * 0.45) * Math.cos((hourAngle * Math.PI) / 180)} stroke={color} strokeWidth="4" strokeLinecap="round" />
            <line x1={centerX} y1={centerY} x2={centerX + (radius * 0.7) * Math.sin((minuteAngle * Math.PI) / 180)} y2={centerY - (radius * 0.7) * Math.cos((minuteAngle * Math.PI) / 180)} stroke="#e74c3c" strokeWidth="2" strokeLinecap="round" />
          </>
        );

      case 'retrograde':
        return (
          <>
            <circle cx={centerX} cy={centerY} r={radius} fill="#ecf0f1" stroke="#7f8c8d" strokeWidth="1" />
            {/* Arc scale for minutes */}
            <path d={`M ${centerX - radius * 0.7},${centerY} A ${radius * 0.7} ${radius * 0.7} 0 0 1 ${centerX + radius * 0.7},${centerY}`} fill="none" stroke={color} strokeWidth="2" />
            {[...Array(13)].map((_, i) => {
              const angle = (180 + i * 15) * Math.PI / 180;
              return <line key={i} x1={centerX + (radius * 0.7) * Math.cos(angle)} y1={centerY + (radius * 0.7) * Math.sin(angle)} x2={centerX + (radius * 0.7 + 8) * Math.cos(angle)} y2={centerY + (radius * 0.7 + 8) * Math.sin(angle)} stroke={color} strokeWidth="1" />;
            })}
            {/* Hour numerals */}
            {[9, 10, 11, 12, 1, 2, 3].map((num, i) => {
              const angle = ((i - 3) * 30 - 90) * Math.PI / 180;
              return <text key={i} x={centerX + (radius - 25) * Math.cos(angle)} y={centerY + (radius - 25) * Math.sin(angle) + 4} fill="#000" fontSize="12" textAnchor="middle">{num}</text>;
            })}
            {/* Retrograde pointer */}
            <line x1={centerX} y1={centerY} x2={centerX + (radius * 0.5) * Math.sin((hourAngle * Math.PI) / 180)} y2={centerY - (radius * 0.5) * Math.cos((hourAngle * Math.PI) / 180)} stroke="#e74c3c" strokeWidth="2" />
            <polygon points={`${centerX + (radius * 0.75) * Math.sin((180 + minutes * 3) * Math.PI / 180)},${centerY + (radius * 0.75) * Math.cos((180 + minutes * 3) * Math.PI / 180)} ${centerX + 3},${centerY + 5} ${centerX - 3},${centerY + 5}`} fill={color} />
          </>
        );

      case 'digital-hybrid':
        return (
          <>
            <rect x={centerX - radius} y={centerY - radius} width={radius * 2} height={radius * 2} fill="#16213e" stroke="#00d4ff" strokeWidth="2" rx="10" />
            {/* LCD window */}
            <rect x={centerX - 40} y={centerY - radius + 20} width="80" height="24" fill="#001f3f" stroke="#00d4ff" strokeWidth="1" />
            <text x={centerX} y={centerY - radius + 37} fill="#00ff41" fontSize="18" fontFamily="'Courier New', monospace" textAnchor="middle" fontWeight="bold">{time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</text>
            {/* Analog section */}
            <circle cx={centerX} cy={centerY + 20} r={radius * 0.5} fill="none" stroke="#00d4ff" strokeWidth="1" />
            {[...Array(12)].map((_, i) => {
              const angle = (i * 30 - 90) * Math.PI / 180;
              return <line key={i} x1={centerX + (radius * 0.5 - 5) * Math.cos(angle)} y1={centerY + 20 + (radius * 0.5 - 5) * Math.sin(angle)} x2={centerX + (radius * 0.5) * Math.cos(angle)} y2={centerY + 20 + (radius * 0.5) * Math.sin(angle)} stroke="#00d4ff" strokeWidth="0.5" />;
            })}
            <line x1={centerX} y1={centerY + 20} x2={centerX + (radius * 0.3) * Math.sin((hourAngle * Math.PI) / 180)} y2={centerY + 20 - (radius * 0.3) * Math.cos((hourAngle * Math.PI) / 180)} stroke="#00ff41" strokeWidth="2" />
            <line x1={centerX} y1={centerY + 20} x2={centerX + (radius * 0.45) * Math.sin((minuteAngle * Math.PI) / 180)} y2={centerY + 20 - (radius * 0.45) * Math.cos((minuteAngle * Math.PI) / 180)} stroke="#00ff41" strokeWidth="1" />
          </>
        );

      case 'jumping-hour':
        return (
          <>
            <circle cx={centerX} cy={centerY} r={radius} fill="#f4f4f4" stroke="#666" strokeWidth="1" />
            {/* Hour window */}
            <rect x={centerX - 25} y={centerY - radius * 0.4} width="50" height="40" fill="#fff" stroke="#333" strokeWidth="1" rx="5" />
            <text x={centerX} y={centerY - radius * 0.4 + 28} fill="#000" fontSize="32" fontFamily="Arial, sans-serif" fontWeight="bold" textAnchor="middle">{hours === 0 ? 12 : hours}</text>
            {/* Minute scale */}
            <path d={`M ${centerX - radius * 0.7},${centerY + 20} A ${radius * 0.7} ${radius * 0.7} 0 0 1 ${centerX + radius * 0.7},${centerY + 20}`} fill="none" stroke="#333" strokeWidth="2" />
            {[...Array(61)].map((_, i) => {
              const angle = (180 + i * 3) * Math.PI / 180;
              return i % 5 === 0 ? <line key={i} x1={centerX + (radius * 0.7) * Math.cos(angle)} y1={centerY + 20 + (radius * 0.7) * Math.sin(angle)} x2={centerX + (radius * 0.7 + 8) * Math.cos(angle)} y2={centerY + 20 + (radius * 0.7 + 8) * Math.sin(angle)} stroke="#333" strokeWidth="2" /> : null;
            })}
            {/* Minute hand only */}
            <polygon points={`${centerX + (radius * 0.75) * Math.sin((180 + minutes * 3) * Math.PI) / 180},${centerY + 20 + (radius * 0.75) * Math.cos((180 + minutes * 3) * Math.PI / 180)} ${centerX + 3},${centerY + 25} ${centerX - 3},${centerY + 25}`} fill="#e74c3c" />
          </>
        );

      case 'railroad':
        return (
          <>
            <circle cx={centerX} cy={centerY} r={radius} fill="#fffef0" stroke="#654321" strokeWidth="2" />
            {/* Bold Arabic numerals */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num, i) => {
              const angle = (i * 30 - 90) * Math.PI / 180;
              return <text key={i} x={centerX + (radius - 20) * Math.cos(angle)} y={centerY + (radius - 20) * Math.sin(angle) + 5} fill="#000" fontSize="16" fontFamily="Arial, sans-serif" fontWeight="bold" textAnchor="middle">{num}</text>;
            })}
            {/* Railroad minute track */}
            {[...Array(60)].map((_, i) => {
              const angle = (i * 6 - 90) * Math.PI / 180;
              const isHour = i % 5 === 0;
              return <line key={i} x1={centerX + (radius - (isHour ? 12 : 6)) * Math.cos(angle)} y1={centerY + (radius - (isHour ? 12 : 6)) * Math.sin(angle)} x2={centerX + radius * Math.cos(angle)} y2={centerY + radius * Math.sin(angle)} stroke="#000" strokeWidth={isHour ? "2" : "1"} />;
            })}
            {/* Spade blued hands */}
            <path d={`M ${centerX},${centerY} L ${centerX + 3},${centerY - 5} L ${centerX + (radius * 0.5) * Math.sin((hourAngle * Math.PI) / 180) + 2},${centerY - (radius * 0.5) * Math.cos((hourAngle * Math.PI) / 180)} L ${centerX + (radius * 0.5) * Math.sin((hourAngle * Math.PI) / 180)},${centerY - (radius * 0.5) * Math.cos((hourAngle * Math.PI) / 180) - 3} L ${centerX + (radius * 0.5) * Math.sin((hourAngle * Math.PI) / 180) - 2},${centerY - (radius * 0.5) * Math.cos((hourAngle * Math.PI) / 180)} L ${centerX - 3},${centerY - 5} Z`} fill="#0047ab" />
            <path d={`M ${centerX},${centerY} L ${centerX + 2},${centerY - 3} L ${centerX + (radius * 0.75) * Math.sin((minuteAngle * Math.PI) / 180) + 1.5},${centerY - (radius * 0.75) * Math.cos((minuteAngle * Math.PI) / 180)} L ${centerX + (radius * 0.75) * Math.sin((minuteAngle * Math.PI) / 180)},${centerY - (radius * 0.75) * Math.cos((minuteAngle * Math.PI) / 180) - 2} L ${centerX + (radius * 0.75) * Math.sin((minuteAngle * Math.PI) / 180) - 1.5},${centerY - (radius * 0.75) * Math.cos((minuteAngle * Math.PI) / 180)} L ${centerX - 2},${centerY - 3} Z`} fill="#0047ab" />
          </>
        );

      case 'pocket-watch':
        return (
          <>
            <circle cx={centerX} cy={centerY} r={radius + 5} fill="none" stroke="#d4af37" strokeWidth="6" opacity="0.8" />
            <circle cx={centerX} cy={centerY} r={radius} fill="#fefefe" stroke="#000" strokeWidth="1" />
            {/* Enamel Roman numerals */}
            {['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'].map((num, i) => {
              const angle = (i * 30 - 90) * Math.PI / 180;
              return <text key={i} x={centerX + (radius - 22) * Math.cos(angle)} y={centerY + (radius - 22) * Math.sin(angle) + 5} fill="#000" fontSize="13" fontFamily="Georgia, serif" textAnchor="middle">{num}</text>;
            })}
            {/* Sub seconds at 6 */}
            <circle cx={centerX} cy={centerY + radius * 0.5} r={15} fill="none" stroke="#000" strokeWidth="0.5" />
            {[...Array(12)].map((_, i) => {
              const angle = (i * 30 - 90) * Math.PI / 180;
              return <line key={i} x1={centerX + 13 * Math.cos(angle)} y1={centerY + radius * 0.5 + 13 * Math.sin(angle)} x2={centerX + 15 * Math.cos(angle)} y2={centerY + radius * 0.5 + 15 * Math.sin(angle)} stroke="#000" strokeWidth="0.3" />;
            })}
            <line x1={centerX} y1={centerY + radius * 0.5} x2={centerX + 10 * Math.sin((secondAngle * Math.PI) / 180)} y2={centerY + radius * 0.5 - 10 * Math.cos((secondAngle * Math.PI) / 180)} stroke="#000" strokeWidth="0.5" />
            {/* Breguet classic hands */}
            <path d={`M ${centerX},${centerY} L ${centerX + 2.5},${centerY - 6} L ${centerX + (radius * 0.5) * Math.sin((hourAngle * Math.PI) / 180)},${centerY - (radius * 0.5) * Math.cos((hourAngle * Math.PI) / 180) + 6} L ${centerX + (radius * 0.5) * Math.sin((hourAngle * Math.PI) / 180)},${centerY - (radius * 0.5) * Math.cos((hourAngle * Math.PI) / 180)} L ${centerX - 2.5},${centerY - 6} Z`} fill="#0047ab" />
            <circle cx={centerX + (radius * 0.5) * Math.sin((hourAngle * Math.PI) / 180)} cy={centerY - (radius * 0.5) * Math.cos((hourAngle * Math.PI) / 180) + 3.5} r="2.5" fill="none" stroke="#0047ab" strokeWidth="0.5" />
          </>
        );

      case 'marine-chronometer':
        return (
          <>
            <circle cx={centerX} cy={centerY} r={radius} fill="#e8e8e8" stroke="#2c3e50" strokeWidth="2" />
            {/* Nautical markers */}
            {[...Array(12)].map((_, i) => {
              const angle = (i * 30 - 90) * Math.PI / 180;
              const isCardinal = i % 3 === 0;
              return (
                <g key={i}>
                  <line x1={centerX + (radius - (isCardinal ? 15 : 8)) * Math.cos(angle)} y1={centerY + (radius - (isCardinal ? 15 : 8)) * Math.sin(angle)} x2={centerX + radius * Math.cos(angle)} y2={centerY + radius * Math.sin(angle)} stroke="#2c3e50" strokeWidth={isCardinal ? "3" : "1"} />
                  {isCardinal && <text x={centerX + (radius - 25) * Math.cos(angle)} y={centerY + (radius - 25) * Math.sin(angle) + 4} fill="#000" fontSize="14" fontWeight="bold" textAnchor="middle">{i === 0 ? 12 : i}</text>}
                </g>
              );
            })}
            {renderPowerReserve()}
            {/* Marine blued hands */}
            <polygon points={`${centerX},${centerY} ${centerX + 3},${centerY - 6} ${centerX + (radius * 0.5) * Math.sin((hourAngle * Math.PI) / 180)},${centerY - (radius * 0.5) * Math.cos((hourAngle * Math.PI) / 180)} ${centerX - 3},${centerY - 6}`} fill="#0047ab" />
            <polygon points={`${centerX},${centerY} ${centerX + 2},${centerY - 4} ${centerX + (radius * 0.75) * Math.sin((minuteAngle * Math.PI) / 180)},${centerY - (radius * 0.75) * Math.cos((minuteAngle * Math.PI) / 180)} ${centerX - 2},${centerY - 4}`} fill="#0047ab" />
          </>
        );

      case 'observatoire':
        return (
          <>
            <circle cx={centerX} cy={centerY} r={radius} fill="#f5f5f5" stroke="#5d4037" strokeWidth="1.5" />
            {/* Railway minute track */}
            {[...Array(60)].map((_, i) => {
              const angle = (i * 6 - 90) * Math.PI / 180;
              const isHour = i % 5 === 0;
              return <line key={i} x1={centerX + (radius - (isHour ? 10 : 5)) * Math.cos(angle)} y1={centerY + (radius - (isHour ? 10 : 5)) * Math.sin(angle)} x2={centerX + radius * Math.cos(angle)} y2={centerY + radius * Math.sin(angle)} stroke="#5d4037" strokeWidth={isHour ? "1.5" : "0.5"} />;
            })}
            {/* Roman numerals */}
            {['XII', 'III', 'VI', 'IX'].map((num, i) => {
              const angle = ([0, 3, 6, 9][i] * 30 - 90) * Math.PI / 180;
              return <text key={i} x={centerX + (radius - 22) * Math.cos(angle)} y={centerY + (radius - 22) * Math.sin(angle) + 5} fill="#000" fontSize="14" fontFamily="Georgia, serif" textAnchor="middle">{num}</text>;
            })}
            {/* Regulator style - three separate hands */}
            <line x1={centerX} y1={centerY} x2={centerX + (radius * 0.7) * Math.sin((minuteAngle * Math.PI) / 180)} y2={centerY - (radius * 0.7) * Math.cos((minuteAngle * Math.PI) / 180)} stroke="#000" strokeWidth="2" />
            <line x1={centerX} y1={centerY - radius * 0.4} x2={centerX + (radius * 0.3) * Math.sin((hourAngle * Math.PI) / 180)} y2={centerY - radius * 0.4 - (radius * 0.3) * Math.cos((hourAngle * Math.PI) / 180)} stroke="#0047ab" strokeWidth="2.5" />
            {showSeconds && <line x1={centerX} y1={centerY + radius * 0.4} x2={centerX + (radius * 0.25) * Math.sin((secondAngle * Math.PI) / 180)} y2={centerY + radius * 0.4 - (radius * 0.25) * Math.cos((secondAngle * Math.PI) / 180)} stroke="#8b0000" strokeWidth="0.8" />}
          </>
        );

      case 'colorful':
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

      case 'binary':
        return (
          <>
            <rect x={centerX - radius} y={centerY - radius} width={radius * 2} height={radius * 2} fill="#0a0a0a" stroke={color} strokeWidth="2" rx="5" />
            {/* Binary clock - 6 columns for HH:MM:SS */}
            {[hours, minutes, seconds].map((value, colGroup) => {
              const tens = Math.floor(value / 10);
              const ones = value % 10;
              return [tens, ones].map((digit, digitIdx) => {
                const col = colGroup * 2 + digitIdx;
                return [...Array(4)].map((_, row) => {
                  const bit = (digit >> (3 - row)) & 1;
                  const x = centerX - radius * 0.7 + col * (radius * 0.25);
                  const y = centerY - radius * 0.5 + row * (radius * 0.3);
                  return <circle key={`${col}-${row}`} cx={x} cy={y} r={size > 100 ? "8" : "4"} fill={bit ? color : 'rgba(255,255,255,0.1)'} />;
                });
              });
            })}
            {/* Labels */}
            <text x={centerX - radius * 0.6} y={centerY + radius * 0.7} fill={color} fontSize="10" textAnchor="middle">H</text>
            <text x={centerX} y={centerY + radius * 0.7} fill={color} fontSize="10" textAnchor="middle">M</text>
            <text x={centerX + radius * 0.6} y={centerY + radius * 0.7} fill={color} fontSize="10" textAnchor="middle">S</text>
          </>
        );

      case 'flip':
        return (
          <>
            <rect x={centerX - radius} y={centerY - radius} width={radius * 2} height={radius * 2} fill="#1a1a1a" rx="8" />
            {/* Flip clock style - airport departure board */}
            {[hours, minutes].map((value, idx) => {
              const x = centerX - radius * 0.4 + idx * radius * 0.85;
              const displayValue = String(value).padStart(2, '0');
              return (
                <g key={idx}>
                  {/* Top half */}
                  <rect x={x - 25} y={centerY - radius * 0.5} width="50" height="35" fill="#2a2a2a" stroke="#444" strokeWidth="1" rx="3" />
                  <line x1={x - 25} y1={centerY - radius * 0.5 + 17.5} x2={x + 25} y2={centerY - radius * 0.5 + 17.5} stroke="#000" strokeWidth="0.5" />
                  {/* Bottom half */}
                  <rect x={x - 25} y={centerY - radius * 0.5 + 35} width="50" height="35" fill="#2a2a2a" stroke="#444" strokeWidth="1" rx="3" />
                  {/* Number */}
                  <text x={x} y={centerY - radius * 0.5 + 45} fill="#f0f0f0" fontSize={size > 100 ? "42" : "22"} fontFamily="Arial, sans-serif" fontWeight="bold" textAnchor="middle">{displayValue}</text>
                </g>
              );
            })}
            {/* Colon */}
            <text x={centerX} y={centerY - radius * 0.2} fill="#f0f0f0" fontSize={size > 100 ? "36" : "18"} fontWeight="bold" textAnchor="middle">:</text>
            {/* Seconds display */}
            <text x={centerX} y={centerY + radius * 0.6} fill={color} fontSize="14" textAnchor="middle">{String(seconds).padStart(2, '0')}</text>
          </>
        );

      case 'segment':
        return (
          <>
            <rect x={centerX - radius} y={centerY - radius} width={radius * 2} height={radius * 2} fill="#000" stroke="#333" strokeWidth="2" rx="8" />
            {/* 7-segment display style */}
            <text x={centerX} y={centerY + 15} fill="#ff0000" fontSize={size > 100 ? "56" : "28"} fontFamily="'Digital-7', 'Courier New', monospace" fontWeight="bold" textAnchor="middle" style={{ filter: 'drop-shadow(0 0 8px #ff0000)', letterSpacing: size > 100 ? '8px' : '4px' }}>
              {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </text>
          </>
        );

      default:
        // Generic fallback
        return (
          <>
            {dialBg}
            {renderMarkers()}
            {renderHands()}
          </>
        );
    }
  };

  // Render markers based on style
  const renderMarkers = () => {
    const markers = [];
    const markerCount = config.showMinuteTrack ? 60 : 12;
    
    for (let i = 0; i < markerCount; i++) {
      const angle = (i * (360 / markerCount) - 90) * Math.PI / 180;
      const isHourMark = i % (markerCount / 12) === 0;
      const markerLength = isHourMark ? 12 : 6;
      const markerWidth = isHourMark ? 2 : 0.5;
      
      const x1 = centerX + (radius - markerLength) * Math.cos(angle);
      const y1 = centerY + (radius - markerLength) * Math.sin(angle);
      const x2 = centerX + radius * Math.cos(angle);
      const y2 = centerY + radius * Math.sin(angle);

      markers.push(
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={color}
          strokeWidth={markerWidth}
          opacity={isHourMark ? 0.9 : 0.3}
        />
      );

      // Add numerals
      if (isHourMark && (config.showRomanNumerals || config.showArabicNumerals)) {
        const numRadius = radius - 25;
        const numX = centerX + numRadius * Math.cos(angle);
        const numY = centerY + numRadius * Math.sin(angle);
        const hourNum = i === 0 ? 12 : i / (markerCount / 12);
        const romanNumerals = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
        
        markers.push(
          <text
            key={`num-${i}`}
            x={numX}
            y={numY + 5}
            fill={color}
            fontSize={config.showRomanNumerals ? 14 : 16}
            fontFamily={config.showRomanNumerals ? 'serif' : 'sans-serif'}
            fontWeight={config.showRomanNumerals ? '300' : '400'}
            textAnchor="middle"
          >
            {config.showRomanNumerals ? romanNumerals[hourNum === 12 ? 0 : hourNum] : hourNum}
          </text>
        );
      }
    }
    return markers;
  };

  const renderHands = () => {
    const handConfig = {
      dauphine: { hourWidth: 4, minuteWidth: 3, tapered: true },
      breguet: { hourWidth: 2.5, minuteWidth: 2, hollowTip: true },
      leaf: { hourWidth: 5, minuteWidth: 4, leafShaped: true },
      alpha: { hourWidth: 3.5, minuteWidth: 2.5, pointed: true },
      sword: { hourWidth: 4, minuteWidth: 3, swordTip: true },
      baton: { hourWidth: 3, minuteWidth: 2, straight: true },
    };

    const handType = handConfig[config.handStyle as keyof typeof handConfig] || handConfig.dauphine;

    return (
      <>
        {/* Hour hand */}
        <line
          x1={centerX}
          y1={centerY}
          x2={centerX + (radius * 0.5) * Math.sin((hourAngle * Math.PI) / 180)}
          y2={centerY - (radius * 0.5) * Math.cos((hourAngle * Math.PI) / 180)}
          stroke={color}
          strokeWidth={handType.hourWidth}
          strokeLinecap="round"
        />
        {/* Minute hand */}
        <line
          x1={centerX}
          y1={centerY}
          x2={centerX + (radius * 0.75) * Math.sin((minuteAngle * Math.PI) / 180)}
          y2={centerY - (radius * 0.75) * Math.cos((minuteAngle * Math.PI) / 180)}
          stroke={color}
          strokeWidth={handType.minuteWidth}
          strokeLinecap="round"
        />
        {/* Second hand */}
        {showSeconds && (
          <line
            x1={centerX}
            y1={centerY}
            x2={centerX + (radius * 0.85) * Math.sin((secondAngle * Math.PI) / 180)}
            y2={centerY - (radius * 0.85) * Math.cos((secondAngle * Math.PI) / 180)}
            stroke={config.sporty ? '#ff0000' : color}
            strokeWidth={0.8}
            strokeLinecap="round"
            opacity={0.8}
          />
        )}
      </>
    );
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Outer case */}
      <circle
        cx={centerX}
        cy={centerY}
        r={radius + 15}
        fill={backgroundColor}
        stroke={color}
        strokeWidth={2}
        opacity={0.15}
      />

      {/* Render the watch face */}
      {renderWatch()}

      {/* Center pin */}
      <circle cx={centerX} cy={centerY} r={4} fill={color} />
      <circle cx={centerX} cy={centerY} r={2} fill={backgroundColor || '#000'} />
    </svg>
  );
};
