
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
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#212121] mb-8 text-center">
          <span className="font-bold text-dragon-green">3× hitrejši</span>{" "}
          <span className="text-app-orange">napredek z aplikacijo Tomi Talk</span>
        </h2>

        {/* Full-width graph container */}
        <div ref={containerRef} className="w-full relative mb-6">
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
              <linearGradient id="progress-gradient" x1="0%" y1="100%" x2="100%" y2="0%" gradientUnits="objectBoundingBox">
                <stop offset="0%" stopColor="#4CAF50" stopOpacity="0.9" />
                <stop offset="40%" stopColor="#66BB6A" stopOpacity="0.95" />
                <stop offset="80%" stopColor="#81C784" stopOpacity="1" />
                <stop offset="100%" stopColor="#A5D6A7" stopOpacity="1" />
              </linearGradient>
              
              <linearGradient id="area-gradient" x1="0%" y1="100%" x2="100%" y2="0%" gradientUnits="objectBoundingBox">
                <stop offset="0%" stopColor="#4CAF50" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#81C784" stopOpacity="0.05" />
              </linearGradient>
              
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
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
                Čas →
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
            
            {/* Main animated curve */}
            <path
              d={getAnimatedPath(curveProgress, dimensions.width, dimensions.height)}
              fill="none"
              stroke="url(#progress-gradient)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow)"
              style={{
                filter: "drop-shadow(0px 4px 12px rgba(76, 175, 80, 0.4))",
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
            
            {/* TomiTalk Dragon Mascot - appears in the middle */}
            {curveProgress > 0.6 && (
              <g>
                <foreignObject 
                  x={dimensions.width / 2 - 30} 
                  y={dimensions.height / 2 - 40} 
                  width="60" 
                  height="60"
                  className="animate-bounce"
                >
                  <img
                    src="/lovable-uploads/afbdd309-0550-437a-9afc-966c9a811062.png"
                    alt="TomiTalk Dragon"
                    className="w-full h-full object-contain"
                  />
                </foreignObject>
                {/* Speech bubble */}
                <g>
                  <ellipse
                    cx={dimensions.width / 2 + 40}
                    cy={dimensions.height / 2 - 50}
                    rx="25"
                    ry="15"
                    fill="white"
                    stroke="#4CAF50"
                    strokeWidth="2"
                    className="animate-pulse"
                  />
                  <text
                    x={dimensions.width / 2 + 40}
                    y={dimensions.height / 2 - 45}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="bold"
                    fill="#4CAF50"
                  >
                    Bravo!
                  </text>
                </g>
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

        {/* Bottom section with system comparison and mascot */}
        <div className="flex flex-col items-center gap-6 mt-6">
          {/* System Headers */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-center">
            <div className="text-2xl md:text-3xl font-bold text-app-orange tracking-wide">
              JAVNI SISTEM
            </div>
            <div className="text-2xl md:text-3xl font-extrabold">
              <span className="text-dragon-green">Tomi</span>
              <span className="text-app-orange">Talk</span>
            </div>
          </div>

          {/* Dragon Mascot - centered */}
          <div className="relative w-20 h-20 md:w-24 md:h-24">
            <div className="animate-float">
              <img
                alt="TomiTalk Dragon Mascot"
                className="w-full h-full object-contain"
                src="/lovable-uploads/afbdd309-0550-437a-9afc-966c9a811062.png"
              />
            </div>
          </div>

          {/* Comparison descriptions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-12 w-full max-w-5xl">
            {/* Left - Traditional System */}
            <div className="flex flex-col items-center md:items-start flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-orange-100 rounded-full p-2.5">
                  <Clock size={28} className="text-app-orange" />
                </span>
                <span className="text-lg font-bold text-gray-700">Javni sistem</span>
              </div>
              <div className="text-3xl md:text-4xl font-extrabold text-app-orange mb-2">+6 mesecev</div>
              <div className="text-sm md:text-base text-gray-600 font-medium text-center md:text-left">
                Povprečno čakanje na logopeda v javnem zdravstvu
              </div>
            </div>

            {/* Right - Tomi Talk */}
            <div className="flex flex-col items-center md:items-end flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-green-100 rounded-full p-2.5">
                  <Rocket size={28} className="text-dragon-green" />
                </span>
                <span className="text-lg font-bold text-gray-700">Tomi Talk</span>
              </div>
              <div className="text-3xl md:text-4xl font-extrabold text-dragon-green mb-2">Takoj</div>
              <div className="text-sm md:text-base text-gray-600 font-medium text-center md:text-right">
                Govorne vaje brez čakalnih vrst – dostopne takoj z aplikacijo Tomi Talk
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProgressComparisonSection;
