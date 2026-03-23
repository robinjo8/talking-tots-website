import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Star } from "lucide-react";
import { AlbumSticker, RARITY_CONFIG, WORLD_CONFIG } from "./albumTypes";

interface StickerRevealAnimationProps {
  stickers: AlbumSticker[];
  onComplete: () => void;
}

export function StickerRevealAnimation({ stickers, onComplete }: StickerRevealAnimationProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<'sparkle' | 'reveal' | 'done'>('sparkle');

  useEffect(() => {
    if (phase === 'sparkle') {
      const t = setTimeout(() => setPhase('reveal'), 800);
      return () => clearTimeout(t);
    }
    if (phase === 'reveal') {
      const t = setTimeout(() => {
        if (currentIndex < stickers.length - 1) {
          setCurrentIndex(prev => prev + 1);
          setPhase('sparkle');
        } else {
          setPhase('done');
        }
      }, 2000);
      return () => clearTimeout(t);
    }
    if (phase === 'done') {
      const t = setTimeout(onComplete, 500);
      return () => clearTimeout(t);
    }
  }, [phase, currentIndex, stickers.length, onComplete]);

  if (stickers.length === 0) return null;

  const sticker = stickers[currentIndex];
  const rarity = RARITY_CONFIG[sticker.rarity];
  const world = WORLD_CONFIG[sticker.world];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={onComplete}
      >
        {/* Sparkle particles */}
        {phase === 'sparkle' && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  x: '50%', y: '50%', scale: 0, opacity: 1 
                }}
                animate={{ 
                  x: `${20 + Math.random() * 60}%`,
                  y: `${20 + Math.random() * 60}%`,
                  scale: [0, 1.5, 0],
                  opacity: [1, 1, 0],
                }}
                transition={{ duration: 0.8, delay: i * 0.03 }}
                className="absolute w-2 h-2 rounded-full"
                style={{ 
                  background: sticker.rarity === 'legendary' ? '#FFD700' : 
                    sticker.rarity === 'rare' ? '#A855F7' : 
                    sticker.rarity === 'special' ? '#3B82F6' : '#9CA3AF'
                }}
              />
            ))}
          </div>
        )}

        {/* Sticker card */}
        {phase === 'reveal' && (
          <motion.div
            initial={{ scale: 0, rotateY: 180 }}
            animate={{ scale: 1, rotateY: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className={`relative w-48 h-64 md:w-56 md:h-72 rounded-2xl border-4 ${rarity.borderColor} ${rarity.bgColor} flex flex-col items-center justify-center gap-3 p-4 shadow-2xl ${rarity.glow ? `shadow-lg ${rarity.glow}` : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            {sticker.is_golden && (
              <motion.div 
                className="absolute -top-3 -right-3"
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Star className="w-8 h-8 text-yellow-400 fill-yellow-400 drop-shadow-lg" />
              </motion.div>
            )}
            
            <span className="text-5xl">{world.icon}</span>
            
            <h3 className="text-lg font-extrabold text-center text-foreground font-rounded">
              {sticker.name}
            </h3>
            
            <span className={`text-xs font-bold uppercase tracking-widest ${
              sticker.rarity === 'legendary' ? 'text-yellow-600' :
              sticker.rarity === 'rare' ? 'text-purple-600' :
              sticker.rarity === 'special' ? 'text-blue-500' :
              'text-muted-foreground'
            }`}>
              {rarity.label}
            </span>
            
            <span className="text-xs text-muted-foreground">{world.label}</span>
            
            {/* Counter */}
            <span className="text-[10px] text-muted-foreground/60 mt-1">
              {currentIndex + 1} / {stickers.length}
            </span>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
