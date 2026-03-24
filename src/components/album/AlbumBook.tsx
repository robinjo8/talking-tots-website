import { useState, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DisplaySticker, StickerWorld, WORLDS_ORDER } from "./albumTypes";
import { AlbumPage } from "./AlbumPage";
import { AlbumWorldCover } from "./AlbumWorldCover";
import { useIsMobile } from "@/hooks/use-mobile";

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

function buildSpreads(pages: PageContent[], isMobile: boolean): [PageContent, PageContent | null][] {
  const spreads: [PageContent, PageContent | null][] = [];
  
  if (isMobile) {
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

export function AlbumBook({ stickersByWorld }: AlbumBookProps) {
  const pages = buildPages(stickersByWorld);
  const isMobile = useIsMobile();
  const spreads = buildSpreads(pages, isMobile);
  const [currentSpread, setCurrentSpread] = useState(0);
  const [direction, setDirection] = useState(0);
  const touchStartX = useRef(0);

  const totalSpreads = spreads.length;

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

  if (isMobile) {
    return (
      <div className="w-full h-full flex flex-col">
        <div 
          className="flex-1 relative"
          style={{ perspective: '1200px' }}
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
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0 p-2"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="w-full h-full">
                <RenderPage page={currentPages[0]} />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Page number - above floating buttons */}
        <div className="text-center py-2 pb-20">
          <span className="text-sm font-medium text-[hsl(30,20%,50%)]">
            {currentSpread + 1} / {totalSpreads}
          </span>
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div 
        className="relative bg-[hsl(30,20%,88%)] rounded-2xl shadow-2xl overflow-hidden border-4 border-[hsl(30,20%,75%)]"
        style={{ perspective: '1200px' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-[hsl(30,20%,70%)] z-10" />
        
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentSpread}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className={`${isSinglePage ? 'flex items-center justify-center' : 'grid grid-cols-2 gap-0'} min-h-[650px]`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {isSinglePage ? (
              <div className="p-3 w-1/2">
                <RenderPage page={currentPages[0]} />
              </div>
            ) : (
              <>
                <div className="p-3">
                  <RenderPage page={currentPages[0]} />
                </div>
                <div className="p-3">
                  <RenderPage page={currentPages[1]!} />
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Desktop navigation */}
      <div className="flex items-center justify-between mt-4 px-2">
        <button
          onClick={goPrev}
          disabled={currentSpread === 0}
          className="p-2 rounded-full bg-card border border-border shadow-sm disabled:opacity-30 hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        
        <div className="flex gap-1.5">
          {spreads.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > currentSpread ? 1 : -1); setCurrentSpread(i); }}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentSpread ? 'bg-dragon-green scale-125' : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>
        
        <button
          onClick={goNext}
          disabled={currentSpread >= totalSpreads - 1}
          className="p-2 rounded-full bg-card border border-border shadow-sm disabled:opacity-30 hover:bg-muted transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-foreground" />
        </button>
      </div>
    </div>
  );
}

function InstructionsPage() {
  return (
    <div className="w-full h-full bg-[hsl(40,30%,95%)] rounded-sm p-4 md:p-6 flex flex-col justify-center">
      <h2 className="text-center text-lg md:text-xl font-bold text-[hsl(30,40%,25%)] mb-5 font-rounded">
        Kako zbiram sličice?
      </h2>
      <div className="space-y-4 text-[hsl(30,30%,30%)]">
        <div className="border-b border-[hsl(30,20%,80%)] pb-3">
          <p className="text-sm md:text-base font-semibold">7 dni zaporedne vadbe</p>
          <p className="text-xs md:text-sm text-[hsl(30,20%,50%)] mt-0.5">5 sličic + 1 zlata sličica</p>
        </div>
        <div className="border-b border-[hsl(30,20%,80%)] pb-3">
          <p className="text-sm md:text-base font-semibold">Artikulacijski test</p>
          <p className="text-xs md:text-sm text-[hsl(30,20%,50%)] mt-0.5">2 sličici</p>
        </div>
        <div className="border-b border-[hsl(30,20%,80%)] pb-3">
          <p className="text-sm md:text-base font-semibold">5 različnih iger na dan</p>
          <p className="text-xs md:text-sm text-[hsl(30,20%,50%)] mt-0.5">1 sličica</p>
        </div>
        <div>
          <p className="text-sm md:text-base font-semibold">Vsakih 20 setov vaj</p>
          <p className="text-xs md:text-sm text-[hsl(30,20%,50%)] mt-0.5">5 sličic + 1 zlata sličica</p>
        </div>
      </div>
    </div>
  );
}

function RenderPage({ page }: { page: PageContent }) {
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
    return <InstructionsPage />;
  }
  if (page.type === 'cover') {
    return (
      <AlbumWorldCover 
        world={page.world!} 
        ownedCount={page.ownedCount || 0} 
        totalCount={page.totalCount || 0} 
      />
    );
  }
  return <AlbumPage stickers={page.stickers || []} pageIndex={page.pageIndex || 0} />;
}
