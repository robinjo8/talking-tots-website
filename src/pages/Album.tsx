import { useState } from "react";
import { CircleHelp, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SubscriptionGate } from "@/components/subscription/SubscriptionGate";
import { useAlbumData } from "@/components/album/useAlbumData";
import { AlbumBook } from "@/components/album/AlbumBook";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { WORLDS_ORDER, WORLD_CONFIG } from "@/components/album/albumTypes";
import { useIsMobile } from "@/hooks/use-mobile";
import { LandscapeOverlay } from "@/components/album/LandscapeOverlay";

export default function Album() {
  const { stickersByWorld, stats, totalStickers, ownedCount, isLoading } = useAlbumData();
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dragon-green" />
      </div>
    );
  }

  return (
    <SubscriptionGate>
      {/* Fullscreen shell for ALL devices */}
      <div className="fixed inset-0 overflow-hidden bg-[hsl(30,20%,88%)] z-40" style={{ overscrollBehaviorY: 'contain' }}>
        {isMobile && <LandscapeOverlay />}
        <div className="w-full h-full flex flex-col">
          <AlbumBook stickersByWorld={stickersByWorld} />
        </div>

        {/* Back button - bottom left */}
        <button
          onClick={() => navigate('/moja-stran')}
          className="fixed bottom-6 left-6 w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg border-2 border-white/50 backdrop-blur-sm hover:scale-105 transition-transform z-50"
        >
          <ArrowLeft className="w-8 h-8 text-white" />
        </button>

        {/* ? button - bottom right */}
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg border-2 border-white/50 backdrop-blur-sm hover:scale-105 transition-transform z-50"
        >
          <CircleHelp className="w-8 h-8 text-white" />
        </button>
      </div>

      {/* World breakdown dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-center">
              NAPREDEK PO SVETOVIH
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
                      <span className="text-sm font-medium text-foreground">{config.label.toUpperCase()}</span>
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
    </SubscriptionGate>
  );
}
