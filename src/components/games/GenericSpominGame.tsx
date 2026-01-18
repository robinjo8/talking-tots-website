import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MemoryGrid } from "@/components/games/MemoryGrid";
import { MemoryPairDialog } from "@/components/games/MemoryPairDialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useGenericMemoryGame } from "@/hooks/useGenericMemoryGame";
import type { SpominGameConfig } from "@/data/spominConfig";

const SUPABASE_URL = "https://ecmtctwovkheohqwahvt.supabase.co";
const greenBackgroundUrl = `${SUPABASE_URL}/storage/v1/object/public/ozadja/zeleno_ozadje.png`;

interface GenericSpominGameProps {
  config: SpominGameConfig;
}

export function GenericSpominGame({ config }: GenericSpominGameProps) {
  const navigate = useNavigate();
  const gameCompletedRef = useRef(false);
  
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
  } = useGenericMemoryGame(config);

  const [menuOpen, setMenuOpen] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [showNewGameConfirmation, setShowNewGameConfirmation] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  
  // Mobile detection and orientation state
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  
  const effectiveFullscreen = isTouchDevice;

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

  // Handle game completion
  useEffect(() => {
    if (gameCompleted && !gameCompletedRef.current) {
      gameCompletedRef.current = true;
      setShowCompletion(true);
    }
  }, [gameCompleted]);

  const handleBackClick = () => {
    setMenuOpen(false);
    setShowExitConfirmation(true);
  };

  const handleConfirmExit = () => {
    setShowExitConfirmation(false);
    navigate("/govorne-igre/spomin");
  };

  const handleNewGameClick = () => {
    setMenuOpen(false);
    setShowNewGameConfirmation(true);
  };

  const handleConfirmNewGame = () => {
    setShowNewGameConfirmation(false);
    gameCompletedRef.current = false;
    resetGame();
  };

  const handleInstructionsClick = () => {
    setMenuOpen(false);
    setShowInstructions(true);
  };

  const handleCompletionClose = () => {
    setShowCompletion(false);
    navigate("/govorne-igre/spomin");
  };

  const handlePlayAgain = () => {
    setShowCompletion(false);
    gameCompletedRef.current = false;
    resetGame();
  };

  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: `url(${greenBackgroundUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="text-white text-2xl font-bold">NALAGAM...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: `url(${greenBackgroundUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="text-white text-xl">NAPAKA PRI NALAGANJU IGRE</div>
      </div>
    );
  }

  // Portrait mode warning for mobile
  if (isTouchDevice && isPortrait) {
    return (
      <div 
        className="fixed inset-0 flex flex-col items-center justify-center text-white z-50"
        style={{
          backgroundImage: `url(${greenBackgroundUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="text-6xl mb-4 animate-bounce">📱</div>
        <div className="text-2xl font-bold text-center px-8">
          OBRNI TELEFON ZA IGRANJE
        </div>
        <div className="text-lg mt-2 opacity-80">🔄 LEŽEČE</div>
      </div>
    );
  }

  return (
    <div 
      className={effectiveFullscreen ? "fixed inset-0 overflow-hidden" : "min-h-screen"}
      style={{
        backgroundImage: `url(${greenBackgroundUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Title */}
      <div className={`text-center ${effectiveFullscreen ? 'pt-2' : 'pt-8'}`}>
        <h1 className={`font-bold text-white drop-shadow-lg ${effectiveFullscreen ? 'text-2xl' : 'text-4xl md:text-5xl'}`}>
          SPOMIN - {config.letter}
        </h1>
      </div>

      {/* Game Grid */}
      <div className={`flex items-center justify-center ${effectiveFullscreen ? 'h-[calc(100vh-80px)]' : 'py-8 w-full px-4'}`}>
        <MemoryGrid 
          cards={cards}
          onCardClick={flipCard}
          isCheckingMatch={isCheckingMatch}
          isLandscape={effectiveFullscreen}
        />
      </div>

      {/* Floating Home Menu Button */}
      <div className="fixed bottom-4 left-4 z-50">
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              className="h-14 w-14 rounded-full bg-gradient-to-br from-app-orange to-app-orange/80 hover:from-app-orange/90 hover:to-app-orange/70 shadow-lg"
              size="icon"
            >
              <Home className="h-6 w-6 text-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            side="top" 
            align="start" 
            className="bg-white rounded-xl shadow-xl p-2 min-w-[180px]"
          >
            <button
              onClick={handleBackClick}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="text-xl">🏠</span>
              <span className="font-medium text-gray-700">NAZAJ</span>
            </button>
            <button
              onClick={handleNewGameClick}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="text-xl">🔄</span>
              <span className="font-medium text-gray-700">NOVA IGRA</span>
            </button>
            <button
              onClick={handleInstructionsClick}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="text-xl">📖</span>
              <span className="font-medium text-gray-700">NAVODILA</span>
            </button>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Pair Dialog */}
      <MemoryPairDialog
        isOpen={showPairDialog}
        onClose={handlePairDialogContinue}
        onContinue={handlePairDialogContinue}
        onUnmatch={handlePairUnmatch}
        pairNumber={matchedPairs.length}
        totalPairs={totalPairs}
        imageUrl={currentMatchedPair?.image_url || ""}
        audioUrl={currentMatchedPair?.audio_url || ""}
        word={currentMatchedPair?.word || ""}
      />

      {/* Exit Confirmation Dialog */}
      <ConfirmDialog
        open={showExitConfirmation}
        onOpenChange={setShowExitConfirmation}
        title="OPOZORILO"
        description="Ali res želiš prekiniti igro?"
        confirmText="DA"
        cancelText="NE"
        onConfirm={handleConfirmExit}
      />

      {/* New Game Confirmation Dialog */}
      <ConfirmDialog
        open={showNewGameConfirmation}
        onOpenChange={setShowNewGameConfirmation}
        title="NOVA IGRA"
        description="Ali si prepričan, da želiš začeti novo igro? Trenutni napredek bo izgubljen."
        confirmText="DA"
        cancelText="NE"
        onConfirm={handleConfirmNewGame}
      />

      {/* Instructions Modal */}
      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">NAVODILA - SPOMIN</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-lg">1.</span>
                <span>KLIKNI NA KARTICO, DA JO OBRNEŠ</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lg">2.</span>
                <span>POIŠČI PAR ENAKIH SLIK</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lg">3.</span>
                <span>KO NAJDEŠ PAR, PONOVI BESEDO</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lg">4.</span>
                <span>NADALJUJ, DOKLER NE NAJDEŠ VSEH PAROV</span>
              </li>
            </ul>
          </div>
          <div className="flex justify-center">
            <Button onClick={() => setShowInstructions(false)} className="bg-dragon-green hover:bg-dragon-green/90">
              RAZUMEM
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Completion Dialog */}
      <Dialog open={showCompletion} onOpenChange={setShowCompletion}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-dragon-green">
              🎉 ČESTITKE! 🎉
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <div className="text-6xl mb-4">⭐</div>
            <p className="text-lg font-medium">USPEŠNO SI NAŠEL VSE PARE!</p>
          </div>
          <div className="flex flex-col gap-3">
            <Button onClick={handlePlayAgain} className="bg-dragon-green hover:bg-dragon-green/90">
              🔄 IGRAJ ZNOVA
            </Button>
            <Button onClick={handleCompletionClose} variant="outline">
              🏠 NAZAJ NA IZBIRO
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
