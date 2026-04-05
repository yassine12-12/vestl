import React from 'react';

interface VortexOrreryProps {
  hourAngle: number;
  minuteAngle: number;
  secondAngle: number;
  [key: string]: unknown;
}

export const VortexOrrery: React.FC<VortexOrreryProps> = ({
  hourAngle,
  minuteAngle,
  secondAngle,
}) => {
  // Pre-placed star field (stable – not random per render)
  const stars = [
    {x:18,y:22,r:0.9},{x:45,y:12,r:1.2},{x:72,y:8,r:0.6},{x:92,y:18,r:0.9},
    {x:130,y:10,r:1.0},{x:158,y:25,r:0.7},{x:178,y:15,r:1.1},{x:188,y:45,r:0.8},
    {x:190,y:75,r:0.6},{x:182,y:110,r:1.2},{x:186,y:145,r:0.8},{x:174,y:168,r:0.9},
    {x:155,y:184,r:1.0},{x:128,y:192,r:0.6},{x:95,y:196,r:1.1},{x:62,y:190,r:0.7},
    {x:32,y:178,r:0.9},{x:15,y:158,r:1.2},{x:8,y:128,r:0.6},{x:12,y:95,r:0.9},
    {x:10,y:60,r:1.0},{x:22,y:40,r:0.7},{x:35,y:28,r:0.8},{x:168,y:55,r:0.6},
    {x:162,y:140,r:0.9},{x:40,y:165,r:1.0},{x:28,y:105,r:0.7},{x:55,y:192,r:0.6},
    {x:50,y:50,r:0.5},{x:142,y:38,r:0.8},{x:175,y:90,r:0.6},{x:20,y:145,r:0.7},
  ];

  const rHour   = 52;
  const rMinute = 70;
  const rSecond = 84;

  const pos = (r: number, angle: number) => {
    const rad = (angle - 90) * Math.PI / 180;
    return { x: 100 + r * Math.cos(rad), y: 100 + r * Math.sin(rad) };
  };

  const hp = pos(rHour,   hourAngle);
  const mp = pos(rMinute, minuteAngle);
  const sp = pos(rSecond, secondAngle);

  // Spiral arm helper – returns "x,y" space-separated string for polyline
  const spiralArm = (startDeg: number, turns: number, r0: number, r1: number, pts: number) =>
    [...Array(pts)].map((_, i) => {
      const t = i / (pts - 1);
      const a = (startDeg + t * turns * 360 - 90) * Math.PI / 180;
      const r = r0 + (r1 - r0) * t;
      return `${(100 + r * Math.cos(a)).toFixed(2)},${(100 + r * Math.sin(a)).toFixed(2)}`;
    }).join(' ');

  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs>
        <radialGradient id="vo-bg" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#06040e" />
          <stop offset="60%" stopColor="#030209" />
          <stop offset="100%" stopColor="#010106" />
        </radialGradient>
        <radialGradient id="vo-nebula" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#1a0a3a" stopOpacity="0.85" />
          <stop offset="45%" stopColor="#0a0520" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="vo-hour-pl" cx="35%" cy="30%">
          <stop offset="0%" stopColor="#a8d0ff" />
          <stop offset="50%" stopColor="#4488dd" />
          <stop offset="100%" stopColor="#1144aa" />
        </radialGradient>
        <radialGradient id="vo-min-pl" cx="35%" cy="30%">
          <stop offset="0%" stopColor="#88ffee" />
          <stop offset="50%" stopColor="#22bbaa" />
          <stop offset="100%" stopColor="#006655" />
        </radialGradient>
        <radialGradient id="vo-sec-pl" cx="35%" cy="30%">
          <stop offset="0%" stopColor="#fff8e0" />
          <stop offset="40%" stopColor="#ffcc44" />
          <stop offset="100%" stopColor="#ff8800" />
        </radialGradient>
        <radialGradient id="vo-core" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#c0b0ff" />
          <stop offset="35%" stopColor="#6050e0" />
          <stop offset="70%" stopColor="#2a1880" />
          <stop offset="100%" stopColor="#0a0520" />
        </radialGradient>
        <filter id="vo-glow-lg" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="vo-glow-sm" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="vo-core-glow" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="7" result="blur1" />
          <feGaussianBlur stdDeviation="3" result="blur2" />
          <feMerge>
            <feMergeNode in="blur1" />
            <feMergeNode in="blur2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Deep space background */}
      <circle cx="100" cy="100" r="100" fill="url(#vo-bg)" />

      {/* Nebula glow */}
      <circle cx="100" cy="100" r="50" fill="url(#vo-nebula)" />

      {/* Star field */}
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r}
          fill="white" opacity={0.28 + (i % 5) * 0.12}
        />
      ))}

      {/* Galaxy spiral arms */}
      <polyline
        points={spiralArm(0, 0.75, 10, 86, 45)}
        fill="none" stroke="#5545b0" strokeWidth="0.6" opacity="0.22"
      />
      <polyline
        points={spiralArm(180, 0.75, 10, 86, 45)}
        fill="none" stroke="#5545b0" strokeWidth="0.6" opacity="0.22"
      />
      <polyline
        points={spiralArm(90, 0.75, 8, 80, 40)}
        fill="none" stroke="#3535a0" strokeWidth="0.4" opacity="0.14"
      />

      {/* Outer boundary */}
      <circle cx="100" cy="100" r="96" fill="none" stroke="#2a1f60" strokeWidth="0.5" opacity="0.7" />

      {/* 12-position tick marks */}
      {[...Array(12)].map((_, i) => {
        const a = (i * 30 - 90) * Math.PI / 180;
        return (
          <line key={i}
            x1={100 + 94 * Math.cos(a)} y1={100 + 94 * Math.sin(a)}
            x2={100 + 91 * Math.cos(a)} y2={100 + 91 * Math.sin(a)}
            stroke="#5050a0" strokeWidth={i % 3 === 0 ? 1 : 0.5} opacity="0.55"
          />
        );
      })}

      {/* Orbital tracks */}
      <circle cx="100" cy="100" r={rHour}
        fill="none" stroke="#4488dd" strokeWidth="0.4" strokeDasharray="2,5" opacity="0.4" />
      <circle cx="100" cy="100" r={rMinute}
        fill="none" stroke="#22bbaa" strokeWidth="0.4" strokeDasharray="2,5" opacity="0.35" />
      <circle cx="100" cy="100" r={rSecond}
        fill="none" stroke="#ffaa22" strokeWidth="0.35" strokeDasharray="1,4" opacity="0.3" />

      {/* ── Comet trail (3 fading dots behind second planet) ── */}
      {[1, 2, 3].map((offset) => {
        const tp = pos(rSecond, secondAngle - offset * 9);
        return (
          <circle key={offset} cx={tp.x} cy={tp.y}
            r={3.2 - offset * 0.8} fill="#ffcc44"
            opacity={0.32 - offset * 0.08}
          />
        );
      })}

      {/* ── Second planet / comet ── */}
      <circle cx={sp.x} cy={sp.y} r="3.2"
        fill="url(#vo-sec-pl)" filter="url(#vo-glow-sm)" />

      {/* ── Minute moon ── */}
      <circle cx={mp.x} cy={mp.y} r="5.5"
        fill="url(#vo-min-pl)" filter="url(#vo-glow-sm)" />

      {/* ── Hour planet with ring ── */}
      <ellipse
        cx={hp.x} cy={hp.y} rx="12" ry="3.5"
        fill="none" stroke="#88bbff" strokeWidth="0.8" opacity="0.55"
        transform={`rotate(-30 ${hp.x} ${hp.y})`}
      />
      <circle cx={hp.x} cy={hp.y} r="8"
        fill="url(#vo-hour-pl)" filter="url(#vo-glow-lg)" />

      {/* ── Central stellar core ── */}
      <circle cx="100" cy="100" r="14" fill="#050215" />
      <circle cx="100" cy="100" r="10" fill="url(#vo-core)" filter="url(#vo-core-glow)" />
      <circle cx="100" cy="100" r="4" fill="#8878ff" opacity="0.9" />
      <circle cx="100" cy="100" r="1.8" fill="white" opacity="0.9" />
    </svg>
  );
};
