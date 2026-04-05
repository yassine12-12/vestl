# AGENT MEMORY — VESTL

> This file is the canonical reference for any AI agent working on this codebase.
> Read it fully before making any changes. Update it when you add new systems.

---

## 1. What This Project Is

**VESTL is a physical product** — a Raspberry Pi + screen unit mounted at the entrance of a home or apartment. Residents glance at it before leaving: next transit departures, weather, time. No phone. No unlock. Just information at the door.

This repository is the **display software** that runs on the VESTL device (Chromium kiosk, full-screen, no interaction required).

**Target hardware:** Raspberry Pi 3B+ or newer, any HDMI screen (7" touch panel → full portrait monitor).  
**Product vision:** Sold as a design object with planned artist collab editions and clothing brand drops. Utility + collectible.

**Housing / enclosure:**
- Prototype → 3D printed (FDM/resin), simple minimal rectangular form, matte black
- Standard edition → refined 3D printed geometry, painted or powder coated
- Collab / premium editions → CNC machined aluminium or bespoke material, anodised/brushed finish
- Artist drops → housing material and finish defined per collaboration
- Design principle: must look like it belongs on a wall, not like a DIY build
- The software UI (dark, cinematic, full-bleed) is designed to complement a premium physical object — keep this in mind when making visual changes

The software shows:
- A **clock** (30+ styles — see §5)
- **Live U-Bahn / S-Bahn / Tram / Bus departures** from the nearest stop (auto-detected by GPS coords)
- **Live weather** (temperature, condition)
- **Berlin-themed SVG backgrounds** — landmark illustrations per theme

Stack: **Vite 5 + React 18 + TypeScript 5 + Tailwind CSS 3**  
Dev server: `npm run dev` → http://localhost:5173/  
No backend. No API keys. All data fetched client-side from public APIs.

---

## 2. File Map

```
src/
  App.tsx                    — Root component. Wires hooks → Layout → modals
  config.ts                  — Static config: address, lat/lon, transport lines, refresh interval
  types.ts                   — All shared TypeScript types (WeatherData, Departure, ThemeCustomization, DataState)
  themes.ts                  — Re-exports (kept for backward compat, real logic in themes/)
  index.css                  — Global styles (shimmer animation, base resets)
  main.tsx                   — Vite entry point

  hooks/
    useWeather.ts            — Fetches weather from open-meteo.com (no API key needed)
    useDepartures.ts         — Fetches departures from v6.bvg.transport.rest (no API key needed)

  components/
    Layout.tsx               — 5 layout variants (default, split, centered, minimal, compact)
                               Each variant renders: ThemeBackground → clock → date → weather → departures
    ThemeBackground.tsx      — SVG landmark illustrations, one per Berlin theme ID (see §6)
    ClockRenderer.tsx        — Switch-case dispatcher: clockStyle string → individual clock component
    AnalogClock.tsx          — Simple analog clock (classic/modern/minimal/luxury/california/contour/chronograph/utility)
    PremiumAnalogClock.tsx   — Wrapper for premium watch-style clocks
    ClockPreview.tsx         — Thumbnail previews used inside CustomizationModal
    CustomizationModal.tsx   — Right-side drawer: clock picker, layout picker, toggles
    SettingsModal.tsx        — Address / location / hidden modes settings
    ThemeSelector.tsx        — Bottom bar for switching themes
    DeparturesCard.tsx       — Renders grouped departures (subway/suburban/tram/bus)
    TemperatureCard.tsx      — Standalone weather display component

    clocks/                  — Individual premium clock components (SVG-based)
      index.ts               — Exports all clocks + CLOCK_CATEGORIES + CLOCK_STYLES maps
      [ClockName].tsx        — See §5 for full list

  themes/
    index.ts                 — Aggregates all theme arrays: berlinThemes first, then rest
    types.ts                 — Theme interface definition
    berlinThemes.ts          — 8 Berlin-specific themes (see §4)
    defaultThemes.ts
    transitThemes.ts
    modernMinimalThemes.ts
    vibrantGradientThemes.ts
    animeThemes.ts
    movieThemes.ts
    luxuryThemes.ts
```

---

## 3. Data Flow

```
App.tsx
  useWeather(lat, lon)       → open-meteo.com/v1/forecast  (no key)
  useDepartures(lat, lon)    → v6.bvg.transport.rest        (no key)
    └─ finds nearest stop by GPS, fetches next departures
       stop result is cached in module-level variable stopCache

  localStorage keys:
    'dashboardTheme'         → theme ID string
    'dashboardCustomization' → ThemeCustomization JSON
    'dashboardUserConfig'    → UserConfig JSON (address, lat, lon, hiddenModes)

  State:
    currentTheme: Theme
    customization: ThemeCustomization
    userConfig: UserConfig
    weatherState: DataState<WeatherData>
    departuresState: DataState<DeparturesData>
```

---

## 4. Theme System

### Theme Interface (`src/themes/types.ts`)
```ts
interface Theme {
  id: string               // unique key, used to match ThemeBackground SVG
  name: string             // display name
  background: string       // CSS background shorthand (can be multi-stop, joined with ', ')
  backgroundImage?: string // additional CSS backgroundImage layer
  timeColor: string        // clock digit / hand color
  textColor: string        // primary text
  textSecondary: string    // secondary / dimmed text
  accentColor: string      // icon circles, highlights
  fontFamily?: string      // overrides default system font
  style?: 'modern' | 'minimal' | 'retro' | 'brutalist' | 'glass' | 'luxury' | 'sport'
  clockStyle?: string      // default clock style when theme first selected
  layout?: 'default' | 'centered' | 'split' | 'minimal'
  glassEffect?: boolean
}
```

### Berlin Themes (`src/themes/berlinThemes.ts`)
All 8 themes use layered CSS gradients as `background` AND get a full SVG illustration
from `ThemeBackground.tsx`. The CSS layer is the base; SVG is the visual identity on top.

| id | name | Visual concept |
|----|------|----------------|
| `bvg-yellow` | BVG Yellow | U-Bahn platform: tunnel void, approaching headlights, fluorescent strips |
| `berlin-night` | Berghain | Brutalist bunker: concrete texture, cold overhead wash |
| `berliner-dom` | Berliner Dom | Cathedral interior: golden dome light, Gothic arches |
| `berlin-mitte` | Fernsehturm | TV Tower at dusk: sphere, red beacons, Berlin skyline |
| `east-side` | East Side Gallery | Concrete wall: mural panels, Trabant, Fraternal Kiss |
| `potsdamer-platz` | Potsdamer Platz | Sony Center canopy: radial glass spokes from above |
| `kreuzberg` | Kreuzberg | Street at night: sodium lamps, cobblestones, perspective |
| `hauptbahnhof` | Hauptbahnhof | Barrel vault interior: arches, lattice, platforms |

### How Themes Auto-Register
`ThemeSelector.tsx` maps over `themes` array from `themes/index.ts` — no manual registration needed.
Adding a theme to any `*Themes.ts` array and re-exporting via `themes/index.ts` makes it appear.

---

## 5. Clock System

### How to Register a New Clock — CRITICAL CHECKLIST
Every new clock style must be added in **all 5 places**:

1. **Create** `src/components/clocks/MyNewClock.tsx` — React FC accepting `{ size, color, backgroundColor, showSeconds }`
2. **Export** from `src/components/clocks/index.ts`
3. **Import + switch case** in `src/components/ClockRenderer.tsx`
4. **Add to `premiumStyles` array** in `src/components/ClockPreview.tsx` (without `analog-` prefix)
5. **Add to union type** `clockStyle` in `src/types.ts` (with `analog-` prefix)
6. **Add entry** to the relevant category block in `src/components/CustomizationModal.tsx`

### ClockRenderer dispatch pattern
```ts
// ClockRenderer.tsx switch case pattern:
case 'neon-plasma':
  return <NeonPlasmaClock size={size} color={color} backgroundColor={backgroundColor} showSeconds={showSeconds} />;
```

### Clock style string conventions
- All styles stored/compared **without** `analog-` prefix inside `ClockRenderer.tsx`
- `types.ts` union type uses **with** `analog-` prefix
- `premiumStyles` array in `ClockPreview.tsx` uses **without** prefix
- Strip prefix with: `customization.clockStyle.replace('analog-', '').replace('digital-', '')`

### Existing Clock Components

**Haute Horlogerie**
- `GrandComplicationClock` — grand-complication
- `MoonphaseClock` — moonphase
- `TourbillonClock` — tourbillon
- `WorldTimeClock` — worldtime
- `PowerReserveClock` — power-reserve

**Dress Watches**
- `BauhausClock` — bauhaus
- `DressElegantClock` — dress-elegant
- `SkeletonClock` — skeleton
- `ArtDecoClock` — art-deco

**Professional**
- `PilotClock` — pilot
- `DiverClock` — diver
- `RacingClock` — racing
- `MilitaryClock` — military

**Avant-Garde**
- `AsymmetricClock` — asymmetric
- `RetrogradeClock` — retrograde
- `DigitalHybridClock` — digital-hybrid
- `JumpingHourClock` — jumping-hour

**Heritage**
- `RailroadClock` — railroad

**Digital/Special**
- `ColorfulDigitalClock` — colorful
- `BinaryClock` — binary
- `FlipClock` — flip
- `SegmentClock` — segment

**Artistic Collection** *(added in this session)*
- `NeonPlasmaClock` — neon-plasma — Cyberpunk neon tubes, cyan/magenta/green SVG glow filters
- `CrystalPrismClock` — crystal-prism — Hexagonal gemstone facets, prismatic gradients
- `KintsugiClock` — kintsugi — Japanese gold-repair on obsidian, Bezier crack paths
- `AstrolabeClock` — astrolabe — Medieval brass astronomical instrument, rotating rete
- `VortexOrrery` — vortex-orrery — Cosmic planetary orrery, spiral galaxy arms

---

## 6. ThemeBackground System

**File:** `src/components/ThemeBackground.tsx`

Full-screen SVG illustrations layered behind all UI. Architecture:

```ts
// Dispatcher — keyed by theme.id
export const ThemeBackground: React.FC<{ themeId: string }> = ({ themeId }) => {
  const backgrounds: Record<string, React.ReactNode> = {
    'bvg-yellow':      <BVGBg />,
    'berlin-night':    <BerghainBg />,
    'berliner-dom':    <BerlinerDomBg />,
    'berlin-mitte':    <FernsehturmBg />,
    'east-side':       <EastSideBg />,
    'potsdamer-platz': <PotsdamerBg />,
    'kreuzberg':       <KreuzbergBg />,
    'hauptbahnhof':    <HauptbahnhofBg />,
  };
  // Returns null for non-Berlin themes (no-op, zero cost)
};
```

**Z-index stack (critical — do not break this):**
```
Layout root div  →  position: relative; isolation: isolate;
  ThemeBackground  →  position: absolute; inset: 0; z-index: -1; opacity: 0.45;
  Content divs     →  position: relative; z-index: 1;    ← split + default layouts only
```

`isolation: isolate` on the layout root is essential — it scopes the `z-index: -1` so
the background doesn't fall behind the page root (which would make it invisible).

**Shared utilities inside ThemeBackground.tsx:**
- `STARS` — module-level constant array of 35 [x, y, radius, opacity] tuples (deterministic, no Math.random)
- `BgSVG` — wrapper component, `viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice"`

**BVGBg — the key scene** (most developed, use as reference):
U-Bahn platform interior. Layers in order:
1. Black void base rect
2. Station wall tile pattern (52px modernist grid)
3. Ceiling slab + cornice yellow accent line
4. Floor with perspective grid (horizontal joints + radial convergence lines)
5. BVG yellow platform edge stripe (full width, 17px, 90% opacity)
6. Fluorescent ceiling tubes (5 strips with diffuse glow clouds)
7. Overhead catenary wire + perspective hanger arms
8. Steel rails in perspective + sleeper cross-ties
9. Circular tunnel mouth (312px radius void)
10. Concrete arch ring + edge glint
11. Two approaching train headlights with bloom filter + rail reflections
12. Track signal (red aspect)
13. Hanging direction boards (U5 → HÖNOW / ← SPANDAU)
14. Ghost "U" letterform watermark (700px, 5% opacity)
15. Station name footer text
16. Radial vignette

---

## 7. Layout System

**File:** `src/components/Layout.tsx`

5 layouts, selected via `customization.layout`:

| value | description |
|-------|-------------|
| `'split'` | Left 40% clock/weather, Right 60% departures |
| `'centered'` | Clock centered top, content below, max-w-4xl |
| `'minimal'` | Clock + weather in top row, departures below, max-w-6xl |
| `'compact'` | Top bar (clock + weather), full-width departures below |
| `'default'` | Left 1/3 clock, Right 2/3 (weather column + departures) |

Each layout root div must have:
```tsx
style={{ position: 'relative', isolation: 'isolate', background: ..., backgroundImage: ..., fontFamily: ... }}
```

ThemeBackground is always the **first child** of the root div.

---

## 8. APIs Used

| API | Endpoint | Key required? | Used for |
|-----|----------|---------------|----------|
| open-meteo.com | `/v1/forecast` | No | Weather: temp, humidity, weather code |
| v6.bvg.transport.rest | `/locations/nearby` + `/stops/{id}/departures` | No | Transit departures |

`useDepartures.ts` workflow:
1. `findNearbyStop(lat, lon)` → calls `/locations/nearby`, picks best stop (prefers subway > suburban > tram > bus)
2. Fetches `/stops/{id}/departures?duration=60&results=20`
3. Caches stop ID in module-level `stopCache` to avoid re-fetching on every render

---

## 9. UserConfig vs config.ts

`config.ts` — static defaults (address, coords, transport lines, refresh interval)  
`UserConfig` (via `userConfig.ts`) — runtime overrides saved to localStorage  
`SettingsModal.tsx` — UI for editing UserConfig (address lookup → sets lat/lon)

When adding location-sensitive features, always use `userConfig.lat / userConfig.lon`, not `config.MY_LAT`.

---

## 10. Known Patterns & Conventions

- **No random() in render** — star fields and other "stable random" visuals use pre-computed constant arrays
- **SVG clocks** all accept `{ size: number, color: string, backgroundColor: string, showSeconds: boolean, showComplications?: boolean }`
- **Theme colors** flow from `theme.timeColor` (clock), `theme.textColor` (primary text), `theme.textSecondary` (dimmed), `theme.accentColor` (icon circles)
- **Vite HMR** is active during dev — file saves hot-reload without losing state
- **No backend** — if something needs server-side logic, it can't be added without architectural change
- **Tailwind only for layout** — visual identity (colors, gradients, SVG) lives in component styles, not Tailwind classes

---

## 11. What Has Been Built in This Session

1. **5 Artistic clock components** — NeonPlasma, CrystalPrism, Kintsugi, Astrolabe, VortexOrrery  
   All registered in all 5 required places. Appear under "ARTISTIC" category in Customize panel.

2. **Berlin themes redesigned** — All 8 themes have layered CSS visual identity using  
   `repeating-linear-gradient`, `radial-gradient`, `repeating-conic-gradient` instead of flat colors.

3. **ThemeBackground.tsx** — 8 hand-crafted SVG landmark illustrations, one per Berlin theme.  
   1000+ lines. Each illustration is a standalone React FC with its own `<defs>` (gradients, filters, patterns).

4. **BVGBg complete redesign** — Replaced generic U-Bahn map schematic with a cinematic  
   platform interior scene. The most detailed illustration in the file.

5. **Z-index / opacity fix** — ThemeBackground is `z-index: -1, opacity: 0.45`.  
   All layout roots have `isolation: isolate`. Content is always readable on top of backgrounds.

---

## 12. Things NOT to Change Without Thought

- **`isolation: isolate` on layout roots** — removing this breaks all Berlin theme backgrounds
- **`z-index: -1` on ThemeBackground wrapper** — changing this to 0 will overlay content
- **The `premiumStyles` array in ClockPreview.tsx** — must stay in sync with types.ts union
- **`themes/index.ts` import order** — Berlin themes intentionally first (they appear first in ThemeSelector)
- **`stopCache` in `useDepartures.ts`** — module-level, intentional, resets on lat/lon change
