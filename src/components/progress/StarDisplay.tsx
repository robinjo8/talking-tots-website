import { motion } from "framer-motion";

interface StarDisplayProps {
  currentStars: number; // 0-9
  maxStars?: number;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

export function StarDisplay({ currentStars, maxStars = 10, size = "md", animated = true }: StarDisplayProps) {
  const sizeClasses = {
    sm: "text-2xl",
    md: "text-4xl", 
    lg: "text-6xl"
  };

  const stars = Array.from({ length: maxStars }, (_, index) => {
    const isFilled = index < currentStars;
    
    return (
      <motion.div
        key={index}
        initial={animated ? { scale: 0, opacity: 0 } : undefined}
        animate={animated ? { scale: 1, opacity: 1 } : undefined}
        transition={animated ? { delay: index * 0.1, duration: 0.3 } : undefined}
        className="inline-block"
      >
        <span
          className={`${sizeClasses[size]} ${
            isFilled 
              ? "filter drop-shadow-lg" 
              : "opacity-30"
          } transition-all duration-300`}
        >
          {isFilled ? "⭐" : "☆"}
        </span>
      </motion.div>
    );
  });

  return (
    <div className="flex items-center gap-1 flex-wrap justify-center">
      {stars}
    </div>
  );
}