import { DisplaySticker } from "./albumTypes";
import { StickerSlot } from "./StickerSlot";

interface AlbumPageProps {
  stickers: DisplaySticker[];
  pageIndex: number;
}

// Pre-defined scattered positions for up to 6 stickers per page
const POSITIONS = [
  { top: '5%', left: '8%', rotate: -3 },
  { top: '3%', left: '52%', rotate: 2 },
  { top: '35%', left: '5%', rotate: 1.5 },
  { top: '33%', left: '50%', rotate: -2 },
  { top: '65%', left: '6%', rotate: 2.5 },
  { top: '67%', left: '52%', rotate: -1.5 },
];

export function AlbumPage({ stickers, pageIndex }: AlbumPageProps) {
  return (
    <div className="w-full h-full bg-[hsl(40,30%,95%)] rounded-sm p-3 md:p-4 flex flex-col relative">
      <div className="relative flex-1">
        {stickers.map((sticker, i) => {
          const pos = POSITIONS[i] || POSITIONS[0];
          return (
            <div
              key={sticker.id}
              className="absolute w-[42%] sm:w-[40%]"
              style={{
                top: pos.top,
                left: pos.left,
                transform: `rotate(${pos.rotate}deg)`,
              }}
            >
              <StickerSlot sticker={sticker} />
            </div>
          );
        })}
      </div>
      <div className="text-center text-[10px] text-muted-foreground mt-2">
        {pageIndex}
      </div>
    </div>
  );
}
