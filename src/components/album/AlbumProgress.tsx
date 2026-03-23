import { WORLDS_ORDER, WORLD_CONFIG, DisplaySticker, StickerWorld } from "./albumTypes";

interface AlbumProgressProps {
  stickersByWorld: Record<StickerWorld, DisplaySticker[]>;
  totalStickers: number;
  ownedCount: number;
}

export function AlbumProgress({ stickersByWorld, totalStickers, ownedCount }: AlbumProgressProps) {
  const pct = totalStickers > 0 ? Math.round((ownedCount / totalStickers) * 100) : 0;

  return (
    <div className="bg-card rounded-2xl p-4 md:p-6 shadow-md border border-border">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-foreground font-rounded">Moj album</h3>
        <span className="text-sm font-semibold text-muted-foreground">{ownedCount}/{totalStickers} ({pct}%)</span>
      </div>
      
      {/* Overall progress bar */}
      <div className="w-full h-3 bg-muted rounded-full overflow-hidden mb-4">
        <div 
          className="h-full bg-gradient-to-r from-dragon-green to-app-orange rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* World breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {WORLDS_ORDER.map(world => {
          const stickers = stickersByWorld[world] || [];
          const owned = stickers.filter(s => s.owned).length;
          const total = stickers.length;
          const config = WORLD_CONFIG[world];
          return (
            <div key={world} className="flex items-center gap-2 text-xs">
              <span>{config.icon}</span>
              <span className="text-muted-foreground">{owned}/{total}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
