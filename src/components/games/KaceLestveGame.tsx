import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import { MemoryExitConfirmationDialog } from "@/components/games/MemoryExitConfirmationDialog";

import { KaceLestveBoard } from "@/components/games/KaceLestveBoard";
import { KaceLestveWordDialog } from "@/components/games/KaceLestveWordDialog";
import { KaceLestveSettingsModal } from "@/components/games/KaceLestveSettingsModal";
import { KaceLestveSuccessDialog } from "@/components/games/KaceLestveSuccessDialog";
import { DiceRoller } from "@/components/dice/DiceRoller";
import { InstructionsModal } from "@/components/puzzle/InstructionsModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  DRAGON_AVATARS,
} from "@/data/kaceLestveConfig";
import { useTrophyContext } from "@/contexts/TrophyContext";
import { useEnhancedProgress } from "@/hooks/useEnhancedProgress";

const SUPABASE_URL = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public";
const PLAYER_NAMES = ["ZMAJČEK 1", "ZMAJČEK 2"];
const DEFAULT_AVATARS = [DRAGON_AVATARS[0], DRAGON_AVATARS[1]];

interface GameState {
  positions: number[];
  currentPlayer: number;
  failedNearEndCount: number[];
  gameOver: boolean;
  winner: number | null;
  usedWordIndices: number[];
}

