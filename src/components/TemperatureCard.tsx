import React from 'react';
import { DataState, WeatherData } from '../types';
import { Theme } from '../themes';
import { WeatherIcon } from './WeatherIcon';

interface TemperatureCardProps {
  weatherState: DataState<WeatherData>;
  theme: Theme;
}

export const TemperatureCard: React.FC<TemperatureCardProps> = ({ weatherState, theme }) => {
  const { data, status } = weatherState;

  if (status === 'loading') {
    return (
      <div className="flex items-center space-x-2">
        <div className="shimmer w-10 h-10 rounded-full" />
        <div className="shimmer w-20 h-6 rounded" />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="text-[10px]" style={{ color: theme.textSecondary }}>
        Weather unavailable
      </div>
    );
  }

  if (status === 'success' && data) {
    const temp = Math.round(data.main.temp);
    const feels = Math.round(data.main.feels_like);
    const desc = data.weather[0]?.description ?? '';
    const code = data.weather[0]?.id ?? 0;

    return (
      <div className="mb-4 flex items-center space-x-3">
        <WeatherIcon code={code} color={theme.textColor} size={44} />
        <div>
          <div className="flex items-baseline space-x-2">
            <span
              className="text-3xl leading-none"
              style={{ fontWeight: 200, color: theme.textColor, letterSpacing: '-0.04em' }}
            >
              {temp}°
            </span>
            <span
              className="text-[11px] font-light capitalize"
              style={{ color: theme.textSecondary, opacity: 0.55 }}
            >
              {desc}
            </span>
          </div>
          <div className="text-[9px] mt-1" style={{ color: theme.textSecondary, opacity: 0.35 }}>
            feels {feels}° · {data.main.humidity}% hum
          </div>
        </div>
      </div>
    );
  }

  return null;
};
