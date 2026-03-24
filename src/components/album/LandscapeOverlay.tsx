import { useState, useEffect } from "react";
import { RotateCcw } from "lucide-react";

export function LandscapeOverlay() {
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const check = () => {
      const isTouchDevice = 'ontouchstart' in window && Math.min(window.innerWidth, window.innerHeight) < 768;
      setIsLandscape(isTouchDevice && window.innerWidth > window.innerHeight);
    };
    check();
    window.addEventListener('resize', check);
    window.addEventListener('orientationchange', check);
    return () => {
      window.removeEventListener('resize', check);
      window.removeEventListener('orientationchange', check);
    };
  }, []);

  if (!isLandscape) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-[hsl(30,20%,88%)] flex flex-col items-center justify-center gap-4">
      <RotateCcw className="w-16 h-16 text-amber-500 animate-spin" style={{ animationDuration: '3s' }} />
      <p className="text-lg font-bold text-[hsl(30,40%,25%)]">OBRNI TELEFON POKONČNO</p>
    </div>
  );
}
