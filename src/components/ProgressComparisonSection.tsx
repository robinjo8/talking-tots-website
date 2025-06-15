
import React, { useEffect, useRef, useState } from "react";
import { SectionHeadline } from "./comparison-graph/SectionHeadline";
import { ComparisonGraph } from "./comparison-graph/ComparisonGraph";
import { ComparisonCards } from "./comparison-graph/ComparisonCards";

// --- Animation/curve timings ---
const CURVE_DURATION = 3000;

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

  return (
    <section 
      className="w-full flex items-center justify-center py-0 md:py-2 px-1 bg-light-cloud transition-colors duration-500"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      <div className="w-full max-w-7xl flex flex-col items-center justify-center">
        <div className="w-full md:rounded-3xl bg-white shadow-md px-4 md:px-8 py-6 md:py-10 relative overflow-hidden border border-green-200 flex flex-col items-center">
          
          <SectionHeadline />

          {/* Graph container */}
          <div ref={containerRef} className="w-full flex justify-center mb-1 md:mb-2">
            <ComparisonGraph curveProgress={curveProgress} dimensions={dimensions} />
          </div>

          <ComparisonCards />

        </div>
      </div>
    </section>
  );
}

export default ProgressComparisonSection;
