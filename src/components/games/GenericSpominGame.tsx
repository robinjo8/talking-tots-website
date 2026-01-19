import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MemoryGrid } from "@/components/games/MemoryGrid";
import { MemoryProgressIndicator } from "@/components/games/MemoryProgressIndicator";
import { MemoryPairDialog } from "@/components/games/MemoryPairDialog";
import { useGenericMemoryGame } from "@/hooks/useGenericMemoryGame";
import { SpominConfig } from "@/data/spominConfig";
import { MemoryExitConfirmationDialog } from "@/components/games/MemoryExitConfirmationDialog";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { Loader, Home } from "lucide-react";

interface GenericSpominGameProps {
  config: SpominConfig;
}

export function GenericSpominGame({ config }: GenericSpominGameProps) {
  const navigate = useNavigate();
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Mobile detection and orientation state
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  
  const effectiveFullscreen = isTouchDevice;

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
    handlePairUnmatch,
    displayLetter
  } = useGenericMemoryGame(config);

  // Reliable touch device detection
  useEffect(() => {
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = Math.min(window.screen.width, window.screen.height) <= 900;
    setIsTouchDevice(hasTouch && isSmallScreen);
  }, []);

  // Reliable orientation detection
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

  // Automatic fullscreen and landscape lock
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

  const handleBack = () => {
    setMenuOpen(false);
    setShowExitConfirmation(true);
  };

  const handleConfirmExit = () => {
    setShowExitConfirmation(false);
    navigate("/govorne-igre/spomin");
  };

  const handleNewGame = () => {
    setMenuOpen(false);
    resetGame();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dragon-green/20 to-app-blue/20">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-dragon-green mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Nalagam igro...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 to-red-200">
        <div className="text-center p-6 bg-white rounded-xl shadow-lg">
          <p className="text-lg text-red-600 mb-4">Napaka pri nalaganju igre</p>
          <button 
            onClick={() => navigate("/govorne-igre/spomin")}
            className="px-4 py-2 bg-dragon-green text-white rounded-lg hover:bg-dragon-green/90"
          >
            Nazaj na izbiro
          </button>
        </div>
      </div>
    );
  }

  const backgroundImageUrl = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/ozadja/zeleno_ozadje.png';

  // Mobile fullscreen version
  if (effectiveFullscreen) {
    return (
      <div className="fixed inset-0 overflow-hidden select-none">
        <div 
          className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${backgroundImageUrl}')` }}
        />
        
        <div className="relative z-10 flex-1 flex items-center justify-center overflow-hidden h-full w-full p-2">
          {!isPortrait ? (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <MemoryGrid
                cards={cards}
                onCardClick={flipCard}
                isCheckingMatch={isCheckingMatch}
                isLandscape={true}
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center px-6 text-center">
              <p className="text-base font-semibold text-foreground">
                Za igranje igre Spomin prosim obrni telefon v ležeči položaj.
              </p>
            </div>
          )}
        </div>

        {/* Floating menu button */}
        <div className="fixed bottom-4 left-4 z-50 flex items-center gap-3">
          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger asChild>
              <button className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg border-2 border-white/50 backdrop-blur-sm hover:scale-105 transition-transform">
                <Home className="w-8 h-8 text-white" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="start" 
              side="top"
              sideOffset={8}
              className="ml-4 w-56 p-2 bg-white/95 border-2 border-orange-200 shadow-xl"
            >
              <button
                onClick={handleBack}
                className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100"
              >
                <span className="text-2xl">🏠</span>
                <span>Nazaj</span>
              </button>
              <button
                onClick={handleNewGame}
                className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100"
              >
                <span className="text-2xl">🔄</span>
                <span>Nova igra</span>
              </button>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium"
              >
                <span className="text-2xl">📖</span>
                <span>Navodila</span>
              </button>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Pair dialog */}
        <MemoryPairDialog
          isOpen={showPairDialog}
          onClose={() => {}}
          onContinue={handlePairDialogContinue}
          onUnmatch={handlePairUnmatch}
          pairNumber={matchedPairs.length}
          totalPairs={totalPairs}
          imageUrl={currentMatchedPair?.image_url || null}
          word={currentMatchedPair?.word || null}
          audioUrl={currentMatchedPair?.audio_url || null}
        />

        {/* Exit confirmation dialog */}
        <MemoryExitConfirmationDialog
          open={showExitConfirmation}
          onOpenChange={setShowExitConfirmation}
          onConfirm={handleConfirmExit}
        >
          <></>
        </MemoryExitConfirmationDialog>

        {/* Game completed overlay */}
        {gameCompleted && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 text-center max-w-sm mx-4">
              <h2 className="text-3xl font-bold text-dragon-green mb-4">
                🎉 Čestitke! 🎉
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Uspešno si zaključil igro spomina za črko {displayLetter}!
              </p>
              <div className="space-y-3">
                <button
                  onClick={resetGame}
                  className="w-full px-6 py-3 bg-dragon-green text-white rounded-xl font-semibold hover:bg-dragon-green/90 transition-colors"
                >
                  🔄 Igraj znova
                </button>
                <button
                  onClick={() => navigate("/govorne-igre/spomin")}
                  className="w-full px-6 py-3 bg-app-orange text-white rounded-xl font-semibold hover:bg-app-orange/90 transition-colors"
                >
                  🏠 Nazaj na izbiro
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop version
  return (
    <div className="min-h-screen">
      {/* Background - Green background like other games */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundImageUrl})`
        }}
      />
      
      {/* Game content */}
      <div className="relative z-10 min-h-screen p-4">
        {/* Header with progress dots */}
        <div className="text-center pt-4">
          <h1 className="text-2xl font-bold text-white drop-shadow-lg">
            Spomin - Črka {displayLetter}
          </h1>
          <MemoryProgressIndicator 
            matchedPairs={matchedPairs.length} 
            totalPairs={totalPairs} 
          />
        </div>

        {/* Memory grid */}
        <div className="max-w-4xl mx-auto">
          <MemoryGrid
            cards={cards}
            onCardClick={flipCard}
            isCheckingMatch={isCheckingMatch}
            isLandscape={false}
          />
        </div>

        {/* Game menu button - same pattern as other games */}
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <button className="fixed bottom-4 left-4 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg border-2 border-white/50 backdrop-blur-sm hover:scale-105 transition-transform">
              <Home className="w-8 h-8 text-white" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="start" 
            side="top"
            sideOffset={8}
            className="ml-4 w-56 p-2 bg-white/95 border-2 border-orange-200 shadow-xl"
          >
            <button
              onClick={handleBack}
              className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100"
            >
              <span className="text-xl">🏠</span>
              <span>Nazaj</span>
            </button>
            <button
              onClick={handleNewGame}
              className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100"
            >
              <span className="text-xl">🔄</span>
              <span>Nova igra</span>
            </button>
            <button
              onClick={() => setMenuOpen(false)}
              className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium"
            >
              <span className="text-xl">📖</span>
              <span>Navodila</span>
            </button>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Pair dialog */}
        <MemoryPairDialog
          isOpen={showPairDialog}
          onClose={() => {}}
          onContinue={handlePairDialogContinue}
          onUnmatch={handlePairUnmatch}
          pairNumber={matchedPairs.length}
          totalPairs={totalPairs}
          imageUrl={currentMatchedPair?.image_url || null}
          word={currentMatchedPair?.word || null}
          audioUrl={currentMatchedPair?.audio_url || null}
        />

        {/* Exit confirmation dialog */}
        <MemoryExitConfirmationDialog
          open={showExitConfirmation}
          onOpenChange={setShowExitConfirmation}
          onConfirm={handleConfirmExit}
        >
          <></>
        </MemoryExitConfirmationDialog>

        {/* Game completed overlay */}
        {gameCompleted && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 text-center max-w-sm mx-4">
              <h2 className="text-3xl font-bold text-dragon-green mb-4">
                🎉 Čestitke! 🎉
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Uspešno si zaključil igro spomina za črko {displayLetter}!
              </p>
              <div className="space-y-3">
                <button
                  onClick={resetGame}
                  className="w-full px-6 py-3 bg-dragon-green text-white rounded-xl font-semibold hover:bg-dragon-green/90 transition-colors"
                >
                  🔄 Igraj znova
                </button>
                <button
                  onClick={() => navigate("/govorne-igre/spomin")}
                  className="w-full px-6 py-3 bg-app-orange text-white rounded-xl font-semibold hover:bg-app-orange/90 transition-colors"
                >
                  🏠 Nazaj na izbiro
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
