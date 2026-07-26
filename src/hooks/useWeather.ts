import { useState, useEffect, useRef } from 'react';
import { config } from '../config';
import { DataState, WeatherData } from '../types';

export const useWeather = (lat: number, lon: number) => {
  const [weatherState, setWeatherState] = useState<DataState<WeatherData>>({
    data: null,
    status: 'idle',
    error: null,
  });

  const lastData = useRef<WeatherData | null>(null);

  const fetchWeather = async () => {
    setWeatherState(prev => ({ ...prev, status: 'loading' }));

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code&temperature_unit=celsius`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
      }

      const rawData = await response.json();
      
      // Convert Open-Meteo format to our WeatherData format
      const weatherCode = rawData.current.weather_code;
      const weatherDescription = getWeatherDescription(weatherCode);
      const weatherIcon = getWeatherIcon(weatherCode);
      
      const data: WeatherData = {
        main: {
          temp: rawData.current.temperature_2m,
          feels_like: rawData.current.apparent_temperature,
          temp_min: rawData.current.temperature_2m - 2, // Approximation
          temp_max: rawData.current.temperature_2m + 2, // Approximation
          humidity: rawData.current.relative_humidity_2m,
        },
        weather: [{
          id: weatherCode,
          main: weatherDescription.main,
          description: weatherDescription.description,
          icon: weatherIcon,
        }],
        name: config.MY_ADDRESS.split(',')[0] || 'Location',
      };
      
      lastData.current = data;
      setWeatherState({
        data,
        status: 'success',
        error: null,
      });
    } catch (error) {
      setWeatherState({
        data: lastData.current,
        status: lastData.current ? 'success' : 'error',
        error: error instanceof Error ? error.message : 'Failed to fetch weather data',
      });
    }
  };

  useEffect(() => {
    lastData.current = null; // reset stale data when location changes
    fetchWeather();
    const interval = setInterval(fetchWeather, config.REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [lat, lon]);

  return weatherState;
};

// Convert WMO Weather codes to descriptions
function getWeatherDescription(code: number): { main: string; description: string } {
  const descriptions: Record<number, { main: string; description: string }> = {
    0: { main: 'Clear', description: 'clear sky' },
    1: { main: 'Clear', description: 'mainly clear' },
    2: { main: 'Clouds', description: 'partly cloudy' },
    3: { main: 'Clouds', description: 'overcast' },
    45: { main: 'Fog', description: 'foggy' },
    48: { main: 'Fog', description: 'depositing rime fog' },
    51: { main: 'Drizzle', description: 'light drizzle' },
    53: { main: 'Drizzle', description: 'moderate drizzle' },
    55: { main: 'Drizzle', description: 'dense drizzle' },
    61: { main: 'Rain', description: 'slight rain' },
    63: { main: 'Rain', description: 'moderate rain' },
    65: { main: 'Rain', description: 'heavy rain' },
    71: { main: 'Snow', description: 'slight snow' },
    73: { main: 'Snow', description: 'moderate snow' },
    75: { main: 'Snow', description: 'heavy snow' },
    77: { main: 'Snow', description: 'snow grains' },
    80: { main: 'Rain', description: 'slight rain showers' },
    81: { main: 'Rain', description: 'moderate rain showers' },
    82: { main: 'Rain', description: 'violent rain showers' },
    85: { main: 'Snow', description: 'slight snow showers' },
    86: { main: 'Snow', description: 'heavy snow showers' },
    95: { main: 'Thunderstorm', description: 'thunderstorm' },
    96: { main: 'Thunderstorm', description: 'thunderstorm with hail' },
    99: { main: 'Thunderstorm', description: 'thunderstorm with heavy hail' },
  };
  return descriptions[code] || { main: 'Unknown', description: 'unknown' };
}

// Convert WMO codes to icon codes (similar to OpenWeatherMap format)
function getWeatherIcon(code: number): string {
  const icons: Record<number, string> = {
    0: '01d', // Clear sky
    1: '01d', // Mainly clear
    2: '02d', // Partly cloudy
    3: '03d', // Overcast
    45: '50d', // Fog
    48: '50d', // Fog
    51: '09d', // Drizzle
    53: '09d',
    55: '09d',
    61: '10d', // Rain
    63: '10d',
    65: '10d',
    71: '13d', // Snow
    73: '13d',
    75: '13d',
    77: '13d',
    80: '09d', // Rain showers
    81: '09d',
    82: '09d',
    85: '13d', // Snow showers
    86: '13d',
    95: '11d', // Thunderstorm
    96: '11d',
    99: '11d',
  };
  return icons[code] || '01d';
}
