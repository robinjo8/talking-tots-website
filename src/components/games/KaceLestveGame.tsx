import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home, RefreshCw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MemoryExitConfirmationDialog } from "@/components/games/MemoryExitConfirmationDialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { KaceLestveBoard } from "@/components/games/KaceLestveBoard";
import { KaceLestveWordDialog } from "@/components/games/KaceLestveWordDialog";
import { KaceLestveSettingsModal } from "@/components/games/KaceLestveSettingsModal";
import { KaceLestveSuccessDialog } from "@/components/games/KaceLestveSuccessDialog";
import {
  KaceDifficulty,
  KacePlayers,
  KaceLestveWord,
  LADDERS,
  SNAKES,
  DIFFICULTY_BONUS,
  BOARD_SIZE,
  SQUARES_NEAR_END,
  MAX_FAILED_NEAR_END,
  getRandomWord,
} from "@/data/kaceLestveConfig";
import { useTrophyContext } from "@/contexts/TrophyContext";
import { useEnhancedProgress } from "@/hooks/useEnhancedProgress";

const SUPABASE_URL = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public";

const PLAYER_COLORS = ["#3B82F6", "#EF4444"]; // blue, red
const PLAYER_NAMES = ["IGRALEC 1", "IGRALEC 2"];

interface GameState {
  positions: number[]; // position for each player (0 = not started)
  currentPlayer: number;
  failedNearEndCount: number[]; // per player
  gameOver: boolean;
  winner: number | null;
  usedWordIndices: number[];
}

type GamePhase =
  | "settings"       // show settings modal
  | "playing"        // main game, waiting for dice
  | "rolling"        // dice animation
  | "word_challenge" // word dialog open (normal square)
  | "snake_challenge"// word dialog open (on snake head)
  | "success";       // game over

function DiceFace({ number }: { number: number }) {
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
      <rect x="5" y="5" width="90" height="90" rx="15" fill="white" stroke="#374151" strokeWidth="3" />
      {dotPositions[number]?.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="8" fill="#374151" />
      ))}
    </svg>
  );
}

interface KaceLestveGameProps {
  backPath?: string;
  childId?: string;
  logopedistChildId?: string;
}

