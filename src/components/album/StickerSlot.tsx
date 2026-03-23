import { DisplaySticker, RARITY_CONFIG, WORLD_CONFIG } from "./albumTypes";
import { motion } from "framer-motion";
import { Lock, Sparkles, Star } from "lucide-react";

interface StickerSlotProps {
  sticker: DisplaySticker;
}

const WORLD_ICONS: Record<string, string> = {
  tomijev_gozd: '🌲',
  carobni_grad: '🏰',
  vesolje: '🚀',
  dzungla: '🌴',
  pod_morjem: '🐠',
  dino_svet: '🦕',
  super_junaki: '🦸',
};

export function StickerSlot({ sticker }: StickerSlotProps) {
  const rarity = RARITY_CONFIG[sticker.rarity];

  if (!sticker.owned) {
    return (
      <div className={`relative aspect-square rounded-xl border-2 border-dashed border-muted-foreground/20 bg-muted/30 flex flex-col items-center justify-center gap-1 p-2`}>
        <Lock className="w-5 h-5 text-muted-foreground/30" />
        <span className="text-[10px] text-muted-foreground/40 text-center leading-tight">{sticker.name}</span>
      </div>
    );
  }

  const isGolden = sticker.is_golden_version;

  return (
    <motion.div
      whileHover={{ scale: 1.08, rotate: 1 }}
      whileTap={{ scale: 0.95 }}
      className={`relative aspect-square rounded-xl border-2 ${rarity.borderColor} ${rarity.bgColor} flex flex-col items-center justify-center gap-1 p-2 cursor-pointer transition-shadow ${rarity.glow ? `shadow-lg ${rarity.glow}` : 'shadow-sm'} ${isGolden ? 'ring-2 ring-yellow-400 ring-offset-1' : ''}`}
    >
      {isGolden && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
          <Star className="w-3 h-3 text-yellow-800 fill-yellow-800" />
        </div>
      )}
      
      {sticker.image_url ? (
        <img src={sticker.image_url} alt={sticker.name} className="w-10 h-10 object-contain" />
      ) : (
        <span className="text-3xl">{WORLD_ICONS[sticker.world] || '⭐'}</span>
      )}
      
      <span className="text-[10px] font-semibold text-center leading-tight text-foreground">
        {sticker.name}
      </span>
      
      {sticker.rarity !== 'common' && (
        <span className={`text-[8px] font-bold uppercase tracking-wider ${
          sticker.rarity === 'legendary' ? 'text-yellow-600' :
          sticker.rarity === 'rare' ? 'text-purple-600' :
          'text-blue-500'
        }`}>
          {rarity.label}
        </span>
      )}
    </motion.div>
  );
}
