import React from 'react';

interface WeatherIconProps {
  /** WMO weather code (0-99) */
  code: number;
  color: string;
  size?: number;
}

type IconType = 'clear' | 'partly-cloudy' | 'cloudy' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'thunder';

function getIconType(code: number): IconType {
  if (code <= 1) return 'clear';
  if (code === 2) return 'partly-cloudy';
  if (code === 3) return 'cloudy';
  if (code === 45 || code === 48) return 'fog';
  if (code >= 51 && code <= 55) return 'drizzle';
  if (code >= 56 && code <= 57) return 'drizzle';
  if (code >= 61 && code <= 67) return 'rain';
  if (code >= 71 && code <= 77) return 'snow';
  if (code >= 80 && code <= 82) return 'rain';
  if (code >= 85 && code <= 86) return 'snow';
  if (code >= 95) return 'thunder';
  return 'clear';
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ code, color, size = 48 }) => {
  const type = getIconType(code);
  const s = size;

  const SunRays = ({ cx, cy, r1, r2, count = 8, opacity = 1 }: { cx: number; cy: number; r1: number; r2: number; count?: number; opacity?: number }) => (
    <>
      {Array.from({ length: count }, (_, i) => {
        const angle = (i * 360) / count;
        const rad = (angle * Math.PI) / 180;
        return (
          <line
            key={i}
            x1={cx + Math.cos(rad) * r1}
            y1={cy + Math.sin(rad) * r1}
            x2={cx + Math.cos(rad) * r2}
            y2={cy + Math.sin(rad) * r2}
            stroke={color}
            strokeWidth={s * 0.054}
            strokeLinecap="round"
            opacity={opacity}
          />
        );
      })}
    </>
  );

  const Cloud = ({ x, y, w, h, opacity = 1 }: { x: number; y: number; w: number; h: number; opacity?: number }) => {
    const hh = h * 0.5;
    const bx = x + w * 0.15;
    const bw = w * 0.7;
    const by = y + h * 0.55;
    return (
      <g opacity={opacity}>
        {/* bumps */}
        <circle cx={x + w * 0.28} cy={y + hh * 0.9} r={h * 0.32} fill={color} />
        <circle cx={x + w * 0.52} cy={y + hh * 0.55} r={h * 0.45} fill={color} />
        <circle cx={x + w * 0.76} cy={y + hh * 0.9} r={h * 0.28} fill={color} />
        {/* base */}
        <rect x={bx} y={by} width={bw} height={h * 0.45} rx={h * 0.2} fill={color} />
      </g>
    );
  };

  const RainDrops = ({ xs, yStart, yEnd, opacity = 1 }: { xs: number[]; yStart: number; yEnd: number; opacity?: number }) => (
    <>
      {xs.map((x, i) => (
        <line
          key={i}
          x1={x}
          y1={yStart + i * 2}
          x2={x - s * 0.06}
          y2={yEnd + i * 2}
          stroke={color}
          strokeWidth={s * 0.05}
          strokeLinecap="round"
          opacity={opacity}
        />
      ))}
    </>
  );

  const SnowDots = ({ xs, ys, opacity = 0.7 }: { xs: number[]; ys: number[]; opacity?: number }) => (
    <>
      {xs.map((x, i) =>
        ys.map((y, j) => (
          <circle
            key={`${i}-${j}`}
            cx={x + j * 1}
            cy={y}
            r={s * 0.04}
            fill={color}
            opacity={opacity - j * 0.15}
          />
        ))
      )}
    </>
  );

  switch (type) {
    case 'clear':
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r={8} fill={color} />
          <SunRays cx={24} cy={24} r1={11} r2={16} count={8} />
        </svg>
      );

    case 'partly-cloudy':
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
          <circle cx="17" cy="17" r={7} fill={color} opacity={0.75} />
          <SunRays cx={17} cy={17} r1={9.5} r2={13} count={8} opacity={0.5} />
          <Cloud x={9} y={23} w={30} h={16} />
        </svg>
      );

    case 'cloudy':
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
          <Cloud x={4} y={10} w={40} h={22} />
        </svg>
      );

    case 'fog':
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
          <Cloud x={4} y={6} w={40} h={20} opacity={0.5} />
          {[25, 31, 37].map((y, i) => (
            <line
              key={i}
              x1={6 + i * 2}
              y1={y}
              x2={42 - i * 2}
              y2={y}
              stroke={color}
              strokeWidth={s * 0.052}
              strokeLinecap="round"
              opacity={0.8 - i * 0.2}
            />
          ))}
        </svg>
      );

    case 'drizzle':
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
          <Cloud x={5} y={6} w={38} h={20} />
          <RainDrops xs={[14, 22, 30, 38]} yStart={31} yEnd={37} opacity={0.55} />
        </svg>
      );

    case 'rain':
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
          <Cloud x={5} y={4} w={38} h={20} />
          <RainDrops xs={[13, 21, 29, 37]} yStart={30} yEnd={40} opacity={0.9} />
        </svg>
      );

    case 'snow':
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
          <Cloud x={5} y={4} w={38} h={20} />
          <SnowDots xs={[13, 22, 31, 40]} ys={[32, 39]} />
        </svg>
      );

    case 'thunder':
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
          <Cloud x={5} y={4} w={38} h={20} />
          {/* Lightning bolt */}
          <path
            d="M27 27 L20 38 L25 38 L18 48 L31 34 L26 34 L32 27Z"
            fill={color}
          />
        </svg>
      );

    default:
      return null;
  }
};
