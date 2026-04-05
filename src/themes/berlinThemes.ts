import { Theme } from './types';

export const berlinThemes: Theme[] = [

  // ─────────────────────────────────────────────────────────────
  // BVG YELLOW  —  U-Bahn underground station
  //   Identity: The official BVG transit grid. Helmut Lorenz-designed
  //   network maps, yellow line intersections, the tunnel void.
  // ─────────────────────────────────────────────────────────────
  {
    id: 'bvg-yellow',
    name: 'BVG Yellow',
    background: [
      // Warm underglow — fluorescent platform light bleeding from below
      'radial-gradient(ellipse 100% 42% at 50% 108%, rgba(255,215,0,0.10) 0%, transparent 55%)',
      // The tunnel void — pure near-black with faint warmth
      'linear-gradient(180deg, #020200 0%, #070500 50%, #020100 100%)',
    ].join(', '),
    timeColor: '#FFD700',
    textColor: '#ffffff',
    textSecondary: 'rgba(255,215,0,0.55)',
    accentColor: '#FFD700',
    style: 'modern',
    clockStyle: 'digital',
    fontFamily: '"Helvetica Neue", "Arial", sans-serif',
  },

  // ─────────────────────────────────────────────────────────────
  // BERGHAIN  —  Industrial techno bunker, Friedrichshain
  //   Identity: Brutalist concrete slabs. Single cold warehouse
  //   ceiling lamp. Cross-hatched grey. No warmth. No colour.
  // ─────────────────────────────────────────────────────────────
  {
    id: 'berlin-night',
    name: 'Berghain',
    background: [
      // Cold overhead wash — single warehouse ceiling lamp
      'radial-gradient(ellipse 65% 22% at 50% -5%, rgba(0,240,255,0.11) 0%, rgba(0,190,255,0.04) 55%, transparent 100%)',
      // Cross-hatch concrete texture — Brutalist bunker slabs
      'repeating-linear-gradient( 47deg, transparent 0, transparent 3px, rgba(255,255,255,0.011) 3px, rgba(255,255,255,0.011) 4px)',
      'repeating-linear-gradient(-47deg, transparent 0, transparent 3px, rgba(255,255,255,0.007) 3px, rgba(255,255,255,0.007) 4px)',
      // Dense black — no escape, no warmth
      'linear-gradient(180deg, #000000 0%, #040404 70%, #070707 100%)',
    ].join(', '),
    timeColor: '#00e5ff',
    textColor: '#c8eeff',
    textSecondary: 'rgba(0,229,255,0.40)',
    accentColor: '#00e5ff',
    style: 'modern',
    clockStyle: 'digital',
    fontFamily: '"Courier New", "Roboto Mono", monospace',
  },

  // ─────────────────────────────────────────────────────────────
  // BERLINER DOM  —  Cathedral on Museum Island
  //   Identity: Dark volcanic stone interior. Golden dome light
  //   flooding down from the lantern above. Gothic tracery lattice.
  //   Weight, reverence, amber grandeur.
  // ─────────────────────────────────────────────────────────────
  {
    id: 'berliner-dom',
    name: 'Berliner Dom',
    background: [
      // Dome apex light — the lantern above floods downward
      'radial-gradient(ellipse 62% 55% at 50% 108%, rgba(255,190,50,0.44) 0%, rgba(201,168,76,0.17) 38%, transparent 68%)',
      // Hotter bright centre of the chandelier
      'radial-gradient(ellipse 26% 18% at 50% 114%, rgba(255,225,100,0.32) 0%, transparent 52%)',
      // Diagonal stone tracery — gothic ribbed vaulting
      'repeating-linear-gradient(154deg, transparent 0, transparent 33px, rgba(201,168,76,0.032) 33px, rgba(201,168,76,0.032) 34px)',
      'repeating-linear-gradient( 26deg, transparent 0, transparent 33px, rgba(201,168,76,0.018) 33px, rgba(201,168,76,0.018) 34px)',
      // Obsidian-warm dark stone
      'linear-gradient(180deg, #010000 0%, #0e0700 48%, #030100 100%)',
    ].join(', '),
    timeColor: '#C9A84C',
    textColor: '#f5e6c8',
    textSecondary: 'rgba(201,168,76,0.50)',
    accentColor: '#C9A84C',
    style: 'luxury',
    clockStyle: 'analog-dress-elegant',
    fontFamily: '"Georgia", "Times New Roman", serif',
  },

  // ─────────────────────────────────────────────────────────────
  // FERNSEHTURM  —  The TV Tower, Alexanderplatz
  //   Identity: Karl Savery's 1969 modernist marvel. Precise
  //   orthogonal grid (the new Berlin master plan). The silver
  //   sphere visible from every neighbourhood.
  // ─────────────────────────────────────────────────────────────
  {
    id: 'berlin-mitte',
    name: 'Fernsehturm',
    background: [
      // The silver sphere — glowing 368m up
      'radial-gradient(circle 145px at 50% 20%, rgba(165,215,255,0.15) 0%, rgba(90,155,230,0.05) 46%, transparent 76%)',
      // Precise modernist grid — Karl Savery's urban master plan
      'repeating-linear-gradient(90deg, transparent 0, transparent 59px, rgba(255,255,255,0.028) 59px, rgba(255,255,255,0.028) 60px)',
      'repeating-linear-gradient( 0deg, transparent 0, transparent 59px, rgba(255,255,255,0.018) 59px, rgba(255,255,255,0.018) 60px)',
      // Near-void — Berlin granite
      'linear-gradient(180deg, #010101 0%, #060606 100%)',
    ].join(', '),
    timeColor: '#ffffff',
    textColor: '#ffffff',
    textSecondary: 'rgba(255,255,255,0.38)',
    accentColor: '#CC0000',
    style: 'minimal',
    clockStyle: 'analog-pilot',
    fontFamily: '"Helvetica Neue", "Arial", sans-serif',
  },

  // ─────────────────────────────────────────────────────────────
  // EAST SIDE GALLERY  —  1.3 km of the Berlin Wall, Mühlenstraße
  //   Identity: Exposed concrete panels painted over 100 times.
  //   Horizontal colour bands — the mural layers compressed into
  //   geological strata. Fine mortar lines. Raw.
  // ─────────────────────────────────────────────────────────────
  {
    id: 'east-side',
    name: 'East Side Gallery',
    background: [
      // Horizontal paint-band stratigraphy — 118 mural sections
      'linear-gradient(180deg,' +
        'rgba(218,45,45,0.24) 0%,   rgba(200,20,20,0.05) 20%,' +
        'rgba(40,100,210,0.20) 20%, rgba(30,80,195,0.05) 40%,' +
        'rgba(220,160,20,0.20) 40%, rgba(205,140,15,0.05) 60%,' +
        'rgba(30,165,80,0.17) 60%,  rgba(20,145,65,0.04) 80%,' +
        'rgba(165,40,210,0.18) 80%, rgba(140,25,185,0.04) 100%)',
      // Fine vertical concrete texture — aggregate surface
      'repeating-linear-gradient(91deg, transparent 0, transparent 1px, rgba(255,255,255,0.018) 1px, rgba(255,255,255,0.018) 2px)',
      // Horizontal mortar lines — panel joints at 12 cm intervals
      'repeating-linear-gradient(0deg,  transparent 0, transparent 11px, rgba(255,255,255,0.012) 11px, rgba(255,255,255,0.012) 12px)',
      // Raw concrete slab grey
      'linear-gradient(180deg, #101010 0%, #1c1c1c 50%, #101010 100%)',
    ].join(', '),
    timeColor: '#ff4081',
    textColor: '#ffffff',
    textSecondary: 'rgba(255,255,255,0.55)',
    accentColor: '#ff4081',
    style: 'modern',
    clockStyle: 'analog-racing',
    fontFamily: '"Impact", "Arial Black", sans-serif',
  },

  // ─────────────────────────────────────────────────────────────
  // POTSDAMER PLATZ  —  Sony Center glass canopy
  //   Identity: Helmut Jahn's 2000 glass-and-steel tent roof.
  //   12 radial steel spokes converging to an oculus. Cool
  //   blue glass panels. The new Berlin corporate core.
  // ─────────────────────────────────────────────────────────────
  {
    id: 'potsdamer-platz',
    name: 'Potsdamer Platz',
    background: [
      // Radial steel spokes — Helmut Jahn's Sony Center canopy
      'repeating-conic-gradient(from 90deg at 50% 50%, rgba(60,125,255,0.09) 0deg 7deg, transparent 7deg 30deg)',
      // Ambient deep-blue glass haze — the IMAX dome effect
      'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(18,65,175,0.18) 0%, rgba(5,25,85,0.09) 55%, transparent 80%)',
      // Glass reflection glint at the oculus top
      'radial-gradient(ellipse 45% 18% at 50% 0%, rgba(100,165,255,0.12) 0%, transparent 70%)',
      // Midnight blue — looking up at winter night sky through glass
      'linear-gradient(180deg, #000c22 0%, #001438 55%, #000b1c 100%)',
    ].join(', '),
    timeColor: '#4488ff',
    textColor: '#e8f0ff',
    textSecondary: 'rgba(100,160,255,0.50)',
    accentColor: '#4488ff',
    style: 'modern',
    clockStyle: 'analog-pilot',
    fontFamily: '"Roboto", "Inter", sans-serif',
  },

  // ─────────────────────────────────────────────────────────────
  // KREUZBERG  —  SO36, Görlitzer Park, kebab culture, Kanal
  //   Identity: Warm amber sodium street lamps over rough
  //   render. Bohemian, lived-in, multicultural. The anti-Mitte.
  // ─────────────────────────────────────────────────────────────
  {
    id: 'kreuzberg',
    name: 'Kreuzberg',
    background: [
      // Sodium street-lamp scatter — the warm pools down each Kiez Straße
      'radial-gradient(ellipse 40% 35% at 22% 72%, rgba(255,165,30,0.18) 0%, transparent 65%)',
      'radial-gradient(ellipse 30% 28% at 78% 55%, rgba(255,145,20,0.14) 0%, transparent 60%)',
      'radial-gradient(ellipse 25% 20% at 55% 88%, rgba(255,175,40,0.11) 0%, transparent 55%)',
      // Rough render diagonal micro-texture
      'repeating-linear-gradient(63deg, transparent 0, transparent 2px, rgba(255,140,0,0.018) 2px, rgba(255,140,0,0.018) 3px)',
      'repeating-linear-gradient(-27deg, transparent 0, transparent 3px, rgba(255,140,0,0.011) 3px, rgba(255,140,0,0.011) 4px)',
      // Warm, lived-in dark — not the cold modernist black
      'linear-gradient(160deg, #0e0600 0%, #1a0d00 40%, #0a0400 100%)',
    ].join(', '),
    timeColor: '#ff9d2e',
    textColor: '#ffe4b8',
    textSecondary: 'rgba(255,157,46,0.50)',
    accentColor: '#ff9d2e',
    style: 'modern',
    clockStyle: 'digital',
    fontFamily: '"Georgia", "Times New Roman", serif',
  },

  // ─────────────────────────────────────────────────────────────
  // HAUPTBAHNHOF  —  Berlin Central Station
  //   Identity: Meinhard von Gerkan's 2006 glass-and-steel
  //   cathedral. Five levels of intersecting platforms. Steel
  //   lattice diffusing northern light. Arrival and departure.
  // ─────────────────────────────────────────────────────────────
  {
    id: 'hauptbahnhof',
    name: 'Hauptbahnhof',
    background: [
      // Diffused northern light from the barrel-vault glass roof
      'radial-gradient(ellipse 100% 35% at 50% -8%, rgba(220,235,255,0.14) 0%, rgba(180,210,255,0.05) 50%, transparent 80%)',
      // Steel lattice — horizontal + vertical structural members
      'repeating-linear-gradient(90deg, transparent 0, transparent 29px, rgba(200,220,255,0.040) 29px, rgba(200,220,255,0.040) 30px)',
      'repeating-linear-gradient( 0deg, transparent 0, transparent 14px, rgba(200,220,255,0.025) 14px, rgba(200,220,255,0.025) 15px)',
      // Diagonal glazing bars — the roof's cross-bracing
      'repeating-linear-gradient(55deg, transparent 0, transparent 59px, rgba(200,220,255,0.018) 59px, rgba(200,220,255,0.018) 60px)',
      // Polished concrete and steel grey — platform feel
      'linear-gradient(180deg, #070a10 0%, #0d1220 50%, #050810 100%)',
    ].join(', '),
    timeColor: '#c8deff',
    textColor: '#e0ecff',
    textSecondary: 'rgba(180,210,255,0.50)',
    accentColor: '#5b9eff',
    style: 'modern',
    clockStyle: 'digital',
    fontFamily: '"Roboto", "Helvetica Neue", sans-serif',
  },
];
