import React, { useEffect, useRef, useState } from "react";
import { Clock, Rocket } from "lucide-react";

const CURVE_DURATION = 3000;

function getAnimatedPath(progress: number, width: number, height: number) {
  const startX = 80;
  const endX = width - 80;
  const startY = height - 60;
  const endY = 80;
  
  // Create points for a smooth exponential curve
  const steps = Math.floor(100 + progress * 100);
  let d = `M${startX} ${startY}`;
  
  for (let i = 1; i <= steps; i++) {
    const t = (i / steps) * progress;
    
    // Exponential easing for dramatic acceleration effect
    const eased = 1 - Math.exp(-3.5 * t);
    
    const x = startX + (endX - startX) * t;
    const y = startY - (startY - endY) * eased;
    
    d += ` L${x} ${y}`;
  }
  
  return d;
}

export function ProgressComparisonSection() {
  const [curveProgress, setCurveProgress] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });
  const containerRef = useRef<HTMLDivElement>(null);
  const reqRef = useRef<number>();

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: Math.max(800, rect.width - 32), // Account for padding
          height: 400
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    let start: number;
    function animateCurve(ts: number) {
      if (!start) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / CURVE_DURATION, 1);
      
      // Smooth easing with slight acceleration
      const eased = 1 - Math.pow(1 - progress, 2.5);
      setCurveProgress(eased);
      
      if (progress < 1) {
        reqRef.current = requestAnimationFrame(animateCurve);
      }
    }
    
    const timeout = setTimeout(() => {
      reqRef.current = requestAnimationFrame(animateCurve);
    }, 500); // Small delay before animation starts

    return () => {
      clearTimeout(timeout);
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, []);

  return (
    <section
      className="w-full py-12 md:py-20 px-4 bg-light-cloud transition-colors duration-500"
      style={{
        fontFamily: "Nunito, sans-serif",
      }}
    >
      <div className="max-w-7xl mx-auto md:rounded-3xl bg-white shadow-md px-4 md:px-8 py-8 md:py-14 relative overflow-hidden border border-green-200">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#212121] mb-12 text-center">
          <span className="font-bold text-dragon-green">3× hitrejši</span>{" "}
          <span className="text-app-orange">napredek z aplikacijo Tomi Talk</span>
        </h2>

        {/* Full-width graph container */}
        <div ref={containerRef} className="w-full relative mb-4">
          <svg
            className="w-full"
            width={dimensions.width}
            height={dimensions.height}
            viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
            preserveAspectRatio="xMidYMid meet"
            style={{ maxWidth: '100%', height: 'auto' }}
          >
            {/* Gradient definitions */}
            <defs>
              <linearGradient id="curve-gradient" x1="0%" y1="100%" x2="100%" y2="0%" gradientUnits="objectBoundingBox">
                <stop offset="0%" stopColor="#B9F6CA" /> {/* Light green */}
                <stop offset="33%" stopColor="#69F0AE" />
                <stop offset="66%" stopColor="#00E676" />
                <stop offset="100%" stopColor="#388E3C" /> {/* Darker green */}
              </linearGradient>
              <linearGradient id="area-gradient" x1="0%" y1="100%" x2="100%" y2="0%" gradientUnits="objectBoundingBox">
                <stop offset="0%" stopColor="#4CAF50" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#81C784" stopOpacity="0.05" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            
            {/* Background grid */}
            <g opacity="0.1">
              {/* Vertical grid lines */}
              {Array.from({ length: 6 }).map((_, i) => {
                const x = 80 + (i * (dimensions.width - 160) / 5);
                return (
                  <line
                    key={`v-${i}`}
                    x1={x}
                    y1="60"
                    x2={x}
                    y2={dimensions.height - 60}
                    stroke="#4CAF50"
                    strokeWidth="1"
                    strokeDasharray="2,4"
                  />
                );
              })}
              
              {/* Horizontal grid lines */}
              {Array.from({ length: 5 }).map((_, i) => {
                const y = 80 + (i * (dimensions.height - 140) / 4);
                return (
                  <line
                    key={`h-${i}`}
                    x1="80"
                    y1={y}
                    x2={dimensions.width - 80}
                    y2={y}
                    stroke="#4CAF50"
                    strokeWidth="1"
                    strokeDasharray="2,4"
                  />
                );
              })}
            </g>
            
            {/* Axes */}
            <g stroke="#E0E0E0" strokeWidth="2">
              {/* Y-axis */}
              <line x1="80" y1="60" x2="80" y2={dimensions.height - 60} />
              {/* X-axis */}
              <line x1="80" y1={dimensions.height - 60} x2={dimensions.width - 80} y2={dimensions.height - 60} />
            </g>
            
            {/* Axis labels */}
            <g fill="#666" fontSize="14" fontWeight="600">
              {/* Y-axis label */}
              <text x="40" y="50" textAnchor="middle" className="font-semibold">
                Napredek
              </text>
              <text x="40" y="65" textAnchor="middle" fontSize="12">
                ↑
              </text>
              
              {/* X-axis label */}
              <text x={dimensions.width - 40} y={dimensions.height - 35} textAnchor="end" className="font-semibold">
                Čas
              </text>
            </g>
            
            {/* Area under curve (subtle fill) */}
            {curveProgress > 0.1 && (
              <path
                d={`${getAnimatedPath(curveProgress, dimensions.width, dimensions.height)} L${80 + (dimensions.width - 160) * curveProgress} ${dimensions.height - 60} L80 ${dimensions.height - 60} Z`}
                fill="url(#area-gradient)"
                opacity="0.3"
              />
            )}
            
            {/* Main animated curve (thicker, multi-green gradient) */}
            <path
              d={getAnimatedPath(curveProgress, dimensions.width, dimensions.height)}
              fill="none"
              stroke="url(#curve-gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow)"
              style={{
                filter: "drop-shadow(0px 4px 12px rgba(76, 175, 80, 0.4))",
                transition: 'stroke-width 0.3s'
              }}
            />
            
            {/* Start point (traditional system) */}
            <g>
              <circle
                cx="80"
                cy={dimensions.height - 60}
                r="8"
                fill="#FF9800"
                stroke="#fff"
                strokeWidth="3"
                style={{
                  filter: "drop-shadow(0px 2px 8px rgba(255, 152, 0, 0.4))",
                }}
              />
              <foreignObject x="45" y={dimensions.height - 35} width="32" height="32">
                <Clock size={24} className="text-white" />
              </foreignObject>
            </g>
            
            {/* End point (Tomi Talk) - appears when curve is nearly complete */}
            {curveProgress > 0.90 && (
              <g>
                <circle
                  cx={dimensions.width - 80}
                  cy="80"
                  r="10"
                  fill="#4CAF50"
                  stroke="#fff"
                  strokeWidth="3"
                  className="animate-pulse"
                  style={{
                    filter: "drop-shadow(0px 3px 12px rgba(76, 175, 80, 0.6))",
                  }}
                />
                <foreignObject x={dimensions.width - 105} y="55" width="32" height="32">
                  <Rocket size={26} className="text-white" />
                </foreignObject>
              </g>
            )}
            
            {/* Progress indicators */}
            <g fontSize="12" fontWeight="600" fill="#666">
              {/* Traditional system label */}
              <text x="80" y={dimensions.height - 15} textAnchor="middle" className="text-app-orange font-bold">
                6+ mesecev čakanja
              </text>
              
              {/* Tomi Talk label - appears with end point */}
              {curveProgress > 0.90 && (
                <text x={dimensions.width - 80} y="35" textAnchor="middle" className="text-dragon-green font-bold">
                  Takoj!
                </text>
              )}
            </g>
          </svg>
        </div>

        {/* Redesigned labels and descriptions below graph */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 md:gap-y-0 md:gap-x-8 w-full max-w-3xl mx-auto pt-2 pb-0 md:pb-2">
          {/* Left Side: JAVNI SISTEM and its description */}
          <div className="flex flex-col items-start text-left">
            <span className="font-extrabold text-xl md:text-2xl uppercase text-zinc-800 tracking-wide mb-1">
              JAVNI SISTEM
            </span>
            <span className="text-base md:text-lg font-medium text-gray-700 max-w-[320px]">
              Povprečno čakanje na logopeda v javnem zdravstvu
            </span>
          </div>
          {/* Right Side: Tomi Talk and its description */}
          <div className="flex flex-col items-end text-right">
            <span
              className="font-extrabold text-xl md:text-2xl"
              style={{
                background: "linear-gradient(90deg, #4CAF50 10%, #FF9800 95%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontFamily: "Nunito, sans-serif"
              }}
            >
              Tomi Talk
            </span>
            <span className="text-base md:text-lg font-medium text-gray-700 max-w-[340px]">
              Govorne vaje brez čakalnih vrst – dostopne takoj z aplikacijo Tomi Talk
            </span>
          </div>
        </div>

        {/* Bottom section with comparison */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mt-8">
          {/* Left - Traditional System */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-orange-100 rounded-full p-2.5">
                <Clock size={28} className="text-app-orange" />
              </span>
              <span className="text-lg font-bold text-gray-700">Javni sistem</span>
            </div>
            <div className="text-3xl md:text-4xl font-extrabold text-app-orange mb-1">+6 mesecev</div>
            <div className="text-sm text-gray-500 font-medium text-center md:text-left max-w-[200px]">
              Povprečen čas do prve obravnave v javnem zdravstvu
            </div>
          </div>

          {/* Right - Tomi Talk */}
          <div className="flex flex-col items-center md:items-end">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-green-100 rounded-full p-2.5">
                <Rocket size={28} className="text-dragon-green" />
              </span>
              <span className="text-lg font-bold text-gray-700">Tomi Talk</span>
            </div>
            <div className="text-3xl md:text-4xl font-extrabold text-dragon-green mb-1">Takoj</div>
            <div className="text-sm text-gray-500 font-medium text-center md:text-right max-w-[200px]">
              Govorne vaje na voljo takoj – brez čakanja
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProgressComparisonSection;
