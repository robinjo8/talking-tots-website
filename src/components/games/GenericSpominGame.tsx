import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MemoryGrid } from "@/components/games/MemoryGrid";
import { MemoryProgressIndicator } from "@/components/games/MemoryProgressIndicator";
import { MemoryPairDialog } from "@/components/games/MemoryPairDialog";
import { useGenericMemoryGame } from "@/hooks/useGenericMemoryGame";
import { SpominConfig } from "@/data/spominConfig";
import { MemoryExitConfirmationDialog } from "@/components/games/MemoryExitConfirmationDialog";
import { InstructionsModal } from "@/components/puzzle/InstructionsModal";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { Loader, Home, RefreshCw } from "lucide-react";
import { useGameMode, useGameNavigation } from "@/contexts/GameModeContext";

interface GenericSpominGameProps {
  config: SpominConfig;
}

export function GenericSpominGame({ config }: GenericSpominGameProps) {
  const navigate = useNavigate();
  const { getGameListPath } = useGameNavigation();
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNewGameButton, setShowNewGameButton] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  
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
    handleClaimStar,
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
    // Use GameModeContext-aware navigation
    navigate(getGameListPath('spomin'));
  };

  const handleNewGame = () => {
    setMenuOpen(false);
    setShowNewGameButton(false);
    resetGame();
  };

  const handleNewGameDirect = () => {
    setShowNewGameButton(false);
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-destructive/10 to-destructive/20">
        <div className="text-center p-6 bg-card rounded-xl shadow-lg">
          <p className="text-lg text-destructive mb-4">Napaka pri nalaganju igre</p>
          <button 
            onClick={() => navigate(getGameListPath('spomin'))}
            className="px-4 py-2 bg-dragon-green text-white rounded-lg hover:bg-dragon-green/90"
          >
            Nazaj na izbiro
          </button>
        </div>
      </div>
    );
  }

  const backgroundImageUrl = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/ozadja/zeleno_ozadje.webp';

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
                onClick={() => {
                  setMenuOpen(false);
                  setShowInstructions(true);
                }}
                className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium"
              >
                <span className="text-2xl">📖</span>
                <span>Navodila</span>
              </button>
            </DropdownMenuContent>
          </DropdownMenu>

          {showNewGameButton && (
            <button
              onClick={handleNewGameDirect}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 flex items-center justify-center shadow-lg border-2 border-white/50 backdrop-blur-sm hover:scale-105 transition-transform"
            >
              <RefreshCw className="h-7 w-7 text-white" />
            </button>
          )}
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

        {/* Game completed overlay - Bingo style */}
        {gameCompleted && !showNewGameButton && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 text-center max-w-md mx-4">
              <h1 className="text-5xl font-bold text-dragon-green mb-6">
                BRAVO!
              </h1>
              <img
                src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_11.webp"
                alt="Zmajček"
                className="w-48 h-48 object-contain mx-auto mb-6"
              />
              <button
                onClick={async () => {
                  await handleClaimStar();
                  setShowNewGameButton(true);
                }}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-8 py-3 rounded-lg text-lg transition-colors"
              >
                ⭐ VZEMI ZVEZDICO
              </button>
            </div>
          </div>
        )}

        {/* Instructions modal */}
        <InstructionsModal
          isOpen={showInstructions}
          onClose={() => setShowInstructions(false)}
          type="spomin"
        />
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
              onClick={() => {
                setMenuOpen(false);
                setShowInstructions(true);
              }}
              className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium"
            >
              <span className="text-xl">📖</span>
              <span>Navodila</span>
            </button>
          </DropdownMenuContent>
        </DropdownMenu>

        {showNewGameButton && (
          <button
            onClick={handleNewGameDirect}
            className="fixed bottom-4 left-24 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 flex items-center justify-center shadow-lg border-2 border-white/50 backdrop-blur-sm hover:scale-105 transition-transform"
          >
            <RefreshCw className="h-7 w-7 text-white" />
          </button>
        )}

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

        {/* Game completed overlay - Bingo style */}
        {gameCompleted && !showNewGameButton && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 text-center max-w-md mx-4">
              <h1 className="text-5xl font-bold text-dragon-green mb-6">
                BRAVO!
              </h1>
              <img
                src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_11.webp"
                alt="Zmajček"
                className="w-48 h-48 object-contain mx-auto mb-6"
              />
              <button
                onClick={async () => {
                  await handleClaimStar();
                  setShowNewGameButton(true);
                }}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-8 py-3 rounded-lg text-lg transition-colors"
              >
                ⭐ VZEMI ZVEZDICO
              </button>
            </div>
          </div>
        )}

        {/* Instructions modal */}
        <InstructionsModal
          isOpen={showInstructions}
          onClose={() => setShowInstructions(false)}
          type="spomin"
        />
      </div>
    </div>
  );
}
