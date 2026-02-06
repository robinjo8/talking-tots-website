import { motion } from "framer-motion";

interface DayStarDisplayProps {
  currentStars: number;
  maxStars?: number;
}

export function DayStarDisplay({ currentStars, maxStars = 10 }: DayStarDisplayProps) {
  const clampedStars = Math.min(currentStars, maxStars);

  return (
    <div className="flex items-center gap-0.5 flex-wrap">
      {Array.from({ length: maxStars }, (_, index) => {
        const isFilled = index < clampedStars;
        return (
          <motion.span
            key={index}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.03, duration: 0.2 }}
            className={`text-lg ${isFilled ? "drop-shadow-sm" : "opacity-30"} transition-all duration-300`}
          >
            {isFilled ? "⭐" : "☆"}
          </motion.span>
        );
      })}
    </div>
  );
}
