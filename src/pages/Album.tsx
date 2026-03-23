import { SubscriptionGate } from "@/components/subscription/SubscriptionGate";
import { useAlbumData } from "@/components/album/useAlbumData";
import { AlbumBook } from "@/components/album/AlbumBook";
import { AlbumProgress } from "@/components/album/AlbumProgress";
import { BookOpen } from "lucide-react";

export default function Album() {
  const { stickersByWorld, stats, totalStickers, ownedCount, isLoading } = useAlbumData();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dragon-green" />
      </div>
    );
  }

  return (
    <SubscriptionGate>
      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <BookOpen className="w-7 h-7 text-dragon-green" />
              <h1 className="text-2xl md:text-3xl font-extrabold text-foreground font-rounded">
                TomiTalk čarobni svet
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Zbiraj sličice s Tomijem po čarobnih svetovih! ✨
            </p>
          </div>

          {/* Progress */}
          <AlbumProgress 
            stickersByWorld={stickersByWorld} 
            totalStickers={totalStickers} 
            ownedCount={ownedCount} 
          />

          {/* Album Book */}
          <AlbumBook stickersByWorld={stickersByWorld} />
        </div>
      </div>
    </SubscriptionGate>
  );
}