export function KaceLestveGame({
  backPath = "/govorne-igre/kace",
  childId,
  logopedistChildId,
}: KaceLestveGameProps) {
  const navigate = useNavigate();
  const { checkForNewTrophy } = useTrophyContext();
  const { recordExerciseCompletion } = useEnhancedProgress();

  const [phase, setPhase] = useState<GamePhase>("settings");
  const [players, setPlayers] = useState<KacePlayers>(1);
  const [difficulty, setDifficulty] = useState<KaceDifficulty>("srednja");
  const [gameState, setGameState] = useState<GameState>({
    positions: [0, 0],
    currentPlayer: 0,
    failedNearEndCount: [0, 0],
    gameOver: false,
    winner: null,
    usedWordIndices: [],
  });

  // Dice state
  const [diceValue, setDiceValue] = useState<number>(1);
  const [isRolling, setIsRolling] = useState(false);
  const [pendingMove, setPendingMove] = useState<number | null>(null); // position after dice
  const rollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Word challenge state
  const [currentWord, setCurrentWord] = useState<KaceLestveWord | null>(null);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showNewGameDialog, setShowNewGameDialog] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const resetGame = useCallback(() => {
    setGameState({
      positions: [0, 0],
      currentPlayer: 0,
      failedNearEndCount: [0, 0],
      gameOver: false,
      winner: null,
      usedWordIndices: [],
    });
    setPhase("settings");
    setCurrentWord(null);
    setPendingMove(null);
    setIsRolling(false);
  }, []);

  const handleStart = useCallback((numPlayers: KacePlayers, diff: KaceDifficulty) => {
    setPlayers(numPlayers);
    setDifficulty(diff);
    setGameState({
      positions: [0, 0],
      currentPlayer: 0,
      failedNearEndCount: [0, 0],
      gameOver: false,
      winner: null,
      usedWordIndices: [],
    });
    setPhase("playing");
  }, []);

  // Roll the dice
  const handleRollDice = useCallback(() => {
    if (phase !== "playing" || isRolling) return;

    setIsRolling(true);
    setPhase("rolling");

    let tick = 0;
    rollIntervalRef.current = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      tick++;
      if (tick >= 12) {
        clearInterval(rollIntervalRef.current!);
        const finalValue = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalValue);
        setIsRolling(false);

        // Apply end-game rule
        const currentPos = gameState.positions[gameState.currentPlayer];
        const squaresToEnd = BOARD_SIZE - currentPos;

        if (squaresToEnd <= SQUARES_NEAR_END) {
          const newFailCount = [...gameState.failedNearEndCount];
          const isExact = finalValue === squaresToEnd;

          if (!isExact) {
            newFailCount[gameState.currentPlayer] += 1;
            const forcedWin = newFailCount[gameState.currentPlayer] >= MAX_FAILED_NEAR_END;

            setGameState(prev => ({ ...prev, failedNearEndCount: newFailCount }));

            if (forcedWin) {
              // Force move to end
              setTimeout(() => applyMove(BOARD_SIZE, finalValue), 400);
            } else {
              // Skip turn
              setTimeout(() => nextPlayer(), 600);
            }
            return;
          }
        }

        // Normal move
        const newPos = Math.min(currentPos + finalValue, BOARD_SIZE);
        setTimeout(() => applyMove(newPos, finalValue), 400);
      }
    }, 80);
  }, [phase, isRolling, gameState]);

  const applyMove = useCallback((newPosition: number, _diceVal: number) => {
    const { currentPlayer } = gameState;
    const newPositions = [...gameState.positions];
    newPositions[currentPlayer] = newPosition;

    // Check win
    if (newPosition >= BOARD_SIZE) {
      setGameState(prev => ({
        ...prev,
        positions: newPositions,
        gameOver: true,
        winner: currentPlayer,
      }));
      setPhase("success");
      return;
    }

    // Check ladder
    if (LADDERS[newPosition] !== undefined) {
      const ladderTop = LADDERS[newPosition];
      const afterLadder = Math.min(ladderTop, BOARD_SIZE);
      newPositions[currentPlayer] = afterLadder;

      setGameState(prev => ({
        ...prev,
        positions: newPositions,
      }));

      if (afterLadder >= BOARD_SIZE) {
        setGameState(prev => ({ ...prev, gameOver: true, winner: currentPlayer }));
        setPhase("success");
        return;
      }

      // After ladder, show word challenge
      const { word, index } = getRandomWord(gameState.usedWordIndices);
      setCurrentWord(word);
      setGameState(prev => ({
        ...prev,
        positions: newPositions,
        usedWordIndices: [...prev.usedWordIndices.slice(-8), index],
      }));
      setPendingMove(afterLadder);
      setPhase("word_challenge");
      return;
    }

    // Check snake head
    if (SNAKES[newPosition] !== undefined) {
      // Show snake challenge - correct = stay, wrong = slide down
      const { word, index } = getRandomWord(gameState.usedWordIndices);
      setCurrentWord(word);
      setGameState(prev => ({
        ...prev,
        positions: newPositions,
        usedWordIndices: [...prev.usedWordIndices.slice(-8), index],
      }));
      setPendingMove(newPosition);
      setPhase("snake_challenge");
      return;
    }

    // Normal square - show word challenge
    setGameState(prev => ({ ...prev, positions: newPositions }));
    const { word, index } = getRandomWord(gameState.usedWordIndices);
    setCurrentWord(word);
    setGameState(prev => ({
      ...prev,
      usedWordIndices: [...prev.usedWordIndices.slice(-8), index],
    }));
    setPendingMove(newPosition);
    setPhase("word_challenge");
  }, [gameState]);

  const nextPlayer = useCallback(() => {
    const next = players === 1 ? 0 : (gameState.currentPlayer + 1) % players;
    setGameState(prev => ({ ...prev, currentPlayer: next }));
    setPhase("playing");
    setCurrentWord(null);
    setPendingMove(null);
  }, [players, gameState.currentPlayer]);

  // Handle word result (normal challenge)
  const handleWordResult = useCallback((accepted: boolean) => {
    const { currentPlayer } = gameState;
    const bonus = accepted ? DIFFICULTY_BONUS[difficulty] : 0;

    if (bonus > 0 && pendingMove !== null) {
      const bonusPos = Math.min(pendingMove + bonus, BOARD_SIZE);
      const newPositions = [...gameState.positions];
      newPositions[currentPlayer] = bonusPos;

      if (bonusPos >= BOARD_SIZE) {
        setGameState(prev => ({
          ...prev,
          positions: newPositions,
          gameOver: true,
          winner: currentPlayer,
        }));
        setPhase("success");
        return;
      }
      setGameState(prev => ({ ...prev, positions: newPositions }));
    }

    nextPlayer();
  }, [gameState, difficulty, pendingMove, nextPlayer]);

  // Handle snake challenge result
  const handleSnakeChallengeResult = useCallback((accepted: boolean) => {
    const { currentPlayer } = gameState;
    const newPositions = [...gameState.positions];

    if (!accepted && pendingMove !== null) {
      // Slide down the snake
      newPositions[currentPlayer] = SNAKES[pendingMove]!;
      setGameState(prev => ({ ...prev, positions: newPositions }));
    }
    // If accepted, stay on snake head (position already set)

    nextPlayer();
  }, [gameState, pendingMove, nextPlayer]);

  // Star claim
  const handleClaimStar = useCallback(async () => {
    recordExerciseCompletion("kace-lestve-c", 1, logopedistChildId);
    await new Promise(resolve => setTimeout(resolve, 500));
    await checkForNewTrophy();
  }, [recordExerciseCompletion, logopedistChildId, checkForNewTrophy]);

  const handleBack = () => { setMenuOpen(false); setShowExitDialog(true); };
  const handleConfirmExit = () => navigate(backPath);
  const handleNewGame = () => { setMenuOpen(false); setShowNewGameDialog(true); };
  const handleConfirmNewGame = () => { setShowNewGameDialog(false); resetGame(); };

  const currentPos = gameState.positions[gameState.currentPlayer];
  const currentPlayerName = PLAYER_NAMES[gameState.currentPlayer];

  const playerData = Array.from({ length: players }, (_, i) => ({
    position: gameState.positions[i],
    color: PLAYER_COLORS[i],
    name: PLAYER_NAMES[i],
  }));

  return (
    <div
      className="fixed inset-0 overflow-hidden select-none"
      style={{
        backgroundImage: `url(${SUPABASE_URL}/ozadja/zeleno_ozadje.webp)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Settings modal */}
      <KaceLestveSettingsModal
        isOpen={phase === "settings"}
        onStart={handleStart}
      />

      {/* Main layout */}
      <div className="h-full flex flex-col md:flex-row items-center justify-center gap-4 p-3 pt-4">

        {/* Left panel - player info */}
        <div className="flex md:flex-col gap-3 md:w-48 shrink-0">
          {Array.from({ length: players }, (_, i) => (
            <div
              key={i}
              className={`rounded-xl p-3 text-center border-2 shadow-lg transition-all ${
                gameState.currentPlayer === i && phase === "playing"
                  ? "border-yellow-400 bg-white/95 scale-105"
                  : "border-white/40 bg-white/70"
              }`}
            >
              <div
                className="w-8 h-8 rounded-full mx-auto mb-1 border-2 border-white shadow flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: PLAYER_COLORS[i] }}
              >
                {i + 1}
              </div>
              <p className="text-xs font-bold text-gray-800">{PLAYER_NAMES[i]}</p>
              <p className="text-lg font-black text-gray-900">
                {gameState.positions[i] <= 0 ? "START" : gameState.positions[i] >= 64 ? "KONEC" : `#${gameState.positions[i]}`}
              </p>
            </div>
          ))}
        </div>

        {/* Board - main area */}
        <div className="flex-1 flex items-center justify-center" style={{ maxWidth: "min(90vw, 90vh - 120px)", maxHeight: "calc(100vh - 120px)" }}>
          <div className="w-full h-full" style={{ aspectRatio: "1/1", maxHeight: "calc(100vh - 120px)", maxWidth: "calc(100vw - 220px)" }}>
            <KaceLestveBoard players={playerData} />
          </div>
        </div>

        {/* Right panel - dice */}
        <div className="flex md:flex-col items-center gap-4 md:w-40 shrink-0">
          {/* Dice display */}
          <div className="w-20 h-20 md:w-28 md:h-28 drop-shadow-xl">
            <DiceFace number={diceValue} />
          </div>

          {/* Current player indicator */}
          {phase === "playing" && (
            <div className="text-center">
              <p className="text-white/80 text-xs font-medium">NA VRSTI:</p>
              <p
                className="text-sm font-black text-white drop-shadow"
                style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}
              >
                {currentPlayerName}
              </p>
            </div>
          )}

          {/* Roll button */}
          {(phase === "playing") && (
            <button
              onClick={handleRollDice}
              className="bg-yellow-400 hover:bg-yellow-500 active:scale-95 text-gray-900 font-black rounded-2xl px-4 py-3 shadow-xl text-sm md:text-base transition-all border-b-4 border-yellow-600"
            >
              🎲 VRŽI!
            </button>
          )}

          {phase === "rolling" && (
            <div className="text-white font-bold text-sm animate-pulse">Vrtim...</div>
          )}
        </div>
      </div>

      {/* Home menu */}
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <button className="fixed bottom-4 left-4 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg border-2 border-white/50 hover:scale-105 transition-transform">
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
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Word challenge dialog */}
      <KaceLestveWordDialog
        isOpen={phase === "word_challenge"}
        word={currentWord}
        isSnakeChallenge={false}
        playerName={currentPlayerName}
        difficulty={difficulty}
        childId={childId}
        logopedistChildId={logopedistChildId}
        onResult={handleWordResult}
        onClose={nextPlayer}
      />

      {/* Snake challenge dialog */}
      <KaceLestveWordDialog
        isOpen={phase === "snake_challenge"}
        word={currentWord}
        isSnakeChallenge={true}
        playerName={currentPlayerName}
        difficulty={difficulty}
        childId={childId}
        logopedistChildId={logopedistChildId}
        onResult={handleSnakeChallengeResult}
        onClose={() => {
          // Wrong answer on snake - slide down
          handleSnakeChallengeResult(false);
        }}
      />

      {/* Success dialog */}
      <KaceLestveSuccessDialog
        isOpen={phase === "success"}
        winnerName={gameState.winner !== null ? PLAYER_NAMES[gameState.winner] : ""}
        onClaimStar={handleClaimStar}
        onNewGame={resetGame}
      />

      {/* Exit dialog */}
      <MemoryExitConfirmationDialog
        open={showExitDialog}
        onOpenChange={setShowExitDialog}
        onConfirm={handleConfirmExit}
      >
        <span />
      </MemoryExitConfirmationDialog>

      {/* New game dialog */}
      <ConfirmDialog
        open={showNewGameDialog}
        onOpenChange={setShowNewGameDialog}
        onConfirm={handleConfirmNewGame}
        title="Nova igra"
        description="Ali res želiš začeti novo igro? Napredek bo izgubljen."
      />
    </div>
  );
}
