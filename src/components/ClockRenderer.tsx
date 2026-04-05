import React, { useEffect, useState } from 'react';
import { BauhausClock } from './clocks/BauhausClock';
import { SkeletonClock } from './clocks/SkeletonClock';
import { PilotClock } from './clocks/PilotClock';
import { DiverClock } from './clocks/DiverClock';
import { ColorfulDigitalClock } from './clocks/ColorfulDigitalClock';
import { BinaryClock } from './clocks/BinaryClock';
import { GrandComplicationClock } from './clocks/GrandComplicationClock';
import { MoonphaseClock } from './clocks/MoonphaseClock';
import { RacingClock } from './clocks/RacingClock';
import { FlipClock } from './clocks/FlipClock';
import { SegmentClock } from './clocks/SegmentClock';
import { DressElegantClock } from './clocks/DressElegantClock';
import { ArtDecoClock } from './clocks/ArtDecoClock';
import { MilitaryClock } from './clocks/MilitaryClock';
import { WorldTimeClock } from './clocks/WorldTimeClock';
import { TourbillonClock } from './clocks/TourbillonClock';
import { PowerReserveClock } from './clocks/PowerReserveClock';
import { RetrogradeClock } from './clocks/RetrogradeClock';
import { RailroadClock } from './clocks/RailroadClock';
import { JumpingHourClock } from './clocks/JumpingHourClock';
import { AsymmetricClock } from './clocks/AsymmetricClock';
import { DigitalHybridClock } from './clocks/DigitalHybridClock';
import { NeonPlasmaClock } from './clocks/NeonPlasmaClock';
import { CrystalPrismClock } from './clocks/CrystalPrismClock';
import { KintsugiClock } from './clocks/KintsugiClock';
import { AstrolabeClock } from './clocks/AstrolabeClock';
import { VortexOrrery } from './clocks/VortexOrrery';

interface ClockRendererProps {
  size?: number;
  color?: string;
  backgroundColor?: string;
  style: string;
  showSeconds?: boolean;
  showComplications?: boolean;
}

export const ClockRenderer: React.FC<ClockRendererProps> = ({
  size = 300,
  color = '#ffffff',
  backgroundColor = 'transparent',
  style,
  showSeconds: _showSeconds = true,
  showComplications: _showComplications = true,
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

  const hourAngle = (hours * 30) + (minutes * 0.5);
  const minuteAngle = minutes * 6;
  const secondAngle = seconds * 6;

  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 30;

  const commonProps = {
    centerX,
    centerY,
    radius,
    hourAngle,
    minuteAngle,
    secondAngle,
    color,
    size,
    time,
    hours,
    minutes,
    seconds,
    day,
  };

  const renderClock = () => {
    switch(style) {
      case 'bauhaus':
        return <BauhausClock {...commonProps} />;
      case 'skeleton':
        return <SkeletonClock {...commonProps} />;
      case 'pilot':
        return <PilotClock {...commonProps} />;
      case 'diver':
        return <DiverClock {...commonProps} />;
      case 'grand-complication':
        return <GrandComplicationClock {...commonProps} />;
      case 'moonphase':
        return <MoonphaseClock {...commonProps} />;
      case 'racing':
        return <RacingClock {...commonProps} />;
      case 'dress-elegant':
        return <DressElegantClock {...commonProps} />;
      case 'art-deco':
        return <ArtDecoClock {...commonProps} />;
      case 'military':
        return <MilitaryClock {...commonProps} />;
      case 'worldtime':
        return <WorldTimeClock {...commonProps} />;
      case 'tourbillon':
        return <TourbillonClock {...commonProps} />;
      case 'power-reserve':
        return <PowerReserveClock {...commonProps} />;
      case 'retrograde':
        return <RetrogradeClock {...commonProps} />;
      case 'railroad':
        return <RailroadClock {...commonProps} />;
      case 'jumping-hour':
        return <JumpingHourClock {...commonProps} />;
      case 'asymmetric':
        return <AsymmetricClock {...commonProps} />;
      case 'digital-hybrid':
        return <DigitalHybridClock {...commonProps} />;
      // ── Artistic Collection ──
      case 'neon-plasma':
        return <NeonPlasmaClock {...commonProps} />;
      case 'crystal-prism':
        return <CrystalPrismClock {...commonProps} />;
      case 'kintsugi':
        return <KintsugiClock {...commonProps} />;
      case 'astrolabe':
        return <AstrolabeClock {...commonProps} />;
      case 'vortex-orrery':
        return <VortexOrrery {...commonProps} />;
      case 'colorful':
        return <ColorfulDigitalClock {...commonProps} />;
      case 'binary':
        return <BinaryClock {...commonProps} />;
      case 'flip':
        return <FlipClock {...commonProps} />;
      case 'segment':
        return <SegmentClock {...commonProps} />;
      default:
        // Fallback to simple clock
        return (
          <>
            <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke={color} strokeWidth="2" />
            {[...Array(12)].map((_, i) => {
              const angle = (i * 30 - 90) * Math.PI / 180;
              return (
                <line key={i}
                  x1={centerX + (radius - 10) * Math.cos(angle)}
                  y1={centerY + (radius - 10) * Math.sin(angle)}
                  x2={centerX + radius * Math.cos(angle)}
                  y2={centerY + radius * Math.sin(angle)}
                  stroke={color}
                  strokeWidth="2"
                />
              );
            })}
            <line x1={centerX} y1={centerY} x2={centerX + (radius * 0.5) * Math.sin((hourAngle * Math.PI) / 180)} y2={centerY - (radius * 0.5) * Math.cos((hourAngle * Math.PI) / 180)} stroke={color} strokeWidth="4" />
            <line x1={centerX} y1={centerY} x2={centerX + (radius * 0.75) * Math.sin((minuteAngle * Math.PI) / 180)} y2={centerY - (radius * 0.75) * Math.cos((minuteAngle * Math.PI) / 180)} stroke={color} strokeWidth="2" />
          </>
        );
    }
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

      {/* Render the selected clock */}
      {renderClock()}

      {/* Center pin */}
      <circle cx={centerX} cy={centerY} r={4} fill={color} />
      <circle cx={centerX} cy={centerY} r={2} fill={backgroundColor || '#000'} />
    </svg>
  );
};
