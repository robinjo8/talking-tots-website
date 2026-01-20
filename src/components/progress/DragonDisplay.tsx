import { motion } from "framer-motion";

interface DragonDisplayProps {
  currentDragons: number;
  maxDragons?: number;
  animated?: boolean;
}

// Single image URL - use same image for all dragons, CSS handles visual difference
const DRAGON_IMAGE_URL = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_6.webp";

export function DragonDisplay({ currentDragons, maxDragons = 10, animated = true }: DragonDisplayProps) {
  const dragons = Array.from({ length: maxDragons }, (_, index) => {
    const isEarned = index < currentDragons;
    
    return (
      <motion.div
        key={index}
        initial={animated ? { scale: 0, rotate: -180 } : undefined}
        animate={animated ? { scale: 1, rotate: 0 } : undefined}
        transition={animated ? { delay: index * 0.1, duration: 0.4 } : undefined}
        className="inline-block"
      >
        <img
          src={DRAGON_IMAGE_URL}
          alt={isEarned ? "Zmajček" : "Neosvojeni zmajček"}
          className={`w-12 h-12 md:w-16 md:h-16 object-contain transition-all duration-300 ${
            isEarned ? "" : "opacity-30 grayscale"
          }`}
        />
      </motion.div>
    );
  });

  return (
    <div className="grid grid-cols-5 gap-1 justify-items-center max-w-xs mx-auto">
      {dragons}
    </div>
  );
}