export { BauhausClock } from './BauhausClock';
export { SkeletonClock } from './SkeletonClock';
export { PilotClock } from './PilotClock';
export { DiverClock } from './DiverClock';
export { ColorfulDigitalClock } from './ColorfulDigitalClock';
export { BinaryClock } from './BinaryClock';
export { GrandComplicationClock } from './GrandComplicationClock';
export { MoonphaseClock } from './MoonphaseClock';
export { RacingClock } from './RacingClock';
export { FlipClock } from './FlipClock';
export { SegmentClock } from './SegmentClock';
export { DressElegantClock } from './DressElegantClock';
export { ArtDecoClock } from './ArtDecoClock';
export { MilitaryClock } from './MilitaryClock';
export { WorldTimeClock } from './WorldTimeClock';
export { TourbillonClock } from './TourbillonClock';
export { PowerReserveClock } from './PowerReserveClock';
export { RetrogradeClock } from './RetrogradeClock';
export { RailroadClock } from './RailroadClock';
export { JumpingHourClock } from './JumpingHourClock';
export { AsymmetricClock } from './AsymmetricClock';
export { DigitalHybridClock } from './DigitalHybridClock';
// Artistic Collection
export { NeonPlasmaClock } from './NeonPlasmaClock';
export { CrystalPrismClock } from './CrystalPrismClock';
export { KintsugiClock } from './KintsugiClock';
export { AstrolabeClock } from './AstrolabeClock';
export { VortexOrrery } from './VortexOrrery';

// Clock style categories for organization
export const CLOCK_CATEGORIES = {
  HAUTE_HORLOGERIE: 'Haute Horlogerie',
  DRESS_WATCHES: 'Dress Watches',
  PROFESSIONAL: 'Professional',
  AVANT_GARDE: 'Avant-Garde',
  HERITAGE: 'Heritage',
  DIGITAL: 'Digital',
} as const;

// Available clock styles mapped to their components
export const CLOCK_STYLES = {
  // Haute Horlogerie
  'grand-complication': 'GrandComplicationClock',
  'perpetual-calendar': 'PerpetualCalendarClock',
  'moonphase': 'MoonphaseClock',
  'tourbillon': 'TourbillonClock',
  'worldtime': 'WorldTimeClock',
  'power-reserve': 'PowerReserveClock',
  
  // Dress Watches
  'bauhaus': 'BauhausClock',
  'dress-elegant': 'DressElegantClock',
  'skeleton': 'SkeletonClock',
  'art-deco': 'ArtDecoClock',
  
  // Professional
  'pilot': 'PilotClock',
  'diver': 'DiverClock',
  'racing': 'RacingClock',
  'military': 'MilitaryClock',
  
  // Avant-Garde
  'asymmetric': 'AsymmetricClock',
  'retrograde': 'RetrogradeClock',
  'digital-hybrid': 'DigitalHybridClock',
  'jumping-hour': 'JumpingHourClock',
  
  // Heritage
  'railroad': 'RailroadClock',
  'pocket-watch': 'PocketWatchClock',
  'marine-chronometer': 'MarineChronometerClock',
  'observatoire': 'ObservatoireClock',
  
  // Digital
  'colorful': 'ColorfulDigitalClock',
  'binary': 'BinaryClock',
  'flip': 'FlipClock',
  'segment': 'SegmentClock',
} as const;
