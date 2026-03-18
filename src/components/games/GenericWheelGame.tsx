// Generic Fortune Wheel game component for ArtikulacijaVaje
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import { LipsImageButton } from "@/components/games/LipsImageButton";
import { FortuneWheel } from "@/components/wheel/FortuneWheel";
import { useFortuneWheel } from "@/hooks/useFortuneWheel";
import { useTrophyContext } from "@/contexts/TrophyContext";
import { useEnhancedProgress } from "@/hooks/useEnhancedProgress";
import { WheelSuccessDialog } from "@/components/wheel/WheelSuccessDialog";
import { InstructionsModal } from "@/components/puzzle/InstructionsModal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { MemoryExitConfirmationDialog } from "@/components/games/MemoryExitConfirmationDialog";
import { MemoryProgressIndicator } from "@/components/games/MemoryProgressIndicator";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { WordData } from "@/data/artikulacijaVajeConfig";
import { useGameMode } from "@/contexts/GameModeContext";

interface GenericWheelGameProps {
  letter: string;
  displayLetter: string;
  title: string;
  wordsData: WordData[];
  backPath?: string;
  lipsImage?: string;
}

export function GenericWheelGame({ letter, displayLetter, title, wordsData, backPath = '/govorno-jezikovne-vaje/artikulacija', lipsImage }: GenericWheelGameProps) {
  const navigate = useNavigate();
  const [showInstructions, setShowInstructions] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [showNewGameConfirmation, setShowNewGameConfirmation] = useState(false);
  const [showBravoDialog, setShowBravoDialog] = useState(false);
  const [showBravoExitConfirm, setShowBravoExitConfirm] = useState(false);
  const [starClaimed, setStarClaimed] = useState(false);
  const [totalRepetitions, setTotalRepetitions] = useState(0);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Track window size for dynamic scaling
  useEffect(() => {
    const updateSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Calculate max wheel size to physically fit viewport (like Labirint approach)
  const wheelMaxSize = useMemo(() => {
    if (windowSize.height === 0 || windowSize.width === 0) return 500;
    const reservedVertical = 160; // title + progress bar + padding
    const availableHeight = windowSize.height - reservedVertical;
    const availableWidth = windowSize.width * 0.7;
    return Math.max(200, Math.min(availableWidth, availableHeight, 500));
  }, [windowSize.height, windowSize.width]);
  const [menuOpen, setMenuOpen] = useState(false);

  const { isSpinning, rotation, selectedWord, selectedIndex, showResult, spinWheel, resetWheel, closeResult } = useFortuneWheel({ wordsData });
  const { checkForNewTrophy } = useTrophyContext();
  const { recordExerciseCompletion } = useEnhancedProgress();

  const handleBack = () => { setMenuOpen(false); setShowExitConfirmation(true); };
  const handleConfirmExit = () => { navigate(backPath); };
  const handleNewGame = () => { setMenuOpen(false); setShowNewGameConfirmation(true); };
  const handleConfirmNewGame = () => { resetWheel(); setTotalRepetitions(0); setShowNewGameConfirmation(false); };
  const handleInstructions = () => { setMenuOpen(false); setShowInstructions(true); };
  
  const handleRecordComplete = () => {
    const newCount = totalRepetitions + 1;
    setTotalRepetitions(newCount);
    if (newCount >= 10) {
      // Small delay to let the success dialog close first
      setTimeout(() => {
        setShowBravoDialog(true);
      }, 700);
    }
  };

  const handleStarClaimed = async () => {
    setStarClaimed(true);
    recordExerciseCompletion(`kolo-besed-${letter}`);
    setTimeout(() => {
      setShowBravoDialog(false);
      setStarClaimed(false);
      setTotalRepetitions(0);
    }, 1500);
    await new Promise(resolve => setTimeout(resolve, 500));
    await checkForNewTrophy();
  };

  const handleBravoClose = () => {
    if (!starClaimed) {
      setShowBravoExitConfirm(true);
    } else {
      setShowBravoDialog(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 overflow-hidden select-none game-container" 
      style={{ 
        backgroundImage: 'url(https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/ozadja/zeleno_ozadje.webp)', 
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        backgroundRepeat: 'no-repeat' 
      }}
    >
      <div className="h-full flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 md:mb-4 text-center drop-shadow-lg">
          {title}
        </h1>
        <MemoryProgressIndicator matchedPairs={totalRepetitions} totalPairs={10} className="mb-4" />
        <div style={{ width: wheelMaxSize, maxWidth: '100%' }}>
          <FortuneWheel
            segmentCount={wordsData.length} 
            rotation={rotation} 
            isSpinning={isSpinning} 
            onSpin={spinWheel} 
            selectedIndex={selectedIndex} 
          />
        </div>
      </div>

      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <button className="fixed bottom-4 left-4 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg border-2 border-white/50 backdrop-blur-sm hover:scale-105 transition-transform">
            <Home className="w-8 h-8 text-white" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="ml-4 w-56 p-2 bg-white/95 border-2 border-orange-200 shadow-xl" align="start" side="top" sideOffset={8}>
          <button onClick={handleBack} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-orange-50 rounded-lg transition-colors">
            <span className="text-xl">🏠</span><span className="font-medium">Nazaj</span>
          </button>
          <button onClick={handleNewGame} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-orange-50 rounded-lg transition-colors">
            <span className="text-xl">🔄</span><span className="font-medium">Nova igra</span>
          </button>
          <button onClick={handleInstructions} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-orange-50 rounded-lg transition-colors">
            <span className="text-xl">📖</span><span className="font-medium">Navodila</span>
          </button>
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedWord && (
        <WheelSuccessDialog 
          isOpen={showResult} 
          onOpenChange={(open) => { if (!open) closeResult(); }} 
          completedImage={{ filename: selectedWord.image, word: selectedWord.word, audio: selectedWord.audio }} 
          onRecordComplete={handleRecordComplete} 
        />
      )}

      {/* BRAVO dialog */}
      <Dialog open={showBravoDialog} onOpenChange={handleBravoClose}>
        <DialogContent 
          className="sm:max-w-md" 
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <div className="space-y-6 py-6 flex flex-col items-center">
            <h1 className="text-5xl font-bold text-dragon-green text-center">
              BRAVO!
            </h1>
            <img
              src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_11.webp"
              alt="Zmajček"
              className="w-48 h-48 object-contain"
            />
            <Button
              onClick={handleStarClaimed}
              disabled={starClaimed}
              className="bg-yellow-500 hover:bg-yellow-600 text-white gap-2 px-8 text-lg"
            >
              ⭐ VZEMI ZVEZDICO
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={showBravoExitConfirm}
        onOpenChange={setShowBravoExitConfirm}
        title="OPOZORILO"
        description="ALI RES ŽELIŠ ZAPRETI OKNO? NE BOŠ PREJEL ZVEZDICE."
        confirmText="DA"
        cancelText="NE"
        onConfirm={() => {
          setShowBravoExitConfirm(false);
          setShowBravoDialog(false);
          setTotalRepetitions(0);
        }}
        onCancel={() => setShowBravoExitConfirm(false)}
      />
      
      <InstructionsModal 
        isOpen={showInstructions} 
        onClose={() => setShowInstructions(false)} 
        type="wheel" 
      />
      
      <MemoryExitConfirmationDialog 
        open={showExitConfirmation} 
        onOpenChange={setShowExitConfirmation} 
        onConfirm={handleConfirmExit}
      >
        <div />
      </MemoryExitConfirmationDialog>
      
      <ConfirmDialog 
        open={showNewGameConfirmation} 
        onOpenChange={setShowNewGameConfirmation} 
        title="OPOZORILO" 
        description="ALI RES ŽELIŠ ZAČETI NOVO IGRO?" 
        confirmText="DA" 
        cancelText="NE" 
        onConfirm={handleConfirmNewGame} 
        onCancel={() => setShowNewGameConfirmation(false)} 
      />

      {lipsImage && <LipsImageButton lipsImage={lipsImage} />}
    </div>
  );
}
