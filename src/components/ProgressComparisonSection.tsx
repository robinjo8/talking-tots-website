
import React from "react";
import { Clock, Rocket } from "lucide-react";

export function ProgressComparisonSection() {
  return (
    <section
      className="w-full bg-[#181818] py-12 md:py-20 px-4"
      style={{
        fontFamily: "Nunito, sans-serif",
      }}
    >
      <div className="max-w-5xl mx-auto md:rounded-3xl bg-[#181818] shadow-xl px-4 md:px-12 py-8 md:py-14 relative overflow-hidden">
        {/* Top headline */}
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-8 text-center md:text-left">
          <span className="font-bold" style={{ color: "#FFB300" }}>
            3× hitrejši
          </span>{" "}
          <span className="text-white">napredek z aplikacijo Tomi Talk</span>
        </h2>

        <div className="flex flex-col md:flex-row md:items-center w-full z-10 relative">
          {/* Left column (Public System) */}
          <div className="flex flex-col items-center md:items-start w-full md:w-1/3 mb-8 md:mb-0 md:mr-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-zinc-900 rounded-full p-2.5">
                <Clock size={32} className="text-app-yellow" />
              </div>
              <div>
                <span className="text-lg font-extrabold text-white">Čakalna doba na logopeda</span>
              </div>
            </div>
            <div className="text-4xl md:text-5xl font-extrabold text-app-yellow mb-1 tracking-tight">+6 mesecev</div>
            <div className="text-sm text-gray-400 font-medium max-w-[180px] text-center md:text-left">
              Povprečen čas do prve obravnave v javnem zdravstvu
            </div>
          </div>

          {/* Graph and Curve (center) */}
          <div className="relative flex-1 flex justify-center md:mx-2 w-full h-36 md:h-44">
            <svg
              className="absolute left-0 right-0 top-1/2 -translate-y-1/2"
              width="100%"
              height="100%"
              viewBox="0 0 420 120"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {/* Soft grid lines for readability */}
              <g>
                <line x1="0" y1="110" x2="420" y2="110" stroke="#323232" strokeWidth="1" />
                <line x1="0" y1="60" x2="420" y2="60" stroke="#242424" strokeWidth="1" />
                <line x1="0" y1="10" x2="420" y2="10" stroke="#242424" strokeWidth="1" />
              </g>
              {/* Smooth rising golden curve */}
              <path
                d="M10 110 Q 120 40, 210 90 T 410 30"
                fill="none"
                stroke="url(#gold-gradient)"
                strokeWidth="6"
                strokeLinecap="round"
                filter="url(#glow)"
              />
              {/* Golden gradient for the curve */}
              <defs>
                <linearGradient id="gold-gradient" x1="10" y1="110" x2="410" y2="30" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FFEA70" />
                  <stop offset="0.35" stopColor="#FFD166" />
                  <stop offset="0.7" stopColor="#FFB300" />
                  <stop offset="1" stopColor="#FF8C00" />
                </linearGradient>
                {/* Subtle glow effect */}
                <filter id="glow" x="-8" y="-8" width="440" height="136">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              {/* Left circle (start) */}
              <circle cx="10" cy="110" r="10" fill="#FFEA70" stroke="#FFB300" strokeWidth="3" />
              {/* Right circle (end) */}
              <circle cx="410" cy="30" r="14" fill="#FFB300" stroke="#FF8C00" strokeWidth="3" />
            </svg>
          </div>

          {/* Right column (Tomi Talk) */}
          <div className="flex flex-col items-center md:items-end w-full md:w-1/3 mt-8 md:mt-0 md:ml-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-zinc-900 rounded-full p-2.5">
                <Rocket size={32} className="text-app-orange" />
              </div>
              <div>
                <span className="text-lg font-extrabold text-white">Tomi Talk</span>
              </div>
            </div>
            <div className="text-4xl md:text-5xl font-extrabold text-app-orange mb-1 tracking-tight">Takoj</div>
            <div className="text-sm text-gray-400 font-medium max-w-[220px] text-center md:text-right">
              Govorne vaje na voljo takoj – brez čakanja
            </div>
          </div>
        </div>

        {/* For mobile: icons near the curve */}
        <div className="flex md:hidden justify-between items-center mt-5 px-2">
          <div className="flex flex-col items-center">
            <Clock size={20} className="text-app-yellow" />
            <span className="text-xs text-gray-400 mt-1">Javni sistem</span>
          </div>
          <div className="flex flex-col items-center">
            <Rocket size={20} className="text-app-orange" />
            <span className="text-xs text-gray-400 mt-1">Tomi Talk</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProgressComparisonSection;
