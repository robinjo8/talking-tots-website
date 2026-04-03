import { useState, useCallback, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DisplaySticker, StickerWorld, WORLDS_ORDER } from "./albumTypes";
import { AlbumPage } from "./AlbumPage";
import { AlbumWorldCover } from "./AlbumWorldCover";
import { useIsMobile } from "@/hooks/use-mobile";

function useViewportSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  useEffect(() => {
    const update = () => {
      const vv = window.visualViewport;
      setSize({
        width: vv ? vv.width : window.innerWidth,
        height: vv ? vv.height : window.innerHeight,
      });
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    const vv = window.visualViewport;
    if (vv) {
      vv.addEventListener('resize', update);
      vv.addEventListener('scroll', update);
    }
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
      if (vv) {
        vv.removeEventListener('resize', update);
        vv.removeEventListener('scroll', update);
      }
    };
  }, []);
  return size;
}

const ALBUM_COVER_URL = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_album_naslovna.webp";

interface AlbumBookProps {
  stickersByWorld: Record<StickerWorld, DisplaySticker[]>;
}

interface PageContent {
  type: 'album_cover' | 'instructions' | 'cover' | 'stickers';
  world?: StickerWorld;
  stickers?: DisplaySticker[];
  ownedCount?: number;
  totalCount?: number;
  pageIndex?: number;
}

function buildPages(stickersByWorld: Record<StickerWorld, DisplaySticker[]>): PageContent[] {
  const pages: PageContent[] = [];
  pages.push({ type: 'album_cover' });
  pages.push({ type: 'instructions' });
  for (const world of WORLDS_ORDER) {
    const stickers = stickersByWorld[world] || [];
    const ownedCount = stickers.filter(s => s.owned).length;
    pages.push({ type: 'cover', world, ownedCount, totalCount: stickers.length });
    for (let i = 0; i < stickers.length; i += 6) {
      pages.push({
        type: 'stickers',
        world,
        stickers: stickers.slice(i, i + 6),
        pageIndex: pages.length + 1,
      });
    }
  }
  return pages;
}

function buildSpreads(pages: PageContent[], isSinglePage: boolean): [PageContent, PageContent | null][] {
  const spreads: [PageContent, PageContent | null][] = [];
  if (isSinglePage) {
    for (const page of pages) {
      spreads.push([page, null]);
    }
  } else {
    if (pages.length >= 2) {
      spreads.push([pages[0], pages[1]]);
      for (let i = 2; i < pages.length; i += 2) {
        spreads.push([pages[i], pages[i + 1] || null]);
      }
    }
  }
  return spreads;
}

const NAV_BAR_HEIGHT = 44;

