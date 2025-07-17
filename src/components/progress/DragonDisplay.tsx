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
          alt={isEarned ? "Zmajček" : "Neosvojeni zmajček"}
          className={`w-16 h-16 object-contain transition-all duration-300 ${
            isEarned ? "" : "opacity-30"
          }`}
          onError={(e) => {
            console.error("Dragon image failed to load:", e.currentTarget.src);
            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z'/%3E%3C/svg%3E";
          }}
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