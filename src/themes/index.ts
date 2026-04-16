import { Theme } from './types';
import { vestlThemes } from './vestlThemes';
import { defaultThemes } from './defaultThemes';
import { berlinThemes } from './berlinThemes';
import { animeThemes } from './animeThemes';
import { movieThemes } from './movieThemes';
import { luxuryThemes } from './luxuryThemes';
import { transitThemes } from './transitThemes';
import { modernMinimalThemes } from './modernMinimalThemes';
import { vibrantGradientThemes } from './vibrantGradientThemes';
import { officialTransitThemes } from './officialTransitThemes';

// VESTL native themes first, then everything else
export const themes: Theme[] = [
  ...vestlThemes,
  ...officialTransitThemes,
  ...berlinThemes,
  ...defaultThemes,
  ...transitThemes,
  ...modernMinimalThemes,
  ...vibrantGradientThemes,
  ...animeThemes,
  ...movieThemes,
  ...luxuryThemes,
];

// Helper function to get a theme by ID
export const getTheme = (themeId: string): Theme => {
  return themes.find(t => t.id === themeId) || themes[0];
};

// Re-export individual theme arrays for categorization if needed
export {
  officialTransitThemes,
  berlinThemes,
  defaultThemes,
  transitThemes,
  modernMinimalThemes,
  vibrantGradientThemes,
  animeThemes,
  movieThemes,
  luxuryThemes
};

// Export the Theme type for use in other files
export type { Theme } from './types';
