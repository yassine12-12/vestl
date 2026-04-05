import React from 'react';
import { Theme } from '../themes';
import { ThemeCustomization } from '../types';
import { ClockPreview } from './ClockPreview';

interface CustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
  customization: ThemeCustomization;
  onCustomizationChange: (customization: ThemeCustomization) => void;
}

export const CustomizationModal: React.FC<CustomizationModalProps> = ({
  isOpen,
  onClose,
  theme,
  customization,
  onCustomizationChange,
}) => {
  if (!isOpen) return null;

  const updateCustomization = (updates: Partial<ThemeCustomization>) => {
    onCustomizationChange({ ...customization, ...updates });
  };

  const clockCategories = [
    {
      name: 'HAUTE HORLOGERIE',
      styles: [
        { value: 'analog-grand-complication', label: 'Grand Complication', desc: 'Multiple complications' },
        { value: 'analog-perpetual-calendar', label: 'Perpetual Calendar', desc: 'Day, date, month' },
        { value: 'analog-moonphase', label: 'Moon Phase', desc: 'Lunar complication' },
        { value: 'analog-tourbillon', label: 'Tourbillon', desc: 'Rotating escapement' },
        { value: 'analog-worldtime', label: 'World Time', desc: 'Multiple time zones' },
        { value: 'analog-power-reserve', label: 'Power Reserve', desc: 'Energy indicator' },
      ]
    },
    {
      name: 'DRESS WATCHES',
      styles: [
        { value: 'analog-bauhaus', label: 'Bauhaus', desc: 'German minimalism' },
        { value: 'analog-dress-elegant', label: 'Dress Elegant', desc: 'Refined & slim' },
        { value: 'analog-skeleton', label: 'Skeleton', desc: 'Visible mechanism' },
        { value: 'analog-art-deco', label: 'Art Deco', desc: '1920s style' },
      ]
    },
    {
      name: 'PROFESSIONAL',
      styles: [
        { value: 'analog-pilot', label: 'Pilot', desc: 'Aviation watch' },
        { value: 'analog-diver', label: 'Diver', desc: 'Professional diving' },
        { value: 'analog-racing', label: 'Racing Chronograph', desc: 'Motorsport' },
        { value: 'analog-military', label: 'Military', desc: 'Field watch' },
      ]
    },
    {
      name: 'AVANT-GARDE',
      styles: [
        { value: 'analog-asymmetric', label: 'Asymmetric', desc: 'Unique layout' },
        { value: 'analog-retrograde', label: 'Retrograde', desc: 'Arc display' },
        { value: 'analog-digital-hybrid', label: 'Hybrid', desc: 'Analog + digital' },
        { value: 'analog-jumping-hour', label: 'Jumping Hour', desc: 'Window display' },
      ]
    },
    {
      name: 'HERITAGE',
      styles: [
        { value: 'analog-railroad', label: 'Railroad', desc: 'Vintage precision' },
        { value: 'analog-pocket-watch', label: 'Pocket Watch', desc: 'Classic elegance' },
        { value: 'analog-marine-chronometer', label: 'Marine Chronometer', desc: 'Naval precision' },
        { value: 'analog-observatoire', label: 'Observatoire', desc: 'Observatory grade' },
      ]
    },
    {
      name: 'ARTISTIC',
      styles: [
        { value: 'analog-neon-plasma',    label: 'Neon Plasma',    desc: 'Cyberpunk neon glow' },
        { value: 'analog-crystal-prism',  label: 'Crystal Prism',  desc: 'Gemstone facets' },
        { value: 'analog-kintsugi',       label: 'Kintsugi',       desc: 'Japanese gold repair' },
        { value: 'analog-astrolabe',      label: 'Astrolabe',      desc: 'Medieval brass' },
        { value: 'analog-vortex-orrery',  label: 'Vortex Orrery',  desc: 'Cosmic orbital' },
      ]
    },
    {
      name: 'DIGITAL',
      styles: [
        { value: 'digital', label: 'Digital', desc: 'Modern display' },
        { value: 'digital-mono', label: 'Monospace', desc: 'Fixed-width' },
        { value: 'digital-colorful', label: 'Colorful LED', desc: 'Multi-color' },
        { value: 'digital-binary', label: 'Binary', desc: 'Binary code' },
        { value: 'digital-flip', label: 'Flip Clock', desc: 'Airport style' },
        { value: 'digital-segment', label: '7-Segment', desc: 'Classic LED' },
      ]
    }
  ];

  const clockSizes = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
  ];

  const layouts = [
    { value: 'default', label: 'Default', desc: 'Time left, content right' },
    { value: 'split', label: 'Split View', desc: 'Transit dashboard style' },
    { value: 'centered', label: 'Centered', desc: 'Everything centered' },
    { value: 'compact', label: 'Compact', desc: 'Minimal spacing' },
    { value: 'minimal', label: 'Minimal', desc: 'Ultra clean' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className="relative rounded-2xl shadow-2xl overflow-hidden"
        style={{ 
          width: '1500px',
          height: '325px',
          backgroundColor: theme.background.includes('gradient') ? '#1a1a1a' : theme.background,
          border: `2px solid ${theme.accentColor}40`
        }}
      >
        <div className="flex h-full">
          {/* Header Section */}
          <div 
            className="flex-shrink-0 w-48 p-4 border-r flex flex-col justify-between"
            style={{ borderColor: `${theme.accentColor}30` }}
          >
            <div>
              <h2 
                className="text-xl font-black mb-2"
                style={{ color: theme.textColor }}
              >
                Customize
              </h2>
              <p className="text-xs" style={{ color: theme.textSecondary }}>
                Make it yours
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full py-2 rounded-lg font-bold transition-all text-sm"
              style={{ 
                backgroundColor: `${theme.accentColor}30`,
                color: theme.textColor
              }}
            >
              Done
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              
              {/* Clock Style Selection - Visual Grid by Category */}
              <div>
                <h3 className="text-sm font-bold mb-3" style={{ color: theme.textColor }}>
                  Horological Collections - Click to Select
                </h3>
                <div className="space-y-5 max-h-64 overflow-y-auto pr-2">
                  {clockCategories.map((category) => (
                    <div key={category.name}>
                      <div className="text-[11px] font-bold mb-2 opacity-70 tracking-wider" style={{ color: theme.textColor }}>
                        {category.name}
                      </div>
                      <div className="grid grid-cols-8 gap-2">
                        {category.styles.map((style) => (
                          <div key={style.value} className="flex flex-col items-center">
                            <ClockPreview
                              clockStyle={style.value}
                              color={theme.accentColor}
                              size={50}
                              isSelected={customization.clockStyle === style.value}
                              onClick={() => updateCustomization({ clockStyle: style.value as any })}
                            />
                            <div className="text-center mt-0.5">
                              <div className="text-[9px] font-medium leading-tight" style={{ color: theme.textColor }}>
                                {style.label}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Settings Row */}
              <div className="grid grid-cols-3 gap-3">
                {/* Clock Size */}
                <div>
                  <h3 className="text-xs font-bold mb-2" style={{ color: theme.textColor }}>
                    Size
                  </h3>
                  <div className="grid grid-cols-3 gap-1">
                    {clockSizes.map((size) => (
                      <button
                        key={size.value}
                        onClick={() => updateCustomization({ clockSize: size.value as any })}
                        className={`p-2 rounded-lg text-xs font-medium transition-all ${
                          customization.clockSize === size.value ? 'ring-2' : ''
                        }`}
                        style={{
                          backgroundColor: customization.clockSize === size.value
                            ? `${theme.accentColor}40`
                            : `${theme.accentColor}15`,
                          color: theme.textColor,
                          outlineColor: theme.accentColor,
                        }}
                      >
                        {size.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Show Seconds Toggle */}
                <div>
                  <h3 className="text-xs font-bold mb-2" style={{ color: theme.textColor }}>
                    Seconds
                  </h3>
                  <button
                    onClick={() => updateCustomization({ showSeconds: !customization.showSeconds })}
                    className={`w-full p-2 rounded-lg text-xs font-medium transition-all ${
                      customization.showSeconds ? 'ring-2' : ''
                    }`}
                    style={{
                      backgroundColor: customization.showSeconds
                        ? `${theme.accentColor}40`
                        : `${theme.accentColor}15`,
                      color: theme.textColor,
                      outlineColor: theme.accentColor,
                    }}
                  >
                    {customization.showSeconds ? '✓ Show' : 'Hide'}
                  </button>
                </div>

                {/* Layout */}
                <div>
                  <h3 className="text-xs font-bold mb-2" style={{ color: theme.textColor }}>
                    Layout
                  </h3>
                  <select
                    value={customization.layout}
                    onChange={(e) => updateCustomization({ layout: e.target.value as any })}
                    className="w-full p-2 rounded-lg text-xs font-medium"
                    style={{
                      backgroundColor: `${theme.accentColor}15`,
                      color: theme.textColor,
                      border: `2px solid ${theme.accentColor}30`,
                    }}
                  >
                    {layouts.map((layout) => (
                      <option key={layout.value} value={layout.value}>
                        {layout.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Widgets Row */}
              <div>
                <h3 className="text-sm font-bold mb-2" style={{ color: theme.textColor }}>
                  Widgets
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {/* Weather Widget */}
                  <button
                    onClick={() => updateCustomization({ showWeather: !customization.showWeather })}
                    className={`p-3 rounded-lg transition-all text-left ${
                      customization.showWeather ? 'ring-2' : ''
                    }`}
                    style={{
                      backgroundColor: customization.showWeather
                        ? `${theme.accentColor}30`
                        : `${theme.accentColor}10`,
                      color: theme.textColor,
                      outlineColor: theme.accentColor,
                    }}
                  >
                    <div className="text-2xl mb-1">🌤️</div>
                    <div className="text-xs font-bold">Weather</div>
                    <div className="text-[10px]" style={{ color: theme.textSecondary }}>
                      {customization.showWeather ? 'Visible' : 'Hidden'}
                    </div>
                  </button>

                  {/* Transit Widget */}
                  <button
                    onClick={() => updateCustomization({ showDepartures: !customization.showDepartures })}
                    className={`p-3 rounded-lg transition-all text-left ${
                      customization.showDepartures ? 'ring-2' : ''
                    }`}
                    style={{
                      backgroundColor: customization.showDepartures
                        ? `${theme.accentColor}30`
                        : `${theme.accentColor}10`,
                      color: theme.textColor,
                      outlineColor: theme.accentColor,
                    }}
                  >
                    <div className="text-2xl mb-1">🚇</div>
                    <div className="text-xs font-bold">Transit</div>
                    <div className="text-[10px]" style={{ color: theme.textSecondary }}>
                      {customization.showDepartures ? 'Visible' : 'Hidden'}
                    </div>
                  </button>

                  {/* Date Widget */}
                  <button
                    onClick={() => updateCustomization({ showDate: !customization.showDate })}
                    className={`p-3 rounded-lg transition-all text-left ${
                      customization.showDate ? 'ring-2' : ''
                    }`}
                    style={{
                      backgroundColor: customization.showDate
                        ? `${theme.accentColor}30`
                        : `${theme.accentColor}10`,
                      color: theme.textColor,
                      outlineColor: theme.accentColor,
                    }}
                  >
                    <div className="text-2xl mb-1">📅</div>
                    <div className="text-xs font-bold">Date</div>
                    <div className="text-[10px]" style={{ color: theme.textSecondary }}>
                      {customization.showDate ? 'Visible' : 'Hidden'}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
