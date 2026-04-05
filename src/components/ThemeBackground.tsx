import React from 'react';

// Stable star field data (deterministic, not random per render)
const STARS: [number, number, number, number][] = [
  [45,35,1.0,0.65],[145,28,0.7,0.50],[248,72,0.8,0.75],[356,18,1.2,0.45],
  [467,55,0.6,0.80],[562,38,1.0,0.55],[672,22,0.8,0.70],[778,45,0.6,0.60],
  [892,28,1.1,0.50],[1012,58,0.7,0.75],[1136,32,0.9,0.65],[1248,18,1.3,0.45],
  [1358,48,0.7,0.60],[1456,28,0.8,0.70],[1568,42,1.0,0.55],[1678,22,0.6,0.80],
  [1788,58,0.9,0.50],[1856,35,1.1,0.65],[1908,18,0.7,0.45],
  [88,92,0.7,0.60],[198,108,0.5,0.70],[308,88,0.8,0.55],[412,112,0.6,0.65],
  [522,95,1.0,0.50],[628,115,0.7,0.75],[734,88,0.5,0.60],[844,102,0.9,0.55],
  [958,92,0.7,0.70],[1062,108,0.6,0.80],[1168,88,0.8,0.55],[1278,102,1.0,0.60],
  [1388,92,0.6,0.75],[1498,108,0.7,0.50],[1608,88,0.9,0.65],[1718,102,0.5,0.80],
];

