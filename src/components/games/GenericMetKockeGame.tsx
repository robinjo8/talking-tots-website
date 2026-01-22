import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Dices } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MemoryExitConfirmationDialog } from '@/components/games/MemoryExitConfirmationDialog';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { InstructionsModal } from '@/components/puzzle/InstructionsModal';
import { ProgressModal } from '@/components/wheel/ProgressModal';
import { DiceRoller } from '@/components/dice/DiceRoller';
import { DiceResultDialog } from '@/components/dice/DiceResultDialog';
import { useMetKocke } from '@/hooks/useMetKocke';
import { MetKockeWord } from '@/data/metKockeConfig';
import { useWordProgress } from '@/hooks/useWordProgress';

interface GenericMetKockeGameProps {
  letter: string;
  displayLetter: string;
  title: string;
  bitje: MetKockeWord[];
  povedek: MetKockeWord[];
  predmet: MetKockeWord[];
  backPath?: string;
}

const SUPABASE_URL = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public";

// Dice face SVG icons
const DiceFace = ({ number }: { number: number }) => {
  const dotPositions: Record<number, [number, number][]> = {
    1: [[50, 50]],
    2: [[25, 25], [75, 75]],
    3: [[25, 25], [50, 50], [75, 75]],
    4: [[25, 25], [75, 25], [25, 75], [75, 75]],
    5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
    6: [[25, 25], [75, 25], [25, 50], [75, 50], [25, 75], [75, 75]],
  };

  return (
    <svg viewBox="0 0 100 100" className="w-10 h-10">
      <rect x="5" y="5" width="90" height="90" rx="10" fill="white" stroke="#374151" strokeWidth="3" />
      {dotPositions[number]?.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="8" fill="#374151" />
      ))}
    </svg>
  );
};

