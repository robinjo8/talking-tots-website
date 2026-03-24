import { DisplaySticker } from "./albumTypes";
import { StickerSlot } from "./StickerSlot";
import { useIsMobile } from "@/hooks/use-mobile";

interface AlbumPageProps {
  stickers: DisplaySticker[];
  pageIndex: number;
}

// Desktop: scattered positions for up to 6 stickers per page
const DESKTOP_POSITIONS = [
  { top: '5%', left: '8%', rotate: -3 },
  { top: '3%', left: '52%', rotate: 2 },
  { top: '35%', left: '5%', rotate: 1.5 },
  { top: '33%', left: '50%', rotate: -2 },
  { top: '65%', left: '6%', rotate: 2.5 },
  { top: '67%', left: '52%', rotate: -1.5 },
];

// Mobile: tighter grid, no overlap
const MOBILE_POSITIONS = [
  { top: '2%', left: '5%', rotate: -2 },
  { top: '2%', left: '52%', rotate: 1.5 },
  { top: '34%', left: '5%', rotate: 1 },
  { top: '34%', left: '52%', rotate: -1.5 },
  { top: '66%', left: '5%', rotate: 2 },
  { top: '66%', left: '52%', rotate: -1 },
];

export function AlbumPage({ stickers, pageIndex }: AlbumPageProps) {
  const isMobile = useIsMobile();
  const positions = isMobile ? MOBILE_POSITIONS : DESKTOP_POSITIONS;

  return (
    <div className="w-full h-full bg-[hsl(40,30%,95%)] rounded-sm p-2 md:p-4 flex flex-col relative">
      <div className="relative flex-1">
        {stickers.map((sticker, i) => {
          const pos = positions[i] || positions[0];
          return (
            <div
              key={sticker.id}
              className="absolute w-[42%] md:w-[42%]"
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
      <div className="text-center text-[10px] text-muted-foreground mt-1">
        {pageIndex}
      </div>
    </div>
  );
}
