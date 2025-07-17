import { Star } from "lucide-react";
import { motion } from "framer-motion";

interface StarDisplayProps {
  currentStars: number; // 0-9
  maxStars?: number;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

export function StarDisplay({ currentStars, maxStars = 10, size = "md", animated = true }: StarDisplayProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
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
        <Star
          className={`${sizeClasses[size]} ${
            isFilled 
              ? "text-app-yellow fill-app-yellow drop-shadow-md" 
              : "text-muted-foreground/30"
          } transition-all duration-300`}
        />
      </motion.div>
    );
  });

  return (
    <div className="flex items-center gap-1 flex-wrap justify-center">
      {stars}
    </div>
  );
}