export function AlbumBook({ stickersByWorld }: AlbumBookProps) {
  const pages = buildPages(stickersByWorld);
  const isMobile = useIsMobile();
  const { width: vpWidth, height: vpHeight } = useViewportSize();
  const isLandscape = vpWidth > vpHeight;
  const isCompact = vpHeight < 600;

  // Mobile = single page, otherwise double spread
  const spreads = buildSpreads(pages, isMobile);
  const [currentSpread, setCurrentSpread] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showPagePicker, setShowPagePicker] = useState(false);
  const touchStartX = useRef(0);

  const totalSpreads = spreads.length;
  const pageAreaHeight = vpHeight - NAV_BAR_HEIGHT;

  const goNext = useCallback(() => {
    if (currentSpread < totalSpreads - 1) {
      setDirection(1);
      setCurrentSpread(prev => prev + 1);
    }
  }, [currentSpread, totalSpreads]);

  const goPrev = useCallback(() => {
    if (currentSpread > 0) {
      setDirection(-1);
      setCurrentSpread(prev => prev - 1);
    }
  }, [currentSpread]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
  };

  const currentPages = spreads[currentSpread];
  if (!currentPages) return null;

  const isSinglePage = !currentPages[1];

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
      rotateY: dir > 0 ? -15 : 15,
    }),
    center: { x: 0, opacity: 1, rotateY: 0 },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
      rotateY: dir > 0 ? 15 : -15,
    }),
  };

  // Unified fullscreen layout for all devices
  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ height: vpHeight }}>
      {/* Page area */}
      <div
        className="relative overflow-hidden flex-1"
        style={{ height: pageAreaHeight, perspective: '1200px' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentSpread}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {isMobile ? (
              /* Mobile: single page */
              <div className="w-full h-full p-1 overflow-hidden">
                <RenderPage page={currentPages[0]} compact={isCompact} />
              </div>
            ) : (
              /* Desktop/Tablet: double spread book */
              <div className="w-full h-full flex items-center justify-center p-2">
                <div
                  className="bg-[hsl(30,20%,85%)] rounded-2xl shadow-2xl border-4 border-[hsl(30,20%,75%)] overflow-hidden relative"
                  style={{
                    width: '100%',
                    maxWidth: Math.min(vpWidth - 48, 1000),
                    height: pageAreaHeight - 16,
                  }}
                >
                  {/* Spine */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-[hsl(30,20%,70%)] z-10" />

                  {isSinglePage ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="p-3 w-1/2 h-full">
                        <RenderPage page={currentPages[0]} compact={isCompact} />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-0 h-full">
                      <div className="p-3 h-full overflow-hidden">
                        <RenderPage page={currentPages[0]} compact={isCompact} />
                      </div>
                      <div className="p-3 h-full overflow-hidden">
                        <RenderPage page={currentPages[1]!} compact={isCompact} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation bar */}
      <div className="flex items-center justify-center gap-4 shrink-0" style={{ height: NAV_BAR_HEIGHT }}>
        <button
          onClick={goPrev}
          disabled={currentSpread === 0}
          className="p-2 rounded-full bg-white/30 backdrop-blur-sm disabled:opacity-30 active:scale-95 hover:bg-white/50 transition-all"
        >
          <ChevronLeft className="w-5 h-5 text-[hsl(30,30%,30%)]" />
        </button>
        <button
          onClick={() => setShowPagePicker(true)}
          className="text-sm font-medium text-[hsl(30,20%,50%)] border-b border-dashed border-[hsl(30,20%,60%)] pb-0.5 active:opacity-70 hover:text-[hsl(30,20%,30%)] transition-all"
        >
          {currentSpread + 1} / {totalSpreads}
        </button>
        <button
          onClick={goNext}
          disabled={currentSpread >= totalSpreads - 1}
          className="p-2 rounded-full bg-white/30 backdrop-blur-sm disabled:opacity-30 active:scale-95 hover:bg-white/50 transition-all"
        >
          <ChevronRight className="w-5 h-5 text-[hsl(30,30%,30%)]" />
        </button>
      </div>

      {/* Page picker dialog */}
      <Dialog open={showPagePicker} onOpenChange={setShowPagePicker}>
        <DialogContent className="max-w-xs rounded-2xl" hideCloseButton>
          <DialogHeader>
            <DialogTitle className="text-center text-base font-bold text-[hsl(30,40%,25%)]">
              IZBERI STRAN
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-2 max-h-[60vh] overflow-y-auto py-2">
            {Array.from({ length: totalSpreads }).map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > currentSpread ? 1 : -1);
                  setCurrentSpread(i);
                  setShowPagePicker(false);
                }}
                className={`h-10 rounded-lg text-sm font-semibold transition-colors ${
                  i === currentSpread
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-sm'
                    : 'bg-[hsl(30,20%,90%)] text-[hsl(30,30%,30%)] hover:bg-[hsl(30,20%,85%)]'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InstructionsPage({ compact }: { compact?: boolean }) {
  return (
    <div className={`w-full h-full bg-[hsl(40,30%,95%)] rounded-sm ${compact ? 'p-2' : 'p-4 md:p-6'} flex flex-col justify-center overflow-hidden`}>
      <h2 className={`text-center font-bold text-[hsl(30,40%,25%)] ${compact ? 'text-sm mb-1' : 'text-lg md:text-xl mb-5'} font-rounded`}>
        Kako zbiram sličice?
      </h2>
      <div className={`${compact ? 'space-y-0.5' : 'space-y-4'} text-[hsl(30,30%,30%)]`}>
        <div className={`border-b border-[hsl(30,20%,80%)] ${compact ? 'pb-0.5' : 'pb-3'}`}>
          <p className={`${compact ? 'text-[10px]' : 'text-sm md:text-base'} font-semibold`}>7 dni zaporedne vadbe</p>
          <p className={`${compact ? 'text-[9px]' : 'text-xs md:text-sm'} text-[hsl(30,20%,50%)] mt-0.5`}>5 sličic + 1 zlata sličica</p>
        </div>
        <div className={`border-b border-[hsl(30,20%,80%)] ${compact ? 'pb-0.5' : 'pb-3'}`}>
          <p className={`${compact ? 'text-[10px]' : 'text-sm md:text-base'} font-semibold`}>Artikulacijski test</p>
          <p className={`${compact ? 'text-[9px]' : 'text-xs md:text-sm'} text-[hsl(30,20%,50%)] mt-0.5`}>2 sličici</p>
        </div>
        <div className={`border-b border-[hsl(30,20%,80%)] ${compact ? 'pb-0.5' : 'pb-3'}`}>
          <p className={`${compact ? 'text-[10px]' : 'text-sm md:text-base'} font-semibold`}>5 različnih iger na dan</p>
          <p className={`${compact ? 'text-[9px]' : 'text-xs md:text-sm'} text-[hsl(30,20%,50%)] mt-0.5`}>1 sličica</p>
        </div>
        <div>
          <p className={`${compact ? 'text-[10px]' : 'text-sm md:text-base'} font-semibold`}>Vsakih 20 setov vaj</p>
          <p className={`${compact ? 'text-[9px]' : 'text-xs md:text-sm'} text-[hsl(30,20%,50%)] mt-0.5`}>5 sličic + 1 zlata sličica</p>
        </div>
      </div>
    </div>
  );
}

function RenderPage({ page, compact }: { page: PageContent; compact?: boolean }) {
  if (page.type === 'album_cover') {
    return (
      <div className="w-full h-full rounded-sm overflow-hidden">
        <img
          src={ALBUM_COVER_URL}
          alt="Album zmajčka Tomija"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }
  if (page.type === 'instructions') {
    return <InstructionsPage compact={compact} />;
  }
  if (page.type === 'cover') {
    return (
      <AlbumWorldCover
        world={page.world!}
        ownedCount={page.ownedCount || 0}
        totalCount={page.totalCount || 0}
        compact={compact}
      />
    );
  }
  return <AlbumPage stickers={page.stickers || []} pageIndex={page.pageIndex || 0} />;
}
