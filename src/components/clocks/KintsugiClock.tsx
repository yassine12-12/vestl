import React from 'react';

interface KintsugiClockProps {
  hourAngle: number;
  minuteAngle: number;
  secondAngle: number;
  [key: string]: unknown;
}

export const KintsugiClock: React.FC<KintsugiClockProps> = ({
  hourAngle,
  minuteAngle,
  secondAngle,
}) => {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs>
        <radialGradient id="kin-bg" cx="50%" cy="45%">
          <stop offset="0%" stopColor="#1a1510" />
          <stop offset="55%" stopColor="#0d0b08" />
          <stop offset="100%" stopColor="#060504" />
        </radialGradient>
        <linearGradient id="kin-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c8950a" />
          <stop offset="25%" stopColor="#f5d060" />
          <stop offset="50%" stopColor="#ffd700" />
          <stop offset="75%" stopColor="#e8b820" />
          <stop offset="100%" stopColor="#b07a00" />
        </linearGradient>
        <linearGradient id="kin-hand" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#b07a00" />
          <stop offset="40%" stopColor="#ffd700" />
          <stop offset="60%" stopColor="#fff0a0" />
          <stop offset="100%" stopColor="#b07a00" />
        </linearGradient>
        <filter id="kin-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="kin-warm" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Obsidian black background */}
      <circle cx="100" cy="100" r="99" fill="url(#kin-bg)" />

      {/* Obsidian gloss highlight – top-left catch light */}
      <ellipse cx="72" cy="62" rx="28" ry="18" fill="white" opacity="0.025"
        transform="rotate(-30 72 62)" />

      {/* Outer gold rim */}
      <circle cx="100" cy="100" r="95" fill="none" stroke="url(#kin-gold)" strokeWidth="0.6" opacity="0.4" />
      <circle cx="100" cy="100" r="92" fill="none" stroke="url(#kin-gold)" strokeWidth="0.3" opacity="0.22" />

      {/* ── KINTSUGI CRACK NETWORK ── */}
      {/* Main crack: top-right diagonal through center to bottom-left */}
      <path
        d="M 152 14 C 145 26 140 40 134 50 C 128 60 122 67 118 75 C 114 83 110 90 107 98 C 104 106 101 114 97 122 C 93 130 87 138 81 148 C 75 158 68 168 60 182"
        fill="none" stroke="url(#kin-gold)" strokeWidth="2" strokeLinecap="round"
        filter="url(#kin-glow)" opacity="0.92"
      />
      {/* Branch 1 → 3 o'clock */}
      <path
        d="M 118 75 C 126 77 136 76 146 73 C 156 70 166 64 178 58"
        fill="none" stroke="url(#kin-gold)" strokeWidth="1.3" strokeLinecap="round"
        filter="url(#kin-glow)" opacity="0.85"
      />
      {/* Branch 2 → 9 o'clock */}
      <path
        d="M 101 114 C 93 113 83 110 72 108 C 61 106 48 105 30 106"
        fill="none" stroke="url(#kin-gold)" strokeWidth="1.1" strokeLinecap="round"
        filter="url(#kin-glow)" opacity="0.8"
      />
      {/* Secondary crack: top-left arc */}
      <path
        d="M 38 30 C 46 43 53 55 60 65 C 67 75 74 83 80 90 C 86 97 90 102 96 107"
        fill="none" stroke="url(#kin-gold)" strokeWidth="0.8" strokeLinecap="round"
        filter="url(#kin-glow)" opacity="0.75"
      />
      {/* Hairline crack: bottom-right */}
      <path
        d="M 162 150 C 154 142 144 133 136 125 C 128 117 121 111 115 106"
        fill="none" stroke="url(#kin-gold)" strokeWidth="0.65" strokeLinecap="round"
        filter="url(#kin-glow)" opacity="0.7"
      />
      {/* Hairline branch: bottom-right downward */}
      <path
        d="M 136 125 C 140 133 144 145 148 157 C 152 169 153 176 154 184"
        fill="none" stroke="url(#kin-gold)" strokeWidth="0.5" strokeLinecap="round"
        opacity="0.55"
      />
      {/* Hairline fissure: lower arc */}
      <path
        d="M 85 162 C 92 157 99 152 107 148 C 115 144 125 140 134 137"
        fill="none" stroke="url(#kin-gold)" strokeWidth="0.5" strokeLinecap="round"
        opacity="0.5"
      />

      {/* Hour markers – gold dots at standard positions */}
      {[...Array(12)].map((_, i) => {
        const a = (i * 30 - 90) * Math.PI / 180;
        const isCardinal = i % 3 === 0;
        return (
          <circle key={i}
            cx={100 + 80 * Math.cos(a)} cy={100 + 80 * Math.sin(a)}
            r={isCardinal ? 2.8 : 1.5}
            fill="url(#kin-gold)" filter="url(#kin-glow)"
            opacity={isCardinal ? 0.9 : 0.7}
          />
        );
      })}

      {/* Hour hand – poured gold */}
      <g transform={`rotate(${hourAngle} 100 100)`} filter="url(#kin-glow)">
        <path
          d="M 97.5 100 C 97.8 80 98.5 62 99 55 C 99.5 50 100.5 50 101 55 C 101.5 62 102.2 80 102.5 100 Z"
          fill="url(#kin-hand)" opacity="0.95"
        />
        <path d="M 97.5 100 L 102.5 100 L 103.5 107 L 100 113 L 96.5 107 Z"
          fill="url(#kin-hand)" opacity="0.7" />
        <line x1="100" y1="55" x2="100" y2="100" stroke="#fff0a0" strokeWidth="0.6" opacity="0.4" />
      </g>

      {/* Minute hand */}
      <g transform={`rotate(${minuteAngle} 100 100)`} filter="url(#kin-glow)">
        <path
          d="M 98.8 100 C 99 82 99.4 50 99.6 30 C 99.8 26 100.2 26 100.4 30 C 100.6 50 101 82 101.2 100 Z"
          fill="url(#kin-hand)" opacity="0.9"
        />
        <path d="M 98.8 100 L 101.2 100 L 102.2 108 L 100 114 L 97.8 108 Z"
          fill="url(#kin-hand)" opacity="0.65" />
        <line x1="100" y1="30" x2="100" y2="100" stroke="#fff0a0" strokeWidth="0.5" opacity="0.35" />
      </g>

      {/* Second hand – fine gold wire */}
      <g transform={`rotate(${secondAngle} 100 100)`} filter="url(#kin-warm)">
        <line x1="100" y1="20" x2="100" y2="105" stroke="#ffd700" strokeWidth="0.7" opacity="0.85" />
        <line x1="100" y1="105" x2="100" y2="122" stroke="#ffd700" strokeWidth="0.7" opacity="0.4" />
        <circle cx="100" cy="20" r="1.5" fill="#ffd700" />
      </g>

      {/* Center kintsugi repair joint */}
      <circle cx="100" cy="100" r="8" fill="url(#kin-gold)" filter="url(#kin-glow)" />
      <circle cx="100" cy="100" r="5" fill="#1a1510" />
      <circle cx="100" cy="100" r="3" fill="url(#kin-gold)" />
      <circle cx="100" cy="100" r="1.5" fill="#fff0a0" opacity="0.8" />
    </svg>
  );
};
