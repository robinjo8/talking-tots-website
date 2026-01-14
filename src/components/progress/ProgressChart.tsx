import { motion } from "framer-motion";

interface ProgressChartProps {
  currentDragons: number; // 0-9 dragons towards next trophy
  totalTrophies: number;
}

const BAR_COLORS = [
  "#9CA3AF", // Gray
  "#22C55E", // Green
  "#3B82F6", // Blue
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#EAB308", // Yellow
  "#F97316", // Orange
  "#EF4444", // Red
  "#FFD700", // Gold
];

const BAR_HEIGHTS = [30, 40, 50, 60, 70, 80, 90, 100, 110, 120];

export function ProgressChart({ currentDragons, totalTrophies }: ProgressChartProps) {
  return (
    <div className="w-full">
      {/* Chart container */}
      <div className="relative flex items-end justify-center gap-1 sm:gap-2 h-40 sm:h-48 px-2">
        {BAR_COLORS.map((color, index) => {
          const isActive = index < currentDragons;
          const isDragonPosition = index === currentDragons && currentDragons < 10;
          const isTrophyPosition = index === 9 && currentDragons === 10;
          
          return (
            <div key={index} className="flex flex-col items-center flex-1 max-w-12">
              {/* Dragon or Trophy on top of active bar */}
              <div className="h-12 sm:h-16 flex items-end justify-center mb-1">
                {isDragonPosition && (
                  <motion.img
                    src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_6.png"
                    alt="Zmajček"
                    className="w-8 h-8 sm:w-12 sm:h-12 object-contain"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
                  />
                )}
                {isTrophyPosition && (
                  <motion.img
                    src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/pokal.png"
                    alt="Pokal"
                    className="w-8 h-8 sm:w-12 sm:h-12 object-contain"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
                  />
                )}
              </div>
              
              {/* Bar */}
              <motion.div
                className="w-full rounded-t-md transition-all duration-300"
                style={{
                  height: `${BAR_HEIGHTS[index]}px`,
                  backgroundColor: isActive ? color : "#E5E7EB",
                  opacity: isActive ? 1 : 0.4,
                  boxShadow: isActive ? `0 4px 14px ${color}40` : 'none'
                }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              />
              
              {/* Number label */}
              <span className="text-[10px] sm:text-xs mt-1 font-medium text-muted-foreground">
                {(index + 1) * 10}
              </span>
            </div>
          );
        })}
        
        {/* Trophy at the end */}
        <div className="flex flex-col items-center ml-1 sm:ml-2">
          <motion.img
            src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/pokal.png"
            alt="Cilj - Pokal"
            className={`w-10 h-10 sm:w-14 sm:h-14 object-contain transition-all duration-300 ${
              currentDragons >= 10 ? "opacity-100 drop-shadow-lg" : "opacity-30 grayscale"
            }`}
            initial={{ scale: 0.8 }}
            animate={{ 
              scale: currentDragons >= 10 ? [1, 1.1, 1] : 1,
            }}
            transition={{ 
              duration: 0.5,
              repeat: currentDragons >= 10 ? Infinity : 0,
              repeatDelay: 2
            }}
          />
        </div>
      </div>
      
      {/* Progress text */}
      <div className="text-center mt-4 text-sm text-muted-foreground">
        <span className="font-semibold text-amber-600">{currentDragons}</span>
        <span> od </span>
        <span className="font-semibold">10</span>
        <span> zmajčkov do naslednjega pokala</span>
      </div>
    </div>
  );
}
