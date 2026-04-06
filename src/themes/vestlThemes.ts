import { Theme } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// VESTL NATIVE THEMES — designed specifically for the 3:1 wide display
// Departure board first. Everything else is ambient.
// ─────────────────────────────────────────────────────────────────────────────

export const vestlThemes: Theme[] = [

  // ── SIGNAL ───────────────────────────────────────────────────────────────────
  // Cold precision. Pure black void. Information is the design.
  // No decoration. No gradients. Just the data, brutally clear.
  // Reference: Swiss airport departure boards, Braun products, Dieter Rams.
  {
    id: 'vestl-signal',
    name: 'Signal',
    background: '#050505',
    timeColor: '#FFFFFF',
    textColor: '#FFFFFF',
    textSecondary: 'rgba(255,255,255,0.38)',
    accentColor: '#F59E0B',
    fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
    style: 'modern',
    clockStyle: 'digital',
    layout: 'default',
  },

  // ── BVG BOARD ────────────────────────────────────────────────────────────────
  // The real thing. Amber LED on black. Siemens departure board aesthetic.
  // Clock on left, Linie / Ziel / Abfahrt table on right.
  {
    id: 'vestl-bvg',
    name: 'BVG Board',
    background: '#000000',
    timeColor: '#ffffff',
    textColor: '#ffb200',
    textSecondary: 'rgba(220,218,210,0.65)',
    accentColor: '#ffb200',
    fontFamily: "'Courier New', 'Courier', monospace",
    style: 'retro',
    clockStyle: 'analog-classic',
    layout: 'default',
  },

  // ── EMBER ────────────────────────────────────────────────────────────────────
  // Warm amber darkness. The glow of a premium instrument at dusk.
  // Champagne dial meets transit board. Warm without being soft.
  // Reference: Aged brass, IWC Pilot 3717, night cockpit instrumentation.
  {
    id: 'vestl-ember',
    name: 'Ember',
    background: [
      'radial-gradient(ellipse 80% 60% at 18% 50%, rgba(180,110,20,0.06) 0%, transparent 65%)',
      'linear-gradient(160deg, #0C0800 0%, #0A0600 50%, #080500 100%)',
    ].join(', '),
    timeColor: '#C8891E',
    textColor: 'rgba(255,238,200,0.92)',
    textSecondary: 'rgba(200,137,30,0.50)',
    accentColor: '#C8891E',
    fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
    style: 'luxury',
    clockStyle: 'digital',
    layout: 'default',
  },
];
