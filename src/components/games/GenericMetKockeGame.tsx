import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, RefreshCw } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MemoryExitConfirmationDialog } from '@/components/games/MemoryExitConfirmationDialog';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { InstructionsModal } from '@/components/puzzle/InstructionsModal';
import { DiceRoller } from '@/components/dice/DiceRoller';
import { DiceResultDialog } from '@/components/dice/DiceResultDialog';
import { StarEarnedDialog } from '@/components/dice/StarEarnedDialog';
import { MemoryProgressIndicator } from '@/components/games/MemoryProgressIndicator';
import { useMetKocke } from '@/hooks/useMetKocke';
import { useTrophyContext } from '@/contexts/TrophyContext';
import { MetKockeWord } from '@/data/metKockeConfig';
import { useWordProgress } from '@/hooks/useWordProgress';
import { useEnhancedProgress } from '@/hooks/useEnhancedProgress';

interface GenericMetKockeGameProps {
  letter: string;
  displayLetter: string;
  title: string;
  bitje: MetKockeWord[];
  povedek: MetKockeWord[];
  predmet: MetKockeWord[];
  backPath?: string;
  onGameComplete?: () => void;
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
    <svg viewBox="0 0 100 100" className="w-full h-full">
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
  onGameComplete,
}: GenericMetKockeGameProps) {
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Dialog states
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showNewGameDialog, setShowNewGameDialog] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showNewGameButton, setShowNewGameButton] = useState(false);

  // Progress tracking
  const wordsList = bitje.map(b => b.word);
  const { 
    incrementProgress, 
    resetProgress,
  } = useWordProgress(displayLetter, wordsList);
  const { checkForNewTrophy } = useTrophyContext();
  const { recordExerciseCompletion } = useEnhancedProgress();

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
    showStarDialog,
    completedRounds,
    handleRollComplete,
    closeResult,
    resetGame,
    closeStarDialog,
  } = useMetKocke({
    bitje,
    povedek,
    predmet,
    onPlayAudio: playAudio,
  });

  // Navigation handlers
  const handleBack = useCallback(() => setShowExitDialog(true), []);
  const handleConfirmExit = useCallback(() => navigate(backPath), [navigate, backPath]);
  const handleNewGame = useCallback(() => setShowNewGameDialog(true), []);
  const handleConfirmNewGame = useCallback(() => {
    resetGame();
    resetProgress();
    setShowNewGameDialog(false);
    setShowNewGameButton(false);
  }, [resetGame, resetProgress]);

  const handleNewGameDirect = useCallback(() => {
    resetGame();
    resetProgress();
    setShowNewGameButton(false);
  }, [resetGame, resetProgress]);

  // Star claim handler
  const handleClaimStar = useCallback(async () => {
    // Record star to Supabase
    recordExerciseCompletion(`smesne-povedi-${letter}`);
    if (selectedBitje !== null) {
      incrementProgress(bitje[selectedBitje].word);
    }
    closeStarDialog();
    setShowNewGameButton(true);
    onGameComplete?.();
    // Check for trophy after claiming star
    await new Promise(resolve => setTimeout(resolve, 500));
    await checkForNewTrophy();
  }, [recordExerciseCompletion, letter, selectedBitje, bitje, incrementProgress, closeStarDialog, checkForNewTrophy, onGameComplete]);

  // Column headers
  const columns = ['OSEBEK', 'POVEDEK', 'PREDMET'];

  return (
    <div 
      className="fixed inset-0 overflow-hidden select-none"
      style={{
        backgroundImage: `url(${SUPABASE_URL}/ozadja/zeleno_ozadje.webp)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Header with progress indicator - floating style like Spomin */}
      <div className="absolute top-0 left-0 right-0 z-30 pt-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white drop-shadow-lg">
            {title}
          </h1>
          <MemoryProgressIndicator 
            matchedPairs={completedRounds % 5} 
            totalPairs={5} 
          />
        </div>
      </div>

      {/* Main content - centered */}
      <div className="h-full flex flex-col items-center justify-center p-2 pt-20">

        {/* Instruction text above table - on green background */}
        <p className="text-center font-bold text-white text-sm mb-2 drop-shadow-lg">
          3X VRŽI KOCKO IN PONOVI POVED
        </p>

        {/* Game grid - constrained height */}
        <div className="bg-white/90 backdrop-blur rounded-xl shadow-xl p-2 md:p-3 w-full" style={{ maxWidth: '600px' }}>
          
          {/* Grid header */}
          <div className="grid grid-cols-4 gap-1 mb-1">
            <div></div>
            {columns.map((col) => (
              <div key={col} className="text-center font-bold text-foreground text-[10px] md:text-xs">
                {col}
              </div>
            ))}
          </div>

          {/* Grid rows - smaller cells */}
          <div className="grid grid-rows-6 gap-0.5">
            {[1, 2, 3, 4, 5, 6].map((rowNum) => {
              const index = rowNum - 1;
              const bitjeItem = bitje[index];
              const povedekItem = povedek[index];
              const predmetItem = predmet[index];
              
              const isBitjeSelected = selectedBitje === index;
              const isPovedekSelected = selectedPovedek === index;
              const isPredmetSelected = selectedPredmet === index;

              return (
                <div key={rowNum} className="grid grid-cols-4 gap-1 items-center">
                  {/* Dice column */}
                  <div className="flex justify-center">
                    <div className="w-16 h-16">
                      <DiceFace number={rowNum} />
                    </div>
                  </div>
                  
                  {/* BITJE column */}
                  <div className="flex justify-center">
                    <div 
                      className={`aspect-square rounded overflow-hidden bg-background transition-all duration-300 ${
                        isBitjeSelected 
                          ? 'ring-2 ring-app-orange scale-105' 
                          : ''
                      }`}
                      style={{ maxHeight: 'calc((100vh - 200px) / 7)', maxWidth: 'calc((100vh - 200px) / 7)' }}
                    >
                      <img
                        src={`${SUPABASE_URL}/slike/${bitjeItem.image}`}
                        alt={bitjeItem.word}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                  
                  {/* POVEDEK column */}
                  <div className="flex justify-center">
                    <div 
                      className={`aspect-square rounded overflow-hidden bg-background transition-all duration-300 ${
                        isPovedekSelected 
                          ? 'ring-2 ring-app-blue scale-105' 
                          : ''
                      }`}
                      style={{ maxHeight: 'calc((100vh - 200px) / 7)', maxWidth: 'calc((100vh - 200px) / 7)' }}
                    >
                      <img
                        src={`${SUPABASE_URL}/slike/${povedekItem.image}`}
                        alt={povedekItem.word}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                  
                  {/* PREDMET column */}
                  <div className="flex justify-center">
                    <div 
                      className={`aspect-square rounded overflow-hidden bg-background transition-all duration-300 ${
                        isPredmetSelected 
                          ? 'ring-2 ring-dragon-green scale-105' 
                          : ''
                      }`}
                      style={{ maxHeight: 'calc((100vh - 200px) / 7)', maxWidth: 'calc((100vh - 200px) / 7)' }}
                    >
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


      {/* Home menu button - bottom left */}
      <div className="fixed bottom-4 left-4 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg border-2 border-white/50 backdrop-blur-sm hover:scale-105 transition-transform">
              <Home className="w-8 h-8 text-white" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="ml-4 w-56 p-2 bg-white/95 border-2 border-orange-200 shadow-xl" 
            align="start" 
            side="top" 
            sideOffset={8}
          >
            <button onClick={handleBack} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-orange-50 rounded-lg transition-colors">
              <span className="text-xl">🏠</span>
              <span className="font-medium">Nazaj</span>
            </button>
            <button onClick={handleNewGame} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-orange-50 rounded-lg transition-colors">
              <span className="text-xl">🔄</span>
              <span className="font-medium">Nova igra</span>
            </button>
            <button onClick={() => setShowInstructions(true)} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-orange-50 rounded-lg transition-colors">
              <span className="text-xl">📖</span>
              <span className="font-medium">Navodila</span>
            </button>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* New game button - appears after star claimed */}
      {showNewGameButton && (
        <button
          onClick={handleNewGameDirect}
          className="fixed bottom-4 left-24 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 flex items-center justify-center shadow-lg border-2 border-white/50 backdrop-blur-sm hover:scale-105 transition-transform"
        >
          <RefreshCw className="h-7 w-7 text-white" />
        </button>
      )}

      {/* Dice roller modal */}
      <DiceRoller
        isVisible={showDice}
        currentStep={currentStep}
        onRollComplete={handleRollComplete}
      />

      {/* Result dialog */}
      <DiceResultDialog
        isOpen={showResult}
        onClose={closeResult}
        bitjeWord={selectedBitje !== null ? bitje[selectedBitje] : null}
        povedekWord={selectedPovedek !== null ? povedek[selectedPovedek] : null}
        predmetWord={selectedPredmet !== null ? predmet[selectedPredmet] : null}
      />

      {/* Star earned dialog */}
      <StarEarnedDialog
        isOpen={showStarDialog}
        onClaimStar={handleClaimStar}
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
    </div>
  );
}
