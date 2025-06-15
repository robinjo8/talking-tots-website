import React, { useEffect, useRef, useState } from "react";
import "lucide-react"; /* Clock, Rocket */
const CURVE_DURATION = 3000;
function getAnimatedPath(progress: number, width: number, height: number) {
  const startX = 80;
  const endX = width - 80;
  const startY = height - 60;
  const endY = 80;
  const steps = Math.floor(100 + progress * 100);
  let d = `M${startX} ${startY}`;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps * progress;
    const eased = 1 - Math.exp(-3.5 * t);
    const x = startX + (endX - startX) * t;
    const y = startY - (startY - endY) * eased;
    d += ` L${x} ${y}`;
  }
  return d;
}
export function ProgressComparisonSection() {
  const [curveProgress, setCurveProgress] = useState(0);
  const [dimensions, setDimensions] = useState({
    width: 800,
    height: 400
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const reqRef = useRef<number>();
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: Math.max(800, rect.width - 32),
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
      const eased = 1 - Math.pow(1 - progress, 2.5);
      setCurveProgress(eased);
      if (progress < 1) {
        reqRef.current = requestAnimationFrame(animateCurve);
      }
    }
    const timeout = setTimeout(() => {
      reqRef.current = requestAnimationFrame(animateCurve);
    }, 500);
    return () => {
      clearTimeout(timeout);
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, []);
  // Helper vars for responsive adjustments
  const circleStartR = dimensions.width < 600 ? 7 : 8;
  const circleEndR = dimensions.width < 600 ? 16 : 20; // larger, more visible
  const labelFont = dimensions.width < 600 ? "text-base" : "text-lg";
  const xAxisFont = dimensions.width < 450 ? 20 : 28;
  const yAxisFont = dimensions.width < 450 ? 20 : 28;
  // End point positioning
  const endX = dimensions.width - 80;
  const endY = 80;
  return <section className="w-full min-h-screen flex items-center justify-center py-8 md:py-16 px-2 bg-light-cloud transition-colors duration-500" style={{
    fontFamily: "Nunito, sans-serif"
  }}>
      <div className="w-full max-w-7xl flex flex-col items-center justify-center">
        <div className="w-full md:rounded-3xl bg-white shadow-md px-4 md:px-8 py-8 md:py-14 relative overflow-hidden border border-green-200 flex flex-col items-center">
          {/* Headline: new formatting */}
          <div className="mb-10 w-full flex flex-col items-center justify-center">
            <h2 className="flex flex-col items-center w-full text-center">
              {/* Main line: very large, green */}
              <span style={{
              letterSpacing: ".01em",
              textTransform: "none"
            }} className="block font-black text-[2.6rem] sm:text-5xl md:text-6xl text-dragon-green mb-1 leading-snug lg:text-5xl">
                3× hitrejši napredek
              </span>
              {/* Subline: regular style, muted color */}
              <span className="text-[1.7rem] font-extrabold text-app-orange leading-tight -mt-1 mb-1 md:text-4xl">z aplikacijo TomiTalk</span>
            </h2>
          </div>

          {/* Full-width graph container */}
          <div ref={containerRef} className="w-full flex justify-center mb-2 md:mb-4">
            <svg className="w-full max-w-3xl" width={dimensions.width} height={dimensions.height} viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} preserveAspectRatio="xMidYMid meet" style={{
            maxWidth: "100%",
            height: "auto"
          }}>
              <defs>
                {/* Gradient definitions */}
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
                {Array.from({
                length: 6
              }).map((_, i) => {
                const x = 80 + i * (dimensions.width - 160) / 5;
                return <line key={`v-${i}`} x1={x} y1="60" x2={x} y2={dimensions.height - 60} stroke="#4CAF50" strokeWidth="1" strokeDasharray="2,4" />;
              })}
                {/* Horizontal grid lines */}
                {Array.from({
                length: 5
              }).map((_, i) => {
                const y = 80 + i * (dimensions.height - 140) / 4;
                return <line key={`h-${i}`} x1="80" y1={y} x2={dimensions.width - 80} y2={y} stroke="#4CAF50" strokeWidth="1" strokeDasharray="2,4" />;
              })}
              </g>

              {/* Axes */}
              <g stroke="#E0E0E0" strokeWidth="2">
                {/* Y-axis */}
                <line x1="80" y1="60" x2="80" y2={dimensions.height - 60} />
                {/* X-axis */}
                <line x1="80" y1={dimensions.height - 60} x2={dimensions.width - 80} y2={dimensions.height - 60} />
              </g>

              {/* Y-axis label (vertical, left, black, large font) */}
              <g>
                <text x="35" y={dimensions.height / 2} textAnchor="middle" fontWeight={900} fontSize={yAxisFont} fill="#111" transform={`rotate(-90, 35, ${dimensions.height / 2})`} style={{
                letterSpacing: "0.04em"
              }}>
                  Napredek
                </text>
              </g>

              {/* X-axis label (centered, black, large font) */}
              <g>
                <text x={dimensions.width / 2} y={dimensions.height - 18} textAnchor="middle" fontWeight={900} fontSize={xAxisFont} fill="#111">
                  Čas
                </text>
              </g>

              {/* Area under curve (subtle fill) */}
              {curveProgress > 0.1 && <path d={`${getAnimatedPath(curveProgress, dimensions.width, dimensions.height)} L${80 + (dimensions.width - 160) * curveProgress} ${dimensions.height - 60} L80 ${dimensions.height - 60} Z`} fill="url(#area-gradient)" opacity="0.3" />}

              {/* Main animated curve */}
              <path d={getAnimatedPath(curveProgress, dimensions.width, dimensions.height)} fill="none" stroke="url(#curve-gradient)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)" style={{
              filter: "drop-shadow(0px 4px 12px rgba(76, 175, 80, 0.4))",
              transition: "stroke-width 0.3s"
            }} />

              {/* Start point (traditional system) */}
              <g>
                <circle cx="80" cy={dimensions.height - 60} r={circleStartR} fill="#FF9800" stroke="#fff" strokeWidth="3" style={{
                filter: "drop-shadow(0px 2px 8px rgba(255, 152, 0, 0.4))"
              }} />
                {/* (Removed icon) */}
              </g>

              {/* End point (Tomi Talk) - appears when curve is nearly complete */}
              {curveProgress > 0.9 && <g>
                  <circle cx={endX} cy={endY} r={circleEndR} fill="#4CAF50" stroke="#fff" strokeWidth="3" className="animate-pulse" style={{
                filter: "drop-shadow(0px 3px 12px rgba(76, 175, 80, 0.6))"
              }} />
                  {/* (Removed icon) */}
                </g>}
            </svg>
          </div>

          {/* Bottom section with comparison */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mt-2 md:mt-5 w-full max-w-3xl mx-auto">
            {/* Left - Traditional System */}
            <div className="flex flex-col items-center md:items-center min-w-[160px] max-w-[300px]">
              {/* Label */}
              <span style={{
              letterSpacing: "0.02em",
              fontFamily: "Nunito, sans-serif"
            }} className="text-[#263146] font-extrabold text-lg uppercase tracking-tight mt-4 mb-1 md:text-3xl">
                JAVNI SISTEM
              </span>
              {/* Value */}
              <div className="text-[1.7rem] font-extrabold text-app-orange leading-tight -mt-1 mb-1 md:text-2xl ">
                +6 mesecev
              </div>
              {/* Description */}
              <div className="text-[.97rem] text-black-500 font-normal text-center md:text-center leading-snug font-['Nunito']">
                Povprečen čas do prve<br />obravnave v javnem zdravstvu
              </div>
            </div>
            {/* Right - Tomi Talk */}
            <div className="flex flex-col items-center md:items-center min-w-[160px] max-w-[300px]">
              {/* Label */}
              <span style={{
              letterSpacing: "0.02em",
              fontFamily: "Nunito, sans-serif"
            }} className="text-[#263146] font-extrabold text-lg uppercase tracking-tight mt-4 mb-1 md:text-3xl">Tadsa</span>
              <div className="text-[1.7rem] font-extrabold text-dragon-green leading-tight -mt-1 mb-1 md:text-3xl ">
                Takoj
              </div>
              <div className="text-[.97rem] text-gray-500 font-normal text-center md:text-center leading-snug font-['Nunito']">
                Govorne vaje na voljo<br />takoj &ndash; brez čakanja
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
}
export default ProgressComparisonSection;