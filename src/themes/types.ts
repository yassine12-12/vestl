export interface Theme {
  id: string;
  name: string;
  background: string;
  backgroundImage?: string;
  timeColor: string;
  textColor: string;
  textSecondary: string;
  accentColor: string;
  glassEffect?: boolean;
  fontFamily?: string;
  animation?: string;
  borderRadius?: string;
  style?: 'modern' | 'minimal' | 'retro' | 'brutalist' | 'glass' | 'luxury' | 'sport';
  clockStyle?: 'digital' | 'analog-classic' | 'analog-modern' | 'analog-minimal' | 'analog-luxury' 
    | 'analog-bauhaus' | 'analog-skeleton' | 'analog-pilot' | 'analog-diver' | 'analog-grand-complication' 
    | 'analog-moonphase' | 'analog-racing' | 'analog-dress-elegant';
  layout?: 'default' | 'centered' | 'split' | 'minimal';
}
