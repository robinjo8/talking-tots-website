import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MemoryGrid } from "@/components/games/MemoryGrid";
import { useMemoryGameČ } from "@/hooks/useMemoryGameČ";
import { useToast } from "@/components/ui/use-toast";
import { useAudioPlayback } from "@/hooks/useAudioPlayback";
import { InfoModal } from "@/components/games/InfoModal";
import { MemoryPairDialog } from "@/components/games/MemoryPairDialog";
import { MemoryExitConfirmationDialog } from "@/components/games/MemoryExitConfirmationDialog";
import { MemoryProgressIndicator } from "@/components/games/MemoryProgressIndicator";
import { useIsMobile } from "@/hooks/use-mobile";

const SUPABASE_URL = "https://ecmtctwovkheohqwahvt.supabase.co";

export default function SpominČ() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  // Use reliable mobile detection hook
  const isMobile = useIsMobile();
  const [isPortrait, setIsPortrait] = useState(false);
  
  const { audioRef } = useAudioPlayback();
  const [showInfo, setShowInfo] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { toast } = useToast();
  
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
  } = useMemoryGameČ();
  const gameStartTimeRef = useRef<number | null>(null);
  const [gameTime, setGameTime] = useState<number | null>(null);

  // Check orientation and update on changes - only matters on mobile
  useEffect(() => {
    const checkOrientation = () => {
      const portrait = window.innerHeight > window.innerWidth;
      setIsPortrait(portrait);
    };
    
    checkOrientation();
    
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    
    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  // Mobile fullscreen mode - always true on mobile
  const effectiveFullscreen = isMobile;

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

  // Enable fullscreen and try to lock landscape orientation
  useEffect(() => {
    if (!effectiveFullscreen) return;
    
    const requestFullscreenAndLockLandscape = async () => {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
        
        if (screen.orientation && 'lock' in screen.orientation) {
          try {
            await (screen.orientation as any).lock('landscape');
          } catch (lockError) {
            console.log('Landscape lock not supported:', lockError);
          }
        }
      } catch (error) {
        console.log('Fullscreen not supported:', error);
      }
    };
    
    requestFullscreenAndLockLandscape();
    
    return () => {
      if (screen.orientation && 'unlock' in screen.orientation) {
        try {
          (screen.orientation as any).unlock();
        } catch (e) {
          console.log('Orientation unlock error:', e);
        }
      }
      
      if (document.fullscreenElement) {
        document.exitFullscreen?.();
      }
    };
  }, [effectiveFullscreen]);

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

  // For mobile in portrait: use CSS transform to force landscape view
  // This works even if orientation lock is not supported (iOS)
  const shouldRotate = isMobile && isPortrait;

  // Container styles for rotated view - swap width/height and rotate
  const rotatedContainerStyle: React.CSSProperties = shouldRotate ? {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vh',
    height: '100vw',
    transform: 'rotate(90deg)',
    transformOrigin: 'top left',
    marginLeft: '100vw',
    overflow: 'hidden',
    zIndex: 9999,
  } : {};

  return (
    <div 
      className={`${effectiveFullscreen ? 'fixed inset-0 overflow-hidden' : 'min-h-screen'} relative`}
      style={rotatedContainerStyle}
    >
      {/* Background image layer */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${backgroundImageUrl}')`
        }}
      />
      
      <div className={`relative z-10 ${effectiveFullscreen ? 'h-full flex items-center justify-center overflow-hidden' : 'container max-w-5xl mx-auto pt-4 pb-20 px-2 sm:px-4'}`}>
        {effectiveFullscreen ? (
          <div className="w-full h-full flex items-center justify-center px-4">
            {isLoading && (
              <div className="text-lg text-white">Nalaganje igre...</div>
            )}
            
            {error && (
              <div className="bg-red-50 p-6 rounded-lg border border-red-100 text-center">
                <h3 className="text-red-600 font-medium mb-2">Napaka pri nalaganju igre</h3>
                <p className="text-sm text-red-500">Poskusite znova kasneje.</p>
                <Button 
                  variant="outline" 
                  className="mt-4" 
                  onClick={() => window.location.reload()}
                >
                  Poskusi znova
                </Button>
              </div>
            )}
            
            {!isLoading && !error && cards.length > 0 && (
              <div className="w-full h-full flex flex-col items-center justify-center py-2">
                <MemoryProgressIndicator 
                  matchedPairs={matchedPairs.length} 
                  totalPairs={totalPairs} 
                />
                <div className="flex-1 flex items-center justify-center w-full" style={{ maxWidth: shouldRotate ? '95vh' : '95vw' }}>
                  <MemoryGrid
                    cards={cards}
                    onCardClick={handleCardClick}
                    isCheckingMatch={isCheckingMatch}
                    isLandscape={true}
                  />
                </div>
              </div>
            )}
            
            {!isLoading && !error && cards.length === 0 && (
              <div className="text-center p-10 border rounded-lg bg-white/90">
                <p className="text-muted-foreground">
                  Ni kartic za prikaz. Prosim, preverite nastavitve igre.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="px-4">
            <div className="w-full max-w-4xl mx-auto">
              {isLoading && (
                <div className="text-lg text-muted-foreground">Nalaganje igre...</div>
              )}
              
              {error && (
                <div className="bg-red-50 p-6 rounded-lg border border-red-100 text-center">
                  <h3 className="text-red-600 font-medium mb-2">Napaka pri nalaganju igre</h3>
                  <p className="text-sm text-red-500">Poskusite znova kasneje.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4" 
                    onClick={() => window.location.reload()}
                  >
                    Poskusi znova
                  </Button>
                </div>
              )}
              
              {!isLoading && !error && cards.length > 0 && (
                <>
                  <MemoryProgressIndicator 
                    matchedPairs={matchedPairs.length} 
                    totalPairs={totalPairs} 
                  />
                  <div className="my-[160px]">
                    <MemoryGrid 
                      cards={cards} 
                      onCardClick={handleCardClick}
                      isCheckingMatch={isCheckingMatch}
                    />
                  </div>
                </>
              )}
              
              {!isLoading && !error && cards.length === 0 && (
                <div className="text-center p-10 border rounded-lg">
                  <p className="text-muted-foreground">
                    Ni kartic za prikaz. Prosim, preverite nastavitve igre.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Floating menu button */}
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            className="fixed z-50 rounded-full w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 shadow-lg border-2 border-white/50 backdrop-blur-sm"
            style={{
              bottom: shouldRotate ? 'auto' : '16px',
              left: shouldRotate ? 'auto' : '16px',
              top: shouldRotate ? '16px' : 'auto',
              right: shouldRotate ? '16px' : 'auto',
            }}
            size="icon"
          >
            <Home className="h-6 w-6 text-white" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align={shouldRotate ? "end" : "start"}
          side={shouldRotate ? "bottom" : "top"}
          sideOffset={8}
          className="w-56 p-2 bg-white/95 border-2 border-orange-200 shadow-xl"
        >
          <button
            onClick={() => {
              setMenuOpen(false);
              setShowExitDialog(true);
            }}
            className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100"
          >
            <span className="text-2xl">🏠</span>
            <span>Nazaj</span>
          </button>
          <button
            onClick={() => {
              setMenuOpen(false);
              handleReset();
            }}
            className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100"
          >
            <span className="text-2xl">🔄</span>
            <span>Nova igra</span>
          </button>
          <button
            onClick={() => {
              setMenuOpen(false);
              setShowInfo(true);
            }}
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