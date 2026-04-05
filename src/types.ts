// Weather API types
export interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  name: string;
}

// Transit API types
export interface Departure {
  tripId: string;
  stop: {
    name: string;
  };
  when: string;
  delay: number | null;
  platform: string | null;
  direction: string;
  line: {
    name: string;
    mode: string;
    product: string;
  };
}

export interface DeparturesData {
  departures: Departure[];
}

// UI state types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface DataState<T> {
  data: T | null;
  status: LoadingState;
  error: string | null;
}

// Theme Customization types
export interface ThemeCustomization {
  clockStyle: 'digital' | 'analog-classic' | 'analog-modern' | 'analog-minimal' | 'analog-luxury' | 
              'analog-california' | 'analog-contour' | 'analog-chronograph' | 'analog-utility' | 'digital-mono' |
              // Haute Horlogerie - Premium Mechanical
              'analog-grand-complication' | 'analog-perpetual-calendar' | 'analog-moonphase' | 
              'analog-tourbillon' | 'analog-worldtime' | 'analog-power-reserve' |
              // Classic Dress Watches
              'analog-bauhaus' | 'analog-dress-elegant' | 'analog-skeleton' | 'analog-art-deco' |
              // Sport & Professional
              'analog-pilot' | 'analog-diver' | 'analog-racing' | 'analog-military' |
              // Avant-Garde
              'analog-asymmetric' | 'analog-retrograde' | 'analog-digital-hybrid' | 'analog-jumping-hour' |
              // Heritage Collections
              'analog-railroad' | 'analog-pocket-watch' | 'analog-marine-chronometer' | 'analog-observatoire' |
              // Artistic Collection
              'analog-neon-plasma' | 'analog-crystal-prism' | 'analog-kintsugi' | 'analog-astrolabe' | 'analog-vortex-orrery';
  clockSize: 'small' | 'medium' | 'large';
  showWeather: boolean;
  showDepartures: boolean;
  showDate: boolean;
  layout: 'default' | 'centered' | 'compact' | 'split' | 'minimal';
  clockColor?: string;
  accentColor?: string;
  showSeconds: boolean;
  showComplications: boolean;
}

export const DEFAULT_CUSTOMIZATION: ThemeCustomization = {
  clockStyle: 'digital',
  clockSize: 'medium',
  showWeather: true,
  showDepartures: true,
  showDate: true,
  layout: 'default',
  showSeconds: true,
  showComplications: true,
};
