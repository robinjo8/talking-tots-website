// Generic Fortune Wheel game component for ArtikulacijaVaje
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, HelpCircle, RefreshCw } from "lucide-react";
import { FortuneWheel } from "@/components/wheel/FortuneWheel";
import { useFortuneWheel } from "@/hooks/useFortuneWheel";
import { useWordProgress } from "@/hooks/useWordProgress";
import { useTrophyContext } from "@/contexts/TrophyContext";
import { WheelSuccessDialog } from "@/components/wheel/WheelSuccessDialog";
import { ProgressModal } from "@/components/wheel/ProgressModal";
import { InstructionsModal } from "@/components/puzzle/InstructionsModal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { MemoryExitConfirmationDialog } from "@/components/games/MemoryExitConfirmationDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { WordData } from "@/data/artikulacijaVajeConfig";

interface GenericWheelGameProps {
  letter: string;
  displayLetter: string;
  title: string;
  wordsData: WordData[];
  backPath?: string;
}

export function GenericWheelGame({ letter, displayLetter, title, wordsData, backPath = '/govorno-jezikovne-vaje/artikulacija' }: GenericWheelGameProps) {
  const navigate = useNavigate();
  const [showInstructions, setShowInstructions] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [showNewGameConfirmation, setShowNewGameConfirmation] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNewGameButton, setShowNewGameButton] = useState(false);

  const wordsList = wordsData.map(w => w.word);
  
  const { isSpinning, rotation, selectedWord, selectedIndex, showResult, spinWheel, resetWheel, closeResult } = useFortuneWheel({ wordsData });
  const { progress, incrementProgress, getProgress, resetProgress, resetWordProgress } = useWordProgress(displayLetter, wordsList);
  const { checkForNewTrophy } = useTrophyContext();

  const handleBack = () => { setMenuOpen(false); setShowExitConfirmation(true); };
  const handleConfirmExit = () => { navigate(backPath); };
  const handleNewGame = () => { setMenuOpen(false); setShowNewGameConfirmation(true); };
  const handleConfirmNewGame = () => { resetWheel(); resetProgress(); setShowNewGameConfirmation(false); setShowNewGameButton(false); };
  const handleNewGameDirect = () => { resetWheel(); resetProgress(); setShowNewGameButton(false); };
  const handleInstructions = () => { setMenuOpen(false); setShowInstructions(true); };
  const handleRecordComplete = () => { if (selectedWord) incrementProgress(selectedWord.word); };
  const handleStarClaimed = async () => { 
    if (selectedWord) resetWordProgress(selectedWord.word); 
    closeResult(); 
    setShowNewGameButton(true);
    // Check for trophy after claiming star
    await new Promise(resolve => setTimeout(resolve, 500));
    await checkForNewTrophy();
  };

  const currentWordProgress = selectedWord ? getProgress(selectedWord.word) : 0;

  return (
    <div 
      className="fixed inset-0 overflow-auto select-none" 
      style={{ 
        backgroundImage: 'url(https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/ozadja/zeleno_ozadje.webp)', 
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        backgroundRepeat: 'no-repeat' 
      }}
    >
      <div className="min-h-full flex flex-col items-center justify-center p-4 pb-24">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 md:mb-8 text-center drop-shadow-lg">
          {title}
        </h1>
        <FortuneWheel 
          segmentCount={wordsData.length} 
          rotation={rotation} 
          isSpinning={isSpinning} 
          onSpin={spinWheel} 
          selectedIndex={selectedIndex} 
        />
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

      {showNewGameButton && (
        <button
          onClick={handleNewGameDirect}
          className="fixed bottom-4 left-24 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 flex items-center justify-center shadow-lg border-2 border-white/50 backdrop-blur-sm hover:scale-105 transition-transform"
        >
          <RefreshCw className="h-7 w-7 text-white" />
        </button>
      )}

      <button 
        onClick={() => setShowProgressModal(true)} 
        className="fixed bottom-4 right-4 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg border-2 border-white/50 backdrop-blur-sm hover:scale-105 transition-transform"
      >
        <HelpCircle className="w-8 h-8 text-white" />
      </button>

      {selectedWord && (
        <WheelSuccessDialog 
          isOpen={showResult} 
          onOpenChange={(open) => { if (!open) closeResult(); }} 
          completedImage={{ filename: selectedWord.image, word: selectedWord.word, audio: selectedWord.audio }} 
          pronunciationCount={currentWordProgress} 
          onRecordComplete={handleRecordComplete} 
          onStarClaimed={handleStarClaimed} 
        />
      )}
      
      <ProgressModal 
        isOpen={showProgressModal} 
        onClose={() => setShowProgressModal(false)} 
        words={wordsData} 
        progress={progress} 
        letter={displayLetter} 
      />
      
      <InstructionsModal 
        isOpen={showInstructions} 
        onClose={() => setShowInstructions(false)} 
        type="articulation" 
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
        title="Nova igra" 
        description="Ali res želiš začeti novo igro? Ves napredek bo ponastavljen na začetno stanje." 
        confirmText="Da" 
        cancelText="Ne" 
        onConfirm={handleConfirmNewGame} 
        onCancel={() => setShowNewGameConfirmation(false)} 
      />
    </div>
  );
}