type GamePhase =
  | "settings"
  | "playing"
  | "rolling"
  | "word_challenge"
  | "snake_challenge"
  | "success";

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
  const [playerAvatars, setPlayerAvatars] = useState<string[]>(DEFAULT_AVATARS);
  const [showSettingsInGame, setShowSettingsInGame] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    positions: [0, 0],
    currentPlayer: 0,
    failedNearEndCount: [0, 0],
    gameOver: false,
    winner: null,
    usedWordIndices: [],
  });

  const [pendingMove, setPendingMove] = useState<number | null>(null);
  const [currentWord, setCurrentWord] = useState<KaceLestveWord | null>(null);
  const [showExitDialog, setShowExitDialog] = useState(false);
  
  // diceKey forces DiceRoller to remount each turn
  const [diceKey, setDiceKey] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);

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
    setDiceKey(k => k + 1);
  }, []);

  const handleStart = useCallback((
    numPlayers: KacePlayers,
    diff: KaceDifficulty,
    avatars: string[]
  ) => {
    setPlayers(numPlayers);
    setDifficulty(diff);
    setPlayerAvatars(avatars);
    setGameState({
      positions: [0, 0],
      currentPlayer: 0,
      failedNearEndCount: [0, 0],
      gameOver: false,
      winner: null,
      usedWordIndices: [],
    });
    setPhase("playing");
    setDiceKey(k => k + 1);
  }, []);

  const handleSettingsUpdate = useCallback((diff: KaceDifficulty) => {
    setDifficulty(diff);
    setShowSettingsInGame(false);
  }, []);

  // Called when DiceRoller finishes animation
  const handleDiceRollComplete = useCallback((result: number) => {
    setPhase("rolling"); // brief rolling phase (already in it visually)

    const currentPos = gameState.positions[gameState.currentPlayer];
    const squaresToEnd = BOARD_SIZE - currentPos;

    if (squaresToEnd <= SQUARES_NEAR_END) {
      const newFailCount = [...gameState.failedNearEndCount];
      const isExact = result === squaresToEnd;

      if (!isExact) {
        newFailCount[gameState.currentPlayer] += 1;
        const forcedWin = newFailCount[gameState.currentPlayer] >= MAX_FAILED_NEAR_END;
        setGameState(prev => ({ ...prev, failedNearEndCount: newFailCount }));

        if (forcedWin) {
          setTimeout(() => applyMove(BOARD_SIZE, result), 300);
        } else {
          setTimeout(() => nextPlayer(), 400);
        }
        return;
      }
    }

    const newPos = Math.min(currentPos + result, BOARD_SIZE);
    setTimeout(() => applyMove(newPos, result), 300);
  }, [gameState]);

  const applyMove = useCallback((newPosition: number, _diceVal: number) => {
    const { currentPlayer } = gameState;
    const newPositions = [...gameState.positions];
    newPositions[currentPlayer] = newPosition;

    if (newPosition >= BOARD_SIZE) {
      setGameState(prev => ({ ...prev, positions: newPositions, gameOver: true, winner: currentPlayer }));
      setPhase("success");
      return;
    }

    if (LADDERS[newPosition] !== undefined) {
      const ladderTop = Math.min(LADDERS[newPosition], BOARD_SIZE);
      newPositions[currentPlayer] = ladderTop;
      setGameState(prev => ({ ...prev, positions: newPositions }));

      if (ladderTop >= BOARD_SIZE) {
        setGameState(prev => ({ ...prev, gameOver: true, winner: currentPlayer }));
        setPhase("success");
        return;
      }

      const { word, index } = getRandomWord(gameState.usedWordIndices);
      setCurrentWord(word);
      setGameState(prev => ({ ...prev, positions: newPositions, usedWordIndices: [...prev.usedWordIndices.slice(-8), index] }));
      setPendingMove(ladderTop);
      setPhase("word_challenge");
      return;
    }

    if (SNAKES[newPosition] !== undefined) {
      const { word, index } = getRandomWord(gameState.usedWordIndices);
      setCurrentWord(word);
      setGameState(prev => ({ ...prev, positions: newPositions, usedWordIndices: [...prev.usedWordIndices.slice(-8), index] }));
      setPendingMove(newPosition);
      setPhase("snake_challenge");
      return;
    }

    setGameState(prev => ({ ...prev, positions: newPositions }));
    const { word, index } = getRandomWord(gameState.usedWordIndices);
    setCurrentWord(word);
    setGameState(prev => ({ ...prev, usedWordIndices: [...prev.usedWordIndices.slice(-8), index] }));
    setPendingMove(newPosition);
    setPhase("word_challenge");
  }, [gameState]);

  const nextPlayer = useCallback(() => {
    const next = players === 1 ? 0 : (gameState.currentPlayer + 1) % players;
    setGameState(prev => ({ ...prev, currentPlayer: next }));
    setPhase("playing");
    setCurrentWord(null);
    setPendingMove(null);
    setDiceKey(k => k + 1);
  }, [players, gameState.currentPlayer]);

  const handleWordResult = useCallback((accepted: boolean) => {
    const { currentPlayer } = gameState;
    const bonus = accepted ? DIFFICULTY_BONUS[difficulty] : 0;

    if (bonus > 0 && pendingMove !== null) {
      const bonusPos = Math.min(pendingMove + bonus, BOARD_SIZE);
      const newPositions = [...gameState.positions];
      newPositions[currentPlayer] = bonusPos;

      if (bonusPos >= BOARD_SIZE) {
        setGameState(prev => ({ ...prev, positions: newPositions, gameOver: true, winner: currentPlayer }));
        setPhase("success");
        return;
      }
      setGameState(prev => ({ ...prev, positions: newPositions }));
    }
    nextPlayer();
  }, [gameState, difficulty, pendingMove, nextPlayer]);

  const handleSnakeChallengeResult = useCallback((accepted: boolean) => {
    const { currentPlayer } = gameState;
    const newPositions = [...gameState.positions];

    if (!accepted && pendingMove !== null) {
      newPositions[currentPlayer] = SNAKES[pendingMove]!;
      setGameState(prev => ({ ...prev, positions: newPositions }));
    }
    nextPlayer();
  }, [gameState, pendingMove, nextPlayer]);

  const handleClaimStar = useCallback(async () => {
    recordExerciseCompletion("kace-lestve-c", 1, logopedistChildId);
    await new Promise(resolve => setTimeout(resolve, 500));
    await checkForNewTrophy();
  }, [recordExerciseCompletion, logopedistChildId, checkForNewTrophy]);

  const currentPlayerName = PLAYER_NAMES[gameState.currentPlayer];

  const playerData = Array.from({ length: players }, (_, i) => ({
    position: gameState.positions[i],
    avatarUrl: playerAvatars[i] || DRAGON_AVATARS[i],
    name: PLAYER_NAMES[i],
  }));

  const isPlaying = phase === "playing";

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
      {/* Settings modal (initial) */}
      <KaceLestveSettingsModal
        isOpen={phase === "settings"}
        isInGame={false}
        onStart={handleStart}
        onUpdateSettings={handleSettingsUpdate}
        currentDifficulty={difficulty}
        currentAvatars={playerAvatars}
      />

      {/* Settings modal (in-game: difficulty only) */}
      <KaceLestveSettingsModal
        isOpen={showSettingsInGame}
        isInGame={true}
        onStart={handleStart}
        onUpdateSettings={handleSettingsUpdate}
        currentDifficulty={difficulty}
        currentAvatars={playerAvatars}
      />

      {/* Board area + bottom bar */}
      <div className="h-full flex flex-col items-center justify-center p-2 gap-2">
        <div
          style={{
            aspectRatio: '6/7',
            flex: '1 1 0',
            maxHeight: 'calc(100vh - 120px)',
            maxWidth: 'calc(100vw - 16px)',
            minHeight: 0,
          }}
        >
          <KaceLestveBoard players={playerData} />
        </div>

        {/* Bottom bar: player indicator left, dice right */}
        {phase !== "settings" && (
          <div
            className="flex items-center justify-between w-full px-2"
            style={{ maxWidth: 'calc(min(100vw - 16px, calc((100vh - 120px) * 6 / 7)))' }}
          >
            {/* Player indicator */}
            <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg">
              <img
                src={`${SUPABASE_URL}/zmajcki/${playerAvatars[gameState.currentPlayer] || DRAGON_AVATARS[0]}`}
                alt={currentPlayerName}
                className="w-9 h-9 object-contain"
              />
              <span className="text-white font-black text-sm drop-shadow">
                {isPlaying ? `NA VRSTI: ${currentPlayerName}` : currentPlayerName}
              </span>
              {players === 2 && (
                <span className="text-white/60 text-xs">
                  #{gameState.positions[gameState.currentPlayer] || 'START'}
                </span>
              )}
            </div>

            {/* Dice roller inline */}
            <DiceRoller
              key={diceKey}
              isVisible={isPlaying}
              currentStep={0}
              onRollComplete={handleDiceRollComplete}
              inline={true}
            />
          </div>
        )}
      </div>

      {/* Bottom-left: unified Home dropdown menu */}
      <div className="fixed bottom-4 left-4 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg border-2 border-white/50 backdrop-blur-sm hover:scale-105 transition-transform"
            >
              <Home className="w-8 h-8 text-white" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="ml-4 w-56 p-2 bg-white/95 border-2 border-orange-200 shadow-xl rounded-xl"
            align="start"
            side="top"
            sideOffset={8}
          >
            <button
              onClick={() => setShowExitDialog(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-orange-50 transition-colors text-left text-gray-800"
            >
              <span className="text-xl">🏠</span><span className="font-medium">Nazaj</span>
            </button>
            {phase !== "settings" && (
              <button
                onClick={() => resetGame()}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-orange-50 transition-colors text-left text-gray-800"
              >
                <span className="text-xl">🔄</span><span className="font-medium">Nova igra</span>
              </button>
            )}
            <button
              onClick={() => setShowInstructions(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-orange-50 transition-colors text-left text-gray-800"
            >
              <span className="text-xl">📖</span><span className="font-medium">Navodila</span>
            </button>
            {phase !== "settings" && (
              <button
                onClick={() => setShowSettingsInGame(true)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-orange-50 transition-colors text-left text-gray-800"
              >
                <span className="text-xl">⚙️</span><span className="font-medium">Nastavitve</span>
              </button>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

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
        onClose={() => handleSnakeChallengeResult(false)}
      />

      {/* Success dialog */}
      <KaceLestveSuccessDialog
        isOpen={phase === "success"}
        winnerName={gameState.winner !== null ? PLAYER_NAMES[gameState.winner] : ""}
        onClaimStar={handleClaimStar}
        onNewGame={resetGame}
      />

      {/* Instructions modal */}
      <InstructionsModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
        type="kaceLestve"
      />

      {/* Exit dialog */}
      <MemoryExitConfirmationDialog
        open={showExitDialog}
        onOpenChange={setShowExitDialog}
        onConfirm={() => navigate(backPath)}
      >
        <span />
      </MemoryExitConfirmationDialog>
    </div>
  );
}
