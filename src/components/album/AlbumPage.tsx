import { DisplaySticker } from "./albumTypes";
import { StickerSlot } from "./StickerSlot";

interface AlbumPageProps {
  stickers: DisplaySticker[];
  pageIndex: number;
}

export function AlbumPage({ stickers, pageIndex }: AlbumPageProps) {
  return (
    <div className="w-full h-full bg-[hsl(40,30%,95%)] rounded-sm p-3 md:p-4 flex flex-col">
      {/* Sticker grid - 3x2 */}
      <div className="grid grid-cols-3 gap-2 md:gap-3 flex-1 content-start">
        {stickers.map((sticker) => (
          <StickerSlot key={sticker.id} sticker={sticker} />
        ))}
        {/* Fill empty slots to keep grid consistent */}
        {Array.from({ length: Math.max(0, 6 - stickers.length) }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
      </div>
      <div className="text-center text-[10px] text-muted-foreground mt-2">
        {pageIndex}
      </div>
    </div>
  );
}
