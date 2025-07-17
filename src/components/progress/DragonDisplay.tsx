import { motion } from "framer-motion";

interface DragonDisplayProps {
  currentDragons: number;
  maxDragons?: number;
  animated?: boolean;
}

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
          src={isEarned 
            ? "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_6.png"
            : "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_6_cb.png"
          }
          alt={isEarned ? "Earned dragon" : "Unearned dragon"}
          className={`w-8 h-8 object-contain transition-all duration-300 ${
            isEarned ? "" : "opacity-30"
          }`}
        />
      </motion.div>
    );
  });

  return (
    <div className="flex items-center gap-1 flex-wrap justify-center">
      {dragons}
      {currentDragons > maxDragons && (
        <span className="text-dragon-green font-bold text-lg ml-2">
          +{currentDragons - maxDragons}
        </span>
      )}
    </div>
  );
}