import { StickerWorld, WORLD_CONFIG } from "./albumTypes";
import { motion } from "framer-motion";

interface AlbumWorldCoverProps {
  world: StickerWorld;
  ownedCount: number;
  totalCount: number;
  compact?: boolean;
}

export function AlbumWorldCover({ world, ownedCount, totalCount, compact }: AlbumWorldCoverProps) {
  const config = WORLD_CONFIG[world];
  
  return (
    <div className={`w-full h-full rounded-sm bg-gradient-to-br ${config.bgGradient} flex flex-col items-center justify-center ${compact ? 'gap-2 p-3' : 'gap-4 p-6'} text-white overflow-hidden`}>
      <motion.span 
        className={compact ? 'text-4xl' : 'text-6xl md:text-7xl'}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {config.icon}
      </motion.span>
      
      <h2 className={`${compact ? 'text-base' : 'text-xl md:text-2xl'} font-extrabold text-center drop-shadow-lg font-rounded`}>
        {config.label}
      </h2>
      
      <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5">
        <span className={`${compact ? 'text-xs' : 'text-sm'} font-bold`}>
          {ownedCount} / {totalCount}
        </span>
      </div>
    </div>
  );
}
