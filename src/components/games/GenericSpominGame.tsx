import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MemoryGrid } from "@/components/games/MemoryGrid";
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
  const [isLandscape, setIsLandscape] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  // Detect landscape mode for mobile
  useEffect(() => {
    const checkOrientation = () => {
      const isMobileDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      if (isMobileDevice) {
        setIsLandscape(window.innerWidth > window.innerHeight);
      }
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', () => {
      setTimeout(checkOrientation, 100);
    });

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

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

  return (
    <div className={`min-h-screen ${isLandscape ? 'fixed inset-0 overflow-hidden' : ''}`}>
      {/* Background - Green background like other games */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/ozadja/zeleno_ozadje.png)`
        }}
      />
      
      {/* Game content */}
      <div className={`relative z-10 ${isLandscape ? 'h-full' : 'min-h-screen p-4'}`}>
        {/* Header - only show in portrait mode */}
        {!isLandscape && (
          <div className="text-center mb-4 pt-4">
            <h1 className="text-2xl font-bold text-white drop-shadow-lg">
              Spomin - Črka {displayLetter}
            </h1>
            <p className="text-white/80 mt-2">
              Najdenih parov: {matchedPairs.length} / {totalPairs}
            </p>
          </div>
        )}

        {/* Memory grid */}
        <div className={isLandscape ? 'h-full' : 'max-w-4xl mx-auto'}>
          <MemoryGrid
            cards={cards}
            onCardClick={flipCard}
            isCheckingMatch={isCheckingMatch}
            isLandscape={isLandscape}
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
