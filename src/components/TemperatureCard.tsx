import React from 'react';
import { DataState, WeatherData } from '../types';
import { Theme } from '../themes';

interface TemperatureCardProps {
  weatherState: DataState<WeatherData>;
  theme: Theme;
}

export const TemperatureCard: React.FC<TemperatureCardProps> = ({ weatherState, theme }) => {
  const { data, status } = weatherState;

  const getWeatherIcon = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
  };

  return (
    <div className="mb-4 slide-in">
      {status === 'loading' && (
        <div className="flex items-center space-x-2">
          <div className="shimmer w-10 h-10 rounded-full"></div>
          <div className="shimmer w-20 h-6 rounded"></div>
        </div>
      )}

      {status === 'error' && (
        <div 
          className="text-[10px]"
          style={{ color: theme.textSecondary }}
        >
          Weather unavailable
        </div>
      )}

      {status === 'success' && data && (
        <div className="flex items-center space-x-2">
          {data.weather[0] && (
            <img 
              src={getWeatherIcon(data.weather[0].icon)} 
              alt={data.weather[0].description}
              className="w-12 h-12 opacity-80"
            />
          )}
          <div>
            <div className="flex items-baseline space-x-2">
              <span 
                className="text-3xl font-extralight leading-none" 
                style={{ fontWeight: 200, color: theme.textColor }}
              >
                {Math.round(data.main.temp)}°
              </span>
              <span 
                className="text-[11px] font-light capitalize"
                style={{ color: theme.textSecondary }}
              >
                {data.weather[0]?.description || 'Clear'}
              </span>
            </div>
            <div 
              className="text-[9px] mt-1"
              style={{ color: theme.textSecondary }}
            >
              H:{Math.round(data.main.temp_max)}° · L:{Math.round(data.main.temp_min)}°
            </div>
          </div>
        </div>
      )}

      {status === 'idle' && (
        <div 
          className="text-[10px]"
          style={{ color: theme.textSecondary }}
        >
          Loading...
        </div>
      )}
    </div>
  );
};