// Shared SVG wrapper: fills parent, preserves aspect ratio by slicing
const BgSVG: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg
    viewBox="0 0 1920 1080"
    preserveAspectRatio="xMidYMid slice"
    width="100%"
    height="100%"
    xmlns="http://www.w3.org/2000/svg"
  >
    {children}
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// BVG YELLOW — U-Bahn platform: standing at the edge, staring into the void
// ─────────────────────────────────────────────────────────────────────────────
const BVGBg: React.FC = () => {
  const Y = '#FFD700';
  // Tunnel circle — the dominant void
  const cx = 960, cy = 488, r = 312;

  // Rail perspective: near points at y=1080, far points at tunnel bottom
  const railFarY = cy + r - 8;
  const railL = { near: 752, far: 887 };
  const railR = { near: 1168, far: 1033 };

  return (
    <BgSVG>
      <defs>
        {/* ── Floor gradient: warm near, void far ── */}
        <linearGradient id="bvg-fl" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%"   stopColor="#201700" />
          <stop offset="38%"  stopColor="#0e0b00" />
          <stop offset="100%" stopColor="#040300" />
        </linearGradient>

        {/* ── Ceiling gradient ── */}
        <linearGradient id="bvg-ceil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#141100" />
          <stop offset="100%" stopColor="#040300" />
        </linearGradient>

        {/* ── Tunnel void — deep black with faint blue-black haze ── */}
        <radialGradient id="bvg-void" cx="50%" cy="54%" r="50%">
          <stop offset="0%"   stopColor="#08070c" stopOpacity="0.55" />
          <stop offset="75%"  stopColor="#000000" stopOpacity="1" />
        </radialGradient>

        {/* ── Approaching headlights ── */}
        <radialGradient id="bvg-hl1" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="40%"  stopColor="#FFF8C0" stopOpacity="0.80" />
          <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="bvg-hl2" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="40%"  stopColor="#FFF8C0" stopOpacity="0.80" />
          <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
        </radialGradient>

        {/* ── Fluorescent strip glow ── */}
        <radialGradient id="bvg-fluor" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#FFF8C0" stopOpacity="0.55" />
          <stop offset="45%"  stopColor="#FFD700" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
        </radialGradient>

        {/* ── Corner vignette ── */}
        <radialGradient id="bvg-vig" cx="50%" cy="50%" r="68%">
          <stop offset="18%"  stopColor="transparent" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.88" />
        </radialGradient>

        {/* ── Wall tile pattern ── */}
        <pattern id="bvg-tile" x="0" y="0" width="52" height="52" patternUnits="userSpaceOnUse">
          <rect width="52" height="52" fill="#0d0c05" />
          <line x1="0" y1="0" x2="52" y2="0" stroke="#191800" strokeWidth="0.9" />
          <line x1="0" y1="0" x2="0" y2="52" stroke="#191800" strokeWidth="0.9" />
        </pattern>

        {/* ── Filters ── */}
        {/* Big headlight bloom */}
        <filter id="bvg-bloom" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="26" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        {/* Soft glow */}
        <filter id="bvg-sglow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="10" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        {/* Small blur */}
        <filter id="bvg-b5" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        {/* Large blur for tube glow clouds */}
        <filter id="bvg-b22" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
      </defs>

      {/* ══ 1. ABSOLUTE BLACK VOID ══ */}
      <rect width="1920" height="1080" fill="#020200" />

      {/* ══ 2. STATION WALL TILES — only the wall band ══ */}
      <rect x="0" y="166" width="1920" height="642" fill="url(#bvg-tile)" />

      {/* ══ 3. CEILING SLAB ══ */}
      <rect width="1920" height="170" fill="#0e0c04" />
      <rect width="1920" height="170" fill="url(#bvg-ceil)" />
      {/* Cornice — thin yellow accent line */}
      <line x1="0" y1="170" x2="1920" y2="170" stroke={Y} strokeWidth="2.5" opacity="0.14" />

      {/* ══ 4. FLOOR ══ */}
      <rect x="0" y="808" width="1920" height="272" fill="url(#bvg-fl)" />

      {/* ══ 5. PERSPECTIVE FLOOR GRID ══ */}
      {/* Horizontal joints — denser toward horizon */}
      {[1076, 1018, 964, 920, 883, 853, 828, 810].map((y, i) => (
        <line key={i} x1="0" y1={y} x2="1920" y2={y}
          stroke="#1d1b07" strokeWidth={i < 2 ? 1.3 : 0.75}
          opacity={0.62 - i * 0.06} />
      ))}
      {/* Radial joints converging to tunnel VP */}
      {[-900, -540, -270, -110, 110, 270, 540, 900].map((dx, i) => (
        <line key={i}
          x1={960 + dx} y1={1080}
          x2={960 + dx * 0.055} y2={820}
          stroke="#1a1806" strokeWidth="0.8" opacity="0.42" />
      ))}

      {/* ══ 6. ICONIC BVG YELLOW PLATFORM EDGE STRIPE ══ */}
      <rect x="0" y="810" width="1920" height="17" fill={Y} opacity="0.90" />
      <rect x="0" y="827" width="1920" height="4"  fill="#704800" opacity="0.50" />
      {/* Glow underlighting the stripe */}
      <rect x="0" y="808" width="1920" height="60"
        fill={Y} opacity="0.055" filter="url(#bvg-b5)" />

      {/* ══ 7. FLUORESCENT CEILING TUBES ══ */}
      {[210, 545, 960, 1375, 1710].map((lx) => (
        <g key={lx}>
          {/* Diffuse glow cloud */}
          <ellipse cx={lx} cy={85} rx={300} ry={170}
            fill="url(#bvg-fluor)" filter="url(#bvg-b22)" />
          {/* Tube body */}
          <rect x={lx - 205} y={13} width={410} height={12}
            fill="#FFFCE0" opacity="0.93" rx="2" />
          {/* Immediate halo */}
          <rect x={lx - 225} y={9} width={450} height={20}
            fill="#FFF8B0" opacity="0.28" rx="3" filter="url(#bvg-sglow)" />
        </g>
      ))}

      {/* ══ 8. OVERHEAD CONTACT WIRE (catenary) ══ */}
      <line x1="960" y1="0" x2="960" y2={cy - r + 18}
        stroke="#705000" strokeWidth="1.5" opacity="0.30" />
      {/* Suspension hanger arms — perspective: wider near, narrower far */}
      {[65, 168, 268, 362, 448, 520, 573].map((y) => {
        const spread = 68 * Math.max(0, 1 - (y - 65) / 560);
        return (
          <g key={y}>
            <line x1={960 - spread} y1={y + 24} x2="960" y2={y}
              stroke="#705000" strokeWidth="1.2" opacity="0.20" />
            <line x1={960 + spread} y1={y + 24} x2="960" y2={y}
              stroke="#705000" strokeWidth="1.2" opacity="0.20" />
          </g>
        );
      })}

      {/* ══ 9. STEEL RAILS IN PERSPECTIVE ══ */}
      {/* Left rail body + catch-light */}
      <line x1={railL.near} y1="1080" x2={railL.far} y2={railFarY}
        stroke="#8A6618" strokeWidth="6" opacity="0.82" />
      <line x1={railL.near} y1="1080" x2={railL.far} y2={railFarY}
        stroke="#D8A830" strokeWidth="1.8" opacity="0.70" filter="url(#bvg-sglow)" />
      {/* Right rail body + catch-light */}
      <line x1={railR.near} y1="1080" x2={railR.far} y2={railFarY}
        stroke="#8A6618" strokeWidth="6" opacity="0.82" />
      <line x1={railR.near} y1="1080" x2={railR.far} y2={railFarY}
        stroke="#D8A830" strokeWidth="1.8" opacity="0.70" filter="url(#bvg-sglow)" />
      {/* Track bed between rails */}
      <polygon
        points={`${railL.near},1080 ${railR.near},1080 ${railR.far},${railFarY} ${railL.far},${railFarY}`}
        fill="#010100" opacity="0.75" />
      {/* Sleeper cross-ties in perspective */}
      {[1078, 1038, 1004, 974, 948, 926, 908, 893].map((y, i) => {
        const t = (y - railFarY) / (1080 - railFarY);
        const lx = railL.far + (railL.near - railL.far) * t;
        const rx = railR.far + (railR.near - railR.far) * t;
        return (
          <line key={i} x1={lx} y1={y} x2={rx} y2={y}
            stroke="#282008" strokeWidth={2.2 - i * 0.2} opacity={0.70 - i * 0.07} />
        );
      })}

      {/* ══ 10. TUNNEL MOUTH — THE VOID ══ */}
      <circle cx={cx} cy={cy} r={r} fill="url(#bvg-void)" />
      {/* Concrete arch: thick outer ring + inner ring */}
      <circle cx={cx} cy={cy} r={r}   fill="none" stroke="#282508" strokeWidth="30" />
      <circle cx={cx} cy={cy} r={r-15} fill="none" stroke="#1A1806" strokeWidth="10" />
      {/* Arch edge glint — hairline yellow, almost subliminal */}
      <circle cx={cx} cy={cy} r={r+1}  fill="none" stroke={Y} strokeWidth="0.9" opacity="0.09" />

      {/* ══ 11. APPROACHING TRAIN — two headlights in the darkness ══ */}
      {/* Outer bloom (very wide, soft) */}
      <circle cx={cx - 66} cy={cy + 22} r={32} fill="url(#bvg-hl1)" filter="url(#bvg-bloom)" />
      <circle cx={cx + 66} cy={cy + 22} r={32} fill="url(#bvg-hl2)" filter="url(#bvg-bloom)" />
      {/* Inner bright core */}
      <circle cx={cx - 66} cy={cy + 22} r={10} fill="#FFFFFF" opacity="0.95" />
      <circle cx={cx + 66} cy={cy + 22} r={10} fill="#FFFFFF" opacity="0.95" />
      {/* Headlight rail reflection puddles */}
      <ellipse cx={cx - 66} cy={cy + r - 16} rx={18} ry={6}
        fill={Y} opacity="0.16" filter="url(#bvg-b5)" />
      <ellipse cx={cx + 66} cy={cy + r - 16} rx={18} ry={6}
        fill={Y} opacity="0.16" filter="url(#bvg-b5)" />

      {/* ══ 12. TRACK SIGNAL on tunnel left wall ══ */}
      <rect x={cx - r - 64} y={cy - 132} width={32} height={80}
        fill="#090800" stroke="#201E06" strokeWidth="1.5" rx="4" />
      {/* Red aspect (stop) */}
      <circle cx={cx - r - 48} cy={cy - 92} r={11} fill="#CC0000" opacity="0.85" />
      <circle cx={cx - r - 48} cy={cy - 92} r={16}
        fill="#FF2200" opacity="0.28" filter="url(#bvg-b5)" />
      {/* Signal pole */}
      <line x1={cx - r - 48} y1={cy - 52} x2={cx - r - 48} y2={cy + 65}
        stroke="#181606" strokeWidth="3" />

      {/* ══ 13. HANGING DIRECTION BOARDS ══ */}
      {/* Left board — line U5 » Hönow */}
      <g>
        <line x1="468" y1="132" x2="468" y2="170" stroke={Y} strokeWidth="1.5" opacity="0.55" />
        <rect x="348" y="170" width="240" height="58" fill="#0A0900" stroke={Y} strokeWidth="1.8" rx="2" />
        <text x="468" y="197" textAnchor="middle"
          fontFamily="'Helvetica Neue', Arial, sans-serif" fontWeight="900" fontSize="21"
          fill={Y} letterSpacing="4">U5</text>
        <text x="468" y="218" textAnchor="middle"
          fontFamily="'Helvetica Neue', Arial, sans-serif" fontWeight="500" fontSize="13"
          fill="#BBA000" letterSpacing="1">HÖNOW ▶</text>
      </g>
      {/* Right board — line U5 « Spandau */}
      <g>
        <line x1="1452" y1="132" x2="1452" y2="170" stroke={Y} strokeWidth="1.5" opacity="0.55" />
        <rect x="1332" y="170" width="240" height="58" fill="#0A0900" stroke={Y} strokeWidth="1.8" rx="2" />
        <text x="1452" y="197" textAnchor="middle"
          fontFamily="'Helvetica Neue', Arial, sans-serif" fontWeight="900" fontSize="21"
          fill={Y} letterSpacing="4">U5</text>
        <text x="1452" y="218" textAnchor="middle"
          fontFamily="'Helvetica Neue', Arial, sans-serif" fontWeight="500" fontSize="13"
          fill="#BBA000" letterSpacing="1">◀ SPANDAU</text>
      </g>

      {/* ══ 14. GHOST «U» LETTERFORM — identity watermark ══ */}
      {/* Enormous Helvetica U centered on the tunnel void */}
      <text x={cx} y={cy}
        textAnchor="middle" dominantBaseline="central"
        fontFamily="'Helvetica Neue', 'Arial Black', Arial, sans-serif"
        fontWeight="900" fontSize="700"
        fill={Y} opacity="0.05">U</text>

      {/* ══ 15. STATION NAME FOOTER ══ */}
      <text x="960" y="1062"
        textAnchor="middle"
        fontFamily="'Helvetica Neue', Arial, sans-serif"
        fontWeight="700" fontSize="17"
        fill={Y} letterSpacing="10" opacity="0.45">
        BERLINER VERKEHRSBETRIEBE · U‑BAHN
      </text>

      {/* ══ 16. VIGNETTE FRAME ══ */}
      <rect width="1920" height="1080" fill="url(#bvg-vig)" />
    </BgSVG>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// BERGHAIN — Brutalist industrial bunker
// ─────────────────────────────────────────────────────────────────────────────
const BerghainBg: React.FC = () => (
  <BgSVG>
    <defs>
      <radialGradient id="bhg-spot" cx="52%" cy="0%" r="68%">
        <stop offset="0%" stopColor="#c8eeff" stopOpacity="0.10" />
        <stop offset="55%" stopColor="#c8eeff" stopOpacity="0.03" />
        <stop offset="100%" stopColor="transparent" stopOpacity="0" />
      </radialGradient>
      <filter id="bhg-blur" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="3" />
      </filter>
    </defs>

    {/* Pure black void */}
    <rect width="1920" height="1080" fill="#000000" />

    {/* Overhead cold spotlight wash */}
    <ellipse cx="1000" cy="-80" rx="700" ry="820" fill="url(#bhg-spot)" />

    {/* ── Main building block ── */}
    {/* The Berghain is a former GDR heating plant — a massive, near-windowless box */}
    <rect x="440" y="60" width="1100" height="940" fill="#111111" />

    {/* Horizontal concrete pour-lines give the mass texture */}
    {[...Array(24)].map((_, i) => (
      <line key={i} x1="440" y1={60 + i * 40} x2="1540" y2={60 + i * 40}
        stroke="#191919" strokeWidth="1.2" />
    ))}

    {/* Subtle vertical construction joint */}
    <line x1="960" y1="60" x2="960" y2="1000" stroke="#161616" strokeWidth="1" />
    <line x1="700" y1="60" x2="700" y2="1000" stroke="#151515" strokeWidth="0.8" />
    <line x1="1220" y1="60" x2="1220" y2="1000" stroke="#151515" strokeWidth="0.8" />

    {/* Industrial windows — very few, small, scattered */}
    {[520, 660, 840, 1040, 1200, 1380].map((x, i) => (
      <rect key={i} x={x} y={100 + (i % 2) * 20} width={40} height={26}
        fill="#0a0a0a" stroke="#1e1e1e" strokeWidth="1" />
    ))}
    {/* Mid-level windows */}
    <rect x="580" y="320" width="90" height="60" fill="#0c0c0c" stroke="#202020" strokeWidth="1" />
    <rect x="880" y="360" width="60" height="45" fill="#0c0c0c" stroke="#1e1e1e" strokeWidth="1" />
    <rect x="1240" y="310" width="80" height="55" fill="#0c0c0c" stroke="#1e1e1e" strokeWidth="1" />
    <rect x="1400" y="380" width="50" height="38} " fill="#0c0c0c" stroke="#1e1e1e" strokeWidth="1" />

    {/* Narrow entrance door */}
    <rect x="940" y="820" width="80" height="180" fill="#070707" />
    <rect x="952" y="835" width="56} " height="165" fill="#050505" />

    {/* Industrial chimney stacks on the roof */}
    <rect x="580" y="10" width="32" height="65" fill="#0d0d0d" />
    <rect x="1340" y="20" width="26" height="50" fill="#0d0d0d" />
    <rect x="1180" y="15" width="20" height="45" fill="#0e0e0e" />

    {/* Entrance awning / small canopy */}
    <rect x="910" y="800" width="140" height="18} " fill="#191919" />

    {/* ── Queue of silhouettes ── */}
    {[...Array(11)].map((_, i) => {
      const x = 398 - i * 34;
      const bodyH = 105 + (i % 3) * 18;
      return (
        <g key={i}>
          <circle cx={x} cy={1000 - bodyH - 14} r={12} fill="#0d0d0d" />
          <rect x={x - 9} y={1000 - bodyH} width={18} height={bodyH * 0.75}
            rx="4" fill="#0d0d0d" />
        </g>
      );
    })}

    {/* Ground */}
    <rect x="0" y="1000" width="1920" height="80" fill="#060606" />

    {/* Very subtle vignette at top */}
    <radialGradient id="bhg-vig" cx="50%" cy="0%" r="60%">
      <stop offset="0%" stopColor="transparent" />
      <stop offset="100%" stopColor="#000000" stopOpacity="0.5" />
    </radialGradient>
    <rect width="1920" height="1080" fill="url(#bhg-vig)" />
  </BgSVG>
);

// ─────────────────────────────────────────────────────────────────────────────
// BERLINER DOM — Cathedral dome silhouette in amber light
// ─────────────────────────────────────────────────────────────────────────────
const BerlinerDomBg: React.FC = () => (
  <BgSVG>
    <defs>
      <radialGradient id="dom-glow" cx="50%" cy="44%" r="28%">
        <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.32" />
        <stop offset="60%" stopColor="#c9a84c" stopOpacity="0.08" />
        <stop offset="100%" stopColor="transparent" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="dom-lofthalo" cx="50%" cy="0%" r="55%">
        <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.08" />
        <stop offset="100%" stopColor="transparent" stopOpacity="0" />
      </radialGradient>
      {/* Water ripple gradient */}
      <linearGradient id="dom-water" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#120b00" />
        <stop offset="100%" stopColor="#060300" />
      </linearGradient>
    </defs>

    {/* Warm void sky */}
    <rect width="1920" height="1080" fill="#050400" />

    {/* Stars */}
    {STARS.map(([x, y, r, o], i) => (
      <circle key={i} cx={x} cy={y} r={r} fill="white" opacity={o * 0.55} />
    ))}

    {/* Ambient dome aura — the golden light emanating upward */}
    <ellipse cx="960" cy="480" rx="520" ry="400" fill="url(#dom-glow)" />

    {/* Loft halo from above — the dome lantern */}
    <ellipse cx="960" cy="0" rx="600" ry="300" fill="url(#dom-lofthalo)" />

    {/* ── Cathedral silhouette ── */}

    {/* Side wings / nave body */}
    <rect x="560" y="640" width="800" height="240" fill="#060400" />

    {/* Portico column row */}
    <rect x="640" y="580" width="640" height="60" fill="#070500" />
    {[...Array(9)].map((_, i) => (
      <rect key={i} x={660 + i * 74} y={498} width={12} height={82} fill="#070500" />
    ))}

    {/* NW corner tower */}
    <path d="M 580 640 C 580 640 600 490 650 465 C 700 490 720 640 720 640 Z" fill="#060400" />
    <path d="M 630 468 A 20 28 0 0 1 670 468 Z" fill="#060400" />

    {/* NE corner tower */}
    <path d="M 1200 640 C 1200 640 1220 490 1270 465 C 1320 490 1340 640 1340 640 Z" fill="#060400" />
    <path d="M 1250 468 A 20 28 0 0 1 1290 468 Z" fill="#060400" />

    {/* Main dome drum */}
    <rect x="760" y="520" width="400" height="120" fill="#070500" />

    {/* Main dome — the great baroqued hemisphere */}
    <path d="M 760 520 C 760 520 780 280 960 244 C 1140 280 1160 520 1160 520 Z" fill="#080600" />

    {/* Dome lantern */}
    <rect x="942" y="244" width="36" height="62" fill="#060400" />
    <path d="M 942 244 A 18 24 0 0 1 978 244 Z" fill="#060400" />

    {/* Cross on lantern */}
    <line x1="960" y1="222" x2="960" y2="188" stroke="#0e0900" strokeWidth="5" />
    <line x1="944" y1="208" x2="976" y2="208" stroke="#0e0900" strokeWidth="5" />

    {/* Golden glow from dome windows (drum level) */}
    {[...Array(7)].map((_, i) => {
      const a = (i / 7) * Math.PI;
      const wx = 960 + 185 * Math.cos(a + Math.PI);
      const wy = 556 + 28 * Math.sin(a);
      return (
        <ellipse key={i} cx={wx} cy={wy} rx="14" ry="19"
          fill="#c9a84c" opacity="0.18" />
      );
    })}
    {/* Top of dome windows ring */}
    {[...Array(5)].map((_, i) => {
      const a = (i / 5) * Math.PI;
      const wx = 960 + 130 * Math.cos(a + Math.PI);
      const wy = 420 + 80 * Math.sin(a) - 10;
      return <ellipse key={i} cx={wx} cy={wy} rx="10" ry="15" fill="#c9a84c" opacity="0.12" />;
    })}

    {/* Spire / flanking tower tips golden highlight */}
    <line x1="650" y1="444" x2="650" y2="418" stroke="#c9a84c" strokeWidth="2" opacity="0.22" />
    <line x1="1270" y1="444" x2="1270" y2="418" stroke="#c9a84c" strokeWidth="2" opacity="0.22" />

    {/* ── Spree river water below ── */}
    <rect x="0" y="880" width="1920" height="200" fill="url(#dom-water)" />

    {/* Water surface ripples */}
    {[...Array(7)].map((_, i) => (
      <line key={i} x1={200} y1={892 + i * 22} x2={1720} y2={892 + i * 24}
        stroke="#0f0900" strokeWidth="1.5" opacity="0.65" />
    ))}

    {/* Cathedral reflection in water */}
    <g transform="scale(1,-1) translate(0,-1760)" opacity="0.28">
      <rect x="560" y="640" width="800" height="240" fill="#0a0700" />
      <path d="M 760 520 C 760 520 780 280 960 244 C 1140 280 1160 520 1160 520 Z" fill="#080600" />
      <ellipse cx="960" cy="480" rx="380" ry="280" fill="#c9a84c" opacity="0.08" />
    </g>

    {/* Ground / island base */}
    <rect x="400" y="870" width="1120" height="30" fill="#060400" />

    {/* Bottom darkening so departures are readable */}
    <linearGradient id="dom-bot" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="transparent" />
      <stop offset="100%" stopColor="#050400" stopOpacity="0.75" />
    </linearGradient>
    <rect width="1920" height="1080" fill="url(#dom-bot)" />
  </BgSVG>
);

// ─────────────────────────────────────────────────────────────────────────────
// FERNSEHTURM — TV Tower silhouette at night
// ─────────────────────────────────────────────────────────────────────────────
const FernsehturmBg: React.FC = () => (
  <BgSVG>
    <defs>
      <radialGradient id="ft-cityglow" cx="68%" cy="100%" r="50%">
        <stop offset="0%" stopColor="#1a2a40" stopOpacity="0.6" />
        <stop offset="60%" stopColor="#0a1520" stopOpacity="0.2" />
        <stop offset="100%" stopColor="transparent" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="ft-sphere" cx="35%" cy="32%">
        <stop offset="0%" stopColor="#1a2535" />
        <stop offset="55%" stopColor="#0e1828" />
        <stop offset="100%" stopColor="#060c18" />
      </radialGradient>
      <filter id="ft-beacon" x="-200%" y="-200%" width="500%" height="500%">
        <feGaussianBlur stdDeviation="5" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <filter id="ft-soft" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="2.5" />
      </filter>
    </defs>

    {/* Night sky — cool dark blue-black */}
    <rect width="1920" height="1080" fill="#020408" />

    {/* City light pollution glow from below */}
    <ellipse cx="1300" cy="1180" rx="900" ry="550" fill="url(#ft-cityglow)" />

    {/* Stars in upper sky */}
    {STARS.map(([x, y, r, o], i) => (
      <circle key={i} cx={x} cy={y} r={r} fill="white" opacity={o * 0.75} />
    ))}

    {/* ── Fernsehturm — TV Tower ── */}
    {/* Positioned right-of-center so left side has room for clock */}

    {/* Base concrete legs — 4 angled struts */}
    <path d="M 1140 1000 L 1220 830 L 1270 830 L 1320 1000 Z" fill="#0a1220" />
    <path d="M 1370 1000 L 1320 830 L 1370 830 L 1440 1000 Z" fill="#0a1220" />

    {/* Base skirt / platform deck */}
    <rect x="1200" y="808" width="190" height="24" fill="#0c1525" />

    {/* Main concrete shaft — tapers from base to sphere */}
    <path d="M 1230 830 L 1240 830 L 1282 530 L 1298 530 L 1340 830 L 1350 830 Z"
      fill="#0d1828" />
    {/* Shaft centerline highlight */}
    <line x1="1290" y1="530" x2="1290" y2="830" stroke="#141f2e" strokeWidth="5" opacity="0.6" />

    {/* Sphere — the iconic observation ball */}
    <circle cx="1290" cy="450" r="95" fill="url(#ft-sphere)" />

    {/* Sphere rim — the glass observation deck band */}
    <ellipse cx="1290" cy="458" rx="94" ry="14"
      fill="none" stroke="#1c2e45" strokeWidth="4" />
    <ellipse cx="1290" cy="458" rx="94" ry="14"
      fill="none" stroke="#c8deff" strokeWidth="0.6" opacity="0.18" />

    {/* Sphere catch-light (top-left specular) */}
    <ellipse cx="1268" cy="428" rx="22" ry="16" fill="white" opacity="0.06"
      transform="rotate(-25 1268 428)" />

    {/* Restaurant windows glow — tiny warm gold dots along the window band */}
    {[...Array(10)].map((_, i) => {
      const a = (i / 10) * Math.PI - Math.PI / 2;
      const wx = 1290 + 91 * Math.cos(a);
      const wy = 458 + 13 * Math.sin(a);
      return <circle key={i} cx={wx} cy={wy} r={2.5} fill="#ffd84d" opacity="0.25" />;
    })}

    {/* Cross reflection on sphere (catches the sun cross from antenna shadow) */}
    <line x1="1290" y1="358" x2="1290" y2="542" stroke="#101e30" strokeWidth="3" opacity="0.4" />
    <line x1="1198" y1="450" x2="1382" y2="450" stroke="#101e30" strokeWidth="3" opacity="0.4" />

    {/* Antenna mast */}
    <rect x="1287" y="20" width="6" height="356" fill="#0c1828" />
    <rect x="1288.5" y="20" width="3" height="356" fill="#1a2e48" opacity="0.6" />

    {/* Red aircraft warning beacons */}
    <circle cx="1290" cy="38" r="5" fill="#ff2200" opacity="0.9" filter="url(#ft-beacon)" />
    <circle cx="1290" cy="145" r="3.5" fill="#ff2200" opacity="0.65" filter="url(#ft-beacon)" />
    <circle cx="1290" cy="252" r="3" fill="#ff2200" opacity="0.45" />

    {/* ── Berlin city skyline at horizon ── */}
    <path d="
      M 0 980 L 60 958 L 90 970 L 140 942 L 200 960 L 260 935 L 320 950
      L 400 920 L 460 938 L 520 912 L 600 928 L 680 900 L 760 918
      L 820 895 L 900 978 L 960 968 L 1020 958 L 1100 975 L 1160 945
      L 1200 970 L 1500 990 L 1560 968 L 1620 978 L 1700 952
      L 1760 966 L 1840 945 L 1900 960 L 1920 970
      L 1920 1080 L 0 1080 Z
    " fill="#060a12" />

    {/* Ground glow from city lights */}
    <rect x="0" y="975" width="1920" height="105" fill="#050912" />

    {/* Left side darkening vignette (keeps clock area readable) */}
    <linearGradient id="ft-left-dark" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#020408" stopOpacity="0.65" />
      <stop offset="40%" stopColor="transparent" stopOpacity="0" />
    </linearGradient>
    <rect width="1920" height="1080" fill="url(#ft-left-dark)" />
  </BgSVG>
);

// ─────────────────────────────────────────────────────────────────────────────
// EAST SIDE GALLERY — The Wall with mural panels
// ─────────────────────────────────────────────────────────────────────────────
const EastSideBg: React.FC = () => (
  <BgSVG>
    <defs>
      <linearGradient id="esg-sky" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#090909" />
        <stop offset="100%" stopColor="#141010" />
      </linearGradient>
      <filter id="esg-noise" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" result="noise" />
        <feColorMatrix type="saturate" values="0" in="noise" result="grey" />
        <feBlend in="SourceGraphic" in2="grey" mode="multiply" />
      </filter>
    </defs>

    {/* Dark night sky above the wall */}
    <rect width="1920" height="1080" fill="url(#esg-sky)" />

    {/* City glow above wall */}
    <ellipse cx="960" cy="620" rx="900" ry="200" fill="#1a0808" opacity="0.4" />

    {/* ── The Wall ── runs horizontally across the lower half */}
    {/* Wall top surface */}
    <rect x="0" y="620" width="1920" height="20" fill="#1e1e1e" />

    {/* Wall face (the painted east side) */}
    <rect x="0" y="640" width="1920" height="280" fill="#1a1a1a" />

    {/* Concrete texture — vertical aggregate lines */}
    {[...Array(32)].map((_, i) => (
      <line key={i} x1={i * 62} y1="640" x2={i * 62 + 2} y2="920"
        stroke="#141414" strokeWidth="1" opacity="0.7" />
    ))}
    {/* Horizontal mortar lines */}
    {[0, 1, 2, 3].map(i => (
      <line key={i} x1="0" y1={640 + i * 46} x2="1920" y2={640 + i * 46}
        stroke="#111111" strokeWidth="1.2" opacity="0.8" />
    ))}

    {/* Panel dividers (vertical cracks / joins) */}
    {[...Array(13)].map((_, i) => (
      <line key={i} x1={i * 155} y1="620" x2={i * 155} y2="920"
        stroke="#111111" strokeWidth="2" opacity="0.7" />
    ))}

    {/* ── MURAL PANELS (abstract interpretations) ── */}

    {/* Panel 1 (x 0-155): Abstract red/white DDR colour stripe suggestion */}
    <rect x="4" y="644" width="147" height="95" fill="#2a0404" opacity="0.7" />
    <rect x="4" y="742" width="147" height="40" fill="#252525" opacity="0.8" />
    <rect x="4" y="784" width="147" height="30" fill="#1e0404" opacity="0.7" />

    {/* Panel 2 (x 155-310): Abstract concrete + paint scrawl */}
    <rect x="159" y="644" width="147" height="272" fill="#1c1c1c" />
    <line x1="175" y1="680" x2="290" y2="820" stroke="#2a2a2a" strokeWidth="2" opacity="0.6" />

    {/* Panel 3 (x 310-465): Birgit Kinder Trabant — car crashing through */}
    <rect x="314" y="644" width="147" height="272" fill="#1e1812" />
    {/* Car body suggestion */}
    <rect x="325" y="748" width="110" height="52" rx="6" fill="#2c2418" />
    {/* Car roof */}
    <path d="M 345 748 L 365 718 L 410 718 L 430 748 Z" fill="#241e12" />
    {/* Wheels */}
    <circle cx="352" cy="805" r="18" fill="#141414" stroke="#222" strokeWidth="2" />
    <circle cx="416" cy="805" r="18" fill="#141414" stroke="#222" strokeWidth="2" />
    {/* "Breakthrough" crack lines */}
    <line x1="430" y1="720" x2="458" y2="644" stroke="#2a2020" strokeWidth="2" opacity="0.6" />
    <line x1="430" y1="770" x2="460" y2="916" stroke="#2a2020" strokeWidth="2" opacity="0.6" />

    {/* Panel 4 (x 465-620): Dark filler */}
    <rect x="469" y="644" width="147" height="272" fill="#191919" />

    {/* Panel 5 (x 620-775): Vrubel "Fraternal Kiss" — two face shapes */}
    <rect x="624" y="644" width="147" height="272" fill="#141820" />
    {/* Head 1 */}
    <ellipse cx="672" cy="750" rx="34" ry="40" fill="#1c2030" />
    {/* Head 2 overlapping */}
    <ellipse cx="714" cy="740" rx="32" ry="38" fill="#1c1a2a" />
    {/* Very faint blue highlight on heads */}
    <ellipse cx="668" cy="734" rx="12" ry="14" fill="#2a3550" opacity="0.35" />
    <ellipse cx="720" cy="724" rx="11" ry="13" fill="#2a2a4a" opacity="0.30" />

    {/* Panel 6 (x 775-930): Thierry Noir cartoon face */}
    <rect x="779" y="644" width="147" height="272" fill="#1c1008" />
    {/* Simple round face */}
    <circle cx="852" cy="760" r="52" fill="#281808" stroke="#3a2010" strokeWidth="3" />
    <circle cx="835" cy="748" r="8" fill="#3c2814" />
    <circle cx="870" cy="748" r="8" fill="#3c2814" />
    <path d="M 828 778 Q 852 800 876 778" fill="none" stroke="#3a2010" strokeWidth="3" />

    {/* Panel 7 (x 930-1085): More Thierry Noir + graffiti */}
    <rect x="934" y="644" width="147" height="272" fill="#141c10" />
    <circle cx="1008" cy="750" r="44" fill="#1c2814" stroke="#2c3c1c" strokeWidth="2.5" />
    <circle cx="994" cy="740" r="6" fill="#2a3a1c" />
    <circle cx="1022" cy="740" r="6" fill="#2a3a1c" />

    {/* Panel 8 (x 1085-1240): Abstract colour wash — deep blue/grey */}
    <rect x="1089" y="644" width="147" height="272" fill="#101420" />
    <rect x="1095" y="660" width="135" height="80" fill="#141c2e" />
    <rect x="1095" y="750" width="135" height="60" fill="#0e1218" />
    <rect x="1095" y="818" width="135" height="50" fill="#161020" />

    {/* Panel 9 (x 1240-1395): Faded abstract colour bands */}
    <rect x="1244" y="644" width="147" height="75" fill="#200808" opacity="0.7" />
    <rect x="1244" y="722" width="147" height="70" fill="#080820" opacity="0.6" />
    <rect x="1244" y="796" width="147" height="60" fill="#082008" opacity="0.5" />
    <rect x="1244" y="858" width="147" height="58" fill="#1c1810" opacity="0.6" />

    {/* Panel 10+ (x 1395-1920): Continuation with scrubbed/weathered look */}
    <rect x="1399" y="644" width="517" height="272" fill="#181818" />
    {/* Weathered paint peeling texture */}
    {[...Array(8)].map((_, i) => (
      <rect key={i} x={1410 + i * 62} y={660 + (i % 3) * 40} width={48} height={28}
        fill="#202020" rx="2" opacity="0.5" />
    ))}

    {/* Scattered graffiti tags */}
    {([
      [80, 870, 30], [240, 858, 24], [520, 875, 28],
      [820, 862, 26], [1050, 870, 22], [1340, 858, 25], [1550, 874, 28],
    ] as [number, number, number][]).map(([x, y, size], i) => (
      <text key={i} x={x} y={y} fill="#2a2a2a" fontSize={size}
        fontFamily="Arial" fontWeight="bold" fontStyle="italic" opacity="0.55">
        {['BERLIN', 'FREIHEIT', 'PEACE', 'KUNST', '89', 'MAUER', 'FREE'][i]}
      </text>
    ))}

    {/* Dirt / rubble strip at the base */}
    <rect x="0" y="920" width="1920" height="160" fill="#0e0e0e" />

    {/* Top vignette so sky blends into content area */}
    <linearGradient id="esg-top" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#0c0c0c" stopOpacity="0.8" />
      <stop offset="55%" stopColor="transparent" stopOpacity="0" />
    </linearGradient>
    <rect width="1920" height="1080" fill="url(#esg-top)" />
  </BgSVG>
);

// ─────────────────────────────────────────────────────────────────────────────
// POTSDAMER PLATZ — Sony Center glass canopy looking upward
// ─────────────────────────────────────────────────────────────────────────────
const PotsdamerBg: React.FC = () => {
  const cx = 960, cy = 540;
  const innerR = 220, outerRx = 620, outerRy = 490;

  return (
    <BgSVG>
      <defs>
        <radialGradient id="ptp-sky" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#0a1835" />
          <stop offset="45%" stopColor="#050f22" />
          <stop offset="100%" stopColor="#000810" />
        </radialGradient>
        <radialGradient id="ptp-oculus" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#0e1e40" />
          <stop offset="60%" stopColor="#060e26" />
          <stop offset="100%" stopColor="#020810" />
        </radialGradient>
        <filter id="ptp-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Deep night sky base */}
      <rect width="1920" height="1080" fill="url(#ptp-sky)" />

      {/* Stars visible through the canopy opening */}
      {STARS.slice(0, 14).map(([x, y, r, o], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="white" opacity={o * 0.45} />
      ))}

      {/* ── Sony Center glass canopy — looking up ── */}

      {/* Outer rim / building façades around perimeter */}
      <ellipse cx={cx} cy={cy} rx={outerRx + 80} ry={outerRy + 60}
        fill="none" stroke="#1e2e4a" strokeWidth="3" opacity="0.7" />
      <ellipse cx={cx} cy={cy} rx={outerRx + 78} ry={outerRy + 58}
        fill="none" stroke="#1e3060" strokeWidth="8" opacity="0.3" />

      {/* Glass panel quadrilateral fills between consecutive spokes */}
      {[...Array(12)].map((_, i) => {
        const a1 = ((i * 30 - 90) * Math.PI) / 180;
        const a2 = (((i + 1) * 30 - 90) * Math.PI) / 180;
        const ix1 = cx + innerR * Math.cos(a1), iy1 = cy + innerR * Math.sin(a1);
        const ix2 = cx + innerR * Math.cos(a2), iy2 = cy + innerR * Math.sin(a2);
        const ox1 = cx + outerRx * Math.cos(a1), oy1 = cy + outerRy * Math.sin(a1);
        const ox2 = cx + outerRx * Math.cos(a2), oy2 = cy + outerRy * Math.sin(a2);
        const isLight = i % 2 === 0;
        return (
          <polygon key={i}
            points={`${ix1},${iy1} ${ix2},${iy2} ${ox2},${oy2} ${ox1},${oy1}`}
            fill={isLight ? '#0d1e3c' : '#080f24'}
            stroke="#0a1830" strokeWidth="0.5"
            opacity={isLight ? 0.72 : 0.55}
          />
        );
      })}

      {/* Main radial spokes — the 12 steel cables */}
      {[...Array(12)].map((_, i) => {
        const a = ((i * 30 - 90) * Math.PI) / 180;
        const ex = cx + outerRx * Math.cos(a), ey = cy + outerRy * Math.sin(a);
        return (
          <line key={i} x1={cx} y1={cy} x2={ex} y2={ey}
            stroke="#3a6aaa" strokeWidth="3" opacity="0.7"
            filter="url(#ptp-glow)" />
        );
      })}

      {/* LED lights along each spoke */}
      {[...Array(12)].map((_, i) => {
        const a = ((i * 30 - 90) * Math.PI) / 180;
        return [0.25, 0.5, 0.75].map(t => {
          const lx = cx + t * outerRx * Math.cos(a);
          const ly = cy + t * outerRy * Math.sin(a);
          return <circle key={`${i}-${t}`} cx={lx} cy={ly} r="3.5"
            fill="#ffd84d" opacity="0.35" />;
        });
      })}

      {/* Inner hub ring */}
      <circle cx={cx} cy={cy} r={innerR}
        fill="url(#ptp-oculus)" stroke="#2a4a80" strokeWidth="2" opacity="0.9" />
      <circle cx={cx} cy={cy} r={innerR}
        fill="none" stroke="#c8deff" strokeWidth="0.6" opacity="0.25" />

      {/* Concentric tension ring */}
      <ellipse cx={cx} cy={cy} rx={innerR + 80} ry={innerR + 58}
        fill="none" stroke="#2a5090" strokeWidth="1.5" opacity="0.5"
        strokeDasharray="12,8" />

      {/* Central hub (the anchor point of all cables) */}
      <circle cx={cx} cy={cy} r="30" fill="#050f22" stroke="#3a6aaa" strokeWidth="2" />
      <circle cx={cx} cy={cy} r="14" fill="#0a1830" stroke="#5080b0" strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r="5" fill="#3060a0" />

      {/* Corner building façades visible below the canopy rim */}
      <ellipse cx={cx} cy={cy} rx={outerRx + 60} ry={outerRy + 46}
        fill="none" stroke="#101828" strokeWidth="60" opacity="0.8" />

      {/* Vignette to keep edges dark */}
      <radialGradient id="ptp-vig" cx="50%" cy="50%">
        <stop offset="0%" stopColor="transparent" />
        <stop offset="68%" stopColor="transparent" />
        <stop offset="100%" stopColor="#000810" stopOpacity="0.85" />
      </radialGradient>
      <rect width="1920" height="1080" fill="url(#ptp-vig)" />
    </BgSVG>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// KREUZBERG — Berlin Kiez street in perspective
// ─────────────────────────────────────────────────────────────────────────────
const KreuzbergBg: React.FC = () => {
  const vpx = 960, vpy = 420; // vanishing point
  const streetL = 280, streetR = 1640; // street edges at bottom

  // Street lamp props [side, x at base, y at base]
  const lampsLeft: [number, number][] = [[340,900],[530,740],[680,614],[790,538]];
  const lampsRight: [number, number][] = [[1580,900],[1390,740],[1240,614],[1130,538]];

  return (
    <BgSVG>
      <defs>
        {/* Warm sodium lamp glow */}
        {lampsLeft.concat(lampsRight).map((_, i) => (
          <radialGradient key={i} id={`kx-light${i}`} cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ff9d2e" stopOpacity="0.28" />
            <stop offset="55%" stopColor="#ff9d2e" stopOpacity="0.07" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        ))}
        <linearGradient id="kx-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0a0400" />
          <stop offset="100%" stopColor="#160800" />
        </linearGradient>
        <linearGradient id="kx-street" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0d0800" />
          <stop offset="100%" stopColor="#191208" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="1920" height="1080" fill="url(#kx-sky)" />

      {/* Left building façade */}
      <polygon
        points={`0,0 ${vpx},${vpy} ${streetL},1080 0,1080`}
        fill="#120900"
      />

      {/* Right building façade */}
      <polygon
        points={`1920,0 ${vpx},${vpy} ${streetR},1080 1920,1080`}
        fill="#110800"
      />

      {/* Street / cobblestones */}
      <polygon
        points={`${streetL},1080 ${vpx},${vpy} ${streetR},1080`}
        fill="url(#kx-street)"
      />
      {/* Cobblestone cross-hatch suggestion */}
      {[...Array(7)].map((_, i) => {
        const t = i / 6;
        const y = vpy + t * (1080 - vpy);
        const lx = vpx + (streetL - vpx) * t;
        const rx = vpx + (streetR - vpx) * t;
        return <line key={i} x1={lx} y1={y} x2={rx} y2={y}
          stroke="#1c1408" strokeWidth="1" opacity="0.65" />;
      })}

      {/* Building window rows — left façade */}
      {[...Array(5)].map((rowI) =>
        [0.15, 0.30, 0.45, 0.60, 0.72].map((tx, colI) => {
          const t = (rowI + 1) / 6;
          const lEdge = vpx * (1 - t);          // left building edge at this depth
          const ww = 28 * (1 - t * 0.5);
          const wh = 36 * (1 - t * 0.5);
          const wy = vpy + t * (800 - vpy) - wh / 2;
          const wx = lEdge * tx;
          return (
            <rect key={`${rowI}-${colI}`} x={wx} y={wy} width={ww} height={wh}
              rx="2" fill="#ff9d2e" opacity={(rowI + colI) % 3 === 0 ? 0.22 : 0.11} />
          );
        })
      )}

      {/* Building window rows — right façade */}
      {[...Array(5)].map((rowI) =>
        [0.28, 0.45, 0.60, 0.75, 0.88].map((tx, colI) => {
          const t = (rowI + 1) / 6;
          const rEdge = vpx + (1920 - vpx) * t;  // right building edge
          const ww = 28 * (1 - t * 0.5);
          const wh = 36 * (1 - t * 0.5);
          const wy = vpy + t * (800 - vpy) - wh / 2;
          const wx = rEdge + (1920 - rEdge) * tx - ww;
          return (
            <rect key={`r${rowI}-${colI}`} x={wx} y={wy} width={ww} height={wh}
              rx="2" fill="#ff9d2e" opacity={(rowI + colI) % 3 === 0 ? 0.18 : 0.09} />
          );
        })
      )}

      {/* Roofline detail — horizontal cornices */}
      <line x1="0" y1="0" x2={vpx} y2={vpy} stroke="#1c1000" strokeWidth="3" />
      <line x1="1920" y1="0" x2={vpx} y2={vpy} stroke="#1c1000" strokeWidth="3" />

      {/* Street lamps — LEFT side */}
      {lampsLeft.map(([x, y], i) => {
        const leanX = vpx + (x - vpx) * 0.12;
        return (
          <g key={i}>
            {/* Glow pool on pavement */}
            <ellipse cx={x} cy={Math.min(y + 90, 1000)} rx={55 - i * 8} ry={22 - i * 2}
              fill={`url(#kx-light${i})`} />
            {/* Pole */}
            <line x1={x} y1={y} x2={x} y2={Math.min(y + 120, 1000)}
              stroke="#1a1008" strokeWidth="4" />
            {/* Bracket arm */}
            <path d={`M ${x} ${y} Q ${leanX - 18} ${y - 22} ${leanX - 30} ${y - 28}`}
              fill="none" stroke="#1c1208" strokeWidth="3" />
            {/* Lamp head */}
            <ellipse cx={leanX - 30} cy={y - 30} rx="12" ry="7" fill="#201408" />
            {/* Lamp warm glow */}
            <ellipse cx={leanX - 30} cy={y - 30} rx="40" ry="32"
              fill="#ff9d2e" opacity={0.16 - i * 0.02} />
          </g>
        );
      })}

      {/* Street lamps — RIGHT side */}
      {lampsRight.map(([x, y], i) => {
        const leanX = vpx + (x - vpx) * 0.12;
        return (
          <g key={i}>
            <ellipse cx={x} cy={Math.min(y + 90, 1000)} rx={55 - i * 8} ry={22 - i * 2}
              fill={`url(#kx-light${i + lampsLeft.length})`} />
            <line x1={x} y1={y} x2={x} y2={Math.min(y + 120, 1000)}
              stroke="#1a1008" strokeWidth="4" />
            <path d={`M ${x} ${y} Q ${leanX + 18} ${y - 22} ${leanX + 30} ${y - 28}`}
              fill="none" stroke="#1c1208" strokeWidth="3" />
            <ellipse cx={leanX + 30} cy={y - 30} rx="12" ry="7" fill="#201408" />
            <ellipse cx={leanX + 30} cy={y - 30} rx="40" ry="32"
              fill="#ff9d2e" opacity={0.16 - i * 0.02} />
          </g>
        );
      })}

      {/* Left-side vignette keeps clock area dark */}
      <linearGradient id="kx-left-vig" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#0e0600" stopOpacity="0.6" />
        <stop offset="35%" stopColor="transparent" stopOpacity="0" />
      </linearGradient>
      <rect width="1920" height="1080" fill="url(#kx-left-vig)" />

      {/* Top fade */}
      <linearGradient id="kx-top" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#0a0400" stopOpacity="0.7" />
        <stop offset="35%" stopColor="transparent" stopOpacity="0" />
      </linearGradient>
      <rect width="1920" height="1080" fill="url(#kx-top)" />
    </BgSVG>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// HAUPTBAHNHOF — Glass barrel vault interior in perspective
// ─────────────────────────────────────────────────────────────────────────────
const HauptbahnhofBg: React.FC = () => {
  const vpx = 960, vpy = 430; // vanishing point (looking north along the hall)
  const archCount = 9;

  const getArch = (i: number) => {
    const t = i / (archCount - 1);
    const lx = Math.round(140 + t * 560);
    const rx = Math.round(1780 - t * 560);
    const ly = Math.round(860 - t * 400);
    const ry = ly;
    const apexY = Math.round(-220 + t * 620);
    return { lx, rx, ly, ry, apexY };
  };

  return (
    <BgSVG>
      <defs>
        <radialGradient id="hbf-light" cx="50%" cy="0%" r="65%">
          <stop offset="0%" stopColor="#c8dcff" stopOpacity="0.16" />
          <stop offset="50%" stopColor="#8ab0e0" stopOpacity="0.05" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hbf-floor" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#050810" />
          <stop offset="100%" stopColor="#0a0d18" />
        </linearGradient>
        <linearGradient id="hbf-glass" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0d1828" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#060d1a" stopOpacity="0.50" />
        </linearGradient>
      </defs>

      {/* Structural dark background */}
      <rect width="1920" height="1080" fill="#070a12" />

      {/* Northern diffused light flooding through the glass roof */}
      <rect width="1920" height="1080" fill="url(#hbf-light)" />

      {/* ── Glass panels between arches (bays) ── */}
      {[...Array(archCount - 1)].map((_, i) => {
        const a = getArch(i);
        const b = getArch(i + 1);
        // Left side glass panel
        return (
          <g key={i}>
            <polygon
              points={`${a.lx},${a.ly} ${b.lx},${b.ly} ${vpx},${vpy} ${vpx},${vpy}`}
              fill="url(#hbf-glass)"
              opacity={0.55 - i * 0.04}
            />
            {/* Right glass panel */}
            <polygon
              points={`${a.rx},${a.ry} ${b.rx},${b.ry} ${vpx},${vpy} ${vpx},${vpy}`}
              fill="url(#hbf-glass)"
              opacity={0.50 - i * 0.04}
            />
            {/* Cross-brace diagonal between consecutive arch bases */}
            <line x1={a.lx} y1={a.ly} x2={b.lx + (b.rx - b.lx) / 3} y2={b.ly}
              stroke="#1a2840" strokeWidth="0.8" opacity="0.45" />
            <line x1={a.rx} y1={a.ry} x2={b.rx - (b.rx - b.lx) / 3} y2={b.ry}
              stroke="#1a2840" strokeWidth="0.8" opacity="0.45" />
          </g>
        );
      })}

      {/* ── Steel arch ribs, foreground → background ── */}
      {[...Array(archCount)].map((_, i) => {
        const { lx, rx, ly, apexY } = getArch(i);
        const t = i / (archCount - 1);
        const strokeW = Math.max(0.6, 3.5 - t * 3);
        const opacity = 0.75 - t * 0.35;
        return (
          <path key={i}
            d={`M ${lx} ${ly} Q ${vpx} ${apexY} ${rx} ${ly}`}
            fill="none"
            stroke="#c8dcff"
            strokeWidth={strokeW}
            opacity={opacity}
          />
        );
      })}

      {/* Secondary cross-bracing lattice on the arch surfaces */}
      {[...Array(archCount - 1)].map((_, i) => {
        const a = getArch(i), b = getArch(i + 1);
        return [0.25, 0.5, 0.75].map(t => {
          const lax = a.lx + t * (vpx - a.lx), lay = a.ly + t * (vpy - a.ly);
          const lbx = b.lx + t * (vpx - b.lx), lby = b.ly + t * (vpy - b.ly);
          return (
            <line key={`${i}-${t}`} x1={lax} y1={lay} x2={lbx} y2={lby}
              stroke="#1e3050" strokeWidth="0.5" opacity="0.4" />
          );
        });
      })}

      {/* Floor surface — platforms below */}
      <polygon
        points={`0,1080 ${140},${860} ${vpx},${vpy} ${1780},${860} 1920,1080`}
        fill="url(#hbf-floor)"
      />

      {/* Platform edge lines (tracks) converging to VP */}
      {[-180, 0, 180].map((offset, i) => (
        <line key={i}
          x1={vpx + offset} y1={vpy}
          x2={vpx + offset * 6.2} y2={1080}
          stroke="#141e30" strokeWidth="2" opacity="0.6"
        />
      ))}

      {/* Train silhouettes on platform */}
      {[[-820, 900], [820, 900]].map(([x, y], i) => (
        <rect key={i} x={vpx + x * 0.3} y={y} width={x < 0 ? -x * 0.8 : x * 0.8} height={50}
          rx="4" fill="#0a1020" stroke="#141c2e" strokeWidth="1" />
      ))}

      {/* Vertical clerestory windows on the side walls */}
      {[...Array(8)].map((_, i) => {
        const t = i / 7;
        const wx = 0 + t * (vpx - 100);
        const wy = vpy + (1 - t) * 200;
        return (
          <rect key={i} x={wx} y={wy} width={16 * (1 - t * 0.6)} height={60 * (1 - t * 0.6)}
            rx="3" fill="#c8dcff" opacity="0.06" />
        );
      })}
      {[...Array(8)].map((_, i) => {
        const t = i / 7;
        const wx = 1920 - t * (1920 - vpx - 100) - 16;
        const wy = vpy + (1 - t) * 200;
        return (
          <rect key={`r${i}`} x={wx} y={wy} width={16 * (1 - t * 0.6)} height={60 * (1 - t * 0.6)}
            rx="3" fill="#c8dcff" opacity="0.06" />
        );
      })}

      {/* Top vignette */}
      <linearGradient id="hbf-top-fade" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#070a12" stopOpacity="0.55" />
        <stop offset="30%" stopColor="transparent" stopOpacity="0" />
      </linearGradient>
      <rect width="1920" height="1080" fill="url(#hbf-top-fade)" />

      {/* Left darkening vignette */}
      <linearGradient id="hbf-leftvig" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#070a12" stopOpacity="0.55" />
        <stop offset="30%" stopColor="transparent" stopOpacity="0" />
      </linearGradient>
      <rect width="1920" height="1080" fill="url(#hbf-leftvig)" />
    </BgSVG>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Public export
// ─────────────────────────────────────────────────────────────────────────────
interface ThemeBackgroundProps {
  themeId: string;
}

export const ThemeBackground: React.FC<ThemeBackgroundProps> = ({ themeId }) => {
  const backgrounds: Record<string, React.ReactNode> = {
    'bvg-yellow':       <BVGBg />,
    'berlin-night':     <BerghainBg />,
    'berliner-dom':     <BerlinerDomBg />,
    'berlin-mitte':     <FernsehturmBg />,
    'east-side':        <EastSideBg />,
    'potsdamer-platz':  <PotsdamerBg />,
    'kreuzberg':        <KreuzbergBg />,
    'hauptbahnhof':     <HauptbahnhofBg />,
  };

  const content = backgrounds[themeId];
  if (!content) return null;

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: -1,
      opacity: 0.45,
    }}>
      {content}
    </div>
  );
};
