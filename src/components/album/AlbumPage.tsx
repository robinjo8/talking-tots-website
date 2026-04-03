import { DisplaySticker } from "./albumTypes";
import { StickerSlot } from "./StickerSlot";

interface AlbumPageProps {
  stickers: DisplaySticker[];
  pageIndex: number;
}

const POSITIONS = [
  { top: '3%', left: '5%', rotate: -3 },
  { top: '3%', left: '52%', rotate: 2 },
  { top: '34%', left: '5%', rotate: 1.5 },
  { top: '34%', left: '52%', rotate: -2 },
  { top: '65%', left: '5%', rotate: 2.5 },
  { top: '65%', left: '52%', rotate: -1.5 },
];

export function AlbumPage({ stickers, pageIndex }: AlbumPageProps) {
  return (
    <div className="w-full h-full bg-[hsl(40,30%,95%)] rounded-sm p-1 flex flex-col relative overflow-hidden">
      <div className="relative flex-1">
        {stickers.map((sticker, i) => {
          const pos = POSITIONS[i] || POSITIONS[0];
          return (
            <div
              key={sticker.id}
              className="absolute w-[42%]"
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
      <div className="text-center text-[10px] text-muted-foreground">
        {pageIndex}
      </div>
    </div>
  );
}