export function GenericMetKockeGame({
  letter,
  displayLetter,
  title,
  bitje,
  povedek,
  predmet,
  backPath = '/govorne-igre/met-kocke',
}: GenericMetKockeGameProps) {
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Dialog states
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showNewGameDialog, setShowNewGameDialog] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showProgress, setShowProgress] = useState(false);

  // Progress tracking
  const wordsList = bitje.map(b => b.word);
  const wordsData = bitje; // For ProgressModal which expects WordData[]
  const { 
    progress, 
    incrementProgress, 
    resetProgress,
  } = useWordProgress(displayLetter, wordsList);

  // Audio playback
  const playAudio = useCallback((url: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    audioRef.current = new Audio(url);
    audioRef.current.play().catch(console.error);
  }, []);

  // Game logic hook
  const {
    currentStep,
    selectedBitje,
    selectedPovedek,
    selectedPredmet,
    showDice,
    showResult,
    isRolling,
    completedRounds,
    startRoll,
    handleRollComplete,
    closeResult,
    resetGame,
    handleRecordComplete: hookRecordComplete,
  } = useMetKocke({
    bitje,
    povedek,
    predmet,
    onPlayAudio: playAudio,
  });

  // Handle record completion
  const handleRecordComplete = useCallback(() => {
    hookRecordComplete();
    if (selectedBitje !== null) {
      incrementProgress(bitje[selectedBitje].word);
    }
  }, [hookRecordComplete, selectedBitje, bitje, incrementProgress]);

  // Navigation handlers
  const handleBack = useCallback(() => setShowExitDialog(true), []);
  const handleConfirmExit = useCallback(() => navigate(backPath), [navigate, backPath]);
  const handleNewGame = useCallback(() => setShowNewGameDialog(true), []);
  const handleConfirmNewGame = useCallback(() => {
    resetGame();
    resetProgress();
    setShowNewGameDialog(false);
  }, [resetGame, resetProgress]);

  // Column headers
  const columns = ['BITJE', 'POVEDEK', 'PREDMET'];

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url(${SUPABASE_URL}/ozadja/zeleno_ozadje.webp)`,
      }}
    >
      {/* Header */}
      <div className="absolute top-4 left-0 right-0 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
          {title}
        </h1>
      </div>

      {/* Main grid content */}
      <div className="pt-20 pb-24 px-4 flex items-center justify-center min-h-screen">
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-4 md:p-6 max-w-4xl w-full">
          {/* Grid header */}
          <div className="grid grid-cols-4 gap-2 mb-2">
            <div className="text-center font-bold text-muted-foreground text-sm">KOCKA</div>
            {columns.map((col) => (
              <div key={col} className="text-center font-bold text-foreground text-sm md:text-base">
                {col}
              </div>
            ))}
          </div>

          {/* Grid rows */}
          <div className="space-y-2">
            {[1, 2, 3, 4, 5, 6].map((rowNum) => {
              const index = rowNum - 1;
              const bitjeItem = bitje[index];
              const povedekItem = povedek[index];
              const predmetItem = predmet[index];
              
              const isBitjeSelected = selectedBitje === index;
              const isPovedekSelected = selectedPovedek === index;
              const isPredmetSelected = selectedPredmet === index;

              return (
                <div key={rowNum} className="grid grid-cols-4 gap-2 items-center">
                  {/* Dice column */}
                  <div className="flex justify-center">
                    <DiceFace number={rowNum} />
                  </div>
                  
                  {/* BITJE column */}
                  <div 
                    className={`rounded-xl p-1 transition-all duration-300 ${
                      isBitjeSelected 
                        ? 'ring-4 ring-app-orange bg-app-orange/20 scale-105' 
                        : 'bg-muted'
                    }`}
                  >
                    <div className="aspect-square rounded-lg overflow-hidden bg-background">
                      <img
                        src={`${SUPABASE_URL}/slike/${bitjeItem.image}`}
                        alt={bitjeItem.word}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                  
                  {/* POVEDEK column */}
                  <div 
                    className={`rounded-xl p-1 transition-all duration-300 ${
                      isPovedekSelected 
                        ? 'ring-4 ring-app-blue bg-app-blue/20 scale-105' 
                        : 'bg-muted'
                    }`}
                  >
                    <div className="aspect-square rounded-lg overflow-hidden bg-background">
                      <img
                        src={`${SUPABASE_URL}/slike/${povedekItem.image}`}
                        alt={povedekItem.word}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                  
                  {/* PREDMET column */}
                  <div 
                    className={`rounded-xl p-1 transition-all duration-300 ${
                      isPredmetSelected 
                        ? 'ring-4 ring-dragon-green bg-dragon-green/20 scale-105' 
                        : 'bg-muted'
                    }`}
                  >
                    <div className="aspect-square rounded-lg overflow-hidden bg-background">
                      <img
                        src={`${SUPABASE_URL}/slike/${predmetItem.image}`}
                        alt={predmetItem.word}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Roll dice button - centered bottom */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2">
        <Button
          onClick={startRoll}
          disabled={showResult}
          className="bg-gradient-to-r from-app-orange to-app-yellow hover:opacity-90 text-white font-bold px-8 py-4 rounded-2xl text-lg shadow-lg flex items-center gap-3"
        >
          <Dices className="w-6 h-6" />
          VRZI KOCKO ({currentStep + 1}/3)
        </Button>
      </div>

      {/* Progress indicator */}
      <div className="fixed bottom-4 right-4">
        <button 
          onClick={() => setShowProgress(true)}
          className="bg-background/90 backdrop-blur rounded-full px-4 py-2 shadow-lg flex items-center gap-2"
        >
          <span className="text-2xl">⭐</span>
          <span className="font-bold text-foreground">{completedRounds}</span>
        </button>
      </div>

      {/* Home menu button - bottom left */}
      <div className="fixed bottom-4 left-4 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="w-14 h-14 rounded-full bg-gradient-to-br from-app-orange to-app-yellow shadow-lg hover:scale-105 transition-transform"
            >
              <Home className="w-7 h-7 text-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="start" 
            side="top" 
            className="mb-2 bg-background rounded-xl shadow-xl border-2 border-border"
          >
            <DropdownMenuItem 
              onClick={handleBack}
              className="text-lg py-3 px-4 cursor-pointer hover:bg-muted"
            >
              🏠 Nazaj
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleNewGame}
              className="text-lg py-3 px-4 cursor-pointer hover:bg-muted"
            >
              🔄 Nova igra
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setShowInstructions(true)}
              className="text-lg py-3 px-4 cursor-pointer hover:bg-muted"
            >
              📖 Navodila
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Dice roller modal */}
      <DiceRoller
        isVisible={showDice}
        isRolling={isRolling}
        onRollComplete={handleRollComplete}
        onClose={() => {}}
      />

      {/* Result dialog */}
      <DiceResultDialog
        isOpen={showResult}
        onClose={closeResult}
        bitjeWord={selectedBitje !== null ? bitje[selectedBitje] : null}
        povedekWord={selectedPovedek !== null ? povedek[selectedPovedek] : null}
        predmetWord={selectedPredmet !== null ? predmet[selectedPredmet] : null}
        onRecordComplete={handleRecordComplete}
      />

      {/* Exit confirmation dialog */}
      <MemoryExitConfirmationDialog
        open={showExitDialog}
        onOpenChange={setShowExitDialog}
        onConfirm={handleConfirmExit}
      >
        <span />
      </MemoryExitConfirmationDialog>

      {/* New game confirmation dialog */}
      <ConfirmDialog
        open={showNewGameDialog}
        onOpenChange={setShowNewGameDialog}
        onConfirm={handleConfirmNewGame}
        title="Nova igra"
        description="Ali res želiš začeti novo igro? Napredek bo izgubljen."
      />

      {/* Instructions modal */}
      <InstructionsModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
        type="dice"
      />

      {/* Progress modal */}
      <ProgressModal
        isOpen={showProgress}
        onClose={() => setShowProgress(false)}
        words={wordsData}
        progress={progress}
        letter={displayLetter}
      />
    </div>
  );
}
