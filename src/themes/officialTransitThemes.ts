import { Theme } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// OFFICIAL TRANSIT THEMES — BVG & DB authentic brand identities
// Colors sourced from official corporate design systems.
//   BVG Yellow:    #FFD800  (BVG Gelb, Pantone 109 C)
//   BVG U-Bahn:   #0050A0  (U-Bahn badge blue)
//   DB Red:        #EC0016  (DB Rot, primary corporate color)
//   DB Anthrazit:  #282D37  (DB dark background system)
//   DB S-Bahn:     #007734  (S-Bahn Berlin green)
//   DB ICE Blue:   #309FD1  (ICE info displays)
// ─────────────────────────────────────────────────────────────────────────────

export const officialTransitThemes: Theme[] = [

  // ── BVG GELB ─────────────────────────────────────────────────────────────────
  // The 2021 BVG rebrand. Unapologetically yellow on black.
  // "Weil wir dich lieben." Bold, direct, unmistakably Berlin.
  // Reference: BVG corporate identity, platform signage, Netzplan poster.
  {
    id: 'bvg-corporate',
    name: 'BVG Gelb',
    background: [
      // BVG yellow panel glow — like a backlit Haltestellenschild
      'radial-gradient(ellipse 95% 45% at 50% 112%, rgba(255,216,0,0.38) 0%, rgba(255,216,0,0.10) 45%, transparent 70%)',
      // Netzplan grid — the Berlin transit network map cross-hatch
      'repeating-linear-gradient(  0deg, transparent 0, transparent 59px, rgba(255,216,0,0.022) 59px, rgba(255,216,0,0.022) 60px)',
      'repeating-linear-gradient( 90deg, transparent 0, transparent 59px, rgba(255,216,0,0.014) 59px, rgba(255,216,0,0.014) 60px)',
      // BVG black — the void the yellow cuts through
      'linear-gradient(180deg, #000000 0%, #020100 100%)',
    ].join(', '),
    timeColor: '#FFD800',
    textColor: '#FFFFFF',
    textSecondary: 'rgba(255,216,0,0.55)',
    accentColor: '#FFD800',
    fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
    style: 'brutalist',
    clockStyle: 'digital',
    layout: 'default',
  },

  // ── BVG U-BAHN ───────────────────────────────────────────────────────────────
  // The underground. Fluorescent platform tubes, cold tile walls, blue "U" badge.
  // 89 stations. The deepest is Rathaus Steglitz at −21 m.
  // Reference: U-Bahn platform design, Strausberger Platz, the blue U-sign.
  {
    id: 'bvg-ubahn',
    name: 'BVG U-Bahn',
    background: [
      // Overhead fluorescent wash — platform ceiling tubes
      'radial-gradient(ellipse 100% 28% at 50% -6%, rgba(0,80,160,0.28) 0%, rgba(0,60,120,0.08) 55%, transparent 82%)',
      // Side platform pillars — columns every 8 m
      'radial-gradient(ellipse 18% 80% at  5% 50%, rgba(0,80,160,0.08) 0%, transparent 70%)',
      'radial-gradient(ellipse 18% 80% at 95% 50%, rgba(0,80,160,0.06) 0%, transparent 70%)',
      // Tile grid — the classic U-Bahn wall pattern
      'repeating-linear-gradient( 90deg, transparent 0, transparent 19px, rgba(0,80,160,0.045) 19px, rgba(0,80,160,0.045) 20px)',
      'repeating-linear-gradient(  0deg, transparent 0, transparent 19px, rgba(0,80,160,0.028) 19px, rgba(0,80,160,0.028) 20px)',
      // Tunnel black — the void behind the platform edge
      'linear-gradient(180deg, #000814 0%, #001028 55%, #000510 100%)',
    ].join(', '),
    timeColor: '#4d94ff',
    textColor: '#e0ecff',
    textSecondary: 'rgba(77,148,255,0.52)',
    accentColor: '#0050A0',
    fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
    style: 'modern',
    clockStyle: 'digital',
    layout: 'default',
  },

  // ── DB BAHN ──────────────────────────────────────────────────────────────────
  // Official Deutsche Bahn corporate identity. DB Anthrazit + DB Rot.
  // The departure board at Frankfurt Hbf. Precise, reliable, German.
  // Reference: DB Corporate Design Guide, station signage system.
  {
    id: 'db-corporate',
    name: 'DB Bahn',
    background: [
      // DB red cardinal underglow — the DB logo burns from below
      'radial-gradient(ellipse 65% 45% at 50% 112%, rgba(236,0,22,0.22) 0%, rgba(192,0,27,0.06) 50%, transparent 74%)',
      // Structural grid — DB station steel framework
      'repeating-linear-gradient(  0deg, transparent 0, transparent 79px, rgba(255,255,255,0.018) 79px, rgba(255,255,255,0.018) 80px)',
      'repeating-linear-gradient( 90deg, transparent 0, transparent 79px, rgba(255,255,255,0.010) 79px, rgba(255,255,255,0.010) 80px)',
      // DB Anthrazit — the official dark system background
      'linear-gradient(180deg, #1e2229 0%, #282D37 48%, #1c2028 100%)',
    ].join(', '),
    timeColor: '#EC0016',
    textColor: '#FFFFFF',
    textSecondary: 'rgba(255,255,255,0.52)',
    accentColor: '#EC0016',
    fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
    style: 'modern',
    clockStyle: 'digital',
    layout: 'default',
  },

  // ── DB ICE ───────────────────────────────────────────────────────────────────
  // Intercity-Express. 300 km/h. White aerodynamic nose, thin red stripe.
  // Precision-engineered silence. The flagship of German rail.
  // Reference: ICE 4 design language, DB ICE digital interiors.
  {
    id: 'db-ice',
    name: 'DB ICE',
    background: [
      // ICE blue-white speed wash — aerodynamic diffusion at 300 km/h
      'radial-gradient(ellipse 100% 22% at 50% 0%, rgba(48,159,209,0.18) 0%, rgba(0,102,179,0.05) 55%, transparent 82%)',
      // DB red velocity stripe — the thin red line along the body
      'linear-gradient(180deg, transparent 0%, transparent 91%, rgba(236,0,22,0.22) 91%, rgba(236,0,22,0.08) 100%)',
      // Motion blur lines — Doppler at speed
      'repeating-linear-gradient( 90deg, transparent 0, transparent 119px, rgba(255,255,255,0.022) 119px, rgba(255,255,255,0.022) 120px)',
      // Near-void dark — the tunnel entrance rushing toward you
      'linear-gradient(180deg, #040508 0%, #060a10 60%, #030407 100%)',
    ].join(', '),
    timeColor: '#FFFFFF',
    textColor: '#e8f0ff',
    textSecondary: 'rgba(48,159,209,0.58)',
    accentColor: '#EC0016',
    fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
    style: 'minimal',
    clockStyle: 'analog-modern',
    layout: 'default',
  },

  // ── DB S-BAHN BERLIN ─────────────────────────────────────────────────────────
  // The Berliner S-Bahn network: 340 km of elevated and surface track.
  // Forest green on dark steel. The twin of the U-Bahn above ground.
  // Reference: S-Bahn Berlin GmbH corporate colors, station signage.
  {
    id: 'db-sbahn',
    name: 'DB S-Bahn',
    background: [
      // S-Bahn green bloom — platform canopy light through leaves
      'radial-gradient(ellipse 90% 42% at 50% 110%, rgba(0,119,52,0.32) 0%, rgba(0,119,52,0.08) 48%, transparent 70%)',
      // Elevated track lattice — steel viaduct cross-members
      'repeating-linear-gradient( 90deg, transparent 0, transparent 39px, rgba(0,119,52,0.030) 39px, rgba(0,119,52,0.030) 40px)',
      'repeating-linear-gradient(  0deg, transparent 0, transparent 39px, rgba(0,119,52,0.018) 39px, rgba(0,119,52,0.018) 40px)',
      // Dark steel — the elevated railway at dusk
      'linear-gradient(180deg, #000d04 0%, #011505 55%, #000802 100%)',
    ].join(', '),
    timeColor: '#00a846',
    textColor: '#e0ffe8',
    textSecondary: 'rgba(0,168,70,0.52)',
    accentColor: '#007734',
    fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
    style: 'modern',
    clockStyle: 'digital',
    layout: 'default',
  },

  // ── DB NACHTZUG ──────────────────────────────────────────────────────────────
  // The overnight express. Darkness sliding past the window at 160 km/h.
  // DB red interior warmth against cold prussian-night glass.
  // Reference: DB Intercity Night, European Sleeper, ÖBB Nightjet.
  {
    id: 'db-nacht',
    name: 'DB Nachtzug',
    background: [
      // Train window frame interior glow — red corridor light leaking in
      'radial-gradient(ellipse 28% 70% at  6% 50%, rgba(236,0,22,0.14) 0%, transparent 68%)',
      'radial-gradient(ellipse 28% 70% at 94% 50%, rgba(236,0,22,0.10) 0%, transparent 68%)',
      // Condensation on the glass — fine horizontal streaks
      'repeating-linear-gradient(  0deg, transparent 0, transparent 27px, rgba(236,0,22,0.018) 27px, rgba(236,0,22,0.018) 28px)',
      // Prussian night — deep, cold, moving through Europe
      'linear-gradient(180deg, #010208 0%, #020412 55%, #010207 100%)',
    ].join(', '),
    timeColor: '#ff4444',
    textColor: '#ffe0e0',
    textSecondary: 'rgba(236,0,22,0.52)',
    accentColor: '#EC0016',
    fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
    style: 'luxury',
    clockStyle: 'analog-modern',
    layout: 'default',
  },
];
