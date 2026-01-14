import { motion } from "framer-motion";

interface ProgressChartProps {
  currentDragons: number; // 0-9 dragons towards next trophy
  totalTrophies: number;
}

const BAR_COLORS = [
  "#A7F3D0", // Light green (was gray)
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

// Increased height differences for more visual impact
const BAR_HEIGHTS = [20, 35, 50, 65, 80, 100, 120, 145, 170, 200];

export function ProgressChart({ currentDragons, totalTrophies }: ProgressChartProps) {
  // Determine which dragon image to show on the 10th column
  const dragonOnTenthColumn = currentDragons >= 10 
    ? "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/Zmajcek_pokal.png"
    : "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_6.png";

  return (
    <div className="w-full">
      {/* Chart container - increased height */}
      <div className="relative flex items-end justify-center gap-1 sm:gap-2 h-56 sm:h-72 px-2">
        
        {/* Dragon waiting on the left when no dragons earned */}
        {currentDragons === 0 && (
          <div className="flex flex-col items-center justify-end mr-1 sm:mr-2">
            <motion.img
              src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_6.png"
              alt="Zmajček čaka"
              className="w-8 h-8 sm:w-12 sm:h-12 object-contain mb-2"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
            />
          </div>
        )}
        
        {BAR_COLORS.map((color, index) => {
          const isActive = index < currentDragons;
          // Dragon shows ON the column when that column is earned (index < currentDragons)
          // But for the 10th column (index 9), we show special handling
          const showDragonOnThisColumn = index < currentDragons && index < 9;
          const isCurrentDragonPosition = index === currentDragons - 1 && currentDragons > 0 && currentDragons < 10;
          const isTenthColumnWithDragon = index === 9 && currentDragons >= 10;
          
          return (
          <div key={index} className="flex flex-col items-center flex-1 max-w-12 relative">
              {/* Dragon/creature on top of bars - special handling for 10th column */}
              <div className="h-10 sm:h-12 flex items-end justify-center mb-0">
                {/* For columns 1-9: show dragon on current position */}
                {index < 9 && isCurrentDragonPosition && (
                  <motion.img
                    src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_6.png"
                    alt="Zmajček"
                    className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
                  />
                )}
                
                {/* 10th column: show trophy OR Zmajcek_pokal */}
                {index === 9 && (
                  currentDragons >= 10 ? (
                    <motion.img
                      src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/Zmajcek_pokal.png"
                      alt="Zmajček s pokalom"
                      className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
                    />
                  ) : (
                    <motion.img
                      src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/pokal.png"
                      alt="Cilj - Pokal"
                      className="w-8 h-8 sm:w-10 sm:h-10 object-contain opacity-30 grayscale"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                    />
                  )
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
