
import React, { useEffect, useRef, useState } from "react";
import { Clock, Rocket } from "lucide-react";

const CURVE_DURATION = 2000;

function getAnimatedPath(progress: number) {
  // Create an exponential growth curve that matches the reference
  const start = { x: 50, y: 250 };
  const end = { x: 350, y: 50 };
  
  // Calculate points along an exponential curve
  const steps = Math.floor(60 + progress * 80);
  let d = `M${start.x} ${start.y}`;
  
  for (let i = 1; i <= steps; i++) {
    const t = (i / steps) * progress;
    
    // Exponential easing function for steep initial growth then leveling off
    const eased = 1 - Math.exp(-4 * t);
    
    const x = start.x + (end.x - start.x) * t;
    const y = start.y - (start.y - end.y) * eased;
    
    d += ` L${x} ${y}`;
  }
  
  return d;
}

export function ProgressComparisonSection() {
  const [curveProgress, setCurveProgress] = useState(0);
  const reqRef = useRef<number>();

  useEffect(() => {
    let start: number;
    function animateCurve(ts: number) {
      if (!start) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / CURVE_DURATION, 1);
      // Smooth easing
      const eased = 1 - Math.pow(1 - progress, 2);
      setCurveProgress(eased);
      if (progress < 1) {
        reqRef.current = requestAnimationFrame(animateCurve);
      }
    }
    reqRef.current = requestAnimationFrame(animateCurve);
    return () => {
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
      <div className="max-w-5xl mx-auto md:rounded-3xl bg-white shadow-md px-2 md:px-8 py-8 md:py-14 relative overflow-hidden border border-green-200">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#212121] mb-8 text-center md:text-left">
          <span className="font-bold text-dragon-green">3× hitrejši</span>{" "}
          <span className="text-app-orange">napredek z aplikacijo Tomi Talk</span>
        </h2>

        <div className="flex flex-col md:flex-row md:items-center w-full z-10 relative">
          {/* Left column (Public System) */}
          <div className="flex flex-col items-center md:items-start w-full md:w-1/3 mb-8 md:mb-0 md:mr-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-zinc-100 rounded-full p-2.5">
                <Clock size={32} className="text-dragon-green" />
              </span>
              <span className="text-lg font-extrabold text-gray-700">Čakalna doba na logopeda</span>
            </div>
            <div className="text-4xl md:text-5xl font-extrabold text-dragon-green mb-1 tracking-tight">+6 mesecev</div>
            <div className="text-sm text-gray-500 font-medium max-w-[180px] text-center md:text-left">
              Povprečen čas do prve obravnave v javnem zdravstvu
            </div>
          </div>

          {/* Graph and Curve (center) */}
          <div className="relative flex-1 flex justify-center md:mx-2 w-full h-48 md:h-56">
            <svg
              className="absolute left-0 right-0 top-1/2 -translate-y-1/2"
              width="100%"
              height="100%"
              viewBox="0 0 400 300"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              {/* Clean axes */}
              <defs>
                <linearGradient id="progress-gradient" x1="50" y1="250" x2="350" y2="50" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#4CAF50" />
                  <stop offset="0.5" stopColor="#66BB6A" />
                  <stop offset="1" stopColor="#81C784" />
                </linearGradient>
              </defs>
              
              {/* Y-axis (vertical) */}
              <line x1="50" y1="50" x2="50" y2="250" stroke="#E0E0E0" strokeWidth="2" />
              
              {/* X-axis (horizontal) */}
              <line x1="50" y1="250" x2="350" y2="250" stroke="#E0E0E0" strokeWidth="2" />
              
              {/* Y-axis label */}
              <text x="25" y="45" fill="#666" fontSize="14" fontWeight="600" textAnchor="middle">
                Napredek
              </text>
              <text x="25" y="58" fill="#666" fontSize="12" textAnchor="middle">
                ↑
              </text>
              
              {/* X-axis label */}
              <text x="350" y="270" fill="#666" fontSize="14" fontWeight="600" textAnchor="end">
                Čas →
              </text>
              
              {/* Grid lines for reference */}
              <line x1="50" y1="200" x2="55" y2="200" stroke="#E8E8E8" strokeWidth="1" />
              <line x1="50" y1="150" x2="55" y2="150" stroke="#E8E8E8" strokeWidth="1" />
              <line x1="50" y1="100" x2="55" y2="100" stroke="#E8E8E8" strokeWidth="1" />
              
              <line x1="100" y1="250" x2="100" y2="245" stroke="#E8E8E8" strokeWidth="1" />
              <line x1="200" y1="250" x2="200" y2="245" stroke="#E8E8E8" strokeWidth="1" />
              <line x1="300" y1="250" x2="300" y2="245" stroke="#E8E8E8" strokeWidth="1" />
              
              {/* Animated exponential curve */}
              <path
                d={getAnimatedPath(curveProgress)}
                fill="none"
                stroke="url(#progress-gradient)"
                strokeWidth="4"
                strokeLinecap="round"
                style={{
                  filter: "drop-shadow(0px 2px 8px rgba(76, 175, 80, 0.3))",
                }}
              />
              
              {/* Start point */}
              <circle cx="50" cy="250" r="6" fill="#4CAF50" stroke="#fff" strokeWidth="2" />
              
              {/* End point (only when curve is complete) */}
              {curveProgress > 0.95 && (
                <circle cx="350" cy="50" r="8" fill="#4CAF50" stroke="#fff" strokeWidth="3" />
              )}
              
              {/* Icons */}
              <g>
                <foreignObject x="20" y="260" width="24" height="24">
                  <Clock size={18} className="text-dragon-green" />
                </foreignObject>
              </g>
              
              {curveProgress > 0.98 && (
                <g>
                  <foreignObject x="330" y="25" width="32" height="32">
                    <Rocket size={22} className="text-app-orange" />
                  </foreignObject>
                </g>
              )}
            </svg>
          </div>

          {/* Right column (Tomi Talk) */}
          <div className="flex flex-col items-center md:items-end w-full md:w-1/3 mt-8 md:mt-0 md:ml-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-zinc-100 rounded-full p-2.5">
                <Rocket size={32} className="text-app-orange" />
              </span>
              <span className="text-lg font-extrabold text-gray-700">Tomi Talk</span>
            </div>
            <div className="text-4xl md:text-5xl font-extrabold text-app-orange mb-1 tracking-tight">Takoj</div>
            <div className="text-sm text-gray-500 font-medium max-w-[220px] text-center md:text-right">
              Govorne vaje na voljo takoj – brez čakanja
            </div>
          </div>
        </div>

        {/* For mobile: icons near the curve */}
        <div className="flex md:hidden justify-between items-center mt-5 px-3">
          <div className="flex flex-col items-center">
            <Clock size={20} className="text-dragon-green" />
            <span className="text-xs text-gray-500 mt-1">Javni sistem</span>
          </div>
          <div className="flex flex-col items-center">
            <Rocket size={20} className="text-app-orange" />
            <span className="text-xs text-gray-500 mt-1">Tomi Talk</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProgressComparisonSection;
