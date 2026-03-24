import { useState } from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { WORLDS_ORDER, WORLD_CONFIG, DisplaySticker, StickerWorld } from "./albumTypes";

interface AlbumProgressProps {
  stickersByWorld: Record<StickerWorld, DisplaySticker[]>;
  totalStickers: number;
  ownedCount: number;
}

export function AlbumProgress({ stickersByWorld, totalStickers, ownedCount }: AlbumProgressProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pct = totalStickers > 0 ? Math.round((ownedCount / totalStickers) * 100) : 0;

  return (
    <div className="bg-card rounded-2xl p-4 md:p-6 shadow-md border border-border">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-foreground font-rounded">Moj album</h3>
        <span className="text-sm font-semibold text-muted-foreground">{ownedCount}/{totalStickers} ({pct}%)</span>
      </div>
      
      {/* Overall progress bar */}
      <div className="w-full h-3 bg-muted rounded-full overflow-hidden mb-3">
        <div 
          className="h-full bg-gradient-to-r from-dragon-green to-app-orange rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Info button bottom right */}
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <Info className="h-3.5 w-3.5" />
          Podrobnosti
        </Button>
      </div>

      {/* World breakdown dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-center">
              Napredek po svetovih
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {WORLDS_ORDER.map(world => {
              const stickers = stickersByWorld[world] || [];
              const owned = stickers.filter(s => s.owned).length;
              const total = stickers.length;
              const config = WORLD_CONFIG[world];
              const worldPct = total > 0 ? Math.round((owned / total) * 100) : 0;
              return (
                <div key={world} className="flex items-center gap-3">
                  <span className="text-xl w-8 text-center">{config.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{config.label}</span>
                      <span className="text-xs text-muted-foreground">{owned}/{total}</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${worldPct}%`, backgroundColor: config.color }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
