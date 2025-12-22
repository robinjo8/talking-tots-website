import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MemoryGrid } from "@/components/games/MemoryGrid";
import { useMemoryGameK } from "@/hooks/useMemoryGameK";
import { useToast } from "@/components/ui/use-toast";
import { useAudioPlayback } from "@/hooks/useAudioPlayback";
import { InfoModal } from "@/components/games/InfoModal";
import { MemoryPairDialog } from "@/components/games/MemoryPairDialog";
import { MemoryExitConfirmationDialog } from "@/components/games/MemoryExitConfirmationDialog";
import { MemoryProgressIndicator } from "@/components/games/MemoryProgressIndicator";

const SUPABASE_URL = "https://ecmtctwovkheohqwahvt.supabase.co";

export default function SpominK() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  // Reliable touch device detection using physical screen size
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  
  const effectiveFullscreen = isTouchDevice;
  
  const { audioRef } = useAudioPlayback();
  const [showInfo, setShowInfo] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { toast } = useToast();
  
  const currentLetter = decodeURIComponent(location.pathname.split('-').pop() || 'k').toUpperCase();
  const { 
    cards, 
    isLoading, 
    error, 
    flipCard, 
    resetGame, 
    gameCompleted,
    matchedPairs,
    totalPairs,
    isCheckingMatch,
    showPairDialog,
    currentMatchedPair,
    handlePairDialogContinue,
    handlePairUnmatch
  } = useMemoryGameK();
  const gameStartTimeRef = useRef<number | null>(null);
  const [gameTime, setGameTime] = useState<number | null>(null);

  // Reliable touch device detection using physical screen size
  useEffect(() => {
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = Math.min(window.screen.width, window.screen.height) <= 900;
    setIsTouchDevice(hasTouch && isSmallScreen);
  }, []);

  // Reliable orientation detection using screen.orientation
  useEffect(() => {
    const checkOrientation = () => {
      if (window.screen.orientation) {
        setIsPortrait(window.screen.orientation.type.includes('portrait'));
      } else {
        // Fallback: use screen dimensions (not window - those change with CSS rotation)
        setIsPortrait(window.screen.height > window.screen.width);
      }
    };
    
    checkOrientation();
    
    const handleOrientationChange = () => {
      setTimeout(checkOrientation, 100);
    };
    
    window.addEventListener('orientationchange', handleOrientationChange);
    if (window.screen.orientation) {
      window.screen.orientation.addEventListener('change', checkOrientation);
    }
    
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      if (window.screen.orientation) {
        window.screen.orientation.removeEventListener('change', checkOrientation);
      }
    };
  }, []);

  // Automatic fullscreen and landscape lock (identical to LabirintC)
  useEffect(() => {
    if (effectiveFullscreen) {
      const requestFullscreen = async () => {
        try {
          if (document.documentElement.requestFullscreen) {
            await document.documentElement.requestFullscreen();
          }
        } catch (error) {
          console.log('Fullscreen not supported:', error);
        }
      };

      const lockLandscape = async () => {
        try {
          if (screen.orientation && 'lock' in screen.orientation) {
            try {
              await (screen.orientation as any).lock('landscape-primary');
            } catch {
              await (screen.orientation as any).lock('landscape');
            }
          }
        } catch (error) {
          console.log('Landscape lock not supported:', error);
        }
      };

      requestFullscreen();
      lockLandscape();
        
      return () => {
        if (document.fullscreenElement) {
          document.exitFullscreen?.();
        }
        try {
          if (screen.orientation && 'unlock' in screen.orientation) {
            (screen.orientation as any).unlock();
          }
        } catch (error) {
          console.log('Portrait unlock not supported:', error);
        }
      };
    }
  }, [effectiveFullscreen]);

  const handleCardClick = (index: number) => {
    if (!gameStartTimeRef.current && cards.length > 0) {
      gameStartTimeRef.current = Date.now();
    }
    flipCard(index);
  };

  const handleReset = () => {
    resetGame();
    gameStartTimeRef.current = null;
    setGameTime(null);
    toast({
      title: "Igra je bila ponovno nastavljena!",
    });
  };

  useEffect(() => {
    if (gameCompleted && gameStartTimeRef.current && gameTime === null) {
      const endTime = Date.now();
      const timeTaken = Math.floor((endTime - gameStartTimeRef.current) / 1000);
      setGameTime(timeTaken);
      setTimeout(() => {
        toast({
          title: "Čestitamo!",
          description: `Igra je končana v ${timeTaken} sekundah!`,
        });
      }, 500);
    }
  }, [gameCompleted, gameStartTimeRef, gameTime, toast]);

  const backgroundImageUrl = `${SUPABASE_URL}/storage/v1/object/public/ozadja/zeleno_ozadje.png`;

  // Mobile fullscreen version
  if (effectiveFullscreen) {
    return (
      <div className="fixed inset-0 overflow-hidden select-none">
        {/* Full screen background */}
        <div 
          className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${backgroundImageUrl}')` }}
        />
        
        {/* Game content */}
        <div className="relative z-10 flex-1 flex items-stretch justify-center overflow-hidden h-full w-full">
          {!isPortrait ? (
            isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-lg text-muted-foreground">Nalaganje igre...</div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full">
                <div className="bg-red-50 p-6 rounded-lg border border-red-100 text-center">
                  <h3 className="text-red-600 font-medium mb-2">Napaka pri nalaganju igre</h3>
                  <p className="text-sm text-red-500">Poskusite znova kasneje.</p>
                  <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                    Poskusi znova
                  </Button>
                </div>
              </div>
            ) : cards.length > 0 ? (
              <MemoryGrid
                cards={cards}
                onCardClick={handleCardClick}
                isCheckingMatch={isCheckingMatch}
                isLandscape={!isPortrait}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Ni kartic za prikaz.</p>
              </div>
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center px-6 text-center">
              <p className="text-base font-semibold text-foreground">
                Za igranje igre Spomin prosim obrni telefon v ležeči položaj.
              </p>
            </div>
          )}
        </div>

        {/* Progress dots on right side - mobile only */}
        {!isPortrait && (
          <div className="fixed right-2 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2">
            {Array.from({ length: totalPairs }).map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full border-2 border-white/70 transition-all duration-300 ${
                  index < matchedPairs.length
                    ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                    : 'bg-transparent'
                }`}
              />
            ))}
          </div>
        )}

        {/* Floating menu button */}
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button 
              className="fixed bottom-4 left-4 z-50 rounded-full w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 shadow-lg border-2 border-white/50 backdrop-blur-sm"
              size="icon"
            >
              <Home className="h-7 w-7 text-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="start" 
            side="top"
            sideOffset={8}
            className="ml-4 w-56 p-2 bg-white/95 border-2 border-orange-200 shadow-xl"
          >
            <button
              onClick={() => { setMenuOpen(false); setShowExitDialog(true); }}
              className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100"
            >
              <span className="text-2xl">🏠</span>
              <span>Nazaj</span>
            </button>
            <button
              onClick={() => { setMenuOpen(false); handleReset(); }}
              className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100"
            >
              <span className="text-2xl">🔄</span>
              <span>Nova igra</span>
            </button>
            <button
              onClick={() => { setMenuOpen(false); setShowInfo(true); }}
              className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium"
            >
              <span className="text-2xl">📖</span>
              <span>Navodila</span>
            </button>
          </DropdownMenuContent>
        </DropdownMenu>

        <InfoModal 
          isOpen={showInfo} 
          onClose={() => setShowInfo(false)} 
          title="Navodila za igro Spomin" 
          content="Ta igra je super za vadbo spomina in izgovorjave besed!

Klikni na dve ploščici in poskusi najti pravi par (sliko in besedo).

Ko najdeš par, se odpre okno z izgovorjavo – poslušaj in ponovi besedo na glas.

Če jo pravilno izgovoriš, se par obdrži!

Igra je končana, ko odkriješ vse pare in pravilno izgovoriš vse besede." 
        />

        <MemoryPairDialog 
          isOpen={showPairDialog} 
          onClose={handlePairDialogContinue} 
          onContinue={handlePairDialogContinue} 
          onUnmatch={handlePairUnmatch} 
          pairNumber={matchedPairs.length} 
          totalPairs={totalPairs} 
          imageUrl={currentMatchedPair?.image_url || null} 
          word={currentMatchedPair?.word || null} 
          audioUrl={currentMatchedPair?.audio_url || null} 
        />

        <MemoryExitConfirmationDialog 
          open={showExitDialog} 
          onOpenChange={setShowExitDialog} 
          onConfirm={() => navigate("/govorne-igre/spomin")}
        >
          <div />
        </MemoryExitConfirmationDialog>
      </div>
    );
  }

  // Desktop version
  return (
    <div className="min-h-screen relative">
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${backgroundImageUrl}')` }}
      />
      
      <div className="relative z-10 container max-w-5xl mx-auto pt-4 pb-20 px-2 sm:px-4">
        <div className="px-4">
          <div className="w-full max-w-4xl mx-auto">
            {isLoading && <div className="text-lg text-muted-foreground">Nalaganje igre...</div>}
            
            {error && (
              <div className="bg-red-50 p-6 rounded-lg border border-red-100 text-center">
                <h3 className="text-red-600 font-medium mb-2">Napaka pri nalaganju igre</h3>
                <p className="text-sm text-red-500">Poskusite znova kasneje.</p>
                <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                  Poskusi znova
                </Button>
              </div>
            )}
            
            {!isLoading && !error && cards.length > 0 && (
              <>
                <MemoryProgressIndicator matchedPairs={matchedPairs.length} totalPairs={totalPairs} />
                <div className="mt-8">
                  <MemoryGrid cards={cards} onCardClick={handleCardClick} isCheckingMatch={isCheckingMatch} />
                </div>
              </>
            )}
            
            {!isLoading && !error && cards.length === 0 && (
              <div className="text-center p-10 border rounded-lg">
                <p className="text-muted-foreground">Ni kartic za prikaz. Prosim, preverite nastavitve igre.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating menu button */}
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            className="fixed bottom-4 left-4 z-50 rounded-full w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 shadow-lg border-2 border-white/50 backdrop-blur-sm"
            size="icon"
          >
            <Home className="h-7 w-7 text-white" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="start" 
          side="top" 
          sideOffset={8} 
          className="ml-4 w-56 p-2 bg-white/95 border-2 border-orange-200 shadow-xl"
        >
          <button 
            onClick={() => { setMenuOpen(false); setShowExitDialog(true); }} 
            className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100"
          >
            <span className="text-2xl">🏠</span>
            <span>Nazaj</span>
          </button>
          <button 
            onClick={() => { setMenuOpen(false); handleReset(); }} 
            className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100"
          >
            <span className="text-2xl">🔄</span>
            <span>Nova igra</span>
          </button>
          <button 
            onClick={() => { setMenuOpen(false); setShowInfo(true); }} 
            className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium"
          >
            <span className="text-2xl">📖</span>
            <span>Navodila</span>
          </button>
        </DropdownMenuContent>
      </DropdownMenu>

      <InfoModal 
        isOpen={showInfo} 
        onClose={() => setShowInfo(false)} 
        title="Navodila za igro Spomin" 
        content="Ta igra je super za vadbo spomina in izgovorjave besed!

Klikni na dve ploščici in poskusi najti pravi par (sliko in besedo).

Ko najdeš par, se odpre okno z izgovorjavo – poslušaj in ponovi besedo na glas.

Če jo pravilno izgovoriš, se par obdrži!

Igra je končana, ko odkriješ vse pare in pravilno izgovoriš vse besede." 
      />

      <MemoryPairDialog 
        isOpen={showPairDialog} 
        onClose={handlePairDialogContinue} 
        onContinue={handlePairDialogContinue} 
        onUnmatch={handlePairUnmatch} 
        pairNumber={matchedPairs.length} 
        totalPairs={totalPairs} 
        imageUrl={currentMatchedPair?.image_url || null} 
        word={currentMatchedPair?.word || null} 
        audioUrl={currentMatchedPair?.audio_url || null} 
      />

      <MemoryExitConfirmationDialog 
        open={showExitDialog} 
        onOpenChange={setShowExitDialog} 
        onConfirm={() => navigate("/govorne-igre/spomin")}
      >
        <div />
      </MemoryExitConfirmationDialog>
    </div>
  );
}