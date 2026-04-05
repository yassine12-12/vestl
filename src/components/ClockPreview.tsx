import React from 'react';
import { AnalogClock } from './AnalogClock';
import { ClockRenderer } from './ClockRenderer';

interface ClockPreviewProps {
  clockStyle: string;
  color: string;
  size?: number;
  isSelected: boolean;
  onClick: () => void;
}

export const ClockPreview: React.FC<ClockPreviewProps> = ({
  clockStyle,
  color,
  size = 80,
  isSelected,
  onClick
}) => {
  const isAnalog = clockStyle.startsWith('analog-');
  const analogStyle = clockStyle.replace('analog-', '') as any;

  // Premium watch styles (without analog- prefix)
  const premiumStyles = [
    'grand-complication', 'perpetual-calendar', 'moonphase', 'tourbillon',
    'worldtime', 'power-reserve', 'bauhaus', 'dress-elegant', 'skeleton',
    'art-deco', 'pilot', 'diver', 'racing', 'military', 'asymmetric',
    'retrograde', 'digital-hybrid', 'jumping-hour', 'railroad', 'pocket-watch',
    'marine-chronometer', 'observatoire', 'colorful', 'binary', 'flip', 'segment',
    // Artistic Collection
    'neon-plasma', 'crystal-prism', 'kintsugi', 'astrolabe', 'vortex-orrery',
  ];
  // Strip analog- prefix for comparison
  const styleWithoutPrefix = clockStyle.replace('analog-', '').replace('digital-', '');
  const isPremium = premiumStyles.includes(styleWithoutPrefix);

  return (
    <button
      onClick={onClick}
      className={`relative p-2 rounded-xl transition-all ${
        isSelected ? 'ring-2 scale-105' : 'hover:scale-102'
      }`}
      style={{
        backgroundColor: isSelected ? `${color}20` : 'rgba(255,255,255,0.05)',
        outlineColor: color,
      }}
    >
      <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        {isPremium ? (
          <ClockRenderer
            size={size}
            color={color}
            backgroundColor="transparent"
            style={styleWithoutPrefix as any}
            showSeconds={false}
            showComplications={false}
          />
        ) : isAnalog ? (
          <AnalogClock
            size={size}
            color={color}
            showNumbers={false}
            style={analogStyle}
            showSeconds={true}
          />
        ) : clockStyle === 'digital' ? (
          <div className="text-center">
            <div className="font-mono font-bold" style={{ color, fontSize: '18px' }}>
              12:34
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="font-mono font-light" style={{ color, fontSize: '16px' }}>
              12:34:56
            </div>
          </div>
        )}
      </div>
    </button>
  );
};
