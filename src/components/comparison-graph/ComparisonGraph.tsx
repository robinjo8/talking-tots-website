
import React from 'react';
import { getTomiTalkCurve, getPublicCurve } from './curveUtils';

interface ComparisonGraphProps {
  curveProgress: number;
  dimensions: {
    width: number;
    height: number;
  };
}

export function ComparisonGraph({ curveProgress, dimensions }: ComparisonGraphProps) {
  // Responsive styling based on screen size
  const isMobile = dimensions.width < 768;
  
  // Responsive stroke widths - thinner for desktop, slightly thicker for mobile visibility
  const tomiStrokeWidth = isMobile ? 4 : 3;
  const publicStrokeWidth = isMobile ? 3.5 : 2.5;
  
  // Responsive circle sizes
  const circleStartR = isMobile ? 6 : 8;
  const circleEndR = isMobile ? 14 : 18;

  // Responsive font sizes
  const axisFontSize = isMobile ? 16 : 24;
  const timeAxisFontSize = isMobile ? 20 : 28;

  // End point location (same as TomiTalk curve)
  const endX = dimensions.width - 80;
  const endY = 80;

  return (
    <svg
      className="w-full max-w-3xl"
      width={dimensions.width}
      height={dimensions.height}
      viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
      preserveAspectRatio="xMidYMid meet"
      style={{
        maxWidth: '100%',
        height: 'auto',
      }}
    >
      <defs>
        <linearGradient id="curve-gradient" x1="0%" y1="100%" x2="100%" y2="0%" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#B9F6CA" />
          <stop offset="33%" stopColor="#69F0AE" />
          <stop offset="66%" stopColor="#00E676" />
          <stop offset="100%" stopColor="#388E3C" />
        </linearGradient>
        <linearGradient id="area-gradient" x1="0%" y1="100%" x2="100%" y2="0%" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#4CAF50" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#81C784" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id="public-curve-gradient" x1="0%" y1="100%" x2="100%" y2="10%" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#FF9800" />
          <stop offset="60%" stopColor="#FF3C00" />
          <stop offset="100%" stopColor="#D32F2F" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g opacity="0.11">
        {Array.from({ length: 6 }).map((_, i) => {
          const x = 80 + (i * (dimensions.width - 160)) / 5;
          return <line key={`v-${i}`} x1={x} y1="60" x2={x} y2={dimensions.height - 60} stroke="#4CAF50" strokeWidth="1" strokeDasharray="2,4" />;
        })}
        {Array.from({ length: 5 }).map((_, i) => {
          const y = 80 + (i * (dimensions.height - 140)) / 4;
          return <line key={`h-${i}`} x1="80" y1={y} x2={dimensions.width - 80} y2={y} stroke="#4CAF50" strokeWidth="1" strokeDasharray="2,4" />;
        })}
      </g>

      <g stroke="#E0E0E0" strokeWidth="2">
        <line x1="80" y1="60" x2="80" y2={dimensions.height - 60} />
        <line x1="80" y1={dimensions.height - 60} x2={dimensions.width - 80} y2={dimensions.height - 60} />
      </g>

      <g>
        <text
          x="35"
          y={dimensions.height / 2}
          textAnchor="middle"
          fontWeight={900}
          fontSize={axisFontSize}
          fill="#111"
          transform={`rotate(-90, 35, ${dimensions.height / 2})`}
          style={{ letterSpacing: '0.04em' }}
        >
          Napredek
        </text>
      </g>
      <g>
        <text x={dimensions.width / 2} y={dimensions.height - 18} textAnchor="middle" fontWeight={900} fontSize={timeAxisFontSize} fill="#111">
          Čas
        </text>
      </g>

      {curveProgress > 0.1 && <path d={`${getTomiTalkCurve(curveProgress, dimensions.width, dimensions.height)} L${80 + (dimensions.width - 160) * curveProgress} ${dimensions.height - 60} L80 ${dimensions.height - 60} Z`} fill="url(#area-gradient)" opacity="0.28" />}

      <path
        d={getPublicCurve(curveProgress, dimensions.width, dimensions.height)}
        fill="none"
        stroke="url(#public-curve-gradient)"
        strokeWidth={publicStrokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={curveProgress > 0.025 ? 1 : 0}
        style={{
          filter: 'drop-shadow(0px 1px 6px rgba(243, 94, 35, 0.08))',
          transition: 'stroke-width 0.3s',
        }}
      />

      <path
        d={getTomiTalkCurve(curveProgress, dimensions.width, dimensions.height)}
        fill="none"
        stroke="url(#curve-gradient)"
        strokeWidth={tomiStrokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glow)"
        style={{
          filter: 'drop-shadow(0px 2px 8px rgba(76, 175, 80, 0.2))',
          transition: 'stroke-width 0.3s',
        }}
      />

      <g>
        <circle
          cx="80"
          cy={dimensions.height - 60}
          r={circleStartR}
          fill="#FF9800"
          stroke="#fff"
          strokeWidth="2"
          style={{ filter: 'drop-shadow(0px 1px 4px rgba(255, 152, 0, 0.24))' }}
        />
      </g>

      {curveProgress > 0.9 && (
        <g>
          <circle
            cx={endX}
            cy={endY}
            r={circleEndR}
            fill="#4CAF50"
            stroke="#fff"
            strokeWidth="2"
            className="animate-pulse"
            style={{ filter: 'drop-shadow(0px 3px 10px rgba(76, 175, 80, 0.35))' }}
          />
        </g>
      )}
    </svg>
  );
}
