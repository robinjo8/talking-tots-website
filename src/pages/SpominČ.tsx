import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MemoryGrid } from "@/components/games/MemoryGrid";
import { useMemoryGameČ } from "@/hooks/useMemoryGameČ";
import { useToast } from "@/components/ui/use-toast";
import { useAudioPlayback } from "@/hooks/useAudioPlayback";
import { InfoModal } from "@/components/games/InfoModal";
import { MemoryExitConfirmationDialog } from "@/components/games/MemoryExitConfirmationDialog";
import { MemoryPairDialog } from "@/components/games/MemoryPairDialog";
import { MemoryProgressIndicator } from "@/components/games/MemoryProgressIndicator";
import { AgeGatedRoute } from "@/components/auth/AgeGatedRoute";

const SUPABASE_URL = "https://ecmtctwovkheohqwahvt.supabase.co";

// Wrapper component with AgeGatedRoute - IDENTICAL structure to LabirintC
const SpominČ = () => {
  return (
    <AgeGatedRoute requiredAgeGroup="3-4">
      <SpominČContent />
    </AgeGatedRoute>
  );
};

// Content component - mounts AFTER age gate click (enables fullscreen/lock)
const SpominČContent = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Reliable touch device detection using ontouchstart + screen dimensions
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  // Portrait detection for showing rotation message
  const [isPortrait, setIsPortrait] = useState(false);
  // NEW: isReady state for timing buffer (like LabirintC async load)
  const [isReady, setIsReady] = useState(false);
  
  // Touch devices get fullscreen mode
  const effectiveFullscreen = isTouchDevice;
  
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

  // DEBUG: Log component mount
  useEffect(() => {
    console.log('[SpominČ] Component mounted');
    return () => console.log('[SpominČ] Component unmounted');
  }, []);

  // Detect touch device once on mount
  useEffect(() => {
    const checkDevice = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const smallerDimension = Math.min(window.screen.width, window.screen.height);
      const isSmallScreen = smallerDimension <= 900;
      const result = hasTouch && isSmallScreen;
      console.log('[SpominČ] Device check:', { hasTouch, smallerDimension, isSmallScreen, isTouchDevice: result });
      setIsTouchDevice(result);
    };
    checkDevice();
  }, []);

  // Reliable orientation detection using screen.orientation
  useEffect(() => {
    const checkOrientation = () => {
      if (window.screen.orientation) {
        setIsPortrait(window.screen.orientation.type.includes('portrait'));
      } else {
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

  // NEW: Timing buffer - wait 100ms before attempting fullscreen/lock
  useEffect(() => {
    console.log('[SpominČ] Setting up isReady timer...');
    const timer = setTimeout(() => {
      console.log('[SpominČ] isReady = true (after 100ms buffer)');
      setIsReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Fullscreen and orientation lock - NOW WAITS FOR isReady
  useEffect(() => {
    console.log('[SpominČ] Fullscreen effect check:', { effectiveFullscreen, isReady });
    
    if (effectiveFullscreen && isReady) {
      console.log('[SpominČ] Attempting fullscreen and landscape lock...');
      
      const requestFullscreen = async () => {
        try {
          if (document.documentElement.requestFullscreen) {
            console.log('[SpominČ] Calling requestFullscreen()...');
            await document.documentElement.requestFullscreen();
            console.log('[SpominČ] requestFullscreen() SUCCESS');
          } else {
            console.log('[SpominČ] requestFullscreen not available');
          }
        } catch (error) {
          console.log('[SpominČ] requestFullscreen() FAILED:', error);
        }
      };

      const lockLandscape = async () => {
        try {
          if (screen.orientation && 'lock' in screen.orientation) {
            console.log('[SpominČ] Calling screen.orientation.lock()...');
            try {
              await (screen.orientation as any).lock('landscape-primary');
              console.log('[SpominČ] orientation.lock(landscape-primary) SUCCESS');
            } catch {
              await (screen.orientation as any).lock('landscape');
              console.log('[SpominČ] orientation.lock(landscape) SUCCESS (fallback)');
            }
          } else {
            console.log('[SpominČ] screen.orientation.lock not available');
          }
        } catch (error) {
          console.log('[SpominČ] orientation.lock() FAILED:', error);
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
  }, [effectiveFullscreen, isReady]);

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

  // Mobile fullscreen version - DIRECT entry like LabirintC (no "Začni igro" overlay)
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
                  <Button 
                    variant="outline" 
                    className="mt-4" 
                    onClick={() => window.location.reload()}
                  >
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

  // Desktop version - unchanged
  return (
    <div className="min-h-screen relative">
      {/* Background image layer */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${backgroundImageUrl}')` }}
      />
      
      <div className="relative z-10 container max-w-5xl mx-auto pt-4 pb-20 px-2 sm:px-4">
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
                <div className="mt-8">
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
};

export default SpominČ;
