import React, { useState, useEffect } from 'react';
import { Theme } from '../themes';
import { DataState, WeatherData, ThemeCustomization } from '../types';
import { AnalogClock } from './AnalogClock';
import { ClockRenderer } from './ClockRenderer';
import { ThemeBackground } from './ThemeBackground';

interface LayoutProps {
  children: React.ReactNode;
  theme: Theme;
  weatherState: DataState<WeatherData>;
  customization: ThemeCustomization;
}

export const Layout: React.FC<LayoutProps> = ({ children, theme, weatherState, customization }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dateString = now.toLocaleDateString('en-US', {
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  }).toUpperCase();

  const isAnalogClock = customization.clockStyle.startsWith('analog-');
  const analogClockStyle = customization.clockStyle.replace('analog-', '') as 'classic' | 'modern' | 'minimal' | 'luxury' | 'california' | 'contour' | 'chronograph' | 'utility' || 'classic';
  
  // Premium watch styles (without analog- prefix)
  const premiumStyles = [
    'grand-complication', 'perpetual-calendar', 'moonphase', 'tourbillon',
    'worldtime', 'power-reserve', 'bauhaus', 'dress-elegant', 'skeleton',
    'art-deco', 'pilot', 'diver', 'racing', 'military', 'asymmetric',
    'retrograde', 'digital-hybrid', 'jumping-hour', 'railroad', 'pocket-watch',
    'marine-chronometer', 'observatoire', 'colorful', 'binary', 'flip', 'segment'
  ];
  // Strip analog- prefix for comparison
  const styleWithoutPrefix = customization.clockStyle.replace('analog-', '').replace('digital-', '');
  const isPremiumClock = premiumStyles.includes(styleWithoutPrefix);
  
  const clockSizes = {
    small: 180,
    medium: 280,
    large: 360,
  };
  const clockSize = clockSizes[customization.clockSize];

  // Render clock helper function
  const renderClock = () => {
    if (isPremiumClock) {
      return (
        <ClockRenderer
          size={clockSize}
          color={theme.timeColor}
          backgroundColor={theme.background.includes('gradient') ? 'rgba(0,0,0,0.2)' : 'transparent'}
          style={styleWithoutPrefix as any}
          showSeconds={customization.showSeconds}
          showComplications={customization.showComplications}
        />
      );
    } else if (isAnalogClock) {
      return (
        <AnalogClock
          size={clockSize}
          color={theme.timeColor}
          backgroundColor={theme.background.includes('gradient') ? 'rgba(0,0,0,0.2)' : 'transparent'}
          showNumbers={true}
          style={analogClockStyle}
          showSeconds={customization.showSeconds}
        />
      );
    } else {
      return (
        <h1 
          className="font-extralight tracking-tighter leading-none" 
          style={{ 
            fontSize: customization.clockSize === 'large' ? '16rem' : customization.clockSize === 'small' ? '10rem' : '14rem',
            fontWeight: 100, 
            letterSpacing: '-0.05em',
            color: theme.timeColor,
          }}
        >
          {now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          })}
        </h1>
      );
    }
  };

  // Different layouts
  if (customization.layout === 'split') {
    return (
      <div 
        className="min-h-screen flex"
        style={{ 
          position: 'relative',
          isolation: 'isolate',
          background: theme.background,
          backgroundImage: theme.backgroundImage,
          fontFamily: theme.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif',
        }}
      >
        <ThemeBackground themeId={theme.id} />
        {/* Left side - Time & Date (40% width) */}
        <div className="w-2/5 flex flex-col items-center justify-center p-12  border-r border-white/10" style={{ position: 'relative', zIndex: 1 }}>
          {/* Large Clock */}
          <div className="mb-6">
            {renderClock()}
          </div>
          
          {/* Date */}
          {customization.showDate && (
            <p 
              className="text-xl font-light tracking-wide text-center mb-8"
              style={{ color: theme.textSecondary }}
            >
              {dateString}
            </p>
          )}

          {/* Weather at bottom of left side */}
          {customization.showWeather && weatherState.status === 'success' && weatherState.data && (
            <div className="mt-auto ">
              <div className="flex items-center justify-center space-x-4">
                {weatherState.data.weather[0] && (
                  <img 
                    src={`https://openweathermap.org/img/wn/${weatherState.data.weather[0].icon}@4x.png`}
                    alt={weatherState.data.weather[0].description}
                    className="w-20 h-20 opacity-90"
                  />
                )}
                <div>
                  <div className="flex items-baseline space-x-2">
                    <span 
                      className="text-5xl font-extralight leading-none" 
                      style={{ fontWeight: 200, color: theme.textColor }}
                    >
                      {Math.round(weatherState.data.main.temp)}°
                    </span>
                  </div>
                  <span 
                    className="text-sm font-light capitalize mt-1 block"
                    style={{ color: theme.textSecondary }}
                  >
                    {weatherState.data.weather[0]?.description || 'Clear'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Right side - Transit Info (60% width) */}
        <div className="w-3/5 flex items-center p-12" style={{ position: 'relative', zIndex: 1 }}>
          {customization.showDepartures && (
            <div className="w-full ">
              {children}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (customization.layout === 'centered') {
    return (
      <div 
        className="min-h-screen flex flex-col items-center justify-center"
        style={{ 
          position: 'relative',
          isolation: 'isolate',
          background: theme.background,
          backgroundImage: theme.backgroundImage,
          fontFamily: theme.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif',
        }}
      >
        <ThemeBackground themeId={theme.id} />
        {/* Centered Clock */}
        <div className="mb-8 ">
          {renderClock()}
          {customization.showDate && (
            <p 
              className="text-sm font-medium tracking-wider text-center mt-4"
              style={{ color: theme.textSecondary }}
            >
              {dateString}
            </p>
          )}
        </div>

        {/* Weather */}
        {customization.showWeather && weatherState.status === 'success' && weatherState.data && (
          <div className="mb-8 ">
            <div className="flex items-center space-x-2">
              {weatherState.data.weather[0] && (
                <img 
                  src={`https://openweathermap.org/img/wn/${weatherState.data.weather[0].icon}@4x.png`}
                  alt={weatherState.data.weather[0].description}
                  className="w-12 h-12 opacity-80"
                />
              )}
              <div>
                <div className="flex items-baseline space-x-1.5">
                  <span 
                    className="text-3xl font-extralight leading-none" 
                    style={{ fontWeight: 200, color: theme.textColor }}
                  >
                    {Math.round(weatherState.data.main.temp)}°
                  </span>
                  <span 
                    className="text-[10px] font-light capitalize"
                    style={{ color: theme.textSecondary }}
                  >
                    {weatherState.data.weather[0]?.description || 'Clear'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {customization.showDepartures && (
          <div className="w-full max-w-4xl ">
            {children}
          </div>
        )}
      </div>
    );
  }

  if (customization.layout === 'minimal') {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-8"
        style={{ 
          position: 'relative',
          isolation: 'isolate',
          background: theme.background,
          backgroundImage: theme.backgroundImage,
          fontFamily: theme.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif',
        }}
      >
        <ThemeBackground themeId={theme.id} />
        <div className="w-full max-w-6xl">
          {/* Top section - Clock and Weather in a row */}
          <div className="flex items-center justify-between mb-12 ">
            <div>
              {renderClock()}
              {customization.showDate && (
                <p 
                  className="text-lg font-light tracking-wide mt-4"
                  style={{ color: theme.textSecondary }}
                >
                  {dateString}
                </p>
              )}
            </div>

            {customization.showWeather && weatherState.status === 'success' && weatherState.data && (
              <div className="flex items-center space-x-6">
                {weatherState.data.weather[0] && (
                  <img 
                    src={`https://openweathermap.org/img/wn/${weatherState.data.weather[0].icon}@4x.png`}
                    alt={weatherState.data.weather[0].description}
                    className="w-24 h-24 opacity-90"
                  />
                )}
                <div>
                  <span 
                    className="text-6xl font-extralight leading-none block" 
                    style={{ fontWeight: 200, color: theme.textColor }}
                  >
                    {Math.round(weatherState.data.main.temp)}°
                  </span>
                  <span 
                    className="text-base font-light capitalize mt-2 block"
                    style={{ color: theme.textSecondary }}
                  >
                    {weatherState.data.weather[0]?.description || 'Clear'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom section - Departures */}
          {customization.showDepartures && (
            <div className="">
              {children}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (customization.layout === 'compact') {
    return (
      <div 
        className="min-h-screen flex flex-col p-4"
        style={{ 
          position: 'relative',
          isolation: 'isolate',
          background: theme.background,
          backgroundImage: theme.backgroundImage,
          fontFamily: theme.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif',
        }}
      >
        <ThemeBackground themeId={theme.id} />
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-4 ">
          {/* Clock */}
          <div className="flex items-center space-x-4">
            {renderClock()}
            {customization.showDate && (
              <p 
                className="text-sm font-medium tracking-wider"
                style={{ color: theme.textSecondary }}
              >
                {dateString}
              </p>
            )}
          </div>

          {/* Weather */}
          {customization.showWeather && weatherState.status === 'success' && weatherState.data && (
            <div className="flex items-center space-x-2">
              {weatherState.data.weather[0] && (
                <img 
                  src={`https://openweathermap.org/img/wn/${weatherState.data.weather[0].icon}@4x.png`}
                  alt={weatherState.data.weather[0].description}
                  className="w-12 h-12 opacity-80"
                />
              )}
              <div>
                <div className="flex items-baseline space-x-1.5">
                  <span 
                    className="text-3xl font-extralight leading-none" 
                    style={{ fontWeight: 200, color: theme.textColor }}
                  >
                    {Math.round(weatherState.data.main.temp)}°
                  </span>
                  <span 
                    className="text-[10px] font-light capitalize"
                    style={{ color: theme.textSecondary }}
                  >
                    {weatherState.data.weather[0]?.description || 'Clear'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        {customization.showDepartures && (
          <div className="flex-1 ">
            {children}
          </div>
        )}
      </div>
    );
  }

  // Default layout
  return (
    <div 
      className="min-h-screen flex"
      style={{ 
        position: 'relative',
        isolation: 'isolate',
        background: theme.background,
        backgroundImage: theme.backgroundImage,
        fontFamily: theme.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <ThemeBackground themeId={theme.id} />
      {/* Left side - Time (1/3 width, full height) */}
      <div className="w-1/3 flex items-center justify-center p-6" style={{ position: 'relative', zIndex: 1 }}>
        {/* Time - Compact */}
        <div className="flex flex-col items-center">
          <div className="mb-4">
            {renderClock()}
          </div>
          {customization.showDate && (
            <p 
              className="text-sm font-medium tracking-wider"
              style={{ color: theme.textSecondary }}
            >
              {dateString}
            </p>
          )}
        </div>
      </div>
      
      {/* Right side - Content (2/3 width) */}
      <div className="w-2/3 flex flex-col justify-center p-8 pl-4" style={{ position: 'relative', zIndex: 1 }}>
        <div className="flex items-start space-x-6">
          {/* Weather - Left side */}
          {customization.showWeather && weatherState.status === 'success' && weatherState.data && (
            <div className="flex-shrink-0 ">
              <div className="flex flex-col items-center space-y-2">
                {weatherState.data.weather[0] && (
                  <img 
                    src={`https://openweathermap.org/img/wn/${weatherState.data.weather[0].icon}@4x.png`}
                    alt={weatherState.data.weather[0].description}
                    className="w-16 h-16 opacity-80"
                  />
                )}
                <div className="text-center">
                  <div className="flex flex-col">
                    <span 
                      className="text-4xl font-extralight leading-none" 
                      style={{ fontWeight: 200, color: theme.textColor }}
                    >
                      {Math.round(weatherState.data.main.temp)}°
                    </span>
                    <span 
                      className="text-xs font-light capitalize mt-1"
                      style={{ color: theme.textSecondary }}
                    >
                      {weatherState.data.weather[0]?.description || 'Clear'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Departures */}
          {customization.showDepartures && (
            <div className="flex-1 ">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
