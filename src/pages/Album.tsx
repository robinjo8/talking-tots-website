import { SubscriptionGate } from "@/components/subscription/SubscriptionGate";
import { useAlbumData } from "@/components/album/useAlbumData";
import { AlbumBook } from "@/components/album/AlbumBook";
import { AlbumProgress } from "@/components/album/AlbumProgress";

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
