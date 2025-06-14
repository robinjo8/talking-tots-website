
import React, { useEffect, useRef, useState } from "react";
import { Clock, Rocket } from "lucide-react";

const CURVE_DURATION = 1600; // ms

function getAnimatedPath(progress: number) {
  // progress: 0-1
  // Use a quadratic Bézier from (10,110) to (410,30)
  // Control point gives a clean, non-jagged bend toward Tomi Talk.
  const start = { x: 10, y: 110 };
  const end = { x: 410, y: 30 };
  const ctrl = { x: 180, y: 20 };

  // Morph the path based on animation progress
  // We animate the point on the curve according to progress
  const currentX = start.x + (end.x - start.x) * progress;
  // Quadratic Bezier formula for Y given t = progress
  const t = progress;
  const y =
    Math.pow(1 - t, 2) * start.y +
    2 * (1 - t) * t * ctrl.y +
    Math.pow(t, 2) * end.y;

  // Only draw up to (currentX, y)
  // We'll break curve into small line segments for simplicity
  const steps = Math.floor(80 + progress * 120); // More points as we animate further
  let d = `M${start.x} ${start.y}`;
  for (let i = 1; i <= steps; i++) {
    const tt = (i / steps) * progress;
    const xx =
      Math.pow(1 - tt, 2) * start.x +
      2 * (1 - tt) * tt * ctrl.x +
      Math.pow(tt, 2) * end.x;
    const yy =
      Math.pow(1 - tt, 2) * start.y +
      2 * (1 - tt) * tt * ctrl.y +
      Math.pow(tt, 2) * end.y;
    d += ` L${xx} ${yy}`;
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
      // Ease-out: cubic
      const eased = 1 - Math.pow(1 - progress, 3);
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
      <div className="max-w-5xl mx-auto md:rounded-3xl bg-white shadow-md px-2 md:px-8 py-8 md:py-14 relative overflow-hidden border border-app-yellow/10">
        {/* Top headline */}
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#212121] mb-8 text-center md:text-left">
          <span className="font-bold text-app-yellow">3× hitrejši</span>{" "}
          <span className="text-app-orange">napredek z aplikacijo Tomi Talk</span>
        </h2>

        <div className="flex flex-col md:flex-row md:items-center w-full z-10 relative">
          {/* Left column (Public System) */}
          <div className="flex flex-col items-center md:items-start w-full md:w-1/3 mb-8 md:mb-0 md:mr-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-zinc-100 rounded-full p-2.5">
                <Clock size={32} className="text-app-yellow" />
              </span>
              <span className="text-lg font-extrabold text-gray-700">Čakalna doba na logopeda</span>
            </div>
            <div className="text-4xl md:text-5xl font-extrabold text-app-yellow mb-1 tracking-tight">+6 mesecev</div>
            <div className="text-sm text-gray-500 font-medium max-w-[180px] text-center md:text-left">
              Povprečen čas do prve obravnave v javnem zdravstvu
            </div>
          </div>

          {/* Graph and Curve (center) */}
          <div className="relative flex-1 flex justify-center md:mx-2 w-full h-40 md:h-48">
            <svg
              className="absolute left-0 right-0 top-1/2 -translate-y-1/2"
              width="100%"
              height="100%"
              viewBox="0 0 420 130"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {/* Soft grid lines & axes */}
              <g>
                {/* Y-axis */}
                <line x1="35" y1="15" x2="35" y2="115" stroke="#e3e3d7" strokeWidth="2" />
                {/* X-axis */}
                <line x1="30" y1="112" x2="410" y2="112" stroke="#e3e3d7" strokeWidth="2" />
                {/* Guide ticks (Y) */}
                <line x1="35" y1="30" x2="45" y2="30" stroke="#FFE066" strokeWidth="1" />
                <line x1="35" y1="90" x2="45" y2="90" stroke="#FFD166" strokeWidth="1" />
              </g>
              {/* Axis labels for clarity */}
              <text x="11" y="30" fill="#888870" fontSize="13" fontWeight="bold">
                ↑
              </text>
              <text x="2" y="61" fill="#969669" fontSize="13">Napredek</text>
              <text x="385" y="126" fill="#969669" fontSize="14">Čas</text>
              {/* Animated golden curve */}
              <path
                d={getAnimatedPath(curveProgress)}
                fill="none"
                stroke="url(#gold-gradient)"
                strokeWidth="6"
                strokeLinecap="round"
                style={{
                  filter: "drop-shadow(0px 2px 8px #FFEAA070)",
                  transition: "stroke 0.2s",
                }}
              />
              {/* Golden gradient for the curve */}
              <defs>
                <linearGradient id="gold-gradient" x1="10" y1="110" x2="410" y2="30" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FFEA70" />
                  <stop offset="0.35" stopColor="#FFD166" />
                  <stop offset="0.7" stopColor="#FFB300" />
                  <stop offset="1" stopColor="#FF9800" />
                </linearGradient>
              </defs>
              {/* Left circle (start) */}
              <circle cx="10" cy="110" r="10" fill="#FFEA70" stroke="#FFB300" strokeWidth="3" />
              {/* Right circle (end, only if curve fully drawn) */}
              {curveProgress > 0.95 && (
                <circle cx="410" cy="30" r="14" fill="#FFB300" stroke="#FF9800" strokeWidth="3" />
              )}
              {/* Public system icon at start */}
              <g>
                <foreignObject x="5" y="78" width="24" height="24">
                  <Clock size={18} className="text-app-yellow" />
                </foreignObject>
              </g>
              {/* Tomi Talk icon at end */}
              {curveProgress > 0.98 && (
                <g>
                  <foreignObject x="402" y="8" width="32" height="32">
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
            <Clock size={20} className="text-app-yellow" />
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
