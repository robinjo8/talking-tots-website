import { useState, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DisplaySticker, StickerWorld, WORLDS_ORDER } from "./albumTypes";
import { AlbumPage } from "./AlbumPage";
import { AlbumWorldCover } from "./AlbumWorldCover";

interface AlbumBookProps {
  stickersByWorld: Record<StickerWorld, DisplaySticker[]>;
}

interface PageContent {
  type: 'cover' | 'stickers';
  world: StickerWorld;
  stickers?: DisplaySticker[];
  ownedCount?: number;
  totalCount?: number;
  pageIndex?: number;
}

function buildPages(stickersByWorld: Record<StickerWorld, DisplaySticker[]>): PageContent[] {
  const pages: PageContent[] = [];
  
  for (const world of WORLDS_ORDER) {
    const stickers = stickersByWorld[world] || [];
    const ownedCount = stickers.filter(s => s.owned).length;
    
    // Cover page
    pages.push({ type: 'cover', world, ownedCount, totalCount: stickers.length });
    
    // Sticker pages (6 per page)
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

export function AlbumBook({ stickersByWorld }: AlbumBookProps) {
  const pages = buildPages(stickersByWorld);
  const [currentSpread, setCurrentSpread] = useState(0); // index in spreads (2 pages per spread)
  const [direction, setDirection] = useState(0);
  const touchStartX = useRef(0);

  // Build spreads (pairs of pages for book view)
  // First page is alone (cover), then pairs
  const spreads: [PageContent, PageContent | null][] = [];
  for (let i = 0; i < pages.length; i += 2) {
    spreads.push([pages[i], pages[i + 1] || null]);
  }

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

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Book container */}
      <div 
        className="relative bg-[hsl(30,20%,88%)] rounded-2xl shadow-2xl overflow-hidden border-4 border-[hsl(30,20%,75%)]"
        style={{ perspective: '1200px' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Book spine decoration */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-[hsl(30,20%,70%)] z-10 hidden md:block" />
        
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentSpread}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="grid grid-cols-1 md:grid-cols-2 gap-0 min-h-[400px] md:min-h-[500px]"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Left page */}
            <div className="p-2 md:p-3">
              <RenderPage page={currentPages[0]} />
            </div>
            
            {/* Right page */}
            <div className="p-2 md:p-3">
              {currentPages[1] ? (
                <RenderPage page={currentPages[1]} />
              ) : (
                <div className="w-full h-full bg-[hsl(40,30%,95%)] rounded-sm flex items-center justify-center">
                  <span className="text-muted-foreground/30 text-sm">📖</span>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
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

function RenderPage({ page }: { page: PageContent }) {
  if (page.type === 'cover') {
    return (
      <AlbumWorldCover 
        world={page.world} 
        ownedCount={page.ownedCount || 0} 
        totalCount={page.totalCount || 0} 
      />
    );
  }
  return <AlbumPage stickers={page.stickers || []} pageIndex={page.pageIndex || 0} />;
}
