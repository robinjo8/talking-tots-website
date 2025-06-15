import React, { useEffect, useRef, useState } from "react";
import "lucide-react"; /* import only for future icon use, but not used now */

// --- Animation/curve timings ---
const CURVE_DURATION = 3000;

// --- Existing TomiTalk curve (steep, fast) ---
function getTomiTalkCurve(progress: number, width: number, height: number) {
  const startX = 80;
  const endX = width - 80;
  const startY = height - 60;
  const endY = 80;
  const steps = Math.floor(120 + progress * 100);
  let d = `M${startX} ${startY}`;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps * progress;
    const eased = 1 - Math.exp(-3.3 * t); // rapid rise
    const x = startX + (endX - startX) * t;
    const y = startY - (startY - endY) * eased;
    d += ` L${x} ${y}`;
  }
  return d;
}

// --- New: Public System curve (orange-to-red, concave up, smooth/continuous from start to end) ---
function getPublicCurve(progress: number, width: number, height: number) {
  const startX = 80;
  const endX = width - 80;
  const startY = height - 60;
  const endY = 100;
  const steps = Math.floor(120 + progress * 100);
  let d = `M${startX} ${startY}`;
  for (let i = 1; i <= steps; i++) {
    // Smooth concave-up progression, strictly increasing and continuously differentiable across [0,1]
    // Exponent between 2 and 3, visually matches "slow then faster" upward
    const t = i / steps * progress;
    // Remove curvatureKick for full smoothness
    const eased = 0.60 * Math.pow(t, 2.35);
    const yEased = Math.min(eased, 1);
    const x = startX + (endX - startX) * t;
    const y = startY - (startY - endY) * yEased;
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
      // Use slightly more aggressive ease for fast curve
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

  // Responsive circle sizes
  const circleStartR = dimensions.width < 600 ? 8 : 10;
  const circleEndR = dimensions.width < 600 ? 18 : 24;

  // End point location (same as TomiTalk curve)
  const endX = dimensions.width - 80;
  const endY = 80;
  return <section className="w-full flex items-center justify-center py-0 md:py-2 px-1 bg-light-cloud transition-colors duration-500" style={{
    fontFamily: "Nunito, sans-serif"
  }}>
      <div className="w-full max-w-7xl flex flex-col items-center justify-center">
        <div className="w-full md:rounded-3xl bg-white shadow-md px-4 md:px-8 py-6 md:py-10 relative overflow-hidden border border-green-200 flex flex-col items-center">

          {/* Headline */}
          <div className="mb-5 w-full flex flex-col items-center justify-center">
            <h2 className="flex flex-col items-center w-full text-center">
              {/* Main line */}
              <span style={{
              letterSpacing: ".01em",
              textTransform: "none"
            }} className="block font-black text-[2.6rem] sm:text-5xl md:text-6xl text-dragon-green mb-1 leading-snug lg:text-6xl">
                3× hitrejši napredek
              </span>
              {/* Subline */}
              <span className="text-[1.7rem] font-extrabold text-app-orange leading-tight -mt-1 mb-1 md:text-4xl">
                z aplikacijo Tomi Talk
              </span>
            </h2>
          </div>

          {/* Graph container */}
          <div ref={containerRef} className="w-full flex justify-center mb-1 md:mb-2">
            <svg className="w-full max-w-3xl" width={dimensions.width} height={dimensions.height} viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} preserveAspectRatio="xMidYMid meet" style={{
            maxWidth: "100%",
            height: "auto"
          }}>
              <defs>
                {/* Green (TomiTalk) line gradient */}
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
                {/* Public line gradient: orange left, red right */}
                <linearGradient id="public-curve-gradient" x1="0%" y1="100%" x2="100%" y2="10%" gradientUnits="objectBoundingBox">
                  <stop offset="0%" stopColor="#FF9800" />
                  <stop offset="60%" stopColor="#FF3C00" />
                  <stop offset="100%" stopColor="#D32F2F" />
                </linearGradient>
                {/* Pulsing effect for green end point */}
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Background grid */}
              <g opacity="0.11">
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
                <line x1="80" y1="60" x2="80" y2={dimensions.height - 60} />
                <line x1="80" y1={dimensions.height - 60} x2={dimensions.width - 80} y2={dimensions.height - 60} />
              </g>

              {/* Y and X axis labels */}
              <g>
                <text x="35" y={dimensions.height / 2} textAnchor="middle" fontWeight={900} fontSize={24} fill="#111" transform={`rotate(-90, 35, ${dimensions.height / 2})`} style={{
                letterSpacing: "0.04em"
              }}>
                  Napredek
                </text>
              </g>
              <g>
                <text x={dimensions.width / 2} y={dimensions.height - 18} textAnchor="middle" fontWeight={900} fontSize={28} fill="#111">
                  Čas
                </text>
              </g>

              {/* Area under Tomi Talk curve */}
              {curveProgress > 0.1 && <path d={`${getTomiTalkCurve(curveProgress, dimensions.width, dimensions.height)} L${80 + (dimensions.width - 160) * curveProgress} ${dimensions.height - 60} L80 ${dimensions.height - 60} Z`} fill="url(#area-gradient)" opacity="0.28" />}

              {/* --- Public System curve (matches user image reference, orange-red, gently curving upward) --- */}
              <path d={getPublicCurve(curveProgress, dimensions.width, dimensions.height)} fill="none" stroke="url(#public-curve-gradient)" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" opacity={curveProgress > 0.025 ? 1 : 0} style={{
              filter: "drop-shadow(0px 2px 12px rgba(243, 94, 35, 0.12))",
              transition: "stroke-width 0.3s"
            }} />

              {/* Main TomiTalk curve (green, fast rising) */}
              <path d={getTomiTalkCurve(curveProgress, dimensions.width, dimensions.height)} fill="none" stroke="url(#curve-gradient)" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)" style={{
              filter: "drop-shadow(0px 6px 18px rgba(76, 175, 80, 0.4))",
              transition: "stroke-width 0.3s"
            }} />

              {/* Start point (left bottom, both curves origin) */}
              <g>
                <circle cx="80" cy={dimensions.height - 60} r={circleStartR} fill="#FF9800" stroke="#fff" strokeWidth="3" style={{
                filter: "drop-shadow(0px 2px 8px rgba(255, 152, 0, 0.32))"
              }} />
              </g>

              {/* End point (Tomi Talk, green pulsing) */}
              {curveProgress > 0.9 && <g>
                  <circle cx={endX} cy={endY} r={circleEndR} fill="#4CAF50" stroke="#fff" strokeWidth="3" className="animate-pulse" style={{
                filter: "drop-shadow(0px 6px 18px rgba(76, 175, 80, 0.45))"
              }} />
                </g>}
            </svg>
          </div>

          {/* Comparison section below graph */}
          <div className="flex flex-row items-stretch justify-center gap-4 md:gap-8 mt-12 w-full max-w-3xl mx-auto px-4">
            {/* Left - Traditional System */}
            <div className="flex flex-col items-center flex-1 text-center p-4 pt-6 border-2 border-gray-800 rounded-2xl bg-white relative">
              {/* Label */}
              <div className="absolute -top-5 w-[calc(100%-2rem)]">
                <div className="border-2 border-gray-800 rounded-xl py-1 px-1 bg-white">
                  <h3 style={{
                  letterSpacing: "0.02em",
                  fontFamily: "Nunito, sans-serif"
                }} className="text-[#263146] font-extrabold text-lg md:text-2xl text-center uppercase tracking-tight">
                    JAVNI SISTEM
                  </h3>
                </div>
              </div>
              
              {/* Value */}
              <div className="font-extrabold text-app-orange leading-none mt-6 mb-2">
                <div className="text-4xl md:text-5xl">+6 mesecev</div>
                
              </div>
              {/* Description */}
              <div className="text-sm md:text-base text-gray-600 font-normal leading-snug font-['Nunito']">
                Povprečen čas do prve<br />obravnave v javnem zdravstvu
              </div>
            </div>

            {/* Right - Tomi Talk */}
            <div className="flex flex-col items-center flex-1 text-center p-4 pt-6 border-2 border-dragon-green rounded-2xl bg-white relative">
               {/* Label */}
               <div className="absolute -top-5 w-[calc(100%-2rem)]">
                <div className="border-2 border-dragon-green rounded-xl py-1 px-1 bg-white">
                  <h3 style={{
                  letterSpacing: "0.02em",
                  fontFamily: "Nunito, sans-serif"
                }} className="text-[#263146] font-extrabold text-lg md:text-2xl text-center uppercase tracking-tight">tomi talk</h3>
                </div>
              </div>

              {/* Value */}
              <div className="font-extrabold text-dragon-green leading-none mt-6 mb-2 my-[2px]">
                <div className="text-4xl md:text-5xl">Takoj</div>
                <div className="text-xl md:text-2xl invisible">.</div>
              </div>
              {/* Description */}
              <div className="text-sm md:text-base text-gray-600 font-normal leading-snug font-['Nunito']">
                Govorne vaje na voljo<br />takoj &ndash; brez čakanja
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
}
export default ProgressComparisonSection;