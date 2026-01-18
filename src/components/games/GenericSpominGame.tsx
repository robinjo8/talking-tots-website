// Generic Spomin (Memory) Game Component
// Renders a memory game based on the provided configuration

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MemoryGrid } from "@/components/games/MemoryGrid";
import { MemoryPairDialog } from "@/components/games/MemoryPairDialog";
import { MemoryProgressIndicator } from "@/components/games/MemoryProgressIndicator";
import { MemoryExitConfirmationDialog } from "@/components/games/MemoryExitConfirmationDialog";
import { HomeMenuButton } from "@/components/games/HomeMenuButton";
import { useGenericMemoryGame } from "@/hooks/useGenericMemoryGame";
import { useIsMobile } from "@/hooks/use-mobile";
import { SpominGameConfig } from "@/data/spominConfig";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface GenericSpominGameProps {
  config: SpominGameConfig;
}

const SUPABASE_URL = "https://ecmtctwovkheohqwahvt.supabase.co";
const backgroundImageUrl = `${SUPABASE_URL}/storage/v1/object/public/ozadja/ozadje_1.jpg`;

export function GenericSpominGame({ config }: GenericSpominGameProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
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

  const [showMenu, setShowMenu] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);

  // Detect landscape orientation for mobile
  const [isLandscape, setIsLandscape] = useState(
    typeof window !== 'undefined' && window.innerWidth > window.innerHeight
  );

  // Handle orientation changes
  useState(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', () => setTimeout(handleResize, 100));
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  });

  const handleNewGame = () => {
    resetGame();
    setShowMenu(false);
  };

  const handleBack = () => {
    setShowExitDialog(true);
    setShowMenu(false);
  };

  const handleConfirmExit = () => {
    navigate("/govorne-igre/spomin");
  };

  const handleShowInstructions = () => {
    setShowInstructions(true);
    setShowMenu(false);
  };

  // Show completion dialog when game is completed
  if (gameCompleted && !showCompletionDialog && !showPairDialog) {
    setShowCompletionDialog(true);
  }

  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: `url(${backgroundImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="text-white text-xl">Nalagam igro...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: `url(${backgroundImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="text-white text-xl">Napaka pri nalaganju igre</div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen w-full flex flex-col"
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Progress indicator - hidden in mobile landscape */}
      {!isLandscape && (
        <div className="py-2 md:py-4">
          <MemoryProgressIndicator 
            matchedPairs={matchedPairs.length} 
            totalPairs={totalPairs} 
          />
        </div>
      )}

      {/* Main game area */}
      <div className={`flex-1 ${isLandscape ? 'px-2' : 'px-4'} ${isLandscape ? 'pb-2' : 'pb-20'} flex items-center justify-center`}>
        <MemoryGrid 
          cards={cards} 
          onCardClick={flipCard} 
          isCheckingMatch={isCheckingMatch}
          isLandscape={isMobile && isLandscape}
        />
      </div>

      {/* Floating menu button */}
      <div className="fixed bottom-4 left-4 z-50">
        <DropdownMenu open={showMenu} onOpenChange={setShowMenu}>
          <DropdownMenuTrigger asChild>
            <div>
              <HomeMenuButton onClick={() => setShowMenu(!showMenu)} />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            side="top" 
            align="start" 
            className="mb-2 bg-white/95 backdrop-blur-sm"
          >
            <DropdownMenuItem 
              onClick={handleBack}
              className="text-base py-3 cursor-pointer"
            >
              🏠 Nazaj
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleNewGame}
              className="text-base py-3 cursor-pointer"
            >
              🔄 Nova igra
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleShowInstructions}
              className="text-base py-3 cursor-pointer"
            >
              📖 Navodila
            </DropdownMenuItem>
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
        open={showExitDialog}
        onOpenChange={setShowExitDialog}
        onConfirm={handleConfirmExit}
      >
        <span />
      </MemoryExitConfirmationDialog>

      {/* Instructions dialog */}
      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-dragon-green">
              Navodila - Črka {config.letter}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-center space-y-4 py-4">
            <p className="text-base text-foreground">
              Poišči pare enakih slik in nato ponovi besedo, ki jo vidiš.
            </p>
            <div className="flex justify-center">
              <img 
                src={config.dragonImage} 
                alt={`Zmajček ${config.letter}`}
                className="w-24 h-24 object-contain"
              />
            </div>
            <ol className="text-left text-sm space-y-2 text-muted-foreground">
              <li>1. Klikni na kartici, da jih obrneš</li>
              <li>2. Poišči par enakih slik</li>
              <li>3. Ko najdeš par, klikni na sliko in ponovi besedo</li>
              <li>4. Zberi vse pare za zvezdico!</li>
            </ol>
          </DialogDescription>
          <Button 
            onClick={() => setShowInstructions(false)}
            className="w-full bg-dragon-green hover:bg-dragon-green/90"
          >
            Razumem
          </Button>
        </DialogContent>
      </Dialog>

      {/* Game completion dialog */}
      <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-dragon-green">
              🎉 Čestitke! 🎉
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-center space-y-4 py-4">
            <p className="text-lg text-foreground">
              Uspešno si končal igro s črko {config.letter}!
            </p>
            <div className="flex justify-center">
              <img 
                src={config.dragonImage} 
                alt={`Zmajček ${config.letter}`}
                className="w-32 h-32 object-contain animate-bounce"
              />
            </div>
            <p className="text-base text-muted-foreground">
              Prejel si zvezdico! ⭐
            </p>
          </DialogDescription>
          <div className="flex gap-3">
            <Button 
              onClick={() => {
                setShowCompletionDialog(false);
                handleNewGame();
              }}
              variant="outline"
              className="flex-1"
            >
              🔄 Nova igra
            </Button>
            <Button 
              onClick={() => {
                setShowCompletionDialog(false);
                navigate("/govorne-igre/spomin");
              }}
              className="flex-1 bg-dragon-green hover:bg-dragon-green/90"
            >
              🏠 Nazaj
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
